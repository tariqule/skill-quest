import Link from "next/link";
import { ArrowRightIcon, CircleAlertIcon, CircleCheckIcon } from "lucide-react";
import { Bar } from "@/components/ui";
import { buttonVariants } from "@/components/ui/button";
import { BlockIcon } from "@/components/learn/block-icons";

export interface DomainResult {
  id: string;
  name: string;
  emoji: string;
  color: string;
  right: number;
  total: number;
  href: string;
}

/** Pass mark for a domain, matching the official "Meets competencies" band. */
export const DOMAIN_PASS = 0.7;

/** One card per domain: status in words + icon (not colour alone), a bar, and a clear next step. */
export function DomainReport({ results }: { results: DomainResult[] }) {
  return (
    <section aria-labelledby="domain-report">
      <h2 id="domain-report" className="mt-8 text-lg font-semibold text-foreground">
        Performance by domain
      </h2>
      <p className="text-sm text-muted-foreground">Like the official score report, this counts scored questions only.</p>
      <ul className="mt-3 grid gap-3">
        {results.map((d) => {
          const ratio = d.total ? d.right / d.total : 0;
          const ok = ratio >= DOMAIN_PASS;
          const Status = ok ? CircleCheckIcon : CircleAlertIcon;
          return (
            <li key={d.id} className="rounded-card border border-border bg-card p-4 sm:p-5">
              <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1">
                <span className="flex min-w-0 items-center gap-2 text-base font-semibold text-foreground">
                  <BlockIcon icon={d.emoji} className="size-5 shrink-0 text-muted-foreground" />
                  {d.name}
                </span>
                <span className={`inline-flex shrink-0 items-center gap-1.5 text-sm font-medium ${ok ? "text-success-foreground" : "text-warning-foreground"}`}>
                  <Status className="size-4" aria-hidden="true" />
                  {ok ? "Meets competencies" : "Needs improvement"}
                </span>
              </div>
              <div className="mt-3">
                <Bar value={ratio} color={d.color} />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-muted-foreground">
                  {d.right}/{d.total} correct
                </span>
                {!ok && (
                  <Link href={d.href} className={buttonVariants({ variant: "outline" })}>
                    Practise this world <ArrowRightIcon aria-hidden="true" />
                  </Link>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
