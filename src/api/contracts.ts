import { z } from "zod";
import type { CourseSummary } from "./wire";
import type { Card, CheatSheetSection, CodingChallenge, Domain, ExamFormat, ExamMode, Lesson as LessonT, ModeId, Question as QuestionT } from "@/engine/types";
import type { ScenarioItem } from "@/engine/scenarios";

/**
 * The /api/v1 contract, shared by the route handlers (validation) and the client (types and
 * response checks in tests). Every success is `{ data }`; every failure is `{ error }` with one of
 * the codes below and a matching HTTP status.
 */
export const API_BASE = "/api/v1";

export const ERROR_STATUS = { bad_request: 400, not_found: 404, method_not_allowed: 405, internal: 500 } as const;
export type ApiErrorCode = keyof typeof ERROR_STATUS;

export const ApiErrorBody = z.object({
  error: z.object({
    code: z.enum(Object.keys(ERROR_STATUS) as [ApiErrorCode, ...ApiErrorCode[]]),
    message: z.string(),
    /** Field-level problems for bad_request. */
    issues: z.array(z.object({ path: z.string(), message: z.string() })).optional(),
  }),
});
export type ApiErrorBody = z.infer<typeof ApiErrorBody>;

export const envelope = <T extends z.ZodType>(data: T) => z.object({ data });

// ───────────── Inputs ─────────────

const slug = z.string().regex(/^[a-z0-9][a-z0-9-]{0,63}$/, "must be a lowercase id");
const idList = z
  .string()
  .max(8000)
  .transform((s) => (s ? s.split(",").map((x) => x.trim()).filter(Boolean) : []))
  .pipe(z.array(z.string().min(1).max(200)).max(200));

export const CourseParams = z.object({ course: slug });
export const LessonParams = CourseParams.extend({ lesson: z.string().min(1).max(120) });
export const GameParams = CourseParams.extend({ game: z.enum(["parsons", "bug", "output"]) });
export const ScenarioParams = CourseParams.extend({ game: z.enum(["architect", "interview", "chain", "matcher"]) });

/** Practice: the client says which lessons are done; the server decides what that unlocks. */
export const PracticeQuery = z.object({ done: idList.default([]), size: z.coerce.number().int().min(1).max(100).optional() });
export const PoolQuery = z.object({
  /** Exam mode id from the course config (e.g. "full", "half"); defaults to the first. */
  mode: z.string().max(40).optional(),
  level: z.enum(["all", "beginner", "junior", "intermediate", "senior", "staff"]).optional(),
});
export const ItemsQuery = z.object({ keys: idList });

export const GradeBody = z.object({
  answers: z
    .array(z.object({ id: z.string().min(1).max(120), picked: z.array(z.number().int().min(-1).max(1000)).max(50) }))
    .min(1)
    .max(200),
});
export type GradeBody = z.infer<typeof GradeBody>;

// ───────────── Outputs ─────────────
// Content shapes are the engine's own types (src/engine/types.ts); these schemas check the parts the
// client relies on and let the rest through, so adding a field to a course never breaks the API.

const Provider = z.object({ id: z.string(), name: z.string(), color: z.string(), icon: z.string() });
export const CourseSummarySchema = z.looseObject({
  id: z.string(),
  kind: z.enum(["certification", "interview", "learning"]),
  provider: Provider,
  code: z.string(),
  title: z.string(),
  shortTitle: z.string(),
  storageKey: z.string(),
  counts: z.object({ domains: z.number(), lessons: z.number(), questions: z.number(), cards: z.number(), challenges: z.number(), coding: z.number() }),
});
export const CatalogSchema = z.array(
  z.discriminatedUnion("status", [z.object({ status: z.literal("live"), course: CourseSummarySchema }), z.object({ status: z.literal("planned"), course: z.looseObject({ id: z.string(), title: z.string() }) })]),
);

const Question = z.looseObject({ id: z.string(), domain: z.string(), lesson: z.string(), prompt: z.string(), explanation: z.string() });
const Domain = z.looseObject({ id: z.string(), name: z.string(), world: z.string(), weight: z.number() });
const LessonMeta = z.looseObject({ id: z.string(), title: z.string(), domain: z.string(), index: z.number(), task: z.string() });
const Lesson = LessonMeta.extend({ points: z.array(z.string()), check: z.array(z.string()) });

/** Full course data for client-side engines (home plan, Daily Review). Visuals and labs are null in JSON. */
export const CourseContentSchema = z.looseObject({ id: z.string(), storageKey: z.string(), domains: z.array(Domain), questions: z.array(Question), challenges: z.array(z.looseObject({ id: z.string() })) });

export const HubSchema = z.object({
  course: CourseSummarySchema,
  domains: z.array(Domain),
  lessons: z.array(LessonMeta),
  exam: z.looseObject({ questions: z.number(), minutes: z.number(), scale: z.object({ min: z.number(), max: z.number(), pass: z.number() }) }),
  modes: z.array(z.string()),
  examModes: z.array(z.looseObject({ id: z.string(), questions: z.number() })),
});

export const LessonSchema = z.object({ lesson: Lesson, questions: z.array(Question), prev: z.string().nullable(), next: z.string().nullable() });

export const PracticeSchema = z.object({
  topicsDone: z.array(z.string()),
  unlocked: z.number(),
  locked: z.number(),
  questions: z.array(Question),
});

export const CheatsheetSchema = z.array(z.object({ title: z.string(), items: z.array(z.tuple([z.string(), z.string()])) }));

export const ItemSchema = z.discriminatedUnion("kind", [
  z.object({ key: z.string(), courseId: z.string(), kind: z.literal("q"), item: Question }),
  z.object({ key: z.string(), courseId: z.string(), kind: z.literal("card"), item: z.looseObject({ id: z.string(), term: z.string() }) }),
  z.object({ key: z.string(), courseId: z.string(), kind: z.literal("code"), item: z.looseObject({ id: z.string(), title: z.string() }) }),
  z.object({ key: z.string(), courseId: z.string(), kind: z.literal("sc"), item: z.looseObject({ id: z.string() }) }),
]);
export const ItemsSchema = z.object({ items: z.array(ItemSchema), missing: z.array(z.string()) });

export const GamesSchema = z.array(z.object({ id: z.enum(["parsons", "bug", "output"]), name: z.string(), rule: z.string(), count: z.number() }));
export const GamePoolSchema = z.object({ game: z.enum(["parsons", "bug", "output"]), questions: z.array(Question) });
export const ScenariosSchema = z.array(z.object({ id: z.string(), name: z.string(), count: z.number() }));
export const ScenarioPoolSchema = z.object({ game: z.string(), items: z.array(z.looseObject({ id: z.string() })) });

export const PoolSchema = z.object({ mode: z.string(), minutes: z.number(), questions: z.array(Question) });

export const GradeSchema = z.object({
  correct: z.number(),
  total: z.number(),
  scaled: z.number().nullable(),
  passed: z.boolean().nullable(),
  results: z.array(z.object({ id: z.string(), correct: z.boolean(), answer: z.array(z.number()) })),
  unknown: z.array(z.string()),
});

// TypeScript shapes of each response (what `api.*` resolves to). Schemas above check them at runtime in tests.
export interface LessonMetaT { id: string; title: string; task: string; domain: string; index: number; level?: LessonT["level"] }
export interface Hub { course: CourseSummary; domains: Domain[]; lessons: LessonMetaT[]; exam: ExamFormat; modes: ModeId[]; examModes: ExamMode[] }
export interface LessonPayload { lesson: Omit<LessonT, "visual" | "pointVisuals"> & { domain: string; index: number }; questions: QuestionT[]; prev: string | null; next: string | null }
export interface Practice { topicsDone: string[]; unlocked: number; locked: number; questions: QuestionT[] }
export type Item = { key: string; courseId: string } & ({ kind: "q"; item: QuestionT } | { kind: "card"; item: Card } | { kind: "code"; item: CodingChallenge } | { kind: "sc"; item: ScenarioItem });
export interface Items { items: Item[]; missing: string[] }
export interface GameSummary { id: "parsons" | "bug" | "output"; name: string; rule: string; count: number }
export interface GamePool { game: GameSummary["id"]; questions: QuestionT[] }
export interface ScenarioSummary { id: string; name: string; count: number }
export interface ScenarioPool { game: string; items: ScenarioItem[] }
export interface Pool { mode: string; minutes: number; questions: QuestionT[] }
export type Cheatsheet = CheatSheetSection[];
export type Grade = z.infer<typeof GradeSchema>;
