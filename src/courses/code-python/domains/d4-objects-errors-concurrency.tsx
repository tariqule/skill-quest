import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { py } from "../py";
import { ExceptionPaths, MroDiamond } from "../visuals";

/** Module 4: classes and dunder methods, inheritance and MRO, dataclasses, exceptions, context managers, and concurrency. */
export default defineDomain({
  domain: {
    id: "d4",
    number: 4,
    name: "Objects, Errors & Concurrency",
    world: "The Dunder Dungeon",
    weight: 30,
    emoji: "🏰",
    color: "#a78bfa",
    summary:
      "Classes and their special double-underscore methods, inheritance and the MRO, dataclasses, exceptions and with blocks, and how the GIL shapes threads, processes and asyncio.",
  },

  tasks: [
    { id: "4.1", title: "Classes and the data model", covers: ["Class attributes and instance attributes", "self, @classmethod, @staticmethod, @property", "Dunder methods: __repr__, __str__, __eq__, __hash__, __len__ and friends"] },
    { id: "4.2", title: "Inheritance, MRO, and dataclasses", covers: ["super() and cooperative inheritance", "C3 linearization and __mro__", "@dataclass and field(default_factory=…)"] },
    { id: "4.3", title: "Exceptions and context managers", covers: ["The order of try, except, else and finally", "Handler order and catching specific exceptions", "raise … from", "with, __enter__ and __exit__, contextlib"] },
    { id: "4.4", title: "The GIL and concurrency", covers: ["What the GIL does and doesn't protect", "Choosing between threading, multiprocessing and asyncio", "Blocking calls inside async code"] },
  ],

  lessons: [
    {
      id: "d4-start-classes",
      level: "beginner",
      task: "4.1",
      title: "Classes are blueprints",
      check: ["py-b4-01", "py-b4-02"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="python"
            code={py`
              class Dog:                         # the blueprint
                  def __init__(self, name):      # runs when you make a dog
                      self.name = name           # each dog keeps its own name

              rex = Dog("Rex")                   # one object
              fido = Dog("Fido")                 # another object
              print(rex.name, fido.name)         # Rex Fido
            `}
          />
          <Tiles
            tiles={[
              { icon: "📐", title: "Class", text: "The blueprint. It says what every dog has and can do.", color: "#a78bfa" },
              { icon: "🐕", title: "Object", text: "One real dog built from the blueprint, with its own name.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "A **class** is a blueprint for making things. An **object** (also called an instance) is one thing built from that blueprint.",
        "Think of a cookie cutter and cookies. The cutter is the class. Each cookie is an object, and you can make as many as you like.",
        "`__init__` is a special method that runs every time you create an object. You use it to give the new object its starting values.",
        "`self` means \"this particular object\". Writing `self.name = name` stores the name on the object being built.",
      ],
      tip: "You make an object by calling the class like a function: `Dog(\"Rex\")`. Python creates the object, runs `__init__` on it, and hands it back.",
    },
    {
      id: "d4-start-methods",
      level: "beginner",
      task: "4.1",
      title: "Methods give objects behaviour",
      check: ["py-b4-03", "py-b4-04"],
      visual: (
        <CodeBlock
          lang="python"
          code={py`
            class Counter:
                def __init__(self):
                    self.count = 0      # data the object keeps

                def add(self):          # something the object can do
                    self.count += 1

            c = Counter()
            c.add()
            c.add()
            print(c.count)              # 2
          `}
        />
      ),
      points: [
        "A **method** is a function that lives inside a class. It describes something every object of that class can do.",
        "Every method's first parameter is `self`, so the method can read and change that object's own data.",
        "You call a method with a dot: `c.add()`. Python passes `c` in as `self` for you, so you don't write it in the brackets.",
        "Each object keeps its own values. Two `Counter` objects count separately, like two people each holding a tally clicker.",
      ],
      tip: "The values an object stores, like `self.count`, are called **attributes**. You read them with a dot too, as in `c.count`.",
    },
    {
      id: "d4-start-errors",
      level: "beginner",
      task: "4.3",
      title: "When things go wrong: exceptions",
      check: ["py-b4-05", "py-b4-06"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "▶️", label: "try", sub: "Python runs the risky line" },
              { icon: "💥", label: "Something fails", sub: "For example, int(\"abc\")" },
              { icon: "🛟", label: "except", sub: "Your backup plan runs instead of a crash" },
            ]}
          />
          <CodeBlock
            lang="python"
            code={py`
              try:
                  n = int("abc")
              except ValueError:
                  print("Not a number")   # this runs instead of crashing
            `}
          />
        </div>
      ),
      points: [
        "When Python hits a problem it can't handle, it raises an **exception**, a signal that something went wrong. If nothing deals with it, the program stops.",
        "The message it prints is called a **traceback**. Read it from the bottom: the last line names the error, like `ValueError`, and says what happened.",
        "`try:` lets you run code that might fail. If it does, Python jumps to the matching `except` block instead of crashing.",
        "Name the error you expect, as in `except ValueError:`, so other surprises still show up and get fixed.",
      ],
      tip: "Common ones you'll meet early: `NameError` (a name that doesn't exist), `TypeError` (the wrong kind of value), `ValueError` (the right kind, but a bad value) and `IndexError` (a position past the end of a list).",
    },
    {
      id: "d4-classes",
      level: "intermediate",
      task: "4.1",
      title: "Classes and dunder methods",
      check: ["d4-01", "d4-03"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="python"
            code={py`
              class Vec:
                  dims = 2                      # class attribute: shared
                  def __init__(self, x, y):
                      self.x, self.y = x, y     # instance attributes
                  def __repr__(self):           # repr(), lists, debugger
                      return f"Vec({self.x}, {self.y})"
                  def __add__(self, other):     # v + w
                      return Vec(self.x + other.x, self.y + other.y)
                  def __eq__(self, other):      # v == w
                      return (self.x, self.y) == (other.x, other.y)
                  __hash__ = None               # what defining __eq__ does implicitly
            `}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "📏", title: "__len__", text: "Called by len(obj)", color: "#a78bfa" },
              { icon: "🔎", title: "__getitem__", text: "Called by obj[key]", color: "#a78bfa" },
              { icon: "📞", title: "__call__", text: "Called by obj()", color: "#a78bfa" },
              { icon: "🧺", title: "__contains__", text: "Called by x in obj", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Attributes written in the class body are shared by every instance. Anything each object should keep for itself belongs on `self` inside `__init__`.",
        "**Dunder methods** (short for double underscore) are hooks that let your class work with built-in syntax like `len()`, `+` and `in`.",
        "`__str__` is the friendly version shown by `print`. `__repr__` is the developer version, and lists show their items using `__repr__`.",
        "If you define `__eq__` but not `__hash__`, Python sets `__hash__` to `None`, so your objects can't go in a set or be dict keys.",
        "`@classmethod` gets the class as `cls`. `@staticmethod` gets nothing extra. `@property` lets a method be read like a plain attribute.",
      ],
      tip: "If you're asked to make a class work with `len`, `in`, `for` or `+`, name the dunder method each one calls.",
    },
    {
      id: "d4-inheritance",
      level: "senior",
      task: "4.2",
      title: "Inheritance, MRO, and dataclasses",
      check: ["d4-07", "d4-10"],
      visual: (
        <div className="grid gap-6">
          <MroDiamond />
          <CodeBlock
            lang="python"
            code={py`
              from dataclasses import dataclass, field

              @dataclass(frozen=True)          # frozen: immutable and hashable
              class Point:
                  x: int
                  y: int = 0

              @dataclass
              class Cart:
                  items: list[str] = field(default_factory=list)  # not = []
            `}
          />
        </div>
      ),
      points: [
        "`super()` calls the next class in the object's **MRO** (method resolution order). That isn't always the parent you see in the class line.",
        "The MRO lists child classes before their parents and keeps bases in left-to-right order. You can see it with `Cls.__mro__`.",
        "`@dataclass` writes `__init__`, `__repr__` and `__eq__` for you from the fields you annotate. `order=True` adds comparisons and `frozen=True` makes instances unchangeable.",
        "A mutable default like `[]` in a dataclass raises `ValueError`. Use `field(default_factory=list)` so each instance gets its own list.",
      ],
      tip: "Say that you prefer composition over deep inheritance. For \"a class that just holds data\", a dataclass is the expected Python answer.",
    },
    {
      id: "d4-errors",
      level: "intermediate",
      task: "4.3",
      title: "Exceptions and context managers",
      check: ["d4-13", "d4-16"],
      visual: (
        <div className="grid gap-6">
          <ExceptionPaths />
          <CodeCompare
            lang="python"
            left={{
              title: "Written as a class",
              code: py`
                class Timer:
                    def __enter__(self):
                        self.start = time.perf_counter()
                        return self
                    def __exit__(self, exc_type, exc, tb):
                        print(time.perf_counter() - self.start)
                        return False   # don't swallow errors
              `,
            }}
            right={{
              title: "Written as a generator",
              code: py`
                from contextlib import contextmanager

                @contextmanager
                def timer():
                    start = time.perf_counter()
                    try:
                        yield
                    finally:
                        print(time.perf_counter() - start)
              `,
            }}
          />
        </div>
      ),
      points: [
        "`else` runs only if the `try` block finished without raising, returning or breaking. `finally` always runs.",
        "`except` clauses are checked from top to bottom, so put specific exceptions before general ones.",
        "`raise NewError(...) from err` keeps the original error attached, so the traceback shows both.",
        "A **context manager** is what `with` uses. `with` calls `__enter__` (its return value goes to the name after `as`) and always calls `__exit__` at the end.",
        "If `__exit__` returns `True`, the exception is swallowed. Returning `False` lets it carry on.",
      ],
      tip: "Python prefers EAFP, \"easier to ask forgiveness than permission\": try the thing and catch the error, rather than checking first. Mention it when you wrap a dict lookup in try/except.",
    },
    {
      id: "d4-concurrency",
      level: "senior",
      task: "4.4",
      title: "The GIL: threads, processes, asyncio",
      check: ["d4-19", "d4-22"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧵", title: "threading", text: "Operating system threads that share memory. Good for blocking I/O. With the GIL, only one thread runs Python bytecode at a time.", color: "#38bdf8" },
              { icon: "🏭", title: "multiprocessing", text: "Separate processes, each with its own interpreter and GIL. Real parallel work for CPU-heavy jobs, but data has to be pickled to move between them.", color: "#f59e0b" },
              { icon: "⚡", title: "asyncio", text: "One thread running an event loop that switches between tasks while they wait. Great for thousands of network calls at once. Never block the loop.", color: "#34d399" },
            ]}
          />
          <CodeCompare
            lang="python"
            left={{
              title: "Blocks the loop: about 3 s",
              code: py`
                async def fetch(n):
                    time.sleep(1)
                    return n
              `,
            }}
            right={{
              title: "Lets the loop move on: about 1 s",
              code: py`
                async def fetch(n):
                    await asyncio.sleep(1)
                    return n
              `,
            }}
          />
        </div>
      ),
      points: [
        "The **GIL** (Global Interpreter Lock) in standard CPython lets only one thread run Python bytecode at a time in each process.",
        "Threads still help with I/O, because a thread that's waiting on the network or disk lets go of the GIL while it waits.",
        "The GIL doesn't make your code thread-safe. `counter += 1` is several steps, and two threads can interleave and lose an update. Use `threading.Lock` or a queue.",
        "`concurrent.futures` gives you one API for both: `ThreadPoolExecutor` and `ProcessPoolExecutor`.",
        "Recent CPython versions also offer an optional free-threaded build without the GIL. The standard build still has it.",
      ],
      tip: "Answer \"threads or processes?\" by first sorting the work. Is it waiting on I/O, or busy using the CPU? Then pick the tool.",
    },
  ],

  questions: [
    // ───────────── Start here ─────────────
    {
      id: "py-b4-01",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-classes",
      type: "output",
      prompt: "What does this print?",
      code: py`
        class Dog:
            def __init__(self, name):
                self.name = name

        d = Dog("Rex")
        print(d.name)
      `,
      codeLang: "python",
      answers: ["Rex"],
      explanation:
        "`Dog(\"Rex\")` builds a new dog and runs `__init__` with `name` set to `\"Rex\"`. That line stores it as `self.name`, so `d.name` reads it back.",
    },
    {
      id: "py-b4-02",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-classes",
      prompt: "Inside a method, what does `self` refer to?",
      options: [
        "The particular object the method is working on",
        "The class itself, shared by every object",
        "The file the class is written in",
        "The value the method will return",
      ],
      answer: [0],
      explanation:
        "`self` is the one object you're dealing with right now. When you call `rex.speak()`, `self` is `rex`. That's how each object keeps and reads its own data.",
    },
    {
      id: "py-b4-03",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-methods",
      type: "output",
      prompt: "What does this print?",
      code: py`
        class Counter:
            def __init__(self):
                self.count = 0

            def add(self):
                self.count += 1

        c = Counter()
        c.add()
        c.add()
        print(c.count)
      `,
      codeLang: "python",
      answers: ["2"],
      explanation:
        "The counter starts at 0 in `__init__`. Each call to `c.add()` adds one to that same object's `count`. Two calls means it ends at 2.",
    },
    {
      id: "py-b4-04",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-methods",
      prompt: "Which line correctly calls the `add` method on the object `c`?",
      options: ["`c.add()`", "`add(c)()`", "`Counter.add`", "`c->add()`"],
      answer: [0],
      explanation:
        "You call a method with a dot and brackets: `c.add()`. Python passes `c` in as `self` for you. `Counter.add` without brackets only names the method and doesn't run it, and `->` isn't Python syntax for this.",
    },
    {
      id: "py-b4-05",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-errors",
      prompt: "What happens when Python runs `int(\"hello\")` with no `try` around it?",
      options: [
        "It raises a `ValueError` and the program stops with a traceback",
        "It returns `0`",
        "It returns `None`",
        "It quietly skips the bad line and carries on with the next line of input",
      ],
      answer: [0],
      explanation:
        "`int` can only turn text that looks like a whole number into an int. `\"hello\"` doesn't, so Python raises `ValueError`. With nothing to catch it, the program stops and prints a traceback telling you what went wrong.",
    },
    {
      id: "py-b4-06",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-errors",
      type: "output",
      prompt: "What does this print?",
      code: py`
        try:
            n = int("abc")
        except ValueError:
            print("Not a number")
      `,
      codeLang: "python",
      answers: ["Not a number"],
      explanation:
        "`int(\"abc\")` fails with a `ValueError`. Because it's inside `try`, Python jumps to the matching `except` block and prints the message instead of crashing.",
    },
    // ───────────── Interview questions ─────────────
    {
      id: "d4-01",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-classes",
      prompt: "What does this print?",
      code: py`
        class Dog:
            tricks = []
            def __init__(self, name):
                self.name = name
            def learn(self, trick):
                self.tricks.append(trick)

        a, b = Dog("Rex"), Dog("Fido")
        a.learn("sit")
        print(b.tricks)
      `,
      codeLang: "python",
      options: ["`['sit']`", "`[]`", "`AttributeError`", "`None`"],
      answer: [0],
      explanation:
        "`tricks` is a class attribute, so there's one list shared by every `Dog`. Rex learning a trick adds it to Fido's list too. Give each dog its own list in `__init__` with `self.tricks = []`.",
    },
    {
      id: "d4-02",
      domain: "d4",
      level: "junior",
      lesson: "d4-classes",
      type: "lines",
      prompt: "`c.increment()` raises `TypeError: ... takes 0 positional arguments but 1 was given`. Tap the buggy line.",
      code: py`
        class Counter:
            def __init__(self):
                self.count = 0

            def increment():
                self.count += 1

        c = Counter()
        c.increment()
      `,
      codeLang: "python",
      answer: [5],
      explanation:
        "When you call a method through an object, Python passes the object in as the first argument. The method has to accept it: `def increment(self):`.",
    },
    {
      id: "d4-03",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-classes",
      prompt: "What does this print?",
      code: py`
        class P:
            def __repr__(self):
                return "P-repr"
            def __str__(self):
                return "P-str"

        p = P()
        print(p, [p], f"{p!r}")
      `,
      codeLang: "python",
      options: ["`P-str [P-repr] P-repr`", "`P-str [P-str] P-str`", "`P-repr [P-repr] P-repr`", "`P-str [P-str] P-repr`"],
      answer: [0],
      explanation:
        "`print` uses `str()`, so you get `P-str`. A list shows each of its items with `repr()`. The `!r` in an f-string also calls `repr()`.",
    },
    {
      id: "d4-04",
      domain: "d4",
      level: "senior",
      lesson: "d4-classes",
      type: "lines",
      prompt: "Tap the line that raises an exception.",
      code: py`
        class Point:
            def __init__(self, x):
                self.x = x
            def __eq__(self, other):
                return self.x == other.x

        print(Point(1) == Point(1))
        print({Point(1)})
      `,
      codeLang: "python",
      answer: [8],
      explanation:
        "Line 7 is fine and prints True. But defining `__eq__` without `__hash__` sets `__hash__` to `None`, so putting a `Point` in a set raises `TypeError: unhashable type: 'Point'`. Add a `__hash__`, for example returning `hash(self.x)`, or use a frozen dataclass.",
    },
    {
      id: "d4-05",
      domain: "d4",
      level: "junior",
      lesson: "d4-classes",
      type: "match",
      prompt: "Match each dunder method to what triggers it.",
      pairs: [
        ["`__len__`", "len(obj)"],
        ["`__getitem__`", "obj[key]"],
        ["`__call__`", "obj()"],
        ["`__contains__`", "x in obj"],
        ["`__enter__`", "Entering a with block"],
      ],
      explanation:
        "Writing these methods lets your own objects work with Python's built-in syntax. Together, these hooks are called Python's data model.",
    },
    {
      id: "d4-06",
      domain: "d4",
      level: "junior",
      lesson: "d4-classes",
      prompt: "What does a method marked with `@classmethod` receive as its first argument?",
      options: ["The class itself (by convention called `cls`)", "The instance (`self`)", "Nothing: it takes only the explicit arguments", "The parent class"],
      answer: [0],
      explanation:
        "A classmethod gets the class it was called on. That makes it a good fit for extra ways to build an object, like `Date.from_string(...)`. A `@staticmethod` gets nothing extra at all.",
    },
    {
      id: "d4-07",
      domain: "d4",
      level: "senior",
      lesson: "d4-inheritance",
      prompt: "What does this print?",
      code: py`
        class A:
            def hi(self): return "A"
        class B(A):
            def hi(self): return "B" + super().hi()
        class C(A):
            def hi(self): return "C" + super().hi()
        class D(B, C):
            def hi(self): return "D" + super().hi()

        print(D().hi())
      `,
      codeLang: "python",
      options: ["`DBCA`", "`DBA`", "`DBACA`", "`DCBA`"],
      answer: [0],
      explanation:
        "`D.__mro__` is D, B, C, A, object. Inside B, `super()` means \"the next class after B in this object's MRO\", which is C, not A. So the chain is D, B, C, A, and A only runs once.",
    },
    {
      id: "d4-08",
      domain: "d4",
      level: "senior",
      lesson: "d4-inheritance",
      type: "order",
      prompt: "Given `class B(A)`, `class C(A)` and `class D(B, C)`, put `D.__mro__` in order.",
      items: ["`D`", "`B`", "`C`", "`A`", "`object`"],
      explanation:
        "Python's C3 rule puts the class first, then its bases from left to right, always keeping each class ahead of its own bases. A shared base like A appears once, after all the classes that inherit from it.",
    },
    {
      id: "d4-09",
      domain: "d4",
      level: "junior",
      lesson: "d4-inheritance",
      type: "lines",
      prompt: "Creating `Cat(\"Tom\", True)` raises `TypeError`. Tap the buggy line.",
      code: py`
        class Animal:
            def __init__(self, name):
                self.name = name

        class Cat(Animal):
            def __init__(self, name, indoor):
                super().__init__()
                self.indoor = indoor

        c = Cat("Tom", True)
      `,
      codeLang: "python",
      answer: [7],
      explanation: "`Animal.__init__` needs a `name`, so the call has to pass it along: `super().__init__(name)`.",
    },
    {
      id: "d4-10",
      domain: "d4",
      level: "junior",
      lesson: "d4-inheritance",
      prompt: "What does this print?",
      code: py`
        from dataclasses import dataclass

        @dataclass
        class Item:
            name: str
            qty: int = 1

        a = Item("pen")
        b = Item("pen", 1)
        print(a, a == b)
      `,
      codeLang: "python",
      options: ["`Item(name='pen', qty=1) True`", "`<Item object at 0x...> False`", "`Item(name='pen', qty=1) False`", "`Item('pen', 1) True`"],
      answer: [0],
      explanation:
        "`@dataclass` writes a readable `__repr__` and an `__eq__` that compares field by field. Both items have the same name and quantity, so they're equal.",
    },
    {
      id: "d4-11",
      domain: "d4",
      level: "senior",
      lesson: "d4-inheritance",
      type: "lines",
      prompt: "This class definition raises `ValueError` as soon as it runs. Tap the line responsible.",
      code: py`
        from dataclasses import dataclass, field

        @dataclass
        class Cart:
            owner: str
            items: list = []
            total: float = 0.0
      `,
      codeLang: "python",
      answer: [6],
      explanation:
        "Dataclasses refuse changeable defaults like `[]`, because every instance would share one list, just like the function-default trap. Use `items: list = field(default_factory=list)`.",
    },
    {
      id: "d4-12",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-inheritance",
      prompt: "Which methods does a plain `@dataclass` generate by default? (Choose three.)",
      options: ["`__init__`", "`__repr__`", "`__eq__`", "Ordering methods such as `__lt__`", "`__slots__`"],
      answer: [0, 1, 2],
      explanation:
        "Ordering needs `order=True`, and slots need `slots=True` (Python 3.10 and later). Because `__eq__` is generated and the class isn't frozen, its instances can't be hashed by default.",
    },
    {
      id: "d4-13",
      domain: "d4",
      level: "senior",
      lesson: "d4-errors",
      prompt: "What does this print?",
      code: py`
        def f():
            try:
                print("try")
                return "ret"
            except ValueError:
                print("except")
            else:
                print("else")
            finally:
                print("finally")

        print(f())
      `,
      codeLang: "python",
      options: ["`try`, `finally`, `ret`", "`try`, `else`, `finally`, `ret`", "`try`, `ret`, `finally`", "`try`, `else`, `ret`"],
      answer: [0],
      explanation:
        "`else` only runs when the `try` block reaches its end normally. Leaving with `return` skips it. `finally` still runs before the function actually hands back its value, so `ret` prints last.",
    },
    {
      id: "d4-14",
      domain: "d4",
      level: "junior",
      lesson: "d4-errors",
      prompt: "What does this print?",
      code: py`
        try:
            n = int("4x")
        except ValueError:
            print("bad")
        else:
            print("ok", n)
        finally:
            print("done")
      `,
      codeLang: "python",
      options: ["`bad`, `done`", "`bad`, `ok 4`, `done`", "`ok 4`, `done`", "`bad` only"],
      answer: [0],
      explanation:
        "`int(\"4x\")` raises `ValueError`, so the handler runs and `else` is skipped. `finally` runs no matter what.",
    },
    {
      id: "d4-15",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-errors",
      type: "lines",
      prompt: "The `ValueError` branch never runs, even for `parse(\"abc\")`. Tap the line that causes it.",
      code: py`
        def parse(text):
            try:
                return int(text)
            except Exception:
                return "something went wrong"
            except ValueError:
                return "not a number"

        print(parse("abc"))
      `,
      codeLang: "python",
      answer: [4],
      explanation:
        "Handlers are tried from top to bottom, and `ValueError` is a kind of `Exception`. So the broad handler always catches it first. Put specific exceptions above general ones.",
    },
    {
      id: "d4-16",
      domain: "d4",
      level: "senior",
      lesson: "d4-errors",
      prompt: "What happens when this runs?",
      code: py`
        class Tag:
            def __init__(self, name):
                self.name = name
            def __enter__(self):
                print(f"<{self.name}>")
                return self
            def __exit__(self, exc_type, exc, tb):
                print(f"</{self.name}>")
                return False

        with Tag("b"):
            raise ValueError("oops")
        print("after")
      `,
      codeLang: "python",
      options: [
        "Prints `<b>` and `</b>`, then the `ValueError` carries on up (no `after`)",
        "Prints `<b>`, then the `ValueError` carries on up (no `</b>`)",
        "Prints `<b>`, `</b>`, `after`",
        "Prints `<b>`, `after`, `</b>`",
      ],
      answer: [0],
      explanation:
        "`__exit__` always runs, even when the body raises. It returns `False`, so the exception isn't swallowed. It carries on up and `print(\"after\")` is never reached.",
    },
    {
      id: "d4-17",
      domain: "d4",
      level: "junior",
      lesson: "d4-errors",
      type: "order",
      prompt: "Put in order what happens for `with open(path) as f: data = f.read()`.",
      items: [
        "Evaluate `open(path)` to get a context manager",
        "Call its `__enter__()` and bind the result to `f`",
        "Run the body: `data = f.read()`",
        "Call `__exit__()`, which closes the file even if the body raised",
      ],
      explanation:
        "That last step is why `with` beats calling `close()` yourself. An early return or an exception can't skip the cleanup.",
    },
    {
      id: "d4-18",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-errors",
      prompt: "Which are good exception-handling habits? (Choose two.)",
      options: [
        "Catch the most specific exception you can actually handle",
        "Use `raise NewError(...) from err` to keep the original cause when translating an exception",
        "Use a bare `except:` so the program never crashes",
        "Return error strings instead of raising exceptions",
        "Wrap the whole program in one big `try`",
      ],
      answer: [0, 1],
      explanation:
        "A bare `except:` also catches `KeyboardInterrupt` and `SystemExit`, and it hides real bugs. Chaining with `from` keeps the original error attached, which makes debugging much easier.",
    },
    {
      id: "d4-19",
      domain: "d4",
      level: "senior",
      lesson: "d4-concurrency",
      prompt: "You need to resize 50,000 images with a pure-Python function on a standard CPython build. What gives a real speed-up across CPU cores?",
      options: [
        "`multiprocessing` (for example `ProcessPoolExecutor`)",
        "`threading` (for example `ThreadPoolExecutor`)",
        "`asyncio.gather`",
        "Running the loop inside a generator",
      ],
      answer: [0],
      explanation:
        "This work keeps the CPU busy in Python code. On the standard build, the GIL lets only one thread run Python bytecode at a time, so threads and asyncio can't use more cores. Separate processes each have their own interpreter and GIL, so they really do run in parallel.",
    },
    {
      id: "d4-20",
      domain: "d4",
      level: "senior",
      lesson: "d4-concurrency",
      type: "match",
      prompt: "Match each workload to the tool that fits it best.",
      pairs: [
        ["Thousands of concurrent HTTP requests from one process", "asyncio"],
        ["CPU-heavy number crunching in pure Python", "multiprocessing"],
        ["A few blocking calls to a library with no async support", "threading"],
        ["Run one blocking function from async code without freezing the loop", "asyncio.to_thread()"],
      ],
      explanation:
        "Sort the work first. Work that mostly waits on I/O suits asyncio or threads. Work that keeps the CPU busy needs processes. `asyncio.to_thread` (Python 3.9 and later) moves one blocking call onto a worker thread.",
    },
    {
      id: "d4-21",
      domain: "d4",
      level: "senior",
      lesson: "d4-concurrency",
      prompt: "What does this print?",
      code: py`
        import asyncio, time

        async def job(n):
            await asyncio.sleep(1)
            return n

        async def main():
            start = time.perf_counter()
            results = await asyncio.gather(job(1), job(2), job(3))
            print(results, round(time.perf_counter() - start))

        asyncio.run(main())
      `,
      codeLang: "python",
      options: ["`[1, 2, 3] 1`", "`[1, 2, 3] 3`", "`[3, 2, 1] 1`", "`[<coroutine>, <coroutine>, <coroutine>] 0`"],
      answer: [0],
      explanation:
        "`gather` runs the three jobs at the same time, so their one-second sleeps overlap and the total is about 1 second. Results come back in the order you passed them in, not the order they finished.",
    },
    {
      id: "d4-22",
      domain: "d4",
      level: "senior",
      lesson: "d4-concurrency",
      type: "lines",
      prompt: "This takes about 3 seconds instead of 1. Tap the buggy line.",
      code: py`
        import asyncio, time

        async def fetch(n):
            time.sleep(1)
            return n

        async def main():
            return await asyncio.gather(fetch(1), fetch(2), fetch(3))

        print(asyncio.run(main()))
      `,
      codeLang: "python",
      answer: [4],
      explanation:
        "`time.sleep` freezes the whole event loop thread, so the jobs end up running one after another. Use `await asyncio.sleep(1)` instead, or `await asyncio.to_thread(...)` for a blocking library call.",
    },
    {
      id: "d4-23",
      domain: "d4",
      level: "senior",
      lesson: "d4-concurrency",
      prompt: "Which statement about CPython's GIL is true?",
      options: [
        "Only one thread runs Python bytecode at a time in a process, but threads can still overlap while waiting on I/O",
        "It makes `counter += 1` from many threads safe without a lock",
        "It stops a Python program from starting more than one thread",
        "It also limits how many processes `multiprocessing` can start at any one time on the whole machine",
      ],
      answer: [0],
      explanation:
        "The GIL protects the interpreter's own internals, not your program's logic. `counter += 1` is a read, an add and a write, so two threads can interleave and lose an update. Protect it with a `threading.Lock`.",
    },
    {
      id: "d4-24",
      domain: "d4",
      level: "staff",
      lesson: "d4-concurrency",
      prompt: "An asyncio web service calls a CPU-heavy pure-Python function (about 2 seconds) inside a request handler, and response times spike for every user. What's the best fix?",
      options: [
        "Run it in a process pool (`await loop.run_in_executor(process_pool, fn, ...)`) or hand it to a separate worker queue",
        "Add `await asyncio.sleep(0)` before the call",
        "Mark the function `async def` without any other changes, so the event loop can switch to other requests while it's running",
        "Start a second event loop in the same thread",
      ],
      answer: [0],
      explanation:
        "CPU work blocks the single event-loop thread, so every other request waits. Writing `async def` on its own doesn't make code stop blocking. A process pool, or a job queue like Celery or RQ, runs the work somewhere else and gets around the GIL as well.",
    },
    {
      id: "d4-25",
      domain: "d4",
      level: "staff",
      lesson: "d4-errors",
      type: "order",
      prompt: "Put in order a graceful shutdown for a worker service that receives SIGTERM during a deploy.",
      items: [
        "Stop accepting new jobs",
        "Let in-flight jobs finish, up to a timeout",
        "Release resources: flush buffers and close connections (context managers or `finally`)",
        "Exit with status 0",
      ],
      explanation:
        "Draining the work before exiting avoids leaving jobs half done. Putting cleanup in `with` blocks and `finally` means it still runs if a job raises during shutdown.",
    },
    {
      id: "d4-26",
      domain: "d4",
      level: "staff",
      lesson: "d4-errors",
      prompt: "Your team wraps a third-party payments SDK for the rest of the company. Which error-handling design serves callers best?",
      options: [
        "A small family of exceptions (`PaymentError`, `CardDeclined(PaymentError)`, and so on) that SDK errors are translated into with `raise ... from err`",
        "Let every SDK exception leak through unchanged",
        "Return `None` on any failure",
        "Raise a plain `Exception(\"failed\")` for every problem, and put the SDK's original error message in the text so callers can parse it with a regex to work out what happened",
      ],
      answer: [0],
      explanation:
        "Callers can catch exactly what they handle (`except CardDeclined`) or everything (`except PaymentError`). They don't depend on the vendor's own types, so you can swap SDKs later. And `from err` keeps the original traceback for debugging.",
    },
    {
      id: "d4-27",
      domain: "d4",
      level: "staff",
      lesson: "d4-classes",
      prompt: "In a plugin system, every plugin class must implement `run()`, and a plugin that forgets should fail loudly as soon as it's created. What fits best?",
      options: [
        "A base class built on `abc.ABC` with `@abstractmethod def run(self)`",
        "A note in the README",
        "`hasattr(plugin, \"run\")` checks in every caller",
        "A metaclass that silently adds an empty `run()` method to it",
      ],
      answer: [0],
      explanation:
        "Creating an instance of a subclass that hasn't filled in every abstract method raises `TypeError` straight away. For plugins that don't share a base class, `typing.Protocol` gives static type checkers the same contract.",
    },
    {
      id: "d4-28",
      domain: "d4",
      level: "staff",
      lesson: "d4-inheritance",
      prompt: "Why do teams often prefer composition over a deep inheritance tree? (Choose two.)",
      options: [
        "Behaviour can be swapped by passing in a different collaborator, which makes testing and change easier",
        "It avoids fragile ties to base-class internals and surprising MRO and `super()` chains",
        "Composition makes attribute lookup significantly faster",
        "Python doesn't allow inheritance more than two levels deep",
        "Composed objects don't need tests",
      ],
      answer: [0, 1],
      explanation:
        "Inheritance ties a subclass to the inner workings of its parents. Composition, where an object has other objects rather than being a kind of them, keeps the pieces separate and easy to replace. Python does allow deep trees; they just rarely pay off.",
    },
  ],

  cards: [
    { id: "c4-dataclass", domain: "d4", kind: "service", term: "@dataclass", definition: "Writes __init__, __repr__ and __eq__ for you from the annotated fields. Options include frozen, order and slots." },
    { id: "c4-property", domain: "d4", kind: "service", term: "@property", definition: "Turns a method into an attribute that's worked out when you read it. You can add a setter and deleter too." },
    { id: "c4-classmethod", domain: "d4", kind: "service", term: "@classmethod", definition: "A method that receives the class (cls) instead of an instance. Often used for extra ways to build an object." },
    { id: "c4-staticmethod", domain: "d4", kind: "service", term: "@staticmethod", definition: "A method that gets no automatic first argument. It's a plain function that lives inside the class for tidiness." },
    { id: "c4-super", domain: "d4", kind: "service", term: "super()", definition: "Calls the next class in the object's MRO, which lets each class in a chain run its part." },
    { id: "c4-contextmanager", domain: "d4", kind: "service", term: "contextlib.contextmanager", definition: "Builds a context manager from a generator. The code before yield is the setup, and the code after it is the cleanup." },
    { id: "c4-gather", domain: "d4", kind: "service", term: "asyncio.gather", definition: "Runs several awaitables at the same time and returns their results in the order you passed them." },
    { id: "c4-threadpool", domain: "d4", kind: "service", term: "ThreadPoolExecutor", definition: "A pool of threads from concurrent.futures. A good fit for work that spends its time waiting on I/O." },
    { id: "c4-processpool", domain: "d4", kind: "service", term: "ProcessPoolExecutor", definition: "A pool of processes from concurrent.futures. It gets around the GIL for CPU-heavy work." },
    { id: "c4-lock", domain: "d4", kind: "service", term: "threading.Lock", definition: "Lets only one thread at a time into a section of code. Use it in a with block to protect shared data." },
    { id: "c4-mro", domain: "d4", kind: "concept", term: "MRO", definition: "Method Resolution Order: the list of classes Python searches, in order, to find an attribute. You can see it with Cls.__mro__." },
    { id: "c4-gil", domain: "d4", kind: "concept", term: "GIL", definition: "CPython's Global Interpreter Lock. It lets only one thread run Python bytecode at a time in each process." },
    { id: "c4-dunder", domain: "d4", kind: "concept", term: "Dunder methods", definition: "Double-underscore methods like __len__ and __eq__. They connect your class to built-in syntax such as len() and ==." },
    { id: "c4-ctx", domain: "d4", kind: "concept", term: "Context manager", definition: "An object with __enter__ and __exit__. The with statement uses it to make sure setup and cleanup always happen." },
    { id: "c4-eafp", domain: "d4", kind: "concept", term: "EAFP", definition: "\"Easier to ask forgiveness than permission\": try the operation and handle the exception, instead of checking everything first." },
  ],
});
