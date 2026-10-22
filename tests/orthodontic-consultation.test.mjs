import test from 'node:test';
import assert from 'node:assert/strict';
import { validateBooking, buildSheetPayload } from '../server/booking.js';
import { deriveAttribution } from '../src/utils/attribution.js';

const path = '/visita-trattamento-ortondonzia/';
const payload = {
  kind: 'callback', requestId: 'a3fb3f9c-714c-4d7c-af09-51fe594f6251',
  fullName: 'Prova tecnica', phone: '+39 333 000 0000', email: '',
  treatment: 'Ortodonzia e allineatori', problem: 'Vorrei gli allineatori trasparenti',
  ageRange: '36–50 anni', office: 'Reggio Emilia', privacyConsent: true,
  source: path, attributionLandingPage: path,
  message: `Richiesta di visita ortodontica dalla landing ${path}.`,
};

test('new orthodontic callback accepts optional email and retains every answer in CRM', () => {
  const data = validateBooking(payload);
  const crm = buildSheetPayload(data, { GOOGLE_SHEETS_RECORD_TYPE: 'TEST' });
  assert.equal(data.email, '');
  assert.equal(crm.sede, payload.office);
  for (const answer of [payload.treatment, payload.problem, payload.ageRange, path]) {
    assert.ok(JSON.stringify(crm).includes(answer), `CRM lost ${answer}`);
  }
});

test('new orthodontic callback requires consent and validates optional email when supplied', () => {
  assert.throws(() => validateBooking({ ...payload, privacyConsent: false }), /privacy/);
  assert.throws(() => validateBooking({ ...payload, email: 'non-valida' }), /email/);
  assert.throws(() => validateBooking({ ...payload, phone: 'abcdef' }), /telefono/);
  assert.equal(validateBooking({ ...payload, email: 'test@example.com' }).email, 'test@example.com');
});

test('new landing preserves paid attribution and its own entry page', () => {
  const origin = 'https://studiodentisticofederzonigranata.it';
  const search = '?utm_source=google&utm_medium=cpc&creative=12345&gclid=example';
  const attribution = deriveAttribution({ href: `${origin}${path}${search}`, origin, search, referrer: '' });
  const data = validateBooking({ ...payload, ...attribution });
  assert.equal(data.attributionLandingPage, path);
  assert.equal(data.attributionAdId, '12345');
  assert.equal(data.clickIdType, 'gclid');
});
