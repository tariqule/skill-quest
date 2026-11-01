import { Suspense } from "react";
import { PageSkeleton } from "@/components/shell/PageIntro";

/** Prerendered for known params; any other value renders at request time inside this boundary. */
export default function Layout({ children }: LayoutProps<"/c/[course]/code-games/[game]">) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>;
}
