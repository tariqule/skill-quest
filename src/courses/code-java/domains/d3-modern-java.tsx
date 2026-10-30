import { CodeBlock, CodeCompare, Flow, Layers, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { java } from "../java";
import { StreamStepper } from "../visuals";

/** Module 3: exceptions, lambdas and streams, Optional, records and sealed types. */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Exceptions, Streams & Modern Java",
    world: "The Stream Rapids",
    weight: 25,
    emoji: "🌊",
    color: "#a78bfa",
    summary:
      "Checked and unchecked exceptions, try-with-resources, lambdas and lazy streams, Optional, and the records, sealed types and pattern matching added in Java 16 to 21.",
  },

  tasks: [
    {
      id: "3.1",
      title: "Handle errors and resources",
      covers: ["The Throwable family tree; checked and unchecked exceptions", "How finally behaves", "try-with-resources, close order, suppressed exceptions", "An exception strategy across layers"],
    },
    {
      id: "3.2",
      title: "Write functional-style code",
      covers: ["Functional interfaces, lambdas, method references, effectively final", "Lazy streams, intermediate and terminal operations, collectors", "Optional: when and how to use it"],
    },
    {
      id: "3.3",
      title: "Model data with modern Java",
      covers: ["Records and compact constructors", "Sealed classes and interfaces", "Pattern matching for instanceof and switch"],
    },
  ],

  lessons: [
    {
      id: "d3-start-methods",
      level: "beginner",
      task: "3.2",
      title: "Methods: name a job, then reuse it",
      check: ["java-b3-01", "java-b3-02"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="java"
            code={java`
              static int square(int n) {   // takes an int, gives back an int
                return n * n;
              }

              static void greet(String name) {   // void: gives nothing back
                System.out.println("Hi " + name);
              }

              System.out.println(square(4));   // 16
              greet("Ana");                    // Hi Ana
            `}
          />
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "📥", label: "Pass a value in", sub: "square(4)" },
              { icon: "⚙️", label: "The body runs", sub: "n * n with n = 4" },
              { icon: "📤", label: "return hands it back", sub: "16" },
            ]}
          />
        </div>
      ),
      points: [
        "A **method** is a named block of code that does one job. You write it once and call it whenever you need that job done, like a speed-dial button.",
        "The first line says what goes in and what comes out. `int square(int n)` takes an `int` called `n` and gives back an `int`.",
        "`return` hands the answer back to whoever called the method. The method stops as soon as `return` runs.",
        "A method marked `void` gives nothing back. It just does something, like printing.",
      ],
      tip: "The values you pass in are called **arguments**, and the names that receive them in the method are **parameters**. In `square(4)`, 4 is the argument and `n` is the parameter.",
    },
    {
      id: "d3-start-errors",
      level: "beginner",
      task: "3.1",
      title: "Exceptions: when something goes wrong",
      check: ["java-b3-03", "java-b3-04"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="java"
            code={java`
              try {
                int[] a = new int[2];
                a[5] = 1;                       // there is no slot 5
                System.out.println("saved");    // skipped
              } catch (ArrayIndexOutOfBoundsException e) {
                System.out.println("oops");     // runs instead
              }
            `}
          />
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "▶️", label: "try", sub: "Run code that might fail" },
              { icon: "💥", label: "An exception is thrown", sub: "The rest of the try block is skipped" },
              { icon: "🛟", label: "catch", sub: "Your backup plan runs" },
            ]}
          />
        </div>
      ),
      points: [
        "An **exception** is Java's way of saying \"something went wrong and I can't carry on here\". Dividing by zero or reading past the end of an array both throw one.",
        "If nothing catches it, the program stops and prints a **stack trace**: the error's name, a message, and the lines that led there.",
        "`try { ... }` marks code that might fail. If it throws, Java jumps straight to a matching `catch` block.",
        "Name the exception you expect in the `catch`, so other surprises still get noticed.",
      ],
      tip: "Read a stack trace from the top. The first line names the exception, and the next lines point at the file and line number where it happened.",
    },
    {
      id: "d3-start-lambdas",
      level: "beginner",
      task: "3.2",
      title: "Lambdas: tiny methods with no name",
      check: ["java-b3-05", "java-b3-06"],
      visual: (
        <CodeBlock
          lang="java"
          code={java`
            List<Integer> nums = List.of(1, 2, 3, 4);

            // keep only the numbers bigger than 2
            List<Integer> big = nums.stream()
                .filter(n -> n > 2)
                .toList();
            System.out.println(big);   // [3, 4]

            List.of("Ana", "Ben").forEach(name -> System.out.println(name));
          `}
        />
      ),
      points: [
        "A **lambda** is a small method with no name that you write right where you need it. `n -> n > 2` means \"given n, answer whether n is bigger than 2\".",
        "The part before the arrow lists the inputs. The part after is what it works out or does.",
        "You often hand lambdas to other methods. `forEach(name -> System.out.println(name))` says \"for each name, print it\".",
        "A **stream** is a way to process a collection step by step, like items on a conveyor belt. `filter` keeps some items and `toList` collects the result.",
      ],
      tip: "Lambdas save you writing a whole class just to pass a bit of behaviour around. They're everywhere in modern Java, so it's worth getting comfortable reading them.",
    },
    {
      id: "d3-exceptions",
      level: "intermediate",
      task: "3.1",
      title: "Checked, unchecked, and try-with-resources",
      check: ["d3-01", "d3-04"],
      visual: (
        <div className="grid gap-5">
          <Layers
            layers={[
              { name: "Throwable", color: "#94a3b8", items: ["the root of everything you can throw"] },
              { name: "Error (unchecked): don't catch", color: "#f87171", items: ["OutOfMemoryError", "StackOverflowError"] },
              { name: "Exception (checked): must catch or declare", color: "#f59e0b", items: ["IOException", "SQLException", "InterruptedException"] },
              { name: "RuntimeException (unchecked): programming bugs", color: "#a78bfa", items: ["NullPointerException", "IllegalArgumentException", "IllegalStateException", "ArithmeticException"] },
            ]}
          />
          <CodeCompare
            lang="java"
            left={{
              title: "Leaks the reader if readLine throws",
              code: java`
                BufferedReader r = Files.newBufferedReader(p);
                String line = r.readLine();
                r.close();
                return line;
              `,
            }}
            right={{
              title: "Always closed, even when it throws",
              code: java`
                try (BufferedReader r = Files.newBufferedReader(p)) {
                  return r.readLine();
                }
                // several resources close in reverse order;
                // a close() failure becomes a suppressed exception
              `,
            }}
          />
        </div>
      ),
      points: [
        "**Checked exceptions** are subclasses of `Exception` that aren't `RuntimeException`s. The compiler makes you either catch them or declare them with `throws`.",
        "`finally` runs whether the try block returns, throws or just finishes. A value returned from `try` is saved before `finally` runs.",
        "try-with-resources works with anything that's `AutoCloseable`, and it closes resources in the reverse of the order you opened them.",
        "Catch specific exceptions first. A `catch` for a subclass placed after its parent class won't compile.",
        "Where one layer of your app hands off to another, wrap low-level checked exceptions in a meaningful unchecked one, and keep the original as the cause.",
      ],
      tip: "Never write an empty catch block in an interview. At the very least, log it or rethrow it, and say out loud why you're catching it.",
    },
    {
      id: "d3-streams",
      level: "intermediate",
      task: "3.2",
      title: "Lambdas and lazy streams",
      check: ["d3-08", "d3-12"],
      visual: (
        <div className="grid gap-5">
          <StreamStepper />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🏭", title: "Supplier<T>", text: "() -> T", color: "#34d399" },
              { icon: "🍽️", title: "Consumer<T>", text: "T -> void", color: "#38bdf8" },
              { icon: "🔀", title: "Function<T, R>", text: "T -> R", color: "#a78bfa" },
              { icon: "❓", title: "Predicate<T>", text: "T -> boolean", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "**Intermediate** operations like `filter`, `map` and `sorted` are lazy. Nothing runs until a **terminal** operation like `toList`, `collect`, `forEach` or `findFirst`.",
        "Items go through the whole pipeline one at a time. Short-circuiting operations like `findFirst`, `limit` and `anyMatch` stop as soon as they have their answer.",
        "You can only use a stream once. Using it again throws `IllegalStateException`.",
        "A lambda can only use local variables that are final, or **effectively final**, meaning they're never reassigned.",
        "Parallel streams all share one common thread pool. Measure before using them, and never block inside them.",
      ],
      tip: "Read a stream pipeline aloud as a sentence: \"take the people, keep the adults, turn them into names, sort, and join with commas\". It shows you understand the order of operations.",
    },
    {
      id: "d3-optional",
      level: "intermediate",
      task: "3.2",
      title: "Optional without the pain",
      check: ["d3-15", "d3-17"],
      visual: (
        <CodeCompare
          lang="java"
          left={{
            title: "Nested null checks",
            code: java`
              String city = "unknown";
              User u = repo.find(id);
              if (u != null) {
                Address a = u.address();
                if (a != null && a.city() != null) {
                  city = a.city().toUpperCase();
                }
              }
            `,
          }}
          right={{
            title: "An Optional pipeline",
            code: java`
              String city = repo.findById(id)       // Optional<User>
                  .map(User::address)
                  .map(Address::city)
                  .map(String::toUpperCase)
                  .orElse("unknown");
            `,
          }}
        />
      ),
      points: [
        "An **Optional** is a box that either holds a value or is empty. `Optional.of(x)` throws if `x` is null, while `Optional.ofNullable(x)` gives you an empty box instead.",
        "Calling `map` on an empty Optional skips the function and stays empty.",
        "`orElse(value)` always works out its argument. `orElseGet(supplier)` only calls the supplier when the box is empty.",
        "Use Optional as a return type for \"this might not exist\". Avoid it for fields, parameters and collections; return an empty list instead.",
        "Calling `get()` without checking is just a NullPointerException with extra steps. Use `orElseThrow()` so the intent is clear.",
      ],
      tip: "If you're asked \"should this field be Optional?\", the expected answer is usually no. Optional was designed as a return type.",
    },
    {
      id: "d3-records",
      level: "intermediate",
      task: "3.3",
      title: "Records, sealed types, and pattern matching",
      check: ["d3-19", "d3-21"],
      visual: (
        <CodeBlock
          lang="java"
          caption="A closed family of types plus a switch that covers them all. Add a new subtype and the compiler lists every switch you need to update."
          code={java`
            sealed interface Shape permits Circle, Square { }
            record Circle(double r) implements Shape { }
            record Square(double side) implements Shape {
              Square {                                    // compact constructor
                if (side <= 0) throw new IllegalArgumentException();
              }
            }

            static double area(Shape s) {
              return switch (s) {                         // no default needed
                case Circle c -> Math.PI * c.r() * c.r();
                case Square(double side) -> side * side;  // record pattern
              };
            }
          `}
        />
      ),
      points: [
        "A **record** writes the boilerplate for you: a constructor, private final fields, accessors (`r()`, not `getR()`), `equals`, `hashCode` and `toString`.",
        "Records are final and only shallowly immutable. A record that holds a `List` should copy it with `List.copyOf` in the compact constructor.",
        "`sealed ... permits` fixes the exact list of subtypes. Each permitted subclass must be `final`, `sealed` or `non-sealed`.",
        "Pattern matching (`o instanceof Point p`, and `switch` with type and record patterns) is final in Java 21. A switch over a sealed type can cover every case with no `default`.",
      ],
      tip: "Records are the modern answer to \"write an immutable value class\". Mention that they also solve the equals and hashCode question for free.",
    },
  ],

  questions: [
    // ───────────── Start here ─────────────
    {
      id: "java-b3-01",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-methods",
      type: "output",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        static int square(int n) {
          return n * n;
        }

        System.out.println(square(4));
      `,
      answers: ["16"],
      explanation:
        "Calling `square(4)` runs the method with `n` set to 4. It returns 4 times 4, which is 16, and `println` prints that value.",
    },
    {
      id: "java-b3-02",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-methods",
      prompt: "What does `void` mean in `static void greet(String name)`?",
      options: [
        "The method doesn't return a value",
        "The method takes no parameters",
        "The method is empty and does nothing",
        "The method can only be called once",
      ],
      answer: [0],
      explanation:
        "The word before the method name is its return type. `void` means \"nothing comes back\". This method still does something useful, like printing, and it still takes a `name` parameter.",
    },
    {
      id: "java-b3-03",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-errors",
      type: "output",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        try {
          int[] a = new int[2];
          a[5] = 1;
          System.out.println("saved");
        } catch (ArrayIndexOutOfBoundsException e) {
          System.out.println("oops");
        }
      `,
      answers: ["oops"],
      explanation:
        "The array only has slots 0 and 1, so `a[5]` throws `ArrayIndexOutOfBoundsException`. Java skips the rest of the `try` block, so \"saved\" never prints, and jumps to the matching `catch`, which prints \"oops\".",
    },
    {
      id: "java-b3-04",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-errors",
      prompt: "What happens if an exception is thrown and nothing catches it?",
      options: [
        "The program stops and prints a stack trace describing the error",
        "Java skips the bad line and carries on",
        "Java fixes the problem and runs the line again",
        "Nothing happens until the program finishes",
      ],
      answer: [0],
      explanation:
        "An uncaught exception ends the program (or the thread it happened in). Java prints the exception's name, its message and the lines that led there, which is your best clue for fixing it.",
    },
    {
      id: "java-b3-05",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-lambdas",
      type: "output",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        List<Integer> nums = List.of(1, 2, 3, 4);
        System.out.println(nums.stream().filter(n -> n > 2).toList());
      `,
      answers: ["[3, 4]", "[3,4]"],
      explanation:
        "The lambda `n -> n > 2` answers true only for 3 and 4, so `filter` keeps just those. `toList()` gathers them into a new list, which prints as `[3, 4]`.",
    },
    {
      id: "java-b3-06",
      domain: "d3",
      level: "beginner",
      lesson: "d3-start-lambdas",
      type: "fill",
      prompt: "Fill the gap so this lambda prints every name.",
      codeLang: "java",
      code: java`
        List<String> names = List.of("Ana", "Ben");
        names.forEach(n {{1}} System.out.println(n));
      `,
      blanks: [{ options: ["->", "=>", "=", ":"], answer: 0 }],
      explanation:
        "Java lambdas use a thin arrow made of a dash and a greater-than sign. The input goes on the left and the work on the right. `=>` is the arrow JavaScript and C# use, so it won't compile in Java.",
    },
    // ───────────── Interview questions ─────────────
    {
      id: "d3-01",
      domain: "d3",
      level: "junior",
      lesson: "d3-exceptions",
      prompt: "Which of these is a checked exception?",
      options: ["`IOException`", "`IllegalArgumentException`", "`NullPointerException`", "`ArrayIndexOutOfBoundsException`"],
      answer: [0],
      explanation:
        "`IOException` extends `Exception` directly, so the compiler makes you catch it or declare it. The other three extend `RuntimeException`, which makes them unchecked.",
    },
    {
      id: "d3-02",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-exceptions",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        static int f() {
          try {
            return 1;
          } finally {
            System.out.print("finally ");
          }
        }

        System.out.println(f());
      `,
      options: ["`finally 1`", "`1 finally`", "`1`", "`finally`"],
      answer: [0],
      explanation:
        "The `finally` block runs before `f()` actually hands back its value, so \"finally \" is printed first. Then `println` prints the returned 1.",
    },
    {
      id: "d3-03",
      domain: "d3",
      level: "senior",
      lesson: "d3-exceptions",
      prompt: "What does `g()` return?",
      codeLang: "java",
      code: java`
        static int g() {
          int x = 1;
          try {
            return x;
          } finally {
            x = 2;
          }
        }
      `,
      options: ["`1`", "`2`", "Compile error: unreachable code", "It throws an exception"],
      answer: [0],
      explanation:
        "When `return x` runs, the value 1 is saved as the result. Changing the local `x` in `finally` doesn't touch that saved value. A `return` inside `finally` would replace it, which is exactly why that's considered bad practice.",
    },
    {
      id: "d3-04",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-exceptions",
      type: "order",
      prompt: "`Res` prints \"open X\" in its constructor and \"close X\" in `close()`. Put the output lines in order.",
      codeLang: "java",
      code: java`
        try (var a = new Res("A"); var b = new Res("B")) {
          System.out.println("body");
        }
      `,
      items: ["`open A`", "`open B`", "`body`", "`close B`", "`close A`"],
      explanation:
        "Resources open in the order you declare them and close in reverse order once the body finishes, just like nested try/finally blocks.",
    },
    {
      id: "d3-05",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-exceptions",
      type: "lines",
      prompt: "If `readLine()` throws, the file handle leaks. Tap the line that should become a try-with-resources header.",
      codeLang: "java",
      code: java`
        static String firstLine(Path p) throws IOException {
          BufferedReader r = Files.newBufferedReader(p);
          String line = r.readLine();
          r.close();
          return line;
        }
      `,
      answer: [2],
      explanation:
        "Declare the reader in the header: `try (BufferedReader r = Files.newBufferedReader(p)) { return r.readLine(); }`. Then it's closed on every path, including when something throws, and you can drop the manual `close()`.",
    },
    {
      id: "d3-06",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-exceptions",
      prompt: "Which two statements about try-with-resources are true? (Choose two.)",
      options: [
        "Resources must implement `AutoCloseable`",
        "If the body and `close()` both throw, the `close()` exception is attached to the body's exception as suppressed",
        "Resources are closed in the order they were declared",
        "Resources are closed only if the body completes normally",
        "You can't add a `catch` block to a try-with-resources statement",
      ],
      answer: [0, 1],
      explanation:
        "The body's exception wins, and the close failure is kept on it, where `getSuppressed()` can find it. Closing happens on every path, in reverse order. `catch` and `finally` blocks are allowed too; they run after the resources are closed.",
    },
    {
      id: "d3-07",
      domain: "d3",
      level: "junior",
      lesson: "d3-exceptions",
      type: "lines",
      prompt: "Tap the line that doesn't compile.",
      codeLang: "java",
      code: java`
        try {
          Files.readString(path);
        } catch (IOException e) {
          log(e);
        } catch (FileNotFoundException e) {
          log(e);
        }
      `,
      answer: [5],
      explanation:
        "`FileNotFoundException` is a kind of `IOException`, which the first catch already handles. The second catch can never be reached, so the compiler rejects it. Put the more specific catch first.",
    },
    {
      id: "d3-08",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-streams",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        Stream.of(1, 2, 3, 4)
            .filter(n -> {
              System.out.print("f" + n + " ");
              return n % 2 == 0;
            })
            .findFirst();
      `,
      options: ["`f1 f2`", "`f1 f2 f3 f4`", "Nothing", "`f2`"],
      answer: [0],
      explanation:
        "Streams are lazy and pull one item at a time. 1 fails the filter, 2 passes, and `findFirst` stops right there, so 3 and 4 are never checked.",
    },
    {
      id: "d3-09",
      domain: "d3",
      level: "junior",
      lesson: "d3-streams",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        List<Integer> xs = List.of(1, 2, 3);
        xs.stream().map(n -> {
          System.out.println(n);
          return n * 2;
        });
      `,
      options: ["Nothing", "`1`, `2`, `3` on separate lines", "`2`, `4`, `6` on separate lines", "Compile error: the result isn't used"],
      answer: [0],
      explanation:
        "`map` is an intermediate operation. With no terminal operation like `toList()` or `forEach` at the end, the pipeline never runs, so the lambda is never called.",
    },
    {
      id: "d3-10",
      domain: "d3",
      level: "junior",
      lesson: "d3-streams",
      prompt: "What happens when this runs?",
      codeLang: "java",
      code: java`
        Stream<String> s = Stream.of("a", "b");
        s.forEach(System.out::print);
        s.forEach(System.out::print);
      `,
      options: ["Prints `ab`, then throws `IllegalStateException`", "Prints `abab`", "Prints `ab` once and silently does nothing", "Compile error: a stream can't be stored in a variable"],
      answer: [0],
      explanation:
        "A stream can only be used once; after a terminal operation, it's spent. To go through the items twice, keep the source, such as a List, and call `stream()` again, or use a `Supplier<Stream<T>>`.",
    },
    {
      id: "d3-11",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-streams",
      prompt: "What is `byLen.get(2)`?",
      codeLang: "java",
      code: java`
        Map<Integer, List<String>> byLen = Stream.of("hi", "yo", "hey", "a")
            .collect(Collectors.groupingBy(String::length));
      `,
      options: ["`[hi, yo]`", "`[yo, hi]`", "`[hey]`", "`2`"],
      answer: [0],
      explanation:
        "`groupingBy` puts each item into a list under its key, keeping the original order inside each group. \"hi\" and \"yo\" both have length 2. Use `groupingBy(f, counting())` if you want counts instead.",
    },
    {
      id: "d3-12",
      domain: "d3",
      level: "junior",
      lesson: "d3-streams",
      type: "lines",
      prompt: "Tap the line that doesn't compile.",
      codeLang: "java",
      code: java`
        int count = 0;
        List<String> names = List.of("a", "b");
        names.forEach(n -> {
          count++;
        });
        System.out.println(count);
      `,
      answer: [4],
      explanation:
        "A lambda can only use local variables that are final or effectively final, and `count++` changes one. Use `names.size()`, a stream's `count()`, or an `AtomicInteger` if you really need a counter that changes.",
    },
    {
      id: "d3-13",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-streams",
      type: "order",
      prompt: "`Person` is a record with `name()` and `age()` that doesn't implement `Comparable`. Put the pipeline in order so it returns the adults' names, sorted, joined by \", \".",
      items: ["`people.stream()`", "`.filter(p -> p.age() >= 18)`", "`.map(Person::name)`", "`.sorted()`", "`.collect(Collectors.joining(\", \"))`"],
      explanation:
        "Filter while you still have the `Person`, because after `map` the age is gone. Then map to names and sort. Strings can be compared but `Person` can't, so calling `sorted()` before `map` would throw `ClassCastException`. The terminal `collect` comes last.",
    },
    {
      id: "d3-14",
      domain: "d3",
      level: "junior",
      lesson: "d3-streams",
      type: "match",
      prompt: "Match each functional interface to its shape.",
      pairs: [
        ["`Supplier<T>`", "`() -> T`"],
        ["`Consumer<T>`", "`T -> void`"],
        ["`Function<T, R>`", "`T -> R`"],
        ["`Predicate<T>`", "`T -> boolean`"],
        ["`BiFunction<T, U, R>`", "`(T, U) -> R`"],
      ],
      explanation:
        "These all live in `java.util.function`. Once you know their shapes, signatures like `map(Function)` and `filter(Predicate)` make sense at a glance.",
    },
    {
      id: "d3-15",
      domain: "d3",
      level: "junior",
      lesson: "d3-optional",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        Optional<String> name = Optional.ofNullable(null);
        System.out.println(name.map(String::toUpperCase).orElse("anon"));
      `,
      options: ["`anon`", "`null`", "`NullPointerException`", "`Optional.empty`"],
      answer: [0],
      explanation:
        "`ofNullable(null)` gives an empty Optional. `map` on an empty Optional does nothing and it stays empty, so `orElse` supplies \"anon\".",
    },
    {
      id: "d3-16",
      domain: "d3",
      level: "senior",
      lesson: "d3-optional",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        static String load() { System.out.print("load "); return "db"; }

        Optional<String> cached = Optional.of("cache");
        System.out.println(cached.orElse(load()));
        System.out.println(cached.orElseGet(() -> load()));
      `,
      options: [
        "Line 1: `load cache`, line 2: `cache`",
        "Line 1: `cache`, line 2: `cache`",
        "Line 1: `load cache`, line 2: `load cache`",
        "Line 1: `cache`, line 2: `load cache`",
      ],
      answer: [0],
      explanation:
        "`orElse(load())` passes an ordinary argument, so `load()` runs before `orElse` is even called, and its result is then thrown away. `orElseGet` takes a supplier and only calls it when the Optional is empty. Use `orElseGet` when the fallback is expensive.",
    },
    {
      id: "d3-17",
      domain: "d3",
      level: "junior",
      lesson: "d3-optional",
      type: "lines",
      prompt: "`cache.get(id)` returns null for unknown ids. Tap the line that throws for them.",
      codeLang: "java",
      code: java`
        static Optional<User> find(String id) {
          User u = cache.get(id);
          return Optional.of(u);
        }
      `,
      answer: [3],
      explanation:
        "`Optional.of` throws `NullPointerException` when you give it null. Use `Optional.ofNullable(u)`, which returns `Optional.empty()` for null.",
    },
    {
      id: "d3-18",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-optional",
      prompt: "Which two are good uses of `Optional`? (Choose two.)",
      options: [
        "As a method return type when a result may be absent",
        "Chaining `map`, `filter`, and `orElse` instead of nested null checks",
        "As the type of a field in an entity or DTO",
        "As a method parameter to signal an optional argument",
        "Calling `get()` freely, since Optional prevents NullPointerException",
      ],
      answer: [0, 1],
      explanation:
        "Optional was designed as a return type. As a field, it costs an extra object, isn't `Serializable`, and could itself be null. For parameters, an overload is clearer. And `get()` on an empty Optional throws `NoSuchElementException`.",
    },
    {
      id: "d3-19",
      domain: "d3",
      level: "junior",
      lesson: "d3-records",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        record Point(int x, int y) { }

        var a = new Point(1, 2);
        var b = new Point(1, 2);
        System.out.println(a.equals(b) + " " + (a == b) + " " + a);
      `,
      options: ["`true false Point[x=1, y=2]`", "`false false Point@1b6d3586`", "`true true Point[x=1, y=2]`", "`true false Point(x=1, y=2)`"],
      answer: [0],
      explanation:
        "Records write `equals` and `hashCode` that compare their components, plus a `toString` that looks like `Point[x=1, y=2]`. They're still two separate objects, so `==` is false.",
    },
    {
      id: "d3-20",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-records",
      type: "lines",
      prompt: "Tap the line that doesn't compile.",
      codeLang: "java",
      code: java`
        record Range(int lo, int hi) {
          Range {
            if (lo > hi) throw new IllegalArgumentException();
          }
          void widen() { hi = hi + 1; }
          int size() { return hi - lo; }
        }
      `,
      answer: [5],
      explanation:
        "Record fields are `private final`, so `widen()` can't assign to `hi`. Return a new record instead: `Range widen() { return new Range(lo, hi + 1); }`. The compact constructor on line 2 is fine, and it's the right place for checks like this.",
    },
    {
      id: "d3-21",
      domain: "d3",
      level: "senior",
      lesson: "d3-records",
      prompt: "Why does this switch compile without a `default` branch?",
      codeLang: "java",
      code: java`
        sealed interface Shape permits Circle, Square { }
        record Circle(double r) implements Shape { }
        record Square(double side) implements Shape { }

        static double area(Shape s) {
          return switch (s) {
            case Circle c -> Math.PI * c.r() * c.r();
            case Square q -> q.side() * q.side();
          };
        }
      `,
      options: [
        "`Shape` is sealed, so the compiler knows `Circle` and `Square` are the only cases and can prove the switch is exhaustive",
        "Switch expressions never need a `default` branch",
        "Records can't be null, so no other case is possible",
        "The compiler silently returns 0 for any other shape",
      ],
      answer: [0],
      explanation:
        "The compiler uses the `permits` list to check every case is covered. A switch expression over a type that isn't sealed would need a `default`. (A null `s` still throws `NullPointerException` unless you add `case null`.)",
    },
    {
      id: "d3-22",
      domain: "d3",
      level: "junior",
      lesson: "d3-records",
      type: "match",
      prompt: "Match each modern Java feature to what it does.",
      pairs: [
        ["`record`", "Immutable data carrier with generated equals, hashCode, and toString"],
        ["`sealed ... permits`", "Restricts which classes may extend or implement a type"],
        ["`switch` with type patterns", "Branches on a value's runtime type and binds it to a variable"],
        ["`var`", "Infers a local variable's type from its initializer"],
      ],
      explanation:
        "`var` arrived in Java 10, records in 16, sealed types in 17, and pattern matching for switch in 21. All of them are finished features in Java 21, a long-term support release.",
    },
    {
      id: "d3-23",
      domain: "d3",
      level: "staff",
      lesson: "d3-exceptions",
      prompt: "The data layer throws checked `SQLException`, and it has spread into the signatures of services and controllers across the codebase. What's the standard fix?",
      options: [
        "Catch it at the repository boundary and rethrow a domain-specific unchecked exception that keeps the original as its cause",
        "Declare `throws Exception` on every method so signatures stop changing",
        "Catch it in the repository, log it, and return null",
        "Catch `Throwable` around every call site",
      ],
      answer: [0],
      explanation:
        "Translating exceptions at the boundary keeps database details out of the upper layers, and the cause keeps the full stack trace. Spring's `DataAccessException` family works this way. `throws Exception` hides the real failures, returning null swallows errors, and catching `Throwable` also catches serious `Error`s like running out of memory.",
    },
    {
      id: "d3-24",
      domain: "d3",
      level: "staff",
      lesson: "d3-records",
      prompt: "You're leading a move of a large codebase's data classes to records. Which classes are a poor fit and should stay regular classes?",
      options: [
        "JPA entities, which need a no-arg constructor, mutable fields, and subclass proxies",
        "Immutable API response DTOs",
        "Value objects such as `Money(amount, currency)`",
        "Event payloads published on a message bus",
      ],
      answer: [0],
      explanation:
        "Records are final, have only final fields, and have no no-argument constructor. That clashes with how JPA tools create, change and proxy entities. DTOs, value objects and events are exactly what records were made for.",
    },
    {
      id: "d3-25",
      domain: "d3",
      level: "staff",
      lesson: "d3-streams",
      prompt: "A teammate proposes adding `.parallel()` to every stream in a busy web service \"for free speed\". Which two concerns should you raise? (Choose two.)",
      options: [
        "All parallel streams share the JVM-wide common ForkJoinPool, so one slow or blocking pipeline can starve every other one",
        "For small collections or cheap per-element work, the cost of splitting and merging often makes it slower",
        "Parallel streams can only be used with arrays",
        "`.parallel()` makes `forEach` preserve encounter order",
        "Each element gets its own new OS thread",
      ],
      answer: [0, 1],
      explanation:
        "In a server, request threads already keep the cores busy, and the common pool is shared by everyone. Blocking I/O inside it is especially harmful. Parallel streams pay off for large, CPU-heavy work that splits easily, so measure first. In parallel, `forEach` makes no promise about order (`forEachOrdered` does).",
    },
    {
      id: "d3-26",
      domain: "d3",
      level: "staff",
      lesson: "d3-records",
      prompt: "You add `record Refund(...) implements Payment` to a sealed `Payment` family. Twelve modules switch over `Payment` with switches that cover every case and have no `default`. What happens when they're recompiled, and why is that good?",
      options: [
        "Each of those switches fails to compile until it handles `Refund`, so the compiler lists every place that needs a decision",
        "They compile, and `Refund` silently falls into the first case",
        "They compile, and the compiler inserts a branch that returns null",
        "Nothing changes: sealed hierarchies can't gain new subtypes",
      ],
      answer: [0],
      explanation:
        "The question \"did we handle the new case everywhere?\" becomes a compile error instead of a production bug. Adding `default` everywhere would throw that safety away. Modules compiled against the old version and not rebuilt would throw `MatchException` at runtime, so ship the change and the modules that depend on it together.",
    },
  ],

  cards: [
    { id: "j-optional", domain: "d3", kind: "service", term: "Optional<T>", definition: "A box that may or may not hold a value. Designed as a return type for results that might be missing." },
    { id: "j-orelseget", domain: "d3", kind: "service", term: "Optional.orElseGet", definition: "Gives a fallback value worked out by a Supplier, and only calls it when the Optional is empty." },
    { id: "j-groupingby", domain: "d3", kind: "service", term: "Collectors.groupingBy", definition: "Collects stream items into a Map of lists, grouped by a key you choose, such as length." },
    { id: "j-joining", domain: "d3", kind: "service", term: "Collectors.joining", definition: "Joins stream strings into one, with an optional separator, prefix and suffix." },
    { id: "j-autocloseable", domain: "d3", kind: "service", term: "AutoCloseable", definition: "An interface with a close() method that try-with-resources calls for you." },
    { id: "j-function", domain: "d3", kind: "service", term: "Function<T, R>", definition: "A functional interface that takes a T and gives back an R." },
    { id: "j-predicate", domain: "d3", kind: "service", term: "Predicate<T>", definition: "A functional interface that takes a T and answers true or false. filter uses it." },
    { id: "j-supplier", domain: "d3", kind: "service", term: "Supplier<T>", definition: "A functional interface that takes nothing and produces a T." },
    { id: "j-checked", domain: "d3", kind: "concept", term: "Checked exception", definition: "An Exception subclass (not a RuntimeException) that you must catch or declare with throws." },
    { id: "j-suppressed", domain: "d3", kind: "concept", term: "Suppressed exception", definition: "In try-with-resources, a close() failure that gets attached to the main exception instead of replacing it." },
    { id: "j-lazy-stream", domain: "d3", kind: "concept", term: "Lazy evaluation (streams)", definition: "Intermediate operations only run when a terminal operation starts pulling items through." },
    { id: "j-effectively-final", domain: "d3", kind: "concept", term: "Effectively final", definition: "A local variable that's never reassigned after it's set. Lambdas can only use variables like this." },
    { id: "j-record", domain: "d3", kind: "concept", term: "Record", definition: "A final data class with fields that can't be reassigned. Java writes its accessors, equals, hashCode and toString." },
    { id: "j-sealed", domain: "d3", kind: "concept", term: "Sealed type", definition: "A class or interface that lists exactly which subtypes are allowed." },
  ],

  challenges: [
    {
      id: "ch-java-lazy",
      domain: "d3",
      lesson: "d3-streams",
      title: "Predict the pulls",
      goal: "Predict how many source items the pipeline pulls, then step it to the end and see if you were right.",
      hint: "Count how many items have to pass the filter before limit(2) is happy.",
      takeaway: "Streams pass one item at a time through every stage, and short-circuiting operations like limit stop pulling as soon as they have enough.",
      render: (onSolved) => <StreamStepper goal="predict" onSolved={onSolved} />,
    },
  ],
});
