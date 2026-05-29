import { NextResponse } from "next/server";

export function proxy(request) {
  const sessionid = request.cookies.get("sessionid")?.value;
  const { pathname } = request.nextUrl;

  const publicPaths = ["/", "/login", "/register"];
  const isPublic = publicPaths.some((p) => pathname === p);

  if (!sessionid && !isPublic && !pathname.startsWith("/api")) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (sessionid && pathname === "/login") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
