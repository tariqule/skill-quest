import { defineCourse } from "@/engine/define";
import d1 from "./domains/d1-types-data";
import d2 from "./domains/d2-methods-errors";
import d3 from "./domains/d3-concurrency";
import d4 from "./domains/d4-runtime-services";

/**
 * Go Interview Quest: the Go questions backend and infrastructure interviews
 * actually ask, from slice aliasing and the nil-interface trap to channels,
 * the scheduler, and production service design. Based on the official Go
 * documentation; snippets target Go 1.25.
 */
export default defineCourse({
  id: "code-go",
  kind: "interview",
  category: "languages",
  tags: ["golang", "goroutines", "channels", "slices", "interfaces", "concurrency", "generics", "context"],
  provider: { id: "go", name: "Go", color: "#00add8", icon: "🐹" },
  code: "GO",
  title: "Go Interview Quest",
  shortTitle: "Go",
  tagline: "Predict the output, hunt the bug, and explain the why: slices, interfaces, errors, goroutines, channels, and the runtime.",
  level: "Intermediate",
  storageKey: "course:code-go:v1",

  domains: [d1, d2, d3, d4],

  exam: {
    questions: 30,
    unscored: 0,
    minutes: 45,
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "One correct answer. Often \"what does this print?\" or \"what happens?\"." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "The prompt says how many to pick. You need all of them right to score." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Arrange code lines or steps into the order that works." },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair each item with its answer. Every pair must be right." },
      { id: "lines", icon: "🐞", name: "Bug hunt", rule: "Tap the line (or lines) in the snippet that cause the bug, panic, or compile error." },
    ],
  },

  guide: {
    source: {
      label: "Go interview syllabus, based on the official docs",
      version: "2026",
      date: "October 2026",
      url: "https://go.dev/doc/",
    },
    facts: [
      { icon: "🎤", value: "30", label: "questions", detail: "The full mock interview: 30 mixed questions in 45 minutes, about 90 seconds each." },
      { icon: "🎯", value: "70", label: "to pass", detail: "Score 70 out of 100 on the mock. Every question counts; there are no unscored ones." },
      { icon: "🔮", value: "Predict", label: "the output", detail: "Go screens love short snippets about slices, defer, and interfaces. The traps are well known, so learn them by name." },
      { icon: "⚡", value: "Concurrency", label: "is central", detail: "Expect goroutines, channels, select, and context in almost every Go interview, often as a bug hunt or a design discussion." },
      { icon: "🗣️", value: "Why", label: "matters most", detail: "Interviewers care about your reasoning: who owns a channel, how a goroutine ends, what allocates, and what can race." },
      { icon: "🐹", value: "1.25", label: "modern Go", detail: "Snippets assume Go 1.25. Version-specific behaviour (like per-iteration loop variables in 1.22) is called out. Snippets omit package main and imports when obvious." },
    ],
    candidate: {
      is: [
        "Preparing for a backend, platform, SRE, or infrastructure interview that uses Go",
        "Comfortable writing basic Go and wants to understand why it behaves the way it does",
        "Practising predict-the-output and bug-hunt questions on slices, interfaces, and concurrency",
        "Reviewing the runtime and service-design topics that come up for senior and staff roles",
      ],
      isNot: [
        "A data-structures-and-algorithms course",
        "Framework-specific (Gin, Echo, gRPC code generation, ORMs)",
        "A tour of every standard library package",
        "Deep runtime source internals beyond what interviews commonly ask",
      ],
    },
    scope: {
      label: "Topics covered",
      groups: [
        { category: "Basics", icon: "🧱", services: ["Zero values", "var vs :=", "Shadowing", "Untyped constants", "range over int"] },
        { category: "Data", icon: "📚", services: ["Arrays vs slices", "append & capacity", "Full slice expressions", "Maps", "Strings, bytes, runes"] },
        { category: "Types", icon: "🏛️", services: ["Methods & receivers", "Method sets", "Embedding", "Interfaces", "Type switches", "Nil interfaces"] },
        { category: "Errors", icon: "🧯", services: ["%w wrapping", "errors.Is / errors.As", "errors.Join", "defer", "panic / recover"] },
        { category: "Concurrency", icon: "⚡", services: ["Goroutines", "WaitGroup", "Channels", "select", "context", "Mutex / RWMutex", "Once / atomic", "-race"] },
        { category: "Generics", icon: "🧬", services: ["Type parameters", "any / comparable", "cmp.Ordered", "~T constraints"] },
        { category: "Runtime", icon: "⚙️", services: ["G-M-P scheduler", "Preemption", "Escape analysis", "GC, GOGC, GOMEMLIMIT", "sync.Pool"] },
        { category: "Services", icon: "🚀", services: ["Graceful shutdown", "Timeouts", "Worker pools", "errgroup", "pprof", "Module versions"] },
      ],
    },
    tips: [
      { icon: "✏️", tip: "For slice questions, draw the backing array and the slice windows on it. Ask \"is len < cap?\" before every append." },
      { icon: "🗣️", tip: "Whenever you write `go`, say how the goroutine ends and who closes each channel. Leaks are the bug interviewers look for." },
      { icon: "🧯", tip: "Handle every error right where it's returned, and wrap it with context using %w. Never compare error strings." },
      { icon: "🕳️", tip: "Name the classic traps when you see them: nil map write, nil interface holding a nil pointer, defer in a loop, value receiver on a mutex." },
      { icon: "🧪", tip: "Mention tooling: go vet, go test -race, benchmarks with -benchmem, and pprof. It signals production experience." },
      { icon: "⚖️", tip: "For design questions, bound everything: timeouts on every call, a limit on concurrency, and a deadline on shutdown." },
    ],
    officialPractice: { label: "A Tour of Go (go.dev)", url: "https://go.dev/tour/" },
  },

  cheatsheet: [
    {
      title: "Slices and maps",
      items: [
        ["Array vs slice", "[4]int is a value (copied); []int is a header (ptr, len, cap) over an array"],
        ["s = append(s, x)", "In place if len < cap, else new array. Always reassign."],
        ["a[lo:hi:max]", "cap = max - lo; forces the next append to copy"],
        ["copy(dst, src)", "Copies min(len) elements; size dst with make first"],
        ["nil map", "Reads return zero values; writes panic"],
        ["v, ok := m[k]", "Missing key vs zero value; iteration order is random"],
      ],
    },
    {
      title: "Methods and interfaces",
      items: [
        ["Value receiver", "Works on a copy; in the method set of T and *T"],
        ["Pointer receiver", "Can mutate; only in the method set of *T"],
        ["Interface value", "(type, value) pair; nil only if both are nil"],
        ["x.(T) / x, ok := x.(T)", "Panics on mismatch / reports ok"],
        ["Embedding", "Promotes fields and methods; no virtual dispatch"],
      ],
    },
    {
      title: "Errors and defer",
      items: [
        ["fmt.Errorf(\"ctx: %w\", err)", "Wrap with context (%v breaks the chain)"],
        ["errors.Is(err, ErrX)", "Match a sentinel anywhere in the chain"],
        ["errors.As(err, &target)", "Find an error of a type in the chain"],
        ["defer f(x)", "x evaluated now; call runs at return, LIFO"],
        ["Named results", "Deferred closures can change them after return"],
        ["recover()", "Only in a deferred call, only for the same goroutine"],
      ],
    },
    {
      title: "Channels and select",
      items: [
        ["make(chan T)", "Unbuffered: send waits for a receiver"],
        ["make(chan T, n)", "Buffered: send waits only when full"],
        ["close(ch)", "Sender closes once; receivers drain then get zero, ok=false"],
        ["Send on closed / double close", "Panic"],
        ["nil channel", "Blocks forever; disables a select case"],
        ["select", "Random among ready cases; default = non-blocking"],
      ],
    },
    {
      title: "sync and context",
      items: [
        ["sync.WaitGroup", "Add before go, defer Done, Wait (Go 1.25: wg.Go)"],
        ["sync.Mutex", "Zero value ready; pointer receivers; not re-entrant"],
        ["sync.Once / atomic.Int64", "One-time init / lock-free counters"],
        ["ctx first param", "Always call cancel(); WithValue only for request-scoped data"],
        ["errgroup.WithContext", "Fan out, first error cancels the rest"],
        ["go test -race", "Finds races that happen during the run"],
      ],
    },
    {
      title: "Runtime and services",
      items: [
        ["G-M-P", "Goroutines on threads via GOMAXPROCS processors, work stealing"],
        ["Escape analysis", "go build -gcflags=-m; &local escapes to the heap"],
        ["GOGC / GOMEMLIMIT", "GC frequency vs memory / soft memory cap"],
        ["Shutdown", "NotifyContext → srv.Shutdown(ctx) → drain → close deps"],
        ["Timeouts", "http.Server ReadHeaderTimeout, http.Client Timeout, contexts"],
        ["Breaking change", "New major version: module path /v2"],
      ],
    },
  ],

  config: {
    quest: { length: 8 },
    boss: { questions: 25, minutes: 30 },
    examModes: [
      { id: "full", name: "Full mock interview", icon: "🎤", questions: 30, unscored: 0, minutes: 45, full: true },
      { id: "quick", name: "Quick screen", icon: "⚡", questions: 15, unscored: 0, minutes: 20, full: false },
    ],
  },

  boss: { name: "The Deadlocked Gopher Golem", emoji: "🗿" },
  matchLabel: "Go built-ins & packages",
  levelTitles: [
    "Gopher Hatchling",
    "Zero-Value Scout",
    "Slice Wrangler",
    "Map Keeper",
    "Interface Weaver",
    "Error Wrapper",
    "Goroutine Herder",
    "Channel Master",
    "Scheduler Whisperer",
    "Gopher Prime",
  ],
});
