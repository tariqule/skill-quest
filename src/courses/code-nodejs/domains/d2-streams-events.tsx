import { CodeBlock, CodeCompare, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { js } from "../js";
import { BackpressureLab } from "../labs";

/** Module 2: streams and backpressure, Buffers and encodings, and EventEmitter. */
export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "Streams, Buffers & Events",
    world: "The Stream Rapids",
    weight: 25,
    emoji: "🌊",
    color: "#38bdf8",
    summary: "Readable, Writable, Duplex and Transform streams, backpressure and pipeline(), Buffers and encodings, and how EventEmitter really behaves.",
  },

  tasks: [
    { id: "2.1", title: "Streams and backpressure", covers: ["The four stream types", "pipe() vs pipeline()", "write() returning false and 'drain'", "Flowing vs paused mode, async iteration"] },
    { id: "2.2", title: "Buffers and encodings", covers: ["Bytes vs characters", "Buffer.from, alloc, allocUnsafe", "subarray shares memory", "Multi-byte characters across chunks"] },
    { id: "2.3", title: "EventEmitter", covers: ["on, once, prependListener, off", "emit is synchronous", "The 'error' event", "Listener leaks and MaxListenersExceededWarning"] },
  ],

  lessons: [
    {
      id: "d2-streams",
      level: "junior",
      task: "2.1",
      title: "Four kinds of stream",
      check: ["d2-02", "d2-01"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "📤", title: "Readable", text: "A source you read from: fs.createReadStream, an HTTP request.", color: "#38bdf8" },
              { icon: "📥", title: "Writable", text: "A destination you write to: fs.createWriteStream, an HTTP response.", color: "#38bdf8" },
              { icon: "🔁", title: "Duplex", text: "Both, independently: a TCP socket.", color: "#38bdf8" },
              { icon: "⚗️", title: "Transform", text: "A Duplex whose output is computed from its input: zlib.createGzip.", color: "#38bdf8" },
            ]}
          />
          <CodeCompare
            lang="js"
            left={{
              title: "pipe(): errors not forwarded",
              code: js`
                fs.createReadStream('in.log')
                  .pipe(zlib.createGzip())
                  .pipe(fs.createWriteStream('in.log.gz'));
                // an error leaves streams open
              `,
            }}
            right={{
              title: "pipeline(): errors + cleanup",
              code: js`
                const { pipeline } = require('node:stream/promises');
                await pipeline(
                  fs.createReadStream('in.log'),
                  zlib.createGzip(),
                  fs.createWriteStream('in.log.gz'),
                );
              `,
            }}
          />
        </div>
      ),
      points: [
        "Streams process data piece by piece, so memory stays flat no matter how big the input is.",
        "Readable streams start paused. Adding a 'data' listener or calling pipe() switches them to flowing mode.",
        "pipeline() connects streams, propagates backpressure, forwards the first error, and destroys every stream on failure.",
        "Readable streams are async iterable: for await (const chunk of stream) reads at the pace of your loop body.",
      ],
      tip: "When asked \"how would you process a 10 GB file?\", say streams plus pipeline(), and mention constant memory and backpressure.",
    },
    {
      id: "d2-backpressure",
      level: "senior",
      task: "2.1",
      title: "Backpressure: don't drown the consumer",
      check: ["d2-04", "d2-03"],
      visual: <BackpressureLab />,
      points: [
        "Every stream has an internal buffer. highWaterMark is the size at which it asks you to stop.",
        "writable.write() returns false when the buffer has reached highWaterMark. The chunk is still queued; nothing is lost.",
        "When write() returns false, stop writing and wait for the 'drain' event before writing more.",
        "pipe(), pipeline(), and for await all handle backpressure for you. Hand-written write loops usually don't.",
      ],
      tip: "Say the full loop: write until false, wait for 'drain', resume. Then say pipeline() does it for you.",
    },
    {
      id: "d2-buffers",
      level: "junior",
      task: "2.2",
      title: "Buffers: raw bytes",
      check: ["d2-08", "d2-09"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="js"
            code={js`
              const b = Buffer.from('héllo');   // UTF-8 by default
              b.length;                         // 6 bytes ('é' is 2 bytes)
              'héllo'.length;                   // 5 UTF-16 code units
              b.toString('hex');                // '68c3a96c6c6f'
              Buffer.alloc(16);                 // zero-filled, safe
              Buffer.allocUnsafe(16);           // fast, may hold old memory
              const view = b.subarray(0, 2);    // shares memory with b
            `}
          />
          <Tiles
            tiles={[
              { icon: "🧱", title: "A Buffer is a Uint8Array", text: "Fixed length, raw bytes. It doesn't grow like an array.", color: "#38bdf8" },
              { icon: "🔤", title: "Bytes are not characters", text: "Decode once, after joining all chunks, or let the stream decode for you with setEncoding('utf8').", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Buffer.from(string) encodes to bytes (UTF-8 unless you say otherwise); buf.toString(encoding) decodes back.",
        "Buffer.alloc zero-fills. Buffer.allocUnsafe skips that, so it can contain old data from memory until you overwrite it.",
        "subarray (and the older slice) return a view on the same memory: writing to the view changes the original.",
        "A multi-byte character can be split across two chunks. Join chunks with Buffer.concat before decoding, or use setEncoding / StringDecoder.",
      ],
      tip: "If asked why a Buffer's length differs from the string's, explain UTF-8 bytes vs JavaScript's UTF-16 string length.",
    },
    {
      id: "d2-emitter",
      level: "intermediate",
      task: "2.3",
      title: "EventEmitter in depth",
      check: ["d2-12", "d2-15"],
      visual: (
        <CodeBlock
          lang="js"
          code={js`
            const EventEmitter = require('node:events');
            const bus = new EventEmitter();

            bus.on('order', (o) => console.log('email', o.id));
            bus.once('order', () => console.log('first order only'));
            bus.prependListener('order', () => console.log('audit first'));

            bus.emit('order', { id: 7 });  // runs all three, synchronously, now
            bus.on('error', (err) => log(err)); // without this, emit('error') throws
            bus.off('order', handler);     // remove what you add
          `}
        />
      ),
      points: [
        "emit() calls every listener synchronously, in registration order (prependListener jumps the queue), before it returns.",
        "once() listeners remove themselves after the first call.",
        "Emitting 'error' with no 'error' listener throws, which usually crashes the process.",
        "More than 10 listeners for one event prints MaxListenersExceededWarning: usually a leak where listeners are added per request.",
      ],
      tip: "\"Is EventEmitter async?\" is a favourite trap. No: emit is synchronous. Listeners can choose to do async work.",
    },
  ],

  questions: [
    {
      id: "d2-01",
      domain: "d2",
      level: "junior",
      lesson: "d2-streams",
      type: "match",
      prompt: "Match each stream type to an example.",
      pairs: [
        ["Readable", "fs.createReadStream()"],
        ["Writable", "fs.createWriteStream()"],
        ["Duplex", "A net.Socket (TCP connection)"],
        ["Transform", "zlib.createGzip()"],
      ],
      explanation: "Readable is a source, Writable a destination, Duplex both at once (independent sides), and Transform a Duplex whose output is computed from its input.",
    },
    {
      id: "d2-02",
      domain: "d2",
      level: "junior",
      lesson: "d2-streams",
      prompt: "Why stream a 5 GB log file instead of using `fs.readFile`?",
      options: [
        "Streaming processes it chunk by chunk with roughly constant memory; readFile tries to load all 5 GB at once",
        "readFile is synchronous and streams are asynchronous",
        "Streams compress the file automatically",
        "readFile can't read text files",
      ],
      answer: [0],
      explanation:
        "`fs.readFile` is asynchronous, but it buffers the whole file in memory (and very large files exceed Buffer/string limits). A stream holds only a small buffer at a time and can start work on the first chunk immediately.",
    },
    {
      id: "d2-03",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-backpressure",
      type: "lines",
      prompt: "Memory climbs to gigabytes while this runs. Tap the line that ignores backpressure.",
      code: js`
        const fs = require('fs');
        const out = fs.createWriteStream('big.txt');
        for (let i = 0; i < 1e7; i++) {
          out.write('line ' + i + '\n');
        }
        out.end();
      `,
      codeLang: "js",
      answer: [4],
      explanation:
        "`write()` returns `false` once the buffer is full, but the loop keeps writing, so every line piles up in memory. Stop on `false` and resume on `'drain'`, or build a Readable and use `pipeline()`.",
    },
    {
      id: "d2-04",
      domain: "d2",
      level: "junior",
      lesson: "d2-backpressure",
      prompt: "What does it mean when `writable.write(chunk)` returns `false`?",
      options: [
        "The internal buffer has reached highWaterMark; stop writing until the `'drain'` event",
        "The chunk was dropped and must be written again",
        "The stream has closed",
        "The chunk was written to disk synchronously",
      ],
      answer: [0],
      explanation: "The chunk is still accepted and queued. `false` is a request to pause. Keep writing anyway and the buffer grows without limit.",
    },
    {
      id: "d2-05",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-backpressure",
      type: "order",
      prompt: "Order the steps of a backpressure-aware write loop.",
      items: ["Call `write(chunk)` for the next chunk", "If it returned `false`, stop writing", "Wait for the `'drain'` event", "Resume writing from where you stopped", "Call `end()` after the last chunk"],
      explanation: "Write until `false`, wait for `'drain'`, continue, and finally `end()`. That's exactly what `pipe()` and `pipeline()` do internally.",
    },
    {
      id: "d2-06",
      domain: "d2",
      level: "senior",
      lesson: "d2-streams",
      prompt: "`in.txt` doesn't exist. What happens?",
      code: js`
        fs.createReadStream('in.txt')
          .pipe(zlib.createGzip())
          .pipe(fs.createWriteStream('out.gz'));
      `,
      codeLang: "js",
      options: [
        "The read stream emits an `'error'` nobody listens to, so the process crashes; `.pipe()` doesn't forward it or clean up the other streams",
        "`.pipe()` catches the error and closes all three streams",
        "An empty `out.gz` is written and the error is ignored",
        "The error is passed to the gzip stream's `'error'` handler",
      ],
      answer: [0],
      explanation:
        "`.pipe()` handles backpressure but not errors. Each stream needs its own `'error'` handler, or use `stream.pipeline()`, which forwards the first error to one callback/promise and destroys every stream.",
    },
    {
      id: "d2-07",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-streams",
      type: "order",
      prompt: "Order the streams passed to `pipeline()` to redact emails from a log and save it gzipped.",
      items: ["`fs.createReadStream('app.log')`", "`redactEmails()` (a Transform)", "`zlib.createGzip()`", "`fs.createWriteStream('app.log.gz')`"],
      explanation: "Source first, destination last. Redact before compressing: once the bytes are gzipped, a text Transform can't see the email addresses.",
    },
    {
      id: "d2-08",
      domain: "d2",
      level: "junior",
      lesson: "d2-buffers",
      prompt: "What does this print?",
      code: js`
        console.log('héllo'.length, Buffer.from('héllo').length);
      `,
      codeLang: "js",
      options: ["5 6", "5 5", "6 6", "6 5"],
      answer: [0],
      explanation: "The string has 5 characters. In UTF-8 (Buffer's default), `é` takes 2 bytes, so the Buffer is 6 bytes long.",
    },
    {
      id: "d2-09",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-buffers",
      prompt: "What does this print?",
      code: js`
        const a = Buffer.from('abc');
        const b = a.subarray(0, 2);
        b[0] = 0x7a; // 'z'
        console.log(a.toString(), b.toString());
      `,
      codeLang: "js",
      options: ["zbc zb", "abc zb", "abc ab", "zbc ab"],
      answer: [0],
      explanation: "`subarray` returns a view on the same memory, not a copy. Changing `b[0]` changes `a[0]`. Use `Buffer.from(a.subarray(0, 2))` when you need an independent copy.",
    },
    {
      id: "d2-10",
      domain: "d2",
      level: "senior",
      lesson: "d2-buffers",
      prompt: "Why can `Buffer.allocUnsafe(size)` be a security risk?",
      options: [
        "Its memory isn't zeroed, so until you overwrite every byte it may contain old data, such as secrets from earlier requests",
        "It allocates outside the process and other programs can read it",
        "It can't be garbage collected",
        "It disables bounds checking, so writes past the end corrupt memory",
      ],
      answer: [0],
      explanation:
        "`allocUnsafe` is faster because it skips zero-filling. If the buffer is sent before it's fully written, leftover memory can leak. Use `Buffer.alloc` unless you'll overwrite every byte right away.",
    },
    {
      id: "d2-11",
      domain: "d2",
      level: "senior",
      lesson: "d2-buffers",
      type: "lines",
      prompt: "Users with emoji or accented names sometimes get garbled text. Tap the line that causes it.",
      code: js`
        let body = '';
        req.on('data', (chunk) => {
          body += chunk.toString('utf8');
        });
        req.on('end', () => {
          res.end(JSON.parse(body).name);
        });
      `,
      codeLang: "js",
      answer: [3],
      explanation:
        "A multi-byte UTF-8 character can be split across two chunks. Decoding each chunk alone turns both halves into replacement characters. Collect chunks and decode once with `Buffer.concat(chunks).toString()`, or call `req.setEncoding('utf8')`.",
    },
    {
      id: "d2-12",
      domain: "d2",
      level: "junior",
      lesson: "d2-emitter",
      prompt: "What does this print?",
      code: js`
        const EventEmitter = require('events');
        const e = new EventEmitter();
        e.on('ready', () => console.log('listener'));
        console.log('before');
        e.emit('ready');
        console.log('after');
      `,
      codeLang: "js",
      options: ["before listener after", "before after listener", "listener before after", "before after"],
      answer: [0],
      explanation: "`emit()` calls every listener synchronously and only returns after they've all run. EventEmitter doesn't defer anything to the event loop.",
    },
    {
      id: "d2-13",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-emitter",
      prompt: "What does this print?",
      code: js`
        const EventEmitter = require('events');
        const e = new EventEmitter();
        e.on('x', () => console.log('a'));
        e.prependListener('x', () => console.log('b'));
        e.once('x', () => console.log('c'));
        e.emit('x');
        e.emit('x');
      `,
      codeLang: "js",
      options: ["b a c b a", "a b c a b", "b a c b a c", "a c b a"],
      answer: [0],
      explanation: "Listeners run in order, and `prependListener` puts `b` first: b, a, c. The `once` listener removes itself, so the second emit runs only b, a.",
    },
    {
      id: "d2-14",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-emitter",
      type: "lines",
      prompt: "`started` never prints. Tap the line that causes it.",
      code: js`
        const EventEmitter = require('events');
        class Job extends EventEmitter {
          constructor() {
            super();
            this.emit('start');
          }
        }
        const job = new Job();
        job.on('start', () => console.log('started'));
      `,
      codeLang: "js",
      answer: [5],
      explanation:
        "The constructor emits synchronously, before the caller has had a chance to attach a listener. Defer it with `process.nextTick(() => this.emit('start'))` so listeners added right after construction still hear it.",
    },
    {
      id: "d2-15",
      domain: "d2",
      level: "junior",
      lesson: "d2-emitter",
      prompt: "What happens when this runs?",
      code: js`
        const EventEmitter = require('events');
        const e = new EventEmitter();
        e.emit('error', new Error('disk full'));
        console.log('still running');
      `,
      codeLang: "js",
      options: [
        "It throws `Error: disk full`, and `still running` never prints",
        "Nothing happens because no one is listening, then `still running` prints",
        "It prints a warning and then `still running`",
        "It prints `still running`, then the error later",
      ],
      answer: [0],
      explanation: "`'error'` is special: emitting it with no `'error'` listener throws the error. That's why every stream or emitter you create needs an error handler.",
    },
    {
      id: "d2-16",
      domain: "d2",
      level: "senior",
      lesson: "d2-emitter",
      prompt: "After a few requests Node prints `MaxListenersExceededWarning: Possible EventEmitter memory leak detected`. What's the right fix?",
      code: js`
        app.get('/price', (req, res) => {
          priceFeed.on('tick', (p) => { lastPrice = p; });
          res.json({ price: lastPrice });
        });
      `,
      codeLang: "js",
      options: [
        "Register the `'tick'` listener once at startup instead of on every request",
        "Call `priceFeed.setMaxListeners(0)` to silence the warning",
        "Change `on` to `prependListener`",
        "Wrap the handler in `try/catch`",
      ],
      answer: [0],
      explanation:
        "Every request adds another listener that is never removed: a leak that also slows each emit. The warning fires above 10 listeners for one event. Raising the limit only hides it.",
    },
    {
      id: "d2-17",
      domain: "d2",
      level: "senior",
      lesson: "d2-streams",
      prompt: "How does reading the file relate to the database inserts here?",
      code: js`
        async function importLog() {
          for await (const chunk of fs.createReadStream('huge.log')) {
            await db.insert(chunk);
          }
        }
      `,
      codeLang: "js",
      options: [
        "Reading pauses while each insert runs, so memory stays bounded: async iteration applies backpressure",
        "The whole file is read into memory first, then inserted chunk by chunk",
        "Inserts run in parallel, one per chunk, as fast as the disk can read",
        "It throws, because streams can't be used with for await",
      ],
      answer: [0],
      explanation:
        "Readable streams are async iterables. The loop only asks for the next chunk after the body finishes, so the stream stays paused (with a small buffer) while each insert is in flight.",
    },
    {
      id: "d2-18",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-streams",
      prompt: "Which actions switch a paused Readable stream into flowing mode? (Choose two.)",
      options: ["Adding a `'data'` listener", "Calling `readable.pipe(dest)`", "Adding an `'end'` listener", "Calling `readable.pause()`", "Creating the stream"],
      answer: [0, 1],
      explanation: "Readables start paused. A `'data'` listener, `pipe()`, or `resume()` makes data flow. An `'end'` listener alone doesn't, and `pause()` does the opposite.",
    },
    {
      id: "d2-19",
      domain: "d2",
      level: "staff",
      lesson: "d2-backpressure",
      prompt: "A Node service proxies user uploads to object storage. When storage gets slow, memory grows until the pods are OOM-killed. What's the best fix?",
      options: [
        "Pipe the request into the upload with `pipeline()` so a slow destination pauses reading from the client",
        "Raise the heap limit and add more pods",
        "Buffer each upload fully in memory, then send it in one request",
        "Add retries with exponential backoff to the upload call",
      ],
      answer: [0],
      explanation:
        "Memory grows because data arrives faster than it leaves and nothing pushes back. With end-to-end backpressure, TCP flow control slows the client when storage is slow, so memory per upload stays bounded. More memory or pods only delays the crash.",
    },
    {
      id: "d2-20",
      domain: "d2",
      level: "staff",
      lesson: "d2-streams",
      prompt: "A teammate proposes this for importing a 10 GB CSV into the database. What do you recommend?",
      code: js`
        const text = await fs.promises.readFile('users.csv', 'utf8');
        for (const row of text.split('\n')) {
          await db.insert(parse(row));
        }
      `,
      codeLang: "js",
      options: [
        "Stream it: read stream → CSV-parse Transform → batch rows → a Writable that inserts each batch, all in `pipeline()`",
        "Keep it, but start Node with a 16 GB heap",
        "Read it with `readFileSync` instead, because it's faster",
        "Insert every row in parallel with `Promise.all`",
      ],
      answer: [0],
      explanation:
        "A 10 GB file won't fit in a single JavaScript string (V8 caps string length far below that). Streaming with batching keeps memory flat, backpressure stops reading while the DB is busy, and batches cut round trips. Unbounded `Promise.all` would overwhelm the database.",
    },
    {
      id: "d2-21",
      domain: "d2",
      level: "staff",
      lesson: "d2-emitter",
      prompt:
        "A monolith uses an in-process EventEmitter so the orders module can tell the email module about new orders. The app now runs as 6 replicas and some emails go missing during deploys. What's the core problem and fix?",
      options: [
        "EventEmitter events live in one process's memory, with no durability or retries; use a durable queue or broker (for example with an outbox table)",
        "EventEmitter has a 10-listener limit; raise it with setMaxListeners",
        "Events are asynchronous and arrive out of order; add sequence numbers",
        "Replicas share one EventEmitter, so each event is handled 6 times",
      ],
      answer: [0],
      explanation:
        "An in-process emitter only reaches listeners in that same process, and pending work is lost if the process exits mid-deploy. Cross-process, must-not-lose events need a durable message system with acknowledgements.",
    },
    {
      id: "d2-22",
      domain: "d2",
      level: "junior",
      lesson: "d2-buffers",
      prompt: "What is a Node.js `Buffer`?",
      options: [
        "A fixed-length sequence of raw bytes; a subclass of `Uint8Array`",
        "A growable array of strings",
        "A queue that streams use to store events",
        "A cache for HTTP responses",
      ],
      answer: [0],
      explanation: "Buffers hold binary data: file contents, network packets, encoded text. Their size is fixed at creation and every element is a byte (0–255).",
    },
    {
      id: "d2-23",
      domain: "d2",
      level: "junior",
      lesson: "d2-buffers",
      prompt: "What does this print?",
      code: js`
        console.log(Buffer.from('hi').toString('hex'));
      `,
      codeLang: "js",
      options: ["6869", "hi", "<Buffer 68 69>", "aGk="],
      answer: [0],
      explanation: "`h` is byte 0x68 and `i` is 0x69, so hex encoding gives `6869`. `aGk=` would be base64. `<Buffer 68 69>` is what `console.log(buf)` shows for the Buffer itself.",
    },
    {
      id: "d2-24",
      domain: "d2",
      level: "staff",
      lesson: "d2-backpressure",
      prompt: "A WebSocket service broadcasts every price update to 50,000 clients. A few slow mobile clients make memory balloon. What policy fixes it?",
      options: [
        "Bound each client's send buffer: when its buffered amount is over a limit, drop or coalesce updates for that client, or disconnect it",
        "Wait for every client to acknowledge before sending the next update to anyone",
        "Raise the heap limit so slow clients can catch up",
        "Send updates to slow clients from a worker thread",
      ],
      answer: [0],
      explanation:
        "Fan-out turns one slow consumer into unbounded buffering. Per-connection limits (checking `bufferedAmount`/`writableLength`) isolate slow clients. For prices, the latest value is what matters, so coalescing is safe. Global waiting would let one phone slow everyone.",
    },
  ],

  cards: [
    { id: "c-d2-pipeline", domain: "d2", kind: "service", term: "stream.pipeline()", definition: "Connects streams with backpressure, forwards the first error, and destroys all of them on failure. Promise version in node:stream/promises." },
    { id: "c-d2-readable", domain: "d2", kind: "service", term: "Readable", definition: "A stream you read from: files, HTTP requests, process.stdin. Async iterable." },
    { id: "c-d2-writable", domain: "d2", kind: "service", term: "Writable", definition: "A stream you write to: files, HTTP responses. write() returns false when its buffer is full." },
    { id: "c-d2-transform", domain: "d2", kind: "service", term: "Transform", definition: "A Duplex stream that computes output from input, like zlib.createGzip or a CSV parser." },
    { id: "c-d2-duplex", domain: "d2", kind: "service", term: "Duplex", definition: "A stream that is both readable and writable, with independent sides, like a TCP socket." },
    { id: "c-d2-bfrom", domain: "d2", kind: "service", term: "Buffer.from()", definition: "Creates a Buffer from a string (UTF-8 by default), array, or another buffer." },
    { id: "c-d2-alloc", domain: "d2", kind: "service", term: "Buffer.alloc()", definition: "Allocates a zero-filled Buffer of a fixed size. Safe default." },
    { id: "c-d2-allocu", domain: "d2", kind: "service", term: "Buffer.allocUnsafe()", definition: "Allocates a Buffer without zeroing it. Faster, but may contain old memory until overwritten." },
    { id: "c-d2-concat", domain: "d2", kind: "service", term: "Buffer.concat()", definition: "Joins a list of Buffers into one. Collect chunks, concat, then decode once." },
    { id: "c-d2-decoder", domain: "d2", kind: "service", term: "StringDecoder", definition: "Decodes bytes to text across chunk boundaries without breaking multi-byte characters." },
    { id: "c-d2-ee", domain: "d2", kind: "service", term: "EventEmitter", definition: "Node's pub/sub class: on, once, off, emit. Listeners run synchronously in order." },
    { id: "c-d2-once", domain: "d2", kind: "service", term: "events.once()", definition: "Returns a promise that resolves the next time an emitter fires an event, e.g. await once(server, 'listening')." },
    { id: "c-d2-bp", domain: "d2", kind: "concept", term: "Backpressure", definition: "Slowing a fast producer to match a slow consumer, so buffered data (and memory) stays bounded." },
    { id: "c-d2-hwm", domain: "d2", kind: "concept", term: "highWaterMark", definition: "A stream's buffer threshold. Above it, write() returns false and readables stop reading ahead." },
    { id: "c-d2-drain", domain: "d2", kind: "concept", term: "'drain' event", definition: "Emitted by a Writable when it's safe to write again after write() returned false." },
    { id: "c-d2-flowing", domain: "d2", kind: "concept", term: "Flowing vs paused mode", definition: "Readables start paused. A 'data' listener, pipe(), or resume() makes data flow automatically." },
  ],

  challenges: [
    {
      id: "ch-node-crash",
      domain: "d2",
      lesson: "d2-backpressure",
      title: "Blow up the heap",
      goal: "Make the stream crash with an out-of-memory error.",
      hint: "Turn off backpressure and make the producer much faster than the consumer.",
      takeaway: "Ignoring write()'s false lets the buffer grow by (producer − consumer) every tick until memory runs out.",
      render: (onSolved) => <BackpressureLab goal="crash" onSolved={onSolved} />,
    },
    {
      id: "ch-node-tame",
      domain: "d2",
      lesson: "d2-backpressure",
      title: "Tame the firehose",
      goal: "With the producer faster than the consumer, deliver all 60 chunks without crashing.",
      hint: "Respect backpressure: stop when write() returns false and resume on 'drain'.",
      takeaway: "With backpressure the buffer never goes far past highWaterMark, however fast the producer is.",
      render: (onSolved) => <BackpressureLab goal="tame" onSolved={onSolved} />,
    },
  ],
});
