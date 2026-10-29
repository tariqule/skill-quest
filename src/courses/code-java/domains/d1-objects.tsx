import { CodeBlock, CodeCompare, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { java } from "../java";
import { IntegerCacheLab, StringPool } from "../visuals";

/** Module 1: OOP, equality, strings, and wrappers. */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "Objects, Equality & Strings",
    world: "The Object Forge",
    weight: 25,
    emoji: "🧱",
    color: "#f89820",
    summary: "The four OOP pillars, interfaces vs abstract classes, == vs equals, the hashCode contract, wrappers and autoboxing, and how Strings really work.",
  },

  tasks: [
    {
      id: "1.1",
      title: "Model with classes, interfaces, and inheritance",
      covers: [
        "Encapsulation, inheritance, polymorphism, abstraction",
        "Overriding (runtime) vs overloading (compile time); field hiding",
        "Interfaces with default and static methods vs abstract classes",
      ],
    },
    {
      id: "1.2",
      title: "Compare objects correctly",
      covers: ["== vs equals", "The equals/hashCode contract", "Primitives vs wrappers, autoboxing, the Integer cache, unboxing null"],
    },
    {
      id: "1.3",
      title: "Use Strings efficiently",
      covers: ["String immutability and the string pool", "intern() and compile-time constants", "StringBuilder and the cost of concatenation in loops"],
    },
  ],

  lessons: [
    {
      id: "d1-oop",
      level: "junior",
      task: "1.1",
      title: "The four pillars, in code",
      check: ["d1-01", "d1-03"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="java"
            caption="The variable's type is Animal, but the object is a Dog. Overridden methods follow the object."
            code={java`
              class Animal {
                private final String name;          // encapsulation: hidden state
                Animal(String name) { this.name = name; }
                String speak() { return name + " makes a sound"; }
              }

              class Dog extends Animal {             // inheritance
                Dog() { super("Rex"); }
                @Override String speak() { return "Woof"; }
              }

              Animal a = new Dog();
              a.speak();                             // "Woof": polymorphism
            `}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🔒", title: "Encapsulation", text: "Private fields, public methods that guard the invariants.", color: "#f89820" },
              { icon: "🧬", title: "Inheritance", text: "extends one class, implements many interfaces.", color: "#38bdf8" },
              { icon: "🎭", title: "Polymorphism", text: "One call, many behaviours: the object's real class picks the method at runtime.", color: "#a78bfa" },
              { icon: "🧩", title: "Abstraction", text: "Code against an interface or abstract type, not the details.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "Overriding is resolved at runtime from the object's class (dynamic dispatch). Overloading is resolved at compile time from the declared argument types.",
        "Fields and static methods are not polymorphic: they are hidden, and the declared type decides which one you get.",
        "An override may return a subtype (covariant return) but may not reduce visibility or throw broader checked exceptions.",
        "Returning an internal mutable collection from a getter breaks encapsulation: return a copy or an unmodifiable view.",
      ],
      tip: "When asked to 'explain polymorphism', write two lines: `Animal a = new Dog(); a.speak();` and say which method runs and why. Concrete beats definitions.",
    },
    {
      id: "d1-abstract",
      level: "junior",
      task: "1.1",
      title: "Interfaces vs abstract classes",
      check: ["d1-06", "d1-07"],
      visual: (
        <div className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <CodeBlock
              lang="java"
              caption="Interface: a capability many unrelated classes can have."
              code={java`
                interface Chargeable {
                  int capacity();                 // abstract
                  default String label() {        // shared behaviour
                    return capacity() + " mAh";
                  }
                  static Chargeable of(int c) { return () -> c; }
                }
              `}
            />
            <CodeBlock
              lang="java"
              caption="Abstract class: shared state and constructor logic."
              code={java`
                abstract class Entity {
                  protected final String id;      // state
                  private final Instant created = Instant.now();
                  protected Entity(String id) { this.id = id; }
                  abstract void validate();
                  Instant created() { return created; }
                }
              `}
            />
          </div>
          <Tiles
            cols={2}
            tiles={[
              { icon: "🔌", title: "Interface", text: "No instance state, no constructor. A class can implement many. Default, static, and private methods allowed.", color: "#38bdf8" },
              { icon: "🏛️", title: "Abstract class", text: "Fields, constructors, any visibility. A class can extend only one.", color: "#f89820" },
            ]}
          />
        </div>
      ),
      points: [
        "Default methods (Java 8) let you add methods to a published interface without breaking existing implementations.",
        "If two interfaces give the same default method, the class must override it (it can call `A.super.hi()`).",
        "Prefer interfaces for types; use an abstract class when subclasses genuinely share state or construction.",
        "An interface with exactly one abstract method is a functional interface: a lambda can implement it.",
      ],
      tip: "The modern answer is 'interface by default, abstract class when you need shared state'. Mention default methods to show you know post-Java-8 interfaces.",
    },
    {
      id: "d1-equality",
      level: "intermediate",
      task: "1.2",
      title: "== vs equals, hashCode, and the Integer cache",
      check: ["d1-10", "d1-12"],
      visual: (
        <div className="grid gap-6">
          <CodeCompare
            lang="java"
            left={{
              title: "Bug: equals without hashCode",
              code: java`
                class Point {
                  final int x, y;
                  Point(int x, int y) { this.x = x; this.y = y; }
                  @Override public boolean equals(Object o) {
                    return o instanceof Point p && p.x == x && p.y == y;
                  }
                }
                // new HashSet<>(List.of(new Point(1, 2)))
                //     .contains(new Point(1, 2))  → usually false
              `,
            }}
            right={{
              title: "Fix: override both (or use a record)",
              code: java`
                @Override public boolean equals(Object o) {
                  return o instanceof Point p && p.x == x && p.y == y;
                }
                @Override public int hashCode() {
                  return Objects.hash(x, y);
                }
                // or simply:
                record Point(int x, int y) { }
              `,
            }}
          />
          <IntegerCacheLab />
        </div>
      ),
      points: [
        "`==` compares values for primitives and references for objects. `equals` compares meaning, if the class overrides it.",
        "Contract: equal objects must have equal hash codes. Unequal objects may share a hash code (a collision).",
        "`equals` must be reflexive, symmetric, transitive, consistent, and return false for null.",
        "Autoboxing uses `Integer.valueOf`, which caches -128 to 127. That's why `==` on boxed numbers 'works' in small tests and fails later.",
        "Unboxing a null wrapper throws `NullPointerException`, e.g. `int n = map.get(key)` when the key is missing.",
      ],
      tip: "If you override equals, say 'and hashCode' in the same breath. Interviewers listen for it.",
    },
    {
      id: "d1-strings",
      level: "junior",
      task: "1.3",
      title: "Strings: immutable, pooled, and built with StringBuilder",
      check: ["d1-09", "d1-14"],
      visual: (
        <div className="grid gap-6">
          <StringPool />
          <CodeCompare
            lang="java"
            left={{
              title: "O(n²): copies the whole string each time",
              code: java`
                String s = "";
                for (int i = 0; i < n; i++) {
                  s += "x";
                }
              `,
            }}
            right={{
              title: "O(n): one growing buffer",
              code: java`
                StringBuilder sb = new StringBuilder(n);
                for (int i = 0; i < n; i++) {
                  sb.append('x');
                }
                String s = sb.toString();
              `,
            }}
          />
        </div>
      ),
      points: [
        "Strings never change. `concat`, `toUpperCase`, `trim` return new strings; ignoring the result does nothing.",
        "String literals (and compile-time constants) are interned in the pool, so equal literals share one object.",
        "`new String(\"x\")` and strings built at runtime are separate objects: compare with `equals`, never `==`.",
        "Immutability makes strings safe as map keys, safe to share between threads, and lets them cache their hash code.",
        "`StringBuilder` is the unsynchronized, faster choice; `StringBuffer` is its legacy synchronized twin.",
      ],
      tip: "A classic follow-up: 'how many objects does `new String(\"hi\")` create?' Say: the literal in the pool (if not already there) plus one new heap object.",
    },
  ],

  questions: [
    {
      id: "d1-01",
      domain: "d1",
      level: "junior",
      lesson: "d1-oop",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        class Animal {
          String speak() { return "..."; }
        }
        class Dog extends Animal {
          @Override String speak() { return "Woof"; }
        }

        Animal a = new Dog();
        System.out.println(a.speak());
      `,
      options: ["`Woof`", "`...`", "Compile error: `Animal` has no `Dog` methods", "`ClassCastException`"],
      answer: [0],
      explanation: "Overridden methods are chosen at runtime from the object's actual class (dynamic dispatch). The object is a `Dog`, so `Dog.speak()` runs even though the variable is typed `Animal`.",
    },
    {
      id: "d1-02",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-oop",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        static String describe(Object o) { return "object"; }
        static String describe(String s) { return "string"; }

        Object x = "hello";
        System.out.println(describe(x));
      `,
      options: ["`object`", "`string`", "Compile error: ambiguous call", "`hello`"],
      answer: [0],
      explanation: "Overloads are picked at compile time from the declared (static) type of the argument. `x` is declared `Object`, so `describe(Object)` is chosen, even though it holds a String at runtime. Only overriding is dynamic.",
    },
    {
      id: "d1-03",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-oop",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        class A {
          String name = "A";
          String who() { return "A"; }
        }
        class B extends A {
          String name = "B";
          @Override String who() { return "B"; }
        }

        A obj = new B();
        System.out.println(obj.name + obj.who());
      `,
      options: ["`AB`", "`BB`", "`AA`", "`BA`"],
      answer: [0],
      explanation: "Fields are not polymorphic: `B.name` hides `A.name`, and the declared type `A` decides which field `obj.name` reads, so it's \"A\". The method `who()` is overridden, so the object's class decides: \"B\".",
    },
    {
      id: "d1-04",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-oop",
      type: "lines",
      prompt: "`Team` promises that every member name is non-blank. Tap the line that lets callers break that promise.",
      codeLang: "java",
      code: java`
        public final class Team {
          private final List<String> members = new ArrayList<>();

          public void add(String name) {
            if (name == null || name.isBlank()) throw new IllegalArgumentException();
            members.add(name);
          }

          public List<String> getMembers() {
            return members;
          }
        }
      `,
      answer: [10],
      explanation: "Returning the internal list hands out a live, mutable reference: `team.getMembers().add(\"\")` skips the validation in `add`. Return `List.copyOf(members)` or `Collections.unmodifiableList(members)`. `final` on the field only stops reassignment, not mutation.",
    },
    {
      id: "d1-05",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-oop",
      prompt: "Which statement about overriding in Java is true?",
      options: [
        "An overriding method may return a subtype of the original return type.",
        "An overriding method may make a `public` method `protected`.",
        "A `static` method in a subclass overrides the parent's static method, so calls dispatch at runtime.",
        "An overriding method may declare new, broader checked exceptions.",
      ],
      answer: [0],
      explanation: "Covariant return types are allowed (e.g. `Dog clone()` overriding `Animal clone()`). Overrides can't reduce visibility or widen checked exceptions, and static methods are hidden, not overridden: the declared type picks them at compile time.",
    },
    {
      id: "d1-06",
      domain: "d1",
      level: "junior",
      lesson: "d1-abstract",
      prompt: "Which two can an abstract class have that an interface cannot? (Choose two.)",
      options: ["Instance fields (per-object state)", "A constructor", "Default methods", "Static methods", "Private methods"],
      answer: [0, 1],
      explanation: "Interfaces can't hold per-object state or define constructors. Since Java 8 they can have default and static methods, and since Java 9 private methods, so those don't distinguish them.",
    },
    {
      id: "d1-07",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-abstract",
      prompt: "What happens when you compile this?",
      codeLang: "java",
      code: java`
        interface A { default String hi() { return "A"; } }
        interface B { default String hi() { return "B"; } }

        class C implements A, B { }
      `,
      options: [
        "Compile error: `C` must override `hi()` to resolve the conflict",
        "It compiles; `new C().hi()` returns \"A\" because A is listed first",
        "It compiles; `new C().hi()` returns \"B\" because B is listed last",
        "It compiles, but calling `hi()` throws at runtime",
      ],
      answer: [0],
      explanation: "Two unrelated defaults with the same signature clash, and Java refuses to guess. `C` must override `hi()`; it can delegate with `A.super.hi()` or `B.super.hi()`.",
    },
    {
      id: "d1-08",
      domain: "d1",
      level: "junior",
      lesson: "d1-abstract",
      prompt: "When is an abstract class a better fit than an interface?",
      options: [
        "When subclasses share state and constructor logic, such as a base entity holding an id and a creation time",
        "When unrelated classes like `Car` and `Phone` both need a `charge()` capability",
        "When a class needs to inherit behaviour from several types at once",
        "When you want callers to implement the type with a lambda",
      ],
      answer: [0],
      explanation: "Shared fields and constructors are the abstract class's strength. Cross-cutting capabilities, multiple inheritance of type, and lambda targets (functional interfaces) are all interface jobs.",
    },
    {
      id: "d1-09",
      domain: "d1",
      level: "junior",
      lesson: "d1-strings",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        String a = "java";
        String b = "java";
        String c = new String("java");
        System.out.println((a == b) + " " + (a == c) + " " + a.equals(c));
      `,
      options: ["`true false true`", "`true true true`", "`false false true`", "`true false false`"],
      answer: [0],
      explanation: "Identical literals share one pooled object, so `a == b`. `new String` always creates a separate object, so `a == c` is false. `equals` compares characters: true.",
    },
    {
      id: "d1-10",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-equality",
      prompt: "What does this print with default JVM settings?",
      codeLang: "java",
      code: java`
        Integer a = 127, b = 127;
        Integer c = 128, d = 128;
        System.out.println((a == b) + " " + (c == d));
      `,
      options: ["`true false`", "`true true`", "`false false`", "`false true`"],
      answer: [0],
      explanation: "Autoboxing calls `Integer.valueOf`, which returns cached objects for -128 to 127. 127 boxes to the same object; 128 creates two different objects, so `==` (reference comparison) is false. Always compare wrappers with `equals`.",
    },
    {
      id: "d1-11",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-equality",
      type: "lines",
      prompt: "`new HashSet<>(List.of(new Point(1, 2))).contains(new Point(1, 2))` returns false. Tap the line that causes it.",
      codeLang: "java",
      code: java`
        class Point {
          final int x, y;
          Point(int x, int y) { this.x = x; this.y = y; }

          @Override public boolean equals(Object o) {
            return o instanceof Point p && p.x == x && p.y == y;
          }

          @Override public int hashCode() {
            return System.identityHashCode(this);
          }
        }
      `,
      answer: [10],
      explanation: "Two equal points get different identity hash codes, so the set looks in the wrong bucket and never even calls `equals`. Equal objects must have equal hash codes: use `Objects.hash(x, y)` (or make `Point` a record).",
    },
    {
      id: "d1-12",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-equality",
      prompt: "Which two statements are required by the `equals`/`hashCode` contract? (Choose two.)",
      options: [
        "If `a.equals(b)` is true, then `a.hashCode() == b.hashCode()` must be true.",
        "`a.equals(null)` must return false, not throw.",
        "If `a.hashCode() == b.hashCode()`, then `a.equals(b)` must be true.",
        "`hashCode()` must return a different value for every distinct object.",
        "`equals` must compare every field of the class.",
      ],
      answer: [0, 1],
      explanation: "Equal objects need equal hashes, and `equals(null)` is false. The reverse isn't required: different objects may collide on a hash. You choose which fields define equality, as long as equals and hashCode use the same ones.",
    },
    {
      id: "d1-13",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-equality",
      prompt: "What happens when this runs?",
      codeLang: "java",
      code: java`
        Map<String, Integer> stock = new HashMap<>();
        int count = stock.get("apples");
        System.out.println(count);
      `,
      options: ["`NullPointerException` on line 2", "Prints `0`", "Prints `null`", "Compile error: `Integer` can't be assigned to `int`"],
      answer: [0],
      explanation: "`get` returns null for a missing key, and assigning it to an `int` auto-unboxes with `intValue()`, which throws NPE. Use `stock.getOrDefault(\"apples\", 0)`.",
    },
    {
      id: "d1-14",
      domain: "d1",
      level: "junior",
      lesson: "d1-strings",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        String s = "hi";
        s.concat(" there");
        s.toUpperCase();
        StringBuilder sb = new StringBuilder("hi");
        sb.append(" there");
        System.out.println(s + " | " + sb);
      `,
      options: ["`hi | hi there`", "`HI THERE | hi there`", "`hi there | hi there`", "`hi | hi`"],
      answer: [0],
      explanation: "Strings are immutable: `concat` and `toUpperCase` return new strings that are thrown away, so `s` is still \"hi\". `StringBuilder` is mutable, so `append` changes it in place.",
    },
    {
      id: "d1-15",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-strings",
      prompt: "How does the running time of this loop grow with `n`?",
      codeLang: "java",
      code: java`
        String result = "";
        for (int i = 0; i < n; i++) {
          result += "x";
        }
      `,
      options: ["O(n²)", "O(n)", "O(n log n)", "O(1)"],
      answer: [0],
      explanation: "Each `+=` builds a brand-new string and copies every existing character: 1 + 2 + … + n copies, which is O(n²). A `StringBuilder` appends into one growing buffer for O(n) total (amortized).",
    },
    {
      id: "d1-16",
      domain: "d1",
      level: "junior",
      lesson: "d1-strings",
      type: "order",
      prompt: "Arrange the body of `join(List<String> words)` so `join(List.of(\"a\", \"b\", \"c\"))` returns `\"a,b,c\"`.",
      items: ["`StringBuilder sb = new StringBuilder();`", "`for (String w : words) {`", "`if (sb.length() > 0) sb.append(',');`", "`sb.append(w);`", "`}`", "`return sb.toString();`"],
      explanation: "Add the separator before each word except the first (the buffer is empty then), then append the word. Appending the word first would leave a trailing comma. In real code, `String.join(\",\", words)` does this for you.",
    },
    {
      id: "d1-17",
      domain: "d1",
      level: "junior",
      lesson: "d1-oop",
      type: "match",
      prompt: "Match each snippet to the OOP pillar it shows.",
      pairs: [
        ["`private` fields with validating public methods", "Encapsulation"],
        ["`class Dog extends Animal`", "Inheritance"],
        ["`Animal a = new Dog(); a.speak()` runs Dog's version", "Polymorphism"],
        ["`interface Shape { double area(); }`", "Abstraction"],
      ],
      explanation: "Encapsulation hides state behind methods; inheritance reuses a parent's members; polymorphism lets the runtime class pick the method; abstraction exposes what a type does, not how.",
    },
    {
      id: "d1-18",
      domain: "d1",
      level: "junior",
      lesson: "d1-strings",
      prompt: "Why is `String` immutable in Java?",
      options: [
        "So strings can be shared from the pool, used safely as hash keys, and passed between threads without copying",
        "Because the JVM stores all strings on the thread stack",
        "So that `==` always works for comparing strings",
        "Because Java has no mutable character sequences",
      ],
      answer: [0],
      explanation: "Immutability makes pooling safe (nobody can change a shared literal), lets a String cache its hash code, keeps map keys stable, and makes strings thread-safe for free. `==` still compares references, and `StringBuilder` is the mutable option.",
    },
    {
      id: "d1-19",
      domain: "d1",
      level: "senior",
      lesson: "d1-strings",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        String a = "ja";
        String b = a + "va";
        String c = "java";
        System.out.println((b == c) + " " + (b.intern() == c));
      `,
      options: ["`false true`", "`true true`", "`false false`", "`true false`"],
      answer: [0],
      explanation: "`a` isn't a compile-time constant, so `a + \"va\"` is computed at runtime into a new String: `b == c` is false. `intern()` returns the pooled \"java\", which is `c`: true. If `a` were declared `final`, the compiler would fold the concatenation and `b == c` would be true.",
    },
    {
      id: "d1-20",
      domain: "d1",
      level: "senior",
      lesson: "d1-equality",
      prompt: "What does this print (one value per line)?",
      codeLang: "java",
      code: java`
        Long big = 10L;
        System.out.println(big.equals(10));
        System.out.println(big.equals(10L));
        System.out.println(big == 10);
      `,
      options: ["`false`, `true`, `true`", "`true`, `true`, `true`", "`false`, `true`, `false`", "`true`, `true`, `false`"],
      answer: [0],
      explanation: "`big.equals(10)` boxes 10 to an `Integer`, and `Long.equals` returns false for anything that isn't a `Long`. `equals(10L)` is true. `big == 10` mixes a wrapper with a primitive, so `big` is unboxed and the values are compared: true.",
    },
    {
      id: "d1-21",
      domain: "d1",
      level: "junior",
      lesson: "d1-strings",
      type: "lines",
      prompt: "This returns false for users whose role in the database is \"admin\". Tap the buggy line.",
      codeLang: "java",
      code: java`
        static boolean isAdmin(User u) {
          String role = u.role().trim();
          if (role == "admin") {
            return true;
          }
          return false;
        }
      `,
      answer: [3],
      explanation: "A string read from a database is a different object from the pooled literal \"admin\", so `==` compares references and fails. Use `\"admin\".equals(role)` (literal first is also null-safe).",
    },
    {
      id: "d1-22",
      domain: "d1",
      level: "staff",
      lesson: "d1-equality",
      prompt: "A widely shared `Money` class has setters and is used as a key in caches across many services. Keys occasionally 'disappear' from those caches. What is the best long-term fix?",
      options: [
        "Make `Money` an immutable value type (final fields, or a record), deprecate the setters, and migrate callers to copy-with methods like `withAmount(...)`",
        "Document 'never mutate a key' on the class and rely on code review",
        "Override `hashCode()` to return a constant so lookups never miss",
        "Switch every cache to `IdentityHashMap`",
      ],
      answer: [0],
      explanation: "Mutating a key after insertion changes its hash, so the map looks in the wrong bucket. Immutability removes the whole class of bug. A constant hash makes every map O(n) (or O(log n) after treeifying); identity maps break value lookups; documentation doesn't scale across teams.",
    },
    {
      id: "d1-23",
      domain: "d1",
      level: "staff",
      lesson: "d1-abstract",
      prompt: "Your team publishes a `PaymentGateway` interface that many other teams implement. You need to add `refund(...)` without breaking any of their builds. What's the best approach?",
      options: [
        "Add `refund` as a `default` method (with a safe default or `UnsupportedOperationException`), then let teams override it on their own schedule",
        "Add `refund` as an abstract method and announce it in the release notes",
        "Convert `PaymentGateway` into an abstract class with a concrete `refund`",
        "Copy the interface into `PaymentGateway2` and ask every team to migrate",
      ],
      answer: [0],
      explanation: "Default methods exist precisely for evolving published interfaces: existing implementations keep compiling and running. A new abstract method breaks every implementor; switching to an abstract class breaks anyone who already extends another class; a parallel interface splits the ecosystem.",
    },
    {
      id: "d1-24",
      domain: "d1",
      level: "staff",
      lesson: "d1-strings",
      prompt: "A reporting service builds multi-megabyte CSV exports with `+=` inside nested loops and shows latency spikes and heavy GC. Which two changes fix the root cause? (Choose two.)",
      options: [
        "Build each export with one `StringBuilder`, pre-sized when the size is roughly known",
        "Stream rows straight to the response `Writer` instead of building one giant String in memory",
        "Call `System.gc()` after each export",
        "Call `intern()` on every row string",
        "Increase the thread stack size with `-Xss`",
      ],
      answer: [0, 1],
      explanation: "Repeated `+=` creates and copies a new String every time (O(n²) work and garbage). One builder fixes the copying; streaming avoids holding the whole export in memory at all. `System.gc()` is only a hint, interning fills the pool with one-off strings, and stack size has nothing to do with heap garbage.",
    },
    {
      id: "d1-25",
      domain: "d1",
      level: "staff",
      lesson: "d1-equality",
      prompt: "In review, a teammate compares `Integer` order ids with `==` and says 'all the tests pass'. The tests only use ids below 100. What is the best response?",
      options: [
        "Request changes: it only works because of the -128 to 127 cache. Use `equals` (or primitive `long`/`int`), and add a test with an id above 127",
        "Approve: the JVM caches every `Integer`, so `==` is safe",
        "Approve, but ask them to add `-XX:AutoBoxCacheMax` to production flags",
        "Request changes: wrap the ids in `String.valueOf` and compare with `==`",
      ],
      answer: [0],
      explanation: "The tests pass by accident: boxed values outside the cache are distinct objects, so production ids like 5000 compare false. The fix is value comparison, plus a test that would have caught it. Tuning the cache just moves the cliff, and string `==` has the same reference problem.",
    },
  ],

  cards: [
    { id: "j-objects-equals", domain: "d1", kind: "service", term: "Objects.equals(a, b)", definition: "Null-safe equality: true if both are null or a.equals(b)" },
    { id: "j-objects-hash", domain: "d1", kind: "service", term: "Objects.hash(...)", definition: "Builds a hashCode from several fields; pair it with equals" },
    { id: "j-stringbuilder", domain: "d1", kind: "service", term: "StringBuilder", definition: "Mutable, unsynchronized character buffer for building strings in loops" },
    { id: "j-intern", domain: "d1", kind: "service", term: "String.intern()", definition: "Returns the canonical copy of a string from the string pool" },
    { id: "j-valueof", domain: "d1", kind: "service", term: "Integer.valueOf(int)", definition: "Boxing factory used by autoboxing; caches -128 to 127" },
    { id: "j-string-join", domain: "d1", kind: "service", term: "String.join(delim, items)", definition: "Joins strings with a separator, no trailing delimiter" },
    { id: "j-encapsulation", domain: "d1", kind: "concept", term: "Encapsulation", definition: "Hide state behind methods that protect the object's invariants" },
    { id: "j-polymorphism", domain: "d1", kind: "concept", term: "Polymorphism", definition: "One call, many behaviours: the object's runtime class picks the overridden method" },
    { id: "j-overload-override", domain: "d1", kind: "concept", term: "Overloading vs overriding", definition: "Overloads are chosen at compile time by argument types; overrides at runtime by the object" },
    { id: "j-default-method", domain: "d1", kind: "concept", term: "Default method", definition: "Interface method with a body; lets published interfaces evolve without breaking implementors" },
    { id: "j-string-pool", domain: "d1", kind: "concept", term: "String pool", definition: "JVM table of interned strings; equal literals share one object" },
    { id: "j-autoboxing", domain: "d1", kind: "concept", term: "Autoboxing", definition: "Automatic int ↔ Integer conversion; unboxing null throws NullPointerException" },
    { id: "j-equals-contract", domain: "d1", kind: "concept", term: "equals/hashCode contract", definition: "Equal objects must have equal hash codes; equals is reflexive, symmetric, transitive" },
  ],

  challenges: [
    {
      id: "ch-java-cache-edge",
      domain: "d1",
      lesson: "d1-equality",
      title: "Find the cache cliff",
      goal: "Find the smallest positive number where `a == b` turns false.",
      hint: "Start inside the green cache range and use +1 to walk to its edge.",
      takeaway: "Integer.valueOf caches -128 to 127 by default. From 128 up, every autobox is a new object, so == compares different references.",
      render: (onSolved) => <IntegerCacheLab goal="edge" onSolved={onSolved} />,
    },
  ],
});
