import { SCENARIO_GAMES } from "@/engine/scenarios";
import type { DesignPrompt, Topic } from "@/engine/types";
import { scenariosFor } from "@/scenarios";
import { topicsForLesson } from "./topics";

const COURSE = "code-system-design";

/** This course's scenario games, each unlocked by the topics its lesson teaches. */
export function scenarioPrompts(topics: readonly Topic[]): DesignPrompt[] {
  return scenariosFor(COURSE).flatMap((item) => {
    const concepts = item.lesson ? topicsForLesson(topics, item.lesson).map((t) => t.id) : [];
    const game = SCENARIO_GAMES.find((g) => g.id === item.type);
    if (!concepts.length || !game) return [];
    return [{ id: `sc-${item.id}`, title: item.title, prompt: game.blurb, concepts, href: `/c/${COURSE}/scenarios/${item.type}`, linkLabel: `Play in ${game.name}` }];
  });
}

/** Code Quests lessons that go deeper on a system design topic, linked rather than copied. */
export const CODE_QUEST_LINKS: readonly DesignPrompt[] = [
  {
    id: "cq-ds-hashing",
    title: "How hashing spreads keys",
    prompt: "The hash function behind consistent hashing, from the Data Structures track.",
    concepts: ["t-chash"],
    href: "/c/code-data-structures/lesson/ds-hashing",
    linkLabel: "Open in Data Structures",
  },
  {
    id: "cq-ds-queue",
    title: "Queues, the data structure",
    prompt: "First in, first out: the idea every message queue builds on.",
    concepts: ["t-queues"],
    href: "/c/code-data-structures/lesson/ds-queue",
    linkLabel: "Open in Data Structures",
  },
  {
    id: "cq-node-backpressure",
    title: "Backpressure in Node.js streams",
    prompt: "What happens when a producer outruns its consumer, in code.",
    concepts: ["t-overload"],
    href: "/c/code-nodejs/lesson/d2-backpressure",
    linkLabel: "Open in Node.js",
  },
];
