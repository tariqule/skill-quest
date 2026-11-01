"use client";

import { useEffect, useSyncExternalStore } from "react";

/** Tiny observable for app-wide UI state that isn't saved (toasts, the guide drawer). */
function observable<T>(initial: T) {
  let value = initial;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set(next: T) {
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe(l: () => void) {
      listeners.add(l);
      return () => listeners.delete(l);
    },
  };
}

// ───────────── Toasts ─────────────

export interface Toast {
  id: number;
  title: string;
  body?: string;
  icon: string;
}

const toasts = observable<Toast[]>([]);
let toastSeq = 0;

// While a question is on screen, toasts wait here so nothing pops up mid-answer (they show between
// sessions or on the finish screen instead).
let holders = 0;
let queued: Omit<Toast, "id">[] = [];

export function pushToast(t: Omit<Toast, "id">) {
  if (holders > 0) {
    queued.push(t);
    return;
  }
  showToast(t);
}

function showToast(t: Omit<Toast, "id">) {
  const toast = { ...t, id: ++toastSeq };
  toasts.set([...toasts.get(), toast]);
  setTimeout(() => toasts.set(toasts.get().filter((x) => x.id !== toast.id)), 3500);
}

/** Hold toasts; the returned release shows the queue once nothing holds them (after the next question has had a chance to mount). */
export function holdToasts(): () => void {
  holders++;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    holders--;
    setTimeout(() => {
      if (holders > 0) return;
      const q = queued;
      queued = [];
      q.forEach(showToast);
    }, 0);
  };
}

/** Keep toasts quiet while the calling component (a question) is mounted. */
export function useHoldToasts(active = true) {
  useEffect(() => (active ? holdToasts() : undefined), [active]);
}

export function useToasts() {
  return useSyncExternalStore(toasts.subscribe, toasts.get, toasts.get);
}

// ───────────── Guide drawer ─────────────

const guide = observable(false);

export function setGuideOpen(open: boolean) {
  guide.set(open);
}

export function useGuideOpen() {
  return useSyncExternalStore(guide.subscribe, guide.get, () => false);
}

/** Current toasts, for tests. */
export function peekToasts(): readonly Toast[] {
  return toasts.get();
}
