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
    prompt: "Fill the gap with the number of seconds in a day, so this line turns daily requests into average requests per second.",
    code: "# back-of-envelope\nqps = daily_requests / {{1}}",
    codeLang: "python",
    blanks: [{ options: ["86400", "3600", "1440", "24"], answer: 0 }],
    explanation:
      "A day has 24 times 60 times 60 seconds, which is 86,400. Interviewers are happy for you to round it to 100,000. 3,600 is seconds in an hour, 1,440 is minutes in a day, and 24 is hours in a day. Remember that the average isn't the peak: peaks are often 2 to 10 times higher.",
  },
  {
    id: "sd-fx-02",
    type: "fill",
    domain: "d4",
    level: "junior",
    lesson: "d4-api",
    prompt: "A `POST /orders` call created order 42. Fill the gap so the response tells the client where the new order lives.",
    code: "HTTP/1.1 201 Created\n{{1}}: /orders/42\nContent-Type: application/json",
    codeLang: "text",
    blanks: [{ options: ["Location", "Referer", "Allow", "Origin"], answer: 0 }],
    explanation:
      "A `201 Created` response usually carries a `Location` header with the address of the new resource. `Referer` and `Origin` are headers the client sends, not the server. `Allow` lists the methods a resource supports and shows up on 405 responses.",
  },
  {
    id: "sd-fx-03",
    type: "fill",
    domain: "d1",
    level: "intermediate",
    lesson: "d1-cache",
    prompt: "Fill the gap so Redis deletes this session key 30 minutes (1,800 seconds) after it's written.",
    code: "SET session:42 \"{...}\" {{1}} 1800",
    codeLang: "bash",
    blanks: [{ options: ["EX", "PX", "NX", "XX"], answer: 0 }],
    explanation:
      "`EX` sets the time to live in seconds. `PX` takes milliseconds, so `PX 1800` would expire the key after just 1.8 seconds. `NX` (only set if the key is missing) and `XX` (only set if it exists) control whether the write happens, not how long the key lives. A TTL is the simplest guard against stale cache entries.",
  },
  {
    id: "sd-fx-04",
    type: "fill",
    domain: "d3",
    level: "intermediate",
    lesson: "d3-rate-limit",
    prompt: "The rate limiter rejects a request. Fill the gap so well-behaved clients know to wait 30 seconds before trying again.",
    code: "HTTP/1.1 429 Too Many Requests\n{{1}}: 30",
    codeLang: "text",
    blanks: [{ options: ["Retry-After", "Keep-Alive", "Expires", "Content-Length"], answer: 0 }],
    explanation:
      "`429 Too Many Requests` is the standard status for rate limiting. `Retry-After` tells the client how long to wait, in seconds or as a date. Clients should also wait a bit longer each time and add some randomness, so they don't all come back at the same moment.",
  },
  {
    id: "sd-fx-05",
    type: "fill",
    domain: "d3",
    level: "senior",
    lesson: "d3-idempotency",
    prompt:
      "A mobile app may retry a payment after a timeout. Fill the gaps so a repeated key is never charged twice: the client sends a unique key, and the server's insert does nothing when that key already exists.",
    code:
      "POST /payments HTTP/1.1\n{{1}}: 7f3c-9a21\n\n-- server side\nINSERT INTO payments (idem_key, amount)\nVALUES ('7f3c-9a21', 4999)\nON CONFLICT (idem_key) {{2}};",
    codeLang: "sql",
    blanks: [
      { options: ["Idempotency-Key", "If-Match", "ETag", "Content-MD5"], answer: 0 },
      { options: ["DO NOTHING", "DO UPDATE", "DO RETRY", "DO DELETE"], answer: 0 },
    ],
    explanation:
      "The `Idempotency-Key` header carries a unique id the client made up. The server stores it under a uniqueness rule, and `ON CONFLICT ... DO NOTHING` makes a retry do nothing, so the server can return the first result instead of charging again. `If-Match` and `ETag` stop two edits overwriting each other, which is a different problem.",
  },
  {
    id: "sd-fx-06",
    type: "fill",
    domain: "d3",
    level: "staff",
    lesson: "d3-queues",
    prompt:
      "The topic keeps 3 copies of each message and has `min.insync.replicas=2`. Fill the gaps so a confirmed write survives losing one broker, and producer retries can't create duplicates.",
    code: "# Kafka producer config\nacks={{1}}\nenable.idempotence={{2}}",
    codeLang: "bash",
    blanks: [
      { options: ["all", "0", "1", "none"], answer: 0 },
      { options: ["true", "false", "auto", "strict"], answer: 0 },
    ],
    explanation:
      "`acks=all` makes the leader wait until every up-to-date copy, at least `min.insync.replicas` of them, has the record before confirming. So one broker can fail without losing a confirmed write. `acks=1` confirms once the leader alone has it, and `0` doesn't wait at all. `enable.idempotence=true` gives each producer a sequence number, so the broker can drop retried duplicates.",
  },

  // ───────────── output ─────────────
  {
    id: "sd-ox-01",
    type: "output",
    domain: "d1",
    level: "junior",
    lesson: "d1-estimates",
    prompt: "Estimate the average load. Using 100,000 seconds in a day, type the requests per second (number only).",
    code: "daily_requests = 50_000_000   # 50 million per day\nseconds_per_day = 100_000     # rounded\nqps = daily_requests // seconds_per_day\nprint(qps)",
    codeLang: "python",
    verified: "run",
    answers: ["500"],
    explanation:
      "50,000,000 divided by 100,000 is 500 requests per second on average. With the exact 86,400 seconds it's about 579, which is close enough for sizing. Then ask about peaks: if the peak is 5 times the average, plan for about 2,500 QPS.",
  },
  {
    id: "sd-ox-02",
    type: "output",
    domain: "d1",
    level: "intermediate",
    lesson: "d1-cache",
    prompt: "Type how many reads per second reach the database (number only).",
    code: "reads_per_second = 1000\ncache_hit_ratio  = 0.90\n# every cache miss goes to the database\nprint(round(reads_per_second * (1 - cache_hit_ratio)))",
    codeLang: "python",
    verified: "run",
    answers: ["100"],
    explanation:
      "A 90% hit ratio means 10% of the 1,000 reads miss the cache. 10% of 1,000 is 100, so 100 reads a second reach the database. At 99% it would drop to 10, which is why small gains in hit rate matter so much when the database is the bottleneck.",
  },
  {
    id: "sd-ox-03",
    type: "output",
    domain: "d2",
    level: "senior",
    lesson: "d2-replication",
    prompt:
      "A quorum store keeps N of 5 replicas, and writes wait for W of 2 confirmations. Type the smallest read quorum R (number only) that guarantees a read sees the latest write.",
    code: "N = 5   # replicas\nW = 2   # write quorum\n# strong consistency requires R + W > N\nR = N - W + 1   # the smallest R that still overlaps\nprint(R)",
    codeLang: "python",
    verified: "run",
    answers: ["4"],
    explanation:
      "The replicas you read and the replicas that confirmed the write must share at least one, so R plus W must be more than N. That means R must be more than 5 minus 2, which is 3, so the smallest R is 4. A common balanced choice is 3 replicas with W and R both 2. Quorums alone don't fix every problem: sloppy quorums and clocks that disagree can still cause trouble.",
  },
  {
    id: "sd-ox-04",
    type: "output",
    domain: "d2",
    level: "intermediate",
    lesson: "d2-sharding",
    prompt: "Type the minimum number of shards needed (number only). Count 1 TB as 1,000 GB.",
    code: "users           = 200_000_000\nbytes_per_user  = 10_000        # 10 KB each\nmax_per_shard   = 250   # GB\ntotal_gb = users * bytes_per_user // 1_000_000_000\nprint(-(-total_gb // max_per_shard))   # round up",
    codeLang: "python",
    verified: "run",
    answers: ["8"],
    explanation:
      "200 million users times 10 KB each is 2,000 GB, which is 2 TB. At 250 GB per shard, 2,000 divided by 250 is 8 shards. In practice you'd add room for growth and copies, and pick a shard key, such as the user id, that spreads the load evenly.",
  },
  {
    id: "sd-ox-05",
    type: "output",
    domain: "d3",
    level: "senior",
    lesson: "d3-rate-limit",
    prompt:
      "A token bucket holds at most 10 tokens, starts full, and refills 5 tokens a second. Each request costs one token. 25 requests arrive at once at the start, and another 25 arrive at once 2 seconds later. Type the total number of requests allowed (number only).",
    code: "capacity = 10\nrefill_per_second = 5\n# burst of 25 at t=0, burst of 25 at t=2s\nfirst = min(25, capacity)                        # bucket starts full\nsecond = min(25, min(capacity, refill_per_second * 2))\nprint(first + second)",
    codeLang: "python",
    verified: "run",
    answers: ["20"],
    explanation:
      "At the start, the full bucket lets 10 through and rejects the other 15, leaving it empty. Two seconds of refilling add 10 tokens, exactly the capacity, so 10 more get through. That's 20 in total. The capacity sets how big a burst can be, and the refill rate sets the long-run average.",
  },
  {
    id: "sd-ox-06",
    type: "output",
    domain: "d4",
    level: "staff",
    lesson: "d4-reliability",
    prompt:
      "The SLO is 99.95% availability over a 30-day month. Type the error budget as minutes of full downtime (number only).",
    code: "minutes_in_month = 30 * 24 * 60   # 43_200\nslo = 0.9995\nprint(round(minutes_in_month * (1 - slo), 1))",
    codeLang: "python",
    verified: "run",
    answers: ["21.6"],
    explanation:
      "The budget is the share of time you're allowed to fail: 0.05% of the month. A 30-day month has 43,200 minutes, and 0.05% of 43,200 is 21.6 minutes. Teams spend this on deploys and experiments, and pause risky changes once it runs out. For comparison, 99.9% allows 43.2 minutes and 99.99% only about 4.3.",
  },
];
