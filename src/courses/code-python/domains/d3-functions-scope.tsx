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
    summary:
      "How functions take arguments, why a list default is a trap, how Python finds a name (LEGB), closures and late binding, decorators, and type hints.",
  },

  tasks: [
    {
      id: "3.1",
      title: "Parameters, arguments, and type hints",
      covers: ["Positional, keyword, *args, **kwargs", "Keyword-only (*) and positional-only (/) parameters", "Unpacking with * and **", "Type hints aren't checked when the code runs"],
    },
    { id: "3.2", title: "Default arguments", covers: ["Defaults are worked out once, when the function is defined", "The mutable default trap and the None sentinel"] },
    { id: "3.3", title: "Scope and closures", covers: ["LEGB lookup", "global and nonlocal", "UnboundLocalError", "Closures and late binding in loops"] },
    { id: "3.4", title: "Decorators", covers: ["Functions are objects too", "Writing a decorator with *args and **kwargs", "Stacking order", "functools.wraps"] },
  ],

  lessons: [
    {
      id: "d3-start-functions",
      level: "beginner",
      task: "3.1",
      title: "Functions are reusable recipes",
      check: ["py-b3-01", "py-b3-02"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="python"
            code={py`
              def greet(name):          # define it once
                  return "Hi " + name

              print(greet("Ana"))       # Hi Ana
              print(greet("Ben"))       # Hi Ben
            `}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "📥", label: "Argument goes in", sub: "\"Ana\"" },
              { icon: "🍳", label: "Function body runs", sub: "\"Hi \" + name" },
              { icon: "📤", label: "Result comes out", sub: "\"Hi Ana\"" },
            ]}
          />
        </div>
      ),
      points: [
        "A **function** is a named set of steps you can run whenever you like. It's like a recipe card: write it once, cook from it many times.",
        "You create one with `def`, a name, brackets and a colon. The indented lines below are the function's body.",
        "Names inside the brackets in the `def` line are **parameters**. They're placeholders for the values you'll pass in.",
        "When you call `greet(\"Ana\")`, the value `\"Ana\"` is the **argument**. Inside the function, `name` points at it.",
      ],
      tip: "Defining a function doesn't run it. Nothing happens until you call it by writing its name with brackets, like `greet(\"Ana\")`.",
    },
    {
      id: "d3-start-return",
      level: "beginner",
      task: "3.1",
      title: "return hands a value back",
      check: ["py-b3-03", "py-b3-04"],
      visual: (
        <CodeCompare
          lang="python"
          left={{
            title: "return: you can use the result",
            code: py`
              def add(a, b):
                  return a + b

              result = add(2, 3)
              print(result * 10)   # 50
            `,
          }}
          right={{
            title: "print: it only shows it",
            code: py`
              def add(a, b):
                  print(a + b)

              result = add(2, 3)   # shows 5
              print(result)        # None
            `,
          }}
        />
      ),
      points: [
        "`return` sends a value back to whoever called the function, so they can store it or use it in more maths.",
        "`print` only shows a value on the screen. The caller doesn't get anything they can work with.",
        "A function with no `return` hands back `None`, Python's way of saying \"nothing here\".",
        "As soon as `return` runs, the function stops. Any lines after it in the same block are skipped.",
      ],
      tip: "A handy test: if you'd want to save the answer in a variable, the function should `return` it, not `print` it.",
    },
    {
      id: "d3-start-local",
      level: "beginner",
      task: "3.3",
      title: "What happens in a function stays there",
      check: ["py-b3-05", "py-b3-06"],
      visual: (
        <Tiles
          tiles={[
            { icon: "🏠", title: "Inside the function", text: "Names you create here are local. They vanish when the function finishes.", color: "#f59e0b" },
            { icon: "🌍", title: "Outside the function", text: "Names at the top level of the file are global. Functions can read them.", color: "#38bdf8" },
          ]}
        />
      ),
      points: [
        "A variable you create inside a function is **local**: it only exists while that function runs.",
        "Think of a hotel room. What you leave in the room is cleared out when you check out, and other guests never see it.",
        "If you try to use a local name from outside the function, Python raises `NameError` because, out there, the name doesn't exist.",
        "Assigning to a name inside a function makes a new local one, even if a name like it exists outside. The outside one is left alone.",
      ],
      tip: "Want a value out of a function? Don't reach in for its variables. Have the function `return` the value instead.",
    },
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
              { icon: "📍", title: "/", text: "Parameters before it can only be passed by position.", color: "#f59e0b" },
              { icon: "🧺", title: "*args", text: "Collects extra positional arguments into a tuple.", color: "#f59e0b" },
              { icon: "🔑", title: "* (bare)", text: "Parameters after it must be passed by name.", color: "#f59e0b" },
              { icon: "🗃️", title: "**kwargs", text: "Collects extra keyword arguments into a dict.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "Parameters always come in this order: positional-only, then `/`, then normal ones, then `*args` (or a bare `*`), then keyword-only, then `**kwargs`.",
        "When you call a function, `*` unpacks a list into positional arguments and `**` unpacks a dict into keyword arguments.",
        "**Type hints** like `x: int`, `-> str`, `list[int]` or `int | None` are notes for tools such as mypy and your editor. Python itself doesn't check them when the code runs.",
      ],
      tip: "When you design an API in an interview, make on/off options keyword-only, as in `def fetch(url, *, timeout=5)`. Calls then read clearly, like `fetch(url, timeout=10)`.",
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
            title: "Fix: use None as a placeholder",
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
        "Default values are worked out once, when the `def` line runs, and stored on the function (in `f.__defaults__`).",
        "So a changeable default, like a list, dict or set, is the same object for every call that doesn't pass that argument.",
        "The fix is to use `None` as the default and create the new object inside the function.",
        "The same rule means `default=x` captures the value `x` had when the function was defined, not when it's called.",
      ],
      tip: "This is the most asked Python gotcha. Explain why it happens (the default is created once), not just the fix.",
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
              title: "Late binding: they all see the final i",
              code: py`
                funcs = [lambda: i for i in range(3)]
                [f() for f in funcs]   # [2, 2, 2]
              `,
            }}
            right={{
              title: "Capture it now with a default",
              code: py`
                funcs = [lambda i=i: i for i in range(3)]
                [f() for f in funcs]   # [0, 1, 2]
              `,
            }}
          />
        </div>
      ),
      points: [
        "Python looks for a name in four places, in order: Local, Enclosing, Global, Built-in (**LEGB**). If it isn't in any of them, you get `NameError`.",
        "If a function assigns to a name anywhere in its body, that name is local for the whole function. Reading it before the assignment raises `UnboundLocalError`.",
        "`global` lets a function reassign a name at module level. `nonlocal` lets it reassign a name in the nearest enclosing function.",
        "A **closure** is an inner function that remembers variables from the function around it. It remembers the variable itself, not its value, so it reads the value at the moment it runs.",
      ],
      tip: "Changing a global list, as in `items.append(x)`, needs no `global` statement. You only need `global` to point the name at something new, as in `items = []`.",
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
              title: "@ is a short way to reassign",
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
              { icon: "📞", label: "Caller", sub: "Calls work(…)" },
              { icon: "🎁", label: "wrapper", sub: "Runs its code before" },
              { icon: "⚙️", label: "Original function", sub: "Returns a value" },
              { icon: "🎁", label: "wrapper", sub: "Runs its code after and passes the value back" },
            ]}
          />
        </div>
      ),
      points: [
        "A **decorator** is a function that takes a function and returns a replacement. The replacement is usually a closure that calls the original.",
        "The wrapper should accept `*args, **kwargs` and return the original's result. If it forgets to return, callers get `None`.",
        "Stacked decorators apply from the bottom up. The one nearest the `def` wraps the function first.",
        "`functools.wraps` copies the original's `__name__`, `__doc__` and similar details onto the wrapper, so logs and debuggers still show the right name.",
        "You'll see built-in ones everywhere: `@functools.lru_cache`, `@property`, `@staticmethod`, `@classmethod` and `@dataclass`.",
      ],
      tip: "Be ready to write a decorator from scratch on a whiteboard, including one that takes its own arguments. That version needs three nested functions.",
    },
  ],

  questions: [
    // ───────────── Start here ─────────────
    {
      id: "py-b3-01",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-functions",
      type: "output",
      prompt: "What does this print?",
      code: py`
        def greet(name):
            return "Hi " + name

        print(greet("Ana"))
      `,
      codeLang: "python",
      answers: ["Hi Ana"],
      explanation:
        "Calling `greet(\"Ana\")` runs the body with `name` pointing at `\"Ana\"`. It joins `\"Hi \"` and `\"Ana\"` and returns `\"Hi Ana\"`, which `print` then shows.",
    },
    {
      id: "py-b3-02",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-functions",
      prompt: "In `def greet(name):`, what is `name`?",
      options: [
        "A parameter: a placeholder for the value passed in when the function is called",
        "The value the function returns",
        "The name of the file that the function lives in, saved on the disk",
        "A built-in Python keyword",
      ],
      answer: [0],
      explanation:
        "Names in the brackets of a `def` line are parameters. Each time you call the function, the parameter points at whatever argument you passed, like `\"Ana\"` in `greet(\"Ana\")`.",
    },
    {
      id: "py-b3-03",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-return",
      type: "output",
      prompt: "What does this print?",
      code: py`
        def add(a, b):
            return a + b

        result = add(2, 3)
        print(result * 10)
      `,
      codeLang: "python",
      answers: ["50"],
      explanation:
        "`add(2, 3)` returns 5, and `result` points at it. Because the value was returned, you can keep using it: `result * 10` is 50.",
    },
    {
      id: "py-b3-04",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-return",
      prompt: "What does a function give back if it has no `return` line?",
      options: ["`None`", "`0`", "The last value it printed", "An error is raised"],
      answer: [0],
      explanation:
        "Every function hands something back. If you never write `return`, Python returns `None` for you. That's why a function that only prints its answer leaves you with `None` when you try to store the result.",
    },
    {
      id: "py-b3-05",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-local",
      prompt: "What happens when this runs?",
      code: py`
        def make_secret():
            secret = 42

        make_secret()
        print(secret)
      `,
      codeLang: "python",
      options: [
        "`NameError`, because `secret` only existed inside the function",
        "It prints `42`",
        "It prints `None`",
        "It prints nothing at all, since `secret` was deleted when the function ended",
      ],
      answer: [0],
      explanation:
        "`secret` is a local variable, so it disappears when `make_secret` finishes. Out at the top level there's no such name, and Python raises `NameError: name 'secret' is not defined`. Returning the value is the way to get it out.",
    },
    {
      id: "py-b3-06",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-local",
      type: "output",
      prompt: "What does this print?",
      code: py`
        x = 1

        def f():
            x = 99
            return x

        print(f(), x)
      `,
      codeLang: "python",
      answers: ["99 1"],
      explanation:
        "Inside `f`, `x = 99` creates a new local `x`, separate from the one outside. The function returns its own 99, and the outer `x` is still 1. `print` shows both, separated by a space.",
    },
    // ───────────── Interview questions ─────────────
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
      explanation:
        "Extra positional arguments are collected into the tuple `args`. `b` comes after `*args`, so it can only be set by name, and it keeps its default of 2. Keywords the function doesn't name, like `c`, go into the dict `kwargs`.",
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
      options: ["`TypeError`: too many positional arguments", "`6m`", "`6cm`", "`23m`, since Python joins the extra arguments"],
      answer: [0],
      explanation:
        "The bare `*` means `unit` must be passed by name. A third positional argument raises `TypeError: area() takes 2 positional arguments but 3 were given`. The working call is `area(2, 3, unit=\"m\")`.",
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
      explanation: "`*nums` unpacks into `x=1, y=2`, and `**opts` unpacks into `z=10`. Adding them gives 13.",
    },
    {
      id: "d3-04",
      domain: "d3",
      level: "junior",
      lesson: "d3-args",
      type: "match",
      prompt: "Match each piece of signature syntax to what it means.",
      pairs: [
        ["`*args`", "Extra positional arguments, collected into a tuple"],
        ["`**kwargs`", "Extra keyword arguments, collected into a dict"],
        ["A bare `*`", "Every parameter after it is keyword-only"],
        ["`/`", "Every parameter before it is positional-only"],
      ],
      explanation:
        "The names `args` and `kwargs` are only a habit; the stars do the real work. You'll often see `/` (Python 3.8 and later) in built-ins like `len(obj, /)`.",
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
      explanation:
        "Type hints aren't checked when the code runs. `\"ab\" * 2` repeats the string, giving `\"abab\"`. A static checker such as mypy or pyright would flag this call before you ran it.",
    },
    {
      id: "d3-06",
      domain: "d3",
      level: "junior",
      lesson: "d3-args",
      prompt: "Which are valid type hints in modern Python (3.10 and later)? (Choose two.)",
      options: ["`list[int]`", "`int | None`", "`List<int>`", "`int or None`", "`Optional<str>`"],
      answer: [0, 1],
      explanation:
        "Built-in generics like `list[int]` work from Python 3.9, and the `X | Y` union syntax from 3.10. Angle brackets are Java and TypeScript syntax. `int or None` is just an ordinary `or` expression, not a type.",
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
      explanation:
        "The default list is created once, when `def` runs. Every call that leaves out `bucket` reuses that same list, so it keeps growing.",
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
      explanation:
        "The default `extras=[]` is one list shared by every call. Use `extras=None`, then `if extras is None: extras = []` inside the function.",
    },
    {
      id: "d3-09",
      domain: "d3",
      level: "junior",
      lesson: "d3-defaults",
      type: "order",
      prompt: "Put the lines of the safe version of `add_item` in order (indentation left out).",
      items: ["`def add_item(item, bucket=None):`", "`if bucket is None:`", "`bucket = []`", "`bucket.append(item)`", "`return bucket`"],
      explanation:
        "Using `None` as a placeholder means each call that doesn't pass a list gets a fresh one. Callers can still pass their own list if they want to.",
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
      explanation:
        "Default values are worked out when the `def` line runs. At that moment `x` was 10. Pointing `x` at 20 later doesn't change the default that was already stored.",
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
      explanation:
        "`inner` has no `x` of its own, so Python looks outward. The enclosing function `outer` has one, and that's found before the global `x`.",
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
        "Because `increment` assigns to `count`, Python treats `count` as local for the whole function. `count += 1` tries to read that local before it has a value. Adding `global count` fixes it, though passing the value in and returning it is cleaner.",
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
      explanation:
        "The closure `inc` keeps `n` alive after `make_counter` has returned. `nonlocal` lets it update that `n`, so every call adds to the same variable: 1, then 2, then 3.",
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
      explanation:
        "Each lambda looks up `i` when it's called, not when it's created. This is called **late binding**. By the time the lambdas run, the loop has finished and `i` is 2.",
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
        "Use `list(range(3))` instead of `range(3)` in the `for` loop header",
      ],
      answer: [0],
      explanation:
        "Defaults are worked out when each lambda is defined, so `i=i` saves that round's value. `functools.partial` is another way to fix it.",
    },
    {
      id: "d3-16",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-scope",
      prompt: "Which statements about `global` and `nonlocal` are true? (Choose two.)",
      options: [
        "`nonlocal` reassigns a name in the nearest enclosing function scope",
        "`global` lets a function reassign a module-level name",
        "`nonlocal` can create a brand-new module-level variable",
        "You need `global` to call `.append()` on a module-level list",
        "`global` makes a variable visible in every module",
      ],
      answer: [0, 1],
      explanation:
        "You only need either one to point a name at something new. Changing an object, as in `items.append(x)`, never needs them. And \"global\" in Python means the module's top level, not the whole program.",
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
      explanation:
        "`@shout` swaps `greet` for `wrapper`. Calling it runs the original, turns the result into capitals, and adds `!`.",
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
      explanation:
        "Decorators apply from the bottom up, so `f` becomes `a(b(f))`. When you call it, `a`'s wrapper runs on the outside and wraps whatever `b`'s wrapper returns.",
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
      explanation:
        "The wrapper calls the original but throws its result away, so the wrapper ends up returning `None`. The line should be `return fn(*args, **kwargs)`.",
    },
    {
      id: "d3-20",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-decorators",
      prompt: "Why do decorators usually put `@functools.wraps(fn)` on their wrapper?",
      options: [
        "It copies `fn`'s `__name__`, `__doc__`, and other details onto the wrapper",
        "It makes the wrapper run faster by caching results",
        "It's required, or else the decorator raises a `TypeError` on use",
        "It makes the wrapper thread-safe",
      ],
      answer: [0],
      explanation:
        "Without `wraps`, the decorated function calls itself `wrapper` and loses its docstring, which muddles logs, debuggers and `help()`. It also sets `__wrapped__` so you can still reach the original.",
    },
    {
      id: "d3-21",
      domain: "d3",
      level: "staff",
      lesson: "d3-decorators",
      prompt: "Dozens of network calls across several services need retries with exponential backoff. What's the easiest approach to maintain?",
      options: [
        "One shared, tested decorator such as `@retry(attempts=3, backoff=2.0, on=(TimeoutError,))` applied to idempotent calls",
        "Copy a retry loop into each function so that every team can tune the attempts and delays for its own calls",
        "Wrap the whole program in `while True: try: main()`",
        "Retry forever on any exception with a bare `except:`",
      ],
      answer: [0],
      explanation:
        "A decorator keeps the retry rules (how many attempts, how long to wait, which errors) in one place, so they're tested once and changed once. Only retry calls that are safe to repeat, and only on temporary errors. Retrying everything hides bugs and can pile load onto a service that's already failing.",
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
        "`def connect(*args)` and read the options by position",
        "`def connect(**kwargs)` with no named parameters",
      ],
      answer: [0],
      explanation:
        "Options that must be passed by name, with defaults, keep calls readable (`ssl=False`). You can add or reorder them safely, and editors and type checkers still see real parameter names. Positional options lock you into their order forever.",
    },
    {
      id: "d3-23",
      domain: "d3",
      level: "staff",
      lesson: "d3-scope",
      prompt: "A web app keeps the current user in a module-level variable that each request handler reassigns with `global current_user`. On a threaded (or async) server, users sometimes see each other's data. What's the right fix?",
      options: [
        "Pass the user explicitly, or keep it in request-scoped context such as a `contextvars.ContextVar` or the framework's request object",
        "Declare `global current_user` in more functions",
        "Switch `global` to `nonlocal`",
        "Make `current_user` a list and append each request's user to it, then read the last item in each handler so every request sees its own user",
      ],
      answer: [0],
      explanation:
        "A module-level variable is shared by every request running at the same time, so one handler can overwrite another's value halfway through. `contextvars` gives each thread or asyncio task its own copy. Passing the user as a parameter is clearer still.",
    },
    {
      id: "d3-24",
      domain: "d3",
      level: "staff",
      lesson: "d3-decorators",
      prompt: "A teammate adds `@functools.cache` to `price(product_id, day)` in a long-running service that sees millions of different argument pairs. What's the main risk?",
      options: [
        "The cache has no size limit, so memory grows with every new argument pair (and results never expire); use `lru_cache(maxsize=...)` or an external cache with a TTL",
        "`functools.cache` only works on functions that take no arguments",
        "Cached results are automatically discarded after 60 seconds",
        "It makes the function impossible to call from more than one thread at a time, because the cache takes a global lock that's held for the whole call, so other threads block until it returns",
      ],
      answer: [0],
      explanation:
        "`cache` is the same as `lru_cache(maxsize=None)`: it keeps every result forever. In a server, that's a slow memory leak, and prices go stale too. Give it a size limit, add expiry, or use a shared cache like Redis if several processes need the same data.",
    },
  ],

  cards: [
    { id: "c3-wraps", domain: "d3", kind: "service", term: "functools.wraps", definition: "A decorator you put on a wrapper so it keeps the original function's name, docstring and other details." },
    { id: "c3-lru", domain: "d3", kind: "service", term: "functools.lru_cache", definition: "Remembers a function's results for each set of (hashable) arguments, so repeat calls are instant. functools.cache is the version with no size limit." },
    { id: "c3-partial", domain: "d3", kind: "service", term: "functools.partial", definition: "Makes a new function from an existing one with some of its arguments already filled in." },
    { id: "c3-lambda", domain: "d3", kind: "service", term: "lambda", definition: "A tiny unnamed function made of one expression. For example, key=lambda p: p.age sorts people by age." },
    { id: "c3-args", domain: "d3", kind: "concept", term: "*args and **kwargs", definition: "*args collects extra positional arguments into a tuple. **kwargs collects extra keyword arguments into a dict." },
    { id: "c3-kwonly", domain: "d3", kind: "concept", term: "Keyword-only parameter", definition: "A parameter that comes after * or *args. Callers have to pass it by name." },
    { id: "c3-default", domain: "d3", kind: "concept", term: "Mutable default trap", definition: "Defaults are created once, when the function is defined, so a default list or dict is shared by every call. Use None instead." },
    { id: "c3-legb", domain: "d3", kind: "concept", term: "LEGB", definition: "The order Python searches for a name: Local, Enclosing, Global, then Built-in." },
    { id: "c3-closure", domain: "d3", kind: "concept", term: "Closure", definition: "An inner function that still remembers variables from the function around it, even after that outer function has returned." },
    { id: "c3-late", domain: "d3", kind: "concept", term: "Late binding", definition: "A closure reads its captured variables when it runs, not when it's made. So lambdas made in a loop all see the loop's final value." },
    { id: "c3-unbound", domain: "d3", kind: "concept", term: "UnboundLocalError", definition: "Raised when you read a name that's local to the function (because it's assigned somewhere in it) before it has been given a value." },
    { id: "c3-decorator", domain: "d3", kind: "concept", term: "Decorator", definition: "A function that takes a function and returns a replacement. Writing @deco above def f is the same as running `f = deco(f)` right after it." },
    { id: "c3-hints", domain: "d3", kind: "concept", term: "Type hints", definition: "Notes such as x: int on a parameter, or a return type after the brackets, that say what types you expect. Tools such as mypy check them, but Python doesn't when the code runs." },
  ],
});
