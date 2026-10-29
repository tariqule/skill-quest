import { defineCourse } from "@/engine/define";
import d1 from "./domains/d1-objects";
import d2 from "./domains/d2-collections";
import d3 from "./domains/d3-modern-java";
import d4 from "./domains/d4-jvm-concurrency";

/**
 * Java Interview Quest. Original questions written against the official
 * Java SE documentation; every snippet targets Java 21 LTS or later.
 */
export default defineCourse({
  id: "code-java",
  kind: "interview",
  category: "languages",
  tags: ["jvm", "oop", "collections", "streams", "concurrency", "spring"],
  provider: { id: "java", name: "Java", color: "#f89820", icon: "☕" },
  code: "JAVA",
  title: "Java Interview Quest",
  shortTitle: "Java",
  tagline: "OOP, equality, collections, streams, the JVM, and concurrency: the Java questions interviewers actually ask, with code you run in your head.",
  level: "Intermediate",
  storageKey: "course:code-java:v1",

  domains: [d1, d2, d3, d4],

  exam: {
    questions: 30,
    unscored: 0,
    minutes: 45,
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "Pick the one best answer. Many show a snippet: run it in your head before you look at the options." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "The prompt says how many to pick. You need every one right to score." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Put code lines, output lines, or steps into the right sequence." },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair each item with its answer. Every pair must be right." },
      { id: "lines", icon: "🐞", name: "Bug hunt", rule: "Tap the line(s) the prompt asks for: the bug, the line that throws, or the line that won't compile." },
    ],
  },

  guide: {
    source: {
      label: "Java interview syllabus, based on the official Java SE docs",
      version: "2026",
      date: "October 2026",
      url: "https://docs.oracle.com/en/java/javase/25/",
    },
    facts: [
      { icon: "🗺️", value: "4", label: "modules", detail: "Objects and equality, collections and generics, modern Java (exceptions, streams, records), and the JVM with concurrency." },
      { icon: "☕", value: "21+", label: "Java version", detail: "Every snippet compiles on Java 21 LTS and later. Records, sealed types, pattern matching for switch, and virtual threads are all final in 21; Java 25 is the newest LTS." },
      { icon: "🧪", value: "Code", label: "first", detail: "Java interviews lean on short snippets: predict the output, spot the bug, name the complexity, pick the collection. Expect that here too." },
      { icon: "❓", value: "Why", label: "follow-ups", detail: "A right answer usually earns a 'why?' or 'what if?'. Every explanation here gives you the reason, not just the result." },
      { icon: "🎚️", value: "4", label: "levels", detail: "Junior to staff. Senior rounds dig into HashMap internals, the memory model, and GC; staff rounds add migration, scale, and reliability decisions." },
      { icon: "🎯", value: "70", label: "to pass the mock", detail: "The full mock interview is 30 questions in 45 minutes, scored 0 to 100. Score 70 or more to pass." },
    ],
    candidate: {
      is: [
        "Preparing for a Java or JVM backend interview, from new grad to staff",
        "Comfortable writing basic Java and wants to explain why it behaves the way it does",
        "Ready to read short snippets and predict exactly what they print",
        "Wants to talk confidently about collections, concurrency, and the JVM",
      ],
      isNot: [
        "A first course in programming",
        "Framework-specific (Spring, Jakarta EE, Hibernate configuration)",
        "Android development",
        "A data structures and algorithms (LeetCode) course",
        "Deep GC tuning flags or JVM internals beyond what interviews ask",
      ],
    },
    scope: {
      label: "Topics covered",
      groups: [
        { category: "Language & OOP", icon: "🧱", services: ["Classes and inheritance", "Interfaces and default methods", "Abstract classes", "Polymorphism and overloading", "Encapsulation"] },
        { category: "Equality & strings", icon: "⚖️", services: ["== vs equals", "equals/hashCode contract", "Autoboxing and the Integer cache", "String pool and immutability", "StringBuilder"] },
        { category: "Collections & generics", icon: "🗃️", services: ["ArrayList, LinkedList, ArrayDeque", "HashMap, LinkedHashMap, TreeMap", "HashSet, TreeSet, PriorityQueue", "HashMap internals", "ConcurrentHashMap", "Generics, wildcards, type erasure"] },
        { category: "Modern Java", icon: "🌊", services: ["Checked vs unchecked exceptions", "try-with-resources", "Lambdas and functional interfaces", "Streams and collectors", "Optional", "Records, sealed types, pattern matching"] },
        { category: "JVM", icon: "⚙️", services: ["Heap vs stack", "Garbage collection basics", "Class loading and initialization"] },
        { category: "Concurrency", icon: "🧵", services: ["Threads and race conditions", "synchronized and volatile", "Atomic classes", "ExecutorService", "CompletableFuture", "Virtual threads", "Immutability"] },
      ],
    },
    tips: [
      { icon: "🧠", tip: "For predict-the-output questions, trace line by line and write down every variable's value. Most traps hide in one line: an ignored return value, a boxed ==, a lazy stream." },
      { icon: "📏", tip: "Whenever you name a collection, add its Big-O and the reason: 'TreeMap, because I need floorKey in O(log n).'" },
      { icon: "🔁", tip: "Override equals? Say hashCode in the same sentence. Shared mutable state? Say how you'll guard it. Interviewers listen for these reflexes." },
      { icon: "🧩", tip: "Prefer modern answers when they fit: records for value types, switch with patterns over instanceof chains, virtual threads for blocking I/O." },
      { icon: "🗣️", tip: "Think out loud. A wrong guess with clear reasoning often scores better than a silent right answer." },
      { icon: "⚖️", tip: "For senior and staff questions, name the trade-off before the answer: what it costs, what it buys, and when you'd choose differently." },
    ],
    officialPractice: { label: "dev.java: Learn Java (official tutorials)", url: "https://dev.java/learn/" },
  },

  cheatsheet: [
    {
      title: "Equality & strings",
      items: [
        ["`==`", "Same value for primitives; same object for references"],
        ["`equals` + `hashCode`", "Override together; equal objects must have equal hashes"],
        ["Integer cache", "`Integer.valueOf` reuses -128..127, so `==` breaks from 128"],
        ["Unboxing null", "`int n = map.get(k)` throws NPE when k is missing"],
        ["String pool", "Literals and constants are interned; `new String` is a new object"],
        ["Concatenation", "`+=` in a loop is O(n²); use StringBuilder"],
      ],
    },
    {
      title: "Collections Big-O",
      items: [
        ["ArrayList", "get O(1) · append amortized O(1) · insert/remove middle O(n)"],
        ["LinkedList", "ends O(1) · get(i) O(n)"],
        ["ArrayDeque", "push/pop/offer/poll O(1) amortized · use for stacks and queues"],
        ["HashMap / HashSet", "get/put/contains O(1) average · no order"],
        ["TreeMap / TreeSet", "O(log n) · sorted · floor/ceiling/range"],
        ["PriorityQueue", "offer/poll O(log n) · peek O(1)"],
      ],
    },
    {
      title: "HashMap internals",
      items: [
        ["Defaults", "16 buckets, load factor 0.75, first resize on the 13th entry"],
        ["Bucket index", "`(h ^ (h >>> 16)) & (n - 1)`; n is a power of two"],
        ["Collisions", "Chain per bucket; past 8 entries (table ≥ 64) it becomes a red-black tree"],
        ["Nulls", "HashMap: one null key, null values · ConcurrentHashMap: no nulls"],
        ["Keys", "Must not change while in the map"],
      ],
    },
    {
      title: "Modern Java",
      items: [
        ["Checked vs unchecked", "Exception (must handle) vs RuntimeException/Error"],
        ["try-with-resources", "AutoCloseable · closes in reverse order · suppressed exceptions"],
        ["Streams", "Lazy until a terminal op · single use · short-circuit with findFirst/limit"],
        ["Optional", "Return type only · ofNullable · orElseGet for expensive fallbacks"],
        ["record", "Final, final fields, generated equals/hashCode/toString"],
        ["sealed + switch", "Exhaustive pattern switch with no default (Java 21)"],
      ],
    },
    {
      title: "JVM & concurrency",
      items: [
        ["Stack vs heap", "Locals per thread on the stack · objects on the shared heap"],
        ["GC", "Frees what's unreachable from roots · G1 is generational"],
        ["synchronized", "Mutual exclusion + visibility"],
        ["volatile", "Visibility + ordering, not atomicity"],
        ["Atomics", "CAS-based read-modify-write: AtomicInteger, LongAdder"],
        ["Virtual threads", "Cheap, for blocking I/O · don't pool · bound scarce resources"],
        ["Immutability", "final fields, no setters, defensive copies → thread-safe for free"],
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

  boss: { name: "The NullPointer Kraken", emoji: "🦑" },
  matchLabel: "Java APIs and collections",
  levelTitles: [
    "Hello Worlder",
    "Semicolon Squire",
    "Object Crafter",
    "Bean Brewer",
    "Collection Keeper",
    "Generic Genie",
    "Stream Surfer",
    "Lambda Lancer",
    "Thread Tamer",
    "JVM Wizard",
  ],
});
