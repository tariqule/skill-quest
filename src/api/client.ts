"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { API_BASE, type ApiErrorBody } from "./contracts";
import { decodeCourse, decodedCourse, onCourseDecoded, type CourseSummary, type WireCourse } from "./wire";
import type { Course } from "@/engine/types";

/**
 * The browser side of /api/v1: a typed, de-duplicating, cached fetcher plus a registry of the
 * courses this page has. Summaries come from the root layout (no fetch); full course content is
 * loaded only for the courses a page actually needs, with `?v=<content version>` so the browser
 * and CDN can keep each response forever and a deploy changes every URL.
 */

export class ApiRequestError extends Error {
  constructor(
    readonly status: number,
    readonly body: ApiErrorBody | null,
  ) {
    super(body?.error.message ?? `Request failed (${status})`);
  }
}

let version = "";
let summaries: CourseSummary[] = [];
let summaryById = new Map<string, CourseSummary>();

/** Called once by the catalog provider with what the server rendered. */
export function registerCatalog(list: CourseSummary[], contentVersion: string) {
  if (version === contentVersion && summaries.length === list.length) return;
  version = contentVersion;
  summaries = list;
  summaryById = new Map(list.map((s) => [s.id, s]));
}

export const courseSummaries = (): CourseSummary[] => summaries;
export const courseSummary = (id: string): CourseSummary | undefined => summaryById.get(id);

const inflight = new Map<string, Promise<unknown>>();
const results = new Map<string, unknown>();

/** GET a JSON endpoint once per URL per session; concurrent callers share one request. */
export async function getJson<T>(path: string): Promise<T> {
  const url = `${API_BASE}${path}${path.includes("?") ? "&" : "?"}v=${version}`;
  if (results.has(url)) return results.get(url) as T;
  let p = inflight.get(url) as Promise<T> | undefined;
  if (!p) {
    p = fetch(url, { headers: { accept: "application/json" } })
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok) throw new ApiRequestError(res.status, body as ApiErrorBody | null);
        results.set(url, body);
        return body as T;
      })
      .finally(() => inflight.delete(url));
    inflight.set(url, p);
  }
  return p;
}

/** POST JSON (never cached). */
export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, { method: "POST", headers: { "content-type": "application/json", accept: "application/json" }, body: JSON.stringify(body) });
  const json = await res.json().catch(() => null);
  if (!res.ok) throw new ApiRequestError(res.status, json as ApiErrorBody | null);
  return json as T;
}

// ───────────── Course registry ─────────────

type Entry = { status: "loading" } | { status: "error"; error: Error } | { status: "ready"; course: Course };
const entries = new Map<string, Entry>();
const listeners = new Set<() => void>();
const notify = () => listeners.forEach((l) => l());

// A course rendered by a Server Component (inside /c/<id>) counts as loaded too.
if (typeof window !== "undefined") {
  onCourseDecoded((course) => {
    entries.set(course.id, { status: "ready", course });
    notify();
  });
}

/** A loaded course, or undefined. Synchronous: engines call this after `useCourses` is ready. */
export function peekCourse(id: string): Course | undefined {
  const e = entries.get(id);
  return e?.status === "ready" ? e.course : decodedCourse(id);
}

/** Start loading a course's content (no-op when loaded or loading). */
export function loadCourse(id: string): void {
  const e = entries.get(id);
  if (peekCourse(id) || e?.status === "loading") return;
  entries.set(id, { status: "loading" });
  notify();
  getJson<WireCourse>(`/courses/${encodeURIComponent(id)}/content`).then(
    (wire) => {
      entries.set(id, { status: "ready", course: decodeCourse(wire) });
      notify();
    },
    (error: Error) => {
      entries.set(id, { status: "error", error });
      notify();
    },
  );
}

/** Resolve once these courses are loaded (rejects on the first failure). For event handlers. */
export function ensureCourses(ids: readonly string[]): Promise<Course[]> {
  return Promise.all(
    ids.map((id) => {
      const have = peekCourse(id);
      if (have) return have;
      return getJson<WireCourse>(`/courses/${encodeURIComponent(id)}/content`).then((wire) => {
        const course = decodeCourse(wire);
        entries.set(id, { status: "ready", course });
        notify();
        return course;
      });
    }),
  );
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => listeners.delete(l);
}

export type CoursesState = { status: "loading" } | { status: "error"; error: Error; retry: () => void } | { status: "ready"; courses: Course[] };

const READY_NONE: CoursesState = { status: "ready", courses: [] };
const LOADING: CoursesState = { status: "loading" };
const snapshots = new Map<string, CoursesState>();

/**
 * Load these courses' content and re-render when it arrives. Unknown ids are skipped. The state
 * object is stable while nothing changes, so it is safe to use as a memo dependency.
 */
export function useCourses(ids: readonly string[]): CoursesState {
  const known = ids.filter((id) => summaryById.has(id) || peekCourse(id));
  const key = known.join(",");
  const snapshot = useCallback(() => {
    if (!key) return READY_NONE;
    const list = key.split(",");
    const err = list.map((id) => entries.get(id)).find((e) => e?.status === "error");
    let next: CoursesState;
    if (err?.status === "error") {
      next = { status: "error", error: err.error, retry: () => retry(list) };
    } else {
      const courses = list.map(peekCourse);
      if (courses.some((c) => !c)) next = LOADING;
      else next = { status: "ready", courses: courses as Course[] };
    }
    const prev = snapshots.get(key);
    if (prev && sameState(prev, next)) return prev;
    snapshots.set(key, next);
    return next;
  }, [key]);
  useEffect(() => {
    if (key) key.split(",").forEach(loadCourse);
  }, [key]);
  return useSyncExternalStore(subscribe, snapshot, () => LOADING);
}

function sameState(a: CoursesState, b: CoursesState) {
  if (a.status !== b.status) return false;
  if (a.status === "ready" && b.status === "ready") return a.courses.length === b.courses.length && a.courses.every((c, i) => c === b.courses[i]);
  if (a.status === "error" && b.status === "error") return a.error === b.error;
  return true;
}

function retry(ids: string[]) {
  for (const id of ids) {
    if (entries.get(id)?.status !== "error") continue;
    entries.delete(id);
    loadCourse(id);
  }
}

/**
 * Make courses available synchronously, as if loaded. Tests (src/test/catalog-setup.ts) use it
 * with every course; app code never needs it.
 */
export function primeCourses(courses: Course[], list: CourseSummary[], contentVersion = "test") {
  registerCatalog(list, contentVersion);
  for (const course of courses) entries.set(course.id, { status: "ready", course });
  notify();
}
