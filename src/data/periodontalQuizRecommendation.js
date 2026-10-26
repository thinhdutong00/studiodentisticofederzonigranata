import { periodontalDurations, periodontalObjectives, periodontalSymptoms } from './periodontalQuiz.js';

const symptomConditions = Object.freeze({
  'Sanguinamento quando mi lavo i denti': 'le gengive sanguinano quando lavi i denti',
  'Gengive che si ritirano': 'noti recessioni gengivali',
  'Uno o più denti che si muovono': 'senti che uno o più denti si muovono',
  'Alito persistente': 'noti un alito cattivo',
});
const durationConditions = Object.freeze({
  'Da pochi giorni': 'da pochi giorni',
  'Da alcune settimane': 'da alcune settimane',
  'Da diversi mesi': 'da diversi mesi',
  'Da più di un anno': 'da più di un anno',
});
const objectiveInvitations = Object.freeze({
  'Capire perché le gengive sanguinano': 'una visita parodontale potrebbe aiutarti a capire insieme al dentista le cause del sanguinamento e come prenderti cura delle gengive.',
  'Prendermi cura delle gengive': 'una visita parodontale potrebbe essere il primo passo per capire come prenderti cura delle gengive nel tempo.',
  'Valutare denti che si muovono': 'una visita parodontale potrebbe aiutarti a fare il punto sulla stabilità dei denti e sui tessuti che li sostengono.',
  'Controllare la mia salute orale': 'una visita parodontale potrebbe aiutarti a fare il punto sulla salute delle gengive e sul sostegno dei denti.',
});

const assessment = Object.freeze({
  src: '/assets/optimized/parodontologia-controllo-gengive.webp',
  alt: 'Controllo odontoiatrico delle gengive durante una visita',
  width: 1200,
  height: 900,
});

/**
 * The original site documents this exact pair under “Chirurgia mucogengivale”,
 * case 1 (838.jpg / 837.jpg). It illustrates a recession treatment only, never
 * an outcome for bleeding, periodontitis or tooth mobility. A questionnaire
 * answer does not establish an indication for the illustrated treatment.
 */
const recessionCase = Object.freeze({
  id: 'recessioni-1',
  before: Object.freeze({
    src: '/assets/optimized/parodontologia-landing-recessioni-1-prima.webp',
    alt: 'Recessioni gengivali prima del trattamento mucogengivale eseguito nello studio',
    width: 600,
    height: 352,
  }),
  after: Object.freeze({
    src: '/assets/optimized/parodontologia-landing-recessioni-1-dopo.webp',
    alt: 'Lo stesso caso di recessioni gengivali dopo il trattamento mucogengivale',
    width: 600,
    height: 352,
  }),
});

const validOption = (value, options) => typeof value === 'string' && options.includes(value) ? value : '';

/**
 * Builds a conditional invitation from allowlisted answers only. Duration adds
 * context, never a risk score, diagnosis or urgency classification. Age and
 * personal details do not determine the invitation or image.
 */
export function getPeriodontalQuizRecommendation(answers = {}) {
  const input = answers && typeof answers === 'object' && !Array.isArray(answers) ? answers : {};
  const objective = validOption(input.periodontalObjective, periodontalObjectives.map(option => option.title));
  const symptom = validOption(input.periodontalSymptom, periodontalSymptoms);
  const duration = validOption(input.symptomDuration, periodontalDurations);
  const condition = symptomConditions[symptom];
  const timeframe = durationConditions[duration];
  const introduction = condition
    ? `Se ${timeframe ? `${timeframe} ` : ''}${condition}`
    : 'Se desideri fare il punto sulla salute delle gengive';
  const invitation = objectiveInvitations[objective] || objectiveInvitations['Prendermi cura delle gengive'];
  const showRecessionCase = symptom === 'Gengive che si ritirano';

  return {
    title: 'Le tue gengive meritano attenzione. Partiamo da una visita.',
    text: `${introduction}, ${invitation}`,
    visualKind: showRecessionCase ? 'recession-case' : 'assessment',
    caseId: showRecessionCase ? recessionCase.id : '',
    visualCaption: showRecessionCase
      ? 'Esempio di trattamento mucogengivale delle recessioni eseguito nello studio. Ogni caso richiede una valutazione individuale; indicazioni e risultati possono variare.'
      : 'La visita permette di valutare le gengive e i tessuti che sostengono i denti.',
    image: { ...assessment },
    before: showRecessionCase ? { ...recessionCase.before } : null,
    after: showRecessionCase ? { ...recessionCase.after } : null,
  };
}
