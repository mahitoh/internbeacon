const test = require('node:test');
const assert = require('node:assert/strict');
const { computeRecommendationReasons } = require('../../../src/utils/matchingEngine');
const { makeStudent, makeOffer } = require('../../helpers/fixtures');

test('computeRecommendationReasons', async (t) => {
  await t.test('extends the match result with a reasons array', () => {
    const r = computeRecommendationReasons(makeStudent(), makeOffer());
    assert.ok(Array.isArray(r.reasons));
    assert.ok(r.reasons.length > 0);
    // still carries the full match contract
    assert.equal(r.method, 'algorithmic');
    assert.ok(typeof r.score === 'number');
  });

  await t.test('cites programme, skills and study-year fit on a strong match', () => {
    const r = computeRecommendationReasons(makeStudent(), makeOffer());
    const joined = r.reasons.join(' | ');
    assert.match(joined, /programme/i);
    assert.match(joined, /skill/i);
    assert.match(joined, /Year 3/i);
  });

  await t.test('falls back to a generic reason when nothing specific applies', () => {
    const student = makeStudent({ skills: [], programme: 'Basket Weaving', faculty: 'Crafts', study_year: null });
    const offer   = makeOffer({ required_skills: [] });
    const r = computeRecommendationReasons(student, offer);
    assert.deepEqual(r.reasons, ['Based on your profile']);
  });
});
