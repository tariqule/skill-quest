"use client";

import Link from "next/link";
import { m } from "motion/react";
import { BookOpen, CheckCircle2, ChevronDown, Circle, Clock, Dices, Lock, PlayCircle, Swords, type LucideIcon } from "lucide-react";
import { useId, useState } from "react";
import { BlockIcon } from "@/components/learn/block-icons";
import { GENTLE } from "@/components/motion/LayoutMotion";
import { Bar, Stars } from "@/components/ui";
import { courseCopy } from "@/engine/copy";
import { useCourse, useProgress } from "@/engine/course-context";
import { domainMastery } from "@/engine/game";
import { useHydrated } from "@/engine/hydrated";
import { LEVEL_BY_ID } from "@/engine/levels";
import { type NodeState, type PathNode, type PathWorld } from "@/engine/path";
import { cn } from "@/lib/utils";

/** Every node state has an icon AND a word. */
const NODE: Record<NodeState, { icon: LucideIcon; word: string; tone: string }> = {
  done: { icon: CheckCircle2, word: "Done", tone: "text-success-foreground" },
  current: { icon: PlayCircle, word: "Up next", tone: "text-primary" },
  open: { icon: Circle, word: "Available", tone: "text-muted-foreground" },
  later: { icon: Clock, word: "Optional", tone: "text-muted-foreground" },
  locked: { icon: Lock, word: "Locked", tone: "text-muted-foreground" },
};

/**
 * Stage (world) accordion for path-based hubs: certification worlds and code tracks without a topic
 * syllabus. One card per stage; the stage holding "Up next" starts open. Needs <LayoutMotion>.
 */
export function StageMap({ worlds, unit = "World" }: { worlds: PathWorld[]; unit?: string }) {
  const openFirst = worlds.find((w) => w.nodes.some((n) => n.state === "current"))?.domain ?? worlds.find((w) => w.unlocked)?.domain;
  return (
    <div>
      <ol className="grid gap-3" aria-label={`${unit}s`}>
        {worlds.map((w) => (
          <StageCard key={w.domain} world={w} unit={unit} defaultOpen={w.domain === openFirst} />
        ))}
      </ol>
      <MapLegend entries={STAGE_LEGEND} />
    </div>
  );
}

export type LegendEntry = { icon: LucideIcon; word: string; tone: string; meaning: string };

/** One line under a map that says what the tile words mean, so "Available" next to "Up next" isn't a puzzle. */
export function MapLegend({ entries }: { entries: LegendEntry[] }) {
  return (
    <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
      {entries.map(({ icon: Icon, word, tone, meaning }) => (
        <span key={word} className="inline-flex items-center gap-1.5">
          <Icon aria-hidden="true" className={cn("size-4", tone)} />
          <span className="font-medium text-foreground">{word}</span>: {meaning}
        </span>
      ))}
    </p>
  );
}

const STAGE_LEGEND: LegendEntry[] = [
  { ...NODE.current, meaning: "the one we recommend next" },
  { ...NODE.open, meaning: "take it any time" },
  { ...NODE.done, meaning: "finished" },
  { ...NODE.locked, meaning: "opens after the one before" },
];

function StageCard({ world, unit, defaultOpen }: { world: PathWorld; unit: string; defaultOpen: boolean }) {
  const { course, href, domain: domainById } = useCourse();
  const p = useProgress();
  const hydrated = useHydrated();
  const d = domainById[world.domain];
  const copy = courseCopy(course);
  const panelId = useId();
  const [toggled, setToggled] = useState<boolean | null>(null);
  const open = toggled ?? defaultOpen;
  const mastery = hydrated ? domainMastery(course, p, d.id) : 0;
  const stars = hydrated ? (p.questStars[d.id] ?? 0) : 0;
  const quest = world.nodes.find((n) => n.type === "quest");
  return (
    <m.li layout="position" transition={GENTLE} className="rounded-card border border-border bg-card">
      <h3 className="m-0">
        <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setToggled(!open)} className="flex min-h-11 w-full items-start gap-3 rounded-card p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <span className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-control bg-muted">
            <BlockIcon icon={d.emoji} className="size-5" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-muted-foreground">
              {unit} {d.number} · {d.weight}% of the {copy.noun}
            </span>
            <span className="mt-0.5 block text-base font-semibold text-foreground">{d.world}</span>
            <span className="block text-sm text-muted-foreground">{d.name}</span>
            <span className="mt-2 flex items-center gap-3">
              <Bar value={mastery} color={d.color} className="h-1.5 flex-1" />
              <span className="shrink-0 text-sm tabular-nums text-muted-foreground">{hydrated ? `${world.lessonsDone}/${world.lessonsTotal} lessons` : `–/${world.lessonsTotal} lessons`}</span>
            </span>
          </span>
          <ChevronDown aria-hidden="true" className={cn("mt-2 size-5 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none", open && "rotate-180")} />
        </button>
      </h3>
      <div id={panelId} hidden={!open} className="px-4 pb-4">
        <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {world.nodes.map((n, i) => (
            <li key={n.key}>
              <PathTile node={n} label={n.type === "quest" ? `${unit} trial` : `${d.number}.${i + 1}`} />
            </li>
          ))}
        </ol>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          <Link href={href(`/study/${d.id}`)} className="inline-flex min-h-11 items-center gap-1.5 font-medium text-foreground hover:text-primary">
            <BookOpen aria-hidden="true" className="size-4 text-primary" />
            Study {d.world}
          </Link>
          <Link href={href(`/game/${d.id}`)} className="inline-flex min-h-11 items-center gap-1.5 font-medium text-foreground hover:text-primary">
            <Dices aria-hidden="true" className="size-4 text-primary" />
            Mini game{hydrated && p.games[d.id] ? ` · best ${p.games[d.id].best}` : ""}
          </Link>
          {stars > 0 && <Stars count={stars} size="size-4" />}
          <span>{Math.round(mastery * 100)}% mastered</span>
        </div>
        {!world.unlocked && quest && (
          <p className="mt-1 text-sm text-muted-foreground">
            Opens after the previous trial.{" "}
            <Link href={href(quest.to)} className="font-medium text-primary underline underline-offset-4">
              Already know this? Take the trial
            </Link>
          </p>
        )}
      </div>
    </m.li>
  );
}

/** One lesson or trial on a stage: state icon + word, title, level. Locked trials still say why. */
export function PathTile({ node, label }: { node: PathNode; label: string }) {
  const { href, lesson: lessonById } = useCourse();
  const lesson = node.type === "lesson" ? lessonById[node.key] : null;
  const level = lesson?.level ? LEVEL_BY_ID[lesson.level] : null;
  const boss = node.type === "quest";
  const s = NODE[node.state];
  const Icon = boss && node.state !== "done" ? Swords : s.icon;
  const body = (
    <span
      className={cn(
        "flex h-full min-h-11 flex-col rounded-control border p-3 transition-colors",
        node.state === "current"
          ? "border-primary bg-primary/10 ring-1 ring-primary"
          : node.state === "done"
            ? "border-success/40 bg-success/5"
            : node.state === "locked"
              ? "border-dashed border-border bg-background"
              : "border-border/60 bg-transparent",
        node.state !== "locked" && "hover:border-primary/60",
      )}
    >
      <span className="flex items-center justify-between gap-2 text-sm font-medium">
        <span className="text-muted-foreground">{label}</span>
        <span className={cn("inline-flex items-center gap-1", s.tone)}>
          <Icon aria-hidden="true" className="size-4" />
          {s.word}
        </span>
      </span>
      <span className="mt-1.5 text-sm font-medium leading-snug text-foreground">{boss ? `Trial: ${node.title}` : (lesson?.title ?? node.title)}</span>
      {(level || node.basics) && (
        <span className="mt-1 text-sm text-muted-foreground">
          {level?.name}
          {node.basics && node.optional ? `${level ? " · " : ""}basics, optional` : ""}
        </span>
      )}
    </span>
  );
  if (node.state === "locked") return <span className="block h-full">{body}</span>;
  return (
    <Link href={href(node.to)} aria-current={node.state === "current" ? "step" : undefined} className="block h-full rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
      {body}
    </Link>
  );
}
