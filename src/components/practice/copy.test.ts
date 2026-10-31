import { describe, expect, it } from "vitest";
import { unlockPhrase } from "./copy";

describe("unlockPhrase", () => {
  it("names what opens, with plurals", () => {
    expect(unlockPhrase({ questions: 3, prompts: 1 })).toBe("3 questions and 1 design prompt");
    expect(unlockPhrase({ questions: 1, prompts: 0 })).toBe("1 question");
    expect(unlockPhrase({ questions: 0, prompts: 2 })).toBe("2 design prompts");
  });

  it("still reads well when nothing new opens", () => {
    expect(unlockPhrase({ questions: 0, prompts: 0 })).toBe("the topics after it");
  });
});
