"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, type ReactNode } from "react";
import { useReducedMotion, useWebGL } from "./hooks";

export type { GalaxyItem } from "./Galaxy";
export type { StageRing } from "./TrackCore";

/*
 * Every scene is loaded on the client only, after hydration, so three.js never runs on the server
 * and stays out of the first page load. Without WebGL the `fallback` is shown instead.
 */
const GalaxyScene = dynamic(() => import("./Galaxy"), { ssr: false });
const OrbScene = dynamic(() => import("./Orb"), { ssr: false });
const TrackCoreScene = dynamic(() => import("./TrackCore"), { ssr: false });
const BurstScene = dynamic(() => import("./Burst"), { ssr: false });

function Gate({ fallback = null, children }: { fallback?: ReactNode; children: ReactNode }) {
  return useWebGL() ? children : fallback;
}

type Props<T> = T & { fallback?: ReactNode };

export function Galaxy3D({ fallback, ...props }: Props<React.ComponentProps<typeof GalaxyScene>>) {
  return (
    <Gate fallback={fallback}>
      <GalaxyScene {...props} />
    </Gate>
  );
}

export function Orb3D({ fallback, ...props }: Props<React.ComponentProps<typeof OrbScene>>) {
  return (
    <Gate fallback={fallback}>
      <OrbScene {...props} />
    </Gate>
  );
}

export function TrackCore3D({ fallback, ...props }: Props<React.ComponentProps<typeof TrackCoreScene>>) {
  return (
    <Gate fallback={fallback}>
      <TrackCoreScene {...props} />
    </Gate>
  );
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
