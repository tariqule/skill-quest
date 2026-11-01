// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { registerCatalog, resetClientCache, REQUEST_TIMEOUT_MS } from "@/api/client";
import * as contentRoute from "@/app/api/v1/courses/[course]/content/route";
import DailyReview from "@/app/daily/page";
import { Today } from "@/components/home/Today";
import type { StudyPlan } from "@/engine/plan";
import { setPlan } from "@/engine/plan-store";
import { addMissedQuestion } from "@/engine/srs-store";
import { isChoice } from "@/engine/types";
import { contentVersion, courseSummaries, findCourse } from "@/server/courses/repository";

/**
 * Today (home, with a plan) and Daily Review load course content through /api/v1 on a fresh page:
 * nothing primed, fetch answered by the real route handler. These would have caught the
 * envelope bug that left both on an endless skeleton.
 */
vi.mock("next/navigation", () => ({ useRouter: () => ({ push: vi.fn(), replace: vi.fn(), prefetch: vi.fn() }), usePathname: () => "/", useSearchParams: () => new URLSearchParams() }));

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const PLAN: StudyPlan = { goal: "exam", target: "aws-saa-c03", date: null, level: "intermediate", minutesPerDay: 20, created: "2026-10-31" };

/** fetch backed by the real content route handler (same envelope, status and headers as prod). */
async function realFetch(input: RequestInfo | URL): Promise<Response> {
  const url = new URL(String(input), "http://localhost");
  const m = url.pathname.match(/^\/api\/v1\/courses\/([^/]+)\/content$/);
  if (!m) return new Response(JSON.stringify({ error: { code: "not_found", message: "nope" } }), { status: 404 });
  return contentRoute.GET(new NextRequest(url), { params: Promise.resolve({ course: decodeURIComponent(m[1]) }) } as never);
}

let root: Root | null = null;
async function render(el: React.ReactElement) {
  const host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  await act(async () => root!.render(el));
}
const text = () => document.body.textContent ?? "";
const busy = () => document.querySelector('[aria-busy="true"], .animate-pulse') !== null;
async function settle(until: () => boolean, ms = 5000) {
  const end = Date.now() + ms;
  while (!until() && Date.now() < end) await act(async () => new Promise((r) => setTimeout(r, 20)));
}

beforeEach(() => {
  localStorage.clear();
  resetClientCache();
  registerCatalog(courseSummaries(), contentVersion());
});
afterEach(() => {
  act(() => root?.unmount());
  root = null;
  document.body.innerHTML = "";
  vi.unstubAllGlobals();
  vi.useRealTimers();
  setPlan(null);
});

describe("Today (home with a plan)", () => {
  it("loaded: fetches the plan course's content and shows the plan", async () => {
    const fetch = vi.fn(realFetch);
    vi.stubGlobal("fetch", fetch);
    setPlan(PLAN);
    await render(<Today plan={PLAN} />);
    await settle(() => !busy());
    expect(fetch).toHaveBeenCalled();
    expect(String(fetch.mock.calls[0][0])).toContain("/api/v1/courses/aws-saa-c03/content");
    expect(busy()).toBe(false);
    expect(document.querySelector('[role="alert"]')).toBeNull();
    expect(document.querySelector("a[href^='/c/aws-saa-c03']")).not.toBeNull();
  });

  it("error: a failed request shows the error with Try again, and retry recovers", async () => {
    let fail = true;
    vi.stubGlobal("fetch", vi.fn((i: RequestInfo | URL) => (fail ? Promise.resolve(new Response(JSON.stringify({ error: { code: "internal", message: "Boom" } }), { status: 500 })) : realFetch(i))));
    await render(<Today plan={PLAN} />);
    await settle(() => !!document.querySelector('[role="alert"]'));
    expect(document.querySelector('[role="alert"]')?.textContent).toContain("Boom");
    fail = false;
    const retry = [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Try again"))!;
    await act(async () => retry.click());
    await settle(() => !busy() && !document.querySelector('[role="alert"]'));
    expect(document.querySelector('[role="alert"]')).toBeNull();
    expect(busy()).toBe(false);
  });

  it("error: a malformed 200 body is an error, not an endless skeleton", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response(JSON.stringify({ id: "aws-saa-c03" }), { status: 200 })));
    await render(<Today plan={PLAN} />);
    await settle(() => !!document.querySelector('[role="alert"]'));
    expect(document.querySelector('[role="alert"]')).not.toBeNull();
  });

  it("error: a request that never answers times out into Try again", async () => {
    vi.useFakeTimers({ toFake: ["setTimeout", "clearTimeout"] });
    vi.stubGlobal("fetch", vi.fn((_i: RequestInfo | URL, init?: RequestInit) => new Promise<Response>((_r, reject) => init?.signal?.addEventListener("abort", () => reject(init.signal!.reason)))));
    vi.stubGlobal("AbortSignal", { timeout: (ms: number) => { const c = new AbortController(); setTimeout(() => c.abort(Object.assign(new Error("timeout"), { name: "TimeoutError" })), ms); return c.signal; } });
    await render(<Today plan={PLAN} />);
    expect(busy()).toBe(true);
    await act(async () => vi.advanceTimersByTime(REQUEST_TIMEOUT_MS + 10));
    vi.useRealTimers();
    await settle(() => !!document.querySelector('[role="alert"]'));
    expect(document.querySelector('[role="alert"]')?.textContent).toMatch(/too long/);
  });
});

describe("Daily Review", () => {
  it("loaded: a due question from the plan course is fetched, shown and can be answered", async () => {
    vi.stubGlobal("fetch", vi.fn(realFetch));
    setPlan(PLAN);
    const q = findCourse("aws-saa-c03")!.questions.filter(isChoice).find((x) => x.answer.length === 1)!;
    addMissedQuestion("aws-saa-c03", q.id, new Date(Date.now() - 3 * 864e5));
    await render(<DailyReview />);
    await settle(() => !busy());
    expect(document.querySelector('[role="alert"]')).toBeNull();
    expect(text()).not.toContain("Nothing due right now");
    expect(text()).toContain(q.prompt.slice(0, 30));
    const option = [...document.querySelectorAll<HTMLButtonElement>("main button")].find((b) => b.textContent?.includes(String(q.options[0]).slice(0, 20)))!;
    expect(option).toBeTruthy();
    await act(async () => option.click());
    const check = [...document.querySelectorAll<HTMLButtonElement>("main button")].find((b) => /check|submit/i.test(b.textContent ?? ""));
    if (check) await act(async () => check.click());
    await settle(() => /correct|not quite|right|answer/i.test(text()));
    expect(text()).toMatch(/correct|not quite|exactly|answer/i);
  });

  it("empty: no plan and no progress shows the 'Nothing due' state, not a skeleton", async () => {
    vi.stubGlobal("fetch", vi.fn(realFetch));
    await render(<DailyReview />);
    await settle(() => !busy());
    expect(busy()).toBe(false);
    expect(text()).toContain("Nothing due right now");
  });

  it("error: shows Try again instead of a skeleton", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => new Response("{}", { status: 503 })));
    setPlan(PLAN);
    await render(<DailyReview />);
    await settle(() => !!document.querySelector('[role="alert"]'));
    expect([...document.querySelectorAll("button")].some((b) => b.textContent?.includes("Try again"))).toBe(true);
  });
});
