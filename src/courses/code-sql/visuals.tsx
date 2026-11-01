"use client";

import { useState } from "react";
import { CUSTOMERS } from "./data";
import { BlockIcon } from "@/components/learn/block-icons";

/** Concept diagrams for Learn SQL. */

const pill = (on: boolean, color = "bg-sky-400") =>
  `rounded-lg px-2.5 py-1 font-mono text-xs font-bold transition ${on ? `${color} text-slate-950` : "bg-white/10 text-slate-200 hover:bg-white/15"}`;

// ───────────── Anatomy of a table ─────────────

type Part = "table" | "row" | "column" | "cell" | "pk" | "null";

const PARTS: { id: Part; name: string; text: string }[] = [
  { id: "table", name: "Table", text: "A named collection of rows that all share the same columns. Here: customers. A database holds many tables." },
  { id: "row", name: "Row", text: "One record: one customer. Rows have no built-in order; you ask for an order with ORDER BY." },
  { id: "column", name: "Column", text: "One attribute every row has, with a declared type: city is text. Every value in a column has that type." },
  { id: "cell", name: "Value", text: "Where a row meets a column: Bo's city is 'Oslo'." },
  { id: "pk", name: "Primary key", text: "A column (or set of columns) whose value is unique and never NULL, so it identifies exactly one row. Other tables point at it." },
  { id: "null", name: "NULL", text: "A marker for \"no value / unknown\". It's not 0 and not an empty string. Di's city is NULL." },
];

export function TableAnatomy() {
  const [part, setPart] = useState<Part>("row");
  const cols = ["id", "name", "city"] as const;
  const lit = (r: number, c: number) =>
    part === "table" ||
    (part === "row" && r === 1) ||
    (part === "column" && c === 2) ||
    (part === "cell" && r === 1 && c === 2) ||
    (part === "pk" && c === 0) ||
    (part === "null" && CUSTOMERS[r][cols[c]] === null);
  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {PARTS.map((p) => (
          <button key={p.id} type="button" onClick={() => setPart(p.id)} className={pill(part === p.id)}>
            {p.name}
          </button>
        ))}
      </div>
      <div className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-slate-950 p-2">
        <div className="mb-1 font-mono text-xs font-bold text-sky-300">customers</div>
        <table className="w-full font-mono text-sm">
          <thead>
            <tr>
              {cols.map((c, ci) => (
                <th key={c} className={`px-3 py-1 text-left text-xs ${(part === "column" && ci === 2) || (part === "pk" && ci === 0) ? "text-amber-300" : "text-slate-400"}`}>
                  {c}
                  {ci === 0 && <span className="ml-1 text-[10px]"><BlockIcon icon="🔑" className="inline-block size-[1.1em] align-[-0.15em]" /></span>}
                  <span className="ml-1 text-[10px] font-normal text-muted-foreground">{ci === 0 ? "integer" : "text"}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {CUSTOMERS.map((row, ri) => (
              <tr key={row.id}>
                {cols.map((c, ci) => {
                  const v = row[c];
                  return (
                    <td key={c} className={`px-3 py-1 transition ${lit(ri, ci) ? "bg-amber-400/25 text-amber-100" : "text-slate-200"}`}>
                      {v === null ? <span className="italic text-muted-foreground">NULL</span> : v}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="pop-in mt-2 text-sm text-slate-300" key={part}>
        <span className="font-bold text-white">{PARTS.find((p) => p.id === part)!.name}:</span> {PARTS.find((p) => p.id === part)!.text}
      </p>
    </div>
  );
}

// ───────────── Three-valued logic ─────────────

type TV = "TRUE" | "FALSE" | "NULL";
const and = (a: TV, b: TV): TV => (a === "FALSE" || b === "FALSE" ? "FALSE" : a === "NULL" || b === "NULL" ? "NULL" : "TRUE");
const or = (a: TV, b: TV): TV => (a === "TRUE" || b === "TRUE" ? "TRUE" : a === "NULL" || b === "NULL" ? "NULL" : "FALSE");
const not = (a: TV): TV => (a === "NULL" ? "NULL" : a === "TRUE" ? "FALSE" : "TRUE");
const tvColor = (v: TV) => (v === "TRUE" ? "text-emerald-300" : v === "FALSE" ? "text-rose-300" : "text-amber-300");

export function NullLogic() {
  const [a, setA] = useState<TV>("NULL");
  const [b, setB] = useState<TV>("TRUE");
  const rows: [string, TV][] = [
    ["A AND B", and(a, b)],
    ["A OR B", or(a, b)],
    ["NOT A", not(a)],
  ];
  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-2">
        {(
          [
            ["A", a, setA],
            ["B", b, setB],
          ] as [string, TV, (v: TV) => void][]
        ).map(([name, val, set]) => (
          <div key={name} className="flex items-center gap-2">
            <span className="w-5 font-mono font-bold text-white">{name}</span>
            {(["TRUE", "FALSE", "NULL"] as TV[]).map((v) => (
              <button key={v} type="button" onClick={() => set(v)} className={pill(val === v, v === "NULL" ? "bg-amber-300" : v === "TRUE" ? "bg-emerald-300" : "bg-rose-300")}>
                {v}
              </button>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-1.5">
        {rows.map(([expr, v]) => (
          <div key={expr} className="grid grid-cols-[7rem_1fr] items-center rounded-lg bg-slate-950/70 px-3 py-1.5 font-mono text-sm">
            <span className="text-slate-300">{expr}</span>
            <span className={`font-bold ${tvColor(v)}`}>{v === "NULL" ? "NULL (unknown)" : v}</span>
          </div>
        ))}
        <div className="grid grid-cols-[7rem_1fr] items-center rounded-lg bg-slate-950/70 px-3 py-1.5 font-mono text-sm">
          <span className="text-slate-300">WHERE A</span>
          <span className={a === "TRUE" ? "font-bold text-emerald-300" : "font-bold text-rose-300"}>{a === "TRUE" ? "row kept" : "row filtered out"}</span>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Any comparison with NULL (<span className="font-mono">x = NULL</span>, <span className="font-mono">NULL &lt;&gt; 1</span>) is NULL, i.e. unknown. WHERE, ON and
        HAVING keep a row only when the condition is TRUE, so unknown behaves like false there. Use <span className="font-mono">IS NULL</span> /{" "}
        <span className="font-mono">IS NOT NULL</span> to test for NULL.
      </p>
    </div>
  );
}

// ───────────── Window functions ─────────────

const SALES = [
  { rep: "Ana", region: "North", amount: 50 },
  { rep: "Bo", region: "North", amount: 30 },
  { rep: "Cy", region: "North", amount: 30 },
  { rep: "Di", region: "South", amount: 70 },
  { rep: "Eve", region: "South", amount: 70 },
  { rep: "Fay", region: "South", amount: 20 },
];
type Fn = "ROW_NUMBER()" | "RANK()" | "DENSE_RANK()" | "SUM(amount)" | "LAG(amount)";

export function WindowExplorer() {
  const [fn, setFn] = useState<Fn>("RANK()");
  const [part, setPart] = useState(true);
  const [rowsFrame, setRowsFrame] = useState(false);

  const groups = part ? ["North", "South"].map((r) => SALES.filter((s) => s.region === r)) : [SALES];
  const out = groups.flatMap((g, gi) => {
    const sorted = [...g].sort((x, y) => y.amount - x.amount || x.rep.localeCompare(y.rep));
    return sorted.map((s, i) => {
      let v: number | null;
      if (fn === "ROW_NUMBER()") v = i + 1;
      else if (fn === "RANK()") v = 1 + sorted.filter((t) => t.amount > s.amount).length;
      else if (fn === "DENSE_RANK()") v = 1 + new Set(sorted.filter((t) => t.amount > s.amount).map((t) => t.amount)).size;
      else if (fn === "SUM(amount)")
        v = rowsFrame ? sorted.slice(0, i + 1).reduce((a, t) => a + t.amount, 0) : sorted.filter((t) => t.amount >= s.amount).reduce((a, t) => a + t.amount, 0);
      else v = i === 0 ? null : sorted[i - 1].amount;
      return { ...s, v, gi };
    });
  });
  const over = `OVER (${part ? "PARTITION BY region " : ""}ORDER BY amount DESC${fn === "SUM(amount)" && rowsFrame ? "\n            ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW" : ""})`;

  return (
    <div>
      <div className="flex flex-wrap gap-1.5">
        {(["ROW_NUMBER()", "RANK()", "DENSE_RANK()", "SUM(amount)", "LAG(amount)"] as Fn[]).map((f) => (
          <button key={f} type="button" onClick={() => setFn(f)} className={pill(fn === f)}>
            {f}
          </button>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        <button type="button" onClick={() => setPart(!part)} className={pill(part, "bg-violet-300")}>
          PARTITION BY region
        </button>
        {fn === "SUM(amount)" && (
          <button type="button" onClick={() => setRowsFrame(!rowsFrame)} className={pill(rowsFrame, "bg-amber-300")}>
            ROWS frame
          </button>
        )}
      </div>
      <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-slate-950 p-3 font-mono text-[13px] leading-relaxed text-sky-100">
        {`SELECT rep, region, amount,\n       ${fn} ${over} AS w\nFROM sales;`}
      </pre>
      <div className="mt-2 overflow-x-auto rounded-xl border border-white/10 bg-slate-950">
        <table className="w-full font-mono text-xs">
          <thead>
            <tr className="border-b border-white/10 text-left text-slate-400">
              {["rep", "region", "amount", "w"].map((c) => (
                <th key={c} className="px-2.5 py-1.5">
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {out.map((r, i) => (
              <tr key={r.rep} className={`${i > 0 && out[i - 1].gi !== r.gi ? "border-t-2 border-violet-400/50" : "border-t border-white/5"} text-slate-100`}>
                <td className="px-2.5 py-1">{r.rep}</td>
                <td className="px-2.5 py-1">{r.region}</td>
                <td className="px-2.5 py-1">{r.amount}</td>
                <td className="pop-in px-2.5 py-1 font-bold text-amber-300" key={`${fn}${part}${rowsFrame}`}>
                  {r.v === null ? <span className="italic text-muted-foreground">NULL</span> : r.v}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Window functions add a column without collapsing rows (unlike GROUP BY). RANK leaves gaps after ties, DENSE_RANK doesn&apos;t, and ROW_NUMBER numbers tied rows in
        an arbitrary order unless you add a tiebreaker. With ORDER BY, the default frame is RANGE … CURRENT ROW, so a running SUM includes all tied rows at once; ROWS
        counts row by row.
      </p>
    </div>
  );
}

// ───────────── Index seek vs sequential scan ─────────────

const QUERIES = [
  { id: "eq", sql: "WHERE email = 'ana@x.io'", usesPlain: true, usesExpr: false },
  { id: "lower", sql: "WHERE lower(email) = 'ana@x.io'", usesPlain: false, usesExpr: true },
  { id: "suffix", sql: "WHERE email LIKE '%@x.io'", usesPlain: false, usesExpr: false },
] as const;

export function IndexVsScan() {
  const [exp, setExp] = useState(6);
  const [qi, setQi] = useState(0);
  const [exprIndex, setExprIndex] = useState(false);
  const rows = 10 ** exp;
  const q = QUERIES[qi];
  const seek = q.usesPlain || (exprIndex && q.usesExpr);
  // An 8 kB B-tree page holds a few hundred keys, so each level multiplies reach by ~300 (illustrative).
  const depth = Math.max(1, Math.ceil(Math.log(rows) / Math.log(300)));
  const touched = seek ? depth + 1 : rows;
  const fmt = (n: number) => n.toLocaleString("en-US");
  const barWidth = (n: number) => `${Math.max(2, (Math.log10(n + 1) / 8.5) * 100)}%`;

  return (
    <div>
      <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
        <label className="text-sm text-slate-300">
          Rows in <span className="font-mono">users</span>: <span className="font-mono font-bold text-white">{fmt(rows)}</span>
          <input type="range" min={3} max={8} value={exp} onChange={(e) => setExp(Number(e.target.value))} className="w-full accent-sky-400" aria-label="Table size" />
        </label>
        <button type="button" onClick={() => setExprIndex(!exprIndex)} className={pill(exprIndex, "bg-violet-300")}>
          + index on lower(email)
        </button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {QUERIES.map((x, i) => (
          <button key={x.id} type="button" onClick={() => setQi(i)} className={pill(qi === i)}>
            {x.sql}
          </button>
        ))}
      </div>
      <pre className="mt-3 overflow-x-auto rounded-xl border border-white/10 bg-slate-950 p-3 font-mono text-[12px] leading-relaxed text-slate-200">
        {`-- CREATE INDEX users_email_idx ON users (email);${exprIndex ? "\n-- CREATE INDEX users_lower_email_idx ON users (lower(email));" : ""}\nEXPLAIN SELECT * FROM users ${q.sql};\n`}
        <span className={seek ? "text-emerald-300" : "text-rose-300"}>
          {seek
            ? `Index Scan using ${q.usesPlain ? "users_email_idx" : "users_lower_email_idx"} on users\n  Index Cond: (${q.usesPlain ? "email" : "lower(email)"} = 'ana@x.io')`
            : `Seq Scan on users\n  Filter: (${q.id === "lower" ? "lower(email) = 'ana@x.io'" : "email ~~ '%@x.io'"})`}
        </span>
      </pre>
      <div className="mt-3 grid gap-2 text-xs">
        {[
          { name: "Sequential scan", n: rows, color: "#fb7185", active: !seek },
          { name: "B-tree index lookup", n: depth + 1, color: "#34d399", active: seek },
        ].map((b) => (
          <div key={b.name} className={b.active ? "" : "opacity-40"}>
            <div className="flex justify-between text-slate-300">
              <span>{b.name}</span>
              <span className="font-mono">{b.name.startsWith("B") ? `${depth} levels + 1 row fetch` : `${fmt(b.n)} rows checked`}</span>
            </div>
            <div className="mt-1 h-3 rounded-full bg-white/5">
              <div className="h-3 rounded-full transition-all" style={{ width: barWidth(b.n), background: b.color }} />
            </div>
          </div>
        ))}
      </div>
      <p className="mt-2 text-xs text-slate-400">
        This plan touches about <span className="font-mono text-white">{fmt(touched)}</span> {seek ? "pages" : "rows"}. A B-tree&apos;s depth grows with log(n): every
        ×300 rows adds one level (numbers are illustrative; log scale). Wrapping the column in a function or starting a pattern with % stops a plain index from seeking.
      </p>
    </div>
  );
}
