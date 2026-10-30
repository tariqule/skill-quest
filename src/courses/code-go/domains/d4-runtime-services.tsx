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
    summary: "Generics and constraints, how the scheduler runs goroutines, garbage collection and escape analysis, and how to build, tune and ship Go services in production.",
  },

  tasks: [
    {
      id: "4.1",
      title: "Generics",
      covers: ["Type parameters and inference", "Constraints: any, comparable, cmp.Ordered", "~T and union constraints", "Choosing between generics and interfaces"],
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
      id: "d4-start-tools",
      level: "beginner",
      task: "4.3",
      title: "Packages, modules and the go command",
      check: ["go-b4-01", "go-b4-02"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#34d399"
            steps={[
              { icon: "📁", label: "go mod init", sub: "Creates go.mod, naming your project" },
              { icon: "▶️", label: "go run .", sub: "Builds and runs it in one step" },
              { icon: "📦", label: "go build", sub: "Makes a program file you can ship" },
              { icon: "🧪", label: "go test", sub: "Runs your tests" },
            ]}
          />
          <CodeBlock
            lang="go"
            code={go`
              package main

              import (
                  "fmt"      // from Go's standard library
                  "strings"
              )

              func main() {
                  fmt.Println(strings.ToUpper("hello"))   // HELLO
              }
            `}
          />
        </div>
      ),
      points: [
        "A **package** is a folder of Go files that belong together, like a drawer of related tools. `fmt` and `strings` are packages that come with Go.",
        "`import` lets your file use another package. You then call its functions with the package name and a dot, as in `strings.ToUpper`.",
        "A **module** is your whole project. `go mod init example.com/hello` creates a `go.mod` file that names it and records what it depends on.",
        "The `go` command does the everyday jobs: `go run` to try your code, `go build` to make a program file, and `go test` to run tests.",
      ],
      tip: "Only names that start with a capital letter can be used from another package. That's why it's `fmt.Println`, with a capital P.",
    },
    {
      id: "d4-start-generics",
      level: "beginner",
      task: "4.1",
      title: "One function for many types",
      check: ["go-b4-03", "go-b4-04"],
      visual: (
        <CodeBlock
          lang="go"
          code={go`
            // T is a placeholder for "some type", chosen by the caller.
            func First[T any](xs []T) T {
                return xs[0]
            }

            fmt.Println(First([]string{"a", "b"}))  // a
            fmt.Println(First([]int{7, 8}))         // 7
          `}
        />
      ),
      points: [
        "Sometimes you want the same function for many types, like \"give me the first item\" for a list of names or a list of numbers.",
        "**Generics** let you write it once. `[T any]` after the function name says \"T stands for some type, to be filled in later\".",
        "When you call `First([]int{7, 8})`, Go works out that T is `int` this time, all by itself.",
        "The word after T, here `any`, is the **constraint**: it says which types are allowed. `any` means every type.",
      ],
      tip: "Think of T like a blank on a form. Each call fills in the blank with a real type, and Go still checks the types for you.",
    },
    {
      id: "d4-start-server",
      level: "beginner",
      task: "4.3",
      title: "A tiny web server",
      check: ["go-b4-05", "go-b4-06"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="go"
            code={go`
              func hello(w http.ResponseWriter, r *http.Request) {
                  fmt.Fprintln(w, "Hello from Go!")   // write the reply
              }

              func main() {
                  http.HandleFunc("/hello", hello)    // this path, this function
                  http.ListenAndServe(":8080", nil)   // start listening
              }
            `}
          />
          <Flow
            color="#34d399"
            steps={[
              { icon: "🌐", label: "Browser asks", sub: "localhost:8080/hello" },
              { icon: "🔀", label: "Server matches the path", sub: "/hello goes to the hello function" },
              { icon: "💬", label: "Function writes a reply", sub: "Hello from Go!" },
            ]}
          />
        </div>
      ),
      points: [
        "Go's standard library includes `net/http`, so you can build a working web server with no extra downloads.",
        "A **handler** is a function that answers one kind of request. It gets `w` to write the reply and `r` with details of the request.",
        "`http.HandleFunc(\"/hello\", hello)` says \"when someone visits /hello, run the hello function\". It works like a receptionist directing visitors.",
        "`http.ListenAndServe(\":8080\", nil)` starts the server on port 8080 and keeps it running, waiting for visitors.",
      ],
      tip: "Each incoming request is handled in its own goroutine, so a Go server can look after many visitors at the same time without any extra work from you.",
    },
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
              { icon: "🌐", title: "any", text: "Any type at all, but you can only store and pass it around", color: "#34d399" },
              { icon: "⚖️", title: "comparable", text: "Allows `==` and `!=`. Needed for map keys", color: "#38bdf8" },
              { icon: "📈", title: "cmp.Ordered", text: "Allows `<` and `>`: integers, floats and strings", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "**Type parameters** go in square brackets, as in `func Map[T, U any](…)`. Go usually works out the types from the call, so you rarely write them.",
        "The **constraint** decides which operators you may use. With `any`, you can't use `<` or `+`.",
        "`~float64` means \"any type built on float64\", so your own named types, like `type Celsius float64`, count too.",
        "Generics are best for containers and algorithms that work across many types. If you only call methods on a value, a plain interface is simpler.",
      ],
      tip: "Mention the standard `slices`, `maps` and `cmp` packages. Using them instead of hand-written loops shows you know modern Go.",
    },
    {
      id: "d4-scheduler",
      level: "senior",
      task: "4.2",
      title: "The scheduler: G, M, and P",
      check: ["d4-07", "d4-11"],
      visual: <SchedulerBoard />,
      points: [
        "**G** is a goroutine, **M** is an operating system thread, and **P** is a processor slot with its own queue of goroutines. An M needs a P to run Go code, and there are GOMAXPROCS Ps.",
        "Goroutines start with a tiny stack of a few KB that grows when needed, which is why you can run hundreds of thousands of them.",
        "A P with nothing to do steals goroutines from other Ps' queues, and checks the global queue too.",
        "When a goroutine makes a blocking system call, it keeps its M and the P moves to another M. Network I/O is different: the goroutine is parked on the netpoller and frees its thread.",
        "Since Go 1.14, the runtime can interrupt a goroutine at almost any point, so a tight loop can't hog a P and starve the others.",
      ],
      tip: "Explain Go's scheduling in one breath: \"many goroutines share a few threads, each P has its own queue, and idle Ps steal work to balance the load\".",
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
              { icon: "🎚️", title: "GOGC", text: "How much the heap may grow before the next GC, as a percent of live memory (default 100)", color: "#34d399" },
              { icon: "🧱", title: "GOMEMLIMIT", text: "A soft memory limit: the GC works harder as total memory gets close to it", color: "#f59e0b" },
              { icon: "♻️", title: "sync.Pool", text: "Reuses short-lived objects so you allocate less", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "The compiler's **escape analysis** decides whether a value lives on the stack or the heap. Returning `&local` is safe: the value just moves to the heap.",
        "Every heap allocation adds work for the garbage collector. Fewer, bigger allocations made up front, like `make([]T, 0, n)`, are cheaper.",
        "Go's garbage collector runs alongside your code, never moves objects, and uses a tri-color mark-and-sweep design. It's tuned for short pauses rather than raw throughput.",
        "`GOGC` trades memory for CPU time, and `GOMEMLIMIT` (Go 1.19 and later) keeps memory under a limit in containers. Measure with pprof before you tune either.",
      ],
      tip: "Before any claim about performance, say \"I'd profile first\" and name the tool: `go test -bench . -benchmem`, `pprof`, or `-gcflags=-m`.",
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
              { icon: "🚧", label: "Stop accepting", sub: "Fail readiness checks, call srv.Shutdown(ctx)" },
              { icon: "⏳", label: "Drain", sub: "Work in progress finishes, or hits the deadline" },
              { icon: "🧹", label: "Clean up", sub: "Flush telemetry, close database pools" },
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
        "A **graceful shutdown** catches SIGTERM, stops taking new work, lets current work finish within a deadline, then closes dependencies.",
        "Put timeouts everywhere: on `http.Server` (for example `ReadHeaderTimeout`), on `http.Client{Timeout: …}`, and as contexts on outgoing calls.",
        "Limit how much runs at once with worker pools or semaphores, so a burst of traffic slows things down instead of knocking them over.",
        "Serve `net/http/pprof` on an internal-only port, and use its CPU, heap, goroutine, mutex and block profiles.",
        "A breaking API change needs a new major version, with a module path like `example.com/lib/v2`.",
      ],
      tip: "For a \"design a Go service\" question, walk through its life: config, startup, the request path with contexts and timeouts, observability, and shutdown.",
    },
  ],

  questions: [
    // ───────────── Start here ─────────────
    {
      id: "go-b4-01",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-tools",
      prompt: "What does `go mod init example.com/hello` do?",
      options: [
        "Creates a `go.mod` file that names your module and tracks its dependencies",
        "Downloads and installs Go",
        "Runs your program",
        "Deletes the files in the current folder and starts a brand new empty project there",
      ],
      answer: [0],
      explanation:
        "`go mod init` starts a new module, which is Go's word for a project. It writes a small `go.mod` file with the module's name, and later the list of other modules it needs.",
    },
    {
      id: "go-b4-02",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-tools",
      prompt: "What's the difference between `go run` and `go build`?",
      options: [
        "`go run` compiles and runs right away; `go build` makes a program file you can run later or ship",
        "`go run` only checks your code for errors; `go build` is the one that runs the program",
        "They do exactly the same thing",
        "`go build` runs the tests; `go run` doesn't",
      ],
      answer: [0],
      explanation:
        "`go run` is for trying things out: it builds your code into a temporary program and runs it. `go build` saves the finished program as a file, which is what you'd copy to a server.",
    },
    {
      id: "go-b4-03",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-generics",
      type: "output",
      prompt: "What does this print?",
      code: go`
        func First[T any](xs []T) T {
            return xs[0]
        }

        fmt.Println(First([]string{"a", "b"}), First([]int{7, 8}))
      `,
      codeLang: "go",
      answers: ["a 7"],
      explanation:
        "The same function works for both slices. In the first call T is `string` and it returns \"a\". In the second, T is `int` and it returns 7. `Println` puts a space between them.",
    },
    {
      id: "go-b4-04",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-generics",
      prompt: "In `func First[T any](xs []T) T`, what does `[T any]` mean?",
      options: [
        "T is a placeholder for a type, and any type is allowed",
        "The function takes a slice that is called `any`",
        "T can only be a string",
        "The function returns nothing",
      ],
      answer: [0],
      explanation:
        "The square brackets declare a **type parameter**. T is a stand-in for a real type, and `any` is the constraint saying every type is welcome. Each call fills T in, so `First([]int{...})` uses T as `int`.",
    },
    {
      id: "go-b4-05",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-server",
      prompt: "What does `http.HandleFunc(\"/hello\", hello)` do?",
      options: [
        "Tells the server to run the `hello` function when someone visits the /hello path",
        "Visits the /hello page itself and prints what it finds there to the terminal window",
        "Starts the server on port 8080",
        "Creates a new file called hello",
      ],
      answer: [0],
      explanation:
        "`HandleFunc` connects a path to a handler function, like a receptionist's list of who to send visitors to. It doesn't start anything by itself; `ListenAndServe` does that.",
    },
    {
      id: "go-b4-06",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-server",
      type: "fill",
      prompt: "Fill the gap so the server starts listening on port 8080.",
      code: go`
        http.HandleFunc("/hello", hello)
        http.{{1}}(":8080", nil)
      `,
      codeLang: "go",
      blanks: [{ options: ["ListenAndServe", "Start", "Run", "Open"], answer: 0 }],
      explanation:
        "`http.ListenAndServe` opens the port and keeps serving requests until the program stops. `Start`, `Run` and `Open` aren't functions in the `net/http` package.",
    },
    // ───────────── Interview questions ─────────────
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
      explanation: "Go works out T as int from the slice and U as string from what the function returns. `Println` prints a `[]string` without quotes, so it looks like `[1 4 9]`.",
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
      explanation: "`any` doesn't allow comparisons like `>`, so `a > b` is rejected. Constrain T with `cmp.Ordered` from the standard `cmp` package, or just use the built-in `max` (Go 1.21 and later).",
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
      explanation: "`~float64` accepts any type built on float64, so `Celsius` counts, and T is worked out as Celsius. Without the tilde, only float64 itself would match.",
    },
    {
      id: "d4-04",
      domain: "d4",
      level: "junior",
      lesson: "d4-generics",
      prompt: "Which type can't be used as the type argument for `K` in `func Keys[K comparable, V any](m map[K]V) []K`?",
      options: ["`[]string`", "`string`", "`[4]int`", "`struct{ X, Y int }`"],
      answer: [0],
      explanation: "Slices, maps and functions can't be compared with `==`, so they can't be map keys or satisfy `comparable`. Arrays, and structs whose fields can all be compared, are fine.",
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
        "When the function returns a slice of the same element type that it received as its argument",
      ],
      answer: [0],
      explanation:
        "`func Write(w io.Writer)` is simpler than `func Write[W io.Writer](w W)` and loses nothing. Type parameters are worth it when the type passes through the function: containers, `slices.Sort`, `Map`, or operators that interfaces can't describe.",
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
        "Only the number of garbage-collector threads; the scheduler always runs one OS thread per goroutine regardless of it",
      ],
      answer: [0],
      explanation: "There's no limit on goroutines; GOMAXPROCS caps how much Go code runs truly in parallel. Threads stuck in system calls don't count. From Go 1.25, the default on Linux also respects a container's CPU limit.",
    },
    {
      id: "d4-07",
      domain: "d4",
      level: "junior",
      lesson: "d4-scheduler",
      prompt: "Why can a Go program run hundreds of thousands of goroutines when it couldn't run that many OS threads?",
      options: [
        "Goroutines start with a small stack (a few KB) that grows on demand, and the runtime multiplexes them onto a few threads",
        "Each goroutine shares the main goroutine's stack, so starting one costs nothing extra until it calls a function of its own",
        "Goroutines only run one at a time",
        "The OS gives Go special lightweight threads",
      ],
      answer: [0],
      explanation: "Operating system threads usually reserve large fixed stacks, and the kernel schedules them. Goroutines are scheduled by the Go runtime itself, and their stacks start tiny and grow or shrink as needed.",
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
      explanation: "An M needs a P before it can run any Gs. Giving each P its own queue avoids one big shared lock, stealing keeps the load even, and the netpoller means thousands of idle connections cost almost nothing.",
    },
    {
      id: "d4-11",
      domain: "d4",
      level: "senior",
      lesson: "d4-scheduler",
      prompt: "A goroutine makes a blocking system call, such as a file read. What does the scheduler do?",
      options: [
        "The thread (M) blocks in the syscall, and its P is handed to another M so the P's other goroutines keep running",
        "Every goroutine on that P waits until the syscall returns, since a P can only ever run on the one thread it started with",
        "The whole program pauses",
        "The goroutine is permanently converted into an OS thread",
      ],
      answer: [0],
      explanation: "Handing the P to another thread keeps GOMAXPROCS worth of Go code running. When the system call returns, the goroutine tries to grab a P again, or waits in a run queue.",
    },
    {
      id: "d4-12",
      domain: "d4",
      level: "senior",
      lesson: "d4-scheduler",
      prompt: "Since Go 1.14, what happens to a goroutine running a tight loop with no function calls, like `for { i++ }`?",
      options: [
        "The runtime can preempt it asynchronously (using signals), so it can't starve other goroutines or stall the GC indefinitely",
        "It runs until it finishes, starving the other goroutines on its P, because Go only switches goroutines at function calls or channel operations",
        "The compiler rejects loops without function calls",
        "It's moved to a dedicated OS thread",
      ],
      answer: [0],
      explanation: "Before 1.14, the runtime could only interrupt a goroutine at function calls and similar safe points, so a loop like this could hold up the GC's brief pauses. Being able to interrupt at any point fixed that.",
    },
    {
      id: "d4-08",
      domain: "d4",
      level: "junior",
      lesson: "d4-memory",
      prompt: "What kind of garbage collector does Go use?",
      options: [
        "A concurrent, non-moving, tri-color mark-and-sweep collector",
        "Reference counting, with a periodic cycle detector",
        "A stop-the-world copying collector",
        "None; you free memory manually",
      ],
      answer: [0],
      explanation: "Marking runs alongside your goroutines, with only very short pauses, and objects are never moved, so pointers stay valid. The whole design aims for low latency.",
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
        "Unsafe: it returns a dangling pointer into the stack frame, just like in C",
        "Compile error: cannot return the address of a local variable",
        "Safe, because `n` is copied when the function returns",
      ],
      answer: [0],
      explanation: "Go is garbage collected, and the compiler decides where each value lives. Run `go build -gcflags=-m` and you'll see \"moved to heap: n\".",
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
        "Call `runtime.GC()` every second from a background goroutine, so the heap never gets anywhere near the container's memory limit",
        "Raise `GOMAXPROCS`",
      ],
      answer: [0],
      explanation:
        "With GOGC=100, the heap can grow to about twice the live memory before the next collection, and spikes push it past the container limit. GOMEMLIMIT (Go 1.19 and later) is a soft limit the GC works to stay under. Leave some room for memory outside the heap.",
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
      explanation: "You know the final length before you start. `out := make([]int, 0, len(users))` allocates once, so the appends never have to grow and copy the array.",
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
      explanation: "A value escapes when the compiler can't prove nothing uses it after the function returns. How you declare it, loops, and passing copies by value don't cause that.",
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
        "A long-lived cache whose entries must never be lost, such as parsed config or user sessions shared between requests",
      ],
      answer: [0],
      explanation: "A Pool is a stash of interchangeable spare objects. Reset each object before putting it back, and never store anything you need to keep, because the GC may empty the pool at any time.",
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
      explanation: "These all come with Go. A solid CI setup runs `go vet` and `go test -race` on every change.",
    },
    {
      id: "d4-18",
      domain: "d4",
      level: "staff",
      lesson: "d4-services",
      type: "order",
      prompt: "Put the steps of a graceful shutdown in order, for a Go HTTP service running in Kubernetes.",
      items: [
        "Receive SIGTERM (for example via `signal.NotifyContext`)",
        "Stop taking new work: fail readiness checks and call `srv.Shutdown(ctx)` with a deadline",
        "Let in-flight requests and background workers finish, or cancel them when the deadline passes",
        "Flush and close dependencies: queues, telemetry exporters, database pools",
        "Exit the process",
      ],
      explanation: "`Shutdown` stops listening and waits for active connections to finish. Closing dependencies before that would break requests still in progress, and exiting early would drop them.",
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
        "`http.Get` uses `http.DefaultClient`, which has no timeout, so a hung server keeps callers waiting forever. Use a shared `&http.Client{Timeout: …}`, and build the request with `http.NewRequestWithContext(ctx, …)` so the caller's deadline applies too.",
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
        "Delete the v1 tags from the repository and re-tag the new code as v1.0.0, so every importer picks up the new API on their next `go get`",
        "Ask every consumer to add a `replace` directive",
      ],
      answer: [0],
      explanation:
        "This is semantic import versioning: v2 and later live at a different import path, so upgrading is a deliberate step that teams can take one at a time. Deleting or moving published tags breaks builds, because the module proxy and checksum database have already recorded them.",
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
        "Only the CPU profile from `/debug/pprof/profile`, since time spent waiting on a lock always shows up there as CPU usage in the goroutine that holds it",
      ],
      answer: [0],
      explanation: "A CPU profile shows where time is spent running, not waiting. Mutex and block profiles, plus a goroutine dump, show where goroutines are stuck waiting. They're off by default, and those calls switch them on.",
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
        "Build the production binaries with `-race` and read its output instead, since the race detector also reports where CPU time and memory are going",
      ],
      answer: [0],
      explanation:
        "Importing net/http/pprof adds handlers to `http.DefaultServeMux`, which exposes your service's internals if that mux is public. Profiling in production is valuable and cheap. The race detector adds a lot of overhead and isn't a profiler.",
    },
  ],

  cards: [
    { id: "c4-ordered", domain: "d4", kind: "service", term: "cmp.Ordered", definition: "A constraint for types you can compare with < and >: integers, floats and strings, plus types built on them." },
    { id: "c4-comparable", domain: "d4", kind: "service", term: "comparable", definition: "A built-in constraint for types you can compare with == and !=. Generic map keys need it." },
    { id: "c4-gomaxprocs", domain: "d4", kind: "service", term: "GOMAXPROCS", definition: "The number of Ps, which is how many threads can run Go code at once. It defaults to the number of CPUs available." },
    { id: "c4-gogc", domain: "d4", kind: "service", term: "GOGC", definition: "How much the heap may grow before the next GC cycle, as a percent of live memory. The default is 100." },
    { id: "c4-gomemlimit", domain: "d4", kind: "service", term: "GOMEMLIMIT", definition: "A soft memory limit, from Go 1.19. The GC runs more often as total memory gets close to it." },
    { id: "c4-pool", domain: "d4", kind: "service", term: "sync.Pool", definition: "A stash of reusable temporary objects, so you allocate less. Anything in it may vanish at any GC." },
    { id: "c4-pprof", domain: "d4", kind: "service", term: "net/http/pprof", definition: "Adds HTTP handlers that serve CPU, heap, goroutine, mutex and block profiles." },
    { id: "c4-notify", domain: "d4", kind: "service", term: "signal.NotifyContext", definition: "Returns a context that's cancelled when the process receives one of the signals you list, such as SIGTERM." },
    { id: "c4-shutdown", domain: "d4", kind: "service", term: "http.Server.Shutdown", definition: "Stops accepting new connections and waits for active ones to finish, or until the context runs out." },
    { id: "c4-escape", domain: "d4", kind: "concept", term: "Escape analysis", definition: "The compiler's check that keeps values on the stack unless they might still be needed after the function returns." },
    { id: "c4-gmp", domain: "d4", kind: "concept", term: "G-M-P model", definition: "Goroutines (G) run on operating system threads (M), and each thread holds a processor slot (P) with its own queue." },
    { id: "c4-tilde", domain: "d4", kind: "concept", term: "~T constraint", definition: "Matches every type built on T. For example, ~float64 includes type Celsius float64." },
    { id: "c4-siv", domain: "d4", kind: "concept", term: "Semantic import versioning", definition: "Major version 2 and above of a module add /vN to the module path, so different major versions can be used side by side." },
  ],
});
