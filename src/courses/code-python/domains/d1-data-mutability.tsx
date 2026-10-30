import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
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
    summary:
      "How Python names point at objects, which objects can change, the difference between is and ==, how copying really works, and which collection to pick for the job.",
  },

  tasks: [
    {
      id: "1.1",
      title: "Names, objects, and mutability",
      covers: ["Names point at objects", "Mutable and immutable built-in types", "Identity (is) and equality (==)", "Tuples that hold mutable items"],
    },
    {
      id: "1.2",
      title: "Copying",
      covers: ["Aliasing with plain assignment", "Shallow copies: copy.copy, list(x), x[:], .copy()", "Deep copies with copy.deepcopy", "The [[0] * n] * n grid trap"],
    },
    {
      id: "1.3",
      title: "Built-in collections and their costs",
      covers: ["list, tuple, dict, set, deque, heapq", "Average-case cost of common operations", "Hashability and dict ordering"],
    },
    {
      id: "1.4",
      title: "Sequences and slicing",
      covers: ["Positive and negative indexes", "How start:stop:step works and why it never overruns", "Slice assignment"],
    },
  ],

  lessons: [
    {
      id: "d1-start-first-line",
      level: "beginner",
      task: "1.1",
      title: "What Python is and your first line",
      check: ["py-b1-01", "py-b1-02"],
      visual: (
        <Flow
          steps={[
            { icon: "✍️", label: "You write", sub: "Plain text instructions in a file, like hello.py" },
            { icon: "🐍", label: "Python reads", sub: "It runs your lines one by one, top to bottom" },
            { icon: "🖥️", label: "You see", sub: "Whatever you print shows up on the screen" },
          ]}
        />
      ),
      points: [
        "**Python** is a programming language. You write instructions as plain text, and the Python program carries them out, one line at a time, from top to bottom.",
        "Think of it like a recipe. Python is the cook who follows each step exactly as written, in order.",
        "`print(...)` shows a value on the screen. For example, `print(\"Hello\")` shows Hello.",
        "To run a file called `hello.py`, type `python3 hello.py` in a terminal. You can also type `python3` on its own to try lines one at a time.",
      ],
      tip: "Text inside quotes is called a **string**. The quotes tell Python \"this is text, not an instruction\", and they don't appear when you print it.",
    },
    {
      id: "d1-start-names",
      level: "beginner",
      task: "1.1",
      title: "Variables are name tags",
      check: ["py-b1-03", "py-b1-04"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="python"
            code={py`
              name = "Sam"     # a string (text)
              age = 30         # an int (whole number)
              height = 1.75    # a float (decimal number)
              is_member = True # a bool (True or False)
              print(name, age) # Sam 30
            `}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🔢", title: "int", text: "Whole numbers like 3 or -10" },
              { icon: "📏", title: "float", text: "Decimal numbers like 1.75" },
              { icon: "🔤", title: "str", text: "Text in quotes, like \"Sam\"" },
              { icon: "✅", title: "bool", text: "Just True or False" },
            ]}
          />
        </div>
      ),
      points: [
        "A **variable** is a name you stick on a value so you can use it later. `age = 30` puts the name `age` on the number 30.",
        "The `=` sign here doesn't mean \"equals\" like in maths. It means \"make this name point at this value\".",
        "You can move a name to a new value at any time. After `age = 31`, the name `age` points at 31 instead.",
        "Every value has a **type**. The common ones are `int` (whole numbers), `float` (decimals), `str` (text) and `bool` (True or False).",
      ],
      tip: "Not sure what type something is? `type(value)` tells you. For example, `type(3.5)` gives `<class 'float'>`.",
    },
    {
      id: "d1-start-lists",
      level: "beginner",
      task: "1.4",
      title: "Lists hold many values",
      check: ["py-b1-05", "py-b1-06"],
      visual: (
        <CodeBlock
          lang="python"
          code={py`
            fruits = ["apple", "banana", "cherry"]
            print(fruits[0])    # apple   (the first item)
            print(fruits[-1])   # cherry  (the last item)
            print(len(fruits))  # 3       (how many items)
            fruits.append("kiwi")
            print(fruits)       # ['apple', 'banana', 'cherry', 'kiwi']
          `}
        />
      ),
      points: [
        "A **list** holds several values in order, like a numbered shopping list. You write it with square brackets: `[\"apple\", \"banana\"]`.",
        "Each item has a position called an **index**. Counting starts at 0, so `fruits[0]` is the first item and `fruits[1]` is the second.",
        "Negative indexes count from the end. `fruits[-1]` is the last item, which saves you working out the length.",
        "`len(fruits)` tells you how many items there are, and `fruits.append(\"kiwi\")` adds one to the end.",
      ],
      tip: "Starting at 0 feels odd at first. It helps to read the index as \"how many steps from the start\": the first item is zero steps in.",
    },
    {
      id: "d1-mutability",
      level: "junior",
      task: "1.1",
      title: "Names are labels, not boxes",
      check: ["d1-01", "d1-04"],
      visual: <AliasLab />,
      points: [
        "Assignment never copies anything. `b = a` just gives the same object a second name, so `a` and `b` now point at one list.",
        "Some types are **mutable**, meaning you can change them in place: list, dict, set and most classes you write.",
        "Others are **immutable** and can't change: int, float, str, tuple, frozenset and bytes.",
        "When you \"change\" an immutable value, like `s += \"!\"`, Python builds a brand new object and moves the name to it. The old object stays as it was.",
        "`==` asks \"do these have equal values?\" (it calls `__eq__`). `is` asks \"are these the very same object?\". Use `is` for `None` and other one-of-a-kind values.",
        "A tuple can't change which items it holds, but if one of those items is a list, that list can still change.",
      ],
      tip: "For \"what does this print?\" questions, draw each name as an arrow pointing at an object. Changing an object affects every arrow pointing at it. Assigning just moves one arrow.",
    },
    {
      id: "d1-copying",
      level: "intermediate",
      task: "1.2",
      title: "Shallow and deep copies",
      check: ["d1-08", "d1-10"],
      visual: (
        <div className="grid gap-4">
          <CodeCompare
            lang="python"
            left={{
              title: "Shallow: the inner lists are shared",
              code: py`
                a = [[1, 2], [3]]
                b = a.copy()        # or list(a), a[:]
                b[0].append(99)
                print(a)  # [[1, 2, 99], [3]]
              `,
            }}
            right={{
              title: "Deep: nothing is shared",
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
            left={{ title: "Trap: one row used three times", code: py`
              grid = [[0] * 3] * 3
              grid[0][0] = "X"
              # [['X', 0, 0], ['X', 0, 0], ['X', 0, 0]]
            ` }}
            right={{ title: "Fix: build a new row each time", code: py`
              grid = [[0] * 3 for _ in range(3)]
              grid[0][0] = "X"
              # [['X', 0, 0], [0, 0, 0], [0, 0, 0]]
            ` }}
          />
        </div>
      ),
      points: [
        "A **shallow copy** gives you a new outer container, but the items inside are the same objects as in the original.",
        "So if the items are lists, changing one of those inner lists shows up in both the copy and the original.",
        "`copy.deepcopy` copies everything, all the way down through nested containers. It even copes with objects that refer back to themselves.",
        "`[x] * n` repeats a reference to the same `x`, n times. That's fine when `x` is a number, but a trap when `x` is a list.",
      ],
      tip: "Interviewers love the grid trap. Explain that `*` repeats references, so every row is really the same list, then offer the list comprehension fix.",
    },
    {
      id: "d1-collections",
      level: "intermediate",
      task: "1.3",
      title: "Pick the right collection",
      check: ["d1-12", "d1-15"],
      visual: <ComplexityExplorer />,
      points: [
        "Checking `x in items` on a list or tuple looks at every item, so it's O(n). On a set or dict it's O(1) on average, because it jumps straight to the right spot using a hash.",
        "Lists are fast at the end and slow at the front, because adding at the front shifts everything along. For a queue, use `collections.deque`.",
        "Dict keys and set items must be **hashable**. Immutable built-ins like ints, strings and tuples of them work. Lists and dicts don't.",
        "Dicts remember the order you inserted keys. Updating a key that's already there keeps it in its original position.",
      ],
      tip: "Before you optimise, name the operation that happens most (a lookup, adding at the front, finding the smallest). Then choose the structure that makes that operation O(1) or O(log n).",
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
        "In `s[start:stop:step]`, the start is included and the stop is not. So `s[1:4]` gives you positions 1, 2 and 3.",
        "Leave a bound out and it runs to the end. With a negative step, the defaults flip to the far ends instead.",
        "Slice bounds that run past the end are quietly trimmed, so slicing never raises `IndexError`. Plain indexing like `s[10]` does.",
        "Slicing a list gives you a new list (a shallow copy). Slicing a string gives you a new string.",
        "`-0` is just `0`. That means `items[-n:]` returns the whole list when `n` is 0, not an empty one.",
      ],
      tip: "If you're asked to reverse a string, `s[::-1]` is the one-liner they expect. Mention that it builds a new copy, so it costs O(n) time and memory.",
    },
  ],

  questions: [
    // ───────────── Start here ─────────────
    {
      id: "py-b1-01",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-first-line",
      type: "output",
      prompt: "What does this program show on the screen?",
      code: py`
        print("Hello, world!")
      `,
      codeLang: "python",
      answers: ["Hello, world!"],
      explanation:
        "`print` shows whatever you put inside the brackets. The quotes mark the text as a string, but they aren't part of the text, so they don't appear in the output.",
    },
    {
      id: "py-b1-02",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-first-line",
      prompt: "In what order does Python run the lines in a simple script?",
      options: [
        "From the top line to the bottom line, one at a time",
        "From the bottom line to the top line",
        "All lines at the same moment",
        "In alphabetical order",
      ],
      answer: [0],
      explanation:
        "Python works through a script like a recipe, starting at the first line and carrying on down. Later you'll meet loops and functions that let you repeat or jump, but the starting rule is always top to bottom.",
    },
    {
      id: "py-b1-03",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-names",
      type: "output",
      prompt: "What does this print?",
      code: py`
        x = 5
        x = x + 2
        print(x)
      `,
      codeLang: "python",
      answers: ["7"],
      explanation:
        "The first line puts the name `x` on 5. The second line works out `x + 2`, which is 7, and moves the name `x` to that new value. So by the time we print, `x` is 7.",
    },
    {
      id: "py-b1-04",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-names",
      prompt: "Which of these values is a string (`str`)?",
      options: ["`\"42\"`", "`42`", "`4.2`", "`True`"],
      answer: [0],
      explanation:
        "Quotes make a string, even when the text inside looks like a number. `42` is an int, `4.2` is a float, and `True` is a bool. That's why `\"3\" + \"4\"` gives `\"34\"` but `3 + 4` gives `7`.",
    },
    {
      id: "py-b1-05",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-lists",
      type: "output",
      prompt: "What does this print?",
      code: py`
        fruits = ["apple", "banana", "cherry"]
        print(fruits[0])
      `,
      codeLang: "python",
      answers: ["apple"],
      explanation:
        "List positions start counting at 0, so `fruits[0]` is the first item, `\"apple\"`. If you wanted `\"banana\"`, you'd write `fruits[1]`.",
    },
    {
      id: "py-b1-06",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-lists",
      type: "fill",
      prompt: "Fill the gap so `\"kiwi\"` is added to the end of the list.",
      code: py`
        fruits = ["apple", "banana"]
        fruits.{{1}}("kiwi")
        print(fruits)  # ['apple', 'banana', 'kiwi']
      `,
      codeLang: "python",
      blanks: [{ options: ["append", "add", "push", "insert"], answer: 0 }],
      explanation:
        "Lists use `append` to add one item to the end. `add` belongs to sets and `push` comes from other languages. `insert` is a real list method, but it needs a position as well, like `insert(0, \"kiwi\")`.",
    },
    // ───────────── Interview questions ─────────────
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
      explanation:
        "`b = a` doesn't copy the list. It gives the same list a second name. When you append through `b`, you're changing that one shared list, so `a` shows the change too.",
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
      explanation:
        "Strings can't be changed in place. `y += \"!\"` builds a new string and moves `y` to it. `x` still points at the original `\"hi\"`.",
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
      explanation:
        "A tuple can't swap out the objects it holds, but the list inside it is still a normal, changeable list. `append` changes that list without assigning anything to the tuple, so it works.",
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
        "`t[1] += [3]` happens in two steps. First the list's own `__iadd__` runs and extends the list in place. Then Python tries `t[1] = result`, which fails because tuples don't allow item assignment. By then the list has already changed, so you get both the error and the longer list.",
    },
    {
      id: "d1-05",
      domain: "d1",
      level: "junior",
      lesson: "d1-mutability",
      prompt: "Which statement about `is` and `==` is correct?",
      options: [
        "`==` compares values (using `__eq__`), while `is` checks whether both sides are the very same object",
        "`is` is a faster `==` and gives the same answer for every type",
        "`==` compares memory addresses, while `is` compares values",
        "`is` is the right way to compare strings and numbers",
      ],
      answer: [0],
      explanation:
        "`is` checks identity: are these one and the same object? Two equal lists are usually two different objects. Whether equal small numbers or strings happen to share an object is a CPython detail, so never use `is` to compare values.",
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
      explanation:
        "Each `[1, 2]` builds its own list object. The contents match, so `==` is True. They're still two separate objects, so `is` is False.",
    },
    {
      id: "d1-07",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-mutability",
      prompt: "When is `is` the right operator? (Choose two.)",
      options: [
        "Checking whether a value is `None`",
        "Checking whether two names point at the very same object",
        "Checking whether two strings contain the same text",
        "Checking whether two integers are equal",
        "Checking whether two lists have the same contents",
      ],
      answer: [0, 1],
      explanation:
        "There's only ever one `None` object, so PEP 8 (Python's style guide) recommends `x is None`. `is` is also right when you really do want to know if two names share one object. For comparing values, always use `==`.",
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
        "A shallow copy is a new outer list that holds the same inner lists. `b[0].append(9)` changes an inner list both of them share, so `a` sees it. `b.append([3])` only changes `b`'s own outer list, so `a` doesn't get the `[3]`.",
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
      explanation:
        "`deepcopy` copies the dict and also the list inside it. The two dicts end up sharing nothing that can change, so adding to `b`'s list leaves `a` alone.",
    },
    {
      id: "d1-10",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-copying",
      type: "lines",
      prompt: "This prints `[['X', 0, 0], ['X', 0, 0], ['X', 0, 0]]`. Tap the line that makes every row change.",
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
        "`[row] * n` builds a list that holds the same `row` object n times, so changing one row changes them all. Build a fresh row each time instead: `board = [[0] * n for _ in range(n)]`. Line 2 is fine, because ints can't be changed in place.",
    },
    {
      id: "d1-11",
      domain: "d1",
      level: "junior",
      lesson: "d1-copying",
      prompt: "Which expressions make a shallow copy of the list `a`? (Choose three.)",
      options: ["`a[:]`", "`list(a)`", "`a.copy()`", "`b = a`", "`copy.deepcopy(a)`"],
      answer: [0, 1, 2],
      explanation:
        "Slicing, calling `list()` and calling `.copy()` each build a new outer list. `b = a` is just a second name for the same list, and `deepcopy` makes a deep copy, not a shallow one.",
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
        "O(1) per check; it's already as fast as it can be",
        "O(log n) per check; sort the list first",
        "O(n) per check; convert it to a tuple",
      ],
      answer: [0],
      explanation:
        "`in` on a list checks items one by one until it finds a match. A set is a hash table, so it can jump straight to the answer, which is O(1) on average. Building the set costs O(n), but you only do it once.",
    },
    {
      id: "d1-13",
      domain: "d1",
      level: "senior",
      lesson: "d1-collections",
      type: "match",
      prompt: "Match each operation to its typical time cost.",
      pairs: [
        ["`lst.append(x)`", "O(1) amortized"],
        ["`lst.insert(0, x)`", "O(n)"],
        ["`d[key]` on a dict", "O(1) average"],
        ["`sorted(lst)`", "O(n log n)"],
      ],
      explanation:
        "Appending to a list is O(1) amortized, meaning it's cheap on average even though the list sometimes has to grow. Inserting at the front shifts every item along. A dict lookup hashes the key to find it. Python's sort is Timsort, which is O(n log n).",
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
      explanation:
        "Dict keys must be hashable. A tuple of ints is hashable. A list can change, so it isn't hashable, and line 3 raises `TypeError: unhashable type: 'list'`.",
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
      explanation:
        "Dicts keep keys in the order you first added them, and that's guaranteed since Python 3.7. Setting `d[\"b\"]` again changes its value but doesn't move it.",
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
      explanation:
        "`&` gives the items in both sets (the intersection). `-` gives the items in `a` that aren't in `b` (the difference). For completeness, `|` is the union and `^` gives items in exactly one of the two.",
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
      explanation:
        "`s[1:4]` takes positions 1, 2 and 3, because the stop isn't included. `s[-2:]` is the last two characters. A step of -1 walks backwards over the whole string, which reverses it.",
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
      explanation:
        "A step of 2 takes every other item, starting from the first. A slice that starts past the end is trimmed to nothing, so you get `[]` rather than an error. Index `-1` is the last item.",
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
      explanation:
        "Assigning to a slice swaps that whole slice (the items at positions 1 and 2) for the items on the right. The right side has one item, so the list gets shorter. Slice assignment can shrink or grow a list.",
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
      explanation:
        "When `n` is 0, `-n` is also 0, so `items[-0:]` is the same as `items[0:]`: the whole list. A safe version is `return items[len(items) - n:]`, or you can handle `n == 0` on its own.",
    },
    {
      id: "d1-21",
      domain: "d1",
      level: "junior",
      lesson: "d1-copying",
      type: "order",
      prompt: "Put the lines in order so the program prints `[1, 2] [1, 2, 3]`.",
      items: ["`a = [1, 2]`", "`b = a.copy()`", "`b.append(3)`", "`print(a, b)`"],
      explanation:
        "Make the copy first, then change the copy. If `b` were just another name for `a` (`b = a`), both would print `[1, 2, 3]`.",
    },
    {
      id: "d1-22",
      domain: "d1",
      level: "staff",
      lesson: "d1-collections",
      prompt: "A service keeps 50 million user records in memory as a dict of small dicts (`{user_id: {\"name\": ..., \"plan\": ...}}`). Memory is now the bottleneck. Which change usually saves the most memory while keeping fast lookup by ID?",
      options: [
        "Store each record as an instance of a class with `__slots__` (or `@dataclass(slots=True)`) instead of a small dict per record",
        "Replace the outer dict with a list and scan it for each lookup",
        "Call `copy.deepcopy` on each record when it's read",
        "Convert every user ID key to a string",
      ],
      answer: [0],
      explanation:
        "Every small dict carries its own hash table, which adds up across 50 million records. Instances with `__slots__` store their fields in a fixed layout with no `__dict__` each. At even larger scale, column-based storage (arrays, NumPy) or an external store saves more. Scanning a list would make each lookup O(n).",
    },
    {
      id: "d1-23",
      domain: "d1",
      level: "staff",
      lesson: "d1-mutability",
      prompt: "A shared library returns its module-level `DEFAULT_CONFIG` dict to callers. A bug report shows one request's tweaks leaking into later requests. What's the safest fix at the point where the library hands the dict out?",
      options: [
        "Return a fresh copy (or a read-only `types.MappingProxyType` view with immutable values) so callers can't change the shared object",
        "Document that callers must not change the returned dict",
        "Add `global DEFAULT_CONFIG` to every function that reads it",
        "Compare configs with `is` instead of `==`",
      ],
      answer: [0],
      explanation:
        "The leak comes from aliasing: every caller gets the same changeable object. Hand out copies or a read-only view instead. `MappingProxyType` only protects the top level, so nested values should be immutable too (tuples, frozen dataclasses) or deep-copied.",
    },
    {
      id: "d1-24",
      domain: "d1",
      level: "staff",
      lesson: "d1-copying",
      prompt: "A PR adds `copy.deepcopy(request_state)` on every request in a hot path \"to be safe\". Which review concerns are valid? (Choose two.)",
      options: [
        "`deepcopy` walks the whole object graph, so it costs more the bigger the state is, on every request",
        "Objects holding locks, sockets, or open files may fail to copy (or copy into something that doesn't work)",
        "`deepcopy` only makes a shallow copy of dicts",
        "`deepcopy` isn't in the standard library",
        "`deepcopy` crashes on objects with reference cycles",
      ],
      answer: [0, 1],
      explanation:
        "`deepcopy` gives the right result but it's expensive, and some resources can't be copied at all: copying a `threading.Lock` raises `TypeError`. It does handle cycles, using a memo dict to track what it has already copied. A better plan is immutable state, or copying only the parts you change.",
    },
    {
      id: "d1-25",
      domain: "d1",
      level: "staff",
      lesson: "d1-collections",
      type: "order",
      prompt: "You need the 10 most frequent words in a 50 GB log on an 8 GB machine, where even the word counts may not fit in memory. Put the steps in order.",
      items: [
        "Stream the file once and write each word to one of N partition files chosen by `hash(word) % N`",
        "Count each partition separately with a `collections.Counter` (each one fits in memory)",
        "Keep each partition's top 10 with `heapq.nlargest(10, ...)`",
        "Merge the partitions' top-10 lists and take the overall top 10",
      ],
      explanation:
        "Splitting by hash sends every copy of a word to the same partition, so each partition's counts are exact. That means the overall top 10 must be somewhere among the partition winners. It's map-reduce, done on a single machine.",
    },
  ],

  cards: [
    { id: "c1-list", domain: "d1", kind: "service", term: "list", definition: "An ordered, changeable sequence. Reading by index and appending are O(1). Searching and inserting at the front are O(n)." },
    { id: "c1-tuple", domain: "d1", kind: "service", term: "tuple", definition: "An ordered sequence that can't be changed. If its items are hashable, the tuple is too, so it can be a dict key." },
    { id: "c1-dict", domain: "d1", kind: "service", term: "dict", definition: "Maps hashable keys to values, like a phone book. Lookups are O(1) on average, and it remembers the order keys were added." },
    { id: "c1-set", domain: "d1", kind: "service", term: "set", definition: "A collection of unique hashable items with no order. Checking whether something is in it is O(1) on average." },
    { id: "c1-frozenset", domain: "d1", kind: "service", term: "frozenset", definition: "A set that can't be changed. Because it's hashable, it can be a dict key or sit inside another set." },
    { id: "c1-deque", domain: "d1", kind: "service", term: "collections.deque", definition: "A double-ended queue. Adding or removing at either end is O(1), which makes it the right tool for queues." },
    { id: "c1-counter", domain: "d1", kind: "service", term: "collections.Counter", definition: "A dict that counts things for you. Pass it a list and it tallies each item, and most_common() gives you the top ones." },
    { id: "c1-heapq", domain: "d1", kind: "service", term: "heapq", definition: "Functions that keep a plain list arranged as a min-heap, so the smallest item is always first. Push and pop are O(log n)." },
    { id: "c1-deepcopy", domain: "d1", kind: "service", term: "copy.deepcopy", definition: "Copies an object and everything nested inside it, so the copy shares nothing changeable with the original." },
    { id: "c1-mutability", domain: "d1", kind: "concept", term: "Mutable and immutable", definition: "Mutable objects (list, dict, set) can change in place. Immutable ones (int, str, tuple) can't, so any \"change\" actually creates a new object." },
    { id: "c1-aliasing", domain: "d1", kind: "concept", term: "Aliasing", definition: "Two names pointing at the same object. Change the object through one name and you'll see the change through the other." },
    { id: "c1-identity", domain: "d1", kind: "concept", term: "is and ==", definition: "is checks identity: are these the same object? == checks equality: do they have the same value, according to __eq__?" },
    { id: "c1-hashable", domain: "d1", kind: "concept", term: "Hashable", definition: "Has a hash value that never changes while it exists, and supports ==. Dict keys and set items must be hashable." },
    { id: "c1-shallow", domain: "d1", kind: "concept", term: "Shallow copy", definition: "A new outer container whose items are the very same objects as in the original. Nested lists are shared, not copied." },
  ],

  challenges: [
    {
      id: "ch-py-deep",
      domain: "d1",
      lesson: "d1-copying",
      title: "Edit the nested list safely",
      goal: "Run b[2].append(9) while a still prints [1, 2, [3, 4]].",
      hint: "A shallow copy still shares the nested list. You need a copy that goes all the way down.",
      takeaway: "Only copy.deepcopy duplicates nested objects. a.copy(), list(a), a[:] and b = b + [...] all still share the inner list.",
      render: (onSolved) => <AliasLab goal="deep" onSolved={onSolved} />,
    },
    {
      id: "ch-py-outer",
      domain: "d1",
      lesson: "d1-mutability",
      title: "Append without touching a",
      goal: "Run b.append(5) so that a stays exactly [1, 2, [3, 4]].",
      hint: "b = a only adds a second name. Give b its own outer list first.",
      takeaway: "Assignment never copies. Any copy, even a shallow one, gives b its own outer list, so appending to it leaves a alone.",
      render: (onSolved) => <AliasLab goal="outer" onSolved={onSolved} />,
    },
  ],
});
