import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { nextUrl } = req;
  const isAuth = !!req.auth;
  const isAuthRoute =
    nextUrl.pathname.startsWith("/auth") ||
    nextUrl.pathname.startsWith("/login") ||
    nextUrl.pathname.startsWith("/signup") ||
    nextUrl.pathname.startsWith("/verify-email") ||
    nextUrl.pathname.startsWith("/api/auth");
  const isAppRoute = nextUrl.pathname.startsWith("/app");
  const isChoosePlanRoute = nextUrl.pathname.startsWith("/choose-plan");

  if (!isAuth && (isAppRoute || isChoosePlanRoute) && !isAuthRoute) {
    const redirectUrl = new URL("/login", nextUrl);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next|favicon.ico|images|api/health).*)"],
};
