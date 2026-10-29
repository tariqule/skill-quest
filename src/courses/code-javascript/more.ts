import type { Question } from "@/engine/types";

/** Extra fill-in-the-blank and type-the-output questions for the JavaScript track. */
export const moreQuestions: Question[] = [
  // ───────────── fill ─────────────
  {
    id: "javascript-fx-01",
    type: "fill",
    domain: "d1",
    lesson: "d1-equality",
    level: "junior",
    prompt: "Fill the gap so `isNil` returns `true` for `null` and `undefined`, and for nothing else.",
    code: `function isNil(v) {
  return v {{1}} null;
}
console.log(isNil(undefined), isNil(0), isNil(""));
// true false false`,
    codeLang: "js",
    blanks: [{ options: ["==", "===", "!=", ">="], answer: 0 }],
    explanation: "Loose equality has one famous useful case: `v == null` is true for exactly `null` and `undefined`, and false for `0`, `\"\"`, and `false`. `===` would miss `undefined`, and `!=` flips the answer.",
  },
  {
    id: "javascript-fx-02",
    type: "fill",
    domain: "d2",
    lesson: "d2-bind",
    level: "intermediate",
    prompt: "Fill the gap so the detached method keeps its `this` and the log prints `2`.",
    code: `const counter = { n: 0, inc() { this.n++; } };
const run = counter.inc.{{1}}(counter);
run();
run();
console.log(counter.n);`,
    codeLang: "js",
    blanks: [{ options: ["bind", "call", "apply", "with"], answer: 0 }],
    explanation: "`bind` returns a new function with `this` fixed. `call` and `apply` invoke the method immediately and return `undefined`, so `run()` would throw a TypeError.",
  },
  {
    id: "javascript-fx-03",
    type: "fill",
    domain: "d3",
    lesson: "d3-promises",
    level: "senior",
    prompt: "Fill the gaps so every task runs to the end, even failing ones, and `ok` holds only the successful results.",
    code: `const results = await Promise.{{1}}(tasks.map((t) => t()));
const ok = results
  .filter((r) => r.status === {{2}})
  .map((r) => r.value);`,
    codeLang: "js",
    blanks: [
      { options: ["all", "allSettled", "race", "any"], answer: 1 },
      { options: ['"fulfilled"', '"resolved"', '"success"', '"ok"'], answer: 0 },
    ],
    explanation: "`Promise.allSettled` never rejects; it reports `{ status: \"fulfilled\", value }` or `{ status: \"rejected\", reason }` for each input. `all` would reject on the first failure, and `\"resolved\"` is not a status value.",
  },
  {
    id: "javascript-fx-04",
    type: "fill",
    domain: "d3",
    lesson: "d3-async",
    level: "staff",
    prompt: "Fill the gaps so at most `limit` tasks run at once, and every task still runs exactly once.",
    code: `async function pool(tasks, limit) {
  const results = [];
  let next = 0;
  async function worker() {
    while (next < tasks.length) {
      const i = {{1}};
      results[i] = await tasks[i]();
    }
  }
  await Promise.all(Array.from({ length: limit }, {{2}}));
  return results;
}`,
    codeLang: "js",
    blanks: [
      { options: ["next++", "++next", "next", "next--"], answer: 0 },
      { options: ["worker", "worker()", "() => worker", "await worker"], answer: 0 },
    ],
    explanation: "Each worker claims the next index with `next++` before its first `await`, so no two workers take the same task. `Array.from` needs a mapping function, so pass `worker` itself (it ignores its arguments); `worker()` would hand it a promise instead.",
  },
  {
    id: "javascript-fx-05",
    type: "fill",
    domain: "d4",
    lesson: "d4-destructure",
    level: "junior",
    prompt: "Fill the gap so `rest` collects every property except `name`.",
    code: `const { name, {{1}} } = { name: "Ada", age: 36, role: "dev" };
console.log(rest);
// { age: 36, role: 'dev' }`,
    codeLang: "js",
    blanks: [{ options: ["...rest", "rest...", "*rest", "[...rest]"], answer: 0 }],
    explanation: "A rest element in an object pattern, written `...rest`, gathers the remaining own enumerable properties into a new object. It must come last.",
  },
  {
    id: "javascript-fx-06",
    type: "fill",
    domain: "d4",
    lesson: "d4-arrays",
    level: "intermediate",
    prompt: "Fill the gap so the function returns each value only once, in the order first seen.",
    code: `function unique(arr) {
  return [...new {{1}}(arr)];
}
console.log(unique([3, 1, 3, 2, 1]));
// [ 3, 1, 2 ]`,
    codeLang: "js",
    blanks: [{ options: ["Set", "Map", "WeakSet", "Array"], answer: 0 }],
    explanation: "A `Set` stores each value once and iterates in insertion order, so spreading it gives the de-duplicated array in first-seen order. `WeakSet` isn't iterable and only holds objects.",
  },
  {
    id: "javascript-fx-07",
    type: "fill",
    domain: "d1",
    lesson: "d1-closures",
    level: "intermediate",
    prompt: "Fill the gaps so `fn` runs only on the first call, and every call returns the first result.",
    code: `function once(fn) {
  let done = false, value;
  return (...args) => {
    if (!done) {
      value = fn(...args);
      done = {{1}};
    }
    return {{2}};
  };
}`,
    codeLang: "js",
    blanks: [
      { options: ["true", "false", "!done", "args"], answer: 0 },
      { options: ["value", "fn", "done", "args"], answer: 0 },
    ],
    explanation: "`done` and `value` live in the closure, so they survive between calls. Set `done` to `true` after the first run and always return the cached `value`.",
  },
  {
    id: "javascript-fx-08",
    type: "fill",
    domain: "d2",
    lesson: "d2-proto",
    level: "senior",
    prompt: "Fill the gaps so `Dog` inherits from `Animal` and `new Dog(\"Rex\").speak()` works.",
    code: `function Animal(name) { this.name = name; }
Animal.prototype.speak = function () { return this.name + " speaks"; };

function Dog(name) { {{1}}; }
Dog.prototype = Object.{{2}}(Animal.prototype);
console.log(new Dog("Rex").speak());`,
    codeLang: "js",
    blanks: [
      { options: ["Animal.call(this, name)", "Animal(name)", "new Animal(name)", "super(name)"], answer: 0 },
      { options: ["create", "assign", "freeze", "keys"], answer: 0 },
    ],
    explanation: "The constructor chain needs `Animal.call(this, name)` so `this.name` is set on the new `Dog`. `Object.create(Animal.prototype)` makes an empty object whose prototype is `Animal.prototype`, wiring up inherited methods like `speak`.",
  },
  {
    id: "javascript-fx-09",
    type: "fill",
    domain: "d2",
    lesson: "d2-refs",
    level: "staff",
    prompt: "Fill the gaps so `deepFreeze` freezes the object and everything nested inside it.",
    code: `function deepFreeze(obj) {
  Object.{{1}}(obj).forEach((k) => {
    if (typeof obj[k] === "object" && obj[k] !== null) {{2}}(obj[k]);
  });
  return Object.{{3}}(obj);
}`,
    codeLang: "js",
    blanks: [
      { options: ["keys", "entries", "freeze", "assign"], answer: 0 },
      { options: ["deepFreeze", "Object.freeze", "structuredClone", "JSON.parse"], answer: 0 },
      { options: ["freeze", "seal", "preventExtensions", "create"], answer: 0 },
    ],
    explanation: "`Object.freeze` is shallow, so you recurse into each object-valued property with `deepFreeze` itself (calling `Object.freeze` there would only repeat the shallow freeze). Finish by freezing the object you were given and returning it.",
  },

  // ───────────── output ─────────────
  {
    id: "javascript-ox-01",
    type: "output",
    domain: "d1",
    lesson: "d1-types",
    level: "junior",
    prompt: "Type what this prints (the two booleans, separated by a space).",
    code: `console.log(0.1 + 0.2 === 0.3, 0.5 + 0.25 === 0.75);`,
    codeLang: "js",
    answers: ["false true"],
    explanation: "`0.1` and `0.2` aren't exactly representable in binary, so their sum is `0.30000000000000004`. `0.5` and `0.25` are exact powers of two, so that sum is exactly `0.75`.",
  },
  {
    id: "javascript-ox-02",
    type: "output",
    domain: "d1",
    lesson: "d1-hoisting",
    level: "intermediate",
    prompt: "Type what this prints (two words, separated by a space).",
    code: `console.log(typeof f, typeof g);
function f() {}
var g = function () {};`,
    codeLang: "js",
    answers: ["function undefined"],
    explanation: "Function declarations are hoisted with their body, so `f` is already a function. `var g` is hoisted but only as `undefined`; the assignment happens later.",
  },
  {
    id: "javascript-ox-03",
    type: "output",
    domain: "d1",
    lesson: "d1-closures",
    level: "intermediate",
    prompt: "Type the one line this logs.",
    code: `const fns = [];
for (var i = 0; i < 3; i++) fns.push(() => i * 2);
console.log(fns.map((f) => f()).join(","));`,
    codeLang: "js",
    answers: ["6,6,6"],
    explanation: "`var` gives the whole loop a single `i`. By the time the arrow functions run, the loop has finished with `i === 3`, so each returns `6`. With `let`, each iteration would get its own binding: `0,2,4`.",
  },
  {
    id: "javascript-ox-04",
    type: "output",
    domain: "d1",
    lesson: "d1-hoisting",
    level: "senior",
    prompt: "Type the one name this logs.",
    code: `let x = 1;
{
  try {
    console.log(x);
  } catch (e) {
    console.log(e.name);
  }
  let x = 2;
}`,
    codeLang: "js",
    answers: ["ReferenceError"],
    explanation: "The inner `let x` is hoisted to the top of its block but stays in the temporal dead zone until its declaration runs. So `x` inside the block refers to the inner binding and throws, rather than reading the outer `1`.",
  },
  {
    id: "javascript-ox-05",
    type: "output",
    domain: "d2",
    lesson: "d2-refs",
    level: "junior",
    prompt: "Type what this prints (a number and a boolean, separated by a space).",
    code: `const a = [1, 2];
const b = a;
b.push(3);
console.log(a.length, a === b);`,
    codeLang: "js",
    answers: ["3 true"],
    explanation: "Arrays are objects, so `b = a` copies the reference, not the array. Pushing through `b` changes the one shared array, and `a === b` is true.",
  },
  {
    id: "javascript-ox-06",
    type: "output",
    domain: "d2",
    lesson: "d2-this",
    level: "senior",
    prompt: "Type the logged lines, one per line.",
    code: `class Counter {
  n = 0;
  inc() { this.n++; return this.n; }
}
const c = new Counter();
const { inc } = c;
try { inc(); } catch (e) { console.log(e.constructor.name); }
console.log(c.inc(), c.inc());`,
    codeLang: "js",
    answers: ["TypeError\n1 2"],
    explanation: "Pulling `inc` off the instance loses the call-site receiver. Class bodies are strict, so `this` is `undefined` and `this.n++` throws a TypeError. The failed call changed nothing, so the two real calls give `1 2`.",
  },
  {
    id: "javascript-ox-07",
    type: "output",
    domain: "d2",
    lesson: "d2-proto",
    level: "staff",
    prompt: "Type what this prints (a value, a boolean, a boolean, a value, separated by spaces).",
    code: `const base = {
  get v() { return this._v ?? "none"; },
  set v(x) { this._v = x; },
};
const a = Object.create(base);
a.v = 5;
console.log(a.v, Object.hasOwn(a, "v"), Object.hasOwn(a, "_v"), base.v);`,
    codeLang: "js",
    answers: ["5 false true none"],
    explanation: "Assigning `a.v = 5` finds the inherited setter, which runs with `this === a`, so `_v` is created on `a` itself and no own `v` is made. The getter on `base` still sees its own `_v` as unset, so `base.v` is `\"none\"`.",
  },
  {
    id: "javascript-ox-08",
    type: "output",
    domain: "d3",
    lesson: "d3-loop",
    level: "senior",
    prompt: "Type the one string this logs (letters only, no spaces).",
    code: `const log = [];
log.push("A");
setTimeout(() => { log.push("B"); console.log(log.join("")); }, 0);
Promise.resolve().then(() => log.push("C"));
(async () => { log.push("D"); await null; log.push("E"); })();
log.push("F");`,
    codeLang: "js",
    answers: ["ADFCEB"],
    explanation: "Synchronous code runs first: `A`, `D` (the async function runs until its first `await`), then `F`. Then the microtask queue drains in order: `C`, then `E`. The timer callback is a macrotask, so `B` comes last.",
  },
  {
    id: "javascript-ox-09",
    type: "output",
    domain: "d3",
    lesson: "d3-promises",
    level: "staff",
    prompt: "Type the one number string this logs.",
    code: `const log = [];
const p = Promise.resolve();
p.then(() => log.push(1)).then(() => log.push(3));
p.then(() => log.push(2)).then(() => log.push(4));
setTimeout(() => console.log(log.join("")), 0);`,
    codeLang: "js",
    answers: ["1234"],
    explanation: "Both first `.then` callbacks are queued right away, so `1` and `2` run in registration order. Each one then queues its follow-up, and those run in the same order: `3` after `1`, `4` after `2`. The two chains interleave level by level.",
  },
  {
    id: "javascript-ox-10",
    type: "output",
    domain: "d3",
    lesson: "d3-errors",
    level: "intermediate",
    prompt: "Type the logged lines, one per line.",
    code: `Promise.reject(new Error("a"))
  .catch((e) => e.message)
  .then((m) => { throw new Error(m + "b"); })
  .catch((e) => console.log(e.message))
  .finally(() => console.log("done"));`,
    codeLang: "js",
    answers: ["ab\ndone"],
    explanation: "The first `.catch` handles the rejection and returns `\"a\"`, so the chain is fulfilled again. The next `.then` throws `\"ab\"`, the second `.catch` logs it, and `.finally` runs last regardless.",
  },
  {
    id: "javascript-ox-11",
    type: "output",
    domain: "d4",
    lesson: "d4-arrays",
    level: "junior",
    prompt: "Type the one line this logs.",
    code: `console.log([10, 9, 1].sort().join(","));`,
    codeLang: "js",
    answers: ["1,10,9"],
    explanation: "Without a comparator, `sort` converts items to strings and compares them in UTF-16 order, so `\"1\" < \"10\" < \"9\"`. Use `sort((a, b) => a - b)` for numbers.",
  },
  {
    id: "javascript-ox-12",
    type: "output",
    domain: "d4",
    lesson: "d4-destructure",
    level: "intermediate",
    prompt: "Type what this prints (two values, separated by a space).",
    code: `const { a = 1, b = 2 } = { a: undefined, b: null };
console.log(a, b);`,
    codeLang: "js",
    answers: ["1 null"],
    explanation: "Destructuring defaults apply only when the value is `undefined`. `a` is `undefined`, so it gets `1`; `b` is `null`, which is a real value, so the default `2` is ignored.",
  },
  {
    id: "javascript-ox-13",
    type: "output",
    domain: "d4",
    lesson: "d4-traps",
    level: "senior",
    prompt: "Type what this prints (three values, separated by spaces).",
    code: `console.log([1, 2, 3].includes(NaN), [NaN].includes(NaN), [NaN].indexOf(NaN));`,
    codeLang: "js",
    answers: ["false true -1"],
    explanation: "`includes` uses the SameValueZero comparison, which treats `NaN` as equal to itself. `indexOf` uses strict equality, and `NaN === NaN` is false, so it returns `-1`.",
  },
];
