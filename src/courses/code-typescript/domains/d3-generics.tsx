import { CodeBlock, CodeCompare, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { UtilityBuilderLab } from "../labs";

/** Module 3: generics, constraints, keyof/typeof/indexed access, and utility types. */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Generics & Utility Types",
    world: "The Generic Forge",
    weight: 30,
    emoji: "🔨",
    color: "#a78bfa",
    summary: "Functions and types that work with many types at once, how to limit what they accept, how to read types from existing values with keyof and typeof, and the built-in utility types.",
  },

  tasks: [
    { id: "3.1", title: "Generics", covers: ["Type parameters and inference", "Defaults", "const type parameters", "Generics vs any vs unknown"] },
    { id: "3.2", title: "Constraints, keyof, typeof, indexed access", covers: ["`T extends …` constraints", "`K extends keyof T` and `T[K]`", "typeof in type positions", "Index signatures"] },
    { id: "3.3", title: "Utility types", covers: ["Partial, Required, Readonly", "Pick, Omit, Record", "ReturnType, Parameters, Awaited", "Deriving types from one source"] },
  ],

  lessons: [
    // ── Start here ──
    {
      id: "d3-b-arrays",
      level: "beginner",
      check: ["ts-b3-01", "ts-b3-02"],
      task: "3.1",
      title: "Lists where every item is the same kind",
      visual: (
        <CodeBlock
          lang="ts"
          code={`const scores: number[] = [90, 75, 88];
const names: Array<string> = ["Ada", "Bob"];  // same idea, longer spelling

scores.push(100);     // fine
scores.push("A+");    // error: "A+" is not a number`}
        />
      ),
      points: [
        "An array is a list of values in order, like a shopping list.",
        "`number[]` means \"a list of numbers\". `string[]` means \"a list of text\".",
        "You'll also see `Array<string>`. The angle brackets mean \"of\", so you read it as \"an array of strings\". It's the same type.",
        "TypeScript checks everything you add to the list, so a stray value of the wrong kind gets caught.",
      ],
      tip: "Those angle brackets are your first taste of generics. `Array` is a type that works with any kind of item, and you fill in which kind.",
    },
    {
      id: "d3-b-generic",
      level: "beginner",
      check: ["ts-b3-03", "ts-b3-04"],
      task: "3.1",
      title: "One function that works with any type",
      visual: (
        <CodeBlock
          lang="ts"
          code={`function firstItem<T>(list: T[]): T {
  return list[0];
}

const n = firstItem([10, 20]);        // T is number, so n is a number
const s = firstItem(["tea", "milk"]); // T is string, so s is a string`}
        />
      ),
      points: [
        "Sometimes a function doesn't care what kind of value it handles. Getting the first item works the same for numbers and for text.",
        "A generic function has a placeholder for the type, usually called `T`, written in angle brackets: `firstItem<T>`.",
        "Think of `T` as a blank on a form. When you call the function, TypeScript fills in the blank from what you pass.",
        "That way the result keeps its real type. Pass a list of numbers and TypeScript knows you get a number back.",
      ],
      tip: "You almost never type the `<number>` part yourself. TypeScript works it out from the arguments.",
    },
    {
      id: "d3-b-optional",
      level: "beginner",
      check: ["ts-b3-05", "ts-b3-06"],
      task: "3.3",
      title: "Optional properties",
      visual: (
        <CodeBlock
          lang="ts"
          code={`interface User {
  name: string;
  email?: string;   // the ? means "may be left out"
}

const ada: User = { name: "Ada" };                     // fine
const bob: User = { name: "Bob", email: "b@x.com" };   // also fine`}
        />
      ),
      points: [
        "Some details are nice to have but not required, like a middle name on a form.",
        "Put a question mark after the property name, as in `email?: string`, to make it optional.",
        "If you leave an optional property out and then read it, you get `undefined`.",
      ],
      tip: "TypeScript knows an optional property might be `undefined`, so it reminds you to check before you use it.",
    },

    // ── Junior and up ──
    {
      id: "d3-generics",
      level: "intermediate",
      check: ["d3-01", "d3-15"],
      task: "3.1",
      title: "Generics keep the link between in and out",
      visual: (
        <CodeCompare
          lang="ts"
          left={{ title: "any: the link is lost", code: `function first(arr: any[]): any {
  return arr[0];
}
const n = first([1, 2]); // any 😬
n.toUpperCase();         // compiles, crashes` }}
          right={{ title: "Generic: T flows through", code: `function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const n = first([1, 2]); // number | undefined
// n.toUpperCase();      // error, as it should be` }}
        />
      ),
      points: [
        "A type parameter is a variable that holds a type. Callers rarely write it, because TypeScript infers it from the arguments.",
        "Use a generic when the output type depends on the input type. If it doesn't, a plain type is simpler.",
        "A default, like `<T = string>`, is used when `T` can't be inferred and isn't given.",
        "A `const` type parameter, added in TypeScript 5.0, infers literal and readonly tuple types, as if the caller had written `as const`.",
      ],
      tip: "If a type parameter appears only once in a signature, you probably don't need it. Interviewers like hearing that rule.",
    },
    {
      id: "d3-constraints",
      level: "intermediate",
      check: ["d3-02", "d3-03"],
      task: "3.2",
      title: "Constraints: what T must have",
      visual: (
        <CodeBlock
          lang="ts"
          code={`function longest<T extends { length: number }>(a: T, b: T): T {
  return a.length >= b.length ? a : b;   // ok: T has length
}
longest("hi", "hello");        // T = string
longest([1, 2], [3]);          // T = number[]
// longest(10, 20);            // error: number has no length

function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}`}
        />
      ),
      points: [
        "Without a constraint, `T` could be anything, so TypeScript won't let you use any of its properties.",
        "`T extends Shape` means \"`T` must fit `Shape`\". `T` can still be something more specific.",
        "`K extends keyof T` limits a key to real property names of `T`. Then `T[K]` gives the type of the matching value.",
      ],
      tip: "When the body of a generic function won't compile, the fix is almost always a constraint, not a cast.",
    },
    {
      id: "d3-keyof",
      level: "intermediate",
      check: ["d3-05", "d3-06"],
      task: "3.2",
      title: "keyof, typeof, and indexed access",
      visual: (
        <CodeBlock
          lang="ts"
          code={`const config = { port: 8080, host: "localhost", tls: { enabled: true } };

type Config = typeof config;          // { port: number; host: string; tls: { enabled: boolean } }
type Key = keyof Config;              // "port" | "host" | "tls"
type Tls = Config["tls"];             // { enabled: boolean }
type Enabled = Config["tls"]["enabled"]; // boolean
type Values = Config[keyof Config];   // number | string | { enabled: boolean }`}
        />
      ),
      points: [
        "Written where a type goes, `typeof value` gives you the type of a real value. That lets you derive types from objects instead of writing them twice.",
        "`keyof T` is a union of the property names of `T`.",
        "`T[K]` reads the type of one property. `T[keyof T]` gives a union of every value type.",
        "For an index signature like `{ [k: string]: V }`, `keyof` gives `string | number`.",
      ],
      tip: "Combine them. `(typeof routes)[number]` and `keyof typeof config` are everyday tricks worth showing off.",
    },
    {
      id: "d3-utility",
      level: "intermediate",
      check: ["d3-09", "d3-08"],
      task: "3.3",
      title: "The utility-type toolbox",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "❓", title: "Partial<T>", text: "Every property optional", color: "#a78bfa" },
              { icon: "❗", title: "Required<T>", text: "Every property required", color: "#a78bfa" },
              { icon: "🔒", title: "Readonly<T>", text: "Every property readonly, one level deep", color: "#a78bfa" },
              { icon: "✂️", title: "Pick<T, K>", text: "Keep keys K (they must exist)", color: "#22d3ee" },
              { icon: "🗑️", title: "Omit<T, K>", text: "Drop keys K (not checked)", color: "#22d3ee" },
              { icon: "📒", title: "Record<K, V>", text: "Keys K, values V", color: "#22d3ee" },
              { icon: "↩️", title: "ReturnType<F>", text: "What a function type returns", color: "#f472b6" },
              { icon: "🎒", title: "Parameters<F>", text: "Its parameters as a tuple", color: "#f472b6" },
              { icon: "⏳", title: "Awaited<T>", text: "Unwraps promises, all the way down", color: "#f472b6" },
            ]}
          />
          <UtilityBuilderLab />
        </div>
      ),
      points: [
        "Utility types are ordinary mapped and conditional types that ship with TypeScript. You can stack them inside each other.",
        "Derive your variants, such as create, update and public versions, from one source type. Then a change in one place reaches all of them.",
        "The function utilities take a function type, so you write `ReturnType<typeof fn>`, not `ReturnType<fn>`.",
        "`Pick` checks that its keys exist. `Omit` accepts any string, so a typo slips through.",
      ],
      tip: "Be ready to write `Pick` or `Partial` yourself: `{ [P in K]: T[P] }` and `{ [P in keyof T]?: T[P] }`.",
    },
  ],

  questions: [
    // ── Start here ──
    {
      id: "ts-b3-01", domain: "d3", lesson: "d3-b-arrays", level: "beginner", type: "fill",
      prompt: "Fill the gap so `scores` is a list of numbers.",
      code: `const scores: {{1}}[] = [90, 75, 88];`, codeLang: "ts",
      blanks: [{ options: ["number", "string", "boolean", "list"], answer: 0 }],
      explanation: "Every item in the list is a number, so the type is `number[]`. `string[]` would be a list of text. There's no built-in type called `list`.",
    },
    {
      id: "ts-b3-02", domain: "d3", lesson: "d3-b-arrays", level: "beginner", type: "output",
      prompt: "What does this print?",
      code: `const names: string[] = ["Ada", "Bob"];
names.push("Cy");
console.log(names.length);`, codeLang: "ts",
      answers: ["3"],
      explanation: "The list starts with two names, and `push` adds a third to the end. `length` counts the items, so it prints 3. TypeScript allowed the `push` because \"Cy\" is a string.",
    },
    {
      id: "ts-b3-03", domain: "d3", lesson: "d3-b-generic", level: "beginner", type: "output",
      prompt: "What does this print?",
      code: `function wrap<T>(value: T): T[] {
  return [value];
}
const box = wrap("tea");
console.log(box[0]);`, codeLang: "ts",
      answers: ["tea"],
      explanation: "`wrap` puts whatever you give it inside a one-item list. You passed \"tea\", so `T` is `string` and `box` is `[\"tea\"]`. `box[0]` reads the first item, which prints tea.",
    },
    {
      id: "ts-b3-04", domain: "d3", lesson: "d3-b-generic", level: "beginner",
      prompt: "In `function firstItem<T>(list: T[]): T`, what is `T`?",
      options: [
        "A placeholder for a type, filled in by whatever you pass to the function",
        "A variable that always holds the text \"T\", which the function then prints out",
        "A shorter way of writing `true`",
        "The name of the list",
      ],
      answer: [0],
      explanation: "`T` is a type parameter: a blank that TypeScript fills in each time you call the function. Call it with numbers and `T` is `number`. Call it with text and `T` is `string`.",
    },
    {
      id: "ts-b3-05", domain: "d3", lesson: "d3-b-optional", level: "beginner",
      prompt: "Given `interface User { name: string; email?: string }`, which object is a valid `User`?",
      options: ["`{ name: \"Ada\" }`", "`{ email: \"ada@example.com\" }`", "`{}`"],
      answer: [0],
      explanation: "The `?` makes `email` optional, so you can leave it out. `name` has no `?`, so every user must have one. The other two objects are missing `name`.",
    },
    {
      id: "ts-b3-06", domain: "d3", lesson: "d3-b-optional", level: "beginner", type: "output",
      prompt: "What does this print?",
      code: `interface User {
  name: string;
  email?: string;
}
const u: User = { name: "Ada" };
console.log(u.email);`, codeLang: "ts",
      answers: ["undefined"],
      explanation: "`email` is optional and this object leaves it out. Reading a property that isn't there gives `undefined`, so that's what prints. It doesn't throw an error.",
    },

    // ── Generics ──
    {
      id: "d3-01", domain: "d3", lesson: "d3-generics", level: "junior",
      prompt: "What is the type of `x`?",
      code: `function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const x = first([1, 2, 3]);`, codeLang: "ts",
      options: ["`number | undefined`", "`number`", "`any`", "`unknown`, since an index lookup can't be typed"],
      answer: [0],
      explanation: "TypeScript infers `T` as `number` from the argument. The return type is `T | undefined`, because the array might be empty.",
    },
    {
      id: "d3-15", domain: "d3", lesson: "d3-generics", level: "junior",
      prompt: "Why write `function first<T>(arr: T[]): T` instead of `function first(arr: any[]): any`?",
      options: [
        "The generic keeps the link between the input and output types, so callers get a precise return type",
        "Generics make the function run faster",
        "`any[]` can't accept arrays of objects or tuples, so the generic version is needed to handle both of those",
        "Generics add a runtime type check",
      ],
      answer: [0],
      explanation: "With `any`, every result is `any` and mistakes go unnoticed. With `T`, `first([\"a\"])` is known to return a string. Generics are removed when compiled, so there's no runtime check and no speed difference.",
    },
    {
      id: "d3-14", domain: "d3", lesson: "d3-generics", level: "intermediate", type: "lines",
      prompt: "Which line is a type error?",
      code: `interface Box<T = string> {
  value: T;
}
const a: Box = { value: "hi" };
const b: Box<number> = { value: 1 };
const c: Box = { value: 1 };`, codeLang: "ts",
      answer: [6],
      explanation: "When you don't give a type argument, `Box` uses its default and becomes `Box<string>`, so `value` must be a string. Line 6 passes a number.",
    },
    {
      id: "d3-13", domain: "d3", lesson: "d3-generics", level: "senior",
      prompt: "What is the type of `r`?",
      code: `function routes<const T extends readonly string[]>(paths: T) {
  return paths;
}
const r = routes(["/home", "/about"]);`, codeLang: "ts",
      options: ["`readonly [\"/home\", \"/about\"]`", "`string[]`", "`readonly string[]`", "`(\"/home\" | \"/about\")[]` only"],
      answer: [0],
      explanation: "A `const` type parameter, from TypeScript 5.0, infers as if the argument were written `as const`. You get a readonly tuple of the exact strings. Without `const`, `T` would be `string[]`.",
    },
    {
      id: "d3-21", domain: "d3", lesson: "d3-generics", level: "staff",
      prompt: "A shared helper `fetchJson<T>(url: string): Promise<T>` lets callers choose any T, and bad responses crash deep in UI code. What's the best API change?",
      options: [
        "Return `Promise<unknown>`, or take a schema/validator argument that produces T, so the type is earned by validation",
        "Default T to `any`",
        "Add `T extends object` as a constraint",
        "Add a comment saying T must match the server's response, and wrap the body in try/catch so any mismatch is caught here",
      ],
      answer: [0],
      explanation: "A type parameter that only appears in the return type is a cast in disguise, because nothing checks it. Taking a validator means `T` comes from real evidence. Returning `unknown` makes callers do the check.",
    },
    // ── Constraints ──
    {
      id: "d3-02", domain: "d3", lesson: "d3-constraints", level: "intermediate", type: "lines",
      prompt: "Which line is a type error?",
      code: `function longest<T>(a: T, b: T) {
  return a.length >= b.length ? a : b;
}`, codeLang: "ts",
      answer: [2],
      explanation: "`T` has no constraint, so it could be a number or anything else. TypeScript reports \"Property 'length' does not exist on type 'T'\".",
    },
    {
      id: "d3-03", domain: "d3", lesson: "d3-constraints", level: "intermediate",
      prompt: "What's the best fix for `longest` so it works with strings and arrays?",
      code: `function longest<T>(a: T, b: T) {
  return a.length >= b.length ? a : b;
}`, codeLang: "ts",
      options: [
        "`function longest<T extends { length: number }>(a: T, b: T)`",
        "`function longest<T>(a: any, b: any)`",
        "`return (a as any).length >= (b as any).length ? a : b;`",
        "`function longest<T extends string>(a: T, b: T)`",
      ],
      answer: [0],
      explanation: "A constraint tells TypeScript what every possible `T` has, and the function still returns the caller's exact type. Casting to `any` throws the safety away, and `extends string` rules out arrays.",
    },
    {
      id: "d3-04", domain: "d3", lesson: "d3-constraints", level: "intermediate", type: "lines",
      prompt: "Which line is a type error?",
      code: `function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
const user = { id: 1, name: "Ada" };
const n = getProp(user, "name");
const e = getProp(user, "email");`, codeLang: "ts",
      answer: [6],
      explanation: "`K` must be a key of the user object, which only has \"id\" and \"name\", so \"email\" fails. On line 5, `n` is inferred as a string through `T[K]`.",
    },
    {
      id: "d3-22", domain: "d3", lesson: "d3-constraints", level: "staff",
      prompt: "Type-checking time in CI tripled after someone added deeply recursive generic utility types used across the monorepo. What's the best approach?",
      options: [
        "Measure with `tsc --extendedDiagnostics` / `--generateTrace`, then simplify or cap the hot recursive types (named interfaces over huge intersections, fewer nested conditionals)",
        "Turn off type-checking in CI and rely on the editor",
        "Set `skipLibCheck: false` to check more files",
        "Replace the generics with `any` everywhere they're used in the hot paths, and turn on `skipLibCheck` and `incremental` so the compiler stops re-checking the deep recursive types on each editor keystroke",
      ],
      answer: [0],
      explanation: "Measure first. A trace shows which types are expensive, so you can simplify those and keep the safety. Dropping the checks or spreading `any` throws the safety away.",
    },
    // ── keyof / typeof ──
    {
      id: "d3-05", domain: "d3", lesson: "d3-keyof", level: "intermediate",
      prompt: "What is `K`?",
      code: `type User = { id: number; name: string };
type K = keyof User;`, codeLang: "ts",
      options: ["`\"id\" | \"name\"`", "`string`", "`number | string`", "`[\"id\", \"name\"]`"],
      answer: [0],
      explanation: "`keyof` gives you a union of the property names, each as an exact string type.",
    },
    {
      id: "d3-06", domain: "d3", lesson: "d3-keyof", level: "intermediate",
      prompt: "What is `Config`?",
      code: `const config = { port: 8080, host: "localhost" };
type Config = typeof config;`, codeLang: "ts",
      options: ["`{ port: number; host: string }`", "`{ port: 8080; host: \"localhost\" }`", "`object`", "`\"object\"`"],
      answer: [0],
      explanation: "Where a type goes, `typeof` gives you a value's type. Object properties can be changed, so the literals widen to `number` and `string`. Adding `as const` would keep the exact values.",
    },
    {
      id: "d3-07", domain: "d3", lesson: "d3-keyof", level: "junior",
      prompt: "What is `City`?",
      code: `interface User {
  name: string;
  address: { city: string; zip: number };
}
type City = User["address"]["city"];`, codeLang: "ts",
      options: ["`string`", "`{ city: string; zip: number }`", "`\"city\"`", "A type error: use `User.address.city`"],
      answer: [0],
      explanation: "An indexed access type reads the type of a property, and you can chain them. Dot syntax doesn't work for types, so `User.address.city` would be wrong.",
    },
    {
      id: "d3-16", domain: "d3", lesson: "d3-keyof", level: "senior",
      prompt: "What is `K`?",
      code: `type Dict = { [key: string]: number };
type K = keyof Dict;`, codeLang: "ts",
      options: ["`string | number`", "`string`, since `T` is inferred from the first value", "`never`", "`\"key\"`"],
      answer: [0],
      explanation: "With a string index signature, number keys are allowed too, because JavaScript turns them into strings. So `keyof` includes `number`. Use `Extract<keyof T, string>` when you only want strings.",
    },
    // ── Utility types ──
    {
      id: "d3-08", domain: "d3", lesson: "d3-utility", level: "junior", type: "match",
      prompt: "Match each utility type with what it produces.",
      pairs: [
        ["`Partial<T>`", "Every property optional"],
        ["`Required<T>`", "Every property required"],
        ["`Readonly<T>`", "Every property readonly"],
        ["`Pick<T, K>`", "Only the keys in K"],
        ["`Omit<T, K>`", "Every key except those in K"],
        ["`Record<K, V>`", "An object with keys K and values V"],
      ],
      explanation: "These six cover most everyday needs. Each one is a mapped type you could write yourself.",
    },
    {
      id: "d3-09", domain: "d3", lesson: "d3-utility", level: "intermediate",
      prompt: "What does `Patch` resolve to?",
      code: `interface User { id: number; name: string; email: string }
type Patch = Partial<Omit<User, "id">>;`, codeLang: "ts",
      options: ["`{ name?: string; email?: string }`", "`{ id?: number; name?: string; email?: string }`", "`{ name: string; email: string }`", "`{ id: number; name?: string; email?: string }`"],
      answer: [0],
      explanation: "`Omit` removes `id` first, then `Partial` makes what's left optional. Nested utility types apply from the inside out.",
    },
    {
      id: "d3-10", domain: "d3", lesson: "d3-utility", level: "junior", type: "lines",
      prompt: "Which line is a type error?",
      code: `interface User { id: number; name: string }
function update(id: number, patch: Partial<User>) {}
update(1, { name: "Ada" });
update(1, {});
update(1, { age: 3 });`, codeLang: "ts",
      answer: [5],
      explanation: "`Partial` makes `id` and `name` optional, so lines 3 and 4 are fine. `age` isn't a property of `User`, and because the object literal is written straight into the call, the excess property check reports it.",
    },
    {
      id: "d3-11", domain: "d3", lesson: "d3-utility", level: "intermediate",
      prompt: "What are `U` and `P`?",
      code: `function makeUser(name: string, admin = false) {
  return { name, admin };
}
type U = ReturnType<typeof makeUser>;
type P = Parameters<typeof makeUser>;`, codeLang: "ts",
      options: [
        "`U = { name: string; admin: boolean }`, `P = [name: string, admin?: boolean]`",
        "`U = { name: string; admin: false }`, `P = [string, boolean]`",
        "`U = object`, `P = string[]`",
        "`U = { name: string; admin?: boolean }`, `P = [name: string]`, `R = void`",
      ],
      answer: [0],
      explanation: "`ReturnType` reads the inferred return type. `Parameters` gives a tuple with the parameter names as labels, and a parameter with a default value becomes optional.",
    },
    {
      id: "d3-12", domain: "d3", lesson: "d3-utility", level: "intermediate", type: "lines",
      prompt: "Which line is a type error?",
      code: `function makeUser(name: string) {
  return { name, createdAt: new Date() };
}
type A = ReturnType<typeof makeUser>;
type B = ReturnType<makeUser>;`, codeLang: "ts",
      answer: [5],
      explanation: "`makeUser` is a value, but utility types take types, so you need `typeof makeUser`. TypeScript reports \"'makeUser' refers to a value, but is being used as a type here\".",
    },
    {
      id: "d3-17", domain: "d3", lesson: "d3-utility", level: "senior", type: "lines",
      prompt: "Both lines contain the typo `\"nmae\"`. Which one is a type error?",
      code: `interface User { id: number; name: string }
type A = Omit<User, "nmae">;
type B = Pick<User, "nmae">;`, codeLang: "ts",
      answer: [3],
      explanation: "`Pick` requires `K extends keyof T`, so it catches the typo. `Omit` is declared with `K extends keyof any`, which allows any string, number or symbol. So line 2 compiles and quietly removes nothing.",
    },
    {
      id: "d3-18", domain: "d3", lesson: "d3-utility", level: "intermediate",
      prompt: "What happens?",
      code: `type Status = "idle" | "loading" | "done";
const labels: Record<Status, string> = {
  idle: "Idle",
  loading: "Loading…",
};`, codeLang: "ts",
      options: ["Type error: property `done` is missing", "It compiles; `labels.done` is `undefined`", "It compiles; Record makes keys optional", "Type error: `Record` needs a string key"],
      answer: [0],
      explanation: "A `Record` over a literal union needs every key. That makes it a handy completeness check: add a new status and TypeScript makes you add its label.",
    },
    {
      id: "d3-19", domain: "d3", lesson: "d3-utility", level: "intermediate", type: "lines",
      prompt: "Which line is a type error?",
      code: `const s: Readonly<{ user: { name: string } }> = {
  user: { name: "Ada" },
};
s.user.name = "Bob";
s.user = { name: "Cy" };`, codeLang: "ts",
      answer: [5],
      explanation: "`Readonly` only goes one level deep, so only `s.user` itself is readonly. The nested `name` can still be changed, which is why line 4 compiles. Use a recursive `DeepReadonly` if you need more.",
    },
    {
      id: "d3-23", domain: "d3", lesson: "d3-utility", level: "staff",
      prompt: "A widely used library exports an `Options` type. You need a new setting. How should you add it without breaking consumers?",
      options: [
        "Add it as an optional property with a sensible default in a minor release; save required changes for a major version with migration notes",
        "Add it as a required property in a patch release",
        "Create `Options2` and delete `Options`",
        "Type the new setting as `any` and mark it required in the same minor release, so that the compiler stays quiet in every existing config while users fill it in over time",
      ],
      answer: [0],
      explanation: "A new required property breaks every caller's object literal, which counts as a breaking change under semantic versioning. An optional property with a default keeps existing code compiling.",
    },
    {
      id: "d3-24", domain: "d3", lesson: "d3-utility", level: "staff",
      prompt: "Different teams copy-paste `User`, `UserWithoutPassword`, and `NewUser` interfaces, and they drift. What's the best fix?",
      options: [
        "Keep one source `User` type and derive the variants with utility types, e.g. `Omit<User, \"passwordHash\">` and `Omit<User, \"id\" | \"createdAt\">`",
        "Add a lint rule that bans interfaces with more than ten properties, then split `User` into separate hand-written interfaces for each API endpoint that needs it",
        "Merge all three into one type with every property optional",
        "Document the three interfaces on the wiki",
      ],
      answer: [0],
      explanation: "Derived types update on their own when the source changes. Making everything optional loses the guarantees each variant needs, and a wiki page drifts just like the copies did.",
    },
  ],

  cards: [
    { id: "t3-partial", domain: "d3", kind: "service", term: "Partial<T>", definition: "Makes every property of `T` optional." },
    { id: "t3-required", domain: "d3", kind: "service", term: "Required<T>", definition: "Makes every property of `T` required by removing the `?`." },
    { id: "t3-readonly", domain: "d3", kind: "service", term: "Readonly<T>", definition: "Marks every property readonly, but only one level deep." },
    { id: "t3-pick", domain: "d3", kind: "service", term: "Pick<T, K>", definition: "Keeps only the keys in `K`, which must be real keys of `T`." },
    { id: "t3-omit", domain: "d3", kind: "service", term: "Omit<T, K>", definition: "Drops the keys in `K`. It doesn't check that those keys exist on `T`." },
    { id: "t3-record", domain: "d3", kind: "service", term: "Record<K, V>", definition: "An object type with keys `K` and values `V`. With a literal union as `K`, every key is required." },
    { id: "t3-returntype", domain: "d3", kind: "service", term: "ReturnType<F>", definition: "The return type of a function type. For a function value, write `ReturnType<typeof fn>`." },
    { id: "t3-parameters", domain: "d3", kind: "service", term: "Parameters<F>", definition: "A function type's parameters as a tuple, labelled with their names." },
    { id: "t3-keyof", domain: "d3", kind: "service", term: "keyof", definition: "Gives a union of a type's property names." },
    { id: "t3-typeof", domain: "d3", kind: "service", term: "typeof (type position)", definition: "Used where a type goes, it gives the type of a real value or function." },
    { id: "t3-indexed", domain: "d3", kind: "concept", term: "Indexed access type", definition: "`T[K]` reads the type of property `K`. `T[number]` reads the type of an array's items." },
    { id: "t3-constraint", domain: "d3", kind: "concept", term: "Generic constraint", definition: "`T extends X` requires `T` to fit `X`, so you can use the members of `X` inside." },
    { id: "t3-default", domain: "d3", kind: "concept", term: "Type parameter default", definition: "`<T = string>` sets the type used when `T` isn't given and can't be inferred." },
    { id: "t3-const-param", domain: "d3", kind: "concept", term: "const type parameter", definition: "`<const T>` infers exact literal and readonly tuple types, as if the caller wrote `as const`." },
  ],

  challenges: [
    {
      id: "ch-ts-utility-patch",
      domain: "d3",
      lesson: "d3-utility",
      title: "Build a patch type",
      goal: "Build a type with only name and email, both optional.",
      hint: "You need two utilities: one to choose the keys and one to make them optional.",
      takeaway: "The answer is Partial<Pick<User, \"name\" | \"email\">>. Nested utility types apply from the inside out.",
      render: (onSolved) => <UtilityBuilderLab goal="patch" onSolved={onSolved} />,
    },
    {
      id: "ch-ts-utility-public",
      domain: "d3",
      lesson: "d3-utility",
      title: "Public profile",
      goal: "Build a read-only profile without password, keeping email optional.",
      hint: "Drop one key, then lock everything.",
      takeaway: "The answer is Readonly<Omit<User, \"password\">>. Omit and Pick keep each property's existing modifiers, so email stays optional.",
      render: (onSolved) => <UtilityBuilderLab goal="public" onSolved={onSolved} />,
    },
  ],
});
