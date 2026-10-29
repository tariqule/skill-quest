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
  tagline: "App Router, Server Components, caching, and Server Actions in Next.js 16, the way interviewers ask about them.",
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
      { icon: "🧭", value: "App Router", label: "is assumed", detail: "Modern Next.js interviews assume the app/ directory: Server Components by default, nested layouts, and file conventions." },
      { icon: "🌉", value: "RSC", label: "server vs client", detail: "Expect to explain where code runs, what \"use client\" really does, and how to keep secrets and bundle size on the server." },
      { icon: "🧊", value: "Cache", label: "the deep dive", detail: "Caching and revalidation is the classic follow-up: what is cached, for how long, and how a mutation makes fresh data appear." },
      { icon: "🛠️", value: "Build", label: "practical rounds", detail: "Many loops include building a small feature: fetch data, add a form with a Server Action, handle loading and error states." },
      { icon: "▲", value: "16", label: "version targeted", detail: "This track follows Next.js 16: async params, proxy.ts, Cache Components with \"use cache\", updateTag, and refresh." },
      { icon: "🎯", value: "70", label: "to pass the mock", detail: "The full mock is 30 questions in 45 minutes, scored 0 to 100. Score 70 or more to pass." },
    ],
    candidate: {
      is: [
        "Comfortable with React components, props, state, and hooks",
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
      { icon: "🗣️", tip: "Say where code runs. \"This is a Server Component, so the query never ships to the browser\" is the sentence interviewers are listening for." },
      { icon: "🧊", tip: "For caching questions, name three things: what is cached, its lifetime (cacheLife), and what invalidates it (a tag and the call)." },
      { icon: "🔒", tip: "Every Server Action is a public POST endpoint. Mention auth and input validation inside the action before anyone asks." },
      { icon: "🌊", tip: "When a page is slow, reach for Suspense close to the slow data before reaching for client-side fetching." },
      { icon: "🆕", tip: "Know the Next.js 16 renames: middleware → proxy.ts, revalidateTag needs a profile, Image priority → preload, error.tsx gets retry()." },
      { icon: "🧪", tip: "In bug hunts, scan for the usual suspects: un-awaited params, hooks without \"use client\", cookies() inside \"use cache\", redirect() inside try." },
    ],
    officialPractice: { label: "Next.js Learn (official course)", url: "https://nextjs.org/learn" },
  },

  cheatsheet: [
    {
      title: "Special files (outer → inner)",
      items: [
        ["layout.tsx", "Shared shell, keeps state, no re-render on navigation"],
        ["template.tsx", "Like a layout but remounts (state resets)"],
        ["error.tsx", "\"use client\" error boundary with error + retry()"],
        ["loading.tsx", "Suspense fallback around the page"],
        ["not-found.tsx", "Shown when notFound() is called"],
        ["page.tsx", "Makes the URL reachable; params / searchParams are Promises"],
        ["route.ts", "GET/POST/... handlers; never next to page.tsx"],
      ],
    },
    {
      title: "Server vs client",
      items: [
        ["Default", "Server Component: async, data access, secrets, zero component JS"],
        ["\"use client\"", "Top of file; state, events, effects, browser APIs"],
        ["Composition", "Pass Server Components to Client ones as children"],
        ["Props", "Must be serializable (no plain functions or class instances)"],
        ["Secrets", "import \"server-only\"; only NEXT_PUBLIC_ vars reach the browser"],
      ],
    },
    {
      title: "Cache Components",
      items: [
        ["Enable", "cacheComponents: true (default in new apps)"],
        ["\"use cache\"", "Caches a function/component result; args = cache key"],
        ["cacheLife", "seconds · minutes · hours · days · weeks · max, or { stale, revalidate, expire }"],
        ["Runtime APIs", "cookies(), headers(), searchParams: read outside the cache, wrap in <Suspense>"],
        ["connection()", "Defer random values and timestamps to request time"],
        ["Static shell", "Static + cached + Suspense fallbacks, prerendered (PPR)"],
      ],
    },
    {
      title: "After a mutation",
      items: [
        ["updateTag(tag)", "Server Actions only; expire now, read your own writes"],
        ["revalidateTag(tag, 'max')", "Actions + Route Handlers; stale-while-revalidate"],
        ["revalidatePath(path)", "Invalidate one route"],
        ["refresh()", "Server Actions only; re-render route, cache untouched"],
        ["redirect(url)", "Throws; call after revalidating and outside try/catch"],
      ],
    },
    {
      title: "Requests and polish",
      items: [
        ["Server Action", "\"use server\", POST, check auth inside, return expected errors"],
        ["useActionState", "[state, action, pending]; action(prevState, formData)"],
        ["proxy.ts", "Formerly middleware; Node.js runtime; matcher; fast checks only"],
        ["Metadata", "metadata / generateMetadata in Server Components only"],
        ["next/image", "width + height or fill; preload replaces priority"],
        ["next/font", "Self-hosted fonts, no requests to Google"],
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
