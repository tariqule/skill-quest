import { afterEach, describe, expect, it, vi } from "vitest";
import { holdToasts, peekToasts, pushToast } from "./ui-state";

describe("toast hold", () => {
  afterEach(() => vi.useRealTimers());

  it("queues toasts while a question holds them and shows them once the question flow ends", () => {
    vi.useFakeTimers();
    const titles = () => peekToasts().map((t) => t.title);
    const release = holdToasts();
    pushToast({ icon: "🏅", title: "Badge unlocked: A" });
    expect(titles()).toEqual([]);
    const next = holdToasts(); // the next question mounts before the first one's release settles
    release();
    vi.advanceTimersByTime(1);
    expect(titles()).toEqual([]);
    next();
    vi.advanceTimersByTime(1);
    expect(titles()).toEqual(["Badge unlocked: A"]);
  });

  it("shows toasts straight away when nothing holds them", () => {
    vi.useFakeTimers();
    pushToast({ icon: "x", title: "Level 2!" });
    expect(peekToasts().map((t) => t.title)).toContain("Level 2!");
  });
});
