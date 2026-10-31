import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-cap",
  module: "m5",
  title: "CAP and PACELC",
  visual: {
    kind: "tiles",
    tiles: [
      { icon: "✂️", title: "Partition", text: "The network splits the replicas apart." },
      { icon: "🎯", title: "Consistent", text: "Refuse or wait, so nobody sees old data." },
      { icon: "🟢", title: "Available", text: "Answer anyway, maybe with old data." },
    ],
  },
  screens: [
    { kind: "idea", text: "A **network partition** is when some replicas can't reach others, though each is still running. Across many machines and racks it will happen, so a distributed database must plan for it." },
    { kind: "idea", text: "The **CAP theorem** says that during a partition, a replicated store has to choose. It can stay **consistent**, so no read returns stale data, or stay **available**, so every request gets an answer. Not both." },
    { kind: "idea", text: "Partition tolerance isn't something you can opt out of. So CAP is really a choice between **CP** (refuse some requests during a partition) and **AP** (answer, even if some answers are stale)." },
    { kind: "idea", text: "Pick by what a wrong answer costs. A bank balance or a seat booking should be CP: better to fail than to double-spend. A like count can be AP: a stale number for a minute hurts nobody." },
    { kind: "idea", text: "**PACELC** adds the normal case. If there's a Partition, choose Availability or Consistency. Else, when all is well, choose Latency or Consistency, because waiting for replicas to agree takes time." },
    { kind: "idea", text: "Real databases rarely fit one label. Many let you set the level per query, and their behaviour depends on configuration. Martin Kleppmann argues we should describe the actual guarantees instead of calling a database CP or AP." },
    {
      kind: "example",
      title: "Same partition, two answers",
      steps: [
        "The link between two data centres fails. Each side still has users and a replica.",
        "A transfer on side A would debit an account side B can't see. The bank's store refuses the write until the link heals: CP.",
        "A like on side A is accepted and counted locally. Side B shows a slightly lower count for a while: AP.",
        "When the link heals, the like counts merge. The bank never had two different balances to reconcile.",
      ],
    },
  ],
  tip: "Don't just say \"it's AP\". Say what users see during a partition and why that's acceptable for this data.",
  quiz: [
    {
      kind: "mcq",
      id: "t-cap-q1",
      prompt: "During a partition, a store keeps answering reads, though some may be stale. Which choice is this?",
      options: ["CP", "AP", "ACID", "PACELC's else branch"],
      answer: 1,
      explanation: "Answering anyway, possibly with stale data, is choosing availability: AP.",
    },
    {
      kind: "mcq",
      id: "t-cap-q2",
      prompt: "What does the \"else\" half of PACELC describe?",
      options: ["Latency traded against consistency", "What happens after a disk failure", "How partitions get repaired later", "How to pick a shard key"],
      answer: 0,
      explanation: "With no partition, you still trade lower latency against waiting for replicas to agree.",
    },
    {
      kind: "mcq",
      id: "t-cap-q3",
      prompt: "Which data most needs a CP choice?",
      options: ["View counts on a video", "A user's last-seen time", "Seat bookings on a flight", "The order of trending tags"],
      answer: 2,
      explanation: "Selling one seat twice is costly, so refusing writes during a partition is the safer choice.",
    },
    {
      kind: "tf",
      id: "t-cap-q4",
      statement: "Many databases can behave as more consistent or more available depending on how they're configured.",
      answer: true,
      explanation: "Settings like per-query consistency levels mean one CP or AP label rarely tells the whole story.",
    },
    {
      kind: "tf",
      id: "t-cap-q5",
      statement: "A distributed database can avoid CAP's trade-off by choosing not to tolerate partitions.",
      answer: false,
      explanation: "Partitions happen whether you plan for them or not, so the real choice is between C and A when they do.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-cap-p1",
      prompt: "What is a network partition?",
      options: ["Splitting a table across shards", "Replicas that can't reach each other", "A disk running out of space", "A leader handing off to a follower"],
      answer: 1,
      explanation: "A partition is a network split: nodes still run but can't talk across the gap.",
    },
    {
      kind: "tf",
      id: "t-cap-p2",
      statement: "Showing a like count that's a minute old during a partition is an acceptable AP trade-off.",
      answer: true,
      explanation: "A slightly stale like count hurts nobody, so staying available is the better choice.",
    },
    {
      kind: "mcq",
      id: "t-cap-p3",
      prompt: "With no partition, why might a store still answer from one replica without waiting for others?",
      options: ["To lower latency", "To avoid a split brain", "To save disk space", "To skip writing indexes"],
      answer: 0,
      explanation: "That's PACELC's else case: skipping the wait trades some consistency for lower latency.",
    },
  ],
  practiceNeeds: ["t-replication"],
  sources: [
    { title: "Martin Kleppmann: Please stop calling databases CP or AP", url: "https://martin.kleppmann.com/2015/05/11/please-stop-calling-databases-cp-or-ap.html", license: "Link only" },
    { title: "Daniel Abadi: Consistency Tradeoffs in Modern Distributed Database System Design (PACELC)", url: "https://www.cs.umd.edu/~abadi/papers/abadi-pacelc.pdf", license: "Link only" },
    { title: "System Design Primer: CAP theorem", url: "https://github.com/donnemartin/system-design-primer#cap-theorem", license: "CC BY 4.0" },
  ],
};

export default topic;
