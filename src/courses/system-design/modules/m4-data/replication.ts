import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-replication",
  module: "m4",
  title: "Replication",
  visual: {
    kind: "flow",
    steps: [
      { icon: "✍️", label: "Leader", sub: "Takes every write" },
      { icon: "📨", label: "Change log", sub: "Streamed to followers" },
      { icon: "📚", label: "Followers", sub: "Serve reads, a bit behind" },
    ],
  },
  screens: [
    { kind: "idea", text: "**Replication** keeps copies of the same data on several machines. It lets you survive a machine failing, serve more reads, and put data closer to users." },
    { kind: "idea", text: "The common setup is **leader-follower**. One **leader** takes all writes and streams each change to **followers**, which apply it in the same order. Reads can go to any copy." },
    { kind: "idea", text: "With **synchronous** replication, the leader waits for a follower to confirm before telling the client the write succeeded. With **asynchronous** replication it doesn't wait: faster, but a crash can lose the newest writes." },
    { kind: "idea", text: "Asynchronous followers run a little behind. That delay is **replication lag**, usually milliseconds, sometimes seconds. A read from a lagging follower returns old data." },
    { kind: "idea", text: "Two fixes for lag. **Read-your-writes**: send a user's reads to the leader for a short time after they write. **Monotonic reads**: keep each user on one follower, so they never see time go backwards." },
    { kind: "idea", text: "When the leader dies, a follower is promoted in a **failover**. The risks: an async follower may be missing writes, and two nodes may both think they're leader, called **split brain**." },
    { kind: "idea", text: "**Multi-leader** setups accept writes in several places, such as one leader per region. Two leaders can change the same record at once, so conflicts must be resolved." },
    { kind: "idea", text: "**Last-write-wins** keeps the write with the latest timestamp and drops the rest, which silently loses data. A **CRDT** is a data type designed so concurrent changes merge automatically, like a counter that adds both increments." },
    { kind: "idea", text: "**Leaderless** stores, like Cassandra, send each write to several replicas and read from several. A **quorum** means enough replicas answered that a read overlaps the latest write." },
    {
      kind: "example",
      title: "The bio that wouldn't update",
      steps: [
        "Sam edits their bio. The write goes to the leader and returns success.",
        "The profile page reloads and reads from a follower that's 2 seconds behind. Sam sees the old bio and edits again.",
        "Read-your-writes fixes it: for 10 seconds after a write, Sam's own profile reads go to the leader.",
        "Other users can still read from followers. A friend seeing the new bio a second late is fine.",
      ],
    },
  ],
  tip: "When you add read replicas, say how you handle lag for the user who just wrote. It shows you know replicas aren't free copies.",
  quiz: [
    {
      kind: "mcq",
      id: "t-replication-q1",
      prompt: "A user saves a post, reloads, and the post is missing. Reads go to async followers. What's the likely cause?",
      options: ["A lost update on the leader", "Replication lag on a follower", "A dirty read on the leader", "The index on posts is missing"],
      answer: 1,
      explanation: "The follower hadn't applied the write yet, so the reload read old data.",
    },
    {
      kind: "mcq",
      id: "t-replication-q2",
      prompt: "Two regions both accept writes, and the same counter is incremented in each at once. Which approach keeps both increments?",
      options: ["Last-write-wins by timestamp", "Promoting one region to leader", "Reading from the nearer region", "A CRDT counter that merges them"],
      answer: 3,
      explanation: "A CRDT counter is built so concurrent increments merge. Last-write-wins would keep one and drop the other.",
    },
    {
      kind: "mcq",
      id: "t-replication-q3",
      prompt: "What's the risk of asynchronous replication if the leader crashes?",
      options: ["Recent writes may be lost", "Reads stop working entirely", "Followers reject new writes", "Indexes must be rebuilt"],
      answer: 0,
      explanation: "The leader confirmed writes before followers had them, so a promoted follower may be missing them.",
    },
    {
      kind: "tf",
      id: "t-replication-q4",
      statement: "Keeping each user's reads on one follower stops them seeing newer data and then older data.",
      answer: true,
      explanation: "That's monotonic reads: one follower moves forward in order, so a user doesn't see time go backwards.",
    },
    {
      kind: "tf",
      id: "t-replication-q5",
      statement: "Last-write-wins merges concurrent edits so both changes are kept.",
      answer: false,
      explanation: "Last-write-wins keeps the write with the latest timestamp and drops the others.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-replication-p1",
      prompt: "After a failover, two nodes both accept writes as leader. What's this called?",
      options: ["Write skew", "Split brain", "A phantom", "A hot shard"],
      answer: 1,
      explanation: "Two leaders at once is split brain, and their writes can conflict or be lost.",
    },
    {
      kind: "tf",
      id: "t-replication-p2",
      statement: "With synchronous replication, the leader confirms a write only after a follower has it.",
      answer: true,
      explanation: "Waiting for the follower is what makes it synchronous, and why it's slower but safer.",
    },
    {
      kind: "mcq",
      id: "t-replication-p3",
      prompt: "Why add read replicas to a read-heavy app?",
      options: ["To speed up every write", "To spread reads across copies", "To remove the need for indexes", "To avoid any replication lag"],
      answer: 1,
      explanation: "Followers can serve reads, so read load is shared instead of all landing on the leader.",
    },
  ],
  practiceNeeds: ["t-sql-nosql"],
  sources: [
    { title: "Conflict-free Replicated Data Types (Shapiro et al., 2011)", url: "https://inria.hal.science/inria-00609399", license: "Link only" },
    { title: "Figma: How Figma's multiplayer technology works", url: "https://www.figma.com/blog/how-figmas-multiplayer-technology-works/", license: "Link only" },
    { title: "System Design Primer: Replication", url: "https://github.com/donnemartin/system-design-primer#replication", license: "CC BY 4.0" },
  ],
};

export default topic;
