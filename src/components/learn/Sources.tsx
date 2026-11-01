import { Library } from "lucide-react";
import type { LessonSource } from "@/engine/types";

/** "Sources" footer under a lesson: where the material comes from, with its license. */
export function SourcesFooter({ sources }: { sources?: LessonSource[] }) {
  if (!sources?.length) return null;
  return (
    <aside aria-label="Sources" className="mt-4 max-w-[680px] rounded-card border border-border bg-card p-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-1.5 font-semibold text-foreground"><Library className="size-4" aria-hidden />Sources and further reading</div>
      <ul className="mt-1 grid gap-1">
        {sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4">
              {s.title}
            </a>{" "}
            <span className="text-muted-foreground">· {s.license}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
