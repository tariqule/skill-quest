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
    summary: "Generic functions and types, constraints and defaults, keyof, typeof, indexed access, and the built-in utility types.",
  },

  tasks: [
    { id: "3.1", title: "Generics", covers: ["Type parameters and inference", "Defaults", "const type parameters", "Generics vs any vs unknown"] },
    { id: "3.2", title: "Constraints, keyof, typeof, indexed access", covers: ["`T extends …` constraints", "`K extends keyof T` and `T[K]`", "typeof in type positions", "Index signatures"] },
    { id: "3.3", title: "Utility types", covers: ["Partial, Required, Readonly", "Pick, Omit, Record", "ReturnType, Parameters, Awaited", "Deriving types from one source"] },
  ],

  lessons: [
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
        "A type parameter is a variable for types. Callers usually don't write it: TypeScript infers it from the arguments.",
        "Use generics when the output type depends on the input type; otherwise a plain type is simpler.",
        "Defaults (<T = string>) apply when T can't be inferred or isn't given.",
        "const type parameters (TypeScript 5.0) infer literal and readonly tuple types, as if the caller wrote as const.",
      ],
      tip: "If a type parameter appears only once in a signature, it's probably not needed. Interviewers like hearing that rule.",
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
        "Without a constraint, T could be anything, so you can't use any of its properties.",
        "T extends Shape means \"T must be assignable to Shape\"; T can still be more specific.",
        "K extends keyof T limits keys to real property names, and T[K] gives the matching value type.",
      ],
      tip: "When a generic body doesn't compile, the fix is almost always a constraint, not a cast.",
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
        "typeof value in a type position gives the type of a runtime value: derive types from objects instead of duplicating them.",
        "keyof T is the union of T's property names.",
        "T[K] (indexed access) reads a property's type; T[keyof T] gives the union of all value types.",
        "For an index signature { [k: string]: V }, keyof is string | number.",
      ],
      tip: "Combine them: (typeof routes)[number] and keyof typeof config are everyday tricks worth showing.",
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
              { icon: "🔒", title: "Readonly<T>", text: "Every property readonly (shallow)", color: "#a78bfa" },
              { icon: "✂️", title: "Pick<T, K>", text: "Keep keys K (must exist)", color: "#22d3ee" },
              { icon: "🗑️", title: "Omit<T, K>", text: "Drop keys K (not checked)", color: "#22d3ee" },
              { icon: "📒", title: "Record<K, V>", text: "Keys K, values V", color: "#22d3ee" },
              { icon: "↩️", title: "ReturnType<F>", text: "What a function type returns", color: "#f472b6" },
              { icon: "🎒", title: "Parameters<F>", text: "Its parameters as a tuple", color: "#f472b6" },
              { icon: "⏳", title: "Awaited<T>", text: "Unwraps promises, recursively", color: "#f472b6" },
            ]}
          />
          <UtilityBuilderLab />
        </div>
      ),
      points: [
        "Utility types are ordinary mapped and conditional types shipped with TypeScript; they compose.",
        "Derive variants (create, update, public) from one source type so a change in one place flows everywhere.",
        "Function utilities take a function type: ReturnType<typeof fn>, not ReturnType<fn>.",
        "Pick checks its keys exist; Omit accepts any string, so typos slip through.",
      ],
      tip: "Be ready to write Pick or Partial yourself: { [P in K]: T[P] } and { [P in keyof T]?: T[P] }.",
    },
  ],

  questions: [
    // ── Generics ──
    {
      id: "d3-01", domain: "d3", lesson: "d3-generics", level: "junior",
      prompt: "What is the type of `x`?",
      code: `function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const x = first([1, 2, 3]);`, codeLang: "ts",
      options: ["`number | undefined`", "`number`", "`any`", "`unknown`"],
      answer: [0],
      explanation: "T is inferred as number from the argument, and the return type is `T | undefined`, because the array might be empty.",
    },
    {
      id: "d3-15", domain: "d3", lesson: "d3-generics", level: "junior",
      prompt: "Why write `function first<T>(arr: T[]): T` instead of `function first(arr: any[]): any`?",
      options: [
        "The generic keeps the link between the input and output types, so callers get a precise return type",
        "Generics make the function run faster",
        "`any[]` can't accept arrays of objects",
        "Generics add a runtime type check",
      ],
      answer: [0],
      explanation: "With any, every result is any and mistakes go unnoticed. With T, `first([\"a\"])` is known to be a string. Generics are erased, so there's no runtime check or speed difference.",
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
      explanation: "With no type argument, Box uses its default, Box<string>, so value must be a string. Line 6 passes a number.",
    },
    {
      id: "d3-13", domain: "d3", lesson: "d3-generics", level: "senior",
      prompt: "What is the type of `r`?",
      code: `function routes<const T extends readonly string[]>(paths: T) {
  return paths;
}
const r = routes(["/home", "/about"]);`, codeLang: "ts",
      options: ["`readonly [\"/home\", \"/about\"]`", "`string[]`", "`readonly string[]`", "`(\"/home\" | \"/about\")[]`"],
      answer: [0],
      explanation: "A `const` type parameter (TypeScript 5.0) infers as if the argument were written `as const`: a readonly tuple of literals. Without const, T would be string[].",
    },
    {
      id: "d3-21", domain: "d3", lesson: "d3-generics", level: "staff",
      prompt: "A shared helper `fetchJson<T>(url: string): Promise<T>` lets callers choose any T, and bad responses crash deep in UI code. What's the best API change?",
      options: [
        "Return `Promise<unknown>`, or take a schema/validator argument that produces T, so the type is earned by validation",
        "Default T to `any`",
        "Add `T extends object` as a constraint",
        "Add a comment saying T must match the server",
      ],
      answer: [0],
      explanation: "A type parameter that appears only in the return type is a disguised cast: nothing checks it. Taking a validator makes T come from runtime evidence; returning unknown forces callers to check.",
    },
    // ── Constraints ──
    {
      id: "d3-02", domain: "d3", lesson: "d3-constraints", level: "intermediate", type: "lines",
      prompt: "Which line is a type error?",
      code: `function longest<T>(a: T, b: T) {
  return a.length >= b.length ? a : b;
}`, codeLang: "ts",
      answer: [2],
      explanation: "T is unconstrained, so it could be a number or anything else: \"Property 'length' does not exist on type 'T'\".",
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
      explanation: "A constraint tells TypeScript what every possible T has, while still returning the caller's exact type. Casting to any loses safety, and `extends string` rules out arrays.",
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
      explanation: "K must be a key of the user object, which only has \"id\" and \"name\". On line 5, n is inferred as string, via T[K].",
    },
    {
      id: "d3-22", domain: "d3", lesson: "d3-constraints", level: "staff",
      prompt: "Type-checking time in CI tripled after someone added deeply recursive generic utility types used across the monorepo. What's the best approach?",
      options: [
        "Measure with `tsc --extendedDiagnostics` / `--generateTrace`, then simplify or cap the hot recursive types (named interfaces over huge intersections, fewer nested conditionals)",
        "Turn off type-checking in CI and rely on the editor",
        "Set `skipLibCheck: false` to check more files",
        "Replace the generics with `any` everywhere they're used",
      ],
      answer: [0],
      explanation: "Profile first: traces show which types are expensive. Targeted simplification keeps the safety; dropping checks or spreading any throws it away.",
    },
    // ── keyof / typeof ──
    {
      id: "d3-05", domain: "d3", lesson: "d3-keyof", level: "intermediate",
      prompt: "What is `K`?",
      code: `type User = { id: number; name: string };
type K = keyof User;`, codeLang: "ts",
      options: ["`\"id\" | \"name\"`", "`string`", "`number | string`", "`[\"id\", \"name\"]`"],
      answer: [0],
      explanation: "keyof produces a union of the property names as string literal types.",
    },
    {
      id: "d3-06", domain: "d3", lesson: "d3-keyof", level: "intermediate",
      prompt: "What is `Config`?",
      code: `const config = { port: 8080, host: "localhost" };
type Config = typeof config;`, codeLang: "ts",
      options: ["`{ port: number; host: string }`", "`{ port: 8080; host: \"localhost\" }`", "`object`", "`\"object\"`"],
      answer: [0],
      explanation: "In a type position, typeof gives a value's static type. Object properties are mutable, so the literals widen to number and string. (`as const` would keep them.)",
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
      explanation: "Indexed access types read a property's type and can be chained. Dot syntax doesn't work in types.",
    },
    {
      id: "d3-16", domain: "d3", lesson: "d3-keyof", level: "senior",
      prompt: "What is `K`?",
      code: `type Dict = { [key: string]: number };
type K = keyof Dict;`, codeLang: "ts",
      options: ["`string | number`", "`string`", "`never`", "`\"key\"`"],
      answer: [0],
      explanation: "With a string index signature, numeric keys are allowed too (JavaScript turns them into strings), so keyof includes number. Use `Extract<keyof T, string>` when you only want strings.",
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
      explanation: "These six cover most day-to-day needs. All of them are mapped types you could write yourself.",
    },
    {
      id: "d3-09", domain: "d3", lesson: "d3-utility", level: "intermediate",
      prompt: "What does `Patch` resolve to?",
      code: `interface User { id: number; name: string; email: string }
type Patch = Partial<Omit<User, "id">>;`, codeLang: "ts",
      options: ["`{ name?: string; email?: string }`", "`{ id?: number; name?: string; email?: string }`", "`{ name: string; email: string }`", "`{ id: number; name?: string; email?: string }`"],
      answer: [0],
      explanation: "Omit removes id first, then Partial makes the remaining properties optional. Utility types apply inside out.",
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
      explanation: "Partial makes id and name optional, so lines 3 and 4 are fine. `age` isn't a property of User, and the fresh literal triggers an excess property error.",
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
        "`U = { name: string; admin?: boolean }`, `P = [name: string]`",
      ],
      answer: [0],
      explanation: "ReturnType reads the inferred return type. Parameters gives a labelled tuple, and a parameter with a default value becomes optional.",
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
      explanation: "makeUser is a value. Utility types take types, so you need `typeof makeUser`: \"'makeUser' refers to a value, but is being used as a type here\".",
    },
    {
      id: "d3-17", domain: "d3", lesson: "d3-utility", level: "senior", type: "lines",
      prompt: "Both lines contain the typo `\"nmae\"`. Which one is a type error?",
      code: `interface User { id: number; name: string }
type A = Omit<User, "nmae">;
type B = Pick<User, "nmae">;`, codeLang: "ts",
      answer: [3],
      explanation: "Pick requires `K extends keyof T`, so the typo is caught. Omit is declared with `K extends keyof any` (any string, number, or symbol), so line 2 compiles and silently omits nothing.",
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
      explanation: "Record over a literal union requires every key. That makes it a great exhaustiveness tool: adding a status forces you to add its label.",
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
      explanation: "Readonly is shallow: only s.user itself is readonly. The nested name can still be changed on line 4. Use a recursive DeepReadonly if you need more.",
    },
    {
      id: "d3-23", domain: "d3", lesson: "d3-utility", level: "staff",
      prompt: "A widely used library exports an `Options` type. You need a new setting. How should you add it without breaking consumers?",
      options: [
        "Add it as an optional property with a sensible default in a minor release; save required changes for a major version with migration notes",
        "Add it as a required property in a patch release",
        "Create `Options2` and delete `Options`",
        "Type the new setting as `any` so it never errors",
      ],
      answer: [0],
      explanation: "A new required property breaks every caller's object literal, which is a breaking change under semver. Optional with a default keeps existing code compiling.",
    },
    {
      id: "d3-24", domain: "d3", lesson: "d3-utility", level: "staff",
      prompt: "Different teams copy-paste `User`, `UserWithoutPassword`, and `NewUser` interfaces, and they drift. What's the best fix?",
      options: [
        "Keep one source `User` type and derive the variants with utility types, e.g. `Omit<User, \"passwordHash\">` and `Omit<User, \"id\" | \"createdAt\">`",
        "Add a lint rule that bans interfaces with more than ten properties",
        "Merge all three into one type with every property optional",
        "Document the three interfaces on the wiki",
      ],
      answer: [0],
      explanation: "Derived types update automatically when the source changes. All-optional types lose the guarantees each variant needs, and documentation drifts too.",
    },
  ],

  cards: [
    { id: "t3-partial", domain: "d3", kind: "service", term: "Partial<T>", definition: "Makes every property of T optional." },
    { id: "t3-required", domain: "d3", kind: "service", term: "Required<T>", definition: "Makes every property of T required (removes ?)." },
    { id: "t3-readonly", domain: "d3", kind: "service", term: "Readonly<T>", definition: "Marks every property readonly. Shallow." },
    { id: "t3-pick", domain: "d3", kind: "service", term: "Pick<T, K>", definition: "Keeps only keys K. K must be keys of T." },
    { id: "t3-omit", domain: "d3", kind: "service", term: "Omit<T, K>", definition: "Drops keys K. K isn't checked against T." },
    { id: "t3-record", domain: "d3", kind: "service", term: "Record<K, V>", definition: "Object type with keys K and values V; with a literal union, every key is required." },
    { id: "t3-returntype", domain: "d3", kind: "service", term: "ReturnType<F>", definition: "The return type of function type F: use ReturnType<typeof fn>." },
    { id: "t3-parameters", domain: "d3", kind: "service", term: "Parameters<F>", definition: "A function type's parameters as a labelled tuple." },
    { id: "t3-keyof", domain: "d3", kind: "service", term: "keyof", definition: "Type operator giving the union of a type's keys." },
    { id: "t3-typeof", domain: "d3", kind: "service", term: "typeof (type position)", definition: "The static type of a runtime value or function." },
    { id: "t3-indexed", domain: "d3", kind: "concept", term: "Indexed access type", definition: "T[K] reads the type of property K; T[number] reads array elements." },
    { id: "t3-constraint", domain: "d3", kind: "concept", term: "Generic constraint", definition: "T extends X requires T to be assignable to X, so you can use X's members." },
    { id: "t3-default", domain: "d3", kind: "concept", term: "Type parameter default", definition: "<T = string>: used when T isn't provided or inferred." },
    { id: "t3-const-param", domain: "d3", kind: "concept", term: "const type parameter", definition: "<const T> infers literal and readonly tuple types, as if called with as const." },
  ],

  challenges: [
    {
      id: "ch-ts-utility-patch",
      domain: "d3",
      lesson: "d3-utility",
      title: "Build a patch type",
      goal: "Build a type with only name and email, both optional.",
      hint: "Two utilities: one to choose the keys, one to make them optional.",
      takeaway: "Partial<Pick<User, \"name\" | \"email\">>. Utility types compose from the inside out.",
      render: (onSolved) => <UtilityBuilderLab goal="patch" onSolved={onSolved} />,
    },
    {
      id: "ch-ts-utility-public",
      domain: "d3",
      lesson: "d3-utility",
      title: "Public profile",
      goal: "Build a read-only profile without password, keeping email optional.",
      hint: "Drop one key, then lock everything.",
      takeaway: "Readonly<Omit<User, \"password\">>. Omit and Pick keep each property's existing modifiers.",
      render: (onSolved) => <UtilityBuilderLab goal="public" onSolved={onSolved} />,
    },
  ],
});
