import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-latency",
  module: "m1",
  title: "Latency and throughput",
  visual: {
    kind: "ladder",
    caption: "rough speeds worth remembering",
    rungs: [
      { icon: "⚡", name: "Memory read", text: "About 100 nanoseconds" },
      { icon: "💾", name: "SSD read", text: "About 100 microseconds: a thousand times slower" },
      { icon: "🏢", name: "Round trip in one data centre", text: "About half a millisecond" },
      { icon: "🌊", name: "Round trip across an ocean", text: "About 100 milliseconds" },
    ],
  },
  screens: [
    { kind: "idea", text: "**Latency** is how long one request takes, start to finish. **Throughput** is how many requests the system finishes per second. They're different: a highway can be slow per car yet carry many cars." },
    { kind: "idea", text: "Averages hide pain. Look at **percentiles**: p50 is the time half of requests beat; **p99** is the time 99% beat. The slowest 1% are often your busiest users." },
    { kind: "idea", text: "Learn the rough speed ladder: memory about 100 ns, SSD about 100 µs, a round trip inside a data centre about 0.5 ms, across an ocean about 100 ms. Each rung is roughly a thousand times the one below." },
    { kind: "idea", text: "**Little's Law** links them: requests in flight equals arrival rate × time each one takes. It tells you how many workers or connections you need." },
    {
      kind: "example",
      title: "Sizing a worker pool with Little's Law",
      steps: [
        "Traffic: 200 requests per second. Each takes 50 ms (0.05 s).",
        "In flight at once: 200 × 0.05 is 10 requests.",
        "So you need at least 10 workers, plus headroom for spikes: say 20.",
        "If latency doubles to 100 ms, in-flight doubles to 20, and the same pool is suddenly full.",
      ],
    },
    { kind: "idea", text: "Calls in a chain add up. A page that makes five calls one after another, 40 ms each, takes 200 ms. Making them in parallel takes about as long as the slowest one." },
  ],
  tip: "Quote p99, not the average, when you talk about speed targets. It's what users actually feel.",
  quiz: [
    {
      kind: "mcq",
      id: "t-latency-q1",
      prompt: "Which is throughput?",
      options: ["How long one request takes", "Requests completed each second", "How big one response is", "How many servers are running"],
      answer: 1,
      explanation: "Throughput is a rate. Latency is the time for a single request.",
    },
    {
      kind: "mcq",
      id: "t-latency-q2",
      prompt: "Roughly how much slower is a round trip across an ocean than a memory read?",
      options: ["About 10 times slower", "About 1,000 times slower", "About a million times", "About the same speed"],
      answer: 2,
      explanation: "About 100 ms versus about 100 ns: a factor of about a million.",
    },
    {
      kind: "mcq",
      id: "t-latency-q3",
      prompt: "500 requests per second arrive, and each takes 20 ms. By Little's Law, how many are in flight at once?",
      options: ["10", "25", "100", "2,500"],
      answer: 0,
      explanation: "500 × 0.02 s is 10 requests in flight.",
    },
    {
      kind: "tf",
      id: "t-latency-q4",
      statement: "A good average latency means almost every user gets a fast response.",
      answer: false,
      explanation: "A few very slow requests barely move the average. Percentiles like p99 show the slow tail.",
    },
    {
      kind: "tf",
      id: "t-latency-q5",
      statement: "Five calls made one after another at 40 ms each take about 200 ms in total.",
      answer: true,
      explanation: "Sequential calls add up. In parallel they'd take about 40 ms.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-latency-p1",
      prompt: "What does a p99 of 300 ms mean?",
      options: ["99% of requests take under 300 ms", "The average is 300 ms", "99 requests took 300 ms", "1% of requests take under 300 ms"],
      answer: 0,
      explanation: "p99 is the time that 99% of requests beat. The slowest 1% take longer.",
    },
    {
      kind: "tf",
      id: "t-latency-p2",
      statement: "If each request suddenly takes twice as long at the same traffic, twice as many are in flight.",
      answer: true,
      explanation: "Little's Law: in flight is rate × time. Double the time, double the in-flight count.",
    },
  ],
  sources: [
    { title: "Latency numbers every programmer should know (Jeff Dean, via Colin Scott)", url: "https://colin-scott.github.io/personal_website/research/interactive_latency.html", license: "Link only" },
    { title: "Google SRE book: Service Level Objectives (on percentiles)", url: "https://sre.google/sre-book/service-level-objectives/", license: "Link only" },
  ],
};

export default topic;
