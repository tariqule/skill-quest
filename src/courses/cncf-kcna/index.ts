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
  tagline: "Learn how Kubernetes runs, connects, ships and watches containers, from your first Pod to Prometheus.",
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
      { icon: "⏱️", value: "90", label: "minutes", detail: "That's 90 seconds per question. The timer keeps running if you pause, and lost time isn't added back after a disconnect." },
      { icon: "🎯", value: "75%", label: "to pass", detail: "A score of 75% or above passes. Results are emailed within 24 hours." },
      { icon: "💵", value: "$250", label: "USD", detail: "The price includes one retake. You have 12 months from purchase to take the exam, and there are no prerequisites." },
      { icon: "🖥️", value: "Online", label: "proctored", detail: "You take it from home in the PSI Secure Browser, with webcam, microphone and screen sharing on. One monitor only." },
      { icon: "📅", value: "2", label: "years valid", detail: "Renew it by passing the KCNA again. Passing the CKA or CKAD renews it automatically too." },
      { icon: "🌐", value: "3", label: "languages", detail: "English, plus Japanese and Simplified Chinese versions, which you register for separately." },
      { icon: "🗂️", value: "4", label: "domains", detail: "From the November 2025 curriculum: Kubernetes Fundamentals 44%, Container Orchestration 28%, Cloud Native Application Delivery 16%, and Cloud Native Architecture 12%. Observability now sits in the last one." },
    ],
    candidate: {
      is: [
        "Beginners getting started with Kubernetes and the cloud native ecosystem",
        "Developers and non-developers who work with cloud native technology",
        "Someone who can explain how Kubernetes is built, its API and core objects, and use kubectl at a basic level",
        "Comfortable with the ideas behind containers, cloud native design, observability and application delivery",
        "Preparing for later certifications such as the CKA, CKAD, or CKS",
      ],
      isNot: [
        "A hands-on exam. There's no live cluster or terminal. The CKA, CKAD and CKS are the hands-on ones",
        "Tied to any one cloud provider's managed Kubernetes service",
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
      { icon: "⚖️", tip: "Kubernetes Fundamentals is 44% of the exam. Know every control plane and node component, and exactly what each one does." },
      { icon: "🧭", tip: "Think plain upstream Kubernetes, not any one cloud. The answers are vendor-neutral." },
      { icon: "🔑", tip: "Many questions turn on one word: namespaced or cluster-scoped, liveness or readiness, taint or toleration, request or limit." },
      { icon: "🔌", tip: "Learn the interfaces: CRI is for runtimes, CNI for networking, CSI for storage, and OCI for image and runtime formats." },
      { icon: "⌨️", tip: "Know the everyday kubectl verbs (get, describe, logs, exec, apply, rollout, scale) and what each is for. You won't type any in the exam, but they come up a lot." },
      { icon: "🚩", tip: "Flag questions you're unsure about and come back to them from the review screen. The timer doesn't stop, so don't get stuck on one." },
    ],
  },

  cheatsheet: [
    {
      title: "Control plane and nodes",
      items: [
        ["kube-apiserver", "The front door. Checks who you are, what you may do, then admission, then saves to etcd. The only thing that talks to etcd"],
        ["etcd", "Holds all cluster state, uses Raft, runs 3 or 5 members. Back it up"],
        ["kube-scheduler", "Filters, then scores nodes, and binds Pods based on their requests"],
        ["kube-controller-manager", "Runs the control loops for Deployments, ReplicaSets, Nodes, Jobs and EndpointSlices"],
        ["cloud-controller-manager", "Handles cloud nodes, routes and LoadBalancer Services"],
        ["kubelet", "The node agent. Runs Pods through CRI, runs probes, reports status"],
        ["kube-proxy", "Sets up Service virtual IP rules (iptables, IPVS or nftables)"],
      ],
    },
    {
      title: "Workloads",
      items: [
        ["Pod", "Smallest unit. Containers share an IP (localhost) and volumes. Short-lived"],
        ["Deployment", "For stateless apps. Manages ReplicaSets, rolling updates and rollbacks"],
        ["StatefulSet", "Stable names like db-0, ordered startup, a PVC per Pod, a headless Service"],
        ["DaemonSet", "One Pod per node, for agents and log shippers"],
        ["Job / CronJob", "Runs until finished. A CronJob does it on a schedule"],
        ["Init container", "Runs to completion before the app containers start"],
        ["ConfigMap / Secret", "Settings and sensitive data, as env vars or files. Secrets are only base64, not encrypted"],
      ],
    },
    {
      title: "Scheduling",
      items: [
        ["Requests", "Used for scheduling and for HPA utilization"],
        ["Limits", "Over the CPU limit, you get throttled. Over the memory limit, you get OOMKilled (exit 137)"],
        ["QoS", "Guaranteed (requests equal limits), Burstable, and BestEffort (evicted first)"],
        ["Taint effects", "NoSchedule, PreferNoSchedule, and NoExecute (which also evicts)"],
        ["Toleration", "Lets a Pod onto a tainted node, but doesn't pull it there"],
        ["nodeSelector / affinity", "Pull Pods to labeled nodes. Anti-affinity spreads replicas out"],
        ["Maintenance", "Cordon, then drain (respects PDBs), then uncordon"],
      ],
    },
    {
      title: "Networking",
      items: [
        ["Model", "Every Pod has an IP and reaches other Pods without NAT. A CNI plugin builds it"],
        ["DNS", "<svc>.<namespace>.svc.cluster.local (CoreDNS)"],
        ["ClusterIP", "The default. Inside the cluster only"],
        ["NodePort", "A port on every node, from 30000 to 32767"],
        ["LoadBalancer", "A cloud load balancer, built on NodePort, built on ClusterIP"],
        ["ExternalName / headless", "ExternalName is a CNAME to an outside host. Headless (clusterIP: None) puts Pod IPs in DNS"],
        ["Ingress / Gateway API", "HTTP routing by host and path. Needs a controller"],
        ["Service mesh", "Adds mTLS, retries, traffic splitting and telemetry (Istio, Linkerd)"],
      ],
    },
    {
      title: "Security and storage",
      items: [
        ["4C's", "Cloud, then Cluster, then Container, then Code"],
        ["RBAC", "A Role or ClusterRole, given out by a RoleBinding or ClusterRoleBinding. Allow rules only"],
        ["ServiceAccount", "A Pod's identity for the API. Give each app only what it needs"],
        ["Pod Security Standards", "Privileged, Baseline and Restricted, set with namespace labels"],
        ["NetworkPolicy", "Everything is allowed by default. Selected Pods only accept what's allowed. Needs CNI support"],
        ["PV / PVC", "The PV is cluster-wide storage. The PVC is a namespaced claim on it"],
        ["StorageClass", "Creates volumes on demand. Reclaim policy is Delete (default) or Retain"],
        ["Access modes", "RWO, ROX, RWX and RWOP"],
      ],
    },
    {
      title: "Troubleshooting",
      items: [
        ["Pending", "Requests too big, a taint, a selector or an unbound PVC. Run describe and read the Events"],
        ["ImagePullBackOff", "Wrong image or tag, or a missing imagePullSecret"],
        ["CrashLoopBackOff", "The app keeps exiting. Check logs --previous"],
        ["CreateContainerConfigError", "A missing ConfigMap, Secret or key"],
        ["Probes", "Liveness restarts, readiness takes the Pod out of endpoints, startup makes the others wait"],
        ["Tools", "get, describe, logs, exec, events, debug and port-forward"],
      ],
    },
    {
      title: "Application delivery",
      items: [
        ["Rolling update", "The default. maxSurge and maxUnavailable are 25%. Each rollout makes a new ReplicaSet"],
        ["Rollback", "kubectl rollout history, then rollout undo (optionally --to-revision)"],
        ["Strategies", "Recreate (has downtime), blue/green (switch over), canary (small share first)"],
        ["GitOps", "Declarative, versioned and immutable, pulled automatically, continuously reconciled"],
        ["Argo CD / Flux", "Agents in the cluster that sync from Git and fix drift"],
        ["Helm", "Charts become releases, configured by values.yaml. Install, upgrade, roll back"],
        ["Kustomize", "A base plus overlays, applied with kubectl apply -k"],
      ],
    },
    {
      title: "Architecture and observability",
      items: [
        ["Signals", "Metrics (how much), logs (what happened), traces (where)"],
        ["Prometheus", "Scrapes /metrics, queried with PromQL. Pushgateway for batch jobs, Alertmanager for alerts"],
        ["Metric types", "Counter (use rate()), gauge, histogram and summary"],
        ["OpenTelemetry", "Vendor-neutral APIs, SDKs, the Collector and OTLP"],
        ["Autoscaling", "HPA changes Pod count, VPA changes requests, Cluster Autoscaler changes nodes, KEDA scales on events down to zero"],
        ["HPA math", "Current replicas times (current metric divided by target), rounded up"],
        ["Serverless", "Knative, scale to zero, CloudEvents"],
        ["CNCF", "Sandbox, Incubating, Graduated, run by the TOC. Kubernetes has SIGs and KEPs"],
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
