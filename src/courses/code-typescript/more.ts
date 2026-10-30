import type { Question } from "@/engine/types";

/** Extra fill-in-the-blank and type-the-output questions for the TypeScript track. */
export const moreQuestions: Question[] = [
  // ───────────── fill ─────────────
  {
    id: "typescript-fx-01",
    type: "fill",
    domain: "d1",
    lesson: "d1-literals",
    level: "junior",
    prompt: "Fill the gap so `config.mode` keeps the literal type `\"dark\"` instead of widening to `string`.",
    code: `const config = { mode: "dark" } {{1}};
const m: "dark" = config.mode;`,
    codeLang: "ts",
    blanks: [{ options: ["as const", "as unknown", "as string", "satisfies string"], answer: 0 }],
    explanation: "`as const` keeps the exact literal types and makes the properties `readonly`, so `mode` stays `\"dark\"`. Without it, TypeScript widens the string in a property you could change to plain `string`.",
  },
  {
    id: "typescript-fx-02",
    type: "fill",
    domain: "d1",
    lesson: "d1-type-interface",
    level: "intermediate",
    prompt: "Fill the gap so the second declaration adds to the first (declaration merging) and `b` has both fields.",
    code: `interface Box { w: number }
{{1}} Box { h: number }
const b: Box = { w: 1, h: 2 };`,
    codeLang: "ts",
    blanks: [{ options: ["interface", "type", "enum", "abstract"], answer: 0 }],
    explanation: "Two interfaces with the same name in the same scope merge into one, so `Box` ends up with both `w` and `h`. You can't declare a `type` alias twice with the same name, which is one of the practical differences between the two.",
  },
  {
    id: "typescript-fx-03",
    type: "fill",
    domain: "d1",
    lesson: "d1-top-bottom",
    level: "senior",
    prompt: "Fill the gap so callers must narrow the result of `parse` before using it.",
    code: `function parse(json: string): {{1}} {
  return JSON.parse(json);
}
const v = parse("1");
// @ts-expect-error: not usable until narrowed
v.toFixed(1);
if (typeof v === "number") console.log(v.toFixed(1));`,
    codeLang: "ts",
    blanks: [{ options: ["unknown", "any", "never", "object"], answer: 0 }],
    explanation: "`unknown` accepts any value but makes you narrow it before you use it, which is exactly what the `typeof` check does. `any` switches checking off, this function can't return `never`, and with `object` the `typeof` check would narrow to `never`.",
  },
  {
    id: "typescript-fx-04",
    type: "fill",
    domain: "d2",
    lesson: "d2-unions",
    level: "junior",
    prompt: "Fill the gap so the function returns the string itself, or the first element of the array.",
    code: `function first(x: string | string[]): string {
  return {{1}} ? x : x[0];
}`,
    codeLang: "ts",
    blanks: [{ options: ['typeof x === "string"', "Array.isArray(x)", "x instanceof String", "x.length"], answer: 0 }],
    explanation: "`typeof x === \"string\"` narrows `x` to `string` when it's true and to `string[]` when it's false, which matches the two branches. `Array.isArray(x)` would narrow the wrong way round, and `instanceof String` is false for ordinary strings.",
  },
  {
    id: "typescript-fx-05",
    type: "fill",
    domain: "d2",
    lesson: "d2-discriminated",
    level: "intermediate",
    prompt: "Fill the gap so the compiler reports an error here if a new `Shape` variant is added without a `case`.",
    code: `type Shape = { kind: "circle"; r: number } | { kind: "square"; s: number };

function area(shape: Shape): number {
  switch (shape.kind) {
    case "circle": return Math.PI * shape.r ** 2;
    case "square": return shape.s ** 2;
    default: {
      const unreachable: {{1}} = shape;
      return unreachable;
    }
  }
}`,
    codeLang: "ts",
    blanks: [{ options: ["never", "unknown", "string", "void"], answer: 0 }],
    explanation: "Once every case is handled, `shape` is `never` in the `default` branch, so assigning it to a `never` variable compiles. Add a new variant and that assignment fails, pointing you at the missing case. This is the exhaustiveness check pattern.",
  },
  {
    id: "typescript-fx-06",
    type: "fill",
    domain: "d2",
    lesson: "d2-predicates",
    level: "senior",
    prompt: "Fill the gap so calling `assertDefined(n)` narrows `n` to `number` for the rest of the scope.",
    code: `function assertDefined<T>(v: T | undefined): {{1}} v is T {
  if (v === undefined) throw new Error("missing");
}
declare const n: number | undefined;
assertDefined(n);
console.log(n.toFixed(2));`,
    codeLang: "ts",
    blanks: [{ options: ["asserts", "assert", "is", "never"], answer: 0 }],
    explanation: "The signature `asserts v is T` tells the compiler that if the function returns normally, `v` is a `T`. A plain predicate, `v is T`, returns a boolean and only narrows inside an `if`.",
  },
  {
    id: "typescript-fx-07",
    type: "fill",
    domain: "d2",
    lesson: "d2-discriminated",
    level: "staff",
    prompt: "Fill the gap so the handler for `\"click\"` receives only the click variant of `AppEvent`.",
    code: `type AppEvent =
  | { type: "click"; x: number }
  | { type: "key"; code: string };

function on<K extends AppEvent["type"]>(
  type: K,
  fn: (e: {{1}}<AppEvent, { type: K }>) => void,
) {}

on("click", (e) => e.x.toFixed());`,
    codeLang: "ts",
    blanks: [{ options: ["Extract", "Exclude", "Pick", "Omit"], answer: 0 }],
    explanation: "`Extract<Union, Shape>` keeps the union members that fit `Shape`, so `{ type: K }` picks out the matching variant. `Exclude` does the opposite. `Pick` and `Omit` work on an object's keys, not on union members.",
  },
  {
    id: "typescript-fx-08",
    type: "fill",
    domain: "d3",
    lesson: "d3-keyof",
    level: "intermediate",
    prompt: "Fill the gap so `key` can only be a real property name of `obj`.",
    code: `function get<T, K extends {{1}} T>(obj: T, key: K): T[K] {
  return obj[key];
}
get({ id: 1, name: "Ada" }, "name");`,
    codeLang: "ts",
    blanks: [{ options: ["keyof", "typeof", "in", "infer"], answer: 0 }],
    explanation: "`keyof T` is a union of the property names of `T`. With `K extends keyof T`, a wrong key becomes a compile error, and the return type `T[K]` follows whichever key you pass.",
  },
  {
    id: "typescript-fx-09",
    type: "fill",
    domain: "d3",
    lesson: "d3-utility",
    level: "senior",
    prompt: "Fill the gaps so `Draft` is `User` without `id`, with every remaining field optional.",
    code: `type User = { id: number; name: string; email: string };
type Draft = {{1}}<{{2}}<User, "id">>;
const d: Draft = { name: "Ada" };`,
    codeLang: "ts",
    blanks: [
      { options: ["Partial", "Required", "Readonly", "Pick"], answer: 0 },
      { options: ["Omit", "Pick", "Required", "Extract"], answer: 0 },
    ],
    explanation: "`Omit<User, \"id\">` drops the `id` key, then `Partial<...>` makes everything left optional. `Required` would demand every field, and `Pick<User, \"id\">` would keep only `id`.",
  },
  {
    id: "typescript-fx-10",
    type: "fill",
    domain: "d3",
    lesson: "d3-constraints",
    level: "junior",
    prompt: "Fill the gap so `identity` returns exactly the type it was given.",
    code: `function identity<{{1}}>(value: T): T {
  return value;
}
const s: string = identity("hi");`,
    codeLang: "ts",
    blanks: [{ options: ["T", "T[]", "any", "unknown"], answer: 0 }],
    explanation: "The angle brackets declare `T`, and both the parameter and the return type use it, so you get back the same type you passed in. Using `any` would break that link.",
  },
  {
    id: "typescript-fx-11",
    type: "fill",
    domain: "d3",
    lesson: "d3-constraints",
    level: "staff",
    prompt: "Fill the gap so `tuple([\"a\", 1])` is inferred as a readonly tuple `readonly [\"a\", 1]` instead of `(string | number)[]`.",
    code: `function tuple<{{1}} T extends readonly unknown[]>(xs: T): T {
  return xs;
}
const t = tuple(["a", 1]);
const first: "a" = t[0];`,
    codeLang: "ts",
    blanks: [{ options: ["const", "readonly", "infer", "keyof"], answer: 0 }],
    explanation: "A `const` type parameter, from TypeScript 5.0, makes the compiler infer the argument as if it were written with `as const`. The caller doesn't have to do anything, and the exact values and tuple positions are kept.",
  },
  {
    id: "typescript-fx-12",
    type: "fill",
    domain: "d4",
    lesson: "d4-mapped",
    level: "intermediate",
    prompt: "Fill the gap so each key `name` is renamed to `getName` in the mapped type.",
    code: `type Getters<T> = {
  [K in keyof T {{1}} \`get\${Capitalize<K & string>}\`]: () => T[K];
};
const g: Getters<{ name: string }> = { getName: () => "Ada" };`,
    codeLang: "ts",
    blanks: [{ options: ["as", "is", "in", "of"], answer: 0 }],
    explanation: "Key remapping with `as`, from TypeScript 4.1, lets a mapped type work out a new key name from the old one. Here it uses a template literal type and the `Capitalize` helper to turn `name` into `getName`.",
  },
  {
    id: "typescript-fx-13",
    type: "fill",
    domain: "d4",
    lesson: "d4-conditional",
    level: "staff",
    prompt: "Fill the gap so `Both<string | number>` is `(string | number)[]` instead of `string[] | number[]`.",
    code: `type Both<T> = {{1}} extends [any] ? T[] : never;
const a: Both<string | number> = ["a", 1];`,
    codeLang: "ts",
    blanks: [{ options: ["[T]", "T", "T[]", "readonly T"], answer: 0 }],
    explanation: "A conditional type only distributes when the type being checked is a bare type parameter. Wrapping it as `[T]` switches that off, so the union is treated as one type and you get a single array of the union.",
  },
  {
    id: "typescript-fx-14",
    type: "fill",
    domain: "d4",
    lesson: "d4-strict",
    level: "senior",
    prompt: "Fill the gap in `tsconfig.json` so `arr[0]` on a `number[]` has the type `number | undefined`.",
    code: `{
  "compilerOptions": {
    "strict": true,
    "{{1}}": true
  }
}`,
    codeLang: "json",
    blanks: [{ options: ["noUncheckedIndexedAccess", "strictNullChecks", "noImplicitReturns", "exactOptionalPropertyTypes"], answer: 0 }],
    explanation: "`noUncheckedIndexedAccess` adds `undefined` to every array index and index signature read. That's honest, because an index can be out of range, but it isn't part of `strict`. `strictNullChecks` is already on, and the other two control different checks.",
  },

  // ───────────── output ─────────────
  {
    id: "typescript-ox-01",
    type: "output",
    domain: "d1",
    lesson: "d1-structural",
    level: "junior",
    prompt: "Types are removed before the code runs. Type what this prints (a name and a boolean, separated by a space).",
    code: `interface Named { name: string }
const p = { name: "Ada", age: 36 };
const n: Named = p;
console.log(n.name, "age" in n);`,
    codeLang: "ts",
    answers: ["Ada true"],
    explanation: "Assigning `p` to a `Named` variable only changes how the compiler sees it. The object itself is untouched, so `age` is still there when the code runs and the `in` check is true.",
  },
  {
    id: "typescript-ox-02",
    type: "output",
    domain: "d1",
    lesson: "d1-literals",
    level: "intermediate",
    prompt: "Type what this prints (a number and a word, separated by a space).",
    code: `enum Dir { Up, Down }
console.log(Dir.Down, Dir[0]);`,
    codeLang: "ts",
    answers: ["1 Up"],
    explanation: "A numeric enum compiles to an object that maps both ways. `Dir.Down` is `1`, and `Dir[0]` looks the name back up, giving \"Up\". String enums don't map back like this.",
  },
  {
    id: "typescript-ox-03",
    type: "output",
    domain: "d1",
    lesson: "d1-type-interface",
    level: "staff",
    prompt: "Type what this prints (two comma-separated keys, then a space and a number).",
    code: `class Acct {
  constructor(private balance: number, readonly id = "a1") {}
  get() { return this.balance; }
}
const a = new Acct(5);
console.log(Object.keys(a).join(), (a as any).balance);`,
    codeLang: "ts",
    answers: ["balance,id 5"],
    explanation: "Parameter properties declare and assign fields in order, so the object has `balance` and then `id`. `private` and `readonly` only exist for the compiler. When the code runs, `balance` is an ordinary property anyone can read. Use `#balance` if you need real privacy.",
  },
  {
    id: "typescript-ox-04",
    type: "output",
    domain: "d2",
    lesson: "d2-narrowing",
    level: "intermediate",
    prompt: "Type the logged values, separated by spaces.",
    code: `function f(x: string | number | null) {
  if (x == null) return "none";
  return typeof x === "string" ? x.length : x.toFixed(1);
}
console.log(f(null), f("abc"), f(2));`,
    codeLang: "ts",
    answers: ["none 3 2.0"],
    explanation: "`x == null` catches `null` first and returns \"none\". A string takes the `length` branch, giving the number 3. A number goes through `toFixed(1)`, which gives the text \"2.0\".",
  },
  {
    id: "typescript-ox-05",
    type: "output",
    domain: "d2",
    lesson: "d2-discriminated",
    level: "senior",
    prompt: "Type the one number this logs.",
    code: `type Act = { t: "add"; n: number } | { t: "reset" };
const run = (acts: Act[]) =>
  acts.reduce((s, a) => (a.t === "add" ? s + a.n : 0), 0);
console.log(run([{ t: "add", n: 2 }, { t: "add", n: 3 }, { t: "reset" }, { t: "add", n: 4 }]));`,
    codeLang: "ts",
    answers: ["4"],
    explanation: "The running total goes to 2, then 5, then the `reset` action sets it back to 0, and the last `add` makes it 4. Checking the discriminant `a.t` is what lets `a.n` type-check in the `add` branch.",
  },
  {
    id: "typescript-ox-06",
    type: "output",
    domain: "d3",
    lesson: "d3-generics",
    level: "junior",
    prompt: "Type the one line this logs.",
    code: `function pair<A, B>(a: A, b: B): [B, A] {
  return [b, a];
}
console.log(pair(1, "x").join("-"));`,
    codeLang: "ts",
    answers: ["x-1"],
    explanation: "`pair` swaps the order, so the result is `[\"x\", 1]`, and `join(\"-\")` gives x-1. The type parameters only describe the swap for the compiler. They disappear when the code runs.",
  },
  {
    id: "typescript-ox-07",
    type: "output",
    domain: "d3",
    lesson: "d3-keyof",
    level: "intermediate",
    prompt: "Type the one line this logs.",
    code: `function pluck<T, K extends keyof T>(xs: T[], k: K): T[K][] {
  return xs.map((x) => x[k]);
}
console.log(pluck([{ id: 1, n: "a" }, { id: 2, n: "b" }], "n").join(""));`,
    codeLang: "ts",
    answers: ["ab"],
    explanation: "`pluck` maps each object to its `n` property, giving `[\"a\", \"b\"]`, and `join(\"\")` turns that into ab. `K extends keyof T` only makes sure, before the code runs, that \"n\" is a real key.",
  },
  {
    id: "typescript-ox-08",
    type: "output",
    domain: "d3",
    lesson: "d3-utility",
    level: "senior",
    prompt: "Type what this prints (a number and a boolean, separated by a space).",
    code: `const o: Readonly<{ n: number }> = { n: 1 };
(o as { n: number }).n = 2;
console.log(o.n, Object.isFrozen(o));`,
    codeLang: "ts",
    answers: ["2 false"],
    explanation: "`Readonly<T>` is only a marker for the compiler. The cast removes it, the assignment really happens, and the object was never frozen, so `isFrozen` is false. Use `Object.freeze` if you need it locked while the code runs.",
  },
  {
    id: "typescript-ox-09",
    type: "output",
    domain: "d4",
    lesson: "d4-strict",
    level: "senior",
    prompt: "Type what this prints (two values, separated by a space).",
    code: `const m = new Map<string, number>();
const v = m.get("a")!;
console.log(v, v + 1);`,
    codeLang: "ts",
    answers: ["undefined NaN"],
    explanation: "The `!` after `m.get(\"a\")` only silences the compiler. The key is missing, so `v` really is `undefined`, and `undefined + 1` is `NaN`. A check or a default value is safer than `!`.",
  },
  {
    id: "typescript-ox-10",
    type: "output",
    domain: "d4",
    lesson: "d4-mapped",
    level: "intermediate",
    prompt: "Type the one line this logs (JSON, no spaces).",
    code: `const keys = ["a", "b"] as const;
const o = Object.fromEntries(keys.map((k) => [k, k.toUpperCase()]));
console.log(JSON.stringify(o));`,
    codeLang: "ts",
    answers: ['{"a":"A","b":"B"}'],
    explanation: "`as const` only affects the types. When the code runs, `keys` is a normal array. `Object.fromEntries` builds `{ a: \"A\", b: \"B\" }`, and `JSON.stringify` prints it with no spaces.",
  },
  {
    id: "typescript-ox-11",
    type: "output",
    domain: "d4",
    lesson: "d4-declarations",
    level: "staff",
    prompt: "Type the one word this logs.",
    code: `declare const VERSION: string;
console.log(typeof VERSION);`,
    codeLang: "ts",
    answers: ["undefined"],
    explanation: "`declare` tells the compiler a global exists but produces no code. If nothing defines `VERSION` when the code runs, `typeof VERSION` safely gives \"undefined\". Reading `VERSION` directly would throw a ReferenceError instead.",
  },
];
