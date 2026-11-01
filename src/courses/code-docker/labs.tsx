"use client";

import { useState } from "react";
import { LabHeader, type GoalProps } from "@/components/learn/blocks";
import { BlockIcon } from "@/components/learn/block-icons";

/** Hands-on playgrounds for Learn Docker & Containers. */

const btn = "rounded-lg px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40";

function Toggle({ on, label, onChange }: { on: boolean; label: string; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      className={`rounded-lg px-2.5 py-1 text-xs font-bold ${on ? "bg-emerald-400 text-slate-950" : "bg-white/10 text-slate-300"}`}
      aria-pressed={on}
    >
      {on ? <BlockIcon icon="☑" className="inline-block size-[1.1em] align-[-0.15em]" /> : <BlockIcon icon="☐" className="inline-block size-[1.1em] align-[-0.15em]" />} {label}
    </button>
  );
}

function Choice<T extends string>({ value, options, onChange }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => onChange(o.id)}
          className={`rounded-lg px-2.5 py-1 font-mono text-xs font-bold ${value === o.id ? "bg-sky-400 text-slate-950" : "bg-white/10 text-white"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

// ───────────── Container lifecycle ─────────────

type CState = "none" | "created" | "running" | "paused" | "exited";

interface Box {
  state: CState;
  exit: number | null;
  autoRemove: boolean;
  files: string[];
  restarts: number;
}

const NO_BOX: Box = { state: "none", exit: null, autoRemove: false, files: [], restarts: 0 };

export function LifecycleLab({ goal, onSolved }: GoalProps<"survive" | "autoremove">) {
  const [box, setBox] = useState<Box>(NO_BOX);
  const [rm, setRm] = useState(false);
  const [graceful, setGraceful] = useState(true);
  const [out, setOut] = useState<string[]>(["No container yet. Create or run one from the image my-api:1.0."]);
  const [stoppedWithFile, setStoppedWithFile] = useState(false);

  const say = (cmd: string, lines: string[]) => setOut([`$ ${cmd}`, ...lines]);
  const exists = box.state !== "none";

  /** Container stopped: remove it if it was started with --rm. */
  function stopped(code: number, cmd: string, lines: string[]) {
    if (box.autoRemove) {
      setBox(NO_BOX);
      say(cmd, [...lines, `(exit code ${code}. It was started with --rm, so Docker removed it, writable layer and all)`]);
      if (goal === "autoremove") onSolved?.();
      return;
    }
    setBox({ ...box, state: "exited", exit: code });
    say(cmd, [...lines, `(exit code ${code}. The container still exists: docker ps -a shows it, and its files are kept)`]);
    if (box.files.length > 0) setStoppedWithFile(true);
  }

  function create(start: boolean) {
    const cmd = `docker ${start ? "run -d" : "create"}${start && rm ? " --rm" : ""} --name api my-api:1.0`;
    if (exists) {
      say(cmd, ['docker: Error response from daemon: Conflict. The container name "/api" is already in use.', "(remove the old container first, or pick another --name)"]);
      return;
    }
    setBox({ ...NO_BOX, state: start ? "running" : "created", autoRemove: start && rm });
    setStoppedWithFile(false);
    say(cmd, [start ? "3f1d9a0c2b7e… (container ID: it's running in the background)" : "3f1d9a0c2b7e… (created, but nothing is running yet)"]);
  }

  function start() {
    if (box.state === "running") return say("docker start api", ["api", "(already running: nothing to do)"]);
    if (box.state === "paused") return say("docker start api", ["Error response from daemon: cannot start a paused container, try unpause instead"]);
    setBox({ ...box, state: "running", restarts: box.state === "exited" ? box.restarts + 1 : box.restarts });
    say("docker start api", ["api", box.files.length ? `(same container, same writable layer: ${box.files.join(", ")} still there)` : "(the main process starts)"]);
    if (goal === "survive" && stoppedWithFile && box.files.length > 0) onSolved?.();
  }

  function stop() {
    if (box.state === "paused") return say("docker stop api", ["(in this lab, unpause it first: docker unpause api)"]);
    if (box.state !== "running") return say("docker stop api", ["api", "(not running: nothing to stop)"]);
    if (graceful) stopped(0, "docker stop api", ["(sent SIGTERM; the app shut down cleanly)", "api"]);
    else stopped(137, "docker stop api", ["(sent SIGTERM… the app ignored it… waited 10 s… sent SIGKILL)", "api"]);
  }

  function kill() {
    if (box.state === "paused") return say("docker kill api", ["(in this lab, unpause it first: docker unpause api)"]);
    if (box.state !== "running") return say("docker kill api", ["Error: container api is not running"]);
    stopped(137, "docker kill api", ["(sent SIGKILL immediately: no chance to clean up)", "api"]);
  }

  function pause() {
    if (box.state === "running") {
      setBox({ ...box, state: "paused" });
      say("docker pause api", ["api", "(processes frozen in place; memory kept)"]);
    } else if (box.state === "paused") {
      setBox({ ...box, state: "running" });
      say("docker unpause api", ["api"]);
    }
  }

  function write() {
    if (box.state !== "running") return say("docker exec api touch /tmp/report.csv", ["Error: container api is not running (exec needs a running container)"]);
    const name = box.files.includes("/tmp/report.csv") ? "/tmp/notes.txt" : "/tmp/report.csv";
    if (box.files.includes(name)) return say(`docker exec api touch ${name}`, ["(file already exists)"]);
    setBox({ ...box, files: [...box.files, name] });
    say(`docker exec api touch ${name}`, [`(created ${name} in the container's writable layer)`]);
  }

  function remove(force: boolean) {
    const cmd = force ? "docker rm -f api" : "docker rm api";
    if (!exists) return say(cmd, ["Error: No such container: api"]);
    if (!force && (box.state === "running" || box.state === "paused")) {
      return say(cmd, ["Error response from daemon: cannot remove a running container. Stop it first, or use docker rm -f."]);
    }
    const lost = box.files.length;
    setBox(NO_BOX);
    setStoppedWithFile(false);
    say(cmd, ["api", lost ? `(container deleted, and its writable layer with it: ${lost} file${lost > 1 ? "s" : ""} gone. Use a volume for data you need to keep)` : "(container deleted)"]);
  }

  const statusText =
    box.state === "running" ? "Up 12 seconds" : box.state === "paused" ? "Up 40 seconds (Paused)" : box.state === "created" ? "Created" : box.state === "exited" ? `Exited (${box.exit}) 3 seconds ago` : "";
  const states: { id: CState; label: string; color: string }[] = [
    { id: "created", label: "Created", color: "#94a3b8" },
    { id: "running", label: "Running", color: "#34d399" },
    { id: "paused", label: "Paused", color: "#38bdf8" },
    { id: "exited", label: "Exited", color: "#f59e0b" },
  ];

  return (
    <div>
      <LabHeader title="Container lifecycle" hint="A container is one run of an image, with its own writable layer. Create, start, stop, kill and remove it, and watch docker ps." />
      <div className="mb-3 flex flex-wrap gap-2">
        {states.map((s) => (
          <span
            key={s.id}
            className="rounded-full border px-3 py-1 text-xs font-bold transition"
            style={{ borderColor: box.state === s.id ? s.color : "rgb(255 255 255 / 0.1)", background: box.state === s.id ? `${s.color}33` : undefined, color: box.state === s.id ? s.color : "#64748b" }}
          >
            {s.label}
          </span>
        ))}
        <span className={`rounded-full border px-3 py-1 text-xs font-bold ${box.state === "none" ? "border-rose-400 bg-rose-400/20 text-rose-200" : "border-white/10 text-muted-foreground"}`}>No container</span>
      </div>

      <div className="mb-2 flex flex-wrap gap-2">
        <Toggle on={rm} label="--rm on docker run" onChange={setRm} />
        <Toggle on={graceful} label="app handles SIGTERM" onChange={setGraceful} />
      </div>

      <div className="grid gap-2">
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={() => create(true)} className={`${btn} bg-primary font-mono text-primary-foreground`}>
            docker run -d
          </button>
          <button type="button" onClick={() => create(false)} className={`${btn} bg-slate-700 font-mono text-white`}>
            docker create
          </button>
          <button type="button" onClick={start} disabled={!exists} className={`${btn} bg-primary font-mono text-primary-foreground`}>
            docker start
          </button>
          <button type="button" onClick={stop} disabled={!exists} className={`${btn} bg-reward font-mono text-primary-foreground`}>
            docker stop
          </button>
          <button type="button" onClick={kill} disabled={!exists} className={`${btn} bg-rose-500 font-mono text-white`}>
            docker kill
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" onClick={pause} disabled={box.state !== "running" && box.state !== "paused"} className={`${btn} bg-slate-700 font-mono text-white`}>
            {box.state === "paused" ? "docker unpause" : "docker pause"}
          </button>
          <button type="button" onClick={write} disabled={!exists} className={`${btn} bg-violet-500 font-mono text-white`}>
            docker exec … touch
          </button>
          <button type="button" onClick={() => remove(false)} className={`${btn} bg-slate-700 font-mono text-white`}>
            docker rm
          </button>
          <button type="button" onClick={() => remove(true)} className={`${btn} bg-slate-800 font-mono text-rose-200`}>
            docker rm -f
          </button>
        </div>
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-2">
        <div className="min-h-24 rounded-xl border border-white/10 bg-slate-950 p-3 font-mono text-xs">
          {out.map((l, i) => (
            <div key={i} className={`whitespace-pre-wrap ${l.startsWith("$") || l.startsWith("(") ? "text-slate-400" : l.includes("Error") ? "text-rose-300" : "text-emerald-300"}`}>
              {l}
            </div>
          ))}
        </div>
        <div className="grid content-start gap-2">
          {(["ps", "ps -a"] as const).map((v) => {
            const show = exists && (v === "ps -a" || box.state === "running" || box.state === "paused");
            return (
              <div key={v} className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950 p-2 font-mono text-[11px]">
                <div className="text-slate-400">$ docker {v}</div>
                <div className="whitespace-pre text-muted-foreground">NAMES  IMAGE        STATUS</div>
                {show ? <div className="whitespace-pre text-slate-100">{`api    my-api:1.0   ${statusText}`}</div> : <div className="text-muted-foreground">(empty)</div>}
              </div>
            );
          })}
          <div className="rounded-xl border border-white/10 bg-slate-950 p-2 text-xs text-slate-300">
            <span className="font-bold text-white">Writable layer:</span> {exists ? (box.files.length ? box.files.join(", ") : "(no files written yet)") : "(no container, no layer)"}
          </div>
        </div>
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Exit code 137 = 128 + 9 (SIGKILL). docker stop sends SIGTERM, waits (10 s by default), then SIGKILL. Stopping keeps the container and its
        files; only removing it deletes them.
      </p>
    </div>
  );
}

// ───────────── Layer cache ─────────────

type Order = "naive" | "smart";
type Change = "src" | "deps" | "readme" | "base";

interface Step {
  text: string;
  inputs: Change[];
  seconds: number;
}

const BASE_TAG: Record<number, string> = { 0: "node:22-slim", 1: "node:24-slim" };

function steps(order: Order, base: string, ignoreMd: boolean): Step[] {
  const all: Change[] = ignoreMd ? ["src", "deps"] : ["src", "deps", "readme"];
  const head: Step[] = [
    { text: `FROM ${base}`, inputs: ["base"], seconds: 4 },
    { text: "WORKDIR /app", inputs: [], seconds: 0.1 },
  ];
  const tail: Step[] = [
    { text: "RUN npm run build", inputs: [], seconds: 12 },
    { text: 'CMD ["node", "dist/server.js"]', inputs: [], seconds: 0 },
  ];
  return order === "smart"
    ? [...head, { text: "COPY package.json package-lock.json ./", inputs: ["deps"], seconds: 0.2 }, { text: "RUN npm ci", inputs: [], seconds: 45 }, { text: "COPY . .", inputs: all, seconds: 0.6 }, ...tail]
    : [...head, { text: "COPY . .", inputs: all, seconds: 0.6 }, { text: "RUN npm ci", inputs: [], seconds: 45 }, ...tail];
}

interface BuildRow {
  text: string;
  cached: boolean;
  seconds: number;
}

const EDITS: { id: Change; label: string; note: string }[] = [
  { id: "src", label: "Edit src/server.ts", note: "You changed application code." },
  { id: "deps", label: "Add a dependency", note: "package.json and package-lock.json changed." },
  { id: "readme", label: "Edit README.md", note: "Docs only. Should that really cost a rebuild?" },
  { id: "base", label: "Bump base image", note: "The FROM line now names a different image." },
];

export function LayerCacheLab({ goal, onSolved }: GoalProps<"fast" | "ignore">) {
  const [order, setOrder] = useState<Order>("naive");
  const [ignoreMd, setIgnoreMd] = useState(false);
  const [baseIdx, setBaseIdx] = useState(0);
  const [dirty, setDirty] = useState<Record<Order, Change[]>>({ naive: [], smart: [] });
  const [built, setBuilt] = useState<Record<Order, boolean>>({ naive: false, smart: false });
  const [rows, setRows] = useState<BuildRow[] | null>(null);
  const [note, setNote] = useState("The cache is empty. Run a first build, then change something and rebuild.");

  const list = steps(order, BASE_TAG[baseIdx], ignoreMd);

  function edit(c: Change) {
    if (c === "base") setBaseIdx((i) => (i + 1) % 2);
    setDirty((d) => ({ naive: d.naive.includes(c) ? d.naive : [...d.naive, c], smart: d.smart.includes(c) ? d.smart : [...d.smart, c] }));
    setNote(EDITS.find((e) => e.id === c)!.note);
  }

  function build() {
    const changes = dirty[order];
    const first = !built[order];
    let broken = first;
    const result: BuildRow[] = list.map((s) => {
      if (!broken && s.inputs.some((i) => changes.includes(i))) broken = true;
      return { text: s.text, cached: !broken, seconds: s.seconds };
    });
    setRows(result);
    setBuilt({ ...built, [order]: true });
    setDirty({ ...dirty, [order]: [] });
    const firstMiss = result.findIndex((r) => !r.cached);
    setNote(
      first
        ? "First build: nothing in the cache yet, so every step ran. Now edit something and build again."
        : firstMiss === -1
          ? "Every step came from the cache. Nothing that any instruction depends on changed."
          : `The cache broke at step ${firstMiss + 1} (${result[firstMiss].text}), so it and every step after it ran again.`,
    );
    if (first) return;
    const npm = result.find((r) => r.text === "RUN npm ci")!;
    if (goal === "fast" && changes.includes("src") && !changes.includes("deps") && !changes.includes("base") && npm.cached) onSolved?.();
    if (goal === "ignore" && changes.includes("readme") && firstMiss === -1) onSolved?.();
  }

  const total = rows ? rows.reduce((s, r) => s + (r.cached ? 0 : r.seconds), 0) : 0;
  const pending = dirty[order];

  return (
    <div>
      <LabHeader
        title="Layer cache"
        hint="Each instruction is a cached step. When a step's inputs change, that step and everything after it rebuild. Reorder the Dockerfile and see what each edit costs."
      />
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <Choice
          value={order}
          onChange={(o) => {
            setOrder(o);
            setRows(null);
            setNote(built[o] ? "Switched Dockerfile. Its cache is separate: build to see what changed since its last build." : "Switched Dockerfile. It hasn't been built yet.");
          }}
          options={[
            { id: "naive", label: "COPY . . first" },
            { id: "smart", label: "dependencies first" },
          ]}
        />
        <Toggle on={ignoreMd} label=".dockerignore has *.md" onChange={setIgnoreMd} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-slate-950 font-mono text-[12.5px]">
          <div className="border-b border-white/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Dockerfile</div>
          {list.map((s, i) => {
            const row = rows?.[i];
            return (
              <div key={s.text} className={`flex items-center gap-3 px-3 py-0.5 ${row ? (row.cached ? "bg-emerald-400/10" : "bg-amber-400/15") : ""}`}>
                <span className="w-4 text-right text-muted-foreground">{i + 1}</span>
                <span className="flex-1 whitespace-pre text-slate-100">{s.text}</span>
                {row && <span className={`text-[11px] font-bold ${row.cached ? "text-emerald-300" : "text-amber-300"}`}>{row.cached ? "CACHED" : `⟳ ${row.seconds}s`}</span>}
              </div>
            );
          })}
          <div className="border-t border-white/10 px-3 py-1.5 text-xs text-slate-400">
            {rows ? (
              <>
                build time ≈ <span className="text-white">{total.toFixed(1)}s</span>
              </>
            ) : (
              "not built yet with these changes"
            )}
          </div>
        </div>

        <div className="grid content-start gap-2">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Change something</div>
          <div className="flex flex-wrap gap-1.5">
            {EDITS.map((e) => (
              <button key={e.id} type="button" onClick={() => edit(e.id)} className={`${btn} bg-slate-700 px-2 py-1 text-xs text-white`}>
                {e.label}
              </button>
            ))}
          </div>
          <div className="text-xs text-slate-400">
            Changed since this Dockerfile&apos;s last build: <span className="text-amber-300">{pending.length ? pending.join(", ") : "nothing"}</span>
          </div>
          <button type="button" onClick={build} className={`${btn} bg-primary font-mono text-primary-foreground`}>
            ▶ docker build -t api .
          </button>
          <p className="rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm text-slate-300">{note}</p>
          <p className="text-xs text-muted-foreground">
            Timings are illustrative. COPY steps are keyed on the content of the files they copy; RUN steps on the command text and everything before
            them.
          </p>
        </div>
      </div>
    </div>
  );
}

// ───────────── Ports and networks ─────────────

type Listen = "all" | "loopback";
type Publish = "none" | "8080:3000" | "3000:8080" | "127.0.0.1:8080:3000";
type Net = "bridge" | "appnet";

interface Probe {
  ok: boolean;
  text: string;
}

function probeHost(listen: Listen, pub: Publish): Probe {
  if (pub === "none") return { ok: false, text: "curl: (7) Failed to connect to localhost port 8080: Connection refused. Nothing on the host listens on 8080: no port is published." };
  if (pub === "3000:8080") return { ok: false, text: "Connection refused. -p is HOST:CONTAINER, so this publishes host port 3000 to container port 8080 (where nothing listens)." };
  if (listen === "loopback") return { ok: false, text: "Connection reset / empty reply. Docker forwarded the request to the container's network interface, but the app only listens on the container's own 127.0.0.1." };
  return { ok: true, text: "HTTP/1.1 200 OK  {\"status\":\"ok\"}" };
}

function probeLan(listen: Listen, pub: Publish): Probe {
  if (pub === "127.0.0.1:8080:3000") return { ok: false, text: "Connection refused. The port is published on the host's loopback address only, so other machines can't reach it." };
  const p = probeHost(listen, pub);
  return p.ok ? { ok: true, text: "HTTP/1.1 200 OK. Published ports listen on all host interfaces by default, so your whole network can reach this." } : p;
}

function probePeer(listen: Listen, net: Net): Probe {
  if (net === "bridge") return { ok: false, text: "curl: (6) Could not resolve host: api. The default bridge network has no DNS for container names." };
  if (listen === "loopback") return { ok: false, text: "Connection refused. web reached api's IP, but the app only listens on 127.0.0.1 inside its own container." };
  return { ok: true, text: "HTTP/1.1 200 OK. Containers on the same user-defined network talk directly on the container port; publishing isn't needed." };
}

export function PortLab({ goal, onSolved }: GoalProps<"publish" | "dns" | "private">) {
  const [listen, setListen] = useState<Listen>("loopback");
  const [pub, setPub] = useState<Publish>("none");
  const [net, setNet] = useState<Net>("bridge");
  const [results, setResults] = useState<Record<string, Probe | undefined>>({});

  function run(id: "host" | "lan" | "peer") {
    const p = id === "host" ? probeHost(listen, pub) : id === "lan" ? probeLan(listen, pub) : probePeer(listen, net);
    setResults((r) => ({ ...r, [id]: p }));
    if (goal === "publish" && id === "host" && p.ok) onSolved?.();
    if (goal === "dns" && id === "peer" && p.ok) onSolved?.();
    if (goal === "private" && id === "lan" && !p.ok && probeHost(listen, pub).ok) onSolved?.();
  }

  function change(fn: () => void) {
    fn();
    setResults({});
  }

  const runCmd = `docker run -d --name api${net === "appnet" ? " --network appnet" : ""}${pub === "none" ? "" : ` -p ${pub}`} my-api`;
  const tests: { id: "host" | "lan" | "peer"; who: string; cmd: string }[] = [
    { id: "host", who: "Your laptop", cmd: "curl http://localhost:8080" },
    { id: "lan", who: "A phone on your Wi-Fi", cmd: "curl http://192.168.1.20:8080" },
    { id: "peer", who: `Container "web"${net === "appnet" ? " (on appnet)" : ""}`, cmd: "curl http://api:3000" },
  ];

  return (
    <div>
      <LabHeader title="Ports and networks" hint="The api app listens on port 3000 inside its container. Choose how it listens, what you publish, and which network it joins, then test from three places." />
      <div className="grid gap-3 md:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
          <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">App listens on</div>
          <Choice
            value={listen}
            onChange={(v) => change(() => setListen(v))}
            options={[
              { id: "loopback", label: "127.0.0.1:3000" },
              { id: "all", label: "0.0.0.0:3000" },
            ]}
          />
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
          <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">Publish (-p)</div>
          <Choice
            value={pub}
            onChange={(v) => change(() => setPub(v))}
            options={[
              { id: "none", label: "none" },
              { id: "8080:3000", label: "8080:3000" },
              { id: "3000:8080", label: "3000:8080" },
              { id: "127.0.0.1:8080:3000", label: "127.0.0.1:8080:3000" },
            ]}
          />
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
          <div className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-400">Network</div>
          <Choice
            value={net}
            onChange={(v) => change(() => setNet(v))}
            options={[
              { id: "bridge", label: "default bridge" },
              { id: "appnet", label: "appnet (user-defined)" },
            ]}
          />
        </div>
      </div>

      <div className="mt-3 rounded-xl border border-white/10 bg-slate-950 p-3 font-mono text-xs text-sky-200">$ {runCmd}</div>

      <div className="mt-3 grid gap-2">
        {tests.map((t) => {
          const r = results[t.id];
          return (
            <div key={t.id} className="grid gap-2 rounded-xl border border-white/10 bg-slate-950/60 p-2 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)] sm:items-center">
              <button type="button" onClick={() => run(t.id)} className={`${btn} bg-violet-500 text-left text-white`}>
                <div className="text-xs">{t.who}</div>
                <div className="font-mono text-[11px] font-normal">{t.cmd}</div>
              </button>
              <div className={`font-mono text-xs ${r ? (r.ok ? "text-emerald-300" : "text-rose-300") : "text-muted-foreground"}`}>{r ? `${r.ok ? <BlockIcon icon="✓" className="inline-block size-[1.1em] align-[-0.15em]" /> : <BlockIcon icon="✗" className="inline-block size-[1.1em] align-[-0.15em]" />} ${r.text}` : "(not tested yet)"}</div>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-slate-400">
        Inside a container, 127.0.0.1 means that container only. Listen on 0.0.0.0 so traffic arriving on the container&apos;s network interface reaches
        your app. Create appnet with <span className="font-mono">docker network create appnet</span>.
      </p>
    </div>
  );
}
