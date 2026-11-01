import type { NextRequest } from "next/server";
import { CourseParams } from "@/api/contracts";
import { courseOr404, parse, respond, route } from "@/server/api/http";
import { derivedEtag } from "@/server/courses/repository";
import { scenarios } from "@/server/courses/service";

/** GET /api/v1/courses/:course/scenarios: scenario games this course has, with counts. */
export const GET = route(async (req: NextRequest, ctx: RouteContext<"/api/v1/courses/[course]/scenarios">) => {
  const c = courseOr404(parse(CourseParams, await ctx.params, "path").course);
  return respond(req, scenarios(c), { kind: "content", etag: derivedEtag(c, "scenarios") });
});
