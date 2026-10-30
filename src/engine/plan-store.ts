"use client";

import { useSyncExternalStore } from "react";
import type { StudyPlan } from "./plan";

const KEY = "cq:plan:v1";
let cache: StudyPlan | null | undefined;
const listeners = new Set<() => void>();

export function getPlan(): StudyPlan | null {
  if (cache !== undefined) return cache;
  if (typeof window === "undefined") return null;
  try {
    cache = JSON.parse(window.localStorage.getItem(KEY) ?? "null");
  } catch {
    cache = null;
  }
  return cache ?? null;
}

export function setPlan(plan: StudyPlan | null) {
  cache = plan;
  try {
    if (plan) window.localStorage.setItem(KEY, JSON.stringify(plan));
    else window.localStorage.removeItem(KEY);
  } catch {
    // Storage blocked: keep it in memory.
  }
  listeners.forEach((l) => l());
}

export function usePlan(): StudyPlan | null {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    getPlan,
    () => null,
  );
}
