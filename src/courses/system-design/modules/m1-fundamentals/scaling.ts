import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-scaling",
  module: "m1",
  title: "Scaling up and out",
  visual: {
    kind: "tiles",
    tiles: [
      { icon: "🏋️", title: "Vertical (scale up)", text: "Swap in a bigger machine: more CPU, memory and disk. Simple, but there's a ceiling and it's still one machine." },
      { icon: "🐝", title: "Horizontal (scale out)", text: "Add more machines and split the traffic. No ceiling, and one can fail, but the code must be stateless." },
    ],
  },
  screens: [
    { kind: "idea", text: "When one server can't keep up, you have two moves. **Vertical** scaling (scaling up) gives it a bigger machine. **Horizontal** scaling (scaling out) adds more machines." },
    { kind: "idea", text: "Scaling up is the easy first step: no code changes. But the biggest machine has a limit, costs climb steeply near the top, and it's still a single box that can fail." },
    { kind: "idea", text: "Scaling out spreads requests over many servers. A **load balancer** sits in front, picks a server for each request, and stops sending to any server that stops answering." },
    { kind: "idea", text: "Scaling out only works cleanly if servers are **stateless**: they keep no user data in their own memory between requests, so any server can handle any request." },
    {
      kind: "example",
      title: "Where did the login go?",
      steps: [
        "A user logs in on server A, which keeps their session in its own memory.",
        "The load balancer sends their next request to server B.",
        "Server B has never seen them, so it asks them to log in again.",
        "Fix: keep sessions in a shared store, or in a signed token the client sends each time. Now A and B are stateless.",
      ],
    },
    { kind: "idea", text: "Most real systems do both: scale up until it gets awkward or risky, then scale out the stateless parts and keep the hard-to-split parts (like the database) on bigger machines." },
  ],
  tip: "Whenever you add \"more servers\", say where the state went. It's the next question every interviewer asks.",
  quiz: [
    {
      kind: "mcq",
      id: "t-scaling-q1",
      prompt: "You move your app from a 4-core machine to a 32-core one. What is that?",
      options: ["Horizontal scaling", "Load balancing", "Vertical scaling", "Going stateless"],
      answer: 2,
      explanation: "A bigger machine is vertical scaling (scaling up). Adding machines would be horizontal.",
    },
    {
      kind: "mcq",
      id: "t-scaling-q2",
      prompt: "What does a load balancer do?",
      options: ["Spreads requests across servers", "Makes one server much bigger", "Stores every user's session", "Encrypts traffic to the database"],
      answer: 0,
      explanation: "It picks a healthy server for each request so many servers can share the traffic.",
    },
    {
      kind: "mcq",
      id: "t-scaling-q3",
      prompt: "Users get logged out whenever their request lands on a different server. What's the best fix?",
      options: ["Buy one much bigger server for everyone", "Make servers stateless with shared sessions", "Add more servers behind the balancer", "Turn off the load balancer entirely"],
      answer: 1,
      explanation: "Moving sessions out of server memory (shared store or signed token) lets any server handle any request.",
    },
    {
      kind: "tf",
      id: "t-scaling-q4",
      statement: "Vertical scaling has a ceiling: at some point there is no bigger machine to buy.",
      answer: true,
      explanation: "That ceiling, plus cost and the single point of failure, is why systems eventually scale out.",
    },
    {
      kind: "tf",
      id: "t-scaling-q5",
      statement: "Horizontal scaling works best when each server keeps user sessions in its own memory.",
      answer: false,
      explanation: "Sessions in local memory tie a user to one server. Stateless servers are what make scaling out easy.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-scaling-p1",
      prompt: "Which part is usually hardest to scale out, so it often gets a bigger machine first?",
      options: ["The stateless web servers", "The load balancer's config", "The database", "The client app"],
      answer: 2,
      explanation: "The database holds the state, so splitting it is hard. Stateless servers are the easy part to copy.",
    },
    {
      kind: "tf",
      id: "t-scaling-p2",
      statement: "A load balancer stops sending requests to a server that stops answering.",
      answer: true,
      explanation: "Health checks let it route around failed servers, which is part of why scaling out improves uptime.",
    },
  ],
  sources: [
    { title: "System Design Primer: Scalability", url: "https://github.com/donnemartin/system-design-primer#scalability", license: "CC BY 4.0" },
    { title: "The Twelve-Factor App: Processes", url: "https://12factor.net/processes", license: "Link only" },
  ],
};

export default topic;
