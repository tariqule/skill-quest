import type { MapTopic, TopicState } from "@/engine/practice";

/** Accessible name for a topic tile, so states shown only as icons are spoken. */
export function topicTileLabel(node: Pick<MapTopic, "label" | "state" | "needs"> & { topic: { title: string } }): string {
  const name = `${node.label} ${node.topic.title}`;
  const state: TopicState = node.state;
  switch (state) {
    case "done":
      return `${name} (done)`;
    case "current":
      return `${name} (start here)`;
    case "open":
      return name;
    case "locked":
      return `${name} (locked: finish ${node.needs.map((n) => n.title).join(", ")} first)`;
    case "planned":
      return `${name} (coming soon)`;
    default:
      return state satisfies never;
  }
}
