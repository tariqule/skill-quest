"use client";

import { useState } from "react";
import { CodeBlock, LabHeader, type GoalProps } from "@/components/learn/blocks";
import { RichText } from "@/components/learn/code";

// ───────────── Server or client? ─────────────

type Side = "server" | "client";

const PIECES: { id: string; name: string; does: string; answer: Side; kb: number; why: string }[] = [
  { id: "list", name: "ProductList", does: "Awaits `db.products.findMany()` and renders a list", answer: "server", kb: 6, why: "Data fetching close to the source, no interactivity." },
  { id: "like", name: "LikeButton", does: "`useState` + `onClick` toggles a heart", answer: "client", kb: 3, why: "State and event handlers need the browser." },
  { id: "theme", name: "ThemeToggle", does: "Reads and writes `localStorage`", answer: "client", kb: 2, why: "`localStorage` is a browser-only API." },
  { id: "md", name: "MarkdownArticle", does: "Renders a post with a 200 KB markdown library, no interaction", answer: "server", kb: 200, why: "Heavy libraries on the server add zero client JavaScript." },
  { id: "search", name: "SearchBox", does: "`onChange` updates the URL as you type", answer: "client", kb: 4, why: "Typing needs event handlers." },
  { id: "footer", name: "Footer", does: "Static links and a copyright line", answer: "server", kb: 1, why: "Pure markup: keep it out of the bundle." },
  { id: "chart", name: "PriceChart", does: "Measures itself with `ResizeObserver` in `useEffect`", answer: "client", kb: 40, why: "Effects and browser APIs run on the client." },
  { id: "badge", name: "AccountBadge", does: "Reads `cookies()` to show the user's name", answer: "server", kb: 1, why: "`cookies()` from `next/headers` is a server API." },
  { id: "error", name: "error.tsx", does: "Segment error boundary with a Retry button", answer: "client", kb: 2, why: "Error boundaries must be Client Components." },
  { id: "orders", name: "OrdersTable", does: "Queries the database with a secret `DATABASE_URL`", answer: "server", kb: 8, why: "Secrets must never reach the browser." },
];

/** Tap Server or Client for each component, then check. A meter shows the client JavaScript your choices ship. */
export function ServerClientSorter({ goal, onSolved }: GoalProps<"sortAll">) {
  const [picks, setPicks] = useState<Record<string, Side>>({});
  const [checked, setChecked] = useState(false);

  const kb = PIECES.filter((p) => picks[p.id] === "client").reduce((s, p) => s + p.kb, 0);
  const minKb = PIECES.filter((p) => p.answer === "client").reduce((s, p) => s + p.kb, 0);
  const done = PIECES.every((p) => picks[p.id]);
  const correct = PIECES.filter((p) => picks[p.id] === p.answer).length;

  function pick(id: string, side: Side) {
    setPicks((prev) => ({ ...prev, [id]: side }));
    setChecked(false);
  }

  function check() {
    setChecked(true);
    if (goal === "sortAll" && PIECES.every((p) => picks[p.id] === p.answer)) onSolved?.();
  }

  return (
    <div>
      <LabHeader title="Server or client?" hint="Decide where each component should run. Everything is a Server Component unless it truly needs the browser." />
      <div className="mb-3 rounded-xl border border-white/10 bg-slate-950/60 p-3">
        <div className="flex justify-between text-xs text-slate-400">
          <span>📦 Client JavaScript you ship</span>
          <span className="font-mono text-amber-300">{kb} KB</span>
        </div>
        <div className="mt-1.5 h-3 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-amber-400 transition-all duration-300" style={{ width: `${Math.min(100, (kb / 267) * 100)}%` }} />
        </div>
        <div className="mt-1 text-[11px] text-slate-500">The leanest correct sort ships {minKb} KB.</div>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {PIECES.map((p) => {
          const mine = picks[p.id];
          const right = checked && mine === p.answer;
          const wrong = checked && mine && mine !== p.answer;
          return (
            <div
              key={p.id}
              className={`rounded-xl border p-3 ${right ? "border-emerald-400/60 bg-emerald-400/10" : wrong ? "border-rose-400/60 bg-rose-400/10" : "border-white/10 bg-slate-950/60"}`}
            >
              <div className="font-mono text-sm font-bold text-white">{p.name}</div>
              <div className="mt-0.5 text-sm text-slate-300">
                <RichText text={p.does} />
              </div>
              <div className="mt-2 flex gap-2">
                {(["server", "client"] as const).map((side) => (
                  <button
                    key={side}
                    type="button"
                    onClick={() => pick(p.id, side)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-bold ${mine === side ? (side === "server" ? "bg-sky-400 text-slate-950" : "bg-fuchsia-400 text-slate-950") : "bg-white/10 text-slate-200"}`}
                  >
                    {side === "server" ? "🖥️ Server" : "🌐 Client"}
                  </button>
                ))}
              </div>
              {checked && mine && (
                <div className={`mt-2 text-xs ${right ? "text-emerald-300" : "text-rose-300"}`}>
                  {right ? "✓ " : `✗ Should be ${p.answer}. `}
                  <RichText text={p.why} />
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          disabled={!done}
          onClick={check}
          className="btn-3d rounded-xl bg-sky-400 px-4 py-2 font-bold text-slate-950 disabled:opacity-40"
          style={{ "--edge": "#0369a1" } as React.CSSProperties}
        >
          ✅ Check my sort
        </button>
        <button
          type="button"
          onClick={() => {
            setPicks({});
            setChecked(false);
          }}
          className="rounded-xl bg-white/10 px-3 py-2 text-sm font-bold text-slate-200"
        >
          Reset
        </button>
        {!done && <span className="text-xs text-slate-400">Sort all {PIECES.length} to check.</span>}
        {checked && (
          <span className={`text-sm font-bold ${correct === PIECES.length ? "text-emerald-300" : "text-amber-300"}`}>
            {correct === PIECES.length ? `🎉 All ${PIECES.length} right, shipping only ${kb} KB.` : `${correct} / ${PIECES.length} right.`}
          </span>
        )}
      </div>
    </div>
  );
}

// ───────────── Cache and revalidation simulator ─────────────

type Profile = "minutes" | "hours" | "days";
/** revalidate / expire in minutes, from the built-in cacheLife profiles. */
const PROFILES: Record<Profile, { revalidate: number; expire: number; label: string }> = {
  minutes: { revalidate: 1, expire: 60, label: "revalidate 1 min · expire 1 h" },
  hours: { revalidate: 60, expire: 1440, label: "revalidate 1 h · expire 1 day" },
  days: { revalidate: 1440, expire: 10080, label: "revalidate 1 day · expire 1 week" },
};

type Entry = { v: number; at: number; stale: boolean } | null;
type Outcome = "hit" | "stale" | "miss";
type LogLine = { id: number; at: number; tone: "hit" | "stale" | "miss" | "info"; text: string };

function clock(min: number) {
  const total = 9 * 60 + min;
  const day = Math.floor(total / 1440) + 1;
  const h = Math.floor((total % 1440) / 60);
  const m = total % 60;
  return `Day ${day} · ${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function age(min: number) {
  if (min < 60) return `${min} min`;
  if (min < 1440) return `${Math.floor(min / 60)} h ${min % 60} min`;
  return `${Math.floor(min / 1440)} d ${Math.floor((min % 1440) / 60)} h`;
}

/**
 * A cached `getPosts()` tagged "posts". Edit the database, move the clock, call the
 * revalidation APIs, and visit the page to see hits, stale-while-revalidate, and misses.
 */
export function CacheLab({ goal, onSolved }: GoalProps<"readYourWrites" | "swr">) {
  const [profile, setProfile] = useState<Profile>("hours");
  const [now, setNow] = useState(0);
  const [db, setDb] = useState(1);
  const [entry, setEntry] = useState<Entry>({ v: 1, at: 0, stale: false });
  const [shown, setShown] = useState(1);
  const [lastCall, setLastCall] = useState<"updateTag" | "revalidateTag" | null>(null);
  const [prev, setPrev] = useState<{ outcome: Outcome; old: boolean } | null>(null);
  const [log, setLog] = useState<LogLine[]>([{ id: 0, at: 0, tone: "info", text: "🏗️ Build: getPosts() prerendered with v1 into the static shell." }]);

  const p = PROFILES[profile];
  const add = (tone: LogLine["tone"], text: string, at = now) => setLog((l) => [{ id: (l[0]?.id ?? 0) + 1, at, tone, text }, ...l].slice(0, 8));

  function status(e: Entry) {
    if (!e) return { label: "Empty / expired", color: "#f87171" };
    const a = now - e.at;
    if (a >= p.expire) return { label: "Expired", color: "#f87171" };
    if (e.stale || a >= p.revalidate) return { label: "Stale", color: "#fbbf24" };
    return { label: "Fresh", color: "#34d399" };
  }

  function visit(via: "visit" | "refresh") {
    let outcome: Outcome;
    let value: number;
    const who = via === "refresh" ? "🔄 refresh() re-rendered the page" : "👀 Visitor";
    if (!entry || now - entry.at >= p.expire) {
      outcome = "miss";
      value = db;
      setEntry({ v: db, at: now, stale: false });
      add("miss", `${who}: cache miss, the request waits for a fresh render → v${db}.`);
    } else if (entry.stale || now - entry.at >= p.revalidate) {
      outcome = "stale";
      value = entry.v;
      setEntry({ v: db, at: now, stale: false });
      add("stale", `${who}: served stale v${entry.v} instantly. A background refresh stores v${db}.`);
    } else {
      outcome = "hit";
      value = entry.v;
      add("hit", `${who}: cache hit → v${entry.v}${entry.v < db ? ` (the database already has v${db})` : ""}.`);
    }

    if (goal === "readYourWrites" && outcome === "miss" && lastCall === "updateTag" && value === db && value > shown) onSolved?.();
    if (goal === "swr" && outcome === "hit" && value === db && prev?.outcome === "stale" && prev.old) onSolved?.();

    setPrev({ outcome, old: outcome === "stale" && value < db });
    setShown(value);
    setLastCall(null);
  }

  function edit() {
    setDb(db + 1);
    add("info", `✏️ Someone saved a post: the database is now v${db + 1}. The cache still holds v${entry?.v ?? "nothing"}.`);
  }

  function updateTag() {
    setEntry(null);
    setLastCall("updateTag");
    add("info", "⚡ Server Action: updateTag('posts') expired the entry now. The next read waits for fresh data.");
  }

  function revalidateTag() {
    if (entry) setEntry({ ...entry, stale: true });
    setLastCall("revalidateTag");
    add("info", "🏷️ revalidateTag('posts', 'max') marked the entry stale. The next visit gets stale-while-revalidate.");
  }

  function advance(mins: number) {
    setNow(now + mins);
    add("info", `⏩ Time passes: ${clock(now + mins)}.`, now + mins);
  }

  function changeProfile(next: Profile) {
    setProfile(next);
    add("info", `🧪 Redeployed with cacheLife('${next}'): a new build prerenders v${db}.`);
    setEntry({ v: db, at: now, stale: false });
    setShown(db);
    setPrev(null);
    setLastCall(null);
  }

  const st = status(entry);
  const btn = "rounded-xl px-3 py-2 text-sm font-bold transition hover:-translate-y-0.5";

  return (
    <div>
      <LabHeader title="Cache Caverns simulator" hint="A cached getPosts() feeds the blog page. Change the data, move the clock, call the cache APIs, then visit." />
      <div className="grid gap-3 md:grid-cols-[1.1fr_1fr]">
        <CodeBlock
          lang="ts"
          code={`import { cacheLife, cacheTag } from "next/cache"

export async function getPosts() {
  "use cache"
  cacheLife("${profile}")
  cacheTag("posts")
  return db.posts.findMany()
}`}
        />
        <div className="grid gap-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">🗄️ Database</div>
              <div className="font-mono text-2xl font-black text-white">v{db}</div>
            </div>
            <div className="rounded-xl border p-3" style={{ borderColor: `${st.color}66`, background: `${st.color}12` }}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">🧊 Cache entry</div>
              <div className="font-mono text-2xl font-black text-white">{entry ? `v${entry.v}` : "—"}</div>
              <div className="text-xs font-bold" style={{ color: st.color }}>
                {st.label}
                {entry && <span className="font-normal text-slate-400"> · age {age(now - entry.at)}</span>}
              </div>
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-400">🕘 {clock(now)}</span>
              <span className="text-slate-400">
                Page shows <b className="text-white">v{shown}</b>
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {(Object.keys(PROFILES) as Profile[]).map((k) => (
                <button key={k} type="button" onClick={() => changeProfile(k)} className={`rounded-lg px-2 py-1 font-mono text-xs ${k === profile ? "bg-violet-400 text-slate-950" : "bg-white/10 text-slate-200"}`}>
                  {k}
                </button>
              ))}
            </div>
            <div className="mt-1 text-[11px] text-slate-500">{p.label}</div>
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => visit("visit")} className={`${btn} bg-sky-400 text-slate-950`}>
            👀 Visit the page
          </button>
          <button type="button" onClick={edit} className={`${btn} bg-white/10 text-white`}>
            ✏️ Edit a post in the DB
          </button>
          <button type="button" onClick={() => advance(1)} className={`${btn} bg-white/10 text-white`}>
            ⏩ +1 min
          </button>
          <button type="button" onClick={() => advance(60)} className={`${btn} bg-white/10 text-white`}>
            ⏩ +1 h
          </button>
          <button type="button" onClick={() => advance(1440)} className={`${btn} bg-white/10 text-white`}>
            ⏩ +1 day
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={updateTag} className={`${btn} bg-emerald-400 font-mono text-slate-950`}>
            updateTag(&quot;posts&quot;)
          </button>
          <button type="button" onClick={revalidateTag} className={`${btn} bg-amber-400 font-mono text-slate-950`}>
            revalidateTag(&quot;posts&quot;, &quot;max&quot;)
          </button>
          <button type="button" onClick={() => visit("refresh")} className={`${btn} bg-fuchsia-400 font-mono text-slate-950`}>
            refresh()
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-1.5">
        {log.map((l) => (
          <div
            key={l.id}
            className={`pop-in rounded-lg border px-3 py-1.5 text-sm ${
              l.tone === "hit" ? "border-emerald-400/40 text-emerald-100" : l.tone === "stale" ? "border-amber-400/40 text-amber-100" : l.tone === "miss" ? "border-rose-400/40 text-rose-100" : "border-white/10 text-slate-300"
            } bg-slate-950/70`}
          >
            <span className="mr-2 font-mono text-[11px] text-slate-500">{clock(l.at).split(" · ")[1]}</span>
            {l.text}
          </div>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-slate-500">
        Simplified model of one server instance: time-based revalidation and revalidateTag serve stale content while refreshing; updateTag and expiry make the next read wait. refresh() re-renders without touching the cache.
      </p>
    </div>
  );
}
