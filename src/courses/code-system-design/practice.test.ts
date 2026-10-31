import { describe, expect, it } from "vitest";
import { buildPracticeDeck, practicePool, practiceSummary, topicsDone } from "@/engine/practice";
import { INITIAL_PROGRESS, type Progress } from "@/engine/store";
import { longestOptionWarnings, topicProblems } from "@/engine/validate";
import { TOPIC_CONTENT } from "../system-design/registry";
import course from ".";
import { CODE_QUEST_LINKS } from "./prompts";
import { LESSON_MIGRATION } from "./topics";

const lessons = Object.values(course.lessons).flat();
const topics = course.topics ?? [];
const at = (lessonsDone: string[]): Progress => ({ ...INITIAL_PROGRESS, lessonsDone });

/** Lessons in the order the beginner path teaches them. */
const pathOrder = course.domains.flatMap((d) => course.lessons[d.id] ?? []).map((l) => l.id);

describe("code-system-design topic practice", () => {
  it("has 48 topics, valid tags, prerequisites and stand-ins", () => {
    expect(topics).toHaveLength(48);
    expect(topicProblems(course)).toEqual([]);
  });

  it("marks every written topic and every topic with a stand-in ready", () => {
    const ready = topics.filter((t) => t.status === "ready").map((t) => t.id);
    for (const t of TOPIC_CONTENT) expect(ready).toContain(t.id);
    expect(ready.length).toBeGreaterThan(TOPIC_CONTENT.length);
  });

  it("tags every question, old and new", () => {
    expect(course.questions.filter((q) => !q.concepts?.length).map((q) => q.id)).toEqual([]);
    expect(practicePool(course).length).toBe(course.questions.length + (course.practice?.length ?? 0));
  });

  it("shows no question before all its concepts are done, at every step of the path", () => {
    for (let i = 0; i <= pathOrder.length; i++) {
      const p = at(pathOrder.slice(0, i));
      const done = new Set(topicsDone(topics, p));
      const deck = buildPracticeDeck(course, p, 1000, () => 0.5);
      for (const q of deck) expect(q.concepts?.filter((c) => !done.has(c)), q.id).toEqual([]);
    }
  });

  it("opens only M1 questions after the six M1 lessons", () => {
    const m1 = TOPIC_CONTENT.filter((t) => t.module === "m1").map((t) => t.id);
    const s = practiceSummary(course, at(m1));
    expect(s.done.map((t) => t.id)).toEqual(m1);
    const deck = buildPracticeDeck(course, at(m1), 1000, () => 0.5);
    expect(deck.length).toBe(s.available);
    for (const q of deck) expect(q.concepts?.every((c) => m1.includes(c))).toBe(true);
    expect(deck.some((q) => q.id.startsWith("t-estimation-p"))).toBe(true);
  });

  it("starts empty and points at lesson 1", () => {
    const s = practiceSummary(course, at([]));
    expect(s.available).toBe(0);
    expect(s.next?.topic.id).toBe("t-intro");
    expect(pathOrder[0]).toBe("t-intro");
  });

  it("migrates the replaced start lessons once, keeping order", () => {
    for (const [from, to] of Object.entries(LESSON_MIGRATION.aliases)) {
      expect(lessons.some((l) => l.id === from)).toBe(false);
      expect(lessons.some((l) => l.id === to)).toBe(true);
    }
  });

  it("links Code Quests lessons that exist", async () => {
    const { COURSES } = await import("@/courses");
    for (const link of CODE_QUEST_LINKS) {
      const [, , courseId, , lessonId] = link.href.split("/");
      const target = COURSES.find((c) => c.id === courseId);
      expect(target, link.href).toBeDefined();
      expect(Object.values(target?.lessons ?? {}).flat().some((l) => l.id === lessonId), link.href).toBe(true);
    }
  });

  it("keeps true/false out of the longest-option lint but checks every other question", () => {
    expect(longestOptionWarnings(course)).toEqual([]);
    expect(course.questions.some((q) => q.type !== "order" && "tf" in q && q.tf)).toBe(true);
  });
});

describe("topicProblems error paths", () => {
  const problems = (patch: Partial<typeof course>) => topicProblems({ ...course, ...patch }).join("\n");
  const [first, second] = topics;

  it("rejects a bad migration", () => {
    expect(problems({ lessonMigration: { version: 0, aliases: {} } })).toMatch(/version must be a whole number/);
    expect(problems({ lessonMigration: { version: 1, aliases: { gone: "nowhere" } } })).toMatch(/unknown lesson "nowhere"/);
    expect(problems({ lessonMigration: { version: 1, aliases: { "t-intro": "t-network" } } })).toMatch(/still a live lesson/);
  });

  it("rejects duplicate topics, late prerequisites and fake stand-ins", () => {
    expect(problems({ topics: [first, first] })).toMatch(/listed twice/);
    expect(problems({ topics: [{ ...first, prereqs: [second.id] }, second] })).toMatch(/isn't an earlier topic/);
    expect(problems({ topics: [{ ...first, standIns: ["nope"] }] })).toMatch(/stand-in "nope" isn't a lesson/);
  });

  it("checks status against lessons", () => {
    expect(problems({ topics: [{ ...first, id: "t-unwritten", status: "ready", standIns: undefined }] })).toMatch(/ready but no lesson/);
    expect(problems({ topics: [{ ...first, status: "planned" }] })).toMatch(/mark it ready/);
  });

  it("rejects untagged or mistagged content and relative links", () => {
    const q = course.questions[0];
    expect(problems({ questions: [{ ...q, concepts: undefined }] })).toMatch(/no concept tags/);
    expect(problems({ questions: [{ ...q, concepts: ["t-nope"] }] })).toMatch(/unknown topic "t-nope"/);
    const d = CODE_QUEST_LINKS[0];
    expect(problems({ designPrompts: [{ ...d, href: "c/x" }] })).toMatch(/must start with "\/"/);
    expect(problems({ designPrompts: [{ ...d, concepts: [] }] })).toMatch(/no concept tags/);
  });

  it("flags practice content without topics", () => {
    expect(problems({ topics: undefined })).toMatch(/practice content but no topics/);
  });
});

describe("revisit the concept", () => {
  it("points every served question at a lesson of one of its tagged topics", async () => {
    const { indexCourse, revisitLesson } = await import("@/engine/indexes");
    const idx = indexCourse(course);
    const bad: string[] = [];
    for (const q of practicePool(course)) {
      const target = idx.lessonForQuestion[q.id] ?? revisitLesson(q, idx.lesson, topics);
      const allowed = new Set((q.concepts ?? []).flatMap((c) => [c, ...(topics.find((t) => t.id === c)?.standIns ?? [])]));
      if (!target || !allowed.has(target.id)) bad.push(`${q.id} -> ${target?.id ?? "none"} (tags ${q.concepts?.join(",")})`);
    }
    expect(bad).toEqual([]);
  });

  it("sends the retagged Kafka items d3-04 and d3-05 to the Kafka lessons", async () => {
    const { indexCourse } = await import("@/engine/indexes");
    const idx = indexCourse(course);
    for (const id of ["d3-04", "d3-05"]) expect(idx.lessonForQuestion[id]?.id).toMatch(/^t-kafka-/);
  });
});
