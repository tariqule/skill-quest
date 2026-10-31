import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-micro",
  module: "m7",
  title: "Monoliths vs microservices",
  visual: {
    kind: "flow",
    steps: [
      { icon: "🏛️", label: "Monolith", sub: "One app, one deploy" },
      { icon: "🔀", label: "Router", sub: "Sends some paths to new services" },
      { icon: "🧱", label: "Services", sub: "Own their data, deploy alone" },
    ],
  },
  screens: [
    { kind: "idea", text: "A **monolith** is one application deployed as a single unit. Calls between parts are plain function calls, and one database holds everything. Most products should start here." },
    { kind: "idea", text: "A **modular monolith** keeps one deploy but splits the code into modules with clear interfaces and no reaching into each other's tables. It gets most of the tidiness cheaply." },
    { kind: "idea", text: "**Microservices** split the system into small services, each owned by one team, deployed on its own, and talking over the network." },
    { kind: "idea", text: "The main win is **independent deploys**: the search team ships ten times a day without waiting for checkout's release or risking it." },
    { kind: "idea", text: "Good service lines follow business capabilities, like orders, payments and search. A good **service boundary** keeps the data a feature needs inside one service." },
    { kind: "idea", text: "The costs are real. Every call can now fail or be slow, and a request touching 6 services pays 6 network hops. Debugging needs tracing across all of them." },
    { kind: "idea", text: "**Data ownership** means each service owns its database and others ask through its API. Shared tables quietly tie services back together." },
    { kind: "idea", text: "A **distributed monolith** is the worst of both: services that must be deployed together because they share a database or call each other in long chains." },
    { kind: "idea", text: "The **strangler fig** pattern replaces a monolith piece by piece. A router sends one path to a new service, the rest to the old app, until nothing is left in the old app." },
    { kind: "idea", text: "Once split, each service runs as several copies on many machines. Someone has to decide where each copy runs." },
    { kind: "idea", text: "A **scheduler**, such as Kubernetes, picks a machine for each copy, restarts copies that crash, and adds copies under load." },
    {
      kind: "example",
      title: "Pulling checkout out with a strangler fig",
      steps: [
        "The monolith handles everything. Checkout changes weekly, and every change needs a full app release.",
        "The team builds a checkout service with its own database, and puts a router in front of the monolith.",
        "The router sends 5% of /checkout traffic to the new service and the rest to the monolith. Errors and latency are compared.",
        "Over a month the share rises to 100%. The old checkout code is deleted from the monolith.",
        "Checkout now deploys daily on its own. The rest of the monolith is untouched and still one deploy.",
      ],
    },
  ],
  tip: "Start with a monolith and name the trigger for splitting: a team blocked on deploys or one part needing very different scale. Splitting early mostly buys network calls.",
  quiz: [
    {
      kind: "mcq",
      id: "t-micro-q1",
      prompt: "You need to replace a legacy monolith without a risky big-bang rewrite. Which approach fits?",
      options: ["A strangler fig with a router", "Rewrite it all, then switch over", "Split every table at once", "Make it a modular monolith"],
      answer: 0,
      explanation: "The strangler fig moves one path at a time behind a router, so each step is small and reversible.",
    },
    {
      kind: "mcq",
      id: "t-micro-q2",
      prompt: "One copy of the checkout service crashes at 3 a.m. What starts a new copy with no person involved?",
      options: ["The scheduler", "The load balancer's health check", "Retries from the calling service", "The strangler fig router"],
      answer: 0,
      explanation: "The scheduler restarts crashed copies. A health check only stops sending traffic to it, and retries only resend calls.",
    },
    {
      kind: "mcq",
      id: "t-micro-q3",
      prompt: "Five services share one database and must deploy together. What is this?",
      options: ["A modular monolith", "A distributed monolith", "A strangler fig rollout", "Independent deploys"],
      answer: 1,
      explanation: "They're split in name only. The shared data ties their deploys together.",
    },
    {
      kind: "tf",
      id: "t-micro-q4",
      statement: "Microservices add network calls, so each one can fail or be slow in ways a function call can't.",
      answer: true,
      explanation: "That's the main cost of splitting, and why timeouts, retries and tracing come along.",
    },
    {
      kind: "tf",
      id: "t-micro-q5",
      statement: "Microservices work best when every service reads and writes the same shared tables.",
      answer: false,
      explanation: "Each service should own its data. Shared tables tie services back together.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-micro-p1",
      prompt: "What's the main benefit teams get from microservices?",
      options: ["Fewer network calls", "Independent deploys", "One shared database for all", "No need for tracing"],
      answer: 1,
      explanation: "Each team can release its service on its own schedule.",
    },
    {
      kind: "tf",
      id: "t-micro-p2",
      statement: "A modular monolith keeps one deploy while splitting code into well-bounded modules.",
      answer: true,
      explanation: "It gets clear boundaries without network costs.",
    },
    {
      kind: "mcq",
      id: "t-micro-p3",
      prompt: "Where should service boundaries usually fall?",
      options: ["Along business capabilities", "One per database table", "One per developer", "Along programming languages"],
      answer: 0,
      explanation: "Orders, payments and search keep each feature's data inside one service.",
    },
  ],
  practiceNeeds: ["t-api"],
  sources: [
    { title: "Martin Fowler: StranglerFigApplication", url: "https://martinfowler.com/bliki/StranglerFigApplication.html", license: "Link only" },
    { title: "Building Microservices (Newman)", url: "https://samnewman.io/books/building_microservices_2nd_edition/", license: "Link only" },
    { title: "System Design Primer: Microservices", url: "https://github.com/donnemartin/system-design-primer#microservices", license: "CC BY 4.0" },
  ],
};

export default topic;
