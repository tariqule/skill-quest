import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-design-id",
  module: "m11",
  title: "Design a unique ID generator",
  level: "intermediate",
  visual: {
    kind: "tiles",
    tiles: [
      { icon: "🕒", title: "41 bits: time", text: "Milliseconds since a chosen start date. Comes first, so IDs sort by time." },
      { icon: "🏢", title: "10 bits: where", text: "Which data centre and which machine made the ID." },
      { icon: "🔢", title: "12 bits: sequence", text: "Counts IDs made in the same millisecond on that machine." },
    ],
  },
  screens: [
    { kind: "idea", text: "The ask: \"Design a way to give every new record a unique ID in a large distributed system.\" Ask: must IDs be numbers? How long can they be? Must they sort by time? How many per second?" },
    { kind: "idea", text: "A typical agreement: unique, numeric, fits in 64 bits, roughly ordered by creation time, and at least 10,000 new IDs per second across the system." },
    { kind: "idea", text: "Why not one database's auto-increment? Every insert in the whole system would wait on that one machine. It becomes a bottleneck and a single point of failure." },
    { kind: "idea", text: "Option one: several databases each count by steps. With 3 databases, one makes 1, 4, 7, another 2, 5, 8. It scales a little, but IDs don't line up by time, and adding a database is awkward." },
    { kind: "idea", text: "Option two: a **UUID**, 128 random-looking bits that any server can make alone with no coordination. It's simple, but it's twice the 64 bits allowed. Newer time-ordered versions sort well, yet stay 128 bits." },
    { kind: "idea", text: "Option three: a **ticket server**, one central database that hands out the next number. Easy and numeric, but it's a single point of failure. Handing each server a block of 1,000 numbers at a time eases the load." },
    { kind: "idea", text: "Option four, the usual pick: split 64 bits into fields, as in Twitter's **Snowflake**. Time comes first, then the data centre and machine, then a sequence number. Each machine makes IDs alone." },
    { kind: "idea", text: "The time field counts milliseconds since a start date you choose, close to your launch. Because time is the leftmost field, sorting IDs as numbers sorts them by when they were made." },
    { kind: "idea", text: "The **sequence number** counts IDs made by one machine within the same millisecond, then resets. If it runs out inside a millisecond, the machine waits for the next one." },
    { kind: "idea", text: "Machine ids are set when a generator starts. Handing them out by hand risks two machines with the same id, and so duplicate IDs. A coordination service can lease them out automatically." },
    { kind: "idea", text: "The close-up interviewers love is **clock skew**: machine clocks drift apart and sometimes jump backwards. If a clock goes back, the generator must wait until it passes its last timestamp, or it could repeat an ID." },
    {
      kind: "example",
      title: "What 64 bits buy you",
      steps: [
        "12 sequence bits allow 2 to the power 12, which is 4,096 IDs per millisecond on one machine. That's over 4 million per second.",
        "5 bits for the data centre and 5 for the machine allow 32 times 32, which is 1,024 machines in total.",
        "41 time bits hold about 2.2 trillion milliseconds. Divide by the milliseconds in a year and that's about 69 years from the chosen start date.",
      ],
    },
    { kind: "idea", text: "Wrap up: IDs that sort by time keep new rows close together in a database index, which makes inserts cheaper. But they're guessable, so don't rely on them to keep public links secret." },
  ],
  tip: "Lay the 64 bits out as boxes on the board and label each one. Then do the three sums: IDs per millisecond, machine count, years until the time field runs out.",
  quiz: [
    {
      kind: "mcq",
      id: "t-design-id-q1",
      prompt: "Why not use one database's auto-increment for every ID in a large system?",
      options: ["One database becomes a bottleneck", "Its numbers are too long to store", "It cannot make numeric IDs at all", "It only works for text columns"],
      answer: 0,
      explanation: "Every insert everywhere would wait on that one machine, and if it fails no new IDs can be made.",
    },
    {
      kind: "mcq",
      id: "t-design-id-q2",
      prompt: "A machine's clock jumps back by 5 milliseconds. What should a Snowflake-style generator do?",
      options: ["Wait until its clock catches up", "Keep going with the older times", "Switch to random 64-bit numbers", "Reset its sequence to zero"],
      answer: 0,
      explanation: "Making IDs with a time it has already used could repeat an ID. Waiting until the clock passes its last timestamp keeps them unique.",
    },
    {
      kind: "mcq",
      id: "t-design-id-q3",
      prompt: "How many IDs per millisecond can one machine make with 12 sequence bits?",
      options: ["4,096", "1,024", "12", "65,536"],
      answer: 0,
      explanation: "12 bits hold 2 to the power 12 different values, which is 4,096.",
    },
    {
      kind: "tf",
      id: "t-design-id-q4",
      statement: "A standard UUID is 128 bits, so it doesn't meet a 64-bit ID requirement.",
      answer: true,
      explanation: "UUIDs are twice as long as allowed, which is why a split 64-bit layout is picked instead.",
    },
    {
      kind: "tf",
      id: "t-design-id-q5",
      statement: "Snowflake-style IDs sort by creation time because the sequence number is the leftmost field.",
      answer: false,
      explanation: "The time field is leftmost. That's what makes sorting the numbers sort them by time.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-design-id-p1",
      prompt: "With 4 bits for the data centre and 6 bits for the machine, how many machines can make IDs?",
      options: ["1,024", "640", "2,048", "160"],
      answer: 0,
      explanation: "16 data centres times 64 machines each is 1,024. It's the same 10 bits, just split differently.",
    },
    {
      kind: "tf",
      id: "t-design-id-p2",
      statement: "IDs that sort by time keep new rows close together in a database index, which makes inserts cheaper.",
      answer: true,
      explanation: "New IDs land at the end of the index instead of at random spots, so fewer index pages are touched.",
    },
  ],
  sources: [
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 7 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "RFC 9562: Universally Unique IDentifiers (UUIDs)", url: "https://www.rfc-editor.org/rfc/rfc9562", license: "Link only" },
  ],
};

export default topic;
