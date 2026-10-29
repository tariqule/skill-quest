import type { Course } from "./types";

/** Words that differ between certification courses, interview-prep tracks, and learning tracks. */
export interface CourseCopy {
  /** Name of the final simulation, e.g. "The Certification Gate". */
  gate: string;
  gateIcon: string;
  /** One-word step name on the "how it works" strip. */
  gateStep: string;
  /** "exam" or "interview". */
  noun: string;
  /** "the real exam" / "a real interview". */
  real: string;
  /** "exam simulator" / "mock interview". */
  simulator: string;
  /** "exam day" / "interview day". */
  day: string;
  /** Label for a lesson's syllabus reference: "Exam task" / "Topic". */
  task: string;
  tip: string;
  readiness: string;
  /** What the guide's task list is called: "official exam guide" / "interview syllabus". */
  syllabus: string;
  /** Intro slide titles. */
  glanceTitle: string;
  forMeTitle: string;
  forMeYes: string;
  forMeNo: string;
}

const CERTIFICATION: CourseCopy = {
  gate: "The Certification Gate",
  gateIcon: "🏛️",
  gateStep: "Certify",
  noun: "exam",
  real: "the real exam",
  simulator: "exam simulator",
  day: "exam day",
  task: "Exam task",
  tip: "Exam tip",
  readiness: "Exam readiness",
  syllabus: "official exam guide",
  glanceTitle: "The exam at a glance",
  forMeTitle: "Is this exam for me?",
  forMeYes: "✅ This exam is for…",
  forMeNo: "🙅 You will NOT need to…",
};

const INTERVIEW: CourseCopy = {
  gate: "The Mock Interview",
  gateIcon: "🎤",
  gateStep: "Interview",
  noun: "interview",
  real: "a real interview",
  simulator: "mock interview",
  day: "interview day",
  task: "Topic",
  tip: "Interview tip",
  readiness: "Interview readiness",
  syllabus: "interview syllabus",
  glanceTitle: "The interview at a glance",
  forMeTitle: "Who is this for?",
  forMeYes: "✅ Great for…",
  forMeNo: "🙅 Not covered here…",
};

const LEARNING: CourseCopy = {
  gate: "The Final Skill Check",
  gateIcon: "🏁",
  gateStep: "Prove it",
  noun: "skill check",
  real: "real projects",
  simulator: "skill check",
  day: "project day",
  task: "Topic",
  tip: "Pro tip",
  readiness: "Skill readiness",
  syllabus: "learning path",
  glanceTitle: "The track at a glance",
  forMeTitle: "Who is this for?",
  forMeYes: "✅ Great for…",
  forMeNo: "🙅 Not covered here…",
};

export function courseCopy(course: Pick<Course, "kind">): CourseCopy {
  return course.kind === "interview" ? INTERVIEW : course.kind === "learning" ? LEARNING : CERTIFICATION;
}
