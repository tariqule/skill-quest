import type { NextRequest } from "next/server";
import { ScenarioParams } from "@/api/contracts";
import { courseOr404, parse, respond, route } from "@/server/api/http";
import { derivedEtag } from "@/server/courses/repository";
import { scenarioItems } from "@/server/courses/service";

/** GET /api/v1/courses/:course/scenarios/:game: the items for one scenario game. */
export const GET = route(async (req: NextRequest, ctx: RouteContext<"/api/v1/courses/[course]/scenarios/[game]">) => {
  const p = parse(ScenarioParams, await ctx.params, "path");
  const c = courseOr404(p.course);
  return respond(req, scenarioItems(c, p.game), { kind: "content", etag: derivedEtag(c, "scenarios", p.game) });
});
