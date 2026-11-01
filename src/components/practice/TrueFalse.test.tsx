// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { TrueFalse } from "./TrueFalse";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | null = null;
afterEach(() => {
  act(() => root?.unmount());
  document.body.innerHTML = "";
});

function mount(submitted: number[] | null = null) {
  const div = document.createElement("div");
  document.body.appendChild(div);
  const onSubmit = vi.fn();
  root = createRoot(div);
  act(() => root!.render(<TrueFalse correct={0} submitted={submitted} onSubmit={onSubmit} reveal />));
  const radios = [...div.querySelectorAll<HTMLButtonElement>('[role="radio"]')];
  return { div, radios, onSubmit };
}

const key = (el: Element, k: string) => act(() => { el.dispatchEvent(new KeyboardEvent("keydown", { key: k, bubbles: true })); });
const tabStops = (radios: HTMLElement[]) => radios.map((r) => r.tabIndex);

describe("TrueFalse", () => {
  it("is a labelled radio group of True then False with one tab stop", () => {
    const { div, radios } = mount();
    expect(div.querySelector('[role="radiogroup"]')?.getAttribute("aria-label")).toBe("True or false");
    expect(radios.map((r) => r.textContent)).toEqual(["TrueT", "FalseF"]);
    expect(tabStops(radios)).toEqual([0, -1]);
    expect(radios.every((r) => r.getAttribute("aria-checked") === "false")).toBe(true);
  });

  it("moves focus and the tab stop with arrow keys, Home and End", () => {
    const { radios } = mount();
    act(() => radios[0].focus());
    key(radios[0], "ArrowRight");
    expect(document.activeElement).toBe(radios[1]);
    expect(tabStops(radios)).toEqual([-1, 0]);
    key(radios[1], "ArrowDown");
    expect(document.activeElement).toBe(radios[0]);
    key(radios[0], "End");
    expect(document.activeElement).toBe(radios[1]);
    key(radios[1], "Home");
    expect(document.activeElement).toBe(radios[0]);
    expect(tabStops(radios)).toEqual([0, -1]);
  });

  it("picks with T, F, 1 and 2", () => {
    for (const [k, idx] of [["t", 0], ["F", 1], ["1", 0], ["2", 1]] as const) {
      const { onSubmit } = mount();
      key(document.body, k);
      expect(onSubmit).toHaveBeenCalledWith([idx]);
      act(() => root?.unmount());
    }
  });

  it("shows a visible focus ring on every option", () => {
    const { radios } = mount();
    for (const r of radios) expect(r.className).toMatch(/focus-visible:outline-2\b.*focus-visible:outline-ring/);
  });

  it("keeps the picked option focusable and checked after answering, and ignores further picks", () => {
    const { radios, onSubmit } = mount([1]);
    expect(radios[1].getAttribute("aria-checked")).toBe("true");
    expect(tabStops(radios)).toEqual([-1, 0]);
    expect(radios.every((r) => r.getAttribute("aria-disabled") === "true")).toBe(true);
    act(() => radios[0].click());
    key(document.body, "t");
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("ArrowDown then Enter or Space chooses and submits", () => {
    const a = mount();
    act(() => a.radios[0].focus());
    key(a.radios[0], "ArrowDown");
    expect(document.activeElement).toBe(a.radios[1]);
    key(a.radios[1], "Enter");
    expect(a.onSubmit).toHaveBeenCalledWith([1]);
    act(() => root?.unmount());
    document.body.innerHTML = "";
    const b = mount();
    act(() => b.radios[0].focus());
    key(b.radios[0], " ");
    expect(b.onSubmit).toHaveBeenCalledWith([0]);
  });
});
