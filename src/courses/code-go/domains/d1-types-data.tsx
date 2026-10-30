import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { go } from "../go";
import { SliceLab } from "../labs";
import { RuneExplorer } from "../visuals";

/** Module 1: values and data — declarations, zero values, slices, maps, strings and runes. */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "Types, Slices & Maps",
    world: "The Slice Steppes",
    weight: 25,
    emoji: "🦫",
    color: "#00add8",
    summary:
      "Declaring variables and their zero values, arrays and slices, how append can share memory, maps and their traps, and how strings, bytes and runes fit together.",
  },

  tasks: [
    {
      id: "1.1",
      title: "Declarations, zero values, and constants",
      covers: ["var and :=", "The zero value of every type", "Block scope and shadowing", "Untyped constants", "for and range (including range over an int)"],
    },
    {
      id: "1.2",
      title: "Arrays and slices",
      covers: ["Arrays are values; slices are views onto an array", "len, cap, and the backing array", "When append shares memory and when it copies", "The full slice expression a[low:high:max]"],
    },
    {
      id: "1.3",
      title: "Maps",
      covers: ["nil maps", "The comma-ok idiom", "Iteration order isn't fixed", "You can't take the address of a map element", "Using maps from several goroutines"],
    },
    {
      id: "1.4",
      title: "Strings, bytes, and runes",
      covers: ["Strings are byte sequences that can't change", "UTF-8 and how range decodes runes", "Building strings efficiently"],
    },
  ],

  lessons: [
    {
      id: "d1-start-hello",
      level: "beginner",
      task: "1.1",
      title: "What Go is and your first program",
      check: ["go-b1-01", "go-b1-02"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="go"
            code={go`
              package main

              import "fmt"

              func main() {
                  fmt.Println("Hello, Go!")
              }
            `}
          />
          <Flow
            color="#00add8"
            steps={[
              { icon: "✍️", label: "Write main.go", sub: "Plain text you can read" },
              { icon: "🔧", label: "go run main.go", sub: "Go compiles it and runs it in one step" },
              { icon: "🖥️", label: "See the output", sub: "Hello, Go!" },
            ]}
          />
        </div>
      ),
      points: [
        "**Go** is a programming language from Google, popular for web servers, cloud tools and command-line programs. It's known for being simple and fast.",
        "Every Go program starts in `package main`, at a function called `main`. That's where the computer begins reading your instructions.",
        "`import \"fmt\"` brings in the formatting package, and `fmt.Println(...)` prints a line of text.",
        "To run a file, type `go run main.go` in a terminal. Go checks your code, builds it and runs it.",
      ],
      tip: "Go is strict in a helpful way. If you import a package or create a variable and never use it, the program won't compile until you tidy it up.",
    },
    {
      id: "d1-start-vars",
      level: "beginner",
      task: "1.1",
      title: "Variables and their starting values",
      check: ["go-b1-03", "go-b1-04"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="go"
            code={go`
              name := "Gopher"   // a string; Go works out the type
              age := 13          // an int
              var score int      // declared with no value: starts at 0
              var ready bool     // starts at false
              fmt.Println(name, age, score, ready)  // Gopher 13 0 false
            `}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🔢", title: "int", text: "Whole numbers. Starts at 0.", color: "#00add8" },
              { icon: "🔤", title: "string", text: "Text in double quotes. Starts as \"\" (empty).", color: "#34d399" },
              { icon: "✅", title: "bool", text: "true or false. Starts at false.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "A **variable** is a named box that holds a value. Each box has a **type**, such as `int` for whole numbers or `string` for text.",
        "`x := 5` is the quick way to make a new variable. Go looks at the value and picks the type for you.",
        "`var score int` makes a variable without giving it a value. It isn't empty junk: it starts at the type's **zero value**, which is 0 for numbers.",
        "To change a variable that already exists, use plain `=`, as in `score = 10`.",
      ],
      tip: "Think of `:=` as \"create\" and `=` as \"update\". You can only create a name once in the same block.",
    },
    {
      id: "d1-start-slices",
      level: "beginner",
      task: "1.2",
      title: "Slices: lists that can grow",
      check: ["go-b1-05", "go-b1-06"],
      visual: (
        <CodeBlock
          lang="go"
          code={go`
            fruits := []string{"apple", "banana"}
            fmt.Println(fruits[0])      // apple  (counting starts at 0)
            fruits = append(fruits, "cherry")
            fmt.Println(len(fruits))    // 3
            for i, f := range fruits {
                fmt.Println(i, f)       // 0 apple, 1 banana, 2 cherry
            }
          `}
        />
      ),
      points: [
        "A **slice** holds a list of values of one type, in order, like a numbered shopping list. `[]string` is a slice of strings.",
        "Positions start at 0, so `fruits[0]` is the first item. `len(fruits)` tells you how many there are.",
        "`append` adds items to the end and gives you back the updated slice. Always store the result: `fruits = append(fruits, \"cherry\")`.",
        "`for i, f := range fruits` visits every item, giving you its position `i` and the value `f`.",
      ],
      tip: "Don't need the position in a `range` loop? Write `_` in its place, as in `for _, f := range fruits`. Go would otherwise complain about an unused variable.",
    },
    {
      id: "d1-zero",
      level: "junior",
      task: "1.1",
      title: "Every type has a zero value",
      check: ["d1-01", "d1-03"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "0️⃣", title: "Numbers", text: "`int`, `float64` and the rest start at `0`", color: "#00add8" },
              { icon: "🔤", title: "Strings", text: "`\"\"` (the empty string), never nil", color: "#34d399" },
              { icon: "⚪", title: "Booleans", text: "`false`", color: "#a78bfa" },
              { icon: "🕳️", title: "nil", text: "Pointers, slices, maps, channels, funcs and interfaces", color: "#f59e0b" },
              { icon: "🧱", title: "Structs", text: "Every field set to its own zero value", color: "#f472b6" },
              { icon: "📦", title: "Arrays", text: "Every element set to its zero value", color: "#fb7185" },
            ]}
          />
          <CodeBlock
            lang="go"
            code={go`
              var count int          // 0, usable right away
              name := "gopher"       // := declares AND assigns (functions only)
              var cfg struct{ Port int }
              for i := range 3 {     // Go 1.22+: 0, 1, 2
                  count += i
              }
            `}
          />
        </div>
      ),
      points: [
        "`var x T` gives `x` the **zero value** of type T. Go never hands you memory with random leftovers in it.",
        "`:=` declares and assigns in one go, but it only works inside functions. At package level, use `var`.",
        "Unused local variables and unused imports are compile errors in Go, not just warnings.",
        "`:=` inside an inner block, like `if x := …;`, creates a brand new variable that hides the outer one. This is called **shadowing**.",
        "Constants have no fixed type until you use them, and maths on constants is exact. Nothing overflows until the value is converted to a real type.",
      ],
      tip: "Interviewers like the phrase \"make the zero value useful\". A `sync.Mutex`, a `bytes.Buffer` or a nil slice all work straight away, with no constructor.",
    },
    {
      id: "d1-slices",
      level: "intermediate",
      task: "1.2",
      title: "Slices share backing arrays",
      check: ["d1-09", "d1-11"],
      visual: <SliceLab />,
      points: [
        "An array like `[4]int` is a value. Assigning it or passing it to a function copies every element.",
        "A slice is a small **header** (a pointer, a length and a capacity) that looks onto a **backing array**. Copying a slice copies the header, not the data.",
        "If there's spare capacity (len < cap), `append` writes into the shared array, so other slices over it see the change. Past the capacity, it allocates a new array.",
        "Always use the result: `s = append(s, x)`. The old header may still point at the old array.",
        "`a[low:high:max]` limits the capacity, so a later append has to copy instead of overwriting `a`'s elements.",
      ],
      tip: "Draw the backing array, then two brackets for the two slices. Saying \"len is less than cap, so append overwrites the shared slot\" is exactly what interviewers want to hear.",
    },
    {
      id: "d1-maps",
      level: "junior",
      task: "1.3",
      title: "Maps: hash tables with sharp edges",
      check: ["d1-16", "d1-19"],
      visual: (
        <div className="grid gap-4">
          <CodeCompare
            lang="go"
            left={{
              title: "Trap: writing to a nil map",
              code: go`
                var m map[string]int
                fmt.Println(m["x"]) // 0: reads are fine
                m["x"] = 1          // panic: assignment to
                                    // entry in nil map
              `,
            }}
            right={{
              title: "Fix: make it first",
              code: go`
                m := make(map[string]int)
                m["x"]++
                if v, ok := m["y"]; !ok {
                    fmt.Println("no y, v =", v) // v is 0
                }
              `,
            }}
          />
          <CodeCompare
            lang="go"
            left={{
              title: "Trap: you can't change a struct inside a map",
              code: go`
                users := map[string]User{"ann": {}}
                users["ann"].Visits++ // compile error
              `,
            }}
            right={{
              title: "Fix: copy it out and back, or store pointers",
              code: go`
                u := users["ann"]
                u.Visits++
                users["ann"] = u
              `,
            }}
          />
        </div>
      ),
      points: [
        "A nil map reads like an empty map, but writing to it panics. Create maps with `make` or a literal like `map[string]int{}`.",
        "`v, ok := m[k]` tells you whether the key is really there, so you can tell \"missing\" apart from \"present with the value 0\".",
        "The order you get when looping over a map isn't fixed, and Go changes it on purpose between runs. Sort the keys if order matters.",
        "You can't take the address of a map element. Both `&m[k]` and `m[k].Field = x` are compile errors.",
        "Maps aren't safe for writes from several goroutines at once. Doing that without a lock can crash the whole program.",
      ],
      tip: "If you're asked for output in a fixed order from a map, collect the keys, call `slices.Sort(keys)`, then loop over the sorted keys.",
    },
    {
      id: "d1-strings",
      level: "intermediate",
      task: "1.4",
      title: "Strings are bytes, runes are characters",
      check: ["d1-22", "d1-23"],
      visual: <RuneExplorer />,
      points: [
        "A string is a sequence of bytes that can't be changed, usually holding UTF-8 text. `len(s)` counts bytes, not characters.",
        "`s[i]` gives you a single byte. `for i, r := range s` decodes **runes** (Unicode code points, stored as int32), and `i` is the byte position where each starts.",
        "`[]rune(s)` converts the string to code points. `utf8.RuneCountInString(s)` counts them without making a new slice.",
        "Because strings can't change in place, `+=` in a loop copies the whole string every time. Use `strings.Builder` instead.",
      ],
      tip: "For \"reverse a string\", say whether you're reversing bytes or runes. Reversing bytes breaks characters that take several bytes, like é.",
    },
  ],

  questions: [
    // ───────────── Start here ─────────────
    {
      id: "go-b1-01",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-hello",
      type: "output",
      prompt: "What does this program print?",
      code: go`
        package main

        import "fmt"

        func main() {
            fmt.Println("Hello, Go!")
        }
      `,
      codeLang: "go",
      answers: ["Hello, Go!"],
      explanation:
        "The program starts in `main`, and its one line calls `fmt.Println`, which prints the text and moves to a new line. The double quotes mark the text as a string but aren't printed.",
    },
    {
      id: "go-b1-02",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-hello",
      prompt: "Where does a Go program start running?",
      options: [
        "At the `main` function in `package main`",
        "At the first line of the file, whatever it is",
        "At whichever function has the shortest name",
        "At the `import` line",
      ],
      answer: [0],
      explanation:
        "Go always begins at `func main()` inside `package main`. The `package` and `import` lines just set things up; the real work starts in `main`.",
    },
    {
      id: "go-b1-03",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-vars",
      type: "output",
      prompt: "What does this print?",
      code: go`
        x := 5
        x = x + 3
        fmt.Println(x)
      `,
      codeLang: "go",
      answers: ["8"],
      explanation:
        "`x := 5` creates `x` and puts 5 in it. `x = x + 3` updates the same variable to 8, using plain `=` because `x` already exists.",
    },
    {
      id: "go-b1-04",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-vars",
      type: "output",
      prompt: "What does this print?",
      code: go`
        var count int
        var ready bool
        fmt.Println(count, ready)
      `,
      codeLang: "go",
      answers: ["0 false"],
      explanation:
        "Neither variable was given a value, so each starts at its type's zero value: 0 for an `int` and `false` for a `bool`. `fmt.Println` puts a space between the two.",
    },
    {
      id: "go-b1-05",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-slices",
      type: "output",
      prompt: "What does this print?",
      code: go`
        fruits := []string{"apple", "banana"}
        fruits = append(fruits, "cherry")
        fmt.Println(len(fruits), fruits[0])
      `,
      codeLang: "go",
      answers: ["3 apple"],
      explanation:
        "`append` adds \"cherry\" to the end, so the slice now has 3 items. Positions start at 0, so `fruits[0]` is still \"apple\".",
    },
    {
      id: "go-b1-06",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-slices",
      type: "fill",
      prompt: "Fill the gap so \"kiwi\" is added to the end of the slice.",
      code: go`
        fruits := []string{"apple"}
        fruits = {{1}}(fruits, "kiwi")
        fmt.Println(fruits)  // [apple kiwi]
      `,
      codeLang: "go",
      blanks: [{ options: ["append", "add", "push", "insert"], answer: 0 }],
      explanation:
        "Go's built-in `append` adds items to a slice and returns the updated slice, which you store back in `fruits`. `add`, `push` and `insert` aren't Go built-ins.",
    },
    // ───────────── Interview questions ─────────────
    {
      id: "d1-01",
      domain: "d1",
      level: "junior",
      lesson: "d1-zero",
      prompt: "What does this print?",
      code: go`
        var s []int
        var m map[string]int
        var p *int
        fmt.Println(s == nil, m == nil, p == nil, len(s))
      `,
      codeLang: "go",
      options: ["`true true true 0`", "`false false true 0`", "`true true true nil`", "It panics: `len` of a nil slice"],
      answer: [0],
      explanation: "Slices, maps and pointers all start as `nil`. Asking for the `len` of a nil slice (or a nil map) is fine and gives 0.",
    },
    {
      id: "d1-02",
      domain: "d1",
      level: "junior",
      lesson: "d1-zero",
      prompt: "What does this print?",
      code: go`
        type Point struct {
            X, Y int
            Name string
        }

        var p Point
        fmt.Printf("%d %d %q\n", p.X, p.Y, p.Name)
      `,
      codeLang: "go",
      options: ["`0 0 \"\"`", "`<nil>`", "It panics with a nil pointer dereference", "`0 0 <nil>`"],
      answer: [0],
      explanation:
        "A struct's zero value has every field at its own zero value: 0 for the ints and the empty string for `Name`, which `%q` shows as `\"\"`. A struct value is never nil.",
    },
    {
      id: "d1-03",
      domain: "d1",
      level: "junior",
      lesson: "d1-zero",
      type: "lines",
      prompt: "This file doesn't compile. Tap the line the compiler rejects.",
      code: go`
        package main

        import "fmt"

        x := 10

        func main() {
            y := 20
            fmt.Println(x, y)
        }
      `,
      codeLang: "go",
      answer: [5],
      explanation: "`:=` is only allowed inside a function. At package level, write `var x = 10` (or `var x int = 10`).",
    },
    {
      id: "d1-04",
      domain: "d1",
      level: "junior",
      lesson: "d1-zero",
      prompt: "Which of these are compile errors in Go? (Choose two.)",
      options: [
        "An unused local variable",
        "An unused import",
        "An unused function parameter",
        "An unused package-level variable",
        "Shadowing an outer variable inside an `if` block",
      ],
      answer: [0, 1],
      explanation:
        "Go rejects unused local variables and unused imports to keep code tidy. Unused parameters and package-level variables are allowed, and shadowing is legal too, though linters may warn about it.",
    },
    {
      id: "d1-05",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-zero",
      prompt: "What does this print?",
      code: go`
        x := 1
        if x := 2; x > 1 {
            x++
            fmt.Println(x)
        }
        fmt.Println(x)
      `,
      codeLang: "go",
      options: ["`3` then `1`", "`3` then `3`", "`2` then `1`", "Compile error: `x` redeclared"],
      answer: [0],
      explanation:
        "The `x := 2` in the `if` line creates a new `x` that only lives inside the `if` block and hides the outer one. That inner `x` becomes 3 and is printed. The outer `x` is still 1.",
    },
    {
      id: "d1-06",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-zero",
      prompt: "What does this print?",
      code: go`
        a := 7
        b := 2
        f := float64(a / b)
        fmt.Println(f, a%b, -7/2)
      `,
      codeLang: "go",
      options: ["`3 1 -3`", "`3.5 1 -3`", "`3 1 -4`", "`3.5 1 -4`"],
      answer: [0],
      explanation:
        "`a / b` is integer division, which gives 3 before the conversion happens. So `f` is 3.0, and `Println` shows it as `3`. Integer division rounds toward zero, so `-7/2` is `-3`.",
    },
    {
      id: "d1-07",
      domain: "d1",
      level: "senior",
      lesson: "d1-zero",
      prompt: "What happens?",
      code: go`
        const big = 1 << 40
        var x int32 = big >> 30
        fmt.Println(x)
      `,
      codeLang: "go",
      options: ["It prints `1024`", "Compile error: constant overflows `int32`", "It prints `0`", "It panics at run time with an overflow"],
      answer: [0],
      explanation:
        "`big` is an untyped constant, and maths on constants is done exactly, at compile time. `big >> 30` is 1024, which fits in an int32. Only `var x int32 = big` would overflow.",
    },
    {
      id: "d1-27",
      domain: "d1",
      level: "junior",
      lesson: "d1-zero",
      prompt: "In Go 1.22 or later, what does this print?",
      code: go`
        for i := range 3 {
            fmt.Print(i)
        }
      `,
      codeLang: "go",
      options: ["`012`", "`123`", "`0123`", "Compile error: cannot range over 3"],
      answer: [0],
      explanation: "Since Go 1.22 you can range over a whole number n, which gives you 0 up to n minus 1.",
    },
    {
      id: "d1-08",
      domain: "d1",
      level: "junior",
      lesson: "d1-slices",
      prompt: "What does this print?",
      code: go`
        a := [3]int{1, 2, 3}
        b := a
        b[0] = 9
        s := a[:]
        s[1] = 8
        fmt.Println(a, b)
      `,
      codeLang: "go",
      options: ["`[1 8 3] [9 2 3]`", "`[9 8 3] [9 8 3]`", "`[1 2 3] [9 2 3]`", "`[9 8 3] [9 2 3]`"],
      answer: [0],
      explanation:
        "Arrays are values, so `b := a` copies all three elements, and `b[0] = 9` only changes `b`. `a[:]` is a slice looking at `a`'s own array, so `s[1] = 8` changes `a`.",
    },
    {
      id: "d1-09",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-slices",
      prompt: "What does this print?",
      code: go`
        a := []int{1, 2, 3, 4}
        b := a[:2]
        b = append(b, 99)
        fmt.Println(a, len(b), cap(b))
      `,
      codeLang: "go",
      options: ["`[1 2 99 4] 3 4`", "`[1 2 3 4] 3 4`", "`[1 2 3 4] 3 8`", "`[1 2 99 4] 3 3`"],
      answer: [0],
      explanation:
        "`b` has length 2 but capacity 4, because it reaches to the end of `a`'s array. Since there's spare room, `append` puts 99 into the shared array at index 2, which is `a[2]`.",
    },
    {
      id: "d1-10",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-slices",
      prompt: "What does this print?",
      code: go`
        a := make([]int, 3, 3)
        b := append(a, 4)
        b[0] = 7
        fmt.Println(a[0], b[0])
      `,
      codeLang: "go",
      options: ["`0 7`", "`7 7`", "`0 0`", "It panics: index out of range"],
      answer: [0],
      explanation:
        "`a` is full (length 3, capacity 3), so `append` allocates a new, bigger array and copies into it. After that, `b` and `a` don't share memory, so changing `b[0]` leaves `a[0]` alone.",
    },
    {
      id: "d1-11",
      domain: "d1",
      level: "senior",
      lesson: "d1-slices",
      prompt: "What does this print?",
      code: go`
        a := []int{1, 2, 3, 4}
        b := a[:2:2]
        b = append(b, 99)
        fmt.Println(a, cap(b) >= 3)
      `,
      codeLang: "go",
      options: ["`[1 2 3 4] true`", "`[1 2 99 4] true`", "`[1 2 99 4] false`", "Compile error: invalid slice index"],
      answer: [0],
      explanation:
        "The full slice expression `a[:2:2]` sets `b`'s capacity to 2, so the append can't write into `a`'s array. It allocates a new array with room for at least 3, and `a` isn't touched.",
    },
    {
      id: "d1-12",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-slices",
      type: "lines",
      prompt: "This prints `0`, not `1`. Tap the line where the appended element is lost.",
      code: go`
        func addItem(items []string, it string) {
            items = append(items, it)
        }

        func main() {
            var cart []string
            addItem(cart, "apple")
            fmt.Println(len(cart))
        }
      `,
      codeLang: "go",
      answer: [2],
      explanation:
        "The slice header is passed by value, so the function gets its own copy. `append` on a nil slice allocates a new array, and the result only lands in the local `items`. Return it instead, with `func addItem(...) []string`, then write `cart = addItem(cart, \"apple\")`.",
    },
    {
      id: "d1-13",
      domain: "d1",
      level: "senior",
      lesson: "d1-slices",
      prompt: "What does this print?",
      code: go`
        nums := []int{1, 2, 3}
        for i, v := range nums {
            if i == 0 {
                nums = append(nums, 4)
                nums[1] = 20
            }
            fmt.Print(v, " ")
        }
      `,
      codeLang: "go",
      options: ["`1 2 3`", "`1 20 3`", "`1 20 3 4`", "`1 2 3 4`"],
      answer: [0],
      explanation:
        "The thing being ranged over is worked out once, so the loop walks the original 3-item array. That literal has capacity 3, so `append` moves `nums` to a new array, and `nums[1] = 20` writes there, not into the array the loop is reading.",
    },
    {
      id: "d1-14",
      domain: "d1",
      level: "junior",
      lesson: "d1-slices",
      type: "match",
      prompt: "Match each built-in to what it does.",
      pairs: [
        ["`len(s)`", "Number of elements the slice currently holds"],
        ["`cap(s)`", "Elements from the slice's start to the end of its backing array"],
        ["`make([]T, n, c)`", "Allocate a slice with length n and capacity c"],
        ["`copy(dst, src)`", "Copy min(len(dst), len(src)) elements and return that count"],
        ["`append(s, xs...)`", "Add elements, allocating a new array if capacity runs out"],
      ],
      explanation: "These five built-ins cover almost all slice work. `copy` never makes `dst` bigger, which is why you size it with `make` first.",
    },
    {
      id: "d1-15",
      domain: "d1",
      level: "staff",
      lesson: "d1-slices",
      prompt:
        "A service reads a 10 MB file into `data`, then keeps `header := data[:64]` in a long-lived cache. Memory grows with every file. What's the best fix?",
      options: [
        "Copy the 64 bytes into their own slice (`bytes.Clone(data[:64])`) so the 10 MB array can be collected",
        "Call `runtime.GC()` after each request",
        "Store `data[:64:64]` instead, to cap the slice",
        "Set `data = nil` right after slicing",
      ],
      answer: [0],
      explanation:
        "Any slice keeps its whole backing array alive. Capping with `[:64:64]` still points into the same 10 MB array, and `data = nil` doesn't help because `header` still refers to it. Copying the bytes breaks the link.",
    },
    {
      id: "d1-26",
      domain: "d1",
      level: "staff",
      lesson: "d1-slices",
      prompt:
        "A shared library exports `func (r *Registry) Plugins() []Plugin { r.mu.RLock(); defer r.mu.RUnlock(); return r.plugins }`. Other teams edit and append to the result, and the race detector fires. What's the best fix that keeps the signature?",
      options: [
        "Return `slices.Clone(r.plugins)` while holding the read lock",
        "Return `r.plugins[:len(r.plugins):len(r.plugins)]`",
        "Document \"do not modify the result\" and leave the code",
        "Switch `RLock` to `Lock`",
      ],
      answer: [0],
      explanation:
        "The lock only protects the moment the header is read. After that, callers touch the shared array with no lock at all. Returning a copy gives each caller its own array. Capping the capacity stops appends from overwriting, but writes by index still race.",
    },
    {
      id: "d1-16",
      domain: "d1",
      level: "junior",
      lesson: "d1-maps",
      prompt: "What happens?",
      code: go`
        var m map[string]int
        fmt.Println(m["x"], len(m))
        m["x"] = 1
        fmt.Println(m)
      `,
      codeLang: "go",
      options: [
        "It prints `0 0`, then panics: assignment to entry in nil map",
        "It prints `0 0` then `map[x:1]`",
        "It panics on the first `Println`: nil map read",
        "Compile error: `m` is not initialized",
      ],
      answer: [0],
      explanation:
        "Reading from a nil map gives the zero value and `len` is 0, but writing to it panics. Create it first with `m := make(map[string]int)` or a map literal.",
    },
    {
      id: "d1-17",
      domain: "d1",
      level: "junior",
      lesson: "d1-maps",
      prompt: "What does this print?",
      code: go`
        m := map[string]int{"a": 0}
        v, ok := m["a"]
        w, ok2 := m["b"]
        fmt.Println(v, ok, w, ok2)
      `,
      codeLang: "go",
      options: ["`0 true 0 false`", "`0 true <nil> false`", "`0 false 0 false`", "It panics: key \"b\" not found"],
      answer: [0],
      explanation:
        "The comma-ok form tells \"present with value 0\" (`ok` is true) apart from \"missing\" (`ok` is false, and the value is the zero value). Looking up a missing key never panics.",
    },
    {
      id: "d1-18",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-maps",
      prompt: "Which statements about Go maps are true? (Choose two.)",
      options: [
        "Iteration order is not specified, and the runtime deliberately varies it between runs",
        "Unsynchronized concurrent writes can crash the program with a fatal error",
        "Maps iterate in insertion order",
        "A slice can be a map key if its elements are comparable",
        "Reading a missing key panics",
      ],
      answer: [0, 1],
      explanation:
        "Never rely on the order of a `range` over a map. (`fmt` prints maps with sorted keys, which can hide this.) Keys must be comparable, which rules out slices, maps and funcs. The runtime spots many concurrent map writes and stops with \"concurrent map writes\".",
    },
    {
      id: "d1-19",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-maps",
      type: "lines",
      prompt: "This doesn't compile. Tap the line the compiler rejects.",
      code: go`
        type User struct{ Visits int }

        func main() {
            users := map[string]User{"ann": {}}
            users["ann"].Visits++
            fmt.Println(users["ann"].Visits)
        }
      `,
      codeLang: "go",
      answer: [5],
      explanation:
        "You can't take the address of a map element, so you can't assign to a field of a struct stored in a map. Copy it out, change it and store it back, or use `map[string]*User`.",
    },
    {
      id: "d1-20",
      domain: "d1",
      level: "senior",
      lesson: "d1-maps",
      prompt: "Why does Go forbid taking the address of a map element (`&m[k]`)?",
      options: [
        "Entries can move when the map grows, so the pointer could end up pointing at stale memory",
        "Map values are always stored on the stack",
        "Only keys are hashed, so values have no fixed type",
        "Taking addresses is only allowed for package-level variables",
      ],
      answer: [0],
      explanation:
        "As a map grows, it can move its entries around. If you could hold `&m[k]`, the pointer would quietly go out of date, so the language doesn't let you take it.",
    },
    {
      id: "d1-21",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-maps",
      prompt: "What happens if you `delete` entries from a map inside a `for k := range m` loop over that same map (in one goroutine)?",
      options: [
        "It's allowed; an entry deleted before the loop reaches it won't be produced",
        "It panics with \"concurrent map iteration and map write\"",
        "It's a compile error",
        "The loop restarts from the beginning",
      ],
      answer: [0],
      explanation:
        "The Go spec says deleting during `range` is fine: entries you remove before the loop reaches them are skipped. Entries you add during the loop may or may not show up.",
    },
    {
      id: "d1-22",
      domain: "d1",
      level: "junior",
      lesson: "d1-strings",
      prompt: "What does this print?",
      code: go`
        s := "héllo"
        fmt.Println(len(s), utf8.RuneCountInString(s))
      `,
      codeLang: "go",
      options: ["`6 5`", "`5 5`", "`5 6`", "`6 6`"],
      answer: [0],
      explanation: "`len` counts bytes. In UTF-8, é takes two bytes, so the string is 6 bytes long but holds 5 characters (runes).",
    },
    {
      id: "d1-23",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-strings",
      prompt: "What does this print?",
      code: go`
        for i, r := range "aé!" {
            fmt.Print(i, ":", string(r), " ")
        }
      `,
      codeLang: "go",
      options: ["`0:a 1:é 3:!`", "`0:a 1:é 2:!`", "`0:a 1:Ã 2:© 3:!`", "`0:a 1:é 2:é 3:!`"],
      answer: [0],
      explanation:
        "Ranging over a string decodes UTF-8 runes, and `i` is the byte where each rune starts. é takes up bytes 1 and 2, so `!` starts at byte 3.",
    },
    {
      id: "d1-24",
      domain: "d1",
      level: "junior",
      lesson: "d1-strings",
      prompt: "What does this print?",
      code: go`
        s := "go"
        b := s[1]
        fmt.Println(b, string(b))
      `,
      codeLang: "go",
      options: ["`111 o`", "`o o`", "`111 111`", "Compile error: cannot index a string"],
      answer: [0],
      explanation:
        "Indexing a string gives you a byte (a `uint8`), which `Println` shows as the number 111. Converting that byte to a string gives the character `o`.",
    },
    {
      id: "d1-25",
      domain: "d1",
      level: "senior",
      lesson: "d1-strings",
      type: "lines",
      prompt: "With 100,000 rows this function takes quadratic time. Tap the line responsible.",
      code: go`
        func join(rows []string) string {
            out := ""
            for _, r := range rows {
                out += r + "\n"
            }
            return out
        }
      `,
      codeLang: "go",
      answer: [4],
      explanation:
        "Strings can't change, so each `+=` makes a new string and copies everything so far. Over the whole loop that's O(n²). Use a `strings.Builder` (calling `Grow` first if you know the size) or `strings.Join(rows, \"\\n\")`.",
    },
  ],

  cards: [
    { id: "c1-append", domain: "d1", kind: "service", term: "append", definition: "Adds elements to a slice. It writes in place if there's spare capacity, and otherwise allocates a bigger array. Always use the result." },
    { id: "c1-copy", domain: "d1", kind: "service", term: "copy", definition: "copy(dst, src) copies as many elements as fit in the shorter of the two, and returns how many. It never makes dst bigger." },
    { id: "c1-make", domain: "d1", kind: "service", term: "make", definition: "Creates slices, maps and channels ready to use: make([]T, len, cap), make(map[K]V), make(chan T, n)." },
    { id: "c1-lencap", domain: "d1", kind: "service", term: "len and cap", definition: "len is how many elements a slice holds. cap is how many fit before append has to allocate a new array." },
    { id: "c1-clear", domain: "d1", kind: "service", term: "clear", definition: "A built-in since Go 1.21. It deletes every entry in a map, or sets every element of a slice back to its zero value." },
    { id: "c1-slices", domain: "d1", kind: "service", term: "slices package", definition: "Generic helpers from Go 1.21, such as slices.Sort, slices.Contains, slices.Index and slices.Clone." },
    { id: "c1-builder", domain: "d1", kind: "service", term: "strings.Builder", definition: "Builds up a string piece by piece without copying the whole thing on every +=." },
    { id: "c1-runecount", domain: "d1", kind: "service", term: "utf8.RuneCountInString", definition: "Counts the characters (runes) in a string without allocating. len(s) counts bytes instead." },
    { id: "c1-zero", domain: "d1", kind: "concept", term: "Zero value", definition: "The value a variable has before you assign one: 0, \"\", false, nil, or a struct whose fields are all zero values." },
    { id: "c1-header", domain: "d1", kind: "concept", term: "Slice header", definition: "The pointer, length and capacity that make up a slice value. Copying a slice copies only these three, not the data." },
    { id: "c1-fullslice", domain: "d1", kind: "concept", term: "Full slice expression", definition: "a[low:high:max] sets the new slice's capacity to max minus low, so appending to it can't overwrite a's later elements." },
    { id: "c1-rune", domain: "d1", kind: "concept", term: "Rune", definition: "Another name for int32, holding one Unicode character (code point). Ranging over a string gives you runes." },
    { id: "c1-commaok", domain: "d1", kind: "concept", term: "Comma-ok idiom", definition: "v, ok := m[k] tells you whether the value really exists. The same form works for type assertions and channel receives." },
  ],

  challenges: [
    {
      id: "ch-go-isolate",
      domain: "d1",
      lesson: "d1-slices",
      title: "Append without clobbering a",
      goal: "Create b, then run b = append(b, 9) while a still prints [1 2 3 4].",
      hint: "If b has spare capacity inside a's array, append writes into it. Take away that spare room, or give b its own array.",
      takeaway: "append only allocates when len equals cap. a[:2:2], or make plus copy, forces a fresh array, so the shared one stays as it was.",
      render: (onSolved) => <SliceLab goal="isolate" onSolved={onSolved} />,
    },
    {
      id: "ch-go-alias",
      domain: "d1",
      lesson: "d1-slices",
      title: "See the aliasing bug",
      goal: "Make b = append(b, 9) change one of a's elements.",
      hint: "Slice a so that b ends before a does, but b's capacity still reaches into a's elements.",
      takeaway: "b := a[:2] or a[1:3] leaves spare capacity in the shared array, so append overwrites whatever a has there.",
      render: (onSolved) => <SliceLab goal="overwrite" onSolved={onSolved} />,
    },
  ],
});
