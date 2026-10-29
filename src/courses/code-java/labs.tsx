"use client";

import { useState } from "react";
import { LabHeader, type GoalProps } from "@/components/learn/blocks";
import { Btn } from "./visuals";

// ───────────── HashMap bucket and collision visualizer ─────────────

type Entry = { key: string; value: number; hash: number };

/** Java's String.hashCode: s[0]*31^(n-1) + … + s[n-1], with 32-bit int overflow. */
export function javaHash(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  return h;
}

/** HashMap.hash(): mix the high bits into the low bits, then mask by the table size. */
function bucketOf(hash: number, cap: number) {
  return (hash ^ (hash >>> 16)) & (cap - 1);
}

const START_CAP = 4;
const LOAD = 0.75;
const PALETTE = ["apple", "pear", "fig", "kiwi", "plum", "lime", "Aa", "date"];

function bucketsOf(entries: Entry[], cap: number) {
  const b: Entry[][] = Array.from({ length: cap }, () => []);
  for (const e of entries) b[bucketOf(e.hash, cap)].push(e);
  return b;
}

export function HashMapLab({ goal, onSolved }: GoalProps<"resize" | "chain" | "twin">) {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [cap, setCap] = useState(START_CAP);
  const [evil, setEvil] = useState(false);
  const [key, setKey] = useState("");
  const [log, setLog] = useState<string[]>([]);
  const [touched, setTouched] = useState<number | null>(null);

  const hashFn = (k: string, bad = evil) => (bad ? 42 : javaHash(k));
  const buckets = bucketsOf(entries, cap);
  const longest = Math.max(0, ...buckets.map((b) => b.length));

  function check(next: Entry[], nextCap: number, resized: boolean, bad: boolean) {
    if (goal === "resize" && resized) onSolved?.();
    if (goal === "chain" && bucketsOf(next, nextCap).some((b) => b.length >= 3)) onSolved?.();
    if (goal === "twin" && !bad) {
      const seen = new Map<number, string>();
      for (const e of next) {
        const other = seen.get(e.hash);
        if (other !== undefined && other !== e.key) {
          onSolved?.();
          return;
        }
        seen.set(e.hash, e.key);
      }
    }
  }

  function put(raw: string) {
    const k = raw.trim();
    if (!k) return;
    const h = hashFn(k);
    const idx = bucketOf(h, cap);
    const lines = [`put("${k}"): hashCode = ${h} → bucket ${idx} (spread hash & ${cap - 1})`];
    let found = false;
    for (const e of buckets[idx]) {
      if (e.hash !== h) lines.push(`  · "${e.key}": different hash, skip without calling equals`);
      else if (e.key === k) {
        lines.push(`  · "${e.key}": same hash and equals is true → replace the value`);
        found = true;
      } else lines.push(`  · "${e.key}": same hash (a true collision), but equals is false → keep walking`);
    }
    let next: Entry[];
    let nextCap = cap;
    let resized = false;
    if (found) next = entries.map((e) => (e.key === k ? { ...e, value: e.value + 1 } : e));
    else {
      next = [...entries, { key: k, value: 1, hash: h }];
      lines.push(buckets[idx].length ? `  · appended to the chain (now ${buckets[idx].length + 1} long)` : "  · empty bucket: new node stored");
      if (next.length > cap * LOAD) {
        nextCap = cap * 2;
        resized = true;
        lines.push(`size ${next.length} exceeds ${cap} × 0.75 = ${cap * LOAD} → resize to ${nextCap} buckets and re-bucket every entry`);
      }
    }
    setEntries(next);
    setCap(nextCap);
    setTouched(bucketOf(h, nextCap));
    setLog(lines);
    setKey("");
    check(next, nextCap, resized, evil);
  }

  function get(raw: string) {
    const k = raw.trim();
    if (!k) return;
    const h = hashFn(k);
    const idx = bucketOf(h, cap);
    const lines = [`get("${k}"): hashCode = ${h} → bucket ${idx}`];
    let hit: Entry | undefined;
    let compares = 0;
    for (const e of buckets[idx]) {
      compares++;
      if (e.hash === h && e.key === k) {
        hit = e;
        lines.push(`  · "${e.key}": hash and equals match → found`);
        break;
      }
      lines.push(`  · "${e.key}": no match`);
    }
    lines.push(hit ? `→ ${hit.value} after ${compares} comparison${compares === 1 ? "" : "s"}` : `→ null after ${compares} comparison${compares === 1 ? "" : "s"}`);
    setTouched(idx);
    setLog(lines);
  }

  function toggleEvil(bad: boolean) {
    const next = entries.map((e) => ({ ...e, hash: hashFn(e.key, bad) }));
    setEvil(bad);
    setEntries(next);
    setTouched(null);
    setLog([bad ? "hashCode() now returns 42 for every key: everything lands in one bucket." : "Back to String.hashCode(): keys spread out again."]);
    check(next, cap, false, bad);
  }

  function reset() {
    setEntries([]);
    setCap(START_CAP);
    setLog([]);
    setTouched(null);
  }

  return (
    <div>
      <LabHeader
        title="HashMap bucket visualizer"
        hint="Put keys and watch them land in buckets. This table starts at 4 buckets (a real HashMap starts at 16) so you can see it resize."
      />
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={key}
          onChange={(e) => setKey(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") put(key);
          }}
          placeholder="type a key, e.g. BB"
          aria-label="Key"
          className="w-40 rounded-lg border border-white/15 bg-slate-950 px-2.5 py-1.5 font-mono text-sm text-white"
        />
        <Btn onClick={() => put(key)}>put</Btn>
        <Btn tone="sky" onClick={() => get(key)}>
          get
        </Btn>
        <Btn tone="slate" onClick={reset}>
          Reset
        </Btn>
      </div>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {PALETTE.map((p) => (
          <button key={p} type="button" onClick={() => put(p)} className="rounded-md border border-white/10 px-2 py-0.5 font-mono text-xs text-slate-300 hover:border-amber-400/60">
            {`+ ${p}`}
          </button>
        ))}
      </div>
      <label className="mt-3 flex items-center gap-2 text-sm text-slate-300">
        <input type="checkbox" checked={evil} onChange={(e) => toggleEvil(e.target.checked)} className="accent-rose-400" />
        <span>
          Bad <span className="font-mono">hashCode()</span> that always returns 42
        </span>
      </label>

      <div className="mt-3 grid gap-1.5">
        {buckets.map((b, i) => (
          <div
            key={i}
            className="flex min-h-9 flex-wrap items-center gap-1.5 rounded-lg border bg-slate-950/60 px-2 py-1 transition"
            style={{ borderColor: touched === i ? "#fbbf24" : "rgb(255 255 255 / 0.08)" }}
          >
            <span className="w-8 shrink-0 font-mono text-xs text-slate-500">{`[${i}]`}</span>
            {b.length === 0 && <span className="text-xs text-slate-600">empty</span>}
            {b.map((e, j) => (
              <span key={e.key} className="flex items-center gap-1.5">
                {j > 0 && <span className="text-slate-500">→</span>}
                <span
                  title={`hashCode ${e.hash}`}
                  className={`pop-in rounded-md px-2 py-0.5 font-mono text-xs ${b.length >= 3 ? "bg-rose-400/20 text-rose-100" : b.length === 2 ? "bg-amber-400/20 text-amber-100" : "bg-sky-400/15 text-sky-100"}`}
                >
                  {`${e.key}=${e.value}`}
                </span>
              </span>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-center sm:grid-cols-4">
        {[
          ["size", entries.length],
          ["buckets", cap],
          ["resize after", cap * LOAD],
          ["longest chain", longest],
        ].map(([label, v]) => (
          <div key={label} className="rounded-xl bg-white/5 p-2">
            <div className="font-mono text-lg font-bold text-white">{v}</div>
            <div className="text-[11px] text-slate-400">{label}</div>
          </div>
        ))}
      </div>
      {log.length > 0 && (
        <div className="mt-3 rounded-xl bg-white/5 p-3 font-mono text-xs leading-relaxed text-slate-300">
          {log.map((l, i) => (
            <div key={i} className="whitespace-pre-wrap">
              {l}
            </div>
          ))}
        </div>
      )}
      <p className="mt-2 text-xs text-slate-500">
        In a real HashMap, a chain longer than 8 (in a table of at least 64 buckets) becomes a red-black tree, so even a bad hash degrades to O(log n), not O(n).
      </p>
    </div>
  );
}

// ───────────── Collection chooser ─────────────

const CHOICES = ["ArrayList", "LinkedList", "ArrayDeque", "PriorityQueue", "HashSet", "TreeSet", "HashMap", "LinkedHashMap", "TreeMap", "ConcurrentHashMap"] as const;
type Choice = (typeof CHOICES)[number];

const TRAITS: Record<Choice, string> = {
  ArrayList: "an indexed list: O(1) get(i) and append, but O(n) contains and insert in the middle.",
  LinkedList: "a doubly linked list: O(1) at the ends, but O(n) get(i) and poor cache locality. Rarely the best pick.",
  ArrayDeque: "a resizable ring buffer: O(1) push/pop/offer/poll at both ends, no index access.",
  PriorityQueue: "a binary heap: O(log n) offer/poll of the smallest element, O(1) peek, no sorted iteration.",
  HashSet: "unique elements with O(1) average contains, in no particular order.",
  TreeSet: "unique elements kept sorted, O(log n), with floor/ceiling navigation.",
  HashMap: "key → value with O(1) average lookups and no ordering guarantee.",
  LinkedHashMap: "a HashMap that also remembers insertion (or access) order.",
  TreeMap: "key → value kept sorted by key, O(log n), with floorKey/ceilingKey/range views.",
  ConcurrentHashMap: "a thread-safe map with fine-grained locking and atomic compute/merge.",
};

const SCENARIOS: { need: string; answer: Choice; why: string }[] = [
  { need: "Look up a session by token millions of times a second. Order doesn't matter. One thread.", answer: "HashMap", why: "O(1) average get/put and nothing else needed." },
  {
    need: "An LRU cache: evict the entry that was used least recently.",
    answer: "LinkedHashMap",
    why: "new LinkedHashMap<>(16, 0.75f, true) keeps access order, and removeEldestEntry evicts the oldest.",
  },
  { need: "Map each score to a player and find the highest score below 1,000.", answer: "TreeMap", why: "lowerKey(1000) / floorKey run in O(log n) on a sorted map." },
  { need: "Drop duplicate emails and print the rest alphabetically.", answer: "TreeSet", why: "A set removes duplicates; the tree keeps them sorted." },
  { need: "An undo stack: push and pop from the same end.", answer: "ArrayDeque", why: "The Deque docs recommend it over the legacy Stack class: O(1) push/pop, no synchronization." },
  { need: "A job scheduler that always runs the earliest deadline next.", answer: "PriorityQueue", why: "A min-heap gives the smallest element in O(log n) per poll." },
  { need: "Read elements by position; you mostly append at the end.", answer: "ArrayList", why: "O(1) get(i) and amortized O(1) add at the end." },
  { need: "Word counts updated from 16 threads at once.", answer: "ConcurrentHashMap", why: "merge(word, 1, Integer::sum) is atomic and threads rarely block each other." },
  { need: "Remember which tags you've seen; you only ever ask contains(tag).", answer: "HashSet", why: "O(1) average contains; order isn't needed." },
];

export function CollectionChooser({ goal, onSolved }: GoalProps<"all">) {
  const [i, setI] = useState(0);
  const [wrong, setWrong] = useState<Choice[]>([]);
  const [right, setRight] = useState(false);
  const [firstTry, setFirstTry] = useState(0);
  const [done, setDone] = useState(false);
  const s = SCENARIOS[i];

  function pick(c: Choice) {
    if (right || done) return;
    if (c === s.answer) {
      setRight(true);
      const ft = firstTry + (wrong.length === 0 ? 1 : 0);
      setFirstTry(ft);
      if (i === SCENARIOS.length - 1) {
        setDone(true);
        if (goal === "all") onSolved?.();
      }
    } else if (!wrong.includes(c)) setWrong([...wrong, c]);
  }

  function next() {
    setI(i + 1);
    setWrong([]);
    setRight(false);
  }

  function restart() {
    setI(0);
    setWrong([]);
    setRight(false);
    setFirstTry(0);
    setDone(false);
  }

  const last = wrong[wrong.length - 1];
  return (
    <div>
      <LabHeader title="Collection chooser" hint="Read the requirement, then tap the collection you would reach for in an interview." />
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>{`Requirement ${i + 1} of ${SCENARIOS.length}`}</span>
        <span>{`First-try picks: ${firstTry}`}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full bg-amber-400 transition-all" style={{ width: `${((i + (right ? 1 : 0)) / SCENARIOS.length) * 100}%` }} />
      </div>
      <div className="mt-3 rounded-xl border border-white/10 bg-slate-950/60 p-4 text-lg font-semibold text-white">{s.need}</div>
      <div className="mt-3 flex flex-wrap gap-2">
        {CHOICES.map((c) => {
          const isRight = right && c === s.answer;
          const isWrong = wrong.includes(c);
          return (
            <button
              key={c}
              type="button"
              onClick={() => pick(c)}
              disabled={isWrong}
              className={`rounded-lg border px-2.5 py-1.5 font-mono text-sm transition ${
                isRight
                  ? "border-emerald-400 bg-emerald-400/20 text-emerald-100"
                  : isWrong
                    ? "border-rose-400/40 bg-rose-400/10 text-rose-300 line-through"
                    : "border-white/10 text-slate-200 hover:-translate-y-0.5 hover:border-amber-400/60"
              }`}
            >
              {c}
            </button>
          );
        })}
      </div>
      {!right && last && (
        <p className="mt-3 text-sm text-rose-200">
          <span className="font-mono">{last}</span>
          {` is ${TRAITS[last]} Not the best fit here. Try again.`}
        </p>
      )}
      {right && (
        <div className="pop-in mt-3 rounded-xl bg-emerald-400/10 p-3 text-sm text-emerald-100">
          <span className="font-mono font-bold">{s.answer}</span>
          {`: ${s.why}`}
        </div>
      )}
      <div className="mt-3 flex gap-2">
        {right && !done && <Btn onClick={next}>Next requirement ▶</Btn>}
        {done && (
          <>
            <span className="self-center text-sm font-semibold text-white">{`Done! ${firstTry} of ${SCENARIOS.length} on the first try.`}</span>
            <Btn tone="slate" onClick={restart}>
              Play again
            </Btn>
          </>
        )}
      </div>
    </div>
  );
}
