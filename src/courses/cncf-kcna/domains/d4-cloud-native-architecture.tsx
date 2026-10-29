import { Flow, Layers, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { ScaleLab } from "../labs";

/**
 * Domain 4: Cloud Native Architecture (12% of the KCNA exam).
 * The official curriculum lists three topics (observability, cloud native ecosystem and principles,
 * cloud native community and collaboration); the `covers` lines are this course's breakdown.
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d4",
    number: 4,
    name: "Cloud Native Architecture",
    world: "The Observatory Isles",
    weight: 12,
    emoji: "🔭",
    color: "#a855f7",
    summary: "Metrics, logs, and traces with Prometheus and OpenTelemetry, cloud native principles, autoscaling, serverless, open standards, and how the CNCF and Kubernetes communities work.",
  },

  tasks: [
    {
      id: "4.1",
      title: "Observability",
      covers: [
        "Explain metrics, logs, and traces and what each answers",
        "Collect and query metrics with Prometheus; alert with Alertmanager",
        "Instrument apps with OpenTelemetry; ship logs with Fluentd or Fluent Bit; define SLIs and SLOs",
      ],
    },
    {
      id: "4.2",
      title: "Cloud native ecosystem and principles",
      covers: [
        "Describe cloud native principles: microservices, containers, immutable infrastructure, declarative APIs, resilience",
        "Scale workloads and clusters: Horizontal and Vertical Pod Autoscalers, Cluster Autoscaler, event-driven autoscaling",
        "Explain serverless on Kubernetes and the open standards (OCI, CRI, CNI, CSI) that prevent lock-in",
      ],
    },
    {
      id: "4.3",
      title: "Cloud native community and collaboration",
      covers: [
        "Describe the CNCF, its Technical Oversight Committee, and project maturity levels",
        "Explain how Kubernetes is governed and developed: SIGs, KEPs, releases, feature stages",
        "Recognize cloud native roles and personas",
      ],
    },
  ],

  lessons: [
    {
      id: "d4-observability",
      task: "4.1",
      title: "Observability: metrics, logs, and traces",
      check: ["d4-01", "d4-02"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "📊", title: "Metrics", text: "Numbers over time: request rate, error rate, latency, CPU. Cheap to store; great for dashboards and alerts.", color: "#a855f7" },
              { icon: "📜", title: "Logs", text: "Timestamped event records. Containers write to stdout/stderr; a node agent (DaemonSet) ships them.", color: "#a855f7" },
              { icon: "🧵", title: "Traces", text: "One request's path across services as spans, showing where time is spent. Jaeger stores and shows them.", color: "#a855f7" },
            ]}
          />
          <Flow
            color="#a855f7"
            steps={[
              { icon: "🧑‍💻", label: "Instrument", sub: "OpenTelemetry APIs and SDKs" },
              { icon: "📮", label: "OTel Collector", sub: "Receive, process, export (OTLP)" },
              { icon: "🗄️", label: "Backends", sub: "Prometheus, Jaeger, log stores" },
              { icon: "📈", label: "Dashboards + alerts", sub: "e.g. Grafana, Alertmanager" },
            ]}
          />
        </div>
      ),
      points: [
        "Monitoring tells you something is wrong; observability lets you ask why from the system's outputs.",
        "OpenTelemetry is the CNCF's vendor-neutral standard for generating and exporting traces, metrics, and logs.",
        "Fluentd and its lightweight sibling Fluent Bit collect, filter, and forward logs, usually as a DaemonSet.",
        "An SLI measures service level (for example the share of requests under 300 ms); an SLO is the target for it; an SLA is the contract with consequences.",
      ],
      tip: "\"Which service in the chain made this request slow?\" → distributed tracing.",
    },
    {
      id: "d4-prometheus",
      task: "4.1",
      title: "Prometheus and alerting",
      check: ["d4-11", "d4-12"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#f97316"
            steps={[
              { icon: "🎯", label: "Targets", sub: "Apps and exporters expose /metrics" },
              { icon: "🔥", label: "Prometheus", sub: "Discovers and scrapes (pulls), stores time series" },
              { icon: "🧮", label: "PromQL", sub: "rate(http_requests_total[5m])" },
              { icon: "🚨", label: "Alertmanager", sub: "Group, dedupe, route, silence" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "➕", title: "Counter", text: "Only goes up (or resets): requests served. Use rate().", color: "#38bdf8" },
              { icon: "🌡️", title: "Gauge", text: "Goes up and down: memory in use, queue length.", color: "#38bdf8" },
              { icon: "📶", title: "Histogram", text: "Observations in buckets: request durations, for percentiles.", color: "#38bdf8" },
              { icon: "🧾", title: "Summary", text: "Client-side quantiles plus count and sum.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Prometheus pulls metrics over HTTP on a schedule and discovers Kubernetes targets automatically.",
        "Short-lived batch jobs that end before a scrape can push to the Pushgateway, which Prometheus then scrapes.",
        "Exporters (such as node_exporter) translate system or third-party metrics into the Prometheus format.",
        "metrics-server is different: it feeds the resource metrics API for kubectl top and the HPA; it isn't a monitoring system.",
      ],
      tip: "Prometheus = pull. Pushgateway = the exception for short-lived jobs.",
    },
    {
      id: "d4-principles",
      task: "4.2",
      title: "Cloud native principles and architecture",
      check: ["d4-21", "d4-22"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={2}
            tiles={[
              { icon: "🧱", title: "Monolith", text: "One deployable unit: simple to start, but every change redeploys everything and it scales as one piece.", color: "#64748b" },
              { icon: "🧩", title: "Microservices", text: "Small, independently deployable services with their own data, owned by small teams, scaled separately.", color: "#a855f7" },
            ]}
          />
          <Layers
            layers={[
              { name: "Cloud native traits", color: "#a855f7", items: ["Containers", "Microservices", "Declarative APIs", "Immutable infrastructure", "Service meshes", "Automation"] },
              { name: "Design for failure", color: "#34d399", items: ["Health checks", "Retries + timeouts", "Horizontal scaling", "Loose coupling", "Graceful shutdown"] },
            ]}
          />
        </div>
      ),
      points: [
        "Cloud native means building and running scalable apps in dynamic environments, using containers, microservices, immutable infrastructure, and declarative APIs, with heavy automation.",
        "Immutable infrastructure: don't patch running servers or containers; replace them with a new version built from source.",
        "Treat instances as cattle, not pets: any one can be replaced at any time, so keep state in external stores and volumes.",
        "Microservices trade deployment independence for network complexity: you need service discovery, observability, and resilience patterns.",
      ],
      tip: "\"Fix a running container by exec-ing in and editing files\" is never the cloud native answer. Rebuild and redeploy.",
    },
    {
      id: "d4-autoscaling",
      task: "4.2",
      title: "Autoscaling Pods and clusters",
      check: ["d4-31", "d4-32"],
      visual: (
        <div className="grid gap-4">
          <ScaleLab />
          <Tiles
            cols={4}
            tiles={[
              { icon: "↔️", title: "HPA", text: "More or fewer Pods based on CPU, memory, or custom metrics.", color: "#a855f7" },
              { icon: "↕️", title: "VPA", text: "Adjusts Pods' CPU and memory requests to match real usage.", color: "#a855f7" },
              { icon: "🖥️", title: "Cluster Autoscaler", text: "Adds nodes when Pods are Pending for lack of capacity; removes idle nodes.", color: "#a855f7" },
              { icon: "⚡", title: "KEDA", text: "Event-driven scaling from queues, streams, and more, including to zero.", color: "#a855f7" },
            ]}
          />
        </div>
      ),
      points: [
        "The HPA computes desired replicas = ⌈current replicas × current metric ÷ target⌉, between minReplicas and maxReplicas.",
        "CPU utilization is measured against the Pod's request, so the HPA needs requests set and the metrics-server installed.",
        "Pod autoscaling and node autoscaling work together: the HPA adds Pods, and if they're Pending, the Cluster Autoscaler adds nodes.",
        "Keep minReplicas at 2 or more for anything that must survive a node failure.",
      ],
      tip: "Horizontal = more Pods. Vertical = bigger Pods. Cluster = more nodes.",
    },
    {
      id: "d4-serverless",
      task: "4.2",
      title: "Serverless and open standards",
      check: ["d4-41", "d4-42"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={2}
            tiles={[
              { icon: "☁️", title: "Serverless", text: "Developers ship functions or containers; the platform handles servers, scaling (including to zero), and often billing per use.", color: "#38bdf8" },
              { icon: "🌊", title: "Knative", text: "Serverless on Kubernetes: Serving (revisions, traffic splitting, scale to zero) and Eventing (event routing, CloudEvents).", color: "#38bdf8" },
            ]}
          />
          <Layers
            layers={[
              { name: "OCI", color: "#f97316", items: ["Image format", "Runtime spec", "Distribution (registries)"] },
              { name: "CRI", color: "#326ce5", items: ["kubelet ↔ container runtime"] },
              { name: "CNI", color: "#14b8a6", items: ["Pod networking plugins"] },
              { name: "CSI", color: "#a855f7", items: ["Storage drivers"] },
            ]}
          />
        </div>
      ),
      points: [
        "Serverless doesn't mean no servers: someone else manages them, and you pay for and think about usage, not machines.",
        "Scale to zero saves cost for idle workloads but adds a cold start on the first request.",
        "CloudEvents is a CNCF specification for describing event data in a common way across services and platforms.",
        "Open standards and interfaces (OCI, CRI, CNI, CSI) let you swap runtimes, networks, and storage without changing Kubernetes, which prevents vendor lock-in.",
      ],
      tip: "Interface quiz: runtime → CRI, network → CNI, storage → CSI, image format → OCI.",
    },
    {
      id: "d4-community",
      task: "4.3",
      title: "The CNCF and the Kubernetes community",
      check: ["d4-51", "d4-52"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#a855f7"
            steps={[
              { icon: "🌱", label: "Sandbox", sub: "Early-stage, experimental projects" },
              { icon: "🌿", label: "Incubating", sub: "Growing adoption and contributors" },
              { icon: "🌳", label: "Graduated", sub: "Stable, widely adopted, mature governance" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🏛️", title: "CNCF", text: "Part of the Linux Foundation. Vendor-neutral home for Kubernetes, Prometheus, Envoy, and many more. Its Technical Oversight Committee (TOC) accepts and promotes projects.", color: "#38bdf8" },
              { icon: "👥", title: "SIGs", text: "Kubernetes Special Interest Groups own areas such as Network, Storage, Node, and Release. Anyone can join their meetings.", color: "#38bdf8" },
              { icon: "📄", title: "KEPs", text: "Kubernetes Enhancement Proposals describe and track significant changes; features move from alpha to beta to stable (GA).", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Kubernetes was created at Google, open sourced in 2014, and donated as the CNCF's first project; it graduated in 2018.",
        "Graduated CNCF projects include Kubernetes, Prometheus, Envoy, CoreDNS, containerd, etcd, Helm, Argo, and Flux.",
        "Alpha features are off by default and may change or disappear; stable (GA) features are supported long term.",
        "Common personas: DevOps engineers, site reliability engineers (SLOs, error budgets), platform engineers (internal developer platforms), cloud architects, and security engineers.",
      ],
      tip: "Maturity order: Sandbox → Incubating → Graduated.",
    },
  ],

  questions: [
    // ── Observability ──
    {
      id: "d4-01",
      domain: "d4",
      lesson: "d4-observability",
      prompt: "Users report that checkout is slow. The request passes through six microservices. Which signal best shows where the time is spent?",
      options: ["A distributed trace of the request", "Node CPU metrics", "The cluster's event log", "kubectl get pods output"],
      answer: [0],
      explanation: "A trace records one request's journey as spans across services, making the slow hop obvious.",
    },
    {
      id: "d4-02",
      domain: "d4",
      lesson: "d4-observability",
      prompt: "Which CNCF project provides vendor-neutral APIs, SDKs, and a collector for generating and exporting traces, metrics, and logs?",
      options: ["OpenTelemetry", "Helm", "etcd", "Kustomize"],
      answer: [0],
      explanation: "OpenTelemetry standardizes instrumentation and telemetry export (OTLP), so you can switch backends without re-instrumenting.",
    },
    {
      id: "d4-04",
      domain: "d4",
      lesson: "d4-observability",
      type: "match",
      prompt: "Match each term to its meaning.",
      pairs: [
        ["SLI", "A measured indicator, such as the share of requests under 300 ms"],
        ["SLO", "The target for an indicator, such as 99.9% per month"],
        ["SLA", "A contract with consequences if the target is missed"],
        ["Error budget", "How much unreliability the target still allows"],
      ],
      explanation: "SREs measure SLIs, set SLOs, sign SLAs with customers, and spend the error budget on releases and experiments.",
    },

    // ── Prometheus ──
    {
      id: "d4-11",
      domain: "d4",
      lesson: "d4-prometheus",
      prompt: "How does Prometheus usually collect metrics from applications?",
      options: ["It scrapes (pulls) an HTTP metrics endpoint on each target at regular intervals", "Applications push every metric to etcd", "It reads container log files", "The kubelet emails metrics to it"],
      answer: [0],
      explanation: "Prometheus uses a pull model with service discovery. The Pushgateway exists for short-lived jobs that can't be scraped.",
    },
    {
      id: "d4-12",
      domain: "d4",
      lesson: "d4-prometheus",
      prompt: "Which component receives alerts from Prometheus and groups, deduplicates, silences, and routes them to receivers such as email or chat?",
      options: ["Alertmanager", "Pushgateway", "node_exporter", "kube-state-metrics"],
      answer: [0],
      explanation: "Prometheus evaluates alerting rules; Alertmanager handles notification: grouping, inhibition, silences, and routing.",
    },
    {
      id: "d4-13",
      domain: "d4",
      lesson: "d4-prometheus",
      prompt: "`http_requests_total` only ever increases. Which Prometheus metric type is it, and how do you get requests per second?",
      options: ["A counter; use rate() over a time range", "A gauge; read it directly", "A histogram; use buckets", "A summary; use quantiles"],
      answer: [0],
      explanation: "Counters only go up (or reset on restart). rate(http_requests_total[5m]) gives the per-second average over 5 minutes.",
    },
    {
      id: "d4-14",
      domain: "d4",
      lesson: "d4-prometheus",
      prompt: "Which statements about Prometheus are correct? (Choose two.)",
      options: [
        "It stores data as time series identified by a metric name and labels",
        "It is queried with PromQL",
        "It is the component kubectl top reads from by default",
        "It requires every app to push metrics",
        "It stores cluster state for the API server",
      ],
      answer: [0, 1],
      explanation: "Prometheus is a time series database with labels and the PromQL query language. kubectl top uses the metrics-server, and cluster state lives in etcd.",
    },

    // ── Principles ──
    {
      id: "d4-21",
      domain: "d4",
      lesson: "d4-principles",
      prompt: "A team needs to change a library in a running production container. What is the cloud native approach?",
      options: [
        "Build a new image with the change and roll it out, replacing the old containers",
        "kubectl exec into each container and install the library",
        "SSH into the node and edit the container's filesystem",
        "Pause the container and patch its memory",
      ],
      answer: [0],
      explanation: "Immutable infrastructure: never modify running instances; replace them with a new, versioned build.",
    },
    {
      id: "d4-22",
      domain: "d4",
      lesson: "d4-principles",
      prompt: "Which are benefits of a microservices architecture compared with a monolith? (Choose two.)",
      options: [
        "Services can be deployed independently",
        "Each service can be scaled on its own",
        "Fewer network calls between components",
        "No need for monitoring",
        "A single shared database schema for everything",
      ],
      answer: [0, 1],
      explanation: "Independent deployment and scaling are the main wins. The cost is more network communication, which needs discovery, observability, and resilience.",
    },

    // ── Autoscaling ──
    {
      id: "d4-31",
      domain: "d4",
      lesson: "d4-autoscaling",
      prompt: "An HPA targets 50% average CPU utilization. The Deployment runs 4 Pods at an average of 100% of their CPU requests. How many replicas will the HPA ask for (assuming maxReplicas allows it)?",
      options: ["8", "4", "6", "2"],
      answer: [0],
      explanation: "desired = ⌈4 × 100 ÷ 50⌉ = 8. The HPA scales so the average lands back at the target.",
    },
    {
      id: "d4-32",
      domain: "d4",
      lesson: "d4-autoscaling",
      prompt: "The HPA added replicas, but the new Pods are Pending because no node has room. What adds nodes automatically?",
      options: ["Cluster Autoscaler", "Vertical Pod Autoscaler", "kube-proxy", "The Deployment controller"],
      answer: [0],
      explanation: "The Cluster Autoscaler watches for Pods that can't be scheduled for lack of resources and adds nodes; it also removes underused nodes.",
    },
    {
      id: "d4-33",
      domain: "d4",
      lesson: "d4-autoscaling",
      prompt: "A worker Deployment should scale based on the length of a message queue, and down to zero Pods when the queue is empty. Which project is designed for this?",
      options: ["KEDA", "CoreDNS", "Vertical Pod Autoscaler", "kubeadm"],
      answer: [0],
      explanation: "KEDA (Kubernetes Event-driven Autoscaling) scales workloads from event sources such as queues and streams, including to and from zero.",
    },
    {
      id: "d4-34",
      domain: "d4",
      lesson: "d4-autoscaling",
      type: "match",
      prompt: "Match each autoscaler to what it changes.",
      pairs: [
        ["Horizontal Pod Autoscaler", "Number of Pod replicas"],
        ["Vertical Pod Autoscaler", "CPU and memory requests of Pods"],
        ["Cluster Autoscaler", "Number of nodes"],
      ],
      explanation: "Horizontal = more Pods, vertical = bigger Pods, cluster = more machines.",
    },

    // ── Serverless and standards ──
    {
      id: "d4-41",
      domain: "d4",
      lesson: "d4-serverless",
      prompt: "Which feature is characteristic of serverless platforms such as Knative Serving?",
      options: ["Scaling to zero when there is no traffic, and back up on demand", "Pinning each function to a dedicated physical server", "Requiring developers to manage node upgrades", "Running only stateful databases"],
      answer: [0],
      explanation: "Serverless platforms scale with requests, including to zero, so idle workloads cost nothing. The trade-off is cold-start latency.",
    },
    {
      id: "d4-42",
      domain: "d4",
      lesson: "d4-serverless",
      prompt: "Why do open interfaces such as CRI, CNI, and CSI matter to Kubernetes users?",
      options: [
        "They let you swap runtimes, network plugins, and storage drivers from different vendors without changing Kubernetes",
        "They make Kubernetes run only on one cloud",
        "They replace the API server",
        "They are required to write Helm charts",
      ],
      answer: [0],
      explanation: "Standard interfaces decouple Kubernetes from implementations, which supports choice and avoids vendor lock-in.",
    },
    {
      id: "d4-43",
      domain: "d4",
      lesson: "d4-serverless",
      type: "order",
      prompt: "Order the layers from the kubelet down to the running container process.",
      items: ["kubelet", "CRI runtime such as containerd", "OCI runtime such as runc", "Container process in Linux namespaces and cgroups"],
      explanation: "The kubelet calls a CRI runtime, which hands OCI bundles to a low-level runtime that creates the isolated process.",
    },

    // ── Community ──
    {
      id: "d4-51",
      domain: "d4",
      lesson: "d4-community",
      prompt: "What is the correct order of CNCF project maturity levels, from earliest to most mature?",
      options: ["Sandbox, Incubating, Graduated", "Incubating, Sandbox, Graduated", "Alpha, Beta, Stable", "Graduated, Incubating, Sandbox"],
      answer: [0],
      explanation: "Projects enter the Sandbox, move to Incubating as adoption grows, and Graduate when they meet the TOC's maturity criteria. Alpha, beta, and stable are Kubernetes feature stages.",
    },
    {
      id: "d4-52",
      domain: "d4",
      lesson: "d4-community",
      prompt: "A contributor wants to propose a significant new feature for Kubernetes. What is the usual process?",
      options: [
        "Write a Kubernetes Enhancement Proposal (KEP) and work with the owning SIG",
        "Email the CNCF marketing team",
        "Open a pull request against the release branch only",
        "Ask a cloud provider to ship it",
      ],
      answer: [0],
      explanation: "KEPs document motivation, design, and graduation criteria, and the relevant Special Interest Group reviews and sponsors the work.",
    },
    {
      id: "d4-53",
      domain: "d4",
      lesson: "d4-community",
      prompt: "Which of these are graduated CNCF projects? (Choose two.)",
      options: ["Prometheus", "Envoy", "Terraform", "Jenkins", "Ansible"],
      answer: [0, 1],
      explanation: "Prometheus and Envoy are CNCF graduated projects. Terraform, Jenkins, and Ansible are not CNCF projects.",
    },
    {
      id: "d4-54",
      domain: "d4",
      lesson: "d4-community",
      prompt: "An engineer builds an internal developer platform with self-service templates, golden paths, and paved-road tooling for app teams. Which role does this describe best?",
      options: ["Platform engineer", "Database administrator", "Technical writer", "Network cable installer"],
      answer: [0],
      explanation: "Platform engineering builds shared, self-service platforms so app teams can ship without managing infrastructure details.",
    },
  ],

  cards: [
    { id: "k-prometheus", domain: "d4", kind: "service", term: "Prometheus", definition: "Pull-based metrics collection and time series database with PromQL" },
    { id: "k-alertmanager", domain: "d4", kind: "service", term: "Alertmanager", definition: "Groups, deduplicates, silences, and routes Prometheus alerts" },
    { id: "k-otel", domain: "d4", kind: "service", term: "OpenTelemetry", definition: "Vendor-neutral APIs, SDKs, and collector for traces, metrics, logs" },
    { id: "k-jaeger", domain: "d4", kind: "service", term: "Jaeger", definition: "Distributed tracing backend and UI" },
    { id: "k-fluentd", domain: "d4", kind: "service", term: "Fluentd / Fluent Bit", definition: "Collect, filter, and forward logs" },
    { id: "k-grafana", domain: "d4", kind: "service", term: "Grafana", definition: "Dashboards over Prometheus and other data sources" },
    { id: "k-metrics-server", domain: "d4", kind: "service", term: "metrics-server", definition: "Resource metrics for kubectl top and the HPA" },
    { id: "k-keda", domain: "d4", kind: "service", term: "KEDA", definition: "Event-driven autoscaling, including scale to zero" },
    { id: "k-knative", domain: "d4", kind: "service", term: "Knative", definition: "Serverless on Kubernetes: Serving and Eventing" },
    { id: "k-hpa", domain: "d4", kind: "service", term: "HorizontalPodAutoscaler", definition: "Scales replica count to hit a metric target" },
    { id: "k-ca", domain: "d4", kind: "service", term: "Cluster Autoscaler", definition: "Adds nodes for Pending Pods; removes idle nodes" },
    { id: "c-pillars", domain: "d4", kind: "concept", term: "Three signals", definition: "Metrics (how much), logs (what happened), traces (where in the request)" },
    { id: "c-slo", domain: "d4", kind: "concept", term: "SLI / SLO / SLA", definition: "Measurement / target / contract" },
    { id: "c-counter", domain: "d4", kind: "concept", term: "Counter vs gauge", definition: "Counter only rises (use rate); gauge goes up and down" },
    { id: "c-immutable", domain: "d4", kind: "concept", term: "Immutable infrastructure", definition: "Replace instead of patching running servers or containers" },
    { id: "c-serverless", domain: "d4", kind: "concept", term: "Serverless", definition: "Platform runs and scales the code, often to zero" },
    { id: "c-oci", domain: "d4", kind: "concept", term: "OCI", definition: "Open specs for images, runtimes, and distribution" },
    { id: "c-maturity", domain: "d4", kind: "concept", term: "CNCF maturity", definition: "Sandbox → Incubating → Graduated" },
    { id: "c-toc", domain: "d4", kind: "concept", term: "CNCF TOC", definition: "Technical Oversight Committee: technical vision and project acceptance" },
    { id: "c-sig", domain: "d4", kind: "concept", term: "SIG", definition: "Kubernetes Special Interest Group owning one area of the project" },
    { id: "c-kep", domain: "d4", kind: "concept", term: "KEP", definition: "Kubernetes Enhancement Proposal for significant changes" },
  ],

  challenges: [
    {
      id: "ch-flash-sale",
      domain: "d4",
      lesson: "d4-autoscaling",
      title: "Survive the flash sale",
      goal: "During the flash sale, every Pod must be scheduled, none throttled, and the HPA must not hit its maxReplicas ceiling.",
      hint: "Work out ⌈6,000m ÷ (request × target)⌉. Then check that maxReplicas allows it and the Pods fit on three 3,500m nodes.",
      takeaway: "The HPA scales against requests. Requests decide how many Pods fit; limits decide when they get throttled; maxReplicas is a hard ceiling.",
      render: (onSolved) => <ScaleLab goal="peak" onSolved={onSolved} />,
    },
    {
      id: "ch-overnight-ha",
      domain: "d4",
      lesson: "d4-autoscaling",
      title: "Stay up overnight",
      goal: "Overnight, keep at least 2 replicas running for availability, with no throttling and no more than 2,000m of CPU reserved.",
      hint: "The HPA alone would drop to one Pod at night. Which setting puts a floor under it?",
      takeaway: "minReplicas is your availability floor; right-sized requests keep that floor cheap.",
      render: (onSolved) => <ScaleLab goal="ha" onSolved={onSolved} />,
    },
  ],
});
