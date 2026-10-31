import { describe, expect, it } from "vitest";
import { clearCard, readCard, readingKey, writeCard } from "./reading";

function memory() {
  const m = new Map<string, string>();
  return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), removeItem: (k: string) => void m.delete(k), m };
}

describe("reading position", () => {
  const key = readingKey("code-system-design", "t-queues");

  it("keys by course and lesson", () => {
    expect(key).toBe("cq-reading:code-system-design:t-queues");
  });

  it("round-trips a card index and clamps it to the lesson", () => {
    const s = memory();
    expect(readCard(s, key, 10)).toBe(0);
    writeCard(s, key, 4);
    expect(readCard(s, key, 10)).toBe(4);
    expect(readCard(s, key, 3)).toBe(2);
    writeCard(s, key, 0);
    expect(s.m.has(key)).toBe(false);
  });

  it("ignores junk and blocked storage, and clears", () => {
    const s = memory();
    s.setItem(key, "abc");
    expect(readCard(s, key, 10)).toBe(0);
    s.setItem(key, "3");
    clearCard(s, key);
    expect(readCard(s, key, 10)).toBe(0);
    const blocked = { getItem: () => { throw new Error("x"); }, setItem: () => { throw new Error("x"); }, removeItem: () => { throw new Error("x"); } };
    expect(readCard(blocked, key, 10)).toBe(0);
    expect(() => writeCard(blocked, key, 2)).not.toThrow();
  });
});
