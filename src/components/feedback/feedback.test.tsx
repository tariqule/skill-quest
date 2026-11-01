// @vitest-environment jsdom
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { AnswerFeedback, verdictText } from "./AnswerFeedback";
import { ChoiceOption, optionState } from "./ChoiceOption";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | null = null;
afterEach(() => {
  act(() => root?.unmount());
  document.body.innerHTML = "";
});

function render(node: React.ReactNode) {
  const div = document.createElement("div");
  document.body.appendChild(div);
  root = createRoot(div);
  act(() => root!.render(node));
  return div;
}

describe("verdictText", () => {
  it("frames a miss as learning, not failure", () => {
    expect(verdictText(true)).toBe("Correct");
    expect(verdictText(false)).toBe("Not quite");
  });
});

describe("AnswerFeedback", () => {
  it("shows the verdict, the why, and a link back to the lesson", () => {
    const div = render(
      <AnswerFeedback ok={false} note="It comes back sooner." concept={{ title: "Keycards", href: "/c/x/lesson/k" }}>
        Roles are borrowed.
      </AnswerFeedback>,
    );
    const section = div.querySelector("section")!;
    expect(section.dataset.verdict).toBe("wrong");
    expect(div.querySelector('[role="status"]')?.textContent).toBe("Not quite");
    expect(div.textContent).toContain("Why: Roles are borrowed.");
    expect(div.textContent).toContain("It comes back sooner.");
    // Gentle, not a warning box: neutral surface, amber only on the icon.
    expect(div.querySelector("section")!.className).toContain("bg-card");
    expect(div.querySelector("section")!.className).not.toContain("bg-warning");
    expect(div.querySelector("svg")!.getAttribute("class")).toContain("text-warning");
    const link = div.querySelector("a")!;
    expect(link.getAttribute("href")).toBe("/c/x/lesson/k");
    expect(link.textContent).toContain("Keycards");
    expect(link.className).toContain("min-h-11");
  });

  it("moves focus to the verdict so keyboard and screen-reader users land on it", () => {
    const div = render(<AnswerFeedback ok>Yes.</AnswerFeedback>);
    expect(document.activeElement).toBe(div.querySelector('[role="status"]'));
    expect(div.querySelector("section")!.dataset.verdict).toBe("correct");
  });

  it("toggles an inline concept through a real link and reports its state", () => {
    const onToggle = vi.fn();
    const div = render(<AnswerFeedback ok concept={{ title: "Roles", href: "/c/x/lesson/r", open: false, onToggle }} />);
    const btn = div.querySelector("a")!;
    expect(btn.getAttribute("href")).toBe("/c/x/lesson/r");
    expect(btn.textContent).toContain("Revisit the concept: Roles");
    expect(btn.getAttribute("aria-expanded")).toBe("false");
    act(() => btn.click());
    expect(onToggle).toHaveBeenCalledOnce();
  });
});

describe("optionState", () => {
  const s = (picked: boolean, right: boolean, locked: boolean, reveal = true) => optionState({ picked, right, locked, reveal });
  it("stays neutral while answering", () => {
    expect(s(false, true, false)).toBe("idle");
    expect(s(true, false, false)).toBe("picked");
  });
  it("marks right, wrong and the rest once locked", () => {
    expect(s(true, true, true)).toBe("right");
    expect(s(false, true, true)).toBe("right");
    expect(s(true, false, true)).toBe("wrong");
    expect(s(false, false, true)).toBe("dim");
  });
  it("hides the key when reveal is off", () => {
    expect(s(false, true, true, false)).not.toBe("right");
  });
});

describe("ChoiceOption", () => {
  it("labels right and wrong for screen readers, not by colour alone", () => {
    const div = render(
      <>
        <ChoiceOption state="right" onClick={() => {}}>A</ChoiceOption>
        <ChoiceOption state="wrong" onClick={() => {}}>B</ChoiceOption>
      </>,
    );
    const [a, b] = [...div.querySelectorAll("button")];
    expect(a.textContent).toMatch(/right answer/i);
    expect(b.textContent).toMatch(/your answer|wrong|incorrect/i);
  });
});
