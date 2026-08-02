import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  applySetCookies,
  clearAuthCookie,
  redirectToAuth,
  refreshAuthToken,
} from "@/lib/auth";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname.startsWith("/auth");
  const isPassthroughRoute =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/user") ||
    pathname.startsWith("/api");

  if (isPassthroughRoute) {
    return NextResponse.next();
  }

  if (!token) {
    if (isAuthRoute) {
      return NextResponse.next();
    }

    return redirectToAuth(request);
  }

  const refreshResult = await refreshAuthToken(token);

  if (!refreshResult.ok) {
    if (isAuthRoute) {
      const response = NextResponse.next();
      clearAuthCookie(response);
      return response;
    }

    return redirectToAuth(request);
  }

  if (isAuthRoute) {
    const response = NextResponse.redirect(new URL("/", request.url));
    applySetCookies(response, refreshResult.setCookies);
    return response;
  }

  const response = NextResponse.next();
  applySetCookies(response, refreshResult.setCookies);
  return response;
}

export const config = {
  matcher: [
    "/((?!auth|_next/static|_next/image|favicon.ico|user|api).*)",
    "/auth/:path*",
  ],
};
