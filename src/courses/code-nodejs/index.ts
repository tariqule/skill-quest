import { defineCourse } from "@/engine/define";
import d1 from "./domains/d1-event-loop";
import d2 from "./domains/d2-streams-events";
import d3 from "./domains/d3-modules-errors-processes";
import d4 from "./domains/d4-servers-security-performance";

/**
 * Node.js Interview Quest: the Node questions backend interviews actually ask,
 * from event loop ordering to backpressure, modules, and production readiness.
 * Based on the official Node.js API docs; snippets target current LTS releases.
 */
export default defineCourse({
  id: "code-nodejs",
  kind: "interview",
  category: "backend",
  tags: ["node", "express", "streams", "event loop", "npm", "backend"],
  provider: { id: "nodejs", name: "Node.js", color: "#5fa04e", icon: "🟢" },
  code: "NODE",
  title: "Node.js Interview Quest",
  shortTitle: "Node.js",
  tagline: "Predict the event loop, tame streams, and ship production-ready servers: the Node.js questions backend interviews really ask.",
  level: "Intermediate",
  storageKey: "course:code-nodejs:v1",

  domains: [d1, d2, d3, d4],

  exam: {
    questions: 30,
    unscored: 0,
    minutes: 45,
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "One correct answer. Often \"what does this print?\" or \"what happens?\"." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "The prompt says how many to pick. You need all of them right to score." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Arrange code, phases, or steps into the order that works." },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair each item with its answer. Every pair must be right." },
      { id: "lines", icon: "🐞", name: "Bug hunt", rule: "Tap the line in the snippet that causes the bug, leak, or vulnerability." },
    ],
  },

  guide: {
    source: {
      label: "Node.js interview syllabus, based on the official docs",
      version: "2026",
      date: "October 2026",
      url: "https://nodejs.org/docs/latest/api/",
    },
    facts: [
      { icon: "🎤", value: "30", label: "questions", detail: "The full mock interview: 30 mixed questions in 45 minutes, about 90 seconds each." },
      { icon: "🎯", value: "70", label: "to pass", detail: "Score 70 out of 100 on the mock. Every question counts; there are no unscored ones." },
      { icon: "🌀", value: "Loop", label: "ordering", detail: "\"What order do these logs print?\" is one of the most common Node screening questions. Know nextTick, microtasks, timers, and immediates cold." },
      { icon: "🐞", value: "Bug", label: "hunts", detail: "Code-review rounds often show a handler with a blocking call, a missing return, a leak, or an injection and ask you to find it." },
      { icon: "🏗️", value: "Prod", label: "readiness", detail: "Senior and staff rounds move from syntax to production: backpressure, graceful shutdown, observability, and scaling across cores and pods." },
      { icon: "🟢", value: "LTS", label: "current Node", detail: "Snippets assume a current LTS release with CommonJS unless marked as ESM. The behaviour covered has been stable for years." },
    ],
    candidate: {
      is: [
        "Preparing for a backend or full-stack interview where the server side is Node.js",
        "Comfortable writing JavaScript and wants to understand what Node does underneath",
        "Practising predict-the-output and bug-hunt questions under time pressure",
        "Reviewing streams, error handling, scaling, and security before an on-site",
      ],
      isNot: [
        "A JavaScript language course (closures, this, prototypes are covered in the JavaScript track)",
        "A deep dive into one framework's API (NestJS, Fastify plugins, Next.js)",
        "A course on databases, ORMs, or cloud deployment",
        "Data structures and algorithms practice",
      ],
    },
    scope: {
      label: "Topics covered",
      groups: [
        { category: "Event loop", icon: "🌀", services: ["Loop phases", "process.nextTick", "Promises & microtasks", "setImmediate vs setTimeout", "Blocking"] },
        { category: "Runtime", icon: "⚙️", services: ["libuv", "Thread pool", "UV_THREADPOOL_SIZE", "Non-blocking I/O"] },
        { category: "Streams & data", icon: "🌊", services: ["Readable / Writable / Duplex / Transform", "pipeline()", "Backpressure", "Buffer", "Encodings"] },
        { category: "Events", icon: "📣", services: ["EventEmitter", "once", "'error' event", "Listener leaks"] },
        { category: "Modules", icon: "📦", services: ["CommonJS", "ES modules", "Module cache", "Circular dependencies", "Live bindings"] },
        { category: "Errors", icon: "🧯", services: ["Error-first callbacks", "async/await", "Promise.all / allSettled", "Unhandled rejections", "uncaughtException"] },
        { category: "Parallelism", icon: "🧵", services: ["worker_threads", "cluster", "child_process"] },
        { category: "Production", icon: "🏔️", services: ["HTTP servers", "Middleware", "Config & secrets", "Input validation", "Graceful shutdown", "Memory leaks", "AsyncLocalStorage"] },
      ],
    },
    tips: [
      { icon: "🧠", tip: "For ordering questions, narrate the queues: sync code, then nextTick, then promise microtasks, then the loop phase. Interviewers want the model, not just the answer." },
      { icon: "🧵", tip: "Never say just \"Node is single-threaded\". Say JavaScript runs on one thread while libuv uses the OS and a thread pool for I/O." },
      { icon: "🌊", tip: "Large data? Reach for streams and pipeline(), and mention backpressure and constant memory before anyone asks." },
      { icon: "🧯", tip: "When you see a promise, ask who handles its rejection. Floating promises and forEach(async …) are classic review findings." },
      { icon: "🔐", tip: "For security questions, name the attack, point at the line, and give a concrete fix (execFile, parameterized query, path prefix check)." },
      { icon: "📏", tip: "At senior and staff level, tie every answer to a metric or an operation: event loop delay, heap snapshots, readiness checks, rollouts." },
    ],
    officialPractice: { label: "Node.js Learn guides (official)", url: "https://nodejs.org/en/learn" },
  },

  cheatsheet: [
    {
      title: "What runs when (CommonJS)",
      items: [
        ["1. Synchronous code", "The current script or callback runs to completion"],
        ["2. process.nextTick queue", "Drained completely, including ticks added along the way"],
        ["3. Promise microtasks", "then/catch/finally, await continuations, queueMicrotask"],
        ["4. Timers phase", "setTimeout / setInterval whose delay has passed"],
        ["5. Poll phase", "I/O callbacks: file reads, sockets, incoming connections"],
        ["6. Check phase", "setImmediate callbacks"],
        ["Between every callback", "Steps 2 and 3 run again before the next callback"],
      ],
    },
    {
      title: "Thread pool and blocking",
      items: [
        ["Uses the pool (4 threads by default)", "fs, dns.lookup, async crypto (pbkdf2, scrypt), zlib"],
        ["Doesn't use the pool", "TCP/UDP sockets, HTTP, timers"],
        ["UV_THREADPOOL_SIZE", "Set before the pool is first used"],
        ["Blocks the loop", "*Sync calls in handlers, heavy loops, huge JSON, ReDoS"],
        ["CPU-heavy JS", "worker_threads pool, or a separate service"],
      ],
    },
    {
      title: "Streams",
      items: [
        ["Readable · Writable", "Source · destination"],
        ["Duplex · Transform", "Both sides · output computed from input"],
        ["write() returns false", "Stop, wait for 'drain', resume"],
        ["pipeline()", "Backpressure + error forwarding + cleanup"],
        ["for await (chunk of readable)", "Reads at the pace of your loop"],
        ["Decoding text", "Buffer.concat then toString, or setEncoding('utf8')"],
      ],
    },
    {
      title: "Modules",
      items: [
        [".mjs / .cjs", "Always ESM / always CommonJS"],
        [".js", "Nearest package.json type field decides"],
        ["require()", "Synchronous, cached, returns module.exports"],
        ["exports = {...}", "Bug: breaks the link to module.exports"],
        ["ESM imports", "Static, hoisted, live bindings, top-level await"],
        ["Cycles (CommonJS)", "You get the partly filled exports object"],
      ],
    },
    {
      title: "Errors and processes",
      items: [
        ["Callbacks", "(err, result): check err first"],
        ["try/catch", "Catches sync throws and awaited rejections only"],
        ["Promise.all · allSettled", "Fails fast · reports every outcome"],
        ["Unhandled rejection", "Crashes the process by default since Node 15"],
        ["uncaughtException", "Log, clean up, exit; let a supervisor restart"],
        ["worker_threads · cluster · child_process", "CPU in-process · HTTP across cores · run other programs"],
      ],
    },
    {
      title: "Production checklist",
      items: [
        ["Config", "process.env is strings; parse and validate at startup"],
        ["Secrets", "Secret manager, never in git or logs, rotate on leak"],
        ["Input", "Schema-validate; parameterized queries; execFile not exec"],
        ["Shutdown", "SIGTERM → fail readiness → server.close() → finish → close pools → exit"],
        ["Leaks", "Bounded caches, remove listeners, clear intervals, compare heap snapshots"],
        ["Observability", "Event loop delay, heap vs RSS, request IDs via AsyncLocalStorage"],
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

  boss: { name: "The Callback Kraken", emoji: "🐙" },
  matchLabel: "Node.js APIs",
  levelTitles: [
    "Callback Cadet",
    "Tick Tamer",
    "Promise Keeper",
    "Buffer Wrangler",
    "Stream Surfer",
    "Emitter Whisperer",
    "Module Mechanic",
    "Thread Pool Shark",
    "Backpressure Boss",
    "Event Loop Legend",
  ],
});
