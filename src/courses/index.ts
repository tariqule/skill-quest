import type { Course, PlannedCourse } from "@/engine/types";
import awsAifC01 from "./aws-aif-c01";

/**
 * The course registry. To add a course: copy src/courses/_template to a new
 * folder, fill in its domains, and add it to COURSES. Nothing else changes.
 */
export const COURSES: Course[] = [awsAifC01];

/** Shown in the catalog as "coming soon" until a course folder exists. */
export const PLANNED: PlannedCourse[] = [
  {
    id: "gcp-genai-leader",
    provider: { id: "gcp", name: "Google Cloud", color: "#4285f4", icon: "🔷" },
    code: "GAIL",
    title: "Google Cloud Generative AI Leader",
    tagline: "Generative AI strategy and Google Cloud's AI offerings for business leaders.",
    level: "Foundational",
  },
  {
    id: "azure-ai-900",
    provider: { id: "azure", name: "Microsoft Azure", color: "#0ea5e9", icon: "🟦" },
    code: "AI-900",
    title: "Azure AI Fundamentals",
    tagline: "Core AI and machine learning concepts and the Azure AI services that deliver them.",
    level: "Foundational",
  },
  {
    id: "cncf-kcna",
    provider: { id: "cncf", name: "Kubernetes", color: "#326ce5", icon: "☸️" },
    code: "KCNA",
    title: "Kubernetes and Cloud Native Associate",
    tagline: "Kubernetes fundamentals, container orchestration, and the cloud native ecosystem.",
    level: "Associate",
  },
];

const BY_ID = new Map(COURSES.map((c) => [c.id, c]));

export function getCourse(id: string): Course | undefined {
  return BY_ID.get(id);
}
