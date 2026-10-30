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
      "Write `fizzBuzz(n)`. It returns an array of strings, one for each number from 1 to `n`. Use `\"Fizz\"` for multiples of 3, `\"Buzz\"` for multiples of 5, and `\"FizzBuzz\"` for multiples of both. Any other number becomes its own string. For example, `fizzBuzz(5)` is `[\"1\", \"2\", \"Fizz\", \"4\", \"Buzz\"]`. When `n` is 0, return an empty array.",
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
      "Loop from 1 to n and push one string for each number.",
      "Check the multiple-of-both case first. Otherwise `\"Fizz\"` would win for 15.",
      "`i % 15 === 0` tests for both at once. Use `String(i)` for every other number.",
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
      "One pass through the numbers, checking the most specific case first so that 15 doesn't land in the Fizz branch. It takes O(n) time and builds O(n) output. A good follow-up: how would you make the rules configurable, say with a list of `[divisor, word]` pairs, joining the words that match?",
  },
  {
    id: "javascript-cc-02",
    domain: "d1",
    lesson: "d1-types",
    level: "junior",
    title: "A better typeof",
    idea: "typeof traps",
    prompt:
      "Write `typeName(v)`. It works like `typeof`, but gives an honest answer for the awkward cases: `\"null\"` for `null`, `\"array\"` for arrays, and `\"nan\"` for `NaN`. Everything else gets the same answer `typeof` gives, so `typeName(42)` is `\"number\"` and `typeName({})` is `\"object\"`.",
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
      "`typeof null` and `typeof []` both give `\"object\"`, so check for those first.",
      "`Array.isArray` spots arrays. `NaN` is the only value that isn't equal to itself, and `Number.isNaN` checks for it safely.",
      "Check in this order: `v === null`, `Array.isArray(v)`, `Number.isNaN(v)`, then `typeof v`.",
    ],
    solution: `function typeName(v) {
  if (v === null) return "null";
  if (Array.isArray(v)) return "array";
  if (Number.isNaN(v)) return "nan";
  return typeof v;
}`,
    explanation:
      "Unlike the older global `isNaN`, `Number.isNaN` doesn't convert its argument first, so `typeName(\"abc\")` stays `\"string\"`. Each check takes constant time. A good follow-up: how do you tell a `Date` or a `Map` from a plain object? `Object.prototype.toString.call(v)` gives `[object Date]`.",
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
      "Write `groupBy(items, key)`. It takes an array of objects and a property name. It returns an object where each value of that property, as a string, points to an array of the items that have it, kept in their original order. For example, `groupBy([{t:\"a\",n:1},{t:\"b\",n:2},{t:\"a\",n:3}], \"t\")` gives `{ a: [{t:\"a\",n:1},{t:\"a\",n:3}], b: [{t:\"b\",n:2}] }`. An empty array gives `{}`.",
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
      "Go through the array once, keeping an object of arrays.",
      "For each item, work out the group name with `String(item[key])`, create that group's array if it doesn't exist yet, then push the item.",
      "`(groups[name] ??= []).push(item)` creates or reuses the array in one line.",
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
      "One pass builds all the groups, so it takes O(n) time. `??=` creates each group's array only when it's first needed, and `String()` matches how object keys get converted anyway. A good follow-up: why might a `Map` be safer than a plain object here, for a key like `\"__proto__\"`, and how does the built-in `Object.groupBy` handle it?",
  },
  {
    id: "javascript-cc-04",
    domain: "d4",
    lesson: "d4-arrays",
    level: "intermediate",
    title: "Flatten to a depth",
    idea: "recursion with a depth budget",
    prompt:
      "Write `flatten(arr, depth = 1)` without using `Array.prototype.flat`. It returns a new array where nested arrays are opened up, as many levels deep as `depth`. So `flatten([1, [2, [3]]])` is `[1, 2, [3]]`, and `flatten([1, [2, [3]]], 2)` is `[1, 2, 3]`. A depth of `Infinity` opens everything, and a depth of 0 just returns a shallow copy.",
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
      "Build a result array and loop over the input. If an item is an array and you still have depth left, open it up. Otherwise push it as it is.",
      "Use recursion: `flatten(item, depth - 1)` gives you the opened-up version of a nested array. Spread it into the result, or `push(...)` it.",
      "`Infinity - 1` is still `Infinity`, so the same code handles unlimited depth. `Array.isArray` tells arrays apart from strings.",
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
      "Each item is visited once, so the time grows with the total number of items, and the recursion only goes as deep as the nesting. Watch out: `out.push(...big)` can overflow the stack on huge arrays, and a loop or `concat` avoids that. A good follow-up: write a version that uses a loop and your own stack instead of recursion.",
  },
  {
    id: "javascript-cc-05",
    domain: "d1",
    lesson: "d1-closures",
    level: "intermediate",
    title: "Counter with private state",
    idea: "closure over a variable",
    prompt:
      "Write `runCounter(start, ops)`. Inside it, build a counter using a closure. `\"inc\"` adds 1. `\"dec\"` takes away 1 but never goes below 0. `\"reset\"` goes back to `start`. `\"get\"` records the current value. Return the array of recorded values. For example, `runCounter(0, [\"inc\", \"inc\", \"get\"])` is `[2]`.",
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
      "Create a `count` variable, plus a small object or a few functions that read and change it.",
      "The operations are closures over `count`. They share one variable instead of passing it around.",
      "Write `inc`, `dec` (using `Math.max(0, count - 1)`), `reset` and `get`. Loop over `ops` and call the matching function.",
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
      "`count` can only be reached through the four functions that close over it. That's the module pattern: private state without needing a class. Each operation takes constant time. A good follow-up: what happens when you make two counters from the same factory, and how do `#private` class fields compare?",
  },
  {
    id: "javascript-cc-06",
    domain: "d3",
    lesson: "d3-errors",
    level: "intermediate",
    title: "Retry a flaky task",
    idea: "async loop + try/catch",
    prompt:
      "Finish the async function `runWithRetry(failures, maxAttempts)`. The `task` inside it fails for its first `failures` calls, then succeeds. Call it up to `maxAttempts` times and stop at the first success. On success, resolve `{ ok: true, value, attempts }`. If every attempt fails, resolve `{ ok: false, error, attempts }`, where `error` is the last error's `message`. If `maxAttempts` is less than 1, resolve `{ ok: false, error: \"no attempts\", attempts: 0 }`.",
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
      "Use a `for` loop from attempt 1 to `maxAttempts`, and `await task()` inside a `try`.",
      "On success, return straight away. On failure, remember the error and let the loop carry on.",
      "After the loop, return the failure object with the last error's `message`. Handle `maxAttempts < 1` before the loop starts.",
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
      "Using `await` inside a `for` loop keeps the attempts one after another, and wrapping the `await` in `try`/`catch` turns a rejection into ordinary control flow. It makes at most `maxAttempts` calls. A good follow-up: add exponential backoff with some randomness, retry only errors that are worth retrying, and respect an `AbortSignal`.",
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
      "A debounced function waits until calls stop coming, then fires once, `wait` ms after the last call. Simulate it. `simulateDebounce(wait, calls)` takes `calls` as `[time, value]` pairs, sorted by time. Return the `[fireTime, value]` pairs that actually fire, in order. A call that arrives before the waiting timer fires replaces it. A call at exactly the fire time comes after the timer has fired. For example, `simulateDebounce(100, [[0,\"a\"],[50,\"b\"],[200,\"c\"]])` is `[[150,\"b\"],[300,\"c\"]]`.",
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
      "Only one call can be waiting at a time. Keep `pending = { fireAt, value }`, or `null` when nothing is waiting.",
      "When a new call arrives at time `t`, check whether `pending.fireAt <= t`. If so, it already fired, so record it. Then replace `pending` with `{ fireAt: t + wait, value }`.",
      "After the last call, the one still waiting will fire too, so push it at the end.",
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
      "A real `debounce` keeps a timer id in a closure, and on every call it does `clearTimeout` and then `setTimeout`. Replacing `pending` is exactly that cancel-and-reschedule step. It's one pass, so O(n). A good follow-up: add a leading-edge option, a `cancel()` method and a `flush()` method.",
  },
  {
    id: "javascript-cc-08",
    domain: "d2",
    lesson: "d2-refs",
    level: "senior",
    title: "LRU cache",
    idea: "Map keeps insertion order",
    prompt:
      "Build an LRU cache, one that throws out the least recently used item when it gets full. Drive it with a list of operations: `runLRU(capacity, ops)`. Each op is `[\"put\", key, value]` or `[\"get\", key]`. `get` returns the value, or -1 if the key is missing, and counts as a use. `put` adds or updates a key and also counts as a use. When the cache holds more than `capacity` keys, remove the least recently used one. Return the results of the `get` ops, in order. Both operations should take constant time.",
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
      "A `Map` remembers the order keys were added. If you delete a key and set it again, it moves to the end. So the end holds the most recent key, and the start holds the least recent.",
      "On `get`: if the key exists, delete it and set it again to move it to the end, then return the value. Otherwise return -1.",
      "On `put`: delete the key if it's there, set it, and if `map.size > capacity`, delete `map.keys().next().value`. Use `map.has` rather than a truthy check, so values like 0 and `null` still work.",
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
      "A `Map` looks up keys in constant time and remembers the order they were added. Re-adding a key on every use keeps the oldest key at the front, ready to be removed. Every operation is constant time on average. A good follow-up: the textbook answer is a hash map plus a doubly linked list, so why would you still pick the `Map` trick in JavaScript, and what does it cost?",
  },
  {
    id: "javascript-cc-09",
    domain: "d3",
    lesson: "d3-promises",
    level: "senior",
    title: "Promise pool, simulated",
    idea: "limit concurrency, track a clock",
    prompt:
      "A promise pool starts tasks in order, but never runs more than `limit` of them at once. A new task starts the moment a slot frees up. Simulate this on a pretend clock. `simulatePool(durations, limit)` returns the time each task finishes, in the original order. Every task is ready at time 0, and `limit` is at least 1. For example, `simulatePool([3, 2, 1], 2)` is `[3, 2, 3]`.",
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
      "Think of the pool as `limit` slots, each with the time it next becomes free. They all start at 0.",
      "Take the tasks in order. Give each one the slot that frees up soonest: the task starts then and ends at `start + duration`.",
      "Keep `free = new Array(limit).fill(0)`. Find the index of the smallest value, add the duration to it, and record that new value.",
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
      "Each task goes to whichever slot frees up first, which is exactly how a real pool behaves, whether it's built on `await Promise.race` or on worker loops. Scanning the slots costs O(n × limit), and a min-heap would bring it down to O(n log limit). A good follow-up: how would you write the real async version, and what should happen to the other tasks when one rejects?",
  },
  {
    id: "javascript-cc-10",
    domain: "d4",
    lesson: "d4-modules",
    level: "senior",
    title: "Topological sort",
    idea: "Kahn's algorithm",
    prompt:
      "You have `n` nodes numbered from 0 to `n - 1`, and a list of `edges`, where `[a, b]` means `a` must come before `b`. Return a valid order. Whenever several nodes are free to go next, take the smallest number first, so there's only one right answer. If the graph has a cycle, return `[]`. For example, `topoSort(4, [[0,1],[0,2],[1,3],[2,3]])` is `[0, 1, 2, 3]`.",
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
      "Count how many edges point into each node, its **indegree**, and build a list of each node's neighbours.",
      "Keep taking a node whose indegree is 0, add it to the order, and lower the indegree of its neighbours by 1.",
      "Always pick the smallest available number, by sorting the queue or with a simple scan. If you placed fewer than `n` nodes, there's a cycle, so return `[]`.",
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
      "This is Kahn's algorithm. It keeps taking nodes that have no prerequisites left. Any node that never gets down to zero incoming edges is stuck on a cycle. With a heap for the smallest-first rule it's O((V + E) log V), and plain Kahn's is O(V + E). A good follow-up: how would a depth-first version spot the cycle using three colours, and where would you use this, such as build steps, course prerequisites or module loading?",
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
      "Build a small event emitter and drive it with a list of operations: `runEmitter(ops)`. `[\"on\", event, id]` adds a listener. `[\"once\", event, id]` adds one that's removed after it's called once. `[\"off\", event, id]` removes the first listener with that id for that event, and does nothing if there isn't one. `[\"emit\", event]` calls the event's listeners in the order they were added. Listeners are identified by `id`, and the same id can be added twice. Return one array per `emit`, listing the ids that were called, in order.",
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
      "Store the listeners for each event in a `Map`, from the event name to an array of `{ id, once }` entries.",
      "In `emit`, loop over a copy of the array. That way, removing a `once` listener mid-loop doesn't make you skip the one after it.",
      "For `once`, remove that exact entry after calling it, comparing by object identity rather than id, because ids can repeat. For `off`, find the first entry with the id and `splice` it out.",
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
      "Looping over a copy keeps `emit` safe when a listener adds or removes others while it runs. Removing a `once` entry by object identity, rather than by id, stops duplicate ids getting mixed up. Both `emit` and `off` take time in proportion to the number of listeners. A good follow-up: what does Node's `EventEmitter` do with an `\"error\"` event that has no listener, and what memory leak does the max-listeners warning protect you from?",
  },
  {
    id: "javascript-cc-12",
    domain: "d3",
    lesson: "d3-async",
    level: "staff",
    title: "Sliding-window rate limiter",
    idea: "evict old timestamps",
    prompt:
      "Build a sliding-window rate limiter over a list of request times. `rateLimit(limit, windowMs, times)` returns true or false for each request. A request at time `t` is allowed when fewer than `limit` allowed requests happened in the window `(t - windowMs, t]`. Rejected requests don't count towards the limit. The times never go backwards. For example, `rateLimit(2, 10, [0, 1, 2, 10])` is `[true, true, false, true]`.",
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
      "Keep a list of the times of requests you allowed. For each new request, first drop the times that have fallen out of the window.",
      "A time `s` is out of the window when `s <= t - windowMs`, because the window is open on the left.",
      "If fewer than `limit` times remain, push `t` and answer `true`. Otherwise answer `false` and push nothing. Move an index forward instead of calling `shift()`, so each step stays constant time.",
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
      "Keeping a log of allowed times is exact and uses memory in proportion to `limit` for each client. Each timestamp is added once and removed once, so the total work is O(n). A good follow-up: compare it with a fixed window, which is cheap but lets twice the limit through at the boundary, and a token bucket, which refills smoothly. Then say how you'd share the count across servers, for example with Redis.",
  },
  {
    id: "javascript-cc-13",
    domain: "d4",
    lesson: "d4-modules",
    level: "staff",
    title: "Dependency resolver",
    idea: "DFS post-order + cycle check",
    prompt:
      "Write `resolveOrder(graph, target)`. `graph` maps each package name to the array of packages it depends on. A dependency that isn't a key in `graph` has no dependencies of its own. Return the install order for `target`: every dependency comes before the packages that need it, each package appears once, and dependencies are visited in the order they're listed. If `target` can reach a cycle, return `null`. For example, `resolveOrder({ a: [\"b\", \"c\"], b: [\"c\"], c: [] }, \"a\")` is `[\"c\", \"b\", \"a\"]`.",
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
      "Do a depth-first search from `target`. Only add a package to the result once all its dependencies are in.",
      "Track two sets: `done`, for packages already placed, and `visiting`, for packages on the current path. Meeting a `visiting` package again means there's a cycle.",
      "Write a recursive `visit(name)`: skip it if it's done, fail if it's visiting, otherwise mark it visiting, visit each dependency in `graph[name] || []`, then mark it done and push it. Return `null` if any call finds a cycle.",
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
      "A depth-first search that adds each package after its dependencies puts every dependency first. The `visiting` set, which is the current path, is what tells a real cycle apart from a dependency that's just shared. It's O(V + E). A good follow-up: how would you show the cycle path in the error, handle version conflicts, or avoid stack overflow on very deep graphs?",
  },
];
