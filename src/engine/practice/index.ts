/** Adaptive, concept-gated practice: pure functions, no React and no storage. */
export { entryLesson, isUnlocked, lessonsFor, missingPrereqs, topicsDone, unlockedPrompts, unlockedQuestions, unlocksFor } from "./gating";
export { migrateLessonIds } from "./migration";
export { buildPracticeDeck, practicePool, practiceSummary, type LockedTopic, type NextTopic, type PracticeSummary } from "./practice";
export { practiceWeight } from "./scoring";
export { weightedSample, type Random } from "./selection";
export { courseMap, lessonGate, moduleLessonLabel, startHereLessons, topicForLesson, type CourseMap, type MapModule, type MapTopic, type TopicState } from "./map";
export { inferConcepts } from "./tagging";
export { untaughtMatchTerms } from "./taught";
