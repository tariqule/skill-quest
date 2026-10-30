import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import { levelUpStatus } from "./levelup";
import { splitLessons } from "./levels";
import { buildPath } from "./path";
import { INITIAL_PROGRESS, type Progress } from "./store";

const sample = (id: string) => COURSES.find((c) => c.id === id)!;

describe.each(["code-html-css", "aws-clf-c02"].map((id) => [id, sample(id)] as const))("%s beginner path", (_, course) => {
  const basics = course.domains.flatMap((d) => splitLessons(course.lessons[d.id] ?? []).basics);
  const beginnerQs = course.questions.filter((q) => q.level === "beginner");
  const at = (patch: Partial<Progress>): Progress => ({ ...INITIAL_PROGRESS, ...patch });

  it("only reports on the Beginner level", () => {
    expect(levelUpStatus(course, at({ level: "junior" }))).toBeNull();
    expect(levelUpStatus(course, at({ level: "beginner" }))?.ready).toBe(false);
  });

  it("is ready once every basics lesson is done and 80% of beginner questions are right", () => {
    const right = (n: number) => Object.fromEntries(beginnerQs.slice(0, n).map((q) => [q.id, { seen: 1, correct: 1, lastCorrect: true }]));
    const almost = at({ level: "beginner", lessonsDone: basics.map((l) => l.id), questions: right(Math.ceil(beginnerQs.length * 0.8) - 1) });
    const done = at({ level: "beginner", lessonsDone: basics.map((l) => l.id), questions: right(beginnerQs.length) });
    expect(levelUpStatus(course, almost)?.ready).toBe(false);
    const s = levelUpStatus(course, done);
    expect(s?.ready).toBe(true);
    expect(s?.next).toBe(course.kind ? "junior" : "exam");
  });

  it("puts the basics on the path for beginners and makes them optional otherwise", () => {
    const beginner = buildPath(course, at({ level: "beginner" }));
    const first = beginner.worlds[0].nodes[0];
    expect(first.basics).toBe(true);
    expect(beginner.current?.basics).toBe(true);
    expect(beginner.worlds[0].nodes.some((n) => n.state === "later")).toBe(true);

    const exam = buildPath(course, at({ level: course.kind ? "junior" : "exam" }));
    expect(exam.current?.basics).toBeFalsy();
    expect(exam.worlds[0].nodes.filter((n) => n.basics).every((n) => n.optional)).toBe(true);
  });
});
