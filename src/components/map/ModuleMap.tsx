"use client";

import Link from "next/link";
import { memo } from "react";
import { useCourse } from "@/engine/course-context";
import type { CourseMap, MapModule, MapTopic, TopicState } from "@/engine/practice";
import { topicTileLabel } from "./labels";

const ICON: Record<TopicState, string> = { done: "★", current: "▶", open: "·", locked: "🔒", planned: "✎" };

/** The course map for a topic syllabus: numbered modules, each with its numbered topics. */
export function ModuleMap({ map, color, startHere }: { map: CourseMap; color: string; startHere?: boolean }) {
  return (
    <ol className="grid gap-6" aria-label="Course modules">
      {map.modules.map((m) => (
        <ModuleSection key={m.number} module={m} color={color} startHere={startHere && m.number === 1} />
      ))}
    </ol>
  );
}

const ModuleSection = memo(function ModuleSection({ module: m, color, startHere }: { module: MapModule; color: string; startHere?: boolean }) {
  const headingId = `module-${m.number}`;
  return (
    <li aria-labelledby={headingId} className="rounded-2xl border border-white/10 bg-slate-900/50 p-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 id={headingId} className="text-lg font-black text-white">
          <span style={{ color }}>Module {m.number}</span> · {m.title}
          {startHere && <span className="ml-2 rounded-full bg-rose-300/15 px-2 py-0.5 align-middle text-xs font-bold text-rose-200">🐣 Start here</span>}
        </h3>
        <span className="text-xs text-slate-400">
          {m.done}/{m.topics.length} topics
        </span>
      </div>
      <ul className="mt-3 grid grid-cols-1 gap-2 min-[375px]:grid-cols-2 sm:grid-cols-3">
        {m.topics.map((t) => (
          <li key={t.topic.id}>
            <TopicTile node={t} color={color} />
          </li>
        ))}
      </ul>
    </li>
  );
});

function TopicTile({ node, color }: { node: MapTopic; color: string }) {
  const { href } = useCourse();
  const { state } = node;
  const label = topicTileLabel(node);
  const body = (
    <span
      className={`flex h-full flex-col rounded-xl p-3 transition ${state === "planned" ? "opacity-50" : state === "locked" ? "opacity-60 hover:-translate-y-0.5" : "hover:-translate-y-0.5"}`}
      style={{
        background: state === "done" ? `${color}30` : "rgb(255 255 255 / 0.04)",
        boxShadow: state === "current" ? `inset 0 0 0 2px ${color}, 0 0 22px -4px ${color}` : `inset 0 0 0 1px ${state === "done" ? color : "rgb(255 255 255 / 0.1)"}`,
      }}
    >
      <span className="flex items-center justify-between font-mono text-xs font-black" style={{ color }}>
        <span>{node.label}</span>
        <span aria-hidden="true">{ICON[state]}</span>
      </span>
      <span className="mt-1.5 text-sm leading-snug text-slate-100">{node.topic.title}</span>
      {state === "locked" && <span className="mt-1 text-[11px] text-slate-400">After {node.needs.map((n) => n.title).join(", ")}</span>}
      {state === "planned" && <span className="mt-1 text-[11px] text-slate-400">Coming soon</span>}
    </span>
  );
  // Locked tiles still link: the lesson opens with a soft gate rather than a wall.
  if (!node.lesson) return <span aria-label={label} className="block h-full">{body}</span>;
  return (
    <Link href={href(`/lesson/${node.lesson}`)} aria-label={label} aria-current={state === "current" ? "step" : undefined} className="block h-full rounded-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300">
      {body}
    </Link>
  );
}
