import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import { qualityReport, teachBeforeTestWarnings, type ConceptList } from "./quality";
import { CONCEPTS as DS } from "@/courses/code-data-structures/concepts";
import type { Course } from "./types";

/**
 * Non-blocking quality report for every course. Counts are printed, not enforced:
 * AIF-C01 is held strictly in validate.test.ts and its own teach-before-test test.
 * Add a course's concept list here as it gets one (Phase 2), then make it strict.
 */
const CONCEPT_LISTS: Record<string, ConceptList> = { "code-data-structures": DS };

describe("quality report (warnings only)", () => {
  it("prints longest-option and teach-before-test counts per course", () => {
    const rows = qualityReport(COURSES, CONCEPT_LISTS);
    console.table(rows);
    expect(rows).toHaveLength(COURSES.length);
  });
});

describe("teachBeforeTestWarnings", () => {
  const course = {
    id: "probe",
    domains: [{ id: "d1" }],
    lessons: { d1: [{ id: "l1", title: "Caching", points: ["A cache keeps hot data close."], check: [] }, { id: "l2", title: "Queues", points: ["SQS decouples."], check: [] }] },
    questions: [
      { id: "q1", domain: "d1", lesson: "l1", prompt: "Where does SQS fit?", options: ["Decoupling", "x"], answer: [0], explanation: "" },
      { id: "q2", domain: "d1", lesson: "l2", prompt: "Why a cache?", options: ["Speed", "x"], answer: [0], explanation: "" },
      { id: "q3", domain: "d1", lesson: "nope", prompt: "?", options: ["a", "b"], answer: [0], explanation: "" },
    ],
  } as unknown as Course;
  const concepts: ConceptList = [["SQS", /\bSQS\b/], ["cache", /cache/i]];

  it("flags concepts tested before they are taught, and missing lessons", () => {
    expect(teachBeforeTestWarnings(course, concepts)).toEqual(["q1 (l1): SQS", "q3: no lesson"]);
  });
  it("only checks lesson links when a course has no concept list", () => {
    expect(teachBeforeTestWarnings(course)).toEqual(["q3: no lesson"]);
  });
});
