/**
 * Key system design concepts, used by the "teach before test" check.
 * If a question's prompt or correct answer mentions a concept, some lesson at or
 * before the question's lesson must mention it too. Add an entry when you add a
 * question about something new, then teach it in a lesson.
 */
export const CONCEPTS: [string, RegExp][] = [
  ["latency", /latenc/i],
  ["availability / nines", /availability|nines\b|99\.9/i],
  ["SLO / SLA", /\bSL[OAI]s?\b/],
  ["vertical vs horizontal scaling", /horizontal|vertical/i],
  ["stateless", /stateless/i],
  ["load balancer", /load balanc/i],
  ["CDN", /\bCDN\b/],
  ["cache", /\bcach/i],
  ["cache-aside", /cache-aside|read-through|write-through|write-back/i],
  ["TTL", /\bTTL\b/],
  ["cache stampede", /stampede|thundering herd/i],
  ["replication", /replica/i],
  ["sharding / partitioning", /shard|partition/i],
  ["consistent hashing", /consistent hashing/i],
  ["CAP theorem", /\bCAP\b/],
  ["strong consistency", /strong(ly)? consisten|linearizab/i],
  ["quorum", /quorum/i],
  ["message queue", /message queue|\bqueue/i],
  ["Kafka / log", /kafka|event log/i],
  ["idempotency", /idempoten/i],
  ["exactly-once", /exactly-once|at-least-once|at-most-once/i],
  ["outbox pattern", /outbox/i],
  ["rate limiting", /rate limit|token bucket|leaky bucket/i],
  ["circuit breaker", /circuit breaker/i],
  ["timeouts", /timeout/i],
  ["indexes", /\bindex(es)?\b/i],
  ["read replicas", /read replica/i],
  ["fan-out", /fan-?out/i],
  ["WebSocket", /websocket/i],
  ["API gateway", /api gateway/i],
  ["back-of-the-envelope", /back-of-the-envelope|estimate/i],
  ["QPS", /\bQPS\b|requests per second/i],
  ["hot key / hot partition", /hot (key|partition|shard)/i],
  ["multi-region", /multi-region|region/i],
  ["failover", /failover/i],
];
