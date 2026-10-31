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
    { kind: "idea", text: "**Consul** is a popular service registry with built-in health checks. Callers look services up through its API or through plain DNS." },
    { kind: "idea", text: "In Kubernetes, a **pod** is one running copy of a service. Pods are created and replaced all the time, and each new one gets a new IP address." },
    { kind: "idea", text: "A **Kubernetes Service** gives a set of pods one stable name and virtual IP. Kubernetes tracks which pods are ready and routes traffic only to them." },
    { kind: "idea", text: "Kubernetes keeps that list of ready pods in **etcd**, a key-value store that stays consistent across machines. So etcd acts as the registry behind Kubernetes discovery." },
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
      options: ["Clients can't read DNS", "Cached answers go stale", "Every lookup adds a proxy hop", "It can't return more than one address"],
      answer: 1,
      explanation: "Clients and resolvers cache answers, so a removed instance may still be called for a while.",
    },
    {
      kind: "mcq",
      id: "t-discovery-q3",
      prompt: "How does a registry stop sending callers to a crashed instance?",
      options: ["Callers retry until it recovers", "Failed health checks remove it", "DNS caches expire the address", "The load balancer restarts it"],
      answer: 1,
      explanation: "Missed checks or heartbeats mark the instance unhealthy and it drops off the list.",
    },
    {
      kind: "tf",
      id: "t-discovery-q4",
      statement: "DNS-based discovery works with almost any client, because nearly every client already understands DNS.",
      answer: true,
      explanation: "That's its main appeal. The cost is that cached answers can go stale.",
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
      options: ["A Service", "A pod", "A health check", "A Consul DNS name"],
      answer: 0,
      explanation: "A Service routes to the ready pods behind one stable name.",
    },
    {
      kind: "tf",
      id: "t-discovery-p2",
      statement: "A Kubernetes Service sends traffic only to pods that are ready.",
      answer: true,
      explanation: "Kubernetes tracks pod readiness and routes only to ready pods behind the stable name.",
    },
    {
      kind: "mcq",
      id: "t-discovery-p3",
      prompt: "What does a service registry hold?",
      options: ["Live addresses of healthy instances", "A copy of every request's response body", "Each instance's CPU usage", "DNS cache entries for clients"],
      answer: 0,
      explanation: "It's the live list callers look up to find working copies of a service.",
    },
  ],
  practiceNeeds: ["t-micro", "t-lb"],
  sources: [
    { title: "Kubernetes: Components (etcd)", url: "https://kubernetes.io/docs/concepts/overview/components/", license: "Link only" },
    { title: "Kubernetes: Service", url: "https://kubernetes.io/docs/concepts/services-networking/service/", license: "Link only" },
    { title: "HashiCorp Consul documentation", url: "https://developer.hashicorp.com/consul/docs", license: "Link only" },
    { title: "System Design Primer: Service discovery", url: "https://github.com/donnemartin/system-design-primer#service-discovery", license: "CC BY 4.0" },
  ],
};

export default topic;
