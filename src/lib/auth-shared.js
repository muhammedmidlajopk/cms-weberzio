/**
 * Edge + Node compatible auth utilities.
 * Uses Web Crypto (SubtleCrypto) so the same code runs in the Edge proxy
 * and in Node.js API routes.
 */

const SESSION_COOKIE = "admin_session";

function getSecret() {
  return process.env.ADMIN_SECRET || "dev-secret-change-in-production";
}

function base64UrlDecode(str) {
  const pad = str.length % 4 === 0 ? "" : "=".repeat(4 - (str.length % 4));
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/") + pad;
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

function bytesToHex(bytes) {
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
}

function timingSafeEqualHex(a, b) {
  if (typeof a !== "string" || typeof b !== "string" || a.length !== b.length) {
    return false;
  }
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function hmacSha256Hex(secret, data) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, enc.encode(data));
  return bytesToHex(new Uint8Array(sig));
}

/**
 * Verify a session token: check HMAC signature, then expiry.
 * Returns the payload or null.
 */
export async function verifySession(token) {
  try {
    if (typeof token !== "string") return null;
    const parts = token.split(".");
    if (parts.length !== 2) return null;

    const [encoded, signature] = parts;
    const expected = await hmacSha256Hex(getSecret(), encoded);
    if (!timingSafeEqualHex(signature, expected)) return null;

    const jsonBytes = base64UrlDecode(encoded);
    const json = new TextDecoder().decode(jsonBytes);
    const payload = JSON.parse(json);

    if (typeof payload.exp !== "number" || Date.now() > payload.exp) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export { SESSION_COOKIE };
