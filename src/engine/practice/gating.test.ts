import { describe, expect, it } from "vitest";
import { PROMPTS, QUESTIONS, TOPICS, progress } from "./fixtures";
import { isUnlocked, lessonsFor, missingPrereqs, topicsDone, unlockedPrompts, unlockedQuestions, unlocksFor } from "./gating";

const byId = new Map(TOPICS.map((t) => [t.id, t]));

describe("gating", () => {
  it("counts a topic's own lesson and its stand-ins", () => {
    expect(lessonsFor(TOPICS[1])).toEqual(["b", "old-b"]);
  });

  it("orders done topics by when their first counting lesson finished", () => {
    expect(topicsDone(TOPICS, progress(["old-b", "x", "a", "b"]))).toEqual(["b", "a"]);
    expect(topicsDone(TOPICS, progress([]))).toEqual([]);
  });

  it("never unlocks untagged content", () => {
    expect(isUnlocked(undefined, new Set(["a"]))).toBe(false);
    expect(isUnlocked([], new Set(["a"]))).toBe(false);
  });

  it("needs every concept done", () => {
    const done = new Set(["a"]);
    expect(unlockedQuestions(QUESTIONS, done).map((q) => q.id)).toEqual(["qa"]);
    expect(unlockedPrompts(PROMPTS, done)).toEqual([]);
    expect(unlockedPrompts(PROMPTS, new Set(["a", "b"]))).toHaveLength(1);
  });

  it("reports only what a topic would newly unlock", () => {
    expect(unlocksFor(QUESTIONS, PROMPTS, new Set(["a"]), "b")).toEqual({ questions: 2, prompts: 1 });
    expect(unlocksFor(QUESTIONS, PROMPTS, new Set(["a", "b"]), "b")).toEqual({ questions: 0, prompts: 0 });
  });

  it("blocks on ready prerequisites but never on planned ones", () => {
    expect(missingPrereqs(byId.get("c")!, byId, new Set(["a"])).map((t) => t.id)).toEqual(["b"]);
    expect(missingPrereqs(byId.get("e")!, byId, new Set())).toEqual([]);
    expect(missingPrereqs({ ...TOPICS[0], prereqs: ["nope"] }, byId, new Set())).toEqual([]);
  });
});
