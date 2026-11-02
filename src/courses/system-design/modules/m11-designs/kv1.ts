import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-design-kv-1",
  module: "m11",
  title: "Design a key-value store: the big choices",
  level: "intermediate",
  visual: {
    kind: "flow",
    steps: [
      { icon: "📱", label: "Client", sub: "Calls put or get on any node" },
      { icon: "🧭", label: "Coordinator", sub: "The node that took the call" },
      { icon: "⭕", label: "Hash ring", sub: "Finds the servers that own the key" },
      { icon: "🗄️", label: "N copies", sub: "On the next N different servers" },
      { icon: "✅", label: "Quorum reply", sub: "Answers after W or R of them" },
    ],
  },
  screens: [
    { kind: "idea", text: "The ask: \"Design a key-value store with two calls, put(key, value) and get(key).\" Ask how big values are, how much data there is, the read and write rates, and whether a slightly stale read is acceptable." },
    { kind: "idea", text: "A typical agreement: values under 1 KB on average, terabytes in total, stays up through failures, consistency set per request, servers added without downtime, and reads and writes in a few milliseconds. The store treats each value as **opaque** bytes." },
    {
      kind: "example",
      title: "Sizing the cluster",
      steps: [
        "Assume 5 billion keys averaging 1 KB, key included. That's 5 billion KB, about 5 TB of data before any copies.",
        "Keep 3 copies of every key so a dead machine loses nothing. The cluster now stores about 15 TB.",
        "Give each node a 4 TB disk but plan to fill only half, leaving room for background merging and growth. That's 2 TB per node.",
        "15 TB divided by 2 TB is 7.5, so you need at least 8 nodes. Round up to 10 so losing one or two still fits.",
        "At 20,000 writes a second, 3 copies make 60,000 replica writes a second. Spread over 10 nodes, that's 6,000 each, which one node handles easily.",
      ],
    },
    { kind: "idea", text: "Start simple: one server holding a **hash table** in memory, so put and get each take one lookup. It's fast and takes an afternoon to build." },
    { kind: "idea", text: "Then say what breaks. 15 TB won't fit in one machine's memory. Compressing values and keeping cold keys on disk buy time, but one machine still fills up, and when it dies everything is gone." },
    { kind: "idea", text: "So split the keys over many servers, a **distributed hash table**. You need two things from the split: keys spread evenly, and very few keys moving when a server joins or leaves." },
    { kind: "idea", text: "You've already designed this: consistent hashing. Hash servers and keys onto one ring, and a key belongs to the next server clockwise. A new server takes only one arc, so scaling can run automatically." },
    { kind: "idea", text: "Virtual nodes also handle mixed hardware. Give a server with twice the disk twice as many points on the ring, and it gets about twice the keys. That's **heterogeneity** handled without special cases." },
    { kind: "idea", text: "For copies, walk clockwise from the key and keep the first N **distinct** physical servers, skipping extra points that belong to a server already picked. Two copies on one machine would die together." },
    { kind: "idea", text: "Now apply CAP. When a partition cuts one copy off, a CP store refuses writes until it heals. An AP store keeps taking writes on both sides and syncs later. Since staying up was agreed, choose AP." },
    { kind: "idea", text: "The node that takes a request is the coordinator. It sends a write to all N copies and replies once W confirm. W is how long it waits, not how many copies get the data." },
    {
      kind: "example",
      title: "Choosing W and R with N of 3",
      steps: [
        "W 2 and R 2: 2 plus 2 is 4, more than 3, so reads overlap the latest write. Both survive one copy down.",
        "W 3 and R 1: still 4, so overlap holds and reads are fastest. But one copy down blocks every write to that key.",
        "W 1 and R 1: 2 isn't more than 3, so a read can miss the latest write. It's the fastest and survives two copies down.",
        "Make W 2 and R 2 the default, and let callers ask for W 1 and R 1 on data where a stale read is harmless, like view counts.",
      ],
    },
    { kind: "idea", text: "Last, name the consistency model. Strong consistency would mean waiting for copies to agree, which blocks during failures. Pick **eventual** consistency by default: copies may differ briefly, so conflicting versions can appear, and part 2 handles them." },
  ],
  tip: "Say the CAP choice out loud and tie it to the requirements: \"we agreed it must stay up, so it's AP with W and R set per request.\"",
  quiz: [
    {
      kind: "mcq",
      id: "t-design-kv-1-q1",
      prompt: "With virtual nodes, the first points clockwise from a key belong to servers A, A, B, C. With N of 3, where do the copies go?",
      options: ["A twice, then B, as listed", "Only A and B, two copies", "A, B and C", "A, B and any healthy server"],
      answer: 2,
      explanation: "The walk skips a second point owned by A, so the copies land on three different machines. Two copies on A would fail together, two copies is fewer than N, and a random server couldn't be found again on a read.",
    },
    {
      kind: "mcq",
      id: "t-design-kv-1-q2",
      prompt: "The store holds shopping carts, and a cart must accept items even while the network is split. Which CAP choice fits?",
      options: ["CP: refuse writes until it heals", "AP: take writes and sync later", "CA: run with no partitions at all", "CP: send all writes to one node"],
      answer: 1,
      explanation: "Accepting writes on both sides of a split is the AP choice. CP refuses some writes, which breaks the requirement. CA isn't on offer because partitions happen anyway, and one node for all writes is a single point of failure.",
    },
    {
      kind: "mcq",
      id: "t-design-kv-1-q3",
      prompt: "N is 3. A team sets W to 3 and R to 1 to make reads as fast as possible. What does that cost them?",
      options: ["Reads can miss the latest write", "Writes return before any copy", "Each key is kept on only one server", "One copy down blocks every write"],
      answer: 3,
      explanation: "A write must hear from all 3 copies, so a single dead copy stops writes to that key. Reads still overlap, since 3 plus 1 is 4, more than 3. Writes still go to all 3 copies; W only sets how many replies the coordinator waits for.",
    },
    {
      kind: "tf",
      id: "t-design-kv-1-q4",
      statement: "With W set to 1, the coordinator still sends the write to all N copies; it just replies after the first one confirms.",
      answer: true,
      explanation: "W is how many confirmations the coordinator waits for. Every copy still gets the write; the slower ones simply finish after the client has its answer.",
    },
    {
      kind: "tf",
      id: "t-design-kv-1-q5",
      statement: "A single server that compresses values and keeps cold keys on disk removes the need to spread the store over many machines.",
      answer: false,
      explanation: "Those tricks buy time, but one machine's disk still fills up, and when it fails all the data is unavailable. Big data and high availability need many servers.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-design-kv-1-p1",
      prompt: "3 billion keys of 2 KB each, 3 copies of every key, 2 TB usable per node. At least how many nodes?",
      options: ["3", "18", "9", "27"],
      answer: 2,
      explanation: "3 billion times 2 KB is 6 TB. Three copies make 18 TB, and 18 divided by 2 TB per node is 9. Three forgets the copies, 18 assumes 1 TB per node, and 27 counts the copies twice.",
    },
    {
      kind: "tf",
      id: "t-design-kv-1-p2",
      statement: "A server with twice the disk of the others should get about twice as many virtual nodes on the ring.",
      answer: true,
      explanation: "More points on the ring mean more arcs and so more keys. Matching points to capacity keeps every disk about equally full.",
    },
  ],
  practiceNeeds: ["t-estimation"],
  sources: [
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 6 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "DeCandia et al.: Dynamo, Amazon's Highly Available Key-value Store (2007)", url: "https://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf", license: "Link only" },
    { title: "Apache Cassandra docs: Dynamo", url: "https://cassandra.apache.org/doc/latest/cassandra/architecture/dynamo.html", license: "Link only" },
  ],
};

export default topic;
