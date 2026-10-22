import { submitBooking } from './submitBooking';
import { captureAttribution } from './attribution';
import { getOrthodonticQuizRecommendation } from '../data/orthodonticQuizRecommendation.js';
import { getPeriodontalQuizRecommendation } from '../data/periodontalQuizRecommendation.js';

export function bindQuizConsultation() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-quiz-consultation]');
  const form = dialog?.querySelector<HTMLFormElement>('[data-cq-form]');
  if (!dialog || !form || form.dataset.bound) return;
  form.dataset.bound = 'true';
  captureAttribution();
  const isOrtho = dialog.dataset.quizConsultation === 'ortodonzia';
  const steps = Array.from(form.querySelectorAll<HTMLElement>('[data-cq-step]'));
  const next = form.querySelector<HTMLButtonElement>('[data-cq-next]')!;
  const back = form.querySelector<HTMLButtonElement>('[data-cq-back]')!;
  const submit = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const close = dialog.querySelector<HTMLButtonElement>('[data-quiz-close]')!;
  const progress = dialog.querySelector<HTMLElement>('[data-cq-progress]')!;
  const error = form.querySelector<HTMLElement>('[data-cq-error]')!;
  let current = 0;
  let returnFocus: HTMLElement | null = null;
  let previousOverflow = '';
  const busy = () => form.hasAttribute('aria-busy');
  const value = (name: string) => String(new FormData(form).get(name) || '');

  function valid(index: number) {
    const fields = Array.from(steps[index].querySelectorAll<HTMLInputElement>('input'));
    return fields.every(field => field.validity.valid && (!field.required || field.type === 'radio' || field.type === 'checkbox' || field.value.trim().length >= Math.max(field.minLength, 1)))
      && (steps[index].dataset.cqKey !== 'contact' || (/^[+\d\s()./-]{6,30}$/.test(value('phone').trim()) && value('phone').replace(/\D/g, '').length >= 6));
  }
  function updateNavigation() {
    const last = current === steps.length - 1;
    back.hidden = current === 0;
    back.disabled = busy();
    close.disabled = busy();
    next.hidden = last;
    next.disabled = busy() || !valid(current);
    submit.hidden = !last;
    form.querySelector<HTMLElement>('[data-cq-enter]')!.hidden = last;
  }
  function updateRecommendation() {
    const panel = steps[current];
    if (panel.dataset.cqKey !== 'information') return;
    const recommendation = isOrtho
      ? getOrthodonticQuizRecommendation({ problem: value('problem'), occlusion: value('occlusion'), initialReason: value('initialReason') })
      : getPeriodontalQuizRecommendation({ periodontalObjective: value('periodontalObjective'), periodontalSymptom: value('periodontalSymptom'), symptomDuration: value('symptomDuration') });
    panel.querySelector<HTMLElement>('[data-cq-recommendation-text]')!.textContent = recommendation.text;
    panel.querySelector<HTMLElement>('[data-cq-caption]')!.textContent = isOrtho ? recommendation.caseCaption : recommendation.visualCaption;
    if (!isOrtho) {
      panel.querySelector<HTMLElement>('[data-cq-recommendation-title]')!.textContent = recommendation.title;
      panel.querySelector<HTMLElement>('[data-cq-assessment]')!.hidden = recommendation.visualKind !== 'assessment';
      panel.querySelector<HTMLElement>('[data-cq-case]')!.hidden = recommendation.visualKind !== 'recession-case';
    }
    (['before', 'after'] as const).forEach(phase => {
      const photo = recommendation[phase];
      const image = panel.querySelector<HTMLImageElement>(`[data-cq-${phase}]`);
      if (!photo || !image) return;
      image.alt = photo.alt;
      image.width = photo.width;
      image.height = photo.height;
      if (image.getAttribute('src') !== photo.src) image.src = photo.src;
    });
  }
  function updateSummary() {
    const rows = [
      ['Nome', 'fullName'], ['Obiettivo', isOrtho ? 'initialReason' : 'periodontalObjective'],
      ...(isOrtho ? [['Allineamento', 'problem'], ['Chiusura delle arcate', 'occlusion']] : [['Segnale notato', 'periodontalSymptom'], ['Da quanto tempo', 'symptomDuration'], ['Problema attuale', 'problem']]),
      ['Età del paziente', 'ageRange'], ['Studio', 'office'], ['Telefono', 'phone'], ['Email', 'email'],
    ];
    const summary = form.querySelector<HTMLElement>('[data-cq-summary]')!;
    summary.replaceChildren();
    rows.forEach(([label, name]) => {
      const answer = value(name);
      if (!answer) return;
      const row = document.createElement('div');
      const term = document.createElement('dt');
      const description = document.createElement('dd');
      term.textContent = label;
      description.textContent = answer;
      row.append(term, description);
      summary.append(row);
    });
  }
  function showStep(index: number, focus = true) {
    current = Math.max(0, Math.min(index, steps.length - 1));
    steps.forEach((step, i) => { step.hidden = i !== current; });
    const heading = steps[current].querySelector<HTMLElement>('h2')!;
    dialog.setAttribute('aria-labelledby', heading.id);
    const percent = Math.round((current + 1) / steps.length * 100);
    progress.style.setProperty('--progress', `${percent}%`);
    progress.setAttribute('aria-valuenow', String(percent));
    form.querySelectorAll<HTMLElement>('[data-cq-name]').forEach(element => { element.textContent = value('fullName').trim().split(/\s+/)[0] || ''; });
    error.textContent = '';
    updateRecommendation();
    if (current === steps.length - 1) updateSummary();
    updateNavigation();
    dialog.scrollTop = 0;
    if (focus) {
      heading.focus({ preventScroll: true });
      steps[current].querySelector<HTMLInputElement>('input[type="text"], input[type="tel"]')?.focus({ preventScroll: true });
    }
  }
  function reportInvalid(index: number) {
    error.textContent = steps[index].dataset.cqKey === 'confirmation' ? 'Accetta l’informativa privacy per inviare la richiesta.' : 'Controlla il campo o seleziona una risposta prima di proseguire.';
    steps[index].querySelector<HTMLInputElement>('input:invalid')?.reportValidity();
  }

  document.querySelectorAll<HTMLElement>('[data-quiz-open], .landing-header [data-quiz-cta]').forEach(opener => {
    if (opener.closest('dialog')) return;
    opener.setAttribute('aria-controls', dialog.id);
    opener.setAttribute('aria-haspopup', 'dialog');
    opener.addEventListener('click', event => {
      event.preventDefault();
      if (busy()) return;
      returnFocus = opener;
      const objective = opener.dataset.quizObjective;
      if (objective) form.querySelectorAll<HTMLInputElement>(`[name="${isOrtho ? 'initialReason' : 'periodontalObjective'}"]`).forEach(input => { input.checked = input.value === objective; });
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      if (!dialog.open) dialog.showModal();
      showStep(current);
    });
  });
  close.addEventListener('click', () => { if (!busy()) dialog.close(); });
  dialog.addEventListener('cancel', event => { if (busy()) event.preventDefault(); });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = previousOverflow;
    returnFocus?.focus({ preventScroll: true });
  });
  next.addEventListener('click', () => { if (!busy() && valid(current)) showStep(current + 1); });
  back.addEventListener('click', () => { if (!busy()) showStep(current - 1); });
  ['input', 'change'].forEach(eventName => form.addEventListener(eventName, () => { error.textContent = ''; updateNavigation(); }));
  form.addEventListener('keydown', event => {
    if (event.key !== 'Enter' || event.isComposing || !(event.target instanceof HTMLInputElement)) return;
    if (current < steps.length - 1) { event.preventDefault(); next.click(); }
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (busy()) return;
    if (current !== steps.length - 1) { next.click(); return; }
    const invalid = steps.findIndex((_, index) => !valid(index));
    if (invalid !== -1) { showStep(invalid); reportInvalid(invalid); return; }
    const sending = submitBooking(form, message => { error.textContent = message; });
    updateNavigation();
    await sending;
    updateNavigation();
  });
  showStep(0, false);
}
