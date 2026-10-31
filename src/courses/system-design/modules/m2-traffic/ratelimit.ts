import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-ratelimit",
  module: "m2",
  title: "Rate limiting",
  visual: {
    kind: "ladder",
    caption: "Three common ways to count",
    rungs: [
      { icon: "🪣", name: "Token bucket", text: "Tokens drip in at a steady rate; each request spends one. Allows short bursts." },
      { icon: "🪟", name: "Fixed window", text: "Count requests per clock minute. Simple, but bursty at the edges." },
      { icon: "🎞️", name: "Sliding window", text: "Count over the last 60 seconds from now. Smoother, a bit more work." },
    ],
  },
  screens: [
    { kind: "idea", text: "**Rate limiting** caps how many requests one caller can make in a period of time. It protects your servers from floods, buggy clients and abuse, and keeps one heavy user from crowding out the rest." },
    { kind: "idea", text: "You first choose what to count by: an API key, a user id or an IP address. Then you choose a limit, like 100 requests per minute for each key." },
    { kind: "idea", text: "A request over the limit is turned away with HTTP status **429 Too Many Requests**, so the client knows it was refused for going too fast." },
    { kind: "idea", text: "The reply usually carries a **Retry-After** header saying how long to wait. Well-behaved clients back off until then." },
    { kind: "idea", text: "A **token bucket** holds up to N tokens and refills at a steady rate. Each request spends one token, and a request finding the bucket empty is refused. A full bucket allows a short burst." },
    { kind: "idea", text: "A **fixed window** counts per clock minute and resets at the top of each minute. It's simple, but a caller can send a full minute's quota just before and just after the reset." },
    {
      kind: "example",
      title: "A token bucket in action",
      steps: [
        "The bucket holds 10 tokens and refills 1 token per second. It starts full.",
        "A client sends 10 requests in one second. All 10 pass and the bucket is empty.",
        "An 11th request arrives straight away. No token is left, so it gets a 429.",
        "Five seconds later 5 tokens have dripped back in, so the next 5 requests pass. Over time the client averages 1 request per second.",
      ],
    },
    { kind: "idea", text: "With many servers, each one counting alone lets a caller get N times the limit. Keep the counts in a shared fast store, such as Redis, so every server sees the same total." },
  ],
  tip: "Say what you limit by, the numbers, where the counter lives across servers, and what the client sees when it's refused: a 429 with Retry-After.",
  quiz: [
    {
      kind: "mcq",
      id: "t-ratelimit-q1",
      prompt: "What HTTP status should a rate limiter return when a caller is over its limit?",
      options: ["200 OK", "404 Not Found", "500 Internal Server Error", "429 Too Many Requests"],
      answer: 3,
      explanation: "429 tells the client it sent too many requests, and Retry-After says when to try again.",
    },
    {
      kind: "mcq",
      id: "t-ratelimit-q2",
      prompt: "Which approach allows a short burst but holds a steady average rate?",
      options: ["A fixed window", "A token bucket", "A sliding window log", "Least connections"],
      answer: 1,
      explanation: "A full bucket lets a burst through, then the refill rate sets the long-run average.",
    },
    {
      kind: "mcq",
      id: "t-ratelimit-q3",
      prompt: "Five servers each keep their own count with a limit of 100 per minute. What can one caller actually get?",
      options: ["About 20 per minute", "Exactly 100 per minute", "Up to 500 per minute", "About 5 per minute"],
      answer: 2,
      explanation: "Each server allows 100 on its own. A shared counter fixes that.",
    },
    {
      kind: "tf",
      id: "t-ratelimit-q4",
      statement: "A fixed window can let a caller send close to twice the limit around the moment the window resets.",
      answer: true,
      explanation: "A full quota just before the reset and another just after land within a few seconds of each other.",
    },
    {
      kind: "tf",
      id: "t-ratelimit-q5",
      statement: "Your own buggy clients can't overload a service the way attackers can.",
      answer: false,
      explanation: "A retry loop in your own app can flood you just as well. Limits protect everyone sharing the servers.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-ratelimit-p1",
      prompt: "A bucket holds 20 tokens and refills 2 per second. It's empty. How many requests can pass 5 seconds later?",
      options: ["10", "2", "20", "5"],
      answer: 0,
      explanation: "2 tokens per second for 5 seconds is 10 tokens, so 10 requests can pass.",
    },
    {
      kind: "tf",
      id: "t-ratelimit-p2",
      statement: "Rate limiting is often done at the API gateway, before requests reach the services.",
      answer: true,
      explanation: "The gateway sees every request already, so it is a natural place to count and refuse.",
    },
  ],
  practiceNeeds: ["t-proxy"],
  sources: [
    { title: "Stripe engineering: Scaling your API with rate limiters", url: "https://stripe.com/blog/rate-limiters", license: "Link only" },
    { title: "MDN: 429 Too Many Requests", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Status/429", license: "Link only" },
  ],
};

export default topic;
