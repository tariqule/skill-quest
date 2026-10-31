import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-cache-evict",
  module: "m3",
  title: "Eviction, TTLs and stampedes",
  visual: {
    kind: "tiles",
    tiles: [
      { icon: "🧹", title: "Eviction", text: "The cache is full. Which item goes?" },
      { icon: "⏳", title: "TTL", text: "Each copy expires after a set time." },
      { icon: "🐘", title: "Stampede", text: "A hot key expires and everyone hits the database at once." },
    ],
  },
  screens: [
    { kind: "idea", text: "A cache has limited memory. When it's full and a new item arrives, it must **evict** something. The rule it uses is called the eviction policy." },
    { kind: "idea", text: "**LRU** (least recently used) throws out the item nobody has read for the longest time. It's the usual default, because something read a minute ago is likely to be read again soon." },
    { kind: "idea", text: "A **TTL** (time to live) makes each copy expire after a set time, like 5 minutes. It caps staleness: even if nobody tells the cache about a change, the old copy goes away." },
    { kind: "idea", text: "**Invalidation** is removing or updating a cached copy when the data changes. A common rule is to update the database, then delete the cache key, so the next read loads fresh data." },
    { kind: "idea", text: "A **stampede** happens when a hot key expires and thousands of requests miss at the same moment. They all query the database for the same item, which can knock it over." },
    {
      kind: "example",
      title: "Stopping a stampede",
      steps: [
        "The home page's top stories are cached with a 60 second TTL and read 5,000 times per second.",
        "The key expires. In the 100 ms the query takes, about 500 requests miss and all run the same heavy query.",
        "Fix one: a lock, so only the first miss rebuilds the item while the others wait briefly or get the old copy.",
        "Fix two: add a little random jitter to TTLs, so many hot keys don't expire in the same second.",
      ],
    },
    { kind: "idea", text: "TTL length is a trade-off. Short TTLs mean fresher data but more misses and database load. Long TTLs mean fewer misses but users may see old data for longer." },
  ],
  tip: "For any cache, state its TTL, its eviction policy, and how a write invalidates it. Mentioning stampede protection for hot keys is a strong signal.",
  quiz: [
    {
      kind: "mcq",
      id: "t-cache-evict-q1",
      prompt: "The cache is full. Under LRU, which item is evicted?",
      options: ["The item added most recently", "The largest item in memory", "The one read least recently", "An item picked at random"],
      answer: 2,
      explanation: "LRU drops whatever has gone longest without being read.",
    },
    {
      kind: "mcq",
      id: "t-cache-evict-q2",
      prompt: "What does a TTL of 5 minutes on a cached copy mean?",
      options: ["The copy expires 5 minutes after it's stored", "The cache restarts every 5 minutes", "Writes reach the database in 5 minutes", "Each key is read once per 5 minutes"],
      answer: 0,
      explanation: "After 5 minutes the copy expires, which caps how stale it can be.",
    },
    {
      kind: "mcq",
      id: "t-cache-evict-q3",
      prompt: "A hot key expires and the database is flooded with identical queries. What is this called?",
      options: ["Eviction", "Write-back", "Replication lag", "A cache stampede"],
      answer: 3,
      explanation: "Many simultaneous misses on one hot key stampede the database.",
    },
    {
      kind: "tf",
      id: "t-cache-evict-q4",
      statement: "Adding random jitter to TTLs helps stop many keys from expiring at the same moment.",
      answer: true,
      explanation: "Spreading expiry times spreads the misses, so the database doesn't get them all at once.",
    },
    {
      kind: "tf",
      id: "t-cache-evict-q5",
      statement: "A longer TTL means users see changes sooner.",
      answer: false,
      explanation: "A longer TTL keeps copies longer, so data can be staler. It does cut misses.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-cache-evict-p1",
      prompt: "A user updates their name. What's the usual way to keep cache-aside reads correct?",
      options: ["Wait for the key's TTL to expire", "Update the database, then delete the key", "Delete the key, then update the database", "Write the new name only to the cache"],
      answer: 1,
      explanation: "Deleting the key makes the next read miss and load the new name. Deleting before the update leaves a gap where a read can put the old name back.",
    },
    {
      kind: "tf",
      id: "t-cache-evict-p2",
      statement: "Letting only one request rebuild an expired hot key protects the database during a stampede.",
      answer: true,
      explanation: "One rebuild instead of hundreds keeps the database load flat while the key refills.",
    },
  ],
  practiceNeeds: ["t-cache"],
  sources: [
    { title: "Redis docs: Key eviction", url: "https://redis.io/docs/latest/develop/reference/eviction/", license: "Link only" },
    { title: "System Design Primer: Cache", url: "https://github.com/donnemartin/system-design-primer#cache", license: "CC BY 4.0" },
  ],
};

export default topic;
