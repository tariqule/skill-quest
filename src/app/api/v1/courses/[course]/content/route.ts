import type { NextRequest } from "next/server";
import { CourseParams } from "@/api/contracts";
import { courseOr404, parse, respond, route } from "@/server/api/http";
import { courseEtag, toJson, wireCourse } from "@/server/courses/repository";

/**
 * GET /api/v1/courses/:course/content: the whole course as data (visuals and labs are null), for
 * client engines that work across courses: the home plan, Daily Review and Warm-up.
 */
export const GET = route(async (req: NextRequest, ctx: RouteContext<"/api/v1/courses/[course]/content">) => {
  const c = courseOr404(parse(CourseParams, await ctx.params, "path").course);
  return respond(req, toJson(wireCourse(c)), { kind: "content", etag: courseEtag(c) });
});
