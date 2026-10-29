import { CodeBlock, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { RollingUpdateViz } from "../visuals";

/**
 * Domain 3: Cloud Native Application Delivery (16% of the KCNA exam).
 * The official curriculum lists two topics (application delivery, debugging);
 * the `covers` lines are this course's breakdown of each topic.
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Cloud Native Application Delivery",
    world: "The GitOps Shipyard",
    weight: 16,
    emoji: "🚢",
    color: "#f97316",
    summary: "CI/CD, GitOps with Argo CD and Flux, Helm and Kustomize, rolling updates, canary and blue/green releases, rollbacks, and debugging deployments.",
  },

  tasks: [
    {
      id: "3.1",
      title: "Application delivery",
      covers: [
        "Describe CI/CD pipelines that build, test, and publish images, then deploy them",
        "Explain GitOps principles and pull-based delivery with tools such as Argo CD and Flux",
        "Package and configure apps with Helm charts and Kustomize overlays",
        "Choose release strategies: rolling update, recreate, blue/green, canary; roll back",
      ],
    },
    {
      id: "3.2",
      title: "Debugging",
      covers: [
        "Follow and diagnose rollouts with kubectl rollout status, history, and undo",
        "Debug running apps with logs, port-forward, exec, and ephemeral debug containers",
        "Spot configuration drift and failed syncs in delivery tools",
      ],
    },
  ],

  lessons: [
    {
      id: "d3-rollouts",
      task: "3.1 · 3.2",
      title: "Rolling updates, release strategies, and rollbacks",
      check: ["d3-01", "d3-02"],
      visual: (
        <div className="grid gap-4">
          <RollingUpdateViz />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🔵🟢", title: "Blue/green", text: "Run the new version alongside the old, test it, then switch the Service selector (or route) over in one step. Instant switch back.", color: "#f97316" },
              { icon: "🐤", title: "Canary", text: "Send a small share of traffic to the new version, watch metrics, then widen. Tools: Argo Rollouts, Flagger, a service mesh, or Gateway API weights.", color: "#f97316" },
            ]}
          />
        </div>
      ),
      points: [
        "RollingUpdate is the Deployment default: Pods are replaced gradually within maxSurge and maxUnavailable (both 25% by default). Recreate stops all old Pods first, so it has downtime.",
        "Every rollout creates a new ReplicaSet. Old ReplicaSets are kept (revisionHistoryLimit, default 10) so you can roll back.",
        "kubectl rollout status follows a rollout; kubectl rollout history lists revisions; kubectl rollout undo returns to the previous (or a given) revision.",
        "Readiness probes protect rollouts: a new Pod that never becomes Ready stalls the rollout instead of taking traffic.",
      ],
      tip: "Zero capacity loss during an update → maxUnavailable: 0 with maxSurge ≥ 1.",
    },
    {
      id: "d3-gitops",
      task: "3.1",
      title: "GitOps: Git as the source of truth",
      check: ["d3-11", "d3-12"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#f97316"
            loop="Continuously reconciled: drift in the cluster is detected and reverted to what Git says"
            steps={[
              { icon: "🧑‍💻", label: "Pull request", sub: "Change a manifest, review, merge" },
              { icon: "🌿", label: "Git repository", sub: "Versioned, immutable history of desired state" },
              { icon: "🐙", label: "Agent in the cluster", sub: "Argo CD or Flux pulls changes" },
              { icon: "☸️", label: "Cluster", sub: "Applied and kept in sync" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "📜", title: "Declarative", text: "The whole system is described as desired state.", color: "#34d399" },
              { icon: "🔒", title: "Versioned & immutable", text: "Desired state is stored with a complete, unchangeable history.", color: "#34d399" },
              { icon: "⬇️", title: "Pulled automatically", text: "Agents pull the desired state from the source.", color: "#34d399" },
              { icon: "🔁", title: "Continuously reconciled", text: "Agents keep correcting the actual state.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "The four OpenGitOps principles: declarative, versioned and immutable, pulled automatically, continuously reconciled.",
        "Pull-based delivery keeps cluster credentials inside the cluster: CI never needs admin access to production.",
        "Rolling back is a Git revert; the history of who changed what is the audit log.",
        "Argo CD and Flux are CNCF graduated GitOps tools. Both detect drift and can self-heal back to the state in Git.",
      ],
      tip: "Someone ran kubectl edit in production and the change \"disappeared\" a few minutes later → the GitOps agent reconciled it back to Git.",
    },
    {
      id: "d3-helm",
      task: "3.1",
      title: "Packaging with Helm and Kustomize",
      check: ["d3-21", "d3-22"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={2}
            tiles={[
              { icon: "⎈", title: "Helm", text: "Package manager for Kubernetes. A chart = Chart.yaml + values.yaml + templates/. Installing a chart creates a release you can upgrade and roll back.", color: "#38bdf8" },
              { icon: "🧩", title: "Kustomize", text: "Template-free: a base of plain YAML plus overlays that patch it per environment. Built into kubectl (kubectl apply -k).", color: "#38bdf8" },
            ]}
          />
          <CodeBlock
            lang="sh"
            code={`helm repo add example https://charts.example.com
helm install shop-db example/postgresql -f prod-values.yaml
helm upgrade shop-db example/postgresql --set resources.requests.cpu=500m
helm history shop-db
helm rollback shop-db 1`}
          />
        </div>
      ),
      points: [
        "Helm renders templates with values: defaults in values.yaml, overridden by -f files or --set flags.",
        "Charts are shared through chart repositories and OCI registries; Artifact Hub is a place to discover them.",
        "Kustomize keeps manifests valid YAML at every step: overlays for dev, staging, and prod patch replicas, images, and labels.",
        "GitOps tools can deploy both Helm charts and Kustomize overlays from Git.",
      ],
      tip: "\"Install, upgrade, and roll back a packaged app as one versioned release\" → Helm.",
    },
    {
      id: "d3-cicd",
      task: "3.1",
      title: "CI/CD pipelines for containers",
      check: ["d3-31", "d3-32"],
      visual: (
        <Flow
          color="#f97316"
          steps={[
            { icon: "🌿", label: "Commit", sub: "Code change pushed" },
            { icon: "🧪", label: "CI: build + test", sub: "Unit tests, lint, image build" },
            { icon: "🔍", label: "Scan + sign", sub: "Vulnerability scan, provenance" },
            { icon: "📦", label: "Push image", sub: "Tag with version or commit SHA" },
            { icon: "🚀", label: "CD: deploy", sub: "Update manifests; GitOps syncs" },
          ]}
        />
      ),
      points: [
        "Continuous integration merges and tests changes often; continuous delivery keeps every build releasable; continuous deployment releases every passing change automatically.",
        "Build the image once and promote the same image (same digest) through dev, staging, and production.",
        "Tag images with an immutable version or commit SHA so you always know what is running and can roll back.",
        "Pipelines can run in Kubernetes too, for example with Tekton or Argo Workflows.",
      ],
      tip: "Delivery vs deployment: delivery may end with a manual approval; deployment goes to production automatically.",
    },
    {
      id: "d3-debugging",
      task: "3.2",
      title: "Debugging deployments",
      check: ["d3-41", "d3-42"],
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "📈", title: "kubectl rollout status", text: "Waits and reports whether a rollout finished or is stuck (for example new Pods never Ready).", color: "#f97316" },
            { icon: "🔌", title: "kubectl port-forward", text: "Tunnel a local port to a Pod or Service to test it without exposing it.", color: "#f97316" },
            { icon: "🩺", title: "kubectl debug", text: "Add an ephemeral debug container (with tools) to a running Pod, or copy the Pod to troubleshoot.", color: "#f97316" },
          ]}
        />
      ),
      points: [
        "A stuck rollout usually means new Pods can't start or never pass readiness: check the new ReplicaSet's Pods with describe and logs.",
        "kubectl debug adds an ephemeral container to a running Pod, which helps with minimal (distroless) images that have no shell.",
        "kubectl diff -f shows what applying a manifest would change before you apply it.",
        "In GitOps tools, an OutOfSync or Degraded app points to drift or failing resources; the tool's UI and events show which object.",
      ],
      tip: "No shell in the image? kubectl debug -it <pod> --image=busybox --target=<container>.",
    },
  ],

  questions: [
    // ── Rollouts ──
    {
      id: "d3-01",
      domain: "d3",
      lesson: "d3-rollouts",
      prompt: "A new Deployment version is causing errors in production. Which command returns the Deployment to its previous revision?",
      options: ["`kubectl rollout undo deployment/web`", "`kubectl delete deployment web`", "`kubectl rollout pause deployment/web`", "`kubectl scale deployment web --replicas=0`"],
      answer: [0],
      explanation: "rollout undo scales the previous ReplicaSet back up and the faulty one down. Add --to-revision=N for a specific revision.",
    },
    {
      id: "d3-02",
      domain: "d3",
      lesson: "d3-rollouts",
      prompt: "A Deployment of 4 replicas must never drop below 4 Ready Pods during an update. Which rolling update settings achieve this?",
      options: ["maxUnavailable: 0 and maxSurge: 1", "maxUnavailable: 1 and maxSurge: 0", "strategy type Recreate", "maxUnavailable: 0 and maxSurge: 0"],
      answer: [0],
      explanation: "maxUnavailable 0 keeps full capacity; maxSurge 1 lets one extra new Pod start at a time. Both 0 is invalid because the rollout couldn't progress.",
    },
    {
      id: "d3-03",
      domain: "d3",
      lesson: "d3-rollouts",
      prompt: "Which Deployment strategy terminates all existing Pods before creating new ones?",
      options: ["Recreate", "RollingUpdate", "Canary", "BlueGreen"],
      answer: [0],
      explanation: "Recreate is the only other built-in Deployment strategy. It causes downtime, but guarantees two versions never run at once.",
    },
    {
      id: "d3-04",
      domain: "d3",
      lesson: "d3-rollouts",
      prompt: "A team wants 5% of users to get the new version while they watch error rates, then increase the share gradually. Which release strategy is this?",
      options: ["Canary", "Recreate", "Blue/green with an instant full switch", "Big-bang deployment"],
      answer: [0],
      explanation: "A canary sends a small, growing share of traffic to the new version. Tools such as Argo Rollouts and Flagger automate the steps and metric checks.",
    },
    {
      id: "d3-05",
      domain: "d3",
      lesson: "d3-rollouts",
      prompt: "Which statements about Deployment rollouts are correct? (Choose two.)",
      options: [
        "Each rollout creates a new ReplicaSet for the new Pod template",
        "Old ReplicaSets are kept, up to revisionHistoryLimit, to allow rollbacks",
        "Changing only the replica count creates a new revision",
        "Rollouts replace the nodes in the cluster",
        "A rollout always deletes the previous ReplicaSet",
      ],
      answer: [0, 1],
      explanation: "Changing the Pod template (for example the image) triggers a rollout and a new ReplicaSet. Scaling changes don't create revisions.",
    },
    {
      id: "d3-06",
      domain: "d3",
      lesson: "d3-rollouts",
      type: "lines",
      prompt: "The API server rejects this Deployment's update strategy. Tap the line that causes it.",
      code: `spec:
  replicas: 4
  strategy:
    type: Rolling
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels: { app: web }`,
      codeLang: "yaml",
      answer: [4],
      explanation: "A Deployment's strategy type must be RollingUpdate or Recreate. \"Rolling\" on line 4 is not a valid value. The surge and unavailable settings are fine.",
    },

    // ── GitOps ──
    {
      id: "d3-11",
      domain: "d3",
      lesson: "d3-gitops",
      prompt: "In GitOps, what is the source of truth for what should run in the cluster?",
      options: ["A Git repository holding the declarative desired state", "The live cluster state", "The CI server's job history", "A spreadsheet of releases"],
      answer: [0],
      explanation: "GitOps stores desired state declaratively in version control, and agents reconcile the cluster to match it.",
    },
    {
      id: "d3-12",
      domain: "d3",
      lesson: "d3-gitops",
      prompt: "An engineer changes a Deployment directly with `kubectl edit`. Minutes later the change is gone. The cluster is managed by Argo CD with self-heal on. What happened?",
      options: [
        "Argo CD detected drift from Git and reconciled the Deployment back to the version in Git",
        "The API server rejected the edit silently",
        "etcd lost the change",
        "The kubelet reverted the Pod spec",
      ],
      answer: [0],
      explanation: "Continuous reconciliation reverts manual drift. The right way to change it is a commit to the Git repository.",
    },
    {
      id: "d3-13",
      domain: "d3",
      lesson: "d3-gitops",
      prompt: "Which are principles of GitOps as defined by OpenGitOps? (Choose two.)",
      options: ["Versioned and immutable", "Continuously reconciled", "Imperative scripts run from laptops", "Push credentials to every developer", "Manual approval of every reconcile"],
      answer: [0, 1],
      explanation: "The four principles are: declarative, versioned and immutable, pulled automatically, and continuously reconciled.",
    },
    {
      id: "d3-14",
      domain: "d3",
      lesson: "d3-gitops",
      prompt: "Which CNCF projects are GitOps continuous delivery tools for Kubernetes? (Choose two.)",
      options: ["Argo CD", "Flux", "Prometheus", "etcd", "Falco"],
      answer: [0, 1],
      explanation: "Argo CD (part of the Argo project) and Flux are both CNCF graduated GitOps tools.",
    },
    {
      id: "d3-15",
      domain: "d3",
      lesson: "d3-gitops",
      prompt: "What is a security benefit of pull-based GitOps compared with a CI server that pushes changes with kubectl?",
      options: [
        "Cluster credentials stay inside the cluster; the external CI system doesn't need admin access to production",
        "It removes the need for RBAC",
        "It encrypts every Pod's memory",
        "It makes container images smaller",
      ],
      answer: [0],
      explanation: "The in-cluster agent pulls from Git, so no outside system holds powerful cluster credentials.",
    },

    // ── Helm and Kustomize ──
    {
      id: "d3-21",
      domain: "d3",
      lesson: "d3-helm",
      prompt: "A team wants to install a packaged PostgreSQL with custom settings, then upgrade or roll it back as one versioned unit. Which tool fits best?",
      options: ["Helm", "kubectl cp", "CoreDNS", "kubeadm"],
      answer: [0],
      explanation: "Helm installs charts as releases with revision history, so `helm upgrade` and `helm rollback` manage the whole app.",
    },
    {
      id: "d3-22",
      domain: "d3",
      lesson: "d3-helm",
      prompt: "Which tool customizes plain YAML manifests per environment with bases and overlays, without templates, and is built into kubectl?",
      options: ["Kustomize", "Helm", "Tekton", "Jaeger"],
      answer: [0],
      explanation: "Kustomize patches a base with overlays and runs with `kubectl apply -k` or `kubectl kustomize`.",
    },
    {
      id: "d3-23",
      domain: "d3",
      lesson: "d3-helm",
      prompt: "In a Helm chart, where are the default configuration values that templates use?",
      options: ["values.yaml", "Chart.lock", "kustomization.yaml", "The kubeconfig file"],
      answer: [0],
      explanation: "values.yaml holds defaults. Users override them with -f custom-values.yaml or --set key=value.",
    },
    {
      id: "d3-24",
      domain: "d3",
      lesson: "d3-helm",
      type: "match",
      prompt: "Match each Helm term to its meaning.",
      pairs: [
        ["Chart", "A package of templated Kubernetes manifests"],
        ["Release", "One installed instance of a chart in a cluster"],
        ["Values", "Configuration rendered into the templates"],
        ["Repository", "Where charts are published and shared"],
      ],
      explanation: "You install a chart, configured by values, as a named release; charts come from repositories or OCI registries.",
    },

    // ── CI/CD ──
    {
      id: "d3-31",
      domain: "d3",
      lesson: "d3-cicd",
      prompt: "What is the difference between continuous delivery and continuous deployment?",
      options: [
        "Delivery keeps every change releasable but may need a manual approval; deployment releases every passing change to production automatically",
        "They are the same thing",
        "Deployment runs tests; delivery doesn't",
        "Delivery is only for mobile apps",
      ],
      answer: [0],
      explanation: "Both automate the pipeline. Continuous deployment removes the final manual gate.",
    },
    {
      id: "d3-32",
      domain: "d3",
      lesson: "d3-cicd",
      prompt: "Why should a pipeline build the container image once and promote the same image through every environment?",
      options: [
        "Production then runs exactly the artifact that passed testing",
        "Rebuilding is not allowed by Kubernetes",
        "It removes the need for tests",
        "Registries charge per build",
      ],
      answer: [0],
      explanation: "Rebuilding per environment can pull different dependencies. Promoting one immutable image (by digest or unique tag) keeps releases reproducible.",
    },
    {
      id: "d3-33",
      domain: "d3",
      lesson: "d3-cicd",
      type: "order",
      prompt: "Order a typical container CI/CD flow.",
      items: ["Commit code to Git", "Run tests and build the image", "Push the tagged image to a registry", "Update the deployment manifests", "The cluster rolls out the new version"],
      explanation: "CI produces a tested, tagged image; CD updates the desired state and the cluster rolls it out.",
    },
    {
      id: "d3-34",
      domain: "d3",
      lesson: "d3-cicd",
      prompt: "Which open source project provides Kubernetes-native building blocks for CI/CD, defining Tasks and Pipelines as custom resources?",
      options: ["Tekton", "CoreDNS", "Harbor", "Linkerd"],
      answer: [0],
      explanation: "Tekton (a Continuous Delivery Foundation project) defines pipelines as Kubernetes custom resources and runs each step in a container.",
    },

    // ── Debugging ──
    {
      id: "d3-41",
      domain: "d3",
      lesson: "d3-debugging",
      prompt: "`kubectl rollout status deployment/api` hangs after an image update, and the new Pods never become Ready. What should the developer check first?",
      options: [
        "The new Pods' events and logs, for example a failing readiness probe or a crash",
        "The kubeconfig context",
        "The etcd member list",
        "The cluster's DNS domain",
      ],
      answer: [0],
      explanation: "A stalled rollout means the new ReplicaSet's Pods aren't becoming available. describe and logs on those Pods show why.",
    },
    {
      id: "d3-42",
      domain: "d3",
      lesson: "d3-debugging",
      prompt: "A Pod runs a distroless image with no shell. How can a developer get debugging tools into the running Pod?",
      options: ["`kubectl debug` to add an ephemeral container with a tools image", "`kubectl exec -it <pod> -- bash`", "Rebuild the cluster", "Edit the Pod's status"],
      answer: [0],
      explanation: "Ephemeral containers are added to a running Pod for troubleshooting; exec can't help when the image has no shell.",
    },
    {
      id: "d3-43",
      domain: "d3",
      lesson: "d3-debugging",
      prompt: "A developer wants to test a ClusterIP Service from a laptop without exposing it publicly. Which command helps?",
      options: ["`kubectl port-forward svc/api 8080:80`", "`kubectl expose svc/api --type=LoadBalancer`", "`kubectl cordon`", "`kubectl rollout restart`"],
      answer: [0],
      explanation: "port-forward tunnels a local port through the API server to the Service or Pod.",
    },
    {
      id: "d3-44",
      domain: "d3",
      lesson: "d3-debugging",
      prompt: "Before applying an edited manifest to production, which commands help confirm what will change? (Choose two.)",
      options: ["`kubectl diff -f deploy.yaml`", "`kubectl apply -f deploy.yaml --dry-run=server`", "`kubectl delete -f deploy.yaml`", "`kubectl drain`", "`kubectl logs -f`"],
      answer: [0, 1],
      explanation: "kubectl diff shows the difference from the live object; a server-side dry run validates the change (including admission) without persisting it.",
    },
    {
      id: "d3-45",
      domain: "d3",
      lesson: "d3-debugging",
      prompt: "Which command lists a Deployment's previous revisions so you can pick one to roll back to?",
      options: ["`kubectl rollout history deployment/web`", "`kubectl get events`", "`kubectl top pods`", "`kubectl get replicasets --watch`"],
      answer: [0],
      explanation: "rollout history lists revisions (with change-cause annotations when set); rollout undo --to-revision picks one.",
    },
  ],

  cards: [
    { id: "k-helm", domain: "d3", kind: "service", term: "Helm", definition: "Package manager: charts installed as versioned releases" },
    { id: "k-kustomize", domain: "d3", kind: "service", term: "Kustomize", definition: "Template-free base + overlays, built into kubectl" },
    { id: "k-argocd", domain: "d3", kind: "service", term: "Argo CD", definition: "GitOps controller that syncs apps from Git and shows drift" },
    { id: "k-flux", domain: "d3", kind: "service", term: "Flux", definition: "GitOps toolkit that reconciles clusters from Git, Helm, and OCI sources" },
    { id: "k-argo-rollouts", domain: "d3", kind: "service", term: "Argo Rollouts", definition: "Progressive delivery: canary and blue/green with metric analysis" },
    { id: "k-flagger", domain: "d3", kind: "service", term: "Flagger", definition: "Progressive delivery operator that automates canary releases" },
    { id: "k-tekton", domain: "d3", kind: "service", term: "Tekton", definition: "Kubernetes-native CI/CD pipelines as custom resources" },
    { id: "k-harbor", domain: "d3", kind: "service", term: "Harbor", definition: "Container registry with scanning, signing, and replication" },
    { id: "c-gitops", domain: "d3", kind: "concept", term: "GitOps", definition: "Declarative, versioned, pulled automatically, continuously reconciled" },
    { id: "c-canary", domain: "d3", kind: "concept", term: "Canary release", definition: "Small share of traffic to the new version first, then widen" },
    { id: "c-bluegreen", domain: "d3", kind: "concept", term: "Blue/green", definition: "Two full versions side by side; switch traffic in one step" },
    { id: "c-rolling", domain: "d3", kind: "concept", term: "maxSurge / maxUnavailable", definition: "How far a rolling update may go above or below the replica count" },
    { id: "c-cd", domain: "d3", kind: "concept", term: "Continuous delivery vs deployment", definition: "Delivery: always releasable; deployment: released automatically" },
    { id: "c-ephemeral", domain: "d3", kind: "concept", term: "Ephemeral container", definition: "Temporary debug container added to a running Pod" },
  ],
});
