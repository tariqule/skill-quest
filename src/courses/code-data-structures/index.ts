import { defineCourse } from "@/engine/define";
import d1 from "./domains/d1-linear";
import d2 from "./domains/d2-stacks-hashing";
import d3 from "./domains/d3-trees-heaps";
import d4 from "./domains/d4-graphs-tries";

/**
 * Data Structures Interview Quest.
 * An interview-prep syllabus compiled from common coding-interview topics; snippets use JavaScript.
 */
export default defineCourse({
  id: "code-data-structures",
  kind: "interview",
  provider: { id: "data-structures", name: "Data Structures", color: "#22d3ee", icon: "🧱" },
  code: "DS",
  title: "Data Structures Interview Quest",
  shortTitle: "Data Structures",
  tagline: "Arrays to tries: how each structure works, what every operation costs, and which one to reach for.",
  level: "Intermediate",
  storageKey: "course:code-data-structures:v1",

  domains: [d1, d2, d3, d4],

  exam: {
    questions: 30,
    unscored: 0,
    minutes: 45,
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "One best answer, like a quick check from the interviewer." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "The prompt says how many to pick. All must be right to score." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Put code lines or algorithm steps in the order they run." },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair each structure or operation with its cost or use. Every pair must be right." },
      { id: "lines", icon: "🐞", name: "Bug hunt", rule: "Tap the buggy line in the snippet. If more than one, the prompt says how many." },
    ],
  },

  guide: {
    source: {
      label: "Data structures interview syllabus, compiled for interview prep; JavaScript semantics per the MDN reference",
      version: "2026",
      date: "October 2026",
      url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
    },
    facts: [
      { icon: "🧑‍💻", value: "1–2", label: "problems per round", detail: "A typical coding round is 45–60 minutes with one or two problems, often in a shared editor or on a whiteboard." },
      { icon: "📈", value: "Big-O", label: "always", detail: "Expect to state time and space complexity for every solution, usually without being asked." },
      { icon: "🧱", value: "10", label: "core structures", detail: "Arrays, strings, linked lists, stacks, queues, hash maps/sets, trees, heaps, graphs, and tries." },
      { icon: "🗣️", value: "Aloud", label: "think out loud", detail: "Interviewers grade your reasoning and trade-offs, not just whether the code runs." },
      { icon: "✍️", value: "No IDE", label: "often", detail: "Many rounds have no autocomplete or debugger, so know `Map`, `Set`, `push`/`pop`/`shift` and friends by heart." },
      { icon: "🏛️", value: "4", label: "levels", detail: "Junior to staff: fundamentals first, then pitfalls, internals, and system-scale design choices." },
    ],
    candidate: {
      is: [
        "Preparing for software engineering coding interviews",
        "Comfortable reading basic JavaScript (or any C-style language)",
        "Wanting to explain why an operation costs what it costs, not just memorise a table",
        "Senior engineers refreshing fundamentals before design-heavy loops",
      ],
      isNot: [
        "A course on algorithm design (see the Algorithms quest for sorting, DP, and search patterns)",
        "A JavaScript language tutorial",
        "Formal proofs or advanced structures like segment trees and suffix arrays",
        "Language-specific library internals",
      ],
    },
    scope: {
      label: "Topics covered",
      groups: [
        { category: "Linear", icon: "📏", services: ["Arrays & dynamic arrays", "Strings", "Singly & doubly linked lists", "Ring buffers"] },
        { category: "Stacks & queues", icon: "🥞", services: ["Stack", "Queue", "Deque", "Monotonic stack", "Queue from two stacks"] },
        { category: "Hashing", icon: "#️⃣", services: ["Map", "Set", "Hash table internals", "Load factor & rehashing", "Consistent hashing"] },
        { category: "Trees", icon: "🌳", services: ["Binary trees", "Traversals", "Binary search trees", "AVL / red-black", "B-trees"] },
        { category: "Heaps", icon: "⛰️", services: ["Binary heap", "Priority queue", "Top-k"] },
        { category: "Graphs & more", icon: "🕸️", services: ["Adjacency list", "Adjacency matrix", "Edge list", "Trie", "Union-Find", "Skip list"] },
      ],
    },
    tips: [
      { icon: "❓", tip: "Clarify before coding: input size, duplicates, empty input, sorted or not, character set." },
      { icon: "📋", tip: "List the operations the problem needs, then choose the structure that makes the frequent ones cheap." },
      { icon: "🐢", tip: "State the brute force and its Big-O first. It proves you understand the problem and gives you a baseline." },
      { icon: "📐", tip: "Say \"O(1) average\" for hash maps and \"amortized\" for dynamic array pushes. Precision signals depth." },
      { icon: "✏️", tip: "Draw linked lists and trees. Most pointer bugs show up on paper before they show up in code." },
      { icon: "🧪", tip: "Finish by tracing a small example and the edge cases: empty, one element, duplicates, all equal." },
    ],
    officialPractice: { label: "MDN: JavaScript keyed collections (Map, Set)", url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Keyed_collections" },
  },

  cheatsheet: [
    {
      title: "Big-O by structure",
      items: [
        ["Array", "Index O(1) · push/pop O(1)* · shift/unshift/splice O(n) · search O(n)"],
        ["Linked list", "Head insert/delete O(1) · index O(n) · delete known node O(1) if doubly linked"],
        ["Stack / queue / deque", "All core ops O(1) (use a head index or ring buffer, not `shift`)"],
        ["Hash map / set", "get/set/has/delete O(1) average, O(n) worst"],
        ["Balanced BST", "search/insert/delete O(log n); inorder = sorted"],
        ["Binary heap", "peek O(1) · push/pop O(log n) · heapify O(n)"],
        ["Trie", "insert/search/startsWith O(L)"],
      ],
    },
    {
      title: "JavaScript essentials",
      items: [
        ["Stack", "`push` + `pop` on an array"],
        ["Queue", "`push` + head index (avoid `shift` on big queues)"],
        ["Map", "`new Map()`, `get`/`set`/`has`/`delete`, `.size`, insertion order"],
        ["Set", "`new Set(arr)`, `add`/`has`/`delete`, dedupe with `[...new Set(a)]`"],
        ["Counting", "`m.set(k, (m.get(k) ?? 0) + 1)`"],
        ["2D / adjacency", "`Array.from({ length: n }, () => [])`, never `fill([])`"],
      ],
    },
    {
      title: "Trees",
      items: [
        ["Traversals", "Pre: root-L-R · In: L-root-R (sorted BST) · Post: L-R-root · Level: queue"],
        ["Height", "Balanced ≈ log₂ n; sorted inserts into a plain BST → chain, O(n)"],
        ["Validate BST", "Pass (min, max) bounds down, not just parent-child checks"],
        ["Delete (2 children)", "Swap in the in-order successor or predecessor"],
      ],
    },
    {
      title: "Heaps",
      items: [
        ["Index math (0-based)", "children 2i+1, 2i+2 · parent ⌊(i−1)/2⌋"],
        ["Top-k largest", "Min-heap of size k: O(n log k)"],
        ["Sift up / down", "One root-to-leaf path: O(log n)"],
      ],
    },
    {
      title: "Graphs",
      items: [
        ["List vs matrix", "O(V + E) vs O(V²) space · matrix gives O(1) edge check"],
        ["Tree", "Connected, acyclic, V − 1 edges"],
        ["Max edges (undirected)", "V(V − 1)/2"],
        ["Union-Find", "Connectivity as edges arrive, near O(1) per op"],
      ],
    },
    {
      title: "Pick a structure",
      items: [
        ["Lookup by key", "Hash map"],
        ["Next smallest / largest", "Heap"],
        ["Sorted order, ranges, rank", "Balanced BST, skip list, sorted array"],
        ["Prefixes", "Trie"],
        ["Most recent / matching pairs", "Stack"],
        ["Arrival order / BFS", "Queue"],
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

  boss: { name: "The Collision Kraken", emoji: "🦑" },
  matchLabel: "data structures & APIs",
  levelTitles: [
    "Array Apprentice",
    "Pointer Pupil",
    "Stack Stacker",
    "Queue Keeper",
    "Hash Hero",
    "Tree Climber",
    "Heap Hauler",
    "Graph Walker",
    "Trie Tamer",
    "Structure Sage",
  ],
});
