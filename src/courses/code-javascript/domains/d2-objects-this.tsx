import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { ThisBinderLab } from "../labs";
import { PrototypeChain } from "../visuals";

/** Module 2: this, binding, prototypes, classes, references, and immutability. */
export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "Objects, this & Prototypes",
    world: "The Prototype Peaks",
    weight: 25,
    emoji: "🏔️",
    color: "#fb923c",
    summary: "How objects store data, how JavaScript decides what `this` means, how objects share behaviour through prototypes and classes, and why copying an object is trickier than it looks.",
  },

  tasks: [
    { id: "2.1", title: "this and binding", covers: ["The four binding rules and their priority", "call, apply, and bind", "Arrow functions and lexical this", "Lost this in callbacks"] },
    { id: "2.2", title: "Prototypes and classes", covers: ["The prototype chain and property lookup", "Constructor functions and new", "class, extends, super, static", "Own vs inherited properties"] },
    { id: "2.3", title: "References, equality, and immutability", covers: ["Objects are compared and passed by reference", "Shallow vs deep copies", "Object.freeze and const", "Immutable update patterns"] },
  ],

  lessons: [
    // ── Start here ──
    {
      id: "d2-b-objects",
      level: "beginner",
      check: ["js-b2-01", "js-b2-02"],
      task: "2.3",
      title: "Objects: one name, many labelled facts",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🏷️", title: "Key", text: "The label, like name or age", color: "#fb923c" },
              { icon: "📄", title: "Value", text: "What's stored, like \"Rex\" or 3", color: "#facc15" },
              { icon: "🗂️", title: "Object", text: "All the labelled facts in one place", color: "#34d399" },
            ]}
          />
          <CodeBlock
            lang="js"
            code={`const pet = { name: "Rex", age: 3 };
console.log(pet.name); // "Rex"
pet.age = 4;           // change one fact`}
          />
        </div>
      ),
      points: [
        "An object groups related facts under one name, like a contact card that holds a name, a phone number and an email.",
        "Each fact is a property: a key (the label) and a value (what's stored). You write them inside curly braces, `{ name: \"Rex\" }`.",
        "Read a property with a dot, `pet.name`. Change it the same way, `pet.age = 4`.",
        "If you ask for a key that isn't there, you get `undefined` rather than an error.",
        "JavaScript files can run as **ES modules** (with `import` and `export`). Module code always runs in strict mode.",
        "**Optional chaining** (`a?.b`) reads a property only if `a` isn't null or undefined, and gives `undefined` instead of throwing.",
      ],
      tip: "Reach for an object when several values describe the same thing. One `pet` object is easier to pass around than separate `petName` and `petAge` variables.",
    },
    {
      id: "d2-b-arrays",
      level: "beginner",
      check: ["js-b2-03", "js-b2-04"],
      task: "2.3",
      title: "Arrays: a numbered list",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "0️⃣", title: "fruits[0]", text: "\"apple\", the first item", color: "#fb923c" },
              { icon: "1️⃣", title: "fruits[1]", text: "\"banana\", the second item", color: "#facc15" },
              { icon: "2️⃣", title: "fruits[2]", text: "\"cherry\", the third item", color: "#34d399" },
            ]}
          />
          <CodeBlock
            lang="js"
            code={`const fruits = ["apple", "banana", "cherry"];
console.log(fruits.length); // 3
fruits.push("kiwi");        // add to the end`}
          />
        </div>
      ),
      points: [
        "An array is an ordered list of values, like a shopping list. You write it with square brackets: `[\"apple\", \"banana\"]`.",
        "Each item has a position number called an index. Counting starts at 0, so the first item is `fruits[0]`.",
        "`fruits.length` tells you how many items there are. `fruits.push(x)` adds a new item to the end.",
      ],
      tip: "Starting at 0 trips up everyone at first. The last item is always at `length - 1`.",
    },
    {
      id: "d2-b-methods",
      level: "beginner",
      check: ["js-b2-05", "js-b2-06"],
      task: "2.1",
      title: "Methods: objects that can do things",
      visual: (
        <CodeBlock
          lang="js"
          code={`const dog = {
  name: "Rex",
  speak() {
    return this.name + " says woof";
  },
};
console.log(dog.speak()); // "Rex says woof"`}
        />
      ),
      points: [
        "A property can hold a function too. A function stored on an object is called a method.",
        "You call it with a dot and brackets, `dog.speak()`, just like reading a property and then running it.",
        "Inside the method, `this` means the object before the dot. So in `dog.speak()`, `this.name` is `\"Rex\"`.",
      ],
      tip: "You've used methods already: `console.log` is the `log` method on the `console` object.",
    },
    // ── Junior and up ──
    {
      id: "d2-this",
      level: "intermediate",
      check: ["d2-01", "d2-03"],
      task: "2.1",
      title: "Who is this? Ask how it was called",
      visual: <ThisBinderLab />,
      points: [
        "`this` is decided by how a function is called, not by where it was written. The place it's called from is the call site.",
        "`obj.method()` sets `this` to `obj`. If you pull the method off first, with `const f = obj.method`, a plain `f()` call loses it.",
        "In strict mode, which modules and classes always use, a plain call gets `this` as `undefined`. Older non-strict scripts fall back to `globalThis`.",
        "Arrow functions don't have a `this` of their own. They use the one from the code around them.",
        "A regular function passed to `setTimeout` is called without an object, so it loses `this`. An arrow function keeps the `this` of the code around it.",
      ],
      tip: "When a callback logs `undefined`, say \"the method was detached from its object\", then offer `bind` or an arrow function wrapper as the fix.",
    },
    {
      id: "d2-bind",
      level: "intermediate",
      check: ["d2-04", "d2-05"],
      task: "2.1",
      title: "call, apply, bind, and the priority ladder",
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#fb923c"
            steps={[
              { icon: "🆕", label: "new", sub: "A fresh object, linked to the prototype" },
              { icon: "📌", label: "call / apply / bind", sub: "You choose this. bind can't be undone" },
              { icon: "🔘", label: "obj.method()", sub: "The object before the dot" },
              { icon: "🕳️", label: "plain fn()", sub: "undefined in strict mode, otherwise globalThis" },
            ]}
          />
          <CodeBlock
            lang="js"
            code={`function intro(greeting, mark) { return greeting + ", " + this.name + mark; }
const ada = { name: "Ada" };
intro.call(ada, "Hi", "!");        // args one by one
intro.apply(ada, ["Hi", "!"]);     // args as an array
const hiAda = intro.bind(ada, "Hi"); // new function, this + first arg fixed
hiAda("?");                        // "Hi, Ada?"`}
          />
        </div>
      ),
      points: [
        "When several rules apply, the strongest wins. From strongest to weakest: `new`, then explicit binding with `call`, `apply` or `bind`, then `obj.method()`, then the plain default.",
        "`call` and `apply` run the function straight away. `bind` doesn't run it: it gives you a new function with `this`, and any leading arguments, locked in.",
        "Binding a function that's already bound does nothing to its `this`.",
        "Arrow functions ignore all four rules, and you can't use `new` with them.",
        "Every function has a **prototype** object. `new Fn()` creates an object linked to `Fn.prototype` and runs `Fn` with `this` set to it.",
      ],
      tip: "You may be asked to write your own `bind`. Use a closure: `return (...more) => fn.apply(ctx, [...args, ...more])`.",
    },
    {
      id: "d2-proto",
      level: "senior",
      check: ["d2-09", "d2-10"],
      task: "2.2",
      title: "Climbing the prototype chain",
      visual: (
        <div className="grid gap-4">
          <PrototypeChain />
          <CodeCompare
            lang="js"
            left={{ title: "Constructor + prototype", code: `function Dog(name) { this.name = name; }
Dog.prototype.speak = function () {
  return this.name + " woofs";
};
const rex = new Dog("Rex");` }}
            right={{ title: "class (same chain underneath)", code: `class Dog {
  constructor(name) { this.name = name; }
  speak() { return this.name + " woofs"; }
}
const rex = new Dog("Rex");` }}
          />
        </div>
      ),
      points: [
        "Every object has a hidden link to another object, its prototype. If a property isn't on the object, JavaScript follows the link and looks there, and keeps going until it reaches `null`.",
        "Methods are stored once on the prototype and shared by every instance, so a thousand dogs share one `speak` function.",
        "`class` is mostly a nicer way to write the same thing. It adds strict mode, a temporal dead zone, and a `TypeError` if you call it without `new`.",
        "In a class that `extends` another, call `super()` before you touch `this`.",
      ],
      tip: "Draw the chain from the instance up: `Class.prototype`, then `Parent.prototype`, then `Object.prototype`, then `null`. That one drawing answers most prototype questions.",
    },
    {
      id: "d2-refs",
      level: "intermediate",
      check: ["d2-15", "d2-17"],
      task: "2.3",
      title: "References, copies, and immutability",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🔗", title: "Assignment", text: "b = a copies the reference. Both names point at the same object.", color: "#f87171" },
              { icon: "🪞", title: "Shallow copy", text: "{ ...a }, Object.assign and slice make a new outer object, but nested objects are still shared.", color: "#fbbf24" },
              { icon: "🧬", title: "Deep copy", text: "structuredClone(a) copies the nested data too, though not functions.", color: "#34d399" },
            ]}
          />
          <CodeCompare
            lang="js"
            left={{ title: "Mutating update", code: `function addTodo(list, todo) {
  list.push(todo);   // changes the caller's array
  return list;       // same reference
}` }}
            right={{ title: "Immutable update", code: `function addTodo(list, todo) {
  return [...list, todo]; // new array
}
const next = { ...state, done: true };` }}
          />
        </div>
      ),
      points: [
        "A variable doesn't hold the object itself, it holds a reference, like an address. That's why `{} === {}` is false: two objects, two addresses.",
        "`const` stops you pointing the variable at a different object. It doesn't stop you changing the object it points at.",
        "`Object.freeze` only freezes the top level, so nested objects can still change. Writing to a frozen property throws an error in strict mode.",
        "An immutable update makes new objects along the path that changed and reuses everything else. That reuse is called structural sharing.",
        "`structuredClone(obj)` makes a deep copy of plain data, including nested objects, arrays, Maps, Sets and Dates.",
        "**JSON**: `JSON.stringify` turns data into a string and `JSON.parse` turns it back, always building brand-new objects. Two parses of the same text give objects that aren't `===`.",
        "A `WeakMap` holds its keys weakly: when nothing else references a key object, it can be garbage-collected along with its entry. Use it to attach data to objects you don't own.",
        "A `Map` stores key-value pairs with any type of key and has O(1) average lookups, which makes it the usual index for finding items by id.",
      ],
      tip: "Tie this to frameworks: React and Redux spot changes by checking whether the reference is new. If you change an object in place, they miss the update.",
    },
  ],

  questions: [
    // ── Beginner ──
    {
      id: "js-b2-01", domain: "d2", lesson: "d2-b-objects", level: "beginner", type: "output",
      prompt: "Type what this prints.",
      code: `const pet = { name: "Rex", age: 3 };
console.log(pet.name);`, codeLang: "js",
      answers: ["Rex"],
      explanation: "`pet.name` reads the property called `name` from the `pet` object. Its value is the text \"Rex\", and `console.log` prints text without the quotes.",
    },
    {
      id: "js-b2-02", domain: "d2", lesson: "d2-b-objects", level: "beginner",
      prompt: "What is a JavaScript object?",
      options: [
        "A group of named values, each stored under a key, like a contact card",
        "A list of values that you can reach only by their position number",
        "A special kind of loop",
        "A file saved on your computer",
      ],
      answer: [0],
      explanation: "An object stores values under labels called keys, such as `name` or `age`. A list you reach by position number is an array, which is a different tool you'll meet next.",
    },
    {
      id: "js-b2-03", domain: "d2", lesson: "d2-b-arrays", level: "beginner", type: "output",
      prompt: "Type what this prints.",
      code: `const fruits = ["apple", "banana", "cherry"];
console.log(fruits[0], fruits.length);`, codeLang: "js",
      answers: ["apple 3"],
      explanation: "Array positions start counting at 0, so `fruits[0]` is the first item, \"apple\". `length` counts the items, and there are 3.",
    },
    {
      id: "js-b2-04", domain: "d2", lesson: "d2-b-arrays", level: "beginner", type: "fill",
      prompt: "Fill the gap so \"kiwi\" is added to the end of the list.",
      code: `const fruits = ["apple", "banana"];
fruits.{{1}}("kiwi");`, codeLang: "js",
      blanks: [{ options: ["push", "add", "append", "insert"], answer: 0 }],
      explanation: "`push` is the array method that adds items to the end. The other words sound right, and some other languages use them, but JavaScript arrays don't have `add`, `append` or `insert` methods.",
    },
    {
      id: "js-b2-05", domain: "d2", lesson: "d2-b-methods", level: "beginner", type: "output",
      prompt: "Type what this prints.",
      code: `const dog = {
  name: "Rex",
  speak() {
    return this.name + " says woof";
  },
};
console.log(dog.speak());`, codeLang: "js",
      answers: ["Rex says woof"],
      explanation: "`dog.speak()` runs the method stored on `dog`. Inside it, `this` is `dog`, so `this.name` is \"Rex\", and the method returns \"Rex says woof\".",
    },
    {
      id: "js-b2-06", domain: "d2", lesson: "d2-b-methods", level: "beginner",
      prompt: "In the call `dog.speak()`, what is `this` inside `speak`?",
      options: ["The `dog` object", "The `speak` function", "Always `undefined`", "The whole web page"],
      answer: [0],
      explanation: "When you call a method with a dot, `this` is the object before the dot. Here that's `dog`, which is how the method can read `dog`'s own name.",
    },
    // ── this ──
    {
      id: "d2-01", domain: "d2", lesson: "d2-this", level: "intermediate",
      prompt: "This runs as an ES module (strict mode). What happens?",
      code: `const user = {
  name: "Ada",
  hi() { return this.name; },
};
const hi = user.hi;
console.log(user.hi(), hi());`, codeLang: "js",
      options: ["A `TypeError` is thrown and nothing is printed", "`Ada Ada`", "`Ada undefined`", "`Ada` is printed, then a `TypeError` follows"],
      answer: [0],
      explanation: "All the arguments are worked out before `console.log` runs. `hi()` is a plain call, so in strict mode `this` is `undefined`, and reading `undefined.name` throws a `TypeError` before anything prints.",
    },
    {
      id: "d2-02", domain: "d2", lesson: "d2-this", level: "intermediate",
      prompt: "What does this print?",
      code: `const timer = {
  seconds: 10,
  start() {
    setTimeout(() => console.log(this.seconds), 0);
    setTimeout(function () { console.log(this?.seconds); }, 0);
  },
};
timer.start();`, codeLang: "js",
      options: ["`10` then `undefined`", "`10` then `10`", "`undefined` then `10`", "`undefined` then `undefined`"],
      answer: [0],
      explanation: "The arrow function uses the `this` of `start()`, which is `timer`. The regular function gets its own `this` from `setTimeout`: the global object in browsers, or a Timeout object in Node. Neither has a `seconds` property.",
    },
    {
      id: "d2-03", domain: "d2", lesson: "d2-this", level: "junior",
      prompt: "Inside a regular method called as `cart.total()`, what is `this`?",
      options: ["`cart`", "The global object", "`undefined`", "The `total` function itself"],
      answer: [0],
      explanation: "This is implicit binding. When you call a function as a property of an object, `this` is that object.",
    },
    {
      id: "d2-08", domain: "d2", lesson: "d2-this", level: "junior",
      prompt: "Why does an arrow function work as a `setTimeout` callback inside a method, when a regular function loses `this`?",
      options: [
        "Arrow functions don't have their own `this`, so they use the `this` of the surrounding method",
        "Arrow functions are automatically bound to the object they're defined in, like methods",
        "setTimeout calls arrow functions with the original object as `this`",
        "Arrow functions run synchronously",
      ],
      answer: [0],
      explanation: "An arrow function picks up `this` from the code around it, the same way it picks up any other variable. It isn't tied to an object: an arrow written directly inside an object literal does not get that object as `this`.",
    },
    {
      id: "d2-23", domain: "d2", lesson: "d2-this", level: "staff",
      prompt: "A shared UI library exposes class instances whose methods consumers pass straight to event handlers, and teams keep hitting `this is undefined` bugs. Which API design best removes this class of bug?",
      options: [
        "Expose functions that don't depend on `this` (closures, or arrow-function class fields) so they're safe to pass around",
        "Document that callers must always call `.bind(instance)`",
        "Compile the library in sloppy mode so that `this` always falls back to `window` whenever it gets lost",
        "Wrap every method body in try/catch and log the error",
      ],
      answer: [0],
      explanation: "If passing a function around is safe by design, the bug can't happen at all. Documentation depends on every user remembering. Sloppy mode only hides the bug behind the wrong object, and try/catch only reports it.",
    },
    // ── Binding ──
    {
      id: "d2-04", domain: "d2", lesson: "d2-bind", level: "intermediate", type: "match",
      prompt: "Match each call with what it does.",
      pairs: [
        ["`fn.call(obj, a, b)`", "Runs it now with `this` set to `obj`, arguments listed one by one"],
        ["`fn.apply(obj, [a, b])`", "Runs it now with `this` set to `obj`, arguments in an array"],
        ["`fn.bind(obj, a)`", "Returns a new function with `this` and the first argument fixed"],
        ["`new Fn()`", "Creates an object linked to `Fn.prototype` and uses it as `this`"],
      ],
      explanation: "`call` and `apply` both run the function now. The only difference is how you pass the arguments. `bind` doesn't run anything: it returns a bound function. `new` creates the object that becomes `this`.",
    },
    {
      id: "d2-05", domain: "d2", lesson: "d2-bind", level: "senior",
      prompt: "What does this print?",
      code: `function who() { return this.name; }
const a = who.bind({ name: "A" });
const b = a.bind({ name: "B" });
console.log(b());`, codeLang: "js",
      options: ["`A`", "`B`", "`undefined`", "A `TypeError`"],
      answer: [0],
      explanation: "Once a function is bound, its `this` is fixed for good. Binding it again creates another wrapper, but the inner bound function still calls `who` with `{ name: \"A\" }`.",
    },
    {
      id: "d2-06", domain: "d2", lesson: "d2-bind", level: "senior", type: "order",
      prompt: "Order the `this` binding rules from highest to lowest priority.",
      items: ["`new` binding", "Explicit binding (`call`, `apply`, `bind`)", "Implicit binding (`obj.method()`)", "Default binding (`undefined` in strict mode)"],
      explanation: "`new` on a bound function ignores the bound `this`. Explicit beats implicit, so `obj.fn.call(other)` uses `other`. The default only applies when nothing else does. Arrow functions sit outside this ladder completely.",
    },
    {
      id: "d2-07", domain: "d2", lesson: "d2-bind", level: "intermediate", type: "lines",
      prompt: "`ticks` never increases. Which line is the bug?",
      code: `class Clock {
  constructor() { this.ticks = 0; }
  tick() { this.ticks++; }
  start() {
    setInterval(this.tick, 1000);
  }
}
new Clock().start();`, codeLang: "js",
      answer: [5],
      explanation: "Passing `this.tick` on its own detaches the method from the clock, so it isn't called on the Clock any more. Use `setInterval(() => this.tick(), 1000)` or `this.tick.bind(this)` instead.",
    },
    // ── Prototypes and classes ──
    {
      id: "d2-09", domain: "d2", lesson: "d2-proto", level: "intermediate",
      prompt: "What does this print?",
      code: `function Dog(name) { this.name = name; }
Dog.prototype.speak = function () { return this.name + " woofs"; };
const d = new Dog("Rex");
console.log(d.speak(), d.hasOwnProperty("speak"), "speak" in d);`, codeLang: "js",
      options: ["`Rex woofs false true`", "`Rex woofs true true`", "`Rex woofs false false`", "`undefined woofs false true`"],
      answer: [0],
      explanation: "`speak` lives on `Dog.prototype`, not on `d` itself, so `hasOwnProperty` is false. The `in` operator searches the whole prototype chain, so it finds `speak` and gives true.",
    },
    {
      id: "d2-10", domain: "d2", lesson: "d2-proto", level: "junior",
      prompt: "What does this print?",
      code: `class Animal {
  constructor(name) { this.name = name; }
  speak() { return this.name + " makes a sound"; }
}
class Cat extends Animal {
  speak() { return super.speak() + " (meow)"; }
}
console.log(new Cat("Tom").speak());`, codeLang: "js",
      options: ["`Tom makes a sound (meow)`", "`Tom (meow)`", "`undefined makes a sound (meow)`", "A `ReferenceError`, because Cat has no constructor"],
      answer: [0],
      explanation: "`Cat` has no constructor, so it gets a default one that passes everything to `super(...args)`. `super.speak()` then runs `Animal`'s method with the same `this`.",
    },
    {
      id: "d2-11", domain: "d2", lesson: "d2-proto", level: "intermediate", type: "lines",
      prompt: "`new Child(1)` throws. Which line throws?",
      code: `class Base { constructor() { this.ready = true; } }
class Child extends Base {
  constructor(id) {
    this.id = id;
    super();
  }
}
new Child(1);`, codeLang: "js",
      answer: [4],
      explanation: "In a class that extends another, `this` doesn't exist until `super()` has returned. Line 4 uses `this` too early and throws a `ReferenceError`. Move `super()` above it.",
    },
    {
      id: "d2-12", domain: "d2", lesson: "d2-proto", level: "senior",
      prompt: "Which statements about `class` are true? (Choose two.)",
      options: [
        "Class bodies always run in strict mode",
        "Calling a class without `new` throws a `TypeError`",
        "Class declarations can be used before their line, like function declarations",
        "Methods are copied onto each instance when it's created",
      ],
      answer: [0, 1],
      explanation: "Classes always use strict mode and must be called with `new`. Class declarations are hoisted but stay in the temporal dead zone until their line, and methods live once on the prototype rather than on each instance.",
    },
    {
      id: "d2-13", domain: "d2", lesson: "d2-proto", level: "senior",
      prompt: "What does this print?",
      code: `function Car() {}
const c = new Car();
Car.prototype.wheels = 4;
console.log(c.wheels);
Car.prototype = { wheels: 3 };
console.log(c.wheels, new Car().wheels);`, codeLang: "js",
      options: ["`4` then `4 3`", "`undefined` then `3 3`", "`4` then `3 3`", "`undefined` then `4 3`"],
      answer: [0],
      explanation: "Adding a property to the prototype shows up on existing instances, so `c.wheels` is 4. Replacing `Car.prototype` with a new object only affects objects made afterwards. `c` still links to the old prototype.",
    },
    {
      id: "d2-14", domain: "d2", lesson: "d2-proto", level: "intermediate", type: "match",
      prompt: "Match each API with what it does.",
      pairs: [
        ["`Object.create(proto)`", "Makes a new object whose prototype is `proto`"],
        ["`Object.getPrototypeOf(x)`", "Reads the prototype of `x`"],
        ["`Object.hasOwn(x, k)`", "Checks that `k` is on `x` itself, not inherited"],
        ["`x instanceof C`", "Checks whether `C.prototype` is on `x`'s chain"],
      ],
      explanation: "These four cover most prototype questions. `Object.hasOwn` is the modern replacement for `x.hasOwnProperty(k)`, and it also works on objects made with `Object.create(null)`.",
    },
    {
      id: "d2-24", domain: "d2", lesson: "d2-proto", level: "staff",
      prompt: "A teammate's shared library adds `Array.prototype.last`. Why should you push back? (Choose two.)",
      options: [
        "It changes behaviour for every script in the page or process, including other libraries",
        "A future standard method with the same name could conflict, as `flatten` and `contains` once did",
        "Prototype methods are orders of magnitude slower than standalone functions",
        "It makes arrays non-iterable",
      ],
      answer: [0, 1],
      explanation: "Built-in prototypes are shared by everything in the page or process. Libraries that patched them once forced TC39 to rename new methods to `flat` and `includes`. A standalone helper or a wrapper avoids both problems. Speed and iteration aren't affected either way.",
    },
    // ── References and immutability ──
    {
      id: "d2-15", domain: "d2", lesson: "d2-refs", level: "junior",
      prompt: "What does this print?",
      code: `const a = { n: 1 };
const b = a;
b.n = 2;
const c = { ...a };
c.n = 3;
console.log(a.n, b.n, c.n);`, codeLang: "js",
      options: ["`2 2 3`", "`1 2 3`", "`3 3 3`", "`2 2 2`"],
      answer: [0],
      explanation: "`b = a` copies the reference, so changing `b.n` changes the one object both names point at. Spreading creates a new object, so changing `c` leaves `a` alone.",
    },
    {
      id: "d2-16", domain: "d2", lesson: "d2-refs", level: "intermediate",
      prompt: "What does this print?",
      code: `console.log({} === {}, [1] == [1], [1] == 1, "1,2" == [1, 2]);`, codeLang: "js",
      options: ["`false false true true`", "`false true true true`", "`true true true false`", "`false false false false`"],
      answer: [0],
      explanation: "Two separate objects are never equal, even with `==`. Comparing an object with a primitive converts the object first: `[1]` becomes \"1\" and then 1, and `[1, 2]` becomes \"1,2\".",
    },
    {
      id: "d2-17", domain: "d2", lesson: "d2-refs", level: "intermediate",
      prompt: "What does this print?",
      code: `const orig = { tags: ["a"], n: 1 };
const copy = { ...orig };
copy.tags.push("b");
copy.n = 2;
console.log(orig.tags.length, orig.n);`, codeLang: "js",
      options: ["`2 1`", "`1 1`", "`2 2`", "`1 2`"],
      answer: [0],
      explanation: "Spread makes a shallow copy. The number `n` is copied, but `tags` still points at the very same array. Pushing through the copy changes the original's array too.",
    },
    {
      id: "d2-18", domain: "d2", lesson: "d2-refs", level: "senior", type: "lines",
      prompt: "Which line throws a `TypeError`?",
      code: `"use strict";
const cfg = Object.freeze({ port: 80, db: { host: "x" } });
cfg.db.host = "y";
console.log(cfg.db.host);
cfg.port = 81;`, codeLang: "js",
      answer: [5],
      explanation: "`Object.freeze` only freezes the top level. The nested `db` object isn't frozen, so line 3 works and line 4 prints \"y\". Writing to the frozen `port` throws in strict mode. Outside strict mode it would fail silently.",
    },
    {
      id: "d2-19", domain: "d2", lesson: "d2-refs", level: "junior",
      prompt: "Which makes a deep copy of a plain data object with nested objects and arrays?",
      options: ["`structuredClone(obj)`", "`{ ...obj }`", "`Object.assign({}, obj)`", "`Object.freeze(obj)`"],
      answer: [0],
      explanation: "`structuredClone` copies nested data and also handles Dates, Maps, Sets and objects that refer to themselves. It can't clone functions. Spread and `Object.assign` only copy the top level, and `freeze` doesn't copy at all.",
    },
    {
      id: "d2-20", domain: "d2", lesson: "d2-refs", level: "junior", type: "lines",
      prompt: "This function should not change its input. Which line mutates it?",
      code: `function addTodo(list, todo) {
  list.push(todo);
  return list;
}
const before = [];
const after = addTodo(before, "x");
console.log(before === after); // true`, codeLang: "js",
      answer: [2],
      explanation: "`push` changes the caller's array, and the function hands back that same reference. Return `[...list, todo]` instead, so callers and any change detection that compares references see a new array.",
    },
    {
      id: "d2-21", domain: "d2", lesson: "d2-refs", level: "senior",
      prompt: "You need to cache computed data for objects you don't own, without keeping those objects alive after the rest of the app drops them. What should you use?",
      options: ["A `WeakMap` keyed by the objects", "A `Map` keyed by the objects", "A plain object keyed by `JSON.stringify(obj)`", "A property added directly to each object"],
      answer: [0],
      explanation: "A `WeakMap` holds its keys weakly: once nothing else refers to a key object, the entry can be cleaned up by the garbage collector. A `Map` keeps its keys alive. Stringified keys are slow and can collide, and adding properties changes objects you don't own.",
    },
    {
      id: "d2-22", domain: "d2", lesson: "d2-refs", level: "staff",
      prompt: "A large app state tree (thousands of nodes) is deep-cloned on every keystroke so that updates are immutable, and typing now lags. What's the best fix?",
      options: [
        "Use structural sharing: copy only the path from the root to the changed node and reuse untouched subtrees (by hand or with a library like Immer)",
        "Switch back to mutating the state in place and force a full re-render",
        "Debounce keystrokes by one second",
        "Use `JSON.parse(JSON.stringify(state))` on every single update, since it's much faster than `structuredClone` for large nested state",
      ],
      answer: [0],
      explanation: "Immutable updates don't need deep copies. Copying one path costs time in proportion to the depth of the tree, not its size. Untouched subtrees keep their identity, so memoized parts can skip work.",
    },
    {
      id: "d2-25", domain: "d2", lesson: "d2-refs", level: "staff",
      prompt: "A service polls a config endpoint and reloads when `newConfig !== currentConfig`. It reloads on every poll even when nothing changed. What's the cause and the best fix?",
      options: [
        "Each poll parses JSON into a new object, so `!==` compares identities. Compare a version, ETag, or content hash instead",
        "`!==` coerces types. Use `!=` instead",
        "The objects need `Object.freeze` before comparing",
        "Deep-compare every field on every poll with a recursive function, and skip it when nothing has changed",
      ],
      answer: [0],
      explanation: "Parsing JSON always produces brand-new objects, so `!==` is comparing identities that always differ. A version number or ETag is cheap to check and lets the server reply 304 Not Modified. A deep compare works, but it costs more and is easy to get wrong on large configs.",
    },
  ],

  cards: [
    { id: "c2-bind", domain: "d2", kind: "service", term: "Function.prototype.bind", definition: "Returns a new function with `this`, and any leading arguments, fixed in place. It can't be bound again." },
    { id: "c2-call", domain: "d2", kind: "service", term: "call / apply", definition: "Runs a function straight away with the `this` you choose. `call` takes the arguments one by one, `apply` takes them as an array." },
    { id: "c2-create", domain: "d2", kind: "service", term: "Object.create", definition: "Creates an object with the prototype you pass in. For example, `Object.create(null)` gives a bare dictionary with no inherited keys." },
    { id: "c2-freeze", domain: "d2", kind: "service", term: "Object.freeze", definition: "Makes an object's own properties read-only and stops new ones being added. It only affects the top level." },
    { id: "c2-clone", domain: "d2", kind: "service", term: "structuredClone", definition: "Makes a deep copy of data, including Maps, Sets, Dates and self-references. It can't copy functions." },
    { id: "c2-hasown", domain: "d2", kind: "service", term: "Object.hasOwn", definition: "True if the key is on the object itself, not inherited. Safer than `obj.hasOwnProperty`." },
    { id: "c2-weakmap", domain: "d2", kind: "service", term: "WeakMap", definition: "A map whose object keys are held weakly, so an entry disappears once its key object is garbage-collected." },
    { id: "c2-instanceof", domain: "d2", kind: "service", term: "instanceof", definition: "Checks whether `C.prototype` appears anywhere on an object's prototype chain." },
    { id: "c2-this", domain: "d2", kind: "concept", term: "this binding rules", definition: "From strongest to weakest: `new`, then explicit binding with `call`, `apply` or `bind`, then `obj.fn()`, then the default, which is `undefined` in strict mode." },
    { id: "c2-arrow", domain: "d2", kind: "concept", term: "Lexical this", definition: "Arrow functions have no `this` of their own. They use the one from the surrounding code." },
    { id: "c2-chain", domain: "d2", kind: "concept", term: "Prototype chain", definition: "The series of linked prototype objects that a property lookup walks through until it reaches `null`." },
    { id: "c2-super", domain: "d2", kind: "concept", term: "super()", definition: "Calls the parent class's constructor. You must call it before using `this` in a class that extends another." },
    { id: "c2-shallow", domain: "d2", kind: "concept", term: "Shallow copy", definition: "A new outer object whose nested objects are still shared with the original." },
    { id: "c2-sharing", domain: "d2", kind: "concept", term: "Structural sharing", definition: "An immutable update that copies only the path that changed and reuses every untouched part." },
  ],

  challenges: [
    {
      id: "ch-js-this-binder",
      domain: "d2",
      lesson: "d2-this",
      title: "Bind them all",
      goal: "Predict this correctly for all seven call sites, then run them.",
      hint: "Ignore where greet was written. Look at each call: is there a dot, a call or bind, or nothing at all?",
      takeaway: "How a function is called decides what this is, and bind beats everything except new.",
      render: (onSolved) => <ThisBinderLab goal="all" onSolved={onSolved} />,
    },
  ],
});
