"use client";

import type { ReactNode } from "react";
import { registerCatalog } from "./client";
import type { CourseSummary } from "./wire";

/**
 * Hands the server-rendered course summaries and content version to the client registry before
 * any child renders, so pages read the catalog synchronously and never fetch it.
 */
export function CatalogProvider({ courses, version, children }: { courses: CourseSummary[]; version: string; children: ReactNode }) {
  registerCatalog(courses, version);
  return children;
}
