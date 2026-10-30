// @vitest-environment jsdom
import { act, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { describe, expect, it, vi } from "vitest";
import { ScenarioPlay } from "./ScenarioPlay";
import { makeOnce } from "@/engine/scenario-progress";
import { SCENARIOS } from "@/scenarios";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
vi.mock("next/link", () => ({ default: ({ children, ...p }: { children: React.ReactNode }) => <a {...p}>{children}</a> }));

const all = Object.values(SCENARIOS).flat();
const byText = (root: HTMLElement, re: RegExp) => [...root.querySelectorAll("button")].find((b) => re.test(b.textContent ?? "")) as HTMLButtonElement | undefined;
const click = (el?: Element | null) => act(() => { (el as HTMLElement).click(); });

function mount(item: (typeof all)[number]) {
  const div = document.createElement("div");
  document.body.appendChild(div);
  const onResult = vi.fn();
  const onDone = vi.fn();
  const root = createRoot(div);
  act(() => root.render(<StrictMode><ScenarioPlay courseId="x" item={item} onResult={onResult} onDone={onDone} doneLabel="Next scenario" /></StrictMode>));
  return { div, onResult, onDone, root };
}

describe("ScenarioPlay records once when the result shows", () => {
  for (const game of ["architect", "matcher", "chain", "interview"] as const) {
    it(game, () => {
      const item = all.find((s) => s.type === game)!;
      const { div, onResult, onDone, root } = mount(item);
      const btn = (pred: (t: string) => boolean) => [...div.querySelectorAll("button")].find((x) => pred((x.textContent ?? "").trim()));
      if (item.type === "architect") {
        for (const slot of item.slots) {
          click(btn((t) => t.startsWith(slot.label)));
          const tile = item.tiles.find((t) => t.id === item.solutions[0][slot.id])!;
          click(btn((t) => t === tile.label));
        }
        click(byText(div, /^Check design/));
      } else if (item.type === "matcher") {
        for (const [l, r] of item.pairs) {
          click(btn((t) => t.includes(l) && t.includes("→")));
          click(btn((t) => t === r));
        }
        click(byText(div, /^Check matches/));
      } else if (item.type === "interview") {
        click(byText(div, /^Start the/));
        click(byText(div, /show the rubric/));
        expect(onResult).not.toHaveBeenCalled();
        for (let k = 0; k < item.rubric.length; k++) click([...div.querySelectorAll("button")].filter((x) => x.textContent === "Partly")[k]);
      } else {
        for (let guard = 0; guard < 40 && !byText(div, /Next scenario/); guard++) {
          const b = byText(div, /^(See how it went|Continue|Next decision)/i) ?? div.querySelector("[aria-label=Choices] button");
          if (!b) break;
          click(b);
        }
      }
      const next = byText(div, /Next scenario/);
      expect(next, div.textContent ?? "").toBeTruthy();
      expect(onResult).toHaveBeenCalledTimes(1);
      const share = onResult.mock.calls[0][0];
      expect(share).toBeGreaterThanOrEqual(0);
      expect(share).toBeLessThanOrEqual(1);
      click(next);
      click(next);
      expect(onResult).toHaveBeenCalledTimes(1);
      expect(onDone).toHaveBeenCalledWith(share);
      act(() => root.unmount());
    });
  }
});

describe("makeOnce", () => {
  it("runs once per key", () => {
    const once = makeOnce();
    const f = vi.fn();
    expect(once("a", f)).toBe(true);
    expect(once("a", f)).toBe(false);
    once("b", f);
    expect(f).toHaveBeenCalledTimes(2);
  });
});
