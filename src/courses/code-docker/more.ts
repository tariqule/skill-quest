import type { Question } from "@/engine/types";

/**
 * Extra question types for the Docker track: fill-in-the-instruction and short "type the value" questions.
 * Checked with Docker Engine 27: the ENTRYPOINT/CMD, USER and `echo` snippets were built and run, and the
 * Compose file passed `docker compose config`. The Kubernetes rounding rule is from the Deployment docs.
 */
export const moreQuestions: Question[] = [
  // ───────────── fill ─────────────
  {
    id: "dkr-fx-01",
    type: "fill",
    domain: "d1",
    level: "junior",
    lesson: "d1-run",
    prompt: "Fill the gaps to start nginx in the background and make it reachable on the host's port 8080 (the container listens on 80).",
    code: "docker run {{1}} --name web {{2}} 8080:80 nginx",
    codeLang: "bash",
    blanks: [
      { options: ["-d", "-it", "--rm", "--init"], answer: 0 },
      { options: ["-p", "-v", "-e", "--network"], answer: 0 },
    ],
    explanation:
      "`-d` detaches the container so it runs in the background, and `-p host:container` publishes a port, so `8080:80` maps host port 8080 to container port 80. `-it` would attach your terminal, and `-v` and `-e` mount volumes and set environment variables.",
  },
  {
    id: "dkr-fx-02",
    type: "fill",
    domain: "d2",
    level: "junior",
    lesson: "d2-dockerfile",
    prompt: "Fill the gaps so later instructions run inside `/app`, and the container starts the server by default.",
    code: "FROM node:22-slim\n{{1}} /app\nCOPY . .\n{{2}} [\"node\", \"server.js\"]",
    codeLang: "dockerfile",
    blanks: [
      { options: ["WORKDIR", "CD", "MKDIR", "ROOT"], answer: 0 },
      { options: ["CMD", "RUN", "EXPOSE", "ENV"], answer: 0 },
    ],
    explanation:
      "`WORKDIR` sets (and creates) the working directory for every instruction after it. `CMD` sets the default command the container runs. `RUN` executes at build time, `EXPOSE` only documents a port, and `ENV` sets a variable. There is no `CD` instruction.",
  },
  {
    id: "dkr-fx-03",
    type: "fill",
    domain: "d3",
    level: "intermediate",
    lesson: "d3-compose",
    prompt: "Fill the gaps so `api` starts after `db` and the named volume `pgdata` is declared for Compose to manage.",
    code:
      "services:\n  db:\n    image: postgres:16\n    volumes: [pgdata:/var/lib/postgresql/data]\n  api:\n    build: .\n    {{1}}: [db]\n{{2}}:\n  pgdata:",
    codeLang: "yaml",
    blanks: [
      { options: ["depends_on", "links", "requires", "after"], answer: 0 },
      { options: ["volumes", "storage", "mounts", "disks"], answer: 0 },
    ],
    explanation:
      "`depends_on` controls start order between services. Named volumes are declared under the top-level `volumes:` key, which is separate from the per-service `volumes:` list that mounts them. (`depends_on` waits for the container to start, not for the database to be ready, unless you add a health check condition.)",
  },
  {
    id: "dkr-fx-04",
    type: "fill",
    domain: "d2",
    level: "intermediate",
    lesson: "d2-multistage",
    prompt: "Fill the gaps to name the first stage `build` and copy the compiled binary from it into the final image.",
    code:
      "FROM golang:1.25 {{1}} build\nRUN go build -o /app .\n\nFROM scratch\nCOPY {{2}}=build /app /app\nCMD [\"/app\"]",
    codeLang: "dockerfile",
    blanks: [
      { options: ["AS", "NAME", "TAG", "STAGE"], answer: 0 },
      { options: ["--from", "--stage", "--source", "--copy-from"], answer: 0 },
    ],
    explanation:
      "`FROM image AS name` names a build stage, and `COPY --from=name` pulls files out of that stage. Only the last stage becomes the shipped image, so the Go toolchain stays behind and the final image holds just the binary.",
  },
  {
    id: "dkr-fx-05",
    type: "fill",
    domain: "d4",
    level: "senior",
    lesson: "d4-security",
    prompt:
      "Harden this container: run as a non-root user and drop every Linux capability. Keep the root filesystem read-only. Fill the gaps.",
    code:
      "docker run --read-only \\\n  --user {{1}} \\\n  --cap-drop {{2}} \\\n  --security-opt no-new-privileges:true \\\n  myapp:1.4.2",
    codeLang: "bash",
    blanks: [
      { options: ["1000:1000", "root", "0:0", "sudo"], answer: 0 },
      { options: ["ALL", "NONE", "ROOT", "NET_ADMIN"], answer: 0 },
    ],
    explanation:
      "UID/GID `1000:1000` is an unprivileged user (`root` and `0:0` are the same superuser, and `sudo` is not a user). `--cap-drop ALL` removes all capabilities, and you add back only what the app truly needs with `--cap-add`. `NET_ADMIN` is a capability, and dropping it alone would leave the rest.",
  },
  {
    id: "dkr-fx-06",
    type: "fill",
    domain: "d4",
    level: "staff",
    lesson: "d4-supply",
    prompt:
      "A tag like `22-slim` can be re-pushed to different content. Fill the gap to pin the base image to an immutable content digest.",
    code:
      "FROM node:22-slim{{1}}sha256:3f1c9a7e5b2d48803f1c9a7e5b2d48803f1c9a7e5b2d48803f1c9a7e5b2d4880",
    codeLang: "dockerfile",
    blanks: [{ options: ["@", ":", "#", "="], answer: 0 }],
    explanation:
      "`name:tag@sha256:<digest>` selects the image by its content hash. The tag stays as a readable hint, but the digest is what is verified, so the build is reproducible and a re-pushed tag cannot change what you ship. Update digests deliberately (for example with Dependabot or Renovate) so you still get security patches.",
  },

  // ───────────── output ─────────────
  {
    id: "dkr-ox-01",
    type: "output",
    domain: "d1",
    level: "junior",
    lesson: "d1-run",
    prompt: "Type what this command prints to your terminal.",
    code: "docker run --rm alpine sh -c 'echo $((6*7))'",
    codeLang: "bash",
    answers: ["42"],
    explanation:
      "The container starts, runs the shell, which prints 42 (the arithmetic is evaluated inside the container), and exits. `--rm` removes the stopped container, so nothing is left in `docker ps -a`.",
  },
  {
    id: "dkr-ox-02",
    type: "output",
    domain: "d2",
    level: "intermediate",
    lesson: "d2-cache",
    prompt:
      "You edit only `src/app.js` and rebuild. Type the number of the first Dockerfile line (counting from 1) whose cache is missed.",
    code:
      "FROM node:22-slim\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nCMD [\"node\", \"src/app.js\"]",
    codeLang: "dockerfile",
    answers: ["5"],
    explanation:
      "Lines 1 to 4 depend only on the base image and the package files, which did not change, so they come from cache and `npm ci` is skipped. `COPY . .` on line 5 includes the edited file, so its cache key changes and every line after it rebuilds too. This ordering is why dependency files are copied first.",
  },
  {
    id: "dkr-ox-03",
    type: "output",
    domain: "d3",
    level: "intermediate",
    lesson: "d3-networks",
    prompt:
      "The `api` container must connect to Redis on the default Compose network. Type the hostname its connection string should use.",
    code:
      "services:\n  api:\n    build: .\n    ports: [\"8080:8080\"]\n  cache:\n    image: redis:7\n    # no ports: published",
    codeLang: "yaml",
    answers: ["cache"],
    explanation:
      "Compose puts both services on one network where each service name is a DNS name, so `api` reaches Redis at `cache:6379`. `localhost` would be the api container itself. The `cache` service needs no `ports:` entry because publishing is only for traffic coming from the host.",
  },
  {
    id: "dkr-ox-04",
    type: "output",
    domain: "d2",
    level: "senior",
    lesson: "d2-entrypoint",
    prompt: "Type what `docker run demo c` prints (the image was built from this Dockerfile).",
    code: "FROM alpine:3.20\nENTRYPOINT [\"echo\", \"a\"]\nCMD [\"b\"]",
    codeLang: "dockerfile",
    answers: ["a c"],
    explanation:
      "The exec-form ENTRYPOINT is always run, and CMD supplies default arguments that anything after the image name replaces. So `docker run demo` prints `a b`, while `docker run demo c` swaps `b` for `c` and prints `a c`. To replace the ENTRYPOINT itself you would need `--entrypoint`.",
  },
  {
    id: "dkr-ox-05",
    type: "output",
    domain: "d4",
    level: "senior",
    lesson: "d4-security",
    prompt: "Type what `docker run --rm demo` prints.",
    code:
      "FROM alpine:3.20\nRUN adduser -D -u 1500 app\nUSER app\nCMD [\"id\", \"-u\"]",
    codeLang: "dockerfile",
    answers: ["1500"],
    explanation:
      "`USER app` makes every later instruction and the container's main process run as that user, whose UID was set to 1500 by `adduser -u`. Without the `USER` line the command would print 0, because containers run as root by default.",
  },
  {
    id: "dkr-ox-06",
    type: "output",
    domain: "d4",
    level: "staff",
    lesson: "d4-k8s",
    prompt:
      "Type the maximum number of Pods that can exist at the same moment during this rolling update (Kubernetes rounds `maxSurge` percentages up and `maxUnavailable` percentages down).",
    code:
      "apiVersion: apps/v1\nkind: Deployment\nspec:\n  replicas: 10\n  strategy:\n    type: RollingUpdate\n    rollingUpdate:\n      maxSurge: 25%\n      maxUnavailable: 25%",
    codeLang: "yaml",
    answers: ["13"],
    explanation:
      "25% of 10 is 2.5. `maxSurge` rounds up to 3 extra Pods, so the ceiling is 10 + 3 = 13. `maxUnavailable` rounds down to 2, so at least 8 Pods must stay available. Setting `maxUnavailable: 0` with a surge of 1 is the common zero-downtime choice.",
  },
];
