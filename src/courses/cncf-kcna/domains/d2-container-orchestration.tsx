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
    summary: "Pod networking, CNI, Services, DNS, Ingress and Gateway API, service mesh, RBAC and Pod security, NetworkPolicy, volumes and storage, and troubleshooting Pods.",
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
              { icon: "🌐", title: "One IP per Pod", text: "Every Pod gets its own cluster-wide IP. Pods reach each other directly, across nodes, without NAT.", color: "#14b8a6" },
              { icon: "🔌", title: "CNI plugin", text: "Calico, Cilium, Flannel, and others implement the model: they wire Pod interfaces and assign IPs.", color: "#14b8a6" },
              { icon: "🧭", title: "CoreDNS", text: "Every Service gets a DNS name: <service>.<namespace>.svc.cluster.local.", color: "#14b8a6" },
            ]}
          />
          <Flow
            color="#14b8a6"
            steps={[
              { icon: "📦", label: "Pod in shop", sub: "curl http://payments.billing" },
              { icon: "🧭", label: "CoreDNS", sub: "payments.billing.svc.cluster.local → ClusterIP" },
              { icon: "🔀", label: "kube-proxy rules", sub: "ClusterIP → one Ready Pod IP" },
              { icon: "📦", label: "payments Pod" },
            ]}
          />
        </div>
      ),
      points: [
        "Kubernetes defines the network model; a CNI plugin implements it. Without a CNI plugin, Pods on a new cluster can't get networking.",
        "Pod IPs change when Pods are replaced, so clients use a Service's stable virtual IP and DNS name instead.",
        "Within the same namespace the short Service name works (http://payments); across namespaces add the namespace (payments.billing).",
        "EndpointSlices list the Ready Pod IPs behind each Service; kube-proxy (or a CNI that replaces it) programs the forwarding rules.",
      ],
      tip: "Service DNS pattern: my-svc.my-namespace.svc.cluster.local.",
    },
    {
      id: "d2-services",
      task: "2.1",
      title: "Services, Ingress, Gateway API, and service mesh",
      check: ["d2-11", "d2-12"],
      visual: (
        <div className="grid gap-4">
          <ServiceTypeLab />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🚪", title: "Gateway API", text: "Role-oriented successor to Ingress: GatewayClass (infra provider), Gateway (cluster operator), HTTPRoute and friends (app teams).", color: "#38bdf8" },
              { icon: "🕸️", title: "Service mesh", text: "Istio, Linkerd: proxies (sidecars or node-level) add mutual TLS, retries, traffic splitting, and per-request telemetry without app changes.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "ClusterIP (default) is internal only. NodePort adds a port on every node (30000–32767 by default). LoadBalancer adds a cloud load balancer on top.",
        "ExternalName returns a CNAME to an outside hostname. A headless Service (clusterIP: None) returns Pod IPs directly.",
        "An Ingress resource does nothing on its own: an Ingress controller must be installed to serve it. The Ingress API is stable but frozen; new features go into Gateway API.",
        "Services only send traffic to Pods that match the selector and are Ready.",
      ],
      tip: "\"Host- or path-based HTTP routing with TLS\" → Ingress or Gateway API, not a Service type.",
    },
    {
      id: "d2-security",
      task: "2.2",
      title: "Security: RBAC, Pod security, and NetworkPolicy",
      check: ["d2-21", "d2-22"],
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
            caption="Only Pods labeled app=web may reach the api Pods, and only on port 8080. Everything else inbound is dropped."
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
              { icon: "⚖️", label: "Authorization", sub: "May you do this? RBAC" },
              { icon: "🛂", label: "Admission", sub: "Mutate, then validate (Pod Security, policies)" },
              { icon: "🗃️", label: "Persist to etcd" },
            ]}
          />
        </div>
      ),
      points: [
        "RBAC: a Role (namespaced) or ClusterRole (cluster-wide) lists allowed verbs on resources; a RoleBinding or ClusterRoleBinding grants it to users, groups, or ServiceAccounts. RBAC only allows; there are no deny rules.",
        "Pods authenticate to the API as a ServiceAccount. Give each app its own ServiceAccount with only the permissions it needs.",
        "Pod Security Standards define Privileged, Baseline, and Restricted profiles; Pod Security Admission enforces them per namespace with labels.",
        "By default every Pod can reach every other Pod. A NetworkPolicy that selects a Pod makes it deny all traffic except what is allowed, and it needs a CNI plugin that enforces policies.",
      ],
      tip: "\"Can this user delete Pods?\" → kubectl auth can-i delete pods --as=<user> -n <namespace>.",
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
              { icon: "🏭", label: "StorageClass", sub: "Provisioner (a CSI driver) + parameters" },
              { icon: "💾", label: "PersistentVolume", sub: "Created and bound automatically" },
            ]}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🫧", title: "Ephemeral", text: "emptyDir lives and dies with the Pod; configMap and secret volumes project config as files.", color: "#f59e0b" },
              { icon: "🔐", title: "Access modes", text: "ReadWriteOnce (one node), ReadOnlyMany, ReadWriteMany (many nodes), ReadWriteOncePod (one Pod).", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "A PersistentVolume is a piece of storage in the cluster (cluster-scoped); a PersistentVolumeClaim is a namespaced request for it.",
        "With dynamic provisioning, a claim that names a StorageClass gets a new volume created on demand; no admin pre-creates PVs.",
        "The reclaim policy decides what happens after the claim is deleted: Delete removes the storage (the default for dynamic provisioning), Retain keeps it for manual cleanup.",
        "CSI is the standard plugin interface for storage, so vendors ship drivers outside the Kubernetes code base.",
      ],
      tip: "Pod stuck Pending with an \"unbound PersistentVolumeClaim\" event → check the claim's StorageClass, size, and access mode.",
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
              { icon: "💓", title: "Liveness probe", text: "Fails → the kubelet restarts the container. For deadlocks and hung processes.", color: "#fb7185" },
              { icon: "🚦", title: "Readiness probe", text: "Fails → the Pod is removed from Service endpoints until it passes again. No restart.", color: "#38bdf8" },
              { icon: "🐢", title: "Startup probe", text: "Holds off the other probes until a slow app has started.", color: "#fbbf24" },
            ]}
          />
        </div>
      ),
      points: [
        "Start wide, then narrow: kubectl get pods → kubectl describe pod (events) → kubectl logs (add --previous for the crashed run) → kubectl exec into a running container.",
        "kubectl get events --sort-by=.metadata.creationTimestamp shows what happened recently in a namespace.",
        "Exit code 137 usually means the container was killed (often OOMKilled); a failing liveness probe also causes restarts.",
        "If a Service returns nothing, check that its selector matches Pod labels, its targetPort matches the container port, and the Pods are Ready.",
      ],
      tip: "Restarting over and over → logs --previous. Never started → describe and read the Events.",
    },
  ],

  questions: [
    // ── Networking ──
    {
      id: "d2-01",
      domain: "d2",
      lesson: "d2-networking",
      prompt: "In the Kubernetes network model, how do Pods on different nodes communicate?",
      options: ["Directly by Pod IP, without NAT", "Only through a NodePort Service", "Only through the API server", "They can't; Pods talk only to Pods on the same node"],
      answer: [0],
      explanation: "Kubernetes requires a flat network where every Pod can reach every other Pod by IP without NAT. A CNI plugin implements it.",
    },
    {
      id: "d2-02",
      domain: "d2",
      lesson: "d2-networking",
      prompt: "A Pod in namespace `shop` needs to call the Service `payments` in namespace `billing`. Which hostname resolves correctly through cluster DNS?",
      options: ["payments.billing.svc.cluster.local", "billing.payments.cluster.local", "payments.shop.svc.cluster.local", "svc.payments.billing"],
      answer: [0],
      explanation: "Service DNS names follow <service>.<namespace>.svc.<cluster-domain>; cluster.local is the default domain. payments.billing also works as a short form.",
    },
    {
      id: "d2-03",
      domain: "d2",
      lesson: "d2-networking",
      prompt: "A new cluster's nodes show NotReady and Pods have no IP addresses. What has most likely not been installed?",
      options: ["A CNI network plugin", "Helm", "A metrics server", "An Ingress controller"],
      answer: [0],
      explanation: "Kubernetes leaves Pod networking to CNI plugins. Until one is installed, Pod networking isn't set up and nodes report the network as not ready.",
    },
    {
      id: "d2-04",
      domain: "d2",
      lesson: "d2-networking",
      prompt: "Why do clients connect to a Service instead of directly to Pod IP addresses?",
      options: [
        "Pod IPs change as Pods are replaced, while a Service keeps a stable virtual IP and DNS name and load-balances across Ready Pods",
        "Pod IPs can't be reached from other Pods",
        "Services encrypt all traffic by default",
        "Pods don't have IP addresses",
      ],
      answer: [0],
      explanation: "Pods are disposable and get new IPs. Services give a stable front and track the current healthy endpoints.",
    },
    {
      id: "d2-05",
      domain: "d2",
      lesson: "d2-networking",
      prompt: "Which projects are CNI plugins that provide Pod networking? (Choose two.)",
      options: ["Calico", "Cilium", "CoreDNS", "etcd", "Prometheus"],
      answer: [0, 1],
      explanation: "Calico and Cilium (and Flannel, among others) are CNI plugins. CoreDNS serves cluster DNS, etcd stores state, and Prometheus collects metrics.",
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
      prompt: "What type of Service is created when the `type` field is omitted?",
      options: ["ClusterIP", "NodePort", "LoadBalancer", "ExternalName"],
      answer: [0],
      explanation: "ClusterIP is the default: a virtual IP reachable only from inside the cluster.",
    },
    {
      id: "d2-12",
      domain: "d2",
      lesson: "d2-services",
      prompt: "An Ingress object was created with host and path rules, but requests to the host get no response. Nothing else was installed. What is missing?",
      options: ["An Ingress controller to implement the rules", "A second Service of type ExternalName", "A PersistentVolume", "A ClusterRoleBinding for the Ingress"],
      answer: [0],
      explanation: "Ingress is only configuration. An Ingress controller (or a Gateway API implementation for Gateways) must run in the cluster to act on it.",
    },
    {
      id: "d2-13",
      domain: "d2",
      lesson: "d2-services",
      prompt: "A StatefulSet's Pods need individual DNS records so peers can address each other by name. Which Service supports this?",
      options: ["A headless Service with clusterIP: None", "A NodePort Service", "A LoadBalancer Service", "An ExternalName Service"],
      answer: [0],
      explanation: "A headless Service skips the virtual IP; DNS returns Pod IPs, and StatefulSet Pods get names like db-0.db.namespace.svc.",
    },
    {
      id: "d2-14",
      domain: "d2",
      lesson: "d2-services",
      prompt: "Which Kubernetes API is the role-oriented evolution of Ingress, with GatewayClass, Gateway, and HTTPRoute resources?",
      options: ["Gateway API", "Service Mesh Interface", "EndpointSlice API", "Container Network Interface"],
      answer: [0],
      explanation: "Gateway API, from SIG Network, splits responsibilities between infrastructure providers, cluster operators, and app developers, and supports richer routing.",
    },
    {
      id: "d2-15",
      domain: "d2",
      lesson: "d2-services",
      prompt: "What does a service mesh such as Istio or Linkerd typically add to service-to-service traffic? (Choose two.)",
      options: ["Mutual TLS between services", "Retries, timeouts, and traffic splitting without app code changes", "Persistent storage for Pods", "Scheduling Pods onto nodes", "Building container images"],
      answer: [0, 1],
      explanation: "Meshes put proxies in the data path to add encryption and identity, traffic management, and per-request telemetry.",
    },
    {
      id: "d2-16",
      domain: "d2",
      lesson: "d2-services",
      prompt: "Which statement about a Service of type NodePort is correct?",
      options: [
        "It opens the same port on every node, by default in the range 30000–32767, and forwards to the Service",
        "It opens a port only on the node running the Pod",
        "It requires a cloud provider",
        "It routes by HTTP host name",
      ],
      answer: [0],
      explanation: "NodePort reserves a port across all nodes. LoadBalancer Services build on it, and Ingress handles HTTP routing.",
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
      explanation: "Service types build on each other (ClusterIP → NodePort → LoadBalancer); Ingress adds HTTP routing; ExternalName is DNS only.",
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
      explanation: "targetPort is the container port traffic is forwarded to. It must be 8080 here; port 80 is the Service's own port, which can stay as it is.",
    },
    {
      id: "d2-19",
      domain: "d2",
      lesson: "d2-services",
      prompt: "A Service's selector matches three Pods, but one of them is failing its readiness probe. Where does the Service send traffic?",
      options: ["Only to the two Ready Pods", "To all three Pods equally", "Only to the unready Pod until it recovers", "Nowhere until all three are Ready"],
      answer: [0],
      explanation: "Unready Pods are removed from the Service's endpoints, so traffic goes only to Pods that pass readiness.",
    },

    // ── Security ──
    {
      id: "d2-21",
      domain: "d2",
      lesson: "d2-security",
      prompt: "A CI tool needs to read Pods in the `dev` namespace only. What is the least-privilege setup?",
      options: [
        "A Role allowing get, list, and watch on pods in dev, bound to the tool's ServiceAccount with a RoleBinding",
        "A ClusterRoleBinding to cluster-admin",
        "Add the tool to the system:masters group",
        "Give it the kubelet's client certificate",
      ],
      answer: [0],
      explanation: "A namespaced Role plus RoleBinding grants just those verbs in just that namespace.",
    },
    {
      id: "d2-22",
      domain: "d2",
      lesson: "d2-security",
      prompt: "In what order does the API server process a request?",
      options: ["Authentication, authorization, admission control, then persistence to etcd", "Admission control, authentication, authorization", "Authorization, then authentication", "Persistence to etcd, then authorization"],
      answer: [0],
      explanation: "The API server first identifies the caller, then checks permissions (RBAC), then runs mutating and validating admission before storing the object.",
    },
    {
      id: "d2-23",
      domain: "d2",
      lesson: "d2-security",
      prompt: "No NetworkPolicies exist in a namespace. What traffic is allowed to its Pods?",
      options: ["All traffic from any Pod in the cluster", "No traffic at all", "Only traffic from the same namespace", "Only traffic from the kube-system namespace"],
      answer: [0],
      explanation: "Pods are non-isolated by default. They become isolated only when a NetworkPolicy selects them, and then only allowed traffic gets through.",
    },
    {
      id: "d2-24",
      domain: "d2",
      lesson: "d2-security",
      prompt: "Which are the 4C's of cloud native security, from the outermost layer inward?",
      options: ["Cloud, Cluster, Container, Code", "Code, Container, Cluster, Cloud", "Cluster, Cloud, Code, Container", "Compute, Cluster, Container, Configuration"],
      answer: [0],
      explanation: "Each layer builds on the security of the layer outside it: cloud (or data center), cluster, container, and finally your code.",
    },
    {
      id: "d2-25",
      domain: "d2",
      lesson: "d2-security",
      prompt: "A namespace must reject Pods that run as privileged, run as root, or escalate privileges. Which built-in mechanism enforces this with a namespace label?",
      options: [
        "Pod Security Admission with the Restricted Pod Security Standard",
        "PodSecurityPolicy",
        "A ResourceQuota",
        "A NetworkPolicy",
      ],
      answer: [0],
      explanation: "Label the namespace pod-security.kubernetes.io/enforce=restricted. PodSecurityPolicy was removed in v1.25.",
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
      explanation: "RBAC only grants. A RoleBinding grants within one namespace (even when it references a ClusterRole); a ClusterRoleBinding grants cluster-wide.",
    },
    {
      id: "d2-27",
      domain: "d2",
      lesson: "d2-security",
      prompt: "Which NetworkPolicy behaviour is correct once a policy with an ingress rule selects a Pod?",
      options: [
        "Only ingress traffic allowed by some policy reaches the Pod; everything else inbound is dropped",
        "All traffic to the Pod is still allowed; policies only log",
        "The Pod can no longer make outbound calls",
        "The policy is enforced by kube-proxy regardless of the CNI plugin",
      ],
      answer: [0],
      explanation: "Selected Pods become isolated for the policy's direction; the allowed traffic is the union of all matching policies. Enforcement needs a CNI plugin that supports NetworkPolicy.",
    },
    {
      id: "d2-28",
      domain: "d2",
      lesson: "d2-security",
      prompt: "Which container securityContext settings reduce the impact of a compromised container? (Choose two.)",
      options: ["runAsNonRoot: true", "readOnlyRootFilesystem: true", "privileged: true", "allowPrivilegeEscalation: true", "hostNetwork: true on the Pod"],
      answer: [0, 1],
      explanation: "Running as non-root and making the root filesystem read-only limit what an attacker can do. Privileged mode, privilege escalation, and host networking widen access.",
    },
    {
      id: "d2-29",
      domain: "d2",
      lesson: "d2-security",
      prompt: "Which command checks whether the ServiceAccount `ci` in namespace `dev` may delete Deployments?",
      options: [
        "`kubectl auth can-i delete deployments -n dev --as=system:serviceaccount:dev:ci`",
        "`kubectl get rolebindings --delete`",
        "`kubectl describe serviceaccount ci --verbs`",
        "`kubectl logs serviceaccount/ci`",
      ],
      answer: [0],
      explanation: "kubectl auth can-i evaluates RBAC for a verb and resource; --as impersonates another identity.",
    },
    {
      id: "d2-30",
      domain: "d2",
      lesson: "d2-security",
      type: "order",
      prompt: "Order the stages a `kubectl create` request passes through inside the API server.",
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
        "An administrator is paged to create a PV by hand",
      ],
      answer: [0],
      explanation: "Dynamic provisioning creates storage on demand from the StorageClass, usually through a CSI driver.",
    },
    {
      id: "d2-32",
      domain: "d2",
      lesson: "d2-storage",
      prompt: "A cache needs scratch space that is shared by the containers in a Pod and can be discarded when the Pod goes away. Which volume type fits?",
      options: ["emptyDir", "A PersistentVolumeClaim with Retain", "hostPath", "A ConfigMap volume"],
      answer: [0],
      explanation: "emptyDir is created when the Pod starts on a node and deleted when the Pod is removed. It's shared by all containers in the Pod.",
    },
    {
      id: "d2-33",
      domain: "d2",
      lesson: "d2-storage",
      prompt: "Which standard lets storage vendors ship Kubernetes volume drivers without changing Kubernetes code?",
      options: ["Container Storage Interface (CSI)", "Container Runtime Interface (CRI)", "Container Network Interface (CNI)", "OCI distribution spec"],
      answer: [0],
      explanation: "CSI drivers run as Pods and implement provisioning, attaching, and mounting for their storage systems.",
    },
    {
      id: "d2-34",
      domain: "d2",
      lesson: "d2-storage",
      prompt: "A team must keep the underlying disk even after its PersistentVolumeClaim is deleted, so it can be inspected manually. Which reclaim policy should the volume use?",
      options: ["Retain", "Delete", "Recycle", "Immediate"],
      answer: [0],
      explanation: "Retain leaves the PersistentVolume and its data in place after the claim is gone. Delete (the dynamic provisioning default) removes the storage.",
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
      explanation: "Claims are namespaced requests that Pods reference; PVs are cluster resources bound to claims. Claims outlive Pods.",
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
      explanation: "Access modes describe how a volume can be mounted. Support depends on the storage backend.",
    },

    // ── Troubleshooting ──
    {
      id: "d2-41",
      domain: "d2",
      lesson: "d2-troubleshooting",
      prompt: "A Pod shows the status CrashLoopBackOff. Which command most directly shows why the container is exiting?",
      options: ["`kubectl logs <pod> --previous`", "`kubectl get nodes`", "`kubectl api-resources`", "`kubectl get storageclass`"],
      answer: [0],
      explanation: "The container keeps exiting and restarting; --previous shows the logs of the last terminated run, where the error usually is.",
    },
    {
      id: "d2-42",
      domain: "d2",
      lesson: "d2-troubleshooting",
      prompt: "An app takes a moment to warm its cache after starting, and it should receive no traffic until then. Which probe should the developer configure?",
      options: ["A readiness probe", "A liveness probe", "No probe; Services wait automatically", "A PodDisruptionBudget"],
      answer: [0],
      explanation: "Readiness controls whether the Pod is in the Service's endpoints. A failing liveness probe would restart the container instead.",
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
      explanation: "Pull errors come from bad references or missing registry credentials. kubectl describe pod shows the exact error in Events.",
    },
    {
      id: "d2-44",
      domain: "d2",
      lesson: "d2-troubleshooting",
      prompt: "A Pod has been Pending for ten minutes. Where will you most likely find the reason?",
      options: ["In the Events section of `kubectl describe pod`", "In `kubectl logs`, because the container has written its error", "In the Service's EndpointSlice", "In the kubeconfig file"],
      answer: [0],
      explanation: "A Pending Pod usually hasn't been scheduled, so its containers never ran and have no logs. The scheduler records FailedScheduling events.",
    },
    {
      id: "d2-45",
      domain: "d2",
      lesson: "d2-troubleshooting",
      prompt: "A web server sometimes deadlocks: the process stays up but stops answering. What makes Kubernetes restart it automatically?",
      options: ["A liveness probe that checks an HTTP endpoint", "A readiness probe only", "A larger memory request", "A NodePort Service"],
      answer: [0],
      explanation: "When a liveness probe fails repeatedly, the kubelet kills and restarts the container.",
    },
    {
      id: "d2-46",
      domain: "d2",
      lesson: "d2-troubleshooting",
      prompt: "A container exits with code 137 and the reason OOMKilled. What is the best first action?",
      options: ["Check memory usage and raise the memory limit or fix the leak", "Raise the CPU limit", "Change the Service type", "Add a toleration"],
      answer: [0],
      explanation: "The container exceeded its memory limit. Size the limit to real usage or fix the code that's using too much memory.",
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
      explanation: "The readiness probe checks port 8081, where nothing listens, so it always fails and the Pod stays out of the Service. It should probe 8080.",
    },
    {
      id: "d2-48",
      domain: "d2",
      lesson: "d2-troubleshooting",
      prompt: "A container is running and the developer wants a shell inside it to check a config file. Which command does that?",
      options: ["`kubectl exec -it <pod> -- sh`", "`kubectl attach node <node>`", "`kubectl describe pod <pod> --shell`", "`kubectl port-forward <pod> sh`"],
      answer: [0],
      explanation: "kubectl exec runs a command inside a running container; -it makes it interactive.",
    },
    {
      id: "d2-49",
      domain: "d2",
      lesson: "d2-troubleshooting",
      type: "order",
      prompt: "A user reports that an app is down. Order a sensible troubleshooting path from broad to specific.",
      items: [
        "`kubectl get pods` to see status and restarts",
        "`kubectl describe pod` to read events and state",
        "`kubectl logs` (with --previous if it restarted)",
        "`kubectl exec` into the container to inspect it",
      ],
      explanation: "Find the failing Pod, read its events, read the app's own output, then step inside if it's still running.",
    },
    {
      id: "d2-50",
      domain: "d2",
      lesson: "d2-troubleshooting",
      prompt: "A Pod shows CreateContainerConfigError right after deployment. What is a likely cause?",
      options: [
        "It references a ConfigMap or Secret (or a key in one) that doesn't exist",
        "The node is out of disk space for logs",
        "The image tag is wrong",
        "The HPA scaled it to zero",
      ],
      answer: [0],
      explanation: "The kubelet can't build the container's configuration when a referenced ConfigMap, Secret, or key is missing.",
    },
  ],

  cards: [
    { id: "k-coredns", domain: "d2", kind: "service", term: "CoreDNS", definition: "Cluster DNS server; resolves Service names to IPs" },
    { id: "k-calico", domain: "d2", kind: "service", term: "Calico", definition: "CNI plugin for Pod networking and NetworkPolicy enforcement" },
    { id: "k-cilium", domain: "d2", kind: "service", term: "Cilium", definition: "eBPF-based CNI plugin for networking, policy, and observability" },
    { id: "k-flannel", domain: "d2", kind: "service", term: "Flannel", definition: "Simple overlay CNI plugin for Pod networking" },
    { id: "k-istio", domain: "d2", kind: "service", term: "Istio", definition: "Service mesh: mTLS, traffic management, and telemetry" },
    { id: "k-linkerd", domain: "d2", kind: "service", term: "Linkerd", definition: "Lightweight service mesh with automatic mTLS" },
    { id: "k-envoy", domain: "d2", kind: "service", term: "Envoy", definition: "High-performance proxy used by many meshes and gateways" },
    { id: "k-gatekeeper", domain: "d2", kind: "service", term: "OPA Gatekeeper", definition: "Policy engine enforcing Rego policies through admission" },
    { id: "k-kyverno", domain: "d2", kind: "service", term: "Kyverno", definition: "Kubernetes-native policy engine written in YAML" },
    { id: "k-falco", domain: "d2", kind: "service", term: "Falco", definition: "Runtime security: detects suspicious behaviour in containers" },
    { id: "c-service", domain: "d2", kind: "concept", term: "Service", definition: "Stable virtual IP and DNS name in front of a set of Ready Pods" },
    { id: "c-headless", domain: "d2", kind: "concept", term: "Headless Service", definition: "clusterIP: None; DNS returns Pod IPs directly" },
    { id: "c-ingress", domain: "d2", kind: "concept", term: "Ingress", definition: "HTTP(S) host and path routing; needs an Ingress controller" },
    { id: "c-gateway", domain: "d2", kind: "concept", term: "Gateway API", definition: "Role-oriented routing API: GatewayClass, Gateway, HTTPRoute" },
    { id: "c-cni", domain: "d2", kind: "concept", term: "CNI", definition: "Plugin standard that wires Pod networking" },
    { id: "c-rbac", domain: "d2", kind: "concept", term: "RBAC", definition: "Roles list allowed verbs; bindings grant them to subjects" },
    { id: "c-sa", domain: "d2", kind: "concept", term: "ServiceAccount", definition: "Identity a Pod uses to call the Kubernetes API" },
    { id: "c-pss", domain: "d2", kind: "concept", term: "Pod Security Standards", definition: "Privileged, Baseline, Restricted; enforced per namespace" },
    { id: "c-netpol", domain: "d2", kind: "concept", term: "NetworkPolicy", definition: "Allow-list rules for Pod traffic; needs a supporting CNI" },
    { id: "c-pvc", domain: "d2", kind: "concept", term: "PersistentVolumeClaim", definition: "Namespaced request for storage that a Pod mounts" },
    { id: "c-storageclass", domain: "d2", kind: "concept", term: "StorageClass", definition: "Defines a provisioner and parameters for dynamic volumes" },
    { id: "c-csi", domain: "d2", kind: "concept", term: "CSI", definition: "Standard interface for storage drivers" },
    { id: "c-probes", domain: "d2", kind: "concept", term: "Liveness vs readiness", definition: "Liveness failure restarts; readiness failure removes from endpoints" },
    { id: "c-crashloop", domain: "d2", kind: "concept", term: "CrashLoopBackOff", definition: "Container keeps exiting; restarts with growing delay" },
  ],

  challenges: [
    {
      id: "ch-expose-app",
      domain: "d2",
      lesson: "d2-services",
      title: "Expose the app",
      goal: "Pick the right way to expose all six workloads: internal API, lab NodePort, game server, HTTP routing, external database alias, and StatefulSet peers.",
      hint: "Ask: who is calling (inside or outside), over what (TCP or HTTP routes), and does each Pod need its own name?",
      takeaway: "ClusterIP for inside, NodePort and LoadBalancer for outside, Ingress or Gateway API for HTTP routing, ExternalName for an outside alias, headless for per-Pod DNS.",
      render: (onSolved) => <ServiceTypeLab goal="all" onSolved={onSolved} />,
    },
  ],
});
