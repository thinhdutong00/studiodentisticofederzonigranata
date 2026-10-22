import test from 'node:test';
import assert from 'node:assert/strict';
import { Readable } from 'node:stream';
import { validateBooking, createBookingHandler, buildSheetPayload, RECIPIENT } from '../server/booking.js';
import { quizConsultationAges, quizConsultationFlows } from '../src/data/quizConsultation.js';
import { orthodonticObjectives, orthodonticConcerns, orthodonticBites } from '../src/data/orthodonticQuiz.js';
import { periodontalObjectives, periodontalSymptoms, periodontalDurations } from '../src/data/periodontalQuiz.js';
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
      : { periodontalObjective:periodontalObjectives[0].title, periodontalSymptom:periodontalSymptoms[0], symptomDuration:periodontalDurations[0], problem:landingBookingTreatments.parodontologia.options[0].value }),
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
    for (const key of treatment==='ortodonzia' ? ['initialReason','problem','occlusion','ageRange'] : ['periodontalObjective','periodontalSymptom','symptomDuration','problem','ageRange']) {
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
  for (const field of ['fullName','phone','ageRange','office','problem',...(treatment==='ortodonzia'?['occlusion','initialReason']:['periodontalObjective','periodontalSymptom','symptomDuration'])]) {
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
test('periodontal quiz stores the current problem separately from the previously noticed sign',()=>{
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
