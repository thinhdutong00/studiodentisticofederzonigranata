import { createHash } from 'node:crypto';
import { orthodonticAgeRanges, orthodonticBites, orthodonticConcerns, orthodonticObjectives, orthodonticTimings, orthodonticVisitGoals } from '../src/data/orthodonticQuiz.js';
import { periodontalAgeRanges, periodontalDurations, periodontalObjectives, periodontalSymptoms } from '../src/data/periodontalQuiz.js';
import { getLandingBookingConfig, landingBookingAges, landingBookingTimes, validLandingBookingDays } from '../src/data/landingBooking.js';

export const RECIPIENT = 'info.federzonigranata@gmail.com';
const MAX_BYTES = 24_000;
const EMAIL = /^[^\s<>@,;]+@[^\s<>@,;]+\.[^\s<>@,;]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const TIME_SLOTS = ['09:00', '10:00', '11:00', '14:30', '15:30', '16:30', '17:30'];
const MAX_PREFERRED_DATES = 2;
const MAX_PREFERRED_TIMES = 2;
const KINDS = {
  'first-visit': 'Prima visita',
  urgent: 'Urgenza',
  treatment: 'Valutazione di un trattamento',
  contact: 'Informazioni',
  callback: 'Richiesta di richiamata',
  'landing-consultation': 'Richiesta di visita',
  'orthodontic-quiz': 'Quiz ortodonzia',
  'periodontal-quiz': 'Questionario parodontologia',
};
const LABELS = {
  fullName: 'Nome e cognome', phone: 'Telefono', email: 'Email',
  office: 'Sede preferita', ageRange: 'Fascia di età',
  visitReason: 'Motivo della prima visita', visitGoal: 'Obiettivo della visita',
  emergencyType: 'Tipo di urgenza', symptom: 'Sintomi', painLevel: 'Dolore (0–10)',
  treatment: 'Trattamento', treatmentCategory: 'Categoria', problem: 'Motivo della richiesta',
  initialReason: 'Preferenza indicata nella pagina del trattamento',
  availability: 'Disponibilità', preferredDates: 'Giorni preferiti', preferredTimes: 'Orari preferiti',
  notes: 'Note', message: 'Messaggio', details: 'Dettagli',
  otherDetails: 'Altri sintomi o informazioni', otherRequest: 'Altra esigenza',
  source: 'Pagina di provenienza',
  patientAge: 'Età del paziente', occlusion: 'Morso indicato nel questionario',
  periodontalObjective: 'Obiettivo della valutazione parodontale',
  periodontalSymptom: 'Segnale riferito nel questionario parodontale',
  symptomDuration: 'Da quanto tempo è stato notato il segnale',
};
const LONG_FIELDS = new Set(['notes', 'message', 'details', 'otherDetails', 'otherRequest']);
const REQUIRED = {
  'first-visit': ['visitReason', 'visitGoal', 'ageRange', 'office', 'availability'],
  urgent: ['emergencyType', 'symptom', 'painLevel', 'ageRange', 'office', 'availability'],
  treatment: ['treatment', 'ageRange', 'office', 'preferredDates', 'preferredTimes'],
  contact: [], callback: [],
  'landing-consultation': ['problem', 'ageRange', 'office', 'availability', 'preferredTimes'],
  'orthodontic-quiz': ['patientAge', 'problem', 'occlusion', 'office', 'availability'],
  'periodontal-quiz': ['periodontalObjective', 'ageRange', 'periodontalSymptom', 'symptomDuration', 'office'],
};
const ATTRIBUTION_FIELDS = {
  attributionSource: 300,
  attributionMedium: 300,
  attributionCampaign: 300,
  attributionCampaignId: 64,
  attributionAdGroupId: 64,
  attributionAdId: 64,
  attributionKeyword: 300,
  attributionReferrer: 500,
  attributionLandingPage: 500,
  clickIdType: 10,
};
const CLICK_ID_TYPES = ['', 'gclid', 'gbraid', 'wbraid'];
const SITE_HOSTS = new Set(['studiodentisticofederzonigranata.it', 'www.studiodentisticofederzonigranata.it']);
const SHEET_RECORD_TYPES = new Set(['REALE', 'TEST']);
const BOOKING_ERROR = 'Non siamo riusciti a confermare l’invio. Riprova tra poco oppure contatta lo studio.';

class RequestError extends Error {
  constructor(status, message) { super(message); this.status = status; }
}

export function validateBooking(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input) || typeof input.kind !== 'string' || !Object.hasOwn(KINDS, input.kind)) {
    throw new RequestError(400, 'Modulo non valido. Ricarica la pagina e riprova.');
  }
  if (input.website) throw new RequestError(400, 'Invio non consentito.');
  if (typeof input.requestId !== 'string' || !UUID.test(input.requestId)) throw new RequestError(400, 'Ricarica la pagina e riprova.');
  const data = { kind: input.kind, requestId: input.requestId };
  for (const key of Object.keys(LABELS)) {
    const value = input[key] ?? '';
    const maxLength = LONG_FIELDS.has(key) ? 3000 : key === 'preferredDates' ? 1024 : key === 'source' ? 500 : 254;
    if (typeof value !== 'string' || value.length > maxLength || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) {
      throw new RequestError(400, 'Uno dei campi contiene un valore non valido o troppo lungo.');
    }
    data[key] = value.trim();
    if (!LONG_FIELDS.has(key) && /[\r\n]/.test(value)) throw new RequestError(400, 'Uno dei campi contiene un valore non valido.');
  }
  for (const [key, maxLength] of Object.entries(ATTRIBUTION_FIELDS)) {
    const value = input[key] ?? '';
    if (typeof value !== 'string' || value.length > maxLength || /[\u0000-\u001f\u007f\r\n]/.test(value)) {
      throw new RequestError(400, 'I dati di provenienza non sono validi.');
    }
    data[key] = value.trim();
  }
  if (data.fullName.length < 2 || data.fullName.length > 120 || !/^[+\d\s()./-]{6,30}$/.test(data.phone) || data.phone.replace(/\D/g, '').length < 6) {
    throw new RequestError(400, 'Controlla nome e numero di telefono.');
  }
  if ((!['callback', 'landing-consultation'].includes(data.kind) || data.email) && !EMAIL.test(data.email)) {
    throw new RequestError(400, 'Inserisci un indirizzo email valido.');
  }
  if (input.privacyConsent !== true) throw new RequestError(400, 'Accetta l’informativa privacy per inviare la richiesta.');
  const mobileOrthodonticQuiz = data.kind === 'orthodontic-quiz' && input.quizFlow === 'orthodontic-mobile-v2' && ['/visita-ortodonzia/', '/visita-ortodonzia'].includes(data.source);
  const rangedOrthodonticQuiz = mobileOrthodonticQuiz && Boolean(data.ageRange);
  const requiredFields = REQUIRED[data.kind].filter(key => !(mobileOrthodonticQuiz && key === 'availability') && !(rangedOrthodonticQuiz && key === 'patientAge'));
  if (mobileOrthodonticQuiz) requiredFields.push('initialReason');
  if (requiredFields.some((key) => !data[key])) throw new RequestError(400, 'Completa tutti i passaggi del modulo prima di inviare.');
  if (data.office && !['Modena', 'Reggio Emilia'].includes(data.office)) throw new RequestError(400, 'Seleziona una sede valida.');
  if (data.source && (!data.source.startsWith('/') || data.source.startsWith('//') || /[?#]/.test(data.source))) throw new RequestError(400, 'Pagina di provenienza non valida.');
  if (data.attributionLandingPage && (!data.attributionLandingPage.startsWith('/') || data.attributionLandingPage.startsWith('//') || /[?#]/.test(data.attributionLandingPage))) {
    throw new RequestError(400, 'Pagina di ingresso non valida.');
  }
  if (!CLICK_ID_TYPES.includes(data.clickIdType)) throw new RequestError(400, 'Identificativo pubblicitario non valido.');
  if (data.attributionReferrer) {
    try {
      const referrer = new URL(data.attributionReferrer);
      if (!['http:', 'https:'].includes(referrer.protocol) || referrer.search || referrer.hash) throw new Error('invalid');
    } catch {
      throw new RequestError(400, 'Provenienza esterna non valida.');
    }
  }
  if (data.kind === 'landing-consultation') {
    const config = getLandingBookingConfig(data.source);
    if (!config || !config.options.some(option => option.value === data.problem)
      || !landingBookingAges.includes(data.ageRange) || !validLandingBookingDays(data.availability)
      || !landingBookingTimes.some(time => time.value === data.preferredTimes)) {
      throw new RequestError(400, 'Controlla le risposte del modulo di prenotazione prima di inviare.');
    }
    data.treatment = config.treatment;
  }
  if (data.kind === 'urgent') {
    if (!/^(?:[0-9]|10)$/.test(data.painLevel)) throw new RequestError(400, 'Seleziona un livello di dolore valido.');
    if ((data.emergencyType === 'Altro' || data.symptom === 'Altro') && data.otherDetails.length < 10) throw new RequestError(400, 'Descrivi brevemente i sintomi.');
  }
  if (data.kind === 'orthodontic-quiz') {
    if (data.ageRange) {
      if (!rangedOrthodonticQuiz || data.patientAge || !orthodonticAgeRanges.some(range => range.value === data.ageRange)) {
        throw new RequestError(400, 'Seleziona una fascia di età tra le opzioni del questionario.');
      }
    } else if (!/^\d{1,3}$/.test(data.patientAge) || Number(data.patientAge) < 1 || Number(data.patientAge) > 100) {
      throw new RequestError(400, 'Inserisci un’età valida tra 1 e 100 anni.');
    }
    const choices = [
      [data.problem, orthodonticConcerns.map(option => option.value)],
      [data.occlusion, orthodonticBites.map(option => option.value)],
      [data.availability, mobileOrthodonticQuiz ? ['', ...orthodonticTimings] : orthodonticTimings],
      [data.visitGoal, ['', ...orthodonticVisitGoals]],
      [data.initialReason, ['', ...orthodonticObjectives.map(option => option.title)]],
    ];
    if (choices.some(([value, options]) => !options.includes(value))) {
      throw new RequestError(400, 'Seleziona le risposte tra le opzioni del questionario.');
    }
    data.treatment = 'Ortodonzia e allineatori';
  }
  if (data.kind === 'periodontal-quiz') {
    const choices = [
      [data.periodontalObjective, periodontalObjectives.map(option => option.title)],
      [data.ageRange, periodontalAgeRanges.map(option => option.value)],
      [data.periodontalSymptom, periodontalSymptoms],
      [data.symptomDuration, periodontalDurations],
    ];
    if (!['/visita-parodontologia/', '/visita-parodontologia'].includes(data.source) || choices.some(([value, options]) => !options.includes(value))) {
      throw new RequestError(400, 'Seleziona le risposte tra le opzioni del questionario parodontale.');
    }
    if (data.patientAge || data.problem || data.occlusion || data.initialReason || data.visitGoal || data.availability || data.preferredDates || data.preferredTimes) {
      throw new RequestError(400, 'I dati del questionario parodontale non sono validi. Ricarica la pagina e riprova.');
    }
    data.treatment = 'Parodontologia';
    data.treatmentCategory = 'Salute delle gengive e dei tessuti di sostegno';
  }
  if (data.kind === 'treatment') {
    if (data.treatment === 'Altro' ? data.otherRequest.length < 10 : !data.problem) throw new RequestError(400, 'Completa il motivo della richiesta.');
    const preferredDates = data.preferredDates.split(',').map((value) => value.trim()).filter(Boolean);
    const preferredTimes = data.preferredTimes.split(',').map((value) => value.trim()).filter(Boolean);
    const datesAreValid = preferredDates.every((value) => {
      const date = new Date(`${value}T12:00:00Z`);
      return /^\d{4}-\d{2}-\d{2}$/.test(value) && Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
    });
    const selectionsAreUnique =
      new Set(preferredDates).size === preferredDates.length && new Set(preferredTimes).size === preferredTimes.length;

    if (
      preferredDates.length === 0 ||
      preferredDates.length > MAX_PREFERRED_DATES ||
      preferredTimes.length === 0 ||
      preferredTimes.length > MAX_PREFERRED_TIMES ||
      !datesAreValid ||
      !preferredTimes.every((value) => TIME_SLOTS.includes(value)) ||
      !selectionsAreUnique
    ) {
      throw new RequestError(400, 'Puoi selezionare al massimo due date e due orari validi.');
    }
    if (input.scheduleAcknowledged !== true) {
      throw new RequestError(400, 'Conferma di aver compreso che l’appuntamento sarà definito dalla segreteria.');
    }
    data.preferredDates = preferredDates.join(', ');
    data.preferredTimes = preferredTimes.join(', ');
    data.scheduleAcknowledged = true;
  }
  return data;
}

export function buildEmail(data, from) {
  const lines = Object.entries(LABELS).filter(([key]) => data[key]).map(([key, label]) => `${label}: ${data[key]}`);
  return {
    from,
    to: [RECIPIENT],
    ...(data.email ? { reply_to: data.email } : {}),
    subject: `Sito Federzoni Granata — ${KINDS[data.kind]}${data.office ? ` — ${data.office}` : ''}`,
    text: [
      `Nuova richiesta dal sito: ${KINDS[data.kind]}`, '', ...lines, '',
      'Consenso al trattamento dei dati per gestire la richiesta: espresso nel modulo.',
      ...(data.kind === 'treatment'
        ? ['Presa visione del carattere indicativo delle preferenze di appuntamento: confermata nel modulo.']
        : []),
      `Riferimento richiesta: ${data.requestId}`,
      'Le preferenze di appuntamento devono essere confermate dalla segreteria.',
    ].join('\n'),
  };
}

export function buildPatientReceipt(data, from) {
  if (!data.email) return null;
  const informationRequest = data.kind === 'contact' || data.kind === 'callback';
  return {
    from,
    to: [data.email],
    reply_to: RECIPIENT,
    subject: 'Abbiamo ricevuto la tua richiesta — Studio Dentistico Federzoni Granata',
    text: [
      `Ciao ${data.fullName},`, '',
      'grazie per aver contattato lo Studio Dentistico Federzoni Granata. Abbiamo ricevuto la tua richiesta.', '',
      informationRequest
        ? 'La segreteria ti ricontatterà per rispondere alla tua richiesta.'
        : 'La segreteria ti ricontatterà per verificare i dettagli e concordare giorno e orario della visita.', '',
      'Questa email conferma la ricezione della richiesta, non la prenotazione di un appuntamento. Giorno e orario della visita devono essere confermati dalla segreteria.', '',
      'Per qualsiasi necessità puoi rispondere a questa email oppure contattare lo studio:',
      'Modena: +39 059 345557',
      'Reggio Emilia: +39 0522 436618', '',
      'Studio Dentistico Federzoni Granata',
      `Riferimento richiesta: ${data.requestId}`, '',
      'Visita il nostro sito: https://studiodentisticofederzonigranata.it/',
    ].join('\n'),
  };
}

function normalizedSignal(value) {
  return String(value || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
}

function parsedReferrer(value) {
  try { return value ? new URL(value) : null; }
  catch { return null; }
}

export function classifyAttribution(data) {
  const source = normalizedSignal(data.attributionSource);
  const medium = normalizedSignal(data.attributionMedium);
  const campaign = normalizedSignal(data.attributionCampaign);
  const referrer = parsedReferrer(data.attributionReferrer);
  const host = referrer?.hostname.toLowerCase() || '';
  const path = referrer?.pathname.toLowerCase() || '';
  const googleReferrer = /(^|\.)google\.[a-z.]+$/.test(host);
  const mapsToken = new Set(['google_maps', 'google_business_profile', 'gbp', 'maps']);
  const paidMedium = new Set(['cpc', 'ppc', 'paid', 'paid_search', 'paidsearch', 'display']);
  const organicMedium = new Set(['organic', 'seo', 'search']);

  if (data.clickIdType || (source === 'google' && paidMedium.has(medium))) return 'Google Ads';
  if (mapsToken.has(source) || mapsToken.has(medium) || (googleReferrer && /^\/maps(?:\/|$)/.test(path))) return 'Google Maps';
  if ((source === 'google' && organicMedium.has(medium)) || googleReferrer) return 'Google organico';

  if (source) return source === 'google' ? 'Non rilevata' : 'Altro';
  if (referrer && !SITE_HOSTS.has(host)) return 'Altro';
  if (medium || campaign) return 'Non rilevata';
  if (!referrer) return 'Diretto';
  return 'Non rilevata';
}

function buildSheetMessage(data) {
  const keys = [
    'visitReason', 'visitGoal', 'emergencyType', 'symptom', 'painLevel', 'problem',
    'initialReason', 'notes', 'message', 'details', 'otherDetails', 'otherRequest', 'ageRange', 'patientAge', 'occlusion',
    'periodontalObjective', 'periodontalSymptom', 'symptomDuration',
  ];
  return keys
    .filter((key) => data[key])
    .map((key) => `${LABELS[key]}: ${data[key]}`)
    .join('\n')
    .slice(0, 3000);
}

export function buildSheetPayload(data, env) {
  return {
    secret: env.GOOGLE_SHEETS_WEBHOOK_SECRET,
    requestId: data.requestId,
    nomeCognome: data.fullName,
    telefono: data.phone,
    email: data.email,
    sede: data.office,
    servizio: data.treatment || KINDS[data.kind],
    giorniPreferiti: data.preferredDates || data.availability || '',
    orariPreferiti: data.preferredTimes || '',
    messaggio: buildSheetMessage(data),
    provenienza: classifyAttribution(data),
    pagina: data.source,
    campagna: data.attributionCampaign || '',
    idCampagna: data.attributionCampaignId || '',
    idGruppoAnnunci: data.attributionAdGroupId || '',
    idAnnuncio: data.attributionAdId || '',
    parolaChiave: data.attributionKeyword || '',
    paginaIngresso: data.attributionLandingPage || '',
    recordType: env.GOOGLE_SHEETS_RECORD_TYPE === 'TEST' ? 'TEST' : 'REALE',
  };
}

function validWebhookUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && url.hostname === 'script.google.com' && /^\/macros\/s\/[^/]+\/exec$/.test(url.pathname);
  } catch {
    return false;
  }
}

async function parseJsonResponse(response) {
  try { return await response.json(); } catch { return null; }
}

async function deliverEmail(send, env, email, timeoutMs = 12_000) {
  let response;
  try {
    const key = createHash('sha256').update(JSON.stringify(email)).digest('hex');
    response = await send('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `booking-${key}` },
      body: JSON.stringify(email),
      signal: AbortSignal.timeout(timeoutMs),
    });
  } catch {
    console.error('Booking email provider request failed');
    throw new RequestError(502, BOOKING_ERROR);
  }
  const result = await parseJsonResponse(response);
  if (!response.ok || typeof result?.id !== 'string' || !result.id) {
    console.error('Booking email provider rejected request', response.status);
    throw new RequestError(502, BOOKING_ERROR);
  }
}

async function deliverSheet(send, env, data) {
  let response;
  const payload = buildSheetPayload(data, env);
  try {
    response = await send(env.GOOGLE_SHEETS_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      redirect: 'follow',
      signal: AbortSignal.timeout(45_000),
    });
  } catch (error) {
    console.error('Booking sheet provider request failed', error instanceof Error ? error.name : 'UnknownError');
    throw new RequestError(502, BOOKING_ERROR);
  }
  const result = await parseJsonResponse(response);
  if (
    !response.ok ||
    result?.ok !== true ||
    result.requestId !== payload.requestId ||
    typeof result.duplicate !== 'boolean'
  ) {
    console.error('Booking sheet provider rejected request', response.status);
    throw new RequestError(502, BOOKING_ERROR);
  }
}

async function readBody(req) {
  if (Number(req.headers['content-length']) > MAX_BYTES) throw new RequestError(413, 'La richiesta è troppo lunga. Riduci il testo e riprova.');
  if (req.body !== undefined) {
    const raw = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
    if (Buffer.byteLength(raw) > MAX_BYTES) throw new RequestError(413, 'La richiesta è troppo lunga.');
    return JSON.parse(raw);
  }
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += Buffer.byteLength(chunk);
    if (size > MAX_BYTES) throw new RequestError(413, 'La richiesta è troppo lunga.');
    chunks.push(Buffer.from(chunk));
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.end(JSON.stringify(body));
}

// A small per-instance guard supplements the honeypot and same-origin checks.
// For distributed rate limiting use the hosting firewall (see deployment notes).
export function createBookingHandler({ env = process.env, send = fetch, now = Date.now } = {}) {
  const attempts = new Map();
  return async function bookingHandler(req, res) {
    try {
      if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return json(res, 405, { ok: false, error: 'Metodo non consentito.' }); }
      const origin = req.headers.origin;
      const originUrl = origin ? new URL(origin) : null;
      const local = env.VERCEL !== '1' && ['localhost', '127.0.0.1', '[::1]'].includes(originUrl?.hostname);
      if (!originUrl || originUrl.host !== req.headers.host || (!local && originUrl.protocol !== 'https:') || req.headers['sec-fetch-site'] === 'cross-site') {
        throw new RequestError(403, 'Invia la richiesta dal modulo sul sito.');
      }
      if (!/^application\/json(?:;|$)/i.test(req.headers['content-type'] || '')) throw new RequestError(415, 'Formato della richiesta non valido.');
      const data = validateBooking(await readBody(req));
      const from = env.RESEND_FROM_EMAIL?.trim();
      const webhookUrl = env.GOOGLE_SHEETS_WEBHOOK_URL?.trim();
      const webhookSecret = env.GOOGLE_SHEETS_WEBHOOK_SECRET?.trim();
      const recordType = env.GOOGLE_SHEETS_RECORD_TYPE?.trim() || 'REALE';
      if (
        !env.RESEND_API_KEY ||
        !from ||
        /[\r\n]/.test(from) ||
        !webhookUrl ||
        !validWebhookUrl(webhookUrl) ||
        !webhookSecret ||
        webhookSecret.length < 32 ||
        /[\r\n]/.test(webhookSecret) ||
        !SHEET_RECORD_TYPES.has(recordType)
      ) {
        throw new RequestError(503, 'Invio temporaneamente non disponibile. Contatta lo studio via telefono o email.');
      }
      const timestamp = now();
      for (const [key, value] of attempts) if (value.until <= timestamp) attempts.delete(key);
      // Vercel overwrites x-vercel-forwarded-for; untrusted x-forwarded-for is not used.
      const ip = String(req.headers['x-vercel-forwarded-for'] || req.socket?.remoteAddress || 'unknown');
      const fingerprint = createHash('sha256').update(ip).digest('hex');
      const bucket = attempts.get(fingerprint) || { count: 0, until: timestamp + 600_000 };
      if (bucket.count >= 10 || attempts.size >= 10_000) { res.setHeader('Retry-After', '600'); throw new RequestError(429, 'Troppi tentativi. Attendi qualche minuto o chiama lo studio.'); }
      bucket.count += 1;
      attempts.set(fingerprint, bucket);
      const email = buildEmail(data, from);
      const outcomes = await Promise.allSettled([
        deliverEmail(send, env, email),
        deliverSheet(send, {
          ...env,
          GOOGLE_SHEETS_WEBHOOK_URL: webhookUrl,
          GOOGLE_SHEETS_WEBHOOK_SECRET: webhookSecret,
          GOOGLE_SHEETS_RECORD_TYPE: recordType,
        }, data),
      ]);
      if (outcomes.some((outcome) => outcome.status === 'rejected')) throw new RequestError(502, BOOKING_ERROR);
      const receipt = buildPatientReceipt(data, from);
      if (receipt) {
        try {
          await deliverEmail(send, env, receipt, 8_000);
        } catch {
          // The request is already received: a receipt failure must not prompt a duplicate submission.
          console.error('Booking patient receipt could not be confirmed');
        }
      }
      return json(res, 200, { ok: true, requestId: data.requestId });
    } catch (error) {
      const status = error instanceof RequestError ? error.status : 400;
      return json(res, status, { ok: false, error: error instanceof RequestError ? error.message : 'Richiesta non valida. Controlla i campi e riprova.' });
    }
  };
}
