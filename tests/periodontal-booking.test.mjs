import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';
import { webcrypto } from 'node:crypto';
import { buildSheetPayload, createBookingHandler, RECIPIENT, validateBooking } from '../server/booking.js';
import { periodontalAgeRanges, periodontalDurations, periodontalObjectives, periodontalSymptoms } from '../src/data/periodontalQuiz.js';

const origin = 'https://studiodentisticofederzonigranata.it';
const crmUrl = 'https://script.google.com/macros/s/mock-periodontal/exec';
const env = {
  RESEND_API_KEY: 'mock-key', RESEND_FROM_EMAIL: 'Studio <mock@example.com>',
  GOOGLE_SHEETS_WEBHOOK_URL: crmUrl,
  GOOGLE_SHEETS_WEBHOOK_SECRET: 'mock-secret-with-more-than-thirty-two-characters',
  GOOGLE_SHEETS_RECORD_TYPE: 'TEST', VERCEL: '1',
};
const base = {
  kind: 'periodontal-quiz', requestId: 'b3fb3f9c-714c-4d7c-af09-51fe594f6251',
  fullName: 'Prova locale', phone: '+39 333 000 0000', email: 'mock@example.com',
  privacyConsent: true, website: '', source: '/visita-parodontologia/',
  periodontalObjective: periodontalObjectives[0].title, ageRange: '45–59 anni',
  periodontalSymptom: periodontalSymptoms[0], symptomDuration: periodontalDurations[0],
  office: 'Modena', message: 'Richiesta di valutazione parodontale dal questionario.',
};

function fixture({ emailOk = true, sheetOk = true } = {}) {
  const calls = [];
  const handler = createBookingHandler({ env, send: async (url, options) => {
    const body = JSON.parse(options.body);
    calls.push({ url, body });
    if (url === 'https://api.resend.com/emails') return emailOk ? Response.json({ id: 'mock-message' }) : Response.json({ error: 'mock failure' }, { status: 503 });
    if (url === crmUrl) return Response.json({ ok: sheetOk, requestId: body.requestId, duplicate: false });
    throw new Error('Unexpected network destination');
  } });
  return { handler, calls };
}
async function invoke(handler, body) {
  const req = Readable.from([]);
  Object.assign(req, { method: 'POST', body, headers: { host: new URL(origin).host, origin, 'content-type': 'application/json' }, socket: { remoteAddress: '127.0.0.1' } });
  const res = { headers: {}, setHeader(key, value) { this.headers[key] = value; }, end(value) { this.body = JSON.parse(value); } };
  await handler(req, res);
  return res;
}

test('periodontal quiz delivers every clinical answer with correct labels and keeps advertising attribution', async () => {
  const f = fixture();
  const answers = { ...base, office: 'Reggio Emilia', treatment: 'Servizio manipolato', attributionSource: 'google', attributionMedium: 'cpc', attributionCampaign: 'Gengive', attributionCampaignId: '123', attributionLandingPage: '/visita-parodontologia/' };
  const res = await invoke(f.handler, answers);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, { ok: true, requestId: base.requestId });
  assert.equal(f.calls.length, 3);
  const email = f.calls.find(call => call.url === 'https://api.resend.com/emails').body;
  const crm = f.calls.find(call => call.url === crmUrl).body;
  assert.deepEqual(email.to, [RECIPIENT]);
  assert.equal(email.reply_to, base.email);
  assert.match(email.subject, /Questionario parodontologia.*Reggio Emilia/);
  for (const key of ['periodontalObjective', 'ageRange', 'periodontalSymptom', 'symptomDuration', 'office', 'fullName', 'email', 'phone']) {
    assert.ok(email.text.includes(answers[key]), `Missing email field ${key}`);
  }
  for (const key of ['periodontalObjective', 'ageRange', 'periodontalSymptom', 'symptomDuration']) assert.ok(crm.messaggio.includes(answers[key]), `Missing CRM answer ${key}`);
  assert.match(crm.messaggio, /Obiettivo della valutazione parodontale:/);
  assert.match(crm.messaggio, /Segnale riferito nel questionario parodontale:/);
  assert.match(crm.messaggio, /Da quanto tempo è stato notato il segnale:/);
  assert.doesNotMatch(email.text, /Morso indicato|Età del paziente:|Ortodonzia|Servizio manipolato/);
  assert.equal(crm.servizio, 'Parodontologia');
  assert.equal(crm.pagina, '/visita-parodontologia/');
  assert.equal(crm.provenienza, 'Google Ads');
  assert.equal(crm.campagna, 'Gengive');
  assert.equal(crm.idCampagna, '123');
  assert.equal(crm.paginaIngresso, '/visita-parodontologia/');
  assert.equal(crm.giorniPreferiti, '');
  assert.equal(crm.orariPreferiti, '');
  assert.equal(crm.recordType, 'TEST');
  assert.equal(crm.secret, env.GOOGLE_SHEETS_WEBHOOK_SECRET);
});

for (const [field, values] of [
  ['periodontalObjective', periodontalObjectives.map(option => option.title)],
  ['ageRange', periodontalAgeRanges.map(option => option.value)],
  ['periodontalSymptom', periodontalSymptoms],
  ['symptomDuration', periodontalDurations],
]) {
  test(`periodontal quiz accepts all listed ${field} values without inventing a diagnosis or exact age`, () => {
    for (const value of values) {
      const data = validateBooking({ ...base, [field]: value });
      assert.equal(data[field], value);
      assert.equal(data.patientAge, '');
      assert.equal(data.treatment, 'Parodontologia');
      const crm = buildSheetPayload(data, env);
      assert.ok(crm.messaggio.includes(value));
      assert.doesNotMatch(crm.messaggio, /Punteggio|Diagnosi:/);
    }
  });
}

for (const field of ['periodontalObjective', 'ageRange', 'periodontalSymptom', 'symptomDuration', 'office', 'fullName', 'email', 'phone']) {
  test(`periodontal quiz rejects missing ${field} before contacting providers`, async () => {
    const f = fixture();
    const res = await invoke(f.handler, { ...base, [field]: '' });
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.ok, false);
    assert.equal(f.calls.length, 0);
  });
}

for (const [name, fields] of [
  ['unknown objective', { periodontalObjective: 'Diagnosi automatica' }],
  ['unknown age', { ageRange: '1000 anni' }],
  ['unknown symptom', { periodontalSymptom: 'Valore fuori elenco' }],
  ['unknown duration', { symptomDuration: 'Durata libera' }],
  ['missing source', { source: '' }],
  ['different page', { source: '/visita-ortodonzia/' }],
  ['external source', { source: '//example.com/' }],
  ['unknown office', { office: 'Milano' }],
  ['missing consent', { privacyConsent: false }],
  ['honeypot', { website: 'example.com' }],
  ['exact age mixed with range', { patientAge: '30' }],
  ['orthodontic answer', { occlusion: 'Morso aperto' }],
  ['removed availability field', { availability: 'Mattina' }],
]) {
  test(`periodontal quiz rejects ${name} before contacting providers`, async () => {
    const f = fixture();
    const res = await invoke(f.handler, { ...base, ...fields });
    assert.equal(res.statusCode, 400);
    assert.equal(f.calls.length, 0);
  });
}

for (const [name, state] of [['email failure', { emailOk: false }], ['CRM failure', { sheetOk: false }]]) {
  test(`periodontal quiz does not acknowledge success after ${name}`, async () => {
    const f = fixture(state);
    const res = await invoke(f.handler, base);
    assert.equal(res.statusCode, 502);
    assert.equal(res.body.ok, false);
    assert.equal(res.body.requestId, undefined);
  });
}

const submitSource = stripTypeScriptTypes(await readFile(new URL('../src/utils/submitBooking.ts', import.meta.url), 'utf8'))
  .replace(/^import .* from '\.\/attribution';\n/m, '').replace(/^export /gm, '');
function submitFixture(confirmed = true) {
  const redirects = [], requests = [], attrs = new Map();
  const button = { innerHTML: 'Invia la richiesta', textContent: '', disabled: false };
  const form = {
    dataset: { bookingKind: 'periodontal-quiz' }, fields: new Map(Object.entries({ ...base, privacyConsent: 'on' })),
    querySelectorAll: () => [button], setAttribute: (key, value) => attrs.set(key, value), removeAttribute: key => attrs.delete(key),
  };
  const submitBooking = runInNewContext(`${submitSource}\nsubmitBooking;`, {
    crypto: webcrypto, AbortSignal,
    FormData: class { constructor(form) { this.fields = form.fields; } entries() { return this.fields.entries(); } },
    getBookingAttribution: () => ({ attributionLandingPage: '/visita-parodontologia/' }),
    window: { location: { pathname: '/visita-parodontologia/', assign: path => redirects.push(path) } },
    fetch: async (url, options) => {
      const body = JSON.parse(options.body); requests.push({ url, body });
      return { ok: true, json: async () => ({ ok: true, requestId: confirmed ? body.requestId : 'unconfirmed-request' }) };
    },
  });
  return { submitBooking, form, redirects, requests, attrs, button };
}

test('periodontal quiz uses the shared thank-you redirect only after matching server confirmation', async () => {
  const f = submitFixture();
  const errors = [];
  await f.submitBooking(f.form, error => { if (error) errors.push(error); });
  assert.deepEqual(errors, []);
  assert.deepEqual(f.redirects, ['/thank-you-page/']);
  assert.equal(f.requests[0].body.kind, 'periodontal-quiz');
  assert.equal(f.requests[0].body.source, '/visita-parodontologia/');
  assert.equal(f.requests[0].body.periodontalSymptom, base.periodontalSymptom);
});

test('periodontal quiz stays on the form when the server has not confirmed its request', async () => {
  const f = submitFixture(false), errors = [];
  await f.submitBooking(f.form, error => { if (error) errors.push(error); });
  assert.deepEqual(f.redirects, []);
  assert.equal(errors.length, 1);
  assert.equal(f.attrs.has('aria-busy'), false);
  assert.equal(f.button.disabled, false);
  assert.equal(f.form.fields.get('periodontalSymptom'), base.periodontalSymptom);
});
