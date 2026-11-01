"use client";

import { SquareStackIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RichText } from "@/components/learn/code";
import { useEffect, useState } from "react";
import { Bar, PageShell } from "@/components/ui";
import { useCourse, useProgress } from "@/engine/course-context";
import { shuffle } from "@/engine/game";
import type { Card } from "@/engine/types";
import { BlockIcon } from "@/components/learn/block-icons";

type Phase = "intro" | "play" | "done";

export default function FlashcardsPage() {
  const { course, store, domain: domainById } = useCourse();
  const progress = useProgress();
  const SESSION = course.config.flashcards.sessionSize;
  const XP = course.config.xp.flashcardKnown;
  const [phase, setPhase] = useState<Phase>("intro");
  const [filter, setFilter] = useState<string>("all");
  const [session, setSession] = useState<Card[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knew, setKnew] = useState(0);

  const pool = course.cards.filter((c) => filter === "all" || c.domain === filter);
  const boxCounts = [1, 2, 3, 4, 5].map((b) => pool.filter((c) => (progress.cards[c.id] ?? 1) === b).length);

  function start() {
    const boxes = store.get().cards;
    // Lowest boxes first (the cards you know least), random within a box.
    const ordered = shuffle(pool).sort((a, b) => (boxes[a.id] ?? 1) - (boxes[b.id] ?? 1));
    setSession(ordered.slice(0, SESSION));
    setIdx(0);
    setFlipped(false);
    setKnew(0);
    setPhase("play");
  }

  function grade(knewIt: boolean) {
    const card = session[idx];
    const box = store.get().cards[card.id] ?? 1;
    store.setCardBox(card.id, knewIt ? box + 1 : 1);
    if (knewIt) {
      setKnew((k) => k + 1);
      store.addXp(XP);
    }
    if (idx + 1 >= session.length) setPhase("done");
    else {
      setIdx(idx + 1);
      setFlipped(false);
    }
  }

  useEffect(() => {
    if (phase !== "play") return;
    function onKey(e: KeyboardEvent) {
      if (e.key === " ") {
        e.preventDefault();
        setFlipped((f) => !f);
      } else if (flipped && (e.key === "ArrowRight" || e.key === "k")) grade(true);
      else if (flipped && (e.key === "ArrowLeft" || e.key === "j")) grade(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (phase === "intro" || phase === "done") {
    return (
      <PageShell icon={SquareStackIcon} title="Flashcards" subtitle="Spaced repetition. Cards you know move up a box; misses go back to box 1.">
        {phase === "done" && (
          <div className="pop-in mb-6 rounded-2xl border border-success/20 bg-success/5 p-5 text-center">
            <div className="text-2xl font-semibold text-foreground">
              {knew}/{session.length} known
            </div>
            <div className="text-muted-foreground">+{knew * XP} XP</div>
          </div>
        )}
        <div className="rounded-2xl border border-border bg-card p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <Chip active={filter === "all"} onClick={() => setFilter("all")}>
              All ({course.cards.length})
            </Chip>
            {course.domains.map((d) => (
              <Chip key={d.id} active={filter === d.id} onClick={() => setFilter(d.id)}>
                <BlockIcon icon={d.emoji} className="inline-block size-[1.1em] align-[-0.15em]" /> D{d.number}
              </Chip>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-5 gap-2 text-center">
            {boxCounts.map((n, i) => (
              <div key={i} className="rounded-xl bg-muted p-2">
                <div className="text-sm text-muted-foreground">Box {i + 1}</div>
                <div className="text-lg font-semibold text-foreground">{n}</div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">Box 1: new or missed · Box 5: mastered</p>

          <Button size="lg" onClick={start} className="mt-6">
            {phase === "done" ? "Another round" : `Study ${Math.min(SESSION, pool.length)} cards`}
          </Button>
        </div>
      </PageShell>
    );
  }

  const card = session[idx];
  const domain = domainById[card.domain];
  return (
    <PageShell icon={SquareStackIcon} title="Flashcards">
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-sm text-muted-foreground">
          <span>
            Card {idx + 1} of {session.length}
          </span>
          <span>Box {progress.cards[card.id] ?? 1}</span>
        </div>
        <Bar value={idx / session.length} color={domain.color} />
      </div>

      <button type="button" onClick={() => setFlipped((f) => !f)} className="flip-scene block w-full" aria-label="Flip card">
        <div className={`flip-card relative h-64 sm:h-72 ${flipped ? "is-flipped" : ""}`}>
          <div className="flip-face absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-6">
            <div className="text-sm font-semibold" style={{ color: domain.color }}>
              {card.kind === "service" ? "Service" : "Concept"} · <BlockIcon icon={domain.emoji} className="inline-block size-[1.1em] align-[-0.15em]" /> D{domain.number}
            </div>
            <div className="mt-4 text-center text-2xl sm:text-3xl font-semibold text-foreground"><RichText text={card.term} /></div>
            <div className="mt-6 text-sm text-muted-foreground">Tap or press Space to flip</div>
          </div>
          <div className="flip-face flip-back absolute inset-0 flex items-center justify-center rounded-2xl border border-primary/30 bg-secondary p-6">
            <div className="text-center text-xl sm:text-2xl text-foreground"><RichText text={card.definition} /></div>
          </div>
        </div>
      </button>

      <div className={`mt-5 grid grid-cols-2 gap-3 transition ${flipped ? "opacity-100" : "pointer-events-none opacity-30"}`}>
        <Button size="lg" variant="outline" onClick={() => grade(false)}>
          ← Still learning
        </Button>
        <Button size="lg" onClick={() => grade(true)}>
          Knew it →
        </Button>
      </div>
    </PageShell>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-3 py-1.5 text-sm transition ${
        active ? "border-primary bg-primary/20 text-foreground" : "border-border bg-muted text-muted-foreground hover:bg-muted"
      }`}
    >
      {children}
    </button>
  );
}
