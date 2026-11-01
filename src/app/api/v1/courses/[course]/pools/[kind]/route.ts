import type { NextRequest } from "next/server";
import { CourseParams, PoolQuery } from "@/api/contracts";
import { ApiError, courseOr404, parse, queryOf, respond, route } from "@/server/api/http";
import { pool } from "@/server/courses/service";

/** GET /api/v1/courses/:course/pools/exam|timed?mode=&level=: a freshly drawn deck. Not cached. */
export const GET = route(async (req: NextRequest, ctx: RouteContext<"/api/v1/courses/[course]/pools/[kind]">) => {
  const params = await ctx.params;
  const c = courseOr404(parse(CourseParams, params, "path").course);
  if (params.kind !== "exam" && params.kind !== "timed") throw new ApiError("not_found", `No pool "${params.kind}"`);
  const q = parse(PoolQuery, queryOf(req), "query");
  return respond(req, pool(c, params.kind, q.mode, q.level), { kind: "private" });
});
