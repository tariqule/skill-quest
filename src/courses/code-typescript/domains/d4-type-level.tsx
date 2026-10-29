import { CodeBlock, CodeCompare, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";

/** Module 4: mapped and conditional types, strict-mode options, and declaration files. */
export default defineDomain({
  domain: {
    id: "d4",
    number: 4,
    name: "Type-Level Programming & Config",
    world: "The Conditional Citadel",
    weight: 20,
    emoji: "🏯",
    color: "#f472b6",
    summary: "Mapped types and key remapping, conditional types, infer, distribution, the strict flags, declaration files, and shipping types.",
  },

  tasks: [
    { id: "4.1", title: "Mapped types", covers: ["{ [K in keyof T]: … }", "Modifiers: ?, readonly, -?, -readonly", "Key remapping with as and template literal types"] },
    { id: "4.2", title: "Conditional types and infer", covers: ["T extends U ? X : Y", "Distribution over unions and how to stop it", "infer", "Built-ins: Exclude, Extract, NonNullable, Awaited"] },
    { id: "4.3", title: "Strict mode and tsconfig", covers: ["What strict turns on", "Flags beyond strict", "isolatedModules, skipLibCheck", "Rolling out strictness"] },
    { id: "4.4", title: "Declaration files", covers: [".d.ts files and @types packages", "declare module and declare global", "Publishing typed libraries"] },
  ],

  lessons: [
    {
      id: "d4-mapped",
      level: "senior",
      check: ["d4-01", "d4-02"],
      task: "4.1",
      title: "Mapped types: loop over keys",
      visual: (
        <CodeBlock
          lang="ts"
          code={`type Flags<T>    = { [K in keyof T]: boolean };
type MyPartial<T> = { [K in keyof T]?: T[K] };
type Mutable<T>  = { -readonly [K in keyof T]: T[K] };   // remove readonly
type Concrete<T> = { [K in keyof T]-?: T[K] };           // remove ?

type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};
type G = Getters<{ name: string }>;  // { getName: () => string }`}
        />
      ),
      points: [
        "A mapped type builds a new object type by iterating over a union of keys, usually keyof T.",
        "Add modifiers with ? and readonly; remove them with -? and -readonly.",
        "Mapping over keyof T keeps the original modifiers (that's how Pick and Partial preserve readonly).",
        "The as clause renames keys, often with template literal types; mapping a key to never removes it.",
      ],
      tip: "Writing Partial or Readonly from scratch is a common warm-up. Start with { [K in keyof T]: T[K] } and add the modifier.",
    },
    {
      id: "d4-conditional",
      level: "senior",
      check: ["d4-04", "d4-06"],
      task: "4.2",
      title: "Conditional types, infer, and distribution",
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="ts"
            code={`type IsString<T> = T extends string ? "yes" : "no";
type A = IsString<"hi">;            // "yes"
type B = IsString<string | number>; // "yes" | "no"   distributes over the union
type C = [string | number] extends [string] ? "yes" : "no"; // "no"  wrapped: no distribution

type ElementOf<T> = T extends (infer U)[] ? U : never;
type E = ElementOf<string[]>;       // string`}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "➖", title: "Exclude<T, U>", text: "Members of T not assignable to U", color: "#f472b6" },
              { icon: "🎯", title: "Extract<T, U>", text: "Members of T assignable to U", color: "#f472b6" },
              { icon: "🚫", title: "NonNullable<T>", text: "T without null and undefined", color: "#f472b6" },
              { icon: "⏳", title: "Awaited<T>", text: "Unwraps nested promises", color: "#f472b6" },
            ]}
          />
        </div>
      ),
      points: [
        "A conditional type picks one branch based on assignability, like a ternary for types.",
        "When the checked type is a naked type parameter, the conditional distributes over each union member.",
        "Wrap both sides in a tuple ([T] extends [U]) to check the union as a whole.",
        "infer declares a type variable to capture part of the matched type.",
      ],
      tip: "Exclude is literally T extends U ? never : T. Explaining that shows you understand distribution and never in one breath.",
    },
    {
      id: "d4-strict",
      level: "intermediate",
      check: ["d4-09", "d4-12"],
      task: "4.3",
      title: "strict and the flags beyond it",
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🛡️", title: "In strict", text: "strictNullChecks, noImplicitAny, strictFunctionTypes, strictBindCallApply, strictPropertyInitialization, useUnknownInCatchVariables, alwaysStrict, noImplicitThis", color: "#34d399" },
            { icon: "🔬", title: "Stricter, opt-in", text: "noUncheckedIndexedAccess (index reads may be undefined), exactOptionalPropertyTypes (? doesn't mean | undefined)", color: "#fbbf24" },
            { icon: "🧱", title: "Build safety", text: "isolatedModules and verbatimModuleSyntax flag code that single-file transpilers (esbuild, SWC, Babel) can't emit correctly", color: "#38bdf8" },
            { icon: "⏩", title: "Speed trade-off", text: "skipLibCheck skips .d.ts files: faster builds, but errors in declaration files go unreported", color: "#f87171" },
          ]}
        />
      ),
      points: [
        "strict is a bundle of flags; new flags are added to it over time, so upgrading TypeScript can surface new errors.",
        "strictNullChecks is the big one: without it, null and undefined are assignable to everything.",
        "noUncheckedIndexedAccess and exactOptionalPropertyTypes are not part of strict.",
        "Roll out strictness flag by flag, or folder by folder, with CI blocking new errors.",
      ],
      tip: "If asked which flag matters most, say strictNullChecks and give an example of the bug class it prevents.",
    },
    {
      id: "d4-declarations",
      level: "senior",
      check: ["d4-14", "d4-15"],
      task: "4.4",
      title: "Declaration files and shipping types",
      visual: (
        <CodeCompare
          lang="ts"
          left={{ title: "types/legacy-lib.d.ts", code: `declare module "legacy-lib" {
  export function slugify(s: string): string;
  const version: string;
  export default version;
}` }}
          right={{ title: "globals.d.ts", code: `declare global {
  interface Window {
    analytics: { track(event: string): void };
  }
}
export {}; // makes this file a module` }}
        />
      ),
      points: [
        ".d.ts files contain only types: no runtime code is emitted from them.",
        "For an untyped package, first install @types/<name>; otherwise write a declare module block.",
        "declare global augments global types (like Window) and must live in a module file.",
        "Libraries should ship compiled JavaScript plus generated .d.ts files (declaration: true) and point to them from package.json.",
      ],
      tip: "Mention that declarations are promises the compiler can't check: a wrong .d.ts is a silent bug.",
    },
  ],

  questions: [
    // ── Mapped types ──
    {
      id: "d4-01", domain: "d4", lesson: "d4-mapped", level: "intermediate",
      prompt: "What is `F`?",
      code: `type Flags<T> = { [K in keyof T]: boolean };
type F = Flags<{ dark: string; beta: number }>;`, codeLang: "ts",
      options: ["`{ dark: boolean; beta: boolean }`", "`{ dark: string; beta: number }`", "`boolean[]`", "`{ [K: string]: boolean }`"],
      answer: [0],
      explanation: "The mapped type iterates over the keys \"dark\" and \"beta\" and gives each one the type boolean.",
    },
    {
      id: "d4-02", domain: "d4", lesson: "d4-mapped", level: "senior",
      prompt: "What is `M`?",
      code: `type Mutable<T> = { -readonly [K in keyof T]-?: T[K] };
type M = Mutable<{ readonly id: number; name?: string }>;`, codeLang: "ts",
      options: ["`{ id: number; name: string }`", "`{ readonly id: number; name?: string }`", "`{ id: number; name?: string }`", "`{ id: number; name: string | undefined }`"],
      answer: [0],
      explanation: "-readonly removes readonly and -? removes optionality. Removing ? also removes the undefined that optionality added, so name is string. That's exactly how Required works.",
    },
    {
      id: "d4-03", domain: "d4", lesson: "d4-mapped", level: "senior",
      prompt: "What is `G`?",
      code: `type Getters<T> = {
  [K in keyof T as \`get\${Capitalize<string & K>}\`]: () => T[K];
};
type G = Getters<{ name: string; age: number }>;`, codeLang: "ts",
      options: [
        "`{ getName: () => string; getAge: () => number }`",
        "`{ name: () => string; age: () => number }`",
        "`{ getname: () => string; getage: () => number }`",
        "A type error: keys can't be renamed in a mapped type",
      ],
      answer: [0],
      explanation: "The as clause remaps each key through a template literal type, and Capitalize upper-cases the first letter. `string & K` filters out symbol and number keys.",
    },
    {
      id: "d4-19", domain: "d4", lesson: "d4-mapped", level: "senior", type: "order",
      prompt: "Arrange the lines of a `DeepReadonly<T>` that leaves functions alone and makes nested objects readonly.",
      items: [
        "`type DeepReadonly<T> =`",
        "`  T extends (...args: any[]) => unknown ? T`",
        "`  : T extends object ? { readonly [K in keyof T]: DeepReadonly<T[K]> }`",
        "`  : T;`",
      ],
      explanation: "Functions are objects too, so they must be checked first, or the mapped type would turn them into empty object types. Objects recurse; primitives fall through unchanged.",
    },
    // ── Conditional types ──
    {
      id: "d4-04", domain: "d4", lesson: "d4-conditional", level: "senior",
      prompt: "What is `B`?",
      code: `type IsString<T> = T extends string ? "yes" : "no";
type A = IsString<"hi">;
type B = IsString<string | number>;`, codeLang: "ts",
      options: ["`\"yes\" | \"no\"`", "`\"no\"`", "`\"yes\"`", "`never`"],
      answer: [0],
      explanation: "A conditional over a naked type parameter distributes: it runs once for string (\"yes\") and once for number (\"no\"), then unions the results.",
    },
    {
      id: "d4-05", domain: "d4", lesson: "d4-conditional", level: "senior",
      prompt: "What is `B` now?",
      code: `type IsString<T> = [T] extends [string] ? "yes" : "no";
type B = IsString<string | number>;`, codeLang: "ts",
      options: ["`\"no\"`", "`\"yes\" | \"no\"`", "`\"yes\"`", "`never`"],
      answer: [0],
      explanation: "Wrapping T in a tuple stops distribution, so the whole union is checked at once. `[string | number]` isn't assignable to `[string]`, so the result is \"no\".",
    },
    {
      id: "d4-06", domain: "d4", lesson: "d4-conditional", level: "senior",
      prompt: "What are `E` and `N`?",
      code: `type ElementOf<T> = T extends (infer U)[] ? U : never;
type E = ElementOf<string[]>;
type N = ElementOf<number>;`, codeLang: "ts",
      options: ["`E = string`, `N = never`", "`E = string[]`, `N = number`", "`E = string`, `N = number`", "`E = unknown`, `N = never`"],
      answer: [0],
      explanation: "infer U captures the element type when T matches an array. number isn't an array, so the false branch gives never.",
    },
    {
      id: "d4-07", domain: "d4", lesson: "d4-conditional", level: "senior",
      prompt: "What is `X`?",
      code: `type Unwrap<T> = T extends Promise<infer U> ? U : T;
type X = Unwrap<Promise<Promise<number>>>;`, codeLang: "ts",
      options: ["`Promise<number>`", "`number`", "`Promise<Promise<number>>`", "`never`"],
      answer: [0],
      explanation: "Unwrap only peels one layer. The built-in Awaited is recursive, so `Awaited<Promise<Promise<number>>>` is number.",
    },
    {
      id: "d4-08", domain: "d4", lesson: "d4-conditional", level: "intermediate", type: "match",
      prompt: "Match each built-in conditional type with its result.",
      pairs: [
        ["`Exclude<\"a\" | \"b\" | \"c\", \"a\">`", "`\"b\" | \"c\"`"],
        ["`Extract<\"a\" | \"b\" | 1, string>`", "`\"a\" | \"b\"`"],
        ["`NonNullable<string | null | undefined>`", "`string`"],
        ["`Awaited<Promise<number>>`", "`number`"],
      ],
      explanation: "Exclude and Extract filter union members by assignability, NonNullable removes null and undefined, and Awaited unwraps promises.",
    },
    {
      id: "d4-22", domain: "d4", lesson: "d4-conditional", level: "staff",
      prompt: "A teammate wrote a 200-line recursive conditional type to infer every route's params from path strings. Error messages are unreadable and the editor is slow in that package. What's the best call?",
      options: [
        "Simplify: generate route types from the route config with a codegen step (or a shallow mapped type), and keep any remaining type-level code small, tested, and documented",
        "Add // @ts-ignore wherever errors appear",
        "Type every route param as any",
        "Raise the compiler's recursion limit",
      ],
      answer: [0],
      explanation: "Type-level code is code the whole team must maintain. Codegen or simpler types keep safety with readable errors and fast checks. ts-ignore and any remove the safety, and the recursion limit isn't configurable anyway.",
    },
    // ── Strict ──
    {
      id: "d4-09", domain: "d4", lesson: "d4-strict", level: "intermediate", type: "lines",
      prompt: "With `strict: true`, which line is a type error?",
      code: `function greet(name?: string) {
  const n = name ?? "friend";
  console.log(name.toUpperCase());
  return n;
}`, codeLang: "ts",
      answer: [3],
      explanation: "An optional parameter is `string | undefined`. Line 2 handles that, but line 3 uses name directly: \"'name' is possibly 'undefined'\". Use n instead.",
    },
    {
      id: "d4-10", domain: "d4", lesson: "d4-strict", level: "junior", type: "lines",
      prompt: "With `strict: true`, which line is a type error?",
      code: `function sum(a, b) {
  return a + b;
}
const s: number = sum(1, 2);`, codeLang: "ts",
      answer: [1],
      explanation: "noImplicitAny (part of strict) rejects parameters whose type can't be inferred: \"Parameter 'a' implicitly has an 'any' type\". Annotate them: `(a: number, b: number)`.",
    },
    {
      id: "d4-11", domain: "d4", lesson: "d4-strict", level: "senior", type: "lines",
      prompt: "With the tsconfig in the comment, which line is a type error?",
      code: `// tsconfig: "strict": true, "noUncheckedIndexedAccess": true
const scores: Record<string, number> = { ada: 3 };
const a = scores["ada"];
const doubled = a * 2;`, codeLang: "ts",
      answer: [4],
      explanation: "noUncheckedIndexedAccess makes index reads `number | undefined`, because any string key might be missing. Line 4 uses a without checking it first.",
    },
    {
      id: "d4-12", domain: "d4", lesson: "d4-strict", level: "intermediate",
      prompt: "Which flags does `strict: true` turn on? (Choose three.)",
      options: ["`strictNullChecks`", "`noImplicitAny`", "`strictFunctionTypes`", "`noUncheckedIndexedAccess`", "`exactOptionalPropertyTypes`"],
      answer: [0, 1, 2],
      explanation: "strict includes strictNullChecks, noImplicitAny, strictFunctionTypes, and more. noUncheckedIndexedAccess and exactOptionalPropertyTypes are stricter opt-ins you must enable separately.",
    },
    {
      id: "d4-13", domain: "d4", lesson: "d4-strict", level: "intermediate", type: "lines",
      prompt: "With `strict: true`, which line is a type error?",
      code: `class User {
  name: string;
  email?: string;
  id!: number;
}`, codeLang: "ts",
      answer: [2],
      explanation: "strictPropertyInitialization requires non-optional properties to be assigned in the constructor. email is optional, and `id!` uses a definite assignment assertion to opt out.",
    },
    {
      id: "d4-18", domain: "d4", lesson: "d4-strict", level: "senior", type: "lines",
      prompt: "With the tsconfig in the comment, which line is a type error?",
      code: `// tsconfig: "strict": true, "exactOptionalPropertyTypes": true
interface Prefs { theme?: "dark" | "light" }
const a: Prefs = {};
const b: Prefs = { theme: undefined };`, codeLang: "ts",
      answer: [4],
      explanation: "With exactOptionalPropertyTypes, `theme?:` means \"may be missing\", not \"may be undefined\". Writing undefined explicitly is an error unless the type says `| undefined`.",
    },
    {
      id: "d4-23", domain: "d4", lesson: "d4-strict", level: "senior",
      prompt: "Turning on `skipLibCheck: true` speeds up the build a lot. What do you give up?",
      options: [
        "Type-checking of all .d.ts files, yours and your dependencies', so errors inside declaration files go unreported",
        "Type-checking of your own .ts source files",
        "Emitting JavaScript for files in node_modules",
        "Resolution of @types packages",
      ],
      answer: [0],
      explanation: "skipLibCheck skips checking declaration files. Your .ts code is still checked against them. It's a common, reasonable trade-off, but conflicting or broken type packages can slip through.",
    },
    {
      id: "d4-20", domain: "d4", lesson: "d4-strict", level: "staff",
      prompt: "Turning on `strict` across a 300-package monorepo produces 40,000 errors. What's the best rollout?",
      options: [
        "Enable the flags one at a time per package (strictNullChecks last or separately), and use CI to block new errors while teams burn down the rest",
        "Turn it on everywhere and add @ts-expect-error to all 40,000 lines",
        "Wait until a quiet quarter and fix everything in one branch",
        "Keep strict off and rely on code review",
      ],
      answer: [0],
      explanation: "An incremental ratchet keeps shipping, gives each team a manageable scope, and stops the count from growing. Mass suppressions hide real bugs, and long-lived branches rot.",
    },
    // ── Declarations ──
    {
      id: "d4-14", domain: "d4", lesson: "d4-declarations", level: "junior",
      prompt: "What does a `.d.ts` file contain?",
      options: ["Type declarations only; it emits no JavaScript", "Compiled JavaScript with types inlined", "Runtime validation code for each type", "Source maps for TypeScript files"],
      answer: [0],
      explanation: "Declaration files describe the shape of JavaScript that exists elsewhere: a library, a global, or your own compiled output.",
    },
    {
      id: "d4-15", domain: "d4", lesson: "d4-declarations", level: "intermediate",
      prompt: "You import an npm package `legacy-lib` that ships no types, and TypeScript reports an implicit any module. What should you try first?",
      options: [
        "Install `@types/legacy-lib` if it exists; otherwise add a `declare module \"legacy-lib\"` block in a .d.ts file",
        "Rename your file to .js",
        "Turn off `strict`",
        "Copy the library's source into your project",
      ],
      answer: [0],
      explanation: "DefinitelyTyped often already has types. If not, a small hand-written module declaration covering the functions you use is quick and keeps strict mode on.",
    },
    {
      id: "d4-16", domain: "d4", lesson: "d4-declarations", level: "senior",
      prompt: "Why does this globals.d.ts end with `export {}`?",
      code: `declare global {
  interface Window { analytics: { track(event: string): void } }
}
export {};`, codeLang: "ts",
      options: [
        "`declare global` is only allowed in a module, and `export {}` makes the file a module",
        "It exports the `Window` interface to other files",
        "It prevents the file from emitting JavaScript",
        "It's required in every .d.ts file",
      ],
      answer: [0],
      explanation: "A file without imports or exports is a global script, where `declare global` isn't allowed. An empty export turns it into a module so the augmentation is valid.",
    },
    {
      id: "d4-17", domain: "d4", lesson: "d4-declarations", level: "junior", type: "match",
      prompt: "Match each declaration with what it does.",
      pairs: [
        ["`declare const VERSION: string;`", "Types a global value that exists at runtime"],
        ["`declare module \"legacy-lib\" { … }`", "Types a module that has no types of its own"],
        ["`declare global { interface Window { … } }`", "Adds properties to a global type"],
        ["`npm i -D @types/express`", "Installs community-maintained types"],
      ],
      explanation: "declare never emits code: it tells the compiler something already exists. @types packages come from DefinitelyTyped.",
    },
    {
      id: "d4-21", domain: "d4", lesson: "d4-declarations", level: "staff",
      prompt: "You're publishing a TypeScript library for both JavaScript and TypeScript apps. What should the package ship?",
      options: [
        "Compiled JavaScript plus generated .d.ts files (`declaration: true`), with `types` / `exports` in package.json pointing at them",
        "Only the .ts source files, so consumers compile them",
        "Compiled JavaScript only; TypeScript users can write their own types",
        "A single bundled .d.ts with `any` for every export",
      ],
      answer: [0],
      explanation: "JavaScript users need runnable JS, TypeScript users need declarations that match it. Shipping raw .ts forces every consumer's compiler settings onto your code.",
    },
    {
      id: "d4-24", domain: "d4", lesson: "d4-declarations", level: "staff",
      prompt: "Your team switches to a bundler that transpiles each file on its own (esbuild or SWC) and runs `tsc` only for type-checking. What should tsconfig enforce?",
      options: [
        "`isolatedModules: true` (or `verbatimModuleSyntax`), so code that needs cross-file type information to emit, like type re-exports without `export type` or const enums, is flagged",
        "`skipLibCheck: false`",
        "`declaration: true`",
        "`noEmitOnError: false`",
      ],
      answer: [0],
      explanation: "Single-file transpilers can't see other files' types, so they can't tell whether a re-export is a type or a value. isolatedModules makes tsc reject those patterns so the build output is correct.",
    },
  ],

  cards: [
    { id: "t4-mapped", domain: "d4", kind: "concept", term: "Mapped type", definition: "{ [K in Keys]: … } builds an object type by iterating over a union of keys." },
    { id: "t4-remap", domain: "d4", kind: "concept", term: "Key remapping (as)", definition: "Renames or filters keys in a mapped type; mapping a key to never removes it." },
    { id: "t4-conditional", domain: "d4", kind: "concept", term: "Conditional type", definition: "T extends U ? X : Y picks a branch by assignability." },
    { id: "t4-distributive", domain: "d4", kind: "concept", term: "Distributive conditional", definition: "A naked type parameter is checked per union member. Wrap in [T] to stop it." },
    { id: "t4-infer", domain: "d4", kind: "service", term: "infer", definition: "Captures part of a matched type inside a conditional, e.g. T extends (infer U)[]." },
    { id: "t4-exclude", domain: "d4", kind: "service", term: "Exclude<T, U>", definition: "Removes union members of T that are assignable to U." },
    { id: "t4-extract", domain: "d4", kind: "service", term: "Extract<T, U>", definition: "Keeps union members of T that are assignable to U." },
    { id: "t4-nonnullable", domain: "d4", kind: "service", term: "NonNullable<T>", definition: "T without null and undefined." },
    { id: "t4-awaited", domain: "d4", kind: "service", term: "Awaited<T>", definition: "Recursively unwraps promise types, like await does." },
    { id: "t4-strictnull", domain: "d4", kind: "service", term: "strictNullChecks", definition: "null and undefined are separate types that must be handled explicitly." },
    { id: "t4-unchecked", domain: "d4", kind: "service", term: "noUncheckedIndexedAccess", definition: "Index reads include | undefined. Not part of strict." },
    { id: "t4-isolated", domain: "d4", kind: "service", term: "isolatedModules", definition: "Flags code that single-file transpilers can't emit correctly." },
    { id: "t4-dts", domain: "d4", kind: "concept", term: ".d.ts file", definition: "Declarations only: describes JavaScript that exists elsewhere, emits nothing." },
    { id: "t4-declare-module", domain: "d4", kind: "service", term: "declare module", definition: "Declares the types of a module by name, e.g. an untyped npm package." },
  ],
});
