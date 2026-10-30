import { defineCourse, withQuestions } from "@/engine/define";
import { moreQuestions } from "./more";
import d1 from "./domains/d1-containers";
import d2 from "./domains/d2-images";
import d3 from "./domains/d3-data-networks";
import d4 from "./domains/d4-ship-safely";

/**
 * Learn Docker & Containers: from "what is a container?" to multi-stage
 * builds, Compose, image security and the supply chain. Based on the official
 * Docker documentation; behaviour targets current Docker Engine and BuildKit.
 */
export default defineCourse({
  id: "code-docker",
  kind: "learning",
  category: "tools",
  tags: ["docker", "containers", "dockerfile", "images", "compose", "volumes", "networking", "kubernetes", "devops"],
  provider: { id: "docker", name: "Docker", color: "#2496ed", icon: "🐳" },
  code: "DOCKER",
  title: "Learn Docker & Containers",
  shortTitle: "Docker",
  tagline: "Run your first container, write Dockerfiles that build in seconds, wire up Compose, and ship small, secure images.",
  level: "Beginner",
  storageKey: "course:code-docker:v1",

  domains: withQuestions([d1, d2, d3, d4], moreQuestions),

  exam: {
    questions: 30,
    unscored: 0,
    minutes: 45,
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "One correct answer. Often \"what does this print?\" or \"what happens when…?\"." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "The prompt says how many to pick. You need all of them right to score." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Arrange commands, Dockerfile lines or steps into the order that works." },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair each instruction, flag or idea with what it does. Every pair must be right." },
      { id: "lines", icon: "🐞", name: "Bug hunt", rule: "Tap the line (or lines) in the Dockerfile, command or config that causes the problem." },
    ],
  },

  guide: {
    source: {
      label: "Docker learning path, based on the official Docker documentation",
      version: "2026",
      date: "October 2026",
      url: "https://docs.docker.com/",
    },
    facts: [
      { icon: "🏁", value: "30", label: "question final check", detail: "The final skill check mixes 30 questions from every world in 45 minutes. Score 70 to pass." },
      { icon: "🌱", value: "Zero", label: "experience needed", detail: "World 1 starts with what a container actually is. Each world builds on the last." },
      { icon: "🧪", value: "3", label: "playground labs", detail: "Drive a container through its lifecycle, watch the layer cache hit and miss, and debug ports and networks." },
      { icon: "📄", value: "Real", label: "Dockerfiles", detail: "Snippets use the Dockerfile, shell and Compose syntax you'll write at work, and bug hunts are mistakes teams really make." },
      { icon: "🛡️", value: "Secure", label: "by the end", detail: "World 4 covers non-root images, build secrets, SBOMs, signing and multi-platform builds." },
      { icon: "☸️", value: "K8s", label: "ready", detail: "The last lessons map what you know onto Kubernetes, so the next step isn't a cliff." },
    ],
    candidate: {
      is: [
        "A developer who has never used containers, or only copies docker run commands from READMEs",
        "Someone who has to write or review Dockerfiles and Compose files for a team",
        "Preparing to deploy services to a container platform or Kubernetes",
        "An engineer who wants faster builds, smaller images and fewer security findings",
      ],
      isNot: [
        "A Kubernetes administration course (it ends where Kubernetes begins)",
        "A guide to a specific cloud's container service",
        "Docker Swarm or legacy Docker features",
        "Container runtime internals beyond what helps day to day",
      ],
    },
    scope: {
      label: "Topics covered",
      groups: [
        { category: "Basics", icon: "🐳", services: ["Containers versus VMs", "Images", "docker run", "ps / logs / exec", "stop / kill / rm"] },
        { category: "Dockerfiles", icon: "🧱", services: ["FROM", "RUN", "COPY", "CMD", "ENTRYPOINT", "ARG / ENV", "USER", ".dockerignore"] },
        { category: "Builds", icon: "⚡", services: ["Layers", "Build cache", "Multi-stage", "Cache mounts", "Base images"] },
        { category: "Runtime", icon: "🔌", services: ["Volumes", "Bind mounts", "Ports", "Networks & DNS", "Docker Compose"] },
        { category: "Security", icon: "🛡️", services: ["Non-root", "Build secrets", "Minimal images", "Capabilities", "Scanning"] },
        { category: "Shipping", icon: "🚢", services: ["Registries", "Tags & digests", "SBOM & provenance", "Signing", "Multi-platform", "Kubernetes"] },
      ],
    },
    tips: [
      { icon: "🧪", tip: "Type the commands yourself. `docker run --rm -it alpine sh` gives you a throwaway Linux box to experiment in." },
      { icon: "📦", tip: "Order Dockerfile steps from least to most frequently changed. Dependencies first, source code last." },
      { icon: "🗄️", tip: "If losing a container would lose data, that data belongs in a named volume." },
      { icon: "🔌", tip: "Can't connect? Check three things: the -p order (host port first, then container port), the app listening on 0.0.0.0, and the network the containers share." },
      { icon: "🏷️", tip: "Never deploy `latest`. Use versioned tags or digests so you always know what's running." },
      { icon: "🛡️", tip: "Run as non-root, keep secrets out of layers, and rebuild images regularly to pick up base-image patches." },
    ],
    officialPractice: { label: "Docker's getting-started guide (docs.docker.com)", url: "https://docs.docker.com/get-started/" },
  },

  cheatsheet: [
    {
      title: "Containers",
      items: [
        ["docker run -d --name api -p 8080:3000 img", "Named background container, host port 8080 to container port 3000"],
        ["docker run --rm -it img sh", "Throwaway interactive shell"],
        ["docker ps · docker ps -a", "Running containers · all containers"],
        ["docker logs -f api", "Follow a container's stdout and stderr"],
        ["docker exec -it api sh", "Shell inside a running container"],
        ["docker stop / kill / rm -f", "SIGTERM, then SIGKILL · SIGKILL at once · stop and delete"],
      ],
    },
    {
      title: "Dockerfile",
      items: [
        ["FROM image:tag AS name", "Start a (named) stage"],
        ["COPY package*.json ./ then RUN npm ci then COPY . .", "Cache-friendly order"],
        ["RUN a && b && cleanup", "One layer; cleanup in the same step"],
        ['CMD ["node", "server.js"]', "Exec form: the app is PID 1 and gets signals"],
        ["ENTRYPOINT + CMD", "A fixed program plus default arguments"],
        ["ARG and ENV", "ARG exists only at build time, ENV at build and run time"],
      ],
    },
    {
      title: "Images",
      items: [
        ["docker build -t name:tag .", "Build from the current folder (the context)"],
        ["docker image ls · docker history img", "List images · show an image's layers"],
        ["COPY --from=build /out/app /app", "Take only build output into the final stage"],
        ["docker tag / docker push", "Name it for a registry · upload it"],
        ["name:tag@sha256:…", "Pin exact content by digest"],
      ],
    },
    {
      title: "Data and networking",
      items: [
        ["-v pgdata:/var/lib/postgresql/data", "Named volume (keeps data)"],
        ['-v "$(pwd)":/app', "Bind mount a host folder"],
        ["-p 127.0.0.1:8080:3000", "Publish on the host's loopback only"],
        ["docker network create appnet", "User-defined network with DNS by name"],
        ["host.docker.internal", "Reach the host from a container (Docker Desktop)"],
      ],
    },
    {
      title: "Compose",
      items: [
        ["docker compose up -d", "Build and start the whole stack"],
        ["docker compose logs -f web", "Follow one service's logs"],
        ["docker compose exec web sh", "Shell into a service"],
        ["docker compose down (-v)", "Remove containers and network (and volumes)"],
        ["depends_on + condition: service_healthy", "Wait for a dependency to be ready"],
      ],
    },
    {
      title: "Security and shipping",
      items: [
        ["USER app", "Drop root before CMD"],
        ["RUN --mount=type=secret,id=x …", "Build secret that never lands in a layer"],
        ["--read-only · --cap-drop ALL", "Harden at run time"],
        ["--platform linux/amd64,linux/arm64", "Multi-platform build with buildx"],
        ["--sbom=true --provenance=true", "Attach attestations at build time"],
      ],
    },
  ],

  config: {
    quest: { length: 8 },
    boss: { questions: 25, minutes: 30 },
    examModes: [
      { id: "full", name: "Final skill check", icon: "🏁", questions: 30, unscored: 0, minutes: 45, full: true },
      { id: "quick", name: "Quick check", icon: "⚡", questions: 15, unscored: 0, minutes: 20, full: false },
    ],
  },

  boss: { name: "The Dangling Image Kraken", emoji: "🐙" },
  matchLabel: "Docker commands & instructions",
  levelTitles: [
    "Hello-World Hatchling",
    "Container Cadet",
    "Port Publisher",
    "Layer Stacker",
    "Cache Whisperer",
    "Volume Keeper",
    "Compose Conductor",
    "Multi-Stage Mage",
    "Supply-Chain Sentinel",
    "Captain of the Fleet",
  ],
});
