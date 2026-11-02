import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-ddb",
  module: "m9",
  title: "Distributed databases",
  visual: {
    kind: "flow",
    steps: [
      { icon: "📱", label: "Client", sub: "Sends a read or write" },
      { icon: "🧭", label: "Coordinator", sub: "Any node; finds the key's replicas" },
      { icon: "🗄️", label: "N replicas", sub: "Waits for W writes or R reads" },
    ],
  },
  screens: [
    { kind: "idea", text: "With one leader per key, writes pause while a failed leader is replaced. Amazon's Dynamo design chose to accept writes on any replica instead, so a shopping cart could always take an item." },
    { kind: "idea", text: "You already know leaderless replication and quorums. This topic shows how a Dynamo-style store puts them together: where keys live, how reads and writes find them, and what happens when nodes fail." },
    { kind: "idea", text: "Keys sit on a hash ring with virtual nodes, as in consistent hashing. A key's N replicas are the first N different machines clockwise from it. That ordered set is its **preference list**." },
    { kind: "idea", text: "Clients can send a request to any node. That node acts as the **coordinator**: it looks up the key's preference list, forwards the request to those replicas and waits for enough of them to answer." },
    { kind: "idea", text: "Recall N, W and R: N copies, a write waits for W, a read asks R. When W + R is more than N, every read shares at least one replica with the latest write." },
    {
      kind: "example",
      title: "Quorums with three copies",
      steps: [
        "N is 3, W is 2 and R is 2. A write of price 12 reaches replicas 1 and 2. Replica 3 is slow and still holds 10.",
        "A read asks any 2 of the 3. Only replica 3 is stale, so every pair includes 1 or 2. That's the overlap: 2 plus 2 is 4, more than 3.",
        "Worst case, the read asks replicas 2 and 3. It gets 12 and 10, keeps the newer version by its vector clock, and returns 12.",
        "Now set W to 1 and R to 1. That totals 2, not more than 3, so a read can reach replica 3 alone and return the old 10.",
      ],
    },
    { kind: "idea", text: "Since W and R can be set per request, consistency is **tunable**. W of 3 with R of 1 gives fast reads, slow writes, and one dead replica blocks writes. W of 1 with R of 3 is the reverse." },
    { kind: "idea", text: "W of 2 and R of 2 with N of 3 is the usual balance: both survive one replica down. Overlap still isn't full strong consistency, because concurrent writes and the fallback below can break it." },
    { kind: "idea", text: "If two of a key's three replicas are down, a strict quorum refuses writes. A **sloppy quorum** stays up instead: the write goes to the first W healthy nodes on the ring, even ones outside the preference list." },
    { kind: "idea", text: "The stand-in node keeps that write with a note naming the real owner. When the owner comes back, the stand-in sends the write over and deletes its copy. That's **hinted handoff**, for short outages." },
    { kind: "idea", text: "A read that gets different versions can fix the stale replica on the spot by writing the newer one back. That's **read repair**, and it only heals keys that someone reads." },
    { kind: "idea", text: "A replica down for days, or replaced, misses far more than hints can carry. **Anti-entropy** is a background job where replicas compare their data and copy over whatever each is missing." },
    { kind: "idea", text: "Comparing every key is too slow, so replicas build a **Merkle tree**. Each leaf is a hash of one key range, and each parent is a hash of its children. Matching hashes mean matching data underneath." },
    {
      kind: "example",
      title: "Finding the drift",
      steps: [
        "Two replicas each hold 1 million keys, split into 1,024 ranges of about 1,000 keys. Each range's hash is a leaf.",
        "With two children per parent, the tree is 10 levels deep. The roots differ, so somewhere a range differs.",
        "They compare the two children at each level and follow only the mismatch: about 20 hashes, down to one bad range.",
        "They then sync that range's 1,000 keys instead of all 1 million.",
      ],
    },
    { kind: "idea", text: "With no leader, nodes still need to know who's alive. In a **gossip protocol**, every second each node swaps its member list and heartbeat counters with a few random others. News reaches all nodes in a few rounds." },
    { kind: "idea", text: "If a node's heartbeat counter stops rising for a while, say 10 seconds, other nodes mark it down and route around it. No central monitor is needed, so there's no single one to fail." },
    { kind: "idea", text: "Cassandra, ScyllaDB and Riak follow this design. Amazon DynamoDB, the cloud service, borrowed the name but uses a leader per partition. Pick leaderless when staying writable through failures matters more than strong consistency." },
  ],
  tip: "Give N, W and R as numbers, say what they cost for reads and writes, then name how you handle short outages (hinted handoff) and long ones (anti-entropy with Merkle trees).",
  quiz: [
    {
      kind: "mcq",
      id: "t-ddb-q1",
      prompt: "N is 5. Which choice makes every read overlap the latest write?",
      options: ["W of 2 and R of 2", "W of 3 and R of 2", "W of 3 and R of 3", "W of 1 and R of 4"],
      answer: 2,
      explanation: "3 plus 3 is 6, more than 5. The others total 4 or 5, which isn't more than 5, so a read set could miss the write set.",
    },
    {
      kind: "mcq",
      id: "t-ddb-q2",
      prompt: "A replica is down for 10 minutes. Its writes land on another node, which passes them back when it returns. What is this called?",
      options: ["Read repair", "Hinted handoff", "Anti-entropy", "Gossip"],
      answer: 1,
      explanation: "Hinted handoff holds writes for a missing owner. Read repair fixes replicas during reads, anti-entropy is the background comparison, and gossip shares who's alive.",
    },
    {
      kind: "mcq",
      id: "t-ddb-q3",
      prompt: "Why do replicas compare Merkle trees instead of every key?",
      options: ["To sort keys before copying them", "To elect a leader for each range", "To compress keys sent between them", "To skip ranges whose hashes match"],
      answer: 3,
      explanation: "Matching hashes mean matching data, so only mismatched branches are followed. The tree doesn't sort, elect leaders or compress anything.",
    },
    {
      kind: "tf",
      id: "t-ddb-q4",
      statement: "In a gossip protocol, nodes learn that a peer has failed without asking a central monitor.",
      answer: true,
      explanation: "Heartbeat counters spread from node to node. When one stops rising, every node can mark that peer down on its own.",
    },
    {
      kind: "tf",
      id: "t-ddb-q5",
      statement: "With N of 3, W of 1 and R of 1 still makes every read see the latest write.",
      answer: false,
      explanation: "1 plus 1 is 2, not more than 3, so a read can reach a replica the write never reached.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-ddb-p1",
      prompt: "N is 3. You want the fastest reads while every read still overlaps the latest write. Which settings?",
      options: ["R of 1 and W of 1", "R of 1 and W of 3", "R of 3 and W of 1", "R of 2 and W of 1"],
      answer: 1,
      explanation: "R of 1 is the fastest read, and W of 3 brings the total to 4, more than 3. R of 1 with W of 1 doesn't overlap, R of 3 is the slowest read, and 2 plus 1 isn't more than 3.",
    },
    {
      kind: "tf",
      id: "t-ddb-p2",
      statement: "A sloppy quorum can accept a write on nodes outside the key's preference list.",
      answer: true,
      explanation: "When the usual replicas are down, the write goes to the next healthy nodes on the ring, which hand it back later.",
    },
  ],
  practiceNeeds: ["t-consistency"],
  sources: [
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 6 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "DeCandia et al.: Dynamo, Amazon's Highly Available Key-value Store (2007)", url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf", license: "Link only" },
    { title: "Apache Cassandra docs: Dynamo", url: "https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html", license: "Link only" },
  ],
};

export default topic;
