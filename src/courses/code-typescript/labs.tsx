"use client";

import { useState } from "react";
import { CodeBlock, LabHeader, type GoalProps } from "@/components/learn/blocks";

// ───────────── Narrowing lab ─────────────

type MemberId = "string" | "number" | "null" | "array" | "circle" | "square";

const MEMBERS: { id: MemberId; type: string; tag: string; color: string }[] = [
  { id: "string", type: "string", tag: "string", color: "#34d399" },
  { id: "number", type: "number", tag: "number", color: "#fbbf24" },
  { id: "null", type: "null", tag: "object", color: "#94a3b8" },
  { id: "array", type: "boolean[]", tag: "object", color: "#f472b6" },
  { id: "circle", type: "Circle", tag: "object", color: "#38bdf8" },
  { id: "square", type: "Square", tag: "object", color: "#a78bfa" },
];

interface Check {
  code: string;
  keep: (m: MemberId) => boolean;
  /** Returns a compiler error if the check isn't allowed on the current type. */
  error?: (left: MemberId[], typeText: string) => string | null;
}

const isObj = (m: MemberId) => m === "null" || m === "array" || m === "circle" || m === "square";

const CHECKS: Check[] = [
  { code: `typeof x === "string"`, keep: (m) => m === "string" },
  { code: `typeof x === "number"`, keep: (m) => m === "number" },
  { code: `typeof x === "object"`, keep: isObj },
  { code: `typeof x !== "string"`, keep: (m) => m !== "string" },
  { code: `x !== null`, keep: (m) => m !== "null" },
  { code: `Array.isArray(x)`, keep: (m) => m === "array" },
  { code: `!Array.isArray(x)`, keep: (m) => m !== "array" },
  {
    code: `"kind" in x`,
    keep: (m) => m === "circle" || m === "square",
    error: (left, t) =>
      left.some((m) => !isObj(m))
        ? `Type '${t}' is not assignable to type 'object'. (The right side of 'in' can't be a primitive.)`
        : left.includes("null")
          ? `'x' is possibly 'null'.`
          : null,
  },
  {
    code: `x.kind === "circle"`,
    keep: (m) => m === "circle",
    error: (left, t) =>
      left.some((m) => m !== "circle" && m !== "square")
        ? `Property 'kind' does not exist on type '${t}'.`
        : !left.includes("circle")
          ? `This comparison appears to be unintentional because the types have no overlap.`
          : null,
  },
  {
    code: `x.kind === "square"`,
    keep: (m) => m === "square",
    error: (left, t) =>
      left.some((m) => m !== "circle" && m !== "square")
        ? `Property 'kind' does not exist on type '${t}'.`
        : !left.includes("square")
          ? `This comparison appears to be unintentional because the types have no overlap.`
          : null,
  },
];

const typeText = (ids: MemberId[]) => (ids.length ? MEMBERS.filter((m) => ids.includes(m.id)).map((m) => m.type).join(" | ") : "never");

/** Pick checks one by one; each `if` keeps only the members that pass. */
export function NarrowingLab({ goal, onSolved }: GoalProps<"circle" | "square">) {
  const [applied, setApplied] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const left = applied.reduce<MemberId[]>((ids, code) => ids.filter(CHECKS.find((c) => c.code === code)!.keep), MEMBERS.map((m) => m.id));
  const t = typeText(left);
  const target = goal ?? "circle";
  const solved = left.length === 1 && left[0] === target;

  function apply(c: Check) {
    const e = c.error?.(left, t) ?? null;
    if (e) {
      setError(`${c.code} → error: ${e}`);
      return;
    }
    setError(null);
    const next = [...applied, c.code];
    setApplied(next);
    const after = left.filter(c.keep);
    if (goal && after.length === 1 && after[0] === goal) onSolved?.();
  }

  const indent = (n: number) => "  ".repeat(n);
  const code = [
    `type Input = string | number | null | boolean[] | Circle | Square;`,
    `function handle(x: Input) {`,
    ...applied.map((c, i) => `${indent(i + 1)}if (${c}) {`),
    `${indent(applied.length + 1)}x; // ${t}`,
    ...applied.map((_, i) => `${indent(applied.length - i)}}`),
    `}`,
  ].join("\n");

  return (
    <div>
      <LabHeader
        title="Narrowing navigator"
        hint={`Add checks until x is narrowed to exactly ${target === "circle" ? "Circle" : "Square"}. Each check nests a new if block. Invalid checks show the compiler error.`}
      />
      <CodeBlock lang="ts" code={`interface Circle { kind: "circle"; radius: number }\ninterface Square { kind: "square"; size: number }`} />
      <div className="mt-3 flex flex-wrap gap-1.5">
        {MEMBERS.map((m) => {
          const alive = left.includes(m.id);
          return (
            <span
              key={m.id}
              className={`rounded-lg border px-2.5 py-1 font-mono text-sm transition ${alive ? "" : "scale-95 line-through opacity-30"}`}
              style={{ borderColor: `${m.color}88`, background: alive ? `${m.color}22` : undefined, color: alive ? m.color : undefined }}
            >
              {m.type}
            </span>
          );
        })}
      </div>
      <div className="mt-3 grid gap-4 md:grid-cols-[1.2fr_1fr]">
        <CodeBlock lang="ts" code={code} />
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Add a check</div>
          <div className="mt-2 flex flex-wrap gap-1.5">
            {CHECKS.map((c) => (
              <button
                key={c.code}
                type="button"
                disabled={applied.includes(c.code) || solved}
                onClick={() => apply(c)}
                className="rounded-lg border border-sky-400/40 bg-sky-400/10 px-2 py-1 font-mono text-xs text-sky-100 hover:bg-sky-400/25 disabled:opacity-30"
              >
                {c.code}
              </button>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button
              type="button"
              onClick={() => {
                setApplied((a) => a.slice(0, -1));
                setError(null);
              }}
              disabled={!applied.length}
              className="rounded-xl px-3 py-1.5 text-sm text-slate-400 hover:text-white disabled:opacity-30"
            >
              ↶ Undo
            </button>
            <button
              type="button"
              onClick={() => {
                setApplied([]);
                setError(null);
              }}
              className="rounded-xl px-3 py-1.5 text-sm text-slate-400 hover:text-white"
            >
              Reset
            </button>
          </div>
          {error && <p className="pop-in mt-2 rounded-lg border border-rose-400/50 bg-rose-400/10 p-2 font-mono text-xs text-rose-200">{error}</p>}
          {left.length === 0 && <p className="mt-2 text-sm text-amber-300">x is never: no value can reach this branch.</p>}
          {solved && <p className="pop-in mt-2 text-sm font-semibold text-emerald-300">✅ Narrowed to {t} in {applied.length} checks. Notice that typeof x === &quot;object&quot; alone still lets null through.</p>}
        </div>
      </div>
    </div>
  );
}

// ───────────── Utility-type builder ─────────────

interface Prop {
  key: string;
  type: string;
  optional: boolean;
  readonly: boolean;
}

const USER: Prop[] = [
  { key: "id", type: "number", optional: false, readonly: false },
  { key: "name", type: "string", optional: false, readonly: false },
  { key: "email", type: "string", optional: true, readonly: false },
  { key: "password", type: "string", optional: false, readonly: false },
  { key: "createdAt", type: "Date", optional: false, readonly: true },
];

type Op = { kind: "Partial" | "Required" | "Readonly" } | { kind: "Pick" | "Omit"; keys: string[] };

function applyOp(props: Prop[], op: Op): Prop[] {
  switch (op.kind) {
    case "Partial":
      return props.map((p) => ({ ...p, optional: true }));
    case "Required":
      return props.map((p) => ({ ...p, optional: false }));
    case "Readonly":
      return props.map((p) => ({ ...p, readonly: true }));
    case "Pick":
      return props.filter((p) => op.keys.includes(p.key));
    case "Omit":
      return props.filter((p) => !op.keys.includes(p.key));
  }
}

function expr(ops: Op[]) {
  return ops.reduce((e, op) => (op.kind === "Pick" || op.kind === "Omit" ? `${op.kind}<${e}, ${op.keys.map((k) => `"${k}"`).join(" | ")}>` : `${op.kind}<${e}>`), "User");
}

const show = (props: Prop[]) =>
  props.length ? `{\n${props.map((p) => `  ${p.readonly ? "readonly " : ""}${p.key}${p.optional ? "?" : ""}: ${p.type};`).join("\n")}\n}` : "{}";

const GOALS: Record<"patch" | "public", { text: string; shape: Prop[] }> = {
  patch: {
    text: "An update payload: only name and email, both optional.",
    shape: [
      { key: "name", type: "string", optional: true, readonly: false },
      { key: "email", type: "string", optional: true, readonly: false },
    ],
  },
  public: {
    text: "A public, read-only profile: everything except password, all readonly, email still optional.",
    shape: USER.filter((p) => p.key !== "password").map((p) => ({ ...p, readonly: true })),
  },
};

const same = (a: Prop[], b: Prop[]) =>
  a.length === b.length && a.every((p) => b.some((q) => q.key === p.key && q.optional === p.optional && q.readonly === p.readonly));

/** Wrap `User` in utility types and watch the resulting shape. */
export function UtilityBuilderLab({ goal, onSolved }: GoalProps<"patch" | "public">) {
  const [ops, setOps] = useState<Op[]>([]);
  const [keys, setKeys] = useState<string[]>([]);
  const props = ops.reduce(applyOp, USER);
  const target = goal ? GOALS[goal] : null;
  const done = target ? same(props, target.shape) : false;

  function add(op: Op) {
    const next = [...ops, op];
    setOps(next);
    setKeys([]);
    if (target && same(next.reduce(applyOp, USER), target.shape)) onSolved?.();
  }

  const btn = "rounded-lg border border-violet-400/40 bg-violet-400/10 px-2.5 py-1 font-mono text-sm text-violet-100 hover:bg-violet-400/25 disabled:opacity-30";

  return (
    <div>
      <LabHeader title="Utility-type builder" hint="Each button wraps the current type in a utility. For Pick and Omit, tap keys first." />
      {target && <p className="mb-3 rounded-lg border border-amber-400/40 bg-amber-400/10 p-2 text-sm text-amber-100">🎯 Build: {target.text}</p>}
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <CodeBlock
            lang="ts"
            code={`interface User {\n  id: number;\n  name: string;\n  email?: string;\n  password: string;\n  readonly createdAt: Date;\n}`}
          />
          <div className="mt-3 text-xs font-bold uppercase tracking-wider text-slate-400">Keys for Pick / Omit</div>
          <div className="mt-1 flex flex-wrap gap-1.5">
            {props.map((p) => (
              <button
                key={p.key}
                type="button"
                onClick={() => setKeys((k) => (k.includes(p.key) ? k.filter((x) => x !== p.key) : [...k, p.key]))}
                className={`rounded-lg border px-2 py-1 font-mono text-xs ${keys.includes(p.key) ? "border-amber-400 bg-amber-400/20 text-amber-100" : "border-white/10 text-slate-300"}`}
              >
                &quot;{p.key}&quot;
              </button>
            ))}
          </div>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {(["Partial", "Required", "Readonly"] as const).map((k) => (
              <button key={k} type="button" className={btn} disabled={done} onClick={() => add({ kind: k })}>
                {k}
              </button>
            ))}
            {(["Pick", "Omit"] as const).map((k) => (
              <button key={k} type="button" className={btn} disabled={done || keys.length === 0} onClick={() => add({ kind: k, keys })}>
                {k}
              </button>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <button type="button" onClick={() => setOps((o) => o.slice(0, -1))} disabled={!ops.length} className="rounded-xl px-3 py-1.5 text-sm text-slate-400 hover:text-white disabled:opacity-30">
              ↶ Undo
            </button>
            <button
              type="button"
              onClick={() => {
                setOps([]);
                setKeys([]);
              }}
              className="rounded-xl px-3 py-1.5 text-sm text-slate-400 hover:text-white"
            >
              Reset
            </button>
          </div>
        </div>
        <div>
          <div className="mb-1 overflow-x-auto rounded-lg bg-black/50 px-3 py-2 font-mono text-sm text-amber-200">type Result = {expr(ops)};</div>
          <CodeBlock lang="ts" code={`// Result resolves to:\n${show(props)}`} />
          {done && <p className="pop-in mt-2 text-sm font-semibold text-emerald-300">✅ That&apos;s the shape. Utility types compose: each one maps over the result of the last.</p>}
          {!target && ops.length > 0 && <p className="mt-2 text-xs text-slate-400">Pick and Omit keep each property&apos;s ? and readonly modifiers.</p>}
        </div>
      </div>
    </div>
  );
}
