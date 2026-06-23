/**
 * Auth token storage that honours the login "Keep me signed in" choice.
 *
 * - Checked  → tokens go in localStorage and survive a browser restart.
 * - Unchecked → tokens go in sessionStorage and are cleared when the browser
 *   (tab) closes.
 *
 * The choice is recorded under `auth:persist` so every write targets the same
 * store. Reads check sessionStorage first, then localStorage, so a token written
 * by either store (including sessions created before this feature existed) is
 * still found. When the flag is unset the default is to persist — matching the
 * app's previous always-localStorage behaviour.
 */
const PERSIST_KEY = 'auth:persist';
const TOKEN_KEYS = ['accessToken', 'refreshToken'];

export function setPersist(remember) {
  localStorage.setItem(PERSIST_KEY, remember ? '1' : '0');
}

function activeStore() {
  return localStorage.getItem(PERSIST_KEY) === '0' ? sessionStorage : localStorage;
}

export function setToken(key, value) {
  activeStore().setItem(key, value);
}

export function getToken(key) {
  return sessionStorage.getItem(key) ?? localStorage.getItem(key);
}

export function clearTokens() {
  for (const k of TOKEN_KEYS) {
    localStorage.removeItem(k);
    sessionStorage.removeItem(k);
  }
}
