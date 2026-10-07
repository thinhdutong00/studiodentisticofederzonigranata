const STORAGE_KEY = 'fg-booking-attribution-v2';
const MAX_VALUE_LENGTH = 300;
const ATTRIBUTION_KEYS = [
  'attributionSource',
  'attributionMedium',
  'attributionCampaign',
  'attributionCampaignId',
  'attributionAdGroupId',
  'attributionAdId',
  'attributionKeyword',
  'attributionReferrer',
  'attributionLandingPage',
  'clickIdType',
];

function clean(value, maxLength = MAX_VALUE_LENGTH) {
  return (value || '').trim().slice(0, maxLength);
}

function safePagePath(value, siteOrigin) {
  try {
    const url = new URL(value, siteOrigin);
    return url.origin === siteOrigin ? url.pathname : '';
  } catch {
    return '';
  }
}

function safeReferrer(value) {
  try {
    const url = new URL(value);
    return `${url.origin}${url.pathname}`.slice(0, 500);
  } catch {
    return '';
  }
}

export function deriveAttribution({ href, origin, search, referrer }) {
  const params = new URLSearchParams(search);
  const clickIdType = ['gclid', 'gbraid', 'wbraid'].find((key) => params.has(key)) || '';
  return {
    attributionSource: clean(params.get('utm_source')),
    attributionMedium: clean(params.get('utm_medium')),
    attributionCampaign: clean(params.get('utm_campaign')),
    attributionCampaignId: clean(params.get('campaignid') || params.get('gad_campaignid') || params.get('utm_id'), 64),
    attributionAdGroupId: clean(params.get('adgroupid'), 64),
    attributionAdId: clean(params.get('creative') || params.get('adid') || params.get('utm_content'), 64),
    attributionKeyword: clean(params.get('keyword') || params.get('utm_term')),
    attributionReferrer: safeReferrer(referrer),
    attributionLandingPage: safePagePath(href, origin) || '/',
    clickIdType,
  };
}

function currentAttribution() {
  return deriveAttribution({
    href: window.location.href,
    origin: window.location.origin,
    search: window.location.search,
    referrer: document.referrer,
  });
}

function isStoredAttribution(value) {
  if (!value || typeof value !== 'object') return false;
  return ATTRIBUTION_KEYS.every((key) => typeof value[key] === 'string');
}

function readStoredAttribution() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return isStoredAttribution(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

function hasExplicitCampaignSignal(value) {
  return Boolean(
    value.clickIdType ||
    value.attributionSource ||
    value.attributionMedium ||
    value.attributionCampaign ||
    value.attributionCampaignId ||
    value.attributionAdGroupId ||
    value.attributionAdId ||
    value.attributionKeyword
  );
}

function writeStoredAttribution(value) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch {
    // Il payload corrente resta comunque disponibile nella pagina del modulo.
  }
}

export function captureAttribution() {
  const current = currentAttribution();
  const stored = readStoredAttribution();
  // Il primo ingresso resta valido per la sessione. Parametri espliciti comparsi
  // successivamente hanno priorità, ad esempio dopo un nuovo clic pubblicitario.
  const selected = !stored || hasExplicitCampaignSignal(current) ? current : stored;
  writeStoredAttribution(selected);
  return selected;
}

export function getBookingAttribution() {
  return readStoredAttribution() || captureAttribution();
}
