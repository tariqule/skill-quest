import { CodeBlock, CodeCompare, Flow, Layers, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { CircuitBreakerVisual, FanoutVisual } from "../visuals";

/** Domain 4: API design, observability and reliability, and the classic interview designs. */
export default defineDomain({
  domain: {
    id: "d4",
    number: 4,
    name: "Designing Real Systems",
    world: "The Architect's Summit",
    weight: 25,
    emoji: "🏔️",
    color: "#fbbf24",
    summary: "Clean APIs, SLOs and failure handling, then the classics: a URL shortener, a news feed and a chat system, at senior and staff depth.",
  },

  tasks: [
    { id: "4.1", title: "Design clean APIs", covers: ["REST resources and status codes", "gRPC vs REST", "cursor pagination", "versioning and compatibility"] },
    { id: "4.2", title: "Observe and stay reliable", covers: ["SLIs, SLOs, SLAs, error budgets", "timeouts, retries with backoff and jitter", "circuit breakers and bulkheads", "symptom-based alerting"] },
    { id: "4.3", title: "Design classic systems", covers: ["URL shortener", "id generation", "news feed fan-out", "real-time chat"] },
  ],

  lessons: [
    {
      id: "d4-api",
      level: "junior",
      task: "4.1",
      title: "API design",
      check: ["d4-01", "d4-02"],
      visual: (
        <div className="grid gap-3">
          <CodeBlock
            lang="text"
            caption="Nouns for resources, HTTP verbs for actions, status codes for outcomes."
            code={`GET    /users/7/orders?limit=20&cursor=…   200 list (one page)
POST   /users/7/orders                      201 created + Location
GET    /users/7/orders/42                   200 one order · 404 if missing
PATCH  /users/7/orders/42                   200 partial update
DELETE /users/7/orders/42                   204 no content`}
          />
          <CodeBlock
            lang="json"
            caption="Cursor pagination: the server returns an opaque token for the next page."
            code={`{
  "items": [{ "id": 9821, "total": 4200 }],
  "next_cursor": "eyJpZCI6OTgyMX0"
}`}
          />
        </div>
      ),
      points: [
        "Model resources as nouns and use HTTP verbs for actions; return precise status codes (201, 400, 404, 409, 429, 503).",
        "Paginate every list. Opaque cursors are stable under inserts and let the server change how pages are computed.",
        "Evolve compatibly: add optional fields, never rename or remove without a deprecation period; bump the version only for breaking changes.",
        "REST/JSON suits public APIs and browsers; gRPC (Protocol Buffers over HTTP/2) suits internal, typed, high-throughput or streaming calls.",
      ],
      tip: "Sketch the 3–5 core endpoints with request and response shapes early in the interview. It pins down scope and exposes the data model.",
    },
    {
      id: "d4-reliability",
      level: "senior",
      task: "4.2",
      title: "SLOs, retries and circuit breakers",
      check: ["d4-07", "d4-08"],
      visual: (
        <div className="grid gap-3">
          <Layers
            layers={[
              { name: "SLI — what you measure", color: "#2dd4bf", items: ["% of requests < 300 ms", "% of requests without 5xx"] },
              { name: "SLO — your target", color: "#60a5fa", items: ["99.9% good over 30 days", "error budget = 0.1% ≈ 43 min/month"] },
              { name: "SLA — the contract", color: "#fbbf24", items: ["99.5% or service credits"] },
            ]}
          />
          <CircuitBreakerVisual />
          <CodeCompare
            lang="text"
            left={{ title: "Retry storm", code: `retry immediately, forever
every client in lock-step
→ a blip becomes an outage` }}
            right={{ title: "Polite retries", code: `timeout every call
≤ 3 attempts, exponential backoff
+ random jitter, idempotent ops only
+ retry budget / circuit breaker` }}
          />
        </div>
      ),
      points: [
        "An SLO turns \"reliable\" into a number; the error budget (1 − SLO) is how much failure you can spend on releases and experiments.",
        "Every network call needs a timeout. Retry only idempotent operations and transient errors, with exponential backoff and jitter.",
        "Retries multiply through layers; cap them with retry budgets, and use circuit breakers to fail fast when a dependency is down.",
        "Bulkheads isolate resources (separate pools per dependency) so one slow dependency can't exhaust every thread.",
        "Page on user-facing symptoms (error rate, latency, SLO burn rate), not on causes like CPU.",
      ],
      tip: "Saying \"timeouts, retries with backoff and jitter, circuit breaker, and an SLO with burn-rate alerts\" in one breath shows production experience.",
    },
    {
      id: "d4-shortener",
      level: "intermediate",
      task: "4.3",
      title: "Design a URL shortener",
      check: ["d4-14", "d4-15"],
      visual: (
        <div className="grid gap-3">
          <Flow
            color="#fbbf24"
            steps={[
              { icon: "🔗", label: "POST /links", sub: "Get a unique id, base62-encode it" },
              { icon: "🗄️", label: "Store code → URL", sub: "Key-value or SQL, replicated" },
              { icon: "⚡", label: "GET /:code", sub: "Cache first (reads ≫ writes)" },
              { icon: "↪️", label: "302 redirect", sub: "Log the click asynchronously" },
            ]}
          />
          <CodeBlock
            lang="text"
            caption="Base62 = [0-9a-zA-Z]. Length grows with log62 of how many links you'll ever create."
            code={`62^6 ≈ 56.8 billion codes
62^7 ≈ 3.5 trillion codes
id 125 → base62 "21"   (2 × 62 + 1)`}
          />
        </div>
      ),
      points: [
        "Clarify scale first: new links per second, redirects per second (often 100× more), retention, custom aliases, analytics.",
        "Generate codes from unique ids (a counter with leased ranges or a Snowflake-style id) and base62-encode them; hashing long URLs needs collision handling.",
        "The redirect path is a read-heavy key lookup: cache hot codes, replicate the store, serve from multiple regions.",
        "Use 302 (or 307) if every click must reach you for analytics; 301 is cached by browsers, so repeat clicks may skip your servers.",
      ],
      tip: "Interviewers often push on \"what if two servers generate the same code?\" Have a concrete id strategy ready.",
    },
    {
      id: "d4-feed-chat",
      level: "staff",
      task: "4.3",
      title: "News feeds and chat",
      check: ["d4-19", "d4-20"],
      visual: (
        <div className="grid gap-3">
          <FanoutVisual />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🔌", title: "Chat gateways", text: "Hold long-lived WebSocket connections; a registry maps user → gateway so messages can be routed to the right box.", color: "#fbbf24" },
              { icon: "🧾", title: "Message store", text: "Partitioned by conversation id, ordered by a per-conversation sequence number; clients sync from their last seen sequence.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Fan-out on write precomputes each follower's timeline (fast reads, expensive celebrity posts); fan-out on read merges at read time (cheap writes, slow reads).",
        "Hybrid is the usual answer: push for most authors, pull for very high-follower accounts, merge at read time.",
        "Store timelines as lists of post ids (bounded, e.g. the latest few hundred) and hydrate posts from a separate cache.",
        "Chat: persistent connections on gateway servers, a connection registry, durable per-conversation ordering, acknowledgements, and push notifications for offline users.",
      ],
      tip: "At staff level, drive the trade-off explicitly: state the read/write ratio and the follower distribution, then justify hybrid fan-out with numbers.",
    },
  ],

  questions: [
    {
      id: "d4-01",
      domain: "d4",
      lesson: "d4-api",
      level: "junior",
      prompt: "Which endpoint follows REST conventions for fetching order 42 belonging to user 7?",
      options: ["`GET /users/7/orders/42`", "`POST /getOrder?user=7&order=42`", "`GET /fetchUserOrder/7/42/now`", "`PUT /orders/42/get`"],
      answer: [0],
      explanation: "REST names resources with nouns in a hierarchy and lets the HTTP method express the action. GET reads; verbs in the path are a smell.",
    },
    {
      id: "d4-02",
      domain: "d4",
      lesson: "d4-api",
      level: "junior",
      prompt: "The API returned this page. How does the client request the next one?",
      code: `{
  "items": [{ "id": 9821, "total": 4200 }],
  "next_cursor": "eyJpZCI6OTgyMX0"
}`,
      codeLang: "json",
      options: [
        "Send the same request with `?cursor=eyJpZCI6OTgyMX0`; a missing `next_cursor` means there are no more pages",
        "Decode the cursor and add 20 to the id",
        "Send `?page=2`",
        "Repeat the request; the server remembers the position per client",
      ],
      answer: [0],
      explanation: "Cursors are opaque tokens: clients pass them back unchanged. The server encodes the last position (here the last id) and can change the encoding later without breaking clients.",
    },
    {
      id: "d4-03",
      domain: "d4",
      lesson: "d4-api",
      level: "intermediate",
      prompt: "Internal services exchange millions of small, strictly typed messages per second, some as long-lived streams. Which API style fits best?",
      options: [
        "gRPC: Protocol Buffer contracts over HTTP/2 with built-in streaming",
        "REST with hand-written JSON parsing",
        "GraphQL subscriptions over a public endpoint",
        "SOAP over SMTP",
      ],
      answer: [0],
      explanation: "gRPC gives generated typed clients, compact binary encoding, and HTTP/2 multiplexing and streaming. REST/JSON remains the better default for public and browser-facing APIs.",
    },
    {
      id: "d4-04",
      domain: "d4",
      lesson: "d4-api",
      level: "intermediate",
      prompt: "A public API field `user_name` should become `username`. Hundreds of integrations use it. What's the safest plan?",
      options: [
        "Add `username`, keep returning `user_name`, announce a deprecation window, and remove the old field only in a new major version",
        "Rename it in place; clients should update",
        "Return both fields forever without telling anyone",
        "Create /v2 of every endpoint today",
      ],
      answer: [0],
      explanation: "Additive changes are backward compatible; removals and renames are breaking. Expand, migrate with a deprecation period and usage tracking, then contract in a versioned release.",
    },
    {
      id: "d4-05",
      domain: "d4",
      lesson: "d4-api",
      level: "junior",
      type: "match",
      prompt: "Match each HTTP status code to when an API should return it.",
      pairs: [
        ["201 Created", "A POST created a new resource"],
        ["400 Bad Request", "The request body failed validation"],
        ["409 Conflict", "The request conflicts with the current state, e.g. a version mismatch"],
        ["503 Service Unavailable", "The server is overloaded or down for maintenance"],
      ],
      explanation: "2xx means success, 4xx means the client must change something, 5xx means the server failed. 409 is common for optimistic-locking conflicts.",
    },
    {
      id: "d4-06",
      domain: "d4",
      lesson: "d4-reliability",
      level: "senior",
      type: "lines",
      prompt: "During a brief dependency outage, this client policy makes things worse and wastes calls. Tap the two lines to fix.",
      code: `http_client:
  timeout_ms: 2000
  retry:
    max_attempts: 3
    backoff: exponential
    base_delay_ms: 100
    jitter: none
    retry_on: [502, 503, 504, 400]`,
      codeLang: "yaml",
      answer: [7, 8],
      explanation: "Without jitter, every client retries at the same instants, producing synchronised waves of load. And 400 is a client error: retrying an invalid request can never succeed. Add full jitter and retry only transient errors.",
    },
    {
      id: "d4-07",
      domain: "d4",
      lesson: "d4-reliability",
      level: "junior",
      type: "match",
      prompt: "Match each reliability term to its meaning.",
      pairs: [
        ["SLI", "A measured indicator, e.g. % of requests served in under 300 ms"],
        ["SLO", "The internal target for an indicator, e.g. 99.9% over 30 days"],
        ["SLA", "A contractual promise to customers, with penalties if missed"],
        ["Error budget", "The amount of unreliability the target allows: 1 − SLO"],
      ],
      explanation: "You measure SLIs, aim for SLOs, and sign SLAs (looser than your SLOs). The error budget lets teams balance shipping speed against reliability.",
    },
    {
      id: "d4-08",
      domain: "d4",
      lesson: "d4-reliability",
      level: "intermediate",
      prompt: "An availability SLO of 99.9% over a 30-day window allows how much total downtime?",
      options: ["About 4.3 minutes", "About 43 minutes", "About 7.2 hours", "About 3.6 days"],
      answer: [1],
      explanation: "30 days × 24 h × 60 min = 43,200 minutes; 0.1% of that is 43.2 minutes. Each extra nine divides it by 10 (99.99% ≈ 4.3 minutes).",
    },
    {
      id: "d4-09",
      domain: "d4",
      lesson: "d4-reliability",
      level: "senior",
      prompt: "A request passes through three service layers, and each layer makes up to 3 attempts to call the next. In the worst case, how many calls reach the bottom service for one user request?",
      options: ["3", "9", "27", "81"],
      answer: [2],
      explanation: "Attempts multiply: 3 × 3 × 3 = 27. Retry at one layer only (usually the closest to the user or the failing hop), and use retry budgets.",
    },
    {
      id: "d4-10",
      domain: "d4",
      lesson: "d4-reliability",
      level: "senior",
      prompt: "A search request fans out to 100 shards in parallel and waits for all of them. Each shard is slow on 1% of requests, independently. Roughly what share of user requests are slow?",
      options: ["1%", "About 10%", "About 63%", "100%"],
      answer: [2],
      explanation: "P(no shard slow) = 0.99¹⁰⁰ ≈ 0.366, so about 63% of requests hit at least one slow shard. That's why fan-out systems obsess over p99 and use hedged requests or partial results.",
    },
    {
      id: "d4-11",
      domain: "d4",
      lesson: "d4-reliability",
      level: "intermediate",
      prompt: "What is a circuit breaker for?",
      options: [
        "After repeated failures, fail fast without calling the dependency for a while, then probe with a trial call before closing again",
        "Retry every failed call until it succeeds",
        "Encrypt traffic between services",
        "Cut power to a server that runs too hot",
      ],
      answer: [0],
      explanation: "Closed → open on too many failures → half-open after a cool-down → closed if the trial succeeds. It stops callers from wasting threads on a dead dependency and gives it room to recover.",
    },
    {
      id: "d4-12",
      domain: "d4",
      lesson: "d4-reliability",
      level: "senior",
      type: "lines",
      prompt: "Good practice is to page on user-facing symptoms. Tap the line that will wake on-call even when users are fine.",
      code: `slo:
  service: checkout
  objective: 99.9%
  window: 30d
alerts:
  - name: checkout-high-cpu
    expr: cpu_utilization > 70%
    page: true
  - name: checkout-fast-burn
    expr: error_budget_burn_rate(window=1h) > 14.4
    page: true`,
      codeLang: "yaml",
      answer: [7],
      explanation: "High CPU is a cause, not a symptom: the service may be perfectly healthy at 70%. The burn-rate alert pages when the error budget is being spent fast (14.4× for an hour uses 2% of a 30-day budget). Send CPU to a dashboard or ticket instead.",
    },
    {
      id: "d4-13",
      domain: "d4",
      lesson: "d4-reliability",
      level: "senior",
      prompt: "Checkout synchronously calls four services in sequence, each independently 99.9% available. What is checkout's availability at best?",
      options: ["99.9%", "About 99.6%", "About 99.0%", "About 96%"],
      answer: [1],
      explanation: "Serial dependencies multiply: 0.999⁴ ≈ 0.996. Every hard dependency on the critical path lowers your ceiling, which is why non-critical calls should be made optional or asynchronous.",
    },
    {
      id: "d4-14",
      domain: "d4",
      lesson: "d4-shortener",
      level: "intermediate",
      prompt: "A URL shortener must support up to 100 billion links using base62 codes ([0-9a-zA-Z]). What is the shortest fixed code length that fits?",
      options: ["6 characters", "7 characters", "8 characters", "10 characters"],
      answer: [1],
      explanation: "62⁶ ≈ 56.8 billion, which is too few; 62⁷ ≈ 3.5 trillion is plenty. So 7 characters.",
    },
    {
      id: "d4-15",
      domain: "d4",
      lesson: "d4-shortener",
      level: "junior",
      prompt: "The product needs a count of every click on a short link. Which redirect status should the shortener return?",
      options: [
        "302 Found, because browsers don't cache it by default, so every click reaches the server",
        "301 Moved Permanently, because it's faster",
        "200 OK with the long URL in the body",
        "404, then let the browser search for the URL",
      ],
      answer: [0],
      explanation: "301 responses are cacheable by default, so a browser may skip your server on repeat clicks. 302 (or 307) keeps clicks flowing through you, at the cost of more traffic.",
    },
    {
      id: "d4-16",
      domain: "d4",
      lesson: "d4-shortener",
      level: "senior",
      type: "lines",
      prompt: "Occasionally one customer's short link starts pointing at someone else's URL. Tap the two lines that together cause it.",
      code: `function shorten(longUrl):
  code = md5(longUrl).hex().substring(0, 7)
  db.upsert(code, longUrl)
  return "https://sho.rt/" + code`,
      codeLang: "text",
      answer: [2, 3],
      explanation: "Seven hex characters give only 16⁷ ≈ 268 million codes, so with millions of links collisions are expected (birthday paradox). The upsert then silently overwrites the existing link. Use unique ids, or insert with a uniqueness constraint and retry on conflict.",
    },
    {
      id: "d4-17",
      domain: "d4",
      lesson: "d4-shortener",
      level: "staff",
      prompt: "The shortener must create 50,000 links per second across three regions without a per-request round trip to a central coordinator. Which two id strategies work? (Choose two.)",
      options: [
        "Each server leases a block of ids (e.g. a million at a time) from a coordination service and hands them out locally",
        "Snowflake-style ids: timestamp + machine id + per-machine sequence, generated locally",
        "A single database auto-increment column that every region calls",
        "A random 4-character code without checking for duplicates",
      ],
      answer: [0, 1],
      explanation: "Both avoid per-request coordination: range leasing needs a coordinator only once per block, and Snowflake needs only unique machine ids. A single sequence is a cross-region bottleneck; 4 random characters collide almost immediately.",
    },
    {
      id: "d4-18",
      domain: "d4",
      lesson: "d4-shortener",
      level: "senior",
      prompt: "A Snowflake-style 64-bit id uses 41 bits of millisecond timestamp, 10 bits of machine id, and 12 bits of sequence. How many ids can one machine generate per millisecond?",
      options: ["1,024", "4,096", "65,536", "2 billion"],
      answer: [1],
      explanation: "The sequence has 12 bits: 2¹² = 4,096 ids per millisecond per machine. 10 machine bits allow 1,024 generators; 41 bits of milliseconds last about 69 years.",
    },
    {
      id: "d4-19",
      domain: "d4",
      lesson: "d4-feed-chat",
      level: "senior",
      prompt: "A feed uses fan-out on write. An account with 30 million followers posts and the timeline workers fall hours behind. What's the standard fix?",
      options: [
        "Hybrid: don't fan out posts from very high-follower accounts; merge them into followers' feeds at read time",
        "Fan out the celebrity's posts synchronously before acknowledging the post",
        "Switch every user to fan-out on read",
        "Limit accounts to 1 million followers",
      ],
      answer: [0],
      explanation: "Pushing to 30 M timelines per post is the celebrity problem. Pulling only those few accounts at read time keeps reads cheap for everyone else; going all-pull makes every feed load expensive.",
    },
    {
      id: "d4-20",
      domain: "d4",
      lesson: "d4-feed-chat",
      level: "staff",
      prompt: "A chat system holds 10 million concurrent WebSocket connections, about 100,000 per gateway server. When Ana messages Bo, how does the message reach Bo's connection?",
      options: [
        "About 100 gateways; a connection registry maps each online user to their gateway, and the chat service routes (or publishes) the message to Bo's gateway",
        "About 1,000 gateways; the message is broadcast to all of them",
        "About 100 gateways; Bo's client polls the database every second",
        "A single gateway holds all connections, so no routing is needed",
      ],
      answer: [0],
      explanation: "10 M / 100 k = 100 gateways. Broadcasting to all would multiply traffic by 100; polling adds latency and load. A user → gateway registry (in a fast store), updated on connect and disconnect, enables direct routing.",
    },
    {
      id: "d4-21",
      domain: "d4",
      lesson: "d4-feed-chat",
      level: "staff",
      type: "order",
      prompt: "Order the steps of delivering a chat message to an online recipient.",
      items: [
        "The sender's client sends the message over its WebSocket to a chat gateway",
        "The chat service persists it with the next per-conversation sequence number",
        "The service looks up which gateway holds the recipient's connection",
        "That gateway pushes the message down the recipient's WebSocket",
        "The recipient's client acknowledges, and the message is marked delivered",
      ],
      explanation: "Persist before delivering so nothing is lost if delivery fails; the sequence number gives ordering and lets reconnecting clients sync from their last seen message.",
    },
    {
      id: "d4-22",
      domain: "d4",
      lesson: "d4-feed-chat",
      level: "staff",
      prompt: "Why do feed systems usually cache each user's timeline as a bounded list of post ids rather than full post objects?",
      options: [
        "Ids are tiny, so millions of timelines fit in memory, and edits or deletions update one post record instead of every timeline copy",
        "Post ids sort alphabetically, which is how feeds are ranked",
        "Caches can't store JSON",
        "It makes fan-out on write unnecessary",
      ],
      answer: [0],
      explanation: "Timelines store references (e.g. the latest few hundred ids); a separate post cache hydrates them. That bounds memory and keeps one source of truth for post content.",
    },
    {
      id: "d4-23",
      domain: "d4",
      lesson: "d4-reliability",
      level: "staff",
      prompt: "A design review finds checkout calling six services synchronously: payments, inventory, recommendations, analytics, email and loyalty points. What is the highest-leverage change?",
      options: [
        "Keep only payments and inventory on the critical path; make the rest asynchronous (events) or optional with tight timeouts and fallbacks",
        "Add retries to all six calls",
        "Merge all six services into checkout",
        "Raise every timeout to 30 seconds",
      ],
      answer: [0],
      explanation: "Each synchronous dependency multiplies availability and adds latency. Checkout only truly needs payment and stock reservation; emails, analytics and points can follow from an OrderPlaced event, and recommendations can degrade gracefully.",
    },
  ],

  cards: [
    { id: "c-d4-rest", domain: "d4", kind: "concept", term: "REST", definition: "Resources as nouns (URLs), actions as HTTP methods, outcomes as status codes; stateless requests." },
    { id: "c-d4-grpc", domain: "d4", kind: "service", term: "gRPC", definition: "RPC framework using Protocol Buffer contracts over HTTP/2: typed generated clients, compact encoding, streaming." },
    { id: "c-d4-cursor", domain: "d4", kind: "concept", term: "Cursor pagination", definition: "The server returns an opaque next_cursor; clients pass it back. Stable under inserts and cheap at any depth." },
    { id: "c-d4-slo", domain: "d4", kind: "concept", term: "SLO", definition: "A target for a service level indicator over a window, e.g. 99.9% of requests succeed over 30 days." },
    { id: "c-d4-error-budget", domain: "d4", kind: "concept", term: "Error budget", definition: "1 − SLO: the failure you can afford. 99.9% over 30 days ≈ 43 minutes. Spend it on releases; freeze when it's gone." },
    { id: "c-d4-backoff", domain: "d4", kind: "concept", term: "Exponential backoff with jitter", definition: "Wait base × 2ⁿ (capped) plus randomness between retries, so clients don't retry in synchronised waves." },
    { id: "c-d4-circuit-breaker", domain: "d4", kind: "service", term: "Circuit breaker", definition: "Closed → open after repeated failures (fail fast) → half-open trial after a cool-down → closed on success." },
    { id: "c-d4-bulkhead", domain: "d4", kind: "service", term: "Bulkhead", definition: "Separate resource pools per dependency or tenant so one slow dependency can't exhaust everything." },
    { id: "c-d4-burn-rate", domain: "d4", kind: "concept", term: "Burn-rate alert", definition: "Pages when the error budget is being consumed much faster than sustainable, e.g. 14.4× over 1 hour." },
    { id: "c-d4-base62", domain: "d4", kind: "service", term: "Base62 encoding", definition: "Encodes an integer id with [0-9a-zA-Z]. 7 characters ≈ 3.5 trillion codes." },
    { id: "c-d4-snowflake", domain: "d4", kind: "service", term: "Snowflake id", definition: "64-bit id = 41-bit ms timestamp + 10-bit machine + 12-bit sequence: roughly time-ordered, generated without coordination." },
    { id: "c-d4-fanout", domain: "d4", kind: "concept", term: "Fan-out on write vs read", definition: "Push posts into followers' timelines at write time (fast reads) or merge at read time (cheap writes). Hybrid for celebrities." },
    { id: "c-d4-websocket", domain: "d4", kind: "service", term: "WebSocket", definition: "A long-lived, full-duplex connection over one TCP connection; the usual transport for chat and live updates." },
  ],
});
