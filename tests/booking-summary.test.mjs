import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { quizConsultationFlows } from '../src/data/quizConsultation.js';
import { getLandingRoute } from '../src/data/landingRoutes.js';
import { getPeriodontalSymptomLabel } from '../src/data/periodontalQuiz.js';

const key = 'fg-booking-summary-v1';
const source = (await readFile(new URL('../src/utils/bookingSummary.js', import.meta.url), 'utf8'))
  .replace(/^import .*;\n/gm, '').replace(/^export /gm, '');
const requestId = 'a3fb3f9c-714c-4d7c-af09-51fe594f6251';
function payload(treatment = 'parodontologia') {
  const flow = quizConsultationFlows[treatment];
  return {
    requestId, kind: flow.kind, source: flow.source, quizFlow: flow.marker,
    fullName: 'Prova locale', phone: '+39 333 000 0000', email: '', office: 'Modena', ageRange: '36–50 anni',
    ...(treatment === 'ortodonzia'
      ? { initialReason: 'Allineare i miei denti', problem: 'Denti affollati', occlusion: 'Morso aperto' }
      : { periodontalObjective: 'Prendermi cura delle gengive', periodontalSymptom: 'Gengive che si ritirano', symptomDuration: 'Da diversi mesi' }),
  };
}
function page(storage = new Map(), blocked = false) {
  const list = { children: [], replaceChildren(...children) { this.children = children; } };
  const section = { hidden: true, querySelector: () => list };
  const api = runInNewContext(`${source}\n({ clearBookingSummary, rememberConfirmedBookingSummary, consumeConfirmedBookingSummary, renderBookingSummary });`, {
    Date, quizConsultationFlows, getLandingRoute, getPeriodontalSymptomLabel,
    sessionStorage: {
      getItem(name) { if (blocked) throw Error('blocked'); return storage.get(name) ?? null; },
      setItem(name, value) { if (blocked) throw Error('blocked'); storage.set(name, value); },
      removeItem(name) { if (blocked) throw Error('blocked'); storage.delete(name); },
    },
    document: {
      querySelector: () => section,
      createElement: tag => ({ tag, textContent: '', children: [], append(...children) { this.children.push(...children); } }),
    },
  });
  return { ...api, storage, section, list };
}

for (const treatment of Object.keys(quizConsultationFlows)) {
  test(`${treatment}: summary survives the redirect independently of Ads and is consumed once`, () => {
    const storage = new Map([['fg-confirmed-lead-v1', 'untouched Ads receipt']]);
    const form = page(storage), base = payload(treatment);
    form.rememberConfirmedBookingSummary({ ...base, notes: 'NOT FOR SUMMARY', attributionAdId: 'NOT FOR SUMMARY', privacyConsent: true });
    const stored = JSON.parse(storage.get(key));
    assert.equal(stored.fullName, base.fullName);
    assert.equal(stored.notes, undefined);
    assert.equal(stored.attributionAdId, undefined);
    assert.equal(stored.privacyConsent, undefined);
    assert.equal(stored.email, '');
    const thanks = page(storage);
    const summary = thanks.consumeConfirmedBookingSummary();
    assert.equal(summary.requestId, requestId);
    assert.equal(summary.rows.find(([label]) => label === 'Nome e cognome')[1], base.fullName);
    assert.equal(summary.rows.find(([label]) => label === 'Servizio')[1], treatment === 'ortodonzia' ? 'Ortodonzia' : 'Parodontologia');
    assert.equal(summary.rows.some(([label]) => label === 'Email'), false);
    assert.equal(storage.has(key), false);
    assert.equal(storage.get('fg-confirmed-lead-v1'), 'untouched Ads receipt');
    assert.equal(thanks.consumeConfirmedBookingSummary(), null);
  });
}

test('thank-you renders contact and clinical values as text, and refresh/direct visits show no stale summary', () => {
  const f = page();
  const name = '<img src=x onerror=alert(1)>';
  f.rememberConfirmedBookingSummary({ ...payload(), fullName: name, email: 'prova@example.com' });
  f.renderBookingSummary();
  assert.equal(f.section.hidden, false);
  assert.equal(f.list.children.find(row => row.children[0].textContent === 'Nome e cognome').children[1].textContent, name);
  assert.equal(f.list.children.find(row => row.children[0].textContent === 'Email').children[1].textContent, 'prova@example.com');
  assert.equal(f.list.children.find(row => row.children[0].textContent === 'Segnale notato').children[1].textContent, 'Recessioni gengivali');
  const reload = page(f.storage);
  reload.renderBookingSummary();
  assert.equal(reload.section.hidden, true);
  assert.equal(reload.list.children.length, 0);
});

test('expired, future, malformed and unrelated stored requests cannot display a summary', () => {
  for (const override of [
    { createdAt: Date.now() - 31 * 60 * 1000 }, { createdAt: Date.now() + 60_000 }, { createdAt: null },
    { requestId: 'invalid-id' }, { kind: 'callback' }, { source: '/contatti/' }, { quizFlow: 'orthodontic-consultation-v3' },
    { phone: '' }, { fullName: [] }, { email: 'x'.repeat(255) },
  ]) {
    const f = page();
    f.rememberConfirmedBookingSummary(payload());
    f.storage.set(key, JSON.stringify({ ...JSON.parse(f.storage.get(key)), ...override }));
    f.renderBookingSummary();
    assert.equal(f.section.hidden, true);
    assert.equal(f.storage.has(key), false);
  }
  const f = page(new Map([[key, '{broken JSON']]));
  assert.equal(f.consumeConfirmedBookingSummary(), null);
});

test('another form or an unrecognized quiz clears the previous summary without affecting other session data', () => {
  const f = page(new Map([['fg-booking-attribution-v2', 'attribution']]));
  f.rememberConfirmedBookingSummary(payload());
  f.rememberConfirmedBookingSummary({ ...payload(), quizFlow: undefined });
  assert.equal(f.storage.has(key), false);
  f.rememberConfirmedBookingSummary(payload());
  f.clearBookingSummary();
  assert.equal(f.storage.has(key), false);
  assert.equal(f.storage.get('fg-booking-attribution-v2'), 'attribution');
});

test('blocked storage never interrupts an accepted request or displays invented data', () => {
  const f = page(new Map(), true);
  assert.doesNotThrow(() => f.clearBookingSummary());
  assert.doesNotThrow(() => f.rememberConfirmedBookingSummary(payload()));
  assert.equal(f.consumeConfirmedBookingSummary(), null);
  assert.doesNotThrow(() => f.renderBookingSummary());
  assert.equal(f.section.hidden, true);
});
