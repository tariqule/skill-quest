"use client";

import Link from "next/link";

/** First-visit offer of the intro briefing. Skippable, never a redirect. */
export function IntroOffer({ show, href, onSkip }: { show: boolean; href: string; onSkip: () => void }) {
  if (!show) return null;
  return (
    <div role="region" aria-label="Course intro" className="mb-6 flex flex-wrap items-center gap-3 rounded-2xl border border-sky-400/40 bg-sky-400/10 p-4">
      <p className="min-w-0 flex-1 text-base text-slate-100">New here? A 2-minute intro shows how this course works and lets you set a daily goal.</p>
      <Link href={href} className="rounded-xl bg-sky-400 px-4 py-2 text-base font-black text-slate-950 hover:bg-sky-300">
        Take the intro
      </Link>
      <button type="button" onClick={onSkip} className="rounded-xl border border-white/20 px-4 py-2 text-base font-bold text-slate-200 hover:border-white/40">
        Skip
      </button>
    </div>
  );
}
