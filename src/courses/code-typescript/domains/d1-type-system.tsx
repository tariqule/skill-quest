import { CodeBlock, CodeCompare, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { AssignabilityGrid } from "../visuals";

/** Module 1: structural typing, type vs interface, any/unknown/never, literal types. */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "Type System Foundations",
    world: "The Structural Shipyard",
    weight: 20,
    emoji: "⚓",
    color: "#3178c6",
    summary: "Structural typing, excess property checks, type vs interface, any/unknown/never, literal types, as const, satisfies, and enums vs unions.",
  },

  tasks: [
    { id: "1.1", title: "Structural typing, type vs interface", covers: ["Shape-based compatibility", "Excess property checks on fresh literals", "Declaration merging, extends vs &", "Branded types"] },
    { id: "1.2", title: "any, unknown, never", covers: ["Top and bottom types", "Why unknown beats any", "never in unions and unreachable code", "{} vs object"] },
    { id: "1.3", title: "Literal types, as const, satisfies, enums", covers: ["Literal widening with let vs const", "as const and readonly", "satisfies vs annotations", "Enums vs string-literal unions"] },
  ],

  lessons: [
    {
      id: "d1-structural",
      level: "junior",
      check: ["d1-01", "d1-15"],
      task: "1.1",
      title: "If it fits the shape, it compiles",
      visual: (
        <CodeCompare
          lang="ts"
          left={{ title: "Extra props: fine from a variable", code: `interface Point { x: number; y: number }
const p3 = { x: 3, y: 4, z: 5 };
const a: Point = p3; // ok: p3 has x and y` }}
          right={{ title: "Excess check: fresh literal", code: `interface Point { x: number; y: number }
const b: Point = { x: 3, y: 4, z: 5 };
//                            ~ error: 'z' does not
//                              exist in type 'Point'` }}
        />
      ),
      points: [
        "TypeScript compares types by their members, not their names: two unrelated interfaces with the same shape are interchangeable.",
        "Extra properties are allowed, except on fresh object literals, where they're likely typos (excess property checking).",
        "Private and protected class members make classes compare nominally.",
        "To stop mixing same-shaped values (UserId vs OrderId), use branded types.",
      ],
      tip: "Say \"duck typing at compile time\" and immediately mention the excess property check exception.",
    },
    {
      id: "d1-type-interface",
      level: "junior",
      check: ["d1-03", "d1-04"],
      task: "1.1",
      title: "type vs interface",
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🧩", title: "interface", text: "Object shapes. Can be reopened (declaration merging). extends reports conflicts at the declaration.", color: "#3178c6" },
            { icon: "🏷️", title: "type", text: "Any type: unions, tuples, primitives, mapped and conditional types. Can't be reopened.", color: "#a78bfa" },
            { icon: "🤝", title: "Both", text: "Describe objects and functions, can be extended (extends / &), can be implemented by classes.", color: "#34d399" },
            { icon: "⚖️", title: "Rule of thumb", text: "interface for public object shapes you expect to extend; type for everything else. Be consistent.", color: "#fbbf24" },
          ]}
        />
      ),
      points: [
        "Only type can name unions, tuples, primitives, and mapped or conditional types.",
        "Only interface merges: two interface Box declarations combine into one.",
        "interface B extends A errors if a property conflicts; A & B silently makes the conflicting property never.",
      ],
      tip: "Don't claim one is \"better\". Name the concrete differences: merging, unions, and conflict reporting.",
    },
    {
      id: "d1-top-bottom",
      level: "intermediate",
      check: ["d1-06", "d1-05"],
      task: "1.2",
      title: "any, unknown, and never",
      visual: <AssignabilityGrid />,
      points: [
        "unknown is the safe top type: anything can be assigned to it, but you must narrow it before using it.",
        "any disables checking in both directions and spreads to everything it touches.",
        "never is the empty type: assignable to everything, nothing is assignable to it. Unions drop it (string | never is string).",
        "{} means any non-nullish value, primitives included; object means non-primitive.",
      ],
      tip: "Use unknown for JSON.parse results, catch variables, and untrusted input, then show the narrowing.",
    },
    {
      id: "d1-literals",
      level: "intermediate",
      check: ["d1-10", "d1-11"],
      task: "1.3",
      title: "Literal types, as const, and satisfies",
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="ts"
            code={`let a = "hi";              // string (let can change)
const b = "hi";            // "hi"   (const can't)
const roles = ["admin", "user"] as const; // readonly ["admin", "user"]
type Role = (typeof roles)[number];       // "admin" | "user"

const theme = { primary: "#3178c6", spacing: [4, 8] } satisfies Record<string, string | number[]>;
theme.primary.toUpperCase();  // ok: still known to be a string`}
          />
          <CodeCompare
            lang="ts"
            left={{ title: "enum: emits runtime code", code: `enum Status { Active = "active", Banned = "banned" }
setStatus(Status.Active);` }}
            right={{ title: "union / as const: types only", code: `const Status = { Active: "active", Banned: "banned" } as const;
type Status = (typeof Status)[keyof typeof Status];
setStatus("active");` }}
          />
        </div>
      ),
      points: [
        "const declarations keep literal types; let widens them to string, number, and so on.",
        "as const makes the deepest literal types and marks everything readonly.",
        "satisfies checks a value against a type but keeps the more specific inferred type.",
        "String-literal unions (or as const objects) are erasable; enums generate a runtime object.",
      ],
      tip: "Annotations widen to the declared type; satisfies validates without widening. That one sentence answers most satisfies questions.",
    },
  ],

  questions: [
    // ── Structural typing ──
    {
      id: "d1-01", domain: "d1", lesson: "d1-structural", level: "junior",
      prompt: "What happens with `strict: true`?",
      code: `interface Point { x: number; y: number }
function len(p: Point) { return Math.hypot(p.x, p.y); }
const p3 = { x: 3, y: 4, z: 5 };
console.log(len(p3));`, codeLang: "ts",
      options: ["It compiles and prints `5`", "Type error: `z` does not exist in type `Point`", "Type error: `p3` must be declared as `Point`", "It compiles but prints `NaN`"],
      answer: [0],
      explanation: "TypeScript is structural: p3 has x and y of the right types, so it is a Point. The extra z is fine because p3 is a variable, not a fresh object literal.",
    },
    {
      id: "d1-02", domain: "d1", lesson: "d1-structural", level: "intermediate", type: "lines",
      prompt: "Which line is a type error?",
      code: `interface Point { x: number; y: number }
function len(p: Point) { return Math.hypot(p.x, p.y); }
const p3 = { x: 3, y: 4, z: 5 };
len(p3);
len({ x: 3, y: 4, z: 5 });`, codeLang: "ts",
      answer: [5],
      explanation: "Excess property checking only applies to fresh object literals. Passing the literal directly on line 5 reports \"Object literal may only specify known properties\". Line 4 passes a variable, so it's fine.",
    },
    {
      id: "d1-15", domain: "d1", lesson: "d1-structural", level: "junior",
      prompt: "How does TypeScript decide whether one object type is assignable to another?",
      options: ["By comparing their members (shape)", "By comparing their names", "By checking they were declared in the same file", "By checking the runtime constructor"],
      answer: [0],
      explanation: "TypeScript's type system is structural: a type is compatible if it has at least the required members with compatible types. Names don't matter.",
    },
    {
      id: "d1-16", domain: "d1", lesson: "d1-structural", level: "senior", type: "lines",
      prompt: "Which line is a type error?",
      code: `class Cat { meow() { return "meow"; } }
class Robot { meow() { return "beep"; } }
const c: Cat = new Robot();
class Safe { private key = 1; }
class Other { private key = 1; }
const s: Safe = new Other();`, codeLang: "ts",
      answer: [6],
      explanation: "Cat and Robot have the same public shape, so line 3 compiles. Private (and protected) members must come from the same declaration, so Other isn't assignable to Safe: \"Types have separate declarations of a private property\".",
    },
    {
      id: "d1-23", domain: "d1", lesson: "d1-structural", level: "staff",
      prompt: "`UserId` and `OrderId` are both `string` aliases, and a production bug passed an order ID into `deleteUser(id)`. What's the best type-level fix to roll out across the codebase?",
      options: [
        "Branded types, e.g. `type UserId = string & { readonly __brand: \"UserId\" }`, created only by a validating constructor",
        "Rename the aliases so they're more descriptive",
        "Change both to `interface UserId { value: string }` with the same shape",
        "Use `any` for IDs and validate at runtime",
      ],
      answer: [0],
      explanation: "Aliases are just names, and structural typing makes same-shaped types interchangeable. A brand adds a phantom member so the shapes differ, with no runtime cost, and a single constructor function controls where IDs are created.",
    },
    // ── type vs interface ──
    {
      id: "d1-03", domain: "d1", lesson: "d1-type-interface", level: "junior",
      prompt: "Which can a `type` alias express that an `interface` cannot? (Choose two.)",
      options: ["A union like `\"sm\" | \"md\" | \"lg\"`", "A mapped type like `{ [K in Keys]: boolean }`", "An object shape with methods", "A shape that a class can implement", "Optional properties"],
      answer: [0, 1],
      explanation: "Interfaces only describe object (and function) shapes. Unions, tuples, primitives, and mapped or conditional types need `type`. Both can have methods and optional properties, and classes can implement either.",
    },
    {
      id: "d1-04", domain: "d1", lesson: "d1-type-interface", level: "intermediate", type: "lines",
      prompt: "Which line is a type error?",
      code: `interface Box { width: number }
interface Box { height: number }
const b: Box = { width: 1 };`, codeLang: "ts",
      answer: [3],
      explanation: "Interfaces with the same name merge, so Box requires both width and height. Line 3 is missing height. Two `type Box` declarations would instead be a duplicate identifier error.",
    },
    {
      id: "d1-17", domain: "d1", lesson: "d1-type-interface", level: "senior",
      prompt: "What does TypeScript do with this code?",
      code: `interface A { id: string }
interface B extends A { id: number }
type C = A & { id: number };`, codeLang: "ts",
      options: [
        "`interface B` is an error at its declaration; `C` compiles, but `C[\"id\"]` is `never`",
        "Both compile, and `id` is `string | number` in each",
        "Both are errors at their declarations",
        "`B` compiles with `id: number`; `C` is an error",
      ],
      answer: [0],
      explanation: "`extends` checks compatibility and reports \"incorrectly extends interface\". An intersection never errors at the declaration: `string & number` reduces to never, and you only find out when you try to create a value.",
    },
    {
      id: "d1-21", domain: "d1", lesson: "d1-type-interface", level: "staff",
      prompt: "The backend and frontend teams each hand-write TypeScript interfaces for the same REST API. They drift, and production sees runtime errors even though both sides compile. What's the best fix?",
      options: [
        "Generate the types on both sides from one source of truth (e.g. an OpenAPI or JSON schema), and validate responses at runtime at the boundary",
        "Ask both teams to review each other's interfaces every sprint",
        "Mark every field as optional so mismatches don't fail",
        "Use `any` for API responses",
      ],
      answer: [0],
      explanation: "Types are erased at runtime and can't check a network boundary by themselves. A single generated contract removes the drift, and runtime validation catches what's actually sent.",
    },
    // ── any / unknown / never ──
    {
      id: "d1-05", domain: "d1", lesson: "d1-top-bottom", level: "intermediate", type: "lines",
      prompt: "Which line is a type error?",
      code: `function handle(input: unknown) {
  if (typeof input === "string") {
    return input.toUpperCase();
  }
  return input.toFixed(2);
}`, codeLang: "ts",
      answer: [5],
      explanation: "Inside the if, input is narrowed to string. After it, input is still unknown, and you can't call methods on unknown: \"'input' is of type 'unknown'\".",
    },
    {
      id: "d1-06", domain: "d1", lesson: "d1-top-bottom", level: "junior",
      prompt: "What's the safest type for the result of `JSON.parse` before you've validated it?",
      options: ["`unknown`", "`any`", "`object`", "`never`"],
      answer: [0],
      explanation: "unknown forces you to narrow or validate before use. any lets mistakes through silently, object is wrong for numbers and strings, and never means no value.",
    },
    {
      id: "d1-08", domain: "d1", lesson: "d1-top-bottom", level: "junior", type: "match",
      prompt: "Match each type with its meaning.",
      pairs: [
        ["`any`", "Turns off checking: anything in, anything out"],
        ["`unknown`", "Anything can go in; narrow it before using it"],
        ["`never`", "No value can have this type"],
        ["`void`", "The function's return value shouldn't be used"],
      ],
      explanation: "unknown and any are both top types, but only any lets you skip checks. never is the bottom type. void marks functions called for their side effects.",
    },
    {
      id: "d1-09", domain: "d1", lesson: "d1-top-bottom", level: "intermediate",
      prompt: "What happens with this code?",
      code: `const data: any = JSON.parse("{}");
const n: number = data.count.total;`, codeLang: "ts",
      options: ["It compiles, then throws a `TypeError` at runtime", "Type error: `count` does not exist", "Type error: `any` isn't assignable to `number`", "It compiles and `n` is `undefined`"],
      answer: [0],
      explanation: "any switches off checking, so the property chain and the assignment compile. At runtime data.count is undefined, and reading .total throws. With unknown, this would not compile.",
    },
    {
      id: "d1-07", domain: "d1", lesson: "d1-top-bottom", level: "senior",
      prompt: "Which statement about these two functions is true?",
      code: `function failDecl(msg: string) { throw new Error(msg); }
const failArrow = (msg: string) => { throw new Error(msg); };`, codeLang: "ts",
      options: [
        "`failArrow` is inferred to return `never`, but `failDecl` is inferred to return `void`",
        "Both are inferred to return `never`",
        "Both are inferred to return `void`",
        "Both are inferred to return `undefined`",
      ],
      answer: [0],
      explanation: "For backwards compatibility, function declarations whose body never returns are inferred as void. Function expressions and arrows get never. Annotate `: never` explicitly when you mean it.",
    },
    {
      id: "d1-18", domain: "d1", lesson: "d1-top-bottom", level: "senior",
      prompt: "What do `unknown | string` and `never | string` simplify to?",
      options: ["`unknown` and `string`", "`string` and `string`", "`unknown` and `never`", "They stay as written"],
      answer: [0],
      explanation: "unknown absorbs every other member of a union (it already contains them all). never is the empty set, so it vanishes from unions. That's what makes never useful for filtering in conditional types.",
    },
    {
      id: "d1-24", domain: "d1", lesson: "d1-top-bottom", level: "senior",
      prompt: "Which declaration is a type error?",
      options: ["`const b: object = 42;`", "`const a: {} = 42;`", "`const c: unknown = 42;`", "`const d: Object = 42;`"],
      answer: [0],
      explanation: "`object` means non-primitive. `{}` and `Object` accept any value except null and undefined, primitives included, which surprises many people. unknown accepts everything.",
    },
    // ── Literals ──
    {
      id: "d1-10", domain: "d1", lesson: "d1-literals", level: "junior",
      prompt: "What are the inferred types of `a` and `b`?",
      code: `let a = "hi";
const b = "hi";`, codeLang: "ts",
      options: ["`a: string`, `b: \"hi\"`", "Both `string`", "Both `\"hi\"`", "`a: \"hi\"`, `b: string`"],
      answer: [0],
      explanation: "A let can be reassigned, so TypeScript widens the literal to string. A const can't change, so it keeps the literal type \"hi\".",
    },
    {
      id: "d1-11", domain: "d1", lesson: "d1-literals", level: "intermediate",
      prompt: "What is `Role`?",
      code: `const roles = ["admin", "user"] as const;
type Role = (typeof roles)[number];`, codeLang: "ts",
      options: ["`\"admin\" | \"user\"`", "`string`", "`string[]`", "`readonly string[]`"],
      answer: [0],
      explanation: "as const makes roles the readonly tuple `readonly [\"admin\", \"user\"]`. Indexing it with number gives the union of its element types. Without as const, Role would be string.",
    },
    {
      id: "d1-12", domain: "d1", lesson: "d1-literals", level: "intermediate", type: "lines",
      prompt: "Which line is a type error?",
      code: `type Colors = Record<string, string | number[]>;
const a: Colors = { red: "#f00", green: [0, 255, 0] };
const b = { red: "#f00", green: [0, 255, 0] } satisfies Colors;
a.red.toUpperCase();
b.red.toUpperCase();`, codeLang: "ts",
      answer: [4],
      explanation: "The annotation on a widens a.red to `string | number[]`, which has no toUpperCase. satisfies checks b against Colors but keeps its inferred type, so b.red is still a string.",
    },
    {
      id: "d1-13", domain: "d1", lesson: "d1-literals", level: "intermediate",
      prompt: "Why do many teams prefer `type Dir = \"up\" | \"down\"` over `enum Dir { Up, Down }`?",
      options: [
        "A string-literal union is erased at compile time and works with plain strings; an enum emits a runtime object and is TypeScript-only syntax",
        "Enums can't be used in switch statements",
        "Unions are checked at runtime; enums aren't",
        "Enums are deprecated in TypeScript 5",
      ],
      answer: [0],
      explanation: "Enums aren't deprecated, but they generate JavaScript and can't be stripped by type-only tools. Unions add zero runtime code, and callers can pass \"up\" directly. Neither is checked at runtime.",
    },
    {
      id: "d1-14", domain: "d1", lesson: "d1-literals", level: "junior",
      prompt: "What does `value satisfies Type` do?",
      options: [
        "Checks that the value matches Type, while keeping the value's own, more specific inferred type",
        "Converts the value to Type at runtime",
        "Widens the value's type to Type, like an annotation",
        "Tells the compiler to trust the value without checking, like `as`",
      ],
      answer: [0],
      explanation: "satisfies (TypeScript 4.9+) validates without changing the inferred type. An annotation widens to Type; `as` skips most checking.",
    },
    {
      id: "d1-19", domain: "d1", lesson: "d1-literals", level: "junior", type: "lines",
      prompt: "Which line is a type error?",
      code: `const nums: readonly number[] = [1, 2, 3];
const first = nums[0];
nums.push(4);`, codeLang: "ts",
      answer: [3],
      explanation: "readonly arrays (ReadonlyArray) have no mutating methods, so push doesn't exist on them. Reading elements is fine.",
    },
    {
      id: "d1-22", domain: "d1", lesson: "d1-literals", level: "staff",
      prompt: "A monorepo library is consumed by apps that run TypeScript through type-stripping tools (such as Node.js's built-in type stripping or `--erasableSyntaxOnly`). Its public API uses enums. What should you do?",
      options: [
        "Replace the enums with `as const` objects plus a derived union type, so the code is erasable and the runtime values stay the same",
        "Switch the enums to `const enum`",
        "Ask every app to turn off type stripping",
        "Keep the enums and publish only `.d.ts` files",
      ],
      answer: [0],
      explanation: "Enums need code generation, so type-only stripping rejects them. `as const` objects give the same runtime values and an equivalent type. const enums are even harder for single-file tools, and dropping the JS breaks runtime use.",
    },
    {
      id: "d1-20", domain: "d1", lesson: "d1-literals", level: "staff",
      prompt: "You're asked to move a 500k-line JavaScript codebase to TypeScript without freezing feature work. What's the best strategy?",
      options: [
        "Enable `allowJs`, convert files incrementally (leaf modules first), and tighten strict flags gradually with CI blocking new errors",
        "Rename every file to .ts in one PR, add `any` wherever it fails, and fix it later",
        "Rewrite the application from scratch in TypeScript",
        "Turn on `strict` immediately and block all merges until there are zero errors",
      ],
      answer: [0],
      explanation: "Incremental migration keeps shipping, gives value early, and lets you ratchet strictness up. Big-bang renames bury the codebase in any, and rewrites or merge freezes stall the business.",
    },
  ],

  cards: [
    { id: "t1-structural", domain: "d1", kind: "concept", term: "Structural typing", definition: "Types are compatible when their shapes match, regardless of names." },
    { id: "t1-excess", domain: "d1", kind: "concept", term: "Excess property check", definition: "Fresh object literals can't have properties the target type doesn't declare." },
    { id: "t1-merging", domain: "d1", kind: "concept", term: "Declaration merging", definition: "Interfaces with the same name combine into one. type aliases can't be reopened." },
    { id: "t1-brand", domain: "d1", kind: "concept", term: "Branded type", definition: "string & { __brand: \"UserId\" }: a nominal-style type built on a primitive." },
    { id: "t1-unknown", domain: "d1", kind: "service", term: "unknown", definition: "Safe top type: accepts anything, but must be narrowed before use." },
    { id: "t1-any", domain: "d1", kind: "service", term: "any", definition: "Disables type checking for a value in both directions." },
    { id: "t1-never", domain: "d1", kind: "service", term: "never", definition: "The empty type: no values. Vanishes from unions, marks impossible code." },
    { id: "t1-void", domain: "d1", kind: "service", term: "void", definition: "Return type meaning \"don't use the result\"." },
    { id: "t1-asconst", domain: "d1", kind: "service", term: "as const", definition: "Infers the narrowest literal types and makes everything readonly." },
    { id: "t1-satisfies", domain: "d1", kind: "service", term: "satisfies", definition: "Checks a value against a type without widening the inferred type." },
    { id: "t1-readonly-arr", domain: "d1", kind: "service", term: "readonly T[]", definition: "An array type without push, pop, splice, or other mutating methods." },
    { id: "t1-widening", domain: "d1", kind: "concept", term: "Literal widening", definition: "let x = \"a\" is string; const x = \"a\" keeps the literal \"a\"." },
    { id: "t1-enum", domain: "d1", kind: "concept", term: "Enum vs union", definition: "Enums emit a runtime object; literal unions are erased and accept plain values." },
  ],
});
