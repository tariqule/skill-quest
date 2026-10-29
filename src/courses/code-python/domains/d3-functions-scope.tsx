import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { py } from "../py";
import { LegbRings } from "../visuals";

/** Module 3: parameters, defaults, type hints, scope and closures, decorators. */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Functions, Scope & Decorators",
    world: "Closure Canyon",
    weight: 25,
    emoji: "🏜️",
    color: "#f59e0b",
    summary: "*args and **kwargs, keyword-only parameters, the mutable default trap, LEGB scope, closures and late binding, decorators, and type hints.",
  },

  tasks: [
    {
      id: "3.1",
      title: "Parameters, arguments, and type hints",
      covers: ["Positional, keyword, *args, **kwargs", "Keyword-only (*) and positional-only (/) parameters", "Unpacking with * and **", "Type hints are not enforced at runtime"],
    },
    { id: "3.2", title: "Default arguments", covers: ["Defaults are evaluated once, at definition time", "The mutable default trap and the None sentinel"] },
    { id: "3.3", title: "Scope and closures", covers: ["LEGB lookup", "global and nonlocal", "UnboundLocalError", "Closures and late binding in loops"] },
    { id: "3.4", title: "Decorators", covers: ["Functions as objects", "Writing a decorator with *args/**kwargs", "Stacking order", "functools.wraps"] },
  ],

  lessons: [
    {
      id: "d3-args",
      level: "junior",
      task: "3.1",
      title: "Every kind of parameter",
      check: ["d3-01", "d3-04"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="python"
            code={py`
              def f(pos_only, /, normal, *args, kw_only, **kwargs) -> None: ...

              f(1, 2, 3, 4, kw_only=5, extra=6)
              # pos_only=1  normal=2  args=(3, 4)  kw_only=5  kwargs={'extra': 6}

              nums, opts = [1, 2], {"kw_only": 3}
              f(*nums, **opts)   # unpack into arguments
            `}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "📍", title: "/", text: "Parameters before it are positional-only.", color: "#f59e0b" },
              { icon: "🧺", title: "*args", text: "Extra positional arguments, as a tuple.", color: "#f59e0b" },
              { icon: "🔑", title: "* (bare)", text: "Parameters after it are keyword-only.", color: "#f59e0b" },
              { icon: "🗃️", title: "**kwargs", text: "Extra keyword arguments, as a dict.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "Order in a signature: positional-only, /, normal, *args (or bare *), keyword-only, **kwargs.",
        "At the call site, * unpacks an iterable into positional arguments and ** unpacks a dict into keyword arguments.",
        "Type hints (x: int, -> str, list[int], int | None) are metadata for tools like mypy and IDEs. Python doesn't enforce them at runtime.",
      ],
      tip: "When designing an API in an interview, make flags keyword-only (def fetch(url, *, timeout=5)) so calls stay readable.",
    },
    {
      id: "d3-defaults",
      level: "intermediate",
      task: "3.2",
      title: "The mutable default trap",
      check: ["d3-07", "d3-10"],
      visual: (
        <CodeCompare
          lang="python"
          left={{
            title: "Bug: one list shared by every call",
            code: py`
              def add_item(item, bucket=[]):
                  bucket.append(item)
                  return bucket

              add_item(1)  # [1]
              add_item(2)  # [1, 2]  !!
            `,
          }}
          right={{
            title: "Fix: None sentinel",
            code: py`
              def add_item(item, bucket=None):
                  if bucket is None:
                      bucket = []
                  bucket.append(item)
                  return bucket

              add_item(1)  # [1]
              add_item(2)  # [2]
            `,
          }}
        />
      ),
      points: [
        "Default values are evaluated once, when the def statement runs, and stored on the function (f.__defaults__).",
        "A mutable default (list, dict, set) is therefore shared by every call that doesn't pass the argument.",
        "Use None as the default and create the object inside the function.",
        "The same rule means default=x captures x's value at definition time, not call time.",
      ],
      tip: "This is the single most-asked Python gotcha. Explain why (evaluated once), not just the fix.",
    },
    {
      id: "d3-scope",
      level: "senior",
      task: "3.3",
      title: "LEGB, closures, and late binding",
      check: ["d3-12", "d3-14"],
      visual: (
        <div className="grid gap-6">
          <LegbRings />
          <CodeCompare
            lang="python"
            left={{
              title: "Late binding: all see the final i",
              code: py`
                funcs = [lambda: i for i in range(3)]
                [f() for f in funcs]   # [2, 2, 2]
              `,
            }}
            right={{
              title: "Bind now with a default",
              code: py`
                funcs = [lambda i=i: i for i in range(3)]
                [f() for f in funcs]   # [0, 1, 2]
              `,
            }}
          />
        </div>
      ),
      points: [
        "Lookup order: Local, Enclosing, Global, Built-in. Not found anywhere means NameError.",
        "If a function assigns to a name anywhere in its body, that name is local everywhere in that function. Reading it before the assignment raises UnboundLocalError.",
        "global rebinds a module-level name; nonlocal rebinds a name in the nearest enclosing function.",
        "Closures capture variables, not values. The value is looked up when the inner function runs.",
      ],
      tip: "Mutating a global list (items.append(x)) needs no global statement; only rebinding the name (items = ...) does.",
    },
    {
      id: "d3-decorators",
      level: "intermediate",
      task: "3.4",
      title: "Decorators are just functions",
      check: ["d3-17", "d3-18"],
      visual: (
        <div className="grid gap-4">
          <CodeCompare
            lang="python"
            left={{
              title: "A timing decorator",
              code: py`
                import functools, time

                def timed(fn):
                    @functools.wraps(fn)
                    def wrapper(*args, **kwargs):
                        start = time.perf_counter()
                        try:
                            return fn(*args, **kwargs)
                        finally:
                            print(fn.__name__, time.perf_counter() - start)
                    return wrapper
              `,
            }}
            right={{
              title: "@ is shorthand for reassignment",
              code: py`
                @timed
                def work(): ...

                # same as:
                def work(): ...
                work = timed(work)

                @a
                @b
                def f(): ...   # f = a(b(f))
              `,
            }}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "📞", label: "Caller", sub: "work(…)" },
              { icon: "🎁", label: "wrapper", sub: "Runs code before" },
              { icon: "⚙️", label: "Original fn", sub: "Returns a value" },
              { icon: "🎁", label: "wrapper", sub: "Runs code after, returns the value" },
            ]}
          />
        </div>
      ),
      points: [
        "A decorator takes a function and returns a replacement, usually a closure that calls the original.",
        "Accept *args, **kwargs in the wrapper and return the original's result, or callers get None.",
        "Stacked decorators apply bottom-up: the one closest to def wraps first.",
        "functools.wraps copies __name__, __doc__ and friends so debugging and introspection still work.",
        "Built-in examples: @functools.lru_cache, @property, @staticmethod, @classmethod, @dataclass.",
      ],
      tip: "Be ready to write a decorator from scratch on a whiteboard, including one that takes arguments (three nested functions).",
    },
  ],

  questions: [
    {
      id: "d3-01",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-args",
      prompt: "What does this print?",
      code: py`
        def f(a, *args, b=2, **kwargs):
            print(a, args, b, kwargs)

        f(1, 2, 3, c=4)
      `,
      codeLang: "python",
      options: ["`1 (2, 3) 2 {'c': 4}`", "`1 [2, 3] 2 {'c': 4}`", "`1 (2,) 3 {'c': 4}`", "`TypeError`"],
      answer: [0],
      explanation: "Extra positional arguments go into the tuple `args`. `b` comes after `*args`, so it's keyword-only and keeps its default. Unknown keywords land in the dict `kwargs`.",
    },
    {
      id: "d3-02",
      domain: "d3",
      level: "junior",
      lesson: "d3-args",
      prompt: "What happens?",
      code: py`
        def area(w, h, *, unit="cm"):
            return f"{w * h}{unit}"

        print(area(2, 3, "m"))
      `,
      codeLang: "python",
      options: ["`TypeError`: too many positional arguments", "`6m`", "`6cm`", "`23m`"],
      answer: [0],
      explanation: "The bare `*` makes `unit` keyword-only. Passing a third positional argument raises `TypeError: area() takes 2 positional arguments but 3 were given`. Call `area(2, 3, unit=\"m\")`.",
    },
    {
      id: "d3-03",
      domain: "d3",
      level: "junior",
      lesson: "d3-args",
      prompt: "What does this print?",
      code: py`
        def add(x, y, z):
            return x + y + z

        nums = [1, 2]
        opts = {"z": 10}
        print(add(*nums, **opts))
      `,
      codeLang: "python",
      options: ["`13`", "`3`", "`TypeError`", "`[1, 2, 10]`"],
      answer: [0],
      explanation: "`*nums` unpacks to `x=1, y=2` and `**opts` unpacks to `z=10`, so the result is 13.",
    },
    {
      id: "d3-04",
      domain: "d3",
      level: "junior",
      lesson: "d3-args",
      type: "match",
      prompt: "Match each piece of signature syntax to its meaning.",
      pairs: [
        ["`*args`", "Extra positional arguments, collected into a tuple"],
        ["`**kwargs`", "Extra keyword arguments, collected into a dict"],
        ["A bare `*`", "Every parameter after it is keyword-only"],
        ["`/`", "Every parameter before it is positional-only"],
      ],
      explanation: "The names `args` and `kwargs` are conventions; the stars do the work. `/` (3.8+) is common in built-ins like `len(obj, /)`.",
    },
    {
      id: "d3-05",
      domain: "d3",
      level: "junior",
      lesson: "d3-args",
      prompt: "What does this print?",
      code: py`
        def double(x: int) -> int:
            return x * 2

        print(double("ab"))
      `,
      codeLang: "python",
      options: ["`abab`", "`TypeError`: expected int", "`0`", "`None`"],
      answer: [0],
      explanation: "Annotations aren't enforced at runtime. `\"ab\" * 2` is `\"abab\"`. A static checker such as mypy or pyright would flag the call.",
    },
    {
      id: "d3-06",
      domain: "d3",
      level: "junior",
      lesson: "d3-args",
      prompt: "Which are valid type hints in modern Python (3.10+)? (Choose two.)",
      options: ["`list[int]`", "`int | None`", "`List<int>`", "`int or None`", "`Optional<str>`"],
      answer: [0, 1],
      explanation: "Built-in generics like `list[int]` work since 3.9, and the `X | Y` union syntax since 3.10. Angle brackets are Java/TypeScript syntax; `int or None` is just a boolean expression.",
    },
    {
      id: "d3-07",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-defaults",
      prompt: "What does this print?",
      code: py`
        def add_item(item, bucket=[]):
            bucket.append(item)
            return bucket

        print(add_item(1))
        print(add_item(2))
      `,
      codeLang: "python",
      options: ["`[1]` then `[1, 2]`", "`[1]` then `[2]`", "`[1, 2]` then `[1, 2]`", "`None` then `None`"],
      answer: [0],
      explanation: "The default list is created once when `def` runs and reused by every call that omits `bucket`, so it keeps growing.",
    },
    {
      id: "d3-08",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-defaults",
      type: "lines",
      prompt: "Every new order gets one more napkin than the last. Tap the line that causes it.",
      code: py`
        def make_order(item, extras=[]):
            extras.append("napkin")
            return {"item": item, "extras": extras}

        a = make_order("tea")
        b = make_order("cake")
        print(b["extras"])  # ['napkin', 'napkin']
      `,
      codeLang: "python",
      answer: [1],
      explanation: "The mutable default `extras=[]` is shared across calls. Use `extras=None` and `if extras is None: extras = []` inside the function.",
    },
    {
      id: "d3-09",
      domain: "d3",
      level: "junior",
      lesson: "d3-defaults",
      type: "order",
      prompt: "Arrange the lines of the safe version of `add_item` (indentation omitted).",
      items: ["`def add_item(item, bucket=None):`", "`if bucket is None:`", "`bucket = []`", "`bucket.append(item)`", "`return bucket`"],
      explanation: "The `None` sentinel means a fresh list is created on every call that doesn't pass one, while callers can still pass their own list.",
    },
    {
      id: "d3-10",
      domain: "d3",
      level: "senior",
      lesson: "d3-defaults",
      prompt: "What does this print?",
      code: py`
        x = 10
        def show(value=x):
            print(value)

        x = 20
        show()
      `,
      codeLang: "python",
      options: ["`10`", "`20`", "`None`", "`NameError`"],
      answer: [0],
      explanation: "Default values are evaluated when the `def` statement runs. At that moment `x` was 10, and rebinding `x` later doesn't change the stored default.",
    },
    {
      id: "d3-11",
      domain: "d3",
      level: "junior",
      lesson: "d3-scope",
      prompt: "What does this print?",
      code: py`
        x = "global"
        def outer():
            x = "enclosing"
            def inner():
                print(x)
            inner()

        outer()
      `,
      codeLang: "python",
      options: ["`enclosing`", "`global`", "`NameError`", "`UnboundLocalError`"],
      answer: [0],
      explanation: "`inner` has no local `x`, so lookup goes outward: the Enclosing scope (`outer`) has one, so it's found before Global.",
    },
    {
      id: "d3-12",
      domain: "d3",
      level: "senior",
      lesson: "d3-scope",
      type: "lines",
      prompt: "Tap the line that raises `UnboundLocalError`.",
      code: py`
        count = 0

        def increment():
            count += 1
            return count

        increment()
      `,
      codeLang: "python",
      answer: [4],
      explanation:
        "Because `increment` assigns to `count`, the compiler treats `count` as local throughout the function. `count += 1` reads that local before it has a value. Add `global count` (or better, pass and return the value).",
    },
    {
      id: "d3-13",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-scope",
      prompt: "What does this print?",
      code: py`
        def make_counter():
            n = 0
            def inc():
                nonlocal n
                n += 1
                return n
            return inc

        c = make_counter()
        c(); c()
        print(c())
      `,
      codeLang: "python",
      options: ["`3`", "`1`", "`0`", "`UnboundLocalError`"],
      answer: [0],
      explanation: "The closure `inc` keeps `n` alive after `make_counter` returns. `nonlocal` lets it rebind `n`, so each call increments the same variable: 1, 2, 3.",
    },
    {
      id: "d3-14",
      domain: "d3",
      level: "senior",
      lesson: "d3-scope",
      prompt: "What does this print?",
      code: py`
        funcs = [lambda: i for i in range(3)]
        print([f() for f in funcs])
      `,
      codeLang: "python",
      options: ["`[2, 2, 2]`", "`[0, 1, 2]`", "`[0, 0, 0]`", "`NameError`"],
      answer: [0],
      explanation: "Closures look up `i` when called, not when created (late binding). By the time the lambdas run, the loop has finished with `i == 2`.",
    },
    {
      id: "d3-15",
      domain: "d3",
      level: "senior",
      lesson: "d3-scope",
      prompt: "Which change makes this print `[0, 1, 2]`?",
      code: py`
        funcs = [lambda: i for i in range(3)]
        print([f() for f in funcs])
      `,
      codeLang: "python",
      options: [
        "Write `lambda i=i: i` so each lambda stores the current value as a default",
        "Write `lambda: (i)` with brackets",
        "Add `global i` before the comprehension",
        "Use `list(range(3))` instead of `range(3)`",
      ],
      answer: [0],
      explanation: "Defaults are evaluated at definition time, so `i=i` freezes each iteration's value. `functools.partial` is another fix.",
    },
    {
      id: "d3-16",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-scope",
      prompt: "Which statements about `global` and `nonlocal` are true? (Choose two.)",
      options: [
        "`nonlocal` rebinds a name in the nearest enclosing function scope",
        "`global` lets a function rebind a module-level name",
        "`nonlocal` can create a brand-new module-level variable",
        "You need `global` to call `.append()` on a module-level list",
        "`global` makes a variable visible in every module",
      ],
      answer: [0, 1],
      explanation: "Both are only needed to rebind a name. Mutating an object (`items.append`) never needs them. \"Global\" in Python means module-level, not program-wide.",
    },
    {
      id: "d3-17",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-decorators",
      prompt: "What does this print?",
      code: py`
        def shout(fn):
            def wrapper(*args):
                return fn(*args).upper() + "!"
            return wrapper

        @shout
        def greet(name):
            return f"hi {name}"

        print(greet("ada"))
      `,
      codeLang: "python",
      options: ["`HI ADA!`", "`hi ada`", "`hi ada!`", "`<function wrapper>`"],
      answer: [0],
      explanation: "`@shout` replaces `greet` with `wrapper`. Calling it calls the original, uppercases the result, and adds `!`.",
    },
    {
      id: "d3-18",
      domain: "d3",
      level: "senior",
      lesson: "d3-decorators",
      prompt: "What does this print?",
      code: py`
        def a(fn):
            return lambda: "a(" + fn() + ")"

        def b(fn):
            return lambda: "b(" + fn() + ")"

        @a
        @b
        def f():
            return "f"

        print(f())
      `,
      codeLang: "python",
      options: ["`a(b(f))`", "`b(a(f))`", "`f`", "`a(f)b(f)`"],
      answer: [0],
      explanation: "Decorators apply bottom-up: `f = a(b(f))`. The outer `a` wrapper runs first at call time and wraps the result of `b`'s wrapper.",
    },
    {
      id: "d3-19",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-decorators",
      type: "lines",
      prompt: "`add(2, 3)` prints `calling add` and then `None`. Tap the buggy line.",
      code: py`
        import functools

        def log_calls(fn):
            @functools.wraps(fn)
            def wrapper(*args, **kwargs):
                print("calling", fn.__name__)
                fn(*args, **kwargs)
            return wrapper

        @log_calls
        def add(a, b):
            return a + b

        print(add(2, 3))
      `,
      codeLang: "python",
      answer: [7],
      explanation: "The wrapper calls the original but throws away its result, so it implicitly returns `None`. It should be `return fn(*args, **kwargs)`.",
    },
    {
      id: "d3-20",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-decorators",
      prompt: "Why do decorators usually apply `@functools.wraps(fn)` to their wrapper?",
      options: [
        "It copies `fn`'s `__name__`, `__doc__`, and other metadata onto the wrapper",
        "It makes the wrapper run faster by caching results",
        "It's required, or the decorator raises `TypeError`",
        "It makes the wrapper thread-safe",
      ],
      answer: [0],
      explanation: "Without `wraps`, the decorated function reports its name as `wrapper` and loses its docstring, which confuses logs, debuggers, and help(). It also sets `__wrapped__` to the original.",
    },
    {
      id: "d3-21",
      domain: "d3",
      level: "staff",
      lesson: "d3-decorators",
      prompt: "Dozens of network calls across several services need retries with exponential backoff. What's the most maintainable approach?",
      options: [
        "One shared, tested decorator such as `@retry(attempts=3, backoff=2.0, on=(TimeoutError,))` applied to idempotent calls",
        "Copy a retry loop into each function so every team can tune it",
        "Wrap the whole program in `while True: try: main()`",
        "Retry forever on any exception with a bare `except:`",
      ],
      answer: [0],
      explanation:
        "A decorator centralizes the policy (attempt cap, backoff, jitter, which exceptions) so it's tested once and changed in one place. Retry only idempotent operations and only transient errors; retrying everything hides bugs and can hammer a failing dependency.",
    },
    {
      id: "d3-22",
      domain: "d3",
      level: "staff",
      lesson: "d3-args",
      prompt: "You're designing a new public `connect()` function for a shared library. Which signature best lets you add options later without breaking callers?",
      options: [
        "`def connect(host, port, *, timeout=10, retries=3, ssl=True)`",
        "`def connect(host, port, timeout, retries, ssl)`",
        "`def connect(*args)` and read options by position",
        "`def connect(**kwargs)` with no named parameters",
      ],
      answer: [0],
      explanation:
        "Keyword-only options with defaults keep call sites readable (`ssl=False`), let you add or reorder options safely, and still give IDEs and type checkers real parameter names. Positional options lock you into their order forever.",
    },
    {
      id: "d3-23",
      domain: "d3",
      level: "staff",
      lesson: "d3-scope",
      prompt: "A web app stores the current user in a module-level variable that each request handler rebinds with `global current_user`. Under a threaded (or async) server, users occasionally see each other's data. What's the right fix?",
      options: [
        "Pass the user explicitly, or keep it in request-scoped context such as a `contextvars.ContextVar` or the framework's request object",
        "Declare `global current_user` in more functions",
        "Switch `global` to `nonlocal`",
        "Make `current_user` a list and append each request's user",
      ],
      answer: [0],
      explanation:
        "A module global is shared by every concurrent request, so one handler can overwrite another's value mid-flight. `contextvars` gives each thread or asyncio task its own value; explicit parameters are clearer still.",
    },
    {
      id: "d3-24",
      domain: "d3",
      level: "staff",
      lesson: "d3-decorators",
      prompt: "A teammate adds `@functools.cache` to `price(product_id, day)` in a long-running service that sees millions of distinct argument pairs. What's the main risk?",
      options: [
        "The cache is unbounded, so memory grows with every new argument pair (and results never expire); use `lru_cache(maxsize=...)` or an external cache with a TTL",
        "`functools.cache` only works on functions that take no arguments",
        "Cached results are automatically discarded after 60 seconds",
        "It makes the function impossible to call from more than one thread",
      ],
      answer: [0],
      explanation:
        "`cache` is `lru_cache(maxsize=None)`: it keeps every result forever. In a server that's a slow memory leak plus stale prices. Bound it, add expiry, or use a shared cache like Redis when several processes need the same data.",
    },
  ],

  cards: [
    { id: "c3-wraps", domain: "d3", kind: "service", term: "functools.wraps", definition: "Decorator for wrappers that copies the wrapped function's name, docstring, and metadata." },
    { id: "c3-lru", domain: "d3", kind: "service", term: "functools.lru_cache", definition: "Memoizes a function's results by its (hashable) arguments. functools.cache is the unbounded version." },
    { id: "c3-partial", domain: "d3", kind: "service", term: "functools.partial", definition: "Creates a new callable with some arguments of a function pre-filled." },
    { id: "c3-lambda", domain: "d3", kind: "service", term: "lambda", definition: "An anonymous single-expression function, e.g. key=lambda p: p.age." },
    { id: "c3-args", domain: "d3", kind: "concept", term: "*args / **kwargs", definition: "Collect extra positional arguments into a tuple and extra keyword arguments into a dict." },
    { id: "c3-kwonly", domain: "d3", kind: "concept", term: "Keyword-only parameter", definition: "A parameter after * or *args; callers must pass it by name." },
    { id: "c3-default", domain: "d3", kind: "concept", term: "Mutable default trap", definition: "Defaults are evaluated once at def time, so a default list or dict is shared across calls. Use None." },
    { id: "c3-legb", domain: "d3", kind: "concept", term: "LEGB", definition: "Name lookup order: Local, Enclosing, Global, Built-in." },
    { id: "c3-closure", domain: "d3", kind: "concept", term: "Closure", definition: "An inner function that remembers variables from the enclosing scope after that scope returns." },
    { id: "c3-late", domain: "d3", kind: "concept", term: "Late binding", definition: "Closures look up captured variables when called, so loop-made lambdas all see the final value." },
    { id: "c3-unbound", domain: "d3", kind: "concept", term: "UnboundLocalError", definition: "Reading a name that is local to the function (because it's assigned somewhere in it) before it's assigned." },
    { id: "c3-decorator", domain: "d3", kind: "concept", term: "Decorator", definition: "A callable that takes a function and returns a replacement; @deco above def means f = deco(f)." },
    { id: "c3-hints", domain: "d3", kind: "concept", term: "Type hints", definition: "Annotations like x: int and -> str, checked by tools such as mypy, not enforced at runtime." },
  ],
});
