import Link from "next/link";

interface Props {
  /** The topic to finish, and where its lesson is. */
  finish: { title: string; href: string };
  /** What finishing it unlocks, already phrased ("3 questions and 1 design prompt"). */
  unlocks: string;
}

/** The next step in practice: "Finish X to unlock Y", linking to X's lesson. */
export function LockedTopic({ finish, unlocks }: Props) {
  return (
    <p className="rounded-xl border border-amber-300/30 bg-amber-400/10 px-4 py-3 text-slate-200">
      <span aria-hidden="true">🔒 </span>
      Finish{" "}
      <Link href={finish.href} className="font-semibold text-amber-200 underline">
        {finish.title}
      </Link>{" "}
      to unlock {unlocks}.
    </p>
  );
}
