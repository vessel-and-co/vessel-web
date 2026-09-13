import { NextResponse, type NextRequest } from "next/server";

import {
  STAGING_SESSION_COOKIE,
  isValidSessionToken,
} from "@/lib/staging-auth";

const LOGIN_PATH = "/login";

export function proxy(request: NextRequest) {
  const sessionToken = request.cookies.get(STAGING_SESSION_COOKIE)?.value;

  if (isValidSessionToken(sessionToken)) {
    return NextResponse.next();
  }

  const loginUrl = new URL(LOGIN_PATH, request.url);
  loginUrl.searchParams.set("next", request.nextUrl.pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: [
    "/((?!login|_next/static|_next/image|favicon.ico|apple-icon.png|icon.svg).*)",
  ],
};
