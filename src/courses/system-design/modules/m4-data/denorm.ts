import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-denorm",
  module: "m4",
  title: "Denormalisation",
  visual: {
    preview: true,
    kind: "tiles",
    tiles: [
      { icon: "🏢", title: "Federation", text: "One database per function: users, orders, products." },
      { icon: "📑", title: "Denormalise", text: "Copy data so a read needs no joins." },
      { icon: "🪞", title: "Materialised view", text: "A saved query result the database keeps current." },
    ],
  },
  screens: [
    { kind: "idea", text: "A **normalised** schema stores each fact once and joins tables when reading. It keeps writes simple and data correct, but a busy page can need many joins on every view." },
    { kind: "idea", text: "**Federation** splits one database into several by function: users in one, orders in another, products in a third. Each is smaller and can scale on its own, but joins across them move into the app." },
    { kind: "idea", text: "**Denormalisation** copies data into the place it's read. A post row might store the author's name, so showing a feed skips the join to users." },
    { kind: "idea", text: "Most apps read far more than they write, often 100 reads for every write. Paying a little extra on each write to make every read cheap is usually a good trade." },
    { kind: "idea", text: "The cost is keeping copies in step. When the author renames, every post that stores the name must change too, or some pages show the old name." },
    { kind: "idea", text: "A **materialised view** is a query result the database saves and keeps up to date, so reading it is one lookup. Some databases refresh it on a schedule, so it can lag a little." },
    {
      kind: "example",
      title: "A feed that needed six joins",
      steps: [
        "The feed query joins posts, users, follows, likes, comments and media. At 50,000 views a second the database can't keep up.",
        "We build a feed row per post that already holds the author's name, avatar, like count and first image.",
        "Showing the feed becomes one read of ready rows. Writes now do extra work: a new like also bumps the copy.",
        "When someone renames, a background job updates their copied name. The feed may show the old one for a few seconds.",
      ],
    },
  ],
  tip: "When you denormalise, say which reads it speeds up, which writes now fan out, and how stale a copy may get.",
  quiz: [
    {
      kind: "mcq",
      id: "t-denorm-q1",
      prompt: "Posts store a copy of the author's name. What extra work does a rename now need?",
      options: ["Rebuilding every index", "Updating every post's copy", "Re-sharding the users table", "Locking the whole posts table"],
      answer: 1,
      explanation: "Each copy of the name must change too, or some pages keep showing the old one.",
    },
    {
      kind: "mcq",
      id: "t-denorm-q2",
      prompt: "What does federation split a database by?",
      options: ["By function, like users and orders", "By row ranges of a shard key", "By the age of each stored record", "By the mix of read and write traffic"],
      answer: 0,
      explanation: "Federation gives each function its own database. Splitting rows by key is sharding.",
    },
    {
      kind: "mcq",
      id: "t-denorm-q3",
      prompt: "When is denormalising most worth it?",
      options: ["Writes far outnumber reads", "Data changes every second", "Reads far outnumber writes", "Only one user reads the data"],
      answer: 2,
      explanation: "Extra cost on a few writes buys cheap reads, which pays off when reads dominate.",
    },
    {
      kind: "tf",
      id: "t-denorm-q4",
      statement: "A materialised view saves a query's result so reading it is a single lookup.",
      answer: true,
      explanation: "The database stores the result and keeps it current, so reads skip the original query.",
    },
    {
      kind: "tf",
      id: "t-denorm-q5",
      statement: "Denormalising a schema makes writes cheaper as well as reads.",
      answer: false,
      explanation: "Reads get cheaper, but writes now update several copies, so they cost more.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-denorm-p1",
      prompt: "After federating users and orders into separate databases, where does \"orders with buyer names\" get joined?",
      options: ["Inside the orders database", "In the application code", "In the load balancer", "In a read replica"],
      answer: 1,
      explanation: "The databases can't join across each other, so the app fetches from both and combines them.",
    },
    {
      kind: "tf",
      id: "t-denorm-p2",
      statement: "A materialised view refreshed on a schedule can show slightly old results.",
      answer: true,
      explanation: "Between refreshes the saved result doesn't reflect new writes.",
    },
    {
      kind: "mcq",
      id: "t-denorm-p3",
      prompt: "A dashboard runs the same heavy sales-by-region query hundreds of times a minute. What's a good fix?",
      options: ["Add a column family", "Shard by region name", "A materialised view of it", "Switch the database to async replicas"],
      answer: 2,
      explanation: "Saving the result once and reading it many times avoids rerunning the heavy query.",
    },
  ],
  practiceNeeds: ["t-index", "t-sharding"],
  sources: [
    { title: "System Design Primer: Federation and Denormalization", url: "https://github.com/donnemartin/system-design-primer#federation", license: "CC BY 4.0" },
    { title: "PostgreSQL docs: Materialized Views", url: "https://www.postgresql.org/docs/current/rules-materializedviews.html", license: "Link only" },
  ],
};

export default topic;
