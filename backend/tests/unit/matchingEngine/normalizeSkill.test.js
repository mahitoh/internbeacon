const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeSkill } = require('../../../src/utils/matchingEngine');

test('normalizeSkill', async (t) => {
  await t.test('lowercases and trims', () => {
    assert.equal(normalizeSkill('  JavaScript  '), 'javascript');
    assert.equal(normalizeSkill('PYTHON'), 'python');
  });

  await t.test('maps known aliases to a canonical name', () => {
    assert.equal(normalizeSkill('reactjs'), 'react');
    assert.equal(normalizeSkill('React.js'), 'react');
    assert.equal(normalizeSkill('JS'), 'javascript');
    assert.equal(normalizeSkill('Node.js'), 'nodejs');
    assert.equal(normalizeSkill('Postgres'), 'postgresql');
    assert.equal(normalizeSkill('TS'), 'typescript');
  });

  await t.test('normalizes French skill labels (Cameroon context)', () => {
    assert.equal(normalizeSkill('comptabilité'), 'accounting');
    assert.equal(normalizeSkill('gestion'), 'management');
    assert.equal(normalizeSkill('ressources humaines'), 'human resources');
  });

  await t.test('passes unknown skills through (lowercased)', () => {
    assert.equal(normalizeSkill('Rust'), 'rust');
    assert.equal(normalizeSkill('Basket Weaving'), 'basket weaving');
  });

  await t.test('handles null / undefined / empty safely', () => {
    assert.equal(normalizeSkill(null), '');
    assert.equal(normalizeSkill(undefined), '');
    assert.equal(normalizeSkill(''), '');
  });
});
