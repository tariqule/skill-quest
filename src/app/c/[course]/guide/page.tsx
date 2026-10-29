import type { Metadata } from "next";
import { GuideContent } from "@/components/Guide";
import { PageShell } from "@/components/ui";

export const metadata: Metadata = { title: "Study guide · Cert Quest" };

export default function GuidePage() {
  return (
    <PageShell title="📖 Study guide" subtitle="Everything about the exam in one place. Open it anytime with the Guide button or the ? key.">
      <GuideContent />
    </PageShell>
  );
}
