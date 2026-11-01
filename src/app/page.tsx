"use client";

import Link from "next/link";
import { useState, useSyncExternalStore } from "react";
import { AppBar } from "@/components/Hud";
import { Catalog } from "@/components/home/Catalog";
import { Hero } from "@/components/home/Hero";
import { Today, TodaySkeleton } from "@/components/home/Today";
import { usePlan } from "@/engine/plan-store";

const noop = () => () => {};

export default function Home() {
  const plan = usePlan();
  const mounted = useSyncExternalStore(noop, () => true, () => false);
  const [filtering, setFiltering] = useState(false);

  return (
    <>
      <AppBar />
      <main className="mx-auto w-full max-w-page px-4 py-8 text-base sm:py-12">
        {/* Until local progress is read we can't know if there's a plan: keep the full hero and a skeleton of the card. */}
        <Hero compact={mounted && !!plan} />

        {filtering ? null : mounted ? <Today plan={plan} /> : <TodaySkeleton />}

        <Catalog onFilteringChange={setFiltering} />

        <footer className="mt-12 border-t border-border pt-4 text-sm text-muted-foreground">
          <Link href="/credits" className="underline underline-offset-4 hover:text-foreground">
            Credits and licenses
          </Link>
        </footer>
      </main>
    </>
  );
}
