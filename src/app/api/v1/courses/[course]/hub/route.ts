import type { NextRequest } from "next/server";
import { CourseParams } from "@/api/contracts";
import { courseOr404, parse, respond, route } from "@/server/api/http";
import { derivedEtag } from "@/server/courses/repository";
import { hub } from "@/server/courses/service";

/** GET /api/v1/courses/:course/hub: map data (domains, lesson titles, exam format, modes). No question text. */
export const GET = route(async (req: NextRequest, ctx: RouteContext<"/api/v1/courses/[course]/hub">) => {
  const c = courseOr404(parse(CourseParams, await ctx.params, "path").course);
  return respond(req, hub(c), { kind: "content", etag: derivedEtag(c, "hub") });
});
