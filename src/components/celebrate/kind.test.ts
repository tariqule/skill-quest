import { describe, expect, it } from "vitest";
import type { CourseMap, MapTopic } from "@/engine/practice";
import { completionKind } from "./kind";

const t = (lesson: string | undefined, state: MapTopic["state"]) => ({ lesson, state }) as MapTopic;
const map = (topics: MapTopic[]) => ({ modules: [{ number: 1, title: "M", topics, done: 0 }], current: null, done: 0, total: 0 }) as CourseMap;

describe("completionKind", () => {
  it("is null unless this was a first-time finish", () => expect(completionKind(map([t("a", "done")]), "a", false)).toBeNull());
  it("is lesson for courses without a map", () => expect(completionKind(null, "a", true)).toBe("lesson"));
  it("is topic while the module has taught topics left", () => expect(completionKind(map([t("a", "done"), t("b", "current")]), "a", true)).toBe("topic"));
  it("is module once every taught topic is done (planned topics don't count)", () =>
    expect(completionKind(map([t("a", "done"), t("b", "done"), t(undefined, "planned")]), "b", true)).toBe("module"));
});
