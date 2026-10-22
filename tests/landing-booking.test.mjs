import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { buildSheetPayload, createBookingHandler, validateBooking, RECIPIENT } from '../server/booking.js';
import { landingBookingTreatments, landingBookingAges, landingBookingDays, landingBookingTimes } from '../src/data/landingBooking.js';

const origin = 'https://studiodentisticofederzonigranata.it';
const crmUrl = 'https://script.google.com/macros/s/landing-test/exec';
const env = {
  RESEND_API_KEY: 'mock-key', RESEND_FROM_EMAIL: 'Studio <mock@example.com>',
  GOOGLE_SHEETS_WEBHOOK_URL: crmUrl,
  GOOGLE_SHEETS_WEBHOOK_SECRET: 'mock-secret-with-at-least-thirty-two-characters',
  GOOGLE_SHEETS_RECORD_TYPE: 'TEST', VERCEL: '1',
};
function payload(config) {
  return {
    kind: 'landing-consultation', requestId: 'a3fb3f9c-714c-4d7c-af09-51fe594f6251',
    source: config.path, treatment: 'Servizio alterato dal client', problem: config.options[0].value,
    ageRange: '36–50 anni', office: 'Reggio Emilia', availability: 'Lunedì, Venerdì', preferredTimes: 'Pomeriggio',
    fullName: 'Prova tecnica', phone: '+39 333 000 0000', email: '', notes: 'Nota per la segreteria', privacyConsent: true,
    attributionSource: 'google', attributionMedium: 'cpc', attributionCampaign: 'Visite', attributionAdId: '123',
    attributionLandingPage: config.path,
  };
}
function fixture(failingProvider = '') {
  const calls = [];
  const handler = createBookingHandler({ env, send: async (url, options) => {
    const body = JSON.parse(options.body); calls.push({ url, body });
    if (url === failingProvider) return Response.json({ ok: false }, { status: 503 });
    if (url === crmUrl) return Response.json({ ok: true, requestId: body.requestId, duplicate: false });
    if (url === 'https://api.resend.com/emails') return Response.json({ id: 'mock-email' });
    throw new Error('Unexpected provider');
  } });
  return { handler, calls };
}
async function invoke(handler, body) {
  const req = Readable.from([]);
  Object.assign(req, { method: 'POST', body, headers: { host: new URL(origin).host, origin, 'content-type': 'application/json' }, socket: { remoteAddress: '127.0.0.1' } });
  const res = { setHeader() {}, end(value) { this.body = JSON.parse(value); } };
  await handler(req, res);
  return res;
}

for (const [name, config] of Object.entries(landingBookingTreatments)) {
  test(`${name}: every reason is accepted and the server determines the treatment from the landing`, () => {
    for (const option of config.options) {
      const data = validateBooking({ ...payload(config), problem: option.value });
      assert.equal(data.treatment, config.treatment);
      assert.equal(data.problem, option.value);
    }
  });
  test(`${name}: every patient age, weekday and time preference is accepted`, () => {
    for (const ageRange of landingBookingAges) assert.equal(validateBooking({ ...payload(config), ageRange }).ageRange, ageRange);
    for (const availability of landingBookingDays) assert.equal(validateBooking({ ...payload(config), availability }).availability, availability);
    for (const { value: preferredTimes } of landingBookingTimes) assert.equal(validateBooking({ ...payload(config), preferredTimes }).preferredTimes, preferredTimes);
  });
  test(`${name}: sends all answers and attribution to the existing email and CRM without requiring an email`, async () => {
    const f = fixture(), input = payload(config);
    const res = await invoke(f.handler, input);
    assert.equal(res.statusCode, 200);
    assert.deepEqual(res.body, { ok: true, requestId: input.requestId });
    assert.equal(f.calls.length, 2);
    const email = f.calls.find(call => call.url !== crmUrl).body;
    const crm = f.calls.find(call => call.url === crmUrl).body;
    assert.deepEqual(email.to, [RECIPIENT]);
    for (const key of ['problem', 'ageRange', 'office', 'availability', 'preferredTimes', 'notes', 'fullName', 'phone']) assert.ok(email.text.includes(input[key]), `Missing email field: ${key}`);
    assert.equal(crm.servizio, config.treatment);
    assert.equal(crm.giorniPreferiti, input.availability);
    assert.equal(crm.orariPreferiti, input.preferredTimes);
    assert.equal(crm.pagina, config.path);
    assert.equal(crm.paginaIngresso, config.path);
    assert.equal(crm.provenienza, 'Google Ads');
    assert.equal(crm.idAnnuncio, '123');
    for (const key of ['problem', 'ageRange', 'notes']) assert.ok(crm.messaggio.includes(input[key]));
  });
  test(`${name}: supplied email receives only the operational receipt after provider confirmation`, async () => {
    const f = fixture();
    const res = await invoke(f.handler, { ...payload(config), email: 'mock@example.com' });
    assert.equal(res.statusCode, 200);
    assert.equal(f.calls.length, 3);
    const receipt = f.calls[2].body;
    assert.deepEqual(receipt.to, ['mock@example.com']);
    assert.match(receipt.text, /non la prenotazione/);
    assert.ok(!receipt.text.includes(config.options[0].value));
  });
}

const base = payload(landingBookingTreatments.ortodonzia);
for (const missing of ['source', 'problem', 'ageRange', 'office', 'availability', 'preferredTimes', 'fullName', 'phone']) {
  test(`rejects missing ${missing} before contacting providers`, async () => {
    const f = fixture();
    assert.equal((await invoke(f.handler, { ...base, [missing]: '' })).statusCode, 400);
    assert.equal(f.calls.length, 0);
  });
}
for (const [name, overrides] of [
  ['unrelated landing', { source: '/visita-trattamento-ortondonzia/' }],
  ['quiz answer used as a booking reason', { problem: 'Denti affollati' }],
  ['reason from the other treatment', { problem: landingBookingTreatments.parodontologia.options[0].value }],
  ['invalid age', { ageRange: '999 anni' }], ['invalid office', { office: 'Milano' }],
  ['invalid day', { availability: 'Sabato' }], ['duplicate days', { availability: 'Lunedì, Lunedì' }],
  ['conflicting day choices', { availability: 'Lunedì, Non ho preferenze' }],
  ['invalid time', { preferredTimes: 'Notte' }], ['invalid email', { email: 'non-valida' }],
  ['missing consent', { privacyConsent: false }], ['honeypot', { website: 'filled' }],
]) {
  test(`rejects ${name} before contacting providers`, async () => {
    const f = fixture();
    assert.equal((await invoke(f.handler, { ...base, ...overrides })).statusCode, 400);
    assert.equal(f.calls.length, 0);
  });
}
for (const provider of [crmUrl, 'https://api.resend.com/emails']) {
  test(`does not confirm a request when ${provider === crmUrl ? 'CRM' : 'email'} fails`, async () => {
    const f = fixture(provider), res = await invoke(f.handler, base);
    assert.equal(res.statusCode, 502);
    assert.equal(res.body.ok, false);
    assert.equal(res.body.requestId, undefined);
  });
}

test('both source URL variants preserve the correct CRM service and entry page', () => {
  for (const config of Object.values(landingBookingTreatments)) {
    const crm = buildSheetPayload(validateBooking({ ...payload(config), source: config.path.slice(0, -1) }), env);
    assert.equal(crm.servizio, config.treatment);
    assert.equal(crm.paginaIngresso, config.path);
  }
});
