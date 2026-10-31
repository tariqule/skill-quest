import { Bar } from "../ui";

interface Props {
  covered: number;
  total: number;
  available: number;
  planned: number;
}

/** How much of the syllabus practice draws from: "Covers N of 48 topics" with a bar. */
export function PracticeCoverage({ covered, total, available, planned }: Props) {
  return (
    <section aria-labelledby="practice-coverage" className="rounded-2xl border border-white/10 bg-slate-900/60 p-5">
      <h2 id="practice-coverage" className="text-lg font-bold text-white">
        Covers {covered} of {total} topics
      </h2>
      <div role="progressbar" aria-valuemin={0} aria-valuemax={total} aria-valuenow={covered} aria-label="Topics covered" className="mt-3">
        <Bar value={total ? covered / total : 0} color="#2dd4bf" />
      </div>
      <p className="mt-2 text-sm text-slate-400">
        {available} question{available === 1 ? "" : "s"} unlocked. Practice only asks about topics you have finished.
        {planned > 0 && ` ${planned} topic${planned === 1 ? " is" : "s are"} still being written.`}
      </p>
    </section>
  );
}
