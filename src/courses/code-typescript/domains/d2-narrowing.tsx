import { CodeBlock, CodeCompare, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { NarrowingLab } from "../labs";

/** Module 2: unions, narrowing, discriminated unions, predicates, and assertion functions. */
export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "Unions & Narrowing",
    world: "The Narrowing Narrows",
    weight: 30,
    emoji: "🌊",
    color: "#22d3ee",
    summary: "Values that can be one of several types, and the checks that tell TypeScript which one you have: typeof, in, instanceof, equality, discriminated unions, exhaustiveness, type predicates and assertion functions.",
  },

  tasks: [
    { id: "2.1", title: "Unions and narrowing operators", covers: ["What you can do with a union before narrowing", "typeof, truthiness, equality, in, instanceof, Array.isArray", "Control-flow analysis and where it stops"] },
    { id: "2.2", title: "Discriminated unions and exhaustiveness", covers: ["Discriminant properties", "switch on kind", "assertNever and never-based exhaustiveness", "Modelling states as unions"] },
    { id: "2.3", title: "Type predicates and assertion functions", covers: ["`x is T` predicates and filter", "Inferred type predicates (TypeScript 5.5)", "`asserts x is T`", "Runtime validation at boundaries"] },
  ],

  lessons: [
    // ── Start here ──
    {
      id: "d2-b-either",
      level: "beginner",
      check: ["ts-b2-01", "ts-b2-02"],
      task: "2.1",
      title: "A value that can be one of a few things",
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🔢", title: "string | number", text: "An ID that might be 42 or \"A-42\". Either is allowed.", color: "#22d3ee" },
            { icon: "📏", title: "\"small\" | \"large\"", text: "A size that can only be one of these two exact words.", color: "#a78bfa" },
            { icon: "🕳️", title: "string | undefined", text: "A name that might not have been filled in yet.", color: "#fbbf24" },
            { icon: "🚫", title: "Anything else", text: "TypeScript rejects it, for example the size \"huge\".", color: "#f87171" },
          ]}
        />
      ),
      points: [
        "Sometimes a value can be one of a few kinds. A parking space might take a car or a motorbike, but not a bus.",
        "In TypeScript you write that with a bar: `string | number`. Read the bar as \"or\". This is called a union type.",
        "You can also list exact values, like `\"small\" | \"large\"`. Then only those words are allowed.",
      ],
      tip: "Unions of exact words are a simple way to stop typos. If you write \"smal\", TypeScript catches it.",
    },
    {
      id: "d2-b-check",
      level: "beginner",
      check: ["ts-b2-03", "ts-b2-04"],
      task: "2.1",
      title: "Check what you have before you use it",
      visual: (
        <CodeBlock
          lang="ts"
          code={`function describe(x: string | number) {
  if (typeof x === "number") {
    return x * 2;            // here x is a number
  }
  return x.toUpperCase();    // here x is a string
}

describe(4);      // 8
describe("hi");   // "HI"`}
        />
      ),
      points: [
        "When a value could be a number or a string, TypeScript only lets you do things that work on both.",
        "So you check first. `typeof x` gives you the kind of value as text, such as \"number\" or \"string\".",
        "Inside `if (typeof x === \"number\")`, TypeScript knows `x` is a number. Below that `if`, it knows the rest must be strings.",
        "This is called narrowing. It's like checking whether a delivery is a letter or a parcel before you open it.",
      ],
      tip: "If TypeScript says a property doesn't exist on a union, ask yourself which kind of value is missing it, then add a check.",
    },

    // ── Junior and up ──
    {
      id: "d2-unions",
      level: "junior",
      check: ["d2-01", "d2-02"],
      task: "2.1",
      title: "Unions: one of several types",
      sources: [{ title: "TS Handbook: Everyday Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html", license: "Official docs (link only)" }],
      visual: (
        <CodeBlock
          lang="ts"
          code={`function pad(value: string | number) {
  value.toString();          // ok: exists on both members
  // value.toUpperCase();    // error: not on number
  if (typeof value === "number") {
    return " ".repeat(value); // value: number
  }
  return value;               // value: string
}`}
        />
      ),
      points: [
        "A union `A | B` accepts a value of either type. Until you narrow it, you can only use the members both types share.",
        "Narrowing is a check the compiler understands. Inside the branch, the type is smaller.",
        "Literal unions like `\"sm\" | \"md\" | \"lg\"` are a light alternative to enums, and they disappear when compiled.",
        "Besides `typeof`, you can narrow with `x instanceof Date` (is the class's prototype on the chain?), the `in` operator (`\"email\" in x` checks for a property key), and `Array.isArray(x)`.",
      ],
      tip: "When someone asks why a line doesn't compile, point at the member of the union that's missing the property.",
    },
    {
      id: "d2-narrowing",
      level: "intermediate",
      check: ["d2-03", "d2-05"],
      task: "2.1",
      title: "Narrowing step by step",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🏷️", title: "typeof", text: "For primitives. Careful: \"object\" includes null!", color: "#22d3ee" },
              { icon: "🔑", title: "in", text: "Does the object have this key?", color: "#a78bfa" },
              { icon: "🏭", title: "instanceof", text: "For class instances, like Error in a catch block", color: "#f472b6" },
              { icon: "⚖️", title: "=== and !==", text: "For literals and null. a === b narrows both sides", color: "#fbbf24" },
              { icon: "💡", title: "Truthiness", text: "Removes null and undefined, but also treats 0 and \"\" as missing", color: "#34d399" },
              { icon: "📚", title: "Array.isArray", text: "Separates arrays from everything else", color: "#38bdf8" },
            ]}
          />
          <NarrowingLab />
        </div>
      ),
      points: [
        "`typeof x === \"object\"` still lets `null` through, because `typeof null` is \"object\". Check `x !== null` as well.",
        "`\"key\" in x` only works when `x` is an object. It can't be a primitive or possibly `null`.",
        "Under `strict`, the variable in `catch (err)` is `unknown`, since anything can be thrown. Narrow it with `err instanceof Error`.",
        "When you narrow a property like `obj.prop`, a callback that runs later doesn't keep that narrowing. Copy it into a `const` first.",
      ],
      tip: "Say which check you'd use and why. \"typeof for primitives, in or a discriminant for objects\" is the pattern interviewers listen for.",
    },
    {
      id: "d2-discriminated",
      level: "intermediate",
      check: ["d2-07", "d2-09"],
      task: "2.2",
      title: "Discriminated unions and exhaustiveness",
      sources: [{ title: "TS Handbook: Narrowing", url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html", license: "Official docs (link only)" }],
      visual: (
        <CodeBlock
          lang="ts"
          code={`type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };

function assertNever(x: never): never {
  throw new Error("Unhandled: " + JSON.stringify(x));
}

function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.radius ** 2; // s: circle
    case "square": return s.size ** 2;             // s: square
    default: return assertNever(s);  // add a member and this line errors
  }
}`}
        />
      ),
      points: [
        "Give every member of the union a shared property with a different literal value, like `kind`, `type` or `status`. Checking it narrows to exactly one member.",
        "If every member is handled, the value left in the `default` branch is `never`. Pass it to `assertNever`, and adding a new member becomes a compile error there.",
        "Model states as a union, like loading, error and success, so combinations that make no sense can't be written at all.",
        "Optional properties like `error?: Error; data?: T` allow impossible combinations. A discriminated union, one member per `status`, makes each state carry exactly the fields it needs.",
      ],
      tip: "Offer the `assertNever` pattern without being asked when you switch over a union. It shows you've done this in real code.",
    },
    {
      id: "d2-predicates",
      level: "senior",
      check: ["d2-10", "d2-12"],
      task: "2.3",
      title: "Type predicates and assertion functions",
      sources: [{ title: "TS Handbook: Narrowing", url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html", license: "Official docs (link only)" }],
      visual: (
        <CodeCompare
          lang="ts"
          left={{ title: "Type predicate: narrows in if / filter", code: `function isString(x: unknown): x is string {
  return typeof x === "string";
}
const strs = items.filter(isString); // string[]` }}
          right={{ title: "Assertion function: narrows after the call", code: `function assertDefined<T>(v: T): asserts v is NonNullable<T> {
  if (v == null) throw new Error("missing");
}
assertDefined(user);
user.name; // user is non-null from here on` }}
        />
      ),
      points: [
        "A predicate like `(x): x is T` promises callers that a `true` result means `x` is a `T`. The compiler doesn't check that the body is right.",
        "Since TypeScript 5.5, simple arrow callbacks like `x => x != null` are inferred as predicates, so `filter` narrows on its own.",
        "An assertion function, written `asserts x is T`, throws when the check fails. If it returns, `x` is narrowed for the rest of the scope.",
        "Where untrusted data comes in, such as JSON, queues or forms, build predicates from a runtime schema instead of writing partial checks by hand.",
        "An assertion function returns `asserts v is NonNullable<T>`, a generic type that removes `null` and `undefined`. If the call returns normally, `v` is non-nullable for the rest of the scope; otherwise it throws.",
      ],
      tip: "Point out that a wrong predicate is worse than none. It makes the compiler confidently wrong.",
    },
  ],

  questions: [
    // ── Start here ──
    {
      id: "ts-b2-01", domain: "d2", lesson: "d2-b-either", level: "beginner", type: "fill",
      prompt: "Fill the gap so `id` can hold either a string or a number.",
      code: `let id: string {{1}} number = 42;
id = "A-42";`, codeLang: "ts",
      blanks: [{ options: ["|", "&", "or", "+"], answer: 0 }],
      explanation: "The bar `|` makes a union, so `string | number` means \"a string or a number\". `&` means both at once, which no value can be here. TypeScript doesn't use the word `or` or a `+` between types.",
    },
    {
      id: "ts-b2-02", domain: "d2", lesson: "d2-b-either", level: "beginner",
      prompt: "`size` has the type `\"small\" | \"large\"`. Which assignment does TypeScript reject?",
      options: ["`size = \"medium\";`", "`size = \"small\";`", "`size = \"large\";`"],
      answer: [0],
      explanation: "This union lists exactly two allowed words, \"small\" and \"large\". \"medium\" isn't on the list, so TypeScript reports an error. That's how a union of words catches typos and made-up values.",
    },
    {
      id: "ts-b2-03", domain: "d2", lesson: "d2-b-check", level: "beginner", type: "output",
      prompt: "What does this print?",
      code: `function describe(x: string | number) {
  if (typeof x === "number") {
    return "a number";
  }
  return "some text";
}
console.log(describe(7));`, codeLang: "ts",
      answers: ["a number"],
      explanation: "`7` is a number, so `typeof x` is \"number\" and the `if` branch runs. The function returns \"a number\" straight away and never reaches the last line.",
    },
    {
      id: "ts-b2-04", domain: "d2", lesson: "d2-b-check", level: "beginner",
      prompt: "`x` is a `string | number`. Inside `if (typeof x === \"string\") { ... }`, what does TypeScript know about `x`?",
      options: [
        "It's a string, so string methods like `toUpperCase()` are allowed",
        "It's still `string | number`, so nothing at all has changed",
        "It's a number",
        "It's `undefined`",
      ],
      answer: [0],
      explanation: "TypeScript reads your `typeof` check and narrows the type inside the `if`. There `x` can only be a string, so you can use string methods on it. Outside the `if`, it goes back to being either kind.",
    },
    {
      id: "ts-b2-05", domain: "d2", lesson: "d2-b-check", level: "beginner", type: "output",
      prompt: "What does this print?",
      code: `const value: string | number = "hello";
console.log(typeof value);`, codeLang: "ts",
      answers: ["string"],
      explanation: "`typeof` gives you the kind of value as a word. \"hello\" is text, so it prints string. For 42 it would print number.",
    },

    // ── Unions ──
    {
      id: "d2-01", domain: "d2", lesson: "d2-unions", level: "junior", type: "lines",
      prompt: "Which line is a type error?",
      code: `function format(value: string | number) {
  if (typeof value === "number") {
    return value.toFixed(2);
  }
  return value.toFixed(2);
}`, codeLang: "ts",
      answer: [5],
      explanation: "The `if` returns for numbers, so after it `value` can only be a string, and strings have no `toFixed`. TypeScript reports \"Property 'toFixed' does not exist on type 'string'\".",
    },
    {
      id: "d2-02", domain: "d2", lesson: "d2-unions", level: "junior",
      prompt: "`value` has type `string | number`. Which member access compiles without any narrowing?",
      options: ["`value.toString()`", "`value.toUpperCase()`", "`value.toFixed()`", "`value.length`"],
      answer: [0],
      explanation: "Before you narrow, you can only use members that exist on every type in the union. Both strings and numbers have `toString`. The other three only exist on one of them.",
    },
    {
      id: "d2-23", domain: "d2", lesson: "d2-unions", level: "junior", type: "lines",
      prompt: "Which line is a type error?",
      code: `type Size = "sm" | "md" | "lg";
let s: Size = "md";
s = "lg";
s = "xl";`, codeLang: "ts",
      answer: [4],
      explanation: "A literal union only accepts the values it lists. \"xl\" isn't one of them, so TypeScript reports: Type '\"xl\"' is not assignable to type 'Size'.",
    },
    {
      id: "d2-15", domain: "d2", lesson: "d2-unions", level: "junior", type: "match",
      prompt: "Match each narrowing check with what it tests.",
      pairs: [
        ["`typeof x === \"string\"`", "A primitive type tag"],
        ["`x instanceof Date`", "Whether a class's prototype is on the chain"],
        ["`\"email\" in x`", "Whether an object has a property key"],
        ["`Array.isArray(x)`", "Whether the value is an array"],
        ["`x.kind === \"circle\"`", "A discriminant literal on a union member"],
      ],
      explanation: "TypeScript's control-flow analysis understands every one of these checks. Inside the branch where the check is true, the type is narrowed to match.",
    },
    // ── Narrowing ──
    {
      id: "d2-03", domain: "d2", lesson: "d2-narrowing", level: "intermediate",
      prompt: "Inside the if block, what is the type of `x`?",
      code: `function f(x: string[] | null | number) {
  if (typeof x === "object") {
    x;
  }
}`, codeLang: "ts",
      options: ["`string[] | null`", "`string[]`", "`object`", "`string[] | number`"],
      answer: [0],
      explanation: "In JavaScript, `typeof null` is \"object\", and TypeScript models that faithfully, so `null` survives the check. Add `&& x !== null` to get just `string[]`.",
    },
    {
      id: "d2-04", domain: "d2", lesson: "d2-narrowing", level: "intermediate", type: "lines",
      prompt: "This compiles, but `show(0)` returns \"no data\". Which line is the bug?",
      code: `function show(count: number | undefined) {
  if (!count) {
    return "no data";
  }
  return "count: " + count;
}`, codeLang: "ts",
      answer: [2],
      explanation: "A truthiness check removes `undefined`, but it also treats 0 as missing. When 0 is a real value, check `count === undefined` or `count == null` instead.",
    },
    {
      id: "d2-05", domain: "d2", lesson: "d2-narrowing", level: "intermediate",
      prompt: "What is the type of `a` on line 5?",
      code: `type Fish = { swim(): void };
type Bird = { fly(): void };
function move(a: Fish | Bird) {
  if ("swim" in a) return a.swim();
  return a.fly();
}`, codeLang: "ts",
      options: ["`Bird`", "`Fish | Bird`", "`Fish`", "`never`"],
      answer: [0],
      explanation: "The `in` check narrows `a` to `Fish` in the true branch. That branch returns, so the code after it only runs when `a` is a `Bird`.",
    },
    {
      id: "d2-06", domain: "d2", lesson: "d2-narrowing", level: "intermediate", type: "lines",
      prompt: "With `strict: true`, which line is a type error?",
      code: `declare function risky(): void;
try {
  risky();
} catch (err) {
  console.log(err.message);
}`, codeLang: "ts",
      answer: [5],
      explanation: "`strict` turns on `useUnknownInCatchVariables`, so `err` is `unknown`, because anything can be thrown. Narrow it first: `if (err instanceof Error) console.log(err.message)`.",
    },
    {
      id: "d2-24", domain: "d2", lesson: "d2-narrowing", level: "junior",
      prompt: "What is the return type of `first`?",
      code: `function first(x: string | string[]) {
  return Array.isArray(x) ? x[0] : x;
}`, codeLang: "ts",
      options: ["`string`", "`string | string[]`", "`string[]`", "`any`"],
      answer: [0],
      explanation: "`Array.isArray` narrows `x` to `string[]` in the true branch, so `x[0]` is a string. In the false branch `x` is a string. Both sides give a string.",
    },
    {
      id: "d2-14", domain: "d2", lesson: "d2-narrowing", level: "senior",
      prompt: "Inside the if block, what is the type of `a`?",
      code: `function f(a: string | number, b: string | boolean) {
  if (a === b) {
    a;
  }
}`, codeLang: "ts",
      options: ["`string`", "`string | number`", "`never`", "`string | number | boolean`"],
      answer: [0],
      explanation: "An equality check narrows both sides to what they could have in common. The only type `a` and `b` share is `string`, so both become `string` inside the block.",
    },
    {
      id: "d2-16", domain: "d2", lesson: "d2-narrowing", level: "senior", type: "lines",
      prompt: "Which line is a type error?",
      code: `function greetLater(user: { name?: string }) {
  if (user.name) {
    console.log(user.name.toUpperCase());
    setTimeout(() => console.log(user.name.toUpperCase()), 0);
  }
}`, codeLang: "ts",
      answer: [4],
      explanation: "Narrowing a property doesn't carry into a callback, because the property could change before the callback runs. Line 3 is fine. To fix line 4, write `const name = user.name` inside the `if` and use `name` in the arrow.",
    },
    {
      id: "d2-18", domain: "d2", lesson: "d2-narrowing", level: "intermediate", type: "order",
      prompt: "`x` is `unknown`. Order the steps so each one compiles and you can finally call `x.id.toUpperCase()`.",
      items: [
        "`if (typeof x === \"object\" && x !== null)`",
        "`if (\"id\" in x)`",
        "`if (typeof x.id === \"string\")`",
        "`x.id.toUpperCase();`",
      ],
      explanation: "`in` needs a non-null object on its right. You can only read `x.id` once `in` has shown the key exists. Then `typeof` narrows that property to a string.",
    },
    // ── Discriminated unions ──
    {
      id: "d2-07", domain: "d2", lesson: "d2-discriminated", level: "intermediate", type: "lines",
      prompt: "Which line is a type error?",
      code: `type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };
function area(s: Shape) {
  switch (s.kind) {
    case "circle": return Math.PI * s.radius ** 2;
    case "square": return s.radius ** 2;
  }
}`, codeLang: "ts",
      answer: [7],
      explanation: "In the \"square\" case, `s` is narrowed to the square member, which has `size`, not `radius`. Checking `kind` is exactly what lets TypeScript catch this.",
    },
    {
      id: "d2-09", domain: "d2", lesson: "d2-discriminated", level: "junior",
      prompt: "What makes a union a discriminated union?",
      options: [
        "Every member has a common property whose type is a distinct literal, like `kind: \"circle\"`",
        "Every member is a class",
        "The union has exactly two members",
        "The union is declared with `enum`, and each member has its own type name the compiler can switch on at runtime",
      ],
      answer: [0],
      explanation: "The shared property with a different literal on each member is called the discriminant. One comparison against it narrows the value to exactly one member.",
    },
    {
      id: "d2-08", domain: "d2", lesson: "d2-discriminated", level: "senior", type: "lines",
      prompt: "A teammate added `triangle` to `Shape`. Which line now reports a type error?",
      code: `declare function assertNever(x: never): never;
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { kind: "triangle"; base: number; height: number };
function area(s: Shape): number {
  switch (s.kind) {
    case "circle": return Math.PI * s.radius ** 2;
    case "square": return s.size ** 2;
    default: return assertNever(s);
  }
}`, codeLang: "ts",
      answer: [10],
      explanation: "In the `default` branch, `s` is now the triangle member instead of `never`, so passing it to `assertNever` fails. That error is the whole point: it flags every switch that forgot the new case.",
    },
    {
      id: "d2-19", domain: "d2", lesson: "d2-discriminated", level: "staff",
      prompt: "Forty screens track requests with `isLoading: boolean; error?: Error; data?: T`, and bugs keep coming from impossible combinations (loading with an error, data with no data). What's the best fix to standardise?",
      options: [
        "A shared discriminated union `{ status: \"loading\" } | { status: \"error\"; error: Error } | { status: \"success\"; data: T }`, handled with exhaustive switches",
        "Add comments documenting which combinations are valid",
        "Make all three fields required and default them to `null`, then check each one for `null` in every component that reads the state, so loading, error and data are always present together",
        "Add a fourth boolean, `isSuccess`",
      ],
      answer: [0],
      explanation: "With a union, the impossible states can't be written at all: `data` only exists on success. Exhaustive switches with `assertNever` turn a new status, like \"idle\" or \"refreshing\", into a compile error on every screen that ignores it.",
    },
    {
      id: "d2-21", domain: "d2", lesson: "d2-discriminated", level: "staff",
      prompt: "An `OrderCreated` event shared by five services needs a breaking change to its payload. How should you model the change in the shared types?",
      options: [
        "Add a new union member with its own discriminant (e.g. `type: \"order.created.v2\"`), keep handling v1 until every consumer migrates, and let exhaustive switches show who hasn't",
        "Change the existing event's fields in place and release all five services on the same day, with a shared feature flag so that they all switch over to the new shape together at once",
        "Make every field optional so old and new payloads both type-check",
        "Type the payload as `unknown` everywhere",
      ],
      answer: [0],
      explanation: "A versioned discriminant lets producers and consumers move at their own pace, and the compiler finds every handler that needs updating. Changing fields in place forces a coordinated release, and making everything optional hides real breakage.",
    },
    // ── Predicates ──
    {
      id: "d2-10", domain: "d2", lesson: "d2-predicates", level: "intermediate",
      prompt: "What is the type of `strs`?",
      code: `function isString(x: unknown): x is string {
  return typeof x === "string";
}
const items = ["a", 1, "b", 2];
const strs = items.filter(isString);`, codeLang: "ts",
      options: ["`string[]`", "`(string | number)[]`", "`unknown[]`", "`boolean[]`"],
      answer: [0],
      explanation: "`filter` has an overload for callbacks that are type predicates. When you pass one, the result is narrowed, so `strs` is `string[]`.",
    },
    {
      id: "d2-11", domain: "d2", lesson: "d2-predicates", level: "senior",
      prompt: "In TypeScript 5.5 and later, what is the type of `nums`?",
      code: `const mixed = [1, null, 2, undefined, 3];
const nums = mixed.filter((x) => x != null);`, codeLang: "ts",
      options: ["`number[]`", "`(number | null | undefined)[]`", "`(number | null)[]`", "`unknown[]`"],
      answer: [0],
      explanation: "TypeScript 5.5 infers type predicates from simple function bodies. `(x) => x != null` becomes `(x) => x is number`, so `filter` narrows. Older versions gave `(number | null | undefined)[]`.",
    },
    {
      id: "d2-12", domain: "d2", lesson: "d2-predicates", level: "senior",
      prompt: "What does TypeScript do with this predicate?",
      code: `function isNumber(x: unknown): x is number {
  return typeof x === "string";
}`, codeLang: "ts",
      options: [
        "It compiles: TypeScript trusts the predicate, so callers get wrong types",
        "Type error: the body doesn't prove `x is number`",
        "It compiles, and TypeScript changes the predicate to `x is string`",
        "Runtime error when the function is called",
      ],
      answer: [0],
      explanation: "The compiler only checks that a predicate returns a boolean. It doesn't check the logic, so this one makes callers believe a string is a number. Test predicates like any other code.",
    },
    {
      id: "d2-13", domain: "d2", lesson: "d2-predicates", level: "senior",
      prompt: "What does the return type `asserts v is NonNullable<T>` tell the compiler?",
      code: `function assertDefined<T>(v: T): asserts v is NonNullable<T> {
  if (v == null) throw new Error("missing");
}`, codeLang: "ts",
      options: [
        "If the function returns normally, `v` is non-nullable for the rest of the calling scope",
        "The function returns a boolean that narrows `v` inside an `if` block only",
        "The function converts `v` to a non-null value",
        "`v` is checked at compile time, so the throw can be removed",
      ],
      answer: [0],
      explanation: "An assertion function narrows by refusing to return when the check fails. Unlike a predicate, you don't need an `if`: every line after the call sees the narrowed type.",
    },
    {
      id: "d2-20", domain: "d2", lesson: "d2-predicates", level: "staff",
      prompt: "Events arrive as JSON from a queue and are typed with `JSON.parse(msg) as OrderEvent`. A malformed message crashed a consumer deep inside business logic. What's the best fix?",
      options: [
        "Parse the message as `unknown` and validate it with a runtime schema (one that also gives you the TypeScript type) at the boundary; send invalid messages to a dead-letter queue",
        "Wrap the business logic in try/catch",
        "Replace `as OrderEvent` with `as unknown as OrderEvent` in the consumer, and turn on `strict` mode so the compiler checks each message's fields against the type when the queue delivers it at runtime",
        "Add optional chaining to every property access",
      ],
      answer: [0],
      explanation: "`as` is a promise you make to the compiler, not a check. Validating at the edge turns bad data into one handled failure, keeps the inner code trustworthy, and keeps the type and the check in sync.",
    },
    {
      id: "d2-22", domain: "d2", lesson: "d2-predicates", level: "staff",
      prompt: "A shared `isUser(x): x is User` predicate only checks `\"id\" in x`. Teams rely on it, and code crashes on objects missing `email`. What's the best fix?",
      options: [
        "Make the predicate check every field the type promises (ideally derived from a schema) and add tests, since the compiler doesn't verify predicate bodies",
        "Change the return type to `boolean`",
        "Ask teams to stop using the predicate and cast the parsed value with `as User` at each call site instead, since a cast is easier to search for in code review and gives the same compile-time guarantee",
        "Mark `email` as optional in `User`",
      ],
      answer: [0],
      explanation: "A predicate is a claim the compiler trusts, so it has to be complete. Changing it to `boolean` loses narrowing everywhere, and loosening `User` just pushes the checks into every caller.",
    },
  ],

  cards: [
    { id: "t2-union", domain: "d2", kind: "concept", term: "Union type", definition: "`A | B` holds a value of either type. Until you narrow it, you can only use what both share." },
    { id: "t2-narrowing", domain: "d2", kind: "concept", term: "Narrowing", definition: "After a check like `typeof`, `in`, `===` or `instanceof`, TypeScript knows a smaller type inside the branch." },
    { id: "t2-typeof", domain: "d2", kind: "service", term: "typeof guard", definition: "Narrows primitives. Watch out: `typeof x === \"object\"` still includes `null`." },
    { id: "t2-in", domain: "d2", kind: "service", term: "in guard", definition: "`\"key\" in x` narrows to the members that have that key. `x` must be a non-null object." },
    { id: "t2-instanceof", domain: "d2", kind: "service", term: "instanceof guard", definition: "Narrows to a class type. A common use is `err instanceof Error` in a catch block." },
    { id: "t2-discriminant", domain: "d2", kind: "concept", term: "Discriminated union", definition: "A union whose members share a property, like `kind`, with a different literal value on each, so you can tell them apart." },
    { id: "t2-exhaustive", domain: "d2", kind: "concept", term: "Exhaustiveness check", definition: "Pass whatever is left over to a parameter typed `never`. Any member you forgot to handle becomes a compile error." },
    { id: "t2-predicate", domain: "d2", kind: "service", term: "Type predicate (x is T)", definition: "A return type that tells callers a `true` result means `x` is a `T`. The compiler doesn't check the body." },
    { id: "t2-asserts", domain: "d2", kind: "service", term: "asserts x is T", definition: "An assertion function. If it returns without throwing, `x` is narrowed for the rest of the scope." },
    { id: "t2-isarray", domain: "d2", kind: "service", term: "Array.isArray", definition: "Narrows a union down to its array members." },
    { id: "t2-catch", domain: "d2", kind: "concept", term: "Unknown catch variables", definition: "Under `strict`, the `err` in `catch (err)` is `unknown`. Narrow it before reading any properties." },
  ],

  challenges: [
    {
      id: "ch-ts-narrow-circle",
      domain: "d2",
      lesson: "d2-narrowing",
      title: "Find the circle",
      goal: "Add checks until x is narrowed to exactly Circle.",
      hint: "A typeof \"object\" check isn't enough on its own. null is still in there, and in won't accept it.",
      takeaway: "Narrow from broad to specific. Rule out primitives with typeof, then remove null, then check a key or a discriminant.",
      render: (onSolved) => <NarrowingLab goal="circle" onSolved={onSolved} />,
    },
    {
      id: "ch-ts-narrow-square",
      domain: "d2",
      lesson: "d2-narrowing",
      title: "Square it away",
      goal: "Narrow x to exactly Square, in as few checks as you can.",
      hint: "x.kind only compiles once every member that's left has a kind property.",
      takeaway: "A discriminant check only works after you've removed every member that doesn't have the discriminant.",
      render: (onSolved) => <NarrowingLab goal="square" onSolved={onSolved} />,
    },
  ],
});
