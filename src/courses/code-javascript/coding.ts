import { T } from "@/engine/coding";
import type { CodingChallenge } from "@/engine/types";

/** Live coding challenges for the JavaScript track. Plain JavaScript, run in a browser worker. */
export const codingChallenges: CodingChallenge[] = [
  // ───────────── junior ─────────────
  {
    id: "javascript-cc-01",
    domain: "d4",
    lesson: "d4-arrays",
    level: "junior",
    title: "FizzBuzz",
    idea: "loop + modulo",
    prompt:
      "Write `fizzBuzz(n)` that returns an array of strings for the numbers `1..n`. Use `\"Fizz\"` for multiples of 3, `\"Buzz\"` for multiples of 5, `\"FizzBuzz\"` for multiples of both, and the number as a string otherwise. `fizzBuzz(5)` is `[\"1\", \"2\", \"Fizz\", \"4\", \"Buzz\"]`. For `n = 0` return an empty array.",
    fn: "fizzBuzz",
    starter: `function fizzBuzz(n) {
  // TODO: build the array for 1..n
  return [];
}`,
    tests: [
      { name: "n = 5", args: [5], expected: ["1", "2", "Fizz", "4", "Buzz"] },
      { name: "n = 0", args: [0], expected: [] },
      { name: "n = 1", args: [1], expected: ["1"] },
      { name: "n = 3", args: [3], expected: ["1", "2", "Fizz"] },
      { name: "n = 15 ends in FizzBuzz", args: [15], expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"] },
      { name: "n = 20", hidden: true, args: [20], expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz", "16", "17", "Fizz", "19", "Buzz"] },
      {
        name: "n = 30",
        hidden: true,
        args: [30],
        expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz", "16", "17", "Fizz", "19", "Buzz", "Fizz", "22", "23", "Fizz", "Buzz", "26", "Fizz", "28", "29", "FizzBuzz"],
      },
    ],
    hints: [
      "Loop from 1 to n and push one string per number.",
      "Check the multiple-of-both case first, otherwise `\"Fizz\"` would win for 15.",
      "`i % 15 === 0` is the combined test. Build the string with `String(i)` for the fallback.",
    ],
    solution: `function fizzBuzz(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) out.push("FizzBuzz");
    else if (i % 3 === 0) out.push("Fizz");
    else if (i % 5 === 0) out.push("Buzz");
    else out.push(String(i));
  }
  return out;
}`,
    explanation:
      "One pass, checking the most specific condition first so 15 doesn't fall into the Fizz branch. It is O(n) time and O(n) output. Follow-up: how would you make the rules configurable (a list of `[divisor, word]` pairs, concatenating the words that match)?",
  },
  {
    id: "javascript-cc-02",
    domain: "d1",
    lesson: "d1-types",
    level: "junior",
    title: "A better typeof",
    idea: "typeof traps",
    prompt:
      "Write `typeName(v)` that works like `typeof` but tells the truth about the awkward cases: return `\"null\"` for `null`, `\"array\"` for arrays, and `\"nan\"` for `NaN`. Everything else returns what `typeof` returns, so `typeName(42)` is `\"number\"` and `typeName({})` is `\"object\"`.",
    fn: "typeName",
    starter: `function typeName(v) {
  // TODO: handle null, arrays and NaN before falling back to typeof
  return typeof v;
}`,
    tests: [
      { name: "null", args: [null], expected: "null" },
      { name: "array", args: [[1, 2]], expected: "array" },
      { name: "NaN", args: [T.nan], expected: "nan" },
      { name: "undefined", args: [T.undefined], expected: "undefined" },
      { name: "plain object", args: [{ a: 1 }], expected: "object" },
      { name: "number", args: [42], expected: "number" },
      { name: "Infinity is a number", hidden: true, args: [T.infinity], expected: "number" },
      { name: "empty array", hidden: true, args: [[]], expected: "array" },
      { name: "empty string", hidden: true, args: [""], expected: "string" },
      { name: "true", hidden: true, args: [true], expected: "boolean" },
    ],
    hints: [
      "`typeof null` and `typeof []` are both `\"object\"`, so check those first.",
      "`Array.isArray` detects arrays. `NaN` is the only value not equal to itself, and `Number.isNaN` checks it safely.",
      "Order: `v === null`, `Array.isArray(v)`, `Number.isNaN(v)`, then `typeof v`.",
    ],
    solution: `function typeName(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  if (Number.isNaN(v)) return "nan";
  return typeof v;
}`,
    explanation:
      "`Number.isNaN` (unlike the global `isNaN`) doesn't coerce, so `typeName(\"abc\")` stays `\"string\"`. Each check is O(1). Follow-up: how do you tell a `Date` or a `Map` from a plain object? `Object.prototype.toString.call(v)` gives `[object Date]`.",
  },

  // ───────────── intermediate ─────────────
  {
    id: "javascript-cc-03",
    domain: "d4",
    lesson: "d4-arrays",
    level: "intermediate",
    title: "Group by key",
    idea: "reduce into an object",
    prompt:
      "Write `groupBy(items, key)` that takes an array of objects and a property name and returns an object mapping each value of that property (as a string) to the array of items that have it, in the original order. `groupBy([{t:\"a\",n:1},{t:\"b\",n:2},{t:\"a\",n:3}], \"t\")` gives `{ a: [{t:\"a\",n:1},{t:\"a\",n:3}], b: [{t:\"b\",n:2}] }`. An empty array gives `{}`.",
    fn: "groupBy",
    starter: `function groupBy(items, key) {
  // TODO: collect items under items[i][key]
  return {};
}`,
    tests: [
      {
        name: "two groups",
        args: [[{ t: "a", n: 1 }, { t: "b", n: 2 }, { t: "a", n: 3 }], "t"],
        expected: { a: [{ t: "a", n: 1 }, { t: "a", n: 3 }], b: [{ t: "b", n: 2 }] },
      },
      { name: "empty input", args: [[], "t"], expected: {} },
      { name: "one item", args: [[{ k: "x" }], "k"], expected: { x: [{ k: "x" }] } },
      { name: "numeric values become string keys", args: [[{ age: 30, n: "a" }, { age: 25, n: "b" }, { age: 30, n: "c" }], "age"], expected: { "30": [{ age: 30, n: "a" }, { age: 30, n: "c" }], "25": [{ age: 25, n: "b" }] } },
      { name: "all in one group", args: [[{ r: "x", i: 1 }, { r: "x", i: 2 }, { r: "x", i: 3 }], "r"], expected: { x: [{ r: "x", i: 1 }, { r: "x", i: 2 }, { r: "x", i: 3 }] } },
      { name: "missing key groups under 'undefined'", hidden: true, args: [[{ a: 1 }, { b: 2 }, { a: 3 }], "a"], expected: { "1": [{ a: 1 }], undefined: [{ b: 2 }], "3": [{ a: 3 }] } },
      {
        name: "mixed order preserved",
        hidden: true,
        args: [[{ c: "r", i: 1 }, { c: "g", i: 2 }, { c: "b", i: 3 }, { c: "r", i: 4 }, { c: "g", i: 5 }, { c: "r", i: 6 }], "c"],
        expected: { r: [{ c: "r", i: 1 }, { c: "r", i: 4 }, { c: "r", i: 6 }], g: [{ c: "g", i: 2 }, { c: "g", i: 5 }], b: [{ c: "b", i: 3 }] },
      },
    ],
    hints: [
      "Walk the array once and keep an object of arrays.",
      "For each item, compute the group name with `String(item[key])`, create the array if it's missing, then push.",
      "`(groups[name] ??= []).push(item)` does the create-or-reuse in one line.",
    ],
    solution: `function groupBy(items, key) {
  const groups = {};
  for (const item of items) {
    const name = String(item[key]);
    (groups[name] ??= []).push(item);
  }
  return groups;
}`,
    explanation:
      "A single pass builds the buckets, so it's O(n) time. Using `??=` creates each bucket lazily, and `String()` mirrors how object keys coerce anyway. Follow-up: why might a `Map` be safer than a plain object here (a key like `\"__proto__\"`), and how does `Object.groupBy` do it natively?",
  },
  {
    id: "javascript-cc-04",
    domain: "d4",
    lesson: "d4-arrays",
    level: "intermediate",
    title: "Flatten to a depth",
    idea: "recursion with a depth budget",
    prompt:
      "Implement `flatten(arr, depth = 1)` without using `Array.prototype.flat`. It returns a new array where nested arrays are expanded up to `depth` levels. `flatten([1, [2, [3]]])` is `[1, 2, [3]]` and `flatten([1, [2, [3]]], 2)` is `[1, 2, 3]`. A depth of `Infinity` flattens everything; depth `0` returns a shallow copy.",
    fn: "flatten",
    starter: `function flatten(arr, depth = 1) {
  // TODO: expand nested arrays up to \`depth\` levels
  return arr;
}`,
    tests: [
      { name: "default depth is 1", args: [[1, [2, [3]]]], expected: [1, 2, [3]] },
      { name: "depth 2", args: [[1, [2, [3]]], 2], expected: [1, 2, 3] },
      { name: "depth 0 keeps nesting", args: [[1, [2]], 0], expected: [1, [2]] },
      { name: "empty array", args: [[]], expected: [] },
      { name: "Infinity flattens all", args: [[1, [2, [3, [4]]]], T.infinity], expected: [1, 2, 3, 4] },
      { name: "empty nested arrays vanish", hidden: true, args: [[[], [[]], 1], T.infinity], expected: [1] },
      { name: "five levels, depth 3", hidden: true, args: [[1, [2, [3, [4, [5]]]]], 3], expected: [1, 2, 3, 4, [5]] },
      { name: "strings are not expanded", hidden: true, args: [["ab", ["cd", ["ef"]]], 1], expected: ["ab", "cd", ["ef"]] },
    ],
    hints: [
      "Build a result array and loop over the input. If an item is an array and you still have depth left, expand it; otherwise push it as is.",
      "Recursion: `flatten(item, depth - 1)` gives the expanded version of a nested array. Spread or `push(...)` it into the result.",
      "`Infinity - 1` is still `Infinity`, so the same code handles unlimited depth. `Array.isArray` tells arrays from strings.",
    ],
    solution: `function flatten(arr, depth = 1) {
  const out = [];
  for (const item of arr) {
    if (Array.isArray(item) && depth > 0) {
      out.push(...flatten(item, depth - 1));
    } else {
      out.push(item);
    }
  }
  return out;
}`,
    explanation:
      "Each element is visited once, so the time is O(total elements) and the recursion depth is at most the nesting depth. Note `out.push(...big)` can overflow the stack on huge arrays; a loop or `concat` avoids that. Follow-up: write an iterative version with an explicit stack.",
  },
  {
    id: "javascript-cc-05",
    domain: "d1",
    lesson: "d1-closures",
    level: "intermediate",
    title: "Counter with private state",
    idea: "closure over a variable",
    prompt:
      "Write `runCounter(start, ops)`. Inside it, build a counter with a closure: `\"inc\"` adds 1, `\"dec\"` subtracts 1 but never goes below 0, `\"reset\"` goes back to `start`, and `\"get\"` records the current value. Return the array of recorded values. `runCounter(0, [\"inc\", \"inc\", \"get\"])` is `[2]`.",
    fn: "runCounter",
    starter: `function runCounter(start, ops) {
  const out = [];
  // TODO: keep \`count\` in a closure and apply each op
  return out;
}`,
    tests: [
      { name: "two incs", args: [0, ["inc", "inc", "get"]], expected: [2] },
      { name: "dec then reset", args: [5, ["dec", "get", "reset", "get"]], expected: [4, 5] },
      { name: "never below zero", args: [0, ["dec", "get"]], expected: [0] },
      { name: "no ops", args: [3, []], expected: [] },
      { name: "get twice", args: [1, ["get", "get"]], expected: [1, 1] },
      { name: "dec stops at 0 then climbs", hidden: true, args: [1, ["dec", "dec", "dec", "inc", "get"]], expected: [1] },
      { name: "long mix", hidden: true, args: [10, ["inc", "get", "dec", "dec", "get", "reset", "inc", "inc", "get"]], expected: [11, 9, 12] },
    ],
    hints: [
      "Create a `count` variable and a small object (or functions) that read and change it.",
      "The operations are closures over `count`: they share one variable instead of passing it around.",
      "`inc`, `dec` (with `Math.max(0, count - 1)`), `reset`, `get`. Loop over `ops` and look up the matching function.",
    ],
    solution: `function runCounter(start, ops) {
  function createCounter() {
    let count = start;
    return {
      inc: () => { count += 1; },
      dec: () => { count = Math.max(0, count - 1); },
      reset: () => { count = start; },
      get: () => count,
    };
  }
  const counter = createCounter();
  const out = [];
  for (const op of ops) {
    if (op === "get") out.push(counter.get());
    else counter[op]();
  }
  return out;
}`,
    explanation:
      "`count` is only reachable through the four functions that close over it, which is the module pattern: private state without classes. Each op is O(1). Follow-up: what happens if two counters are created from the same factory, and how would `#private` class fields compare?",
  },
  {
    id: "javascript-cc-06",
    domain: "d3",
    lesson: "d3-errors",
    level: "intermediate",
    title: "Retry a flaky task",
    idea: "async loop + try/catch",
    prompt:
      "Finish the async function `runWithRetry(failures, maxAttempts)`. The `task` inside already fails its first `failures` calls and succeeds afterwards. Call it up to `maxAttempts` times, stopping at the first success. Resolve `{ ok: true, value, attempts }` on success, or `{ ok: false, error, attempts }` where `error` is the last error's `message`. If `maxAttempts` is below 1, resolve `{ ok: false, error: \"no attempts\", attempts: 0 }`.",
    fn: "runWithRetry",
    starter: `async function runWithRetry(failures, maxAttempts) {
  let calls = 0;
  const task = async () => {
    calls++;
    if (calls <= failures) throw new Error("fail " + calls);
    return "ok";
  };
  // TODO: retry task() up to maxAttempts times
}`,
    tests: [
      { name: "succeeds first time", args: [0, 3], expected: { ok: true, value: "ok", attempts: 1 } },
      { name: "succeeds on the third try", args: [2, 3], expected: { ok: true, value: "ok", attempts: 3 } },
      { name: "gives up with the last error", args: [3, 3], expected: { ok: false, error: "fail 3", attempts: 3 } },
      { name: "single attempt fails", args: [5, 1], expected: { ok: false, error: "fail 1", attempts: 1 } },
      { name: "zero attempts", args: [0, 0], expected: { ok: false, error: "no attempts", attempts: 0 } },
      { name: "last allowed attempt succeeds", hidden: true, args: [4, 5], expected: { ok: true, value: "ok", attempts: 5 } },
      { name: "many failures", hidden: true, args: [6, 4], expected: { ok: false, error: "fail 4", attempts: 4 } },
    ],
    hints: [
      "Use a `for` loop from attempt 1 to `maxAttempts` and `await task()` inside `try`.",
      "On success, return right away. On failure, remember the error and let the loop continue.",
      "After the loop, return the failure object using the last error's `message`. Handle `maxAttempts < 1` before the loop.",
    ],
    solution: `async function runWithRetry(failures, maxAttempts) {
  let calls = 0;
  const task = async () => {
    calls++;
    if (calls <= failures) throw new Error("fail " + calls);
    return "ok";
  };
  if (maxAttempts < 1) return { ok: false, error: "no attempts", attempts: 0 };
  let lastError = "";
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const value = await task();
      return { ok: true, value, attempts: attempt };
    } catch (err) {
      lastError = err.message;
    }
  }
  return { ok: false, error: lastError, attempts: maxAttempts };
}`,
    explanation:
      "Awaiting inside a `for` loop keeps the attempts sequential, and `try/catch` around `await` turns a rejection into normal control flow. Time is O(maxAttempts) task calls. Follow-up: add exponential backoff with jitter, only retry errors that are retryable, and respect an `AbortSignal`.",
  },

  // ───────────── senior ─────────────
  {
    id: "javascript-cc-07",
    domain: "d1",
    lesson: "d1-closures",
    level: "senior",
    title: "Debounce, on a simulated clock",
    idea: "closure + one pending timer",
    prompt:
      "A debounced function fires `wait` ms after the last call in a burst. Simulate it: `simulateDebounce(wait, calls)` takes `calls` as `[time, value]` pairs in ascending time and returns the `[fireTime, value]` pairs that actually fire, in order. A call arriving before the pending timer fires replaces it; a call at exactly the fire time comes after the timer fires. `simulateDebounce(100, [[0,\"a\"],[50,\"b\"],[200,\"c\"]])` is `[[150,\"b\"],[300,\"c\"]]`.",
    fn: "simulateDebounce",
    starter: `function simulateDebounce(wait, calls) {
  const fired = [];
  // TODO: track the single pending call, like a timer id in a closure
  return fired;
}`,
    tests: [
      { name: "burst then a lone call", args: [100, [[0, "a"], [50, "b"], [200, "c"]]], expected: [[150, "b"], [300, "c"]] },
      { name: "single call", args: [100, [[0, "a"]]], expected: [[100, "a"]] },
      { name: "no calls", args: [100, []], expected: [] },
      { name: "call exactly at fire time comes after", args: [100, [[0, "a"], [100, "b"]]], expected: [[100, "a"], [200, "b"]] },
      { name: "long burst fires once", args: [50, [[0, 1], [10, 2], [20, 3], [30, 4]]], expected: [[80, 4]] },
      {
        name: "several bursts",
        hidden: true,
        args: [10, [[0, "a"], [5, "b"], [15, "c"], [20, "d"], [40, "e"], [41, "f"], [100, "g"]]],
        expected: [[15, "b"], [30, "d"], [51, "f"], [110, "g"]],
      },
      { name: "wait of zero fires every call", hidden: true, args: [0, [[1, "a"], [1, "b"]]], expected: [[1, "a"], [1, "b"]] },
    ],
    hints: [
      "Only one call can be pending at a time. Keep `pending = { fireAt, value }` (or `null`).",
      "When a new call arrives at time `t`: if the pending timer's `fireAt <= t`, it already fired, so record it. Then replace `pending` with `{ fireAt: t + wait, value }`.",
      "After the last call, the pending one still fires: push it at the end.",
    ],
    solution: `function simulateDebounce(wait, calls) {
  const fired = [];
  let pending = null;
  for (const [time, value] of calls) {
    if (pending && pending.fireAt <= time) {
      fired.push([pending.fireAt, pending.value]);
    }
    pending = { fireAt: time + wait, value };
  }
  if (pending) fired.push([pending.fireAt, pending.value]);
  return fired;
}`,
    explanation:
      "The real `debounce` keeps a timer id in a closure and does `clearTimeout` then `setTimeout` on every call; replacing `pending` is exactly that cancel-and-reschedule. One pass, O(n). Follow-up: add a leading-edge option, a `cancel()` method, and `flush()`.",
  },
  {
    id: "javascript-cc-08",
    domain: "d2",
    lesson: "d2-refs",
    level: "senior",
    title: "LRU cache",
    idea: "Map keeps insertion order",
    prompt:
      "Implement an LRU cache driven by an op list: `runLRU(capacity, ops)`. Ops are `[\"put\", key, value]` and `[\"get\", key]`. `get` returns the value (or `-1` if missing) and counts as a use; `put` inserts or updates and also counts as a use. When the cache exceeds `capacity`, evict the least recently used key. Return the results of the `get` ops, in order. Both operations should be O(1).",
    fn: "runLRU",
    starter: `function runLRU(capacity, ops) {
  const out = [];
  // TODO: a Map remembers insertion order, which you can use as recency
  return out;
}`,
    tests: [
      {
        name: "classic example",
        args: [2, [["put", 1, 1], ["put", 2, 2], ["get", 1], ["put", 3, 3], ["get", 2], ["put", 4, 4], ["get", 1], ["get", 3], ["get", 4]]],
        expected: [1, -1, -1, 3, 4],
      },
      { name: "capacity 1", args: [1, [["put", "a", 1], ["put", "b", 2], ["get", "a"], ["get", "b"]]], expected: [-1, 2] },
      { name: "update refreshes recency", args: [2, [["put", "a", 1], ["put", "b", 2], ["put", "a", 10], ["put", "c", 3], ["get", "b"], ["get", "a"], ["get", "c"]]], expected: [-1, 10, 3] },
      { name: "no ops", args: [2, []], expected: [] },
      { name: "get on empty cache", args: [2, [["get", "x"]]], expected: [-1] },
      { name: "falsy values are real values", hidden: true, args: [2, [["put", "z", 0], ["get", "z"], ["put", "n", null], ["get", "n"]]], expected: [0, null] },
      {
        name: "capacity 3 walk",
        hidden: true,
        args: [3, [["put", 1, "a"], ["put", 2, "b"], ["put", 3, "c"], ["get", 1], ["put", 4, "d"], ["get", 2], ["get", 3], ["get", 1], ["put", 5, "e"], ["get", 4], ["get", 3], ["get", 1], ["get", 5]]],
        expected: ["a", -1, "c", "a", -1, "c", "a", "e"],
      },
    ],
    hints: [
      "A `Map` iterates in insertion order. If you delete and re-set a key, it moves to the end: the end is 'most recent', the start is 'least recent'.",
      "On `get`: if the key exists, delete it and set it again (moving it to the end) and return the value; else return `-1`.",
      "On `put`: delete the key if present, set it, then if `map.size > capacity` delete `map.keys().next().value`. Use `map.has`, not truthiness, so `0` and `null` values work.",
    ],
    solution: `function runLRU(capacity, ops) {
  const cache = new Map();
  const out = [];
  for (const [op, key, value] of ops) {
    if (op === "get") {
      if (!cache.has(key)) {
        out.push(-1);
        continue;
      }
      const v = cache.get(key);
      cache.delete(key);
      cache.set(key, v);
      out.push(v);
    } else {
      cache.delete(key);
      cache.set(key, value);
      if (cache.size > capacity) {
        cache.delete(cache.keys().next().value);
      }
    }
  }
  return out;
}`,
    explanation:
      "A `Map` gives O(1) lookup and remembers insertion order, so re-inserting on every use keeps the oldest key first, ready to evict. Every op is O(1) amortised. Follow-up: the classic answer is a hash map plus a doubly linked list; why would you still pick the `Map` trick in JavaScript, and what does it cost?",
  },
  {
    id: "javascript-cc-09",
    domain: "d3",
    lesson: "d3-promises",
    level: "senior",
    title: "Promise pool, simulated",
    idea: "limit concurrency, track a clock",
    prompt:
      "A promise pool starts tasks in order but never runs more than `limit` at once; a new task starts the moment a slot frees up. Simulate it on a virtual clock: `simulatePool(durations, limit)` returns, for each task (in original order), the time it finishes. All tasks are ready at time 0 and `limit` is at least 1. `simulatePool([3, 2, 1], 2)` is `[3, 2, 3]`.",
    fn: "simulatePool",
    starter: `function simulatePool(durations, limit) {
  // TODO: track when each of the \`limit\` slots becomes free
  return [];
}`,
    tests: [
      { name: "three tasks, two slots", args: [[3, 2, 1], 2], expected: [3, 2, 3] },
      { name: "one task", args: [[5], 3], expected: [5] },
      { name: "no tasks", args: [[], 2], expected: [] },
      { name: "limit 1 is sequential", args: [[1, 1, 1, 1], 1], expected: [1, 2, 3, 4] },
      { name: "slot frees early", args: [[4, 1, 1, 1], 2], expected: [4, 1, 2, 3] },
      { name: "limit larger than tasks", args: [[2, 7, 1], 10], expected: [2, 7, 1] },
      { name: "six mixed tasks, three slots", hidden: true, args: [[5, 3, 8, 2, 4, 1], 3], expected: [5, 3, 8, 5, 9, 6] },
      { name: "equal durations", hidden: true, args: [[2, 2, 2, 2, 2, 2], 2], expected: [2, 2, 4, 4, 6, 6] },
    ],
    hints: [
      "Model the pool as `limit` slots, each with the time it becomes free (all start at 0).",
      "For each task in order, take the slot that frees up soonest: the task starts then and ends at `start + duration`.",
      "Keep `free = new Array(limit).fill(0)`. Pick the index of the smallest value, set `free[i] += duration`, and record that new value.",
    ],
    solution: `function simulatePool(durations, limit) {
  const free = new Array(limit).fill(0);
  const finish = [];
  for (const d of durations) {
    let slot = 0;
    for (let i = 1; i < free.length; i++) {
      if (free[i] < free[slot]) slot = i;
    }
    free[slot] += d;
    finish.push(free[slot]);
  }
  return finish;
}`,
    explanation:
      "Each task takes whichever worker frees first, which is exactly how an `await Promise.race`-based or worker-loop pool behaves. Scanning the slots costs O(n * limit); a min-heap makes it O(n log limit). Follow-up: how would you write the real async version, and what should happen to the other tasks when one rejects?",
  },
  {
    id: "javascript-cc-10",
    domain: "d4",
    lesson: "d4-modules",
    level: "senior",
    title: "Topological sort",
    idea: "Kahn's algorithm",
    prompt:
      "Given `n` nodes numbered `0..n-1` and `edges` where `[a, b]` means `a` must come before `b`, return a valid order. Whenever several nodes are available, take the smallest label first, so the answer is unique. If the graph has a cycle, return `[]`. `topoSort(4, [[0,1],[0,2],[1,3],[2,3]])` is `[0, 1, 2, 3]`.",
    fn: "topoSort",
    starter: `function topoSort(n, edges) {
  // TODO: Kahn's algorithm: repeatedly take a node with no unmet prerequisites
  return [];
}`,
    tests: [
      { name: "diamond", args: [4, [[0, 1], [0, 2], [1, 3], [2, 3]]], expected: [0, 1, 2, 3] },
      { name: "no edges", args: [3, []], expected: [0, 1, 2] },
      { name: "reverse chain", args: [3, [[2, 1], [1, 0]]], expected: [2, 1, 0] },
      { name: "two-node cycle", args: [2, [[0, 1], [1, 0]]], expected: [] },
      { name: "single node", args: [1, []], expected: [0] },
      { name: "empty graph", args: [0, []], expected: [] },
      { name: "six nodes", hidden: true, args: [6, [[5, 2], [5, 0], [4, 0], [4, 1], [2, 3], [3, 1]]], expected: [4, 5, 0, 2, 3, 1] },
      { name: "cycle hidden behind valid nodes", hidden: true, args: [4, [[0, 1], [1, 2], [2, 1], [0, 3]]], expected: [] },
      { name: "self loop", hidden: true, args: [1, [[0, 0]]], expected: [] },
    ],
    hints: [
      "Count each node's incoming edges (its indegree) and build an adjacency list.",
      "Repeatedly take an available node (indegree 0), append it to the order, and lower the indegree of its neighbours.",
      "Always pick the smallest available label (sort the queue, or use a simple scan). If you placed fewer than `n` nodes, there is a cycle: return `[]`.",
    ],
    solution: `function topoSort(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  const indeg = new Array(n).fill(0);
  for (const [a, b] of edges) {
    adj[a].push(b);
    indeg[b]++;
  }
  const ready = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) ready.push(i);
  const order = [];
  while (ready.length) {
    ready.sort((x, y) => x - y);
    const node = ready.shift();
    order.push(node);
    for (const next of adj[node]) {
      if (--indeg[next] === 0) ready.push(next);
    }
  }
  return order.length === n ? order : [];
}`,
    explanation:
      "Kahn's algorithm peels off nodes with no remaining prerequisites; if some nodes never reach indegree 0, they sit on a cycle. With a heap for the 'smallest first' rule it is O((V + E) log V); with plain Kahn it is O(V + E). Follow-up: how would a DFS version detect the cycle (three colours), and where would you use this (build graphs, course prerequisites, module loading)?",
  },

  // ───────────── staff ─────────────
  {
    id: "javascript-cc-11",
    domain: "d2",
    lesson: "d2-this",
    level: "staff",
    title: "Event emitter",
    idea: "on / once / off / emit",
    prompt:
      "Design a small event emitter and drive it with an op list: `runEmitter(ops)`. Ops: `[\"on\", event, id]` adds a listener, `[\"once\", event, id]` adds one that is removed after its first call, `[\"off\", event, id]` removes the first listener with that id for the event (no-op if none), and `[\"emit\", event]` calls the listeners in registration order. Listeners are identified by `id`. Return one array per `emit`: the ids that were called, in order. The same id may be registered twice.",
    fn: "runEmitter",
    starter: `function runEmitter(ops) {
  const results = [];
  // TODO: build an Emitter (on, once, off, emit) and replay the ops against it
  return results;
}`,
    tests: [
      { name: "order of registration", args: [[["on", "a", "x"], ["on", "a", "y"], ["emit", "a"], ["emit", "b"]]], expected: [["x", "y"], []] },
      { name: "once fires one time", args: [[["once", "a", "x"], ["on", "a", "y"], ["emit", "a"], ["emit", "a"]]], expected: [["x", "y"], ["y"]] },
      { name: "off removes a listener", args: [[["on", "a", "x"], ["on", "a", "y"], ["off", "a", "x"], ["emit", "a"]]], expected: [["y"]] },
      { name: "off before a once fires", args: [[["once", "a", "x"], ["off", "a", "x"], ["emit", "a"]]], expected: [[]] },
      { name: "off with nothing registered", args: [[["off", "a", "x"], ["emit", "a"]]], expected: [[]] },
      { name: "no ops", args: [[]], expected: [] },
      {
        name: "mixing on, once and later listeners",
        hidden: true,
        args: [[["on", "a", "x"], ["once", "a", "y"], ["on", "a", "z"], ["emit", "a"], ["on", "a", "w"], ["emit", "a"]]],
        expected: [["x", "y", "z"], ["x", "z", "w"]],
      },
      { name: "duplicate ids, off removes one", hidden: true, args: [[["on", "a", "x"], ["on", "a", "x"], ["emit", "a"], ["off", "a", "x"], ["emit", "a"]]], expected: [["x", "x"], ["x"]] },
      { name: "events are independent", hidden: true, args: [[["on", "a", "x"], ["on", "b", "y"], ["once", "b", "z"], ["emit", "b"], ["emit", "a"], ["emit", "b"]]], expected: [["y", "z"], ["x"], ["y"]] },
    ],
    hints: [
      "Store listeners per event in a `Map` from event name to an array of `{ id, once }` entries.",
      "`emit` should loop over a copy of the array, so removing a `once` listener while emitting doesn't skip its neighbour.",
      "For `once`: after calling, remove that exact entry (compare by object identity, not id, because ids can repeat). For `off`: find the first entry with the id and `splice` it out.",
    ],
    solution: `function runEmitter(ops) {
  class Emitter {
    constructor() {
      this.events = new Map();
    }
    add(event, id, once) {
      if (!this.events.has(event)) this.events.set(event, []);
      this.events.get(event).push({ id, once });
    }
    on(event, id) {
      this.add(event, id, false);
    }
    once(event, id) {
      this.add(event, id, true);
    }
    off(event, id) {
      const list = this.events.get(event) || [];
      const i = list.findIndex((l) => l.id === id);
      if (i !== -1) list.splice(i, 1);
    }
    emit(event) {
      const list = this.events.get(event) || [];
      const called = [];
      for (const entry of [...list]) {
        if (entry.once) {
          const i = list.indexOf(entry);
          if (i !== -1) list.splice(i, 1);
        }
        called.push(entry.id);
      }
      return called;
    }
  }
  const emitter = new Emitter();
  const results = [];
  for (const [op, event, id] of ops) {
    if (op === "emit") results.push(emitter.emit(event));
    else emitter[op](event, id);
  }
  return results;
}`,
    explanation:
      "Iterating over a copy makes emit safe against listeners that add or remove others mid-flight, and removing a `once` entry by identity keeps duplicates from interfering. `emit` is O(listeners); `off` is O(listeners) too. Follow-up: how does Node's `EventEmitter` handle an `'error'` event with no listener, and what memory leak does the max-listeners warning guard against?",
  },
  {
    id: "javascript-cc-12",
    domain: "d3",
    lesson: "d3-async",
    level: "staff",
    title: "Sliding-window rate limiter",
    idea: "evict old timestamps",
    prompt:
      "Implement a sliding-window rate limiter over a list of request times: `rateLimit(limit, windowMs, times)` returns a boolean per request. A request at time `t` is allowed when fewer than `limit` allowed requests happened in the window `(t - windowMs, t]`; rejected requests don't count against the limit. Times are non-decreasing. `rateLimit(2, 10, [0, 1, 2, 10])` is `[true, true, false, true]`.",
    fn: "rateLimit",
    starter: `function rateLimit(limit, windowMs, times) {
  // TODO: remember the times of requests you allowed
  return [];
}`,
    tests: [
      { name: "window slides", args: [2, 10, [0, 1, 2, 10, 11, 12]], expected: [true, true, false, true, true, false] },
      { name: "limit 1", args: [1, 5, [0, 1, 5, 6, 10]], expected: [true, false, true, false, true] },
      { name: "no requests", args: [3, 100, []], expected: [] },
      { name: "same millisecond burst", args: [3, 100, [5, 5, 5, 5]], expected: [true, true, true, false] },
      { name: "limit 0 blocks everything", args: [0, 10, [1]], expected: [false] },
      { name: "steady stream", hidden: true, args: [3, 10, [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20]], expected: [true, true, true, false, false, true, true, true, false, false, true] },
      { name: "wide window with a late wave", hidden: true, args: [2, 1000, [0, 1, 2, 3, 999, 1000, 1001, 1002]], expected: [true, true, false, false, false, true, true, false] },
    ],
    hints: [
      "Keep a list of the times of requests you allowed. For each new request, first drop times that fell out of the window.",
      "A time `s` is out of the window when `s <= t - windowMs` (the window is open on the left).",
      "If the remaining list is shorter than `limit`, push `t` and answer `true`; otherwise answer `false` and push nothing. Use an index pointer instead of `shift()` to stay O(1).",
    ],
    solution: `function rateLimit(limit, windowMs, times) {
  const allowedTimes = [];
  let head = 0;
  return times.map((t) => {
    while (head < allowedTimes.length && allowedTimes[head] <= t - windowMs) head++;
    if (allowedTimes.length - head < limit) {
      allowedTimes.push(t);
      return true;
    }
    return false;
  });
}`,
    explanation:
      "A sliding-window log is exact and uses O(limit) memory per client; each timestamp is pushed and evicted once, so the total is O(n). Follow-up: compare it to a fixed window (cheap but lets a 2x burst through at the boundary), a token bucket (smooth refill), and how you'd share the counter across servers (Redis with a sorted set or a Lua script).",
  },
  {
    id: "javascript-cc-13",
    domain: "d4",
    lesson: "d4-modules",
    level: "staff",
    title: "Dependency resolver",
    idea: "DFS post-order + cycle check",
    prompt:
      "Write `resolveOrder(graph, target)`. `graph` maps a package name to the array of packages it depends on (a dependency missing from the keys has no dependencies). Return the install order for `target`: every dependency before the packages that need it, each package once, visiting dependencies in the listed order. If a cycle is reachable from `target`, return `null`. `resolveOrder({ a: [\"b\", \"c\"], b: [\"c\"], c: [] }, \"a\")` is `[\"c\", \"b\", \"a\"]`.",
    fn: "resolveOrder",
    starter: `function resolveOrder(graph, target) {
  // TODO: depth-first search; push a package after all of its dependencies
  return [];
}`,
    tests: [
      { name: "shared dependency installed once", args: [{ a: ["b", "c"], b: ["c"], c: [] }, "a"], expected: ["c", "b", "a"] },
      { name: "no dependencies", args: [{ a: [] }, "a"], expected: ["a"] },
      { name: "two-package cycle", args: [{ a: ["b"], b: ["a"] }, "a"], expected: null },
      { name: "diamond", args: [{ a: ["b", "c"], b: ["d"], c: ["d"], d: [] }, "a"], expected: ["d", "b", "c", "a"] },
      { name: "target not in the graph", args: [{}, "x"], expected: ["x"] },
      { name: "unreachable cycle is ignored", hidden: true, args: [{ a: ["b"], b: [], x: ["y"], y: ["x"] }, "a"], expected: ["b", "a"] },
      { name: "undeclared dependency is a leaf", hidden: true, args: [{ a: ["zlib"] }, "a"], expected: ["zlib", "a"] },
      { name: "self dependency", hidden: true, args: [{ a: ["a"] }, "a"], expected: null },
      { name: "long chain with a late cycle", hidden: true, args: [{ a: ["b"], b: ["c"], c: ["d"], d: ["b"] }, "a"], expected: null },
    ],
    hints: [
      "Do a depth-first search from `target`. A package is added to the result only after all its dependencies are.",
      "Track two sets: `done` (already placed) and `visiting` (on the current path). Meeting a `visiting` package again means a cycle.",
      "Write a recursive `visit(name)`: skip if done, fail if visiting, mark visiting, visit each dependency from `graph[name] || []`, then mark done and push. Return `null` if any call reports a cycle.",
    ],
    solution: `function resolveOrder(graph, target) {
  const order = [];
  const done = new Set();
  const visiting = new Set();
  function visit(name) {
    if (done.has(name)) return true;
    if (visiting.has(name)) return false;
    visiting.add(name);
    for (const dep of graph[name] || []) {
      if (!visit(dep)) return false;
    }
    visiting.delete(name);
    done.add(name);
    order.push(name);
    return true;
  }
  return visit(target) ? order : null;
}`,
    explanation:
      "DFS post-order puts every dependency before its dependents, and the `visiting` set (the current recursion path) is what distinguishes a cycle from a harmless shared dependency. It is O(V + E). Follow-up: how would you report the cycle path in the error, handle version conflicts, or make it iterative to avoid stack overflow on very deep graphs?",
  },
];
