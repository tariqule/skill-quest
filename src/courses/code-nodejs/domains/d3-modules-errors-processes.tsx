import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { js } from "../js";

/** Module 3: CommonJS vs ESM, error handling across callbacks and promises, unhandled rejections, and worker threads vs cluster vs child processes. */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Modules, Errors & Processes",
    world: "The Module Mines",
    weight: 25,
    emoji: "⛏️",
    color: "#a78bfa",
    summary: "CommonJS vs ES modules, error handling with callbacks and promises, unhandled rejections, and when to reach for worker threads, cluster, or child processes.",
  },

  tasks: [
    { id: "3.1", title: "CommonJS and ES modules", covers: ["require vs import", "module.exports vs exports", "Module caching and circular dependencies", "Live bindings", "type: module, .mjs, .cjs"] },
    { id: "3.2", title: "Error handling", covers: ["Error-first callbacks", "try/catch with async/await", "Promise.all vs allSettled", "unhandledRejection and uncaughtException"] },
    { id: "3.3", title: "Worker threads, cluster, and child processes", covers: ["CPU-bound work in worker_threads", "Scaling HTTP across cores with cluster", "spawn, exec, execFile, fork"] },
  ],

  lessons: [
    {
      id: "d3-modules",
      level: "junior",
      task: "3.1",
      title: "CommonJS vs ES modules",
      check: ["d3-06", "d3-01"],
      visual: (
        <CodeCompare
          lang="js"
          left={{
            title: "CommonJS (.cjs, or .js by default)",
            code: js`
              const fs = require('node:fs');
              const { add } = require('./math');

              module.exports = { run };
              // __dirname, __filename available
              // require() is synchronous and cached
            `,
          }}
          right={{
            title: "ES modules (.mjs, or type: module)",
            code: js`
              import fs from 'node:fs';
              import { add } from './math.js';

              export function run() {}
              // import.meta.url instead of __dirname
              // static imports, top-level await allowed
            `,
          }}
        />
      ),
      points: [
        "For .js files, the nearest package.json \"type\" field decides: \"module\" means ESM, otherwise CommonJS. .mjs is always ESM and .cjs always CommonJS.",
        "require() loads synchronously, runs the module once, and caches module.exports. Every later require gets the same object.",
        "Reassigning exports (exports = {...}) breaks the link to module.exports, so nothing is exported.",
        "ESM imports are static, hoisted, and live bindings. ESM can use top-level await and dynamic import().",
        "Recent Node releases can also require() an ES module, as long as it doesn't use top-level await.",
      ],
      tip: "Mention the dual-package hazard if asked about publishing libraries: two copies of the same package (CJS and ESM) can mean two copies of its state.",
    },
    {
      id: "d3-errors",
      level: "intermediate",
      task: "3.2",
      title: "Handling errors: callbacks and promises",
      check: ["d3-09", "d3-10"],
      visual: (
        <div className="grid gap-4">
          <CodeCompare
            lang="js"
            left={{
              title: "Error-first callback",
              code: js`
                fs.readFile('cfg.json', (err, data) => {
                  if (err) return handle(err);
                  use(data);
                });
              `,
            }}
            right={{
              title: "async / await",
              code: js`
                try {
                  const data = await fs.promises.readFile('cfg.json');
                  use(data);
                } catch (err) {
                  handle(err);
                }
              `,
            }}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "⚡", title: "Promise.all", text: "Rejects as soon as any input rejects. The others keep running.", color: "#a78bfa" },
              { icon: "📋", title: "Promise.allSettled", text: "Waits for all and reports each one as fulfilled or rejected.", color: "#a78bfa" },
              { icon: "🏁", title: "Promise.any / race", text: "First success / first to settle.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Callbacks use the error-first convention: (err, result). Always check err and return early.",
        "try/catch only catches errors thrown synchronously or by an awaited promise. It can't catch a throw inside a later callback.",
        "return await inside try is needed if you want that try's catch to handle the rejection.",
        "forEach doesn't wait for async callbacks. Use for...of with await (sequential) or Promise.all with map (parallel).",
      ],
      tip: "When you see a promise created but not awaited or returned, call it out as a floating promise. Linters (no-floating-promises) catch these.",
    },
    {
      id: "d3-unhandled",
      level: "senior",
      task: "3.2",
      title: "Unhandled rejections and crashes",
      check: ["d3-15", "d3-16"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "💥", label: "Promise rejects", sub: "No .catch, no await in a try" },
              { icon: "📣", label: "'unhandledRejection'", sub: "Emitted on process if you listen for it" },
              { icon: "🧨", label: "Thrown as uncaught", sub: "Default since Node 15 (--unhandled-rejections=throw)" },
              { icon: "🚪", label: "Process exits (code 1)", sub: "Your process manager restarts it" },
            ]}
          />
          <CodeBlock
            lang="js"
            code={js`
              process.on('uncaughtException', (err) => {
                logger.fatal(err);      // log with context
                process.exitCode = 1;   // then exit; state may be corrupt
                server.close(() => process.exit());
              });
            `}
          />
        </div>
      ),
      points: [
        "Since Node 15, an unhandled promise rejection crashes the process by default, like an uncaught exception.",
        "uncaughtException is a last-resort hook: log, clean up, and exit. Resuming normal work after it is unsafe.",
        "Fail fast and let a supervisor (systemd, Kubernetes, PM2) restart the process; don't silence crashes.",
      ],
      tip: "If an interviewer asks \"how do you stop crashes?\", talk about fixing the source (await, .catch, lint rules), not swallowing errors in a global handler.",
    },
    {
      id: "d3-scaling",
      level: "senior",
      task: "3.3",
      title: "Worker threads vs cluster vs child processes",
      check: ["d3-21", "d3-19"],
      visual: (
        <Tiles
          cols={3}
          tiles={[
            {
              icon: "🧵",
              title: "worker_threads",
              text: "Threads in the same process, each with its own V8 isolate and event loop. For CPU-heavy JS. Talk via postMessage or SharedArrayBuffer.",
              color: "#a78bfa",
            },
            { icon: "🐑", title: "cluster", text: "Forks several Node processes that share one server port. Scales a stateless HTTP server across cores.", color: "#38bdf8" },
            {
              icon: "👶",
              title: "child_process",
              text: "Runs another program: spawn (streams), exec (shell, buffered), execFile (no shell), fork (Node + IPC).",
              color: "#f59e0b",
            },
          ]}
        />
      ),
      points: [
        "Worker threads are for CPU-bound JavaScript. They don't help with I/O, which is already non-blocking.",
        "Creating a worker is expensive; keep a pool of them and send them jobs.",
        "cluster (or simply more instances behind a load balancer) scales request throughput. Processes share nothing, so keep state in a database or cache.",
        "Prefer spawn or execFile over exec with user input: exec runs a shell, which enables command injection.",
      ],
      tip: "Answer with a decision rule: CPU in-process → worker_threads; more HTTP throughput → more processes; another program → child_process.",
    },
  ],

  questions: [
    {
      id: "d3-01",
      domain: "d3",
      level: "junior",
      lesson: "d3-modules",
      prompt: "What does `main.js` print?",
      code: js`
        // counter.js
        let count = 0;
        module.exports = { inc: () => ++count };

        // main.js
        const a = require('./counter');
        const b = require('./counter');
        a.inc();
        a.inc();
        console.log(b.inc());
      `,
      codeLang: "js",
      options: ["3", "1", "2", "TypeError: b.inc is not a function"],
      answer: [0],
      explanation: "`require` runs a module once and caches its `module.exports`. `a` and `b` are the same object sharing one `count`, so the third call returns 3.",
    },
    {
      id: "d3-02",
      domain: "d3",
      level: "junior",
      lesson: "d3-modules",
      type: "lines",
      prompt: "Running `main.js` throws `TypeError: math.add is not a function`. Tap the line that causes it.",
      code: js`
        // math.js
        function add(a, b) { return a + b; }
        exports = { add };

        // main.js
        const math = require('./math');
        console.log(math.add(1, 2));
      `,
      codeLang: "js",
      answer: [3],
      explanation:
        "`exports` is just a local variable pointing at `module.exports`. Reassigning it points the variable somewhere else, and `require` still returns the original empty `module.exports`. Use `module.exports = { add }` or `exports.add = add`.",
    },
    {
      id: "d3-03",
      domain: "d3",
      level: "senior",
      lesson: "d3-modules",
      prompt: "What does `main.mjs` print?",
      code: js`
        // counter.mjs
        export let count = 0;
        export function inc() { count++; }

        // main.mjs
        import { count, inc } from './counter.mjs';
        inc();
        console.log(count);
      `,
      codeLang: "js",
      options: ["1", "0", "undefined", "TypeError: Assignment to constant variable."],
      answer: [0],
      explanation:
        "ESM imports are live bindings to the exporting module's variables, not copies. After `inc()` the imported `count` reads 1. (The importer can't assign to `count`, but the exporter can.)",
    },
    {
      id: "d3-04",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-modules",
      prompt: "What does `main.js` print?",
      code: js`
        // counter.js
        let count = 0;
        module.exports = { count, inc() { count++; } };

        // main.js
        const c = require('./counter');
        c.inc();
        console.log(c.count);
      `,
      codeLang: "js",
      options: ["0", "1", "undefined", "NaN"],
      answer: [0],
      explanation:
        "`{ count }` copies the value 0 into a property when the object is created. `inc` changes the local variable, not the property. Export a getter or a function like `getCount()` if callers need the current value.",
    },
    {
      id: "d3-05",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-modules",
      type: "match",
      prompt: "Match each module feature to what it gives you.",
      pairs: [
        ["`__dirname`", "Folder of the current CommonJS file"],
        ["`import.meta.url`", "The file: URL of the current ES module"],
        ["`require.cache`", "Every CommonJS module loaded so far"],
        ["`import()`", "Loads a module asynchronously, returning a promise"],
      ],
      explanation:
        "ESM has no `__dirname`; derive paths from `import.meta.url` (or `import.meta.dirname` in recent Node). Dynamic `import()` works from both module systems.",
    },
    {
      id: "d3-06",
      domain: "d3",
      level: "junior",
      lesson: "d3-modules",
      prompt: "What tells Node to treat `app.js` as an ES module?",
      options: [
        "The nearest `package.json` has `\"type\": \"module\"`",
        "The file contains `'use strict'` at the top",
        "The file is in a folder called `esm`",
        "Node always treats `.js` files as ES modules",
      ],
      answer: [0],
      explanation: "For `.js` files, the nearest package.json `type` field decides. `.mjs` files are always ESM and `.cjs` files are always CommonJS, whatever `type` says.",
    },
    {
      id: "d3-07",
      domain: "d3",
      level: "senior",
      lesson: "d3-modules",
      prompt: "Which are real differences between ES modules and CommonJS? (Choose two.)",
      options: [
        "ESM imports are static, so tools can analyse the module graph before running it",
        "ESM allows top-level `await`",
        "`require()` loads modules asynchronously",
        "ESM provides `__dirname` by default",
        "ESM named imports are copies of the exported values",
      ],
      answer: [0, 1],
      explanation:
        "Static imports enable tree-shaking and early errors, and ESM supports top-level await. `require` is synchronous, ESM has no `__dirname` global, and ESM imports are live bindings rather than copies.",
    },
    {
      id: "d3-08",
      domain: "d3",
      level: "senior",
      lesson: "d3-modules",
      prompt: "Running `node a.js`, what is printed?",
      code: js`
        // a.js
        const b = require('./b');
        exports.name = 'a';
        console.log('a sees', b.name);

        // b.js
        const a = require('./a');
        console.log('b sees', a.name);
        exports.name = 'b';
      `,
      codeLang: "js",
      options: [
        "`b sees undefined`, then `a sees b`",
        "`b sees a`, then `a sees b`",
        "`a sees b`, then `b sees a`",
        "It throws a circular dependency error",
      ],
      answer: [0],
      explanation:
        "a.js starts, then requires b.js before setting `name`. b.js requires a.js, which is mid-load, so it gets a's partially filled exports object: `name` is still undefined. CommonJS allows cycles but hands out incomplete exports. (Recent Node also prints a warning on stderr about reading a missing property inside a circular dependency.)",
    },
    {
      id: "d3-09",
      domain: "d3",
      level: "junior",
      lesson: "d3-errors",
      prompt: "In Node's classic callback style, what is the first argument passed to the callback?",
      options: [
        "An error object if something failed, otherwise `null`",
        "The result of the operation",
        "The name of the function that was called",
        "A promise for the result",
      ],
      answer: [0],
      explanation: "Error-first callbacks look like `(err, result) => {}`. Check `err` first and return early. `util.promisify` converts these functions into promise-returning ones.",
    },
    {
      id: "d3-10",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-errors",
      prompt: "What happens when this runs?",
      code: js`
        try {
          setTimeout(() => {
            throw new Error('boom');
          }, 0);
        } catch (err) {
          console.log('caught', err.message);
        }
        console.log('after');
      `,
      codeLang: "js",
      options: [
        "It prints `after`, then the process crashes with an uncaught `Error: boom`",
        "It prints `caught boom`, then `after`",
        "It prints `after`, then `caught boom`",
        "It prints `after` and silently ignores the error",
      ],
      answer: [0],
      explanation:
        "The `try` block finishes as soon as the timer is scheduled. When the callback throws later, there's no try/catch on that stack, so it becomes an uncaught exception.",
    },
    {
      id: "d3-11",
      domain: "d3",
      level: "senior",
      lesson: "d3-errors",
      type: "lines",
      prompt: "When `db.findUser` rejects, the `catch` block never runs. Tap the line to fix.",
      code: js`
        async function loadUser(id) {
          try {
            return db.findUser(id);
          } catch (err) {
            logger.warn('lookup failed', err);
            return null;
          }
        }
      `,
      codeLang: "js",
      answer: [3],
      explanation:
        "Returning the promise without awaiting it leaves the `try` immediately; the rejection happens later, outside it, and goes to the caller. `return await db.findUser(id)` keeps the rejection inside this try/catch.",
    },
    {
      id: "d3-12",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-errors",
      type: "lines",
      prompt: "`all saved` prints before any save has finished. Tap the line that causes it.",
      code: js`
        async function saveAll(users) {
          users.forEach(async (user) => {
            await db.save(user);
          });
          console.log('all saved');
        }
      `,
      codeLang: "js",
      answer: [2],
      explanation:
        "`forEach` ignores the promises its callback returns, so nothing waits for them (and their rejections go unhandled). Use `for (const user of users) await db.save(user)` or `await Promise.all(users.map((u) => db.save(u)))`.",
    },
    {
      id: "d3-13",
      domain: "d3",
      level: "junior",
      lesson: "d3-errors",
      prompt: "What does this print?",
      code: js`
        Promise.allSettled([
          Promise.resolve(1),
          Promise.reject(new Error('x')),
          Promise.resolve(3),
        ]).then((results) => {
          console.log(results.map((r) => r.status).join(' '));
        });
      `,
      codeLang: "js",
      options: ["fulfilled rejected fulfilled", "1 x 3", "It rejects with `Error: x`", "fulfilled fulfilled fulfilled"],
      answer: [0],
      explanation: "`allSettled` never rejects. It waits for every input and gives `{ status, value }` or `{ status, reason }` for each, in input order.",
    },
    {
      id: "d3-14",
      domain: "d3",
      level: "junior",
      lesson: "d3-errors",
      prompt: "Three API calls run with `Promise.all`. The second one rejects after 50 ms; the others take 500 ms. What happens?",
      options: [
        "`Promise.all` rejects after about 50 ms with that error, and the other two calls keep running",
        "`Promise.all` waits 500 ms, then rejects",
        "The other two calls are cancelled automatically",
        "`Promise.all` resolves with `undefined` for the failed call",
      ],
      answer: [0],
      explanation:
        "`Promise.all` fails fast with the first rejection. Promises can't be cancelled, so the other requests still finish (use an `AbortController` if you need to stop them). Use `allSettled` to get every outcome.",
    },
    {
      id: "d3-15",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-unhandled",
      prompt: "On Node 15 or later with default settings, what happens?",
      code: js`
        async function main() {
          throw new Error('config missing');
        }
        main();
        setTimeout(() => console.log('still alive'), 100);
      `,
      codeLang: "js",
      options: [
        "The process prints the error and exits with code 1; `still alive` never prints",
        "A warning is printed, then `still alive`",
        "Nothing is printed except `still alive`",
        "`main` is retried until it succeeds",
      ],
      answer: [0],
      explanation:
        "`main()` returns a rejected promise that nobody handles. Since Node 15 the default `--unhandled-rejections=throw` mode raises it as an uncaught exception, which ends the process. Use `main().catch(...)` or top-level await in ESM.",
    },
    {
      id: "d3-16",
      domain: "d3",
      level: "senior",
      lesson: "d3-unhandled",
      prompt: "What is the right way to use `process.on('uncaughtException', handler)`?",
      options: [
        "Log the error with context, clean up what you can, then exit and let a supervisor restart the process",
        "Log the error and keep serving requests as normal",
        "Use it instead of try/catch throughout the codebase",
        "Retry the operation that failed from inside the handler",
      ],
      answer: [0],
      explanation:
        "After an uncaught exception the app may be in an unknown state (half-finished work, leaked resources). The Node docs say it isn't safe to resume. Exit, and rely on systemd, Kubernetes, or PM2 to start a fresh process.",
    },
    {
      id: "d3-17",
      domain: "d3",
      level: "staff",
      lesson: "d3-unhandled",
      prompt: "Teams keep adding `process.on('unhandledRejection', () => {})` to stop crashes. What policy should you set across services?",
      options: [
        "Fail fast: log unhandled rejections with context and exit, let the orchestrator restart, and catch floating promises with a lint rule",
        "Keep the empty handler everywhere so services never restart",
        "Run every service with `--unhandled-rejections=none`",
        "Wrap every function body in try/catch that returns null",
      ],
      answer: [0],
      explanation:
        "Silencing rejections hides real bugs and can leave requests hanging or data half-written. Crashing loudly plus automatic restarts and good logs makes problems visible, and `no-floating-promises` stops most of them at review time.",
    },
    {
      id: "d3-18",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-scaling",
      type: "match",
      prompt: "Match each `child_process` function to how it works.",
      pairs: [
        ["`spawn`", "Streams stdout/stderr; no shell by default"],
        ["`exec`", "Runs the command in a shell and buffers all output"],
        ["`execFile`", "Runs a file directly with arguments, buffers output, no shell"],
        ["`fork`", "Starts a Node script with an IPC channel for messages"],
      ],
      explanation: "Use `spawn` for long-running or large output, `execFile` for simple commands with untrusted arguments, `fork` for Node children you talk to, and `exec` only with trusted input.",
    },
    {
      id: "d3-19",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-scaling",
      prompt: "A stateless Express app runs as one Node process on an 8-core VM. What's the simplest built-in way to use all the cores for more HTTP throughput?",
      options: [
        "The `cluster` module: fork one worker process per core, all sharing the same port",
        "`worker_threads`, one thread per request",
        "Raise `UV_THREADPOOL_SIZE` to 8",
        "Use `child_process.exec` to run more copies of the route handlers",
      ],
      answer: [0],
      explanation:
        "cluster forks processes that share a listening socket, and the primary spreads connections across them. The thread pool doesn't run your handlers, and worker threads are meant for CPU tasks, not for serving whole requests.",
    },
    {
      id: "d3-20",
      domain: "d3",
      level: "senior",
      lesson: "d3-scaling",
      prompt: "How can worker threads exchange data with the main thread? (Choose two.)",
      options: [
        "`postMessage`, which structured-clones (or transfers) the data",
        "A `SharedArrayBuffer` that both threads read and write",
        "By reading each other's global variables",
        "Through `require.cache`",
        "By changing `process.env`, which every thread sees live",
      ],
      answer: [0, 1],
      explanation:
        "Each worker has its own isolate, globals, and module cache. Data moves by message (copied via structured clone, or transferred for ArrayBuffers) or through shared memory with `SharedArrayBuffer` plus `Atomics`. Each worker gets its own copy of `process.env` by default.",
    },
    {
      id: "d3-21",
      domain: "d3",
      level: "junior",
      lesson: "d3-scaling",
      prompt: "What does each worker thread get?",
      options: [
        "Its own V8 isolate, JavaScript heap, and event loop, inside the same process",
        "Its own operating-system process and PID",
        "A shared heap with the main thread, so objects can be passed by reference",
        "Nothing; it borrows the main thread's event loop",
      ],
      answer: [0],
      explanation: "Worker threads live in the same process but run isolated JavaScript environments. That's why sharing requires messages or SharedArrayBuffer.",
    },
    {
      id: "d3-22",
      domain: "d3",
      level: "staff",
      lesson: "d3-scaling",
      prompt: "Your Node services run on Kubernetes. A team wants to use `cluster` inside each container to fork one worker per node CPU. What do you usually recommend?",
      options: [
        "Run one Node process per container with a matching CPU request, and scale with replicas and the autoscaler",
        "Use cluster with one worker per host CPU in every pod",
        "Use worker_threads to handle incoming requests",
        "Run one pod per CPU core with cluster on top as well",
      ],
      answer: [0],
      explanation:
        "The orchestrator already restarts, load-balances, and scales processes. One process per container keeps health checks, metrics, memory limits, and restarts simple. cluster inside a pod duplicates that, and CPUs reported by the OS may not match the container's limit.",
    },
    {
      id: "d3-23",
      domain: "d3",
      level: "senior",
      lesson: "d3-scaling",
      type: "lines",
      prompt: "Under load this endpoint uses lots of memory and each job starts slowly. Tap the line that should use a worker pool instead.",
      code: js`
        const { Worker } = require('node:worker_threads');
        app.get('/hash', (req, res) => {
          const worker = new Worker('./hash-worker.js', { workerData: req.query.text });
          worker.on('message', (hash) => res.send(hash));
        });
      `,
      codeLang: "js",
      answer: [3],
      explanation:
        "Starting a worker means booting a new V8 isolate and loading modules, which costs time and memory. Spawning one per request doesn't scale. Keep a fixed pool (for example with Piscina) and queue jobs to it.",
    },
    {
      id: "d3-24",
      domain: "d3",
      level: "staff",
      lesson: "d3-modules",
      prompt: "You maintain a popular CommonJS library and want to move to ES modules without stranding users. What's the safest plan?",
      options: [
        "Ship it as a semver-major release with an `exports` map that provides both `import` and `require` entry points, tested in both module systems",
        "Set `\"type\": \"module\"` in a patch release",
        "Rename every file to .mjs and keep the same version number",
        "Publish a separate package name for ESM and stop updating the old one without notice",
      ],
      answer: [0],
      explanation:
        "Changing the module format can break consumers, so it's a major version. A conditional `exports` map lets `import` and `require` each get a working entry point. Watch for the dual-package hazard: keep shared state in one place.",
    },
    {
      id: "d3-25",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-errors",
      prompt: "About how many milliseconds does this print?",
      code: js`
        const wait = (ms) => new Promise((r) => setTimeout(r, ms));
        async function main() {
          const t = Date.now();
          await Promise.all([wait(100), wait(100), wait(100)]);
          console.log(Math.round((Date.now() - t) / 100) * 100);
        }
        main();
      `,
      codeLang: "js",
      options: ["100", "300", "0", "200"],
      answer: [0],
      explanation: "All three timers start immediately and run concurrently, so `Promise.all` resolves after about 100 ms. Three sequential `await wait(100)` lines would take about 300 ms.",
    },
  ],

  cards: [
    { id: "c-d3-require", domain: "d3", kind: "service", term: "require()", definition: "Loads a CommonJS module synchronously, runs it once, and returns its cached module.exports." },
    { id: "c-d3-mexports", domain: "d3", kind: "service", term: "module.exports", definition: "The object require() returns. Reassign it, or add properties to exports, but never reassign exports itself." },
    { id: "c-d3-import", domain: "d3", kind: "service", term: "import()", definition: "Dynamic import: loads any module asynchronously and returns a promise. Works in CommonJS and ESM." },
    { id: "c-d3-meta", domain: "d3", kind: "service", term: "import.meta.url", definition: "The file: URL of the current ES module. Use it (with fileURLToPath) where CommonJS used __dirname." },
    { id: "c-d3-promisify", domain: "d3", kind: "service", term: "util.promisify()", definition: "Turns an error-first callback function into one that returns a promise." },
    { id: "c-d3-allsettled", domain: "d3", kind: "service", term: "Promise.allSettled()", definition: "Waits for every promise and reports each result as fulfilled or rejected. Never rejects." },
    { id: "c-d3-abort", domain: "d3", kind: "service", term: "AbortController", definition: "Creates a signal you pass to fetch, timers, streams, and fs calls to cancel them." },
    { id: "c-d3-worker", domain: "d3", kind: "service", term: "worker_threads", definition: "Runs JavaScript in parallel threads with their own isolates and event loops. For CPU-bound work." },
    { id: "c-d3-cluster", domain: "d3", kind: "service", term: "cluster", definition: "Forks multiple Node processes that share a server port, to use every CPU core for HTTP." },
    { id: "c-d3-spawn", domain: "d3", kind: "service", term: "child_process.spawn()", definition: "Starts a program with streaming stdio and no shell by default. Good for large or long-running output." },
    { id: "c-d3-exec", domain: "d3", kind: "service", term: "child_process.exec()", definition: "Runs a command string in a shell and buffers its output. Never pass it untrusted input." },
    { id: "c-d3-fork", domain: "d3", kind: "service", term: "child_process.fork()", definition: "Starts another Node script with an IPC channel (process.send and 'message')." },
    { id: "c-d3-sab", domain: "d3", kind: "service", term: "SharedArrayBuffer", definition: "Memory that several threads can read and write at once. Coordinate with Atomics." },
    { id: "c-d3-errfirst", domain: "d3", kind: "concept", term: "Error-first callback", definition: "Callback convention (err, result): err is null on success. Check it before using result." },
    { id: "c-d3-unhandled", domain: "d3", kind: "concept", term: "Unhandled rejection", definition: "A rejected promise nobody handles. Since Node 15 it crashes the process by default." },
    { id: "c-d3-live", domain: "d3", kind: "concept", term: "Live bindings", definition: "ESM imports reflect the exporter's current variable value. CommonJS destructuring copies the value once." },
    { id: "c-d3-floating", domain: "d3", kind: "concept", term: "Floating promise", definition: "A promise that's neither awaited, returned, nor given a catch. Its errors go unhandled." },
  ],
});
