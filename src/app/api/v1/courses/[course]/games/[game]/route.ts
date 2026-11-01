import type { NextRequest } from "next/server";
import { GameParams } from "@/api/contracts";
import { courseOr404, parse, respond, route } from "@/server/api/http";
import { derivedEtag } from "@/server/courses/repository";
import { gameQuestions } from "@/server/courses/service";

/** GET /api/v1/courses/:course/games/:game: the question pool for one code game. */
export const GET = route(async (req: NextRequest, ctx: RouteContext<"/api/v1/courses/[course]/games/[game]">) => {
  const p = parse(GameParams, await ctx.params, "path");
  const c = courseOr404(p.course);
  return respond(req, gameQuestions(c, p.game), { kind: "content", etag: derivedEtag(c, "game", p.game) });
});
