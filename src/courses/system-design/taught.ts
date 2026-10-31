import { CURRICULUM } from "./curriculum";
import { readerScreens, type TopicContent, type Visual } from "./schema";

/**
 * Named techniques and tools a quiz option might mention. An option, right or wrong, may only name
 * one of these if the topic or one of its prerequisites teaches it: a wrong option about something
 * never taught is a free elimination for anyone who notices it is unfamiliar, and a puzzle for
 * anyone who doesn't. Add a term when a new topic starts teaching it.
 */
export const OPTION_TERMS: readonly [string, RegExp][] = [
  ["idempotency", /idempoten/i],
  ["exactly-once", /exactly-once/i],
  ["dead-letter queue", /dead-letter/i],
  ["visibility timeout", /visibility timeout/i],
  ["min.insync.replicas", /min\.insync/i],
  ["ISR", /\bISR\b|in-sync replica/i],
  ["compaction", /compaction|compacted/i],
  ["tombstone", /tombstone/i],
  ["KRaft", /\bKRaft\b/],
  ["Raft", /\bRaft\b/],
  ["ZooKeeper", /zookeeper/i],
  ["service registry", /service registry/i],
  ["schema registry", /schema registry/i],
  ["Kubernetes", /kubernetes/i],
  ["Protobuf", /protobuf/i],
  ["Avro", /\bavro\b/i],
  ["HTTP/2", /HTTP\/2/],
  ["GraphQL", /graphql/i],
  ["gRPC", /\bgrpc\b/i],
  ["WebSocket", /websocket/i],
  ["server-sent events", /server-sent|\bSSE\b/i],
  ["JWT", /\bJWT/],
  ["OAuth", /oauth/i],
  ["signed URL", /signed URL/i],
  ["TLS", /\bTLS\b/],
  ["encryption at rest", /encryption at rest|encrypting the database disk/i],
  ["parameterized query", /parameteri[sz]ed/i],
  ["least privilege", /least privilege/i],
  ["watermark", /watermark/i],
  ["checkpoint", /checkpoint/i],
  ["MapReduce", /map ?reduce/i],
  ["materialized", /materiali[sz]ed/i],
  ["cursor pagination", /\bcursor\b/i],
  ["keyset pagination", /keyset/i],
  ["consumer lag", /consumer lag/i],
  ["rebalance", /rebalanc/i],
  ["circuit breaker", /circuit breaker/i],
  ["strangler fig", /strangler/i],
  ["sharding", /shard/i],
  ["consistent hashing", /consistent hashing|hash ring/i],
  ["CDN", /\bCDN\b/],
  ["TTL", /\bTTL\b/],
  ["quorum", /quorum/i],
  ["OLTP", /\bOLTP\b/],
  ["OLAP", /\bOLAP\b/],
  ["tumbling window", /tumbling/i],
  ["sliding window", /sliding window(?! log)/i],
  ["RabbitMQ", /rabbitmq/i],
  ["SQS", /\bSQS\b/],
  ["Flink", /\bflink\b/i],
  ["broker time", /broker time/i],
  ["commit time", /commit time/i],
  ["round robin", /round.robin/i],
  ["HEAD method", /^HEAD$/],
];

const OUTLINE = new Map(CURRICULUM.map((o) => [o.id, o]));

/** A topic and every topic it transitively depends on. */
export function prereqClosure(id: string): Set<string> {
  const out = new Set<string>();
  const visit = (t: string) => {
    if (out.has(t)) return;
    out.add(t);
    for (const p of OUTLINE.get(t)?.prereqs ?? []) visit(p);
  };
  visit(id);
  return out;
}

/** Everything a learner has read by the end of `id`: its cards and tip plus its prerequisites'. */
export function taughtText(id: string, topics: readonly TopicContent[]): string {
  const ids = prereqClosure(id);
  return topics
    .filter((t) => ids.has(t.id))
    .flatMap((t) => [...t.screens.flatMap(readerScreens), t.tip])
    .join(" ");
}

/** Options that name a technique the topic and its prerequisites never taught. */
export function untaughtOptions(topics: readonly TopicContent[], terms: readonly [string, RegExp][] = OPTION_TERMS): string[] {
  const out: string[] = [];
  for (const t of topics) {
    const taught = taughtText(t.id, topics);
    for (const q of [...t.quiz, ...t.practice]) {
      if (q.kind !== "mcq") continue;
      for (const o of q.options) for (const [label, re] of terms) if (re.test(o) && !re.test(taught)) out.push(`${q.id}: option "${o}" names ${label}, which ${t.id} and its prerequisites don't teach`);
    }
  }
  return out;
}

/** Every word a picture shows. */
export function visualText(v: Visual): string {
  switch (v.kind) {
    case "flow":
      return v.steps.map((s) => `${s.label} ${s.sub}`).join(" ");
    case "ladder":
      return [v.caption ?? "", ...v.rungs.map((r) => `${r.name} ${r.text}`)].join(" ");
    case "tiles":
      return v.tiles.map((t) => `${t.title} ${t.text}`).join(" ");
    case "code":
      return v.caption ?? "";
  }
}

/**
 * Pictures that name a term before the learner has read it. The topic picture sits above the first
 * card, so it may use what the prerequisites and that first card teach; a card's own picture may use
 * everything up to and including that card.
 */
export function untaughtPictures(topics: readonly TopicContent[], terms: readonly [string, RegExp][] = OPTION_TERMS): string[] {
  const out: string[] = [];
  for (const t of topics) {
    const before = [...prereqClosure(t.id)].filter((id) => id !== t.id);
    const prior = taughtTextOf(before, topics);
    const cards = t.screens.map((s) => readerScreens(s).join(" "));
    const pictures: [string, Visual, number][] = [["topic picture", t.visual, 0]];
    t.screens.forEach((s, i) => { if (s.kind === "idea" && s.visual) pictures.push([`card ${i + 1} picture`, s.visual, i]); });
    for (const [where, v, upTo] of pictures) {
      const known = `${prior} ${cards.slice(0, v.preview ? cards.length : upTo + 1).join(" ")} ${v.preview ? t.tip : ""}`;
      const shown = visualText(v);
      for (const [label, re] of terms) if (re.test(shown) && !re.test(known)) out.push(`${t.id} ${where} names ${label} before it is taught`);
    }
  }
  return out;
}

function taughtTextOf(ids: readonly string[], topics: readonly TopicContent[]): string {
  const set = new Set(ids);
  return topics.filter((t) => set.has(t.id)).flatMap((t) => [...t.screens.flatMap(readerScreens), t.tip]).join(" ");
}
