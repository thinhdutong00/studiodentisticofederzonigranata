import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = (await readFile(new URL('../src/utils/googleAds.js', import.meta.url), 'utf8')).replace(/^export /gm, '');
const requestId = 'a3fb3f9c-714c-4d7c-af09-51fe594f6251';
const confirmed = { requestId, kind: 'landing-consultation', source: '/visita-parodontologia/' };
const receiptKey = 'fg-confirmed-lead-v1';

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

for (const kind of ['landing-consultation', 'periodontal-quiz']) {
  test(`${kind}: confirmed lead fires once on thank-you, never on the form, with no patient fields`, () => {
    const p = page({ preference: 'accept' }); p.initGoogleAds();
    p.rememberConfirmedLead({ ...confirmed, kind, fullName: 'PRIVATE NAME', phone: 'PRIVATE PHONE', email: 'PRIVATE EMAIL', periodontalSymptom: 'PRIVATE HEALTH' });
    p.load();
    assert.equal(p.calls().filter(c => c[0] === 'event').length, 0);
    assert.deepEqual(Object.keys(JSON.parse(p.storage.get(receiptKey))).sort(), ['createdAt', 'requestId']);
    const thanks = page({ preference: 'accept', path: '/thank-you-page/', storage: p.storage });
    thanks.initGoogleAds(); thanks.choose('accept');
    assert.equal(thanks.calls().filter(c => c[0] === 'event').length, 0, 'wait for the Google library');
    thanks.load(); thanks.choose('accept');
    const events = thanks.calls().filter(c => c[0] === 'event');
    assert.deepEqual(events, [['event', 'conversion', {
      send_to: 'AW-988575526/I2pSCNjTzaodEKbusdcD', transaction_id: requestId, user_data: {},
    }]]);
    assert.doesNotMatch(JSON.stringify(thanks.calls()), /PRIVATE/);
    const reload = page({ preference: 'accept', path: '/thank-you-page/', storage: p.storage });
    reload.initGoogleAds(); reload.load();
    assert.equal(reload.calls().filter(c => c[0] === 'event').length, 0);
  });
}

test('direct visits, URL query tricks, other services and invalid IDs do not create a conversion', () => {
  for (const data of [null, { ...confirmed, source: '/visita-ortodonzia/' }, { ...confirmed, kind: 'callback' }, { ...confirmed, requestId: 'test@example.com' }]) {
    const p = page({ preference: 'accept', path: '/thank-you-page/' });
    p.initGoogleAds(); if (data) p.rememberConfirmedLead(data); p.load();
    assert.equal(p.calls().filter(c => c[0] === 'event').length, 0);
  }
});

test('expired, future and malformed receipts never fire', () => {
  for (const value of ['broken JSON', JSON.stringify({ requestId, createdAt: Date.now() - 31 * 60 * 1000 }), JSON.stringify({ requestId, createdAt: Date.now() + 60_000 }), JSON.stringify({ requestId: 'not-an-id', createdAt: Date.now() })]) {
    const p = page({ preference: 'accept', path: '/thank-you-page/', storage: new Map([[receiptKey, value]]) });
    p.initGoogleAds(); p.load();
    assert.equal(p.calls().filter(c => c[0] === 'event').length, 0);
    assert.equal(p.storage.size, 0);
  }
});

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
