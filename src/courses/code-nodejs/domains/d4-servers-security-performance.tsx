import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { js } from "../js";
import { MiddlewareChain } from "../visuals";

/** Module 4: HTTP servers and middleware, configuration and security basics, performance and memory leaks. */
export default defineDomain({
  domain: {
    id: "d4",
    number: 4,
    name: "Servers, Security & Performance",
    world: "Production Peak",
    weight: 20,
    emoji: "🏔️",
    color: "#f59e0b",
    summary: "HTTP servers and Express-style middleware, environment config, input validation and secrets, graceful shutdown, and finding memory leaks.",
  },

  tasks: [
    { id: "4.1", title: "HTTP servers and middleware", covers: ["http.createServer, req and res as streams", "Middleware order, next(), error handlers", "Async errors in Express 4 vs 5", "Graceful shutdown"] },
    { id: "4.2", title: "Configuration and security", covers: ["process.env and config", "Secrets handling", "Input validation", "Injection, path traversal, prototype pollution, ReDoS"] },
    { id: "4.3", title: "Performance and memory leaks", covers: ["Common leak patterns", "Heap snapshots and profiling", "Memory outside the V8 heap", "Request context with AsyncLocalStorage"] },
  ],

  lessons: [
    {
      id: "d4-http",
      level: "junior",
      task: "4.1",
      title: "An HTTP server from scratch",
      check: ["d4-01", "d4-22"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="js"
            code={js`
              const http = require('node:http');

              const server = http.createServer((req, res) => {
                // req: IncomingMessage (a Readable stream)
                // res: ServerResponse (a Writable stream)
                if (req.method === 'GET' && req.url === '/health') {
                  res.writeHead(200, { 'Content-Type': 'application/json' });
                  return res.end(JSON.stringify({ ok: true }));
                }
                res.statusCode = 404;
                res.end('Not found');
              });
              server.listen(process.env.PORT || 3000);
            `}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "🛑", label: "SIGTERM", sub: "Fail readiness checks" },
              { icon: "🚪", label: "server.close()", sub: "Stop new connections" },
              { icon: "⏳", label: "Finish in-flight", sub: "With a timeout" },
              { icon: "🔌", label: "Close pools", sub: "DB, queues" },
              { icon: "👋", label: "Exit 0", sub: "" },
            ]}
          />
        </div>
      ),
      points: [
        "One callback handles every request. req is a readable stream of the body; res is a writable stream for the response.",
        "Every request must end with res.end() (or a framework helper that calls it), or the client waits until it times out.",
        "Frameworks like Express or Fastify add routing, body parsing, and middleware on top of this same API.",
        "Graceful shutdown: on SIGTERM stop accepting connections, let in-flight requests finish, close resources, then exit.",
      ],
      tip: "Being able to write a server with just node:http shows you understand what frameworks do for you.",
    },
    {
      id: "d4-middleware",
      level: "intermediate",
      task: "4.1",
      title: "Middleware: a chain of functions",
      check: ["d4-23", "d4-04"],
      visual: <MiddlewareChain />,
      points: [
        "Middleware runs in the order it's registered. Each one ends the response or calls next() to pass control on.",
        "Calling next(err) skips ordinary middleware and jumps to error handlers, which take four arguments (err, req, res, next).",
        "Sending a response doesn't stop your function. Return after res.send() or you may try to respond twice (ERR_HTTP_HEADERS_SENT).",
        "Express 5 forwards rejected promises from async handlers to error middleware; Express 4 needs try/catch or a wrapper.",
      ],
      tip: "Draw the onion: logger → body parser → auth → routes → 404 → error handler, and explain why each sits where it does.",
    },
    {
      id: "d4-security",
      level: "intermediate",
      task: "4.2",
      title: "Config, secrets, and input you can't trust",
      check: ["d4-24", "d4-08"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "💉", title: "Command injection", text: "User input in exec() runs in a shell. Use execFile or spawn with an argument array.", color: "#f87171" },
              { icon: "📁", title: "Path traversal", text: "../../etc/passwd. Resolve the path and check it's still inside your folder.", color: "#f87171" },
              { icon: "🧬", title: "Prototype pollution", text: "Merging user JSON with __proto__ keys can change Object.prototype for the whole app.", color: "#f87171" },
              { icon: "🐌", title: "ReDoS", text: "A badly written regex on user input can backtrack for seconds and block the loop.", color: "#f87171" },
            ]}
          />
          <CodeCompare
            lang="js"
            left={{
              title: "Trusting input",
              code: js`
                const { amount } = req.body;
                db.query('UPDATE acct SET bal = bal - ' + amount);
              `,
            }}
            right={{
              title: "Validate, then parameterize",
              code: js`
                const { amount } = schema.parse(req.body); // e.g. zod
                db.query('UPDATE acct SET bal = bal - $1', [amount]);
              `,
            }}
          />
        </div>
      ),
      points: [
        "process.env values are always strings (or undefined). Parse numbers and booleans explicitly and validate config at startup.",
        "Keep secrets out of the repo and out of logs: inject them at runtime from a secret manager, and rotate them if they leak.",
        "Validate every request body, query, and header against a schema. Use parameterized queries for databases.",
        "Hash passwords with a slow, salted algorithm (scrypt, bcrypt, argon2) and compare secrets with crypto.timingSafeEqual.",
      ],
      tip: "For security questions, name the attack, show the vulnerable line, and give the specific fix. Vague answers like \"sanitize input\" score low.",
    },
    {
      id: "d4-perf",
      level: "senior",
      task: "4.3",
      title: "Memory leaks and performance",
      check: ["d4-17", "d4-14"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "🗃️", title: "Unbounded caches", text: "A module-level Map or array that only ever grows.", color: "#f59e0b" },
              { icon: "👂", title: "Forgotten listeners", text: "on() per request on a long-lived emitter, never off().", color: "#f59e0b" },
              { icon: "⏲️", title: "Timers", text: "setInterval never cleared keeps its closure alive.", color: "#f59e0b" },
              { icon: "🔒", title: "Closures", text: "A small callback that captures a huge object.", color: "#f59e0b" },
            ]}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "📈", label: "Reproduce", sub: "Load test, watch heapUsed grow" },
              { icon: "📸", label: "Snapshot 1", sub: "--inspect or --heapsnapshot-signal" },
              { icon: "📸", label: "Snapshot 2", sub: "After more traffic" },
              { icon: "🔍", label: "Compare", sub: "Which objects keep growing?" },
              { icon: "🧭", label: "Retainers", sub: "Who is holding them?" },
            ]}
          />
        </div>
      ),
      points: [
        "A leak in a garbage-collected language is memory that's still reachable but no longer needed.",
        "Compare heap snapshots over time and follow the retainer chain to the code holding the objects.",
        "process.memoryUsage() splits heapUsed from external and arrayBuffers: Buffers live outside the V8 heap.",
        "Use bounded caches (an LRU with a max size or TTL), remove listeners when requests close, and clear timers.",
      ],
      tip: "Walk through the method: reproduce, measure, snapshot twice, compare, find the retainer, fix, verify. The method matters more than the tool name.",
    },
  ],

  questions: [
    {
      id: "d4-01",
      domain: "d4",
      level: "junior",
      lesson: "d4-http",
      prompt: "In `http.createServer((req, res) => { … })`, what are `req` and `res`?",
      options: [
        "`req` is a readable stream (IncomingMessage) and `res` is a writable stream (ServerResponse)",
        "Plain objects with the parsed JSON body and a `send` method",
        "Promises that resolve when the request finishes",
        "Two EventEmitters with no stream behaviour",
      ],
      answer: [0],
      explanation: "The request body arrives as a stream you read (`'data'`/`'end'`, `pipe`, or `for await`). The response is a stream you write to and must `end()`. Parsing JSON is a framework or your own job.",
    },
    {
      id: "d4-02",
      domain: "d4",
      level: "junior",
      lesson: "d4-middleware",
      type: "lines",
      prompt: "When the user doesn't exist, the server logs `ERR_HTTP_HEADERS_SENT`. Tap the line that needs a `return`.",
      code: js`
        app.get('/users/:id', async (req, res) => {
          const user = await db.findUser(req.params.id);
          if (!user) {
            res.status(404).json({ error: 'Not found' });
          }
          res.json(user);
        });
      `,
      codeLang: "js",
      answer: [4],
      explanation:
        "Sending a response doesn't exit the function. Execution falls through to `res.json(user)`, which tries to send a second response. Write `return res.status(404).json(...)`.",
    },
    {
      id: "d4-03",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-middleware",
      type: "order",
      prompt: "Order these Express registrations so every request is logged, bodies are parsed before auth reads them, and errors are caught.",
      items: ["`app.use(requestLogger)`", "`app.use(express.json())`", "`app.use(authenticate)`", "`app.use('/api', apiRouter)`", "`app.use(errorHandler)` (4 arguments)"],
      explanation:
        "Middleware runs in registration order. Logging goes first so it sees everything, parsing before anything that reads `req.body`, auth before protected routes, and the error handler last so `next(err)` from anywhere above reaches it.",
    },
    {
      id: "d4-04",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-middleware",
      prompt: "How does Express know a middleware function is an error handler?",
      options: [
        "It declares four parameters: `(err, req, res, next)`",
        "Its name starts with `error`",
        "It is registered with `app.error()`",
        "It throws instead of calling `next()`",
      ],
      answer: [0],
      explanation: "Express checks the function's arity. With four parameters it's only called when an error is passed along with `next(err)` (or thrown in a handler). Keep all four, even if you don't use `next`.",
    },
    {
      id: "d4-05",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-middleware",
      prompt: "A request arrives at this Express app. What is logged?",
      code: js`
        app.use((req, res, next) => {
          console.log('A');
          next();
          console.log('B');
        });
        app.use((req, res) => {
          console.log('C');
          res.send('ok');
        });
      `,
      codeLang: "js",
      options: ["A C B", "A B C", "A C", "C A B"],
      answer: [0],
      explanation:
        "`next()` calls the next middleware right away. When that one returns, control comes back and `B` is logged. That's why code after `next()` runs after downstream middleware, and why you usually `return next()`.",
    },
    {
      id: "d4-06",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-security",
      prompt: "What does this print?",
      code: js`
        process.env.DEBUG = false;
        if (process.env.DEBUG) {
          console.log('debug on');
        } else {
          console.log('debug off');
        }
      `,
      codeLang: "js",
      options: ["debug on", "debug off", "It throws a TypeError", "Nothing"],
      answer: [0],
      explanation:
        "Assigning to `process.env` converts the value to a string, so `DEBUG` becomes `'false'`, a non-empty and therefore truthy string. Compare explicitly: `process.env.DEBUG === 'true'`.",
    },
    {
      id: "d4-07",
      domain: "d4",
      level: "junior",
      lesson: "d4-security",
      prompt: "Where should a production database password live?",
      options: [
        "In a secret manager or the deployment's secret store, injected at runtime (for example as an environment variable)",
        "In `config.js`, committed to the repo",
        "In a `.env` file committed so the whole team has it",
        "Base64-encoded inside the source code",
      ],
      answer: [0],
      explanation: "Secrets in git are effectively public forever (history, forks, CI logs). Inject them at deploy time, restrict who can read them, and rotate them. Base64 is an encoding, not encryption.",
    },
    {
      id: "d4-08",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-security",
      type: "lines",
      prompt: "A request to `/ping?host=x;rm -rf /` is dangerous. Tap the vulnerable line.",
      code: js`
        const { exec } = require('child_process');
        app.get('/ping', (req, res) => {
          exec('ping -c 1 ' + req.query.host, (err, stdout) => {
            res.type('text').send(stdout);
          });
        });
      `,
      codeLang: "js",
      answer: [3],
      explanation:
        "`exec` runs the string in a shell, so `;` starts a second command: command injection. Validate the host and use `execFile('ping', ['-c', '1', host])`, which passes arguments without a shell.",
    },
    {
      id: "d4-09",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-security",
      type: "lines",
      prompt: "`/download?name=../../.env` returns your secrets. Tap the line where the unchecked input is used.",
      code: js`
        const path = require('path');
        app.get('/download', (req, res) => {
          const file = path.join(__dirname, 'uploads', req.query.name);
          res.sendFile(file);
        });
      `,
      codeLang: "js",
      answer: [3],
      explanation:
        "`path.join` resolves `..` segments, so the result can point outside `uploads`. Resolve the path and check it still starts with the uploads folder (or look files up by ID instead of by name).",
    },
    {
      id: "d4-10",
      domain: "d4",
      level: "senior",
      lesson: "d4-security",
      prompt: "What does this print?",
      code: js`
        function merge(target, src) {
          for (const key in src) {
            if (typeof src[key] === 'object') merge(target[key] ??= {}, src[key]);
            else target[key] = src[key];
          }
        }
        merge({}, JSON.parse('{"__proto__": {"isAdmin": true}}'));
        console.log({}.isAdmin);
      `,
      codeLang: "js",
      options: ["true", "undefined", "false", "It throws a TypeError"],
      answer: [0],
      explanation:
        "`JSON.parse` creates an own key named `__proto__`. In `merge`, `target['__proto__']` is `Object.prototype`, so `isAdmin` is written onto the prototype of every object: prototype pollution. Skip `__proto__`, `constructor`, and `prototype` keys, or merge into `Object.create(null)` / a `Map`.",
    },
    {
      id: "d4-11",
      domain: "d4",
      level: "senior",
      lesson: "d4-security",
      prompt: "A security review flags this API-token check. What's the concern and fix?",
      code: js`
        function checkToken(given) {
          return given === process.env.API_TOKEN;
        }
      `,
      codeLang: "js",
      options: [
        "`===` can stop at the first different character, leaking timing information; compare equal-length Buffers with `crypto.timingSafeEqual`",
        "`===` is case-insensitive for strings; use `localeCompare`",
        "`process.env` is slow to read; cache it in a global",
        "Tokens should be compared with `==` to handle numbers",
      ],
      answer: [0],
      explanation:
        "String comparison can return early, so response time can hint at how much of a guess was right. `timingSafeEqual` takes the same time for any input of the same length (hash both values first if lengths can differ).",
    },
    {
      id: "d4-12",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-security",
      prompt: "How should a Node app store user passwords?",
      options: [
        "Hash them with a slow, salted password hash such as `crypto.scrypt`, bcrypt, or argon2",
        "Hash them once with SHA-256",
        "Encrypt them with AES so you can show them to support staff",
        "Store them as-is but restrict database access",
      ],
      answer: [0],
      explanation:
        "Fast hashes like SHA-256 let attackers try billions of guesses per second. Password hashes are deliberately slow and salted per user. Passwords should never be reversible.",
    },
    {
      id: "d4-13",
      domain: "d4",
      level: "senior",
      lesson: "d4-security",
      prompt: "Why is testing user input against a regex like `/^(a+)+$/` a denial-of-service risk in Node?",
      options: [
        "Nested quantifiers can make the regex engine backtrack exponentially on certain inputs, blocking the single JavaScript thread",
        "Regexes run on the thread pool and can use up all four threads",
        "The regex leaks memory every time it's compiled",
        "Regexes can't handle Unicode, so they crash on emoji",
      ],
      answer: [0],
      explanation:
        "This is ReDoS. A short string like many `a`s followed by `!` can take seconds or longer, and while the regex runs no other request is served. Avoid nested quantifiers, limit input length, or use a linear-time regex engine.",
    },
    {
      id: "d4-14",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-perf",
      type: "lines",
      prompt: "Memory grows with every request and never comes back down. Tap the line that leaks.",
      code: js`
        const seen = [];
        server.on('request', (req, res) => {
          seen.push({ url: req.url, headers: req.headers, at: Date.now() });
          res.end('ok');
        });
      `,
      codeLang: "js",
      answer: [3],
      explanation: "A module-level array that's only ever appended to keeps every entry reachable forever. Log to an external system, or keep a bounded buffer (fixed size or time window).",
    },
    {
      id: "d4-15",
      domain: "d4",
      level: "senior",
      lesson: "d4-perf",
      type: "lines",
      prompt: "Memory grows as clients connect and disconnect from this server-sent events endpoint. Tap the line that leaks.",
      code: js`
        const bus = new EventEmitter();
        app.get('/events', (req, res) => {
          bus.on('update', (data) => res.write('data: ' + data + '\n\n'));
        });
      `,
      codeLang: "js",
      answer: [3],
      explanation:
        "Each connection adds a listener that holds its `res`, and nothing removes it when the client leaves. Keep a reference and call `bus.off('update', listener)` in `req.on('close', ...)`.",
    },
    {
      id: "d4-16",
      domain: "d4",
      level: "senior",
      lesson: "d4-perf",
      type: "order",
      prompt: "Order the steps for tracking down a memory leak in a Node service.",
      items: [
        "Reproduce it under load and confirm heapUsed keeps growing",
        "Take a heap snapshot",
        "Send more traffic, then take a second snapshot",
        "Compare the snapshots to find object types whose count keeps growing",
        "Follow their retainers to the code holding them, fix it, and verify",
      ],
      explanation: "Measure first so you know it's a real leak, take snapshots far enough apart, and use the comparison view to find growing object types. The retainer chain shows which variable or listener keeps them alive.",
    },
    {
      id: "d4-17",
      domain: "d4",
      level: "junior",
      lesson: "d4-perf",
      prompt: "Which are common causes of memory leaks in Node services? (Choose two.)",
      options: [
        "An in-memory cache (a module-level Map) with no size limit or expiry",
        "Event listeners added per request and never removed",
        "Using `const` instead of `let`",
        "Reading files with streams",
        "Calling `setImmediate`",
      ],
      answer: [0, 1],
      explanation: "Leaks are references that outlive their usefulness: growing caches, forgotten listeners, uncleared intervals, and closures capturing large objects. Variable keywords and streams don't leak by themselves.",
    },
    {
      id: "d4-18",
      domain: "d4",
      level: "staff",
      lesson: "d4-http",
      type: "order",
      prompt: "Kubernetes sends SIGTERM during a rolling deploy. Order the steps of a graceful shutdown that drops no requests.",
      items: [
        "Catch SIGTERM and start failing the readiness check",
        "Stop accepting new connections with `server.close()`",
        "Let in-flight requests finish, with a hard timeout",
        "Close database pools and queue connections",
        "Exit with code 0",
      ],
      explanation:
        "Failing readiness takes the pod out of the load balancer. `server.close()` stops new connections while existing ones finish. Close shared resources only after requests are done, and keep a timeout so a stuck request can't block the deploy forever.",
    },
    {
      id: "d4-19",
      domain: "d4",
      level: "staff",
      lesson: "d4-perf",
      prompt: "A service's RSS grows slowly for days until the container is OOM-killed, but heap snapshots show the JS heap is stable. Where do you look next?",
      options: [
        "Memory outside the V8 heap: compare rss with heapUsed, external, and arrayBuffers from `process.memoryUsage()` (Buffers, native addons)",
        "The heap snapshot tool must be wrong; increase `--max-old-space-size`",
        "Unhandled promise rejections",
        "The number of npm dependencies",
      ],
      answer: [0],
      explanation:
        "Heap snapshots only show the V8 heap. Buffers, native addons, and allocator fragmentation show up in RSS and `external`/`arrayBuffers`. Raising the heap limit doesn't help memory that isn't in the heap.",
    },
    {
      id: "d4-20",
      domain: "d4",
      level: "staff",
      lesson: "d4-security",
      prompt: "Secrets leaked because an error handler logged the whole `process.env`. Which fixes should you put in place? (Choose two.)",
      options: [
        "Rotate the leaked secrets and load secrets from a secret manager with access controls",
        "Use a structured logger with redaction rules for sensitive fields",
        "Base64-encode secrets in environment variables",
        "Commit the .env file so everyone uses the same values",
        "Turn off logging in production",
      ],
      answer: [0, 1],
      explanation:
        "First contain the damage (rotate), then make the same mistake hard to repeat (redaction by default, least-privilege access). Encoding isn't protection, and losing all logs trades one problem for another.",
    },
    {
      id: "d4-21",
      domain: "d4",
      level: "staff",
      lesson: "d4-http",
      prompt: "You want every log line, in every module, to include the current request's ID, without passing it through every function. What do you use?",
      options: [
        "`AsyncLocalStorage` from `node:async_hooks`: run each request inside `als.run(ctx, ...)` and read the context anywhere downstream",
        "A global variable set at the start of each request",
        "`process.env.REQUEST_ID`, set per request",
        "A worker thread per request",
      ],
      answer: [0],
      explanation:
        "Requests interleave on one thread, so a global would be overwritten by the next request. AsyncLocalStorage follows the async call chain (callbacks, promises, timers), giving each request its own context. Tracing libraries use the same mechanism.",
    },
    {
      id: "d4-22",
      domain: "d4",
      level: "junior",
      lesson: "d4-http",
      type: "lines",
      prompt: "Every request hangs until the client times out. Tap the line that should be `res.end('ok')`.",
      code: js`
        const http = require('http');
        http.createServer((req, res) => {
          res.writeHead(200, { 'Content-Type': 'text/plain' });
          res.write('ok');
        }).listen(3000);
      `,
      codeLang: "js",
      answer: [4],
      explanation: "`res.write` sends part of the body but leaves the response open. Without `res.end()`, the client keeps waiting for more data.",
    },
    {
      id: "d4-23",
      domain: "d4",
      level: "junior",
      lesson: "d4-middleware",
      prompt: "What does calling `next()` do inside Express middleware?",
      options: [
        "Passes control to the next matching middleware or route; `next(err)` jumps to error handlers",
        "Ends the response with status 200",
        "Restarts the current middleware",
        "Moves the request to the next server in the cluster",
      ],
      answer: [0],
      explanation: "Middleware either responds or calls `next`. If it does neither, the request hangs. Passing an argument (other than `'route'`/`'router'`) is treated as an error.",
    },
    {
      id: "d4-24",
      domain: "d4",
      level: "junior",
      lesson: "d4-security",
      prompt: "The app is started with `PORT=8080 node app.js`. What does this print?",
      code: js`
        const port = process.env.PORT || 3000;
        console.log(typeof port, port + 1);
      `,
      codeLang: "js",
      options: ["string 80801", "number 8081", "string 8081", "number 80801"],
      answer: [0],
      explanation: "Environment variables are always strings, so `+ 1` concatenates. Parse them: `const port = Number(process.env.PORT) || 3000`, and validate config at startup.",
    },
    {
      id: "d4-25",
      domain: "d4",
      level: "senior",
      lesson: "d4-middleware",
      prompt: "In Express 4, what happens when `loadData()` rejects?",
      code: js`
        app.get('/data', async (req, res) => {
          const data = await loadData();
          res.json(data);
        });
        app.use((err, req, res, next) => res.status(500).json({ error: 'oops' }));
      `,
      codeLang: "js",
      options: [
        "The error middleware never runs: the rejection is unhandled, and on modern Node that crashes the process by default",
        "Express catches it and the error middleware sends a 500",
        "Express retries the handler once",
        "The client gets an empty 200 response",
      ],
      answer: [0],
      explanation:
        "Express 4 ignores the promise an async handler returns. Wrap handlers (`try/catch` plus `next(err)`, or a helper), or upgrade: Express 5 forwards rejected promises to error middleware automatically.",
    },
  ],

  cards: [
    { id: "c-d4-createserver", domain: "d4", kind: "service", term: "http.createServer()", definition: "Creates an HTTP server whose handler receives req (a Readable) and res (a Writable) for each request." },
    { id: "c-d4-close", domain: "d4", kind: "service", term: "server.close()", definition: "Stops accepting new connections and calls back once existing ones have finished. Core of graceful shutdown." },
    { id: "c-d4-env", domain: "d4", kind: "service", term: "process.env", definition: "The environment variables. Every value is a string or undefined, so parse and validate them." },
    { id: "c-d4-envfile", domain: "d4", kind: "service", term: "--env-file", definition: "Node flag (20.6+) that loads variables from a .env file at startup, with no extra package." },
    { id: "c-d4-tse", domain: "d4", kind: "service", term: "crypto.timingSafeEqual()", definition: "Compares two equal-length buffers in constant time, so comparison speed doesn't leak secrets." },
    { id: "c-d4-scrypt", domain: "d4", kind: "service", term: "crypto.scrypt()", definition: "Built-in slow, memory-hard password hash. Runs on the thread pool when called asynchronously." },
    { id: "c-d4-mem", domain: "d4", kind: "service", term: "process.memoryUsage()", definition: "Reports rss, heapTotal, heapUsed, external, and arrayBuffers, to tell heap leaks from Buffer or native memory." },
    { id: "c-d4-als", domain: "d4", kind: "service", term: "AsyncLocalStorage", definition: "Stores per-request context that follows async calls, for request IDs, tracing, and logging." },
    { id: "c-d4-mw", domain: "d4", kind: "concept", term: "Middleware", definition: "A function (req, res, next) in a chain. It responds, or calls next() to continue, or next(err) to jump to error handlers." },
    { id: "c-d4-graceful", domain: "d4", kind: "concept", term: "Graceful shutdown", definition: "On SIGTERM: fail readiness, stop new connections, finish in-flight work, close resources, exit." },
    { id: "c-d4-leak", domain: "d4", kind: "concept", term: "Memory leak", definition: "Memory that's still reachable but no longer needed, so the garbage collector can never free it." },
    { id: "c-d4-cmdinj", domain: "d4", kind: "concept", term: "Command injection", definition: "User input interpreted by a shell, as with exec('cmd ' + input). Use execFile or spawn with arguments." },
    { id: "c-d4-traversal", domain: "d4", kind: "concept", term: "Path traversal", definition: "Input like ../../ that escapes the intended folder. Resolve the path and check its prefix." },
    { id: "c-d4-proto", domain: "d4", kind: "concept", term: "Prototype pollution", definition: "Writing __proto__ or constructor keys from untrusted input changes Object.prototype for the whole app." },
    { id: "c-d4-redos", domain: "d4", kind: "concept", term: "ReDoS", definition: "A regex that backtracks catastrophically on crafted input, blocking the event loop." },
  ],
});
