import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-realtime",
  module: "m7",
  title: "Real-time delivery",
  visual: {
    kind: "ladder",
    caption: "From asking for news to being told",
    rungs: [
      { icon: "⏲️", name: "Short polling", text: "Ask on a timer. Simple, but most answers are nothing new." },
      { icon: "⏳", name: "Long polling", text: "Ask once, and the server holds the request until there's news." },
      { icon: "📡", name: "Server-sent events", text: "One open response the server keeps writing to. One way only." },
      { icon: "🔌", name: "WebSocket", text: "One open connection either side can send on at any time." },
    ],
  },
  screens: [
    { kind: "idea", text: "Plain HTTP is request and response: the client asks, the server answers, and that's it. The server can't start a conversation, so a new message waits on the server until the client happens to ask." },
    { kind: "idea", text: "**Short polling** asks on a timer: any news? every few seconds. It's simple and works everywhere, but most answers are no, and each message waits until the next ask to be seen." },
    {
      kind: "example",
      title: "What polling costs",
      steps: [
        "One million users have the app open, and each polls every 5 seconds. Servers answer 1,000,000 ÷ 5, or 200,000 requests a second.",
        "Each user gets about one message a minute. A minute holds 12 polls, so 11 of every 12 answers are empty: about 92% wasted work.",
        "A message also waits half the 5 second gap on average, so 2.5 seconds, before the user sees it.",
        "With one open connection per user, servers send only real messages: 1,000,000 ÷ 60, about 17,000 a second, each one the moment it arrives.",
      ],
    },
    { kind: "idea", text: "**Long polling** asks once, and the server holds the request open until there's news or about 30 seconds pass. The client then asks again at once. Messages arrive quickly and empty answers are rare." },
    { kind: "idea", text: "Long polling has costs. Every waiting client ties up a connection, and a quiet user still reconnects every 30 seconds. If the client vanishes, the server can't tell until the wait times out." },
    { kind: "idea", text: "It's awkward behind a load balancer too. A message for Ana may reach server A while Ana's held request waits on server B, so the servers must find out who's holding whose wait." },
    { kind: "idea", text: "**Server-sent events** keep one HTTP response open, and the server writes events into it as they happen. It's one-way, server to client, and browsers reconnect on their own. It suits live scores." },
    { kind: "idea", text: "A **WebSocket** is one persistent, two-way connection. Either side can send a message at any moment with only a few bytes of overhead, which is why chat, games and shared editing use it." },
    { kind: "idea", text: "A WebSocket starts as an ordinary HTTP request asking to **upgrade**. The server agrees and the same connection switches protocol. It uses ports 80 and 443 like the web, so most firewalls let it through." },
    { kind: "idea", text: "Holding connections makes those servers **stateful**: each knows which users are attached to it. Keep them apart from the stateless API servers that handle sign-up and profiles, so each kind scales on its own." },
    { kind: "idea", text: "Connections can die silently, in a tunnel or when a phone sleeps. A **heartbeat** is a tiny message sent every few seconds. If none arrives for, say, 30 seconds, the other side treats the connection as dead." },
    { kind: "idea", text: "When a connection drops, the client reconnects with **backoff**: wait 1 second, then 2, then 4, plus a little randomness. Then a restarted server isn't hit by every client in the same instant." },
    { kind: "idea", text: "A phone with the app closed holds no connection at all. The server hands the message to Apple's or Google's **push notification** service, which wakes the device, and the app then fetches the message normally." },
  ],
  tip: "Say why you chose WebSocket over polling, keep connection servers separate from stateless API servers, and mention heartbeats, reconnecting with backoff, and push for offline phones.",
  quiz: [
    {
      kind: "mcq",
      id: "t-realtime-q1",
      prompt: "Why can't a plain HTTP server send a new message to a client the moment it arrives?",
      options: ["HTTP can't carry text messages", "Only the client starts an exchange", "Port 443 blocks server traffic", "The load balancer drops early replies"],
      answer: 1,
      explanation: "In request and response, the server only answers. HTTP carries text fine, port 443 is the normal web port, and load balancers don't drop replies.",
    },
    {
      kind: "mcq",
      id: "t-realtime-q2",
      prompt: "A sports site wants to stream score updates to open browser tabs. Users never send anything back. What's the simplest fit?",
      options: ["Short polling every second", "A WebSocket per user", "Server-sent events", "Push notifications"],
      answer: 2,
      explanation: "Server-sent events are a one-way stream from server to browser, which is all this needs. Polling wastes requests, a WebSocket's two-way channel goes unused, and push notifications are for devices with the app closed.",
    },
    {
      kind: "mcq",
      id: "t-realtime-q3",
      prompt: "A phone in a tunnel drops its WebSocket without closing it. How does the server find out?",
      options: ["Heartbeats stop arriving", "The phone sends a goodbye", "The load balancer tells it", "A 404 comes back"],
      answer: 0,
      explanation: "A silent drop sends nothing, so the server notices only when heartbeats stop. The phone can't send a goodbye from a tunnel, the load balancer doesn't track it, and there's no request to get a 404.",
    },
    {
      kind: "tf",
      id: "t-realtime-q4",
      statement: "A WebSocket connection begins as an HTTP request that asks to upgrade.",
      answer: true,
      explanation: "The client sends an HTTP upgrade request, the server agrees, and the same connection becomes a WebSocket.",
    },
    {
      kind: "tf",
      id: "t-realtime-q5",
      statement: "Long polling lets the server notice right away when a client disconnects.",
      answer: false,
      explanation: "With long polling the server can't tell a vanished client from a quiet one until the held request times out.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-realtime-p1",
      prompt: "After a chat server restarts, 100,000 clients need to reconnect. Why should each wait a growing, slightly random delay?",
      options: ["So no message is ever lost", "So the server isn't flooded at once", "So heartbeats can be skipped", "So clients can switch to polling"],
      answer: 1,
      explanation: "Spreading the reconnects out stops them all landing in the same second. The delay doesn't protect messages, replace heartbeats, or change the protocol.",
    },
    {
      kind: "tf",
      id: "t-realtime-p2",
      statement: "Servers that hold WebSocket connections are stateless, so any of them can deliver a message to any user.",
      answer: false,
      explanation: "Each connection server only reaches the users attached to it, which makes it stateful. A message must go to the right one.",
    },
  ],
  practiceNeeds: ["t-scaling"],
  sources: [
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 12 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "MDN: The WebSocket API", url: "https://developer.mozilla.org/en-US/docs/Web/API/WebSockets_API", license: "Link only" },
    { title: "MDN: Server-sent events", url: "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events", license: "Link only" },
  ],
};

export default topic;
