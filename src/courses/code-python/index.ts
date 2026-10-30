import { defineCourse, withQuestions } from "@/engine/define";
import d1 from "./domains/d1-data-mutability";
import d2 from "./domains/d2-iteration";
import d3 from "./domains/d3-functions-scope";
import d4 from "./domains/d4-objects-errors-concurrency";
import { codeGames } from "./games";
import { moreQuestions } from "./more";

/**
 * Python Interview Quest: the Python questions software-engineering interviews
 * actually ask, from mutability and generators to the GIL. Based on the
 * official Python 3 documentation; snippets target modern CPython 3.
 */
export default defineCourse({
  id: "code-python",
  kind: "interview",
  category: "languages",
  tags: ["py", "generators", "decorators", "gil", "asyncio"],
  provider: { id: "python", name: "Python", color: "#3776ab", icon: "🐍" },
  code: "PY",
  title: "Python Interview Quest",
  shortTitle: "Python",
  tagline: "Guess what the code prints, find the bug, and explain why. Covers mutability, generators, closures, classes and the GIL, starting from your very first line.",
  level: "Intermediate",
  storageKey: "course:code-python:v1",

  domains: withQuestions([d1, d2, d3, d4], [...moreQuestions, ...codeGames]),

  exam: {
    questions: 30,
    unscored: 0,
    minutes: 45,
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "Pick the one right answer. These are often \"what does this print?\" or \"how fast is this?\"." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "The question tells you how many to pick. You need every one right to score." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Put the code lines or steps in the order that works." },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair each item with its answer. Every pair has to be right." },
      { id: "lines", icon: "🐞", name: "Bug hunt", rule: "Tap the line (or lines) in the code that cause the bug or raise the error." },
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
      { icon: "🎤", value: "30", label: "questions", detail: "The full mock interview is 30 mixed questions in 45 minutes, so about 90 seconds each." },
      { icon: "🎯", value: "70", label: "to pass", detail: "Score 70 out of 100 on the mock to pass. Every question counts, and none are left unscored." },
      { icon: "🔮", value: "Predict", label: "the output", detail: "Phone screens and quizzes often show a few lines of code and ask what they print. Most of the traps here are well-known classics." },
      { icon: "🐞", value: "Bug", label: "hunts", detail: "Code review and live-coding rounds check whether you can spot the line that's wrong and say why." },
      { icon: "🗣️", value: "Why", label: "matters most", detail: "Interviewers usually care more about how you reason (speed, trade-offs, edge cases) than about the one-word answer." },
      { icon: "🐍", value: "3.x", label: "modern Python", detail: "The code assumes a current CPython 3 release. Everything covered here has worked the same way for many versions." },
    ],
    candidate: {
      is: [
        "Getting ready for a software, backend, data or ML engineering interview that uses Python",
        "New to Python and wanting a gentle start, or already writing it and curious why it behaves the way it does",
        "Wanting to practise \"what does this print?\" and bug-hunt questions against the clock",
        "Brushing up on how objects, scope and concurrency work before an on-site interview",
      ],
      isNot: [
        "A data structures and algorithms course (there are no graph or dynamic programming problems)",
        "About a particular framework such as Django, FastAPI, pandas or NumPy",
        "About packaging, virtual environments or deployment",
        "A tour of CPython internals beyond what interviews usually ask",
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
      { icon: "✏️", tip: "For \"what does this print?\", go through the code one line at a time and draw each name as an arrow to its object. Most traps are about two names sharing one object, or about when something gets worked out." },
      { icon: "🗣️", tip: "Think out loud. Say how fast your code is without being asked, for example: \"this in check is O(n) on a list but O(1) on a set\"." },
      { icon: "🧪", tip: "Ask about edge cases before you start coding: empty input, a single item, duplicates, zero, negative numbers and None." },
      { icon: "🐍", tip: "Use the Python habits interviewers look for: comprehensions, enumerate, zip, with, dict.get and collections.Counter. They show you're fluent." },
      { icon: "🧯", tip: "Name the trap out loud when you spot it: a mutable default, late binding, a shared class attribute, or changing a list while looping over it." },
      { icon: "⚖️", tip: "For concurrency questions, first decide whether the work mostly waits on I/O or keeps the CPU busy. Then pick asyncio, threads or processes." },
    ],
    officialPractice: { label: "The Python Tutorial (docs.python.org)", url: "https://docs.python.org/3/tutorial/" },
  },

  cheatsheet: [
    {
      title: "Mutability and copying",
      items: [
        ["Mutable", "list, dict, set, bytearray, most user classes"],
        ["Immutable", "int, float, bool, str, tuple, frozenset, bytes"],
        ["b = a", "A second name for the same object. Nothing is copied."],
        ["a.copy() · list(a) · a[:]", "Shallow copy: a new outer list, but the inner objects are shared"],
        ["copy.deepcopy(a)", "Copies everything, all the way down, so nothing is shared"],
        ["is and ==", "is asks \"same object?\" and == asks \"equal value?\". Use is only for None and other one-off objects."],
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
        ["Generator expression", "(expr for x in it) makes items one at a time and can only be used once"],
        ["Iterator protocol", "iter() gives an iterator, next() steps it, StopIteration means it's done"],
        ["Generator", "A function with yield. Calling it runs nothing until the first next()"],
        ["for / else", "else runs only when the loop didn't break"],
      ],
    },
    {
      title: "Functions and scope",
      items: [
        ["Signature order", "pos_only, /, normal, *args, kw_only, **kwargs"],
        ["Defaults", "Created once, when def runs, so use None for list and dict defaults"],
        ["LEGB", "Python looks in Local, then Enclosing, then Global, then Built-in"],
        ["global / nonlocal", "Only needed to point a name at something new, not to change an object"],
        ["Late binding", "lambda: i sees the final i. Fix it with lambda i=i: i"],
        ["Decorator", "@d above def f means f = d(f). Stacked ones apply from the bottom up"],
      ],
    },
    {
      title: "Classes and errors",
      items: [
        ["__repr__ / __str__", "Developer view (also used inside lists) and the friendly print view"],
        ["__eq__ without __hash__", "Instances can't go in sets or be dict keys"],
        ["super()", "The next class in the object's MRO (see Cls.__mro__)"],
        ["@dataclass", "Writes __init__, __repr__ and __eq__. Use field(default_factory=list) for list defaults"],
        ["try / except / else / finally", "else runs only on success, finally always runs"],
        ["with", "Runs __enter__, then the body, then always __exit__. True from __exit__ swallows the error"],
      ],
    },
    {
      title: "Concurrency",
      items: [
        ["GIL", "Only one thread runs Python bytecode at a time in each process (standard CPython)"],
        ["Waiting on I/O", "asyncio for many connections, or threads for blocking libraries"],
        ["Busy on the CPU", "multiprocessing or ProcessPoolExecutor"],
        ["In async code", "Never call time.sleep or blocking I/O. Use await, or asyncio.to_thread"],
        ["Shared state", "Still needs threading.Lock, because x += 1 isn't a single step"],
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
