/**
 * Key data-structure concepts, used by the "teach before test" check.
 * If a question's prompt or correct answer mentions a concept, some lesson at or
 * before the question's lesson must mention it too. Add an entry when you add a
 * question about something new, then teach it in a lesson.
 */
export const CONCEPTS: [string, RegExp][] = [
  ["array", /\barrays?\b/i],
  ["dynamic array", /dynamic array|amortized|amortised/i],
  ["linked list", /linked list/i],
  ["doubly linked list", /doubly linked/i],
  ["ring buffer", /ring buffer|circular buffer/i],
  ["two pointers", /two pointers|fast and slow|slow and fast/i],
  ["stack", /\bstacks?\b/i],
  ["queue", /\bqueues?\b/i],
  ["deque", /\bdeque\b/i],
  ["hash map", /hash (map|table)/i],
  ["hash function", /hash function/i],
  ["collision", /collisions?\b/i],
  ["load factor", /load factor/i],
  ["set", /\bSet\b/],
  ["LRU cache", /\bLRU\b|least[- ]recently[- ]used/i],
  ["consistent hashing", /consistent hashing|hash ring/i],
  ["binary tree", /binary tree/i],
  ["binary search tree", /\bBST\b|binary search tree/i],
  ["balanced tree", /self-balancing|red-black|\bAVL\b|balanced (binary )?(search )?tree|height-balanced/i],
  ["B-tree", /\bB-tree/i],
  ["traversal", /preorder|inorder|in-order|postorder|level-order/i],
  ["heap", /\bheaps?\b|min-heap|max-heap/i],
  ["priority queue", /priority queue/i],
  ["trie", /\btries?\b|radix|patricia/i],
  ["skip list", /skip list/i],
  ["graph", /\bgraphs?\b/i],
  ["adjacency list", /adjacency list/i],
  ["adjacency matrix", /adjacency matrix/i],
  ["Big-O", /O\((1|n|log n|n log n|n²|n\^2)\)/],
  ["contiguous memory", /contiguous/i],
  ["lazy deletion", /lazy deletion/i],
  ["order-statistic tree", /order-statistic/i],
];
