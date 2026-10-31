import Link from "next/link";
import type { ComponentType, ReactNode } from "react";
import { ArrowLeft, type LucideProps } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

type Icon = ComponentType<LucideProps>;

/** Page title block for top-level pages (Daily, Warm-up): back link, icon heading, one-line purpose. */
export function PageIntro({ icon: Icon, title, children }: { icon: Icon; title: string; children: ReactNode }) {
  return (
    <div className="max-w-3xl">
      <Link href="/" className="inline-flex min-h-11 items-center gap-1 text-sm font-medium text-muted-foreground hover:text-foreground">
        <ArrowLeft className="size-4" aria-hidden />
        Home
      </Link>
      <h1 className="mt-1 flex items-center gap-3 font-heading text-h2 font-semibold tracking-tight text-foreground">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon className="size-5" aria-hidden />
        </span>
        {title}
      </h1>
      <p className="mt-2 max-w-[65ch] text-base text-muted-foreground">{children}</p>
    </div>
  );
}

export type NextAction = { href: string; label: string; icon: Icon; line?: string };

/**
 * Empty or finished state that always says what to do next: one primary action,
 * then up to two quiet alternatives. Never a blank page.
 */
export function NextSteps({ icon: Icon, title, line, primary, more = [] }: { icon: Icon; title: string; line: string; primary: NextAction; more?: NextAction[] }) {
  const P = primary.icon;
  return (
    <Card className="mt-6 max-w-3xl p-5 sm:p-6">
      <div className="flex items-start gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/15 text-success-foreground">
          <Icon className="size-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <h2 className="font-heading text-h4 font-semibold text-foreground">{title}</h2>
          <p className="mt-1 text-base text-muted-foreground">{line}</p>
        </div>
      </div>
      <Button size="xl" className="mt-5 w-full sm:w-auto" render={<Link href={primary.href} />}>
        <P aria-hidden />
        {primary.label}
      </Button>
      {more.length > 0 && (
        <ul className="mt-5 grid gap-2 border-t border-border pt-4 sm:grid-cols-2">
          {more.map((a) => {
            const I = a.icon;
            return (
              <li key={a.href}>
                <Link href={a.href} className="flex min-h-14 items-start gap-3 rounded-lg border border-border p-3 outline-none transition-colors duration-150 hover:bg-accent/40 focus-visible:ring-2 focus-visible:ring-ring">
                  <I className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden />
                  <span>
                    <span className="block text-base font-medium text-foreground">{a.label}</span>
                    <span className="block text-sm text-muted-foreground">{a.line}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </Card>
  );
}

export function PageSkeleton() {
  return (
    <div className="mt-6 max-w-3xl space-y-3 rounded-2xl border border-border p-5" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="mt-4 h-11 w-48" />
    </div>
  );
}
