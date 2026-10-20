import test from 'node:test';
import assert from 'node:assert/strict';
import { accessSync } from 'node:fs';
import { periodontalAgeRanges, periodontalDurations, periodontalObjectives, periodontalSymptoms } from '../src/data/periodontalQuiz.js';
import { getPeriodontalQuizRecommendation } from '../src/data/periodontalQuizRecommendation.js';

const symptoms = {
  'Sanguinamento quando mi lavo i denti': /le gengive sanguinano quando lavi i denti/,
  'Gengive che si ritirano': /noti che le gengive si ritirano/,
  'Uno o più denti che si muovono': /senti che uno o più denti si muovono/,
  'Alito persistente': /noti un alito persistente/,
};
const durations = {
  'Da pochi giorni': /da pochi giorni/,
  'Da alcune settimane': /da alcune settimane/,
  'Da diversi mesi': /da diversi mesi/,
  'Da più di un anno': /da più di un anno/,
};

for (const periodontalSymptom of periodontalSymptoms) {
  test(`the invitation reflects ${periodontalSymptom} without inferring another symptom`, () => {
    for (const symptomDuration of periodontalDurations) {
      const result = getPeriodontalQuizRecommendation({ periodontalSymptom, symptomDuration });
      assert.match(result.text, /^Se /);
      assert.match(result.text, /una visita parodontale potrebbe/);
      for (const [symptom, description] of Object.entries(symptoms)) {
        if (symptom === periodontalSymptom) assert.match(result.text, description);
        else assert.doesNotMatch(result.text, description);
      }
      for (const [duration, description] of Object.entries(durations)) {
        if (symptoms[periodontalSymptom] && duration === symptomDuration) assert.match(result.text, description);
        else assert.doesNotMatch(result.text, description);
      }
    }
  });
}

test('every objective adapts the invitation while leaving the reported sign and image selection intact', () => {
  const texts = new Set();
  for (const { title: periodontalObjective } of periodontalObjectives) {
    const result = getPeriodontalQuizRecommendation({ periodontalObjective, periodontalSymptom: 'Sanguinamento quando mi lavo i denti', symptomDuration: 'Da alcune settimane' });
    assert.match(result.text, /^Se da alcune settimane le gengive sanguinano quando lavi i denti, una visita parodontale potrebbe/);
    assert.equal(result.visualKind, 'assessment');
    texts.add(result.text);
  }
  assert.equal(texts.size, periodontalObjectives.length);
});

test('every valid answer combination stays conditional without a diagnosis, severity score or promised cure', () => {
  for (const { title: periodontalObjective } of periodontalObjectives) {
    for (const periodontalSymptom of periodontalSymptoms) {
      for (const symptomDuration of periodontalDurations) {
        const result = getPeriodontalQuizRecommendation({ periodontalObjective, periodontalSymptom, symptomDuration });
        assert.match(result.text, /^Se /);
        assert.doesNotMatch(result.text, /hai (?:la|una|un|il)|sei affett|parodontite|gengivite|piorrea|diagnos|rischio|punteggio|grave|urgente|garantit|guarir|risolveremo|salveremo|sicuramente|idone[oa]|estetic|bellezza/i);
      }
    }
  }
});

test('recent or longstanding answers add context without changing the assessment or assigning severity', () => {
  const base = { periodontalObjective: 'Valutare denti che si muovono', periodontalSymptom: 'Uno o più denti che si muovono' };
  const recent = getPeriodontalQuizRecommendation({ ...base, symptomDuration: 'Da pochi giorni' });
  const longstanding = getPeriodontalQuizRecommendation({ ...base, symptomDuration: 'Da più di un anno' });
  assert.notEqual(recent.text, longstanding.text);
  assert.equal(recent.visualKind, 'assessment');
  assert.deepEqual(recent.image, longstanding.image);
  assert.equal(recent.visualCaption, longstanding.visualCaption);
});

test('unknown timing never invents a duration', () => {
  for (const symptomDuration of ['Non saprei indicarlo', undefined, 'Da moltissimi anni']) {
    const result = getPeriodontalQuizRecommendation({ periodontalSymptom: 'Alito persistente', symptomDuration });
    assert.match(result.text, /^Se noti un alito persistente, /);
    assert.doesNotMatch(result.text, /giorni|settimane|mesi|anno|anni/);
  }
});

test('the generic or unreported sign does not acquire symptoms or a duration', () => {
  for (const symptomDuration of periodontalDurations) {
    const result = getPeriodontalQuizRecommendation({ periodontalSymptom: 'Altro / non ho notato segnali particolari', symptomDuration });
    assert.match(result.text, /^Se desideri fare il punto sulla salute delle gengive, /);
    assert.doesNotMatch(result.text, /sanguinano|si ritirano|si muovono|alito|giorni|settimane|mesi|anno/);
    assert.equal(result.visualKind, 'assessment');
  }
});

test('a single verified recession case is the only before and after example', () => {
  for (const { title: periodontalObjective } of periodontalObjectives) {
    for (const symptomDuration of periodontalDurations) {
      const result = getPeriodontalQuizRecommendation({ periodontalObjective, periodontalSymptom: 'Gengive che si ritirano', symptomDuration });
      assert.equal(result.visualKind, 'recession-case');
      assert.equal(result.caseId, 'recessioni-1');
      assert.equal(result.before.src, '/assets/optimized/parodontologia-landing-recessioni-1-prima.webp');
      assert.equal(result.after.src, '/assets/optimized/parodontologia-landing-recessioni-1-dopo.webp');
      assert.equal(result.before.width, 600);
      assert.equal(result.after.height, 352);
      assert.match(result.before.alt, /Recessioni gengivali prima del trattamento mucogengivale/);
      assert.match(result.after.alt, /Lo stesso caso di recessioni gengivali dopo il trattamento mucogengivale/);
      assert.match(result.visualCaption, /trattamento mucogengivale delle recessioni/);
      assert.match(result.visualCaption, /valutazione individuale/);
      assert.doesNotMatch(result.visualCaption + result.before.alt + result.after.alt, /sanguinamento|parodontite|mobilità|muovono|il tuo risultato|simile al tuo/);
    }
  }
});

test('bleeding, mobility, breath and generic answers show an assessment image without a clinical outcome pair', () => {
  for (const { title: periodontalObjective } of periodontalObjectives) {
    for (const periodontalSymptom of periodontalSymptoms.filter(value => value !== 'Gengive che si ritirano')) {
      const result = getPeriodontalQuizRecommendation({ periodontalObjective, periodontalSymptom });
      assert.equal(result.visualKind, 'assessment');
      assert.equal(result.caseId, '');
      assert.equal(result.before, null);
      assert.equal(result.after, null);
      assert.equal(result.image.src, '/assets/optimized/parodontologia-controllo-gengive.webp');
      assert.match(result.image.alt, /Controllo odontoiatrico delle gengive/);
      assert.equal(result.visualCaption, 'La visita permette di valutare le gengive e i tessuti che sostengono i denti.');
      assert.doesNotMatch(result.image.alt + result.visualCaption, /prima|dopo|esito|trattamento|risultato/);
    }
  }
});

test('all selected local images exist', () => {
  const result = getPeriodontalQuizRecommendation({ periodontalSymptom: 'Gengive che si ritirano' });
  for (const photo of [result.image, result.before, result.after]) {
    accessSync(new URL(`../public${photo.src}`, import.meta.url));
  }
});

test('unknown, missing and malformed answers safely fall back without reflecting arbitrary values', () => {
  const fallback = getPeriodontalQuizRecommendation();
  for (const input of [undefined, null, [], 'Gengive che si ritirano', 12, {}, { periodontalObjective: '<img onerror=alert(1)>', periodontalSymptom: '<script>untrusted</script>', symptomDuration: 'Da sempre' }, { periodontalSymptom: { toString: () => 'Gengive che si ritirano' }, symptomDuration: 5 }]) {
    assert.deepEqual(getPeriodontalQuizRecommendation(input), fallback);
  }
});

test('an invalid answer cannot override another recognized answer', () => {
  const invalid = '<script>untrusted</script>';
  assert.deepEqual(
    getPeriodontalQuizRecommendation({ periodontalObjective: invalid, periodontalSymptom: 'Gengive che si ritirano', symptomDuration: invalid }),
    getPeriodontalQuizRecommendation({ periodontalSymptom: 'Gengive che si ritirano' }),
  );
  assert.deepEqual(
    getPeriodontalQuizRecommendation({ periodontalObjective: 'Controllare la mia salute orale', periodontalSymptom: invalid, symptomDuration: 'Da diversi mesi' }),
    getPeriodontalQuizRecommendation({ periodontalObjective: 'Controllare la mia salute orale' }),
  );
});

test('changing from recessions to bleeding rebuilds the copy and removes the clinical outcome pair', () => {
  const first = getPeriodontalQuizRecommendation({ periodontalSymptom: 'Gengive che si ritirano', symptomDuration: 'Da più di un anno' });
  const changed = getPeriodontalQuizRecommendation({ periodontalSymptom: 'Sanguinamento quando mi lavo i denti', symptomDuration: 'Da pochi giorni' });
  assert.notEqual(first.text, changed.text);
  assert.equal(first.visualKind, 'recession-case');
  assert.equal(changed.visualKind, 'assessment');
  assert.equal(changed.before, null);
  assert.equal(changed.after, null);
  assert.doesNotMatch(changed.text, /si ritirano|più di un anno/);
});

test('age, contact details and unknown fields cannot alter the invitation or selected images', () => {
  const answers = { periodontalObjective: 'Prendermi cura delle gengive', periodontalSymptom: 'Gengive che si ritirano', symptomDuration: 'Da alcune settimane' };
  const baseline = getPeriodontalQuizRecommendation(answers);
  for (const { value: ageRange } of periodontalAgeRanges) {
    assert.deepEqual(getPeriodontalQuizRecommendation({ ...answers, ageRange, fullName: 'Arbitrary text', email: '<unsafe>', phone: '3331234567' }), baseline);
  }
});

test('the helper is deterministic, does not mutate input and returns independent image records', () => {
  const answers = Object.freeze({ periodontalSymptom: 'Gengive che si ritirano', symptomDuration: 'Da diversi mesi' });
  const first = getPeriodontalQuizRecommendation(answers);
  const second = getPeriodontalQuizRecommendation(answers);
  assert.deepEqual(first, second);
  first.image.src = '/tampered.webp';
  first.before.src = '/tampered.webp';
  first.after.alt = 'Changed';
  assert.deepEqual(getPeriodontalQuizRecommendation(answers), second);
});
