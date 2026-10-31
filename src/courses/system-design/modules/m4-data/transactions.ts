import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-transactions",
  module: "m4",
  title: "Transactions and isolation",
  visual: {
    kind: "tiles",
    tiles: [
      { icon: "⚛️", title: "Atomic", text: "All of it happens, or none of it." },
      { icon: "✅", title: "Consistent", text: "Rules like \"stock can't go negative\" hold." },
      { icon: "🧱", title: "Isolated", text: "Concurrent work doesn't trip over itself." },
      { icon: "💾", title: "Durable", text: "Once committed, it survives a crash." },
    ],
  },
  screens: [
    { kind: "idea", text: "A **transaction** groups several reads and writes into one unit. **ACID** names its promises: atomic (all or nothing), consistent (rules hold), isolated (concurrent transactions don't interfere) and durable (committed data survives a crash)." },
    { kind: "idea", text: "**Isolation** is the hard part. Running transactions one at a time would be perfectly safe but slow, so databases let them overlap and offer **isolation levels** that allow some anomalies in exchange for speed." },
    { kind: "idea", text: "A **dirty read** is seeing another transaction's write before it commits. If that transaction rolls back, you acted on data that never existed. **Read committed**, a common default, prevents it." },
    { kind: "idea", text: "A **lost update** happens when two transactions read the same value, both change it, and the second write silently overwrites the first. Two people adding to one counter can lose an increment this way." },
    { kind: "idea", text: "**Snapshot isolation** gives each transaction a consistent snapshot of the database as of its start. It's built with **MVCC**: the database keeps several versions of each row, so readers don't block writers." },
    { kind: "idea", text: "Snapshot isolation still allows **write skew**: two transactions each check a condition, then write different rows, together breaking the rule. A **phantom** is a row that appears in a repeated search because someone else inserted it." },
    { kind: "idea", text: "**Serializable** isolation, the strictest level, makes the result match some one-at-a-time order. It prevents write skew and phantoms, at a cost in speed or in aborted transactions that must retry." },
    { kind: "idea", text: "**Pessimistic locking** takes a lock before changing a row, so others wait. **Optimistic locking** doesn't wait: it checks at commit that nobody changed the row, often with a version number, and retries if they did." },
    {
      kind: "example",
      title: "Two buyers, one last ticket",
      steps: [
        "One ticket is left. Alice and Bob both read \"1 left\" at the same moment.",
        "Both subtract one and write \"0 left\", then both get a confirmation. That's a lost update: two tickets sold, one existed.",
        "Pessimistic fix: SELECT ... FOR UPDATE locks the row, so Bob waits, then reads 0 and is told it's sold out.",
        "Optimistic fix: each write checks the row's version. Alice's commit bumps it, so Bob's check fails and he retries.",
      ],
    },
  ],
  tip: "For money, stock or seats, say which isolation level or lock prevents double-booking. \"Two users hit buy at once\" is the case interviewers probe.",
  quiz: [
    {
      kind: "mcq",
      id: "t-transactions-q1",
      prompt: "Two transactions each read a counter of 10, add one, and write 11. What went wrong?",
      options: ["A dirty read", "A phantom", "A lost update", "A failed commit"],
      answer: 2,
      explanation: "The second write overwrote the first, so one increment was lost.",
    },
    {
      kind: "mcq",
      id: "t-transactions-q2",
      prompt: "How does optimistic locking stop a conflicting update?",
      options: ["It locks the row before reading it", "It checks a version at commit and retries", "It runs every transaction one at a time", "It hides writes until a nightly batch"],
      answer: 1,
      explanation: "Optimistic locking doesn't wait. It detects at commit that the row changed and makes the loser retry.",
    },
    {
      kind: "mcq",
      id: "t-transactions-q3",
      prompt: "Two on-call doctors each see \"another doctor is on call\" and both go off call. Which anomaly is this?",
      options: ["Write skew", "A dirty read", "A lost update", "Replication lag"],
      answer: 0,
      explanation: "Each checked a condition, then wrote a different row, and together they broke the rule. That's write skew.",
    },
    {
      kind: "tf",
      id: "t-transactions-q4",
      statement: "With MVCC, a long-running read doesn't stop other transactions from writing.",
      answer: true,
      explanation: "MVCC keeps several versions of each row, so the reader uses its snapshot while writers add new versions.",
    },
    {
      kind: "tf",
      id: "t-transactions-q5",
      statement: "Snapshot isolation prevents write skew.",
      answer: false,
      explanation: "Snapshot isolation allows write skew. Serializable isolation is the level that prevents it.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-transactions-p1",
      prompt: "A transfer debits one account and the server crashes before the credit. Which ACID property undoes the debit?",
      options: ["Durability", "Isolation", "Atomicity", "Consistency"],
      answer: 2,
      explanation: "Atomicity means all or nothing, so the half-done transfer is rolled back.",
    },
    {
      kind: "tf",
      id: "t-transactions-p2",
      statement: "Read committed isolation stops a transaction from seeing another's uncommitted writes.",
      answer: true,
      explanation: "That's exactly the dirty read that read committed is there to prevent.",
    },
    {
      kind: "mcq",
      id: "t-transactions-p3",
      prompt: "What's the main cost of serializable isolation?",
      options: ["It allows dirty reads", "Slower work or more retries", "It loses data on a crash", "It can't use any indexes"],
      answer: 1,
      explanation: "Matching a one-at-a-time order means more waiting or more aborted transactions that must retry.",
    },
    {
      kind: "tf",
      id: "t-transactions-p4",
      statement: "Pessimistic locking makes a second writer wait until the first releases the row.",
      answer: true,
      explanation: "The lock is taken up front, so others queue behind it.",
    },
  ],
  practiceNeeds: ["t-sql-nosql"],
  sources: [
    { title: "CMU 15-445/645 Database Systems: concurrency control", url: "https://15445.courses.cs.cmu.edu/", license: "Link only" },
    { title: "Designing Data-Intensive Applications, chapter 7 (topic list)", url: "https://dataintensive.net/", license: "Link only" },
    { title: "PostgreSQL docs: Transaction Isolation", url: "https://www.postgresql.org/docs/current/transaction-iso.html", license: "Link only" },
  ],
};

export default topic;
