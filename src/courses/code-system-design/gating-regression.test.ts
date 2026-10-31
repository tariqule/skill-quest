import { describe, expect, it } from "vitest";
import { taughtPool } from "@/engine/game";
import { buildPracticeDeck, courseMap, finishedTopicPool, lessonsFor, nextMapLesson, practiceSummary } from "@/engine/practice";
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
});
