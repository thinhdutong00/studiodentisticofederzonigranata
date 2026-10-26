import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = (await readFile(new URL('../src/utils/googleAds.js', import.meta.url), 'utf8')).replace(/^export /gm, '');
const requestId = 'a3fb3f9c-714c-4d7c-af09-51fe594f6251';
const confirmed = { requestId, kind: 'landing-consultation', source: '/visita-parodontologia/' };
const receiptKey = 'fg-confirmed-lead-v1';
const orthodonticReceiptKey = 'fg-confirmed-orthodontic-lead-v1';
const orthodonticConfirmed = { requestId, kind: 'orthodontic-quiz', source: '/visita-ortodonzia/' };

function page({ preference, path = '/visita-parodontologia/', hostname = 'studiodentisticofederzonigranata.it', storage = new Map(), blocked = false } = {}) {
  const listeners = new Map(), scripts = [];
  const dataset = preference ? { cookiePreference: preference } : {};
  const window = { location: { protocol: 'https:', hostname, pathname: path } };
  const api = runInNewContext(`${source}\n({ initGoogleAds, rememberConfirmedLead });`, {
    window, Date,
    document: {
      documentElement: { dataset },
      addEventListener: (event, handler) => listeners.set(event, handler),
      createElement: () => ({ addEventListener(event, handler) { this[event] = handler; } }),
      head: { append: script => scripts.push(script) },
    },
    sessionStorage: {
      getItem: key => { if (blocked) throw Error('blocked'); return storage.get(key) ?? null; },
      setItem: (key, value) => { if (blocked) throw Error('blocked'); storage.set(key, value); },
      removeItem: key => { if (blocked) throw Error('blocked'); storage.delete(key); },
    },
  });
  return {
    ...api, scripts, storage, window,
    calls: () => JSON.parse(JSON.stringify((window.dataLayer || []).map(args => Array.from(args)))),
    choose: preference => { dataset.cookiePreference = preference; listeners.get('fg-cookie-preference')?.(); },
    load: () => scripts[0]?.load(),
  };
}

for (const preference of [undefined, 'reject']) {
  test(`no Google script or conversion before consent (${preference || 'unknown'})`, () => {
    const p = page({ preference }); p.initGoogleAds(); p.rememberConfirmedLead(confirmed);
    assert.equal(p.scripts.length, 0);
    assert.equal(p.storage.size, 0);
    assert.equal(p.calls().some(c => ['config', 'event'].includes(c[0])), false);
  });
}

test('consent defaults precede config; repeated acceptance creates only one script, personalization stays denied', () => {
  const p = page(); p.initGoogleAds(); p.choose('accept'); p.choose('accept'); p.initGoogleAds();
  assert.equal(p.scripts.length, 1);
  assert.match(p.scripts[0].src, /gtag\/js\?id=AW-988575526$/);
  const calls = p.calls();
  assert.equal(calls[0][0], 'consent'); assert.equal(calls[0][1], 'default');
  assert.equal(calls[0][2].ad_storage, 'denied');
  assert.ok(calls.filter(c => c[0] === 'consent').every(c => c[2].ad_personalization === 'denied'));
  assert.deepEqual(calls.find(c => c[0] === 'config')[2].user_data, {});
});

for (const hostname of ['localhost', '127.0.0.1', 'example-preview.vercel.app']) {
  test(`${hostname} cannot send measurements to the live account`, () => {
    const p = page({ hostname, preference: 'accept' }); p.initGoogleAds();
    assert.equal(p.scripts.length, 0); assert.equal(p.calls().length, 0);
  });
}

for (const [service, lead, key, destination, kinds] of [
  ['parodontologia', confirmed, receiptKey, 'AW-988575526/I2pSCNjTzaodEKbusdcD', ['landing-consultation', 'periodontal-quiz']],
  ['ortodonzia', orthodonticConfirmed, orthodonticReceiptKey, 'AW-988575526/gUQ-COLP2aodEKbusdcD', ['landing-consultation', 'orthodontic-quiz']],
]) {
 for (const kind of kinds) {
  test(`${service}/${kind}: confirmed lead fires once on thank-you, never on the form, with no patient fields`, () => {
    const p = page({ preference: 'accept', path: lead.source }); p.initGoogleAds();
    p.rememberConfirmedLead({ ...lead, kind, fullName: 'PRIVATE NAME', phone: 'PRIVATE PHONE', email: 'PRIVATE EMAIL', periodontalSymptom: 'PRIVATE HEALTH' });
    p.load();
    assert.equal(p.calls().filter(c => c[0] === 'event').length, 0);
    assert.deepEqual(Object.keys(JSON.parse(p.storage.get(key))).sort(), ['createdAt', 'requestId']);
    assert.equal(p.storage.size, 1, 'only the matching service has a receipt');
    const thanks = page({ preference: 'accept', path: '/thank-you-page/', storage: p.storage });
    thanks.initGoogleAds(); thanks.choose('accept');
    assert.equal(thanks.calls().filter(c => c[0] === 'event').length, 0, 'wait for the Google library');
    thanks.load(); thanks.choose('accept');
    const events = thanks.calls().filter(c => c[0] === 'event');
    assert.deepEqual(events, [['event', 'conversion', {
      send_to: destination, transaction_id: requestId, user_data: {},
    }]]);
    assert.doesNotMatch(JSON.stringify(thanks.calls()), /PRIVATE/);
    const reload = page({ preference: 'accept', path: '/thank-you-page/', storage: p.storage });
    reload.initGoogleAds(); reload.load();
    assert.equal(reload.calls().filter(c => c[0] === 'event').length, 0);
  });
 }
}

test('direct visits, URL query tricks, other services and invalid IDs do not create a conversion', () => {
  for (const data of [null, { ...confirmed, source: '/contatti/' }, { ...confirmed, kind: 'orthodontic-quiz' }, { ...orthodonticConfirmed, kind: 'periodontal-quiz' }, { ...confirmed, kind: 'callback' }, { ...confirmed, requestId: 'test@example.com' }, { ...orthodonticConfirmed, requestId: 'test@example.com' }, { ...orthodonticConfirmed, source: '/visita-ortodonzia/?submitted=1' }]) {
    const p = page({ preference: 'accept', path: '/thank-you-page/' });
    p.initGoogleAds(); if (data) p.rememberConfirmedLead(data); p.load();
    assert.equal(p.calls().filter(c => c[0] === 'event').length, 0);
  }
});

for (const key of [receiptKey, orthodonticReceiptKey]) {
 test(`${key}: expired, future and malformed receipts never fire`, () => {
  for (const value of ['broken JSON', JSON.stringify({ requestId, createdAt: Date.now() - 31 * 60 * 1000 }), JSON.stringify({ requestId, createdAt: Date.now() + 60_000 }), JSON.stringify({ requestId: 'not-an-id', createdAt: Date.now() })]) {
    const p = page({ preference: 'accept', path: '/thank-you-page/', storage: new Map([[key, value]]) });
    p.initGoogleAds(); p.load();
    assert.equal(p.calls().filter(c => c[0] === 'event').length, 0);
    assert.equal(p.storage.size, 0);
  }
});
}

test('revoking consent before library load clears the receipt and prevents its conversion', () => {
  const p = page({ preference: 'accept', path: '/thank-you-page/' });
  p.rememberConfirmedLead(confirmed); p.initGoogleAds(); p.choose('reject'); p.load();
  assert.equal(p.storage.size, 0);
  assert.equal(p.calls().filter(c => c[0] === 'event').length, 0);
  assert.equal(p.calls().filter(c => c[0] === 'consent').at(-1)[2].ad_storage, 'denied');
});

test('unavailable session storage never throws or invents a conversion', () => {
  const p = page({ preference: 'accept', path: '/thank-you-page/', blocked: true });
  assert.doesNotThrow(() => { p.rememberConfirmedLead(confirmed); p.initGoogleAds(); p.load(); });
  assert.equal(p.calls().filter(c => c[0] === 'event').length, 0);
});

test('a confirmed orthodontic form replaces an unconsumed periodontal receipt without cross-firing', () => {
  const p = page({ preference: 'accept' });
  p.rememberConfirmedLead(confirmed);
  p.rememberConfirmedLead(orthodonticConfirmed);
  assert.equal(p.storage.has(receiptKey), false);
  assert.equal(p.storage.has(orthodonticReceiptKey), true);
  const thanks = page({ preference: 'accept', path: '/thank-you-page/', storage: p.storage });
  thanks.initGoogleAds(); thanks.load();
  assert.deepEqual(thanks.calls().filter(c => c[0] === 'event').map(c => c[2].send_to), ['AW-988575526/gUQ-COLP2aodEKbusdcD']);
});

test('rejecting consent removes both service receipts and accepting later invents no lead', () => {
  const receipt = JSON.stringify({ requestId, createdAt: Date.now() });
  const p = page({ preference: 'reject', path: '/thank-you-page/', storage: new Map([[receiptKey, receipt], [orthodonticReceiptKey, receipt]]) });
  p.initGoogleAds();
  assert.equal(p.storage.size, 0);
  p.choose('accept'); p.load();
  assert.equal(p.calls().filter(c => c[0] === 'event').length, 0);
});

test('orthodontic submissions without consent and on preview hosts cannot create receipts', () => {
  for (const options of [{}, { preference: 'reject' }, { preference: 'accept', hostname: 'example-preview.vercel.app' }]) {
    const p = page(options); p.initGoogleAds(); p.rememberConfirmedLead(orthodonticConfirmed);
    assert.equal(p.storage.size, 0);
    assert.equal(p.calls().filter(c => c[0] === 'event').length, 0);
  }
});
