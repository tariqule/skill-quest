import type { CodingChallenge } from "@/engine/types";

/**
 * Live Java exercises. In the browser they compile with the Eclipse compiler and run on CheerpJ's
 * Java 8 runtime (Java 10 syntax, Java 8 library). `npm test` compiles each reference solution and
 * starter with the local JDK using `--release 8`, so nothing newer than Java 8's library sneaks in.
 */
export const codingChallenges: CodingChallenge[] = [
  {
    id: "java-cc-01",
    language: "java",
    java: { params: ["int[]"], returns: "int" },
    domain: "d2",
    lesson: "d2-start-arrays",
    level: "beginner",
    title: "Largest number",
    idea: "loop over an array",
    complexity: "Time O(n), one pass. Space O(1).",
    prompt: "Complete `max(int[] nums)` in `class Solution`. It returns the largest value in `nums`, which always has at least one element. Watch out for arrays where every number is negative.",
    fn: "max",
    starter: `class Solution {
    int max(int[] nums) {
        int best = 0; // is 0 a safe starting value?
        for (int n : nums) {
            // TODO
        }
        return best;
    }
}`,
    tests: [
      { name: "positives", args: [[3, 9, 2]], expected: 9 },
      { name: "one element", args: [[7]], expected: 7 },
      { name: "all negative", args: [[-5, -2, -9]], expected: -2 },
      { name: "max at end", hidden: true, args: [[1, 2, 3, 100]], expected: 100 },
    ],
    hints: ["Start `best` at the first element, `nums[0]`, not at 0.", "Inside the loop: `if (n > best) best = n;`", "`Math.max(best, n)` does the same comparison."],
    solution: `class Solution {
    int max(int[] nums) {
        int best = nums[0];
        for (int n : nums) {
            if (n > best) best = n;
        }
        return best;
    }
}`,
    explanation: "Starting from `nums[0]` means the answer is always one of the array's values. Starting from 0 returns 0 for an all-negative array, a classic off-by-assumption bug. `Integer.MIN_VALUE` also works as a starting point.",
  },
  {
    id: "java-cc-02",
    language: "java",
    java: { params: ["String"], returns: "String" },
    domain: "d1",
    lesson: "d1-strings",
    level: "beginner",
    title: "Reverse a string",
    idea: "StringBuilder",
    complexity: "Time O(n). Space O(n). Building with `+=` in a loop would be O(n²).",
    prompt: "Complete `reverse(String s)`. It returns the characters of `s` in reverse order. An empty string stays empty.",
    fn: "reverse",
    starter: `class Solution {
    String reverse(String s) {
        // TODO
        return s;
    }
}`,
    tests: [
      { name: "word", args: ["hello"], expected: "olleh" },
      { name: "empty", args: [""], expected: "" },
      { name: "one char", args: ["a"], expected: "a" },
      { name: "with spaces", hidden: true, args: ["ab c"], expected: "c ba" },
    ],
    hints: ["Strings are immutable, so you build a new one.", "`new StringBuilder(s)` gives you a mutable copy.", "`StringBuilder` has a `reverse()` method; finish with `toString()`."],
    solution: `class Solution {
    String reverse(String s) {
        return new StringBuilder(s).reverse().toString();
    }
}`,
    explanation: "A `String` can't change, so each `+=` in a loop copies the whole string. `StringBuilder` is a mutable buffer: appending or reversing works in place, and `toString()` makes the final `String`.",
  },
  {
    id: "java-cc-03",
    language: "java",
    java: { params: ["String", "String"], returns: "boolean" },
    domain: "d1",
    lesson: "d1-equality",
    level: "junior",
    title: "Same text?",
    idea: "equals versus ==",
    complexity: "Time O(n) to compare n characters. Space O(1).",
    prompt: "Complete `sameIgnoringCase(String a, String b)`. Return `true` when the two strings hold the same text, ignoring upper and lower case. Either argument may be `null`; two nulls count as the same, one null does not.",
    fn: "sameIgnoringCase",
    starter: `class Solution {
    boolean sameIgnoringCase(String a, String b) {
        return a == b; // compares references, not text
    }
}`,
    tests: [
      { name: "same case", args: ["Java", "Java"], expected: true },
      { name: "different case", args: ["Java", "jAVA"], expected: true },
      { name: "different text", args: ["Java", "Jav"], expected: false },
      { name: "both null", hidden: true, args: [null, null], expected: true },
      { name: "one null", hidden: true, args: ["x", null], expected: false },
      { name: "null first", hidden: true, args: [null, "x"], expected: false },
    ],
    hints: ["`==` on objects asks \"same object?\", not \"same text?\".", "`equalsIgnoreCase` compares the text and ignores case. It returns false when given null.", "Handle `a == null` first, since calling a method on null throws `NullPointerException`."],
    solution: `class Solution {
    boolean sameIgnoringCase(String a, String b) {
        if (a == null) return b == null;
        return a.equalsIgnoreCase(b);
    }
}`,
    explanation: "`==` compares references, so two equal strings built at run time can be different objects. `equals` and `equalsIgnoreCase` compare contents. Checking `a` for null first avoids calling a method on null.",
  },
  {
    id: "java-cc-04",
    language: "java",
    java: { params: ["int[]", "int"], returns: "int[]" },
    domain: "d2",
    lesson: "d2-hashmap",
    level: "junior",
    title: "Two sum",
    idea: "HashMap lookup",
    complexity: "Time O(n), one map lookup per number. Space O(n). Two nested loops would be O(n²).",
    prompt: "Complete `twoSum(int[] nums, int target)`. Exactly one pair of different positions adds up to `target`. Return their indices as `new int[]{i, j}` with `i < j`.",
    fn: "twoSum",
    starter: `class Solution {
    int[] twoSum(int[] nums, int target) {
        // TODO: remember each value's index in a HashMap
        return new int[0];
    }
}`,
    tests: [
      { name: "start of array", args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { name: "middle", args: [[3, 2, 4], 6], expected: [1, 2] },
      { name: "same value twice", args: [[3, 3], 6], expected: [0, 1] },
      { name: "negatives", hidden: true, args: [[-1, -2, -3, -4, -5], -8], expected: [2, 4] },
    ],
    hints: ["For each `nums[j]`, the partner you need is `target - nums[j]`.", "Use a `Map<Integer, Integer>` from value to index.", "Look up the partner before you `put` the current value."],
    solution: `import java.util.HashMap;
import java.util.Map;

class Solution {
    int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> seen = new HashMap<>();
        for (int j = 0; j < nums.length; j++) {
            Integer i = seen.get(target - nums[j]);
            if (i != null) return new int[]{i, j};
            seen.put(nums[j], j);
        }
        return new int[0];
    }
}`,
    explanation: "`HashMap.get` is O(1) on average, so one pass is enough. `get` returns `null` for a missing key, which is why the index is held in an `Integer`, not an `int`: unboxing null would throw.",
  },
  {
    id: "java-cc-05",
    language: "java",
    java: { params: ["String"], returns: "Map<String, Integer>" },
    domain: "d2",
    lesson: "d2-start-maps",
    level: "junior",
    title: "Word count",
    idea: "HashMap.merge",
    complexity: "Time O(n) in the text length. Space O(k) for k distinct words.",
    prompt: "Complete `wordCount(String text)`. Split on whitespace, lower-case each word, and return a map from each word to how many times it appears. Blank text gives an empty map.",
    fn: "wordCount",
    starter: `import java.util.*;

class Solution {
    Map<String, Integer> wordCount(String text) {
        Map<String, Integer> counts = new HashMap<>();
        // TODO
        return counts;
    }
}`,
    tests: [
      { name: "repeats", args: ["the cat and the hat"], expected: { the: 2, cat: 1, and: 1, hat: 1 } },
      { name: "case folds", args: ["Go go GO"], expected: { go: 3 } },
      { name: "extra spaces", args: ["  a  b   a "], expected: { a: 2, b: 1 } },
      { name: "blank", hidden: true, args: ["   "], expected: {} },
    ],
    hints: ["`text.trim().split(\"\\\\s+\")` splits on runs of whitespace.", "Splitting an empty string gives one empty piece, so skip empty words.", "`counts.merge(word, 1, Integer::sum)` adds 1, or starts at 1 for a new word."],
    solution: `import java.util.*;

class Solution {
    Map<String, Integer> wordCount(String text) {
        Map<String, Integer> counts = new HashMap<>();
        for (String w : text.trim().split("\\\\s+")) {
            if (w.isEmpty()) continue;
            counts.merge(w.toLowerCase(), 1, Integer::sum);
        }
        return counts;
    }
}`,
    explanation: "`split` takes a regular expression, and `\\\\s+` matches one or more whitespace characters. `\"\".split(...)` returns an array holding one empty string, hence the `isEmpty` check. `Map.merge` combines the old and new value with `Integer::sum`, so there's no separate get-then-put.",
  },
  {
    id: "java-cc-06",
    language: "java",
    java: { params: ["String"], returns: "boolean" },
    domain: "d2",
    lesson: "d2-lists",
    level: "junior",
    title: "Balanced brackets",
    idea: "ArrayDeque as a stack",
    complexity: "Time O(n). Space O(n) for the stack.",
    prompt: "Complete `isBalanced(String s)`. Return `true` when every `(`, `[` and `{` is closed by its matching bracket in the right order. Other characters are ignored, and an empty string is balanced.",
    fn: "isBalanced",
    starter: `import java.util.*;

class Solution {
    boolean isBalanced(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        // TODO
        return false;
    }
}`,
    tests: [
      { name: "simple", args: ["()[]{}"], expected: true },
      { name: "wrong order", args: ["(]"], expected: false },
      { name: "nested", args: ["{[()]}"], expected: true },
      { name: "empty", args: [""], expected: true },
      { name: "close first", hidden: true, args: [")("], expected: false },
      { name: "left open", hidden: true, args: ["(("], expected: false },
    ],
    hints: ["`ArrayDeque` is the recommended stack: `push`, `pop`, `isEmpty`.", "On a closing bracket, check `stack.isEmpty()` before popping.", "Return `stack.isEmpty()` at the end so unclosed openers fail."],
    solution: `import java.util.*;

class Solution {
    boolean isBalanced(String s) {
        Deque<Character> stack = new ArrayDeque<>();
        for (char c : s.toCharArray()) {
            if (c == '(' || c == '[' || c == '{') stack.push(c);
            else if (c == ')' || c == ']' || c == '}') {
                if (stack.isEmpty()) return false;
                char open = stack.pop();
                if ((c == ')' && open != '(') || (c == ']' && open != '[') || (c == '}' && open != '{')) return false;
            }
        }
        return stack.isEmpty();
    }
}`,
    explanation: "`ArrayDeque` is faster than the legacy `Stack` class, which is synchronized. `pop()` on an empty deque throws `NoSuchElementException`, so the empty check comes first. Ending with `isEmpty()` catches input like `((`.",
  },
  {
    id: "java-cc-07",
    language: "java",
    java: { params: ["int[]"], returns: "List<Integer>" },
    domain: "d2",
    lesson: "d2-sets-maps",
    level: "intermediate",
    title: "Remove duplicates, keep order",
    idea: "LinkedHashSet",
    complexity: "Time O(n). Space O(n).",
    prompt: "Complete `dedupe(int[] nums)`. Return a `List<Integer>` holding each value once, in the order it first appeared.",
    fn: "dedupe",
    starter: `import java.util.*;

class Solution {
    List<Integer> dedupe(int[] nums) {
        Set<Integer> seen = new HashSet<>(); // what order does a HashSet keep?
        for (int n : nums) seen.add(n);
        return new ArrayList<>(seen);
    }
}`,
    tests: [
      { name: "repeats", args: [[3, 1, 3, 2, 1]], expected: [3, 1, 2] },
      { name: "empty", args: [[]], expected: [] },
      { name: "large values keep order", args: [[100, 5, 100, 42]], expected: [100, 5, 42] },
      { name: "all same", hidden: true, args: [[7, 7, 7]], expected: [7] },
      { name: "negatives", hidden: true, args: [[-1, 20, -1, 3]], expected: [-1, 20, 3] },
    ],
    hints: ["A `HashSet` makes no promise about iteration order.", "`LinkedHashSet` remembers insertion order.", "Swap the set type, or loop and add to a list only when `seen.add(n)` returns true."],
    solution: `import java.util.*;

class Solution {
    List<Integer> dedupe(int[] nums) {
        Set<Integer> seen = new LinkedHashSet<>();
        for (int n : nums) seen.add(n);
        return new ArrayList<>(seen);
    }
}`,
    explanation: "`HashSet` iterates in bucket order, which looks sorted for small numbers and then surprises you. `LinkedHashSet` keeps a linked list through its entries, so it iterates in insertion order at the same O(1) cost per add.",
  },
  {
    id: "java-cc-08",
    language: "java",
    java: { params: ["String[]"], returns: "List<List<String>>" },
    domain: "d2",
    lesson: "d2-generics",
    level: "intermediate",
    title: "Group anagrams",
    idea: "Map<String, List<String>>",
    complexity: "Time O(n · k log k) for n words of length k. Space O(n · k).",
    prompt: "Complete `groupAnagrams(String[] words)`. Anagrams use the same letters the same number of times. Return the groups as lists, each sorted alphabetically, with the groups sorted by their first word.",
    fn: "groupAnagrams",
    starter: `import java.util.*;

class Solution {
    List<List<String>> groupAnagrams(String[] words) {
        // TODO
        return new ArrayList<>();
    }
}`,
    tests: [
      { name: "classic", args: [["eat", "tea", "tan", "ate", "nat", "bat"]], expected: [["ate", "eat", "tea"], ["bat"], ["nat", "tan"]] },
      { name: "single", args: [["a"]], expected: [["a"]] },
      { name: "no anagrams", args: [["abc", "abd"]], expected: [["abc"], ["abd"]] },
      { name: "empty", hidden: true, args: [[]], expected: [] },
    ],
    hints: ["Sort a word's characters to get a key: `char[] cs = w.toCharArray(); Arrays.sort(cs); new String(cs)`.", "`map.computeIfAbsent(key, k -> new ArrayList<>()).add(w)` groups in one line.", "Sort each group, then sort the outer list with `Comparator.comparing(g -> g.get(0))`."],
    solution: `import java.util.*;

class Solution {
    List<List<String>> groupAnagrams(String[] words) {
        Map<String, List<String>> groups = new HashMap<>();
        for (String w : words) {
            char[] cs = w.toCharArray();
            Arrays.sort(cs);
            groups.computeIfAbsent(new String(cs), k -> new ArrayList<>()).add(w);
        }
        List<List<String>> out = new ArrayList<>();
        for (List<String> g : groups.values()) {
            Collections.sort(g);
            out.add(g);
        }
        out.sort(Comparator.comparing((List<String> g) -> g.get(0)));
        return out;
    }
}`,
    explanation: "The generic types say exactly what the map holds, so no casts are needed. `computeIfAbsent` creates the list the first time a key appears. The final sorts make the output order independent of `HashMap` iteration order.",
  },
  {
    id: "java-cc-09",
    language: "java",
    java: { params: ["List<String>", "int"], returns: "List<String>" },
    domain: "d3",
    lesson: "d3-streams",
    level: "intermediate",
    title: "Long words, upper-cased",
    idea: "stream filter / map / collect",
    complexity: "Time O(n). Space O(n) for the result.",
    prompt: "Complete `longWords(List<String> words, int min)`. Return, in the original order, every word with at least `min` characters, converted to upper case. Use a stream if you like.",
    fn: "longWords",
    starter: `import java.util.*;
import java.util.stream.*;

class Solution {
    List<String> longWords(List<String> words, int min) {
        // TODO: words.stream()...
        return words;
    }
}`,
    tests: [
      { name: "filters", args: [["a", "tree", "is", "green"], 4], expected: ["TREE", "GREEN"] },
      { name: "none long enough", args: [["hi", "yo"], 3], expected: [] },
      { name: "min 0 keeps all", args: [["x", ""], 0], expected: ["X", ""] },
      { name: "exactly min", hidden: true, args: [["abc", "ab"], 3], expected: ["ABC"] },
    ],
    hints: ["`filter(w -> w.length() >= min)` keeps the long ones.", "`map(String::toUpperCase)` converts each one.", "On Java 8, finish with `.collect(Collectors.toList())` (`toList()` on the stream arrived in Java 16)."],
    solution: `import java.util.*;
import java.util.stream.*;

class Solution {
    List<String> longWords(List<String> words, int min) {
        return words.stream()
            .filter(w -> w.length() >= min)
            .map(String::toUpperCase)
            .collect(Collectors.toList());
    }
}`,
    explanation: "Streams are lazy: `filter` and `map` describe the pipeline and `collect` runs it. Encounter order is kept for a list source. The lambda can read `min` because it's effectively final.",
  },
  {
    id: "java-cc-10",
    language: "java",
    java: { params: ["int[][]"], returns: "int[][]" },
    domain: "d2",
    lesson: "d2-lists",
    level: "senior",
    title: "Merge intervals",
    idea: "sort by start, then sweep",
    complexity: "Time O(n log n) for the sort. Space O(n).",
    prompt: "Complete `merge(int[][] intervals)`. Each interval is `{start, end}` with `start <= end`. Merge every pair that overlaps or touches and return the result sorted by start.",
    fn: "merge",
    starter: `import java.util.*;

class Solution {
    int[][] merge(int[][] intervals) {
        // TODO
        return intervals;
    }
}`,
    tests: [
      { name: "overlap", args: [[[1, 3], [2, 6], [8, 10], [15, 18]]], expected: [[1, 6], [8, 10], [15, 18]] },
      { name: "touching", args: [[[1, 4], [4, 5]]], expected: [[1, 5]] },
      { name: "unsorted input", args: [[[5, 6], [1, 2]]], expected: [[1, 2], [5, 6]] },
      { name: "contained", hidden: true, args: [[[1, 10], [2, 3], [4, 5]]], expected: [[1, 10]] },
      { name: "empty", hidden: true, args: [[]], expected: [] },
    ],
    hints: ["Sort a copy by start: `Arrays.sort(copy, (a, b) -> Integer.compare(a[0], b[0]))`.", "Collect results in a `List<int[]>`; extend the last one when `start <= last[1]`.", "Turn the list back into an array with `out.toArray(new int[0][])`."],
    solution: `import java.util.*;

class Solution {
    int[][] merge(int[][] intervals) {
        int[][] sorted = intervals.clone();
        Arrays.sort(sorted, (a, b) -> Integer.compare(a[0], b[0]));
        List<int[]> out = new ArrayList<>();
        for (int[] iv : sorted) {
            if (!out.isEmpty() && iv[0] <= out.get(out.size() - 1)[1]) {
                int[] last = out.get(out.size() - 1);
                last[1] = Math.max(last[1], iv[1]);
            } else {
                out.add(new int[]{iv[0], iv[1]});
            }
        }
        return out.toArray(new int[0][]);
    }
}`,
    explanation: "After sorting, only the last merged interval can overlap the next one. `Integer.compare` avoids the overflow that `a[0] - b[0]` can hit with large values. Copying each interval before changing it leaves the caller's arrays alone.",
  },
  {
    id: "java-cc-11",
    language: "java",
    java: { params: ["String"], returns: "int" },
    domain: "d3",
    lesson: "d3-exceptions",
    level: "senior",
    title: "Parse or default",
    idea: "catch NumberFormatException",
    complexity: "Time O(n) in the text length. Space O(1).",
    prompt: "Complete `parseOrDefault(String s)`. Return the number in `s` (leading and trailing spaces allowed) or `-1` when `s` is `null` or isn't a valid `int`. Catch only the exception `Integer.parseInt` throws for bad text.",
    fn: "parseOrDefault",
    starter: `class Solution {
    int parseOrDefault(String s) {
        return Integer.parseInt(s); // throws on bad input
    }
}`,
    tests: [
      { name: "number", args: ["42"], expected: 42 },
      { name: "spaces", args: ["  7 "], expected: 7 },
      { name: "not a number", args: ["abc"], expected: -1 },
      { name: "null", hidden: true, args: [null], expected: -1 },
      { name: "too big for int", hidden: true, args: ["99999999999"], expected: -1 },
      { name: "negative", hidden: true, args: ["-3"], expected: -3 },
    ],
    hints: ["`Integer.parseInt` throws `NumberFormatException` for text that isn't an int, including values out of range.", "It doesn't trim, so call `s.trim()` first, after a null check.", "Catch `NumberFormatException` by name, not `Exception`."],
    solution: `class Solution {
    int parseOrDefault(String s) {
        if (s == null) return -1;
        try {
            return Integer.parseInt(s.trim());
        } catch (NumberFormatException e) {
            return -1;
        }
    }
}`,
    explanation: "`NumberFormatException` is unchecked, so the compiler won't remind you to handle it. Catching that one type, rather than `Exception`, keeps real bugs visible. The null check comes first because `s.trim()` on null throws `NullPointerException`.",
  },
  {
    id: "java-cc-12",
    language: "java",
    java: { params: ["int", "int[][]"], returns: "List<Integer>" },
    domain: "d2",
    lesson: "d2-hashmap",
    level: "staff",
    title: "LRU cache",
    idea: "LinkedHashMap in access order",
    complexity: "Each get and put is O(1). Space O(capacity).",
    prompt: "Finish `class LRU`, then `run(capacity, ops)` replays operations on one cache. An op `{1, key, value}` is a put; `{0, key}` is a get that returns the value or `-1` and counts as a use. A put of a new key into a full cache evicts the least recently used key. Return the get results in order.",
    fn: "run",
    starter: `import java.util.*;

class LRU {
    private final int capacity;
    private final Map<Integer, Integer> map = new HashMap<>();

    LRU(int capacity) { this.capacity = capacity; }

    int get(int key) {
        // TODO
        return -1;
    }

    void put(int key, int value) {
        // TODO
    }
}

class Solution {
    List<Integer> run(int capacity, int[][] ops) {
        LRU cache = new LRU(capacity);
        List<Integer> out = new ArrayList<>();
        for (int[] op : ops) {
            if (op[0] == 1) cache.put(op[1], op[2]);
            else out.add(cache.get(op[1]));
        }
        return out;
    }
}`,
    tests: [
      { name: "evicts oldest", args: [2, [[1, 1, 1], [1, 2, 2], [0, 1], [1, 3, 3], [0, 2], [0, 3]]], expected: [1, -1, 3] },
      { name: "miss", args: [1, [[0, 5]]], expected: [-1] },
      { name: "update keeps one copy", args: [2, [[1, 1, 1], [1, 1, 10], [1, 2, 2], [0, 1]]], expected: [10] },
      { name: "put refreshes", hidden: true, args: [2, [[1, 1, 1], [1, 2, 2], [1, 1, 5], [1, 3, 3], [0, 2], [0, 1]]], expected: [-1, 5] },
    ],
    hints: ["`new LinkedHashMap<>(16, 0.75f, true)` orders entries by access, oldest first.", "Override `removeEldestEntry` to return `size() > capacity`; the map then evicts for you.", "`getOrDefault(key, -1)` counts as an access in access-order mode."],
    solution: `import java.util.*;

class LRU {
    private final Map<Integer, Integer> map;

    LRU(final int capacity) {
        map = new LinkedHashMap<Integer, Integer>(16, 0.75f, true) {
            @Override
            protected boolean removeEldestEntry(Map.Entry<Integer, Integer> eldest) {
                return size() > capacity;
            }
        };
    }

    int get(int key) {
        return map.getOrDefault(key, -1);
    }

    void put(int key, int value) {
        map.put(key, value);
    }
}

class Solution {
    List<Integer> run(int capacity, int[][] ops) {
        LRU cache = new LRU(capacity);
        List<Integer> out = new ArrayList<>();
        for (int[] op : ops) {
            if (op[0] == 1) cache.put(op[1], op[2]);
            else out.add(cache.get(op[1]));
        }
        return out;
    }
}`,
    explanation: "With the third constructor argument `true`, `LinkedHashMap` moves an entry to the end on every get or put. `removeEldestEntry` runs after each insert, so returning `size() > capacity` evicts the oldest entry automatically. The map's own bookkeeping replaces a hand-written doubly linked list.",
  },
];
