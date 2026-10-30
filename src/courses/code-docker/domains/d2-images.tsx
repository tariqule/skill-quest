import { CodeBlock, CodeCompare, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { LayerCacheLab } from "../labs";
import { snip } from "../snippet";

/** World 2: writing Dockerfiles, layers and the build cache, multi-stage builds, CMD vs ENTRYPOINT. */
export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "Images & Dockerfiles",
    world: "The Layer Lagoon",
    weight: 30,
    emoji: "🧱",
    color: "#a3e635",
    summary: "How to write a Dockerfile, how layers and the build cache work, multi-stage builds for small images, and how CMD and ENTRYPOINT start your app.",
  },

  tasks: [
    {
      id: "2.1",
      title: "Writing a Dockerfile",
      covers: ["FROM, WORKDIR, COPY, RUN, CMD, EXPOSE, ENV, ARG", "The build context", "COPY versus ADD", "Shared base images at scale"],
    },
    {
      id: "2.2",
      title: "Layers and the build cache",
      covers: ["Which instructions create layers", "Cache invalidation", "Ordering for cache hits", ".dockerignore", "Cache mounts and CI caches"],
    },
    {
      id: "2.3",
      title: "Multi-stage builds and image size",
      covers: ["Build stage and runtime stage", "COPY --from", "scratch, distroless, slim and alpine", "Why deleting files in a later layer doesn't shrink an image"],
    },
    {
      id: "2.4",
      title: "Starting the app",
      covers: ["RUN versus CMD", "CMD versus ENTRYPOINT", "Exec form versus shell form", "Signals and PID 1"],
    },
  ],

  lessons: [
    {
      id: "d2-start-image",
      level: "beginner",
      task: "2.1",
      title: "What an image is",
      check: ["dkr-b2-01", "dkr-b2-02"],
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "🌐", title: "nginx", text: "A ready-made web server. `docker run nginx` and you have one.", color: "#38bdf8" },
            { icon: "🐍", title: "python:3.13", text: "Python 3.13, ready to run your scripts. The part after the colon picks the version.", color: "#a3e635" },
            { icon: "🐘", title: "postgres:17", text: "A PostgreSQL database, version 17, with nothing to install by hand.", color: "#f472b6" },
          ]}
        />
      ),
      points: [
        "An **image** is a saved package of files: an operating system's basics, a language or tool, and maybe your app. It also notes which command to run at start-up.",
        "Think of a meal kit. Everything you need is in the box, already measured out. Running the image is cooking the meal.",
        "Thousands of ready-made images live on **Docker Hub**, a free online library of images. Docker downloads from it automatically.",
        "The part after the colon is the **tag**, which picks a version. `python:3.13` is Python 3.13, and `postgres:17` is PostgreSQL 17.",
      ],
      tip: "Before installing a database or language on your computer, check whether there's an official image. Often one `docker run` gets you a working copy in seconds.",
    },
    {
      id: "d2-start-dockerfile",
      level: "beginner",
      task: "2.1",
      title: "A recipe called a Dockerfile",
      check: ["dkr-b2-03", "dkr-b2-04"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="dockerfile"
            caption="A whole Dockerfile for a tiny Python script"
            code={snip(
              "# Start from an image that already has Python",
              "FROM python:3.13-slim",
              "# Put your script inside the image",
              "COPY app.py .",
              "# The command to run when a container starts",
              'CMD ["python", "app.py"]',
            )}
          />
          <CodeBlock lang="bash" code={snip("docker build -t myapp .   # read the Dockerfile here, make an image called myapp", "docker run --rm myapp     # run it")} />
        </div>
      ),
      points: [
        "To package your own app, you write a **Dockerfile**: a plain text file with one instruction per line. Docker reads it from top to bottom.",
        "`FROM` picks the image you start from, so you don't begin from nothing. `COPY` puts your files inside. `CMD` says what to run when a container starts.",
        "`docker build -t myapp .` follows the recipe and saves the result as an image called `myapp`. The dot means \"use the files in this folder\".",
        "Once it's built, you run it like any other image: `docker run myapp`.",
      ],
      tip: "The file is literally named `Dockerfile`, with a capital D and no extension. Keep it in the top folder of your project.",
    },
    {
      id: "d2-dockerfile",
      level: "junior",
      task: "2.1",
      title: "Your first Dockerfile",
      sources: [{ title: "Docker docs: Dockerfile reference", url: "https://docs.docker.com/reference/dockerfile/", license: "Official docs (link only)" }],
      check: ["d2-01", "d2-02"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="dockerfile"
            caption="A small Node.js API (Dockerfile comments go on their own lines)"
            code={snip(
              "# Start from an image that already has Node",
              "FROM node:22-slim",
              "# cd /app (created if missing)",
              "WORKDIR /app",
              "# Copy from the build context, then install at BUILD time",
              "COPY package*.json ./",
              "RUN npm ci",
              "COPY . .",
              "ENV NODE_ENV=production",
              "# Documentation only: doesn't publish the port",
              "EXPOSE 3000",
              "# Default command when a container starts",
              'CMD ["node", "server.js"]',
            )}
          />
          <CodeBlock lang="bash" code={snip("docker build -t shop-api:1.0 .   # '.' = the build context", "docker run -d -p 3000:3000 shop-api:1.0")} />
        </div>
      ),
      points: [
        "A Dockerfile is a recipe. `docker build` runs it top to bottom and produces an image.",
        "The build context (the `.` in `docker build .`) is the folder sent to the builder. `COPY` can only read files from it.",
        "`RUN` happens while the image is being built. `CMD` is what a container runs when it starts.",
        "`ENV` values exist during the build and in every container. `ARG` values exist only during the build.",
        "Prefer `COPY`. `ADD` also downloads URLs and auto-extracts local tar archives, which can surprise you.",
        "`EXPOSE 3000` only documents the port the app listens on. It publishes nothing; you still need `-p` at `docker run`.",
      ],
      tip: "Start from an official image with a specific version tag (`node:22-slim`, `python:3.13-slim`), never a bare name that silently means `latest`.",
    },
    {
      id: "d2-cache",
      level: "intermediate",
      task: "2.2",
      title: "Layers and the build cache",
      check: ["d2-07", "d2-09"],
      visual: <LayerCacheLab />,
      points: [
        "Each `RUN`, `COPY` and `ADD` creates a **layer**, a saved snapshot of the files that step changed. `ENV`, `CMD`, `EXPOSE` and `LABEL` only change the image's settings.",
        "Docker caches each step. A `COPY` step misses the cache when the copied files change. A `RUN` step misses when its command text, or anything before it, changes.",
        "Once one step misses, every step after it rebuilds. So put things that change rarely (dependencies) before things that change often (your code).",
        "A `.dockerignore` file keeps `node_modules`, `.git`, secrets and docs out of the build context. Then they can't bust the cache or leak into the image.",
      ],
      tip: "Copy the dependency manifest, install, then copy the source. That one ordering trick turns a 60-second rebuild into a 2-second one.",
    },
    {
      id: "d2-multistage",
      level: "intermediate",
      task: "2.3",
      title: "Multi-stage builds and small images",
      check: ["d2-14", "d2-15"],
      visual: (
        <div className="grid gap-4">
          <CodeCompare
            lang="dockerfile"
            left={{
              title: "One stage: ships the whole toolchain",
              code: snip("FROM golang:1.25", "WORKDIR /src", "COPY . .", "RUN go build -o /app .", 'ENTRYPOINT ["/app"]', "# compiler, source and caches all ship"),
            }}
            right={{
              title: "Multi-stage: ships one binary",
              code: snip(
                "FROM golang:1.25 AS build",
                "WORKDIR /src",
                "COPY . .",
                "RUN CGO_ENABLED=0 go build -o /out/app .",
                "",
                "FROM gcr.io/distroless/static-debian12",
                "COPY --from=build /out/app /app",
                'ENTRYPOINT ["/app"]',
              ),
            }}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🗑️", title: "scratch", text: "Completely empty. Use it only for static binaries. There's no shell, and no CA certificates unless you copy them in.", color: "#64748b" },
              { icon: "🔒", title: "distroless", text: "Only the runtime libraries, with no shell or package manager. Little to attack, but harder to debug.", color: "#34d399" },
              { icon: "🍃", title: "slim", text: "Debian with most extras removed. A familiar glibc system and a good default.", color: "#38bdf8" },
              { icon: "🏔️", title: "alpine", text: "Tiny, but uses musl libc instead of glibc, which some binaries and wheels don't support.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Each `FROM` starts a new stage. Only the last stage (or the one you pick with `--target`) becomes the image.",
        "`COPY --from=build` brings just the build output into the runtime stage. Compilers and source code stay behind.",
        "Deleting a file in a later layer doesn't shrink the image: the earlier layer still contains it. Don't add it in the first place.",
        "Smaller images pull faster, start faster, and have fewer packages for scanners to flag.",
      ],
      tip: "Name your stages (`AS build`, `AS test`). You can run `docker build --target test .` in CI to stop after the test stage.",
    },
    {
      id: "d2-entrypoint",
      level: "senior",
      task: "2.4",
      title: "CMD, ENTRYPOINT and PID 1",
      check: ["d2-19", "d2-22"],
      visual: (
        <div className="grid gap-4">
          <CodeCompare
            lang="dockerfile"
            tone="neutral"
            left={{ title: "CMD: a default you can replace", code: snip('CMD ["echo", "hi"]', "", "# docker run img          → hi", "# docker run img echo bye → bye") }}
            right={{ title: "ENTRYPOINT + CMD: fixed program, default args", code: snip('ENTRYPOINT ["echo", "hello"]', 'CMD ["world"]', "# docker run img          → hello world", "# docker run img there    → hello there") }}
          />
          <CodeCompare
            lang="dockerfile"
            left={{ title: "Shell form", code: snip("CMD node server.js", "# runs /bin/sh -c 'node server.js'", "# the shell may not pass SIGTERM on") }}
            right={{ title: "Exec form (preferred)", code: snip('CMD ["node", "server.js"]', "# node itself is PID 1", "# and receives docker stop's SIGTERM") }}
          />
        </div>
      ),
      points: [
        "`CMD` is the default command. Any arguments after the image name in `docker run` replace it.",
        "`ENTRYPOINT` is the fixed program. `docker run` arguments are added after it, in place of `CMD`. Only `--entrypoint` replaces the program itself.",
        "Use the exec form (a JSON array). The shell form wraps your command in `/bin/sh -c`, which can stop signals reaching your app.",
        "The process you start is PID 1. It must handle SIGTERM itself, or run behind a tiny init process such as `docker run --init` or tini.",
      ],
      tip: "A common pattern: `ENTRYPOINT` for the binary, `CMD` for default flags. `docker run img --help` then just works.",
    },
  ],

  questions: [
    {
      id: "dkr-b2-01",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-image",
      prompt: "In the image name `python:3.13`, what does `3.13` choose?",
      options: [
        "Which version of the image you get, called the tag",
        "How many containers to start",
        "How much memory the container gets to use at most",
        "The port the app listens on",
      ],
      answer: [0],
      explanation: "The part after the colon is the tag, and it usually names a version. `python:3.13` gives you Python 3.13, while `python:3.12` would give you the older one.",
    },
    {
      id: "dkr-b2-02",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-image",
      prompt: "Where do ready-made images like `nginx` and `postgres` usually come from?",
      options: [
        "A registry such as Docker Hub, which Docker downloads from when you run or pull them",
        "They come pre-installed on every computer",
        "You always have to write them yourself from scratch, with a Dockerfile",
        "The app store on your phone",
      ],
      answer: [0],
      explanation: "A registry is an online library of images, and Docker Hub is the default one. When you ask for an image you don't have yet, Docker fetches it from there for you.",
    },
    {
      id: "dkr-b2-03",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-dockerfile",
      type: "fill",
      prompt: "Fill the gap so the image starts from the official Python image.",
      code: "{{1}} python:3.13-slim\nCOPY app.py .\nCMD [\"python\", \"app.py\"]",
      codeLang: "dockerfile",
      blanks: [{ options: ["FROM", "START", "BASE", "USE"], answer: 0 }],
      explanation: "`FROM` picks the image you build on top of, and it's almost always the first line of a Dockerfile. Here it means your image starts with Python already installed.",
    },
    {
      id: "dkr-b2-04",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-dockerfile",
      type: "output",
      prompt: "You build this Dockerfile with `docker build -t greet .`, then run `docker run --rm greet`. Type what it prints.",
      code: "FROM alpine:3.20\nCMD [\"echo\", \"Hello from my image\"]",
      codeLang: "dockerfile",
      answers: ["Hello from my image"],
      explanation: "`CMD` is the command a container runs when it starts. This one runs `echo`, which prints the text it was given.",
    },
    {
      id: "dkr-b2-05",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-dockerfile",
      prompt: "Which command turns the Dockerfile in your current folder into an image called `myapp`?",
      options: ["`docker build -t myapp .`", "`docker run myapp`", "`docker make myapp .`", "`docker ps myapp`"],
      answer: [0],
      explanation: "`docker build` follows the Dockerfile and saves the result as an image. `-t myapp` names it, and the dot says to use the files in this folder. `docker run` only runs an image that already exists.",
    },
    {
      id: "d2-01",
      domain: "d2",
      level: "junior",
      lesson: "d2-dockerfile",
      prompt: "What is a Dockerfile?",
      options: [
        "A text file of instructions that `docker build` follows to produce an image",
        "The log file of a running container",
        "A file that lists your running containers and the ports they publish",
        "Docker's global settings file",
      ],
      answer: [0],
      explanation: "Each instruction (FROM, COPY, RUN, …) is a build step. The result is an image you can run anywhere.",
    },
    {
      id: "d2-02",
      domain: "d2",
      level: "junior",
      lesson: "d2-dockerfile",
      type: "match",
      prompt: "Match each Dockerfile instruction to what it does.",
      pairs: [
        ["`FROM`", "Choose the base image to start from"],
        ["`RUN`", "Run a command at build time and save the result as a layer"],
        ["`COPY`", "Copy files from the build context into the image"],
        ["`WORKDIR`", "Set the working directory for the instructions after it"],
        ["`CMD`", "Set the default command a container runs"],
      ],
      explanation: "Mixing up RUN and CMD is the classic mistake. RUN shapes the image, and CMD is what happens later, when a container starts.",
    },
    {
      id: "d2-03",
      domain: "d2",
      level: "junior",
      lesson: "d2-dockerfile",
      prompt: "What is the `.` at the end of this command?",
      code: snip("docker build -t shop-api:1.0 ."),
      codeLang: "bash",
      options: [
        "The build context: the folder whose files the Dockerfile can COPY",
        "The image to build from",
        "A shortcut for the `latest` tag",
        "The folder the built image is saved to on your disk after it's done",
      ],
      answer: [0],
      explanation: "The whole context is sent to the builder (minus `.dockerignore` matches). By default the Dockerfile is also read from there.",
    },
    {
      id: "d2-04",
      domain: "d2",
      level: "junior",
      lesson: "d2-dockerfile",
      prompt: "What does `EXPOSE 3000` in a Dockerfile do?",
      options: [
        "Documents that the app listens on port 3000; it doesn't publish anything (you still need `-p`)",
        "Publishes port 3000 on the host",
        "Opens port 3000 in the host firewall and publishes it, so other machines can reach the app on it",
        "Makes the app listen on port 3000",
      ],
      answer: [0],
      explanation: "EXPOSE is only a note in the image's settings. `-p 3000:3000` actually publishes a port, and `-P` publishes every exposed port on random host ports.",
    },
    {
      id: "d2-05",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-dockerfile",
      prompt: "Why do most style guides prefer `COPY` over `ADD`?",
      options: [
        "`ADD` can also download URLs and auto-extract local tar archives, which can be surprising; `COPY` just copies",
        "`COPY` makes containers run faster",
        "`ADD` has been removed from Docker, so a Dockerfile that uses it fails to build on any engine released in the last several years",
        "`COPY` compresses files",
      ],
      answer: [0],
      explanation: "Use ADD only when you actually want its extra behaviour. Plain, explicit steps are easier to review.",
    },
    {
      id: "d2-06",
      domain: "d2",
      level: "senior",
      lesson: "d2-dockerfile",
      prompt: "What does `docker run` on this image print?",
      code: snip("FROM alpine:3.20", "ARG GREETING=hello", "ENV TARGET=world", 'RUN echo "$GREETING $TARGET" > /msg.txt', 'CMD ["sh", "-c", "echo $GREETING $TARGET"]'),
      codeLang: "dockerfile",
      options: ["`world`", "`hello world`", "`$GREETING world`", "Nothing at all"],
      answer: [0],
      explanation: "ARG exists only during the build (so /msg.txt does contain \"hello world\"). At run time GREETING is unset, the shell expands it to nothing, and only ENV's TARGET is left.",
    },
    {
      id: "d2-07",
      domain: "d2",
      level: "junior",
      lesson: "d2-cache",
      prompt: "During a build, one step misses the cache. What happens?",
      options: ["That step and every step after it are rebuilt", "Only that step is rebuilt", "The build fails", "Docker reuses the old layer for that step"],
      answer: [0],
      explanation: "Each layer builds on the one before it, so once a layer changes, every later layer has a different starting point.",
    },
    {
      id: "d2-08",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-cache",
      type: "order",
      prompt: "`FROM` and `WORKDIR` are in place. Order the rest of this Node.js Dockerfile for the best cache use.",
      items: ["`COPY package.json package-lock.json ./`", "`RUN npm ci`", "`COPY . .`", '`CMD ["node", "server.js"]`'],
      explanation: "Now a code change only invalidates `COPY . .`. The slow `npm ci` layer is reused until the dependency files change.",
    },
    {
      id: "d2-09",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-cache",
      type: "lines",
      prompt: "Every one-line code change makes the build reinstall all dependencies. Tap the line that needs to be split up and moved.",
      code: snip("FROM node:22-slim", "WORKDIR /app", "COPY . .", "RUN npm ci", 'CMD ["node", "server.js"]'),
      codeLang: "dockerfile",
      answer: [3],
      explanation: "`COPY . .` includes your source, so any edit busts its cache and everything after it, including `npm ci`. Copy `package*.json` first, install, then copy the rest.",
    },
    {
      id: "d2-10",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-cache",
      type: "lines",
      prompt: "Months later you add `git` to the install line, and the build fails with 404 errors for packages. Tap the root cause.",
      code: snip("FROM debian:bookworm-slim", "RUN apt-get update", "RUN apt-get install -y curl"),
      codeLang: "dockerfile",
      answer: [2],
      explanation: "The `apt-get update` line never changed, so its months-old cached layer (and package index) is reused. Combine them: `RUN apt-get update && apt-get install -y curl git && rm -rf /var/lib/apt/lists/*`.",
    },
    {
      id: "d2-11",
      domain: "d2",
      level: "junior",
      lesson: "d2-cache",
      prompt: "What does this `.dockerignore` file do?",
      code: snip("node_modules", ".git", ".env", "*.md"),
      codeLang: "text",
      options: [
        "Keeps files like `node_modules`, `.git` and `.env` out of the build context, so they aren't sent to the builder or copied by `COPY . .`",
        "Ignores errors in the Dockerfile",
        "Hides containers from `docker ps` and `docker images` output, so the build machine's listings stay short and readable when many projects share it",
        "Lists images to delete",
      ],
      answer: [0],
      explanation: "A smaller context builds faster, and ignored files can neither bust the cache nor leak into the image.",
    },
    {
      id: "d2-12",
      domain: "d2",
      level: "senior",
      lesson: "d2-cache",
      prompt: "Why is this image still as big as if the archive had never been deleted?",
      code: snip("FROM ubuntu:24.04", "COPY dataset.tar.gz /tmp/", "RUN mkdir -p /data && tar -xzf /tmp/dataset.tar.gz -C /data", "RUN rm /tmp/dataset.tar.gz"),
      codeLang: "dockerfile",
      options: [
        "The archive lives in the COPY layer; a later layer can only hide it, not shrink the earlier one",
        "`rm` doesn't work during builds",
        "The build cache counts toward the image size, so you need to run `docker builder prune` after each build",
        "`tar` duplicated the archive",
      ],
      answer: [0],
      explanation: "Layers only ever add on top of each other. Download, extract and delete in a single RUN, use a bind or cache mount, or extract in a build stage and copy only the result.",
    },
    {
      id: "d2-13",
      domain: "d2",
      level: "senior",
      lesson: "d2-cache",
      prompt: "What does a BuildKit cache mount add here?",
      code: snip("RUN --mount=type=cache,target=/root/.npm npm ci"),
      codeLang: "dockerfile",
      options: [
        "A cache directory that persists between builds, so npm can reuse downloaded packages even when this layer rebuilds; it isn't stored in the image",
        "It caches the final image in a registry",
        "It stops this layer from ever rebuilding",
        "It mounts your host's node_modules into the build, so the packages you installed locally are reused and npm never has to download anything in CI",
      ],
      answer: [0],
      explanation: "Layer caching is all or nothing. A cache mount keeps the package manager's own cache warm for the times the layer does rebuild.",
    },
    {
      id: "d2-14",
      domain: "d2",
      level: "junior",
      lesson: "d2-multistage",
      prompt: "What's the main point of a multi-stage build?",
      options: [
        "Build with a full toolchain in one stage, then copy only the output into a small final image",
        "Run several containers at once",
        "Push to several registries",
        "Split one Dockerfile into many files, one per stage, and build each with a separate `docker build`",
      ],
      answer: [0],
      explanation: "Compilers, dev dependencies and source code don't need to ship. Only the last stage becomes the image.",
    },
    {
      id: "d2-15",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-multistage",
      prompt: "What ends up in the final image?",
      code: snip(
        "FROM golang:1.25 AS build",
        "WORKDIR /src",
        "COPY . .",
        "RUN CGO_ENABLED=0 go build -o /out/app .",
        "",
        "FROM gcr.io/distroless/static-debian12",
        "COPY --from=build /out/app /app",
        'ENTRYPOINT ["/app"]',
      ),
      codeLang: "dockerfile",
      options: [
        "The distroless base plus the compiled `/app` binary; the Go toolchain and source stay in the build stage",
        "Everything from both stages",
        "Only the Go source code",
        "The full `golang:1.25` image with the source tree, because the final stage inherits every file from the earlier builder stage by default",
      ],
      answer: [0],
      explanation: "The second FROM starts fresh. `COPY --from=build` is the only bridge, and it copies one file.",
    },
    {
      id: "d2-16",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-multistage",
      type: "lines",
      prompt: "The container crashes with `Error: Cannot find module 'express'`. Tap the line that needs to change.",
      code: snip(
        "FROM node:22 AS build",
        "WORKDIR /app",
        "COPY . .",
        "RUN npm ci && npm run build",
        "",
        "FROM node:22-slim",
        "WORKDIR /app",
        "COPY --from=build /app/dist ./dist",
        'CMD ["node", "dist/server.js"]',
      ),
      codeLang: "dockerfile",
      answer: [8],
      explanation: "Only `dist` crossed into the final stage, not `node_modules`. Copy production dependencies too (or run `npm ci --omit=dev` in the final stage).",
    },
    {
      id: "d2-17",
      domain: "d2",
      level: "senior",
      lesson: "d2-multistage",
      prompt: "Your final stage is `FROM scratch` with a static Go binary. `docker exec -it app sh` fails. Why?",
      options: [
        "`scratch` is empty: there's no shell, or any other program, in the image",
        "`exec` is disabled for Go programs",
        "The container must be paused first, then `exec` works on any image you give it",
        "`scratch` images forbid root",
      ],
      answer: [0],
      explanation: "That's the point of scratch and distroless: nothing to exploit, but nothing to debug with either. Use a debug variant or an ephemeral debug container when needed.",
    },
    {
      id: "d2-18",
      domain: "d2",
      level: "senior",
      lesson: "d2-multistage",
      prompt: "A binary built on Debian fails on an `alpine` base with `exec /app: no such file or directory`, though `/app` clearly exists. What's the likely cause?",
      options: [
        "Alpine uses musl libc, so a binary dynamically linked against glibc can't find its loader and libraries",
        "Alpine can't run compiled binaries",
        "The file was copied without execute permission from macOS, so Linux refuses to run it.",
        "Alpine requires ENTRYPOINT instead of CMD",
      ],
      answer: [0],
      explanation: "The \"missing file\" is the glibc dynamic loader. Build on the same libc, build a static binary, or use a glibc-based slim or distroless image.",
    },
    {
      id: "d2-19",
      domain: "d2",
      level: "junior",
      lesson: "d2-entrypoint",
      prompt: "What does `docker run img echo bye` print?",
      code: snip("FROM alpine:3.20", 'CMD ["echo", "hi"]'),
      codeLang: "dockerfile",
      options: ["`bye`", "`hi`", "`hi bye`", "`echo bye`"],
      answer: [0],
      explanation: "Arguments after the image name replace CMD entirely, so the container runs `echo bye`.",
    },
    {
      id: "d2-20",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-entrypoint",
      prompt: "What do `docker run img` and then `docker run img there` print?",
      code: snip("FROM alpine:3.20", 'ENTRYPOINT ["echo", "hello"]', 'CMD ["world"]'),
      codeLang: "dockerfile",
      options: ["`hello world`, then `hello there`", "`world`, then `there`", "`hello world`, then `there`", "`hello`, and then `hello there`"],
      answer: [0],
      explanation: "CMD supplies default arguments to ENTRYPOINT. Run-time arguments replace CMD but are still appended to ENTRYPOINT.",
    },
    {
      id: "d2-21",
      domain: "d2",
      level: "senior",
      lesson: "d2-entrypoint",
      prompt: "Docker's docs recommend the exec form `CMD [\"node\", \"server.js\"]` over this shell form. Why?",
      code: snip("CMD node server.js"),
      codeLang: "dockerfile",
      options: [
        "The shell form runs `/bin/sh -c`, so a shell can end up as PID 1 and your app may never receive `docker stop`'s SIGTERM",
        "The shell form builds more slowly",
        "The shell form can't read environment variables, so `$PORT` is passed to your app literally and it fails to bind on start-up",
        "The exec form always runs as root",
      ],
      answer: [0],
      explanation: "Without SIGTERM the app can't shut down gracefully and gets SIGKILLed after the timeout. The shell form is fine for RUN, where you often want shell features.",
    },
    {
      id: "d2-22",
      domain: "d2",
      level: "junior",
      lesson: "d2-entrypoint",
      prompt: "What's the difference between `RUN` and `CMD`?",
      options: [
        "`RUN` executes while the image is built; `CMD` sets the default command for containers started from it",
        "They're the same",
        "`CMD` runs at build time to set up the image, and `RUN` runs each time a container starts up from the image",
        "`RUN` only works as root",
      ],
      answer: [0],
      explanation: "`RUN npm ci` installs packages into the image once. `CMD [\"node\", \"server.js\"]` starts the server every time a container starts.",
    },
    {
      id: "d2-23",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-entrypoint",
      type: "lines",
      prompt: "`docker build` never finishes: it hangs on the last step, serving HTTP. Tap the line that's wrong.",
      code: snip("FROM python:3.13-slim", "WORKDIR /app", "COPY . .", "RUN pip install --no-cache-dir -r requirements.txt", "RUN python app.py"),
      codeLang: "dockerfile",
      answer: [5],
      explanation: "RUN executes during the build, so the server starts inside the builder and never exits. Starting the app belongs in `CMD [\"python\", \"app.py\"]`.",
    },
    {
      id: "d2-24",
      domain: "d2",
      level: "staff",
      lesson: "d2-dockerfile",
      prompt: "Your organization has 200 services with 200 hand-rolled Dockerfiles, and base-image security patches take weeks to roll out. What's the most effective fix?",
      options: [
        "Publish a small set of maintained base images that services build FROM, rebuild them regularly, and automate the update PRs for every service",
        "Let each team keep choosing any base image",
        "Stop patching base images and rely on the firewall and network policies, since a CVE in an unused package can't be reached if the ports are closed",
        "Combine all 200 services into one image",
      ],
      answer: [0],
      explanation: "Golden base images turn one patch into one rebuild plus automated bumps, instead of 200 manual edits. Tools like Renovate or Dependabot can open the PRs.",
    },
    {
      id: "d2-25",
      domain: "d2",
      level: "staff",
      lesson: "d2-cache",
      prompt: "CI image builds are slow because every job starts with an empty build cache. What's the standard fix?",
      options: [
        "Export and import the build cache, for example `docker buildx build --cache-to` and `--cache-from` with a registry or CI cache backend",
        "Add `--no-cache` to every build so each CI run starts clean, and run the builds on bigger machines so the full rebuild from scratch finishes sooner",
        "Give the CI machine more RAM",
        "Build without a Dockerfile",
      ],
      answer: [0],
      explanation: "Short-lived CI runners lose their local cache between jobs. A remote cache lets each build reuse layers from the last one, just as your laptop does.",
    },
    {
      id: "d2-26",
      domain: "d2",
      level: "staff",
      lesson: "d2-multistage",
      prompt: "A team ships a 2 GB image containing compilers, test fixtures and the `.git` folder. Deploys are slow and scanners flag hundreds of CVEs. What's the most effective change?",
      options: [
        "A multi-stage build onto a minimal runtime base, plus a `.dockerignore`, so only the app and its runtime dependencies ship",
        "gzip the image before pushing",
        "Add more memory to the servers",
        "Give the image a different tag, squash it with `docker export`, then push it again so the registry stores it as a single compressed layer",
      ],
      answer: [0],
      explanation: "Size and vulnerability count both come from what's in the image. Removing build-only content attacks both at once.",
    },
  ],

  cards: [
    { id: "c2-build", domain: "d2", kind: "service", term: "docker build", definition: "Builds an image from a Dockerfile and a build context. -t gives it a name and tag." },
    { id: "c2-from", domain: "d2", kind: "service", term: "FROM", definition: "Starts a build stage from a base image. Each FROM starts a new stage." },
    { id: "c2-run", domain: "d2", kind: "service", term: "RUN", definition: "Runs a command while the image is built and saves the result as a layer." },
    { id: "c2-copy", domain: "d2", kind: "service", term: "COPY", definition: "Copies files into the image from the build context, or from another stage with --from." },
    { id: "c2-cmd", domain: "d2", kind: "service", term: "CMD", definition: "The default command for containers, or the default arguments for ENTRYPOINT. Arguments to docker run replace it." },
    { id: "c2-entrypoint", domain: "d2", kind: "service", term: "ENTRYPOINT", definition: "The fixed program a container runs. Arguments to docker run are added after it." },
    { id: "c2-arg-env", domain: "d2", kind: "service", term: "ARG and ENV", definition: "ARG values exist only during the build. ENV values are set during the build and in every container." },
    { id: "c2-dockerignore", domain: "d2", kind: "service", term: ".dockerignore", definition: "A list of patterns left out of the build context, such as node_modules, .git and .env." },
    { id: "c2-distroless", domain: "d2", kind: "service", term: "distroless", definition: "Base images that hold only runtime libraries, with no shell or package manager." },
    { id: "c2-layer", domain: "d2", kind: "concept", term: "Layer", definition: "A read-only set of file changes made by RUN, COPY or ADD. An image is a stack of layers." },
    { id: "c2-cache", domain: "d2", kind: "concept", term: "Build cache", definition: "Reuses a step's layer when its inputs haven't changed. One miss rebuilds every step after it." },
    { id: "c2-multistage", domain: "d2", kind: "concept", term: "Multi-stage build", definition: "Several FROM stages in one Dockerfile. Only the final stage's contents ship." },
    { id: "c2-exec-form", domain: "d2", kind: "concept", term: "Exec form", definition: "CMD or ENTRYPOINT written as a JSON array. The program runs directly as PID 1, so it receives signals." },
  ],

  challenges: [
    {
      id: "ch-docker-fast",
      domain: "d2",
      lesson: "d2-cache",
      title: "Two-second rebuilds",
      goal: "Edit the app's source and rebuild with RUN npm ci coming from the cache.",
      hint: "With COPY . . first, any source change breaks the cache before npm ci. Try the other Dockerfile (build it once first).",
      takeaway: "Copy dependency manifests and install before copying source, so everyday code edits skip the slow install step.",
      render: (onSolved) => <LayerCacheLab goal="fast" onSolved={onSolved} />,
    },
    {
      id: "ch-docker-ignore",
      domain: "d2",
      lesson: "d2-cache",
      title: "Docs shouldn't cost a build",
      goal: "Edit README.md and rebuild with every step cached.",
      hint: "COPY . . copies the README too. Keep it out of the build context.",
      takeaway: ".dockerignore removes files from the build context, so changes to them can't invalidate COPY . . (or leak into the image).",
      render: (onSolved) => <LayerCacheLab goal="ignore" onSolved={onSolved} />,
    },
  ],
});
