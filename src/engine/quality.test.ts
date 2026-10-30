import { isValidElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { COURSES } from "@/courses";
import { qualityReport, teachBeforeTestWarnings, type ConceptList } from "./quality";
import type { Course, Lesson } from "./types";
import { CONCEPTS as AIF } from "@/courses/aws-aif-c01/concepts";
import { CONCEPTS as CLF } from "@/courses/aws-clf-c02/concepts";
import { CONCEPTS as SAA } from "@/courses/aws-saa-c03/concepts";
import { CONCEPTS as DVA2 } from "@/courses/aws-dva-c02/concepts";
import { CONCEPTS as DVA3 } from "@/courses/aws-dva-c03/concepts";
import { CONCEPTS as GCP } from "@/courses/gcp-genai-leader/concepts";
import { CONCEPTS as AZ } from "@/courses/azure-ai-901/concepts";
import { CONCEPTS as KCNA } from "@/courses/cncf-kcna/concepts";
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

/**
 * Non-blocking quality report for every course. Counts are printed, not enforced:
 * AIF-C01 is held strictly in validate.test.ts and its own teach-before-test test.
 * Each course with a concept list is registered here; its own teach-before-test test holds it strictly.
 */
const CONCEPT_LISTS: Record<string, ConceptList> = {
  "aws-aif-c01": AIF,
  "aws-clf-c02": CLF,
  "aws-saa-c03": SAA,
  "aws-dva-c02": DVA2,
  "aws-dva-c03": DVA3,
  "gcp-genai-leader": GCP,
  "azure-ai-901": AZ,
  "cncf-kcna": KCNA,
  "code-data-structures": DS,
  "code-algorithms": ALGO,
  "code-javascript": JS,
  "code-react": REACT,
  "code-system-design": SD,
  "code-sql": SQL,
  "code-nextjs": NEXT,
  "code-typescript": TS,
  "code-html-css": WEB,
  "code-java": JAVA,
  "code-python": PY,
  "code-nodejs": NODE,
  "code-go": GO,
  "code-git": GIT,
  "code-docker": DOCKER,
};

/** What the learner sees in a lesson, including its rendered visual. */
function lessonText(l: Lesson) {
  let visual = "";
  try {
    visual = isValidElement(l.visual) ? renderToStaticMarkup(l.visual) : String(l.visual ?? "");
  } catch {
    visual = "";
  }
  return [l.title, ...l.points, l.tip ?? "", visual.replace(/<[^>]+>/g, " ")].join(" ").replace(/\*\*|`/g, "");
}

describe("quality report (warnings only)", () => {
  it("prints longest-option and teach-before-test counts per course", () => {
    const rows = qualityReport(COURSES, CONCEPT_LISTS, lessonText);
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
