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
    { kind: "idea", text: "The common setup is **leader-follower**. One leader takes all writes and streams each change to followers, which apply it in the same order. Reads can go to any copy." },
    { kind: "idea", text: "With **synchronous** replication, the leader waits for a follower to confirm before telling the client the write succeeded. Safer, but every write is only as fast as that follower." },
    { kind: "idea", text: "With **asynchronous** replication, the leader confirms at once and sends the change after. Writes are faster, but if the leader crashes, the newest writes can be lost." },
    { kind: "idea", text: "Asynchronous followers run a little behind. That delay is **replication lag**, usually milliseconds, sometimes seconds. A read from a lagging follower returns old data." },
    { kind: "idea", text: "**Read-your-writes** fixes lag for the writer: for a short time after a user writes, send their reads to the leader, so they always see their own change." },
    { kind: "idea", text: "**Monotonic reads** stop time going backwards: keep each user on one follower, so a later read never shows older data than an earlier one." },
    { kind: "idea", text: "When the leader dies, a follower is promoted to take its place. That's **failover**. If the follower was asynchronous, it may be missing the newest writes." },
    { kind: "idea", text: "In **split brain**, two nodes both think they're the leader and both take writes. Systems prevent it with a vote or a lease that only one node can hold at a time." },
    { kind: "idea", text: "**Multi-leader** setups accept writes in several places, such as one leader per region. Two leaders can change the same record at once, so conflicts must be resolved." },
    { kind: "idea", text: "**Last-write-wins** settles a conflict by keeping the write with the latest timestamp and dropping the rest. It's simple, but it silently loses data." },
    {
      kind: "idea",
      text: "A **CRDT** is a data type built so concurrent changes merge automatically. A counter CRDT keeps both increments instead of choosing one.",
      visual: {
        kind: "tiles",
        tiles: [
          { icon: "⏱️", title: "Last-write-wins", text: "Two regions each add 1 to 10. The later write wins: 11." },
          { icon: "🧩", title: "CRDT counter", text: "Two regions each add 1 to 10. Both merge: 12." },
        ],
      },
    },
    { kind: "idea", text: "**Leaderless** stores, like Cassandra, have no leader. The client sends each write to several replicas and reads from several too." },
    { kind: "idea", text: "A **quorum** means enough replicas answered. When the replicas a read asks overlap the ones the latest write reached, the read finds the newest value." },
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
      options: ["A lost update overwrote the post", "Replication lag on a follower", "A dirty read on the leader", "The leader rolled back the save"],
      answer: 1,
      explanation: "The follower hadn't applied the write yet, so the reload read old data.",
    },
    {
      kind: "mcq",
      id: "t-replication-q2",
      prompt: "Two regions both accept writes, and the same counter is incremented in each at once. Which approach keeps both increments?",
      options: ["Last-write-wins by timestamp", "Keeping the higher of the two values", "Reading from the nearer region", "A CRDT counter that merges them"],
      answer: 3,
      explanation: "A CRDT counter is built so concurrent increments merge. Last-write-wins would keep one and drop the other.",
    },
    {
      kind: "mcq",
      id: "t-replication-q3",
      prompt: "What's the risk of asynchronous replication if the leader crashes?",
      options: ["Recent writes may be lost", "Reads stop working entirely", "Followers reject new writes", "Writes are applied twice on followers"],
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
      options: ["Write skew", "Split brain", "A phantom", "A hot shard key"],
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
