import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-discovery",
  module: "m7",
  title: "Service discovery",
  visual: {
    kind: "flow",
    steps: [
      { icon: "🚀", label: "Server starts", sub: "Registers its address" },
      { icon: "📒", label: "Registry", sub: "Keeps the live list" },
      { icon: "💓", label: "Heartbeats", sub: "Silent servers are dropped" },
      { icon: "📞", label: "Caller", sub: "Looks up a healthy server" },
    ],
  },
  screens: [
    { kind: "idea", text: "A **service** is a program that does one job, like payments or search, running on several servers. Other programs call it over the network, so they need to know where those servers are." },
    { kind: "idea", text: "You could write the addresses into a config file. But servers come and go: autoscaling adds them, crashes remove them, and deploys replace them with new addresses. A fixed list goes stale fast." },
    { kind: "idea", text: "A **service registry** is a live phone book for services. For each name, like payments, it holds the addresses of the servers running that service right now." },
    { kind: "idea", text: "Each server registers itself when it starts, then sends a **heartbeat** every few seconds. If the heartbeats stop, the registry drops that server, so a crashed machine leaves the list on its own." },
    { kind: "idea", text: "A heartbeat proves a process is alive, not that it works. A **health check** asks a real question, like a request to /health that touches the database, and only servers that pass are handed out." },
    { kind: "idea", text: "In **client-side discovery**, the caller fetches the list from the registry, keeps a copy, and picks a server itself. It saves a hop, but every client needs that logic, in every language you use." },
    { kind: "idea", text: "In **server-side discovery**, the caller sends to one fixed address, a load balancer or router, which asks the registry and forwards the request. Clients stay simple, at the cost of an extra hop." },
    { kind: "idea", text: "**DNS-based discovery** puts a service's addresses behind a name, like search.internal. Any client can use it, but answers are cached for their time to live, so callers may keep using a dead address." },
    {
      kind: "example",
      title: "A server dies",
      steps: [
        "Search runs on servers A, B and C. Each sends a heartbeat every 5 seconds, and the registry drops any server silent for 15 seconds.",
        "Server B crashes just after its heartbeat at 12:00:00. The registry removes it at 12:00:15.",
        "Clients refresh their copy of the list every 10 seconds, so some may still call B until about 12:00:25. Retrying on another server covers that gap.",
        "Through DNS with a 60 second time to live, a cached answer could still point at B until about 12:01:15.",
      ],
    },
    { kind: "idea", text: "Registries often sit on a **coordination service** such as ZooKeeper, etcd or Consul. It keeps a small amount of data on several machines that agree on every change, so it survives one failing." },
    { kind: "idea", text: "The same tools settle other questions that need one agreed answer: leasing each ID generator a unique machine id, or picking the least busy chat server near a user when they log in." },
    { kind: "idea", text: "A **service mesh** moves discovery out of your code. A small proxy, called a sidecar, runs beside each service and carries its calls, doing the lookups, retries and encryption. Istio and Linkerd are examples." },
  ],
  tip: "When your design has several services, say how they find each other: a registry kept fresh by heartbeats and health checks, and whether the client or a load balancer does the lookup.",
  quiz: [
    {
      kind: "mcq",
      id: "t-discovery-q1",
      prompt: "Why does a hard-coded list of server addresses break in a cloud setup?",
      options: ["Servers change as they come and go", "Addresses are too long to store", "DNS refuses to resolve fixed IPs", "Load balancers block listed IPs"],
      answer: 0,
      explanation: "Autoscaling, crashes and deploys keep changing which servers exist and where. Address length isn't a problem, and DNS and load balancers don't reject known addresses.",
    },
    {
      kind: "mcq",
      id: "t-discovery-q2",
      prompt: "How does a service registry learn that one of its servers has crashed?",
      options: ["The server sends a final goodbye", "Clients vote to remove it", "Its heartbeats stop arriving", "DNS stops resolving its name"],
      answer: 2,
      explanation: "A crashed server sends nothing, so the registry notices when heartbeats stop. It can't say goodbye, clients don't vote, and DNS is a separate cache that doesn't feed the registry.",
    },
    {
      kind: "mcq",
      id: "t-discovery-q3",
      prompt: "Your callers are written in five languages and you don't want discovery code in each. Which approach fits?",
      options: ["Client-side discovery", "Server-side discovery", "A longer DNS time to live", "Hard-coded addresses"],
      answer: 1,
      explanation: "With server-side discovery a load balancer or router does the lookup, so clients just call one address. Client-side puts the logic in every client, a longer time to live makes stale answers worse, and hard-coded lists go stale.",
    },
    {
      kind: "tf",
      id: "t-discovery-q4",
      statement: "With DNS-based discovery, callers can keep reaching a dead server until their cached answer expires.",
      answer: true,
      explanation: "DNS answers are cached for their time to live, so a removed address can linger that long.",
    },
    {
      kind: "tf",
      id: "t-discovery-q5",
      statement: "A server that still sends heartbeats is sure to be answering requests correctly.",
      answer: false,
      explanation: "Heartbeats only show the process is running. A health check that does real work tells you whether it's actually serving.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-discovery-p1",
      prompt: "In a service mesh, what does the sidecar proxy next to each service do?",
      options: ["Stores each service's database rows", "Builds the app's container image", "Replaces the registry entirely", "Looks up and calls other services"],
      answer: 3,
      explanation: "The sidecar carries the service's calls, doing lookups, retries and encryption. It holds no data, doesn't build anything, and still relies on a registry for addresses.",
    },
    {
      kind: "tf",
      id: "t-discovery-p2",
      statement: "Coordination services like etcd can hand out unique machine ids as well as track which servers are live.",
      answer: true,
      explanation: "Both jobs need one agreed answer across many machines, which is what these services provide.",
    },
  ],
  sources: [
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 12 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "Chris Richardson, microservices.io: Server-side service discovery", url: "https://microservices.io/patterns/server-side-discovery.html", license: "Link only" },
    { title: "Kubernetes docs: Service", url: "https://kubernetes.io/docs/concepts/services-networking/service/", license: "Link only" },
  ],
};

export default topic;
