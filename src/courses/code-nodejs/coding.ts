import type { CodingChallenge } from "@/engine/types";

/** Live coding challenges for the Node.js track: pure-JavaScript utilities (no `require`, no timers). */
export const codingChallenges: CodingChallenge[] = [
  {
    id: "nodejs-cc-01",
    domain: "d2",
    lesson: "d2-streams",
    level: "junior",
    title: "Batch into chunks",
    idea: "slice in steps",
    prompt:
      "Streams move data in chunks. Write `chunk(items, size)` that splits an array into consecutive arrays of at most `size` items, keeping order. `chunk([1,2,3,4,5], 2)` returns `[[1,2],[3,4],[5]]`. An empty array gives `[]`. `size` is always a positive integer.",
    fn: "chunk",
    starter: "function chunk(items, size) {\n  // TODO: return an array of arrays\n  return [];\n}",
    tests: [
      { name: "uneven tail", args: [[1, 2, 3, 4, 5], 2], expected: [[1, 2], [3, 4], [5]] },
      { name: "exact fit", args: [[1, 2, 3, 4], 2], expected: [[1, 2], [3, 4]] },
      { name: "empty", args: [[], 3], expected: [] },
      { name: "size larger than input", args: [["a", "b"], 10], expected: [["a", "b"]] },
      { name: "size one", args: [[7, 8, 9], 1], expected: [[7], [8], [9]] },
      { name: "strings and duplicates", args: [["x", "x", "y"], 2], expected: [["x", "x"], ["y"]], hidden: true },
      { name: "long input", args: [Array.from({ length: 10 }, (_, i) => i), 3], expected: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [9]], hidden: true },
    ],
    hints: [
      "Walk the array in steps of `size` instead of one item at a time.",
      "`items.slice(i, i + size)` returns at most `size` items and never throws past the end.",
      "`for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));`",
    ],
    solution:
      "function chunk(items, size) {\n  const out = [];\n  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));\n  return out;\n}",
    explanation:
      "Stepping the index by `size` and slicing gives each chunk in O(n) total, and `slice` clamps at the end so the short tail needs no special case. This is exactly how a batching Transform groups records before a bulk insert. Follow-up: how would you do it lazily with a generator so you never hold all the chunks at once?",
  },
  {
    id: "nodejs-cc-02",
    domain: "d4",
    lesson: "d4-http",
    level: "junior",
    title: "Parse a query string",
    idea: "split and decode",
    prompt:
      "Write `parseQuery(qs)` that turns a URL query string into an object mapping each key to an array of its values, in order. `parseQuery('?a=1&b=2&a=3')` returns `{a:['1','3'], b:['2']}`. A leading `?` is optional, `+` means a space, and `%XX` sequences must be decoded (`decodeURIComponent`). A key without `=` has the value `''`. An empty string gives `{}`.",
    fn: "parseQuery",
    starter: "function parseQuery(qs) {\n  // TODO\n  return null;\n}",
    tests: [
      { name: "repeated key", args: ["?a=1&b=2&a=3"], expected: { a: ["1", "3"], b: ["2"] } },
      { name: "no leading ?", args: ["x=1"], expected: { x: ["1"] } },
      { name: "empty", args: [""], expected: {} },
      { name: "only ?", args: ["?"], expected: {} },
      { name: "plus and percent", args: ["q=hello+world&n=a%26b"], expected: { q: ["hello world"], n: ["a&b"] } },
      { name: "key without value", args: ["flag&k="], expected: { flag: [""], k: [""] } },
      { name: "value containing =", args: ["t=a=b"], expected: { t: ["a=b"] }, hidden: true },
      { name: "encoded key and empty pairs", args: ["a%20b=1&&a%20b=2"], expected: { "a b": ["1", "2"] }, hidden: true },
    ],
    hints: [
      "Strip a leading `?`, split on `&`, and skip empty pieces.",
      "Split each pair at the FIRST `=` only (the value may contain more).",
      "Replace `+` with a space BEFORE calling `decodeURIComponent` on both key and value.",
    ],
    solution:
      "function parseQuery(qs) {\n  const out = {};\n  const s = qs.startsWith('?') ? qs.slice(1) : qs;\n  for (const part of s.split('&')) {\n    if (!part) continue;\n    const i = part.indexOf('=');\n    const raw = i === -1 ? [part, ''] : [part.slice(0, i), part.slice(i + 1)];\n    const [k, v] = raw.map((x) => decodeURIComponent(x.replace(/\\+/g, ' ')));\n    (out[k] ||= []).push(v);\n  }\n  return out;\n}",
    explanation:
      "One pass over the pairs, O(n). Splitting at the first `=` keeps values like `a=b` intact, and `+` must be turned into a space before percent-decoding because an encoded `%2B` must stay a plus. Follow-up: why prefer `new URLSearchParams` in production, and what does `__proto__` as a key do to an object like this one?",
  },
  {
    id: "nodejs-cc-03",
    domain: "d3",
    lesson: "d3-modules",
    level: "intermediate",
    title: "Normalize a path",
    idea: "stack of segments",
    prompt:
      "Write `normalizePath(p)` like `path.posix.normalize`, without a trailing slash. Collapse repeated `/`, drop `.` segments and resolve `..` against the previous segment. `normalizePath('/a/b/../c//d/.')` returns `'/a/c/d'`. Absolute paths never climb above `/` (`'/../a'` gives `'/a'`). Relative paths keep leading `..` (`'../../x'` stays as is), and an empty result is `'.'` for relative input and `'/'` for absolute.",
    fn: "normalizePath",
    starter: "function normalizePath(p) {\n  // TODO\n  return p;\n}",
    tests: [
      { name: "mixed", args: ["/a/b/../c//d/."], expected: "/a/c/d" },
      { name: "already clean", args: ["/x/y"], expected: "/x/y" },
      { name: "root", args: ["/"], expected: "/" },
      { name: "cannot climb above root", args: ["/../a"], expected: "/a" },
      { name: "relative", args: ["a/./b/../c"], expected: "a/c" },
      { name: "keeps leading ..", args: ["../../x"], expected: "../../x" },
      { name: "cancels to dot", args: ["a/.."], expected: "." },
      { name: "deep climb", args: ["/a/b/c/../../../.."], expected: "/", hidden: true },
      { name: "relative climbing past start", args: ["a/../../b"], expected: "../b", hidden: true },
    ],
    hints: [
      "Split on `/` and process one segment at a time, building a stack of the segments you keep.",
      "Skip `''` and `'.'`. For `'..'`, pop if the top is a real segment; otherwise it is kept only for relative paths.",
      "Join the stack, then add the leading `/` for absolute input; handle the empty-stack case last.",
    ],
    solution:
      "function normalizePath(p) {\n  const abs = p.startsWith('/');\n  const stack = [];\n  for (const seg of p.split('/')) {\n    if (seg === '' || seg === '.') continue;\n    if (seg === '..') {\n      if (stack.length && stack[stack.length - 1] !== '..') stack.pop();\n      else if (!abs) stack.push('..');\n    } else stack.push(seg);\n  }\n  const body = stack.join('/');\n  return abs ? '/' + body : body || '.';\n}",
    explanation:
      "A stack models directory traversal: normal segments push, `..` pops, and the only subtle case is `..` with nothing to pop, which an absolute path ignores and a relative path preserves. O(n) time. Follow-up: why must server code normalise and then verify the result stays inside the base directory (path traversal)?",
  },
  {
    id: "nodejs-cc-04",
    domain: "d1",
    lesson: "d1-loop",
    level: "intermediate",
    title: "Trailing debounce from a log",
    idea: "simulated clock",
    prompt:
      "No timers allowed, so replay a call log. `events` is a list of `[time, value]` calls in time order. A trailing debounce with delay `wait` fires with the LAST value of a burst, at `lastCallTime + wait`, once `wait` ms pass with no new call. A gap of at least `wait` ends a burst. Return `[[fireTime, value], …]`. `debounceLog([[0,'a'],[50,'b'],[400,'c']], 100)` returns `[[150,'b'],[500,'c']]`.",
    fn: "debounceLog",
    starter: "function debounceLog(events, wait) {\n  // TODO\n  return [];\n}",
    tests: [
      { name: "two bursts", args: [[[0, "a"], [50, "b"], [400, "c"]], 100], expected: [[150, "b"], [500, "c"]] },
      { name: "empty", args: [[], 100], expected: [] },
      { name: "single call", args: [[[10, "x"]], 5], expected: [[15, "x"]] },
      { name: "one long burst", args: [[[0, 1], [10, 2], [20, 3], [30, 4]], 50], expected: [[80, 4]] },
      { name: "gap equal to wait ends the burst", args: [[[0, "a"], [100, "b"]], 100], expected: [[100, "a"], [200, "b"]] },
      { name: "gap just under wait continues", args: [[[0, "a"], [99, "b"]], 100], expected: [[199, "b"]] },
      { name: "three bursts", args: [[[0, "a"], [5, "b"], [200, "c"], [210, "d"], [220, "e"], [900, "f"]], 100], expected: [[105, "b"], [320, "e"], [1000, "f"]], hidden: true },
      { name: "same timestamp", args: [[[5, "a"], [5, "b"]], 10], expected: [[15, "b"]], hidden: true },
    ],
    hints: [
      "Remember only the most recent event while you scan; you flush it when the next event is far enough away (or at the end).",
      "Compare `next.time - last.time` with `wait`: `>= wait` means the timer would have fired first.",
      "Loop over the events; when the gap is big, push `[last.time + wait, last.value]`. After the loop, flush the final pending event.",
    ],
    solution:
      "function debounceLog(events, wait) {\n  const out = [];\n  let last = null;\n  for (const ev of events) {\n    if (last && ev[0] - last[0] >= wait) out.push([last[0] + wait, last[1]]);\n    last = ev;\n  }\n  if (last) out.push([last[0] + wait, last[1]]);\n  return out;\n}",
    explanation:
      "A debounce only ever cares about the latest call: each new call replaces the pending one, and a timer expiring is equivalent to the next call arriving at least `wait` later. One pass, O(n), O(1) extra state. Follow-up: what changes for a leading-edge debounce, and how would you add a `maxWait` so a constant stream still fires?",
  },
  {
    id: "nodejs-cc-05",
    domain: "d2",
    lesson: "d2-streams",
    level: "intermediate",
    title: "Re-assemble lines from chunks",
    idea: "carry the remainder",
    prompt:
      "Stream chunks do not respect line boundaries. Write `splitLines(chunks)`: given an array of string chunks, return the complete lines in order, as a line-splitting Transform would. A line may span several chunks. The last line is included even without a trailing `\\n`, and an input that ends with `\\n` does not produce an extra empty line. `splitLines(['ab','c\\nd','e\\n'])` returns `['abc','de']`. Empty lines in the middle are kept.",
    fn: "splitLines",
    starter: "function splitLines(chunks) {\n  // TODO: keep the unfinished tail between chunks\n  return [];\n}",
    tests: [
      { name: "line spans chunks", args: [["ab", "c\nd", "e\n"]], expected: ["abc", "de"] },
      { name: "no chunks", args: [[]], expected: [] },
      { name: "no trailing newline", args: [["one\ntwo"]], expected: ["one", "two"] },
      { name: "trailing newline only", args: [["a\n"]], expected: ["a"] },
      { name: "empty line kept", args: [["a\n\nb\n"]], expected: ["a", "", "b"] },
      { name: "newline at chunk boundary", args: [["a\n", "b\n", "c"]], expected: ["a", "b", "c"] },
      { name: "many tiny chunks", args: [["h", "e", "l", "l", "o", "\n", "w", "\n"]], expected: ["hello", "w"], hidden: true },
      { name: "empty chunks mixed in", args: [["", "x", "", "y\nz", ""]], expected: ["xy", "z"], hidden: true },
    ],
    hints: [
      "Keep a `rest` string: whatever came after the last newline so far.",
      "For each chunk, `(rest + chunk).split('\\n')`; every piece except the last is a complete line, and the last piece becomes the new `rest`.",
      "After the loop, if `rest` is non-empty, push it as the final line.",
    ],
    solution:
      "function splitLines(chunks) {\n  const out = [];\n  let rest = '';\n  for (const chunk of chunks) {\n    const parts = (rest + chunk).split('\\n');\n    rest = parts.pop();\n    out.push(...parts);\n  }\n  if (rest) out.push(rest);\n  return out;\n}",
    explanation:
      "The classic Transform pattern: buffer the unfinished tail, emit the complete lines, flush the tail at the end. Work is O(total length). Follow-up: what breaks if you decode each Buffer chunk to a string separately (a multi-byte character split across chunks), and how does `StringDecoder` fix it?",
  },
  {
    id: "nodejs-cc-06",
    domain: "d4",
    lesson: "d4-middleware",
    level: "senior",
    title: "Compose onion middleware",
    idea: "recursive dispatch",
    prompt:
      "Koa-style middleware wraps the rest of the chain. `runChain(mws)` takes a list of `{name, next}` (`next` is a boolean: does this middleware call `next()`?) and returns the log of events: `name>` when a middleware starts, and `<name` when it finishes after its `next()` returned. For `[{name:'a',next:true},{name:'b',next:false},{name:'c',next:true}]` the result is `['a>','b>','<b','<a']` because `b` never calls `next`, so `c` never runs.",
    fn: "runChain",
    starter: "function runChain(mws) {\n  const log = [];\n  // TODO: build dispatch(i) and start it at 0\n  return log;\n}",
    tests: [
      { name: "stops at b", args: [[{ name: "a", next: true }, { name: "b", next: false }, { name: "c", next: true }]], expected: ["a>", "b>", "<b", "<a"] },
      { name: "empty", args: [[]], expected: [] },
      { name: "single", args: [[{ name: "x", next: true }]], expected: ["x>", "<x"] },
      { name: "full onion", args: [[{ name: "a", next: true }, { name: "b", next: true }, { name: "c", next: true }]], expected: ["a>", "b>", "c>", "<c", "<b", "<a"] },
      { name: "first stops", args: [[{ name: "a", next: false }, { name: "b", next: true }]], expected: ["a>", "<a"] },
      { name: "last one calls next into nothing", args: [[{ name: "a", next: true }, { name: "b", next: true }]], expected: ["a>", "b>", "<b", "<a"] },
      { name: "five deep", args: [["a", "b", "c", "d", "e"].map((name) => ({ name, next: true }))], expected: ["a>", "b>", "c>", "d>", "e>", "<e", "<d", "<c", "<b", "<a"], hidden: true },
      { name: "stop in the middle of five", args: [[{ name: "a", next: true }, { name: "b", next: true }, { name: "c", next: false }, { name: "d", next: true }, { name: "e", next: true }]], expected: ["a>", "b>", "c>", "<c", "<b", "<a"], hidden: true },
    ],
    hints: [
      "Each middleware gets a `next` function that runs the middleware after it.",
      "Write `function dispatch(i)`: if `i` is past the end, return; otherwise log `name>`, call `dispatch(i + 1)` only if `mw.next`, then log `<name`.",
      "Return `log` after calling `dispatch(0)`. The `<name` line is logged AFTER the inner call returns, which is what creates the onion.",
    ],
    solution:
      "function runChain(mws) {\n  const log = [];\n  function dispatch(i) {\n    const mw = mws[i];\n    if (!mw) return;\n    log.push(mw.name + '>');\n    if (mw.next) dispatch(i + 1);\n    log.push('<' + mw.name);\n  }\n  dispatch(0);\n  return log;\n}",
    explanation:
      "Each layer runs its \"before\" code, hands control inward with `next`, and resumes for its \"after\" code when the inner layers return, which is why timing and error-handling middleware go first. Not calling `next` short-circuits the rest. Follow-up: in real async middleware, what goes wrong if a middleware calls `next()` twice, and why must you `await next()`?",
  },
  {
    id: "nodejs-cc-07",
    domain: "d4",
    lesson: "d4-perf",
    level: "senior",
    title: "Promise pool on a simulated clock",
    idea: "min-time slot",
    prompt:
      "A pool runs at most `limit` tasks at once. Tasks start in input order; the moment one finishes, the next waiting task starts. Given `durations` (ms per task) and `limit`, return the finish time of each task, indexed like the input, with the clock starting at 0. `poolFinish([5,3,4], 2)` returns `[5,3,7]`: tasks 0 and 1 start at 0, task 1 ends at 3 and frees a slot for task 2, which ends at 7. `limit` is at least 1.",
    fn: "poolFinish",
    starter: "function poolFinish(durations, limit) {\n  // TODO\n  return [];\n}",
    tests: [
      { name: "two slots", args: [[5, 3, 4], 2], expected: [5, 3, 7] },
      { name: "empty", args: [[], 3], expected: [] },
      { name: "limit 1 is sequential", args: [[2, 2, 2], 1], expected: [2, 4, 6] },
      { name: "limit bigger than tasks", args: [[4, 1, 9], 10], expected: [4, 1, 9] },
      { name: "equal finish times", args: [[3, 3, 3, 3], 2], expected: [3, 3, 6, 6] },
      { name: "zero duration", args: [[0, 5, 0], 1], expected: [0, 5, 5] },
      { name: "long tail", args: [[10, 1, 1, 1, 1], 2], expected: [10, 1, 2, 3, 4], hidden: true },
      { name: "mixed lengths", args: [[7, 2, 5, 1, 3, 4], 3], expected: [7, 2, 5, 3, 6, 9], hidden: true },
    ],
    hints: [
      "Track the time at which each of the `limit` slots becomes free (start them all at 0).",
      "For each task in order, it starts on the slot that frees up earliest.",
      "Keep an array `free` of `limit` zeros; for each task pick the index of the smallest value, set `finish = free[i] + duration`, store it back and record it.",
    ],
    solution:
      "function poolFinish(durations, limit) {\n  const free = new Array(Math.min(limit, Math.max(durations.length, 1))).fill(0);\n  return durations.map((d) => {\n    let best = 0;\n    for (let i = 1; i < free.length; i++) if (free[i] < free[best]) best = i;\n    free[best] += d;\n    return free[best];\n  });\n}",
    explanation:
      "A real pool starts the next job when ANY slot frees, which is the slot with the smallest free-time. O(n * limit) here; a min-heap makes it O(n log limit). Follow-up: how do you cap concurrency for real with promises (an in-flight counter plus a queue, or `Promise.race` over the running set), and what should happen to the pool when one task rejects?",
  },
  {
    id: "nodejs-cc-08",
    domain: "d1",
    lesson: "d1-microtasks",
    level: "senior",
    title: "Settle every promise",
    idea: "never reject",
    prompt:
      "Write async `settleAll(specs)` that behaves like `Promise.allSettled`, built by hand. Each spec is the string `'ok:<value>'` or `'fail:<reason>'`; make a promise for it (`Promise.resolve(value)` or `Promise.reject(reason)`) and return a promise for an array, in input order, of `{ok:true,value}` or `{ok:false,reason}` (`value` and `reason` are the strings after the colon). It must never reject, and an empty list gives `[]`. Do not use `Promise.allSettled`.",
    fn: "settleAll",
    starter: "async function settleAll(specs) {\n  // TODO\n  return [];\n}",
    tests: [
      { name: "mixed", args: [["ok:1", "fail:boom", "ok:3"]], expected: [{ ok: true, value: "1" }, { ok: false, reason: "boom" }, { ok: true, value: "3" }] },
      { name: "empty", args: [[]], expected: [] },
      { name: "all fail", args: [["fail:a", "fail:b"]], expected: [{ ok: false, reason: "a" }, { ok: false, reason: "b" }] },
      { name: "all ok", args: [["ok:x"]], expected: [{ ok: true, value: "x" }] },
      { name: "colon inside the value", args: [["ok:a:b", "fail:c:d"]], expected: [{ ok: true, value: "a:b" }, { ok: false, reason: "c:d" }] },
      { name: "empty value", args: [["ok:", "fail:"]], expected: [{ ok: true, value: "" }, { ok: false, reason: "" }], hidden: true },
      { name: "order preserved over many", args: [["fail:1", "ok:2", "fail:3", "ok:4", "ok:5", "fail:6"]], expected: [{ ok: false, reason: "1" }, { ok: true, value: "2" }, { ok: false, reason: "3" }, { ok: true, value: "4" }, { ok: true, value: "5" }, { ok: false, reason: "6" }], hidden: true },
    ],
    hints: [
      "Turn each spec into a promise first, then attach handlers to each one so a rejection becomes a normal result.",
      "`p.then((value) => ({ ok: true, value }), (reason) => ({ ok: false, reason }))` never rejects.",
      "Wrap the mapped array in `Promise.all`; it keeps input order. Split a spec on the FIRST colon only.",
    ],
    solution:
      "async function settleAll(specs) {\n  const wrapped = specs.map((s) => {\n    const i = s.indexOf(':');\n    const kind = s.slice(0, i);\n    const text = s.slice(i + 1);\n    const p = kind === 'ok' ? Promise.resolve(text) : Promise.reject(text);\n    return p.then((value) => ({ ok: true, value }), (reason) => ({ ok: false, reason }));\n  });\n  return Promise.all(wrapped);\n}",
    explanation:
      "Converting each rejection into a fulfilled result object up front means `Promise.all` can never reject, and it preserves input order whatever the settle order. All promises run concurrently. Follow-up: why does `Promise.all` alone lose the other results (and risk unhandled rejections) when one input fails, and when would you prefer `Promise.any`?",
  },
  {
    id: "nodejs-cc-09",
    domain: "d3",
    lesson: "d3-scaling",
    level: "staff",
    title: "Sliding-window rate limiter",
    idea: "queue of timestamps",
    prompt:
      "Design a rate limiter you can test over a log. Given request `times` in non-decreasing order (ms), allow at most `limit` ACCEPTED requests in any window of `windowMs` ms. A request at time `t` counts accepted requests with time `> t - windowMs`. Return an array of booleans: `true` if accepted. Rejected requests do not count against the limit. `rateLimit([0,1,2,3,10], 2, 5)` returns `[true,true,false,false,true]`.",
    fn: "rateLimit",
    starter: "function rateLimit(times, limit, windowMs) {\n  // TODO\n  return [];\n}",
    tests: [
      { name: "basic", args: [[0, 1, 2, 3, 10], 2, 5], expected: [true, true, false, false, true] },
      { name: "empty", args: [[], 2, 5], expected: [] },
      { name: "limit 1", args: [[0, 1, 5, 6, 10], 1, 5], expected: [true, false, true, false, true] },
      { name: "window edge is exclusive", args: [[0, 5], 1, 5], expected: [true, true] },
      { name: "just inside the window", args: [[0, 4], 1, 5], expected: [true, false] },
      { name: "rejections do not count", args: [[0, 1, 2, 6], 2, 5], expected: [true, true, false, true] },
      { name: "burst then steady", args: [[0, 0, 0, 0, 5, 5, 5], 3, 5], expected: [true, true, true, false, true, true, true], hidden: true },
      { name: "large spread", args: [[0, 100, 200, 201, 202, 203, 300], 2, 100], expected: [true, true, true, true, false, false, true], hidden: true },
    ],
    hints: [
      "You only need the timestamps of ACCEPTED requests that are still inside the window.",
      "Keep them in a queue; before deciding, drop from the front while `front <= t - windowMs`.",
      "If the queue length is below `limit`, push `t` and answer `true`; otherwise answer `false` without pushing.",
    ],
    solution:
      "function rateLimit(times, limit, windowMs) {\n  const accepted = [];\n  let head = 0;\n  return times.map((t) => {\n    while (head < accepted.length && accepted[head] <= t - windowMs) head++;\n    if (accepted.length - head < limit) {\n      accepted.push(t);\n      return true;\n    }\n    return false;\n  });\n}",
    explanation:
      "A sliding-window log: each timestamp is pushed once and evicted once, so the total work is O(n) and memory is O(limit). Using a head index avoids O(n) `shift` calls. Follow-up: how does this change across several Node processes or pods (a shared store like Redis with atomic ops), and when would you pick a token bucket for smoother bursts?",
  },
  {
    id: "nodejs-cc-10",
    domain: "d3",
    lesson: "d3-modules",
    level: "staff",
    title: "Module load order with cycles",
    idea: "Kahn's algorithm",
    prompt:
      "Write `loadOrder(graph)`: `graph` maps each module to the modules it requires (every required module is also a key). Return `{order: [...]}` listing modules so each comes after its dependencies; when several are ready, take them in alphabetical order. If a cycle makes that impossible, return `{error: 'cycle', stuck: [...]}`, where `stuck` is the alphabetically sorted list of modules that could not be ordered. `loadOrder({app:['db','log'],db:['log'],log:[]})` returns `{order:['log','db','app']}`.",
    fn: "loadOrder",
    starter: "function loadOrder(graph) {\n  // TODO\n  return { order: [] };\n}",
    tests: [
      { name: "simple chain", args: [{ app: ["db", "log"], db: ["log"], log: [] }], expected: { order: ["log", "db", "app"] } },
      { name: "empty graph", args: [{}], expected: { order: [] } },
      { name: "single module", args: [{ a: [] }], expected: { order: ["a"] } },
      { name: "alphabetical ties", args: [{ c: [], a: [], b: [] }], expected: { order: ["a", "b", "c"] } },
      { name: "diamond", args: [{ top: ["l", "r"], l: ["base"], r: ["base"], base: [] }], expected: { order: ["base", "l", "r", "top"] } },
      { name: "two-node cycle", args: [{ a: ["b"], b: ["a"] }], expected: { error: "cycle", stuck: ["a", "b"] } },
      { name: "cycle plus a dependent", args: [{ app: ["a"], a: ["b"], b: ["a"], ok: [] }], expected: { error: "cycle", stuck: ["a", "app", "b"] }, hidden: true },
      { name: "self dependency", args: [{ x: ["x"], y: [] }], expected: { error: "cycle", stuck: ["x"] }, hidden: true },
      { name: "wide graph", args: [{ e: ["c", "d"], d: ["b"], c: ["a", "b"], b: ["a"], a: [] }], expected: { order: ["a", "b", "c", "d", "e"] }, hidden: true },
    ],
    hints: [
      "Count, for every module, how many of its dependencies are not yet loaded.",
      "Repeatedly take the alphabetically first module with a count of 0, append it, and decrement the count of every module that requires it.",
      "If you run out of ready modules before placing all of them, the rest are stuck: return them sorted with `error: 'cycle'`.",
    ],
    solution:
      "function loadOrder(graph) {\n  const names = Object.keys(graph);\n  const pending = {};\n  const dependents = {};\n  for (const n of names) {\n    pending[n] = graph[n].length;\n    dependents[n] = dependents[n] || [];\n  }\n  for (const n of names) for (const d of graph[n]) dependents[d].push(n);\n  const ready = names.filter((n) => pending[n] === 0).sort();\n  const order = [];\n  while (ready.length) {\n    const n = ready.shift();\n    order.push(n);\n    for (const m of dependents[n]) {\n      if (--pending[m] === 0) {\n        ready.push(m);\n        ready.sort();\n      }\n    }\n  }\n  if (order.length === names.length) return { order };\n  const done = new Set(order);\n  return { error: 'cycle', stuck: names.filter((n) => !done.has(n)).sort() };\n}",
    explanation:
      "Kahn's algorithm: modules with no unmet dependencies are safe to load, and loading one may unblock its dependents. Whatever never becomes ready is part of a cycle or depends on one. O(V + E) apart from the sort for tie-breaking. Follow-up: what does Node's CommonJS loader do on a cycle (a partially filled `exports`), and how do you break one in practice?",
  },
  {
    id: "nodejs-cc-11",
    domain: "d2",
    lesson: "d2-emitter",
    level: "staff",
    title: "Event emitter with once and off",
    idea: "listener list per event",
    prompt:
      "Model Node's `EventEmitter` over an op log. `runEmitter(ops)` takes ops `['on', event, name]`, `['once', event, name]`, `['off', event, name]` and `['emit', event, arg]`, and returns the log of listener calls as strings `'name(arg)'`, in the order they ran. Listeners run in registration order. A `once` listener is removed before it runs, so it fires at most once. `off` removes only ONE registration of that name for that event: the most recently added one, as Node does. Emitting an event with no listeners logs nothing.",
    fn: "runEmitter",
    starter: "function runEmitter(ops) {\n  const log = [];\n  // TODO\n  return log;\n}",
    tests: [
      { name: "on and once", args: [[["on", "x", "A"], ["once", "x", "B"], ["emit", "x", 1], ["emit", "x", 2]]], expected: ["A(1)", "B(1)", "A(2)"] },
      { name: "no ops", args: [[]], expected: [] },
      { name: "emit without listeners", args: [[["emit", "x", 1]]], expected: [] },
      { name: "registration order", args: [[["on", "e", "C"], ["on", "e", "A"], ["on", "e", "B"], ["emit", "e", "z"]]], expected: ["C(z)", "A(z)", "B(z)"] },
      { name: "events are independent", args: [[["on", "a", "A"], ["on", "b", "B"], ["emit", "b", 0]]], expected: ["B(0)"] },
      { name: "off removes it", args: [[["on", "x", "A"], ["on", "x", "B"], ["off", "x", "A"], ["emit", "x", 5]]], expected: ["B(5)"] },
      { name: "off before a once fires", args: [[["once", "x", "A"], ["off", "x", "A"], ["emit", "x", 1]]], expected: [] },
      { name: "duplicate registration, off removes the latest", args: [[["on", "x", "A"], ["on", "x", "B"], ["on", "x", "A"], ["off", "x", "A"], ["emit", "x", 9]]], expected: ["A(9)", "B(9)"], hidden: true },
      { name: "two onces keep their order", args: [[["once", "x", "A"], ["on", "x", "B"], ["once", "x", "C"], ["emit", "x", 1], ["emit", "x", 2]]], expected: ["A(1)", "B(1)", "C(1)", "B(2)"], hidden: true },
    ],
    hints: [
      "Keep an object mapping each event to an array of listener records `{name, once}`.",
      "For `emit`, take a copy of the array, remove the `once` records from the real one, then log each copied record in order.",
      "For `off`, search the event's array from the END for the matching name and splice that one record out.",
    ],
    solution:
      "function runEmitter(ops) {\n  const log = [];\n  const listeners = {};\n  for (const [op, event, x] of ops) {\n    const list = (listeners[event] = listeners[event] || []);\n    if (op === 'on' || op === 'once') {\n      list.push({ name: x, once: op === 'once' });\n    } else if (op === 'off') {\n      for (let i = list.length - 1; i >= 0; i--) {\n        if (list[i].name === x) {\n          list.splice(i, 1);\n          break;\n        }\n      }\n    } else if (op === 'emit') {\n      const snapshot = list.slice();\n      listeners[event] = list.filter((l) => !l.once);\n      for (const l of snapshot) log.push(l.name + '(' + x + ')');\n    }\n  }\n  return log;\n}",
    explanation:
      "Each event owns an ordered list; `emit` iterates over a snapshot so listeners added or removed mid-emit don't change the current run, and `once` entries are dropped before they run. Registration and emit are O(listeners). Follow-up: what does Node do for the special `'error'` event with no listener, and what is the `MaxListenersExceededWarning` guarding against?",
  },
];
