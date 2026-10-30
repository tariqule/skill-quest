import { defineCourse, withQuestions } from "@/engine/define";
import { codingChallenges } from "./coding";
import d1 from "./domains/d1-objects";
import d2 from "./domains/d2-collections";
import d3 from "./domains/d3-modern-java";
import d4 from "./domains/d4-jvm-concurrency";
import { codeGames } from "./games";
import { moreQuestions } from "./more";

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
  tagline: "The Java questions interviewers really ask, about objects, equality, collections, streams, the JVM and threads. Start from your first line of Java if you need to.",
  level: "Intermediate",
  storageKey: "course:code-java:v1",

  coding: codingChallenges,
  domains: withQuestions([d1, d2, d3, d4], [...moreQuestions, ...codeGames]),

  exam: {
    questions: 30,
    unscored: 0,
    minutes: 45,
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "Pick the one best answer. Many show some code, so run it in your head before you look at the options." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "The question tells you how many to pick. You need every one right to score." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Put the code lines, output lines or steps in the right order." },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair each item with its answer. Every pair has to be right." },
      { id: "lines", icon: "🐞", name: "Bug hunt", rule: "Tap the line or lines the question asks for: the bug, the line that throws, or the line that won't compile." },
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
      { icon: "🗺️", value: "4", label: "modules", detail: "Objects and equality, collections and generics, modern Java (exceptions, streams, records), and the JVM with threads." },
      { icon: "☕", value: "21+", label: "Java version", detail: "Every example compiles on Java 21 LTS and later. Records, sealed types, pattern matching for switch and virtual threads are all finished features in 21. Java 25 is the newest LTS." },
      { icon: "🧪", value: "Code", label: "first", detail: "Java interviews lean on short bits of code: say what it prints, spot the bug, say how fast it is, pick the collection. You'll get the same here." },
      { icon: "❓", value: "Why", label: "follow-ups", detail: "A right answer usually earns a \"why?\" or \"what if?\". Every explanation here gives you the reason, not just the result." },
      { icon: "🎚️", value: "5", label: "levels", detail: "From a gentle Start here level up to staff. Senior rounds dig into HashMap internals, the memory model and GC. Staff rounds add decisions about migrations, scale and reliability." },
      { icon: "🎯", value: "70", label: "to pass the mock", detail: "The full mock interview is 30 questions in 45 minutes, scored out of 100. Score 70 or more to pass." },
    ],
    candidate: {
      is: [
        "Getting ready for a Java or JVM backend interview, from new grad to staff",
        "New to Java and wanting a gentle start, or already writing it and wanting to explain why it behaves the way it does",
        "Happy to read short bits of code and work out exactly what they print",
        "Wanting to talk confidently about collections, threads and the JVM",
      ],
      isNot: [
        "A full programming course (the Start here lessons cover only the basics you need)",
        "About a framework such as Spring, Jakarta EE or Hibernate",
        "About Android development",
        "A data structures and algorithms (LeetCode) course",
        "About detailed GC tuning flags or JVM internals beyond what interviews ask",
      ],
    },
    scope: {
      label: "Topics covered",
      groups: [
        { category: "Language & OOP", icon: "🧱", services: ["Classes and inheritance", "Interfaces and default methods", "Abstract classes", "Polymorphism and overloading", "Encapsulation"] },
        { category: "Equality & strings", icon: "⚖️", services: ["== and equals", "equals/hashCode contract", "Autoboxing and the Integer cache", "String pool and immutability", "StringBuilder"] },
        { category: "Collections & generics", icon: "🗃️", services: ["ArrayList, LinkedList, ArrayDeque", "HashMap, LinkedHashMap, TreeMap", "HashSet, TreeSet, PriorityQueue", "HashMap internals", "ConcurrentHashMap", "Generics, wildcards, type erasure"] },
        { category: "Modern Java", icon: "🌊", services: ["Checked and unchecked exceptions", "try-with-resources", "Lambdas and functional interfaces", "Streams and collectors", "Optional", "Records, sealed types, pattern matching"] },
        { category: "JVM", icon: "⚙️", services: ["Heap and stack", "Garbage collection basics", "Class loading and initialization"] },
        { category: "Concurrency", icon: "🧵", services: ["Threads and race conditions", "synchronized and volatile", "Atomic classes", "ExecutorService", "CompletableFuture", "Virtual threads", "Immutability"] },
      ],
    },
    tips: [
      { icon: "🧠", tip: "For \"what does this print?\" questions, go line by line and write down every variable's value. Most traps hide in one line: an ignored return value, == on boxed numbers, or a lazy stream." },
      { icon: "📏", tip: "Whenever you name a collection, add its Big-O and your reason. For example: \"TreeMap, because I need floorKey in O(log n).\"" },
      { icon: "🔁", tip: "Overriding equals? Say hashCode in the same sentence. Shared data that changes? Say how you'll protect it. Interviewers listen for these habits." },
      { icon: "🧩", tip: "Give modern answers when they fit: records for value types, switch with patterns instead of instanceof chains, and virtual threads for blocking I/O." },
      { icon: "🗣️", tip: "Think out loud. A wrong guess with clear reasoning often scores better than a right answer given in silence." },
      { icon: "⚖️", tip: "For senior and staff questions, name the trade-off before the answer: what it costs, what you get for it, and when you'd choose differently." },
    ],
    officialPractice: { label: "dev.java: Learn Java (official tutorials)", url: "https://dev.java/learn/" },
  },

  cheatsheet: [
    {
      title: "Equality & strings",
      items: [
        ["`==`", "Same value for primitives; same object for references"],
        ["`equals` + `hashCode`", "Override together; equal objects must have equal hashes"],
        ["Integer cache", "`Integer.valueOf` reuses -128 to 127, so `==` breaks from 128 up"],
        ["Unboxing null", "`int n = map.get(k)` throws NPE when k is missing"],
        ["String pool", "Literals and constants are shared; `new String` makes a new object"],
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
        ["Checked and unchecked", "Exception must be handled; RuntimeException and Error don't have to be"],
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
        ["Stack and heap", "Locals on each thread's stack · objects on the shared heap"],
        ["GC", "Frees what's unreachable from roots · G1 is generational"],
        ["synchronized", "Mutual exclusion + visibility"],
        ["volatile", "Visibility + ordering, not atomicity"],
        ["Atomics", "CAS-based read-modify-write: AtomicInteger, LongAdder"],
        ["Virtual threads", "Cheap, for blocking I/O · don't pool · bound scarce resources"],
        ["Immutability", "final fields, no setters, defensive copies, and you get thread safety for free"],
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
