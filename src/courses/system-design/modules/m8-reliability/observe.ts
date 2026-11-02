import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-observe",
  module: "m8",
  title: "Observability",
  visual: {
    kind: "tiles",
    tiles: [
      { icon: "📜", title: "Logs", text: "What exactly happened to this one request?" },
      { icon: "📈", title: "Metrics", text: "How much, how often, and is it getting worse?" },
      { icon: "🧵", title: "Traces", text: "Where did the time go across services?" },
    ],
  },
  screens: [
    { kind: "idea", text: "With one server you can log in and look around. With hundreds, a question like \"why is checkout slow?\" crosses five services. **Observability** is being able to answer it from the data the system sends out." },
    { kind: "idea", text: "**Logs** are timestamped records of single events, like \"order 512 failed: card declined\". They answer what exactly happened to one request, but they're bulky to store and search." },
    { kind: "idea", text: "**Metrics** are numbers counted over time, like requests per second or memory used. They're cheap to keep for months and answer how much, how often, and whether things are getting worse." },
    { kind: "idea", text: "**Traces** follow one request through every service it touches, with the time spent in each. They answer where the time went and which service failed." },
    { kind: "idea", text: "Watch three levels: host metrics such as CPU and disk, service metrics such as each tier's errors and latency, and **business metrics** such as sign-ups and orders. A sudden drop in orders is often the first sign of a bug." },
    { kind: "idea", text: "The **four golden signals** are a good first set for any service: latency (how long requests take), traffic (how many arrive), errors (how many fail) and saturation (how close it is to full)." },
    { kind: "idea", text: "You already know averages hide pain. Graph latency as p50 and p99, not the mean. A few very slow requests barely move the average, but p99 shows them clearly." },
    { kind: "idea", text: "You also met SLIs and SLOs with availability. Monitoring is where they live: measure an SLI, such as the share of requests under 300 ms, and track it against the SLO on a graph." },
    { kind: "idea", text: "An **alert** pages a person when something needs action now. Alert on symptoms users feel, like a rising error rate, rather than causes like high CPU, which may be harmless." },
    { kind: "idea", text: "Logs left on each server vanish when the machine is replaced, and nobody can search hundreds of machines. **Centralised logging** ships every server's logs to one searchable store, such as Elasticsearch, Loki or a cloud logging service." },
    { kind: "idea", text: "To follow one request, the first service gives it a **request id**. Every service passes it on in a header and writes it in each log line. Search for that id and you see the whole journey." },
    { kind: "idea", text: "**Distributed tracing** builds on the request id. Each service records a span with start and end times, and a tool such as Jaeger joins them into one timeline. OpenTelemetry is today's common standard for sending this data." },
    { kind: "idea", text: "A **dashboard** puts a service's key graphs on one screen: the golden signals, the SLO and recent deploys. During an incident it's the first place you look." },
    { kind: "idea", text: "Running at scale also means automation. **Continuous integration** builds and tests every change. Automated deploys then roll it out to a few servers first and roll back if the error rate jumps." },
    {
      kind: "example",
      title: "Finding a slow checkout",
      steps: [
        "Of 1,000 checkouts, 980 take 50 ms and 20 take 2 seconds. That's 49,000 plus 40,000 ms, so the average is 89 ms and looks fine.",
        "Sorted by time, the 990th checkout is one of the slow ones, so p99 is 2 seconds. One user in 50 waits 40 times longer than normal.",
        "The alert on p99 fires. A trace of one slow checkout shows 1.9 seconds spent in the payment service's call to the fraud check.",
        "Central logs for that request id show the fraud check timing out. The dashboard shows it was deployed an hour ago, so you roll it back.",
      ],
    },
  ],
  tip: "In the wrap-up, name what you'd graph (the four golden signals and a business metric), what pages someone (user-facing symptoms against an SLO), and how you'd trace one request.",
  quiz: [
    {
      kind: "mcq",
      id: "t-observe-q1",
      prompt: "Checkout is slow, and you need to know which of five services the time is spent in. What answers that best?",
      options: ["A host CPU graph", "A distributed trace", "A daily revenue report", "The average latency"],
      answer: 1,
      explanation: "A trace shows the time spent in each service for one request. CPU is one machine, revenue is a business number, and an average doesn't say where the time went.",
    },
    {
      kind: "mcq",
      id: "t-observe-q2",
      prompt: "Which of these is a symptom worth paging someone for at night?",
      options: ["CPU at 85% on one host", "Disk at 60% full", "Error rate jumped to 5%", "A deploy just finished"],
      answer: 2,
      explanation: "Failing requests hurt users now. Busy CPU and a part-full disk are causes that may be harmless, and a finished deploy needs no action by itself.",
    },
    {
      kind: "mcq",
      id: "t-observe-q3",
      prompt: "Most requests take 40 ms, but 2% take 3 seconds. Which number shows the problem most clearly?",
      options: ["p99 latency", "Average latency", "Requests per second", "p50 latency"],
      answer: 0,
      explanation: "The slowest 2% include the 99th percentile, so p99 is 3 seconds. The average is only about 99 ms, p50 is 40 ms, and traffic says nothing about speed.",
    },
    {
      kind: "tf",
      id: "t-observe-q4",
      statement: "A request id passed through every service lets you find all the log lines for one request.",
      answer: true,
      explanation: "Each service writes the same id in its logs, so one search in the central store shows the whole journey.",
    },
    {
      kind: "tf",
      id: "t-observe-q5",
      statement: "Saturation, one of the four golden signals, counts how many requests fail.",
      answer: false,
      explanation: "Failures are the errors signal. Saturation is how close the service is to full, such as a nearly used-up connection pool.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-observe-p1",
      prompt: "Which of these is a business metric?",
      options: ["Memory used per host", "Disk reads per second", "Garbage collection time", "Orders per minute"],
      answer: 3,
      explanation: "Orders measure what the business cares about. Memory, disk reads and garbage collection are host and service metrics.",
    },
    {
      kind: "tf",
      id: "t-observe-p2",
      statement: "Continuous integration builds and tests every change before it can be deployed.",
      answer: true,
      explanation: "That's its job: catch broken changes automatically, before an automated deploy rolls them out.",
    },
  ],
  sources: [
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 1 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 3 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "Google SRE book: Monitoring Distributed Systems", url: "https://sre.google/sre-book/monitoring-distributed-systems/", license: "Link only" },
    { title: "OpenTelemetry: Observability primer", url: "https://opentelemetry.io/docs/concepts/observability-primer/", license: "Link only" },
  ],
};

export default topic;
