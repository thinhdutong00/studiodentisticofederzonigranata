import { submitBooking } from './submitBooking';

export function bindOrthodonticQuiz() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-quiz-dialog]');
  const form = dialog?.querySelector<HTMLFormElement>('[data-orthodontic-quiz-form]');
  if (!dialog || !form || form.dataset.quizBound) return;
  form.dataset.quizBound = 'true';

  const allPanels = Array.from(form.querySelectorAll<HTMLElement>('[data-quiz-panel]'));
  const objectivesPanel = form.querySelector<HTMLElement>('[data-quiz-mobile-objectives-panel]');
  const objectivesHost = objectivesPanel?.querySelector<HTMLElement>('[data-quiz-objectives-host]');
  const objectivesGrid = objectivesPanel ? document.querySelector<HTMLElement>('[data-orthodontic-quiz] .orthodontic-objectives-grid') : null;
  const objectivesDesktopParent = objectivesGrid?.parentElement;
  const mobileViewport = window.matchMedia('(max-width: 720px)');
  const usesRefinedFlow = () => dialog.hasAttribute('data-quiz-all-viewports') || mobileViewport.matches;
  const initialReason = form.querySelector<HTMLInputElement>('[name="initialReason"]');
  let panels = allPanels;
  const progress = dialog.querySelector<HTMLElement>('[data-quiz-progress]');
  const navigation = dialog.querySelector<HTMLElement>('[data-quiz-navigation]');
  const forward = dialog.querySelector<HTMLButtonElement>('[data-quiz-forward]');
  const closeButton = dialog.querySelector<HTMLButtonElement>('[data-quiz-close]');
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

  const showPanel = (index: number, focus = true) => {
    clearAutoAdvance();
    current = Math.max(0, Math.min(index, panels.length - 1));
    const panel = panels[current];
    allPanels.forEach(candidate => { candidate.hidden = candidate !== panel; });
    const questionCount = panels.filter(candidate => candidate.classList.contains('orthodontic-quiz-question')).length;
    const completed = panels.slice(0, current).filter(previous => previous.classList.contains('orthodontic-quiz-question')).length;
    progress?.style.setProperty('--quiz-question-count', String(questionCount));
    progress?.setAttribute('aria-valuenow', String(Math.round(completed / questionCount * 100)));
    progress?.setAttribute('aria-valuetext', `${completed} domande completate su ${questionCount}`);
    progress?.querySelectorAll<HTMLElement>('[data-progress-segment]').forEach((segment, i) => {
      segment.hidden = i >= questionCount;
      segment.classList.toggle('is-complete', i < completed);
    });
    if (navigation) navigation.hidden = current === 0;
    if (forward) forward.hidden = current === panels.length - 1;

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
    if (panel === objectivesPanel && !initialReason?.value) {
      if (report) setError(panel, 'Seleziona il tuo obiettivo per continuare.');
      return false;
    }
    const controls = Array.from(panel.querySelectorAll<HTMLInputElement | HTMLSelectElement>('input, select'));
    for (const control of controls) {
      if (!control.validity.valid) {
        if (report) {
          setError(panel, control.type === 'radio' ? 'Seleziona una risposta per continuare.' : control.type === 'checkbox' ? 'Accetta l’informativa privacy per inviare la richiesta.' : 'Completa il campo con un valore valido.');
          control.reportValidity();
        }
        return false;
      }
      if (control.name === 'fullName' && control.value.trim().length < 2) {
        if (report) { setError(panel, 'Inserisci nome e cognome.'); control.focus(); }
        return false;
      }
      if (control.name === 'phone' && (!/^[+\d\s()./-]{6,30}$/.test(control.value) || control.value.replace(/\D/g, '').length < 6)) {
        if (report) { setError(panel, 'Inserisci un numero di telefono valido.'); control.focus(); }
        return false;
      }
    }
    return true;
  };

  const updateGuardianText = () => {
    const ageRange = form.querySelector<HTMLInputElement>('[name="ageRange"]:checked');
    const age = Number(form.querySelector<HTMLInputElement>('[name="patientAge"]')?.value);
    const isMinor = ageRange ? ageRange.dataset.quizMinor === 'true' : age > 0 && age < 18;
    form.querySelectorAll<HTMLElement>('[data-quiz-guardian]').forEach(element => { element.hidden = !isMinor; });
  };

  const next = () => {
    if (submitting || current === panels.length - 1 || !validatePanel(panels[current])) return;
    updateGuardianText();
    showPanel(current + 1);
  };

  document.querySelectorAll<HTMLButtonElement>('[data-quiz-open]').forEach(button => {
    button.setAttribute('aria-controls', dialog.id);
    button.addEventListener('click', () => {
      if (submitting) return;
      if (initialReason && button.dataset.quizObjective) initialReason.value = button.dataset.quizObjective;
      if (objectivesPanel?.contains(button)) {
        if (!dialog.open || panels[current] !== objectivesPanel) return;
        objectivesGrid?.querySelectorAll<HTMLButtonElement>('[data-quiz-objective]').forEach(choice => {
          choice.setAttribute('aria-pressed', String(choice === button));
        });
        setError(objectivesPanel, '');
        clearAutoAdvance();
        autoAdvance = setTimeout(next, 220);
        return;
      }
      returnFocus = button;
      previousOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      dialog.showModal();
      showPanel(objectivesPanel && usesRefinedFlow() ? 0 : current);
    });
  });

  if (objectivesPanel && objectivesHost && objectivesGrid && objectivesDesktopParent) {
    const mobileFlow = form.querySelector<HTMLInputElement>('[data-quiz-mobile-flow]');
    const originalFormAutocomplete = form.getAttribute('autocomplete');
    const contactAutofill = [
      { name: 'fullName', token: 'name', inputmode: 'text' },
      { name: 'email', token: 'email', inputmode: 'email' },
      { name: 'phone', token: 'tel', inputmode: 'tel' },
    ].map(field => {
      const input = form.querySelector<HTMLInputElement>(`[name="${field.name}"]`);
      return { ...field, input, autocomplete: input?.getAttribute('autocomplete'), originalInputmode: input?.getAttribute('inputmode') };
    });
    const updateObjectivesStep = () => {
      const previousPanel = panels[current];
      const mobile = usesRefinedFlow();
      if (mobileFlow) mobileFlow.disabled = !mobile;
      if (mobile) form.setAttribute('autocomplete', 'on');
      else if (originalFormAutocomplete === null) form.removeAttribute('autocomplete');
      else form.setAttribute('autocomplete', originalFormAutocomplete);
      contactAutofill.forEach(field => {
        if (!field.input) return;
        if (mobile) {
          field.input.setAttribute('autocomplete', `section-orthodontic ${field.token}`);
          field.input.setAttribute('inputmode', field.inputmode);
        } else {
          if (field.autocomplete) field.input.setAttribute('autocomplete', field.autocomplete);
          else field.input.removeAttribute('autocomplete');
          if (field.originalInputmode) field.input.setAttribute('inputmode', field.originalInputmode);
          else field.input.removeAttribute('inputmode');
        }
      });
      allPanels.filter(panel => panel.hasAttribute('data-quiz-desktop-only')).forEach(panel => {
        panel.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLButtonElement>('input, select, button').forEach(control => { control.disabled = mobile; });
      });
      (mobile ? objectivesHost : objectivesDesktopParent).append(objectivesGrid);
      objectivesGrid.querySelectorAll<HTMLButtonElement>('[data-quiz-objective]').forEach(button => {
        if (mobile) {
          button.removeAttribute('aria-haspopup');
          button.removeAttribute('aria-controls');
          button.setAttribute('aria-pressed', String(button.dataset.quizObjective === initialReason?.value));
        } else {
          button.setAttribute('aria-haspopup', 'dialog');
          button.setAttribute('aria-controls', dialog.id);
          button.removeAttribute('aria-pressed');
        }
      });
      panels = allPanels.filter(panel => mobile ? !panel.classList.contains('orthodontic-quiz-welcome') && !panel.hasAttribute('data-quiz-desktop-only') : panel !== objectivesPanel);
      showPanel(Math.max(0, panels.indexOf(previousPanel)), dialog.open);
    };
    updateObjectivesStep();
    mobileViewport.addEventListener('change', updateObjectivesStep);
  }

  dialog.querySelectorAll<HTMLButtonElement>('[data-quiz-next]').forEach(button => button.addEventListener('click', next));
  dialog.querySelector<HTMLButtonElement>('[data-quiz-prev]')?.addEventListener('click', () => { if (!submitting) showPanel(current - 1); });
  closeButton?.addEventListener('click', () => { if (!submitting) dialog.close(); });
  dialog.addEventListener('cancel', event => { if (submitting) event.preventDefault(); });
  dialog.addEventListener('close', () => {
    clearAutoAdvance();
    document.body.style.overflow = previousOverflow;
    returnFocus?.focus({ preventScroll: true });
  });

  form.addEventListener('change', event => {
    const input = event.target;
    if (!(input instanceof HTMLInputElement) || input.type !== 'radio' || submitting) return;
    const panel = input.closest<HTMLElement>('[data-quiz-panel]');
    if (panel !== panels[current]) return;
    setError(panel, '');
    clearAutoAdvance();
    autoAdvance = setTimeout(next, 220);
  });

  dialog.addEventListener('keydown', event => {
    if (submitting || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    if (event.key === 'Enter' && !(target instanceof HTMLButtonElement) && !(target instanceof HTMLAnchorElement)) {
      event.preventDefault();
      if (current === panels.length - 1) form.requestSubmit();
      else next();
    }
    if (!(target instanceof HTMLInputElement) && !(target instanceof HTMLSelectElement) && /^[a-z]$/i.test(event.key)) {
      const index = event.key.toUpperCase().charCodeAt(0) - 65;
      const choice = panels[current].querySelectorAll<HTMLInputElement>('input[type="radio"]')[index];
      if (choice) { event.preventDefault(); choice.click(); }
    }
  });

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (submitting) return;
    if (current !== panels.length - 1) { next(); return; }
    for (let index = 0; index < panels.length; index += 1) {
      if (!validatePanel(panels[index], false)) {
        showPanel(index);
        validatePanel(panels[index]);
        return;
      }
    }
    const fullName = form.querySelector<HTMLInputElement>('[name="fullName"]');
    const phone = form.querySelector<HTMLInputElement>('[name="phone"]');
    if (fullName) fullName.value = fullName.value.trim();
    if (phone && !/^(?:\+|00)/.test(phone.value.trim())) phone.value = `+39 ${phone.value.trim()}`;
    if (phone && phone.value.length > 30) { setError(panels[current], 'Inserisci un numero di telefono più breve.'); return; }

    submitting = true;
    const navigationButtons = Array.from(dialog.querySelectorAll<HTMLButtonElement>('[data-quiz-close], [data-quiz-prev], [data-quiz-next]'));
    navigationButtons.forEach(button => { button.disabled = true; });
    dialog.classList.add('is-submitting');
    try {
      await submitBooking(form, message => setError(panels[panels.length - 1], message));
    } finally {
      // Il modulo rimane bloccato durante il reindirizzamento di un invio riuscito.
      if (!form.hasAttribute('aria-busy')) {
        submitting = false;
        navigationButtons.forEach(button => { button.disabled = false; });
        dialog.classList.remove('is-submitting');
      }
    }
  });
}
