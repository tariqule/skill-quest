import { CodeBlock, CodeCompare, Tiles } from "@/components/learn/blocks";
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
    summary: "Classes and dunder methods, inheritance and the MRO, dataclasses, exceptions and context managers, and the GIL with threading, multiprocessing, and asyncio.",
  },

  tasks: [
    { id: "4.1", title: "Classes and the data model", covers: ["Class vs instance attributes", "self, @classmethod, @staticmethod, @property", "Dunder methods: __repr__, __str__, __eq__, __hash__, __len__…"] },
    { id: "4.2", title: "Inheritance, MRO, and dataclasses", covers: ["super() and cooperative inheritance", "C3 linearization / __mro__", "@dataclass and field(default_factory=…)"] },
    { id: "4.3", title: "Exceptions and context managers", covers: ["try / except / else / finally order", "Handler ordering and specific exceptions", "raise … from", "with, __enter__ / __exit__, contextlib"] },
    { id: "4.4", title: "The GIL and concurrency", covers: ["What the GIL does and doesn't protect", "threading vs multiprocessing vs asyncio", "Blocking calls inside async code"] },
  ],

  lessons: [
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
              { icon: "📏", title: "__len__", text: "len(obj)", color: "#a78bfa" },
              { icon: "🔎", title: "__getitem__", text: "obj[key]", color: "#a78bfa" },
              { icon: "📞", title: "__call__", text: "obj()", color: "#a78bfa" },
              { icon: "🧺", title: "__contains__", text: "x in obj", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Attributes defined in the class body are shared by every instance. Put per-instance state in __init__ on self.",
        "__str__ is for users (print), __repr__ for developers; containers show their items' __repr__.",
        "Defining __eq__ without __hash__ makes instances unhashable (Python sets __hash__ to None).",
        "@classmethod receives the class (cls), @staticmethod receives nothing implicit, @property makes a method read like an attribute.",
      ],
      tip: "If asked to make a class work with len, in, for, or +, name the dunder method each one calls.",
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
        "super() calls the next class in the instance's MRO, not necessarily the parent you see in the class statement.",
        "The MRO lists children before parents and keeps the left-to-right order of bases; inspect it with Cls.__mro__.",
        "@dataclass writes __init__, __repr__, and __eq__ from annotated fields. order=True adds comparisons, frozen=True makes it immutable.",
        "Mutable defaults in a dataclass raise ValueError; use field(default_factory=list).",
      ],
      tip: "Prefer composition over deep inheritance, and say so. Dataclasses are the idiomatic answer for \"a class that just holds data\".",
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
              title: "Class-based",
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
              title: "Generator-based",
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
        "else runs only if the try block finished without raising (and without return or break). finally always runs.",
        "Except clauses are checked top to bottom; put specific exceptions before general ones.",
        "raise NewError(...) from err keeps the original cause in the traceback.",
        "with calls __enter__ (its return value binds to as) and always calls __exit__; returning True from __exit__ suppresses the exception.",
      ],
      tip: "Python favours EAFP (try it and catch the error) over LBYL (check first). Mention it when you write a try/except around a dict lookup.",
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
              { icon: "🧵", title: "threading", text: "Shared memory, OS threads. Good for blocking I/O. With the GIL, only one thread runs Python bytecode at a time.", color: "#38bdf8" },
              { icon: "🏭", title: "multiprocessing", text: "Separate processes, each with its own interpreter and GIL. Real parallelism for CPU-bound work; data must be pickled.", color: "#f59e0b" },
              { icon: "⚡", title: "asyncio", text: "One thread, one event loop, cooperative tasks. Great for thousands of concurrent network calls. Never block the loop.", color: "#34d399" },
            ]}
          />
          <CodeCompare
            lang="python"
            left={{
              title: "Blocks the loop: ~3 s",
              code: py`
                async def fetch(n):
                    time.sleep(1)
                    return n
              `,
            }}
            right={{
              title: "Yields to the loop: ~1 s",
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
        "The GIL (Global Interpreter Lock) in standard CPython lets only one thread execute Python bytecode at a time per process.",
        "Threads still help for I/O: blocking I/O calls release the GIL while they wait.",
        "The GIL doesn't make your code thread-safe: counter += 1 is several steps and can race. Use threading.Lock or a queue.",
        "concurrent.futures gives one API for both: ThreadPoolExecutor and ProcessPoolExecutor.",
        "Recent CPython versions also ship an optional free-threaded build without the GIL; the standard build still has it.",
      ],
      tip: "Answer \"threads or processes?\" by first classifying the work: I/O-bound or CPU-bound. Then pick the tool.",
    },
  ],

  questions: [
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
      explanation: "`tricks` is a class attribute: one list shared by every `Dog`. Create it per instance in `__init__` with `self.tricks = []`.",
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
      explanation: "Calling a method through an instance passes the instance as the first argument. The method must accept it: `def increment(self):`.",
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
      explanation: "`print` uses `str()`. A list's string form uses each item's `repr()`. The `!r` conversion in an f-string calls `repr()`.",
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
        "Line 7 prints True. Defining `__eq__` without `__hash__` sets `__hash__` to `None`, so putting a `Point` in a set raises `TypeError: unhashable type: 'Point'`. Add a `__hash__` (e.g. `hash(self.x)`) or use a frozen dataclass.",
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
      explanation: "Implementing these \"protocols\" lets your objects work with built-in syntax. That's Python's data model.",
    },
    {
      id: "d4-06",
      domain: "d4",
      level: "junior",
      lesson: "d4-classes",
      prompt: "What does a method decorated with `@classmethod` receive as its first argument?",
      options: ["The class itself (conventionally `cls`)", "The instance (`self`)", "Nothing: it takes only the explicit arguments", "The parent class"],
      answer: [0],
      explanation: "Classmethods get the class they were called on, which makes them ideal for alternative constructors like `Date.from_string(...)`. `@staticmethod` gets nothing implicit.",
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
      explanation: "`D.__mro__` is D, B, C, A, object. `super()` in B means \"next after B in the instance's MRO\", which is C, not A. A runs once.",
    },
    {
      id: "d4-08",
      domain: "d4",
      level: "senior",
      lesson: "d4-inheritance",
      type: "order",
      prompt: "`class B(A)`, `class C(A)`, `class D(B, C)`. Put `D.__mro__` in order.",
      items: ["`D`", "`B`", "`C`", "`A`", "`object`"],
      explanation: "C3 linearization: the class first, then its bases left to right, with every class before its own bases. A shared base appears once, after all its subclasses.",
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
      explanation: "`Animal.__init__` requires `name`. The call must pass it on: `super().__init__(name)`.",
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
      explanation: "`@dataclass` generates a readable `__repr__` and a field-by-field `__eq__`, so two items with equal fields compare equal.",
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
      explanation: "Dataclasses refuse mutable defaults like `[]` (they'd be shared, like the function-default trap). Use `items: list = field(default_factory=list)`.",
    },
    {
      id: "d4-12",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-inheritance",
      prompt: "Which methods does a plain `@dataclass` generate by default? (Choose three.)",
      options: ["`__init__`", "`__repr__`", "`__eq__`", "Ordering methods such as `__lt__`", "`__slots__`"],
      answer: [0, 1, 2],
      explanation: "Ordering needs `order=True`, and slots need `slots=True` (3.10+). Because `__eq__` is generated and the class isn't frozen, instances are unhashable by default.",
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
      explanation: "`else` runs only when the try block completes normally. Leaving it with `return` skips `else`. `finally` still runs before the function actually returns, so `ret` prints last.",
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
      explanation: "`int(\"4x\")` raises `ValueError`, so the handler runs and `else` is skipped. `finally` always runs.",
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
      explanation: "Handlers are tried top to bottom and `ValueError` is a subclass of `Exception`, so the broad handler always wins. Put specific exceptions first.",
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
        "Prints `<b>` and `</b>`, then the `ValueError` propagates (no `after`)",
        "Prints `<b>`, then the `ValueError` propagates (no `</b>`)",
        "Prints `<b>`, `</b>`, `after`",
        "Prints `<b>`, `after`, `</b>`",
      ],
      answer: [0],
      explanation: "`__exit__` always runs, even when the body raises. It returns `False`, so the exception isn't suppressed and `print(\"after\")` is never reached.",
    },
    {
      id: "d4-17",
      domain: "d4",
      level: "junior",
      lesson: "d4-errors",
      type: "order",
      prompt: "Order what happens for `with open(path) as f: data = f.read()`.",
      items: [
        "Evaluate `open(path)` to get a context manager",
        "Call its `__enter__()` and bind the result to `f`",
        "Run the body: `data = f.read()`",
        "Call `__exit__()`, which closes the file even if the body raised",
      ],
      explanation: "That guarantee is why `with` beats a manual `close()`: cleanup can't be skipped by an early return or an exception.",
    },
    {
      id: "d4-18",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-errors",
      prompt: "Which are good exception-handling practices? (Choose two.)",
      options: [
        "Catch the most specific exception you can actually handle",
        "Use `raise NewError(...) from err` to keep the original cause when translating an exception",
        "Use a bare `except:` so the program never crashes",
        "Return error strings instead of raising exceptions",
        "Wrap the whole program in one big `try`",
      ],
      answer: [0, 1],
      explanation: "A bare `except:` also catches `KeyboardInterrupt` and `SystemExit` and hides bugs. Exception chaining with `from` preserves debugging context.",
    },
    {
      id: "d4-19",
      domain: "d4",
      level: "senior",
      lesson: "d4-concurrency",
      prompt: "You must resize 50,000 images with a pure-Python function on a standard CPython build. What gives a real speed-up across CPU cores?",
      options: [
        "`multiprocessing` (e.g. `ProcessPoolExecutor`)",
        "`threading` (e.g. `ThreadPoolExecutor`)",
        "`asyncio.gather`",
        "Running the loop inside a generator",
      ],
      answer: [0],
      explanation:
        "This is CPU-bound Python code. On the standard build the GIL lets only one thread run Python bytecode at a time, so threads and asyncio won't use more cores. Separate processes each have their own interpreter and GIL.",
    },
    {
      id: "d4-20",
      domain: "d4",
      level: "senior",
      lesson: "d4-concurrency",
      type: "match",
      prompt: "Match each workload to the best-fit tool.",
      pairs: [
        ["Thousands of concurrent HTTP requests from one process", "asyncio"],
        ["CPU-heavy number crunching in pure Python", "multiprocessing"],
        ["A few blocking calls to a library with no async support", "threading"],
        ["Run one blocking function from async code without freezing the loop", "asyncio.to_thread()"],
      ],
      explanation: "Classify first: I/O-bound work suits asyncio or threads; CPU-bound work needs processes. `asyncio.to_thread` (3.9+) offloads a blocking call to a worker thread.",
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
      explanation: "`gather` runs the coroutines concurrently; their sleeps overlap, so the total is about 1 second. Results come back in argument order, not finish order.",
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
      explanation: "`time.sleep` blocks the whole event loop thread, so the coroutines run one after another. Use `await asyncio.sleep(1)` (or `await asyncio.to_thread(...)` for blocking library calls).",
    },
    {
      id: "d4-23",
      domain: "d4",
      level: "senior",
      lesson: "d4-concurrency",
      prompt: "Which statement about CPython's GIL is true?",
      options: [
        "Only one thread executes Python bytecode at a time in a process, but threads can still overlap while waiting on I/O",
        "It makes `counter += 1` from many threads safe without a lock",
        "It prevents a Python program from starting more than one thread",
        "It also limits how many processes `multiprocessing` can start",
      ],
      answer: [0],
      explanation: "The GIL protects the interpreter's internals, not your logic. `counter += 1` is a read, an add, and a write, so threads can interleave and lose updates. Use a `threading.Lock`.",
    },
    {
      id: "d4-24",
      domain: "d4",
      level: "staff",
      lesson: "d4-concurrency",
      prompt: "An asyncio web service calls a CPU-heavy pure-Python function (about 2 seconds) inside a request handler, and latency spikes for every user. What's the best fix?",
      options: [
        "Run it in a process pool (`await loop.run_in_executor(process_pool, fn, ...)`) or hand it to a separate worker queue",
        "Add `await asyncio.sleep(0)` before the call",
        "Mark the function `async def` without other changes",
        "Start a second event loop in the same thread",
      ],
      answer: [0],
      explanation:
        "CPU work blocks the single event-loop thread, stalling every other request. `async def` alone doesn't make code non-blocking. A process pool (or a job queue like Celery or RQ) runs it elsewhere, sidestepping the GIL too.",
    },
    {
      id: "d4-25",
      domain: "d4",
      level: "staff",
      lesson: "d4-errors",
      type: "order",
      prompt: "Order a graceful shutdown for a worker service that receives SIGTERM during a deploy.",
      items: [
        "Stop accepting new jobs",
        "Let in-flight jobs finish, up to a timeout",
        "Release resources: flush buffers and close connections (context managers / `finally`)",
        "Exit with status 0",
      ],
      explanation:
        "Draining before exiting avoids half-finished work. Putting cleanup in `with` blocks and `finally` means it also runs if a job raises during shutdown.",
    },
    {
      id: "d4-26",
      domain: "d4",
      level: "staff",
      lesson: "d4-errors",
      prompt: "Your team wraps a third-party payments SDK for the rest of the company. Which error-handling design serves callers best?",
      options: [
        "A small exception hierarchy (`PaymentError`, `CardDeclined(PaymentError)`, …) that SDK errors are translated into with `raise ... from err`",
        "Let every SDK exception leak through unchanged",
        "Return `None` on any failure",
        "Raise a plain `Exception(\"failed\")` for every problem",
      ],
      answer: [0],
      explanation:
        "Callers can catch exactly what they handle (`except CardDeclined`) or everything (`except PaymentError`), they don't depend on the vendor's types (so you can swap SDKs), and `from err` keeps the original traceback for debugging.",
    },
    {
      id: "d4-27",
      domain: "d4",
      level: "staff",
      lesson: "d4-classes",
      prompt: "In a plugin system, every plugin class must implement `run()`, and a plugin that forgets should fail loudly when it's instantiated. What fits best?",
      options: [
        "A base class built on `abc.ABC` with `@abstractmethod def run(self)`",
        "A note in the README",
        "`hasattr(plugin, \"run\")` checks in every caller",
        "A metaclass that silently adds an empty `run()`",
      ],
      answer: [0],
      explanation:
        "Instantiating a subclass that hasn't implemented every abstract method raises `TypeError` immediately. For duck-typed plugins that don't share a base class, `typing.Protocol` gives the same contract to static type checkers.",
    },
    {
      id: "d4-28",
      domain: "d4",
      level: "staff",
      lesson: "d4-inheritance",
      prompt: "Why do teams often prefer composition over a deep inheritance hierarchy? (Choose two.)",
      options: [
        "Behaviour can be swapped by passing in a different collaborator, which makes testing and change easier",
        "It avoids fragile coupling to base-class internals and surprising MRO and `super()` chains",
        "Composition makes attribute lookup significantly faster",
        "Python doesn't allow inheritance more than two levels deep",
        "Composed objects don't need tests",
      ],
      answer: [0, 1],
      explanation: "Inheritance ties a subclass to its parents' implementation details. Composition (\"has-a\") keeps pieces independent and replaceable. Python allows deep hierarchies; it just rarely pays off.",
    },
  ],

  cards: [
    { id: "c4-dataclass", domain: "d4", kind: "service", term: "@dataclass", definition: "Generates __init__, __repr__, and __eq__ from annotated fields; options include frozen, order, slots." },
    { id: "c4-property", domain: "d4", kind: "service", term: "@property", definition: "Turns a method into a computed attribute, with optional setter and deleter." },
    { id: "c4-classmethod", domain: "d4", kind: "service", term: "@classmethod", definition: "Method that receives the class (cls); often used for alternative constructors." },
    { id: "c4-staticmethod", domain: "d4", kind: "service", term: "@staticmethod", definition: "Method that receives no implicit first argument; a plain function namespaced in the class." },
    { id: "c4-super", domain: "d4", kind: "service", term: "super()", definition: "Proxy that calls the next class in the instance's MRO." },
    { id: "c4-contextmanager", domain: "d4", kind: "service", term: "contextlib.contextmanager", definition: "Builds a context manager from a generator: code before yield is setup, after it is cleanup." },
    { id: "c4-gather", domain: "d4", kind: "service", term: "asyncio.gather", definition: "Runs awaitables concurrently and returns their results in argument order." },
    { id: "c4-threadpool", domain: "d4", kind: "service", term: "ThreadPoolExecutor", definition: "concurrent.futures pool of threads; good for blocking I/O work." },
    { id: "c4-processpool", domain: "d4", kind: "service", term: "ProcessPoolExecutor", definition: "concurrent.futures pool of processes; sidesteps the GIL for CPU-bound work." },
    { id: "c4-lock", domain: "d4", kind: "service", term: "threading.Lock", definition: "Mutual-exclusion lock; use it with with to protect shared state between threads." },
    { id: "c4-mro", domain: "d4", kind: "concept", term: "MRO", definition: "Method Resolution Order: the C3-linearized class list Python searches for attributes (Cls.__mro__)." },
    { id: "c4-gil", domain: "d4", kind: "concept", term: "GIL", definition: "CPython's Global Interpreter Lock: one thread runs Python bytecode at a time per process." },
    { id: "c4-dunder", domain: "d4", kind: "concept", term: "Dunder methods", definition: "Double-underscore hooks like __len__ and __eq__ that connect your class to built-in syntax." },
    { id: "c4-ctx", domain: "d4", kind: "concept", term: "Context manager", definition: "Object with __enter__ and __exit__ used by with to guarantee setup and cleanup." },
    { id: "c4-eafp", domain: "d4", kind: "concept", term: "EAFP", definition: "\"Easier to ask forgiveness than permission\": try the operation and handle the exception." },
  ],
});
