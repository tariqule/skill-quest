import { defineCourse, withQuestions } from "@/engine/define";
import d1 from "./domains/d1-components";
import d2 from "./domains/d2-hooks";
import d3 from "./domains/d3-data-flow";
import d4 from "./domains/d4-modern-react";
import { moreQuestions } from "./more";

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
  tagline: "Learn React from your first component to React 19 Actions, then practise the way interviews test it: predict the output, find the bug, explain why.",
  level: "Intermediate",
  storageKey: "course:code-react:v1",

  domains: withQuestions([d1, d2, d3, d4], moreQuestions),

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
        "New to React? Start at the Beginner level. For the interview levels, you'll want to be comfortable with modern JavaScript: closures, arrow functions, destructuring, spread and promises",
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
      { icon: "🗣️", tip: "Talk through renders out loud. Saying \"clicking calls the setter, React re-renders this component and its children, then commits the changes\" shows you understand what's going on." },
      { icon: "📸", tip: "When you predict output, remember that state is a snapshot. Inside one render, and the handlers and timeouts it creates, state values never change." },
      { icon: "🎯", tip: "For any useEffect, say three things: what outside system it syncs with, what its dependencies are, and what its cleanup does." },
      { icon: "🔽", tip: "For performance questions, mention measuring with the Profiler first. Then suggest moving state down or passing children before you reach for memo." },
      { icon: "🧪", tip: "In bug hunts, look for the usual suspects: edited state, missing dependencies, index or random keys, hooks after an early return, and onClick={fn()}." },
      { icon: "✨", tip: "Know what React 19 added and why. Actions replace hand-written pending and error state. The compiler replaces most manual memoization." },
    ],
    officialPractice: { label: "react.dev Learn React", url: "https://react.dev/learn" },
  },

  cheatsheet: [
    {
      title: "Rendering",
      items: [
        ["Re-renders when", "Its own state changes, its parent renders, or a context it reads changes"],
        ["Render vs commit", "Render calls your components. Commit applies the changes to the page."],
        ["State snapshot", "setX changes the next render. Variables in this render stay the same."],
        ["Batching", "Several updates in one handler, timeout or promise give one render"],
        ["Keys", "Stable ids among siblings. A new key rebuilds the component and resets its state."],
        ["0 && <X />", "Renders \"0\". Use count > 0 && … or a ternary."],
      ],
    },
    {
      title: "State updates",
      items: [
        ["setN(n + 1) ×3", "Adds 1, because all three read the same snapshot"],
        ["setN(c => c + 1) ×3", "Adds 3, because each updater gets the previous result"],
        ["Objects", "setUser({ ...user, age }). Never edit the old object."],
        ["Arrays", "Use [...a, x], a.filter(…) or a.map(…). Avoid push and splice."],
        ["useState(fn)", "Lazy starting value. React calls fn only once."],
        ["useReducer", "A pure function from (state, action) to the next state. dispatch never changes."],
      ],
    },
    {
      title: "useEffect",
      items: [
        ["No array", "Runs after every render"],
        ["[]", "Runs once after the first render. Cleanup runs when it's removed."],
        ["[a, b]", "Runs after the first render, then whenever a or b changes"],
        ["Cleanup", "Runs before the next effect and when the component is removed"],
        ["Races", "Set let ignore = false. The cleanup sets ignore = true so old responses are dropped."],
        ["Stale closure", "Caused by missing deps, or setX(x + 1) in a timer. Use the updater form."],
        ["useEffectEvent", "Reads the latest values without adding them as dependencies"],
      ],
    },
    {
      title: "Refs and memoization",
      items: [
        ["useRef", "Keeps a value between renders with no re-render. For DOM elements and timer ids."],
        ["useMemo", "Caches a calculated value"],
        ["useCallback", "Caches a function. Same as useMemo(() => fn, deps)."],
        ["memo", "Skips a render when every prop is the same as last time"],
        ["Breaks memo", "New objects, arrays or arrow functions passed as props"],
        ["React Compiler", "Adds memoization at build time. Your code must follow the Rules of React."],
      ],
    },
    {
      title: "React 19",
      items: [
        ["<form action={fn}>", "Calls fn(formData) in a transition, then clears uncontrolled fields"],
        ["useActionState", "Returns [state, formAction, isPending]. The action gets (prevState, formData)."],
        ["useFormStatus", "The status of the form around it, like pending. Call it in a child of the form."],
        ["useOptimistic", "Shows the expected value while the Action runs"],
        ["use(promise | context)", "Waits for promises with Suspense. You can call it inside an if."],
        ["ref as a prop", "Function components take ref directly. No forwardRef needed."],
        ["<Context value>", "Render the context itself as the provider"],
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
