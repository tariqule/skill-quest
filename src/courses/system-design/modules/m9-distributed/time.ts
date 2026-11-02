import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-time",
  module: "m9",
  title: "Time and ordering",
  visual: {
    kind: "ladder",
    caption: "Three ways to put events in order",
    rungs: [
      { icon: "🕰️", name: "Wall clock", text: "Each machine's own time. Easy to read, but machines disagree." },
      { icon: "🔢", name: "Lamport clock", text: "One counter per node. Orders cause before effect." },
      { icon: "🧮", name: "Vector clock", text: "One counter per replica. Spots writes that clash." },
    ],
  },
  screens: [
    { kind: "idea", text: "Every machine keeps time with a quartz crystal, and no two crystals tick at exactly the same speed. That slow divergence is **clock drift**. Left alone, a cheap clock can gain or lose around a second a day." },
    { kind: "idea", text: "**NTP**, the Network Time Protocol, keeps clocks close by asking time servers and nudging the local clock. It gets machines within a few milliseconds of each other, sometimes better, but never exactly equal." },
    { kind: "idea", text: "The gap between two machines' clocks at the same instant is **clock skew**. Even 10 milliseconds of skew is plenty to put two quick writes in the wrong order." },
    { kind: "idea", text: "Clocks can also jump. When NTP finds a clock running far ahead, it may step it back, and a paused virtual machine wakes up behind. A later event can then get an earlier timestamp." },
    { kind: "idea", text: "So timestamps from different machines can't safely order events. Inside one machine, measure durations with a monotonic clock, which only moves forward, and keep wall time for showing dates to people." },
    { kind: "idea", text: "You already know last-write-wins from replication. With skewed clocks it's worse than dropping a concurrent write: it can throw away the write that truly came last, because that machine's clock was behind." },
    {
      kind: "example",
      title: "The price that went back",
      steps: [
        "Server A's clock is 50 ms ahead of server B's. At real time 0, A writes price 20 and stamps it 50.",
        "At real time 30 ms, B writes price 25, the newer change, and stamps it 30 by its own clock.",
        "Last-write-wins compares stamps. 50 beats 30, so price 20 is kept and the newer 25 is silently lost.",
      ],
    },
    { kind: "idea", text: "A **Lamport clock** orders events without wall time. Each node keeps a counter, adds 1 for every event, and sends the counter with each message. A receiver sets its counter to the larger value plus 1." },
    { kind: "idea", text: "If one event caused another, it gets the smaller Lamport number. The reverse isn't true: a smaller number doesn't prove a cause, so Lamport clocks can't tell you two writes clashed." },
    { kind: "idea", text: "Two writes are **concurrent** when neither knew about the other: each was made from a version that didn't include the other's change. These are the writes that conflict." },
    { kind: "idea", text: "A **vector clock** keeps one counter per replica, like [A:2, B:1]. A replica adds 1 to its own entry when it handles a write, and the version carries the whole list with it." },
    { kind: "idea", text: "To compare, line up the counters, treating a missing one as 0. If every counter in X is less than or equal to Y's, Y is newer and replaces X. If each wins somewhere, they're concurrent." },
    {
      kind: "example",
      title: "Two replicas, one cart",
      steps: [
        "A cart is written through replica A, so its version is [A:1]. Two clients both read this version.",
        "Client one adds a book and writes through A again. The version becomes [A:2], which replaces [A:1].",
        "Client two adds a pen to its copy of [A:1] and writes through replica B. That version is [A:1, B:1].",
        "Compare [A:2] with [A:1, B:1]. The first wins on A, the second wins on B. Neither covers the other, so it's a conflict.",
        "The store keeps both. A client merges them into book and pen and writes through A, giving [A:3, B:1], which covers both.",
      ],
    },
    { kind: "idea", text: "The store holds clashing versions side by side as **siblings**. The next read returns all of them, and either the client merges them, like a cart union, or a rule does, such as last-write-wins or a CRDT." },
    { kind: "idea", text: "Some databases mix both ideas. A **hybrid logical clock** pairs wall time with a counter, so values stay close to real time but still move forward when clocks disagree. CockroachDB and others use one." },
    { kind: "idea", text: "Time-ordered IDs, like Snowflake IDs and UUIDv7, put a timestamp first so they sort by creation. That means they rely on clocks, and the ID generator walkthrough shows what to do when one jumps back." },
  ],
  tip: "When two regions can write the same record, say how you'll detect the clash, such as vector clocks, and who resolves it, instead of trusting timestamps to pick a winner.",
  quiz: [
    {
      kind: "mcq",
      id: "t-time-q1",
      prompt: "One version has vector clock [A:3, B:1] and another has [A:2, B:2]. What are they?",
      options: ["The first is newer and wins", "The second is newer and wins", "They're concurrent, a conflict", "They're the same version twice"],
      answer: 2,
      explanation: "The first wins on A (3 beats 2), the second wins on B (2 beats 1). Neither covers the other, so neither is newer, and they aren't the same.",
    },
    {
      kind: "mcq",
      id: "t-time-q2",
      prompt: "Server B's clock is 50 ms behind A's. B writes a key 20 ms after A writes it. With last-write-wins by timestamp, which write is kept?",
      options: ["A's write, the one made earlier", "B's write, the one made later", "Both writes, kept as siblings", "Neither, the key is cleared"],
      answer: 0,
      explanation: "B's stamp is 20 minus 50, so 30 ms earlier than A's. A's older write wins and B's is lost. Last-write-wins keeps one write, so no siblings, and it doesn't clear the key.",
    },
    {
      kind: "mcq",
      id: "t-time-q3",
      prompt: "A node's Lamport counter is 4. It receives a message carrying 9. What is its counter after handling it?",
      options: ["5", "9", "13", "10"],
      answer: 3,
      explanation: "Take the larger of 4 and 9, then add 1, giving 10. 5 ignores the message, 9 forgets the plus 1, and 13 adds the two counters.",
    },
    {
      kind: "tf",
      id: "t-time-q4",
      statement: "NTP can move a machine's clock backwards, so a later event can get an earlier timestamp.",
      answer: true,
      explanation: "When a clock runs far ahead, NTP may step it back. Events after the step get smaller timestamps than events just before it.",
    },
    {
      kind: "tf",
      id: "t-time-q5",
      statement: "If one event has a smaller Lamport number than another, the first event caused the second.",
      answer: false,
      explanation: "Cause implies a smaller number, but not the other way round. Two unrelated events still get numbers, and one is smaller by chance.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-time-p1",
      prompt: "Two cart versions are concurrent siblings. Which way of resolving them keeps every item?",
      options: ["Keep the version with the latest timestamp", "Merge both versions by taking the union", "Keep the version from the busier replica", "Drop both and ask the user to start over"],
      answer: 1,
      explanation: "A union keeps items from both. Latest timestamp and busier replica each pick one version and lose the other's items, and dropping both loses everything.",
    },
    {
      kind: "tf",
      id: "t-time-p2",
      statement: "A vector clock can show that two writes were made without knowing about each other.",
      answer: true,
      explanation: "When each version wins on a different replica's counter, neither saw the other, so they're concurrent.",
    },
  ],
  practiceNeeds: ["t-replication"],
  sources: [
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 6 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 7 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "Leslie Lamport: Time, Clocks, and the Ordering of Events in a Distributed System (1978)", url: "https://lamport.azurewebsites.net/pubs/time-clocks.pdf", license: "Link only" },
    { title: "Wikipedia: Vector clock", url: "https://en.wikipedia.org/wiki/Vector_clock", license: "CC BY-SA 4.0" },
  ],
};

export default topic;
