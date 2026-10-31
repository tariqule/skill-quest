import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-sharding",
  module: "m4",
  title: "Sharding",
  visual: {
    kind: "flow",
    steps: [
      { icon: "📨", label: "Request", sub: "user_id 1234" },
      { icon: "🧭", label: "Router", sub: "Shard key picks a shard" },
      { icon: "🗄️", label: "Shard 3 of 4", sub: "Holds that user's rows" },
    ],
  },
  screens: [
    { kind: "idea", text: "Replication copies all the data. **Sharding** (also called partitioning) splits it, so each machine holds only part. It's how you grow past what one machine can store or write." },
    { kind: "idea", text: "**Vertical partitioning** splits by columns or tables, such as moving large profile photos out of the users table into their own store." },
    { kind: "idea", text: "**Horizontal partitioning** splits rows, so users 1 to 1 million live on one shard and the next million on another. This is what sharding usually means." },
    { kind: "idea", text: "The **shard key** decides which shard a row lives on. Splitting by key ranges keeps neighbours together for range scans. Hashing the key spreads rows evenly but scatters ranges." },
    { kind: "idea", text: "A good shard key spreads load evenly and matches how you query. A bad one makes a **hot shard**: one celebrity's posts, or every write for today's date, landing on the same machine." },
    { kind: "idea", text: "**Request routing** is how a query finds its shard: the client knows the mapping, a routing layer looks it up, or any node forwards the request. The mapping itself is usually kept in a small config service." },
    { kind: "idea", text: "A query by shard key hits one shard. A query on another column must ask **every** shard and merge the results, called scatter-gather. Cross-shard joins and transactions are slow and hard." },
    { kind: "idea", text: "A **local secondary index** lives on each shard and covers only that shard's rows. Writes stay on one shard, but a search by the indexed value must ask every shard." },
    { kind: "idea", text: "A **global secondary index** is partitioned by the indexed value itself. A search hits one place, but each write may update two shards: the row's and the index's." },
    { kind: "idea", text: "**Resharding**, moving data when you add shards, is painful: data is copied while traffic keeps flowing. With hash mod N, changing N moves almost every key, which is why consistent hashing exists." },
    {
      kind: "example",
      title: "Splitting users across 4 shards",
      steps: [
        "A users table outgrows one database. We pick user_id as the shard key and hash it, so users spread evenly.",
        "Shard is hash(user_id) mod 4. A login for user 1234 goes straight to one shard.",
        "\"Find users by email\" no longer knows the shard, so we add a global index from email to user_id.",
        "Growing to 5 shards would remap most users under mod 5. We plan for consistent hashing before that day.",
      ],
    },
  ],
  tip: "Say your shard key out loud and test it against your biggest query and your hottest user. Then name what becomes a scatter-gather.",
  quiz: [
    {
      kind: "mcq",
      id: "t-sharding-q1",
      prompt: "Posts are sharded by creation date. What problem will this cause?",
      options: ["Today's writes all hit one hot shard", "Reads by date need every shard", "Old posts can no longer be indexed", "Each post ends up stored on two shards"],
      answer: 0,
      explanation: "Every new post has today's date, so all current writes pile onto one shard.",
    },
    {
      kind: "mcq",
      id: "t-sharding-q2",
      prompt: "Orders are sharded by customer_id. Which query becomes a scatter-gather across every shard?",
      options: ["All orders for customer 7", "Customer 7's newest order", "The count of customer 7's orders", "All orders for product 99"],
      answer: 3,
      explanation: "Product isn't the shard key, so every shard must be asked and the results merged.",
    },
    {
      kind: "mcq",
      id: "t-sharding-q3",
      prompt: "What's the trade-off of a global secondary index compared with local ones?",
      options: ["Reads ask every shard", "Writes update two places", "It only works for range queries", "It can't be sharded"],
      answer: 1,
      explanation: "Reads can go to one index partition, but each write updates the row's shard and the index's partition.",
    },
    {
      kind: "tf",
      id: "t-sharding-q4",
      statement: "Hashing the shard key spreads rows evenly but makes range scans touch many shards.",
      answer: true,
      explanation: "Hashing scatters neighbouring keys, which balances load but splits ranges across shards.",
    },
    {
      kind: "tf",
      id: "t-sharding-q5",
      statement: "Going from 4 to 5 shards with hash mod N moves about a fifth of the keys.",
      answer: false,
      explanation: "Changing N in hash mod N remaps most keys. Moving only a small share is what consistent hashing gives.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-sharding-p1",
      prompt: "What's the main reason to shard rather than add read replicas?",
      options: ["To survive a machine failing", "To serve more reads per row", "To grow writes and storage", "To keep data in one place"],
      answer: 2,
      explanation: "Replicas copy everything, so writes and storage still hit one size limit. Sharding splits them across machines.",
    },
    {
      kind: "tf",
      id: "t-sharding-p2",
      statement: "Moving large profile photos into their own table is a form of vertical partitioning.",
      answer: true,
      explanation: "Splitting by columns or tables, not rows, is vertical partitioning.",
    },
    {
      kind: "mcq",
      id: "t-sharding-p3",
      prompt: "A chat app shards messages by channel_id. One channel has 2 million members. What should worry you?",
      options: ["A hot shard for that channel", "Lost updates on messages", "A slow join to the users table", "Dirty reads between channels"],
      answer: 0,
      explanation: "Every message for that huge channel lands on one shard, which can overload it.",
    },
  ],
  practiceNeeds: ["t-replication"],
  sources: [
    { title: "DynamoDB: Partitions and data distribution", url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.Partitions.html", license: "Link only" },
    { title: "System Design Primer: Sharding", url: "https://github.com/donnemartin/system-design-primer#sharding", license: "CC BY 4.0" },
  ],
};

export default topic;
