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

export function getProfile(): Profile {
  if (cache) return cache;
  if (typeof window === "undefined") return EMPTY;
  try {
    cache = { ...EMPTY, ...JSON.parse(window.localStorage.getItem(KEY) ?? "{}") };
  } catch {
    cache = EMPTY;
  }
  return cache!;
}

export function setProfile(patch: Partial<Profile>) {
  cache = { ...getProfile(), ...patch };
  try {
    window.localStorage.setItem(KEY, JSON.stringify(cache));
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
