const CRM_SCHEMA_VERSION_ = 1;
const CRM_SHEET_NAME_ = 'CRM richieste';
const CRM_DEFAULT_STATUS_ = 'Nuovo';
const CRM_KIND_LABELS_ = Object.freeze({
  'first-visit': 'Prima visita',
  urgent: 'Urgenza',
  treatment: 'Valutazione di un trattamento',
  contact: 'Informazioni',
  callback: 'Richiesta di richiamata',
});

const CRM_HEADERS_ = Object.freeze([
  'Ricevuta il',
  'Stato',
  'Nome e cognome',
  'Telefono',
  'Email',
  'Tipo richiesta',
  'Sede',
  'Operatore',
  'Ultimo contatto',
  'Prossimo ricontatto',
  'Data appuntamento',
  'Ora appuntamento',
  'Note segreteria',
  'Fascia di età',
  'Giorni preferiti',
  'Orari preferiti',
  'Trattamento',
  'Categoria',
  'Motivo richiesta',
  'Preferenza iniziale',
  'Motivo prima visita',
  'Obiettivo visita',
  'Disponibilità',
  'Tipo urgenza',
  'Sintomi',
  'Dolore 0–10',
  'Altri sintomi/informazioni',
  'Altra esigenza',
  'Note dal paziente',
  'Messaggio',
  'Dettagli',
  'Pagina di provenienza',
  'Consenso privacy',
  'Conferma preferenze',
  'ID richiesta',
]);

function doPost(event) {
  let requestId = '';
  let lock;
  try {
    const envelope = JSON.parse(event && event.postData && event.postData.contents || '');
    requestId = typeof envelope.requestId === 'string' ? envelope.requestId : '';
    validateEnvelope_(envelope);

    const properties = PropertiesService.getScriptProperties();
    const expectedSecret = properties.getProperty('BOOKING_WEBHOOK_SECRET');
    const spreadsheetId = properties.getProperty('BOOKING_SPREADSHEET_ID');
    if (!expectedSecret || !spreadsheetId || !secureEquals_(envelope.secret, expectedSecret)) {
      throw new Error('Configurazione o autorizzazione non valida.');
    }

    lock = LockService.getScriptLock();
    if (!lock.tryLock(10000)) throw new Error('CRM temporaneamente occupato.');

    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const sheet = spreadsheet.getSheetByName(CRM_SHEET_NAME_);
    if (!sheet) throw new Error('Scheda CRM non trovata.');
    verifyHeaders_(sheet);

    const lastRow = sheet.getLastRow();
    if (lastRow > 1) {
      const existing = sheet
        .getRange(2, CRM_HEADERS_.length, lastRow - 1, 1)
        .createTextFinder(envelope.requestId)
        .matchCase(true)
        .matchEntireCell(true)
        .findNext();
      if (existing) return jsonResponse_({ ok: true, requestId: envelope.requestId, duplicate: true });
    }

    sheet.appendRow(mapRequestToRow_(envelope));
    const insertedRow = sheet.getLastRow();
    sheet.getRange(insertedRow, 1).setNumberFormat('dd/mm/yyyy hh:mm');
    sheet.getRange(insertedRow, 9, 1, 3).setNumberFormat('dd/mm/yyyy');
    sheet.getRange(insertedRow, 12).setNumberFormat('hh:mm');
    SpreadsheetApp.flush();
    return jsonResponse_({ ok: true, requestId: envelope.requestId, duplicate: false });
  } catch (_error) {
    return jsonResponse_({ ok: false, requestId: requestId || null, duplicate: false });
  } finally {
    if (lock && lock.hasLock()) lock.releaseLock();
  }
}

function validateEnvelope_(envelope) {
  if (!envelope || typeof envelope !== 'object' || Array.isArray(envelope)) throw new Error('Payload non valido.');
  if (envelope.schemaVersion !== CRM_SCHEMA_VERSION_) throw new Error('Versione non valida.');
  if (typeof envelope.secret !== 'string' || envelope.secret.length < 32) throw new Error('Segreto non valido.');
  if (typeof envelope.requestId !== 'string' || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(envelope.requestId)) {
    throw new Error('ID richiesta non valido.');
  }
  if (!Object.prototype.hasOwnProperty.call(CRM_KIND_LABELS_, envelope.kind)) throw new Error('Tipo richiesta non valido.');
  if (!envelope.fields || typeof envelope.fields !== 'object' || Array.isArray(envelope.fields)) throw new Error('Campi non validi.');
  const receivedAt = new Date(envelope.receivedAt);
  if (typeof envelope.receivedAt !== 'string' || !Number.isFinite(receivedAt.getTime()) || receivedAt.toISOString() !== envelope.receivedAt) {
    throw new Error('Data ricezione non valida.');
  }
  if (envelope.fields.privacyConsent !== true) throw new Error('Consenso non valido.');
  if (envelope.kind === 'treatment' && envelope.fields.scheduleAcknowledged !== true) throw new Error('Conferma preferenze non valida.');
}

function verifyHeaders_(sheet) {
  if (sheet.getLastColumn() !== CRM_HEADERS_.length) throw new Error('Schema CRM non valido.');
  const actual = sheet.getRange(1, 1, 1, CRM_HEADERS_.length).getDisplayValues()[0];
  if (actual.some((value, index) => value !== CRM_HEADERS_[index])) throw new Error('Intestazioni CRM non valide.');
}

function mapRequestToRow_(envelope) {
  const fields = envelope.fields;
  return [
    new Date(envelope.receivedAt),
    CRM_DEFAULT_STATUS_,
    fields.fullName,
    fields.phone,
    fields.email,
    CRM_KIND_LABELS_[envelope.kind],
    fields.office,
    '',
    '',
    '',
    '',
    '',
    '',
    fields.ageRange,
    fields.preferredDates,
    fields.preferredTimes,
    fields.treatment,
    fields.treatmentCategory,
    fields.problem,
    fields.initialReason,
    fields.visitReason,
    fields.visitGoal,
    fields.availability,
    fields.emergencyType,
    fields.symptom,
    fields.painLevel,
    fields.otherDetails,
    fields.otherRequest,
    fields.notes,
    fields.message,
    fields.details,
    fields.source,
    true,
    envelope.kind === 'treatment' ? true : '',
    envelope.requestId,
  ].map(sanitizeCell_);
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

function jsonResponse_(body) {
  return ContentService
    .createTextOutput(JSON.stringify(body))
    .setMimeType(ContentService.MimeType.JSON);
}
