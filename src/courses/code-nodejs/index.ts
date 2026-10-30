import { defineCourse, withQuestions } from "@/engine/define";
import d1 from "./domains/d1-event-loop";
import d2 from "./domains/d2-streams-events";
import d3 from "./domains/d3-modules-errors-processes";
import d4 from "./domains/d4-servers-security-performance";
import { codeGames } from "./games";
import { moreQuestions } from "./more";
import { codingChallenges } from "./coding";

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
  tagline: "Predict what the event loop does, tame streams, and ship servers that hold up in production. These are the Node.js questions backend interviews really ask.",
  level: "Intermediate",
  storageKey: "course:code-nodejs:v1",

  domains: withQuestions([d1, d2, d3, d4], [...moreQuestions, ...codeGames]),
  coding: codingChallenges,

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
      { icon: "🎤", value: "30", label: "questions", detail: "The full mock interview is 30 mixed questions in 45 minutes, so about 90 seconds each." },
      { icon: "🎯", value: "70", label: "to pass", detail: "Score 70 out of 100 on the mock to pass. Every question counts, and none are unscored." },
      { icon: "🌀", value: "Loop", label: "ordering", detail: "\"What order do these logs print in?\" is one of the most common Node screening questions. Know nextTick, microtasks, timers and immediates inside out." },
      { icon: "🐞", value: "Bug", label: "hunts", detail: "Code review rounds often show you a handler with a hidden problem, like a blocking call, a missing return, a leak or an injection, and ask you to find it." },
      { icon: "🏗️", value: "Prod", label: "readiness", detail: "Senior and staff rounds move past syntax to running in production: backpressure, graceful shutdown, monitoring, and scaling across cores and pods." },
      { icon: "🟢", value: "LTS", label: "current Node", detail: "Snippets assume a current LTS release and CommonJS, unless they're marked as ESM. The behaviour covered here has been stable for years." },
    ],
    candidate: {
      is: [
        "Preparing for a backend or full-stack interview where the server side is Node.js",
        "Comfortable writing JavaScript and curious about what Node does underneath",
        "Practising predict-the-output and bug hunt questions against the clock",
        "Brushing up on streams, error handling, scaling and security before an on-site",
        "New to Node and starting from zero with the Beginner lessons",
      ],
      isNot: [
        "A JavaScript language course (closures, this and prototypes live in the JavaScript track)",
        "A detailed guide to one framework's API, like NestJS, Fastify plugins or Next.js",
        "A course on databases, ORMs or cloud deployment",
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
      { icon: "🧠", tip: "For ordering questions, talk through the queues: sync code, then nextTick, then promise microtasks, then the loop phase. Interviewers want to hear your model, not only the answer." },
      { icon: "🧵", tip: "Don't stop at \"Node is single-threaded\". Say that JavaScript runs on one thread, while libuv uses the OS and a thread pool for I/O." },
      { icon: "🌊", tip: "Got a lot of data? Reach for streams and pipeline(), and mention backpressure and steady memory use before anyone asks." },
      { icon: "🧯", tip: "Whenever you see a promise, ask who handles it if it rejects. Floating promises and forEach(async …) are classic code review findings." },
      { icon: "🔐", tip: "For security questions, name the attack, point at the line, and give a specific fix, like execFile, a parameterized query or a path prefix check." },
      { icon: "📏", tip: "At senior and staff level, tie every answer to something you can measure or operate: event loop delay, heap snapshots, readiness checks, rollouts." },
    ],
    officialPractice: { label: "Node.js Learn guides (official)", url: "https://nodejs.org/en/learn" },
  },

  cheatsheet: [
    {
      title: "What runs when (CommonJS)",
      items: [
        ["1. Synchronous code", "The current script or callback runs to the end"],
        ["2. process.nextTick queue", "Emptied completely, including ticks added along the way"],
        ["3. Promise microtasks", "then, catch and finally callbacks, await continuations, queueMicrotask"],
        ["4. Timers phase", "setTimeout and setInterval callbacks whose delay has passed"],
        ["5. Poll phase", "I/O callbacks: file reads, sockets, incoming connections"],
        ["6. Check phase", "setImmediate callbacks"],
        ["Between every callback", "Steps 2 and 3 run again before the next callback"],
      ],
    },
    {
      title: "Thread pool and blocking",
      items: [
        ["Uses the pool (4 threads by default)", "fs, dns.lookup, async crypto (pbkdf2, scrypt), zlib"],
        ["Doesn't use the pool", "TCP and UDP sockets, HTTP, timers"],
        ["UV_THREADPOOL_SIZE", "Set it before the pool is first used"],
        ["Blocks the loop", "Sync calls in handlers, heavy loops, huge JSON, ReDoS"],
        ["CPU-heavy JavaScript", "A worker_threads pool, or a separate service"],
      ],
    },
    {
      title: "Streams",
      items: [
        ["Readable and Writable", "A source and a destination"],
        ["Duplex and Transform", "Both sides at once, and output worked out from input"],
        ["write() returns false", "Stop, wait for 'drain', then carry on"],
        ["pipeline()", "Handles backpressure, passes on errors and cleans up"],
        ["for await (chunk of readable)", "Reads only as fast as your loop runs"],
        ["Decoding text", "Buffer.concat then toString, or setEncoding('utf8')"],
      ],
    },
    {
      title: "Modules",
      items: [
        [".mjs and .cjs", "Always ES modules, and always CommonJS"],
        [".js", "The type field in the nearest package.json decides"],
        ["require()", "Synchronous, cached, and returns module.exports"],
        ["exports = {...}", "A bug: it breaks the link to module.exports"],
        ["ES module imports", "Static, hoisted, live bindings, top-level await allowed"],
        ["Cycles (CommonJS)", "You get the partly filled exports object"],
      ],
    },
    {
      title: "Errors and processes",
      items: [
        ["Callbacks", "(err, result): check err first"],
        ["try/catch", "Only catches sync throws and rejections you await"],
        ["Promise.all and allSettled", "all fails fast; allSettled reports every outcome"],
        ["Unhandled rejection", "Crashes the process by default since Node 15"],
        ["uncaughtException", "Log, clean up and exit, then let a supervisor restart you"],
        ["worker_threads, cluster, child_process", "CPU work in-process, HTTP across cores, running other programs"],
      ],
    },
    {
      title: "Production checklist",
      items: [
        ["Config", "process.env values are strings, so convert and check them at startup"],
        ["Secrets", "In a secret manager, never in git or logs, rotated if they leak"],
        ["Input", "Check it against a schema, use parameterized queries, and use execFile rather than exec"],
        ["Shutdown", "On SIGTERM: fail readiness, server.close(), finish requests, close pools, exit"],
        ["Leaks", "Cap caches, remove listeners, clear intervals, compare heap snapshots"],
        ["Monitoring", "Event loop delay, heap compared with RSS, request IDs through AsyncLocalStorage"],
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
