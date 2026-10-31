import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-lb",
  module: "m2",
  title: "Load balancers",
  visual: {
    kind: "flow",
    steps: [
      { icon: "📱", label: "Clients", sub: "Many users send requests" },
      { icon: "⚖️", label: "Load balancer", sub: "Picks a healthy server" },
      { icon: "🖥️", label: "Server pool", sub: "Identical, stateless servers" },
    ],
  },
  screens: [
    { kind: "idea", text: "A **load balancer** is one address that clients talk to. Behind it sits a pool of servers, and for each request it picks which server should do the work." },
    { kind: "idea", text: "It needs a rule for picking. **Round robin** takes turns: A, B, C, A. **Least connections** sends the request to whichever server is handling the fewest right now." },
    { kind: "idea", text: "Round robin is fine when every request costs about the same. When some requests are slow, least connections works better, because it notices which servers are already busy." },
    { kind: "idea", text: "A **health check** is a small request the balancer sends every few seconds. A server that fails a few checks in a row stops getting traffic until it passes again." },
    { kind: "idea", text: "A **layer 4** balancer only looks at addresses and ports, so it is fast but blind to the request. A **layer 7** balancer reads the HTTP request, so it can route by path or header." },
    {
      kind: "example",
      title: "One slow server",
      steps: [
        "Three servers share traffic by round robin. Server C's disk starts failing and each request there takes 5 seconds instead of 50 milliseconds.",
        "Round robin keeps giving C a third of the requests, so a third of users wait 5 seconds and C's queue grows.",
        "Switch to least connections: C's open connections pile up, so new requests go to A and B instead.",
        "Add a health check with a 1 second timeout and C is taken out of the pool entirely until it recovers.",
      ],
    },
    { kind: "idea", text: "The balancer itself must not become the single point of failure. Real setups run two or more balancers, with a shared address that moves to a standby if the active one dies." },
  ],
  tip: "When you draw a load balancer, name its picking rule and its health check. Saying how a dead server leaves the pool shows you've thought about failure.",
  quiz: [
    {
      kind: "mcq",
      id: "t-lb-q1",
      prompt: "Some requests take 10 ms and others take 2 seconds. Which picking rule copes best?",
      options: ["Round robin", "Least connections", "Alphabetical by server name", "Always the first server"],
      answer: 1,
      explanation: "Least connections steers new work away from servers busy with slow requests. Round robin ignores how busy each server is.",
    },
    {
      kind: "mcq",
      id: "t-lb-q2",
      prompt: "You want /api requests to go to one pool and /images to another. What kind of balancer do you need?",
      options: ["A layer 4 balancer", "A DNS record per server", "A layer 7 balancer", "A bigger database server"],
      answer: 2,
      explanation: "Only a layer 7 balancer reads the HTTP path, so only it can route by /api versus /images.",
    },
    {
      kind: "mcq",
      id: "t-lb-q3",
      prompt: "How does a load balancer find out a server has died?",
      options: ["Its health checks start failing", "The server emails the team", "Users report it on the status page", "The database stops accepting writes"],
      answer: 0,
      explanation: "The balancer probes each server on a schedule and pulls any server that fails several checks in a row.",
    },
    {
      kind: "tf",
      id: "t-lb-q4",
      statement: "Running a single load balancer in front of many servers removes every single point of failure.",
      answer: false,
      explanation: "The lone balancer is now the single point of failure. Run a standby that can take over its address.",
    },
    {
      kind: "tf",
      id: "t-lb-q5",
      statement: "Round robin sends requests to each server in turn without checking how busy it is.",
      answer: true,
      explanation: "That is why round robin suits requests of similar cost, and least connections suits mixed ones.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-lb-p1",
      prompt: "A server keeps user sessions in its own memory. What goes wrong behind a load balancer?",
      options: ["Health checks stop working", "Users may lose their session", "Round robin turns off", "The balancer runs out of ports"],
      answer: 1,
      explanation: "The next request can land on another server that has never seen the session. Keep servers stateless.",
    },
    {
      kind: "tf",
      id: "t-lb-p2",
      statement: "A layer 4 load balancer can route requests by their URL path.",
      answer: false,
      explanation: "Layer 4 sees only addresses and ports. Reading the path needs layer 7.",
    },
  ],
  practiceNeeds: ["t-scaling"],
  sources: [
    { title: "System Design Primer: Load balancer", url: "https://github.com/donnemartin/system-design-primer#load-balancer", license: "CC BY 4.0" },
    { title: "NGINX docs: HTTP load balancing", url: "https://docs.nginx.com/nginx/admin-guide/load-balancer/http-load-balancer/", license: "Link only" },
  ],
};

export default topic;
