import { defineCourse } from "@/engine/define";
import d1 from "./domains/d1-kubernetes-fundamentals";
import d2 from "./domains/d2-container-orchestration";
import d3 from "./domains/d3-application-delivery";
import d4 from "./domains/d4-cloud-native-architecture";

/**
 * Kubernetes and Cloud Native Associate (KCNA), from the CNCF and the Linux Foundation.
 * Content follows the KCNA curriculum published in the cncf/curriculum repository
 * (updated November 2025: four domains, 44/28/16/12) and the Linux Foundation's
 * certification page and candidate handbook (retrieved October 2026).
 * Domain content lives in ./domains; this file holds course-wide metadata.
 */
export default defineCourse({
  id: "cncf-kcna",
  provider: { id: "cncf", name: "Kubernetes", color: "#326ce5", icon: "☸️" },
  code: "KCNA",
  title: "Kubernetes and Cloud Native Associate",
  shortTitle: "KCNA",
  tagline: "Kubernetes fundamentals, container orchestration, application delivery, and the cloud native ecosystem, from Pods to Prometheus.",
  level: "Associate",
  storageKey: "course:cncf-kcna:v1",

  domains: [d1, d2, d3, d4],

  exam: {
    questions: 60,
    unscored: 0,
    minutes: 90,
    // The Linux Foundation reports a percentage; 75% or above passes.
    scale: { min: 0, max: 100, pass: 75 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "1 correct answer. The Linux Foundation describes the KCNA as 60 multiple-choice questions." },
      {
        id: "multi",
        icon: "☑️",
        name: "Multiple response",
        rule: "Practice format: choose the number of answers the question asks for. The Linux Foundation doesn't document this format for the KCNA, so the simulator leaves it out.",
        practiceOnly: true,
      },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Practice format: put the steps in sequence, such as a request's path through the API server.", practiceOnly: true },
      { id: "match", icon: "🔗", name: "Matching", rule: "Practice format: pair each component or term with what it does.", practiceOnly: true },
      { id: "lines", icon: "🐞", name: "Bug hunt", rule: "Practice format: tap the line that breaks a Kubernetes manifest.", practiceOnly: true },
    ],
  },

  guide: {
    source: {
      label: "CNCF KCNA exam curriculum",
      version: "November 2025 update",
      date: "Retrieved October 2026",
      url: "https://github.com/cncf/curriculum/blob/master/KCNA_Curriculum.pdf",
    },
    facts: [
      { icon: "📝", value: "60", label: "questions", detail: "Multiple choice, delivered online. You can flag items and revisit them from the review screen before finishing." },
      { icon: "⏱️", value: "90", label: "minutes", detail: "90 seconds per question. The timer keeps running if you pause, and time can't be added back after a disconnect." },
      { icon: "🎯", value: "75%", label: "to pass", detail: "A score of 75% or above passes. Results are emailed within 24 hours." },
      { icon: "💵", value: "$250", label: "USD", detail: "Includes one retake. You have 12 months from purchase to schedule and take the exam. No prerequisites." },
      { icon: "🖥️", value: "Online", label: "proctored", detail: "Taken remotely in the PSI Secure Browser with webcam, microphone, and screen sharing. One monitor only." },
      { icon: "📅", value: "2", label: "years valid", detail: "Renew by passing the KCNA again. Passing the CKA or CKAD also renews it automatically." },
      { icon: "🌐", value: "3", label: "languages", detail: "English, plus Japanese and Simplified Chinese versions that are registered separately." },
      { icon: "🗂️", value: "4", label: "domains", detail: "The November 2025 curriculum: Kubernetes Fundamentals 44%, Container Orchestration 28%, Cloud Native Application Delivery 16%, Cloud Native Architecture 12% (observability now lives here)." },
    ],
    candidate: {
      is: [
        "Beginners getting started with Kubernetes and the cloud native ecosystem",
        "Developers and non-developers alike who work with cloud native technologies",
        "Someone who can explain the Kubernetes architecture, its API, and core objects, and use kubectl at a basic level",
        "Familiar with containers, cloud native architecture, observability, and application delivery concepts",
        "Preparing for later certifications such as the CKA, CKAD, or CKS",
      ],
      isNot: [
        "A hands-on exam: there is no live cluster or terminal (the CKA, CKAD, and CKS are the performance-based exams)",
        "Specific to one cloud provider's managed Kubernetes service",
        "Gated by prerequisites or prior certifications",
      ],
    },
    scope: {
      label: "Topics and projects this course covers",
      groups: [
        { category: "Control plane and nodes", icon: "🏛️", services: ["kube-apiserver", "etcd", "kube-scheduler", "kube-controller-manager", "cloud-controller-manager", "kubelet", "kube-proxy"] },
        { category: "Workloads and API objects", icon: "📦", services: ["Pod", "Deployment", "ReplicaSet", "StatefulSet", "DaemonSet", "Job", "CronJob", "ConfigMap", "Secret", "Namespace", "CustomResourceDefinition"] },
        { category: "Containers", icon: "🐳", services: ["containerd", "CRI-O", "runc", "OCI images", "Container registries"] },
        { category: "Networking", icon: "🌐", services: ["Services", "CoreDNS", "Ingress", "Gateway API", "NetworkPolicy", "CNI plugins (Calico, Cilium, Flannel)", "Service mesh (Istio, Linkerd)"] },
        { category: "Security", icon: "🔐", services: ["RBAC", "ServiceAccounts", "Pod Security Standards", "Admission control", "Security contexts"] },
        { category: "Storage", icon: "💾", services: ["Volumes", "PersistentVolume", "PersistentVolumeClaim", "StorageClass", "CSI drivers"] },
        { category: "Application delivery", icon: "🚢", services: ["Helm", "Kustomize", "Argo CD", "Flux", "CI/CD pipelines", "Rolling, canary, and blue/green releases"] },
        { category: "Observability", icon: "🔭", services: ["Prometheus", "Alertmanager", "OpenTelemetry", "Jaeger", "Fluentd / Fluent Bit", "metrics-server"] },
        { category: "Scaling and serverless", icon: "📈", services: ["HorizontalPodAutoscaler", "Vertical Pod Autoscaler", "Cluster Autoscaler", "KEDA", "Knative"] },
        { category: "Ecosystem and community", icon: "🤝", services: ["CNCF and its TOC", "Sandbox / Incubating / Graduated", "Kubernetes SIGs and KEPs", "OCI, CRI, CNI, CSI"] },
      ],
    },
    tips: [
      { icon: "⚖️", tip: "Kubernetes Fundamentals is 44% of the exam. Know every control plane and node component cold, and which one does what." },
      { icon: "🧭", tip: "Think upstream Kubernetes, not one cloud: answers are vendor-neutral." },
      { icon: "🔑", tip: "Many questions hinge on one word: namespaced vs cluster-scoped, liveness vs readiness, taint vs toleration, request vs limit." },
      { icon: "🔌", tip: "Interfaces: runtime → CRI, network → CNI, storage → CSI, image and runtime formats → OCI." },
      { icon: "⌨️", tip: "Know the everyday kubectl verbs (get, describe, logs, exec, apply, rollout, scale) and what each one is for, even though nothing is typed in the exam." },
      { icon: "🚩", tip: "Flag questions you're unsure about and come back from the review screen. The timer doesn't stop, so don't get stuck." },
    ],
  },

  cheatsheet: [
    {
      title: "Control plane and nodes",
      items: [
        ["kube-apiserver", "Front door; authn → authz → admission → etcd. Only it talks to etcd"],
        ["etcd", "All cluster state · Raft · 3 or 5 members · back it up"],
        ["kube-scheduler", "Filter then score nodes · binds Pods by requests"],
        ["kube-controller-manager", "Reconcile loops: Deployment, ReplicaSet, Node, Job, EndpointSlice"],
        ["cloud-controller-manager", "Cloud nodes, routes, LoadBalancer Services"],
        ["kubelet", "Node agent · runs Pods via CRI · probes · status"],
        ["kube-proxy", "Service virtual IP rules (iptables, IPVS, nftables)"],
      ],
    },
    {
      title: "Workloads",
      items: [
        ["Pod", "Smallest unit · shared IP (localhost) and volumes · ephemeral"],
        ["Deployment", "Stateless · ReplicaSets · rolling update and rollback"],
        ["StatefulSet", "Stable names (db-0) · ordered · PVC per Pod · headless Service"],
        ["DaemonSet", "One Pod per node: agents, log shippers"],
        ["Job / CronJob", "Run to completion · on a cron schedule"],
        ["Init container", "Runs to completion before app containers start"],
        ["ConfigMap / Secret", "Config / sensitive data · env vars or files · Secrets are only base64"],
      ],
    },
    {
      title: "Scheduling",
      items: [
        ["Requests", "Used for scheduling and HPA utilization"],
        ["Limits", "CPU over limit → throttled · memory over limit → OOMKilled (137)"],
        ["QoS", "Guaranteed (requests = limits) · Burstable · BestEffort (evicted first)"],
        ["Taint effects", "NoSchedule · PreferNoSchedule · NoExecute (evicts)"],
        ["Toleration", "Allows onto a tainted node; doesn't attract"],
        ["nodeSelector / affinity", "Attract to labeled nodes · anti-affinity spreads replicas"],
        ["Maintenance", "cordon → drain (respects PDBs) → uncordon"],
      ],
    },
    {
      title: "Networking",
      items: [
        ["Model", "Every Pod has an IP · Pod-to-Pod without NAT · CNI implements it"],
        ["DNS", "<svc>.<namespace>.svc.cluster.local (CoreDNS)"],
        ["ClusterIP", "Default · internal only"],
        ["NodePort", "Port on every node · 30000–32767"],
        ["LoadBalancer", "Cloud load balancer → NodePort → ClusterIP"],
        ["ExternalName / headless", "CNAME to outside host · clusterIP: None, Pod IPs in DNS"],
        ["Ingress / Gateway API", "HTTP host and path routing · needs a controller"],
        ["Service mesh", "mTLS, retries, traffic splitting, telemetry (Istio, Linkerd)"],
      ],
    },
    {
      title: "Security and storage",
      items: [
        ["4C's", "Cloud → Cluster → Container → Code"],
        ["RBAC", "Role / ClusterRole + RoleBinding / ClusterRoleBinding · allow-only"],
        ["ServiceAccount", "Pod identity for the API · least privilege per app"],
        ["Pod Security Standards", "Privileged · Baseline · Restricted · namespace labels"],
        ["NetworkPolicy", "Default allow-all · selected Pods become allow-list · needs CNI support"],
        ["PV / PVC", "Cluster-scoped storage / namespaced claim"],
        ["StorageClass", "Dynamic provisioning · reclaim Delete (default) or Retain"],
        ["Access modes", "RWO · ROX · RWX · RWOP"],
      ],
    },
    {
      title: "Troubleshooting",
      items: [
        ["Pending", "Requests too big, taint, selector, unbound PVC → describe, read Events"],
        ["ImagePullBackOff", "Wrong image or tag, missing imagePullSecret"],
        ["CrashLoopBackOff", "App keeps exiting → logs --previous"],
        ["CreateContainerConfigError", "Missing ConfigMap, Secret, or key"],
        ["Probes", "Liveness → restart · readiness → out of endpoints · startup → wait"],
        ["Tools", "get · describe · logs · exec · events · debug · port-forward"],
      ],
    },
    {
      title: "Application delivery",
      items: [
        ["Rolling update", "Default · maxSurge / maxUnavailable 25% · new ReplicaSet per rollout"],
        ["Rollback", "kubectl rollout history · rollout undo [--to-revision]"],
        ["Strategies", "Recreate (downtime) · blue/green (switch) · canary (small share first)"],
        ["GitOps", "Declarative · versioned and immutable · pulled automatically · continuously reconciled"],
        ["Argo CD / Flux", "In-cluster agents that sync from Git and fix drift"],
        ["Helm", "Charts → releases · values.yaml · install / upgrade / rollback"],
        ["Kustomize", "Base + overlays · kubectl apply -k"],
      ],
    },
    {
      title: "Architecture and observability",
      items: [
        ["Signals", "Metrics (how much) · logs (what happened) · traces (where)"],
        ["Prometheus", "Pull/scrape /metrics · PromQL · Pushgateway for batch jobs · Alertmanager"],
        ["Metric types", "Counter (rate()) · gauge · histogram · summary"],
        ["OpenTelemetry", "Vendor-neutral APIs, SDKs, Collector, OTLP"],
        ["Autoscaling", "HPA = Pods · VPA = requests · Cluster Autoscaler = nodes · KEDA = events, to zero"],
        ["HPA math", "desired = ⌈current × currentMetric ÷ target⌉"],
        ["Serverless", "Knative · scale to zero · CloudEvents"],
        ["CNCF", "Sandbox → Incubating → Graduated · TOC · Kubernetes SIGs and KEPs"],
      ],
    },
  ],

  boss: { name: "The CrashLoop Kraken", emoji: "🐙" },
  matchLabel: "Kubernetes components and CNCF projects",
  levelTitles: [
    "Pod Novice",
    "Container Crafter",
    "Label Linker",
    "Namespace Navigator",
    "Service Steward",
    "Scheduler Whisperer",
    "Helm Hand",
    "GitOps Gardener",
    "Observability Oracle",
    "Cloud Native Captain",
  ],
});
