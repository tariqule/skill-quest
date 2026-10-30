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
    summary: "How JavaScript handles work that takes time, like timers and network calls: the event loop, promises, async and await, and what happens when something fails.",
  },

  tasks: [
    { id: "3.1", title: "The event loop", covers: ["Call stack, task queue, microtask queue", "setTimeout vs promises vs queueMicrotask", "Blocking the loop and starvation"] },
    { id: "3.2", title: "Promises", covers: ["Promise states and the executor", "then/catch/finally chains and return values", "Promise.all, allSettled, race, any"] },
    { id: "3.3", title: "async/await and error handling", covers: ["How async functions run and what they return", "Sequential vs parallel awaits", "try/catch/finally, return await, unhandled rejections", "Error types and custom errors"] },
  ],

  lessons: [
    // ── Start here ──
    {
      id: "d3-b-waiting",
      level: "beginner",
      check: ["js-b3-01", "js-b3-02"],
      task: "3.1",
      title: "Why some code has to wait",
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#38bdf8"
            steps={[
              { icon: "🧾", label: "Take the order", sub: "Start the slow job" },
              { icon: "🍳", label: "Serve other tables", sub: "Other code keeps running" },
              { icon: "🔔", label: "Food is ready", sub: "Your callback runs" },
            ]}
          />
          <CodeBlock
            lang="js"
            code={`console.log("order placed");
setTimeout(() => console.log("food ready"), 1000);
console.log("serving other tables");`}
          />
        </div>
      ),
      points: [
        "Some jobs take time, like waiting for a timer or for data from a server. JavaScript doesn't stand still while it waits.",
        "Think of a waiter. They take your order to the kitchen, then serve other tables instead of standing at the kitchen door.",
        "`setTimeout(fn, ms)` says \"run `fn` later, after at least `ms` milliseconds\". There are 1000 milliseconds in a second.",
        "Code that runs later like this is called asynchronous, or async for short.",
      ],
      tip: "Async code doesn't run in the order you read it. Lines after `setTimeout` usually run before the delayed function does.",
    },
    {
      id: "d3-b-promises",
      level: "beginner",
      check: ["js-b3-03", "js-b3-04"],
      task: "3.2",
      title: "Promises: a ticket for a future result",
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "⏳", title: "Pending", text: "Still waiting for the result", color: "#fbbf24" },
            { icon: "✅", title: "Fulfilled", text: "It worked, and here's the value", color: "#34d399" },
            { icon: "❌", title: "Rejected", text: "Something went wrong, and here's why", color: "#f87171" },
          ]}
        />
      ),
      points: [
        "A promise is an object that stands for a result you don't have yet, like the buzzer a café hands you while your coffee is made.",
        "It starts pending. Later it becomes fulfilled with a value, or rejected with an error. It only settles once.",
        "`.then(fn)` says what to do with the value when it arrives. `.catch(fn)` says what to do if it fails.",
      ],
      tip: "Lots of built-in tools hand you a promise. `fetch`, which downloads data from a web address, is the one you'll use most.",
    },
    {
      id: "d3-b-await",
      level: "beginner",
      check: ["js-b3-05", "js-b3-06"],
      task: "3.3",
      title: "async and await: waiting that reads top to bottom",
      visual: (
        <CodeCompare
          lang="js"
          left={{ title: "With then", code: `getNumber().then((n) => {
  console.log(n + 1);
});` }}
          right={{ title: "With await", code: `async function main() {
  const n = await getNumber();
  console.log(n + 1);
}` }}
        />
      ),
      points: [
        "`await` pauses a function until a promise settles, then gives you its value. The code reads top to bottom, like normal code.",
        "You can only use `await` inside a function marked `async`, or at the top level of a module.",
        "While one function is paused, the rest of your program keeps running. Nothing freezes.",
        "If the promise is rejected, `await` throws the error, so you can handle it with `try` and `catch`.",
      ],
      tip: "Most modern code uses `async` and `await` rather than long `.then` chains, because it's easier to read and debug.",
    },
    // ── Junior and up ──
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
              { icon: "📜", label: "Run one task", sub: "The script, a timer callback or an event" },
              { icon: "⚡", label: "Drain microtasks", sub: "Every promise reaction, even ones added along the way" },
              { icon: "🎨", label: "Render", sub: "Browsers may paint here" },
              { icon: "📥", label: "Next task", sub: "Oldest ready macrotask" },
            ]}
          />
          <EventLoopLab />
        </div>
      ),
      points: [
        "JavaScript runs one thing at a time, on a single call stack. Once a function starts, nothing interrupts it until it finishes.",
        "Microtasks are small follow-up jobs: promise callbacks, the code after an `await`, and `queueMicrotask`. All of them run before the next macrotask.",
        "Macrotasks, or tasks, are bigger jobs: timer callbacks, finished I/O and UI events. `setTimeout(fn, 0)` means \"as a new task, after at least 0 ms\", not \"right now\".",
        "Long synchronous work, or an endless chain of microtasks, blocks timers, input and drawing the page.",
      ],
      tip: "Talk through the queues out loud: \"the synchronous logs come first, then the microtask queue empties, then one timer runs\". It shows you understand the model rather than memorised an answer.",
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
              { icon: "🤝", title: "Promise.all", text: "Every value, in the order you passed them. Rejects on the first failure.", color: "#38bdf8" },
              { icon: "📋", title: "allSettled", text: "Waits for all of them and never rejects. You get a status for each one.", color: "#34d399" },
              { icon: "🏁", title: "race", text: "Settles the same way as whichever one finishes first, success or failure.", color: "#fbbf24" },
              { icon: "🍀", title: "any", text: "The first success. AggregateError only if every one fails.", color: "#f472b6" },
            ]}
          />
          <CodeBlock
            lang="js"
            code={`new Promise((resolve) => {
  console.log("executor runs NOW");   // synchronous
  resolve(1);
})
  .then((x) => x + 1)                 // the return value goes to the next then
  .then((x) => { throw new Error(x) })// a throw skips ahead to catch
  .catch((e) => "recovered")          // returning from catch fixes the chain
  .finally(() => console.log("cleanup"));`}
          />
        </div>
      ),
      points: [
        "A promise starts pending and then settles once, as fulfilled or rejected. The function you pass to `new Promise`, the executor, runs straight away.",
        "Each `then` returns a new promise holding whatever its callback returned. If you forget to `return`, the next step gets `undefined`.",
        "A thrown error or a rejection skips ahead to the next `catch`. Returning a value from `catch` puts the chain back on track.",
        "`finally` runs whether things worked or not, and passes the original result on unchanged.",
      ],
      tip: "Be ready to write `Promise.all` by hand: count the results as they arrive, store each one at its index, and reject on the first error.",
    },
    {
      id: "d3-async",
      level: "intermediate",
      check: ["d3-04", "d3-12"],
      task: "3.3",
      title: "async and await: one after another, or all at once",
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
        "An `async` function runs straight through until its first `await`. At that point it hands a promise back to whoever called it.",
        "Everything after an `await` carries on later as a microtask, even if the value was already there.",
        "Two `await`s in a row run one after the other. If they don't depend on each other, start both first and then `await Promise.all`.",
        "`forEach` ignores the promises its callback returns. Use `for...of` with `await` to go one at a time, or `Promise.all(items.map(...))` to run them together.",
      ],
      tip: "When you see two `await`s in a row in an interview snippet, ask \"does B need the result of A?\" If not, run them in parallel.",
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
        "`try`/`catch` only catches errors thrown while the `try` block is running. An error thrown later, inside a timer callback, gets past it.",
        "Inside `try`, write `return await` so that a rejection is thrown while you're still inside the `try` block.",
        "`finally` always runs. A `return` inside `finally` replaces whatever `try` or `catch` returned, so avoid it.",
        "Every promise needs something to handle its failure. Since Node.js 15, an unhandled rejection crashes the process by default.",
      ],
      tip: "Know the built-in error types, `TypeError`, `ReferenceError`, `SyntaxError` and `RangeError`, and say when you'd make your own subclass of `Error`.",
    },
  ],

  questions: [
    // ── Beginner ──
    {
      id: "js-b3-01", domain: "d3", lesson: "d3-b-waiting", level: "beginner", type: "output",
      prompt: "Type what this prints, one line per log.",
      code: `console.log("first");
setTimeout(() => console.log("later"), 1000);
console.log("second");`, codeLang: "js",
      answers: ["first\nsecond\nlater"],
      explanation: "`setTimeout` doesn't pause the program. It schedules the function and moves straight on, so \"second\" prints right away. About a second later, the timer fires and \"later\" prints.",
    },
    {
      id: "js-b3-02", domain: "d3", lesson: "d3-b-waiting", level: "beginner", type: "fill",
      prompt: "Fill the gap so the message appears after about one second.",
      code: `setTimeout(() => console.log("hi"), {{1}});`, codeLang: "js",
      blanks: [{ options: ["1000", "1", "60", "0.001"], answer: 0 }],
      explanation: "`setTimeout` measures time in milliseconds, and one second is 1000 milliseconds. Writing `1` would wait just one millisecond, which is barely any time at all.",
    },
    {
      id: "js-b3-03", domain: "d3", lesson: "d3-b-promises", level: "beginner", type: "output",
      prompt: "Type what this prints.",
      code: `Promise.resolve(5).then((n) => console.log(n * 2));`, codeLang: "js",
      answers: ["10"],
      explanation: "`Promise.resolve(5)` makes a promise that's already fulfilled with 5. `.then` receives that 5 as `n`, and the callback prints `n * 2`, which is 10.",
    },
    {
      id: "js-b3-04", domain: "d3", lesson: "d3-b-promises", level: "beginner",
      prompt: "What is a promise in JavaScript?",
      options: [
        "An object that stands for a result that will arrive later, or an error if it fails",
        "A rule that says a variable can never change once it's been given its very first value",
        "A comment that explains your code",
        "A function that always runs instantly",
      ],
      answer: [0],
      explanation: "A promise is a placeholder for a future result. It starts pending, then either fulfils with a value or rejects with an error, and `.then` or `await` lets you use the value once it's there.",
    },
    {
      id: "js-b3-05", domain: "d3", lesson: "d3-b-await", level: "beginner", type: "output",
      prompt: "Type what this prints.",
      code: `async function main() {
  const n = await Promise.resolve(2);
  console.log(n + 1);
}
main();`, codeLang: "js",
      answers: ["3"],
      explanation: "`await` waits for the promise and gives back its value, 2. Then the next line runs as normal and prints `2 + 1`, which is 3.",
    },
    {
      id: "js-b3-06", domain: "d3", lesson: "d3-b-await", level: "beginner",
      prompt: "What does `await` do?",
      options: [
        "It pauses the async function until the promise settles, then gives you the result",
        "It freezes the whole browser tab until the promise is finally finished",
        "It makes the code run faster",
        "It cancels the promise",
      ],
      answer: [0],
      explanation: "`await` only pauses the function it's in. The rest of the page or program keeps working, and the function carries on with the result once the promise settles.",
    },
    // ── Event loop ──
    {
      id: "d3-01", domain: "d3", lesson: "d3-loop", level: "intermediate", type: "order",
      prompt: "Put the console output in order.",
      code: `console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");`, codeLang: "js",
      items: ["`A`", "`D`", "`C`", "`B`"],
      explanation: "The synchronous logs run first, so A and then D. Next the microtask queue empties, which runs the promise callback C. Only after that does the timer's task run and print B.",
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
      explanation: "4 is synchronous, so it prints first. `queueMicrotask` and the promise callback are both microtasks, and they run in the order they were queued: 2, then 3. The timer is a macrotask, so 1 comes last.",
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
      explanation: "The microtask runs first and prints p1. It schedules t2 behind t1 and queues a new microtask, p2. The microtask queue has to be empty before any timer runs, so p2 prints before t1 and t2.",
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
      explanation: "After each macrotask, the microtask queue is emptied. So the microtask b runs straight after a's timer, before the next timer, c. Browsers and Node.js 11 and later agree on this.",
    },
    {
      id: "d3-19", domain: "d3", lesson: "d3-loop", level: "intermediate", type: "order",
      prompt: "Order one turn of the browser event loop.",
      items: ["Run the current task, such as the script, to completion", "Drain the microtask queue completely", "Render the page if needed", "Take the next task from a task queue"],
      explanation: "One task, then every microtask, then maybe a render, then the next task. That's why promise callbacks can delay painting the page but can never interrupt code that's already running.",
    },
    {
      id: "d3-20", domain: "d3", lesson: "d3-loop", level: "junior",
      prompt: "Which callbacks run as microtasks? (Choose two.)",
      options: ["A promise's `.then` callback", "A `queueMicrotask` callback", "A `setTimeout(fn, 0)` callback", "A `click` event listener", "A `setInterval` callback"],
      answer: [0, 1],
      explanation: "Promise callbacks (`then`, `catch`, `finally` and the code after `await`) and `queueMicrotask` are microtasks. Timers and UI events are tasks, also called macrotasks.",
    },
    {
      id: "d3-22", domain: "d3", lesson: "d3-loop", level: "senior",
      prompt: "A function queues a microtask that queues another microtask, forever. What happens to a `setTimeout(cb, 0)` that was scheduled before it started?",
      options: [
        "It never runs: the microtask queue never empties, so the loop never reaches the next task",
        "It runs after about 4 ms, because timers can interrupt the running microtasks",
        "It runs on a separate thread",
        "The engine drops the microtasks after 1,000 iterations",
      ],
      answer: [0],
      explanation: "The loop only picks up the next task once the microtask queue is empty. Endless microtasks starve timers, I/O, input and rendering, so the page or process hangs.",
    },
    {
      id: "d3-28", domain: "d3", lesson: "d3-loop", level: "staff",
      prompt: "A Node.js API parses a 200 MB CSV synchronously in one endpoint, and p99 latency spikes for every other endpoint while it runs. What's the best fix?",
      options: [
        "Move the parsing off the main thread (a worker thread or a separate job), or stream and parse it in chunks",
        "Wrap the parsing in an async function",
        "Wrap it in `Promise.resolve().then(...)`",
        "Add more `setTimeout(fn, 0)` calls before the parse, so the event loop gets a chance to run other requests first",
      ],
      answer: [0],
      explanation: "Async doesn't mean parallel. A long synchronous job still blocks the single event loop, whether it runs in a task or a microtask. Move CPU-heavy work somewhere else, or break it into small chunks so other work can run in between.",
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
      explanation: "The executor runs straight away inside `new Promise`. The `then` callback is a microtask, so \"done\" prints after the synchronous \"end\".",
    },
    {
      id: "d3-07", domain: "d3", lesson: "d3-promises", level: "junior",
      prompt: "You pass three promises to `Promise.all`. The second one rejects after 1 s; the others fulfil after 3 s. What happens?",
      options: [
        "The returned promise rejects after about 1 s with the second promise's reason",
        "It waits 3 s, then rejects with all the errors",
        "It fulfils after 3 s with `[value, undefined, value]`",
        "It fulfils after 3 s with only the two successful values in the array",
      ],
      answer: [0],
      explanation: "`Promise.all` gives up as soon as one promise rejects. The other promises keep running, but their results are ignored. Use `allSettled` if you need every outcome.",
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
      explanation: "`all` gives you everything or fails fast. `allSettled` gives a report on every result. `race` takes whichever finishes first, either way, which is handy for timeouts. `any` takes the first success, and throws an `AggregateError` if there's none.",
    },
    {
      id: "d3-09", domain: "d3", lesson: "d3-promises", level: "intermediate", type: "lines",
      prompt: "This logs `undefined` instead of `20`. Which line is the bug?",
      code: `Promise.resolve(1)
  .then((x) => x + 1)
  .then((x) => { x * 10; })
  .then((x) => console.log(x));`, codeLang: "js",
      answer: [3],
      explanation: "An arrow function with curly braces needs an explicit `return`. Line 3 works out 20 and throws it away, so the next `then` gets `undefined`. Write `(x) => x * 10` instead.",
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
      explanation: "`catch` handles the rejection and returns \"boom\", which puts the chain back into a fulfilled state. The next `then` receives \"boom\", and `finally` runs at the end.",
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
      explanation: "`allSettled` never rejects. Each entry is `{ status: \"fulfilled\", value }` or `{ status: \"rejected\", reason }`, in the same order you passed them in.",
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
      explanation: "`Promise.all` keeps its results in the order you passed the promises in, however they finish. The `done` array records the finishing order instead: b after 10 ms, then a.",
    },
    {
      id: "d3-25", domain: "d3", lesson: "d3-promises", level: "staff",
      prompt: "A nightly job must call an API for 10,000 user IDs. The API allows at most 20 concurrent requests, and some calls fail. What's the best approach?",
      options: [
        "A worker pool: keep at most 20 requests in flight, start the next as each settles, and record failures per ID for retry",
        "`Promise.all(ids.map(callApi))`",
        "A `for...of` loop with `await`, one request at a time",
        "Fire every request with `setTimeout` staggered 50 ms apart, so only about 20 are in flight at any time, and rerun the whole batch if any one fails",
      ],
      answer: [0],
      explanation: "`Promise.all` over 10,000 calls breaks the limit and gives up on the first error. One at a time is 20 times slower than you're allowed. Staggering is guesswork, because slow replies still pile up. A pool of at most 20 respects the limit and stays fast.",
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
      explanation: "An `async` function runs straight through until its first `await`, so 1 prints. `await null` pauses it and schedules the rest as a microtask. The caller carries on and prints 3, and then the function resumes and prints 2.",
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
      explanation: "`forEach` ignores the promises its async callback returns, so nothing waits for them. Use `for (const item of items) await save(item)` or `await Promise.all(items.map(save))`.",
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
      explanation: "Each `await` waits before the next call even starts. Network waits happen outside the JavaScript thread, so starting both first lets them overlap, even with a single thread.",
    },
    {
      id: "d3-21", domain: "d3", lesson: "d3-async", level: "junior",
      prompt: "What does this print?",
      code: `async function f() { return 5; }
console.log(typeof f(), f() instanceof Promise);`, codeLang: "js",
      options: ["`object true`", "`number false`", "`promise true`", "`function false`"],
      answer: [0],
      explanation: "An `async` function always returns a promise, even when you return a plain value. Promises are objects, so `typeof` gives \"object\".",
    },
    {
      id: "d3-26", domain: "d3", lesson: "d3-async", level: "staff",
      prompt: "In a search box, each keystroke fires a request. Slow responses for old queries sometimes arrive last and overwrite the newest results. What's the best fix?",
      options: [
        "Abort the previous request with an `AbortController` when a new one starts, and ignore responses for outdated queries",
        "Await each request before allowing the next keystroke, so that the input is disabled until every response has come back",
        "Add a random delay to each request",
        "Cache every response forever",
      ],
      answer: [0],
      explanation: "Responses can arrive in any order. Cancelling with `fetch(url, { signal })` saves work, and checking that a response matches the latest query keeps the results correct. Debouncing helps too, but on its own it doesn't fix the ordering.",
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
      explanation: "Returning the promise ends the `try` block before the promise settles, so the rejection goes to the caller instead of the `catch`. `return await fetchData()` makes it settle inside the `try`.",
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
        "Nothing prints at all, because the error is thrown first",
      ],
      answer: [0],
      explanation: "The `try` block only schedules the timer, then finishes. When the callback throws later, it's running in a different task, and this `try`/`catch` is long gone. Put the `try`/`catch` inside the callback instead.",
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
      explanation: "The return value is worked out first, then `finally` runs before the function actually returns. So \"finally\" is logged inside `f`, and then the caller logs \"try\".",
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
      explanation: "A `return` inside `finally` replaces any return or throw from `try` or `catch`. That can quietly swallow errors, which is why linters flag it with the rule `no-unsafe-finally`.",
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
      explanation: "A `TypeError` means the wrong kind of value. A `ReferenceError` means a name that doesn't exist, or one still in its temporal dead zone. A `SyntaxError` means invalid source text, JSON included. A `RangeError` means a number outside the allowed range.",
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
      explanation: "Either `await` it inside `try`/`catch`, or attach `.catch`. Without `await`, the `try` block finishes before the promise rejects. `window.onerror` only sees uncaught exceptions. Promise rejections go to the `unhandledrejection` event instead.",
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
      explanation: "Extending `Error` keeps `instanceof Error` working and keeps the stack trace. `super(msg)` sets the message, and setting `name` makes logs and checks clearer.",
    },
    {
      id: "d3-27", domain: "d3", lesson: "d3-errors", level: "staff",
      prompt: "A Node.js service crashes in production with an unhandled promise rejection from a fire-and-forget call. What's the best long-term approach?",
      options: [
        "Give every fire-and-forget promise its own handler, lint for floating promises, and keep a process-level `unhandledRejection` hook only to log and exit cleanly",
        "Add `process.on(\"unhandledRejection\", () => {})` so the process never crashes, and wrap the whole server in a single top-level try/catch to log anything that slips through",
        "Wrap the whole server in one big try/catch",
        "Downgrade Node.js to a version that only warns",
      ],
      answer: [0],
      explanation: "Since Node.js 15, an unhandled rejection crashes the process by default. That's a good thing, because state may be broken. Fix the source, enforce it with tooling, and keep the global hook as a last line of defence, not a way to hide errors.",
    },
  ],

  cards: [
    { id: "c3-all", domain: "d3", kind: "service", term: "Promise.all", definition: "Fulfils with every value, in the order you passed them. Rejects on the first rejection." },
    { id: "c3-allsettled", domain: "d3", kind: "service", term: "Promise.allSettled", definition: "Waits for every promise and never rejects. You get a status object for each one." },
    { id: "c3-race", domain: "d3", kind: "service", term: "Promise.race", definition: "Settles the same way as the first promise to settle. Handy for timeouts." },
    { id: "c3-any", domain: "d3", kind: "service", term: "Promise.any", definition: "Fulfils with the first success. Rejects with an `AggregateError` only if all of them reject." },
    { id: "c3-qm", domain: "d3", kind: "service", term: "queueMicrotask", definition: "Adds a callback to the microtask queue, like a promise callback without needing a promise." },
    { id: "c3-timeout", domain: "d3", kind: "service", term: "setTimeout", definition: "Schedules a task to run after at least the given delay. Even 0 ms still waits for the current code and all microtasks to finish." },
    { id: "c3-abort", domain: "d3", kind: "service", term: "AbortController", definition: "Gives you a signal you can abort to cancel fetch requests, event listeners and other async work." },
    { id: "c3-loop", domain: "d3", kind: "concept", term: "Event loop", definition: "Runs one task, empties the microtask queue, maybe draws the page, then picks up the next task." },
    { id: "c3-micro", domain: "d3", kind: "concept", term: "Microtask", definition: "A small follow-up job: a promise callback, the code after an `await`, or `queueMicrotask`. They all run before the next macrotask." },
    { id: "c3-macro", domain: "d3", kind: "concept", term: "Macrotask", definition: "A task such as a timer callback, a finished I/O operation or a UI event. The loop runs one per turn." },
    { id: "c3-async", domain: "d3", kind: "concept", term: "async function", definition: "Runs straight through until its first `await`, and always returns a promise." },
    { id: "c3-returnawait", domain: "d3", kind: "concept", term: "return await", definition: "Inside `try`/`catch`, it makes the promise settle within the `try`, so the `catch` can handle a rejection." },
  ],

  challenges: [
    {
      id: "ch-js-loop-async",
      domain: "d3",
      lesson: "d3-loop",
      title: "await joins the queue",
      goal: "Predict the exact console order for the snippet with setTimeout, queueMicrotask, and an async function.",
      hint: "An async function runs straight through until await. Whatever comes after the await is a microtask.",
      takeaway: "Synchronous code runs first, then microtasks in the order they were queued, then timers.",
      render: (onSolved) => <EventLoopLab goal="async" onSolved={onSolved} />,
    },
    {
      id: "ch-js-loop-nested",
      domain: "d3",
      lesson: "d3-loop",
      title: "Queues inside queues",
      goal: "Predict the console order when a promise callback schedules a new timer.",
      hint: "A chained .then is only queued once the one before it finishes, but it's still a microtask.",
      takeaway: "Microtasks added while draining still run before any timer, and new timers wait behind older ones.",
      render: (onSolved) => <EventLoopLab goal="nested" onSolved={onSolved} />,
    },
  ],
});
