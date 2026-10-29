import type { Question } from "@/engine/types";

/**
 * Extra question types for the System Design track: fill-in-the-config and "type the estimate" questions.
 * Every numeric answer is simple arithmetic that was worked twice by hand; the working is in each explanation.
 */
export const moreQuestions: Question[] = [
  // ───────────── fill ─────────────
  {
    id: "sd-fx-01",
    type: "fill",
    domain: "d1",
    level: "junior",
    lesson: "d1-estimates",
    prompt: "Fill the gap with the number of seconds in a day, so the line converts daily requests into average requests per second.",
    code: "# back-of-envelope\nqps = daily_requests / {{1}}",
    codeLang: "python",
    blanks: [{ options: ["86400", "3600", "1440", "24"], answer: 0 }],
    explanation:
      "A day has 24 x 60 x 60 = 86,400 seconds (interviewers happily round to 10^5). 3,600 is seconds per hour, 1,440 is minutes per day, and 24 is hours per day. Remember that average QPS is not peak QPS: peaks are often 2 to 10 times higher.",
  },
  {
    id: "sd-fx-02",
    type: "fill",
    domain: "d4",
    level: "junior",
    lesson: "d4-api",
    prompt: "A `POST /orders` call created order 42. Fill the gap so the response tells the client where the new resource lives.",
    code: "HTTP/1.1 201 Created\n{{1}}: /orders/42\nContent-Type: application/json",
    codeLang: "text",
    blanks: [{ options: ["Location", "Referer", "Allow", "Origin"], answer: 0 }],
    explanation:
      "A `201 Created` response normally carries a `Location` header with the URL of the new resource. `Referer` and `Origin` are request headers, and `Allow` lists the methods a resource supports (it appears on 405 responses).",
  },
  {
    id: "sd-fx-03",
    type: "fill",
    domain: "d1",
    level: "intermediate",
    lesson: "d1-cache",
    prompt: "Fill the gap so Redis expires this session key 30 minutes (1,800 seconds) after it is written.",
    code: "SET session:42 \"{...}\" {{1}} 1800",
    codeLang: "bash",
    blanks: [{ options: ["EX", "PX", "NX", "XX"], answer: 0 }],
    explanation:
      "`EX` sets the time to live in seconds. `PX` takes milliseconds, so `PX 1800` would expire the key after 1.8 seconds. `NX` (only set if the key is missing) and `XX` (only if it exists) control when the write happens, not how long it lives. A TTL is the simplest defence against stale cache entries.",
  },
  {
    id: "sd-fx-04",
    type: "fill",
    domain: "d3",
    level: "intermediate",
    lesson: "d3-rate-limit",
    prompt: "The limiter rejects a request. Fill the gap so well-behaved clients know to wait 30 seconds before trying again.",
    code: "HTTP/1.1 429 Too Many Requests\n{{1}}: 30",
    codeLang: "text",
    blanks: [{ options: ["Retry-After", "Keep-Alive", "Expires", "Content-Length"], answer: 0 }],
    explanation:
      "`429 Too Many Requests` is the standard status for rate limiting, and `Retry-After` tells the client how long to back off, in seconds or as an HTTP date. Clients should combine it with exponential backoff and jitter so they do not all return at the same instant.",
  },
  {
    id: "sd-fx-05",
    type: "fill",
    domain: "d3",
    level: "senior",
    lesson: "d3-idempotency",
    prompt:
      "A mobile client may retry a payment after a timeout. Fill the gaps so a repeated key is never charged twice: the client sends a unique key, and the server's insert does nothing when the key already exists.",
    code:
      "POST /payments HTTP/1.1\n{{1}}: 7f3c-9a21\n\n-- server side\nINSERT INTO payments (idem_key, amount)\nVALUES ('7f3c-9a21', 4999)\nON CONFLICT (idem_key) {{2}};",
    codeLang: "sql",
    blanks: [
      { options: ["Idempotency-Key", "If-Match", "ETag", "Content-MD5"], answer: 0 },
      { options: ["DO NOTHING", "DO UPDATE", "DO RETRY", "DO DELETE"], answer: 0 },
    ],
    explanation:
      "The `Idempotency-Key` header carries a client-generated unique id. The server stores it under a unique constraint, and `ON CONFLICT ... DO NOTHING` makes the retry a no-op so it can return the original result instead of charging again. `If-Match` and `ETag` guard against lost updates to a resource, which is a different problem.",
  },
  {
    id: "sd-fx-06",
    type: "fill",
    domain: "d3",
    level: "staff",
    lesson: "d3-queues",
    prompt:
      "The topic has replication factor 3 and `min.insync.replicas=2`. Fill the gaps so an acknowledged write survives the loss of one broker, and producer retries cannot create duplicates.",
    code: "# Kafka producer config\nacks={{1}}\nenable.idempotence={{2}}",
    codeLang: "bash",
    blanks: [
      { options: ["all", "0", "1", "none"], answer: 0 },
      { options: ["true", "false", "auto", "strict"], answer: 0 },
    ],
    explanation:
      "`acks=all` makes the leader wait until every in-sync replica (at least `min.insync.replicas`) has the record before acknowledging, so one broker can fail without losing an acknowledged write. `acks=1` acknowledges after the leader alone, and `0` does not wait at all. `enable.idempotence=true` gives each producer a sequence number so broker-side dedupe absorbs retries.",
  },

  // ───────────── output ─────────────
  {
    id: "sd-ox-01",
    type: "output",
    domain: "d1",
    level: "junior",
    lesson: "d1-estimates",
    prompt: "Estimate the average load. Type the requests per second (number only), using 10^5 seconds per day.",
    code: "daily_requests = 50_000_000   # 50 million per day\nseconds_per_day = 100_000     # rounded\nqps = daily_requests / seconds_per_day",
    codeLang: "python",
    answers: ["500"],
    explanation:
      "50,000,000 / 100,000 = 500 requests per second on average. With exact seconds (86,400) it is about 579, close enough for a sizing conversation. Then ask about peaks: at 5x, plan for roughly 2,500 QPS.",
  },
  {
    id: "sd-ox-02",
    type: "output",
    domain: "d1",
    level: "intermediate",
    lesson: "d1-cache",
    prompt: "Type how many reads per second reach the database (number only).",
    code: "reads_per_second = 1000\ncache_hit_ratio  = 0.90\n# every cache miss goes to the database",
    codeLang: "python",
    answers: ["100"],
    explanation:
      "A 90% hit ratio means 10% of 1,000 reads miss: 1,000 x 0.10 = 100 reads per second hit the database. Raising the ratio to 99% would cut that to 10, which is why small gains in hit rate matter so much when the database is the bottleneck.",
  },
  {
    id: "sd-ox-03",
    type: "output",
    domain: "d2",
    level: "senior",
    lesson: "d2-replication",
    prompt:
      "A quorum store has N = 5 replicas and writes wait for W = 2 acknowledgements. Type the smallest read quorum R (number only) that guarantees a read sees the latest write.",
    code: "N = 5   # replicas\nW = 2   # write quorum\n# strong consistency requires R + W > N",
    codeLang: "python",
    answers: ["4"],
    explanation:
      "The read and write sets must overlap in at least one replica, so R + W > N, which means R > 5 - 2 = 3 and the smallest R is 4. A common balanced choice is N=3, W=2, R=2. Note that quorums alone do not fix every anomaly (sloppy quorums and clock skew can still bite).",
  },
  {
    id: "sd-ox-04",
    type: "output",
    domain: "d2",
    level: "intermediate",
    lesson: "d2-sharding",
    prompt: "Type the minimum number of shards needed (number only). Use 1 TB = 1,000 GB.",
    code: "users           = 200_000_000\nbytes_per_user  = 10_000        # 10 KB each\nmax_per_shard   = 250   # GB",
    codeLang: "python",
    answers: ["8"],
    explanation:
      "Total data is 200,000,000 x 10 KB = 2,000 GB (2 TB). At 250 GB per shard that is 2,000 / 250 = 8 shards. In practice you would add headroom for growth and replicas, and choose a shard key (such as user id) that spreads load evenly.",
  },
  {
    id: "sd-ox-05",
    type: "output",
    domain: "d3",
    level: "senior",
    lesson: "d3-rate-limit",
    prompt:
      "A token bucket holds at most 10 tokens, starts full, refills 5 tokens per second, and each request costs one token. 25 requests arrive instantly at t=0, and another 25 arrive instantly at t=2s. Type the total number of requests allowed (number only).",
    code: "capacity = 10\nrefill_per_second = 5\n# burst of 25 at t=0, burst of 25 at t=2s",
    codeLang: "python",
    answers: ["20"],
    explanation:
      "At t=0 the full bucket lets 10 through and the other 15 are rejected, leaving 0 tokens. Two seconds add 2 x 5 = 10 tokens (exactly the cap), so 10 more pass at t=2s. Total: 20. The bucket allows bursts up to its capacity, while the refill rate limits the long-run average.",
  },
  {
    id: "sd-ox-06",
    type: "output",
    domain: "d4",
    level: "staff",
    lesson: "d4-reliability",
    prompt:
      "The SLO is 99.95% availability over a 30-day month. Type the error budget in minutes of full downtime (number only).",
    code: "minutes_in_month = 30 * 24 * 60   # 43_200\nslo = 0.9995",
    codeLang: "python",
    answers: ["21.6"],
    explanation:
      "The budget is the allowed failure share: 43,200 x (1 - 0.9995) = 43,200 x 0.0005 = 21.6 minutes. Teams spend this on deploys and experiments, and freeze risky changes once it runs out. For comparison, 99.9% allows 43.2 minutes and 99.99% only about 4.3.",
  },
];
