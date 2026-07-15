import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "./auth-shared";

const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || "admin",
  password: process.env.ADMIN_PASSWORD || "admin123",
};

function getSecret() {
  return process.env.ADMIN_SECRET || "dev-secret-change-in-production";
}

function base64UrlEncode(bytes) {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function bytesToHex(bytes) {
  let hex = "";
  for (let i = 0; i < bytes.length; i++) {
    hex += bytes[i].toString(16).padStart(2, "0");
  }
  return hex;
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
 * Generate an HMAC-signed session token.
 * Format: base64url(JSON payload) + "." + hex(HMAC-SHA256)
 */
export async function createSession() {
  const payload = {
    id: "1",
    username: ADMIN_CREDENTIALS.username,
    exp: Date.now() + SESSION_DURATION,
  };

  const jsonBytes = new TextEncoder().encode(JSON.stringify(payload));
  const encoded = base64UrlEncode(jsonBytes);
  const signature = await hmacSha256Hex(getSecret(), encoded);

  return `${encoded}.${signature}`;
}

export function validateCredentials(username, password) {
  return (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  );
}

export async function setSessionCookie() {
  const cookieStore = await cookies();
  const token = await createSession();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000,
    path: "/",
  });
}

export async function clearSessionCookie() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySession(token);
}

export { verifySession, SESSION_COOKIE };
