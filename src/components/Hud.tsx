"use client";

import Link from "next/link";
import { levelInfo, useProgress, useToasts } from "@/lib/store";
import { Bar } from "./ui";

export function Hud() {
  const p = useProgress();
  const lvl = levelInfo(p.xp);
  const todayXp = p.today.xp;

  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-slate-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5">
        <Link href="/" className="flex items-center gap-2 font-bold text-white">
          <span className="text-xl">☁️</span>
          <span className="hidden sm:inline">AI Practitioner Quest</span>
        </Link>
        <div className="ml-auto flex items-center gap-3 sm:gap-5 text-sm">
          <span title="Day streak" className="font-semibold text-orange-300">
            🔥 {p.streak.count}
          </span>
          <span title="XP today vs daily goal" className="hidden sm:inline text-slate-300">
            🎯 {todayXp}/{p.dailyGoal}
          </span>
          <div className="w-28 sm:w-40">
            <div className="flex justify-between text-[11px] text-slate-400">
              <span className="font-semibold text-sky-300">Lv {lvl.level}</span>
              <span>{p.xp} XP</span>
            </div>
            <Bar value={lvl.into / lvl.needed} className="h-1.5" />
          </div>
        </div>
      </div>
    </header>
  );
}

export function Toaster() {
  const toasts = useToasts();
  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2">
      {toasts.map((t) => (
        <div key={t.id} className="toast-in flex items-start gap-3 rounded-xl border border-amber-300/30 bg-slate-900 p-3 shadow-2xl">
          <span className="text-2xl">{t.icon}</span>
          <div>
            <div className="font-semibold text-white">{t.title}</div>
            {t.body && <div className="text-sm text-slate-400">{t.body}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}
