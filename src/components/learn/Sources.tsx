import type { LessonSource } from "@/engine/types";

/** "Sources" footer under a lesson: where the material comes from, with its license. */
export function SourcesFooter({ sources }: { sources?: LessonSource[] }) {
  if (!sources?.length) return null;
  return (
    <aside aria-label="Sources" className="mt-4 rounded-xl border border-white/10 bg-slate-900/50 p-3 text-sm text-slate-300">
      <div className="font-bold text-slate-200">📚 Sources and further reading</div>
      <ul className="mt-1 grid gap-1">
        {sources.map((s) => (
          <li key={s.url}>
            <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sky-300 underline hover:text-sky-200">
              {s.title}
            </a>{" "}
            <span className="text-slate-400">· {s.license}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
