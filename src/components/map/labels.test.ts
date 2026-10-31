import { describe, expect, it } from "vitest";
import { topicTileLabel } from "./labels";

const node = (state: Parameters<typeof topicTileLabel>[0]["state"], needs: { title: string }[] = []) =>
  ({ label: "1-2", topic: { title: "How a request travels" }, state, needs }) as Parameters<typeof topicTileLabel>[0];

describe("topicTileLabel", () => {
  it("speaks every state", () => {
    expect(topicTileLabel(node("done"))).toBe("1-2 How a request travels (done)");
    expect(topicTileLabel(node("current"))).toBe("1-2 How a request travels (start here)");
    expect(topicTileLabel(node("open"))).toBe("1-2 How a request travels");
    expect(topicTileLabel(node("locked", [{ title: "What is system design?" }]))).toBe("1-2 How a request travels (locked: finish What is system design? first)");
    expect(topicTileLabel(node("planned"))).toBe("1-2 How a request travels (coming soon)");
  });
});
