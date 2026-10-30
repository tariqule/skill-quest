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
    summary: "Choosing between SQL and NoSQL, indexes that match your queries, copies of data and how far behind they run, and splitting data across machines without moving all of it.",
  },

  tasks: [
    { id: "2.1", title: "Choose a data model", covers: ["relational vs key-value, document, wide-column, graph", "ACID transactions", "modelling from access patterns", "denormalisation"] },
    { id: "2.2", title: "Index and query efficiently", covers: ["B-tree indexes", "composite index column order", "covering indexes", "keyset pagination"] },
    { id: "2.3", title: "Replicate and partition data", covers: ["leader-follower replication", "sync vs async and replication lag", "quorums", "sharding keys, hot keys, consistent hashing", "online migrations"] },
  ],

  lessons: [
    {
      id: "d2-start-db",
      level: "beginner",
      task: "2.1",
      title: "What a database does",
      check: ["sd-b2-01", "sd-b2-02"],
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "📚", title: "Like a library", text: "Books (your data) sit on shelves in a fixed order, so the librarian can find any one quickly.", color: "#60a5fa" },
            { icon: "🗂️", title: "Tables and rows", text: "A table is like a spreadsheet. Each row is one thing, such as one customer, and each column is one detail about it.", color: "#2dd4bf" },
            { icon: "🔎", title: "Index", text: "Like the catalogue at the front of the library. It points you to the right shelf instead of checking every book.", color: "#facc15" },
            { icon: "💾", title: "Kept safe", text: "Once the database says \"saved\", the data survives a crash or a restart.", color: "#f472b6" },
          ]}
        />
      ),
      points: [
        "A **database** is a program that stores your app's data and finds it again quickly. Think of a library with a very fast librarian.",
        "Most apps start with a **relational database**, also called SQL. It keeps data in tables of rows and columns, a bit like spreadsheets that can refer to each other.",
        "An **index** is the library catalogue. Without one, finding a customer means reading every row. With one, the database jumps straight to the right place.",
        "**NoSQL** databases store data in other shapes, such as simple key and value pairs. They trade some flexibility for speed or size in specific jobs.",
      ],
      tip: "If you're unsure which database to pick, a relational one is a safe first answer. Then say what would make you switch.",
    },
    {
      id: "d2-start-copies",
      level: "beginner",
      task: "2.3",
      title: "Copies and splits",
      check: ["sd-b2-03", "sd-b2-04"],
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "📑", title: "Replication: make copies", text: "Several machines hold the same data. If one breaks, another still has everything, and they can share the reading work.", color: "#60a5fa" },
            { icon: "✂️", title: "Sharding: split it up", text: "Each machine holds a different part, such as customers A to M on one and N to Z on another. Together they hold more than one machine could.", color: "#a78bfa" },
          ]}
        />
      ),
      points: [
        "One database machine can fail or run out of room. Big systems solve this in two ways: by copying the data and by splitting it.",
        "**Replication** means keeping copies of the same data on several machines. It's like a library keeping spare copies of popular books in other branches.",
        "**Sharding** means splitting the data so each machine holds only part of it. It's like putting surnames A to M in one filing cabinet and N to Z in another.",
        "Copies help with reading and with surviving failures. Splits help when there's too much data, or too many writes, for one machine.",
      ],
      tip: "Real systems usually do both: the data is split into shards, and each shard has copies.",
    },
    {
      id: "d2-models",
      level: "junior",
      task: "2.1",
      title: "SQL or NoSQL",
      check: ["d2-01", "d2-02"],
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🧮", title: "Relational (PostgreSQL, MySQL)", text: "Tables, joins, ACID transactions and flexible queries. The default for business data with relationships.", color: "#60a5fa" },
            { icon: "🔑", title: "Key-value (Redis, DynamoDB)", text: "Get and put by key, very fast and at huge volume. Good for sessions, carts, counters and caches.", color: "#2dd4bf" },
            { icon: "📄", title: "Document (MongoDB)", text: "JSON-like documents whose shape can vary. You read a whole item in one go.", color: "#facc15" },
            { icon: "🧱", title: "Wide-column (Cassandra)", text: "Split by key and sorted inside each split. Handles enormous write volume for time series and feeds.", color: "#f472b6" },
          ]}
        />
      ),
      points: [
        "Start from the **access patterns**: which reads and writes happen, how often, and what must always be correct.",
        "Relational databases go further than people expect. Choose NoSQL for a specific reason, such as more writes than one machine can take, a changing data shape, or one particular access pattern.",
        "**ACID** describes a safe transaction. Atomic: all of it happens or none does. Consistent: the rules still hold. Isolated: others don't see half-done work. Durable: saved data survives a crash.",
        "**Denormalising** means storing the same data in more than one place. Reads get faster, but every write must keep the copies in step.",
      ],
      tip: "Don't pick a database by brand. Say \"I need this access pattern and this level of consistency, so I'll use this\", and you've answered the follow-up already.",
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
            caption="Put the equality column first and the sort or range column second. Then one index handles both the filter and the ORDER BY."
            code={`-- a user's newest orders
CREATE INDEX idx_orders_user_created ON orders (user_id, created_at);

SELECT id, total FROM orders
WHERE user_id = 42
ORDER BY created_at DESC
LIMIT 20;`}
          />
          <CodeCompare
            lang="sql"
            left={{ title: "OFFSET: reads rows and throws them away", code: `SELECT * FROM posts
ORDER BY id DESC
LIMIT 20 OFFSET 100000;` }}
            right={{ title: "Keyset: jumps straight there", code: `SELECT * FROM posts
WHERE id < 98213  -- last id seen
ORDER BY id DESC
LIMIT 20;` }}
          />
        </div>
      ),
      points: [
        "An **index** is a sorted structure, usually a B-tree, that lets the database jump to rows instead of scanning them all. It takes space and slows every write that has to update it.",
        "Indexes on several columns follow the **leftmost-prefix rule**. An index on (a, b) helps queries on a, or on a and b, but not on b alone.",
        "A **covering index** holds every column a query needs, so the database can answer from the index without visiting the table.",
        "OFFSET pagination slows down the deeper you go and shifts when new rows arrive. **Keyset** (cursor) pagination stays fast and steady.",
      ],
      tip: "When you add an index in a design, name the query it serves. \"An index on (user_id, created_at) for the timeline query\" is the senior answer.",
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
            caption="The quorum rule: if R + W is more than N, every group of replicas you read from overlaps the latest group that confirmed a write."
            code={`replication_factor: 3   # N copies of each item
write_quorum: 2         # W acks before a write succeeds
read_quorum: 2          # R replicas consulted per read
# 2 + 2 > 3 → reads see the latest acknowledged write`}
          />
        </div>
      ),
      points: [
        "In **leader-follower** replication, one primary takes all writes and streams the changes to replicas. The replicas serve reads and can take over if the primary fails.",
        "Replicas help with reads and with staying up. They don't help with writes, because every write still lands on the primary.",
        "**Asynchronous** replication is fast, but replicas run a little behind, so a user can read back stale data. **Synchronous** replication avoids losing writes but makes each write slower.",
        "Leaderless stores, in the style of Amazon's Dynamo, use **quorums**. With N copies, a write waits for W of them and a read asks R. If R plus W is more than N, the two groups always overlap.",
      ],
      tip: "Whenever you add read replicas, say how you'll handle lag. A common answer: read a user's own recent writes from the primary.",
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
        "Shard when one machine can't hold the data or keep up with the writes. Each shard owns a slice of the keys.",
        "Pick a **shard key** that spreads load evenly and keeps each query on one shard. For per-user data, user_id is the usual choice.",
        "A **hot key**, such as a celebrity or a viral product, can overload its shard. Split it across several keys with salting, or soak up its reads with a cache.",
        "**Consistent hashing** puts machines and keys on a ring, so adding or removing a machine moves only about 1/N of the keys. Virtual nodes even out the load.",
      ],
      tip: "Always say what sharding breaks: joins and transactions across shards, globally unique ids, and rebalancing. Then say how you'd handle each.",
    },
  ],

  questions: [
    // ───────────── beginner ─────────────
    {
      id: "sd-b2-01",
      domain: "d2",
      lesson: "d2-start-db",
      level: "beginner",
      prompt: "What is the main job of a database?",
      options: [
        "To store an app's data safely and find it again quickly",
        "To draw the app's screens",
        "To send emails to users",
        "To make the internet connection faster",
      ],
      answer: [0],
      explanation: "A database is where an app keeps its data, like a library keeps its books. It stores things safely and finds them again fast when the app asks.",
    },
    {
      id: "sd-b2-02",
      domain: "d2",
      lesson: "d2-start-db",
      level: "beginner",
      prompt: "A table holds a million customers. Which feature lets the database find one customer without reading every row?",
      options: ["An index", "A backup", "A password", "A bigger screen"],
      answer: [0],
      explanation: "An index works like a library catalogue: it points straight to the right place. Without one, the database has to check rows one by one, which gets slow as the table grows.",
    },
    {
      id: "sd-b2-03",
      domain: "d2",
      lesson: "d2-start-copies",
      level: "beginner",
      prompt: "Keeping the same data on three machines, so one can fail without losing anything, is called what?",
      options: ["Replication", "Sharding", "Caching", "Compression"],
      answer: [0],
      explanation: "Replication means making copies. If one machine breaks, the others still have all the data. Sharding is different: it splits the data so each machine holds only part.",
    },
    {
      id: "sd-b2-04",
      domain: "d2",
      lesson: "d2-start-copies",
      level: "beginner",
      type: "output",
      prompt: "A company has 4 TB of data. Each machine holds 1 TB. Type how many machines you need if you split the data evenly (number only).",
      code: "total_data   = 4   # TB\nper_machine  = 1   # TB\nmachines = total_data / per_machine",
      codeLang: "python",
      answers: ["4"],
      explanation: "4 TB split into 1 TB pieces gives 4 pieces, so you need 4 machines. That's sharding: each machine holds a different quarter of the data. Real designs add spare room for growth too.",
    },

    // ───────────── junior and up ─────────────
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
      explanation: "The debit and the credit must both happen or neither should. That's atomicity, and it's exactly what relational ACID transactions give you, along with enforcing the rules on the data.",
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
        ["Document store", "A product catalogue where each item has different attributes"],
        ["Wide-column store", "Write-heavy sensor readings, split by device and sorted by time"],
        ["Graph database", "\"Friends of friends who like this band\" lookups"],
      ],
      explanation: "Key-value stores are fastest for looking up one key. Documents suit items whose shape varies. Wide-column stores shine with split, sorted, write-heavy data. Graph databases make questions that hop across relationships feel natural.",
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
      explanation: "Atomicity means you never get half a transaction. Availability is a real concern, but it belongs to the CAP discussion, not to ACID.",
    },
    {
      id: "d2-04",
      domain: "d2",
      lesson: "d2-models",
      level: "intermediate",
      prompt: "You're designing tables for a wide-column store like Cassandra. Where should you start?",
      options: [
        "From a fully normalised entity-relationship diagram, then add joins",
        "From the queries the app will run, with one table per access pattern and duplicated data where needed",
        "From the number of columns each entity has",
        "From the default schema the database generates",
      ],
      answer: [1],
      explanation: "These stores have no joins. They only query efficiently by partition key and the sort order inside it. So you design each table around a query and accept that some data is stored twice.",
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
      explanation: "Indexes make matching reads much faster, but they take disk space and add work to every write. They don't change transaction isolation.",
    },
    {
      id: "d2-06",
      domain: "d2",
      lesson: "d2-indexes",
      level: "intermediate",
      type: "lines",
      prompt: "The busiest query is slow even though there's an index. Tap the line that should change.",
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
      explanation: "With created_at first, the index is sorted by time across all users. The database walks through lots of other people's orders to find 20 of this user's. Put the equality column first, `(user_id, created_at)`, and it jumps to the user and reads their orders already in date order.",
    },
    {
      id: "d2-07",
      domain: "d2",
      lesson: "d2-indexes",
      level: "intermediate",
      prompt: "Deep pages of this feed take seconds, and users see repeats when new posts arrive. Which replacement fixes both?",
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
      explanation: "Keyset pagination uses the index to jump to the last id the client saw. Every page costs the same, and new rows don't shift the window. OFFSET still reads 100,000 rows and throws them away.",
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
      explanation: "The index is sorted by last_name first, like a phone book. Without a last name to start from, every Ada is scattered throughout it. That's the leftmost-prefix rule.",
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
      explanation: "A covering index saves one random trip to the table for every matching row. INCLUDE, which PostgreSQL and SQL Server both support, stores extra columns in the index without making them part of the sort order.",
    },
    {
      id: "d2-10",
      domain: "d2",
      lesson: "d2-replication",
      level: "junior",
      prompt: "What do read replicas help with?",
      options: [
        "Handling more read traffic and keeping a standby copy for failover",
        "Scaling write throughput linearly",
        "Removing the need for backups",
        "Making transactions span multiple databases",
      ],
      answer: [0],
      explanation: "Replicas copy the primary's data, so they can serve reads and take over if the primary fails. Every write still goes through the primary. They don't replace backups either, because they copy mistakes too.",
    },
    {
      id: "d2-11",
      domain: "d2",
      lesson: "d2-replication",
      level: "intermediate",
      prompt: "A user edits their bio, the page reloads, and the old bio appears. Reads go to asynchronous replicas. What's the most targeted fix?",
      options: [
        "Send that user's reads to the primary for a short time after they write (read-your-writes)",
        "Switch all reads in the system to the primary",
        "Give the replicas more CPU",
        "Cache the bio for longer",
      ],
      answer: [0],
      explanation: "This is replication lag: the replica hasn't caught up yet. Reading a recent writer's own data from the primary, or from a replica known to have their write, fixes it while the replicas still carry everyone else's reads.",
    },
    {
      id: "d2-12",
      domain: "d2",
      lesson: "d2-replication",
      level: "intermediate",
      prompt: "What's the main trade-off of synchronous replication compared with asynchronous?",
      options: [
        "No confirmed write is lost on failover, but writes are slower and can stall if the replica is down",
        "Writes become faster, but data can be lost",
        "Reads become impossible on the replica",
        "It removes the need for a primary",
      ],
      answer: [0],
      explanation: "Synchronous replication waits for the replica before confirming, which adds a round trip and ties your uptime to the replica's. Many systems go halfway: wait for one replica and copy to the rest in the background.",
    },
    {
      id: "d2-13",
      domain: "d2",
      lesson: "d2-replication",
      level: "senior",
      prompt: "A Dynamo-style store is set up like this. What does it guarantee when no nodes fail?",
      code: `replication_factor: 3   # N
write_quorum: 2         # W
read_quorum: 2          # R`,
      codeLang: "yaml",
      options: [
        "Every read reaches at least one replica that has the latest confirmed write, because R + W > N",
        "Every write is stored on all three replicas before it succeeds",
        "Reads never contact more than one replica",
        "The cluster survives two simultaneous node failures for both reads and writes",
      ],
      answer: [0],
      explanation: "2 plus 2 is 4, which is more than 3, so any 2 replicas you read overlap any 2 that were written. Losing two of the three nodes leaves only one, which can't make up a quorum of 2.",
    },
    {
      id: "d2-14",
      domain: "d2",
      lesson: "d2-replication",
      level: "senior",
      prompt: "With N of 5 replicas and a write quorum W of 2, what's the smallest read quorum R that still guarantees reads overlap the latest write?",
      options: ["2", "3", "4", "5"],
      answer: [2],
      explanation: "You need R plus W to be more than N. So R must be more than 5 minus 2, which is 3, and the smallest whole number is 4. Cheap writes force reads to ask most of the replicas.",
    },
    {
      id: "d2-15",
      domain: "d2",
      lesson: "d2-replication",
      level: "staff",
      prompt: "Two regions both accept writes. A user adds an item to their cart in one region while their partner removes another item in the other. Which conflict strategy keeps both edits?",
      options: [
        "Last-write-wins by wall-clock timestamp",
        "Model the cart as a mergeable structure, such as a CRDT of added and removed items, so concurrent edits merge",
        "Reject both writes and ask the users to retry",
        "Keep whichever region's data is larger",
      ],
      answer: [1],
      explanation: "Last-write-wins quietly throws one update away, and it depends on clocks agreeing. A CRDT (conflict-free replicated data type) merges edits made at the same time in a predictable way, which suits carts, counters and sets.",
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
      explanation: "Sharding divides the data, and with it the writes and the storage, across machines. Replication copies the same data instead. Most large systems do both.",
    },
    {
      id: "d2-17",
      domain: "d2",
      lesson: "d2-sharding",
      level: "senior",
      prompt: "Keys are placed with `hash(key) % N`. Roughly what share of keys move when N goes from 4 to 5?",
      options: ["About 20%", "About 50%", "About 80%", "None"],
      answer: [2],
      explanation: "A key stays put only if its hash leaves the same remainder when divided by 4 and by 5. That's true for 4 out of every 20 values, so 20% stay and about 80% move. Consistent hashing would move only about a fifth.",
    },
    {
      id: "d2-18",
      domain: "d2",
      lesson: "d2-sharding",
      level: "senior",
      prompt: "Data is sharded by user_id. One celebrity's account gets a huge share of the writes and overloads its shard. What's the standard fix?",
      options: [
        "Split the hot key by adding a small suffix (celeb_id#0 to #9) to spread its writes, merge on read, and cache its popular reads",
        "Reshard everything by created_at instead",
        "Give that shard a longer TTL",
        "Block the celebrity's account",
      ],
      answer: [0],
      explanation: "Salting spreads one logical key over several shards, at the cost of reading from all of them and combining the results. Sharding by time would just create one hot shard for \"right now\".",
    },
    {
      id: "d2-19",
      domain: "d2",
      lesson: "d2-sharding",
      level: "senior",
      type: "lines",
      prompt: "Message ids must be unique across the whole system so clients can spot duplicates and refer to messages. Tap the line that breaks this.",
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
      explanation: "Each shard has its own counter, so every shard hands out 1, 2, 3 and so on. Use ids that are unique everywhere: a Snowflake-style id (timestamp, machine and sequence), a UUID, or blocks of ids reserved for each shard.",
    },
    {
      id: "d2-20",
      domain: "d2",
      lesson: "d2-sharding",
      level: "intermediate",
      prompt: "In a multi-tenant SaaS app, almost every query filters by tenant. What's the usual shard key, and what's its main risk?",
      options: [
        "tenant_id, which keeps each tenant's queries on one shard; the risk is a few huge tenants creating hot shards",
        "created_at, which spreads writes evenly; there is no risk",
        "A random UUID per row, which keeps tenant queries on one shard",
        "The primary key of each table, which makes cross-table joins local",
      ],
      answer: [0],
      explanation: "Sharding by tenant means most queries touch just one shard. Very large tenants may need a shard of their own or a second key to split them, which is a common follow-up question.",
    },
    {
      id: "d2-21",
      domain: "d2",
      lesson: "d2-sharding",
      level: "staff",
      type: "order",
      prompt: "Put the steps of a zero-downtime move from one database to a new sharded store in order.",
      items: [
        "Start writing every change to both the old and the new store",
        "Copy the historical data into the new store",
        "Check correctness with shadow reads that compare old and new results",
        "Switch reads to the new store",
        "Stop writing to the old store and retire it",
      ],
      explanation: "Write to both first, so nothing written during the copy gets missed. Then copy the history, prove the results match, switch reads over in a way you can undo, and only then retire the old store.",
    },
    {
      id: "d2-22",
      domain: "d2",
      lesson: "d2-models",
      level: "staff",
      prompt: "A team proposes a wide-column NoSQL store for a new order system: about 200 writes a second, multi-row transactions, and finance wants to run its own reports. What should you recommend?",
      options: [
        "A relational database: the load fits easily on one primary with replicas, and it gives transactions and ad hoc SQL",
        "The NoSQL store, because it scales better in theory",
        "Two databases from day one, NoSQL for writes and relational for reads",
        "A cache as the system of record",
      ],
      answer: [0],
      explanation: "Choose for the real requirements, not imagined scale. 200 writes a second is small for a relational primary, and the need for transactions and reporting points the same way. Revisit splitting the data if growth estimates call for it.",
    },
    {
      id: "d2-23",
      domain: "d2",
      lesson: "d2-models",
      level: "intermediate",
      prompt: "The home page joins five tables on every request and is too slow. Someone proposes copying the author's name into each post row. What's the trade-off?",
      options: [
        "Faster reads with no join, but a name change must update many post rows",
        "Faster writes and slower reads",
        "No trade-off: duplicated data never gets out of sync",
        "It removes the need for indexes",
      ],
      answer: [0],
      explanation: "Denormalising trades extra write work, and the risk of copies drifting apart, for faster reads. It's worth it on busy read paths when the copied data rarely changes.",
    },
  ],

  cards: [
    { id: "c-d2-acid", domain: "d2", kind: "concept", term: "ACID", definition: "Atomicity, Consistency, Isolation and Durability: the four promises of a database transaction." },
    { id: "c-d2-postgres", domain: "d2", kind: "service", term: "PostgreSQL", definition: "An open-source relational database with ACID transactions, rich SQL, B-tree and other index types, and streaming replication." },
    { id: "c-d2-cassandra", domain: "d2", kind: "service", term: "Cassandra", definition: "A wide-column store with no leader. Data is split by key on a consistent-hash ring, consistency is tunable with quorums, and it takes huge write volumes." },
    { id: "c-d2-dynamodb", domain: "d2", kind: "service", term: "DynamoDB", definition: "A managed key-value and document store. You look items up by a partition key, plus an optional sort key, in a few milliseconds at any scale." },
    { id: "c-d2-btree", domain: "d2", kind: "concept", term: "B-tree index", definition: "A balanced, sorted tree that maps column values to rows. Lookups, ranges and ORDER BY each take O(log n)." },
    { id: "c-d2-leftmost", domain: "d2", kind: "concept", term: "Leftmost-prefix rule", definition: "An index on (a, b, c) helps queries on a, on a and b, or on all three. It doesn't help a query on b or c alone." },
    { id: "c-d2-keyset", domain: "d2", kind: "concept", term: "Keyset pagination", definition: "WHERE id < :last ORDER BY id DESC LIMIT n. Every page costs the same and new rows don't shift it, unlike OFFSET." },
    { id: "c-d2-replica", domain: "d2", kind: "concept", term: "Read replica", definition: "A copy of the primary that serves reads and can take over in a failover. With asynchronous replication it runs slightly behind." },
    { id: "c-d2-quorum", domain: "d2", kind: "concept", term: "Quorum (R + W > N)", definition: "With N copies, writes wait for W confirmations and reads ask R copies. When R plus W is more than N, reads always see the latest write." },
    { id: "c-d2-sharding", domain: "d2", kind: "concept", term: "Sharding", definition: "Splitting data so each machine owns part of the keys. Pick a key that spreads load and keeps each query on one machine." },
    { id: "c-d2-consistent-hashing", domain: "d2", kind: "service", term: "Consistent hashing", definition: "Machines and keys sit on a hash ring, and each key belongs to the next machine clockwise. A change moves only about 1/N of the keys." },
    { id: "c-d2-vnodes", domain: "d2", kind: "service", term: "Virtual nodes", definition: "Each machine owns many points on the hash ring. This evens out load and spreads a leaving machine's keys across everyone." },
    { id: "c-d2-crdt", domain: "d2", kind: "service", term: "CRDT", definition: "A conflict-free replicated data type: counters, sets and maps whose simultaneous edits always merge the same way." },
  ],

  challenges: [
    {
      id: "ch-sd-wall",
      domain: "d2",
      lesson: "d2-replication",
      title: "Hit the write wall",
      goal: "Set the cache hit ratio to at least 95% and use at least 4 read replicas. Then push traffic up until the primary overloads anyway.",
      hint: "Replicas only take reads. A tenth of the traffic is writes, and the primary handles about 5,000 QPS.",
      takeaway: "Caching and read replicas only help reads. When writes overload the primary, you need to shard, batch or queue them.",
      render: (onSolved) => <CapacityLab goal="wall" onSolved={onSolved} />,
    },
    {
      id: "ch-sd-ring-add",
      domain: "d2",
      lesson: "d2-sharding",
      title: "Add a node, move few keys",
      goal: "Add a node so that fewer than a third of the keys move on the ring, and compare that with hash % N.",
      hint: "A new node only takes over the stretch of ring between itself and the node before it.",
      takeaway: "Consistent hashing moves about 1/N of the keys when a node joins or leaves. Modulo hashing moves most of them.",
      render: (onSolved) => <HashRingLab goal="add" onSolved={onSolved} />,
    },
    {
      id: "ch-sd-ring-balance",
      domain: "d2",
      lesson: "d2-sharding",
      title: "Balance the ring",
      goal: "With at least 4 nodes, get the busiest node down to no more than 1.25 times its fair share of keys.",
      hint: "With one point per node, the stretches of ring are very uneven. Try virtual nodes.",
      takeaway: "Virtual nodes give each server many small stretches of the ring, so load evens out and a leaving node's keys spread across everyone.",
      render: (onSolved) => <HashRingLab goal="balance" onSolved={onSolved} />,
    },
  ],
});
