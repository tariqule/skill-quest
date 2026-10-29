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
    summary: "Comprehensions, iterables vs iterators, lazy generators and yield, and the classic \"what does this print?\" traps.",
  },

  tasks: [
    { id: "2.1", title: "Comprehensions", covers: ["List, dict, and set comprehensions", "Nested loops and filters", "Generator expressions vs list comprehensions"] },
    {
      id: "2.2",
      title: "Iterators and generators",
      covers: ["iter() / next() / StopIteration", "Single-pass iterators: map, filter, zip, generators", "yield, yield from, lazy evaluation"],
    },
    {
      id: "2.3",
      title: "Common output traps",
      covers: ["for/else", "Floor division and banker's rounding", "Chained comparisons", "Methods that return None", "Mutating a list while iterating"],
    },
  ],

  lessons: [
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
              { icon: "🎁", label: "Expression", sub: "x * x: what goes in the result" },
              { icon: "🔁", label: "for clause(s)", sub: "Leftmost for is the outer loop" },
              { icon: "🧹", label: "if filter", sub: "Keeps items where it's truthy" },
            ]}
          />
        </div>
      ),
      points: [
        "Multiple for clauses nest in the same order you'd write the loops.",
        "In Python 3 the loop variable stays inside the comprehension; it doesn't leak or overwrite an outer name.",
        "In a dict comprehension, a repeated key keeps the last value.",
        "Use a generator expression (round brackets) when you only iterate once: sum(x * x for x in data).",
      ],
      tip: "If a comprehension needs more than two clauses or a nested ternary, say you'd switch to a plain loop for readability. Interviewers like that judgment.",
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
              { icon: "📦", label: "Iterable", sub: "list, str, dict, file… has __iter__" },
              { icon: "🔑", label: "iter(obj)", sub: "Returns a fresh iterator" },
              { icon: "➡️", label: "next(it)", sub: "Returns the next item" },
              { icon: "🛑", label: "StopIteration", sub: "Raised when exhausted; for swallows it" },
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
        "An iterable can produce iterators (__iter__). An iterator also has __next__ and returns itself from __iter__.",
        "Iterators are single-pass: map, filter, zip, enumerate, files, and generators are exhausted after one loop.",
        "zip stops at the shortest input (use itertools.zip_longest or zip(..., strict=True) when lengths matter).",
      ],
      tip: "\"Why is my second loop empty?\" is almost always an exhausted iterator. Materialize it with list() if you need it twice.",
    },
    {
      id: "d2-generators",
      level: "intermediate",
      task: "2.2",
      title: "Generators pause at yield",
      check: ["d2-11", "d2-12"],
      visual: <GeneratorLab />,
      points: [
        "Calling a generator function runs nothing: it returns a generator object.",
        "Each next() resumes the body until the next yield, then freezes local state.",
        "When the body ends, the generator raises StopIteration; it can't be restarted.",
        "yield from inner() delegates to another iterable, yielding each of its items.",
        "Generators are lazy: they can model huge or infinite streams in O(1) memory.",
      ],
      tip: "Use generators to explain memory trade-offs: \"Reading a 10 GB log line by line with a generator keeps one line in memory at a time.\"",
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
            { icon: "🔚", title: "for / else", text: "else runs when the loop finishes without break.", color: "#34d399" },
            { icon: "➗", title: "Floor division", text: "-7 // 2 is -4: it rounds toward negative infinity.", color: "#f59e0b" },
            { icon: "🏦", title: "Banker's rounding", text: "round(2.5) is 2 and round(3.5) is 4: ties go to even.", color: "#f59e0b" },
            { icon: "⛓️", title: "Chained comparisons", text: "a < b < c means a < b and b < c.", color: "#a78bfa" },
            { icon: "🕳️", title: "Returns None", text: "list.sort(), append, random.shuffle mutate and return None.", color: "#fb7185" },
            { icon: "✂️", title: "Removing while looping", text: "Mutating a list while iterating it skips items. Build a new list instead.", color: "#fb7185" },
          ]}
        />
      ),
      points: [
        "Floats are binary: 0.1 + 0.2 == 0.3 is False. Use math.isclose or decimal.Decimal.",
        "sorted(x) returns a new list; x.sort() sorts in place and returns None.",
        "True == 1 and False == 0, because bool is a subclass of int.",
      ],
      tip: "Read trick snippets out loud line by line and say the state after each line. It slows you down enough to catch the trap.",
    },
  ],

  questions: [
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
      explanation: "The filter keeps 0, 2, 4 (even numbers in `range(5)`), and the expression squares them.",
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
      explanation: "The leftmost `for` is the outer loop. For i=0, j runs 0..2 (skipping 0); for i=1, j runs 0..2 (skipping 1).",
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
      explanation: "Both `apple` and `avocado` map to key `'a'`. Later assignments overwrite earlier ones, so the last value wins. Duplicate keys never raise.",
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
      explanation: "Comprehension variables are scoped to the comprehension in Python 3, so the outer `x` is untouched. (In Python 2 list comprehensions leaked their variable.)",
    },
    {
      id: "d2-05",
      domain: "d2",
      level: "senior",
      lesson: "d2-comprehensions",
      prompt: "When is a generator expression a better choice than a list comprehension? (Choose two.)",
      options: [
        "You only iterate over the results once, e.g. `sum(x * x for x in data)`",
        "The input is huge or infinite and you don't want everything in memory",
        "You need `len()` of the result",
        "You need to index into the result",
        "You need to loop over the result several times",
      ],
      answer: [0, 1],
      explanation: "A generator expression produces items lazily in O(1) extra memory. It has no `len()`, no indexing, and is exhausted after one pass.",
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
      explanation: "`map` returns an iterator. The first `list()` consumes it; the second finds it exhausted and gets an empty list (no exception: `list()` handles `StopIteration`).",
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
      explanation: "`zip` stops at the shortest iterable. `itertools.zip_longest` pads with a fill value, and `zip(..., strict=True)` (3.10+) raises on unequal lengths.",
    },
    {
      id: "d2-08",
      domain: "d2",
      level: "junior",
      lesson: "d2-iterators",
      type: "order",
      prompt: "Order what a `for x in obj:` loop does under the hood.",
      items: [
        "Call `iter(obj)` to get an iterator",
        "Call `next()` on the iterator",
        "Bind the returned value to `x` and run the body",
        "Keep calling `next()` until it raises `StopIteration`",
        "Catch `StopIteration` silently and leave the loop",
      ],
      explanation: "That's the whole iterator protocol. Anything with `__iter__` (or a legacy `__getitem__`) can be looped over.",
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
      explanation: "When `n` is 0 the check `n < 0` is False, so it returns 0 before stopping. The stop condition should be `if self.n <= 0:`.",
    },
    {
      id: "d2-10",
      domain: "d2",
      level: "junior",
      lesson: "d2-iterators",
      prompt: "What's the difference between an iterable and an iterator?",
      options: [
        "An iterable's `__iter__` returns an iterator; an iterator has `__next__`, returns itself from `__iter__`, and is single-pass",
        "They're the same thing; the names are interchangeable",
        "Iterators can be indexed with `[]`; iterables can't",
        "An iterable is always a list; an iterator is always a generator",
      ],
      answer: [0],
      explanation: "A list is iterable: each `iter(lst)` gives a new independent iterator. An iterator keeps a position and is consumed as you advance it.",
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
      explanation: "`gen()` only creates the generator; no body code runs. `next(g)` runs until the first `yield`, printing `A` and returning 1. `B` would print on the next `next()`.",
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
      explanation: "The first `sum` consumes 0 + 1 + 4 = 5. The generator is then exhausted, so the second `sum` adds nothing and returns 0.",
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
      explanation: "`yield from` delegates to the inner iterable and yields each of its items in turn, flattening them into the outer generator.",
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
      explanation: "With `return` and no `yield`, this is a normal function that returns the first id (an int), and `list(1)` fails. `yield row[\"id\"]` makes it a generator.",
    },
    {
      id: "d2-15",
      domain: "d2",
      level: "junior",
      lesson: "d2-generators",
      prompt: "What happens when you call a generator function, e.g. `g = numbers()`?",
      options: [
        "It returns a generator object; none of the body runs until the first `next()`",
        "It runs the whole body and stores every yielded value in a list",
        "It runs up to the first `yield` immediately",
        "It starts a background thread that produces values",
      ],
      answer: [0],
      explanation: "Generators are lazy. The body starts on the first `next()` (or loop iteration) and pauses at each `yield`. No threads are involved.",
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
      explanation: "A loop's `else` runs when the loop completes without hitting `break`. No even number was found, so the loop finished normally.",
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
      explanation: "`//` floors toward negative infinity, so `-7 // 2` is -4. `/` always returns a float. `round` uses round-half-to-even, so 2.5 rounds to 2.",
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
        "Removing from the list being iterated shifts later items left, so the loop's internal index skips the second 2. Build a new list instead: `nums = [n for n in nums if n != 2]`.",
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
      explanation: "Chains expand pairwise with `and`: `10 > x and x > 7` is False, and `x == 5 and 5 == True` is False because `True == 1`.",
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
      explanation: "`list.sort()` sorts in place and returns `None` (a Python convention for mutating methods). Use `sorted(nums)` to get a new sorted list.",
    },
    {
      id: "d2-21",
      domain: "d2",
      level: "junior",
      lesson: "d2-iterators",
      type: "match",
      prompt: "Match each built-in iteration helper to what it yields.",
      pairs: [
        ["`enumerate(xs)`", "(index, item) pairs"],
        ["`zip(a, b)`", "Tuples drawn from each input, stopping at the shortest"],
        ["`itertools.chain(a, b)`", "All of a's items, then all of b's"],
        ["`reversed(seq)`", "A sequence's items from last to first"],
      ],
      explanation: "All four return lazy iterators, so each can be consumed only once.",
    },
    {
      id: "d2-22",
      domain: "d2",
      level: "staff",
      lesson: "d2-generators",
      prompt: "A nightly job does `rows = list(csv.reader(f))` on a 20 GB file, transforms each row, and writes the results. It now gets killed for running out of memory. What's the best restructuring?",
      options: [
        "Turn it into a streaming pipeline of generators (read → transform → write) so only a few rows are in memory at once",
        "Add swap space so the list fits",
        "Sort the rows first with `sorted()`",
        "Convert the list of rows to a tuple",
      ],
      answer: [0],
      explanation:
        "Materializing the file is O(file size) memory. Chained generators keep memory constant regardless of input size, and the same design scales to chunked or parallel processing later.",
    },
    {
      id: "d2-23",
      domain: "d2",
      level: "staff",
      lesson: "d2-iterators",
      prompt: "A widely used library function `records()` returns a `list`. You want it to become a lazy generator without breaking hundreds of callers. What's the safest migration?",
      options: [
        "Add a new `iter_records()` generator, reimplement `records()` as `list(iter_records())`, and move callers over gradually",
        "Change `records()` to return a generator in place, since callers that loop over it will still work",
        "Return a generator but wrap the body in `try/except`",
        "Make `records()` return a tuple instead",
      ],
      answer: [0],
      explanation:
        "Callers may use `len()`, indexing, or iterate twice, and all of those break on a one-shot generator. Adding the lazy API alongside the old one keeps compatibility while large callers opt in (a deprecation warning can follow).",
    },
    {
      id: "d2-24",
      domain: "d2",
      level: "staff",
      lesson: "d2-traps",
      prompt: "A billing service sums invoice amounts as floats, and month-end totals are off by fractions of a cent. Which fixes are sound? (Choose two.)",
      options: [
        "Store and compute money as integer cents",
        "Use `decimal.Decimal` built from strings, with explicit rounding rules",
        "Call `round()` after every addition",
        "Switch to 32-bit floats",
        "Compare totals with `is` instead of `==`",
      ],
      answer: [0, 1],
      explanation:
        "Binary floats can't represent most decimal fractions exactly (`0.1 + 0.2 != 0.3`). Integer cents or `Decimal(\"0.10\")` keep exact decimal arithmetic. Repeated rounding still drifts and hides the cause.",
    },
    {
      id: "d2-25",
      domain: "d2",
      level: "staff",
      lesson: "d2-iterators",
      prompt: "You're defining a shared pipeline API that loops over its input exactly once. Which parameter annotation best states that contract?",
      options: [
        "`def process(events: Iterable[Event]) -> None`",
        "`def process(events: list[Event]) -> None`",
        "`def process(events: Sequence[Event]) -> None`",
        "`def process(events: Iterator[list]) -> None`",
      ],
      answer: [0],
      explanation:
        "Accept the most general type you actually need. `Iterable` (from `collections.abc` or `typing`) lets callers pass lists, generators, files, or query cursors. Requiring `list` or `Sequence` forces needless materialization.",
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
        "`users` is a generator. `send_digest` consumed it, so line 6 sees an empty iterator and counts 0. Materialize once with `users = list(active_users(db))` if you need two passes, or count during the first one.",
    },
  ],

  cards: [
    { id: "c2-enumerate", domain: "d2", kind: "service", term: "enumerate()", definition: "Yields (index, item) pairs; start= sets the first index." },
    { id: "c2-zip", domain: "d2", kind: "service", term: "zip()", definition: "Yields tuples from several iterables in parallel, stopping at the shortest." },
    { id: "c2-chain", domain: "d2", kind: "service", term: "itertools.chain", definition: "Iterates several iterables one after another as a single stream." },
    { id: "c2-islice", domain: "d2", kind: "service", term: "itertools.islice", definition: "Slices any iterator lazily, e.g. the first 10 items of an infinite generator." },
    { id: "c2-next", domain: "d2", kind: "service", term: "next()", definition: "Advances an iterator; raises StopIteration when done unless you pass a default." },
    { id: "c2-iter", domain: "d2", kind: "service", term: "iter()", definition: "Gets an iterator from an iterable by calling its __iter__." },
    { id: "c2-sorted", domain: "d2", kind: "service", term: "sorted()", definition: "Returns a new sorted list from any iterable; stable; supports key= and reverse=." },
    { id: "c2-iterable", domain: "d2", kind: "concept", term: "Iterable vs iterator", definition: "An iterable produces iterators; an iterator yields items with __next__ and is single-pass." },
    { id: "c2-generator", domain: "d2", kind: "concept", term: "Generator", definition: "A function with yield. Calling it returns a lazy iterator that pauses at each yield." },
    { id: "c2-genexpr", domain: "d2", kind: "concept", term: "Generator expression", definition: "(expr for x in it): a comprehension that yields lazily instead of building a list." },
    { id: "c2-yieldfrom", domain: "d2", kind: "concept", term: "yield from", definition: "Delegates to a sub-iterable, yielding each of its values from the current generator." },
    { id: "c2-forelse", domain: "d2", kind: "concept", term: "for / else", definition: "The else block runs only if the loop finished without break." },
  ],

  challenges: [
    {
      id: "ch-py-exhaust",
      domain: "d2",
      lesson: "d2-generators",
      title: "Run the generator dry",
      goal: "Call next() until the generator raises StopIteration.",
      hint: "Each next() runs to the following yield. After the last value, one more call ends the loop.",
      takeaway: "A generator yields n values and then raises StopIteration on the next call. A for loop catches that for you.",
      render: (onSolved) => <GeneratorLab goal="exhaust" onSolved={onSolved} />,
    },
    {
      id: "ch-py-predict",
      domain: "d2",
      lesson: "d2-generators",
      title: "Predict every step",
      goal: "Predict every next() correctly from a fresh generator through to StopIteration, without a single miss.",
      hint: "countdown(n) yields n, n-1, … 1. Then the loop condition fails, done prints, and StopIteration is raised.",
      takeaway: "Generators resume exactly where they paused, keep their local variables, and finish with StopIteration.",
      render: (onSolved) => <GeneratorLab goal="predict" onSolved={onSolved} />,
    },
  ],
});
