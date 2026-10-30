import { NextResponse, type NextRequest } from "next/server";
import { COURSE_IDS } from "@/courses/ids";

const KNOWN = new Set<string>(COURSE_IDS);

/** True for /c/<id>/… when <id> isn't a registered course. */
export function isUnknownCoursePath(pathname: string): boolean {
  const m = /^\/c\/([^/]+)/.exec(pathname);
  return !!m && !KNOWN.has(decodeURIComponent(m[1]));
}

/**
 * Unknown courses get a real 404 from the server. The course layout is static and its client
 * shell can only call notFound() after the 200 has already been sent.
 */
export function proxy(request: NextRequest) {
  if (isUnknownCoursePath(request.nextUrl.pathname)) {
    return NextResponse.rewrite(new URL("/_unknown-course", request.url), { status: 404 });
  }
  return NextResponse.next();
}

export const config = { matcher: "/c/:path*" };
