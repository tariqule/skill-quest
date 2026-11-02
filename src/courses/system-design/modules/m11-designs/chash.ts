import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-design-chash",
  module: "m11",
  title: "Design consistent hashing",
  level: "intermediate",
  visual: {
    kind: "tiles",
    tiles: [
      { icon: "⭕", title: "The ring", text: "Servers and keys hashed onto one circle. A key belongs to the next server clockwise." },
      { icon: "➕", title: "A server joins", text: "Only the keys between it and the server before it move." },
      { icon: "🧩", title: "Virtual nodes", text: "Each server sits at many points, so shares even out." },
    ],
  },
  screens: [
    { kind: "idea", text: "The ask: \"Spread keys over a set of cache or database servers that grows and shrinks.\" Ask how often servers change, whether each key needs copies, and whether some keys are far hotter than others." },
    { kind: "idea", text: "Start by naming the problem. With hash mod N, changing N moves almost every key, so a cache suddenly misses nearly everything. You want a scheme where a change moves only a small share." },
    { kind: "idea", text: "Then draw the ring you already know: hash servers and keys onto the same circle, and each key belongs to the first server you meet walking clockwise." },
    { kind: "idea", text: "The close-up question is \"which keys move?\" When a server joins, walk **anticlockwise** from it until you meet the previous server. Only keys in that arc change owner." },
    {
      kind: "example",
      title: "One server joins",
      steps: [
        "Picture a ring of positions 0 to 99. Servers A, B, C and D sit at 0, 25, 50 and 75. A key belongs to the next server clockwise.",
        "Server E joins at position 40. Walk anticlockwise from 40 until you meet a server: that's B, at 25.",
        "Keys at positions 26 to 40 used to belong to C. Now they belong to E. No other key moves.",
        "That's 15 of the 100 positions, so about 15% of keys move instead of most of them.",
      ],
    },
    { kind: "idea", text: "When a server leaves, the same walk works: its arc is handed to the next server clockwise, and every other key stays where it is." },
    { kind: "idea", text: "Virtual nodes even out the arcs, but they aren't free. Each point is stored in the ring map, so more points mean more **metadata** to keep and share. Pick enough points for an even spread, not thousands." },
    { kind: "idea", text: "Don't mix up virtual nodes and copies of data. A **replica** of a key is stored on the next few different physical servers clockwise, so losing one machine loses no data." },
    { kind: "idea", text: "The ring spreads keys, not traffic for one key. A single viral key still lands on one server. Split it into several keys, or put a cache in front of it." },
    { kind: "idea", text: "The hash only needs to be fast and even. Ring libraries use quick non-cryptographic hashes; security strength isn't the goal here." },
    { kind: "idea", text: "Mention the alternatives. **Hash slots** cut the key space into a fixed number of slots and assign slots to servers, so moving a slot moves a known set of keys. Rendezvous hashing is another option." },
    { kind: "idea", text: "Wrap up with where this shows up: Dynamo-style key-value stores, Cassandra, distributed caches, CDNs and load balancers all use a ring or a close relative." },
  ],
  tip: "Draw the ring, add one server, and shade the arc that moves. That one picture answers most follow-up questions.",
  quiz: [
    {
      kind: "mcq",
      id: "t-design-chash-q1",
      prompt: "On a ring, server E joins between servers B and C. Which keys move?",
      options: ["Only keys between B and E", "Every key on the ring", "All of the keys B owned", "Only the keys D owned"],
      answer: 0,
      explanation: "E takes the arc from B up to E, which C used to own. Every other key keeps its server.",
    },
    {
      kind: "mcq",
      id: "t-design-chash-q2",
      prompt: "Why give each server many virtual nodes on the ring?",
      options: ["To even out how many keys each gets", "To store several copies of each key", "To make the hash function faster", "To hide keys from other servers"],
      answer: 0,
      explanation: "Many points per server make the arcs similar in size. Copies of data are a separate idea: replicas on the next physical servers.",
    },
    {
      kind: "mcq",
      id: "t-design-chash-q3",
      prompt: "One very popular key overloads its server, even with virtual nodes. What helps?",
      options: ["Split the key or cache it in front", "Give that server more virtual nodes", "Switch back to hash mod N", "Use a cryptographic hash function"],
      answer: 0,
      explanation: "A single key always maps to one place. Splitting it into several keys or caching it spreads its traffic.",
    },
    {
      kind: "tf",
      id: "t-design-chash-q4",
      statement: "Placing keys on a ring needs a fast, even hash; a cryptographic hash isn't required.",
      answer: true,
      explanation: "The goal is an even spread at low cost. Quick non-cryptographic hashes do that well.",
    },
    {
      kind: "tf",
      id: "t-design-chash-q5",
      statement: "On a ring of 10 servers, adding one more moves about half of all keys.",
      answer: false,
      explanation: "The new server takes roughly its fair share, about 1 in 11 of the keys. Hash mod N is the scheme that moves most keys.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-design-chash-p1",
      prompt: "A ring has 20 servers. Roughly what share of keys moves when one more joins?",
      options: ["About 5%", "About 50%", "About 20%", "None of them"],
      answer: 0,
      explanation: "The new server ends up with about 1 in 21 of the keys, which is close to 5%.",
    },
    {
      kind: "tf",
      id: "t-design-chash-p2",
      statement: "Some systems split the key space into a fixed number of slots and assign slots to servers instead of using a ring.",
      answer: true,
      explanation: "Hash slots work this way. Moving one slot moves a known group of keys, which makes rebalancing easy to plan.",
    },
  ],
  sources: [
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 5 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "Karger et al.: Consistent Hashing and Random Trees (1997)", url: "https://www.cs.princeton.edu/courses/archive/fall09/cos518/papers/chash.pdf", license: "Link only" },
  ],
};

export default topic;
