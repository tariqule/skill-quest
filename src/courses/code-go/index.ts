import { defineCourse, withQuestions } from "@/engine/define";
import { codeGames } from "./games";
import { moreQuestions } from "./more";
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
  tagline: "Guess what the code prints, find the bug, and explain why. Covers slices, interfaces, errors, goroutines, channels and the runtime, starting from your very first line of Go.",
  level: "Intermediate",
  storageKey: "course:code-go:v1",

  domains: withQuestions([d1, d2, d3, d4], [...moreQuestions, ...codeGames]),

  exam: {
    questions: 30,
    unscored: 0,
    minutes: 45,
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "Pick the one right answer. These are often \"what does this print?\" or \"what happens?\"." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "The question tells you how many to pick. You need every one right to score." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Put the code lines or steps in the order that works." },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair each item with its answer. Every pair has to be right." },
      { id: "lines", icon: "🐞", name: "Bug hunt", rule: "Tap the line (or lines) in the code that cause the bug, the panic or the compile error." },
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
      { icon: "🎤", value: "30", label: "questions", detail: "The full mock interview is 30 mixed questions in 45 minutes, so about 90 seconds each." },
      { icon: "🎯", value: "70", label: "to pass", detail: "Score 70 out of 100 on the mock to pass. Every question counts, and none are left unscored." },
      { icon: "🔮", value: "Predict", label: "the output", detail: "Go phone screens love short bits of code about slices, defer and interfaces. The traps are well known, so learn them by name." },
      { icon: "⚡", value: "Concurrency", label: "is central", detail: "Expect goroutines, channels, select and context in almost every Go interview, often as a bug hunt or a design discussion." },
      { icon: "🗣️", value: "Why", label: "matters most", detail: "Interviewers care about how you reason: who owns a channel, how a goroutine ends, what allocates memory, and what can race." },
      { icon: "🐹", value: "1.25", label: "modern Go", detail: "The code assumes Go 1.25, and anything that changed between versions (like per-iteration loop variables in 1.22) is pointed out. Most snippets leave out package main and the imports when they're obvious." },
    ],
    candidate: {
      is: [
        "Getting ready for a backend, platform, SRE or infrastructure interview that uses Go",
        "New to Go and wanting a gentle start, or already writing it and curious why it behaves the way it does",
        "Wanting to practise \"what does this print?\" and bug-hunt questions on slices, interfaces and concurrency",
        "Brushing up on the runtime and service design topics that come up for senior and staff roles",
      ],
      isNot: [
        "A data structures and algorithms course",
        "About a framework such as Gin, Echo, gRPC code generation or an ORM",
        "A tour of every standard library package",
        "A tour of the runtime's source code beyond what interviews usually ask",
      ],
    },
    scope: {
      label: "Topics covered",
      groups: [
        { category: "Basics", icon: "🧱", services: ["Zero values", "var and :=", "Shadowing", "Untyped constants", "range over int"] },
        { category: "Data", icon: "📚", services: ["Arrays and slices", "append & capacity", "Full slice expressions", "Maps", "Strings, bytes, runes"] },
        { category: "Types", icon: "🏛️", services: ["Methods & receivers", "Method sets", "Embedding", "Interfaces", "Type switches", "Nil interfaces"] },
        { category: "Errors", icon: "🧯", services: ["%w wrapping", "errors.Is / errors.As", "errors.Join", "defer", "panic / recover"] },
        { category: "Concurrency", icon: "⚡", services: ["Goroutines", "WaitGroup", "Channels", "select", "context", "Mutex / RWMutex", "Once / atomic", "-race"] },
        { category: "Generics", icon: "🧬", services: ["Type parameters", "any / comparable", "cmp.Ordered", "~T constraints"] },
        { category: "Runtime", icon: "⚙️", services: ["G-M-P scheduler", "Preemption", "Escape analysis", "GC, GOGC, GOMEMLIMIT", "sync.Pool"] },
        { category: "Services", icon: "🚀", services: ["Graceful shutdown", "Timeouts", "Worker pools", "errgroup", "pprof", "Module versions"] },
      ],
    },
    tips: [
      { icon: "✏️", tip: "For slice questions, draw the backing array and mark each slice as a window onto it. Before every append, ask \"is len less than cap?\"." },
      { icon: "🗣️", tip: "Whenever you write `go`, say how the goroutine ends and who closes each channel. Leaked goroutines are the bug interviewers look for." },
      { icon: "🧯", tip: "Handle every error right where it's returned, and wrap it with context using %w. Never compare error messages as strings." },
      { icon: "🕳️", tip: "Name the classic traps out loud when you spot them: writing to a nil map, an interface holding a nil pointer, defer inside a loop, or a value receiver on a type with a mutex." },
      { icon: "🧪", tip: "Mention the tools: go vet, go test -race, benchmarks with -benchmem, and pprof. It shows you've run Go in production." },
      { icon: "⚖️", tip: "For design questions, put a limit on everything: a timeout on every call, a cap on how much runs at once, and a deadline on shutdown." },
    ],
    officialPractice: { label: "A Tour of Go (go.dev)", url: "https://go.dev/tour/" },
  },

  cheatsheet: [
    {
      title: "Slices and maps",
      items: [
        ["Array and slice", "[4]int is a value that gets copied; []int is a header (pointer, len, cap) over an array"],
        ["s = append(s, x)", "Writes in place if there's spare capacity, otherwise makes a new array. Always reassign."],
        ["a[lo:hi:max]", "cap = max - lo; forces the next append to copy"],
        ["copy(dst, src)", "Copies as many as fit in the shorter one; size dst with make first"],
        ["nil map", "Reads return zero values; writes panic"],
        ["v, ok := m[k]", "Tells a missing key from a zero value; looping order is random"],
      ],
    },
    {
      title: "Methods and interfaces",
      items: [
        ["Value receiver", "Works on a copy; in the method sets of both T and *T"],
        ["Pointer receiver", "Can change the original; only in the method set of *T"],
        ["Interface value", "Holds a type and a value; nil only if both are empty"],
        ["x.(T) / x, ok := x.(T)", "The first panics on a mismatch; the second reports it in ok"],
        ["Embedding", "Lifts fields and methods up; it isn't inheritance"],
      ],
    },
    {
      title: "Errors and defer",
      items: [
        ["fmt.Errorf(\"ctx: %w\", err)", "Wrap with context (%v breaks the chain)"],
        ["errors.Is(err, ErrX)", "Match a sentinel anywhere in the chain"],
        ["errors.As(err, &target)", "Find an error of a type in the chain"],
        ["defer f(x)", "x is worked out now; the call runs at return, last in first out"],
        ["Named results", "Deferred closures can change them after return"],
        ["recover()", "Only in a deferred call, only for the same goroutine"],
      ],
    },
    {
      title: "Channels and select",
      items: [
        ["make(chan T)", "Unbuffered: send waits for a receiver"],
        ["make(chan T, n)", "Buffered: send waits only when full"],
        ["close(ch)", "The sender closes once; receivers read what's left, then get zero with ok false"],
        ["Send on closed / double close", "Panic"],
        ["nil channel", "Blocks forever; disables a select case"],
        ["select", "Picks a ready case at random; a default case means it never waits"],
      ],
    },
    {
      title: "sync and context",
      items: [
        ["sync.WaitGroup", "Add before go, defer Done, Wait (Go 1.25: wg.Go)"],
        ["sync.Mutex", "Ready to use as is; use pointer receivers; don't lock twice from one goroutine"],
        ["sync.Once / atomic.Int64", "Run setup once / counters with no lock"],
        ["ctx first param", "Always call cancel(); WithValue only for request-scoped data"],
        ["errgroup.WithContext", "Fan out, first error cancels the rest"],
        ["go test -race", "Finds races that happen during the run"],
      ],
    },
    {
      title: "Runtime and services",
      items: [
        ["G-M-P", "Goroutines run on threads through GOMAXPROCS processor slots, with work stealing"],
        ["Escape analysis", "go build -gcflags=-m; &local escapes to the heap"],
        ["GOGC / GOMEMLIMIT", "Trade GC frequency for memory / set a soft memory cap"],
        ["Shutdown", "NotifyContext, then srv.Shutdown(ctx), let work drain, then close dependencies"],
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
