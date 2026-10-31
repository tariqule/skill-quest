import Link from "next/link";
import type { DesignPrompt } from "@/engine/types";

/** Unlocked design prompts: scenario games and Code Quests lessons that go deeper. */
export function DesignPromptList({ prompts }: { prompts: readonly DesignPrompt[] }) {
  if (!prompts.length) return null;
  return (
    <section aria-labelledby="design-prompts" className="mt-8">
      <h2 id="design-prompts" className="text-lg font-bold text-white">
        Go further
      </h2>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2">
        {prompts.map((d) => (
          <li key={d.id} className="rounded-xl border border-white/10 bg-slate-900/60 p-4">
            <div className="font-semibold text-white">{d.title}</div>
            <p className="mt-1 text-sm text-slate-400">{d.prompt}</p>
            <Link href={d.href} className="mt-2 inline-block text-sm font-semibold text-sky-300 underline">
              {d.linkLabel}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
