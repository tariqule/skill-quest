import { defineCourse, withQuestions } from "@/engine/define";
import { moreQuestions } from "./more";
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
  tagline: "Learn how TypeScript thinks about shapes, unions, generics and utility types, and spot the type error before the compiler does.",
  level: "Intermediate",
  storageKey: "course:code-typescript:v1",

  domains: withQuestions([d1, d2, d3, d4], moreQuestions),

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
      { icon: "🐞", value: "Errors", label: "on sight", detail: "A common format is a short snippet and the question \"which line doesn't compile?\". Read it the way the compiler does: one line at a time, keeping track of each variable's type." },
      { icon: "🔀", value: "Narrow", label: "everything", detail: "Unions and narrowing come up in almost every TypeScript interview. That means typeof, in, discriminated unions and type predicates." },
      { icon: "🧰", value: "Utility", label: "types", detail: "Expect to use Partial, Pick, Omit, Record and ReturnType. Sometimes you'll be asked to write one yourself with a mapped or conditional type." },
      { icon: "⚙️", value: "strict", label: "mode", detail: "Questions assume strict: true. Know what it turns on, and know the stricter flags it leaves off, such as noUncheckedIndexedAccess and exactOptionalPropertyTypes." },
      { icon: "🏛️", value: "5", label: "levels", detail: "From Beginner, for people who have never used TypeScript, up to Staff. Senior and staff questions cover type-level programming, migrations, library design and runtime validation." },
    ],
    candidate: {
      is: [
        "Complete beginners who want to learn what TypeScript is, starting from the Beginner lessons",
        "Front-end, full-stack or Node.js engineers interviewing for roles that use a lot of TypeScript",
        "JavaScript developers who use TypeScript but want to understand how the type checker reasons",
        "Engineers who design shared types, SDKs or API contracts",
        "Leads planning a move from JavaScript to TypeScript, or a stricter tsconfig",
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
      { icon: "👀", tip: "For \"which line errors?\" questions, picture your editor's hover. Note the type of each variable before you read the next line." },
      { icon: "🦆", tip: "TypeScript compares shapes, not names. If the shapes fit, it compiles. The one exception is the excess property check on fresh object literals." },
      { icon: "🧯", tip: "Reach for unknown instead of any in your answers, and show how you'd narrow it. Interviewers listen for that." },
      { icon: "🧪", tip: "Types are removed before the code runs. Whenever data comes from outside, such as JSON, the network or storage, say how you'd check it." },
      { icon: "🧱", tip: "When you write a utility type live, start with a mapped type over keyof T. Then add modifiers or a conditional." },
      { icon: "🧭", tip: "At senior and staff level, talk about trade-offs: how readable the errors are, how fast type-checking stays, and how the team will maintain the types." },
    ],
    officialPractice: { label: "TypeScript Handbook", url: "https://www.typescriptlang.org/docs/handbook/intro.html" },
  },

  cheatsheet: [
    {
      title: "Top, bottom, and escape hatches",
      items: [
        ["unknown", "Anything can go in, but you must narrow it before use. The safe catch-all type."],
        ["any", "Turns checking off in both directions. Fits everywhere except never."],
        ["never", "Has no values. Shows up as an empty union, an impossible branch, or a function that never returns."],
        ["void", "A return value you shouldn't use"],
        ["{} and object", "{} is any value except null and undefined, even 42. object is only non-primitives."],
      ],
    },
    {
      title: "Narrowing",
      items: [
        ["typeof", "Gives \"string\", \"number\", \"object\" (which includes null!), \"function\" and so on"],
        ["in", "\"swim\" in pet checks for a key. It needs an object on the right."],
        ["instanceof", "Checks for a class instance. Also narrows unknown in a catch block."],
        ["Discriminant", "A shared literal property, like kind, checked with a switch"],
        ["Exhaustive", "default: assertNever(x) breaks the build when a member isn't handled"],
        ["Predicate", "(x): x is T narrows for callers. The body isn't checked."],
      ],
    },
    {
      title: "Utility types",
      items: [
        ["Partial / Required", "Add or remove ? on every property"],
        ["Readonly", "Add readonly, one level deep"],
        ["Pick / Omit", "Keep or drop keys. Omit doesn't check that the keys exist."],
        ["Record<K, V>", "An object type with keys K and values V"],
        ["Exclude / Extract", "Filter the members of a union"],
        ["ReturnType / Parameters", "Work on function types, so write typeof fn"],
        ["Awaited", "Unwraps promises all the way down"],
      ],
    },
    {
      title: "Type-level syntax",
      items: [
        ["keyof T", "A union of the keys of T"],
        ["T[K]", "Indexed access: the type of property K"],
        ["{ [K in keyof T]: … }", "A mapped type. Use -?, -readonly, or as to rename keys."],
        ["T extends U ? X : Y", "A conditional type. It distributes when T is a bare union."],
        ["infer U", "Captures part of a type inside a conditional"],
        ["as const", "Keeps exact literal types all the way down and makes them readonly"],
        ["satisfies", "Checks against a type without widening the inferred one"],
      ],
    },
    {
      title: "tsconfig strictness",
      items: [
        ["strict", "Turns on strictNullChecks, noImplicitAny, strictFunctionTypes, strictPropertyInitialization, useUnknownInCatchVariables and more"],
        ["noUncheckedIndexedAccess", "Index reads include | undefined. Not part of strict."],
        ["exactOptionalPropertyTypes", "x?: T won't accept an explicit undefined. Not part of strict."],
        ["isolatedModules", "Flags code that tools compiling one file at a time can't output"],
        ["skipLibCheck", "Skips checking .d.ts files. Faster, but less safe."],
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
