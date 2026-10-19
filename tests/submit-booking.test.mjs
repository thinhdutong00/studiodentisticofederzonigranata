import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';
import { webcrypto } from 'node:crypto';

const source = await readFile(new URL('../src/utils/submitBooking.ts', import.meta.url), 'utf8');
const script = stripTypeScriptTypes(source)
  .replace(/^import .* from '\.\/attribution';\n/m, '')
  .replace(/^export /gm, '');

function fixture(response) {
  const redirects = [];
  const requests = [];
  const attributes = new Map();
  const button = { innerHTML: 'Invia la richiesta', textContent: 'Invia la richiesta', disabled: false };
  const form = {
    dataset: { bookingKind: 'orthodontic-quiz' },
    fields: new Map([
      ['fullName', 'Prova locale'], ['email', 'test@example.com'], ['phone', '+39 333 000 0000'],
      ['ageRange', '30–44 anni'], ['privacyConsent', 'on'], ['quizFlow', 'orthodontic-mobile-v2'],
    ]),
    querySelectorAll: () => [button],
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: name => attributes.delete(name),
  };
  const submitBooking = runInNewContext(`${script}\nsubmitBooking;`, {
    crypto: webcrypto,
    AbortSignal,
    FormData: class { constructor(form) { this.fields = form.fields; } entries() { return this.fields.entries(); } },
    getBookingAttribution: () => ({ attributionLandingPage: '/visita-ortodonzia/' }),
    window: { location: { pathname: '/visita-ortodonzia/', assign: path => redirects.push(path) } },
    fetch: async (url, options) => {
      const body = JSON.parse(options.body);
      requests.push({ url, body });
      return response(body);
    },
  });
  return { submitBooking, form, redirects, requests, attributes, button };
}

test('successful orthodontic quiz redirects to the shared thank-you page after confirmation', async () => {
  const f = fixture(body => ({ ok: true, json: async () => ({ ok: true, requestId: body.requestId }) }));
  const errors = [];
  await f.submitBooking(f.form, error => { if (error) errors.push(error); });
  assert.deepEqual(f.redirects, ['/thank-you-page/']);
  assert.deepEqual(errors, []);
  assert.equal(f.requests.length, 1);
  assert.equal(f.requests[0].url, '/api/booking');
  assert.equal(f.requests[0].body.ageRange, '30–44 anni');
  assert.equal(f.requests[0].body.patientAge, undefined);
  assert.equal(f.attributes.get('aria-busy'), 'true');
});

for (const [label, response] of [
  ['provider failure', () => ({ ok: false, json: async () => ({ ok: false, error: 'Invio non confermato.' }) })],
  ['unconfirmed request', () => ({ ok: true, json: async () => ({ ok: true, requestId: 'different-request' }) })],
]) {
  test(`orthodontic quiz stays on the form after ${label}`, async () => {
    const f = fixture(response);
    const errors = [];
    await f.submitBooking(f.form, error => { if (error) errors.push(error); });
    assert.deepEqual(f.redirects, []);
    assert.equal(errors.length, 1);
    assert.equal(f.attributes.has('aria-busy'), false);
    assert.equal(f.button.disabled, false);
    assert.equal(f.form.fields.get('ageRange'), '30–44 anni');
  });
}
