import { CodeBlock, CodeCompare, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { CapacityLab, HashRingLab } from "../labs";
import { ReplicationVisual } from "../visuals";

/** Domain 2: data models, indexes, replication, sharding and consistent hashing. */
export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "Data at Scale",
    world: "The Shard Archipelago",
    weight: 25,
    emoji: "🏝️",
    color: "#60a5fa",
    summary: "SQL vs NoSQL, indexes that match your queries, replication and its lag, and splitting data across shards without moving everything.",
  },

  tasks: [
    { id: "2.1", title: "Choose a data model", covers: ["relational vs key-value, document, wide-column, graph", "ACID transactions", "modelling from access patterns", "denormalisation"] },
    { id: "2.2", title: "Index and query efficiently", covers: ["B-tree indexes", "composite index column order", "covering indexes", "keyset pagination"] },
    { id: "2.3", title: "Replicate and partition data", covers: ["leader-follower replication", "sync vs async and replication lag", "quorums", "sharding keys, hot keys, consistent hashing", "online migrations"] },
  ],

  lessons: [
    {
      id: "d2-models",
      level: "junior",
      task: "2.1",
      title: "SQL vs NoSQL",
      check: ["d2-01", "d2-02"],
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🧮", title: "Relational (PostgreSQL, MySQL)", text: "Tables, joins, ACID transactions, flexible ad hoc queries. Default choice for business data with relationships.", color: "#60a5fa" },
            { icon: "🔑", title: "Key-value (Redis, DynamoDB)", text: "Get/put by key at very high throughput. Sessions, carts, counters, caches.", color: "#2dd4bf" },
            { icon: "📄", title: "Document (MongoDB)", text: "JSON-like documents with flexible shape; read a whole aggregate in one go.", color: "#facc15" },
            { icon: "🧱", title: "Wide-column (Cassandra)", text: "Partitioned by key, sorted within a partition; huge write throughput for time-series and feeds.", color: "#f472b6" },
          ]}
        />
      ),
      points: [
        "Start from the access patterns: what are the reads and writes, how often, and what must be consistent?",
        "Relational databases scale further than people assume; pick NoSQL for a concrete reason (scale-out writes, flexible schema, a specific access pattern).",
        "ACID: Atomic (all or nothing), Consistent (constraints hold), Isolated (concurrent transactions don't see each other's partial work), Durable (committed data survives crashes).",
        "Denormalising (storing data redundantly) speeds up reads at the cost of keeping copies in sync on writes.",
      ],
      tip: "Don't pick a database by brand. Say \"I need X access pattern and Y consistency, so I'll use Z\" and you've answered the follow-up before it's asked.",
    },
    {
      id: "d2-indexes",
      level: "intermediate",
      task: "2.2",
      title: "Indexes and pagination",
      check: ["d2-06", "d2-07"],
      visual: (
        <div className="grid gap-3">
          <CodeBlock
            lang="sql"
            caption="Equality columns first, then the sort/range column. The index serves both the filter and the ORDER BY."
            code={`-- a user's newest orders
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at);

SELECT id, total FROM orders
WHERE user_id = 42
ORDER BY created_at DESC
LIMIT 20;`}
          />
          <CodeCompare
            lang="sql"
            left={{ title: "OFFSET: scans and discards", code: `SELECT * FROM posts
ORDER BY id DESC
LIMIT 20 OFFSET 100000;` }}
            right={{ title: "Keyset: seeks straight there", code: `SELECT * FROM posts
WHERE id < 98213  -- last id seen
ORDER BY id DESC
LIMIT 20;` }}
          />
        </div>
      ),
      points: [
        "An index is a sorted structure (usually a B-tree) that turns a full scan into a seek. It costs storage and slows every write that must maintain it.",
        "Composite indexes follow the leftmost-prefix rule: (a, b) helps queries on a, or a and b, but not on b alone.",
        "A covering index holds every column a query needs, so the database can answer from the index without visiting the table.",
        "OFFSET pagination gets slower the deeper you page and shifts when rows are inserted; keyset (cursor) pagination stays fast and stable.",
      ],
      tip: "When you add an index in a design, name the exact query it serves. \"Index on (user_id, created_at) for the timeline query\" is the senior answer.",
    },
    {
      id: "d2-replication",
      level: "intermediate",
      task: "2.3",
      title: "Replication and lag",
      check: ["d2-11", "d2-12"],
      visual: (
        <div className="grid gap-3">
          <ReplicationVisual />
          <CodeBlock
            lang="yaml"
            caption="Quorum rule: if R + W > N, every read set overlaps the latest successful write set."
            code={`replication_factor: 3   # N copies of each item
write_quorum: 2         # W acks before a write succeeds
read_quorum: 2          # R replicas consulted per read
# 2 + 2 > 3 → reads see the latest acknowledged write`}
          />
        </div>
      ),
      points: [
        "Leader-follower: one primary takes writes and streams changes to replicas, which serve reads and act as failover candidates.",
        "Replicas scale reads and availability, not writes: every write still lands on the primary.",
        "Async replication is fast but replicas lag, so a user can read their own write back as stale; sync replication avoids loss but adds write latency.",
        "Leaderless stores (Dynamo-style) use quorums: N replicas, writes wait for W, reads ask R. R + W > N gives overlapping sets.",
      ],
      tip: "Whenever you add read replicas, say how you'll handle replication lag for read-after-write, e.g. read your own recent writes from the primary.",
    },
    {
      id: "d2-sharding",
      level: "senior",
      task: "2.3",
      title: "Sharding and consistent hashing",
      check: ["d2-16", "d2-17"],
      visual: (
        <div className="grid gap-3">
          <HashRingLab />
          <CodeCompare
            lang="text"
            tone="neutral"
            left={{ title: "hash(key) % N", code: `4 → 5 shards:
a key keeps its shard only if
k % 4 == k % 5
→ ~80% of keys move` }}
            right={{ title: "Consistent hashing", code: `4 → 5 nodes:
only keys between the new node
and its predecessor move
→ ~1/5 of keys move` }}
          />
        </div>
      ),
      points: [
        "Shard (partition) when one node can't hold the data or absorb the writes. Each shard owns a slice of the keys.",
        "Pick a shard key that spreads load evenly and keeps each query on one shard (e.g. user_id for per-user data).",
        "Hot keys (a celebrity, a viral product) overload one shard; split them with key salting or absorb them with caching.",
        "Consistent hashing places nodes and keys on a ring so adding or removing a node only moves about 1/N of the keys; virtual nodes even out the load.",
      ],
      tip: "Always mention what sharding breaks: cross-shard joins and transactions, global unique ids, and rebalancing. Then say how you'd handle each.",
    },
  ],

  questions: [
    {
      id: "d2-01",
      domain: "d2",
      lesson: "d2-models",
      level: "junior",
      prompt: "A ledger moves money between accounts and must never lose half of a transfer. Which store fits best?",
      options: [
        "A relational database with ACID transactions",
        "An in-memory cache with no persistence",
        "A log file appended by each server",
        "A CDN",
      ],
      answer: [0],
      explanation: "Debit and credit must commit together or not at all (atomicity), with constraints enforced. That is exactly what relational ACID transactions provide.",
    },
    {
      id: "d2-02",
      domain: "d2",
      lesson: "d2-models",
      level: "junior",
      type: "match",
      prompt: "Match each kind of database to the workload it suits best.",
      pairs: [
        ["Key-value store", "Look up a session by its id, millions of times a second"],
        ["Document store", "Product catalogue where each item has a different set of attributes"],
        ["Wide-column store", "Write-heavy sensor readings partitioned by device and sorted by time"],
        ["Graph database", "\"Friends of friends who like this band\" traversals"],
      ],
      explanation: "Key-value is fastest for point lookups; documents fit variable-shaped aggregates; wide-column stores excel at partitioned, sorted, write-heavy data; graphs make multi-hop relationship queries natural.",
    },
    {
      id: "d2-03",
      domain: "d2",
      lesson: "d2-models",
      level: "junior",
      prompt: "What does the A in ACID guarantee?",
      options: [
        "Atomicity: all the statements in a transaction take effect, or none do",
        "Availability: the database always answers",
        "Asynchrony: writes are applied in the background",
        "Authentication: every query is authorised",
      ],
      answer: [0],
      explanation: "Atomicity means no partial transactions. Availability belongs to the CAP discussion, not ACID.",
    },
    {
      id: "d2-04",
      domain: "d2",
      lesson: "d2-models",
      level: "intermediate",
      prompt: "You are modelling data for a wide-column store like Cassandra. Where should the design start?",
      options: [
        "From a fully normalised entity-relationship diagram, then add joins",
        "From the queries the application will run, designing one table per access pattern and denormalising as needed",
        "From the number of columns each entity has",
        "From the default schema the database generates",
      ],
      answer: [1],
      explanation: "These stores have no joins and query efficiently only by partition key (plus clustering order), so you design tables around the queries and accept duplicated data.",
    },
    {
      id: "d2-05",
      domain: "d2",
      lesson: "d2-indexes",
      level: "junior",
      prompt: "What do you pay for adding an index to a table? (Choose two.)",
      options: [
        "Extra storage for the index structure",
        "Slower inserts and updates, because each write must also update the index",
        "Slower point lookups on the indexed column",
        "Weaker transaction isolation",
      ],
      answer: [0, 1],
      explanation: "Indexes make matching reads much faster but take space and add work to every write. Isolation is unaffected.",
    },
    {
      id: "d2-06",
      domain: "d2",
      lesson: "d2-indexes",
      level: "intermediate",
      type: "lines",
      prompt: "The hot query is slow even though an index exists. Tap the line that should change.",
      code: `CREATE TABLE orders (
  id         BIGINT PRIMARY KEY,
  user_id    BIGINT NOT NULL,
  status     TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL
);
CREATE INDEX idx_orders ON orders (created_at, user_id);

-- hot query: one user's latest orders
SELECT * FROM orders
WHERE user_id = ?
ORDER BY created_at DESC
LIMIT 20;`,
      codeLang: "sql",
      answer: [7],
      explanation: "With created_at first, the index is ordered by time across all users, so the database walks many other users' rows to find 20 of this user's. Equality column first: `(user_id, created_at)` seeks straight to the user and reads their rows already in date order.",
    },
    {
      id: "d2-07",
      domain: "d2",
      lesson: "d2-indexes",
      level: "intermediate",
      prompt: "Deep pages of this feed take seconds, and users see duplicates when new posts arrive. Which replacement fixes both?",
      code: `SELECT * FROM posts
ORDER BY id DESC
LIMIT 20 OFFSET 100000;`,
      codeLang: "sql",
      options: [
        "`SELECT * FROM posts WHERE id < :last_seen_id ORDER BY id DESC LIMIT 20`",
        "`SELECT * FROM posts ORDER BY id DESC LIMIT 100020`, then drop the first 100,000 in the app",
        "`SELECT * FROM posts ORDER BY RANDOM() LIMIT 20`",
        "Add `OFFSET` caching so the database remembers the position",
      ],
      answer: [0],
      explanation: "Keyset (cursor) pagination seeks via the index to the last id the client saw, so every page costs the same, and inserted rows don't shift the window. OFFSET still reads and throws away 100,000 rows.",
    },
    {
      id: "d2-08",
      domain: "d2",
      lesson: "d2-indexes",
      level: "junior",
      prompt: "Which query can NOT use this index efficiently?",
      code: `CREATE INDEX idx_people_name ON people (last_name, first_name);`,
      codeLang: "sql",
      options: [
        "`WHERE last_name = 'Lee'`",
        "`WHERE last_name = 'Lee' AND first_name = 'Ada'`",
        "`WHERE first_name = 'Ada'`",
        "`WHERE last_name BETWEEN 'L' AND 'M'`",
      ],
      answer: [2],
      explanation: "A composite B-tree index is sorted by last_name first. Without a condition on the leftmost column, Ada's rows are scattered throughout the index (the leftmost-prefix rule).",
    },
    {
      id: "d2-09",
      domain: "d2",
      lesson: "d2-indexes",
      level: "senior",
      prompt: "Why can adding `INCLUDE (total)` make this query noticeably faster?",
      code: `CREATE INDEX idx_orders_user ON orders (user_id, created_at) INCLUDE (total);

SELECT created_at, total FROM orders WHERE user_id = 42;`,
      codeLang: "sql",
      options: [
        "The index now covers every column the query reads, so it can be answered from the index without fetching each table row",
        "INCLUDE sorts the table physically by total",
        "INCLUDE makes the index unique",
        "INCLUDE caches the query result in memory",
      ],
      answer: [0],
      explanation: "A covering index avoids one random table lookup per matching row (an index-only scan). INCLUDE (supported by PostgreSQL and SQL Server, among others) stores extra columns in the index without making them part of the sort key.",
    },
    {
      id: "d2-10",
      domain: "d2",
      lesson: "d2-replication",
      level: "junior",
      prompt: "What do read replicas help with?",
      options: [
        "Scaling read traffic and keeping a standby copy for failover",
        "Scaling write throughput linearly",
        "Removing the need for backups",
        "Making transactions span multiple databases",
      ],
      answer: [0],
      explanation: "Replicas copy the primary's data, so they can serve reads and be promoted if the primary fails. Every write still goes through the primary, and replicas don't replace backups (they replicate mistakes too).",
    },
    {
      id: "d2-11",
      domain: "d2",
      lesson: "d2-replication",
      level: "intermediate",
      prompt: "A user edits their bio, the page reloads, and the old bio appears. Reads go to async replicas. What is the most targeted fix?",
      options: [
        "Route that user's reads to the primary for a short time after they write (read-your-writes)",
        "Switch all reads in the system to the primary",
        "Increase the replicas' CPU",
        "Cache the bio for longer",
      ],
      answer: [0],
      explanation: "This is replication lag. Reading recent writers' own data from the primary (or from a replica known to have caught up to their write position) fixes it without losing the replicas' read capacity.",
    },
    {
      id: "d2-12",
      domain: "d2",
      lesson: "d2-replication",
      level: "intermediate",
      prompt: "What is the main trade-off of synchronous replication compared with asynchronous?",
      options: [
        "No acknowledged write is lost on failover, but writes are slower and can stall if the replica is unavailable",
        "Writes become faster, but data can be lost",
        "Reads become impossible on the replica",
        "It removes the need for a primary",
      ],
      answer: [0],
      explanation: "Sync waits for the replica before acknowledging, adding a round trip and coupling availability to the replica. Many systems use semi-sync: wait for one replica, replicate to the rest asynchronously.",
    },
    {
      id: "d2-13",
      domain: "d2",
      lesson: "d2-replication",
      level: "senior",
      prompt: "A Dynamo-style store is configured like this. What does the configuration guarantee when no nodes fail?",
      code: `replication_factor: 3   # N
write_quorum: 2         # W
read_quorum: 2          # R`,
      codeLang: "yaml",
      options: [
        "Every read contacts at least one replica that has the latest acknowledged write, because R + W > N",
        "Every write is stored on all three replicas before it succeeds",
        "Reads never contact more than one replica",
        "The cluster survives two simultaneous node failures for both reads and writes",
      ],
      answer: [0],
      explanation: "2 + 2 > 3, so any 2 replicas read overlap any 2 replicas written. With N = 3, losing two nodes leaves one, which can't satisfy a quorum of 2.",
    },
    {
      id: "d2-14",
      domain: "d2",
      lesson: "d2-replication",
      level: "senior",
      prompt: "With N = 5 replicas and a write quorum W = 2, what is the smallest read quorum R that still guarantees reads overlap the latest write?",
      options: ["2", "3", "4", "5"],
      answer: [2],
      explanation: "The rule is R + W > N, so R > 5 − 2 = 3, giving R = 4. Small W makes writes cheap but forces reads to ask most replicas.",
    },
    {
      id: "d2-15",
      domain: "d2",
      lesson: "d2-replication",
      level: "staff",
      prompt: "Two regions both accept writes (multi-leader). A user adds an item to their cart in one region while their partner removes another item in the other. Which conflict strategy best preserves both edits?",
      options: [
        "Last-write-wins by wall-clock timestamp",
        "Model the cart as a mergeable structure (e.g. a CRDT of added and removed items) so concurrent edits merge",
        "Reject both writes and ask the users to retry",
        "Keep whichever region's data is larger",
      ],
      answer: [1],
      explanation: "LWW silently drops one update (and depends on clock skew). Conflict-free replicated data types merge concurrent operations deterministically, which suits carts, counters and sets.",
    },
    {
      id: "d2-16",
      domain: "d2",
      lesson: "d2-sharding",
      level: "junior",
      prompt: "What is sharding?",
      options: [
        "Splitting a dataset across several databases so each holds and serves only part of the keys",
        "Copying the whole dataset to several databases",
        "Compressing rows to save disk",
        "Encrypting each column separately",
      ],
      answer: [0],
      explanation: "Sharding (horizontal partitioning) divides data, and therefore write load and storage, across nodes. Replication copies the same data; the two are usually combined.",
    },
    {
      id: "d2-17",
      domain: "d2",
      lesson: "d2-sharding",
      level: "senior",
      prompt: "Keys are assigned with `hash(key) % N`. Roughly what share of keys move when N goes from 4 to 5?",
      options: ["About 20%", "About 50%", "About 80%", "None"],
      answer: [2],
      explanation: "A key stays put only if hash % 4 equals hash % 5, which holds for 4 of every 20 values: 20% stay, ~80% move. Consistent hashing would move only about 1/5.",
    },
    {
      id: "d2-18",
      domain: "d2",
      lesson: "d2-sharding",
      level: "senior",
      prompt: "Data is sharded by user_id. One celebrity's account receives a huge share of writes and overloads its shard. What is the standard fix?",
      options: [
        "Split the hot key by appending a small suffix (e.g. celeb_id#0…#9) to spread its writes, and merge on read; cache its hot reads",
        "Reshard everything by created_at instead",
        "Give that shard a longer TTL",
        "Block the celebrity's account",
      ],
      answer: [0],
      explanation: "Key salting spreads one logical key over several partitions at the cost of a scatter-gather on read. Sharding by time would create a single hot \"now\" shard.",
    },
    {
      id: "d2-19",
      domain: "d2",
      lesson: "d2-sharding",
      level: "senior",
      type: "lines",
      prompt: "Message ids must be globally unique so clients can deduplicate and reference messages. Tap the line that breaks this.",
      code: `-- created on each of 16 shards
CREATE TABLE messages (
  id         BIGSERIAL PRIMARY KEY,
  chat_id    BIGINT NOT NULL,
  sender_id  BIGINT NOT NULL,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
-- routing: shard = hash(chat_id) % 16`,
      codeLang: "sql",
      answer: [3],
      explanation: "Each shard has its own sequence, so every shard produces id 1, 2, 3… Use globally unique ids instead: a Snowflake-style id (timestamp + machine + sequence), a UUID, or ranges leased per shard.",
    },
    {
      id: "d2-20",
      domain: "d2",
      lesson: "d2-sharding",
      level: "intermediate",
      prompt: "In a multi-tenant SaaS, almost every query filters by tenant. What is the usual shard key and its main risk?",
      options: [
        "tenant_id, which keeps each tenant's queries on one shard; the risk is a few huge tenants creating hot shards",
        "created_at, which spreads writes evenly; there is no risk",
        "A random UUID per row, which keeps tenant queries on one shard",
        "The primary key of each table, which makes cross-table joins local",
      ],
      answer: [0],
      explanation: "Sharding by tenant makes most queries single-shard. Very large tenants may need their own shard or a sub-key, which is a common follow-up.",
    },
    {
      id: "d2-21",
      domain: "d2",
      lesson: "d2-sharding",
      level: "staff",
      type: "order",
      prompt: "Order the steps of a zero-downtime migration from a single database to a new sharded store.",
      items: [
        "Start dual-writing every change to both the old and new store",
        "Backfill historical data into the new store",
        "Verify with shadow reads that compare old and new results",
        "Switch reads to the new store",
        "Stop writing to the old store and decommission it",
      ],
      explanation: "Dual writes first so nothing written during the backfill is missed, then backfill, then prove correctness with shadow reads, cut over reads (reversibly), and only then retire the old path.",
    },
    {
      id: "d2-22",
      domain: "d2",
      lesson: "d2-models",
      level: "staff",
      prompt: "A team proposes a wide-column NoSQL store for a new order system: about 200 writes/s, multi-row transactions, and finance wants ad hoc reporting. What should you recommend?",
      options: [
        "A relational database: the load fits comfortably on one primary with replicas, and it gives transactions and ad hoc SQL",
        "The NoSQL store, because it scales better in theory",
        "Two databases from day one, NoSQL for writes and relational for reads",
        "A cache as the system of record",
      ],
      answer: [0],
      explanation: "Choose for the requirements, not hypothetical scale. 200 writes/s is small for a relational primary, and the transactional and reporting needs point there. Revisit partitioning if growth estimates demand it.",
    },
    {
      id: "d2-23",
      domain: "d2",
      lesson: "d2-models",
      level: "intermediate",
      prompt: "The home page joins five tables on every request and is too slow. Denormalising the author's name into each post row is proposed. What is the trade-off?",
      options: [
        "Faster reads with no join, but a name change must update many post rows",
        "Faster writes and slower reads",
        "No trade-off: denormalised data never gets out of sync",
        "It removes the need for indexes",
      ],
      answer: [0],
      explanation: "Denormalisation trades write work and consistency risk for read speed. It's worth it on hot read paths when the duplicated data rarely changes.",
    },
  ],

  cards: [
    { id: "c-d2-acid", domain: "d2", kind: "concept", term: "ACID", definition: "Atomicity, Consistency, Isolation, Durability: the guarantees of a database transaction." },
    { id: "c-d2-postgres", domain: "d2", kind: "service", term: "PostgreSQL", definition: "Open-source relational database: ACID transactions, rich SQL, B-tree and other index types, streaming replication." },
    { id: "c-d2-cassandra", domain: "d2", kind: "service", term: "Cassandra", definition: "Leaderless wide-column store: partitioned by key on a consistent-hash ring, tunable quorum consistency, very high write throughput." },
    { id: "c-d2-dynamodb", domain: "d2", kind: "service", term: "DynamoDB", definition: "Managed key-value and document store: partition key (+ sort key), predictable single-digit-ms access at any scale." },
    { id: "c-d2-btree", domain: "d2", kind: "concept", term: "B-tree index", definition: "Balanced sorted tree mapping column values to rows: seeks, ranges and ORDER BY in O(log n)." },
    { id: "c-d2-leftmost", domain: "d2", kind: "concept", term: "Leftmost-prefix rule", definition: "A composite index (a, b, c) serves queries on a, a+b, a+b+c, but not on b or c alone." },
    { id: "c-d2-keyset", domain: "d2", kind: "concept", term: "Keyset pagination", definition: "WHERE id < :last ORDER BY id DESC LIMIT n. Constant cost per page and stable under inserts, unlike OFFSET." },
    { id: "c-d2-replica", domain: "d2", kind: "concept", term: "Read replica", definition: "A follower copy of the primary that serves reads and can be promoted on failover. Lags when async." },
    { id: "c-d2-quorum", domain: "d2", kind: "concept", term: "Quorum (R + W > N)", definition: "With N replicas, writes wait for W acks and reads ask R replicas; overlap guarantees reads see the latest write." },
    { id: "c-d2-sharding", domain: "d2", kind: "concept", term: "Sharding", definition: "Horizontal partitioning: each node owns part of the keys. Pick a key that spreads load and keeps queries local." },
    { id: "c-d2-consistent-hashing", domain: "d2", kind: "service", term: "Consistent hashing", definition: "Nodes and keys on a hash ring; a key belongs to the next node clockwise, so changes move only ~1/N of keys." },
    { id: "c-d2-vnodes", domain: "d2", kind: "service", term: "Virtual nodes", definition: "Each physical node owns many points on the hash ring, evening out load and spreading a leaving node's keys." },
    { id: "c-d2-crdt", domain: "d2", kind: "service", term: "CRDT", definition: "Conflict-free replicated data type: counters, sets and maps whose concurrent updates always merge deterministically." },
  ],

  challenges: [
    {
      id: "ch-sd-wall",
      domain: "d2",
      lesson: "d2-replication",
      title: "Hit the write wall",
      goal: "With a cache hit ratio of at least 95% and at least 4 read replicas, push traffic until the primary saturates anyway.",
      hint: "Replicas only take reads. 10% of traffic is writes, and the primary handles ~5,000 QPS.",
      takeaway: "Caching and read replicas scale reads only. When writes saturate the primary you need to shard, batch, or queue writes.",
      render: (onSolved) => <CapacityLab goal="wall" onSolved={onSolved} />,
    },
    {
      id: "ch-sd-ring-add",
      domain: "d2",
      lesson: "d2-sharding",
      title: "Add a node, move few keys",
      goal: "Add a node so that fewer than a third of the keys move on the ring, and compare with hash % N.",
      hint: "Adding a node only takes over the arc between it and its predecessor.",
      takeaway: "Consistent hashing moves roughly 1/N of keys when membership changes; modulo hashing moves most of them.",
      render: (onSolved) => <HashRingLab goal="add" onSolved={onSolved} />,
    },
    {
      id: "ch-sd-ring-balance",
      domain: "d2",
      lesson: "d2-sharding",
      title: "Balance the ring",
      goal: "With at least 4 nodes, get the busiest node down to no more than 1.25× its fair share of keys.",
      hint: "With one point per node, arcs are wildly uneven. Try virtual nodes.",
      takeaway: "Virtual nodes give each server many small arcs, so load evens out and a leaving node's keys spread across everyone.",
      render: (onSolved) => <HashRingLab goal="balance" onSolved={onSolved} />,
    },
  ],
});
