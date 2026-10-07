import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import {
  buildSheetPayload,
  classifyAttribution,
  createBookingHandler,
  RECIPIENT,
  validateBooking,
} from '../server/booking.js';
import { deriveAttribution } from '../src/utils/attribution.js';

const origin = 'https://studiodentisticofederzonigranata.vercel.app';
const crmUrl = 'https://script.google.com/macros/s/test-deployment/exec';
const env = {
  RESEND_API_KEY: 'test-key',
  RESEND_FROM_EMAIL: 'Studio <moduli@example.com>',
  GOOGLE_SHEETS_WEBHOOK_URL: crmUrl,
  GOOGLE_SHEETS_WEBHOOK_SECRET: 'test-secret-with-at-least-thirty-two-characters',
  GOOGLE_SHEETS_RECORD_TYPE: 'TEST',
  VERCEL: '1',
};
const base = {
  kind: 'contact', requestId: 'a3fb3f9c-714c-4d7c-af09-51fe594f6251',
  fullName: 'Test tecnico', phone: '+39 333 000 0000', email: 'test@example.com',
  privacyConsent: true, website: '', source: '/contatti/', message: 'Messaggio di prova',
};
const common = { office: 'Modena', ageRange: '26–35 anni' };
const cases = {
  contact: {}, callback: { email: '' },
  'first-visit': { ...common, visitReason: 'Controllo generale', visitGoal: 'Ricevere una diagnosi completa', availability: 'Mattina', notes: 'Nota di prova', message: 'Messaggio finale' },
  urgent: { ...common, emergencyType: 'Altro', symptom: 'Altro', painLevel: '8', availability: 'Entro 24 ore', otherDetails: 'Descrizione tecnica di prova', details: 'Dettagli di prova' },
  treatment: { ...common, treatment: 'Sbiancamento dentale', treatmentCategory: 'Estetica', problem: 'Sbiancamento domiciliare controllato', preferredDates: '2026-10-20, 2026-10-22', preferredTimes: '10:00, 15:30', scheduleAcknowledged: true, details: 'Dettagli della visita', initialReason: 'Preferenza iniziale' },
};

async function invoke(handler, body = base, options = {}) {
  const req = Readable.from(options.raw ? [options.raw] : []);
  Object.assign(req, {
    method: 'POST', headers: { host: new URL(origin).host, origin, 'content-type': 'application/json', ...options.headers },
    socket: { remoteAddress: '127.0.0.1' },
  });
  if (!options.raw) req.body = body;
  if (options.method) req.method = options.method;
  const res = { headers: {}, setHeader(key, value) { this.headers[key] = value; }, end(value) { this.body = JSON.parse(value); } };
  await handler(req, res);
  return res;
}

function fixture({ emailResponse, crmResponse, ...overrides } = {}) {
  const calls = [];
  const handler = createBookingHandler({ env, send: async (url, options) => {
    const body = JSON.parse(options.body);
    calls.push({ url, ...options, body });
    if (url === 'https://api.resend.com/emails') {
      return emailResponse ? emailResponse(body, options) : Response.json({ id: 'provider-message-id' });
    }
    if (url === crmUrl) {
      return crmResponse ? crmResponse(body, options) : Response.json({ ok: true, requestId: body.requestId, duplicate: false });
    }
    throw new Error('Unexpected provider URL');
  }, ...overrides });
  return { calls, handler };
}

const findEmailCall = (calls) => calls.find((call) => call.url === 'https://api.resend.com/emails');
const findCrmCall = (calls) => calls.find((call) => call.url === crmUrl);

for (const [kind, fields] of Object.entries(cases)) {
  test(`${kind}: sends all answers to email and CRM and acknowledges both providers`, async () => {
    const { calls, handler } = fixture();
    const data = { ...base, ...fields, kind, to: 'attacker@example.com', from: 'spoof@example.com', status: 'Chiuso' };
    const res = await invoke(handler, data);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.ok, true);
    assert.equal(res.body.requestId, base.requestId);
    assert.equal(calls.length, 2);
    const emailCall = findEmailCall(calls);
    const crmCall = findCrmCall(calls);
    assert.deepEqual(emailCall.body.to, [RECIPIENT]);
    assert.equal(emailCall.body.from, env.RESEND_FROM_EMAIL);
    assert.equal(emailCall.body.reply_to, data.email || undefined);
    for (const [key, value] of Object.entries({ ...fields, fullName: base.fullName, phone: base.phone })) {
      if (typeof value === 'string' && value) assert.ok(emailCall.body.text.includes(value), `Missing ${key}`);
    }
    assert.match(emailCall.body.text, /Consenso.*espresso/);
    if (kind === 'treatment') assert.match(emailCall.body.text, /carattere indicativo.*confermata/);
    assert.equal(emailCall.body.html, undefined);
    assert.equal(crmCall.body.secret, env.GOOGLE_SHEETS_WEBHOOK_SECRET);
    assert.equal(crmCall.body.requestId, base.requestId);
    assert.equal(crmCall.body.nomeCognome, base.fullName);
    assert.equal(crmCall.body.telefono, base.phone);
    assert.equal(crmCall.body.email, data.email);
    assert.equal(crmCall.body.sede, data.office || '');
    assert.equal(crmCall.body.servizio, data.treatment || {
      contact: 'Informazioni',
      callback: 'Richiesta di richiamata',
      'first-visit': 'Prima visita',
      urgent: 'Urgenza',
    }[kind]);
    assert.equal(crmCall.body.recordType, 'TEST');
    assert.equal(crmCall.body.provenienza, 'Diretto');
    assert.equal(crmCall.body.pagina, base.source);
    assert.equal(crmCall.redirect, 'follow');
    assert.equal(res.headers['Cache-Control'], 'no-store');
  });
}

test('alternative treatment preserves the free-text request', async () => {
  const { handler, calls } = fixture();
  const res = await invoke(handler, { ...base, ...cases.treatment, treatment: 'Altro', problem: '', otherRequest: 'Vorrei una valutazione personalizzata.' });
  assert.equal(res.statusCode, 200);
  assert.match(findEmailCall(calls).body.text, /Vorrei una valutazione personalizzata/);
  assert.match(findCrmCall(calls).body.messaggio, /Vorrei una valutazione personalizzata/);
});

for (const [label, changes] of [
  ['missing consent', { privacyConsent: false }], ['forged consent', { privacyConsent: 'true' }],
  ['invalid phone', { phone: 'abcdefghi' }], ['invalid email', { email: 'invalid' }],
  ['injected email header', { email: 'test@example.com\r\nBcc: other@example.com' }],
  ['missing name', { fullName: '' }], ['oversized field', { message: 'x'.repeat(3001) }],
  ['non-string field', { message: { html: '<script>' } }], ['honeypot', { website: 'spam' }],
  ['unknown form', { kind: '__proto__' }], ['missing request ID', { requestId: '' }],
  ['non-string form', { kind: ['contact'] }], ['non-string request ID', { requestId: [base.requestId] }],
  ['incomplete questionnaire', { kind: 'first-visit' }], ['invalid office', { office: 'Bologna' }],
  ['private data in source query', { source: '/contatti/?email=test@example.com' }],
  ['impossible date', { ...cases.treatment, kind: 'treatment', preferredDates: '2026-02-31' }],
  ['invalid time', { ...cases.treatment, kind: 'treatment', preferredTimes: '99:99' }],
  ['too many dates', { ...cases.treatment, kind: 'treatment', preferredDates: '2026-10-20, 2026-10-21, 2026-10-22' }],
  ['too many times', { ...cases.treatment, kind: 'treatment', preferredTimes: '09:00, 10:00, 11:00' }],
  ['missing schedule acknowledgement', { ...cases.treatment, kind: 'treatment', scheduleAcknowledged: false }],
  ['invalid pain level', { ...cases.urgent, kind: 'urgent', painLevel: '99' }],
  ['missing other symptoms', { ...cases.urgent, kind: 'urgent', otherDetails: '' }],
  ['non-string attribution', { attributionSource: ['google'] }],
  ['private data in attribution referrer query', { attributionReferrer: 'https://www.google.com/search?q=nome' }],
  ['invalid click ID type', { clickIdType: 'msclkid' }],
  ['private data in attribution landing page', { attributionLandingPage: '/?email=test@example.com' }],
]) {
  test(`rejects ${label} without sending email`, async () => {
    const { handler, calls } = fixture();
    const res = await invoke(handler, { ...base, ...changes });
    assert.equal(res.statusCode, 400);
    assert.equal(res.body.ok, false);
    assert.equal(calls.length, 0);
  });
}

test('rejects cross-origin, non-JSON and non-POST requests', async () => {
  const { handler, calls } = fixture();
  for (const [options, expected] of [
    [{ headers: { origin: 'https://unrelated.example.com' } }, 403],
    [{ headers: { origin: '' } }, 403],
    [{ headers: { 'content-type': 'application/x-www-form-urlencoded' } }, 415],
    [{ method: 'GET' }, 405],
    [{ raw: '{broken' }, 400],
    [{ headers: { 'content-length': '25000' } }, 413],
  ]) assert.equal((await invoke(handler, base, options)).statusCode, expected);
  assert.equal(calls.length, 0);
});

test('reads JSON from a native Node request as well as Vercel parsed bodies', async () => {
  const { handler, calls } = fixture();
  assert.equal((await invoke(handler, null, { raw: JSON.stringify(base) })).statusCode, 200);
  assert.equal(calls.length, 2);
});

test('missing or invalid provider configuration never calls either provider', async () => {
  for (const invalidEnv of [
    {},
    { ...env, GOOGLE_SHEETS_WEBHOOK_URL: '' },
    { ...env, GOOGLE_SHEETS_WEBHOOK_URL: 'https://example.com/webhook' },
    { ...env, GOOGLE_SHEETS_WEBHOOK_SECRET: 'too-short' },
    { ...env, GOOGLE_SHEETS_RECORD_TYPE: 'INVALIDO' },
    { ...env, RESEND_API_KEY: '' },
  ]) {
    const { handler, calls } = fixture({ env: invalidEnv });
    assert.equal((await invoke(handler)).statusCode, 503);
    assert.equal(calls.length, 0);
  }
});

test('email failures never acknowledge delivery even when CRM accepts the row', async () => {
  for (const emailResponse of [
    async () => Response.json({ message: 'SECRET provider error' }, { status: 403 }),
    async () => Response.json({}),
    async () => new Response('not json'),
    async () => { throw new Error('SECRET connection error'); },
  ]) {
    const { handler, calls } = fixture({ emailResponse });
    const res = await invoke(handler);
    assert.equal(res.statusCode, 502);
    assert.equal(res.body.ok, false);
    assert.ok(!res.body.error.includes('SECRET'));
    assert.ok(findCrmCall(calls));
  }
});

test('CRM failures never acknowledge delivery even when email is accepted', async () => {
  for (const crmResponse of [
    async () => Response.json({ ok: false, error: 'SECRET CRM error' }),
    async () => Response.json({ ok: true, requestId: 'f2ca977f-168d-4115-8f18-91370c1ef746', duplicate: false }),
    async () => Response.json({ ok: true, requestId: base.requestId }),
    async () => new Response('not json'),
    async () => { throw new Error('SECRET connection error'); },
  ]) {
    const { handler, calls } = fixture({ crmResponse });
    const res = await invoke(handler);
    assert.equal(res.statusCode, 502);
    assert.equal(res.body.ok, false);
    assert.ok(!res.body.error.includes('SECRET'));
    assert.ok(findEmailCall(calls));
  }
});

test('a duplicate CRM acknowledgement is a successful idempotent retry', async () => {
  const { handler } = fixture({
    crmResponse: async (body) => Response.json({ ok: true, requestId: body.requestId, duplicate: true }),
  });
  const res = await invoke(handler);
  assert.equal(res.statusCode, 200);
  assert.equal(res.body.ok, true);
});

test('retries retain the same email idempotency key and CRM request ID', async () => {
  const { handler, calls } = fixture({ now: () => Date.UTC(2026, 8, 29, 14, 0, 0) });
  await invoke(handler);
  await invoke(handler);
  await invoke(handler, { ...base, requestId: 'f2ca977f-168d-4115-8f18-91370c1ef746', message: 'A corrected message' });
  const emailCalls = calls.filter((call) => call.url === 'https://api.resend.com/emails');
  const crmCalls = calls.filter((call) => call.url === crmUrl);
  assert.equal(emailCalls[0].headers['Idempotency-Key'], emailCalls[1].headers['Idempotency-Key']);
  assert.deepEqual(emailCalls[0].body, emailCalls[1].body);
  assert.notEqual(emailCalls[0].headers['Idempotency-Key'], emailCalls[2].headers['Idempotency-Key']);
  assert.equal(crmCalls[0].body.requestId, crmCalls[1].body.requestId);
  assert.deepEqual(crmCalls[0].body, crmCalls[1].body);
  assert.notEqual(crmCalls[0].body.requestId, crmCalls[2].body.requestId);
});

test('limits rapid repeated attempts and allows requests after the window expires', async () => {
  let time = 0;
  const { handler, calls } = fixture({ now: () => time });
  for (let i = 0; i < 10; i++) assert.equal((await invoke(handler)).statusCode, 200);
  assert.equal((await invoke(handler)).statusCode, 429);
  assert.equal(calls.length, 20);
  time = 600_001;
  assert.equal((await invoke(handler)).statusCode, 200);
  assert.equal(calls.length, 22);
});

test('classifies attribution conservatively without inventing organic or campaign data', () => {
  assert.equal(classifyAttribution({ clickIdType: 'gclid' }), 'Google Ads');
  assert.equal(classifyAttribution({ attributionSource: 'google', attributionMedium: 'cpc' }), 'Google Ads');
  assert.equal(classifyAttribution({ attributionSource: 'google_maps' }), 'Google Maps');
  assert.equal(classifyAttribution({ attributionReferrer: 'https://www.google.com/maps/place/Modena' }), 'Google Maps');
  assert.equal(classifyAttribution({ attributionReferrer: 'https://www.google.it/search' }), 'Google organico');
  assert.equal(classifyAttribution({ attributionSource: 'google' }), 'Non rilevata');
  assert.equal(classifyAttribution({ attributionCampaign: 'solo-campagna' }), 'Non rilevata');
  assert.equal(classifyAttribution({ attributionReferrer: 'https://example.com/article' }), 'Altro');
  assert.equal(classifyAttribution({}), 'Diretto');
});

test('captures only bounded non-contact attribution data from the browser URL', () => {
  const attribution = deriveAttribution({
    href: 'https://studiodentisticofederzonigranata.it/sbiancamento/?utm_source=google&utm_medium=cpc&utm_campaign=TEST-CAMPAGNA&campaignid=123&adgroupid=456&creative=789&keyword=dentista%20modena&gclid=TEST-NON-REALE',
    origin: 'https://studiodentisticofederzonigranata.it',
    search: '?utm_source=google&utm_medium=cpc&utm_campaign=TEST-CAMPAGNA&campaignid=123&adgroupid=456&creative=789&keyword=dentista%20modena&gclid=TEST-NON-REALE',
    referrer: 'https://www.google.it/search?q=dentista+modena&email=privato@example.com',
  });
  assert.deepEqual(attribution, {
    attributionSource: 'google',
    attributionMedium: 'cpc',
    attributionCampaign: 'TEST-CAMPAGNA',
    attributionCampaignId: '123',
    attributionAdGroupId: '456',
    attributionAdId: '789',
    attributionKeyword: 'dentista modena',
    attributionReferrer: 'https://www.google.it/search',
    attributionLandingPage: '/sbiancamento/',
    clickIdType: 'gclid',
  });
  assert.ok(!JSON.stringify(attribution).includes('TEST-NON-REALE'));
  assert.ok(!JSON.stringify(attribution).includes('privato@example.com'));
});

test('builds the payload expected by the operational sheet', () => {
  const data = validateBooking({
    ...base,
    ...cases.treatment,
    kind: 'treatment',
    attributionSource: 'google',
    attributionMedium: 'cpc',
    attributionCampaign: 'TEST-CAMPAGNA-ESATTA',
    attributionCampaignId: '123456789',
    attributionAdGroupId: '987654321',
    attributionAdId: '456789123',
    attributionKeyword: 'dentista modena',
    attributionLandingPage: '/sbiancamento/',
    attributionReferrer: 'https://www.google.it/search',
    clickIdType: 'gclid',
  });
  const payload = buildSheetPayload(data, {
    GOOGLE_SHEETS_WEBHOOK_SECRET: 'server-secret',
    GOOGLE_SHEETS_RECORD_TYPE: 'TEST',
  });
  assert.equal(payload.secret, 'server-secret');
  assert.equal(payload.requestId, base.requestId);
  assert.equal(payload.nomeCognome, base.fullName);
  assert.equal(payload.servizio, cases.treatment.treatment);
  assert.equal(payload.giorniPreferiti, cases.treatment.preferredDates);
  assert.equal(payload.orariPreferiti, cases.treatment.preferredTimes);
  assert.equal(payload.provenienza, 'Google Ads');
  assert.equal(payload.pagina, base.source);
  assert.equal(payload.campagna, 'TEST-CAMPAGNA-ESATTA');
  assert.equal(payload.idCampagna, '123456789');
  assert.equal(payload.idGruppoAnnunci, '987654321');
  assert.equal(payload.idAnnuncio, '456789123');
  assert.equal(payload.parolaChiave, 'dentista modena');
  assert.equal(payload.paginaIngresso, '/sbiancamento/');
  assert.equal(payload.recordType, 'TEST');
  assert.match(payload.messaggio, /Sbiancamento domiciliare controllato/);

  const withoutCampaign = buildSheetPayload(
    { ...data, attributionCampaign: '' },
    { GOOGLE_SHEETS_WEBHOOK_SECRET: 'server-secret', GOOGLE_SHEETS_RECORD_TYPE: 'REALE' },
  );
  assert.equal(withoutCampaign.campagna, '');
  assert.equal(withoutCampaign.recordType, 'REALE');
});
