import { defineCourse } from "@/engine/define";
import d1 from "./domains/d1-type-system";
import d2 from "./domains/d2-narrowing";
import d3 from "./domains/d3-generics";
import d4 from "./domains/d4-type-level";

/**
 * TypeScript Interview Quest.
 * Original interview-prep content written against the TypeScript handbook
 * (TypeScript 5.x with `strict: true`). Snippets were checked with tsc 5.9.
 */
export default defineCourse({
  id: "code-typescript",
  kind: "interview",
  category: "languages",
  tags: ["ts", "types", "generics", "narrowing", "utility types"],
  provider: { id: "typescript", name: "TypeScript", color: "#3178c6", icon: "🔷" },
  code: "TS",
  title: "TypeScript Interview Quest",
  shortTitle: "TypeScript",
  tagline: "Structural typing, narrowing, generics, and utility types: spot the type error before the compiler does.",
  level: "Intermediate",
  storageKey: "course:code-typescript:v1",

  domains: [d1, d2, d3, d4],

  exam: {
    questions: 30,
    unscored: 0,
    minutes: 45,
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "One correct answer. Assume strict: true unless the snippet says otherwise." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "The prompt says how many to pick. All of them must be right to score." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Put narrowing checks, type-level code, or steps in the right sequence." },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair each type or utility with what it produces. Every pair must be right." },
      { id: "lines", icon: "🐞", name: "Bug hunt", rule: "Tap the line(s) the compiler reports as a type error (or the bug the prompt describes)." },
    ],
  },

  guide: {
    source: {
      label: "TypeScript interview syllabus, based on the official docs",
      version: "2026",
      date: "October 2026",
      url: "https://www.typescriptlang.org/docs/",
    },
    facts: [
      { icon: "🐞", value: "Errors", label: "on sight", detail: "A common format: a short snippet and \"which line doesn't compile?\". Read it the way tsc does: one line at a time, tracking each variable's type." },
      { icon: "🔀", value: "Narrow", label: "everything", detail: "Unions and narrowing (typeof, in, discriminated unions, predicates) come up in almost every TypeScript interview." },
      { icon: "🧰", value: "Utility", label: "types", detail: "Expect to use Partial, Pick, Omit, Record, and ReturnType, and sometimes to write one yourself with mapped or conditional types." },
      { icon: "⚙️", value: "strict", label: "mode", detail: "Questions assume strict: true. Know what it turns on and the stricter flags it doesn't (noUncheckedIndexedAccess, exactOptionalPropertyTypes)." },
      { icon: "🏛️", value: "4", label: "levels", detail: "Junior to staff. Senior and staff questions cover type-level programming, migrations, library design, and runtime validation." },
    ],
    candidate: {
      is: [
        "Front-end, full-stack, or Node.js engineers interviewing for TypeScript-heavy roles",
        "JavaScript developers who use TypeScript but want to reason about the type checker",
        "Engineers who design shared types, SDKs, or API contracts",
        "Leads planning a JavaScript-to-TypeScript migration or a stricter tsconfig",
      ],
      isNot: [
        "JavaScript runtime behaviour (see the JavaScript track)",
        "Framework-specific typing (React props, Angular DI)",
        "Compiler internals and the TypeScript API",
        "Build tooling beyond the tsconfig options that affect types",
      ],
    },
    scope: {
      label: "Topics covered",
      groups: [
        { category: "Type system", icon: "⚓", services: ["Structural typing", "Excess property checks", "type vs interface", "any / unknown / never", "Literal types", "as const", "satisfies", "Enums vs unions", "Branded types"] },
        { category: "Narrowing", icon: "🌊", services: ["Union types", "typeof / in / instanceof", "Truthiness and equality", "Discriminated unions", "Exhaustiveness with never", "Type predicates", "Assertion functions"] },
        { category: "Generics", icon: "🔨", services: ["Generic functions", "Constraints (extends)", "Defaults", "const type parameters", "keyof / typeof", "Indexed access", "Partial, Pick, Omit, Record", "ReturnType, Parameters, Awaited"] },
        { category: "Type-level & config", icon: "🏯", services: ["Mapped types", "Key remapping", "Conditional types", "infer", "Distributive conditionals", "strict flags", "Declaration files", "isolatedModules"] },
      ],
    },
    tips: [
      { icon: "👀", tip: "For \"which line errors?\", hover in your head: write the type of each variable next to it before reading the next line." },
      { icon: "🦆", tip: "Remember TypeScript is structural. If the shapes fit, it compiles, whatever the names. Excess property checks only apply to fresh object literals." },
      { icon: "🧯", tip: "Prefer unknown to any in your answers, and show how you'd narrow it. Interviewers listen for that." },
      { icon: "🧪", tip: "Types are erased at runtime. When data crosses a boundary (JSON, network, storage), say how you'd validate it." },
      { icon: "🧱", tip: "When writing a utility type live, start with a mapped type over keyof T, then add modifiers or a conditional." },
      { icon: "🧭", tip: "At senior and staff level, talk about trade-offs: error-message quality, type-check speed, and how the team will maintain the types." },
    ],
    officialPractice: { label: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
  },

  cheatsheet: [
    {
      title: "Top, bottom, and escape hatches",
      items: [
        ["unknown", "Anything goes in; narrow before use. The safe top type."],
        ["any", "Turns checking off in both directions. Assignable to everything except never."],
        ["never", "No values. Empty union, impossible branches, functions that never return."],
        ["void", "A return value that shouldn't be used"],
        ["{} vs object", "{} is any non-nullish value (even 42); object is non-primitive only"],
      ],
    },
    {
      title: "Narrowing",
      items: [
        ["typeof", "\"string\", \"number\", \"object\" (includes null!), \"function\", …"],
        ["in", "\"swim\" in pet: needs an object on the right"],
        ["instanceof", "Class instances; also narrows unknown in catch"],
        ["Discriminant", "Shared literal property (kind) + switch"],
        ["Exhaustive", "default: assertNever(x) fails the build when a member is unhandled"],
        ["Predicate", "(x): x is T narrows callers; the body isn't verified"],
      ],
    },
    {
      title: "Utility types",
      items: [
        ["Partial / Required", "Add or remove ? on every property"],
        ["Readonly", "Add readonly (shallow)"],
        ["Pick / Omit", "Keep or drop keys. Omit doesn't check that the keys exist."],
        ["Record<K, V>", "Object type with keys K and values V"],
        ["Exclude / Extract", "Filter union members"],
        ["ReturnType / Parameters", "Function types: use typeof fn"],
        ["Awaited", "Recursively unwraps promises"],
      ],
    },
    {
      title: "Type-level syntax",
      items: [
        ["keyof T", "Union of T's keys"],
        ["T[K]", "Indexed access: type of property K"],
        ["{ [K in keyof T]: … }", "Mapped type; -?, -readonly, as to remap keys"],
        ["T extends U ? X : Y", "Conditional; distributes over naked union T"],
        ["infer U", "Capture part of a type inside a conditional"],
        ["as const", "Deepest literal types, readonly"],
        ["satisfies", "Check against a type without widening the inferred one"],
      ],
    },
    {
      title: "tsconfig strictness",
      items: [
        ["strict", "Turns on strictNullChecks, noImplicitAny, strictFunctionTypes, strictPropertyInitialization, useUnknownInCatchVariables, …"],
        ["noUncheckedIndexedAccess", "Index reads include | undefined (not in strict)"],
        ["exactOptionalPropertyTypes", "x?: T doesn't accept an explicit undefined (not in strict)"],
        ["isolatedModules", "Flags code that single-file transpilers can't emit"],
        ["skipLibCheck", "Skips checking .d.ts files: faster, less safe"],
      ],
    },
  ],

  config: {
    quest: { length: 8 },
    boss: { questions: 25, minutes: 30 },
    examModes: [
      { id: "full", name: "Full mock interview", icon: "🎤", questions: 30, unscored: 0, minutes: 45, full: true },
      { id: "quick", name: "Quick screen", icon: "⚡", questions: 15, unscored: 0, minutes: 20, full: false },
    ],
  },

  boss: { name: "The Any Hydra", emoji: "🐉" },
  matchLabel: "TypeScript types and utilities",
  levelTitles: [
    "Any Escapee",
    "Annotation Apprentice",
    "Union Wrangler",
    "Narrowing Navigator",
    "Generic Smith",
    "Utility Tinkerer",
    "Mapped Type Mage",
    "Conditional Conjurer",
    "Inference Oracle",
    "Type-Level Wizard",
  ],
});
