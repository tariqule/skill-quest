import type { NextRequest } from "next/server";
import { CourseParams } from "@/api/contracts";
import { courseOr404, parse, respond, route } from "@/server/api/http";
import { derivedEtag } from "@/server/courses/repository";
import { cheatsheet } from "@/server/courses/service";

/** GET /api/v1/courses/:course/cheatsheet */
export const GET = route(async (req: NextRequest, ctx: RouteContext<"/api/v1/courses/[course]/cheatsheet">) => {
  const c = courseOr404(parse(CourseParams, await ctx.params, "path").course);
  return respond(req, cheatsheet(c), { kind: "content", etag: derivedEtag(c, "cheatsheet") });
});
