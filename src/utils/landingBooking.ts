import { submitBooking } from './submitBooking';
import { captureAttribution } from './attribution';
import { validLandingBookingDays } from '../data/landingBooking.js';

export function bindLandingBooking() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-lb-dialog]');
  const form = dialog?.querySelector<HTMLFormElement>('[data-lb-form]');
  if (!dialog || !form || dialog.dataset.bound) return;
  dialog.dataset.bound = 'true';
  captureAttribution();

  const steps = Array.from(form.querySelectorAll<HTMLElement>('[data-lb-step]'));
  const next = form.querySelector<HTMLButtonElement>('[data-lb-next]')!;
  const back = form.querySelector<HTMLButtonElement>('[data-lb-back]')!;
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const close = dialog.querySelector<HTMLButtonElement>('[data-lb-close]')!;
  const error = form.querySelector<HTMLElement>('[data-lb-error]')!;
  const progress = Array.from(dialog.querySelectorAll<HTMLButtonElement>('[data-lb-progress-step]'));
  const dayInputs = Array.from(form.querySelectorAll<HTMLInputElement>('[data-lb-day]'));
  const daysField = form.elements.namedItem('availability') as HTMLInputElement;
  let current = 0;
  let reached = 0;
  let opener: HTMLElement | null = null;

  const busy = () => form.getAttribute('aria-busy') === 'true';
  const field = (name: string) => form.elements.namedItem(name) as HTMLInputElement;

  function updateNavigation() {
    back.disabled = current === 0 || busy();
    close.disabled = busy();
    next.hidden = current === steps.length - 1;
    submit.hidden = current !== steps.length - 1;
    progress.forEach((button, index) => {
      button.disabled = index > reached || busy();
      if (index === current) button.setAttribute('aria-current', 'step');
      else button.removeAttribute('aria-current');
      button.closest('li')?.classList.toggle('is-complete', index < current);
    });
  }

  function updateSummary() {
    const data = new FormData(form);
    form.querySelectorAll<HTMLElement>('[data-lb-summary-value]').forEach(element => {
      element.textContent = String(data.get(element.dataset.lbSummaryValue!) || '—');
    });
    form.querySelector<HTMLElement>('[data-lb-guardian]')!.hidden = data.get('ageRange') !== 'Fino a 17 anni';
  }

  function showStep(index: number, focus = true) {
    current = index;
    reached = Math.max(reached, index);
    steps.forEach((step, i) => { step.hidden = i !== index; });
    const heading = steps[index].querySelector<HTMLHeadingElement>('h2')!;
    dialog.setAttribute('aria-labelledby', heading.id);
    dialog.querySelector<HTMLElement>('[data-lb-sidebar-title]')!.textContent = steps[index].dataset.title!;
    error.textContent = '';
    updateNavigation();
    if (index === steps.length - 1) updateSummary();
    if (focus) {
      form.querySelector<HTMLElement>('[data-lb-body]')!.scrollTo({ top: 0, behavior: 'instant' });
      heading.focus({ preventScroll: true });
    }
  }

  function stepIsValid(index: number) {
    if (index === 3) return validLandingBookingDays(daysField.value);
    if (index === 5) {
      const fullName = field('fullName');
      const phone = field('phone');
      fullName.setCustomValidity(fullName.value.trim().length >= 2 ? '' : 'Inserisci il nome e il cognome.');
      phone.setCustomValidity(/^[+\d\s()./-]{6,30}$/.test(phone.value.trim()) && phone.value.replace(/\D/g, '').length >= 6 ? '' : 'Inserisci un numero di telefono valido.');
    }
    return Array.from(steps[index].querySelectorAll<HTMLInputElement | HTMLTextAreaElement>('input, textarea')).every(input => input.validity.valid);
  }

  function showValidation(index: number) {
    error.textContent = index < 5 ? 'Seleziona una risposta per continuare.' : 'Controlla i recapiti e accetta l’informativa privacy prima di inviare.';
    const invalid = steps[index].querySelector<HTMLInputElement>('input:invalid');
    if (invalid) invalid.reportValidity();
    else steps[index].querySelector<HTMLInputElement>('input')?.focus({ preventScroll: true });
  }

  const triggerSelector = '[data-landing-booking-open], .landing-header-booking, .treatment-sticky-cta a, [data-ortho-professional-visit], a[href="#ortho-final"]';
  document.querySelectorAll<HTMLElement>(triggerSelector).forEach(trigger => {
    if (trigger.closest('[data-quiz-dialog], [data-periodontal-quiz], [data-orthodontic-quiz]')) return;
    trigger.setAttribute('aria-haspopup', 'dialog');
    trigger.setAttribute('aria-controls', dialog.id);
  });
  document.addEventListener('click', event => {
    if (!(event.target instanceof Element)) return;
    const trigger = event.target.closest<HTMLElement>(triggerSelector);
    if (!trigger || trigger.closest('[data-quiz-dialog], [data-periodontal-quiz], [data-orthodontic-quiz]')) return;
    if (event instanceof MouseEvent && (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0)) return;
    event.preventDefault();
    opener = trigger;
    document.querySelectorAll<HTMLDialogElement>('dialog[open]:not([data-lb-dialog]):not([data-quiz-dialog])').forEach(sheet => sheet.close());
    if (!dialog.open) dialog.showModal();
    document.body.classList.add('lb-dialog-open');
    showStep(current);
  });

  close.addEventListener('click', () => { if (!busy()) dialog.close(); });
  dialog.addEventListener('cancel', event => { if (busy()) event.preventDefault(); });
  dialog.addEventListener('close', () => {
    document.body.classList.remove('lb-dialog-open');
    if (opener?.isConnected && !opener.closest('dialog:not([open])')) opener.focus({ preventScroll: true });
    else document.querySelector<HTMLElement>('[data-landing-booking-open]')?.focus({ preventScroll: true });
  });
  next.addEventListener('click', () => {
    if (busy()) return;
    if (stepIsValid(current)) showStep(Math.min(current + 1, steps.length - 1));
    else showValidation(current);
  });
  back.addEventListener('click', () => { if (current > 0 && !busy()) showStep(current - 1); });
  progress.forEach((button, index) => button.addEventListener('click', () => { if (index <= reached && !busy()) showStep(index); }));
  form.querySelectorAll<HTMLButtonElement>('[data-lb-goto]').forEach(button => button.addEventListener('click', () => {
    if (!busy()) showStep(Number(button.dataset.lbGoto));
  }));
  form.addEventListener('change', event => {
    if (event.target instanceof HTMLInputElement && event.target.matches('[data-lb-day]')) {
      const selected = event.target;
      if (selected.checked) dayInputs.forEach(input => {
        if (input !== selected && (selected.value === 'Non ho preferenze' || input.value === 'Non ho preferenze')) input.checked = false;
      });
      daysField.value = dayInputs.filter(input => input.checked).map(input => input.value).join(', ');
    }
    error.textContent = '';
  });
  form.addEventListener('input', event => {
    if (event.target instanceof HTMLInputElement) event.target.setCustomValidity('');
    error.textContent = '';
  });
  form.addEventListener('keydown', event => {
    if (event.key !== 'Enter' || event.isComposing || !(event.target instanceof HTMLInputElement)) return;
    if (current < steps.length - 1) { event.preventDefault(); next.click(); }
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy()) return;
    if (current !== steps.length - 1) { next.click(); return; }
    const invalid = steps.findIndex((_, index) => !stepIsValid(index));
    if (invalid !== -1) { showStep(invalid); showValidation(invalid); return; }
    const sending = submitBooking(form, message => { error.textContent = message; });
    updateNavigation();
    form.querySelectorAll<HTMLButtonElement>('[data-lb-goto]').forEach(button => { button.disabled = true; });
    await sending;
    updateNavigation();
    form.querySelectorAll<HTMLButtonElement>('[data-lb-goto]').forEach(button => { button.disabled = busy(); });
  });
}
