import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { setImmediate } from 'node:timers/promises';
import { buildPatientReceipt, createBookingHandler, RECIPIENT, validateBooking } from '../server/booking.js';
import { periodontalAgeRanges, periodontalDurations, periodontalObjectives, periodontalSymptoms } from '../src/data/periodontalQuiz.js';

// Every delivery in this file uses an injected fake. Unexpected destinations fail
// the test; no live email, CRM request or local API submission is performed.
const origin = 'https://studiodentisticofederzonigranata.vercel.app';
const emailUrl = 'https://api.resend.com/emails';
const crmUrl = 'https://script.google.com/macros/s/receipt-test/exec';
const env = {
  RESEND_API_KEY: 'fake-receipt-test-key',
  RESEND_FROM_EMAIL: 'Studio <receipt-test@example.com>',
  GOOGLE_SHEETS_WEBHOOK_URL: crmUrl,
  GOOGLE_SHEETS_WEBHOOK_SECRET: 'fake-receipt-secret-with-at-least-thirty-two-characters',
  GOOGLE_SHEETS_RECORD_TYPE: 'TEST',
  VERCEL: '1',
};
const base = {
  kind: 'contact', requestId: 'a3fb3f9c-714c-4d7c-af09-51fe594f6251',
  fullName: 'Paziente di prova', phone: '+39 333 000 0000', email: 'patient@example.com',
  privacyConsent: true, website: '', source: '/contatti/',
};
const common = { office: 'Modena', ageRange: '26–35 anni' };
const kinds = {
  contact: {},
  callback: {},
  'first-visit': { ...common, visitReason: 'Controllo generale', visitGoal: 'Ricevere una diagnosi completa', availability: 'Mattina' },
  urgent: { ...common, emergencyType: 'Altro', symptom: 'Altro', painLevel: '8', availability: 'Entro 24 ore', otherDetails: 'Descrizione riservata dei sintomi' },
  treatment: { ...common, treatment: 'Sbiancamento dentale', treatmentCategory: 'Estetica', problem: 'Sbiancamento domiciliare controllato', preferredDates: '2026-10-22', preferredTimes: '10:00', scheduleAcknowledged: true },
  'orthodontic-quiz': { office: 'Modena', patientAge: '30', problem: 'Denti affollati', occlusion: 'Morso aperto', availability: 'Tra 1 e 3 mesi', visitGoal: 'Un piano di trattamento personalizzato', initialReason: 'Allineare i miei denti', source: '/visita-ortodonzia/' },
  'periodontal-quiz': { office: 'Reggio Emilia', periodontalObjective: periodontalObjectives[0].title, ageRange: periodontalAgeRanges[2].value, periodontalSymptom: periodontalSymptoms[0], symptomDuration: periodontalDurations[1], source: '/visita-parodontologia/' },
};

async function invoke(handler, body = base) {
  const req = Readable.from([]);
  Object.assign(req, {
    body, method: 'POST',
    headers: { host: new URL(origin).host, origin, 'content-type': 'application/json' },
    socket: { remoteAddress: '127.0.0.1' },
  });
  const res = {
    headers: {},
    setHeader(key, value) { this.headers[key] = value; },
    end(value) { this.body = JSON.parse(value); },
  };
  await handler(req, res);
  return res;
}

function fixture({ studioResponse, crmResponse, receiptResponse } = {}) {
  const calls = [];
  const unexpected = [];
  const handler = createBookingHandler({ env, send: async (url, options) => {
    const body = JSON.parse(options.body);
    const call = { url, ...options, body };
    calls.push(call);
    if (url === crmUrl) return crmResponse ? crmResponse(call) : Response.json({ ok: true, requestId: body.requestId, duplicate: false });
    if (url === emailUrl && body.to?.length === 1 && body.to[0] === RECIPIENT) {
      return studioResponse ? studioResponse(call) : Response.json({ id: 'fake-studio-id' });
    }
    if (url === emailUrl && body.to?.length === 1 && body.to[0] === base.email) {
      return receiptResponse ? receiptResponse(call) : Response.json({ id: 'fake-receipt-id' });
    }
    unexpected.push(call);
    throw new Error('Unexpected fake-provider destination');
  } });
  return { handler, calls, unexpected };
}

const receiptCalls = (calls) => calls.filter(call => call.url === emailUrl && call.body.to?.[0] === base.email);
const studioCalls = (calls) => calls.filter(call => call.url === emailUrl && call.body.to?.[0] === RECIPIENT);

function deferred() {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
}

test('patient receipt has a generic subject, personal greeting, request reference and booking clarification', () => {
  const receipt = buildPatientReceipt(validateBooking(base), env.RESEND_FROM_EMAIL);
  assert.equal(receipt.from, env.RESEND_FROM_EMAIL);
  assert.deepEqual(receipt.to, [base.email]);
  assert.equal(receipt.reply_to, RECIPIENT);
  assert.equal(receipt.subject, 'Abbiamo ricevuto la tua richiesta — Studio Dentistico Federzoni Granata');
  assert.ok(receipt.text.includes(base.fullName));
  assert.ok(receipt.text.includes(base.requestId));
  assert.match(receipt.text, /(?:ricevut|ricezion|ricevimento).{0,40}richiesta/is);
  assert.match(receipt.text, /non.{0,80}(?:conferma|appuntamento|prenotazione)/is);
  assert.equal(receipt.html, undefined);
});

for (const [kind, fields] of Object.entries(kinds)) {
  test(`${kind}: receipt goes to the validated patient address after successful studio and CRM delivery`, async () => {
    const { handler, calls, unexpected } = fixture();
    const response = await invoke(handler, { ...base, ...fields, kind, to: 'forged@example.com', from: 'forged@example.com', reply_to: 'forged@example.com' });
    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, { ok: true, requestId: base.requestId });
    assert.equal(calls.length, 3);
    assert.deepEqual(unexpected, []);
    assert.equal(studioCalls(calls).length, 1);
    assert.equal(receiptCalls(calls).length, 1);
    const receipt = receiptCalls(calls)[0].body;
    assert.deepEqual(receipt.to, [base.email]);
    assert.equal(receipt.reply_to, RECIPIENT);
    assert.equal(receipt.from, env.RESEND_FROM_EMAIL);
    assert.ok(receipt.text.includes(base.requestId));
  });
}

test('a callback without email keeps the existing two-provider flow and gets no receipt', async () => {
  const { handler, calls, unexpected } = fixture();
  const data = { ...base, kind: 'callback', email: '' };
  assert.equal(buildPatientReceipt(validateBooking(data), env.RESEND_FROM_EMAIL), null);
  const response = await invoke(handler, data);
  assert.equal(response.statusCode, 200);
  assert.deepEqual(response.body, { ok: true, requestId: base.requestId });
  assert.equal(calls.length, 2);
  assert.equal(receiptCalls(calls).length, 0);
  assert.deepEqual(unexpected, []);
});

test('receipt contains no clinical answers, scheduling preferences, marketing or free text', () => {
  for (const [kind, fields] of Object.entries(kinds)) {
    const data = validateBooking({
      ...base, ...fields, kind,
      notes: 'PRIVATE-NOTES', message: 'PRIVATE-MESSAGE', details: 'PRIVATE-DETAILS', otherRequest: 'PRIVATE-OTHER-REQUEST',
      attributionSource: 'PRIVATE-SOURCE', attributionMedium: 'PRIVATE-MEDIUM', attributionCampaign: 'PRIVATE-CAMPAIGN',
      attributionCampaignId: 'PRIVATE-CAMPAIGN-ID', attributionAdGroupId: 'PRIVATE-ADGROUP-ID', attributionAdId: 'PRIVATE-AD-ID',
      attributionKeyword: 'PRIVATE-KEYWORD', attributionLandingPage: '/private-landing/', attributionReferrer: 'https://private-referrer.example/', clickIdType: 'gclid',
    });
    const receipt = buildPatientReceipt(data, env.RESEND_FROM_EMAIL);
    const expected = buildPatientReceipt({ ...validateBooking(base), kind }, env.RESEND_FROM_EMAIL);
    assert.deepEqual(receipt, expected, `${kind} must not personalize the receipt with health or attribution information`);
    assert.doesNotMatch(receipt.text, /PRIVATE-|private-landing|private-referrer/);
    assert.ok(!receipt.text.includes(base.phone));
  }
});

for (const email of [
  'patient@example.com\r\nBcc: victim@example.com',
  'patient@example.com,victim@example.com',
  'patient@example.com;victim@example.com',
  'Paziente <patient@example.com>',
  ['patient@example.com', 'victim@example.com'],
]) {
  test(`invalid patient address ${JSON.stringify(email)} is rejected before any delivery`, async () => {
    const { handler, calls, unexpected } = fixture();
    const response = await invoke(handler, { ...base, email });
    assert.equal(response.statusCode, 400);
    assert.equal(response.body.ok, false);
    assert.equal(calls.length, 0);
    assert.deepEqual(unexpected, []);
  });
}

test('studio email and CRM start together, then receipt waits for both and is itself awaited with an 8-second signal', async t => {
  const studio = deferred();
  const crm = deferred();
  const receipt = deferred();
  const timeouts = [];
  const realTimeout = AbortSignal.timeout.bind(AbortSignal);
  t.mock.method(AbortSignal, 'timeout', milliseconds => {
    timeouts.push(milliseconds);
    return realTimeout(milliseconds);
  });
  const { handler, calls, unexpected } = fixture({
    studioResponse: () => studio.promise,
    crmResponse: () => crm.promise,
    receiptResponse: () => receipt.promise,
  });
  let finished = false;
  const responsePromise = invoke(handler).then(response => { finished = true; return response; });
  await setImmediate();
  assert.equal(studioCalls(calls).length, 1);
  assert.equal(calls.filter(call => call.url === crmUrl).length, 1);
  assert.equal(receiptCalls(calls).length, 0);
  studio.resolve(Response.json({ id: 'fake-studio-id' }));
  await setImmediate();
  assert.equal(receiptCalls(calls).length, 0);
  crm.resolve(Response.json({ ok: true, requestId: base.requestId, duplicate: false }));
  await setImmediate();
  assert.equal(receiptCalls(calls).length, 1);
  assert.equal(finished, false);
  assert.ok(timeouts.includes(8_000));
  assert.ok(receiptCalls(calls)[0].signal instanceof AbortSignal);
  receipt.resolve(Response.json({ id: 'fake-receipt-id' }));
  const response = await responsePromise;
  assert.equal(response.statusCode, 200);
  assert.deepEqual(unexpected, []);
});

for (const failedProvider of ['studio', 'CRM']) {
  test(`${failedProvider} failure prevents any patient receipt`, async t => {
    t.mock.method(console, 'error', () => {});
    const failure = async () => { throw new Error('Fake provider failure'); };
    const { handler, calls, unexpected } = fixture(failedProvider === 'studio' ? { studioResponse: failure } : { crmResponse: failure });
    const response = await invoke(handler);
    assert.equal(response.statusCode, 502);
    assert.equal(response.body.ok, false);
    assert.equal(calls.length, 2);
    assert.equal(receiptCalls(calls).length, 0);
    assert.deepEqual(unexpected, []);
  });
}

test('duplicate retries reuse the receipt idempotency key, separate from studio email and from a new request', async () => {
  const { handler, calls, unexpected } = fixture({
    crmResponse: async ({ body }) => Response.json({ ok: true, requestId: body.requestId, duplicate: true }),
  });
  const newId = 'f2ca977f-168d-4115-8f18-91370c1ef746';
  for (const body of [base, base, { ...base, requestId: newId }]) {
    assert.equal((await invoke(handler, body)).statusCode, 200);
  }
  const receipts = receiptCalls(calls);
  const studio = studioCalls(calls);
  assert.equal(receipts.length, 3);
  assert.equal(receipts[0].headers['Idempotency-Key'], receipts[1].headers['Idempotency-Key']);
  assert.deepEqual(receipts[0].body, receipts[1].body);
  assert.notEqual(receipts[0].headers['Idempotency-Key'], receipts[2].headers['Idempotency-Key']);
  assert.notEqual(receipts[0].headers['Idempotency-Key'], studio[0].headers['Idempotency-Key']);
  assert.equal(studio[0].headers['Idempotency-Key'], studio[1].headers['Idempotency-Key']);
  assert.deepEqual(unexpected, []);
});

test('a retry can recover a failed receipt when the CRM already has the request', async t => {
  t.mock.method(console, 'error', () => {});
  let crmAttempts = 0;
  let receiptAttempts = 0;
  const { handler, calls, unexpected } = fixture({
    crmResponse: async ({ body }) => Response.json({
      ok: true, requestId: body.requestId, duplicate: crmAttempts++ > 0,
    }),
    receiptResponse: async () => ++receiptAttempts === 1
      ? Response.json({ message: 'Temporary failure' }, { status: 503 })
      : Response.json({ id: 'recovered-receipt-id' }),
  });
  for (let attempt = 0; attempt < 2; attempt += 1) {
    const response = await invoke(handler);
    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, { ok: true, requestId: base.requestId });
  }
  const receipts = receiptCalls(calls);
  assert.equal(receiptAttempts, 2);
  assert.equal(receipts[0].headers['Idempotency-Key'], receipts[1].headers['Idempotency-Key']);
  assert.deepEqual(receipts[0].body, receipts[1].body);
  assert.deepEqual(unexpected, []);
});

for (const [label, receiptResponse] of [
  ['provider rejection', async () => Response.json({ message: 'PRIVATE-provider-error' }, { status: 403 })],
  ['missing provider message ID', async () => Response.json({})],
  ['invalid provider response', async () => new Response('PRIVATE-invalid-response')],
  ['network error', async () => { throw new Error('PRIVATE-network-error'); }],
  ['abort', async () => { throw new DOMException('PRIVATE-timeout', 'TimeoutError'); }],
]) {
  test(`receipt ${label} is logged but does not undo an accepted booking`, async t => {
    const errors = [];
    t.mock.method(console, 'error', (...args) => errors.push(args));
    const { handler, calls, unexpected } = fixture({ receiptResponse });
    const response = await invoke(handler);
    assert.equal(response.statusCode, 200);
    assert.deepEqual(response.body, { ok: true, requestId: base.requestId });
    assert.equal(studioCalls(calls).length, 1);
    assert.equal(receiptCalls(calls).length, 1);
    assert.ok(errors.length > 0, 'receipt delivery failures must be visible in server logs');
    assert.doesNotMatch(JSON.stringify(response.body), /PRIVATE-/);
    assert.deepEqual(unexpected, []);
  });
}
