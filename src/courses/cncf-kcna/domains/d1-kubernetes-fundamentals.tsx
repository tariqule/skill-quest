import { CodeBlock, Flow, Layers, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { SchedulingLab } from "../labs";
import { ClusterMap } from "../visuals";

/**
 * Domain 1: Kubernetes Fundamentals (44% of the KCNA exam).
 * The official curriculum lists four topics (core concepts, administration, scheduling,
 * containerization); the `covers` lines are this course's breakdown of each topic.
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "Kubernetes Fundamentals",
    world: "The Control Plane Citadel",
    weight: 44,
    emoji: "☸️",
    color: "#326ce5",
    summary: "Cluster architecture, the Kubernetes API and kubectl, Pods and workload controllers, namespaces and labels, administration, scheduling, and containers.",
  },

  tasks: [
    {
      id: "1.1",
      title: "Kubernetes core concepts",
      covers: [
        "Describe the control plane (API server, etcd, scheduler, controller managers) and node components (kubelet, kube-proxy, container runtime)",
        "Explain the declarative API: objects, spec and status, reconciliation, and extending it with custom resources",
        "Use Pods and the workload controllers: Deployment, ReplicaSet, StatefulSet, DaemonSet, Job, CronJob",
        "Organize resources with namespaces, labels, selectors, and annotations; configure apps with ConfigMaps and Secrets",
      ],
    },
    {
      id: "1.2",
      title: "Administration",
      covers: [
        "Work with kubectl and kubeconfig contexts",
        "Bootstrap and upgrade clusters (kubeadm), follow the release cycle and version support",
        "Maintain nodes with cordon and drain; limit namespaces with ResourceQuota and LimitRange",
      ],
    },
    {
      id: "1.3",
      title: "Scheduling",
      covers: [
        "Explain how the scheduler filters and scores nodes",
        "Set resource requests and limits and understand QoS classes",
        "Steer Pods with nodeSelector, node and Pod affinity, taints and tolerations, and priority",
      ],
    },
    {
      id: "1.4",
      title: "Containerization",
      covers: [
        "Explain containers versus virtual machines, Linux namespaces, and cgroups",
        "Build and tag images; use registries, tags, and digests",
        "Describe container runtimes, the CRI, and the OCI specifications",
      ],
    },
  ],

  lessons: [
    {
      id: "d1-architecture",
      task: "1.1",
      title: "Cluster architecture: control plane and nodes",
      check: ["d1-01", "d1-02"],
      visual: <ClusterMap />,
      points: [
        "The control plane makes decisions: kube-apiserver (the only door), etcd (the state), kube-scheduler (where Pods run), kube-controller-manager (the control loops), and optionally the cloud-controller-manager.",
        "Every node runs a kubelet (node agent), a container runtime (containerd, CRI-O), and usually kube-proxy (Service networking rules).",
        "Components never talk to etcd directly. They watch and update objects through the API server, which persists them.",
        "etcd uses Raft consensus: an odd number of members (3 or 5) tolerates failures while keeping a quorum.",
      ],
      tip: "\"Which component decides which node a Pod runs on?\" → kube-scheduler. \"Which one actually starts the containers?\" → kubelet, through the container runtime.",
    },
    {
      id: "d1-api",
      task: "1.1 · 1.2",
      title: "The Kubernetes API, objects, and kubectl",
      check: ["d1-11", "d1-12"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="yaml"
            caption="Every object: apiVersion + kind say what it is, metadata names it, spec is what you want, status is what Kubernetes observed."
            code={`apiVersion: apps/v1      # API group/version
kind: Deployment         # object type
metadata:
  name: web
  namespace: shop
  labels: { app: web }
spec:                    # desired state (you write)
  replicas: 3
  ...
status:                  # observed state (Kubernetes writes)
  readyReplicas: 3`}
          />
          <Flow
            color="#326ce5"
            loop="Controllers keep comparing desired with actual state and acting on the difference"
            steps={[
              { icon: "📝", label: "kubectl apply -f", sub: "Send the desired state" },
              { icon: "🚪", label: "API server", sub: "Authenticate, authorize, admit, validate" },
              { icon: "🗃️", label: "etcd", sub: "Object stored" },
              { icon: "🔁", label: "Controller", sub: "Watches and reconciles" },
            ]}
          />
        </div>
      ),
      points: [
        "Kubernetes is declarative: you store the desired state in objects, and controllers reconcile the real world toward it continuously.",
        "Core objects such as Pod, Service, ConfigMap, and Namespace use apiVersion v1; workloads such as Deployment use apps/v1.",
        "kubectl apply is declarative (create or update from files); kubectl create, run, and scale are imperative commands.",
        "kubectl explain <kind>.<field> documents fields; kubectl api-resources lists every kind, its short name, and whether it is namespaced.",
        "CustomResourceDefinitions (CRDs) add new kinds to the API. An operator pairs a CRD with a controller that encodes operational knowledge.",
      ],
      tip: "spec = what you asked for; status = what is actually true. You never write status.",
    },
    {
      id: "d1-workloads",
      task: "1.1",
      title: "Pods and workload controllers",
      check: ["d1-21", "d1-22"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#326ce5"
            steps={[
              { icon: "🚀", label: "Deployment", sub: "Rollouts and rollbacks" },
              { icon: "📑", label: "ReplicaSet", sub: "Keeps N identical Pods" },
              { icon: "📦", label: "Pods", sub: "Disposable, replaceable" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧬", title: "StatefulSet", text: "Stable names (db-0, db-1), ordered start, and a PersistentVolumeClaim per Pod. Pairs with a headless Service.", color: "#326ce5" },
              { icon: "🛰️", title: "DaemonSet", text: "One Pod on every (matching) node: log shippers, monitoring agents, CNI plugins.", color: "#326ce5" },
              { icon: "🏁", title: "Job / CronJob", text: "Run to completion, with retries. CronJob creates Jobs on a cron schedule.", color: "#326ce5" },
            ]}
          />
        </div>
      ),
      points: [
        "A Pod is the smallest deployable unit: one or more containers sharing one IP address (they talk over localhost) and volumes.",
        "Pods are ephemeral. Don't create bare Pods for apps; a controller recreates them when they fail or a node dies.",
        "Init containers run to completion before the app containers start. A sidecar is a helper container (proxy, log shipper) running alongside the app.",
        "Deployments are for stateless apps; StatefulSets for apps that need stable identity and storage; DaemonSets for per-node agents.",
      ],
      tip: "\"Exactly one copy on every node\" → DaemonSet. \"Stable hostname and its own disk per replica\" → StatefulSet.",
    },
    {
      id: "d1-config",
      task: "1.1",
      title: "Namespaces, labels, ConfigMaps, and Secrets",
      check: ["d1-31", "d1-32"],
      visual: (
        <div className="grid gap-4">
          <Layers
            layers={[
              { name: "Namespaced (live inside a namespace)", color: "#326ce5", items: ["Pod", "Deployment", "Service", "ConfigMap", "Secret", "Role", "PersistentVolumeClaim"] },
              { name: "Cluster-scoped", color: "#a78bfa", items: ["Node", "Namespace", "PersistentVolume", "StorageClass", "ClusterRole", "CustomResourceDefinition"] },
              { name: "Namespaces in a new cluster", color: "#34d399", items: ["default", "kube-system", "kube-public", "kube-node-lease"] },
            ]}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🏷️", title: "Labels + selectors", text: "Key/value pairs you can select on: Services, Deployments, and NetworkPolicies find Pods with selectors like app=web.", color: "#f59e0b" },
              { icon: "📝", title: "Annotations", text: "Non-identifying metadata for tools and people (build info, owner, config hints). Not used for selection.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "Namespaces divide one cluster into virtual clusters for teams or environments; names must be unique within a namespace, not across the cluster.",
        "ConfigMaps hold non-sensitive configuration; Secrets hold sensitive data. Both can be consumed as environment variables or mounted files.",
        "Secret values are only base64-encoded, not encrypted. Protect them with RBAC and enable encryption at rest for etcd.",
        "Labels drive behaviour (selection); annotations only describe.",
      ],
      tip: "A Service that sends traffic to nothing usually has a selector that doesn't match the Pod labels.",
    },
    {
      id: "d1-admin",
      task: "1.2",
      title: "Administration: kubeconfig, upgrades, and node maintenance",
      check: ["d1-41", "d1-42"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🗝️", title: "kubeconfig", text: "~/.kube/config lists clusters, users, and contexts (cluster + user + namespace). kubectl config use-context switches.", color: "#38bdf8" },
              { icon: "🛠️", title: "kubeadm", text: "Bootstraps a conformant cluster (kubeadm init, kubeadm join) and upgrades it one minor version at a time.", color: "#38bdf8" },
              { icon: "🧾", title: "Quotas", text: "ResourceQuota caps a namespace's total usage; LimitRange sets per-container defaults and min/max.", color: "#38bdf8" },
            ]}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "🚧", label: "kubectl cordon", sub: "Mark the node unschedulable" },
              { icon: "🚚", label: "kubectl drain", sub: "Evict Pods (respects PodDisruptionBudgets)" },
              { icon: "🔧", label: "Maintain / upgrade", sub: "Patch the OS, upgrade the kubelet" },
              { icon: "✅", label: "kubectl uncordon", sub: "Allow scheduling again" },
            ]}
          />
        </div>
      ),
      points: [
        "Kubernetes ships about three minor releases a year, and the three most recent minor versions are supported with patches (roughly 14 months each).",
        "Upgrade the control plane first, then the nodes. A kubelet must never be newer than the API server.",
        "A PodDisruptionBudget limits how many replicas of an app voluntary disruptions such as drains can take down at once.",
        "Managed services (EKS, GKE, AKS, and others) run the control plane for you; you still manage workloads and usually node upgrades.",
      ],
      tip: "Node maintenance order: cordon → drain → work → uncordon.",
    },
    {
      id: "d1-scheduling",
      task: "1.3",
      title: "Scheduling: requests, affinity, taints, and tolerations",
      check: ["d1-51", "d1-52"],
      visual: (
        <div className="grid gap-4">
          <SchedulingLab />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🟩", title: "Guaranteed", text: "Every container sets CPU and memory requests equal to limits. Evicted last.", color: "#34d399" },
              { icon: "🟨", title: "Burstable", text: "At least one request or limit set, but not Guaranteed.", color: "#fbbf24" },
              { icon: "🟥", title: "BestEffort", text: "No requests or limits at all. First to be evicted under node pressure.", color: "#fb7185" },
            ]}
          />
        </div>
      ),
      points: [
        "The scheduler places Pods by requests, not actual usage: filtering removes nodes that can't fit the Pod, scoring ranks the rest.",
        "Limits are enforced at runtime: going over the CPU limit throttles the container; going over the memory limit gets it OOMKilled.",
        "Taints repel Pods from nodes; tolerations allow (but don't force) a Pod onto a tainted node. Use nodeSelector or node affinity to attract it.",
        "Taint effects: NoSchedule (no new Pods), PreferNoSchedule (avoid if possible), NoExecute (also evicts running Pods that don't tolerate it).",
        "Pod anti-affinity spreads replicas across nodes or zones; PriorityClasses let important Pods preempt lower-priority ones.",
      ],
      tip: "Pending Pod? Read the FailedScheduling event in kubectl describe pod: it names the unmet requests, taints, or selectors.",
    },
    {
      id: "d1-containers",
      task: "1.4",
      title: "Containers, images, and runtimes",
      check: ["d1-61", "d1-62"],
      visual: (
        <div className="grid gap-4">
          <Layers
            layers={[
              { name: "kubelet", color: "#326ce5", items: ["Talks CRI (gRPC)"] },
              { name: "High-level runtime (CRI implementation)", color: "#38bdf8", items: ["containerd", "CRI-O"] },
              { name: "Low-level OCI runtime", color: "#34d399", items: ["runc", "crun", "Sandboxed: gVisor, Kata Containers"] },
              { name: "Linux kernel", color: "#a78bfa", items: ["namespaces = isolation", "cgroups = resource limits"] },
            ]}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🧅", title: "Image layers", text: "Each Dockerfile instruction adds a read-only layer; layers are shared and cached. Multi-stage builds keep only what runs.", color: "#f59e0b" },
              { icon: "🔖", title: "Tag vs digest", text: "Tags (:1.4, :latest) can be moved. A digest (@sha256:…) always names exactly the same image.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "Containers share the host kernel and are isolated with Linux namespaces (PID, network, mount, …) and limited with cgroups. VMs each boot their own kernel.",
        "OCI defines open specifications for images, runtimes, and distribution (registries), so an image built by any tool runs on any compliant runtime.",
        "Kubernetes removed dockershim in v1.24; images built with Docker still run, because they are standard OCI images.",
        "Prefer small base images, non-root users, and immutable tags or digests; avoid :latest in production.",
      ],
      tip: "CRI = kubelet ↔ runtime. OCI = image and runtime formats. Don't mix them up.",
    },
  ],

  questions: [
    // ── Architecture ──
    {
      id: "d1-01",
      domain: "d1",
      lesson: "d1-architecture",
      prompt: "A newly created Pod has no node assigned. Which control plane component chooses a node for it?",
      options: ["kube-scheduler", "kubelet", "kube-controller-manager", "etcd"],
      answer: [0],
      explanation: "The scheduler watches for unscheduled Pods, filters and scores nodes, and binds the Pod to one. The kubelet on that node then runs it.",
    },
    {
      id: "d1-02",
      domain: "d1",
      lesson: "d1-architecture",
      prompt: "Where does Kubernetes persist the desired and current state of every object in the cluster?",
      options: ["etcd", "The kubelet's local disk", "The container registry", "kube-proxy's rule table"],
      answer: [0],
      explanation: "etcd is the consistent key-value store behind the API server. All cluster state lives there, which is why it must be backed up.",
    },
    {
      id: "d1-03",
      domain: "d1",
      lesson: "d1-architecture",
      prompt: "Which component runs on every worker node, registers the node with the cluster, and makes sure the containers of Pods assigned to it are running?",
      options: ["kubelet", "kube-apiserver", "kube-scheduler", "cloud-controller-manager"],
      answer: [0],
      explanation: "The kubelet is the node agent. It watches the API server for Pods bound to its node and drives the container runtime through the CRI.",
    },
    {
      id: "d1-04",
      domain: "d1",
      lesson: "d1-architecture",
      prompt: "Which component is the only one that reads from and writes to etcd directly?",
      options: ["kube-apiserver", "kube-scheduler", "kubelet", "kube-controller-manager"],
      answer: [0],
      explanation: "Every other component works through the API server, which validates requests and persists objects in etcd.",
    },
    {
      id: "d1-05",
      domain: "d1",
      lesson: "d1-architecture",
      prompt: "A team runs a 3-member etcd cluster. How many members can fail while the cluster still accepts writes?",
      options: ["1", "0", "2", "3"],
      answer: [0],
      explanation: "Raft needs a majority (quorum). With 3 members the quorum is 2, so the cluster tolerates one failure. Five members tolerate two.",
    },
    {
      id: "d1-06",
      domain: "d1",
      lesson: "d1-architecture",
      prompt: "A Deployment's Pods keep being recreated after they are deleted by hand. Which component runs the control loop responsible for this?",
      options: ["kube-controller-manager", "kube-proxy", "etcd", "The container runtime"],
      answer: [0],
      explanation: "The controller manager runs the Deployment and ReplicaSet controllers, which notice fewer Pods than desired and create replacements.",
    },
    {
      id: "d1-07",
      domain: "d1",
      lesson: "d1-architecture",
      prompt: "On a cloud cluster, which component provisions the cloud provider's load balancer when someone creates a Service of type LoadBalancer?",
      options: ["cloud-controller-manager", "kube-scheduler", "kubelet", "CoreDNS"],
      answer: [0],
      explanation: "The cloud-controller-manager holds cloud-specific controllers, including the service controller that creates and updates load balancers.",
    },
    {
      id: "d1-08",
      domain: "d1",
      lesson: "d1-architecture",
      prompt: "Which components run on worker nodes in a typical Kubernetes cluster? (Choose three.)",
      options: ["kubelet", "kube-proxy", "A container runtime such as containerd", "etcd", "kube-scheduler", "kube-controller-manager"],
      answer: [0, 1, 2],
      explanation: "Worker nodes run the kubelet, a container runtime, and usually kube-proxy. etcd, the scheduler, and the controller manager are control plane components.",
    },
    {
      id: "d1-09",
      domain: "d1",
      lesson: "d1-architecture",
      type: "match",
      prompt: "Match each component to its job.",
      pairs: [
        ["kube-apiserver", "Validates and serves every API request"],
        ["etcd", "Stores cluster state"],
        ["kube-scheduler", "Assigns Pods to nodes"],
        ["kubelet", "Runs Pods on its node"],
        ["kube-proxy", "Programs Service networking rules"],
      ],
      explanation: "The API server is the front door, etcd the memory, the scheduler the placement brain, the kubelet the node agent, and kube-proxy the Service plumbing.",
    },
    {
      id: "d1-10",
      domain: "d1",
      lesson: "d1-architecture",
      type: "order",
      prompt: "Put the steps in order, from `kubectl apply` of a new Deployment to a running container.",
      items: [
        "The API server authenticates, authorizes, and stores the Deployment",
        "Controllers create a ReplicaSet and then Pod objects",
        "The scheduler binds each Pod to a node",
        "The kubelet on that node asks the container runtime to start the containers",
      ],
      explanation: "Everything flows through the API server: controllers turn the Deployment into Pods, the scheduler picks nodes, and kubelets make it real.",
    },

    // ── API and kubectl ──
    {
      id: "d1-11",
      domain: "d1",
      lesson: "d1-api",
      prompt: "In a Kubernetes object, which field holds the state the user wants, as opposed to the state Kubernetes observes?",
      options: ["spec", "status", "metadata", "kind"],
      answer: [0],
      explanation: "You write spec (desired state). Kubernetes controllers write status (observed state) and work to make status match spec.",
    },
    {
      id: "d1-12",
      domain: "d1",
      lesson: "d1-api",
      prompt: "A team wants a new kind, `Database`, that they can create with kubectl like any built-in object, with a controller that provisions real databases from it. What should they use?",
      options: ["A CustomResourceDefinition with a custom controller (an operator)", "A ConfigMap per database", "A DaemonSet", "An annotation on every Pod"],
      answer: [0],
      explanation: "A CRD extends the Kubernetes API with a new resource type; an operator is the controller that reconciles those resources into real infrastructure.",
    },
    {
      id: "d1-13",
      domain: "d1",
      lesson: "d1-api",
      prompt: "Which command creates or updates resources from manifest files and is the usual choice for a declarative workflow?",
      options: ["`kubectl apply -f manifests/`", "`kubectl run`", "`kubectl create deployment`", "`kubectl edit`"],
      answer: [0],
      explanation: "kubectl apply compares the files with the live objects and creates or patches them. run and create are imperative; edit changes the live object by hand.",
    },
    {
      id: "d1-14",
      domain: "d1",
      lesson: "d1-api",
      prompt: "A developer can't remember which fields a Deployment's rolling update strategy accepts. Which command shows the documentation from the cluster's own API?",
      options: ["`kubectl explain deployment.spec.strategy`", "`kubectl describe deployment`", "`kubectl get deployment -o wide`", "`kubectl logs deployment`"],
      answer: [0],
      explanation: "kubectl explain prints field documentation from the API schema. describe shows a live object and its events.",
    },
    {
      id: "d1-15",
      domain: "d1",
      lesson: "d1-api",
      prompt: "Which command lists every resource type the cluster serves, with short names and whether each is namespaced?",
      options: ["`kubectl api-resources`", "`kubectl get all`", "`kubectl cluster-info`", "`kubectl version`"],
      answer: [0],
      explanation: "api-resources lists every kind, including custom resources, with its API group, short name (such as deploy or svc), and scope.",
    },
    {
      id: "d1-16",
      domain: "d1",
      lesson: "d1-api",
      prompt: "Which statements describe the Kubernetes declarative model? (Choose two.)",
      options: [
        "Users record the desired state in API objects",
        "Controllers continuously reconcile the actual state toward the desired state",
        "Each kubectl command runs a script once and then forgets it",
        "Users edit the status field to tell Kubernetes what to do",
        "Desired state is stored only in the kubeconfig file",
      ],
      answer: [0, 1],
      explanation: "Kubernetes stores intent in objects and runs control loops that keep driving reality toward it. status is written by Kubernetes, not users.",
    },
    {
      id: "d1-17",
      domain: "d1",
      lesson: "d1-api",
      prompt: "A developer wants a starter Deployment manifest without creating anything in the cluster. Which command produces one?",
      options: [
        "`kubectl create deployment web --image=nginx --dry-run=client -o yaml`",
        "`kubectl get deployment web -o yaml --watch`",
        "`kubectl apply -f web.yaml --force`",
        "`kubectl describe deployment web`",
      ],
      answer: [0],
      explanation: "--dry-run=client builds the object locally without sending it, and -o yaml prints it so it can be saved and edited.",
    },
    {
      id: "d1-18",
      domain: "d1",
      lesson: "d1-api",
      type: "lines",
      prompt: "This manifest is rejected by the API server. Tap the line that causes it.",
      code: `apiVersion: apps/v1
kind: Pod
metadata:
  name: hello
spec:
  containers:
  - name: hello
    image: nginx:1.27`,
      codeLang: "yaml",
      answer: [1],
      explanation: "Pods are core objects served at apiVersion v1. apps/v1 serves Deployments, ReplicaSets, StatefulSets, and DaemonSets, but not Pods. Line 1 is what has to change.",
    },
    {
      id: "d1-19",
      domain: "d1",
      lesson: "d1-api",
      prompt: "What is an operator in Kubernetes?",
      options: [
        "A controller that uses custom resources to automate running a specific application, such as backups and failover for a database",
        "A person with cluster-admin rights",
        "A kubectl plugin that formats output",
        "The process that starts containers on a node",
      ],
      answer: [0],
      explanation: "The operator pattern encodes human operational knowledge in a controller that watches custom resources and acts on them.",
    },

    // ── Workloads ──
    {
      id: "d1-21",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "What is the smallest deployable unit of computing that you can create and manage in Kubernetes?",
      options: ["Pod", "Container", "Node", "Deployment"],
      answer: [0],
      explanation: "Kubernetes schedules Pods, not individual containers. A Pod wraps one or more containers that share networking and storage.",
    },
    {
      id: "d1-22",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "A log-shipping agent must run exactly one copy on every node, including nodes added later. Which workload resource fits best?",
      options: ["DaemonSet", "Deployment with replicas equal to the node count", "StatefulSet", "CronJob"],
      answer: [0],
      explanation: "A DaemonSet runs one Pod per eligible node and automatically adds Pods to new nodes.",
    },
    {
      id: "d1-23",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "A database cluster needs each replica to keep a stable name (db-0, db-1, db-2) and its own persistent volume across restarts. Which resource should be used?",
      options: ["StatefulSet", "Deployment", "DaemonSet", "ReplicaSet"],
      answer: [0],
      explanation: "StatefulSets give Pods stable ordinal names, ordered rollout, and a PersistentVolumeClaim per Pod from volumeClaimTemplates.",
    },
    {
      id: "d1-24",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "Two containers in the same Pod need to communicate. What is the simplest way?",
      options: ["Over localhost, because containers in a Pod share one network namespace", "Through a NodePort Service", "Only through a shared ConfigMap", "They can't; containers must be in separate Pods to talk"],
      answer: [0],
      explanation: "All containers in a Pod share the Pod's IP address and ports, so they reach each other on localhost.",
    },
    {
      id: "d1-25",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "A nightly report must run at 02:00, finish, and not run again until the next night. Which resource fits?",
      options: ["CronJob", "DaemonSet", "Deployment", "StatefulSet"],
      answer: [0],
      explanation: "A CronJob creates a Job on a cron schedule; the Job runs Pods to completion with retries.",
    },
    {
      id: "d1-26",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "What does a Deployment manage directly to keep the requested number of Pods running?",
      options: ["A ReplicaSet", "A StatefulSet", "A DaemonSet", "A Service"],
      answer: [0],
      explanation: "A Deployment owns ReplicaSets. Each rollout creates a new ReplicaSet, and the Deployment scales the old one down and the new one up.",
    },
    {
      id: "d1-27",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "A Pod must wait until a database migration script has finished before the app container starts. What should the developer add to the Pod?",
      options: ["An init container that runs the migration", "A second app container with the migration", "A liveness probe", "A PodDisruptionBudget"],
      answer: [0],
      explanation: "Init containers run one after another to completion before any app container starts.",
    },
    {
      id: "d1-28",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "Why should applications usually be run through a controller such as a Deployment instead of as bare Pods? (Choose two.)",
      options: [
        "A controller replaces Pods that fail or are lost with their node",
        "A controller handles rolling updates and rollbacks",
        "Bare Pods can't have more than one container",
        "Bare Pods can't receive an IP address",
        "Controllers make Pods immune to OOM kills",
      ],
      answer: [0, 1],
      explanation: "Bare Pods are not recreated when they die or their node fails. Controllers self-heal, scale, and roll out new versions.",
    },
    {
      id: "d1-29",
      domain: "d1",
      lesson: "d1-workloads",
      type: "match",
      prompt: "Match each workload to the job it suits best.",
      pairs: [
        ["Deployment", "Stateless web front end"],
        ["StatefulSet", "Replicated database with per-replica storage"],
        ["DaemonSet", "Node monitoring agent"],
        ["Job", "One-off data migration"],
        ["CronJob", "Hourly cleanup task"],
      ],
      explanation: "Pick the controller by lifecycle: long-running stateless, long-running stateful, per node, run once, or run on a schedule.",
    },
    {
      id: "d1-30",
      domain: "d1",
      lesson: "d1-workloads",
      type: "lines",
      prompt: "The API server rejects this Deployment because its selector doesn't match its Pod template. The selector (line 7) is correct. Tap the line to fix.",
      code: `apiVersion: apps/v1
kind: Deployment
metadata:
  name: web
spec:
  selector:
    matchLabels: { app: web }
  template:
    metadata:
      labels: { app: frontend }
    spec:
      containers:
      - name: web
        image: nginx:1.27`,
      codeLang: "yaml",
      answer: [10],
      explanation: "A Deployment's selector must match its template's labels, or the API server rejects it. The template label app: frontend on line 10 should be app: web.",
    },

    // ── Namespaces, labels, config ──
    {
      id: "d1-31",
      domain: "d1",
      lesson: "d1-config",
      prompt: "Two teams share one cluster and both want a Deployment named `api`. How can they do this without a name conflict?",
      options: ["Put each team's resources in its own namespace", "Use different labels on each Deployment", "Run two kube-schedulers", "Add an annotation with the team name"],
      answer: [0],
      explanation: "Names must be unique within a namespace, not across the cluster. Namespaces also scope RBAC and ResourceQuotas per team.",
    },
    {
      id: "d1-32",
      domain: "d1",
      lesson: "d1-config",
      prompt: "A team stores a database password in a Kubernetes Secret. Which statement about the default behaviour is correct?",
      options: [
        "The value is base64-encoded, not encrypted; access should be restricted with RBAC and encryption at rest enabled",
        "The value is encrypted with a key unique to each Pod",
        "Secrets can be read only by the kubelet, never through the API",
        "Secrets are automatically rotated every 24 hours",
      ],
      answer: [0],
      explanation: "base64 is an encoding, not protection. Cluster operators enable encryption at rest for etcd and limit who can read Secrets.",
    },
    {
      id: "d1-33",
      domain: "d1",
      lesson: "d1-config",
      prompt: "How does a Service know which Pods to send traffic to?",
      options: ["Its label selector matches labels on the Pods", "It lists Pod names in an annotation", "It routes to every Pod in the namespace", "The scheduler tells it at Pod creation"],
      answer: [0],
      explanation: "Services, ReplicaSets, and many other objects find their Pods with label selectors such as app=web.",
    },
    {
      id: "d1-34",
      domain: "d1",
      lesson: "d1-config",
      prompt: "Which namespaces exist in a newly created Kubernetes cluster? (Choose two.)",
      options: ["kube-system", "default", "kube-apps", "cluster-admin", "kube-storage"],
      answer: [0, 1],
      explanation: "A new cluster starts with default, kube-system (system components such as CoreDNS), kube-public, and kube-node-lease. The other names are made up.",
    },
    {
      id: "d1-35",
      domain: "d1",
      lesson: "d1-config",
      prompt: "A team wants to change an app's log level for each environment without rebuilding the image. Where should the setting live?",
      options: ["In a ConfigMap consumed as an environment variable or mounted file", "Hard-coded in the Dockerfile", "In the Pod's status field", "In a node label"],
      answer: [0],
      explanation: "ConfigMaps decouple configuration from images, so the same image runs in every environment with different settings.",
    },
    {
      id: "d1-36",
      domain: "d1",
      lesson: "d1-config",
      prompt: "Which of these resources are cluster-scoped rather than namespaced? (Choose two.)",
      options: ["Node", "PersistentVolume", "Deployment", "ConfigMap", "Service"],
      answer: [0, 1],
      explanation: "Nodes, PersistentVolumes, Namespaces, StorageClasses, and ClusterRoles are cluster-wide. Deployments, ConfigMaps, and Services live in a namespace.",
    },
    {
      id: "d1-37",
      domain: "d1",
      lesson: "d1-config",
      prompt: "What is the difference between labels and annotations?",
      options: [
        "Labels identify and can be selected on; annotations hold non-identifying metadata for tools and people",
        "Annotations are selectable; labels are free text",
        "Labels can only be set on Nodes",
        "There is no difference; they are aliases",
      ],
      answer: [0],
      explanation: "Selectors work only on labels. Annotations carry extra information such as build IDs, contact details, or tool configuration.",
    },
    {
      id: "d1-38",
      domain: "d1",
      lesson: "d1-config",
      prompt: "Which command lists the Pods labeled `app=web` in every namespace?",
      options: ["`kubectl get pods -l app=web -A`", "`kubectl get pods --name=web`", "`kubectl describe namespace web`", "`kubectl logs -l web`"],
      answer: [0],
      explanation: "-l (or --selector) filters by label, and -A (--all-namespaces) searches every namespace.",
    },

    // ── Administration ──
    {
      id: "d1-41",
      domain: "d1",
      lesson: "d1-admin",
      prompt: "An administrator must patch a worker node's OS. Which sequence keeps workloads running elsewhere during the work?",
      options: [
        "`kubectl cordon`, then `kubectl drain`, do the work, then `kubectl uncordon`",
        "`kubectl delete node`, do the work, then reboot",
        "Restart the kubelet while Pods are running",
        "`kubectl scale` every Deployment to zero",
      ],
      answer: [0],
      explanation: "Cordoning stops new Pods; draining evicts existing ones (respecting PodDisruptionBudgets) so controllers recreate them elsewhere; uncordon brings the node back.",
    },
    {
      id: "d1-42",
      domain: "d1",
      lesson: "d1-admin",
      prompt: "A developer works with a staging and a production cluster from one laptop. What does kubectl use to know which cluster, user, and default namespace to talk to?",
      options: ["The current context in the kubeconfig file", "The KUBERNETES_SERVICE_HOST variable on the laptop", "A label on the Namespace", "etcd on the laptop"],
      answer: [0],
      explanation: "A kubeconfig context ties a cluster, a user, and optionally a namespace together; kubectl config use-context switches between them.",
    },
    {
      id: "d1-43",
      domain: "d1",
      lesson: "d1-admin",
      prompt: "In which order should a cluster be upgraded to a new Kubernetes minor version?",
      options: ["Control plane first, then the worker nodes' kubelets", "Worker nodes first, then the control plane", "All components at the same moment", "Only etcd; the rest updates itself"],
      answer: [0],
      explanation: "A kubelet must never be newer than the API server, so the control plane is upgraded first and nodes follow.",
    },
    {
      id: "d1-44",
      domain: "d1",
      lesson: "d1-admin",
      prompt: "A platform team wants to cap the total CPU and memory that the `team-a` namespace can request. Which object should they create?",
      options: ["ResourceQuota", "LimitRange", "PodDisruptionBudget", "PriorityClass"],
      answer: [0],
      explanation: "A ResourceQuota limits aggregate usage in a namespace. A LimitRange sets per-container defaults and bounds.",
    },
    {
      id: "d1-45",
      domain: "d1",
      lesson: "d1-admin",
      prompt: "During node drains, at least 2 of an app's 3 replicas must always stay up. What should the team define?",
      options: ["A PodDisruptionBudget with minAvailable: 2", "A ResourceQuota of 2 Pods", "A taint with NoExecute", "A readiness probe"],
      answer: [0],
      explanation: "PodDisruptionBudgets limit voluntary disruptions such as drains; the eviction API refuses evictions that would break the budget.",
    },
    {
      id: "d1-46",
      domain: "d1",
      lesson: "d1-admin",
      prompt: "Which tool from the Kubernetes project bootstraps a minimum viable, conformant cluster with `init` and `join` commands?",
      options: ["kubeadm", "kubectl", "Helm", "kube-proxy"],
      answer: [0],
      explanation: "kubeadm init sets up a control plane and kubeadm join adds nodes. It also performs version upgrades with kubeadm upgrade.",
    },
    {
      id: "d1-47",
      domain: "d1",
      lesson: "d1-admin",
      type: "order",
      prompt: "Order the steps for safely taking a worker node out for maintenance and bringing it back.",
      items: ["Cordon the node", "Drain the node", "Perform the maintenance", "Uncordon the node"],
      explanation: "Stop new scheduling, move existing Pods away, do the work, then make the node schedulable again.",
    },

    // ── Scheduling ──
    {
      id: "d1-51",
      domain: "d1",
      lesson: "d1-scheduling",
      prompt: "A node has the taint `gpu=true:NoSchedule`. A Pod has a matching toleration but no nodeSelector or affinity. What happens when it is scheduled?",
      options: [
        "It may be placed on the GPU node or on any other suitable node",
        "It is always placed on the GPU node",
        "It is rejected by the API server",
        "It evicts the Pods already on the GPU node",
      ],
      answer: [0],
      explanation: "A toleration only permits the Pod onto the tainted node. To make it land there, add a nodeSelector or node affinity for the GPU node's label.",
    },
    {
      id: "d1-52",
      domain: "d1",
      lesson: "d1-scheduling",
      prompt: "What does the scheduler use to decide whether a Pod fits on a node's CPU and memory?",
      options: ["The Pod's resource requests", "The Pod's resource limits", "The node's current real-time usage only", "The container image size"],
      answer: [0],
      explanation: "Scheduling is based on requests: the sum of requests on a node can't exceed its allocatable capacity. Limits are enforced later at runtime.",
    },
    {
      id: "d1-53",
      domain: "d1",
      lesson: "d1-scheduling",
      prompt: "A container keeps getting restarted with the reason OOMKilled. What is happening?",
      options: [
        "It used more memory than its memory limit, so it was killed",
        "It used more CPU than its CPU limit",
        "Its readiness probe failed",
        "The image couldn't be pulled",
      ],
      answer: [0],
      explanation: "Memory can't be throttled, so exceeding the memory limit gets the container killed. Exceeding the CPU limit only throttles it.",
    },
    {
      id: "d1-54",
      domain: "d1",
      lesson: "d1-scheduling",
      prompt: "Every container in a Pod sets CPU and memory requests equal to its limits. Which QoS class does the Pod get?",
      options: ["Guaranteed", "Burstable", "BestEffort", "Critical"],
      answer: [0],
      explanation: "Requests equal to limits for CPU and memory in every container gives Guaranteed, the last class to be evicted under node pressure.",
    },
    {
      id: "d1-55",
      domain: "d1",
      lesson: "d1-scheduling",
      prompt: "Which taint effect also evicts already-running Pods that don't tolerate it?",
      options: ["NoExecute", "NoSchedule", "PreferNoSchedule", "NoAdmit"],
      answer: [0],
      explanation: "NoExecute keeps new Pods off and evicts existing Pods without a matching toleration (optionally after tolerationSeconds).",
    },
    {
      id: "d1-56",
      domain: "d1",
      lesson: "d1-scheduling",
      prompt: "Three replicas of a web app must not all run on the same node, so one node failure can't take them all down. What should the developer use?",
      options: ["Pod anti-affinity (or topology spread constraints) on the node hostname", "A toleration for every taint", "A nodeSelector for one node", "A higher PriorityClass"],
      answer: [0],
      explanation: "Anti-affinity and topology spread constraints spread replicas across nodes or zones.",
    },
    {
      id: "d1-57",
      domain: "d1",
      lesson: "d1-scheduling",
      prompt: "Which settings can make the scheduler place a Pod only on nodes labeled `disktype=ssd`? (Choose two.)",
      options: ["A nodeSelector of disktype: ssd", "A required node affinity rule on disktype In [ssd]", "A toleration for disktype=ssd", "A PodDisruptionBudget", "An annotation disktype=ssd on the Pod"],
      answer: [0, 1],
      explanation: "nodeSelector and required node affinity attract Pods to labeled nodes. Tolerations only relate to taints, and annotations aren't used for scheduling.",
    },
    {
      id: "d1-58",
      domain: "d1",
      lesson: "d1-scheduling",
      type: "lines",
      prompt: "The API server rejects this Pod. Tap the line that causes it.",
      code: `spec:
  containers:
  - name: api
    image: example/api:2.1
    resources:
      requests:
        cpu: 500m
        memory: 256Mi
      limits:
        cpu: 250m
        memory: 512Mi`,
      codeLang: "yaml",
      answer: [10],
      explanation: "A limit can't be lower than its request. The CPU limit of 250m (line 10) is below the 500m request, so validation fails.",
    },
    {
      id: "d1-59",
      domain: "d1",
      lesson: "d1-scheduling",
      type: "lines",
      prompt: "The GPU node is tainted `gpu=true:NoSchedule`, yet this Pod stays Pending with \"untolerated taint\". Tap the line that breaks the toleration.",
      code: `spec:
  nodeSelector:
    gpu: "true"
  tolerations:
  - key: gpu
    operator: Equal
    value: "true"
    effect: NoExecute
  containers:
  - name: trainer
    image: example/trainer:1.0`,
      codeLang: "yaml",
      answer: [8],
      explanation: "A toleration must match the taint's key, value, and effect. effect: NoExecute doesn't tolerate a NoSchedule taint; it should be NoSchedule (or omitted to match every effect).",
    },
    {
      id: "d1-60",
      domain: "d1",
      lesson: "d1-scheduling",
      prompt: "A Pod stays Pending and its events say `0/3 nodes are available: 3 Insufficient cpu`. What is the most direct fix?",
      options: ["Lower the Pod's CPU request or add node capacity", "Raise the Pod's CPU limit", "Add a liveness probe", "Delete the Pod's Service"],
      answer: [0],
      explanation: "No node has enough unrequested CPU for the Pod's request. Reduce the request, free capacity, or add nodes (for example with a cluster autoscaler).",
    },

    // ── Containers ──
    {
      id: "d1-61",
      domain: "d1",
      lesson: "d1-containers",
      prompt: "Which interface does the kubelet use to talk to container runtimes such as containerd and CRI-O?",
      options: ["Container Runtime Interface (CRI)", "Container Network Interface (CNI)", "Container Storage Interface (CSI)", "Open Container Initiative (OCI) distribution spec"],
      answer: [0],
      explanation: "CRI is the gRPC API between the kubelet and the runtime. CNI is for networking, CSI for storage, OCI for image and runtime formats.",
    },
    {
      id: "d1-62",
      domain: "d1",
      lesson: "d1-containers",
      prompt: "How do containers differ from virtual machines?",
      options: [
        "Containers share the host's kernel and are isolated with namespaces and cgroups; each VM runs its own guest kernel",
        "Containers each run their own kernel; VMs share the host kernel",
        "Containers can only run on Kubernetes",
        "Containers always provide stronger isolation than VMs",
      ],
      answer: [0],
      explanation: "Sharing the kernel makes containers light and fast to start; VMs virtualize hardware and boot a full OS.",
    },
    {
      id: "d1-63",
      domain: "d1",
      lesson: "d1-containers",
      prompt: "Which Linux kernel feature limits how much CPU and memory a container can use?",
      options: ["cgroups", "namespaces", "chroot", "SELinux labels"],
      answer: [0],
      explanation: "Control groups (cgroups) account for and limit resources. Namespaces isolate what a process can see (PIDs, network, mounts).",
    },
    {
      id: "d1-64",
      domain: "d1",
      lesson: "d1-containers",
      prompt: "A team needs production to run exactly the image that passed testing, even if someone re-pushes the same tag later. How should the image be referenced?",
      options: ["By its digest, for example `myapp@sha256:…`", "By the :latest tag", "By the image name only", "By the registry hostname"],
      answer: [0],
      explanation: "Tags are mutable pointers. A digest identifies the exact image content and never changes.",
    },
    {
      id: "d1-65",
      domain: "d1",
      lesson: "d1-containers",
      prompt: "Kubernetes removed dockershim in v1.24. What does that mean for images built with Docker?",
      options: [
        "They still run, because Docker builds standard OCI images that containerd and CRI-O can run",
        "They must be rebuilt with a Kubernetes-specific tool",
        "They can run only on Windows nodes",
        "They must be converted into virtual machine images",
      ],
      answer: [0],
      explanation: "Removing dockershim changed which runtime the kubelet talks to, not the image format. OCI images work on any compliant runtime.",
    },
    {
      id: "d1-66",
      domain: "d1",
      lesson: "d1-containers",
      prompt: "Which practices produce smaller, safer container images? (Choose two.)",
      options: [
        "Use a multi-stage build so the final image holds only runtime artifacts",
        "Start from a minimal base image and run as a non-root user",
        "Bake secrets into the image so Pods start faster",
        "Install compilers and debugging tools in the production image",
        "Always deploy the :latest tag",
      ],
      answer: [0, 1],
      explanation: "Multi-stage builds and minimal bases shrink the image and its attack surface; non-root reduces the impact of a compromise. Secrets never belong in images.",
    },
    {
      id: "d1-67",
      domain: "d1",
      lesson: "d1-containers",
      type: "match",
      prompt: "Match each piece of the container stack to what it is.",
      pairs: [
        ["containerd", "High-level runtime that implements CRI"],
        ["runc", "Low-level OCI runtime that creates the container process"],
        ["OCI image spec", "Standard format for container images"],
        ["Container registry", "Stores and serves images"],
      ],
      explanation: "The kubelet calls a CRI runtime (containerd or CRI-O), which uses an OCI runtime (runc) to start processes from OCI images pulled from a registry.",
    },
    {
      id: "d1-68",
      domain: "d1",
      lesson: "d1-containers",
      prompt: "A security team wants untrusted workloads to run with stronger isolation than a standard shared-kernel container. Which kind of runtime addresses this?",
      options: ["A sandboxed runtime such as gVisor or Kata Containers", "A bigger CPU limit", "A ConfigMap", "Running the container as root"],
      answer: [0],
      explanation: "Sandboxed runtimes add a user-space kernel (gVisor) or a lightweight VM (Kata Containers) between the workload and the host kernel. Kubernetes selects them with a RuntimeClass.",
    },
    {
      id: "d1-69",
      domain: "d1",
      lesson: "d1-scheduling",
      prompt: "A node is running low on memory and the kubelet starts evicting Pods. Which statements are correct? (Choose two.)",
      options: [
        "BestEffort Pods, which set no requests or limits, are evicted first",
        "Guaranteed Pods are the last to be evicted",
        "Pods with the most labels are evicted first",
        "Pods in the kube-system namespace are always evicted first",
        "Eviction order is random",
      ],
      answer: [0, 1],
      explanation: "Under node pressure the kubelet evicts BestEffort first, then Burstable Pods using more than their requests; Guaranteed Pods go last.",
    },
    {
      id: "d1-70",
      domain: "d1",
      lesson: "d1-admin",
      prompt: "Roughly how many Kubernetes minor releases are published per year?",
      options: ["About three", "One", "Twelve", "About six"],
      answer: [0],
      explanation: "Kubernetes ships about three minor releases a year, and the three most recent minor versions receive patch releases.",
    },
    {
      id: "d1-71",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "A Deployment named `web` should run 5 replicas instead of 3. Which imperative command does this?",
      options: ["`kubectl scale deployment web --replicas=5`", "`kubectl rollout restart deployment web`", "`kubectl expose deployment web --port=5`", "`kubectl set image deployment web web=5`"],
      answer: [0],
      explanation: "kubectl scale changes the replica count. In a declarative workflow you would change replicas in the manifest and apply it.",
    },
  ],

  cards: [
    { id: "k-apiserver", domain: "d1", kind: "service", term: "kube-apiserver", definition: "Front door of the control plane; the only component that talks to etcd" },
    { id: "k-etcd", domain: "d1", kind: "service", term: "etcd", definition: "Consistent key-value store holding all cluster state (Raft consensus)" },
    { id: "k-scheduler", domain: "d1", kind: "service", term: "kube-scheduler", definition: "Filters and scores nodes, then binds each new Pod to one" },
    { id: "k-cm", domain: "d1", kind: "service", term: "kube-controller-manager", definition: "Runs the built-in reconciliation loops (Deployment, Node, Job, …)" },
    { id: "k-ccm", domain: "d1", kind: "service", term: "cloud-controller-manager", definition: "Cloud-specific loops: nodes, routes, and load balancers" },
    { id: "k-kubelet", domain: "d1", kind: "service", term: "kubelet", definition: "Node agent that runs Pods through the container runtime and reports status" },
    { id: "k-kubeproxy", domain: "d1", kind: "service", term: "kube-proxy", definition: "Programs node rules so Service virtual IPs reach Pods" },
    { id: "k-containerd", domain: "d1", kind: "service", term: "containerd", definition: "CNCF graduated container runtime that implements CRI" },
    { id: "k-crio", domain: "d1", kind: "service", term: "CRI-O", definition: "Lightweight runtime built specifically for the Kubernetes CRI" },
    { id: "k-kubeadm", domain: "d1", kind: "service", term: "kubeadm", definition: "Bootstraps and upgrades clusters with init, join, and upgrade" },
    { id: "k-kubectl", domain: "d1", kind: "service", term: "kubectl", definition: "Command-line client for the Kubernetes API" },
    { id: "c-pod", domain: "d1", kind: "concept", term: "Pod", definition: "Smallest deployable unit: containers sharing an IP and volumes" },
    { id: "c-deployment", domain: "d1", kind: "concept", term: "Deployment", definition: "Manages ReplicaSets for stateless apps: scaling, rolling updates, rollbacks" },
    { id: "c-statefulset", domain: "d1", kind: "concept", term: "StatefulSet", definition: "Stable Pod names, ordered rollout, and a volume per replica" },
    { id: "c-daemonset", domain: "d1", kind: "concept", term: "DaemonSet", definition: "One Pod on every matching node" },
    { id: "c-job", domain: "d1", kind: "concept", term: "Job / CronJob", definition: "Run Pods to completion; CronJob does it on a schedule" },
    { id: "c-namespace", domain: "d1", kind: "concept", term: "Namespace", definition: "Virtual cluster that scopes names, RBAC, and quotas" },
    { id: "c-crd", domain: "d1", kind: "concept", term: "CustomResourceDefinition", definition: "Adds a new resource kind to the Kubernetes API" },
    { id: "c-operator", domain: "d1", kind: "concept", term: "Operator", definition: "Controller plus custom resources that automate running an app" },
    { id: "c-taint", domain: "d1", kind: "concept", term: "Taint / toleration", definition: "Taints repel Pods from nodes; tolerations allow Pods onto them" },
    { id: "c-qos", domain: "d1", kind: "concept", term: "QoS classes", definition: "Guaranteed, Burstable, BestEffort: decide eviction order" },
    { id: "c-pdb", domain: "d1", kind: "concept", term: "PodDisruptionBudget", definition: "Limits how many replicas voluntary disruptions can take down" },
    { id: "c-cri", domain: "d1", kind: "concept", term: "CRI", definition: "gRPC interface between the kubelet and container runtimes" },
    { id: "c-cgroups", domain: "d1", kind: "concept", term: "cgroups vs namespaces", definition: "cgroups limit resources; namespaces isolate what a process sees" },
  ],

  challenges: [
    {
      id: "ch-place-pods",
      domain: "d1",
      lesson: "d1-scheduling",
      title: "Place the Pods",
      goal: "Get ml-trainer onto node-gpu, postgres onto node-ssd, and web onto a normal node, with nothing left Pending.",
      hint: "A toleration only lets a Pod onto a tainted node. Something else has to pull it there.",
      takeaway: "Taints repel, tolerations permit, and nodeSelector or node affinity attract. Dedicated nodes usually need both a taint and a label.",
      render: (onSolved) => <SchedulingLab goal="place" onSolved={onSolved} />,
    },
  ],
});
