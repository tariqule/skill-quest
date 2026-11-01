import type { NextRequest } from "next/server";
import { CourseParams, PracticeQuery } from "@/api/contracts";
import { courseOr404, parse, queryOf, respond, route } from "@/server/api/http";
import { derivedEtag } from "@/server/courses/repository";
import { practice } from "@/server/courses/service";

/** GET /api/v1/courses/:course/practice?done=<lesson ids>&size=: only questions unlocked by the finished lessons. */
export const GET = route(async (req: NextRequest, ctx: RouteContext<"/api/v1/courses/[course]/practice">) => {
  const c = courseOr404(parse(CourseParams, await ctx.params, "path").course);
  const q = parse(PracticeQuery, queryOf(req), "query");
  const done = [...new Set(q.done)].sort();
  return respond(req, practice(c, done, q.size), { kind: "content", etag: derivedEtag(c, "practice", done.join(","), String(q.size ?? "")) });
});
