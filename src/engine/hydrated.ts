"use client";

import { useSyncExternalStore } from "react";

const noop = () => () => {};

/**
 * False on the server and during hydration, true once the client has rendered. Progress lives in
 * localStorage, so anything showing it renders a neutral placeholder until this is true instead of
 * flashing the empty server snapshot ("Covers 0 of 48", "0 XP").
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(noop, () => true, () => false);
}
