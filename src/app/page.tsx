"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";
import { AppBar } from "@/components/Hud";
import { Catalog } from "@/components/home/Catalog";
import { Today } from "@/components/home/Today";
import { Galaxy3D } from "@/components/three";
import { COURSES } from "@/courses";
import { usePlan } from "@/engine/plan-store";

const noop = () => () => {};
const WIDE = "(min-width: 768px)";

function useWide() {
  return useSyncExternalStore(
    (l) => {
      const m = window.matchMedia(WIDE);
      m.addEventListener("change", l);
      return () => m.removeEventListener("change", l);
    },
    () => window.matchMedia(WIDE).matches,
    () => false,
  );
}

export default function Home() {
  const router = useRouter();
  const plan = usePlan();
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const wide = useWide();

  return (
    <>
      <AppBar />
      <main className="mx-auto w-full max-w-5xl px-4 py-6 text-base sm:py-10">
        <section className="grid items-center gap-4 md:grid-cols-[1.4fr_1fr]">
          <div className="min-w-0">
            <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl">Get ready for your exam or interview.</h1>
            <p className="mt-2 max-w-xl text-base text-slate-300 sm:text-lg">
              Pick what&apos;s coming up and when. You get a few minutes of lessons, games and spaced reviews each day, plus a forecast of how ready you&apos;ll be.
            </p>
          </div>
          {/* The 3D galaxy is decoration: only on wider screens, loaded after hydration. */}
          {wide && (
            <div className="min-w-0">
              <Galaxy3D
                items={COURSES.map((c) => ({ id: c.id, label: c.shortTitle, icon: c.provider.icon, color: c.provider.color }))}
                onSelect={(id) => router.push(`/c/${id}`)}
                coreColor="#38bdf8"
                className="h-48 w-full lg:h-56"
              />
            </div>
          )}
        </section>

        {mounted ? <Today plan={plan} /> : <div className="mt-6 h-64 rounded-3xl bg-slate-900/40" aria-hidden />}

        <Catalog />

        <footer className="mt-12 border-t border-white/10 pt-4 text-sm text-slate-400">
          <Link href="/credits" className="underline hover:text-slate-200">
            Credits and licenses
          </Link>
        </footer>
      </main>
    </>
  );
}
