import { defineCourse } from "@/engine/define";
import d1 from "./domains/d1-example";

/**
 * Starter for a new course (GCP, Azure, Kubernetes, …).
 *
 * 1. Copy this folder to src/courses/<course-id>/.
 * 2. Fill in the metadata below from the official exam guide.
 * 3. Add one file per domain under ./domains (see d1-example.tsx).
 * 4. Register the course in src/courses/index.ts.
 * 5. Run `npm test` to validate the content.
 *
 * This template is not registered, so it never appears in the app.
 */
export default defineCourse({
  id: "template",
  provider: { id: "provider", name: "Provider", color: "#38bdf8", icon: "☁️" },
  code: "CODE-01",
  title: "Certification title",
  shortTitle: "Short title",
  tagline: "One line on who this certification is for.",
  level: "Foundational",
  storageKey: "course:template:v1",

  domains: [d1],

  exam: {
    questions: 60,
    unscored: 0,
    minutes: 90,
    // Percentage-scored exams can use { min: 0, max: 100, pass: 66 }.
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "1 correct answer." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "Choose all that apply." },
      // Mark formats the real exam doesn't use as practiceOnly; the simulator skips them.
      { id: "order", icon: "🔢", name: "Ordering", rule: "Put the steps in order.", practiceOnly: true },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair each item with its answer.", practiceOnly: true },
    ],
  },

  guide: {
    source: { label: "Official exam guide", version: "1.0", date: "Month Year", url: "https://example.com/exam-guide" },
    facts: [{ icon: "📝", value: "60", label: "questions", detail: "Details from the exam guide." }],
    candidate: { is: ["Who the exam is for"], isNot: ["What is out of scope"] },
    scope: { label: "In-scope services", groups: [{ category: "Category", icon: "🧰", services: ["Service A", "Service B"] }] },
    tips: [{ icon: "💡", tip: "A test-taking tip." }],
  },

  cheatsheet: [{ title: "Section", items: [["Term", "One-line definition"]] }],

  // Any game setting can be overridden; see engine/config.ts for the full list.
  // These are sized for the 3-question example; raise them as the bank grows.
  config: {
    quest: { length: 3 },
    boss: { questions: 3, minutes: 5 },
    examModes: [{ id: "full", name: "Full simulation", icon: "🏛️", questions: 1, unscored: 0, minutes: 5, full: true }],
  },
  // Pick which training-deck modes to offer (default: all of them).
  modes: ["review", "flashcards", "lightning", "boss", "cheatsheet"],
});
