"use client";

import { useSyncExternalStore } from "react";
import type { LevelChoice } from "./levels";
import { getCourseStore } from "./store";
import type { Course } from "./types";

/**
 * One skill level for a whole set of Code Quest tracks. Each track still saves its own level
 * (and can change it on its map); this reads them together and sets them all at once.
 */
export function useSharedLevel(tracks: Course[]): LevelChoice | "mixed" {
  const subscribe = (cb: () => void) => {
    const offs = tracks.map((t) => getCourseStore(t).subscribe(cb));
    return () => offs.forEach((off) => off());
  };
  const snapshot = () => {
    const levels = new Set(tracks.map((t) => getCourseStore(t).get().level));
    return levels.size === 1 ? [...levels][0] : "mixed";
  };
  return useSyncExternalStore(subscribe, snapshot, () => "all");
}

export function setSharedLevel(tracks: Course[], level: LevelChoice) {
  tracks.forEach((t) => getCourseStore(t).setLevel(level));
}
