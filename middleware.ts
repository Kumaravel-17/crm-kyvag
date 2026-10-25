import { NextResponse, type NextRequest } from "next/server";

// Must match SESSION_COOKIE in the backend's src/auth/sessions.ts
const SESSION_COOKIE = "kyvag_session";
const PUBLIC_PATHS = ["/login", "/forgot-password", "/reset-password"];

/**
 * Sends visitors without a session cookie to the sign-in page before any app page renders.
 * Only checks that the cookie exists; the backend decides if it's still valid, and AuthProvider handles the case where it isn't.
 */
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;
  if (PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return NextResponse.next();
  if (req.cookies.has(SESSION_COOKIE)) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = pathname === "/" ? "" : `?next=${encodeURIComponent(pathname + search)}`;
  return NextResponse.redirect(url);
}

export const config = {
  // Skip the API proxy, Next.js internals and files with an extension (icons, images)
  matcher: ["/((?!api|_next/static|_next/image|.*\\..*).*)"],
};
