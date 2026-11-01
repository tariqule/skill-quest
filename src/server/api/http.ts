import "server-only";
import { unstable_rethrow } from "next/navigation";
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { ERROR_STATUS, type ApiErrorBody, type ApiErrorCode } from "@/api/contracts";
import { contentVersion, findCourse } from "@/server/courses/repository";
import type { Course } from "@/engine/types";

/** Thrown inside a handler to answer with the shared error shape. */
export class ApiError extends Error {
  constructor(
    readonly code: ApiErrorCode,
    message: string,
    readonly issues?: { path: string; message: string }[],
  ) {
    super(message);
  }
}

export function errorResponse(code: ApiErrorCode, message: string, issues?: { path: string; message: string }[]) {
  const body: ApiErrorBody = { error: { code, message, ...(issues ? { issues } : {}) } };
  return NextResponse.json(body, { status: ERROR_STATUS[code], headers: { "Cache-Control": "no-store" } });
}

export function parse<T extends z.ZodType>(schema: T, input: unknown, where: string): z.infer<T> {
  const r = schema.safeParse(input);
  if (!r.success) throw new ApiError("bad_request", `Invalid ${where}`, r.error.issues.map((i) => ({ path: i.path.join(".") || where, message: i.message })));
  return r.data;
}

export function queryOf(req: NextRequest) {
  return Object.fromEntries(req.nextUrl.searchParams);
}

export function courseOr404(id: string): Course {
  const c = findCourse(id);
  if (!c) throw new ApiError("not_found", `No course "${id}"`);
  return c;
}

/**
 * Caching policy.
 * - "content": static course data. ETag plus Cache-Control. A request carrying the current content
 *   version (`?v=`, which the app always sends) is immutable for a year; anything else may be
 *   reused for 5 minutes and served stale for a day while revalidating.
 * - "private": computed per request (random pools, grading). Never stored.
 */
export type CachePolicy = { kind: "content"; etag: string } | { kind: "private" };

const IMMUTABLE = "public, max-age=31536000, immutable";
const SHORT = "public, max-age=300, stale-while-revalidate=86400";

export function respond(req: NextRequest, data: unknown, cache: CachePolicy) {
  if (cache.kind === "private") return NextResponse.json({ data }, { headers: { "Cache-Control": "no-store" } });
  const cc = req.nextUrl.searchParams.get("v") === contentVersion() ? IMMUTABLE : SHORT;
  const headers = { ETag: cache.etag, "Cache-Control": cc, Vary: "Accept-Encoding" };
  const inm = req.headers.get("if-none-match");
  if (inm && inm.split(",").some((t) => t.trim().replace(/^W\//, "") === cache.etag)) return new NextResponse(null, { status: 304, headers });
  return NextResponse.json({ data }, { headers });
}

type Handler<C> = (req: NextRequest, ctx: C) => Promise<Response> | Response;

/** Wraps a route handler: maps ApiError and unexpected failures to the shared error shape. */
export function route<C>(fn: Handler<C>): Handler<C> {
  return async (req, ctx) => {
    try {
      return await fn(req, ctx);
    } catch (e) {
      // Next's own control flow (dynamic bailout during prerender, notFound) must pass through.
      unstable_rethrow(e);
      if (e instanceof ApiError) return errorResponse(e.code, e.message, e.issues);
      console.error("[api]", req.nextUrl.pathname, e);
      return errorResponse("internal", "Something went wrong");
    }
  };
}
