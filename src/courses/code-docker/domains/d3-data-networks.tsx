import { CodeBlock, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { PortLab } from "../labs";
import { snip } from "../snippet";

/** World 3: volumes and bind mounts, ports, networks, and Docker Compose. */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Data, Networks & Compose",
    world: "Port Harbor",
    weight: 25,
    emoji: "🔌",
    color: "#f472b6",
    summary: "Keeping data with volumes and bind mounts, publishing ports, container networking and DNS, and running multi-container apps with Compose.",
  },

  tasks: [
    {
      id: "3.1",
      title: "Storage",
      covers: ["Named volumes", "Bind mounts", "Anonymous volumes and tmpfs", "What happens when you mount over image content", "Backing up container data"],
    },
    {
      id: "3.2",
      title: "Ports and networks",
      covers: ["-p HOST:CONTAINER", "Binding to 127.0.0.1", "localhost inside a container", "User-defined networks and DNS", "Reaching the host", "Published ports and host firewalls"],
    },
    {
      id: "3.3",
      title: "Docker Compose",
      covers: ["compose.yaml services, ports, volumes, environment", "up, down, logs", "Service names as hostnames", "depends_on and health checks", "From Compose to Kubernetes"],
    },
  ],

  lessons: [
    {
      id: "d3-start-data",
      level: "beginner",
      task: "3.1",
      title: "Where a container keeps its files",
      check: ["dkr-b3-01", "dkr-b3-02"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={2}
            tiles={[
              { icon: "🛏️", title: "Inside the container", text: "Like a hotel room. Leave something there and it's cleared away when you check out (delete the container).", color: "#fb7185" },
              { icon: "🧳", title: "In a volume", text: "Like a locker you rent. It stays put, and the next container can open it and find everything still there.", color: "#34d399" },
            ]}
          />
          <CodeBlock
            lang="bash"
            code={snip(
              "docker run -it -v notes:/data alpine sh   # a volume called notes, shown at /data",
              "# inside: echo hi > /data/todo.txt, then exit",
              "docker run --rm -v notes:/data alpine cat /data/todo.txt   # a new container still sees: hi",
            )}
          />
        </div>
      ),
      points: [
        "A container can create and change files while it runs. But those files belong to that one container, and they're deleted when you delete it.",
        "That's fine for a web server, but terrible for a database. You'd lose every saved record the first time you replaced the container.",
        "A **volume** is storage that Docker keeps outside any container. You attach it with `-v name:/path`, and the files under that path go into the volume.",
        "Delete the container, start a new one with the same `-v`, and your files are still there.",
      ],
      tip: "A good habit: if you'd be upset to lose it, keep it in a volume.",
    },
    {
      id: "d3-start-ports",
      level: "beginner",
      task: "3.2",
      title: "Opening a door with a port",
      check: ["dkr-b3-03", "dkr-b3-04"],
      visual: (
        <Flow
          color="#f472b6"
          steps={[
            { icon: "🌍", label: "Your browser", sub: "opens localhost:8080" },
            { icon: "🚪", label: "-p 8080:80", sub: "your computer's door 8080 leads to the container's door 80" },
            { icon: "🐳", label: "nginx container", sub: "listening on port 80" },
          ]}
        />
      ),
      points: [
        "A **port** is a numbered door that a program listens on. Web servers usually use port 80, and many dev servers use 3000 or 8080.",
        "A container is like a room with the doors shut. Programs inside can listen on a port, but nothing outside can reach them yet.",
        "`-p 8080:80` opens a door. Traffic to port 8080 on your computer goes to port 80 inside the container. Your computer's number comes first.",
        "So after `docker run -d -p 8080:80 nginx`, you open `http://localhost:8080` in your browser to see the nginx welcome page.",
      ],
      tip: "If port 8080 is already taken on your computer, pick another number for the first half, like `-p 8081:80`. The container's side stays the same.",
    },
    {
      id: "d3-storage",
      level: "intermediate",
      task: "3.1",
      title: "Volumes and bind mounts",
      check: ["d3-01", "d3-02"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🗄️", title: "Named volume", text: "`-v pgdata:/var/lib/postgresql/data`. Docker-managed storage that outlives containers. Best for databases.", color: "#34d399" },
              { icon: "📂", title: "Bind mount", text: "`-v \"$(pwd)\":/app`. A host folder you choose, mapped in. Best for live-editing code in development.", color: "#38bdf8" },
              { icon: "⚡", title: "tmpfs", text: "`--tmpfs /tmp`. In memory only, never written to disk. Best for scratch and sensitive temp files.", color: "#f59e0b" },
            ]}
          />
          <CodeBlock
            lang="bash"
            code={snip(
              "docker volume create pgdata",
              "docker run -d --name db -e POSTGRES_PASSWORD=example \\",
              "  -v pgdata:/var/lib/postgresql/data postgres:17",
              "docker rm -f db             # the container is gone…",
              "docker volume ls            # …but pgdata (and the data) is still here",
            )}
          />
        </div>
      ),
      points: [
        "A container's writable layer dies with the container. Anything you need to keep goes in a volume or bind mount.",
        "Docker creates and manages **named volumes** for you. A **bind mount** instead maps a specific folder on the host into the container.",
        "`-v /some/path` with no name creates an anonymous volume: a new, empty one for every new container.",
        "An empty named volume is pre-filled with the image's files at that path. A bind mount hides them instead.",
      ],
      tip: "Name every volume that holds real data. `docker volume ls` full of random hashes is how databases get lost during cleanup.",
    },
    {
      id: "d3-ports",
      level: "junior",
      task: "3.2",
      title: "Publishing ports",
      check: ["d3-08", "d3-09"],
      visual: <PortLab />,
      points: [
        "`-p 8080:3000` forwards port 8080 on the host (your computer) to port 3000 in the container. The order is always host first, then container.",
        "Published ports listen on all host interfaces by default. `-p 127.0.0.1:8080:3000` keeps it on this machine only.",
        "Inside a container, `localhost` is the container itself. Your app must listen on `0.0.0.0`, meaning every network interface, to accept traffic from outside it.",
        "Containers on the same user-defined network reach each other directly on container ports. Publishing is only for traffic from outside Docker.",
      ],
      tip: "\"Works in the container, not from my browser\" is almost always one of two things: a missing `-p`, or an app listening on 127.0.0.1.",
    },
    {
      id: "d3-networks",
      level: "intermediate",
      task: "3.2",
      title: "Container networks and DNS",
      check: ["d3-14", "d3-15"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="bash"
            code={snip(
              "docker network create appnet",
              "docker run -d --name api --network appnet my-api",
              "docker run -d --name web --network appnet -p 8080:80 my-web",
              "# inside web: http://api:3000 works (built-in DNS by container name)",
            )}
          />
          <Flow
            color="#f472b6"
            steps={[
              { icon: "🌍", label: "Browser", sub: "localhost:8080 (published)" },
              { icon: "🖥️", label: "web", sub: "on appnet, -p 8080:80" },
              { icon: "⚙️", label: "api", sub: "http://api:3000, not published" },
              { icon: "🗄️", label: "db", sub: "db:5432, not published" },
            ]}
          />
        </div>
      ),
      points: [
        "Networks you create yourself (user-defined bridge networks) have built-in DNS, the name lookup service. Containers on them find each other by name.",
        "The default `bridge` network doesn't resolve container names, which is why you create your own network (Compose does it for you).",
        "Talk to other containers on their container port (`api:3000`), not on a published host port.",
        "To reach a service running on the host itself, Docker Desktop provides the name `host.docker.internal`.",
      ],
      tip: "Publish only the front door. Databases and internal APIs usually need no `-p` at all; they're reachable on the private network.",
    },
    {
      id: "d3-compose",
      level: "intermediate",
      task: "3.3",
      title: "Docker Compose",
      check: ["d3-17", "d3-19"],
      visual: (
        <CodeBlock
          lang="yaml"
          caption="compose.yaml: a web app and its database"
          code={snip(
            "services:",
            "  web:",
            "    build: .",
            "    ports:",
            '      - "8080:3000"',
            "    environment:",
            "      DATABASE_HOST: db       # the service name is the hostname",
            "    depends_on:",
            "      db:",
            "        condition: service_healthy",
            "  db:",
            "    image: postgres:17",
            "    environment:",
            "      POSTGRES_PASSWORD: example",
            "    healthcheck:",
            '      test: ["CMD", "pg_isready", "-U", "postgres"]',
            "    volumes:",
            "      - pgdata:/var/lib/postgresql/data",
            "volumes:",
            "  pgdata:",
          )}
        />
      ),
      points: [
        "Compose describes a whole app (services, networks, volumes) in one file. `docker compose up -d` builds and starts it all.",
        "Compose puts every service on a shared project network, so services reach each other by service name.",
        "`depends_on` alone only orders start-up. Add a healthcheck and `condition: service_healthy` to wait for readiness.",
        "`docker compose down` removes the containers and the network but keeps named volumes. `down -v` deletes the volumes too.",
      ],
      tip: "Commit `compose.yaml` to the repo. A new teammate going from `git clone` to a running stack with one command is the best onboarding there is.",
    },
  ],

  questions: [
    {
      id: "dkr-b3-01",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-data",
      prompt: "You save a file inside a container (not in a volume), then delete the container with `docker rm`. What happens to the file?",
      options: [
        "It's deleted along with the container",
        "It's moved to your desktop",
        "It's saved into the image for next time",
        "It's uploaded to Docker Hub",
      ],
      answer: [0],
      explanation: "Files written inside a container live only in that container. Delete the container and they go with it, which is why anything worth keeping belongs in a volume.",
    },
    {
      id: "dkr-b3-02",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-data",
      type: "fill",
      prompt: "Fill the gap to attach a volume called `notes` at `/data`, so files saved there outlive the container.",
      code: "docker run -it {{1}} notes:/data alpine sh",
      codeLang: "bash",
      blanks: [{ options: ["-v", "-p", "-e", "-d"], answer: 0 }],
      explanation: "`-v name:/path` attaches a volume. `-p` publishes a port, `-e` sets an environment variable, and `-d` runs the container in the background.",
    },
    {
      id: "dkr-b3-03",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-ports",
      prompt: "What does `-p 8080:80` do in `docker run -d -p 8080:80 nginx`?",
      options: [
        "Connects port 8080 on your computer to port 80 inside the container",
        "Limits the container to 80 percent of the host's CPU time",
        "Starts 8080 copies of nginx",
        "Downloads version 8080 of nginx",
      ],
      answer: [0],
      explanation: "`-p` publishes a port. The first number is the door on your computer, and the second is the door inside the container, so `localhost:8080` reaches nginx on port 80.",
    },
    {
      id: "dkr-b3-04",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-ports",
      type: "fill",
      prompt: "nginx listens on port 80 inside the container. Fill the gap so you can open it at `http://localhost:8080`.",
      code: "docker run -d -p {{1}}:80 nginx",
      codeLang: "bash",
      blanks: [{ options: ["8080", "80", "443", "3000"], answer: 0 }],
      explanation: "Your computer's port goes first and the container's port second. You want to visit 8080 on your computer, so the mapping is `8080:80`.",
    },
    {
      id: "dkr-b3-05",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-ports",
      prompt: "You start a web server container with no `-p` option at all. Can you open it in your browser at `localhost`?",
      options: [
        "No: a container's ports are closed to your computer until you publish one with `-p`",
        "Yes: Docker opens every port the app listens on automatically, on all interfaces",
        "Yes, but only after you restart Docker",
        "Only if the browser is Chrome",
      ],
      answer: [0],
      explanation: "The server is running and listening, but only inside the container. Publishing a port with `-p` is what connects it to `localhost` on your computer.",
    },
    {
      id: "d3-01",
      domain: "d3",
      level: "junior",
      lesson: "d3-storage",
      prompt: "Why does a database in a container need a volume?",
      options: [
        "Without one, its data lives in the container's writable layer and is lost when the container is removed",
        "Volumes make queries faster",
        "Databases can't write files without one; the container's filesystem is read-only, so Postgres would fail to start at all",
        "Volumes encrypt the data",
      ],
      answer: [0],
      explanation: "Containers are meant to be replaceable. A volume keeps the data separate, so upgrading means a new container on the same volume.",
    },
    {
      id: "d3-02",
      domain: "d3",
      level: "junior",
      lesson: "d3-storage",
      prompt: "You run `docker rm -f db`, then the same `docker run` command again. What about the data?",
      code: snip("docker volume create pgdata", "docker run -d --name db -e POSTGRES_PASSWORD=example \\", "  -v pgdata:/var/lib/postgresql/data postgres:17"),
      codeLang: "bash",
      options: [
        "It's still there: the named volume `pgdata` outlives the container",
        "It's gone along with the container",
        "It's restored from Docker Hub",
        "Only the table definitions survive; all of the rows are gone",
      ],
      answer: [0],
      explanation: "Removing a container never deletes a named volume. You'd need `docker volume rm pgdata` (or a prune) for that.",
    },
    {
      id: "d3-03",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-storage",
      type: "match",
      prompt: "Match each kind of mount to its best use.",
      pairs: [
        ["Named volume (`-v pgdata:/var/lib/postgresql/data`)", "Database files that Docker manages and keeps across containers"],
        ["Bind mount (`-v \"$(pwd)\":/app`)", "Live-editing source code from the host during development"],
        ["tmpfs (`--tmpfs /tmp`)", "Scratch files kept in memory and never written to disk"],
      ],
      explanation: "Use volumes for data, bind mounts for sharing files from the host, and tmpfs for throwaway or sensitive temporary files.",
    },
    {
      id: "d3-04",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-storage",
      prompt: "Which statement about named volumes and bind mounts is right?",
      options: [
        "A bind mount maps a host path you choose; a named volume is storage Docker creates and manages",
        "They're two names for the same thing",
        "Named volumes only work on Linux",
        "Bind mounts are stored inside the image's layers when you build it; named volumes are stored on the host",
      ],
      answer: [0],
      explanation: "Bind mounts depend on how folders are laid out on that host. Volumes are portable, and you manage them with `docker volume` commands.",
    },
    {
      id: "d3-05",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-storage",
      type: "lines",
      prompt: "After `docker rm db` and a fresh `docker run` of the same command, the database is empty again. Tap the line to fix.",
      code: snip("docker run -d --name db \\", "  -e POSTGRES_PASSWORD=example \\", "  -v /var/lib/postgresql/data \\", "  postgres:17"),
      codeLang: "bash",
      answer: [3],
      explanation: "`-v /path` with no name creates an anonymous volume, and every new container gets a fresh one. Name it: `-v pgdata:/var/lib/postgresql/data`.",
    },
    {
      id: "d3-06",
      domain: "d3",
      level: "senior",
      lesson: "d3-storage",
      prompt: "You mount a brand-new, empty named volume at `/app/config`, where the image already has files. What's inside the container on first start?",
      options: [
        "The image's files: Docker copies existing content into an empty named volume the first time it's mounted",
        "An empty directory",
        "An error: Docker won't mount a named volume over a path that already has files in the image, so the container fails to start",
        "Your host's files",
      ],
      answer: [0],
      explanation: "Docker pre-populates empty named volumes from the image (you can disable it with the `volume-nocopy` option). Bind mounts never do this.",
    },
    {
      id: "d3-07",
      domain: "d3",
      level: "senior",
      lesson: "d3-storage",
      prompt: "Same image, but now you bind-mount an empty host folder at `/app/config`. What's inside the container?",
      options: [
        "An empty directory: a bind mount hides whatever the image had at that path",
        "The image's files, copied out to the host folder the first time it runs",
        "A merge of the image's and the host's files",
        "An error",
      ],
      answer: [0],
      explanation: "The mount sits on top of the image's directory, so its original contents are invisible (but untouched) while mounted.",
    },
    {
      id: "d3-08",
      domain: "d3",
      level: "junior",
      lesson: "d3-ports",
      prompt: "Which URL opens this nginx from your browser?",
      code: snip("docker run -d -p 8080:80 nginx"),
      codeLang: "bash",
      options: ["`http://localhost:8080`", "`http://localhost:80`", "`http://nginx:8080`", "`http://localhost:8080:80`"],
      answer: [0],
      explanation: "Host port 8080 forwards to nginx's port 80 inside the container.",
    },
    {
      id: "d3-09",
      domain: "d3",
      level: "junior",
      lesson: "d3-ports",
      prompt: "In `-p 5433:5432`, which number is the port on your machine?",
      options: ["5433: the format is HOST:CONTAINER", "5432", "Both of them", "Neither: they're container ports"],
      answer: [0],
      explanation: "Postgres still listens on 5432 inside the container; you connect to localhost:5433. Handy when something on the host already uses 5432.",
    },
    {
      id: "d3-10",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-ports",
      type: "lines",
      prompt: "This runs with `docker run -p 3000:3000`, but `curl localhost:3000` from the host fails. Tap the buggy line.",
      code: snip('const express = require("express");', "const app = express();", 'app.get("/", (req, res) => res.send("ok"));', 'app.listen(3000, "127.0.0.1");'),
      codeLang: "js",
      answer: [4],
      explanation: "127.0.0.1 inside the container is the container's own loopback. Forwarded traffic arrives on its network interface, so listen on `0.0.0.0` (or omit the host).",
    },
    {
      id: "d3-11",
      domain: "d3",
      level: "junior",
      lesson: "d3-ports",
      prompt: "Inside a container, what does `localhost` refer to?",
      options: ["The container itself", "Your laptop", "Every container on the same network", "The image registry"],
      answer: [0],
      explanation: "Each container has its own network namespace and loopback. Reach other containers by name and the host via `host.docker.internal` (Docker Desktop).",
    },
    {
      id: "d3-12",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-ports",
      prompt: "Who can reach nginx on port 8080?",
      code: snip("docker run -d -p 127.0.0.1:8080:80 nginx"),
      codeLang: "bash",
      options: ["Only programs on the Docker host itself", "Anyone who can reach the host on the network", "Only other containers", "Nobody"],
      answer: [0],
      explanation: "The host side binds to loopback only. Without the IP prefix, Docker binds the published port on all host interfaces.",
    },
    {
      id: "d3-13",
      domain: "d3",
      level: "senior",
      lesson: "d3-ports",
      prompt: "On a Linux server whose ufw firewall blocks 5432, you run `docker run -d -p 5432:5432 postgres:17`. Is Postgres reachable from outside?",
      options: [
        "It can be: Docker writes its own iptables rules for published ports, which can bypass ufw. Bind to 127.0.0.1 or don't publish it",
        "No, ufw always takes priority",
        "Only if the image has `EXPOSE 5432`; without that line Docker never opens the port, so ufw's default deny rule keeps it closed to outside traffic",
        "Only over IPv6",
      ],
      answer: [0],
      explanation: "Docker's docs call this out: published ports are handled in iptables chains that ufw's rules don't cover. Treat `-p` as \"open to the network\".",
    },
    {
      id: "d3-14",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-networks",
      prompt: "Both containers are on the default bridge network. What's the fix?",
      code: snip("docker run -d --name api my-api", "docker run -d --name web my-web", "docker exec web curl http://api:3000", "# curl: (6) Could not resolve host: api"),
      codeLang: "bash",
      options: [
        "Create a user-defined network (`docker network create appnet`) and run both with `--network appnet`; it has built-in DNS",
        "Publish both containers' ports",
        "Build both from the same image so they share a network namespace, then point the app at `localhost` and the database port it listens on",
        "Restart the Docker daemon",
      ],
      answer: [0],
      explanation: "Name resolution is a feature of user-defined networks. On the default bridge, containers only see each other's IP addresses.",
    },
    {
      id: "d3-15",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-networks",
      prompt: "`api` listens on port 3000. Which URL should `web` use to call it?",
      code: snip("docker network create appnet", "docker run -d --name api --network appnet -p 8080:3000 my-api", "docker run -d --name web --network appnet my-web"),
      codeLang: "bash",
      options: ["`http://api:3000`", "`http://api:8080`", "`http://localhost:8080`", "`http://localhost:3000`"],
      answer: [0],
      explanation: "Container-to-container traffic uses the container port directly. The published 8080 exists only on the host.",
    },
    {
      id: "d3-16",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-networks",
      prompt: "An app in a container must call a dev database running directly on your Mac, outside Docker. With Docker Desktop, which hostname reaches the host?",
      options: ["`host.docker.internal`", "`localhost` on the host's port", "`db`", "`0.0.0.0`"],
      answer: [0],
      explanation: "`localhost` would be the container itself. On Linux, add `--add-host=host.docker.internal:host-gateway` to get the same name.",
    },
    {
      id: "d3-17",
      domain: "d3",
      level: "junior",
      lesson: "d3-compose",
      prompt: "What is Docker Compose for?",
      options: [
        "Defining and running a multi-container app (services, networks, volumes) from one YAML file",
        "Making image builds faster",
        "Writing Dockerfiles for you",
        "Replacing a container registry: it stores your built images locally and serves them to other machines",
      ],
      answer: [0],
      explanation: "Instead of five long `docker run` commands, you describe the stack once and run `docker compose up`.",
    },
    {
      id: "d3-18",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-compose",
      type: "lines",
      prompt: "`web` can't connect to the database. Tap the buggy line.",
      code: snip("services:", "  web:", "    build: .", "    ports:", '      - "8080:3000"', "    environment:", "      DATABASE_HOST: localhost", "  db:", "    image: postgres:17", "    environment:", "      POSTGRES_PASSWORD: example"),
      codeLang: "yaml",
      answer: [7],
      explanation: "In web's container, localhost is web itself. Compose gives each service a DNS name on the project network: use `DATABASE_HOST: db`.",
    },
    {
      id: "d3-19",
      domain: "d3",
      level: "junior",
      lesson: "d3-compose",
      type: "order",
      prompt: "Order a typical Compose workflow.",
      items: [
        "Write `compose.yaml` describing the services",
        "`docker compose up -d` to build and start everything",
        "`docker compose logs -f web` to watch one service",
        "`docker compose down` to stop and remove the containers and network",
      ],
      explanation: "Run them from the folder containing `compose.yaml`; Compose uses the folder name as the project name.",
    },
    {
      id: "d3-20",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-compose",
      prompt: "What's the difference between these two commands?",
      code: snip("docker compose down", "docker compose down -v"),
      codeLang: "bash",
      options: [
        "`down` removes containers and networks but keeps named volumes; `-v` also deletes the volumes, and your database data with them",
        "They're identical",
        "`-v` means verbose output",
        "`down` only stops the containers and keeps them for later; `-v` removes the containers as well, plus every image the project pulled or built",
      ],
      answer: [0],
      explanation: "`down -v` is great for a clean slate in development and terrible to run by habit.",
    },
    {
      id: "d3-21",
      domain: "d3",
      level: "senior",
      lesson: "d3-compose",
      prompt: "`api` sometimes crashes at start-up with \"connection refused\" to `db`. Why, and what's the fix?",
      code: snip("services:", "  api:", "    build: .", "    depends_on:", "      - db", "  db:", "    image: postgres:17"),
      codeLang: "yaml",
      options: [
        "`depends_on` only orders container start, not readiness. Give db a healthcheck, use `condition: service_healthy`, and retry in the app",
        "db must be listed above api in the file; Compose starts services in file order and waits for each one to accept connections before starting the next",
        "Add `links:` to api",
        "Set `restart: no` on db",
      ],
      answer: [0],
      explanation: "Postgres takes a moment to accept connections after its container starts. Apps should retry anyway, because databases restart in production too.",
    },
    {
      id: "d3-22",
      domain: "d3",
      level: "staff",
      lesson: "d3-compose",
      prompt: "Your team uses Compose locally and is moving production to Kubernetes. Which mapping is right?",
      options: [
        "Each service becomes a Deployment plus a Service; named volumes become PersistentVolumeClaims; depends_on becomes readiness probes and retries",
        "Kubernetes runs compose.yaml unchanged: you apply the file with `kubectl apply -f compose.yaml` and each service is scheduled as its own pod automatically",
        "Each service becomes its own cluster",
        "Volumes become ConfigMaps",
      ],
      answer: [0],
      explanation: "The concepts carry over but the objects differ. Tools like Kompose can draft the manifests; health, scaling and storage still need real design.",
    },
    {
      id: "d3-23",
      domain: "d3",
      level: "staff",
      lesson: "d3-networks",
      prompt: "A web app, an API and a database run on one host. Which network design is most sensible?",
      options: [
        "Separate user-defined networks by role (web + api on one, api + db on another) and publish only the web entry point",
        "Publish every service's port on 0.0.0.0",
        "Run everything with host networking",
        "Put the database on the default bridge network and publish 5432 on the host, so every service in the project can reach it",
      ],
      answer: [0],
      explanation: "Segmentation means a compromised web container can't even reach the database directly, and only one port faces the outside world.",
    },
    {
      id: "d3-24",
      domain: "d3",
      level: "staff",
      lesson: "d3-storage",
      prompt: "How should you back up a Postgres database that runs in a container with a named volume?",
      options: [
        "Use the database's own tooling (for example `pg_dump` via `docker exec`, or a managed backup job) and store backups off the host",
        "Commit the running container to an image",
        "`docker export` the container",
        "Copy the volume folder with `cp -r` while the database keeps writing, and keep that copy in the very same volume on the same host",
      ],
      answer: [0],
      explanation: "Copying live data files can capture a torn, inconsistent state. Database-aware backups are consistent, and off-host storage survives losing the machine.",
    },
  ],

  cards: [
    { id: "c3-volume", domain: "d3", kind: "service", term: "docker volume", definition: "Creates, lists and removes Docker-managed volumes, which outlive containers." },
    { id: "c3-network", domain: "d3", kind: "service", term: "docker network", definition: "Creates and manages networks. On user-defined bridge networks, containers find each other by name." },
    { id: "c3-publish", domain: "d3", kind: "service", term: "-p HOST:CONTAINER", definition: "Publishes a container port on the host. An IP prefix such as 127.0.0.1: limits who can reach it." },
    { id: "c3-compose-up", domain: "d3", kind: "service", term: "docker compose up", definition: "Builds images if needed and starts every service in compose.yaml. -d runs them in the background." },
    { id: "c3-compose-down", domain: "d3", kind: "service", term: "docker compose down", definition: "Stops and removes the project's containers and networks. -v also removes its volumes." },
    { id: "c3-host-internal", domain: "d3", kind: "service", term: "host.docker.internal", definition: "A hostname that reaches the Docker host from inside a container. Docker Desktop provides it, and on Linux you add it with --add-host." },
    { id: "c3-depends-on", domain: "d3", kind: "service", term: "depends_on", definition: "Sets Compose start order. With condition: service_healthy, it waits for a passing healthcheck." },
    { id: "c3-named-volume", domain: "d3", kind: "concept", term: "Named volume", definition: "Docker-managed storage you refer to by name. It survives when the container is removed." },
    { id: "c3-bind", domain: "d3", kind: "concept", term: "Bind mount", definition: "A host folder mapped into a container. It hides whatever the image had at that path." },
    { id: "c3-anon", domain: "d3", kind: "concept", term: "Anonymous volume", definition: "A volume with a random name, made by -v /path or VOLUME. Each new container gets a new one." },
    { id: "c3-localhost", domain: "d3", kind: "concept", term: "localhost in a container", definition: "The container's own loopback, not the host. Apps must listen on 0.0.0.0 to be reachable from outside." },
    { id: "c3-dns", domain: "d3", kind: "concept", term: "Container DNS", definition: "On user-defined networks and in Compose, containers find each other by container name or service name." },
  ],

  challenges: [
    {
      id: "ch-docker-publish",
      domain: "d3",
      lesson: "d3-ports",
      title: "Reach it from your browser",
      goal: "Make curl http://localhost:8080 on your laptop return 200 OK.",
      hint: "Two things must be right: the -p mapping direction and the address the app listens on.",
      takeaway: "-p takes the host port first, then the container port. The app must also listen on 0.0.0.0 inside the container for forwarded traffic to reach it.",
      render: (onSolved) => <PortLab goal="publish" onSolved={onSolved} />,
    },
    {
      id: "ch-docker-private",
      domain: "d3",
      lesson: "d3-ports",
      title: "Laptop yes, Wi-Fi no",
      goal: "Make the app reachable from your laptop but NOT from a phone on the same Wi-Fi.",
      hint: "Published ports listen on every host interface by default. You can choose the host IP too.",
      takeaway: "-p 127.0.0.1:8080:3000 publishes on the host's loopback only. That's ideal for local dev databases and admin tools.",
      render: (onSolved) => <PortLab goal="private" onSolved={onSolved} />,
    },
    {
      id: "ch-docker-dns",
      domain: "d3",
      lesson: "d3-networks",
      title: "Call api by name",
      goal: "Make curl http://api:3000 from the web container succeed.",
      hint: "Name resolution needs a user-defined network. Publishing a port doesn't matter for this one.",
      takeaway: "User-defined networks give containers DNS by name, and container-to-container traffic uses the container port directly.",
      render: (onSolved) => <PortLab goal="dns" onSolved={onSolved} />,
    },
  ],
});
