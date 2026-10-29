import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { TokenBucketLab } from "../labs";
import { CapVisual } from "../visuals";

/** Domain 3: queues and streams, consistency models, idempotency and the outbox, rate limiting. */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Distributed Systems Toolkit",
    world: "The Consistency Canyon",
    weight: 25,
    emoji: "🏜️",
    color: "#f472b6",
    summary: "Queues and streams, CAP and PACELC, retries that are safe because operations are idempotent, and rate limiters that keep everyone honest.",
  },

  tasks: [
    { id: "3.1", title: "Decouple with queues and streams", covers: ["work queues vs logs", "delivery semantics", "partitions, ordering, consumer groups", "DLQs and backpressure"] },
    { id: "3.2", title: "Reason about consistency", covers: ["CAP", "PACELC", "consistency models", "consensus and quorums"] },
    { id: "3.3", title: "Make operations safe to retry", covers: ["idempotent HTTP methods", "idempotency keys", "the dual-write problem", "transactional outbox"] },
    { id: "3.4", title: "Rate limit", covers: ["token and leaky bucket", "fixed and sliding windows", "429 and Retry-After", "distributed limiters"] },
  ],

  lessons: [
    {
      id: "d3-queues",
      level: "intermediate",
      task: "3.1",
      title: "Queues and streams",
      check: ["d3-01", "d3-03"],
      visual: (
        <div className="grid gap-3">
          <Flow
            color="#f472b6"
            steps={[
              { icon: "📤", label: "Producer", sub: "Upload API enqueues a job and returns 202" },
              { icon: "📬", label: "Queue / topic", sub: "Buffers bursts durably" },
              { icon: "⚙️", label: "Consumers", sub: "Process at their own pace, ack when done" },
              { icon: "🪦", label: "Dead-letter queue", sub: "Messages that failed too many times" },
            ]}
          />
          <Tiles
            tiles={[
              { icon: "📬", title: "Work queue (SQS, RabbitMQ)", text: "Each message goes to one consumer and is deleted once acknowledged. Great for background jobs.", color: "#f472b6" },
              { icon: "📜", title: "Log / stream (Kafka, Kinesis)", text: "Append-only, retained, split into ordered partitions. Many consumer groups each read at their own offset; replayable.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Queues decouple producers from consumers: absorb bursts, retry failures, and let each side scale and fail independently.",
        "Most brokers give at-least-once delivery: a message can arrive twice, so consumers must be idempotent.",
        "Kafka orders messages only within a partition. Use a message key (e.g. order_id) so related events land in the same partition.",
        "Parallelism within one consumer group is capped by the partition count. Watch consumer lag and apply backpressure when it grows.",
      ],
      tip: "When you add a queue, say what happens on failure: retries with backoff, a visibility timeout or ack deadline longer than processing time, and a DLQ.",
    },
    {
      id: "d3-cap",
      level: "senior",
      task: "3.2",
      title: "CAP, PACELC and consistency models",
      check: ["d3-07", "d3-08"],
      visual: (
        <div className="grid gap-3">
          <CapVisual />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🔒", title: "Strong / linearizable", text: "Every read sees the latest write, as if there were one copy.", color: "#60a5fa" },
              { icon: "🪞", title: "Read-your-writes", text: "You always see your own writes; others may lag.", color: "#2dd4bf" },
              { icon: "🌊", title: "Eventual", text: "If writes stop, replicas converge. Reads may be stale meanwhile.", color: "#f472b6" },
            ]}
          />
        </div>
      ),
      points: [
        "CAP: when a network partition happens, a replicated system must choose between consistency (refuse or block) and availability (answer, possibly stale).",
        "Partitions are not optional in real networks, so the real choice is CP vs AP behaviour during one.",
        "PACELC adds: Else (no partition), choose Latency or Consistency. Waiting for more replicas is slower but more consistent.",
        "Consensus protocols (Raft, Paxos) need a majority, which is why clusters have odd sizes: 3 tolerate 1 failure, 5 tolerate 2.",
      ],
      tip: "Pick consistency per feature, not per system: \"balances are CP, like counts are AP\" shows judgement.",
    },
    {
      id: "d3-idempotency",
      level: "senior",
      task: "3.3",
      title: "Idempotency and the outbox",
      check: ["d3-12", "d3-13"],
      visual: (
        <div className="grid gap-3">
          <CodeBlock
            lang="text"
            caption="The client generates one key per logical operation and resends it on every retry."
            code={`POST /payments
Idempotency-Key: 6f1c2e8a-91b4-4c1e-9d0a-2b7f3c5e8d11
{ "amount": 4200, "currency": "EUR" }

→ first time: process, store (key → response), return 201
→ retry with the same key: return the stored 201, charge nothing`}
          />
          <CodeCompare
            lang="text"
            left={{ title: "Dual write: can diverge", code: `db.commit(order)
broker.publish(OrderPlaced)  // crash here →
                             // event lost` }}
            right={{ title: "Transactional outbox", code: `BEGIN
  INSERT order
  INSERT outbox(event)
COMMIT
relay: outbox → broker (at-least-once)` }}
          />
        </div>
      ),
      points: [
        "An operation is idempotent if doing it twice has the same effect as doing it once. GET, PUT and DELETE are idempotent by HTTP's definition; POST is not.",
        "Idempotency keys make non-idempotent operations safe to retry: check and record the key atomically before doing the work.",
        "Writing to a database and a broker separately (dual write) can leave them inconsistent. The outbox pattern writes the event in the same transaction and relays it later.",
        "\"Exactly-once\" in practice means at-least-once delivery plus idempotent (deduplicating) processing.",
      ],
      tip: "Whenever you say \"retry\", say \"and it's safe because…\". Retries without idempotency are how people get charged twice.",
    },
    {
      id: "d3-rate-limit",
      level: "intermediate",
      task: "3.4",
      title: "Rate limiting",
      check: ["d3-18", "d3-19"],
      visual: (
        <div className="grid gap-3">
          <TokenBucketLab />
          <CodeBlock
            lang="text"
            caption="Tell clients when to come back."
            code={`HTTP/1.1 429 Too Many Requests
Retry-After: 30`}
          />
        </div>
      ),
      points: [
        "Rate limits protect services from overload and abuse and enforce fair use per user, API key or IP.",
        "Token bucket: capacity sets the allowed burst, refill rate sets the sustained rate. Leaky bucket smooths output to a constant rate.",
        "Fixed windows are cheap but allow double bursts at window edges; sliding windows (log or weighted counters) are smoother.",
        "In a distributed limiter the counter must be shared and updated atomically, e.g. Redis INCR or a Lua script.",
      ],
      tip: "Clarify the key (user, API key, IP), the limit, what happens when exceeded (429 + Retry-After), and whether to fail open or closed if the limiter's store is down.",
    },
  ],

  questions: [
    {
      id: "d3-01",
      domain: "d3",
      lesson: "d3-queues",
      level: "junior",
      prompt: "Users upload videos that take minutes to transcode. Why put a queue between the upload API and the transcoders?",
      options: [
        "The API can respond immediately while workers process jobs at their own pace, absorbing bursts and retrying failures",
        "Queues make transcoding itself faster",
        "Queues guarantee each video is processed exactly once with no extra work",
        "It removes the need to store the uploaded file",
      ],
      answer: [0],
      explanation: "The queue decouples the fast request path from slow work. Workers scale independently and failed jobs can be retried; duplicates are still possible, so jobs should be idempotent.",
    },
    {
      id: "d3-02",
      domain: "d3",
      lesson: "d3-queues",
      level: "intermediate",
      type: "match",
      prompt: "Match each messaging term to its meaning.",
      pairs: [
        ["At-most-once", "Never redelivered, so a crash can lose the message"],
        ["At-least-once", "Redelivered until acknowledged, so duplicates are possible"],
        ["Effectively-once", "At-least-once delivery plus idempotent processing"],
        ["Dead-letter queue", "Where messages go after failing too many times"],
      ],
      explanation: "Brokers trade loss against duplication. Most systems choose at-least-once and make consumers idempotent, parking poison messages in a DLQ for inspection.",
    },
    {
      id: "d3-03",
      domain: "d3",
      lesson: "d3-queues",
      level: "intermediate",
      type: "lines",
      prompt: "Every transcode job runs several times and many end up in the dead-letter queue. Tap the misconfigured line.",
      code: `queue: video-transcode
visibility_timeout_seconds: 30
max_receive_count: 5
dead_letter_queue: video-transcode-dlq
worker:
  concurrency: 8
  typical_job_seconds: 240`,
      codeLang: "yaml",
      answer: [2],
      explanation: "A job takes ~4 minutes but becomes visible again after 30 s, so other workers pick it up while it's still running; after 5 receives it's dead-lettered. Make the timeout longer than the processing time (or extend it with heartbeats).",
    },
    {
      id: "d3-04",
      domain: "d3",
      lesson: "d3-queues",
      level: "intermediate",
      prompt: "How many consumers in the group actually receive messages?",
      code: `topic: orders
partitions: 6
consumer_group: billing
consumers_in_group: 8`,
      codeLang: "yaml",
      options: ["6, and 2 sit idle", "8, sharing partitions evenly", "1, the group leader", "4, because consumers pair up"],
      answer: [0],
      explanation: "In Kafka each partition is assigned to exactly one consumer in a group, so at most 6 consumers can be busy. To scale further, add partitions.",
    },
    {
      id: "d3-05",
      domain: "d3",
      lesson: "d3-queues",
      level: "senior",
      prompt: "OrderCreated, OrderPaid and OrderShipped events for the same order must be processed in order, at high throughput. What do you do with Kafka?",
      options: [
        "Use order_id as the message key so all events of one order go to the same partition",
        "Use a single partition for the whole topic",
        "Use a random key so load spreads evenly",
        "Sort events by timestamp in every consumer",
      ],
      answer: [0],
      explanation: "Kafka guarantees order within a partition, and the key decides the partition. Keying by order_id keeps each order ordered while different orders spread across partitions. One partition would serialise everything.",
    },
    {
      id: "d3-06",
      domain: "d3",
      lesson: "d3-queues",
      level: "senior",
      prompt: "Consumer lag keeps growing during peaks: producers are faster than consumers. Which two responses are sound? (Choose two.)",
      options: [
        "Scale out consumers, up to the partition count (and add partitions if needed)",
        "Alert on lag and apply backpressure: slow or shed producers, or degrade non-critical work",
        "Acknowledge messages before processing them so consumers go faster",
        "Delete the oldest messages whenever lag is high",
      ],
      answer: [0, 1],
      explanation: "Either raise consumer throughput or reduce inflow. Acking early turns failures into silent data loss, and deleting messages loses work.",
    },
    {
      id: "d3-07",
      domain: "d3",
      lesson: "d3-cap",
      level: "junior",
      prompt: "According to the CAP theorem, what must a replicated system choose between when a network partition happens?",
      options: [
        "Consistency and availability",
        "Consistency and partition tolerance, while availability is always kept",
        "Latency and throughput",
        "SQL and NoSQL",
      ],
      answer: [0],
      explanation: "During a partition a node can either refuse requests it can't serve consistently (CP) or answer with possibly stale data (AP). Without a partition, both are achievable.",
    },
    {
      id: "d3-08",
      domain: "d3",
      lesson: "d3-cap",
      level: "senior",
      prompt: "What does PACELC add to CAP?",
      options: [
        "Even with no partition, there's a trade-off between latency and consistency",
        "Partitions can be avoided with better hardware",
        "Availability matters only for writes",
        "Consensus is impossible in asynchronous networks",
      ],
      answer: [0],
      explanation: "If Partition: Availability vs Consistency; Else: Latency vs Consistency. Waiting for more replicas to confirm makes every request slower, even on a healthy day.",
    },
    {
      id: "d3-09",
      domain: "d3",
      lesson: "d3-cap",
      level: "intermediate",
      type: "match",
      prompt: "Match each consistency model to its promise.",
      pairs: [
        ["Linearizable", "Every read returns the most recent completed write, as if there were one copy"],
        ["Read-your-writes", "A user always sees their own earlier writes"],
        ["Monotonic reads", "A user never sees data go back in time between reads"],
        ["Eventual", "Replicas converge once writes stop; reads may be stale meanwhile"],
      ],
      explanation: "These sit on a spectrum from strongest (linearizable) to weakest (eventual). The session guarantees in the middle often give users what they need at lower cost.",
    },
    {
      id: "d3-10",
      domain: "d3",
      lesson: "d3-cap",
      level: "junior",
      prompt: "Which two features should favour consistency over availability during a partition? (Choose two.)",
      options: [
        "Transferring money between accounts",
        "Booking the last seat on a flight",
        "Showing a post's like count",
        "Showing who is online",
      ],
      answer: [0, 1],
      explanation: "A wrong answer for balances or the last seat (double spend, double booking) is worse than a brief error. Like counts and presence can be a little stale.",
    },
    {
      id: "d3-11",
      domain: "d3",
      lesson: "d3-cap",
      level: "staff",
      prompt: "Someone proposes a 4-node Raft cluster \"for extra safety\" instead of 3. What is the best response?",
      options: [
        "It needs a majority of 3, so it still tolerates only 1 failure, like a 3-node cluster, while adding cost and write latency; use 3 or 5",
        "4 nodes tolerate 2 failures, so it's strictly better",
        "Raft requires an even number of nodes",
        "Any cluster size tolerates the same failures, so it doesn't matter",
      ],
      answer: [0],
      explanation: "Majority of 4 is 3, so 1 failure is tolerated, the same as 3 nodes (majority 2). 5 nodes (majority 3) tolerate 2. Even sizes add cost without adding fault tolerance.",
    },
    {
      id: "d3-12",
      domain: "d3",
      lesson: "d3-idempotency",
      level: "intermediate",
      prompt: "How does an idempotency key make `POST /payments` safe to retry?",
      options: [
        "The client sends a unique key per operation; the server records the key with the result and returns the stored result for any repeat",
        "The server encrypts the request with the key",
        "The load balancer routes requests with the same key to the same server, which ignores duplicates in memory",
        "The key sets the HTTP cache TTL for the response",
      ],
      answer: [0],
      explanation: "The server must persist key → outcome (with a uniqueness constraint) before or atomically with the side effect, so a retry after a timeout returns the first result instead of charging again.",
    },
    {
      id: "d3-13",
      domain: "d3",
      lesson: "d3-idempotency",
      level: "senior",
      type: "lines",
      prompt: "Clients retry after timeouts, and some customers are charged twice. Tap the line that is in the wrong place.",
      code: `function pay(req):
  key = req.header("Idempotency-Key")
  charge = gateway.charge(req.card, req.amount)
  if db.exists("idem", key):
    return db.get("idem", key)
  db.put("idem", key, charge)
  return charge`,
      codeLang: "text",
      answer: [3],
      explanation: "The card is charged before the key is checked, so every retry charges again. Reserve the key first (an insert that fails on duplicates), then charge, then store the result under the key.",
    },
    {
      id: "d3-14",
      domain: "d3",
      lesson: "d3-idempotency",
      level: "junior",
      prompt: "Which two HTTP methods are idempotent by definition? (Choose two.)",
      options: ["PUT", "DELETE", "POST", "PATCH"],
      answer: [0, 1],
      explanation: "PUT replaces a resource with the same representation every time, and deleting twice leaves it deleted. POST creates or triggers something each call; PATCH isn't guaranteed idempotent (e.g. \"increment by 1\").",
    },
    {
      id: "d3-15",
      domain: "d3",
      lesson: "d3-idempotency",
      level: "senior",
      prompt: "A service commits an order to its database and then publishes OrderPlaced to Kafka. Occasionally the process dies in between and downstream services never hear about the order. What is the standard fix?",
      options: [
        "Transactional outbox: insert the event into an outbox table in the same transaction and have a relay publish it",
        "Publish to Kafka first, then commit the order",
        "Retry the publish three times in a loop",
        "Use a distributed lock around both writes",
      ],
      answer: [0],
      explanation: "Two separate writes can't be atomic. The outbox makes the event part of the database transaction; the relay publishes at least once and consumers deduplicate by event id. Publishing first just flips the failure.",
    },
    {
      id: "d3-16",
      domain: "d3",
      lesson: "d3-idempotency",
      level: "staff",
      type: "order",
      prompt: "Order the steps of the transactional outbox pattern.",
      items: [
        "Begin a database transaction",
        "Insert the order row and an outbox row describing the event",
        "Commit the transaction",
        "A relay reads unpublished outbox rows and publishes them to the broker",
        "Mark the outbox rows as published; consumers deduplicate by event id",
      ],
      explanation: "The business change and the event commit atomically. Publishing happens afterwards (by polling or change data capture) and may repeat, so consumers must be idempotent.",
    },
    {
      id: "d3-17",
      domain: "d3",
      lesson: "d3-idempotency",
      level: "staff",
      prompt: "A vendor's broker advertises \"exactly-once delivery\". Your consumer sends emails. What should your design still include?",
      options: [
        "An idempotent consumer that records processed message ids, because the email side effect is outside the broker's transaction and can repeat after a crash",
        "Nothing extra: the broker guarantees it",
        "A second broker for redundancy",
        "Disabling retries in the consumer",
      ],
      answer: [0],
      explanation: "Broker exactly-once features cover reads and writes within the broker. If the consumer crashes after sending the email but before committing its offset, the message is processed again. Dedup on a message id.",
    },
    {
      id: "d3-18",
      domain: "d3",
      lesson: "d3-rate-limit",
      level: "junior",
      prompt: "What should an API return when a client exceeds its rate limit?",
      options: [
        "`429 Too Many Requests`, ideally with a `Retry-After` header",
        "`500 Internal Server Error`",
        "`404 Not Found`",
        "`200 OK` with an empty body",
      ],
      answer: [0],
      explanation: "429 tells the client it's being limited (not that the server broke), and Retry-After tells it when to try again.",
    },
    {
      id: "d3-19",
      domain: "d3",
      lesson: "d3-rate-limit",
      level: "intermediate",
      prompt: "How many requests are rejected in total?",
      code: `bucket: capacity = 10, refill = 5 tokens per second, starts full
t = 0.0 s   15 requests arrive at once
t = 1.0 s    8 requests arrive at once`,
      codeLang: "text",
      options: ["3", "5", "8", "13"],
      answer: [2],
      explanation: "At t = 0 the 10 tokens allow 10 and reject 5, leaving 0. One second later 5 tokens have refilled: 5 allowed, 3 rejected. 5 + 3 = 8 rejected.",
    },
    {
      id: "d3-20",
      domain: "d3",
      lesson: "d3-rate-limit",
      level: "intermediate",
      prompt: "A limiter allows 100 requests per calendar minute (fixed windows). What is the most a client can send in a two-second span?",
      options: ["100", "200", "50", "Unlimited"],
      answer: [1],
      explanation: "100 in the last second of one window plus 100 in the first second of the next. Sliding windows or a token bucket avoid this edge burst.",
    },
    {
      id: "d3-21",
      domain: "d3",
      lesson: "d3-rate-limit",
      level: "senior",
      type: "lines",
      prompt: "Under concurrent requests, users get well over 100 requests a minute. Tap the two lines that together cause the race.",
      code: `function allow(userId):
  key = "rl:" + userId + ":" + currentMinute()
  count = redis.get(key) or 0
  if count >= 100:
    return false
  redis.set(key, count + 1, ttl = 60)
  return true`,
      codeLang: "text",
      answer: [3, 6],
      explanation: "Read-then-write is not atomic: many requests read the same count and all write count + 1. Use an atomic `INCR` (then `EXPIRE` on the first increment) or a Lua script, and compare the returned value.",
    },
    {
      id: "d3-22",
      domain: "d3",
      lesson: "d3-rate-limit",
      level: "staff",
      prompt: "An API gateway runs on 20 nodes and must enforce 1,000 requests/minute per API key accurately, adding little latency. Which design fits best?",
      options: [
        "A shared counter store (e.g. a Redis cluster sharded by key) updated atomically per request, with a defined fail-open or fail-closed fallback if it's unreachable",
        "Each node enforces 1,000/minute on its own",
        "Each node enforces 50/minute on its own, regardless of how traffic is spread",
        "Log every request and count them in a nightly batch job",
      ],
      answer: [0],
      explanation: "Per-node limits are wrong when traffic isn't evenly spread (20 × 1,000, or far too strict). A central atomic counter is accurate at a cost of ~1 ms; deciding the fallback behaviour is part of the design.",
    },
    {
      id: "d3-23",
      domain: "d3",
      lesson: "d3-rate-limit",
      level: "intermediate",
      type: "match",
      prompt: "Match each rate-limiting algorithm to its defining behaviour.",
      pairs: [
        ["Token bucket", "Allows bursts up to its capacity, refills at a steady rate"],
        ["Leaky bucket", "Queues requests and releases them at a constant rate"],
        ["Fixed window counter", "Cheap counter per period, but bursts at window edges"],
        ["Sliding window log", "Exact, but stores a timestamp for every request"],
      ],
      explanation: "Token bucket is the common default for APIs. Leaky bucket smooths traffic, fixed windows are simplest, and sliding logs are most accurate but memory-hungry.",
    },
  ],

  cards: [
    { id: "c-d3-kafka", domain: "d3", kind: "service", term: "Kafka", definition: "Distributed append-only log split into ordered partitions; consumer groups read at their own offsets; retained and replayable." },
    { id: "c-d3-sqs", domain: "d3", kind: "service", term: "SQS-style work queue", definition: "Each message goes to one consumer; it's hidden for a visibility timeout and redelivered unless deleted (acked)." },
    { id: "c-d3-dlq", domain: "d3", kind: "service", term: "Dead-letter queue", definition: "Holds messages that failed processing too many times, so poison messages don't block or loop forever." },
    { id: "c-d3-consumer-group", domain: "d3", kind: "concept", term: "Consumer group", definition: "Consumers sharing a subscription; each partition goes to one member, so parallelism ≤ partition count." },
    { id: "c-d3-alo", domain: "d3", kind: "concept", term: "At-least-once delivery", definition: "Messages are redelivered until acknowledged; duplicates happen, so processing must be idempotent." },
    { id: "c-d3-backpressure", domain: "d3", kind: "concept", term: "Backpressure", definition: "Signalling upstream to slow down (bounded queues, rejects, throttling) when downstream can't keep up." },
    { id: "c-d3-cap", domain: "d3", kind: "concept", term: "CAP theorem", definition: "During a network partition, a replicated system must give up either consistency or availability." },
    { id: "c-d3-pacelc", domain: "d3", kind: "concept", term: "PACELC", definition: "If Partition: Availability vs Consistency; Else: Latency vs Consistency." },
    { id: "c-d3-raft", domain: "d3", kind: "service", term: "Raft", definition: "Consensus protocol: an elected leader replicates a log; entries commit once a majority stores them. 2f + 1 nodes tolerate f failures." },
    { id: "c-d3-idem-key", domain: "d3", kind: "service", term: "Idempotency key", definition: "Client-chosen unique id per operation; the server stores key → result and replays it for retries." },
    { id: "c-d3-outbox", domain: "d3", kind: "service", term: "Transactional outbox", definition: "Write the event to an outbox table in the same DB transaction; a relay publishes it. Fixes the dual-write problem." },
    { id: "c-d3-token-bucket", domain: "d3", kind: "service", term: "Token bucket", definition: "Each request spends a token; tokens refill at a fixed rate up to a capacity. Capacity = burst, refill = sustained rate." },
  ],

  challenges: [
    {
      id: "ch-sd-bucket",
      domain: "d3",
      lesson: "d3-rate-limit",
      title: "Burst once, not twice",
      goal: "Configure the bucket so a burst of 10 passes completely, then fire a second burst of 10 immediately and have at least 7 of them rejected.",
      hint: "The burst you allow is the capacity. What's left after the first burst is capacity − 10.",
      takeaway: "Capacity controls burst size and refill controls sustained throughput: size them separately.",
      render: (onSolved) => <TokenBucketLab goal="burst" onSolved={onSolved} />,
    },
  ],
});
