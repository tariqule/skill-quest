import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-consistency",
  module: "m5",
  title: "Consistency models",
  visual: {
    kind: "ladder",
    caption: "From strongest to weakest",
    rungs: [
      { icon: "🔒", name: "Strong", text: "Every read sees the latest write." },
      { icon: "🔗", name: "Causal", text: "Causes are seen before their effects." },
      { icon: "🙋", name: "Read-your-writes", text: "You always see your own changes." },
      { icon: "⏳", name: "Eventual", text: "Copies agree once writes stop." },
      { icon: "📞", name: "Weak", text: "Best effort, like a dropped call frame." },
    ],
  },
  screens: [
    { kind: "idea", text: "A **consistency model** is the promise a store makes about what reads can see while copies catch up. Stronger promises are easier to build on. Weaker ones are faster and stay up through more failures." },
    { kind: "idea", text: "**Strong** consistency, also called **linearizable**, makes the store act like one copy: once a write succeeds, every later read sees it. Locks and leader elections need this." },
    { kind: "idea", text: "**Weak** consistency is best effort: a read may or may not see a write. A video call works this way: a lost frame is skipped, not resent." },
    { kind: "idea", text: "**Eventual** consistency promises that if writes stop, all copies will agree in time. Until then, different readers can see different values. DNS and many caches work this way." },
    { kind: "idea", text: "In between sit session promises. **Read-your-writes**: you see your own changes at once. **Monotonic reads**: you never see older data after newer data. **Causal**: a reply is never seen before the post it answers." },
    { kind: "idea", text: "Leaderless stores use **quorums**. With N copies, a write waits for W of them and a read asks R. If **R + W > N**, every read set overlaps the latest write set, so a read finds the newest value." },
    { kind: "idea", text: "A database's docs say what it promises. **Jepsen** tests what it does, by injecting partitions and crashes. Its reports have found stores losing writes they had acknowledged. Treat claims as claims until tested." },
    {
      kind: "example",
      title: "A post, its author and their friends",
      steps: [
        "Priya posts a photo. The write lands on one replica and spreads to the others within a second.",
        "Priya's reload must show the post, so her reads use read-your-writes. Friends seeing it a second later is fine: eventual.",
        "A friend replies. Causal consistency means nobody sees the reply without the photo it answers.",
        "The store keeps 3 copies. Writing to 2 and reading from 2 gives 4, more than 3, so every read overlaps the latest write.",
      ],
    },
  ],
  tip: "Name the weakest model each feature can live with, and the one place you need strong consistency. That shows you can trade speed for correctness on purpose.",
  quiz: [
    {
      kind: "mcq",
      id: "t-consistency-q1",
      prompt: "A store keeps 5 copies, so N is 5. Which R and W settings make every read overlap the latest write?",
      options: ["W = 2, R = 2", "W = 3, R = 3", "W = 1, R = 3", "W = 2, R = 3"],
      answer: 1,
      explanation: "R plus W must be more than N. Only 3 plus 3 makes 6, which is more than 5.",
    },
    {
      kind: "mcq",
      id: "t-consistency-q2",
      prompt: "A user sees a reply to a comment before the comment itself. Which model would prevent this?",
      options: ["Eventual consistency", "Weak consistency", "Causal consistency", "Monotonic writes"],
      answer: 2,
      explanation: "Causal consistency keeps causes ahead of their effects, so a reply can't appear before what it answers.",
    },
    {
      kind: "mcq",
      id: "t-consistency-q3",
      prompt: "A database's docs promise strong consistency. What does a Jepsen analysis add?",
      options: ["A test of the promise under real failures", "A faster way to reach strong consistency", "A formal proof the docs are correct", "A setting that turns on quorums"],
      answer: 0,
      explanation: "Jepsen injects partitions and crashes and checks what the store really does, which can differ from the docs.",
    },
    {
      kind: "tf",
      id: "t-consistency-q4",
      statement: "Under eventual consistency, two readers can see different values for the same key at the same moment.",
      answer: true,
      explanation: "Copies may not have caught up yet, so readers hitting different copies can disagree for a while.",
    },
    {
      kind: "tf",
      id: "t-consistency-q5",
      statement: "Read-your-writes means every user sees every write as soon as it succeeds.",
      answer: false,
      explanation: "It only promises that you see your own writes. Seeing everyone's writes at once is strong consistency.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-consistency-p1",
      prompt: "Which job most needs strong (linearizable) consistency?",
      options: ["Counting page views", "Showing a friend's status", "Granting one lock holder", "Caching a product image"],
      answer: 2,
      explanation: "Two clients both thinking they hold the lock is a real bug, so every read must see the latest write.",
    },
    {
      kind: "tf",
      id: "t-consistency-p2",
      statement: "With 3 copies, writing to 1 and reading from 1 can miss the latest write.",
      answer: true,
      explanation: "1 plus 1 is 2, which isn't more than 3, so the read copy and the write copy may not overlap.",
    },
    {
      kind: "mcq",
      id: "t-consistency-p3",
      prompt: "A user refreshes and sees an older balance than they saw a second ago. Which promise was broken?",
      options: ["Causal order", "Monotonic reads", "Eventual agreement", "Weak consistency"],
      answer: 1,
      explanation: "Monotonic reads promise you never see older data after newer data.",
    },
    {
      kind: "tf",
      id: "t-consistency-p4",
      statement: "Eventual consistency promises that copies agree once writes stop, but not when.",
      answer: true,
      explanation: "It gives no deadline. Copies converge some time after the writes stop.",
    },
  ],
  practiceNeeds: ["t-cap", "t-replication"],
  sources: [
    { title: "Jepsen analyses", url: "https://jepsen.io/analyses", license: "Link only" },
    { title: "Jepsen: Consistency models map", url: "https://jepsen.io/consistency", license: "Link only" },
    { title: "System Design Primer: Consistency patterns", url: "https://github.com/donnemartin/system-design-primer#consistency-patterns", license: "CC BY 4.0" },
  ],
};

export default topic;
