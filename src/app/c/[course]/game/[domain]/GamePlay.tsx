"use client";

import { notFound, useParams } from "next/navigation";
import { SectionGame } from "@/components/three/games/SectionGame";
import { PageShell } from "@/components/ui";
import { useCourse } from "@/engine/course-context";

/** One section's mini game on its own page (linked from each world/stage on the map). */
export function GamePlay() {
  const { domain: domainId } = useParams<{ domain: string }>();
  const { domain: domainById } = useCourse();
  const domain = domainById[domainId];
  if (!domain) notFound();
  return (
    <PageShell title={domain.world} subtitle="A quick game with this section's words. Play as often as you like.">
      <SectionGame domainId={domain.id} />
    </PageShell>
  );
}
