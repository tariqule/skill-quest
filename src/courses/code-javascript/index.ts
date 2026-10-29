import { defineCourse, withQuestions } from "@/engine/define";
import { codingChallenges } from "./coding";
import { moreQuestions } from "./more";
import d1 from "./domains/d1-types-scope";
import d2 from "./domains/d2-objects-this";
import d3 from "./domains/d3-async";
import d4 from "./domains/d4-modern-syntax";

/**
 * JavaScript Interview Quest.
 * Original interview-prep content written against the MDN JavaScript reference
 * (ECMAScript 2025 behaviour, stable in every current browser and Node.js LTS).
 */
export default defineCourse({
  id: "code-javascript",
  kind: "interview",
  category: "languages",
  tags: ["js", "closures", "event loop", "promises", "async", "prototype", "es2025"],
  provider: { id: "javascript", name: "JavaScript", color: "#f7df1e", icon: "🟨" },
  code: "JS",
  title: "JavaScript Interview Quest",
  shortTitle: "JavaScript",
  tagline: "Coercion, closures, this, prototypes, and the event loop: predict the output before the interviewer does.",
  level: "Intermediate",
  storageKey: "course:code-javascript:v1",

  domains: withQuestions([d1, d2, d3, d4], moreQuestions),
  coding: codingChallenges,

  exam: {
    questions: 30,
    unscored: 0,
    minutes: 45,
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "One correct answer. For \"What does this print?\", run the code in your head line by line." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "The prompt says how many to pick. All of them must be right to score." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Put console output, code lines, or steps in the right sequence." },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair each expression or API with what it does. Every pair must be right." },
      { id: "lines", icon: "🐞", name: "Bug hunt", rule: "Tap the line(s) the prompt asks for: the bug, or the line that throws." },
    ],
  },

  guide: {
    source: {
      label: "JavaScript interview syllabus, based on the official docs",
      version: "2026",
      date: "October 2026",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    },
    facts: [
      { icon: "🖨️", value: "Output", label: "questions", detail: "\"What does this print?\" snippets are the most common JavaScript screen: coercion, hoisting, closures in loops, and promise ordering." },
      { icon: "🔁", value: "Loop", label: "event loop", detail: "Expect at least one question ordering setTimeout, promises, and await. Microtasks always run before the next macrotask." },
      { icon: "🎯", value: "this", label: "binding", detail: "Interviewers love detached methods, arrow functions, and bind. Know the four rules and their priority." },
      { icon: "🧑‍💻", value: "Live", label: "coding", detail: "Many interviews add a small live task (debounce, once, memoize, a promise helper) where closures and async do the work." },
      { icon: "🏛️", value: "4", label: "levels", detail: "Junior to staff. Senior and staff questions move from syntax to internals, performance, and system-level decisions." },
    ],
    candidate: {
      is: [
        "Front-end, full-stack, or Node.js engineers preparing for a JavaScript screen",
        "Developers who use JavaScript daily but want to explain why it behaves as it does",
        "Anyone who wants to predict the output of tricky snippets with confidence",
        "Senior engineers brushing up on the event loop, memory, and async design",
      ],
      isNot: [
        "Framework-specific (React, Vue, Angular) questions",
        "Browser DOM and CSS APIs in depth",
        "Algorithm and data-structure drills",
        "Legacy engine quirks that no longer apply",
      ],
    },
    scope: {
      label: "Topics covered",
      groups: [
        { category: "Types & scope", icon: "🧪", services: ["Primitive types", "typeof", "Type coercion", "== vs ===", "Object.is", "var / let / const", "Hoisting", "Temporal dead zone", "Closures"] },
        { category: "Objects", icon: "🏔️", services: ["this", "call / apply / bind", "Arrow functions", "Prototype chain", "Classes and super", "References and copies", "Object.freeze", "structuredClone", "WeakMap"] },
        { category: "Async", icon: "🌀", services: ["Event loop", "Microtasks vs macrotasks", "Promises", "Promise combinators", "async / await", "Error handling", "AbortController"] },
        { category: "Modern syntax", icon: "🎪", services: ["Array methods", "Destructuring", "Spread and rest", "ES modules", "Live bindings", "Dynamic import", "Classic output traps"] },
      ],
    },
    tips: [
      { icon: "🐢", tip: "For output questions, slow down: write the call stack, the microtask queue, and the macrotask queue on paper." },
      { icon: "🗣️", tip: "Think out loud. \"This is a var, so it's hoisted as undefined\" earns credit even if you slip on the final answer." },
      { icon: "🧷", tip: "When this looks wrong, ask \"how was the function called?\", not \"where was it written?\". Arrow functions are the exception." },
      { icon: "🧯", tip: "Mention error handling unprompted in async code: what happens when the promise rejects?" },
      { icon: "📏", tip: "Know the complexity of what you reach for: includes and find are O(n); a Map or Set lookup is O(1) on average." },
      { icon: "🧭", tip: "For senior and staff questions, name the trade-off and how you'd measure it before picking a fix." },
    ],
    officialPractice: { label: "MDN JavaScript Guide", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide" },
  },

  cheatsheet: [
    {
      title: "Types and equality",
      items: [
        ["Primitives", "string, number, bigint, boolean, undefined, null, symbol. Everything else is an object."],
        ["typeof traps", "typeof null is \"object\"; typeof [] is \"object\"; functions are \"function\""],
        ["Falsy values", "false, 0, -0, 0n, \"\", null, undefined, NaN. Everything else is truthy, including [] and {}."],
        ["== vs ===", "== converts types first; === never does. null == undefined is the one handy ==."],
        ["Object.is", "Like === but Object.is(NaN, NaN) is true and Object.is(0, -0) is false"],
        ["+ operator", "If either side is a string (after ToPrimitive), it concatenates; otherwise it adds"],
      ],
    },
    {
      title: "Scope and closures",
      items: [
        ["var", "Function scoped, hoisted and initialised to undefined"],
        ["let / const", "Block scoped, hoisted but in the TDZ until the declaration runs"],
        ["Function declaration", "Hoisted with its body: callable before the line"],
        ["Closure", "A function plus the variables it captured from where it was created"],
        ["Loop + let", "Each iteration gets a fresh binding, so callbacks see 0, 1, 2"],
      ],
    },
    {
      title: "this",
      items: [
        ["new", "A fresh object linked to the constructor's prototype (highest priority)"],
        ["call / apply / bind", "Explicit this. A bound function can't be re-bound."],
        ["obj.method()", "this is the object before the dot"],
        ["Plain call", "undefined in strict mode and modules (globalThis in sloppy scripts)"],
        ["Arrow function", "No own this: uses the enclosing scope's"],
      ],
    },
    {
      title: "Event loop",
      items: [
        ["Order", "Sync code → all microtasks → (render) → one macrotask → all microtasks → …"],
        ["Microtasks", "Promise reactions (then, catch, finally), await continuations, queueMicrotask"],
        ["Macrotasks", "setTimeout, setInterval, I/O, UI events, MessageChannel"],
        ["Executor", "new Promise(fn) runs fn synchronously"],
        ["async function", "Runs synchronously until the first await; always returns a promise"],
      ],
    },
    {
      title: "Promises",
      items: [
        ["Promise.all", "All values in input order; rejects on the first rejection"],
        ["Promise.allSettled", "Waits for every promise; never rejects"],
        ["Promise.race", "Settles like the first promise to settle"],
        ["Promise.any", "First fulfilment; AggregateError if all reject"],
        ["return await", "Needed inside try/catch so the catch sees the rejection"],
      ],
    },
    {
      title: "Arrays and syntax",
      items: [
        ["Mutate", "push, pop, splice, sort, reverse, fill"],
        ["Copy instead", "toSorted, toReversed, toSpliced, with, slice, spread"],
        ["sort()", "Compares as strings by default: pass (a, b) => a - b for numbers"],
        ["Defaults", "Destructuring and parameter defaults apply only to undefined, not null"],
        ["Spread", "Shallow copy; later keys win"],
        ["ES modules", "Strict, static, live read-only bindings, top-level await"],
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

  boss: { name: "The Undefined Kraken", emoji: "🦑" },
  matchLabel: "JavaScript APIs",
  levelTitles: [
    "Console Logger",
    "Coercion Survivor",
    "Hoisting Handler",
    "Closure Keeper",
    "this Tamer",
    "Prototype Climber",
    "Promise Keeper",
    "Microtask Master",
    "Event Loop Whisperer",
    "TC39 Legend",
  ],
});
