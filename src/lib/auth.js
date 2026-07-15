import { cookies } from "next/headers";
import crypto from "crypto";
import { verifySession, SESSION_COOKIE } from "./auth-shared";

const SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

// TODO: In production, use environment variables for credentials
// e.g. ADMIN_USERNAME and ADMIN_PASSWORD_HASH
const ADMIN_CREDENTIALS = {
  username: process.env.ADMIN_USERNAME || "admin",
  password: process.env.ADMIN_PASSWORD || "admin123",
};

// TODO: Set ADMIN_SECRET environment variable in production
function getSecret() {
  return process.env.ADMIN_SECRET || "dev-secret-change-in-production";
}

/**
 * Generate a simple session token (HMAC-signed JSON payload)
 * Uses Node.js crypto (only runs in API routes on Node.js runtime)
 */
export function createSession() {
  const payload = {
    id: "1",
    username: ADMIN_CREDENTIALS.username,
    exp: Date.now() + SESSION_DURATION,
  };

  const encoded = base64Encode(JSON.stringify(payload));
  const signature = signToken(encoded);

  return `${encoded}.${signature}`;
}

/**
 * Sign a string using HMAC-SHA256 with Node.js crypto
 */
function signToken(data) {
  return crypto
    .createHmac("sha256", getSecret())
    .update(data)
    .digest("hex");
}

/**
 * Encode a string as base64 for Node.js runtime
 */
function base64Encode(str) {
  return Buffer.from(str).toString("base64");
}

/**
 * Validate admin credentials
 */
export function validateCredentials(username, password) {
  return (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  );
}

/**
 * Set the session cookie
 */
export async function setSessionCookie() {
  const cookieStore = await cookies();
  const token = createSession();

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_DURATION / 1000,
    path: "/",
  });
}

/**
 * Clear the session cookie
 */
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

/**
 * Get the current session from cookies
 */
export async function getSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;

  if (!token) return null;

  return verifySession(token);
}

export { verifySession, SESSION_COOKIE };
