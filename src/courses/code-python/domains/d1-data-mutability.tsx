import { CodeBlock, CodeCompare } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { AliasLab } from "../labs";
import { py } from "../py";
import { ComplexityExplorer, SliceRuler } from "../visuals";

/** Module 1: the data model — names, objects, mutability, copying, collections, slicing. */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "Data, Mutability & Collections",
    world: "The Mutable Marsh",
    weight: 25,
    emoji: "🐊",
    color: "#38bdf8",
    summary: "Names and objects, mutable vs immutable types, is vs ==, shallow vs deep copies, collection complexity, and slicing.",
  },

  tasks: [
    {
      id: "1.1",
      title: "Names, objects, and mutability",
      covers: ["Names are references to objects", "Mutable vs immutable built-ins", "Identity (is) vs equality (==)", "Tuples holding mutable items"],
    },
    {
      id: "1.2",
      title: "Copying",
      covers: ["Aliasing with assignment", "Shallow copies: copy.copy, list(x), x[:], .copy()", "Deep copies with copy.deepcopy", "The [[0] * n] * n grid trap"],
    },
    {
      id: "1.3",
      title: "Built-in collections and their costs",
      covers: ["list, tuple, dict, set, deque, heapq", "Average-case complexity of common operations", "Hashability and dict ordering"],
    },
    {
      id: "1.4",
      title: "Sequences and slicing",
      covers: ["Positive and negative indexes", "start:stop:step semantics and clipping", "Slice assignment"],
    },
  ],

  lessons: [
    {
      id: "d1-mutability",
      level: "junior",
      task: "1.1",
      title: "Names are labels, not boxes",
      check: ["d1-01", "d1-04"],
      visual: <AliasLab />,
      points: [
        "Assignment never copies: b = a makes a second name for the same object.",
        "Mutable: list, dict, set, most user classes. Immutable: int, float, str, tuple, frozenset, bytes.",
        "Operations on immutables (like s += \"!\") build a new object and rebind the name; the old object is unchanged.",
        "== asks \"equal values?\" (calls __eq__); is asks \"same object?\". Use is for None and other singletons.",
        "A tuple is immutable, but a list inside it can still change.",
      ],
      tip: "When asked \"what does this print?\", draw names as arrows to objects. Mutation changes the object; assignment moves an arrow.",
    },
    {
      id: "d1-copying",
      level: "intermediate",
      task: "1.2",
      title: "Shallow vs deep copies",
      check: ["d1-08", "d1-10"],
      visual: (
        <div className="grid gap-4">
          <CodeCompare
            lang="python"
            left={{
              title: "Shallow: nested lists shared",
              code: py`
                a = [[1, 2], [3]]
                b = a.copy()        # or list(a), a[:]
                b[0].append(99)
                print(a)  # [[1, 2, 99], [3]]
              `,
            }}
            right={{
              title: "Deep: fully independent",
              code: py`
                import copy
                a = [[1, 2], [3]]
                b = copy.deepcopy(a)
                b[0].append(99)
                print(a)  # [[1, 2], [3]]
              `,
            }}
          />
          <CodeCompare
            lang="python"
            left={{ title: "Trap: one row, three times", code: py`
              grid = [[0] * 3] * 3
              grid[0][0] = "X"
              # [['X', 0, 0], ['X', 0, 0], ['X', 0, 0]]
            ` }}
            right={{ title: "Fix: a new row each time", code: py`
              grid = [[0] * 3 for _ in range(3)]
              grid[0][0] = "X"
              # [['X', 0, 0], [0, 0, 0], [0, 0, 0]]
            ` }}
          />
        </div>
      ),
      points: [
        "A shallow copy makes a new outer container whose items are the same objects as the original's.",
        "copy.deepcopy recursively copies nested containers (and handles cycles).",
        "[x] * n repeats references. That's fine for immutable x, a trap when x is a list.",
      ],
      tip: "Interviewers love the grid trap. Say \"* copies references, so all rows are one list\" and offer the comprehension fix.",
    },
    {
      id: "d1-collections",
      level: "intermediate",
      task: "1.3",
      title: "Pick the right collection",
      check: ["d1-12", "d1-15"],
      visual: <ComplexityExplorer />,
      points: [
        "Membership tests: O(n) on a list or tuple, O(1) average on a set or dict.",
        "Lists are fast at the end and slow at the front. Use collections.deque for queues.",
        "Dict and set keys must be hashable: immutable built-ins (and tuples of them) work, lists and dicts don't.",
        "Dicts keep insertion order. Updating an existing key keeps its original position.",
      ],
      tip: "Before optimizing, name the hot operation (lookup, insert at front, min) and choose the structure that makes it O(1) or O(log n).",
    },
    {
      id: "d1-slicing",
      level: "junior",
      task: "1.4",
      title: "Slicing without surprises",
      check: ["d1-17", "d1-20"],
      visual: (
        <div className="grid gap-4">
          <SliceRuler />
          <CodeBlock
            lang="python"
            code={py`
              nums = [0, 1, 2, 3, 4, 5]
              nums[:3]    # [0, 1, 2]   first three
              nums[-2:]   # [4, 5]      last two
              nums[::-1]  # reversed copy
              nums[10:]   # []          no IndexError
              nums[1:3] = ["x"]  # slice assignment can change length
            `}
          />
        </div>
      ),
      points: [
        "s[start:stop:step]: start included, stop excluded. Omitted bounds default to the ends (or the far ends when step is negative).",
        "Out-of-range slice bounds are clipped, so slicing never raises IndexError (indexing does).",
        "Slicing a list returns a new (shallow) list. Slicing a str returns a new str.",
        "-0 is just 0, so items[-n:] returns everything when n == 0.",
      ],
      tip: "For \"reverse a string\", s[::-1] is the expected one-liner. Mention it creates a copy (O(n) time and memory).",
    },
  ],

  questions: [
    {
      id: "d1-01",
      domain: "d1",
      level: "junior",
      lesson: "d1-mutability",
      prompt: "What does this print?",
      code: py`
        a = [1, 2, 3]
        b = a
        b.append(4)
        print(a)
      `,
      codeLang: "python",
      options: ["`[1, 2, 3]`", "`[1, 2, 3, 4]`", "`None`", "`AttributeError`"],
      answer: [1],
      explanation: "`b = a` doesn't copy; both names point to one list. Appending through `b` mutates that list, so `a` shows the change.",
    },
    {
      id: "d1-02",
      domain: "d1",
      level: "junior",
      lesson: "d1-mutability",
      prompt: "What does this print?",
      code: py`
        x = "hi"
        y = x
        y += "!"
        print(x, y)
      `,
      codeLang: "python",
      options: ["`hi hi!`", "`hi! hi!`", "`hi hi`", "`TypeError`"],
      answer: [0],
      explanation: "Strings are immutable. `y += \"!\"` builds a new string and rebinds `y`; `x` still points to the original `\"hi\"`.",
    },
    {
      id: "d1-03",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-mutability",
      prompt: "What does this print?",
      code: py`
        t = (1, [2, 3])
        t[1].append(4)
        print(t)
      `,
      codeLang: "python",
      options: ["`(1, [2, 3, 4])`", "`(1, [2, 3])`", "`TypeError: 'tuple' object does not support item assignment`", "`AttributeError`"],
      answer: [0],
      explanation: "The tuple can't change which objects it holds, but the list it holds is mutable. `append` mutates the list without assigning to the tuple.",
    },
    {
      id: "d1-04",
      domain: "d1",
      level: "senior",
      lesson: "d1-mutability",
      prompt: "What does this print?",
      code: py`
        t = (1, [2])
        try:
            t[1] += [3]
        except TypeError:
            print("error")
        print(t)
      `,
      codeLang: "python",
      options: ["`error` then `(1, [2, 3])`", "`error` then `(1, [2])`", "Only `(1, [2, 3])`", "Only `(1, [2])`"],
      answer: [0],
      explanation:
        "`t[1] += [3]` first calls the list's in-place `__iadd__` (which extends it), then tries `t[1] = result`, which fails because tuples don't support item assignment. The mutation already happened.",
    },
    {
      id: "d1-05",
      domain: "d1",
      level: "junior",
      lesson: "d1-mutability",
      prompt: "Which statement about `is` and `==` is correct?",
      options: [
        "`==` compares values (via `__eq__`); `is` checks whether both operands are the very same object",
        "`is` is a faster `==` and gives the same answer for every type",
        "`==` compares memory addresses; `is` compares values",
        "`is` should be used to compare strings and numbers",
      ],
      answer: [0],
      explanation:
        "`is` compares identity. Two equal lists are usually different objects. Whether equal small ints or strings share an object is a CPython implementation detail, so never rely on `is` for values.",
    },
    {
      id: "d1-06",
      domain: "d1",
      level: "junior",
      lesson: "d1-mutability",
      prompt: "What does this print?",
      code: py`
        a = [1, 2]
        b = [1, 2]
        print(a == b, a is b)
      `,
      codeLang: "python",
      options: ["`True False`", "`True True`", "`False False`", "`False True`"],
      answer: [0],
      explanation: "Two separate list displays create two list objects. Their contents are equal (`==` is True) but they are not the same object (`is` is False).",
    },
    {
      id: "d1-07",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-mutability",
      prompt: "When is `is` the right operator? (Choose two.)",
      options: [
        "Checking whether a value is `None`",
        "Checking whether two names refer to the very same object",
        "Checking whether two strings contain the same text",
        "Checking whether two integers are equal",
        "Checking whether two lists have the same contents",
      ],
      answer: [0, 1],
      explanation: "`None` is a singleton, so PEP 8 recommends `x is None`. For value comparisons, always use `==`.",
    },
    {
      id: "d1-08",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-copying",
      prompt: "What does this print?",
      code: py`
        import copy
        a = [[1], [2]]
        b = copy.copy(a)
        b[0].append(9)
        b.append([3])
        print(a)
      `,
      codeLang: "python",
      options: ["`[[1, 9], [2]]`", "`[[1], [2]]`", "`[[1, 9], [2], [3]]`", "`[[1], [2], [3]]`"],
      answer: [0],
      explanation:
        "A shallow copy is a new outer list holding the same inner lists. `b[0].append(9)` mutates a shared inner list (visible in `a`); `b.append([3])` only changes `b`'s own outer list.",
    },
    {
      id: "d1-09",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-copying",
      prompt: "What does this print?",
      code: py`
        import copy
        a = {"tags": ["x"]}
        b = copy.deepcopy(a)
        b["tags"].append("y")
        print(a["tags"], b["tags"])
      `,
      codeLang: "python",
      options: ["`['x'] ['x', 'y']`", "`['x', 'y'] ['x', 'y']`", "`['x'] ['x']`", "`KeyError`"],
      answer: [0],
      explanation: "`deepcopy` copies the dict and the list inside it, so the two dicts share nothing mutable.",
    },
    {
      id: "d1-10",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-copying",
      type: "lines",
      prompt: "This prints `[['X', 0, 0], ['X', 0, 0], ['X', 0, 0]]`. Tap the line that causes every row to change.",
      code: py`
        def make_board(n):
            row = [0] * n
            board = [row] * n
            return board

        b = make_board(3)
        b[0][0] = "X"
        print(b)
      `,
      codeLang: "python",
      answer: [3],
      explanation:
        "`[row] * n` builds a list containing the same `row` object n times. Build a fresh row per iteration: `board = [[0] * n for _ in range(n)]`. Line 2 is fine because ints are immutable.",
    },
    {
      id: "d1-11",
      domain: "d1",
      level: "junior",
      lesson: "d1-copying",
      prompt: "Which expressions create a shallow copy of the list `a`? (Choose three.)",
      options: ["`a[:]`", "`list(a)`", "`a.copy()`", "`b = a`", "`copy.deepcopy(a)`"],
      answer: [0, 1, 2],
      explanation: "Slicing, the `list()` constructor, and `.copy()` all build a new outer list. `b = a` is an alias; `deepcopy` is a deep copy.",
    },
    {
      id: "d1-12",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-collections",
      prompt: "`names` is a list of 1,000,000 strings and there are 10,000 queries. What does each `in` check cost, and what's the usual fix?",
      code: py`
        hits = 0
        for q in queries:
            if q in names:
                hits += 1
      `,
      codeLang: "python",
      options: [
        "O(n) per check; build `set(names)` once for O(1) average lookups",
        "O(1) per check; it's already optimal",
        "O(log n) per check; sort the list first",
        "O(n) per check; convert it to a tuple",
      ],
      answer: [0],
      explanation: "`in` on a list scans linearly. A set is a hash table, so membership is O(1) on average. Building the set once costs O(n).",
    },
    {
      id: "d1-13",
      domain: "d1",
      level: "senior",
      lesson: "d1-collections",
      type: "match",
      prompt: "Match each operation to its typical time complexity.",
      pairs: [
        ["`lst.append(x)`", "O(1) amortized"],
        ["`lst.insert(0, x)`", "O(n)"],
        ["`d[key]` on a dict", "O(1) average"],
        ["`sorted(lst)`", "O(n log n)"],
      ],
      explanation: "Appending to a dynamic array is amortized O(1); inserting at the front shifts every element. Dict lookups hash the key. Python's sort is Timsort, O(n log n).",
    },
    {
      id: "d1-14",
      domain: "d1",
      level: "junior",
      lesson: "d1-collections",
      type: "lines",
      prompt: "Tap the line that raises an exception.",
      code: py`
        d = {}
        d[(1, 2)] = "tuple key"
        d[[1, 2]] = "list key"
        print(d)
      `,
      codeLang: "python",
      answer: [3],
      explanation: "Dict keys must be hashable. A tuple of ints is hashable; a list is mutable and unhashable, so line 3 raises `TypeError: unhashable type: 'list'`.",
    },
    {
      id: "d1-15",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-collections",
      prompt: "What does this print?",
      code: py`
        d = {"b": 1, "a": 2}
        d["c"] = 3
        d["b"] = 4
        print(list(d))
      `,
      codeLang: "python",
      options: ["`['b', 'a', 'c']`", "`['a', 'b', 'c']`", "`['a', 'c', 'b']`", "The order is arbitrary"],
      answer: [0],
      explanation: "Dicts preserve insertion order (guaranteed since Python 3.7). Assigning to an existing key updates its value but keeps its position.",
    },
    {
      id: "d1-16",
      domain: "d1",
      level: "junior",
      lesson: "d1-collections",
      prompt: "What does this print?",
      code: py`
        a = {1, 2, 3}
        b = {2, 3, 4}
        print(a & b, a - b)
      `,
      codeLang: "python",
      options: ["`{2, 3} {1}`", "`{1, 2, 3, 4} {1}`", "`{2, 3} {4}`", "`{2, 3} {1, 4}`"],
      answer: [0],
      explanation: "`&` is intersection (in both). `-` is difference (in `a` but not `b`). `|` is union and `^` is symmetric difference.",
    },
    {
      id: "d1-17",
      domain: "d1",
      level: "junior",
      lesson: "d1-slicing",
      prompt: "What does this print?",
      code: py`
        s = "python"
        print(s[1:4], s[-2:], s[::-1])
      `,
      codeLang: "python",
      options: ["`yth on nohtyp`", "`ytho on nohtyp`", "`yth n nohtyp`", "`pyt on nohtyp`"],
      answer: [0],
      explanation: "`s[1:4]` takes indexes 1, 2, 3 (stop excluded). `s[-2:]` is the last two characters. A step of -1 walks backwards over the whole string.",
    },
    {
      id: "d1-18",
      domain: "d1",
      level: "junior",
      lesson: "d1-slicing",
      prompt: "What does this print?",
      code: py`
        nums = [0, 1, 2, 3, 4, 5]
        print(nums[::2], nums[10:], nums[-1])
      `,
      codeLang: "python",
      options: ["`[0, 2, 4] [] 5`", "`[0, 2, 4] IndexError`", "`[1, 3, 5] [] 5`", "`[0, 2, 4] [] 0`"],
      answer: [0],
      explanation: "A step of 2 takes every other item from the start. Out-of-range slice bounds are clipped, giving `[]` instead of an error. Index `-1` is the last item.",
    },
    {
      id: "d1-19",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-slicing",
      prompt: "What does this print?",
      code: py`
        a = [1, 2, 3, 4]
        a[1:3] = ["x"]
        print(a)
      `,
      codeLang: "python",
      options: ["`[1, 'x', 4]`", "`[1, 'x', 'x', 4]`", "`[1, ['x'], 4]`", "`ValueError`"],
      answer: [0],
      explanation: "Slice assignment replaces the slice (items at 1 and 2) with the items of the right-hand iterable, so the list can shrink or grow.",
    },
    {
      id: "d1-20",
      domain: "d1",
      level: "senior",
      lesson: "d1-slicing",
      type: "lines",
      prompt: "`last_n([1, 2, 3], 0)` returns `[1, 2, 3]` instead of `[]`. Tap the buggy line.",
      code: py`
        def last_n(items, n):
            """Return the last n items (n may be 0)."""
            return items[-n:]

        print(last_n([1, 2, 3], 2))  # [2, 3]
        print(last_n([1, 2, 3], 0))  # [1, 2, 3]
      `,
      codeLang: "python",
      answer: [3],
      explanation: "`-0` is `0`, so `items[-0:]` is `items[0:]`, the whole list. A safe version: `return items[len(items) - n:]` (or handle `n == 0` explicitly).",
    },
    {
      id: "d1-21",
      domain: "d1",
      level: "junior",
      lesson: "d1-copying",
      type: "order",
      prompt: "Arrange the lines so the program prints `[1, 2] [1, 2, 3]`.",
      items: ["`a = [1, 2]`", "`b = a.copy()`", "`b.append(3)`", "`print(a, b)`"],
      explanation: "Copy first, then mutate the copy. If `b.append(3)` ran on an alias (`b = a`), both would print `[1, 2, 3]`.",
    },
    {
      id: "d1-22",
      domain: "d1",
      level: "staff",
      lesson: "d1-collections",
      prompt: "A service keeps 50 million user records in memory as a dict of small dicts (`{user_id: {\"name\": ..., \"plan\": ...}}`). Memory is now the bottleneck. Which change usually cuts memory the most while keeping O(1) lookup by ID?",
      options: [
        "Store each record as an instance of a class with `__slots__` (or `@dataclass(slots=True)`) instead of a per-record dict",
        "Replace the outer dict with a list and scan it for each lookup",
        "Call `copy.deepcopy` on each record when it's read",
        "Convert every user ID key to a string",
      ],
      answer: [0],
      explanation:
        "Every small dict carries its own hash table. Slotted instances store fields in a fixed layout with no per-instance `__dict__`. At larger scale, columnar storage (arrays, NumPy) or an external store goes further. Scanning a list makes lookups O(n).",
    },
    {
      id: "d1-23",
      domain: "d1",
      level: "staff",
      lesson: "d1-mutability",
      prompt: "A shared library returns its module-level `DEFAULT_CONFIG` dict to callers. A bug report shows one request's tweaks leaking into later requests. What's the most robust fix at the API boundary?",
      options: [
        "Return a fresh copy (or a read-only `types.MappingProxyType` view with immutable values) so callers can't mutate the shared object",
        "Document that callers must not mutate the returned dict",
        "Add `global DEFAULT_CONFIG` to every function that reads it",
        "Compare configs with `is` instead of `==`",
      ],
      answer: [0],
      explanation:
        "The leak is aliasing: every caller gets the same mutable object. Hand out copies, or a read-only view. `MappingProxyType` only protects the top level, so nested values should be immutable too (tuples, frozen dataclasses) or deep-copied.",
    },
    {
      id: "d1-24",
      domain: "d1",
      level: "staff",
      lesson: "d1-copying",
      prompt: "A PR adds `copy.deepcopy(request_state)` on every request in a hot path \"to be safe\". Which review concerns are valid? (Choose two.)",
      options: [
        "`deepcopy` walks the whole object graph, so its cost grows with the state's size on every request",
        "Objects holding locks, sockets, or open files may fail to copy (or copy into something that doesn't work)",
        "`deepcopy` only makes a shallow copy of dicts",
        "`deepcopy` isn't in the standard library",
        "`deepcopy` crashes on objects with reference cycles",
      ],
      answer: [0, 1],
      explanation:
        "`deepcopy` is correct but expensive, and resources like `threading.Lock` can't be copied (it raises `TypeError`). It does handle cycles with its memo dict. Prefer immutable state or copy only what you mutate.",
    },
    {
      id: "d1-25",
      domain: "d1",
      level: "staff",
      lesson: "d1-collections",
      type: "order",
      prompt: "Find the 10 most frequent words in a 50 GB log on an 8 GB machine, where even the word counts may not fit in memory. Order the steps.",
      items: [
        "Stream the file once and write each word to one of N partition files chosen by `hash(word) % N`",
        "Count each partition separately with a `collections.Counter` (each one fits in memory)",
        "Keep each partition's top 10 with `heapq.nlargest(10, ...)`",
        "Merge the partitions' top-10 lists and take the overall top 10",
      ],
      explanation:
        "Hash partitioning sends every occurrence of a word to the same partition, so per-partition counts are exact and the global top 10 must appear among the partition winners. It's the single-machine version of map-reduce.",
    },
  ],

  cards: [
    { id: "c1-list", domain: "d1", kind: "service", term: "list", definition: "Mutable dynamic array. O(1) index and append, O(n) search and insert at the front." },
    { id: "c1-tuple", domain: "d1", kind: "service", term: "tuple", definition: "Immutable sequence. Hashable if its items are, so it can be a dict key." },
    { id: "c1-dict", domain: "d1", kind: "service", term: "dict", definition: "Hash map of hashable keys to values. O(1) average lookup, keeps insertion order." },
    { id: "c1-set", domain: "d1", kind: "service", term: "set", definition: "Unordered collection of unique hashable items. O(1) average membership tests." },
    { id: "c1-frozenset", domain: "d1", kind: "service", term: "frozenset", definition: "Immutable, hashable set. Can be a dict key or a member of another set." },
    { id: "c1-deque", domain: "d1", kind: "service", term: "collections.deque", definition: "Double-ended queue with O(1) appends and pops at both ends." },
    { id: "c1-counter", domain: "d1", kind: "service", term: "collections.Counter", definition: "Dict subclass that counts hashable items; has most_common()." },
    { id: "c1-heapq", domain: "d1", kind: "service", term: "heapq", definition: "Functions that keep a list as a min-heap: O(log n) push and pop." },
    { id: "c1-deepcopy", domain: "d1", kind: "service", term: "copy.deepcopy", definition: "Recursively copies an object and everything nested inside it." },
    { id: "c1-mutability", domain: "d1", kind: "concept", term: "Mutable vs immutable", definition: "Mutable objects (list, dict, set) can change in place; immutable ones (int, str, tuple) can't, so \"changes\" create new objects." },
    { id: "c1-aliasing", domain: "d1", kind: "concept", term: "Aliasing", definition: "Two names bound to the same object. Mutating through one is visible through the other." },
    { id: "c1-identity", domain: "d1", kind: "concept", term: "is vs ==", definition: "is tests identity (same object); == tests equality (same value via __eq__)." },
    { id: "c1-hashable", domain: "d1", kind: "concept", term: "Hashable", definition: "Has a hash that never changes during its lifetime and supports ==. Required for dict keys and set members." },
    { id: "c1-shallow", domain: "d1", kind: "concept", term: "Shallow copy", definition: "A new outer container whose items are the same objects as the original's." },
  ],

  challenges: [
    {
      id: "ch-py-deep",
      domain: "d1",
      lesson: "d1-copying",
      title: "Edit the nested list safely",
      goal: "Run b[2].append(9) while a still prints [1, 2, [3, 4]].",
      hint: "A shallow copy shares the nested list. You need a copy that goes all the way down.",
      takeaway: "Only copy.deepcopy duplicates nested objects. a.copy(), list(a), a[:] and b = b + [...] all share the inner list.",
      render: (onSolved) => <AliasLab goal="deep" onSolved={onSolved} />,
    },
    {
      id: "ch-py-outer",
      domain: "d1",
      lesson: "d1-mutability",
      title: "Append without touching a",
      goal: "Run b.append(5) so that a stays exactly [1, 2, [3, 4]].",
      hint: "b = a only adds a second name. Give b its own outer list first.",
      takeaway: "Assignment never copies. Any copy (even a shallow one) gives b its own outer list, so appending to it leaves a alone.",
      render: (onSolved) => <AliasLab goal="outer" onSolved={onSolved} />,
    },
  ],
});
