import Link from "next/link";
import { BlockIcon } from "@/components/learn/block-icons";

interface Props {
  /** The topic to finish, and where its lesson is. */
  finish: { title: string; href: string };
  /** What finishing it unlocks, already phrased ("3 questions and 1 design prompt"). */
  unlocks: string;
}

/** The next step in practice: "Finish X to unlock Y", linking to X's lesson. */
export function LockedTopic({ finish, unlocks }: Props) {
  return (
    <p className="rounded-xl border border-warning/30 bg-warning/10 px-4 py-3 text-foreground">
      <span aria-hidden="true"><BlockIcon icon="🔒" className="inline-block size-[1.1em] align-[-0.15em]" /> </span>
      Finish{" "}
      <Link href={finish.href} className="font-semibold text-warning-foreground underline">
        {finish.title}
      </Link>{" "}
      to unlock {unlocks}.
    </p>
  );
}
