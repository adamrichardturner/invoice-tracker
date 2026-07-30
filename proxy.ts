import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("token")?.value;
  const { pathname } = request.nextUrl;

  if (token && pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  if (
    pathname.startsWith("/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/user") ||
    pathname.startsWith("/api")
  ) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/auth/demo", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!auth|_next/static|_next/image|favicon.ico|user|api).*)",
    "/auth/:path*",
  ],
};
