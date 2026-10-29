"use client";

import { useEffect, useState } from "react";
import { Button, PageShell } from "@/components/ui";
import { CARDS, type Card } from "@/data/cards";
import { shuffle } from "@/lib/game";
import { addXp, recordMatch, useProgress } from "@/lib/store";

const PAIRS = 8;

type Phase = "intro" | "play" | "done";

export default function MatchPage() {
  const progress = useProgress();
  const [phase, setPhase] = useState<Phase>("intro");
  const [terms, setTerms] = useState<Card[]>([]);
  const [defs, setDefs] = useState<Card[]>([]);
  const [pickedTerm, setPickedTerm] = useState<string | null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [wrongPair, setWrongPair] = useState<[string, string] | null>(null);
  const [mistakes, setMistakes] = useState(0);
  const [startedAt, setStartedAt] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [xp, setXp] = useState(0);

  function start() {
    const chosen = shuffle(CARDS.filter((c) => c.kind === "service")).slice(0, PAIRS);
    setTerms(chosen);
    setDefs(shuffle(chosen));
    setMatched([]);
    setPickedTerm(null);
    setMistakes(0);
    setStartedAt(Date.now());
    setElapsed(0);
    setPhase("play");
  }

  useEffect(() => {
    if (phase !== "play") return;
    const t = setInterval(() => setElapsed((Date.now() - startedAt) / 1000), 200);
    return () => clearInterval(t);
  }, [phase, startedAt]);

  function pickDef(id: string) {
    if (!pickedTerm || matched.includes(id)) return;
    if (pickedTerm === id) {
      const next = [...matched, id];
      setMatched(next);
      setPickedTerm(null);
      if (next.length === PAIRS) {
        const seconds = Math.max(1, Math.round(elapsed));
        const gained = Math.max(10, 60 - mistakes * 5);
        setElapsed(seconds);
        setXp(gained);
        recordMatch(seconds);
        addXp(gained);
        setPhase("done");
      }
    } else {
      setMistakes((m) => m + 1);
      setWrongPair([pickedTerm, id]);
      setTimeout(() => setWrongPair(null), 500);
      setPickedTerm(null);
    }
  }

  if (phase === "intro") {
    return (
      <PageShell title="🧩 Service Match" subtitle="Pair each AWS service with what it does.">
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 sm:p-8">
          <p className="text-slate-300">
            The exam loves &quot;which service should they use?&quot; questions. Click a service, then click its use case. Clear all {PAIRS}{" "}
            pairs as fast as you can.
          </p>
          <ul className="mt-4 grid gap-2 text-sm text-slate-400">
            <li>🏁 Up to 60 XP, minus 5 per mismatch</li>
            <li>🧩 Finish in 45 seconds or less for the Speed Matcher badge</li>
          </ul>
          {progress.matchBestSeconds !== null && (
            <p className="mt-4 text-sm text-slate-300">
              Best time: <span className="font-bold text-white">{progress.matchBestSeconds}s</span>
            </p>
          )}
          <Button onClick={start} className="mt-6">
            Start matching
          </Button>
        </div>
      </PageShell>
    );
  }

  if (phase === "done") {
    return (
      <PageShell title="🧩 Board cleared!">
        <div className="pop-in rounded-2xl border border-white/10 bg-slate-900/70 p-8 text-center">
          <div className="text-6xl font-black text-sky-300">{elapsed}s</div>
          <div className="mt-2 text-slate-400">
            {mistakes} mismatch{mistakes === 1 ? "" : "es"} · +{xp} XP
          </div>
          <div className="mt-6 grid gap-2 text-left text-sm">
            {terms.map((t) => (
              <div key={t.id} className="rounded-lg bg-white/5 px-3 py-2">
                <span className="font-semibold text-white">{t.term}</span>
                <span className="text-slate-400"> · {t.definition}</span>
              </div>
            ))}
          </div>
          <Button onClick={start} className="mt-6">
            New board
          </Button>
        </div>
      </PageShell>
    );
  }

  const tile = "w-full rounded-xl border px-3 py-3 text-left text-sm transition";
  return (
    <PageShell title="🧩 Service Match">
      <div className="mb-4 flex justify-between text-sm text-slate-400">
        <span>
          {matched.length}/{PAIRS} matched · {mistakes} mismatches
        </span>
        <span className="font-mono text-slate-200">{elapsed.toFixed(0)}s</span>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <div className="grid content-start gap-2">
          {terms.map((t) => {
            const done = matched.includes(t.id);
            const active = pickedTerm === t.id;
            const bad = wrongPair?.[0] === t.id;
            return (
              <button
                key={t.id}
                type="button"
                disabled={done}
                onClick={() => setPickedTerm(active ? null : t.id)}
                className={`${tile} font-semibold ${
                  done
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200 opacity-50"
                    : active
                      ? "border-sky-400 bg-sky-400/20 text-white"
                      : bad
                        ? "shake border-rose-400 bg-rose-400/15 text-white"
                        : "border-white/10 bg-white/5 text-slate-100 hover:border-sky-400/50"
                }`}
              >
                {t.term}
              </button>
            );
          })}
        </div>
        <div className="grid content-start gap-2">
          {defs.map((d) => {
            const done = matched.includes(d.id);
            const bad = wrongPair?.[1] === d.id;
            return (
              <button
                key={d.id}
                type="button"
                disabled={done || !pickedTerm}
                onClick={() => pickDef(d.id)}
                className={`${tile} ${
                  done
                    ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200 opacity-50"
                    : bad
                      ? "shake border-rose-400 bg-rose-400/15 text-white"
                      : pickedTerm
                        ? "border-white/15 bg-white/5 text-slate-200 hover:border-sky-400/60 hover:bg-sky-400/10"
                        : "border-white/10 bg-white/[0.03] text-slate-300"
                }`}
              >
                {d.definition}
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-slate-500">Pick a service on the left, then its match on the right.</p>
    </PageShell>
  );
}
