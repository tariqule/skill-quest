import { CodeBlock, CodeCompare, Flow, Ladder, Layers, Tiles } from "@/components/learn/blocks";
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
    summary: "Clean APIs, reliability targets and handling failure, then the classic designs: a URL shortener, a news feed and a chat system, at senior and staff depth.",
  },

  tasks: [
    { id: "4.1", title: "Design clean APIs", covers: ["REST resources and status codes", "gRPC vs REST", "cursor pagination", "versioning and compatibility"] },
    { id: "4.2", title: "Observe and stay reliable", covers: ["SLIs, SLOs, SLAs, error budgets", "timeouts, retries with backoff and jitter", "circuit breakers and bulkheads", "symptom-based alerting"] },
    { id: "4.3", title: "Design classic systems", covers: ["URL shortener", "id generation", "news feed fan-out", "real-time chat"] },
    { id: "4.4", title: "Walk through a full design", covers: ["scoping questions", "estimates", "first design, what breaks and the fix", "trade-offs and wrap-up"] },
  ],

  lessons: [
    {
      id: "d4-start-api",
      level: "beginner",
      task: "4.1",
      title: "APIs: the menu for your app",
      check: ["sd-b4-01", "sd-b4-02"],
      visual: (
        <div className="grid gap-3">
          <Tiles
            cols={2}
            tiles={[
              { icon: "📋", title: "The menu", text: "An API lists what you can ask for and how to ask. You don't need to know how the kitchen works.", color: "#fbbf24" },
              { icon: "🔢", title: "Status codes", text: "Short numbers that say how it went. 200 means OK, 404 means \"not found\", 500 means the server broke.", color: "#2dd4bf" },
            ]}
          />
          <CodeBlock
            lang="text"
            caption="A request names a method and an address. The response starts with a status code."
            code={`GET /users/7          →  200 OK          (here's user 7)
GET /users/999        →  404 Not Found   (no such user)
POST /users           →  201 Created     (new user made)`}
          />
        </div>
      ),
      points: [
        "An **API** (application programming interface) is the list of requests a service accepts and the answers it gives back. It's the menu for your app.",
        "You order from a menu without seeing the kitchen. In the same way, an app can use a service's API without knowing how it works inside.",
        "Web APIs use **HTTP methods** as verbs: GET to read something, POST to create something, DELETE to remove it.",
        "Every response carries a **status code**. Codes in the 200s mean success, the 400s mean the request was wrong, and the 500s mean the server failed.",
      ],
      tip: "In a design interview, write down the three to five main API requests early. It makes clear what you're building.",
    },
    {
      id: "d4-start-reliable",
      level: "beginner",
      task: "4.2",
      title: "Keeping a system up",
      check: ["sd-b4-03", "sd-b4-04"],
      visual: (
        <Ladder dollars caption="more uptime costs more as you climb"
          rungs={[
            { icon: "🙂", name: "99%", text: "Down about 7 hours a month. Fine for a hobby project." },
            { icon: "😀", name: "99.9%", text: "Down about 43 minutes a month. A common target for business apps." },
            { icon: "🤩", name: "99.99%", text: "Down about 4 minutes a month. Hard and expensive to reach." },
          ]}
        />
      ),
      points: [
        "Every system breaks sometimes: a server crashes, a network cable fails, a service you depend on goes slow. Good designs expect this.",
        "**Availability** is the share of time a system works. 99.9% sounds perfect, but it still allows about 43 minutes of downtime a month.",
        "A **timeout** is how long you'll wait before giving up on a call. Without one, a slow service can leave your app waiting forever.",
        "Like a shop with a spare till, systems keep backups ready so one broken part doesn't close the whole shop.",
      ],
      tip: "When you describe a design, ask \"what happens if this part breaks?\" for each box you draw.",
    },
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
            caption="Nouns for resources, HTTP methods for actions, status codes for outcomes."
            code={`GET    /users/7/orders?limit=20&cursor=…   200 list (one page)
POST   /users/7/orders                      201 created + Location
GET    /users/7/orders/42                   200 one order · 404 if missing
PATCH  /users/7/orders/42                   200 partial update
DELETE /users/7/orders/42                   204 no content`}
          />
          <CodeBlock
            lang="json"
            caption="Cursor pagination: the server returns a token that points to the next page."
            code={`{
  "items": [{ "id": 9821, "total": 4200 }],
  "next_cursor": "eyJpZCI6OTgyMX0"
}`}
          />
        </div>
      ),
      points: [
        "Name resources with nouns and let the HTTP method say what to do. Return precise status codes, such as 201 Created, 400 Bad Request, 404 Not Found, 409 Conflict, 429 Too Many Requests and 503 Service Unavailable.",
        "Split every list into pages. A **cursor** is a token that marks where the last page ended. It stays correct when new rows arrive, and the server can change how it works later.",
        "Change APIs without breaking clients. Add optional fields freely. Never rename or remove a field without a warning period, and bump the version only for breaking changes.",
        "REST with JSON suits public APIs and browsers. **gRPC**, which sends typed Protocol Buffer messages over HTTP/2, suits busy internal calls and streaming.",
      ],
      tip: "Sketch the three to five main endpoints, with request and response shapes, early in the interview. It pins down scope and shows the data model.",
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
              { name: "SLI: what you measure", color: "#2dd4bf", items: ["% of requests < 300 ms", "% of requests without 5xx"] },
              { name: "SLO: your target", color: "#60a5fa", items: ["99.9% good over 30 days", "error budget: 0.1%, about 43 min/month"] },
              { name: "SLA: the contract", color: "#fbbf24", items: ["99.5% or service credits"] },
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
        "An **SLI** (service level indicator) is what you measure, such as the share of fast requests. An **SLO** (service level objective) is the target for it, and an **SLA** is the promise in a contract, with a penalty if missed.",
        "An SLO turns \"reliable\" into a number. The **error budget** is the failure the target allows, which you can spend on releases and experiments.",
        "Every network call needs a timeout. Retry only actions that are safe to repeat, and only for temporary errors. Wait longer each time and add some randomness, called jitter.",
        "Retries multiply through each layer of services. Cap them with retry budgets, and use a **circuit breaker** to fail fast while a dependency is down.",
        "**Bulkheads** give each dependency its own pool of threads or connections, so one slow dependency can't use them all up.",
        "Page the on-call person for what users feel, such as errors, slowness or a fast-burning error budget. Don't page for causes like high CPU.",
      ],
      tip: "Saying \"timeouts, retries with backoff and jitter, a circuit breaker, and an SLO with burn-rate alerts\" in one breath shows you've run real systems.",
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
              { icon: "🔗", label: "POST /links", sub: "Get a unique id and encode it in base62" },
              { icon: "🗄️", label: "Store code and URL", sub: "Key-value or SQL, with copies" },
              { icon: "⚡", label: "GET /:code", sub: "Check the cache first: reads far outnumber writes" },
              { icon: "↪️", label: "302 redirect", sub: "Log the click in the background" },
            ]}
          />
          <CodeBlock
            lang="text"
            caption="Base62 uses 0 to 9, a to z and A to Z. The code length grows slowly with the number of links you'll ever create."
            code={`62^6 ≈ 56.8 billion codes
62^7 ≈ 3.5 trillion codes
id 125 → base62 "21"   (2 × 62 + 1)`}
          />
        </div>
      ),
      points: [
        "Ask about scale first: new links per second, redirects per second (often 100 times more), how long links last, custom names and click stats.",
        "Make codes from unique ids, such as a counter that hands out blocks or a Snowflake-style id, and encode them in **base62**. Hashing the long URL instead means handling collisions.",
        "The redirect is a read-heavy lookup by key. Cache popular codes, keep copies of the store, and serve from several regions.",
        "Return 302 (or 307) if every click must reach you for stats. Browsers cache a 301, so repeat clicks may skip your servers.",
      ],
      tip: "Interviewers often ask \"what if two servers make the same code?\" Have a concrete id plan ready.",
    },
    {
      id: "d4-feed-chat",
      level: "staff",
      task: "4.3",
      title: "News feeds and chat",
      sources: [{ title: "System Design Primer: Design the Twitter timeline", url: "https://github.com/donnemartin/system-design-primer/blob/master/solutions/system_design/twitter/README.md", license: "CC BY 4.0" }],
      check: ["d4-19", "d4-20"],
      visual: (
        <div className="grid gap-3">
          <FanoutVisual />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🔌", title: "Chat gateways", text: "Hold long-lived WebSocket connections. A registry records which gateway each user is on, so messages go to the right box.", color: "#fbbf24" },
              { icon: "🧾", title: "Message store", text: "Split by conversation id and ordered by a sequence number per conversation. Clients catch up from the last number they saw.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "**Fan-out on write** builds each follower's timeline when a post is made, so reads are fast but celebrity posts are expensive. **Fan-out on read** merges posts when the feed loads, so writes are cheap but reads are slow.",
        "The usual answer is a mix. Push posts for most authors, pull them for accounts with huge followings, and merge the two when the feed loads.",
        "Store each timeline as a short list of post ids, such as the latest few hundred, and fill in the posts from a separate cache.",
        "Chat needs long-lived connections on gateway servers, a registry of who is connected where, ordered storage per conversation, delivery confirmations, and push notifications for people who are offline.",
        "A **WebSocket** is a long-lived, two-way connection between a client and a server, so the server can push messages the moment they arrive instead of waiting for the client to ask.",
      ],
      tip: "At staff level, drive the trade-off yourself. State the read and write ratio and how followers are spread, then justify the mixed fan-out with numbers.",
    },
  ],

  questions: [
    // ───────────── beginner ─────────────
    {
      id: "sd-b4-01",
      domain: "d4",
      lesson: "d4-start-api",
      level: "beginner",
      prompt: "Which HTTP method do you use to read something, such as fetching a user's profile?",
      options: ["GET", "POST", "DELETE", "STOP"],
      answer: [0],
      explanation: "GET asks the server to send something back without changing it. POST creates something new and DELETE removes something. STOP isn't an HTTP method at all.",
    },
    {
      id: "sd-b4-02",
      domain: "d4",
      lesson: "d4-start-api",
      level: "beginner",
      type: "fill",
      prompt: "You asked for a user that doesn't exist. Fill the gap with the status code the server sends back.",
      code: "GET /users/999\n\nHTTP/1.1 {{1}} Not Found",
      codeLang: "text",
      blanks: [{ options: ["404", "200", "201", "500"], answer: 0 }],
      explanation: "404 means \"I couldn't find what you asked for\". 200 means it worked, 201 means something new was created, and 500 means the server itself broke. Codes in the 400s point at a problem with the request.",
    },
    {
      id: "sd-b4-03",
      domain: "d4",
      lesson: "d4-start-reliable",
      level: "beginner",
      prompt: "What does a timeout do when your app calls another service?",
      options: [
        "It sets how long to wait for an answer before giving up",
        "It makes the other service answer faster when it is busy",
        "It turns the server off at night",
        "It saves a copy of every answer",
      ],
      answer: [0],
      explanation: "A timeout is a limit on waiting. If the other service doesn't answer in time, your app stops waiting and can try again or show a friendly error, instead of hanging forever.",
    },
    {
      id: "sd-b4-04",
      domain: "d4",
      lesson: "d4-start-reliable",
      level: "beginner",
      type: "output",
      prompt: "A system is working 99% of the time. Type what percentage of the time it is down (number only).",
      code: "availability = 99   # percent\ndowntime = 100 - availability\nprint(downtime)",
      codeLang: "python",
      verified: "run",
      answers: ["1"],
      explanation: "100 minus 99 leaves 1% of the time down. That sounds small, but 1% of a month is about 7 hours. That's why serious services aim for 99.9% or better.",
    },

    // ───────────── junior and up ─────────────
    {
      id: "d4-01",
      domain: "d4",
      lesson: "d4-api",
      level: "junior",
      prompt: "Which endpoint follows REST conventions for fetching order 42, which belongs to user 7?",
      options: ["`GET /users/7/orders/42`", "`POST /getOrder?user=7&order=42`", "`GET /fetchUserOrder/7/42/now`", "`PUT /orders/42/get`"],
      answer: [0],
      explanation: "REST names resources with nouns in a hierarchy and lets the HTTP method say what to do. GET reads. Verbs inside the path are a warning sign.",
    },
    {
      id: "d4-02",
      domain: "d4",
      lesson: "d4-api",
      level: "junior",
      prompt: "The API returned this page. How does the client ask for the next one?",
      code: `{
  "items": [{ "id": 9821, "total": 4200 }],
  "next_cursor": "eyJpZCI6OTgyMX0"
}`,
      codeLang: "json",
      options: [
        "Resend with `?cursor=eyJpZCI6OTgyMX0` until no cursor is returned",
        "Decode the cursor, add 20 to the id inside it, and send it back",
        "Send `?page=2` with the same filters as the first request",
        "Repeat the same request; the server remembers each client's place",
      ],
      answer: [0],
      explanation: "A cursor is a token the client passes back without changing it. The server packs the last position inside, here the last id, and can change that format later without breaking any client.",
    },
    {
      id: "d4-03",
      domain: "d4",
      lesson: "d4-api",
      level: "intermediate",
      prompt: "Internal services exchange millions of small, strictly typed messages per second, some as long-lived streams. Which API style fits best?",
      options: [
        "gRPC: typed Protocol Buffer contracts over HTTP/2, with streaming",
        "REST with hand-written JSON parsing on both sides of every call",
        "GraphQL subscriptions over a single public HTTP endpoint",
        "SOAP messages sent over email using the SMTP protocol",
      ],
      answer: [0],
      explanation: "gRPC gives you generated typed clients, a compact binary format, and many calls and streams sharing one HTTP/2 connection. REST with JSON is still the better default for public and browser-facing APIs.",
    },
    {
      id: "d4-04",
      domain: "d4",
      lesson: "d4-api",
      level: "intermediate",
      prompt: "A public API field `user_name` should become `username`, and hundreds of integrations use it. What's the safest plan?",
      options: [
        "Add `username`, keep returning `user_name`, announce a deprecation window, and remove the old field only in a new major version",
        "Rename it in place; clients should update",
        "Return both fields forever without telling anyone, and quietly start filling `user_name` with an empty string once most clients have switched",
        "Create /v2 of every endpoint today",
      ],
      answer: [0],
      explanation: "Adding things doesn't break clients, but renaming or removing does. Add the new field, give people time to move while you track who still uses the old one, then remove it in a new version.",
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
        ["409 Conflict", "The request clashes with the current state, such as a version mismatch"],
        ["503 Service Unavailable", "The server is overloaded or down for maintenance"],
      ],
      explanation: "The 200s mean success, the 400s mean the client must change something, and the 500s mean the server failed. 409 often shows up when two people edit the same record at once.",
    },
    {
      id: "d4-06",
      domain: "d4",
      lesson: "d4-reliability",
      level: "senior",
      type: "lines",
      prompt: "During a short outage of a dependency, this retry policy makes things worse and wastes calls. Tap the two lines to fix.",
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
      explanation: "With no jitter, every client retries at the same moments, sending waves of load all at once. And 400 is the client's own mistake, so retrying a bad request can never work. Add jitter and retry only temporary errors.",
    },
    {
      id: "d4-07",
      domain: "d4",
      lesson: "d4-reliability",
      level: "junior",
      type: "match",
      prompt: "Match each reliability term to its meaning.",
      pairs: [
        ["SLI", "A measured indicator, such as the share of requests served in under 300 ms"],
        ["SLO", "The internal target for an indicator, such as 99.9% over 30 days"],
        ["SLA", "A contract with customers, with penalties if it's missed"],
        ["Error budget", "How much failure the target allows: 100% minus the SLO"],
      ],
      explanation: "You measure SLIs, aim for SLOs, and sign SLAs, which are set looser than your SLOs. The error budget helps teams balance shipping fast against staying reliable.",
    },
    {
      id: "d4-08",
      domain: "d4",
      lesson: "d4-reliability",
      level: "intermediate",
      prompt: "An availability SLO of 99.9% over 30 days allows how much total downtime?",
      options: ["About 4.3 minutes", "About 43 minutes", "About 7.2 hours", "About 3.6 days"],
      answer: [1],
      explanation: "30 days times 24 hours times 60 minutes is 43,200 minutes, and 0.1% of that is 43.2 minutes. Each extra nine divides it by 10, so 99.99% allows about 4.3 minutes.",
    },
    {
      id: "d4-09",
      domain: "d4",
      lesson: "d4-reliability",
      level: "senior",
      prompt: "A request passes through three layers of services, and each layer makes up to 3 attempts to call the next. In the worst case, how many calls reach the bottom service for one user request?",
      options: ["3", "9", "27", "81"],
      answer: [2],
      explanation: "The attempts multiply: 3 times 3 times 3 is 27. Retry at one layer only, usually the one closest to the user or to the failing call, and use retry budgets.",
    },
    {
      id: "d4-10",
      domain: "d4",
      lesson: "d4-reliability",
      level: "senior",
      prompt: "A search request goes to 100 shards at once and waits for all of them. Each shard is slow on 1% of requests, independently. Roughly what share of user requests are slow?",
      options: ["1%", "About 10%", "About 63%", "100%"],
      answer: [2],
      explanation: "The chance that no shard is slow is 0.99 to the power of 100, about 0.366. So about 63% of requests hit at least one slow shard. That's why systems like this care so much about p99 and send backup requests or return partial results.",
    },
    {
      id: "d4-11",
      domain: "d4",
      lesson: "d4-reliability",
      level: "intermediate",
      prompt: "What is a circuit breaker for?",
      options: [
        "After repeated failures, fail fast without calling the dependency for a while, then try one trial call before closing again",
        "Retry every failed call immediately until it succeeds, so callers never see an error from the dependency even while it's struggling to recover",
        "Encrypt traffic between services",
        "Cut power to a server that runs too hot",
      ],
      answer: [0],
      explanation: "It starts closed. Too many failures open it. After a cool-down it goes half-open, and one successful trial closes it again. This stops callers wasting threads on a dead dependency and gives it room to recover.",
    },
    {
      id: "d4-12",
      domain: "d4",
      lesson: "d4-reliability",
      level: "senior",
      type: "lines",
      prompt: "Good practice is to page on what users feel. Tap the line that will wake on-call even when users are fine.",
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
      explanation: "High CPU is a cause, not a symptom. The service may be perfectly healthy at 70%. The burn-rate alert pages when the error budget is draining fast: 14.4 times the normal rate for an hour uses 2% of a 30-day budget. Put CPU on a dashboard or in a ticket instead.",
    },
    {
      id: "d4-13",
      domain: "d4",
      lesson: "d4-reliability",
      level: "senior",
      prompt: "Checkout calls four services one after another, and each is independently 99.9% available. At best, what is checkout's availability?",
      options: ["99.9%", "About 99.6%", "About 99.0%", "About 96%"],
      answer: [1],
      explanation: "Dependencies in a chain multiply: 0.999 to the power of 4 is about 0.996. Every hard dependency on the main path lowers your ceiling, so make the non-essential calls optional or move them to the background.",
    },
    {
      id: "d4-14",
      domain: "d4",
      lesson: "d4-shortener",
      level: "intermediate",
      prompt: "A URL shortener must support up to 100 billion links using base62 codes (0 to 9, a to z, A to Z). What's the shortest fixed code length that fits?",
      options: ["6 characters", "7 characters", "8 characters", "10 characters"],
      answer: [1],
      explanation: "62 to the power of 6 is about 56.8 billion, which is too few. 62 to the power of 7 is about 3.5 trillion, which is plenty. So you need 7 characters.",
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
        "404 Not Found, then let the browser search for the short URL on its own in a new tab",
      ],
      answer: [0],
      explanation: "Browsers cache a 301 by default, so repeat clicks may never reach your server. A 302 or 307 keeps every click coming through you, at the cost of more traffic.",
    },
    {
      id: "d4-16",
      domain: "d4",
      lesson: "d4-shortener",
      level: "senior",
      type: "lines",
      prompt: "Now and then, one customer's short link starts pointing at someone else's URL. Tap the two lines that together cause it.",
      code: `function shorten(longUrl):
  code = md5(longUrl).hex().substring(0, 7)
  db.upsert(code, longUrl)
  return "https://sho.rt/" + code`,
      codeLang: "text",
      answer: [2, 3],
      explanation: "Seven hex characters give only about 268 million codes, so with millions of links some will collide. That's the birthday paradox. The upsert then quietly overwrites the existing link. Use unique ids, or insert with a uniqueness rule and retry on a clash.",
    },
    {
      id: "d4-17",
      domain: "d4",
      lesson: "d4-shortener",
      level: "staff",
      prompt: "The shortener must create 50,000 links a second across three regions, without a round trip to a central coordinator for each one. Which two id strategies work? (Choose two.)",
      options: [
        "Each server reserves a block of ids, such as a million at a time, from a coordination service and hands them out locally",
        "Snowflake-style ids built from a timestamp, a machine id and a per-machine sequence, generated locally",
        "A single database auto-increment column that every region calls",
        "A random 4-character code without checking for duplicates",
      ],
      answer: [0, 1],
      explanation: "Both avoid asking a coordinator for every link. Reserving blocks only needs the coordinator once per block, and Snowflake ids only need each machine to have a unique id. A single counter is a bottleneck across regions, and 4 random characters collide almost at once.",
    },
    {
      id: "d4-18",
      domain: "d4",
      lesson: "d4-shortener",
      level: "senior",
      prompt: "A Snowflake-style 64-bit id uses 41 bits for a millisecond timestamp, 10 bits for the machine id and 12 bits for a sequence. How many ids can one machine make per millisecond?",
      options: ["1,024", "4,096", "65,536", "2 billion"],
      answer: [1],
      explanation: "The sequence has 12 bits, and 2 to the power of 12 is 4,096 ids per millisecond per machine. The 10 machine bits allow 1,024 machines, and 41 bits of milliseconds last about 69 years.",
    },
    {
      id: "d4-19",
      domain: "d4",
      lesson: "d4-feed-chat",
      level: "senior",
      prompt: "A feed uses fan-out on write. An account with 30 million followers posts, and the timeline workers fall hours behind. What's the standard fix?",
      options: [
        "Skip fan-out for huge accounts and merge their posts in when a feed loads",
        "Fan out the celebrity's posts synchronously to every follower before confirming",
        "Switch every user on the platform over to fan-out on read",
        "Cap every account at 1 million followers so fan-out stays small",
      ],
      answer: [0],
      explanation: "Writing into 30 million timelines for each post is the celebrity problem. Pulling only those few accounts at read time keeps feeds cheap for everyone else. Switching everyone to pulling would make every feed load expensive.",
    },
    {
      id: "d4-20",
      domain: "d4",
      lesson: "d4-feed-chat",
      level: "staff",
      prompt: "A chat system holds 10 million WebSocket connections at once, about 100,000 per gateway server. When Ana messages Bo, how does the message reach Bo's connection?",
      options: [
        "About 100 gateways; a connection registry maps each online user to their gateway, and the chat service routes (or publishes) the message to Bo's gateway",
        "About 1,000 gateways; the message is broadcast to all of them",
        "About 100 gateways; Bo's client polls the database every second",
        "A single gateway holds all connections, so no routing is needed: every message is written straight to the socket of whoever it's for, and you add memory to it as users grow",
      ],
      answer: [0],
      explanation: "10 million divided by 100,000 is 100 gateways. Broadcasting to all of them would multiply traffic by 100, and polling adds delay and load. A registry of which gateway each user is on, kept in a fast store and updated as people connect and disconnect, lets you route straight there.",
    },
    {
      id: "d4-21",
      domain: "d4",
      lesson: "d4-feed-chat",
      level: "staff",
      type: "order",
      prompt: "Put the steps of delivering a chat message to an online recipient in order.",
      items: [
        "The sender's client sends the message over its WebSocket to a chat gateway",
        "The chat service saves it with the next sequence number for that conversation",
        "The service looks up which gateway holds the recipient's connection",
        "That gateway pushes the message down the recipient's WebSocket",
        "The recipient's client confirms, and the message is marked delivered",
      ],
      explanation: "Save the message before delivering it, so nothing is lost if delivery fails. The sequence number keeps messages in order and lets a reconnecting client catch up from the last one it saw.",
    },
    {
      id: "d4-22",
      domain: "d4",
      lesson: "d4-feed-chat",
      level: "staff",
      prompt: "Why do feed systems usually cache each user's timeline as a short list of post ids rather than full posts?",
      options: [
        "Ids are tiny, so millions of timelines fit in memory, and edits or deletions update one post record instead of every timeline copy",
        "Post ids sort alphabetically, which is how feeds are ranked, so storing ids means timelines come back in the right order without any sorting at read time",
        "Caches can't store JSON",
        "It makes fan-out on write unnecessary",
      ],
      answer: [0],
      explanation: "Timelines hold references, such as the latest few hundred ids, and a separate post cache fills in the content. That caps memory use and keeps one source of truth for each post.",
    },
    {
      id: "d4-23",
      domain: "d4",
      lesson: "d4-reliability",
      level: "staff",
      prompt: "A design review finds checkout calling six services in a chain: payments, inventory, recommendations, analytics, email and loyalty points. Which change helps the most?",
      options: [
        "Keep only payments and inventory on the critical path; make the rest asynchronous (events) or optional with tight timeouts and fallbacks",
        "Add retries to all six calls",
        "Merge all six services into checkout as one deployable, so every call becomes in-process and none of them can time out or fail on their own anymore",
        "Raise every timeout to 30 seconds",
      ],
      answer: [0],
      explanation: "Each dependency in the chain lowers availability and adds delay. Checkout only truly needs the payment and the stock reservation. Emails, analytics and points can follow from an OrderPlaced event, and recommendations can simply be left out when they're slow.",
    },
  ],

  cards: [
    { id: "c-d4-rest", domain: "d4", kind: "concept", term: "REST", definition: "Resources named as nouns (URLs), actions as HTTP methods, outcomes as status codes. Each request stands on its own." },
    { id: "c-d4-grpc", domain: "d4", kind: "service", term: "gRPC", definition: "A framework for calling other services using Protocol Buffer contracts over HTTP/2. It gives typed generated clients, a compact format and streaming." },
    { id: "c-d4-cursor", domain: "d4", kind: "concept", term: "Cursor pagination", definition: "The server returns a next_cursor token and the client sends it back. It stays correct when rows are added and costs the same at any depth." },
    { id: "c-d4-slo", domain: "d4", kind: "concept", term: "SLO", definition: "A target for a measured indicator over a period, for example 99.9% of requests succeeding over 30 days." },
    { id: "c-d4-error-budget", domain: "d4", kind: "concept", term: "Error budget", definition: "100% minus the SLO: the failure you can afford. At 99.9% over 30 days it's about 43 minutes. Spend it on releases, and freeze risky changes when it runs out." },
    { id: "c-d4-backoff", domain: "d4", kind: "concept", term: "Exponential backoff with jitter", definition: "Between retries, wait longer each time (doubling, up to a cap) and add some randomness, so clients don't all retry in the same instant." },
    { id: "c-d4-circuit-breaker", domain: "d4", kind: "service", term: "Circuit breaker", definition: "Starts closed. Repeated failures open it, so calls fail fast. After a cool-down it lets one trial through, and closes again if that works." },
    { id: "c-d4-bulkhead", domain: "d4", kind: "service", term: "Bulkhead", definition: "Separate pools of resources for each dependency or customer, so one slow dependency can't use up everything." },
    { id: "c-d4-burn-rate", domain: "d4", kind: "concept", term: "Burn-rate alert", definition: "Pages when the error budget is being used up much faster than it can last, for example 14.4 times the normal rate over 1 hour." },
    { id: "c-d4-base62", domain: "d4", kind: "service", term: "Base62 encoding", definition: "Writes a number using 0 to 9, a to z and A to Z. Seven characters give about 3.5 trillion codes." },
    { id: "c-d4-snowflake", domain: "d4", kind: "service", term: "Snowflake id", definition: "A 64-bit id made of a 41-bit millisecond timestamp, a 10-bit machine id and a 12-bit sequence. Ids are roughly in time order and need no coordination." },
    { id: "c-d4-fanout", domain: "d4", kind: "concept", term: "Fan-out on write or on read", definition: "Push posts into followers' timelines when they're written (fast reads), or merge them when the feed is read (cheap writes). Mix the two for celebrities." },
    { id: "c-d4-websocket", domain: "d4", kind: "service", term: "WebSocket", definition: "A long-lived, two-way connection over one TCP connection. It's the usual way to carry chat and live updates." },
  ],
});
