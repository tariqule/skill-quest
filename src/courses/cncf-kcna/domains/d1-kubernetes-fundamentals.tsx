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
    summary: "What a Kubernetes cluster is made of and how you work with it: the control plane and nodes, the API and kubectl, Pods and workloads, namespaces and labels, admin tasks, scheduling and containers.",
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
    // ── Start here ──
    {
      id: "d1-b-containers",
      level: "beginner",
      task: "1.4",
      title: "Start here: what a container is",
      check: ["kcna-b1-01", "kcna-b1-02"],
      visual: (
        <Flow
          color="#326ce5"
          steps={[
            { icon: "🧾", label: "Your app", sub: "Code plus everything it needs" },
            { icon: "📦", label: "Container image", sub: "Packed into one portable bundle" },
            { icon: "💻", label: "Any machine", sub: "Runs the same way everywhere" },
          ]}
        />
      ),
      points: [
        "Think of a shipping container. It holds anything, and every ship, train and truck knows how to carry it without opening it.",
        "A software **container** works the same way. It packs your app together with everything it needs to run, like libraries and settings.",
        "The packed bundle is called an **image**. When you start an image, the running copy is a container.",
        "This solves the classic \"it works on my machine\" problem. The same image runs the same way on your laptop and on a server.",
      ],
      tip: "Image is the recipe card. Container is the dish you cooked from it. You can cook many dishes from one card.",
    },
    {
      id: "d1-b-kubernetes",
      level: "beginner",
      task: "1.1",
      title: "Start here: what Kubernetes does",
      check: ["kcna-b1-03", "kcna-b1-04"],
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "📋", title: "You describe", text: "\"I want three copies of my web app running.\"", color: "#326ce5" },
            { icon: "🧠", title: "Kubernetes decides", text: "It picks which machines run each copy.", color: "#326ce5" },
            { icon: "🔁", title: "It keeps watch", text: "If a copy crashes, it starts a new one for you.", color: "#326ce5" },
          ]}
        />
      ),
      points: [
        "Picture a busy restaurant kitchen. The head chef doesn't cook every dish. They decide which cook makes what, and step in when someone falls behind.",
        "**Kubernetes** is that head chef for containers. You tell it what you want running, and it places the containers on machines and keeps them going.",
        "The group of machines Kubernetes manages is called a **cluster**. Each machine in it is a **node**.",
        "Kubernetes runs containers inside a small wrapper called a **Pod**. Most Pods hold just one container.",
      ],
      tip: "You'll often see Kubernetes shortened to K8s. The 8 stands for the eight letters between the K and the s.",
    },
    {
      id: "d1-b-kubectl",
      level: "beginner",
      task: "1.2",
      title: "Start here: talking to a cluster with kubectl",
      check: ["kcna-b1-05", "kcna-b1-06"],
      visual: (
        <CodeBlock
          lang="sh"
          caption="Your first commands: list what's running, then look closer at one Pod."
          code={`kubectl get pods
kubectl get nodes
kubectl describe pod web-7d4b9`}
        />
      ),
      points: [
        "You talk to a cluster through a command-line tool called **kubectl** (people say \"cube control\" or \"cube cuttle\").",
        "Most commands follow the same pattern: kubectl, then a verb, then the kind of thing. For example, `kubectl get pods` lists your Pods.",
        "`kubectl describe` gives you the full story about one thing, including recent events. It's the first place to look when something seems wrong.",
        "You can also write what you want in a YAML file and send it with `kubectl apply -f`. That file is called a **manifest**.",
      ],
      tip: "Lost? `kubectl get` shows a list, `kubectl describe` shows details, and `kubectl logs` shows what a container printed.",
    },

    {
      id: "d1-architecture",
      task: "1.1",
      title: "Cluster architecture: control plane and nodes",
      check: ["d1-01", "d1-02"],
      visual: <ClusterMap />,
      points: [
        "The **control plane** makes the decisions. It's made of kube-apiserver (the only way in), etcd (where state is stored), kube-scheduler (picks where Pods run) and kube-controller-manager (runs the control loops).",
        "Some clusters also run a cloud-controller-manager, which talks to the cloud provider.",
        "Every node runs a **kubelet** (the node agent) and a container runtime such as containerd or CRI-O. Most also run kube-proxy, which sets up Service networking.",
        "Other components never talk to etcd directly. They watch and update objects through the API server, and the API server saves them.",
        "etcd uses Raft consensus. An odd number of members, like 3 or 5, lets it survive failures and still keep a majority (a quorum).",
      ],
      tip: "Which component decides where a Pod runs? kube-scheduler. Which one actually starts the containers? The kubelet, through the container runtime.",
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
            caption="Every object has the same shape. apiVersion and kind say what it is, metadata names it, spec is what you want, and status is what Kubernetes sees."
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
            loop="Controllers keep comparing what you asked for with what's really there, and act on any difference"
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
        "Kubernetes is **declarative**. You store the state you want in objects, and controllers keep nudging the real world toward it.",
        "Core objects such as Pod, Service, ConfigMap and Namespace use apiVersion v1. Workloads such as Deployment use apps/v1.",
        "`kubectl apply` is declarative: it creates or updates objects from files. `kubectl create`, `run` and `scale` are imperative commands that do one thing right now.",
        "`kubectl explain <kind>.<field>` documents a field. `kubectl api-resources` lists every kind, its short name, and whether it lives in a namespace.",
        "A **CustomResourceDefinition** (CRD) adds a new kind to the API. An **operator** pairs a CRD with a controller that knows how to run a particular app.",
      ],
      tip: "spec is what you asked for. status is what's actually true. You never write status yourself.",
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
              { icon: "📦", label: "Pods", sub: "Disposable and replaceable" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧬", title: "StatefulSet", text: "Stable names (db-0, db-1), ordered startup, and a PersistentVolumeClaim for each Pod. Used with a headless Service.", color: "#326ce5" },
              { icon: "🛰️", title: "DaemonSet", text: "One Pod on every node (or every matching node). Think log shippers, monitoring agents and CNI plugins.", color: "#326ce5" },
              { icon: "🏁", title: "Job and CronJob", text: "Run until finished, with retries. A CronJob creates Jobs on a schedule.", color: "#326ce5" },
            ]}
          />
        </div>
      ),
      points: [
        "A **Pod** is the smallest thing you can deploy. It holds one or more containers that share one IP address and can share volumes. Containers in a Pod talk over localhost.",
        "Pods are short-lived. Don't create bare Pods for your apps. Use a controller, which recreates Pods when they fail or a node dies.",
        "**Init containers** run to completion before the app containers start. A **sidecar** is a helper container, like a proxy or log shipper, that runs next to the app.",
        "Use Deployments for stateless apps, StatefulSets for apps that need a stable identity and storage, and DaemonSets for agents that run on every node.",
      ],
      tip: "Exactly one copy on every node? DaemonSet. A stable hostname and its own disk for each replica? StatefulSet.",
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
              { icon: "🏷️", title: "Labels and selectors", text: "Key/value pairs you can select on. Services, Deployments and NetworkPolicies find their Pods with selectors like app=web.", color: "#f59e0b" },
              { icon: "📝", title: "Annotations", text: "Extra notes for tools and people, like build info, owner or config hints. Nothing selects on them.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "**Namespaces** split one cluster into virtual clusters, for teams or environments. A name only has to be unique inside its namespace, not across the cluster.",
        "**ConfigMaps** hold ordinary settings. **Secrets** hold sensitive data. Your app can read either one as environment variables or as mounted files.",
        "Secret values are only base64-encoded, not encrypted. Protect them with RBAC, and turn on encryption at rest for etcd.",
        "Labels change behaviour, because things select on them. Annotations only describe.",
      ],
      tip: "A Service that sends traffic nowhere usually has a selector that doesn't match the Pod labels.",
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
              { icon: "🗝️", title: "kubeconfig", text: "~/.kube/config lists clusters, users and contexts. A context is a cluster plus a user plus a namespace. kubectl config use-context switches between them.", color: "#38bdf8" },
              { icon: "🛠️", title: "kubeadm", text: "Sets up a conformant cluster (kubeadm init, kubeadm join) and upgrades it one minor version at a time.", color: "#38bdf8" },
              { icon: "🧾", title: "Quotas", text: "A ResourceQuota caps a namespace's total usage. A LimitRange sets defaults and min/max values for each container.", color: "#38bdf8" },
            ]}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "🚧", label: "kubectl cordon", sub: "Mark the node unschedulable" },
              { icon: "🚚", label: "kubectl drain", sub: "Evict Pods (respects PodDisruptionBudgets)" },
              { icon: "🔧", label: "Maintain or upgrade", sub: "Patch the OS, upgrade the kubelet" },
              { icon: "✅", label: "kubectl uncordon", sub: "Allow scheduling again" },
            ]}
          />
        </div>
      ),
      points: [
        "Kubernetes ships about three minor releases a year. The three most recent minor versions get patches, for roughly 14 months each.",
        "Upgrade the control plane first, then the nodes. A kubelet must never be newer than the API server.",
        "A **PodDisruptionBudget** limits how many replicas of an app can be taken down at once by planned disruptions, like draining a node.",
        "Managed services such as EKS, GKE and AKS run the control plane for you. You still look after your workloads, and usually the node upgrades too.",
      ],
      tip: "Node maintenance goes cordon, drain, do the work, uncordon.",
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
              { icon: "🟩", title: "Guaranteed", text: "Every container sets CPU and memory requests equal to its limits. Evicted last.", color: "#34d399" },
              { icon: "🟨", title: "Burstable", text: "At least one request or limit is set, but the Pod isn't Guaranteed.", color: "#fbbf24" },
              { icon: "🟥", title: "BestEffort", text: "No requests or limits at all. First to be evicted when a node runs short.", color: "#fb7185" },
            ]}
          />
        </div>
      ),
      points: [
        "The scheduler places Pods by their **requests**, not by what they really use. First it filters out nodes that can't fit the Pod, then it scores the rest.",
        "**Limits** are enforced while the container runs. Going over the CPU limit slows the container down (throttling). Going over the memory limit gets it OOMKilled.",
        "A **taint** keeps Pods away from a node. A **toleration** lets a Pod onto a tainted node, but doesn't send it there. To pull it there, use nodeSelector or node affinity.",
        "Taint effects: NoSchedule (no new Pods), PreferNoSchedule (avoid if possible), and NoExecute (also evicts running Pods that don't tolerate it).",
        "Pod anti-affinity spreads replicas across nodes or zones. PriorityClasses let important Pods push out lower-priority ones.",
      ],
      tip: "Pod stuck Pending? Read the FailedScheduling event in `kubectl describe pod`. It names the request, taint or selector that couldn't be met.",
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
              { name: "Linux kernel", color: "#a78bfa", items: ["namespaces for isolation", "cgroups for resource limits"] },
            ]}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🧅", title: "Image layers", text: "Each Dockerfile instruction adds a read-only layer. Layers are shared and cached. Multi-stage builds keep only what the app needs to run.", color: "#f59e0b" },
              { icon: "🔖", title: "Tag versus digest", text: "Tags like :1.4 or :latest can be moved to a different image. A digest (@sha256:…) always names exactly the same image.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "Containers share the host's kernel. Linux **namespaces** (PID, network, mount and others) isolate them, and **cgroups** limit their resources. A virtual machine boots its own kernel instead.",
        "**OCI** defines open specs for images, runtimes and distribution (registries). So an image built by any tool runs on any runtime that follows the spec.",
        "Kubernetes removed dockershim in v1.24. Images built with Docker still run, because they're standard OCI images.",
        "Prefer small base images, non-root users, and fixed tags or digests. Avoid :latest in production.",
      ],
      tip: "CRI is how the kubelet talks to the runtime. OCI is the image and runtime format. Don't mix them up.",
    },
  ],

  questions: [
    // ── Start here ──
    {
      id: "kcna-b1-01",
      domain: "d1",
      lesson: "d1-b-containers",
      level: "beginner",
      prompt: "What does a container package together?",
      options: [
        "An app and everything it needs to run, like libraries and settings",
        "Only the app's source code, as text",
        "A full physical server",
        "A list of users who may log in",
      ],
      answer: [0],
      explanation: "A container bundles the app with its libraries and settings. That's why it runs the same way on a laptop and on a server.",
    },
    {
      id: "kcna-b1-02",
      domain: "d1",
      lesson: "d1-b-containers",
      level: "beginner",
      prompt: "What's the difference between a container image and a container?",
      options: [
        "The image is the packaged bundle, and a container is a running copy of it",
        "They're two names for exactly the same thing",
        "The container is the bundle, and the image is a screenshot of it",
        "An image only works on Windows",
      ],
      answer: [0],
      explanation: "Think of the image as a recipe and the container as a dish cooked from it. You can start many containers from one image.",
    },
    {
      id: "kcna-b1-03",
      domain: "d1",
      lesson: "d1-b-kubernetes",
      level: "beginner",
      prompt: "What is Kubernetes mainly for?",
      options: [
        "Running and looking after containers across a group of machines",
        "Writing the code inside an app",
        "Designing website layouts",
        "Replacing a computer's operating system",
      ],
      answer: [0],
      explanation: "Kubernetes is a container orchestrator. You tell it what should be running, and it places containers on machines and restarts them if they fail.",
    },
    {
      id: "kcna-b1-04",
      domain: "d1",
      lesson: "d1-b-kubernetes",
      level: "beginner",
      prompt: "In Kubernetes, what is a node?",
      options: [
        "One machine in the cluster that runs your containers",
        "A single line in a YAML file",
        "A type of container image",
        "A person who manages the cluster",
      ],
      answer: [0],
      explanation: "A cluster is a group of machines, and each machine is a node. Nodes can be physical servers or virtual machines.",
    },
    {
      id: "kcna-b1-05",
      domain: "d1",
      lesson: "d1-b-kubectl",
      level: "beginner",
      prompt: "Which command lists the Pods in your current namespace?",
      options: ["`kubectl get pods`", "`kubectl show all`", "`kube list pods`", "`docker pods`"],
      answer: [0],
      explanation: "kubectl commands follow a verb-then-thing pattern. `get` lists things, so `kubectl get pods` lists your Pods.",
    },
    {
      id: "kcna-b1-06",
      domain: "d1",
      lesson: "d1-b-kubectl",
      level: "beginner",
      prompt: "A Pod isn't working and you want its details and recent events. Which command do you reach for first?",
      options: ["`kubectl describe pod <name>`", "`kubectl delete pod <name>`", "`kubectl get nodes`", "`kubectl version`"],
      answer: [0],
      explanation: "`kubectl describe` shows the full picture of one object, with an Events list at the bottom. Deleting it first would throw away the clues.",
    },

    // ── Architecture ──
    {
      id: "d1-01",
      domain: "d1",
      lesson: "d1-architecture",
      prompt: "A newly created Pod has no node assigned. Which control plane component chooses a node for it?",
      options: ["kube-scheduler", "kubelet", "kube-controller-manager", "etcd"],
      answer: [0],
      explanation: "The scheduler watches for Pods with no node, filters and scores the nodes, and binds the Pod to one. The kubelet on that node then runs it.",
    },
    {
      id: "d1-02",
      domain: "d1",
      lesson: "d1-architecture",
      prompt: "Where does Kubernetes store the desired and current state of every object in the cluster?",
      options: ["etcd", "The kubelet's local disk", "The container registry", "kube-proxy's rule table"],
      answer: [0],
      explanation: "etcd is the consistent key-value store behind the API server. All cluster state lives there, which is why you have to back it up.",
    },
    {
      id: "d1-03",
      domain: "d1",
      lesson: "d1-architecture",
      prompt: "Which component runs on every worker node, registers the node with the cluster, and makes sure the containers of the Pods assigned to it are running?",
      options: ["kubelet", "kube-apiserver", "kube-scheduler", "cloud-controller-manager"],
      answer: [0],
      explanation: "The kubelet is the node agent. It watches the API server for Pods bound to its node and tells the container runtime what to run, through the CRI.",
    },
    {
      id: "d1-04",
      domain: "d1",
      lesson: "d1-architecture",
      prompt: "Which component is the only one that reads from and writes to etcd directly?",
      options: ["kube-apiserver", "kube-scheduler", "kubelet", "kube-controller-manager"],
      answer: [0],
      explanation: "Every other component goes through the API server. The API server checks each request and saves the objects in etcd.",
    },
    {
      id: "d1-05",
      domain: "d1",
      lesson: "d1-architecture",
      prompt: "A team runs a 3-member etcd cluster. How many members can fail while the cluster still accepts writes?",
      options: ["1", "0", "2", "3"],
      answer: [0],
      explanation: "Raft needs a majority, called a quorum. With 3 members the quorum is 2, so the cluster survives one failure. Five members survive two.",
    },
    {
      id: "d1-06",
      domain: "d1",
      lesson: "d1-architecture",
      prompt: "A Deployment's Pods keep coming back after someone deletes them by hand. Which component runs the control loop behind this?",
      options: ["kube-controller-manager", "kube-proxy", "etcd", "The container runtime"],
      answer: [0],
      explanation: "The controller manager runs the Deployment and ReplicaSet controllers. They notice there are fewer Pods than wanted and create replacements.",
    },
    {
      id: "d1-07",
      domain: "d1",
      lesson: "d1-architecture",
      prompt: "On a cloud cluster, which component creates the cloud provider's load balancer when someone creates a Service of type LoadBalancer?",
      options: ["cloud-controller-manager", "kube-scheduler", "kubelet", "CoreDNS"],
      answer: [0],
      explanation: "The cloud-controller-manager holds the cloud-specific controllers. One of them, the service controller, creates and updates load balancers.",
    },
    {
      id: "d1-08",
      domain: "d1",
      lesson: "d1-architecture",
      prompt: "Which components run on worker nodes in a typical Kubernetes cluster? (Choose three.)",
      options: ["kubelet", "kube-proxy", "A container runtime such as containerd", "etcd", "kube-scheduler", "kube-controller-manager"],
      answer: [0, 1, 2],
      explanation: "Worker nodes run the kubelet, a container runtime, and usually kube-proxy. etcd, the scheduler and the controller manager belong to the control plane.",
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
      explanation: "The API server is the front door, etcd is the memory, the scheduler decides placement, the kubelet is the node agent, and kube-proxy handles Service plumbing.",
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
      explanation: "Everything goes through the API server. Controllers turn the Deployment into Pods, the scheduler picks nodes, and the kubelets make it real.",
    },

    // ── API and kubectl ──
    {
      id: "d1-11",
      domain: "d1",
      lesson: "d1-api",
      prompt: "In a Kubernetes object, which field holds the state the user wants, as opposed to the state Kubernetes observes?",
      options: ["spec", "status", "metadata", "kind"],
      answer: [0],
      explanation: "You write spec, the desired state. Kubernetes controllers write status, the observed state, and work to make status match spec.",
    },
    {
      id: "d1-12",
      domain: "d1",
      lesson: "d1-api",
      prompt: "A team wants a new kind, `Database`, that they can create with kubectl like any built-in object, plus a controller that sets up real databases from it. What should they use?",
      options: ["A CustomResourceDefinition with a custom controller (an operator)", "A ConfigMap per database", "A DaemonSet", "An annotation on every Pod"],
      answer: [0],
      explanation: "A CRD adds a new resource type to the Kubernetes API. An operator is the controller that turns those resources into real infrastructure.",
    },
    {
      id: "d1-13",
      domain: "d1",
      lesson: "d1-api",
      prompt: "Which command creates or updates resources from manifest files, and is the usual choice for a declarative workflow?",
      options: ["`kubectl apply -f manifests/`", "`kubectl run`", "`kubectl create deployment`", "`kubectl edit`"],
      answer: [0],
      explanation: "`kubectl apply` compares your files with the live objects, then creates or patches them. `run` and `create` are imperative, and `edit` changes the live object by hand.",
    },
    {
      id: "d1-14",
      domain: "d1",
      lesson: "d1-api",
      prompt: "A developer can't remember which fields a Deployment's rolling update strategy accepts. Which command shows the docs from the cluster's own API?",
      options: ["`kubectl explain deployment.spec.strategy`", "`kubectl describe deployment`", "`kubectl get deployment -o wide`", "`kubectl logs deployment`"],
      answer: [0],
      explanation: "`kubectl explain` prints field documentation straight from the API schema. `describe` shows a live object and its events instead.",
    },
    {
      id: "d1-15",
      domain: "d1",
      lesson: "d1-api",
      prompt: "Which command lists every resource type the cluster serves, with short names and whether each one is namespaced?",
      options: ["`kubectl api-resources`", "`kubectl get all`", "`kubectl cluster-info`", "`kubectl version`"],
      answer: [0],
      explanation: "`api-resources` lists every kind, custom resources included, with its API group, short name (such as deploy or svc) and scope.",
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
      explanation: "Kubernetes stores what you want in objects, and control loops keep pushing reality toward it. Kubernetes writes status, not users.",
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
      explanation: "`--dry-run=client` builds the object locally without sending it. `-o yaml` prints it, so you can save it and edit it.",
    },
    {
      id: "d1-18",
      domain: "d1",
      lesson: "d1-api",
      type: "lines",
      prompt: "The API server rejects this manifest. Tap the line that causes it.",
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
      explanation: "Pods are core objects, served at apiVersion v1. apps/v1 serves Deployments, ReplicaSets, StatefulSets and DaemonSets, but not Pods. Line 1 is the one to change.",
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
      explanation: "The operator pattern captures what a human expert would do to run an app. It's a controller that watches custom resources and acts on them.",
    },

    // ── Workloads ──
    {
      id: "d1-21",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "What is the smallest deployable unit of computing you can create and manage in Kubernetes?",
      options: ["Pod", "Container", "Node", "Deployment"],
      answer: [0],
      explanation: "Kubernetes schedules Pods, not single containers. A Pod wraps one or more containers that share networking and storage.",
    },
    {
      id: "d1-22",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "A log-shipping agent must run exactly one copy on every node, including nodes added later. Which workload resource fits best?",
      options: ["DaemonSet", "Deployment with replicas equal to the node count", "StatefulSet", "CronJob"],
      answer: [0],
      explanation: "A DaemonSet runs one Pod on each eligible node, and adds a Pod automatically when a new node joins. A Deployment wouldn't keep up as nodes come and go.",
    },
    {
      id: "d1-23",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "A database cluster needs each replica to keep a stable name (db-0, db-1, db-2) and its own persistent volume across restarts. Which resource should you use?",
      options: ["StatefulSet", "Deployment", "DaemonSet", "ReplicaSet"],
      answer: [0],
      explanation: "StatefulSets give Pods stable numbered names, an ordered rollout, and a PersistentVolumeClaim for each Pod from volumeClaimTemplates.",
    },
    {
      id: "d1-24",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "Two containers in the same Pod need to talk to each other. What's the simplest way?",
      options: ["Over localhost, because containers in a Pod share one network namespace", "Through a NodePort Service", "Only through a shared ConfigMap", "They can't; containers must be in separate Pods to talk"],
      answer: [0],
      explanation: "All the containers in a Pod share the Pod's IP address and ports. So they can reach each other on localhost.",
    },
    {
      id: "d1-25",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "A nightly report must run at 02:00, finish, and not run again until the next night. Which resource fits?",
      options: ["CronJob", "DaemonSet", "Deployment", "StatefulSet"],
      answer: [0],
      explanation: "A CronJob creates a Job on a schedule. The Job runs its Pods until they finish, retrying if they fail.",
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
      explanation: "Init containers run one after another, each to completion, before any app container starts.",
    },
    {
      id: "d1-28",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "Why should apps usually run through a controller such as a Deployment instead of as bare Pods? (Choose two.)",
      options: [
        "A controller replaces Pods that fail or are lost with their node",
        "A controller handles rolling updates and rollbacks",
        "Bare Pods can't have more than one container",
        "Bare Pods can't receive an IP address",
        "Controllers make Pods immune to OOM kills",
      ],
      answer: [0, 1],
      explanation: "A bare Pod isn't recreated when it dies or its node fails. Controllers heal themselves, scale, and roll out new versions.",
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
      explanation: "Pick the controller by how the work lives: long-running and stateless, long-running and stateful, one per node, run once, or run on a schedule.",
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
      explanation: "A Deployment's selector has to match its template's labels, or the API server rejects it. The template label app: frontend on line 10 should be app: web.",
    },

    // ── Namespaces, labels, config ──
    {
      id: "d1-31",
      domain: "d1",
      lesson: "d1-config",
      prompt: "Two teams share one cluster and both want a Deployment named `api`. How can they do this without a name clash?",
      options: ["Put each team's resources in its own namespace", "Use different labels on each Deployment", "Run two kube-schedulers", "Add an annotation with the team name"],
      answer: [0],
      explanation: "Names only have to be unique inside a namespace, not across the whole cluster. Namespaces also let you set RBAC and ResourceQuotas per team.",
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
      explanation: "base64 is just an encoding, and anyone can decode it. Cluster operators turn on encryption at rest for etcd and limit who can read Secrets.",
    },
    {
      id: "d1-33",
      domain: "d1",
      lesson: "d1-config",
      prompt: "How does a Service know which Pods to send traffic to?",
      options: ["Its label selector matches labels on the Pods", "It lists Pod names in an annotation", "It routes to every Pod in the namespace", "The scheduler tells it at Pod creation"],
      answer: [0],
      explanation: "Services, ReplicaSets and many other objects find their Pods with label selectors, such as app=web.",
    },
    {
      id: "d1-34",
      domain: "d1",
      lesson: "d1-config",
      prompt: "Which namespaces exist in a newly created Kubernetes cluster? (Choose two.)",
      options: ["kube-system", "default", "kube-apps", "cluster-admin", "kube-storage"],
      answer: [0, 1],
      explanation: "A new cluster starts with default, kube-system (for system components such as CoreDNS), kube-public and kube-node-lease. The other names are made up.",
    },
    {
      id: "d1-35",
      domain: "d1",
      lesson: "d1-config",
      prompt: "A team wants to change an app's log level in each environment without rebuilding the image. Where should the setting live?",
      options: ["In a ConfigMap consumed as an environment variable or mounted file", "Hard-coded in the Dockerfile", "In the Pod's status field", "In a node label"],
      answer: [0],
      explanation: "ConfigMaps keep settings separate from the image. The same image then runs in every environment with different settings.",
    },
    {
      id: "d1-36",
      domain: "d1",
      lesson: "d1-config",
      prompt: "Which of these resources are cluster-scoped rather than namespaced? (Choose two.)",
      options: ["Node", "PersistentVolume", "Deployment", "ConfigMap", "Service"],
      answer: [0, 1],
      explanation: "Nodes, PersistentVolumes, Namespaces, StorageClasses and ClusterRoles belong to the whole cluster. Deployments, ConfigMaps and Services live inside a namespace.",
    },
    {
      id: "d1-37",
      domain: "d1",
      lesson: "d1-config",
      prompt: "What's the difference between labels and annotations?",
      options: [
        "Labels identify and can be selected on; annotations hold non-identifying metadata for tools and people",
        "Annotations are selectable; labels are free text",
        "Labels can only be set on Nodes",
        "There is no difference; they are aliases",
      ],
      answer: [0],
      explanation: "Selectors only work on labels. Annotations carry extra information, like build IDs, contact details or tool settings.",
    },
    {
      id: "d1-38",
      domain: "d1",
      lesson: "d1-config",
      prompt: "Which command lists the Pods labeled `app=web` in every namespace?",
      options: ["`kubectl get pods -l app=web -A`", "`kubectl get pods --name=web`", "`kubectl describe namespace web`", "`kubectl logs -l web`"],
      answer: [0],
      explanation: "`-l` (or `--selector`) filters by label, and `-A` (`--all-namespaces`) searches every namespace.",
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
      explanation: "Cordon stops new Pods landing on the node. Drain evicts the existing ones, respecting PodDisruptionBudgets, so controllers recreate them elsewhere. Uncordon brings the node back.",
    },
    {
      id: "d1-42",
      domain: "d1",
      lesson: "d1-admin",
      prompt: "A developer works with a staging and a production cluster from one laptop. How does kubectl know which cluster, user and default namespace to use?",
      options: ["The current context in the kubeconfig file", "The KUBERNETES_SERVICE_HOST variable on the laptop", "A label on the Namespace", "etcd on the laptop"],
      answer: [0],
      explanation: "A kubeconfig context ties together a cluster, a user and, optionally, a namespace. `kubectl config use-context` switches between them.",
    },
    {
      id: "d1-43",
      domain: "d1",
      lesson: "d1-admin",
      prompt: "In which order should you upgrade a cluster to a new Kubernetes minor version?",
      options: ["Control plane first, then the worker nodes' kubelets", "Worker nodes first, then the control plane", "All components at the same moment", "Only etcd; the rest updates itself"],
      answer: [0],
      explanation: "A kubelet must never be newer than the API server. So you upgrade the control plane first, and the nodes follow.",
    },
    {
      id: "d1-44",
      domain: "d1",
      lesson: "d1-admin",
      prompt: "A platform team wants to cap the total CPU and memory that the `team-a` namespace can request. Which object should they create?",
      options: ["ResourceQuota", "LimitRange", "PodDisruptionBudget", "PriorityClass"],
      answer: [0],
      explanation: "A ResourceQuota limits the total usage in a namespace. A LimitRange sets defaults and bounds for each container instead.",
    },
    {
      id: "d1-45",
      domain: "d1",
      lesson: "d1-admin",
      prompt: "During node drains, at least 2 of an app's 3 replicas must always stay up. What should the team define?",
      options: ["A PodDisruptionBudget with minAvailable: 2", "A ResourceQuota of 2 Pods", "A taint with NoExecute", "A readiness probe"],
      answer: [0],
      explanation: "PodDisruptionBudgets limit planned disruptions such as drains. The eviction API refuses any eviction that would break the budget.",
    },
    {
      id: "d1-46",
      domain: "d1",
      lesson: "d1-admin",
      prompt: "Which tool from the Kubernetes project sets up a minimal, conformant cluster with `init` and `join` commands?",
      options: ["kubeadm", "kubectl", "Helm", "kube-proxy"],
      answer: [0],
      explanation: "`kubeadm init` sets up a control plane and `kubeadm join` adds nodes. It also handles version upgrades with `kubeadm upgrade`.",
    },
    {
      id: "d1-47",
      domain: "d1",
      lesson: "d1-admin",
      type: "order",
      prompt: "Put in order the steps for safely taking a worker node out for maintenance and bringing it back.",
      items: ["Cordon the node", "Drain the node", "Perform the maintenance", "Uncordon the node"],
      explanation: "Stop new scheduling, move the existing Pods away, do the work, then make the node schedulable again.",
    },

    // ── Scheduling ──
    {
      id: "d1-51",
      domain: "d1",
      lesson: "d1-scheduling",
      prompt: "A node has the taint `gpu=true:NoSchedule`. A Pod has a matching toleration but no nodeSelector or affinity. What happens when it's scheduled?",
      options: [
        "It may be placed on the GPU node or on any other suitable node",
        "It is always placed on the GPU node",
        "It is rejected by the API server",
        "It evicts the Pods already on the GPU node",
      ],
      answer: [0],
      explanation: "A toleration only allows the Pod onto the tainted node. To make it land there, add a nodeSelector or node affinity for the GPU node's label.",
    },
    {
      id: "d1-52",
      domain: "d1",
      lesson: "d1-scheduling",
      prompt: "What does the scheduler use to decide whether a Pod fits on a node's CPU and memory?",
      options: ["The Pod's resource requests", "The Pod's resource limits", "The node's current real-time usage only", "The container image size"],
      answer: [0],
      explanation: "Scheduling is based on requests: the requests on a node can't add up to more than its allocatable capacity. Limits only come into play later, while the container runs.",
    },
    {
      id: "d1-53",
      domain: "d1",
      lesson: "d1-scheduling",
      prompt: "A container keeps getting restarted with the reason OOMKilled. What's happening?",
      options: [
        "It used more memory than its memory limit, so it was killed",
        "It used more CPU than its CPU limit",
        "Its readiness probe failed",
        "The image couldn't be pulled",
      ],
      answer: [0],
      explanation: "Memory can't be throttled, so going over the memory limit gets the container killed. Going over the CPU limit only slows it down.",
    },
    {
      id: "d1-54",
      domain: "d1",
      lesson: "d1-scheduling",
      prompt: "Every container in a Pod sets CPU and memory requests equal to its limits. Which QoS class does the Pod get?",
      options: ["Guaranteed", "Burstable", "BestEffort", "Critical"],
      answer: [0],
      explanation: "Requests equal to limits for CPU and memory, in every container, gives you Guaranteed. It's the last class to be evicted when a node runs short.",
    },
    {
      id: "d1-55",
      domain: "d1",
      lesson: "d1-scheduling",
      prompt: "Which taint effect also evicts Pods that are already running and don't tolerate it?",
      options: ["NoExecute", "NoSchedule", "PreferNoSchedule", "NoAdmit"],
      answer: [0],
      explanation: "NoExecute keeps new Pods off and evicts existing Pods that have no matching toleration, optionally after tolerationSeconds. NoSchedule only affects new Pods.",
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
      explanation: "nodeSelector and required node affinity pull Pods toward labeled nodes. Tolerations only deal with taints, and the scheduler ignores annotations.",
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
      explanation: "A limit can't be lower than its request. The CPU limit of 250m on line 10 is below the 500m request, so validation fails.",
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
      explanation: "A toleration has to match the taint's key, value and effect. effect: NoExecute doesn't tolerate a NoSchedule taint. It should say NoSchedule, or leave the effect out to match every effect.",
    },
    {
      id: "d1-60",
      domain: "d1",
      lesson: "d1-scheduling",
      prompt: "A Pod stays Pending and its events say `0/3 nodes are available: 3 Insufficient cpu`. What's the most direct fix?",
      options: ["Lower the Pod's CPU request or add node capacity", "Raise the Pod's CPU limit", "Add a liveness probe", "Delete the Pod's Service"],
      answer: [0],
      explanation: "No node has enough unrequested CPU left for this Pod's request. Lower the request, free up capacity, or add nodes, for example with a cluster autoscaler.",
    },

    // ── Containers ──
    {
      id: "d1-61",
      domain: "d1",
      lesson: "d1-containers",
      prompt: "Which interface does the kubelet use to talk to container runtimes such as containerd and CRI-O?",
      options: ["Container Runtime Interface (CRI)", "Container Network Interface (CNI)", "Container Storage Interface (CSI)", "Open Container Initiative (OCI) distribution spec"],
      answer: [0],
      explanation: "CRI is the gRPC API between the kubelet and the runtime. CNI is for networking, CSI is for storage, and OCI covers image and runtime formats.",
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
      explanation: "Sharing the kernel makes containers light and quick to start. A VM pretends to be a whole computer and boots a full operating system.",
    },
    {
      id: "d1-63",
      domain: "d1",
      lesson: "d1-containers",
      prompt: "Which Linux kernel feature limits how much CPU and memory a container can use?",
      options: ["cgroups", "namespaces", "chroot", "SELinux labels"],
      answer: [0],
      explanation: "Control groups (cgroups) track and limit resources. Namespaces do something different: they control what a process can see, like PIDs, network and mounts.",
    },
    {
      id: "d1-64",
      domain: "d1",
      lesson: "d1-containers",
      prompt: "A team needs production to run exactly the image that passed testing, even if someone re-pushes the same tag later. How should they reference the image?",
      options: ["By its digest, for example `myapp@sha256:…`", "By the :latest tag", "By the image name only", "By the registry hostname"],
      answer: [0],
      explanation: "A tag is a label that can be moved to another image. A digest identifies the exact image content and never changes.",
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
      explanation: "Removing dockershim changed which runtime the kubelet talks to, not the image format. OCI images work on any runtime that follows the spec.",
    },
    {
      id: "d1-66",
      domain: "d1",
      lesson: "d1-containers",
      prompt: "Which practices give you smaller, safer container images? (Choose two.)",
      options: [
        "Use a multi-stage build so the final image holds only runtime artifacts",
        "Start from a minimal base image and run as a non-root user",
        "Bake secrets into the image so Pods start faster",
        "Install compilers and debugging tools in the production image",
        "Always deploy the :latest tag",
      ],
      answer: [0, 1],
      explanation: "Multi-stage builds and minimal bases shrink the image and leave less to attack. Running as non-root limits the damage if something goes wrong. Secrets never belong in images.",
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
      explanation: "The kubelet calls a CRI runtime such as containerd or CRI-O. That runtime uses an OCI runtime such as runc to start processes from OCI images pulled from a registry.",
    },
    {
      id: "d1-68",
      domain: "d1",
      lesson: "d1-containers",
      prompt: "A security team wants untrusted workloads to run with stronger isolation than a standard shared-kernel container. Which kind of runtime does that?",
      options: ["A sandboxed runtime such as gVisor or Kata Containers", "A bigger CPU limit", "A ConfigMap", "Running the container as root"],
      answer: [0],
      explanation: "Sandboxed runtimes put an extra layer between the workload and the host kernel: a user-space kernel (gVisor) or a lightweight VM (Kata Containers). Kubernetes picks them with a RuntimeClass.",
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
      explanation: "When a node runs short, the kubelet evicts BestEffort Pods first, then Burstable Pods using more than they requested. Guaranteed Pods go last.",
    },
    {
      id: "d1-70",
      domain: "d1",
      lesson: "d1-admin",
      prompt: "Roughly how many Kubernetes minor releases come out each year?",
      options: ["About three", "One", "Twelve", "About six"],
      answer: [0],
      explanation: "Kubernetes ships about three minor releases a year. The three most recent minor versions get patch releases.",
    },
    {
      id: "d1-71",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "A Deployment named `web` should run 5 replicas instead of 3. Which imperative command does this?",
      options: ["`kubectl scale deployment web --replicas=5`", "`kubectl rollout restart deployment web`", "`kubectl expose deployment web --port=5`", "`kubectl set image deployment web web=5`"],
      answer: [0],
      explanation: "`kubectl scale` changes the replica count. In a declarative workflow you'd change replicas in the manifest and apply it instead.",
    },
  ],

  cards: [
    { id: "k-apiserver", domain: "d1", kind: "service", term: "kube-apiserver", definition: "The front door of the control plane, and the only component that talks to etcd." },
    { id: "k-etcd", domain: "d1", kind: "service", term: "etcd", definition: "A consistent key-value store that holds all cluster state, kept in agreement with Raft." },
    { id: "k-scheduler", domain: "d1", kind: "service", term: "kube-scheduler", definition: "Filters and scores nodes, then binds each new Pod to one." },
    { id: "k-cm", domain: "d1", kind: "service", term: "kube-controller-manager", definition: "Runs the built-in control loops, like the Deployment, Node and Job controllers." },
    { id: "k-ccm", domain: "d1", kind: "service", term: "cloud-controller-manager", definition: "Runs the cloud-specific loops for nodes, routes and load balancers." },
    { id: "k-kubelet", domain: "d1", kind: "service", term: "kubelet", definition: "The node agent. It runs Pods through the container runtime and reports their status." },
    { id: "k-kubeproxy", domain: "d1", kind: "service", term: "kube-proxy", definition: "Sets up rules on each node so Service virtual IPs reach Pods." },
    { id: "k-containerd", domain: "d1", kind: "service", term: "containerd", definition: "A CNCF graduated container runtime that implements CRI." },
    { id: "k-crio", domain: "d1", kind: "service", term: "CRI-O", definition: "A lightweight runtime built just for the Kubernetes CRI." },
    { id: "k-kubeadm", domain: "d1", kind: "service", term: "kubeadm", definition: "Sets up and upgrades clusters with init, join and upgrade." },
    { id: "k-kubectl", domain: "d1", kind: "service", term: "kubectl", definition: "The command-line tool for talking to the Kubernetes API." },
    { id: "c-pod", domain: "d1", kind: "concept", term: "Pod", definition: "The smallest thing you can deploy: one or more containers sharing an IP and volumes." },
    { id: "c-deployment", domain: "d1", kind: "concept", term: "Deployment", definition: "Manages ReplicaSets for stateless apps, handling scaling, rolling updates and rollbacks." },
    { id: "c-statefulset", domain: "d1", kind: "concept", term: "StatefulSet", definition: "Stable Pod names, ordered rollout, and a volume for each replica." },
    { id: "c-daemonset", domain: "d1", kind: "concept", term: "DaemonSet", definition: "Runs one Pod on every matching node." },
    { id: "c-job", domain: "d1", kind: "concept", term: "Job and CronJob", definition: "A Job runs Pods until they finish. A CronJob does that on a schedule." },
    { id: "c-namespace", domain: "d1", kind: "concept", term: "Namespace", definition: "A virtual cluster that scopes names, RBAC and quotas." },
    { id: "c-crd", domain: "d1", kind: "concept", term: "CustomResourceDefinition", definition: "Adds a new resource kind to the Kubernetes API." },
    { id: "c-operator", domain: "d1", kind: "concept", term: "Operator", definition: "A controller plus custom resources that automate running an app." },
    { id: "c-taint", domain: "d1", kind: "concept", term: "Taint and toleration", definition: "A taint keeps Pods off a node. A toleration lets a Pod onto it anyway." },
    { id: "c-qos", domain: "d1", kind: "concept", term: "QoS classes", definition: "Guaranteed, Burstable and BestEffort. They decide the eviction order." },
    { id: "c-pdb", domain: "d1", kind: "concept", term: "PodDisruptionBudget", definition: "Limits how many replicas planned disruptions can take down at once." },
    { id: "c-cri", domain: "d1", kind: "concept", term: "CRI", definition: "The gRPC interface between the kubelet and container runtimes." },
    { id: "c-cgroups", domain: "d1", kind: "concept", term: "cgroups versus namespaces", definition: "cgroups limit resources. Namespaces isolate what a process can see." },
  ],

  challenges: [
    {
      id: "ch-place-pods",
      domain: "d1",
      lesson: "d1-scheduling",
      title: "Place the Pods",
      goal: "Get ml-trainer onto node-gpu, postgres onto node-ssd, and web onto a normal node, with nothing left Pending.",
      hint: "A toleration only lets a Pod onto a tainted node. Something else has to pull it there.",
      takeaway: "Taints push Pods away, tolerations let them in, and nodeSelector or node affinity pull them toward a node. Dedicated nodes usually need both a taint and a label.",
      render: (onSolved) => <SchedulingLab goal="place" onSolved={onSolved} />,
    },
  ],
});
