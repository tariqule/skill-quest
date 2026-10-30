import { CodeBlock, Flow, Layers, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { ServiceTypeLab } from "../labs";
import { PodStatusDecoder } from "../visuals";

/**
 * Domain 2: Container Orchestration (28% of the KCNA exam).
 * The official curriculum lists four topics (networking, security, troubleshooting, storage);
 * the `covers` lines are this course's breakdown of each topic.
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "Container Orchestration",
    world: "The Pod Harbor",
    weight: 28,
    emoji: "⚓",
    color: "#14b8a6",
    summary: "How Pods talk to each other, stay secure, keep their data, and get fixed when they break: networking, Services, DNS, Ingress, RBAC, NetworkPolicy, storage and troubleshooting.",
  },

  tasks: [
    {
      id: "2.1",
      title: "Networking",
      covers: [
        "Describe the Kubernetes network model and the role of CNI plugins",
        "Expose workloads with Services (ClusterIP, NodePort, LoadBalancer, ExternalName, headless) and find them with cluster DNS",
        "Route HTTP traffic with Ingress and Gateway API; describe what a service mesh adds",
      ],
    },
    {
      id: "2.2",
      title: "Security",
      covers: [
        "Explain the 4C's of cloud native security and the API request path: authentication, authorization, admission",
        "Grant least privilege with RBAC and ServiceAccounts",
        "Harden Pods with security contexts and Pod Security Standards; restrict traffic with NetworkPolicies",
      ],
    },
    {
      id: "2.3",
      title: "Troubleshooting",
      covers: [
        "Read Pod phases and container states (Pending, CrashLoopBackOff, ImagePullBackOff, OOMKilled)",
        "Investigate with kubectl get, describe, logs, events, and exec",
        "Use liveness, readiness, and startup probes",
      ],
    },
    {
      id: "2.4",
      title: "Storage",
      covers: [
        "Use ephemeral and projected volumes (emptyDir, ConfigMap, Secret)",
        "Provision persistent storage with PersistentVolumes, PersistentVolumeClaims, and StorageClasses",
        "Describe access modes, reclaim policies, and the Container Storage Interface (CSI)",
      ],
    },
  ],

  lessons: [
    // ── Start here ──
    {
      id: "d2-b-finding",
      level: "beginner",
      task: "2.1",
      title: "Start here: how apps in a cluster find each other",
      check: ["kcna-b2-01", "kcna-b2-02"],
      visual: (
        <Flow
          color="#14b8a6"
          steps={[
            { icon: "📦", label: "Shop app", sub: "Wants to call \"payments\"" },
            { icon: "☎️", label: "Service", sub: "One fixed name and address" },
            { icon: "📦", label: "Payments Pods", sub: "Come and go, the Service keeps track" },
          ]}
        />
      ),
      points: [
        "Think of a company switchboard. You call one number for \"sales\", and it puts you through to whoever is at a desk today.",
        "In Kubernetes, Pods come and go, and each new Pod gets a new IP address. So you can't rely on calling a Pod directly.",
        "A **Service** is the switchboard. It gives a group of Pods one steady name and address, and passes each call to a healthy Pod.",
        "Kubernetes also runs a built-in phone book, called **DNS**, so apps can reach a Service just by its name, like `payments`.",
      ],
      tip: "When a question asks how to give changing Pods a stable address, the answer is a Service.",
    },
    {
      id: "d2-b-safety",
      level: "beginner",
      task: "2.2",
      title: "Start here: who is allowed to do what",
      check: ["kcna-b2-03", "kcna-b2-04"],
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🪪", title: "Who are you?", text: "First the cluster checks your identity, like showing a badge at the door.", color: "#f59e0b" },
            { icon: "🔑", title: "What may you do?", text: "Then it checks what that badge lets you open. Most people only get a few rooms.", color: "#f59e0b" },
          ]}
        />
      ),
      points: [
        "Picture an office building with key cards. Everyone has a card, but a card only opens the rooms that person needs.",
        "Kubernetes works the same way. Each request is checked: who is asking, and are they allowed to do this?",
        "**RBAC** (role-based access control) is how you hand out those permissions. You list what a role may do, then give that role to a person or an app.",
        "The safe habit is called **least privilege**: give each person or app only the permissions it really needs.",
      ],
      tip: "If an answer gives an app full admin rights \"to be safe\", it's almost always the wrong answer.",
    },
    {
      id: "d2-b-storage",
      level: "beginner",
      task: "2.4",
      title: "Start here: keeping data when a container restarts",
      check: ["kcna-b2-05", "kcna-b2-06"],
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "📝", title: "Inside the container", text: "Like writing on a whiteboard. Wiped clean when the container is replaced.", color: "#14b8a6" },
            { icon: "🗄️", title: "A persistent volume", text: "Like a filing cabinet. The papers stay even when the person at the desk changes.", color: "#14b8a6" },
          ]}
        />
      ),
      points: [
        "Files a container writes inside itself are lost when that container is replaced. That's fine for temporary files, but not for a database.",
        "A **volume** is storage you attach to a Pod, a bit like plugging in an external drive.",
        "For data that must survive, you use a **PersistentVolume**: storage that lives on after any one Pod is gone.",
        "Your app asks for that storage with a **PersistentVolumeClaim**, which is a request like \"I need 10 GB I can write to\".",
      ],
      tip: "If the data has to survive a Pod restart, the answer involves a PersistentVolumeClaim.",
    },

    {
      id: "d2-networking",
      task: "2.1",
      title: "The Kubernetes network model, CNI, and DNS",
      check: ["d2-01", "d2-02"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🌐", title: "One IP per Pod", text: "Every Pod gets its own IP that works across the whole cluster. Pods reach each other directly, across nodes, with no NAT.", color: "#14b8a6" },
              { icon: "🔌", title: "CNI plugin", text: "Calico, Cilium, Flannel and others make that model real. They wire up each Pod's network interface and hand out IPs.", color: "#14b8a6" },
              { icon: "🧭", title: "CoreDNS", text: "Every Service gets a DNS name: <service>.<namespace>.svc.cluster.local.", color: "#14b8a6" },
            ]}
          />
          <Flow
            color="#14b8a6"
            steps={[
              { icon: "📦", label: "Pod in shop", sub: "curl http://payments.billing" },
              { icon: "🧭", label: "CoreDNS", sub: "Turns payments.billing.svc.cluster.local into the ClusterIP" },
              { icon: "🔀", label: "kube-proxy rules", sub: "Send the ClusterIP to one Ready Pod IP" },
              { icon: "📦", label: "payments Pod" },
            ]}
          />
        </div>
      ),
      points: [
        "Kubernetes defines the network model, and a **CNI plugin** puts it into practice. On a new cluster with no CNI plugin, Pods can't get networking.",
        "Pod IPs change whenever Pods are replaced. So clients use a Service's stable virtual IP and DNS name instead.",
        "Inside the same namespace, the short Service name works (`http://payments`). From another namespace, add the namespace (`payments.billing`).",
        "**EndpointSlices** list the Ready Pod IPs behind each Service. kube-proxy, or a CNI plugin that replaces it, sets up the forwarding rules.",
      ],
      tip: "The Service DNS pattern is my-svc.my-namespace.svc.cluster.local.",
    },
    {
      id: "d2-services",
      task: "2.1",
      title: "Services, Ingress, Gateway API, and service mesh",
      check: ["d2-11", "d2-12"],
      sources: [{ title: "Kubernetes docs: Liveness, Readiness and Startup Probes", url: "https://kubernetes.io/docs/concepts/configuration/liveness-readiness-startup-probes/", license: "CC BY 4.0" }],
      visual: (
        <div className="grid gap-4">
          <ServiceTypeLab />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🚪", title: "Gateway API", text: "The newer, role-based follow-up to Ingress. GatewayClass is for the infra provider, Gateway for the cluster operator, and HTTPRoute and friends for app teams.", color: "#38bdf8" },
              { icon: "🕸️", title: "Service mesh", text: "Istio and Linkerd put proxies (sidecars or per-node) in the path. They add mutual TLS, retries, traffic splitting and per-request telemetry with no app changes.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "**ClusterIP**, the default, is reachable only inside the cluster. **NodePort** adds a port on every node (30000 to 32767 by default). **LoadBalancer** adds a cloud load balancer on top.",
        "**ExternalName** returns a CNAME pointing to an outside hostname. A **headless** Service (clusterIP: None) returns the Pod IPs directly.",
        "An Ingress resource does nothing by itself. You need an Ingress controller installed to serve it. The Ingress API is stable but frozen, and new features go into Gateway API.",
        "Services only send traffic to Pods that match the selector and are Ready.",
        "A Service only sends traffic to Pods that pass their **readiness probe**. A Pod that isn't Ready is taken out of the Service's endpoints until it recovers.",
      ],
      tip: "Need routing by host name or URL path, with TLS? That's Ingress or Gateway API, not a Service type.",
    },
    {
      id: "d2-security",
      task: "2.2",
      title: "Security: RBAC, Pod security, and NetworkPolicy",
      check: ["d2-21", "d2-22"],
      sources: [{ title: "Kubernetes docs: Configure a Security Context", url: "https://kubernetes.io/docs/tasks/configure-pod-container/security-context/", license: "CC BY 4.0" }],
      visual: (
        <div className="grid gap-4">
          <Layers
            layers={[
              { name: "Cloud", color: "#a78bfa", items: ["Provider IAM", "Network firewalls", "Encrypted disks"] },
              { name: "Cluster", color: "#38bdf8", items: ["RBAC", "Admission policies", "NetworkPolicy", "Secrets encryption at rest"] },
              { name: "Container", color: "#14b8a6", items: ["Trusted, scanned images", "Non-root", "Read-only root filesystem"] },
              { name: "Code", color: "#34d399", items: ["Dependency scanning", "TLS", "No hard-coded secrets"] },
            ]}
          />
          <CodeBlock
            lang="yaml"
            caption="Only Pods labeled app=web can reach the api Pods, and only on port 8080. All other incoming traffic is dropped."
            code={`apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: api-allow-web
  namespace: shop
spec:
  podSelector:
    matchLabels: { app: api }
  policyTypes: [Ingress]
  ingress:
  - from:
    - podSelector:
        matchLabels: { app: web }
    ports:
    - port: 8080`}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "🪪", label: "Authentication", sub: "Who are you? Certificates, tokens, OIDC" },
              { icon: "⚖️", label: "Authorization", sub: "Are you allowed to do this? RBAC" },
              { icon: "🛂", label: "Admission", sub: "Mutate, then validate (Pod Security, policies)" },
              { icon: "🗃️", label: "Saved to etcd" },
            ]}
          />
        </div>
      ),
      points: [
        "In **RBAC**, a Role (one namespace) or ClusterRole (whole cluster) lists the allowed verbs on resources. A RoleBinding or ClusterRoleBinding gives it to users, groups or ServiceAccounts.",
        "RBAC only ever allows. There are no deny rules.",
        "Pods talk to the API as a **ServiceAccount**. Give each app its own ServiceAccount with only the permissions it needs.",
        "**Pod Security Standards** define three profiles: Privileged, Baseline and Restricted. Pod Security Admission enforces them per namespace, using labels.",
        "By default every Pod can reach every other Pod. Once a NetworkPolicy selects a Pod, only the traffic it allows gets through. This needs a CNI plugin that enforces policies.",
        "A container's **securityContext** limits damage if it's compromised. For example, runAsNonRoot: true stops it running as root, and readOnlyRootFilesystem: true stops it writing to its own filesystem.",
      ],
      tip: "To check whether a user can delete Pods, run `kubectl auth can-i delete pods --as=<user> -n <namespace>`.",
    },
    {
      id: "d2-storage",
      task: "2.4",
      title: "Volumes, PersistentVolumes, and StorageClasses",
      check: ["d2-31", "d2-32"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#14b8a6"
            steps={[
              { icon: "📦", label: "Pod", sub: "volumes: persistentVolumeClaim: data" },
              { icon: "🎟️", label: "PersistentVolumeClaim", sub: "\"10Gi, ReadWriteOnce, class fast\"" },
              { icon: "🏭", label: "StorageClass", sub: "A provisioner (a CSI driver) plus parameters" },
              { icon: "💾", label: "PersistentVolume", sub: "Created and bound automatically" },
            ]}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🫧", title: "Ephemeral", text: "An emptyDir lives and dies with its Pod. configMap and secret volumes show config to the app as files.", color: "#f59e0b" },
              { icon: "🔐", title: "Access modes", text: "ReadWriteOnce (one node), ReadOnlyMany, ReadWriteMany (many nodes), ReadWriteOncePod (one Pod).", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "A **PersistentVolume** is a piece of storage in the cluster, and it belongs to the whole cluster. A **PersistentVolumeClaim** is a request for storage, and it lives in a namespace.",
        "With dynamic provisioning, a claim that names a **StorageClass** gets a new volume created on demand. No admin has to create volumes ahead of time.",
        "The reclaim policy decides what happens once the claim is deleted. Delete removes the storage, and it's the default for dynamic provisioning. Retain keeps it for manual cleanup.",
        "**CSI** is the standard plugin interface for storage. It lets vendors ship drivers outside the Kubernetes code base.",
      ],
      tip: "Pod stuck Pending with an \"unbound PersistentVolumeClaim\" event? Check the claim's StorageClass, size and access mode.",
    },
    {
      id: "d2-troubleshooting",
      task: "2.3",
      title: "Troubleshooting Pods and probes",
      check: ["d2-41", "d2-42"],
      visual: (
        <div className="grid gap-4">
          <PodStatusDecoder />
          <Tiles
            cols={3}
            tiles={[
              { icon: "💓", title: "Liveness probe", text: "If it fails, the kubelet restarts the container. Good for deadlocks and hung processes.", color: "#fb7185" },
              { icon: "🚦", title: "Readiness probe", text: "If it fails, the Pod is taken out of the Service's endpoints until it passes again. No restart.", color: "#38bdf8" },
              { icon: "🐢", title: "Startup probe", text: "Holds off the other probes until a slow app has finished starting.", color: "#fbbf24" },
            ]}
          />
        </div>
      ),
      points: [
        "Start broad, then narrow down. Run `kubectl get pods`, then `kubectl describe pod` for events, then `kubectl logs`, then `kubectl exec` into a running container.",
        "Add `--previous` to `kubectl logs` to see the output of the run that crashed.",
        "`kubectl get events --sort-by=.metadata.creationTimestamp` shows what happened recently in a namespace.",
        "Exit code 137 usually means the container was killed, often because it was OOMKilled (out of memory). A failing liveness probe also causes restarts.",
        "If a Service returns nothing, check three things: the selector matches the Pod labels, targetPort matches the container port, and the Pods are Ready.",
      ],
      tip: "Restarting over and over? Read `logs --previous`. Never started at all? Run describe and read the Events.",
    },
  ],

  questions: [
    // ── Start here ──
    {
      id: "kcna-b2-01",
      domain: "d2",
      lesson: "d2-b-finding",
      level: "beginner",
      prompt: "Why shouldn't one app call another app's Pod directly by its IP address?",
      options: [
        "Pods get replaced, and a new Pod gets a new IP address",
        "Pods don't have IP addresses",
        "Calling by IP is slower than calling by a name",
        "Kubernetes blocks all traffic between Pods",
      ],
      answer: [0],
      explanation: "Pods are short-lived, and every replacement gets a fresh IP. A Service gives you one address that stays the same while the Pods behind it change.",
    },
    {
      id: "kcna-b2-02",
      domain: "d2",
      lesson: "d2-b-finding",
      level: "beginner",
      prompt: "What does a Kubernetes Service give a group of Pods?",
      options: [
        "One stable name and address that passes traffic to healthy Pods",
        "More CPU and memory",
        "A backup of their data",
        "A copy of the container image on each node, so Pods start faster",
      ],
      answer: [0],
      explanation: "A Service is like a switchboard number. Callers use the Service, and it forwards each request to one of the Pods that's ready to answer.",
    },
    {
      id: "kcna-b2-03",
      domain: "d2",
      lesson: "d2-b-safety",
      level: "beginner",
      prompt: "What does RBAC control in Kubernetes?",
      options: [
        "Which people and apps are allowed to do which actions",
        "How much memory a Pod can use",
        "Which version of Kubernetes each of the nodes runs",
        "How fast the network is",
      ],
      answer: [0],
      explanation: "RBAC stands for role-based access control. You describe what a role can do, like \"read Pods\", and give that role to a user or an app.",
    },
    {
      id: "kcna-b2-04",
      domain: "d2",
      lesson: "d2-b-safety",
      level: "beginner",
      prompt: "An app only needs to read a list of Pods. Following \"least privilege\", what should it get?",
      options: [
        "Permission to read Pods, and nothing more",
        "Full admin rights over the whole cluster",
        "Permission to delete anything in its namespace",
        "The same rights as the cluster administrator",
      ],
      answer: [0],
      explanation: "Least privilege means giving only what's needed. If that app is ever broken into, the attacker can only read Pods instead of taking over the cluster.",
    },
    {
      id: "kcna-b2-05",
      domain: "d2",
      lesson: "d2-b-storage",
      level: "beginner",
      prompt: "A database writes its files inside its container. The container gets replaced. What happens to the files?",
      options: [
        "They're lost, because the new container starts fresh",
        "They're copied to the new container automatically",
        "They're saved to the container image",
        "They move to the API server",
      ],
      answer: [0],
      explanation: "A container's own filesystem is temporary. To keep data across replacements, you attach a persistent volume and write there.",
    },
    {
      id: "kcna-b2-06",
      domain: "d2",
      lesson: "d2-b-storage",
      level: "beginner",
      prompt: "How does an app ask Kubernetes for storage that will outlast its Pod?",
      options: ["With a PersistentVolumeClaim", "With a Service", "With a Namespace", "With a liveness probe on it"],
      answer: [0],
      explanation: "A PersistentVolumeClaim is a request for storage, such as \"10 GB I can write to\". Kubernetes matches it to a PersistentVolume, which keeps the data even when the Pod is gone.",
    },

    // ── Networking ──
    {
      id: "d2-01",
      domain: "d2",
      lesson: "d2-networking",
      prompt: "In the Kubernetes network model, how do Pods on different nodes talk to each other?",
      options: ["Directly by Pod IP, without NAT", "Only through a NodePort Service", "Only through the API server", "They can't; Pods talk only to Pods on the same node"],
      answer: [0],
      explanation: "Kubernetes requires a flat network where every Pod can reach every other Pod by IP, without NAT. A CNI plugin builds that network.",
    },
    {
      id: "d2-02",
      domain: "d2",
      lesson: "d2-networking",
      prompt: "A Pod in namespace `shop` needs to call the Service `payments` in namespace `billing`. Which hostname resolves correctly through cluster DNS?",
      options: ["payments.billing.svc.cluster.local", "billing.payments.cluster.local", "payments.shop.svc.cluster.local", "svc.payments.billing"],
      answer: [0],
      explanation: "Service DNS names follow the pattern <service>.<namespace>.svc.<cluster-domain>, and cluster.local is the default domain. The short form payments.billing also works.",
    },
    {
      id: "d2-03",
      domain: "d2",
      lesson: "d2-networking",
      prompt: "A new cluster's nodes show NotReady and Pods have no IP addresses. What has most likely not been installed?",
      options: ["A CNI network plugin", "Helm", "A metrics server", "An Ingress controller"],
      answer: [0],
      explanation: "Kubernetes leaves Pod networking to CNI plugins. Until you install one, Pods get no networking and nodes report their network as not ready.",
    },
    {
      id: "d2-04",
      domain: "d2",
      lesson: "d2-networking",
      prompt: "Why do clients connect to a Service instead of straight to Pod IP addresses?",
      options: [
        "Pod IPs change as Pods are replaced, while a Service keeps a stable virtual IP and DNS name and load-balances across Ready Pods",
        "Pod IPs can't be reached from other Pods, so a Service has to translate every request into a node port before it can reach the container",
        "Services encrypt all traffic by default",
        "Pods don't have IP addresses",
      ],
      answer: [0],
      explanation: "Pods are disposable and get new IPs. A Service gives you a stable front door and keeps track of which Pods are healthy right now.",
    },
    {
      id: "d2-05",
      domain: "d2",
      lesson: "d2-networking",
      prompt: "Which projects are CNI plugins that provide Pod networking? (Choose two.)",
      options: ["Calico", "Cilium", "CoreDNS", "etcd", "Prometheus"],
      answer: [0, 1],
      explanation: "Calico and Cilium are CNI plugins, and so is Flannel. CoreDNS serves cluster DNS, etcd stores cluster state, and Prometheus collects metrics.",
    },
    {
      id: "d2-06",
      domain: "d2",
      lesson: "d2-networking",
      prompt: "Which component serves DNS for Services and Pods in most Kubernetes clusters?",
      options: ["CoreDNS", "kube-proxy", "etcd", "The kubelet"],
      answer: [0],
      explanation: "CoreDNS, a CNCF graduated project, is the default cluster DNS server. It watches Services and EndpointSlices through the API.",
    },

    // ── Services and ingress ──
    {
      id: "d2-11",
      domain: "d2",
      lesson: "d2-services",
      prompt: "What type of Service do you get when you leave out the `type` field?",
      options: ["ClusterIP", "NodePort", "LoadBalancer", "ExternalName"],
      answer: [0],
      explanation: "ClusterIP is the default. It's a virtual IP you can only reach from inside the cluster.",
    },
    {
      id: "d2-12",
      domain: "d2",
      lesson: "d2-services",
      prompt: "An Ingress object was created with host and path rules, but requests to the host get no response. Nothing else was installed. What's missing?",
      options: ["An Ingress controller to implement the rules", "A second Service of type ExternalName", "A PersistentVolume", "A ClusterRoleBinding for the Ingress"],
      answer: [0],
      explanation: "An Ingress is only configuration. Something has to read it and act on it: an Ingress controller, or a Gateway API implementation for Gateways.",
    },
    {
      id: "d2-13",
      domain: "d2",
      lesson: "d2-services",
      prompt: "A StatefulSet's Pods each need their own DNS record so peers can reach each other by name. Which Service supports this?",
      options: ["A headless Service with clusterIP: None", "A NodePort Service", "A LoadBalancer Service", "An ExternalName Service for each of the Pods"],
      answer: [0],
      explanation: "A headless Service has no virtual IP, so DNS returns the Pod IPs. StatefulSet Pods then get names like db-0.db.namespace.svc.",
    },
    {
      id: "d2-14",
      domain: "d2",
      lesson: "d2-services",
      prompt: "Which Kubernetes API is the role-based next step after Ingress, with GatewayClass, Gateway and HTTPRoute resources?",
      options: ["Gateway API", "Service Mesh Interface", "EndpointSlice API", "Container Network Interface"],
      answer: [0],
      explanation: "Gateway API, from SIG Network, splits the work between infrastructure providers, cluster operators and app developers. It also supports richer routing than Ingress.",
    },
    {
      id: "d2-15",
      domain: "d2",
      lesson: "d2-services",
      prompt: "What does a service mesh such as Istio or Linkerd usually add to traffic between services? (Choose two.)",
      options: ["Mutual TLS between services", "Retries, timeouts, and traffic splitting without app code changes", "Persistent storage for Pods", "Scheduling Pods onto nodes", "Building container images"],
      answer: [0, 1],
      explanation: "A mesh puts proxies in the path of every request. They add encryption and identity, traffic control, and per-request telemetry. Storage, scheduling and image builds are other tools' jobs.",
    },
    {
      id: "d2-16",
      domain: "d2",
      lesson: "d2-services",
      prompt: "Which statement about a Service of type NodePort is correct?",
      options: [
        "It opens the same port on every node, by default in the range 30000–32767, and forwards to the Service",
        "It opens a port only on the node running the Pod, chosen at random from any free port above 1024 on that node",
        "It requires a cloud provider",
        "It routes by HTTP host name",
      ],
      answer: [0],
      explanation: "NodePort reserves one port across all nodes. LoadBalancer Services are built on top of it, and HTTP routing is Ingress's job.",
    },
    {
      id: "d2-17",
      domain: "d2",
      lesson: "d2-services",
      type: "match",
      prompt: "Match each requirement to the way to expose the app.",
      pairs: [
        ["Only other Pods call it", "ClusterIP"],
        ["Reach it on a fixed port of every node", "NodePort"],
        ["External IP from the cloud provider", "LoadBalancer"],
        ["Path-based HTTPS routing to several Services", "Ingress"],
        ["In-cluster alias for an outside hostname", "ExternalName"],
      ],
      explanation: "The Service types build on each other: ClusterIP, then NodePort on top, then LoadBalancer on top of that. Ingress adds HTTP routing, and ExternalName is only a DNS alias.",
    },
    {
      id: "d2-18",
      domain: "d2",
      lesson: "d2-services",
      type: "lines",
      prompt: "The Pods listen on port 8080 and are Ready, but calls to this Service time out. Tap the line that breaks it.",
      code: `apiVersion: v1
kind: Service
metadata:
  name: api
spec:
  selector:
    app: api
  ports:
  - port: 80
    targetPort: 9090`,
      codeLang: "yaml",
      answer: [10],
      explanation: "targetPort is the container port that traffic gets forwarded to, so it has to be 8080 here. Port 80 is the Service's own port, and it can stay as it is.",
    },
    {
      id: "d2-19",
      domain: "d2",
      lesson: "d2-services",
      prompt: "A Service's selector matches three Pods, but one of them is failing its readiness probe. Where does the Service send traffic?",
      options: ["Only to the two Ready Pods", "To all three Pods equally", "Only to the unready Pod until it recovers", "Nowhere until all three are Ready"],
      answer: [0],
      explanation: "Pods that aren't Ready are taken out of the Service's endpoints. Traffic only goes to Pods that pass readiness.",
    },

    // ── Security ──
    {
      id: "d2-21",
      domain: "d2",
      lesson: "d2-security",
      prompt: "A CI tool needs to read Pods in the `dev` namespace only. What's the least-privilege setup?",
      options: [
        "A Role allowing get, list, and watch on pods in dev, bound to the tool's ServiceAccount with a RoleBinding",
        "A ClusterRoleBinding to cluster-admin",
        "Add the tool to the system:masters group",
        "A ClusterRole allowing get, list, and watch on pods in all namespaces, bound to the tool with a ClusterRoleBinding",
      ],
      answer: [0],
      explanation: "A Role plus a RoleBinding in one namespace grants just those verbs, in just that namespace. The other options hand out far more power than the tool needs.",
    },
    {
      id: "d2-22",
      domain: "d2",
      lesson: "d2-security",
      prompt: "In what order does the API server process a request?",
      options: ["Authentication, authorization, admission control, then persistence to etcd", "Admission control, then authentication and authorization, then persistence to etcd", "Authorization, then authentication", "Persistence to etcd, then authorization"],
      answer: [0],
      explanation: "First the API server works out who you are. Then it checks your permissions with RBAC. Then mutating and validating admission run, and only then is the object stored.",
    },
    {
      id: "d2-23",
      domain: "d2",
      lesson: "d2-security",
      prompt: "No NetworkPolicies exist in a namespace. What traffic can reach its Pods?",
      options: ["All traffic from any Pod in the cluster", "No traffic at all", "Only traffic from the same namespace", "Only traffic from the kube-system namespace"],
      answer: [0],
      explanation: "Pods are open by default. They only become isolated once a NetworkPolicy selects them, and after that only the allowed traffic gets through.",
    },
    {
      id: "d2-24",
      domain: "d2",
      lesson: "d2-security",
      prompt: "What are the 4C's of cloud native security, from the outermost layer inward?",
      options: ["Cloud, Cluster, Container, Code", "Code, Container, Cluster, Cloud", "Cluster, Cloud, Code, Container", "Compute, Cluster, Container, Configuration"],
      answer: [0],
      explanation: "Each layer relies on the security of the one outside it: the cloud (or data center), then the cluster, then the container, and finally your code.",
    },
    {
      id: "d2-25",
      domain: "d2",
      lesson: "d2-security",
      prompt: "A namespace must reject Pods that run privileged, run as root or escalate privileges. Which built-in feature enforces this with a namespace label?",
      options: [
        "Pod Security Admission with the Restricted Pod Security Standard",
        "PodSecurityPolicy objects bound to the namespace's default ServiceAccount",
        "A ResourceQuota",
        "A NetworkPolicy",
      ],
      answer: [0],
      explanation: "Label the namespace pod-security.kubernetes.io/enforce=restricted. PodSecurityPolicy, the old approach, was removed in v1.25.",
    },
    {
      id: "d2-26",
      domain: "d2",
      lesson: "d2-security",
      prompt: "Which statements about RBAC are correct? (Choose two.)",
      options: [
        "A Role is namespaced; a ClusterRole is cluster-wide",
        "Permissions are additive; there are no deny rules",
        "A RoleBinding can grant rights in every namespace at once",
        "RBAC rules can block a specific user even if another rule allows them",
        "RBAC is configured in the kubelet",
      ],
      answer: [0, 1],
      explanation: "RBAC only grants, it never denies. A RoleBinding grants rights in one namespace, even when it points at a ClusterRole. A ClusterRoleBinding grants them cluster-wide.",
    },
    {
      id: "d2-27",
      domain: "d2",
      lesson: "d2-security",
      prompt: "Once a NetworkPolicy with an ingress rule selects a Pod, what happens to traffic coming in?",
      options: [
        "Only ingress traffic allowed by some policy reaches the Pod; everything else inbound is dropped",
        "All traffic to the Pod is still allowed; policies only log",
        "The Pod can no longer make outbound calls",
        "The policy is enforced by kube-proxy on every node, whichever CNI plugin is used",
      ],
      answer: [0],
      explanation: "Selected Pods become isolated in that direction, and the allowed traffic is everything any matching policy permits. Enforcement needs a CNI plugin that supports NetworkPolicy, not kube-proxy.",
    },
    {
      id: "d2-28",
      domain: "d2",
      lesson: "d2-security",
      prompt: "Which container securityContext settings limit the damage if a container is compromised? (Choose two.)",
      options: ["runAsNonRoot: true", "readOnlyRootFilesystem: true", "privileged: true", "allowPrivilegeEscalation: true", "hostNetwork: true on the Pod"],
      answer: [0, 1],
      explanation: "Running as non-root and making the root filesystem read-only both limit what an attacker can do. Privileged mode, privilege escalation and host networking give them more access, not less.",
    },
    {
      id: "d2-29",
      domain: "d2",
      lesson: "d2-security",
      prompt: "Which command checks whether the ServiceAccount `ci` in namespace `dev` may delete Deployments?",
      options: [
        "`kubectl auth can-i delete deployments -n dev --as=system:serviceaccount:dev:ci`",
        "`kubectl get rolebindings --delete`",
        "`kubectl describe serviceaccount ci --namespace=dev --show-permissions --verb=delete`",
        "`kubectl logs serviceaccount/ci`",
      ],
      answer: [0],
      explanation: "`kubectl auth can-i` checks RBAC for a verb and a resource. `--as` lets you ask on behalf of another identity.",
    },
    {
      id: "d2-30",
      domain: "d2",
      lesson: "d2-security",
      type: "order",
      prompt: "Put in order the stages a `kubectl create` request passes through inside the API server.",
      items: ["Authentication", "Authorization (RBAC)", "Mutating admission", "Validating admission", "Persisted to etcd"],
      explanation: "Identify the caller, check permissions, let mutating admission adjust the object, let validating admission accept or reject it, then store it.",
    },

    // ── Storage ──
    {
      id: "d2-31",
      domain: "d2",
      lesson: "d2-storage",
      prompt: "A developer creates a PersistentVolumeClaim that names a StorageClass. No PersistentVolume exists yet. What happens?",
      options: [
        "The StorageClass's provisioner dynamically creates a volume and binds it to the claim",
        "The claim fails immediately",
        "The claim borrows space from etcd",
        "An administrator is paged to create a matching PV by hand before the claim is able to bind",
      ],
      answer: [0],
      explanation: "Dynamic provisioning creates storage on demand from the StorageClass, usually through a CSI driver. Nobody has to create the volume by hand.",
    },
    {
      id: "d2-32",
      domain: "d2",
      lesson: "d2-storage",
      prompt: "A cache needs scratch space shared by the containers in a Pod, and it's fine to throw it away when the Pod goes. Which volume type fits?",
      options: ["emptyDir", "A PersistentVolumeClaim with Retain", "hostPath", "A ConfigMap volume"],
      answer: [0],
      explanation: "An emptyDir is created when the Pod starts on a node and deleted when the Pod is removed. Every container in the Pod can share it.",
    },
    {
      id: "d2-33",
      domain: "d2",
      lesson: "d2-storage",
      prompt: "Which standard lets storage vendors ship Kubernetes volume drivers without changing Kubernetes code?",
      options: ["Container Storage Interface (CSI)", "Container Runtime Interface (CRI)", "Container Network Interface (CNI)", "OCI distribution spec"],
      answer: [0],
      explanation: "CSI drivers run as Pods and handle provisioning, attaching and mounting for their storage systems. CRI is for runtimes and CNI is for networking.",
    },
    {
      id: "d2-34",
      domain: "d2",
      lesson: "d2-storage",
      prompt: "A team must keep the underlying disk after its PersistentVolumeClaim is deleted, so someone can inspect it by hand. Which reclaim policy should the volume use?",
      options: ["Retain", "Delete", "Recycle", "Immediate"],
      answer: [0],
      explanation: "Retain leaves the PersistentVolume and its data in place after the claim is gone. Delete, the default for dynamic provisioning, removes the storage.",
    },
    {
      id: "d2-35",
      domain: "d2",
      lesson: "d2-storage",
      prompt: "Which statements about PersistentVolumes and PersistentVolumeClaims are correct? (Choose two.)",
      options: [
        "PersistentVolumes are cluster-scoped; PersistentVolumeClaims are namespaced",
        "A Pod uses storage by referencing a PersistentVolumeClaim",
        "PersistentVolumeClaims are created by the kubelet automatically for every Pod",
        "A PersistentVolume always lives in the kube-system namespace",
        "Deleting a Pod always deletes its PersistentVolumeClaim",
      ],
      answer: [0, 1],
      explanation: "Claims are namespaced requests that Pods point to. PersistentVolumes are cluster-wide resources that get bound to claims. And a claim outlives the Pods that use it.",
    },
    {
      id: "d2-36",
      domain: "d2",
      lesson: "d2-storage",
      type: "match",
      prompt: "Match each access mode to what it allows.",
      pairs: [
        ["ReadWriteOnce", "Read-write by a single node"],
        ["ReadOnlyMany", "Read-only by many nodes"],
        ["ReadWriteMany", "Read-write by many nodes"],
        ["ReadWriteOncePod", "Read-write by a single Pod"],
      ],
      explanation: "Access modes describe how a volume can be mounted. Which ones you can use depends on the storage backend.",
    },

    // ── Troubleshooting ──
    {
      id: "d2-41",
      domain: "d2",
      lesson: "d2-troubleshooting",
      prompt: "A Pod shows the status CrashLoopBackOff. Which command most directly shows why the container keeps exiting?",
      options: ["`kubectl logs <pod> --previous`", "`kubectl get nodes`", "`kubectl api-resources`", "`kubectl get storageclass`"],
      answer: [0],
      explanation: "The container keeps exiting and restarting. `--previous` shows the logs from the last run that ended, which is usually where the error is.",
    },
    {
      id: "d2-42",
      domain: "d2",
      lesson: "d2-troubleshooting",
      prompt: "An app needs a moment to warm its cache after starting, and shouldn't get traffic until then. Which probe should the developer set up?",
      options: ["A readiness probe", "A liveness probe", "No probe; Services wait automatically", "A PodDisruptionBudget"],
      answer: [0],
      explanation: "Readiness decides whether the Pod is in the Service's endpoints. A failing liveness probe would restart the container instead, which isn't what you want here.",
    },
    {
      id: "d2-43",
      domain: "d2",
      lesson: "d2-troubleshooting",
      prompt: "A Pod is stuck in ImagePullBackOff. What are the most likely causes? (Choose two.)",
      options: [
        "The image name or tag is wrong or doesn't exist",
        "The image is in a private registry and no imagePullSecret is configured",
        "The container ran out of memory",
        "The readiness probe is failing",
        "The Service selector is wrong",
      ],
      answer: [0, 1],
      explanation: "Pull errors come from a bad image reference or missing registry credentials. `kubectl describe pod` shows the exact error under Events.",
    },
    {
      id: "d2-44",
      domain: "d2",
      lesson: "d2-troubleshooting",
      prompt: "A Pod has been Pending for ten minutes. Where are you most likely to find the reason?",
      options: ["In the Events section of `kubectl describe pod`", "In `kubectl logs`, because the container has written its error", "In the Service's EndpointSlice", "In the kubeconfig file"],
      answer: [0],
      explanation: "A Pending Pod usually hasn't been scheduled yet, so its containers never ran and there are no logs. The scheduler records FailedScheduling events instead.",
    },
    {
      id: "d2-45",
      domain: "d2",
      lesson: "d2-troubleshooting",
      prompt: "A web server sometimes deadlocks: the process stays up but stops answering. What makes Kubernetes restart it automatically?",
      options: ["A liveness probe that checks an HTTP endpoint", "A readiness probe only", "A larger memory request and limit for the container", "A NodePort Service"],
      answer: [0],
      explanation: "When a liveness probe fails several times in a row, the kubelet kills the container and starts it again. A readiness probe alone would only stop traffic to it.",
    },
    {
      id: "d2-46",
      domain: "d2",
      lesson: "d2-troubleshooting",
      prompt: "A container exits with code 137 and the reason OOMKilled. What's the best first step?",
      options: ["Check memory usage and raise the memory limit or fix the leak", "Raise the CPU limit", "Change the Service type to LoadBalancer so traffic reaches healthier nodes", "Add a toleration"],
      answer: [0],
      explanation: "The container used more memory than its limit allows. Either size the limit to what it really uses, or fix the code that's eating memory.",
    },
    {
      id: "d2-47",
      domain: "d2",
      lesson: "d2-troubleshooting",
      type: "lines",
      prompt: "The app listens on port 8080, but this Pod never becomes Ready. Tap the line that causes it.",
      code: `containers:
- name: web
  image: example/web:3.2
  ports:
  - containerPort: 8080
  readinessProbe:
    httpGet:
      path: /healthz
      port: 8081
    periodSeconds: 5`,
      codeLang: "yaml",
      answer: [9],
      explanation: "The readiness probe checks port 8081, where nothing is listening. So it always fails and the Pod never joins the Service. It should probe 8080.",
    },
    {
      id: "d2-48",
      domain: "d2",
      lesson: "d2-troubleshooting",
      prompt: "A container is running and the developer wants a shell inside it to check a config file. Which command does that?",
      options: ["`kubectl exec -it <pod> -- sh`", "`kubectl attach node <node>`", "`kubectl describe pod <pod> --shell`", "`kubectl port-forward <pod> sh`"],
      answer: [0],
      explanation: "`kubectl exec` runs a command inside a running container, and `-it` makes it interactive so you can type into the shell.",
    },
    {
      id: "d2-49",
      domain: "d2",
      lesson: "d2-troubleshooting",
      type: "order",
      prompt: "A user reports that an app is down. Put a sensible troubleshooting path in order, from broad to specific.",
      items: [
        "`kubectl get pods` to see status and restarts",
        "`kubectl describe pod` to read events and state",
        "`kubectl logs` (with --previous if it restarted)",
        "`kubectl exec` into the container to inspect it",
      ],
      explanation: "Find the failing Pod, read its events, read the app's own output, and then step inside if it's still running.",
    },
    {
      id: "d2-50",
      domain: "d2",
      lesson: "d2-troubleshooting",
      prompt: "A Pod shows CreateContainerConfigError right after deployment. What's a likely cause?",
      options: [
        "It references a ConfigMap or Secret (or a key in one) that doesn't exist",
        "The node is out of disk space for container logs, so the kubelet can't start it",
        "The image tag is wrong",
        "The HPA scaled it to zero",
      ],
      answer: [0],
      explanation: "The kubelet can't put together the container's configuration when a ConfigMap, Secret or key it points to is missing. A wrong image tag would show as an image pull error instead.",
    },
  ],

  cards: [
    { id: "k-coredns", domain: "d2", kind: "service", term: "CoreDNS", definition: "The cluster DNS server. It turns Service names into IPs." },
    { id: "k-calico", domain: "d2", kind: "service", term: "Calico", definition: "A CNI plugin for Pod networking that also enforces NetworkPolicy." },
    { id: "k-cilium", domain: "d2", kind: "service", term: "Cilium", definition: "An eBPF-based CNI plugin for networking, policy and observability." },
    { id: "k-flannel", domain: "d2", kind: "service", term: "Flannel", definition: "A simple overlay CNI plugin for Pod networking." },
    { id: "k-istio", domain: "d2", kind: "service", term: "Istio", definition: "A service mesh that adds mTLS, traffic management and telemetry." },
    { id: "k-linkerd", domain: "d2", kind: "service", term: "Linkerd", definition: "A lightweight service mesh with automatic mTLS." },
    { id: "k-envoy", domain: "d2", kind: "service", term: "Envoy", definition: "A fast proxy used inside many meshes and gateways." },
    { id: "k-gatekeeper", domain: "d2", kind: "service", term: "OPA Gatekeeper", definition: "A policy engine that enforces Rego policies at admission." },
    { id: "k-kyverno", domain: "d2", kind: "service", term: "Kyverno", definition: "A Kubernetes-native policy engine where policies are written in YAML." },
    { id: "k-falco", domain: "d2", kind: "service", term: "Falco", definition: "Runtime security. It spots suspicious behaviour inside running containers." },
    { id: "c-service", domain: "d2", kind: "concept", term: "Service", definition: "A stable virtual IP and DNS name in front of a set of Ready Pods." },
    { id: "c-headless", domain: "d2", kind: "concept", term: "Headless Service", definition: "Set clusterIP: None, and DNS returns the Pod IPs directly." },
    { id: "c-ingress", domain: "d2", kind: "concept", term: "Ingress", definition: "Routes HTTP and HTTPS by host and path. It needs an Ingress controller to work." },
    { id: "c-gateway", domain: "d2", kind: "concept", term: "Gateway API", definition: "A role-based routing API made of GatewayClass, Gateway and HTTPRoute." },
    { id: "c-cni", domain: "d2", kind: "concept", term: "CNI", definition: "The plugin standard that wires up Pod networking." },
    { id: "c-rbac", domain: "d2", kind: "concept", term: "RBAC", definition: "Roles list the allowed verbs, and bindings give those roles to users or apps." },
    { id: "c-sa", domain: "d2", kind: "concept", term: "ServiceAccount", definition: "The identity a Pod uses when it calls the Kubernetes API." },
    { id: "c-pss", domain: "d2", kind: "concept", term: "Pod Security Standards", definition: "Three profiles, Privileged, Baseline and Restricted, enforced per namespace." },
    { id: "c-netpol", domain: "d2", kind: "concept", term: "NetworkPolicy", definition: "Allow-list rules for Pod traffic. It needs a CNI plugin that supports it." },
    { id: "c-pvc", domain: "d2", kind: "concept", term: "PersistentVolumeClaim", definition: "A namespaced request for storage that a Pod mounts." },
    { id: "c-storageclass", domain: "d2", kind: "concept", term: "StorageClass", definition: "Names a provisioner and its settings for creating volumes on demand." },
    { id: "c-csi", domain: "d2", kind: "concept", term: "CSI", definition: "The standard interface for storage drivers." },
    { id: "c-probes", domain: "d2", kind: "concept", term: "Liveness versus readiness", definition: "A failed liveness probe restarts the container. A failed readiness probe takes the Pod out of the Service." },
    { id: "c-crashloop", domain: "d2", kind: "concept", term: "CrashLoopBackOff", definition: "The container keeps exiting, and Kubernetes waits longer before each restart." },
  ],

  challenges: [
    {
      id: "ch-expose-app",
      domain: "d2",
      lesson: "d2-services",
      title: "Expose the app",
      goal: "Pick the right way to expose all six workloads: an internal API, a lab NodePort, a game server, HTTP routing, an external database alias, and StatefulSet peers.",
      hint: "For each one, ask who is calling (inside or outside the cluster), over what (plain TCP or HTTP routes), and whether each Pod needs its own name.",
      takeaway: "ClusterIP for inside the cluster, NodePort and LoadBalancer for outside, Ingress or Gateway API for HTTP routing, ExternalName for an outside alias, and headless for per-Pod DNS.",
      render: (onSolved) => <ServiceTypeLab goal="all" onSolved={onSolved} />,
    },
  ],
});
