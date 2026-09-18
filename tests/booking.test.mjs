import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { createBookingHandler, RECIPIENT } from '../server/booking.js';

const origin = 'https://studiodentisticofederzonigranata.vercel.app';
const env = { RESEND_API_KEY: 'test-key', RESEND_FROM_EMAIL: 'Studio <moduli@example.com>', VERCEL: '1' };
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
  treatment: { ...common, treatment: 'Sbiancamento dentale', treatmentCategory: 'Estetica', problem: 'Sbiancamento domiciliare controllato', preferredDate: '2026-10-20', preferredTime: '15:30', details: 'Dettagli della visita', initialReason: 'Preferenza iniziale' },
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

function fixture(overrides = {}) {
  const calls = [];
  const handler = createBookingHandler({ env, send: async (url, options) => {
    calls.push({ url, ...options, email: JSON.parse(options.body) });
    return Response.json({ id: 'provider-message-id' });
  }, ...overrides });
  return { calls, handler };
}

for (const [kind, fields] of Object.entries(cases)) {
  test(`${kind}: sends all answers to the fixed recipient and acknowledges only provider acceptance`, async () => {
    const { calls, handler } = fixture();
    const data = { ...base, ...fields, kind, to: 'attacker@example.com', from: 'spoof@example.com' };
    const res = await invoke(handler, data);
    assert.equal(res.statusCode, 200);
    assert.equal(res.body.ok, true);
    assert.equal(res.body.requestId, base.requestId);
    assert.equal(calls.length, 1);
    assert.equal(calls[0].url, 'https://api.resend.com/emails');
    assert.deepEqual(calls[0].email.to, [RECIPIENT]);
    assert.equal(calls[0].email.from, env.RESEND_FROM_EMAIL);
    assert.equal(calls[0].email.reply_to, data.email || undefined);
    for (const [key, value] of Object.entries({ ...fields, fullName: base.fullName, phone: base.phone })) {
      if (value) assert.ok(calls[0].email.text.includes(value), `Missing ${key}`);
    }
    assert.match(calls[0].email.text, /Consenso.*espresso/);
    assert.equal(calls[0].email.html, undefined);
    assert.equal(res.headers['Cache-Control'], 'no-store');
  });
}

test('alternative treatment preserves the free-text request', async () => {
  const { handler, calls } = fixture();
  const res = await invoke(handler, { ...base, ...cases.treatment, treatment: 'Altro', problem: '', otherRequest: 'Vorrei una valutazione personalizzata.' });
  assert.equal(res.statusCode, 200);
  assert.match(calls[0].email.text, /Vorrei una valutazione personalizzata/);
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
  ['impossible date', { ...cases.treatment, kind: 'treatment', preferredDate: '2026-02-31' }],
  ['invalid time', { ...cases.treatment, kind: 'treatment', preferredTime: '99:99' }],
  ['invalid pain level', { ...cases.urgent, kind: 'urgent', painLevel: '99' }],
  ['missing other symptoms', { ...cases.urgent, kind: 'urgent', otherDetails: '' }],
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
  assert.equal(calls.length, 1);
});

test('missing credentials never produces a success response', async () => {
  const { handler, calls } = fixture({ env: {} });
  assert.equal((await invoke(handler)).statusCode, 503);
  assert.equal(calls.length, 0);
});

test('provider rejection, malformed response and network failure never acknowledge delivery', async () => {
  for (const send of [
    async () => Response.json({ message: 'SECRET provider error' }, { status: 403 }),
    async () => Response.json({}),
    async () => new Response('not json'),
    async () => { throw new Error('SECRET connection error'); },
  ]) {
    const { handler } = fixture({ send });
    const res = await invoke(handler);
    assert.equal(res.statusCode, 502);
    assert.equal(res.body.ok, false);
    assert.ok(!res.body.error.includes('SECRET'));
  }
});

test('retries retain the same provider idempotency key and email body', async () => {
  const { handler, calls } = fixture();
  await invoke(handler);
  await invoke(handler);
  await invoke(handler, { ...base, message: 'A corrected message' });
  assert.equal(calls[0].headers['Idempotency-Key'], calls[1].headers['Idempotency-Key']);
  assert.equal(calls[0].body, calls[1].body);
  assert.notEqual(calls[0].headers['Idempotency-Key'], calls[2].headers['Idempotency-Key']);
});

test('limits rapid repeated attempts and allows requests after the window expires', async () => {
  let time = 0;
  const { handler, calls } = fixture({ now: () => time });
  for (let i = 0; i < 10; i++) assert.equal((await invoke(handler)).statusCode, 200);
  assert.equal((await invoke(handler)).statusCode, 429);
  assert.equal(calls.length, 10);
  time = 600_001;
  assert.equal((await invoke(handler)).statusCode, 200);
});
