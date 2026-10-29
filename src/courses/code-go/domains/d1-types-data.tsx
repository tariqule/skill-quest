import { CodeBlock, CodeCompare, Tiles } from "@/components/learn/blocks";
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
    summary: "Declarations and zero values, arrays vs slices, append and capacity aliasing, maps and their traps, strings, bytes, and runes.",
  },

  tasks: [
    {
      id: "1.1",
      title: "Declarations, zero values, and constants",
      covers: ["var vs :=", "Zero values of every type", "Block scope and shadowing", "Untyped constants", "for and range (including range over an int)"],
    },
    {
      id: "1.2",
      title: "Arrays and slices",
      covers: ["Arrays are values; slices are views", "len, cap, and the backing array", "append aliasing and reallocation", "The full slice expression a[low:high:max]"],
    },
    {
      id: "1.3",
      title: "Maps",
      covers: ["nil maps", "The comma-ok idiom", "Unspecified iteration order", "Map elements aren't addressable", "Concurrent access"],
    },
    {
      id: "1.4",
      title: "Strings, bytes, and runes",
      covers: ["Strings are immutable byte sequences", "UTF-8 and rune decoding in range", "Building strings efficiently"],
    },
  ],

  lessons: [
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
              { icon: "0️⃣", title: "Numbers", text: "`int`, `float64`, … start at `0`", color: "#00add8" },
              { icon: "🔤", title: "Strings", text: "`\"\"` (the empty string), never nil", color: "#34d399" },
              { icon: "⚪", title: "Booleans", text: "`false`", color: "#a78bfa" },
              { icon: "🕳️", title: "nil", text: "pointers, slices, maps, channels, funcs, interfaces", color: "#f59e0b" },
              { icon: "🧱", title: "Structs", text: "every field set to its own zero value", color: "#f472b6" },
              { icon: "📦", title: "Arrays", text: "every element set to its zero value", color: "#fb7185" },
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
        "`var x T` gives x the zero value of T. There is no \"uninitialized\" memory in Go.",
        "`:=` declares and assigns, and works only inside functions. At package level use `var`.",
        "Unused local variables and unused imports are compile errors, not warnings.",
        "`:=` in an inner block (like `if x := …;`) declares a NEW variable that shadows the outer one.",
        "Constants are untyped until used, and constant arithmetic is exact (no overflow until conversion).",
      ],
      tip: "Interviewers like \"make the zero value useful\": a `sync.Mutex`, `bytes.Buffer`, or nil slice works without any constructor.",
    },
    {
      id: "d1-slices",
      level: "intermediate",
      task: "1.2",
      title: "Slices share backing arrays",
      check: ["d1-09", "d1-11"],
      visual: <SliceLab />,
      points: [
        "An array (`[4]int`) is a value: assigning or passing it copies every element.",
        "A slice is a small header (pointer, len, cap) viewing a backing array. Copying a slice copies the header, not the data.",
        "`append` writes in place when len < cap, so other slices over that array see it. Past cap it allocates a new array.",
        "Always use the result: `s = append(s, x)`. The old header may point at the old array.",
        "`a[low:high:max]` limits capacity so a later append must copy instead of overwriting a's elements.",
      ],
      tip: "Draw the backing array and two brackets for the slices. Saying \"len < cap, so append overwrites the shared slot\" is exactly what they want to hear.",
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
              title: "Trap: nil map write",
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
              title: "Trap: struct values aren't addressable",
              code: go`
                users := map[string]User{"ann": {}}
                users["ann"].Visits++ // compile error
              `,
            }}
            right={{
              title: "Fix: copy back, or store pointers",
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
        "A nil map reads like an empty map, but writing to it panics. Create maps with `make` or a literal.",
        "`v, ok := m[k]` tells \"missing\" apart from \"present with the zero value\".",
        "Iteration order is unspecified and deliberately varies between runs. Sort the keys if order matters.",
        "Map elements aren't addressable: you can't do `&m[k]` or `m[k].Field = x`.",
        "Maps aren't safe for concurrent writes. Unsynchronized concurrent access can crash the program with a fatal error.",
      ],
      tip: "If asked for deterministic output from a map, collect the keys, call `slices.Sort(keys)`, then range over the keys.",
    },
    {
      id: "d1-strings",
      level: "intermediate",
      task: "1.4",
      title: "Strings are bytes, runes are code points",
      check: ["d1-22", "d1-23"],
      visual: <RuneExplorer />,
      points: [
        "A string is an immutable sequence of bytes, conventionally UTF-8. `len(s)` counts bytes.",
        "`s[i]` is a byte. `for i, r := range s` decodes runes (int32 code points) and i is the byte offset.",
        "`[]rune(s)` converts to code points; `utf8.RuneCountInString(s)` counts them without allocating.",
        "Strings can't be changed in place. Repeated `+=` in a loop copies every time; use `strings.Builder`.",
      ],
      tip: "For \"reverse a string\", say whether you reverse bytes or runes. Reversing bytes breaks multi-byte characters like é.",
    },
  ],

  questions: [
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
      explanation: "Slices, maps, and pointers all have the zero value `nil`. `len` of a nil slice (or nil map) is simply 0.",
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
      explanation: "A struct's zero value has every field at its own zero value: 0 for the ints and the empty string for `Name` (`%q` shows it as `\"\"`). A struct value is never nil.",
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
      explanation: "`:=` is only allowed inside function bodies. At package level, write `var x = 10` (or `var x int = 10`).",
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
      explanation: "Go rejects unused local variables and unused imports to keep code clean. Unused parameters and package-level variables are allowed, and shadowing is legal (linters may warn).",
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
      explanation: "The `x := 2` in the if statement declares a new `x` scoped to the if block, shadowing the outer one. It becomes 3 and is printed; the outer `x` is still 1.",
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
      explanation: "`a / b` is integer division (3) before the conversion, so f is 3.0, which `Println` shows as `3`. Integer division truncates toward zero, so `-7/2` is `-3`.",
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
        "`big` is an untyped constant, and constant expressions are evaluated exactly at compile time. `big >> 30` is 1024, which fits in an int32. Only `var x int32 = big` would overflow.",
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
      explanation: "Since Go 1.22 you can range over an integer n, which yields 0 through n-1.",
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
      explanation: "Arrays are values, so `b := a` copies all three elements and `b[0] = 9` changes only b. `a[:]` is a slice viewing a's own array, so `s[1] = 8` changes a.",
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
      explanation: "`b` has len 2 but cap 4 (it runs to the end of a's array). Since len < cap, `append` stores 99 in the shared array at index 2, which is `a[2]`.",
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
      explanation: "`a` is full (len 3, cap 3), so `append` allocates a new, larger array and copies into it. After that, `b` and `a` don't share memory.",
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
      explanation: "The full slice expression `a[:2:2]` sets cap(b) to 2, so the append can't write into a's array. It allocates a new array (capacity at least 3) and a is untouched.",
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
        "The slice header is passed by value. `append` on a nil slice allocates a new array and the result is stored only in the local `items`. Return it instead: `func addItem(...) []string`, then `cart = addItem(cart, \"apple\")`.",
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
        "The range expression is evaluated once, so the loop walks the original 3-element array. The literal has cap 3, so `append` moves `nums` to a new array, and `nums[1] = 20` writes there, not into the array being ranged over.",
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
      explanation: "These five built-ins cover almost all slice work. `copy` never grows dst, which is why you size it with `make` first.",
    },
    {
      id: "d1-15",
      domain: "d1",
      level: "staff",
      lesson: "d1-slices",
      prompt:
        "A service reads a 10 MB file into `data`, then keeps `header := data[:64]` in a long-lived cache. Memory grows with every file. What is the best fix?",
      options: [
        "Copy the 64 bytes into their own slice (`bytes.Clone(data[:64])`) so the 10 MB array can be collected",
        "Call `runtime.GC()` after each request",
        "Store `data[:64:64]` instead, to cap the slice",
        "Set `data = nil` right after slicing",
      ],
      answer: [0],
      explanation:
        "Any slice keeps its whole backing array reachable. Capping with `[:64:64]` still points into the same 10 MB array, and `data = nil` doesn't help because `header` still references it. Copying breaks the link.",
    },
    {
      id: "d1-26",
      domain: "d1",
      level: "staff",
      lesson: "d1-slices",
      prompt:
        "A shared library exports `func (r *Registry) Plugins() []Plugin { r.mu.RLock(); defer r.mu.RUnlock(); return r.plugins }`. Other teams edit and append to the result, and the race detector fires. What is the best fix that keeps the signature?",
      options: [
        "Return `slices.Clone(r.plugins)` while holding the read lock",
        "Return `r.plugins[:len(r.plugins):len(r.plugins)]`",
        "Document \"do not modify the result\" and leave the code",
        "Switch `RLock` to `Lock`",
      ],
      answer: [0],
      explanation:
        "The lock protects only the moment the header is read; callers then touch the shared array with no lock at all. Returning a copy gives each caller its own array. Capping the capacity stops appends from overwriting but index writes still race.",
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
      explanation: "Reading from a nil map returns the zero value and `len` is 0, but writing to it panics. Use `m := make(map[string]int)` or a map literal.",
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
      explanation: "The comma-ok form separates \"present with value 0\" (`ok` true) from \"missing\" (`ok` false, value is the zero value). Missing keys never panic.",
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
        "Never rely on range order over a map (fmt prints maps with sorted keys, which can hide this). Map keys must be comparable, which rules out slices, maps, and funcs. The runtime detects many concurrent map writes and aborts with \"concurrent map writes\".",
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
        "Map elements aren't addressable, so you can't assign to a field of a struct stored in a map. Copy it out, change it, and store it back, or use `map[string]*User`.",
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
      explanation: "A map may rehash and move its entries as it grows. If you could hold `&m[k]`, the pointer would silently go stale, so the language makes map elements non-addressable.",
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
      explanation: "The spec explicitly allows deleting during range: removed entries that haven't been reached are skipped. (Entries added during the loop may or may not be produced.)",
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
      explanation: "`len` counts bytes. In UTF-8, é takes two bytes, so the string is 6 bytes long but contains 5 runes.",
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
      explanation: "Ranging over a string decodes UTF-8 runes, and `i` is each rune's starting byte offset. é occupies bytes 1 and 2, so `!` starts at byte 3.",
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
      explanation: "Indexing a string gives a byte (`uint8`), which `Println` shows as the number 111. Converting a byte to a string gives the character `o`.",
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
        "Strings are immutable, so each `+=` allocates a new string and copies everything so far: O(n²) in total. Use a `strings.Builder` (optionally `Grow` it first) or `strings.Join(rows, \"\\n\")`.",
    },
  ],

  cards: [
    { id: "c1-append", domain: "d1", kind: "service", term: "append", definition: "Adds elements to a slice, writing in place if len < cap, otherwise allocating a bigger array. Always use the result." },
    { id: "c1-copy", domain: "d1", kind: "service", term: "copy", definition: "copy(dst, src) copies min(len(dst), len(src)) elements and returns the count. Never grows dst." },
    { id: "c1-make", domain: "d1", kind: "service", term: "make", definition: "Creates and initializes slices, maps, and channels: make([]T, len, cap), make(map[K]V), make(chan T, n)." },
    { id: "c1-lencap", domain: "d1", kind: "service", term: "len and cap", definition: "len is how many elements a slice holds; cap is how many fit before append must reallocate." },
    { id: "c1-clear", domain: "d1", kind: "service", term: "clear", definition: "Built-in since Go 1.21: deletes every map entry, or zeroes every element of a slice." },
    { id: "c1-slices", domain: "d1", kind: "service", term: "slices package", definition: "Generic helpers (Go 1.21+): slices.Sort, slices.Contains, slices.Index, slices.Clone, and more." },
    { id: "c1-builder", domain: "d1", kind: "service", term: "strings.Builder", definition: "Builds a string with amortized appends instead of copying on every +=." },
    { id: "c1-runecount", domain: "d1", kind: "service", term: "utf8.RuneCountInString", definition: "Counts the runes (code points) in a string without allocating. len(s) counts bytes." },
    { id: "c1-zero", domain: "d1", kind: "concept", term: "Zero value", definition: "The value a variable has before assignment: 0, \"\", false, nil, or a struct of zero fields." },
    { id: "c1-header", domain: "d1", kind: "concept", term: "Slice header", definition: "The pointer, length, and capacity that make up a slice value. Copying a slice copies only this." },
    { id: "c1-fullslice", domain: "d1", kind: "concept", term: "Full slice expression", definition: "a[low:high:max] sets the result's capacity to max-low, so appends can't overwrite a's later elements." },
    { id: "c1-rune", domain: "d1", kind: "concept", term: "Rune", definition: "An alias for int32 holding one Unicode code point. range over a string yields runes." },
    { id: "c1-commaok", domain: "d1", kind: "concept", term: "Comma-ok idiom", definition: "v, ok := m[k] (also for type assertions and channel receives) reports whether the value really exists." },
  ],

  challenges: [
    {
      id: "ch-go-isolate",
      domain: "d1",
      lesson: "d1-slices",
      title: "Append without clobbering a",
      goal: "Create b, then run b = append(b, 9) while a still prints [1 2 3 4].",
      hint: "If b has spare capacity inside a's array, append writes into it. Take away that spare capacity, or give b its own array.",
      takeaway: "append only allocates when len == cap. a[:2:2] or make + copy forces a fresh array, so the shared one stays intact.",
      render: (onSolved) => <SliceLab goal="isolate" onSolved={onSolved} />,
    },
    {
      id: "ch-go-alias",
      domain: "d1",
      lesson: "d1-slices",
      title: "See the aliasing bug",
      goal: "Make b = append(b, 9) change one of a's elements.",
      hint: "Slice a so that b ends before a does but its capacity reaches into a's elements.",
      takeaway: "b := a[:2] or a[1:3] leaves spare capacity in the shared array, so append overwrites whatever a has there.",
      render: (onSolved) => <SliceLab goal="overwrite" onSolved={onSolved} />,
    },
  ],
});
