"use client";

import { useSyncExternalStore } from "react";
import type { LevelChoice } from "./levels";
import { getProgressStore, type ProgressSpec } from "./store";

/**
 * One skill level for a whole set of Code Quest tracks. Each track still saves its own level
 * (and can change it on its map); this reads them together and sets them all at once.
 */
export function useSharedLevel(tracks: ProgressSpec[]): LevelChoice | "mixed" {
  const subscribe = (cb: () => void) => {
    const offs = tracks.map((t) => getProgressStore(t).subscribe(cb));
    return () => offs.forEach((off) => off());
  };
  const snapshot = () => {
    const levels = new Set(tracks.map((t) => getProgressStore(t).get().level));
    return levels.size === 1 ? [...levels][0] : "mixed";
  };
  return useSyncExternalStore(subscribe, snapshot, () => "all");
}

export function setSharedLevel(tracks: ProgressSpec[], level: LevelChoice) {
  tracks.forEach((t) => getProgressStore(t).setLevel(level));
}
