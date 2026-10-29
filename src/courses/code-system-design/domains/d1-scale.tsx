import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { CapacityLab } from "../labs";
import { CacheStrategies, LatencyLadder } from "../visuals";

/** Domain 1: back-of-envelope estimates, scaling out, load balancing, caching and CDNs. */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "Scale Foundations",
    world: "The Estimation Foothills",
    weight: 25,
    emoji: "⛰️",
    color: "#2dd4bf",
    summary: "Back-of-envelope estimates, stateless scale-out, load balancers, caches and CDNs: the first tools in every design round.",
  },

  tasks: [
    { id: "1.1", title: "Estimate load and storage", covers: ["QPS from daily active users", "storage and bandwidth math", "latency numbers", "Little's Law"] },
    { id: "1.2", title: "Scale out and balance load", covers: ["vertical vs horizontal scaling", "stateless services", "L4 vs L7 load balancers", "balancing algorithms and health checks"] },
    { id: "1.3", title: "Cache and use CDNs", covers: ["cache-aside, write-through, write-back", "TTL and eviction", "cache stampedes", "Cache-Control and CDNs"] },
  ],

  lessons: [
    {
      id: "d1-estimates",
      level: "junior",
      task: "1.1",
      title: "Back-of-envelope estimates",
      check: ["d1-01", "d1-02"],
      visual: (
        <div className="grid gap-3">
          <LatencyLadder />
          <CodeBlock
            lang="text"
            caption="Round aggressively: one day ≈ 86,400 s ≈ 10⁵ s. Show the units at every step."
            code={`users        100 M daily actives × 10 requests = 1 B requests/day
average QPS  1 B / 86,400 s            ≈ 11,600 QPS (~12 k)
peak QPS     × 2–3 for the daily peak  ≈ 25–35 k QPS
storage      1 M new rows/day × 1 KB   = 1 GB/day ≈ 365 GB/year
bandwidth    12 k QPS × 100 KB         = 1.2 GB/s ≈ 10 Gbps`}
          />
        </div>
      ),
      points: [
        "Estimate before you design: QPS, read/write ratio, storage growth and bandwidth decide which components you need.",
        "Divide by ~10⁵ to go from per-day to per-second. 1 million requests/day is only ~12 QPS on average.",
        "Know the latency ladder: memory ~100 ns, SSD ~100 µs, same-DC round trip ~0.5 ms, cross-ocean ~100 ms.",
        "Little's Law: concurrent requests = arrival rate × time in system (L = λW). It sizes thread pools and connection pools.",
      ],
      tip: "Say your assumptions out loud and round to one significant figure. Interviewers grade the reasoning, not the fourth digit.",
    },
    {
      id: "d1-scaling",
      level: "junior",
      task: "1.2",
      title: "Scale up, then scale out",
      check: ["d1-06", "d1-07"],
      visual: (
        <div className="grid gap-3">
          <Tiles
            tiles={[
              { icon: "🏋️", title: "Vertical (scale up)", text: "Bigger machine: more CPU, RAM, faster disk. Simple and no code changes, but there's a ceiling and it's a single point of failure.", color: "#fbbf24" },
              { icon: "🐝", title: "Horizontal (scale out)", text: "More machines behind a load balancer. Near-linear growth and fault tolerance, but the app must be stateless and data must be shared or split.", color: "#2dd4bf" },
            ]}
          />
          <CodeCompare
            lang="text"
            left={{ title: "Stateful: sticky to one box", code: `request → app-1  (session in app-1's memory)
request → app-2  ✗ "who are you?"` }}
            right={{ title: "Stateless: any box will do", code: `request → app-1 ┐
request → app-2 ┼→ shared session store (Redis)
request → app-3 ┘   or a signed token (JWT)` }}
          />
        </div>
      ),
      points: [
        "Scale up first while it's cheap; scale out when you hit the biggest box, need redundancy, or need to grow elastically.",
        "Stateless services keep no per-user data in process memory, so any instance can serve any request and instances can be added, removed or replaced freely.",
        "Move state to dedicated stores: sessions to Redis or signed tokens, files to object storage, data to the database.",
      ],
      tip: "When you add \"more app servers\" in an interview, immediately say where the state went. It's the follow-up every interviewer asks.",
    },
    {
      id: "d1-lb",
      level: "intermediate",
      task: "1.2",
      title: "Load balancers",
      check: ["d1-10", "d1-11"],
      visual: (
        <div className="grid gap-3">
          <Flow
            color="#2dd4bf"
            steps={[
              { icon: "🌍", label: "DNS / GeoDNS", sub: "Picks a region or edge" },
              { icon: "⚖️", label: "L4 or L7 load balancer", sub: "Health-checks backends, spreads traffic" },
              { icon: "🖥️", label: "App instances", sub: "Stateless, autoscaled" },
              { icon: "🗄️", label: "Data tier", sub: "Cache + database" },
            ]}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🔌", title: "Layer 4 (transport)", text: "Routes TCP/UDP by IP and port. Very fast, protocol-agnostic, can't see URLs or headers.", color: "#60a5fa" },
              { icon: "🧭", title: "Layer 7 (application)", text: "Understands HTTP: routes by path, host, header or cookie, terminates TLS, can retry and rewrite.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Health checks remove failing instances from rotation and add them back when they recover.",
        "Round robin suits uniform requests; least connections (or least outstanding requests) suits uneven or long-lived ones.",
        "Hash-based routing (e.g. by user id) gives affinity for caches or sessions, but rebalances poorly unless it uses consistent hashing.",
        "The load balancer itself must be redundant: an active-passive pair, a managed service, or anycast/DNS across several.",
      ],
      tip: "Name the layer. \"An L7 load balancer that routes /api to the API pool and terminates TLS\" is far stronger than \"a load balancer\".",
    },
    {
      id: "d1-cache",
      level: "intermediate",
      task: "1.3",
      title: "Caching and CDNs",
      check: ["d1-15", "d1-16"],
      visual: (
        <div className="grid gap-3">
          <CacheStrategies />
          <CodeBlock
            lang="text"
            caption="Fingerprinted assets can be cached for a year; personal data must never reach a shared cache."
            code={`/assets/app.3f9a1c.js   Cache-Control: public, max-age=31536000, immutable
/index.html             Cache-Control: no-cache          (revalidate each time)
/api/me                 Cache-Control: private, no-store`}
          />
        </div>
      ),
      points: [
        "Cache-aside is the default: read from the cache, on a miss read the DB and populate the cache with a TTL; on writes, update the DB then delete the key.",
        "TTLs bound staleness; eviction (usually LRU) bounds memory. Add jitter to TTLs so keys don't all expire together.",
        "A cache stampede happens when a hot key expires and thousands of requests hit the DB at once. Coalesce requests (single-flight) or refresh early.",
        "CDNs cache content at edge locations near users: lower latency and far less load on the origin. `Cache-Control` tells them what they may store.",
      ],
      tip: "Always mention invalidation: \"How does the cache learn the data changed?\" is the follow-up to every caching answer.",
    },
  ],

  questions: [
    {
      id: "d1-01",
      domain: "d1",
      lesson: "d1-estimates",
      level: "junior",
      prompt: "A service has 100 million daily active users who each make about 10 requests a day. Roughly what is the average request rate?",
      options: ["About 1,200 QPS", "About 12,000 QPS", "About 120,000 QPS", "About 1.2 million QPS"],
      answer: [1],
      explanation: "100 M × 10 = 1 billion requests/day. 1,000,000,000 / 86,400 s ≈ 11,574, so about 12 k QPS on average. Peaks are usually 2–3× higher.",
    },
    {
      id: "d1-02",
      domain: "d1",
      lesson: "d1-estimates",
      level: "junior",
      prompt: "A round trip inside one data centre takes about 0.5 ms; a main-memory reference takes about 100 ns. Roughly how many times slower is the network round trip?",
      options: ["About 5×", "About 50×", "About 5,000×", "About 5,000,000×"],
      answer: [2],
      explanation: "0.5 ms = 500,000 ns, and 500,000 / 100 = 5,000. That's why chatty service-to-service calls add up quickly and why in-process work is so cheap by comparison.",
    },
    {
      id: "d1-03",
      domain: "d1",
      lesson: "d1-estimates",
      level: "junior",
      prompt: "Using these assumptions, how much storage do the link records need over the retention period?",
      code: `new links:    100 million per month
record size:  500 bytes
retention:    5 years`,
      codeLang: "text",
      options: ["About 300 GB", "About 3 TB", "About 30 TB", "About 300 TB"],
      answer: [1],
      explanation: "100 M × 12 months × 5 years = 6 billion records. 6 × 10⁹ × 500 B = 3 × 10¹² B = 3 TB (before replication and indexes, which you'd mention next).",
    },
    {
      id: "d1-04",
      domain: "d1",
      lesson: "d1-estimates",
      level: "junior",
      prompt: "An image service serves 2,000 downloads per second with an average size of 250 KB. What outbound bandwidth does it need?",
      options: ["About 500 Mbps", "About 4 Gbps", "About 40 Gbps", "About 500 Gbps"],
      answer: [1],
      explanation: "2,000 × 250 KB = 500,000 KB/s = 500 MB/s. Multiply by 8 bits per byte: 4,000 Mbps = 4 Gbps. A CDN would absorb most of it.",
    },
    {
      id: "d1-05",
      domain: "d1",
      lesson: "d1-estimates",
      level: "intermediate",
      prompt: "Using Little's Law, how many requests are in flight at once on average?",
      code: `arrival rate:      2,000 requests / second
time in system:    50 ms per request`,
      codeLang: "text",
      options: ["40", "100", "2,000", "40,000"],
      answer: [1],
      explanation: "L = λ × W = 2,000/s × 0.05 s = 100 concurrent requests. That is the minimum worker, thread or connection count needed before queueing starts.",
    },
    {
      id: "d1-06",
      domain: "d1",
      lesson: "d1-scaling",
      level: "junior",
      prompt: "What is the main difference between vertical and horizontal scaling?",
      options: [
        "Vertical adds more machines; horizontal makes one machine bigger",
        "Vertical makes one machine bigger; horizontal adds more machines that share the load",
        "Vertical scales reads; horizontal scales writes",
        "They are the same thing with different cloud-provider names",
      ],
      answer: [1],
      explanation: "Scale up (vertical) means a bigger box, with a hard ceiling and a single point of failure. Scale out (horizontal) means more boxes behind a load balancer, which needs stateless services.",
    },
    {
      id: "d1-07",
      domain: "d1",
      lesson: "d1-scaling",
      level: "junior",
      prompt: "Why do designs aim for stateless application servers?",
      options: [
        "Stateless servers use less CPU per request",
        "Any instance can serve any request, so instances can be added, removed, or replaced without losing user data",
        "Stateless servers never need a database",
        "Load balancers only work with stateless HTTP methods like GET",
      ],
      answer: [1],
      explanation: "When no user-specific data lives in process memory, the load balancer can send a request anywhere and autoscaling or crashes don't log people out. State moves to shared stores such as Redis or the database.",
    },
    {
      id: "d1-08",
      domain: "d1",
      lesson: "d1-scaling",
      level: "intermediate",
      type: "lines",
      prompt: "Behind a round-robin load balancer with four app servers, users get randomly logged out. Tap the line that is the root cause.",
      code: `sessions = {}                      // in-process map
function login(req):
  token = randomToken()
  sessions[token] = req.userId
  return setCookie("sid", token)
function handle(req):
  userId = sessions[req.cookie("sid")]
  if userId == null: return 401`,
      codeLang: "text",
      answer: [1],
      explanation: "Sessions live in each server's own memory, so a request routed to a different server finds no session. Store sessions in a shared store (e.g. Redis) or use signed tokens; sticky sessions are a weaker workaround.",
    },
    {
      id: "d1-09",
      domain: "d1",
      lesson: "d1-lb",
      level: "junior",
      prompt: "What does a load balancer's health check do?",
      options: [
        "Restarts crashed servers automatically",
        "Periodically probes each backend and stops sending traffic to ones that fail, until they pass again",
        "Measures user satisfaction scores",
        "Encrypts traffic between the load balancer and backends",
      ],
      answer: [1],
      explanation: "Health checks (e.g. GET /healthz every few seconds) take unhealthy instances out of rotation. Restarting them is the job of the orchestrator or autoscaling group.",
    },
    {
      id: "d1-10",
      domain: "d1",
      lesson: "d1-lb",
      level: "intermediate",
      prompt: "You need to send `/api/*` to one server pool and `/images/*` to another, and terminate TLS at the edge. What do you need?",
      options: [
        "A Layer 4 load balancer, because it is faster",
        "A Layer 7 load balancer, because routing by URL path requires reading the HTTP request",
        "DNS round robin with two A records",
        "Two separate domains, since one load balancer can't serve both",
      ],
      answer: [1],
      explanation: "L4 sees only IPs and ports. Path-, host- or header-based routing and TLS termination are Layer 7 features (e.g. an HTTP reverse proxy or application load balancer).",
    },
    {
      id: "d1-11",
      domain: "d1",
      lesson: "d1-lb",
      level: "intermediate",
      type: "match",
      prompt: "Match each load-balancing algorithm to when it fits best.",
      pairs: [
        ["Round robin", "Identical servers and short, uniform requests"],
        ["Least connections", "Requests with very uneven durations or long-lived connections"],
        ["Weighted round robin", "A pool mixing large and small machines"],
        ["Consistent hashing on a key", "Keeping a user's requests on the same cache-warm server"],
      ],
      explanation: "Round robin ignores load; least connections reacts to it; weights account for capacity; consistent hashing gives affinity while moving few keys when servers change.",
    },
    {
      id: "d1-12",
      domain: "d1",
      lesson: "d1-lb",
      level: "senior",
      prompt: "Many load balancers each pick \"the least-loaded backend\" from load reports that are a second old, and they all pile onto the same server. Which technique avoids this herd behaviour cheaply?",
      options: [
        "Power of two choices: pick two backends at random and send to the less loaded of the two",
        "Refresh load reports every minute instead of every second",
        "Always send to the backend with the lowest IP address",
        "Disable health checks so more servers stay in rotation",
      ],
      answer: [0],
      explanation: "Choosing the best of two random candidates gets most of the benefit of least-loaded routing while spreading decisions across servers, so stale shared information doesn't send everyone to the same place.",
    },
    {
      id: "d1-13",
      domain: "d1",
      lesson: "d1-cache",
      level: "junior",
      prompt: "Which data is the best candidate for a cache?",
      options: [
        "A product page read 50,000 times for every one edit",
        "A bank transfer that must be recorded exactly once",
        "Write-only audit logs that are never read",
        "A one-time password that is used once and discarded",
      ],
      answer: [0],
      explanation: "Caches pay off for data that is read far more often than it changes and can tolerate brief staleness. Write-once or read-never data gains nothing.",
    },
    {
      id: "d1-14",
      domain: "d1",
      lesson: "d1-cache",
      level: "junior",
      prompt: "What is the main job of a CDN?",
      options: [
        "Run your database closer to users",
        "Cache and serve content from edge locations near users, cutting latency and load on the origin",
        "Replace the need for a load balancer",
        "Guarantee strong consistency for API responses",
      ],
      answer: [1],
      explanation: "A content delivery network keeps copies of cacheable responses (images, scripts, video, some API responses) at points of presence around the world, so most requests never cross an ocean or reach your servers.",
    },
    {
      id: "d1-15",
      domain: "d1",
      lesson: "d1-cache",
      level: "intermediate",
      type: "order",
      prompt: "Put the cache-aside read path in order for a cache miss.",
      items: [
        "Look the key up in the cache",
        "On a miss, query the database",
        "Store the result in the cache with a TTL",
        "Return the value to the caller",
      ],
      explanation: "In cache-aside (lazy loading) the application owns the logic: check cache, fall back to the DB, populate the cache, return. Writes update the DB and delete the cached key.",
    },
    {
      id: "d1-16",
      domain: "d1",
      lesson: "d1-cache",
      level: "intermediate",
      prompt: "An API response carries this header. Which caches may store it?",
      code: `Cache-Control: private, max-age=600`,
      codeLang: "text",
      options: [
        "Only the user's browser, for up to 10 minutes",
        "The CDN and the browser, for up to 10 minutes",
        "Only the CDN, for up to 600 minutes",
        "No cache at all",
      ],
      answer: [0],
      explanation: "`private` forbids shared caches (CDNs, proxies) from storing the response; the user's own browser may keep it for `max-age` seconds (600 s = 10 min). `no-store` would forbid every cache.",
    },
    {
      id: "d1-17",
      domain: "d1",
      lesson: "d1-cache",
      level: "intermediate",
      type: "lines",
      prompt: "This web server sits behind a CDN. Users sometimes see someone else's account page. Tap the buggy line.",
      code: `server {
  location /assets/ {
    add_header Cache-Control "public, max-age=31536000, immutable";
  }
  location /api/products {
    add_header Cache-Control "public, max-age=60";
  }
  location /api/account {
    add_header Cache-Control "public, max-age=300";
  }
}`,
      codeLang: "text",
      answer: [9],
      explanation: "`public` lets the CDN store one user's account response and serve it to others for 5 minutes. Personal responses need `private, no-store` (or at least `private`). Fingerprinted assets and a shared product list are fine to cache publicly.",
    },
    {
      id: "d1-18",
      domain: "d1",
      lesson: "d1-cache",
      level: "senior",
      type: "choice",
      prompt: "When a hot key expires, thousands of concurrent requests miss and hammer the database. Which two techniques prevent this cache stampede? (Choose two.)",
      options: [
        "Request coalescing: let one request rebuild the key while the others wait for its result",
        "Refresh the value early (or in the background) before the TTL ends, with jittered TTLs",
        "Shorten the TTL of the hot key so it is rebuilt more often",
        "Add more application servers",
        "Disable the cache for hot keys",
      ],
      answer: [0, 1],
      explanation: "Single-flight/locking means one rebuild instead of thousands, and early or probabilistic refresh avoids the synchronised expiry. Shorter TTLs and more app servers make the stampede more frequent or larger.",
    },
    {
      id: "d1-19",
      domain: "d1",
      lesson: "d1-cache",
      level: "senior",
      prompt: "A service handles 10,000 reads/s. Raising the cache hit ratio from 90% to 99% changes the reads reaching the database by what factor?",
      options: ["About 10% fewer", "About 2× fewer", "About 10× fewer", "About 100× fewer"],
      answer: [2],
      explanation: "Misses go from 10% (1,000 reads/s) to 1% (100 reads/s): a 10× drop. Hit ratio sounds like a small change at the top, but the miss rate is what the database feels.",
    },
    {
      id: "d1-20",
      domain: "d1",
      lesson: "d1-cache",
      level: "senior",
      prompt: "Every night a batch job reads every product once through the shared LRU cache, and the next morning the hit ratio collapses. What is the best fix?",
      options: [
        "Have the batch job bypass the cache, or use a scan-resistant policy (e.g. LFU-style) so one-off reads don't evict hot items",
        "Double the cache TTL",
        "Switch the cache to write-through",
        "Run the batch job during peak hours instead",
      ],
      answer: [0],
      explanation: "A full scan fills an LRU cache with items read once, evicting the genuinely hot set (cache pollution). Keep scans out of the cache or use a policy that weighs frequency, not just recency.",
    },
    {
      id: "d1-21",
      domain: "d1",
      lesson: "d1-scaling",
      level: "staff",
      prompt: "Marketing expects 10× traffic for a launch in six weeks. As the staff engineer, what should you drive first?",
      options: [
        "Turn the capacity estimate into a load test against a production-like environment to find the first bottleneck, then fix in that order",
        "Immediately rewrite the service in a faster language",
        "Provision 10× the app servers and assume the rest scales",
        "Move everything to a NoSQL database",
      ],
      answer: [0],
      explanation: "Bottlenecks are rarely where you guess; adding app servers often just moves the pressure to the database or a dependency. Measure, find the first wall (connections, DB writes, a third-party quota), fix it, repeat, and plan graceful degradation.",
    },
    {
      id: "d1-22",
      domain: "d1",
      lesson: "d1-cache",
      level: "staff",
      prompt: "Profiles are cached with a 5-minute TTL. Product requires that people see their own edits immediately, while others may see them a few minutes late. Which design meets that with the least cost?",
      options: [
        "Drop the cache entirely",
        "After a write, delete the key and serve that user's own profile reads from the primary for a short window; everyone else keeps using the cache",
        "Set the TTL to 1 second for every key",
        "Switch to write-back caching so writes are faster",
      ],
      answer: [1],
      explanation: "This is read-your-writes consistency scoped to the author. Invalidation plus a short \"read from source\" window for the writer keeps the cache's benefit for everyone else.",
    },
    {
      id: "d1-23",
      domain: "d1",
      lesson: "d1-lb",
      level: "staff",
      prompt: "A global service runs in three regions. What must be true for it to survive the loss of one whole region without an outage?",
      options: [
        "Each region runs at 100% utilisation to save cost",
        "Traffic steering (GeoDNS or anycast) health-checks regions, and the remaining two have the headroom and data to absorb the failed region's traffic",
        "Every region has its own independent user database with no replication",
        "Clients pin to one region forever",
      ],
      answer: [1],
      explanation: "Failover needs three things: detection and routing away from the bad region, enough spare capacity elsewhere (each region running below ~66% in a three-region N+1 setup), and the data already replicated there.",
    },
  ],

  cards: [
    { id: "c-d1-qps", domain: "d1", kind: "concept", term: "QPS estimate", definition: "Requests per day / 86,400 (≈ 10⁵). Multiply by 2–3 for the peak. 1 M/day ≈ 12 QPS." },
    { id: "c-d1-little", domain: "d1", kind: "concept", term: "Little's Law", definition: "Average items in a system = arrival rate × time in the system (L = λW). Sizes pools and queues." },
    { id: "c-d1-latency", domain: "d1", kind: "concept", term: "Latency ladder", definition: "Memory ~100 ns · SSD read ~100 µs · same-DC round trip ~0.5 ms · HDD seek ~10 ms · cross-ocean ~100 ms." },
    { id: "c-d1-stateless", domain: "d1", kind: "concept", term: "Stateless service", definition: "Keeps no per-user state in memory between requests, so any instance can serve any request and scale out freely." },
    { id: "c-d1-l4l7", domain: "d1", kind: "concept", term: "L4 vs L7 load balancing", definition: "L4 routes TCP/UDP by IP and port; L7 understands HTTP and routes by path, host, headers, cookies, and terminates TLS." },
    { id: "c-d1-healthcheck", domain: "d1", kind: "concept", term: "Health check", definition: "A periodic probe (e.g. /healthz) the load balancer uses to remove failing instances from rotation." },
    { id: "c-d1-cache-aside", domain: "d1", kind: "service", term: "Cache-aside", definition: "App checks the cache, on a miss reads the DB and fills the cache with a TTL; writes update the DB then delete the key." },
    { id: "c-d1-write-through", domain: "d1", kind: "service", term: "Write-through cache", definition: "Writes go to the cache, which synchronously writes the DB. Fresh reads after writes, slower writes." },
    { id: "c-d1-write-back", domain: "d1", kind: "service", term: "Write-back cache", definition: "Writes are acknowledged by the cache and flushed to the DB later. Fast writes, risk of loss on cache failure." },
    { id: "c-d1-redis", domain: "d1", kind: "service", term: "Redis", definition: "In-memory data store used as a cache, session store, rate-limit counter, leaderboard (sorted sets) and lightweight pub/sub." },
    { id: "c-d1-cdn", domain: "d1", kind: "service", term: "CDN", definition: "Edge caches near users that serve static and cacheable content, cutting latency and origin load. Controlled by Cache-Control." },
    { id: "c-d1-stampede", domain: "d1", kind: "concept", term: "Cache stampede", definition: "A hot key expires and many requests rebuild it at once. Fix with request coalescing, early refresh, jittered TTLs." },
  ],

  challenges: [
    {
      id: "ch-sd-p99",
      domain: "d1",
      lesson: "d1-cache",
      title: "Hold p99 under 100 ms",
      goal: "Serve at least 20,000 QPS with p99 latency under 100 ms. Use the cache hit ratio and read replicas.",
      hint: "Every DB node handles ~5,000 QPS. Latency explodes as the busiest node nears 100%, so aim for under ~75%.",
      takeaway: "Caches and replicas both cut per-node read load, and tail latency depends on keeping the busiest node well below saturation.",
      render: (onSolved) => <CapacityLab goal="p99" onSolved={onSolved} />,
    },
  ],
});
