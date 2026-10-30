import type { CodingChallenge } from "@/engine/types";

/**
 * Live Python exercises. They run in the browser on Pyodide (CPython compiled to WebAssembly);
 * `npm test` runs every reference solution and starter with the local python3.
 */
export const codingChallenges: CodingChallenge[] = [
  {
    id: "python-cc-01",
    language: "python",
    domain: "d1",
    lesson: "d1-start-lists",
    level: "beginner",
    title: "Sum the even numbers",
    idea: "loop + modulo",
    complexity: "Time O(n), one pass. Space O(1).",
    prompt: "Write `sum_evens(nums)`. It returns the total of the even numbers in the list `nums`. An empty list, or a list with no even numbers, gives `0`. Negative even numbers count too.",
    fn: "sum_evens",
    starter: `def sum_evens(nums):
    # TODO: add up the even numbers
    return -1
`,
    tests: [
      { name: "mixed", args: [[1, 2, 3, 4]], expected: 6 },
      { name: "empty list", args: [[]], expected: 0 },
      { name: "no evens", args: [[1, 3, 5]], expected: 0 },
      { name: "negatives", hidden: true, args: [[-2, -3, 4]], expected: 2 },
      { name: "zero is even", hidden: true, args: [[0, 7]], expected: 0 },
    ],
    hints: ["Start a running total at 0 and loop over the list.", "`n % 2 == 0` is true for even numbers, including negative ones and 0.", "A one-liner works too: `sum(n for n in nums if n % 2 == 0)`."],
    solution: `def sum_evens(nums):
    total = 0
    for n in nums:
        if n % 2 == 0:
            total += n
    return total
`,
    explanation: "The loop visits each number once and adds it when `n % 2 == 0`. In Python, `%` with a positive divisor never returns a negative number, so `-2 % 2` is `0` and negative evens are counted. `sum()` over a generator expression is the idiomatic short form.",
  },
  {
    id: "python-cc-02",
    language: "python",
    domain: "d2",
    lesson: "d2-start-range",
    level: "beginner",
    title: "FizzBuzz",
    idea: "range + modulo",
    complexity: "Time O(n). Space O(n) for the returned list.",
    prompt: "Write `fizz_buzz(n)`. It returns a list of strings for the numbers 1 to `n`: `\"Fizz\"` for multiples of 3, `\"Buzz\"` for multiples of 5, `\"FizzBuzz\"` for multiples of both, and the number as a string otherwise. When `n` is 0 the list is empty.",
    fn: "fizz_buzz",
    starter: `def fizz_buzz(n):
    out = []
    # TODO: fill out for 1..n
    return out
`,
    tests: [
      { name: "n is 5", args: [5], expected: ["1", "2", "Fizz", "4", "Buzz"] },
      { name: "n is 0", args: [0], expected: [] },
      { name: "n is 1", args: [1], expected: ["1"] },
      { name: "n is 15", hidden: true, args: [15], expected: ["1", "2", "Fizz", "4", "Buzz", "Fizz", "7", "8", "Fizz", "Buzz", "11", "Fizz", "13", "14", "FizzBuzz"] },
    ],
    hints: ["`range(1, n + 1)` stops before its end, so add 1 to include `n`.", "Check 15 first. Otherwise the multiple-of-3 branch wins for 15.", "`str(i)` turns a number into its string."],
    solution: `def fizz_buzz(n):
    out = []
    for i in range(1, n + 1):
        if i % 15 == 0:
            out.append("FizzBuzz")
        elif i % 3 == 0:
            out.append("Fizz")
        elif i % 5 == 0:
            out.append("Buzz")
        else:
            out.append(str(i))
    return out
`,
    explanation: "`range(1, n + 1)` gives 1 through `n`, because the end of a range is excluded. Testing the combined case first matters: the first matching `if`/`elif` branch wins.",
  },
  {
    id: "python-cc-03",
    language: "python",
    domain: "d2",
    lesson: "d2-start-loops",
    level: "junior",
    title: "Balanced brackets",
    idea: "stack",
    complexity: "Time O(n), each character pushed or popped once. Space O(n) for the stack.",
    prompt: "Write `is_balanced(s)`. It returns `True` when every `(`, `[` and `{` in `s` is closed by the matching bracket in the right order, and `False` otherwise. Other characters are ignored. An empty string is balanced.",
    fn: "is_balanced",
    starter: `def is_balanced(s):
    # TODO: use a list as a stack
    return None
`,
    tests: [
      { name: "simple", args: ["()[]{}"], expected: true },
      { name: "wrong order", args: ["(]"], expected: false },
      { name: "nested", args: ["{[()]}"], expected: true },
      { name: "empty", args: [""], expected: true },
      { name: "close first", hidden: true, args: [")("], expected: false },
      { name: "left open", hidden: true, args: ["(("], expected: false },
      { name: "with text", hidden: true, args: ["f(a[0]) { x }"], expected: true },
    ],
    hints: ["Push every opening bracket onto a list.", "On a closing bracket, the top of the stack must be its partner. A dict like `{')': '(', ...}` makes the check short.", "At the end the stack must be empty, or something was left open."],
    solution: `def is_balanced(s):
    pairs = {")": "(", "]": "[", "}": "{"}
    stack = []
    for ch in s:
        if ch in "([{":
            stack.append(ch)
        elif ch in pairs:
            if not stack or stack.pop() != pairs[ch]:
                return False
    return not stack
`,
    explanation: "A Python list works as a stack with `append` and `pop`. Each closing bracket must match the most recent unclosed opener. Checking `not stack` before popping avoids an `IndexError` on input like `)(`, and `return not stack` catches openers that were never closed.",
  },
  {
    id: "python-cc-04",
    language: "python",
    domain: "d1",
    lesson: "d1-collections",
    level: "junior",
    title: "Two sum",
    idea: "dict lookup",
    complexity: "Time O(n) with one dict lookup per number. Space O(n). The nested-loop version is O(n²).",
    prompt: "Write `two_sum(nums, target)`. Exactly one pair of different positions adds up to `target`. Return their indices as a list `[i, j]` with `i < j`.",
    fn: "two_sum",
    starter: `def two_sum(nums, target):
    # TODO: find i < j with nums[i] + nums[j] == target
    return []
`,
    tests: [
      { name: "start of list", args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { name: "middle", args: [[3, 2, 4], 6], expected: [1, 2] },
      { name: "same value twice", args: [[3, 3], 6], expected: [0, 1] },
      { name: "negatives", hidden: true, args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
      { name: "zeros", hidden: true, args: [[0, 4, 3, 0], 0], expected: [0, 3] },
    ],
    hints: ["For each number, the partner you need is `target - n`.", "Keep a dict from value to the index where you saw it.", "Check the dict before adding the current number, so a number can't pair with itself."],
    solution: `def two_sum(nums, target):
    seen = {}
    for j, n in enumerate(nums):
        if target - n in seen:
            return [seen[target - n], j]
        seen[n] = j
    return []
`,
    explanation: "A dict lookup is O(1) on average, so one pass is enough. `enumerate` gives index and value together. Looking up before storing means `[3, 3]` finds the earlier 3 at index 0 rather than pairing index 1 with itself.",
  },
  {
    id: "python-cc-05",
    language: "python",
    domain: "d1",
    lesson: "d1-slicing",
    level: "junior",
    title: "Palindrome check",
    idea: "filter + slice [::-1]",
    complexity: "Time O(n). Space O(n) for the cleaned copy; a two-pointer loop gets this to O(1).",
    prompt: "Write `is_palindrome(s)`. Ignore case and every character that isn't a letter or digit, then return `True` if what is left reads the same backwards. An empty string counts as a palindrome.",
    fn: "is_palindrome",
    starter: `def is_palindrome(s):
    # TODO
    return None
`,
    tests: [
      { name: "sentence", args: ["A man, a plan, a canal: Panama"], expected: true },
      { name: "not one", args: ["race a car"], expected: false },
      { name: "empty", args: [""], expected: true },
      { name: "digits", hidden: true, args: ["12321"], expected: true },
      { name: "only punctuation", hidden: true, args: [".,!"], expected: true },
      { name: "mixed case", hidden: true, args: ["No lemon, no melon"], expected: true },
    ],
    hints: ["`ch.isalnum()` tells you if a character is a letter or digit.", "Build the cleaned, lower-cased string with `\"\".join(...)`.", "`t[::-1]` is `t` reversed."],
    solution: `def is_palindrome(s):
    t = "".join(ch.lower() for ch in s if ch.isalnum())
    return t == t[::-1]
`,
    explanation: "A slice with step `-1` walks the string backwards, so `t[::-1]` is a reversed copy. Cleaning first with `isalnum()` and `lower()` keeps punctuation and case from breaking the comparison.",
  },
  {
    id: "python-cc-06",
    language: "python",
    domain: "d1",
    lesson: "d1-collections",
    level: "junior",
    title: "Word count",
    idea: "dict / Counter",
    complexity: "Time O(n) in the length of the text. Space O(k) for k distinct words.",
    prompt: "Write `word_count(text)`. Split `text` on whitespace, lower-case each word, and return a dict from each word to how many times it appears. Empty text gives an empty dict.",
    fn: "word_count",
    starter: `def word_count(text):
    counts = {}
    # TODO
    return counts
`,
    tests: [
      { name: "repeats", args: ["the cat and the hat"], expected: { the: 2, cat: 1, and: 1, hat: 1 } },
      { name: "case folds", args: ["Go go GO"], expected: { go: 3 } },
      { name: "empty", args: [""], expected: {} },
      { name: "extra spaces", hidden: true, args: ["  a  b   a "], expected: { a: 2, b: 1 } },
    ],
    hints: ["`text.split()` with no argument splits on any run of whitespace and drops empty pieces.", "`counts.get(w, 0) + 1` avoids a `KeyError` for a new word.", "`collections.Counter` does the counting for you; wrap it in `dict(...)`."],
    solution: `from collections import Counter

def word_count(text):
    return dict(Counter(w.lower() for w in text.split()))
`,
    explanation: "`str.split()` with no separator collapses runs of whitespace, so leading and repeated spaces never produce empty words. `Counter` is a dict subclass that counts what you feed it.",
  },
  {
    id: "python-cc-07",
    language: "python",
    domain: "d2",
    lesson: "d2-comprehensions",
    level: "intermediate",
    title: "Group anagrams",
    idea: "dict of lists, sorted key",
    complexity: "Time O(n · k log k) for n words of length k. Space O(n · k).",
    prompt: "Write `group_anagrams(words)`. Words are anagrams when they use the same letters the same number of times. Return a list of groups, where each group is sorted alphabetically and the groups are sorted by their first word.",
    fn: "group_anagrams",
    starter: `def group_anagrams(words):
    # TODO
    return []
`,
    tests: [
      { name: "classic", args: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]] },
      { name: "empty", args: [[]], expected: [] },
      { name: "single", args: [["a"]], expected: [["a"]] },
      { name: "empty string word", hidden: true, args: [["", "b", ""]], expected: [["", ""], ["b"]] },
      { name: "no anagrams", hidden: true, args: [["abc", "abd"]], expected: [["abc"], ["abd"]] },
    ],
    hints: ["Two anagrams sort to the same string: `\"\".join(sorted(\"tea\"))` is `\"aet\"`.", "Use that sorted string as a dict key, with a list of words as the value. `collections.defaultdict(list)` saves a check.", "Finish with `sorted(sorted(g) for g in groups.values())`."],
    solution: `from collections import defaultdict

def group_anagrams(words):
    groups = defaultdict(list)
    for w in words:
        groups["".join(sorted(w))].append(w)
    return sorted(sorted(g) for g in groups.values())
`,
    explanation: "Sorting a word's letters gives a key that every anagram shares. `defaultdict(list)` creates the empty list on first use. Lists compare element by element, so sorting the groups orders them by their first word.",
  },
  {
    id: "python-cc-08",
    language: "python",
    domain: "d1",
    lesson: "d1-copying",
    level: "intermediate",
    title: "Transpose a grid",
    idea: "nested comprehension, no shared rows",
    complexity: "Time O(r · c). Space O(r · c) for the new grid.",
    prompt: "Write `transpose(grid)`. `grid` is a list of rows, all the same length. Return a new grid where row `i` is column `i` of the input. Don't change `grid`. An empty grid gives `[]`.",
    fn: "transpose",
    starter: `def transpose(grid):
    if not grid:
        return []
    out = [[0] * len(grid)] * len(grid[0])  # careful: is this one list or many?
    for r, row in enumerate(grid):
        for c, v in enumerate(row):
            out[c][r] = v
    return out
`,
    tests: [
      { name: "2 by 3", args: [[[1, 2, 3], [4, 5, 6]]], expected: [[1, 4], [2, 5], [3, 6]] },
      { name: "square", args: [[[1, 2], [3, 4]]], expected: [[1, 3], [2, 4]] },
      { name: "empty", args: [[]], expected: [] },
      { name: "one row", hidden: true, args: [[[7, 8, 9]]], expected: [[7], [8], [9]] },
    ],
    hints: ["Run the starter: every row comes out the same. `[row] * n` repeats one reference to the same list.", "Build each row separately, with a comprehension: `[[...] for c in range(cols)]`.", "`[list(col) for col in zip(*grid)]` is the idiomatic one-liner."],
    solution: `def transpose(grid):
    if not grid:
        return []
    return [[row[c] for row in grid] for c in range(len(grid[0]))]
`,
    explanation: "Multiplying a list of lists copies references, not rows, so the starter writes every value into one shared row. A nested comprehension builds a fresh list per row. `zip(*grid)` is another route: it pairs up the i-th items of every row.",
  },
  {
    id: "python-cc-09",
    language: "python",
    domain: "d2",
    lesson: "d2-generators",
    level: "intermediate",
    title: "Chunk a list",
    idea: "slicing with a step",
    complexity: "Time O(n). Space O(n) for the result; a generator version would hold one chunk at a time.",
    prompt: "Write `chunk(items, size)`. Return a list of lists, each holding the next `size` items in order. The last chunk may be shorter. `size` is at least 1.",
    fn: "chunk",
    starter: `def chunk(items, size):
    # TODO
    return [items]
`,
    tests: [
      { name: "even split", args: [[1, 2, 3, 4], 2], expected: [[1, 2], [3, 4]] },
      { name: "remainder", args: [[1, 2, 3, 4, 5], 2], expected: [[1, 2], [3, 4], [5]] },
      { name: "empty", args: [[], 3], expected: [] },
      { name: "size bigger than list", hidden: true, args: [[1, 2], 5], expected: [[1, 2]] },
      { name: "size 1", hidden: true, args: [["a", "b"], 1], expected: [["a"], ["b"]] },
    ],
    hints: ["`range(0, len(items), size)` gives the start of each chunk.", "Slicing past the end is safe in Python: `[1, 2][0:5]` is `[1, 2]`.", "As a generator: `yield items[i:i + size]`, then wrap the call in `list(...)`."],
    solution: `def chunk(items, size):
    def gen():
        for i in range(0, len(items), size):
            yield items[i:i + size]
    return list(gen())
`,
    explanation: "A range with a step lands on 0, size, 2·size and so on. Slices clamp to the list's end, so the last chunk is simply shorter and no index check is needed. Writing the loop as a generator lets a caller stream chunks without building the whole list.",
  },
  {
    id: "python-cc-10",
    language: "python",
    domain: "d2",
    lesson: "d2-iterators",
    level: "senior",
    title: "Merge intervals",
    idea: "sort, then sweep",
    complexity: "Time O(n log n) for the sort, then O(n). Space O(n).",
    prompt: "Write `merge(intervals)`. Each interval is `[start, end]` with `start <= end`. Merge every pair that overlaps or touches (`[1, 3]` and `[3, 5]` become `[1, 5]`) and return the result sorted by start.",
    fn: "merge",
    starter: `def merge(intervals):
    # TODO
    return intervals
`,
    tests: [
      { name: "overlap", args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { name: "touching", args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { name: "unsorted input", args: [[[5, 6], [1, 2]]], expected: [[1, 2], [5, 6]] },
      { name: "empty", hidden: true, args: [[]], expected: [] },
      { name: "contained", hidden: true, args: [[[1, 10], [2, 3], [4, 5]]], expected: [[1, 10]] },
      { name: "chain", hidden: true, args: [[[3, 4], [1, 2], [2, 3]]], expected: [[1, 4]] },
    ],
    hints: ["Sort by start first. Then only the last merged interval can overlap the next one.", "If `start <= last_end`, extend: `last[1] = max(last[1], end)`.", "Copy each interval as you add it (`[s, e]`) so you never change the caller's lists."],
    solution: `def merge(intervals):
    out = []
    for s, e in sorted(intervals):
        if out and s <= out[-1][1]:
            out[-1][1] = max(out[-1][1], e)
        else:
            out.append([s, e])
    return out
`,
    explanation: "After sorting, overlaps can only happen with the most recent merged interval, so one sweep is enough. `max` handles an interval fully inside another. Unpacking `for s, e in ...` and appending a new list keeps the input untouched.",
  },
  {
    id: "python-cc-11",
    language: "python",
    domain: "d3",
    lesson: "d3-decorators",
    level: "senior",
    title: "Fast Fibonacci",
    idea: "memoize with functools.cache",
    complexity: "With memoization O(n) time and O(n) space. The plain recursive version is about O(1.6ⁿ).",
    prompt: "Write `fib(n)` with `fib(0)` being 0 and `fib(1)` being 1; each later number is the sum of the two before it. The tests go up to `fib(70)`, so a plain recursive version will time out.",
    fn: "fib",
    starter: `def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)  # correct, but far too slow for n = 70
`,
    tests: [
      { name: "fib(0)", args: [0], expected: 0 },
      { name: "fib(1)", args: [1], expected: 1 },
      { name: "fib(10)", args: [10], expected: 55 },
      { name: "fib(70)", hidden: true, args: [70], expected: 190392490709135 },
    ],
    hints: ["The slow part is recomputing the same `fib(k)` over and over.", "`from functools import cache`, then put `@cache` on the line above `def fib`.", "Or loop: keep two variables `a, b` and update them with `a, b = b, a + b`."],
    solution: `from functools import cache

@cache
def fib(n):
    if n < 2:
        return n
    return fib(n - 1) + fib(n - 2)
`,
    explanation: "`@cache` is a decorator: it wraps `fib` in a function that stores each result by argument, so every `fib(k)` is computed once. Python ints never overflow, so `fib(70)` is exact. The two-variable loop is just as fast and uses O(1) space.",
  },
  {
    id: "python-cc-12",
    language: "python",
    domain: "d4",
    lesson: "d4-classes",
    level: "senior",
    title: "LRU cache",
    idea: "OrderedDict, move_to_end",
    complexity: "Each get and put is O(1). Space O(capacity).",
    prompt: "Finish `class LRUCache`, then `run_lru(capacity, ops)` replays operations against one cache. Each op is `[\"put\", key, value]` or `[\"get\", key]`. `get` returns the value or `-1` and counts as a use. When a `put` adds a new key to a full cache, evict the least recently used key first. Return the list of `get` results.",
    fn: "run_lru",
    starter: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.data = OrderedDict()

    def get(self, key):
        # TODO
        return -1

    def put(self, key, value):
        # TODO
        pass


def run_lru(capacity, ops):
    cache = LRUCache(capacity)
    out = []
    for op in ops:
        if op[0] == "put":
            cache.put(op[1], op[2])
        else:
            out.append(cache.get(op[1]))
    return out
`,
    tests: [
      { name: "evicts oldest", args: [2, [["put", 1, 1], ["put", 2, 2], ["get", 1], ["put", 3, 3], ["get", 2], ["get", 3]]], expected: [1, -1, 3] },
      { name: "miss", args: [1, [["get", 5]]], expected: [-1] },
      { name: "update keeps one copy", args: [2, [["put", 1, 1], ["put", 1, 10], ["put", 2, 2], ["get", 1]]], expected: [10] },
      { name: "put refreshes", hidden: true, args: [2, [["put", 1, 1], ["put", 2, 2], ["put", 1, 5], ["put", 3, 3], ["get", 2], ["get", 1]]], expected: [-1, 5] },
      { name: "capacity 1", hidden: true, args: [1, [["put", 1, 1], ["put", 2, 2], ["get", 1], ["get", 2]]], expected: [-1, 2] },
    ],
    hints: ["An `OrderedDict` remembers insertion order, and `move_to_end(key)` marks a key as most recent.", "In `get`, return -1 for a missing key; otherwise move it to the end and return the value.", "In `put`, write the value, move the key to the end, then `popitem(last=False)` while `len(self.data) > self.capacity`."],
    solution: `from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity):
        self.capacity = capacity
        self.data = OrderedDict()

    def get(self, key):
        if key not in self.data:
            return -1
        self.data.move_to_end(key)
        return self.data[key]

    def put(self, key, value):
        self.data[key] = value
        self.data.move_to_end(key)
        if len(self.data) > self.capacity:
            self.data.popitem(last=False)


def run_lru(capacity, ops):
    cache = LRUCache(capacity)
    out = []
    for op in ops:
        if op[0] == "put":
            cache.put(op[1], op[2])
        else:
            out.append(cache.get(op[1]))
    return out
`,
    explanation: "The OrderedDict keeps keys from least to most recently used. `move_to_end` and `popitem(last=False)` are both O(1), so the class gives the classic interview answer without writing a linked list by hand. Keeping state on `self` is what makes this a class rather than a function.",
  },
  {
    id: "python-cc-13",
    language: "python",
    domain: "d4",
    lesson: "d4-errors",
    level: "staff",
    title: "Parse what you can",
    idea: "try/except ValueError",
    complexity: "Time O(n). Space O(n).",
    prompt: "Write `parse_numbers(items)`. Each item is a string. Convert the ones that `int()` accepts and skip the rest. Return `[numbers, bad]` where `numbers` is the list of parsed ints in order and `bad` is how many items were skipped. Catch only the error `int()` raises for bad text.",
    fn: "parse_numbers",
    starter: `def parse_numbers(items):
    numbers = []
    for s in items:
        numbers.append(int(s))  # crashes on the first bad item
    return [numbers, 0]
`,
    tests: [
      { name: "mixed", args: [["1", "x", "3"]], expected: [[1, 3], 1] },
      { name: "all good", args: [["10", "-2", " 7 "]], expected: [[10, -2, 7], 0] },
      { name: "empty", args: [[]], expected: [[], 0] },
      { name: "floats are bad", hidden: true, args: [["1.5", "2", ""]], expected: [[2], 2] },
    ],
    hints: ["Wrap just the `int(s)` call in `try`.", "`int(\"x\")` raises `ValueError`. Catch that by name, not a bare `except:`.", "Put the append in an `else:` block so only the conversion is guarded."],
    solution: `def parse_numbers(items):
    numbers, bad = [], 0
    for s in items:
        try:
            n = int(s)
        except ValueError:
            bad += 1
        else:
            numbers.append(n)
    return [numbers, bad]
`,
    explanation: "A narrow `try` around the one call that can fail, catching the specific `ValueError`, means a real bug elsewhere (a `TypeError` from a non-string, say) still surfaces. The `else` branch runs only when no exception was raised. `int()` accepts surrounding whitespace, which is why `\" 7 \"` parses.",
  },
];
