import { redirect } from "next/navigation";

/** Old and guessed links use /learn/<id>; lessons live at /lesson/<id>. */
export default async function LearnRedirect({ params }: { params: Promise<{ course: string; id: string }> }) {
  const { course, id } = await params;
  redirect(`/c/${encodeURIComponent(course)}/lesson/${encodeURIComponent(id)}`);
}
