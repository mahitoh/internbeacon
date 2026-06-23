const test = require('node:test');
const assert = require('node:assert/strict');
const { getVerdict } = require('../../../src/utils/matchingEngine');

// Thesis thresholds: >=85 Excellent, >=70 Good, >=50 Moderate, else Low.
test('getVerdict', async (t) => {
  await t.test('classifies the four bands', () => {
    assert.equal(getVerdict(92), 'Excellent Match');
    assert.equal(getVerdict(75), 'Good Match');
    assert.equal(getVerdict(55), 'Moderate Match');
    assert.equal(getVerdict(20), 'Low Match');
  });

  await t.test('is correct exactly on each boundary', () => {
    assert.equal(getVerdict(85), 'Excellent Match');
    assert.equal(getVerdict(84), 'Good Match');
    assert.equal(getVerdict(70), 'Good Match');
    assert.equal(getVerdict(69), 'Moderate Match');
    assert.equal(getVerdict(50), 'Moderate Match');
    assert.equal(getVerdict(49), 'Low Match');
  });

  await t.test('handles the extremes', () => {
    assert.equal(getVerdict(100), 'Excellent Match');
    assert.equal(getVerdict(0), 'Low Match');
  });
});
