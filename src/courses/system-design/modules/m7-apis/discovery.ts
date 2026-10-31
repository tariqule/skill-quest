import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-discovery",
  module: "m7",
  title: "Service discovery",
  visual: {
    kind: "flow",
    steps: [
      { icon: "📝", label: "Register", sub: "Instance adds its address" },
      { icon: "💓", label: "Health checks", sub: "Dead instances drop out" },
      { icon: "🔎", label: "Look up", sub: "Callers get live addresses" },
    ],
  },
  screens: [
    { kind: "idea", text: "In a cluster, instances come and go and change IP addresses all day. **Service discovery** answers \"where are the healthy copies of the payments service right now?\"" },
    { kind: "idea", text: "A **service registry** is the live list. Each instance registers its address on start and is removed when it stops or fails its checks." },
    { kind: "idea", text: "The registry runs **health checks**, pinging each instance or expecting heartbeats. An instance that misses them is taken off the list, so callers stop reaching it." },
    { kind: "idea", text: "In **client-side discovery**, the caller asks the registry for addresses and picks one itself. It saves a hop but every client needs the discovery logic." },
    { kind: "idea", text: "In **server-side discovery**, the caller hits a load balancer or proxy, and that looks up the registry. Clients stay simple, at the cost of an extra hop." },
    { kind: "idea", text: "**DNS-based discovery** returns instance addresses for a name like `payments.internal`. Every client understands DNS, but caching can keep dead addresses around." },
    { kind: "idea", text: "**Consul** is a popular registry with health checks and a DNS interface. etcd is a consistent key-value store that Kubernetes uses to hold cluster state." },
    { kind: "idea", text: "A **Kubernetes Service** gives a set of pods one stable name and virtual IP. Kubernetes tracks which pods are ready and routes traffic only to them." },
    { kind: "idea", text: "ZooKeeper offers an **ephemeral node**: an entry tied to a client's session. If the client dies and its session expires, the node is deleted automatically." },
    { kind: "idea", text: "Clients could set a **watch** on a ZooKeeper path and be notified when it changed, so they learned about new or vanished instances without polling." },
    {
      kind: "example",
      title: "A payments instance dies",
      steps: [
        "Three payments instances register in Consul with a health check on /health every 10 seconds.",
        "Checkout asks Consul for payments and gets all three addresses. It spreads calls across them.",
        "Instance 2 runs out of memory. Its health check fails twice and Consul marks it critical.",
        "Checkout's next lookup returns only instances 1 and 3. A new instance starts, registers, passes its check, and joins the list.",
      ],
    },
  ],
  tip: "When you draw services calling each other, say how they find each other: a registry with health checks, or the platform's built-in service names.",
  quiz: [
    {
      kind: "mcq",
      id: "t-discovery-q1",
      prompt: "The caller asks the registry for addresses and chooses one itself. Which pattern is this?",
      options: ["Server-side discovery", "Client-side discovery", "DNS round robin", "A strangler fig"],
      answer: 1,
      explanation: "The client does the lookup and the choice, with no proxy in between.",
    },
    {
      kind: "mcq",
      id: "t-discovery-q2",
      prompt: "What's a known weakness of DNS-based discovery?",
      options: ["Clients can't read DNS", "Cached answers go stale", "It needs a WebSocket", "It only works for databases"],
      answer: 1,
      explanation: "Clients and resolvers cache answers, so a removed instance may still be called for a while.",
    },
    {
      kind: "mcq",
      id: "t-discovery-q3",
      prompt: "How does a registry stop sending callers to a crashed instance?",
      options: ["The instance emails it", "Failed health checks remove it", "Callers vote it out", "The database row is deleted by hand"],
      answer: 1,
      explanation: "Missed checks or heartbeats mark the instance unhealthy and it drops off the list.",
    },
    {
      kind: "tf",
      id: "t-discovery-q4",
      statement: "A ZooKeeper ephemeral node is deleted when the session of the client that created it ends.",
      answer: true,
      explanation: "That's why it suits live membership: a dead client's entry disappears.",
    },
    {
      kind: "tf",
      id: "t-discovery-q5",
      statement: "Server-side discovery means every client must embed the registry lookup logic.",
      answer: false,
      explanation: "That's client-side. Server-side puts the lookup in a load balancer or proxy.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-discovery-p1",
      prompt: "What gives a set of Kubernetes pods one stable name and IP?",
      options: ["A Service", "A Deployment log", "An ephemeral node", "A schema registry"],
      answer: 0,
      explanation: "A Service routes to the ready pods behind one stable name.",
    },
    {
      kind: "tf",
      id: "t-discovery-p2",
      statement: "A ZooKeeper watch notifies a client when the data at a path changes.",
      answer: true,
      explanation: "Watches let clients learn about changes without polling.",
    },
    {
      kind: "mcq",
      id: "t-discovery-p3",
      prompt: "What does a service registry hold?",
      options: ["Live addresses of healthy instances", "Every request's full response body", "User passwords", "Old schema versions"],
      answer: 0,
      explanation: "It's the live list callers look up to find working copies of a service.",
    },
  ],
  practiceNeeds: ["t-micro", "t-lb"],
  sources: [
    { title: "ZooKeeper: Wait-free coordination for Internet-scale systems (Hunt et al., 2010)", url: "https://www.usenix.org/conference/usenix-atc-10/zookeeper-wait-free-coordination-internet-scale-systems", license: "Link only" },
    { title: "Kubernetes: Service", url: "https://kubernetes.io/docs/concepts/services-networking/service/", license: "Link only" },
    { title: "HashiCorp Consul documentation", url: "https://developer.hashicorp.com/consul/docs", license: "Link only" },
    { title: "System Design Primer: Service discovery", url: "https://github.com/donnemartin/system-design-primer#service-discovery", license: "CC BY 4.0" },
  ],
};

export default topic;
