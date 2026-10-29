import { CodeBlock, CodeCompare, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";

/** Module 4: array methods, destructuring and spread, modules, and classic output traps. */
export default defineDomain({
  domain: {
    id: "d4",
    number: 4,
    name: "Modern Syntax & Traps",
    world: "The Syntax Bazaar",
    weight: 20,
    emoji: "🎪",
    color: "#f472b6",
    summary: "map/filter/reduce and friends, mutating vs copying methods, destructuring, spread and rest, ES modules, and the classic gotchas.",
  },

  tasks: [
    { id: "4.1", title: "Array methods", covers: ["map, filter, reduce, find, some, every, flatMap", "Mutating vs copying methods", "sort and its comparator", "Picking the right data structure"] },
    { id: "4.2", title: "Destructuring, spread, and modules", covers: ["Object and array destructuring, defaults, rest", "Spread for copies and merges", "ES module imports and exports, live bindings", "Dynamic import and tree shaking"] },
    { id: "4.3", title: "Classic output traps", covers: ["Floating-point arithmetic", "Automatic semicolon insertion", "Holes, length, and odd built-ins"] },
  ],

  lessons: [
    {
      id: "d4-arrays",
      level: "junior",
      check: ["d4-01", "d4-03"],
      task: "4.1",
      title: "map, filter, reduce, and the mutators",
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="js"
            code={`const orders = [{ total: 40, paid: true }, { total: 15, paid: false }, { total: 25, paid: true }];

orders.filter((o) => o.paid)          // keep matches     → 2 orders
      .map((o) => o.total)            // transform each   → [40, 25]
      .reduce((sum, t) => sum + t, 0); // fold to one value → 65`}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "✏️", title: "Mutate in place", text: "push, pop, shift, splice, sort, reverse, fill", color: "#f87171" },
              { icon: "🆕", title: "Return a new array", text: "map, filter, slice, concat, toSorted, toReversed, toSpliced, with", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "map keeps the length, filter keeps matching items, reduce folds everything into one value (always pass an initial value).",
        "find returns the first match or undefined; some / every return booleans and stop early.",
        "sort() without a comparator sorts as strings: [10, 1, 3].sort() is [1, 10, 3]. Use (a, b) => a - b.",
        "sort mutates; ES2023 toSorted returns a copy.",
      ],
      tip: "State complexity as you chain: each method is a full pass, so filter + map + reduce is O(n) total, but find inside a loop is O(n²).",
    },
    {
      id: "d4-destructure",
      level: "junior",
      check: ["d4-09", "d4-11"],
      task: "4.2",
      title: "Destructuring, defaults, spread, and rest",
      visual: (
        <CodeCompare
          lang="js"
          left={{ title: "Destructure + defaults + rest", code: `const { id, role = "guest", ...rest } = user;
const [first, , third] = list;   // skip with commas
function connect({ host, port = 5432 } = {}) {}` }}
          right={{ title: "Spread to copy and merge", code: `const copy = [...list];
const settings = { ...defaults, ...overrides }; // later wins
Math.max(...nums);` }}
        />
      ),
      points: [
        "Defaults apply only when the value is undefined, not null.",
        "Rest (...rest) collects what's left; spread (...x) expands. Same syntax, opposite directions.",
        "Spread copies are shallow, and later keys override earlier ones.",
        "Destructuring undefined or null throws a TypeError: give parameters a = {} default.",
      ],
      tip: "Use the swap trick [a, b] = [b, a] in live coding; interviewers notice idiomatic code.",
    },
    {
      id: "d4-modules",
      level: "senior",
      check: ["d4-14", "d4-16"],
      task: "4.2",
      title: "ES modules: static, strict, and live",
      visual: (
        <CodeCompare
          lang="js"
          left={{ title: "counter.js", code: `export let count = 0;
export function inc() { count++; }
export default function reset() { count = 0; }` }}
          right={{ title: "main.js", code: `import reset, { count, inc } from "./counter.js";
inc();
console.log(count);   // 1: a live view of the export
// count = 5;         // TypeError: imports are read-only
const { heavy } = await import("./heavy.js"); // lazy load` }}
        />
      ),
      points: [
        "Imports are live, read-only views of the exporting module's bindings.",
        "Import declarations are hoisted and static, so bundlers can tree-shake unused exports.",
        "Modules always run in strict mode, run once (then they're cached), and allow top-level await.",
        "import() loads a module on demand and returns a promise. Use it for code splitting.",
      ],
      tip: "Contrast with CommonJS: require is a synchronous function call that copies module.exports values when called.",
    },
    {
      id: "d4-traps",
      level: "intermediate",
      check: ["d4-18", "d4-20"],
      task: "4.3",
      title: "The classic gotchas",
      visual: (
        <CodeBlock
          lang="js"
          code={`0.1 + 0.2              // 0.30000000000000004 (binary floating point)
[1, 2, 3] + [4]        // "1,2,34"  arrays become strings
Math.max()             // -Infinity (identity for max)
["1", "2", "3"].map(parseInt) // [1, NaN, NaN]
return                 // ASI inserts ";" here…
  { ok: true };        // …so this object is never returned`}
        />
      ),
      points: [
        "Numbers are 64-bit floats. Compare with a tolerance or work in integers (cents).",
        "A line break after return, throw, break, or continue ends the statement (ASI).",
        "Callbacks receive more arguments than you think: map passes (value, index, array).",
        "Arrays can have holes; many methods (forEach, filter, map) skip them.",
      ],
      tip: "For each trap, explain the rule behind it. \"It's weird\" isn't an answer; \"map passes the index as parseInt's radix\" is.",
    },
  ],

  questions: [
    // ── Arrays ──
    {
      id: "d4-01", domain: "d4", lesson: "d4-arrays", level: "junior",
      prompt: "What does this print?",
      code: `const nums = [1, 2, 3, 4];
const out = nums
  .filter((n) => n % 2 === 0)
  .map((n) => n * 10)
  .reduce((a, b) => a + b, 0);
console.log(out);`, codeLang: "js",
      options: ["`60`", "`100`", "`[20, 40]`", "`40`"],
      answer: [0],
      explanation: "filter keeps 2 and 4, map gives 20 and 40, reduce sums them: 60.",
    },
    {
      id: "d4-02", domain: "d4", lesson: "d4-traps", level: "senior",
      prompt: "What does this print?",
      code: `console.log(["1", "2", "3"].map(parseInt));`, codeLang: "js",
      options: ["`[1, NaN, NaN]`", "`[1, 2, 3]`", "`[NaN, NaN, NaN]`", "`[1, 2, NaN]`"],
      answer: [0],
      explanation: "map calls parseInt(value, index). parseInt(\"1\", 0) treats radix 0 as 10 → 1; radix 1 is invalid → NaN; \"3\" isn't a digit in base 2 → NaN. Use `.map(Number)` or an arrow.",
    },
    {
      id: "d4-03", domain: "d4", lesson: "d4-arrays", level: "intermediate",
      prompt: "What does this print?",
      code: `console.log([10, 1, 3].sort());`, codeLang: "js",
      options: ["`[1, 10, 3]`", "`[1, 3, 10]`", "`[10, 3, 1]`", "`[3, 10, 1]`"],
      answer: [0],
      explanation: "Without a comparator, sort converts elements to strings and compares them: \"1\" < \"10\" < \"3\". Use `sort((a, b) => a - b)` for numbers.",
    },
    {
      id: "d4-04", domain: "d4", lesson: "d4-arrays", level: "intermediate",
      prompt: "What does this print?",
      code: `const nums = [3, 1, 2];
const sorted = nums.sort();
console.log(nums, sorted === nums);`, codeLang: "js",
      options: ["`[1, 2, 3] true`", "`[3, 1, 2] false`", "`[1, 2, 3] false`", "`[3, 1, 2] true`"],
      answer: [0],
      explanation: "sort mutates the array in place and returns the same array. To keep the original, use `nums.toSorted()` or `[...nums].sort()`.",
    },
    {
      id: "d4-05", domain: "d4", lesson: "d4-arrays", level: "junior", type: "match",
      prompt: "Match each array method with what it returns.",
      pairs: [
        ["`map`", "A new array of the same length, each item transformed"],
        ["`filter`", "A new array of the items that pass a test"],
        ["`find`", "The first matching item, or `undefined`"],
        ["`some`", "`true` if at least one item passes"],
        ["`reduce`", "A single accumulated value"],
      ],
      explanation: "Choosing the right method communicates intent: find when you want one item, some/every for yes/no, reduce for totals and grouping.",
    },
    {
      id: "d4-06", domain: "d4", lesson: "d4-arrays", level: "junior",
      prompt: "Which methods change the original array? (Choose three.)",
      options: ["`push`", "`splice`", "`sort`", "`map`", "`slice`", "`toSorted`"],
      answer: [0, 1, 2],
      explanation: "push, splice, and sort mutate in place. map, slice, and toSorted return new arrays and leave the original alone.",
    },
    {
      id: "d4-07", domain: "d4", lesson: "d4-arrays", level: "intermediate", type: "order",
      prompt: "Arrange the lines so the code keeps numbers greater than 2, squares them, and sums the squares.",
      items: ["`const total = nums`", "`  .filter((n) => n > 2)`", "`  .map((n) => n * n)`", "`  .reduce((sum, n) => sum + n, 0);`"],
      explanation: "Filter on the original numbers first, then square, then reduce to one number. reduce has to be last because it returns a number, not an array.",
    },
    {
      id: "d4-08", domain: "d4", lesson: "d4-arrays", level: "senior",
      prompt: "What happens when this runs?",
      code: `const total = [].reduce((a, b) => a + b);
console.log(total);`, codeLang: "js",
      options: ["A `TypeError`: reduce of empty array with no initial value", "It prints `0`", "It prints `undefined`", "It prints `NaN`"],
      answer: [0],
      explanation: "Without an initial value, reduce uses the first element as the accumulator. An empty array has none, so it throws. Always pass an initial value: `reduce((a, b) => a + b, 0)`.",
    },
    {
      id: "d4-25", domain: "d4", lesson: "d4-arrays", level: "senior",
      prompt: "A hot path runs `users.find((u) => u.id === order.userId)` for each of 50,000 orders against 50,000 users. What's the best fix?",
      options: [
        "Build a `Map` from id to user once, then look each order up in O(1): O(n + m) instead of O(n × m)",
        "Replace `find` with `filter(...)[0]`",
        "Sort users by id and keep calling `find`",
        "Use a `for` loop instead of `find`",
      ],
      answer: [0],
      explanation: "find is a linear scan, so the nested lookup is 2.5 billion comparisons in the worst case. One pass to build a Map makes each lookup constant time on average. Loop style doesn't change the complexity.",
    },
    // ── Destructuring and spread ──
    {
      id: "d4-09", domain: "d4", lesson: "d4-destructure", level: "junior",
      prompt: "What does this print?",
      code: `const { a = 1, b = 2 } = { a: undefined, b: null };
console.log(a, b);`, codeLang: "js",
      options: ["`1 null`", "`1 2`", "`undefined null`", "`undefined 2`"],
      answer: [0],
      explanation: "Defaults only kick in for undefined. `a` is undefined, so it gets 1. `b` is null, which is a real value, so it stays null.",
    },
    {
      id: "d4-10", domain: "d4", lesson: "d4-destructure", level: "junior",
      prompt: "What does this print?",
      code: `let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y);`, codeLang: "js",
      options: ["`2 1`", "`1 2`", "`2 2`", "A `SyntaxError`"],
      answer: [0],
      explanation: "The right side builds the array [2, 1] first, then array destructuring assigns x = 2 and y = 1. No temporary variable needed.",
    },
    {
      id: "d4-11", domain: "d4", lesson: "d4-destructure", level: "junior",
      prompt: "What does this print?",
      code: `const { id, ...rest } = { id: 7, name: "Ada", role: "dev" };
console.log(rest);`, codeLang: "js",
      options: ["`{ name: \"Ada\", role: \"dev\" }`", "`{ id: 7, name: \"Ada\", role: \"dev\" }`", "`[\"Ada\", \"dev\"]`", "`7`"],
      answer: [0],
      explanation: "The rest element collects every remaining own property into a new object. It's a handy way to drop a key without mutating.",
    },
    {
      id: "d4-12", domain: "d4", lesson: "d4-destructure", level: "intermediate",
      prompt: "What does this print?",
      code: `const defaults = { theme: "light", size: 12 };
const user = { size: 16 };
console.log({ ...defaults, ...user }, { ...user, ...defaults });`, codeLang: "js",
      options: [
        "`{ theme: \"light\", size: 16 }` and `{ size: 12, theme: \"light\" }`",
        "`{ theme: \"light\", size: 12 }` and `{ size: 16, theme: \"light\" }`",
        "`{ theme: \"light\", size: 16 }` both times",
        "`{ theme: \"light\", size: [12, 16] }` both times",
      ],
      answer: [0],
      explanation: "When keys collide, the later spread wins. Put defaults first and overrides last. Key order follows first insertion, which is why size comes first in the second object.",
    },
    {
      id: "d4-13", domain: "d4", lesson: "d4-destructure", level: "intermediate", type: "lines",
      prompt: "Which line throws a `TypeError`?",
      code: `function connect({ host, port }) {
  return host + ":" + port;
}
connect({ host: "db" });
connect();`, codeLang: "js",
      answer: [5],
      explanation: "Line 4 works (port is undefined). Line 5 passes undefined, and you can't destructure undefined. Fix: `function connect({ host, port } = {})`.",
    },
    {
      id: "d4-27", domain: "d4", lesson: "d4-destructure", level: "staff",
      prompt: "A front end does `const { user: { address: { city } } } = res` and crashes in production because the API omits `address` for some users. Several teams consume this API. What's the most robust fix?",
      options: [
        "Validate responses at the boundary against a schema the teams share, and model optional fields explicitly (defaults or optional chaining where they're truly optional)",
        "Wrap every component in try/catch",
        "Ask the backend to always send empty objects and keep the destructuring",
        "Replace destructuring with `res.user.address.city`",
      ],
      answer: [0],
      explanation: "The real issue is an undocumented optional field. A shared schema makes the contract explicit, fails loudly at one place, and tells every consumer which fields can be missing. The other options just move or hide the crash.",
    },
    // ── Modules ──
    {
      id: "d4-14", domain: "d4", lesson: "d4-modules", level: "senior",
      prompt: "What does main.js print?",
      code: `// counter.js
export let count = 0;
export function inc() { count++; }

// main.js
import { count, inc } from "./counter.js";
inc();
console.log(count);`, codeLang: "js",
      options: ["`1`", "`0`", "`undefined`", "A `TypeError`"],
      answer: [0],
      explanation: "ES module imports are live bindings: `count` in main.js is a view of the variable in counter.js, so it sees the increment. CommonJS destructuring would have copied 0.",
    },
    {
      id: "d4-15", domain: "d4", lesson: "d4-modules", level: "intermediate", type: "lines",
      prompt: "Which line throws?",
      code: `import { count, inc } from "./counter.js";
inc();
count = 5;
console.log(count);`, codeLang: "js",
      answer: [3],
      explanation: "Imported bindings are read-only for the importer. Assigning to `count` throws a TypeError (assignment to constant variable). Only the exporting module can change it, e.g. through `inc`.",
    },
    {
      id: "d4-16", domain: "d4", lesson: "d4-modules", level: "junior", type: "match",
      prompt: "Match each export with how you import it.",
      pairs: [
        ["`export default function save() {}`", "`import anyName from \"./m.js\"`"],
        ["`export const limit = 5;`", "`import { limit } from \"./m.js\"`"],
        ["Every export as one object", "`import * as m from \"./m.js\"`"],
        ["Load only when needed", "`const m = await import(\"./m.js\")`"],
      ],
      explanation: "A default export can be imported under any name; named exports must use their name (or `as`). Namespace imports collect all exports, and dynamic import returns a promise of the module.",
    },
    {
      id: "d4-17", domain: "d4", lesson: "d4-modules", level: "senior",
      prompt: "Which statements about ES modules are true? (Choose two.)",
      options: [
        "Module code always runs in strict mode",
        "`await` can be used at the top level of a module",
        "At the top level of a module, `this` is `window`",
        "A module's code runs again each time another file imports it",
      ],
      answer: [0, 1],
      explanation: "Modules are strict, support top-level await, and have `this === undefined` at the top level. Each module is evaluated once and cached; later imports share the same instance.",
    },
    {
      id: "d4-23", domain: "d4", lesson: "d4-modules", level: "staff", type: "order",
      prompt: "Order a low-risk plan to migrate a large Node.js service from CommonJS to ES modules.",
      items: [
        "Add tests and a lint rule that blocks new `require` / `module.exports` code",
        "Convert leaf modules (no internal imports) first",
        "Work up the dependency graph, keeping interop at the boundaries",
        "Set `\"type\": \"module\"` in package.json once everything is converted",
        "Remove the interop shims",
      ],
      explanation: "Stop the bleeding, then convert bottom-up so every step ships and can be rolled back. Flipping the package type is the last switch, and cleanup comes once nothing depends on the shims.",
    },
    {
      id: "d4-24", domain: "d4", lesson: "d4-modules", level: "staff",
      prompt: "The production bundle includes an entire utility library even though the app imports two functions from it. What's the most likely cause and fix?",
      options: [
        "The library is consumed as CommonJS (or its code has side effects), so the bundler can't drop unused exports. Use its ESM build with named imports, and mark it side-effect free if it is",
        "Bundlers never remove unused code; split the library into two files by hand",
        "Named imports always pull in the whole module; use a default import instead",
        "Minification is turned off; enabling it removes unused exports",
      ],
      answer: [0],
      explanation: "Tree shaking relies on static ES module imports and knowing that unused modules have no side effects (`\"sideEffects\": false` in package.json). CommonJS is dynamic, so bundlers keep it whole.",
    },
    // ── Traps ──
    {
      id: "d4-18", domain: "d4", lesson: "d4-traps", level: "junior",
      prompt: "What does this print?",
      code: `console.log(0.1 + 0.2 === 0.3, 0.1 + 0.2);`, codeLang: "js",
      options: ["`false 0.30000000000000004`", "`true 0.3`", "`false 0.3`", "`true 0.30000000000000004`"],
      answer: [0],
      explanation: "0.1 and 0.2 can't be represented exactly in binary floating point, so their sum is slightly off. Compare with `Math.abs(a - b) < Number.EPSILON` or use integers.",
    },
    {
      id: "d4-19", domain: "d4", lesson: "d4-traps", level: "intermediate",
      prompt: "What does this print?",
      code: `console.log([1, 2, 3] + [4]);`, codeLang: "js",
      options: ["`1,2,34`", "`[1, 2, 3, 4]`", "`10`", "`1,2,3,4`"],
      answer: [0],
      explanation: "`+` on objects converts both to primitives: \"1,2,3\" and \"4\". Strings concatenate: \"1,2,34\". Use spread or concat to join arrays.",
    },
    {
      id: "d4-20", domain: "d4", lesson: "d4-traps", level: "intermediate", type: "lines",
      prompt: "`getConfig()` returns `undefined`. Which line causes it?",
      code: `function getConfig() {
  return
  {
    debug: true
  };
}
console.log(getConfig());`, codeLang: "js",
      answer: [2],
      explanation: "Automatic semicolon insertion ends the statement after a bare `return` followed by a line break, so the function returns undefined. Put the opening brace on the same line as return.",
    },
    {
      id: "d4-21", domain: "d4", lesson: "d4-traps", level: "senior",
      prompt: "What does this print?",
      code: `console.log(Math.max(), Math.min());`, codeLang: "js",
      options: ["`-Infinity Infinity`", "`0 0`", "`NaN NaN`", "`Infinity -Infinity`"],
      answer: [0],
      explanation: "With no arguments, each returns its identity value: any number is larger than -Infinity, so max starts there; min starts at Infinity. That's also why `Math.max(...[])` is -Infinity.",
    },
    {
      id: "d4-22", domain: "d4", lesson: "d4-traps", level: "senior",
      prompt: "What does this print?",
      code: `const a = [1, 2, 3];
a[10] = 11;
console.log(a.length, a.filter(() => true).length);`, codeLang: "js",
      options: ["`11 4`", "`4 4`", "`11 11`", "`10 4`"],
      answer: [0],
      explanation: "Writing index 10 makes length 11 and leaves holes at 3 to 9. filter skips holes, so only the 4 real elements remain.",
    },
    {
      id: "d4-26", domain: "d4", lesson: "d4-traps", level: "staff",
      prompt: "A billing system sums prices as JavaScript numbers, and invoices are occasionally off by a cent. What's the best system-wide fix?",
      options: [
        "Represent money as integer minor units (cents) or a decimal type end to end, and round only at defined points",
        "Call `toFixed(2)` after every addition",
        "Use `Math.round` on the final total only",
        "Switch to `parseFloat` when reading prices",
      ],
      answer: [0],
      explanation: "Binary floats can't represent most decimal fractions exactly, and errors accumulate. Integers (or BigInt, or a decimal library) are exact, and an explicit rounding policy keeps every service consistent. toFixed returns strings and still rounds floats.",
    },
  ],

  cards: [
    { id: "c4-map", domain: "d4", kind: "service", term: "Array.prototype.map", definition: "New array of the same length with each element transformed." },
    { id: "c4-filter", domain: "d4", kind: "service", term: "Array.prototype.filter", definition: "New array of the elements whose callback returns truthy." },
    { id: "c4-reduce", domain: "d4", kind: "service", term: "Array.prototype.reduce", definition: "Folds an array into one value. Pass an initial value to handle empty arrays." },
    { id: "c4-find", domain: "d4", kind: "service", term: "Array.prototype.find", definition: "First element matching the callback, or undefined. Stops early." },
    { id: "c4-some", domain: "d4", kind: "service", term: "some / every", definition: "Boolean tests: at least one, or all, elements pass. Both short-circuit." },
    { id: "c4-flatmap", domain: "d4", kind: "service", term: "Array.prototype.flatMap", definition: "Maps each element, then flattens one level. Return [] to drop an item." },
    { id: "c4-tosorted", domain: "d4", kind: "service", term: "Array.prototype.toSorted", definition: "Sorted copy of the array (ES2023). The original is left unchanged." },
    { id: "c4-from", domain: "d4", kind: "service", term: "Array.from", definition: "Builds an array from an iterable or array-like, with an optional map function." },
    { id: "c4-import", domain: "d4", kind: "service", term: "import()", definition: "Dynamic import: loads a module on demand and returns a promise of its namespace." },
    { id: "c4-map-ds", domain: "d4", kind: "service", term: "Map", definition: "Key-value collection with any key type, insertion order, and O(1) average lookups." },
    { id: "c4-defaults", domain: "d4", kind: "concept", term: "Destructuring default", definition: "Used only when the value is undefined, never for null." },
    { id: "c4-rest", domain: "d4", kind: "concept", term: "Rest vs spread", definition: "Rest collects remaining items into one; spread expands one iterable or object into many." },
    { id: "c4-live", domain: "d4", kind: "concept", term: "Live binding", definition: "An ES module import reflects the current value of the export and is read-only to the importer." },
    { id: "c4-tree", domain: "d4", kind: "concept", term: "Tree shaking", definition: "Bundlers drop unused exports, relying on static ES module imports and no side effects." },
    { id: "c4-asi", domain: "d4", kind: "concept", term: "Automatic semicolon insertion", definition: "A line break after return/throw/break/continue ends the statement." },
    { id: "c4-float", domain: "d4", kind: "concept", term: "IEEE 754 floats", definition: "All numbers are 64-bit doubles: 0.1 + 0.2 isn't exactly 0.3. Integers are exact up to 2^53 - 1." },
  ],
});
