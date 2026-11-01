import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import type { z } from "zod";
import {
  ApiErrorBody,
  CatalogSchema,
  CheatsheetSchema,
  CourseContentSchema,
  CourseSummarySchema,
  GamePoolSchema,
  GamesSchema,
  GradeSchema,
  HubSchema,
  ItemsSchema,
  LessonSchema,
  PoolSchema,
  PracticeSchema,
  ScenarioPoolSchema,
  ScenariosSchema,
} from "@/api/contracts";
import { contentVersion, findCourse } from "@/server/courses/repository";
import { indexCourse } from "@/engine/indexes";
import * as catalogRoute from "@/app/api/v1/courses/route";
import * as summaryRoute from "@/app/api/v1/courses/[course]/route";
import * as contentRoute from "@/app/api/v1/courses/[course]/content/route";
import * as hubRoute from "@/app/api/v1/courses/[course]/hub/route";
import * as lessonRoute from "@/app/api/v1/courses/[course]/lessons/[lesson]/route";
import * as practiceRoute from "@/app/api/v1/courses/[course]/practice/route";
import * as cheatsheetRoute from "@/app/api/v1/courses/[course]/cheatsheet/route";
import * as gamesRoute from "@/app/api/v1/courses/[course]/games/route";
import * as gameRoute from "@/app/api/v1/courses/[course]/games/[game]/route";
import * as scenariosRoute from "@/app/api/v1/courses/[course]/scenarios/route";
import * as scenarioRoute from "@/app/api/v1/courses/[course]/scenarios/[game]/route";
import * as poolRoute from "@/app/api/v1/courses/[course]/pools/[kind]/route";
import * as gradeRoute from "@/app/api/v1/courses/[course]/grade/route";
import * as itemsRoute from "@/app/api/v1/items/route";
import * as restRoute from "@/app/api/v1/[...rest]/route";

const AWS = "aws-saa-c03";
const aws = findCourse(AWS)!;
const lessonIds = indexCourse(aws).allLessons.map((l) => l.id);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyHandler = (req: NextRequest, ctx: any) => Promise<Response> | Response;
async function call(h: AnyHandler, path: string, params: Record<string, unknown> = {}, init?: { method?: string; body?: string; headers?: Record<string, string> }) {
  const req = new NextRequest(new URL(path, "http://test"), init);
  return h(req, { params: Promise.resolve(params) });
}
async function ok<T extends z.ZodType>(res: Response, schema: T) {
  expect(res.status).toBe(200);
  const body = await res.json();
  return schema.parse(body.data) as z.infer<T>;
}
async function err(res: Response, status: number) {
  expect(res.status).toBe(status);
  expect(res.headers.get("cache-control")).toBe("no-store");
  return ApiErrorBody.parse(await res.json());
}

describe("/api/v1 contracts", () => {
  it("catalog lists every live course with a summary that matches the schema", async () => {
    const data = await ok(await call(catalogRoute.GET, "/api/v1/courses"), CatalogSchema);
    expect(data.some((e) => e.status === "live" && e.course.id === AWS)).toBe(true);
  });

  it("each content endpoint returns its schema", async () => {
    const p = { course: AWS };
    await ok(await call(summaryRoute.GET, `/api/v1/courses/${AWS}`, p), CourseSummarySchema);
    await ok(await call(contentRoute.GET, `/api/v1/courses/${AWS}/content`, p), CourseContentSchema);
    await ok(await call(hubRoute.GET, `/api/v1/courses/${AWS}/hub`, p), HubSchema);
    const lesson = await ok(await call(lessonRoute.GET, "/x", { ...p, lesson: lessonIds[1] }), LessonSchema);
    expect(lesson.prev).toBe(lessonIds[0]);
    await ok(await call(cheatsheetRoute.GET, "/x", p), CheatsheetSchema);
    await ok(await call(scenariosRoute.GET, "/x", p), ScenariosSchema);
    await ok(await call(gamesRoute.GET, "/x", { course: "code-react" }), GamesSchema);
  });

  it("game and scenario pools validate their game id", async () => {
    await ok(await call(gameRoute.GET, "/x", { course: "code-react", game: "bug" }), GamePoolSchema);
    await err(await call(gameRoute.GET, "/x", { course: "code-react", game: "nope" }), 400);
    const sc = await ok(await call(scenariosRoute.GET, "/x", { course: AWS }), ScenariosSchema);
    if (sc[0]) await ok(await call(scenarioRoute.GET, "/x", { course: AWS, game: sc[0].id }), ScenarioPoolSchema);
  });

  it("unknown course, lesson, pool kind and path are 404 with the error shape", async () => {
    expect((await err(await call(hubRoute.GET, "/x", { course: "no-such-course" }), 404)).error.code).toBe("not_found");
    await err(await call(lessonRoute.GET, "/x", { course: AWS, lesson: "nope" }), 404);
    await err(await call(poolRoute.GET, "/x", { course: AWS, kind: "nope" }), 404);
    for (const m of ["GET", "POST", "PUT", "DELETE"] as const) {
      const h = (restRoute as Record<string, AnyHandler>)[m];
      expect(h, m).toBeTypeOf("function");
      await err(await call(h, "/api/v1/nowhere", { rest: ["nowhere"] }, { method: m }), 404);
    }
  });

  it("bad input is 400 with issues", async () => {
    const e = await err(await call(hubRoute.GET, "/x", { course: "Bad Slug!" }), 400);
    expect(e.error.issues?.length).toBeGreaterThan(0);
    await err(await call(practiceRoute.GET, "/x?size=0", { course: AWS }), 400);
    await err(await call(gradeRoute.POST, "/x", { course: AWS }, { method: "POST", body: "{not json" }), 400);
    await err(await call(gradeRoute.POST, "/x", { course: AWS }, { method: "POST", body: JSON.stringify({ answers: [] }) }), 400);
  });

  it("content responses carry an ETag, answer 304 on a match, and are immutable for the current version", async () => {
    const res = await call(hubRoute.GET, `/api/v1/courses/${AWS}/hub`, { course: AWS });
    const etag = res.headers.get("etag")!;
    expect(etag).toMatch(/^".+"$/);
    expect(res.headers.get("cache-control")).toContain("stale-while-revalidate");
    const again = await call(hubRoute.GET, `/api/v1/courses/${AWS}/hub`, { course: AWS }, { headers: { "if-none-match": `W/${etag}` } });
    expect(again.status).toBe(304);
    expect(await again.text()).toBe("");
    const pinned = await call(hubRoute.GET, `/api/v1/courses/${AWS}/hub?v=${contentVersion()}`, { course: AWS });
    expect(pinned.headers.get("cache-control")).toBe("public, max-age=31536000, immutable");
    const other = await call(hubRoute.GET, `/api/v1/courses/code-react/hub`, { course: "code-react" });
    expect(other.headers.get("etag")).not.toBe(etag);
  });

  it("pools and grading are never stored", async () => {
    const pool = await call(poolRoute.GET, "/x", { course: AWS, kind: "exam" });
    expect(pool.headers.get("cache-control")).toBe("no-store");
    const deck = await ok(pool, PoolSchema);
    expect(deck.questions.length).toBe(aws.exam.questions);
    await ok(await call(poolRoute.GET, "/x", { course: AWS, kind: "timed" }), PoolSchema);
  });
});

describe("gating", () => {
  it("practice unlocks more questions as lessons are done, and ignores unknown ids", async () => {
    // System design is the gated track: questions unlock as their concepts' lessons are done.
    const SD = "code-system-design";
    const sdLessons = indexCourse(findCourse(SD)!).allLessons.map((l) => l.id);
    const none = await ok(await call(practiceRoute.GET, "/x", { course: SD }), PracticeSchema);
    const done = sdLessons.join(",");
    const all = await ok(await call(practiceRoute.GET, `/x?done=${done},bogus`, { course: SD }), PracticeSchema);
    expect(all.unlocked).toBeGreaterThan(none.unlocked);
    expect(all.locked).toBeLessThan(none.locked);
    expect(all.topicsDone).not.toContain("bogus");
    expect(none.questions.length).toBe(none.unlocked);
    const sized = await ok(await call(practiceRoute.GET, `/x?done=${done}&size=5`, { course: SD }), PracticeSchema);
    expect(sized.questions.length).toBe(5);
  });
});

describe("grade", () => {
  it("scores answers server-side in authored order and reports unknown ids", async () => {
    const qs = aws.questions.flatMap((q) => ("answer" in q && Array.isArray(q.answer) ? [{ id: q.id, answer: q.answer as number[] }] : [])).slice(0, 4);
    const answers = qs.map((q, i) => ({ id: q.id, picked: i % 2 === 0 ? [...q.answer] : [-1] }));
    const g = await ok(await call(gradeRoute.POST, "/x", { course: AWS }, { method: "POST", body: JSON.stringify({ answers: [...answers, { id: "ghost", picked: [0] }] }) }), GradeSchema);
    expect(g.total).toBe(qs.length);
    expect(g.correct).toBe(Math.ceil(qs.length / 2));
    expect(g.unknown).toEqual(["ghost"]);
  });
});

describe("items", () => {
  it("resolves review keys across courses and lists the missing ones", async () => {
    const q = aws.questions[0];
    const data = await ok(await call(itemsRoute.GET, `/api/v1/items?keys=${AWS}:q:${q.id},${AWS}:q:nope`), ItemsSchema);
    expect(data.items.map((i) => i.item.id)).toContain(q.id);
    expect(data.missing.length).toBe(1);
  });
});
