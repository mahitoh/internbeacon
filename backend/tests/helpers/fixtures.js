/**
 * Shared test fixtures — builders for the student / offer shapes that
 * matchingEngine.computeMatch() expects. Pass an overrides object to tweak a
 * single field while keeping the rest a sensible default.
 *
 * computeMatch reads snake_case keys (required_skills, study_year), matching the
 * Supabase column names the controllers pass through.
 */

// A strong IT/software student (the canonical "good match" persona).
function makeStudent(overrides = {}) {
  return {
    skills:     ['JavaScript', 'React', 'Node.js'],
    programme:  'BSc Software Engineering',
    faculty:    'College of Technology',
    study_year: 3,
    city:       'Douala',
    languages:  ['English', 'French'],
    ...overrides,
  };
}

// A frontend internship in Douala requiring JS/React from a 3rd-year student.
function makeOffer(overrides = {}) {
  return {
    required_skills: ['JavaScript', 'React'],
    domain:          'Information Technology',
    location:        'Douala',
    requirements:    '3rd year students with JavaScript and React experience',
    description:     'Frontend internship building React UIs. English required.',
    ...overrides,
  };
}

module.exports = { makeStudent, makeOffer };
