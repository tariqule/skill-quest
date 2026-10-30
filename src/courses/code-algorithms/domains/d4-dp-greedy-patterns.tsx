import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { js } from "../snippet";
import { FibTree } from "../visuals";

/** Domain 4: dynamic programming, greedy algorithms, and recognising interview patterns. */
export default defineDomain({
  domain: {
    id: "d4",
    number: 4,
    name: "Dynamic Programming, Greedy & Patterns",
    world: "The Dynamic Peaks",
    weight: 25,
    emoji: "🏔️",
    color: "#34d399",
    summary: "Saving answers so you never solve the same thing twice, when taking the best move now works, and how to spot which technique a problem needs.",
  },

  tasks: [
    {
      id: "4.1",
      title: "Dynamic programming",
      covers: ["Overlapping subproblems and optimal substructure", "Memoization vs tabulation", "State, recurrence, base cases, fill order", "1D, coin change, knapsack, LIS, LCS, grid paths", "Space optimisation"],
    },
    { id: "4.2", title: "Greedy algorithms", covers: ["Greedy choice property and exchange arguments", "Interval scheduling, jump game", "Where greedy fails (coin systems)", "Greedy graph algorithms"] },
    {
      id: "4.3",
      title: "Interview patterns",
      covers: ["Matching problem cues to techniques", "Prefix sums and hash maps", "Using constraints to pick an approach", "A repeatable problem-solving process", "Streaming top-k designs"],
    },
  ],

  lessons: [
    {
      id: "algo-b-notepad",
      level: "beginner",
      check: ["algo-b4-01", "algo-b4-02"],
      task: "4.1",
      title: "Dynamic programming: keep a notepad",
      visual: (
        <Flow
          color="#34d399"
          steps={[
            { icon: "❓", label: "Need an answer", sub: "Have I worked this out before?" },
            { icon: "📒", label: "Check the notepad", sub: "Yes: read it, no work needed" },
            { icon: "✍️", label: "Otherwise, solve it", sub: "Then write it down for next time" },
          ]}
        />
      ),
      points: [
        "Imagine adding up 1 + 1 + 1 + 1 + 1. Then someone adds one more 1. You don't start again: you remember 5 and say 6.",
        "**Dynamic programming**, or DP, is that habit in code. You save the answers to small problems and reuse them to build bigger answers.",
        "It pays off when the same small problems come up again and again. Without the notepad, a program can redo the same work millions of times.",
      ],
      tip: "If you notice your solution computing the same thing twice, ask whether you could just store it the first time.",
    },
    {
      id: "algo-b-greedy",
      level: "beginner",
      check: ["algo-b4-03", "algo-b4-04"],
      task: "4.2",
      title: "Greedy: grab the best move now",
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🪙", title: "Making change", text: "To give 30 cents with 25, 10, 5 and 1 cent coins, take the biggest coin that fits each time: 25, then 5.", color: "#34d399" },
            { icon: "⚠️", title: "Not always right", text: "With odd coin sets, grabbing the biggest coin first can use more coins than needed.", color: "#34d399" },
          ]}
        />
      ),
      points: [
        "A **greedy** algorithm makes the choice that looks best right now, and never goes back to change it.",
        "Giving change with the biggest coin that fits is a greedy algorithm. With normal coins it gives the fewest coins.",
        "Greedy is quick and simple, but it isn't always right. Sometimes a choice that looks worse now leads to a better result later.",
      ],
      tip: "Before trusting a greedy idea, try a few tiny examples to see whether you can break it.",
    },
    {
      id: "algo-memo",
      level: "intermediate",
      check: ["algo4-01", "algo4-02"],
      task: "4.1",
      title: "Memoization vs tabulation",
      visual: (
        <div className="grid gap-5">
          <FibTree />
          <CodeCompare
            lang="js"
            left={{
              title: "Top-down: memoization",
              code: js("const memo = new Map();", "function fib(n) {", "  if (n < 2) return n;", "  if (memo.has(n)) return memo.get(n);", "  const v = fib(n - 1) + fib(n - 2);", "  memo.set(n, v);", "  return v;", "}"),
            }}
            right={{
              title: "Bottom-up: tabulation",
              code: js("function fib(n) {", "  let a = 0, b = 1; // fib(0), fib(1)", "  for (let i = 0; i < n; i++) {", "    [a, b] = [b, a + b];", "  }", "  return a;", "}"),
            }}
          />
        </div>
      ),
      points: [
        "DP fits when a problem has **overlapping subproblems**, meaning the same smaller inputs come up again and again.",
        "It also needs **optimal substructure**: the best answer is built from the best answers to smaller pieces.",
        "**Memoization** means writing the natural recursion and caching each result. It only computes the states you actually reach.",
        "**Tabulation** means filling a table from the base cases up. There's no recursion, and you can often shrink the space to one row or a couple of values.",
      ],
      tip: "Start with the plain recursive version, spot the repeated calls and add a cache. Offer the bottom-up version if you're asked to save space.",
    },
    {
      id: "algo-dp-patterns",
      level: "senior",
      check: ["algo4-05", "algo4-06"],
      task: "4.1",
      title: "Classic DP patterns",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🪜", title: "1D: stairs, house robber", text: "`dp[i]` comes from `dp[i - 1]` and `dp[i - 2]`. O(n) time, O(1) space.", color: "#34d399" },
              { icon: "🪙", title: "Coin change", text: "Coins can repeat: `dp[a] = min(dp[a - c] + 1)` over every coin c.", color: "#34d399" },
              { icon: "🎒", title: "0/1 knapsack", text: "Each item used at most once. `dp[i][w]` is the best value from the first i items within weight w.", color: "#34d399" },
              { icon: "📈", title: "LIS", text: "`dp[i]` is the longest increasing run that ends at i. O(n²), or O(n log n) with binary search.", color: "#34d399" },
              { icon: "🔤", title: "LCS / edit distance", text: "A 2D table over two strings. On a match, take the diagonal plus 1. Otherwise take the best neighbour.", color: "#34d399" },
              { icon: "🗺️", title: "Grid paths", text: "`dp[r][c] = dp[r - 1][c] + dp[r][c - 1]`, or the minimum for cheapest-path problems.", color: "#34d399" },
            ]}
          />
          <CodeBlock
            lang="js"
            code={js(
              "function coinChange(coins, amount) {",
              "  const dp = new Array(amount + 1).fill(Infinity);",
              "  dp[0] = 0; // zero coins make 0",
              "  for (let a = 1; a <= amount; a++)",
              "    for (const c of coins)",
              "      if (c <= a) dp[a] = Math.min(dp[a], dp[a - c] + 1);",
              "  return dp[amount] === Infinity ? -1 : dp[amount];",
              "}",
            )}
            caption="O(amount × coins) time, O(amount) space"
          />
        </div>
      ),
      points: [
        "The recipe has five steps. Define the state (what `dp[i]` means), write the rule that builds it, set the base cases, pick a fill order, then read off the answer.",
        "Two sequences, like two strings or two arrays, usually mean a 2D table indexed by a position in each.",
        "The cost is the number of states times the work done for each state.",
        "The **longest common subsequence** (LCS) table is O(n·m). To find only its length, keep just two rows for O(min(n, m)) space; to recover the diff itself in low memory, use Hirschberg's divide and conquer or Myers' diff algorithm.",
      ],
      tip: "Say the state in plain words before you code: \"dp[a] is the fewest coins that make amount a.\"",
    },
    {
      id: "algo-greedy",
      level: "senior",
      check: ["algo4-09", "algo4-10"],
      task: "4.2",
      title: "Greedy: take the best move now",
      visual: (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3">
            <div className="font-semibold text-emerald-300">✅ Greedy works</div>
            <ul className="mt-2 grid gap-1.5 text-sm text-slate-200">
              <li>📅 Most meetings in one room: always take the one that ends first</li>
              <li>🦘 Jump game: track the farthest index you can reach</li>
              <li>🗺️ Dijkstra, Prim, Kruskal, Huffman coding</li>
              <li>🪙 Coins 25/10/5/1: largest coin first is optimal</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rose-400/30 bg-rose-400/5 p-3">
            <div className="font-semibold text-rose-300">❌ Greedy fails</div>
            <ul className="mt-2 grid gap-1.5 text-sm text-slate-200">
              <li>🪙 Coins 1/3/4 for 6: greedy picks 4+1+1 (3 coins), but 3+3 is better</li>
              <li>🎒 0/1 knapsack by value per weight</li>
              <li>📅 Meetings chosen by shortest length or earliest start</li>
              <li>💡 Use DP instead, or prove the greedy choice is safe</li>
            </ul>
          </div>
        </div>
      ),
      points: [
        "Greedy makes the choice that looks best right now and never revisits it. It's fast, often just a sort and one pass, but it's only correct if you can prove it.",
        "The usual proof is an **exchange argument**: show that swapping the greedy choice into any optimal solution never makes it worse.",
        "If you can't prove it and you find a small counterexample, switch to DP.",
        "**Dijkstra's algorithm** is greedy: it always finalises the unvisited node with the smallest known distance and never revisits it. That's only correct when no edge weight is negative.",
      ],
      tip: "Before you commit to greedy, try to break it with a tiny counterexample. Interviewers love asking \"does that always work?\"",
    },
    {
      id: "algo-patterns",
      level: "staff",
      check: ["algo4-13", "algo4-14"],
      task: "4.3",
      title: "Spot the pattern",
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#34d399"
            steps={[
              { icon: "❓", label: "Clarify", sub: "Inputs, limits, edge cases" },
              { icon: "✍️", label: "Example", sub: "Work one by hand" },
              { icon: "🐢", label: "Brute force", sub: "State it and its Big-O" },
              { icon: "🚀", label: "Optimise", sub: "Match a pattern" },
              { icon: "⌨️", label: "Code", sub: "Talk while you type" },
              { icon: "🧪", label: "Test", sub: "Trace, edge cases, Big-O" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "↔️", title: "Sorted + pair/triple", text: "Two pointers", color: "#34d399" },
              { icon: "🪟", title: "Contiguous longest/shortest", text: "Sliding window (or prefix sums with negatives)", color: "#34d399" },
              { icon: "⛰️", title: "Top k / k-th / merge k", text: "Heap", color: "#34d399" },
              { icon: "🌊", title: "Fewest steps, unweighted", text: "BFS", color: "#34d399" },
              { icon: "🌳", title: "All combinations", text: "Backtracking", color: "#34d399" },
              { icon: "🧮", title: "Count ways / min cost", text: "Dynamic programming", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "Limits narrow the options. With n up to 20, exponential is fine. With n up to 10⁵, aim for O(n log n). Sorted input suggests binary search or two pointers.",
        "Need to ask \"have I seen this before?\" in O(1)? Use a hash map. Need range sums? Use prefix sums.",
        "At scale the same patterns come back as systems: streaming top-k, rolling windows, bisecting deployments.",
      ],
      tip: "If you're stuck, say which patterns you're considering and why each one does or doesn't fit. That reasoning earns credit.",
    },
  ],

  questions: [
    {
      id: "algo-b4-01",
      domain: "d4",
      level: "beginner",
      lesson: "algo-b-notepad",
      prompt: "What's the main idea behind dynamic programming?",
      options: [
        "Save the answers to smaller problems and reuse them instead of working them out again",
        "Always pick the biggest number first",
        "Run the program on a faster computer",
        "Sort the input before doing anything else, so that each step can use binary search instead",
      ],
      answer: [0],
      explanation: "DP is like keeping a notepad of answers you've already worked out. When the same small problem comes up again, you read the answer instead of redoing the work.",
    },
    {
      id: "algo-b4-02",
      domain: "d4",
      level: "beginner",
      lesson: "algo-b-notepad",
      type: "output",
      prompt: "Type what this prints. Each step reuses the answer saved in the step before.",
      code: js("const total = [0];", "for (let i = 1; i <= 4; i++) {", "  total[i] = total[i - 1] + i;", "}", "console.log(total[4]);"),
      codeLang: "js",
      answers: ["10"],
      explanation: "The saved totals grow 0, 1, 3, 6, 10. Each one is the previous total plus the new number, so nothing is ever added up twice. That's DP in its simplest form.",
    },
    {
      id: "algo-b4-03",
      domain: "d4",
      level: "beginner",
      lesson: "algo-b-greedy",
      prompt: "What does a greedy algorithm do at each step?",
      options: [
        "Takes the option that looks best right now and doesn't go back",
        "Tries every possible combination and then picks the best",
        "Saves every answer in a table",
        "Picks an option at random",
      ],
      answer: [0],
      explanation: "Greedy means grabbing the best-looking move at each step, like always taking the biggest coin that fits. It's fast, but it only works for some problems.",
    },
    {
      id: "algo-b4-04",
      domain: "d4",
      level: "beginner",
      lesson: "algo-b-greedy",
      prompt: "You give 30 cents in change using 25, 10, 5 and 1 cent coins, always taking the biggest coin that fits. Which coins do you hand over?",
      options: ["25 and 5", "10, 10 and 10", "25, 1, 1, 1, 1 and 1", "Thirty 1 cent coins"],
      answer: [0],
      explanation: "The biggest coin that fits 30 is 25, which leaves 5. The biggest coin that fits 5 is 5. Two coins, and with these coins that's the fewest possible.",
    },
    {
      id: "algo4-01",
      domain: "d4",
      level: "junior",
      lesson: "algo-memo",
      prompt: "What is the time complexity of this `fib`?",
      code: js("function fib(n) {", "  if (n < 2) return n;", "  return fib(n - 1) + fib(n - 2);", "}"),
      codeLang: "js",
      options: ["Exponential, about O(2ⁿ)", "O(n)", "O(n²)", "O(log n), because each call halves the problem size"],
      answer: [0],
      explanation: "Each call branches into two, and the same values get worked out again and again. The exact bound is about O(1.618ⁿ), usually quoted as O(2ⁿ). Adding a cache makes it O(n).",
    },
    {
      id: "algo4-02",
      domain: "d4",
      level: "intermediate",
      lesson: "algo-memo",
      prompt: "What does this print?",
      code: js(
        "let calls = 0;",
        "const memo = new Map();",
        "function fib(n) {",
        "  calls++;",
        "  if (n < 2) return n;",
        "  if (memo.has(n)) return memo.get(n);",
        "  const v = fib(n - 1) + fib(n - 2);",
        "  memo.set(n, v);",
        "  return v;",
        "}",
        "console.log(fib(5), calls);",
      ),
      codeLang: "js",
      options: ["`5 9`", "`5 15`", "`5 5`", "`8 9`"],
      answer: [0],
      explanation: "fib(5) is 5. With the cache, fib(2) through fib(5) are each worked out once, and the repeat calls to fib(2) and fib(3) hit the cache. That's 2n − 1, so 9 calls, compared with 15 without the cache.",
    },
    {
      id: "algo4-03",
      domain: "d4",
      level: "intermediate",
      lesson: "algo-memo",
      prompt: "Which two properties make a problem a good fit for dynamic programming? (Choose two.)",
      options: ["Overlapping subproblems", "Optimal substructure", "The input is sorted", "There is exactly one valid answer", "The input is a graph"],
      answer: [0, 1],
      explanation: "Repeated subproblems are what make caching pay off. Optimal substructure is what lets you build the best answer from the best answers to smaller pieces.",
    },
    {
      id: "algo4-04",
      domain: "d4",
      level: "junior",
      lesson: "algo-memo",
      type: "match",
      prompt: "Match each DP term to its meaning.",
      pairs: [
        ["Memoization", "Top-down: recursion plus a cache"],
        ["Tabulation", "Bottom-up: fill a table in dependency order"],
        ["Space optimisation", "Keep only the last row or the last two values"],
        ["State", "The parameters that identify a subproblem, for example `dp[i][j]`"],
      ],
      explanation: "Both styles compute the same states. They differ in the order, in whether they recurse, and in how easily you can throw away old states.",
    },
    {
      id: "algo4-05",
      domain: "d4",
      level: "junior",
      lesson: "algo-dp-patterns",
      prompt: "You can climb 1 or 2 steps at a time. What does this print?",
      code: js(
        "function climb(n) {",
        "  let a = 1, b = 1; // ways to reach step 0 and step 1",
        "  for (let i = 2; i <= n; i++) {",
        "    [a, b] = [b, a + b];",
        "  }",
        "  return b;",
        "}",
        "console.log(climb(5));",
      ),
      codeLang: "js",
      options: ["8", "5", "13", "10"],
      answer: [0],
      explanation: "The ways to reach step i are the ways to reach i − 1 plus the ways to reach i − 2. That gives 1, 1, 2, 3, 5, 8. It's Fibonacci, using O(1) space.",
    },
    {
      id: "algo4-06",
      domain: "d4",
      level: "intermediate",
      lesson: "algo-dp-patterns",
      type: "lines",
      prompt: "This should return the fewest coins, but it returns `-1` for every positive amount. Tap the buggy line.",
      code: js(
        "function coinChange(coins, amount) {",
        "  const dp = new Array(amount + 1).fill(Infinity);",
        "  dp[0] = 0;",
        "  for (let a = 1; a <= amount; a++) {",
        "    for (const c of coins) {",
        "      if (c <= a) dp[a] = Math.max(dp[a], dp[a - c] + 1);",
        "    }",
        "  }",
        "  return dp[amount] === Infinity ? -1 : dp[amount];",
        "}",
      ),
      codeLang: "js",
      answer: [6],
      explanation: "Every `dp[a]` starts at Infinity, and `Math.max(Infinity, x)` is always Infinity. We want the fewest coins, so it should be `Math.min`.",
    },
    {
      id: "algo4-07",
      domain: "d4",
      level: "junior",
      lesson: "algo-dp-patterns",
      prompt: "Moving only right or down, how many paths cross a 3 × 3 grid? What does this print?",
      code: js(
        "function paths(rows, cols) {",
        "  const dp = Array.from({ length: rows }, () => new Array(cols).fill(1));",
        "  for (let r = 1; r < rows; r++)",
        "    for (let c = 1; c < cols; c++)",
        "      dp[r][c] = dp[r - 1][c] + dp[r][c - 1];",
        "  return dp[rows - 1][cols - 1];",
        "}",
        "console.log(paths(3, 3));",
      ),
      codeLang: "js",
      options: ["6", "9", "4", "3"],
      answer: [0],
      explanation: "The first row and first column have one path each. Then dp[1][1] is 2, dp[1][2] and dp[2][1] are 3, and dp[2][2] is 6. You can also get it as C(4, 2), which is 6.",
    },
    {
      id: "algo4-08",
      domain: "d4",
      level: "intermediate",
      lesson: "algo-dp-patterns",
      type: "order",
      prompt: "Put the steps for designing a bottom-up DP solution in order.",
      items: [
        "Define the state: what does `dp[i]` mean?",
        "Write the recurrence that builds `dp[i]` from smaller states",
        "Set the base cases",
        "Fill the table in an order where every dependency is already computed",
        "Read the answer from the right cell",
      ],
      explanation: "The state definition drives everything else. Get it right first and the recurrence and fill order follow naturally.",
    },
    {
      id: "algo4-09",
      domain: "d4",
      level: "intermediate",
      lesson: "algo-greedy",
      prompt: "With coins `[1, 3, 4]`, a greedy \"largest coin first\" strategy makes 6 as…",
      options: [
        "4 + 1 + 1 (3 coins), but 3 + 3 (2 coins) is optimal, so greedy fails here",
        "3 + 3 (2 coins), which is the optimum, so the greedy approach works for these coins",
        "4 + 2 (2 coins)",
        "1 × 6 (6 coins)",
      ],
      answer: [0],
      explanation: "Greedy grabs the 4 and is then stuck with 1 + 1. Coin sets like 25/10/5/1 happen to be safe for greedy, but an arbitrary set needs DP.",
    },
    {
      id: "algo4-10",
      domain: "d4",
      level: "intermediate",
      lesson: "algo-greedy",
      prompt: "To fit the most non-overlapping meetings into one room, which greedy rule is correct?",
      options: [
        "Sort by end time and always take the next meeting that ends earliest",
        "Sort by start time and take the earliest start",
        "Take the shortest meetings first",
        "Take the meetings that have the fewest conflicts first, one by one",
      ],
      answer: [0],
      explanation: "Finishing earliest leaves the most time for everything else, and an exchange argument proves it. Each of the other rules has a small counterexample.",
    },
    {
      id: "algo4-11",
      domain: "d4",
      level: "junior",
      lesson: "algo-greedy",
      prompt: "What does this print?",
      code: js(
        "const meetings = [[1, 3], [2, 4], [3, 5], [6, 7], [5, 8]];",
        "meetings.sort((a, b) => a[1] - b[1]);",
        "let count = 0, end = -Infinity;",
        "for (const [s, e] of meetings) {",
        "  if (s >= end) {",
        "    count++;",
        "    end = e;",
        "  }",
        "}",
        "console.log(count);",
      ),
      codeLang: "js",
      options: ["3", "2", "4", "5"],
      answer: [0],
      explanation: "Sorted by end time: [1,3] is taken. [2,4] overlaps it. [3,5] is taken, since it starts as the last one ends. [6,7] is taken. [5,8] overlaps. That's three meetings.",
    },
    {
      id: "algo4-12",
      domain: "d4",
      level: "intermediate",
      lesson: "algo-greedy",
      type: "lines",
      prompt: "`canJump([2, 3, 1, 1, 4])` returns `false`. Tap the buggy line.",
      code: js(
        "function canJump(nums) {",
        "  let reach = 0;",
        "  for (let i = 0; i < nums.length; i++) {",
        "    if (i > reach) return false;",
        "    reach = Math.min(reach, i + nums[i]);",
        "  }",
        "  return true;",
        "}",
      ),
      codeLang: "js",
      answer: [5],
      explanation: "`reach` is the farthest index you can get to, so it has to grow: `Math.max(reach, i + nums[i])`. With `min` it stays at 0, and index 1 looks unreachable.",
    },
    {
      id: "algo4-13",
      domain: "d4",
      level: "intermediate",
      lesson: "algo-patterns",
      type: "match",
      prompt: "Match each problem cue to the technique it usually calls for.",
      pairs: [
        ["Sorted array, find a pair", "Two pointers"],
        ["Longest or shortest contiguous subarray", "Sliding window"],
        ["Top k or k-th largest", "Heap of size k"],
        ["Generate all combinations or permutations", "Backtracking"],
        ["Count ways or minimise cost with overlapping choices", "Dynamic programming"],
        ["Fewest steps in a grid or unweighted graph", "BFS"],
      ],
      explanation: "Spotting the cue is half the interview. Say the cue out loud when you choose your technique.",
    },
    {
      id: "algo4-14",
      domain: "d4",
      level: "junior",
      lesson: "algo-patterns",
      type: "order",
      prompt: "Put a strong approach to an interview coding problem in order.",
      items: [
        "Clarify the problem, inputs, and constraints",
        "Work through an example by hand",
        "State a brute-force solution and its complexity",
        "Optimise, then write the code",
        "Test with edge cases and state the final complexity",
      ],
      explanation: "Clarifying first, then stating a brute force, keeps you from solving the wrong problem and shows the interviewer your thinking early.",
    },
    {
      id: "algo4-15",
      domain: "d4",
      level: "senior",
      lesson: "algo-patterns",
      prompt: "Count the subarrays that sum to k when negative numbers are allowed. Which technique?",
      options: ["Prefix sums with a hash map of how often each prefix appeared: O(n)", "A variable sliding window that grows and shrinks over the array: O(n)", "Binary search", "Sort, then two pointers"],
      answer: [0],
      explanation: "Negative numbers mean shrinking a window doesn't always lower the sum, and sorting scrambles which items are neighbours. Instead, for each prefix sum p, add how many earlier prefixes equal p − k.",
    },
    {
      id: "algo4-16",
      domain: "d4",
      level: "junior",
      lesson: "algo-patterns",
      prompt: "What does this print?",
      code: js(
        "const nums = [3, 1, 4, 1, 5];",
        "const pre = [0];",
        "for (const x of nums) pre.push(pre[pre.length - 1] + x);",
        "// sum of nums[1..3], inclusive",
        "console.log(pre[4] - pre[1]);",
      ),
      codeLang: "js",
      options: ["6", "9", "5", "10"],
      answer: [0],
      explanation: "pre is [0, 3, 4, 8, 9, 14]. pre[4] minus pre[1] is 9 − 3, which is 6: the same as 1 + 4 + 1. After O(n) setup, any range sum costs O(1).",
    },
    {
      id: "algo4-17",
      domain: "d4",
      level: "senior",
      lesson: "algo-patterns",
      prompt: "The input has n ≤ 20 items and you need the best subset. Which two approaches are reasonable? (Choose two.)",
      options: [
        "Try all 2ⁿ subsets with backtracking or bitmasks (about a million)",
        "Bitmask DP over subsets",
        "Find an O(log n) solution; anything slower will time out",
        "Sorting alone always solves subset problems",
        "Use a single hash map lookup",
      ],
      answer: [0, 1],
      explanation: "2²⁰ is about a million, which is cheap, so trying every subset fits the limit. A tiny n is often the interviewer's hint that exponential is fine.",
    },
    {
      id: "algo4-18",
      domain: "d4",
      level: "senior",
      lesson: "algo-dp-patterns",
      type: "lines",
      prompt: "`lis([1, 3, 5, 2])` returns `2` instead of `3`. Tap the buggy line.",
      code: js(
        "function lis(nums) {",
        "  const dp = new Array(nums.length).fill(1);",
        "  for (let i = 0; i < nums.length; i++) {",
        "    for (let j = 0; j < i; j++) {",
        "      if (nums[j] < nums[i]) dp[i] = Math.max(dp[i], dp[j] + 1);",
        "    }",
        "  }",
        "  return dp[nums.length - 1];",
        "}",
      ),
      codeLang: "js",
      answer: [8],
      explanation: "`dp[i]` is the longest increasing subsequence that ends at i, but the best one can end anywhere. dp is [1, 2, 3, 2], so return `Math.max(...dp)`.",
    },
    {
      id: "algo4-19",
      domain: "d4",
      level: "senior",
      lesson: "algo-greedy",
      prompt: "Why is Dijkstra's algorithm called greedy?",
      options: [
        "It always finalises the unvisited node with the smallest known distance and never revisits it",
        "It tries every possible path",
        "It fills a DP table bottom-up over all the nodes and edges, then reads each distance from the table",
        "It picks edges at random",
      ],
      answer: [0],
      explanation: "When no weight is negative, the closest unfinished node can't get any closer later, so the greedy choice is safe. Negative edges break that guarantee.",
    },
    {
      id: "algo4-20",
      domain: "d4",
      level: "senior",
      lesson: "algo-memo",
      prompt: "Memoized and tabulated `fib(n)` are both O(n) time. What is a practical advantage of tabulation?",
      options: [
        "No recursion, so no call-stack overflow, and it's easy to keep only the last two values (O(1) space)",
        "It's O(1) time",
        "It always computes fewer subproblems than the memoized version, because it skips the ones the recursion would visit",
        "It doesn't need base cases",
      ],
      answer: [0],
      explanation: "Memoization can actually compute fewer states, because it only visits the ones it reaches. Tabulation wins by having no recursion depth and by making it easy to save space.",
    },
    {
      id: "algo4-21",
      domain: "d4",
      level: "staff",
      lesson: "algo-dp-patterns",
      prompt: "A document-diff feature uses an O(n·m) LCS table and runs out of memory on two 100,000-line files. What is the standard improvement?",
      options: [
        "Keep only two rows to compute lengths in O(min(n, m)) space, and recover the actual diff with a divide-and-conquer method (Hirschberg) or Myers' algorithm",
        "Greedily match the first equal lines in each file; it gives the same result as the DP in a single pass, so the full table isn't needed at all for large files",
        "Use a 3D table",
        "Sort both files first",
      ],
      answer: [0],
      explanation: "A full table would need 10¹⁰ cells. Each row only depends on the one before, and Hirschberg's trick rebuilds the alignment in linear space. Myers' O((n + m)·D) algorithm, used by diff tools, is fast when the files are similar.",
    },
    {
      id: "algo4-22",
      domain: "d4",
      level: "staff",
      lesson: "algo-greedy",
      prompt: "Your team's greedy route planner does well in tests, and a stakeholder asks whether it's \"optimal\". What's the right engineering answer?",
      options: [
        "Only if you can prove the greedy choice property (for example with an exchange argument); otherwise call it a heuristic, measure it against an exact solver on small cases, and document the gap",
        "Yes, greedy algorithms are always optimal for routing problems, because taking the closest stop at each step can never lead to a longer total route than any other order would, so no proof is needed",
        "No algorithm can ever be optimal",
        "Passing three test cases shows it's optimal",
      ],
      answer: [0],
      explanation: "Tests can show greedy is wrong, but never that it's always right. Comparing it with an exact solver on small inputs tells you how far off it is, so the business can make an informed call.",
    },
    {
      id: "algo4-23",
      domain: "d4",
      level: "staff",
      lesson: "algo-patterns",
      prompt: "A product needs \"top 10 trending hashtags in the last hour\" over a very high-volume event stream. Which design is best?",
      options: [
        "Counts per time bucket (a hash map, or a count-min sketch at large scale) rolled over a sliding hour, plus a size-10 min-heap for the top items",
        "Store every event in one big list and sort all hashtags by count on each request, which is fine since each sort is only O(n log n) and the list stays in memory",
        "A trie of hashtags with no counts",
        "Binary search over the timestamps of all events",
      ],
      answer: [0],
      explanation: "It combines three patterns: hashing to count, a sliding window over time buckets, and a size-k heap for the top k. When there are a huge number of distinct tags, a sketch gives up exact counts to keep memory fixed.",
    },
  ],

  cards: [
    { id: "algo-c-memo", domain: "d4", kind: "service", term: "Memoization", definition: "Recursion plus a cache of subproblems you've already solved." },
    { id: "algo-c-tab", domain: "d4", kind: "service", term: "Tabulation", definition: "Fill a DP table from the base cases upward." },
    { id: "algo-c-coin", domain: "d4", kind: "service", term: "Coin change DP", definition: "`dp[a] = min(dp[a - c] + 1)` over every coin c." },
    { id: "algo-c-knapsack", domain: "d4", kind: "service", term: "0/1 knapsack", definition: "Each item used at most once. `dp[i][w]` is the best value you can fit within weight w." },
    { id: "algo-c-lis", domain: "d4", kind: "service", term: "Longest increasing subsequence", definition: "O(n²) with DP, or O(n log n) with binary search." },
    { id: "algo-c-lcs", domain: "d4", kind: "service", term: "Longest common subsequence", definition: "A 2D table over two strings. When characters match, take the diagonal plus 1." },
    { id: "algo-c-edit", domain: "d4", kind: "service", term: "Edit distance", definition: "The fewest inserts, deletes and replaces that turn one string into another." },
    { id: "algo-c-interval", domain: "d4", kind: "service", term: "Interval scheduling", definition: "Greedy: sort by end time and take each meeting that still fits." },
    { id: "algo-c-countmin", domain: "d4", kind: "service", term: "Count-min sketch", definition: "Approximate counts in fixed memory, for huge streams." },
    { id: "algo-c-overlap", domain: "d4", kind: "concept", term: "Overlapping subproblems", definition: "The same smaller inputs get solved again and again." },
    { id: "algo-c-substructure", domain: "d4", kind: "concept", term: "Optimal substructure", definition: "The best answer is built from the best answers to smaller pieces." },
    { id: "algo-c-greedychoice", domain: "d4", kind: "concept", term: "Greedy choice property", definition: "The choice that looks best now is part of some optimal solution." },
    { id: "algo-c-exchange", domain: "d4", kind: "concept", term: "Exchange argument", definition: "A proof that swapping in the greedy choice never makes the solution worse." },
    { id: "algo-c-prefixmap", domain: "d4", kind: "concept", term: "Prefix sums + hash map", definition: "Counts subarrays that sum to k in O(n), even with negative numbers." },
  ],
});
