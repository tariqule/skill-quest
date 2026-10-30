import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
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
    summary:
      "How Node moves data a piece at a time. You'll meet the four kinds of stream, backpressure and pipeline(), Buffers and text encodings, and how EventEmitter really behaves.",
  },

  tasks: [
    { id: "2.1", title: "Streams and backpressure", covers: ["The four stream types", "pipe() vs pipeline()", "write() returning false and 'drain'", "Flowing vs paused mode, async iteration"] },
    { id: "2.2", title: "Buffers and encodings", covers: ["Bytes vs characters", "Buffer.from, alloc, allocUnsafe", "subarray shares memory", "Multi-byte characters across chunks"] },
    { id: "2.3", title: "EventEmitter", covers: ["on, once, prependListener, off", "emit is synchronous", "The 'error' event", "Listener leaks and MaxListenersExceededWarning"] },
  ],

  lessons: [
    {
      id: "d2-start-streams",
      level: "beginner",
      task: "2.1",
      title: "A tap, not a bathtub",
      check: ["node-b2-01", "node-b2-02"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#38bdf8"
            steps={[
              { icon: "📄", label: "Big file on disk", sub: "Say, a 5 GB log" },
              { icon: "🚰", label: "Read stream", sub: "Hands you one small chunk at a time" },
              { icon: "🛠️", label: "Your code", sub: "Works on each chunk as it arrives" },
              { icon: "✅", label: "Done", sub: "Memory use stayed small the whole time" },
            ]}
          />
          <CodeBlock
            lang="js"
            caption="Each chunk is a small piece of the file. The whole file is never in memory at once."
            code={js`
              const fs = require('node:fs');
              const stream = fs.createReadStream('big.log');
              stream.on('data', (chunk) => {
                console.log('got', chunk.length, 'bytes');
              });
            `}
          />
        </div>
      ),
      points: [
        "Think of filling a bathtub before you can wash, compared with washing under a running tap. A stream is the tap.",
        "A stream gives you data in small pieces called chunks, so you can start working before the whole thing has arrived.",
        "That keeps memory use small, even for a file far bigger than your computer's memory.",
        "Node uses streams everywhere: reading files, receiving web requests and sending responses.",
      ],
      tip: "When you hear \"stream\", picture water through a pipe. It keeps coming in small amounts until it's done.",
    },
    {
      id: "d2-start-events",
      level: "beginner",
      task: "2.3",
      title: "Events: a doorbell for your code",
      check: ["node-b2-03", "node-b2-04"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={2}
            tiles={[
              { icon: "👂", title: "on: listen", text: "door.on('ring', fn) says: whenever the bell rings, run fn.", color: "#38bdf8" },
              { icon: "🔔", title: "emit: ring the bell", text: "door.emit('ring') runs every function that's listening for 'ring'.", color: "#38bdf8" },
            ]}
          />
          <CodeBlock
            lang="js"
            caption="Prints Hi Sam, then Hi Ana."
            code={js`
              const EventEmitter = require('node:events');
              const door = new EventEmitter();
              door.on('ring', (name) => console.log('Hi ' + name));
              door.emit('ring', 'Sam');
              door.emit('ring', 'Ana');
            `}
          />
        </div>
      ),
      points: [
        "An event is a named thing that happens, like a doorbell ringing. Your code can ask to be told when it happens.",
        "`on('ring', fn)` registers a listener. A listener is a function that waits for that event name.",
        "`emit('ring')` is the bell. It runs every listener for `'ring'`, and any extra values you pass go to them.",
        "Lots of Node objects are event emitters. A stream, for example, emits `'data'` for each chunk and `'end'` when it's finished.",
      ],
      tip: "The event name is just a string you choose. The listener and the emit must use exactly the same name.",
    },
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
              { icon: "📤", title: "Readable", text: "A source you read from, like fs.createReadStream or an HTTP request.", color: "#38bdf8" },
              { icon: "📥", title: "Writable", text: "A destination you write to, like fs.createWriteStream or an HTTP response.", color: "#38bdf8" },
              { icon: "🔁", title: "Duplex", text: "Both at once, with two separate sides, like a TCP socket.", color: "#38bdf8" },
              { icon: "⚗️", title: "Transform", text: "A Duplex whose output is worked out from its input, like zlib.createGzip.", color: "#38bdf8" },
            ]}
          />
          <CodeCompare
            lang="js"
            left={{
              title: "pipe(): errors aren't passed on",
              code: js`
                fs.createReadStream('in.log')
                  .pipe(zlib.createGzip())
                  .pipe(fs.createWriteStream('in.log.gz'));
                // an error leaves streams open
              `,
            }}
            right={{
              title: "pipeline(): errors and cleanup",
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
        "Streams handle data a piece at a time, so memory stays flat however big the input is.",
        "Readable streams start out paused. Adding a `'data'` listener or calling `pipe()` switches them to flowing mode.",
        "`pipeline()` connects streams and handles backpressure for you. It also passes on the first error and destroys every stream if something fails.",
        "Readable streams work with `for await (const chunk of stream)`. That reads chunks only as fast as your loop body finishes.",
      ],
      tip: "If you're asked how you'd process a 10 GB file, say streams with `pipeline()`. Then mention that memory stays constant and backpressure is handled.",
    },
    {
      id: "d2-backpressure",
      level: "senior",
      task: "2.1",
      title: "Backpressure: don't drown the consumer",
      check: ["d2-04", "d2-03"],
      visual: <BackpressureLab />,
      points: [
        "Every stream has an internal buffer. `highWaterMark` is the size at which the stream asks you to stop sending.",
        "`writable.write()` returns `false` once the buffer reaches `highWaterMark`. The chunk is still queued, so nothing is lost.",
        "When `write()` returns `false`, stop writing and wait for the `'drain'` event before you write more.",
        "`pipe()`, `pipeline()` and `for await` all handle backpressure for you. Write loops you code by hand usually don't.",
      ],
      tip: "Describe the whole loop: write until you get `false`, wait for `'drain'`, then carry on. Then add that `pipeline()` does all of that for you.",
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
              { icon: "🧱", title: "A Buffer is a Uint8Array", text: "A fixed number of raw bytes. Unlike an array, it doesn't grow.", color: "#38bdf8" },
              { icon: "🔤", title: "Bytes aren't characters", text: "Turn bytes into text once, after joining all the chunks, or let the stream do it with setEncoding('utf8').", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "A Buffer holds raw bytes. `Buffer.from(string)` turns text into bytes, using UTF-8 unless you pick another encoding.",
        "`buf.toString(encoding)` turns the bytes back into text.",
        "`Buffer.alloc` fills the new memory with zeros. `Buffer.allocUnsafe` skips that, so it can hold old data until you overwrite it.",
        "`subarray`, and the older `slice`, give you a view on the same memory. Writing to the view changes the original too.",
        "One character can take several bytes and get split across two chunks. Join chunks with `Buffer.concat` before decoding, or use `setEncoding` or `StringDecoder`.",
      ],
      tip: "If you're asked why a Buffer's length differs from the string's, explain that UTF-8 counts bytes while a JavaScript string counts UTF-16 units.",
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
        "`emit()` calls every listener straight away, in the order they were added, and only then returns. `prependListener` jumps to the front of the line.",
        "Listeners added with `once()` remove themselves after the first call.",
        "Emitting `'error'` when nobody is listening for `'error'` throws, and that usually crashes the process.",
        "More than 10 listeners on one event prints `MaxListenersExceededWarning`. That usually means a leak, where code adds a listener on every request.",
      ],
      tip: "\"Is EventEmitter async?\" is a favourite trap. The answer is no: `emit` is synchronous. A listener can choose to start async work, but `emit` doesn't wait for it.",
    },
  ],

  questions: [
    // ───────────── Beginner ─────────────
    {
      id: "node-b2-01",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-streams",
      prompt: "Why would you read a huge file with a stream instead of loading it all at once?",
      options: [
        "A stream hands you the file in small chunks, so memory use stays low and you can start work right away",
        "A stream makes the file smaller on disk",
        "A stream is the only way to open a file in Node, since `readFile` was removed from the `fs` module years ago",
        "A stream reads the file twice to check it",
      ],
      answer: [0],
      explanation:
        "Loading everything at once is like filling a bathtub before you can wash. A stream is the running tap: data arrives in small chunks you can use straight away, and the whole file never has to fit in memory.",
    },
    {
      id: "node-b2-02",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-streams",
      type: "fill",
      prompt: "Fill the gap so this reads `big.log` as a stream, one chunk at a time.",
      code: "const fs = require('node:fs');\nconst stream = fs.{{1}}('big.log');\nstream.on('data', (chunk) => console.log(chunk.length));",
      codeLang: "js",
      blanks: [{ options: ["createReadStream", "readFileSync", "writeFile", "createWriteStream"], answer: 0 }],
      explanation:
        "`fs.createReadStream` opens the file as a stream and emits a `'data'` event for each chunk. `readFileSync` loads the whole file at once, and the other two are for writing, not reading.",
    },
    {
      id: "node-b2-03",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-events",
      type: "output",
      prompt: "What does this print? Type one line per log.",
      code: js`
        const EventEmitter = require('node:events');
        const door = new EventEmitter();
        door.on('ring', (name) => console.log('Hi ' + name));
        door.emit('ring', 'Sam');
        door.emit('ring', 'Ana');
      `,
      codeLang: "js",
      answers: ["Hi Sam\nHi Ana"],
      explanation:
        "The `on` line sets up one listener for `'ring'`. Each `emit` rings the bell and passes a name to that listener, so it runs twice: once with `Sam`, once with `Ana`.",
    },
    {
      id: "node-b2-04",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-events",
      prompt: "What does `emitter.emit('done')` do?",
      options: [
        "It runs every function that was registered with `emitter.on('done', ...)`",
        "It deletes the emitter",
        "It prints the word done to the terminal",
        "It waits until something called done happens, and then it returns",
      ],
      answer: [0],
      explanation:
        "`emit` is the doorbell. It calls every listener registered for that event name. If nobody is listening for `'done'`, nothing happens.",
    },
    {
      id: "node-b2-05",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-events",
      prompt: "A read stream tells you about each new chunk by emitting an event. Which event name is it?",
      options: ["`'data'`", "`'chunk'`", "`'read'`", "`'next'`"],
      answer: [0],
      explanation:
        "Readable streams emit `'data'` with each chunk and `'end'` when there's nothing left. So you write `stream.on('data', (chunk) => ...)` to handle each piece.",
    },

    // ───────────── Junior and up ─────────────
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
      explanation:
        "A Readable is a source and a Writable is a destination. A Duplex is both at once, with two separate sides. A Transform is a Duplex whose output is worked out from its input.",
    },
    {
      id: "d2-02",
      domain: "d2",
      level: "junior",
      lesson: "d2-streams",
      prompt: "Why stream a 5 GB log file instead of using `fs.readFile`?",
      options: [
        "Streaming handles it chunk by chunk with roughly constant memory, while readFile tries to load all 5 GB at once",
        "readFile is synchronous and blocks the event loop, while streams are asynchronous and run on a background thread",
        "Streams compress the file automatically",
        "readFile can't read text files",
      ],
      answer: [0],
      explanation:
        "`fs.readFile` is asynchronous, but it holds the whole file in memory, and very large files go past Buffer and string limits. A stream holds only a small buffer at a time and can start work on the first chunk right away.",
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
        "`write()` returns `false` once the buffer is full, but the loop keeps writing anyway, so every line piles up in memory. Stop when you get `false` and carry on at `'drain'`, or build a Readable and use `pipeline()`.",
    },
    {
      id: "d2-04",
      domain: "d2",
      level: "junior",
      lesson: "d2-backpressure",
      prompt: "What does it mean when `writable.write(chunk)` returns `false`?",
      options: [
        "The internal buffer has reached highWaterMark, so stop writing until the `'drain'` event",
        "The chunk was dropped and must be written again later, once the stream has finished flushing to disk",
        "The stream has closed",
        "The chunk was written to disk synchronously",
      ],
      answer: [0],
      explanation:
        "The chunk is still accepted and queued. `false` is the stream asking you to pause. If you keep writing anyway, the buffer grows without limit.",
    },
    {
      id: "d2-05",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-backpressure",
      type: "order",
      prompt: "Put the steps of a write loop that respects backpressure in order.",
      items: ["Call `write(chunk)` for the next chunk", "If it returned `false`, stop writing", "Wait for the `'drain'` event", "Resume writing from where you stopped", "Call `end()` after the last chunk"],
      explanation:
        "You write until you get `false`, wait for `'drain'`, carry on, and call `end()` at the very end. That's exactly what `pipe()` and `pipeline()` do inside.",
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
        "The read stream emits an `'error'` that nobody listens to, so the process crashes, and `.pipe()` neither passes it on nor cleans up the other streams",
        "`.pipe()` catches the read stream's error and closes all three streams for you, then emits `'error'` on the last stream so one listener at the end is enough to handle it",
        "An empty `out.gz` is written and the error is ignored",
        "The error goes to the gzip stream's `'error'` handler",
      ],
      answer: [0],
      explanation:
        "`.pipe()` handles backpressure but not errors. Each stream needs its own `'error'` handler. Or use `stream.pipeline()`, which sends the first error to one callback or promise and destroys every stream.",
    },
    {
      id: "d2-07",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-streams",
      type: "order",
      prompt: "Put the streams for `pipeline()` in order, to remove emails from a log and save it gzipped.",
      items: ["`fs.createReadStream('app.log')`", "`redactEmails()` (a Transform)", "`zlib.createGzip()`", "`fs.createWriteStream('app.log.gz')`"],
      explanation:
        "The source goes first and the destination last. Remove the emails before compressing, because once the bytes are gzipped a text Transform can't see the addresses any more.",
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
      explanation: "The string has 5 characters. In UTF-8, which Buffer uses by default, `é` takes 2 bytes, so the Buffer is 6 bytes long.",
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
      explanation:
        "`subarray` gives you a view on the same memory, not a copy. So changing `b[0]` changes `a[0]` too. Use `Buffer.from(a.subarray(0, 2))` when you need a separate copy.",
    },
    {
      id: "d2-10",
      domain: "d2",
      level: "senior",
      lesson: "d2-buffers",
      prompt: "Why can `Buffer.allocUnsafe(size)` be a security risk?",
      options: [
        "Its memory isn't zeroed, so until you overwrite every byte it may hold old data, such as secrets from earlier requests",
        "It allocates outside the process, where other programs can read it",
        "It can't be garbage collected",
        "It turns off bounds checking for speed, so any writes past the end of the buffer corrupt other memory in the whole process",
      ],
      answer: [0],
      explanation:
        "`allocUnsafe` is faster because it skips filling the memory with zeros. If the buffer is sent before it's fully written, leftover memory can leak out. Use `Buffer.alloc` unless you'll overwrite every byte straight away.",
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
        "One UTF-8 character can be split across two chunks. Decoding each chunk on its own turns both halves into replacement characters. Collect the chunks and decode once with `Buffer.concat(chunks).toString()`, or call `req.setEncoding('utf8')`.",
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
      explanation:
        "`emit()` calls every listener straight away and only returns once they've all run. EventEmitter doesn't hand anything to the event loop for later.",
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
      explanation:
        "Listeners run in order, and `prependListener` puts `b` at the front, so the first emit prints b, a, c. The `once` listener then removes itself, so the second emit prints only b, a.",
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
        "The constructor emits straight away, before the caller has had a chance to add a listener. Delay it with `process.nextTick(() => this.emit('start'))`, so listeners added right after construction still hear it.",
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
        "Nothing happens because nobody is listening, then `still running` prints",
        "It prints a warning and then `still running`",
        "It prints `still running`, then the error later",
      ],
      answer: [0],
      explanation:
        "`'error'` is a special event name. Emitting it when there's no `'error'` listener throws the error. That's why every stream or emitter you create needs an error handler.",
    },
    {
      id: "d2-16",
      domain: "d2",
      level: "senior",
      lesson: "d2-emitter",
      prompt: "After a few requests, Node prints `MaxListenersExceededWarning: Possible EventEmitter memory leak detected`. What's the right fix?",
      code: js`
        app.get('/price', (req, res) => {
          priceFeed.on('tick', (p) => { lastPrice = p; });
          res.json({ price: lastPrice });
        });
      `,
      codeLang: "js",
      options: [
        "Register the `'tick'` listener once at startup instead of on every request",
        "Call `priceFeed.setMaxListeners(0)` to silence the leak warning",
        "Change `on` to `prependListener`",
        "Wrap the handler in `try/catch`",
      ],
      answer: [0],
      explanation:
        "Every request adds another listener that's never removed. That's a leak, and it also makes each emit slower. The warning fires once one event has more than 10 listeners. Raising the limit only hides the problem.",
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
        "Reading pauses while each insert runs, so memory stays bounded, because async iteration applies backpressure",
        "The whole file is read into memory first, and then inserted into the table chunk by chunk.",
        "Inserts run in parallel, one per chunk, as fast as the disk can read",
        "It throws, because streams can't be used with for await",
      ],
      answer: [0],
      explanation:
        "Readable streams can be looped over with `for await`. The loop only asks for the next chunk once the body has finished, so the stream stays paused, with a small buffer, while each insert is running.",
    },
    {
      id: "d2-18",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-streams",
      prompt: "Which actions switch a paused Readable stream into flowing mode? (Choose two.)",
      options: ["Adding a `'data'` listener", "Calling `readable.pipe(dest)`", "Adding an `'end'` listener", "Calling `readable.pause()`", "Creating the stream"],
      answer: [0, 1],
      explanation:
        "Readables start out paused. A `'data'` listener, `pipe()` or `resume()` gets data flowing. An `'end'` listener on its own doesn't, and `pause()` does the opposite.",
    },
    {
      id: "d2-19",
      domain: "d2",
      level: "staff",
      lesson: "d2-backpressure",
      prompt: "A Node service passes user uploads through to object storage. When storage gets slow, memory grows until the pods are killed for running out of memory. What's the best fix?",
      options: [
        "Pipe the request into the upload with `pipeline()`, so a slow destination pauses reading from the client",
        "Raise the heap limit and add more pods",
        "Hold each upload fully in memory, then send it to storage in one request, so a slow destination can't affect the client",
        "Add retries with exponential backoff to the upload call",
      ],
      answer: [0],
      explanation:
        "Memory grows because data comes in faster than it goes out, and nothing pushes back. With backpressure all the way through, TCP flow control slows the client down when storage is slow, so memory per upload stays bounded. More memory or more pods only delays the crash.",
    },
    {
      id: "d2-20",
      domain: "d2",
      level: "staff",
      lesson: "d2-streams",
      prompt: "A teammate suggests this for importing a 10 GB CSV into the database. What do you recommend?",
      code: js`
        const text = await fs.promises.readFile('users.csv', 'utf8');
        for (const row of text.split('\n')) {
          await db.insert(parse(row));
        }
      `,
      codeLang: "js",
      options: [
        "Stream it: a read stream, then a CSV-parsing Transform, then batches of rows, then a Writable that inserts each batch, all inside `pipeline()`",
        "Keep it, but start Node with a 16 GB heap",
        "Read it with `readFileSync` instead, because it's faster than streaming, then split the text on newlines and insert every row in one large transaction at the end",
        "Insert every row in parallel with `Promise.all`",
      ],
      answer: [0],
      explanation:
        "A 10 GB file won't fit in a single JavaScript string, because V8 caps string length far below that. Streaming in batches keeps memory flat, backpressure stops reading while the database is busy, and batching cuts round trips. An unbounded `Promise.all` would swamp the database.",
    },
    {
      id: "d2-21",
      domain: "d2",
      level: "staff",
      lesson: "d2-emitter",
      prompt:
        "A monolith uses an in-process EventEmitter so the orders module can tell the email module about new orders. The app now runs as 6 replicas, and some emails go missing during deploys. What's the core problem, and the fix?",
      options: [
        "EventEmitter events live in one process's memory with no durability or retries, so use a durable queue or broker (for example with an outbox table)",
        "EventEmitter has a 10-listener limit, so raise it with setMaxListeners",
        "Events are asynchronous and arrive out of order across listeners, so add sequence numbers and have each listener sort the events it receives before handling them",
        "The replicas share one EventEmitter, so each event is handled 6 times",
      ],
      answer: [0],
      explanation:
        "An in-process emitter only reaches listeners in that same process, and any pending work is lost if the process exits during a deploy. Events that cross processes and must not be lost need a durable message system with acknowledgements.",
    },
    {
      id: "d2-22",
      domain: "d2",
      level: "junior",
      lesson: "d2-buffers",
      prompt: "What is a Node.js `Buffer`?",
      options: [
        "A fixed-length sequence of raw bytes, and a subclass of `Uint8Array`",
        "A growable array of strings",
        "A queue that streams use to store events until a listener is attached",
        "A cache for HTTP responses",
      ],
      answer: [0],
      explanation:
        "Buffers hold binary data, like file contents, network packets or encoded text. Their size is fixed when you create them, and every element is one byte, from 0 to 255.",
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
      explanation:
        "`h` is byte 0x68 and `i` is byte 0x69, so the hex encoding is `6869`. `aGk=` would be base64, and `<Buffer 68 69>` is what you'd see if you logged the Buffer itself.",
    },
    {
      id: "d2-24",
      domain: "d2",
      level: "staff",
      lesson: "d2-backpressure",
      prompt: "A WebSocket service sends every price update to 50,000 clients. A few slow mobile clients make memory balloon. What policy fixes it?",
      options: [
        "Limit each client's send buffer: when it's over the limit, drop or merge updates for that client, or disconnect it",
        "Wait for every client to confirm the last update before sending the next one out to anyone at all",
        "Raise the heap limit so slow clients can catch up",
        "Send updates to slow clients from a worker thread",
      ],
      answer: [0],
      explanation:
        "Sending one stream to many clients turns a single slow client into unbounded buffering. A limit per connection, checked with `bufferedAmount` or `writableLength`, keeps slow clients from hurting everyone else. For prices only the latest value matters, so merging updates is safe. Waiting for everyone would let one phone slow down the whole service.",
    },
  ],

  cards: [
    { id: "c-d2-pipeline", domain: "d2", kind: "service", term: "stream.pipeline()", definition: "Connects streams with backpressure, passes on the first error, and destroys them all if anything fails. The promise version lives in node:stream/promises." },
    { id: "c-d2-readable", domain: "d2", kind: "service", term: "Readable", definition: "A stream you read from, like a file, an HTTP request or process.stdin. You can loop over it with for await." },
    { id: "c-d2-writable", domain: "d2", kind: "service", term: "Writable", definition: "A stream you write to, like a file or an HTTP response. write() returns false when its buffer is full." },
    { id: "c-d2-transform", domain: "d2", kind: "service", term: "Transform", definition: "A Duplex stream that works out its output from its input, like zlib.createGzip or a CSV parser." },
    { id: "c-d2-duplex", domain: "d2", kind: "service", term: "Duplex", definition: "A stream that you can both read from and write to, with two separate sides, like a TCP socket." },
    { id: "c-d2-bfrom", domain: "d2", kind: "service", term: "Buffer.from()", definition: "Makes a Buffer from a string (UTF-8 by default), an array or another buffer." },
    { id: "c-d2-alloc", domain: "d2", kind: "service", term: "Buffer.alloc()", definition: "Makes a Buffer of a fixed size, filled with zeros. The safe default." },
    { id: "c-d2-allocu", domain: "d2", kind: "service", term: "Buffer.allocUnsafe()", definition: "Makes a Buffer without zeroing it first. It's faster, but it may hold old memory until you overwrite it." },
    { id: "c-d2-concat", domain: "d2", kind: "service", term: "Buffer.concat()", definition: "Joins a list of Buffers into one. Collect the chunks, join them, then decode once." },
    { id: "c-d2-decoder", domain: "d2", kind: "service", term: "StringDecoder", definition: "Turns bytes into text across chunk boundaries without breaking characters that take several bytes." },
    { id: "c-d2-ee", domain: "d2", kind: "service", term: "EventEmitter", definition: "Node's publish and subscribe class, with on, once, off and emit. Listeners run straight away, in order." },
    { id: "c-d2-once", domain: "d2", kind: "service", term: "events.once()", definition: "Returns a promise that resolves the next time an emitter fires an event, for example await once(server, 'listening')." },
    { id: "c-d2-bp", domain: "d2", kind: "concept", term: "Backpressure", definition: "Slowing a fast producer down to match a slow consumer, so the buffered data, and the memory, stays bounded." },
    { id: "c-d2-hwm", domain: "d2", kind: "concept", term: "highWaterMark", definition: "A stream's buffer threshold. Above it, write() returns false and readables stop reading ahead." },
    { id: "c-d2-drain", domain: "d2", kind: "concept", term: "'drain' event", definition: "Fired by a Writable when it's safe to write again after write() returned false." },
    { id: "c-d2-flowing", domain: "d2", kind: "concept", term: "Flowing and paused mode", definition: "Readables start paused. A 'data' listener, pipe() or resume() makes data flow on its own." },
  ],

  challenges: [
    {
      id: "ch-node-crash",
      domain: "d2",
      lesson: "d2-backpressure",
      title: "Blow up the heap",
      goal: "Make the stream crash by running out of memory.",
      hint: "Turn off backpressure and make the producer much faster than the consumer.",
      takeaway: "If you ignore write() returning false, the buffer grows by the gap between producer and consumer on every tick, until memory runs out.",
      render: (onSolved) => <BackpressureLab goal="crash" onSolved={onSolved} />,
    },
    {
      id: "ch-node-tame",
      domain: "d2",
      lesson: "d2-backpressure",
      title: "Tame the firehose",
      goal: "With the producer faster than the consumer, deliver all 60 chunks without crashing.",
      hint: "Respect backpressure: stop when write() returns false, and carry on at 'drain'.",
      takeaway: "With backpressure, the buffer never goes far past highWaterMark, however fast the producer is.",
      render: (onSolved) => <BackpressureLab goal="tame" onSolved={onSolved} />,
    },
  ],
});
