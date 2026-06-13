// middleware.js  (sits next to your /app or /pages folder)
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/", "/login"];
const ROLE_PROTECTED = {"/(private)/configuracoes/": ["admin"]}

export function proxy(request) {
  const { pathname } = request.nextUrl;

  // Allow public routes through
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  // Check for auth token in cookies
  const token = request.cookies.get("authToken")?.value;
  const role = request.cookies.get("userRole")?.value;

  if (!token) {
    const loginUrl = new URL("/login", request.url);
    // Preserve the intended destination so you can redirect back after login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const matchedRoute = Object.keys(ROLE_PROTECTED).find((route) =>
    pathname.startsWith(route)
  );
  if (matchedRoute && !ROLE_PROTECTED[matchedRoute].includes(role)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Apply middleware to all routes except Next.js internals and static files
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)"],
};