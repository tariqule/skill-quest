import type { NextRequest } from "next/server";
import { LessonParams } from "@/api/contracts";
import { courseOr404, parse, respond, route } from "@/server/api/http";
import { derivedEtag } from "@/server/courses/repository";
import { lesson } from "@/server/courses/service";

/** GET /api/v1/courses/:course/lessons/:lesson: the lesson text, its check questions, prev/next ids. */
export const GET = route(async (req: NextRequest, ctx: RouteContext<"/api/v1/courses/[course]/lessons/[lesson]">) => {
  const p = parse(LessonParams, await ctx.params, "path");
  const c = courseOr404(p.course);
  return respond(req, lesson(c, p.lesson), { kind: "content", etag: derivedEtag(c, "lesson", p.lesson) });
});
