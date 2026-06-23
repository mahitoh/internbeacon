const test = require('node:test');
const assert = require('node:assert/strict');
const { extractJSON } = require('../../../src/utils/aiProvider');

// extractJSON strips conversational preamble/trailing text from an LLM reply
// before JSON.parse, so CV parsing survives chatty model responses.
test('extractJSON', async (t) => {
  await t.test('parses an object embedded in surrounding prose', () => {
    const reply = 'Sure! Here is the data:\n{"skills":["React"],"languages":["English"]}\nHope that helps.';
    assert.deepEqual(extractJSON(reply), { skills: ['React'], languages: ['English'] });
  });

  await t.test('parses an array when expectArray is set', () => {
    const reply = 'Results: ["a","b","c"] done';
    assert.deepEqual(extractJSON(reply, true), ['a', 'b', 'c']);
  });

  await t.test('handles nested braces via first-open / last-close slicing', () => {
    const reply = 'noise {"a":{"b":1},"c":2} noise';
    assert.deepEqual(extractJSON(reply), { a: { b: 1 }, c: 2 });
  });

  await t.test('throws a clear error when no JSON is present', () => {
    assert.throws(() => extractJSON('there is no json here'), /No JSON found/);
  });
});
