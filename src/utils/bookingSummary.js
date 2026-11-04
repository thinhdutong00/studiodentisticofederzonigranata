import { quizConsultationFlows } from '../data/quizConsultation.js';
import { getPeriodontalSymptomLabel } from '../data/periodontalQuiz.js';

export const BOOKING_SUMMARY_KEY = 'fg-booking-summary-v1';
const SUMMARY_TTL = 30 * 60 * 1000;
const REQUEST_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function normalizeSummary(data) {
  if (!data || typeof data !== 'object' || typeof data.requestId !== 'string' || !REQUEST_ID.test(data.requestId)) return null;
  const flow = Object.entries(quizConsultationFlows).find(([, config]) => config.marker === data.quizFlow
    && config.kind === data.kind && [config.source, config.source.slice(0, -1)].includes(data.source));
  if (!flow) return null;
  const isOrtho = flow[0] === 'ortodonzia';
  const fields = [
    ['Nome e cognome', 'fullName'], ['Obiettivo', isOrtho ? 'initialReason' : 'periodontalObjective'],
    ...(isOrtho ? [['Allineamento', 'problem'], ['Chiusura delle arcate', 'occlusion']]
      : [['Segnale notato', 'periodontalSymptom'], ['Da quanto tempo', 'symptomDuration']]),
    ['Età del paziente', 'ageRange'], ['Studio', 'office'], ['Telefono', 'phone'], ['Email', 'email'],
  ];
  const stored = { requestId: data.requestId, kind: data.kind, source: data.source, quizFlow: data.quizFlow };
  const rows = [['Servizio', isOrtho ? 'Ortodonzia' : 'Parodontologia']];
  for (const [label, name] of fields) {
    const answer = data[name] ?? '';
    const maxLength = name === 'fullName' ? 120 : name === 'phone' ? 30 : 254;
    if (typeof answer !== 'string' || answer.length > maxLength || /[\u0000-\u001f\u007f]/.test(answer)
      || (name !== 'email' && !answer.trim())) return null;
    stored[name] = answer.trim();
    if (stored[name]) rows.push([label, name === 'periodontalSymptom' ? getPeriodontalSymptomLabel(stored[name]) : stored[name]]);
  }
  return { stored, rows };
}

export function clearBookingSummary() {
  try { sessionStorage.removeItem(BOOKING_SUMMARY_KEY); } catch { /* Optional browser storage. */ }
}

// Called only after the server confirms this request. Separate from all Ads keys.
export function rememberConfirmedBookingSummary(data) {
  clearBookingSummary();
  try {
    const summary = normalizeSummary(data);
    if (summary) sessionStorage.setItem(BOOKING_SUMMARY_KEY, JSON.stringify({ ...summary.stored, createdAt: Date.now() }));
  } catch { /* A missing summary must never block confirmation or conversion tracking. */ }
}

export function consumeConfirmedBookingSummary() {
  try {
    const raw = sessionStorage.getItem(BOOKING_SUMMARY_KEY);
    // Keep patient data only for the redirect; refresh/direct visits show the generic page.
    sessionStorage.removeItem(BOOKING_SUMMARY_KEY);
    const receipt = JSON.parse(raw || 'null');
    const now = Date.now();
    if (!receipt || !Number.isFinite(receipt.createdAt) || receipt.createdAt > now || now - receipt.createdAt > SUMMARY_TTL) return null;
    const summary = normalizeSummary(receipt);
    return summary ? { requestId: summary.stored.requestId, rows: summary.rows } : null;
  } catch { return null; }
}

export function renderBookingSummary() {
  const section = document.querySelector('[data-booking-summary]');
  const list = section?.querySelector('dl');
  if (!section || !list) return;
  const summary = consumeConfirmedBookingSummary();
  if (!summary) return;
  const rows = summary.rows.map(([label, answer]) => {
    const row = document.createElement('div');
    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = label;
    description.textContent = answer;
    row.append(term, description);
    return row;
  });
  list.replaceChildren(...rows);
  section.hidden = false;
}
