/**
 * Normalise a user-entered URL into a safe absolute href for an external link.
 *
 * A value like "google.com" or "meet.google.com/abc" has no scheme, so a raw
 * <a href="google.com"> is resolved RELATIVE to the current page — the SPA then
 * tries to navigate to /student/google.com, lands on an unknown route, and the
 * user appears to get logged out. Prefixing https:// makes it a true external
 * link that opens in a new tab as intended.
 *
 * Returns undefined for empty input so callers can conditionally render the link.
 */
export function externalHref(url) {
  if (!url) return undefined;
  const u = String(url).trim();
  if (!u) return undefined;
  if (/^(https?:\/\/|mailto:|tel:)/i.test(u)) return u;
  return `https://${u}`;
}
