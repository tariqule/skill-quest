import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-network",
  module: "m1",
  title: "How a request travels",
  visual: {
    kind: "flow",
    steps: [
      { icon: "📖", label: "DNS", sub: "Turns a name into an IP address" },
      { icon: "🤝", label: "TCP", sub: "Opens a reliable connection" },
      { icon: "🔒", label: "TLS", sub: "Encrypts the connection" },
      { icon: "📨", label: "HTTP", sub: "Sends the request and gets the response" },
    ],
  },
  screens: [
    { kind: "idea", text: "Computers find each other by **IP address**, a number like 203.0.113.7. People type names like example.com instead." },
    { kind: "idea", text: "**DNS** is the internet's phone book. It turns a name into an IP address, and the answer is remembered for a while so the lookup isn't repeated every time." },
    { kind: "idea", text: "**TCP** opens a connection that delivers bytes in order and resends anything lost, so the app never sees gaps or shuffled data." },
    { kind: "idea", text: "A **round trip** is a message there and a reply back. Opening a TCP connection costs one, before any real data moves." },
    { kind: "idea", text: "**TLS** encrypts the connection so nobody in between can read or change it. That's the S in HTTPS, and it adds at least one more round trip to set up." },
    { kind: "idea", text: "**HTTP** is the language of the request itself: a method like GET or POST, a path like /messages, headers, and a status code such as 200 OK or 404 Not Found in the response." },
    {
      kind: "example",
      title: "Counting round trips",
      steps: [
        "Say one round trip to the server takes 50 ms.",
        "DNS lookup (not remembered yet): about 1 round trip, 50 ms.",
        "TCP setup: 1 round trip, 50 ms. TLS setup: 1 more, 50 ms.",
        "The HTTP request and response: 1 round trip, 50 ms. Total about 200 ms before the server's own work.",
        "Reusing an open connection skips the setup, so the next request costs only about 50 ms.",
      ],
    },
  ],
  tip: "When a page feels slow, count round trips before blaming the server. Reusing connections is often the cheapest win.",
  quiz: [
    {
      kind: "mcq",
      id: "t-network-q1",
      prompt: "What does DNS do?",
      options: ["Encrypts traffic between two machines", "Turns a name into an IP address", "Resends any bytes that get lost", "Splits traffic across servers"],
      answer: 1,
      explanation: "DNS maps names like example.com to IP addresses. TLS encrypts, TCP resends lost data, and a database stores accounts.",
    },
    {
      kind: "mcq",
      id: "t-network-q2",
      prompt: "Which layer adds the encryption in HTTPS?",
      options: ["DNS", "TCP", "TLS", "HTTP status codes"],
      answer: 2,
      explanation: "TLS encrypts the connection. HTTPS is HTTP sent over TLS.",
    },
    {
      kind: "mcq",
      id: "t-network-q3",
      prompt: "One round trip is 50 ms. A brand-new HTTPS request needs DNS, TCP, TLS and the HTTP exchange, one round trip each. About how long before the server's own work?",
      options: ["50 ms", "100 ms", "400 ms", "200 ms"],
      answer: 3,
      explanation: "Four round trips × 50 ms is about 200 ms. Reusing the connection would cut later requests to about 50 ms.",
    },
    {
      kind: "tf",
      id: "t-network-q4",
      statement: "TCP resends lost data and delivers bytes in order.",
      answer: true,
      explanation: "That reliability is TCP's job, which is why HTTP is usually sent over it.",
    },
    {
      kind: "tf",
      id: "t-network-q5",
      statement: "Reusing an open connection adds extra round trips to every later request.",
      answer: false,
      explanation: "It's the opposite: reuse skips the TCP and TLS setup, saving round trips.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-network-p1",
      prompt: "A response comes back with status 404. What does that tell the client?",
      options: ["Everything worked", "The server crashed while answering", "The thing asked for wasn't found", "The connection was encrypted"],
      answer: 2,
      explanation: "404 means Not Found. 200 means OK, and 5xx codes mean the server failed.",
    },
    {
      kind: "tf",
      id: "t-network-p2",
      statement: "DNS answers are remembered for a while so the same name isn't looked up on every request.",
      answer: true,
      explanation: "Remembering DNS answers saves a round trip on later requests.",
    },
  ],
  sources: [
    { title: "MDN: How the web works", url: "https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Web_standards/How_the_web_works", license: "Link only" },
    { title: "High Performance Browser Networking (Ilya Grigorik)", url: "https://hpbn.co/", license: "Link only" },
  ],
};

export default topic;
