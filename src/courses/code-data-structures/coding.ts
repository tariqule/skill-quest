import type { CodingChallenge, CodingTest } from "@/engine/types";

/** Tagged template for code text: raw (no escape processing), leading newline and trailing space trimmed. */
const src = (s: TemplateStringsArray) => s.raw[0].replace(/^\n/, "").replace(/\s+$/, "") + "\n";

const t = (name: string, args: unknown[], expected: unknown, hidden = false): CodingTest => (hidden ? { name, args, expected, hidden } : { name, args, expected });

/** A complete binary tree where node i has children 2i and 2i+1, up to n nodes. */
type TreeNode = { val: number; left: TreeNode | null; right: TreeNode | null };
const heapTree = (i: number, n: number): TreeNode => ({ val: i, left: 2 * i <= n ? heapTree(2 * i, n) : null, right: 2 * i + 1 <= n ? heapTree(2 * i + 1, n) : null });
const heapLevels = (n: number): number[][] => {
  const out: number[][] = [];
  for (let first = 1; first <= n; first *= 2) out.push(Array.from({ length: Math.min(first, n - first + 1) }, (_, k) => first + k));
  return out;
};

/** Deterministic pseudo-random numbers for big hidden tests. */
const lcg = (seed: number) => () => (seed = (seed * 1103515245 + 12345) % 2147483648);

// ───────────── expected values for the big hidden tests ─────────────
const rand = lcg(7);
const heapValues = Array.from({ length: 2000 }, () => (rand() % 1000) - 500);
const heapOps = [...heapValues.map((v) => ["push", v]), ...heapValues.map(() => ["pop"])];
const heapExpected = [...heapValues].sort((a, b) => a - b);

const rand2 = lcg(99);
const medianValues = Array.from({ length: 1200 }, () => (rand2() % 201) - 100);
const medianOps: (string | number)[][] = [];
const medianExpected: number[] = [];
{
  const sorted: number[] = [];
  for (const v of medianValues) {
    let lo = 0, hi = sorted.length;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (sorted[mid] < v) lo = mid + 1;
      else hi = mid;
    }
    sorted.splice(lo, 0, v);
    medianOps.push(["add", v], ["median"]);
    const n = sorted.length;
    medianExpected.push(n % 2 ? sorted[(n - 1) / 2] : (sorted[n / 2 - 1] + sorted[n / 2]) / 2);
  }
}

const lruBigOps: (string | number)[][] = [];
for (let k = 0; k < 5000; k++) lruBigOps.push(["put", k, k * 2]);
lruBigOps.push(["get", 0], ["get", 4999], ["get", 4000], ["get", 3999]);

const trieWords = Array.from({ length: 300 }, (_, i) => "w" + i.toString(36));
const trieBigOps: string[][] = [...trieWords.map((w) => ["insert", w]), ["count", "w"], ["count", "w1"], ...trieWords.map((w) => ["delete", w]), ["count", "w"], ["prefix", "w"]];
const trieBigExpected: unknown[] = [...trieWords.map(() => null), 300, trieWords.filter((w) => w.startsWith("w1")).length, ...trieWords.map(() => true), 0, false];

const longCycle = Array.from({ length: 5000 }, (_, i) => (i === 4999 ? 2500 : i + 1));
const longList = Array.from({ length: 5000 }, (_, i) => (i === 4999 ? -1 : i + 1));

export const codingChallenges: CodingChallenge[] = [
  {
    id: "ds-cc-01",
    domain: "d1",
    lesson: "ds-arrays",
    level: "junior",
    title: "Move the zeroes",
    idea: "write pointer, O(n)",
    prompt:
      "Write `moveZeroes(nums)` that returns the array with every `0` moved to the end while the other numbers keep their original order. Example: `[0, 1, 0, 3, 12]` becomes `[1, 3, 12, 0, 0]`. Handle empty arrays and arrays without zeroes. Aim for one pass and O(1) extra space.",
    fn: "moveZeroes",
    starter: src`
function moveZeroes(nums) {
  // TODO: keep non-zero numbers in order, push the zeroes to the end
  return nums;
}`,
    tests: [
      t("mixed", [[0, 1, 0, 3, 12]], [1, 3, 12, 0, 0]),
      t("no zeroes", [[1, 2, 3]], [1, 2, 3]),
      t("all zeroes", [[0, 0]], [0, 0]),
      t("empty", [[]], []),
      t("negatives keep order", [[-1, 0, -2]], [-1, -2, 0]),
      t("leading zeroes", [[0, 0, 1]], [1, 0, 0], true),
      t("2000 alternating", [Array.from({ length: 2000 }, (_, i) => (i % 2 ? i : 0))], [...Array.from({ length: 1000 }, (_, i) => 2 * i + 1), ...Array(1000).fill(0)], true),
    ],
    hints: [
      "You only need one pass. What do you know about the numbers you have already looked at?",
      "Keep a write index. Every non-zero number goes to `nums[write]`, then `write` moves forward.",
      "After the loop, everything from `write` to the end must be a zero: fill it.",
    ],
    solution: src`
function moveZeroes(nums) {
  let w = 0;
  for (const n of nums) if (n !== 0) nums[w++] = n;
  while (w < nums.length) nums[w++] = 0;
  return nums;
}`,
    explanation:
      "A write pointer trails the read loop: each non-zero value is copied to the next free slot, so the order is preserved and nothing is overwritten before it is read. The rest of the array is then zero-filled. That is O(n) time and O(1) extra space. Follow-up: how would you minimize the number of writes when zeroes are rare? (Swap only when `w !== i`.)",
  },
  {
    id: "ds-cc-02",
    domain: "d2",
    lesson: "ds-stack",
    level: "junior",
    title: "Balanced brackets",
    idea: "stack, O(n)",
    prompt:
      "Write `isValid(s)` for a string made only of `()[]{}`. Return `true` if every bracket is closed by the right type in the right order, e.g. `\"{[]}\"` is `true` but `\"([)]\"` is `false`. The empty string is valid. Strings can be thousands of characters long.",
    fn: "isValid",
    starter: src`
function isValid(s) {
  // TODO: push openers, check each closer against the top of the stack
  return true;
}`,
    tests: [
      t("simple pair", ["()"], true),
      t("three kinds", ["()[]{}"], true),
      t("wrong closer", ["(]"], false),
      t("interleaved", ["([)]"], false),
      t("nested", ["{[]}"], true),
      t("empty", [""], true),
      t("only an opener", ["("], false),
      t("closer first", [")("], false, true),
      t("deep nesting", ["(".repeat(5000) + ")".repeat(5000)], true, true),
      t("leftover opener", ["([{}])("], false, true),
    ],
    hints: [
      "The most recent unclosed opener must be closed first. Which structure gives you the most recent item?",
      "Use a stack. Push every opener; on a closer, pop and compare with the matching opener.",
      "Return false if the stack is empty when a closer arrives. At the end the stack must be empty.",
    ],
    solution: src`
function isValid(s) {
  const pairs = { ")": "(", "]": "[", "}": "{" };
  const stack = [];
  for (const ch of s) {
    if (ch in pairs) {
      if (stack.pop() !== pairs[ch]) return false;
    } else {
      stack.push(ch);
    }
  }
  return stack.length === 0;
}`,
    explanation:
      "The last opener seen must be the first one closed, which is exactly last-in-first-out. A closer that finds an empty stack or the wrong opener fails immediately, and leftover openers fail at the end. O(n) time, O(n) space in the worst case. Follow-up: what if you also need the index of the first mismatch?",
  },
  {
    id: "ds-cc-03",
    domain: "d1",
    lesson: "ds-arrays",
    level: "intermediate",
    title: "Rotate the array",
    idea: "modulo + slices",
    prompt:
      "Write `rotate(nums, k)` that returns a new array rotated to the right by `k` steps: `rotate([1, 2, 3, 4, 5, 6, 7], 3)` is `[5, 6, 7, 1, 2, 3, 4]`. `k` can be 0 or much larger than the array length, and the array can be empty.",
    fn: "rotate",
    starter: src`
function rotate(nums, k) {
  // TODO: what does rotating by k really mean when k > nums.length?
  return nums;
}`,
    tests: [
      t("classic", [[1, 2, 3, 4, 5, 6, 7], 3], [5, 6, 7, 1, 2, 3, 4]),
      t("k larger than length", [[1, 2], 5], [2, 1]),
      t("empty", [[], 3], []),
      t("single", [[1], 0], [1]),
      t("k is zero", [[1, 2, 3], 0], [1, 2, 3]),
      t("k equals length", [[1, 2, 3], 3], [1, 2, 3]),
      t("negatives", [[-1, -100, 3, 99], 2], [3, 99, -1, -100], true),
      t("huge k", [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 1000000007], [4, 5, 6, 7, 8, 9, 10, 1, 2, 3], true),
    ],
    hints: [
      "Rotating by the length gives the same array back. What does that say about big values of `k`?",
      "Reduce `k` with `k % nums.length` (guard the empty array first).",
      "The last `k` items move to the front: combine `nums.slice(n - k)` and `nums.slice(0, n - k)`.",
    ],
    solution: src`
function rotate(nums, k) {
  const n = nums.length;
  if (n === 0) return [];
  k %= n;
  return [...nums.slice(n - k), ...nums.slice(0, n - k)];
}`,
    explanation:
      "Rotation is periodic in the array length, so only `k % n` matters. The result is the last `k` items followed by the first `n - k`. O(n) time and space. Follow-up: do it in place with O(1) space by reversing the whole array, then the first k and the last n - k items.",
  },
  {
    id: "ds-cc-04",
    domain: "d2",
    lesson: "ds-hashing",
    level: "intermediate",
    title: "Group the anagrams",
    idea: "hash map by canonical key",
    prompt:
      "Write `groupAnagrams(words)` that groups words made of the same letters. Return an array of groups where each group is sorted alphabetically and the groups are ordered by their first word. Example: `[\"eat\",\"tea\",\"tan\",\"ate\",\"nat\",\"bat\"]` gives `[[\"ate\",\"eat\",\"tea\"],[\"bat\"],[\"nat\",\"tan\"]]`. Duplicates stay in their group.",
    fn: "groupAnagrams",
    starter: src`
function groupAnagrams(words) {
  // TODO: find a key that is equal for all anagrams of a word
  return [];
}`,
    tests: [
      t("classic", [["eat", "tea", "tan", "ate", "nat", "bat"]], [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]]),
      t("empty list", [[]], []),
      t("empty string", [[""]], [[""]]),
      t("single word", [["a"]], [["a"]]),
      t("duplicates", [["ab", "ba", "ab"]], [["ab", "ab", "ba"]]),
      t("two groups", [["abc", "bca", "cab", "xyz", "zyx", "abc"]], [["abc", "abc", "bca", "cab"], ["xyz", "zyx"]], true),
      t("three groups", [["listen", "silent", "enlist", "google", "gogole", "cat", "act"]], [["act", "cat"], ["enlist", "listen", "silent"], ["gogole", "google"]], true),
    ],
    hints: [
      "Two words are anagrams exactly when their letters match once sorted.",
      "Use a `Map` from that sorted-letters key to the list of words that share it.",
      "At the end sort each group, then sort the groups by their first word.",
    ],
    solution: src`
function groupAnagrams(words) {
  const groups = new Map();
  for (const w of words) {
    const key = [...w].sort().join("");
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(w);
  }
  return [...groups.values()]
    .map((g) => g.sort())
    .sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0));
}`,
    explanation:
      "A canonical key (the sorted letters) turns \"is this an anagram of that\" into a hash lookup, so grouping is O(n * k log k) for n words of length k. A faster key is a 26-slot letter count, giving O(n * k). Follow-up: what key would you use for Unicode text? (Count in a Map, or normalize first.)",
  },
  {
    id: "ds-cc-05",
    domain: "d3",
    lesson: "ds-traversal",
    level: "intermediate",
    title: "Level-order traversal",
    idea: "BFS by level",
    prompt:
      "A binary tree node is `{ val, left, right }` (missing children are `null` or absent). Write `levelOrder(root)` that returns the values level by level, top to bottom, left to right: a tree with root `3`, children `9` and `20`, and `20` having children `15` and `7` gives `[[3],[9,20],[15,7]]`. An empty tree (`null`) gives `[]`.",
    fn: "levelOrder",
    starter: src`
function levelOrder(root) {
  // TODO: process the tree one whole level at a time
  return [];
}`,
    tests: [
      t("classic", [{ val: 3, left: { val: 9 }, right: { val: 20, left: { val: 15 }, right: { val: 7 } } }], [[3], [9, 20], [15, 7]]),
      t("empty tree", [null], []),
      t("single node", [{ val: 1 }], [[1]]),
      t("left chain", [{ val: 1, left: { val: 2, left: { val: 3 } } }], [[1], [2], [3]]),
      t("only right child", [{ val: 1, left: null, right: { val: 2, left: null, right: null } }], [[1], [2]]),
      t("perfect tree of 15", [heapTree(1, 15)], heapLevels(15), true),
      t("100 nodes", [heapTree(1, 100)], heapLevels(100), true),
    ],
    hints: [
      "Breadth-first search visits nodes in level order. What do you need to know to separate one level from the next?",
      "Keep the current level as an array. Record its values, then build the next level from its children.",
      "`level = level.flatMap((n) => [n.left, n.right]).filter(Boolean)` builds the next level; stop when it is empty.",
    ],
    solution: src`
function levelOrder(root) {
  if (!root) return [];
  const out = [];
  let level = [root];
  while (level.length) {
    out.push(level.map((n) => n.val));
    level = level.flatMap((n) => [n.left, n.right]).filter(Boolean);
  }
  return out;
}`,
    explanation:
      "Holding the whole current level in an array makes the level boundaries explicit, so no sentinel or size counter is needed. Each node is handled once: O(n) time, and O(w) space for the widest level. Follow-up: how do you produce a zig-zag order, or the right-side view? (Reverse alternate levels; take the last item of each.)",
  },
  {
    id: "ds-cc-06",
    domain: "d2",
    lesson: "ds-hashmap",
    level: "senior",
    title: "LRU cache",
    idea: "hash map + recency order, O(1)",
    prompt:
      "Implement an LRU cache as `runLRU(capacity, ops)`. Each op is `[\"put\", key, value]` or `[\"get\", key]`. A `get` returns the value, or `-1` if the key is missing, and marks the key as most recently used. A `put` inserts or updates a key (also marking it most recently used); when the size goes above `capacity` the least recently used key is evicted. Return the results of the `get` ops, in order. Both operations should be O(1).",
    fn: "runLRU",
    starter: src`
function runLRU(capacity, ops) {
  // TODO: a Map remembers insertion order; how can you refresh a key?
  const results = [];
  return results;
}`,
    tests: [
      t("classic sequence", [2, [["put", 1, 1], ["put", 2, 2], ["get", 1], ["put", 3, 3], ["get", 2], ["put", 4, 4], ["get", 1], ["get", 3], ["get", 4]]], [1, -1, -1, 3, 4]),
      t("capacity one", [1, [["put", 1, 1], ["put", 2, 2], ["get", 1], ["get", 2]]], [-1, 2]),
      t("update refreshes", [2, [["put", 1, 1], ["put", 2, 2], ["put", 1, 10], ["put", 3, 3], ["get", 1], ["get", 2], ["get", 3]]], [10, -1, 3]),
      t("get refreshes", [2, [["put", 1, 1], ["put", 2, 2], ["get", 1], ["put", 3, 3], ["get", 2], ["get", 1]]], [1, -1, 1]),
      t("missing key", [3, [["get", 9]]], [-1]),
      t("no ops", [2, []], []),
      t("update does not evict", [2, [["put", 1, 1], ["put", 2, 2], ["put", 2, 20], ["put", 1, 11], ["get", 1], ["get", 2]]], [11, 20], true),
      t("5000 puts, capacity 1000", [1000, lruBigOps], [-1, 9998, 8000, -1], true),
    ],
    hints: [
      "You need O(1) lookup and O(1) 'which key is oldest'. One structure gives lookup, another gives order, or one JavaScript structure gives both.",
      "A `Map` iterates in insertion order. Deleting a key and setting it again moves it to the end (most recent).",
      "The oldest key is `map.keys().next().value`. After a `put`, if `map.size > capacity`, delete that key.",
    ],
    solution: src`
function runLRU(capacity, ops) {
  const cache = new Map();
  const results = [];
  for (const [op, key, value] of ops) {
    if (op === "get") {
      if (!cache.has(key)) {
        results.push(-1);
      } else {
        const v = cache.get(key);
        cache.delete(key);
        cache.set(key, v);
        results.push(v);
      }
    } else {
      cache.delete(key);
      cache.set(key, value);
      if (cache.size > capacity) cache.delete(cache.keys().next().value);
    }
  }
  return results;
}`,
    explanation:
      "A JavaScript Map is a hash table that also remembers insertion order, so \"delete then set\" is an O(1) move-to-back and the first key is always the least recently used. Classic interviews build the same thing from a hash map plus a doubly linked list. Follow-up: how would you make it thread-safe, or add a time-to-live per entry?",
  },
  {
    id: "ds-cc-07",
    domain: "d3",
    lesson: "ds-heap",
    level: "senior",
    title: "Binary min-heap",
    idea: "array heap, sift up / down",
    prompt:
      "Implement a binary min-heap as `runMinHeap(ops)`. Ops are `[\"push\", x]`, `[\"pop\"]` (remove and return the smallest), `[\"peek\"]` (return the smallest without removing it) and `[\"size\"]`. Return, in order, the result of every `pop`, `peek` and `size` op; `pop` and `peek` on an empty heap give `null`. Duplicates and negatives are allowed. Push and pop must be O(log n), so do not re-sort the array on every push.",
    fn: "runMinHeap",
    starter: src`
function runMinHeap(ops) {
  // TODO: store the heap in an array; parent of i is (i - 1) >> 1
  const out = [];
  return out;
}`,
    tests: [
      t("push, peek, pop", [[["push", 5], ["push", 3], ["push", 8], ["peek"], ["pop"], ["pop"], ["size"], ["pop"], ["pop"]]], [3, 3, 5, 1, 8, null]),
      t("empty heap", [[["pop"], ["peek"], ["size"]]], [null, null, 0]),
      t("duplicates", [[["push", 2], ["push", 2], ["push", 1], ["pop"], ["pop"], ["pop"]]], [1, 2, 2]),
      t("negatives", [[["push", -1], ["push", -5], ["push", 0], ["pop"], ["peek"]]], [-5, -1]),
      t("no ops", [[]], []),
      t("interleaved", [[["push", 4], ["pop"], ["push", 1], ["push", 9], ["peek"], ["push", 0], ["pop"], ["size"]]], [4, 1, 0, 2]),
      t("2000 random pushes then pops", [heapOps], heapExpected, true),
      t("descending pushes", [[...[9, 8, 7, 6, 5, 4, 3, 2, 1].map((v) => ["push", v]), ...Array.from({ length: 9 }, () => ["pop"])]], [1, 2, 3, 4, 5, 6, 7, 8, 9], true),
    ],
    hints: [
      "A heap is a complete binary tree stored in an array: the children of index `i` are `2i + 1` and `2i + 2`.",
      "push: append the value, then swap it up while it is smaller than its parent. pop: save the root, move the last item to the root, then swap it down with the smaller child.",
      "In sift-down, stop when both children are missing or neither is smaller than the moving item.",
    ],
    solution: src`
function runMinHeap(ops) {
  const h = [];
  const out = [];
  const swap = (i, j) => ([h[i], h[j]] = [h[j], h[i]]);
  const up = (i) => {
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (h[p] <= h[i]) break;
      swap(p, i);
      i = p;
    }
  };
  const down = (i) => {
    for (;;) {
      let m = i;
      const l = 2 * i + 1, r = l + 1;
      if (l < h.length && h[l] < h[m]) m = l;
      if (r < h.length && h[r] < h[m]) m = r;
      if (m === i) return;
      swap(i, m);
      i = m;
    }
  };
  for (const [op, x] of ops) {
    if (op === "push") {
      h.push(x);
      up(h.length - 1);
    } else if (op === "pop") {
      if (h.length === 0) { out.push(null); continue; }
      const top = h[0];
      const last = h.pop();
      if (h.length) { h[0] = last; down(0); }
      out.push(top);
    } else if (op === "peek") {
      out.push(h.length ? h[0] : null);
    } else {
      out.push(h.length);
    }
  }
  return out;
}`,
    explanation:
      "The array layout makes parent and child lookups pure index arithmetic, and the heap property (parent <= children) is repaired along a single root-to-leaf path, so push and pop are O(log n). Building a heap from n items can be O(n) with bottom-up heapify. Follow-up: how would you get the k largest of a stream? (Keep a min-heap of size k.)",
  },
  {
    id: "ds-cc-08",
    domain: "d4",
    lesson: "ds-graph-rep",
    level: "senior",
    title: "Topological order",
    idea: "Kahn's algorithm + cycle check",
    prompt:
      "Courses are numbered `0..n-1` and each edge `[a, b]` means `a` must come before `b`. Write `topoSort(n, edges)` returning a valid order. To make the answer unique, whenever several courses are ready, take the smallest number first. If the graph has a cycle, return `[]`. Example: `topoSort(4, [[0,1],[0,2],[1,3],[2,3]])` is `[0,1,2,3]`. Duplicate edges and `n = 0` are possible.",
    fn: "topoSort",
    starter: src`
function topoSort(n, edges) {
  // TODO: count incoming edges; repeatedly take a node with none left
  return [];
}`,
    tests: [
      t("diamond", [4, [[0, 1], [0, 2], [1, 3], [2, 3]]], [0, 1, 2, 3]),
      t("no edges", [3, []], [0, 1, 2]),
      t("reverse edge", [2, [[1, 0]]], [1, 0]),
      t("cycle", [3, [[0, 1], [1, 2], [2, 0]]], []),
      t("single node", [1, []], [0]),
      t("no nodes", [0, []], []),
      t("smallest ready first", [6, [[5, 2], [5, 0], [4, 0], [4, 1], [2, 3], [3, 1]]], [4, 5, 0, 2, 3, 1]),
      t("self loop", [2, [[0, 0]]], [], true),
      t("cycle after a prefix", [4, [[0, 1], [1, 2], [2, 1], [3, 0]]], [], true),
      t("duplicate edges", [2, [[0, 1], [0, 1]]], [0, 1], true),
      t("chain of 2000", [2000, Array.from({ length: 1999 }, (_, i) => [i + 1, i])], Array.from({ length: 2000 }, (_, i) => 1999 - i), true),
    ],
    hints: [
      "A node can go first only when nothing is waiting on it. How can you track that cheaply for every node?",
      "Compute each node's in-degree. Start with all in-degree-0 nodes; taking one decrements its neighbours' in-degrees.",
      "If you output fewer than `n` nodes, some nodes never reached in-degree 0, so there is a cycle: return `[]`. For the smallest-first rule, pick the minimum of the ready set each time.",
    ],
    solution: src`
function topoSort(n, edges) {
  const adj = Array.from({ length: n }, () => []);
  const indeg = Array(n).fill(0);
  for (const [a, b] of edges) {
    adj[a].push(b);
    indeg[b]++;
  }
  const ready = [];
  for (let i = 0; i < n; i++) if (indeg[i] === 0) ready.push(i);
  const order = [];
  while (ready.length) {
    let m = 0;
    for (let i = 1; i < ready.length; i++) if (ready[i] < ready[m]) m = i;
    const node = ready.splice(m, 1)[0];
    order.push(node);
    for (const next of adj[node]) if (--indeg[next] === 0) ready.push(next);
  }
  return order.length === n ? order : [];
}`,
    explanation:
      "Kahn's algorithm repeatedly removes a node with no remaining prerequisites; if the graph is acyclic every node is eventually removed, otherwise the cycle's nodes never reach in-degree 0 and the output is short. It runs in O(V + E) with a plain queue; the smallest-first rule here needs a min-heap for O((V + E) log V) (the scan above is fine for small ready sets). Follow-up: how would you report which nodes form the cycle?",
  },
  {
    id: "ds-cc-09",
    domain: "d4",
    lesson: "ds-trie",
    level: "staff",
    title: "Trie with counts and delete",
    idea: "prefix counts on every node",
    prompt:
      "Implement a trie service as `runTrie(ops)`. Ops are `[\"insert\", w]` (returns `null`; inserting an existing word changes nothing), `[\"search\", w]` (is `w` a stored word?), `[\"prefix\", p]` (does any stored word start with `p`?), `[\"count\", p]` (how many distinct stored words start with `p`; the empty prefix counts all) and `[\"delete\", w]` (returns `true` if the word was stored and is now removed, else `false`). Return the result of every op, in order. Deleting `\"app\"` must not remove `\"apple\"`.",
    fn: "runTrie",
    starter: src`
function runTrie(ops) {
  // TODO: each node can store how many words pass through it
  const out = [];
  return out;
}`,
    tests: [
      t("insert, search, prefix, delete", [[["insert", "apple"], ["insert", "app"], ["search", "app"], ["search", "ap"], ["prefix", "ap"], ["count", "ap"], ["delete", "app"], ["search", "app"], ["count", "ap"], ["search", "apple"], ["delete", "app"]]], [null, null, true, false, true, 2, true, false, 1, true, false]),
      t("duplicate insert", [[["insert", "a"], ["insert", "a"], ["count", "a"]]], [null, null, 1]),
      t("empty prefix", [[["insert", "x"], ["insert", "y"], ["count", ""], ["prefix", ""]]], [null, null, 2, true]),
      t("empty trie", [[["search", "a"], ["prefix", "a"], ["count", "a"], ["delete", "a"]]], [false, false, 0, false]),
      t("delete clears the prefix", [[["insert", "hi"], ["delete", "hi"], ["prefix", "h"], ["count", "h"]]], [null, true, false, 0]),
      t("prefix is not a word", [[["insert", "hi"], ["delete", "h"], ["search", "hi"]]], [null, false, true]),
      t("delete one of two", [[["insert", "car"], ["insert", "cart"], ["delete", "cart"], ["search", "car"], ["prefix", "cart"], ["count", "c"]]], [null, null, true, true, false, 1], true),
      t("300 words, then delete all", [trieBigOps], trieBigExpected, true),
    ],
    hints: [
      "A trie node maps a letter to the next node and can be flagged as the end of a word. Counting words under a prefix needs one more piece of data per node.",
      "Store `n` on every node: the number of stored words whose path goes through it. `count(p)` is then the `n` of the node you reach by walking `p`.",
      "Insert only if the word is not already stored, incrementing `n` along the path. Delete walks the path again, decrements `n`, and clears the end flag; remove a child whose `n` reaches 0.",
    ],
    solution: src`
function runTrie(ops) {
  const root = { kids: new Map(), end: false, n: 0 };
  const out = [];
  const find = (s) => {
    let node = root;
    for (const ch of s) {
      node = node.kids.get(ch);
      if (!node) return null;
    }
    return node;
  };
  for (const [op, w] of ops) {
    const node = find(w);
    if (op === "insert") {
      if (!(node && node.end)) {
        let cur = root;
        cur.n++;
        for (const ch of w) {
          if (!cur.kids.has(ch)) cur.kids.set(ch, { kids: new Map(), end: false, n: 0 });
          cur = cur.kids.get(ch);
          cur.n++;
        }
        cur.end = true;
      }
      out.push(null);
    } else if (op === "search") {
      out.push(!!(node && node.end));
    } else if (op === "prefix") {
      out.push(!!node && node.n > 0);
    } else if (op === "count") {
      out.push(node ? node.n : 0);
    } else if (node && node.end) {
      let cur = root;
      cur.n--;
      for (const ch of w) {
        const child = cur.kids.get(ch);
        child.n--;
        if (child.n === 0) cur.kids.delete(ch);
        cur = child;
      }
      cur.end = false;
      out.push(true);
    } else {
      out.push(false);
    }
  }
  return out;
}`,
    explanation:
      "Storing a pass-through counter on every node makes count-by-prefix O(length of the prefix), independent of how many words exist; delete reverses the insert and prunes dead branches so memory does not leak. All operations are O(L) for a word of length L. Follow-up: how would you return the top 3 most frequent completions? (Cache the best few per node, or walk the subtree with a heap.)",
  },
  {
    id: "ds-cc-10",
    domain: "d3",
    lesson: "ds-heap",
    level: "staff",
    title: "Running median",
    idea: "two heaps, O(log n) per add",
    prompt:
      "Design a running-median service as `runMedian(ops)`. Ops are `[\"add\", x]` (store a number) and `[\"median\"]`. Return the result of every `median` op in order: the middle value, or the average of the two middle values when the count is even (so it can be `1.5`). The median of nothing is `null`. Each add should be O(log n) and each median O(1); re-sorting everything per query is too slow for streams.",
    fn: "runMedian",
    starter: src`
function runMedian(ops) {
  // TODO: keep the smaller half and the larger half in two heaps
  const out = [];
  return out;
}`,
    tests: [
      t("1, 2, 3", [[["add", 1], ["add", 2], ["median"], ["add", 3], ["median"]]], [1.5, 2]),
      t("empty", [[["median"]]], [null]),
      t("negatives", [[["add", -5], ["median"], ["add", -1], ["median"], ["add", -3], ["median"]]], [-5, -3, -3]),
      t("duplicates", [[["add", 4], ["add", 4], ["median"], ["add", 4], ["add", 10], ["median"]]], [4, 4]),
      t("descending adds", [[["add", 5], ["add", 4], ["add", 3], ["add", 2], ["median"], ["add", 1], ["median"]]], [3.5, 3]),
      t("no ops", [[]], []),
      t("median after every add (1200 values)", [medianOps], medianExpected, true),
      t("ascending 1..1001", [[...Array.from({ length: 1001 }, (_, i) => ["add", i + 1]), ["median"]]], [501], true),
    ],
    hints: [
      "The median only needs the middle of the sorted data, not the whole sorted order.",
      "Keep a max-heap for the smaller half and a min-heap for the larger half, sized so the lower half has equal or one more item.",
      "Add: push into the lower half, move its top to the upper half, then rebalance if the upper half is bigger. Median is a heap top or the average of both tops. JavaScript has no heap built in: write a small one with a comparator.",
    ],
    solution: src`
function runMedian(ops) {
  class Heap {
    constructor(less) { this.a = []; this.less = less; }
    get size() { return this.a.length; }
    peek() { return this.a[0]; }
    push(x) {
      const a = this.a;
      a.push(x);
      let i = a.length - 1;
      while (i > 0) {
        const p = (i - 1) >> 1;
        if (!this.less(a[i], a[p])) break;
        [a[i], a[p]] = [a[p], a[i]];
        i = p;
      }
    }
    pop() {
      const a = this.a;
      const top = a[0];
      const last = a.pop();
      if (a.length) {
        a[0] = last;
        let i = 0;
        for (;;) {
          let m = i;
          const l = 2 * i + 1, r = l + 1;
          if (l < a.length && this.less(a[l], a[m])) m = l;
          if (r < a.length && this.less(a[r], a[m])) m = r;
          if (m === i) break;
          [a[i], a[m]] = [a[m], a[i]];
          i = m;
        }
      }
      return top;
    }
  }
  const lo = new Heap((x, y) => x > y);
  const hi = new Heap((x, y) => x < y);
  const out = [];
  for (const [op, x] of ops) {
    if (op === "add") {
      lo.push(x);
      hi.push(lo.pop());
      if (hi.size > lo.size) lo.push(hi.pop());
    } else if (lo.size === 0) {
      out.push(null);
    } else {
      out.push(lo.size > hi.size ? lo.peek() : (lo.peek() + hi.peek()) / 2);
    }
  }
  return out;
}`,
    explanation:
      "Splitting the data into a lower half (max-heap) and an upper half (min-heap) keeps the two middle elements at the heap tops, so a query is O(1) and each add touches a constant number of heap operations, O(log n). The invariant is that every lower value is at most every upper value and the sizes differ by at most one. Follow-up: how would you support a sliding window of the last k numbers? (Lazy deletion, or an order-statistic tree.)",
  },
  {
    id: "ds-cc-11",
    domain: "d1",
    lesson: "ds-pointers",
    level: "senior",
    title: "Where does the cycle start?",
    idea: "Floyd tortoise and hare, O(1) space",
    prompt:
      "A linked list is described by an array `next`: node `i` points to node `next[i]`, and `-1` means the end. The head is node `0`. Write `cycleStart(next)` that returns the index of the node where a cycle begins, or `-1` if the list ends. Example: `[1, 2, 3, 1]` has a cycle starting at node `1`; `[1, 2, -1]` has none. An empty array gives `-1`. Use O(1) extra space (no visited set).",
    fn: "cycleStart",
    starter: src`
function cycleStart(next) {
  // TODO: two pointers moving at different speeds meet inside a cycle
  return -1;
}`,
    tests: [
      t("tail loops to 1", [[1, 2, 3, 1]], 1),
      t("no cycle", [[1, 2, -1]], -1),
      t("self loop at head", [[0]], 0),
      t("single end node", [[-1]], -1),
      t("two-node ring", [[1, 0]], 0),
      t("cycle at 2", [[1, 2, 3, 4, 2]], 2),
      t("three-node ring", [[1, 2, 0]], 0),
      t("empty", [[]], -1),
      t("long list, cycle at 2500", [longCycle], 2500, true),
      t("long list, no cycle", [longList], -1, true),
    ],
    hints: [
      "If you walk two pointers, one twice as fast, what happens if there is a cycle? What if there is not?",
      "Phase 1: move `slow` one step and `fast` two steps. If `fast` hits `-1` there is no cycle; if they meet, there is one.",
      "Phase 2: reset `slow` to the head and move both one step at a time. They meet at the cycle's first node.",
    ],
    solution: src`
function cycleStart(next) {
  if (next.length === 0) return -1;
  let slow = 0, fast = 0;
  for (;;) {
    const one = next[fast];
    if (one === -1) return -1;
    fast = next[one];
    if (fast === -1) return -1;
    slow = next[slow];
    if (slow === fast) break;
  }
  slow = 0;
  while (slow !== fast) {
    slow = next[slow];
    fast = next[fast];
  }
  return slow;
}`,
    explanation:
      "Floyd's algorithm: inside a cycle the fast pointer gains one node per step on the slow one, so they must meet. If the head is a distance a from the cycle start, then walking one pointer from the head and one from the meeting point, both one step at a time, makes them meet exactly at the cycle start. O(n) time and O(1) space, versus O(n) space for a visited set. Follow-up: how would you also compute the cycle length?",
  },
];
