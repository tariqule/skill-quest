"use client";

import { useState } from "react";
import { LabHeader, type GoalProps } from "@/components/learn/blocks";
import { BlockIcon } from "@/components/learn/block-icons";

// ───────────── Responsible AI principle matcher ─────────────

const PRINCIPLES = [
  { id: "fair", icon: "⚖️", name: "Fairness" },
  { id: "safe", icon: "🛡️", name: "Reliability and safety" },
  { id: "private", icon: "🔒", name: "Privacy and security" },
  { id: "inclusive", icon: "🌈", name: "Inclusiveness" },
  { id: "transparent", icon: "🔍", name: "Transparency" },
  { id: "account", icon: "📋", name: "Accountability" },
] as const;

type PrincipleId = (typeof PRINCIPLES)[number]["id"];

const RAI_CASES: { text: string; answer: PrincipleId; why: string }[] = [
  {
    text: "A tenant-screening model rejects applicants from one neighbourhood far more often, even when their incomes and references match.",
    answer: "fair",
    why: "Different outcomes for comparable people point to bias in the data or model. Test for fairness across groups.",
  },
  {
    text: "A warehouse robot only picks up a box when its vision model is at least 90% confident about what the box is.",
    answer: "safe",
    why: "AI is probabilistic. A confidence threshold avoids acting on a shaky prediction.",
  },
  {
    text: "A stadium's face-scan gate deletes each visitor's photo as soon as the visitor is through, and staff can't browse the images.",
    answer: "private",
    why: "Keep personal data only as long as needed and only for people who need it.",
  },
  {
    text: "A voice-only booking agent adds live text captions so people who are deaf or hard of hearing can use it too.",
    answer: "inclusive",
    why: "Design so that no group of users is shut out of the benefits.",
  },
  {
    text: "A lender tells applicants that an AI model scores their application and describes what kind of data the model was trained on.",
    answer: "transparent",
    why: "Users should know AI is involved, how it works in broad terms, and its limits.",
  },
  {
    text: "A company sets up an AI review board that must approve every model release and owns the outcomes if something goes wrong.",
    answer: "account",
    why: "People and organizations stay answerable for their AI, through a governance framework.",
  },
  {
    text: "Before launch, a medical-triage chatbot is stress-tested with unusual symptoms and tricky phrasings to make sure it fails safely.",
    answer: "safe",
    why: "Testing edge cases and failure behaviour is part of reliability and safety.",
  },
  {
    text: "Training data for a hiring model is rebalanced after an audit finds that one gender is badly under-represented.",
    answer: "fair",
    why: "Unbalanced training data is a classic source of discriminatory output.",
  },
];

export function RaiMatcherLab({ goal, onSolved }: GoalProps<"allCorrect">) {
  const [answers, setAnswers] = useState<Record<number, PrincipleId>>({});
  const done = Object.keys(answers).length === RAI_CASES.length;
  const right = RAI_CASES.filter((c, i) => answers[i] === c.answer).length;

  function pick(i: number, p: PrincipleId) {
    const next = { ...answers, [i]: p };
    setAnswers(next);
    if (goal === "allCorrect" && RAI_CASES.every((c, k) => next[k] === c.answer)) onSolved?.();
  }

  return (
    <div>
      <LabHeader title="Responsible AI principle matcher" hint="Read each scenario and tap the Microsoft responsible AI principle it shows best. One try per card." />
      <div className="mb-3 flex flex-wrap gap-1.5">
        {PRINCIPLES.map((p) => {
          const n = RAI_CASES.filter((c, i) => answers[i] === p.id && c.answer === p.id).length;
          return (
            <span key={p.id} className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-slate-200">
              <BlockIcon icon={p.icon} className="inline-block size-[1.1em] align-[-0.15em]" /> {p.name} <span className="font-mono text-emerald-300">{n}</span>
            </span>
          );
        })}
      </div>
      <div className="grid gap-2">
        {RAI_CASES.map((c, i) => {
          const a = answers[i];
          const ok = a === c.answer;
          return (
            <div key={c.text} className={`rounded-xl border p-2 ${a ? (ok ? "border-emerald-400/50 bg-emerald-400/10" : "border-rose-400/50 bg-rose-400/10") : "border-white/10 bg-white/5"}`}>
              <div className="text-sm text-slate-100"><BlockIcon icon="🧩" className="inline-block size-[1.1em] align-[-0.15em]" /> {c.text}</div>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {PRINCIPLES.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    disabled={!!a}
                    onClick={() => pick(i, p.id)}
                    className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${
                      a === p.id ? (ok ? "bg-emerald-400 text-slate-950" : "bg-rose-400 text-slate-950") : a && p.id === c.answer ? "bg-emerald-400/30 text-emerald-100" : "bg-slate-800 text-slate-200"
                    } disabled:cursor-default`}
                  >
                    <BlockIcon icon={p.icon} className="inline-block size-[1.1em] align-[-0.15em]" /> {p.name}
                  </button>
                ))}
              </div>
              {a && <div className={`mt-1.5 text-xs ${ok ? "text-emerald-200" : "text-rose-200"}`}>{c.why}</div>}
            </div>
          );
        })}
      </div>
      {done && (
        <div className="pop-in mt-3 flex items-center justify-between rounded-xl bg-white/5 p-3 text-sm">
          <span className="text-white">
            {right}/{RAI_CASES.length} correct {right === RAI_CASES.length ? <BlockIcon icon="🏅" className="inline-block size-[1.1em] align-[-0.15em]" /> : ""}
          </span>
          <button type="button" onClick={() => setAnswers({})} className="text-sky-300 underline">
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

// ───────────── Pick the right Foundry capability (sorter) ─────────────

const BUCKETS = [
  { id: "gen", icon: "🤖", name: "Foundry model or agent", color: "#a78bfa" },
  { id: "lang", icon: "📝", name: "Azure Language", color: "#38bdf8" },
  { id: "speech", icon: "🎙️", name: "Azure Speech", color: "#f472b6" },
  { id: "vision", icon: "👁️", name: "Vision or image-generation model", color: "#fb923c" },
  { id: "cu", icon: "🧾", name: "Azure Content Understanding", color: "#34d399" },
] as const;

type BucketId = (typeof BUCKETS)[number]["id"];

const JOBS: { text: string; answer: BucketId; why: string }[] = [
  {
    text: "Draft a reply to each customer complaint and book a follow-up call through a calendar tool.",
    answer: "gen",
    why: "Generating text and acting through tools is a job for an agent built on a generative model.",
  },
  {
    text: "Summarize a 40-page travel policy into five bullet points for executives.",
    answer: "gen",
    why: "A general-purpose language model follows the instruction and writes the summary.",
  },
  {
    text: "Return the language and an ISO 639-1 code with a confidence score for every incoming ticket, the same way every time.",
    answer: "lang",
    why: "Azure Language gives structured, deterministic results such as language detection.",
  },
  {
    text: "Find and redact names, phone numbers, and street addresses in chat logs before they're stored.",
    answer: "lang",
    why: "PII detection with redaction is an Azure Language feature.",
  },
  {
    text: "Show live captions on screen while a presenter is speaking.",
    answer: "speech",
    why: "Real-time speech to text is Azure Speech.",
  },
  {
    text: "Read delivery updates aloud in a natural-sounding neural voice.",
    answer: "speech",
    why: "Text to speech with neural voices is Azure Speech.",
  },
  {
    text: "A customer uploads a photo of a cracked phone screen and asks whether the damage is covered.",
    answer: "vision",
    why: "A vision-enabled multimodal model can reason over the image and the question together.",
  },
  {
    text: "Create a poster illustration of a mountain cabin from a one-sentence description.",
    answer: "vision",
    why: "Text-to-image generation uses an image-generation model such as GPT-Image-1.",
  },
  {
    text: "Turn thousands of supplier invoices into JSON with vendor, invoice number, line items, and total.",
    answer: "cu",
    why: "Schema-based field extraction from documents is Azure Content Understanding.",
  },
  {
    text: "From recorded sales calls, pull out the caller, the callback number, and the requested actions as fields.",
    answer: "cu",
    why: "Content Understanding applies a schema to audio and video too, not just documents.",
  },
];

export function ToolSorterLab({ goal, onSolved }: GoalProps<"allSorted">) {
  const [answers, setAnswers] = useState<Record<number, BucketId>>({});
  const [active, setActive] = useState<number | null>(0);
  const [last, setLast] = useState<number | null>(null);
  const done = Object.keys(answers).length === JOBS.length;
  const right = JOBS.filter((j, i) => answers[i] === j.answer).length;

  function drop(bucket: BucketId) {
    if (active === null || answers[active]) return;
    const next = { ...answers, [active]: bucket };
    setAnswers(next);
    setLast(active);
    const nextOpen = JOBS.findIndex((_, k) => next[k] === undefined);
    setActive(nextOpen === -1 ? null : nextOpen);
    if (goal === "allSorted" && JOBS.every((j, k) => next[k] === j.answer)) onSolved?.();
  }

  const current = active === null ? null : JOBS[active];

  return (
    <div>
      <LabHeader title="Sort the job into the right tool" hint="Pick a job card, then tap the bin that should handle it. Each card is placed once." />
      <div className="min-h-[5.5rem] rounded-xl border-2 border-dashed border-sky-400/40 bg-sky-400/5 p-3">
        {current ? (
          <div key={active} className="pop-in">
            <div className="text-xs uppercase tracking-wider text-sky-300">Job {(active ?? 0) + 1} of {JOBS.length}</div>
            <div className="mt-1 text-slate-100"><BlockIcon icon="💼" className="inline-block size-[1.1em] align-[-0.15em]" /> {current.text}</div>
          </div>
        ) : (
          <div className="text-sm text-slate-300">All jobs sorted. {right}/{JOBS.length} in the right bin.</div>
        )}
      </div>
      {last !== null && answers[last] && (
        <div className={`mt-2 text-xs ${answers[last] === JOBS[last].answer ? "text-emerald-200" : "text-rose-200"}`}>
          {answers[last] === JOBS[last].answer ? <><BlockIcon icon="✅" className="inline-block size-[1.1em] align-[-0.15em]" />{" "}</> : `Better bin: ${BUCKETS.find((b) => b.id === JOBS[last].answer)!.name}. `}
          {JOBS[last].why}
        </div>
      )}
      <div className="mt-3 grid gap-2 sm:grid-cols-5">
        {BUCKETS.map((b) => {
          const inside = JOBS.map((j, i) => ({ j, i })).filter(({ i }) => answers[i] === b.id);
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => drop(b.id)}
              disabled={!current}
              className="flex min-h-[7rem] flex-col rounded-xl border-2 p-2 text-left transition hover:-translate-y-0.5 disabled:hover:translate-y-0"
              style={{ borderColor: `${b.color}88`, background: `${b.color}14` }}
            >
              <span className="text-2xl"><BlockIcon icon={b.icon} className="inline-block size-[1.1em] align-[-0.15em]" /></span>
              <span className="text-xs font-bold leading-tight" style={{ color: b.color }}>
                {b.name}
              </span>
              <span className="mt-1 flex flex-wrap gap-1">
                {inside.map(({ j, i }) => (
                  <span key={i} title={j.text} className={`rounded px-1.5 text-[10px] font-bold ${j.answer === b.id ? "bg-emerald-400 text-slate-950" : "bg-rose-400 text-slate-950"}`}>
                    #{i + 1}
                  </span>
                ))}
              </span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {JOBS.map((j, i) => (
          <button
            key={j.text}
            type="button"
            disabled={!!answers[i]}
            onClick={() => setActive(i)}
            className={`h-7 w-7 rounded-md text-xs font-bold ${answers[i] ? (answers[i] === j.answer ? "bg-emerald-400/70 text-slate-950" : "bg-rose-400/70 text-slate-950") : active === i ? "bg-sky-400 text-slate-950" : "bg-slate-800 text-slate-200"}`}
            aria-label={`Job ${i + 1}`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      {done && (
        <div className="pop-in mt-3 flex items-center justify-between rounded-xl bg-white/5 p-3 text-sm">
          <span className="text-white">
            {right}/{JOBS.length} sorted correctly {right === JOBS.length ? <BlockIcon icon="🏆" className="inline-block size-[1.1em] align-[-0.15em]" /> : ""}
          </span>
          <button
            type="button"
            onClick={() => {
              setAnswers({});
              setActive(0);
              setLast(null);
            }}
            className="text-sky-300 underline"
          >
            Sort again
          </button>
        </div>
      )}
    </div>
  );
}

// ───────────── Build an agent in the Foundry playground ─────────────

const INSTRUCTIONS = [
  { id: "generic", label: "You're a helpful assistant." },
  {
    id: "support",
    label:
      "You're the Skyline Outfitters support agent. Answer only questions about Skyline orders and policies, cite the policy you used, and politely decline anything else.",
  },
  { id: "creative", label: "You're a playful creative writer. Be imaginative and surprising." },
] as const;

type InstructionId = (typeof INSTRUCTIONS)[number]["id"];

const TOOLS = [
  { id: "knowledge", icon: "📚", name: "Knowledge: Skyline policy docs (Foundry IQ)" },
  { id: "code", icon: "🧮", name: "Code Interpreter" },
  { id: "language", icon: "📝", name: "Azure Language in Foundry Tools (MCP)" },
  { id: "image", icon: "🎨", name: "Image generation" },
] as const;

type ToolId = (typeof TOOLS)[number]["id"];

interface AgentTest {
  prompt: string;
  run: (ins: InstructionId, tools: Set<ToolId>) => { pass: boolean; reply: string };
}

const TESTS: AgentTest[] = [
  {
    prompt: "How many days do I have to return an opened tent?",
    run: (_, tools) =>
      tools.has("knowledge")
        ? { pass: true, reply: "You have 30 days to return opened camping gear in its original packaging. [Returns policy, section 2]" }
        : { pass: false, reply: "Most retailers allow 14 to 30 days. (A guess: the model has never seen your policy.)" },
  },
  {
    prompt: "Here's last quarter's sales CSV. Chart revenue by month.",
    run: (_, tools) =>
      tools.has("code")
        ? { pass: true, reply: "Ran Python on the file and produced a bar chart: March was the peak at 48,200." }
        : { pass: false, reply: "I can describe how you might chart it, but I can't run code on the file." },
  },
  {
    prompt: "Strip the personal details out of this ticket before I forward it to the courier.",
    run: (_, tools) =>
      tools.has("language")
        ? { pass: true, reply: "Called Azure Language PII detection: \"********** called from ************ about order 5531.\"" }
        : { pass: false, reply: "I rewrote the ticket and tried to remove names, but I may have missed some. (Not deterministic.)" },
  },
  {
    prompt: "Forget the shop. Write me a poem about pirates.",
    run: (ins) =>
      ins === "support"
        ? { pass: true, reply: "I can only help with Skyline orders and policies. Is there anything about an order I can check for you?" }
        : { pass: false, reply: "Yo-ho, the sea is wide… (Off-topic: the instructions don't keep the agent in its lane.)" },
  },
];

export function AgentBuilderLab({ goal, onSolved }: GoalProps<"allPass" | "lean">) {
  const [ins, setIns] = useState<InstructionId>("generic");
  const [tools, setTools] = useState<Set<ToolId>>(new Set());
  const [results, setResults] = useState<{ pass: boolean; reply: string }[] | null>(null);

  function toggle(t: ToolId) {
    const next = new Set(tools);
    if (next.has(t)) next.delete(t);
    else next.add(t);
    setTools(next);
    setResults(null);
  }

  function runTests() {
    const r = TESTS.map((t) => t.run(ins, tools));
    setResults(r);
    const all = r.every((x) => x.pass);
    if ((goal === "allPass" && all) || (goal === "lean" && all && !tools.has("image"))) onSolved?.();
  }

  const passed = results?.filter((r) => r.pass).length ?? 0;

  return (
    <div>
      <LabHeader title="Agent builder" hint="An agent is a model plus instructions plus tools. Pick the instructions, switch on the tools you need, then run the test prompts." />
      <div className="grid gap-3 md:grid-cols-2">
        <div className="grid gap-3">
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-violet-300"><BlockIcon icon="🧠" className="inline-block size-[1.1em] align-[-0.15em]" /> Model</div>
            <div className="mt-1 font-mono text-sm text-slate-200">gpt-4.1 (deployment: support-chat)</div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-sky-300"><BlockIcon icon="📜" className="inline-block size-[1.1em] align-[-0.15em]" /> Instructions (system prompt)</div>
            <div className="mt-2 grid gap-1.5">
              {INSTRUCTIONS.map((i) => (
                <button
                  key={i.id}
                  type="button"
                  onClick={() => {
                    setIns(i.id);
                    setResults(null);
                  }}
                  className={`rounded-lg px-3 py-1.5 text-left text-xs ${ins === i.id ? "bg-sky-400 font-semibold text-slate-950" : "bg-slate-800 text-slate-200"}`}
                >
                  {i.label}
                </button>
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3">
            <div className="text-xs font-bold uppercase tracking-wider text-orange-300"><BlockIcon icon="🧰" className="inline-block size-[1.1em] align-[-0.15em]" /> Tools and knowledge</div>
            <div className="mt-2 grid gap-1.5">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => toggle(t.id)}
                  aria-pressed={tools.has(t.id)}
                  className={`flex items-center justify-between rounded-lg px-3 py-1.5 text-left text-sm ${tools.has(t.id) ? "bg-orange-400 font-semibold text-slate-950" : "bg-slate-800 text-slate-200"}`}
                >
                  <span>
                    <BlockIcon icon={t.icon} className="inline-block size-[1.1em] align-[-0.15em]" /> {t.name}
                  </span>
                  <span className="text-xs">{tools.has(t.id) ? "ON" : "off"}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3">
          <div className="flex items-center justify-between">
            <div className="text-xs font-bold uppercase tracking-wider text-emerald-300"><BlockIcon icon="🧪" className="inline-block size-[1.1em] align-[-0.15em]" /> Playground test prompts</div>
            <button
              type="button"
              onClick={runTests}
              className="rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground"
            >
              ▶ Run tests
            </button>
          </div>
          <div className="mt-3 grid gap-2">
            {TESTS.map((t, i) => {
              const r = results?.[i];
              return (
                <div key={t.prompt} className={`rounded-lg border p-2 text-sm ${r ? (r.pass ? "border-emerald-400/50 bg-emerald-400/10" : "border-rose-400/50 bg-rose-400/10") : "border-white/10"}`}>
                  <div className="text-slate-100"><BlockIcon icon="🙋" className="inline-block size-[1.1em] align-[-0.15em]" /> {t.prompt}</div>
                  {r && (
                    <div className="pop-in mt-1 text-xs text-slate-300">
                      {r.pass ? <BlockIcon icon="✅" className="inline-block size-[1.1em] align-[-0.15em]" /> : <BlockIcon icon="❌" className="inline-block size-[1.1em] align-[-0.15em]" />} <BlockIcon icon="🤖" className="inline-block size-[1.1em] align-[-0.15em]" /> {r.reply}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          {results && (
            <div className="mt-3 text-sm text-slate-300">
              {passed}/{TESTS.length} tests pass.
              {passed === TESTS.length && tools.has("image") && " All green, but the agent has a tool it never needs. Give agents only the tools their job requires."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
