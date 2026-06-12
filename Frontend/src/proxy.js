// middleware.js  (sits next to your /app or /pages folder)
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/login"];

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Allow public routes through
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for auth token in cookies
  const token = request.cookies.get("authToken")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the intended destination so you can redirect back after login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except Next.js internals and static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};