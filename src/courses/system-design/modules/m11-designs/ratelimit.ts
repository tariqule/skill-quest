import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-design-ratelimit",
  module: "m11",
  title: "Design a rate limiter",
  level: "intermediate",
  visual: {
    kind: "flow",
    steps: [
      { icon: "📱", label: "Client", sub: "Sends a request" },
      { icon: "🚦", label: "Limiter", sub: "Checks the count for this caller" },
      { icon: "🧮", label: "Shared store", sub: "Counters every server sees" },
      { icon: "🖥️", label: "API servers", sub: "Only get requests under the limit" },
    ],
  },
  screens: [
    { kind: "idea", text: "The ask: \"Design a rate limiter for a large public API.\" Start with questions. Limit by user, by IP, or by API key? Does it run on many servers? Should refused callers be told why?" },
    { kind: "idea", text: "Agree the requirements out loud: counts must be accurate, the check must add almost no delay, it must use little memory, it must work across many servers, and a failure in it must not take the API down." },
    { kind: "idea", text: "Limits checked in the client app can be faked, so the check runs on the server side. A common home is **middleware**: a layer in front of the API servers, often inside the API gateway you already run." },
    { kind: "idea", text: "You already know the token bucket and the fixed window. A **leaking bucket** is a queue that drains at a fixed rate. Output is smooth, but a burst fills the queue with old requests and new ones are turned away." },
    { kind: "idea", text: "A **sliding window log** stores the time of every request, drops times older than the window, and counts what's left. It's exact, but it uses a lot of memory, and refused requests still leave entries." },
    { kind: "idea", text: "A **sliding window counter** keeps just two counts: this minute and last minute. It weights last minute's count by how much of it still falls inside the rolling window. Cheap, smooth, and close enough." },
    {
      kind: "example",
      title: "A sliding window counter",
      steps: [
        "The limit is 100 requests per rolling minute. Last minute had 80 requests. This minute has had 30 so far, and 15 seconds of it have passed.",
        "The rolling minute still covers the last 45 seconds of last minute, which is 75% of it. So count 80 times 0.75, which is 60.",
        "The estimate is 30 plus 60, which is 90. That's under 100, so the request passes and this minute's count goes up to 31.",
      ],
    },
    { kind: "idea", text: "Counters live in a fast in-memory store, not a disk database. Each check increments a counter that has an expiry, so old windows clean themselves up." },
    { kind: "idea", text: "Limits come from **rules** kept in config: what to count by, and how many per second, minute or day. A login endpoint might allow 5 tries a minute while a read endpoint allows thousands." },
    { kind: "idea", text: "Here's the classic bug: two servers read a count of 99 at the same moment, both allow a request, and both write 100. This **race condition** lets callers past the limit." },
    { kind: "idea", text: "The fix is to make the read-and-increment one atomic step inside the store, using its atomic increment or a small script it runs as a single step. Locks also work but slow every request." },
    { kind: "idea", text: "Every limiter server must see the same counts, so they share one store rather than pinning users to servers. Across regions, local counts synced every few seconds trade exactness for speed." },
    { kind: "idea", text: "A refused caller gets HTTP 429 and a Retry-After header saying when to try again. Headers showing the limit and what's left help well-behaved clients slow down before they hit it." },
    { kind: "idea", text: "A hard limit never lets the count pass the cap. A **soft limit** allows a short overshoot, which is friendlier to real users during a brief spike." },
    { kind: "idea", text: "If the shared store goes down, you choose. To **fail open** means letting requests through unchecked so the API stays up. Failing closed refuses them, which protects the servers but blocks every user." },
    { kind: "idea", text: "Wrap up with monitoring: are valid users being refused, so a rule is too strict? Does the limiter fall over in a sale? Clients should back off with a random delay before retrying." },
  ],
  tip: "Name four things: what you count by, where the counter lives, how the increment stays atomic across servers, and what happens when the counter store is down.",
  quiz: [
    {
      kind: "mcq",
      id: "t-design-ratelimit-q1",
      prompt: "Two limiter servers read a count of 99 at the same moment and both let a request through. What is the fix?",
      options: ["Make the increment atomic in the store", "Add more API servers behind the limiter", "Raise the limit to 200 per minute", "Move the counters to a disk database"],
      answer: 0,
      explanation: "The read and the increment must happen as one step in the shared store, so the second request sees 100 and is refused.",
    },
    {
      kind: "mcq",
      id: "t-design-ratelimit-q2",
      prompt: "Which approach is exact but uses the most memory?",
      options: ["Sliding window log", "Fixed window counter", "Token bucket", "Sliding window counter"],
      answer: 0,
      explanation: "The log keeps a timestamp for every request in the window, so it's precise but its memory grows with traffic.",
    },
    {
      kind: "mcq",
      id: "t-design-ratelimit-q3",
      prompt: "The shared counter store goes down. Which choice keeps the API serving users?",
      options: ["Fail open and let requests through", "Fail closed and refuse every request", "Switch to limits in the client app", "Return 429 to every caller"],
      answer: 0,
      explanation: "Failing open keeps the service up while the limiter is blind. You accept some risk of overload until the store is back.",
    },
    {
      kind: "tf",
      id: "t-design-ratelimit-q4",
      statement: "A leaking bucket turns a burst into a steady flow, but new requests can be refused while old ones wait in the queue.",
      answer: true,
      explanation: "The queue drains at a fixed rate. Once a burst fills it, fresh requests have no room even if they matter more.",
    },
    {
      kind: "tf",
      id: "t-design-ratelimit-q5",
      statement: "Limits enforced inside the client app are enough to protect the API.",
      answer: false,
      explanation: "Anyone can change or skip client code and call the API directly, so the server side has to enforce the limit.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-design-ratelimit-p1",
      prompt: "Limit 50 per rolling minute. Last minute had 40 requests; this minute has 20 so far and is 30 seconds in. What does a sliding window counter estimate?",
      options: ["40, so it passes", "60, so it's refused", "20, so it passes", "50, so it's refused"],
      answer: 0,
      explanation: "Half of last minute is still in the window, so 40 times 0.5 is 20. Add this minute's 20 for an estimate of 40, under the limit.",
    },
    {
      kind: "tf",
      id: "t-design-ratelimit-p2",
      statement: "A login endpoint usually gets a much lower limit than a read-only endpoint.",
      answer: true,
      explanation: "Guessing passwords needs many tries, so a tight limit on login slows attackers while normal users never notice.",
    },
  ],
  sources: [
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 4 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "Cloudflare blog: How we built rate limiting capable of scaling to millions of domains", url: "https://blog.cloudflare.com/counting-things-a-lot-of-different-things/", license: "Link only" },
    { title: "MDN: Retry-After", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Retry-After", license: "Link only" },
  ],
};

export default topic;
