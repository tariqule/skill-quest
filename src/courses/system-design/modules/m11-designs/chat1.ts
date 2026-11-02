import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-design-chat-1",
  module: "m11",
  title: "Design a chat system: connections",
  level: "intermediate",
  visual: {
    kind: "flow",
    steps: [
      { icon: "📱", label: "Client", sub: "Logs in over plain HTTP" },
      { icon: "⚖️", label: "API servers", sub: "Stateless, behind a load balancer" },
      { icon: "🧭", label: "Service discovery", sub: "Picks the best chat server" },
      { icon: "🔌", label: "Chat server", sub: "Holds the client's WebSocket" },
      { icon: "🗄️", label: "Key-value store", sub: "Keeps every message" },
    ],
  },
  screens: [
    { kind: "idea", text: "The ask: \"Design a chat app.\" First pin down which kind. One-on-one or groups? How big can a group get? Mobile, web or both? How many daily users? Text only, or photos too?" },
    { kind: "idea", text: "A typical agreement: one-on-one and groups of up to 200, phone and web apps, 20 million daily users, text only up to 10,000 characters, an online dot, several devices per account, push alerts, and history kept forever." },
    {
      kind: "example",
      title: "Sizing the chat service",
      steps: [
        "20 million daily users each send about 40 messages: 800 million a day. Divide by 86,400 seconds: about 9,300 a second, so plan for a peak near 28,000.",
        "Say 10% of users are online at the busiest moment. That's 2 million open connections the servers must hold at once.",
        "If one chat server holds 50,000 connections, 2 million needs 40 servers. Run about 60, so losing a few still leaves room.",
        "At about 200 bytes per message with its ids and times, 800 million a day is 160 GB a day, near 58 TB a year before copies.",
      ],
    },
    { kind: "idea", text: "Clients never talk to each other directly. The **chat service** does three jobs: take a message in, work out who should get it and pass it on, and hold it for anyone who is offline until they return." },
    { kind: "idea", text: "Sending is easy: the client starts the request, so plain HTTP works. Receiving is the hard part, because the server must reach the client the moment a message lands. That's the real-time delivery problem you already know." },
    { kind: "idea", text: "Short polling is out: at 2 million online users, nearly every answer is empty. Long polling fails too. A round-robin balancer can land Ana's message on a server that isn't holding Bo's wait, and silent drops go unnoticed." },
    { kind: "idea", text: "So pick WebSocket, and use it for sending as well as receiving. One open two-way connection per device keeps the client and server code simpler than mixing HTTP sends with a separate push channel." },
    { kind: "idea", text: "Everything else stays plain request and response. Login, sign-up and profile edits go to **API servers**: stateless, behind a load balancer that routes by path, so any one of them can handle any request and they scale freely." },
    { kind: "idea", text: "Chat servers are the one stateful part. Each holds open connections, so a client stays on the same chat server for as long as that server is up. You scale them by count of connections, not requests." },
    { kind: "idea", text: "A first simple design puts everything on one big machine. 2 million connections at about 10 KB each is only 20 GB of memory, so it fits. But one crash cuts off every user, and every patch means an outage." },
    { kind: "idea", text: "The fix is to split by job. Login goes to the API servers; discovery then returns the address of the **best chat server**, chosen by the user's region and each server's load, and the client opens its WebSocket there." },
    { kind: "idea", text: "The high-level design: chat servers move messages, presence servers track who is online, API servers do the rest, notification servers hand alerts to Apple's and Google's push services, and storage keeps the history." },
    { kind: "idea", text: "Profiles, settings and friend lists are small, related and change rarely, so they live in a relational database with replicas and shards. Messages are different: billions a day, read mostly by the newest, and kept forever." },
    { kind: "idea", text: "So messages go in a **key-value store** split across many machines by key. Reads of the latest messages are fast, it grows by adding machines, and lookups for search, mentions or jumping to an old message hit a key directly." },
  ],
  tip: "Say out loud why the chat servers are stateful and the API servers aren't. It explains why discovery picks a chat server at login and why the two tiers scale separately.",
  quiz: [
    {
      kind: "mcq",
      id: "t-design-chat-1-q1",
      prompt: "Your chat design uses WebSocket for messages. Where should sign-up and profile edits be handled?",
      options: ["On the chat servers over each WebSocket", "Inside the presence servers' channels", "On stateless API servers over HTTP", "Straight from the app to the message store"],
      answer: 2,
      explanation: "These are ordinary request and response jobs, so stateless API servers behind a load balancer suit them. Putting them on chat servers ties them to stateful machines, presence servers only track who is online, and letting apps write to storage directly skips every check.",
    },
    {
      kind: "mcq",
      id: "t-design-chat-1-q2",
      prompt: "Message history grows by hundreds of millions of rows a day and is read mostly newest first. What does that point to?",
      options: ["One relational table on a bigger machine", "A key-value store split across machines", "Keeping all history in the chat servers", "A cache with no database behind it"],
      answer: 1,
      explanation: "Huge, ever-growing data read by key suits a key-value store that scales by adding machines. One machine runs out of room, chat servers restart and lose memory, and a cache alone can't keep history forever.",
    },
    {
      kind: "mcq",
      id: "t-design-chat-1-q3",
      prompt: "At peak, 3 million users are online and each chat server holds 50,000 connections. How many chat servers do you need before headroom?",
      options: ["6", "600", "15", "60"],
      answer: 3,
      explanation: "3,000,000 divided by 50,000 is 60. Then you add spare servers on top so a few failures don't overload the rest. 6 and 600 are off by a factor of ten, and 15 would need 200,000 connections each.",
    },
    {
      kind: "tf",
      id: "t-design-chat-1-q4",
      statement: "A chat client normally stays connected to the same chat server for as long as that server is up.",
      answer: true,
      explanation: "The server holds the client's open connection, which is what makes it stateful. The client only moves when the connection breaks or the server goes away.",
    },
    {
      kind: "tf",
      id: "t-design-chat-1-q5",
      statement: "Service discovery hands each client a chat server at random, so load spreads out without any checks.",
      answer: false,
      explanation: "Discovery picks the best server by things like the user's region and each server's current load, so no server fills up while others sit idle.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-design-chat-1-p1",
      prompt: "An app stores 500 million messages a day at about 300 bytes each. How much new storage is that per day, before copies?",
      options: ["About 15 GB", "About 1.5 TB", "About 150 GB", "About 150 TB"],
      answer: 2,
      explanation: "500 million times 300 bytes is 150 billion bytes, which is 150 GB. 15 GB and 1.5 TB are off by a factor of ten, and 150 TB by a thousand.",
    },
    {
      kind: "tf",
      id: "t-design-chat-1-p2",
      statement: "Profiles and friend lists suit a relational database, while chat history suits a key-value store.",
      answer: true,
      explanation: "Profiles are small, related and change rarely. History is enormous, keeps growing and is read by key, which is what a key-value store is built for.",
    },
  ],
  practiceNeeds: ["t-estimation"],
  sources: [
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 12 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "RFC 6455: The WebSocket Protocol", url: "https://www.rfc-editor.org/rfc/rfc6455", license: "Link only" },
    { title: "Discord engineering: How Discord stores trillions of messages", url: "https://discord.com/blog/how-discord-stores-trillions-of-messages", license: "Link only" },
  ],
};

export default topic;
