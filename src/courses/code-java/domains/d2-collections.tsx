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
    summary: "List, Set, Map, and Queue implementations and their Big-O, HashMap internals, ConcurrentHashMap, and generics with type erasure.",
  },

  tasks: [
    {
      id: "2.1",
      title: "Choose List, Set, Map, and Queue implementations",
      covers: [
        "ArrayList vs LinkedList vs ArrayDeque, PriorityQueue",
        "HashSet/LinkedHashSet/TreeSet and HashMap/LinkedHashMap/TreeMap",
        "Big-O of the common operations; fail-fast iterators; immutable List.of",
      ],
    },
    {
      id: "2.2",
      title: "Explain HashMap internals and concurrent maps",
      covers: ["Buckets, hash spreading, load factor, resizing, treeified bins", "Mutable keys", "ConcurrentHashMap vs synchronized maps"],
    },
    {
      id: "2.3",
      title: "Use generics and understand type erasure",
      covers: ["Invariance, wildcards, PECS", "Type erasure and what it forbids", "Generic API design"],
    },
  ],

  lessons: [
    {
      id: "d2-lists",
      level: "junior",
      task: "2.1",
      title: "Lists and queues: pick by access pattern",
      check: ["d2-01", "d2-20"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "📚", title: "ArrayList", text: "get(i) O(1) · add at end amortized O(1) · insert/remove in the middle O(n). The default list.", color: "#38bdf8" },
              { icon: "🔗", title: "LinkedList", text: "Ends O(1) · get(i) O(n) · extra memory per node and poor cache locality. Rarely the best pick.", color: "#94a3b8" },
              { icon: "🔄", title: "ArrayDeque", text: "push/pop/offer/poll at both ends O(1). Use it as your stack and your queue.", color: "#34d399" },
              { icon: "⛰️", title: "PriorityQueue", text: "Binary heap: offer/poll O(log n), peek O(1). Iteration is not sorted.", color: "#f59e0b" },
              { icon: "🧊", title: "List.of / copyOf", text: "Unmodifiable: any add/set/remove throws UnsupportedOperationException. No nulls.", color: "#a78bfa" },
              { icon: "📏", title: "Arrays.asList", text: "Fixed-size view of an array: set works, add/remove throw.", color: "#f472b6" },
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
        "Default to `ArrayList` for lists and `ArrayDeque` for stacks and queues; the legacy `Stack` and `Vector` are synchronized and slower.",
        "Calling `get(i)` in a loop over a `LinkedList` is O(n²): iterate with for-each instead.",
        "Iterators of the standard collections are fail-fast: structurally modifying the collection mid-iteration throws `ConcurrentModificationException` (best effort).",
        "For a read-mostly list shared across threads, `CopyOnWriteArrayList` gives lock-free reads and snapshot iteration.",
      ],
      tip: "Always state the Big-O when you name a collection: 'ArrayList, because get(i) is O(1) and we mostly append.'",
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
              { icon: "#️⃣", title: "HashMap / HashSet", text: "O(1) average get/put/contains. No order guarantee. One null key allowed in HashMap.", color: "#38bdf8" },
              { icon: "🔗", title: "LinkedHashMap / Set", text: "Hash speed plus predictable order: insertion order, or access order for LRU caches.", color: "#a78bfa" },
              { icon: "🌲", title: "TreeMap / TreeSet", text: "Red-black tree: O(log n), sorted by key, with floor, ceiling, and range views.", color: "#34d399" },
            ]}
          />
          <CollectionChooser />
        </div>
      ),
      points: [
        "A `Set` is backed by a `Map`: `HashSet` uses a `HashMap`, `TreeSet` uses a `TreeMap`.",
        "Tree collections need keys that are `Comparable` or a `Comparator`, and they use it (not `equals`) to decide duplicates.",
        "`Map.merge`, `computeIfAbsent`, and `getOrDefault` replace most hand-written get-then-put code.",
        "`put` returns the previous value (or null), which tells you whether the key was already there.",
      ],
      tip: "LRU cache is a favourite: `new LinkedHashMap<>(16, 0.75f, true)` plus overriding `removeEldestEntry`. Mention it, then offer to code it.",
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
              { icon: "🔢", label: "hashCode()", sub: "Then spread: h ^ (h >>> 16)" },
              { icon: "🪣", label: "Pick bucket", sub: "index = hash & (table.length - 1)" },
              { icon: "🔍", label: "Walk the bin", sub: "Compare hash first, then equals" },
              { icon: "➕", label: "Insert / replace", sub: "Append a node or overwrite the value" },
              { icon: "📈", label: "Resize?", sub: "size > capacity × 0.75 → double and re-bucket" },
            ]}
          />
          <HashMapLab />
        </div>
      ),
      points: [
        "Defaults: 16 buckets, load factor 0.75, so the first resize happens when the 13th entry goes in. Capacity is always a power of two.",
        "Since Java 8, a bin with more than 8 entries (in a table of at least 64 buckets) turns into a red-black tree: worst case O(log n) instead of O(n).",
        "Never mutate a key after inserting it: its hash changes and the map looks in the wrong bucket.",
        "`ConcurrentHashMap` locks per bin on writes, never locks for reads, forbids null keys and values, and has weakly consistent iterators.",
        "Pre-size big maps (`HashMap.newHashMap(n)` in Java 19+) to skip repeated resizing.",
      ],
      tip: "When asked 'how does HashMap work?', walk through put in order: hash, bucket, walk, insert, resize. Then add treeification and the null-key detail.",
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
            caption="Generic types are checked at compile time, then erased: at runtime both lists are just ArrayList."
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
              { icon: "📤", title: "? extends T", text: "Producer: you read Ts out of it. You can't add (except null).", color: "#38bdf8" },
              { icon: "📥", title: "? super T", text: "Consumer: you put Ts into it. Reads come back as Object.", color: "#f59e0b" },
              { icon: "🧽", title: "Erasure", text: "No new T(), no instanceof List<String>, no generic arrays, no overloads that erase to the same signature.", color: "#f472b6" },
            ]}
          />
        </div>
      ),
      points: [
        "Generics are invariant: a `List<String>` is not a `List<Object>`. Arrays are covariant and check stores at runtime (`ArrayStoreException`).",
        "PECS: Producer Extends, Consumer Super, e.g. `Collections.copy(List<? super T> dest, List<? extends T> src)`.",
        "Type parameters are erased to their bound (usually `Object`), so the runtime can't tell `List<String>` from `List<Integer>`.",
        "Raw types (`List` with no type argument) switch off the checks; they exist only for pre-Java-5 compatibility.",
      ],
      tip: "If you're asked why `new T()` fails, answer in one sentence: 'erasure means T doesn't exist at runtime; pass a `Supplier<T>` or `Class<T>` instead.'",
    },
  ],

  questions: [
    {
      id: "d2-01",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-lists",
      prompt: "What is the time complexity of this loop?",
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
      explanation: "`LinkedList.get(i)` walks nodes from the nearer end, so each call is O(n) and the loop is O(n²). A for-each loop uses the iterator and is O(n); with an `ArrayList`, `get(i)` is O(1).",
    },
    {
      id: "d2-02",
      domain: "d2",
      level: "junior",
      lesson: "d2-lists",
      prompt: "What does `list.add(0, x)` cost on an `ArrayList` holding n elements?",
      options: ["O(n), because every element shifts one slot right", "O(1), like adding at the end", "O(log n)", "O(n²)"],
      answer: [0],
      explanation: "An `ArrayList` is a contiguous array, so inserting at the front moves all n elements. Appending at the end is amortized O(1). If you need cheap inserts at the front, use an `ArrayDeque`.",
    },
    {
      id: "d2-03",
      domain: "d2",
      level: "junior",
      lesson: "d2-lists",
      prompt: "You need a stack in new code. What do the JDK docs recommend instead of `java.util.Stack`?",
      options: ["`ArrayDeque` (through the `Deque` interface)", "`Vector`", "`Hashtable`", "`TreeSet`"],
      answer: [0],
      explanation: "The `Deque` docs recommend it over the legacy `Stack` class, and `ArrayDeque` is documented as likely faster than `Stack` as a stack and faster than `LinkedList` as a queue. `Stack` extends the synchronized `Vector`.",
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
      explanation: "Removing through the list (not the iterator) changes its modification count, so the for-each loop's iterator fails fast on its next `next()` call. Use `names.removeIf(n -> n.startsWith(\"b\"))` or `iterator.remove()`.",
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
      explanation: "A `TreeSet` keeps elements sorted by their natural order (alphabetical for strings). Insertion order would need a `LinkedHashSet`; a `HashSet` has no order guarantee.",
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
      explanation: "Sorted navigation → tree; hash speed with predictable order → linked hash; plain membership → hash set; repeated 'give me the minimum' → heap; positional access → array list.",
    },
    {
      id: "d2-07",
      domain: "d2",
      level: "junior",
      lesson: "d2-sets-maps",
      prompt: "`TreeMap` is a red-black tree. What do `get`, `put`, and `remove` cost?",
      options: ["O(log n)", "O(1) on average", "O(n)", "O(n log n)"],
      answer: [0],
      explanation: "A balanced binary search tree keeps its height at O(log n), so each operation walks one root-to-leaf path. You pay that over a HashMap's O(1) in exchange for sorted keys and navigation methods.",
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
      explanation: "`put` returns the previous value (1) and replaces it with 2. `merge` combines the existing 2 with 10 using `Integer::sum`, giving 12. There's still only one key.",
    },
    {
      id: "d2-09",
      domain: "d2",
      level: "senior",
      lesson: "d2-hashmap",
      prompt: "In Java 8 and later, what does `HashMap` do when one bucket collects many colliding keys?",
      options: [
        "Past 8 entries (in a table of at least 64 buckets), the bin's linked list becomes a red-black tree, so lookups in it are O(log n)",
        "It throws an exception once a bucket holds more than 8 keys",
        "It rehashes every key with a new random seed",
        "Nothing: the chain keeps growing and lookups stay O(n)",
      ],
      answer: [0],
      explanation: "Treeification (TREEIFY_THRESHOLD 8, MIN_TREEIFY_CAPACITY 64) caps the damage of bad hash codes or deliberate collisions. If the table is still smaller than 64 buckets, HashMap resizes instead of treeifying.",
    },
    {
      id: "d2-10",
      domain: "d2",
      level: "senior",
      lesson: "d2-hashmap",
      prompt: "A `new HashMap<>()` has the default capacity of 16 and load factor 0.75. When does it first resize?",
      options: ["When the 13th entry is added", "When the 16th entry is added", "When the 17th entry is added", "When the 8th entry is added"],
      answer: [0],
      explanation: "The threshold is 16 × 0.75 = 12. After an insert, if size exceeds the threshold the table doubles to 32 and every entry is re-bucketed, so the 13th entry triggers it.",
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
      explanation: "Spreading the high bits into the low bits matters because the mask only uses the low bits. Comparing the cached hash first avoids most `equals` calls. Resizing comes last, after the new entry is counted.",
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
      explanation: "The entry was filed under the hash of [1, 2]. Mutating the key makes it [1, 2, 3], so `equals` against [1, 2] now fails, and a lookup with the mutated key would compute a different hash and search the wrong bucket. Keys must be immutable (or never mutated while in a map).",
    },
    {
      id: "d2-13",
      domain: "d2",
      level: "senior",
      lesson: "d2-hashmap",
      prompt: "Why prefer `ConcurrentHashMap` over `Collections.synchronizedMap(new HashMap<>())` under heavy concurrent use?",
      options: [
        "Reads don't lock and writes lock only one bin, so threads rarely block each other; it also has atomic `compute` and `merge`",
        "It allows null keys and values",
        "Its iterators throw `ConcurrentModificationException` to catch races early",
        "It keeps keys in sorted order",
      ],
      answer: [0],
      explanation: "A synchronized map funnels every call through one lock. ConcurrentHashMap uses CAS and per-bin locking, so it scales. It forbids nulls (so `get` returning null is unambiguous) and its iterators are weakly consistent. For sorted concurrent keys you'd use `ConcurrentSkipListMap`.",
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
      explanation: "Single methods like `merge`, `compute`, and `putIfAbsent` are atomic, but a sequence of two calls is not: another thread can slip in between (use `putIfAbsent`/`computeIfAbsent`). Null values throw `NullPointerException`.",
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
      explanation: "Type erasure: type arguments exist only at compile time. At runtime both objects are plain `java.util.ArrayList`, so they share one `Class` object.",
    },
    {
      id: "d2-16",
      domain: "d2",
      level: "senior",
      lesson: "d2-generics",
      type: "lines",
      prompt: "Tap the line that does not compile.",
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
      explanation: "`? extends Number` could be a `List<Double>` for all the compiler knows, so adding an Integer is rejected; you can only read from it. `? super Integer` is a consumer: adding Integers is fine.",
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
        "Because generic methods can't use plain `List<T>` parameters",
      ],
      answer: [0],
      explanation: "With PECS you can copy a `List<Integer>` into a `List<Number>` or `List<Object>`. Plain `List<T>` on both sides would force identical element types because generics are invariant.",
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
      explanation: "`T` isn't known at runtime, so there's no constructor to call, and the runtime can't check `List<String>` versus `List<Integer>`. (`obj instanceof List<?>` is fine.) The other three are ordinary, valid generic code.",
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
      explanation: "Generics are invariant. If this compiled, `objects.add(42)` would put an Integer into a list of Strings. Use `List<? extends Object>` (or `List<?>`) for a read-only view.",
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
        "Both calls throw `UnsupportedOperationException`",
        "`a.set` throws; `b.set` works",
      ],
      answer: [0],
      explanation: "`Arrays.asList` is a fixed-size view over an array: `set` writes through, but `add` and `remove` throw. `List.of` is fully unmodifiable, so even `set` throws.",
    },
    {
      id: "d2-21",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-lists",
      prompt: "What do `offer`, `poll`, and `peek` cost on a `PriorityQueue` of n elements?",
      options: ["O(log n), O(log n), O(1)", "O(1), O(1), O(1)", "O(n), O(1), O(1)", "O(log n), O(n), O(log n)"],
      answer: [0],
      explanation: "A binary heap sifts up on insert and sifts down on removal of the root, each O(log n). The minimum is always at the root, so `peek` is O(1). `contains` and `remove(Object)` are O(n).",
    },
    {
      id: "d2-22",
      domain: "d2",
      level: "staff",
      lesson: "d2-hashmap",
      prompt: "A public endpoint puts user-supplied strings into a `HashMap`. An attacker sends thousands of distinct keys that share one `hashCode`. What limits the damage on Java 8+, and what else should you do?",
      options: [
        "Long bins become red-black trees (String is Comparable), so lookups degrade to O(log n) rather than O(n); still cap request size and key count at the edge",
        "Nothing is needed: HashMap picks a random hash seed per JVM, so collisions can't be forced",
        "Switch to `Hashtable`, which is immune to collisions",
        "Switch to `IdentityHashMap`, which ignores `hashCode`",
      ],
      answer: [0],
      explanation: "String hash codes are deterministic, so collisions can be crafted (\"Aa\" and \"BB\" collide). Treeified bins blunt this hash-flooding attack; input limits stop it at the boundary. `Hashtable` chains the same way, and `IdentityHashMap` would break lookups by value.",
    },
    {
      id: "d2-23",
      domain: "d2",
      level: "staff",
      lesson: "d2-lists",
      prompt: "A list of feature flags is read and fully iterated by every request thread thousands of times a second, and changes a few times an hour. Which implementation fits best?",
      options: ["`CopyOnWriteArrayList`", "`Collections.synchronizedList(new ArrayList<>())`", "`Vector`", "`LinkedList`"],
      answer: [0],
      explanation: "Copy-on-write makes every read and iteration lock-free over an immutable snapshot, and pays for it only on the rare writes. Synchronized lists and `Vector` serialize all readers, and iterating a synchronized list still needs manual locking to avoid `ConcurrentModificationException`. `LinkedList` isn't thread-safe at all.",
    },
    {
      id: "d2-24",
      domain: "d2",
      level: "staff",
      lesson: "d2-hashmap",
      prompt: "You're building an in-memory index of about 10 million entries keyed by numeric ids. Which two choices reduce memory use and load-time cost? (Choose two.)",
      options: [
        "Pre-size the map (`HashMap.newHashMap(10_000_000)` in Java 19+) so it never resizes while loading",
        "Avoid boxing every key: use primitive `long` keys in a primitive-specialized map, or pack the data into arrays",
        "Lower the load factor to 0.1 so there are fewer collisions",
        "Use `LinkedHashMap`, which has less overhead per entry",
        "Use `TreeMap`, because it doesn't allocate a bucket table",
      ],
      answer: [0, 1],
      explanation: "Pre-sizing skips ~20 rounds of doubling and re-bucketing. Each boxed `Long` key is a separate object on top of the entry object, so primitive keys save a lot at this scale. A 0.1 load factor wastes most of the table; `LinkedHashMap` and `TreeMap` entries carry extra pointers, so both use more memory, not less.",
    },
    {
      id: "d2-25",
      domain: "d2",
      level: "staff",
      lesson: "d2-generics",
      prompt: "Your library exposes `double total(List<Number> xs)`, which only reads from `xs`. Callers with a `List<Integer>` can't use it. What's the best fix that keeps already-compiled callers working?",
      options: [
        "Change the parameter to `List<? extends Number>`: it erases to the same `List` signature, and Integer or Double lists now work",
        "Add an overload `double total(List<Integer> xs)`",
        "Change the parameter to the raw type `List`",
        "Change the parameter to `Collection<? extends Number>`",
      ],
      answer: [0],
      explanation: "A producer-only parameter should use `? extends`. Because erasure keeps the signature `total(List)`, binary compatibility is preserved. The overload doesn't compile (both erase to `total(List)`, a name clash). Raw types drop type safety. `Collection` is more flexible for source, but changes the erased signature, so old binaries would fail with `NoSuchMethodError` until recompiled.",
    },
  ],

  cards: [
    { id: "j-arraylist", domain: "d2", kind: "service", term: "ArrayList", definition: "Resizable array: O(1) get(i), amortized O(1) append, O(n) middle insert" },
    { id: "j-linkedlist", domain: "d2", kind: "service", term: "LinkedList", definition: "Doubly linked list: O(1) at the ends, O(n) get(i)" },
    { id: "j-arraydeque", domain: "d2", kind: "service", term: "ArrayDeque", definition: "Ring-buffer deque; the recommended stack and queue" },
    { id: "j-priorityqueue", domain: "d2", kind: "service", term: "PriorityQueue", definition: "Binary min-heap: O(log n) offer/poll, O(1) peek" },
    { id: "j-hashmap", domain: "d2", kind: "service", term: "HashMap", definition: "Hash table of buckets: O(1) average get/put, no ordering" },
    { id: "j-linkedhashmap", domain: "d2", kind: "service", term: "LinkedHashMap", definition: "HashMap that remembers insertion or access order; LRU caches" },
    { id: "j-treemap", domain: "d2", kind: "service", term: "TreeMap", definition: "Red-black tree map sorted by key, with floor/ceiling/range views" },
    { id: "j-hashset", domain: "d2", kind: "service", term: "HashSet", definition: "Unique elements backed by a HashMap; O(1) contains" },
    { id: "j-treeset", domain: "d2", kind: "service", term: "TreeSet", definition: "Sorted set backed by a TreeMap; O(log n) operations" },
    { id: "j-chm", domain: "d2", kind: "service", term: "ConcurrentHashMap", definition: "Thread-safe map with lock-free reads, per-bin write locks, no nulls" },
    { id: "j-cowal", domain: "d2", kind: "service", term: "CopyOnWriteArrayList", definition: "Thread-safe list that copies on every write; ideal for read-mostly data" },
    { id: "j-load-factor", domain: "d2", kind: "concept", term: "Load factor", definition: "How full a hash table may get before resizing; 0.75 by default" },
    { id: "j-treeify", domain: "d2", kind: "concept", term: "Treeified bin", definition: "A HashMap bucket past 8 entries becomes a red-black tree (Java 8+)" },
    { id: "j-fail-fast", domain: "d2", kind: "concept", term: "Fail-fast iterator", definition: "Throws ConcurrentModificationException if the collection changes mid-iteration" },
    { id: "j-erasure", domain: "d2", kind: "concept", term: "Type erasure", definition: "Generic type arguments are removed after compilation" },
    { id: "j-pecs", domain: "d2", kind: "concept", term: "PECS", definition: "Producer Extends, Consumer Super: how to choose wildcards" },
  ],

  challenges: [
    {
      id: "ch-java-resize",
      domain: "d2",
      lesson: "d2-hashmap",
      title: "Trigger a resize",
      goal: "Put keys until the table doubles its bucket count.",
      hint: "This table has 4 buckets and load factor 0.75. How many entries exceed 4 × 0.75?",
      takeaway: "HashMap resizes when size exceeds capacity × load factor, doubling the table and re-bucketing every entry. Pre-size big maps to avoid paying that repeatedly.",
      render: (onSolved) => <HashMapLab goal="resize" onSolved={onSolved} />,
    },
    {
      id: "ch-java-chain",
      domain: "d2",
      lesson: "d2-hashmap",
      title: "Build a collision chain",
      goal: "Get 3 keys into the same bucket.",
      hint: "Turn on the bad hashCode toggle, or keep adding keys and watch the colours.",
      takeaway: "A poor hashCode piles keys into one bucket, turning O(1) lookups into a linear walk (Java 8+ caps this at O(log n) by treeifying big bins).",
      render: (onSolved) => <HashMapLab goal="chain" onSolved={onSolved} />,
    },
    {
      id: "ch-java-twins",
      domain: "d2",
      lesson: "d2-hashmap",
      title: "Find hash twins",
      goal: "With the real String.hashCode, store two different keys that have the same hash code.",
      hint: "\"Aa\" is in the palette. hashCode is 31 × first + second, and 'A' is 65, 'a' is 97, 'B' is 66.",
      takeaway: "\"Aa\" and \"BB\" both hash to 2112. Different objects may share a hash code; equals decides which key is which. That's why the contract only goes one way.",
      render: (onSolved) => <HashMapLab goal="twin" onSolved={onSolved} />,
    },
    {
      id: "ch-java-chooser",
      domain: "d2",
      lesson: "d2-sets-maps",
      title: "Pick the right collection",
      goal: "Choose the best collection for all 9 requirements.",
      hint: "Ask: do I need order, sorting, uniqueness, key lookup, both ends, or thread safety?",
      takeaway: "Name the access pattern first, then the collection, then its Big-O. That's exactly how interviewers expect you to justify the choice.",
      render: (onSolved) => <CollectionChooser goal="all" onSolved={onSolved} />,
    },
  ],
});
