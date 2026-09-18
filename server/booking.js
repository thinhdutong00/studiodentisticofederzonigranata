import { createHash } from 'node:crypto';

export const RECIPIENT = 'info.federzonigranata@gmail.com';
const MAX_BYTES = 24_000;
const EMAIL = /^[^\s<>@]+@[^\s<>@]+\.[^\s<>@]+$/;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const KINDS = {
  'first-visit': 'Prima visita',
  urgent: 'Urgenza',
  treatment: 'Valutazione di un trattamento',
  contact: 'Informazioni',
  callback: 'Richiesta di richiamata',
};
const LABELS = {
  fullName: 'Nome e cognome', phone: 'Telefono', email: 'Email',
  office: 'Sede preferita', ageRange: 'Fascia di età',
  visitReason: 'Motivo della prima visita', visitGoal: 'Obiettivo della visita',
  emergencyType: 'Tipo di urgenza', symptom: 'Sintomi', painLevel: 'Dolore (0–10)',
  treatment: 'Trattamento', treatmentCategory: 'Categoria', problem: 'Motivo della richiesta',
  initialReason: 'Preferenza indicata nella pagina del trattamento',
  availability: 'Disponibilità', preferredDate: 'Data preferita', preferredTime: 'Orario preferito',
  notes: 'Note', message: 'Messaggio', details: 'Dettagli',
  otherDetails: 'Altri sintomi o informazioni', otherRequest: 'Altra esigenza',
  source: 'Pagina di provenienza',
};
const LONG_FIELDS = new Set(['notes', 'message', 'details', 'otherDetails', 'otherRequest']);
const REQUIRED = {
  'first-visit': ['visitReason', 'visitGoal', 'ageRange', 'office', 'availability'],
  urgent: ['emergencyType', 'symptom', 'painLevel', 'ageRange', 'office', 'availability'],
  treatment: ['treatment', 'ageRange', 'office', 'preferredDate', 'preferredTime'],
  contact: [], callback: [],
};

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
    if (typeof value !== 'string' || value.length > (LONG_FIELDS.has(key) ? 3000 : key === 'source' ? 500 : 254) || /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/.test(value)) {
      throw new RequestError(400, 'Uno dei campi contiene un valore non valido o troppo lungo.');
    }
    data[key] = value.trim();
    if (!LONG_FIELDS.has(key) && /[\r\n]/.test(value)) throw new RequestError(400, 'Uno dei campi contiene un valore non valido.');
  }
  if (data.fullName.length < 2 || data.fullName.length > 120 || !/^[+\d\s()./-]{6,30}$/.test(data.phone) || data.phone.replace(/\D/g, '').length < 6) {
    throw new RequestError(400, 'Controlla nome e numero di telefono.');
  }
  if ((data.kind !== 'callback' || data.email) && !EMAIL.test(data.email)) {
    throw new RequestError(400, 'Inserisci un indirizzo email valido.');
  }
  if (input.privacyConsent !== true) throw new RequestError(400, 'Accetta l’informativa privacy per inviare la richiesta.');
  if (REQUIRED[data.kind].some((key) => !data[key])) throw new RequestError(400, 'Completa tutti i passaggi del modulo prima di inviare.');
  if (data.office && !['Modena', 'Reggio Emilia'].includes(data.office)) throw new RequestError(400, 'Seleziona una sede valida.');
  if (data.source && (!data.source.startsWith('/') || data.source.startsWith('//') || /[?#]/.test(data.source))) throw new RequestError(400, 'Pagina di provenienza non valida.');
  if (data.kind === 'urgent') {
    if (!/^(?:[0-9]|10)$/.test(data.painLevel)) throw new RequestError(400, 'Seleziona un livello di dolore valido.');
    if ((data.emergencyType === 'Altro' || data.symptom === 'Altro') && data.otherDetails.length < 10) throw new RequestError(400, 'Descrivi brevemente i sintomi.');
  }
  if (data.kind === 'treatment') {
    if (data.treatment === 'Altro' ? data.otherRequest.length < 10 : !data.problem) throw new RequestError(400, 'Completa il motivo della richiesta.');
    const date = new Date(`${data.preferredDate}T12:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(data.preferredDate) || !Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== data.preferredDate || !['09:00', '10:00', '11:00', '14:30', '15:30', '16:30', '17:30'].includes(data.preferredTime)) {
      throw new RequestError(400, 'Seleziona una data e un orario validi.');
    }
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
      `Riferimento richiesta: ${data.requestId}`,
      'Le preferenze di appuntamento devono essere confermate dalla segreteria.',
    ].join('\n'),
  };
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
      if (!env.RESEND_API_KEY || !from || /[\r\n]/.test(from)) {
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
      const key = createHash('sha256').update(JSON.stringify(email)).digest('hex');
      let response;
      let result;
      try {
        response = await send('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `booking-${key}` },
          body: JSON.stringify(email), signal: AbortSignal.timeout(12_000),
        });
        result = await response.json();
      } catch {
        throw new RequestError(502, 'Non siamo riusciti a confermare l’invio. Riprova tra poco oppure contatta lo studio.');
      }
      if (!response.ok || typeof result?.id !== 'string' || !result.id) {
        // Never log patient data, keys or the provider response body.
        console.error('Booking email provider rejected request', response.status);
        throw new RequestError(502, 'Non siamo riusciti a confermare l’invio. Riprova tra poco oppure contatta lo studio.');
      }
      return json(res, 200, { ok: true, requestId: data.requestId });
    } catch (error) {
      const status = error instanceof RequestError ? error.status : 400;
      return json(res, status, { ok: false, error: error instanceof RequestError ? error.message : 'Richiesta non valida. Controlla i campi e riprova.' });
    }
  };
}
