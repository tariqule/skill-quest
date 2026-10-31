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
};

/** The full 49-topic syllabus, in study order. Prerequisites always point at earlier topics. */
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

  { id: "t-queues", title: "Message queues and pub/sub", module: "m6", prereqs: ["t-scaling"], match: /queue|producer|consumer|dead.letter|pub\/sub|visibility timeout/i, standIns: ["d3-start-queues", "d3-queues"] },
  { id: "t-kafka-1", title: "Kafka: the log", module: "m6", prereqs: ["t-queues", "t-sharding"], match: /kafka|offset|consumer group|rebalanc|consumer lag/i },
  { id: "t-kafka-2", title: "Kafka: reliability", module: "m6", prereqs: ["t-kafka-1", "t-replication"], match: /\bISR\b|in-sync replica|\backs\b|min\.insync|exactly-once|at-least-once|at-most-once|idempotent producer/i },
  { id: "t-kafka-3", title: "Kafka: retention and choosing", module: "m6", prereqs: ["t-kafka-2"], match: /retention|log compaction|compacted|tombstone|KRaft|replay/i },
  { id: "t-batch", title: "Batch processing and analytics", module: "m6", prereqs: ["t-sql-nosql", "t-index"], match: /batch|map ?reduce|\bETL\b|\bOLAP\b|warehouse|column storage/i },
  { id: "t-stream", title: "Stream processing basics", module: "m6", prereqs: ["t-kafka-3"], match: /stream processing|tumbling|sliding window|event time|watermark/i },

  { id: "t-api", title: "REST, GraphQL, gRPC", module: "m7", prereqs: ["t-network"], match: /\bAPI\b|REST|endpoint|grpc|graphql|over-fetch|under-fetch/i, standIns: ["d4-start-api", "d4-api", "d3-idempotency"] },
  { id: "t-api-2", title: "Pagination, idempotency, versioning", module: "m7", prereqs: ["t-api", "t-index"], match: /idempoten|paginat|cursor|keyset|versioning|deprecat/i },
  { id: "t-encoding", title: "Encoding and schema evolution", module: "m7", prereqs: ["t-api"], match: /encoding|protobuf|avro|schema evolution|schema registry|backward compat|forward compat/i },
  { id: "t-realtime", title: "Real-time delivery", module: "m7", prereqs: ["t-api"], match: /websocket|long poll|server-sent|push notification|real-time/i, standIns: ["d4-feed-chat"] },
  { id: "t-micro", title: "Monoliths vs microservices", module: "m7", prereqs: ["t-api"], match: /microservice|monolith|strangler|service boundar/i },
  { id: "t-discovery", title: "Service discovery", module: "m7", prereqs: ["t-micro", "t-lb"], match: /service discovery|service registry|consul|etcd/i },
  { id: "t-security", title: "Security basics for designs", module: "m7", prereqs: ["t-api", "t-proxy"], match: /auth|OAuth|JWT|TLS|encrypt|certificate/i },
  { id: "t-appsec", title: "Security: least privilege and input", module: "m7", prereqs: ["t-security", "t-sql-nosql"], match: /SQL injection|least privilege|input validation|parameteri[sz]ed/i },

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
  { id: "t-patterns", title: "Classic design patterns", module: "m9", prereqs: ["t-cache", "t-queues", "t-sharding"], match: /fan-?out|shortener|news feed|chat/i, standIns: ["d4-shortener"] },

  { id: "t-method", title: "The interview method", module: "m10", prereqs: ["t-estimation"], match: /requirement|clarif|trade-off|interview/i },
];
