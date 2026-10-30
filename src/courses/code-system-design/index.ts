import { defineCourse, withQuestions } from "@/engine/define";
import { codeGames } from "./games";
import { moreQuestions } from "./more";
import d1 from "./domains/d1-scale";
import d2 from "./domains/d2-data";
import d3 from "./domains/d3-distributed";
import d4 from "./domains/d4-designs";

/**
 * System Design Interview Quest. Vendor-neutral: concepts are taught with
 * widely used examples (PostgreSQL, Redis, Kafka, Cassandra) rather than one cloud.
 */
export default defineCourse({
  id: "code-system-design",
  kind: "interview",
  category: "cs",
  tags: ["system design", "scalability", "caching", "sharding", "load balancing", "kafka", "rate limiting", "cap theorem"],
  provider: { id: "system-design", name: "System Design", color: "#2dd4bf", icon: "🏗️" },
  code: "SD",
  title: "System Design Interview Quest",
  shortTitle: "System Design",
  tagline: "Estimate, cache, shard, queue and stay up. Learn the building blocks and classic designs that senior and staff interviews ask about.",
  level: "Advanced",
  storageKey: "course:code-system-design:v1",

  domains: withQuestions([d1, d2, d3, d4], [...moreQuestions, ...codeGames]),

  exam: {
    questions: 30,
    unscored: 0,
    minutes: 45,
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "One best answer. Do the estimate, pick the part, or choose the trade-off that fits the requirements." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "The prompt says how many to pick. All of them must be right." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Put the steps of a request path, protocol, or migration in the order they happen." },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair every component, algorithm, or term with its job. Every pair must be right." },
      { id: "lines", icon: "🐞", name: "Bug hunt", rule: "Tap the line(s) in the config, schema, or pseudo-code that cause the problem. The prompt says how many." },
    ],
  },

  guide: {
    source: {
      label: "System design interview syllabus, based on widely used engineering references and official docs",
      version: "2026",
      date: "October 2026",
      url: "https://sre.google/books/",
    },
    facts: [
      { icon: "🗣️", value: "45–60", label: "minutes, one open problem", detail: "A typical round is one open question, like \"design a URL shortener\", talked through on a whiteboard or a shared doc." },
      { icon: "🧮", value: "Estimate", label: "before you draw", detail: "Interviewers expect quick rough numbers: requests per second, storage, bandwidth, and how many reads there are for each write." },
      { icon: "⚖️", value: "Trade-offs", label: "are the grade", detail: "There's rarely one right design. You're graded on naming the options and their costs, and saying why you chose one." },
      { icon: "🚀", value: "Senior+", label: "where it matters most", detail: "System design usually counts for more at senior and staff level, where you're expected to go deep on failures and on how a system grows." },
      { icon: "🧩", value: "4", label: "worlds in this track", detail: "Scale foundations, data at scale, distributed systems tools, and classic end-to-end designs." },
      { icon: "🎯", value: "70", label: "to pass the mock", detail: "The full mock is 30 questions in 45 minutes, scored 0 to 100. Score 70 or more to pass." },
    ],
    candidate: {
      is: [
        "Preparing for a backend, full-stack, or infrastructure interview with a system design round",
        "Comfortable building a web service and using a relational database",
        "Moving to senior or staff and expected to reason about scale, failure, and trade-offs",
        "Wanting real numbers and how things work, not just boxes and arrows",
      ],
      isNot: [
        "A specific cloud provider's product catalogue or certification",
        "Low-level object-oriented design, such as class diagrams and design patterns",
        "Machine learning system design",
        "Coding-round algorithms (see the Algorithms track)",
      ],
    },
    scope: {
      label: "Topics covered",
      groups: [
        { category: "Foundations", icon: "⛰️", services: ["Back-of-envelope estimates", "Latency numbers", "Little's Law", "Vertical and horizontal scaling", "Stateless services"] },
        { category: "Traffic", icon: "⚖️", services: ["L4 and L7 load balancing", "Balancing algorithms", "Health checks", "CDNs", "Cache-Control", "Rate limiting"] },
        { category: "Caching", icon: "⚡", services: ["Cache-aside", "Write-through", "Write-back", "TTL and eviction", "Cache stampede"] },
        { category: "Data", icon: "🗄️", services: ["SQL and NoSQL", "Indexes", "Keyset pagination", "Replication and lag", "Quorums", "Sharding", "Consistent hashing", "Hot keys"] },
        { category: "Distributed systems", icon: "🌐", services: ["Queues and streams", "Delivery semantics", "Kafka partitions", "CAP and PACELC", "Consensus", "Idempotency keys", "Transactional outbox"] },
        { category: "Reliability and designs", icon: "🏔️", services: ["API design", "SLOs and error budgets", "Retries, backoff, jitter", "Circuit breakers", "URL shortener", "News feed", "Chat"] },
      ],
    },
    tips: [
      { icon: "❓", tip: "Spend the first five minutes on requirements: what it must do, how big it gets, how fast and how consistent it must be, and what's out of scope." },
      { icon: "🧮", tip: "Estimate out loud and round hard. A day is about 100,000 seconds, so 1 million requests a day is about 12 a second." },
      { icon: "🗺️", tip: "Draw the simple path first: client, load balancer, service, database. Then scale the part your numbers say will break." },
      { icon: "⚖️", tip: "For every part, say what you gain, what it costs, and what you'd pick instead if the requirements were different." },
      { icon: "💥", tip: "Walk through failures: a server dies, a whole region dies, a dependency goes slow, a message arrives twice." },
      { icon: "🏛️", tip: "At staff level, talk about change over time: how you'd migrate, roll out and monitor, and what you'd hold off on until the numbers call for it." },
    ],
    officialPractice: { label: "Google SRE books (free online)", url: "https://sre.google/books/" },
  },

  cheatsheet: [
    {
      title: "Numbers",
      items: [
        ["1 day", "86,400 s ≈ 10⁵ s"],
        ["1 M req/day", "≈ 12 QPS average"],
        ["Memory / SSD / DC RTT", "~100 ns / ~100 µs / ~0.5 ms"],
        ["Cross-ocean RTT", "~100 ms"],
        ["99.9% / 99.99% per 30 days", "43.2 min / 4.3 min downtime"],
        ["Little's Law", "in-flight = rate × latency"],
        ["Base62", "62⁶ ≈ 56.8 B · 62⁷ ≈ 3.5 T"],
      ],
    },
    {
      title: "Caching",
      items: [
        ["Cache-aside", "Read: cache, then DB, then fill. Write: DB, then delete key"],
        ["Write-through", "Write cache + DB synchronously"],
        ["Write-back", "Ack from cache, flush later (risk of loss)"],
        ["Stampede", "Single-flight, early refresh, TTL jitter"],
        ["Cache-Control", "public · private · no-store · max-age · immutable"],
      ],
    },
    {
      title: "Data",
      items: [
        ["Composite index (a, b)", "Serves a, a + b; not b alone"],
        ["Pagination", "Keyset WHERE id < :last, not OFFSET"],
        ["Replicas", "Scale reads, not writes; handle lag with read-your-writes"],
        ["Quorum", "R + W > N"],
        ["hash % N → N + 1", "Most keys move; consistent hashing ~1/N"],
        ["Hot key", "Salt the key, cache it"],
      ],
    },
    {
      title: "Distributed",
      items: [
        ["Delivery", "At-least-once + idempotent consumer"],
        ["Kafka order", "Per partition; key by entity id"],
        ["Parallelism", "Consumers per group ≤ partitions"],
        ["CAP / PACELC", "Partition: availability or consistency · Else: latency or consistency"],
        ["Consensus", "2f + 1 nodes tolerate f failures"],
        ["Dual write", "Transactional outbox"],
      ],
    },
    {
      title: "Reliability",
      items: [
        ["Every call", "Timeout"],
        ["Retries", "≤ 3, exponential backoff + jitter, idempotent only"],
        ["Layers × retries", "Attempts multiply (3 layers × 3 = 27)"],
        ["Circuit breaker", "Closed → open → half-open → closed"],
        ["Serial deps", "Availability multiplies: 0.999⁴ ≈ 99.6%"],
        ["Alerts", "Page on symptoms and SLO burn rate"],
        ["Rate limited", "429 + Retry-After"],
      ],
    },
  ],

  config: {
    quest: { length: 8 },
    boss: { questions: 25, minutes: 30 },
    examModes: [
      { id: "full", name: "Full mock interview", icon: "🎤", questions: 30, unscored: 0, minutes: 45, full: true },
      { id: "quick", name: "Quick screen", icon: "⚡", questions: 15, unscored: 0, minutes: 20, full: false },
    ],
  },

  boss: { name: "The Thundering Herd Hydra", emoji: "🐉" },
  matchLabel: "system design building blocks",
  levelTitles: [
    "Napkin Scribbler",
    "QPS Counter",
    "Cache Keeper",
    "Load Balancer",
    "Replica Wrangler",
    "Shard Splitter",
    "Queue Tamer",
    "Quorum Keeper",
    "Failure Whisperer",
    "Planet-Scale Architect",
  ],
});
