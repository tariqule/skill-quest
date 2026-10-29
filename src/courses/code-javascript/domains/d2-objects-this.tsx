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
    summary: "How `this` is decided, call/apply/bind, arrow functions, the prototype chain, classes, references, copies, and immutability.",
  },

  tasks: [
    { id: "2.1", title: "this and binding", covers: ["The four binding rules and their priority", "call, apply, and bind", "Arrow functions and lexical this", "Lost this in callbacks"] },
    { id: "2.2", title: "Prototypes and classes", covers: ["The prototype chain and property lookup", "Constructor functions and new", "class, extends, super, static", "Own vs inherited properties"] },
    { id: "2.3", title: "References, equality, and immutability", covers: ["Objects are compared and passed by reference", "Shallow vs deep copies", "Object.freeze and const", "Immutable update patterns"] },
  ],

  lessons: [
    {
      id: "d2-this",
      level: "intermediate",
      check: ["d2-01", "d2-03"],
      task: "2.1",
      title: "Who is this? Ask how it was called",
      visual: <ThisBinderLab />,
      points: [
        "this is decided by the call site, not by where the function was written.",
        "obj.method() sets this to obj. Pull the method off (const f = obj.method) and a plain f() loses it.",
        "In strict mode (modules, classes) a plain call gets this === undefined; sloppy scripts fall back to globalThis.",
        "Arrow functions have no this of their own: they use the enclosing scope's.",
      ],
      tip: "When a callback logs undefined, say \"the method was detached from its object\" and offer bind or an arrow wrapper.",
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
              { icon: "🆕", label: "new", sub: "Fresh object, linked to the prototype" },
              { icon: "📌", label: "call / apply / bind", sub: "Explicit this; bind can't be undone" },
              { icon: "🔘", label: "obj.method()", sub: "Object before the dot" },
              { icon: "🕳️", label: "plain fn()", sub: "undefined (strict) or globalThis" },
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
        "Priority from strongest: new → explicit (call/apply/bind) → implicit (obj.method()) → default.",
        "call and apply invoke immediately; bind returns a new function with this (and optional leading args) locked.",
        "Binding an already-bound function again does nothing to this.",
        "Arrow functions ignore all four rules, and you can't new them.",
      ],
      tip: "Interviewers often ask you to implement bind. Use a closure: return (...more) => fn.apply(ctx, [...args, ...more]).",
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
        "Every object has a hidden [[Prototype]] link. Property lookups walk up the chain until they hit null.",
        "Methods live once on the prototype and are shared by every instance.",
        "class is mostly syntax over the same mechanism, plus strict mode, a TDZ, and a TypeError if called without new.",
        "In a derived class, call super() before touching this.",
      ],
      tip: "Draw the chain: instance → Class.prototype → Parent.prototype → Object.prototype → null. It answers most prototype questions.",
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
              { icon: "🔗", title: "Assignment", text: "b = a copies the reference. Both names point at one object.", color: "#f87171" },
              { icon: "🪞", title: "Shallow copy", text: "{ ...a }, Object.assign, slice: new outer object, shared nested ones.", color: "#fbbf24" },
              { icon: "🧬", title: "Deep copy", text: "structuredClone(a): copies nested data too (no functions).", color: "#34d399" },
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
        "Objects are compared by reference: {} === {} is false.",
        "const stops reassignment of the variable, not mutation of the object.",
        "Object.freeze is shallow: nested objects can still change. Writes to frozen props throw in strict mode.",
        "Immutable updates create new objects along the changed path and reuse everything else (structural sharing).",
      ],
      tip: "Link immutability to real frameworks: React and Redux detect changes with reference checks, so mutation means missed updates.",
    },
  ],

  questions: [
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
      options: ["A `TypeError` is thrown and nothing is printed", "`Ada Ada`", "`Ada undefined`", "`Ada` is printed, then a `TypeError`"],
      answer: [0],
      explanation: "All arguments are evaluated before console.log runs. `hi()` is a plain call, so `this` is undefined in strict mode, and `undefined.name` throws a TypeError before anything prints.",
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
      explanation: "The arrow function uses the `this` of start(), which is timer. The regular function gets its own `this` from setTimeout (the global object in browsers, a Timeout object in Node), neither of which has `seconds`.",
    },
    {
      id: "d2-03", domain: "d2", lesson: "d2-this", level: "junior",
      prompt: "Inside a regular method called as `cart.total()`, what is `this`?",
      options: ["`cart`", "The global object", "`undefined`", "The `total` function itself"],
      answer: [0],
      explanation: "Implicit binding: when a function is called as a property of an object, `this` is that object.",
    },
    {
      id: "d2-08", domain: "d2", lesson: "d2-this", level: "junior",
      prompt: "Why does an arrow function work as a `setTimeout` callback inside a method, when a regular function loses `this`?",
      options: [
        "Arrow functions don't have their own `this`, so they use the `this` of the surrounding method",
        "Arrow functions are automatically bound to the object they're defined in",
        "setTimeout calls arrow functions with the original object as `this`",
        "Arrow functions run synchronously",
      ],
      answer: [0],
      explanation: "Arrows close over `this` lexically, like any other variable. They aren't bound to an object: an arrow defined directly in an object literal does not get that object as `this`.",
    },
    {
      id: "d2-23", domain: "d2", lesson: "d2-this", level: "staff",
      prompt: "A shared UI library exposes class instances whose methods consumers pass straight to event handlers, and teams keep hitting `this is undefined` bugs. Which API design best removes this class of bug?",
      options: [
        "Expose functions that don't depend on `this` (closures, or arrow-function class fields) so they're safe to pass around",
        "Document that callers must always call `.bind(instance)`",
        "Compile the library in sloppy mode so `this` falls back to `window`",
        "Wrap every method body in try/catch and log the error",
      ],
      answer: [0],
      explanation: "If detaching a function is safe by construction, the bug can't happen. Documentation relies on every consumer remembering, sloppy mode just hides the bug behind the wrong object, and try/catch only reports it.",
    },
    // ── Binding ──
    {
      id: "d2-04", domain: "d2", lesson: "d2-bind", level: "intermediate", type: "match",
      prompt: "Match each call with what it does.",
      pairs: [
        ["`fn.call(obj, a, b)`", "Calls now with `this = obj`, arguments listed"],
        ["`fn.apply(obj, [a, b])`", "Calls now with `this = obj`, arguments as an array"],
        ["`fn.bind(obj, a)`", "Returns a new function with `this` and the first argument fixed"],
        ["`new Fn()`", "Creates an object linked to `Fn.prototype` and uses it as `this`"],
      ],
      explanation: "call and apply differ only in how arguments are passed. bind doesn't call anything; it returns a bound function. new creates the object that becomes `this`.",
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
      explanation: "A bound function's `this` is fixed forever. Binding it again creates a wrapper, but the inner bound function still calls `who` with { name: \"A\" }.",
    },
    {
      id: "d2-06", domain: "d2", lesson: "d2-bind", level: "senior", type: "order",
      prompt: "Order the `this` binding rules from highest to lowest priority.",
      items: ["`new` binding", "Explicit binding (`call`, `apply`, `bind`)", "Implicit binding (`obj.method()`)", "Default binding (`undefined` in strict mode)"],
      explanation: "`new` on a bound function ignores the bound `this`, explicit beats implicit (`obj.fn.call(other)` uses other), and the default only applies when nothing else does. Arrow functions sit outside this ladder.",
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
      explanation: "Passing `this.tick` detaches the method, so it isn't called on the Clock. Use `setInterval(() => this.tick(), 1000)` or `this.tick.bind(this)`.",
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
      explanation: "`speak` lives on Dog.prototype, not on d, so hasOwnProperty is false. The `in` operator checks the whole prototype chain, so it's true.",
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
      explanation: "Cat has no constructor, so it gets a default one that calls super(...args). `super.speak()` runs Animal's method with the same `this`.",
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
      explanation: "In a derived class, `this` doesn't exist until `super()` returns. Line 4 throws a ReferenceError. Move `super()` above it.",
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
      explanation: "Classes are strict and must be called with new. Class declarations are hoisted but sit in the TDZ, and methods live once on the prototype.",
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
      explanation: "Adding to the prototype is visible to existing instances, so c.wheels is 4. Replacing Car.prototype only affects objects created afterwards; c still links to the old prototype.",
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
      explanation: "These four cover most prototype questions. `Object.hasOwn` is the modern replacement for `x.hasOwnProperty(k)`, and it works on objects created with Object.create(null).",
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
      explanation: "Built-in prototypes are global shared state. Libraries that patched them forced TC39 to rename new methods (`flat`, `includes`). A standalone helper or a wrapper avoids both problems; performance and iteration are unaffected.",
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
      explanation: "`b = a` copies the reference, so writing through b changes a. Spreading creates a new object, so changing c doesn't affect a.",
    },
    {
      id: "d2-16", domain: "d2", lesson: "d2-refs", level: "intermediate",
      prompt: "What does this print?",
      code: `console.log({} === {}, [1] == [1], [1] == 1, "1,2" == [1, 2]);`, codeLang: "js",
      options: ["`false false true true`", "`false true true true`", "`true true true false`", "`false false false false`"],
      answer: [0],
      explanation: "Two different objects are never equal, even with `==`. Comparing an object with a primitive converts the object: [1] becomes \"1\" then 1, and [1, 2] becomes \"1,2\".",
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
      explanation: "Spread makes a shallow copy: `n` is copied, but `tags` still points at the same array. Pushing through the copy changes the original's array.",
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
      explanation: "`Object.freeze` is shallow: the nested db object isn't frozen, so line 3 works and line 4 prints \"y\". Writing to the frozen `port` throws in strict mode (in sloppy mode it fails silently).",
    },
    {
      id: "d2-19", domain: "d2", lesson: "d2-refs", level: "junior",
      prompt: "Which makes a deep copy of a plain data object with nested objects and arrays?",
      options: ["`structuredClone(obj)`", "`{ ...obj }`", "`Object.assign({}, obj)`", "`Object.freeze(obj)`"],
      answer: [0],
      explanation: "`structuredClone` copies nested data (and handles Dates, Maps, Sets, and cycles), though it can't clone functions. Spread and Object.assign are shallow; freeze doesn't copy at all.",
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
      explanation: "`push` mutates the caller's array, and the same reference is returned. Return `[...list, todo]` instead so callers (and reference-based change detection) see a new array.",
    },
    {
      id: "d2-21", domain: "d2", lesson: "d2-refs", level: "senior",
      prompt: "You need to cache computed data for objects you don't own, without keeping those objects alive after the rest of the app drops them. What should you use?",
      options: ["A `WeakMap` keyed by the objects", "A `Map` keyed by the objects", "A plain object keyed by `JSON.stringify(obj)`", "A property added directly to each object"],
      answer: [0],
      explanation: "WeakMap keys are held weakly: once nothing else references the key object, the entry can be garbage-collected. A Map keeps keys alive; stringified keys are slow and collide; adding properties mutates objects you don't own.",
    },
    {
      id: "d2-22", domain: "d2", lesson: "d2-refs", level: "staff",
      prompt: "A large app state tree (thousands of nodes) is deep-cloned on every keystroke so that updates are immutable, and typing now lags. What's the best fix?",
      options: [
        "Use structural sharing: copy only the path from the root to the changed node and reuse untouched subtrees (by hand or with a library like Immer)",
        "Switch back to mutating the state in place and force a full re-render",
        "Debounce keystrokes by one second",
        "Use `JSON.parse(JSON.stringify(state))`, which is faster than structuredClone",
      ],
      answer: [0],
      explanation: "Immutability doesn't require deep copies. Copying one path is O(depth) and keeps reference checks cheap: unchanged subtrees keep their identity, so memoized parts can skip work.",
    },
    {
      id: "d2-25", domain: "d2", lesson: "d2-refs", level: "staff",
      prompt: "A service polls a config endpoint and reloads when `newConfig !== currentConfig`. It reloads on every poll even when nothing changed. What's the cause and the best fix?",
      options: [
        "Each poll parses JSON into a new object, so `!==` compares identities. Compare a version, ETag, or content hash instead",
        "`!==` coerces types. Use `!=` instead",
        "The objects need `Object.freeze` before comparing",
        "Deep-compare every field on every poll with a recursive function",
      ],
      answer: [0],
      explanation: "Freshly parsed objects are always new references. A version or ETag check is cheap and lets the server answer 304 Not Modified. A deep compare works but costs more and is easy to get wrong for large configs.",
    },
  ],

  cards: [
    { id: "c2-bind", domain: "d2", kind: "service", term: "Function.prototype.bind", definition: "Returns a new function with this (and leading args) fixed. Can't be re-bound." },
    { id: "c2-call", domain: "d2", kind: "service", term: "call / apply", definition: "Invoke a function now with an explicit this. call takes args one by one, apply takes an array." },
    { id: "c2-create", domain: "d2", kind: "service", term: "Object.create", definition: "Creates an object with the given prototype, e.g. Object.create(null) for a bare dictionary." },
    { id: "c2-freeze", domain: "d2", kind: "service", term: "Object.freeze", definition: "Makes an object's own properties read-only and non-extensible. Shallow." },
    { id: "c2-clone", domain: "d2", kind: "service", term: "structuredClone", definition: "Deep-copies data, including Maps, Sets, Dates, and cycles. Can't copy functions." },
    { id: "c2-hasown", domain: "d2", kind: "service", term: "Object.hasOwn", definition: "True if the key is an own property, not inherited. Safer than obj.hasOwnProperty." },
    { id: "c2-weakmap", domain: "d2", kind: "service", term: "WeakMap", definition: "Map with object keys held weakly, so entries vanish when the key is garbage-collected." },
    { id: "c2-instanceof", domain: "d2", kind: "service", term: "instanceof", definition: "Checks whether C.prototype appears anywhere on an object's prototype chain." },
    { id: "c2-this", domain: "d2", kind: "concept", term: "this binding rules", definition: "new → explicit (call/apply/bind) → implicit (obj.fn()) → default (undefined in strict mode)." },
    { id: "c2-arrow", domain: "d2", kind: "concept", term: "Lexical this", definition: "Arrow functions have no own this; they use the enclosing scope's." },
    { id: "c2-chain", domain: "d2", kind: "concept", term: "Prototype chain", definition: "Linked [[Prototype]] objects that property lookups walk until they reach null." },
    { id: "c2-super", domain: "d2", kind: "concept", term: "super()", definition: "Calls the parent constructor. Required before using this in a derived class." },
    { id: "c2-shallow", domain: "d2", kind: "concept", term: "Shallow copy", definition: "A new outer object whose nested objects are still shared with the original." },
    { id: "c2-sharing", domain: "d2", kind: "concept", term: "Structural sharing", definition: "Immutable update that copies only the changed path and reuses unchanged subtrees." },
  ],

  challenges: [
    {
      id: "ch-js-this-binder",
      domain: "d2",
      lesson: "d2-this",
      title: "Bind them all",
      goal: "Predict this correctly for all seven call sites, then run them.",
      hint: "Ignore where greet was written. Look at each call: is there a dot, a call/bind, or nothing?",
      takeaway: "The call site decides this, and bind beats everything except new.",
      render: (onSolved) => <ThisBinderLab goal="all" onSolved={onSolved} />,
    },
  ],
});
