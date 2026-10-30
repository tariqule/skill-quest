import type { Question } from "@/engine/types";
import { java } from "./java";

/** Extra fill-in-the-blank and type-the-output questions. Snippets target Java 17+. */
export const moreQuestions: Question[] = [
  // ───────────── fill the blanks ─────────────
  {
    id: "java-fx-01", type: "fill", domain: "d1", level: "junior", lesson: "d1-abstract",
    prompt: "Fill the gap so `Circle` inherits from the abstract class `Shape`.",
    codeLang: "java",
    code: java`
      abstract class Shape {
        abstract double area();
      }
      class Circle {{1}} Shape {
        final double r;
        Circle(double r) { this.r = r; }
        @Override double area() { return Math.PI * r * r; }
      }
    `,
    blanks: [{ options: ["extends", "implements", "inherits", "super"], answer: 0 }],
    explanation: "You inherit from a class with `extends` and take on an interface with `implements`. `Shape` is an abstract class, so it's `Circle extends Shape`, and `Circle` must override `area()`.",
  },
  {
    id: "java-fx-02", type: "fill", domain: "d1", level: "intermediate", lesson: "d1-equality",
    prompt: "Fill the gap so `hashCode` honours the contract with `equals` (equal points have equal hash codes).",
    codeLang: "java",
    code: java`
      final class Point {
        final int x, y;
        Point(int x, int y) { this.x = x; this.y = y; }
        @Override public boolean equals(Object o) {
          return o instanceof Point p && p.x == x && p.y == y;
        }
        @Override public int hashCode() { return {{1}}; }
      }
    `,
    blanks: [{ options: ["Objects.hash(x, y)", "System.identityHashCode(this)", "(int) System.nanoTime()"], answer: 0 }],
    explanation: "Equal objects must return equal hash codes, so build the hash from the same fields `equals` compares. An identity hash or a clock value would differ between two equal points, which breaks `HashMap` and `HashSet`.",
  },
  {
    id: "java-fx-03", type: "fill", domain: "d1", level: "intermediate", lesson: "d1-strings",
    prompt: "Fill the gap so the split keeps the trailing empty strings: `parts.length` must be 6.",
    codeLang: "java",
    code: java`
      String s = "a,b,,c,,";
      String[] parts = s.split(",", {{1}});
      System.out.println(parts.length);
    `,
    blanks: [{ options: ["-1", "0", "1", "2"], answer: 0 }],
    explanation: "With the default limit of 0, `split` throws away empty strings at the end and returns 4 parts. A negative limit splits as many times as it can and keeps them all: `a`, `b`, empty, `c`, empty, empty.",
  },
  {
    id: "java-fx-04", type: "fill", domain: "d2", level: "junior", lesson: "d2-lists",
    prompt: "Fill the gap so the even numbers are removed from the mutable list without a manual loop.",
    codeLang: "java",
    code: java`
      List<Integer> xs = new ArrayList<>(List.of(1, 2, 3, 4));
      xs.{{1}}(x -> x % 2 == 0);
      System.out.println(xs); // [1, 3]
    `,
    blanks: [{ options: ["removeIf", "remove", "filter", "deleteIf"], answer: 0 }],
    explanation: "`Collection.removeIf(Predicate)` safely removes every item that matches. `filter` belongs to streams, and `remove` takes a position or an object, not a test.",
  },
  {
    id: "java-fx-05", type: "fill", domain: "d2", level: "intermediate", lesson: "d2-sets-maps",
    prompt: "Fill the gaps so the map counts how many times each word occurs.",
    codeLang: "java",
    code: java`
      Map<String, Integer> count = new HashMap<>();
      for (String w : words) {
        count.{{1}}(w, 1, {{2}});
      }
    `,
    blanks: [
      { options: ["merge", "put", "compute", "putIfAbsent"], answer: 0 },
      { options: ["Integer::sum", "Integer::max", "(a, b) -> 1", "Integer::compare"], answer: 0 },
    ],
    explanation: "`merge(key, 1, Integer::sum)` stores 1 for a new key. For a key that's already there, it combines the old and new values with the function, which adds them. `Integer::max` or `(a, b) -> 1` would never count past 1.",
  },
  {
    id: "java-fx-06", type: "fill", domain: "d2", level: "senior", lesson: "d2-generics",
    prompt: "Fill the gaps using PECS: `sum` only reads numbers from its list; `fill` only writes integers into its list.",
    codeLang: "java",
    code: java`
      static double sum(List<{{1}} Number> xs) {
        double total = 0;
        for (Number n : xs) total += n.doubleValue();
        return total;
      }
      static void fill(List<{{2}} Integer> out) {
        for (int i = 0; i < 3; i++) out.add(i);
      }
    `,
    blanks: [
      { options: ["? extends", "? super", "extends"], answer: 0 },
      { options: ["? super", "? extends", "super"], answer: 0 },
    ],
    explanation: "Remember PECS: Producer Extends, Consumer Super. A list you only read from is a producer, so `List<? extends Number>` accepts `List<Integer>` and `List<Double>`. A list you write `Integer`s into is a consumer, so `List<? super Integer>` accepts `List<Integer>`, `List<Number>` and `List<Object>`.",
  },
  {
    id: "java-fx-07", type: "fill", domain: "d3", level: "intermediate", lesson: "d3-streams",
    prompt: "Fill the gaps so the stream returns the sorted, unique names.",
    codeLang: "java",
    code: java`
      List<String> names = List.of("bo", "al", "cy", "al");
      List<String> out = names.stream()
          .{{1}}()
          .sorted()
          .{{2}}(Collectors.toList());
    `,
    blanks: [
      { options: ["distinct", "unique", "dedupe", "limit"], answer: 0 },
      { options: ["collect", "toList", "reduce", "map"], answer: 0 },
    ],
    explanation: "`distinct()` drops duplicates (using `equals`), `sorted()` puts the rest in order, and `collect(Collectors.toList())` is the terminal operation that gathers them. `unique` and `dedupe` don't exist, and `toList()` doesn't take a collector.",
  },
  {
    id: "java-fx-08", type: "fill", domain: "d3", level: "intermediate", lesson: "d3-exceptions",
    prompt: "Fill the gap so `Res` can be used in a try-with-resources statement.",
    codeLang: "java",
    code: java`
      class Res implements {{1}} {
        @Override public void close() { System.out.println("closed"); }
      }
      // ...
      try (Res r = new Res()) {
        System.out.println("working");
      }
    `,
    blanks: [{ options: ["AutoCloseable", "Disposable", "Runnable", "Cloneable"], answer: 0 }],
    explanation: "try-with-resources needs the resource to implement `AutoCloseable` (or `Closeable`, which extends it). Java then calls its `close()` for you, even when the body throws.",
  },
  {
    id: "java-fx-09", type: "fill", domain: "d3", level: "junior", lesson: "d3-records",
    prompt: "Fill the gap to declare an immutable data carrier with a compact constructor that validates `x`.",
    codeLang: "java",
    code: java`
      {{1}} Point(int x, int y) {
        Point {
          if (x < 0) throw new IllegalArgumentException("x < 0");
        }
      }
    `,
    blanks: [{ options: ["record", "class", "data class", "struct"], answer: 0 }],
    explanation: "A `record` lists its components in the header and writes the constructor, accessors, `equals`, `hashCode` and `toString` for you. You can check the values in a compact constructor, which has no parameter list.",
  },
  {
    id: "java-fx-10", type: "fill", domain: "d4", level: "senior", lesson: "d4-executors",
    prompt: "Fill the gaps so the task runs on a thread pool, the result is awaited, and the pool is shut down.",
    codeLang: "java",
    code: java`
      ExecutorService pool = Executors.newFixedThreadPool(4);
      Future<Integer> f = pool.{{1}}(() -> 21 * 2);
      int answer = f.{{2}}();
      pool.{{3}}();
    `,
    blanks: [
      { options: ["submit", "execute", "run", "start"], answer: 0 },
      { options: ["get", "join", "await", "result"], answer: 0 },
      { options: ["shutdown", "stop", "kill", "exit"], answer: 0 },
    ],
    explanation: "`submit` takes a `Callable` and gives you back a `Future`. `execute` takes a `Runnable` and gives back nothing. `Future.get()` waits for the result. Always call `shutdown()`, or the pool's threads keep the JVM running.",
  },
  {
    id: "java-fx-11", type: "fill", domain: "d4", level: "staff", lesson: "d4-immutability",
    prompt: "Fill the gaps so `Money` is immutable even if the caller later changes the list it passed in.",
    codeLang: "java",
    code: java`
      public final class Money {
        private final long cents;
        private final {{1}}<String> tags;
        Money(long cents, List<String> tags) {
          this.cents = cents;
          this.tags = {{2}}.copyOf(tags);
        }
      }
    `,
    blanks: [
      { options: ["List", "ArrayList", "Set", "Vector"], answer: 0 },
      { options: ["List", "Collections", "Arrays", "Objects"], answer: 0 },
    ],
    explanation: "`List.copyOf` makes an unmodifiable copy, so neither the caller (through their original list) nor anyone using `Money` can change `tags`. Storing the caller's list directly would let them change it later, and `Collections.unmodifiableList` is only a window onto that same list.",
  },
  {
    id: "java-fx-12", type: "fill", domain: "d4", level: "staff", lesson: "d4-threads",
    prompt: "Fill the gap so this double-checked-locking singleton is safe: another thread must never see a half-built object.",
    codeLang: "java",
    code: java`
      class Config {
        private static {{1}} Config instance;
        static Config get() {
          if (instance == null) {
            synchronized (Config.class) {
              if (instance == null) instance = new Config();
            }
          }
          return instance;
        }
      }
    `,
    blanks: [{ options: ["volatile", "final", "transient", "static"], answer: 0 }],
    explanation: "Without `volatile`, the reference can be published before the constructor has finished writing the fields, so another thread may see a non-null but half-built object. `volatile` adds the happens-before guarantee that prevents this. (`final` wouldn't compile, because the field is assigned later.)",
  },

  // ───────────── type the output ─────────────
  {
    id: "java-ox-01", type: "output", domain: "d1", level: "junior", lesson: "d1-equality",
    prompt: "Type the one line this prints (three words separated by spaces).",
    codeLang: "java",
    code: java`
      String a = "hi";
      String b = "hi";
      String c = new String("hi");
      System.out.println((a == b) + " " + (a == c) + " " + a.equals(c));
    `,
    answers: ["true false true"],
    explanation: "String literals are shared through the pool, so `a` and `b` are the same object. `new String(\"hi\")` always makes a different object, so `==` is false, while `equals` compares the characters and is true.",
  },
  {
    id: "java-ox-02", type: "output", domain: "d1", level: "senior", lesson: "d1-oop",
    prompt: "Type the one line this prints.",
    codeLang: "java",
    code: java`
      class A {
        String who() { return "A"; }
        static String s() { return "sA"; }
      }
      class B extends A {
        @Override String who() { return "B"; }
        static String s() { return "sB"; }
      }
      A x = new B();
      System.out.println(x.who() + x.s());
    `,
    answers: ["BsA"],
    explanation: "Instance methods are picked by the object's real type, `B`, so `who()` returns `B`. Static methods aren't overridden, only hidden, so the call is fixed at compile time by the declared type `A`, and `s()` gives `sA`.",
  },
  {
    id: "java-ox-03", type: "output", domain: "d1", level: "junior", lesson: "d1-strings",
    prompt: "Type the one line this prints.",
    codeLang: "java",
    code: java`
      String s = "abc";
      s.toUpperCase();
      s.concat("d");
      System.out.println(s + s.length());
    `,
    answers: ["abc3"],
    explanation: "Strings can't change. `toUpperCase` and `concat` return new strings, and here those results are thrown away. So `s` is still `abc`, with length 3.",
  },
  {
    id: "java-ox-04", type: "output", domain: "d1", level: "senior", lesson: "d1-equality",
    prompt: "Type the one line this prints (two words separated by a space).",
    codeLang: "java",
    code: java`
      Integer a = 127, b = 127, c = 128, d = 128;
      System.out.println((a == b) + " " + (c == d));
    `,
    answers: ["true false"],
    explanation: "Boxing uses `Integer.valueOf`, which reuses cached objects for -128 to 127. So `127` boxes to the same object both times, but `128` makes two different objects, and `==`, which compares objects, fails. Compare boxed values with `equals`.",
  },
  {
    id: "java-ox-05", type: "output", domain: "d2", level: "intermediate", lesson: "d2-lists",
    prompt: "Type the list this prints, exactly as `println` shows it.",
    codeLang: "java",
    code: java`
      List<Integer> xs = new ArrayList<>(List.of(10, 20, 30));
      xs.remove(1);
      xs.remove(Integer.valueOf(10));
      System.out.println(xs);
    `,
    answers: ["[30]"],
    explanation: "`remove(1)` with a plain `int` removes the item at position 1, which is `20`, leaving `[10, 30]`. `remove(Integer.valueOf(10))` removes the value `10` itself, leaving `[30]`.",
  },
  {
    id: "java-ox-06", type: "output", domain: "d2", level: "junior", lesson: "d2-sets-maps",
    prompt: "Type the one line this prints (a number and a word separated by a space).",
    codeLang: "java",
    code: java`
      Set<String> s = new TreeSet<>(List.of("pear", "fig", "apple", "fig"));
      System.out.println(s.size() + " " + s.iterator().next());
    `,
    answers: ["3 apple"],
    explanation: "A `TreeSet` drops the second `fig` and keeps its items sorted, so there are 3 items and the first is `apple`.",
  },
  {
    id: "java-ox-07", type: "output", domain: "d2", level: "staff", lesson: "d2-hashmap",
    prompt: "Type the one line this prints (two values separated by a space).",
    codeLang: "java",
    code: java`
      List<Integer> key = new ArrayList<>(List.of(1));
      Map<List<Integer>, String> m = new HashMap<>();
      m.put(key, "x");
      key.add(2);
      System.out.println(m.get(key) + " " + m.size());
    `,
    answers: ["null 1"],
    explanation: "A list's hash code depends on what's in it. After `key.add(2)` the hash changes, so `get` looks in a different bucket and misses, even though the entry is still in the map (size 1). Never change an object while it's being used as a key.",
  },
  {
    id: "java-ox-08", type: "output", domain: "d3", level: "senior", lesson: "d3-exceptions",
    prompt: "Type everything this program prints on its single line.",
    codeLang: "java",
    code: java`
      static int f() {
        try { return 1; } finally { System.out.print("F"); }
      }
      public static void main(String[] args) {
        System.out.println(f());
      }
    `,
    answers: ["F1"],
    explanation: "The `finally` block runs before the method actually hands back its value, so `F` is printed while `f()` is still running. Then `println` prints the returned `1` on the same line.",
  },
  {
    id: "java-ox-09", type: "output", domain: "d3", level: "junior", lesson: "d3-streams",
    prompt: "Type the number this prints.",
    codeLang: "java",
    code: java`
      int sum = Stream.of(1, 2, 3, 4, 5)
          .filter(n -> n % 2 == 1)
          .mapToInt(n -> n * n)
          .sum();
      System.out.println(sum);
    `,
    answers: ["35"],
    explanation: "The odd numbers are 1, 3 and 5. Their squares are 1, 9 and 25, which add up to 35.",
  },
  {
    id: "java-ox-10", type: "output", domain: "d3", level: "intermediate", lesson: "d3-records",
    prompt: "Type the one line this prints, including the `toString` text of the record.",
    codeLang: "java",
    code: java`
      record P(int x, int y) {}
      P a = new P(1, 2), b = new P(1, 2);
      System.out.println(a.equals(b) + " " + a);
    `,
    answers: ["true P[x=1, y=2]"],
    explanation: "A record's generated `equals` compares all components, so the two points are equal. The generated `toString` is `P[x=1, y=2]`.",
  },
  {
    id: "java-ox-11", type: "output", domain: "d4", level: "intermediate", lesson: "d4-threads",
    prompt: "Type the number this program prints.",
    codeLang: "java",
    code: java`
      public static void main(String[] args) throws Exception {
        int[] box = {0};
        Thread t = new Thread(() -> box[0] = 42);
        t.start();
        t.join();
        System.out.println(box[0]);
      }
    `,
    answers: ["42"],
    explanation: "`join()` waits for the thread to finish, and it also guarantees the main thread sees everything that thread wrote. Without `join`, the result would depend on timing, which is a race.",
  },
  {
    id: "java-ox-12", type: "output", domain: "d4", level: "staff", lesson: "d4-immutability",
    prompt: "Type the one line this prints (two numbers separated by a space).",
    codeLang: "java",
    code: java`
      List<String> a = new ArrayList<>(List.of("x"));
      List<String> view = Collections.unmodifiableList(a);
      List<String> copy = List.copyOf(a);
      a.add("y");
      System.out.println(view.size() + " " + copy.size());
    `,
    answers: ["2 1"],
    explanation: "`Collections.unmodifiableList` is a read-only window onto the same list underneath, so it shows later changes (size 2). `List.copyOf` makes a separate snapshot that can't change (size 1).",
  },
  {
    id: "java-ox-13", type: "output", domain: "d4", level: "senior", lesson: "d4-jvm",
    prompt: "Type everything this program prints on its single line.",
    codeLang: "java",
    code: java`
      static class A {
        static { System.out.print("A"); }
        static int x = 1;
      }
      static class B {
        static { System.out.print("B"); }
      }
      public static void main(String[] args) {
        new B();
        System.out.println(A.x);
      }
    `,
    answers: ["BA1"],
    explanation: "Java sets up each class only when it's first really used. `new B()` runs B's static initializer first, printing `B`. Reading `A.x` then runs A's initializer, printing `A`, and finally `println` prints `1`.",
  },
];
