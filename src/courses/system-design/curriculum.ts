import type { ModuleId } from "./schema";

/** One syllabus entry. Content lives in `modules/<module>/<topic>.ts` once written. */
export interface TopicOutline {
  id: string;
  title: string;
  module: ModuleId;
  /** Earlier topics to finish first. */
  prereqs: readonly string[];
  /** Spots this topic when tagging existing questions. */
  match: RegExp;
  /** Existing (pre-curriculum) lessons that teach this topic until its own lesson is written. */
  standIns?: readonly string[];
}

export const MODULE_TITLES: Record<ModuleId, string> = {
  m1: "Fundamentals",
  m2: "Traffic and the edge",
  m3: "Caching",
  m4: "Data at scale",
  m5: "Consistency",
  m6: "Messaging and streams",
  m7: "APIs and services",
  m8: "Reliability",
  m9: "Distributed systems at scale",
  m10: "Interview method",
  m11: "Design walkthroughs",
};

/** The full 68-topic syllabus, in study order. Prerequisites always point at earlier topics. */
export const CURRICULUM: readonly TopicOutline[] = [
  { id: "t-intro", title: "What is system design?", module: "m1", prereqs: [], match: /\bclient|\bserver\b|request|response/i },
  { id: "t-network", title: "How a request travels", module: "m1", prereqs: ["t-intro"], match: /\bDNS\b|\bTCP\b|\bTLS\b|\bHTTP|\bIP address/i },
  { id: "t-scaling", title: "Scaling up and out", module: "m1", prereqs: ["t-intro"], match: /horizontal|vertical|stateless|scale (up|out)/i, standIns: ["d1-scaling"] },
  { id: "t-latency", title: "Latency and throughput", module: "m1", prereqs: ["t-network"], match: /latenc|throughput|p99|percentile|little's law/i },
  { id: "t-availability", title: "Availability and nines", module: "m1", prereqs: ["t-scaling"], match: /availability|nines|\bSL[OAI]s?\b|error budget|single point/i, standIns: ["d4-start-reliable"] },
  { id: "t-estimation", title: "Back-of-envelope estimates", module: "m1", prereqs: ["t-latency"], match: /\bQPS\b|estimate|per second|storage|bandwidth/i, standIns: ["d1-estimates"] },

  { id: "t-lb", title: "Load balancers", module: "m2", prereqs: ["t-scaling"], match: /load balanc|round robin|least connections|health check|\bL[47]\b/i, standIns: ["d1-lb"] },
  { id: "t-proxy", title: "Proxies and gateways", module: "m2", prereqs: ["t-lb"], match: /proxy|api gateway/i },
  { id: "t-cdn", title: "CDNs and edge caching", module: "m2", prereqs: ["t-network"], match: /\bCDN|edge|cache-control/i },
  { id: "t-ratelimit", title: "Rate limiting", module: "m2", prereqs: ["t-lb"], match: /rate limit|token bucket|leaky bucket|sliding window|\b429\b/i, standIns: ["d3-rate-limit"] },

  { id: "t-cache", title: "Caching patterns", module: "m3", prereqs: ["t-latency"], match: /\bcach|redis|memcached/i, standIns: ["d1-cache"] },
  { id: "t-cache-evict", title: "Eviction, TTLs and stampedes", module: "m3", prereqs: ["t-cache"], match: /\bTTL\b|evict|\bLRU\b|stampede|invalidat/i },

  { id: "t-sql-nosql", title: "SQL and NoSQL", module: "m4", prereqs: ["t-intro"], match: /\bSQL\b|nosql|relational|document|key-value|wide-column|schema/i, standIns: ["d2-start-db", "d2-models"] },
  { id: "t-index", title: "Indexes", module: "m4", prereqs: ["t-sql-nosql"], match: /\bindex|b-tree|pagination|full table scan/i, standIns: ["d2-indexes"] },
  { id: "t-transactions", title: "Transactions and isolation", module: "m4", prereqs: ["t-sql-nosql"], match: /transaction|ACID|isolation|deadlock|lock/i },
  { id: "t-replication", title: "Replication", module: "m4", prereqs: ["t-sql-nosql", "t-availability"], match: /replica|leader|follower|replication lag|quorum/i, standIns: ["d2-start-copies", "d2-replication"] },
  { id: "t-sharding", title: "Sharding", module: "m4", prereqs: ["t-replication"], match: /shard|partition key|hot (key|partition|shard)/i, standIns: ["d2-sharding"] },
  { id: "t-denorm", title: "Denormalisation", module: "m4", prereqs: ["t-index", "t-sharding"], match: /denormali|join|materiali[sz]ed/i },
  { id: "t-chash", title: "Consistent hashing", module: "m4", prereqs: ["t-sharding"], match: /consistent hashing|hash ring|virtual node/i },

  { id: "t-cap", title: "CAP and PACELC", module: "m5", prereqs: ["t-replication"], match: /\bCAP\b|PACELC|network partition/i, standIns: ["d3-cap"] },
  { id: "t-consistency", title: "Consistency models", module: "m5", prereqs: ["t-cap"], match: /consisten|linearizab|read-your-writes|stale/i },

  { id: "t-queues", title: "Message queues", module: "m6", prereqs: ["t-scaling"], match: /queue|consumer|producer|dead.letter|at-least-once|at-most-once/i, standIns: ["d3-start-queues", "d3-queues"] },
  { id: "t-kafka-1", title: "Kafka: logs and partitions", module: "m6", prereqs: ["t-queues"], match: /kafka|event log|offset|partition/i },
  { id: "t-kafka-2", title: "Kafka: consumer groups and ordering", module: "m6", prereqs: ["t-kafka-1"], match: /consumer group|rebalanc|ordering/i },
  { id: "t-kafka-3", title: "Kafka: delivery guarantees", module: "m6", prereqs: ["t-kafka-2"], match: /exactly-once|idempotent producer|acks/i },
  { id: "t-batch", title: "Batch processing", module: "m6", prereqs: ["t-queues"], match: /batch|map ?reduce|\bETL\b/i },
  { id: "t-stream", title: "Stream processing", module: "m6", prereqs: ["t-kafka-1"], match: /stream processing|window|watermark/i },

  { id: "t-api", title: "API design", module: "m7", prereqs: ["t-network"], match: /\bAPI\b|REST|endpoint|idempoten|pagination|versioning/i, standIns: ["d4-start-api", "d4-api", "d3-idempotency"] },
  { id: "t-api-2", title: "gRPC and GraphQL", module: "m7", prereqs: ["t-api"], match: /grpc|graphql|protobuf/i },
  { id: "t-encoding", title: "Encoding and schema evolution", module: "m7", prereqs: ["t-api"], match: /encoding|avro|schema evolution|backward compat/i },
  { id: "t-realtime", title: "Real-time delivery", module: "m7", prereqs: ["t-api"], match: /websocket|long poll|server-sent|push|real-time/i, standIns: ["d4-feed-chat"] },
  { id: "t-micro", title: "Microservices", module: "m7", prereqs: ["t-api"], match: /microservice|monolith|service boundar/i },
  { id: "t-discovery", title: "Service discovery", module: "m7", prereqs: ["t-micro"], match: /service discovery|registry|service mesh|sidecar/i },
  { id: "t-security", title: "Authentication and security", module: "m7", prereqs: ["t-api"], match: /auth|OAuth|JWT|TLS|encrypt/i },

  { id: "t-fault", title: "Retries, timeouts and circuit breakers", module: "m8", prereqs: ["t-availability"], match: /retr|timeout|backoff|jitter|circuit breaker/i, standIns: ["d3-start-retries"] },
  { id: "t-overload", title: "Overload and backpressure", module: "m8", prereqs: ["t-fault"], match: /overload|backpressure|load shed|bulkhead/i, standIns: ["d4-reliability"] },
  { id: "t-observe", title: "Observability", module: "m8", prereqs: ["t-fault"], match: /metric|log|trac(e|ing)|alert|dashboard/i },

  { id: "t-dist", title: "Why distributed is hard", module: "m9", prereqs: ["t-consistency"], match: /distributed|partial failure|network partition/i },
  { id: "t-partition-adv", title: "Partitioning in depth", module: "m9", prereqs: ["t-chash"], match: /rebalanc|range partition|hash partition|secondary index/i },
  { id: "t-dcache", title: "Distributed caches", module: "m9", prereqs: ["t-cache-evict", "t-chash"], match: /distributed cache|cache cluster|hot key/i },
  { id: "t-ddb", title: "Distributed databases", module: "m9", prereqs: ["t-sharding", "t-consistency"], match: /dynamo|cassandra|spanner|leaderless/i },
  { id: "t-consensus", title: "Consensus", module: "m9", prereqs: ["t-dist"], match: /consensus|raft|paxos|leader election/i },
  { id: "t-time", title: "Time and ordering", module: "m9", prereqs: ["t-dist"], match: /clock|timestamp|lamport|vector clock/i },
  { id: "t-events", title: "Event-driven architecture", module: "m9", prereqs: ["t-kafka-1"], match: /event.driven|event sourcing|CQRS|outbox/i },
  { id: "t-saga", title: "Sagas and distributed transactions", module: "m9", prereqs: ["t-transactions", "t-events"], match: /saga|two-phase commit|\b2PC\b|compensat/i },
  { id: "t-storage", title: "Blob and object storage", module: "m9", prereqs: ["t-replication"], match: /object storage|blob|\bS3\b|signed URL/i },

  { id: "t-method", title: "The interview method", module: "m10", prereqs: ["t-estimation"], match: /requirement|clarif|trade-off|interview/i },

  { id: "t-design-scale", title: "Design: from one server to millions", module: "m11", prereqs: ["t-method", "t-lb", "t-replication", "t-cache", "t-cdn", "t-sharding"], match: /one server to millions|stateless web tier|multiple data cent/i },
  { id: "t-design-ratelimit", title: "Design a rate limiter", module: "m11", prereqs: ["t-method", "t-ratelimit"], match: /rate limiter|leaking bucket|sliding window counter|race condition/i },
  { id: "t-design-chash", title: "Design consistent hashing", module: "m11", prereqs: ["t-method", "t-chash"], match: /hash ring|virtual node|rehash/i },
  { id: "t-design-kv-1", title: "Design a key-value store: the big choices", module: "m11", prereqs: ["t-design-chash", "t-cap", "t-replication"], match: /key-value store|quorum|\bN, W and R\b/i },
  { id: "t-design-kv-2", title: "Design a key-value store: failures and storage", module: "m11", prereqs: ["t-design-kv-1"], match: /vector clock|gossip|hinted handoff|merkle|memtable|sstable|bloom filter/i },
  { id: "t-design-id", title: "Design a unique ID generator", module: "m11", prereqs: ["t-method", "t-sharding"], match: /unique id|snowflake|\bUUID|ticket server/i },
  { id: "t-design-shortener", title: "Design a URL shortener", module: "m11", prereqs: ["t-design-id", "t-cache"], match: /shortener|short URL|base ?62|\b30[12]\b/i, standIns: ["d4-shortener"] },
  { id: "t-design-crawler-1", title: "Design a web crawler: the crawl loop", module: "m11", prereqs: ["t-method", "t-queues"], match: /crawler|URL frontier|robots\.txt/i },
  { id: "t-design-crawler-2", title: "Design a web crawler: politeness and traps", module: "m11", prereqs: ["t-design-crawler-1"], match: /politeness|spider trap|content hash|dedup/i },
  { id: "t-design-notify-1", title: "Design a notification system: the pipeline", module: "m11", prereqs: ["t-method", "t-queues"], match: /notification|push service|third-party provider/i },
  { id: "t-design-notify-2", title: "Design a notification system: reliability", module: "m11", prereqs: ["t-design-notify-1"], match: /dedup|retry|opt.?in|template/i },
  { id: "t-design-feed-1", title: "Design a news feed: publishing", module: "m11", prereqs: ["t-method", "t-queues", "t-cache"], match: /news feed|fan-?out/i },
  { id: "t-design-feed-2", title: "Design a news feed: reading and caching", module: "m11", prereqs: ["t-design-feed-1"], match: /feed cache|hydrat|celebrit/i },
  { id: "t-design-chat-1", title: "Design a chat system: connections", module: "m11", prereqs: ["t-method", "t-realtime"], match: /chat|websocket|long poll/i },
  { id: "t-design-chat-2", title: "Design a chat system: messages and presence", module: "m11", prereqs: ["t-design-chat-1"], match: /presence|heartbeat|message id|group chat/i },
  { id: "t-design-autocomplete-1", title: "Design search autocomplete: the trie", module: "m11", prereqs: ["t-method", "t-cache"], match: /autocomplete|typeahead|\btrie\b|top.?k/i },
  { id: "t-design-autocomplete-2", title: "Design search autocomplete: building and scaling", module: "m11", prereqs: ["t-design-autocomplete-1"], match: /data gathering|filter layer|trie (cache|db)/i },
  { id: "t-design-video-1", title: "Design a video platform: uploads", module: "m11", prereqs: ["t-method", "t-cdn", "t-storage"], match: /video|transcod|upload/i },
  { id: "t-design-video-2", title: "Design a video platform: streaming and cost", module: "m11", prereqs: ["t-design-video-1"], match: /streaming|\bDAG\b|CDN cost|bitrate/i },
  { id: "t-design-drive-1", title: "Design cloud file storage: upload and sync", module: "m11", prereqs: ["t-method", "t-storage"], match: /file storage|block server|delta sync|cloud drive/i },
  { id: "t-design-drive-2", title: "Design cloud file storage: conflicts and consistency", module: "m11", prereqs: ["t-design-drive-1"], match: /conflict|metadata|revision|dedup/i },
];
