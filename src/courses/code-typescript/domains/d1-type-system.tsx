import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
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
    summary: "How TypeScript decides two types fit together, when to use type or interface, the special types any, unknown and never, and how to keep exact values with literal types, as const and satisfies.",
  },

  tasks: [
    { id: "1.1", title: "Structural typing, type vs interface", covers: ["Shape-based compatibility", "Excess property checks on fresh literals", "Declaration merging, extends vs &", "Branded types"] },
    { id: "1.2", title: "any, unknown, never", covers: ["Top and bottom types", "Why unknown beats any", "never in unions and unreachable code", "{} vs object"] },
    { id: "1.3", title: "Literal types, as const, satisfies, enums", covers: ["Literal widening with let vs const", "as const and readonly", "satisfies vs annotations", "Enums vs string-literal unions"] },
  ],

  lessons: [
    // ── Start here ──
    {
      id: "d1-b-what",
      level: "beginner",
      check: ["ts-b1-01", "ts-b1-02"],
      task: "1.1",
      title: "What TypeScript is",
      visual: (
        <Flow
          color="#3178c6"
          steps={[
            { icon: "✍️", label: "You write .ts", sub: "JavaScript plus type labels" },
            { icon: "🔍", label: "TypeScript checks", sub: "Mistakes show up as red squiggles" },
            { icon: "📄", label: "Plain .js comes out", sub: "The labels are removed" },
            { icon: "▶️", label: "It runs", sub: "In a browser or in Node.js" },
          ]}
        />
      ),
      points: [
        "TypeScript is JavaScript with labels added. A label says what kind of value something holds, such as a number or a piece of text.",
        "Think of it as a spell-checker for code. It reads your program and points out mistakes before you ever run it.",
        "For example, if a function expects a number and you pass it the text \"ten\", TypeScript underlines it straight away.",
        "Browsers and Node.js don't run TypeScript directly. A tool removes the labels and hands over plain JavaScript.",
      ],
      tip: "Every piece of JavaScript is already valid TypeScript. You can start with a normal .js file and add labels one at a time.",
    },
    {
      id: "d1-b-labels",
      level: "beginner",
      check: ["ts-b1-03", "ts-b1-04"],
      task: "1.3",
      title: "Your first type labels",
      visual: (
        <CodeBlock
          lang="ts"
          code={`let name: string = "Ada";     // text
let age: number = 36;         // any number, whole or decimal
let isAdmin: boolean = false; // true or false

age = 37;      // fine: still a number
age = "old";   // error: "old" is not a number`}
        />
      ),
      points: [
        "You add a label with a colon after the name: `let age: number = 36`. Read the colon as \"which is a\".",
        "The three labels you'll use most are `string` for text, `number` for numbers and `boolean` for true or false.",
        "Once a variable has a label, TypeScript stops you from putting a different kind of value in it later.",
        "You often don't need to write the label. In `let age = 36`, TypeScript works out that `age` is a number. This is called inference.",
      ],
      tip: "Let TypeScript infer simple variables. Write labels where values come in, like function parameters.",
    },
    {
      id: "d1-b-shapes",
      level: "beginner",
      check: ["ts-b1-05", "ts-b1-06"],
      task: "1.1",
      title: "Describing an object's shape",
      visual: (
        <CodeBlock
          lang="ts"
          code={`interface User {
  name: string;
  age: number;
}

const ada: User = { name: "Ada", age: 36 };   // fine
const bob: User = { name: "Bob" };            // error: age is missing

function greet(user: User) {
  return "Hi " + user.name;
}`}
        />
      ),
      points: [
        "An object groups related values, like a contact card with a name and an age.",
        "An `interface` describes what the card must contain. It's like a form with labelled boxes that all need filling in.",
        "If you leave a box empty or put the wrong kind of value in it, TypeScript tells you which one.",
        "You can use the interface as a label anywhere, for example on a function parameter, so callers know what to pass.",
      ],
      tip: "Name interfaces after the thing they describe, like `User` or `Order`, and start them with a capital letter.",
    },

    // ── Junior and up ──
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
        "TypeScript compares types by what's inside them, not by their names. Two interfaces with the same members can be used in place of each other.",
        "This is called structural typing. If a value has every property a type asks for, it fits, even if it has more.",
        "There's one exception. If you write an object literal straight into a typed spot, extra properties are flagged, because they're probably typos. This is the excess property check.",
        "Classes with `private` or `protected` members are compared by where they were declared, not just by shape.",
        "To stop two same-shaped values getting mixed up, like a user ID and an order ID, you can use a branded type.",
      ],
      tip: "Interviewers like the phrase \"duck typing at compile time\". Say it, then mention the excess property check straight after.",
    },
    {
      id: "d1-type-interface",
      level: "junior",
      check: ["d1-03", "d1-04"],
      task: "1.1",
      title: "type or interface?",
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🧩", title: "interface", text: "Describes object shapes. You can reopen it to add members (declaration merging). extends reports conflicts where you declare it.", color: "#3178c6" },
            { icon: "🏷️", title: "type", text: "Can name any type: unions, tuples, primitives, mapped and conditional types. You can't reopen it.", color: "#a78bfa" },
            { icon: "🤝", title: "Both", text: "Describe objects and functions, can be extended (with extends or &), and can be implemented by classes.", color: "#34d399" },
            { icon: "⚖️", title: "Rule of thumb", text: "Use interface for public object shapes you expect others to extend, and type for everything else. Stay consistent.", color: "#fbbf24" },
          ]}
        />
      ),
      points: [
        "Only `type` can give a name to a union, a tuple, a primitive, or a mapped or conditional type. For example, `type Size = \"sm\" | \"lg\"`.",
        "Only `interface` merges. If you declare `interface Box` twice, TypeScript combines both into one type.",
        "`interface B extends A` reports an error when a property clashes. `A & B` doesn't complain and quietly turns the clashing property into `never`.",
      ],
      tip: "Don't say one is better. Name the real differences: merging, unions, and how conflicts are reported.",
    },
    {
      id: "d1-top-bottom",
      level: "intermediate",
      check: ["d1-06", "d1-05"],
      task: "1.2",
      title: "any, unknown, and never",
      visual: <AssignabilityGrid />,
      points: [
        "`unknown` means \"this could be anything\". You can put any value into it, but you have to check what it is before you use it.",
        "`any` turns checking off in both directions. Worse, it spreads: whatever you read from an `any` is also `any`.",
        "`never` is the type with no values at all. It fits anywhere, but nothing fits into it. In a union it disappears, so `string | never` is just `string`.",
        "`{}` means any value except `null` and `undefined`, and that includes numbers and strings. `object` means anything that isn't a primitive.",
      ],
      tip: "Reach for `unknown` for `JSON.parse` results, `catch` variables and untrusted input. Then show how you'd narrow it.",
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
        "A literal type is one exact value, like `\"hi\"` or `42`. A `const` keeps the literal type, because it can never change.",
        "A `let` can be reassigned, so TypeScript widens its literal to the general type: `string`, `number` and so on.",
        "`as const` keeps the narrowest literal type for every value inside and marks everything `readonly`.",
        "`satisfies` checks a value against a type but keeps the more specific type TypeScript inferred.",
        "String-literal unions and `as const` objects vanish when compiled. An `enum` generates a real object in the JavaScript output.",
      ],
      tip: "An annotation widens the value to the declared type. `satisfies` checks it without widening. That one sentence answers most satisfies questions.",
    },
  ],

  questions: [
    // ── Start here ──
    {
      id: "ts-b1-01", domain: "d1", lesson: "d1-b-what", level: "beginner",
      prompt: "What does TypeScript add to JavaScript?",
      options: [
        "Labels that say what kind of value each thing holds, checked before the code runs",
        "A faster engine that makes your code run quicker in the browser and on the server",
        "A new set of built-in buttons and page layouts",
        "A database for storing your variables",
      ],
      answer: [0],
      explanation: "TypeScript adds type labels and a checker that reads them. It catches mistakes, like passing text where a number belongs, before you run anything. It doesn't change how fast the code runs.",
    },
    {
      id: "ts-b1-02", domain: "d1", lesson: "d1-b-what", level: "beginner",
      prompt: "A browser can't run a .ts file directly. What happens to your TypeScript before it runs?",
      options: [
        "A tool removes the type labels and produces plain JavaScript",
        "The browser downloads a TypeScript plug-in",
        "It's turned into Python first",
        "Nothing, TypeScript files run as they are everywhere",
      ],
      answer: [0],
      explanation: "The TypeScript compiler, or a similar tool, strips out the labels and writes ordinary JavaScript. That JavaScript is what the browser or Node.js actually runs. The labels only exist to help you while you write.",
    },
    {
      id: "ts-b1-03", domain: "d1", lesson: "d1-b-labels", level: "beginner", type: "fill",
      prompt: "Fill the gap so `isReady` can only hold `true` or `false`.",
      code: `let isReady: {{1}} = false;
isReady = true;`, codeLang: "ts",
      blanks: [{ options: ["boolean", "string", "number", "truefalse"], answer: 0 }],
      explanation: "`boolean` is the type for true or false. `string` is for text and `number` is for numbers. There's no type called `truefalse`.",
    },
    {
      id: "ts-b1-04", domain: "d1", lesson: "d1-b-labels", level: "beginner", type: "output",
      prompt: "TypeScript is happy with this code. What does it print?",
      code: `let count: number = 2;
count = count + 3;
console.log(count);`, codeLang: "ts",
      answers: ["5"],
      explanation: "`count` starts at 2, and the second line adds 3 and stores the result back in `count`. The label `number` doesn't change what the code does, it only stops you from storing text in `count`. So it prints 5.",
    },
    {
      id: "ts-b1-05", domain: "d1", lesson: "d1-b-shapes", level: "beginner",
      prompt: "What does TypeScript say about this code?",
      code: `interface User {
  name: string;
  age: number;
}
const bob: User = { name: "Bob" };`, codeLang: "ts",
      options: [
        "It reports an error, because `age` is missing",
        "It's fine, missing properties are allowed",
        "It reports an error, because `name` should be a number",
        "It's fine, but `age` becomes 0",
      ],
      answer: [0],
      explanation: "The `User` interface says every user needs both a `name` and an `age`. This object only has a name, so TypeScript points out that `age` is missing. It never fills in a value for you.",
    },
    {
      id: "ts-b1-06", domain: "d1", lesson: "d1-b-shapes", level: "beginner", type: "output",
      prompt: "What does this print?",
      code: `interface Pet {
  name: string;
  legs: number;
}
const cat: Pet = { name: "Tom", legs: 4 };
console.log(cat.name + " has " + cat.legs + " legs");`, codeLang: "ts",
      answers: ["Tom has 4 legs"],
      explanation: "`cat.name` reads the name, \"Tom\", and `cat.legs` reads 4. Joining them with `+` builds one piece of text. The interface only checked that the object had the right boxes filled in.",
    },

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
      explanation: "TypeScript checks shapes. `p3` has an `x` and a `y` that are numbers, so it counts as a `Point`. The extra `z` is fine here because `p3` is a variable, not an object literal written straight into the call.",
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
      explanation: "The excess property check only looks at fresh object literals. Line 5 writes the literal straight into the call, so TypeScript reports \"Object literal may only specify known properties\". Line 4 passes a variable, so the extra `z` is allowed.",
    },
    {
      id: "d1-15", domain: "d1", lesson: "d1-structural", level: "junior",
      prompt: "How does TypeScript decide whether one object type is assignable to another?",
      options: ["By comparing their members (shape)", "By comparing their names", "By checking they were declared in the same file", "By checking the runtime constructor"],
      answer: [0],
      explanation: "TypeScript's type system is structural. A type fits if it has at least the members the target needs, with compatible types. The names of the types don't matter.",
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
      explanation: "`Cat` and `Robot` have the same public shape, so line 3 compiles. Private and protected members must come from the same declaration, so `Other` doesn't fit `Safe`. The error reads \"Types have separate declarations of a private property\".",
    },
    {
      id: "d1-23", domain: "d1", lesson: "d1-structural", level: "staff",
      prompt: "`UserId` and `OrderId` are both `string` aliases, and a production bug passed an order ID into `deleteUser(id)`. What's the best type-level fix to roll out across the codebase?",
      options: [
        "Branded types, e.g. `type UserId = string & { readonly __brand: \"UserId\" }`, created only by a validating constructor",
        "Rename the aliases so they're more descriptive",
        "Change both to `interface UserId { value: string }` and `interface OrderId { value: string }`, with the very same shape",
        "Use `any` for IDs and validate at runtime",
      ],
      answer: [0],
      explanation: "An alias is only a name, and structural typing treats same-shaped types as the same. A brand adds a made-up member that exists only in the type, so the shapes differ and nothing changes at runtime. One constructor function then controls where IDs get created.",
    },
    // ── type vs interface ──
    {
      id: "d1-03", domain: "d1", lesson: "d1-type-interface", level: "junior",
      prompt: "Which can a `type` alias express that an `interface` cannot? (Choose two.)",
      options: ["A union like `\"sm\" | \"md\" | \"lg\"`", "A mapped type like `{ [K in Keys]: boolean }`", "An object shape with methods", "A shape that a class can implement", "Optional properties"],
      answer: [0, 1],
      explanation: "Interfaces only describe object and function shapes. Unions, tuples, primitives, and mapped or conditional types need `type`. Both can have methods and optional properties, and a class can implement either one.",
    },
    {
      id: "d1-04", domain: "d1", lesson: "d1-type-interface", level: "intermediate", type: "lines",
      prompt: "Which line is a type error?",
      code: `interface Box { width: number }
interface Box { height: number }
const b: Box = { width: 1 };`, codeLang: "ts",
      answer: [3],
      explanation: "Two interfaces with the same name merge, so `Box` needs both `width` and `height`. Line 3 leaves out `height`. If you wrote `type Box` twice instead, you'd get a duplicate identifier error.",
    },
    {
      id: "d1-17", domain: "d1", lesson: "d1-type-interface", level: "senior",
      prompt: "What does TypeScript do with this code?",
      code: `interface A { id: string }
interface B extends A { id: number }
type C = A & { id: number };`, codeLang: "ts",
      options: [
        "`interface B` is an error at its declaration; `C` compiles, but `C[\"id\"]` is `never`",
        "Both compile, and `id` is `string | number` in each of them, as merged",
        "Both are errors at their declarations",
        "`B` compiles with `id: number`; `C` is an error",
      ],
      answer: [0],
      explanation: "`extends` checks that the new type is compatible and reports \"incorrectly extends interface\". An intersection never errors where you declare it. `string & number` becomes `never`, and you only find out when you try to create a value.",
    },
    {
      id: "d1-21", domain: "d1", lesson: "d1-type-interface", level: "staff",
      prompt: "The backend and frontend teams each hand-write TypeScript interfaces for the same REST API. They drift, and production sees runtime errors even though both sides compile. What's the best fix?",
      options: [
        "Generate the types on both sides from one source of truth (e.g. an OpenAPI or JSON schema), and validate responses at runtime at the boundary",
        "Ask both teams to review each other's interfaces every sprint, and copy any changed interface into the other repo by hand before each release goes out",
        "Mark every field as optional so mismatches don't fail",
        "Use `any` for API responses",
      ],
      answer: [0],
      explanation: "Types are removed before the code runs, so on their own they can't check what comes over the network. Generating both sides from one contract stops the drift. Checking responses at runtime catches whatever is actually sent.",
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
      explanation: "Inside the `if`, TypeScript knows `input` is a string. After the `if`, it's still `unknown`, and you can't call methods on an `unknown` value. The error reads \"'input' is of type 'unknown'\".",
    },
    {
      id: "d1-06", domain: "d1", lesson: "d1-top-bottom", level: "junior",
      prompt: "What's the safest type for the result of `JSON.parse` before you've validated it?",
      options: ["`unknown`", "`any`", "`object`", "`never`"],
      answer: [0],
      explanation: "`unknown` makes you check the value before you use it. `any` lets mistakes slip through silently. `object` is wrong when the JSON is a number or a string, and `never` means there's no value at all.",
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
      explanation: "`unknown` and `any` both accept every value, but only `any` lets you skip the checks. `never` has no values at all. `void` marks functions you call for what they do, not for what they return.",
    },
    {
      id: "d1-09", domain: "d1", lesson: "d1-top-bottom", level: "intermediate",
      prompt: "What happens with this code?",
      code: `const data: any = JSON.parse("{}");
const n: number = data.count.total;`, codeLang: "ts",
      options: ["It compiles, then throws a `TypeError` at runtime", "Type error: `count` does not exist", "Type error: `any` isn't assignable to `number`", "It compiles and `n` is `undefined`"],
      answer: [0],
      explanation: "`any` switches checking off, so the property chain and the assignment both compile. When it runs, `data.count` is `undefined`, and reading `.total` from it throws. With `unknown`, this code wouldn't compile.",
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
        "Both are inferred to return `undefined`, because neither function has a `return` statement",
      ],
      answer: [0],
      explanation: "To stay compatible with older code, a function declaration that never returns is inferred as `void`. Function expressions and arrow functions get `never`. If you mean `never`, write `: never` yourself.",
    },
    {
      id: "d1-18", domain: "d1", lesson: "d1-top-bottom", level: "senior",
      prompt: "What do `unknown | string` and `never | string` simplify to?",
      options: ["`unknown` and `string`", "`string` and `string`", "`unknown` and `never`", "They stay as written"],
      answer: [0],
      explanation: "`unknown` already contains every other type, so it swallows the rest of the union. `never` is empty, so it disappears from a union. That's why `never` is handy for filtering members out in conditional types.",
    },
    {
      id: "d1-24", domain: "d1", lesson: "d1-top-bottom", level: "senior",
      prompt: "Which declaration is a type error?",
      options: ["`const b: object = 42;`", "`const a: {} = 42;`", "`const c: unknown = 42;`", "`const d: Object = 42;`"],
      answer: [0],
      explanation: "`object` means anything that isn't a primitive, so a number doesn't fit. `{}` and `Object` accept every value except `null` and `undefined`, numbers included, which surprises a lot of people. `unknown` accepts everything.",
    },
    // ── Literals ──
    {
      id: "d1-10", domain: "d1", lesson: "d1-literals", level: "junior",
      prompt: "What are the inferred types of `a` and `b`?",
      code: `let a = "hi";
const b = "hi";`, codeLang: "ts",
      options: ["`a: string`, `b: \"hi\"`", "Both `string`", "Both `\"hi\"`", "`a: \"hi\"`, `b: string`"],
      answer: [0],
      explanation: "A `let` can be reassigned later, so TypeScript widens the literal to `string`. A `const` can't change, so it keeps the exact literal type `\"hi\"`.",
    },
    {
      id: "d1-11", domain: "d1", lesson: "d1-literals", level: "intermediate",
      prompt: "What is `Role`?",
      code: `const roles = ["admin", "user"] as const;
type Role = (typeof roles)[number];`, codeLang: "ts",
      options: ["`\"admin\" | \"user\"`", "`string`", "`string[]`", "`readonly string[]`"],
      answer: [0],
      explanation: "`as const` turns `roles` into the readonly tuple `readonly [\"admin\", \"user\"]`. Indexing it with `number` gives you the union of everything inside. Without `as const`, `Role` would just be `string`.",
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
      explanation: "The annotation on `a` widens `a.red` to `string | number[]`, and arrays have no `toUpperCase`. `satisfies` checks `b` against `Colors` but keeps the type TypeScript inferred, so `b.red` is still known to be a string.",
    },
    {
      id: "d1-13", domain: "d1", lesson: "d1-literals", level: "intermediate",
      prompt: "Why do many teams prefer `type Dir = \"up\" | \"down\"` over `enum Dir { Up, Down }`?",
      options: [
        "A string-literal union is erased at compile time and works with plain strings; an enum emits a runtime object and is TypeScript-only syntax",
        "Enums can't be used in switch statements",
        "A string-literal union is checked at runtime against its allowed values, while an enum is only a compile-time label that disappears from the emitted JavaScript entirely",
        "Enums are deprecated in TypeScript 5",
      ],
      answer: [0],
      explanation: "Enums aren't deprecated, but they generate JavaScript, so tools that only strip types can't handle them. A union adds no code at all, and callers can pass `\"up\"` directly. Neither one is checked at runtime.",
    },
    {
      id: "d1-14", domain: "d1", lesson: "d1-literals", level: "junior",
      prompt: "What does `value satisfies Type` do?",
      options: [
        "Checks that the value matches Type, while keeping the value's own, more specific inferred type",
        "Converts the value to Type at runtime",
        "Widens the value's type to Type, like an annotation",
        "Tells the compiler to trust the value without checking it at all, just like `as`",
      ],
      answer: [0],
      explanation: "`satisfies`, added in TypeScript 4.9, checks the value without changing its inferred type. An annotation widens the value to `Type`, and `as` skips most of the checking.",
    },
    {
      id: "d1-19", domain: "d1", lesson: "d1-literals", level: "junior", type: "lines",
      prompt: "Which line is a type error?",
      code: `const nums: readonly number[] = [1, 2, 3];
const first = nums[0];
nums.push(4);`, codeLang: "ts",
      answer: [3],
      explanation: "A readonly array has none of the methods that change it, so `push` doesn't exist on it. Reading an element, like `nums[0]`, is fine.",
    },
    {
      id: "d1-22", domain: "d1", lesson: "d1-literals", level: "staff",
      prompt: "A monorepo library is consumed by apps that run TypeScript through type-stripping tools (such as Node.js's built-in type stripping or `--erasableSyntaxOnly`). Its public API uses enums. What should you do?",
      options: [
        "Replace the enums with `as const` objects plus a derived union type, so the code is erasable and the runtime values stay the same",
        "Switch the enums to `const enum`",
        "Ask every app to turn off type stripping",
        "Keep the enums as they are and publish only `.d.ts` files for the package, since declaration output contains no runtime code and the type-stripping tool can then load it",
      ],
      answer: [0],
      explanation: "Enums need code generated for them, so tools that only strip types reject them. An `as const` object gives the same runtime values and an equivalent type. A `const enum` is even harder for tools that look at one file at a time, and dropping the JavaScript breaks anyone using the values at runtime.",
    },
    {
      id: "d1-20", domain: "d1", lesson: "d1-literals", level: "staff",
      prompt: "You're asked to move a 500k-line JavaScript codebase to TypeScript without freezing feature work. What's the best strategy?",
      options: [
        "Enable `allowJs`, convert files incrementally (leaf modules first), and tighten strict flags gradually with CI blocking new errors",
        "Rename every file to .ts in one big PR, add `any` wherever it fails to compile, and fix all of those later on",
        "Rewrite the application from scratch in TypeScript",
        "Turn on `strict` immediately and block all merges until there are zero errors",
      ],
      answer: [0],
      explanation: "Moving a bit at a time lets the team keep shipping, pays off early, and lets you tighten strictness step by step. Renaming everything at once buries the code in `any`. A rewrite or a merge freeze stalls the business.",
    },
  ],

  cards: [
    { id: "t1-structural", domain: "d1", kind: "concept", term: "Structural typing", definition: "Two types are compatible when their shapes match. Their names don't matter." },
    { id: "t1-excess", domain: "d1", kind: "concept", term: "Excess property check", definition: "An object literal written straight into a typed spot can't have properties the type doesn't list." },
    { id: "t1-merging", domain: "d1", kind: "concept", term: "Declaration merging", definition: "Interfaces with the same name combine into one. A type alias can't be reopened." },
    { id: "t1-brand", domain: "d1", kind: "concept", term: "Branded type", definition: "A primitive with a made-up tag, like `string & { __brand: \"UserId\" }`, so it can't be mixed up with other strings." },
    { id: "t1-unknown", domain: "d1", kind: "service", term: "unknown", definition: "The safe catch-all type. It accepts anything, but you must check the value before you use it." },
    { id: "t1-any", domain: "d1", kind: "service", term: "any", definition: "Turns type checking off for a value, in both directions." },
    { id: "t1-never", domain: "d1", kind: "service", term: "never", definition: "The type with no values. It disappears from unions and marks code that can't be reached." },
    { id: "t1-void", domain: "d1", kind: "service", term: "void", definition: "A return type that means \"don't use the result\"." },
    { id: "t1-asconst", domain: "d1", kind: "service", term: "as const", definition: "Keeps the narrowest literal types and makes everything readonly." },
    { id: "t1-satisfies", domain: "d1", kind: "service", term: "satisfies", definition: "Checks a value against a type without widening the type TypeScript inferred." },
    { id: "t1-readonly-arr", domain: "d1", kind: "service", term: "readonly T[]", definition: "An array type without `push`, `pop`, `splice` or any other method that changes it." },
    { id: "t1-widening", domain: "d1", kind: "concept", term: "Literal widening", definition: "`let x = \"a\"` gets the type `string`, while `const x = \"a\"` keeps the exact type `\"a\"`." },
    { id: "t1-enum", domain: "d1", kind: "concept", term: "Enum or union", definition: "An enum creates a real object in the JavaScript output. A literal union disappears when compiled and accepts plain values." },
  ],
});
