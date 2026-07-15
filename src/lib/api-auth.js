import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifySession, SESSION_COOKIE } from "./auth-shared";

/**
 * Verify the session cookie. Uses next/headers cookies() for reliability
 * across dev/prod. Falls back to parsing the raw cookie header.
 */
export async function requireAuth(request) {
  let token = null;

  try {
    const store = await cookies();
    token = store.get(SESSION_COOKIE)?.value || null;
  } catch {
    // cookies() unavailable — fall through to header parsing
  }

  if (!token && request) {
    const cookieHeader = request.headers.get("cookie") || "";
    const parsed = parseCookies(cookieHeader);
    token = parsed[SESSION_COOKIE] || null;
  }

  if (!token) {
    return NextResponse.json(
      { error: "Authentication required" },
      { status: 401 }
    );
  }

  const session = verifySession(token);
  if (!session) {
    return NextResponse.json(
      { error: "Session expired or invalid" },
      { status: 401 }
    );
  }

  return session;
}

function parseCookies(cookieString) {
  const result = {};
  if (!cookieString) return result;

  cookieString.split(";").forEach((cookie) => {
    const [name, ...rest] = cookie.split("=");
    if (name) {
      result[name.trim()] = rest.join("=").trim();
    }
  });

  return result;
}
