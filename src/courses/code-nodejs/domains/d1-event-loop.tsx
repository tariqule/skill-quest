import { CodeBlock, CodeCompare, Flow, Layers, Tiles } from "@/components/learn/blocks";
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
    summary:
      "How Node runs all your JavaScript on one thread. You'll learn the loop's phases, the order of process.nextTick, promises and setImmediate, what libuv's thread pool does, and what blocks the loop.",
  },

  tasks: [
    { id: "1.1", title: "Event loop phases", covers: ["Timers, pending callbacks, poll, check, close", "setTimeout vs setImmediate ordering", "When the loop exits"] },
    { id: "1.2", title: "nextTick, promises, and microtasks", covers: ["process.nextTick queue", "Promise microtask queue", "async/await ordering", "Starvation"] },
    { id: "1.3", title: "libuv, the thread pool, and non-blocking I/O", covers: ["What libuv does", "What uses the thread pool", "UV_THREADPOOL_SIZE", "Blocking the event loop and how to avoid it"] },
  ],

  lessons: [
    {
      id: "d1-start-node",
      level: "beginner",
      task: "1.1",
      title: "What Node.js is",
      check: ["node-b1-01", "node-b1-02"],
      visual: (
        <Flow
          color="#22c55e"
          steps={[
            { icon: "📝", label: "Write hello.js", sub: "A plain text file with JavaScript in it" },
            { icon: "⌨️", label: "Run node hello.js", sub: "Type this in your terminal" },
            { icon: "⚙️", label: "Node runs it", sub: "Line by line, top to bottom" },
            { icon: "🖥️", label: "See the output", sub: "console.log prints in the terminal" },
          ]}
        />
      ),
      points: [
        "JavaScript started life inside web browsers. Node.js is a program that runs JavaScript outside the browser, on your laptop or on a server.",
        "You save your code in a file, say `hello.js`, and run it by typing `node hello.js` in a terminal.",
        "`console.log('hi')` prints a line of text to the terminal. It's how you see what your program is doing.",
        "People use Node to build web servers, command line tools and build scripts. Many sites you use every day have Node behind them.",
      ],
      tip: "Install Node, make a file with one `console.log` line, and run it. Seeing your own output once makes everything after this easier.",
    },
    {
      id: "d1-start-one-cook",
      level: "beginner",
      task: "1.2",
      title: "One cook, many orders",
      check: ["node-b1-03", "node-b1-04"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#22c55e"
            steps={[
              { icon: "🧾", label: "An order comes in", sub: "Some work to do" },
              { icon: "⏲️", label: "Start the oven, set a timer", sub: "Don't stand and wait" },
              { icon: "🥗", label: "Take the next order", sub: "Keep working meanwhile" },
              { icon: "🔔", label: "Timer rings", sub: "Now finish the first dish" },
            ]}
          />
          <CodeBlock
            lang="js"
            caption="Prints first, second, later. The timer's function runs after the rest of the file."
            code={js`
              console.log('first');
              setTimeout(() => console.log('later'), 0);
              console.log('second');
            `}
          />
        </div>
      ),
      points: [
        "Picture a kitchen with one cook. The cook never stands by the oven waiting. They set a timer and take the next order.",
        "Node works the same way. It runs your JavaScript on one thread, and anything slow, like a timer or a file read, finishes in the background.",
        "A callback is a function you hand over to run later, like a note saying \"when the timer rings, plate the dish\".",
        "`setTimeout(fn, 0)` doesn't run `fn` right away. It runs after the code that's already going has finished.",
      ],
      tip: "When you read Node code, ask of each function: does it run now, or is it a callback that runs later?",
    },
    {
      id: "d1-loop",
      level: "intermediate",
      task: "1.1",
      title: "The phases of the event loop",
      check: ["d1-06", "d1-04"],
      visual: <LoopPhases />,
      points: [
        "Node runs your JavaScript on one main thread. The event loop is what decides which callback runs next.",
        "Each trip around the loop visits the phases in the same order: timers, pending callbacks, idle and prepare, poll, check, and close callbacks.",
        "Inside an I/O callback, `setImmediate` always runs before `setTimeout(fn, 0)`. That's because the check phase comes straight after poll.",
        "In the main script, the order of `setTimeout(fn, 0)` and `setImmediate` isn't guaranteed. It depends on whether 1 ms has passed when the loop starts.",
        "The process exits once there's nothing left to wait for: no timers, no pending I/O and no other open handles.",
      ],
      tip: "Draw the loop as a circle with the phases around it. Then show the nextTick and microtask queues being emptied between every callback. Interviewers love that picture.",
    },
    {
      id: "d1-microtasks",
      level: "intermediate",
      task: "1.2",
      title: "nextTick, promises and setImmediate",
      check: ["d1-01", "d1-03"],
      visual: (
        <div className="grid gap-6">
          <NextTickVsPromise />
          <EventLoopLab />
        </div>
      ),
      points: [
        "Synchronous code always finishes first. Then Node empties the `process.nextTick` queue, and then the promise microtask queue.",
        "Both queues are emptied completely between every single callback. That includes the gap between two timers that fire in the same phase.",
        "`await` pauses the async function and resumes it later as a microtask. Any code before the first `await` runs straight away.",
        "Calling `process.nextTick` over and over can starve the loop, so I/O and timers never get a turn.",
        "Recursive `setImmediate` can't starve the loop. A new immediate always waits for the next trip around.",
      ],
      tip: "Answer ordering questions out loud, layer by layer: sync code, then nextTick, then microtasks, then the loop phase. Say which queue each callback lands in.",
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
              { name: "Node.js core and V8", color: "#38bdf8", items: ["fs", "net / http", "crypto", "zlib", "dns"] },
              { name: "libuv", color: "#a78bfa", items: ["Event loop", "Thread pool (4 threads by default)", "Timers"] },
              { name: "Operating system", color: "#f59e0b", items: ["epoll (Linux)", "kqueue (macOS)", "IOCP (Windows)"] },
            ]}
          />
          <Tiles
            tiles={[
              { icon: "🧵", title: "Uses the thread pool", text: "Most fs calls, dns.lookup, async crypto (pbkdf2, scrypt, randomBytes), and zlib.", color: "#a78bfa" },
              { icon: "📡", title: "Uses the OS's async I/O", text: "TCP and UDP sockets, so HTTP servers and clients too. No pool thread is used per connection.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "libuv is the C library underneath Node. It gives Node the event loop, async I/O and a small pool of worker threads.",
        "Network I/O uses the operating system's non-blocking APIs. That's how one thread can look after thousands of sockets at once.",
        "Work the OS can't do asynchronously runs on the thread pool. That covers files, `dns.lookup`, heavy crypto and compression.",
        "The pool has 4 threads by default. To change that, set `UV_THREADPOOL_SIZE` before the pool is first used.",
      ],
      tip: "\"Node is single-threaded\" is only half true. Say this instead: \"Your JavaScript runs on one thread, and libuv uses the OS and a thread pool for I/O.\"",
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
        "While one callback is running, nothing else can run. No other request, timer or I/O callback gets a turn.",
        "Watch for `*Sync` APIs in request handlers, huge `JSON.parse` or `JSON.stringify` calls, heavy loops and badly written regexes.",
        "Wrapping CPU work in a Promise or an async function doesn't move it off the main thread. It still runs on the same thread.",
        "Move CPU-heavy work to worker threads, or to a separate service, and keep request handlers short.",
      ],
      tip: "Sync APIs are fine at startup, like loading config, and in command line scripts. Say so, so you don't sound dogmatic.",
    },
  ],

  questions: [
    // ───────────── Beginner ─────────────
    {
      id: "node-b1-01",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-node",
      type: "output",
      prompt: "You save this in `hello.js` and run `node hello.js`. What appears in the terminal? Type one line per log.",
      code: js`
        console.log('Hello from Node');
        console.log(2 + 3);
      `,
      codeLang: "js",
      answers: ["Hello from Node\n5"],
      explanation:
        "Node runs the file from top to bottom, and each `console.log` prints one line. The first prints the text inside the quotes. The second works out `2 + 3` first, so it prints `5`.",
    },
    {
      id: "node-b1-02",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-node",
      prompt: "You have a file called `app.js`. Which command runs it with Node?",
      options: ["`node app.js`", "`run app.js`", "`open app.js`", "`javascript app.js`"],
      answer: [0],
      explanation:
        "You type `node` followed by the file name. Node reads the file and runs the JavaScript in it. The other commands aren't how you start Node.",
    },
    {
      id: "node-b1-03",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-one-cook",
      type: "output",
      prompt: "What does this print? Type one line per log.",
      code: js`
        console.log('first');
        setTimeout(() => console.log('later'), 0);
        console.log('second');
      `,
      codeLang: "js",
      answers: ["first\nsecond\nlater"],
      explanation:
        "`setTimeout` doesn't run its function straight away, even with a delay of 0. It hands it over to run later, once the rest of the file has finished. So `first` and `second` print before `later`.",
    },
    {
      id: "node-b1-04",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-one-cook",
      prompt: "In Node, what is a callback?",
      options: [
        "A function you pass to something else so it can be run later, for example when a timer finishes",
        "A phone call Node makes to the server",
        "An error message Node prints when something goes wrong",
        "A second copy of your program that runs alongside the first",
      ],
      answer: [0],
      explanation:
        "A callback is just a function you hand over to be called later. In `setTimeout(() => console.log('hi'), 1000)`, the arrow function is the callback, and Node calls it after about a second.",
    },
    {
      id: "node-b1-05",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-one-cook",
      prompt: "Why doesn't Node sit and wait while a slow task, like reading a big file, is happening?",
      options: [
        "It starts the slow task, carries on with other work, and runs your callback when the task is done",
        "It copies your whole program onto a new computer",
        "It skips the slow task completely",
        "It always waits; Node can only do one thing and then stops",
      ],
      answer: [0],
      explanation:
        "Like a cook who sets a timer instead of staring at the oven, Node starts the slow work and moves on. When the work finishes, Node runs the callback you gave it. That's why one Node process can serve many users at once.",
    },

    // ───────────── Junior and up ─────────────
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
        "The synchronous logs run first, so you get `A` and `E`. Next Node empties the nextTick queue (`D`) and then the promise microtasks (`C`). The timer callback (`B`) has to wait for the timers phase of the loop.",
    },
    {
      id: "d1-02",
      domain: "d1",
      level: "junior",
      lesson: "d1-loop",
      prompt: "How many threads run your JavaScript code in a plain Node.js process?",
      options: [
        "One main thread, while libuv uses the OS and a small thread pool for I/O behind the scenes",
        "One thread per incoming HTTP request",
        "One thread per CPU core, chosen automatically",
        "Four threads, one for each libuv pool slot",
      ],
      answer: [0],
      explanation:
        "Your JavaScript runs on a single main thread with one event loop. Node doesn't give each request its own thread. Other threads do exist, like the libuv pool and V8's garbage collector helpers, but they don't run your callbacks unless you create worker threads.",
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
        "Code before the first `await` runs straight away, so `1` prints first. The `await` then pauses `f` and queues the rest as a microtask. The script carries on and prints `3`, and only then does `2` print.",
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
        "Either order, and it changes from run to run",
        "Only `immediate`, because the timer is cancelled",
      ],
      answer: [0],
      explanation:
        "The `readFile` callback runs in the poll phase. The very next phase is check, which is where `setImmediate` callbacks run. Timers only run once the loop comes back round, so `immediate` always wins here.",
    },
    {
      id: "d1-05",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-loop",
      prompt: "Run as the main script, not inside any callback, what does this print?",
      code: js`
        setTimeout(() => console.log('timeout'), 0);
        setImmediate(() => console.log('immediate'));
      `,
      codeLang: "js",
      options: [
        "Either order, and it can change from run to run",
        "`timeout` then `immediate`, every time",
        "`immediate` then `timeout`, every time",
        "Only `timeout`",
      ],
      answer: [0],
      explanation:
        "`setTimeout(fn, 0)` really means \"after at least 1 ms\". If the loop reaches the timers phase before 1 ms has passed, the timer isn't due yet, so `immediate` prints first. Otherwise `timeout` does. It depends on how fast the process starts, so the order isn't guaranteed.",
    },
    {
      id: "d1-06",
      domain: "d1",
      level: "junior",
      lesson: "d1-loop",
      type: "order",
      prompt: "Put the phases of one trip around the event loop in order.",
      items: ["Timers (setTimeout, setInterval)", "Pending callbacks", "Idle / prepare", "Poll (I/O callbacks)", "Check (setImmediate)", "Close callbacks"],
      explanation:
        "The loop goes timers, pending callbacks, idle and prepare, poll, check, and close callbacks, then back to timers. In every phase, the nextTick and promise microtask queues are emptied between callbacks.",
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
        "Once Node starts emptying the promise microtask queue, V8 keeps going until it's empty, including jobs added along the way. The first `then` logs `1`, queues a tick, and resolves the next `then`, which runs straight away and logs `3`. Only after that does Node go back to the nextTick queue and log `2`.",
    },
    {
      id: "d1-08",
      domain: "d1",
      level: "senior",
      lesson: "d1-microtasks",
      prompt: "In modern Node (version 11 and later), what does this print?",
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
        "Since Node 11, the nextTick and microtask queues are emptied after each timer callback, just like in browsers. So `p1` runs before the second timer. Very old versions of Node printed `t1 t2 p1`.",
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
        "`timer` never prints, because the nextTick queue never empties and the loop never reaches the timers phase",
        "`timer` prints after about 1 ms",
        "It throws `RangeError: Maximum call stack size exceeded`",
        "Node spots the loop, prints a warning, then runs the timer",
      ],
      answer: [0],
      explanation:
        "Each tick schedules another tick, and Node empties the nextTick queue before moving on. So the loop is starved: no timers, no I/O, and the CPU sits at 100%. The stack doesn't overflow, because each call returns before the next one starts.",
    },
    {
      id: "d1-10",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-microtasks",
      prompt: "Why is `setImmediate` a safer choice than `process.nextTick` for breaking a long job into chunks?",
      options: [
        "Immediates queued during the check phase wait for the next trip around the loop, so I/O and timers get to run in between",
        "`setImmediate` runs the callback on a worker thread",
        "`setImmediate` callbacks run before any promise callback",
        "`process.nextTick` is deprecated",
      ],
      answer: [0],
      explanation:
        "nextTick callbacks run before the loop is allowed to carry on, so a chain of them can starve I/O. Each `setImmediate` gives the loop a full turn, through timers, poll and check, between chunks. Neither one uses another thread.",
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
        "File system calls, `dns.lookup`, async crypto like `pbkdf2` and `scrypt`, and zlib all use the thread pool. Sockets, and so HTTP, use the operating system's non-blocking I/O directly. Timers are handled by the loop itself.",
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
        "Async `pbkdf2` runs on the libuv thread pool, which has 4 threads by default. Four hashes run side by side, and the other two wait for a free thread. Raising `UV_THREADPOOL_SIZE` would let more run at once, up to your core count.",
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
        "libuv reads `UV_THREADPOOL_SIZE` once, when it creates the pool on first use. Setting it later does nothing, so set it in the environment that starts Node. `--max-old-space-size` sets the heap limit, and `cluster` creates processes, not pool threads.",
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
        "Straight away, because each request gets its own thread",
        "Straight away, because Express runs handlers asynchronously",
        "Never, because the second request is dropped",
      ],
      answer: [0],
      explanation:
        "The busy loop holds the only JavaScript thread for 2 seconds. The operating system accepts the `/health` connection, but its handler can't run until the loop is free again.",
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
        "`readFileSync` inside a request handler stops the event loop until the whole file has been read. Use `fs.promises.readFile` instead. For big files it's even better to stream it with `fs.createReadStream(...).pipe(res)`.",
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
        "`pbkdf2Sync` with 600,000 rounds burns CPU on the main thread for every single login. The async `crypto.pbkdf2`, or `scrypt`, runs on the thread pool and lets other requests carry on.",
    },
    {
      id: "d1-17",
      domain: "d1",
      level: "senior",
      lesson: "d1-blocking",
      prompt: "An endpoint resizes images in pure JavaScript, which takes about 300 ms of CPU per request. What's the best fix inside the same service?",
      options: [
        "Run the resize in a pool of worker threads and await the result",
        "Wrap the resize code in `new Promise()` so it becomes asynchronous",
        "Raise `UV_THREADPOOL_SIZE` to 64",
        "Call the resize from `process.nextTick`",
      ],
      answer: [0],
      explanation:
        "CPU-heavy JavaScript only leaves the main thread if you move it to another thread or process. A Promise's executor runs straight away on the same thread, and so does nextTick. The libuv pool only runs Node's built-in native work, never your JavaScript.",
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
      explanation:
        "The function you pass to `new Promise`, called the executor, runs straight away. Only `.then` callbacks are held back for the microtask queue.",
    },
    {
      id: "d1-19",
      domain: "d1",
      level: "staff",
      lesson: "d1-blocking",
      prompt:
        "One Node service handles the public API and also builds big nightly CSV exports in the same process. During exports, API response times shoot up. What's the best long-term fix?",
      options: [
        "Move exports to a background job queue handled by a separate worker deployment, so API instances only serve requests",
        "Add more `await` keywords inside the export code",
        "Raise `UV_THREADPOOL_SIZE` to 128",
        "Increase the API's heap with `--max-old-space-size`",
      ],
      answer: [0],
      explanation:
        "Batch work and user-facing traffic need to scale differently and fail differently. Putting the export behind a queue keeps API instances responsive, lets you scale each side on its own, and makes retries easy. None of the other options takes the CPU work off the API's event loop.",
    },
    {
      id: "d1-20",
      domain: "d1",
      level: "staff",
      lesson: "d1-loop",
      prompt: "You're setting up alerts for a fleet of Node services. Which signal most directly catches code that blocks the event loop?",
      options: [
        "Event loop delay (for example the p99 from `perf_hooks.monitorEventLoopDelay`) or event loop utilization",
        "Average CPU usage across the fleet",
        "Heap used",
        "Number of npm dependencies",
      ],
      answer: [0],
      explanation:
        "Event loop delay measures how late the loop is to run scheduled work, and that's exactly what blocking causes. An average CPU figure hides short stalls, and heap size tracks memory, not how responsive the service is.",
    },
    {
      id: "d1-21",
      domain: "d1",
      level: "staff",
      lesson: "d1-libuv",
      prompt:
        "Under load, a service that does lots of file I/O and password hashing also sees its outgoing HTTP calls slow down badly, even though the upstream is fast. What's the most likely cause?",
      options: [
        "`dns.lookup`, used for outgoing hostnames by default, shares the small libuv thread pool with fs and crypto, so lookups queue behind them",
        "Each HTTP socket needs a pool thread, and the pool is full",
        "V8 garbage collection always pauses outgoing requests",
        "The upstream is rate limiting because of TCP keep-alive",
      ],
      answer: [0],
      explanation:
        "Sockets don't use the pool, but `dns.lookup` does. When fs and crypto keep all 4 threads busy, name lookups have to wait. You can raise `UV_THREADPOOL_SIZE`, keep connections alive so there are fewer lookups, or cache DNS results.",
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
      explanation:
        "The nextTick queue goes first, then the microtask queue, then the loop's phases. `setTimeout` belongs to the timers phase and `setImmediate` belongs to the check phase.",
    },
    {
      id: "d1-23",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-loop",
      prompt: "Which statements about the event loop are true? (Choose two.)",
      options: [
        "Most finished I/O callbacks run in the poll phase",
        "`setImmediate` callbacks run in the check phase",
        "A `setTimeout` callback runs at exactly its delay",
        "The event loop itself runs on the libuv thread pool",
        "`process.nextTick` callbacks run only in the check phase",
      ],
      answer: [0, 1],
      explanation:
        "Poll handles I/O callbacks and check handles immediates. A timer's delay is only a minimum, so a busy loop makes it late. The loop runs on the main thread, and nextTick callbacks run between callbacks in every phase.",
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
        "`a1` and `b` print straight away, because `b`'s body runs as soon as it's called. The `await` holds back the rest of `a` as a microtask, so `sync` prints next. After the script, the nextTick queue empties first (`tick`), and then the microtasks run (`a2`).",
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
      explanation:
        "V8 is the part that runs JavaScript. libuv provides the event loop and async I/O that works the same on every operating system, using epoll, kqueue or IOCP underneath. It also runs the thread pool for work the OS can't do asynchronously.",
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
        "Each tick schedules the next one before the loop can carry on. So the poll phase, where new connections are handled, never runs until every job is done. Writing `setImmediate(() => drainQueue(jobs))` lets I/O run between jobs.",
    },
    {
      id: "d1-27",
      domain: "d1",
      level: "staff",
      lesson: "d1-blocking",
      prompt: "You're writing your team's guideline for CPU work in Node services. Which rule is most accurate?",
      options: [
        "Short CPU work inline is fine, anything long goes to a worker pool or a separate service, and event loop delay is monitored in production",
        "Never call any synchronous API, not even while loading config at startup",
        "Wrap all CPU-heavy functions in Promises so they run in the background",
        "Raise UV_THREADPOOL_SIZE whenever JavaScript code is slow",
      ],
      answer: [0],
      explanation:
        "A good guideline is precise. Blocking only matters while you're serving traffic, Promises don't add threads, and the libuv pool never runs your JavaScript. Pair the rule with a metric, event loop delay, so you catch it when things get worse.",
    },
  ],

  cards: [
    { id: "c-d1-nexttick", domain: "d1", kind: "service", term: "process.nextTick()", definition: "Queues a callback to run right after the current operation, before promise callbacks and before the loop moves on." },
    { id: "c-d1-immediate", domain: "d1", kind: "service", term: "setImmediate()", definition: "Runs a callback in the check phase, right after poll. Lets I/O run between calls." },
    { id: "c-d1-timeout", domain: "d1", kind: "service", term: "setTimeout()", definition: "Runs a callback in the timers phase once at least the given delay has passed. A delay of 0 really means 1 ms." },
    { id: "c-d1-qmt", domain: "d1", kind: "service", term: "queueMicrotask()", definition: "Puts a callback on the same microtask queue that promise callbacks use." },
    { id: "c-d1-eld", domain: "d1", kind: "service", term: "perf_hooks.monitorEventLoopDelay()", definition: "Measures how late the event loop runs and gives you a histogram with min, max, mean and percentiles. It's the go-to metric for spotting blocking." },
    { id: "c-d1-uvsize", domain: "d1", kind: "service", term: "UV_THREADPOOL_SIZE", definition: "An environment variable that sets how many threads the libuv pool has (4 by default). It's read once, when the pool is first used." },
    { id: "c-d1-loop", domain: "d1", kind: "concept", term: "Event loop", definition: "The loop that runs callbacks on Node's main thread, one phase at a time: timers, pending, idle and prepare, poll, check, close." },
    { id: "c-d1-poll", domain: "d1", kind: "concept", term: "Poll phase", definition: "Where the loop waits for I/O and runs I/O callbacks. If nothing is ready, it may wait here until a timer is due." },
    { id: "c-d1-micro", domain: "d1", kind: "concept", term: "Microtask queue", definition: "Holds promise reactions and queueMicrotask callbacks. It's emptied completely after the nextTick queue, between every callback." },
    { id: "c-d1-libuv", domain: "d1", kind: "concept", term: "libuv", definition: "The C library that gives Node its event loop, async I/O that works on every operating system, and the worker thread pool." },
    { id: "c-d1-block", domain: "d1", kind: "concept", term: "Blocking the event loop", definition: "Any long synchronous work, like sync I/O, heavy CPU, huge JSON or a bad regex, that stops every other callback from running." },
    { id: "c-d1-starve", domain: "d1", kind: "concept", term: "Starvation", definition: "When recursive nextTick calls or microtasks never let the loop reach I/O and timers." },
  ],

  challenges: [
    {
      id: "ch-node-order",
      domain: "d1",
      lesson: "d1-microtasks",
      title: "Call the classic",
      goal: "Predict the exact output of the classic snippet, with its sync logs, a timer, a promise and a nextTick. Then press Check.",
      hint: "Sync code goes first. Then the nextTick queue, then promise microtasks, then the timers phase.",
      takeaway: "It prints A E D C B. nextTick beats promises, and both beat every loop phase.",
      render: (onSolved) => <EventLoopLab goal="basics" onSolved={onSolved} />,
    },
    {
      id: "ch-node-io",
      domain: "d1",
      lesson: "d1-loop",
      title: "Immediate or timeout",
      goal: "Predict the output when setTimeout and setImmediate are both scheduled inside an I/O callback.",
      hint: "The I/O callback runs in the poll phase. Which phase comes right after poll?",
      takeaway: "Inside an I/O callback, the check phase (setImmediate) always runs before the loop comes back round to timers.",
      render: (onSolved) => <EventLoopLab goal="io" onSolved={onSolved} />,
    },
  ],
});
