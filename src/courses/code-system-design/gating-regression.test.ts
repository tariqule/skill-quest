import { describe, expect, it } from "vitest";
import { taughtPool } from "@/engine/game";
import { buildPracticeDeck, courseMap, finishedTopicPool, lessonsFor, studySessionPool, nextMapLesson, practiceSummary } from "@/engine/practice";
import { INITIAL_PROGRESS, type Progress } from "@/engine/store";
import course from ".";

/**
 * PR 3 browser test: after finishing only M4/M5 lessons, coverage jumped and trials served
 * Module 1 questions. Coverage and practice must count only lessons actually finished.
 */
const topics = course.topics ?? [];
const lessonIds = new Set(Object.values(course.lessons).flat().map((l) => l.id));
const at = (lessonsDone: string[]): Progress => ({ ...INITIAL_PROGRESS, lessonsDone });
const only = at(["t-replication"]);

describe("code-system-design gating regression", () => {
  it("credits nothing on a fresh profile", () => {
    expect(courseMap(topics, lessonIds, at([])).done).toBe(0);
    expect(practiceSummary(course, at([])).available).toBe(0);
  });

  it("finishing t-replication alone covers exactly one topic", () => {
    const s = practiceSummary(course, only);
    expect(s.done.map((t) => t.id)).toEqual(["t-replication"]);
    expect(s.covered.map((t) => t.id)).toEqual(["t-replication"]);
    expect(courseMap(topics, lessonIds, only).done).toBe(1);
  });

  it("practice decks only hold questions tagged t-replication alone", () => {
    for (let seed = 0; seed < 20; seed++) {
      let x = seed + 1;
      const rand = () => ((x = (x * 16807) % 2147483647) / 2147483647);
      const deck = buildPracticeDeck(course, only, 10, rand);
      expect(deck.length).toBeGreaterThan(0);
      for (const q of deck) expect(q.concepts, q.id).toEqual(["t-replication"]);
    }
  });

  it("trials in a world with nothing finished serve nothing, not the whole world", () => {
    for (const d of course.domains) {
      const pool = course.questions.filter((q) => q.domain === d.id);
      const served = finishedTopicPool(course, pool, only, (all) => taughtPool(all, only.lessonsDone));
      for (const q of served) expect(q.concepts, q.id).toEqual(["t-replication"]);
      if (d.id === "d1") expect(served).toEqual([]);
    }
  });

  it("Continue after a lesson follows the map, never into a stand-in lesson", () => {
    for (const done of [["t-replication"], ["t-replication", "t-consistency", "t-chash"], []]) {
      const current = courseMap(topics, lessonIds, at(done)).current!;
      const next = nextMapLesson(topics, lessonIds, at(done));
      // A written topic opens its own lesson; a stand-in only serves a topic not yet written.
      expect(next).toBe(lessonIds.has(current.topic.id) ? current.topic.id : lessonsFor(current.topic).find((l) => lessonIds.has(l)));
      expect(next).toBe("t-intro");
    }
  });

  it("study sessions serve only studied topics, never the rest of the world", () => {
    const d2 = course.questions.filter((q) => q.domain === "d2");
    const legacy = (all: typeof d2) => taughtPool(all, []);
    // Nothing finished or read: empty, not the whole world.
    expect(studySessionPool(course, d2, at([]), [], legacy)).toEqual([]);
    // Reading t-replication in the session unlocks only questions tagged t-replication alone.
    const read = studySessionPool(course, d2, at([]), ["t-replication"], legacy);
    expect(read.length).toBeGreaterThan(0);
    expect(new Set(read.flatMap((q) => q.concepts ?? []))).toEqual(new Set(["t-replication"]));
    // A finished topic plus a session read combine; unstudied d2 topics stay out.
    const both = studySessionPool(course, d2, at(["t-sharding"]), ["t-replication"], legacy);
    expect(both.every((q) => q.concepts!.every((c) => c === "t-replication" || c === "t-sharding"))).toBe(true);
    expect(both.length).toBeLessThan(d2.length);
  });

  it("PR 4 browser test: kafka-1, kafka-2 and api-2 finished count as 3 and serve only their own tags", () => {
    const three = ["t-kafka-1", "t-kafka-2", "t-api-2"];
    const p = at(three);
    expect(courseMap(topics, lessonIds, p).done).toBe(3);
    const summary = practiceSummary(course, p);
    expect(summary.covered.map((t) => t.id).sort()).toEqual([...three].sort());
    const allowed = new Set(three);
    const onlyThree = (qs: { concepts?: readonly string[] }[]) => qs.every((q) => q.concepts!.every((c) => allowed.has(c)));
    for (let i = 0; i < 20; i++) expect(onlyThree(buildPracticeDeck(course, p, 20))).toBe(true);
    expect(onlyThree(finishedTopicPool(course, course.questions, p, (all) => all))).toBe(true);
    // Replication, CAP and Sharding stay closed; Kafka delivery (6-4) is the only newly open tile.
    const states = new Map(courseMap(topics, lessonIds, p).modules.flatMap((m) => m.topics).map((n) => [n.topic.id, n.state]));
    expect(states.get("t-replication")).not.toBe("done");
    expect(states.get("t-cap")).toBe("locked");
    expect(states.get("t-kafka-3")).toBe("open");
  });
});
