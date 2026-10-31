import { CodeBlock, Flow, Ladder, Tiles } from "@/components/learn/blocks";
import { inferConcepts } from "@/engine/practice";
import type { ChoiceQuestion, DomainModule, Lesson, LessonIdMigration, Question, Topic } from "@/engine/types";
import { CURRICULUM, MODULE_TITLES } from "../system-design/curriculum";
import { assertNever, readerScreens, type ModuleId, type QuizItem, type TopicContent, type Visual } from "../system-design/schema";

/**
 * Adapter between the plain-data curriculum (`src/courses/system-design`) and the engine: turns
 * topic files into lessons and questions, derives each topic's status, and tags older questions.
 */

const COLOR = "#2dd4bf";

/** Which course domain (world) each module's lessons and questions belong to. */
const MODULE_HOME: Record<ModuleId, { domain: string; task: string }> = {
  m1: { domain: "d1", task: "1.1 · 1.2" },
  m2: { domain: "d1", task: "1.2 · 1.3" },
  m3: { domain: "d1", task: "1.3" },
  m4: { domain: "d2", task: "2.1" },
  m5: { domain: "d2", task: "2.2" },
  m6: { domain: "d3", task: "3.1" },
  m7: { domain: "d4", task: "4.1" },
  m8: { domain: "d4", task: "4.2" },
  m9: { domain: "d3", task: "3.2" },
  m10: { domain: "d4", task: "4.3" },
};

/** The start lessons M1 replaced. Bump `version` whenever an alias is added. */
export const LESSON_MIGRATION: LessonIdMigration = {
  version: 1,
  aliases: { "d1-start-what": "t-intro", "d1-start-numbers": "t-estimation" },
};

function VisualView({ visual }: { visual: Visual }) {
  switch (visual.kind) {
    case "flow":
      return <Flow color={COLOR} steps={[...visual.steps]} />;
    case "ladder":
      return <Ladder caption={visual.caption} rungs={[...visual.rungs]} />;
    case "tiles":
      return <Tiles tiles={visual.tiles.map((t) => ({ ...t, color: COLOR }))} />;
    case "code":
      return <CodeBlock lang={visual.lang} code={visual.code} caption={visual.caption} />;
    default:
      return assertNever(visual);
  }
}

export function topicLesson(t: TopicContent): Lesson {
  return {
    id: t.id,
    level: "beginner",
    task: MODULE_HOME[t.module].task,
    title: t.title,
    visual: <VisualView visual={t.visual} />,
    points: t.screens.flatMap(readerScreens),
    tip: t.tip,
    check: t.quiz.map((q) => q.id),
    sources: t.sources.map((s) => ({ ...s })),
  };
}

function toQuestion(item: QuizItem, t: TopicContent, concepts: string[]): ChoiceQuestion {
  const base = { id: item.id, domain: MODULE_HOME[t.module].domain, lesson: t.id, level: "beginner" as const, explanation: item.explanation, concepts };
  switch (item.kind) {
    case "mcq":
      return { ...base, prompt: item.prompt, options: [...item.options], answer: [item.answer] };
    case "tf":
      return { ...base, prompt: item.statement, options: ["True", "False"], answer: [item.answer ? 0 : 1], tf: true };
    default:
      return assertNever(item);
  }
}

export const quizQuestions = (t: TopicContent): Question[] => t.quiz.map((q) => toQuestion(q, t, [t.id]));
export const practiceQuestions = (t: TopicContent): Question[] => t.practice.map((q) => toQuestion(q, t, [t.id, ...(t.practiceNeeds ?? [])]));

/** Prepends each written topic's lesson and quiz to its module's home domain. */
export function withTopics(domains: DomainModule[], topics: readonly TopicContent[]): DomainModule[] {
  return domains.map((m) => {
    const mine = topics.filter((t) => MODULE_HOME[t.module].domain === m.domain.id);
    return { ...m, lessons: [...mine.map(topicLesson), ...m.lessons], questions: [...mine.flatMap(quizQuestions), ...m.questions] };
  });
}

/** The syllabus as engine topics: "ready" once written or covered by a stand-in lesson. */
export function courseTopics(written: readonly TopicContent[]): Topic[] {
  const ids = new Set(written.map((t) => t.id));
  return CURRICULUM.map((o) => ({
    id: o.id,
    title: o.title,
    module: MODULE_TITLES[o.module],
    status: ids.has(o.id) || o.standIns?.length ? "ready" : "planned",
    prereqs: [...o.prereqs],
    standIns: o.standIns ? [...o.standIns] : undefined,
    match: o.match,
  }));
}

/** Topics a lesson teaches: itself if it is a topic, plus every topic it stands in for. */
export function topicsForLesson(topics: readonly Topic[], lessonId: string): Topic[] {
  return topics.filter((t) => t.id === lessonId || t.standIns?.includes(lessonId));
}

/**
 * Tags untagged questions with the topics their lesson teaches, narrowed by each topic's
 * pattern. Returns new objects; questions that already carry tags are kept as they are.
 */
export function tagQuestions(questions: readonly Question[], topics: readonly Topic[]): Question[] {
  return questions.map((q) => {
    if (q.concepts?.length) return q;
    const text = `${q.prompt} ${q.explanation}`;
    return { ...q, concepts: inferConcepts(text, topicsForLesson(topics, q.lesson)) };
  });
}
