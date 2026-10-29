import { CodeBlock, CodeCompare, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { LoopClosureLab } from "../labs";
import { EqualityExplorer } from "../visuals";

/** Module 1: types, coercion, equality, scope, hoisting, and closures. */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "Types, Scope & Closures",
    world: "The Coercion Caverns",
    weight: 25,
    emoji: "🧪",
    color: "#facc15",
    summary: "Primitive types, typeof, coercion, == vs ===, var/let/const, hoisting, the TDZ, lexical scope, and closures.",
  },

  tasks: [
    { id: "1.1", title: "Types, coercion, and equality", covers: ["Primitive types and typeof", "Truthy and falsy values", "The + operator and ToPrimitive", "== vs ===, Object.is, NaN"] },
    { id: "1.2", title: "Scope, hoisting, and the TDZ", covers: ["var vs let vs const", "Function and variable hoisting", "Temporal dead zone", "Lexical scope and the scope chain"] },
    { id: "1.3", title: "Closures", covers: ["What a closure captures", "Closures in loops", "Private state and factories", "Memory retained by closures"] },
  ],

  lessons: [
    {
      id: "d1-types",
      level: "junior",
      check: ["d1-01", "d1-02"],
      task: "1.1",
      title: "Seven primitives and one typeof surprise",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "🔤", title: "string", text: "typeof \"hi\" → \"string\"" },
              { icon: "🔢", title: "number", text: "Includes NaN and Infinity" },
              { icon: "🐘", title: "bigint", text: "10n, arbitrary-size integers" },
              { icon: "✅", title: "boolean", text: "true / false" },
              { icon: "🕳️", title: "undefined", text: "Declared but no value" },
              { icon: "🚫", title: "null", text: "typeof null → \"object\" (a historic bug)" },
              { icon: "🔑", title: "symbol", text: "Unique keys: Symbol(\"id\")" },
              { icon: "📦", title: "object", text: "Arrays, functions, dates… everything else" },
            ]}
          />
          <CodeBlock
            lang="js"
            code={`1 + "2"      // "12"  string wins with +
"5" - 2      // 3     - * / always convert to number
true + 1     // 2
[] + {}      // "[object Object]"
!!"0"        // true  non-empty string is truthy`}
          />
        </div>
      ),
      points: [
        "There are seven primitive types; everything else (arrays, functions, dates) is an object.",
        "+ concatenates if either operand becomes a string; -, *, / always convert to numbers.",
        "Falsy: false, 0, -0, 0n, \"\", null, undefined, NaN. Empty arrays and objects are truthy.",
      ],
      tip: "When asked \"what does this print?\", say each conversion out loud: \"[] becomes an empty string, so…\"",
    },
    {
      id: "d1-equality",
      level: "junior",
      check: ["d1-05", "d1-08"],
      task: "1.1",
      title: "== vs ===: the coercion explorer",
      visual: <EqualityExplorer />,
      points: [
        "=== compares without converting types. == converts first, using rules few people remember.",
        "null == undefined is true and neither is == to anything else, which is why x == null is a common idiom.",
        "NaN is not equal to itself. Use Number.isNaN(x) or Object.is(x, NaN).",
        "Objects (arrays too) are compared by reference with both operators.",
      ],
      tip: "Say \"I default to === and allow == null on purpose\": it shows you know both the rule and the exception.",
    },
    {
      id: "d1-hoisting",
      level: "intermediate",
      check: ["d1-10", "d1-11"],
      task: "1.2",
      title: "Hoisting and the temporal dead zone",
      visual: (
        <CodeCompare
          lang="js"
          left={{ title: "var: hoisted as undefined", code: `console.log(a); // undefined
var a = 1;

greet();        // works: whole function is hoisted
function greet() {}` }}
          right={{ title: "let / const: TDZ until declared", code: `console.log(b); // ReferenceError
let b = 1;

{
  // b is in the TDZ here too if redeclared below
}` }}
        />
      ),
      points: [
        "Declarations are processed before code runs. var is initialised to undefined; let/const/class are not initialised (the TDZ).",
        "Function declarations are hoisted with their body; function expressions follow their variable's rules.",
        "var is function scoped; let and const are block scoped.",
        "Lookup walks outward: block → function → module → global. Scope is decided by where code is written (lexical).",
      ],
      tip: "Use the phrase \"temporal dead zone\" and explain it: the binding exists from the start of the block but can't be touched until its line runs.",
    },
    {
      id: "d1-closures",
      level: "intermediate",
      check: ["d1-14", "d1-15"],
      task: "1.3",
      title: "Closures: functions that remember",
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="js"
            code={`function makeCounter() {
  let count = 0;           // private: only the arrow can reach it
  return () => ++count;
}
const next = makeCounter();
next(); next();            // 1, 2: count lives on after makeCounter returned`}
          />
          <LoopClosureLab />
        </div>
      ),
      points: [
        "A closure is a function plus a live reference to the variables of the scope it was created in.",
        "Closures capture variables, not values: if the variable changes later, the closure sees the change.",
        "let in a for loop creates a fresh binding per iteration; var shares one binding.",
        "Anything a long-lived closure references stays in memory. Capture only what you need.",
      ],
      tip: "Closures power once, memoize, debounce, and module privacy. Be ready to write one of those live.",
    },
  ],

  questions: [
    // ── Types and coercion ──
    {
      id: "d1-01", domain: "d1", lesson: "d1-types", level: "junior",
      prompt: "What does this print?",
      code: `console.log(typeof null, typeof [], typeof function () {});`, codeLang: "js",
      options: ["`object object function`", "`null array function`", "`object array object`", "`null object function`"],
      answer: [0],
      explanation: "`typeof null` is \"object\" (a bug kept for compatibility), arrays are objects, and functions get their own tag \"function\". Use `Array.isArray` to detect arrays.",
    },
    {
      id: "d1-02", domain: "d1", lesson: "d1-types", level: "junior",
      prompt: "What does this print?",
      code: `console.log(1 + "2" + 3, 1 + 2 + "3");`, codeLang: "js",
      options: ["`123 33`", "`6 6`", "`123 123`", "`33 123`"],
      answer: [0],
      explanation: "`+` is evaluated left to right. `1 + \"2\"` is \"12\", then \"123\". In the second, `1 + 2` is 3 first, then `3 + \"3\"` is \"33\".",
    },
    {
      id: "d1-03", domain: "d1", lesson: "d1-types", level: "intermediate",
      prompt: "What does this print?",
      code: `console.log("5" - 2, "5" + 2, true + 1);`, codeLang: "js",
      options: ["`3 52 2`", "`3 7 2`", "`NaN 52 true1`", "`3 52 true1`"],
      answer: [0],
      explanation: "`-` always converts to numbers (5 - 2 = 3). `+` with a string concatenates (\"52\"). `true + 1` has no string, so true becomes 1: 2.",
    },
    {
      id: "d1-04", domain: "d1", lesson: "d1-types", level: "junior",
      prompt: "Which of these values are falsy? (Choose three.)",
      options: ["`0`", "`\"\"`", "`null`", "`\"0\"`", "`[]`", "`{}`"],
      answer: [0, 1, 2],
      explanation: "The falsy values are false, 0, -0, 0n, \"\", null, undefined, and NaN. A non-empty string like \"0\" is truthy, and every object, including empty arrays and objects, is truthy.",
    },
    {
      id: "d1-20", domain: "d1", lesson: "d1-types", level: "intermediate",
      prompt: "`addItems({ count: 3 }, \"2\")` returns \"32\" instead of 5. Which line causes it?",
      code: `function addItems(cart, qtyText) { // qtyText comes from an <input>, e.g. "2"
  const current = cart.count;      // a number, e.g. 3
  cart.count = current + qtyText;
  return cart.count;
}`, codeLang: "js",
      answer: [3],
      explanation: "Input values are always strings, and `+` with a string concatenates: 3 + \"2\" is \"32\". Convert at the boundary: `current + Number(qtyText)`.",
      type: "lines",
    },
    {
      id: "d1-23", domain: "d1", lesson: "d1-types", level: "senior",
      prompt: "What does this print?",
      code: `console.log(String([1, [2, 3]]), String({}), [] + 1);`, codeLang: "js",
      options: ["`1,2,3 [object Object] 1`", "`1,[2,3] {} 1`", "`[1,[2,3]] [object Object] 1`", "`1,2,3 {} NaN`"],
      answer: [0],
      explanation: "Arrays convert to strings by joining their elements with commas, recursively, so `[1, [2, 3]]` is \"1,2,3\". Plain objects become \"[object Object]\". `[] + 1` turns `[]` into \"\", so the result is the string \"1\".",
    },
    // ── Equality ──
    {
      id: "d1-05", domain: "d1", lesson: "d1-equality", level: "junior",
      prompt: "What does this print?",
      code: `console.log(null == undefined, null === undefined, null == 0);`, codeLang: "js",
      options: ["`true false false`", "`true true false`", "`false false true`", "`true false true`"],
      answer: [0],
      explanation: "`null` and `undefined` are loosely equal to each other and to nothing else, so `null == 0` is false. With `===` their types differ, so it's false.",
    },
    {
      id: "d1-06", domain: "d1", lesson: "d1-equality", level: "junior", type: "match",
      prompt: "Match each expression with its result.",
      pairs: [
        ["`typeof undefined`", "\"undefined\""],
        ["`typeof 42n`", "\"bigint\""],
        ["`typeof Symbol()`", "\"symbol\""],
        ["`typeof null`", "\"object\""],
        ["`typeof (() => {})`", "\"function\""],
      ],
      explanation: "typeof returns one of: \"undefined\", \"boolean\", \"number\", \"bigint\", \"string\", \"symbol\", \"function\", \"object\". `null` is the famous exception that reports \"object\".",
    },
    {
      id: "d1-07", domain: "d1", lesson: "d1-equality", level: "junior",
      prompt: "Why do most style guides prefer `===` over `==`?",
      options: [
        "It never converts types before comparing, so results are predictable",
        "It is noticeably faster in every engine",
        "It compares objects by their contents",
        "It treats `NaN` as equal to itself",
      ],
      answer: [0],
      explanation: "`===` checks type and value without coercion. Speed differences are negligible, objects are still compared by reference, and `NaN === NaN` is still false.",
    },
    {
      id: "d1-08", domain: "d1", lesson: "d1-equality", level: "intermediate",
      prompt: "What does this print?",
      code: `console.log(NaN === NaN, Object.is(NaN, NaN), [NaN].includes(NaN), [NaN].indexOf(NaN));`, codeLang: "js",
      options: ["`false true true -1`", "`false true false -1`", "`false false true 0`", "`true true true 0`"],
      answer: [0],
      explanation: "`===` and `indexOf` use strict equality, where NaN never equals itself. `Object.is` and `includes` use SameValue(Zero), which treats NaN as equal to NaN.",
    },
    {
      id: "d1-09", domain: "d1", lesson: "d1-equality", level: "intermediate",
      prompt: "What does this print?",
      code: `console.log([] == false, !![]);`, codeLang: "js",
      options: ["`true true`", "`false true`", "`true false`", "`false false`"],
      answer: [0],
      explanation: "For `==`, false becomes 0 and `[]` becomes \"\" and then 0, so they're loosely equal. But `[]` is an object, so it is truthy: `!![]` is true. A value can be `== false` and still truthy.",
    },
    {
      id: "d1-24", domain: "d1", lesson: "d1-equality", level: "senior",
      prompt: "What does this print?",
      code: `console.log(0 === -0, Object.is(0, -0), 1 / -0);`, codeLang: "js",
      options: ["`true false -Infinity`", "`false false -Infinity`", "`true true Infinity`", "`true false NaN`"],
      answer: [0],
      explanation: "`===` treats +0 and -0 as equal, while `Object.is` tells them apart. Dividing by -0 gives -Infinity, which is one way the sign shows up.",
    },
    // ── Scope and hoisting ──
    {
      id: "d1-10", domain: "d1", lesson: "d1-hoisting", level: "junior",
      prompt: "What does this print?",
      code: `console.log(a);
var a = 1;
console.log(a);`, codeLang: "js",
      options: ["`undefined` then `1`", "A `ReferenceError`", "`1` then `1`", "`null` then `1`"],
      answer: [0],
      explanation: "The `var a` declaration is hoisted and initialised to undefined; the assignment stays on line 2. So the first log prints undefined and the second prints 1.",
    },
    {
      id: "d1-11", domain: "d1", lesson: "d1-hoisting", level: "intermediate",
      prompt: "What happens when this runs?",
      code: `let x = 1;
{
  console.log(x);
  let x = 2;
}`, codeLang: "js",
      options: ["A `ReferenceError` is thrown", "It prints `1`", "It prints `2`", "It prints `undefined`"],
      answer: [0],
      explanation: "The inner `let x` is hoisted to the top of the block, so it shadows the outer x for the whole block. Reading it before its declaration runs is a temporal dead zone ReferenceError.",
    },
    {
      id: "d1-12", domain: "d1", lesson: "d1-hoisting", level: "intermediate", type: "lines",
      prompt: "Calling `setup()` throws. Which line throws?",
      code: `function setup() {
  greet();
  sayBye();
  function greet() { console.log("hi"); }
  var sayBye = function () { console.log("bye"); };
}
setup();`, codeLang: "js",
      answer: [3],
      explanation: "`greet` is a function declaration, hoisted with its body, so line 2 works. `sayBye` is a var holding a function expression: hoisted as undefined, so line 3 throws \"TypeError: sayBye is not a function\".",
    },
    {
      id: "d1-13", domain: "d1", lesson: "d1-hoisting", level: "junior",
      prompt: "`notDeclared` is never declared anywhere. What happens?",
      code: `console.log(typeof notDeclared);
console.log(notDeclared);`, codeLang: "js",
      options: ["Prints \"undefined\", then throws a `ReferenceError`", "Throws a `ReferenceError` on the first line", "Prints \"undefined\" twice", "Prints \"undefined\" then `null`"],
      answer: [0],
      explanation: "`typeof` is safe on undeclared identifiers and returns \"undefined\". Reading the identifier directly throws a ReferenceError.",
    },
    {
      id: "d1-18", domain: "d1", lesson: "d1-hoisting", level: "intermediate", type: "order",
      prompt: "A function reads a variable `x` it didn't declare. Order the places the engine looks, first to last.",
      items: ["The current block `{ }`", "The enclosing function's scope", "The module (or script) scope", "The global scope"],
      explanation: "Identifier lookup walks the scope chain outward from where the code is written: block, function, module, then global. If it's not found anywhere, reading it throws a ReferenceError.",
    },
    {
      id: "d1-19", domain: "d1", lesson: "d1-hoisting", level: "intermediate",
      prompt: "What does this print?",
      code: `const x = 10;
function show() { console.log(x); }
function run() {
  const x = 20;
  show();
}
run();`, codeLang: "js",
      options: ["`10`", "`20`", "`undefined`", "A `ReferenceError`"],
      answer: [0],
      explanation: "JavaScript is lexically scoped: `show` sees the x where it was defined (the outer 10), not the x where it was called from.",
    },
    {
      id: "d1-22", domain: "d1", lesson: "d1-hoisting", level: "senior",
      prompt: "What does this print?",
      code: `function test() {
  var foo = 1;
  function foo() {}
  console.log(typeof foo);
}
test();`, codeLang: "js",
      options: ["`number`", "`function`", "`undefined`", "A `TypeError`"],
      answer: [0],
      explanation: "Both declarations are hoisted (the function wins the hoisting), but the assignment `foo = 1` still runs on line 2 and overwrites the function. By line 4 foo is a number.",
    },
    // ── Closures ──
    {
      id: "d1-14", domain: "d1", lesson: "d1-closures", level: "intermediate",
      prompt: "What does this print?",
      code: `for (var i = 0; i < 3; i++) {
  setTimeout(() => console.log(i), 0);
}`, codeLang: "js",
      options: ["`3 3 3`", "`0 1 2`", "`2 2 2`", "`undefined` three times"],
      answer: [0],
      explanation: "`var` creates one function-scoped i shared by all three callbacks. They run after the loop, when i is 3. With `let`, each iteration gets its own i and you get 0 1 2.",
    },
    {
      id: "d1-15", domain: "d1", lesson: "d1-closures", level: "junior",
      prompt: "What does this print?",
      code: `function makeCounter() {
  let count = 0;
  return () => ++count;
}
const a = makeCounter();
const b = makeCounter();
a(); a();
console.log(a(), b());`, codeLang: "js",
      options: ["`3 1`", "`1 1`", "`3 4`", "`2 1`"],
      answer: [0],
      explanation: "Each call to makeCounter creates a new `count`. `a` has been called twice, so its third call returns 3. `b` has its own count, so its first call returns 1.",
    },
    {
      id: "d1-16", domain: "d1", lesson: "d1-closures", level: "intermediate", type: "lines",
      prompt: "This logs `[3, 3, 3]`, but it should log `[0, 1, 2]`. Which line needs to change?",
      code: `const fns = [];
for (var i = 0; i < 3; i++) {
  fns.push(() => i);
}
console.log(fns.map((f) => f()));`, codeLang: "js",
      answer: [2],
      explanation: "With `var`, all three arrows close over the same i, which is 3 after the loop. Changing line 2 to `let i` gives each iteration its own binding.",
    },
    {
      id: "d1-17", domain: "d1", lesson: "d1-closures", level: "junior",
      prompt: "Which best describes a closure?",
      options: [
        "A function together with references to the variables of the scope where it was created",
        "A function that has finished running and released its variables",
        "A copy of the outer variables' values taken when the function is created",
        "Any function declared inside a class",
      ],
      answer: [0],
      explanation: "A closure keeps live references (not copies) to outer variables, so it can read and update them long after the outer function has returned.",
    },
    {
      id: "d1-25", domain: "d1", lesson: "d1-closures", level: "intermediate",
      prompt: "What does this print?",
      code: `function once(fn) {
  let done = false, result;
  return (...args) => {
    if (!done) { done = true; result = fn(...args); }
    return result;
  };
}
const init = once((x) => x * 2);
console.log(init(5), init(10));`, codeLang: "js",
      options: ["`10 10`", "`10 20`", "`10 undefined`", "`undefined 20`"],
      answer: [0],
      explanation: "The closure remembers `done` and `result`. The first call runs fn(5) and stores 10. Later calls skip fn and return the stored 10.",
    },
    {
      id: "d1-21", domain: "d1", lesson: "d1-closures", level: "senior",
      prompt: "A click handler closes over a 50 MB `data` array but only ever reads `data.length`. The handler stays registered for the life of the page. What happens to the array?",
      options: [
        "It can't be garbage-collected while the handler is reachable, because the closure references `data`",
        "The engine copies only `length` into the closure, so the array is freed",
        "Closures are released when the outer function returns, so the array is freed",
        "Arrays captured by closures are held weakly and freed under memory pressure",
      ],
      answer: [0],
      explanation: "The closure holds a reference to the variable `data`, which keeps the whole array alive. Fix: compute `const n = data.length` outside and capture only `n`, or remove the listener when it's no longer needed.",
    },
    // ── Staff ──
    {
      id: "d1-26", domain: "d1", lesson: "d1-equality", level: "staff",
      prompt: "Across a large codebase, bugs keep coming from `==` comparisons between numbers and strings that come from form fields and query params. What's the most effective fix?",
      options: [
        "Enforce `eqeqeq` in lint and CI (optionally allowing `== null`), and parse external input into numbers at the boundary",
        "Add \"check equality operators\" to the code review checklist",
        "Replace every comparison with `Object.is`",
        "Wrap every primitive in a class so comparisons can be overridden",
      ],
      answer: [0],
      explanation: "Automated rules scale and can't be forgotten, and parsing at the boundary removes the mixed types at their source. Checklists drift, and `Object.is` changes NaN/-0 semantics without fixing the string-vs-number problem.",
    },
    {
      id: "d1-27", domain: "d1", lesson: "d1-closures", level: "staff",
      prompt: "A single-page app's memory grows on every route change. Heap snapshots show detached DOM nodes retained by closures in `resize` listeners added to `window` by each page. What's the right fix?",
      options: [
        "Remove the listeners when the page unmounts, e.g. register them with an `AbortController` signal and abort it on cleanup",
        "Call the garbage collector manually after each navigation",
        "Change the listeners to arrow functions",
        "Store the DOM nodes in global variables so they can be reused",
      ],
      answer: [0],
      explanation: "`window` outlives every page, so its listeners keep their closures, and everything those closures reference, alive. `addEventListener(type, fn, { signal })` lets one `abort()` remove them all.",
    },
    {
      id: "d1-28", domain: "d1", lesson: "d1-closures", level: "staff",
      prompt: "A Node.js service stores the current request's user in a module-level variable that helper closures read. Under load, users occasionally see each other's data. What's the root cause and fix?",
      options: [
        "Module scope is shared by every request in the process. Pass the user explicitly or use `AsyncLocalStorage` for per-request context",
        "Closures are copied per request, so the variable is stale. Use `var` instead of `let`",
        "The event loop runs requests in parallel threads. Add a mutex around the variable",
        "The garbage collector frees the variable between requests. Store it on `globalThis`",
      ],
      answer: [0],
      explanation: "One process handles many requests concurrently, interleaved at every await. A module-level variable is shared state, so request B can overwrite it while request A is suspended. Request-scoped context must travel with the request.",
    },
    {
      id: "d1-29", domain: "d1", lesson: "d1-hoisting", level: "staff",
      prompt: "You're reviewing an automated codemod that turns every `var` into `let` across a legacy codebase. Which kinds of code can change behaviour and need manual review? (Choose two.)",
      options: [
        "A variable read before its declaration line (now a TDZ `ReferenceError`)",
        "A variable declared inside an `if` block but read after the block",
        "A `var` declared at the top of a function and only used in that function",
        "A loop counter only read synchronously inside the loop body",
      ],
      answer: [0, 1],
      explanation: "`var` is hoisted as undefined and function scoped; `let` has a TDZ and is block scoped. Code relying on either behaviour breaks. Top-of-function declarations and loop counters used synchronously behave the same.",
    },
  ],

  cards: [
    { id: "c1-typeof", domain: "d1", kind: "service", term: "typeof", definition: "Operator returning a type tag string. Safe on undeclared names. typeof null is \"object\"." },
    { id: "c1-objectis", domain: "d1", kind: "service", term: "Object.is", definition: "SameValue equality: like === but NaN equals NaN and +0 differs from -0." },
    { id: "c1-isnan", domain: "d1", kind: "service", term: "Number.isNaN", definition: "True only for the value NaN, without coercing (unlike the global isNaN)." },
    { id: "c1-let", domain: "d1", kind: "service", term: "let / const", definition: "Block-scoped declarations with a temporal dead zone. const can't be reassigned." },
    { id: "c1-primitives", domain: "d1", kind: "concept", term: "Primitive types", definition: "string, number, bigint, boolean, undefined, null, symbol. Immutable and compared by value." },
    { id: "c1-coercion", domain: "d1", kind: "concept", term: "Type coercion", definition: "Automatic conversion between types, e.g. by ==, +, or if (x). Explicit: Number(x), String(x)." },
    { id: "c1-falsy", domain: "d1", kind: "concept", term: "Falsy values", definition: "false, 0, -0, 0n, \"\", null, undefined, NaN. Everything else is truthy." },
    { id: "c1-hoisting", domain: "d1", kind: "concept", term: "Hoisting", definition: "Declarations are registered before code runs: var as undefined, functions with their body, let/const uninitialised." },
    { id: "c1-tdz", domain: "d1", kind: "concept", term: "Temporal dead zone", definition: "From the start of a block until a let/const/class declaration runs, touching the name throws a ReferenceError." },
    { id: "c1-lexical", domain: "d1", kind: "concept", term: "Lexical scope", definition: "A function sees variables from where it was written, not from where it is called." },
    { id: "c1-closure", domain: "d1", kind: "concept", term: "Closure", definition: "A function plus live references to the variables of its defining scope." },
    { id: "c1-toprimitive", domain: "d1", kind: "concept", term: "ToPrimitive", definition: "How objects become primitives for + and ==: valueOf/toString (or Symbol.toPrimitive). Arrays join with commas." },
  ],

  challenges: [
    {
      id: "ch-js-loop-closure",
      domain: "d1",
      lesson: "d1-closures",
      title: "Fix the loop",
      goal: "Keep the setTimeout, but make the loop print 0 1 2.",
      hint: "Which declaration gives every iteration its own i?",
      takeaway: "let creates a fresh binding per loop iteration, so each callback closes over its own value.",
      render: (onSolved) => <LoopClosureLab goal="zero-one-two" onSolved={onSolved} />,
    },
  ],
});
