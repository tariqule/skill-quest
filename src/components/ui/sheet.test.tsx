// @vitest-environment jsdom
import { act, useState } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, describe, expect, it } from "vitest";
import { Sheet, SheetClose, SheetPopup, SheetTitle } from "./sheet";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

let root: Root | null = null;
afterEach(() => {
  act(() => root?.unmount());
  document.body.innerHTML = "";
});

/** Mirrors the Guide: an external store opens the sheet, not a Dialog.Trigger. */
function Harness() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>Guide</button>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetPopup aria-label="Study guide">
          <SheetTitle>Study guide</SheetTitle>
          <a href="#full">Full page</a>
          <SheetClose aria-label="Close guide">x</SheetClose>
        </SheetPopup>
      </Sheet>
    </>
  );
}

const settle = () => act(async () => { for (let i = 0; i < 5; i++) await new Promise((r) => setTimeout(r, 20)); });
const trigger = () => document.querySelector<HTMLButtonElement>("button")!;
const dialog = () => document.querySelector<HTMLElement>('[role="dialog"]');

async function openSheet() {
  const host = document.createElement("div");
  document.body.append(host);
  root = createRoot(host);
  act(() => root!.render(<Harness />));
  trigger().focus();
  act(() => trigger().click());
  await settle();
}

describe("Sheet (Guide dialog)", () => {
  it("moves focus inside the dialog on open", async () => {
    await openSheet();
    expect(dialog()).not.toBeNull();
    expect(dialog()!.contains(document.activeElement)).toBe(true);
  });

  it("is modal: the rest of the page is hidden from assistive tech and focus", async () => {
    await openSheet();
    expect(dialog()!.getAttribute("aria-modal") ?? "true").toBe("true");
  });

  it("closes on Escape and returns focus to the Guide button", async () => {
    await openSheet();
    act(() => {
      document.activeElement!.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    await settle();
    expect(dialog()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });

  it("closes on the X button and returns focus to the Guide button", async () => {
    await openSheet();
    act(() => document.querySelector<HTMLButtonElement>('[aria-label="Close guide"]')!.click());
    await settle();
    expect(dialog()).toBeNull();
    expect(document.activeElement).toBe(trigger());
  });
});
