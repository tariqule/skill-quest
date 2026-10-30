import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { java } from "../java";
import { CollectionChooser, HashMapLab } from "../labs";

/** Module 2: the Collections framework and generics. */
export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "Collections & Generics",
    world: "The Collection Vaults",
    weight: 25,
    emoji: "🗃️",
    color: "#38bdf8",
    summary:
      "Lists, sets, maps and queues and how fast each operation is, how HashMap works inside, ConcurrentHashMap, and generics with type erasure.",
  },

  tasks: [
    {
      id: "2.1",
      title: "Choose List, Set, Map, and Queue implementations",
      covers: [
        "ArrayList, LinkedList, ArrayDeque and PriorityQueue",
        "HashSet, LinkedHashSet, TreeSet and HashMap, LinkedHashMap, TreeMap",
        "Big-O of the common operations; fail-fast iterators; unmodifiable List.of",
      ],
    },
    {
      id: "2.2",
      title: "Explain HashMap internals and concurrent maps",
      covers: ["Buckets, hash spreading, load factor, resizing, treeified bins", "Keys that change", "ConcurrentHashMap and synchronized maps"],
    },
    {
      id: "2.3",
      title: "Use generics and understand type erasure",
      covers: ["Invariance, wildcards, PECS", "Type erasure and what it rules out", "Designing generic APIs"],
    },
  ],

  lessons: [
    {
      id: "d2-start-arrays",
      level: "beginner",
      task: "2.1",
      title: "Arrays: a row of numbered boxes",
      check: ["java-b2-01", "java-b2-02"],
      visual: (
        <CodeBlock
          lang="java"
          code={java`
            int[] scores = {90, 75, 60};     // three boxes, numbered 0, 1, 2
            System.out.println(scores[0]);   // 90  (the first box)
            System.out.println(scores[2]);   // 60  (the last box)
            System.out.println(scores.length); // 3
            scores[1] = 80;                  // change what's in box 1
          `}
        />
      ),
      points: [
        "An **array** holds several values of the same type in a row, like an egg box with numbered slots.",
        "You write the type with square brackets: `int[]` is an array of ints. `{90, 75, 60}` fills it in one go.",
        "Slots are numbered from 0, so `scores[0]` is the first value. The last one is at `scores.length - 1`.",
        "An array's size is fixed when you create it. You can change what's in a slot, but you can't add a new slot.",
      ],
      tip: "Asking for a slot that doesn't exist, like `scores[3]` here, throws `ArrayIndexOutOfBoundsException`. It's one of the first errors everyone meets.",
    },
    {
      id: "d2-start-lists",
      level: "beginner",
      task: "2.1",
      title: "ArrayList: a list that grows",
      check: ["java-b2-03", "java-b2-04"],
      visual: (
        <CodeBlock
          lang="java"
          code={java`
            List<String> names = new ArrayList<>();
            names.add("Ana");
            names.add("Ben");
            System.out.println(names.get(0));   // Ana
            System.out.println(names.size());   // 2

            for (String n : names) {            // for each name in the list
              System.out.println("Hi " + n);
            }
          `}
        />
      ),
      points: [
        "When you don't know how many items you'll have, use an **ArrayList**. It grows by itself as you add things, like a shopping list with endless lines.",
        "`List<String>` means \"a list of Strings\". The type in angle brackets says what the list may hold.",
        "`add` puts an item on the end, `get(i)` reads the item at position `i` (counting from 0), and `size()` tells you how many there are.",
        "A **for-each loop**, `for (String n : names)`, visits every item in turn. Read the colon as \"in\".",
      ],
      tip: "Lists hold objects, so for numbers you write `List<Integer>`, not `List<int>`. Java converts between `int` and `Integer` for you.",
    },
    {
      id: "d2-start-maps",
      level: "beginner",
      task: "2.1",
      title: "Maps: look things up by name",
      check: ["java-b2-05", "java-b2-06"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="java"
            code={java`
              Map<String, Integer> ages = new HashMap<>();
              ages.put("Ana", 31);      // key "Ana", value 31
              ages.put("Ben", 27);
              System.out.println(ages.get("Ana"));   // 31
              System.out.println(ages.get("Zoe"));   // null (no such key)
            `}
          />
          <Tiles
            tiles={[
              { icon: "🔑", title: "Key", text: "What you look up by, like a name in a phone book. Each key appears once.", color: "#38bdf8" },
              { icon: "📦", title: "Value", text: "What you get back, like the phone number next to the name.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "A **Map** stores pairs: a **key** and its **value**. It works like a phone book, where you look up a name to find the number.",
        "`put(key, value)` stores a pair, and `get(key)` gives you the value back. That lookup is fast, even with millions of entries.",
        "Keys are unique. Putting a key that's already there replaces its old value.",
        "If you `get` a key that isn't there, you get `null`, which means \"nothing\".",
      ],
      tip: "`HashMap` is the everyday choice. It doesn't keep keys in any particular order, so don't rely on the order they print in.",
    },
    {
      id: "d2-lists",
      level: "junior",
      task: "2.1",
      title: "Lists and queues: pick by how you use them",
      check: ["d2-01", "d2-20"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "📚", title: "ArrayList", text: "get(i) is O(1), adding at the end is O(1) on average, inserting in the middle is O(n). The default list.", color: "#38bdf8" },
              { icon: "🔗", title: "LinkedList", text: "O(1) at the ends but O(n) for get(i), with extra memory per item. Rarely the best pick.", color: "#94a3b8" },
              { icon: "🔄", title: "ArrayDeque", text: "Push, pop, offer and poll at either end in O(1). Use it as your stack and your queue.", color: "#34d399" },
              { icon: "⛰️", title: "PriorityQueue", text: "A binary heap: offer and poll are O(log n), peek is O(1). Looping over it isn't in sorted order.", color: "#f59e0b" },
              { icon: "🧊", title: "List.of / copyOf", text: "Can't be changed: add, set or remove throws UnsupportedOperationException. No nulls allowed.", color: "#a78bfa" },
              { icon: "📏", title: "Arrays.asList", text: "A fixed-size view over an array: set works, but add and remove throw.", color: "#f472b6" },
            ]}
          />
          <CodeCompare
            lang="java"
            left={{
              title: "Throws ConcurrentModificationException",
              code: java`
                for (String n : names) {
                  if (n.startsWith("b")) {
                    names.remove(n);
                  }
                }
              `,
            }}
            right={{
              title: "Safe: let the collection do it",
              code: java`
                names.removeIf(n -> n.startsWith("b"));

                // or with an explicit iterator:
                Iterator<String> it = names.iterator();
                while (it.hasNext())
                  if (it.next().startsWith("b")) it.remove();
              `,
            }}
          />
        </div>
      ),
      points: [
        "Use `ArrayList` for lists and `ArrayDeque` for stacks and queues by default. The old `Stack` and `Vector` classes are synchronized and slower.",
        "Calling `get(i)` in a loop over a `LinkedList` is O(n²), because each call walks the chain. Use a for-each loop instead.",
        "The standard collections' iterators are **fail-fast**. If you add or remove items while looping, they try to stop you with `ConcurrentModificationException`.",
        "For a list that many threads read but rarely change, `CopyOnWriteArrayList` gives reads with no locking at all.",
      ],
      tip: "Always say the Big-O when you name a collection. For example: \"ArrayList, because get(i) is O(1) and we mostly append.\"",
    },
    {
      id: "d2-sets-maps",
      level: "intermediate",
      task: "2.1",
      title: "Sets and maps: order, sorting, and lookups",
      check: ["d2-05", "d2-06"],
      visual: (
        <div className="grid gap-6">
          <Tiles
            cols={3}
            tiles={[
              { icon: "#️⃣", title: "HashMap / HashSet", text: "O(1) get, put and contains on average. No order promised. HashMap allows one null key.", color: "#38bdf8" },
              { icon: "🔗", title: "LinkedHashMap / Set", text: "Hash speed plus a predictable order: the order you inserted, or the order you last used (handy for LRU caches).", color: "#a78bfa" },
              { icon: "🌲", title: "TreeMap / TreeSet", text: "A red-black tree: O(log n), sorted by key, with floor, ceiling and range views.", color: "#34d399" },
            ]}
          />
          <CollectionChooser />
        </div>
      ),
      points: [
        "Every `Set` is built on a `Map`. `HashSet` uses a `HashMap` inside, and `TreeSet` uses a `TreeMap`.",
        "Tree collections need keys that are `Comparable`, or a `Comparator`. They use that comparison, not `equals`, to decide what counts as a duplicate.",
        "`Map.merge`, `computeIfAbsent` and `getOrDefault` replace most hand-written \"get it, then put it back\" code.",
        "`put` returns the old value, or null if there wasn't one, so it also tells you whether the key was already there.",
      ],
      tip: "An LRU cache is a favourite question: `new LinkedHashMap<>(16, 0.75f, true)` plus overriding `removeEldestEntry`. Mention it, then offer to code it.",
    },
    {
      id: "d2-hashmap",
      level: "senior",
      task: "2.2",
      title: "Inside HashMap",
      check: ["d2-09", "d2-12"],
      visual: (
        <div className="grid gap-6">
          <Flow
            color="#38bdf8"
            steps={[
              { icon: "🔢", label: "hashCode()", sub: "Then spread the bits: h ^ (h >>> 16)" },
              { icon: "🪣", label: "Pick a bucket", sub: "index = hash & (table.length - 1)" },
              { icon: "🔍", label: "Walk the bucket", sub: "Compare the hash first, then equals" },
              { icon: "➕", label: "Insert or replace", sub: "Add a node, or overwrite the value" },
              { icon: "📈", label: "Resize?", sub: "If size > capacity × 0.75, double the table and re-bucket" },
            ]}
          />
          <HashMapLab />
        </div>
      ),
      points: [
        "By default a HashMap has 16 buckets and a load factor of 0.75, so it first resizes when the 13th entry goes in. Its capacity is always a power of two.",
        "Since Java 8, a bucket with more than 8 entries (in a table of at least 64 buckets) turns into a red-black tree. The worst case drops from O(n) to O(log n).",
        "Never change a key after you've put it in the map. Its hash changes, and the map then looks in the wrong bucket.",
        "`ConcurrentHashMap` locks one bucket at a time on writes and never locks for reads. It doesn't allow null keys or values.",
        "Size big maps up front (`HashMap.newHashMap(n)` in Java 19 and later) so they don't resize over and over while filling.",
      ],
      tip: "When asked how HashMap works, walk through `put` in order: hash, bucket, walk, insert, resize. Then add the tree buckets and the null-key detail.",
    },
    {
      id: "d2-generics",
      level: "senior",
      task: "2.3",
      title: "Generics, wildcards, and type erasure",
      check: ["d2-15", "d2-16"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="java"
            caption="Generic types are checked at compile time, then erased. While the program runs, both lists are just ArrayList."
            code={java`
              List<String> a = new ArrayList<>();
              List<Integer> b = new ArrayList<>();
              a.getClass() == b.getClass();      // true

              List<? extends Number> producer = List.of(1, 2.5);
              Number n = producer.get(0);        // reading: fine
              // producer.add(3);                // won't compile

              List<? super Integer> consumer = new ArrayList<Number>();
              consumer.add(42);                  // writing: fine
            `}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "📤", title: "? extends T", text: "A producer: you read Ts out of it. You can't add to it (except null).", color: "#38bdf8" },
              { icon: "📥", title: "? super T", text: "A consumer: you put Ts into it. What you read back is just Object.", color: "#f59e0b" },
              { icon: "🧽", title: "Erasure", text: "No new T(), no instanceof List<String>, no generic arrays, and no overloads that erase to the same signature.", color: "#f472b6" },
            ]}
          />
        </div>
      ),
      points: [
        "Generics are **invariant**: a `List<String>` is not a `List<Object>`. Arrays are different; they allow it and check each store at runtime, throwing `ArrayStoreException`.",
        "**PECS** stands for Producer Extends, Consumer Super. For example, `Collections.copy(List<? super T> dest, List<? extends T> src)`.",
        "**Type erasure** means type parameters are replaced by their bound (usually `Object`) after compiling. At runtime, Java can't tell `List<String>` from `List<Integer>`.",
        "Raw types (`List` with no type in angle brackets) switch off these checks. They only exist so code from before Java 5 still compiles.",
      ],
      tip: "If you're asked why `new T()` fails, answer in one sentence: \"T doesn't exist at runtime because of erasure, so pass in a `Supplier<T>` or `Class<T>` instead.\"",
    },
  ],

  questions: [
    // ───────────── Start here ─────────────
    {
      id: "java-b2-01",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-arrays",
      type: "output",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        int[] scores = {90, 75, 60};
        System.out.println(scores[1]);
      `,
      answers: ["75"],
      explanation:
        "Array slots are numbered from 0. `scores[0]` is 90, so `scores[1]`, the second slot, is 75.",
    },
    {
      id: "java-b2-02",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-arrays",
      prompt: "You made `int[] scores = new int[3];`. Later you want to store a fourth score. What's true?",
      options: [
        "The array can't grow; you'd need a new, bigger array or an `ArrayList`",
        "It grows to 4 slots automatically",
        "Writing to `scores[3]` quietly does nothing",
        "You can call `scores.add(...)` to add another slot at the end",
      ],
      answer: [0],
      explanation:
        "An array's size is fixed when it's created. Writing to `scores[3]` throws `ArrayIndexOutOfBoundsException`, and arrays have no `add` method. When you need a collection that grows, use an `ArrayList`.",
    },
    {
      id: "java-b2-03",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-lists",
      type: "output",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        List<String> names = new ArrayList<>();
        names.add("Ana");
        names.add("Ben");
        System.out.println(names.size());
      `,
      answers: ["2"],
      explanation:
        "The list starts empty. Each `add` puts one name on the end, so after two adds, `size()` is 2.",
    },
    {
      id: "java-b2-04",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-lists",
      type: "fill",
      prompt: "Fill the gap so the loop greets every name in the list.",
      codeLang: "java",
      code: java`
        List<String> names = List.of("Ana", "Ben");
        for ({{1}} n : names) {
          System.out.println("Hi " + n);
        }
      `,
      blanks: [{ options: ["String", "List", "int", "names"], answer: 0 }],
      explanation:
        "In a for-each loop, you name the type of one item, then the variable, then the list. Each item in a `List<String>` is a `String`, so you write `for (String n : names)`.",
    },
    {
      id: "java-b2-05",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-maps",
      type: "output",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        Map<String, Integer> ages = new HashMap<>();
        ages.put("Ana", 31);
        System.out.println(ages.get("Ana"));
      `,
      answers: ["31"],
      explanation:
        "`put` stores the pair: key `\"Ana\"`, value 31. `get(\"Ana\")` looks up that key and hands back its value.",
    },
    {
      id: "java-b2-06",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-maps",
      prompt: "A map already has the key `\"Ana\"` with value 31. What does `ages.put(\"Ana\", 32)` do?",
      options: [
        "Replaces the old value, so `\"Ana\"` now maps to 32",
        "Adds a second `\"Ana\"` entry, so the map holds both",
        "Throws an error because the key already exists",
        "Does nothing, because the first value wins",
      ],
      answer: [0],
      explanation:
        "Keys in a map are unique, like names in a phone book. Putting a key that's already there swaps in the new value. The map still has just one entry for `\"Ana\"`.",
    },
    // ───────────── Interview questions ─────────────
    {
      id: "d2-01",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-lists",
      prompt: "How does the running time of this loop grow?",
      codeLang: "java",
      code: java`
        List<Integer> list = new LinkedList<>(data);   // n elements
        long sum = 0;
        for (int i = 0; i < list.size(); i++) {
          sum += list.get(i);
        }
      `,
      options: ["O(n²)", "O(n)", "O(n log n)", "O(1)"],
      answer: [0],
      explanation:
        "`LinkedList.get(i)` has to walk node by node from the nearer end, so each call is O(n), and doing it n times is O(n²). A for-each loop uses the iterator and is O(n). With an `ArrayList`, `get(i)` is O(1).",
    },
    {
      id: "d2-02",
      domain: "d2",
      level: "junior",
      lesson: "d2-lists",
      prompt: "What does `list.add(0, x)` cost on an `ArrayList` holding n elements?",
      options: ["O(n), because every element shifts one slot right", "O(1), just like adding at the end of the list", "O(log n)", "O(n²)"],
      answer: [0],
      explanation:
        "An `ArrayList` is one block of memory, so putting something at the front means moving all n items along by one. Adding at the end is O(1) on average. If you need cheap inserts at the front, use an `ArrayDeque`.",
    },
    {
      id: "d2-03",
      domain: "d2",
      level: "junior",
      lesson: "d2-lists",
      prompt: "You need a stack in new code. What do the JDK docs recommend instead of `java.util.Stack`?",
      options: ["`ArrayDeque` (through the `Deque` interface)", "`Vector`", "`Hashtable`, keyed by position, since it's synchronized and fast", "`TreeSet`"],
      answer: [0],
      explanation:
        "The `Deque` docs recommend it over the old `Stack` class. `ArrayDeque` is documented as likely faster than `Stack` when used as a stack, and faster than `LinkedList` when used as a queue. `Stack` is built on the synchronized `Vector`.",
    },
    {
      id: "d2-04",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-lists",
      type: "lines",
      prompt: "This throws `ConcurrentModificationException`. Tap the line that causes it.",
      codeLang: "java",
      code: java`
        List<String> names = new ArrayList<>(List.of("bob", "ann", "cy"));
        for (String n : names) {
          if (n.startsWith("b")) {
            names.remove(n);
          }
        }
      `,
      answer: [4],
      explanation:
        "Removing through the list, rather than through the loop's iterator, bumps the list's change counter. The iterator notices on its next `next()` call and fails fast. Use `names.removeIf(n -> n.startsWith(\"b\"))` or `iterator.remove()`.",
    },
    {
      id: "d2-05",
      domain: "d2",
      level: "junior",
      lesson: "d2-sets-maps",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        Set<String> s = new TreeSet<>(List.of("pear", "apple", "fig"));
        System.out.println(s);
      `,
      options: ["`[apple, fig, pear]`", "`[pear, apple, fig]`", "`[fig, pear, apple]`", "The order is unpredictable"],
      answer: [0],
      explanation:
        "A `TreeSet` keeps its items sorted in their natural order, which is alphabetical for strings. To keep insertion order you'd use a `LinkedHashSet`, and a `HashSet` promises no order at all.",
    },
    {
      id: "d2-06",
      domain: "d2",
      level: "junior",
      lesson: "d2-sets-maps",
      type: "match",
      prompt: "Match each requirement to the best collection.",
      pairs: [
        ["Keys kept sorted; need `floorKey` and range queries", "`TreeMap`"],
        ["Fast lookups, iterate in insertion order", "`LinkedHashMap`"],
        ["Unique elements, O(1) `contains`, order irrelevant", "`HashSet`"],
        ["Always take the smallest element next", "`PriorityQueue`"],
        ["Index-based reads, mostly appending", "`ArrayList`"],
      ],
      explanation:
        "Sorted navigation needs a tree. Hash speed with a predictable order is a linked hash map. Plain \"is it in there?\" checks suit a hash set. Repeatedly taking the smallest item is a heap's job, and reading by position is what an array list does best.",
    },
    {
      id: "d2-07",
      domain: "d2",
      level: "junior",
      lesson: "d2-sets-maps",
      prompt: "`TreeMap` is a red-black tree. What do `get`, `put`, and `remove` cost?",
      options: ["O(log n)", "O(1) on average", "O(n)", "O(n log n)"],
      answer: [0],
      explanation:
        "A balanced tree keeps its height at O(log n), so each operation walks one path from the root down. You give up a HashMap's O(1) in exchange for sorted keys and the navigation methods.",
    },
    {
      id: "d2-08",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-sets-maps",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        Map<String, Integer> m = new HashMap<>();
        m.put("a", 1);
        Integer old = m.put("a", 2);
        m.merge("a", 10, Integer::sum);
        System.out.println(old + " " + m.get("a") + " " + m.size());
      `,
      options: ["`1 12 1`", "`null 12 1`", "`1 10 1`", "`1 12 2`"],
      answer: [0],
      explanation:
        "`put` returns the old value, 1, and replaces it with 2. `merge` combines the existing 2 with 10 using `Integer::sum`, which gives 12. There's still only one key, so the size is 1.",
    },
    {
      id: "d2-09",
      domain: "d2",
      level: "senior",
      lesson: "d2-hashmap",
      prompt: "In Java 8 and later, what does `HashMap` do when one bucket collects many colliding keys?",
      options: [
        "Past 8 entries (in a table of at least 64 buckets), the bucket's linked list becomes a red-black tree, so lookups in it are O(log n)",
        "It throws an exception once a single bucket holds more than 8 keys, so the map has to be resized by hand with a bigger initial capacity",
        "It rehashes every key with a new random seed",
        "Nothing: the chain keeps growing and lookups stay O(n)",
      ],
      answer: [0],
      explanation:
        "Turning a long bucket into a tree (the thresholds are 8 entries and 64 buckets) limits the damage from bad hash codes or deliberate collisions. If the table has fewer than 64 buckets, HashMap resizes instead.",
    },
    {
      id: "d2-10",
      domain: "d2",
      level: "senior",
      lesson: "d2-hashmap",
      prompt: "A `new HashMap<>()` has the default capacity of 16 and load factor 0.75. When does it first resize?",
      options: ["When the 13th entry is added", "When the 16th entry is added", "When the 17th entry is added", "When the 8th entry is added"],
      answer: [0],
      explanation:
        "The threshold is 16 times 0.75, which is 12. After each insert, if the size goes above 12, the table doubles to 32 and every entry is moved to its new bucket. So the 13th entry triggers it.",
    },
    {
      id: "d2-11",
      domain: "d2",
      level: "senior",
      lesson: "d2-hashmap",
      type: "order",
      prompt: "Put the steps of `HashMap.put(key, value)` in order.",
      items: [
        "Call `key.hashCode()` and spread the bits (`h ^ (h >>> 16)`)",
        "Pick the bucket: `index = hash & (table.length - 1)`",
        "Walk the bucket, comparing the hash and then `equals` on each key",
        "Replace the value if a key matches; otherwise append a new node",
        "Increment the size and resize if it exceeds capacity × load factor",
      ],
      explanation:
        "Spreading the high bits into the low bits matters because picking a bucket only looks at the low bits. Comparing the stored hash first avoids most `equals` calls. Resizing comes last, once the new entry has been counted.",
    },
    {
      id: "d2-12",
      domain: "d2",
      level: "senior",
      lesson: "d2-hashmap",
      type: "lines",
      prompt: "This prints `null` even though \"ana\" was stored. Tap the line that breaks the lookup.",
      codeLang: "java",
      code: java`
        Map<List<Integer>, String> owners = new HashMap<>();
        List<Integer> key = new ArrayList<>(List.of(1, 2));
        owners.put(key, "ana");
        key.add(3);
        System.out.println(owners.get(List.of(1, 2)));
      `,
      answer: [4],
      explanation:
        "The entry was filed under the hash of [1, 2]. Changing the key turns it into [1, 2, 3], so it no longer equals [1, 2]. A lookup with the changed key would compute a different hash and search the wrong bucket. Keys must never change while they're in a map.",
    },
    {
      id: "d2-13",
      domain: "d2",
      level: "senior",
      lesson: "d2-hashmap",
      prompt: "Why prefer `ConcurrentHashMap` over `Collections.synchronizedMap(new HashMap<>())` under heavy concurrent use?",
      options: [
        "Reads don't lock and writes lock only one bucket, so threads rarely block each other; it also has atomic `compute` and `merge`",
        "It allows null keys and values",
        "Its iterators throw `ConcurrentModificationException` to catch races early, so threads find out about conflicts sooner",
        "It keeps keys in sorted order",
      ],
      answer: [0],
      explanation:
        "A synchronized map sends every call through one lock. ConcurrentHashMap uses compare-and-swap and per-bucket locks, so it scales with more threads. It bans nulls, so a null from `get` always means \"missing\", and its iterators don't throw. For sorted keys across threads, use `ConcurrentSkipListMap`.",
    },
    {
      id: "d2-14",
      domain: "d2",
      level: "senior",
      lesson: "d2-hashmap",
      prompt: "Which two statements about `ConcurrentHashMap` are true? (Choose two.)",
      options: [
        "`map.merge(word, 1, Integer::sum)` updates the count atomically",
        "Its iterators are weakly consistent and don't throw `ConcurrentModificationException`",
        "`put(key, null)` stores a null value",
        "`if (!map.containsKey(k)) map.put(k, v);` is atomic as a whole",
        "Every method locks the entire map",
      ],
      answer: [0, 1],
      explanation:
        "Single methods like `merge`, `compute` and `putIfAbsent` are atomic. Two calls in a row are not, because another thread can sneak in between them, so use `putIfAbsent` or `computeIfAbsent`. Null values throw `NullPointerException`.",
    },
    {
      id: "d2-15",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-generics",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        List<String> a = new ArrayList<>();
        List<Integer> b = new ArrayList<>();
        System.out.println(a.getClass() == b.getClass());
      `,
      options: ["`true`", "`false`", "Compile error: incomparable types", "It depends on the JVM"],
      answer: [0],
      explanation:
        "This is type erasure. The type in angle brackets only exists at compile time. When the program runs, both objects are plain `java.util.ArrayList`, so they share one `Class` object.",
    },
    {
      id: "d2-16",
      domain: "d2",
      level: "senior",
      lesson: "d2-generics",
      type: "lines",
      prompt: "Tap the line that doesn't compile.",
      codeLang: "java",
      code: java`
        List<Integer> ints = new ArrayList<>(List.of(1, 2));
        List<? extends Number> nums = ints;
        Number first = nums.get(0);
        nums.add(3);
        List<? super Integer> sink = new ArrayList<Number>();
        sink.add(4);
      `,
      answer: [4],
      explanation:
        "As far as the compiler knows, `? extends Number` could be a `List<Double>`, so adding an Integer is rejected. You can only read from it. `? super Integer` is a consumer, so adding Integers to it is fine.",
    },
    {
      id: "d2-17",
      domain: "d2",
      level: "senior",
      lesson: "d2-generics",
      prompt: "Why does `Collections.copy` have the signature `copy(List<? super T> dest, List<? extends T> src)`?",
      options: [
        "`src` only produces Ts and `dest` only consumes them: Producer Extends, Consumer Super",
        "Wildcards make the method run faster",
        "So that `dest` and `src` must be exactly the same type",
        "Because generic methods can't use plain `List<T>` parameters for copying",
      ],
      answer: [0],
      explanation:
        "With PECS you can copy a `List<Integer>` into a `List<Number>` or a `List<Object>`. Plain `List<T>` on both sides would force the element types to match exactly, because generics are invariant.",
    },
    {
      id: "d2-18",
      domain: "d2",
      level: "senior",
      lesson: "d2-generics",
      prompt: "Which two do NOT compile because of type erasure? (Choose two.)",
      options: [
        "`new T()` inside `class Box<T>`",
        "`obj instanceof List<String>`, where `obj` is declared `Object`",
        "`static <T> T first(List<T> xs) { return xs.get(0); }`",
        "`List<?> any = new ArrayList<String>();`",
        "`Map<String, List<Integer>> m = new HashMap<>();`",
      ],
      answer: [0, 1],
      explanation:
        "`T` isn't known at runtime, so there's no constructor to call, and Java can't check `List<String>` against `List<Integer>` while running. (`obj instanceof List<?>` is fine.) The other three are ordinary, valid generic code.",
    },
    {
      id: "d2-19",
      domain: "d2",
      level: "junior",
      lesson: "d2-generics",
      prompt: "What happens with this code?",
      codeLang: "java",
      code: java`
        List<String> strings = new ArrayList<>();
        List<Object> objects = strings;
      `,
      options: [
        "Compile error: `List<String>` is not a `List<Object>`",
        "It compiles, because every String is an Object",
        "It compiles but throws `ClassCastException` at runtime",
        "It compiles with only an unchecked warning",
      ],
      answer: [0],
      explanation:
        "Generics are invariant. If this compiled, `objects.add(42)` would sneak an Integer into a list of Strings. For a read-only view, use `List<? extends Object>` or `List<?>`.",
    },
    {
      id: "d2-20",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-lists",
      prompt: "What happens when this runs?",
      codeLang: "java",
      code: java`
        List<Integer> a = Arrays.asList(1, 2, 3);
        a.set(0, 9);
        List<Integer> b = List.of(1, 2, 3);
        b.set(0, 9);
      `,
      options: [
        "`a.set` works; `b.set` throws `UnsupportedOperationException`",
        "Both calls work",
        "Both of the calls throw `UnsupportedOperationException`",
        "`a.set` throws; `b.set` works",
      ],
      answer: [0],
      explanation:
        "`Arrays.asList` is a fixed-size view over an array: `set` writes straight through, but `add` and `remove` throw. `List.of` can't be changed at all, so even `set` throws.",
    },
    {
      id: "d2-21",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-lists",
      prompt: "What do `offer`, `poll`, and `peek` cost on a `PriorityQueue` of n elements?",
      options: ["O(log n), O(log n), O(1)", "O(1), O(1), O(1)", "O(n), O(1), O(1)", "O(log n), O(n), O(log n)"],
      answer: [0],
      explanation:
        "A binary heap moves a new item up into place on insert, and moves an item down after removing the top, each in O(log n). The smallest item always sits at the top, so `peek` is O(1). `contains` and `remove(Object)` are O(n).",
    },
    {
      id: "d2-22",
      domain: "d2",
      level: "staff",
      lesson: "d2-hashmap",
      prompt: "A public endpoint puts user-supplied strings into a `HashMap`. An attacker sends thousands of different keys that share one `hashCode`. What limits the damage on Java 8 and later, and what else should you do?",
      options: [
        "Long buckets become red-black trees (String is Comparable), so lookups slow to O(log n) rather than O(n); still cap request size and key count at the edge",
        "Nothing is needed: HashMap picks a random hash seed per JVM, so collisions can't be forced by a client that sends crafted string keys",
        "Switch to `Hashtable`, which is immune to collisions",
        "Switch to `IdentityHashMap`, which ignores `hashCode`",
      ],
      answer: [0],
      explanation:
        "String hash codes are predictable, so attackers can craft collisions (\"Aa\" and \"BB\" share one). Tree buckets blunt this hash-flooding attack, and input limits stop it at the door. `Hashtable` chains collisions the same way, and `IdentityHashMap` would break lookups by value.",
    },
    {
      id: "d2-23",
      domain: "d2",
      level: "staff",
      lesson: "d2-lists",
      prompt: "A list of feature flags is read in full by every request thread thousands of times a second, and changes a few times an hour. Which implementation fits best?",
      options: ["`CopyOnWriteArrayList`", "`Collections.synchronizedList(new ArrayList<>())`", "`Vector`", "`LinkedList`"],
      answer: [0],
      explanation:
        "Copy-on-write lets every read and loop run with no locking, over a snapshot that never changes. It only pays a cost on the rare writes. Synchronized lists and `Vector` make readers queue up, and looping over a synchronized list still needs manual locking. `LinkedList` isn't thread-safe at all.",
    },
    {
      id: "d2-24",
      domain: "d2",
      level: "staff",
      lesson: "d2-hashmap",
      prompt: "You're building an in-memory index of about 10 million entries keyed by numeric ids. Which two choices cut memory use and load time? (Choose two.)",
      options: [
        "Pre-size the map (`HashMap.newHashMap(10_000_000)` in Java 19+) so it never resizes while loading",
        "Avoid boxing every key: use primitive `long` keys in a primitive-specialized map, or pack the data into arrays",
        "Lower the load factor to 0.1 so there are fewer collisions",
        "Use `LinkedHashMap`, which has less overhead per entry",
        "Use `TreeMap`, because it doesn't allocate a bucket table",
      ],
      answer: [0, 1],
      explanation:
        "Sizing up front skips about 20 rounds of doubling and moving entries. Each boxed `Long` key is an extra object on top of the entry itself, so primitive keys save a lot at this scale. A 0.1 load factor leaves most of the table empty. `LinkedHashMap` and `TreeMap` entries carry extra pointers, so they use more memory, not less.",
    },
    {
      id: "d2-25",
      domain: "d2",
      level: "staff",
      lesson: "d2-generics",
      prompt: "Your library offers `double total(List<Number> xs)`, which only reads from `xs`. Callers with a `List<Integer>` can't use it. What's the best fix that keeps already-compiled callers working?",
      options: [
        "Change the parameter to `List<? extends Number>`: it erases to the same `List` signature, and Integer or Double lists now work",
        "Add an overload `double total(List<Integer> xs)`",
        "Change the parameter to the raw type `List`",
        "Change the parameter to `Collection<? extends Number>`, which keeps the same erased signature and also accepts Sets and Queues",
      ],
      answer: [0],
      explanation:
        "A parameter you only read from should use `? extends`. Erasure keeps the compiled signature as `total(List)`, so old compiled callers still link. The overload doesn't compile, because both versions erase to `total(List)`. Raw types throw away type safety. `Collection` is more flexible in source, but it changes the compiled signature, so old binaries would fail with `NoSuchMethodError` until rebuilt.",
    },
  ],

  cards: [
    { id: "j-arraylist", domain: "d2", kind: "service", term: "ArrayList", definition: "A list backed by an array that grows. get(i) is O(1), appending is O(1) on average, inserting in the middle is O(n)." },
    { id: "j-linkedlist", domain: "d2", kind: "service", term: "LinkedList", definition: "A chain of nodes linked both ways. O(1) at the ends, but O(n) to reach a position with get(i)." },
    { id: "j-arraydeque", domain: "d2", kind: "service", term: "ArrayDeque", definition: "A double-ended queue built on a ring buffer. The recommended choice for both stacks and queues." },
    { id: "j-priorityqueue", domain: "d2", kind: "service", term: "PriorityQueue", definition: "A binary min-heap. offer and poll are O(log n), and peek at the smallest item is O(1)." },
    { id: "j-hashmap", domain: "d2", kind: "service", term: "HashMap", definition: "A hash table of buckets. get and put are O(1) on average, and keys come out in no particular order." },
    { id: "j-linkedhashmap", domain: "d2", kind: "service", term: "LinkedHashMap", definition: "A HashMap that remembers insertion order, or the order you last used each key. Handy for LRU caches." },
    { id: "j-treemap", domain: "d2", kind: "service", term: "TreeMap", definition: "A map built on a red-black tree, kept sorted by key, with floor, ceiling and range views." },
    { id: "j-hashset", domain: "d2", kind: "service", term: "HashSet", definition: "A set of unique items, built on a HashMap. contains is O(1) on average." },
    { id: "j-treeset", domain: "d2", kind: "service", term: "TreeSet", definition: "A sorted set built on a TreeMap. Its operations are O(log n)." },
    { id: "j-chm", domain: "d2", kind: "service", term: "ConcurrentHashMap", definition: "A thread-safe map. Reads take no lock, writes lock one bucket at a time, and nulls aren't allowed." },
    { id: "j-cowal", domain: "d2", kind: "service", term: "CopyOnWriteArrayList", definition: "A thread-safe list that copies itself on every write. Ideal for data that's read often and changed rarely." },
    { id: "j-load-factor", domain: "d2", kind: "concept", term: "Load factor", definition: "How full a hash table may get before it resizes. The default is 0.75, meaning three quarters full." },
    { id: "j-treeify", domain: "d2", kind: "concept", term: "Treeified bin", definition: "Since Java 8, a HashMap bucket with more than 8 entries turns into a red-black tree to keep lookups fast." },
    { id: "j-fail-fast", domain: "d2", kind: "concept", term: "Fail-fast iterator", definition: "An iterator that throws ConcurrentModificationException if the collection changes while you're looping over it." },
    { id: "j-erasure", domain: "d2", kind: "concept", term: "Type erasure", definition: "The compiler removes generic type arguments after checking them, so they don't exist when the program runs." },
    { id: "j-pecs", domain: "d2", kind: "concept", term: "PECS", definition: "Producer Extends, Consumer Super: use ? extends for things you read from and ? super for things you write to." },
  ],

  challenges: [
    {
      id: "ch-java-resize",
      domain: "d2",
      lesson: "d2-hashmap",
      title: "Trigger a resize",
      goal: "Put keys in until the table doubles its bucket count.",
      hint: "This table has 4 buckets and a load factor of 0.75. How many entries is more than 4 × 0.75?",
      takeaway: "HashMap resizes when its size goes past capacity × load factor. It doubles the table and moves every entry. Size big maps up front so you don't pay that again and again.",
      render: (onSolved) => <HashMapLab goal="resize" onSolved={onSolved} />,
    },
    {
      id: "ch-java-chain",
      domain: "d2",
      lesson: "d2-hashmap",
      title: "Build a collision chain",
      goal: "Get 3 keys into the same bucket.",
      hint: "Turn on the bad hashCode switch, or keep adding keys and watch the colours.",
      takeaway: "A poor hashCode piles keys into one bucket, so an O(1) lookup becomes a walk along a chain. Since Java 8, big buckets become trees, which caps this at O(log n).",
      render: (onSolved) => <HashMapLab goal="chain" onSolved={onSolved} />,
    },
    {
      id: "ch-java-twins",
      domain: "d2",
      lesson: "d2-hashmap",
      title: "Find hash twins",
      goal: "Using the real String.hashCode, store two different keys that have the same hash code.",
      hint: "\"Aa\" is in the palette. The hash is 31 × first + second, and 'A' is 65, 'a' is 97, 'B' is 66.",
      takeaway: "\"Aa\" and \"BB\" both hash to 2112. Different objects can share a hash code, and equals decides which key is which. That's why the contract only works in one direction.",
      render: (onSolved) => <HashMapLab goal="twin" onSolved={onSolved} />,
    },
    {
      id: "ch-java-chooser",
      domain: "d2",
      lesson: "d2-sets-maps",
      title: "Pick the right collection",
      goal: "Choose the best collection for all 9 requirements.",
      hint: "Ask yourself: do I need order, sorting, uniqueness, lookup by key, both ends, or thread safety?",
      takeaway: "Name how the data is used first, then the collection, then its Big-O. That's how interviewers expect you to justify the choice.",
      render: (onSolved) => <CollectionChooser goal="all" onSolved={onSolved} />,
    },
  ],
});
