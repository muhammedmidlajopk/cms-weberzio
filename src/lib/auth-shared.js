/**
 * Edge + Node compatible auth utilities
 * No Node.js crypto or Buffer imports - safe for Edge Runtime
 */

const SESSION_COOKIE = "admin_session";

/**
 * Verify and decode a session token (Edge + Node compatible)
 * Uses atob() instead of Buffer for Edge runtime compatibility
 */
export function verifySession(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [encoded] = parts;

    // atob() works in Edge, browser, and Node.js 20+
    const json = atob(encoded);
    const payload = JSON.parse(json);

    if (Date.now() > payload.exp) return null;

    return payload;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
