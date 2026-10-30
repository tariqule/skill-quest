import type { Question } from "@/engine/types";

/**
 * Extra question types for the Go track: fill-in-the-keyword and "type what it prints" questions.
 * No Go toolchain was available when writing, so every answer was traced by hand twice against the Go spec
 * (snippets assume Go 1.22+ and a 64-bit platform; imports and `package main` are omitted).
 */
export const moreQuestions: Question[] = [
  // ───────────── fill ─────────────
  {
    id: "go-fx-01",
    type: "fill",
    domain: "d1",
    level: "junior",
    lesson: "d1-maps",
    prompt: "Fill the gap so the map is initialised and the assignment on the next line does not panic.",
    code: "ages := {{1}}(map[string]int)\nages[\"ann\"] = 31",
    codeLang: "go",
    blanks: [{ options: ["make", "new", "map", "alloc"], answer: 0 }],
    explanation:
      "`make` creates ready-to-use maps, slices and channels. `new(map[string]int)` returns a pointer to a nil map, and writing to a nil map panics. `map` is a type keyword, not a function, and Go has no `alloc`.",
  },
  {
    id: "go-fx-02",
    type: "fill",
    domain: "d3",
    level: "junior",
    lesson: "d3-goroutines",
    prompt: "Fill the gaps so `main` waits until all three goroutines have finished.",
    code:
      "var wg sync.WaitGroup\nfor i := 0; i < 3; i++ {\n\twg.{{1}}(1)\n\tgo func() {\n\t\tdefer wg.{{2}}()\n\t\twork(i)\n\t}()\n}\nwg.Wait()",
    codeLang: "go",
    blanks: [
      { options: ["Add", "Inc", "Start", "Spawn"], answer: 0 },
      { options: ["Done", "Close", "Stop", "Release"], answer: 0 },
    ],
    explanation:
      "`wg.Add(1)` raises the counter before the goroutine starts. `wg.Done()` lowers it when the goroutine returns, and deferring it means it runs even after a panic. `wg.Wait()` pauses until the counter is back to zero. Call `Add` before `go`, never inside the goroutine, or `Wait` may return too early.",
  },
  {
    id: "go-fx-03",
    type: "fill",
    domain: "d2",
    level: "intermediate",
    lesson: "d2-errors",
    prompt: "Fill the gaps so `errors.Is` finds `ErrNotFound` through the wrapped error and returns true.",
    code:
      "var ErrNotFound = errors.New(\"not found\")\n\nfunc find(id int) error {\n\treturn fmt.Errorf(\"find %d: %{{1}}\", id, ErrNotFound)\n}\n\nok := errors.{{2}}(find(7), ErrNotFound) // true",
    codeLang: "go",
    blanks: [
      { options: ["w", "v", "s", "e"], answer: 0 },
      { options: ["Is", "As", "Unwrap", "New"], answer: 0 },
    ],
    explanation:
      "The `%w` verb wraps the error so it can be unwrapped later, and `errors.Is` walks back through the chain comparing each one with the target. `%v` only copies the text, which would break the chain and make `Is` return false. `errors.As` pulls out an error of a particular type, and `Unwrap` takes just one argument.",
  },
  {
    id: "go-fx-04",
    type: "fill",
    domain: "d1",
    level: "intermediate",
    lesson: "d1-slices",
    prompt: "Fill the gaps to remove the element at index `i` from the slice, keeping the order of the rest.",
    code: "s = {{1}}(s[:i], s[i+1:]{{2}})",
    codeLang: "go",
    blanks: [
      { options: ["append", "copy", "delete", "remove"], answer: 0 },
      { options: ["...", "[:]", "*", ".."], answer: 0 },
    ],
    explanation:
      "`append(s[:i], s[i+1:]...)` glues the part before `i` to the part after it, and the `...` spreads the second slice out into separate arguments. `delete` only works on maps, `copy` returns a count rather than a slice, and Go has no `remove`. On Go 1.21 and later, `slices.Delete(s, i, i+1)` does the same job.",
  },
  {
    id: "go-fx-05",
    type: "fill",
    domain: "d3",
    level: "senior",
    lesson: "d3-select",
    prompt:
      "Fill the gaps so the call gives up when the context is cancelled or after two seconds, whichever comes first.",
    code:
      "select {\ncase v := <-results:\n\treturn v, nil\ncase <-ctx.{{1}}():\n\treturn 0, ctx.Err()\ncase <-time.{{2}}(2 * time.Second):\n\treturn 0, errTimeout\n}",
    codeLang: "go",
    blanks: [
      { options: ["Done", "Cancel", "Err", "Wait"], answer: 0 },
      { options: ["After", "Sleep", "Wait", "Timeout"], answer: 0 },
    ],
    explanation:
      "`ctx.Done()` returns a channel that's closed when the context ends, which makes it a perfect `select` case. `time.After(d)` returns a channel that delivers one value after `d`. `time.Sleep` returns nothing, so you can't receive from it, and `Err()` returns an error, not a channel.",
  },
  {
    id: "go-fx-06",
    type: "fill",
    domain: "d4",
    level: "staff",
    lesson: "d4-services",
    prompt:
      "On SIGTERM the service should stop accepting new requests and let in-flight ones finish. Fill the gaps.",
    code:
      "ctx, stop := signal.{{1}}(context.Background(), os.Interrupt, syscall.SIGTERM)\ndefer stop()\n\ngo srv.ListenAndServe()\n<-ctx.Done()\n\nshutdownCtx, cancel := context.WithTimeout(context.Background(), 10*time.Second)\ndefer cancel()\nsrv.{{2}}(shutdownCtx)",
    codeLang: "go",
    blanks: [
      { options: ["NotifyContext", "Notify", "Wait", "Listen"], answer: 0 },
      { options: ["Shutdown", "Close", "Stop", "Halt"], answer: 0 },
    ],
    explanation:
      "`signal.NotifyContext` returns a context that's cancelled when one of the listed signals arrives, so `<-ctx.Done()` becomes the trigger. `srv.Shutdown(ctx)` stops listening and waits for active requests to finish, up to the deadline. `srv.Close()` drops connections straight away, and `http.Server` has no `Stop` or `Halt`.",
  },

  // ───────────── output ─────────────
  {
    id: "go-ox-01",
    type: "output",
    domain: "d1",
    level: "junior",
    lesson: "d1-zero",
    prompt: "Type the line this prints.",
    code:
      "a := [3]int{}\nb := a\nb[0] = 9\nfmt.Println(a[0], b[0])",
    codeLang: "go",
    answers: ["0 9"],
    explanation:
      "Arrays are values, so `b := a` copies all three elements, and changing `b[0]` never touches `a`. With a slice (`[]int`), both names would share one backing array and the output would be `9 9`.",
  },
  {
    id: "go-ox-02",
    type: "output",
    domain: "d1",
    level: "intermediate",
    lesson: "d1-slices",
    prompt: "Type the line this prints.",
    code:
      "s := []int{1, 2, 3, 4}\nt := s[1:3]\nt = append(t, 99)\nfmt.Println(s, len(t), cap(t))",
    codeLang: "go",
    answers: ["[1 2 3 99] 3 3"],
    explanation:
      "`t` starts as `[2 3]` with length 2 and capacity 3, because it can grow up to the end of `s`'s array. Appending one element fits inside that capacity, so no new array is made, and the 99 overwrites `s[3]`. That makes `s` equal `[1 2 3 99]`, and `t` ends with length 3 and capacity 3.",
  },
  {
    id: "go-ox-03",
    type: "output",
    domain: "d2",
    level: "intermediate",
    lesson: "d2-defer",
    prompt: "Type the printed lines, one per line.",
    code: "for i := 0; i < 3; i++ {\n\tdefer fmt.Println(i)\n}",
    codeLang: "go",
    answers: ["2\n1\n0"],
    explanation:
      "Deferred calls run last in, first out when the function returns, so the output is 2, 1, 0. A deferred call's arguments are worked out when the `defer` line runs, so each call remembers the value `i` had at that moment (0, 1, 2).",
  },
  {
    id: "go-ox-04",
    type: "output",
    domain: "d2",
    level: "senior",
    lesson: "d2-interfaces",
    prompt: "Type what this prints (`true` or `false`).",
    code:
      "type MyErr struct{}\n\nfunc (*MyErr) Error() string { return \"boom\" }\n\nfunc run() error {\n\tvar e *MyErr\n\treturn e\n}\n\nfunc main() { fmt.Println(run() == nil) }",
    codeLang: "go",
    answers: ["false"],
    explanation:
      "An interface value holds two things, a type and a value. `run` returns the type `*MyErr` with a nil value, which isn't the nil interface, so `run() == nil` is false even though the pointer inside is nil. This is the classic nil-interface trap: return a plain `nil` on success instead.",
  },
  {
    id: "go-ox-05",
    type: "output",
    domain: "d3",
    level: "intermediate",
    lesson: "d3-channels",
    prompt: "Type the printed lines, one per line.",
    code:
      "ch := make(chan int, 2)\nch <- 1\nch <- 2\nclose(ch)\n\nv, ok := <-ch\nfmt.Println(v, ok)\nfor v := range ch {\n\tfmt.Println(v)\n}",
    codeLang: "go",
    answers: ["1 true\n2"],
    explanation:
      "Closing a channel doesn't throw away what's buffered. The first receive returns `1` with `ok` true. The `range` loop then reads the remaining `2` and stops once the channel is both closed and empty. Only after that would a receive return the zero value with `ok` false.",
  },
  {
    id: "go-ox-06",
    type: "output",
    domain: "d4",
    level: "staff",
    lesson: "d4-memory",
    prompt:
      "On a 64-bit platform, type the number `unsafe.Sizeof(T{})` returns (bytes).",
    code:
      "type T struct {\n\ta bool\n\tb int64\n\tc bool\n}\n\nfmt.Println(unsafe.Sizeof(T{}))",
    codeLang: "go",
    answers: ["24"],
    explanation:
      "Each field lines up on a multiple of its own size. `a` takes 1 byte plus 7 bytes of padding so `b` starts on an 8-byte boundary, `b` takes 8, and `c` takes 1 plus 7 more padding at the end so arrays of `T` stay lined up. That's 24 bytes. Ordering the fields `b, a, c` packs them into 16, which matters when you hold millions of these.",
  },
];
