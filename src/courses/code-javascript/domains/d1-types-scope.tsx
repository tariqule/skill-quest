import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
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
    summary: "The kinds of values JavaScript has, how it quietly converts between them, how == and === differ, where variables live, and how functions remember them.",
  },

  tasks: [
    { id: "1.1", title: "Types, coercion, and equality", covers: ["Primitive types and typeof", "Truthy and falsy values", "The + operator and ToPrimitive", "== vs ===, Object.is, NaN"] },
    { id: "1.2", title: "Scope, hoisting, and the TDZ", covers: ["var vs let vs const", "Function and variable hoisting", "Temporal dead zone", "Lexical scope and the scope chain"] },
    { id: "1.3", title: "Closures", covers: ["What a closure captures", "Closures in loops", "Private state and factories", "Memory retained by closures"] },
  ],

  lessons: [
    // ── Start here ──
    {
      id: "d1-b-first-line",
      level: "beginner",
      check: ["js-b1-01", "js-b1-02"],
      task: "1.1",
      title: "What JavaScript is and your first line",
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#facc15"
            steps={[
              { icon: "✍️", label: "You write code", sub: "Plain text instructions" },
              { icon: "⚙️", label: "An engine runs it", sub: "In a browser or in Node.js" },
              { icon: "🖨️", label: "You see the result", sub: "console.log shows it" },
            ]}
          />
          <CodeBlock lang="js" code={`console.log("Hello!"); // prints Hello!`} />
        </div>
      ),
      points: [
        "JavaScript is a programming language. It's what makes web pages react when you click, type or scroll.",
        "Every web browser can run it. Node.js is a program that runs the same language outside the browser, on your computer or a server.",
        "Think of it like a recipe: you write the steps, and the engine follows them one line at a time, top to bottom.",
        "`console.log(...)` prints whatever you put in the brackets. It's how you see what your code is doing.",
      ],
      tip: "To try it now, open your browser, press F12 to open the developer tools, pick the Console tab, and type `console.log(\"hi\")`.",
    },
    {
      id: "d1-b-values",
      level: "beginner",
      check: ["js-b1-03", "js-b1-04"],
      task: "1.2",
      title: "Values and the boxes that hold them",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🔤", title: "string", text: "Text in quotes, like \"Ada\"", color: "#facc15" },
              { icon: "🔢", title: "number", text: "Any number, like 42 or 3.5", color: "#38bdf8" },
              { icon: "✅", title: "boolean", text: "Just true or false", color: "#34d399" },
            ]}
          />
          <CodeBlock
            lang="js"
            code={`const name = "Ada";   // a box you won't refill
let score = 0;        // a box you can refill
score = score + 10;   // now score holds 10`}
          />
        </div>
      ),
      points: [
        "A value is a piece of data, like the text `\"Ada\"`, the number `42`, or `true`.",
        "A variable is a labelled box that holds a value, so you can use it again by name.",
        "Use `const` for a box you'll never refill, and `let` for one you will. Older code uses `var`, which you'll meet later.",
        "Each value has a type. `typeof` tells you which one, so `typeof 42` gives `\"number\"`.",
      ],
      tip: "Start with `const` every time. Switch to `let` only when you find you need to change the value.",
    },
    {
      id: "d1-b-functions",
      level: "beginner",
      check: ["js-b1-05", "js-b1-06"],
      task: "1.3",
      title: "Functions: steps you can reuse",
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#a3e635"
            steps={[
              { icon: "📥", label: "Inputs go in", sub: "add(2, 3)" },
              { icon: "🧑‍🍳", label: "The steps run", sub: "a + b" },
              { icon: "📤", label: "A result comes out", sub: "return gives back 5" },
            ]}
          />
          <CodeBlock
            lang="js"
            code={`function add(a, b) {
  return a + b;
}
console.log(add(2, 3)); // 5`}
          />
        </div>
      ),
      points: [
        "A function is a named set of steps you can run whenever you like, like a recipe card you reuse.",
        "The names in brackets, like `a` and `b`, are parameters. They hold whatever values you pass in when you call it.",
        "`return` hands a value back to whoever called the function, and stops the function there.",
        "Variables made inside a function belong to it. Code outside can't see them.",
      ],
      tip: "Writing `add` on its own doesn't run anything. You need the brackets, `add(2, 3)`, to actually call it.",
    },
    // ── Junior and up ──
    {
      id: "d1-types",
      level: "junior",
      check: ["d1-01", "d1-02"],
      task: "1.1",
      title: "Seven primitives and one typeof surprise",
      sources: [{ title: "MDN: JavaScript data types", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Data_structures", license: "CC BY-SA 2.5" }],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "🔤", title: "string", text: "typeof \"hi\" gives \"string\"" },
              { icon: "🔢", title: "number", text: "Includes NaN and Infinity" },
              { icon: "🐘", title: "bigint", text: "Whole numbers of any size, like 10n" },
              { icon: "✅", title: "boolean", text: "true or false" },
              { icon: "🕳️", title: "undefined", text: "Declared but given no value" },
              { icon: "🚫", title: "null", text: "typeof null gives \"object\", an old bug" },
              { icon: "🔑", title: "symbol", text: "Unique keys, like Symbol(\"id\")" },
              { icon: "📦", title: "object", text: "Arrays, functions, dates and everything else" },
            ]}
          />
          <CodeBlock
            lang="js"
            code={`1 + "2"      // "12"  with +, a string wins
"5" - 2      // 3     - * / always convert to number
true + 1     // 2
[] + {}      // "[object Object]"
!!"0"        // true  a non-empty string is truthy`}
          />
        </div>
      ),
      points: [
        "JavaScript has seven primitive types, the simple building-block values. Everything else, including arrays, functions and dates, is an object.",
        "If either side of `+` turns into a string, `+` glues them together as text. The `-`, `*` and `/` operators always convert both sides to numbers.",
        "A falsy value acts like false in an `if`. There are eight: `false`, `0`, `-0`, `0n`, `\"\"`, `null`, `undefined` and `NaN`.",
        "Everything else is truthy, including an empty array `[]` and an empty object `{}`.",
        "Two newer primitive types round out the list: **BigInt** for whole numbers of any size (written `42n`, `typeof` gives \"bigint\") and **Symbol** for unique keys (`typeof Symbol()` gives \"symbol\").",
      ],
      tip: "When you're asked what a snippet prints, say each conversion out loud: \"`[]` becomes an empty string, so…\". It slows you down in a good way.",
    },
    {
      id: "d1-equality",
      level: "junior",
      check: ["d1-05", "d1-08"],
      task: "1.1",
      title: "== versus ===: the coercion explorer",
      visual: <EqualityExplorer />,
      points: [
        "`===` compares two values without changing their types. `==` converts them first, using rules few people remember.",
        "`null == undefined` is true, and neither is loosely equal to anything else. That's why `x == null` is a common way to check for both.",
        "`NaN` is the only value that isn't equal to itself. To test for it, use `Number.isNaN(x)` or `Object.is(x, NaN)`.",
        "Objects, arrays included, are compared by reference: two separate objects are never equal, even with the same contents.",
      ],
      tip: "A good line for interviews: \"I use `===` by default and allow `== null` on purpose.\" It shows you know the rule and the one handy exception.",
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
        "Before any code runs, JavaScript registers every declaration in a scope. This is called hoisting.",
        "A `var` starts out as `undefined`. A `let`, `const` or `class` isn't set up at all until its line runs. That gap is the temporal dead zone.",
        "Function declarations are hoisted with their whole body, so you can call them early. Function expressions follow the rules of the variable that holds them.",
        "A `var` belongs to the whole function. A `let` or `const` belongs only to the nearest pair of curly braces, its block.",
        "To find a name, JavaScript looks in the current block, then the function, then the module, then the global scope. Where the code is written decides this, which is called lexical scope.",
      ],
      tip: "Say \"temporal dead zone\" and then explain it in plain words: the name exists from the top of the block, but you can't touch it until its line has run.",
    },
    {
      id: "d1-closures",
      level: "intermediate",
      check: ["d1-14", "d1-15"],
      task: "1.3",
      title: "Closures: functions that remember",
      sources: [{ title: "MDN: Closures", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Closures", license: "CC BY-SA 2.5" }],
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
        "A closure is a function that keeps access to the variables around it when it was created, even after the outer function has finished.",
        "It holds the variables themselves, not a snapshot of their values. If a variable changes later, the closure sees the new value.",
        "In a `for` loop, `let` makes a fresh variable for each pass. `var` makes one variable that every pass shares.",
        "Anything a long-lived closure can reach stays in memory. Keep only what you need inside it.",
        "While a closure is reachable, every variable it references stays in memory, so the **garbage collector** can't free it. A long-lived handler that closes over a big array keeps the whole array alive.",
        "A common leak: each page adds a **listener** to `window` (with `addEventListener`) and never removes it, so its closure keeps old **DOM** nodes alive. Remove listeners on cleanup, or pass an `AbortController` signal and call `abort()`.",
        "In Node.js, module-level variables are shared by every request in the process. For per-request data, pass it explicitly or use `AsyncLocalStorage`.",
      ],
      tip: "Closures are what make helpers like `once`, `memoize` and `debounce` work. Be ready to write one of them live.",
    },
  ],

  questions: [
    // ── Beginner ──
    {
      id: "js-b1-01", domain: "d1", lesson: "d1-b-first-line", level: "beginner", type: "output",
      prompt: "Type exactly what this prints.",
      code: `console.log("Hello, " + "world");`, codeLang: "js",
      answers: ["Hello, world"],
      explanation: "`console.log` prints the value you give it. Here `+` joins the two pieces of text into one, so you see `Hello, world` without the quotes.",
    },
    {
      id: "js-b1-02", domain: "d1", lesson: "d1-b-first-line", level: "beginner",
      prompt: "Where can JavaScript code run?",
      options: [
        "In any web browser, and on a computer or server using Node.js",
        "Only inside Microsoft Word",
        "Only on phones",
        "Nowhere until you buy a licence for each browser or server you use",
      ],
      answer: [0],
      explanation: "Every modern browser has a JavaScript engine built in. Node.js takes that same kind of engine and lets you run JavaScript outside the browser, which is how a lot of servers work.",
    },
    {
      id: "js-b1-03", domain: "d1", lesson: "d1-b-values", level: "beginner", type: "fill",
      prompt: "Fill the gap so `score` can be changed on the next line.",
      code: `{{1}} score = 0;
score = score + 10;`, codeLang: "js",
      blanks: [{ options: ["let", "const", "fixed", "value"], answer: 0 }],
      explanation: "`let` makes a variable you're allowed to change later. `const` would throw an error on the second line, because a `const` can't be given a new value. `fixed` and `value` aren't JavaScript keywords.",
    },
    {
      id: "js-b1-04", domain: "d1", lesson: "d1-b-values", level: "beginner", type: "output",
      prompt: "Type what this prints.",
      code: `console.log(typeof 42, typeof "42");`, codeLang: "js",
      answers: ["number string"],
      explanation: "`42` on its own is a number. Put quotes around it and it becomes text, which JavaScript calls a string. `console.log` prints both answers with a space between them.",
    },
    {
      id: "js-b1-05", domain: "d1", lesson: "d1-b-functions", level: "beginner", type: "output",
      prompt: "Type what this prints.",
      code: `function add(a, b) {
  return a + b;
}
console.log(add(2, 3));`, codeLang: "js",
      answers: ["5"],
      explanation: "Calling `add(2, 3)` puts 2 into `a` and 3 into `b`. The function returns `a + b`, which is 5, and `console.log` prints it.",
    },
    {
      id: "js-b1-06", domain: "d1", lesson: "d1-b-functions", level: "beginner",
      prompt: "What does `return` do inside a function?",
      options: [
        "It sends a value back to the code that called the function, and stops the function",
        "It prints the value to the console",
        "It restarts the function from the top with the same arguments, and the function keeps running",
        "It deletes the function",
      ],
      answer: [0],
      explanation: "`return` hands a result back to the caller, so you can store it or use it. It doesn't print anything: you still need `console.log` for that. Any lines after `return` in the same function don't run.",
    },
    // ── Types and coercion ──
    {
      id: "d1-01", domain: "d1", lesson: "d1-types", level: "junior",
      prompt: "What does this print?",
      code: `console.log(typeof null, typeof [], typeof function () {});`, codeLang: "js",
      options: ["`object object function`", "`null array function`", "`object array object`", "`null object function`"],
      answer: [0],
      explanation: "`typeof null` gives \"object\". That's an old bug kept so existing sites don't break. Arrays are objects, so they also give \"object\", while functions get their own answer, \"function\". To check for an array, use `Array.isArray`.",
    },
    {
      id: "d1-02", domain: "d1", lesson: "d1-types", level: "junior",
      prompt: "What does this print?",
      code: `console.log(1 + "2" + 3, 1 + 2 + "3");`, codeLang: "js",
      options: ["`123 33`", "`6 6`", "`123 123`", "`33 123`"],
      answer: [0],
      explanation: "`+` works left to right. In the first one, `1 + \"2\"` makes the string \"12\", and adding 3 gives \"123\". In the second, `1 + 2` is the number 3 first, and then `3 + \"3\"` gives \"33\".",
    },
    {
      id: "d1-03", domain: "d1", lesson: "d1-types", level: "intermediate",
      prompt: "What does this print?",
      code: `console.log("5" - 2, "5" + 2, true + 1);`, codeLang: "js",
      options: ["`3 52 2`", "`3 7 2`", "`NaN 52 true1`", "`3 52 true1`"],
      answer: [0],
      explanation: "`-` always converts to numbers, so `\"5\" - 2` is 3. `+` with a string joins text, so `\"5\" + 2` is \"52\". In `true + 1` there's no string, so `true` becomes 1 and the answer is 2.",
    },
    {
      id: "d1-04", domain: "d1", lesson: "d1-types", level: "junior",
      prompt: "Which of these values are falsy? (Choose three.)",
      options: ["`0`", "`\"\"`", "`null`", "`\"0\"`", "`[]`", "`{}`"],
      answer: [0, 1, 2],
      explanation: "The falsy values are `false`, `0`, `-0`, `0n`, `\"\"`, `null`, `undefined` and `NaN`. The string \"0\" isn't empty, so it's truthy. Every object is truthy too, even an empty array or an empty object.",
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
      explanation: "Values from form inputs are always strings, and `+` with a string joins text, so 3 and \"2\" become \"32\". Convert the input as soon as it arrives: `current + Number(qtyText)`.",
      type: "lines",
    },
    {
      id: "d1-23", domain: "d1", lesson: "d1-types", level: "senior",
      prompt: "What does this print?",
      code: `console.log(String([1, [2, 3]]), String({}), [] + 1);`, codeLang: "js",
      options: ["`1,2,3 [object Object] 1`", "`1,[2,3] {} 1`", "`[1,[2,3]] [object Object] 1`", "`1,2,3 {} NaN`"],
      answer: [0],
      explanation: "An array turns into a string by joining its items with commas, and nested arrays get the same treatment, so `[1, [2, 3]]` becomes \"1,2,3\". A plain object becomes \"[object Object]\". In `[] + 1`, the empty array becomes \"\", so the result is the string \"1\".",
    },
    // ── Equality ──
    {
      id: "d1-05", domain: "d1", lesson: "d1-equality", level: "junior",
      prompt: "What does this print?",
      code: `console.log(null == undefined, null === undefined, null == 0);`, codeLang: "js",
      options: ["`true false false`", "`true true false`", "`false false true`", "`true false true`"],
      answer: [0],
      explanation: "`null` and `undefined` are loosely equal to each other and to nothing else, so `null == 0` is false. With `===` their types are different, so that one is false too.",
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
      explanation: "`typeof` always gives one of eight answers: \"undefined\", \"boolean\", \"number\", \"bigint\", \"string\", \"symbol\", \"function\" or \"object\". `null` is the famous odd one out, because it reports \"object\".",
    },
    {
      id: "d1-07", domain: "d1", lesson: "d1-equality", level: "junior",
      prompt: "Why do most style guides prefer `===` over `==`?",
      options: [
        "It never converts types before comparing, so the results are predictable",
        "It's noticeably faster in every JavaScript engine, so it's always preferred",
        "It compares objects by their contents",
        "It treats `NaN` as equal to itself",
      ],
      answer: [0],
      explanation: "`===` checks the type and the value without converting anything, so there are no surprises. The speed difference is too small to matter, objects are still compared by reference, and `NaN === NaN` is still false.",
    },
    {
      id: "d1-08", domain: "d1", lesson: "d1-equality", level: "intermediate",
      prompt: "What does this print?",
      code: `console.log(NaN === NaN, Object.is(NaN, NaN), [NaN].includes(NaN), [NaN].indexOf(NaN));`, codeLang: "js",
      options: ["`false true true -1`", "`false true false -1`", "`false false true 0`", "`true true true 0`"],
      answer: [0],
      explanation: "`===` and `indexOf` use strict equality, and under strict equality `NaN` never equals itself, so `indexOf` can't find it and returns -1. `Object.is` and `includes` use a slightly different rule that does treat `NaN` as equal to `NaN`.",
    },
    {
      id: "d1-09", domain: "d1", lesson: "d1-equality", level: "intermediate",
      prompt: "What does this print?",
      code: `console.log([] == false, !![]);`, codeLang: "js",
      options: ["`true true`", "`false true`", "`true false`", "`false false`"],
      answer: [0],
      explanation: "For `==`, `false` becomes 0, and `[]` becomes \"\" and then 0, so the two are loosely equal. But `[]` is an object, and every object is truthy, so `!![]` is true. A value can be `== false` and still be truthy.",
    },
    {
      id: "d1-24", domain: "d1", lesson: "d1-equality", level: "senior",
      prompt: "What does this print?",
      code: `console.log(0 === -0, Object.is(0, -0), 1 / -0);`, codeLang: "js",
      options: ["`true false -Infinity`", "`false false -Infinity`", "`true true Infinity`", "`true false NaN`"],
      answer: [0],
      explanation: "`===` treats +0 and -0 as the same, but `Object.is` tells them apart. Dividing by -0 gives `-Infinity`, which is one of the few places the sign actually shows.",
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
      explanation: "The `var a` declaration is hoisted and starts out as `undefined`, but the assignment stays on line 2. So the first log prints `undefined` and the second prints 1.",
    },
    {
      id: "d1-11", domain: "d1", lesson: "d1-hoisting", level: "intermediate",
      prompt: "What happens when this runs?",
      code: `let x = 1;
{
  console.log(x);
  let x = 2;
}`, codeLang: "js",
      options: ["A `ReferenceError` is thrown", "It prints `1`", "It prints `2`", "It prints `undefined` once"],
      answer: [0],
      explanation: "The inner `let x` is hoisted to the top of its block, so inside the braces it hides the outer `x` the whole time. Reading it before its own line runs is a temporal dead zone error, which is a `ReferenceError`.",
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
      explanation: "`greet` is a function declaration, hoisted with its body, so line 2 works. `sayBye` is a `var` holding a function expression, so it's hoisted as `undefined`. Calling `undefined` on line 3 throws \"TypeError: sayBye is not a function\".",
    },
    {
      id: "d1-13", domain: "d1", lesson: "d1-hoisting", level: "junior",
      prompt: "`notDeclared` is never declared anywhere. What happens?",
      code: `console.log(typeof notDeclared);
console.log(notDeclared);`, codeLang: "js",
      options: ["Prints \"undefined\", then throws a `ReferenceError`", "Throws a `ReferenceError` on the first line", "Prints \"undefined\" twice", "Prints \"undefined\" then `null`"],
      answer: [0],
      explanation: "`typeof` is safe to use on a name that was never declared: it just gives \"undefined\". Reading the name directly is different, and throws a `ReferenceError`.",
    },
    {
      id: "d1-18", domain: "d1", lesson: "d1-hoisting", level: "intermediate", type: "order",
      prompt: "A function reads a variable `x` it didn't declare. Put the places the engine looks in order, first to last.",
      items: ["The current block `{ }`", "The enclosing function's scope", "The module (or script) scope", "The global scope"],
      explanation: "JavaScript looks outward from where the code is written: the block, then the function, then the module, then the global scope. This path is the scope chain. If the name isn't found anywhere, reading it throws a `ReferenceError`.",
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
      explanation: "JavaScript uses lexical scope: a function sees the variables from where it was written, not from where it was called. `show` was written next to the outer `x`, so it prints 10.",
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
      explanation: "Both declarations are hoisted, and the function wins that step. But the assignment `foo = 1` still runs on line 2 and replaces the function. By line 4, `foo` holds a number.",
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
      explanation: "`var` makes a single `i` for the whole function, and all three callbacks share it. They run after the loop has finished, when `i` is 3. With `let`, each pass gets its own `i` and you'd see 0 1 2.",
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
      explanation: "Every call to `makeCounter` creates a brand-new `count`. `a` has already been called twice, so its third call returns 3. `b` has its own separate `count`, so its first call returns 1.",
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
      explanation: "With `var`, all three arrow functions share the same `i`, which is 3 once the loop ends. Changing line 2 to `let i` gives every pass of the loop its own `i`.",
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
      explanation: "A closure keeps live links to the outer variables, not copies. That's why it can still read and update them long after the outer function has returned.",
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
      explanation: "The closure remembers `done` and `result`. The first call runs `fn(5)` and stores 10. Every call after that skips `fn` and hands back the stored 10.",
    },
    {
      id: "d1-21", domain: "d1", lesson: "d1-closures", level: "senior",
      prompt: "A click handler closes over a 50 MB `data` array but only ever reads `data.length`. The handler stays registered for the life of the page. What happens to the array?",
      options: [
        "It can't be garbage-collected while the handler is reachable, because the closure references `data`",
        "The engine copies only `length` into the closure, so the array is freed",
        "Closures are released as soon as the outer function returns, so the whole array is freed",
        "Arrays captured by closures are held weakly and freed under memory pressure",
      ],
      answer: [0],
      explanation: "The closure holds on to the variable `data`, and that keeps the whole array in memory. To fix it, work out `const n = data.length` outside the handler and capture only `n`, or remove the listener once you don't need it.",
    },
    // ── Staff ──
    {
      id: "d1-26", domain: "d1", lesson: "d1-equality", level: "staff",
      prompt: "Across a large codebase, bugs keep coming from `==` comparisons between numbers and strings that come from form fields and query params. What's the most effective fix?",
      options: [
        "Enforce `eqeqeq` in lint and CI (optionally allowing `== null`), and parse external input into numbers at the boundary",
        "Add \"check equality operators\" to the code review checklist",
        "Replace every comparison with `Object.is`",
        "Wrap every primitive value in a class so that comparisons can be overridden with a custom `valueOf`",
      ],
      answer: [0],
      explanation: "A lint rule runs on every change and can't be forgotten. Parsing input as soon as it arrives removes the mixed types at the source. Checklists get skipped, and `Object.is` changes how `NaN` and -0 compare without fixing the string and number mix-up.",
    },
    {
      id: "d1-27", domain: "d1", lesson: "d1-closures", level: "staff",
      prompt: "A single-page app's memory grows on every route change. Heap snapshots show detached DOM nodes retained by closures in `resize` listeners added to `window` by each page. What's the right fix?",
      options: [
        "Remove the listeners when the page unmounts, for example by registering them with an `AbortController` signal and aborting it on cleanup",
        "Call the garbage collector manually after each navigation",
        "Change the listeners to arrow functions",
        "Store the DOM nodes in global variables so they can be reused on the next visit, and call `gc()` from the page's unmount hook to free the old ones",
      ],
      answer: [0],
      explanation: "`window` lives longer than any page, so its listeners keep their closures alive, along with everything those closures point to. With `addEventListener(type, fn, { signal })`, one call to `abort()` removes them all.",
    },
    {
      id: "d1-28", domain: "d1", lesson: "d1-closures", level: "staff",
      prompt: "A Node.js service stores the current request's user in a module-level variable that helper closures read. Under load, users occasionally see each other's data. What's the root cause and fix?",
      options: [
        "Module scope is shared by every request in the process. Pass the user explicitly or use `AsyncLocalStorage` for per-request context",
        "Closures are copied per request, so the variable is stale. Use `var` instead of `let` so it's re-read each time",
        "The event loop runs requests in parallel threads. Add a mutex around the variable",
        "The garbage collector frees the variable between requests. Store it on `globalThis`",
      ],
      answer: [0],
      explanation: "One process handles many requests at once, switching between them at every `await`. A module-level variable is shared by all of them, so request B can overwrite it while request A is paused. Anything that belongs to one request has to travel with that request.",
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
      explanation: "A `var` is hoisted as `undefined` and belongs to the whole function. A `let` has a temporal dead zone and belongs only to its block. Code that relied on either `var` behaviour will break. A declaration at the top of a function, or a loop counter used straight away, behaves the same either way.",
    },
  ],

  cards: [
    { id: "c1-typeof", domain: "d1", kind: "service", term: "typeof", definition: "An operator that tells you a value's type as a string. It's safe on names that were never declared. `typeof null` gives \"object\"." },
    { id: "c1-objectis", domain: "d1", kind: "service", term: "Object.is", definition: "Works like `===`, except `NaN` equals `NaN` and +0 is different from -0." },
    { id: "c1-isnan", domain: "d1", kind: "service", term: "Number.isNaN", definition: "True only for the value `NaN` itself. Unlike the older global `isNaN`, it doesn't convert its argument first." },
    { id: "c1-let", domain: "d1", kind: "service", term: "let / const", definition: "Declarations that belong to their block and have a temporal dead zone. A `const` can't be given a new value." },
    { id: "c1-primitives", domain: "d1", kind: "concept", term: "Primitive types", definition: "string, number, bigint, boolean, undefined, null and symbol. They can't be changed in place and are compared by value." },
    { id: "c1-coercion", domain: "d1", kind: "concept", term: "Type coercion", definition: "JavaScript converting a value to another type for you, for example in `==`, `+` or `if (x)`. You can convert on purpose with `Number(x)` or `String(x)`." },
    { id: "c1-falsy", domain: "d1", kind: "concept", term: "Falsy values", definition: "`false`, `0`, `-0`, `0n`, `\"\"`, `null`, `undefined` and `NaN`. Every other value is truthy." },
    { id: "c1-hoisting", domain: "d1", kind: "concept", term: "Hoisting", definition: "Declarations are registered before code runs. A `var` starts as `undefined`, a function comes with its body, and `let` or `const` stay unset until their line." },
    { id: "c1-tdz", domain: "d1", kind: "concept", term: "Temporal dead zone", definition: "The stretch from the top of a block until a `let`, `const` or `class` line runs. Touching the name in that stretch throws a `ReferenceError`." },
    { id: "c1-lexical", domain: "d1", kind: "concept", term: "Lexical scope", definition: "A function sees the variables from where it was written, not from where it's called." },
    { id: "c1-closure", domain: "d1", kind: "concept", term: "Closure", definition: "A function together with live links to the variables of the scope it was created in." },
    { id: "c1-toprimitive", domain: "d1", kind: "concept", term: "ToPrimitive", definition: "How an object becomes a plain value for `+` and `==`, using `valueOf`, `toString` or `Symbol.toPrimitive`. Arrays join their items with commas." },
  ],

  challenges: [
    {
      id: "ch-js-loop-closure",
      domain: "d1",
      lesson: "d1-closures",
      title: "Fix the loop",
      goal: "Keep the setTimeout, but make the loop print 0 1 2.",
      hint: "Which kind of declaration gives every pass of the loop its own i?",
      takeaway: "let makes a fresh variable for each pass of the loop, so each callback remembers its own value.",
      render: (onSolved) => <LoopClosureLab goal="zero-one-two" onSolved={onSolved} />,
    },
  ],
});
