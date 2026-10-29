import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { go } from "../go";
import { ChannelLab } from "../labs";

/** Module 3: goroutines, channels, select, context, sync, and data races. */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Goroutines & Channels",
    world: "Channel Canyon",
    weight: 30,
    emoji: "⚡",
    color: "#f59e0b",
    summary: "Goroutines and WaitGroups, buffered vs unbuffered channels, close semantics, select, context cancellation, mutexes, atomics, and the race detector.",
  },

  tasks: [
    {
      id: "3.1",
      title: "Goroutines",
      covers: ["The go statement", "Waiting with sync.WaitGroup", "Per-iteration loop variables (Go 1.22+)", "Goroutine leaks"],
    },
    {
      id: "3.2",
      title: "Channels",
      covers: ["Unbuffered vs buffered", "close and range", "nil channels", "Deadlocks", "Who closes a channel"],
    },
    {
      id: "3.3",
      title: "select and context",
      covers: ["select, default, and random choice", "Timeouts", "context.WithCancel / WithTimeout", "Context values", "errgroup"],
    },
    {
      id: "3.4",
      title: "Shared memory",
      covers: ["Data races and -race", "sync.Mutex and RWMutex", "sync.Once and sync/atomic", "Lock contention"],
    },
  ],

  lessons: [
    {
      id: "d3-goroutines",
      level: "junior",
      task: "3.1",
      title: "Goroutines and waiting for them",
      check: ["d3-01", "d3-03"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "➕", label: "wg.Add(1)", sub: "before starting the goroutine" },
              { icon: "🚀", label: "go func() {…}()", sub: "runs concurrently, cheap to start" },
              { icon: "✅", label: "defer wg.Done()", sub: "even if the work fails" },
              { icon: "⏳", label: "wg.Wait()", sub: "blocks until the counter hits 0" },
            ]}
          />
          <CodeCompare
            lang="go"
            left={{
              title: "Bug: main doesn't wait",
              code: go`
                func main() {
                    go fmt.Println("hi")
                } // program exits: maybe nothing printed
              `,
            }}
            right={{
              title: "Fix: WaitGroup",
              code: go`
                var wg sync.WaitGroup
                for i := range 3 {
                    wg.Add(1)
                    go func() { defer wg.Done(); work(i) }()
                }
                wg.Wait()
              `,
            }}
          />
        </div>
      ),
      points: [
        "`go f()` starts f in a new goroutine. When `main` returns, the program exits without waiting for other goroutines.",
        "Use `sync.WaitGroup`: `Add` before `go`, `Done` (deferred) inside, `Wait` to block. Go 1.25 adds `wg.Go(f)`, which does Add and Done for you.",
        "Since Go 1.22 each loop iteration has its own loop variable, so closures that capture `i` see that iteration's value.",
        "A goroutine blocked forever (on a channel nobody serves) is a leak: its memory is never freed and nothing reports it.",
      ],
      tip: "Whenever you write `go`, say how that goroutine will end. \"Who stops it and when?\" is what interviewers listen for.",
    },
    {
      id: "d3-channels",
      level: "intermediate",
      task: "3.2",
      title: "Channels: buffered, unbuffered, closed",
      check: ["d3-06", "d3-07"],
      visual: <ChannelLab />,
      points: [
        "Unbuffered: a send waits until a receiver takes the value (a hand-off). Buffered: a send waits only when the buffer is full.",
        "`close(ch)` means \"no more values\". Receivers drain what's buffered, then get the zero value with ok == false; `range ch` ends.",
        "Send on a closed channel panics; closing twice panics. Only the sender (or the one owner) should close.",
        "A nil channel blocks forever on send and receive, which is useful to switch off a `select` case.",
        "If every goroutine is blocked, the runtime aborts: \"all goroutines are asleep - deadlock!\". A partial block is a silent leak.",
      ],
      tip: "State ownership out loud: \"this goroutine owns the channel, it sends and closes; everyone else only receives.\"",
    },
    {
      id: "d3-select",
      level: "senior",
      task: "3.3",
      title: "select and context cancellation",
      check: ["d3-12", "d3-13"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="go"
            code={go`
              func worker(ctx context.Context, jobs <-chan Job) error {
                  for {
                      select {
                      case <-ctx.Done():
                          return ctx.Err() // canceled or deadline exceeded
                      case j, ok := <-jobs:
                          if !ok {
                              return nil // jobs closed: we're finished
                          }
                          handle(ctx, j)
                      }
                  }
              }
            `}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🎲", title: "Several ready", text: "select picks one at random", color: "#f59e0b" },
              { icon: "⏭️", title: "default", text: "runs when nothing is ready (non-blocking)", color: "#38bdf8" },
              { icon: "⏰", title: "Timeouts", text: "`context.WithTimeout` or `time.After` in a case", color: "#f472b6" },
            ]}
          />
        </div>
      ),
      points: [
        "`select` waits on several channel operations and runs one that's ready; if several are, it picks randomly.",
        "A `default` case makes the select non-blocking.",
        "`context.Context` carries cancellation and deadlines down a call tree. Pass it first (`ctx`), and always call the `cancel` you get.",
        "Use `context.WithValue` only for request-scoped data like request IDs, with an unexported key type.",
        "`errgroup.WithContext` (golang.org/x/sync) runs goroutines, cancels the rest on the first error, and returns it.",
      ],
      tip: "Every blocking operation in a long-lived goroutine should also listen to `ctx.Done()`. Point that out when you review code.",
    },
    {
      id: "d3-sync",
      level: "senior",
      task: "3.4",
      title: "Mutexes, atomics, and data races",
      check: ["d3-18", "d3-21"],
      visual: (
        <CodeCompare
          lang="go"
          left={{
            title: "Race: unsynchronized ++",
            code: go`
              var n int
              for range 1000 {
                  go func() { n++ }()
              }
              // go test -race reports it
            `,
          }}
          right={{
            title: "Fixed: mutex (or atomic)",
            code: go`
              type Counter struct {
                  mu sync.Mutex
                  n  int
              }

              func (c *Counter) Inc() {
                  c.mu.Lock()
                  defer c.mu.Unlock()
                  c.n++
              }
            `,
          }}
        />
      ),
      points: [
        "A data race is two goroutines touching the same memory at once, at least one writing, without synchronization. The result is undefined.",
        "Run tests with `-race` in CI. It finds races that actually happen during the run.",
        "`sync.Mutex` protects a critical section; never copy a struct containing one (use pointer receivers). Go mutexes aren't re-entrant.",
        "`sync.RWMutex` helps when reads dominate; `sync.Once` runs init exactly once; `sync/atomic` types (`atomic.Int64`) suit simple counters.",
        "\"Share memory by communicating\": channels transfer ownership; mutexes guard state. Both are fine, pick the simpler one.",
      ],
      tip: "If you see `count++` inside a goroutine, say \"data race\" before anything else, then offer a mutex or `atomic.Int64`.",
    },
  ],

  questions: [
    {
      id: "d3-01",
      domain: "d3",
      level: "junior",
      lesson: "d3-goroutines",
      prompt: "What does this program most likely print?",
      code: go`
        func main() {
            go fmt.Println("hello from a goroutine")
        }
      `,
      codeLang: "go",
      options: [
        "Usually nothing: the program exits when `main` returns, without waiting for goroutines",
        "Always the line, because Go waits for all goroutines before exiting",
        "`fatal error: all goroutines are asleep - deadlock!`",
        "Compile error: `go` needs a function literal",
      ],
      answer: [0],
      explanation: "Returning from `main` ends the program immediately. The goroutine may never get scheduled. Wait for it with a WaitGroup or a channel.",
    },
    {
      id: "d3-02",
      domain: "d3",
      level: "junior",
      lesson: "d3-goroutines",
      type: "order",
      prompt: "Order these lines so `main` starts 3 workers and waits for all of them.",
      items: ["`var wg sync.WaitGroup`", "`for i := range 3 {`", "`wg.Add(1)`", "`go func() { defer wg.Done(); work(i) }()`", "`}`", "`wg.Wait()`"],
      explanation: "Add must happen before the goroutine starts (so Wait can't see a zero counter too early), Done is deferred inside it, and Wait comes after the loop. Since Go 1.22 each goroutine sees its own `i`.",
    },
    {
      id: "d3-03",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-goroutines",
      type: "lines",
      prompt: "`wg.Wait()` sometimes returns before any work has run. Tap the buggy line.",
      code: go`
        var wg sync.WaitGroup
        for i := range 5 {
            go func() {
                wg.Add(1)
                defer wg.Done()
                process(i)
            }()
        }
        wg.Wait()
      `,
      codeLang: "go",
      answer: [4],
      explanation: "`Add` runs inside the goroutine, so `Wait` can run while the counter is still 0 and return at once. Call `wg.Add(1)` before the `go` statement (or use `wg.Go` in Go 1.25+).",
    },
    {
      id: "d3-04",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-goroutines",
      prompt: "In Go 1.22 or later, what does this print?",
      code: go`
        var wg sync.WaitGroup
        for i := 0; i < 3; i++ {
            wg.Add(1)
            go func() {
                defer wg.Done()
                fmt.Print(i)
            }()
        }
        wg.Wait()
      `,
      codeLang: "go",
      options: ["The digits 0, 1, and 2, each exactly once, in any order", "Always `012`", "Always `333`", "Usually `333`, sometimes other digits"],
      answer: [0],
      explanation:
        "Since Go 1.22, every iteration of a 3-clause `for` loop has its own `i`, so each closure captures a different variable. The goroutines run in no guaranteed order. Before Go 1.22 they shared one `i`, which is where the classic `333` came from.",
    },
    {
      id: "d3-26",
      domain: "d3",
      level: "staff",
      lesson: "d3-goroutines",
      prompt: "You're reviewing a widely used library function `func Fetch(url string) <-chan Result` that starts a goroutine to do the work. Which two changes make it safe to use across a large codebase? (Choose two.)",
      options: [
        "Take a `context.Context` so callers can cancel and the goroutine can exit early",
        "Make sure the goroutine can always complete its send (e.g. a result channel with buffer 1), so it can't leak if the caller stops listening",
        "Start the goroutine from an `init()` function instead",
        "Return a `chan Result` that callers must remember to close",
        "Recover every panic in the goroutine and discard it silently",
      ],
      answer: [0, 1],
      explanation:
        "A goroutine needs a guaranteed way to finish: cancellation via context and a send that can't block forever. Callers closing a channel they only receive from is backwards, and swallowing panics hides bugs.",
    },
    {
      id: "d3-05",
      domain: "d3",
      level: "junior",
      lesson: "d3-channels",
      prompt: "What happens?",
      code: go`
        func main() {
            ch := make(chan int)
            ch <- 1
            fmt.Println(<-ch)
        }
      `,
      codeLang: "go",
      options: ["`fatal error: all goroutines are asleep - deadlock!`", "It prints `1`", "It prints `0`", "Compile error: unused channel"],
      answer: [0],
      explanation: "An unbuffered send blocks until another goroutine receives. `main` is the only goroutine and it's stuck on the send, so the runtime detects a deadlock. `make(chan int, 1)` would print 1.",
    },
    {
      id: "d3-06",
      domain: "d3",
      level: "junior",
      lesson: "d3-channels",
      prompt: "What does this print?",
      code: go`
        ch := make(chan int, 2)
        ch <- 1
        ch <- 2
        close(ch)
        for v := range ch {
            fmt.Print(v)
        }
        fmt.Print(len(ch))
      `,
      codeLang: "go",
      options: ["`120`", "`12`, then a panic: receive from closed channel", "`0`", "A deadlock"],
      answer: [0],
      explanation: "The buffer holds both values, so neither send blocks. Closing doesn't discard buffered values: `range` drains them and then stops. The empty buffer has len 0.",
    },
    {
      id: "d3-07",
      domain: "d3",
      level: "junior",
      lesson: "d3-channels",
      prompt: "What does this print?",
      code: go`
        ch := make(chan int, 1)
        ch <- 5
        close(ch)
        a, ok1 := <-ch
        b, ok2 := <-ch
        fmt.Println(a, ok1, b, ok2)
      `,
      codeLang: "go",
      options: ["`5 true 0 false`", "`5 true 5 true`", "`5 false 0 false`", "It panics: receive from closed channel"],
      answer: [0],
      explanation: "Buffered values are still delivered after close (`ok` true). Once it's empty, a receive returns immediately with the zero value and `ok` false. Receiving from a closed channel never panics.",
    },
    {
      id: "d3-08",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-channels",
      type: "match",
      prompt: "Match each channel operation to what it does.",
      pairs: [
        ["Send on a closed channel", "Panics: send on closed channel"],
        ["Close an already-closed channel", "Panics: close of closed channel"],
        ["Receive from a closed, empty channel", "Returns the zero value immediately, ok == false"],
        ["Send or receive on a nil channel", "Blocks forever"],
        ["Receive from an open, empty channel", "Blocks until a value is sent or the channel is closed"],
      ],
      explanation: "Memorize this table. The two panics are why only the owning sender should close, and the nil-channel rule is how you disable a select case.",
    },
    {
      id: "d3-09",
      domain: "d3",
      level: "senior",
      lesson: "d3-channels",
      type: "lines",
      prompt: "This panics with `close of closed channel` or `send on closed channel`. Tap the buggy line.",
      code: go`
        func produce(id int, out chan<- int, wg *sync.WaitGroup) {
            defer wg.Done()
            out <- id
            close(out)
        }

        func main() {
            out := make(chan int, 3)
            var wg sync.WaitGroup
            for i := range 3 {
                wg.Add(1)
                go produce(i, out, &wg)
            }
            wg.Wait()
        }
      `,
      codeLang: "go",
      answer: [4],
      explanation:
        "Three producers share one channel and each closes it, so the second close (or a later send) panics. With many senders, close once after they're all done: `go func() { wg.Wait(); close(out) }()`.",
    },
    {
      id: "d3-10",
      domain: "d3",
      level: "senior",
      lesson: "d3-channels",
      prompt: "What's wrong with this function when it's called with 5 URLs?",
      code: go`
        func first(urls []string) string {
            ch := make(chan string)
            for _, u := range urls {
                go func() { ch <- fetch(u) }()
            }
            return <-ch
        }
      `,
      codeLang: "go",
      options: [
        "Four goroutines block forever on their send, a goroutine leak. Fix: `make(chan string, len(urls))`",
        "It deadlocks immediately",
        "It always returns the last URL's result",
        "It has a data race on `u`",
      ],
      answer: [0],
      explanation:
        "Only one value is received, so the other four senders on the unbuffered channel never complete. Giving the channel room for every result (or cancelling via context) lets them finish. Since Go 1.22, `u` is per-iteration, so there's no race.",
    },
    {
      id: "d3-23",
      domain: "d3",
      level: "staff",
      lesson: "d3-channels",
      prompt: "A service receives bursts of 50,000 jobs and does `go handle(job)` for each one. The database falls over during bursts. What's the idiomatic fix?",
      options: [
        "A fixed pool of N workers reading from a bounded channel, so producers block (or shed load) when it's full",
        "Call `runtime.GOMAXPROCS(1)` so fewer goroutines run",
        "Add `time.Sleep(time.Millisecond)` before each `go handle(job)`",
        "Give every job its own unbuffered channel",
      ],
      answer: [0],
      explanation:
        "Goroutines are cheap, but the resources they use aren't. A bounded queue plus a fixed worker count caps concurrency at what the database can handle and pushes backpressure to the producer.",
    },
    {
      id: "d3-11",
      domain: "d3",
      level: "junior",
      lesson: "d3-select",
      prompt: "What does this print?",
      code: go`
        ch := make(chan int)
        select {
        case v := <-ch:
            fmt.Println("got", v)
        default:
            fmt.Println("nothing ready")
        }
      `,
      codeLang: "go",
      options: ["`nothing ready`", "`got 0`", "A deadlock", "It blocks forever"],
      answer: [0],
      explanation: "Nothing is sending on `ch`, so the receive isn't ready and `select` takes the `default` case right away. Without `default` this would deadlock.",
    },
    {
      id: "d3-12",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-select",
      prompt: "Which statement about this code is true?",
      code: go`
        a := make(chan string, 1)
        b := make(chan string, 1)
        a <- "a"
        b <- "b"
        select {
        case v := <-a:
            fmt.Println(v)
        case v := <-b:
            fmt.Println(v)
        }
      `,
      codeLang: "go",
      options: [
        "It prints `a` or `b`: when several cases are ready, select chooses one at random",
        "It always prints `a`, the first case listed",
        "It always prints `b`, the most recent send",
        "It prints both lines",
      ],
      answer: [0],
      explanation: "Select has no priority order. Random choice among ready cases prevents starvation. If you need priority, check the important channel first in a separate non-blocking select.",
    },
    {
      id: "d3-13",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-select",
      prompt: "What does this print?",
      code: go`
        ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
        defer cancel()

        select {
        case <-time.After(200 * time.Millisecond):
            fmt.Println("work done")
        case <-ctx.Done():
            fmt.Println(ctx.Err())
        }
      `,
      codeLang: "go",
      options: ["`context deadline exceeded`", "`work done`", "`context canceled`", "`<nil>`"],
      answer: [0],
      explanation: "The context's deadline (50 ms) passes first, closing `ctx.Done()`. `ctx.Err()` then reports `context.DeadlineExceeded`, whose message is \"context deadline exceeded\". Calling `cancel` would give \"context canceled\".",
    },
    {
      id: "d3-14",
      domain: "d3",
      level: "senior",
      lesson: "d3-select",
      type: "lines",
      prompt: "After `jobs` is closed, this worker spins at 100% CPU handling empty jobs. Tap the line to fix.",
      code: go`
        func worker(ctx context.Context, jobs <-chan Job) {
            for {
                select {
                case <-ctx.Done():
                    return
                case j := <-jobs:
                    handle(j)
                }
            }
        }
      `,
      codeLang: "go",
      answer: [6],
      explanation: "A closed channel is always ready and yields zero values, so the loop never blocks again. Use `case j, ok := <-jobs:` and return when `!ok` (or range over jobs if you don't need the select).",
    },
    {
      id: "d3-15",
      domain: "d3",
      level: "senior",
      lesson: "d3-select",
      prompt: "In a loop that merges two channels with `select`, why set a channel variable to `nil` once it's closed?",
      options: [
        "Operations on a nil channel block forever, so that case is never chosen again while the other keeps working",
        "Setting it to nil closes it a second time safely",
        "Nil channels return zero values faster",
        "It frees the channel's buffer immediately",
      ],
      answer: [0],
      explanation: "A closed channel is always ready, so its case would fire repeatedly. A nil channel is never ready, which cleanly disables the case. Exit the loop when both are nil.",
    },
    {
      id: "d3-16",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-select",
      prompt: "What is `context.WithValue` meant for?",
      options: [
        "Request-scoped data that crosses API boundaries, like a request ID or auth identity, keyed by an unexported type",
        "Passing optional function parameters",
        "Holding the service's database handle and configuration",
        "Sharing mutable state between goroutines",
      ],
      answer: [0],
      explanation: "Context values are untyped and invisible in signatures, so keep them for request-scoped metadata. Dependencies and options belong in explicit parameters or struct fields.",
    },
    {
      id: "d3-17",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-select",
      prompt: "Which are standard rules for `context.Context`? (Choose two.)",
      options: [
        "Pass it as the first parameter, usually named `ctx`, rather than storing it in a struct",
        "Always call the `cancel` function returned by `WithCancel` or `WithTimeout`, typically with `defer`",
        "Pass `nil` when you don't have a context",
        "Create a fresh `context.Background()` inside each helper function",
        "Cancelling a child context also cancels its parent",
      ],
      answer: [0, 1],
      explanation:
        "Not calling `cancel` leaks the context's resources until the parent ends. Use `context.TODO()` instead of nil. A new Background in a helper cuts the cancellation chain, and cancellation flows only from parent to child.",
    },
    {
      id: "d3-24",
      domain: "d3",
      level: "staff",
      lesson: "d3-select",
      prompt: "A handler fans out 3 RPCs. You want to wait for all of them, cancel the others as soon as one fails, and return the first error. Which tool fits best?",
      options: ["`errgroup.WithContext` from golang.org/x/sync/errgroup", "`sync.WaitGroup` on its own", "`sync.Once`", "A `select` with a `default` case"],
      answer: [0],
      explanation:
        "`errgroup.WithContext` returns a group and a derived context. `g.Go` runs each call, the first non-nil error cancels the context, and `g.Wait` returns that error. `SetLimit` can also cap concurrency.",
    },
    {
      id: "d3-18",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-sync",
      prompt: "What does this print?",
      code: go`
        var count int
        var wg sync.WaitGroup
        for range 1000 {
            wg.Add(1)
            go func() {
                defer wg.Done()
                count++
            }()
        }
        wg.Wait()
        fmt.Println(count)
      `,
      codeLang: "go",
      options: [
        "Possibly less than 1000: `count++` is an unsynchronized read-modify-write, a data race",
        "Always 1000, because `wg.Wait()` synchronizes everything",
        "Always 0",
        "Compile error: `count` must be atomic",
      ],
      answer: [0],
      explanation: "Concurrent increments can overwrite each other. `wg.Wait()` makes the final read safe, but not the increments. Use a mutex or `atomic.Int64`, and catch it with `go test -race`.",
    },
    {
      id: "d3-19",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-sync",
      type: "order",
      prompt: "A test is flaky and you suspect a data race. Order the steps.",
      items: [
        "Run the tests with `go test -race`",
        "Read the report: two goroutine stacks accessing the same address, at least one writing",
        "Protect the shared variable (mutex, channel, or atomic) or stop sharing it",
        "Run with `-race` again to confirm the report is gone",
      ],
      explanation: "The race detector instruments memory accesses and reports races that actually occur during the run, with both stacks. It can't prove absence, so exercise the concurrent paths in tests.",
    },
    {
      id: "d3-20",
      domain: "d3",
      level: "senior",
      lesson: "d3-sync",
      prompt: "When does `sync.RWMutex` beat a plain `sync.Mutex`?",
      options: [
        "When reads greatly outnumber writes and the critical sections aren't trivial, since many readers can hold RLock at once",
        "Always; it's strictly faster",
        "When writes outnumber reads",
        "When you need to lock re-entrantly from the same goroutine",
      ],
      answer: [0],
      explanation: "RWMutex has more bookkeeping, so for tiny critical sections or write-heavy loads a Mutex is often as fast or faster. Neither is re-entrant: locking twice from one goroutine deadlocks.",
    },
    {
      id: "d3-21",
      domain: "d3",
      level: "senior",
      lesson: "d3-sync",
      type: "lines",
      prompt: "`Inc` never changes the counter, and `go vet` warns that it passes a lock by value. Tap the buggy line.",
      code: go`
        type SafeCounter struct {
            mu sync.Mutex
            n  int
        }

        func (c SafeCounter) Inc() {
            c.mu.Lock()
            defer c.mu.Unlock()
            c.n++
        }
      `,
      codeLang: "go",
      answer: [6],
      explanation: "The value receiver copies the whole struct, mutex included, so each call locks its own copy and increments a copy of n. Use `func (c *SafeCounter) Inc()`.",
    },
    {
      id: "d3-22",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-sync",
      prompt: "What does this print?",
      code: go`
        var once sync.Once
        for i := range 3 {
            once.Do(func() { fmt.Println("init", i) })
        }
        fmt.Println("done")
      `,
      codeLang: "go",
      options: ["`init 0` then `done`", "`init 0`, `init 1`, `init 2`, then `done`", "`init 2` then `done`", "Only `done`"],
      answer: [0],
      explanation: "`sync.Once` runs the function passed to the first `Do` call and ignores every later call, even with a different function. It's safe to call from many goroutines.",
    },
    {
      id: "d3-25",
      domain: "d3",
      level: "staff",
      lesson: "d3-sync",
      prompt: "A session store is a `map[string]*Session` behind one `sync.Mutex`. On 64-core machines the mutex profile shows heavy contention. What's the best first change?",
      options: [
        "Shard the map into N buckets, each with its own lock, choosing the bucket by hashing the key",
        "Replace the mutex with one goroutine that owns the map and serves every request over channels",
        "Remove the lock, because map reads are safe",
        "Raise GOMAXPROCS",
      ],
      answer: [0],
      explanation:
        "Sharding spreads lock traffic across independent locks, so unrelated keys don't contend. A single owner goroutine is still one serialization point. Map reads alongside writes aren't safe. `sync.Map` is another option for mostly-read, disjoint-key workloads.",
    },
  ],

  cards: [
    { id: "c3-wg", domain: "d3", kind: "service", term: "sync.WaitGroup", definition: "Waits for a set of goroutines: Add before starting, Done when each ends, Wait to block. Go 1.25 adds Go(f)." },
    { id: "c3-mutex", domain: "d3", kind: "service", term: "sync.Mutex", definition: "Mutual-exclusion lock. Zero value is unlocked. Not re-entrant; never copy one after use." },
    { id: "c3-rwmutex", domain: "d3", kind: "service", term: "sync.RWMutex", definition: "Many readers (RLock) or one writer (Lock). Helps when reads dominate." },
    { id: "c3-once", domain: "d3", kind: "service", term: "sync.Once", definition: "Do(f) runs f exactly once, even across goroutines. Good for lazy initialization." },
    { id: "c3-atomic", domain: "d3", kind: "service", term: "sync/atomic", definition: "Lock-free operations on single values, e.g. atomic.Int64 with Add, Load, Store, CompareAndSwap." },
    { id: "c3-timeout", domain: "d3", kind: "service", term: "context.WithTimeout", definition: "Derives a context that is cancelled after a duration. Always defer the returned cancel." },
    { id: "c3-cancel", domain: "d3", kind: "service", term: "context.WithCancel", definition: "Derives a context plus a cancel function that closes its Done channel." },
    { id: "c3-errgroup", domain: "d3", kind: "service", term: "errgroup.Group", definition: "golang.org/x/sync/errgroup: runs goroutines, returns the first error, cancels the shared context." },
    { id: "c3-select", domain: "d3", kind: "service", term: "select", definition: "Waits on several channel operations; runs one ready case at random, or default if none is ready." },
    { id: "c3-unbuffered", domain: "d3", kind: "concept", term: "Unbuffered channel", definition: "make(chan T). A send completes only when a receiver takes the value: a synchronizing hand-off." },
    { id: "c3-leak", domain: "d3", kind: "concept", term: "Goroutine leak", definition: "A goroutine blocked forever (e.g. on a send nobody receives). Its stack and references are never freed." },
    { id: "c3-race", domain: "d3", kind: "concept", term: "Data race", definition: "Concurrent unsynchronized access to the same memory with at least one write. Detect with -race." },
    { id: "c3-deadlock", domain: "d3", kind: "concept", term: "Deadlock detection", definition: "When every goroutine is blocked, the runtime aborts with \"all goroutines are asleep - deadlock!\"." },
  ],

  challenges: [
    {
      id: "ch-go-buffer",
      domain: "d3",
      lesson: "d3-channels",
      title: "Send without waiting",
      goal: "Get main through all three sends without main ever blocking.",
      hint: "Either give the channel enough buffer for all three values, or make sure a receiver is already waiting each time main sends.",
      takeaway: "A send blocks only when no receiver is waiting and the buffer (if any) is full. Buffers decouple timing; they don't remove the need for a receiver.",
      render: (onSolved) => <ChannelLab goal="nonblocking" onSolved={onSolved} />,
    },
    {
      id: "ch-go-finish",
      domain: "d3",
      lesson: "d3-channels",
      title: "Run it to a clean exit",
      goal: "Step the goroutines until the program exits normally with every value printed.",
      hint: "main needs a receiver for its sends and a closed done channel to finish. Without the receiver goroutine, it can never get past <-done.",
      takeaway: "close(ch) ends the receiver's range loop, the receiver signals done, and main can return. Every goroutine has a clear way to finish.",
      render: (onSolved) => <ChannelLab goal="finish" onSolved={onSolved} />,
    },
    {
      id: "ch-go-deadlock",
      domain: "d3",
      lesson: "d3-channels",
      title: "Trip the deadlock detector",
      goal: "Make the runtime report \"all goroutines are asleep - deadlock!\".",
      hint: "Try an unbuffered channel with no receiver goroutine.",
      takeaway: "The runtime only catches the case where every goroutine is blocked. One stuck goroutine among busy ones is a silent leak.",
      render: (onSolved) => <ChannelLab goal="deadlock" onSolved={onSolved} />,
    },
  ],
});
