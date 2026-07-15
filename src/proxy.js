import { NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE } from "@/lib/auth-shared";

const LOGIN_PATH = "/control/login";

export async function proxy(request) {
  const { pathname } = request.nextUrl;

  if (pathname === LOGIN_PATH || pathname.startsWith("/_next") || pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/control")) {
    const token = request.cookies.get(SESSION_COOKIE)?.value;

    if (!token) {
      const url = new URL(LOGIN_PATH, request.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }

    const session = await verifySession(token);

    if (!session) {
      const url = new URL(LOGIN_PATH, request.url);
      url.searchParams.set("next", pathname);
      const response = NextResponse.redirect(url);
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
