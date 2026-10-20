import { orthodonticBites, orthodonticConcerns, orthodonticObjectives } from './orthodonticQuiz.js';

const concernConditions = Object.freeze({
  'Denti affollati': 'i denti si sovrappongono',
  'Denti separati': 'noti spazi tra i denti',
});
const biteConditions = Object.freeze({
  'Morso crociato': 'alcuni denti superiori chiudono all’interno di quelli inferiori',
  'Overjet negativo': 'i denti inferiori sporgono rispetto a quelli superiori',
  Sovramorso: 'i denti superiori coprono molto quelli inferiori',
  'Morso aperto': 'le arcate non si chiudono completamente',
});
const objectiveInvitations = Object.freeze({
  'Allineare i miei denti': 'una visita ortodontica potrebbe essere il primo passo per capire quali soluzioni sono più adatte al tuo sorriso.',
  'Acquisire più sicurezza': 'una visita ortodontica potrebbe aiutarti a capire quali cambiamenti sono possibili per sentirti più a tuo agio con il tuo sorriso.',
  'Migliorare la mia salute orale': 'una visita ortodontica potrebbe aiutarti a valutare insieme allineamento, morso e salute orale.',
  'Prendermi cura del mio sorriso': 'una visita ortodontica potrebbe essere il primo passo per capire come prenderti cura del tuo sorriso nel tempo.',
});

/**
 * These are real, paired photographs from /ortodonzia/. The case key identifies
 * an illustrative example, never a diagnosis, treatment indication or prediction.
 * The frontal photographs show overlapping incisors in case 2 and a central
 * space in case 3. Those visual features select an example for the alignment
 * answer only. The source does not document bite diagnoses, so an occlusion
 * answer must not select or label a photograph as that type of malocclusion.
 */
export const orthodonticQuizCaseSelection = Object.freeze({
  byConcern: Object.freeze({
    'Denti affollati': 'caso-2',
    'Denti separati': 'caso-3',
  }),
  fallback: 'caso-1',
});

const cases = Object.freeze(Object.fromEntries([1, 2, 3].map(number => [
  `caso-${number}`,
  Object.freeze({
    before: Object.freeze({
      src: `/assets/optimized/ortodonzia-quiz-caso-${number}-prima.webp`,
      alt: `Trattamento ortodontico documentato nello studio, esempio ${number}: prima del trattamento`,
      width: 600,
      height: 300,
    }),
    after: Object.freeze({
      src: `/assets/optimized/ortodonzia-quiz-caso-${number}-dopo.webp`,
      alt: `Lo stesso trattamento ortodontico documentato nello studio, esempio ${number}: dopo il trattamento`,
      width: 600,
      height: 300,
    }),
  }),
])));

const validOption = (value, options) => typeof value === 'string' && options.includes(value) ? value : '';

/**
 * Describes selected features conditionally; illustrations are not a clinical
 * finding. Age does not determine the recommendation or example.
 * No user-provided free text is returned, and this helper has no side effects.
 */
export function getOrthodonticQuizRecommendation(answers = {}) {
  const input = answers && typeof answers === 'object' && !Array.isArray(answers) ? answers : {};
  const problem = validOption(input.problem, orthodonticConcerns.map(option => option.value));
  const occlusion = validOption(input.occlusion, orthodonticBites.map(option => option.value));
  const objective = validOption(input.initialReason, orthodonticObjectives.map(option => option.title));
  const concernCondition = concernConditions[problem];
  const biteCondition = biteConditions[occlusion];

  const conditions = [concernCondition, biteCondition].filter(Boolean);
  const introduction = conditions.length
    ? `Se ${conditions.join(' e ')}`
    : 'Se desideri capire meglio l’allineamento dei denti e la chiusura delle arcate';

  const invitation = objectiveInvitations[objective] || objectiveInvitations['Allineare i miei denti'];
  const caseId = orthodonticQuizCaseSelection.byConcern[problem]
    || orthodonticQuizCaseSelection.fallback;
  const selectedCase = cases[caseId];
  return {
    title: 'Ogni sorriso ha la sua storia. Un percorso nasce dalla valutazione.',
    text: `${introduction}, ${invitation}`,
    caseId,
    caseCaption: 'Esempio di un trattamento eseguito nello studio. Ogni caso richiede una valutazione individuale.',
    before: { ...selectedCase.before },
    after: { ...selectedCase.after },
  };
}
