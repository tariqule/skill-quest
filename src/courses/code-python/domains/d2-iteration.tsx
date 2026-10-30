import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { GeneratorLab } from "../labs";
import { py } from "../py";

/** Module 2: comprehensions, the iterator protocol, generators, and output traps. */
export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "Iteration, Generators & Output Traps",
    world: "The Generator Grove",
    weight: 20,
    emoji: "🌀",
    color: "#34d399",
    summary:
      "Looping in Python: comprehensions, how iterables and iterators differ, lazy generators with yield, and the classic \"what does this print?\" traps.",
  },

  tasks: [
    { id: "2.1", title: "Comprehensions", covers: ["List, dict, and set comprehensions", "Nested loops and filters", "Generator expressions compared with list comprehensions"] },
    {
      id: "2.2",
      title: "Iterators and generators",
      covers: ["iter(), next() and StopIteration", "Single-pass iterators: map, filter, zip, generators", "yield, yield from, and lazy evaluation"],
    },
    {
      id: "2.3",
      title: "Common output traps",
      covers: ["for/else", "Floor division and banker's rounding", "Chained comparisons", "Methods that return None", "Changing a list while looping over it"],
    },
  ],

  lessons: [
    {
      id: "d2-start-loops",
      level: "beginner",
      task: "2.2",
      title: "Loops repeat work for you",
      check: ["py-b2-01", "py-b2-02"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#34d399"
            loop="Python repeats the indented lines once per item"
            steps={[
              { icon: "📋", label: "Take the list", sub: "[1, 2, 3]" },
              { icon: "👉", label: "Pick the next item", sub: "n becomes 1, then 2, then 3" },
              { icon: "⚙️", label: "Run the body", sub: "The indented lines under the for" },
            ]}
          />
          <CodeBlock
            lang="python"
            code={py`
              total = 0
              for n in [1, 2, 3]:
                  total = total + n   # runs three times
              print(total)            # 6 (not indented, runs once)
            `}
          />
        </div>
      ),
      points: [
        "A **loop** runs the same lines again and again, once for each item. It's like a cashier scanning every item in your basket, one after another.",
        "`for n in items:` means \"take each item in turn, call it `n`, and run the indented lines below\".",
        "Python uses **indentation** (the spaces at the start of a line) to decide which lines are inside the loop. Four spaces is the usual amount.",
        "When the loop has used every item, Python carries on with the first line that isn't indented.",
      ],
      tip: "Forgot the colon at the end of the `for` line? You'll get a `SyntaxError`. The colon tells Python \"an indented block comes next\".",
    },
    {
      id: "d2-start-range",
      level: "beginner",
      task: "2.3",
      title: "Counting with range and choosing with if",
      check: ["py-b2-03", "py-b2-04"],
      visual: (
        <CodeBlock
          lang="python"
          code={py`
            print(list(range(4)))   # [0, 1, 2, 3]

            for i in range(3):
                print("Lap", i)     # Lap 0, Lap 1, Lap 2

            for n in [4, 7, 10]:
                if n > 5:
                    print(n, "is big")
          `}
        />
      ),
      points: [
        "`range(4)` gives you the numbers 0, 1, 2 and 3. It starts at 0 and stops just before the number you give it.",
        "`for i in range(3):` is the simplest way to say \"do this three times\".",
        "An `if` inside a loop lets you act on only some items. The lines under the `if` are indented one more level.",
        "Comparisons like `n > 5` or `n == 2` give `True` or `False`, and `if` runs its block only when the answer is `True`.",
      ],
      tip: "Watch the difference between `=` and `==`. One `=` puts a name on a value. Two `==` ask whether two values are equal.",
    },
    {
      id: "d2-start-comprehension",
      level: "beginner",
      task: "2.1",
      title: "Building a new list in one line",
      check: ["py-b2-05", "py-b2-06"],
      visual: (
        <CodeCompare
          lang="python"
          left={{
            title: "With a loop",
            code: py`
              nums = [1, 2, 3]
              doubled = []
              for n in nums:
                  doubled.append(n * 2)
            `,
          }}
          right={{
            title: "With a comprehension",
            code: py`
              nums = [1, 2, 3]
              doubled = [n * 2 for n in nums]
              # [2, 4, 6]
            `,
          }}
        />
      ),
      points: [
        "Making a new list from an old one is so common that Python has a short way to write it, called a **list comprehension**.",
        "`[n * 2 for n in nums]` reads as \"n times 2, for each n in nums\". The part before `for` says what goes into the new list.",
        "You can add an `if` at the end to keep only some items. `[n for n in nums if n > 0]` keeps just the positive numbers.",
        "The original list isn't changed. You get a brand new list back.",
      ],
      tip: "If a comprehension starts to feel hard to read, a plain `for` loop is always fine. Both do the same job.",
    },
    {
      id: "d2-comprehensions",
      level: "junior",
      task: "2.1",
      title: "Comprehensions read left to right",
      check: ["d2-01", "d2-04"],
      visual: (
        <div className="grid gap-4">
          <CodeCompare
            lang="python"
            left={{
              title: "Loop",
              code: py`
                result = []
                for x in range(10):
                    if x % 2 == 0:
                        result.append(x * x)
              `,
            }}
            right={{
              title: "Comprehension",
              code: py`
                result = [x * x for x in range(10) if x % 2 == 0]
                # dict: {k: v for k, v in pairs}
                # set:  {x % 3 for x in nums}
                # lazy: (x * x for x in nums)
              `,
            }}
          />
          <Flow
            color="#34d399"
            steps={[
              { icon: "🎁", label: "Expression", sub: "x * x: what goes into the result" },
              { icon: "🔁", label: "for clauses", sub: "The leftmost for is the outer loop" },
              { icon: "🧹", label: "if filter", sub: "Keeps only the items where it's true" },
            ]}
          />
        </div>
      ),
      points: [
        "When a comprehension has several `for` clauses, they nest in the same order you'd write the loops, outermost first.",
        "In Python 3 the loop variable stays inside the comprehension. It won't leak out or overwrite a name of the same name outside.",
        "In a dict comprehension, if the same key comes up twice, the last value wins.",
        "If you only need to loop over the results once, use a **generator expression** (round brackets instead of square). For example, `sum(x * x for x in data)`.",
      ],
      tip: "If a comprehension needs more than two clauses or a nested if/else, say you'd switch to a plain loop so it's easier to read. Interviewers like that judgement.",
    },
    {
      id: "d2-iterators",
      level: "intermediate",
      task: "2.2",
      title: "The iterator protocol",
      check: ["d2-06", "d2-09"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#34d399"
            loop="Repeat next() until StopIteration ends the loop"
            steps={[
              { icon: "📦", label: "Iterable", sub: "A list, str, dict or file: anything with __iter__" },
              { icon: "🔑", label: "iter(obj)", sub: "Hands you a fresh iterator" },
              { icon: "➡️", label: "next(it)", sub: "Gives you the next item" },
              { icon: "🛑", label: "StopIteration", sub: "Raised when it runs out; for catches it" },
            ]}
          />
          <CodeBlock
            lang="python"
            code={py`
              it = iter([10, 20])
              next(it)   # 10
              next(it)   # 20
              next(it)   # StopIteration
              m = map(str, [1, 2])
              list(m), list(m)   # (['1', '2'], [])  single pass!
            `}
          />
        </div>
      ),
      points: [
        "An **iterable** is anything you can loop over, like a list. Its `__iter__` method hands you an **iterator**.",
        "An iterator is the thing that keeps your place. It has `__next__` to give the next item, and its `__iter__` returns itself.",
        "Iterators only go through once. `map`, `filter`, `zip`, `enumerate`, files and generators are all used up after one loop.",
        "`zip` stops at the shortest input. Use `itertools.zip_longest` or `zip(..., strict=True)` when the lengths matter.",
      ],
      tip: "\"Why is my second loop empty?\" is almost always a used-up iterator. If you need the items twice, turn them into a list with `list()` first.",
    },
    {
      id: "d2-generators",
      level: "intermediate",
      task: "2.2",
      title: "Generators pause at yield",
      check: ["d2-11", "d2-12"],
      visual: <GeneratorLab />,
      points: [
        "Calling a generator function runs none of its code. It just hands back a generator object.",
        "Each `next()` runs the body until it reaches a `yield`, hands back that value, then pauses with all its local variables kept.",
        "When the body finishes, the generator raises `StopIteration`. You can't restart it; you call the function again for a fresh one.",
        "`yield from inner()` passes along every item from another iterable, one by one.",
        "Generators are **lazy**: they make each value only when asked. That lets them handle huge or never-ending streams using very little memory.",
      ],
      tip: "Generators are a great way to talk about memory. For example: \"Reading a 10 GB log line by line with a generator keeps only one line in memory at a time.\"",
    },
    {
      id: "d2-traps",
      level: "senior",
      task: "2.3",
      title: "Classic output traps",
      check: ["d2-16", "d2-20"],
      visual: (
        <Tiles
          tiles={[
            { icon: "🔚", title: "for / else", text: "The else runs when the loop finishes without hitting break.", color: "#34d399" },
            { icon: "➗", title: "Floor division", text: "-7 // 2 is -4, because it rounds down toward negative infinity.", color: "#f59e0b" },
            { icon: "🏦", title: "Banker's rounding", text: "round(2.5) is 2 and round(3.5) is 4. Ties go to the even number.", color: "#f59e0b" },
            { icon: "⛓️", title: "Chained comparisons", text: "a < b < c means a < b and b < c.", color: "#a78bfa" },
            { icon: "🕳️", title: "Returns None", text: "list.sort(), append and random.shuffle change the list and return None.", color: "#fb7185" },
            { icon: "✂️", title: "Removing while looping", text: "Changing a list while you loop over it skips items. Build a new list instead.", color: "#fb7185" },
          ]}
        />
      ),
      points: [
        "Floats are stored in binary, so `0.1 + 0.2 == 0.3` is False. Use `math.isclose` or `decimal.Decimal` when exact decimals matter.",
        "`sorted(x)` gives you a new sorted list. `x.sort()` sorts the list in place and returns `None`.",
        "`True == 1` and `False == 0` are both True, because `bool` is a kind of `int` in Python.",
      ],
      tip: "Read trick snippets out loud, one line at a time, and say what every variable holds after each line. It slows you down enough to spot the trap.",
    },
  ],

  questions: [
    // ───────────── Start here ─────────────
    {
      id: "py-b2-01",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-loops",
      type: "output",
      prompt: "What does this print?",
      code: py`
        total = 0
        for n in [1, 2, 3]:
            total = total + n
        print(total)
      `,
      codeLang: "python",
      answers: ["6"],
      explanation:
        "The loop body runs three times, adding 1, then 2, then 3 to `total`. The `print` line isn't indented, so it runs once, after the loop, and shows 6.",
    },
    {
      id: "py-b2-02",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-loops",
      prompt: "How does Python know which lines belong inside a `for` loop?",
      options: [
        "The lines inside the loop are indented under the `for` line",
        "The lines inside the loop are wrapped in curly braces `{ }`",
        "Every line after `for` is inside the loop until the file ends",
        "You end the loop with the word `end`",
      ],
      answer: [0],
      explanation:
        "Python uses indentation to group lines. Everything indented under the `for` line is the loop body, and the first line back at the outer level is outside it. Languages like Java use curly braces for this, but Python doesn't.",
    },
    {
      id: "py-b2-03",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-range",
      type: "output",
      prompt: "What does this print?",
      code: py`
        print(list(range(4)))
      `,
      codeLang: "python",
      answers: ["[0, 1, 2, 3]", "[0,1,2,3]"],
      explanation:
        "`range(4)` starts at 0 and stops just before 4, so you get four numbers: 0, 1, 2 and 3. Wrapping it in `list()` lets you see them all at once.",
    },
    {
      id: "py-b2-04",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-range",
      type: "output",
      prompt: "What does this print?",
      code: py`
        count = 0
        for n in [4, 7, 10, 3]:
            if n > 5:
                count += 1
        print(count)
      `,
      codeLang: "python",
      answers: ["2"],
      explanation:
        "The loop checks each number. Only 7 and 10 are bigger than 5, so `count += 1` (add one to `count`) runs twice. The final count is 2.",
    },
    {
      id: "py-b2-05",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-comprehension",
      type: "fill",
      prompt: "Fill the gap so `doubled` becomes `[2, 4, 6]`.",
      code: py`
        nums = [1, 2, 3]
        doubled = [n * 2 {{1}} n in nums]
        print(doubled)  # [2, 4, 6]
      `,
      codeLang: "python",
      blanks: [{ options: ["for", "each", "of", "with"], answer: 0 }],
      explanation:
        "A list comprehension uses the same words as a loop: `for n in nums`. The part before `for`, here `n * 2`, says what goes into the new list for each item.",
    },
    {
      id: "py-b2-06",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-comprehension",
      prompt: "What does `[n for n in nums if n > 0]` give you?",
      options: [
        "A new list holding only the numbers in `nums` that are greater than 0",
        "`True` if every number in `nums` is greater than 0",
        "The same `nums` list, with the negative numbers removed in place",
        "The number of items in `nums` that are greater than 0",
      ],
      answer: [0],
      explanation:
        "A comprehension always builds a new list. The `if` at the end acts as a filter, so only numbers above 0 make it in. The original `nums` list is left exactly as it was.",
    },
    // ───────────── Interview questions ─────────────
    {
      id: "d2-01",
      domain: "d2",
      level: "junior",
      lesson: "d2-comprehensions",
      prompt: "What does this print?",
      code: py`print([x * x for x in range(5) if x % 2 == 0])`,
      codeLang: "python",
      options: ["`[0, 4, 16]`", "`[1, 9]`", "`[0, 1, 4, 9, 16]`", "`[4, 16]`"],
      answer: [0],
      explanation: "The filter keeps the even numbers in `range(5)`, which are 0, 2 and 4. The expression then squares each one.",
    },
    {
      id: "d2-02",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-comprehensions",
      prompt: "What does this print?",
      code: py`
        pairs = [(i, j) for i in range(2) for j in range(3) if i != j]
        print(pairs)
      `,
      codeLang: "python",
      options: [
        "`[(0, 1), (0, 2), (1, 0), (1, 2)]`",
        "`[(1, 0), (2, 0), (0, 1), (2, 1)]`",
        "`[(0, 1), (1, 0), (0, 2), (1, 2)]`",
        "`[(0, 0), (1, 1)]`",
      ],
      answer: [0],
      explanation:
        "The leftmost `for` is the outer loop. When i is 0, j runs through 0, 1, 2 and skips 0. When i is 1, j runs through 0, 1, 2 and skips 1.",
    },
    {
      id: "d2-03",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-comprehensions",
      prompt: "What does this print?",
      code: py`
        words = ["apple", "avocado", "banana"]
        print({w[0]: w for w in words})
      `,
      codeLang: "python",
      options: [
        "`{'a': 'avocado', 'b': 'banana'}`",
        "`{'a': 'apple', 'b': 'banana'}`",
        "`{'a': ['apple', 'avocado'], 'b': ['banana']}`",
        "`ValueError: duplicate key`",
      ],
      answer: [0],
      explanation:
        "Both `apple` and `avocado` use the key `'a'`. Each new assignment to that key replaces the old value, so the last one wins. A repeated key never raises an error.",
    },
    {
      id: "d2-04",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-comprehensions",
      prompt: "What does this print in Python 3?",
      code: py`
        x = "outer"
        squares = [x for x in range(3)]
        print(x)
      `,
      codeLang: "python",
      options: ["`outer`", "`2`", "`[0, 1, 2]`", "`NameError`"],
      answer: [0],
      explanation:
        "In Python 3, the variable inside a comprehension lives only inside it, so the outer `x` isn't touched. (Python 2 list comprehensions did leak their variable, which is why this is a classic question.)",
    },
    {
      id: "d2-05",
      domain: "d2",
      level: "senior",
      lesson: "d2-comprehensions",
      prompt: "When is a generator expression a better choice than a list comprehension? (Choose two.)",
      options: [
        "You only loop over the results once, for example `sum(x * x for x in data)`",
        "The input is huge or never-ending and you don't want everything in memory",
        "You need `len()` of the result",
        "You need to index into the result",
        "You need to loop over the result several times",
      ],
      answer: [0, 1],
      explanation:
        "A generator expression makes items one at a time, so it needs almost no extra memory. The trade-off is that it has no `len()`, you can't index it, and it's used up after one pass.",
    },
    {
      id: "d2-06",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-iterators",
      prompt: "What does this print?",
      code: py`
        nums = map(lambda x: x * 2, [1, 2, 3])
        print(list(nums))
        print(list(nums))
      `,
      codeLang: "python",
      options: ["`[2, 4, 6]` then `[]`", "`[2, 4, 6]` then `[2, 4, 6]`", "`[2, 4, 6]` then `StopIteration`", "`<map object>` twice"],
      answer: [0],
      explanation:
        "`map` returns an iterator, which only goes through once. The first `list()` uses it up. The second finds nothing left and gives an empty list. There's no exception, because `list()` handles `StopIteration` for you.",
    },
    {
      id: "d2-07",
      domain: "d2",
      level: "junior",
      lesson: "d2-iterators",
      prompt: "What does this print?",
      code: py`print(list(zip("abc", [1, 2])))`,
      codeLang: "python",
      options: ["`[('a', 1), ('b', 2)]`", "`[('a', 1), ('b', 2), ('c', None)]`", "`ValueError`", "`[('abc', 1), ('abc', 2)]`"],
      answer: [0],
      explanation:
        "`zip` stops as soon as the shortest input runs out, so `'c'` is dropped. If you want padding, use `itertools.zip_longest`. If unequal lengths should be an error, use `zip(..., strict=True)` (Python 3.10 and later).",
    },
    {
      id: "d2-08",
      domain: "d2",
      level: "junior",
      lesson: "d2-iterators",
      type: "order",
      prompt: "Put in order what a `for x in obj:` loop does behind the scenes.",
      items: [
        "Call `iter(obj)` to get an iterator",
        "Call `next()` on the iterator",
        "Bind the returned value to `x` and run the body",
        "Keep calling `next()` until it raises `StopIteration`",
        "Catch `StopIteration` silently and leave the loop",
      ],
      explanation:
        "That's the whole iterator protocol. Anything with `__iter__` (or the older `__getitem__`) can be used in a `for` loop.",
    },
    {
      id: "d2-09",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-iterators",
      type: "lines",
      prompt: "This prints `[3, 2, 1, 0]` but should print `[3, 2, 1]`. Tap the buggy line.",
      code: py`
        class Countdown:
            def __init__(self, start):
                self.n = start
            def __iter__(self):
                return self
            def __next__(self):
                if self.n < 0:
                    raise StopIteration
                self.n -= 1
                return self.n + 1

        print(list(Countdown(3)))
      `,
      codeLang: "python",
      answer: [7],
      explanation:
        "When `n` reaches 0, the check `n < 0` is still False, so it hands back 0 before stopping. The stop check should be `if self.n <= 0:`.",
    },
    {
      id: "d2-10",
      domain: "d2",
      level: "junior",
      lesson: "d2-iterators",
      prompt: "What's the difference between an iterable and an iterator?",
      options: [
        "An iterable's `__iter__` returns an iterator; an iterator has `__next__`, returns itself from `__iter__`, and only goes through once",
        "They're the same thing; the names are interchangeable",
        "Iterators can be indexed with `[]`; iterables can't",
        "An iterable is always a list and an iterator is always a generator; no other types can be used in a `for` loop",
      ],
      answer: [0],
      explanation:
        "A list is iterable: every `iter(lst)` gives you a new, independent iterator. An iterator remembers its position and gets used up as you move through it.",
    },
    {
      id: "d2-11",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-generators",
      prompt: "What does this print?",
      code: py`
        def gen():
            print("A")
            yield 1
            print("B")
            yield 2

        g = gen()
        print("start")
        print(next(g))
      `,
      codeLang: "python",
      options: ["`start`, `A`, `1`", "`A`, `start`, `1`", "`start`, `A`, `1`, `B`", "`A`, `B`, `start`, `1`"],
      answer: [0],
      explanation:
        "`gen()` only creates the generator; none of its code runs yet. `next(g)` runs it up to the first `yield`, which prints `A` and hands back 1. `B` would only print on the next `next()`.",
    },
    {
      id: "d2-12",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-generators",
      prompt: "What does this print?",
      code: py`
        def squares(n):
            for i in range(n):
                yield i * i

        g = squares(3)
        print(sum(g), sum(g))
      `,
      codeLang: "python",
      options: ["`5 0`", "`5 5`", "`14 14`", "`5` then `StopIteration`"],
      answer: [0],
      explanation:
        "The first `sum` uses up the generator, adding 0, 1 and 4 to get 5. The generator is now empty, so the second `sum` has nothing to add and returns 0.",
    },
    {
      id: "d2-13",
      domain: "d2",
      level: "senior",
      lesson: "d2-generators",
      prompt: "What does this print?",
      code: py`
        def inner():
            yield 1
            yield 2

        def outer():
            yield 0
            yield from inner()
            yield 3

        print(list(outer()))
      `,
      codeLang: "python",
      options: ["`[0, 1, 2, 3]`", "`[0, <generator object inner>, 3]`", "`[0, [1, 2], 3]`", "`[0, 3]`"],
      answer: [0],
      explanation:
        "`yield from` hands each item of the inner generator straight out, one at a time, as if the outer generator had yielded them itself. So the items come out flat, not as a nested list.",
    },
    {
      id: "d2-14",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-generators",
      type: "lines",
      prompt: "This should produce `[1, 2]` but raises `TypeError: 'int' object is not iterable`. Tap the buggy line.",
      code: py`
        def read_ids(rows):
            for row in rows:
                if row:
                    return row["id"]

        ids = list(read_ids([{"id": 1}, {"id": 2}]))
      `,
      codeLang: "python",
      answer: [4],
      explanation:
        "With `return` and no `yield`, this is an ordinary function. It returns the first id, which is the int 1, and `list(1)` fails. Writing `yield row[\"id\"]` makes it a generator.",
    },
    {
      id: "d2-15",
      domain: "d2",
      level: "junior",
      lesson: "d2-generators",
      prompt: "What happens when you call a generator function, as in `g = numbers()`?",
      options: [
        "It returns a generator object; none of the body runs until the first `next()`",
        "It runs the whole body and stores every yielded value in a list for later",
        "It runs up to the first `yield` straight away",
        "It starts a background thread that produces values",
      ],
      answer: [0],
      explanation:
        "Generators are lazy. The body only starts on the first `next()` (or the first pass of a loop), and it pauses at each `yield`. No threads are involved.",
    },
    {
      id: "d2-16",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-traps",
      prompt: "What does this print?",
      code: py`
        for n in [1, 3, 5]:
            if n % 2 == 0:
                print("even found")
                break
        else:
            print("no evens")
      `,
      codeLang: "python",
      options: ["`no evens`", "`even found`", "Nothing", "`SyntaxError`: `else` needs an `if`"],
      answer: [0],
      explanation:
        "A loop's `else` runs when the loop gets to the end without hitting `break`. There were no even numbers, so the loop finished normally and the `else` ran.",
    },
    {
      id: "d2-17",
      domain: "d2",
      level: "senior",
      lesson: "d2-traps",
      prompt: "What does this print?",
      code: py`print(7 // 2, -7 // 2, 7 / 2, round(2.5))`,
      codeLang: "python",
      options: ["`3 -4 3.5 2`", "`3 -3 3.5 3`", "`3 -4 3 3`", "`3.5 -3.5 3.5 3`"],
      answer: [0],
      explanation:
        "`//` rounds down toward negative infinity, so `-7 // 2` is -4, not -3. `/` always gives a float. `round` sends ties to the nearest even number, so 2.5 becomes 2.",
    },
    {
      id: "d2-18",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-traps",
      type: "lines",
      prompt: "This prints `[1, 2, 3]` instead of `[1, 3]`. Tap the line that causes the bug.",
      code: py`
        nums = [1, 2, 2, 3]
        for n in nums:
            if n == 2:
                nums.remove(n)
        print(nums)
      `,
      codeLang: "python",
      answer: [4],
      explanation:
        "Removing an item from the list you're looping over shifts the later items left. The loop's position moves on anyway, so it skips the second 2. Build a new list instead: `nums = [n for n in nums if n != 2]`.",
    },
    {
      id: "d2-19",
      domain: "d2",
      level: "senior",
      lesson: "d2-traps",
      prompt: "What does this print?",
      code: py`
        x = 5
        print(1 < x < 10, 10 > x > 7, x == 5 == True)
      `,
      codeLang: "python",
      options: ["`True False False`", "`True False True`", "`True True True`", "`False False True`"],
      answer: [0],
      explanation:
        "Python splits a chain into pairs joined by `and`. `10 > x > 7` means `10 > x and x > 7`, which is False. `x == 5 == True` means `x == 5 and 5 == True`, which is False because `True` equals 1, not 5.",
    },
    {
      id: "d2-20",
      domain: "d2",
      level: "junior",
      lesson: "d2-traps",
      prompt: "What does this print?",
      code: py`
        nums = [3, 1, 2]
        result = nums.sort()
        print(result, nums)
      `,
      codeLang: "python",
      options: ["`None [1, 2, 3]`", "`[1, 2, 3] [1, 2, 3]`", "`[1, 2, 3] [3, 1, 2]`", "`None [3, 1, 2]`"],
      answer: [0],
      explanation:
        "`list.sort()` sorts the list in place and returns `None`. That's a Python habit for methods that change an object. Use `sorted(nums)` when you want a new sorted list back.",
    },
    {
      id: "d2-21",
      domain: "d2",
      level: "junior",
      lesson: "d2-iterators",
      type: "match",
      prompt: "Match each built-in looping helper to what it gives you.",
      pairs: [
        ["`enumerate(xs)`", "(index, item) pairs"],
        ["`zip(a, b)`", "Tuples drawn from each input, stopping at the shortest"],
        ["`itertools.chain(a, b)`", "All of a's items, then all of b's"],
        ["`reversed(seq)`", "A sequence's items from last to first"],
      ],
      explanation: "All four hand back lazy iterators, so you can only go through each one once.",
    },
    {
      id: "d2-22",
      domain: "d2",
      level: "staff",
      lesson: "d2-generators",
      prompt: "A nightly job does `rows = list(csv.reader(f))` on a 20 GB file, transforms each row, and writes the results. It now gets killed for running out of memory. What's the best way to restructure it?",
      options: [
        "Turn it into a streaming pipeline of generators (read, then transform, then write) so only a few rows are in memory at once",
        "Add swap space so the list fits",
        "Sort the rows first with `sorted()`",
        "Convert the list of rows to a tuple before transforming it, since tuples use less memory per item and are faster to loop over in CPython",
      ],
      answer: [0],
      explanation:
        "Loading the whole file into a list needs memory the size of the file. A chain of generators handles one row at a time, so memory stays flat however big the input gets. The same design also scales later to chunked or parallel processing.",
    },
    {
      id: "d2-23",
      domain: "d2",
      level: "staff",
      lesson: "d2-iterators",
      prompt: "A widely used library function `records()` returns a `list`. You want it to become a lazy generator without breaking hundreds of callers. What's the safest migration?",
      options: [
        "Add a new `iter_records()` generator, reimplement `records()` as `list(iter_records())`, and move callers over gradually",
        "Change `records()` to return a generator in place, since callers that loop over it will still work fine",
        "Return a generator but wrap the body in `try/except`",
        "Make `records()` return a tuple instead",
      ],
      answer: [0],
      explanation:
        "Some callers will use `len()`, index into the result, or loop over it twice, and all of those break on a one-shot generator. Adding the lazy version alongside the old one keeps everyone working while big callers switch over. A deprecation warning can come later.",
    },
    {
      id: "d2-24",
      domain: "d2",
      level: "staff",
      lesson: "d2-traps",
      prompt: "A billing service adds up invoice amounts as floats, and month-end totals are off by fractions of a cent. Which fixes are sound? (Choose two.)",
      options: [
        "Store and calculate money as whole numbers of cents",
        "Use `decimal.Decimal` built from strings, with explicit rounding rules",
        "Call `round()` after every addition",
        "Switch to 32-bit floats",
        "Compare totals with `is` instead of `==`",
      ],
      answer: [0, 1],
      explanation:
        "Binary floats can't hold most decimal fractions exactly, which is why `0.1 + 0.2 != 0.3`. Whole cents or `Decimal(\"0.10\")` keep the arithmetic exact. Rounding after every step still drifts, and it hides the real cause.",
    },
    {
      id: "d2-25",
      domain: "d2",
      level: "staff",
      lesson: "d2-iterators",
      prompt: "You're designing a shared pipeline API that loops over its input exactly once. Which parameter type hint best states that contract?",
      options: [
        "`def process(events: Iterable[Event]) -> None`",
        "`def process(events: list[Event]) -> None`",
        "`def process(events: Sequence[Event]) -> None`",
        "`def process(events: Iterator[list]) -> None`",
      ],
      answer: [0],
      explanation:
        "Ask for the most general type you actually need. `Iterable` (from `collections.abc` or `typing`) lets callers pass lists, generators, files or database cursors. Asking for `list` or `Sequence` forces callers to build a full list for no reason.",
    },
    {
      id: "d2-26",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-iterators",
      type: "lines",
      prompt: "The audit log always records 0 users. Tap the line that's wrong.",
      code: py`
        def active_users(db):
            return (u for u in db.users() if u.active)

        users = active_users(db)
        send_digest(users)
        audit_log.write(len(list(users)))
      `,
      codeLang: "python",
      answer: [6],
      explanation:
        "`users` is a generator, and `send_digest` already used it up. By line 6 there's nothing left, so the count is 0. If you need two passes, build a list once with `users = list(active_users(db))`, or count during the first pass.",
    },
  ],

  cards: [
    { id: "c2-enumerate", domain: "d2", kind: "service", term: "enumerate()", definition: "Gives you (index, item) pairs as you loop. Pass start= to begin counting from a number other than 0." },
    { id: "c2-zip", domain: "d2", kind: "service", term: "zip()", definition: "Walks several iterables side by side and gives you a tuple from each step. It stops at the shortest one." },
    { id: "c2-chain", domain: "d2", kind: "service", term: "itertools.chain", definition: "Loops over several iterables one after another, as if they were one long stream." },
    { id: "c2-islice", domain: "d2", kind: "service", term: "itertools.islice", definition: "Slices any iterator lazily. For example, it can take the first 10 items of a generator that never ends." },
    { id: "c2-next", domain: "d2", kind: "service", term: "next()", definition: "Moves an iterator on by one item. When nothing is left it raises StopIteration, unless you pass a default to return instead." },
    { id: "c2-iter", domain: "d2", kind: "service", term: "iter()", definition: "Gets an iterator from an iterable by calling its __iter__ method." },
    { id: "c2-sorted", domain: "d2", kind: "service", term: "sorted()", definition: "Returns a new sorted list from any iterable. It's stable (equal items keep their order) and accepts key= and reverse=." },
    { id: "c2-iterable", domain: "d2", kind: "concept", term: "Iterable and iterator", definition: "An iterable is something you can loop over; it hands out iterators. An iterator gives items one by one with __next__ and only goes through once." },
    { id: "c2-generator", domain: "d2", kind: "concept", term: "Generator", definition: "A function that uses yield. Calling it gives you a lazy iterator that pauses at each yield until you ask for the next value." },
    { id: "c2-genexpr", domain: "d2", kind: "concept", term: "Generator expression", definition: "Written (expr for x in it). It looks like a list comprehension but makes items one at a time instead of building a list." },
    { id: "c2-yieldfrom", domain: "d2", kind: "concept", term: "yield from", definition: "Passes along every value from another iterable, as if the current generator had yielded each one itself." },
    { id: "c2-forelse", domain: "d2", kind: "concept", term: "for / else", definition: "The else block runs only if the loop got to the end without hitting break." },
  ],

  challenges: [
    {
      id: "ch-py-exhaust",
      domain: "d2",
      lesson: "d2-generators",
      title: "Run the generator dry",
      goal: "Call next() until the generator raises StopIteration.",
      hint: "Each next() runs on to the following yield. After the last value, one more call ends it.",
      takeaway: "A generator yields its values and then raises StopIteration on the next call. A for loop catches that for you.",
      render: (onSolved) => <GeneratorLab goal="exhaust" onSolved={onSolved} />,
    },
    {
      id: "ch-py-predict",
      domain: "d2",
      lesson: "d2-generators",
      title: "Predict every step",
      goal: "Predict every next() correctly, from a fresh generator right through to StopIteration, without a single miss.",
      hint: "countdown(n) yields n, then n-1, down to 1. After that the loop condition fails, done prints, and StopIteration is raised.",
      takeaway: "Generators pick up exactly where they paused, keep their local variables, and finish with StopIteration.",
      render: (onSolved) => <GeneratorLab goal="predict" onSolved={onSolved} />,
    },
  ],
});
