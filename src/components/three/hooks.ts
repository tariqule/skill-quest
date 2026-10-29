"use client";

import { useSyncExternalStore } from "react";

let webgl: boolean | null = null;

/** Whether this browser can create a WebGL context (checked once, then cached). */
function detectWebGL() {
  if (webgl === null) {
    try {
      const c = document.createElement("canvas");
      webgl = !!(c.getContext("webgl2") || c.getContext("webgl"));
    } catch {
      webgl = false;
    }
  }
  return webgl;
}

const noop = () => () => {};

/** False on the server and before hydration, then whether WebGL is available. */
export function useWebGL() {
  return useSyncExternalStore(noop, detectWebGL, () => false);
}

const REDUCED = "(prefers-reduced-motion: reduce)";

function subscribeReduced(cb: () => void) {
  const mq = window.matchMedia(REDUCED);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** True when the player asked the OS for less motion. 3D scenes then render a still frame. */
export function useReducedMotion() {
  return useSyncExternalStore(subscribeReduced, () => window.matchMedia(REDUCED).matches, () => false);
}

const COARSE = "(pointer: coarse)";

function subscribeCoarse(cb: () => void) {
  const mq = window.matchMedia(COARSE);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
}

/** True on touch-first devices (phones, tablets), where there is no hover and drags should scroll. */
export function useCoarsePointer() {
  return useSyncExternalStore(subscribeCoarse, () => window.matchMedia(COARSE).matches, () => false);
}

/** Cheap deterministic pseudo-random so scenes render the same every time. */
export function rand(seed: number) {
  const x = Math.sin(seed * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
}
