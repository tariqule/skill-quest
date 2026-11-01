"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { setGuideOpen, useGuideOpen } from "@/engine/ui-state";

// The drawer (Base UI Dialog + guide content) stays out of every route's initial JS; it is fetched on first open.
const GuideDrawer = dynamic(() => import("./Guide").then((m) => m.GuideDrawer), { ssr: false });

function isTextField(t: EventTarget | null): boolean {
  if (!(t instanceof HTMLElement)) return false;
  return t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.tagName === "SELECT" || t.isContentEditable;
}

/** Owns the global "?" shortcut and mounts the guide drawer once it is first opened (kept mounted afterwards
 * so the close transition and focus return still run). */
export function GuideDrawerGate() {
  const open = useGuideOpen();
  const [requested, setRequested] = useState(open);
  if (open && !requested) setRequested(true);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "?" && !isTextField(e.target)) setGuideOpen(!open);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return requested ? <GuideDrawer /> : null;
}
