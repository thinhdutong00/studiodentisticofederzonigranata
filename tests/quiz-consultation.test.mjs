import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { readFile } from 'node:fs/promises';
import { stripTypeScriptTypes } from 'node:module';
import { runInNewContext } from 'node:vm';
import { webcrypto } from 'node:crypto';
import { validateBooking, createBookingHandler, buildSheetPayload, RECIPIENT } from '../server/booking.js';
import { quizConsultationAges, quizConsultationFlows } from '../src/data/quizConsultation.js';
import { orthodonticObjectives, orthodonticConcerns, orthodonticBites } from '../src/data/orthodonticQuiz.js';
import { periodontalObjectives, periodontalSymptoms, periodontalDurations, getPeriodontalSymptomLabel } from '../src/data/periodontalQuiz.js';
import { landingBookingTreatments } from '../src/data/landingBooking.js';

const origin = 'https://studiodentisticofederzonigranata.it';
const crmUrl = 'https://script.google.com/macros/s/quiz-consultation-test/exec';
const env = { VERCEL:'1', RESEND_API_KEY:'mock-key', RESEND_FROM_EMAIL:'Studio <mock@example.com>', GOOGLE_SHEETS_WEBHOOK_URL:crmUrl, GOOGLE_SHEETS_WEBHOOK_SECRET:'mock-secret-with-at-least-thirty-two-characters', GOOGLE_SHEETS_RECORD_TYPE:'TEST' };
function payload(treatment) {
  const config = quizConsultationFlows[treatment];
  return {
    kind:config.kind, quizFlow:config.marker, source:config.source,
    requestId:'a3fb3f9c-714c-4d7c-af09-51fe594f6251', fullName:'Prova tecnica', phone:'+39 333 000 0000', email:'',
    ageRange:'36–50 anni', office:'Reggio Emilia', privacyConsent:true,
    attributionSource:'google', attributionMedium:'cpc', attributionAdId:'123', attributionLandingPage:config.source,
    ...(treatment === 'ortodonzia'
      ? { initialReason:orthodonticObjectives[0].title, problem:orthodonticConcerns[0].value, occlusion:orthodonticBites[0].value }
      : { periodontalObjective:periodontalObjectives[0].title, periodontalSymptom:periodontalSymptoms[0], symptomDuration:periodontalDurations[0] }),
  };
}
function fixture(failure = '') {
  const calls = [];
  const handler = createBookingHandler({env,send:async(url,options)=>{
    const body = JSON.parse(options.body); calls.push({url,body});
    if (url === failure) return Response.json({ok:false},{status:503});
    if (url === crmUrl) return Response.json({ok:true,requestId:body.requestId,duplicate:false});
    if (url === 'https://api.resend.com/emails') return Response.json({id:'mock-email'});
    throw new Error('Unexpected provider');
  }});
  return {calls,handler};
}
async function invoke(handler,body) {
  const req = Readable.from([]);
  Object.assign(req,{method:'POST',body,headers:{host:new URL(origin).host,origin,'content-type':'application/json'},socket:{remoteAddress:'127.0.0.1'}});
  const res = {setHeader(){},end(value){this.body=JSON.parse(value);}};
  await handler(req,res); return res;
}

for (const treatment of Object.keys(quizConsultationFlows)) {
  const base = payload(treatment);
  test(`${treatment}: the new quiz accepts every age range from the reference consultation form`,()=>{
    for (const ageRange of quizConsultationAges) assert.equal(validateBooking({...base,ageRange}).ageRange,ageRange);
  });
  test(`${treatment}: empty email is optional, supplied email is validated and old quiz paths retain their rules`,()=>{
    assert.equal(validateBooking(base).email,'');
    assert.equal(validateBooking({...base,email:'mock@example.com'}).email,'mock@example.com');
    assert.throws(()=>validateBooking({...base,email:'non-valida'}),/email/);
    assert.throws(()=>validateBooking({...base,quizFlow:undefined}),/email/);
  });
  test(`${treatment}: delivers every answer to email and CRM with original advertising attribution`,async()=>{
    const f = fixture(), res = await invoke(f.handler,base);
    assert.equal(res.statusCode,200);
    assert.deepEqual(res.body,{ok:true,requestId:base.requestId});
    assert.equal(f.calls.length,2);
    const email = f.calls.find(call=>call.url!==crmUrl).body;
    const crm = f.calls.find(call=>call.url===crmUrl).body;
    assert.deepEqual(email.to,[RECIPIENT]);
    for (const key of treatment==='ortodonzia' ? ['initialReason','problem','occlusion','ageRange'] : ['periodontalObjective','periodontalSymptom','symptomDuration','ageRange']) {
      assert.ok(email.text.includes(base[key]),`Missing email answer ${key}`);
      assert.ok(crm.messaggio.includes(base[key]),`Missing CRM answer ${key}`);
    }
    assert.equal(crm.sede,base.office);
    assert.equal(crm.servizio,treatment==='ortodonzia'?'Ortodonzia e allineatori':'Parodontologia');
    assert.equal(crm.provenienza,'Google Ads');
    assert.equal(crm.idAnnuncio,'123');
    assert.equal(crm.paginaIngresso,base.source);
    assert.equal(crm.giorniPreferiti,'');
    assert.equal(crm.orariPreferiti,'');
  });
  for (const field of ['fullName','phone','ageRange','office',...(treatment==='ortodonzia'?['problem','occlusion','initialReason']:['periodontalObjective','periodontalSymptom','symptomDuration'])]) {
    test(`${treatment}: rejects missing ${field} before contacting providers`,async()=>{
      const f = fixture();
      assert.equal((await invoke(f.handler,{...base,[field]:''})).statusCode,400);
      assert.equal(f.calls.length,0);
    });
  }
  for (const [label,fields] of [
    ['wrong landing',{source:'/visita-trattamento-ortondonzia/'}],
    ['wrong form kind',{kind:'callback'}], ['unknown age',{ageRange:'45–59 anni'}],
    ['unknown reason',{problem:'Diagnosi automatica'}], ['missing consent',{privacyConsent:false}],
  ]) test(`${treatment}: rejects ${label}`,async()=>{
    const f = fixture();
    assert.equal((await invoke(f.handler,{...base,...fields})).statusCode,400);
    assert.equal(f.calls.length,0);
  });
  for (const provider of [crmUrl,'https://api.resend.com/emails']) test(`${treatment}: does not acknowledge success after a provider failure`,async()=>{
    const f = fixture(provider), res = await invoke(f.handler,base);
    assert.equal(res.statusCode,502); assert.equal(res.body.ok,false); assert.equal(res.body.requestId,undefined);
  });
}

test('orthodontic quiz keeps all existing alignment and bite answers',()=>{
  for (const {value:problem} of orthodonticConcerns) for (const {value:occlusion} of orthodonticBites) {
    const data = validateBooking({...payload('ortodonzia'),problem,occlusion});
    assert.equal(data.problem,problem); assert.equal(data.occlusion,occlusion);
  }
});
test('periodontal consultation quiz submits without the removed current-problem answer', async()=>{
  const base = payload('parodontologia');
  const data = validateBooking(base);
  assert.equal(data.problem, '');
  const f = fixture(), res = await invoke(f.handler, base);
  assert.equal(res.statusCode, 200);
  assert.deepEqual(res.body, {ok:true, requestId:base.requestId});
  const email = f.calls.find(call=>call.url!==crmUrl).body;
  const crm = f.calls.find(call=>call.url===crmUrl).body;
  for (const text of [email.text, crm.messaggio]) {
    assert.doesNotMatch(text, /Motivo della richiesta:/);
    assert.ok(text.includes(base.periodontalSymptom));
    assert.ok(text.includes(base.symptomDuration));
  }
  assert.equal(validateBooking({...base, problem:''}).problem, '');
});
test('periodontal quiz still accepts answers from forms opened before the current-problem step was removed',()=>{
  for (const option of landingBookingTreatments.parodontologia.options) {
    const base = {...payload('parodontologia'),problem:option.value};
    const crm = buildSheetPayload(validateBooking(base),env);
    assert.ok(crm.messaggio.includes(`Motivo della richiesta: ${option.value}`));
    assert.ok(crm.messaggio.includes(`Segnale riferito nel questionario parodontale: ${base.periodontalSymptom}`));
  }
});
test('orthodontic consultation quiz cannot replace the age range with a legacy exact age or add timing answers',()=>{
  assert.throws(()=>validateBooking({...payload('ortodonzia'),ageRange:'',patientAge:'30'}),/passaggi/);
  assert.throws(()=>validateBooking({...payload('ortodonzia'),patientAge:'30'}),/età/);
  assert.throws(()=>validateBooking({...payload('ortodonzia'),availability:'Tra 1 e 3 mesi'}),/risposte/);
});

const [adsModule, summaryModule, attributionModule, submitModule] = await Promise.all([
  '../src/utils/googleAds.js', '../src/utils/bookingSummary.js', '../src/utils/attribution.js', '../src/utils/submitBooking.ts',
].map(path => readFile(new URL(path, import.meta.url), 'utf8')));
const moduleCode = source => source.replace(/^import .*;\n/gm, '').replace(/^export /gm, '');
const clientCode = `(() => {
  const ads = (() => { ${moduleCode(adsModule)}; return { initGoogleAds, rememberConfirmedLead }; })();
  const summary = (() => { ${moduleCode(summaryModule)}; return { clearBookingSummary, rememberConfirmedBookingSummary, consumeConfirmedBookingSummary }; })();
  const attribution = (() => { ${moduleCode(attributionModule)}; return { getBookingAttribution }; })();
  const submit = (() => {
    const { rememberConfirmedLead } = ads;
    const { clearBookingSummary, rememberConfirmedBookingSummary } = summary;
    const { getBookingAttribution } = attribution;
    ${moduleCode(stripTypeScriptTypes(submitModule))};
    return submitBooking;
  })();
  return { ...summary, initGoogleAds: ads.initGoogleAds, submitBooking: submit };
})()`;

function clientPage(treatment, handler, { preference = 'accept', email = '', storage = new Map(), thankYou = false, mismatch = false } = {}) {
  const base = { ...payload(treatment), email };
  const redirects = [], requests = [], scripts = [], attrs = new Map();
  const path = thankYou ? '/thank-you-page/' : base.source;
  const url = new URL(`${origin}${path}?utm_source=google&utm_medium=cpc&creative=123`);
  const window = { location: { protocol: url.protocol, hostname: url.hostname, origin, pathname: path, href: url.href, search: url.search, assign: path => redirects.push(path) } };
  const button = { innerHTML: 'Invia la richiesta', textContent: 'Invia la richiesta', disabled: false };
  const fields = Object.entries(base).filter(([key]) => !['kind', 'source', 'requestId', 'privacyConsent'].includes(key) && !key.startsWith('attribution'));
  const form = {
    dataset: { bookingKind: base.kind }, fields: new Map([...fields, ['privacyConsent', 'on']]),
    querySelectorAll: () => [button], setAttribute: (key, value) => attrs.set(key, value), removeAttribute: key => attrs.delete(key),
  };
  const api = runInNewContext(clientCode, {
    window, Date, URL, URLSearchParams, crypto: webcrypto, AbortSignal, quizConsultationFlows, getPeriodontalSymptomLabel,
    FormData: class { constructor(form) { this.fields = form.fields; } entries() { return this.fields.entries(); } },
    document: {
      documentElement: { dataset: { cookiePreference: preference } }, referrer: '', addEventListener() {},
      createElement: () => ({ addEventListener(name, callback) { this[name] = callback; } }),
      head: { append: script => scripts.push(script) },
    },
    sessionStorage: {
      getItem: key => storage.get(key) ?? null,
      setItem: (key, value) => storage.set(key, value), removeItem: key => storage.delete(key),
    },
    fetch: async (url, options) => {
      const body = JSON.parse(options.body); requests.push({ url, body });
      const response = await invoke(handler, body);
      return { ok: response.statusCode === 200, json: async () => mismatch ? { ...response.body, requestId: 'unconfirmed-id' } : response.body };
    },
  });
  return {
    ...api, base, form, button, attrs, storage, scripts, redirects, requests,
    load: () => scripts[0]?.load(),
    events: () => JSON.parse(JSON.stringify((window.dataLayer || []).map(args => Array.from(args)))).filter(call => call[0] === 'event'),
  };
}

for (const treatment of Object.keys(quizConsultationFlows)) {
  for (const preference of ['accept', 'reject']) {
    test(`${treatment}: contact submit reaches CRM, thank-you summary and conversion with Ads consent ${preference}`, async () => {
      const f = fixture();
      const client = clientPage(treatment, f.handler, { preference, email: preference === 'accept' ? 'prova@example.com' : '' });
      client.initGoogleAds(); client.load();
      const errors = [];
      await client.submitBooking(client.form, error => { if (error) errors.push(error); });
      assert.deepEqual(errors, []);
      assert.deepEqual(client.redirects, ['/thank-you-page/']);
      assert.equal(f.calls.length, client.base.email ? 3 : 2);
      const sent = client.requests[0].body;
      const crm = f.calls.find(call => call.url === crmUrl).body;
      assert.equal(crm.nomeCognome, client.base.fullName);
      assert.equal(crm.telefono, client.base.phone);
      assert.equal(crm.email, client.base.email);
      assert.equal(crm.provenienza, 'Google Ads');
      assert.equal(crm.idAnnuncio, '123');
      assert.equal(crm.paginaIngresso, client.base.source);
      assert.equal(crm.requestId, sent.requestId);
      assert.equal(sent.privacyConsent, true);
      assert.equal(client.events().length, 0);
      const adsKey = treatment === 'ortodonzia' ? 'fg-confirmed-orthodontic-lead-v1' : 'fg-confirmed-lead-v1';
      if (preference === 'accept') assert.deepEqual(Object.keys(JSON.parse(client.storage.get(adsKey))).sort(), ['createdAt', 'requestId']);
      else assert.equal(client.storage.has(adsKey), false);
      const thanks = clientPage(treatment, f.handler, { preference, storage: client.storage, thankYou: true });
      // Exercise both orders: the summary and conversion consume different keys.
      let summary;
      if (treatment === 'ortodonzia') summary = thanks.consumeConfirmedBookingSummary();
      thanks.initGoogleAds(); thanks.load();
      if (treatment === 'parodontologia') summary = thanks.consumeConfirmedBookingSummary();
      assert.equal(summary.requestId, sent.requestId);
      for (const value of [client.base.fullName, client.base.phone, client.base.office, client.base.ageRange]) {
        assert.ok(summary.rows.some(([, answer]) => answer === value));
      }
      assert.equal(summary.rows.some(([label]) => label === 'Email'), Boolean(client.base.email));
      const events = thanks.events();
      assert.equal(events.length, preference === 'accept' ? 1 : 0);
      if (events.length) {
        assert.equal(events[0][2].send_to, treatment === 'ortodonzia' ? 'AW-988575526/gUQ-COLP2aodEKbusdcD' : 'AW-988575526/I2pSCNjTzaodEKbusdcD');
        assert.equal(events[0][2].transaction_id, sent.requestId);
        assert.deepEqual(events[0][2].user_data, {});
        for (const value of [client.base.fullName, client.base.phone, client.base.email]) assert.ok(!JSON.stringify(events).includes(value));
      }
      const reload = clientPage(treatment, f.handler, { preference, storage: client.storage, thankYou: true });
      reload.initGoogleAds(); reload.load();
      assert.equal(reload.consumeConfirmedBookingSummary(), null);
      assert.equal(reload.events().length, 0);
    });
  }
  for (const failure of [crmUrl, 'https://api.resend.com/emails', 'mismatched acknowledgement']) {
    test(`${treatment}: contact submit failure cannot create a summary, redirect or conversion (${failure})`, async () => {
      const f = fixture(failure);
      const client = clientPage(treatment, f.handler, { mismatch: failure === 'mismatched acknowledgement' });
      client.initGoogleAds(); client.load();
      const errors = [];
      await client.submitBooking(client.form, error => { if (error) errors.push(error); });
      assert.equal(errors.length, 1);
      assert.deepEqual(client.redirects, []);
      assert.equal(client.consumeConfirmedBookingSummary(), null);
      assert.equal([...client.storage.keys()].some(key => key.startsWith('fg-confirmed-')), false);
      assert.equal(client.events().length, 0);
      assert.equal(client.attrs.has('aria-busy'), false);
      assert.equal(client.button.disabled, false);
    });
  }
}
