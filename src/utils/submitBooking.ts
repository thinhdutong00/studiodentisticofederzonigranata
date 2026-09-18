type Attempt = { fingerprint: string; requestId: string };
const attempts = new WeakMap<HTMLFormElement, Attempt>();
const pending = new WeakSet<HTMLFormElement>();
const fallback = 'Non siamo riusciti a confermare l’invio. Riprova tra poco oppure contatta lo studio.';

export async function submitBooking(form: HTMLFormElement, setError: (message: string) => void) {
  if (pending.has(form)) return;
  pending.add(form);
  const buttons = Array.from(form.querySelectorAll<HTMLButtonElement>('button[type="submit"]'));
  const originals = buttons.map((button) => ({ button, html: button.innerHTML, disabled: button.disabled }));
  let succeeded = false;
  try {
    setError('');
    const fields = Object.fromEntries(new FormData(form).entries());
    const payload = {
      ...fields,
      fullName: [fields.fullName, fields.lastName].filter(Boolean).join(' '),
      kind: form.dataset.bookingKind,
      source: window.location.pathname,
      privacyConsent: fields.privacyConsent === 'on' || fields.privacyConsent === '1',
    };
    const fingerprint = JSON.stringify(payload);
    let attempt = attempts.get(form);
    if (!attempt || attempt.fingerprint !== fingerprint) {
      attempt = { fingerprint, requestId: crypto.randomUUID() };
      attempts.set(form, attempt);
    }
    buttons.forEach((button) => { button.disabled = true; button.textContent = 'Invio in corso…'; });
    form.setAttribute('aria-busy', 'true');
    const response = await fetch('/api/booking', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...payload, requestId: attempt.requestId }),
      signal: AbortSignal.timeout(20_000),
    });
    const result = await response.json().catch(() => null);
    if (!response.ok || result?.ok !== true || result.requestId !== attempt.requestId) {
      throw new Error(typeof result?.error === 'string' ? result.error : fallback);
    }
    succeeded = true;
    buttons.forEach((button) => { button.textContent = 'Richiesta inviata'; });
    window.location.assign('/thank-you-page/');
  } catch (error) {
    setError(error instanceof Error && error.name === 'Error' ? error.message : fallback);
  } finally {
    if (!succeeded) {
      originals.forEach(({ button, html, disabled }) => { button.innerHTML = html; button.disabled = disabled; });
      form.removeAttribute('aria-busy');
      pending.delete(form);
    }
  }
}

export function bindContactForms() {
  document.querySelectorAll<HTMLFormElement>('[data-contact-form]').forEach((form) => {
    if (form.dataset.bookingBound) return;
    form.dataset.bookingBound = 'true';
    const errorBox = form.querySelector<HTMLElement>('[data-booking-error]');
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;
      void submitBooking(form, (message) => { if (errorBox) errorBox.textContent = message; });
    });
  });
}
