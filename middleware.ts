import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isAuth = !!req.auth;
  const isAuthRoute = nextUrl.pathname.startsWith("/auth") || nextUrl.pathname.startsWith("/api/auth");

  if (!isAuth && !isAuthRoute) {
    const redirectUrl = new URL("/auth", nextUrl);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|favicon.ico|images|api/health).*)"],
};
