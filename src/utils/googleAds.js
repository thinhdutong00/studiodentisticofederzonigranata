// Basic consent mode: no Google script/network request before explicit consent.
export const ADS_TAG_ID = 'AW-988575526';
export const ADS_LEAD_DESTINATION = 'AW-988575526/I2pSCNjTzaodEKbusdcD';
export const ADS_ORTHODONTIC_DESTINATION = 'AW-988575526/gUQ-COLP2aodEKbusdcD';
export const COOKIE_PREFERENCE_KEY = 'fg-cookie-preference-v2';
const RECEIPT_KEY = 'fg-confirmed-lead-v1';
const ORTHODONTIC_RECEIPT_KEY = 'fg-confirmed-orthodontic-lead-v1';
const LEAD_EVENTS = [
  { key: RECEIPT_KEY, destination: ADS_LEAD_DESTINATION, paths: ['/visita-parodontologia', '/visita-parodontologia/'], kinds: ['landing-consultation', 'periodontal-quiz'] },
  { key: ORTHODONTIC_RECEIPT_KEY, destination: ADS_ORTHODONTIC_DESTINATION, paths: ['/visita-ortodonzia', '/visita-ortodonzia/'], kinds: ['landing-consultation', 'orthodontic-quiz'] },
];
const RECEIPT_TTL = 30 * 60 * 1000;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const SITE_HOSTS = new Set(['studiodentisticofederzonigranata.it', 'www.studiodentisticofederzonigranata.it']);
let initialized = false;
let configured = false;
let loaded = false;

function consentGranted() {
  return document.documentElement.dataset.cookiePreference === 'accept';
}

function productionHost() {
  return window.location.protocol === 'https:' && SITE_HOSTS.has(window.location.hostname);
}

function forgetReceipt(key) {
  try { sessionStorage.removeItem(key); } catch { /* Storage may be disabled. */ }
}

function forgetReceipts() {
  for (const { key } of LEAD_EVENTS) forgetReceipt(key);
}

// Called only after /api/booking has acknowledged this exact requestId.
// Store no form fields, clinical answers, contact details, or attribution data.
export function rememberConfirmedLead({ requestId, kind, source }) {
  forgetReceipts();
  if (!productionHost() || !consentGranted() || !UUID.test(requestId)) return;
  const event = LEAD_EVENTS.find(event => event.paths.includes(source) && event.kinds.includes(kind));
  if (!event) return;
  try {
    sessionStorage.setItem(event.key, JSON.stringify({ requestId, createdAt: Date.now() }));
  } catch {
    // Measurement failure must never prevent an accepted request's confirmation.
  }
}

function sendConfirmedLead() {
  if (!loaded || !consentGranted() || !['/thank-you-page', '/thank-you-page/'].includes(window.location.pathname)) return;
  for (const { key, destination } of LEAD_EVENTS) {
    let receipt;
    try {
      receipt = JSON.parse(sessionStorage.getItem(key) || 'null');
      if (!receipt || !UUID.test(receipt.requestId) || !Number.isFinite(receipt.createdAt)
        || receipt.createdAt > Date.now() || Date.now() - receipt.createdAt > RECEIPT_TTL) {
        sessionStorage.removeItem(key);
        continue;
      }
      // Consume before sending: reload/back/consent events cannot enqueue it twice.
      sessionStorage.removeItem(key);
    } catch { forgetReceipt(key); continue; }
    window.gtag('event', 'conversion', {
      send_to: destination,
      transaction_id: receipt.requestId,
      user_data: {},
    });
  }
}

function updateConsent() {
  const granted = consentGranted();
  window.gtag('consent', 'update', {
    ad_storage: granted ? 'granted' : 'denied',
    ad_user_data: granted ? 'granted' : 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
  });
  if (!granted) { forgetReceipts(); return; }
  if (!configured) {
    configured = true;
    window.gtag('set', 'ads_data_redaction', true);
    window.gtag('set', 'user_data', {});
    window.gtag('js', new Date());
    window.gtag('config', ADS_TAG_ID, {
      allow_ad_personalization_signals: false,
      allow_google_signals: false,
      allow_enhanced_conversions: false,
      user_data: {},
    });
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${ADS_TAG_ID}`;
    // Queue the conversion only after the library loads. Blocked tags leave the
    // receipt available for a retry; the booking itself has already succeeded.
    script.addEventListener('load', () => { loaded = true; sendConfirmedLead(); });
    document.head.append(script);
  } else {
    sendConfirmedLead();
  }
}

export function initGoogleAds() {
  // Previews and local tests must never send data to the live Ads account.
  if (initialized || !productionHost()) return;
  initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () { window.dataLayer.push(arguments); };
  window.gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied',
    ad_personalization: 'denied', analytics_storage: 'denied',
  });
  document.addEventListener('fg-cookie-preference', updateConsent);
  if (document.documentElement.dataset.cookiePreference) updateConsent();
}
