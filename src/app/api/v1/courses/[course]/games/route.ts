import type { NextRequest } from "next/server";
import { CourseParams } from "@/api/contracts";
import { courseOr404, parse, respond, route } from "@/server/api/http";
import { derivedEtag } from "@/server/courses/repository";
import { games } from "@/server/courses/service";

/** GET /api/v1/courses/:course/games: code games this course has, with question counts. */
export const GET = route(async (req: NextRequest, ctx: RouteContext<"/api/v1/courses/[course]/games">) => {
  const c = courseOr404(parse(CourseParams, await ctx.params, "path").course);
  return respond(req, games(c), { kind: "content", etag: derivedEtag(c, "games") });
});
