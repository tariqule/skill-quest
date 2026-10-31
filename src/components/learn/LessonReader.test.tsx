// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LessonReader } from "./LessonReader";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | null = null;
afterEach(() => {
  act(() => root?.unmount());
  document.body.innerHTML = "";
});

const LESSON = {
  title: "T",
  visual: <div>picture</div>,
  points: ["An idea.", "**Worked example: W. Step 1 of 2.** First.", "**Step 2 of 2.** Second.", "Another idea."],
  tip: "A tip.",
  sources: [{ title: "A source", url: "https://example.com", license: "CC BY 4.0" }],
};

function mount(resumeKey?: string) {
  const div = document.createElement("div");
  document.body.appendChild(div);
  root = createRoot(div);
  act(() => root!.render(<LessonReader lesson={LESSON} color="#fff" tipLabel="Tip" questionCount={5} onDone={vi.fn()} resumeKey={resumeKey} />));
  const next = () => act(() => { window.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight" })); });
  const badge = () => div.querySelector(".rounded-full.h-9");
  return { div, next, badge };
}

describe("LessonReader", () => {
  it("resumes on the same card after a reload when given a resume key", () => {
    localStorage.clear();
    const first = mount("cq-reading:test:t-x");
    first.next();
    first.next();
    expect(first.div.textContent).toContain("Step 1 of 2");
    act(() => root?.unmount());
    document.body.innerHTML = "";
    const again = mount("cq-reading:test:t-x");
    expect(again.div.textContent).toContain("Step 1 of 2");
    act(() => root?.unmount());
    document.body.innerHTML = "";
    expect(mount().div.textContent).not.toContain("Step 1 of 2");
  });

  it("badges idea cards but not worked-example steps, which number themselves", () => {
    const { div, next, badge } = mount();
    next();
    expect(badge()?.textContent).toBe("1");
    next();
    expect(badge()).toBeNull();
    expect(div.textContent).toContain("Step 1 of 2");
    next();
    expect(badge()).toBeNull();
    next();
    expect(badge()?.textContent).toBe("2");
  });

  it("credits sources once, on the closing screen", () => {
    const { div, next } = mount();
    for (let k = 0; k < 6; k++) {
      expect(div.textContent).not.toContain("A source");
      next();
    }
    expect(div.textContent).toContain("That's the lesson!");
    expect(div.querySelector('a[href="https://example.com"]')).not.toBeNull();
  });
});
