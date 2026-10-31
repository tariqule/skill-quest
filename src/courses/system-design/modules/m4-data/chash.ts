import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-chash",
  module: "m4",
  title: "Consistent hashing",
  visual: {
    kind: "flow",
    steps: [
      { icon: "🔑", label: "Key", sub: "Hashed to a point" },
      { icon: "⭕", label: "Ring", sub: "Walk clockwise" },
      { icon: "🖥️", label: "Node", sub: "First node you meet owns it" },
    ],
  },
  screens: [
    { kind: "idea", text: "The simple way to spread keys over N nodes is **hash mod N**: hash the key, divide by N, and the remainder picks the node. It's even and fast." },
    { kind: "idea", text: "The problem is changing N. Going from 4 nodes to 5 changes the remainder for most keys, so nearly everything moves. For a cache, that's a sudden flood of misses." },
    { kind: "idea", text: "**Consistent hashing** places nodes and keys on the same hash ring, a circle of hash values. Each key belongs to the first node you meet going clockwise from the key's spot." },
    { kind: "idea", text: "Adding a node only takes the keys between it and the node before it. Removing one hands its keys to the next node. Either way, only about **1/N** of the keys move." },
    { kind: "idea", text: "With only a few points on the ring, some nodes get much bigger arcs than others. **Virtual nodes** fix this: each server sits at many points, so its share evens out." },
    { kind: "idea", text: "Virtual nodes also help with uneven machines: a bigger server gets more points and so more keys. Cassandra's token ring and Memcached client libraries both use this idea." },
    {
      kind: "example",
      title: "Growing a cache from 4 to 5 nodes",
      steps: [
        "A cache holds 10 million keys on 4 nodes using hash mod 4.",
        "Switching to mod 5 changes the node for about 80% of keys. The cache misses on most reads and the database is flooded.",
        "On a hash ring, the new node takes keys only from its clockwise neighbours, about a fifth of them.",
        "With 100 virtual nodes per server, that fifth comes from every old node evenly, not from one unlucky neighbour.",
      ],
    },
  ],
  tip: "When nodes join or leave, say how many keys move. \"About 1/N with consistent hashing, nearly all with mod N\" is the line to remember.",
  quiz: [
    {
      kind: "mcq",
      id: "t-chash-q1",
      prompt: "On a hash ring, which node owns a key?",
      options: ["The node with the most free space", "The first node clockwise from the key", "The node whose number equals the hash mod N", "The node that wrote the key first"],
      answer: 1,
      explanation: "You walk clockwise from the key's point, and the first node you reach owns it.",
    },
    {
      kind: "mcq",
      id: "t-chash-q2",
      prompt: "Why give each server many virtual nodes on the ring?",
      options: ["To store each key several times", "To make hashing faster", "To even out each server's share", "To keep keys in sorted order"],
      answer: 2,
      explanation: "Many points per server average out the arc sizes, so load spreads evenly.",
    },
    {
      kind: "mcq",
      id: "t-chash-q3",
      prompt: "A ring of 10 nodes gains an 11th. Roughly what share of keys moves?",
      options: ["About 1/11", "About half", "Nearly all of them", "None of them"],
      answer: 0,
      explanation: "The new node takes only its own arc, about 1/N of the keys.",
    },
    {
      kind: "tf",
      id: "t-chash-q4",
      statement: "With hash mod N, adding one node changes the home of most keys.",
      answer: true,
      explanation: "Changing N changes the remainder for most keys, so most of them move.",
    },
    {
      kind: "tf",
      id: "t-chash-q5",
      statement: "When a node leaves a hash ring, its keys are spread evenly over all the other nodes.",
      answer: false,
      explanation: "Without virtual nodes, its keys all go to the next node clockwise. Virtual nodes are what spread them out.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-chash-p1",
      prompt: "One server has twice the memory of the others. How can a hash ring give it more keys?",
      options: ["Give it more virtual nodes", "Hash its keys twice", "Use mod N for it only", "Put it first on the ring, before the others"],
      answer: 0,
      explanation: "More points on the ring means a bigger total arc, so it owns more keys.",
    },
    {
      kind: "tf",
      id: "t-chash-p2",
      statement: "Consistent hashing places both nodes and keys on the same ring of hash values.",
      answer: true,
      explanation: "Sharing one ring is what lets a key find its node by walking clockwise.",
    },
    {
      kind: "mcq",
      id: "t-chash-p3",
      prompt: "Why does mod N resharding hurt a cache cluster so much?",
      options: ["The keys get larger", "Most keys miss at once", "Writes stop for an hour", "TTLs reset to zero"],
      answer: 1,
      explanation: "Most keys now map to a node that doesn't have them, so reads miss together and hit the database.",
    },
    {
      kind: "tf",
      id: "t-chash-p4",
      statement: "Removing one node from a ring of 8 moves roughly an eighth of the keys.",
      answer: true,
      explanation: "Only the leaving node's keys move, which is about 1/N of them.",
    },
  ],
  practiceNeeds: ["t-sharding"],
  sources: [
    { title: "Consistent Hashing and Random Trees (Karger et al., 1997)", url: "https://dl.acm.org/doi/10.1145/258533.258660", license: "Link only" },
    { title: "Apache Cassandra: Dynamo-style data distribution", url: "https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html", license: "Link only" },
  ],
};

export default topic;
