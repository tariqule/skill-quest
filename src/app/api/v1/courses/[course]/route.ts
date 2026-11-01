import type { NextRequest } from "next/server";
import { CourseParams } from "@/api/contracts";
import { courseOr404, parse, respond, route } from "@/server/api/http";
import { courseEtag, summarize } from "@/server/courses/repository";

/** GET /api/v1/courses/:course: one course summary. */
export const GET = route(async (req: NextRequest, ctx: RouteContext<"/api/v1/courses/[course]">) => {
  const c = courseOr404(parse(CourseParams, await ctx.params, "path").course);
  return respond(req, summarize(c), { kind: "content", etag: courseEtag(c) });
});
