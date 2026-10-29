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
    summary: "Union types and the checks that narrow them: typeof, in, instanceof, equality, discriminated unions, exhaustiveness, type predicates, and assertion functions.",
  },

  tasks: [
    { id: "2.1", title: "Unions and narrowing operators", covers: ["What you can do with a union before narrowing", "typeof, truthiness, equality, in, instanceof, Array.isArray", "Control-flow analysis and where it stops"] },
    { id: "2.2", title: "Discriminated unions and exhaustiveness", covers: ["Discriminant properties", "switch on kind", "assertNever and never-based exhaustiveness", "Modelling states as unions"] },
    { id: "2.3", title: "Type predicates and assertion functions", covers: ["`x is T` predicates and filter", "Inferred type predicates (TypeScript 5.5)", "`asserts x is T`", "Runtime validation at boundaries"] },
  ],

  lessons: [
    {
      id: "d2-unions",
      level: "junior",
      check: ["d2-01", "d2-02"],
      task: "2.1",
      title: "Unions: one of several types",
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
        "A union A | B accepts either type, but without narrowing you can only use members they share.",
        "Narrowing is a check the compiler understands; inside the branch the type is smaller.",
        "Literal unions like \"sm\" | \"md\" | \"lg\" are a lightweight, erasable alternative to enums.",
      ],
      tip: "When asked \"why doesn't this compile?\", point at the member of the union that lacks the property.",
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
              { icon: "🏷️", title: "typeof", text: "Primitives. \"object\" includes null!", color: "#22d3ee" },
              { icon: "🔑", title: "in", text: "Does the object have this key?", color: "#a78bfa" },
              { icon: "🏭", title: "instanceof", text: "Class instances, e.g. Error in catch", color: "#f472b6" },
              { icon: "⚖️", title: "=== / !==", text: "Literals and null. a === b narrows both sides", color: "#fbbf24" },
              { icon: "💡", title: "Truthiness", text: "Removes null/undefined… and 0, \"\" at runtime", color: "#34d399" },
              { icon: "📚", title: "Array.isArray", text: "Arrays vs everything else", color: "#38bdf8" },
            ]}
          />
          <NarrowingLab />
        </div>
      ),
      points: [
        "typeof x === \"object\" keeps null in the type: check x !== null too.",
        "\"key\" in x needs x to be an object (not a primitive, not possibly null).",
        "With useUnknownInCatchVariables (part of strict), catch (err) is unknown: narrow with instanceof Error.",
        "Narrowing of a property (obj.prop) doesn't carry into callbacks that run later; copy it to a const first.",
      ],
      tip: "Name the check you'd use and why. \"typeof for primitives, in or a discriminant for objects\" is the pattern interviewers want.",
    },
    {
      id: "d2-discriminated",
      level: "intermediate",
      check: ["d2-07", "d2-09"],
      task: "2.2",
      title: "Discriminated unions and exhaustiveness",
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
    default: return assertNever(s);  // add a member → compile error here
  }
}`}
        />
      ),
      points: [
        "Give every member a shared literal property (kind, type, status). Checking it narrows to one member.",
        "In the default branch, a fully handled union is never. Passing it to assertNever makes a new, unhandled member a compile error.",
        "Model states as unions (loading | error | success) so impossible combinations can't be represented.",
      ],
      tip: "Offer the assertNever pattern unprompted when you write a switch over a union. It signals production experience.",
    },
    {
      id: "d2-predicates",
      level: "senior",
      check: ["d2-10", "d2-12"],
      task: "2.3",
      title: "Type predicates and assertion functions",
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
        "A predicate (x): x is T tells callers \"if this returns true, x is T\". The compiler doesn't check the body is right.",
        "Since TypeScript 5.5, simple arrow callbacks like x => x != null are inferred as predicates, so filter narrows.",
        "An assertion function (asserts x is T) narrows for the rest of the scope by throwing when the check fails.",
        "At trust boundaries (JSON, queues, forms), derive predicates from a runtime schema rather than hand-writing partial checks.",
      ],
      tip: "Point out that a wrong predicate is worse than none: it makes the compiler confidently wrong.",
    },
  ],

  questions: [
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
      explanation: "After the if returns, value can only be a string, and strings have no toFixed. TypeScript reports \"Property 'toFixed' does not exist on type 'string'\".",
    },
    {
      id: "d2-02", domain: "d2", lesson: "d2-unions", level: "junior",
      prompt: "`value` has type `string | number`. Which member access compiles without any narrowing?",
      options: ["`value.toString()`", "`value.toUpperCase()`", "`value.toFixed()`", "`value.length`"],
      answer: [0],
      explanation: "Without narrowing, only members that exist on every type in the union are allowed. Both string and number have toString.",
    },
    {
      id: "d2-23", domain: "d2", lesson: "d2-unions", level: "junior", type: "lines",
      prompt: "Which line is a type error?",
      code: `type Size = "sm" | "md" | "lg";
let s: Size = "md";
s = "lg";
s = "xl";`, codeLang: "ts",
      answer: [4],
      explanation: "A literal union only accepts its listed values. \"xl\" isn't one of them: Type '\"xl\"' is not assignable to type 'Size'.",
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
      explanation: "Each of these is understood by control-flow analysis, so inside the true branch the type is narrowed accordingly.",
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
      explanation: "`typeof null` is \"object\" in JavaScript, and TypeScript models that faithfully, so null survives the check. Add `&& x !== null` to get string[].",
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
      explanation: "Truthiness narrowing removes undefined, but it also treats 0 as missing. Check `count === undefined` (or `count == null`) when 0 is a valid value.",
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
      explanation: "The `in` check narrows to Fish in the true branch. Because that branch returns, the code after it only runs for Bird.",
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
      explanation: "strict includes useUnknownInCatchVariables, so err is unknown (anything can be thrown). Narrow first: `if (err instanceof Error) console.log(err.message)`.",
    },
    {
      id: "d2-24", domain: "d2", lesson: "d2-narrowing", level: "junior",
      prompt: "What is the return type of `first`?",
      code: `function first(x: string | string[]) {
  return Array.isArray(x) ? x[0] : x;
}`, codeLang: "ts",
      options: ["`string`", "`string | string[]`", "`string[]`", "`any`"],
      answer: [0],
      explanation: "Array.isArray narrows x to string[] in the true branch (so x[0] is string) and to string in the false branch. Both arms are string.",
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
      explanation: "Equality narrowing intersects what both sides could be. The only type a and b have in common is string, so both narrow to string inside the block.",
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
      explanation: "Narrowing of a property access doesn't carry into a callback, because the property could change before the callback runs. Line 3 is fine. Fix: `const name = user.name` inside the if, then use name in the arrow.",
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
      explanation: "`in` needs a non-null object on its right, and you can only read x.id after `in` has proven the key exists. Then typeof narrows the property to string.",
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
      explanation: "In the \"square\" case, s is narrowed to the square member, which has size, not radius. The discriminant check is what makes this error possible.",
    },
    {
      id: "d2-09", domain: "d2", lesson: "d2-discriminated", level: "junior",
      prompt: "What makes a union a discriminated union?",
      options: [
        "Every member has a common property whose type is a distinct literal, like `kind: \"circle\"`",
        "Every member is a class",
        "The union has exactly two members",
        "The union is declared with `enum`",
      ],
      answer: [0],
      explanation: "The shared literal property (the discriminant) lets one comparison narrow to exactly one member.",
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
      explanation: "In the default branch s is now the triangle member, not never, so passing it to assertNever fails. That error is the point: it lists every switch that forgot the new case.",
    },
    {
      id: "d2-19", domain: "d2", lesson: "d2-discriminated", level: "staff",
      prompt: "Forty screens track requests with `isLoading: boolean; error?: Error; data?: T`, and bugs keep coming from impossible combinations (loading with an error, data with no data). What's the best fix to standardise?",
      options: [
        "A shared discriminated union `{ status: \"loading\" } | { status: \"error\"; error: Error } | { status: \"success\"; data: T }`, handled with exhaustive switches",
        "Add comments documenting which combinations are valid",
        "Make all three fields required and default them to null",
        "Add a fourth boolean, `isSuccess`",
      ],
      answer: [0],
      explanation: "A union makes illegal states unrepresentable: data only exists on success. Exhaustive switches with assertNever turn a future status (\"idle\", \"refreshing\") into compile errors at every screen that ignores it.",
    },
    {
      id: "d2-21", domain: "d2", lesson: "d2-discriminated", level: "staff",
      prompt: "An `OrderCreated` event shared by five services needs a breaking change to its payload. How should you model the change in the shared types?",
      options: [
        "Add a new union member with its own discriminant (e.g. `type: \"order.created.v2\"`), keep handling v1 until every consumer migrates, and let exhaustive switches show who hasn't",
        "Change the existing event's fields in place and release all five services the same day",
        "Make every field optional so old and new payloads both type-check",
        "Type the payload as `unknown` everywhere",
      ],
      answer: [0],
      explanation: "Versioned discriminants let producers and consumers move independently, and the compiler finds every handler that needs updating. In-place changes need a coordinated deploy, and all-optional types hide real breakage.",
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
      explanation: "Array.prototype.filter has an overload for type-predicate callbacks, so the result is narrowed to string[].",
    },
    {
      id: "d2-11", domain: "d2", lesson: "d2-predicates", level: "senior",
      prompt: "In TypeScript 5.5 and later, what is the type of `nums`?",
      code: `const mixed = [1, null, 2, undefined, 3];
const nums = mixed.filter((x) => x != null);`, codeLang: "ts",
      options: ["`number[]`", "`(number | null | undefined)[]`", "`(number | null)[]`", "`unknown[]`"],
      answer: [0],
      explanation: "TypeScript 5.5 infers type predicates from simple function bodies: `(x) => x != null` becomes `(x) => x is number`, so filter narrows. Older versions gave `(number | null | undefined)[]`.",
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
      explanation: "The compiler only checks that a predicate returns a boolean. It doesn't verify the logic, so a wrong predicate makes callers believe a string is a number. Test predicates like any other code.",
    },
    {
      id: "d2-13", domain: "d2", lesson: "d2-predicates", level: "senior",
      prompt: "What does the return type `asserts v is NonNullable<T>` tell the compiler?",
      code: `function assertDefined<T>(v: T): asserts v is NonNullable<T> {
  if (v == null) throw new Error("missing");
}`, codeLang: "ts",
      options: [
        "If the function returns normally, `v` is non-nullable for the rest of the calling scope",
        "The function returns a boolean that narrows `v` inside an if",
        "The function converts `v` to a non-null value",
        "`v` is checked at compile time, so the throw can be removed",
      ],
      answer: [0],
      explanation: "Assertion functions narrow by not returning when the check fails. Unlike a predicate, there's no if: code after the call sees the narrowed type.",
    },
    {
      id: "d2-20", domain: "d2", lesson: "d2-predicates", level: "staff",
      prompt: "Events arrive as JSON from a queue and are typed with `JSON.parse(msg) as OrderEvent`. A malformed message crashed a consumer deep inside business logic. What's the best fix?",
      options: [
        "Parse the message as `unknown` and validate it with a runtime schema (one that also gives you the TypeScript type) at the boundary; send invalid messages to a dead-letter queue",
        "Wrap the business logic in try/catch",
        "Replace `as OrderEvent` with `as unknown as OrderEvent`",
        "Add optional chaining to every property access",
      ],
      answer: [0],
      explanation: "`as` is a promise to the compiler, not a check. Validating at the edge turns bad data into one handled failure, keeps the inner code trustworthy, and keeps the type and the validation in sync.",
    },
    {
      id: "d2-22", domain: "d2", lesson: "d2-predicates", level: "staff",
      prompt: "A shared `isUser(x): x is User` predicate only checks `\"id\" in x`. Teams rely on it, and code crashes on objects missing `email`. What's the best fix?",
      options: [
        "Make the predicate check every field the type promises (ideally derived from a schema) and add tests, since the compiler doesn't verify predicate bodies",
        "Change the return type to `boolean`",
        "Ask teams to stop using the predicate",
        "Mark `email` as optional in `User`",
      ],
      answer: [0],
      explanation: "A predicate is a trusted claim, so it must be complete. Changing it to boolean loses narrowing everywhere, and weakening the User type just pushes checks into every caller.",
    },
  ],

  cards: [
    { id: "t2-union", domain: "d2", kind: "concept", term: "Union type", definition: "A | B: a value of either type. Only shared members are usable before narrowing." },
    { id: "t2-narrowing", domain: "d2", kind: "concept", term: "Narrowing", definition: "Control-flow analysis refines a union after checks like typeof, in, ===, or instanceof." },
    { id: "t2-typeof", domain: "d2", kind: "service", term: "typeof guard", definition: "Narrows primitives. typeof x === \"object\" still includes null." },
    { id: "t2-in", domain: "d2", kind: "service", term: "in guard", definition: "\"key\" in x narrows to members that have the key. x must be a non-null object." },
    { id: "t2-instanceof", domain: "d2", kind: "service", term: "instanceof guard", definition: "Narrows to a class type, e.g. err instanceof Error in a catch block." },
    { id: "t2-discriminant", domain: "d2", kind: "concept", term: "Discriminated union", definition: "Union whose members share a literal property (like kind) used to tell them apart." },
    { id: "t2-exhaustive", domain: "d2", kind: "concept", term: "Exhaustiveness check", definition: "Passing the leftover value to a never parameter makes unhandled members a compile error." },
    { id: "t2-predicate", domain: "d2", kind: "service", term: "Type predicate (x is T)", definition: "Return type telling callers that a true result means x is T. The body isn't verified." },
    { id: "t2-asserts", domain: "d2", kind: "service", term: "asserts x is T", definition: "Assertion function: narrows x for the rest of the scope if it returns without throwing." },
    { id: "t2-isarray", domain: "d2", kind: "service", term: "Array.isArray", definition: "Narrows a union to its array members." },
    { id: "t2-catch", domain: "d2", kind: "concept", term: "Unknown catch variables", definition: "Under strict, catch (err) is unknown. Narrow before reading properties." },
  ],

  challenges: [
    {
      id: "ch-ts-narrow-circle",
      domain: "d2",
      lesson: "d2-narrowing",
      title: "Find the circle",
      goal: "Add checks until x is narrowed to exactly Circle.",
      hint: "typeof \"object\" isn't enough on its own: null is still there, and in won't accept it.",
      takeaway: "Narrow from broad to specific: primitives with typeof, then null, then a key or discriminant.",
      render: (onSolved) => <NarrowingLab goal="circle" onSolved={onSolved} />,
    },
    {
      id: "ch-ts-narrow-square",
      domain: "d2",
      lesson: "d2-narrowing",
      title: "Square it away",
      goal: "Narrow x to exactly Square, in as few checks as you can.",
      hint: "x.kind only compiles once every remaining member has a kind property.",
      takeaway: "A discriminant check only works after you've removed every member without the discriminant.",
      render: (onSolved) => <NarrowingLab goal="square" onSolved={onSolved} />,
    },
  ],
});
