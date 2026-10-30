/**
 * Key algorithm concepts, used by the "teach before test" check.
 * If a question's prompt or correct answer mentions a concept, some lesson at or
 * before the question's lesson must mention it too. Add an entry when you add a
 * question about something new, then teach it in a lesson.
 */
export const CONCEPTS: [string, RegExp][] = [
  ["Big-O", /big-o|O\(/i],
  ["amortized cost", /amortiz|amortis/i],
  ["tail latency", /tail latency|p99|p95/i],
  ["call stack", /call stack|stack overflow/i],
  ["merge sort", /merge sort/i],
  ["quicksort", /quicksort|quick sort/i],
  ["pivot", /\bpivot/i],
  ["heap sort", /heap ?sort/i],
  ["insertion sort", /insertion sort/i],
  ["counting sort", /counting sort|radix sort/i],
  ["stable sort", /\bstab(le|ility)\b/i],
  ["Timsort / hybrid sort", /timsort|introsort|hybrid/i],
  ["external sort", /external (merge )?sort/i],
  ["binary search", /binary search/i],
  ["binary search on the answer", /search on the answer|answer space/i],
  ["two pointers", /two pointers|two-pointer/i],
  ["sliding window", /sliding window/i],
  ["prefix sums", /prefix sum/i],
  ["recursion", /recursi/i],
  ["base case", /base case/i],
  ["backtracking", /backtrack/i],
  ["memoization", /memoi/i],
  ["BFS", /\bBFS\b|breadth-first/i],
  ["DFS", /\bDFS\b|depth-first/i],
  ["topological sort", /topological|kahn/i],
  ["Dijkstra", /dijkstra/i],
  ["union-find", /union-find|disjoint set/i],
  ["dynamic programming", /dynamic programming|\bDP\b/i],
  ["tabulation", /tabulation|bottom-up/i],
  ["greedy", /greedy/i],
  ["longest common subsequence", /common subsequence|\bLCS\b/i],
  ["monotonic stack", /monotonic/i],
  ["heap / top-k", /min-heap|max-heap|top[- ]k/i],
];
