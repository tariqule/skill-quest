import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
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
    summary: "Value and pointer receivers, method sets, embedding, interfaces and the nil-interface trap, wrapping errors, and defer, panic and recover.",
  },

  tasks: [
    {
      id: "2.1",
      title: "Structs, methods, and embedding",
      covers: ["Value and pointer receivers", "Method sets", "Struct embedding and promotion", "Struct comparison"],
    },
    {
      id: "2.2",
      title: "Interfaces",
      covers: ["Interfaces are satisfied automatically", "Type assertions and type switches", "The (type, value) pair and nil interfaces", "Small, consumer-defined interfaces"],
    },
    {
      id: "2.3",
      title: "Errors",
      covers: ["Errors are values", "Wrapping with %w", "errors.Is, errors.As, errors.Join", "Sentinel and custom error types"],
    },
    {
      id: "2.4",
      title: "defer, panic, and recover",
      covers: ["When arguments are worked out, and last-in first-out order", "Deferred functions and named results", "recover in deferred functions", "Panics across goroutines"],
    },
  ],

  lessons: [
    {
      id: "d2-start-structs",
      level: "beginner",
      task: "2.1",
      title: "Structs and methods",
      check: ["go-b2-01", "go-b2-02"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="go"
            code={go`
              type Dog struct {      // a form with named fields
                  Name string
                  Age  int
              }

              func (d Dog) Speak() string {   // a method on Dog
                  return d.Name + " says woof"
              }

              rex := Dog{Name: "Rex", Age: 3}
              fmt.Println(rex.Name, rex.Age)  // Rex 3
              fmt.Println(rex.Speak())        // Rex says woof
            `}
          />
          <Tiles
            tiles={[
              { icon: "📋", title: "Struct", text: "Groups related values under one name, like the boxes on a paper form.", color: "#a78bfa" },
              { icon: "🔧", title: "Method", text: "A function attached to a type, called with a dot: rex.Speak().", color: "#00add8" },
            ]}
          />
        </div>
      ),
      points: [
        "A **struct** bundles related values together, like a paper form with labelled boxes. Each box is a **field** with a name and a type.",
        "You fill one in with a literal such as `Dog{Name: \"Rex\", Age: 3}`, and read a field with a dot: `rex.Name`.",
        "A **method** is a function attached to a type. The extra bit before the name, `(d Dog)`, is the **receiver**: the value the method works on.",
        "Go has no classes. Structs plus methods give you the same everyday building blocks.",
      ],
      tip: "Field names that start with a capital letter, like `Name`, can be used from other packages. Lowercase ones, like `name`, stay private to their own package.",
    },
    {
      id: "d2-start-funcs",
      level: "beginner",
      task: "2.3",
      title: "Functions can return more than one value",
      check: ["go-b2-03", "go-b2-04"],
      visual: (
        <CodeBlock
          lang="go"
          code={go`
            func add(a, b int) int {         // two ints in, one int out
                return a + b
            }

            func divmod(a, b int) (int, int) {   // two results
                return a / b, a % b
            }

            fmt.Println(add(2, 3))   // 5
            q, r := divmod(7, 2)
            fmt.Println(q, r)        // 3 1
          `}
        />
      ),
      points: [
        "A **function** is a named recipe you can run again and again. You write it with `func`, its inputs in brackets, and its result type after them.",
        "`func add(a, b int) int` takes two ints called `a` and `b` and gives back one int.",
        "Go functions can return **several values** at once. You list the types in brackets, as in `(int, int)`.",
        "You catch the results with as many names as there are values: `q, r := divmod(7, 2)`.",
      ],
      tip: "If you don't need one of the results, put `_` in its place, as in `q, _ := divmod(7, 2)`. Go doesn't let you leave a variable unused.",
    },
    {
      id: "d2-start-errors",
      level: "beginner",
      task: "2.3",
      title: "Errors are just values",
      check: ["go-b2-05", "go-b2-06"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="go"
            code={go`
              n, err := strconv.Atoi("42")    // turn text into a number
              if err != nil {
                  fmt.Println("not a number:", err)
                  return
              }
              fmt.Println(n + 1)              // 43
            `}
          />
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "📞", label: "Call the function", sub: "It returns a result and an error" },
              { icon: "❓", label: "Is err nil?", sub: "nil means nothing went wrong" },
              { icon: "✅", label: "Carry on", sub: "Or handle the problem and stop" },
            ]}
          />
        </div>
      ),
      points: [
        "Many Go functions return two things: the result you wanted, and an **error** that says whether something went wrong.",
        "`nil` means \"nothing\". When `err` is `nil`, the call worked. When it isn't, `err` describes the problem.",
        "So the most common lines in Go are `if err != nil { ... }`: check right away, and deal with the problem before using the result.",
        "There's no try/catch for everyday errors. An error is an ordinary value you pass back up, like a note saying what failed.",
      ],
      tip: "Printing an error shows its message. Printing a `nil` error shows `<nil>`.",
    },
    {
      id: "d2-methods",
      level: "intermediate",
      task: "2.1",
      title: "Value and pointer receivers",
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
        "A **value receiver** gets a copy of the value, so any changes vanish when the method returns. A **pointer receiver** can change the caller's original.",
        "Use a pointer receiver when the method changes the value, when the struct is large, or when it holds a mutex. Stick to one style per type.",
        "The **method set** of `T` has only its value-receiver methods. The method set of `*T` has all of them. This decides which one satisfies an interface.",
        "**Embedding** a type lifts its fields and methods up to the outer type. It's composition, not inheritance: the inner methods never call the outer type's versions.",
      ],
      tip: "When asked \"value or pointer receiver?\", give the rule: if it changes the value, is large, or holds a lock, use a pointer. And be consistent across the type.",
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
        "A type satisfies an interface just by having the right methods; there's no `implements` keyword. Interfaces are usually written by the code that uses them, not by the type.",
        "An interface value holds two things: a concrete type and a value. It only equals nil when both are empty.",
        "So returning a nil `*MyErr` as an `error` gives you an interface that isn't nil. On success, return a plain `nil`.",
        "`v.(T)` panics if `v` doesn't hold a `T`, but `v, ok := x.(T)` just sets `ok` to false. A type switch checks for several types at once.",
        "`any` is just another name for `interface{}`, the interface every type satisfies.",
      ],
      tip: "The nil-interface trap is an interview favourite. Explain it with two boxes, type and value. A nil pointer of a real type still fills the type box, so the interface isn't nil.",
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
              { icon: "🧱", label: "ErrNotFound", sub: "A sentinel made with errors.New" },
              { icon: "🎁", label: "repo: %w", sub: "fmt.Errorf wraps it with context" },
              { icon: "🎁", label: "service: %w", sub: "Another layer adds more context" },
              { icon: "🔍", label: "errors.Is", sub: "Walks back through the chain and finds the sentinel" },
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
        "Errors are ordinary values, returned as the last result. Check them straight away: `if err != nil { return … }`.",
        "`fmt.Errorf(\"context: %w\", err)` **wraps** the error, keeping the original inside. `%v` only copies its text, which breaks the chain.",
        "`errors.Is(err, target)` looks for one specific error value anywhere in the chain. `errors.As(err, &ptr)` looks for an error of a particular type.",
        "`errors.Join` (Go 1.20 and later) combines several errors into one, and `Is` and `As` search all of them.",
      ],
      tip: "Say \"wrap with %w, check with errors.Is or errors.As, and never compare error strings\". That one sentence answers most error questions.",
    },
    {
      id: "d2-defer",
      level: "intermediate",
      task: "2.4",
      title: "defer, panic, and recover",
      check: ["d2-19", "d2-21"],
      visual: <DeferLab />,
      points: [
        "`defer` schedules a call to run when the surrounding function returns. Several deferred calls run last in, first out, like a stack of plates.",
        "The deferred call's arguments are worked out at the `defer` line. A deferred closure, on the other hand, reads variables when it finally runs.",
        "A deferred closure can change **named** results after `return` has set them.",
        "`recover()` only stops a panic when it's called directly in a deferred function, in the same goroutine that panicked.",
        "Defers run when the function exits, not at the end of each loop pass. Don't `defer f.Close()` inside a long loop.",
      ],
      tip: "For panics in goroutines, remember that an unrecovered panic in any goroutine crashes the whole program. Recover inside the goroutine itself.",
    },
  ],

  questions: [
    // ───────────── Start here ─────────────
    {
      id: "go-b2-01",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-structs",
      type: "output",
      prompt: "What does this print?",
      code: go`
        type Dog struct {
            Name string
            Age  int
        }

        d := Dog{Name: "Rex", Age: 3}
        fmt.Println(d.Name, d.Age)
      `,
      codeLang: "go",
      answers: ["Rex 3"],
      explanation:
        "The literal fills in both fields of the struct. `d.Name` reads \"Rex\" and `d.Age` reads 3, and `fmt.Println` prints them with a space between.",
    },
    {
      id: "go-b2-02",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-structs",
      prompt: "In `func (d Dog) Speak() string`, what is `(d Dog)`?",
      options: [
        "The receiver: it attaches `Speak` to the `Dog` type, and `d` is the dog the method is called on",
        "The list of values the method returns: `Speak` returns a `Dog` value named `d` to whoever calls it",
        "A second name for the method",
        "A comment explaining the method",
      ],
      answer: [0],
      explanation:
        "The part in brackets before the method name is the receiver. It makes `Speak` a method of `Dog`, so you can call `rex.Speak()`, and inside the method `d` is `rex`. The return type, `string`, comes after the name.",
    },
    {
      id: "go-b2-03",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-funcs",
      type: "output",
      prompt: "What does this print?",
      code: go`
        func add(a, b int) int {
            return a + b
        }

        fmt.Println(add(2, 3))
      `,
      codeLang: "go",
      answers: ["5"],
      explanation: "`add(2, 3)` runs the function with `a` set to 2 and `b` set to 3. It returns their sum, 5, which `Println` prints.",
    },
    {
      id: "go-b2-04",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-funcs",
      type: "output",
      prompt: "What does this print?",
      code: go`
        func divmod(a, b int) (int, int) {
            return a / b, a % b
        }

        q, r := divmod(7, 2)
        fmt.Println(q, r)
      `,
      codeLang: "go",
      answers: ["3 1"],
      explanation:
        "The function returns two values. 7 divided by 2 is 3 in whole numbers, with 1 left over, so `q` is 3 and `r` is 1.",
    },
    {
      id: "go-b2-05",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-errors",
      type: "output",
      prompt: "What does this print?",
      code: go`
        n, err := strconv.Atoi("42")
        fmt.Println(n, err)
      `,
      codeLang: "go",
      answers: ["42 <nil>"],
      explanation:
        "`strconv.Atoi` turns text into a number. \"42\" converts fine, so `n` is 42 and `err` is `nil`, which prints as `<nil>`.",
    },
    {
      id: "go-b2-06",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-errors",
      prompt: "What does `if err != nil { ... }` check for?",
      options: [
        "Whether the call failed, because a non-nil error means something went wrong",
        "Whether the call succeeded, because a nil error means it failed",
        "Whether the program has crashed",
        "Whether `err` is a number",
      ],
      answer: [0],
      explanation:
        "In Go, a `nil` error means everything worked. If `err` holds something, the call failed and `err` says why, so you handle it before using the result.",
    },
    // ───────────── Interview questions ─────────────
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
      explanation: "With a value receiver, `Inc` works on a copy of `c`. The copy goes up by one and is then thrown away. Use `func (c *Counter) Inc()` to change the original.",
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
      explanation: "`Area` has a pointer receiver, so only `*Square` has it in its method set, and a plain `Square` doesn't satisfy `Shape`. Use `&Square{side: 2}`.",
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
        "Go doesn't allow mixing value and pointer receivers on one type, so this won't compile",
      ],
      answer: [0],
      explanation:
        "Pointer types get every method, while value types only get value-receiver methods. You can still call `t.B()` on a variable, because Go quietly rewrites it as `(&t).B()`, but that doesn't change the method set.",
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
      explanation: "Embedding `Animal` lifts its fields and methods up into `Dog`, so `d.Hello()` and `d.Name` are short for `d.Animal.Hello()` and `d.Animal.Name`.",
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
        "`Greet` comes from `Base`, and its receiver is the embedded `Base` value, so `b.Name()` calls `Base.Name`. Embedding isn't inheritance, so nothing redirects the call to `Child.Name`. Use an interface if you need that behaviour.",
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
      explanation: "If every field can be compared, the struct can be compared with `==`, field by field. `&a == &b` compares two different addresses, so it's false.",
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
        "By registering it with the runtime in an `init()` function, which records which interfaces it implements",
      ],
      answer: [0],
      explanation: "A type satisfies an interface automatically, just by having the right methods. That lets you define an interface for a type you don't own.",
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
        "In a case with one type, `x` has that type, so for `int` the `x*2` works. In a case with several types, `x` keeps the interface type, but `%T` prints the real type inside: `string`. 2.5 is a float64, so it lands in `default`.",
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
        "Compile error: impossible type assertion, since `x` holds a string and can never be an `int`",
      ],
      answer: [0],
      explanation: "The comma-ok form reports a mismatch by giving the zero value and `false`. The single-value form panics when the type inside doesn't match. And type assertions never convert a string into a number.",
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
        "Returning `e` puts a nil `*MyErr` inside an `error` interface, and the interface's type is now `*MyErr`. An interface is only nil when both its type and value are empty, so this one isn't. Return a plain `nil` on success.",
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
        "`err` has the concrete type `*ValidationError`. Returning it as an `error` makes an interface holding that type with a nil value, which isn't nil. Declare `var err error` instead, or `return nil` on success.",
    },
    {
      id: "d2-12",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-interfaces",
      prompt: "Which is the idiomatic Go guidance for interfaces?",
      options: [
        "Accept interfaces, return concrete types; keep interfaces small and define them where they're used",
        "Define a large interface right next to every struct, so that each one can be mocked in tests",
        "Return interfaces from constructors so the type can change later",
        "Prefix interface names with I, like `IReader`",
      ],
      answer: [0],
      explanation: "Small interfaces written where they're used (often just one method, like `io.Reader`) keep packages loosely tied together. Because types satisfy them automatically, the type's author never needs to know they exist.",
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
      explanation: "These tiny interfaces are all over the standard library, and anything with the right methods plugs straight into them.",
    },
    {
      id: "d2-27",
      domain: "d2",
      level: "staff",
      lesson: "d2-interfaces",
      prompt:
        "A platform team owns a `Store` type with 40 methods and exports a matching 40-method `Storage` interface. Every consuming team writes huge mocks, and adding a method breaks them all. What's the idiomatic fix?",
      options: [
        "Drop the big interface, export the concrete `*Store`, and let each consumer declare the one- to three-method interface it actually uses",
        "Split `Store` into 40 packages, one per method",
        "Generate mocks for the 40-method interface in CI so nobody writes them by hand, and keep passing the full interface to every consumer that needs any part of it",
        "Have every method take `any` so the interface never changes",
      ],
      answer: [0],
      explanation:
        "Because interfaces are satisfied automatically, `*Store` fits any small interface a consumer writes. Adding a method to `Store` then breaks nobody, and each test only fakes what it uses.",
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
      explanation: "Wrapping creates a new error, so comparing it with `==` to the sentinel is false. `errors.Is` unwraps the chain and finds it. In the message, the wrapped error's text appears where `%w` was.",
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
      explanation: "`%v` turns the error into text and throws the original value away, so there's nothing left to unwrap. Use `%w` to wrap it instead.",
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
      explanation: "`errors.As` walks back through the chain looking for an error of type `*NotFound`. It finds the wrapped one and stores it in `nf`. The target is `&nf`, a pointer to the variable, which is exactly what it needs.",
    },
    {
      id: "d2-17",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-errors",
      prompt: "Which are good Go error-handling practices? (Choose two.)",
      options: [
        "Add context when returning an error up the stack, for example `fmt.Errorf(\"load config: %w\", err)`",
        "Check for sentinel errors with `errors.Is` rather than `==` or string matching",
        "Use `panic` for expected failures like a missing file",
        "Log the error and also return it at every layer",
        "Start error strings with a capital letter and end them with a period",
      ],
      answer: [0, 1],
      explanation: "Wrap with context, and check with `errors.Is` or `errors.As`. Panics are for bugs, logging at every layer fills the logs with duplicates, and Go style is lowercase error messages with no full stop at the end.",
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
        "`true`, then `[disk full quota exceeded]` on one line",
        "`false`, then `disk full`",
      ],
      answer: [0],
      explanation: "`errors.Join` (Go 1.20 and later) wraps several errors, and `errors.Is` checks each one. Its message is each error's message on its own line.",
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
      explanation: "Each `defer` reads `i` straight away and saves the call. They all run when the function returns, last in first out, after `go ` has already been printed.",
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
      explanation: "A deferred call's arguments are worked out when the `defer` line runs, when x is still 1. The call itself runs when the function exits. Wrap it in a closure if you want the latest value.",
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
      explanation: "`return n + 1` first sets the named result `n` to 4. Then the deferred closure runs and doubles it to 8. This is how deferred code can change a returned error.",
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
        "Dividing an integer by zero panics while the program runs. The deferred closure calls `recover`, which stops the panic, and sets the named result `err`. `q` keeps its zero value of 0.",
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
        "Deferred calls run when `process` returns, not at the end of each loop pass, so every file stays open until the whole loop is done. Move the loop body into a helper function with its own defer, or close each file yourself.",
    },
    {
      id: "d2-24",
      domain: "d2",
      level: "staff",
      lesson: "d2-defer",
      prompt: "Your team is setting conventions for a shared library. When should its code panic instead of returning an error?",
      options: [
        "Only for programmer bugs or impossible states; public APIs return errors, and panics used internally are recovered and converted before crossing the package boundary",
        "Whenever an error is serious enough that callers should notice it, since a panic can't be ignored the way a returned error can, and callers can always add `recover` if they want to keep going",
        "Never return errors; panic, and let callers recover",
        "Call `log.Fatal` instead, so the process restarts cleanly",
      ],
      answer: [0],
      explanation:
        "Go's convention is that a package's public functions return errors, even if the package panics internally. Expected failures like I/O problems, bad input and timeouts are errors. `log.Fatal` in a library takes the decision away from the application.",
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
        "The goroutine exits silently and the rest of the program continues, because net/http recovers panics from every goroutine a handler starts",
      ],
      answer: [0],
      explanation:
        "An unrecovered panic in any goroutine ends the whole program. Background goroutines in a server need their own `defer func() { if r := recover(); r != nil { … } }()`, or a helper that wraps every `go` statement.",
    },
    {
      id: "d2-26",
      domain: "d2",
      level: "senior",
      lesson: "d2-defer",
      type: "order",
      prompt: "A function with a deferred `recover()` hits an index-out-of-range panic. Put what happens in order.",
      items: [
        "Normal execution of the function stops at the failing line",
        "The function's deferred calls start running, last in first out",
        "A deferred function calls `recover()`, gets the panic value, and the panic stops",
        "The function returns normally to its caller, with its named results as the defers left them",
      ],
      explanation: "`recover` only does anything inside a deferred call while a panic is happening. After it, the function that deferred it returns normally. Without it, the panic keeps travelling up the goroutine's call stack.",
    },
  ],

  cards: [
    { id: "c2-is", domain: "d2", kind: "service", term: "errors.Is", definition: "Reports whether any error in the chain matches the target. For example, errors.Is(err, fs.ErrNotExist)." },
    { id: "c2-as", domain: "d2", kind: "service", term: "errors.As", definition: "Finds the first error in the chain of the target's type and stores it in the target, as in errors.As(err, &ptr)." },
    { id: "c2-errorf", domain: "d2", kind: "service", term: "fmt.Errorf with %w", definition: "Creates an error with context that wraps the original, so errors.Is and errors.As can still find it." },
    { id: "c2-join", domain: "d2", kind: "service", term: "errors.Join", definition: "From Go 1.20, combines several errors into one. Is and As search all of them, and the message puts each one on its own line." },
    { id: "c2-recover", domain: "d2", kind: "service", term: "recover", definition: "When called in a deferred function, it stops a panic in the same goroutine and returns the panic value." },
    { id: "c2-any", domain: "d2", kind: "service", term: "any", definition: "Another name for interface{}: an interface with no methods, which every type satisfies." },
    { id: "c2-stringer", domain: "d2", kind: "service", term: "fmt.Stringer", definition: "The interface with one method, String() string. fmt uses it when you print a value with %v or Println." },
    { id: "c2-reader", domain: "d2", kind: "service", term: "io.Reader", definition: "The interface with one method, Read(p []byte) (n int, err error). It's the building block for reading streams of data." },
    { id: "c2-methodset", domain: "d2", kind: "concept", term: "Method set", definition: "The methods a type counts as having when matching interfaces. T has its value-receiver methods, and *T has all of them." },
    { id: "c2-embedding", domain: "d2", kind: "concept", term: "Embedding", definition: "Putting a type inside a struct without a field name, so its fields and methods are lifted up. It's composition, not inheritance." },
    { id: "c2-nilif", domain: "d2", kind: "concept", term: "Nil interface trap", definition: "An interface holding a nil pointer of a real type isn't nil, because its type half is filled in." },
    { id: "c2-defer", domain: "d2", kind: "concept", term: "defer", definition: "Schedules a call for when the function returns. Its arguments are worked out straight away, and several defers run last in, first out." },
    { id: "c2-sentinel", domain: "d2", kind: "concept", term: "Sentinel error", definition: "A fixed error value at package level, like io.EOF or sql.ErrNoRows, that callers check for with errors.Is." },
  ],

  challenges: [
    {
      id: "ch-go-defer",
      domain: "d2",
      lesson: "d2-defer",
      title: "Predict the named result",
      goal: "With func f() (n int) selected, predict what f() returns.",
      hint: "return n + 1 sets the named result first. Then the defers run in reverse order, and one of them multiplies n.",
      takeaway: "Deferred closures run after return has set the named results, so they can change what's returned. The arguments to defer itself were fixed much earlier.",
      render: (onSolved) => <DeferLab goal="named" onSolved={onSolved} />,
    },
    {
      id: "ch-go-defer-plain",
      domain: "d2",
      lesson: "d2-defer",
      title: "Unnamed result, same defers",
      goal: "Switch to func f() int and predict what it returns.",
      hint: "Without a named result, the return value is copied out before the defers run. Can they still reach it?",
      takeaway: "Defers can only change named results. With an unnamed result, return n + 1 freezes the value before any defer runs.",
      render: (onSolved) => <DeferLab goal="plain" onSolved={onSolved} />,
    },
  ],
});
