"use client";

import { useSyncExternalStore } from "react";
import type { LevelChoice } from "./levels";

/** What the player told us on the home page. */
export type Goal = "cert" | "code" | "interview";

export interface Profile {
  goal: Goal | null;
  /** Starting level for every course the player hasn't set one for yet. */
  level: LevelChoice | null;
}

const KEY = "cq:profile:v1";
const EMPTY: Profile = { goal: null, level: null };
let cache: Profile | null = null;
const listeners = new Set<() => void>();

/** Re-read when another tab changed or cleared this key, so a stale cache is never written back. */
let cacheRaw: string | null = null;
const rawNow = () => {
  try {
    return window.localStorage.getItem(KEY);
  } catch {
    return cacheRaw;
  }
};
if (typeof window !== "undefined")
  window.addEventListener("storage", (e) => {
    if (e.key === null || e.key === KEY) listeners.forEach((l) => l());
  });

export function getProfile(): Profile {
  if (typeof window === "undefined") return EMPTY;
  const raw = rawNow();
  if (cache && raw === cacheRaw) return cache;
  cacheRaw = raw;
  try {
    cache = { ...EMPTY, ...JSON.parse(raw ?? "{}") };
  } catch {
    cache = EMPTY;
  }
  return cache!;
}

export function setProfile(patch: Partial<Profile>) {
  cache = { ...getProfile(), ...patch };
  try {
    const raw = JSON.stringify(cache);
    window.localStorage.setItem(KEY, raw);
    cacheRaw = raw;
  } catch {
    // Keep it in memory if storage is blocked.
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export function useProfile(): Profile {
  return useSyncExternalStore(subscribe, getProfile, () => EMPTY);
}
