import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import { qualityReport, teachBeforeTestWarnings, type ConceptList } from "./quality";
import { CONCEPTS as DS } from "@/courses/code-data-structures/concepts";
import { CONCEPTS as ALGO } from "@/courses/code-algorithms/concepts";
import { CONCEPTS as JS } from "@/courses/code-javascript/concepts";
import { CONCEPTS as REACT } from "@/courses/code-react/concepts";
import { CONCEPTS as SD } from "@/courses/code-system-design/concepts";
import { CONCEPTS as SQL } from "@/courses/code-sql/concepts";
import { CONCEPTS as NEXT } from "@/courses/code-nextjs/concepts";
import { CONCEPTS as TS } from "@/courses/code-typescript/concepts";
import { CONCEPTS as WEB } from "@/courses/code-html-css/concepts";
import { CONCEPTS as JAVA } from "@/courses/code-java/concepts";
import { CONCEPTS as PY } from "@/courses/code-python/concepts";
import { CONCEPTS as NODE } from "@/courses/code-nodejs/concepts";
import { CONCEPTS as GO } from "@/courses/code-go/concepts";
import { CONCEPTS as GIT } from "@/courses/code-git/concepts";
import { CONCEPTS as DOCKER } from "@/courses/code-docker/concepts";
import type { Course } from "./types";

/**
 * Non-blocking quality report for every course. Counts are printed, not enforced:
 * AIF-C01 is held strictly in validate.test.ts and its own teach-before-test test.
 * Add a course's concept list here as it gets one (Phase 2), then make it strict.
 */
const CONCEPT_LISTS: Record<string, ConceptList> = { "code-data-structures": DS, "code-algorithms": ALGO, "code-javascript": JS, "code-react": REACT, "code-system-design": SD, "code-sql": SQL, "code-nextjs": NEXT, "code-typescript": TS, "code-html-css": WEB, "code-java": JAVA, "code-python": PY, "code-nodejs": NODE, "code-go": GO, "code-git": GIT, "code-docker": DOCKER };

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
