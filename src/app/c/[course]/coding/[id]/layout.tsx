import { Suspense } from "react";
import { PageSkeleton } from "@/components/shell/PageIntro";

/** Challenge ids are not prerendered, so the page reads them at request time inside this boundary. */
export default function CodingLayout({ children }: LayoutProps<"/c/[course]/coding/[id]">) {
  return <Suspense fallback={<PageSkeleton />}>{children}</Suspense>;
}
