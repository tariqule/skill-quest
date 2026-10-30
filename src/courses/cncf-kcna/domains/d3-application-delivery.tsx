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
    name: "Application Delivery",
    world: "The GitOps Shipyard",
    weight: 16,
    emoji: "🚢",
    color: "#f97316",
    summary: "How new versions of an app get built, shipped and rolled out safely: pipelines, GitOps, Helm and Kustomize, release strategies, rollbacks, and fixing a deployment that's stuck.",
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
    // ── Start here ──
    {
      id: "d3-b-shipping",
      level: "beginner",
      task: "3.1",
      title: "Start here: getting a new version out the door",
      check: ["kcna-b3-01", "kcna-b3-02"],
      visual: (
        <Flow
          color="#f97316"
          steps={[
            { icon: "✏️", label: "Change the code", sub: "A developer fixes a bug" },
            { icon: "🧪", label: "Test it", sub: "Machines check nothing broke" },
            { icon: "📦", label: "Package it", sub: "Build a container image" },
            { icon: "🚀", label: "Ship it", sub: "Swap it in on the cluster" },
          ]}
        />
      ),
      points: [
        "Think of a bakery changing a recipe. You test the new loaf, bake it the same way every time, then put it on the shelf. Shipping software works the same way.",
        "**Application delivery** is everything between \"a developer changed the code\" and \"users are running the new version\".",
        "Doing these steps by hand is slow and easy to get wrong. So teams automate them with a **pipeline**, a script of steps that runs on every change.",
        "**CI/CD** is the usual name for that pipeline. CI means continuous integration (build and test often). CD means continuous delivery or deployment (release often).",
      ],
      tip: "If a question asks how to ship changes often and safely, the answer nearly always involves automation, not a person running commands.",
    },
    {
      id: "d3-b-versions",
      level: "beginner",
      task: "3.1",
      title: "Start here: swapping versions without a closed sign",
      check: ["kcna-b3-03", "kcna-b3-04"],
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🔁", title: "Swap a few at a time", text: "Replace old copies of the app with new ones step by step, so the shop never closes.", color: "#f97316" },
            { icon: "↩️", title: "Go back if it breaks", text: "Kubernetes keeps the previous version around, so you can return to it with one command.", color: "#f97316" },
          ]}
        />
      ),
      points: [
        "Picture a shop with four tills. To upgrade them, you swap one till at a time so customers can always pay. That's a **rolling update**.",
        "In Kubernetes, a **Deployment** runs several copies of your app. When you change the image version, it replaces the copies a few at a time.",
        "If the new version misbehaves, you can **roll back**, which means returning to the version that worked before.",
      ],
      tip: "Rolling update is the default for a Deployment. You don't have to switch it on.",
    },

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
              { icon: "🔵🟢", title: "Blue/green", text: "Run the new version next to the old one and test it. Then point the Service selector (or route) at it in one step. Switching back is just as quick.", color: "#f97316" },
              { icon: "🐤", title: "Canary", text: "Send a small share of traffic to the new version, watch the metrics, then widen it. Argo Rollouts, Flagger, a service mesh or Gateway API weights can do this.", color: "#f97316" },
            ]}
          />
        </div>
      ),
      points: [
        "**RollingUpdate** is the Deployment default. It replaces Pods gradually, within the limits set by maxSurge and maxUnavailable (both 25% by default).",
        "The other built-in strategy, **Recreate**, stops every old Pod before starting new ones. That means a short outage.",
        "Every rollout creates a new ReplicaSet. Old ReplicaSets are kept (up to revisionHistoryLimit, which defaults to 10) so you have something to roll back to.",
        "`kubectl rollout status` follows a rollout. `kubectl rollout history` lists past revisions. `kubectl rollout undo` goes back to the previous revision, or to one you name.",
        "Readiness probes protect a rollout. If a new Pod never becomes Ready, the rollout stalls instead of sending traffic to a broken Pod.",
      ],
      tip: "Want to keep full capacity during an update? Set maxUnavailable to 0 and maxSurge to at least 1.",
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
            loop="Checked again and again: if the cluster drifts from Git, the change is spotted and put back"
            steps={[
              { icon: "🧑‍💻", label: "Pull request", sub: "Change a manifest, review it, merge" },
              { icon: "🌿", label: "Git repository", sub: "Full, unchangeable history of the desired state" },
              { icon: "🐙", label: "Agent in the cluster", sub: "Argo CD or Flux pulls the change" },
              { icon: "☸️", label: "Cluster", sub: "Applied and kept in sync" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "📜", title: "Declarative", text: "The whole system is written down as the state you want.", color: "#34d399" },
              { icon: "🔒", title: "Versioned and immutable", text: "That desired state is stored with a complete history nobody can rewrite.", color: "#34d399" },
              { icon: "⬇️", title: "Pulled automatically", text: "Agents fetch the desired state from the source themselves.", color: "#34d399" },
              { icon: "🔁", title: "Continuously reconciled", text: "Agents keep nudging the real state back to match.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "**GitOps** means the state you want your cluster in lives in a Git repository, and software in the cluster keeps the cluster matching it.",
        "OpenGitOps defines four principles: declarative, versioned and immutable, pulled automatically, and continuously reconciled.",
        "In pull-based delivery the agent inside the cluster fetches changes. Cluster credentials never leave the cluster, so your CI system doesn't need admin access to production.",
        "Rolling back is a Git revert. And the Git history doubles as an audit log of who changed what.",
        "Argo CD and Flux are CNCF graduated GitOps tools. Both notice drift and can heal the cluster back to what Git says.",
      ],
      tip: "Someone ran `kubectl edit` in production and the change vanished a few minutes later? The GitOps agent put it back to match Git.",
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
              { icon: "⎈", title: "Helm", text: "A package manager for Kubernetes. A chart holds Chart.yaml, values.yaml and a templates/ folder. Installing a chart makes a release you can upgrade and roll back.", color: "#38bdf8" },
              { icon: "🧩", title: "Kustomize", text: "No templates. You keep a base of plain YAML, plus overlays that patch it for each environment. It's built into kubectl (kubectl apply -k).", color: "#38bdf8" },
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
        "**Helm** fills in templates with values. Defaults live in values.yaml, and you override them with `-f` files or `--set` flags.",
        "Charts are shared through chart repositories and OCI registries. Artifact Hub is a place to find them.",
        "**Kustomize** keeps your manifests valid YAML the whole time. Overlays for dev, staging and prod patch things like replica counts, images and labels.",
        "GitOps tools can deploy both Helm charts and Kustomize overlays straight from Git.",
      ],
      tip: "If you need to install, upgrade and roll back a packaged app as one versioned release, think Helm.",
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
            { icon: "🧪", label: "CI: build and test", sub: "Unit tests, lint, image build" },
            { icon: "🔍", label: "Scan and sign", sub: "Vulnerability scan, provenance" },
            { icon: "📦", label: "Push image", sub: "Tag with a version or commit SHA" },
            { icon: "🚀", label: "CD: deploy", sub: "Update manifests, GitOps syncs" },
          ]}
        />
      ),
      points: [
        "**Continuous integration** means merging and testing changes often.",
        "**Continuous delivery** keeps every build ready to release. **Continuous deployment** goes one step further and releases every passing change automatically.",
        "Build the image once, then promote that same image (same digest) through dev, staging and production. That way production runs exactly what you tested.",
        "Tag images with a version or commit SHA that never changes, so you always know what's running and can roll back.",
        "Pipelines can run inside Kubernetes too, with tools like Tekton or Argo Workflows.",
      ],
      tip: "Delivery versus deployment: delivery may end with someone clicking approve. Deployment goes to production on its own.",
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
            { icon: "📈", title: "kubectl rollout status", text: "Waits and tells you whether a rollout finished or got stuck, for example because new Pods never became Ready.", color: "#f97316" },
            { icon: "🔌", title: "kubectl port-forward", text: "Tunnels a port on your laptop to a Pod or Service, so you can test it without exposing it.", color: "#f97316" },
            { icon: "🩺", title: "kubectl debug", text: "Adds a temporary debug container with tools to a running Pod, or makes a copy of the Pod to poke at.", color: "#f97316" },
          ]}
        />
      ),
      points: [
        "A stuck rollout usually means the new Pods can't start or never pass readiness. Run describe and logs on the new ReplicaSet's Pods to find out why.",
        "`kubectl debug` adds an **ephemeral container** (a temporary one) to a running Pod. That helps with minimal distroless images that have no shell.",
        "`kubectl diff -f` shows what applying a manifest would change, before you apply it.",
        "In GitOps tools, an app marked OutOfSync or Degraded points to drift or failing resources. The tool's UI and events tell you which object.",
      ],
      tip: "No shell in the image? Try `kubectl debug -it <pod> --image=busybox --target=<container>`.",
    },
  ],

  questions: [
    // ── Start here ──
    {
      id: "kcna-b3-01",
      domain: "d3",
      lesson: "d3-b-shipping",
      level: "beginner",
      prompt: "What does \"CI/CD\" describe?",
      options: [
        "An automated pipeline that builds, tests and releases code changes",
        "A type of computer chip used in servers",
        "A way to back up a database",
        "The login screen for a Kubernetes cluster",
      ],
      answer: [0],
      explanation: "CI/CD stands for continuous integration and continuous delivery or deployment. It's the automated set of steps that takes a code change, checks it, and gets it to users.",
    },
    {
      id: "kcna-b3-02",
      domain: "d3",
      lesson: "d3-b-shipping",
      level: "beginner",
      prompt: "Why do teams automate the steps for shipping a new version instead of doing them by hand?",
      options: [
        "Automation is faster and does the steps the same way every time",
        "Kubernetes refuses any change made by a person",
        "Automation makes the app use less memory",
        "Doing it by hand is against the law",
      ],
      answer: [0],
      explanation: "People skip steps or make typos, especially when they're in a hurry. A pipeline runs the same checks on every change, so releases become routine instead of risky.",
    },
    {
      id: "kcna-b3-03",
      domain: "d3",
      lesson: "d3-b-versions",
      level: "beginner",
      prompt: "A Deployment runs four copies of a web app. You change the image to a new version. What does Kubernetes do by default?",
      options: [
        "Replaces the copies a few at a time, so the app keeps serving users",
        "Stops all four copies, then starts four new ones",
        "Keeps the old version and ignores the change",
        "Deletes the Deployment",
      ],
      answer: [0],
      explanation: "The default strategy is a rolling update. New copies come up while old ones are retired gradually, so users don't see an outage.",
    },
    {
      id: "kcna-b3-04",
      domain: "d3",
      lesson: "d3-b-versions",
      level: "beginner",
      prompt: "The new version you just released is throwing errors. What does it mean to \"roll back\"?",
      options: [
        "Return to the previous version that worked",
        "Restart your laptop",
        "Delete the whole cluster and rebuild it",
        "Wait for users to stop reporting errors",
      ],
      answer: [0],
      explanation: "Rolling back means going back to the last good version. Kubernetes keeps older versions of a Deployment around, so `kubectl rollout undo` can do this in one step.",
    },
    {
      id: "kcna-b3-05",
      domain: "d3",
      lesson: "d3-b-shipping",
      level: "beginner",
      prompt: "In a container pipeline, what usually gets built and pushed to a registry so the cluster can run it?",
      options: ["A container image", "A spreadsheet of servers", "A virtual machine snapshot of the whole data center", "A PDF of the source code"],
      answer: [0],
      explanation: "The pipeline packages your app into a container image and pushes it to a registry. The cluster then pulls that image and runs it.",
    },

    // ── Rollouts ──
    {
      id: "d3-01",
      domain: "d3",
      lesson: "d3-rollouts",
      prompt: "A new version of a Deployment is causing errors in production. Which command takes the Deployment back to its previous revision?",
      options: ["`kubectl rollout undo deployment/web`", "`kubectl delete deployment web`", "`kubectl rollout pause deployment/web`", "`kubectl scale deployment web --replicas=0`"],
      answer: [0],
      explanation: "`rollout undo` scales the previous ReplicaSet back up and the faulty one down. Add `--to-revision=N` if you want a specific revision.",
    },
    {
      id: "d3-02",
      domain: "d3",
      lesson: "d3-rollouts",
      prompt: "A Deployment has 4 replicas and must never drop below 4 Ready Pods during an update. Which rolling update settings do that?",
      options: ["maxUnavailable: 0 and maxSurge: 1", "maxUnavailable: 1 and maxSurge: 0", "strategy type Recreate", "maxUnavailable: 0 and maxSurge: 0"],
      answer: [0],
      explanation: "maxUnavailable 0 keeps full capacity, and maxSurge 1 lets one extra new Pod start at a time. Setting both to 0 isn't allowed, because the rollout could never make progress.",
    },
    {
      id: "d3-03",
      domain: "d3",
      lesson: "d3-rollouts",
      prompt: "Which Deployment strategy stops all the existing Pods before creating new ones?",
      options: ["Recreate", "RollingUpdate", "Canary", "BlueGreen"],
      answer: [0],
      explanation: "Recreate is the only other built-in Deployment strategy. It causes downtime, but it guarantees two versions never run at the same time.",
    },
    {
      id: "d3-04",
      domain: "d3",
      lesson: "d3-rollouts",
      prompt: "A team wants 5% of users to get the new version while they watch error rates, then raise that share step by step. Which release strategy is this?",
      options: ["Canary", "Recreate", "Blue/green with an instant full switch", "Big-bang deployment"],
      answer: [0],
      explanation: "A canary sends a small, growing share of traffic to the new version. Tools such as Argo Rollouts and Flagger automate the steps and the metric checks.",
    },
    {
      id: "d3-05",
      domain: "d3",
      lesson: "d3-rollouts",
      prompt: "Which statements about Deployment rollouts are correct? (Choose two.)",
      options: [
        "Each rollout creates a new ReplicaSet for the new Pod template",
        "Old ReplicaSets are kept, up to revisionHistoryLimit, so you can roll back",
        "Changing only the replica count creates a new revision",
        "Rollouts replace the nodes in the cluster",
        "A rollout always deletes the previous ReplicaSet",
      ],
      answer: [0, 1],
      explanation: "Changing the Pod template, for example the image, triggers a rollout and a new ReplicaSet. Scaling up or down doesn't create a revision.",
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
      explanation: "A Deployment's strategy type has to be RollingUpdate or Recreate. \"Rolling\" on line 4 isn't a valid value. The surge and unavailable settings are fine.",
    },

    // ── GitOps ──
    {
      id: "d3-11",
      domain: "d3",
      lesson: "d3-gitops",
      prompt: "In GitOps, what is the source of truth for what should run in the cluster?",
      options: ["A Git repository holding the declarative desired state", "The live cluster state", "The CI server's job history", "A spreadsheet of releases"],
      answer: [0],
      explanation: "GitOps keeps the desired state, written declaratively, in version control. Agents then make the cluster match it.",
    },
    {
      id: "d3-12",
      domain: "d3",
      lesson: "d3-gitops",
      prompt: "An engineer changes a Deployment directly with `kubectl edit`. Minutes later the change is gone. The cluster is managed by Argo CD with self-heal on. What happened?",
      options: [
        "Argo CD noticed the cluster no longer matched Git and put the Deployment back to the Git version",
        "The API server rejected the edit silently",
        "etcd lost the change",
        "The kubelet reverted the Pod spec",
      ],
      answer: [0],
      explanation: "Continuous reconciliation undoes manual changes that drift from Git. The right way to make the change is a commit to the Git repository.",
    },
    {
      id: "d3-13",
      domain: "d3",
      lesson: "d3-gitops",
      prompt: "Which are GitOps principles as defined by OpenGitOps? (Choose two.)",
      options: ["Versioned and immutable", "Continuously reconciled", "Imperative scripts run from laptops", "Push credentials to every developer", "Manual approval of every reconcile"],
      answer: [0, 1],
      explanation: "The four principles are declarative, versioned and immutable, pulled automatically, and continuously reconciled.",
    },
    {
      id: "d3-14",
      domain: "d3",
      lesson: "d3-gitops",
      prompt: "Which CNCF projects are GitOps continuous delivery tools for Kubernetes? (Choose two.)",
      options: ["Argo CD", "Flux", "Prometheus", "etcd", "Falco"],
      answer: [0, 1],
      explanation: "Argo CD (part of the Argo project) and Flux are both CNCF graduated GitOps tools. Prometheus does monitoring, etcd stores cluster data, and Falco watches for threats at runtime.",
    },
    {
      id: "d3-15",
      domain: "d3",
      lesson: "d3-gitops",
      prompt: "What's a security benefit of pull-based GitOps compared with a CI server that pushes changes with kubectl?",
      options: [
        "Cluster credentials stay inside the cluster, so the outside CI system doesn't need admin access to production",
        "It removes the need for RBAC",
        "It encrypts every Pod's memory",
        "It makes container images smaller",
      ],
      answer: [0],
      explanation: "The agent inside the cluster pulls from Git. So no outside system has to hold powerful cluster credentials.",
    },

    // ── Helm and Kustomize ──
    {
      id: "d3-21",
      domain: "d3",
      lesson: "d3-helm",
      prompt: "A team wants to install a packaged PostgreSQL with custom settings, then upgrade or roll it back as one versioned unit. Which tool fits best?",
      options: ["Helm", "kubectl cp", "CoreDNS", "kubeadm"],
      answer: [0],
      explanation: "Helm installs charts as releases with a revision history. That's why `helm upgrade` and `helm rollback` can manage the whole app at once.",
    },
    {
      id: "d3-22",
      domain: "d3",
      lesson: "d3-helm",
      prompt: "Which tool customizes plain YAML manifests for each environment with bases and overlays, uses no templates, and is built into kubectl?",
      options: ["Kustomize", "Helm", "Tekton", "Jaeger"],
      answer: [0],
      explanation: "Kustomize patches a base with overlays. You run it with `kubectl apply -k` or `kubectl kustomize`. Helm, by contrast, is built on templates.",
    },
    {
      id: "d3-23",
      domain: "d3",
      lesson: "d3-helm",
      prompt: "In a Helm chart, where are the default configuration values that the templates use?",
      options: ["values.yaml", "Chart.lock", "kustomization.yaml", "The kubeconfig file"],
      answer: [0],
      explanation: "values.yaml holds the defaults. You override them with `-f custom-values.yaml` or `--set key=value`.",
    },
    {
      id: "d3-24",
      domain: "d3",
      lesson: "d3-helm",
      type: "match",
      prompt: "Match each Helm term to its meaning.",
      pairs: [
        ["Chart", "A package of templated Kubernetes manifests"],
        ["Release", "One installed copy of a chart in a cluster"],
        ["Values", "Settings that get filled into the templates"],
        ["Repository", "Where charts are published and shared"],
      ],
      explanation: "You install a chart, configured by values, as a named release. Charts come from repositories or OCI registries.",
    },

    // ── CI/CD ──
    {
      id: "d3-31",
      domain: "d3",
      lesson: "d3-cicd",
      prompt: "What is the difference between continuous delivery and continuous deployment?",
      options: [
        "Delivery keeps every change ready to release but may need a manual approval. Deployment releases every passing change to production automatically",
        "They are the same thing",
        "Deployment runs tests and delivery doesn't",
        "Delivery is only for mobile apps",
      ],
      answer: [0],
      explanation: "Both automate the pipeline. Continuous deployment simply removes the last manual approval step.",
    },
    {
      id: "d3-32",
      domain: "d3",
      lesson: "d3-cicd",
      prompt: "Why should a pipeline build the container image once and promote that same image through every environment?",
      options: [
        "Production then runs exactly the artifact that passed testing",
        "Kubernetes doesn't allow rebuilding",
        "It removes the need for tests",
        "Registries charge per build",
      ],
      answer: [0],
      explanation: "Rebuilding for each environment can pull in different dependencies. Promoting one image that never changes (by digest or a unique tag) keeps releases repeatable.",
    },
    {
      id: "d3-33",
      domain: "d3",
      lesson: "d3-cicd",
      type: "order",
      prompt: "Put a typical container CI/CD flow in order.",
      items: ["Commit code to Git", "Run tests and build the image", "Push the tagged image to a registry", "Update the deployment manifests", "The cluster rolls out the new version"],
      explanation: "CI produces a tested, tagged image. CD then updates the desired state, and the cluster rolls out the new version.",
    },
    {
      id: "d3-34",
      domain: "d3",
      lesson: "d3-cicd",
      prompt: "Which open source project gives you Kubernetes-native building blocks for CI/CD, defining Tasks and Pipelines as custom resources?",
      options: ["Tekton", "CoreDNS", "Harbor", "Linkerd"],
      answer: [0],
      explanation: "Tekton, a Continuous Delivery Foundation project, defines pipelines as Kubernetes custom resources and runs each step in a container.",
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
      explanation: "A stalled rollout means the new ReplicaSet's Pods aren't becoming available. Running describe and logs on those Pods tells you why.",
    },
    {
      id: "d3-42",
      domain: "d3",
      lesson: "d3-debugging",
      prompt: "A Pod runs a distroless image with no shell. How can a developer get debugging tools into the running Pod?",
      options: ["`kubectl debug` to add an ephemeral container with a tools image", "`kubectl exec -it <pod> -- bash`", "Rebuild the cluster", "Edit the Pod's status"],
      answer: [0],
      explanation: "An ephemeral container is a temporary container you add to a running Pod for troubleshooting. `exec` can't help here, because there's no shell in the image to run.",
    },
    {
      id: "d3-43",
      domain: "d3",
      lesson: "d3-debugging",
      prompt: "A developer wants to test a ClusterIP Service from a laptop without exposing it publicly. Which command helps?",
      options: ["`kubectl port-forward svc/api 8080:80`", "`kubectl expose svc/api --type=LoadBalancer`", "`kubectl cordon`", "`kubectl rollout restart`"],
      answer: [0],
      explanation: "`port-forward` tunnels a local port through the API server to the Service or Pod. Nothing gets opened to the internet.",
    },
    {
      id: "d3-44",
      domain: "d3",
      lesson: "d3-debugging",
      prompt: "Before you apply an edited manifest to production, which commands help confirm what will change? (Choose two.)",
      options: ["`kubectl diff -f deploy.yaml`", "`kubectl apply -f deploy.yaml --dry-run=server`", "`kubectl delete -f deploy.yaml`", "`kubectl drain`", "`kubectl logs -f`"],
      answer: [0, 1],
      explanation: "`kubectl diff` shows how your file differs from the live object. A server-side dry run checks the change, admission included, without saving it.",
    },
    {
      id: "d3-45",
      domain: "d3",
      lesson: "d3-debugging",
      prompt: "Which command lists a Deployment's earlier revisions so you can pick one to roll back to?",
      options: ["`kubectl rollout history deployment/web`", "`kubectl get events`", "`kubectl top pods`", "`kubectl get replicasets --watch`"],
      answer: [0],
      explanation: "`rollout history` lists the revisions, with change-cause notes when they're set. Then `rollout undo --to-revision` picks one.",
    },
  ],

  cards: [
    { id: "k-helm", domain: "d3", kind: "service", term: "Helm", definition: "A package manager for Kubernetes. Charts get installed as versioned releases." },
    { id: "k-kustomize", domain: "d3", kind: "service", term: "Kustomize", definition: "Patches a base of plain YAML with overlays, no templates. Built into kubectl." },
    { id: "k-argocd", domain: "d3", kind: "service", term: "Argo CD", definition: "A GitOps controller that syncs apps from Git and shows you drift." },
    { id: "k-flux", domain: "d3", kind: "service", term: "Flux", definition: "A GitOps toolkit that keeps clusters in line with Git, Helm and OCI sources." },
    { id: "k-argo-rollouts", domain: "d3", kind: "service", term: "Argo Rollouts", definition: "Progressive delivery: canary and blue/green releases checked against metrics." },
    { id: "k-flagger", domain: "d3", kind: "service", term: "Flagger", definition: "A progressive delivery operator that automates canary releases." },
    { id: "k-tekton", domain: "d3", kind: "service", term: "Tekton", definition: "Kubernetes-native CI/CD, with pipelines defined as custom resources." },
    { id: "k-harbor", domain: "d3", kind: "service", term: "Harbor", definition: "A container registry with scanning, signing and replication." },
    { id: "c-gitops", domain: "d3", kind: "concept", term: "GitOps", definition: "Desired state in Git: declarative, versioned, pulled automatically and continuously reconciled." },
    { id: "c-canary", domain: "d3", kind: "concept", term: "Canary release", definition: "Send a small share of traffic to the new version first, then widen it." },
    { id: "c-bluegreen", domain: "d3", kind: "concept", term: "Blue/green", definition: "Two full versions side by side. You switch traffic over in one step." },
    { id: "c-rolling", domain: "d3", kind: "concept", term: "maxSurge and maxUnavailable", definition: "How far a rolling update may go above or below the replica count." },
    { id: "c-cd", domain: "d3", kind: "concept", term: "Continuous delivery versus deployment", definition: "Delivery keeps every build ready to release. Deployment releases it automatically." },
    { id: "c-ephemeral", domain: "d3", kind: "concept", term: "Ephemeral container", definition: "A temporary debug container you add to a running Pod." },
  ],
});
