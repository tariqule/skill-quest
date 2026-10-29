import { CodeBlock, CodeCompare, Flow } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { go } from "../go";
import { DeferLab } from "../labs";
import { MethodSetTable, NilInterfaceBox } from "../visuals";

/** Module 2: structs, methods, interfaces, errors, defer, panic, and recover. */
export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "Methods, Interfaces & Errors",
    world: "The Interface Isles",
    weight: 25,
    emoji: "🏝️",
    color: "#a78bfa",
    summary: "Value vs pointer receivers, method sets, embedding, implicit interfaces and the nil-interface trap, error wrapping, and defer/panic/recover.",
  },

  tasks: [
    {
      id: "2.1",
      title: "Structs, methods, and embedding",
      covers: ["Value vs pointer receivers", "Method sets", "Struct embedding and promotion", "Struct comparison"],
    },
    {
      id: "2.2",
      title: "Interfaces",
      covers: ["Implicit satisfaction", "Type assertions and type switches", "The (type, value) pair and nil interfaces", "Small, consumer-defined interfaces"],
    },
    {
      id: "2.3",
      title: "Errors",
      covers: ["Errors are values", "Wrapping with %w", "errors.Is, errors.As, errors.Join", "Sentinel and custom error types"],
    },
    {
      id: "2.4",
      title: "defer, panic, and recover",
      covers: ["Argument evaluation and LIFO order", "Deferred functions and named results", "recover in deferred functions", "Panics across goroutines"],
    },
  ],

  lessons: [
    {
      id: "d2-methods",
      level: "intermediate",
      task: "2.1",
      title: "Value vs pointer receivers",
      check: ["d2-01", "d2-03"],
      visual: (
        <div className="grid gap-4">
          <CodeCompare
            lang="go"
            left={{
              title: "Value receiver: works on a copy",
              code: go`
                func (c Counter) Inc() { c.n++ }

                c := Counter{}
                c.Inc()
                fmt.Println(c.n) // 0
              `,
            }}
            right={{
              title: "Pointer receiver: changes the original",
              code: go`
                func (c *Counter) Inc() { c.n++ }

                c := Counter{}
                c.Inc() // Go takes &c for you
                fmt.Println(c.n) // 1
              `,
            }}
          />
          <MethodSetTable />
        </div>
      ),
      points: [
        "A value receiver gets a copy; changes to it vanish. A pointer receiver can modify the caller's value.",
        "Use pointer receivers when the method mutates, when the struct is large, or when it holds a mutex. Keep one style per type.",
        "Method set of `T`: value-receiver methods. Method set of `*T`: all methods. This decides which one satisfies an interface.",
        "Embedding promotes the inner type's fields and methods, but it's composition, not inheritance: there's no virtual dispatch.",
      ],
      tip: "When asked \"value or pointer receiver?\", give the rule: mutate, large, or contains a lock means pointer; and be consistent across the type.",
    },
    {
      id: "d2-interfaces",
      level: "intermediate",
      task: "2.2",
      title: "Interfaces and the nil trap",
      check: ["d2-09", "d2-10"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="go"
            code={go`
              type Stringer interface{ String() string }

              type Temp float64
              func (t Temp) String() string { return fmt.Sprintf("%.1f°C", float64(t)) }

              var s Stringer = Temp(21.5) // no "implements" keyword needed
              if t, ok := s.(Temp); ok {   // comma-ok type assertion
                  fmt.Println(t, "is a Temp")
              }
            `}
          />
          <NilInterfaceBox />
        </div>
      ),
      points: [
        "A type satisfies an interface just by having its methods. Interfaces are usually defined by the consumer, not the implementer.",
        "An interface value is a (dynamic type, value) pair. It equals nil only when both are nil.",
        "Returning a nil `*MyErr` as an `error` gives a non-nil interface. Return a literal `nil` on success.",
        "`v.(T)` panics if v doesn't hold a T; `v, ok := x.(T)` doesn't. A type switch handles several types at once.",
        "`any` is an alias for `interface{}`.",
      ],
      tip: "The nil-interface trap is a favourite. Explain it with the two boxes: type and value. A typed nil pointer fills the type box.",
    },
    {
      id: "d2-errors",
      level: "intermediate",
      task: "2.3",
      title: "Errors are values: wrap, Is, As",
      check: ["d2-14", "d2-15"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "🧱", label: "ErrNotFound", sub: "errors.New sentinel" },
              { icon: "🎁", label: "repo: %w", sub: "fmt.Errorf wraps it" },
              { icon: "🎁", label: "service: %w", sub: "more context" },
              { icon: "🔍", label: "errors.Is", sub: "walks the chain, finds the sentinel" },
            ]}
          />
          <CodeBlock
            lang="go"
            code={go`
              if err := svc.Load(id); err != nil {
                  if errors.Is(err, ErrNotFound) { return http.StatusNotFound }
                  var ve *ValidationError
                  if errors.As(err, &ve) { log.Println("bad field:", ve.Field) }
                  return http.StatusInternalServerError
              }
            `}
          />
        </div>
      ),
      points: [
        "Errors are ordinary values returned last. Check them right away: `if err != nil { return … }`.",
        "`fmt.Errorf(\"context: %w\", err)` wraps; `%v` only copies the text and breaks the chain.",
        "`errors.Is(err, target)` matches a specific value anywhere in the chain; `errors.As(err, &ptr)` finds an error of a type.",
        "`errors.Join` (Go 1.20+) combines several errors; `Is` and `As` search all of them.",
      ],
      tip: "Say \"wrap with %w, inspect with errors.Is or errors.As, never compare error strings\". That one line covers most error questions.",
    },
    {
      id: "d2-defer",
      level: "intermediate",
      task: "2.4",
      title: "defer, panic, and recover",
      check: ["d2-19", "d2-21"],
      visual: <DeferLab />,
      points: [
        "Deferred calls run when the surrounding function returns, in last-in, first-out order.",
        "The deferred call's arguments are evaluated at the `defer` statement; a closure reads variables when it runs.",
        "A deferred closure can change NAMED result values after `return` has set them.",
        "`recover()` stops a panic only when called directly in a deferred function, in the same goroutine.",
        "Defers run at function exit, not loop-iteration exit. Don't `defer f.Close()` in a long loop.",
      ],
      tip: "For panics in goroutines, remember: an unrecovered panic in ANY goroutine crashes the whole program. Recover inside the goroutine.",
    },
  ],

  questions: [
    {
      id: "d2-01",
      domain: "d2",
      level: "junior",
      lesson: "d2-methods",
      prompt: "What does this print?",
      code: go`
        type Counter struct{ n int }

        func (c Counter) Inc() { c.n++ }

        func main() {
            c := Counter{}
            c.Inc()
            c.Inc()
            fmt.Println(c.n)
        }
      `,
      codeLang: "go",
      options: ["`0`", "`2`", "`1`", "Compile error: cannot modify a value receiver"],
      answer: [0],
      explanation: "With a value receiver, `Inc` works on a copy of `c`. The copy is incremented and thrown away. Use `func (c *Counter) Inc()` to modify the original.",
    },
    {
      id: "d2-02",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-methods",
      type: "lines",
      prompt: "This doesn't compile. Tap the line the compiler rejects.",
      code: go`
        type Shape interface{ Area() float64 }

        type Square struct{ side float64 }

        func (s *Square) Area() float64 { return s.side * s.side }

        func main() {
            var sh Shape = Square{side: 2}
            fmt.Println(sh.Area())
        }
      `,
      codeLang: "go",
      answer: [8],
      explanation: "`Area` has a pointer receiver, so only `*Square` has it in its method set. `Square` doesn't implement `Shape`. Use `&Square{side: 2}`.",
    },
    {
      id: "d2-03",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-methods",
      prompt: "Type `T` has `func (t T) A()` and `func (t *T) B()`. Which statement is true?",
      options: [
        "`T`'s method set is {A} and `*T`'s is {A, B}, so only `*T` satisfies an interface that needs both",
        "Both `T` and `*T` have the method set {A, B}",
        "`T` has {A, B}; `*T` has only {B}",
        "Go doesn't allow mixing value and pointer receivers on one type",
      ],
      answer: [0],
      explanation:
        "Pointer types get every method; value types get only value-receiver methods. You can still call `t.B()` on an addressable variable because Go rewrites it to `(&t).B()`, but that doesn't change the method set.",
    },
    {
      id: "d2-04",
      domain: "d2",
      level: "junior",
      lesson: "d2-methods",
      prompt: "What does this print?",
      code: go`
        type Animal struct{ Name string }

        func (a Animal) Hello() string { return "I am " + a.Name }

        type Dog struct {
            Animal
            Breed string
        }

        func main() {
            d := Dog{Animal{"Rex"}, "lab"}
            fmt.Println(d.Hello(), d.Name)
        }
      `,
      codeLang: "go",
      options: ["`I am Rex Rex`", "Compile error: `Dog` has no method `Hello`", "`I am  Rex`", "`I am Rex lab`"],
      answer: [0],
      explanation: "Embedding `Animal` promotes its fields and methods, so `d.Hello()` and `d.Name` are shorthand for `d.Animal.Hello()` and `d.Animal.Name`.",
    },
    {
      id: "d2-05",
      domain: "d2",
      level: "senior",
      lesson: "d2-methods",
      prompt: "What does this print?",
      code: go`
        type Base struct{}

        func (Base) Name() string { return "base" }
        func (b Base) Greet() string { return "hi " + b.Name() }

        type Child struct{ Base }

        func (Child) Name() string { return "child" }

        func main() {
            fmt.Println(Child{}.Greet())
        }
      `,
      codeLang: "go",
      options: ["`hi base`", "`hi child`", "Compile error: ambiguous selector `Name`", "It panics"],
      answer: [0],
      explanation:
        "`Greet` is promoted from `Base` and its receiver is the embedded `Base` value, so `b.Name()` calls `Base.Name`. Embedding isn't inheritance: there's no virtual dispatch to `Child.Name`. Use an interface if you need that.",
    },
    {
      id: "d2-06",
      domain: "d2",
      level: "junior",
      lesson: "d2-methods",
      prompt: "What does this print?",
      code: go`
        type P struct{ X, Y int }

        a := P{1, 2}
        b := P{1, 2}
        fmt.Println(a == b, &a == &b)
      `,
      codeLang: "go",
      options: ["`true false`", "`false false`", "`true true`", "Compile error: structs can't be compared"],
      answer: [0],
      explanation: "Structs whose fields are all comparable can be compared with `==`, field by field. `&a == &b` compares two different addresses, so it's false.",
    },
    {
      id: "d2-07",
      domain: "d2",
      level: "junior",
      lesson: "d2-interfaces",
      prompt: "How does a type implement an interface in Go?",
      options: [
        "Implicitly, by having all of the interface's methods; there's no `implements` keyword",
        "By declaring `type T implements I`",
        "By embedding the interface in the struct",
        "By registering it with the runtime in `init()`",
      ],
      answer: [0],
      explanation: "Interface satisfaction is structural and implicit. This lets a consumer define an interface for a type it doesn't own.",
    },
    {
      id: "d2-08",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-interfaces",
      prompt: "What does this print?",
      code: go`
        func describe(v any) string {
            switch x := v.(type) {
            case int:
                return fmt.Sprint("int ", x*2)
            case string, []byte:
                return fmt.Sprintf("text %T", x)
            default:
                return "other"
            }
        }

        func main() { fmt.Println(describe(21), describe("hi"), describe(2.5)) }
      `,
      codeLang: "go",
      options: ["`int 42 text string other`", "`int 42 text interface {} other`", "`int 21 text string other`", "Compile error: `x*2` on type `any`"],
      answer: [0],
      explanation:
        "In a single-type case, `x` has that type (int, so `x*2` works). In a multi-type case, `x` keeps the interface type, but `%T` prints the dynamic type: `string`. 2.5 is a float64, so it hits `default`.",
    },
    {
      id: "d2-09",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-interfaces",
      prompt: "What happens?",
      code: go`
        var v any = "42"
        n, ok := v.(int)
        fmt.Println(n, ok)
        m := v.(int)
        fmt.Println(m)
      `,
      codeLang: "go",
      options: [
        "It prints `0 false`, then panics: interface conversion: interface {} is string, not int",
        "It prints `42 true` then `42`",
        "It prints `0 false` then `0`",
        "Compile error: impossible type assertion",
      ],
      answer: [0],
      explanation: "The comma-ok assertion reports failure with the zero value and `false`. The single-value form panics when the dynamic type doesn't match. Assertions never convert strings to numbers.",
    },
    {
      id: "d2-10",
      domain: "d2",
      level: "senior",
      lesson: "d2-interfaces",
      prompt: "What does this print?",
      code: go`
        type MyErr struct{}

        func (*MyErr) Error() string { return "boom" }

        func run() error {
            var e *MyErr
            return e
        }

        func main() {
            fmt.Println(run() == nil)
        }
      `,
      codeLang: "go",
      options: ["`false`", "`true`", "It panics with a nil pointer dereference", "Compile error"],
      answer: [0],
      explanation:
        "Returning `e` wraps a nil `*MyErr` in an `error` interface whose type is `*MyErr`. An interface is nil only when both its type and value are nil, so the result isn't nil. Return a literal `nil` on success.",
    },
    {
      id: "d2-11",
      domain: "d2",
      level: "senior",
      lesson: "d2-interfaces",
      type: "lines",
      prompt: "`validate(30) != nil` is true, so callers treat a valid age as an error. Tap the two lines that together cause it.",
      code: go`
        type ValidationError struct{ Field string }

        func (e *ValidationError) Error() string { return e.Field + " is invalid" }

        func validate(age int) error {
            var err *ValidationError
            if age < 0 {
                err = &ValidationError{Field: "age"}
            }
            return err
        }
      `,
      codeLang: "go",
      answer: [6, 10],
      explanation:
        "`err` has the concrete type `*ValidationError`, and returning it as `error` produces an interface holding (type *ValidationError, value nil), which isn't nil. Declare `var err error`, or `return nil` explicitly on success.",
    },
    {
      id: "d2-12",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-interfaces",
      prompt: "Which is the idiomatic Go guidance for interfaces?",
      options: [
        "Accept interfaces, return concrete types; keep interfaces small and define them where they're used",
        "Define a large interface next to every struct so it can be mocked",
        "Return interfaces from constructors so the type can change later",
        "Prefix interface names with I, like `IReader`",
      ],
      answer: [0],
      explanation: "Small consumer-side interfaces (often one method, like `io.Reader`) keep packages decoupled, and implicit satisfaction means the implementer doesn't need to know about them.",
    },
    {
      id: "d2-13",
      domain: "d2",
      level: "junior",
      lesson: "d2-interfaces",
      type: "match",
      prompt: "Match each standard interface to its method.",
      pairs: [
        ["`io.Reader`", "`Read(p []byte) (n int, err error)`"],
        ["`io.Writer`", "`Write(p []byte) (n int, err error)`"],
        ["`fmt.Stringer`", "`String() string`"],
        ["`error`", "`Error() string`"],
        ["`sort.Interface`", "`Len`, `Less`, and `Swap`"],
      ],
      explanation: "These tiny interfaces are everywhere in the standard library, and anything with the right methods plugs into them.",
    },
    {
      id: "d2-27",
      domain: "d2",
      level: "staff",
      lesson: "d2-interfaces",
      prompt:
        "A platform team owns a `Store` type with 40 methods and exports a matching 40-method `Storage` interface. Every consuming team writes huge mocks, and adding a method breaks them all. What's the idiomatic fix?",
      options: [
        "Drop the big interface; export the concrete `*Store`, and let each consumer declare the 1–3 method interface it actually uses",
        "Split `Store` into 40 packages, one per method",
        "Generate mocks for the 40-method interface in CI so nobody writes them by hand",
        "Have every method take `any` so the interface never changes",
      ],
      answer: [0],
      explanation:
        "Because satisfaction is implicit, `*Store` automatically satisfies any small interface a consumer defines. Adding a method to `Store` then breaks no one, and each test fakes only what it uses.",
    },
    {
      id: "d2-14",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-errors",
      prompt: "What does this print?",
      code: go`
        var ErrNotFound = errors.New("not found")

        func find() error {
            return fmt.Errorf("find user 7: %w", ErrNotFound)
        }

        func main() {
            err := find()
            fmt.Println(err == ErrNotFound, errors.Is(err, ErrNotFound))
            fmt.Println(err)
        }
      `,
      codeLang: "go",
      options: [
        "`false true` then `find user 7: not found`",
        "`true true` then `not found`",
        "`false false` then `find user 7: %w`",
        "`false true` then `find user 7: &{not found}`",
      ],
      answer: [0],
      explanation: "Wrapping creates a new error, so `==` with the sentinel is false. `errors.Is` unwraps the chain and finds it. The message shows the wrapped error's text in place of `%w`.",
    },
    {
      id: "d2-15",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-errors",
      type: "lines",
      prompt: "`errors.Is(fetch(), ErrTimeout)` returns false. Tap the buggy line.",
      code: go`
        var ErrTimeout = errors.New("timeout")

        func call() error { return ErrTimeout }

        func fetch() error {
            if err := call(); err != nil {
                return fmt.Errorf("fetch: %v", err)
            }
            return nil
        }
      `,
      codeLang: "go",
      answer: [7],
      explanation: "`%v` formats the error into text and drops the original value, so there's nothing to unwrap. Use `%w` to wrap it.",
    },
    {
      id: "d2-16",
      domain: "d2",
      level: "senior",
      lesson: "d2-errors",
      prompt: "What does this print?",
      code: go`
        type NotFound struct{ ID int }

        func (e *NotFound) Error() string { return fmt.Sprintf("id %d not found", e.ID) }

        func main() {
            err := fmt.Errorf("handler: %w", &NotFound{ID: 7})
            var nf *NotFound
            if errors.As(err, &nf) {
                fmt.Println("missing", nf.ID)
            } else {
                fmt.Println("other")
            }
        }
      `,
      codeLang: "go",
      options: ["`missing 7`", "`other`", "It panics: errors.As target must be a non-nil pointer", "Compile error"],
      answer: [0],
      explanation: "`errors.As` walks the chain looking for an error assignable to `*NotFound`. It finds the wrapped one and stores it in `nf`. The target is `&nf`, a pointer to the variable, which is correct.",
    },
    {
      id: "d2-17",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-errors",
      prompt: "Which are good Go error-handling practices? (Choose two.)",
      options: [
        "Add context when returning an error up the stack, e.g. `fmt.Errorf(\"load config: %w\", err)`",
        "Check for sentinel errors with `errors.Is` rather than `==` or string matching",
        "Use `panic` for expected failures like a missing file",
        "Log the error and also return it at every layer",
        "Start error strings with a capital letter and end them with a period",
      ],
      answer: [0, 1],
      explanation: "Wrap with context and inspect with `errors.Is`/`As`. Panics are for bugs, logging at every layer duplicates logs, and Go style is lower-case error strings with no trailing punctuation.",
    },
    {
      id: "d2-18",
      domain: "d2",
      level: "senior",
      lesson: "d2-errors",
      prompt: "What does this print?",
      code: go`
        e1 := errors.New("disk full")
        e2 := errors.New("quota exceeded")
        err := errors.Join(e1, e2)
        fmt.Println(errors.Is(err, e2))
        fmt.Println(err)
      `,
      codeLang: "go",
      options: [
        "`true`, then `disk full` and `quota exceeded` on separate lines",
        "`false`, then `disk full; quota exceeded`",
        "`true`, then `[disk full quota exceeded]`",
        "`false`, then `disk full`",
      ],
      answer: [0],
      explanation: "`errors.Join` (Go 1.20+) wraps several errors; `errors.Is` checks each one. Its message is the individual messages separated by newlines.",
    },
    {
      id: "d2-19",
      domain: "d2",
      level: "junior",
      lesson: "d2-defer",
      prompt: "What does this print?",
      code: go`
        for i := 0; i < 3; i++ {
            defer fmt.Print(i, " ")
        }
        fmt.Print("go ")
      `,
      codeLang: "go",
      options: ["`go 2 1 0`", "`go 0 1 2`", "`2 1 0 go`", "`go 3 3 3`"],
      answer: [0],
      explanation: "Each `defer` evaluates `i` immediately and pushes the call. They run when the function returns, last in first out, after `go ` has been printed.",
    },
    {
      id: "d2-20",
      domain: "d2",
      level: "junior",
      lesson: "d2-defer",
      prompt: "What does this print?",
      code: go`
        x := 1
        defer fmt.Println("deferred:", x)
        x = 2
        fmt.Println("now:", x)
      `,
      codeLang: "go",
      options: ["`now: 2` then `deferred: 1`", "`now: 2` then `deferred: 2`", "`deferred: 1` then `now: 2`", "`deferred: 2` then `now: 2`"],
      answer: [0],
      explanation: "The arguments of a deferred call are evaluated when the `defer` statement runs (x is 1), but the call itself runs at function exit. Wrap it in a closure to see the latest value.",
    },
    {
      id: "d2-21",
      domain: "d2",
      level: "senior",
      lesson: "d2-defer",
      prompt: "What does this print?",
      code: go`
        func f() (n int) {
            defer func() { n *= 2 }()
            n = 3
            return n + 1
        }

        func main() { fmt.Println(f()) }
      `,
      codeLang: "go",
      options: ["`8`", "`4`", "`6`", "`7`"],
      answer: [0],
      explanation: "`return n + 1` first assigns 4 to the named result n, then the deferred closure runs and doubles it to 8. That's how deferred code can adjust a returned error.",
    },
    {
      id: "d2-22",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-defer",
      prompt: "What does this print?",
      code: go`
        func safeDiv(a, b int) (q int, err error) {
            defer func() {
                if r := recover(); r != nil {
                    err = fmt.Errorf("recovered: %v", r)
                }
            }()
            return a / b, nil
        }

        func main() {
            fmt.Println(safeDiv(1, 0))
        }
      `,
      codeLang: "go",
      options: [
        "`0 recovered: runtime error: integer divide by zero`",
        "The program crashes with `panic: runtime error: integer divide by zero`",
        "`0 <nil>`",
        "`+Inf <nil>`",
      ],
      answer: [0],
      explanation:
        "Integer division by zero panics at run time. The deferred closure calls `recover`, which stops the panic, and sets the named result `err`. `q` keeps its zero value.",
    },
    {
      id: "d2-23",
      domain: "d2",
      level: "senior",
      lesson: "d2-defer",
      type: "lines",
      prompt: "With 100,000 paths this runs out of file descriptors. Tap the line responsible.",
      code: go`
        func process(paths []string) error {
            for _, p := range paths {
                f, err := os.Open(p)
                if err != nil {
                    return err
                }
                defer f.Close()
                if err := handle(f); err != nil {
                    return err
                }
            }
            return nil
        }
      `,
      codeLang: "go",
      answer: [7],
      explanation:
        "Deferred calls run when `process` returns, not at the end of each iteration, so every file stays open until the loop finishes. Move the body into a helper function (with its own defer) or close explicitly.",
    },
    {
      id: "d2-24",
      domain: "d2",
      level: "staff",
      lesson: "d2-defer",
      prompt: "Your team is setting conventions for a shared library. When should its code panic instead of returning an error?",
      options: [
        "Only for programmer bugs or impossible states; public APIs return errors, and panics used internally are recovered and converted before crossing the package boundary",
        "Whenever an error is serious enough that callers should notice",
        "Never return errors; panic, and let callers recover",
        "Call `log.Fatal` instead, so the process restarts cleanly",
      ],
      answer: [0],
      explanation:
        "Go's convention is that a package's API presents explicit error returns even if it panics internally. Expected failures (I/O, validation, timeouts) are errors. `log.Fatal` in a library takes the decision away from the application.",
    },
    {
      id: "d2-25",
      domain: "d2",
      level: "staff",
      lesson: "d2-defer",
      prompt: "An HTTP handler starts `go sendReceipt(order)`, and `sendReceipt` panics on a nil map write. What happens?",
      options: [
        "The whole process crashes: net/http recovers panics only in the handler's own goroutine, and recover works only in the panicking goroutine",
        "net/http recovers it, logs the stack trace, and keeps serving",
        "Only that request fails with a 500",
        "The goroutine exits silently and the rest of the program continues",
      ],
      answer: [0],
      explanation:
        "An unrecovered panic in any goroutine terminates the program. Background goroutines in a server need their own `defer func() { if r := recover(); r != nil { … } }()` (or a helper that wraps every `go` statement).",
    },
    {
      id: "d2-26",
      domain: "d2",
      level: "senior",
      lesson: "d2-defer",
      type: "order",
      prompt: "A function with a deferred `recover()` hits an index-out-of-range panic. Order what happens.",
      items: [
        "Normal execution of the function stops at the failing line",
        "The function's deferred calls start running, last in first out",
        "A deferred function calls `recover()`, gets the panic value, and the panic stops",
        "The function returns normally to its caller, with its named results as the defers left them",
      ],
      explanation: "recover only has an effect inside a deferred call during panicking. After it, the function that deferred it returns normally; without it, the panic keeps unwinding up the goroutine's stack.",
    },
  ],

  cards: [
    { id: "c2-is", domain: "d2", kind: "service", term: "errors.Is", definition: "Reports whether any error in err's chain equals the target, e.g. errors.Is(err, fs.ErrNotExist)." },
    { id: "c2-as", domain: "d2", kind: "service", term: "errors.As", definition: "Finds the first error in the chain assignable to the target's type and stores it: errors.As(err, &ptr)." },
    { id: "c2-errorf", domain: "d2", kind: "service", term: "fmt.Errorf with %w", definition: "Creates an error with context that wraps the original, so errors.Is and errors.As can still find it." },
    { id: "c2-join", domain: "d2", kind: "service", term: "errors.Join", definition: "Go 1.20+: combines several errors into one. Is and As search all of them; the message is newline-separated." },
    { id: "c2-recover", domain: "d2", kind: "service", term: "recover", definition: "Called in a deferred function, stops a panic in the same goroutine and returns the panic value." },
    { id: "c2-any", domain: "d2", kind: "service", term: "any", definition: "An alias for interface{}: an interface with no methods, satisfied by every type." },
    { id: "c2-stringer", domain: "d2", kind: "service", term: "fmt.Stringer", definition: "interface{ String() string }. fmt uses it when printing a value with %v or Println." },
    { id: "c2-reader", domain: "d2", kind: "service", term: "io.Reader", definition: "interface{ Read(p []byte) (n int, err error) }. The building block for streaming input." },
    { id: "c2-methodset", domain: "d2", kind: "concept", term: "Method set", definition: "The methods a type has for interface satisfaction: T has value-receiver methods, *T has all methods." },
    { id: "c2-embedding", domain: "d2", kind: "concept", term: "Embedding", definition: "Including a type without a field name so its fields and methods are promoted. Composition, not inheritance." },
    { id: "c2-nilif", domain: "d2", kind: "concept", term: "Nil interface trap", definition: "An interface holding a nil pointer of a concrete type is not nil, because its type half is set." },
    { id: "c2-defer", domain: "d2", kind: "concept", term: "defer", definition: "Schedules a call for when the function returns. Arguments are evaluated immediately; calls run LIFO." },
    { id: "c2-sentinel", domain: "d2", kind: "concept", term: "Sentinel error", definition: "A package-level error value like io.EOF or sql.ErrNoRows that callers check with errors.Is." },
  ],

  challenges: [
    {
      id: "ch-go-defer",
      domain: "d2",
      lesson: "d2-defer",
      title: "Predict the named result",
      goal: "With func f() (n int) selected, predict what f() returns.",
      hint: "return n + 1 assigns the named result first. Then the defers run in reverse order, and one of them multiplies n.",
      takeaway: "Deferred closures run after return sets named results, so they can change what's returned. defer's own arguments were fixed long before.",
      render: (onSolved) => <DeferLab goal="named" onSolved={onSolved} />,
    },
    {
      id: "ch-go-defer-plain",
      domain: "d2",
      lesson: "d2-defer",
      title: "Unnamed result, same defers",
      goal: "Switch to func f() int and predict what it returns.",
      hint: "Without a named result, the return value is copied out before the defers run. Can they still touch it?",
      takeaway: "Defers can only change named results. With an unnamed result, return n + 1 freezes the value before any defer runs.",
      render: (onSolved) => <DeferLab goal="plain" onSolved={onSolved} />,
    },
  ],
});
