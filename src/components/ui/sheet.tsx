"use client";

import { Dialog as SheetPrimitive } from "@base-ui/react/dialog";
import type React from "react";
import { cn } from "@/lib/utils";

/**
 * Right-hand slide-over built on the Base UI Dialog (coss ui pattern).
 * Base UI owns the accessibility contract: focus moves into the popup on open, Tab is trapped,
 * Escape / backdrop / Close dismiss, and focus returns to the element that opened it.
 */
export const Sheet = SheetPrimitive.Root;
export const SheetTitle = SheetPrimitive.Title;
export const SheetClose = SheetPrimitive.Close;

const TABBABLE =
  'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),summary,[tabindex]:not([tabindex="-1"])';

/** Wraps Tab at the popup edges. Belt-and-braces over Base UI's focus guards, which can drop focus
 * to <body> when popup content re-renders between key presses. */
function wrapTab(event: React.KeyboardEvent<HTMLDivElement>): void {
  if (event.key !== "Tab") return;
  const items = Array.from(event.currentTarget.querySelectorAll<HTMLElement>(TABBABLE)).filter(
    (el) => !el.hasAttribute("data-base-ui-focus-guard") && el.getClientRects().length > 0,
  );
  if (items.length === 0) return;
  const first = items[0];
  const last = items[items.length - 1];
  const active = document.activeElement;
  if (event.shiftKey && (active === first || active === event.currentTarget)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && active === last) {
    event.preventDefault();
    first.focus();
  }
}

export function SheetPopup({ className, children, onKeyDown, ...props }: SheetPrimitive.Popup.Props): React.ReactElement {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Backdrop
        data-slot="sheet-backdrop"
        className="fixed inset-0 z-30 bg-background/70 backdrop-blur-sm transition-opacity duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none"
      />
      <SheetPrimitive.Popup
        data-slot="sheet-popup"
        className={cn(
          "fixed inset-y-0 right-0 z-30 flex w-full min-w-0 flex-col overflow-hidden bg-popover shadow-elevation-3 outline-none transition-transform duration-200 data-ending-style:translate-x-full data-starting-style:translate-x-full motion-reduce:transition-none sm:max-w-lg sm:border-l sm:border-border",
          className,
        )}
        onKeyDown={(event) => {
          wrapTab(event);
          onKeyDown?.(event);
        }}
        {...props}
      >
        {children}
      </SheetPrimitive.Popup>
    </SheetPrimitive.Portal>
  );
}
