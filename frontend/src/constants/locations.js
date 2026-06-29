// Single source of truth for Cameroonian city options across the app — one city
// per region recognized by the backend's matching engine (backend/src/utils/
// matchingEngine.js CAMEROON_REGIONS), so "same region" location scoring always
// has a corresponding pickable city in every dropdown. Previously each form
// hardcoded its own partial list, so a company in (e.g.) Ebolowa never appeared
// as an option anywhere and couldn't be selected.
export const CAMEROON_CITIES = [
  'Yaoundé',     // Centre
  'Douala',      // Littoral
  'Bafoussam',   // Ouest
  'Bamenda',     // Nord-Ouest
  'Garoua',      // Nord
  'Ngaoundéré',  // Adamaoua
  'Bertoua',     // Est
  'Ebolowa',     // Sud
  'Buea',        // Sud-Ouest
  'Limbé',       // Sud-Ouest
  'Maroua',      // Extrême-Nord
];

// Offer location picker also allows "Remote".
export const OFFER_LOCATIONS = [...CAMEROON_CITIES, 'Remote'];
