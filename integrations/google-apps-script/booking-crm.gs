/** @OnlyCurrentDoc */
const BOOKING_SHEET_NAME_ = 'Richieste dal sito';
const BOOKING_LOG_SHEET_NAME_ = '_Log integrazione';
const BOOKING_RECORD_TYPES_ = Object.freeze(['REALE', 'TEST']);
const BOOKING_PROVENANCE_ = Object.freeze([
  'Google organico',
  'Google Ads',
  'Google Maps',
  'Diretto',
  'Altro',
  'Non rilevata',
]);

const BOOKING_HEADERS_ = Object.freeze([
  'Data e ora richiesta',
  'Nome e cognome',
  'Telefono',
  'Email',
  'Città / sede',
  'Servizio richiesto',
  'Provenienza lead',
  'Campagna Google Ads (nome/ID)',
  'Gruppo annunci Google Ads (ID)',
  'Annuncio Google Ads (ID)',
  'Parola chiave',
  'Pagina di ingresso',
  'Pagina di invio',
  'Giorni e orari preferiti',
  'Messaggio',
  'Esito',
  'Contattato',
  'Tentativi di contatto',
  'Data e ora ultimo contatto',
  'Comunicazioni',
  'Prossimo richiamo',
  'Appuntamento confermato',
  'Esito appuntamento',
  'Preventivo presentato',
  'Preventivo accettato',
  'Trattamento iniziato',
  'Note segreteria',
  'Tipo record',
  'ID richiesta',
]);

// Consente di distribuire il webhook prima della riorganizzazione del foglio
// senza interrompere la ricezione delle richieste durante il passaggio.
const BOOKING_LEGACY_HEADERS_ = Object.freeze([
  'Data e ora richiesta',
  'Nome e cognome',
  'Telefono',
  'Email',
  'Sede richiesta',
  'Servizio richiesto',
  'Giorni e orari preferiti',
  'Messaggio',
  'Provenienza',
  'Pagina di invio',
  'Campagna pubblicitaria',
  'Chiamato',
  'Tentativi di chiamata',
  'Ultimo tentativo',
  'Esito del contatto',
  'Prossimo richiamo',
  'Appuntamento confermato',
  'Esito appuntamento',
  'Preventivo presentato',
  'Preventivo accettato',
  'Trattamento iniziato',
  'Note segreteria',
  'Tipo record',
  'ID richiesta',
]);

const BOOKING_LOG_HEADERS_ = Object.freeze([
  'Data e ora',
  'Stato',
  'ID richiesta',
  'Dettaglio',
]);

function doPost(event) {
  let requestId = '';
  let spreadsheet = null;
  let lock;
  try {
    const payload = JSON.parse(event && event.postData && event.postData.contents || '');
    requestId = typeof payload.requestId === 'string' ? payload.requestId : '';
    validatePayload_(payload);

    const properties = PropertiesService.getScriptProperties();
    const expectedSecret =
      properties.getProperty('WEBHOOK_SECRET') ||
      properties.getProperty('BOOKING_WEBHOOK_SECRET');
    if (!expectedSecret || !secureEquals_(payload.secret, expectedSecret)) {
      throw new Error('Autorizzazione non valida.');
    }

    spreadsheet = openSpreadsheet_(properties);
    lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) throw new Error('Integrazione temporaneamente occupata.');

    const sheet = spreadsheet.getSheetByName(BOOKING_SHEET_NAME_);
    if (!sheet) throw new Error('Scheda richieste non trovata.');
    const schema = detectSchema_(sheet);

    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const existing = sheet
        .getRange(2, schema.idColumn, lastRow - 1, 1)
        .createTextFinder(payload.requestId)
        .matchCase(true)
        .matchEntireCell(true)
        .findNext();
      if (existing) {
        appendIntegrationLog_(spreadsheet, 'DUPLICATO', payload.requestId, 'Richiesta già presente; nessuna nuova riga creata.');
        return jsonResponse_({ ok: true, requestId: payload.requestId, duplicate: true });
      }
    }

    const row = schema.version === 'current'
      ? mapPayloadToRow_(payload, new Date())
      : mapPayloadToLegacyRow_(payload, new Date());
    sheet.appendRow(row);
    const insertedRow = sheet.getLastRow();
    copyRowRules_(sheet, insertedRow, schema.width);
    formatInsertedRow_(sheet, insertedRow, schema.version);
    SpreadsheetApp.flush();
    appendIntegrationLog_(spreadsheet, 'OK', payload.requestId, `Riga ${insertedRow} creata come ${payload.recordType}.`);
    return jsonResponse_({ ok: true, requestId: payload.requestId, duplicate: false });
  } catch (error) {
    try {
      if (spreadsheet) appendIntegrationLog_(spreadsheet, 'ERRORE', requestId, safeErrorMessage_(error));
    } catch (_logError) {
      // Il log non deve mascherare la risposta del webhook.
    }
    return jsonResponse_({ ok: false, requestId: requestId || null, duplicate: false });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

function doGet() {
  const properties = PropertiesService.getScriptProperties();
  let sheetReady = false;
  try {
    const spreadsheet = openSpreadsheet_(properties);
    sheetReady = !!spreadsheet.getSheetByName(BOOKING_SHEET_NAME_);
  } catch (_error) {
    sheetReady = false;
  }
  return jsonResponse_({
    ok: true,
    service: 'federzoni-granata-leads',
    sheetReady,
    secretConfigured: !!(
      properties.getProperty('WEBHOOK_SECRET') ||
      properties.getProperty('BOOKING_WEBHOOK_SECRET')
    ),
  });
}

function openSpreadsheet_(properties) {
  const spreadsheetId =
    properties.getProperty('SPREADSHEET_ID') ||
    properties.getProperty('BOOKING_SPREADSHEET_ID');
  const spreadsheet = spreadsheetId
    ? SpreadsheetApp.openById(spreadsheetId)
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('Foglio non configurato.');
  return spreadsheet;
}

function validatePayload_(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) throw new Error('Payload non valido.');
  if (typeof payload.secret !== 'string' || payload.secret.length < 32) throw new Error('Segreto non valido.');
  if (typeof payload.requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(payload.requestId)) {
    throw new Error('ID richiesta non valido.');
  }
  if (BOOKING_RECORD_TYPES_.indexOf(payload.recordType) === -1) throw new Error('Tipo record non valido.');
  if (BOOKING_PROVENANCE_.indexOf(payload.provenienza) === -1) throw new Error('Provenienza non valida.');

  const fields = {
    nomeCognome: 120,
    telefono: 30,
    email: 254,
    sede: 254,
    servizio: 254,
    giorniPreferiti: 1024,
    orariPreferiti: 254,
    messaggio: 3000,
    pagina: 500,
    paginaIngresso: 500,
    campagna: 300,
    idCampagna: 64,
    idGruppoAnnunci: 64,
    idAnnuncio: 64,
    parolaChiave: 300,
  };
  Object.keys(fields).forEach((key) => {
    const value = payload[key] == null ? '' : payload[key];
    if (typeof value !== 'string' || value.length > fields[key] || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) {
      throw new Error('Campo non valido.');
    }
    payload[key] = value;
  });
  if (payload.nomeCognome.length < 2 || payload.telefono.replace(/\D/g, '').length < 6) throw new Error('Recapiti non validi.');
  [payload.pagina, payload.paginaIngresso].forEach((page) => {
    if (page && (!page.startsWith('/') || page.startsWith('//') || /[?#]/.test(page))) throw new Error('Pagina non valida.');
  });
}

function detectSchema_(sheet) {
  if (sheet.getLastColumn() >= BOOKING_HEADERS_.length && headersMatch_(sheet, BOOKING_HEADERS_)) {
    return { version: 'current', width: BOOKING_HEADERS_.length, idColumn: BOOKING_HEADERS_.length };
  }
  if (sheet.getLastColumn() >= BOOKING_LEGACY_HEADERS_.length && headersMatch_(sheet, BOOKING_LEGACY_HEADERS_)) {
    return { version: 'legacy', width: BOOKING_LEGACY_HEADERS_.length, idColumn: BOOKING_LEGACY_HEADERS_.length };
  }
  throw new Error('Intestazioni foglio non valide.');
}

function headersMatch_(sheet, expected) {
  const actual = sheet.getRange(1, 1, 1, expected.length).getDisplayValues()[0];
  return !actual.some((value, index) => value !== expected[index]);
}

function verifyHeaders_(sheet, expected) {
  if (sheet.getLastColumn() < expected.length || !headersMatch_(sheet, expected)) {
    throw new Error('Intestazioni foglio non valide.');
  }
}

function formatPreferences_(payload) {
  return [
    payload.giorniPreferiti ? `Giorni/disponibilità: ${payload.giorniPreferiti}` : '',
    payload.orariPreferiti ? `Orari: ${payload.orariPreferiti}` : '',
  ].filter(Boolean).join('\n');
}

function campaignLabel_(payload) {
  const campaign = payload.campagna.trim();
  const campaignId = payload.idCampagna.trim();
  if (campaign && campaignId && campaign !== campaignId) return `${campaign} (${campaignId})`;
  return campaign || campaignId;
}

function mapPayloadToRow_(payload, receivedAt) {
  const isTest = payload.recordType === 'TEST';
  return [
    receivedAt,
    payload.nomeCognome,
    payload.telefono,
    payload.email,
    payload.sede,
    payload.servizio,
    payload.provenienza,
    campaignLabel_(payload),
    payload.idGruppoAnnunci,
    payload.idAnnuncio,
    payload.parolaChiave,
    payload.paginaIngresso,
    payload.pagina,
    formatPreferences_(payload),
    payload.messaggio,
    'Da chiamare',
    isTest ? 'Sì' : 'No',
    0,
    '',
    '',
    '',
    '',
    'In attesa',
    'Da verificare',
    'In attesa',
    'Da verificare',
    isTest ? 'TEST – non contattare' : '',
    payload.recordType,
    payload.requestId,
  ].map(sanitizeCell_);
}

function mapPayloadToLegacyRow_(payload, receivedAt) {
  const isTest = payload.recordType === 'TEST';
  return [
    receivedAt,
    payload.nomeCognome,
    payload.telefono,
    payload.email,
    payload.sede,
    payload.servizio,
    formatPreferences_(payload),
    payload.messaggio,
    payload.provenienza,
    payload.pagina,
    campaignLabel_(payload),
    isTest ? 'Sì' : 'No',
    0,
    '',
    'Da chiamare',
    '',
    '',
    'In attesa',
    'Da verificare',
    'In attesa',
    'Da verificare',
    isTest ? 'TEST – non contattare' : '',
    payload.recordType,
    payload.requestId,
  ].map(sanitizeCell_);
}

function copyRowRules_(sheet, insertedRow, width) {
  if (insertedRow <= 2) return;
  const template = sheet.getRange(2, 1, 1, width);
  const target = sheet.getRange(insertedRow, 1, 1, width);
  if (typeof template.copyTo === 'function' && SpreadsheetApp.CopyPasteType) {
    template.copyTo(target, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
  }
  if (typeof template.getDataValidations === 'function' && typeof target.setDataValidations === 'function') {
    target.setDataValidations(template.getDataValidations());
  }
}

function formatInsertedRow_(sheet, insertedRow, version) {
  sheet.getRange(insertedRow, 1).setNumberFormat('dd/mm/yyyy hh:mm');
  sheet.getRange(insertedRow, 3).setNumberFormat('@');
  const dateColumns = version === 'current' ? [19, 21, 22] : [14, 16, 17];
  dateColumns.forEach((column) => sheet.getRange(insertedRow, column).setNumberFormat('dd/mm/yyyy hh:mm'));
}

function appendIntegrationLog_(spreadsheet, status, requestId, detail) {
  let logSheet = spreadsheet.getSheetByName(BOOKING_LOG_SHEET_NAME_);
  if (!logSheet) {
    logSheet = spreadsheet.insertSheet(BOOKING_LOG_SHEET_NAME_);
    logSheet.getRange(1, 1, 1, BOOKING_LOG_HEADERS_.length).setValues([BOOKING_LOG_HEADERS_]);
    logSheet.setFrozenRows(1);
    logSheet.hideSheet();
  }
  verifyHeaders_(logSheet, BOOKING_LOG_HEADERS_);
  logSheet.appendRow([new Date(), status, requestId || '', detail]);
  const row = logSheet.getLastRow();
  logSheet.getRange(row, 1).setNumberFormat('dd/mm/yyyy hh:mm:ss');
}

function sanitizeCell_(value) {
  if (typeof value !== 'string') return value;
  return /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
}

function secureEquals_(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string') return false;
  let difference = left.length ^ right.length;
  const length = Math.max(left.length, right.length);
  for (let index = 0; index < length; index += 1) {
    difference |= (left.charCodeAt(index) || 0) ^ (right.charCodeAt(index) || 0);
  }
  return difference === 0;
}

function safeErrorMessage_(error) {
  const allowed = new Set([
    'Payload non valido.',
    'Segreto non valido.',
    'ID richiesta non valido.',
    'Tipo record non valido.',
    'Provenienza non valida.',
    'Campo non valido.',
    'Recapiti non validi.',
    'Pagina non valida.',
    'Autorizzazione non valida.',
    'Foglio non configurato.',
    'Integrazione temporaneamente occupata.',
    'Scheda richieste non trovata.',
    'Intestazioni foglio non valide.',
  ]);
  return error && allowed.has(error.message) ? error.message : 'Errore interno del webhook.';
}

function jsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
