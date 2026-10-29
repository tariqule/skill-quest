import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { go } from "../go";
import { SchedulerBoard } from "../visuals";

/** Module 4: generics, the runtime (scheduler, GC, escape analysis), and production service design. */
export default defineDomain({
  domain: {
    id: "d4",
    number: 4,
    name: "Generics, Runtime & Services",
    world: "The Runtime Foundry",
    weight: 20,
    emoji: "🏭",
    color: "#34d399",
    summary: "Type parameters and constraints, the G-M-P scheduler, garbage collection and escape analysis, and how to build, tune, and ship production Go services.",
  },

  tasks: [
    {
      id: "4.1",
      title: "Generics",
      covers: ["Type parameters and inference", "Constraints: any, comparable, cmp.Ordered", "~T and union constraints", "Generics vs interfaces"],
    },
    {
      id: "4.2",
      title: "The runtime",
      covers: ["G, M, P and work stealing", "Syscalls and preemption", "Escape analysis and allocation", "GC tuning: GOGC, GOMEMLIMIT, sync.Pool"],
    },
    {
      id: "4.3",
      title: "Production services",
      covers: ["Graceful shutdown", "Timeouts on servers and clients", "Profiling with pprof", "Modules and major versions"],
    },
  ],

  lessons: [
    {
      id: "d4-generics",
      level: "intermediate",
      task: "4.1",
      title: "Type parameters and constraints",
      check: ["d4-01", "d4-03"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="go"
            code={go`
              // A constraint is an interface listing allowed types (and/or methods).
              type Number interface{ ~int | ~int64 | ~float64 }

              func Sum[T Number](xs []T) T {
                  var total T
                  for _, x := range xs {
                      total += x
                  }
                  return total
              }

              Sum([]float64{1.5, 2})  // T inferred as float64
              slices.Max([]int{3, 9}) // stdlib generics use cmp.Ordered
            `}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🌐", title: "any", text: "No operations beyond assignment and passing around", color: "#34d399" },
              { icon: "⚖️", title: "comparable", text: "Allows `==` and `!=`; required for map keys", color: "#38bdf8" },
              { icon: "📈", title: "cmp.Ordered", text: "Allows `<` `>`: integers, floats, strings", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "Type parameters go in square brackets: `func Map[T, U any](…)`. Arguments are usually inferred from the call.",
        "The constraint decides which operators you may use. With `any` you can't use `<` or `+`.",
        "`~int` means \"any type whose underlying type is int\", so named types like `type Celsius float64` qualify.",
        "Generics shine for containers and algorithms over many types. If you only call methods, a plain interface is simpler.",
      ],
      tip: "Mention the standard `slices`, `maps`, and `cmp` packages. Using them instead of hand-written loops shows you know modern Go.",
    },
    {
      id: "d4-scheduler",
      level: "senior",
      task: "4.2",
      title: "The scheduler: G, M, and P",
      check: ["d4-07", "d4-11"],
      visual: <SchedulerBoard />,
      points: [
        "G is a goroutine, M an OS thread, P a processor slot with a local run queue. An M needs a P to run Go code; there are GOMAXPROCS Ps.",
        "Goroutines start with a small stack (a few KB) that grows as needed, which is why you can run hundreds of thousands.",
        "An idle P steals work from other Ps' run queues and checks the global queue.",
        "A blocking syscall keeps its M, and the P moves to another M. Network I/O instead parks the goroutine on the netpoller.",
        "Since Go 1.14 the runtime can preempt goroutines asynchronously, so a tight loop can't starve the others.",
      ],
      tip: "Explain M:N scheduling in one breath: \"many goroutines multiplexed onto a few threads, one runnable queue per P, work stealing to balance\".",
    },
    {
      id: "d4-memory",
      level: "senior",
      task: "4.2",
      title: "Escape analysis and the GC",
      check: ["d4-13", "d4-16"],
      visual: (
        <div className="grid gap-4">
          <CodeCompare
            lang="go"
            tone="neutral"
            left={{
              title: "Stays on the stack",
              code: go`
                func sum(xs []int) int {
                    total := 0 // doesn't outlive sum
                    for _, x := range xs {
                        total += x
                    }
                    return total
                }
              `,
            }}
            right={{
              title: "Escapes to the heap",
              code: go`
                func newUser(name string) *User {
                    u := User{Name: name}
                    return &u // outlives the call
                }
                // go build -gcflags=-m shows:
                // moved to heap: u
              `,
            }}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🎚️", title: "GOGC", text: "Heap growth before the next GC, as a percent of live heap (default 100)", color: "#34d399" },
              { icon: "🧱", title: "GOMEMLIMIT", text: "Soft memory limit: the GC works harder as total memory nears it", color: "#f59e0b" },
              { icon: "♻️", title: "sync.Pool", text: "Reuse short-lived objects to cut allocations", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "The compiler's escape analysis decides stack vs heap. Returning `&local` is safe: the value simply moves to the heap.",
        "Heap allocations cost GC work. Fewer, larger, preallocated allocations (`make([]T, 0, n)`) are cheaper.",
        "Go's GC is concurrent, non-moving, tri-color mark-and-sweep, tuned for short pauses rather than maximum throughput.",
        "GOGC trades memory for CPU; GOMEMLIMIT (Go 1.19+) caps memory in containers. Measure with pprof before tuning.",
      ],
      tip: "Before any performance claim, say \"I'd profile first\" and name the tool: `go test -bench . -benchmem`, `pprof`, `-gcflags=-m`.",
    },
    {
      id: "d4-services",
      level: "staff",
      task: "4.3",
      title: "Production Go services",
      check: ["d4-18", "d4-20"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#34d399"
            steps={[
              { icon: "📶", label: "SIGTERM", sub: "signal.NotifyContext" },
              { icon: "🚧", label: "Stop accepting", sub: "fail readiness, srv.Shutdown(ctx)" },
              { icon: "⏳", label: "Drain", sub: "in-flight work finishes or hits the deadline" },
              { icon: "🧹", label: "Clean up", sub: "flush telemetry, close DB pools" },
            ]}
          />
          <CodeBlock
            lang="go"
            code={go`
              ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
              defer stop()

              srv := &http.Server{Addr: ":8080", Handler: mux, ReadHeaderTimeout: 5 * time.Second}
              go func() { _ = srv.ListenAndServe() }()

              <-ctx.Done() // wait for a signal
              shutdownCtx, cancel := context.WithTimeout(context.Background(), 20*time.Second)
              defer cancel()
              _ = srv.Shutdown(shutdownCtx) // stop accepting, drain in-flight requests
            `}
          />
        </div>
      ),
      points: [
        "Graceful shutdown: catch SIGTERM, stop taking work, drain with a deadline, then close dependencies.",
        "Put timeouts everywhere: `http.Server` (e.g. `ReadHeaderTimeout`), `http.Client{Timeout: …}`, and contexts on outbound calls.",
        "Bound concurrency with worker pools or semaphores so bursts turn into backpressure, not outages.",
        "Expose `net/http/pprof` on an internal-only port; use CPU, heap, goroutine, mutex, and block profiles.",
        "Breaking API changes need a new major version: module path `example.com/lib/v2`.",
      ],
      tip: "For a \"design a Go service\" question, walk the lifecycle: config, startup, request path with context and timeouts, observability, shutdown.",
    },
  ],

  questions: [
    {
      id: "d4-01",
      domain: "d4",
      level: "junior",
      lesson: "d4-generics",
      prompt: "What does this print?",
      code: go`
        func Map[T, U any](xs []T, f func(T) U) []U {
            out := make([]U, 0, len(xs))
            for _, x := range xs {
                out = append(out, f(x))
            }
            return out
        }

        func main() {
            sq := Map([]int{1, 2, 3}, func(n int) string { return strconv.Itoa(n * n) })
            fmt.Println(sq)
        }
      `,
      codeLang: "go",
      options: ["`[1 4 9]`", "`[\"1\" \"4\" \"9\"]`", "`[1 2 3]`", "Compile error: cannot infer `U`"],
      answer: [0],
      explanation: "T is inferred as int from the slice and U as string from the function's return type. `Println` prints a `[]string` without quotes, so it looks like `[1 4 9]`.",
    },
    {
      id: "d4-02",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-generics",
      type: "lines",
      prompt: "This doesn't compile. Tap the line the compiler rejects.",
      code: go`
        func Max[T any](a, b T) T {
            if a > b {
                return a
            }
            return b
        }
      `,
      codeLang: "go",
      answer: [2],
      explanation: "`any` permits no ordering operators, so `a > b` is rejected. Constrain T with `cmp.Ordered` (from the standard `cmp` package), or just use the built-in `max` (Go 1.21+).",
    },
    {
      id: "d4-03",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-generics",
      prompt: "What does this print?",
      code: go`
        type Number interface{ ~int | ~float64 }

        type Celsius float64

        func Sum[T Number](xs ...T) T {
            var s T
            for _, x := range xs {
                s += x
            }
            return s
        }

        func main() { fmt.Println(Sum(Celsius(1.5), Celsius(2))) }
      `,
      codeLang: "go",
      options: ["`3.5`", "Compile error: `Celsius` does not satisfy `Number`", "`3`", "`{3.5}`"],
      answer: [0],
      explanation: "`~float64` accepts any type whose underlying type is float64, so `Celsius` qualifies and T is inferred as Celsius. Without the tilde, only float64 itself would match.",
    },
    {
      id: "d4-04",
      domain: "d4",
      level: "junior",
      lesson: "d4-generics",
      prompt: "Which type can't be used as the type argument for `K` in `func Keys[K comparable, V any](m map[K]V) []K`?",
      options: ["`[]string`", "`string`", "`[4]int`", "`struct{ X, Y int }`"],
      answer: [0],
      explanation: "Slices, maps, and functions aren't comparable with `==`, so they can't be map keys or satisfy `comparable`. Arrays and structs of comparable fields are fine.",
    },
    {
      id: "d4-05",
      domain: "d4",
      level: "senior",
      lesson: "d4-generics",
      prompt: "When is an ordinary interface parameter a better choice than a type parameter?",
      options: [
        "When the function only calls methods on the value and doesn't need to return or store the concrete type",
        "Never; generics are always faster",
        "When the function needs `+` or `<` on its arguments",
        "When the function returns a slice of the same element type it received",
      ],
      answer: [0],
      explanation:
        "`func Write(w io.Writer)` is simpler than `func Write[W io.Writer](w W)` and loses nothing. Type parameters earn their keep when the type flows through: containers, `slices.Sort`, `Map`, or operators that interfaces can't express.",
    },
    {
      id: "d4-06",
      domain: "d4",
      level: "junior",
      lesson: "d4-scheduler",
      prompt: "What does `GOMAXPROCS` control?",
      options: [
        "How many OS threads can execute Go code at the same time (the number of Ps); it defaults to the CPUs available",
        "The maximum number of goroutines",
        "The maximum heap size",
        "Only the number of garbage-collector threads",
      ],
      answer: [0],
      explanation: "Goroutines are unlimited; GOMAXPROCS caps parallel execution of Go code. Threads blocked in syscalls don't count. In Go 1.25 the default on Linux also respects container CPU limits.",
    },
    {
      id: "d4-07",
      domain: "d4",
      level: "junior",
      lesson: "d4-scheduler",
      prompt: "Why can a Go program run hundreds of thousands of goroutines when it couldn't run that many OS threads?",
      options: [
        "Goroutines start with a small stack (a few KB) that grows on demand, and the runtime multiplexes them onto a few threads",
        "Each goroutine shares the main goroutine's stack",
        "Goroutines only run one at a time",
        "The OS gives Go special lightweight threads",
      ],
      answer: [0],
      explanation: "OS threads typically reserve large fixed stacks and are scheduled by the kernel. Goroutines are scheduled in user space by the Go runtime, and their stacks start tiny and grow or shrink.",
    },
    {
      id: "d4-10",
      domain: "d4",
      level: "senior",
      lesson: "d4-scheduler",
      type: "match",
      prompt: "Match each scheduler term to its meaning.",
      pairs: [
        ["G", "A goroutine: its stack, instruction pointer, and status"],
        ["M", "An OS thread that executes Go code"],
        ["P", "A processor slot with a local run queue; there are GOMAXPROCS of them"],
        ["Work stealing", "An idle P takes runnable goroutines from another P's queue"],
        ["Netpoller", "Parks goroutines waiting on network I/O without tying up a thread"],
      ],
      explanation: "An M must hold a P to run Gs. Per-P queues avoid a global lock, stealing balances the load, and the netpoller lets thousands of idle connections cost almost nothing.",
    },
    {
      id: "d4-11",
      domain: "d4",
      level: "senior",
      lesson: "d4-scheduler",
      prompt: "A goroutine makes a blocking system call, such as a file read. What does the scheduler do?",
      options: [
        "The thread (M) blocks in the syscall, and its P is handed to another M so the P's other goroutines keep running",
        "Every goroutine on that P waits until the syscall returns",
        "The whole program pauses",
        "The goroutine is permanently converted into an OS thread",
      ],
      answer: [0],
      explanation: "Handing off the P keeps GOMAXPROCS worth of Go code running. When the syscall returns, the goroutine tries to get a P again or goes onto a run queue.",
    },
    {
      id: "d4-12",
      domain: "d4",
      level: "senior",
      lesson: "d4-scheduler",
      prompt: "Since Go 1.14, what happens to a goroutine running a tight loop with no function calls, like `for { i++ }`?",
      options: [
        "The runtime can preempt it asynchronously (using signals), so it can't starve other goroutines or stall the GC indefinitely",
        "It runs until it finishes, starving the other goroutines on its P",
        "The compiler rejects loops without function calls",
        "It's moved to a dedicated OS thread",
      ],
      answer: [0],
      explanation: "Before 1.14, preemption happened only at function calls and similar safe points, so such loops could block GC stop-the-world phases. Asynchronous preemption fixed that.",
    },
    {
      id: "d4-08",
      domain: "d4",
      level: "junior",
      lesson: "d4-memory",
      prompt: "What kind of garbage collector does Go use?",
      options: [
        "A concurrent, non-moving, tri-color mark-and-sweep collector",
        "Reference counting with cycle detection",
        "A stop-the-world copying collector",
        "None; you free memory manually",
      ],
      answer: [0],
      explanation: "Marking runs concurrently with your goroutines (with brief stop-the-world phases), and objects aren't moved, so pointers stay valid. The design targets low latency.",
    },
    {
      id: "d4-13",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-memory",
      prompt: "Is this function safe, and where does `n` live?",
      code: go`
        func newCounter() *int {
            n := 0
            return &n
        }
      `,
      codeLang: "go",
      options: [
        "Safe: escape analysis sees that `&n` outlives the call and allocates `n` on the heap",
        "Unsafe: it returns a dangling pointer to the stack, like in C",
        "Compile error: cannot return the address of a local variable",
        "Safe, because `n` is copied when the function returns",
      ],
      answer: [0],
      explanation: "Go is garbage collected and the compiler decides placement. Run `go build -gcflags=-m` to see \"moved to heap: n\".",
    },
    {
      id: "d4-14",
      domain: "d4",
      level: "staff",
      lesson: "d4-memory",
      prompt: "A Go service in a 2 GiB container is OOM-killed during traffic spikes, though its live heap is about 600 MiB. Which setting is designed for this?",
      options: [
        "Set `GOMEMLIMIT` (for example to about 1.8GiB) so the GC collects more aggressively as total memory nears the limit",
        "Set `GOGC=off`",
        "Call `runtime.GC()` every second from a goroutine",
        "Raise `GOMAXPROCS`",
      ],
      answer: [0],
      explanation:
        "With GOGC=100 the heap may grow to about twice the live heap before the next cycle, and spikes push past the container limit. GOMEMLIMIT (Go 1.19+) is a soft limit the GC respects. Leave headroom for non-heap memory.",
    },
    {
      id: "d4-15",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-memory",
      type: "lines",
      prompt: "For large inputs, profiling shows this function re-allocating and copying its result many times. Tap the line to change.",
      code: go`
        func ids(users []User) []int {
            var out []int
            for _, u := range users {
                out = append(out, u.ID)
            }
            return out
        }
      `,
      codeLang: "go",
      answer: [2],
      explanation: "The final length is known up front. `out := make([]int, 0, len(users))` allocates once, so the appends never have to grow and copy the array.",
    },
    {
      id: "d4-16",
      domain: "d4",
      level: "senior",
      lesson: "d4-memory",
      prompt: "Which usually make a local value escape to the heap? (Choose two.)",
      options: [
        "Returning a pointer to it",
        "Storing a pointer to it in a global or in something that outlives the function",
        "Declaring it with `var` instead of `:=`",
        "Passing it by value to another function",
        "Using it inside a `for` loop",
      ],
      answer: [0, 1],
      explanation: "A value escapes when the compiler can't prove it's dead once the function returns. Declaration style, loops, and pass-by-value copies don't cause that.",
    },
    {
      id: "d4-17",
      domain: "d4",
      level: "senior",
      lesson: "d4-memory",
      prompt: "What is `sync.Pool` for?",
      options: [
        "Reusing temporary objects (like buffers) to cut allocations and GC pressure; pooled items may be dropped at any GC",
        "A pool of goroutines that runs tasks",
        "A database connection pool",
        "A long-lived cache whose entries must never be lost",
      ],
      answer: [0],
      explanation: "Pool is a per-P free list of interchangeable objects. Reset objects before putting them back, and never store anything you need to keep: the GC may clear the pool.",
    },
    {
      id: "d4-09",
      domain: "d4",
      level: "junior",
      lesson: "d4-services",
      type: "match",
      prompt: "Match each tool to what it does.",
      pairs: [
        ["`go test -race`", "Detects data races while the tests run"],
        ["`go vet`", "Reports suspicious code like copied locks or bad Printf verbs"],
        ["`pprof`", "Profiles CPU, heap, goroutines, and contention"],
        ["`go build -gcflags=-m`", "Prints escape-analysis and inlining decisions"],
        ["`go mod tidy`", "Adds missing and removes unused module requirements"],
      ],
      explanation: "These all ship with the Go toolchain. A solid CI runs `go vet` and `go test -race` on every change.",
    },
    {
      id: "d4-18",
      domain: "d4",
      level: "staff",
      lesson: "d4-services",
      type: "order",
      prompt: "Order the steps of a graceful shutdown for a Go HTTP service running in Kubernetes.",
      items: [
        "Receive SIGTERM (e.g. via `signal.NotifyContext`)",
        "Stop taking new work: fail readiness checks and call `srv.Shutdown(ctx)` with a deadline",
        "Let in-flight requests and background workers finish, or cancel them when the deadline passes",
        "Flush and close dependencies: queues, telemetry exporters, database pools",
        "Exit the process",
      ],
      explanation: "Shutdown closes listeners and waits for active connections to go idle. Closing dependencies before draining would fail in-flight requests, and exiting early drops them.",
    },
    {
      id: "d4-19",
      domain: "d4",
      level: "staff",
      lesson: "d4-services",
      type: "lines",
      prompt: "When the price service hangs, goroutines calling this pile up for minutes. Tap the line responsible.",
      code: go`
        func fetchPrice(sku string) (float64, error) {
            resp, err := http.Get("https://prices.internal/" + sku)
            if err != nil {
                return 0, err
            }
            defer resp.Body.Close()
            var p Price
            err = json.NewDecoder(resp.Body).Decode(&p)
            return p.Value, err
        }
      `,
      codeLang: "go",
      answer: [2],
      explanation:
        "`http.Get` uses `http.DefaultClient`, which has no timeout. Use a shared `&http.Client{Timeout: …}` and build the request with `http.NewRequestWithContext(ctx, …)` so callers' deadlines apply too.",
    },
    {
      id: "d4-20",
      domain: "d4",
      level: "staff",
      lesson: "d4-services",
      prompt: "Your team's widely used module `example.com/billing` (v1.8.0) needs a breaking API change. What does Go's module system expect?",
      options: [
        "Release a new major version whose module path ends in `/v2` (`example.com/billing/v2`), so v1 and v2 can coexist in one build",
        "Tag it v1.9.0; `go get` will warn consumers",
        "Delete the v1 tags and re-tag the new code as v1.0.0",
        "Ask every consumer to add a `replace` directive",
      ],
      answer: [0],
      explanation:
        "Semantic import versioning: v2+ lives at a different import path, so upgrades are explicit and gradual. Deleting or moving published tags breaks builds, because the module proxy and checksum database already recorded them.",
    },
    {
      id: "d4-21",
      domain: "d4",
      level: "staff",
      lesson: "d4-services",
      prompt: "After a deploy, a Go service's p99 latency doubled but CPU usage is flat. Which profiles best show where goroutines are waiting on locks and channels?",
      options: [
        "The mutex and block profiles (enable with `runtime.SetMutexProfileFraction` and `runtime.SetBlockProfileRate`)",
        "The heap profile",
        "`go vet`",
        "Only the CPU profile",
      ],
      answer: [0],
      explanation: "A CPU profile shows where time is spent running, not waiting. Mutex and block profiles (plus a goroutine dump) show contention and blocking. They're off by default and enabled with those calls.",
    },
    {
      id: "d4-22",
      domain: "d4",
      level: "staff",
      lesson: "d4-services",
      prompt: "How should a production Go service expose `net/http/pprof`?",
      options: [
        "On a separate internal-only listener or admin port, never on the public router, so on-call can pull profiles on demand",
        "On the public API port, so anyone debugging can reach it",
        "Not at all; profile only in staging",
        "Build production binaries with `-race` and read its output instead",
      ],
      answer: [0],
      explanation:
        "Importing net/http/pprof registers handlers on `http.DefaultServeMux`, which exposes internals if that mux is public. Profiling production is valuable and cheap; the race detector adds large overhead and isn't a profiler.",
    },
  ],

  cards: [
    { id: "c4-ordered", domain: "d4", kind: "service", term: "cmp.Ordered", definition: "Constraint for types that support < and >: integers, floats, and strings (and types based on them)." },
    { id: "c4-comparable", domain: "d4", kind: "service", term: "comparable", definition: "Built-in constraint for types that support == and !=. Required for generic map keys." },
    { id: "c4-gomaxprocs", domain: "d4", kind: "service", term: "GOMAXPROCS", definition: "Number of Ps: how many threads can run Go code at once. Defaults to available CPUs." },
    { id: "c4-gogc", domain: "d4", kind: "service", term: "GOGC", definition: "GC target: heap growth allowed before the next cycle, as a percent of live heap. Default 100." },
    { id: "c4-gomemlimit", domain: "d4", kind: "service", term: "GOMEMLIMIT", definition: "Soft memory limit (Go 1.19+). The GC runs more often as total memory approaches it." },
    { id: "c4-pool", domain: "d4", kind: "service", term: "sync.Pool", definition: "A cache of reusable temporary objects to reduce allocation. Contents may vanish at any GC." },
    { id: "c4-pprof", domain: "d4", kind: "service", term: "net/http/pprof", definition: "Registers HTTP handlers that serve CPU, heap, goroutine, mutex, and block profiles." },
    { id: "c4-notify", domain: "d4", kind: "service", term: "signal.NotifyContext", definition: "Returns a context cancelled when the process gets one of the listed signals, e.g. SIGTERM." },
    { id: "c4-shutdown", domain: "d4", kind: "service", term: "http.Server.Shutdown", definition: "Stops accepting connections and waits for active ones to finish, until the context ends." },
    { id: "c4-escape", domain: "d4", kind: "concept", term: "Escape analysis", definition: "Compile-time analysis that keeps values on the stack unless they might outlive the function." },
    { id: "c4-gmp", domain: "d4", kind: "concept", term: "G-M-P model", definition: "Goroutines (G) run on OS threads (M) that hold processors (P) with local run queues." },
    { id: "c4-tilde", domain: "d4", kind: "concept", term: "~T constraint", definition: "Matches every type whose underlying type is T, e.g. ~float64 includes type Celsius float64." },
    { id: "c4-siv", domain: "d4", kind: "concept", term: "Semantic import versioning", definition: "Major versions 2+ of a module use a /vN suffix in the module path, so they can coexist." },
  ],
});
