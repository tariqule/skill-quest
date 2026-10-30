import { defineCourse, withQuestions } from "@/engine/define";
import d1 from "./domains/d1-complexity-sorting";
import d2 from "./domains/d2-search-pointers";
import d3 from "./domains/d3-recursion-graphs";
import d4 from "./domains/d4-dp-greedy-patterns";
import { codingChallenges } from "./coding";
import { moreQuestions } from "./more";

/**
 * Algorithms Interview Quest.
 * An interview-prep syllabus compiled from common coding-interview topics; snippets use JavaScript.
 */
export default defineCourse({
  id: "code-algorithms",
  kind: "interview",
  category: "cs",
  tags: ["sorting", "binary search", "dynamic programming", "dp", "greedy", "bfs", "dfs", "two pointers", "leetcode"],
  provider: { id: "algorithms", name: "Algorithms", color: "#f472b6", icon: "🧮" },
  code: "ALGO",
  title: "Algorithms Interview Quest",
  shortTitle: "Algorithms",
  tagline: "The handful of patterns behind most interview problems, from measuring speed and sorting to graph search and dynamic programming.",
  level: "Intermediate",
  storageKey: "course:code-algorithms:v1",

  domains: withQuestions([d1, d2, d3, d4], moreQuestions),
  coding: codingChallenges,

  exam: {
    questions: 30,
    unscored: 0,
    minutes: 45,
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "One best answer, like a quick check from the interviewer." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "The prompt says how many to pick. All must be right to score." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Put algorithm steps or code lines in the order they run." },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair each algorithm or cue with its cost or use. Every pair must be right." },
      { id: "lines", icon: "🐞", name: "Bug hunt", rule: "Tap the buggy line in the snippet. If more than one, the prompt says how many." },
    ],
  },

  guide: {
    source: {
      label: "Algorithms interview syllabus, compiled for interview prep; JavaScript semantics per the MDN reference",
      version: "2026",
      date: "October 2026",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    },
    facts: [
      { icon: "🧑‍💻", value: "1–2", label: "problems per round", detail: "A typical coding round lasts 45 to 60 minutes and has one or two problems. Follow-up questions often change the limits on you." },
      { icon: "📈", value: "Big-O", label: "every answer", detail: "You'll be asked how fast your solution is and how much memory it uses, and often whether you can do better." },
      { icon: "🧩", value: "~10", label: "core patterns", detail: "Two pointers, sliding windows, binary search, BFS, DFS, backtracking, DP, greedy, heaps and prefix sums cover most problems." },
      { icon: "🐢", value: "Brute", label: "force first", detail: "Interviewers want a simple working answer before you optimise. The reasoning that gets you from one to the other is what they score." },
      { icon: "🧪", value: "Test", label: "before done", detail: "Walking through an example and checking edge cases by hand is part of the answer, not an extra." },
      { icon: "🏛️", value: "5", label: "levels", detail: "Beginner to staff: from what an algorithm is, through reading loops, to choosing algorithms for large systems." },
    ],
    candidate: {
      is: [
        "Preparing for software engineering coding interviews",
        "Comfortable reading basic JavaScript (or any C-style language), or happy to start at the Beginner level",
        "Wanting to recognise which technique a problem is asking for",
        "Senior engineers who need to explain algorithmic trade-offs in design discussions",
      ],
      isNot: [
        "A data structures course (see the Data Structures quest for how each structure works)",
        "Competitive programming: segment trees, flows, and advanced number theory are out of scope",
        "Formal proofs and recurrences beyond what interviews ask",
        "A JavaScript language tutorial",
      ],
    },
    scope: {
      label: "Topics covered",
      groups: [
        { category: "Complexity", icon: "📈", services: ["Big-O / Θ / Ω", "Loop and recursion analysis", "Amortized cost", "Space and the call stack"] },
        { category: "Sorting", icon: "🔀", services: ["Merge sort", "Quicksort", "Heap sort", "Insertion & counting sort", "Stability", "External sorting"] },
        { category: "Searching", icon: "🔍", services: ["Binary search", "Lower / upper bound", "Rotated arrays", "Search on the answer"] },
        { category: "Pointers & windows", icon: "🪟", services: ["Two pointers", "Fixed sliding window", "Variable sliding window", "Prefix sums"] },
        { category: "Recursion & graphs", icon: "🕳️", services: ["Recursion", "Backtracking", "BFS", "DFS", "Topological sort", "Dijkstra (overview)"] },
        { category: "Optimisation", icon: "🏔️", services: ["Memoization", "Tabulation", "Classic DP patterns", "Greedy algorithms", "Pattern recognition"] },
      ],
    },
    tips: [
      { icon: "❓", tip: "Ask for the input size and limits first. They tell you whether O(n²), O(n log n) or exponential time is acceptable." },
      { icon: "🐢", tip: "Say the simple brute-force answer and its complexity out loud before you optimise. It gives the conversation a starting point." },
      { icon: "🔎", tip: "Look for cues. Sorted input suggests binary search or two pointers. A contiguous run suggests a window. Fewest steps suggests BFS. Counting ways suggests DP." },
      { icon: "📝", tip: "Write what your loop keeps true, or what your DP state means, as a comment before the code. It prevents off-by-one bugs." },
      { icon: "🧨", tip: "Try to break your greedy idea with a tiny counterexample before committing to it." },
      { icon: "🧪", tip: "Walk through a small example, then the edge cases: empty input, one element, duplicates, negative numbers, already sorted." },
    ],
    officialPractice: { label: "MDN: Array.prototype.sort reference", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort" },
  },

  cheatsheet: [
    {
      title: "Complexity",
      items: [
        ["Order", "1 < log n < n < n log n < n² < 2ⁿ < n!"],
        ["Rules", "Drop constants and smaller terms · steps in a row add · nested steps multiply"],
        ["Halving / doubling loop", "O(log n)"],
        ["Recursion", "About branches^depth calls · space is the max depth"],
        ["Input-size hints", "n ≤ 20: 2ⁿ ok · n ≤ 10³: n² ok · n ≤ 10⁵–10⁶: n log n"],
      ],
    },
    {
      title: "Sorting",
      items: [
        ["Merge sort", "O(n log n) always · O(n) space · stable"],
        ["Quicksort", "O(n log n) average · O(n²) worst · in place · randomise the pivot"],
        ["Heap sort", "O(n log n) · in place · not stable"],
        ["Counting / radix", "O(n + k) for small integer ranges"],
        ["JS `sort()`", "Stable; pass `(a, b) => a - b` for numbers"],
      ],
    },
    {
      title: "Binary search",
      items: [
        ["Classic", "`while (lo <= hi)`, `lo = mid + 1`, `hi = mid - 1`"],
        ["Lower bound", "`while (lo < hi)`, `hi = arr.length`, `hi = mid` on ≥"],
        ["On the answer", "Monotonic `canDo(x)`: binary search the answer range"],
        ["Needs", "Sorted / monotonic + O(1) random access"],
      ],
    },
    {
      title: "Pointers & windows",
      items: [
        ["Opposite ends", "Sorted pair sums, palindromes, 3-sum"],
        ["Read / write", "In-place dedupe, move zeros"],
        ["Fixed window", "Add right, subtract left"],
        ["Variable window", "Expand right, shrink left while invalid · O(n)"],
        ["Negatives?", "Prefix sums + hash map instead"],
      ],
    },
    {
      title: "Graphs & recursion",
      items: [
        ["BFS", "Queue · mark on enqueue · shortest path unweighted · O(V + E)"],
        ["DFS", "Recursion/stack · components, cycles, topo sort"],
        ["Topological sort", "Kahn's (indegree 0) or reversed DFS postorder"],
        ["Weighted shortest path", "Dijkstra with a min-heap (non-negative weights)"],
        ["Backtracking", "Choose, explore, un-choose · push `[...path]`"],
      ],
    },
    {
      title: "DP & greedy",
      items: [
        ["DP needs", "Overlapping subproblems + optimal substructure"],
        ["Recipe", "State, recurrence, base cases, fill order, answer"],
        ["Memo or table", "Top-down cache, or bottom-up table (easy to save space)"],
        ["Greedy", "Needs proof (exchange argument); intervals by earliest end"],
        ["Greedy fails", "Coins [1, 3, 4] for 6; 0/1 knapsack"],
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

  boss: { name: "The Exponential Echo", emoji: "🌀" },
  matchLabel: "algorithms & techniques",
  levelTitles: [
    "Loop Learner",
    "Big-O Bandit",
    "Sort Squire",
    "Binary Bisector",
    "Pointer Pilot",
    "Window Wrangler",
    "Recursion Ranger",
    "Graph Guide",
    "DP Dynamo",
    "Algorithm Archmage",
  ],
});
