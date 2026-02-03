import { auth } from "@/auth";
import { NextAuthRequest } from "next-auth";
import { NextResponse } from "next/server";

// we can export a named function proxy or a default function
// below, auth is a function from next-auth, we are just passing a callback function that can be used to write any custom logic
// now, this req is not just next request, it is a request object from next-auth
export default auth((req: NextAuthRequest) => {
  const isLoggedIn = !!req?.auth?.user;
  const isOnLoginPage = req.nextUrl.pathname.startsWith("/login");
  const isProtectedRoute =
    req.nextUrl.pathname === "/" || req.nextUrl.pathname.startsWith("/notes");

  if (isLoggedIn && isOnLoginPage) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
