// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { filterReview, type ReviewItem } from "./AnswerReview";
import { ModePicker } from "./ModePicker";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
// jsdom has no PointerEvent; Base UI radios dispatch one on click.
if (!("PointerEvent" in window)) Object.assign(window, { PointerEvent: class extends MouseEvent {} });

let root: Root | null = null;
afterEach(() => {
  act(() => root?.unmount());
  document.body.innerHTML = "";
});

const MODES = [
  { id: "full", name: "Full simulation", questions: 65, minutes: 130, full: true },
  { id: "quick", name: "Quick round", questions: 20, minutes: 40 },
];

function render(onStart: (id: string) => void) {
  const host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  act(() => root!.render(<ModePicker modes={MODES} onStart={onStart} />));
}
const start = () => [...document.querySelectorAll("button")].find((b) => b.textContent?.includes("Start exam"))!;
const radios = () => [...document.querySelectorAll<HTMLElement>('[role="radio"]')];

describe("exam ModePicker", () => {
  it("is a radio group with nothing preselected and Start disabled", () => {
    render(vi.fn());
    expect(document.querySelector('[role="radiogroup"]')).not.toBeNull();
    expect(radios()).toHaveLength(2);
    expect(radios().every((r) => r.getAttribute("aria-checked") === "false")).toBe(true);
    expect(start().disabled).toBe(true);
  });

  it("choosing a tile never starts the exam; the one primary Start does", () => {
    const onStart = vi.fn();
    render(onStart);
    act(() => radios()[1].click());
    expect(onStart).not.toHaveBeenCalled();
    expect(radios()[1].getAttribute("aria-checked")).toBe("true");
    act(() => start().click());
    expect(onStart).toHaveBeenCalledWith("quick");
  });
});

describe("answer review filter", () => {
  const item = (correct: boolean, flagged: boolean) => ({ correct, flagged }) as ReviewItem;
  const items = [item(true, false), item(false, false), item(false, true), item(true, true)];
  it("All / Wrong / Flagged", () => {
    expect(filterReview(items, "all")).toHaveLength(4);
    expect(filterReview(items, "wrong")).toEqual([items[1], items[2]]);
    expect(filterReview(items, "flagged")).toEqual([items[2], items[3]]);
  });
});
