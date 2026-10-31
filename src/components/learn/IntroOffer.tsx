"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * First-visit offer of the intro briefing. Skippable, never a redirect.
 * Renders nothing on the server and during hydration, so a returning player never sees it flash
 * before saved progress is read from storage.
 */
export function IntroOffer({ show, href, onSkip }: { show: boolean; href: string; onSkip: () => void }) {
  const hydrated = useSyncExternalStore(noop, () => true, () => false);
  if (!hydrated || !show) return null;
  return (
    <div role="region" aria-label="Course intro" className="mb-6 flex flex-col gap-3 rounded-2xl border border-info/40 bg-info/10 p-4 sm:flex-row sm:items-center">
      <p className="min-w-0 flex-1 text-base text-foreground">New here? A 2-minute intro shows how this course works and lets you set a daily goal.</p>
      <div className="flex gap-2">
        <Button size="lg" className="flex-1 sm:flex-none" render={<Link href={href} />}>
          Take the intro
        </Button>
        <Button size="lg" variant="outline" onClick={onSkip}>
          Skip
        </Button>
      </div>
    </div>
  );
}
