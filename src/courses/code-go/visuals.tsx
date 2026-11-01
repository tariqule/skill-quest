"use client";

import { useState } from "react";
import { CodeBlock } from "@/components/learn/blocks";
import { BlockIcon } from "@/components/learn/block-icons";

/** Concept diagrams for the Go Interview Quest. */

// ───────────── Strings: bytes vs runes ─────────────

const WORDS = ["go", "héllo", "日本", "hi👋"];
const hex = (n: number) => n.toString(16).toUpperCase().padStart(2, "0");

export function RuneExplorer() {
  const [word, setWord] = useState(WORDS[1]);
  const enc = new TextEncoder();
  const chars = Array.from(word);
  const runes = chars.map((ch, ci) => ({
    ch,
    at: chars.slice(0, ci).reduce((n, c) => n + enc.encode(c).length, 0),
    bytes: Array.from(enc.encode(ch)),
    cp: ch.codePointAt(0)!,
  }));
  const all = enc.encode(word);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {WORDS.map((w) => (
          <button
            key={w}
            type="button"
            onClick={() => setWord(w)}
            className={`rounded-xl px-3 py-1.5 font-mono text-sm font-bold ${w === word ? "bg-sky-400 text-slate-950" : "bg-white/10 text-white"}`}
          >
            &quot;{w}&quot;
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {runes.map((r) => (
          <div key={r.at} className="pop-in rounded-xl border border-white/10 bg-slate-950/70 p-2 text-center">
            <div className="text-2xl text-white">{r.ch}</div>
            <div className="font-mono text-[11px] text-violet-300">U+{r.cp.toString(16).toUpperCase().padStart(4, "0")}</div>
            <div className="mt-1 flex gap-0.5">
              {r.bytes.map((b, bi) => (
                <div key={bi} className="rounded bg-sky-400/15 px-1 font-mono text-[11px] text-sky-200">
                  <div className="text-[9px] text-muted-foreground">[{r.at + bi}]</div>
                  {hex(b)}
                </div>
              ))}
            </div>
            <div className="mt-1 text-[10px] text-slate-400">range gives i = {r.at}</div>
          </div>
        ))}
      </div>
      <div className="mt-3 grid gap-1 rounded-xl border border-white/10 bg-slate-950 p-3 font-mono text-sm">
        <div>
          <span className="text-slate-400">len(s) </span>
          <span className="text-amber-300">{all.length}</span>
          <span className="text-muted-foreground">{"  // bytes"}</span>
        </div>
        <div>
          <span className="text-slate-400">utf8.RuneCountInString(s) </span>
          <span className="text-amber-300">{runes.length}</span>
          <span className="text-muted-foreground">{"  // code points"}</span>
        </div>
        <div>
          <span className="text-slate-400">s[1] </span>
          <span className="text-amber-300">{all[1]}</span>
          <span className="text-muted-foreground">{`  // a byte (uint8), 0x${hex(all[1])}`}</span>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400">A Go string is a read-only slice of bytes, usually UTF-8. Indexing gives bytes; ranging decodes runes and reports each rune&apos;s byte offset.</p>
    </div>
  );
}

// ───────────── Method sets ─────────────

type Recv = "value" | "pointer";

function Toggle({ label, value, onChange }: { label: string; value: Recv; onChange: (r: Recv) => void }) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="font-mono text-white">{label}</span>
      {(["value", "pointer"] as const).map((r) => (
        <button key={r} type="button" onClick={() => onChange(r)} className={`rounded-lg px-2.5 py-1 font-mono text-xs font-bold ${r === value ? "bg-violet-400 text-slate-950" : "bg-white/10 text-white"}`}>
          {r === "value" ? "(t T)" : "(t *T)"}
        </button>
      ))}
    </div>
  );
}

export function MethodSetTable() {
  const [ra, setRa] = useState<Recv>("value");
  const [rb, setRb] = useState<Recv>("pointer");
  const sig = (r: Recv, name: string) => `func (t ${r === "value" ? "T" : "*T"}) ${name}() {}`;
  const tSet = [ra === "value" ? "A" : null, rb === "value" ? "B" : null].filter(Boolean);
  const valueOk = tSet.length === 2;

  return (
    <div className="grid gap-3">
      <div className="flex flex-wrap gap-4">
        <Toggle label="A()" value={ra} onChange={setRa} />
        <Toggle label="B()" value={rb} onChange={setRb} />
      </div>
      <CodeBlock lang="go" code={["type AB interface{ A(); B() }", "", "type T struct{}", "", sig(ra, "A"), sig(rb, "B")].join("\n")} />
      <div className="grid gap-2 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Method set of T</div>
          <div className="mt-1 font-mono text-white">{"{"}{tSet.join(", ")}{"}"}</div>
          <div className={`mt-2 font-mono text-sm ${valueOk ? "text-emerald-300" : "text-rose-300"}`}>
            var _ AB = T{"{}"} {valueOk ? "compiles" : "T does not implement AB"}
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Method set of *T</div>
          <div className="mt-1 font-mono text-white">{"{A, B}"}</div>
          <div className="mt-2 font-mono text-sm text-emerald-300">var _ AB = &amp;T{"{}"} <BlockIcon icon="✓" className="inline-block size-[1.1em] align-[-0.15em]" /> compiles</div>
        </div>
      </div>
      <p className="text-xs text-slate-400">
        *T always gets every method. T gets only value-receiver methods, because a value stored in an interface isn&apos;t addressable. Calling t.B() on an
        addressable variable still works: Go rewrites it to (&amp;t).B().
      </p>
    </div>
  );
}

// ───────────── Interface = (type, value) ─────────────

const IFACE_CASES = [
  { code: "var err error", type: "nil", value: "nil", note: "A zero interface: no type, no value. err == nil is true." },
  { code: "var p *MyErr; err = p", type: "*MyErr", value: "nil", note: "The interface now holds a type (*MyErr) with a nil pointer inside. err == nil is false." },
  { code: "err = &MyErr{}", type: "*MyErr", value: "0xc000012080", note: "A real error: type and pointer both set." },
  { code: "err = nil", type: "nil", value: "nil", note: "Assigning the untyped nil clears both halves. err == nil is true again." },
];

export function NilInterfaceBox() {
  const [i, setI] = useState(0);
  const c = IFACE_CASES[i];
  const isNil = c.type === "nil";
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {IFACE_CASES.map((x, xi) => (
          <button key={x.code} type="button" onClick={() => setI(xi)} className={`rounded-lg px-2.5 py-1 font-mono text-xs font-bold ${xi === i ? "bg-sky-400 text-slate-950" : "bg-white/10 text-white"}`}>
            {x.code}
          </button>
        ))}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-3">
        <span className="font-mono text-sm text-white">err</span>
        <span className="text-muted-foreground">=</span>
        <div className="flex overflow-hidden rounded-xl border-2 border-violet-400/60">
          <div className="bg-violet-400/15 px-4 py-2 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-violet-300">type</div>
            <div className={`font-mono font-bold ${c.type === "nil" ? "text-muted-foreground" : "text-white"}`}>{c.type}</div>
          </div>
          <div className="border-l-2 border-violet-400/60 px-4 py-2 text-center">
            <div className="text-[10px] font-bold uppercase tracking-wider text-violet-300">value</div>
            <div className={`font-mono font-bold ${c.value === "nil" ? "text-muted-foreground" : "text-white"}`}>{c.value}</div>
          </div>
        </div>
        <span className={`rounded-lg px-2 py-1 font-mono text-sm font-bold ${isNil ? "bg-emerald-400/20 text-emerald-200" : "bg-rose-400/20 text-rose-200"}`}>
          err == nil → {String(isNil)}
        </span>
      </div>
      <p className="mt-2 text-sm text-slate-300">{c.note}</p>
      <p className="mt-1 text-xs text-slate-400">An interface value is nil only when BOTH halves are nil. Return a literal nil, not a nil pointer of a concrete type.</p>
    </div>
  );
}

// ───────────── G-M-P scheduler board ─────────────

interface P {
  m: number;
  running: string | null;
  queue: string[];
}
interface Sched {
  ps: P[];
  global: string[];
  syscalls: { g: string; m: number }[];
  idleMs: number[];
  nextG: number;
  nextM: number;
  log: string;
}

const SCHED_START: Sched = {
  ps: [
    { m: 1, running: "G1", queue: ["G2", "G3"] },
    { m: 2, running: null, queue: [] },
  ],
  global: [],
  syscalls: [],
  idleMs: [],
  nextG: 4,
  nextM: 3,
  log: "G1 is running main on P0. P1 is idle. Press Tick to let the scheduler work.",
};

function tick(s: Sched): Sched {
  const ps = s.ps.map((p) => ({ ...p, queue: [...p.queue] }));
  const global = [...s.global];
  const notes: string[] = [];
  ps.forEach((p, i) => {
    if (p.running) p.queue.push(p.running);
    p.running = null;
    let g = p.queue.shift();
    if (!g && global.length) {
      g = global.shift();
      notes.push(`P${i} took ${g} from the global queue`);
    }
    if (!g) {
      const victim = ps.find((o) => o !== p && o.queue.length > 1);
      if (victim) {
        const half = victim.queue.splice(Math.ceil(victim.queue.length / 2));
        g = half.shift();
        p.queue.push(...half);
        notes.push(`P${i} stole ${[g, ...half].join(", ")} from P${ps.indexOf(victim)}`);
      }
    }
    p.running = g ?? null;
  });
  return { ...s, ps, global, log: notes.length ? notes.join(" · ") : "Each P ran the next goroutine in its own run queue (the previous one went to the back)." };
}

export function SchedulerBoard() {
  const [s, setS] = useState<Sched>(SCHED_START);

  function spawn() {
    const ps = s.ps.map((p, i) => (i === 0 ? { ...p, queue: [...p.queue, `G${s.nextG}`] } : p));
    setS({ ...s, ps, nextG: s.nextG + 1, log: `go f() on P0 put G${s.nextG} on P0's local run queue.` });
  }

  function syscall() {
    const p0 = s.ps[0];
    if (!p0.running) return;
    const [m, ...idle] = s.idleMs;
    const newM = m ?? s.nextM;
    const ps = s.ps.map((p, i) => (i === 0 ? { ...p, running: null, m: newM } : p));
    setS({
      ...s,
      ps,
      syscalls: [...s.syscalls, { g: p0.running, m: p0.m }],
      idleMs: idle,
      nextM: m === undefined ? s.nextM + 1 : s.nextM,
      log: `${p0.running} entered a blocking syscall and keeps M${p0.m}. P0 was handed to M${newM} so its other goroutines keep running.`,
    });
  }

  function syscallReturn() {
    const [first, ...rest] = s.syscalls;
    if (!first) return;
    setS({ ...s, syscalls: rest, global: [...s.global, first.g], idleMs: [...s.idleMs, first.m], log: `${first.g}'s syscall returned. It has no P, so it goes on the global run queue and M${first.m} parks as idle.` });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={spawn} className="rounded-lg bg-white/10 px-3 py-1.5 font-mono text-sm font-bold text-white">go f()</button>
        <button type="button" onClick={() => setS(tick(s))} className="rounded-lg bg-emerald-400 px-3 py-1.5 text-sm font-bold text-slate-950"><BlockIcon icon="⏱" className="inline-block size-[1.1em] align-[-0.15em]" /> Tick</button>
        <button type="button" disabled={!s.ps[0].running} onClick={syscall} className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-bold text-white disabled:opacity-40">P0&apos;s G: blocking syscall</button>
        <button type="button" disabled={!s.syscalls.length} onClick={syscallReturn} className="rounded-lg bg-white/10 px-3 py-1.5 text-sm font-bold text-white disabled:opacity-40">syscall returns</button>
        <button type="button" onClick={() => setS(SCHED_START)} className="rounded-lg bg-slate-800 px-3 py-1.5 text-sm font-bold text-slate-300">↺</button>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {s.ps.map((p, i) => (
          <div key={i} className="rounded-xl border border-white/10 bg-slate-950/70 p-3">
            <div className="flex items-center gap-2 text-sm">
              <span className="rounded bg-sky-400/20 px-2 py-0.5 font-bold text-sky-200">P{i}</span>
              <span className="text-muted-foreground">on</span>
              <span className="rounded bg-amber-400/20 px-2 py-0.5 font-bold text-amber-200">M{p.m}</span>
              <span className="ml-auto text-xs text-slate-400">running:</span>
              <span className={`rounded px-2 py-0.5 font-mono text-sm font-bold ${p.running ? "bg-emerald-400 text-slate-950" : "bg-white/5 text-muted-foreground"}`}>{p.running ?? "idle"}</span>
            </div>
            <div className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">local run queue</div>
            <div className="mt-1 flex min-h-7 flex-wrap gap-1">
              {p.queue.map((g) => (
                <span key={g} className="pop-in rounded bg-white/10 px-2 py-0.5 font-mono text-xs text-white">{g}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-400">
        <span>global queue: <span className="font-mono text-white">{s.global.join(", ") || "empty"}</span></span>
        <span>in syscalls: <span className="font-mono text-white">{s.syscalls.map((x) => `${x.g}@M${x.m}`).join(", ") || "none"}</span></span>
        <span>idle Ms: <span className="font-mono text-white">{s.idleMs.map((m) => `M${m}`).join(", ") || "none"}</span></span>
      </div>
      <p className="mt-2 text-sm text-slate-300">{s.log}</p>
    </div>
  );
}
