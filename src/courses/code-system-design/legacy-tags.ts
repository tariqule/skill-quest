/**
 * Hand-reviewed topic tags for older questions whose lesson-based auto-tag was wrong. Each was
 * flagged by the tag audit (`tag-audit.ts`) because another topic's lesson terms matched it
 * better, then checked by hand. Practice serves a question only once every tagged topic is
 * finished, so a wrong tag shows it before its idea is taught (or hides it long after).
 */
export const LEGACY_RETAGS: Readonly<Record<string, readonly string[]>> = {
  // Sharding arithmetic and hashing, not copies of the same data.
  "sd-b2-04": ["t-sharding"], // split 4 TB across 1 TB machines
  "d2-17": ["t-chash"], // hash(key) % N reshuffles most keys
  "sd-pz-06": ["t-chash"], // route a key on a hash ring
  // CDN and HTTP cache headers, not application caching.
  "d1-14": ["t-cdn"],
  "d1-16": ["t-cdn"], // Cache-Control: private
  "d1-17": ["t-cdn"], // CDN caching a private page
  // Expiry, eviction and stampedes.
  "d1-18": ["t-cache-evict"], // cache stampede
  "d1-20": ["t-cache-evict"], // LRU scan pollution
  "sd-pz-04": ["t-cache-evict"], // build an LRU cache
  "sd-bug-01": ["t-cache-evict"], // TTL bug
  // Latency maths.
  "d1-05": ["t-latency"], // Little's Law
  "d4-10": ["t-latency"], // tail latency under fan-out
  // Availability, nines and SLOs, not overload.
  "d1-23": ["t-availability"], // surviving a region loss
  "d4-07": ["t-availability"], // SLI, SLO, SLA
  "d4-08": ["t-availability"], // downtime allowed by 99.9%
  "d4-12": ["t-availability", "t-observe"], // alert on the SLO users feel
  "d4-13": ["t-availability"], // chained availability
  "sd-ox-06": ["t-availability"], // error budget minutes
  "sd-out-03": ["t-availability"], // downtime per nine
  // Retries, timeouts and circuit breakers, not overload.
  "sd-b4-03": ["t-fault"], // what a timeout does
  "d4-06": ["t-fault"], // retry policy without backoff
  "d4-11": ["t-fault"], // what a circuit breaker is for
  "sd-pz-05": ["t-fault"], // exponential backoff loop
  "sd-bug-04": ["t-fault"], // circuit breaker bug
  // Database topics beyond "SQL or NoSQL".
  "sd-b2-02": ["t-index"], // find a row without a full scan
  "d2-01": ["t-sql-nosql", "t-transactions"], // ledger needs ACID transactions
  "d2-03": ["t-transactions"], // the A in ACID
  "d2-23": ["t-denorm"], // copy the author's name into posts
  // Consistency models and quorums.
  "d3-09": ["t-consistency"], // match each consistency model
  "sd-bug-05": ["t-replication", "t-consistency"], // read-your-writes with lagging replicas
  "sd-out-04": ["t-replication"], // W + R quorum arithmetic
  // Feed fan-out belongs to the news feed walkthrough, not real-time delivery.
  "d4-19": ["t-design-feed-1"], // celebrity fan-out on write
  "d4-22": ["t-design-feed-2"], // cache timelines as lists of post ids
  "sd-out-06": ["t-design-feed-1"], // fan-out on write trace
  // Snowflake bit sums and chat routing belong to their walkthroughs.
  "d4-18": ["t-design-id"], // ids per millisecond from 12 sequence bits
  "d4-20": ["t-design-chat-1", "t-design-chat-2"], // route a message to the receiver's connection
  "d3-01": ["t-queues", "t-design-video-1"], // queue in front of video converters
  // Design walkthroughs: IDs and the URL shortener.
  "d2-19": ["t-design-id"], // message ids unique across the system
  "d4-17": ["t-design-id"], // id strategies without a central coordinator
  "d4-14": ["t-design-shortener"], // base62 code length
  "d4-15": ["t-design-shortener"], // 302 to count clicks
  "d4-16": ["t-design-shortener"], // two lines that hand out the same code
  "sd-bug-07": ["t-design-shortener"], // base62 encoding bug
  // Foundation topics written in batch 2.
  "sd-out-05": ["t-api"], // cursor pagination trace
  "d4-09": ["t-fault"], // retries multiply across layers
};
