import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-proxy",
  module: "m2",
  title: "Proxies and gateways",
  visual: {
    kind: "tiles",
    tiles: [
      { icon: "🧑‍💻", title: "Forward proxy", text: "Sits with the clients and goes out to the internet for them." },
      { icon: "🛡️", title: "Reverse proxy", text: "Sits with the servers and takes requests in on their behalf." },
      { icon: "🚪", title: "API gateway", text: "A reverse proxy with API jobs: auth, limits and routing to services." },
    ],
  },
  screens: [
    { kind: "idea", text: "A **proxy** is a middleman. A request goes to the proxy, the proxy makes the real request, and it passes the answer back. The question is whose side it is on." },
    { kind: "idea", text: "A **forward proxy** works for the clients. An office might send all staff traffic through one, to filter sites or to share one outgoing address. The websites only see the proxy." },
    { kind: "idea", text: "A **reverse proxy** works for the servers. Clients think they are talking to the site, but the proxy hands each request to a server behind it. The clients only see the proxy." },
    { kind: "idea", text: "Because every request passes through it, a reverse proxy is a handy place for shared jobs: ending TLS, compressing replies, caching common pages and spreading load. A load balancer is one kind of reverse proxy." },
    { kind: "idea", text: "An **API gateway** is a reverse proxy for APIs. It checks the caller's token, applies rate limits, and routes each path to the right service, so every service doesn't repeat that work." },
    {
      kind: "example",
      title: "One front door for three services",
      steps: [
        "An app has three services: users, orders and payments. Each one checks login tokens and logs every call in its own way.",
        "Put an API gateway in front. Clients call api.example.com/orders and the gateway sends it to the orders service.",
        "The gateway checks the token once and logs every call the same way. The services now trust requests that came through it.",
        "The cost: the gateway is in every request's path, so it needs spare copies and must stay fast.",
      ],
    },
    { kind: "idea", text: "Keep business logic out of the gateway. Once it starts deciding prices or rules, every team has to change it, and the shared front door becomes a bottleneck for releases." },
  ],
  tip: "If you add a gateway, list the cross-cutting jobs it owns, like auth, limits and routing, and say that the services keep the business rules.",
  quiz: [
    {
      kind: "mcq",
      id: "t-proxy-q1",
      prompt: "A company routes all staff web browsing through one box that blocks some sites. What is it?",
      options: ["A reverse proxy", "An API gateway", "A database replica", "A forward proxy"],
      answer: 3,
      explanation: "It acts for the clients going out to the internet, which makes it a forward proxy.",
    },
    {
      kind: "mcq",
      id: "t-proxy-q2",
      prompt: "Which job fits best in an API gateway?",
      options: ["Checking each caller's token", "Working out an order's tax", "Storing the user table", "Rendering the app's screens"],
      answer: 0,
      explanation: "Token checks are shared by every service, so the gateway does them once. Tax rules belong in a service.",
    },
    {
      kind: "mcq",
      id: "t-proxy-q3",
      prompt: "Who sees only the reverse proxy and not the servers behind it?",
      options: ["The load balancer's health checks", "The database", "The clients", "The servers themselves"],
      answer: 2,
      explanation: "Clients send requests to the reverse proxy's address and never learn which server answered.",
    },
    {
      kind: "tf",
      id: "t-proxy-q4",
      statement: "A load balancer is a kind of reverse proxy.",
      answer: true,
      explanation: "It takes requests on behalf of a pool of servers and passes each one to a server behind it.",
    },
    {
      kind: "tf",
      id: "t-proxy-q5",
      statement: "Each service's business rules belong in the API gateway.",
      answer: false,
      explanation: "The gateway should own shared jobs only. Business rules in it make it a release bottleneck.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-proxy-p1",
      prompt: "Where is TLS usually ended so the app servers don't each manage certificates?",
      options: ["In the database", "At the reverse proxy", "In the client's browser", "At the forward proxy"],
      answer: 1,
      explanation: "Ending TLS at the reverse proxy keeps certificates in one place and spares every server the work.",
    },
    {
      kind: "tf",
      id: "t-proxy-p2",
      statement: "An API gateway adds a hop to every request, so it needs spare copies to avoid being a single point of failure.",
      answer: true,
      explanation: "Everything flows through it, so if it falls over the whole API is down.",
    },
  ],
  practiceNeeds: ["t-lb"],
  sources: [
    { title: "System Design Primer: Reverse proxy", url: "https://github.com/donnemartin/system-design-primer#reverse-proxy-web-server", license: "CC BY 4.0" },
    { title: "MDN: Proxy servers and tunneling", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Proxy_servers_and_tunneling", license: "Link only" },
  ],
};

export default topic;
