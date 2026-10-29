"use client";

import { useSyncExternalStore } from "react";

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

export function pushToast(t: Omit<Toast, "id">) {
  const toast = { ...t, id: ++toastSeq };
  toasts.set([...toasts.get(), toast]);
  setTimeout(() => toasts.set(toasts.get().filter((x) => x.id !== toast.id)), 3500);
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
