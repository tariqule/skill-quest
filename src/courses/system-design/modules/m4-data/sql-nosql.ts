import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-sql-nosql",
  module: "m4",
  title: "SQL and NoSQL",
  visual: {
    kind: "tiles",
    tiles: [
      { icon: "📋", title: "Relational", text: "Tables, rows, joins and a fixed schema." },
      { icon: "🔑", title: "Key-value", text: "Look up one value by its key, very fast." },
      { icon: "📄", title: "Document", text: "Each record is a nested JSON-like document." },
      { icon: "🕸️", title: "Graph", text: "Nodes and edges, built for following links." },
    ],
  },
  screens: [
    { kind: "idea", text: "A **relational** (SQL) database stores data in tables of rows and columns. Each table has a **schema**: the columns and their types are declared up front, and every row follows them." },
    { kind: "idea", text: "A **join** combines rows from two tables that share a value, such as orders and customers by customer id. Joins let you store each fact once and combine facts when you read." },
    { kind: "idea", text: "**NoSQL** is a loose name for databases that aren't relational tables. Most give up joins or a fixed schema in exchange for simpler scaling across many machines." },
    { kind: "idea", text: "A **key-value** store keeps one value per key, like a giant dictionary. Reads and writes by key are very fast, but you can't easily ask \"which keys have this value?\" Redis and DynamoDB work this way." },
    { kind: "idea", text: "A **document** store keeps each record as a nested JSON-like document. Related data lives inside one document, so one read fetches it all. Documents in one collection can have different fields. MongoDB is the usual example." },
    { kind: "idea", text: "A **wide-column** store, first described in Google's Bigtable paper, sorts rows by a **row key**. Columns are grouped into **column families**, and each cell can keep several versions by timestamp. Cassandra and HBase follow this model." },
    { kind: "idea", text: "A **graph** database stores nodes and the edges between them. Questions like \"friends of my friends\" follow edges directly instead of running many joins. Neo4j is a well-known one." },
    {
      kind: "example",
      title: "Picking a store for each job",
      steps: [
        "An online shop needs orders, login sessions and a \"people you may know\" feature.",
        "Orders need correct totals across tables and flexible reports, so they go in a relational database like PostgreSQL.",
        "Sessions are looked up only by session id and expire, so a key-value store like Redis fits.",
        "\"People you may know\" walks friend links two hops out, which a graph database like Neo4j handles directly.",
      ],
    },
    { kind: "idea", text: "In an interview, start from the data's shape and how it's queried. Relational is a safe default. Reach for NoSQL when you can name the access pattern it serves better." },
  ],
  tip: "Name the access pattern first (\"look up by user id\", \"report across orders\"), then pick the store that serves it. Don't choose NoSQL just because it sounds scalable.",
  quiz: [
    {
      kind: "mcq",
      id: "t-sql-nosql-q1",
      prompt: "Login sessions are read and written only by session id. Which store fits best?",
      options: ["A graph database", "A wide-column store with timestamps", "A key-value store", "A relational table with joins"],
      answer: 2,
      explanation: "Access is purely by key, which is exactly what a key-value store does fastest.",
    },
    {
      kind: "mcq",
      id: "t-sql-nosql-q2",
      prompt: "In a wide-column store like Bigtable or Cassandra, what decides the order rows are stored in?",
      options: ["The row key", "The column family name", "The time each row was inserted", "The size of each row"],
      answer: 0,
      explanation: "Rows are kept sorted by row key, so choosing the key decides which rows sit together.",
    },
    {
      kind: "mcq",
      id: "t-sql-nosql-q3",
      prompt: "Which feature lets a relational database store each fact once and combine facts at read time?",
      options: ["Wide column families", "Nested documents", "Session expiry", "Joins between tables"],
      answer: 3,
      explanation: "Joins combine rows that share a value, so data doesn't need to be copied into every place it's used.",
    },
    {
      kind: "tf",
      id: "t-sql-nosql-q4",
      statement: "Two documents in the same document-store collection can have different fields.",
      answer: true,
      explanation: "Document stores don't force one schema on every record, so fields can vary between documents.",
    },
    {
      kind: "tf",
      id: "t-sql-nosql-q5",
      statement: "A graph database answers \"friends of friends\" by running many joins between tables.",
      answer: false,
      explanation: "A graph database follows stored edges directly. Many joins is how a relational database would do it.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-sql-nosql-p1",
      prompt: "A blog stores each post with its tags and comments, and always shows them together. Which model keeps that to one read?",
      options: ["A document store", "A key-value store of comment ids", "Separate relational tables", "A graph of posts and tags"],
      answer: 0,
      explanation: "A document keeps the post, tags and comments nested together, so one read returns everything.",
    },
    {
      kind: "tf",
      id: "t-sql-nosql-p2",
      statement: "A relational schema declares a table's columns and their types before rows are added.",
      answer: true,
      explanation: "That up-front schema is what makes every row in a relational table follow the same shape.",
    },
    {
      kind: "mcq",
      id: "t-sql-nosql-p3",
      prompt: "A finance team needs ad hoc reports that combine orders, refunds and customers. What's the safest choice?",
      options: ["A key-value store", "A relational database", "A graph database", "A cache in front of files"],
      answer: 1,
      explanation: "Flexible reports across related tables are what relational databases and joins are built for.",
    },
  ],
  sources: [
    { title: "Bigtable: A Distributed Storage System for Structured Data (Chang et al., 2006)", url: "https://research.google/pubs/bigtable-a-distributed-storage-system-for-structured-data/", license: "Link only" },
    { title: "System Design Primer: SQL or NoSQL", url: "https://github.com/donnemartin/system-design-primer#sql-or-nosql", license: "CC BY 4.0" },
  ],
};

export default topic;
