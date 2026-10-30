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
    summary: "How cloud native systems are designed, watched and scaled: metrics, logs and traces with Prometheus and OpenTelemetry, autoscaling, serverless, open standards, and how the CNCF community works.",
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
    // ── Start here ──
    {
      id: "d4-b-cloudnative",
      level: "beginner",
      task: "4.2",
      title: "Start here: what \"cloud native\" means",
      check: ["kcna-b4-01", "kcna-b4-02"],
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🧱", title: "One big app", text: "Everything in one piece. Changing one feature means redeploying the whole thing.", color: "#64748b" },
            { icon: "🧩", title: "Many small services", text: "Each piece runs in its own container and can be updated or scaled on its own.", color: "#a855f7" },
          ]}
        />
      ),
      points: [
        "Think of a food court instead of one big restaurant. Each stall cooks one thing, and a busy stall can add staff without touching the others.",
        "**Cloud native** is a way of building apps like that food court: small pieces in containers, run by automation, built to grow and shrink.",
        "Those small pieces are called **microservices**. Each one does one job, like payments or search.",
        "Cloud native apps also expect things to fail. If one copy crashes, another takes over, and a new copy gets started automatically.",
      ],
      tip: "Cloud native isn't about which cloud you use. You can run cloud native apps in your own data center too.",
    },
    {
      id: "d4-b-watching",
      level: "beginner",
      task: "4.1",
      title: "Start here: keeping an eye on a running app",
      check: ["kcna-b4-03", "kcna-b4-04"],
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "📊", title: "Metrics", text: "Numbers over time, like a car's speedometer.", color: "#a855f7" },
            { icon: "📜", title: "Logs", text: "A diary of events, like a ship's logbook.", color: "#a855f7" },
            { icon: "🧵", title: "Traces", text: "One request's trip through the system, like a parcel's tracking history.", color: "#a855f7" },
          ]}
        />
      ),
      points: [
        "Once your app is live, you need to know whether it's healthy. Being able to answer that from what the system reports is called **observability**.",
        "**Metrics** are numbers measured over time, like requests per second or memory used. They're great for graphs and alarms.",
        "**Logs** are written notes about what happened, like \"user 42 logged in\" or \"payment failed\".",
        "**Traces** follow one request as it hops between services, so you can see which hop was slow.",
      ],
      tip: "Need a number on a dashboard? Metrics. Need to know what happened at 3:02? Logs. Need to know where a request got slow? Traces.",
    },

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
              { icon: "📊", title: "Metrics", text: "Numbers over time: request rate, error rate, latency, CPU. Cheap to store and great for dashboards and alerts.", color: "#a855f7" },
              { icon: "📜", title: "Logs", text: "Timestamped records of events. Containers write to stdout and stderr, and an agent on each node (a DaemonSet) ships them.", color: "#a855f7" },
              { icon: "🧵", title: "Traces", text: "One request's path across services, recorded as spans, showing where the time went. Jaeger stores and displays them.", color: "#a855f7" },
            ]}
          />
          <Flow
            color="#a855f7"
            steps={[
              { icon: "🧑‍💻", label: "Instrument", sub: "OpenTelemetry APIs and SDKs" },
              { icon: "📮", label: "OTel Collector", sub: "Receive, process, export (OTLP)" },
              { icon: "🗄️", label: "Backends", sub: "Prometheus, Jaeger, log stores" },
              { icon: "📈", label: "Dashboards and alerts", sub: "Grafana, Alertmanager" },
            ]}
          />
        </div>
      ),
      points: [
        "Monitoring tells you something is wrong. Observability lets you work out why, using what the system itself reports.",
        "**OpenTelemetry** is the CNCF's vendor-neutral standard for producing and exporting traces, metrics and logs.",
        "Fluentd, and its lighter sibling Fluent Bit, collect, filter and forward logs. They usually run as a DaemonSet.",
        "An **SLI** measures the service, for example the share of requests answered in under 300 ms. An **SLO** is your target for it. An **SLA** is a contract with consequences if you miss it.",
      ],
      tip: "If the question is \"which service in the chain made this request slow?\", the answer is distributed tracing.",
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
              { icon: "🔥", label: "Prometheus", sub: "Finds and scrapes (pulls) them, stores time series" },
              { icon: "🧮", label: "PromQL", sub: "rate(http_requests_total[5m])" },
              { icon: "🚨", label: "Alertmanager", sub: "Groups, dedupes, routes, silences" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "➕", title: "Counter", text: "Only goes up, or resets to zero. Requests served is one. Use rate() on it.", color: "#38bdf8" },
              { icon: "🌡️", title: "Gauge", text: "Goes up and down, like memory in use or queue length.", color: "#38bdf8" },
              { icon: "📶", title: "Histogram", text: "Counts observations in buckets, like request durations, so you can get percentiles.", color: "#38bdf8" },
              { icon: "🧾", title: "Summary", text: "Quantiles worked out by the client, plus a count and a sum.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "**Prometheus** pulls metrics over HTTP on a schedule. It finds Kubernetes targets on its own through service discovery.",
        "Short batch jobs can finish before Prometheus gets around to scraping them. They push to the **Pushgateway** instead, and Prometheus scrapes that.",
        "**Exporters**, such as node_exporter, translate system or third-party metrics into the Prometheus format.",
        "metrics-server is something else. It feeds the resource metrics API used by `kubectl top` and the HPA. It isn't a monitoring system.",
      ],
      tip: "Prometheus pulls. The Pushgateway is the exception, for jobs too short-lived to be scraped.",
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
              { icon: "🧱", title: "Monolith", text: "One deployable unit. Simple to start, but every change redeploys everything, and it scales as one piece.", color: "#64748b" },
              { icon: "🧩", title: "Microservices", text: "Small services you can deploy on their own, each with its own data, owned by a small team and scaled separately.", color: "#a855f7" },
            ]}
          />
          <Layers
            layers={[
              { name: "Cloud native traits", color: "#a855f7", items: ["Containers", "Microservices", "Declarative APIs", "Immutable infrastructure", "Service meshes", "Automation"] },
              { name: "Design for failure", color: "#34d399", items: ["Health checks", "Retries and timeouts", "Horizontal scaling", "Loose coupling", "Graceful shutdown"] },
            ]}
          />
        </div>
      ),
      points: [
        "Cloud native means building and running apps that scale in changing environments. It relies on containers, microservices, immutable infrastructure, declarative APIs and lots of automation.",
        "**Immutable infrastructure** means you don't patch running servers or containers. You build a new version from source and replace them.",
        "Treat instances as cattle, not pets. Any one of them can be replaced at any moment, so keep state in external stores and volumes.",
        "Microservices give you independent deployments, but at the price of more network traffic. You'll need service discovery, observability and resilience patterns.",
      ],
      tip: "Fixing a running container by exec-ing in and editing files is never the cloud native answer. Rebuild the image and redeploy.",
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
              { icon: "↔️", title: "HPA", text: "Adds or removes Pods based on CPU, memory or custom metrics.", color: "#a855f7" },
              { icon: "↕️", title: "VPA", text: "Adjusts each Pod's CPU and memory requests to match what it really uses.", color: "#a855f7" },
              { icon: "🖥️", title: "Cluster Autoscaler", text: "Adds nodes when Pods are Pending for lack of room, and removes idle nodes.", color: "#a855f7" },
              { icon: "⚡", title: "KEDA", text: "Scales on events from queues, streams and more, all the way down to zero.", color: "#a855f7" },
            ]}
          />
        </div>
      ),
      points: [
        "The HPA multiplies the current replicas by the current metric divided by the target, then rounds up. It stays between minReplicas and maxReplicas.",
        "CPU utilization is measured against the Pod's request. So the HPA needs requests set, and metrics-server installed.",
        "Pod and node autoscaling work together. The HPA adds Pods, and if those Pods are Pending, the Cluster Autoscaler adds nodes.",
        "Keep minReplicas at 2 or more for anything that has to survive a node failure.",
      ],
      tip: "Horizontal means more Pods. Vertical means bigger Pods. Cluster means more nodes.",
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
              { icon: "☁️", title: "Serverless", text: "Developers ship functions or containers. The platform handles the servers and scaling (down to zero), and often bills per use.", color: "#38bdf8" },
              { icon: "🌊", title: "Knative", text: "Serverless on Kubernetes. Serving handles revisions, traffic splitting and scale to zero. Eventing routes events using CloudEvents.", color: "#38bdf8" },
            ]}
          />
          <Layers
            layers={[
              { name: "OCI", color: "#f97316", items: ["Image format", "Runtime spec", "Distribution (registries)"] },
              { name: "CRI", color: "#326ce5", items: ["kubelet to container runtime"] },
              { name: "CNI", color: "#14b8a6", items: ["Pod networking plugins"] },
              { name: "CSI", color: "#a855f7", items: ["Storage drivers"] },
            ]}
          />
        </div>
      ),
      points: [
        "**Serverless** doesn't mean there are no servers. Someone else runs them, and you think about usage instead of machines.",
        "Scaling to zero saves money on idle workloads. The cost is a **cold start**: the first request waits while a copy starts up.",
        "**CloudEvents** is a CNCF specification for describing event data the same way across services and platforms.",
        "Open interfaces (OCI, CRI, CNI, CSI) let you swap runtimes, networks and storage without changing Kubernetes. That keeps you from being locked in to one vendor.",
      ],
      tip: "Interface quiz: runtime is CRI, network is CNI, storage is CSI, and image format is OCI.",
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
              { icon: "🌱", label: "Sandbox", sub: "Early, experimental projects" },
              { icon: "🌿", label: "Incubating", sub: "Growing use and contributors" },
              { icon: "🌳", label: "Graduated", sub: "Stable, widely used, mature governance" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🏛️", title: "CNCF", text: "Part of the Linux Foundation. A vendor-neutral home for Kubernetes, Prometheus, Envoy and many more. Its Technical Oversight Committee (TOC) accepts and promotes projects.", color: "#38bdf8" },
              { icon: "👥", title: "SIGs", text: "Kubernetes Special Interest Groups each own an area, such as Network, Storage, Node or Release. Anyone can join their meetings.", color: "#38bdf8" },
              { icon: "📄", title: "KEPs", text: "Kubernetes Enhancement Proposals describe and track big changes. Features move from alpha to beta to stable (GA).", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Kubernetes was created at Google and open sourced in 2014. It was donated as the CNCF's first project and graduated in 2018.",
        "Graduated CNCF projects include Kubernetes, Prometheus, Envoy, CoreDNS, containerd, etcd, Helm, Argo and Flux.",
        "Alpha features are off by default and may change or disappear. Stable (GA) features are supported for the long term.",
        "Common roles: DevOps engineers, site reliability engineers (who own SLOs and error budgets), platform engineers (who build internal developer platforms), cloud architects and security engineers.",
      ],
      tip: "Maturity goes Sandbox, then Incubating, then Graduated.",
    },
  ],

  questions: [
    // ── Start here ──
    {
      id: "kcna-b4-01",
      domain: "d4",
      lesson: "d4-b-cloudnative",
      level: "beginner",
      prompt: "What is a microservice?",
      options: [
        "A small service that does one job and can be updated on its own",
        "A very small computer",
        "A Kubernetes command for tiny files",
        "A free trial of a cloud provider",
      ],
      answer: [0],
      explanation: "A microservice is one small piece of a bigger app, like the payments part of a shop. Because each piece stands alone, teams can change or scale it without touching the rest.",
    },
    {
      id: "kcna-b4-02",
      domain: "d4",
      lesson: "d4-b-cloudnative",
      level: "beginner",
      prompt: "Which statement best describes a cloud native app?",
      options: [
        "It's built from small pieces in containers, run by automation, and expects failures",
        "It only runs on one particular cloud provider",
        "It's a single program installed by hand on one server",
        "It never needs updates once it's released",
      ],
      answer: [0],
      explanation: "Cloud native is about how an app is built and run, not which cloud it's on. Small containerized pieces, automation and planning for failure are the core ideas.",
    },
    {
      id: "kcna-b4-03",
      domain: "d4",
      lesson: "d4-b-watching",
      level: "beginner",
      prompt: "You want a graph of how many requests per second your app is handling. Which kind of data do you need?",
      options: ["Metrics", "Logs", "Container images", "YAML manifests"],
      answer: [0],
      explanation: "Metrics are numbers measured over time, which is exactly what a graph shows. Logs are written event notes, better for finding out what happened at a moment.",
    },
    {
      id: "kcna-b4-04",
      domain: "d4",
      lesson: "d4-b-watching",
      level: "beginner",
      prompt: "A request passes through five services and one of them is slow. What helps you see which one?",
      options: ["A trace that follows the request through each service", "Restarting every service", "Reading the Dockerfile", "Counting the nodes in the cluster"],
      answer: [0],
      explanation: "A trace records each hop a single request makes and how long each one took. The slow hop stands out right away.",
    },
    {
      id: "kcna-b4-05",
      domain: "d4",
      lesson: "d4-b-watching",
      level: "beginner",
      prompt: "Which line is most likely a log entry?",
      options: ["`2024-05-01 10:02:13 ERROR payment failed for order 881`", "`cpu_usage 0.42`", "`replicas: 3`", "`FROM node:20`"],
      answer: [0],
      explanation: "A log entry is a timestamped note about something that happened. `cpu_usage 0.42` is a metric value, and the other two are configuration lines.",
    },

    // ── Observability ──
    {
      id: "d4-01",
      domain: "d4",
      lesson: "d4-observability",
      prompt: "Users say checkout is slow. The request passes through six microservices. Which signal best shows where the time is spent?",
      options: ["A distributed trace of the request", "Node CPU metrics", "The cluster's event log", "kubectl get pods output"],
      answer: [0],
      explanation: "A trace records one request's journey as spans across services, so the slow hop is easy to spot. Node CPU metrics can't tell you which service in the chain was slow.",
    },
    {
      id: "d4-02",
      domain: "d4",
      lesson: "d4-observability",
      prompt: "Which CNCF project provides vendor-neutral APIs, SDKs and a collector for producing and exporting traces, metrics and logs?",
      options: ["OpenTelemetry", "Helm", "etcd", "Kustomize"],
      answer: [0],
      explanation: "OpenTelemetry standardizes how you instrument code and export telemetry (over OTLP). That means you can switch backends without instrumenting your code again.",
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
      explanation: "Prometheus pulls, and it finds targets through service discovery. The Pushgateway exists for short-lived jobs that can't be scraped in time.",
    },
    {
      id: "d4-12",
      domain: "d4",
      lesson: "d4-prometheus",
      prompt: "Which component receives alerts from Prometheus and groups, deduplicates, silences and routes them to places like email or chat?",
      options: ["Alertmanager", "Pushgateway", "node_exporter", "kube-state-metrics"],
      answer: [0],
      explanation: "Prometheus evaluates the alerting rules. Alertmanager handles the notifications: grouping, inhibition, silences and routing.",
    },
    {
      id: "d4-13",
      domain: "d4",
      lesson: "d4-prometheus",
      prompt: "`http_requests_total` only ever goes up. Which Prometheus metric type is it, and how do you get requests per second?",
      options: ["A counter; use rate() over a time range", "A gauge; read it directly", "A histogram; use buckets", "A summary; use quantiles"],
      answer: [0],
      explanation: "Counters only go up, or reset when the app restarts. `rate(http_requests_total[5m])` gives you the average per second over 5 minutes.",
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
      explanation: "Prometheus is a time series database with labels, queried with PromQL. `kubectl top` reads from metrics-server instead, and cluster state lives in etcd.",
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
      explanation: "This is immutable infrastructure. You never change running instances. You replace them with a new, versioned build.",
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
      explanation: "Deploying and scaling each piece on its own are the big wins. The price is more network calls, which is why you need discovery, observability and resilience.",
    },

    // ── Autoscaling ──
    {
      id: "d4-31",
      domain: "d4",
      lesson: "d4-autoscaling",
      prompt: "An HPA targets 50% average CPU utilization. The Deployment runs 4 Pods at an average of 100% of their CPU requests. How many replicas will the HPA ask for, assuming maxReplicas allows it?",
      options: ["8", "4", "6", "2"],
      answer: [0],
      explanation: "Multiply 4 replicas by 100 divided by 50 and you get 8. The HPA scales so the average lands back at the target.",
    },
    {
      id: "d4-32",
      domain: "d4",
      lesson: "d4-autoscaling",
      prompt: "The HPA added replicas, but the new Pods are Pending because no node has room. What adds nodes automatically?",
      options: ["Cluster Autoscaler", "Vertical Pod Autoscaler", "kube-proxy", "The Deployment controller"],
      answer: [0],
      explanation: "The Cluster Autoscaler watches for Pods that can't be scheduled for lack of resources and adds nodes. It also removes nodes that sit underused.",
    },
    {
      id: "d4-33",
      domain: "d4",
      lesson: "d4-autoscaling",
      prompt: "A worker Deployment should scale based on how long a message queue is, and drop to zero Pods when the queue is empty. Which project is built for this?",
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
      explanation: "Horizontal gives you more Pods, vertical gives you bigger Pods, and the cluster autoscaler gives you more machines.",
    },

    // ── Serverless and standards ──
    {
      id: "d4-41",
      domain: "d4",
      lesson: "d4-serverless",
      prompt: "Which feature is typical of serverless platforms such as Knative Serving?",
      options: ["Scaling to zero when there is no traffic, and back up on demand", "Pinning each function to a dedicated physical server", "Requiring developers to manage node upgrades", "Running only stateful databases"],
      answer: [0],
      explanation: "Serverless platforms scale with requests, down to zero, so idle workloads cost nothing. The trade-off is a cold start on the first request.",
    },
    {
      id: "d4-42",
      domain: "d4",
      lesson: "d4-serverless",
      prompt: "Why do open interfaces such as CRI, CNI and CSI matter to Kubernetes users?",
      options: [
        "They let you swap runtimes, network plugins, and storage drivers from different vendors without changing Kubernetes",
        "They make Kubernetes run only on one cloud",
        "They replace the API server",
        "They are required to write Helm charts",
      ],
      answer: [0],
      explanation: "Standard interfaces separate Kubernetes from any one implementation. That gives you choice and keeps you from getting locked in to a vendor.",
    },
    {
      id: "d4-43",
      domain: "d4",
      lesson: "d4-serverless",
      type: "order",
      prompt: "Put the layers in order, from the kubelet down to the running container process.",
      items: ["kubelet", "CRI runtime such as containerd", "OCI runtime such as runc", "Container process in Linux namespaces and cgroups"],
      explanation: "The kubelet calls a CRI runtime. That runtime hands an OCI bundle to a low-level runtime, which creates the isolated process.",
    },

    // ── Community ──
    {
      id: "d4-51",
      domain: "d4",
      lesson: "d4-community",
      prompt: "What is the correct order of CNCF project maturity levels, from earliest to most mature?",
      options: ["Sandbox, Incubating, Graduated", "Incubating, Sandbox, Graduated", "Alpha, Beta, Stable", "Graduated, Incubating, Sandbox"],
      answer: [0],
      explanation: "Projects enter the Sandbox, move to Incubating as more people use them, and Graduate when they meet the TOC's maturity criteria. Alpha, beta and stable are Kubernetes feature stages, not project levels.",
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
      explanation: "A KEP sets out the motivation, design and graduation criteria. The Special Interest Group that owns that area reviews and sponsors the work.",
    },
    {
      id: "d4-53",
      domain: "d4",
      lesson: "d4-community",
      prompt: "Which of these are graduated CNCF projects? (Choose two.)",
      options: ["Prometheus", "Envoy", "Terraform", "Jenkins", "Ansible"],
      answer: [0, 1],
      explanation: "Prometheus and Envoy are CNCF graduated projects. Terraform, Jenkins and Ansible aren't CNCF projects at all.",
    },
    {
      id: "d4-54",
      domain: "d4",
      lesson: "d4-community",
      prompt: "An engineer builds an internal developer platform with self-service templates, golden paths and paved-road tooling for app teams. Which role fits best?",
      options: ["Platform engineer", "Database administrator", "Technical writer", "Network cable installer"],
      answer: [0],
      explanation: "Platform engineers build shared, self-service platforms so app teams can ship without handling the infrastructure details themselves.",
    },
  ],

  cards: [
    { id: "k-prometheus", domain: "d4", kind: "service", term: "Prometheus", definition: "Collects metrics by pulling them, and stores them as time series you query with PromQL." },
    { id: "k-alertmanager", domain: "d4", kind: "service", term: "Alertmanager", definition: "Groups, deduplicates, silences and routes Prometheus alerts." },
    { id: "k-otel", domain: "d4", kind: "service", term: "OpenTelemetry", definition: "Vendor-neutral APIs, SDKs and a collector for traces, metrics and logs." },
    { id: "k-jaeger", domain: "d4", kind: "service", term: "Jaeger", definition: "A distributed tracing backend with a UI." },
    { id: "k-fluentd", domain: "d4", kind: "service", term: "Fluentd and Fluent Bit", definition: "Collect, filter and forward logs." },
    { id: "k-grafana", domain: "d4", kind: "service", term: "Grafana", definition: "Dashboards on top of Prometheus and other data sources." },
    { id: "k-metrics-server", domain: "d4", kind: "service", term: "metrics-server", definition: "Provides the resource metrics behind kubectl top and the HPA." },
    { id: "k-keda", domain: "d4", kind: "service", term: "KEDA", definition: "Scales workloads on events, all the way down to zero." },
    { id: "k-knative", domain: "d4", kind: "service", term: "Knative", definition: "Serverless on Kubernetes, in two parts: Serving and Eventing." },
    { id: "k-hpa", domain: "d4", kind: "service", term: "HorizontalPodAutoscaler", definition: "Changes the replica count to hit a metric target." },
    { id: "k-ca", domain: "d4", kind: "service", term: "Cluster Autoscaler", definition: "Adds nodes for Pending Pods and removes idle ones." },
    { id: "c-pillars", domain: "d4", kind: "concept", term: "Three signals", definition: "Metrics tell you how much, logs tell you what happened, traces tell you where in the request." },
    { id: "c-slo", domain: "d4", kind: "concept", term: "SLI, SLO and SLA", definition: "The measurement, the target, and the contract." },
    { id: "c-counter", domain: "d4", kind: "concept", term: "Counter versus gauge", definition: "A counter only rises, so you use rate() on it. A gauge goes up and down." },
    { id: "c-immutable", domain: "d4", kind: "concept", term: "Immutable infrastructure", definition: "Replace servers or containers instead of patching them while they run." },
    { id: "c-serverless", domain: "d4", kind: "concept", term: "Serverless", definition: "The platform runs and scales your code, often down to zero." },
    { id: "c-oci", domain: "d4", kind: "concept", term: "OCI", definition: "Open specs for images, runtimes and distribution." },
    { id: "c-maturity", domain: "d4", kind: "concept", term: "CNCF maturity", definition: "Sandbox, then Incubating, then Graduated." },
    { id: "c-toc", domain: "d4", kind: "concept", term: "CNCF TOC", definition: "The Technical Oversight Committee. It sets technical vision and accepts projects." },
    { id: "c-sig", domain: "d4", kind: "concept", term: "SIG", definition: "A Kubernetes Special Interest Group that owns one area of the project." },
    { id: "c-kep", domain: "d4", kind: "concept", term: "KEP", definition: "A Kubernetes Enhancement Proposal, used for significant changes." },
  ],

  challenges: [
    {
      id: "ch-flash-sale",
      domain: "d4",
      lesson: "d4-autoscaling",
      title: "Survive the flash sale",
      goal: "During the flash sale, every Pod has to be scheduled, none can be throttled, and the HPA mustn't hit its maxReplicas ceiling.",
      hint: "Divide 6,000m by (request times target) and round up. Then check that maxReplicas allows that many, and that the Pods fit on three 3,500m nodes.",
      takeaway: "The HPA scales against requests. Requests decide how many Pods fit, limits decide when they get throttled, and maxReplicas is a hard ceiling.",
      render: (onSolved) => <ScaleLab goal="peak" onSolved={onSolved} />,
    },
    {
      id: "ch-overnight-ha",
      domain: "d4",
      lesson: "d4-autoscaling",
      title: "Stay up overnight",
      goal: "Overnight, keep at least 2 replicas running for availability, with no throttling and no more than 2,000m of CPU reserved.",
      hint: "On its own, the HPA would drop to one Pod at night. Which setting puts a floor under it?",
      takeaway: "minReplicas is your availability floor. Right-sized requests keep that floor cheap.",
      render: (onSolved) => <ScaleLab goal="ha" onSolved={onSolved} />,
    },
  ],
});
