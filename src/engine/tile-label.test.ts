import { describe, expect, it } from "vitest";
import { tileLabel } from "./path";

describe("tileLabel", () => {
  it("names icon-only map states", () => {
    expect(tileLabel({ type: "lesson", title: "Loops", state: "later" })).toBe("Loops (after the basics, open any time)");
    expect(tileLabel({ type: "lesson", title: "Loops", state: "done" })).toBe("Loops (done)");
    expect(tileLabel({ type: "quest", title: "Core trial", state: "open" })).toBe("Stage boss: Core trial");
  });
});
