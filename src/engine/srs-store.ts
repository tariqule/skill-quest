"use client";

import { useSyncExternalStore } from "react";
import { COURSES } from "@/courses";
import { itemKey, migrateProgress, newRecord, review, type ReviewGrade, type SrsState } from "./srs";
import { peekProgress } from "./store";

/** Daily Review state for every course in one place, so reviews can interleave courses. */
interface SrsFile {
  v: 1;
  items: SrsState;
}

const KEY = "cq:srs:v1";
const EMPTY: SrsFile = { v: 1, items: {} };
let cache: SrsFile | null = null;
const listeners = new Set<() => void>();

function read(): SrsFile {
  if (cache) return cache;
  if (typeof window === "undefined") return EMPTY;
  try {
    cache = { ...EMPTY, ...JSON.parse(window.localStorage.getItem(KEY) ?? "{}") };
  } catch {
    cache = EMPTY;
  }
  // Once per page load, pull in missed questions and studied flashcards from every
  // course's saved progress (including progress saved before Daily Review existed).
  const now = new Date();
  let added: SrsState = {};
  for (const c of COURSES) {
    const p = peekProgress(c.storageKey);
    if (p) added = { ...added, ...migrateProgress(c.id, p, cache!.items, now) };
  }
  if (Object.keys(added).length > 0) write({ ...cache!, items: { ...cache!.items, ...added } });
  return cache!;
}

function write(next: SrsFile) {
  cache = next;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: keep it in memory.
  }
  listeners.forEach((l) => l());
}

export function getSrs(): SrsState {
  return read().items;
}

export function useSrs(): SrsState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    getSrs,
    () => EMPTY.items,
  );
}

/** Grade one review and reschedule it. */
export function gradeItem(key: string, grade: ReviewGrade, now = new Date()) {
  const f = read();
  write({ ...f, items: { ...f.items, [key]: review(f.items[key], grade, now) } });
}

/** A missed question anywhere in the app goes into Daily Review, due now. */
export function addMissedQuestion(courseId: string, questionId: string, now = new Date()) {
  if (typeof window === "undefined") return;
  const f = read();
  const key = itemKey(courseId, "q", questionId);
  if (f.items[key]) return;
  write({ ...f, items: { ...f.items, [key]: newRecord(now) } });
}
