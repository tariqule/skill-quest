"use client";

import { useState } from "react";
import { LabHeader, type GoalProps } from "@/components/learn/blocks";
import { CUSTOMERS, EMPLOYEES, ORDERS, type Cell, type Customer, type Employee, type Order } from "./data";
import { BlockIcon } from "@/components/learn/block-icons";

/** Hands-on playgrounds for Learn SQL. Every lab evaluates its query in TypeScript over tiny in-memory tables. */

const btn = "rounded-lg px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40";
const chip = (on: boolean, color = "bg-sky-400") =>
  `rounded-lg px-2.5 py-1 font-mono text-xs font-bold transition ${on ? `${color} text-slate-950` : "bg-white/10 text-slate-200 hover:bg-white/15"}`;

function CellText({ v }: { v: Cell }) {
  return v === null ? <span className="italic text-muted-foreground">NULL</span> : <>{v}</>;
}

/** A small result grid. */
function ResultTable({ cols, rows, empty = "(0 rows)" }: { cols: string[]; rows: Cell[][]; empty?: string }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950">
      <table className="w-full font-mono text-xs">
        <thead>
          <tr className="border-b border-white/10 text-left text-slate-400">
            {cols.map((c) => (
              <th key={c} className="px-2.5 py-1.5 font-bold">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="pop-in border-b border-white/5 text-slate-100 last:border-0">
              {r.map((v, j) => (
                <td key={j} className="px-2.5 py-1">
                  <CellText v={v} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <div className="px-2.5 py-2 font-mono text-xs text-muted-foreground">{empty}</div>}
      {rows.length > 0 && <div className="border-t border-white/10 px-2.5 py-1 text-[11px] text-muted-foreground">({rows.length} {rows.length === 1 ? "row" : "rows"})</div>}
    </div>
  );
}

// ───────────── Query builder: SELECT / WHERE / ORDER BY / LIMIT ─────────────

type EmpCol = keyof Employee;
const EMP_COLS: EmpCol[] = ["id", "name", "dept", "salary", "city"];

const FILTERS: { id: string; sql: string; test: (e: Employee) => boolean }[] = [
  { id: "eng", sql: "dept = 'Eng'", test: (e) => e.dept === "Eng" },
  { id: "rich", sql: "salary > 80", test: (e) => e.salary > 80 },
  { id: "oslorome", sql: "city IN ('Oslo', 'Rome')", test: (e) => e.city === "Oslo" || e.city === "Rome" },
  { id: "lisbon", sql: "city = 'Lisbon'", test: (e) => e.city === "Lisbon" },
];

interface Query {
  cols: EmpCol[];
  filters: string[];
  orderBy: EmpCol | null;
  desc: boolean;
  limit: number | null;
}

function runQuery(q: Query) {
  const active = FILTERS.filter((f) => q.filters.includes(f.id));
  const kept = EMPLOYEES.filter((e) => active.every((f) => f.test(e)));
  const sorted = q.orderBy === null ? kept : [...kept].sort((a, b) => cmp(a[q.orderBy!], b[q.orderBy!]) * (q.desc ? -1 : 1));
  const limited = q.limit === null ? sorted : sorted.slice(0, q.limit);
  return { kept, limited };
}

function cmp(a: string | number, b: string | number) {
  return typeof a === "number" && typeof b === "number" ? a - b : String(a).localeCompare(String(b));
}

function querySql(q: Query) {
  const lines = [`SELECT ${q.cols.length === EMP_COLS.length ? "*" : q.cols.join(", ")}`, "FROM employees"];
  const active = FILTERS.filter((f) => q.filters.includes(f.id));
  active.forEach((f, i) => lines.push(`${i === 0 ? "WHERE" : "  AND"} ${f.sql}`));
  if (q.orderBy) lines.push(`ORDER BY ${q.orderBy}${q.desc ? " DESC" : ""}`);
  if (q.limit !== null) lines.push(`LIMIT ${q.limit}`);
  return lines.join("\n") + ";";
}

const START_QUERY: Query = { cols: ["name", "dept", "salary", "city"], filters: [], orderBy: null, desc: false, limit: null };

export function QueryBuilderLab({ goal, onSolved }: GoalProps<"topEng" | "lowest">) {
  const [q, setQ] = useState<Query>(START_QUERY);
  const { kept, limited } = runQuery(q);

  function update(patch: Partial<Query>) {
    const next = { ...q, ...patch };
    setQ(next);
    const names = runQuery(next).limited.map((e) => e.name).join(",");
    if (goal === "topEng" && names === "Ada,Fay" && next.orderBy === "salary" && next.desc) onSolved?.();
    if (goal === "lowest" && names === "Eli" && next.orderBy === "salary" && !next.desc) onSolved?.();
  }

  const toggle = <T,>(list: T[], v: T) => (list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  const cols = EMP_COLS.filter((c) => q.cols.includes(c));

  return (
    <div>
      <LabHeader title="Query builder" hint="Switch clauses on and off. The query and its result rows update instantly." />
      <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <div className="grid content-start gap-3 text-sm">
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-violet-300">SELECT columns</div>
            <div className="flex flex-wrap gap-1.5">
              {EMP_COLS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => {
                    const next = toggle(q.cols, c);
                    if (next.length > 0) update({ cols: next });
                  }}
                  className={chip(q.cols.includes(c), "bg-violet-300")}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-amber-300">WHERE (all must be true)</div>
            <div className="flex flex-wrap gap-1.5">
              {FILTERS.map((f) => (
                <button key={f.id} type="button" onClick={() => update({ filters: toggle(q.filters, f.id) })} className={chip(q.filters.includes(f.id), "bg-amber-300")}>
                  {f.sql}
                </button>
              ))}
            </div>
          </div>
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-sky-300">ORDER BY</div>
            <div className="flex flex-wrap gap-1.5">
              {([null, "name", "salary", "city"] as (EmpCol | null)[]).map((c) => (
                <button key={String(c)} type="button" onClick={() => update({ orderBy: c })} className={chip(q.orderBy === c)}>
                  {c ?? "(none)"}
                </button>
              ))}
              <button type="button" disabled={!q.orderBy} onClick={() => update({ desc: !q.desc })} className={`${chip(q.desc)} disabled:opacity-30`}>
                {q.desc ? "DESC ↓" : "ASC ↑"}
              </button>
            </div>
          </div>
          <div>
            <div className="mb-1 text-xs font-bold uppercase tracking-wider text-emerald-300">LIMIT</div>
            <div className="flex flex-wrap gap-1.5">
              {[null, 1, 2, 3].map((n) => (
                <button key={String(n)} type="button" onClick={() => update({ limit: n })} className={chip(q.limit === n, "bg-emerald-300")}>
                  {n ?? "(none)"}
                </button>
              ))}
            </div>
          </div>
          <button type="button" onClick={() => setQ(START_QUERY)} className={`${btn} bg-slate-800 text-slate-300`}>
            ↺ Reset
          </button>
        </div>

        <div className="grid min-w-0 content-start gap-3">
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950 p-3 font-mono text-[13px] leading-relaxed text-sky-100">{querySql(q)}</pre>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold">
            <span className="rounded-md bg-white/10 px-2 py-0.5 text-slate-200">FROM: {EMPLOYEES.length} rows</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded-md bg-amber-300/20 px-2 py-0.5 text-amber-200">WHERE: {kept.length} kept</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded-md bg-sky-300/20 px-2 py-0.5 text-sky-200">ORDER BY: {q.orderBy ? "sorted" : "any order"}</span>
            <span className="text-muted-foreground">→</span>
            <span className="rounded-md bg-emerald-300/20 px-2 py-0.5 text-emerald-200">LIMIT: {limited.length} returned</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {EMPLOYEES.map((e) => {
              const k = kept.includes(e);
              const r = limited.includes(e);
              return (
                <span
                  key={e.id}
                  title={k ? (r ? "returned" : "cut by LIMIT") : "removed by WHERE"}
                  className={`rounded-md px-2 py-0.5 font-mono text-[11px] ${r ? "bg-emerald-400/25 text-emerald-100" : k ? "bg-sky-400/10 text-sky-200/60" : "bg-white/5 text-muted-foreground line-through"}`}
                >
                  {e.name}
                </span>
              );
            })}
          </div>
          <ResultTable key={querySql(q)} cols={cols} rows={limited.map((e) => cols.map((c) => e[c]))} />
          <p className="text-xs text-slate-400">
            {q.limit !== null && !q.orderBy
              ? "LIMIT without ORDER BY: a real database may hand back any rows that match. Always sort before you limit."
              : "Salaries are in thousands. Struck-through names were removed by WHERE; faded ones were cut by LIMIT."}
          </p>
        </div>
      </div>
    </div>
  );
}

// ───────────── Join visualizer ─────────────

type JoinType = "INNER" | "LEFT" | "RIGHT" | "FULL";
type JoinFilter = "none" | "oNull" | "cNull";
interface JoinRow {
  c: Customer | null;
  o: Order | null;
}

function runJoin(type: JoinType, filter: JoinFilter): JoinRow[] {
  const rows: JoinRow[] = [];
  for (const c of CUSTOMERS) {
    const matches = ORDERS.filter((o) => o.customer_id === c.id);
    if (matches.length) matches.forEach((o) => rows.push({ c, o }));
    else if (type === "LEFT" || type === "FULL") rows.push({ c, o: null });
  }
  if (type === "RIGHT" || type === "FULL") {
    for (const o of ORDERS) if (!CUSTOMERS.some((c) => c.id === o.customer_id)) rows.push({ c: null, o });
  }
  if (filter === "oNull") return rows.filter((r) => r.o === null);
  if (filter === "cNull") return rows.filter((r) => r.c === null);
  return rows;
}

const JOIN_NOTES: Record<JoinType, string> = {
  INNER: "Only pairs that match the ON condition. Di (no orders) and the guest order both disappear.",
  LEFT: "Every customer, matched or not. Customers with no orders get NULLs in the order columns.",
  RIGHT: "Every order, matched or not. The guest order gets NULLs in the customer columns.",
  FULL: "Everything from both sides: matched pairs, plus unmatched rows from each side padded with NULLs.",
};

export function JoinLab({ goal, onSolved }: GoalProps<"noOrders" | "orphan">) {
  const [type, setType] = useState<JoinType>("INNER");
  const [filter, setFilter] = useState<JoinFilter>("none");
  const rows = runJoin(type, filter);

  function choose(t: JoinType, f: JoinFilter) {
    setType(t);
    setFilter(f);
    const res = runJoin(t, f);
    if (goal === "noOrders" && res.length === 1 && res[0].c?.name === "Di") onSolved?.();
    if (goal === "orphan" && res.length === 1 && res[0].c === null && res[0].o?.id === 15) onSolved?.();
  }

  const custUsed = new Set(rows.filter((r) => r.c).map((r) => r.c!.id));
  const ordUsed = new Set(rows.filter((r) => r.o).map((r) => r.o!.id));
  const sqlText = [
    "SELECT c.name, o.id, o.total",
    "FROM customers c",
    `${type === "INNER" ? "" : type + " "}JOIN orders o ON o.customer_id = c.id`,
    ...(filter === "oNull" ? ["WHERE o.id IS NULL"] : filter === "cNull" ? ["WHERE c.id IS NULL"] : []),
  ].join("\n");

  return (
    <div>
      <LabHeader title="Join visualizer" hint="Pick a join type and watch which rows from each table survive. Unmatched rows get padded with NULL." />
      <div className="mb-3 flex flex-wrap gap-1.5">
        {(["INNER", "LEFT", "RIGHT", "FULL"] as JoinType[]).map((t) => (
          <button key={t} type="button" onClick={() => choose(t, filter)} className={chip(type === t)}>
            {t} JOIN
          </button>
        ))}
        <span className="mx-1 self-center text-muted-foreground">|</span>
        {(
          [
            ["none", "no WHERE"],
            ["oNull", "WHERE o.id IS NULL"],
            ["cNull", "WHERE c.id IS NULL"],
          ] as [JoinFilter, string][]
        ).map(([f, label]) => (
          <button key={f} type="button" onClick={() => choose(type, f)} className={chip(filter === f, "bg-amber-300")}>
            {label}
          </button>
        ))}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {[
          {
            title: "customers c",
            items: CUSTOMERS.map((c) => ({ key: c.id, text: `${c.id} · ${c.name}`, used: custUsed.has(c.id), matched: ORDERS.some((o) => o.customer_id === c.id) })),
          },
          {
            title: "orders o",
            items: ORDERS.map((o) => ({
              key: o.id,
              text: `${o.id} · customer_id ${o.customer_id ?? "NULL"} · ${o.total}`,
              used: ordUsed.has(o.id),
              matched: CUSTOMERS.some((c) => c.id === o.customer_id),
            })),
          },
        ].map((side) => (
          <div key={side.title} className="rounded-xl border border-white/10 bg-slate-950/60 p-2">
            <div className="mb-1 font-mono text-xs font-bold text-slate-400">{side.title}</div>
            <div className="grid gap-1">
              {side.items.map((it) => (
                <div
                  key={it.key}
                  className={`rounded-md px-2 py-1 font-mono text-xs transition ${
                    it.used ? (it.matched ? "bg-emerald-400/20 text-emerald-100" : "bg-amber-400/20 text-amber-100") : "bg-white/5 text-muted-foreground line-through"
                  }`}
                >
                  {it.text}
                  {!it.matched && <span className="ml-2 text-[10px] text-amber-300">no match</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <div className="grid content-start gap-2">
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950 p-3 font-mono text-[13px] leading-relaxed text-sky-100">{sqlText};</pre>
          <p className="text-sm text-slate-300">{JOIN_NOTES[type]}</p>
          <p className="text-xs text-slate-400">
            <BlockIcon icon="🟩" className="inline-block size-[1.1em] align-[-0.15em]" /> matched · <BlockIcon icon="🟨" className="inline-block size-[1.1em] align-[-0.15em]" /> kept without a match (NULL-padded) · struck out = dropped. The guest order has customer_id NULL, and NULL never equals anything, so it
            can&apos;t match.
          </p>
        </div>
        <ResultTable key={type + filter} cols={["c.name", "o.id", "o.total"]} rows={rows.map((r) => [r.c?.name ?? null, r.o?.id ?? null, r.o?.total ?? null])} />
      </div>
    </div>
  );
}

// ───────────── GROUP BY buckets ─────────────

type GroupKey = "none" | "customer_id" | "status";
type Agg = "COUNT(*)" | "SUM(total)" | "AVG(total)" | "MAX(total)";
type Having = "none" | "count2" | "sum50";

const HAVING_SQL: Record<Having, string> = { none: "", count2: "HAVING COUNT(*) >= 2", sum50: "HAVING SUM(total) > 50" };
const BUCKET_COLORS = ["#38bdf8", "#f59e0b", "#34d399", "#f472b6", "#a78bfa"];

function aggregate(rows: Order[], agg: Agg): number {
  const totals = rows.map((r) => r.total);
  if (agg === "COUNT(*)") return rows.length;
  if (agg === "SUM(total)") return totals.reduce((s, x) => s + x, 0);
  if (agg === "MAX(total)") return Math.max(...totals);
  return Math.round((totals.reduce((s, x) => s + x, 0) / totals.length) * 100) / 100;
}

function runGroup(paidOnly: boolean, key: GroupKey, agg: Agg, having: Having) {
  const kept = ORDERS.filter((o) => !paidOnly || o.status === "paid");
  const groups: { key: Cell; rows: Order[] }[] = [];
  for (const o of kept) {
    const k: Cell = key === "none" ? "all rows" : o[key];
    const g = groups.find((x) => x.key === k);
    if (g) g.rows.push(o);
    else groups.push({ key: k, rows: [o] });
  }
  const pass = (g: { rows: Order[] }) =>
    having === "none" ? true : having === "count2" ? g.rows.length >= 2 : aggregate(g.rows, "SUM(total)") > 50;
  return { kept, groups: groups.map((g) => ({ ...g, value: aggregate(g.rows, agg), pass: pass(g) })) };
}

export function GroupByLab({ goal, onSolved }: GoalProps<"bigSpenders" | "perStatus">) {
  const [paidOnly, setPaidOnly] = useState(false);
  const [key, setKey] = useState<GroupKey>("customer_id");
  const [agg, setAgg] = useState<Agg>("COUNT(*)");
  const [having, setHaving] = useState<Having>("none");
  const { kept, groups } = runGroup(paidOnly, key, agg, having);

  function change(p: { paidOnly?: boolean; key?: GroupKey; agg?: Agg; having?: Having }) {
    const n = { paidOnly, key, agg, having, ...p };
    setPaidOnly(n.paidOnly);
    setKey(n.key);
    setAgg(n.agg);
    setHaving(n.having);
    const res = runGroup(n.paidOnly, n.key, n.agg, n.having).groups.filter((g) => g.pass);
    const keys = res.map((g) => String(g.key)).join(",");
    if (goal === "bigSpenders" && n.key === "customer_id" && n.paidOnly && keys === "1,3") onSolved?.();
    if (goal === "perStatus" && n.key === "status" && n.agg === "COUNT(*)" && !n.paidOnly && n.having === "none") onSolved?.();
  }

  const keyCol = key === "none" ? null : key;
  const sqlText = [
    `SELECT ${keyCol ? keyCol + ", " : ""}${agg}`,
    "FROM orders",
    ...(paidOnly ? ["WHERE status = 'paid'"] : []),
    ...(keyCol ? [`GROUP BY ${keyCol}`] : []),
    ...(having !== "none" ? [HAVING_SQL[having]] : []),
  ].join("\n");
  const results = groups.filter((g) => g.pass);

  return (
    <div>
      <LabHeader title="GROUP BY buckets" hint="WHERE filters rows, GROUP BY drops the survivors into buckets, the aggregate squashes each bucket to one row, and HAVING filters buckets." />
      <div className="grid gap-2 text-sm sm:grid-cols-2">
        <div>
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-amber-300">WHERE (rows)</div>
          <button type="button" onClick={() => change({ paidOnly: !paidOnly })} className={chip(paidOnly, "bg-amber-300")}>
            status = &apos;paid&apos;
          </button>
        </div>
        <div>
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-sky-300">GROUP BY</div>
          <div className="flex flex-wrap gap-1.5">
            {(["none", "customer_id", "status"] as GroupKey[]).map((k) => (
              <button key={k} type="button" onClick={() => change({ key: k })} className={chip(key === k)}>
                {k === "none" ? "(no GROUP BY)" : k}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-violet-300">Aggregate</div>
          <div className="flex flex-wrap gap-1.5">
            {(["COUNT(*)", "SUM(total)", "AVG(total)", "MAX(total)"] as Agg[]).map((a) => (
              <button key={a} type="button" onClick={() => change({ agg: a })} className={chip(agg === a, "bg-violet-300")}>
                {a}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-rose-300">HAVING (buckets)</div>
          <div className="flex flex-wrap gap-1.5">
            {(["none", "count2", "sum50"] as Having[]).map((h) => (
              <button key={h} type="button" onClick={() => change({ having: h })} className={chip(having === h, "bg-rose-300")}>
                {h === "none" ? "(none)" : HAVING_SQL[h].replace("HAVING ", "")}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1">
        {ORDERS.map((o) => {
          const k = kept.includes(o);
          return (
            <span key={o.id} className={`rounded-md px-2 py-0.5 font-mono text-[11px] ${k ? "bg-white/10 text-slate-200" : "bg-white/5 text-muted-foreground line-through"}`}>
              #{o.id} c{o.customer_id ?? "∅"} {o.total} {o.status}
            </span>
          );
        })}
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {groups.map((g, i) => {
          const color = BUCKET_COLORS[i % BUCKET_COLORS.length];
          return (
            <div
              key={`${key}-${String(g.key)}-${paidOnly}`}
              className={`pop-in rounded-xl border-2 bg-slate-950/70 p-2 transition ${g.pass ? "" : "opacity-40"}`}
              style={{ borderColor: color }}
            >
              <div className="flex items-center justify-between font-mono text-[11px] font-bold" style={{ color }}>
                <span>
                  {keyCol ? `${keyCol} = ` : ""}
                  {g.key === null ? "NULL" : String(g.key)}
                </span>
                {!g.pass && <span className="text-rose-300"><BlockIcon icon="✗" className="inline-block size-[1.1em] align-[-0.15em]" /> HAVING</span>}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {g.rows.map((r) => (
                  <span key={r.id} className="rounded px-1.5 font-mono text-[11px] text-slate-950" style={{ background: color }}>
                    {r.total}
                  </span>
                ))}
              </div>
              <div className="mt-1.5 font-mono text-xs text-slate-300">
                {agg} = <span className="font-bold text-white">{g.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950 p-3 font-mono text-[13px] leading-relaxed text-sky-100">{sqlText};</pre>
        <ResultTable key={sqlText} cols={[...(keyCol ? [keyCol] : []), agg]} rows={results.map((g) => [...(keyCol ? [g.key] : []), g.value])} />
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Notice the guest order (customer_id NULL): GROUP BY puts all NULL keys into one bucket.{" "}
        {agg === "AVG(total)" && "PostgreSQL returns AVG of integers as numeric, e.g. 37.5000000000000000; it's rounded here."}
      </p>
    </div>
  );
}

// ───────────── Two sessions, one balance: isolation and lost updates ─────────────

type Pattern = "app" | "atomic" | "lock";
type Iso = "READ COMMITTED" | "REPEATABLE READ" | "SERIALIZABLE";
interface TxStep {
  who: 1 | 2;
  sql: string;
  result: string;
  tone?: "wait" | "error" | "ok";
}

const PATTERNS: { id: Pattern; name: string; note: string }[] = [
  { id: "app", name: "Read, then write the computed value", note: "The app reads the balance, subtracts 30 in code, and writes the number back." },
  { id: "atomic", name: "Atomic UPDATE", note: "Let the database do the arithmetic: SET balance = balance - 30." },
  { id: "lock", name: "SELECT … FOR UPDATE", note: "Lock the row when reading it, so the other session must wait its turn." },
];

/** PostgreSQL behaviour for two sessions that each withdraw 30 from a balance of 100. */
function script(p: Pattern, iso: Iso): { steps: TxStep[]; balance: number; outcome: string } {
  const strict = iso !== "READ COMMITTED";
  const serr = "ERROR: could not serialize access due to concurrent update";
  if (p === "app") {
    return {
      steps: [
        { who: 1, sql: "SELECT balance FROM accounts WHERE id = 1;", result: "100" },
        { who: 2, sql: "SELECT balance FROM accounts WHERE id = 1;", result: "100" },
        { who: 1, sql: "UPDATE accounts SET balance = 70 WHERE id = 1;", result: "UPDATE 1" },
        { who: 1, sql: "COMMIT;", result: "COMMIT", tone: "ok" },
        strict
          ? { who: 2, sql: "UPDATE accounts SET balance = 70 WHERE id = 1;", result: serr, tone: "error" }
          : { who: 2, sql: "UPDATE accounts SET balance = 70 WHERE id = 1;", result: "UPDATE 1 (overwrites session 1's change)" },
        strict ? { who: 2, sql: "COMMIT;", result: "ROLLBACK (the transaction already failed)", tone: "error" } : { who: 2, sql: "COMMIT;", result: "COMMIT", tone: "ok" },
      ],
      balance: 70,
      outcome: strict
        ? "Session 2 was stopped instead of silently losing an update. The app must retry it; on retry it reads 70 and writes 40."
        : "Lost update! Two withdrawals of 30 happened, but the balance only dropped once.",
    };
  }
  if (p === "atomic") {
    return {
      steps: [
        { who: 1, sql: "UPDATE accounts SET balance = balance - 30 WHERE id = 1;", result: "UPDATE 1 (row now locked)" },
        { who: 2, sql: "UPDATE accounts SET balance = balance - 30 WHERE id = 1;", result: "waiting for session 1's row lock…", tone: "wait" },
        { who: 1, sql: "COMMIT;", result: "COMMIT", tone: "ok" },
        strict
          ? { who: 2, sql: "(session 2 wakes up)", result: serr, tone: "error" }
          : { who: 2, sql: "(session 2 wakes up)", result: "re-reads the committed row (70) → UPDATE 1, balance 40" },
        strict ? { who: 2, sql: "COMMIT;", result: "ROLLBACK (the transaction already failed)", tone: "error" } : { who: 2, sql: "COMMIT;", result: "COMMIT", tone: "ok" },
      ],
      balance: strict ? 70 : 40,
      outcome: strict
        ? "No update was lost, but at this level session 2 must retry. A retry gives 40."
        : "Correct: 100 → 70 → 40. The row lock serialised the two updates, and READ COMMITTED re-checked the latest row.",
    };
  }
  return {
    steps: [
      { who: 1, sql: "SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;", result: "100 (row now locked)" },
      { who: 2, sql: "SELECT balance FROM accounts WHERE id = 1 FOR UPDATE;", result: "waiting for session 1's row lock…", tone: "wait" },
      { who: 1, sql: "UPDATE accounts SET balance = 70 WHERE id = 1;", result: "UPDATE 1" },
      { who: 1, sql: "COMMIT;", result: "COMMIT", tone: "ok" },
      strict ? { who: 2, sql: "(session 2 wakes up)", result: serr, tone: "error" } : { who: 2, sql: "(session 2 wakes up)", result: "returns the latest balance: 70" },
      strict
        ? { who: 2, sql: "ROLLBACK;", result: "ROLLBACK", tone: "error" }
        : { who: 2, sql: "UPDATE accounts SET balance = 40 WHERE id = 1; COMMIT;", result: "UPDATE 1 · COMMIT", tone: "ok" },
    ],
    balance: strict ? 70 : 40,
    outcome: strict
      ? "No update was lost, but session 2 must retry. A retry reads 70 and writes 40."
      : "Correct: session 2 waited, then read the fresh value 70 and wrote 40.",
  };
}

export function IsolationLab({ goal, onSolved }: GoalProps<"lost" | "safe">) {
  const [pattern, setPattern] = useState<Pattern>("app");
  const [iso, setIso] = useState<Iso>("READ COMMITTED");
  const [shown, setShown] = useState(0);
  const { steps, balance, outcome } = script(pattern, iso);
  const done = shown >= steps.length;

  function pick(p: Pattern, i: Iso) {
    setPattern(p);
    setIso(i);
    setShown(0);
  }

  function step() {
    const n = shown + 1;
    setShown(n);
    if (n === steps.length) {
      const failed = steps.some((s) => s.tone === "error");
      if (goal === "lost" && !failed && balance === 70) onSolved?.();
      if (goal === "safe" && !failed && balance === 40 && iso === "READ COMMITTED") onSolved?.();
    }
  }

  const tone = (t?: TxStep["tone"]) => (t === "error" ? "text-rose-300" : t === "wait" ? "text-amber-300" : t === "ok" ? "text-emerald-300" : "text-slate-200");

  return (
    <div>
      <LabHeader title="Two sessions, one balance" hint="Two sessions each withdraw 30 from a balance of 100 at the same time. Choose a pattern and an isolation level, then step through (PostgreSQL behaviour)." />
      <div className="grid gap-2 sm:grid-cols-2">
        <div>
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-sky-300">Pattern</div>
          <div className="grid gap-1.5">
            {PATTERNS.map((p) => (
              <button key={p.id} type="button" onClick={() => pick(p.id, iso)} className={`${chip(pattern === p.id)} text-left`}>
                {p.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <div className="mb-1 text-xs font-bold uppercase tracking-wider text-violet-300">Isolation level</div>
          <div className="grid gap-1.5">
            {(["READ COMMITTED", "REPEATABLE READ", "SERIALIZABLE"] as Iso[]).map((i) => (
              <button key={i} type="button" onClick={() => pick(pattern, i)} className={`${chip(iso === i, "bg-violet-300")} text-left`}>
                {i}
                {i === "READ COMMITTED" ? " (PostgreSQL default)" : ""}
              </button>
            ))}
          </div>
        </div>
      </div>
      <p className="mt-2 text-sm text-slate-300">{PATTERNS.find((p) => p.id === pattern)!.note}</p>

      <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-slate-950">
        <div className="grid grid-cols-2 border-b border-white/10 text-center text-xs font-bold uppercase tracking-wider">
          <div className="py-1.5 text-sky-300">Session 1</div>
          <div className="py-1.5 text-amber-300">Session 2</div>
        </div>
        <div className="grid gap-1 p-2">
          <div className="grid grid-cols-2 gap-2 font-mono text-[11px] text-muted-foreground">
            <div>BEGIN ISOLATION LEVEL {iso};</div>
            <div>BEGIN ISOLATION LEVEL {iso};</div>
          </div>
          {steps.slice(0, shown).map((s, i) => (
            <div key={i} className="pop-in grid grid-cols-2 gap-2 font-mono text-[11px]">
              {s.who === 2 && <div />}
              <div className="rounded-md bg-white/5 p-1.5">
                <div className="text-slate-100">{s.sql}</div>
                <div className={tone(s.tone)}>→ {s.result}</div>
              </div>
              {s.who === 1 && <div />}
            </div>
          ))}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button type="button" disabled={done} onClick={step} className={`${btn} bg-primary text-primary-foreground`}>
          ▶ Step {Math.min(shown + 1, steps.length)}/{steps.length}
        </button>
        <button type="button" onClick={() => setShown(0)} className={`${btn} bg-slate-700 text-white`}>
          ↺ Restart
        </button>
      </div>
      {done && (
        <div className="pop-in mt-3 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm">
          <div className="font-mono text-slate-300">
            Final balance: <span className={balance === 40 ? "font-bold text-emerald-300" : "font-bold text-rose-300"}>{balance}</span>{" "}
            <span className="text-muted-foreground">(correct answer after two withdrawals: 40)</span>
          </div>
          <p className="mt-1 text-slate-200">{outcome}</p>
        </div>
      )}
    </div>
  );
}
