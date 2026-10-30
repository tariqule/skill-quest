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
    summary:
      "Running Node in production. You'll build HTTP servers and Express-style middleware, handle config and secrets, validate input, shut down gracefully, and track down memory leaks.",
  },

  tasks: [
    { id: "4.1", title: "HTTP servers and middleware", covers: ["http.createServer, req and res as streams", "Middleware order, next(), error handlers", "Async errors in Express 4 vs 5", "Graceful shutdown"] },
    { id: "4.2", title: "Configuration and security", covers: ["process.env and config", "Secrets handling", "Input validation", "Injection, path traversal, prototype pollution, ReDoS"] },
    { id: "4.3", title: "Performance and memory leaks", covers: ["Common leak patterns", "Heap snapshots and profiling", "Memory outside the V8 heap", "Request context with AsyncLocalStorage"] },
  ],

  lessons: [
    {
      id: "d4-start-server",
      level: "beginner",
      task: "4.1",
      title: "Your first web server",
      check: ["node-b4-01", "node-b4-02"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "🌐", label: "Browser asks", sub: "Visits localhost:3000" },
              { icon: "📬", label: "Request arrives", sub: "Your function gets req and res" },
              { icon: "✍️", label: "You write a reply", sub: "res.end('Hello')" },
              { icon: "📨", label: "Browser shows it", sub: "Hello" },
            ]}
          />
          <CodeBlock
            lang="js"
            caption="Run it with node server.js, then open http://localhost:3000 in your browser."
            code={js`
              const http = require('node:http');
              const server = http.createServer((req, res) => {
                res.end('Hello from my server');
              });
              server.listen(3000);
            `}
          />
        </div>
      ),
      points: [
        "A web server is a program that waits for requests and sends back responses. Think of a post office counter: letters come in, and replies go out.",
        "Node's built-in `node:http` module can make a server in a few lines. Your function runs once for every request.",
        "Your function gets two things: `req`, the request that came in, and `res`, the reply you're writing.",
        "`server.listen(3000)` starts the server on port 3000. A port is like a door number on your computer, so `localhost:3000` means door 3000 on this machine.",
      ],
      tip: "Always finish the reply with `res.end(...)`. If you forget, the browser keeps waiting and spinning.",
    },
    {
      id: "d4-start-config",
      level: "beginner",
      task: "4.2",
      title: "Settings and secrets live outside your code",
      check: ["node-b4-03", "node-b4-04"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={2}
            tiles={[
              { icon: "🧾", title: "Environment variables", text: "Named settings the computer hands your program when it starts, like PORT=8080.", color: "#f59e0b" },
              { icon: "🔐", title: "Secrets stay out of the code", text: "Passwords and keys go in the environment, never in files you share or commit.", color: "#f59e0b" },
            ]}
          />
          <CodeBlock
            lang="js"
            caption="Prints Hello friend when USER_NAME isn't set. Run USER_NAME=Mia node app.js and it prints Hello Mia."
            code={js`
              const name = process.env.USER_NAME || 'friend';
              console.log('Hello ' + name);
            `}
          />
        </div>
      ),
      points: [
        "The same code usually runs in several places: your laptop, a test server, the live site. Each needs different settings.",
        "Environment variables are named settings handed to your program when it starts. In Node you read them from `process.env`.",
        "`process.env.PORT || 3000` means: use the PORT setting if there is one, otherwise use 3000.",
        "Passwords and API keys belong in environment variables or a secret store, never in your code. Anyone who can see the code could read them.",
      ],
      tip: "Every value in `process.env` is text, even one that looks like a number. Convert it with `Number(...)` before you do maths with it.",
    },
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
              { icon: "🛑", label: "SIGTERM", sub: "Start failing readiness checks" },
              { icon: "🚪", label: "server.close()", sub: "Stop new connections" },
              { icon: "⏳", label: "Finish in-flight", sub: "With a timeout" },
              { icon: "🔌", label: "Close pools", sub: "Database, queues" },
              { icon: "👋", label: "Exit 0", sub: "" },
            ]}
          />
        </div>
      ),
      points: [
        "One callback handles every request. `req` is a readable stream holding the request body, and `res` is a writable stream for your response.",
        "Every request has to finish with `res.end()`, or a framework helper that calls it. Otherwise the client waits until it times out.",
        "Frameworks like Express and Fastify add routing, body parsing and middleware on top of this same API.",
        "A graceful shutdown works like this: on SIGTERM, stop taking new connections, let running requests finish, close resources, then exit.",
      ],
      tip: "Being able to write a server with only `node:http` shows you understand what frameworks do for you.",
    },
    {
      id: "d4-middleware",
      level: "intermediate",
      task: "4.1",
      title: "Middleware: a chain of functions",
      check: ["d4-23", "d4-04"],
      visual: <MiddlewareChain />,
      points: [
        "Middleware runs in the order you register it. Each one either ends the response or calls `next()` to pass control along.",
        "Calling `next(err)` skips the normal middleware and jumps to error handlers. An error handler takes four arguments: `(err, req, res, next)`.",
        "Sending a response doesn't stop your function. Return after `res.send()`, or you may try to respond twice and get `ERR_HTTP_HEADERS_SENT`.",
        "Express 5 passes rejected promises from async handlers to your error middleware. Express 4 needs a try/catch or a wrapper.",
      ],
      tip: "Draw the layers in order: logger, body parser, auth, routes, 404, error handler. Then explain why each one sits where it does.",
    },
    {
      id: "d4-security",
      level: "intermediate",
      task: "4.2",
      title: "Config, secrets and input you can't trust",
      check: ["d4-24", "d4-08"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "💉", title: "Command injection", text: "User input passed to exec() runs in a shell. Use execFile or spawn with a list of arguments.", color: "#f87171" },
              { icon: "📁", title: "Path traversal", text: "Input like ../../etc/passwd. Resolve the path and check it's still inside your folder.", color: "#f87171" },
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
              title: "Validate, then use parameters",
              code: js`
                const { amount } = schema.parse(req.body); // e.g. zod
                db.query('UPDATE acct SET bal = bal - $1', [amount]);
              `,
            }}
          />
        </div>
      ),
      points: [
        "Values in `process.env` are always strings, or undefined. Convert numbers and booleans yourself, and check your config when the app starts.",
        "Keep secrets out of the repo and out of logs. Load them at runtime from a secret manager, and rotate them if they ever leak.",
        "Check every request body, query string and header against a schema. Use parameterized queries for databases.",
        "Hash passwords with a slow, salted algorithm like scrypt, bcrypt or argon2. Compare secrets with `crypto.timingSafeEqual`.",
      ],
      tip: "For security questions, name the attack, point to the vulnerable line, and give the specific fix. Vague answers like \"sanitize input\" score low.",
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
              { icon: "🗃️", title: "Caches with no limit", text: "A module-level Map or array that only ever grows.", color: "#f59e0b" },
              { icon: "👂", title: "Forgotten listeners", text: "on() called per request on a long-lived emitter, with no off().", color: "#f59e0b" },
              { icon: "⏲️", title: "Timers", text: "A setInterval that's never cleared keeps its closure alive.", color: "#f59e0b" },
              { icon: "🔒", title: "Closures", text: "A small callback that holds on to a huge object.", color: "#f59e0b" },
            ]}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "📈", label: "Reproduce", sub: "Load test and watch heapUsed grow" },
              { icon: "📸", label: "Snapshot 1", sub: "--inspect or --heapsnapshot-signal" },
              { icon: "📸", label: "Snapshot 2", sub: "After more traffic" },
              { icon: "🔍", label: "Compare", sub: "Which objects keep growing?" },
              { icon: "🧭", label: "Retainers", sub: "What's holding on to them?" },
            ]}
          />
        </div>
      ),
      points: [
        "In a garbage-collected language, a leak is memory that's still reachable but no longer needed.",
        "Compare heap snapshots taken at different times, then follow the retainer chain back to the code that's holding the objects.",
        "`process.memoryUsage()` reports `heapUsed` separately from `external` and `arrayBuffers`. Buffers live outside the V8 heap.",
        "Give caches a limit, like an LRU with a maximum size or an expiry time. Remove listeners when requests close, and clear your timers.",
      ],
      tip: "Walk through the method: reproduce, measure, take two snapshots, compare, find the retainer, fix, check again. The method matters more than the name of the tool.",
    },
  ],

  questions: [
    // ───────────── Beginner ─────────────
    {
      id: "node-b4-01",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-server",
      prompt: "What does a web server do?",
      options: [
        "It waits for requests, for example from a browser, and sends back a response to each one",
        "It stores your files so you don't lose them",
        "It makes your computer run faster",
        "It turns your JavaScript into a website design, with the HTML and CSS generated for each page",
      ],
      answer: [0],
      explanation:
        "A server is like a post office counter. Requests come in, and for each one it sends a reply. In Node, the function you pass to `http.createServer` is where you write that reply.",
    },
    {
      id: "node-b4-02",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-server",
      type: "fill",
      prompt: "Fill the gap so each visitor gets the text `Hello` and the response finishes.",
      code: "const http = require('node:http');\nhttp.createServer((req, res) => {\n  res.{{1}}('Hello');\n}).listen(3000);",
      codeLang: "js",
      blanks: [{ options: ["end", "stop", "close", "done"], answer: 0 }],
      explanation:
        "`res.end('Hello')` sends the text and tells the browser the reply is complete. `res` has no `stop` or `done` method, and if you never end the response the browser just keeps waiting.",
    },
    {
      id: "node-b4-03",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-config",
      type: "output",
      prompt: "You run this with `node app.js` and no `USER_NAME` environment variable set. What does it print?",
      code: js`
        const name = process.env.USER_NAME || 'friend';
        console.log('Hello ' + name);
      `,
      codeLang: "js",
      answers: ["Hello friend"],
      explanation:
        "`USER_NAME` isn't set, so `process.env.USER_NAME` is `undefined`. The `||` then falls back to `'friend'`. If you ran `USER_NAME=Mia node app.js`, it would print `Hello Mia` instead.",
    },
    {
      id: "node-b4-04",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-config",
      prompt: "Why shouldn't you type a database password straight into your code?",
      options: [
        "Anyone who can see the code, or its history in git, can read the password",
        "Node can't read passwords from code",
        "Passwords make the code run more slowly",
        "It's fine, as long as the file is called secret.js and is small",
      ],
      answer: [0],
      explanation:
        "Code gets shared, copied and stored in git history, so a password inside it is effectively public. Keep it in an environment variable or a secret store, and read it with `process.env`.",
    },
    {
      id: "node-b4-05",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-server",
      prompt: "Your server calls `server.listen(3000)`. Which address do you open in your browser to visit it?",
      options: ["`http://localhost:3000`", "`http://3000.com`", "`http://node/3000`", "`file://server.js:80`"],
      answer: [0],
      explanation:
        "`localhost` means this computer, and `3000` is the port, like a door number, that your server is listening on. Opening `http://localhost:3000` sends a request to your server.",
    },

    // ───────────── Junior and up ─────────────
    {
      id: "d4-01",
      domain: "d4",
      level: "junior",
      lesson: "d4-http",
      prompt: "In `http.createServer((req, res) => { … })`, what are `req` and `res`?",
      options: [
        "`req` is a readable stream (IncomingMessage) and `res` is a writable stream (ServerResponse)",
        "Plain objects that hold the parsed JSON body, the headers and a `send` method",
        "Promises that resolve when the request finishes",
        "Two EventEmitters with no stream behaviour",
      ],
      answer: [0],
      explanation:
        "The request body arrives as a stream you read, using `'data'` and `'end'`, `pipe` or `for await`. The response is a stream you write to and must `end()`. Parsing JSON is left to a framework or to you.",
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
        "Sending a response doesn't leave the function. The code carries on to `res.json(user)`, which tries to send a second response. Write `return res.status(404).json(...)` instead.",
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
        "Middleware runs in the order you register it. Logging goes first so it sees everything. Parsing comes before anything that reads `req.body`, and auth comes before protected routes. The error handler goes last, so `next(err)` from anywhere above reaches it.",
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
        "It's registered with `app.error()`",
        "It throws an error instead of calling `next()`",
      ],
      answer: [0],
      explanation:
        "Express counts the function's parameters. With four, it's only called when an error is passed with `next(err)` or thrown in a handler. Keep all four, even if you don't use `next`.",
    },
    {
      id: "d4-05",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-middleware",
      prompt: "A request arrives at this Express app. What's logged?",
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
        "`next()` calls the next middleware straight away. When that one returns, control comes back and `B` is logged. That's why code after `next()` runs after the later middleware, and why you usually write `return next()`.",
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
        "Anything you assign to `process.env` is turned into a string, so `DEBUG` becomes `'false'`. That's a non-empty string, and non-empty strings are truthy. Compare it directly instead: `process.env.DEBUG === 'true'`.",
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
        "In a `.env` file committed to the repository, so the whole team and every single deployment always has the same key",
        "Base64-encoded inside the source code",
      ],
      answer: [0],
      explanation:
        "A secret in git is effectively public forever, through history, forks and CI logs. Inject secrets when you deploy, limit who can read them, and rotate them. Base64 is just an encoding, not encryption.",
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
        "`exec` runs the string in a shell, so the `;` starts a second command. That's command injection. Check the host, and use `execFile('ping', ['-c', '1', host])`, which passes arguments without a shell.",
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
        "`path.join` resolves `..` segments, so the result can point outside `uploads`. Resolve the path and check it still starts with the uploads folder, or look files up by ID instead of by name.",
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
        "`JSON.parse` creates a real key called `__proto__`. Inside `merge`, `target['__proto__']` is `Object.prototype`, so `isAdmin` gets written onto the prototype of every object. That's prototype pollution. Skip `__proto__`, `constructor` and `prototype` keys, or merge into `Object.create(null)` or a `Map`.",
    },
    {
      id: "d4-11",
      domain: "d4",
      level: "senior",
      lesson: "d4-security",
      prompt: "A security review flags this API token check. What's the concern, and the fix?",
      code: js`
        function checkToken(given) {
          return given === process.env.API_TOKEN;
        }
      `,
      codeLang: "js",
      options: [
        "`===` can stop at the first different character, which leaks timing information, so compare equal-length Buffers with `crypto.timingSafeEqual`",
        "`===` ignores case for strings, so use `localeCompare`",
        "`process.env` is slow to read on every request, so cache the token in a global at startup and compare against that cached copy with `==` instead of `===`",
        "Tokens should be compared with `==` to handle numbers",
      ],
      answer: [0],
      explanation:
        "String comparison can return early, so the response time can hint at how much of a guess was right. `timingSafeEqual` takes the same time for any two inputs of the same length. If the lengths can differ, hash both values first.",
    },
    {
      id: "d4-12",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-security",
      prompt: "How should a Node app store user passwords?",
      options: [
        "Hash them with a slow, salted password hash such as `crypto.scrypt`, bcrypt or argon2",
        "Hash them once with SHA-256",
        "Encrypt them with AES so support staff can see them",
        "Store them exactly as they are, but restrict database access to admins only",
      ],
      answer: [0],
      explanation:
        "Fast hashes like SHA-256 let attackers try billions of guesses a second. Password hashes are slow on purpose and salted for each user. You should never be able to turn a stored password back into the original.",
    },
    {
      id: "d4-13",
      domain: "d4",
      level: "senior",
      lesson: "d4-security",
      prompt: "Why is testing user input against a regex like `/^(a+)+$/` a denial-of-service risk in Node?",
      options: [
        "Nested quantifiers can make the regex engine backtrack exponentially on some inputs, blocking the single JavaScript thread",
        "Regexes run on the libuv thread pool, and this one can use up all four threads, so file and crypto work all queues behind it",
        "The regex leaks memory every time it's compiled",
        "Regexes can't handle Unicode, so they crash on emoji",
      ],
      answer: [0],
      explanation:
        "This is called ReDoS. A short string, like lots of `a`s followed by `!`, can take seconds or more to check, and no other request is served while the regex runs. Avoid nested quantifiers, limit input length, or use a regex engine that runs in linear time.",
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
      explanation:
        "A module-level array that only ever gets added to keeps every entry reachable forever. Send the data to an external logging system, or keep a buffer with a fixed size or time window.",
    },
    {
      id: "d4-15",
      domain: "d4",
      level: "senior",
      lesson: "d4-perf",
      type: "lines",
      prompt: "Memory grows as clients connect to and leave this server-sent events endpoint. Tap the line that leaks.",
      code: js`
        const bus = new EventEmitter();
        app.get('/events', (req, res) => {
          bus.on('update', (data) => res.write('data: ' + data + '\n\n'));
        });
      `,
      codeLang: "js",
      answer: [3],
      explanation:
        "Each connection adds a listener that holds on to its `res`, and nothing removes it when the client leaves. Keep a reference to the listener and call `bus.off('update', listener)` inside `req.on('close', ...)`.",
    },
    {
      id: "d4-16",
      domain: "d4",
      level: "senior",
      lesson: "d4-perf",
      type: "order",
      prompt: "Put the steps for tracking down a memory leak in a Node service in order.",
      items: [
        "Reproduce it under load and confirm heapUsed keeps growing",
        "Take a heap snapshot",
        "Send more traffic, then take a second snapshot",
        "Compare the snapshots to find object types whose count keeps growing",
        "Follow their retainers to the code holding them, fix it, and verify",
      ],
      explanation:
        "Measure first, so you know it's a real leak. Take snapshots far enough apart, and use the comparison view to find the object types that keep growing. The retainer chain shows which variable or listener is keeping them alive.",
    },
    {
      id: "d4-17",
      domain: "d4",
      level: "junior",
      lesson: "d4-perf",
      prompt: "Which are common causes of memory leaks in Node services? (Choose two.)",
      options: [
        "An in-memory cache, like a module-level Map, with no size limit or expiry",
        "Event listeners added on every request and never removed",
        "Using `const` instead of `let`",
        "Reading files with streams",
        "Calling `setImmediate`",
      ],
      answer: [0, 1],
      explanation:
        "Leaks are references that stick around after they're useful: growing caches, forgotten listeners, intervals that are never cleared, and closures that hold large objects. Variable keywords and streams don't leak on their own.",
    },
    {
      id: "d4-18",
      domain: "d4",
      level: "staff",
      lesson: "d4-http",
      type: "order",
      prompt: "Kubernetes sends SIGTERM during a rolling deploy. Put the steps of a graceful shutdown that drops no requests in order.",
      items: [
        "Catch SIGTERM and start failing the readiness check",
        "Stop accepting new connections with `server.close()`",
        "Let in-flight requests finish, with a hard timeout",
        "Close database pools and queue connections",
        "Exit with code 0",
      ],
      explanation:
        "Failing the readiness check takes the pod out of the load balancer. `server.close()` stops new connections while existing ones finish. Close shared resources only once requests are done, and keep a timeout so one stuck request can't hold up the deploy forever.",
    },
    {
      id: "d4-19",
      domain: "d4",
      level: "staff",
      lesson: "d4-perf",
      prompt: "A service's RSS grows slowly for days until the container is killed for running out of memory, but heap snapshots show the JS heap is stable. Where do you look next?",
      options: [
        "Memory outside the V8 heap: compare rss with heapUsed, external and arrayBuffers from `process.memoryUsage()` (Buffers, native addons)",
        "The heap snapshot tool must be wrong, so increase `--max-old-space-size` until the restarts stop, since rss and the heap are always the same number",
        "Unhandled promise rejections",
        "The number of npm dependencies",
      ],
      answer: [0],
      explanation:
        "Heap snapshots only show the V8 heap. Buffers, native addons and allocator fragmentation show up in RSS, `external` and `arrayBuffers` instead. Raising the heap limit doesn't help with memory that isn't in the heap.",
    },
    {
      id: "d4-20",
      domain: "d4",
      level: "staff",
      lesson: "d4-security",
      prompt: "Secrets leaked because an error handler logged the whole of `process.env`. Which fixes should you put in place? (Choose two.)",
      options: [
        "Rotate the leaked secrets, and load secrets from a secret manager with access controls",
        "Use a structured logger with redaction rules for sensitive fields",
        "Base64-encode secrets in environment variables",
        "Commit the .env file so everyone uses the same values",
        "Turn off logging in production",
      ],
      answer: [0, 1],
      explanation:
        "First limit the damage by rotating the secrets. Then make the same mistake hard to repeat, with redaction on by default and access only for those who need it. Encoding isn't protection, and losing all your logs swaps one problem for another.",
    },
    {
      id: "d4-21",
      domain: "d4",
      level: "staff",
      lesson: "d4-http",
      prompt: "You want every log line, in every module, to include the current request's ID, without passing it through every function. What do you use?",
      options: [
        "`AsyncLocalStorage` from `node:async_hooks`: run each request inside `als.run(ctx, ...)` and read the context anywhere further down",
        "A global variable set at the start of each request and read further down, which is safe because Node only ever handles one request at a time",
        "`process.env.REQUEST_ID`, set for each request",
        "A worker thread per request",
      ],
      answer: [0],
      explanation:
        "Requests take turns on one thread, so a global would be overwritten by the next request. AsyncLocalStorage follows the chain of async calls through callbacks, promises and timers, so each request keeps its own context. Tracing libraries use the same mechanism.",
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
      explanation: "`res.write` sends part of the body but leaves the response open. Without `res.end()`, the client keeps waiting for more.",
    },
    {
      id: "d4-23",
      domain: "d4",
      level: "junior",
      lesson: "d4-middleware",
      prompt: "What does calling `next()` do inside Express middleware?",
      options: [
        "It passes control to the next matching middleware or route, and `next(err)` jumps to error handlers",
        "It ends the response with status 200",
        "It restarts the current middleware",
        "It moves the request to the next server in the cluster, so a busy worker can hand the request off to another",
      ],
      answer: [0],
      explanation:
        "Middleware either responds or calls `next`. If it does neither, the request hangs. Passing any argument to `next`, apart from `'route'` or `'router'`, is treated as an error.",
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
      explanation:
        "Environment variables are always strings, so `+ 1` sticks a 1 on the end instead of adding. Convert it first with `const port = Number(process.env.PORT) || 3000`, and check your config at startup.",
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
        "The error middleware never runs, because the rejection is unhandled, and on modern Node that crashes the process by default",
        "Express catches it automatically and the error middleware sends a 500, the same way it does for errors thrown synchronously in a route",
        "Express retries the handler once",
        "The client gets an empty 200 response",
      ],
      answer: [0],
      explanation:
        "Express 4 ignores the promise an async handler returns. Wrap your handlers with `try/catch` and `next(err)`, or a helper, or upgrade. Express 5 passes rejected promises to your error middleware automatically.",
    },
  ],

  cards: [
    { id: "c-d4-createserver", domain: "d4", kind: "service", term: "http.createServer()", definition: "Creates an HTTP server. Its handler gets req (a Readable) and res (a Writable) for each request." },
    { id: "c-d4-close", domain: "d4", kind: "service", term: "server.close()", definition: "Stops taking new connections and calls back once the existing ones have finished. It's the heart of a graceful shutdown." },
    { id: "c-d4-env", domain: "d4", kind: "service", term: "process.env", definition: "The environment variables. Every value is a string or undefined, so convert and check them." },
    { id: "c-d4-envfile", domain: "d4", kind: "service", term: "--env-file", definition: "A Node flag (20.6 and later) that loads variables from a .env file at startup, with no extra package." },
    { id: "c-d4-tse", domain: "d4", kind: "service", term: "crypto.timingSafeEqual()", definition: "Compares two buffers of the same length in constant time, so how long it takes doesn't give secrets away." },
    { id: "c-d4-scrypt", domain: "d4", kind: "service", term: "crypto.scrypt()", definition: "A built-in password hash that's slow and uses lots of memory on purpose. Called asynchronously, it runs on the thread pool." },
    { id: "c-d4-mem", domain: "d4", kind: "service", term: "process.memoryUsage()", definition: "Reports rss, heapTotal, heapUsed, external and arrayBuffers, so you can tell a heap leak from Buffer or native memory." },
    { id: "c-d4-als", domain: "d4", kind: "service", term: "AsyncLocalStorage", definition: "Stores context for each request that follows it through async calls. Used for request IDs, tracing and logging." },
    { id: "c-d4-mw", domain: "d4", kind: "concept", term: "Middleware", definition: "A function (req, res, next) in a chain. It responds, calls next() to carry on, or calls next(err) to jump to error handlers." },
    { id: "c-d4-graceful", domain: "d4", kind: "concept", term: "Graceful shutdown", definition: "What to do on SIGTERM: fail readiness, stop new connections, finish running work, close resources, then exit." },
    { id: "c-d4-leak", domain: "d4", kind: "concept", term: "Memory leak", definition: "Memory that's still reachable but no longer needed, so the garbage collector can never free it." },
    { id: "c-d4-cmdinj", domain: "d4", kind: "concept", term: "Command injection", definition: "User input that a shell runs as a command, as with exec('cmd ' + input). Use execFile or spawn with arguments instead." },
    { id: "c-d4-traversal", domain: "d4", kind: "concept", term: "Path traversal", definition: "Input like ../../ that escapes the folder you meant. Resolve the path and check where it starts." },
    { id: "c-d4-proto", domain: "d4", kind: "concept", term: "Prototype pollution", definition: "Writing __proto__ or constructor keys from untrusted input, which changes Object.prototype for the whole app." },
    { id: "c-d4-redos", domain: "d4", kind: "concept", term: "ReDoS", definition: "A regex that backtracks out of control on crafted input and blocks the event loop." },
  ],
});
