import { CodeBlock, CodeCompare, Layers, Tiles } from "@/components/learn/blocks";
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
    summary: "Checked vs unchecked exceptions, try-with-resources, lambdas and lazy streams, Optional, and records, sealed types, and pattern matching from Java 16–21.",
  },

  tasks: [
    {
      id: "3.1",
      title: "Handle errors and resources",
      covers: ["The Throwable hierarchy; checked vs unchecked", "finally semantics", "try-with-resources, close order, suppressed exceptions", "Exception strategy across layers"],
    },
    {
      id: "3.2",
      title: "Write functional-style code",
      covers: ["Functional interfaces, lambdas, method references, effectively final", "Stream laziness, intermediate vs terminal operations, collectors", "Optional: when and how to use it"],
    },
    {
      id: "3.3",
      title: "Model data with modern Java",
      covers: ["Records and compact constructors", "Sealed classes and interfaces", "Pattern matching for instanceof and switch"],
    },
  ],

  lessons: [
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
              title: "Always closed, even on exceptions",
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
        "Checked exceptions (subclasses of `Exception` but not `RuntimeException`) must be caught or declared with `throws`.",
        "`finally` runs whether the try returns, throws, or completes; a return value computed in `try` is saved before `finally` runs.",
        "try-with-resources works with any `AutoCloseable` and closes resources in reverse order of declaration.",
        "Catch specific exceptions first: a subclass `catch` after its superclass doesn't compile.",
        "At layer boundaries, wrap low-level checked exceptions in a meaningful unchecked one and keep the cause.",
      ],
      tip: "Never write an empty catch block in an interview. At minimum log it or rethrow; say out loud why you're catching.",
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
        "Intermediate operations (`filter`, `map`, `sorted`) are lazy; nothing runs until a terminal operation (`toList`, `collect`, `forEach`, `findFirst`).",
        "Elements flow one at a time through the whole pipeline, and short-circuiting operations (`findFirst`, `limit`, `anyMatch`) stop early.",
        "A stream can be consumed once; reusing it throws `IllegalStateException`.",
        "Lambdas can only capture local variables that are final or effectively final.",
        "Parallel streams use the shared common ForkJoinPool: measure before using them, and never block inside them.",
      ],
      tip: "Read a stream pipeline aloud as a sentence: 'take people, keep adults, map to names, sort, join with commas'. It shows you understand the order of operations.",
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
            title: "Optional pipeline",
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
        "`Optional.of(x)` throws on null; `Optional.ofNullable(x)` gives an empty Optional instead.",
        "`map` on an empty Optional skips the function and stays empty.",
        "`orElse(value)` always evaluates its argument; `orElseGet(supplier)` only calls it when empty.",
        "Use Optional as a return type for 'may be absent'. Avoid it for fields, parameters, and collections (return an empty list instead).",
        "`get()` without checking is just a NullPointerException with extra steps; prefer `orElseThrow()` to make the intent explicit.",
      ],
      tip: "If asked 'should this field be Optional?', the expected answer is usually no: Optional was designed as a return type.",
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
          caption="A closed hierarchy plus an exhaustive switch: add a new subtype and the compiler lists every switch you must update."
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
        "A record generates a canonical constructor, private final fields, accessors (`r()`, not `getR()`), `equals`, `hashCode`, and `toString`.",
        "Records are final and shallowly immutable: a record holding a `List` should copy it (`List.copyOf`) in the compact constructor.",
        "`sealed ... permits` fixes the set of subtypes; permitted subclasses must be `final`, `sealed`, or `non-sealed`.",
        "Pattern matching (`o instanceof Point p`, `switch` with type and record patterns) is final in Java 21; a switch over a sealed type can be exhaustive with no `default`.",
      ],
      tip: "Records are the modern answer to 'write an immutable value class'. Mention that they also fix the equals/hashCode question for free.",
    },
  ],

  questions: [
    {
      id: "d3-01",
      domain: "d3",
      level: "junior",
      lesson: "d3-exceptions",
      prompt: "Which of these is a checked exception?",
      options: ["`IOException`", "`IllegalArgumentException`", "`NullPointerException`", "`ArrayIndexOutOfBoundsException`"],
      answer: [0],
      explanation: "`IOException` extends `Exception` directly, so the compiler forces you to catch or declare it. The other three extend `RuntimeException` and are unchecked.",
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
      explanation: "The `finally` block runs before `f()` actually returns, so \"finally \" is printed first. Then `println` prints the returned 1.",
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
      explanation: "The value of `x` (1) is saved as the return value when `return x` executes. Changing the local `x` in `finally` doesn't change the saved value. (A `return` inside `finally` would override it, which is why that's considered bad practice.)",
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
      explanation: "Resources are opened in declaration order and closed in reverse order, after the body finishes, just like nested try/finally blocks.",
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
      explanation: "Declare the reader in the header: `try (BufferedReader r = Files.newBufferedReader(p)) { return r.readLine(); }`. It's then closed on every path, including exceptions, and the explicit `close()` goes away.",
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
      explanation: "The body's exception wins and the close failure is available via `getSuppressed()`. Closing happens on every path, in reverse order, and `catch`/`finally` blocks are allowed (they run after the resources are closed).",
    },
    {
      id: "d3-07",
      domain: "d3",
      level: "junior",
      lesson: "d3-exceptions",
      type: "lines",
      prompt: "Tap the line that does not compile.",
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
      explanation: "`FileNotFoundException` is a subclass of `IOException`, which was already caught, so the second catch is unreachable and the compiler rejects it. Put the more specific catch first.",
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
      explanation: "Streams are lazy and pull one element at a time. 1 fails the filter, 2 passes, and `findFirst` short-circuits, so 3 and 4 are never evaluated.",
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
      explanation: "`map` is an intermediate operation. Without a terminal operation like `toList()` or `forEach`, the pipeline never runs, so the lambda is never called.",
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
      explanation: "A stream is single-use: after a terminal operation it is consumed. To iterate twice, keep the source (e.g. a List) and call `stream()` again, or use a `Supplier<Stream<T>>`.",
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
      explanation: "`groupingBy` puts each element into a list under its key, preserving encounter order within each group: \"hi\" and \"yo\" both have length 2. Use `groupingBy(f, counting())` if you want counts instead.",
    },
    {
      id: "d3-12",
      domain: "d3",
      level: "junior",
      lesson: "d3-streams",
      type: "lines",
      prompt: "Tap the line that does not compile.",
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
      explanation: "Lambdas can only use local variables that are final or effectively final, and `count++` modifies one. Use `names.size()`, a stream `count()`, or an `AtomicInteger` if you truly need a mutable counter.",
    },
    {
      id: "d3-13",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-streams",
      type: "order",
      prompt: "`Person` is a record with `name()` and `age()` that does not implement `Comparable`. Arrange the pipeline to return the adults' names, sorted, joined by \", \".",
      items: ["`people.stream()`", "`.filter(p -> p.age() >= 18)`", "`.map(Person::name)`", "`.sorted()`", "`.collect(Collectors.joining(\", \"))`"],
      explanation: "Filter while you still have the `Person` (after `map` the age is gone), map to names, then sort: Strings are Comparable but `Person` isn't, so `sorted()` before `map` would throw `ClassCastException`. The terminal `collect` comes last.",
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
      explanation: "These live in `java.util.function`. Knowing the shapes lets you read signatures like `map(Function)` and `filter(Predicate)` at a glance.",
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
      explanation: "`ofNullable(null)` is an empty Optional. `map` on an empty Optional does nothing and stays empty, so `orElse` supplies \"anon\".",
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
      explanation: "`orElse(load())` is an ordinary method argument, so `load()` runs before `orElse` is even called, though its result is discarded. `orElseGet` takes a supplier and calls it only when the Optional is empty. Use `orElseGet` when the fallback is expensive.",
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
      explanation: "`Optional.of` throws `NullPointerException` when given null. Use `Optional.ofNullable(u)`, which returns `Optional.empty()` for null.",
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
      explanation: "Optional was designed as a return type. As a field it adds an allocation, isn't `Serializable`, and still might itself be null; as a parameter, overloading is clearer. `get()` on an empty Optional throws `NoSuchElementException`.",
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
      explanation: "Records generate value-based `equals` and `hashCode` from their components, and a `toString` in the form `Point[x=1, y=2]`. They're still two separate objects, so `==` is false.",
    },
    {
      id: "d3-20",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-records",
      type: "lines",
      prompt: "Tap the line that does not compile.",
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
      explanation: "Record fields are `private final`, so `widen()` can't assign to `hi`. Return a new record instead: `Range widen() { return new Range(lo, hi + 1); }`. The compact constructor on line 2 is valid and is the right place for validation.",
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
      explanation: "Exhaustiveness checking uses the `permits` list. A switch expression over a non-sealed type would need `default`. (A null `s` still throws `NullPointerException` unless you add `case null`.)",
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
      explanation: "`var` (Java 10), records (16), sealed types (17), and pattern matching for switch (21) are all final features in Java 21 LTS.",
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
      explanation: "Translating exceptions at the boundary keeps the persistence detail from leaking into upper layers while preserving the stack trace via the cause (this is what Spring's `DataAccessException` hierarchy does). `throws Exception` hides real failure modes, returning null swallows errors, and catching `Throwable` also catches `Error`s like OOM.",
    },
    {
      id: "d3-24",
      domain: "d3",
      level: "staff",
      lesson: "d3-records",
      prompt: "You're leading a migration of a large codebase's data classes to records. Which classes are a poor fit and should stay regular classes?",
      options: [
        "JPA entities, which need a no-arg constructor, mutable fields, and subclass proxies",
        "Immutable API response DTOs",
        "Value objects such as `Money(amount, currency)`",
        "Event payloads published on a message bus",
      ],
      answer: [0],
      explanation: "Records are final, have only final fields, and have no no-arg constructor, which conflicts with how JPA providers create, mutate, and proxy entities. DTOs, value objects, and events are exactly what records were designed for.",
    },
    {
      id: "d3-25",
      domain: "d3",
      level: "staff",
      lesson: "d3-streams",
      prompt: "A teammate proposes adding `.parallel()` to every stream in a busy web service 'for free speed'. Which two concerns should you raise? (Choose two.)",
      options: [
        "All parallel streams share the JVM-wide common ForkJoinPool, so one slow or blocking pipeline can starve every other one",
        "For small collections or cheap per-element work, the cost of splitting and merging often makes it slower",
        "Parallel streams can only be used with arrays",
        "`.parallel()` makes `forEach` preserve encounter order",
        "Each element gets its own new OS thread",
      ],
      answer: [0, 1],
      explanation: "In a server, request threads already keep the cores busy, and the common pool is a shared resource; blocking I/O inside it is especially harmful. Parallelism pays off for large, CPU-bound, easily splittable work, so measure first. `forEach` makes no order promise in parallel (`forEachOrdered` does).",
    },
    {
      id: "d3-26",
      domain: "d3",
      level: "staff",
      lesson: "d3-records",
      prompt: "You add `record Refund(...) implements Payment` to a sealed `Payment` hierarchy. Twelve modules switch over `Payment` with exhaustive switches and no `default`. What happens when they're recompiled, and why is that desirable?",
      options: [
        "Each of those switches fails to compile until it handles `Refund`, so the compiler lists every place that needs a decision",
        "They compile, and `Refund` silently falls into the first case",
        "They compile, and the compiler inserts a branch that returns null",
        "Nothing changes: sealed hierarchies can't gain new subtypes",
      ],
      answer: [0],
      explanation: "Exhaustiveness turns 'did we handle the new case everywhere?' into a compile error instead of a production bug. Adding `default` everywhere would throw that safety away. Modules compiled against the old hierarchy and not rebuilt would throw `MatchException` at runtime, so ship the change and the dependent modules together.",
    },
  ],

  cards: [
    { id: "j-optional", domain: "d3", kind: "service", term: "Optional<T>", definition: "Container that may hold a value; designed as a return type for 'maybe absent'" },
    { id: "j-orelseget", domain: "d3", kind: "service", term: "Optional.orElseGet", definition: "Fallback computed lazily by a Supplier, only when empty" },
    { id: "j-groupingby", domain: "d3", kind: "service", term: "Collectors.groupingBy", definition: "Collects stream elements into a Map of lists keyed by a classifier" },
    { id: "j-joining", domain: "d3", kind: "service", term: "Collectors.joining", definition: "Concatenates stream strings with a delimiter, prefix, and suffix" },
    { id: "j-autocloseable", domain: "d3", kind: "service", term: "AutoCloseable", definition: "Interface whose close() try-with-resources calls automatically" },
    { id: "j-function", domain: "d3", kind: "service", term: "Function<T, R>", definition: "Functional interface taking a T and returning an R" },
    { id: "j-predicate", domain: "d3", kind: "service", term: "Predicate<T>", definition: "Functional interface returning boolean; used by filter" },
    { id: "j-supplier", domain: "d3", kind: "service", term: "Supplier<T>", definition: "Functional interface with no input that produces a T" },
    { id: "j-checked", domain: "d3", kind: "concept", term: "Checked exception", definition: "Exception subclass (not RuntimeException) that must be caught or declared" },
    { id: "j-suppressed", domain: "d3", kind: "concept", term: "Suppressed exception", definition: "A close() failure attached to the main exception in try-with-resources" },
    { id: "j-lazy-stream", domain: "d3", kind: "concept", term: "Lazy evaluation (streams)", definition: "Intermediate operations run only when a terminal operation pulls elements" },
    { id: "j-effectively-final", domain: "d3", kind: "concept", term: "Effectively final", definition: "A local never reassigned after initialization; required for lambda capture" },
    { id: "j-record", domain: "d3", kind: "concept", term: "Record", definition: "Final, shallowly immutable data class with generated accessors, equals, hashCode, toString" },
    { id: "j-sealed", domain: "d3", kind: "concept", term: "Sealed type", definition: "Class or interface that lists its only permitted subtypes" },
  ],

  challenges: [
    {
      id: "ch-java-lazy",
      domain: "d3",
      lesson: "d3-streams",
      title: "Predict the pulls",
      goal: "Predict how many source elements the pipeline pulls, then step it to the end and be right.",
      hint: "Count how many elements must pass the filter before limit(2) is satisfied.",
      takeaway: "Streams process one element at a time through every stage, and short-circuiting operations like limit stop pulling as soon as they're satisfied.",
      render: (onSolved) => <StreamStepper goal="predict" onSolved={onSolved} />,
    },
  ],
});
