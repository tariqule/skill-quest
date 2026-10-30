import type { CodingChallenge, CodingTest } from "@/engine/types";

/** Tagged template for code text: raw (no escape processing), leading newline and trailing space trimmed. */
const src = (s: TemplateStringsArray) => s.raw[0].replace(/^\n/, "").replace(/\s+$/, "") + "\n";

const t = (name: string, args: unknown[], expected: unknown, hidden = false): CodingTest => (hidden ? { name, args, expected, hidden } : { name, args, expected });

/** Deterministic pseudo-random numbers for big hidden tests. */
const lcg = (seed: number) => () => (seed = (seed * 1103515245 + 12345) % 2147483648);

// ───────────── expected values for the generated hidden tests (computed by independent brute force) ─────────────
const fizz = (n: number) => Array.from({ length: n }, (_, i) => ((i + 1) % 15 === 0 ? "FizzBuzz" : (i + 1) % 3 === 0 ? "Fizz" : (i + 1) % 5 === 0 ? "Buzz" : String(i + 1)));

const evens = Array.from({ length: 100000 }, (_, i) => i * 2);

const reversedIntervals = Array.from({ length: 1000 }, (_, i) => [(999 - i) * 3, (999 - i) * 3 + 1]);
const sortedIntervals = Array.from({ length: 1000 }, (_, i) => [i * 3, i * 3 + 1]);
const chainIntervals = Array.from({ length: 1000 }, (_, i) => [999 - i, 999 - i + 2]);

const parens = (n: number): string[] => {
  const out: string[] = [];
  for (let m = 0; m < 1 << (2 * n); m++) {
    let s = "", bal = 0, ok = true;
    for (let k = 2 * n - 1; k >= 0; k--) {
      const open = !((m >> k) & 1);
      s += open ? "(" : ")";
      bal += open ? 1 : -1;
      if (bal < 0) { ok = false; break; }
    }
    if (ok && bal === 0) out.push(s);
  }
  return out.sort();
};

const serpentine = (n: number) =>
  Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => (r % 2 === 0 ? 0 : r % 4 === 1 ? (c === n - 1 ? 0 : 1) : c === 0 ? 0 : 1)));

const allOnes = (r: number, c: number) => Array.from({ length: r }, () => Array(c).fill(1));
const checkerboard = (n: number) => Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, c) => ((r + c) % 2 === 0 ? 1 : 0)));

const rand = lcg(2024);
const inversionInput = Array.from({ length: 1500 }, () => rand() % 500);
const inversionExpected = (() => {
  let n = 0;
  for (let i = 0; i < inversionInput.length; i++) for (let j = i + 1; j < inversionInput.length; j++) if (inversionInput[i] > inversionInput[j]) n++;
  return n;
})();

const rateExpected = (limit: number, windowMs: number, times: number[]) => {
  const allowed: number[] = [];
  return times.map((x) => {
    const inWindow = allowed.filter((a) => a > x - windowMs).length;
    if (inWindow < limit) { allowed.push(x); return true; }
    return false;
  });
};
const everyMs = Array.from({ length: 3000 }, (_, i) => i);
const bursty = Array.from({ length: 1000 }, (_, i) => Math.floor(i / 7) * 5);
const farApart = Array.from({ length: 500 }, (_, i) => i * 1000);

export const codingChallenges: CodingChallenge[] = [
  {
    id: "algo-cc-01",
    domain: "d1",
    lesson: "algo-growth",
    level: "junior",
    title: "FizzBuzz",
    idea: "loop + modulo, O(n)",
    prompt:
      "Write `fizzBuzz(n)` that returns an array of strings for the numbers 1 to `n`: `\"Fizz\"` for multiples of 3, `\"Buzz\"` for multiples of 5, `\"FizzBuzz\"` for multiples of both, otherwise the number as a string. `fizzBuzz(5)` is `[\"1\",\"2\",\"Fizz\",\"4\",\"Buzz\"]`. `n = 0` gives an empty array.",
    fn: "fizzBuzz",
    starter: src`
function fizzBuzz(n) {
  // TODO: build the list for 1..n
  return [];
}`,
    tests: [
      t("n = 5", [5], ["1", "2", "Fizz", "4", "Buzz"]),
      t("n = 15 ends with FizzBuzz", [15], fizz(15)),
      t("n = 1", [1], ["1"]),
      t("n = 0", [0], []),
      t("n = 3", [3], ["1", "2", "Fizz"]),
      t("n = 30", [30], fizz(30), true),
      t("n = 1000", [1000], fizz(1000), true),
    ],
    hints: [
      "Loop from 1 to `n` and decide what to push for each number.",
      "Check the combined case (multiple of 15) first, otherwise `Fizz` or `Buzz` would win too early.",
      "Use `i % 15 === 0`, then `i % 3 === 0`, then `i % 5 === 0`, else `String(i)`.",
    ],
    solution: src`
function fizzBuzz(n) {
  const out = [];
  for (let i = 1; i <= n; i++) {
    if (i % 15 === 0) out.push("FizzBuzz");
    else if (i % 3 === 0) out.push("Fizz");
    else if (i % 5 === 0) out.push("Buzz");
    else out.push(String(i));
  }
  return out;
}`,
    explanation:
      "It's one pass, checking the most specific rule first, so it runs in O(n) time. A multiple of 15 is also a multiple of 3 and of 5, so testing 15 first avoids the classic ordering bug. Follow-up: how would you make the rules configurable, like a list of `[divisor, word]` pairs? (Join the words for every divisor that matches.)",
  },
  {
    id: "algo-cc-02",
    domain: "d2",
    lesson: "algo-binary-search",
    level: "junior",
    title: "Binary search",
    idea: "halve the range, O(log n)",
    prompt:
      "Write `binarySearch(nums, target)` for an array sorted ascending with no duplicates. Return the index of `target`, or `-1` if it is not there. `binarySearch([-1, 0, 3, 5, 9, 12], 9)` is `4`. It must handle an empty array and run in O(log n).",
    fn: "binarySearch",
    starter: src`
function binarySearch(nums, target) {
  // TODO: keep a [lo, hi] range and cut it in half each step
  return -1;
}`,
    tests: [
      t("found in the middle-right", [[-1, 0, 3, 5, 9, 12], 9], 4),
      t("missing between values", [[-1, 0, 3, 5, 9, 12], 2], -1),
      t("single item found", [[5], 5], 0),
      t("single item missing", [[5], 4], -1),
      t("empty array", [[], 1], -1),
      t("last of two", [[1, 3], 3], 1),
      t("first item", [[1, 3, 5, 7], 1], 0, true),
      t("100000 even numbers: found", [evens, 199998], 99999, true),
      t("100000 even numbers: odd target missing", [evens, 99999], -1, true),
      t("above the maximum", [evens, 1000000], -1, true),
    ],
    hints: [
      "Because the array is sorted, comparing with the middle element tells you which half can contain the target.",
      "Keep `lo` and `hi` as inclusive bounds. Compute `mid`, compare, then move `lo = mid + 1` or `hi = mid - 1`.",
      "Loop `while (lo <= hi)`. If the loop ends without a match, the target isn't there, so return `-1`.",
    ],
    solution: src`
function binarySearch(nums, target) {
  let lo = 0, hi = nums.length - 1;
  while (lo <= hi) {
    const mid = lo + ((hi - lo) >> 1);
    if (nums[mid] === target) return mid;
    if (nums[mid] < target) lo = mid + 1;
    else hi = mid - 1;
  }
  return -1;
}`,
    explanation:
      "Each comparison throws away half of what's left, so it takes at most about log2(n) steps. Off-by-one bugs hide in two places: the loop condition (`<=` when both ends count) and the `mid +/- 1` updates. Follow-up: how would you find the first or last copy of a repeated value? (Don't stop on a match. Keep searching left or right.)",
  },
  {
    id: "algo-cc-03",
    domain: "d1",
    lesson: "algo-sort-choice",
    level: "intermediate",
    title: "Merge intervals",
    idea: "sort by start, then sweep",
    prompt:
      "Write `mergeIntervals(intervals)` that merges all overlapping intervals and returns them sorted by start. Intervals are `[start, end]`; intervals that touch (`[1,4]` and `[4,5]`) merge too. `[[1,3],[2,6],[8,10],[15,18]]` becomes `[[1,6],[8,10],[15,18]]`. The input is not sorted and can be empty.",
    fn: "mergeIntervals",
    starter: src`
function mergeIntervals(intervals) {
  // TODO: what order makes overlaps easy to spot?
  return intervals;
}`,
    tests: [
      t("classic", [[[1, 3], [2, 6], [8, 10], [15, 18]]], [[1, 6], [8, 10], [15, 18]]),
      t("touching merge", [[[1, 4], [4, 5]]], [[1, 5]]),
      t("unsorted input", [[[8, 10], [1, 3], [2, 6]]], [[1, 6], [8, 10]]),
      t("empty", [[]], []),
      t("single", [[[5, 7]]], [[5, 7]]),
      t("one contains the rest", [[[1, 10], [2, 3], [4, 5]]], [[1, 10]]),
      t("1000 disjoint, reversed", [reversedIntervals], sortedIntervals, true),
      t("1000 overlapping chain", [chainIntervals], [[0, 1001]], true),
    ],
    hints: [
      "If the intervals were sorted by start, which neighbours could overlap?",
      "Sort by start. Keep the last merged interval; if the next one starts at or before its end, extend the end with `Math.max`.",
      "Otherwise, push the next interval as a new one. One interval can contain the next, so use max instead of just copying the end.",
    ],
    solution: src`
function mergeIntervals(intervals) {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0]);
  const out = [];
  for (const [s, e] of sorted) {
    const last = out[out.length - 1];
    if (last && s <= last[1]) last[1] = Math.max(last[1], e);
    else out.push([s, e]);
  }
  return out;
}`,
    explanation:
      "Once the intervals are sorted by start, any overlap must be with the interval you merged most recently, so one pass is enough. That's O(n log n) for the sort plus O(n) for the pass. `Math.max` handles an interval that sits completely inside the previous one. Follow-up: how would you insert a new interval into an already merged list in O(n)?",
  },
  {
    id: "algo-cc-04",
    domain: "d2",
    lesson: "algo-sliding-window",
    level: "intermediate",
    title: "Longest unique substring",
    idea: "sliding window + last-seen map",
    prompt:
      "Write `lengthOfLongestSubstring(s)` that returns the length of the longest substring of `s` with no repeated characters. `\"abcabcbb\"` gives `3` (`\"abc\"`), `\"bbbbb\"` gives `1`, `\"pwwkew\"` gives `3`. The empty string gives `0`. The string can be 10,000 characters long, so aim for O(n).",
    fn: "lengthOfLongestSubstring",
    starter: src`
function lengthOfLongestSubstring(s) {
  // TODO: grow a window to the right; shrink it when a character repeats
  return 0;
}`,
    tests: [
      t("abcabcbb", ["abcabcbb"], 3),
      t("all the same", ["bbbbb"], 1),
      t("pwwkew", ["pwwkew"], 3),
      t("empty", [""], 0),
      t("one character", ["a"], 1),
      t("abba (old repeat behind the window)", ["abba"], 2),
      t("dvdf", ["dvdf"], 3),
      t("tmmzuxt", ["tmmzuxt"], 5, true),
      t("10000 chars, two letters", ["ab".repeat(5000)], 2, true),
      t("alphabet repeated", ["abcdefghijklmnopqrstuvwxyz".repeat(100)], 26, true),
    ],
    hints: [
      "Keep a window `[start, i]` that never contains a repeated character.",
      "Remember the last index where each character appeared. When you see one again inside the window, move `start` just past it.",
      "Never move `start` backwards: use `start = Math.max(start, last.get(ch) + 1)`.",
    ],
    solution: src`
function lengthOfLongestSubstring(s) {
  const last = new Map();
  let start = 0, best = 0;
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (last.has(ch)) start = Math.max(start, last.get(ch) + 1);
    last.set(ch, i);
    best = Math.max(best, i - start + 1);
  }
  return best;
}`,
    explanation:
      "The window only ever moves right. A map of where each character was last seen lets `start` jump straight past a repeat instead of shrinking one step at a time. That's O(n) time and O(k) space for k different characters. `Math.max` protects against an old index from before the window, as in `abba`. Follow-up: return the substring itself, or allow at most two different characters.",
  },
  {
    id: "algo-cc-05",
    domain: "d3",
    lesson: "algo-backtracking",
    level: "intermediate",
    title: "Generate parentheses",
    idea: "backtracking with a balance rule",
    prompt:
      "Write `generateParentheses(n)` that returns every well-formed string of `n` pairs of parentheses, in alphabetical order (`(` sorts before `)`). `generateParentheses(2)` is `[\"(())\",\"()()\"]`. `n = 0` gives `[\"\"]`.",
    fn: "generateParentheses",
    starter: src`
function generateParentheses(n) {
  // TODO: build the string one character at a time, only making valid choices
  return [];
}`,
    tests: [
      t("n = 1", [1], ["()"]),
      t("n = 2", [2], ["(())", "()()"]),
      t("n = 3", [3], ["((()))", "(()())", "(())()", "()(())", "()()()"]),
      t("n = 0", [0], [""]),
      t("n = 4 (14 strings)", [4], parens(4)),
      t("n = 6 (132 strings)", [6], parens(6), true),
      t("n = 8 (1430 strings)", [8], parens(8), true),
    ],
    hints: [
      "Build the string left to right. At each position you choose `(` or `)`. Which choices can never lead to a valid string?",
      "You can add `(` while you've used fewer than `n` of them. You can add `)` only if it wouldn't close more than you've opened.",
      "Recurse with counts `open` and `close`; when the string length is `2n`, record it. Trying `(` before `)` yields alphabetical order for free.",
    ],
    solution: src`
function generateParentheses(n) {
  const out = [];
  (function build(cur, open, close) {
    if (cur.length === 2 * n) {
      out.push(cur);
      return;
    }
    if (open < n) build(cur + "(", open + 1, close);
    if (close < open) build(cur + ")", open, close + 1);
  })("", 0, 0);
  return out;
}`,
    explanation:
      "Because you only ever make valid choices, the search never wastes time on a prefix that can't work. The number of answers is the Catalan number C(n), and the work is that count times n. Trying `(` before `)` makes the results come out in alphabetical order. Follow-up: how many strings are there when n is 10, and how would you count them without building them? (DP over the Catalan recurrence.)",
  },
  {
    id: "algo-cc-06",
    domain: "d4",
    lesson: "algo-dp-patterns",
    level: "intermediate",
    title: "Fewest coins",
    idea: "bottom-up DP, O(amount * coins)",
    prompt:
      "Write `coinChange(coins, amount)` returning the fewest coins needed to make `amount`, using any number of each coin value, or `-1` if it is impossible. `coinChange([1, 2, 5], 11)` is `3` (5+5+1). Careful: `coinChange([1, 3, 4], 6)` is `2` (3+3), so taking the biggest coin first does not always work. `amount = 0` needs `0` coins.",
    fn: "coinChange",
    starter: src`
function coinChange(coins, amount) {
  // TODO: what is the best answer for each smaller amount?
  return -1;
}`,
    tests: [
      t("classic", [[1, 2, 5], 11], 3),
      t("impossible", [[2], 3], -1),
      t("zero amount", [[1], 0], 0),
      t("only ones", [[1], 2], 2),
      t("greedy trap", [[1, 3, 4], 6], 2),
      t("unsorted coins", [[2, 5, 10, 1], 27], 4),
      t("US coins for 100", [[1, 5, 10, 25], 100], 4, true),
      t("awkward coins", [[186, 419, 83, 408], 6249], 20, true),
      t("large amount", [[1, 2, 5], 10000], 2000, true),
      t("no combination", [[5, 7], 3], -1, true),
    ],
    hints: [
      "Define `dp[a]` as the fewest coins that make amount `a`. How does `dp[a]` relate to smaller amounts?",
      "For each coin `c <= a`, `dp[a] = min(dp[a], dp[a - c] + 1)`. Start with `dp[0] = 0` and everything else `Infinity`.",
      "Fill `a` from 1 to `amount`. At the end, `Infinity` means impossible: return `-1`.",
    ],
    solution: src`
function coinChange(coins, amount) {
  const dp = Array(amount + 1).fill(Infinity);
  dp[0] = 0;
  for (let a = 1; a <= amount; a++) {
    for (const c of coins) {
      if (c <= a && dp[a - c] + 1 < dp[a]) dp[a] = dp[a - c] + 1;
    }
  }
  return dp[amount] === Infinity ? -1 : dp[amount];
}`,
    explanation:
      "The best way to make `a` ends with some coin `c`, after the best way to make `a - c`. Small answers build big ones, and the same small amounts come up again and again, so a table solves it in O(amount * coins) time and O(amount) space. Grabbing the biggest coin first fails for coin sets like [1, 3, 4]. Follow-up: count the number of ways to make the amount instead. (Put the coin loop on the outside.)",
  },
  {
    id: "algo-cc-07",
    domain: "d3",
    lesson: "algo-bfs",
    level: "senior",
    title: "Shortest path in a maze",
    idea: "BFS on a grid",
    prompt:
      "A grid has `0` for open cells and `1` for walls. Write `shortestPath(grid)` that returns the fewest moves from the top-left cell to the bottom-right cell, moving up, down, left or right (no diagonals). Return `-1` if there is no path or the start or end is a wall. A 1x1 open grid needs `0` moves. Example: `[[0,0,0],[1,1,0],[0,0,0]]` is `4`.",
    fn: "shortestPath",
    starter: src`
function shortestPath(grid) {
  // TODO: explore cells in rings of equal distance from the start
  return -1;
}`,
    tests: [
      t("around a wall", [[[0, 0, 0], [1, 1, 0], [0, 0, 0]]], 4),
      t("blocked diagonal", [[[0, 1], [1, 0]]], -1),
      t("single open cell", [[[0]]], 0),
      t("single wall", [[[1]]], -1),
      t("open 2x2", [[[0, 0], [0, 0]]], 2),
      t("wall in the middle", [[[0, 0, 0], [0, 1, 0], [0, 0, 0]]], 4),
      t("detour down the left", [[[0, 1, 0], [0, 1, 0], [0, 0, 0]]], 4),
      t("end is a wall", [[[0, 0], [0, 1]]], -1, true),
      t("open 50x50", [allOnes(50, 50).map((r) => r.map(() => 0))], 98, true),
      t("serpentine 21x21", [serpentine(21)], 240, true),
      t("fully walled middle row", [[[0, 0, 0], [1, 1, 1], [0, 0, 0]]], -1, true),
    ],
    hints: [
      "All moves cost the same, so which search finds the fewest moves first?",
      "Breadth-first search from the start. Keep a queue of `[row, col, distance]` and mark cells as visited when you enqueue them.",
      "Return the distance when you dequeue the bottom-right cell; if the queue empties first, return `-1`. Use an index pointer instead of `shift()` to keep it fast.",
    ],
    solution: src`
function shortestPath(grid) {
  const R = grid.length, C = grid[0].length;
  if (grid[0][0] === 1 || grid[R - 1][C - 1] === 1) return -1;
  const seen = Array.from({ length: R }, () => Array(C).fill(false));
  const queue = [[0, 0, 0]];
  seen[0][0] = true;
  for (let head = 0; head < queue.length; head++) {
    const [r, c, d] = queue[head];
    if (r === R - 1 && c === C - 1) return d;
    for (const [dr, dc] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < R && nc >= 0 && nc < C && grid[nr][nc] === 0 && !seen[nr][nc]) {
        seen[nr][nc] = true;
        queue.push([nr, nc, d + 1]);
      }
    }
  }
  return -1;
}`,
    explanation:
      "BFS visits cells in order of distance, so the first time it reaches the goal, it has used the fewest moves. Marking a cell when you queue it, not when you take it out, means each cell enters the queue at most once. That's O(R * C) time and space. Follow-up: what changes if moves have different costs? (Dijkstra with a priority queue, or 0-1 BFS with a deque.)",
  },
  {
    id: "algo-cc-08",
    domain: "d3",
    lesson: "algo-dfs",
    level: "intermediate",
    title: "Count the islands",
    idea: "flood fill (DFS), O(R*C)",
    prompt:
      "A grid contains `1` (land) and `0` (water). Write `numIslands(grid)` returning how many islands there are. An island is a group of land cells connected up, down, left or right (diagonals do not connect). `[[1,1,0],[0,0,0],[0,1,1]]` has `2` islands. Empty grids give `0`. Grids can be 200x200, so beware of very deep recursion.",
    fn: "numIslands",
    starter: src`
function numIslands(grid) {
  // TODO: when you find unvisited land, flood-fill the whole island once
  return 0;
}`,
    tests: [
      t("classic", [[[1, 1, 0, 0, 0], [1, 1, 0, 0, 0], [0, 0, 1, 0, 0], [0, 0, 0, 1, 1]]], 3),
      t("empty grid", [[]], 0),
      t("single water", [[[0]]], 0),
      t("single land", [[[1]]], 1),
      t("diagonals do not connect", [[[1, 0, 1], [0, 1, 0], [1, 0, 1]]], 5),
      t("all land", [allOnes(3, 3)], 1),
      t("200x200 of land (deep recursion)", [allOnes(200, 200)], 1, true),
      t("100x100 checkerboard", [checkerboard(100)], 5000, true),
      t("snake-shaped island", [[[1, 1, 1], [0, 0, 1], [1, 1, 1], [1, 0, 0], [1, 1, 1]]], 1, true),
    ],
    hints: [
      "Scan every cell. The first time you see land that you have not visited, you have found a new island.",
      "When you find land, visit every connected land cell and mark them so they are never counted again (you may overwrite the grid with 0).",
      "Use an explicit stack (an array) instead of recursion so a 200x200 island cannot overflow the call stack.",
    ],
    solution: src`
function numIslands(grid) {
  let count = 0;
  for (let r = 0; r < grid.length; r++) {
    for (let c = 0; c < grid[r].length; c++) {
      if (grid[r][c] !== 1) continue;
      count++;
      const stack = [[r, c]];
      grid[r][c] = 0;
      while (stack.length) {
        const [y, x] = stack.pop();
        for (const [dy, dx] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          const ny = y + dy, nx = x + dx;
          if (grid[ny] && grid[ny][nx] === 1) {
            grid[ny][nx] = 0;
            stack.push([ny, nx]);
          }
        }
      }
    }
  }
  return count;
}`,
    explanation:
      "Each land cell is visited once and then sunk by setting it to 0. So the number of islands is the number of times the scan finds land it hasn't seen yet, in O(R * C) time. Using your own stack instead of recursion avoids depth limits on big islands. Follow-up: how would you do it without changing the input, or count islands as land cells are added one at a time? (A visited set; union-find.)",
  },
  {
    id: "algo-cc-09",
    domain: "d1",
    lesson: "algo-merge-quick",
    level: "senior",
    title: "Count the inversions",
    idea: "merge sort counting, O(n log n)",
    prompt:
      "An inversion is a pair of positions `i < j` with `nums[i] > nums[j]`. Write `countInversions(nums)` that returns how many there are. `[2, 4, 1, 3, 5]` has `3` (2>1, 4>1, 4>3). Equal values do not count. A fully descending array of 3000 items has about 4.5 million inversions, so the result can be large; aim for O(n log n).",
    fn: "countInversions",
    starter: src`
function countInversions(nums) {
  // TODO: can you count inversions while merge sorting?
  return 0;
}`,
    tests: [
      t("classic", [[2, 4, 1, 3, 5]], 3),
      t("already sorted", [[1, 2, 3]], 0),
      t("descending", [[3, 2, 1]], 3),
      t("empty", [[]], 0),
      t("one item", [[1]], 0),
      t("equal values", [[2, 2, 2]], 0),
      t("duplicates mixed", [[5, 1, 1, 2]], 3, true),
      t("descending 3000", [Array.from({ length: 3000 }, (_, i) => 3000 - i)], 4498500, true),
      t("ascending 5000", [Array.from({ length: 5000 }, (_, i) => i)], 0, true),
      t("1500 pseudo-random values", [inversionInput], inversionExpected, true),
    ],
    hints: [
      "Checking every pair is O(n^2). Think about what merge sort learns when it merges two sorted halves.",
      "While merging `left` and `right`, whenever you take an item from `right` before the remaining left items, it is smaller than all of them: add the number of remaining left items.",
      "Take from the left when `left[i] <= right[j]` so equal values are not counted. Sum the counts from both recursive calls and the merge.",
    ],
    solution: src`
function countInversions(nums) {
  let count = 0;
  const sort = (a) => {
    if (a.length < 2) return a;
    const mid = a.length >> 1;
    const left = sort(a.slice(0, mid));
    const right = sort(a.slice(mid));
    const out = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        out.push(left[i++]);
      } else {
        count += left.length - i;
        out.push(right[j++]);
      }
    }
    return out.concat(left.slice(i), right.slice(j));
  };
  sort(nums);
  return count;
}`,
    explanation:
      "Merge sort already compares items across the two halves in order. When an item from the right half jumps ahead of the items still waiting on the left, it forms an inversion with every one of them, so you count that whole group in O(1). The total is O(n log n) time and O(n) space. Follow-up: how would a Fenwick tree solve it? (Go left to right, counting earlier items bigger than the current one.)",
  },
  {
    id: "algo-cc-10",
    domain: "d4",
    lesson: "algo-dp-patterns",
    level: "senior",
    title: "Edit distance",
    idea: "2D DP, O(m*n)",
    prompt:
      "Write `editDistance(a, b)` returning the minimum number of single-character insertions, deletions and replacements needed to turn string `a` into string `b`. `editDistance(\"horse\", \"ros\")` is `3`; `editDistance(\"kitten\", \"sitting\")` is `3`. Either string can be empty. Strings can be a few hundred characters long.",
    fn: "editDistance",
    starter: src`
function editDistance(a, b) {
  // TODO: dp[i][j] = cost to turn the first i letters of a into the first j of b
  return 0;
}`,
    tests: [
      t("horse to ros", ["horse", "ros"], 3),
      t("intention to execution", ["intention", "execution"], 5),
      t("both empty", ["", ""], 0),
      t("delete one", ["a", ""], 1),
      t("insert three", ["", "abc"], 3),
      t("identical", ["same", "same"], 0),
      t("kitten to sitting", ["kitten", "sitting"], 3),
      t("sunday to saturday", ["sunday", "saturday"], 3, true),
      t("300 replacements", ["a".repeat(300), "b".repeat(300)], 300, true),
      t("one extra at the end", ["abc".repeat(100), "abc".repeat(100) + "x"], 1, true),
    ],
    hints: [
      "Compare prefixes. Let `dp[i][j]` be the distance between the first `i` letters of `a` and the first `j` letters of `b`.",
      "If `a[i-1] === b[j-1]`, `dp[i][j] = dp[i-1][j-1]`. Otherwise it is 1 plus the minimum of delete (`dp[i-1][j]`), insert (`dp[i][j-1]`) and replace (`dp[i-1][j-1]`).",
      "Base cases: `dp[i][0] = i` (delete everything) and `dp[0][j] = j` (insert everything). Only the previous row is needed if you want O(n) space.",
    ],
    solution: src`
function editDistance(a, b) {
  const m = a.length, n = b.length;
  let prev = Array.from({ length: n + 1 }, (_, j) => j);
  for (let i = 1; i <= m; i++) {
    const cur = [i];
    for (let j = 1; j <= n; j++) {
      cur[j] = a[i - 1] === b[j - 1]
        ? prev[j - 1]
        : 1 + Math.min(prev[j], cur[j - 1], prev[j - 1]);
    }
    prev = cur;
  }
  return prev[n];
}`,
    explanation:
      "Either the last characters match, which costs nothing, or the last step was a delete, insert or replace. Each case leaves a smaller problem on shorter prefixes. A table over every pair of prefixes solves each one once, in O(m * n) time. Keeping only the previous row cuts space to O(n). Follow-up: how would you get the actual list of edits? (Keep the full table and walk back from the corner.)",
  },
  {
    id: "algo-cc-11",
    domain: "d2",
    lesson: "algo-bs-variants",
    level: "staff",
    title: "Smallest ship capacity",
    idea: "binary search on the answer",
    prompt:
      "Packages with the given `weights` must be shipped in the listed order (you cannot reorder them), loaded onto a ship that carries at most `capacity` per day. Write `minShipCapacity(weights, days)` returning the smallest capacity that ships everything within `days` days. `minShipCapacity([1,2,3,4,5,6,7,8,9,10], 5)` is `15`. Each weight is positive and `days >= 1`.",
    fn: "minShipCapacity",
    starter: src`
function minShipCapacity(weights, days) {
  // TODO: the answer lies between max(weights) and sum(weights)
  return 0;
}`,
    tests: [
      t("classic", [[1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 5], 15),
      t("six packages, three days", [[3, 2, 2, 4, 1, 4], 3], 6),
      t("mixed small", [[1, 2, 3, 1, 1], 4], 3),
      t("single package", [[5], 1], 5),
      t("a day per package", [[1, 1, 1, 1], 4], 1),
      t("everything in one day", [[1, 1, 1, 1], 1], 4),
      t("heavy middle", [[10, 50, 10], 2], 60),
      t("10000 ones over 100 days", [Array(10000).fill(1), 100], 100, true),
      t("1..500 in one day", [Array.from({ length: 500 }, (_, i) => i + 1), 1], 125250, true),
      t("1..500 in 500 days", [Array.from({ length: 500 }, (_, i) => i + 1), 500], 500, true),
    ],
    hints: [
      "Checking one capacity is easy: load greedily day by day and count the days. How does the feasibility change as capacity grows?",
      "If capacity `c` works, any larger capacity works too, so you can binary search over `c` in `[max(weights), sum(weights)]`.",
      "`canShip(c)`: add weights to the current day; when the next one would exceed `c`, start a new day. Find the smallest `c` with `canShip(c)` true.",
    ],
    solution: src`
function minShipCapacity(weights, days) {
  const needed = (cap) => {
    let d = 1, load = 0;
    for (const w of weights) {
      if (load + w > cap) {
        d++;
        load = 0;
      }
      load += w;
    }
    return d;
  };
  let lo = Math.max(...weights);
  let hi = weights.reduce((a, b) => a + b, 0);
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (needed(mid) <= days) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}`,
    explanation:
      "The question \"can we ship within `days` at capacity `c`?\" only ever flips from no to yes as `c` grows, so binary search can find where it flips. That's O(n log(sum)) time and O(1) space. The lowest possible answer is the heaviest package, since it has to fit. The highest is the total weight, which ships everything in one day. Follow-up: what if packages could be reordered? (A harder partition problem.)",
  },
  {
    id: "algo-cc-12",
    domain: "d2",
    lesson: "algo-sliding-window",
    level: "staff",
    title: "Sliding-window rate limiter",
    idea: "queue of allowed timestamps",
    prompt:
      "Design a rate limiter as `rateLimiter(limit, windowMs, times)`. `times` lists request timestamps in milliseconds, non-decreasing. A request at time `x` is allowed (`true`) if fewer than `limit` allowed requests happened in the window `(x - windowMs, x]`; otherwise it is rejected (`false`) and does not count toward the limit. Return an array of booleans. Example: `rateLimiter(1, 10, [0, 5, 10, 15, 20])` is `[true, false, true, false, true]`. Make it O(n) overall.",
    fn: "rateLimiter",
    starter: src`
function rateLimiter(limit, windowMs, times) {
  // TODO: remember which requests were allowed, and forget old ones
  return times.map(() => true);
}`,
    tests: [
      t("limit 2 per second", [2, 1000, [0, 100, 200, 1000, 1100, 1200]], [true, true, false, true, true, false]),
      t("limit 1, window 10", [1, 10, [0, 5, 10, 15, 20]], [true, false, true, false, true]),
      t("no requests", [3, 100, []], []),
      t("burst at the same millisecond", [2, 50, [1, 1, 1, 1]], [true, true, false, false]),
      t("tiny window", [1, 1, [5, 5, 6, 6, 7]], [true, false, true, false, true]),
      t("rejected requests do not count", [2, 10, [0, 1, 2, 3, 10, 11, 12]], [true, true, false, false, true, true, false]),
      t("every request far apart", [1, 1000, farApart], farApart.map(() => true), true),
      t("one request per ms, limit 5 per 10ms", [5, 10, everyMs], rateExpected(5, 10, everyMs), true),
      t("bursts of seven", [3, 12, bursty], rateExpected(3, 12, bursty), true),
    ],
    hints: [
      "Only allowed requests count. Which of them can still matter for the current request?",
      "Keep a queue of allowed timestamps. Before deciding, drop from the front every timestamp that is `<= x - windowMs`.",
      "If the queue length is `< limit`, push `x` and answer `true`; otherwise answer `false`. Use a head index instead of `shift()` so it stays O(n).",
    ],
    solution: src`
function rateLimiter(limit, windowMs, times) {
  const allowed = [];
  let head = 0;
  return times.map((x) => {
    while (head < allowed.length && allowed[head] <= x - windowMs) head++;
    if (allowed.length - head < limit) {
      allowed.push(x);
      return true;
    }
    return false;
  });
}`,
    explanation:
      "Timestamps arrive in order, so the allowed ones form a queue, and the expired ones are always at the front. Each timestamp is added once and removed once, which gives O(n) in total. Rejected requests aren't stored, because only allowed requests count toward the limit. Follow-up: how would you scale it across many servers? (A shared store like Redis with a fixed-window or token-bucket approximation, giving up exactness for speed.)",
  },
  {
    id: "algo-cc-13",
    domain: "d4",
    lesson: "algo-greedy",
    level: "intermediate",
    title: "Can you reach the end?",
    idea: "greedy furthest reach, O(n)",
    prompt:
      "You start at index 0 of `nums`. Each `nums[i]` is the farthest you can jump forward from index `i` (you may jump less). Write `canJump(nums)` that returns `true` if you can reach the last index. `[2,3,1,1,4]` is `true`; `[3,2,1,0,4]` is `false` because every path ends stuck on the `0`. A single-item array is always `true`.",
    fn: "canJump",
    starter: src`
function canJump(nums) {
  // TODO: track the furthest index you could possibly reach
  return false;
}`,
    tests: [
      t("reachable", [[2, 3, 1, 1, 4]], true),
      t("stuck on the zero", [[3, 2, 1, 0, 4]], false),
      t("single zero", [[0]], true),
      t("zero start with more", [[0, 1]], false),
      t("single item", [[1]], true),
      t("zeros you can jump over", [[2, 0, 0]], true),
      t("10000 ones", [Array(10000).fill(1)], true, true),
      t("a zero in a long chain of ones", [Array.from({ length: 10000 }, (_, i) => (i === 5000 ? 0 : 1))], false, true),
    ],
    hints: [
      "You don't need to try every path. What single number sums up how far you could possibly get so far?",
      "Keep `far`, the furthest reachable index. For each `i`, if `i > far` you are stuck; otherwise update `far = max(far, i + nums[i])`.",
      "Return `true` as soon as `far >= nums.length - 1`, or after the loop if you never got stuck.",
    ],
    solution: src`
function canJump(nums) {
  let far = 0;
  for (let i = 0; i < nums.length; i++) {
    if (i > far) return false;
    far = Math.max(far, i + nums[i]);
    if (far >= nums.length - 1) return true;
  }
  return true;
}`,
    explanation:
      "If you can reach index `i`, you can reach everything before it too. So one number, `far`, sums up everything you can reach. If the scan ever moves past `far`, nothing beyond it is reachable. That's O(n) time and O(1) space, compared with exponential brute force or O(n^2) DP. Follow-up: what's the fewest number of jumps? (Greedy BFS levels over the reach frontier.)",
  },
];
