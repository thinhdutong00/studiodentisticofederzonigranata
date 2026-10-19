import { submitBooking } from './submitBooking';

export function bindPeriodontalQuiz() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-periodontal-quiz-dialog]');
  const form = dialog?.querySelector<HTMLFormElement>('[data-periodontal-quiz-form]');
  if (!dialog || !form || form.dataset.quizBound) return;
  form.dataset.quizBound = 'true';

  const panels = Array.from(form.querySelectorAll<HTMLElement>('[data-quiz-panel]'));
  const objectivesPanel = form.querySelector<HTMLElement>('[data-quiz-objectives-panel]');
  const objective = form.querySelector<HTMLInputElement>('[name="periodontalObjective"]');
  const progress = dialog.querySelector<HTMLElement>('[data-quiz-progress]');
  const triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-quiz-open]'));
  let current = 0;
  let submitting = false;
  let autoAdvance: ReturnType<typeof setTimeout> | undefined;
  let previousOverflow = '';
  let returnFocus: HTMLElement | null = null;

  const clearAutoAdvance = () => {
    if (autoAdvance) clearTimeout(autoAdvance);
    autoAdvance = undefined;
  };
  const setError = (panel: HTMLElement, message: string) => {
    const output = panel.querySelector<HTMLElement>('[data-quiz-error]');
    if (output) output.textContent = message;
  };
  const updateGuardianText = () => {
    const age = form.querySelector<HTMLInputElement>('[name="ageRange"]:checked');
    form.querySelectorAll<HTMLElement>('[data-quiz-guardian]').forEach(element => { element.hidden = age?.dataset.quizMinor !== 'true'; });
  };
  const showPanel = (index: number, focus = true) => {
    clearAutoAdvance();
    current = Math.max(0, Math.min(index, panels.length - 1));
    const panel = panels[current];
    panels.forEach(candidate => { candidate.hidden = candidate !== panel; });
    const count = panels.filter(candidate => candidate.classList.contains('orthodontic-quiz-question')).length;
    const completed = panels.slice(0, current).filter(candidate => candidate.classList.contains('orthodontic-quiz-question')).length;
    progress?.setAttribute('aria-valuenow', String(Math.round(completed / count * 100)));
    progress?.setAttribute('aria-valuetext', `${completed} domande completate su ${count}`);
    progress?.querySelectorAll<HTMLElement>('[data-progress-segment]').forEach((segment, i) => segment.classList.toggle('is-complete', i < completed));
    const heading = panel.querySelector<HTMLElement>('h2');
    if (heading) dialog.setAttribute('aria-labelledby', heading.id);
    if (focus) {
      dialog.scrollTop = 0;
      heading?.focus({ preventScroll: true });
      panel.querySelector<HTMLInputElement | HTMLSelectElement>('input:not([type="radio"]):not([type="checkbox"]), select')?.focus({ preventScroll: true });
    }
  };
  const validatePanel = (panel: HTMLElement, report = true) => {
    setError(panel, '');
    if (panel === objectivesPanel && !objective?.value) {
      if (report) setError(panel, 'Seleziona il tuo obiettivo per continuare.');
      return false;
    }
    for (const control of panel.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select')) {
      let message = '';
      if (!control.validity.valid) message = control.type === 'radio' ? 'Seleziona una risposta per continuare.' : control.type === 'checkbox' ? 'Accetta l’informativa privacy per inviare la richiesta.' : 'Completa il campo con un valore valido.';
      if (control.name === 'fullName' && control.value.trim().length < 2) message = 'Inserisci nome e cognome.';
      if (control.name === 'phone' && (!/^[+\d\s()./-]{6,30}$/.test(control.value) || control.value.replace(/\D/g, '').length < 6)) message = 'Inserisci un numero di telefono valido.';
      if (message) {
        if (report) { setError(panel, message); control.reportValidity(); control.focus(); }
        return false;
      }
    }
    return true;
  };
  const next = () => {
    if (submitting || current === panels.length - 1 || !validatePanel(panels[current])) return;
    updateGuardianText();
    showPanel(current + 1);
  };

  triggers.forEach(trigger => {
    trigger.setAttribute('aria-controls', dialog.id);
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', event => {
      event.preventDefault();
      if (submitting || dialog.open) return;
      returnFocus = trigger;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      triggers.forEach(button => button.setAttribute('aria-expanded', 'true'));
      showPanel(0);
    });
  });
  form.querySelectorAll<HTMLButtonElement>('[data-quiz-objective]').forEach(button => button.addEventListener('click', () => {
    if (submitting || panels[current] !== objectivesPanel || !objective) return;
    objective.value = button.dataset.quizObjective || '';
    form.querySelectorAll<HTMLButtonElement>('[data-quiz-objective]').forEach(candidate => candidate.setAttribute('aria-pressed', String(candidate === button)));
    if (objectivesPanel) setError(objectivesPanel, '');
    clearAutoAdvance();
    autoAdvance = setTimeout(next, 220);
  }));
  dialog.querySelectorAll<HTMLButtonElement>('[data-quiz-next]').forEach(button => button.addEventListener('click', next));
  dialog.querySelector<HTMLButtonElement>('[data-quiz-close]')?.addEventListener('click', () => { if (!submitting) dialog.close(); });
  dialog.addEventListener('cancel', event => { if (submitting) event.preventDefault(); });
  dialog.addEventListener('close', () => {
    clearAutoAdvance();
    document.body.style.overflow = previousOverflow;
    triggers.forEach(button => button.setAttribute('aria-expanded', 'false'));
    returnFocus?.focus({ preventScroll: true });
  });
  form.addEventListener('change', event => {
    if (!(event.target instanceof HTMLInputElement) || event.target.type !== 'radio' || submitting) return;
    const panel = event.target.closest<HTMLElement>('[data-quiz-panel]');
    if (panel !== panels[current]) return;
    setError(panel, '');
    clearAutoAdvance();
    autoAdvance = setTimeout(next, 220);
  });
  dialog.addEventListener('keydown', event => {
    if (submitting || event.ctrlKey || event.metaKey) return;
    if (event.key === 'Enter' && !(event.target instanceof HTMLButtonElement) && !(event.target instanceof HTMLAnchorElement)) {
      event.preventDefault();
      if (current === panels.length - 1) form.requestSubmit();
      else next();
    }
  });
  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting) return;
    if (current !== panels.length - 1) { next(); return; }
    for (let index = 0; index < panels.length; index += 1) {
      if (!validatePanel(panels[index], false)) { showPanel(index); validatePanel(panels[index]); return; }
    }
    const name = form.querySelector<HTMLInputElement>('[name="fullName"]');
    const phone = form.querySelector<HTMLInputElement>('[name="phone"]');
    if (name) name.value = name.value.trim();
    if (phone && !/^(?:\+|00)/.test(phone.value.trim())) phone.value = `+39 ${phone.value.trim()}`;
    if (phone && phone.value.length > 30) { setError(panels[current], 'Inserisci un numero di telefono più breve.'); return; }
    submitting = true;
    const controls = Array.from(dialog.querySelectorAll<HTMLButtonElement>('[data-quiz-close], [data-quiz-next], [data-quiz-objective]'));
    controls.forEach(button => { button.disabled = true; });
    dialog.classList.add('is-submitting');
    try {
      await submitBooking(form, message => setError(panels[panels.length - 1], message));
    } finally {
      if (!form.hasAttribute('aria-busy')) {
        submitting = false;
        controls.forEach(button => { button.disabled = false; });
        dialog.classList.remove('is-submitting');
      }
    }
  });
  showPanel(0, false);
}
