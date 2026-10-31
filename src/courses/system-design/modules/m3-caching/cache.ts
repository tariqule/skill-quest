import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-cache",
  module: "m3",
  title: "Caching patterns",
  visual: {
    kind: "flow",
    steps: [
      { icon: "🖥️", label: "App server", sub: "Needs user 42's profile" },
      { icon: "⚡", label: "Cache", sub: "In memory, under a millisecond" },
      { icon: "🗄️", label: "Database", sub: "On disk, a few milliseconds" },
    ],
  },
  screens: [
    { kind: "idea", text: "A **cache** keeps a copy of data somewhere faster to reach, usually memory. Reading memory takes well under a millisecond, while a database query can take several milliseconds or more." },
    { kind: "idea", text: "Caches pay off because reads cluster. A small set of popular items, like a celebrity's profile or today's top post, gets most of the requests, so a small cache can answer most reads." },
    { kind: "idea", text: "The most common pattern is **cache-aside**. The app checks the cache first. On a hit it's done. On a miss it reads the database, puts the result in the cache, then answers." },
    { kind: "idea", text: "With **write-through**, every write goes to the cache and the database together, so the cache is never behind. Writes get a little slower, and you cache data nobody may read." },
    { kind: "idea", text: "With **write-back**, writes land in the cache and reach the database later in batches. Writes are very fast, but if the cache dies before flushing, those writes are lost." },
    {
      kind: "example",
      title: "What a hit rate buys you",
      steps: [
        "A cache read takes 1 ms and a database read takes 10 ms. The cache hit rate is 90%.",
        "Average read time is 0.9 times 1 ms plus 0.1 times 11 ms, since a miss checks the cache then the database. That's about 2 ms.",
        "Only 10% of reads reach the database, so it handles a tenth of the load it did before.",
      ],
    },
    { kind: "idea", text: "The price of a cache is **staleness**: the copy can fall behind the database. Every cache design must answer how stale is acceptable and how a change reaches the cache." },
  ],
  tip: "When you add a cache, name the pattern, say what you cache and why that data is read-heavy, and say how stale it may get.",
  quiz: [
    {
      kind: "mcq",
      id: "t-cache-q1",
      prompt: "In cache-aside, what does the app do on a cache miss?",
      options: ["Returns an error to the user", "Reads the database, then fills the cache", "Waits for the cache to load the row by itself", "Asks the database to push the row into the cache"],
      answer: 1,
      explanation: "The app loads the data from the database, stores it in the cache for next time, and answers.",
    },
    {
      kind: "mcq",
      id: "t-cache-q2",
      prompt: "Which pattern risks losing recent writes if the cache crashes?",
      options: ["Write-back", "Cache-aside", "Write-through", "Reading from a replica"],
      answer: 0,
      explanation: "Write-back holds writes in the cache before they reach the database, so a crash can lose them.",
    },
    {
      kind: "mcq",
      id: "t-cache-q3",
      prompt: "Why can a small cache answer most of the reads?",
      options: ["Cached items never expire at all", "Reads are much cheaper than writes", "A few popular items get most requests", "Caches store every row"],
      answer: 2,
      explanation: "Reads cluster on popular items, so caching those few covers most traffic.",
    },
    {
      kind: "tf",
      id: "t-cache-q4",
      statement: "Write-through keeps the cache and the database in step on every write.",
      answer: true,
      explanation: "Each write updates both, so reads from the cache aren't behind, at the cost of slower writes.",
    },
    {
      kind: "tf",
      id: "t-cache-q5",
      statement: "Reading from a cache gives the same value as reading the database at that moment.",
      answer: false,
      explanation: "A cached copy can be stale. Designs decide how stale is acceptable.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-cache-p1",
      prompt: "Cache reads take 1 ms, database reads 20 ms, and 95% of reads hit. About what share reaches the database?",
      options: ["95%", "50%", "20%", "5%"],
      answer: 3,
      explanation: "Only misses go to the database: 100% minus 95% is 5%.",
    },
    {
      kind: "tf",
      id: "t-cache-p2",
      statement: "Caching helps most for data that is read far more often than it changes.",
      answer: true,
      explanation: "Read-heavy, slow-changing data gives high hit rates and little staleness.",
    },
  ],
  practiceNeeds: ["t-latency"],
  sources: [
    { title: "System Design Primer: Cache", url: "https://github.com/donnemartin/system-design-primer#cache", license: "CC BY 4.0" },
    { title: "AWS: Caching best practices", url: "https://aws.amazon.com/caching/best-practices/", license: "Link only" },
  ],
};

export default topic;
