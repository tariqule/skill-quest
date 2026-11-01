"use client";

import { useEffect, useState } from "react";
import { RichText } from "@/components/learn/code";
import { Button, PageShell } from "@/components/ui";
import { useCourse, useProgress } from "@/engine/course-context";
import { shuffle } from "@/engine/game";
import type { Card } from "@/engine/types";
import { BlockIcon } from "@/components/learn/block-icons";

type Phase = "intro" | "play" | "done";

export default function MatchPage() {
  const { course, store } = useCourse();
  const progress = useProgress();
  const xpCfg = course.config.xp;
  const { badgeSeconds } = course.config.match;
  const pool = course.cards.filter((c) => c.kind === "service");
  const PAIRS = Math.min(course.config.match.pairs, pool.length);
  const label = course.matchLabel ?? "services";
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
    const chosen = shuffle(pool).slice(0, PAIRS);
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
        const gained = Math.max(xpCfg.matchMin, xpCfg.matchMax - mistakes * xpCfg.matchMistakePenalty);
        setElapsed(seconds);
        setXp(gained);
        store.recordMatch(seconds);
        store.addXp(gained);
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
      <PageShell title="Service Match" subtitle={`Pair each of the ${label} with what it does.`}>
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <p className="text-muted-foreground">
            Exams love &quot;which service should they use?&quot; questions. Click a service, then click its use case. Clear all {PAIRS}{" "}
            pairs as fast as you can.
          </p>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground">
            <li>
              <BlockIcon icon="🏁" className="inline-block size-[1.1em] align-[-0.15em]" /> Up to {xpCfg.matchMax} XP, minus {xpCfg.matchMistakePenalty} per mismatch
            </li>
            <li><BlockIcon icon="🧩" className="inline-block size-[1.1em] align-[-0.15em]" /> Finish in {badgeSeconds} seconds or less for the Speed Matcher badge</li>
          </ul>
          {progress.matchBestSeconds !== null && (
            <p className="mt-4 text-sm text-muted-foreground">
              Best time: <span className="font-bold text-foreground">{progress.matchBestSeconds}s</span>
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
      <PageShell title="Board cleared!">
        <div className="pop-in rounded-2xl border border-border bg-card p-8 text-center">
          <div className="text-6xl font-semibold text-primary">{elapsed}s</div>
          <div className="mt-2 text-muted-foreground">
            {mistakes} mismatch{mistakes === 1 ? "" : "es"} · +{xp} XP
          </div>
          <div className="mt-6 grid gap-2 text-left text-sm">
            {terms.map((t) => (
              <div key={t.id} className="rounded-lg bg-muted px-3 py-2">
                <span className="font-semibold text-foreground"><RichText text={t.term} /></span>
                <span className="text-muted-foreground"> · <RichText text={t.definition} /></span>
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
    <PageShell title="Service Match">
      <div className="mb-4 flex justify-between text-sm text-muted-foreground">
        <span>
          {matched.length}/{PAIRS} matched · {mistakes} mismatches
        </span>
        <span className="font-mono text-foreground">{elapsed.toFixed(0)}s</span>
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
                    ? "border-success/30 bg-success/10 text-success-foreground opacity-50"
                    : active
                      ? "border-primary bg-primary/20 text-foreground"
                      : bad
                        ? "shake border-destructive bg-destructive/15 text-foreground"
                        : "border-border bg-muted text-foreground hover:border-primary/50"
                }`}
              >
                <RichText text={t.term} />
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
                    ? "border-success/30 bg-success/10 text-success-foreground opacity-50"
                    : bad
                      ? "shake border-destructive bg-destructive/15 text-foreground"
                      : pickedTerm
                        ? "border-border bg-muted text-foreground hover:border-primary/60 hover:bg-primary/10"
                        : "border-border bg-white/[0.03] text-muted-foreground"
                }`}
              >
                <RichText text={d.definition} />
              </button>
            );
          })}
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-muted-foreground">Pick a service on the left, then its match on the right.</p>
    </PageShell>
  );
}
