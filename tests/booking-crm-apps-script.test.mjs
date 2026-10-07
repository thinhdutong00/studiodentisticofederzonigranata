import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import vm from 'node:vm';

const source = await readFile(new URL('../integrations/google-apps-script/booking-crm.gs', import.meta.url), 'utf8');

function createSheet(rows) {
  return {
    getLastColumn: () => rows[0]?.length || 0,
    getLastRow: () => rows.length,
    appendRow(row) { rows.push(row); },
    getRange(row, column, rowCount = 1, columnCount = 1) {
      return {
        getDisplayValues() {
          return rows
            .slice(row - 1, row - 1 + rowCount)
            .map((item) => item.slice(column - 1, column - 1 + columnCount));
        },
        setNumberFormat() { return this; },
        copyTo() { return this; },
        getDataValidations() { return [[]]; },
        setDataValidations() { return this; },
        createTextFinder(term) {
          const finder = {
            matchCase() { return finder; },
            matchEntireCell() { return finder; },
            findNext() {
              return rows
                .slice(row - 1, row - 1 + rowCount)
                .some((item) => String(item[column - 1]) === term) ? {} : null;
            },
          };
          return finder;
        },
      };
    },
  };
}

function loadScript(rows = [], logRows = []) {
  const lock = {
    acquired: false,
    tryLock() { this.acquired = true; return true; },
    hasLock() { return this.acquired; },
    releaseLock() { this.acquired = false; },
  };
  const mainSheet = createSheet(rows);
  const logSheet = createSheet(logRows);
  const spreadsheet = {
    getSheetByName(name) {
      if (name === 'Richieste dal sito') return mainSheet;
      if (name === '_Log integrazione') return logSheet;
      return null;
    },
  };
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
            WEBHOOK_SECRET: 'test-secret-with-at-least-thirty-two-characters',
            SPREADSHEET_ID: 'spreadsheet-id',
          }[name] || null;
        },
      }),
    },
    SpreadsheetApp: {
      CopyPasteType: { PASTE_FORMAT: 'PASTE_FORMAT' },
      flush() {},
      openById(id) {
        assert.equal(id, 'spreadsheet-id');
        return spreadsheet;
      },
      getActiveSpreadsheet() { return spreadsheet; },
    },
  };
  vm.createContext(context);
  vm.runInContext(`${source}\nglobalThis.__sheetTest = { BOOKING_HEADERS_, BOOKING_LOG_HEADERS_, sanitizeCell_, secureEquals_, mapPayloadToRow_, validatePayload_, formatPreferences_ };`, context);
  return context;
}

function payload(overrides = {}) {
  return {
    secret: 'test-secret-with-at-least-thirty-two-characters',
    requestId: 'a3fb3f9c-714c-4d7c-af09-51fe594f6251',
    nomeCognome: 'Test tecnico',
    telefono: '+39 333 000 0000',
    email: 'test@example.com',
    sede: 'Modena',
    servizio: 'Urgenza',
    giorniPreferiti: 'Entro 24 ore',
    orariPreferiti: '',
    messaggio: '=FORMULA()',
    provenienza: 'Google Ads',
    pagina: '/prenota-urgenza/',
    campagna: 'TEST-CAMPAGNA',
    recordType: 'TEST',
    ...overrides,
  };
}

test('Apps Script matches the live 24-column operational sheet', () => {
  const { BOOKING_HEADERS_, BOOKING_LOG_HEADERS_, mapPayloadToRow_ } = loadScript().__sheetTest;
  assert.equal(BOOKING_HEADERS_.length, 24);
  assert.deepEqual(Array.from(BOOKING_HEADERS_.slice(0, 6)), [
    'Data e ora richiesta',
    'Nome e cognome',
    'Telefono',
    'Email',
    'Sede richiesta',
    'Servizio richiesto',
  ]);
  assert.deepEqual(Array.from(BOOKING_HEADERS_.slice(-3)), ['Note segreteria', 'Tipo record', 'ID richiesta']);
  assert.deepEqual(Array.from(BOOKING_LOG_HEADERS_), ['Data e ora', 'Stato', 'ID richiesta', 'Dettaglio']);

  const row = Array.from(mapPayloadToRow_(payload(), new Date('2026-10-03T21:53:43.000Z')));
  assert.equal(row.length, BOOKING_HEADERS_.length);
  assert.equal(row[2], "'+39 333 000 0000");
  assert.equal(row[7], "'=FORMULA()");
  assert.equal(row[11], 'Sì');
  assert.equal(row[12], 0);
  assert.equal(row[14], 'Da chiamare');
  assert.equal(row[17], 'In attesa');
  assert.equal(row[21], 'TEST – non contattare');
  assert.equal(row[22], 'TEST');
  assert.equal(row[23], payload().requestId);

  const realRow = Array.from(mapPayloadToRow_(payload({ recordType: 'REALE' }), new Date()));
  assert.equal(realRow[11], 'No');
  assert.equal(realRow[21], '');
});

test('Apps Script neutralizes formulas and compares secrets exactly', () => {
  const { sanitizeCell_, secureEquals_ } = loadScript().__sheetTest;
  for (const value of ['=1+1', '+39 333', '-1', '@name', '\t=1']) assert.equal(sanitizeCell_(value), `'${value}`);
  assert.equal(sanitizeCell_('Test'), 'Test');
  assert.equal(secureEquals_('same', 'same'), true);
  assert.equal(secureEquals_('same', 'different'), false);
});

test('Apps Script combines preferences without changing the source values', () => {
  const { formatPreferences_ } = loadScript().__sheetTest;
  assert.equal(
    formatPreferences_(payload({ giorniPreferiti: '20/10/2026', orariPreferiti: '10:00, 15:30' })),
    'Giorni/disponibilità: 20/10/2026\nOrari: 10:00, 15:30',
  );
});

test('Apps Script appends once, logs success and acknowledges duplicate request IDs', () => {
  const bootstrap = loadScript();
  const rows = [Array.from(bootstrap.__sheetTest.BOOKING_HEADERS_)];
  const logRows = [Array.from(bootstrap.__sheetTest.BOOKING_LOG_HEADERS_)];
  const context = loadScript(rows, logRows);
  const event = { postData: { contents: JSON.stringify(payload()) } };

  const first = JSON.parse(context.doPost(event).text);
  const second = JSON.parse(context.doPost(event).text);

  assert.deepEqual(first, { ok: true, requestId: payload().requestId, duplicate: false });
  assert.deepEqual(second, { ok: true, requestId: payload().requestId, duplicate: true });
  assert.equal(rows.length, 2);
  assert.equal(rows[1][22], 'TEST');
  assert.equal(rows[1][23], payload().requestId);
  assert.equal(logRows.length, 3);
  assert.equal(logRows[1][1], 'OK');
  assert.equal(logRows[2][1], 'DUPLICATO');
});

test('Apps Script rejects invalid authorization, fields and altered headers without writing', () => {
  const bootstrap = loadScript();
  for (const body of [
    payload({ secret: 'wrong-secret-with-at-least-thirty-two-characters' }),
    payload({ recordType: 'ALTRO' }),
    payload({ provenienza: 'Inventata' }),
    payload({ pagina: '/?email=test@example.com' }),
  ]) {
    const rows = [Array.from(bootstrap.__sheetTest.BOOKING_HEADERS_)];
    const logRows = [Array.from(bootstrap.__sheetTest.BOOKING_LOG_HEADERS_)];
    const context = loadScript(rows, logRows);
    assert.equal(JSON.parse(context.doPost({ postData: { contents: JSON.stringify(body) } }).text).ok, false);
    assert.equal(rows.length, 1);
  }

  const rows = [Array.from(bootstrap.__sheetTest.BOOKING_HEADERS_)];
  rows[0][0] = 'Intestazione alterata';
  const logRows = [Array.from(bootstrap.__sheetTest.BOOKING_LOG_HEADERS_)];
  const context = loadScript(rows, logRows);
  assert.equal(JSON.parse(context.doPost({ postData: { contents: JSON.stringify(payload()) } }).text).ok, false);
  assert.equal(rows.length, 1);
});
