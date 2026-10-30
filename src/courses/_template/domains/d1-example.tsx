import { Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";

/**
 * One file per exam domain. Copy this file for each domain in the exam guide
 * and replace the example content. Ids must be unique across the course.
 */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "Example domain name from the exam guide",
    world: "The Example World",
    weight: 100,
    emoji: "🧪",
    color: "#38bdf8",
    summary: "One sentence on what this domain covers.",
  },

  tasks: [{ id: "1.1", title: "Task statement title", covers: ["What the exam guide lists under this task"] }],

  lessons: [
    // "Start here" lessons come first, with level "beginner": assume the reader has never heard of
    // the topic. Lead with an everyday analogy, then name the real thing. Each domain needs at least two.
    {
      id: "d1-start-what",
      level: "beginner",
      task: "1.1",
      title: "What this is, in everyday terms",
      visual: (
        <Tiles
          tiles={[
            { icon: "🏠", title: "Everyday version", text: "The familiar thing this works like" },
            { icon: "☁️", title: "The real thing", text: "What it's called and what it does" },
          ]}
        />
      ),
      points: ["Say what it is in one plain sentence.", "Give one example someone would recognise from daily life."],
      tip: "A friendly tip a beginner can use straight away.",
      check: ["d1-b-01", "d1-b-02"],
    },
    {
      id: "d1-start-first",
      level: "beginner",
      task: "1.1",
      title: "Your first step",
      visual: (
        <Flow
          steps={[
            { icon: "👋", label: "Start", sub: "Where you begin" },
            { icon: "🛠️", label: "Do", sub: "The first small action" },
            { icon: "🎉", label: "See", sub: "What you get" },
          ]}
        />
      ),
      points: ["Walk through the very first thing a newcomer does.", "Say what they should see when it works."],
      tip: "What to try next.",
      check: ["d1-b-03", "d1-b-04"],
    },
    {
      id: "d1-intro",
      task: "1.1",
      title: "A concept, explained with a picture",
      // Compose generic blocks from components/learn/blocks.tsx,
      // or build course-specific visuals and labs next to this folder.
      visual: (
        <div className="grid gap-4">
          <Flow
            steps={[
              { icon: "1️⃣", label: "First step", sub: "What happens here" },
              { icon: "2️⃣", label: "Second step", sub: "What happens next" },
              { icon: "3️⃣", label: "Result", sub: "What you get" },
            ]}
          />
          <Tiles
            tiles={[
              { icon: "✅", title: "Use when", text: "The situation this fits" },
              { icon: "🚫", title: "Avoid when", text: "The situation it doesn't fit" },
            ]}
          />
        </div>
      ),
      points: ["Key point one.", "Key point two."],
      tip: "An exam tip about this concept.",
      check: ["d1-01", "d1-02"],
    },
  ],

  questions: [
    // Beginner questions: level "beginner", choice / fill / output only, one clearly right answer,
    // and an explanation that teaches. At least four per domain.
    ...[1, 2, 3, 4].map((n) => ({
      id: `d1-b-0${n}`,
      domain: "d1",
      level: "beginner" as const,
      lesson: n <= 2 ? "d1-start-what" : "d1-start-first",
      prompt: `A gentle beginner question ${n}?`,
      options: ["The right answer", "A plausible mix-up", "Another plausible mix-up"],
      answer: [0],
      explanation: "Two or three friendly sentences that explain why, so the learner learns from the answer.",
    })),
    {
      id: "d1-01",
      domain: "d1",
      lesson: "d1-intro",
      prompt: "A multiple-choice question?",
      options: ["Correct answer", "Distractor A", "Distractor B", "Distractor C"],
      answer: [0],
      explanation: "Why the answer is right.",
    },
    {
      id: "d1-02",
      domain: "d1",
      lesson: "d1-intro",
      type: "order",
      prompt: "Put these steps in order.",
      items: ["First", "Second", "Third"],
      explanation: "Why this is the order.",
    },
    {
      id: "d1-03",
      domain: "d1",
      lesson: "d1-intro",
      type: "match",
      prompt: "Match each term to its meaning.",
      pairs: [
        ["Term A", "Meaning A"],
        ["Term B", "Meaning B"],
        ["Term C", "Meaning C"],
      ],
      explanation: "How the pairs fit.",
    },
  ],

  cards: [{ id: "d1-card", domain: "d1", kind: "concept", term: "Term A", definition: "Meaning A" }],
});
