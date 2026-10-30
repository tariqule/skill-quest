"use client";

import { useState } from "react";
import { LabHeader, type GoalProps } from "@/components/learn/blocks";
import { pct } from "@/engine/game";

// ───────────── DynamoDB capacity calculator ─────────────

type ReadMode = "strong" | "eventual" | "transactional";
type WriteMode = "standard" | "transactional";

interface CapacityScenario {
  name: string;
  icon: string;
  readKB: number;
  reads: number;
  readMode: ReadMode;
  writeKB: number;
  writes: number;
  writeMode: WriteMode;
}

const CAPACITY_SCENARIOS: CapacityScenario[] = [
  { name: "Product catalog", icon: "🛒", readKB: 6, reads: 80, readMode: "strong", writeKB: 2.5, writes: 10, writeMode: "standard" },
  { name: "News feed", icon: "📰", readKB: 10, reads: 100, readMode: "eventual", writeKB: 0.5, writes: 25, writeMode: "standard" },
  { name: "Bank ledger", icon: "🏦", readKB: 3, reads: 40, readMode: "transactional", writeKB: 3, writes: 15, writeMode: "transactional" },
];

const READ_FACTOR: Record<ReadMode, number> = { strong: 1, eventual: 0.5, transactional: 2 };
const READ_LABEL: Record<ReadMode, string> = { strong: "strongly consistent", eventual: "eventually consistent", transactional: "transactional" };

function capacityNeeded(s: CapacityScenario) {
  const readUnits = Math.ceil(s.readKB / 4);
  const writeUnits = Math.ceil(s.writeKB / 1);
  const rcu = Math.ceil(readUnits * s.reads * READ_FACTOR[s.readMode]);
  const wcu = writeUnits * s.writes * (s.writeMode === "transactional" ? 2 : 1);
  return { readUnits, writeUnits, rcu, wcu };
}

function verdict(provisioned: number, need: number) {
  if (provisioned < need) return { tone: "bad" as const, text: `Throttled: ProvisionedThroughputExceededException (short by ${need - provisioned})` };
  if (provisioned === need) return { tone: "good" as const, text: "Exact fit: no throttling, no idle capacity" };
  return { tone: "warn" as const, text: `Works, but ${Math.round(((provisioned - need) / need) * 100)}% over: you pay for idle capacity` };
}

export function DynamoCapacityLab({ goal, onSolved }: GoalProps<"provision">) {
  const [si, setSi] = useState(0);
  const [rcu, setRcu] = useState(50);
  const [wcu, setWcu] = useState(10);
  const [ran, setRan] = useState<{ si: number; rcu: number; wcu: number } | null>(null);

  const s = CAPACITY_SCENARIOS[si];
  const need = capacityNeeded(s);

  function pick(i: number) {
    setSi(i);
    setRan(null);
  }

  function run() {
    setRan({ si, rcu, wcu });
    if (goal === "provision" && rcu === need.rcu && wcu === need.wcu) onSolved?.();
  }

  const result = ran && ran.si === si ? { r: verdict(ran.rcu, need.rcu), w: verdict(ran.wcu, need.wcu) } : null;

  return (
    <div>
      <LabHeader title="Provision the right capacity" hint="Pick a workload, set read and write capacity units, then run a load test. Aim for an exact fit." />
      <div className="flex flex-wrap gap-2">
        {CAPACITY_SCENARIOS.map((x, i) => (
          <button
            key={x.name}
            type="button"
            onClick={() => pick(i)}
            className={`rounded-full border px-3 py-1 text-sm ${si === i ? "border-amber-400 bg-amber-400/20 text-white" : "border-white/10 text-slate-300"}`}
          >
            {x.icon} {x.name}
          </button>
        ))}
      </div>
      <div className="mt-3 grid gap-2 rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-200 sm:grid-cols-2">
        <div>
          📖 <b>{s.reads}</b> {READ_LABEL[s.readMode]} reads/second of <b>{s.readKB} KB</b> items
        </div>
        <div>
          ✍️ <b>{s.writes}</b> {s.writeMode === "transactional" ? "transactional " : ""}writes/second of <b>{s.writeKB} KB</b> items
        </div>
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Stepper label="Read capacity units (RCU)" value={rcu} onChange={setRcu} color="#38bdf8" />
        <Stepper label="Write capacity units (WCU)" value={wcu} onChange={setWcu} color="#34d399" />
      </div>

      <button type="button" onClick={run} className="btn-3d mt-3 rounded-xl bg-amber-400 px-4 py-2 font-bold text-slate-950" style={{ "--edge": "#b45309" } as React.CSSProperties}>
        ⚡ Run load test
      </button>

      {result && ran && (
        <div className="pop-in mt-3 grid gap-2">
          <LoadBar label="Reads" provisioned={ran.rcu} need={need.rcu} v={result.r} color="#38bdf8" />
          <LoadBar label="Writes" provisioned={ran.wcu} need={need.wcu} v={result.w} color="#34d399" />
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">
            <div className="font-semibold text-white">The math</div>
            <div className="mt-1">
              Reads: ⌈{s.readKB} KB ÷ 4 KB⌉ = {need.readUnits} unit{need.readUnits > 1 ? "s" : ""} × {s.reads}/s
              {s.readMode === "eventual" ? " ÷ 2 (eventually consistent)" : s.readMode === "transactional" ? " × 2 (transactional)" : ""} = <b>{need.rcu} RCU</b>
            </div>
            <div>
              Writes: ⌈{s.writeKB} KB ÷ 1 KB⌉ = {need.writeUnits} unit{need.writeUnits > 1 ? "s" : ""} × {s.writes}/s
              {s.writeMode === "transactional" ? " × 2 (transactional)" : ""} = <b>{need.wcu} WCU</b>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stepper({ label, value, onChange, color }: { label: string; value: number; onChange: (v: number) => void; color: string }) {
  const set = (v: number) => onChange(Math.max(1, Math.min(1000, v)));
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="text-sm font-semibold text-white">{label}</div>
      <div className="mt-2 flex items-center gap-1.5">
        {[-10, -1].map((d) => (
          <button key={d} type="button" onClick={() => set(value + d)} className="rounded-lg bg-slate-800 px-2 py-1 text-sm font-bold text-slate-200">
            {d}
          </button>
        ))}
        <input
          type="number"
          min={1}
          max={1000}
          value={value}
          onChange={(e) => set(Number(e.target.value) || 1)}
          aria-label={label}
          className="w-20 rounded-lg border border-white/10 bg-slate-950 px-2 py-1 text-center font-mono"
          style={{ color }}
        />
        {[1, 10].map((d) => (
          <button key={d} type="button" onClick={() => set(value + d)} className="rounded-lg bg-slate-800 px-2 py-1 text-sm font-bold text-slate-200">
            +{d}
          </button>
        ))}
      </div>
    </div>
  );
}

function LoadBar({ label, provisioned, need, v, color }: { label: string; provisioned: number; need: number; v: { tone: "good" | "bad" | "warn"; text: string }; color: string }) {
  const scale = Math.max(provisioned, need) * 1.1;
  const tone = v.tone === "good" ? "text-emerald-300" : v.tone === "bad" ? "text-rose-300" : "text-amber-300";
  return (
    <div className="rounded-xl bg-white/5 p-3">
      <div className="flex justify-between text-xs">
        <span className="font-semibold text-white">{label}</span>
        <span className="font-mono text-slate-300">
          provisioned {provisioned} · needed {need}
        </span>
      </div>
      <div className="relative mt-1.5 h-3 overflow-hidden rounded-full bg-white/10">
        <div className="h-full rounded-full transition-all duration-300" style={{ width: pct(provisioned / scale), background: color }} />
        <div className="absolute inset-y-0 w-0.5 bg-white" style={{ left: pct(need / scale) }} title="needed" />
      </div>
      <div className={`mt-1 text-xs font-semibold ${tone}`}>{v.text}</div>
    </div>
  );
}

// ───────────── SQS visibility timeout and DLQ ─────────────

type SqsOutcome = "once" | "dup" | "dlq" | "loop";

function simulateQueue(processing: number, visibility: number, maxReceive: number, dlq: boolean, poison: boolean) {
  const log: string[] = [];
  let t = 0;
  let receives = 0;
  let processed = 0;
  let outcome: SqsOutcome = "loop";
  while (receives < 4) {
    if (dlq && receives >= maxReceive) {
      log.push(`t=${t}s · receive count ${receives} has reached maxReceiveCount ${maxReceive}: SQS moves the message to the dead-letter queue.`);
      outcome = "dlq";
      break;
    }
    receives++;
    log.push(`t=${t}s · a consumer receives the message (receive count ${receives}). It's hidden for ${visibility}s.`);
    if (poison) {
      log.push(`t=${t + 2}s · processing throws an error, so the consumer never deletes the message.`);
      t += visibility;
      log.push(`t=${t}s · visibility timeout ends: the message is visible again.`);
      continue;
    }
    if (processing <= visibility) {
      processed++;
      log.push(`t=${t + processing}s · processing succeeds and the consumer calls DeleteMessage. Done.`);
      outcome = processed === 1 ? "once" : "dup";
      break;
    }
    processed++;
    t += visibility;
    log.push(`t=${t}s · the timeout ends while work is still running: the message is visible again and gets picked up a second time.`);
    outcome = "dup";
  }
  if (outcome === "loop" || (outcome === "dup" && receives >= 4 && processing > visibility)) {
    log.push(poison ? "…this repeats until the retention period (default 4 days) runs out." : "…every receive starts the same work again.");
  }
  return { log, outcome, processed };
}

export function SqsLab({ goal, onSolved }: GoalProps<"once" | "dlq">) {
  const [processing, setProcessing] = useState(45);
  const [visibility, setVisibility] = useState(30);
  const [maxReceive, setMaxReceive] = useState(3);
  const [dlq, setDlq] = useState(false);
  const [poison, setPoison] = useState(goal === "dlq");
  const [run, setRun] = useState<ReturnType<typeof simulateQueue> | null>(null);

  function send() {
    const r = simulateQueue(processing, visibility, maxReceive, dlq, poison);
    setRun(r);
    if ((goal === "once" && !poison && r.outcome === "once") || (goal === "dlq" && poison && r.outcome === "dlq")) onSolved?.();
  }

  const banner: Record<SqsOutcome, { cls: string; text: string }> = {
    once: { cls: "border-emerald-400/40 bg-emerald-400/10 text-emerald-100", text: "✓ Processed exactly once, then deleted." },
    dup: { cls: "border-rose-400/40 bg-rose-400/10 text-rose-100", text: `✗ Processed ${run?.processed ?? 0}+ times, so its side effects happen more than once (double emails, double charges).` },
    dlq: poison
      ? { cls: "border-sky-400/40 bg-sky-400/10 text-sky-100", text: "✓ The poison message is parked in the DLQ for inspection. The main queue keeps flowing." }
      : {
          cls: "border-amber-400/40 bg-amber-400/10 text-amber-100",
          text: `⚠️ A healthy message ended up in the DLQ after being processed ${run?.processed ?? 0} times: the visibility timeout is shorter than the processing time.`,
        },
    loop: { cls: "border-rose-400/40 bg-rose-400/10 text-rose-100", text: "✗ The poison message keeps coming back and wastes consumer time." },
  };

  return (
    <div>
      <LabHeader title="Visibility timeout simulator" hint="Set how long work takes and how long SQS hides a received message, then send one message through the queue." />
      <div className="grid gap-3 sm:grid-cols-2">
        <Slider label="Processing time" unit="s" value={processing} min={5} max={120} step={5} onChange={setProcessing} note="How long the consumer needs per message" />
        <Slider label="Visibility timeout" unit="s" value={visibility} min={5} max={120} step={5} onChange={setVisibility} note="Default 30 s, maximum 12 hours" />
        <Slider label="maxReceiveCount" unit="" value={maxReceive} min={1} max={5} step={1} onChange={setMaxReceive} note="Receives allowed before moving to the DLQ" />
        <div className="grid gap-2 rounded-xl border border-white/10 bg-white/[0.03] p-3 text-sm">
          <label className="flex cursor-pointer items-center gap-2 text-white">
            <input type="checkbox" checked={dlq} onChange={() => setDlq(!dlq)} className="accent-sky-400" />
            Redrive policy to a dead-letter queue
          </label>
          <label className="flex cursor-pointer items-center gap-2 text-white">
            <input type="checkbox" checked={poison} onChange={() => setPoison(!poison)} className="accent-rose-400" />
            ☠️ Poison message (always fails)
          </label>
        </div>
      </div>
      <button type="button" onClick={send} className="btn-3d mt-3 rounded-xl bg-sky-400 px-4 py-2 font-bold text-slate-950" style={{ "--edge": "#0369a1" } as React.CSSProperties}>
        📨 Send a message
      </button>
      {run && (
        <div className="pop-in mt-3 grid gap-2">
          <ol className="grid gap-1 rounded-xl border border-white/10 bg-slate-950/70 p-3 font-mono text-xs leading-relaxed text-slate-200">
            {run.log.map((l, i) => (
              <li key={i}>{l}</li>
            ))}
          </ol>
          <div className={`rounded-xl border p-3 text-sm ${banner[run.outcome].cls}`}>{banner[run.outcome].text}</div>
        </div>
      )}
      <p className="mt-2 text-xs text-slate-500">With Lambda polling the queue, AWS recommends a visibility timeout of at least 6 times the function timeout.</p>
    </div>
  );
}

function Slider({ label, unit, value, min, max, step, onChange, note }: { label: string; unit: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void; note: string }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-white">{label}</span>
        <span className="font-mono text-amber-300">
          {value}
          {unit}
        </span>
      </div>
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-amber-400" aria-label={label} />
      <div className="text-xs text-slate-400">{note}</div>
    </div>
  );
}

// ───────────── IAM policy evaluator ─────────────

interface S3Request {
  label: string;
  action: "GetObject" | "PutObject" | "DeleteObject";
  https: boolean;
  want: "allow" | "deny";
}

const STATEMENTS = [
  { id: "get", where: "Identity policy", effect: "Allow", text: "s3:GetObject on reports/*", applies: (r: S3Request) => r.action === "GetObject" },
  { id: "put", where: "Identity policy", effect: "Allow", text: "s3:PutObject on reports/*", applies: (r: S3Request) => r.action === "PutObject" },
  { id: "all", where: "Identity policy", effect: "Allow", text: "s3:* on reports/*", applies: () => true },
  { id: "nodelete", where: "Identity policy", effect: "Deny", text: "s3:DeleteObject on reports/*", applies: (r: S3Request) => r.action === "DeleteObject" },
  { id: "tls", where: "Bucket policy", effect: "Deny", text: "s3:* when aws:SecureTransport is false", applies: (r: S3Request) => !r.https },
] as const;

type StatementId = (typeof STATEMENTS)[number]["id"];

const REQUESTS: S3Request[] = [
  { label: "GetObject over HTTPS", action: "GetObject", https: true, want: "allow" },
  { label: "PutObject over HTTPS", action: "PutObject", https: true, want: "allow" },
  { label: "DeleteObject over HTTPS", action: "DeleteObject", https: true, want: "deny" },
  { label: "GetObject over plain HTTP", action: "GetObject", https: false, want: "deny" },
];

function evaluate(on: Record<StatementId, boolean>, r: S3Request) {
  const active = STATEMENTS.filter((s) => on[s.id] && s.applies(r));
  const deny = active.find((s) => s.effect === "Deny");
  if (deny) return { decision: "Explicit deny" as const, by: deny.text };
  const allow = active.find((s) => s.effect === "Allow");
  if (allow) return { decision: "Allowed" as const, by: allow.text };
  return { decision: "Implicit deny" as const, by: "No statement allows it" };
}

function goalMet(goal: "leastPrivilege" | "denyWins" | undefined, on: Record<StatementId, boolean>) {
  const results = REQUESTS.map((r) => evaluate(on, r));
  const allMatch = REQUESTS.every((r, i) => (r.want === "allow") === (results[i].decision === "Allowed"));
  if (goal === "leastPrivilege") return allMatch && !on.all;
  if (goal === "denyWins") return on.all && results[2].decision === "Explicit deny" && results[0].decision === "Allowed" && results[1].decision === "Allowed";
  return false;
}

export function IamPolicyLab({ goal, onSolved }: GoalProps<"leastPrivilege" | "denyWins">) {
  const [on, setOn] = useState<Record<StatementId, boolean>>(() =>
    goal === "denyWins"
      ? { get: false, put: false, all: true, nodelete: false, tls: false }
      : goal === "leastPrivilege"
        ? { get: false, put: false, all: false, nodelete: false, tls: false }
        : { get: true, put: true, all: false, nodelete: false, tls: false },
  );

  function toggle(id: StatementId) {
    const next = { ...on, [id]: !on[id] };
    setOn(next);
    if (goalMet(goal, next)) onSolved?.();
  }

  return (
    <div>
      <LabHeader title="IAM policy evaluator" hint="Switch policy statements on and off. Every request is evaluated live: explicit deny, then allow, otherwise implicit deny." />
      <div className="grid gap-2 sm:grid-cols-2">
        {STATEMENTS.map((s) => (
          <button
            key={s.id}
            type="button"
            onClick={() => toggle(s.id)}
            aria-pressed={on[s.id]}
            className={`rounded-xl border p-2 text-left text-sm transition ${on[s.id] ? (s.effect === "Deny" ? "border-rose-400/60 bg-rose-400/15" : "border-emerald-400/60 bg-emerald-400/15") : "border-white/10 bg-white/[0.03] opacity-60"}`}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] uppercase tracking-wider text-slate-400">{s.where}</span>
              <span className={`rounded px-1.5 text-xs font-bold ${s.effect === "Deny" ? "bg-rose-400 text-slate-950" : "bg-emerald-400 text-slate-950"}`}>{s.effect}</span>
            </div>
            <div className="mt-1 font-mono text-slate-100">{s.text}</div>
            <div className="text-[11px] text-slate-500">{on[s.id] ? "✓ attached" : "detached"}</div>
          </button>
        ))}
      </div>
      <div className="mt-3 grid gap-1.5">
        {REQUESTS.map((r) => {
          const res = evaluate(on, r);
          const allowed = res.decision === "Allowed";
          const ok = (r.want === "allow") === allowed;
          return (
            <div key={r.label} className="grid grid-cols-[1fr_auto] items-center gap-2 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 text-sm">
              <div className="min-w-0">
                <div className="text-slate-100">🙋 {r.label}</div>
                <div className="truncate text-xs text-slate-500">
                  Decided by: {res.by} · target: {r.want === "allow" ? "allow" : "deny"} {ok ? "✓" : "✗"}
                </div>
              </div>
              <span className={`rounded-lg px-2 py-1 text-xs font-bold ${allowed ? "bg-emerald-400/20 text-emerald-200" : res.decision === "Explicit deny" ? "bg-rose-400/20 text-rose-200" : "bg-slate-700 text-slate-200"}`}>
                {res.decision}
              </span>
            </div>
          );
        })}
      </div>
      <p className="mt-2 text-xs text-slate-500">An explicit Deny anywhere beats every Allow. With no matching Allow, the answer is an implicit deny.</p>
    </div>
  );
}

// ───────────── Amazon Bedrock call from application code ─────────────

type CredentialOption = "accessKey" | "invoke" | "invokeStream" | "wildcard";
type ApiOption = "converse" | "stream";
type RetryOption = "none" | "immediate" | "backoff";

const CREDENTIALS: { id: CredentialOption; label: string; detail: string }[] = [
  { id: "accessKey", label: "Long-term access key in an env var", detail: "AWS_ACCESS_KEY_ID baked into the function config" },
  { id: "invoke", label: "Execution role: bedrock:InvokeModel", detail: "On the one model ARN the app uses" },
  { id: "invokeStream", label: "Execution role: InvokeModel and InvokeModelWithResponseStream", detail: "On the one model ARN the app uses" },
  { id: "wildcard", label: "Execution role: bedrock:* on *", detail: "Every Bedrock action on every resource" },
];

const RETRIES: { id: RetryOption; label: string }[] = [
  { id: "none", label: "No retries" },
  { id: "immediate", label: "5 immediate retries" },
  { id: "backoff", label: "Exponential backoff with jitter (up to 4 attempts)" },
];

const MAX_TOKEN_STEPS = [128, 256, 512, 1024, 4096];
/** Output tokens a complete answer needs, and the per-request cap the team agreed on. */
const ANSWER_TOKENS = 380;
const TOKEN_BUDGET = 1024;
/** The account is throttled for the first 500 ms of the burst. */
const THROTTLE_MS = 500;
/** Fixed jitter values so every run of the lab is reproducible. */
const BACKOFF_WAITS = [180, 410, 820];

const RAW_PROMPT = "Summarize this ticket: Jane Roe (jane.roe@example.com, card 4111 1111 1111 1111) says her order #8812 arrived damaged and wants a replacement.";
const REDACTED_PROMPT = "Summarize this ticket: [NAME] ([EMAIL], card [CARD]) says her order #8812 arrived damaged and wants a replacement.";

interface BedrockRun {
  log: { tone: "ok" | "bad" | "warn" | "info"; text: string }[];
  ok: boolean;
  safe: boolean;
}

function simulateBedrock(cred: CredentialOption, api: ApiOption, maxTokens: number, retry: RetryOption, redact: boolean): BedrockRun {
  const log: BedrockRun["log"] = [];
  const action = api === "stream" ? "bedrock:InvokeModelWithResponseStream" : "bedrock:InvokeModel";
  const op = api === "stream" ? "ConverseStream" : "Converse";
  let safe = true;

  if (cred === "accessKey") {
    safe = false;
    log.push({ tone: "warn", text: "Credentials: a long-term access key from an environment variable. It works, but it never rotates and leaks with the function config. Use the execution role." });
  } else if (cred === "wildcard") {
    safe = false;
    log.push({ tone: "warn", text: "Credentials: the role allows bedrock:* on *. The call works, but a bug or injected prompt could reach any model or Bedrock API. Scope it to the model ARN." });
  } else {
    log.push({ tone: "ok", text: `Credentials: execution role, scoped to one model ARN.` });
  }

  if (cred === "invoke" && api === "stream") {
    log.push({ tone: "bad", text: `${op} → AccessDeniedException (403): the role has no ${action} on this model.` });
    return { log, ok: false, safe: false };
  }

  if (!redact) {
    safe = false;
    log.push({ tone: "warn", text: "Prompt contains a name, an email address, and a card number. They'd reach the model and any invocation logs. Redact before sending." });
  } else {
    log.push({ tone: "ok", text: `Prompt redacted: "${REDACTED_PROMPT.slice(0, 60)}…"` });
  }

  if (maxTokens > TOKEN_BUDGET) {
    safe = false;
    log.push({ tone: "warn", text: `maxTokens ${maxTokens} is over the ${TOKEN_BUDGET}-token budget: a runaway answer could cost ${Math.round(maxTokens / TOKEN_BUDGET)}× what you planned.` });
  }

  // Throttling burst.
  const attempts = retry === "none" ? 1 : retry === "immediate" ? 6 : 4;
  let t = 0;
  let succeeded = false;
  for (let a = 1; a <= attempts; a++) {
    if (t < THROTTLE_MS) {
      log.push({ tone: "bad", text: `t=${t} ms · attempt ${a}: ${op} → ThrottlingException (429).` });
      if (a === attempts) break;
      const wait = retry === "immediate" ? 20 : BACKOFF_WAITS[a - 1] ?? 1000;
      t += wait;
      continue;
    }
    log.push({ tone: "ok", text: `t=${t} ms · attempt ${a}: ${op} accepted.` });
    succeeded = true;
    break;
  }
  if (!succeeded) {
    log.push({
      tone: "bad",
      text: retry === "none" ? "Gave up after one throttled call: the user sees an error." : "Every retry landed inside the throttling window. Retrying instantly just adds more load.",
    });
    return { log, ok: false, safe: false };
  }

  const inputTokens = redact ? 41 : 52;
  if (maxTokens < ANSWER_TOKENS) {
    log.push({ tone: "bad", text: `Response: stopReason "max_tokens" after ${maxTokens} output tokens. The summary is cut off mid-sentence.` });
    log.push({ tone: "info", text: `usage: inputTokens ${inputTokens}, outputTokens ${maxTokens}` });
    return { log, ok: false, safe: false };
  }
  log.push({
    tone: "ok",
    text: api === "stream" ? `Stream: contentBlockDelta events arrive as text is generated, then messageStop (stopReason "end_turn").` : `Response: complete summary, stopReason "end_turn".`,
  });
  log.push({ tone: "info", text: `usage: inputTokens ${inputTokens}, outputTokens ${ANSWER_TOKENS}` });
  return { log, ok: true, safe };
}

export function BedrockLab({ goal, onSolved }: GoalProps<"safe" | "stream">) {
  const [cred, setCred] = useState<CredentialOption>("accessKey");
  const [api, setApi] = useState<ApiOption>("converse");
  const [tokenStep, setTokenStep] = useState(0);
  const [retry, setRetry] = useState<RetryOption>("none");
  const [redact, setRedact] = useState(false);
  const [run, setRun] = useState<BedrockRun | null>(null);
  const maxTokens = MAX_TOKEN_STEPS[tokenStep];

  function send() {
    const r = simulateBedrock(cred, api, maxTokens, retry, redact);
    setRun(r);
    const solved = r.ok && r.safe && (goal === "safe" || (goal === "stream" && api === "stream"));
    if (solved) onSolved?.();
  }

  const verdict = run
    ? run.ok && run.safe
      ? { cls: "border-emerald-400/40 bg-emerald-400/10 text-emerald-100", text: "✓ A complete answer, least privilege, no personal data sent, and a capped cost. Safe and successful." }
      : run.ok
        ? { cls: "border-amber-400/40 bg-amber-400/10 text-amber-100", text: "⚠️ The request worked, but not safely. Fix the warnings above." }
        : { cls: "border-rose-400/40 bg-rose-400/10 text-rose-100", text: "✗ The user didn't get a complete answer." }
    : null;

  return (
    <div>
      <LabHeader title="Call Amazon Bedrock from a Lambda function" hint="Configure the call, then send it during a throttling burst. Aim for a complete answer that's also safe." />
      <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 font-mono text-xs leading-relaxed text-slate-300">
        <div className="text-[11px] uppercase tracking-wider text-slate-500">User prompt</div>
        {redact ? REDACTED_PROMPT : RAW_PROMPT}
      </div>

      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="text-sm font-semibold text-white">Credentials</div>
          <div className="mt-2 grid gap-1.5">
            {CREDENTIALS.map((c) => (
              <label key={c.id} className="flex cursor-pointer items-start gap-2 text-sm text-slate-200">
                <input type="radio" name="bedrock-cred" checked={cred === c.id} onChange={() => setCred(c.id)} className="mt-1 accent-amber-400" />
                <span>
                  {c.label}
                  <span className="block text-xs text-slate-500">{c.detail}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid gap-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="text-sm font-semibold text-white">API</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["converse", "stream"] as const).map((a) => (
                <button
                  key={a}
                  type="button"
                  onClick={() => setApi(a)}
                  aria-pressed={api === a}
                  className={`rounded-full border px-3 py-1 text-sm ${api === a ? "border-amber-400 bg-amber-400/20 text-white" : "border-white/10 text-slate-300"}`}
                >
                  {a === "converse" ? "Converse" : "ConverseStream"}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="flex justify-between text-sm">
              <span className="font-semibold text-white">inferenceConfig.maxTokens</span>
              <span className="font-mono text-amber-300">{maxTokens}</span>
            </div>
            <input
              type="range"
              min={0}
              max={MAX_TOKEN_STEPS.length - 1}
              step={1}
              value={tokenStep}
              onChange={(e) => setTokenStep(Number(e.target.value))}
              className="w-full accent-amber-400"
              aria-label="maxTokens"
            />
            <div className="text-xs text-slate-400">A full summary needs about {ANSWER_TOKENS} output tokens. Budget: {TOKEN_BUDGET} per request.</div>
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="text-sm font-semibold text-white">On ThrottlingException (429)</div>
          <div className="mt-2 grid gap-1.5">
            {RETRIES.map((r) => (
              <label key={r.id} className="flex cursor-pointer items-center gap-2 text-sm text-slate-200">
                <input type="radio" name="bedrock-retry" checked={retry === r.id} onChange={() => setRetry(r.id)} className="accent-sky-400" />
                {r.label}
              </label>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
          <div className="text-sm font-semibold text-white">Before sending</div>
          <label className="mt-2 flex cursor-pointer items-center gap-2 text-sm text-slate-200">
            <input type="checkbox" checked={redact} onChange={() => setRedact(!redact)} className="accent-emerald-400" />
            Redact names, emails, and card numbers from the prompt
          </label>
          <div className="mt-1 text-xs text-slate-500">In production, a guardrail&apos;s sensitive information filter or your own redaction step does this.</div>
        </div>
      </div>

      <button type="button" onClick={send} className="btn-3d mt-3 rounded-xl bg-amber-400 px-4 py-2 font-bold text-slate-950" style={{ "--edge": "#b45309" } as React.CSSProperties}>
        🧠 Send the request
      </button>

      {run && verdict && (
        <div className="pop-in mt-3 grid gap-2">
          <ol className="grid gap-1 rounded-xl border border-white/10 bg-slate-950/70 p-3 font-mono text-xs leading-relaxed">
            {run.log.map((l, i) => (
              <li key={i} className={l.tone === "ok" ? "text-emerald-200" : l.tone === "bad" ? "text-rose-200" : l.tone === "warn" ? "text-amber-200" : "text-slate-400"}>
                {l.text}
              </li>
            ))}
          </ol>
          <div className={`rounded-xl border p-3 text-sm ${verdict.cls}`}>{verdict.text}</div>
        </div>
      )}
      <p className="mt-2 text-xs text-slate-500">Simulated: no real AWS calls are made. Throttling lasts {THROTTLE_MS} ms in this burst.</p>
    </div>
  );
}
