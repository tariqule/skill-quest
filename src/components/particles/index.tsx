"use client";

import dynamic from "next/dynamic";

/**
 * The only entry points to particle code. Both are `next/dynamic` with `ssr: false`, so the canvas
 * engine lives in its own chunk: it never ships in a route's initial JS (bundle.test checks the
 * lesson, quiz and practice routes) and loads only when a hero or a celebration actually renders.
 */
export const HeroParticles = dynamic(() => import("./HeroField"), { ssr: false, loading: () => null });
export const CelebrationBurst = dynamic(() => import("./Burst"), { ssr: false, loading: () => null });
