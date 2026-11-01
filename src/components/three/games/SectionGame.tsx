"use client";

import dynamic from "next/dynamic";
import { useState, type CSSProperties } from "react";
import { Confetti } from "@/components/fx";
import { useCourse, useProgress } from "@/engine/course-context";
import { questionsForLevel } from "@/engine/levels";
import { isChoice } from "@/engine/types";
import { BlockIcon } from "@/components/learn/block-icons";
import {
  buildCatchRounds,
  buildMemoryTiles,
  buildSortStatements,
  buildTowerQuestions,
  plain,
  type CatchRound,
  type MemoryTile,
  type Pair,
  type QuickQuestion,
  type SortStatement,
} from "./common";

// Loaded on demand, in the browser only, so three.js never weighs on the first page load.
const GemCatch = dynamic(() => import("./GemCatch"), { ssr: false });
const MemoryMatch = dynamic(() => import("./MemoryMatch"), { ssr: false });
const SortBins = dynamic(() => import("./SortBins"), { ssr: false });
const TowerBuilder = dynamic(() => import("./TowerBuilder"), { ssr: false });

type GameId = "catch" | "memory" | "sort" | "tower";

const GAMES: Record<GameId, { name: string; icon: string; how: string }> = {
  catch: { name: "Gem Catch", icon: "💎", how: "A meaning appears at the top. Tap the gem with the matching term before it hits the floor." },
  memory: { name: "Memory Match", icon: "🧠", how: "Flip two tiles at a time. Match every term with what it means, in as few moves as you can." },
  sort: { name: "True or False Bins", icon: "🗑️", how: "Each card pairs a term with a meaning. Throw it in True if it's right, False if it's mixed up." },
  tower: { name: "Tower Builder", icon: "🧱", how: "Answer quick questions. Every right answer stacks a block. Build it to the top." },
};

const ORDER: GameId[] = ["catch", "memory", "sort", "tower"];

type Deck =
  | { game: "catch"; data: CatchRound[] }
  | { game: "memory"; data: MemoryTile[] }
  | { game: "sort"; data: SortStatement[] }
  | { game: "tower"; data: QuickQuestion[] };

/** A small 3D game for one section (domain), built from that section's own terms and questions. */
export function SectionGame({ domainId, compact = false }: { domainId: string; compact?: boolean }) {
  const { course, store } = useCourse();
  const p = useProgress();
  const domain = course.domains.find((d) => d.id === domainId)!;
  const index = course.domains.findIndex((d) => d.id === domainId);
  const [deck, setDeck] = useState<Deck | null>(null);
  const [result, setResult] = useState<{ score: number; max: number; xp: number; best: boolean } | null>(null);

  const domainCards = course.cards.filter((c) => c.domain === domainId);
  const pairs: Pair[] = (domainCards.length >= 4 ? domainCards : course.cards).map((c) => ({ term: plain(c.term), definition: plain(c.definition) }));
  const atLevel = questionsForLevel(course, p.level).filter((q) => q.domain === domainId);
  const pool = (atLevel.length >= 4 ? atLevel : course.questions.filter((q) => q.domain === domainId)).filter(
    (q) => isChoice(q) && q.answer.length === 1 && q.options.length <= 5,
  );
  const questions: QuickQuestion[] = pool.map((q) => (isChoice(q) ? { prompt: q.prompt, options: q.options, answer: q.answer[0] } : { prompt: "", options: [], answer: 0 }));

  // Rotate games across sections; fall back when a section lacks the data a game needs.
  let game = ORDER[index % ORDER.length];
  if (game !== "tower" && pairs.length < 4) game = "tower";
  if (game === "tower" && questions.length < 4) game = "catch";
  const info = GAMES[game];
  const best = p.games[domainId]?.best ?? 0;

  function play() {
    setResult(null);
    if (game === "catch") setDeck({ game, data: buildCatchRounds(pairs) });
    // Phones get fewer, bigger tiles so the text stays readable.
    else if (game === "memory") setDeck({ game, data: buildMemoryTiles(pairs, compact || window.innerWidth < 640 ? 4 : 6) });
    else if (game === "sort") setDeck({ game, data: buildSortStatements(pairs) });
    else setDeck({ game, data: buildTowerQuestions(questions) });
  }

  function finish(score: number, max: number) {
    const r = store.recordGame(domainId, score);
    setDeck(null);
    setResult({ score, max, ...r });
  }

  return (
    <section className="rounded-3xl border-2 p-4 sm:p-5" style={{ borderColor: `${domain.color}55`, background: `linear-gradient(160deg, ${domain.color}18, transparent 60%)` } as CSSProperties}>
      {result && result.score / result.max >= 0.7 && <Confetti count={40} />}
      <div className="flex items-center gap-3">
        <span className="text-3xl"><BlockIcon icon={info.icon} className="inline-block size-[1.1em] align-[-0.15em]" /></span>
        <div className="min-w-0 flex-1">
          <div className="text-xs font-bold uppercase tracking-wider" style={{ color: domain.color }}>
            Mini game · {domain.world}
          </div>
          <div className="text-lg font-semibold text-foreground">{info.name}</div>
        </div>
        {best > 0 && !deck && <span className="shrink-0 rounded-full bg-muted px-2.5 py-1 text-xs font-bold text-foreground">Best <BlockIcon icon="⭐" className="inline-block size-[1.1em] align-[-0.15em]" /> {best}</span>}
      </div>

      {!deck && !result && (
        <>
          <p className="mt-3 text-sm text-muted-foreground">{info.how}</p>
          <button type="button" onClick={play} className="mt-4 w-full rounded-lg bg-primary py-3 font-semibold text-primary-foreground hover:bg-primary/90 sm:w-auto sm:px-8">
            ▶ Play
          </button>
        </>
      )}

      {deck && (
        <div className="mt-4">
          {deck.game === "catch" && <GemCatch data={deck.data} color={domain.color} onFinish={finish} />}
          {deck.game === "memory" && <MemoryMatch data={deck.data} color={domain.color} onFinish={finish} />}
          {deck.game === "sort" && <SortBins data={deck.data} color={domain.color} onFinish={finish} />}
          {deck.game === "tower" && <TowerBuilder data={deck.data} color={domain.color} onFinish={finish} />}
        </div>
      )}

      {result && (
        <div className="pop-in mt-4 text-center">
          <div className="text-4xl font-semibold text-foreground">
            <BlockIcon icon="⭐" className="inline-block size-[1.1em] align-[-0.15em]" /> {result.score}
            <span className="text-xl text-muted-foreground">/{result.max}</span>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            {result.score / result.max >= 0.8 ? "Brilliant." : result.score / result.max >= 0.5 ? "Nice work." : "Good warm-up. Try once more?"}
            {result.best ? " New best!" : ""}
            {result.xp > 0 ? ` +${result.xp} XP` : ""}
          </p>
          <button type="button" onClick={play} className="mt-4 rounded-2xl border border-border px-6 py-2.5 font-bold text-foreground hover:bg-muted">
            ↻ Play again
          </button>
        </div>
      )}
    </section>
  );
}
