import { notFound } from "next/navigation";
import { Suspense } from "react";
import { DOMAINS, DOMAIN_BY_ID, isDomainId } from "@/data/domains";
import { QuestPlay } from "./QuestPlay";

export function generateStaticParams() {
  return DOMAINS.map((d) => ({ domain: d.id }));
}

export default function QuestPage({ params }: PageProps<"/quest/[domain]">) {
  return (
    <Suspense fallback={<main className="mx-auto w-full max-w-3xl px-4 py-10 text-slate-400">Loading quest…</main>}>
      <Quest params={params} />
    </Suspense>
  );
}

async function Quest({ params }: { params: PageProps<"/quest/[domain]">["params"] }) {
  const { domain } = await params;
  if (!isDomainId(domain)) notFound();
  return <QuestPlay domain={DOMAIN_BY_ID[domain]} />;
}
