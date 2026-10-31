// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi } from "vitest";

/**
 * PR 3 browser test: clearing site data in one tab, then acting in another open tab, brought the
 * old progress back. The open tab held progress in memory and wrote all of it over the cleared
 * storage on its next change. Storage is now the source of truth for every tab.
 */
const COURSE = "code-system-design";

async function freshTab() {
  vi.resetModules(); // a new module graph is a new tab with its own in-memory store
  const { getCourseStore } = await import("./store");
  const { getCourse } = await import("@/courses");
  const course = getCourse(COURSE)!;
  return { store: getCourseStore(course), key: course.storageKey };
}

const saved = (key: string) => {
  const raw = localStorage.getItem(key);
  return raw ? JSON.parse(raw) : null;
};

beforeEach(() => localStorage.clear());

describe("progress across tabs", () => {
  it("a stale tab never writes old progress over cleared storage", async () => {
    const a = await freshTab();
    a.store.completeLesson("t-replication");
    a.store.addXp(30);
    expect(saved(a.key).lessonsDone).toEqual(["t-replication"]);

    localStorage.clear(); // tab B clears site data
    a.store.completeLesson("t-intro"); // tab A acts without reloading

    const s = saved(a.key);
    expect(s.lessonsDone).toEqual(["t-intro"]);
    expect(s.xp).toBeLessThan(30 + 1);
    expect(a.store.get().lessonsDone).toEqual(["t-intro"]);
  });

  it("a stale tab builds on another tab's newer progress instead of overwriting it", async () => {
    const a = await freshTab();
    a.store.completeLesson("t-intro");
    const b = await freshTab();
    b.store.completeLesson("t-network");
    a.store.completeLesson("t-scaling");
    expect(saved(a.key).lessonsDone).toEqual(["t-intro", "t-network", "t-scaling"]);
  });

  it("re-hydrates and notifies on a storage event, including clear()", async () => {
    const a = await freshTab();
    a.store.completeLesson("t-intro");
    const seen = vi.fn();
    const off = a.store.subscribe(seen);
    localStorage.clear();
    window.dispatchEvent(new StorageEvent("storage", { key: null }));
    expect(seen).toHaveBeenCalled();
    expect(a.store.get().lessonsDone).toEqual([]);
    expect(saved(a.key)).toBeNull(); // idle tab writes nothing back
    off();
  });

  it("ignores storage events for other keys", async () => {
    const a = await freshTab();
    const seen = vi.fn();
    const off = a.store.subscribe(seen);
    window.dispatchEvent(new StorageEvent("storage", { key: "cq:profile:v1" }));
    expect(seen).not.toHaveBeenCalled();
    off();
  });
});

describe("small shared caches across tabs", () => {
  it("profile re-reads cleared storage instead of writing its stale copy back", async () => {
    vi.resetModules();
    const { getProfile, setProfile } = await import("./profile");
    setProfile({ goal: "interview", level: null });
    localStorage.clear();
    expect(getProfile().goal).toBeNull();
    setProfile({ level: null });
    expect(JSON.parse(localStorage.getItem("cq:profile:v1")!).goal).toBeNull();
  });
});
