import { defineCourse, withQuestions } from "@/engine/define";
import { moreQuestions } from "./more";
import d1 from "./domains/d1-routing";
import d2 from "./domains/d2-server-client";
import d3 from "./domains/d3-data-caching";
import d4 from "./domains/d4-actions-handlers";

/**
 * Next.js Interview Quest. Targets Next.js 16 with the App Router; APIs follow the
 * docs bundled with next@16 (async params, proxy.ts, Cache Components, updateTag/refresh).
 */
export default defineCourse({
  id: "code-nextjs",
  kind: "interview",
  category: "frontend",
  tags: ["app router", "server components", "rsc", "caching", "server actions", "next 16"],
  provider: { id: "nextjs", name: "Next.js", color: "#e2e8f0", icon: "▲" },
  code: "NEXT",
  title: "Next.js Interview Quest",
  shortTitle: "Next.js",
  tagline: "Learn Next.js 16 from your first page to Server Components, caching and Server Actions, then practise the way interviews ask about them.",
  level: "Intermediate",
  storageKey: "course:code-nextjs:v1",

  domains: withQuestions([d1, d2, d3, d4], moreQuestions),

  exam: {
    questions: 30,
    unscored: 0,
    minutes: 45,
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "One best answer. Interviewers care about the why, so read every option." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "The prompt says how many to pick. All of them must be right." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Put the steps or code lines in the order they run." },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair every API or file with its job. Every pair must be right." },
      { id: "lines", icon: "🐞", name: "Bug hunt", rule: "Tap the line(s) in the snippet that hold the bug. The prompt says how many." },
    ],
  },

  guide: {
    source: {
      label: "Next.js interview syllabus, based on the official docs",
      version: "2026",
      date: "October 2026",
      url: "https://nextjs.org/docs",
    },
    facts: [
      { icon: "🧭", value: "App Router", label: "is assumed", detail: "Modern Next.js interviews assume the app/ folder: Server Components by default, nested layouts, and special file names." },
      { icon: "🌉", value: "RSC", label: "server vs client", detail: "Expect to explain where code runs, what \"use client\" really does, and how to keep secrets and bundle size on the server." },
      { icon: "🧊", value: "Cache", label: "the big follow-up", detail: "Caching and revalidation is the classic follow-up question: what's cached, for how long, and how a change makes fresh data appear." },
      { icon: "🛠️", value: "Build", label: "practical rounds", detail: "Many loops include building a small feature: fetch data, add a form with a Server Action, handle loading and error states." },
      { icon: "▲", value: "16", label: "version targeted", detail: "This track follows Next.js 16: async params, proxy.ts, Cache Components with \"use cache\", updateTag, and refresh." },
      { icon: "🎯", value: "70", label: "to pass the mock", detail: "The full mock is 30 questions in 45 minutes, scored 0 to 100. Score 70 or more to pass." },
    ],
    candidate: {
      is: [
        "New to Next.js? Start at the Beginner level. For the interview levels, you'll want to know React components, props, state and hooks",
        "Preparing for a front-end or full-stack role that uses Next.js",
        "Moving from the Pages Router (or Next.js 13–15) to the Next.js 16 App Router",
        "Able to read TypeScript and async/await",
      ],
      isNot: [
        "Deployment platform specifics or hosting provider pricing",
        "The Pages Router (`pages/`, getServerSideProps)",
        "CSS frameworks, styling libraries, or design systems",
        "Writing custom bundler or Turbopack configuration",
      ],
    },
    scope: {
      label: "Topics covered",
      groups: [
        { category: "Routing", icon: "🗺️", services: ["page / layout / template", "Dynamic and catch-all segments", "Route groups and private folders", "loading / error / not-found", "<Link> and next/navigation hooks", "generateStaticParams", "PageProps / LayoutProps"] },
        { category: "Rendering", icon: "🌉", services: ["Server Components", "Client Components", "\"use client\" boundary", "Serializable props", "React use()", "server-only", "NEXT_PUBLIC_ env vars"] },
        { category: "Data and caching", icon: "🧊", services: ["Async Server Components", "<Suspense> streaming", "Cache Components", "\"use cache\"", "cacheLife / cacheTag", "revalidateTag / updateTag", "revalidatePath / refresh", "connection()"] },
        { category: "Mutations and requests", icon: "⚒️", services: ["Server Actions", "useActionState", "Route Handlers", "proxy.ts", "cookies() / headers()", "redirect()"] },
        { category: "Optimisation", icon: "🚀", services: ["Metadata API", "next/image", "next/font"] },
      ],
    },
    tips: [
      { icon: "🗣️", tip: "Say where code runs. \"This is a Server Component, so the query never reaches the browser\" is the kind of sentence interviewers listen for." },
      { icon: "🧊", tip: "For caching questions, name three things: what's cached, how long it lasts (cacheLife), and what clears it (a tag and the call you make)." },
      { icon: "🔒", tip: "Every Server Action is a public POST endpoint. Mention auth and input validation inside the action before anyone asks." },
      { icon: "🌊", tip: "When a page is slow, reach for Suspense close to the slow data before reaching for client-side fetching." },
      { icon: "🆕", tip: "Know the Next.js 16 changes: middleware is now proxy.ts, revalidateTag needs a profile, Image's priority is now preload, and error.tsx gets retry()." },
      { icon: "🧪", tip: "In bug hunts, look for the usual suspects: params that aren't awaited, hooks without \"use client\", cookies() inside \"use cache\", and redirect() inside try." },
    ],
    officialPractice: { label: "Next.js Learn (official course)", url: "https://nextjs.org/learn" },
  },

  cheatsheet: [
    {
      title: "Special files, outer to inner",
      items: [
        ["layout.tsx", "Shared shell. Keeps its state and doesn't re-render when you navigate."],
        ["template.tsx", "Like a layout, but rebuilt each time, so state resets"],
        ["error.tsx", "A \"use client\" error boundary that gets error and retry()"],
        ["loading.tsx", "Suspense fallback around the page"],
        ["not-found.tsx", "Shown when notFound() is called"],
        ["page.tsx", "Makes the URL open to visitors. params and searchParams are Promises."],
        ["route.ts", "GET, POST and other handlers. Never in the same folder as page.tsx."],
      ],
    },
    {
      title: "Server vs client",
      items: [
        ["Default", "Server Component. Can be async, read data, hold secrets, and sends no component JavaScript."],
        ["\"use client\"", "Goes at the top of the file. Needed for state, events, effects and browser APIs."],
        ["Composition", "Pass Server Components to Client ones as children"],
        ["Props", "Must be serializable. Plain functions and class instances aren't."],
        ["Secrets", "Use import \"server-only\". Only NEXT_PUBLIC_ variables reach the browser."],
      ],
    },
    {
      title: "Cache Components",
      items: [
        ["Enable", "cacheComponents: true (default in new apps)"],
        ["\"use cache\"", "Caches what a function or component returns. Its arguments pick the cache entry."],
        ["cacheLife", "seconds, minutes, hours, days, weeks or max, or your own { stale, revalidate, expire }"],
        ["Runtime APIs", "cookies(), headers() and searchParams. Read them outside the cache and wrap in <Suspense>."],
        ["connection()", "Defer random values and timestamps to request time"],
        ["Static shell", "Plain markup, cached output and Suspense fallbacks, built ahead of time (PPR)"],
      ],
    },
    {
      title: "After a mutation",
      items: [
        ["updateTag(tag)", "Server Actions only. Expires now, so the user sees their own change."],
        ["revalidateTag(tag, 'max')", "Actions and Route Handlers. Serves the old copy while it refreshes."],
        ["revalidatePath(path)", "Invalidate one route"],
        ["refresh()", "Server Actions only. Re-renders the route and leaves the cache alone."],
        ["redirect(url)", "Throws. Call it after revalidating, and outside try/catch."],
      ],
    },
    {
      title: "Requests and polish",
      items: [
        ["Server Action", "Marked \"use server\" and called with POST. Check auth inside and return expected errors."],
        ["useActionState", "Returns [state, action, pending]. The action gets (prevState, formData)."],
        ["proxy.ts", "Used to be middleware. Runs on Node.js, uses a matcher, and is for fast checks only."],
        ["Metadata", "metadata and generateMetadata work in Server Components only"],
        ["next/image", "Needs width and height, or fill. preload replaces priority."],
        ["next/font", "Fonts served from your own site, with no requests to Google"],
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

  boss: { name: "The Stale Cache Kraken", emoji: "🦑" },
  matchLabel: "Next.js APIs and files",
  levelTitles: [
    "Folder Wanderer",
    "Route Rookie",
    "Layout Lifter",
    "Boundary Walker",
    "Suspense Surfer",
    "Cache Diver",
    "Tag Tamer",
    "Action Smith",
    "Proxy Warden",
    "App Router Architect",
  ],
});
