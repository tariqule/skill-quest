import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { snip } from "../snippet";

/** World 4: registries and tags, container security, the image supply chain, and moving to Kubernetes. */
export default defineDomain({
  domain: {
    id: "d4",
    number: 4,
    name: "Ship It Safely",
    world: "The Supply-Chain Summit",
    weight: 25,
    emoji: "🛡️",
    color: "#f59e0b",
    summary: "Registries, tags and digests; non-root users, minimal images and build secrets; SBOMs, signing and multi-platform builds; and what changes on Kubernetes.",
  },

  tasks: [
    {
      id: "4.1",
      title: "Registries, tags and digests",
      covers: ["Registries", "Image references", "Mutable tags vs immutable digests", "The latest tag", "tag and push"],
    },
    {
      id: "4.2",
      title: "Container security",
      covers: ["Non-root users", "Minimal base images", "Build secrets", "Dangerous flags and the Docker socket", "Image scanning"],
    },
    {
      id: "4.3",
      title: "Supply chain and platforms",
      covers: ["SBOMs and provenance", "Image signing and admission policies", "Multi-platform builds", "exec format error"],
    },
    {
      id: "4.4",
      title: "From Docker to Kubernetes",
      covers: ["Deployments and Services", "OCI images and container runtimes", "Probes vs HEALTHCHECK", "Resources", "Rollouts and image tags"],
    },
  ],

  lessons: [
    {
      id: "d4-registries",
      level: "intermediate",
      task: "4.1",
      title: "Registries, tags and digests",
      check: ["d4-01", "d4-03"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="bash"
            caption="Anatomy of an image reference"
            code={snip(
              "ghcr.io/acme/api:1.4.0@sha256:9f2b…",
              "# ghcr.io      registry (default: docker.io)",
              "# acme/api     repository (official images live under library/)",
              "# 1.4.0        tag: a movable label (default: latest)",
              "# sha256:…     digest: an immutable hash of the content",
            )}
          />
          <CodeBlock
            lang="bash"
            code={snip(
              "docker build -t api:1.4.0 .",
              "docker tag api:1.4.0 ghcr.io/acme/api:1.4.0",
              "docker login ghcr.io",
              "docker push ghcr.io/acme/api:1.4.0",
            )}
          />
        </div>
      ),
      points: [
        "A registry stores images: Docker Hub, GitHub Container Registry, Amazon ECR, Google Artifact Registry, Azure Container Registry, or your own.",
        "Tags are labels someone can move. `latest` is only the default tag name, not a promise of \"newest\".",
        "A digest (`@sha256:…`) identifies exact content and never changes. Pin by digest when you need reproducibility.",
        "`docker tag` adds another name to an existing image; `docker push` uploads it under that name.",
      ],
      tip: "Tag releases with immutable versions (or the git commit SHA) and never overwrite them. \"Which build is in production?\" should have one answer.",
    },
    {
      id: "d4-security",
      level: "senior",
      task: "4.2",
      title: "Container security essentials",
      check: ["d4-06", "d4-12"],
      visual: (
        <div className="grid gap-4">
          <CodeCompare
            lang="dockerfile"
            left={{
              title: "Leaks a token, runs as root",
              code: snip("FROM node:22-slim", "WORKDIR /app", "ARG NPM_TOKEN", "COPY . .", 'RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc && npm ci', 'CMD ["node", "server.js"]'),
            }}
            right={{
              title: "Secret mount, non-root user",
              code: snip(
                "FROM node:22-slim",
                "WORKDIR /app",
                "COPY package*.json ./",
                "RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci",
                "COPY . .",
                "USER node",
                'CMD ["node", "server.js"]',
              ),
            }}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "👤", title: "Run as non-root", text: "`USER` in the Dockerfile (official Node images ship a `node` user). Limits what a compromised app can do.", color: "#34d399" },
              { icon: "🪶", title: "Ship less", text: "slim, distroless or multi-stage images: fewer packages, fewer CVEs, nothing extra for an attacker to use.", color: "#38bdf8" },
              { icon: "🚫", title: "Avoid", text: "`--privileged`, mounting `/var/run/docker.sock`, secrets in ENV/ARG or files in layers.", color: "#fb7185" },
            ]}
          />
        </div>
      ),
      points: [
        "Containers run as root by default. Add a `USER` after the steps that need root, so the app itself runs unprivileged.",
        "Anything written to a layer, or passed as a build ARG, can be read by anyone with the image. Use BuildKit secret mounts at build time.",
        "Runtime secrets come from the environment or mounted files provided by your orchestrator, never from the image.",
        "Harden at run time too: `--read-only`, `--cap-drop ALL` (add back only what's needed), and never `--privileged` for ordinary apps.",
        "Scan images and rebuild on patched bases regularly; most CVEs come from the base image, not your code.",
      ],
      tip: "Run `docker history --no-trunc <image>` on your own images once. If you can read a token there, so can everyone who pulls it.",
    },
    {
      id: "d4-supply",
      level: "staff",
      task: "4.3",
      title: "The image supply chain",
      check: ["d4-14", "d4-17"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "📌", label: "Pinned base", sub: "FROM …@sha256, bumped by automated PRs" },
              { icon: "🏗️", label: "CI build", sub: "Multi-platform, from a clean checkout" },
              { icon: "🧾", label: "Attest", sub: "SBOM + provenance attached to the image" },
              { icon: "✍️", label: "Sign", sub: "e.g. Sigstore Cosign or Notation" },
              { icon: "🚦", label: "Admit", sub: "Cluster policy only runs verified images" },
            ]}
          />
          <CodeBlock
            lang="bash"
            code={snip(
              "docker buildx build \\",
              "  --platform linux/amd64,linux/arm64 \\",
              "  --sbom=true --provenance=true \\",
              "  -t ghcr.io/acme/api:1.4.0 --push .",
            )}
          />
        </div>
      ),
      points: [
        "An SBOM (software bill of materials) lists every package in an image, so \"are we affected by this CVE?\" is a query, not an investigation.",
        "Provenance records how, where and from what source an image was built. Signatures prove it came from your pipeline.",
        "Admission policies in the cluster can refuse images that aren't signed by your CI.",
        "Images are CPU-architecture specific. Build multi-platform images (an image index) when you deploy to both amd64 and arm64.",
      ],
      tip: "Supply-chain work pays off on the worst day: when a big CVE drops, teams with SBOMs know their exposure in minutes.",
    },
    {
      id: "d4-k8s",
      level: "staff",
      task: "4.4",
      title: "From Docker to Kubernetes",
      check: ["d4-19", "d4-20"],
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🔁", title: "docker run -d --restart → Deployment", text: "Desired replica count, automatic restarts and rescheduling, rolling updates and rollbacks.", color: "#38bdf8" },
            { icon: "🔌", title: "-p and DNS → Service (+ Ingress)", text: "A stable name and load balancing across pods; Ingress or Gateway for HTTP from outside.", color: "#f472b6" },
            { icon: "🗄️", title: "Volumes → PersistentVolumeClaims", text: "Storage requested from the cluster, attached wherever the pod lands.", color: "#34d399" },
            { icon: "❤️", title: "HEALTHCHECK → probes", text: "Liveness, readiness and startup probes in the pod spec. Kubernetes ignores the Dockerfile HEALTHCHECK.", color: "#f59e0b" },
            { icon: "📏", title: "--memory / --cpus → resources", text: "Requests (for scheduling) and limits (enforced) on each container.", color: "#a78bfa" },
            { icon: "🔐", title: "-e and files → ConfigMaps & Secrets", text: "Config and credentials injected at run time, so the same image runs in every environment.", color: "#fb7185" },
          ]}
        />
      ),
      points: [
        "Docker builds standard OCI images. Kubernetes nodes run them with a CRI runtime such as containerd or CRI-O; Docker Engine isn't required.",
        "Everything you learned still applies: small images, non-root users, SIGTERM handling, logging to stdout, config from the environment.",
        "Kubernetes sends SIGTERM and waits a grace period (30 seconds by default) before SIGKILL, so graceful shutdown matters even more.",
        "Deploy immutable tags or digests. A mutable tag makes rollbacks and \"what's running?\" unreliable.",
      ],
      tip: "A container that starts fast, logs to stdout, reads config from the environment and exits cleanly on SIGTERM will be happy on any orchestrator.",
    },
  ],

  questions: [
    {
      id: "d4-01",
      domain: "d4",
      level: "junior",
      lesson: "d4-registries",
      prompt: "What is a container registry?",
      options: [
        "A server that stores and serves images, such as Docker Hub, GitHub Container Registry or Amazon ECR",
        "A list of the containers running on your machine",
        "Docker's configuration file",
        "A central log server",
      ],
      answer: [0],
      explanation: "You push images to a registry and pull them from it on any machine. Private registries need `docker login` first.",
    },
    {
      id: "d4-02",
      domain: "d4",
      level: "junior",
      lesson: "d4-registries",
      type: "order",
      prompt: "You're already logged in to `registry.example.com`. Order the commands to build an image and publish it there.",
      items: ["`docker build -t api:1.4.0 .`", "`docker tag api:1.4.0 registry.example.com/team/api:1.4.0`", "`docker push registry.example.com/team/api:1.4.0`"],
      explanation: "The image name decides where `docker push` sends it, so it must include the registry host. (You could also build with that full name directly.)",
    },
    {
      id: "d4-03",
      domain: "d4",
      level: "junior",
      lesson: "d4-registries",
      prompt: "What does the `latest` tag mean?",
      options: [
        "Only that it's the default tag name when none is given; it isn't automatically the newest version",
        "It always points at the newest build",
        "It marks the most stable release",
        "It means the image will be deleted soon",
      ],
      answer: [0],
      explanation: "`latest` is whatever someone last pushed with that tag, or nothing at all. Use explicit versions.",
    },
    {
      id: "d4-04",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-registries",
      prompt: "What does pinning the base image by digest give you?",
      code: snip("FROM node:22-slim@sha256:4b1d…"),
      codeLang: "dockerfile",
      options: [
        "Exactly the same base image every build, even after the `22-slim` tag is moved to a newer image",
        "Faster downloads",
        "Automatic security updates",
        "A smaller image",
      ],
      answer: [0],
      explanation: "Reproducible builds, at the cost of having to update the digest yourself. Automated dependency PRs make that painless.",
    },
    {
      id: "d4-05",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-registries",
      type: "match",
      prompt: "Match each part of `ghcr.io/acme/api:1.4.0@sha256:9f2b…` to what it is.",
      pairs: [
        ["`ghcr.io`", "The registry host"],
        ["`acme/api`", "The repository: namespace and name"],
        ["`1.4.0`", "The tag: a movable, human-friendly label"],
        ["`sha256:9f2b…`", "The digest: an immutable content hash"],
      ],
      explanation: "When a digest is present, it wins: the image is pulled by content, whatever the tag currently points at.",
    },
    {
      id: "d4-06",
      domain: "d4",
      level: "junior",
      lesson: "d4-security",
      prompt: "Why should a containerized app run as a non-root user?",
      options: [
        "If the app is compromised, the attacker gets fewer privileges inside the container and less to work with if they break out",
        "Root containers can't use the network",
        "Non-root images are smaller",
        "Docker refuses to run root containers",
      ],
      answer: [0],
      explanation: "Root in a container is the same user ID as root on the host (unless you use user namespaces or rootless mode). Don't hand it out by default.",
    },
    {
      id: "d4-07",
      domain: "d4",
      level: "senior",
      lesson: "d4-security",
      type: "lines",
      prompt: "Anyone who pulls this image can read the private registry token. Tap the line that writes it into an image layer.",
      code: snip("FROM node:22-slim", "WORKDIR /app", "ARG NPM_TOKEN", "COPY . .", 'RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > .npmrc && npm ci', 'CMD ["node", "server.js"]'),
      codeLang: "dockerfile",
      answer: [5],
      explanation: "The `.npmrc` stays in that layer, and the build arg also shows up in `docker history`. Use `RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci` instead.",
    },
    {
      id: "d4-08",
      domain: "d4",
      level: "senior",
      lesson: "d4-security",
      prompt: "The image is built with `docker build --secret id=npmrc,src=$HOME/.npmrc .`. Where does the `.npmrc` end up?",
      code: snip("FROM node:22-slim", "WORKDIR /app", "COPY package*.json ./", "RUN --mount=type=secret,id=npmrc,target=/root/.npmrc npm ci"),
      codeLang: "dockerfile",
      options: [
        "It's mounted only while that RUN step executes; it isn't stored in any layer or in the image history",
        "It's copied to /root in the final image",
        "It's in a hidden layer that `docker history` shows",
        "It's pushed to the registry next to the image",
      ],
      answer: [0],
      explanation: "Secret mounts are BuildKit's answer to build-time credentials: available to the command, absent from the result.",
    },
    {
      id: "d4-09",
      domain: "d4",
      level: "senior",
      lesson: "d4-security",
      prompt: "Which `docker run` options shrink a container's attack surface? (Choose two.)",
      options: [
        "`--read-only` (a read-only root filesystem)",
        "`--cap-drop ALL`, adding back only the capabilities the app needs",
        "`--privileged`",
        "`-v /var/run/docker.sock:/var/run/docker.sock`",
        "`--user root`",
      ],
      answer: [0, 1],
      explanation: "The other three do the opposite: `--privileged` and the Docker socket each hand the container near-total control of the host.",
    },
    {
      id: "d4-10",
      domain: "d4",
      level: "senior",
      lesson: "d4-security",
      prompt: "A CI tool asks you to mount `/var/run/docker.sock` into its container. Why is that a big deal?",
      options: [
        "Whoever can talk to the Docker socket can start privileged containers and mount the host's filesystem: it's effectively root on the host",
        "It makes builds slower",
        "It only exposes container logs",
        "It's harmless because the socket is read-only",
      ],
      answer: [0],
      explanation: "Treat socket access like root access. Prefer rootless builders or a remote BuildKit instead.",
    },
    {
      id: "d4-11",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-security",
      prompt: "Where does a `USER app` instruction belong in a Dockerfile?",
      options: [
        "After the steps that need root (installing packages, creating the user), before CMD",
        "Before FROM",
        "Anywhere: its position doesn't matter",
        "Nowhere: users can only be set with `docker run`",
      ],
      answer: [0],
      explanation: "USER affects every instruction after it and the container's process. Package installs usually need root, so switch afterwards.",
    },
    {
      id: "d4-12",
      domain: "d4",
      level: "junior",
      lesson: "d4-security",
      prompt: "Why choose a minimal base image (slim, distroless, alpine) for production? (Choose two.)",
      options: [
        "Fewer packages mean fewer vulnerabilities to patch",
        "Smaller images pull and start faster",
        "Minimal images execute code faster",
        "They include more debugging tools",
        "Docker Hub requires them",
      ],
      answer: [0, 1],
      explanation: "Every package is something to patch and something an attacker could use. Ship only what the app needs.",
    },
    {
      id: "d4-13",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-security",
      prompt: "An image scan reports a critical CVE in a package that comes from your base image. What's the right fix?",
      options: [
        "Rebuild on a patched version of the base image (and keep rebuilding regularly), then redeploy",
        "Delete the scan report",
        "Run the container as root",
        "Add the CVE ID to `.dockerignore`",
      ],
      answer: [0],
      explanation: "Images don't patch themselves: a running container keeps the packages it was built with. Scheduled rebuilds keep you current.",
    },
    {
      id: "d4-14",
      domain: "d4",
      level: "staff",
      lesson: "d4-supply",
      prompt: "What is an SBOM, and why attach one to every image?",
      options: [
        "A software bill of materials: a machine-readable list of every package and version inside, so you can see at once which images a new CVE affects",
        "A build log for debugging failed builds",
        "A cryptographic signature",
        "A Dockerfile linter report",
      ],
      answer: [0],
      explanation: "Without SBOMs, answering \"do we ship the vulnerable library?\" means inspecting every image by hand. BuildKit can generate one at build time (`--sbom=true`).",
    },
    {
      id: "d4-15",
      domain: "d4",
      level: "staff",
      lesson: "d4-supply",
      prompt: "How do you ensure your clusters only run images that your CI built?",
      options: [
        "Sign images in CI (e.g. with Sigstore Cosign or Notation) and enforce signature verification with an admission policy in the cluster",
        "Always deploy the `latest` tag",
        "Make the registry public",
        "Reference images by name only",
      ],
      answer: [0],
      explanation: "Signing proves origin; admission control enforces it. Either alone leaves a gap.",
    },
    {
      id: "d4-16",
      domain: "d4",
      level: "senior",
      lesson: "d4-supply",
      prompt: "What does this produce?",
      code: snip("docker buildx build \\", "  --platform linux/amd64,linux/arm64 \\", "  -t registry.example.com/team/api:1.4.0 \\", "  --push ."),
      codeLang: "bash",
      options: [
        "One tag pointing at a multi-platform image index with an amd64 and an arm64 image; each machine pulls the one for its CPU",
        "Two different tags, one per platform",
        "A single image that runs natively on any CPU",
        "A Windows image",
      ],
      answer: [0],
      explanation: "The registry stores both images behind one name. Building the non-native platform uses emulation (QEMU) or a remote builder of that architecture.",
    },
    {
      id: "d4-17",
      domain: "d4",
      level: "senior",
      lesson: "d4-supply",
      prompt: "An image built on an Apple Silicon Mac crashes on an x86-64 server with `exec format error`. Why?",
      options: [
        "It was built for linux/arm64 and the server needs linux/amd64: build for that platform, or as a multi-platform image",
        "The server's Docker version is too old",
        "The image is corrupted",
        "Images built on a Mac can't run on Linux",
      ],
      answer: [0],
      explanation: "Docker builds for the builder's own architecture by default. `--platform linux/amd64` (or a CI build on amd64) fixes it.",
    },
    {
      id: "d4-18",
      domain: "d4",
      level: "staff",
      lesson: "d4-supply",
      prompt: "Which practices harden your image supply chain? (Choose two.)",
      options: [
        "Pin base images by digest and update them through automated, reviewed pull requests",
        "Generate SBOM and provenance attestations at build time",
        "Pull public images straight into production without review",
        "Share one registry password across every team",
        "Build production images on developers' laptops",
      ],
      answer: [0, 1],
      explanation: "Know exactly what goes in, record what came out and how. The others widen the attack surface or remove traceability.",
    },
    {
      id: "d4-19",
      domain: "d4",
      level: "staff",
      lesson: "d4-k8s",
      prompt: "Moving to Kubernetes, what replaces `docker run -d --restart always -p 80:3000 api:1.4.0`?",
      options: [
        "A Deployment (replicas, restarts, rolling updates) plus a Service (stable name and load balancing), using the same image",
        "A ConfigMap",
        "A PersistentVolume",
        "A CronJob",
      ],
      answer: [0],
      explanation: "The image doesn't change. The Deployment keeps it running; the Service gives it a stable address; an Ingress or Gateway exposes HTTP outside the cluster.",
    },
    {
      id: "d4-20",
      domain: "d4",
      level: "staff",
      lesson: "d4-k8s",
      prompt: "Do Kubernetes nodes need Docker installed to run images you built with Docker?",
      options: [
        "No: they're standard OCI images, and nodes run them with a CRI runtime such as containerd or CRI-O",
        "Yes, Docker Engine is required on every node",
        "Only on Windows nodes",
        "Only for images from Docker Hub",
      ],
      answer: [0],
      explanation: "Kubernetes removed its built-in Docker Engine integration (dockershim) years ago. Docker remains a great tool for building images.",
    },
    {
      id: "d4-21",
      domain: "d4",
      level: "staff",
      lesson: "d4-k8s",
      prompt: "Your Dockerfile has a `HEALTHCHECK`. On Kubernetes, what decides whether the container is healthy?",
      options: [
        "Liveness, readiness and startup probes in the pod spec; Kubernetes doesn't use the Dockerfile HEALTHCHECK",
        "The Dockerfile HEALTHCHECK, automatically",
        "Nothing: Kubernetes doesn't check health",
        "The image registry",
      ],
      answer: [0],
      explanation: "Readiness controls whether a pod gets traffic; liveness whether it gets restarted. Define both deliberately; they mean different things.",
    },
    {
      id: "d4-22",
      domain: "d4",
      level: "staff",
      lesson: "d4-k8s",
      prompt: "A Deployment's pod template looks like this. Why do experienced teams avoid it?",
      code: snip("spec:", "  containers:", "    - name: api", "      image: api:latest"),
      codeLang: "yaml",
      options: [
        "You can't tell which build is running or roll back reliably, and different nodes can end up running different images; use immutable versions or digests",
        "`latest` images run slower",
        "Kubernetes rejects the `latest` tag",
        "`latest` disables health probes",
      ],
      answer: [0],
      explanation: "A rollback to `latest` is a rollback to whatever `latest` is now. (Kubernetes also defaults `imagePullPolicy` to Always for `latest`, so every pod start hits the registry.)",
    },
    {
      id: "d4-23",
      domain: "d4",
      level: "staff",
      lesson: "d4-k8s",
      type: "order",
      prompt: "Order a safe production rollout of a new image version.",
      items: [
        "CI builds the image and tags it with an immutable version or the commit SHA",
        "CI pushes the image, then scans and signs it",
        "The Deployment is updated to reference the new tag or digest",
        "Kubernetes replaces pods gradually, waiting for each new pod's readiness probe",
        "Watch error rates and roll back to the previous version if needed",
      ],
      explanation: "Immutable references at the start are what make the last step (rolling back) trustworthy.",
    },
    {
      id: "d4-24",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-k8s",
      prompt: "On Kubernetes, what's the equivalent of `docker run --memory 512m --cpus 1`?",
      options: [
        "Resource requests and limits on the container (`resources.requests` and `resources.limits`)",
        "A ConfigMap",
        "A node label",
        "An Ingress rule",
      ],
      answer: [0],
      explanation: "Requests tell the scheduler what to reserve; limits are enforced like Docker's flags. Exceeding the memory limit gets the container OOM-killed.",
    },
    {
      id: "d4-25",
      domain: "d4",
      level: "senior",
      lesson: "d4-security",
      type: "lines",
      prompt: "Tap the option that removes nearly all isolation between this container and the host.",
      code: snip("docker run -d --name api \\", "  --privileged \\", "  -p 8080:3000 \\", "  api:1.4.0"),
      codeLang: "bash",
      answer: [2],
      explanation: "`--privileged` grants all capabilities and access to host devices. Ordinary apps never need it; grant specific capabilities with `--cap-add` if something truly does.",
    },
  ],

  cards: [
    { id: "c4-tag", domain: "d4", kind: "service", term: "docker tag", definition: "Give an existing image another name, e.g. one that includes a registry host." },
    { id: "c4-push", domain: "d4", kind: "service", term: "docker push", definition: "Upload an image to the registry named in its reference." },
    { id: "c4-buildx", domain: "d4", kind: "service", term: "docker buildx build", definition: "BuildKit builds with extras: --platform for multi-arch, --sbom/--provenance, remote caches." },
    { id: "c4-secret-mount", domain: "d4", kind: "service", term: "RUN --mount=type=secret", definition: "Expose a build secret to one RUN step without storing it in any layer." },
    { id: "c4-user", domain: "d4", kind: "service", term: "USER", definition: "Dockerfile instruction setting the user for later steps and for the container's process." },
    { id: "c4-cosign", domain: "d4", kind: "service", term: "Cosign", definition: "Sigstore tool for signing and verifying container images and attestations." },
    { id: "c4-deployment", domain: "d4", kind: "service", term: "Kubernetes Deployment", definition: "Keeps N replicas of a pod running and rolls out new image versions gradually." },
    { id: "c4-digest", domain: "d4", kind: "concept", term: "Image digest", definition: "sha256 hash identifying exact image content. Unlike a tag, it can never point elsewhere." },
    { id: "c4-latest", domain: "d4", kind: "concept", term: "latest tag", definition: "Just the default tag name. Not necessarily the newest image, and a poor choice for deploys." },
    { id: "c4-sbom", domain: "d4", kind: "concept", term: "SBOM", definition: "Software bill of materials: a list of every package and version in an image." },
    { id: "c4-multiplatform", domain: "d4", kind: "concept", term: "Multi-platform image", definition: "One tag backed by an index of per-architecture images (e.g. amd64 and arm64)." },
    { id: "c4-oci", domain: "d4", kind: "concept", term: "OCI image", definition: "The open standard image format Docker builds and every major runtime and registry understands." },
  ],
});
