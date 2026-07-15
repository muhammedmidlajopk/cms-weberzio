import { NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth-shared";

const LOGIN_PATH = "/control/login";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  // Allow access to login page and static files
  if (pathname === LOGIN_PATH || pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Protect all /control routes
  if (pathname.startsWith("/control")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!token) {
      return NextResponse.redirect(new URL(LOGIN_PATH, request.url));
    }

    const session = verifySession(token);

    if (!session) {
      const response = NextResponse.redirect(new URL(LOGIN_PATH, request.url));
      response.cookies.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
      return response;
    }

    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/control/:path*"],
};
