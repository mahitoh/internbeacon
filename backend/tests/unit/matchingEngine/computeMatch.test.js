const test = require('node:test');
const assert = require('node:assert/strict');
const { computeMatch } = require('../../../src/utils/matchingEngine');
const { makeStudent, makeOffer } = require('../../helpers/fixtures');

test('computeMatch — result shape', async (t) => {
  await t.test('always returns the documented contract', () => {
    const r = computeMatch(makeStudent(), makeOffer());
    assert.ok(typeof r.score === 'number');
    assert.ok(['Excellent Match', 'Good Match', 'Moderate Match', 'Low Match', 'Review Carefully'].includes(r.verdict));
    assert.ok(Array.isArray(r.strengths));
    assert.ok(Array.isArray(r.gaps));
    assert.equal(typeof r.tip, 'string');
    assert.ok(r.breakdown && typeof r.breakdown === 'object');
    assert.equal(r.method, 'algorithmic');
  });

  await t.test('score is an integer within 0..100', () => {
    const r = computeMatch(makeStudent(), makeOffer());
    assert.ok(Number.isInteger(r.score));
    assert.ok(r.score >= 0 && r.score <= 100);
  });

  await t.test('breakdown factor scores are normalized to 0..1', () => {
    const { breakdown } = computeMatch(makeStudent(), makeOffer());
    for (const key of ['skills', 'domain', 'location', 'level', 'language']) {
      assert.ok(breakdown[key].score >= 0 && breakdown[key].score <= 1, `${key} out of range`);
    }
  });
});

test('computeMatch — skills factor (35%)', async (t) => {
  await t.test('full coverage of required skills scores Excellent', () => {
    const r = computeMatch(makeStudent(), makeOffer());
    assert.equal(r.score, 100);
    assert.equal(r.verdict, 'Excellent Match');
    assert.deepEqual(r.breakdown.skills.matched.sort(), ['JavaScript', 'React']);
    assert.deepEqual(r.breakdown.skills.missing, []);
  });

  await t.test('matches skills through alias normalization', () => {
    const student = makeStudent({ skills: ['reactjs', 'JS'] });   // aliases of React / JavaScript
    const r = computeMatch(student, makeOffer({ required_skills: ['React', 'JavaScript'] }));
    assert.equal(r.breakdown.skills.matched.length, 2);
    assert.deepEqual(r.breakdown.skills.missing, []);
  });

  await t.test('partial coverage lists the missing skills', () => {
    const r = computeMatch(makeStudent({ skills: ['JavaScript'] }), makeOffer());
    assert.deepEqual(r.breakdown.skills.matched, ['JavaScript']);
    assert.deepEqual(r.breakdown.skills.missing, ['React']);
  });

  await t.test('an offer with no required skills is flagged, not treated as a match', () => {
    const r = computeMatch(makeStudent(), makeOffer({ required_skills: [] }));
    assert.equal(r.breakdown.skills.noRequirements, true);
  });
});

test('computeMatch — blocking conditions', async (t) => {
  await t.test('zero skill overlap forces a Low Match verdict + warning', () => {
    const student = makeStudent({ skills: ['Welding', 'Carpentry'] });
    const r = computeMatch(student, makeOffer());           // offer requires JS/React
    assert.equal(r.verdict, 'Low Match');
    assert.match(r.warning, /no skills matching/i);
  });

  await t.test('does NOT block on zero skills when the offer lists no requirements', () => {
    const student = makeStudent({ skills: [] });
    const r = computeMatch(student, makeOffer({ required_skills: [] }));
    assert.notEqual(r.verdict, 'Low Match');
    assert.equal(r.warning, null);
  });

  await t.test('a hard study-year miss caps score at 64 and flags Review Carefully', () => {
    const student = makeStudent({ study_year: 1 });          // year 1 vs a final-year role
    const offer   = makeOffer({ requirements: 'Final year students only — Master level preferred' });
    const r = computeMatch(student, offer);
    assert.equal(r.verdict, 'Review Carefully');
    assert.ok(r.score <= 64);
    assert.match(r.warning, /study year/i);
  });

  await t.test('a clear location mismatch downgrades Excellent to Good', () => {
    const student = makeStudent({ city: 'Douala' });
    const offer   = makeOffer({ location: 'Garoua' });       // different region
    const r = computeMatch(student, offer);
    assert.equal(r.verdict, 'Good Match');
    assert.match(r.warning, /different city|relocation/i);
  });
});

test('computeMatch — location factor (15%)', async (t) => {
  await t.test('remote offers score full marks regardless of city', () => {
    const r = computeMatch(makeStudent({ city: 'Maroua' }), makeOffer({ location: 'Remote' }));
    assert.equal(r.breakdown.location.score, 1);
  });

  await t.test('same city scores full marks', () => {
    const r = computeMatch(makeStudent({ city: 'Douala' }), makeOffer({ location: 'Douala' }));
    assert.equal(r.breakdown.location.score, 1);
  });

  await t.test('a different region scores low', () => {
    const r = computeMatch(makeStudent({ city: 'Douala' }), makeOffer({ location: 'Garoua' }));
    assert.ok(r.breakdown.location.score <= 0.3);
  });
});

test('computeMatch — domain redistribution', async (t) => {
  await t.test('an unrecognized programme is marked unknown, not penalized to zero', () => {
    const student = makeStudent({ programme: 'Basket Weaving', faculty: 'Crafts' });
    const r = computeMatch(student, makeOffer());
    assert.equal(r.breakdown.domain.unknown, true);
    // neutral 50 fallback for the domain factor → never a 0 penalty
    assert.equal(r.breakdown.domain.score, 0.5);
    // still a usable score because skills/location/level carry it
    assert.ok(r.score >= 50);
  });

  await t.test('a recognized programme aligned with the domain scores the domain high', () => {
    const r = computeMatch(makeStudent(), makeOffer());      // software eng ↔ IT
    assert.equal(r.breakdown.domain.unknown, false);
    assert.equal(r.breakdown.domain.score, 1);
  });
});

test('computeMatch — language factor (5%)', async (t) => {
  await t.test('full marks when the student speaks every required language', () => {
    const offer = makeOffer({ description: 'English and French required.', requirements: '' });
    const r = computeMatch(makeStudent({ languages: ['English', 'French'] }), offer);
    assert.equal(r.breakdown.language.score, 1);
  });

  await t.test('half marks when one of two required languages is missing', () => {
    const offer = makeOffer({ description: 'English and French required.', requirements: '' });
    const r = computeMatch(makeStudent({ languages: ['English'] }), offer);
    assert.equal(r.breakdown.language.score, 0.5);
  });

  await t.test('full marks when the offer states no language requirement', () => {
    const offer = makeOffer({ description: 'Great team.', requirements: 'Motivated student.' });
    const r = computeMatch(makeStudent({ languages: [] }), offer);
    assert.equal(r.breakdown.language.score, 1);
  });

  await t.test('required_languages field takes priority over text scanning', () => {
    const offer = makeOffer({ description: 'Great team.', requirements: 'Motivated student.', required_languages: ['French'] });
    const r = computeMatch(makeStudent({ languages: ['English'] }), offer);
    assert.equal(r.breakdown.language.score, 0);
  });

  await t.test('a language tagged as a required skill is read as a language, not a missing skill', () => {
    const offer = makeOffer({
      required_skills: ['JavaScript', 'React', 'French'],
      required_languages: ['French'],
      description: 'Great team.', requirements: 'Motivated student.',
    });
    const r = computeMatch(makeStudent({ languages: ['English'] }), offer);
    assert.deepEqual(r.breakdown.skills.missing, []);          // French never counted as a missing skill
    assert.equal(r.breakdown.skills.matched.length, 2);          // JavaScript + React still matched
    assert.equal(r.breakdown.language.score, 0);                 // but the language gap is still flagged
  });
});

test('computeMatch — location factor: missing data', async (t) => {
  await t.test('missing offer location is excluded, not scored as a 50% partial match', () => {
    const r = computeMatch(makeStudent(), makeOffer({ location: '' }));
    assert.equal(r.breakdown.location.unknown, true);
    assert.equal(r.breakdown.location.score, 0.5); // neutral fallback, but explicitly flagged unknown
  });

  await t.test('missing student city is excluded, not scored as a 50% partial match', () => {
    const r = computeMatch(makeStudent({ city: '' }), makeOffer());
    assert.equal(r.breakdown.location.unknown, true);
  });

  await t.test('an unknown location never triggers the Excellent→Good mismatch downgrade', () => {
    const r = computeMatch(makeStudent({ city: '' }), makeOffer());
    assert.notEqual(r.verdict, 'Good Match');
  });
});

test('computeMatch — determinism', async (t) => {
  await t.test('the same inputs always yield the same score (no AI/randomness)', () => {
    const s = makeStudent();
    const o = makeOffer();
    const a = computeMatch(s, o);
    const b = computeMatch(s, o);
    assert.deepEqual(a, b);
    assert.equal(a.method, 'algorithmic');
  });
});
