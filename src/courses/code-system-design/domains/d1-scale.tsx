import { CodeBlock, CodeCompare, Flow, Ladder, Tiles } from "@/components/learn/blocks";
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
    summary: "Quick estimates, adding more servers, load balancers, caches and CDNs. These are the first tools you reach for in any design round.",
  },

  tasks: [
    { id: "1.1", title: "Estimate load and storage", covers: ["QPS from daily active users", "storage and bandwidth math", "latency numbers", "Little's Law"] },
    { id: "1.2", title: "Scale out and balance load", covers: ["vertical vs horizontal scaling", "stateless services", "L4 vs L7 load balancers", "balancing algorithms and health checks"] },
    { id: "1.3", title: "Cache and use CDNs", covers: ["cache-aside, write-through, write-back", "TTL and eviction", "cache stampedes", "Cache-Control and CDNs"] },
  ],

  lessons: [
    {
      id: "d1-start-what",
      level: "beginner",
      task: "1.2",
      title: "What is system design?",
      check: ["sd-b1-01", "sd-b1-02"],
      visual: (
        <Flow
          color="#2dd4bf"
          steps={[
            { icon: "📱", label: "Client", sub: "Your phone or browser asks for something" },
            { icon: "🖥️", label: "Server", sub: "A computer that runs the app's code" },
            { icon: "🗄️", label: "Database", sub: "Where the data is kept safely" },
            { icon: "📨", label: "Response", sub: "The answer travels back to you" },
          ]}
        />
      ),
      points: [
        "**System design** is planning how the pieces of a big app fit together, so it keeps working when millions of people use it.",
        "Think of a restaurant. Customers are the **clients**, the kitchen is the **server** that does the work, and the pantry is the **database** where ingredients are stored.",
        "A **request** is one question a client sends, like \"show me my inbox\". The server sends back a **response** with the answer.",
        "One cook can feed a few tables. Feeding a stadium needs more cooks, more counters and a plan. That plan is the system design.",
      ],
      tip: "In an interview, start by drawing the simplest path: client, server, database. Then improve the part that would break first.",
    },
    {
      id: "d1-start-numbers",
      level: "beginner",
      task: "1.1",
      title: "Why designers count requests",
      check: ["sd-b1-03", "sd-b1-04"],
      visual: (
        <Ladder
          rungs={[
            { icon: "🧑", name: "A few users", text: "One server and one database handle everything easily." },
            { icon: "🏘️", name: "Thousands of users", text: "You add a cache so the database does less repeated work." },
            { icon: "🏙️", name: "Millions of users", text: "You run many servers and spread traffic across them." },
            { icon: "🌍", name: "Users worldwide", text: "You copy content to places near people so it loads fast." },
          ]}
        />
      ),
      points: [
        "Before choosing parts, designers count: how many people, how many requests, how much data. The numbers tell you what will break.",
        "**QPS** means queries per second: how many requests arrive each second. It's like counting customers walking into a shop every second.",
        "A day has 86,400 seconds, which people round to about 100,000. So 1 million requests a day is only about 12 every second.",
        "**Latency** is how long one request takes, start to finish. Users notice when a page takes more than a few hundred milliseconds.",
      ],
      tip: "Rough numbers are fine. Saying \"about 10,000 requests a second\" is more useful than staying quiet because you don't know the exact figure.",
    },
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
            caption="Round hard: one day is 86,400 seconds, or about 10⁵. Write the units at every step."
            code={`users        100 M daily actives × 10 requests = 1 B requests/day
average QPS  1 B / 86,400 s            ≈ 11,600 QPS (~12 k)
peak QPS     × 2–3 for the daily peak  ≈ 25–35 k QPS
storage      1 M new rows/day × 1 KB   = 1 GB/day ≈ 365 GB/year
bandwidth    12 k QPS × 100 KB         = 1.2 GB/s ≈ 10 Gbps`}
          />
        </div>
      ),
      points: [
        "Estimate before you design. Requests per second, the mix of reads and writes, storage growth and bandwidth decide which parts you need.",
        "To turn a daily number into a per-second number, divide by about 100,000. So 1 million requests a day is only about 12 per second on average.",
        "Learn the rough speed ladder: memory takes about 100 ns, an SSD read about 100 µs, a trip inside one data centre about 0.5 ms, and a trip across an ocean about 100 ms.",
        "**Little's Law** says the number of requests in flight is the arrival rate times how long each one takes. You use it to size thread pools and connection pools.",
      ],
      tip: "Say your assumptions out loud and round to one significant figure. Interviewers grade your reasoning, not the fourth digit.",
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
              { icon: "🏋️", title: "Vertical (scale up)", text: "A bigger machine with more CPU, more RAM and a faster disk. It's simple and needs no code changes, but there's a size limit and one machine can fail.", color: "#fbbf24" },
              { icon: "🐝", title: "Horizontal (scale out)", text: "More machines behind a load balancer. You can keep growing and survive a failed machine, but the app must keep no user data in memory.", color: "#2dd4bf" },
            ]}
          />
          <CodeCompare
            lang="text"
            left={{ title: "Stateful: stuck to one box", code: `request → app-1  (session in app-1's memory)
request → app-2  ✗ "who are you?"` }}
            right={{ title: "Stateless: any box will do", code: `request → app-1 ┐
request → app-2 ┼→ shared session store (Redis)
request → app-3 ┘   or a signed token (JWT)` }}
          />
        </div>
      ),
      points: [
        "Scaling up (a bigger machine) is the cheap first step. Scale out (more machines) when you hit the biggest box, need a backup, or need to grow and shrink with demand.",
        "A **stateless** service keeps no per-user data in its own memory. Any copy can answer any request, so you can add, remove or replace copies freely.",
        "Move the state into stores built for it. Sessions go to Redis or signed tokens, files go to object storage, and records go to the database.",
      ],
      tip: "When you add \"more app servers\" in an interview, say right away where the state went. Every interviewer asks that next.",
    },
    {
      id: "d1-lb",
      level: "intermediate",
      task: "1.2",
      title: "Load balancers",
      check: ["d1-10", "d1-11"],
      sources: [{ title: "System Design Primer: Load balancer", url: "https://github.com/donnemartin/system-design-primer#load-balancer", license: "CC BY 4.0" }],
      visual: (
        <div className="grid gap-3">
          <Flow
            color="#2dd4bf"
            steps={[
              { icon: "🌍", label: "DNS / GeoDNS", sub: "Picks a region or edge" },
              { icon: "⚖️", label: "L4 or L7 load balancer", sub: "Checks servers are healthy and spreads traffic" },
              { icon: "🖥️", label: "App instances", sub: "Stateless, added and removed automatically" },
              { icon: "🗄️", label: "Data tier", sub: "Cache and database" },
            ]}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🔌", title: "Layer 4 (transport)", text: "Routes TCP or UDP traffic by IP address and port. Very fast and works with any protocol, but it can't see URLs or headers.", color: "#60a5fa" },
              { icon: "🧭", title: "Layer 7 (application)", text: "Understands HTTP. It can route by path, host, header or cookie, handle TLS, retry and rewrite requests.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "A **load balancer** spreads incoming requests across many servers. Its **health checks** take failing servers out of the rotation and add them back once they recover.",
        "Round robin takes turns and suits requests that are all alike. Least connections sends work to the least busy server, which suits uneven or long-lived requests.",
        "Routing by a hash of a key, such as the user id, keeps a user on the same server. Without consistent hashing, it reshuffles badly when servers change.",
        "The load balancer must not be a single point of failure either. Use a pair with automatic failover, a managed service, or several behind DNS or anycast.",
      ],
      tip: "Name the layer. \"An L7 load balancer that sends /api to the API servers and handles TLS\" is much stronger than \"a load balancer\".",
    },
    {
      id: "d1-cache",
      level: "intermediate",
      task: "1.3",
      title: "Caching and CDNs",
      check: ["d1-15", "d1-16"],
      sources: [
        { title: "System Design Primer: Cache", url: "https://github.com/donnemartin/system-design-primer#cache", license: "CC BY 4.0" },
        { title: "MDN: HTTP caching", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/Caching", license: "CC BY-SA 2.5" },
      ],
      visual: (
        <div className="grid gap-3">
          <CacheStrategies />
          <CodeBlock
            lang="text"
            caption="Files with a content hash in the name can be cached for a year. Personal data must never land in a shared cache."
            code={`/assets/app.3f9a1c.js   Cache-Control: public, max-age=31536000, immutable
/index.html             Cache-Control: no-cache          (revalidate each time)
/api/me                 Cache-Control: private, no-store`}
          />
        </div>
      ),
      points: [
        "**Cache-aside** is the usual pattern. Read from the cache. On a miss, read the database and save the result in the cache with a TTL. On a write, update the database, then delete the key.",
        "A **TTL** (time to live) limits how stale an entry can get. Eviction, usually least-recently-used, limits memory. Add a little randomness to TTLs so keys don't all expire together.",
        "A **cache stampede** is when a popular key expires and thousands of requests hit the database at once. Let one request rebuild it while the rest wait, or refresh it early.",
        "A **CDN** keeps copies of content in locations near users, so pages load faster and your servers do less work. The `Cache-Control` header tells it what it may store.",
      ],
      tip: "Always mention invalidation. \"How does the cache find out the data changed?\" follows every caching answer.",
    },
  ],

  questions: [
    // ───────────── beginner ─────────────
    {
      id: "sd-b1-01",
      domain: "d1",
      lesson: "d1-start-what",
      level: "beginner",
      prompt: "In the restaurant picture of an app, which part plays the role of the kitchen that does the work?",
      options: ["The server", "The client", "The database", "The internet cable"],
      answer: [0],
      explanation: "The server runs the app's code and prepares each answer, just like a kitchen prepares each order. The client is the customer asking, and the database is the pantry where things are stored.",
    },
    {
      id: "sd-b1-02",
      domain: "d1",
      lesson: "d1-start-what",
      level: "beginner",
      prompt: "Your phone asks a server \"show me my messages\". What is that question called?",
      options: ["A request", "A response", "A database", "A cache"],
      answer: [0],
      explanation: "The client sends a request, and the server sends back a response with the answer. Almost every design you'll study is a story about requests and responses moving between parts.",
    },
    {
      id: "sd-b1-03",
      domain: "d1",
      lesson: "d1-start-numbers",
      level: "beginner",
      prompt: "What does QPS stand for?",
      options: ["Queries per second", "Quality per server", "Queue processing speed", "Quick page size"],
      answer: [0],
      explanation: "QPS is queries (requests) per second: how many arrive each second. It's the first number designers estimate, because it tells you how busy every part will be.",
    },
    {
      id: "sd-b1-04",
      domain: "d1",
      lesson: "d1-start-numbers",
      level: "beginner",
      type: "output",
      prompt: "A small site gets 100,000 requests a day. Using about 100,000 seconds in a day, type the average requests per second (number only).",
      code: "requests_per_day = 100_000\nseconds_per_day  = 100_000   # rounded from 86,400\nqps = requests_per_day / seconds_per_day",
      codeLang: "python",
      answers: ["1"],
      explanation: "100,000 divided by 100,000 is 1, so on average about one request arrives each second. That's tiny: one small server handles it easily. Numbers like this tell you when you don't need anything fancy.",
    },

    // ───────────── junior and up ─────────────
    {
      id: "d1-01",
      domain: "d1",
      lesson: "d1-estimates",
      level: "junior",
      prompt: "A service has 100 million daily active users, and each makes about 10 requests a day. Roughly what is the average request rate?",
      options: ["About 1,200 QPS", "About 12,000 QPS", "About 120,000 QPS", "About 1.2 million QPS"],
      answer: [1],
      explanation: "100 million times 10 is 1 billion requests a day. Divide by 86,400 seconds and you get about 11,574, so roughly 12,000 QPS on average. The daily peak is usually 2 to 3 times higher.",
    },
    {
      id: "d1-02",
      domain: "d1",
      lesson: "d1-estimates",
      level: "junior",
      prompt: "A round trip inside one data centre takes about 0.5 ms. Reading main memory takes about 100 ns. Roughly how many times slower is the network round trip?",
      options: ["About 5×", "About 50×", "About 5,000×", "About 5,000,000×"],
      answer: [2],
      explanation: "0.5 ms is 500,000 ns, and 500,000 divided by 100 is 5,000. That's why lots of small calls between services add up fast, while work done in memory is cheap by comparison.",
    },
    {
      id: "d1-03",
      domain: "d1",
      lesson: "d1-estimates",
      level: "junior",
      prompt: "Using these assumptions, how much storage do the link records need over the whole retention period?",
      code: `new links:    100 million per month
record size:  500 bytes
retention:    5 years`,
      codeLang: "text",
      options: ["About 300 GB", "About 3 TB", "About 30 TB", "About 300 TB"],
      answer: [1],
      explanation: "100 million a month, times 12 months, times 5 years, gives 6 billion records. 6 billion times 500 bytes is 3 trillion bytes, which is 3 TB. Replication and indexes add more on top, so mention them next.",
    },
    {
      id: "d1-04",
      domain: "d1",
      lesson: "d1-estimates",
      level: "junior",
      prompt: "An image service serves 2,000 downloads per second, and the average image is 250 KB. How much outbound bandwidth does it need?",
      options: ["About 500 Mbps", "About 4 Gbps", "About 40 Gbps", "About 500 Gbps"],
      answer: [1],
      explanation: "2,000 times 250 KB is 500,000 KB a second, which is 500 MB a second. Each byte is 8 bits, so that's 4,000 Mbps, or 4 Gbps. A CDN would carry most of it for you.",
    },
    {
      id: "d1-05",
      domain: "d1",
      lesson: "d1-estimates",
      level: "intermediate",
      prompt: "Using Little's Law, how many requests are in flight at once, on average?",
      code: `arrival rate:      2,000 requests / second
time in system:    50 ms per request`,
      codeLang: "text",
      options: ["40", "100", "2,000", "40,000"],
      answer: [1],
      explanation: "Multiply the arrival rate by the time each request spends in the system: 2,000 a second times 0.05 seconds is 100. That's the fewest workers, threads or connections you need before requests start queueing.",
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
      explanation: "Scaling up (vertical) means a bigger machine. It has a hard size limit, and if it fails, everything fails. Scaling out (horizontal) means more machines behind a load balancer, which only works if the services are stateless.",
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
      explanation: "When no user data lives in a server's memory, the load balancer can send a request anywhere. Adding servers or losing one doesn't log anyone out. The state lives in shared stores like Redis or the database.",
    },
    {
      id: "d1-08",
      domain: "d1",
      lesson: "d1-scaling",
      level: "intermediate",
      type: "lines",
      prompt: "Four app servers sit behind a round-robin load balancer, and users get logged out at random. Tap the line that causes it.",
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
      explanation: "Each server keeps sessions in its own memory. When the next request lands on a different server, that server has never heard of the session. Keep sessions in a shared store like Redis, or use signed tokens. Sticky sessions are a weaker workaround.",
    },
    {
      id: "d1-09",
      domain: "d1",
      lesson: "d1-lb",
      level: "junior",
      prompt: "What does a load balancer's health check do?",
      options: [
        "Restarts crashed servers automatically",
        "Regularly probes each backend and stops sending it traffic if it fails, until it passes again",
        "Measures user satisfaction scores",
        "Encrypts traffic between the load balancer and backends",
      ],
      answer: [1],
      explanation: "A health check calls something like GET /healthz every few seconds and takes unhealthy servers out of rotation. Restarting them is a different job, done by the orchestrator or the autoscaling group.",
    },
    {
      id: "d1-10",
      domain: "d1",
      lesson: "d1-lb",
      level: "intermediate",
      prompt: "You need to send `/api/*` to one group of servers and `/images/*` to another, and handle TLS at the edge. What do you need?",
      options: [
        "A Layer 4 load balancer, because it is faster",
        "A Layer 7 load balancer, because routing by URL path requires reading the HTTP request",
        "DNS round robin with two A records",
        "Two separate domains, since one load balancer can't serve both",
      ],
      answer: [1],
      explanation: "A Layer 4 balancer only sees IP addresses and ports. Routing by path, host or header, and handling TLS, need something that reads HTTP: a Layer 7 load balancer, such as a reverse proxy or an application load balancer.",
    },
    {
      id: "d1-11",
      domain: "d1",
      lesson: "d1-lb",
      level: "intermediate",
      type: "match",
      prompt: "Match each load-balancing method to when it fits best.",
      pairs: [
        ["Round robin", "Identical servers and short, similar requests"],
        ["Least connections", "Requests that vary a lot in length, or long-lived connections"],
        ["Weighted round robin", "A group that mixes large and small machines"],
        ["Consistent hashing on a key", "Keeping a user's requests on the same server, whose cache is already warm"],
      ],
      explanation: "Round robin ignores how busy servers are. Least connections reacts to it. Weights account for bigger machines. Consistent hashing keeps a key on one server and moves few keys when servers change.",
    },
    {
      id: "d1-12",
      domain: "d1",
      lesson: "d1-lb",
      level: "senior",
      prompt: "Many load balancers each pick \"the least-loaded server\" from load reports that are a second old, and they all pile onto the same server. Which cheap technique avoids this herd?",
      options: [
        "Power of two choices: pick two servers at random and send to the less loaded of the two",
        "Refresh load reports every minute instead of every second",
        "Always send to the server with the lowest IP address",
        "Disable health checks so more servers stay in rotation",
      ],
      answer: [0],
      explanation: "Picking the better of two random servers gets most of the benefit of least-loaded routing. Because each balancer picks different pairs, stale reports no longer send everyone to the same place.",
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
        "A one-time password that is used once and thrown away",
      ],
      answer: [0],
      explanation: "A cache pays off when data is read far more often than it changes, and a few seconds of staleness is fine. Data that's written once or never read gains nothing from a cache.",
    },
    {
      id: "d1-14",
      domain: "d1",
      lesson: "d1-cache",
      level: "junior",
      prompt: "What is the main job of a CDN?",
      options: [
        "Run your database closer to users",
        "Cache and serve content from locations near users, cutting delay and load on your servers",
        "Replace the need for a load balancer",
        "Guarantee strong consistency for API responses",
      ],
      answer: [1],
      explanation: "A content delivery network keeps copies of cacheable responses, like images, scripts and video, in locations around the world. Most requests are answered nearby and never cross an ocean or reach your servers.",
    },
    {
      id: "d1-15",
      domain: "d1",
      lesson: "d1-cache",
      level: "intermediate",
      type: "order",
      prompt: "Put the cache-aside read path in order, for a cache miss.",
      items: [
        "Look the key up in the cache",
        "On a miss, query the database",
        "Store the result in the cache with a TTL",
        "Return the value to the caller",
      ],
      explanation: "In cache-aside, the application does the work: check the cache, fall back to the database, fill the cache, and return. Writes update the database and then delete the cached key.",
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
      explanation: "`private` stops shared caches, like CDNs and proxies, from storing the response. The user's own browser may keep it for `max-age` seconds, and 600 seconds is 10 minutes. `no-store` would forbid every cache.",
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
      explanation: "`public` lets the CDN store one user's account page and hand it to other people for 5 minutes. Personal responses need `private, no-store`, or at least `private`. The hashed assets and the shared product list are fine to cache publicly.",
    },
    {
      id: "d1-18",
      domain: "d1",
      lesson: "d1-cache",
      level: "senior",
      type: "choice",
      prompt: "When a popular key expires, thousands of requests miss at once and hammer the database. Which two techniques prevent this cache stampede? (Choose two.)",
      options: [
        "Request coalescing: let one request rebuild the key while the others wait for its result",
        "Refresh the value early, or in the background, before the TTL ends, and add randomness to TTLs",
        "Shorten the TTL of the hot key so it is rebuilt more often",
        "Add more application servers",
        "Disable the cache for hot keys",
      ],
      answer: [0, 1],
      explanation: "Coalescing means one rebuild instead of thousands. Early refresh avoids everyone missing at the same moment. Shorter TTLs make stampedes happen more often, and more app servers just send more requests to the database.",
    },
    {
      id: "d1-19",
      domain: "d1",
      lesson: "d1-cache",
      level: "senior",
      prompt: "A service handles 10,000 reads a second. Raising the cache hit ratio from 90% to 99% changes the reads reaching the database by what factor?",
      options: ["About 10% fewer", "About 2× fewer", "About 10× fewer", "About 100× fewer"],
      answer: [2],
      explanation: "Misses drop from 10%, which is 1,000 reads a second, to 1%, which is 100. That's 10 times fewer. The hit ratio barely seems to move, but the database feels the miss rate.",
    },
    {
      id: "d1-20",
      domain: "d1",
      lesson: "d1-cache",
      level: "senior",
      prompt: "Every night a batch job reads every product once through the shared LRU cache. The next morning the hit ratio collapses. What's the best fix?",
      options: [
        "Have the batch job skip the cache, or use a scan-resistant policy (one that weighs how often items are used) so one-off reads don't push out popular items",
        "Double the cache TTL",
        "Switch the cache to write-through",
        "Run the batch job during peak hours instead",
      ],
      answer: [0],
      explanation: "A full scan fills an LRU cache with items read only once, pushing out the truly popular ones. Keep scans out of the cache, or use a policy that counts how often items are used, not just how recently.",
    },
    {
      id: "d1-21",
      domain: "d1",
      lesson: "d1-scaling",
      level: "staff",
      prompt: "Marketing expects 10 times the traffic for a launch in six weeks. As the staff engineer, what should you drive first?",
      options: [
        "Turn the capacity estimate into a load test on a production-like setup, find the first bottleneck, and fix things in that order",
        "Rewrite the service in a faster language straight away",
        "Add 10 times the app servers and assume the rest scales",
        "Move everything to a NoSQL database",
      ],
      answer: [0],
      explanation: "Bottlenecks are rarely where you'd guess. More app servers often just push the pressure onto the database or another dependency. Measure, find the first wall, such as connections, database writes or a third-party quota, fix it, and repeat. Plan how the system degrades gracefully too.",
    },
    {
      id: "d1-22",
      domain: "d1",
      lesson: "d1-cache",
      level: "staff",
      prompt: "Profiles are cached for 5 minutes. Product wants people to see their own edits immediately, while others may see them a few minutes late. Which design does that most cheaply?",
      options: [
        "Drop the cache entirely",
        "After a write, delete the key and serve that user's own profile reads from the primary for a short window; everyone else keeps using the cache",
        "Set the TTL to 1 second for every key",
        "Switch to write-back caching so writes are faster",
      ],
      answer: [1],
      explanation: "This is called read-your-writes, and it only needs to apply to the author. Deleting the key, plus a short window where the writer reads from the source, keeps the cache working for everyone else.",
    },
    {
      id: "d1-23",
      domain: "d1",
      lesson: "d1-lb",
      level: "staff",
      prompt: "A global service runs in three regions. What must be true for it to survive losing a whole region without an outage?",
      options: [
        "Each region runs at 100% utilisation to save cost",
        "Traffic steering (GeoDNS or anycast) checks region health, and the other two regions have the spare capacity and the data to take over",
        "Every region has its own user database with no replication",
        "Clients stay pinned to one region forever",
      ],
      answer: [1],
      explanation: "Failover needs three things. You must detect the bad region and route away from it. The other regions need spare capacity, so with three regions each should run below about 66%. And the data must already be copied there.",
    },
  ],

  cards: [
    { id: "c-d1-qps", domain: "d1", kind: "concept", term: "QPS estimate", definition: "Divide requests per day by 86,400 (about 100,000). Multiply by 2 or 3 for the peak. 1 million a day is about 12 per second." },
    { id: "c-d1-little", domain: "d1", kind: "concept", term: "Little's Law", definition: "The average number of requests in a system is the arrival rate times the time each one spends inside. You use it to size pools and queues." },
    { id: "c-d1-latency", domain: "d1", kind: "concept", term: "Latency ladder", definition: "Memory about 100 ns, SSD read about 100 µs, a trip within one data centre about 0.5 ms, a disk seek about 10 ms, a trip across an ocean about 100 ms." },
    { id: "c-d1-stateless", domain: "d1", kind: "concept", term: "Stateless service", definition: "Keeps no per-user data in memory between requests, so any copy can serve any request and you can add copies freely." },
    { id: "c-d1-l4l7", domain: "d1", kind: "concept", term: "L4 versus L7 load balancing", definition: "Layer 4 routes TCP or UDP by IP and port. Layer 7 understands HTTP, routes by path, host, headers or cookies, and handles TLS." },
    { id: "c-d1-healthcheck", domain: "d1", kind: "concept", term: "Health check", definition: "A regular probe, such as GET /healthz, that the load balancer uses to take failing servers out of rotation." },
    { id: "c-d1-cache-aside", domain: "d1", kind: "service", term: "Cache-aside", definition: "The app checks the cache. On a miss it reads the database and fills the cache with a TTL. On a write it updates the database, then deletes the key." },
    { id: "c-d1-write-through", domain: "d1", kind: "service", term: "Write-through cache", definition: "Writes go to the cache, which writes the database before confirming. Reads after a write are fresh, but writes are slower." },
    { id: "c-d1-write-back", domain: "d1", kind: "service", term: "Write-back cache", definition: "The cache confirms a write and saves it to the database later. Writes are fast, but data can be lost if the cache fails first." },
    { id: "c-d1-redis", domain: "d1", kind: "service", term: "Redis", definition: "An in-memory data store. People use it as a cache, a session store, a rate-limit counter, a leaderboard with sorted sets, and simple pub/sub." },
    { id: "c-d1-cdn", domain: "d1", kind: "service", term: "CDN", definition: "Caches near users that serve static and cacheable content, so pages load faster and your servers do less. The Cache-Control header controls it." },
    { id: "c-d1-stampede", domain: "d1", kind: "concept", term: "Cache stampede", definition: "A popular key expires and many requests rebuild it at once. Fix it with request coalescing, early refresh and randomised TTLs." },
  ],

  challenges: [
    {
      id: "ch-sd-p99",
      domain: "d1",
      lesson: "d1-cache",
      title: "Hold p99 under 100 ms",
      goal: "Serve at least 20,000 QPS while keeping p99 latency under 100 ms. Use the cache hit ratio and read replicas.",
      hint: "Each database node handles about 5,000 QPS. Latency shoots up as the busiest node nears 100%, so keep it under about 75%.",
      takeaway: "Caches and replicas both take read load off each node. Tail latency depends on keeping the busiest node well short of full.",
      render: (onSolved) => <CapacityLab goal="p99" onSolved={onSolved} />,
    },
  ],
});
