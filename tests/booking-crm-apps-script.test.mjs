import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../integrations/google-apps-script/booking-crm.gs', import.meta.url), 'utf8');

function loadScript(rows) {
  const lock = { acquired: false, tryLock() { this.acquired = true; return true; }, hasLock() { return this.acquired; }, releaseLock() { this.acquired = false; } };
  const context = {
    console,
    ContentService: {
      MimeType: { JSON: 'application/json' },
      createTextOutput(text) { return { text, setMimeType() { return this; } }; },
    },
    LockService: { getScriptLock: () => lock },
    PropertiesService: {
      getScriptProperties: () => ({
        getProperty(name) {
          return {
            BOOKING_WEBHOOK_SECRET: 'test-secret-with-at-least-thirty-two-characters',
            BOOKING_SPREADSHEET_ID: 'spreadsheet-id',
          }[name] || null;
        },
      }),
    },
    SpreadsheetApp: {
      flush() {},
      openById(id) {
        assert.equal(id, 'spreadsheet-id');
        return { getSheetByName: () => createSheet(rows) };
      },
    },
  };
  vm.createContext(context);
  vm.runInContext(`${source}\nglobalThis.__crmTest = { CRM_HEADERS_, sanitizeCell_, secureEquals_, mapRequestToRow_, validateEnvelope_ };`, context);
  return context;
}

function createSheet(rows) {
  return {
    getLastColumn: () => rows[0].length,
    getLastRow: () => rows.length,
    appendRow(row) { rows.push(row); },
    getRange(row, column, rowCount = 1) {
      return {
        getDisplayValues() { return rows.slice(row - 1, row - 1 + rowCount).map((item) => item.slice(column - 1)); },
        setNumberFormat() { return this; },
        createTextFinder(term) {
          const finder = {
            matchCase() { return finder; },
            matchEntireCell() { return finder; },
            findNext() {
              return rows.slice(row - 1, row - 1 + rowCount).some((item) => String(item[column - 1]) === term) ? {} : null;
            },
          };
          return finder;
        },
      };
    },
  };
}

function envelope(overrides = {}) {
  return {
    secret: 'test-secret-with-at-least-thirty-two-characters',
    schemaVersion: 1,
    requestId: 'a3fb3f9c-714c-4d7c-af09-51fe594f6251',
    receivedAt: '2026-09-29T14:00:00.000Z',
    kind: 'urgent',
    fields: {
      fullName: 'Test tecnico', phone: '+39 333 000 0000', email: 'test@example.com', office: 'Modena', ageRange: '26–35 anni',
      preferredDates: '', preferredTimes: '', treatment: '', treatmentCategory: '', problem: '', initialReason: '',
      visitReason: '', visitGoal: '', availability: 'Entro 24 ore', emergencyType: 'Altro', symptom: 'Altro', painLevel: '8',
      otherDetails: '=FORMULA()', otherRequest: '', notes: '', message: '', details: '', source: '/urgenza/',
      privacyConsent: true, scheduleAcknowledged: false,
    },
    status: 'Chiuso',
    ...overrides,
  };
}

test('Apps Script schema has the requested columns and forces the initial CRM status', () => {
  const context = loadScript([]);
  const { CRM_HEADERS_, mapRequestToRow_ } = context.__crmTest;
  assert.equal(CRM_HEADERS_.length, 35);
  assert.deepEqual(Array.from(CRM_HEADERS_.slice(0, 7)), ['Ricevuta il', 'Stato', 'Nome e cognome', 'Telefono', 'Email', 'Tipo richiesta', 'Sede']);
  assert.deepEqual(Array.from(CRM_HEADERS_.slice(-3)), ['Consenso privacy', 'Conferma preferenze', 'ID richiesta']);
  const row = Array.from(mapRequestToRow_(envelope()));
  assert.equal(row.length, CRM_HEADERS_.length);
  assert.equal(row[1], 'Nuovo');
  assert.equal(row[3], "'+39 333 000 0000");
  assert.equal(row[26], "'=FORMULA()");
  assert.equal(row[34], envelope().requestId);
});

test('Apps Script neutralizes spreadsheet formulas and compares secrets exactly', () => {
  const { sanitizeCell_, secureEquals_ } = loadScript([]).__crmTest;
  for (const value of ['=1+1', '+39 333', '-1', '@name', '\t=1']) assert.equal(sanitizeCell_(value), `'${value}`);
  assert.equal(sanitizeCell_('Test'), 'Test');
  assert.equal(secureEquals_('same', 'same'), true);
  assert.equal(secureEquals_('same', 'different'), false);
});

test('Apps Script appends once and acknowledges the same request ID as a duplicate', () => {
  const bootstrap = loadScript([]);
  const rows = [Array.from(bootstrap.__crmTest.CRM_HEADERS_)];
  const context = loadScript(rows);
  const event = { postData: { contents: JSON.stringify(envelope()) } };

  const first = JSON.parse(context.doPost(event).text);
  const second = JSON.parse(context.doPost(event).text);

  assert.deepEqual(first, { ok: true, requestId: envelope().requestId, duplicate: false });
  assert.deepEqual(second, { ok: true, requestId: envelope().requestId, duplicate: true });
  assert.equal(rows.length, 2);
  assert.equal(rows[1][1], 'Nuovo');
});

test('Apps Script rejects invalid consent, schema, secret and altered headers without writing', () => {
  const bootstrap = loadScript([]);
  for (const body of [
    envelope({ schemaVersion: 2 }),
    envelope({ secret: 'wrong-secret-with-at-least-thirty-two-characters' }),
    envelope({ fields: { ...envelope().fields, privacyConsent: false } }),
  ]) {
    const rows = [Array.from(bootstrap.__crmTest.CRM_HEADERS_)];
    const context = loadScript(rows);
    assert.equal(JSON.parse(context.doPost({ postData: { contents: JSON.stringify(body) } }).text).ok, false);
    assert.equal(rows.length, 1);
  }

  const rows = [Array.from(bootstrap.__crmTest.CRM_HEADERS_)];
  rows[0][0] = 'Intestazione alterata';
  const context = loadScript(rows);
  assert.equal(JSON.parse(context.doPost({ postData: { contents: JSON.stringify(envelope()) } }).text).ok, false);
  assert.equal(rows.length, 1);
});
