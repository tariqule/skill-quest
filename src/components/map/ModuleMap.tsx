"use client";

import Link from "next/link";
import { m } from "motion/react";
import { CheckCircle2, ChevronDown, Circle, CircleDashed, PencilLine, PlayCircle, type LucideIcon } from "lucide-react";
import { memo, useId, useState } from "react";
import { useCourse } from "@/engine/course-context";
import { useHydrated } from "@/engine/hydrated";
import type { CourseMap, MapModule, MapTopic, TopicState } from "@/engine/practice";
import { GENTLE } from "@/components/motion/LayoutMotion";
import { cn } from "@/lib/utils";
import { topicTileLabel } from "./labels";

/** Every state has an icon AND a word, so colour is never the only cue. */
const STATE: Record<TopicState, { icon: LucideIcon; word: string; tone: string }> = {
  done: { icon: CheckCircle2, word: "Done", tone: "text-success-foreground" },
  current: { icon: PlayCircle, word: "Up next", tone: "text-primary" },
  open: { icon: Circle, word: "Open", tone: "text-muted-foreground" },
  locked: { icon: CircleDashed, word: "Best after", tone: "text-muted-foreground" },
  planned: { icon: PencilLine, word: "Coming soon", tone: "text-muted-foreground" },
};

/**
 * The course map for a topic syllabus: an accordion of numbered modules, each with its numbered topics.
 * Locked and planned tiles stay at full opacity (fades would drop text below AA). Locked only
 * advises an order, so it isn't drawn as a lock and still links. Collapsed panels stay in the DOM
 * (`hidden`), so find-in-page and server markup keep every topic. Modules animate with `layout`
 * when they open; that needs the domMax features from <LayoutMotion> around the map.
 * Both the beginner and the full course page render this one component.
 */
export function ModuleMap({ map, color, startHere }: { map: CourseMap; color: string; startHere?: boolean }) {
  const openFirst = map.modules.find((mod) => mod.topics.some((t) => t.state === "current"))?.number ?? map.modules.find((mod) => mod.done < mod.topics.length)?.number ?? 1;
  return (
    <ol className="grid gap-3" aria-label="Course modules">
      {map.modules.map((mod) => (
        <ModuleSection key={mod.number} module={mod} color={color} startHere={startHere && mod.number === 1} defaultOpen={mod.number === openFirst} />
      ))}
    </ol>
  );
}

const ModuleSection = memo(function ModuleSection({ module: mod, color, startHere, defaultOpen }: { module: MapModule; color: string; startHere?: boolean; defaultOpen: boolean }) {
  const headingId = `module-${mod.number}`;
  const panelId = useId();
  const hydrated = useHydrated();
  // Follows the learner's current module (known only after hydration) until they toggle it themselves.
  const [toggled, setToggled] = useState<boolean | null>(null);
  const open = toggled ?? defaultOpen;
  const done = hydrated ? mod.done : 0;
  const pct = mod.topics.length ? Math.round((done / mod.topics.length) * 100) : 0;
  return (
    <m.li layout="position" transition={GENTLE} aria-labelledby={headingId} className="rounded-card border border-border bg-card">
      <h3 id={headingId} className="m-0">
        <button type="button" aria-expanded={open} aria-controls={panelId} onClick={() => setToggled(!open)} className="flex min-h-11 w-full items-center gap-3 rounded-card p-4 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium text-muted-foreground">
              Module {mod.number}
              {startHere && <span className="ml-2 rounded-full bg-primary/15 px-2 py-0.5 text-sm font-medium text-primary">Start here</span>}
            </span>
            <span className="mt-0.5 block text-base font-semibold text-foreground">{mod.title}</span>
            <span className="mt-2 flex items-center gap-3">
              <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted" aria-hidden="true">
                <span className="block h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
              </span>
              <span className="shrink-0 text-sm tabular-nums text-muted-foreground">
                {hydrated ? mod.done : "–"}/{mod.topics.length} topics
              </span>
            </span>
          </span>
          <ChevronDown aria-hidden="true" className={cn("size-5 shrink-0 text-muted-foreground transition-transform motion-reduce:transition-none", open && "rotate-180")} />
        </button>
      </h3>
      <ul id={panelId} hidden={!open} className="grid grid-cols-1 gap-2 px-4 pb-4 min-[375px]:grid-cols-2 sm:grid-cols-3">
        {mod.topics.map((t) => (
          <li key={t.topic.id}>
            <TopicTile node={t} />
          </li>
        ))}
      </ul>
    </m.li>
  );
});

function TopicTile({ node }: { node: MapTopic }) {
  const { href } = useCourse();
  const { state } = node;
  const s = STATE[state];
  const Icon = s.icon;
  const body = (
    <span
      className={cn(
        "flex h-full min-h-11 flex-col rounded-control border p-3 transition-colors",
        state === "current" ? "border-primary bg-primary/10" : state === "done" ? "border-success/40 bg-success/5" : "border-border bg-background",
        node.lesson && "hover:border-primary/60",
      )}
    >
      <span className="flex items-center justify-between gap-2 text-sm font-medium">
        <span className="text-muted-foreground tabular-nums">{node.label}</span>
        <span className={cn("inline-flex items-center gap-1", s.tone)}>
          <Icon aria-hidden="true" className="size-4" />
          {state !== "locked" && s.word}
        </span>
      </span>
      <span className="mt-1.5 text-sm font-medium leading-snug text-foreground">{node.topic.title}</span>
      {state === "locked" && <span className="mt-1 text-sm text-muted-foreground">Best after {node.needs.map((n) => n.title).join(", ")}</span>}
    </span>
  );
  // Locked tiles still link: the lesson opens with a soft gate rather than a wall.
  if (!node.lesson) return <span aria-label={topicTileLabel(node)} className="block h-full">{body}</span>;
  return (
    <Link href={href(`/lesson/${node.lesson}`)} aria-label={topicTileLabel(node)} aria-current={state === "current" ? "step" : undefined} className="block h-full rounded-control focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
      {body}
    </Link>
  );
}
