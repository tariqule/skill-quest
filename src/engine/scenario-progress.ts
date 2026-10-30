"use client";

import { useSyncExternalStore } from "react";
import { scenarioXp } from "./scenarios";

/** Per-item scenario results, kept apart from Daily Review so "played" never depends on scheduling. */
export interface ScenarioResult {
  plays: number;
  best: number;
  last: number;
}
type File = { v: 1; items: Record<string, ScenarioResult> };

const KEY = "cq:scenarios:v1";
const EMPTY: File = { v: 1, items: {} };
let cache: File | null = null;
const listeners = new Set<() => void>();

const keyOf = (courseId: string, id: string) => `${courseId}:${id}`;

function read(): File {
  if (cache) return cache;
  if (typeof window === "undefined") return EMPTY;
  try {
    const raw = JSON.parse(window.localStorage.getItem(KEY) ?? "{}");
    cache = { v: 1, items: raw && typeof raw.items === "object" ? raw.items : {} };
  } catch {
    cache = { ...EMPTY };
  }
  return cache!;
}

/** Pure update: every completion counts as a play, whatever the score. */
export function withResult(items: Record<string, ScenarioResult>, key: string, share: number): Record<string, ScenarioResult> {
  const prev = items[key];
  return { ...items, [key]: { plays: (prev?.plays ?? 0) + 1, best: Math.max(prev?.best ?? 0, share), last: share } };
}

export function recordScenario(courseId: string, id: string, share: number) {
  const f = read();
  cache = { v: 1, items: withResult(f.items, keyOf(courseId, id), share) };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
  } catch {
    // Storage blocked: keep it in memory.
  }
  listeners.forEach((l) => l());
}

const snapshot = () => read().items;
export function useScenarioResults() {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    snapshot,
    () => EMPTY.items,
  );
}

/** Hub counts for one game's items. */
export function playedCounts(results: Record<string, ScenarioResult>, courseId: string, ids: string[], masteredAt: number) {
  const rs = ids.map((id) => results[keyOf(courseId, id)]);
  return { played: rs.filter((r) => r && r.plays > 0).length, mastered: rs.filter((r) => r && r.best >= masteredAt).length };
}

/** One finished scenario item, from a game round or Daily Review: counts the play and awards score-scaled XP. Returns the XP. */
export function completeScenario(store: { addXp: (n: number) => void }, base: number, courseId: string, id: string, share: number) {
  recordScenario(courseId, id, share);
  const xp = scenarioXp(base, share);
  store.addXp(xp);
  return xp;
}
