"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion, useWebGL } from "./hooks";


/*
 * Every scene is loaded on the client only, after hydration, so three.js never runs on the server
 * and stays out of the first page load. Without WebGL the `fallback` is shown instead.
 */
const BurstScene = dynamic(() => import("./Burst"), { ssr: false });

function Gate({ fallback = null, children }: { fallback?: ReactNode; children: ReactNode }) {
  return useWebGL() ? children : fallback;
}

/** One-shot 3D confetti that removes its canvas when it's done. Skipped for reduced motion. */
export function Burst3D({ count, fallback }: { count?: number; fallback?: ReactNode }) {
  const reduced = useReducedMotion();
  const [on, setOn] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setOn(false), 3800);
    return () => clearTimeout(t);
  }, []);
  if (reduced || !on) return null;
  return (
    <Gate fallback={fallback}>
      <BurstScene count={count} />
    </Gate>
  );
}
