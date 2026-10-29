import { defineCourse } from "@/engine/define";
import d1 from "./domains/d1-components";
import d2 from "./domains/d2-hooks";
import d3 from "./domains/d3-data-flow";
import d4 from "./domains/d4-modern-react";

/**
 * React Interview Quest. Targets React 19 (including 19.2's useEffectEvent) and
 * follows the concepts and terminology of react.dev.
 */
export default defineCourse({
  id: "code-react",
  kind: "interview",
  category: "frontend",
  tags: ["hooks", "jsx", "state", "useEffect", "react 19", "components"],
  provider: { id: "react", name: "React", color: "#61dafb", icon: "⚛️" },
  code: "REACT",
  title: "React Interview Quest",
  shortTitle: "React",
  tagline: "Components, hooks, rendering, and React 19 Actions, the way interviewers probe them: predict, debug, and explain.",
  level: "Intermediate",
  storageKey: "course:code-react:v1",

  domains: [d1, d2, d3, d4],

  exam: {
    questions: 30,
    unscored: 0,
    minutes: 45,
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "One best answer. Predict what the code renders or logs, or pick the best fix." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "The prompt says how many to pick. All of them must be right." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Put the steps, or the lines of a hook, in the order they run." },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair every API or syntax with its job. Every pair must be right." },
      { id: "lines", icon: "🐞", name: "Bug hunt", rule: "Tap the line(s) in the snippet that hold the bug. The prompt says how many." },
    ],
  },

  guide: {
    source: {
      label: "React interview syllabus, based on the official docs",
      version: "2026",
      date: "October 2026",
      url: "https://react.dev",
    },
    facts: [
      { icon: "🧠", value: "Hooks", label: "the core round", detail: "Most React interviews dig into state updates, useEffect dependencies and cleanup, and why the rules of hooks exist." },
      { icon: "🔮", value: "Predict", label: "the output", detail: "Expect snippets where you say what renders or logs: batched updates, stale closures, keys, and conditional rendering." },
      { icon: "🛠️", value: "Build", label: "live coding", detail: "Many loops include building a small component (a form, a list with filters, a fetch with loading and error states) while you talk." },
      { icon: "🚀", value: "Perf", label: "senior follow-ups", detail: "Senior rounds ask why something re-renders and how to stop it: state placement, memo, stable props, profiling." },
      { icon: "⚛️", value: "19", label: "version targeted", detail: "This track follows React 19: Actions, useActionState, useOptimistic, use, ref as a prop, and the React Compiler." },
      { icon: "🎯", value: "70", label: "to pass the mock", detail: "The full mock is 30 questions in 45 minutes, scored 0 to 100. Score 70 or more to pass." },
    ],
    candidate: {
      is: [
        "Comfortable with modern JavaScript: closures, arrow functions, destructuring, spread, promises",
        "Preparing for a front-end or full-stack role that uses React",
        "Coming from class components or React 16–18 and catching up on React 19",
        "Wanting to explain why code behaves the way it does, not just make it work",
      ],
      isNot: [
        "Framework specifics such as Next.js routing or caching (see the Next.js track)",
        "Third-party state libraries' APIs (Redux, Zustand) beyond when to reach for them",
        "React Native or styling libraries",
        "Testing library APIs",
      ],
    },
    scope: {
      label: "Topics covered",
      groups: [
        { category: "Components", icon: "🧩", services: ["JSX", "Props vs state", "Conditional rendering", "Lists and keys", "Purity", "StrictMode"] },
        { category: "Rendering", icon: "🔁", services: ["Trigger, render, commit", "State as a snapshot", "Batching", "Reconciliation", "Resetting state with key"] },
        { category: "Hooks", icon: "🪝", services: ["useState", "useReducer", "useEffect", "useRef", "useMemo", "useCallback", "useContext", "useEffectEvent", "useSyncExternalStore", "Custom hooks", "Rules of hooks"] },
        { category: "Data flow", icon: "🌊", services: ["Controlled and uncontrolled inputs", "Lifting state up", "Context", "You might not need an effect"] },
        { category: "Performance", icon: "🚀", services: ["memo", "State colocation", "Profiler", "Virtualisation", "React Compiler"] },
        { category: "Concurrent and React 19", icon: "✨", services: ["Suspense", "lazy", "useTransition", "useDeferredValue", "use", "Actions", "useActionState", "useFormStatus", "useOptimistic", "ref as a prop"] },
      ],
    },
    tips: [
      { icon: "🗣️", tip: "Narrate renders. \"Clicking calls the setter, React re-renders this component and its children, then commits the diff\" shows you have the right mental model." },
      { icon: "📸", tip: "When predicting output, remember state is a snapshot: inside one render (and its handlers and timeouts) state values never change." },
      { icon: "🎯", tip: "For any useEffect, say three things: what external system it syncs with, its dependencies, and its cleanup." },
      { icon: "🔽", tip: "For performance questions, suggest moving state down or passing children before reaching for memo, and mention profiling first." },
      { icon: "🧪", tip: "In bug hunts, scan for the usual suspects: mutated state, missing deps, index or random keys, hooks after an early return, onClick={fn()}." },
      { icon: "✨", tip: "Know what React 19 added and why: Actions remove hand-written pending and error state; the compiler removes most manual memoization." },
    ],
    officialPractice: { label: "react.dev Learn React", url: "https://react.dev/learn" },
  },

  cheatsheet: [
    {
      title: "Rendering",
      items: [
        ["Re-renders when", "Own state changes · parent renders · read context changes"],
        ["Render vs commit", "Calling components vs applying DOM changes"],
        ["State snapshot", "setX affects the next render; current variables don't change"],
        ["Batching", "Many updates in one handler/timeout/promise → one render"],
        ["Keys", "Stable ids among siblings; new key = remount + reset state"],
        ["0 && <X />", "Renders \"0\"; use count > 0 && … or a ternary"],
      ],
    },
    {
      title: "State updates",
      items: [
        ["setN(n + 1) ×3", "+1 (same snapshot)"],
        ["setN(c => c + 1) ×3", "+3 (queued updaters)"],
        ["Objects", "setUser({ ...user, age }) — never mutate"],
        ["Arrays", "[...a, x] · a.filter(…) · a.map(…) — no push/splice"],
        ["useState(fn)", "Lazy initialiser, runs once"],
        ["useReducer", "Pure (state, action) → next; dispatch is stable"],
      ],
    },
    {
      title: "useEffect",
      items: [
        ["No array", "After every render"],
        ["[]", "After mount; cleanup on unmount"],
        ["[a, b]", "Mount + whenever a or b changes (Object.is)"],
        ["Cleanup", "Before the next run and on unmount"],
        ["Races", "let ignore = false; cleanup sets ignore = true"],
        ["Stale closure", "Missing deps or setX(x + 1) in a timer → use updater"],
        ["useEffectEvent", "Read latest values without adding dependencies"],
      ],
    },
    {
      title: "Refs and memoization",
      items: [
        ["useRef", "Mutable, persistent, no re-render; DOM nodes, timer ids"],
        ["useMemo", "Cache a computed value"],
        ["useCallback", "Cache a function = useMemo(() => fn, deps)"],
        ["memo", "Skip render if props are Object.is-equal"],
        ["Breaks memo", "Inline objects, arrays, arrow functions as props"],
        ["React Compiler", "Auto-memoizes at build time; needs Rules of React"],
      ],
    },
    {
      title: "React 19",
      items: [
        ["<form action={fn}>", "fn(formData) in a transition; resets uncontrolled fields"],
        ["useActionState", "[state, formAction, isPending]; action(prevState, formData)"],
        ["useFormStatus", "{ pending, … } of the parent form (call in a child)"],
        ["useOptimistic", "Optimistic value while the Action is pending"],
        ["use(promise | context)", "Suspends on promises; allowed in conditions"],
        ["ref as a prop", "No forwardRef needed for function components"],
        ["<Context value>", "Context itself works as the provider"],
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

  boss: { name: "The Infinite Re-render Ouroboros", emoji: "🐍" },
  matchLabel: "React hooks and APIs",
  levelTitles: [
    "JSX Sprout",
    "Prop Passer",
    "State Keeper",
    "Key Holder",
    "Effect Tamer",
    "Hook Smith",
    "Context Weaver",
    "Memo Mage",
    "Suspense Sorcerer",
    "Fiber Architect",
  ],
});
