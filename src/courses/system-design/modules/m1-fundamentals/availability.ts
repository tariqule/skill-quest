import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-availability",
  module: "m1",
  title: "Availability and nines",
  visual: {
    kind: "ladder",
    caption: "downtime allowed per year",
    rungs: [
      { icon: "🙂", name: "99% (two nines)", text: "About 3.65 days" },
      { icon: "😊", name: "99.9% (three nines)", text: "About 8.8 hours" },
      { icon: "😎", name: "99.99% (four nines)", text: "About 53 minutes" },
      { icon: "🏆", name: "99.999% (five nines)", text: "About 5 minutes" },
    ],
  },
  screens: [
    { kind: "idea", text: "**Availability** is the share of time a system works for its users. It's quoted in **nines**: 99.9% is \"three nines\" and allows about 8.8 hours of downtime a year." },
    { kind: "idea", text: "Each extra nine cuts allowed downtime by ten, and usually costs a lot more: more spare machines, more automation, more careful releases." },
    { kind: "idea", text: "Teams agree targets in three words. An **SLI** is what you measure, say the share of requests that succeed. An **SLO** is the target for it, like 99.9% over 30 days." },
    { kind: "idea", text: "An **SLA** is a promise to customers, with a penalty if you miss it. Keep the SLO stricter than the SLA so you notice trouble before customers are owed anything." },
    { kind: "idea", text: "A **single point of failure** is any part whose failure takes everything down. Remove it with **redundancy**: run two or more copies, and use **failover** to switch to a healthy one automatically." },
    {
      kind: "example",
      title: "Parts in a chain multiply",
      steps: [
        "A request needs the web server (99.9%) and the database (99.9%). Both must work.",
        "Together: 0.999 × 0.999 ≈ 0.998, so about 99.8%. The chain is worse than either part.",
        "Now run two independent web servers, where either one is enough.",
        "Both down at once: 0.001 × 0.001 is 0.000001, so that layer is 99.9999%. Redundancy multiplies the failure chances instead.",
      ],
    },
    { kind: "idea", text: "The gap between 100% and your SLO is an **error budget**. While budget is left, ship features; when it's spent, slow down and fix reliability." },
  ],
  tip: "Ask for the availability target early. \"Three nines or five?\" changes how much redundancy the design needs.",
  quiz: [
    {
      kind: "mcq",
      id: "t-availability-q1",
      prompt: "About how much downtime a year does 99.9% availability allow?",
      options: ["About 5 minutes", "About 53 minutes", "About 8.8 hours", "About 3.65 days"],
      answer: 2,
      explanation: "0.1% of 8,760 hours is about 8.8 hours. Each extra nine divides that by ten.",
    },
    {
      kind: "mcq",
      id: "t-availability-q2",
      prompt: "\"99.9% of requests succeed over 30 days\" is the team's internal target. Which term is it?",
      options: ["An SLA", "An SLO", "An SLI", "An error"],
      answer: 1,
      explanation: "An SLO is the target. The SLI is the measurement, and an SLA is the customer promise with penalties.",
    },
    {
      kind: "mcq",
      id: "t-availability-q3",
      prompt: "A request needs two parts in a chain, each 99.9% available. About how available is the whole path?",
      options: ["99.99%", "99.9%", "99.95%", "99.8%"],
      answer: 3,
      explanation: "0.999 × 0.999 ≈ 0.998. Parts that must all work multiply, so the chain is worse than either part.",
    },
    {
      kind: "tf",
      id: "t-availability-q4",
      statement: "Running two copies of a part with automatic failover removes it as a single point of failure.",
      answer: true,
      explanation: "If either copy can serve, one failing no longer takes the system down.",
    },
    {
      kind: "tf",
      id: "t-availability-q5",
      statement: "Adding more parts that must all work makes a request path more available.",
      answer: false,
      explanation: "Each required part multiplies in its own chance of failing, so availability goes down.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-availability-p1",
      prompt: "Your error budget for the month is used up. What does it suggest?",
      options: ["Ship new features even faster", "Focus on reliability work", "Raise the SLO target higher", "Remove the failover setup"],
      answer: 1,
      explanation: "A spent budget means users already saw the agreed downtime, so reliability work comes first.",
    },
    {
      kind: "tf",
      id: "t-availability-p2",
      statement: "Going from three nines to four nines cuts the allowed downtime by about ten times.",
      answer: true,
      explanation: "8.8 hours a year becomes about 53 minutes.",
    },
  ],
  sources: [
    { title: "Google SRE book: Embracing Risk", url: "https://sre.google/sre-book/embracing-risk/", license: "Link only" },
    { title: "System Design Primer: Availability in numbers", url: "https://github.com/donnemartin/system-design-primer#availability-in-numbers", license: "CC BY 4.0" },
  ],
};

export default topic;
