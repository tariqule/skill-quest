"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { GraduationCap } from "lucide-react";
import { cn } from "@/lib/utils";

export const APP_NAME = "SkillQuest";

/** Shared sticky header frame: one look for home, Daily, Code and every course. */
export function HeaderFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className={cn("mx-auto flex h-14 max-w-page items-center gap-3 px-4", className)}>{children}</div>
    </header>
  );
}

/** The brand link. `compact` hides the word mark on small screens. */
export function BrandLink({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      href="/"
      className="flex min-h-11 shrink-0 items-center gap-2 rounded-md font-heading font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
      aria-label={`${APP_NAME} home`}
    >
      <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <GraduationCap className="size-5" aria-hidden />
      </span>
      <span className={cn(compact && "hidden sm:inline")}>{APP_NAME}</span>
    </Link>
  );
}

export const NAV = [
  { href: "/", label: "Courses", match: ["/", "/c", "/credits"] },
  { href: "/code", label: "Code", match: ["/code"] },
  { href: "/daily", label: "Practice", match: ["/daily", "/warmup"] },
] as const;

/** Which nav item is current for a path: every top-level route maps to one item. */
export function activeNav(path: string): string | null {
  const clean = path.split(/[?#]/)[0].replace(/\/+$/, "") || "/";
  const hit = NAV.find((n) => n.match.some((m) => (m === "/" ? clean === "/" : clean === m || clean.startsWith(`${m}/`))));
  return hit?.href ?? null;
}

/** Top bar outside a course: brand plus three plain-text destinations. */
export function AppBar() {
  const path = usePathname() ?? "/";
  const active = activeNav(path);
  return (
    <HeaderFrame>
      <BrandLink />
      <nav aria-label="Main" className="ml-auto flex items-center gap-1">
        {NAV.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            aria-current={active === n.href ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors duration-150 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring outline-none",
              active === n.href && "text-foreground underline decoration-primary decoration-2 underline-offset-8",
            )}
          >
            {n.label}
          </Link>
        ))}
      </nav>
    </HeaderFrame>
  );
}
