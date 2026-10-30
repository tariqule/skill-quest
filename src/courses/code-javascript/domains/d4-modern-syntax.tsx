import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
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
    summary: "Working through lists with loops and array methods, unpacking objects and arrays, sharing code between files with modules, and the classic snippets that catch people out.",
  },

  tasks: [
    { id: "4.1", title: "Array methods", covers: ["map, filter, reduce, find, some, every, flatMap", "Mutating vs copying methods", "sort and its comparator", "Picking the right data structure"] },
    { id: "4.2", title: "Destructuring, spread, and modules", covers: ["Object and array destructuring, defaults, rest", "Spread for copies and merges", "ES module imports and exports, live bindings", "Dynamic import and tree shaking"] },
    { id: "4.3", title: "Classic output traps", covers: ["Floating-point arithmetic", "Automatic semicolon insertion", "Holes, length, and odd built-ins"] },
  ],

  lessons: [
    // ── Start here ──
    {
      id: "d4-b-loops",
      level: "beginner",
      check: ["js-b4-01", "js-b4-02"],
      task: "4.1",
      title: "Loops: do something for every item",
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#f472b6"
            steps={[
              { icon: "📋", label: "Take the next item", sub: "From the start of the list" },
              { icon: "🔁", label: "Run the loop body", sub: "Your code, once per item" },
              { icon: "🏁", label: "Stop at the end", sub: "When no items are left" },
            ]}
          />
          <CodeBlock
            lang="js"
            code={`const fruits = ["apple", "banana"];
for (const fruit of fruits) {
  console.log(fruit);
}
// apple
// banana`}
          />
        </div>
      ),
      points: [
        "A loop repeats some code. It's like a teacher calling out each name on the register, one after another.",
        "`for (const item of list) { ... }` runs the code in the braces once for each item, in order.",
        "Each time round, `item` holds the current item. You can call it anything that makes sense, like `fruit` or `order`.",
      ],
      tip: "Name the loop variable as the singular of the list: `for (const user of users)`. It makes the code read like a sentence.",
    },
    {
      id: "d4-b-map-filter",
      level: "beginner",
      check: ["js-b4-03", "js-b4-04"],
      task: "4.1",
      title: "map and filter: new lists from old ones",
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🔄", title: "map", text: "Changes every item. [1, 2, 3] times 10 gives [10, 20, 30]", color: "#f472b6" },
            { icon: "🧹", title: "filter", text: "Keeps only items that pass a test. Keep the big ones from [5, 12, 8] and you get [12, 8]", color: "#34d399" },
          ]}
        />
      ),
      points: [
        "`map` makes a new list by changing every item, like putting each photo through the same filter.",
        "`filter` makes a new list with only the items that pass a test, like a sieve that keeps the big stones.",
        "Both take a small function that's run on each item, for example `(n) => n * 10`. This short way of writing a function is an arrow function.",
        "Neither one changes the original list. You get a brand-new array back.",
      ],
      tip: "Read `filter((n) => n > 6)` out loud as \"keep each n where n is bigger than 6\". It makes the code much easier to follow.",
    },
    {
      id: "d4-b-templates",
      level: "beginner",
      check: ["js-b4-05", "js-b4-06"],
      task: "4.2",
      title: "Template strings: drop values into text",
      visual: (
        <CodeCompare
          lang="js"
          left={{ title: "Joining with +", code: `const name = "Ada";
"Hi, " + name + "!"   // "Hi, Ada!"` }}
          right={{ title: "Template string", code: `const name = "Ada";
\`Hi, \${name}!\`       // "Hi, Ada!"` }}
        />
      ),
      points: [
        "A template string is text wrapped in backticks, the slanted quote key usually found at the top left of the keyboard.",
        "Inside it, `${...}` drops a value straight into the text. So `${name}` is replaced with whatever `name` holds.",
        "It's easier to read than gluing pieces together with `+`, and it can span several lines.",
      ],
      tip: "If `${name}` shows up literally in your output, check your quotes. Only backticks fill in the value.",
    },
    // ── Junior and up ──
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

orders.filter((o) => o.paid)          // keep matches: 2 orders
      .map((o) => o.total)            // change each: [40, 25]
      .reduce((sum, t) => sum + t, 0); // combine into one value: 65`}
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
        "`map` changes every item and keeps the length. `filter` keeps the items that pass a test. `reduce` combines everything into one value, so always give it a starting value.",
        "`find` returns the first match, or `undefined`. `some` and `every` return true or false, and stop as soon as they know the answer.",
        "`sort()` with no compare function sorts items as text, so `[10, 1, 3].sort()` gives `[1, 10, 3]`. For numbers, pass `(a, b) => a - b`.",
        "`sort` changes the array in place. `toSorted`, added in ES2023, gives you a sorted copy instead.",
      ],
      tip: "Mention the cost as you chain methods. Each one is a full pass, so `filter`, `map` and `reduce` together are still O(n), but a `find` inside a loop is O(n²).",
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
        "Destructuring pulls values out of an object or array into variables in one line. A default value is used only when the value is `undefined`, not when it's `null`.",
        "`...rest` gathers up whatever is left over. `...x` used as spread does the opposite and lays items out. Same three dots, opposite directions.",
        "Spread copies are shallow, and when keys clash, the later one wins.",
        "Destructuring `undefined` or `null` throws a `TypeError`. Give object parameters an empty default, like `({ host } = {})`.",
      ],
      tip: "Use the swap trick `[a, b] = [b, a]` in live coding. Interviewers notice when code looks natural for the language.",
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
        "An import is a live, read-only view of the exporting module's variable. If the exporter changes it, you see the new value.",
        "Import lines are hoisted and fixed before the code runs, so bundlers can see which exports are unused and drop them. That's called tree shaking.",
        "Modules always use strict mode. Each one runs once and is then cached, and you can use `await` at the top level.",
        "`import()` loads a module only when you ask for it, and returns a promise. It's how you split code into smaller downloads.",
      ],
      tip: "Compare it with CommonJS: `require` is an ordinary function call that runs straight away and copies the values of `module.exports` at that moment.",
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
Math.max()             // -Infinity (the starting point for max)
["1", "2", "3"].map(parseInt) // [1, NaN, NaN]
return                 // ASI inserts ";" here,
  { ok: true };        // so this object is never returned`}
        />
      ),
      points: [
        "Every number is a 64-bit floating-point value, so some decimals are slightly off. Compare with a small tolerance, or work in whole numbers such as cents.",
        "A line break straight after `return`, `throw`, `break` or `continue` ends the statement. This is automatic semicolon insertion, or ASI.",
        "Callbacks get more arguments than you might expect. `map` passes the value, the index and the whole array.",
        "Arrays can have empty slots, called holes. Many methods, including `forEach`, `filter` and `map`, skip over them.",
      ],
      tip: "For each trap, explain the rule behind it. \"It's weird\" isn't an answer, but \"map passes the index as parseInt's radix\" is.",
    },
  ],

  questions: [
    // ── Beginner ──
    {
      id: "js-b4-01", domain: "d4", lesson: "d4-b-loops", level: "beginner", type: "output",
      prompt: "Type what this prints, one line per log.",
      code: `for (const n of [1, 2, 3]) {
  console.log(n * 2);
}`, codeLang: "js",
      answers: ["2\n4\n6"],
      explanation: "The loop runs its body once for each item. `n` is 1, then 2, then 3, and each time the body prints `n * 2`, so you see 2, 4 and 6 on separate lines.",
    },
    {
      id: "js-b4-02", domain: "d4", lesson: "d4-b-loops", level: "beginner", type: "fill",
      prompt: "Fill the gap so the loop goes through each fruit in the list.",
      code: `const fruits = ["apple", "banana"];
for (const fruit {{1}} fruits) {
  console.log(fruit);
}`, codeLang: "js",
      blanks: [{ options: ["of", "in", "to", "from"], answer: 0 }],
      explanation: "`for...of` gives you each item in the list. `for...in` also exists, but it gives you the positions \"0\" and \"1\" rather than the fruit. `to` and `from` aren't valid here.",
    },
    {
      id: "js-b4-03", domain: "d4", lesson: "d4-b-map-filter", level: "beginner", type: "output",
      prompt: "Type what this prints.",
      code: `const big = [5, 12, 8].filter((n) => n > 6);
console.log(big.length);`, codeLang: "js",
      answers: ["2"],
      explanation: "`filter` keeps only the numbers bigger than 6, which are 12 and 8. That new list has 2 items, so `big.length` is 2.",
    },
    {
      id: "js-b4-04", domain: "d4", lesson: "d4-b-map-filter", level: "beginner",
      prompt: "What does `[1, 2, 3].map((n) => n * 10)` give you?",
      options: ["A new array, `[10, 20, 30]`", "The number 60", "The original array, changed to `[10, 20, 30]`", "Just the first item, 10"],
      answer: [0],
      explanation: "`map` runs the function on every item and collects the results in a new array of the same length. The original `[1, 2, 3]` is left as it was. Adding things up into one number is a job for `reduce`.",
    },
    {
      id: "js-b4-05", domain: "d4", lesson: "d4-b-templates", level: "beginner", type: "output",
      prompt: "Type what this prints.",
      code: `const name = "Ada";
console.log(\`Hi, \${name}!\`);`, codeLang: "js",
      answers: ["Hi, Ada!"],
      explanation: "The backticks make a template string, and `${name}` is replaced with the value of `name`. So the text becomes \"Hi, Ada!\".",
    },
    {
      id: "js-b4-06", domain: "d4", lesson: "d4-b-templates", level: "beginner",
      prompt: "Which kind of quotes lets you put `${name}` inside text and have it filled in?",
      options: ["Backticks", "Single quotes", "Double quotes", "Any kind of quotes"],
      answer: [0],
      explanation: "Only backticks make a template string. With single or double quotes, `${name}` is just ordinary characters, so it would print exactly as typed.",
    },
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
      explanation: "`filter` keeps 2 and 4. `map` turns them into 20 and 40. `reduce` adds those up to 60.",
    },
    {
      id: "d4-02", domain: "d4", lesson: "d4-traps", level: "senior",
      prompt: "What does this print?",
      code: `console.log(["1", "2", "3"].map(parseInt));`, codeLang: "js",
      options: ["`[1, NaN, NaN]`", "`[1, 2, 3]`", "`[NaN, NaN, NaN]`", "`[1, 2, NaN]`"],
      answer: [0],
      explanation: "`map` calls `parseInt(value, index)`, and `parseInt` treats its second argument as the number base. Base 0 is treated as base 10, so \"1\" gives 1. Base 1 isn't valid, so \"2\" gives `NaN`. \"3\" isn't a digit in base 2, so that's `NaN` too. Use `.map(Number)` or an arrow function.",
    },
    {
      id: "d4-03", domain: "d4", lesson: "d4-arrays", level: "intermediate",
      prompt: "What does this print?",
      code: `console.log([10, 1, 3].sort());`, codeLang: "js",
      options: ["`[1, 10, 3]`", "`[1, 3, 10]`", "`[10, 3, 1]`", "`[3, 10, 1]`"],
      answer: [0],
      explanation: "With no compare function, `sort` turns the items into text and compares them as text, and \"1\" comes before \"10\", which comes before \"3\". Use `sort((a, b) => a - b)` for numbers.",
    },
    {
      id: "d4-04", domain: "d4", lesson: "d4-arrays", level: "intermediate",
      prompt: "What does this print?",
      code: `const nums = [3, 1, 2];
const sorted = nums.sort();
console.log(nums, sorted === nums);`, codeLang: "js",
      options: ["`[1, 2, 3] true`", "`[3, 1, 2] false`", "`[1, 2, 3] false`", "`[3, 1, 2] true`"],
      answer: [0],
      explanation: "`sort` changes the array in place and returns that same array. To keep the original, use `nums.toSorted()` or `[...nums].sort()`.",
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
      explanation: "Picking the right method tells the reader what you mean: `find` when you want one item, `some` or `every` for a yes or no answer, and `reduce` for totals and grouping.",
    },
    {
      id: "d4-06", domain: "d4", lesson: "d4-arrays", level: "junior",
      prompt: "Which methods change the original array? (Choose three.)",
      options: ["`push`", "`splice`", "`sort`", "`map`", "`slice`", "`toSorted`"],
      answer: [0, 1, 2],
      explanation: "`push`, `splice` and `sort` change the array in place. `map`, `slice` and `toSorted` return new arrays and leave the original alone.",
    },
    {
      id: "d4-07", domain: "d4", lesson: "d4-arrays", level: "intermediate", type: "order",
      prompt: "Arrange the lines so the code keeps numbers greater than 2, squares them, and sums the squares.",
      items: ["`const total = nums`", "`  .filter((n) => n > 2)`", "`  .map((n) => n * n)`", "`  .reduce((sum, n) => sum + n, 0);`"],
      explanation: "Filter the original numbers first, then square them, then reduce to one number. `reduce` has to come last because it returns a number, not an array.",
    },
    {
      id: "d4-08", domain: "d4", lesson: "d4-arrays", level: "senior",
      prompt: "What happens when this runs?",
      code: `const total = [].reduce((a, b) => a + b);
console.log(total);`, codeLang: "js",
      options: ["A `TypeError`: reduce of empty array with no initial value", "It prints `0`", "It prints `undefined`, because there's nothing for reduce to add", "It prints `NaN`"],
      answer: [0],
      explanation: "Without a starting value, `reduce` uses the first item as its starting value. An empty array has no first item, so it throws. Always pass one: `reduce((a, b) => a + b, 0)`.",
    },
    {
      id: "d4-25", domain: "d4", lesson: "d4-arrays", level: "senior",
      prompt: "A hot path runs `users.find((u) => u.id === order.userId)` for each of 50,000 orders against 50,000 users. What's the best fix?",
      options: [
        "Build a `Map` from id to user once, then look each order up in O(1): O(n + m) instead of O(n × m)",
        "Replace `find` with `filter(...)[0]`",
        "Sort users by id once and keep calling `find` for each order, since `find` stops early on a sorted array",
        "Use a `for` loop instead of `find`",
      ],
      answer: [0],
      explanation: "`find` checks items one by one, so the nested lookup can take 2.5 billion comparisons. One pass to build a `Map` makes each lookup take constant time on average. The style of loop doesn't change how much work is done.",
    },
    // ── Destructuring and spread ──
    {
      id: "d4-09", domain: "d4", lesson: "d4-destructure", level: "junior",
      prompt: "What does this print?",
      code: `const { a = 1, b = 2 } = { a: undefined, b: null };
console.log(a, b);`, codeLang: "js",
      options: ["`1 null`", "`1 2`", "`undefined null`", "`undefined 2`"],
      answer: [0],
      explanation: "Defaults are only used for `undefined`. `a` is `undefined`, so it gets 1. `b` is `null`, which counts as a real value, so it stays `null`.",
    },
    {
      id: "d4-10", domain: "d4", lesson: "d4-destructure", level: "junior",
      prompt: "What does this print?",
      code: `let x = 1, y = 2;
[x, y] = [y, x];
console.log(x, y);`, codeLang: "js",
      options: ["`2 1`", "`1 2`", "`2 2`", "A `SyntaxError`"],
      answer: [0],
      explanation: "The right side builds the array `[2, 1]` first. Destructuring then puts 2 into `x` and 1 into `y`. You don't need a temporary variable.",
    },
    {
      id: "d4-11", domain: "d4", lesson: "d4-destructure", level: "junior",
      prompt: "What does this print?",
      code: `const { id, ...rest } = { id: 7, name: "Ada", role: "dev" };
console.log(rest);`, codeLang: "js",
      options: ["`{ name: \"Ada\", role: \"dev\" }`", "`{ id: 7, name: \"Ada\", role: \"dev\" }`", "`[\"Ada\", \"dev\"]`", "`7`"],
      answer: [0],
      explanation: "The rest element gathers every remaining property into a new object. It's a handy way to leave out one key without changing the original.",
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
      explanation: "When keys clash, the later spread wins, so put defaults first and overrides last. Keys keep the order they were first added in, which is why `size` comes first in the second object.",
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
      explanation: "Line 4 works, and `port` is just `undefined`. Line 5 passes nothing, so the parameter is `undefined`, and you can't destructure `undefined`. The fix is `function connect({ host, port } = {})`.",
    },
    {
      id: "d4-27", domain: "d4", lesson: "d4-destructure", level: "staff",
      prompt: "A front end does `const { user: { address: { city } } } = res` and crashes in production because the API leaves out `address` for some users. Several teams use this API. What's the most reliable fix?",
      options: [
        "Validate responses at the boundary against a schema the teams share, and model optional fields explicitly (defaults or optional chaining where they're truly optional)",
        "Wrap every component in try/catch",
        "Ask the backend team to always send empty objects for missing fields and keep the destructuring as it is, so the frontend never has to check for undefined values at all",
        "Replace destructuring with `res.user.address.city`",
      ],
      answer: [0],
      explanation: "The real problem is an optional field nobody wrote down. A shared schema makes the contract clear, fails loudly in one place, and tells every team which fields can be missing. The other options only move the crash or hide it.",
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
      explanation: "ES module imports are live: `count` in main.js is a view of the variable in counter.js, so it sees the increment. CommonJS destructuring would have copied 0 instead.",
    },
    {
      id: "d4-15", domain: "d4", lesson: "d4-modules", level: "intermediate", type: "lines",
      prompt: "Which line throws?",
      code: `import { count, inc } from "./counter.js";
inc();
count = 5;
console.log(count);`, codeLang: "js",
      answer: [3],
      explanation: "An importer can't assign to an imported name. Assigning to `count` throws a `TypeError` (\"assignment to constant variable\"). Only the exporting module can change it, for example through `inc`.",
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
      explanation: "You can import a default export under any name. Named exports must use their own name, or rename it with `as`. A namespace import collects every export into one object, and a dynamic import returns a promise of the module.",
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
      explanation: "Modules use strict mode, allow `await` at the top level, and have `this` as `undefined` at the top level. Each module runs once and is cached, so later imports share the same copy.",
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
      explanation: "First stop new CommonJS code arriving. Then convert from the bottom of the dependency graph up, so every step can ship and be rolled back. Switching the package type is the final step, and the cleanup comes once nothing needs the shims.",
    },
    {
      id: "d4-24", domain: "d4", lesson: "d4-modules", level: "staff",
      prompt: "The production bundle includes an entire utility library even though the app imports two functions from it. What's the most likely cause and fix?",
      options: [
        "The library is consumed as CommonJS (or its code has side effects), so the bundler can't drop unused exports. Use its ESM build with named imports, and mark it side-effect free if it is",
        "Bundlers never remove unused code; split the library into two files by hand",
        "Named imports always pull in the whole module, so tree shaking can't work with them; switch every call site to a default import and let the bundler drop the unused methods from that object instead",
        "Minification is turned off; enabling it removes unused exports",
      ],
      answer: [0],
      explanation: "Tree shaking needs static ES module imports, and needs to know that unused modules have no side effects, which you declare with `\"sideEffects\": false` in package.json. CommonJS is dynamic, so bundlers keep all of it.",
    },
    // ── Traps ──
    {
      id: "d4-18", domain: "d4", lesson: "d4-traps", level: "junior",
      prompt: "What does this print?",
      code: `console.log(0.1 + 0.2 === 0.3, 0.1 + 0.2);`, codeLang: "js",
      options: ["`false 0.30000000000000004`", "`true 0.3`", "`false 0.3`", "`true 0.30000000000000004`"],
      answer: [0],
      explanation: "0.1 and 0.2 can't be stored exactly in binary, so their sum is slightly off. Compare with `Math.abs(a - b) < Number.EPSILON`, or work in whole numbers.",
    },
    {
      id: "d4-19", domain: "d4", lesson: "d4-traps", level: "intermediate",
      prompt: "What does this print?",
      code: `console.log([1, 2, 3] + [4]);`, codeLang: "js",
      options: ["`1,2,34`", "`[1, 2, 3, 4]`", "`10`", "`1,2,3,4`"],
      answer: [0],
      explanation: "`+` on objects turns both sides into plain values first: \"1,2,3\" and \"4\". Two strings join together, giving \"1,2,34\". Use spread or `concat` to join arrays.",
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
      explanation: "Automatic semicolon insertion ends the statement after a `return` followed by a line break, so the function returns `undefined`. Put the opening brace on the same line as `return`.",
    },
    {
      id: "d4-21", domain: "d4", lesson: "d4-traps", level: "senior",
      prompt: "What does this print?",
      code: `console.log(Math.max(), Math.min());`, codeLang: "js",
      options: ["`-Infinity Infinity`", "`0 0`", "`NaN NaN`", "`Infinity -Infinity`"],
      answer: [0],
      explanation: "With no arguments, each one returns its starting point. Every number is bigger than -Infinity, so `max` starts there, and `min` starts at Infinity. That's also why `Math.max(...[])` is -Infinity.",
    },
    {
      id: "d4-22", domain: "d4", lesson: "d4-traps", level: "senior",
      prompt: "What does this print?",
      code: `const a = [1, 2, 3];
a[10] = 11;
console.log(a.length, a.filter(() => true).length);`, codeLang: "js",
      options: ["`11 4`", "`4 4`", "`11 11`", "`10 4`"],
      answer: [0],
      explanation: "Writing to index 10 makes the length 11 and leaves holes at positions 3 to 9. `filter` skips holes, so only the 4 real items remain.",
    },
    {
      id: "d4-26", domain: "d4", lesson: "d4-traps", level: "staff",
      prompt: "A billing system sums prices as JavaScript numbers, and invoices are occasionally off by a cent. What's the best system-wide fix?",
      options: [
        "Represent money as integer minor units (cents) or a decimal type end to end, and round only at defined points",
        "Call `toFixed(2)` after every addition",
        "Use `Math.round` on the final total only",
        "Switch to `parseFloat` when reading prices from the API, and call `toFixed(2)` after every addition so that the totals stay accurate",
      ],
      answer: [0],
      explanation: "Binary floating-point numbers can't store most decimal fractions exactly, and the small errors add up. Whole numbers, BigInt or a decimal library are exact, and a clear rounding rule keeps every service consistent. `toFixed` returns a string and still rounds a float.",
    },
  ],

  cards: [
    { id: "c4-map", domain: "d4", kind: "service", term: "Array.prototype.map", definition: "Returns a new array of the same length, with each item changed by your function." },
    { id: "c4-filter", domain: "d4", kind: "service", term: "Array.prototype.filter", definition: "Returns a new array holding only the items your function returns a truthy value for." },
    { id: "c4-reduce", domain: "d4", kind: "service", term: "Array.prototype.reduce", definition: "Combines an array into one value. Pass a starting value so empty arrays work too." },
    { id: "c4-find", domain: "d4", kind: "service", term: "Array.prototype.find", definition: "Returns the first item that matches, or `undefined`. It stops as soon as it finds one." },
    { id: "c4-some", domain: "d4", kind: "service", term: "some / every", definition: "Yes or no tests: does at least one item pass, or do all of them? Both stop early once they know." },
    { id: "c4-flatmap", domain: "d4", kind: "service", term: "Array.prototype.flatMap", definition: "Changes each item, then flattens the result by one level. Return `[]` to drop an item." },
    { id: "c4-tosorted", domain: "d4", kind: "service", term: "Array.prototype.toSorted", definition: "Returns a sorted copy of the array, added in ES2023. The original stays as it was." },
    { id: "c4-from", domain: "d4", kind: "service", term: "Array.from", definition: "Builds an array from anything you can loop over or anything with a length, with an optional function to change each item." },
    { id: "c4-import", domain: "d4", kind: "service", term: "import()", definition: "A dynamic import. It loads a module only when needed and returns a promise of everything the module exports." },
    { id: "c4-map-ds", domain: "d4", kind: "service", term: "Map", definition: "A key and value collection that accepts any type of key, keeps the order you added things in, and looks up keys in constant time on average." },
    { id: "c4-defaults", domain: "d4", kind: "concept", term: "Destructuring default", definition: "Used only when the value is `undefined`, never for `null`." },
    { id: "c4-rest", domain: "d4", kind: "concept", term: "Rest vs spread", definition: "Rest gathers leftover items into one. Spread lays one array or object out into many." },
    { id: "c4-live", domain: "d4", kind: "concept", term: "Live binding", definition: "An ES module import always shows the export's current value, and the importer can't assign to it." },
    { id: "c4-tree", domain: "d4", kind: "concept", term: "Tree shaking", definition: "Bundlers drop exports nobody uses. It relies on static ES module imports and code with no side effects." },
    { id: "c4-asi", domain: "d4", kind: "concept", term: "Automatic semicolon insertion", definition: "A line break straight after `return`, `throw`, `break` or `continue` ends the statement." },
    { id: "c4-float", domain: "d4", kind: "concept", term: "IEEE 754 floats", definition: "Every number is a 64-bit double, so `0.1 + 0.2` isn't exactly 0.3. Whole numbers are exact up to 2^53 - 1." },
  ],
});
