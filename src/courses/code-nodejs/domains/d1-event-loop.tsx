import { CodeCompare, Layers, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { js } from "../js";
import { EventLoopLab } from "../labs";
import { LoopPhases, NextTickVsPromise } from "../visuals";

/** Module 1: the event loop, its phases, nextTick vs promises vs setImmediate, libuv and the thread pool, and blocking. */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "The Event Loop",
    world: "The Loop Lagoon",
    weight: 30,
    emoji: "🌀",
    color: "#22c55e",
    summary: "How Node runs one thread of JavaScript: loop phases, process.nextTick vs promises vs setImmediate, libuv's thread pool, and what blocks the loop.",
  },

  tasks: [
    { id: "1.1", title: "Event loop phases", covers: ["Timers, pending callbacks, poll, check, close", "setTimeout vs setImmediate ordering", "When the loop exits"] },
    { id: "1.2", title: "nextTick, promises, and microtasks", covers: ["process.nextTick queue", "Promise microtask queue", "async/await ordering", "Starvation"] },
    { id: "1.3", title: "libuv, the thread pool, and non-blocking I/O", covers: ["What libuv does", "What uses the thread pool", "UV_THREADPOOL_SIZE", "Blocking the event loop and how to avoid it"] },
  ],

  lessons: [
    {
      id: "d1-loop",
      level: "intermediate",
      task: "1.1",
      title: "The phases of the event loop",
      check: ["d1-06", "d1-04"],
      visual: <LoopPhases />,
      points: [
        "Node runs your JavaScript on one main thread. The event loop decides which callback runs next.",
        "Each iteration walks the phases in order: timers, pending callbacks, idle/prepare, poll, check, close callbacks.",
        "Inside an I/O callback, setImmediate always runs before setTimeout(fn, 0), because check comes right after poll.",
        "In the main script, setTimeout(fn, 0) vs setImmediate order is not guaranteed: it depends on whether 1 ms has passed when the loop starts.",
        "The process exits when there are no timers, pending I/O, or other handles left to wait for.",
      ],
      tip: "Draw the loop as a circle with the phases on it and the nextTick + microtask queues drained between every callback. Interviewers love that picture.",
    },
    {
      id: "d1-microtasks",
      level: "intermediate",
      task: "1.2",
      title: "nextTick vs promises vs setImmediate",
      check: ["d1-01", "d1-03"],
      visual: (
        <div className="grid gap-6">
          <NextTickVsPromise />
          <EventLoopLab />
        </div>
      ),
      points: [
        "Synchronous code always finishes first. Then Node drains the process.nextTick queue, then the promise microtask queue.",
        "Both queues drain completely between every single callback, including between two timers that fire in the same phase.",
        "await pauses the async function and resumes it later as a microtask. Code before the first await runs synchronously.",
        "Recursive process.nextTick can starve the loop: I/O and timers never get a turn. Recursive setImmediate can't, because new immediates wait for the next iteration.",
      ],
      tip: "Answer ordering questions out loud in layers: sync, nextTick, microtasks, then the loop phase. Say which queue each callback goes to.",
    },
    {
      id: "d1-libuv",
      level: "senior",
      task: "1.3",
      title: "libuv and the thread pool",
      check: ["d1-25", "d1-11"],
      visual: (
        <div className="grid gap-4">
          <Layers
            layers={[
              { name: "Your JavaScript (one main thread)", color: "#22c55e", items: ["Request handlers", "Callbacks", "Promises"] },
              { name: "Node.js core + V8", color: "#38bdf8", items: ["fs", "net / http", "crypto", "zlib", "dns"] },
              { name: "libuv", color: "#a78bfa", items: ["Event loop", "Thread pool (4 threads by default)", "Timers"] },
              { name: "Operating system", color: "#f59e0b", items: ["epoll (Linux)", "kqueue (macOS)", "IOCP (Windows)"] },
            ]}
          />
          <Tiles
            tiles={[
              { icon: "🧵", title: "Uses the thread pool", text: "Most fs calls, dns.lookup, async crypto (pbkdf2, scrypt, randomBytes), and zlib.", color: "#a78bfa" },
              { icon: "📡", title: "Uses OS async I/O", text: "TCP and UDP sockets, so HTTP servers and clients. No pool thread is used per connection.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "libuv is the C library under Node that provides the event loop, async I/O, and a small worker thread pool.",
        "Network I/O uses the operating system's non-blocking APIs, so one thread can juggle thousands of sockets.",
        "Work the OS can't do asynchronously (files, dns.lookup, CPU-heavy crypto, compression) runs on the thread pool.",
        "The pool has 4 threads by default. Set UV_THREADPOOL_SIZE before the pool is first used to change it.",
      ],
      tip: "\"Node is single-threaded\" is half true. Say: \"JavaScript runs on one thread; libuv uses the OS and a thread pool for I/O.\"",
    },
    {
      id: "d1-blocking",
      level: "junior",
      task: "1.3",
      title: "Don't block the event loop",
      check: ["d1-14", "d1-15"],
      visual: (
        <CodeCompare
          lang="js"
          left={{
            title: "Blocks every request",
            code: js`
              app.get('/report', (req, res) => {
                const csv = fs.readFileSync('big.csv');
                const hash = crypto.pbkdf2Sync(pw, salt, 600000, 64, 'sha512');
                res.send(buildReport(csv)); // heavy CPU loop
              });
            `,
          }}
          right={{
            title: "Keeps the loop free",
            code: js`
              app.get('/report', async (req, res) => {
                const csv = await fs.promises.readFile('big.csv');
                const hash = await pbkdf2(pw, salt, 600000, 64, 'sha512');
                res.send(await pool.run(csv)); // worker thread
              });
            `,
          }}
        />
      ),
      points: [
        "While one callback runs, nothing else can: no other request, timer, or I/O callback.",
        "Watch for *Sync APIs in request paths, big JSON.parse/stringify calls, heavy loops, and catastrophic regexes.",
        "Wrapping CPU work in a Promise or an async function does not move it off the main thread.",
        "Offload CPU-bound work to worker threads (or a separate service) and keep request handlers short.",
      ],
      tip: "Sync APIs are fine at startup (loading config) and in CLI scripts. Say that, so you don't sound dogmatic.",
    },
  ],

  questions: [
    {
      id: "d1-01",
      domain: "d1",
      level: "junior",
      lesson: "d1-microtasks",
      prompt: "In a CommonJS script, what does this print?",
      code: js`
        console.log('A');
        setTimeout(() => console.log('B'), 0);
        Promise.resolve().then(() => console.log('C'));
        process.nextTick(() => console.log('D'));
        console.log('E');
      `,
      codeLang: "js",
      options: ["A E D C B", "A E C D B", "A D C B E", "A B C D E"],
      answer: [0],
      explanation:
        "Sync code first (`A`, `E`). Then Node drains the nextTick queue (`D`), then promise microtasks (`C`). The timer callback (`B`) waits for the timers phase of the loop.",
    },
    {
      id: "d1-02",
      domain: "d1",
      level: "junior",
      lesson: "d1-loop",
      prompt: "How many threads run your JavaScript code in a plain Node.js process?",
      options: [
        "One main thread; libuv uses the OS and a small thread pool for I/O behind the scenes",
        "One thread per incoming HTTP request",
        "One thread per CPU core, chosen automatically",
        "Four threads, one per libuv pool slot",
      ],
      answer: [0],
      explanation:
        "Your JavaScript runs on a single main thread with one event loop. Node is not thread-per-request. Extra threads (the libuv pool, V8's GC helpers) exist, but they don't run your callbacks unless you create worker threads.",
    },
    {
      id: "d1-03",
      domain: "d1",
      level: "junior",
      lesson: "d1-microtasks",
      prompt: "What does this print?",
      code: js`
        async function f() {
          console.log('1');
          await null;
          console.log('2');
        }
        f();
        console.log('3');
      `,
      codeLang: "js",
      options: ["1 3 2", "1 2 3", "3 1 2", "2 1 3"],
      answer: [0],
      explanation:
        "Code before the first `await` runs synchronously, so `1` prints immediately. `await` then pauses `f` and schedules the rest as a microtask, so `3` prints before `2`.",
    },
    {
      id: "d1-04",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-loop",
      prompt: "What does this print?",
      code: js`
        const fs = require('fs');
        fs.readFile(__filename, () => {
          setTimeout(() => console.log('timeout'), 0);
          setImmediate(() => console.log('immediate'));
        });
      `,
      codeLang: "js",
      options: [
        "`immediate` then `timeout`, every time",
        "`timeout` then `immediate`, every time",
        "Either order; it changes from run to run",
        "Only `immediate`: the timer is cancelled",
      ],
      answer: [0],
      explanation:
        "The readFile callback runs in the poll phase. The next phase is check, where `setImmediate` callbacks run. Timers only run when the loop wraps around, so `immediate` always wins here.",
    },
    {
      id: "d1-05",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-loop",
      prompt: "Run as the main script (not inside any callback), what does this print?",
      code: js`
        setTimeout(() => console.log('timeout'), 0);
        setImmediate(() => console.log('immediate'));
      `,
      codeLang: "js",
      options: [
        "Either order; it can change from run to run",
        "`timeout` then `immediate`, every time",
        "`immediate` then `timeout`, every time",
        "Only `timeout`",
      ],
      answer: [0],
      explanation:
        "`setTimeout(fn, 0)` really means at least 1 ms. If the loop reaches the timers phase before 1 ms has passed, the timer isn't due yet and `immediate` prints first; otherwise `timeout` does. It depends on process performance, so the order isn't guaranteed.",
    },
    {
      id: "d1-06",
      domain: "d1",
      level: "junior",
      lesson: "d1-loop",
      type: "order",
      prompt: "Put the phases of one event loop iteration in order.",
      items: ["Timers (setTimeout, setInterval)", "Pending callbacks", "Idle / prepare", "Poll (I/O callbacks)", "Check (setImmediate)", "Close callbacks"],
      explanation: "Timers → pending callbacks → idle/prepare → poll → check → close callbacks, then back to timers. nextTick and promise microtasks drain between callbacks in every phase.",
    },
    {
      id: "d1-07",
      domain: "d1",
      level: "senior",
      lesson: "d1-microtasks",
      prompt: "In a CommonJS script, what does this print?",
      code: js`
        Promise.resolve()
          .then(() => {
            console.log('1');
            process.nextTick(() => console.log('2'));
          })
          .then(() => console.log('3'));
      `,
      codeLang: "js",
      options: ["1 3 2", "1 2 3", "2 1 3", "3 1 2"],
      answer: [0],
      explanation:
        "Once Node starts draining promise microtasks, V8 empties that queue completely, including jobs added along the way. The first `then` logs `1`, queues a tick, and resolves the next `then`, which runs straight away (`3`). Only then does Node return to the nextTick queue (`2`).",
    },
    {
      id: "d1-08",
      domain: "d1",
      level: "senior",
      lesson: "d1-microtasks",
      prompt: "In modern Node (11 and later), what does this print?",
      code: js`
        setTimeout(() => {
          console.log('t1');
          Promise.resolve().then(() => console.log('p1'));
        }, 0);
        setTimeout(() => console.log('t2'), 0);
      `,
      codeLang: "js",
      options: ["t1 p1 t2", "t1 t2 p1", "p1 t1 t2", "t2 t1 p1"],
      answer: [0],
      explanation:
        "Since Node 11, the nextTick and microtask queues drain after each individual timer callback, the same as browsers. So `p1` runs before the second timer. (Very old Node printed `t1 t2 p1`.)",
    },
    {
      id: "d1-09",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-microtasks",
      prompt: "What happens when this runs?",
      code: js`
        function spin() {
          process.nextTick(spin);
        }
        spin();
        setTimeout(() => console.log('timer'), 0);
      `,
      codeLang: "js",
      options: [
        "`timer` never prints: the nextTick queue never empties, so the loop never reaches the timers phase",
        "`timer` prints after about 1 ms",
        "It throws `RangeError: Maximum call stack size exceeded`",
        "Node detects the loop and prints a warning, then runs the timer",
      ],
      answer: [0],
      explanation:
        "Each tick schedules another tick, and Node drains the nextTick queue before moving on. The loop is starved: no timers, no I/O, 100% CPU. The stack doesn't overflow because each call returns before the next one runs.",
    },
    {
      id: "d1-10",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-microtasks",
      prompt: "Why is `setImmediate` a safer choice than `process.nextTick` for breaking a long job into chunks?",
      options: [
        "Immediates queued during the check phase wait for the next loop iteration, so I/O and timers get to run in between",
        "`setImmediate` runs the callback on a worker thread",
        "`setImmediate` callbacks run before any promise callback",
        "`process.nextTick` is deprecated",
      ],
      answer: [0],
      explanation:
        "nextTick callbacks run before the loop continues, so a chain of them can starve I/O. Each `setImmediate` gives the loop a full turn (timers, poll, check) between chunks. Neither one uses another thread.",
    },
    {
      id: "d1-11",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-libuv",
      prompt: "Which of these operations run on the libuv thread pool? (Choose two.)",
      options: ["`fs.readFile`", "`crypto.pbkdf2`", "Reading data from a TCP socket", "`setTimeout`", "Accepting new HTTP connections"],
      answer: [0, 1],
      explanation:
        "File system calls, `dns.lookup`, async crypto like `pbkdf2`/`scrypt`, and zlib use the thread pool. Sockets (and so HTTP) use the OS's non-blocking I/O directly, and timers are handled by the loop itself.",
    },
    {
      id: "d1-12",
      domain: "d1",
      level: "senior",
      lesson: "d1-libuv",
      prompt: "On a machine with at least 4 cores and default settings, what timing pattern do you see?",
      code: js`
        const crypto = require('crypto');
        const start = Date.now();
        for (let i = 0; i < 6; i++) {
          crypto.pbkdf2('pw', 'salt', 100000, 64, 'sha512', () => {
            console.log(i, Date.now() - start);
          });
        }
      `,
      codeLang: "js",
      options: [
        "Four finish at about the same time, then the last two finish together, noticeably later",
        "All six finish at about the same time",
        "They finish one at a time, evenly spaced",
        "The `for` loop blocks until all six hashes are done, then all six print at once",
      ],
      answer: [0],
      explanation:
        "Async `pbkdf2` runs on the libuv thread pool, which has 4 threads by default. Four hashes run in parallel; the other two wait for a free thread. Raising `UV_THREADPOOL_SIZE` would let more run at once (up to your core count).",
    },
    {
      id: "d1-13",
      domain: "d1",
      level: "senior",
      lesson: "d1-libuv",
      prompt: "How do you give the libuv thread pool more threads?",
      options: [
        "Set the `UV_THREADPOOL_SIZE` environment variable before the pool is first used, ideally when the process starts",
        "Call `os.setThreadCount(16)`",
        "Start Node with `--max-old-space-size=16`",
        "Use the `cluster` module",
      ],
      answer: [0],
      explanation:
        "libuv reads `UV_THREADPOOL_SIZE` when it creates the pool, on first use. Setting it later has no effect, so set it in the environment that starts Node. `--max-old-space-size` is the heap limit, and cluster creates processes, not pool threads.",
    },
    {
      id: "d1-14",
      domain: "d1",
      level: "junior",
      lesson: "d1-blocking",
      prompt: "A client calls `/report`, and 100 ms later another client calls `/health`. When does `/health` respond?",
      code: js`
        app.get('/report', (req, res) => {
          const end = Date.now() + 2000;
          while (Date.now() < end) {} // 2 s of CPU work
          res.send('done');
        });
        app.get('/health', (req, res) => res.send('ok'));
      `,
      codeLang: "js",
      options: [
        "Only after `/report` finishes, about 1.9 s later",
        "Immediately, because each request gets its own thread",
        "Immediately, because Express runs handlers asynchronously",
        "Never: the second request is dropped",
      ],
      answer: [0],
      explanation:
        "The busy loop holds the only JavaScript thread for 2 s. The `/health` request is accepted by the OS but its callback can't run until the loop is free.",
    },
    {
      id: "d1-15",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-blocking",
      type: "lines",
      prompt: "Tap the line that blocks every other request while it runs.",
      code: js`
        const http = require('http');
        const fs = require('fs');
        http.createServer((req, res) => {
          const data = fs.readFileSync('./big-report.csv');
          res.end(data);
        }).listen(3000);
      `,
      codeLang: "js",
      answer: [4],
      explanation:
        "`readFileSync` inside a request handler stops the event loop until the whole file is read. Use `fs.promises.readFile` or, better for big files, stream it with `fs.createReadStream(...).pipe(res)`.",
    },
    {
      id: "d1-16",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-blocking",
      type: "lines",
      prompt: "Logins get slow for everyone under load. Tap the line that stalls the event loop.",
      code: js`
        app.post('/login', (req, res) => {
          const user = users.get(req.body.email);
          const hash = crypto.pbkdf2Sync(req.body.password, user.salt, 600000, 64, 'sha512');
          res.json({ ok: crypto.timingSafeEqual(hash, user.hash) });
        });
      `,
      codeLang: "js",
      answer: [3],
      explanation:
        "`pbkdf2Sync` with 600,000 iterations burns CPU on the main thread for every login. The async `crypto.pbkdf2` (or `scrypt`) runs on the thread pool and lets other requests proceed.",
    },
    {
      id: "d1-17",
      domain: "d1",
      level: "senior",
      lesson: "d1-blocking",
      prompt: "An endpoint resizes images in pure JavaScript, taking about 300 ms of CPU per request. What is the best fix inside the same service?",
      options: [
        "Run the resize in a pool of worker threads and await the result",
        "Wrap the resize code in `new Promise()` so it becomes asynchronous",
        "Raise `UV_THREADPOOL_SIZE` to 64",
        "Call the resize from `process.nextTick`",
      ],
      answer: [0],
      explanation:
        "CPU-bound JavaScript only leaves the main thread if you move it to another thread or process. A Promise executor runs synchronously, nextTick runs on the same thread, and the libuv pool only runs Node's built-in native work, not your JS.",
    },
    {
      id: "d1-18",
      domain: "d1",
      level: "junior",
      lesson: "d1-microtasks",
      prompt: "What does this print?",
      code: js`
        console.log('start');
        new Promise((resolve) => {
          console.log('executor');
          resolve();
        });
        console.log('end');
      `,
      codeLang: "js",
      options: ["start executor end", "start end executor", "executor start end", "start end"],
      answer: [0],
      explanation: "The function passed to `new Promise` (the executor) runs synchronously, right away. Only `.then` callbacks are deferred to the microtask queue.",
    },
    {
      id: "d1-19",
      domain: "d1",
      level: "staff",
      lesson: "d1-blocking",
      prompt:
        "One Node service handles the public API and also generates big nightly CSV exports in the same process. During exports, API latency explodes. What's the best long-term fix?",
      options: [
        "Move exports to a background job queue processed by a separate worker deployment, so API instances only serve requests",
        "Add more `await` keywords inside the export code",
        "Raise `UV_THREADPOOL_SIZE` to 128",
        "Increase the API's heap with `--max-old-space-size`",
      ],
      answer: [0],
      explanation:
        "Batch work and latency-sensitive traffic have different scaling and failure needs. Isolating the export behind a queue keeps API instances responsive, lets you scale each side independently, and makes retries easy. The other options don't take CPU work off the API's event loop.",
    },
    {
      id: "d1-20",
      domain: "d1",
      level: "staff",
      lesson: "d1-loop",
      prompt: "You're defining alerts for a fleet of Node services. Which signal most directly catches code that blocks the event loop?",
      options: [
        "Event loop delay (for example p99 from `perf_hooks.monitorEventLoopDelay`) or event loop utilization",
        "Average CPU usage across the fleet",
        "Heap used",
        "Number of npm dependencies",
      ],
      answer: [0],
      explanation:
        "Event loop delay measures how late the loop is to run scheduled work, which is exactly what blocking causes. Average CPU hides short stalls, and heap size tracks memory, not responsiveness.",
    },
    {
      id: "d1-21",
      domain: "d1",
      level: "staff",
      lesson: "d1-libuv",
      prompt:
        "Under load, a service that does lots of file I/O and password hashing also sees its outgoing HTTP calls slow down badly, even though the upstream is fast. What's the most likely cause?",
      options: [
        "`dns.lookup` (used for outgoing hostnames by default) shares the small libuv thread pool with fs and crypto, so lookups queue behind them",
        "HTTP sockets each need a pool thread, and the pool is full",
        "V8 garbage collection always pauses outgoing requests",
        "The upstream is rate-limiting because of TCP keep-alive",
      ],
      answer: [0],
      explanation:
        "Sockets don't use the pool, but `dns.lookup` does. When fs and crypto saturate the 4 threads, name resolution waits. Fixes: raise `UV_THREADPOOL_SIZE`, keep connections alive (fewer lookups), or cache DNS results.",
    },
    {
      id: "d1-22",
      domain: "d1",
      level: "junior",
      lesson: "d1-microtasks",
      type: "match",
      prompt: "Match each API to when its callback runs.",
      pairs: [
        ["`process.nextTick(fn)`", "Right after the current operation, before promise callbacks"],
        ["`promise.then(fn)`", "In the microtask queue, after the nextTick queue"],
        ["`setTimeout(fn, 0)`", "In the timers phase, after at least 1 ms"],
        ["`setImmediate(fn)`", "In the check phase, right after poll"],
      ],
      explanation: "nextTick queue → microtasks → loop phases. setTimeout belongs to timers and setImmediate to check.",
    },
    {
      id: "d1-23",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-loop",
      prompt: "Which statements about the event loop are true? (Choose two.)",
      options: [
        "Most completed I/O callbacks run in the poll phase",
        "`setImmediate` callbacks run in the check phase",
        "A `setTimeout` callback runs at exactly its delay",
        "The event loop itself runs on the libuv thread pool",
        "`process.nextTick` callbacks run only in the check phase",
      ],
      answer: [0, 1],
      explanation:
        "Poll handles I/O callbacks and check handles immediates. A timer's delay is a minimum: a busy loop makes it late. The loop runs on the main thread, and nextTick callbacks run between callbacks in every phase.",
    },
    {
      id: "d1-24",
      domain: "d1",
      level: "senior",
      lesson: "d1-microtasks",
      prompt: "In a CommonJS script, what does this print?",
      code: js`
        async function a() {
          console.log('a1');
          await b();
          console.log('a2');
        }
        async function b() {
          console.log('b');
        }
        a();
        process.nextTick(() => console.log('tick'));
        console.log('sync');
      `,
      codeLang: "js",
      options: ["a1 b sync tick a2", "a1 b a2 sync tick", "a1 sync b tick a2", "a1 b sync a2 tick"],
      answer: [0],
      explanation:
        "`a1` and `b` print synchronously (b's body runs when it's called). `await` defers the rest of `a` as a microtask, so `sync` prints next. After the script, the nextTick queue drains (`tick`) before microtasks (`a2`).",
    },
    {
      id: "d1-25",
      domain: "d1",
      level: "junior",
      lesson: "d1-libuv",
      prompt: "What is libuv?",
      options: [
        "The C library under Node that provides the event loop, asynchronous I/O, and a worker thread pool",
        "Node's JavaScript engine, which compiles JS to machine code",
        "The npm package that adds promises to Node",
        "A web framework built into Node",
      ],
      answer: [0],
      explanation: "V8 runs JavaScript; libuv provides the event loop and cross-platform async I/O (epoll, kqueue, IOCP) plus the thread pool for work the OS can't do asynchronously.",
    },
    {
      id: "d1-26",
      domain: "d1",
      level: "senior",
      lesson: "d1-blocking",
      type: "lines",
      prompt: "While this works through 10,000 jobs, the HTTP server in the same process accepts no requests. Tap the line to change.",
      code: js`
        function drainQueue(jobs) {
          if (jobs.length === 0) return;
          runJob(jobs.shift());
          process.nextTick(() => drainQueue(jobs));
        }
        drainQueue(tenThousandJobs);
      `,
      codeLang: "js",
      answer: [4],
      explanation:
        "Each tick schedules the next one before the loop can continue, so poll (where new connections are handled) never runs until all jobs are done. `setImmediate(() => drainQueue(jobs))` yields to I/O between jobs.",
    },
    {
      id: "d1-27",
      domain: "d1",
      level: "staff",
      lesson: "d1-blocking",
      prompt: "You're writing your team's guideline for CPU work in Node services. Which rule is most accurate?",
      options: [
        "Short CPU work inline is fine; anything long goes to a worker pool or a separate service, and event loop delay is monitored in production",
        "Never call any synchronous API, not even while loading config at startup",
        "Wrap all CPU-heavy functions in Promises so they run in the background",
        "Raise UV_THREADPOOL_SIZE whenever JavaScript code is slow",
      ],
      answer: [0],
      explanation:
        "A good guideline is precise: blocking only matters while serving traffic, Promises don't add threads, and the libuv pool doesn't run your JavaScript. Pair the rule with a metric (event loop delay) so regressions are caught.",
    },
  ],

  cards: [
    { id: "c-d1-nexttick", domain: "d1", kind: "service", term: "process.nextTick()", definition: "Queues a callback to run right after the current operation, before promise callbacks and before the loop continues." },
    { id: "c-d1-immediate", domain: "d1", kind: "service", term: "setImmediate()", definition: "Runs a callback in the check phase, right after poll. Yields to I/O between calls." },
    { id: "c-d1-timeout", domain: "d1", kind: "service", term: "setTimeout()", definition: "Runs a callback in the timers phase after at least the given delay (0 means 1 ms)." },
    { id: "c-d1-qmt", domain: "d1", kind: "service", term: "queueMicrotask()", definition: "Queues a callback on the same microtask queue that promise callbacks use." },
    { id: "c-d1-eld", domain: "d1", kind: "service", term: "perf_hooks.monitorEventLoopDelay()", definition: "Samples how late the event loop runs, as a histogram (min, max, mean, percentiles). The go-to blocking metric." },
    { id: "c-d1-uvsize", domain: "d1", kind: "service", term: "UV_THREADPOOL_SIZE", definition: "Environment variable that sets the libuv thread pool size (4 by default). Read once, when the pool is first used." },
    { id: "c-d1-loop", domain: "d1", kind: "concept", term: "Event loop", definition: "The loop that runs callbacks on Node's main thread, phase by phase: timers, pending, idle/prepare, poll, check, close." },
    { id: "c-d1-poll", domain: "d1", kind: "concept", term: "Poll phase", definition: "Where the loop waits for and runs I/O callbacks. If nothing is ready it may block here until a timer is due." },
    { id: "c-d1-micro", domain: "d1", kind: "concept", term: "Microtask queue", definition: "Holds promise reactions and queueMicrotask callbacks. Drained completely after the nextTick queue, between every callback." },
    { id: "c-d1-libuv", domain: "d1", kind: "concept", term: "libuv", definition: "C library providing Node's event loop, cross-platform async I/O, and the worker thread pool." },
    { id: "c-d1-block", domain: "d1", kind: "concept", term: "Blocking the event loop", definition: "Any long synchronous work (sync I/O, heavy CPU, huge JSON, bad regex) that stops every other callback from running." },
    { id: "c-d1-starve", domain: "d1", kind: "concept", term: "Starvation", definition: "Recursive nextTick or microtasks that never let the loop reach I/O and timers." },
  ],

  challenges: [
    {
      id: "ch-node-order",
      domain: "d1",
      lesson: "d1-microtasks",
      title: "Call the classic",
      goal: "Predict the exact output of the classic snippet (sync logs, a timer, a promise, and a nextTick), then press Check.",
      hint: "Sync first, then the nextTick queue, then promise microtasks, then the timers phase.",
      takeaway: "A E D C B: nextTick beats promises, and both beat any loop phase.",
      render: (onSolved) => <EventLoopLab goal="basics" onSolved={onSolved} />,
    },
    {
      id: "ch-node-io",
      domain: "d1",
      lesson: "d1-loop",
      title: "Immediate vs timeout",
      goal: "Predict the output when setTimeout and setImmediate are scheduled inside an I/O callback.",
      hint: "The I/O callback runs in poll. Which phase comes right after poll?",
      takeaway: "Inside I/O callbacks, check (setImmediate) always runs before the loop wraps around to timers.",
      render: (onSolved) => <EventLoopLab goal="io" onSolved={onSolved} />,
    },
  ],
});
