import type { NextRequest } from "next/server";
import { CourseParams, GradeBody } from "@/api/contracts";
import { ApiError, courseOr404, parse, respond, route } from "@/server/api/http";
import { grade } from "@/server/courses/service";

/** POST /api/v1/courses/:course/grade { answers: [{ id, picked }] }: picked indexes are in authored order. */
export const POST = route(async (req: NextRequest, ctx: RouteContext<"/api/v1/courses/[course]/grade">) => {
  const c = courseOr404(parse(CourseParams, await ctx.params, "path").course);
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    throw new ApiError("bad_request", "Body must be JSON");
  }
  return respond(req, grade(c, parse(GradeBody, body, "body")), { kind: "private" });
});
