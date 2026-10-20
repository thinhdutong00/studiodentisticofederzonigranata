import test from 'node:test';
import assert from 'node:assert/strict';
import { orthodonticAgeRanges, orthodonticBites, orthodonticConcerns, orthodonticObjectives } from '../src/data/orthodonticQuiz.js';
import { getOrthodonticQuizRecommendation } from '../src/data/orthodonticQuizRecommendation.js';

const validCaseIds = ['caso-1', 'caso-2', 'caso-3'];
const caption = 'Esempio di un trattamento eseguito nello studio. Ogni caso richiede una valutazione individuale.';
const concernDescriptions = {
  'Denti affollati': /i denti si sovrappongono/i,
  'Denti separati': /spazi tra i denti/i,
};
const biteDescriptions = {
  'Morso crociato': /denti superiori chiudono all’interno di quelli inferiori/i,
  'Overjet negativo': /denti inferiori sporgono rispetto a quelli superiori/i,
  Sovramorso: /denti superiori coprono molto quelli inferiori/i,
  'Morso aperto': /le arcate non si chiudono completamente/i,
};

for (const problem of orthodonticConcerns.map(option => option.value)) {
  for (const occlusion of orthodonticBites.map(option => option.value)) {
    test(`conditional invitation responds safely to ${problem} / ${occlusion}`, () => {
      const result = getOrthodonticQuizRecommendation({ problem, occlusion });
      assert.match(result.text, /^Se /);
      assert.match(result.text, /una visita ortodontica potrebbe/);
      assert.ok(validCaseIds.includes(result.caseId));
      assert.equal(result.caseCaption, caption);
      const number = result.caseId.slice(-1);
      assert.equal(result.before.src, `/assets/optimized/ortodonzia-quiz-caso-${number}-prima.webp`);
      assert.equal(result.after.src, `/assets/optimized/ortodonzia-quiz-caso-${number}-dopo.webp`);
      assert.equal(result.before.width, 600);
      assert.equal(result.after.height, 300);
      assert.match(result.before.alt, /prima del trattamento/);
      assert.match(result.after.alt, /dopo il trattamento/);
      assert.doesNotMatch(result.text, /diagnosi|hai un|hai il|sei affetto|idone[oa]|Invisalign|risultat[oi] garantit|risolveremo|correggeremo|hai scelto|hai selezionato|immagin[ei]|denti affollati|denti separati|morso crociato|overjet negativo|sovramorso|morso aperto/i);
      if (problem !== 'Altro') assert.match(result.text, concernDescriptions[problem]);
      else assert.doesNotMatch(result.text, /i denti si sovrappongono|spazi tra i denti/i);
      if (occlusion !== 'Altro') assert.match(result.text, biteDescriptions[occlusion]);
      for (const [bite, description] of Object.entries(biteDescriptions)) {
        if (bite !== occlusion) assert.doesNotMatch(result.text, description);
      }
    });
  }
}

test('crowded teeth and open bite use the agreed natural conditional copy', () => {
  const expected = 'Se i denti si sovrappongono e le arcate non si chiudono completamente, una visita ortodontica potrebbe essere il primo passo per capire quali soluzioni sono più adatte al tuo sorriso.';
  for (const initialReason of [undefined, 'Allineare i miei denti']) {
    assert.equal(getOrthodonticQuizRecommendation({ problem: 'Denti affollati', occlusion: 'Morso aperto', initialReason }).text, expected);
  }
});

test('unknown, missing or malformed answers use safe copy without reflecting arbitrary values', () => {
  const fallback = getOrthodonticQuizRecommendation();
  for (const input of [null, undefined, [], 'Denti affollati', 42, {}, { problem: '<img onerror=alert(1)>', occlusion: 'Morso inventato', initialReason: 'Testo non consentito' }, { problem: { toString: () => 'Denti affollati' }, occlusion: 7 }]) {
    const result = getOrthodonticQuizRecommendation(input);
    assert.deepEqual(result, fallback);
    assert.doesNotMatch(result.text, /<img|onerror|inventato|non consentito/);
  }
});

test('an unrecognized answer does not erase another valid choice or add an unreported condition', () => {
  const invalid = '<script>untrusted</script>';
  assert.deepEqual(
    getOrthodonticQuizRecommendation({ problem: 'Denti affollati', occlusion: invalid, initialReason: invalid }),
    getOrthodonticQuizRecommendation({ problem: 'Denti affollati', occlusion: 'Altro' }),
  );
  assert.deepEqual(
    getOrthodonticQuizRecommendation({ problem: invalid, occlusion: 'Morso aperto' }),
    getOrthodonticQuizRecommendation({ problem: 'Altro', occlusion: 'Morso aperto' }),
  );
});

test('Altro does not guess unreported problems and keeps a generic example caption', () => {
  const result = getOrthodonticQuizRecommendation({ problem: 'Altro', occlusion: 'Altro' });
  assert.match(result.text, /^Se desideri capire meglio l’allineamento dei denti e la chiusura delle arcate, /);
  assert.doesNotMatch(result.text, /sovrappongono|spazi tra i denti|non si chiudono completamente|superiori|inferiori/i);
  assert.equal(result.caseCaption, caption);
  assert.doesNotMatch(result.caseCaption, /simile|uguale|il tuo caso/i);
});

test('changing answers rebuilds the invitation and can select another real photo pair', () => {
  const first = getOrthodonticQuizRecommendation({ problem: 'Denti affollati', occlusion: 'Altro' });
  const changedConcern = getOrthodonticQuizRecommendation({ problem: 'Denti separati', occlusion: 'Altro' });
  const changedBite = getOrthodonticQuizRecommendation({ problem: 'Altro', occlusion: 'Morso crociato' });
  assert.notEqual(first.text, changedConcern.text);
  assert.notEqual(first.before.src, changedConcern.before.src);
  assert.notEqual(changedConcern.text, changedBite.text);
  assert.notEqual(changedConcern.before.src, changedBite.before.src);
  assert.doesNotMatch(changedBite.text, /denti separati/i);
});

test('photo selection uses visible alignment features without inventing bite labels for unclassified cases', () => {
  for (const { value: occlusion } of orthodonticBites) {
    assert.equal(getOrthodonticQuizRecommendation({ problem: 'Denti affollati', occlusion }).caseId, 'caso-2');
    assert.equal(getOrthodonticQuizRecommendation({ problem: 'Denti separati', occlusion }).caseId, 'caso-3');
    const generic = getOrthodonticQuizRecommendation({ problem: 'Altro', occlusion });
    assert.equal(generic.caseId, 'caso-1');
    assert.equal(generic.caseCaption, caption);
    assert.doesNotMatch(generic.before.alt + generic.after.alt, /crociato|overjet|sovramorso|aperto/i);
  }
});

test('recognized objectives adapt the invitation without suggesting a treatment or result', () => {
  const texts = new Set();
  for (const { title: initialReason } of orthodonticObjectives) {
    const result = getOrthodonticQuizRecommendation({ problem: 'Denti affollati', occlusion: 'Altro', initialReason });
    assert.match(result.text, /^Se i denti si sovrappongono, /);
    assert.match(result.text, /una visita ortodontica potrebbe/);
    assert.doesNotMatch(result.text, /Invisalign|sicuramente|garantit|otterrai|Hai scelto/i);
    assert.equal(result.caseId, 'caso-2');
    texts.add(result.text);
  }
  assert.equal(texts.size, orthodonticObjectives.length);
});

test('age and unknown fields do not imply a diagnosis or alter the chosen example', () => {
  const answers = { problem: 'Denti separati', occlusion: 'Morso aperto' };
  const baseline = getOrthodonticQuizRecommendation(answers);
  for (const { value: ageRange } of orthodonticAgeRanges) {
    assert.deepEqual(getOrthodonticQuizRecommendation({ ...answers, ageRange, patientAge: '77', unsafe: 'free text' }), baseline);
  }
});

test('the helper is deterministic, does not mutate answers and does not share mutable image records', () => {
  const answers = Object.freeze({ problem: 'Denti affollati', occlusion: 'Sovramorso' });
  const first = getOrthodonticQuizRecommendation(answers);
  const second = getOrthodonticQuizRecommendation(answers);
  assert.deepEqual(first, second);
  first.before.src = '/tampered.webp';
  first.after.alt = 'Changed';
  assert.deepEqual(getOrthodonticQuizRecommendation(answers), second);
});
