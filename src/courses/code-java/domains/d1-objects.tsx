import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
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
    summary:
      "The four ideas behind object-oriented code, interfaces and abstract classes, == and equals, the hashCode rule, wrapper types and autoboxing, and how Strings really work.",
  },

  tasks: [
    {
      id: "1.1",
      title: "Model with classes, interfaces, and inheritance",
      covers: [
        "Encapsulation, inheritance, polymorphism, abstraction",
        "Overriding (decided at runtime) and overloading (decided at compile time); field hiding",
        "Interfaces with default and static methods, compared with abstract classes",
      ],
    },
    {
      id: "1.2",
      title: "Compare objects correctly",
      covers: ["== and equals", "The equals and hashCode contract", "Primitives and wrappers, autoboxing, the Integer cache, unboxing null"],
    },
    {
      id: "1.3",
      title: "Use Strings efficiently",
      covers: ["String immutability and the string pool", "intern() and compile-time constants", "StringBuilder and the cost of joining strings in a loop"],
    },
  ],

  lessons: [
    {
      id: "d1-start-hello",
      level: "beginner",
      task: "1.1",
      title: "What Java is and your first program",
      check: ["java-b1-01", "java-b1-02"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="java"
            caption="Save this as Main.java. The file name must match the class name."
            code={java`
              public class Main {
                public static void main(String[] args) {
                  System.out.println("Hello, Java!");
                }
              }
            `}
          />
          <Flow
            color="#f89820"
            steps={[
              { icon: "✍️", label: "Write Main.java", sub: "Plain text you can read" },
              { icon: "🔧", label: "javac Main.java", sub: "The compiler checks it and makes Main.class" },
              { icon: "▶️", label: "java Main", sub: "The JVM runs it and prints the output" },
            ]}
          />
        </div>
      ),
      points: [
        "**Java** is a programming language used for apps, websites, Android phones and big company systems. You write instructions, and the computer follows them in order.",
        "Java code lives inside a **class**. For now, think of the class as the box your program sits in.",
        "The program starts at the `main` method. Every line inside its curly braces `{ }` runs, top to bottom.",
        "`System.out.println(...)` prints a line of text. Each statement ends with a semicolon `;`, like a full stop at the end of a sentence.",
      ],
      tip: "Before Java runs your code, a tool called the **compiler** (`javac`) checks it. A missing semicolon or a typo is caught here, before anything runs.",
    },
    {
      id: "d1-start-variables",
      level: "beginner",
      task: "1.2",
      title: "Variables and their types",
      check: ["java-b1-03", "java-b1-04"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="java"
            code={java`
              int age = 30;             // a whole number
              double price = 4.99;      // a decimal number
              boolean done = false;     // true or false
              String name = "Ada";      // text
              System.out.println(name + " is " + age);   // Ada is 30
            `}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🔢", title: "int", text: "Whole numbers like 3 or -10", color: "#f89820" },
              { icon: "📏", title: "double", text: "Decimal numbers like 4.99", color: "#f89820" },
              { icon: "✅", title: "boolean", text: "Just true or false", color: "#f89820" },
              { icon: "🔤", title: "String", text: "Text in double quotes", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "A **variable** is a named box that holds a value. In Java you say what type of value goes in the box when you create it.",
        "`int age = 30;` makes a box called `age` that can only ever hold whole numbers, and puts 30 in it.",
        "Once a box has a type, it keeps it. Trying to put text into an `int` box is an error the compiler catches.",
        "`String` (with a capital S) holds text. You can join strings and other values with `+`, as in `\"Hi \" + name`.",
      ],
      tip: "Lowercase types like `int`, `double` and `boolean` are called **primitives**: plain values. `String` starts with a capital letter because it's a class, which you'll meet next.",
    },
    {
      id: "d1-start-objects",
      level: "beginner",
      task: "1.1",
      title: "Classes are blueprints, objects are the things",
      check: ["java-b1-05", "java-b1-06"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="java"
            code={java`
              class Dog {                  // the blueprint
                String name;               // every dog has a name
                Dog(String name) {         // the constructor runs on "new"
                  this.name = name;
                }
              }

              Dog rex = new Dog("Rex");    // one real dog
              System.out.println(rex.name);  // Rex
            `}
          />
          <Tiles
            tiles={[
              { icon: "📐", title: "Class", text: "The blueprint. It says what every Dog has and can do.", color: "#f89820" },
              { icon: "🐕", title: "Object", text: "One real Dog built from the blueprint, with its own name.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "A **class** is a blueprint, like the plan for a house. An **object** is one actual house built from that plan. You can build many from one plan.",
        "Variables inside a class, like `name`, are called **fields**. Every object gets its own copy.",
        "`new Dog(\"Rex\")` builds a new object and runs the class's **constructor**, the special method that sets up its starting values.",
        "You reach an object's fields and methods with a dot, as in `rex.name`.",
      ],
      tip: "In a constructor, `this.name` means \"the name field of the object being built\". It tells it apart from the `name` parameter passed in.",
    },
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
              { icon: "🔒", title: "Encapsulation", text: "Keep fields private and change them only through methods that check the rules.", color: "#f89820" },
              { icon: "🧬", title: "Inheritance", text: "A class extends one parent class and can implement many interfaces.", color: "#38bdf8" },
              { icon: "🎭", title: "Polymorphism", text: "One call, many behaviours: the object's real class picks the method at runtime.", color: "#a78bfa" },
              { icon: "🧩", title: "Abstraction", text: "Write code against an interface or abstract type, not the details behind it.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "**Overriding** is decided at runtime by the object's real class. **Overloading** (same name, different parameters) is decided at compile time by the declared argument types.",
        "Fields and static methods don't follow the object. A subclass field with the same name just hides the parent's, and the declared type decides which one you get.",
        "An override may return a more specific type (a covariant return). It can't make the method less visible or throw broader checked exceptions.",
        "Handing out an internal list from a getter breaks encapsulation, because callers can change it. Return a copy or a read-only view instead.",
      ],
      tip: "When asked to explain polymorphism, write two lines, `Animal a = new Dog(); a.speak();`, and say which method runs and why. A concrete example beats a definition.",
    },
    {
      id: "d1-abstract",
      level: "junior",
      task: "1.1",
      title: "Interfaces and abstract classes",
      check: ["d1-06", "d1-07"],
      visual: (
        <div className="grid gap-4">
          <div className="grid gap-3 md:grid-cols-2">
            <CodeBlock
              lang="java"
              caption="Interface: a capability that many unrelated classes can have."
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
              caption="Abstract class: shared fields and constructor logic."
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
              { icon: "🔌", title: "Interface", text: "No per-object fields and no constructor. A class can implement many. Default, static and private methods are allowed.", color: "#38bdf8" },
              { icon: "🏛️", title: "Abstract class", text: "Can have fields, constructors and any visibility. A class can extend only one.", color: "#f89820" },
            ]}
          />
        </div>
      ),
      points: [
        "**Default methods** (from Java 8) let you add a method with a body to a published interface without breaking the classes that already implement it.",
        "If two interfaces give a class the same default method, the class must override it. It can still call one of them with `A.super.hi()`.",
        "Use interfaces for types by default. Reach for an abstract class when subclasses really do share fields or setup code.",
        "An interface with exactly one abstract method is a **functional interface**, which means a lambda can implement it.",
      ],
      tip: "The modern answer is \"an interface by default, an abstract class when you need shared state\". Mentioning default methods shows you know how interfaces changed after Java 8.",
    },
    {
      id: "d1-equality",
      level: "intermediate",
      task: "1.2",
      title: "== and equals, hashCode, and the Integer cache",
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
        "For primitives, `==` compares values. For objects, it checks whether both sides are the same object. `equals` compares what the objects mean, if the class overrides it.",
        "The rule: equal objects must have equal hash codes. Unequal objects are allowed to share a hash code, which is called a collision.",
        "`equals` must give the same answer both ways round, be consistent, and return false for `null` rather than throwing.",
        "Autoboxing uses `Integer.valueOf`, which reuses cached objects for -128 to 127. That's why `==` on boxed numbers seems to work in small tests and then fails later.",
        "Unboxing a null wrapper throws `NullPointerException`. For example, `int n = map.get(key)` blows up when the key is missing.",
      ],
      tip: "If you override equals, say \"and hashCode\" in the same breath. Interviewers listen for it.",
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
              title: "O(n²): copies the whole string every time",
              code: java`
                String s = "";
                for (int i = 0; i < n; i++) {
                  s += "x";
                }
              `,
            }}
            right={{
              title: "O(n): one buffer that grows",
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
        "Strings never change. `concat`, `toUpperCase` and `trim` all return new strings, so if you ignore the result, nothing happens.",
        "String literals (and compile-time constants) are stored once in the **string pool**, so equal literals share one object.",
        "`new String(\"x\")` and strings built while the program runs are separate objects. Compare them with `equals`, never `==`.",
        "Because they can't change, strings are safe as map keys, safe to share between threads, and can cache their own hash code.",
        "`StringBuilder` is the faster choice for building text. `StringBuffer` is its older, synchronized twin.",
      ],
      tip: "A classic follow-up is \"how many objects does `new String(\"hi\")` create?\". The answer: the literal in the pool (if it isn't there already) plus one new object on the heap.",
    },
  ],

  questions: [
    // ───────────── Start here ─────────────
    {
      id: "java-b1-01",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-hello",
      type: "output",
      prompt: "What does this line print?",
      codeLang: "java",
      code: java`
        System.out.println("Hello, Java!");
      `,
      answers: ["Hello, Java!"],
      explanation:
        "`System.out.println` prints whatever is in the brackets, then moves to a new line. The double quotes mark the text as a String, but they aren't printed.",
    },
    {
      id: "java-b1-02",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-hello",
      prompt: "What does running `javac Main.java` do?",
      options: [
        "Checks the code and turns it into a `Main.class` file the JVM can run",
        "Runs the program and prints its output",
        "Deletes the source file once it has run",
        "Downloads Java onto your computer",
      ],
      answer: [0],
      explanation:
        "`javac` is the Java compiler. It checks your code for mistakes and translates it into bytecode, saved as `Main.class`. Then `java Main` starts the JVM, which actually runs it.",
    },
    {
      id: "java-b1-03",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-variables",
      type: "output",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        int a = 7;
        int b = 2;
        System.out.println(a + b);
      `,
      answers: ["9"],
      explanation:
        "Both variables are `int`s, so `+` adds them as numbers: 7 plus 2 is 9. If either one were a String, `+` would join them as text instead.",
    },
    {
      id: "java-b1-04",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-variables",
      type: "fill",
      prompt: "Fill the gap with the type that holds text.",
      codeLang: "java",
      code: java`
        {{1}} name = "Ada";
        System.out.println("Hi " + name);  // Hi Ada
      `,
      blanks: [{ options: ["String", "string", "int", "char"], answer: 0 }],
      explanation:
        "Text in double quotes is a `String`, spelled with a capital S because it's a class. Lowercase `string` doesn't exist in Java, `int` holds whole numbers, and `char` holds a single character like `'A'`.",
    },
    {
      id: "java-b1-05",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-objects",
      type: "output",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        class Dog {
          String name;
          Dog(String name) { this.name = name; }
        }

        Dog d = new Dog("Rex");
        System.out.println(d.name);
      `,
      answers: ["Rex"],
      explanation:
        "`new Dog(\"Rex\")` builds a Dog and runs its constructor, which stores `\"Rex\"` in the object's `name` field. `d.name` reads that field back.",
    },
    {
      id: "java-b1-06",
      domain: "d1",
      level: "beginner",
      lesson: "d1-start-objects",
      prompt: "What's the difference between a class and an object?",
      options: [
        "A class is the blueprint; an object is one thing built from it with `new`",
        "They're two words for exactly the same thing",
        "An object is the blueprint; a class is built from it",
        "A class can only ever produce one object",
      ],
      answer: [0],
      explanation:
        "Think of a cookie cutter and cookies. The class (`Dog`) describes what every dog has. Each `new Dog(...)` makes a separate object with its own values, and you can make as many as you like.",
    },
    // ───────────── Interview questions ─────────────
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
      explanation:
        "Java picks an overridden method at runtime, based on the object's real class. This is called dynamic dispatch. The object is a `Dog`, so `Dog.speak()` runs, even though the variable's type is `Animal`.",
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
      explanation:
        "Overloads are picked at compile time, using the declared type of the argument. `x` is declared as `Object`, so `describe(Object)` is chosen, even though it holds a String when the program runs. Only overriding is decided at runtime.",
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
      explanation:
        "Fields don't follow the object. `B.name` just hides `A.name`, and the declared type `A` decides which field `obj.name` reads, so you get \"A\". The method `who()` is overridden, so the object's real class decides: \"B\".",
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
      explanation:
        "Returning the internal list hands callers the real, changeable list, so `team.getMembers().add(\"\")` skips the check in `add`. Return `List.copyOf(members)` or `Collections.unmodifiableList(members)` instead. `final` on the field only stops it being reassigned; the list itself can still change.",
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
        "A `static` method in a subclass overrides the parent's static method, so calls are decided at runtime.",
        "An overriding method may declare new, broader checked exceptions.",
      ],
      answer: [0],
      explanation:
        "Covariant return types are allowed, for example `Dog clone()` overriding `Animal clone()`. An override can't make a method less visible or throw broader checked exceptions. Static methods are hidden, not overridden, so the declared type picks them at compile time.",
    },
    {
      id: "d1-06",
      domain: "d1",
      level: "junior",
      lesson: "d1-abstract",
      prompt: "Which two can an abstract class have that an interface cannot? (Choose two.)",
      options: ["Instance fields (per-object state)", "A constructor", "Default methods", "Static methods", "Private methods"],
      answer: [0, 1],
      explanation:
        "Interfaces can't hold per-object fields or define constructors. Since Java 8 they can have default and static methods, and since Java 9 private ones too, so those don't tell the two apart.",
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
      explanation:
        "Two unrelated default methods with the same signature clash, and Java won't guess which one you meant. `C` has to override `hi()`. Inside it, you can call one of them with `A.super.hi()` or `B.super.hi()`.",
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
      explanation:
        "Shared fields and constructors are what abstract classes are good at. A capability shared by unrelated classes, inheriting from several types, and being a lambda target are all jobs for interfaces.",
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
      explanation:
        "Identical literals share one object from the pool, so `a == b` is true. `new String` always makes a separate object, so `a == c` is false. `equals` compares the characters, so it's true.",
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
      explanation:
        "Autoboxing calls `Integer.valueOf`, which hands back cached objects for -128 to 127. So both 127s are the same object. 128 is outside the cache, so you get two different objects and `==`, which compares objects, is false. Always compare wrappers with `equals`.",
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
      explanation:
        "Two equal points get different identity hash codes, so the set looks in the wrong bucket and never even calls `equals`. Equal objects must have equal hash codes. Use `Objects.hash(x, y)`, or make `Point` a record.",
    },
    {
      id: "d1-12",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-equality",
      prompt: "Which two statements are required by the `equals` and `hashCode` contract? (Choose two.)",
      options: [
        "If `a.equals(b)` is true, then `a.hashCode() == b.hashCode()` must be true.",
        "`a.equals(null)` must return false, not throw.",
        "If `a.hashCode() == b.hashCode()`, then `a.equals(b)` must be true.",
        "`hashCode()` must return a different value for every distinct object.",
        "`equals` must compare every field of the class.",
      ],
      answer: [0, 1],
      explanation:
        "Equal objects need equal hash codes, and `equals(null)` must be false. The reverse isn't required: different objects are allowed to share a hash code. You choose which fields define equality, as long as `equals` and `hashCode` use the same ones.",
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
      explanation:
        "`get` returns null for a missing key. Putting that into an `int` unboxes it by calling `intValue()` on null, which throws `NullPointerException`. Use `stock.getOrDefault(\"apples\", 0)` instead.",
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
      explanation:
        "Strings can't change. `concat` and `toUpperCase` return new strings, and here they're thrown away, so `s` is still \"hi\". A `StringBuilder` can change, so `append` updates it in place.",
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
      explanation:
        "Each `+=` builds a brand-new string and copies every character so far. That's 1 + 2 + … + n copies, which grows as O(n²). A `StringBuilder` adds to one growing buffer, so the total is O(n).",
    },
    {
      id: "d1-16",
      domain: "d1",
      level: "junior",
      lesson: "d1-strings",
      type: "order",
      prompt: "Put the body of `join(List<String> words)` in order so `join(List.of(\"a\", \"b\", \"c\"))` returns `\"a,b,c\"`.",
      items: ["`StringBuilder sb = new StringBuilder();`", "`for (String w : words) {`", "`if (sb.length() > 0) sb.append(',');`", "`sb.append(w);`", "`}`", "`return sb.toString();`"],
      explanation:
        "Add the comma before each word except the first, which is when the buffer is still empty, then add the word. Adding the word first would leave a comma at the end. In real code, `String.join(\",\", words)` does this for you.",
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
      explanation:
        "Encapsulation hides state behind methods. Inheritance reuses what a parent class has. Polymorphism lets the object's real class pick the method. Abstraction shows what a type does, not how it does it.",
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
      explanation:
        "Because nobody can change a shared literal, pooling is safe. A String can also cache its hash code, map keys stay stable, and threads can share strings without locks. `==` still compares objects, and `StringBuilder` is the changeable option.",
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
      explanation:
        "`a` isn't a compile-time constant, so `a + \"va\"` is worked out while the program runs and makes a new String. That's why `b == c` is false. `intern()` returns the pooled \"java\", which is `c`, so the second check is true. If `a` were `final`, the compiler would join the strings itself and `b == c` would be true.",
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
      explanation:
        "`big.equals(10)` boxes 10 as an `Integer`, and `Long.equals` returns false for anything that isn't a `Long`. `equals(10L)` is true. `big == 10` mixes a wrapper with a primitive, so Java unboxes `big` and compares the numbers, which gives true.",
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
      explanation:
        "A string read from a database is a different object from the pooled literal \"admin\", so `==` compares two different objects and fails. Use `\"admin\".equals(role)`. Putting the literal first also means it can't throw if `role` is null.",
    },
    {
      id: "d1-22",
      domain: "d1",
      level: "staff",
      lesson: "d1-equality",
      prompt: "A widely shared `Money` class has setters and is used as a key in caches across many services. Keys sometimes \"disappear\" from those caches. What's the best long-term fix?",
      options: [
        "Make `Money` an immutable value type (final fields, or a record), deprecate the setters, and move callers to copy-with methods like `withAmount(...)`",
        "Document \"never mutate a key\" on the class and rely on code review",
        "Override `hashCode()` to return a constant so lookups never miss",
        "Switch every cache to `IdentityHashMap`",
      ],
      answer: [0],
      explanation:
        "Changing a key after it's in a map changes its hash, so the map looks in the wrong bucket. Making the type immutable removes that whole kind of bug. A constant hash makes every lookup slow, identity maps break lookups by value, and documentation alone doesn't hold up across many teams.",
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
      explanation:
        "Default methods were made for exactly this: growing a published interface while existing implementations keep compiling and running. A new abstract method breaks every implementer. Switching to an abstract class breaks anyone who already extends another class, and a second interface splits everyone in two.",
    },
    {
      id: "d1-24",
      domain: "d1",
      level: "staff",
      lesson: "d1-strings",
      prompt: "A reporting service builds multi-megabyte CSV exports with `+=` inside nested loops, and it shows latency spikes and heavy garbage collection. Which two changes fix the root cause? (Choose two.)",
      options: [
        "Build each export with one `StringBuilder`, sized up front when you roughly know the size",
        "Stream rows straight to the response `Writer` instead of building one giant String in memory",
        "Call `System.gc()` after each export",
        "Call `intern()` on every row string",
        "Increase the thread stack size with `-Xss`",
      ],
      answer: [0, 1],
      explanation:
        "Every `+=` makes and copies a new String, so the work and the garbage grow as O(n²). One builder fixes the copying, and streaming avoids holding the whole export in memory at all. `System.gc()` is only a hint, interning fills the pool with one-off strings, and stack size has nothing to do with heap garbage.",
    },
    {
      id: "d1-25",
      domain: "d1",
      level: "staff",
      lesson: "d1-equality",
      prompt: "In review, a teammate compares `Integer` order ids with `==` and says \"all the tests pass\". The tests only use ids below 100. What's the best response?",
      options: [
        "Request changes: it only works because of the -128 to 127 cache. Use `equals` (or primitive `long`/`int`), and add a test with an id above 127",
        "Approve: the JVM caches every `Integer`, so `==` is safe",
        "Approve, but ask them to add `-XX:AutoBoxCacheMax` to production flags",
        "Request changes: wrap the ids in `String.valueOf` and compare with `==`",
      ],
      answer: [0],
      explanation:
        "The tests pass by luck. Boxed values outside the cache are separate objects, so real ids like 5000 compare as false. The fix is to compare values, plus a test that would have caught it. Tuning the cache just moves the cliff, and `==` on strings has the same problem.",
    },
  ],

  cards: [
    { id: "j-objects-equals", domain: "d1", kind: "service", term: "Objects.equals(a, b)", definition: "Equality that copes with null: true if both are null, or if a.equals(b)." },
    { id: "j-objects-hash", domain: "d1", kind: "service", term: "Objects.hash(...)", definition: "Builds a hashCode from several fields. Use the same fields as your equals method." },
    { id: "j-stringbuilder", domain: "d1", kind: "service", term: "StringBuilder", definition: "A changeable text buffer for building strings in a loop, without making a new String each time." },
    { id: "j-intern", domain: "d1", kind: "service", term: "String.intern()", definition: "Returns the single shared copy of a string from the string pool." },
    { id: "j-valueof", domain: "d1", kind: "service", term: "Integer.valueOf(int)", definition: "Turns an int into an Integer. Autoboxing uses it, and it reuses cached objects for -128 to 127." },
    { id: "j-string-join", domain: "d1", kind: "service", term: "String.join(delim, items)", definition: "Joins strings with a separator between them, with no extra separator at the end." },
    { id: "j-encapsulation", domain: "d1", kind: "concept", term: "Encapsulation", definition: "Keeping an object's data private and changing it only through methods that protect its rules." },
    { id: "j-polymorphism", domain: "d1", kind: "concept", term: "Polymorphism", definition: "One call, many behaviours: the object's real class decides which overridden method runs." },
    { id: "j-overload-override", domain: "d1", kind: "concept", term: "Overloading and overriding", definition: "Overloads are chosen at compile time by the argument types. Overrides are chosen at runtime by the object's class." },
    { id: "j-default-method", domain: "d1", kind: "concept", term: "Default method", definition: "An interface method with a body. It lets a published interface grow without breaking the classes that implement it." },
    { id: "j-string-pool", domain: "d1", kind: "concept", term: "String pool", definition: "A table the JVM keeps of shared strings. Equal literals point at the same object." },
    { id: "j-autoboxing", domain: "d1", kind: "concept", term: "Autoboxing", definition: "Java converting between int and Integer for you. Unboxing a null Integer throws NullPointerException." },
    { id: "j-equals-contract", domain: "d1", kind: "concept", term: "equals and hashCode contract", definition: "Equal objects must have equal hash codes, and equals must give the same answer in both directions." },
  ],

  challenges: [
    {
      id: "ch-java-cache-edge",
      domain: "d1",
      lesson: "d1-equality",
      title: "Find the cache cliff",
      goal: "Find the smallest positive number where `a == b` turns false.",
      hint: "Start inside the green cache range and press +1 to walk to its edge.",
      takeaway: "By default, Integer.valueOf reuses cached objects for -128 to 127. From 128 up, every autobox makes a new object, so == compares two different objects.",
      render: (onSolved) => <IntegerCacheLab goal="edge" onSolved={onSolved} />,
    },
  ],
});
