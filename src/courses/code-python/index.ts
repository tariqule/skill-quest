import { defineCourse } from "@/engine/define";
import d1 from "./domains/d1-data-mutability";
import d2 from "./domains/d2-iteration";
import d3 from "./domains/d3-functions-scope";
import d4 from "./domains/d4-objects-errors-concurrency";

/**
 * Python Interview Quest: the Python questions software-engineering interviews
 * actually ask, from mutability and generators to the GIL. Based on the
 * official Python 3 documentation; snippets target modern CPython 3.
 */
export default defineCourse({
  id: "code-python",
  kind: "interview",
  provider: { id: "python", name: "Python", color: "#3776ab", icon: "🐍" },
  code: "PY",
  title: "Python Interview Quest",
  shortTitle: "Python",
  tagline: "Predict the output, hunt the bug, and explain the why: mutability, generators, closures, OOP, and the GIL.",
  level: "Intermediate",
  storageKey: "course:code-python:v1",

  domains: [d1, d2, d3, d4],

  exam: {
    questions: 30,
    unscored: 0,
    minutes: 45,
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "One correct answer. Often \"what does this print?\" or \"what's the complexity?\"." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "The prompt says how many to pick. You need all of them right to score." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Arrange code lines or steps into the order that works." },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair each item with its answer. Every pair must be right." },
      { id: "lines", icon: "🐞", name: "Bug hunt", rule: "Tap the line (or lines) in the snippet that cause the bug or raise the error." },
    ],
  },

  guide: {
    source: {
      label: "Python interview syllabus, based on the official docs",
      version: "2026",
      date: "October 2026",
      url: "https://docs.python.org/3/",
    },
    facts: [
      { icon: "🎤", value: "30", label: "questions", detail: "The full mock interview: 30 mixed questions in 45 minutes, about 90 seconds each." },
      { icon: "🎯", value: "70", label: "to pass", detail: "Score 70 out of 100 on the mock. Every question counts; there are no unscored ones." },
      { icon: "🔮", value: "Predict", label: "the output", detail: "Phone screens and quizzes often show a short snippet and ask what it prints. Most traps here are classics." },
      { icon: "🐞", value: "Bug", label: "hunts", detail: "Code reviews and live-coding rounds test whether you can spot the line that's wrong and explain why." },
      { icon: "🗣️", value: "Why", label: "matters most", detail: "Interviewers usually care more about your reasoning (complexity, trade-offs, edge cases) than the one-word answer." },
      { icon: "🐍", value: "3.x", label: "modern Python", detail: "Snippets assume a current CPython 3 release. The behaviour covered has been stable for many versions." },
    ],
    candidate: {
      is: [
        "Preparing for a software-engineering, backend, data, or ML engineering interview that uses Python",
        "Comfortable writing basic Python and wants to understand why it behaves the way it does",
        "Looking to practise predict-the-output and bug-hunt questions under time pressure",
        "Reviewing the data model, scope rules, and concurrency before an on-site",
      ],
      isNot: [
        "A data-structures-and-algorithms course (no graph or dynamic-programming problems)",
        "Framework-specific (Django, FastAPI, pandas, NumPy)",
        "Packaging, virtual environments, or deployment",
        "CPython internals beyond what interviews commonly ask",
      ],
    },
    scope: {
      label: "Topics covered",
      groups: [
        { category: "Data model", icon: "🧱", services: ["Mutability", "is vs ==", "Shallow vs deep copy", "Hashability", "Slicing"] },
        { category: "Collections", icon: "📚", services: ["list", "tuple", "dict", "set", "collections.deque", "heapq", "Time complexity"] },
        { category: "Iteration", icon: "🌀", services: ["Comprehensions", "Iterators", "Generators", "yield from", "itertools"] },
        { category: "Functions", icon: "🧩", services: ["*args / **kwargs", "Keyword-only parameters", "Mutable defaults", "Closures", "Decorators", "Type hints"] },
        { category: "Scope", icon: "🎯", services: ["LEGB", "global / nonlocal", "UnboundLocalError", "Late binding"] },
        { category: "OOP", icon: "🏛️", services: ["Classes", "Dunder methods", "Inheritance", "MRO & super()", "dataclasses"] },
        { category: "Errors", icon: "🧯", services: ["try / except / else / finally", "Exception chaining", "Context managers", "contextlib"] },
        { category: "Concurrency", icon: "⚡", services: ["GIL", "threading", "multiprocessing", "asyncio", "concurrent.futures"] },
      ],
    },
    tips: [
      { icon: "✏️", tip: "For \"what does this print?\", trace line by line and draw names as arrows to objects. Most traps are about aliasing or when something is evaluated." },
      { icon: "🗣️", tip: "Think out loud. Say the complexity of what you write (\"this in-check is O(n) on a list, O(1) on a set\") without being asked." },
      { icon: "🧪", tip: "Probe edge cases before coding: empty input, one element, duplicates, n = 0, negative numbers, None." },
      { icon: "🐍", tip: "Reach for idioms: comprehensions, enumerate, zip, with, dict.get, collections.Counter. They show fluency." },
      { icon: "🧯", tip: "Name the trap when you see it: mutable default, late binding, shared class attribute, modifying a list while iterating." },
      { icon: "⚖️", tip: "For concurrency questions, first classify the work as I/O-bound or CPU-bound, then pick asyncio, threads, or processes." },
    ],
    officialPractice: { label: "The Python Tutorial (docs.python.org)", url: "https://docs.python.org/3/tutorial/" },
  },

  cheatsheet: [
    {
      title: "Mutability and copying",
      items: [
        ["Mutable", "list, dict, set, bytearray, most user classes"],
        ["Immutable", "int, float, bool, str, tuple, frozenset, bytes"],
        ["b = a", "Alias: no copy, same object"],
        ["a.copy() · list(a) · a[:]", "Shallow copy: new outer, shared inner objects"],
        ["copy.deepcopy(a)", "Recursive, fully independent copy"],
        ["is vs ==", "Same object vs equal value. Use is only for None and singletons."],
      ],
    },
    {
      title: "Complexity (average)",
      items: [
        ["list", "index O(1) · append O(1)* · pop() O(1) · insert(0)/pop(0) O(n) · in O(n)"],
        ["dict / set", "get/set/in/del O(1) average"],
        ["deque", "append/appendleft/pop/popleft O(1)"],
        ["heapq", "push/pop O(log n) · heapify O(n) · peek heap[0] O(1)"],
        ["sorted / list.sort", "O(n log n), stable (Timsort)"],
      ],
    },
    {
      title: "Iteration",
      items: [
        ["Comprehension", "[expr for x in it if cond]; leftmost for is the outer loop"],
        ["Generator expression", "(expr for x in it): lazy, single-pass"],
        ["Iterator protocol", "iter() → next() … StopIteration"],
        ["Generator", "Function with yield; calling it runs nothing until next()"],
        ["for / else", "else runs only when the loop didn't break"],
      ],
    },
    {
      title: "Functions and scope",
      items: [
        ["Signature order", "pos_only, /, normal, *args, kw_only, **kwargs"],
        ["Defaults", "Evaluated once at def time → use None for mutable defaults"],
        ["LEGB", "Local → Enclosing → Global → Built-in"],
        ["global / nonlocal", "Needed only to rebind a name, not to mutate an object"],
        ["Late binding", "lambda: i sees the final i; fix with lambda i=i: i"],
        ["Decorator", "@d above def f means f = d(f); stack applies bottom-up"],
      ],
    },
    {
      title: "Classes and errors",
      items: [
        ["__repr__ / __str__", "Developer view (also used inside containers) / print view"],
        ["__eq__ without __hash__", "Instances become unhashable"],
        ["super()", "Next class in the instance's MRO (Cls.__mro__)"],
        ["@dataclass", "__init__, __repr__, __eq__; field(default_factory=list) for mutables"],
        ["try / except / else / finally", "else only on success; finally always"],
        ["with", "__enter__ → body → __exit__ (always); True from __exit__ suppresses"],
      ],
    },
    {
      title: "Concurrency",
      items: [
        ["GIL", "One thread runs Python bytecode at a time per process (standard CPython)"],
        ["I/O-bound", "asyncio (many connections) or threads (blocking libraries)"],
        ["CPU-bound", "multiprocessing / ProcessPoolExecutor"],
        ["In async code", "Never call time.sleep or blocking I/O; await, or use asyncio.to_thread"],
        ["Shared state", "Still needs threading.Lock: x += 1 isn't atomic"],
      ],
    },
  ],

  config: {
    quest: { length: 8 },
    boss: { questions: 25, minutes: 30 },
    examModes: [
      { id: "full", name: "Full mock interview", icon: "🎤", questions: 30, unscored: 0, minutes: 45, full: true },
      { id: "quick", name: "Quick screen", icon: "⚡", questions: 15, unscored: 0, minutes: 20, full: false },
    ],
  },

  boss: { name: "The Mutable Default Basilisk", emoji: "🐉" },
  matchLabel: "Python built-ins & modules",
  levelTitles: [
    "Hatchling",
    "Indentation Initiate",
    "List Wrangler",
    "Comprehension Crafter",
    "Generator Whisperer",
    "Closure Keeper",
    "Decorator Artisan",
    "Dunder Duelist",
    "GIL Tamer",
    "Pythonista Prime",
  ],
});
