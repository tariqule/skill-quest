import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { EventLoopLab } from "../labs";

/** Module 3: the event loop, promises, async/await, and error handling. */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Async & the Event Loop",
    world: "The Event Loop Lagoon",
    weight: 30,
    emoji: "🌀",
    color: "#38bdf8",
    summary: "Call stack, microtasks vs macrotasks, promise chains and combinators, async/await, cancellation, and error handling.",
  },

  tasks: [
    { id: "3.1", title: "The event loop", covers: ["Call stack, task queue, microtask queue", "setTimeout vs promises vs queueMicrotask", "Blocking the loop and starvation"] },
    { id: "3.2", title: "Promises", covers: ["Promise states and the executor", "then/catch/finally chains and return values", "Promise.all, allSettled, race, any"] },
    { id: "3.3", title: "async/await and error handling", covers: ["How async functions run and what they return", "Sequential vs parallel awaits", "try/catch/finally, return await, unhandled rejections", "Error types and custom errors"] },
  ],

  lessons: [
    {
      id: "d3-loop",
      level: "senior",
      check: ["d3-01", "d3-02"],
      task: "3.1",
      title: "The event loop, step by step",
      visual: (
        <div className="grid gap-5">
          <Flow
            color="#38bdf8"
            loop="repeat forever"
            steps={[
              { icon: "📜", label: "Run one task", sub: "The script, a timer callback, an event…" },
              { icon: "⚡", label: "Drain microtasks", sub: "Every promise reaction, even ones added meanwhile" },
              { icon: "🎨", label: "Render", sub: "Browsers may paint here" },
              { icon: "📥", label: "Next task", sub: "Oldest ready macrotask" },
            ]}
          />
          <EventLoopLab />
        </div>
      ),
      points: [
        "JavaScript runs one thing at a time on a single call stack. Nothing interrupts a running function.",
        "Microtasks (promise reactions, await continuations, queueMicrotask) all run before the next macrotask.",
        "Macrotasks include setTimeout/setInterval callbacks, I/O, and UI events. setTimeout(fn, 0) means \"after at least 0 ms, as a new task\".",
        "Long synchronous work, or an endless chain of microtasks, blocks timers, input, and rendering.",
      ],
      tip: "Narrate the queues: \"sync logs first, then the microtask queue drains, then one timer\". It shows the model, not memorisation.",
    },
    {
      id: "d3-promises",
      level: "intermediate",
      check: ["d3-03", "d3-07"],
      task: "3.2",
      title: "Promises and their combinators",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "🤝", title: "Promise.all", text: "All values, in input order. Rejects on the first rejection.", color: "#38bdf8" },
              { icon: "📋", title: "allSettled", text: "Waits for all. Never rejects. { status, value | reason }.", color: "#34d399" },
              { icon: "🏁", title: "race", text: "Settles like whichever settles first (fulfil or reject).", color: "#fbbf24" },
              { icon: "🍀", title: "any", text: "First fulfilment. AggregateError only if all reject.", color: "#f472b6" },
            ]}
          />
          <CodeBlock
            lang="js"
            code={`new Promise((resolve) => {
  console.log("executor runs NOW");   // synchronous
  resolve(1);
})
  .then((x) => x + 1)                 // return value → next then
  .then((x) => { throw new Error(x) })// throw → skips to catch
  .catch((e) => "recovered")          // catch returns → chain fulfils
  .finally(() => console.log("cleanup"));`}
          />
        </div>
      ),
      points: [
        "A promise is pending, then fulfilled or rejected, once. The executor function runs synchronously.",
        "Each then returns a new promise resolved with the callback's return value. Forget return and the next step gets undefined.",
        "A thrown error or rejection skips ahead to the next catch; returning from catch recovers the chain.",
        "finally runs either way and passes the original result through.",
      ],
      tip: "Be ready to implement Promise.all by hand: count settled results, store them by index, reject on the first error.",
    },
    {
      id: "d3-async",
      level: "intermediate",
      check: ["d3-04", "d3-12"],
      task: "3.3",
      title: "async/await: sequential vs parallel",
      visual: (
        <CodeCompare
          lang="js"
          left={{ title: "Sequential: ~2 s", code: `async function load() {
  const a = await fetchA(); // 1 s
  const b = await fetchB(); // starts after A: 1 s
  return [a, b];
}` }}
          right={{ title: "Parallel: ~1 s", code: `async function load() {
  const [a, b] = await Promise.all([
    fetchA(),               // both start now
    fetchB(),
  ]);
  return [a, b];
}` }}
        />
      ),
      points: [
        "An async function runs synchronously until its first await, then returns a promise to the caller.",
        "Everything after an await resumes as a microtask, even when the awaited value is already available.",
        "Independent awaits in a row run one after another. Start them together and await Promise.all.",
        "forEach ignores returned promises: use for...of with await (sequential) or Promise.all(items.map(...)) (parallel).",
      ],
      tip: "When you see two awaits in a row in an interview snippet, ask: \"does B depend on A?\" If not, parallelise.",
    },
    {
      id: "d3-errors",
      level: "senior",
      check: ["d3-15", "d3-13"],
      task: "3.3",
      title: "Errors: try, catch, finally, and async",
      visual: (
        <CodeCompare
          lang="js"
          left={{ title: "Catch never runs", code: `async function load() {
  try {
    return fetchData(); // promise returned as-is
  } catch {
    return "fallback";
  }
}` }}
          right={{ title: "Catch sees the rejection", code: `async function load() {
  try {
    return await fetchData(); // settles inside try
  } catch {
    return "fallback";
  }
}` }}
        />
      ),
      points: [
        "try/catch only catches what happens while the try block is running: an error thrown later in a timer callback escapes.",
        "Inside try, use return await so a rejection is thrown inside the try block.",
        "finally always runs. A return in finally overrides the try/catch result, so avoid it.",
        "Every promise needs a handler. Unhandled rejections crash Node.js by default (since v15).",
      ],
      tip: "Name the built-in error types (TypeError, ReferenceError, SyntaxError, RangeError) and say when you'd subclass Error.",
    },
  ],

  questions: [
    // ── Event loop ──
    {
      id: "d3-01", domain: "d3", lesson: "d3-loop", level: "intermediate", type: "order",
      prompt: "Put the console output in order.",
      code: `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");`, codeLang: "js",
      items: ["`A`", "`D`", "`C`", "`B`"],
      explanation: "Synchronous logs run first (A, D). Then the microtask queue drains (C, a promise reaction), and only then does the timer's macrotask run (B).",
    },
    {
      id: "d3-02", domain: "d3", lesson: "d3-loop", level: "senior",
      prompt: "What does this print?",
      code: `setTimeout(() => console.log(1), 0);
queueMicrotask(() => console.log(2));
Promise.resolve().then(() => console.log(3));
console.log(4);`, codeLang: "js",
      options: ["`4 2 3 1`", "`4 3 2 1`", "`1 2 3 4`", "`4 1 2 3`"],
      answer: [0],
      explanation: "4 is synchronous. queueMicrotask and the promise reaction are both microtasks, run in the order they were queued (2, then 3). The timer is a macrotask, so 1 comes last.",
    },
    {
      id: "d3-05", domain: "d3", lesson: "d3-loop", level: "senior",
      prompt: "What does this print?",
      code: `setTimeout(() => console.log("t1"), 0);
Promise.resolve().then(() => {
  console.log("p1");
  setTimeout(() => console.log("t2"), 0);
  Promise.resolve().then(() => console.log("p2"));
});`, codeLang: "js",
      options: ["`p1 p2 t1 t2`", "`p1 t1 p2 t2`", "`t1 p1 p2 t2`", "`p1 t1 t2 p2`"],
      answer: [0],
      explanation: "The microtask runs first and prints p1. It queues t2 behind t1 and a new microtask p2. The microtask queue must be empty before any timer runs, so p2 prints before t1 and t2.",
    },
    {
      id: "d3-06", domain: "d3", lesson: "d3-loop", level: "senior",
      prompt: "What does this print?",
      code: `setTimeout(() => {
  console.log("a");
  Promise.resolve().then(() => console.log("b"));
}, 0);
setTimeout(() => console.log("c"), 0);`, codeLang: "js",
      options: ["`a b c`", "`a c b`", "`c a b`", "`b a c`"],
      answer: [0],
      explanation: "After each macrotask, the microtask queue is drained. So the microtask b runs right after a's timer, before the next timer c. (Browsers and Node.js 11+ agree.)",
    },
    {
      id: "d3-19", domain: "d3", lesson: "d3-loop", level: "intermediate", type: "order",
      prompt: "Order one turn of the browser event loop.",
      items: ["Run the current task (e.g. the script) to completion", "Drain the microtask queue completely", "Render the page if needed", "Take the next task from a task queue"],
      explanation: "One task, then all microtasks, then a possible render, then the next task. That's why promise callbacks can delay painting but can't interrupt running code.",
    },
    {
      id: "d3-20", domain: "d3", lesson: "d3-loop", level: "junior",
      prompt: "Which callbacks run as microtasks? (Choose two.)",
      options: ["A promise's `.then` callback", "A `queueMicrotask` callback", "A `setTimeout(fn, 0)` callback", "A `click` event listener", "A `setInterval` callback"],
      answer: [0, 1],
      explanation: "Promise reactions (then/catch/finally, await continuations) and queueMicrotask are microtasks. Timers and UI events are tasks (macrotasks).",
    },
    {
      id: "d3-22", domain: "d3", lesson: "d3-loop", level: "senior",
      prompt: "A function queues a microtask that queues another microtask, forever. What happens to a `setTimeout(cb, 0)` that was scheduled before it started?",
      options: [
        "It never runs: the microtask queue never empties, so the loop never reaches the next task",
        "It runs after about 4 ms, because timers interrupt microtasks",
        "It runs on a separate thread",
        "The engine drops the microtasks after 1,000 iterations",
      ],
      answer: [0],
      explanation: "The loop only takes the next task once the microtask queue is empty. Endless microtasks starve timers, I/O, input, and rendering, so the page or process hangs.",
    },
    {
      id: "d3-28", domain: "d3", lesson: "d3-loop", level: "staff",
      prompt: "A Node.js API parses a 200 MB CSV synchronously in one endpoint, and p99 latency spikes for every other endpoint while it runs. What's the best fix?",
      options: [
        "Move the parsing off the main thread (a worker thread or a separate job), or stream and parse it in chunks",
        "Wrap the parsing in an async function",
        "Wrap it in `Promise.resolve().then(...)`",
        "Add more `setTimeout(fn, 0)` calls before the parse",
      ],
      answer: [0],
      explanation: "Async doesn't mean parallel: a long synchronous job still blocks the single event loop, whether it runs in a task or a microtask. Offload CPU-bound work or break it into small chunks that let other work run between them.",
    },
    // ── Promises ──
    {
      id: "d3-03", domain: "d3", lesson: "d3-promises", level: "junior",
      prompt: "What does this print?",
      code: `console.log("start");
const p = new Promise((resolve) => {
  console.log("executor");
  resolve("done");
});
p.then((v) => console.log(v));
console.log("end");`, codeLang: "js",
      options: ["`start executor end done`", "`start end executor done`", "`start executor done end`", "`executor start end done`"],
      answer: [0],
      explanation: "The executor runs synchronously inside `new Promise`. The `then` callback is a microtask, so \"done\" prints after the synchronous \"end\".",
    },
    {
      id: "d3-07", domain: "d3", lesson: "d3-promises", level: "junior",
      prompt: "You pass three promises to `Promise.all`. The second one rejects after 1 s; the others fulfil after 3 s. What happens?",
      options: [
        "The returned promise rejects after about 1 s with the second promise's reason",
        "It waits 3 s, then rejects with all the errors",
        "It fulfils after 3 s with `[value, undefined, value]`",
        "It fulfils after 3 s with only the two successful values",
      ],
      answer: [0],
      explanation: "Promise.all fails fast on the first rejection. The other promises keep running, but their results are ignored. Use allSettled to get every outcome.",
    },
    {
      id: "d3-08", domain: "d3", lesson: "d3-promises", level: "intermediate", type: "match",
      prompt: "Match each combinator with its behaviour.",
      pairs: [
        ["`Promise.all`", "Fulfils with every value; rejects on the first rejection"],
        ["`Promise.allSettled`", "Waits for all and never rejects; gives status objects"],
        ["`Promise.race`", "Settles like the first promise to settle"],
        ["`Promise.any`", "Fulfils with the first fulfilment; rejects only if all reject"],
      ],
      explanation: "all: everything or fail fast. allSettled: a report of every result. race: first to finish either way (useful for timeouts). any: first success, AggregateError if none.",
    },
    {
      id: "d3-09", domain: "d3", lesson: "d3-promises", level: "intermediate", type: "lines",
      prompt: "This logs `undefined` instead of `20`. Which line is the bug?",
      code: `Promise.resolve(1)
  .then((x) => x + 1)
  .then((x) => { x * 10; })
  .then((x) => console.log(x));`, codeLang: "js",
      answer: [3],
      explanation: "An arrow function with braces needs an explicit `return`. Line 3 computes 20 and throws it away, so the next then receives undefined. Write `(x) => x * 10`.",
    },
    {
      id: "d3-10", domain: "d3", lesson: "d3-promises", level: "intermediate",
      prompt: "What does this print?",
      code: `Promise.reject(new Error("boom"))
  .catch((e) => e.message)
  .then((v) => console.log("then:", v))
  .finally(() => console.log("finally"));`, codeLang: "js",
      options: ["`then: boom` then `finally`", "`finally` only", "`then: undefined` then `finally`", "An unhandled rejection error"],
      answer: [0],
      explanation: "catch handles the rejection and returns \"boom\", which fulfils the chain. The next then receives \"boom\", and finally runs at the end.",
    },
    {
      id: "d3-24", domain: "d3", lesson: "d3-promises", level: "intermediate",
      prompt: "In an ES module (top-level await allowed), what does this print?",
      code: `const results = await Promise.allSettled([
  Promise.resolve(1),
  Promise.reject(new Error("no")),
]);
console.log(results.map((r) => r.status));`, codeLang: "js",
      options: ["`[\"fulfilled\", \"rejected\"]`", "`[\"resolved\", \"rejected\"]`", "It throws `Error: no`", "`[1, Error: no]`"],
      answer: [0],
      explanation: "allSettled never rejects. Each entry is `{ status: \"fulfilled\", value }` or `{ status: \"rejected\", reason }`, in input order.",
    },
    {
      id: "d3-29", domain: "d3", lesson: "d3-promises", level: "senior",
      prompt: "In an ES module, what does this print?",
      code: `const wait = (ms, v) => new Promise((r) => setTimeout(() => r(v), ms));
const done = [];
const results = await Promise.all([
  wait(30, "a").then((v) => (done.push(v), v)),
  wait(10, "b").then((v) => (done.push(v), v)),
]);
console.log(results, done);`, codeLang: "js",
      options: ["`[\"a\", \"b\"] [\"b\", \"a\"]`", "`[\"b\", \"a\"] [\"b\", \"a\"]`", "`[\"a\", \"b\"] [\"a\", \"b\"]`", "`[\"b\", \"a\"] [\"a\", \"b\"]`"],
      answer: [0],
      explanation: "Promise.all's result keeps input order, whatever the finishing order. The side-effect array records completion order: b after 10 ms, then a.",
    },
    {
      id: "d3-25", domain: "d3", lesson: "d3-promises", level: "staff",
      prompt: "A nightly job must call an API for 10,000 user IDs. The API allows at most 20 concurrent requests, and some calls fail. What's the best approach?",
      options: [
        "A worker pool: keep at most 20 requests in flight, start the next as each settles, and record failures per ID for retry",
        "`Promise.all(ids.map(callApi))`",
        "A `for...of` loop with `await`, one request at a time",
        "Fire every request with `setTimeout` staggered 50 ms apart",
      ],
      answer: [0],
      explanation: "Promise.all over 10,000 calls breaks the limit and fails fast on one error. Sequential calls are 20× slower than allowed. Staggering is guesswork: slow responses still pile up. A bounded pool respects the limit and keeps throughput high.",
    },
    // ── async/await ──
    {
      id: "d3-04", domain: "d3", lesson: "d3-async", level: "intermediate",
      prompt: "What does this print?",
      code: `async function f() {
  console.log("1");
  await null;
  console.log("2");
}
f();
console.log("3");`, codeLang: "js",
      options: ["`1 3 2`", "`1 2 3`", "`3 1 2`", "`1 3` (2 never prints)"],
      answer: [0],
      explanation: "An async function runs synchronously until its first await, so 1 prints. `await null` pauses it and queues the rest as a microtask. The caller continues with 3, then the function resumes and prints 2.",
    },
    {
      id: "d3-11", domain: "d3", lesson: "d3-async", level: "intermediate", type: "lines",
      prompt: "\"all saved\" is logged before any save finishes. Which line causes it?",
      code: `async function saveAll(items) {
  items.forEach(async (item) => {
    await save(item);
  });
  console.log("all saved");
}`, codeLang: "js",
      answer: [2],
      explanation: "forEach ignores the promises returned by its async callback, so nothing waits for them. Use `for (const item of items) await save(item)` or `await Promise.all(items.map(save))`.",
    },
    {
      id: "d3-12", domain: "d3", lesson: "d3-async", level: "intermediate",
      prompt: "`fetchA` and `fetchB` each take about 1 s and don't depend on each other. How long does `load` take, and how do you speed it up?",
      code: `async function load() {
  const a = await fetchA();
  const b = await fetchB();
  return [a, b];
}`, codeLang: "js",
      options: [
        "About 2 s. Start both and `await Promise.all([fetchA(), fetchB()])` for about 1 s",
        "About 1 s, because await runs both in parallel",
        "About 2 s, and it can't be faster because JavaScript is single-threaded",
        "About 1 s, because the second await is skipped",
      ],
      answer: [0],
      explanation: "Each await waits before the next call even starts. Network waits happen outside the JS thread, so starting both first lets them overlap, even on a single thread.",
    },
    {
      id: "d3-21", domain: "d3", lesson: "d3-async", level: "junior",
      prompt: "What does this print?",
      code: `async function f() { return 5; }
console.log(typeof f(), f() instanceof Promise);`, codeLang: "js",
      options: ["`object true`", "`number false`", "`promise true`", "`function false`"],
      answer: [0],
      explanation: "An async function always returns a promise, even when it returns a plain value. `typeof` a promise is \"object\".",
    },
    {
      id: "d3-26", domain: "d3", lesson: "d3-async", level: "staff",
      prompt: "In a search box, each keystroke fires a request. Slow responses for old queries sometimes arrive last and overwrite the newest results. What's the best fix?",
      options: [
        "Abort the previous request with an `AbortController` when a new one starts, and ignore responses for outdated queries",
        "Await each request before allowing the next keystroke",
        "Add a random delay to each request",
        "Cache every response forever",
      ],
      answer: [0],
      explanation: "Responses can arrive in any order. Cancelling with `fetch(url, { signal })` saves work, and checking that the response matches the latest query guarantees correctness. Debouncing helps too, but doesn't fix ordering alone.",
    },
    // ── Errors ──
    {
      id: "d3-13", domain: "d3", lesson: "d3-errors", level: "senior", type: "lines",
      prompt: "When `fetchData()` rejects, the catch block never runs. Which line is the bug?",
      code: `async function load() {
  try {
    return fetchData();
  } catch {
    return "fallback";
  }
}`, codeLang: "js",
      answer: [3],
      explanation: "Returning the promise ends the try block before it settles, so the rejection reaches the caller instead of the catch. `return await fetchData()` settles inside the try.",
    },
    {
      id: "d3-14", domain: "d3", lesson: "d3-errors", level: "intermediate",
      prompt: "What happens when this runs?",
      code: `try {
  setTimeout(() => { throw new Error("late"); }, 0);
} catch (e) {
  console.log("caught");
}
console.log("after");`, codeLang: "js",
      options: [
        "\"after\" prints, then the error is thrown later and is not caught",
        "\"caught\" then \"after\"",
        "\"after\" then \"caught\"",
        "Nothing prints; the error is thrown first",
      ],
      answer: [0],
      explanation: "The try block only schedules the timer and finishes. When the callback throws later, it's in a different task, so this try/catch is long gone. Catch inside the callback instead.",
    },
    {
      id: "d3-15", domain: "d3", lesson: "d3-errors", level: "intermediate",
      prompt: "What does this print?",
      code: `function f() {
  try {
    return "try";
  } finally {
    console.log("finally");
  }
}
console.log(f());`, codeLang: "js",
      options: ["`finally` then `try`", "`try` then `finally`", "`try` only", "`finally` only"],
      answer: [0],
      explanation: "The return value is computed, then finally runs before the function actually returns. So \"finally\" is logged inside f, and then the caller logs \"try\".",
    },
    {
      id: "d3-16", domain: "d3", lesson: "d3-errors", level: "senior",
      prompt: "What does this print?",
      code: `function g() {
  try { throw new Error("x"); }
  catch { return "catch"; }
  finally { return "finally"; }
}
console.log(g());`, codeLang: "js",
      options: ["`finally`", "`catch`", "`x`", "An uncaught `Error: x`"],
      answer: [0],
      explanation: "A return in finally overrides any return or throw from try or catch. It can silently swallow errors, which is why linters flag it (`no-unsafe-finally`).",
    },
    {
      id: "d3-17", domain: "d3", lesson: "d3-errors", level: "junior", type: "match",
      prompt: "Match each line with the error it throws.",
      pairs: [
        ["`null.x`", "TypeError"],
        ["`notDeclared + 1`", "ReferenceError"],
        ["`JSON.parse(\"{\")`", "SyntaxError"],
        ["`new Array(-1)`", "RangeError"],
      ],
      explanation: "TypeError: wrong kind of value. ReferenceError: unknown name (or TDZ). SyntaxError: invalid source text, including JSON. RangeError: a number outside the allowed range.",
    },
    {
      id: "d3-18", domain: "d3", lesson: "d3-errors", level: "intermediate",
      prompt: "`loadUser()` returns a promise that may reject. Which correctly handle the rejection? (Choose two.)",
      options: [
        "`try { await loadUser(); } catch (e) { report(e); }` inside an async function",
        "`loadUser().catch(report);`",
        "`try { loadUser(); } catch (e) { report(e); }` with no await",
        "`loadUser(); window.onerror = report;`",
      ],
      answer: [0, 1],
      explanation: "Either await it inside try/catch or attach `.catch`. Without await, the try block finishes before the promise rejects. `window.onerror` sees uncaught exceptions; promise rejections go to `unhandledrejection` instead.",
    },
    {
      id: "d3-23", domain: "d3", lesson: "d3-errors", level: "junior",
      prompt: "What does this print?",
      code: `class ValidationError extends Error {
  constructor(msg) { super(msg); this.name = "ValidationError"; }
}
try { throw new ValidationError("bad email"); }
catch (e) { console.log(e instanceof Error, e.name, e.message); }`, codeLang: "js",
      options: ["`true ValidationError bad email`", "`false ValidationError bad email`", "`true Error bad email`", "`true ValidationError undefined`"],
      answer: [0],
      explanation: "Subclassing Error keeps instanceof Error and the stack trace. `super(msg)` sets message; setting name makes logs and checks clearer.",
    },
    {
      id: "d3-27", domain: "d3", lesson: "d3-errors", level: "staff",
      prompt: "A Node.js service crashes in production with an unhandled promise rejection from a fire-and-forget call. What's the best long-term approach?",
      options: [
        "Give every fire-and-forget promise its own handler, lint for floating promises, and keep a process-level `unhandledRejection` hook only to log and exit cleanly",
        "Add `process.on(\"unhandledRejection\", () => {})` so the process never crashes",
        "Wrap the whole server in one big try/catch",
        "Downgrade Node.js to a version that only warns",
      ],
      answer: [0],
      explanation: "Since Node.js 15, unhandled rejections crash the process by default, which is good: state may be inconsistent. Fix the source, enforce it with tooling, and keep the global hook as a last line of defence, not a silencer.",
    },
  ],

  cards: [
    { id: "c3-all", domain: "d3", kind: "service", term: "Promise.all", definition: "Fulfils with all values in input order; rejects on the first rejection." },
    { id: "c3-allsettled", domain: "d3", kind: "service", term: "Promise.allSettled", definition: "Waits for every promise and never rejects; returns status objects." },
    { id: "c3-race", domain: "d3", kind: "service", term: "Promise.race", definition: "Settles the same way as the first promise to settle. Handy for timeouts." },
    { id: "c3-any", domain: "d3", kind: "service", term: "Promise.any", definition: "Fulfils with the first fulfilment; AggregateError if all reject." },
    { id: "c3-qm", domain: "d3", kind: "service", term: "queueMicrotask", definition: "Queues a callback in the microtask queue, like a promise reaction without a promise." },
    { id: "c3-timeout", domain: "d3", kind: "service", term: "setTimeout", definition: "Schedules a macrotask after at least the given delay. 0 ms still waits for the stack and microtasks." },
    { id: "c3-abort", domain: "d3", kind: "service", term: "AbortController", definition: "Creates a signal you can abort to cancel fetch requests, listeners, and other async work." },
    { id: "c3-loop", domain: "d3", kind: "concept", term: "Event loop", definition: "Runs one task, drains all microtasks, maybe renders, then takes the next task." },
    { id: "c3-micro", domain: "d3", kind: "concept", term: "Microtask", definition: "Promise reactions, await continuations, queueMicrotask. All run before the next macrotask." },
    { id: "c3-macro", domain: "d3", kind: "concept", term: "Macrotask", definition: "A task such as a timer callback, I/O completion, or UI event. One per loop turn." },
    { id: "c3-async", domain: "d3", kind: "concept", term: "async function", definition: "Runs synchronously until the first await and always returns a promise." },
    { id: "c3-returnawait", domain: "d3", kind: "concept", term: "return await", definition: "Inside try/catch, makes the promise settle within the try so the catch can handle a rejection." },
  ],

  challenges: [
    {
      id: "ch-js-loop-async",
      domain: "d3",
      lesson: "d3-loop",
      title: "await joins the queue",
      goal: "Predict the exact console order for the snippet with setTimeout, queueMicrotask, and an async function.",
      hint: "An async function runs synchronously until await. What follows the await is a microtask.",
      takeaway: "Sync code first, then microtasks in the order they were queued, then timers.",
      render: (onSolved) => <EventLoopLab goal="async" onSolved={onSolved} />,
    },
    {
      id: "ch-js-loop-nested",
      domain: "d3",
      lesson: "d3-loop",
      title: "Queues inside queues",
      goal: "Predict the console order when a promise callback schedules a new timer.",
      hint: "A chained .then is queued only once the previous one finishes, but it's still a microtask.",
      takeaway: "Microtasks added while draining still run before any timer, and new timers wait behind older ones.",
      render: (onSolved) => <EventLoopLab goal="nested" onSolved={onSolved} />,
    },
  ],
});
