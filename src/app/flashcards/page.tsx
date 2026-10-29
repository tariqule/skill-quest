"use client";

import { useEffect, useState } from "react";
import { Bar, Button, PageShell } from "@/components/ui";
import { CARDS, type Card } from "@/data/cards";
import { DOMAINS, DOMAIN_BY_ID, type DomainId } from "@/data/domains";
import { shuffle } from "@/lib/game";
import { addXp, getProgress, setCardBox, useProgress } from "@/lib/store";

const SESSION = 12;

type Phase = "intro" | "play" | "done";

export default function FlashcardsPage() {
  const progress = useProgress();
  const [phase, setPhase] = useState<Phase>("intro");
  const [filter, setFilter] = useState<DomainId | "all">("all");
  const [session, setSession] = useState<Card[]>([]);
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knew, setKnew] = useState(0);

  const pool = CARDS.filter((c) => filter === "all" || c.domain === filter);
  const boxCounts = [1, 2, 3, 4, 5].map((b) => pool.filter((c) => (progress.cards[c.id] ?? 1) === b).length);

  function start() {
    const boxes = getProgress().cards;
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
    const box = getProgress().cards[card.id] ?? 1;
    setCardBox(card.id, knewIt ? box + 1 : 1);
    if (knewIt) {
      setKnew((k) => k + 1);
      addXp(3);
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
      <PageShell title="🃏 Flashcards" subtitle="Spaced repetition. Cards you know move up a box; misses go back to box 1.">
        {phase === "done" && (
          <div className="pop-in mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5 text-center">
            <div className="text-2xl font-bold text-white">
              {knew}/{session.length} known
            </div>
            <div className="text-slate-400">+{knew * 3} XP</div>
          </div>
        )}
        <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-6 sm:p-8">
          <div className="flex flex-wrap gap-2">
            <Chip active={filter === "all"} onClick={() => setFilter("all")}>
              All ({CARDS.length})
            </Chip>
            {DOMAINS.map((d) => (
              <Chip key={d.id} active={filter === d.id} onClick={() => setFilter(d.id)}>
                {d.emoji} D{d.number}
              </Chip>
            ))}
          </div>

          <div className="mt-6 grid grid-cols-5 gap-2 text-center">
            {boxCounts.map((n, i) => (
              <div key={i} className="rounded-xl bg-white/5 p-2">
                <div className="text-[11px] uppercase tracking-wider text-slate-400">Box {i + 1}</div>
                <div className="text-lg font-bold text-white">{n}</div>
              </div>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-500">Box 1 = new or missed · Box 5 = mastered</p>

          <Button onClick={start} className="mt-6">
            {phase === "done" ? "Another round" : `Study ${Math.min(SESSION, pool.length)} cards`}
          </Button>
        </div>
      </PageShell>
    );
  }

  const card = session[idx];
  const domain = DOMAIN_BY_ID[card.domain];
  return (
    <PageShell title="🃏 Flashcards">
      <div className="mb-4">
        <div className="mb-1 flex justify-between text-xs text-slate-400">
          <span>
            Card {idx + 1} of {session.length}
          </span>
          <span>Box {progress.cards[card.id] ?? 1}</span>
        </div>
        <Bar value={idx / session.length} color={domain.color} />
      </div>

      <button type="button" onClick={() => setFlipped((f) => !f)} className="flip-scene block w-full" aria-label="Flip card">
        <div className={`flip-card relative h-64 sm:h-72 ${flipped ? "is-flipped" : ""}`}>
          <div className="flip-face absolute inset-0 flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-slate-900 p-6">
            <div className="text-xs font-semibold uppercase tracking-wider" style={{ color: domain.color }}>
              {card.kind === "service" ? "AWS service" : "Concept"} · {domain.emoji} D{domain.number}
            </div>
            <div className="mt-4 text-center text-2xl sm:text-3xl font-bold text-white">{card.term}</div>
            <div className="mt-6 text-xs text-slate-500">Tap or press Space to flip</div>
          </div>
          <div className="flip-face flip-back absolute inset-0 flex items-center justify-center rounded-2xl border border-sky-400/30 bg-slate-800 p-6">
            <div className="text-center text-xl sm:text-2xl text-slate-100">{card.definition}</div>
          </div>
        </div>
      </button>

      <div className={`mt-5 grid grid-cols-2 gap-3 transition ${flipped ? "opacity-100" : "pointer-events-none opacity-30"}`}>
        <Button variant="ghost" onClick={() => grade(false)}>
          ← Still learning
        </Button>
        <Button onClick={() => grade(true)} className="bg-emerald-400 hover:bg-emerald-300">
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
        active ? "border-sky-400 bg-sky-400/20 text-white" : "border-white/10 bg-white/5 text-slate-300 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}
