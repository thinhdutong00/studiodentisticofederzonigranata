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
    verifyHeaders_(sheet, BOOKING_HEADERS_);

    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const existing = sheet
        .getRange(2, BOOKING_HEADERS_.length, lastRow - 1, 1)
        .createTextFinder(payload.requestId)
        .matchCase(true)
        .matchEntireCell(true)
        .findNext();
      if (existing) {
        appendIntegrationLog_(spreadsheet, 'DUPLICATO', payload.requestId, 'Richiesta già presente; nessuna nuova riga creata.');
        return jsonResponse_({ ok: true, requestId: payload.requestId, duplicate: true });
      }
    }

    sheet.appendRow(mapPayloadToRow_(payload, new Date()));
    const insertedRow = sheet.getLastRow();
    copyRowRules_(sheet, insertedRow);
    sheet.getRange(insertedRow, 1).setNumberFormat('dd/mm/yyyy hh:mm');
    sheet.getRange(insertedRow, 14).setNumberFormat('dd/mm/yyyy hh:mm');
    sheet.getRange(insertedRow, 16).setNumberFormat('dd/mm/yyyy hh:mm');
    sheet.getRange(insertedRow, 17).setNumberFormat('dd/mm/yyyy hh:mm');
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
    campagna: 300,
  };
  Object.keys(fields).forEach((key) => {
    const value = payload[key];
    if (typeof value !== 'string' || value.length > fields[key] || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) {
      throw new Error('Campo non valido.');
    }
  });
  if (payload.nomeCognome.length < 2 || payload.telefono.replace(/\D/g, '').length < 6) throw new Error('Recapiti non validi.');
  if (payload.pagina && (!payload.pagina.startsWith('/') || payload.pagina.startsWith('//') || /[?#]/.test(payload.pagina))) {
    throw new Error('Pagina non valida.');
  }
}

function verifyHeaders_(sheet, expected) {
  if (sheet.getLastColumn() < expected.length) throw new Error('Schema foglio non valido.');
  const actual = sheet.getRange(1, 1, 1, expected.length).getDisplayValues()[0];
  if (actual.some((value, index) => value !== expected[index])) throw new Error('Intestazioni foglio non valide.');
}

function formatPreferences_(payload) {
  return [
    payload.giorniPreferiti ? `Giorni/disponibilità: ${payload.giorniPreferiti}` : '',
    payload.orariPreferiti ? `Orari: ${payload.orariPreferiti}` : '',
  ].filter(Boolean).join('\n');
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
    formatPreferences_(payload),
    payload.messaggio,
    payload.provenienza,
    payload.pagina,
    payload.campagna,
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

function copyRowRules_(sheet, insertedRow) {
  if (insertedRow <= 2) return;
  const template = sheet.getRange(2, 1, 1, BOOKING_HEADERS_.length);
  const target = sheet.getRange(insertedRow, 1, 1, BOOKING_HEADERS_.length);
  if (typeof template.copyTo === 'function' && SpreadsheetApp.CopyPasteType) {
    template.copyTo(target, SpreadsheetApp.CopyPasteType.PASTE_FORMAT, false);
  }
  if (typeof template.getDataValidations === 'function' && typeof target.setDataValidations === 'function') {
    target.setDataValidations(template.getDataValidations());
  }
}

function appendIntegrationLog_(spreadsheet, status, requestId, detail) {
  const logSheet = spreadsheet.getSheetByName(BOOKING_LOG_SHEET_NAME_);
  if (!logSheet) return;
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
    'Schema foglio non valido.',
    'Intestazioni foglio non valide.',
  ]);
  return error && allowed.has(error.message) ? error.message : 'Errore interno del webhook.';
}

function jsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
