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
    summary: "Goroutines and WaitGroups, buffered and unbuffered channels, what closing a channel does, select, cancelling with context, mutexes, atomics, and the race detector.",
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
      covers: ["Unbuffered and buffered channels", "close and range", "nil channels", "Deadlocks", "Who closes a channel"],
    },
    {
      id: "3.3",
      title: "select and context",
      covers: ["select, default, and random choice", "Timeouts", "context.WithCancel and WithTimeout", "Context values", "errgroup"],
    },
    {
      id: "3.4",
      title: "Shared memory",
      covers: ["Data races and -race", "sync.Mutex and RWMutex", "sync.Once and sync/atomic", "Lock contention"],
    },
  ],

  lessons: [
    {
      id: "d3-start-concurrency",
      level: "beginner",
      task: "3.1",
      title: "Doing several things at once",
      check: ["go-b3-01", "go-b3-02"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            tiles={[
              { icon: "👩‍🍳", title: "One cook", text: "Boils the pasta, then makes the sauce, then grates the cheese. One job at a time.", color: "#f59e0b" },
              { icon: "👩‍🍳👨‍🍳👩‍🍳", title: "Several cooks", text: "Each takes a job and they work at the same time. That's concurrency.", color: "#34d399" },
            ]}
          />
          <CodeBlock
            lang="go"
            code={go`
              func cook(dish string) {
                  fmt.Println("cooking", dish)
              }

              go cook("pasta")   // starts a goroutine and moves on
              go cook("sauce")   // another one, running at the same time
            `}
          />
        </div>
      ),
      points: [
        "**Concurrency** means a program juggles several jobs at once, like a kitchen with several cooks instead of one.",
        "In Go, each of those jobs runs in a **goroutine**, a very lightweight worker. You can start thousands of them.",
        "Put the word `go` in front of a function call and it runs in a new goroutine. Your code carries straight on without waiting for it.",
        "When `main` finishes, the whole program ends, even if other goroutines are still busy. So you need a way to wait for them.",
      ],
      tip: "Goroutines don't run in a fixed order. If two of them print, the lines can come out either way round, and that's normal.",
    },
    {
      id: "d3-start-channels",
      level: "beginner",
      task: "3.2",
      title: "Channels pass values between goroutines",
      check: ["go-b3-03", "go-b3-04"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "👩‍🍳", label: "One goroutine sends", sub: "ch <- \"hello\"" },
              { icon: "🛎️", label: "The channel", sub: "Like the hatch between kitchen and dining room" },
              { icon: "🙋", label: "Another receives", sub: "msg := <-ch" },
            ]}
          />
          <CodeBlock
            lang="go"
            code={go`
              ch := make(chan string)        // a channel that carries strings

              go func() { ch <- "hello" }()  // send from a goroutine

              msg := <-ch                    // main waits here to receive
              fmt.Println(msg)               // hello
            `}
          />
        </div>
      ),
      points: [
        "A **channel** is a pipe that goroutines use to hand values to each other. Think of the hatch where a cook passes plates to a waiter.",
        "You make one with `make(chan string)`. The type after `chan` says what kind of value travels through it.",
        "`ch <- v` sends a value into the channel. `v := <-ch` takes one out. The arrow always points the way the value moves.",
        "Receiving waits until something arrives, so a channel is also a simple way to wait for another goroutine's work.",
      ],
      tip: "With a plain channel like this one, a send also waits until someone is ready to receive. Sender and receiver meet, like handing over a parcel in person.",
    },
    {
      id: "d3-start-waiting",
      level: "beginner",
      task: "3.1",
      title: "Waiting for goroutines with a WaitGroup",
      check: ["go-b3-05", "go-b3-06"],
      visual: (
        <CodeBlock
          lang="go"
          code={go`
            var wg sync.WaitGroup

            wg.Add(1)                 // "one job to wait for"
            go func() {
                defer wg.Done()       // "this job is finished"
                fmt.Println("working")
            }()

            wg.Wait()                 // wait until every job is done
            fmt.Println("all done")
          `}
        />
      ),
      points: [
        "A **WaitGroup** from the `sync` package is a counter of jobs still running, like a tally of cooks who haven't finished yet.",
        "`wg.Add(1)` adds one to the counter before you start a goroutine.",
        "`wg.Done()` takes one away when that goroutine finishes. Writing it with `defer` makes sure it happens even if the work goes wrong.",
        "`wg.Wait()` pauses until the counter is back to zero, so everything after it runs only once all the work is done.",
      ],
      tip: "Call `wg.Add` before the `go` line, not inside the goroutine. Otherwise `Wait` might check the counter before it has gone up.",
    },
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
              { icon: "➕", label: "wg.Add(1)", sub: "Count the job before starting the goroutine" },
              { icon: "🚀", label: "go func() {…}()", sub: "Runs alongside main and is cheap to start" },
              { icon: "✅", label: "defer wg.Done()", sub: "Marks the job finished, even if the work fails" },
              { icon: "⏳", label: "wg.Wait()", sub: "Waits until the counter is back to 0" },
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
        "`go f()` starts `f` in a new goroutine. When `main` returns, the program exits without waiting for any other goroutines.",
        "To wait, use a `sync.WaitGroup`: call `Add` before `go`, a deferred `Done` inside, and `Wait` to pause until they're all finished. Go 1.25 adds `wg.Go(f)`, which does Add and Done for you.",
        "Since Go 1.22, each pass of a loop gets its own copy of the loop variable, so a closure that uses `i` sees the value from its own pass.",
        "A goroutine stuck forever, for example on a channel nobody reads, is a **leak**. Its memory is never freed, and nothing warns you.",
      ],
      tip: "Whenever you write `go`, say how that goroutine will end. \"Who stops it, and when?\" is what interviewers are listening for.",
    },
    {
      id: "d3-channels",
      level: "intermediate",
      task: "3.2",
      title: "Channels: unbuffered, buffered and closed",
      check: ["d3-06", "d3-07"],
      visual: <ChannelLab />,
      points: [
        "On an **unbuffered** channel, a send waits until a receiver takes the value, like a hand-off. On a **buffered** channel, a send only waits when the buffer is full.",
        "`close(ch)` means \"no more values are coming\". Receivers still get whatever is buffered, then the zero value with `ok` set to false, and a `range ch` loop ends.",
        "Sending on a closed channel panics, and so does closing it twice. Only the sender, or the one goroutine that owns the channel, should close it.",
        "A nil channel blocks forever on both send and receive. That sounds useless, but it's handy for switching off a `select` case.",
        "If every goroutine is stuck, the runtime stops with \"all goroutines are asleep - deadlock!\". If only some are stuck, it's a silent leak instead.",
      ],
      tip: "Say who owns the channel out loud: \"this goroutine owns it, so it sends and closes; everyone else only receives.\"",
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
              { icon: "🎲", title: "Several ready", text: "select picks one of them at random", color: "#f59e0b" },
              { icon: "⏭️", title: "default", text: "Runs straight away when nothing is ready, so select doesn't wait", color: "#38bdf8" },
              { icon: "⏰", title: "Timeouts", text: "Use `context.WithTimeout`, or `time.After` in a case", color: "#f472b6" },
            ]}
          />
        </div>
      ),
      points: [
        "`select` waits on several channel operations at once and runs whichever is ready. If several are ready, it picks one at random.",
        "Adding a `default` case means select never waits: if nothing is ready, `default` runs.",
        "A `context.Context` carries a \"stop now\" signal and deadlines down through the calls you make. Pass it as the first argument (`ctx`), and always call the `cancel` function you're given.",
        "Use `context.WithValue` only for data tied to one request, like a request ID, with a private key type.",
        "`errgroup.WithContext` (from golang.org/x/sync) runs goroutines, cancels the rest as soon as one fails, and returns that first error.",
      ],
      tip: "Every operation that can wait in a long-lived goroutine should also listen to `ctx.Done()`. Point that out when you review code.",
    },
    {
      id: "d3-sync",
      level: "senior",
      task: "3.4",
      title: "Mutexes, atomics, and data races",
      sources: [{ title: "Go docs: package sync", url: "https://pkg.go.dev/sync", license: "CC BY 4.0" }],
      check: ["d3-18", "d3-21"],
      visual: (
        <CodeCompare
          lang="go"
          left={{
            title: "Race: ++ with no protection",
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
        "A **data race** is two goroutines using the same memory at the same time, with at least one writing and nothing coordinating them. The result is unpredictable.",
        "Run your tests with `-race` in CI. It catches races that actually happen while the tests run.",
        "A `sync.Mutex` lets one goroutine at a time into a section of code. Never copy a struct that contains one, so use pointer receivers. Locking it twice from the same goroutine deadlocks.",
        "`sync.RWMutex` helps when reads far outnumber writes. `sync.Once` runs setup code exactly once. `sync/atomic` types like `atomic.Int64` suit simple counters.",
        "Go's motto is \"share memory by communicating\". Channels hand data from one goroutine to another, and mutexes guard shared data. Both are fine, so pick whichever is simpler.",
        "Never copy a `sync.Mutex`: a value receiver copies the struct and its lock. `go vet` reports copied locks.",
      ],
      tip: "If you see `count++` inside a goroutine, say \"data race\" before anything else, then offer a mutex or an `atomic.Int64`.",
    },
  ],

  questions: [
    // ───────────── Start here ─────────────
    {
      id: "go-b3-01",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-concurrency",
      prompt: "What does putting `go` in front of a function call do, as in `go cook(\"pasta\")`?",
      options: [
        "Runs the function in a new goroutine, so the code after it carries on without waiting",
        "Runs the function twice",
        "Makes the function run faster on one CPU",
        "Stops the program until the function finishes running, then carries on with the next line",
      ],
      answer: [0],
      explanation:
        "The `go` keyword starts the call in its own goroutine and returns straight away. Both pieces of code then run at the same time, like two cooks working side by side.",
    },
    {
      id: "go-b3-02",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-concurrency",
      prompt: "`main` starts a goroutine and then returns at once. What happens to the goroutine?",
      options: [
        "The program ends, so the goroutine may never get to run or finish",
        "Go waits for it to finish before the program ends",
        "The goroutine becomes the new main and just keeps going",
        "The program crashes with an error",
      ],
      answer: [0],
      explanation:
        "When `main` returns, the whole program stops, and other goroutines are stopped with it. To let them finish, `main` has to wait, for example with a channel or a WaitGroup.",
    },
    {
      id: "go-b3-03",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-channels",
      type: "output",
      prompt: "What does this print?",
      code: go`
        ch := make(chan string)
        go func() { ch <- "hello" }()
        msg := <-ch
        fmt.Println(msg)
      `,
      codeLang: "go",
      answers: ["hello"],
      explanation:
        "The goroutine sends \"hello\" into the channel. `main` waits at `<-ch` until it arrives, stores it in `msg`, then prints it. Because `main` waits for the value, the output is always the same.",
    },
    {
      id: "go-b3-04",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-channels",
      type: "fill",
      prompt: "Fill the gap so this line sends the number 42 into the channel `ch`.",
      code: go`
        ch := make(chan int, 1)
        ch {{1}} 42
        fmt.Println(<-ch)  // 42
      `,
      codeLang: "go",
      blanks: [{ options: ["<-", "->", "=", ":="], answer: 0 }],
      explanation:
        "Go uses the arrow `<-` for channels, and it points the way the value travels. `ch <- 42` pushes 42 into the channel, and `<-ch` pulls a value out. There's no `->` operator in Go.",
    },
    {
      id: "go-b3-05",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-waiting",
      type: "output",
      prompt: "What does this print? Type each line on its own line.",
      code: go`
        var wg sync.WaitGroup
        wg.Add(1)
        go func() {
            defer wg.Done()
            fmt.Println("working")
        }()
        wg.Wait()
        fmt.Println("all done")
      `,
      codeLang: "go",
      answers: ["working\nall done"],
      explanation:
        "`wg.Wait()` doesn't return until the goroutine has called `Done`, and that only happens after it prints \"working\". So \"working\" always comes first, then \"all done\".",
    },
    {
      id: "go-b3-06",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-waiting",
      prompt: "What does `wg.Wait()` do?",
      options: [
        "Pauses until every job counted with `Add` has called `Done`",
        "Starts all of the goroutines in the group at once.",
        "Waits for exactly one second",
        "Stops every running goroutine",
      ],
      answer: [0],
      explanation:
        "A WaitGroup counts jobs still running. `Add` raises the count, `Done` lowers it, and `Wait` blocks until it's back to zero. It doesn't start or stop anything itself.",
    },
    // ───────────── Interview questions ─────────────
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
        "Always the line, because Go waits for all goroutines to finish before it exits",
        "`fatal error: all goroutines are asleep - deadlock!`",
        "Compile error: `go` needs a function literal",
      ],
      answer: [0],
      explanation: "Returning from `main` ends the program at once, and the goroutine may never even get a turn. Wait for it with a WaitGroup or a channel.",
    },
    {
      id: "d3-02",
      domain: "d3",
      level: "junior",
      lesson: "d3-goroutines",
      type: "order",
      prompt: "Put these lines in order so `main` starts 3 workers and waits for all of them.",
      items: ["`var wg sync.WaitGroup`", "`for i := range 3 {`", "`wg.Add(1)`", "`go func() { defer wg.Done(); work(i) }()`", "`}`", "`wg.Wait()`"],
      explanation: "`Add` must happen before the goroutine starts, so `Wait` can't see a zero counter too early. `Done` is deferred inside the goroutine, and `Wait` comes after the loop. Since Go 1.22, each goroutine sees its own `i`.",
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
      explanation: "`Add` runs inside the goroutine, so `Wait` can run while the counter is still 0 and return straight away. Call `wg.Add(1)` before the `go` line, or use `wg.Go` in Go 1.25 and later.",
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
      options: ["The digits 0, 1, and 2, each exactly once, in any order", "Always `012`", "Always `333`", "Usually `333`, but sometimes other digits too."],
      answer: [0],
      explanation:
        "Since Go 1.22, every pass of a three-part `for` loop has its own `i`, so each closure holds a different variable. The goroutines still run in no particular order. Before Go 1.22 they all shared one `i`, which is where the classic `333` came from.",
    },
    {
      id: "d3-26",
      domain: "d3",
      level: "staff",
      lesson: "d3-goroutines",
      prompt: "You're reviewing a widely used library function `func Fetch(url string) <-chan Result` that starts a goroutine to do the work. Which two changes make it safe to use across a large codebase? (Choose two.)",
      options: [
        "Take a `context.Context` so callers can cancel and the goroutine can exit early",
        "Make sure the goroutine can always complete its send (for example, a result channel with a buffer of 1), so it can't leak if the caller stops listening",
        "Start the goroutine from an `init()` function instead",
        "Return a `chan Result` that callers must remember to close",
        "Recover every panic in the goroutine and discard it silently",
      ],
      answer: [0, 1],
      explanation:
        "A goroutine needs a guaranteed way to finish: a context it can be cancelled through, and a send that can't get stuck forever. Asking callers to close a channel they only receive from is backwards, and silently swallowing panics hides bugs.",
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
      options: ["`fatal error: all goroutines are asleep - deadlock!`", "It prints `1`", "It prints `0`", "Compile error: unused channel `ch` declared and never read from"],
      answer: [0],
      explanation: "A send on an unbuffered channel waits until another goroutine receives. `main` is the only goroutine, and it's stuck on the send, so the runtime reports a deadlock. With `make(chan int, 1)` it would print 1.",
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
      explanation: "The buffer has room for both values, so neither send waits. Closing doesn't throw away buffered values: `range` reads them all and then stops. Once empty, the channel's `len` is 0.",
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
      explanation: "Values in the buffer are still delivered after close, with `ok` true. Once it's empty, a receive returns straight away with the zero value and `ok` false. Receiving from a closed channel never panics.",
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
      explanation: "This table is worth memorising. The two panics are why only the sender that owns a channel should close it, and the nil-channel rule is how you switch off a select case.",
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
        "Three producers share one channel and each one closes it, so the second close (or a later send) panics. With several senders, close once, after they've all finished: `go func() { wg.Wait(); close(out) }()`.",
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
        "Four goroutines are stuck forever on their send, which is a goroutine leak. The fix is `make(chan string, len(urls))`",
        "It deadlocks immediately",
        "It always returns the last URL's result, because the unbuffered channel overwrites each earlier value until only the final send is left for the receiver",
        "It has a data race on `u`",
      ],
      answer: [0],
      explanation:
        "Only one value is received, so the other four sends on the unbuffered channel never complete. Giving the channel room for every result, or cancelling through a context, lets them finish. Since Go 1.22, `u` is a fresh variable on each pass, so there's no race.",
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
        "Add `time.Sleep(time.Millisecond)` before each `go handle(job)` call, so goroutines start more slowly",
        "Give every job its own unbuffered channel",
      ],
      answer: [0],
      explanation:
        "Goroutines are cheap, but the things they use aren't. A queue with a size limit plus a fixed number of workers caps the load at what the database can handle, and makes the producer slow down when it's full.",
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
      explanation: "Nothing is sending on `ch`, so the receive isn't ready, and `select` takes the `default` case straight away. Without `default`, this would deadlock.",
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
        "It always prints `a`, the first case listed, because select checks its cases from top to bottom",
        "It always prints `b`, the most recent send",
        "It prints both lines",
      ],
      answer: [0],
      explanation: "Select has no priority order. Choosing at random among ready cases stops one channel from hogging all the attention. If you need a priority, check the important channel first in a separate select with a `default`.",
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
      options: ["`context deadline exceeded`", "`work done`", "`context canceled` error", "`<nil>`"],
      answer: [0],
      explanation: "The context's 50 ms deadline passes first, which closes `ctx.Done()`. `ctx.Err()` then reports `context.DeadlineExceeded`, whose message is \"context deadline exceeded\". Calling `cancel` instead would give \"context canceled\".",
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
      explanation: "A closed channel is always ready and keeps handing out zero values, so the loop never waits again. Use `case j, ok := <-jobs:` and return when `!ok`, or just `range` over jobs if you don't need the select.",
    },
    {
      id: "d3-15",
      domain: "d3",
      level: "senior",
      lesson: "d3-select",
      prompt: "In a loop that merges two channels with `select`, why set a channel variable to `nil` once it's closed?",
      options: [
        "Operations on a nil channel block forever, so that case is never chosen again while the other keeps working",
        "Setting it to nil closes it a second time safely, so the receiving case gets the zero value and stops being chosen",
        "Nil channels return zero values faster",
        "It frees the channel's buffer immediately",
      ],
      answer: [0],
      explanation: "A closed channel is always ready, so its case would fire again and again. A nil channel is never ready, which neatly switches that case off. Leave the loop once both are nil.",
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
        "Holding the service's database handle and configuration, so every function can reach them without extra parameters",
        "Sharing mutable state between goroutines",
      ],
      answer: [0],
      explanation: "Context values have no type checking and don't show up in function signatures, so keep them for small bits of data tied to one request. Dependencies and options belong in real parameters or struct fields.",
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
        "Forgetting `cancel` leaks the context's resources until its parent ends. Use `context.TODO()` instead of nil. A new Background inside a helper cuts the chain of cancellation, and cancelling only flows from parent to child, never back up.",
    },
    {
      id: "d3-24",
      domain: "d3",
      level: "staff",
      lesson: "d3-select",
      prompt: "A handler fans out 3 RPCs. You want to wait for all of them, cancel the others as soon as one fails, and return the first error. Which tool fits best?",
      options: ["`errgroup.WithContext` from golang.org/x/sync/errgroup", "`sync.WaitGroup` on its own", "`sync.Once`", "A `select` with a `default` case around each of the calls"],
      answer: [0],
      explanation:
        "`errgroup.WithContext` gives you a group and a context tied to it. `g.Go` runs each call, the first error cancels the context, and `g.Wait` returns that error. `SetLimit` can also cap how many run at once.",
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
        "Possibly less than 1000: `count++` is an unprotected read, add and write, which is a data race",
        "Always 1000, because `wg.Wait()` synchronizes every write made by the goroutines",
        "Always 0",
        "Compile error: `count` must be atomic",
      ],
      answer: [0],
      explanation: "Increments running at the same time can overwrite each other. `wg.Wait()` makes the final read safe, but not the increments themselves. Use a mutex or an `atomic.Int64`, and catch it with `go test -race`.",
    },
    {
      id: "d3-19",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-sync",
      type: "order",
      prompt: "A test fails now and then and you suspect a data race. Put the steps in order.",
      items: [
        "Run the tests with `go test -race`",
        "Read the report: two goroutine stacks accessing the same address, at least one writing",
        "Protect the shared variable (mutex, channel, or atomic) or stop sharing it",
        "Run with `-race` again to confirm the report is gone",
      ],
      explanation: "The race detector watches every memory access and reports races that actually happen during the run, showing both goroutines' stacks. It can't prove there are no races, so make sure your tests really run the concurrent code.",
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
        "When you need to lock re-entrantly from the same goroutine, since RWMutex lets a goroutine that holds Lock call Lock again",
      ],
      answer: [0],
      explanation: "An RWMutex has more bookkeeping, so for tiny locked sections or lots of writes, a plain Mutex is often just as fast or faster. Neither can be locked twice by the same goroutine: that deadlocks.",
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
      explanation: "The value receiver copies the whole struct, mutex and all, so each call locks its own copy and adds one to a copy of `n`. Use `func (c *SafeCounter) Inc()`.",
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
      explanation: "`sync.Once` runs the function given to the first `Do` call and ignores every later call, even one with a different function. It's safe to call from many goroutines at once.",
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
        "Splitting the map into shards spreads the locking across separate locks, so unrelated keys don't fight over one. A single owner goroutine is still one queue everything waits in. Reading a map while others write isn't safe. `sync.Map` is another option when reads dominate and goroutines touch different keys.",
    },
  ],

  cards: [
    { id: "c3-wg", domain: "d3", kind: "service", term: "sync.WaitGroup", definition: "Waits for a group of goroutines. Call Add before starting each, Done when each ends, and Wait to pause until all are done. Go 1.25 adds Go(f)." },
    { id: "c3-mutex", domain: "d3", kind: "service", term: "sync.Mutex", definition: "A lock that lets one goroutine at a time into a section of code. Its zero value is unlocked. Don't lock it twice from one goroutine, and never copy one after use." },
    { id: "c3-rwmutex", domain: "d3", kind: "service", term: "sync.RWMutex", definition: "Allows many readers at once (RLock) or a single writer (Lock). Helps when reads far outnumber writes." },
    { id: "c3-once", domain: "d3", kind: "service", term: "sync.Once", definition: "Do(f) runs f exactly once, even when many goroutines call it. Good for setting something up the first time it's needed." },
    { id: "c3-atomic", domain: "d3", kind: "service", term: "sync/atomic", definition: "Safe updates to single values without a lock. For example, atomic.Int64 has Add, Load, Store and CompareAndSwap." },
    { id: "c3-timeout", domain: "d3", kind: "service", term: "context.WithTimeout", definition: "Makes a child context that cancels itself after a set time. Always defer the cancel function it returns." },
    { id: "c3-cancel", domain: "d3", kind: "service", term: "context.WithCancel", definition: "Makes a child context plus a cancel function. Calling cancel closes the context's Done channel." },
    { id: "c3-errgroup", domain: "d3", kind: "service", term: "errgroup.Group", definition: "From golang.org/x/sync/errgroup. Runs goroutines, returns the first error, and cancels their shared context when one fails." },
    { id: "c3-select", domain: "d3", kind: "service", term: "select", definition: "Waits on several channel operations and runs one that's ready, chosen at random. If none is ready and there's a default, it runs that." },
    { id: "c3-unbuffered", domain: "d3", kind: "concept", term: "Unbuffered channel", definition: "Made with make(chan T). A send only completes when a receiver takes the value, so the two goroutines meet, like a hand-off." },
    { id: "c3-leak", domain: "d3", kind: "concept", term: "Goroutine leak", definition: "A goroutine stuck forever, for example on a send nobody receives. Its memory, and everything it refers to, is never freed." },
    { id: "c3-race", domain: "d3", kind: "concept", term: "Data race", definition: "Two goroutines using the same memory at once, at least one writing, with nothing coordinating them. Find them with -race." },
    { id: "c3-deadlock", domain: "d3", kind: "concept", term: "Deadlock detection", definition: "When every goroutine is stuck, the runtime stops the program with \"all goroutines are asleep - deadlock!\"." },
  ],

  challenges: [
    {
      id: "ch-go-buffer",
      domain: "d3",
      lesson: "d3-channels",
      title: "Send without waiting",
      goal: "Get main through all three sends without main ever blocking.",
      hint: "Either give the channel enough buffer for all three values, or make sure a receiver is already waiting each time main sends.",
      takeaway: "A send only waits when no receiver is ready and the buffer, if there is one, is full. A buffer loosens the timing, but you still need a receiver.",
      render: (onSolved) => <ChannelLab goal="nonblocking" onSolved={onSolved} />,
    },
    {
      id: "ch-go-finish",
      domain: "d3",
      lesson: "d3-channels",
      title: "Run it to a clean exit",
      goal: "Step the goroutines until the program exits normally with every value printed.",
      hint: "main needs someone to receive its sends, and a closed done channel before it can finish. Without the receiver goroutine, it can never get past <-done.",
      takeaway: "close(ch) ends the receiver's range loop, the receiver then signals done, and main can return. Every goroutine has a clear way to finish.",
      render: (onSolved) => <ChannelLab goal="finish" onSolved={onSolved} />,
    },
    {
      id: "ch-go-deadlock",
      domain: "d3",
      lesson: "d3-channels",
      title: "Trip the deadlock detector",
      goal: "Make the runtime report \"all goroutines are asleep - deadlock!\".",
      hint: "Try an unbuffered channel with no receiver goroutine.",
      takeaway: "The runtime only catches the case where every goroutine is stuck. One stuck goroutine among busy ones is a silent leak.",
      render: (onSolved) => <ChannelLab goal="deadlock" onSolved={onSolved} />,
    },
  ],
});
