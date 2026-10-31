import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-index",
  module: "m4",
  title: "Indexes",
  visual: {
    kind: "flow",
    steps: [
      { icon: "🔎", label: "Query", sub: "WHERE user_id = 42" },
      { icon: "🌳", label: "Index", sub: "B-tree finds the rows" },
      { icon: "📦", label: "Rows", sub: "Read only what matches" },
    ],
  },
  screens: [
    { kind: "idea", text: "Without an index, the database answers a query with a **full table scan**: it reads every row and keeps the ones that match. That's fine for a thousand rows and painful for a billion." },
    { kind: "idea", text: "An **index** is a separate, sorted structure that maps column values to the rows that hold them. Like the index at the back of a book, it lets you jump straight to the right page." },
    { kind: "idea", text: "Most databases build indexes as a **B-tree**: a shallow, sorted tree of fixed-size pages. Finding one value takes a handful of page reads, even with billions of rows." },
    { kind: "idea", text: "A **composite index** covers several columns in order, such as (user_id, created_at). It helps queries that filter on its leading columns. This is the leftmost prefix rule: filtering only by created_at can't use it." },
    { kind: "idea", text: "A **covering index** holds every column a query needs, so the database answers from the index alone and never reads the table rows." },
    { kind: "idea", text: "Indexes aren't free. Every insert or update must also change each index on the table, so writes get slower and storage grows. Index the queries you actually run." },
    { kind: "idea", text: "An **LSM tree** takes a different path. Writes go to a sorted in-memory table, which is flushed to disk as an immutable sorted file called an SSTable. Cassandra and RocksDB work this way." },
    { kind: "idea", text: "A B-tree updates pages in place. An LSM tree only appends, so old SSTables pile up. Merging them in the background, dropping overwritten values, is called **compaction**." },
    { kind: "idea", text: "Both designs write the same data more than once: a B-tree rewrites whole pages, an LSM tree rewrites data during compaction. That extra disk work is called **write amplification**." },
    {
      kind: "example",
      title: "Fixing a slow feed query",
      steps: [
        "The query is: the 20 newest posts by user 42. With 500 million posts and no index, it scans every row.",
        "Add a composite index on (user_id, created_at). The B-tree jumps to user 42, already sorted by time.",
        "The database reads the last 20 entries for that user and stops. The query drops from seconds to milliseconds.",
        "A query filtering only by created_at still can't use this index, because user_id is its leftmost column.",
      ],
    },
  ],
  tip: "When a query is slow, say which index would serve it and why the column order matters. Mention the write cost so it's clear you know the trade-off.",
  quiz: [
    {
      kind: "mcq",
      id: "t-index-q1",
      prompt: "A table has an index on (user_id, created_at). Which query can't use it to find rows?",
      options: ["Filter by user_id only", "Filter by created_at only", "Filter by user_id and created_at", "Filter by user_id, sort by created_at"],
      answer: 1,
      explanation: "The leftmost prefix rule: the index is sorted by user_id first, so created_at alone can't use it.",
    },
    {
      kind: "mcq",
      id: "t-index-q2",
      prompt: "A log table takes far more writes than reads. Why might an LSM store suit it better than a B-tree?",
      options: ["It keeps fewer copies of each row", "It answers range reads with no disk access", "It appends writes and merges files later", "It stores rows without needing any keys"],
      answer: 2,
      explanation: "An LSM tree turns writes into appends to memory and sorted files, then compacts in the background, instead of updating pages in place.",
    },
    {
      kind: "mcq",
      id: "t-index-q3",
      prompt: "What makes an index a covering index for a query?",
      options: ["It holds every column the query needs", "It covers every row in the whole table", "It's rebuilt after every single write", "It's spread across several disks"],
      answer: 0,
      explanation: "If the index has all the needed columns, the database answers from the index and skips the table.",
    },
    {
      kind: "tf",
      id: "t-index-q4",
      statement: "Adding an index to a table makes inserts into that table slower.",
      answer: true,
      explanation: "Each insert must also update the index, so writes cost more as indexes are added.",
    },
    {
      kind: "tf",
      id: "t-index-q5",
      statement: "An LSM tree rewrites data only once, so it has no write amplification.",
      answer: false,
      explanation: "Compaction merges and rewrites SSTables, so the same data is written several times.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-index-p1",
      prompt: "Without an index, how does a database find the rows matching WHERE email = 'a@b.com'?",
      options: ["It hashes the email to a page", "It reads every row in a full table scan", "It asks a replica for the answer", "It looks the email up in the query cache"],
      answer: 1,
      explanation: "With nothing sorted by email, the only way is to read every row and check it.",
    },
    {
      kind: "tf",
      id: "t-index-p2",
      statement: "In an LSM tree, an SSTable on disk is changed in place when a row is updated.",
      answer: false,
      explanation: "SSTables are immutable. An update is a new write, and compaction later drops the old version.",
    },
    {
      kind: "mcq",
      id: "t-index-p3",
      prompt: "What does a B-tree do when a page it needs to insert into is already full?",
      options: ["It splits the page into two", "It starts a new SSTable", "It rejects the insert", "It moves the new row to an overflow log"],
      answer: 0,
      explanation: "A full B-tree page is split in two, and the parent page gets a pointer to the new one.",
    },
  ],
  practiceNeeds: ["t-sql-nosql"],
  sources: [
    { title: "CMU 15-445/645 Database Systems (lecture notes)", url: "https://15445.courses.cs.cmu.edu/", license: "Link only" },
    { title: "Database Internals (Alex Petrov): B-trees and LSM trees", url: "https://www.databass.dev/", license: "Link only" },
    { title: "Use The Index, Luke: the leftmost prefix", url: "https://use-the-index-luke.com/sql/where-clause/the-equals-operator/concatenated-keys", license: "Link only" },
  ],
};

export default topic;
