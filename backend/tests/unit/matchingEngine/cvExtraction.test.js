const test = require('node:test');
const assert = require('node:assert/strict');
const { extractSkillsFromText, extractLanguagesFromText } = require('../../../src/utils/matchingEngine');

// Deterministic keyword extraction is the no-AI fallback for CV parsing, so it
// must reliably pull canonical skill names that align with how offers list them.
test('extractSkillsFromText', async (t) => {
  await t.test('detects canonical skill names from CV-style prose', () => {
    const text = 'Built full-stack apps with JavaScript, React and Node.js. Comfortable with SQL and Git.';
    const skills = extractSkillsFromText(text);
    assert.ok(skills.includes('JavaScript'));
    assert.ok(skills.includes('React'));
    assert.ok(skills.includes('Node.js'));
    assert.ok(skills.includes('SQL'));
    assert.ok(skills.includes('Git'));
  });

  await t.test('detects non-IT skills (finance / office)', () => {
    const skills = extractSkillsFromText('Daily bookkeeping in Excel; accounting and financial analysis.');
    assert.ok(skills.includes('Excel'));
    assert.ok(skills.includes('Accounting'));
    assert.ok(skills.includes('Financial Analysis'));
  });

  await t.test('returns an empty array for empty / null input', () => {
    assert.deepEqual(extractSkillsFromText(''), []);
    assert.deepEqual(extractSkillsFromText(null), []);
    assert.deepEqual(extractSkillsFromText(undefined), []);
  });

  await t.test('does not invent skills from unrelated text', () => {
    assert.deepEqual(extractSkillsFromText('I enjoy hiking and cooking on weekends.'), []);
  });
});

test('extractLanguagesFromText', async (t) => {
  await t.test('detects English and French (both English and French labels)', () => {
    assert.deepEqual(extractLanguagesFromText('Languages: English (fluent), French (native)'), ['English', 'French']);
    assert.deepEqual(extractLanguagesFromText('Anglais courant, Français natif'), ['English', 'French']);
  });

  await t.test('detects regional and additional languages', () => {
    const langs = extractLanguagesFromText('Fluent in English, Fulfulde and some Spanish');
    assert.ok(langs.includes('English'));
    assert.ok(langs.includes('Fulfulde'));
    assert.ok(langs.includes('Spanish'));
  });

  await t.test('returns an empty array when no language is mentioned', () => {
    assert.deepEqual(extractLanguagesFromText('Motivated and hardworking student.'), []);
    assert.deepEqual(extractLanguagesFromText(null), []);
  });
});
