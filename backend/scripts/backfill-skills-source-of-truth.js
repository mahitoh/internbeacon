/**
 * Migration (Option C) — make student_profiles.skills / .languages the single
 * source of truth and reduce ai_summary to extraction/display metadata only.
 *
 * For every student_profiles row, in this SAFE order (never loses data):
 *   1. If the typed column (skills / languages) is empty BUT ai_summary holds
 *      values, copy them up into the column first.  (legacy / blob-only rows)
 *   2. Then strip `skills` and `languages` out of ai_summary so the blob keeps
 *      only narrative metadata (summary, education, experience, method).
 *
 * Because step 1 runs before step 2, a value can never be dropped: anything in
 * the blob is promoted to the authoritative column before the blob is narrowed.
 * For rows that already have a curated column, the blob's extra (e.g. previously
 * deleted) skills are intentionally NOT resurrected — that is the whole point of
 * Option C: the user's curated list wins.
 *
 * Idempotent: re-running is a no-op once blobs are narrowed.
 *
 * Usage:
 *   node scripts/backfill-skills-source-of-truth.js          # dry-run (no writes)
 *   node scripts/backfill-skills-source-of-truth.js --apply  # perform the migration
 */
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const { supabaseAdmin } = require('../src/config/supabase');
const { normalizeSkill } = require('../src/utils/matchingEngine');

const APPLY = process.argv.includes('--apply');

const isNonEmptyArray = (a) => Array.isArray(a) && a.length > 0;

// De-duplicate while preserving the first occurrence's display casing.
// `keyFn` collapses aliases/case so "Excel" and "excel" don't both survive.
function dedupeBy(arr, keyFn) {
  const out = [], seen = new Set();
  for (const x of (arr || [])) {
    const key = keyFn(x);
    if (key && !seen.has(key)) { seen.add(key); out.push(x); }
  }
  return out;
}

const dedupeSkills = (arr) => dedupeBy(arr, (s) => normalizeSkill(s));
const dedupeLangs  = (arr) => dedupeBy(arr, (l) => String(l || '').toLowerCase().trim());

(async () => {
  console.log(`\n── Option C backfill ${APPLY ? '(APPLY)' : '(dry-run)'} ──────────────────`);

  const { data: rows, error } = await supabaseAdmin
    .from('student_profiles')
    .select('id, user_id, first_name, last_name, skills, languages, ai_summary');

  if (error) { console.error('✖ fetch failed:', error.message); process.exit(1); }
  console.log(`  fetched ${rows.length} student profiles\n`);

  let changed = 0, promotedSkills = 0, promotedLangs = 0, strippedBlobs = 0;

  for (const r of rows) {
    const label = `${r.first_name || '?'} ${r.last_name || ''}`.trim() || r.user_id;
    const update = {};

    // 1. Promote blob values into empty columns (safety net for legacy rows).
    if (!isNonEmptyArray(r.skills) && isNonEmptyArray(r.ai_summary?.skills)) {
      update.skills = dedupeSkills(r.ai_summary.skills);
      promotedSkills++;
    }
    if (!isNonEmptyArray(r.languages) && isNonEmptyArray(r.ai_summary?.languages)) {
      update.languages = dedupeLangs(r.ai_summary.languages);
      promotedLangs++;
    }

    // 2. Narrow ai_summary to narrative-only (drop skills/languages keys).
    if (r.ai_summary && (('skills' in r.ai_summary) || ('languages' in r.ai_summary))) {
      const { skills, languages, ...narrative } = r.ai_summary;
      update.ai_summary = narrative;
      strippedBlobs++;
    }

    if (Object.keys(update).length === 0) continue;
    changed++;

    const note = [
      update.skills    ? `+${update.skills.length} skills→col`    : '',
      update.languages ? `+${update.languages.length} langs→col`  : '',
      update.ai_summary !== undefined ? 'blob narrowed'           : '',
    ].filter(Boolean).join(', ');
    console.log(`  ${APPLY ? '✓' : '·'} ${label.padEnd(28)} ${note}`);

    if (APPLY) {
      const { error: upErr } = await supabaseAdmin
        .from('student_profiles').update(update).eq('id', r.id);
      if (upErr) console.error(`    ✖ update failed for ${label}: ${upErr.message}`);
    }
  }

  console.log(`\n  rows needing change : ${changed}`);
  console.log(`  skills promoted     : ${promotedSkills}`);
  console.log(`  languages promoted  : ${promotedLangs}`);
  console.log(`  blobs narrowed      : ${strippedBlobs}`);
  console.log(APPLY
    ? '\n✔ Migration applied.\n'
    : '\nDry-run only — no writes. Re-run with --apply to perform the migration.\n');
})().catch(e => { console.error('\n✖ Backfill failed:', e.message); process.exit(1); });
