import { describe, expect, it } from "vitest";
import { withQuestions } from "@/engine/define";
import { isUnlocked } from "@/engine/practice/gating";
import { TOPIC_CONTENT } from "../system-design/registry";
import d1 from "./domains/d1-scale";
import d2 from "./domains/d2-data";
import d3 from "./domains/d3-distributed";
import d4 from "./domains/d4-designs";
import { codeGames } from "./games";
import { LEGACY_RETAGS } from "./legacy-tags";
import { moreQuestions } from "./more";
import { auditTags } from "./tag-audit";
import { courseTopics, tagQuestions } from "./topics";

const topics = courseTopics(TOPIC_CONTENT);
/** Older questions with no tags in their source; PR 1 tagged these from their lesson. */
const legacy = withQuestions([d1, d2, d3, d4], [...moreQuestions, ...codeGames])
  .flatMap((m) => m.questions)
  .filter((q) => !q.concepts?.length);
const tagged = tagQuestions(legacy, topics);
const tagsOf = (id: string) => tagged.find((q) => q.id === id)?.concepts;

/**
 * Flagged by the audit and reviewed by hand: the current tag is right, or the better match is a
 * topic whose lesson isn't written yet (tagging it would hide the question). Remove an entry once
 * it stops being flagged; add one only after reading the question.
 */
const REVIEWED_EXCEPTIONS: Record<string, string> = {
  "sd-b1-01": "client and server roles: t-intro",
  "d1-02": "latency numbers estimate: t-estimation",
  "d1-08": "in-memory sessions break statelessness: t-scaling",
  "d1-14": "what a CDN is for: t-cdn",
  "d1-19": "app cache hit ratio: t-cache",
  "d1-21": "capacity planning for a launch: t-scaling",
  "d1-22": "cache freshness for your own edits: t-cache",
  "d1-23": "surviving a region loss: t-availability",
  "sd-ox-02": "app cache hit ratio maths: t-cache",
  "sd-out-02": "app cache hit rate: t-cache",
  "sd-b2-03": "defines replication: t-replication",
  "d2-05": "cost of an index: t-index",
  "d2-10": "read replicas: t-replication",
  "d2-23": "copying data to skip joins: t-denorm",
  "sd-ox-03": "quorum sizes: t-replication",
  "sd-b3-03": "idempotent actions, safe to retry: t-fault",
  "d3-07": "CAP: t-cap",
  "d3-10": "choosing C or A under partition: t-cap",
  "d3-11": "Raft majority: consensus lesson not written yet",
  "d3-12": "idempotency keys: t-api",
  "d3-15": "outbox: event-driven lesson not written yet",
  "d3-16": "outbox steps: event-driven lesson not written yet",
  "d3-17": "idempotent consumer: t-api",
  "d3-19": "token bucket: t-ratelimit",
  "d3-21": "rate limiter race: t-ratelimit",
  "d3-22": "distributed rate limiting: t-ratelimit",
  "sd-out-04": "quorum arithmetic: t-replication",
  "d4-22": "why feed caches hold post ids: t-design-feed-2 teaches the read side",
  "d4-23": "cutting a call chain: t-overload",
  "d4-16": "two writers handing out the same short code is a shortener bug, though it is a race: t-design-shortener",
  "sd-b3-01": "queue for slow resize jobs: t-queues",
  "d3-13": "idempotency key checked in the wrong place: t-api teaches the key",
  "sd-fx-05": "idempotency key insert: t-api teaches the key",
};

describe("legacy question tags", () => {
  it("every question flagged by the audit is retagged or a reviewed exception", () => {
    const flagged = auditTags(tagged, topics, TOPIC_CONTENT).map((f) => `${f.id}: [${f.tags}] < ${f.better.id}`);
    const unreviewed = flagged.filter((f) => !(f.split(":")[0] in REVIEWED_EXCEPTIONS));
    expect(unreviewed).toEqual([]);
  });

  it("the exception list has no stale entries", () => {
    const flagged = new Set(auditTags(tagged, topics, TOPIC_CONTENT).map((f) => f.id));
    expect(Object.keys(REVIEWED_EXCEPTIONS).filter((id) => !flagged.has(id))).toEqual([]);
  });

  it("retags point at real legacy questions and ready topics, so nothing is hidden for good", () => {
    const ready = new Set(topics.filter((t) => t.status === "ready").map((t) => t.id));
    for (const [id, tags] of Object.entries(LEGACY_RETAGS)) {
      expect(tagsOf(id), id).toEqual(tags);
      for (const t of tags) expect(ready.has(t), `${id} -> ${t}`).toBe(true);
    }
  });

  it("sharding arithmetic isn't served after only the replication lesson", () => {
    expect(tagsOf("sd-b2-04")).toEqual(["t-sharding"]);
    expect(isUnlocked(tagsOf("sd-b2-04"), new Set(["t-replication"]))).toBe(false);
    expect(isUnlocked(tagsOf("sd-b2-04"), new Set(["t-sharding"]))).toBe(true);
  });
});
