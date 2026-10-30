import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
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
    summary: "Building new types from old ones with mapped and conditional types and infer, choosing the right strict settings in tsconfig, and writing and shipping declaration files.",
  },

  tasks: [
    { id: "4.1", title: "Mapped types", covers: ["{ [K in keyof T]: … }", "Modifiers: ?, readonly, -?, -readonly", "Key remapping with as and template literal types"] },
    { id: "4.2", title: "Conditional types and infer", covers: ["T extends U ? X : Y", "Distribution over unions and how to stop it", "infer", "Built-ins: Exclude, Extract, NonNullable, Awaited"] },
    { id: "4.3", title: "Strict mode and tsconfig", covers: ["What strict turns on", "Flags beyond strict", "isolatedModules, skipLibCheck", "Rolling out strictness"] },
    { id: "4.4", title: "Declaration files", covers: [".d.ts files and @types packages", "declare module and declare global", "Publishing typed libraries"] },
  ],

  lessons: [
    // ── Start here ──
    {
      id: "d4-b-alias",
      level: "beginner",
      check: ["ts-b4-01", "ts-b4-02"],
      task: "4.1",
      title: "Giving a type a name",
      visual: (
        <CodeBlock
          lang="ts"
          code={`type Point = { x: number; y: number };
type Size = "small" | "medium" | "large";

const home: Point = { x: 2, y: 5 };
const shirt: Size = "medium";`}
        />
      ),
      points: [
        "Writing `{ x: number; y: number }` every time gets tiring. You can give it a name once and reuse it.",
        "The keyword `type` does that: `type Point = { x: number; y: number }`. It's like saving a contact in your phone instead of typing the number each time.",
        "After that, `Point` works anywhere a type goes, such as on a variable or a function parameter.",
        "A named type is called a type alias. Later in this module you'll see how to build new types out of existing ones.",
      ],
      tip: "Start type names with a capital letter, like `Point` or `Size`, so they stand out from ordinary variables.",
    },
    {
      id: "d4-b-tsconfig",
      level: "beginner",
      check: ["ts-b4-03", "ts-b4-04"],
      task: "4.3",
      title: "The settings file and strict mode",
      visual: (
        <Flow
          color="#f472b6"
          steps={[
            { icon: "⚙️", label: "tsconfig.json", sub: "Your project's settings" },
            { icon: "🛡️", label: "\"strict\": true", sub: "Turns on the careful checks" },
            { icon: "🔍", label: "npx tsc", sub: "Checks every file" },
            { icon: "✅", label: "Errors listed", sub: "Fix them before you ship" },
          ]}
        />
      ),
      points: [
        "A TypeScript project keeps its settings in a file called `tsconfig.json`. It's like the settings screen on a washing machine.",
        "The most important setting is `\"strict\": true`. It switches on a group of extra checks that catch many more bugs.",
        "You run the checker with `npx tsc`. It reads the settings, checks every file, and lists anything that's wrong.",
      ],
      tip: "Turn on `strict` from day one in a new project. Adding it later to a big codebase is much more work.",
    },
    {
      id: "d4-b-missing",
      level: "beginner",
      check: ["ts-b4-05", "ts-b4-06"],
      task: "4.3",
      title: "When a value might be missing",
      visual: (
        <CodeBlock
          lang="ts"
          code={`function greet(name?: string) {
  // name is string | undefined here
  return "Hi " + (name ?? "friend");
}

greet("Ada"); // "Hi Ada"
greet();      // "Hi friend"`}
        />
      ),
      points: [
        "In JavaScript, a missing value is usually `undefined` or `null`. Using one by mistake is one of the most common crashes.",
        "With `strict` on, TypeScript keeps track of values that might be missing and makes you handle them.",
        "A quick way to handle them is `??`. `name ?? \"friend\"` means \"use `name`, but if it's missing, use \"friend\" instead\".",
      ],
      tip: "When TypeScript says a value is \"possibly undefined\", it's pointing at a real crash waiting to happen. Give it a fallback or check it first.",
    },

    // ── Junior and up ──
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
        "A mapped type builds a new object type by going through a union of keys one at a time, usually `keyof T`.",
        "You add modifiers with `?` and `readonly`, and remove them with `-?` and `-readonly`.",
        "Mapping over `keyof T` keeps the original modifiers. That's how `Pick` and `Partial` keep `readonly` intact.",
        "An `as` clause renames keys, often using template literal types. If you map a key to `never`, it's removed.",
      ],
      tip: "Writing `Partial` or `Readonly` from scratch is a common warm-up. Start with `{ [K in keyof T]: T[K] }` and add the modifier.",
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
              { icon: "➖", title: "Exclude<T, U>", text: "Members of T that don't fit U", color: "#f472b6" },
              { icon: "🎯", title: "Extract<T, U>", text: "Members of T that fit U", color: "#f472b6" },
              { icon: "🚫", title: "NonNullable<T>", text: "T without null and undefined", color: "#f472b6" },
              { icon: "⏳", title: "Awaited<T>", text: "Unwraps nested promises", color: "#f472b6" },
            ]}
          />
        </div>
      ),
      points: [
        "A conditional type picks one of two types depending on whether one type fits another. It works like the `? :` operator, but for types.",
        "When the type being checked is a bare type parameter, the condition runs separately for each member of a union. This is called distribution.",
        "To check the union as a whole, wrap both sides in a tuple: `[T] extends [U]`.",
        "`infer` declares a new type variable that captures part of the type being matched.",
      ],
      tip: "`Exclude` is just `T extends U ? never : T`. Explaining that shows you understand distribution and `never` in one go.",
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
            { icon: "⏩", title: "Speed trade-off", text: "skipLibCheck skips .d.ts files. Builds get faster, but errors in declaration files go unreported", color: "#f87171" },
          ]}
        />
      ),
      points: [
        "`strict` is a bundle of flags. New flags join the bundle over time, so upgrading TypeScript can surface new errors.",
        "`strictNullChecks` matters most. Without it, `null` and `undefined` can be assigned to every type.",
        "`noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` are not part of `strict`. You turn them on separately.",
        "Roll out strictness one flag or one folder at a time, with CI blocking any new errors.",
      ],
      tip: "If someone asks which flag matters most, say `strictNullChecks` and give an example of the bugs it prevents.",
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
        "A `.d.ts` file contains only types. No JavaScript is ever produced from it.",
        "For a package with no types, first try installing `@types/<name>`. If that doesn't exist, write a `declare module` block.",
        "`declare global` adds to global types like `Window`, and it has to live in a file that is a module.",
        "A library should ship compiled JavaScript plus generated `.d.ts` files, using `declaration: true`, and point to them from package.json.",
      ],
      tip: "Mention that declarations are promises the compiler can't check. A wrong `.d.ts` file is a silent bug.",
    },
  ],

  questions: [
    // ── Start here ──
    {
      id: "ts-b4-01", domain: "d4", lesson: "d4-b-alias", level: "beginner", type: "fill",
      prompt: "Fill the gap to give this object type the name `Point`.",
      code: `{{1}} Point = { x: number; y: number };
const p: Point = { x: 1, y: 2 };`, codeLang: "ts",
      blanks: [{ options: ["type", "let", "function", "return"], answer: 0 }],
      explanation: "The `type` keyword names a type so you can reuse it. `let` creates a variable that holds a value, not a type. `function` and `return` are for writing functions.",
    },
    {
      id: "ts-b4-02", domain: "d4", lesson: "d4-b-alias", level: "beginner", type: "output",
      prompt: "What does this print?",
      code: `type Point = { x: number; y: number };
const p: Point = { x: 2, y: 5 };
console.log(p.x + p.y);`, codeLang: "ts",
      answers: ["7"],
      explanation: "`Point` is just a name for the shape. The object has `x` set to 2 and `y` set to 5, and adding them gives 7. The type name has no effect on what runs.",
    },
    {
      id: "ts-b4-03", domain: "d4", lesson: "d4-b-tsconfig", level: "beginner",
      prompt: "Which file holds a TypeScript project's settings?",
      options: ["`tsconfig.json`", "`index.html`", "`settings.txt`", "`package-lock.json`"],
      answer: [0],
      explanation: "`tsconfig.json` tells the TypeScript checker how strict to be and which files to check. `index.html` is a web page, and `package-lock.json` records installed package versions.",
    },
    {
      id: "ts-b4-04", domain: "d4", lesson: "d4-b-tsconfig", level: "beginner",
      prompt: "What does `\"strict\": true` in tsconfig.json do?",
      options: [
        "Turns on a group of extra checks that catch more mistakes",
        "Makes the code run faster",
        "Stops anyone else from editing the project files",
        "Deletes files that have errors",
      ],
      answer: [0],
      explanation: "`strict` switches on several careful checks at once, such as making you handle values that might be missing. It only affects checking, not how fast the code runs or who can edit it.",
    },
    {
      id: "ts-b4-05", domain: "d4", lesson: "d4-b-missing", level: "beginner", type: "output",
      prompt: "What does this print?",
      code: `function greet(name?: string) {
  return "Hi " + (name ?? "friend");
}
console.log(greet());`, codeLang: "ts",
      answers: ["Hi friend"],
      explanation: "`greet()` is called with no argument, so `name` is `undefined`. The `??` operator sees that and uses \"friend\" instead. The result is Hi friend.",
    },
    {
      id: "ts-b4-06", domain: "d4", lesson: "d4-b-missing", level: "beginner", type: "fill",
      prompt: "Fill the gap so `label` falls back to \"guest\" when `nickname` is missing.",
      code: `function badge(nickname?: string) {
  const label = nickname {{1}} "guest";
  return label;
}`, codeLang: "ts",
      blanks: [{ options: ["??", "!!", "::", "=>"], answer: 0 }],
      explanation: "`??` gives you the value on the left unless it's `null` or `undefined`, and then it uses the value on the right. `!!` turns a value into true or false, `::` isn't valid here, and `=>` is for arrow functions.",
    },

    // ── Mapped types ──
    {
      id: "d4-01", domain: "d4", lesson: "d4-mapped", level: "intermediate",
      prompt: "What is `F`?",
      code: `type Flags<T> = { [K in keyof T]: boolean };
type F = Flags<{ dark: string; beta: number }>;`, codeLang: "ts",
      options: ["`{ dark: boolean; beta: boolean }`", "`{ dark: string; beta: number }`", "`boolean[]`", "`{ [K: string]: boolean }`"],
      answer: [0],
      explanation: "The mapped type goes through the keys \"dark\" and \"beta\" and gives each one the type `boolean`.",
    },
    {
      id: "d4-02", domain: "d4", lesson: "d4-mapped", level: "senior",
      prompt: "What is `M`?",
      code: `type Mutable<T> = { -readonly [K in keyof T]-?: T[K] };
type M = Mutable<{ readonly id: number; name?: string }>;`, codeLang: "ts",
      options: ["`{ id: number; name: string }`", "`{ readonly id: number; name?: string }`", "`{ id: number; name?: string }`", "`{ id: number; name: string | undefined }`"],
      answer: [0],
      explanation: "`-readonly` removes `readonly`, and `-?` removes the optional marker. Removing `?` also removes the `undefined` it added, so `name` is a plain `string`. That's exactly how `Required` works.",
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
      explanation: "The `as` clause renames each key using a template literal type, and `Capitalize` upper-cases the first letter. `string & K` filters out symbol and number keys.",
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
      explanation: "Functions are objects too, so you have to check for them first. Otherwise the mapped type would turn them into empty object types. Objects recurse, and primitives fall through unchanged.",
    },
    // ── Conditional types ──
    {
      id: "d4-04", domain: "d4", lesson: "d4-conditional", level: "senior",
      prompt: "What is `B`?",
      code: `type IsString<T> = T extends string ? "yes" : "no";
type A = IsString<"hi">;
type B = IsString<string | number>;`, codeLang: "ts",
      options: ["`\"yes\" | \"no\"`", "`\"no\"`", "`\"yes\"`", "`never`, since the two types don't overlap"],
      answer: [0],
      explanation: "A conditional over a bare type parameter distributes. It runs once for `string`, giving \"yes\", and once for `number`, giving \"no\", then joins the results into a union.",
    },
    {
      id: "d4-05", domain: "d4", lesson: "d4-conditional", level: "senior",
      prompt: "What is `B` now?",
      code: `type IsString<T> = [T] extends [string] ? "yes" : "no";
type B = IsString<string | number>;`, codeLang: "ts",
      options: ["`\"no\"`", "`\"yes\" | \"no\"`", "`\"yes\"`", "`never`"],
      answer: [0],
      explanation: "Wrapping `T` in a tuple stops distribution, so the whole union is checked at once. `[string | number]` doesn't fit `[string]`, so the result is \"no\".",
    },
    {
      id: "d4-06", domain: "d4", lesson: "d4-conditional", level: "senior",
      prompt: "What are `E` and `N`?",
      code: `type ElementOf<T> = T extends (infer U)[] ? U : never;
type E = ElementOf<string[]>;
type N = ElementOf<number>;`, codeLang: "ts",
      options: ["`E = string`, `N = never`", "`E = string[]`, `N = number`", "`E = string`, `N = number`", "`E = unknown`, `N = never`"],
      answer: [0],
      explanation: "When `T` is an array, `infer U` captures the type of its items. `number` isn't an array, so the false branch gives `never`.",
    },
    {
      id: "d4-07", domain: "d4", lesson: "d4-conditional", level: "senior",
      prompt: "What is `X`?",
      code: `type Unwrap<T> = T extends Promise<infer U> ? U : T;
type X = Unwrap<Promise<Promise<number>>>;`, codeLang: "ts",
      options: ["`Promise<number>`", "`number`", "`Promise<Promise<number>>`", "`never`"],
      answer: [0],
      explanation: "`Unwrap` only peels off one layer. The built-in `Awaited` keeps going, so `Awaited<Promise<Promise<number>>>` is `number`.",
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
      explanation: "`Exclude` and `Extract` filter union members by whether they fit the second type. `NonNullable` removes `null` and `undefined`, and `Awaited` unwraps promises.",
    },
    {
      id: "d4-22", domain: "d4", lesson: "d4-conditional", level: "staff",
      prompt: "A teammate wrote a 200-line recursive conditional type to infer every route's params from path strings. Error messages are unreadable and the editor is slow in that package. What's the best call?",
      options: [
        "Simplify: generate route types from the route config with a codegen step (or a shallow mapped type), and keep any remaining type-level code small, tested, and documented",
        "Add `// @ts-ignore` wherever errors appear in the router types, and raise the compiler's recursion and instantiation limits in tsconfig so the deep type-level route parsing finishes without hitting the depth cap again",
        "Type every route param as any",
        "Raise the compiler's recursion limit",
      ],
      answer: [0],
      explanation: "Type-level code is code the whole team has to maintain. Code generation or simpler types keep the safety, with readable errors and fast checks. `@ts-ignore` and `any` remove the safety, and you can't configure the recursion limit anyway.",
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
      explanation: "An optional parameter is `string | undefined`. Line 2 handles that, but line 3 uses `name` directly, so TypeScript reports \"'name' is possibly 'undefined'\". Use `n` instead.",
    },
    {
      id: "d4-10", domain: "d4", lesson: "d4-strict", level: "junior", type: "lines",
      prompt: "With `strict: true`, which line is a type error?",
      code: `function sum(a, b) {
  return a + b;
}
const s: number = sum(1, 2);`, codeLang: "ts",
      answer: [1],
      explanation: "`noImplicitAny`, which is part of `strict`, rejects parameters whose type can't be worked out. The error is \"Parameter 'a' implicitly has an 'any' type\". Add labels: `(a: number, b: number)`.",
    },
    {
      id: "d4-11", domain: "d4", lesson: "d4-strict", level: "senior", type: "lines",
      prompt: "With the tsconfig in the comment, which line is a type error?",
      code: `// tsconfig: "strict": true, "noUncheckedIndexedAccess": true
const scores: Record<string, number> = { ada: 3 };
const a = scores["ada"];
const doubled = a * 2;`, codeLang: "ts",
      answer: [4],
      explanation: "`noUncheckedIndexedAccess` makes index reads `number | undefined`, because any string key might be missing. Line 4 uses `a` without checking it first.",
    },
    {
      id: "d4-12", domain: "d4", lesson: "d4-strict", level: "intermediate",
      prompt: "Which flags does `strict: true` turn on? (Choose three.)",
      options: ["`strictNullChecks`", "`noImplicitAny`", "`strictFunctionTypes`", "`noUncheckedIndexedAccess`", "`exactOptionalPropertyTypes`"],
      answer: [0, 1, 2],
      explanation: "`strict` includes `strictNullChecks`, `noImplicitAny`, `strictFunctionTypes` and several more. `noUncheckedIndexedAccess` and `exactOptionalPropertyTypes` are even stricter, and you have to turn them on separately.",
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
      explanation: "`strictPropertyInitialization` requires every non-optional property to be set in the constructor, and `name` never is. `email` is optional, and the `!` on `id` tells TypeScript you'll set it somewhere else.",
    },
    {
      id: "d4-18", domain: "d4", lesson: "d4-strict", level: "senior", type: "lines",
      prompt: "With the tsconfig in the comment, which line is a type error?",
      code: `// tsconfig: "strict": true, "exactOptionalPropertyTypes": true
interface Prefs { theme?: "dark" | "light" }
const a: Prefs = {};
const b: Prefs = { theme: undefined };`, codeLang: "ts",
      answer: [4],
      explanation: "With `exactOptionalPropertyTypes`, `theme?:` means \"may be left out\", not \"may be undefined\". Writing `undefined` explicitly is an error unless the type says `| undefined`.",
    },
    {
      id: "d4-23", domain: "d4", lesson: "d4-strict", level: "senior",
      prompt: "Turning on `skipLibCheck: true` speeds up the build a lot. What do you give up?",
      options: [
        "Type-checking of all .d.ts files, yours and your dependencies', so errors inside declaration files go unreported",
        "Type-checking of your own .ts source files",
        "Emitting JavaScript for the files in node_modules, which speeds up the build because those files are already compiled",
        "Resolution of @types packages",
      ],
      answer: [0],
      explanation: "`skipLibCheck` skips checking declaration files. Your own `.ts` code is still checked against them. It's a common and reasonable trade-off, but broken or conflicting type packages can slip through.",
    },
    {
      id: "d4-20", domain: "d4", lesson: "d4-strict", level: "staff",
      prompt: "Turning on `strict` across a 300-package monorepo produces 40,000 errors. What's the best rollout?",
      options: [
        "Enable the flags one at a time per package (strictNullChecks last or separately), and use CI to block new errors while teams burn down the rest",
        "Turn it on everywhere in one release and add `@ts-expect-error` to all 40,000 lines that fail, so CI goes green right away and teams can clean them up later",
        "Wait until a quiet quarter and fix everything in one branch",
        "Keep strict off and rely on code review",
      ],
      answer: [0],
      explanation: "Tightening step by step keeps the team shipping, gives each team a manageable amount of work, and stops the count from growing. Suppressing everything hides real bugs, and a long-lived branch goes stale.",
    },
    // ── Declarations ──
    {
      id: "d4-14", domain: "d4", lesson: "d4-declarations", level: "junior",
      prompt: "What does a `.d.ts` file contain?",
      options: ["Type declarations only; it emits no JavaScript", "Compiled JavaScript with all types inlined", "Runtime validation code for each type", "Source maps for TypeScript files"],
      answer: [0],
      explanation: "A declaration file describes the shape of JavaScript that lives somewhere else, such as a library, a global, or your own compiled output. It never produces code.",
    },
    {
      id: "d4-15", domain: "d4", lesson: "d4-declarations", level: "intermediate",
      prompt: "You import an npm package `legacy-lib` that ships no types, and TypeScript reports an implicit any module. What should you try first?",
      options: [
        "Install `@types/legacy-lib` if it exists; otherwise add a `declare module \"legacy-lib\"` block in a .d.ts file",
        "Rename your file to .js",
        "Turn off `strict`",
        "Copy the library's source into your project and rename the files to `.ts` so the compiler infers types for it",
      ],
      answer: [0],
      explanation: "DefinitelyTyped, the community home of `@types` packages, often already has the types. If not, a small hand-written module declaration for the functions you use is quick and lets you keep `strict` on.",
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
        "It exports the `Window` interface so that other files can import it with the new property",
        "It prevents the file from emitting JavaScript",
        "It's required in every .d.ts file",
      ],
      answer: [0],
      explanation: "A file with no imports or exports is treated as a global script, and `declare global` isn't allowed there. An empty export turns the file into a module, so the addition to `Window` is valid.",
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
      explanation: "`declare` never produces code. It tells the compiler that something already exists. `@types` packages come from DefinitelyTyped.",
    },
    {
      id: "d4-21", domain: "d4", lesson: "d4-declarations", level: "staff",
      prompt: "You're publishing a TypeScript library for both JavaScript and TypeScript apps. What should the package ship?",
      options: [
        "Compiled JavaScript plus generated .d.ts files (`declaration: true`), with `types` / `exports` in package.json pointing at them",
        "Only the .ts source files, so consumers compile them",
        "Compiled JavaScript only, with a README section that tells TypeScript users to write their own `declare module` block for the package",
        "A single bundled .d.ts with `any` for every export",
      ],
      answer: [0],
      explanation: "JavaScript users need code they can run, and TypeScript users need declarations that match it. Shipping raw `.ts` files forces every consumer's compiler settings onto your code.",
    },
    {
      id: "d4-24", domain: "d4", lesson: "d4-declarations", level: "staff",
      prompt: "Your team switches to a bundler that transpiles each file on its own (esbuild or SWC) and runs `tsc` only for type-checking. What should tsconfig enforce?",
      options: [
        "`isolatedModules: true` (or `verbatimModuleSyntax`), so code that needs cross-file type information to emit, like type re-exports without `export type` or const enums, is flagged",
        "`skipLibCheck: false`",
        "`declaration: true`",
        "`noEmitOnError: false`, so the compiler keeps writing JavaScript output for every file even when type errors are reported, and the per-file transpiler in the build never has to see the cross-file type information at all",
      ],
      answer: [0],
      explanation: "A tool that compiles one file at a time can't see other files' types, so it can't tell whether a re-export is a type or a value. `isolatedModules` makes `tsc` reject those patterns, so the build output comes out right.",
    },
  ],

  cards: [
    { id: "t4-mapped", domain: "d4", kind: "concept", term: "Mapped type", definition: "`{ [K in Keys]: … }` builds an object type by going through a union of keys one at a time." },
    { id: "t4-remap", domain: "d4", kind: "concept", term: "Key remapping (as)", definition: "Renames or filters keys in a mapped type. Mapping a key to `never` removes it." },
    { id: "t4-conditional", domain: "d4", kind: "concept", term: "Conditional type", definition: "`T extends U ? X : Y` picks one branch depending on whether `T` fits `U`." },
    { id: "t4-distributive", domain: "d4", kind: "concept", term: "Distributive conditional", definition: "A bare type parameter is checked once per union member. Wrap it as `[T]` to stop that." },
    { id: "t4-infer", domain: "d4", kind: "service", term: "infer", definition: "Captures part of a matched type inside a conditional, for example `T extends (infer U)[]`." },
    { id: "t4-exclude", domain: "d4", kind: "service", term: "Exclude<T, U>", definition: "Removes the members of union `T` that fit `U`." },
    { id: "t4-extract", domain: "d4", kind: "service", term: "Extract<T, U>", definition: "Keeps only the members of union `T` that fit `U`." },
    { id: "t4-nonnullable", domain: "d4", kind: "service", term: "NonNullable<T>", definition: "`T` with `null` and `undefined` taken out." },
    { id: "t4-awaited", domain: "d4", kind: "service", term: "Awaited<T>", definition: "Unwraps promise types all the way down, the same way `await` does." },
    { id: "t4-strictnull", domain: "d4", kind: "service", term: "strictNullChecks", definition: "Makes `null` and `undefined` separate types that you have to handle on purpose." },
    { id: "t4-unchecked", domain: "d4", kind: "service", term: "noUncheckedIndexedAccess", definition: "Adds `| undefined` to every index read. It isn't part of `strict`." },
    { id: "t4-isolated", domain: "d4", kind: "service", term: "isolatedModules", definition: "Flags code that tools compiling one file at a time can't output correctly." },
    { id: "t4-dts", domain: "d4", kind: "concept", term: ".d.ts file", definition: "Declarations only. It describes JavaScript that exists somewhere else and produces no code." },
    { id: "t4-declare-module", domain: "d4", kind: "service", term: "declare module", definition: "Declares the types of a module by name, for example an npm package that ships no types." },
  ],
});
