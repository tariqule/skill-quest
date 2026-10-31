import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-stream",
  module: "m6",
  title: "Stream processing basics",
  visual: {
    kind: "tiles",
    tiles: [
      { icon: "🧱", title: "Tumbling window", text: "Back-to-back, no overlap: 12:00 to 12:01, then 12:01 to 12:02." },
      { icon: "🪟", title: "Sliding window", text: "Overlapping: the last 5 minutes, recomputed every minute." },
      { icon: "⏰", title: "Watermark", text: "\"Events up to 12:01 have probably all arrived.\" Close the window." },
    ],
  },
  screens: [
    { kind: "idea", text: "**Stream processing** handles events one by one as they arrive, on an input that never ends. Results update within seconds instead of after a nightly batch." },
    { kind: "idea", text: "Batch asks \"what happened yesterday?\" Streaming asks \"what is happening now?\" Fraud checks, live dashboards and alerts need the second." },
    { kind: "idea", text: "An endless stream has no \"end\" to total at, so counts are grouped into time slices called **windows**." },
    { kind: "idea", text: "A **tumbling window** is fixed-size and doesn't overlap: every click falls into exactly one 1-minute bucket." },
    { kind: "idea", text: "A **sliding window** overlaps: \"clicks in the last 5 minutes\", updated every minute. One click counts in several windows." },
    { kind: "idea", text: "**Event time** is when the event happened on the device. Processing time is when your job saw it. A phone offline in a tunnel can send events minutes late." },
    { kind: "idea", text: "Windows should use event time, or a delay shifts clicks into the wrong minute. A **late event** is one that arrives after its window has been reported." },
    { kind: "idea", text: "A **watermark** is the job's estimate that all events up to some time have arrived. When it passes a window's end, the window is closed and emitted." },
    { kind: "idea", text: "Counting needs memory across events. A **stateful operator** keeps that state, like a running count per ad, and checkpoints it so a restart doesn't lose it." },
    { kind: "idea", text: "Common tools are **Kafka Streams**, a library running inside your service, and Apache Flink, a separate cluster. Both read from and write back to Kafka." },
    {
      kind: "example",
      title: "Clicks per ad per minute",
      steps: [
        "Click events flow into Kafka keyed by ad_id. Each carries the event time from the user's device.",
        "A Flink job counts clicks per ad in 1-minute tumbling windows by event time, keeping counts as state.",
        "The watermark trails the newest event time by 10 seconds. When it passes 12:01:00, the 12:00 window is emitted to billing.",
        "A click stamped 12:00:40 arrives at 12:03 from a phone that was offline. The job adds it as a correction to the 12:00 count.",
        "The job restarts after a deploy. It reloads its last checkpoint and resumes from the matching Kafka offsets, so no click is counted twice.",
      ],
    },
  ],
  tip: "When you add streaming, name the window, say event time, and say what happens to late events. Those three choices change the numbers you report.",
  quiz: [
    {
      kind: "mcq",
      id: "t-stream-q1",
      prompt: "You need \"clicks in the last 5 minutes\", refreshed every minute. Which window fits?",
      options: ["A tumbling window", "A sliding window", "A nightly batch job", "A single global count"],
      answer: 1,
      explanation: "Sliding windows overlap, so each minute reports the latest 5-minute span.",
    },
    {
      kind: "mcq",
      id: "t-stream-q2",
      prompt: "A phone offline for 3 minutes sends its clicks late. Which time should windows use?",
      options: ["Processing time", "Event time", "Broker time", "Commit time"],
      answer: 1,
      explanation: "Event time puts each click in the minute it really happened, however late it arrives.",
    },
    {
      kind: "mcq",
      id: "t-stream-q3",
      prompt: "What tells a stream job it can close the 12:00 to 12:01 window?",
      options: ["A tombstone record", "The watermark passing 12:01", "A consumer rebalance", "The window reaching its row limit"],
      answer: 1,
      explanation: "The watermark is the job's estimate that earlier events have arrived, so the window can be emitted.",
    },
    {
      kind: "tf",
      id: "t-stream-q4",
      statement: "In a tumbling window, each event belongs to exactly one window.",
      answer: true,
      explanation: "Tumbling windows are back-to-back with no overlap.",
    },
    {
      kind: "tf",
      id: "t-stream-q5",
      statement: "A running count per ad can be computed without the job keeping any state.",
      answer: false,
      explanation: "The count must be remembered between events, which is state the operator keeps and checkpoints.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-stream-p1",
      prompt: "Which job needs stream processing rather than batch?",
      options: ["Monthly revenue report", "Flagging fraud within seconds", "Yearly tax summary", "Weekly sales-rank table refresh"],
      answer: 1,
      explanation: "Second-level freshness means handling each event as it arrives.",
    },
    {
      kind: "tf",
      id: "t-stream-p2",
      statement: "A late event is one that arrives after its window was already reported.",
      answer: true,
      explanation: "The job must drop it or send a correction for that window.",
    },
    {
      kind: "mcq",
      id: "t-stream-p3",
      prompt: "How does a stream job avoid losing its counts when it restarts?",
      options: ["It recounts from last week", "It checkpoints state and offsets", "It switches from event time to processing time", "It doubles the window size"],
      answer: 1,
      explanation: "Restoring the checkpoint with matching offsets resumes the counts where they stopped.",
    },
  ],
  practiceNeeds: ["t-kafka-3"],
  sources: [
    { title: "Streaming 101: The world beyond batch (Akidau)", url: "https://www.oreilly.com/radar/the-world-beyond-batch-streaming-101/", license: "Link only" },
    { title: "Apache Flink: Timely stream processing", url: "https://nightlies.apache.org/flink/flink-docs-stable/docs/concepts/time/", license: "Link only" },
    { title: "Kafka Streams documentation", url: "https://kafka.apache.org/documentation/streams/", license: "Link only" },
  ],
};

export default topic;
