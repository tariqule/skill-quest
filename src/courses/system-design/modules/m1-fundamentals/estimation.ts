import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-estimation",
  module: "m1",
  title: "Back-of-envelope estimates",
  visual: {
    kind: "code",
    lang: "text",
    caption: "Round hard and write the units at every step.",
    code: `users       10 M daily × 20 requests  = 200 M requests/day
average     200 M / 100,000 s          ≈ 2,000 QPS
peak        × 3                        ≈ 6,000 QPS
storage     1 M new posts/day × 1 KB   = 1 GB/day ≈ 365 GB/year`,
  },
  screens: [
    { kind: "idea", text: "Estimate before you design. A few rough numbers tell you which parts will strain: how many requests, how much data, how much bandwidth." },
    { kind: "idea", text: "**QPS** means queries (requests) per second. A day has 86,400 seconds; round it to 100,000 so you can divide in your head." },
    { kind: "idea", text: "Traffic isn't flat. Plan for a **peak** of about 2–3 times the daily average, more for events like a big sale." },
    { kind: "idea", text: "**Storage** is new items per day × size of each × how long you keep them." },
    { kind: "idea", text: "**Bandwidth** is requests per second × size of each response. It tells you how much data crosses the network." },
    {
      kind: "example",
      title: "A photo app's numbers",
      steps: [
        "10 M daily users each view 50 photos: 500 M views a day.",
        "500 M / 100,000 s ≈ 5,000 QPS on average; about 15,000 at peak.",
        "Each photo is 200 KB: 5,000 × 200 KB is 1 GB/s of bandwidth on average.",
        "1 M new photos a day × 200 KB is 200 GB a day, about 73 TB a year.",
      ],
    },
    { kind: "idea", text: "Round to one significant figure and say your assumptions out loud. Being off by 20% doesn't change the design; being off by 100 times does." },
  ],
  tip: "Write units on every line. Most estimation mistakes are a KB that quietly became an MB.",
  quiz: [
    {
      kind: "mcq",
      id: "t-estimation-q1",
      prompt: "An app gets 1 billion requests a day. Roughly what is its average QPS?",
      options: ["About 100", "About 1,000", "About 100,000", "About 10,000"],
      answer: 3,
      explanation: "1,000,000,000 / 100,000 s ≈ 10,000 requests per second.",
    },
    {
      kind: "mcq",
      id: "t-estimation-q2",
      prompt: "Average traffic is 4,000 QPS. What peak should you plan for?",
      options: ["About 10,000 QPS", "About 4,000 QPS", "About 400 QPS", "About 400,000 QPS"],
      answer: 0,
      explanation: "Plan for about 2–3 times the average at peak, so roughly 8,000–12,000 QPS.",
    },
    {
      kind: "mcq",
      id: "t-estimation-q3",
      prompt: "2 million new records a day at 500 bytes each. About how much storage per day?",
      options: ["1 MB", "100 MB", "1 GB", "1 TB"],
      answer: 2,
      explanation: "2,000,000 × 500 bytes is 1,000,000,000 bytes, about 1 GB a day.",
    },
    {
      kind: "tf",
      id: "t-estimation-q4",
      statement: "Rounding a day to 100,000 seconds is close enough for a design estimate.",
      answer: true,
      explanation: "The real figure is 86,400. The 15% gap doesn't change which design you'd pick.",
    },
    {
      kind: "tf",
      id: "t-estimation-q5",
      statement: "Planning for the daily average QPS is enough, since traffic stays flat all day.",
      answer: false,
      explanation: "Traffic has daily peaks of about 2–3 times the average, so plan for the peak.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-estimation-p1",
      prompt: "3,000 requests per second, each response 100 KB. About how much bandwidth?",
      options: ["3 MB/s", "30 MB/s", "300 MB/s", "3,000 MB/s"],
      answer: 2,
      explanation: "3,000 × 100 KB is 300,000 KB, about 300 MB/s.",
    },
    {
      kind: "tf",
      id: "t-estimation-p2",
      statement: "An estimate that's off by 20% usually leads to a completely different design.",
      answer: false,
      explanation: "Designs change at orders of magnitude, not at 20%.",
    },
  ],
  practiceNeeds: ["t-latency"],
  sources: [
    { title: "System Design Primer: Back-of-the-envelope calculations", url: "https://github.com/donnemartin/system-design-primer#appendix", license: "CC BY 4.0" },
    { title: "Google SRE book: Practical Alerting (capacity and rates)", url: "https://sre.google/sre-book/practical-alerting/", license: "Link only" },
  ],
};

export default topic;
