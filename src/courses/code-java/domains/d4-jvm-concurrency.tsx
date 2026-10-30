import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { java } from "../java";
import { HeapStack, RaceStepper } from "../visuals";

/** Module 4: the JVM, concurrency, and immutability. */
export default defineDomain({
  domain: {
    id: "d4",
    number: 4,
    name: "JVM & Concurrency",
    world: "The Thread Foundry",
    weight: 25,
    emoji: "🧵",
    color: "#34d399",
    summary:
      "The heap and the stack, garbage collection and class loading, race conditions, synchronized and volatile, executors, CompletableFuture, virtual threads, and designing objects that can't change.",
  },

  tasks: [
    {
      id: "4.1",
      title: "Explain the JVM's memory and lifecycle",
      covers: ["The heap and the stack; StackOverflowError and OutOfMemoryError", "GC roots, reachability, generational collection", "Class loading, linking, and initialization"],
    },
    {
      id: "4.2",
      title: "Make shared state thread-safe",
      covers: ["Race conditions and check-then-act", "synchronized, volatile, and happens-before", "Atomic classes, deadlock and lock ordering"],
    },
    {
      id: "4.3",
      title: "Run work concurrently",
      covers: ["ExecutorService and Future", "Composing CompletableFutures, with errors and timeouts", "Virtual threads (Java 21 and later)"],
    },
    {
      id: "4.4",
      title: "Design immutable objects",
      covers: ["final fields, defensive copies, unmodifiable views and true immutability", "Publishing shared state safely"],
    },
  ],

  lessons: [
    {
      id: "d4-start-jvm",
      level: "beginner",
      task: "4.1",
      title: "The JVM: the engine that runs Java",
      check: ["java-b4-01", "java-b4-02"],
      visual: (
        <Flow
          color="#34d399"
          steps={[
            { icon: "📝", label: "Main.java", sub: "The code you write" },
            { icon: "🔧", label: "javac", sub: "Compiles it to bytecode in Main.class" },
            { icon: "⚙️", label: "JVM", sub: "Runs the bytecode on Windows, Mac or Linux" },
          ]}
        />
      ),
      points: [
        "The **JVM** (Java Virtual Machine) is the program that actually runs your Java code. Think of it as a translator that lives on each computer.",
        "The compiler turns your code into **bytecode**, a compact set of instructions that isn't tied to any one kind of computer.",
        "Any computer with a JVM can run the same bytecode. That's the old Java promise: write once, run anywhere.",
        "While your program runs, the JVM also manages memory for you, which you'll see in the next lesson.",
      ],
      tip: "You'll hear \"JDK\" too. The JDK is the developer kit: it includes the compiler `javac` and a JVM to run what you build.",
    },
    {
      id: "d4-start-memory",
      level: "beginner",
      task: "4.1",
      title: "Memory and the garbage collector",
      check: ["java-b4-03", "java-b4-04"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="java"
            code={java`
              StringBuilder sb = new StringBuilder("hi");   // one object
              StringBuilder other = sb;                     // a second name for it
              other.append("!");
              System.out.println(sb);                       // hi!

              sb = null;
              other = null;   // nothing points at the object now: it's garbage
            `}
          />
          <Tiles
            tiles={[
              { icon: "🏷️", title: "Variable", text: "A label that points at an object. Two labels can point at the same one.", color: "#34d399" },
              { icon: "🧹", title: "Garbage collector", text: "Finds objects nothing points at any more and frees their memory.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Every `new` creates an object in a big shared area of memory called the **heap**.",
        "A variable doesn't hold the object itself. It holds a **reference**, like an address that says where the object lives.",
        "When no variable refers to an object any more, nobody can reach it, so it's **garbage**.",
        "The JVM's **garbage collector** clears garbage away for you from time to time, so you never free memory by hand.",
      ],
      tip: "Because two variables can point at one object, changing it through one name shows up through the other. That surprises almost everyone the first time.",
    },
    {
      id: "d4-start-threads",
      level: "beginner",
      task: "4.2",
      title: "Threads: doing two things at once",
      check: ["java-b4-05", "java-b4-06"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="java"
            code={java`
              Thread t = new Thread(() -> System.out.println("worker"));
              t.start();   // the worker begins, alongside main
              t.join();    // main waits here until the worker finishes
              System.out.println("main done");
            `}
          />
          <Tiles
            tiles={[
              { icon: "👩‍🍳", title: "One thread", text: "One cook doing every job in order.", color: "#34d399" },
              { icon: "👩‍🍳👨‍🍳", title: "Two threads", text: "Two cooks working at the same time in the same kitchen.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "A **thread** is one line of work running through your program. Every program starts with one, the `main` thread.",
        "You can start more threads so several jobs happen at the same time, like extra cooks in a kitchen.",
        "`start()` sets a new thread running. `join()` makes the current thread wait until that one has finished.",
        "Threads share the same memory. If two cooks reach for the same bowl at once, things go wrong, which is what the rest of this module is about.",
      ],
      tip: "Call `start()`, not `run()`. Calling `run()` directly just runs the code on the current thread, so nothing happens in parallel.",
    },
    {
      id: "d4-jvm",
      level: "senior",
      task: "4.1",
      title: "Stack, heap, GC, and class loading",
      check: ["d4-01", "d4-03"],
      visual: (
        <div className="grid gap-6">
          <HeapStack />
          <Flow
            color="#34d399"
            steps={[
              { icon: "📥", label: "Loading", sub: "A class loader finds the bytes and creates the Class object" },
              { icon: "🛡️", label: "Verification", sub: "The bytecode is checked for safety" },
              { icon: "🧮", label: "Preparation", sub: "Static fields get default values (0, null)" },
              { icon: "🚦", label: "Initialization", sub: "Static initializers run, the first time the class is really used" },
            ]}
          />
        </div>
      ),
      points: [
        "Each thread has its own **stack** of frames, holding primitives and references. Objects live on the shared **heap**. (The JIT compiler may optimise some objects away, but your code can't tell.)",
        "Recursion that never stops ends in `StackOverflowError`. Too many live objects end in `OutOfMemoryError`.",
        "The garbage collector frees objects that can't be reached from **GC roots** (thread stacks, static fields, JNI references). Cycles don't matter; only reachability does.",
        "G1, HotSpot's default collector, is **generational**. Most objects die young, so frequent clean-ups of young objects are cheap.",
        "Class loaders ask their parent first. A class is initialized the first time it's really used, and reading a compile-time constant doesn't count.",
      ],
      tip: "For memory-leak questions, say \"something reachable is holding on to it\" and name the usual suspects: static maps, caches that never evict, listeners never removed, and ThreadLocals in thread pools.",
    },
    {
      id: "d4-threads",
      level: "senior",
      task: "4.2",
      title: "Races, locks, and visibility",
      sources: [{ title: "Java SE API: Thread", url: "https://docs.oracle.com/en/java/javase/21/docs/api/java.base/java/lang/Thread.html", license: "Official docs (link only)" }],
      check: ["d4-07", "d4-09"],
      visual: (
        <div className="grid gap-6">
          <RaceStepper />
          <CodeCompare
            lang="java"
            left={{
              title: "May loop forever",
              code: java`
                private boolean running = true;

                void run()  { while (running) work(); }
                void stop() { running = false; }
              `,
            }}
            right={{
              title: "Visible to every thread",
              code: java`
                private volatile boolean running = true;
                private final AtomicInteger hits = new AtomicInteger();

                void hit() { hits.incrementAndGet(); }
                synchronized void both() { /* mutual exclusion + visibility */ }
              `,
            }}
          />
        </div>
      ),
      points: [
        "`count++` is three steps: read, add, write. Two threads can interleave those steps and lose an update. That's a **race condition**.",
        "`synchronized` lets only one thread in at a time, and it also makes changes visible: unlocking happens-before the next thread's lock.",
        "`volatile` makes reads and writes of one variable visible to every thread, in order. It doesn't make multi-step actions like `count++` safe.",
        "Check-then-act, as in `if (!map.containsKey(k)) map.put(k, v)`, is a race even on a thread-safe map. Use `computeIfAbsent`.",
        "**Deadlock** needs threads waiting on each other in a circle. Always take multiple locks in one fixed order, or use `tryLock` with a timeout.",
        "For a simple shared counter, `AtomicInteger.incrementAndGet()` is thread-safe without a lock. `AtomicReference` does the same for swapping a whole object reference.",
      ],
      tip: "When you spot shared data that can change in an interview problem, say so out loud and pick a strategy: keep it on one thread, make it immutable, or guard it with a lock.",
    },
    {
      id: "d4-executors",
      level: "senior",
      task: "4.3",
      title: "Executors, CompletableFuture, and virtual threads",
      check: ["d4-14", "d4-16"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="java"
            caption="Java 21: one cheap virtual thread per task. ExecutorService is AutoCloseable (from Java 19), so close() waits for the tasks."
            code={java`
              try (var exec = Executors.newVirtualThreadPerTaskExecutor()) {
                List<Future<String>> pages = urls.stream()
                    .map(u -> exec.submit(() -> http.fetch(u)))   // blocking is fine
                    .toList();
              }

              CompletableFuture<Order> order = CompletableFuture
                  .supplyAsync(() -> api.loadOrder(id), ioPool)
                  .thenCombine(CompletableFuture.supplyAsync(() -> api.loadUser(uid), ioPool), Order::withUser)
                  .orTimeout(2, TimeUnit.SECONDS)
                  .exceptionally(ex -> Order.unavailable());
            `}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🏊", title: "Platform thread pool", text: "A fixed pool sized to the CPU cores, for CPU-heavy work. These are real OS threads, so they're costly and limited.", color: "#38bdf8" },
              { icon: "🪶", title: "Virtual threads", text: "You can have millions. A blocked virtual thread steps off its carrier thread. Best for I/O work. Don't pool them.", color: "#34d399" },
              { icon: "🔗", title: "CompletableFuture", text: "Chain async steps together: thenApply, thenCompose, thenCombine, exceptionally, orTimeout.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Always shut down executors you create, with `shutdown` then `awaitTermination`, or with try-with-resources.",
        "`thenApply` transforms a value. `thenCompose` is for a step that itself returns a CompletableFuture. `thenCombine` joins two futures that run independently.",
        "If you don't pass an executor, async steps run on the shared common ForkJoinPool. Give blocking I/O its own executor.",
        "Virtual threads make waiting cheap; they don't make computing faster. Still limit access to scarce things, like database connections, with a semaphore or the pool itself.",
        "Before JDK 24, blocking inside `synchronized` could pin a virtual thread to its carrier. JDK 24 (JEP 491) removed most of that pinning.",
      ],
      tip: "Asked how big a thread pool should be? For CPU-heavy work, about the number of cores. For I/O work it can be much bigger, and with Java 21 the modern answer is often \"virtual threads plus a limit on the downstream resource\".",
    },
    {
      id: "d4-immutability",
      level: "intermediate",
      task: "4.4",
      title: "Immutable by design",
      check: ["d4-18", "d4-20"],
      visual: (
        <CodeCompare
          lang="java"
          left={{
            title: "Looks immutable, but isn't",
            code: java`
              public final class Schedule {
                private final List<Slot> slots;
                public Schedule(List<Slot> slots) {
                  this.slots = slots;          // caller keeps a handle
                }
                public List<Slot> slots() {
                  return slots;                // caller can mutate
                }
              }
            `,
          }}
          right={{
            title: "Defensive copies",
            code: java`
              public final class Schedule {
                private final List<Slot> slots;
                public Schedule(List<Slot> slots) {
                  this.slots = List.copyOf(slots);
                }
                public List<Slot> slots() {
                  return slots;                // already unmodifiable
                }
              }
            `,
          }}
        />
      ),
      points: [
        "The recipe: a final class (or a private constructor), `private final` fields, no setters, and copies of any changeable objects coming in or going out.",
        "`Collections.unmodifiableList(x)` is a read-only window onto `x`, so changes to `x` still show through it. `List.copyOf(x)` is a true snapshot.",
        "`final` on a reference stops you pointing it at a different object. It doesn't stop the object itself from changing.",
        "Immutable objects are thread-safe without locks. Their final fields are safely visible to other threads once the constructor finishes, as long as `this` doesn't leak out during construction.",
      ],
      tip: "Show the \"with\" pattern: `Money withAmount(BigDecimal a) { return new Money(a, currency); }`. It's how immutable types handle change: you get a new object instead.",
    },
  ],

  questions: [
    // ───────────── Start here ─────────────
    {
      id: "java-b4-01",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-jvm",
      prompt: "What is Java bytecode?",
      options: [
        "The compact instructions `javac` produces, which any JVM can run",
        "The source code you type into `Main.java`",
        "Machine code that only runs on the computer that compiled it",
        "A secret code that hides your program from users",
      ],
      answer: [0],
      explanation:
        "The compiler turns your source code into bytecode and saves it in `.class` files. Bytecode isn't tied to one kind of computer, so the same file runs on any machine that has a JVM.",
    },
    {
      id: "java-b4-02",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-jvm",
      prompt: "You compiled `Main.class` on a Mac. What do you need to run it on a Windows laptop?",
      options: [
        "A JVM installed on the Windows laptop",
        "To rewrite the program for Windows",
        "To compile it again on the Windows laptop",
        "Nothing; Windows runs `.class` files on its own",
      ],
      answer: [0],
      explanation:
        "Bytecode is the same everywhere, but something has to run it. Each computer needs its own JVM, and that JVM takes care of the differences between Mac, Windows and Linux.",
    },
    {
      id: "java-b4-03",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-memory",
      prompt: "When does an object become garbage that the JVM can clean up?",
      options: [
        "When no variable or other live object refers to it any more",
        "As soon as the method that created it is called a second time",
        "After it has existed for one minute",
        "Only when you call `delete` on it",
      ],
      answer: [0],
      explanation:
        "The garbage collector frees objects that nothing can reach. While at least one live variable still points at an object, it's kept. Java has no `delete` keyword; the collector does the cleaning for you.",
    },
    {
      id: "java-b4-04",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-memory",
      type: "output",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        StringBuilder sb = new StringBuilder("hi");
        StringBuilder other = sb;
        other.append("!");
        System.out.println(sb);
      `,
      answers: ["hi!"],
      explanation:
        "There's only one `StringBuilder` here. `other = sb` copies the reference, not the object, so both names point at the same one. Appending through `other` changes that shared object, and printing `sb` shows `hi!`.",
    },
    {
      id: "java-b4-05",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-threads",
      type: "output",
      prompt: "What does this print? Type each line on its own line.",
      codeLang: "java",
      code: java`
        Thread t = new Thread(() -> System.out.println("worker"));
        t.start();
        t.join();
        System.out.println("main done");
      `,
      answers: ["worker\nmain done"],
      explanation:
        "`start()` sets the worker thread running. `join()` makes the main thread wait until the worker has finished, so \"worker\" is always printed first. Only then does main print \"main done\".",
    },
    {
      id: "java-b4-06",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-threads",
      prompt: "What does calling `t.join()` do?",
      options: [
        "Makes the current thread wait until thread `t` has finished",
        "Starts thread `t` running",
        "Merges thread `t` into the main thread so they become one",
        "Stops thread `t` immediately",
      ],
      answer: [0],
      explanation:
        "`join()` means \"wait here for that thread to finish\". It's how you make sure a thread's work is done before you use the result. To start a thread you call `start()`.",
    },
    // ───────────── Interview questions ─────────────
    {
      id: "d4-01",
      domain: "d4",
      level: "junior",
      lesson: "d4-jvm",
      prompt: "Where do `n`, the `sb` reference, and the `StringBuilder` object live while `run()` executes?",
      codeLang: "java",
      code: java`
        void run() {
          int n = 5;
          StringBuilder sb = new StringBuilder("x");
        }
      `,
      options: [
        "`n` and the `sb` reference in the thread's stack frame; the StringBuilder object on the heap",
        "All three on the heap",
        "All three on the stack",
        "`n` on the heap, as a boxed value; `sb` and its StringBuilder object both on the thread's stack",
      ],
      answer: [0],
      explanation:
        "Local variables, both primitives and references, live in the method's stack frame. Objects made with `new` live on the shared heap. The JIT compiler may optimise away an object that never leaves the method, but as far as the language is concerned, objects are on the heap.",
    },
    {
      id: "d4-02",
      domain: "d4",
      level: "junior",
      lesson: "d4-jvm",
      prompt: "What does calling `depth(0)` end with?",
      codeLang: "java",
      code: java`
        static int depth(int n) {
          return depth(n + 1);
        }
      `,
      options: ["`StackOverflowError`", "`OutOfMemoryError: Java heap space`", "It loops forever", "`ArithmeticException` when `n` overflows"],
      answer: [0],
      explanation:
        "Each call adds a new frame to the thread's stack, which has a fixed size, and HotSpot doesn't optimise tail calls away. So the stack runs out long before `n` gets anywhere near overflowing. And integer overflow in Java just wraps around; it never throws.",
    },
    {
      id: "d4-03",
      domain: "d4",
      level: "junior",
      lesson: "d4-jvm",
      prompt: "After line 4, which objects can be garbage collected?",
      codeLang: "java",
      code: java`
        Object a = new Object();   // object #1
        Object b = new Object();   // object #2
        a = b;
        b = null;
      `,
      options: ["Only #1", "Only #2", "Both #1 and #2", "Neither"],
      answer: [0],
      explanation:
        "After `a = b`, nothing points at #1, so it can't be reached. `b = null` removes one reference to #2, but `a` still points at it, so #2 stays alive.",
    },
    {
      id: "d4-04",
      domain: "d4",
      level: "senior",
      lesson: "d4-jvm",
      prompt: "Which two statements about garbage collection in HotSpot are true? (Choose two.)",
      options: [
        "Objects unreachable from GC roots can be collected even if they reference each other in a cycle",
        "The default collector (G1) is generational: most objects die young, so frequent young collections are cheap",
        "`System.gc()` forces an immediate full collection",
        "The JVM uses reference counting to decide what to free",
        "You must set locals to null at the end of a method to avoid leaks",
      ],
      answer: [0, 1],
      explanation:
        "The collector traces outward from the roots, so a cycle that can't be reached is still garbage. `System.gc()` is only a request the JVM can ignore. There's no reference counting, and local variables stop being roots as soon as the method returns.",
    },
    {
      id: "d4-05",
      domain: "d4",
      level: "senior",
      lesson: "d4-jvm",
      type: "order",
      prompt: "Put these steps of getting a class ready to use in order.",
      items: [
        "Loading: a class loader finds the bytes and creates the `Class` object",
        "Verification: the bytecode is checked for safety",
        "Preparation: static fields get default values",
        "Initialization: static initializers and field assignments run",
      ],
      explanation:
        "Verification and preparation together are called linking. After preparation, static fields hold defaults (0, null). They only get their real values during initialization, which happens the first time the class is really used.",
    },
    {
      id: "d4-06",
      domain: "d4",
      level: "senior",
      lesson: "d4-jvm",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        class Config {
          static { System.out.print("init "); }
          static final int MAX = 10;
          static int count = 0;
        }

        System.out.print("start ");
        System.out.print(Config.MAX + " ");
        System.out.print(Config.count);
      `,
      options: ["`start 10 init 0`", "`init start 10 0`", "`start init 10 0`", "`start 10 0`"],
      answer: [0],
      explanation:
        "`MAX` is a compile-time constant (a static final primitive set to a constant), so the compiler copies its value straight in, and reading it doesn't initialize `Config`. Reading `count` does count as real use, so the static block runs first and prints \"init \", then 0 is printed.",
    },
    {
      id: "d4-07",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-threads",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        class Counter { int count = 0; void inc() { count++; } }

        Counter c = new Counter();
        Runnable work = () -> { for (int i = 0; i < 10_000; i++) c.inc(); };
        Thread t1 = new Thread(work), t2 = new Thread(work);
        t1.start(); t2.start();
        t1.join(); t2.join();
        System.out.println(c.count);
      `,
      options: [
        "Some value up to 20000; it can be less because updates get lost",
        "Always exactly 20000",
        "Always exactly 10000",
        "It throws a `ConcurrentModificationException` at once",
      ],
      answer: [0],
      explanation:
        "`count++` reads, adds and writes. If both threads read the same value before either writes, one of the increments is lost. Fix it with `synchronized`, an `AtomicInteger`, or a `LongAdder` for counters many threads hammer at once.",
    },
    {
      id: "d4-08",
      domain: "d4",
      level: "senior",
      lesson: "d4-threads",
      type: "lines",
      prompt: "Two threads can both create a `Service` for the same name. Tap the two lines that form the non-atomic check-then-act.",
      codeLang: "java",
      code: java`
        class Registry {
          private final Map<String, Service> cache = new ConcurrentHashMap<>();

          Service get(String name) {
            if (!cache.containsKey(name)) {
              cache.put(name, Service.create(name));
            }
            return cache.get(name);
          }
        }
      `,
      answer: [5, 6],
      explanation:
        "Each call is thread-safe on its own, but another thread can run between the check and the put. Replace both with one atomic call: `return cache.computeIfAbsent(name, Service::create);`.",
    },
    {
      id: "d4-09",
      domain: "d4",
      level: "senior",
      lesson: "d4-threads",
      type: "lines",
      prompt: "Calling `stop()` from another thread may never end the loop. Tap the line to change.",
      codeLang: "java",
      code: java`
        class Worker implements Runnable {
          private boolean running = true;

          public void run() {
            while (running) {
              doWork();
            }
          }

          public void stop() { running = false; }
        }
      `,
      answer: [2],
      explanation:
        "Without `volatile` or a lock, nothing guarantees the worker thread ever sees the write. The JIT may even move the read out of the loop entirely. `private volatile boolean running = true;` makes the change visible.",
    },
    {
      id: "d4-10",
      domain: "d4",
      level: "senior",
      lesson: "d4-threads",
      prompt: "Which two statements are true? (Choose two.)",
      options: [
        "A write to a `volatile` field is visible to every thread that reads that field afterwards",
        "`synchronized` provides both mutual exclusion and visibility",
        "With `volatile int count`, the statement `count++` is atomic",
        "Two threads calling a `synchronized` instance method on different objects block each other",
        "`volatile` can be applied to methods",
      ],
      answer: [0, 1],
      explanation:
        "`volatile` covers visibility and ordering for single reads and writes, but `count++` is still three steps. Synchronized instance methods lock `this`, so different objects don't block each other (static synchronized methods lock the class). And `volatile` only goes on fields.",
    },
    {
      id: "d4-11",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-threads",
      prompt: "Thread 1 and Thread 2 run these at the same time. What's the risk, and the standard fix?",
      codeLang: "java",
      code: java`
        // Thread 1: transfer from a to b
        synchronized (a) { synchronized (b) { move(a, b); } }

        // Thread 2: transfer from b to a
        synchronized (b) { synchronized (a) { move(b, a); } }
      `,
      options: [
        "Deadlock; always acquire the locks in one global order (for example by account id)",
        "A lost update; make the fields volatile",
        "Livelock; add `Thread.sleep` between the two locks",
        "No risk at all: nested synchronized blocks are always safe in Java code",
      ],
      answer: [0],
      explanation:
        "Each thread holds one lock and waits for the other's, so they wait in a circle forever. Taking locks in a consistent order, such as lower account id first, breaks the circle. `ReentrantLock.tryLock` with a timeout is another way out.",
    },
    {
      id: "d4-12",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-threads",
      prompt: "Which change makes `Counter.inc()` thread-safe without using a lock?",
      options: [
        "Replace `int count` with an `AtomicInteger` and call `count.incrementAndGet()`",
        "Mark `count` as `volatile`",
        "Make `inc()` a static method",
        "Write `count += 1` instead of `count++`, since a compound assignment is a single bytecode step",
      ],
      answer: [0],
      explanation:
        "Atomic classes use a hardware compare-and-swap to do the read, add and write as one step. `volatile` on its own doesn't make `++` atomic, and `+= 1` is the same three steps.",
    },
    {
      id: "d4-13",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-executors",
      type: "order",
      prompt: "Put the lines in order to run a task on a pool and shut it down cleanly.",
      items: [
        "`ExecutorService pool = Executors.newFixedThreadPool(4);`",
        "`Future<Integer> f = pool.submit(() -> compute());`",
        "`pool.shutdown();`",
        "`pool.awaitTermination(1, TimeUnit.MINUTES);`",
      ],
      explanation:
        "Create the pool, submit the task, then call `shutdown()` so it stops taking new tasks but finishes queued ones, and `awaitTermination` to wait. Forget to shut down and its threads keep the JVM running. From Java 19 you can use try-with-resources instead, and its `close()` does the same.",
    },
    {
      id: "d4-14",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-executors",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        CompletableFuture<Integer> f = CompletableFuture.supplyAsync(() -> 2)
            .thenApply(x -> x * 10)
            .thenCombine(CompletableFuture.supplyAsync(() -> 3), Integer::sum);
        System.out.println(f.join());
      `,
      options: ["`23`", "`50`", "`20`", "`5`"],
      answer: [0],
      explanation:
        "`thenApply` turns 2 into 20. `thenCombine` waits for both futures and adds 20 and 3. `join()` waits until the result is ready, then prints 23.",
    },
    {
      id: "d4-15",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-executors",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        int r = CompletableFuture.supplyAsync(() -> 10 / 0)
            .thenApply(x -> x + 1)
            .exceptionally(ex -> -1)
            .join();
        System.out.println(r);
      `,
      options: ["`-1`", "`0`", "It throws `ArithmeticException` from `join()`", "`1`"],
      answer: [0],
      explanation:
        "The division throws, so the future finishes with an error. `thenApply` is skipped, and `exceptionally` recovers with -1. Without `exceptionally`, `join()` would throw a `CompletionException` wrapping the `ArithmeticException`.",
    },
    {
      id: "d4-16",
      domain: "d4",
      level: "senior",
      lesson: "d4-executors",
      prompt: "What are Java 21 virtual threads best suited for?",
      options: [
        "Many concurrent tasks that mostly wait on I/O, such as one thread per HTTP request, because a blocked virtual thread frees its carrier thread",
        "Making CPU-bound number crunching run faster than the number of cores allows, since each virtual thread gets its own slice of a CPU and they all run in parallel at once",
        "Replacing `synchronized` with lock-free code automatically",
        "Running Java code on the GPU",
      ],
      answer: [0],
      explanation:
        "Virtual threads are cheap to create and to park while they wait, so simple one-thread-per-request code can handle huge numbers of requests. They don't add CPU power, though: for CPU-heavy work, a pool sized to the cores is still right.",
    },
    {
      id: "d4-17",
      domain: "d4",
      level: "senior",
      lesson: "d4-executors",
      prompt: "Which two statements about virtual threads are true? (Choose two.)",
      options: [
        "`Executors.newVirtualThreadPerTaskExecutor()` starts a new virtual thread for each submitted task",
        "You shouldn't pool virtual threads; create one per task",
        "Each virtual thread is backed by its own dedicated OS thread",
        "Virtual threads make CPU-bound code run faster",
        "Using them requires rewriting code in a callback style",
      ],
      answer: [0, 1],
      explanation:
        "Many virtual threads share a small pool of carrier (platform) threads, and they're so cheap that pooling them is pointless. You keep writing ordinary blocking code, which is the whole point.",
    },
    {
      id: "d4-18",
      domain: "d4",
      level: "senior",
      lesson: "d4-immutability",
      type: "lines",
      prompt: "`Period` looks immutable, but a caller can still change it. Tap the two lines that let them.",
      codeLang: "java",
      code: java`
        public final class Period {
          private final Date start;
          private final Date end;

          public Period(Date start, Date end) {
            this.start = start;
            this.end = end;
          }

          public Date start() { return new Date(start.getTime()); }
          public Date end() { return new Date(end.getTime()); }
        }
      `,
      answer: [6, 7],
      explanation:
        "The getters hand out copies, but the constructor keeps the caller's own `Date` objects, so the caller can call `setTime` on them later. Copy on the way in too: `this.start = new Date(start.getTime());`. Better still, use `java.time.Instant`, which can't change.",
    },
    {
      id: "d4-19",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-immutability",
      prompt: "Which two are part of making a class immutable? (Choose two.)",
      options: [
        "Make all fields `private final`",
        "Make defensive copies of mutable objects passed in or handed out",
        "Mark every method `synchronized`",
        "Make every field `volatile`",
        "Provide setters that update `this` and return it for chaining",
      ],
      answer: [0, 1],
      explanation:
        "Immutability means the state never changes: final fields, no setters, copies at the edges, and a final class so subclasses can't sneak in changes. Locks and `volatile` are tools for shared data that does change, which an immutable object doesn't have.",
    },
    {
      id: "d4-20",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-immutability",
      prompt: "What does this print?",
      codeLang: "java",
      code: java`
        List<String> src = new ArrayList<>(List.of("a"));
        List<String> view = Collections.unmodifiableList(src);
        List<String> copy = List.copyOf(src);
        src.add("b");
        System.out.println(view.size() + " " + copy.size());
      `,
      options: ["`2 1`", "`1 1`", "`2 2`", "It throws `UnsupportedOperationException`"],
      answer: [0],
      explanation:
        "An unmodifiable view blocks changes made through it, but it still shows changes made to the list underneath. `List.copyOf` takes a snapshot. `src` itself is a normal ArrayList, so `add` works.",
    },
    {
      id: "d4-21",
      domain: "d4",
      level: "junior",
      lesson: "d4-immutability",
      prompt: "Why are immutable objects thread-safe without any locking?",
      options: [
        "Their state can't change after construction, so threads can share them freely and never see a half-updated object",
        "The JVM automatically synchronizes every method of a final class, so threads take turns using each object",
        "They're stored on each thread's stack, so they're never shared",
        "The garbage collector copies them for each thread",
      ],
      answer: [0],
      explanation:
        "A race needs someone writing. With no writes after construction, and final fields that Java guarantees are visible once the constructor finishes, there's nothing to race over.",
    },
    {
      id: "d4-22",
      domain: "d4",
      level: "staff",
      lesson: "d4-executors",
      prompt: "You're moving a blocking-I/O service from a 200-thread pool to virtual threads. The database pool has 50 connections. What must you add as part of the move?",
      options: [
        "A limit on concurrent database work (a `Semaphore`, or relying on the connection pool's wait with a timeout), because the 200-thread cap that used to throttle load is gone",
        "A fixed pool of 200 virtual threads, to keep the old behaviour, plus `synchronized` around each database call so that only one virtual thread at a time can pin its carrier while it waits on the network",
        "Nothing: virtual threads make the database faster",
        "A larger `-Xss` stack size",
      ],
      answer: [0],
      explanation:
        "The old pool size was quietly acting as a limit. With a virtual thread per request, thousands of requests can hit the database at once, so make the limit explicit. Pooling virtual threads defeats their purpose, and they don't change how much the database can handle.",
    },
    {
      id: "d4-23",
      domain: "d4",
      level: "staff",
      lesson: "d4-jvm",
      prompt: "A production service's heap usage climbs for days, then it dies with `OutOfMemoryError`. Which two are the right first steps? (Choose two.)",
      options: [
        "Capture a heap dump (`-XX:+HeapDumpOnOutOfMemoryError` or `jcmd <pid> GC.heap_dump`) and find what retains the most memory",
        "Look for unbounded caches, static collections, or listeners that only ever grow",
        "Raise `-Xmx` and close the ticket",
        "Call `System.gc()` on a timer",
        "Switch to the Serial collector",
      ],
      answer: [0, 1],
      explanation:
        "Steady growth until it crashes means something reachable keeps piling up objects. That's a leak, not a GC problem. A heap dump shows you what's holding on to the memory. More heap only delays the crash, and `System.gc()` can't free objects that are still reachable, whatever collector you use.",
    },
    {
      id: "d4-24",
      domain: "d4",
      level: "staff",
      lesson: "d4-executors",
      prompt: "Request handlers call a slow downstream API through `CompletableFuture.supplyAsync(...)` with no executor. When the downstream stalls, requests hang and unrelated async work slows down too. What's the best fix?",
      options: [
        "Add a timeout to each call (`orTimeout` or `completeOnTimeout`, Java 9+) and run the blocking calls on a dedicated, bounded executor instead of the common pool",
        "Use `join()` instead of `get()`",
        "Raise the common pool's parallelism to 1000",
        "Retry immediately in a tight loop until the call succeeds, and raise the common pool's parallelism to a few hundred threads so the blocked tasks no longer starve the other work in the service",
      ],
      answer: [0],
      explanation:
        "Blocking calls on the shared common pool starve everything else that uses it, and with no timeout a stalled service hangs callers forever. Give the calls their own walled-off executor and cap how long they can wait. Switching between `join` and `get` only changes the exception type, and tight retries make an outage worse.",
    },
    {
      id: "d4-25",
      domain: "d4",
      level: "staff",
      lesson: "d4-immutability",
      prompt: "Configuration is read by every request thread and reloaded from a file every minute. What's the simplest correct design?",
      options: [
        "On reload, build a new immutable `Config` and publish it through one `volatile` field (or an `AtomicReference`); readers just read that reference",
        "Keep one mutable `Config` and make every getter `synchronized`",
        "Store each setting in a `ConcurrentHashMap` and update the keys one by one",
        "Give each thread its own copy in a `ThreadLocal`, refreshed on its next request, so every reader always sees a consistent config",
      ],
      answer: [0],
      explanation:
        "Swapping one reference to a snapshot that can't change is atomic, needs no locks for readers, and every reader sees a consistent config. Updating keys one at a time lets a reader see half old and half new settings. Locking every getter slows everyone down, and ThreadLocal copies drift apart and leak in thread pools.",
    },
  ],

  cards: [
    { id: "j-executorservice", domain: "d4", kind: "service", term: "ExecutorService", definition: "Runs the tasks you submit on threads it manages for you. Shut it down when you're done." },
    { id: "j-completablefuture", domain: "d4", kind: "service", term: "CompletableFuture", definition: "A result that arrives later, which you can chain with thenApply, thenCompose, thenCombine and exceptionally." },
    { id: "j-atomicinteger", domain: "d4", kind: "service", term: "AtomicInteger", definition: "An int that threads can update safely without a lock, using incrementAndGet and compareAndSet." },
    { id: "j-vt-executor", domain: "d4", kind: "service", term: "Executors.newVirtualThreadPerTaskExecutor()", definition: "Starts a new virtual thread for every task you submit (Java 21)." },
    { id: "j-reentrantlock", domain: "d4", kind: "service", term: "ReentrantLock", definition: "A lock you take and release yourself, with extras like tryLock, timeouts and fairness." },
    { id: "j-countdownlatch", domain: "d4", kind: "service", term: "CountDownLatch", definition: "Lets threads wait until a counter has been counted down to zero." },
    { id: "j-list-copyof", domain: "d4", kind: "service", term: "List.copyOf", definition: "Makes an unmodifiable snapshot of a collection. Later changes to the original don't show up in it." },
    { id: "j-heap-stack", domain: "d4", kind: "concept", term: "Heap and stack", definition: "Objects live on the shared heap. Each thread has its own stack, holding a frame of local variables for each method call." },
    { id: "j-gc-roots", domain: "d4", kind: "concept", term: "GC roots", definition: "Where the garbage collector starts looking for live objects: thread stacks, static fields and JNI references." },
    { id: "j-generational", domain: "d4", kind: "concept", term: "Generational GC", definition: "Cleans up young objects often, because most objects die young, and older ones less often." },
    { id: "j-class-init", domain: "d4", kind: "concept", term: "Class initialization", definition: "A class's static initializers run the first time the class is really used." },
    { id: "j-volatile", domain: "d4", kind: "concept", term: "volatile", definition: "A field modifier that makes reads and writes visible to all threads, in order. It doesn't make multi-step updates atomic." },
    { id: "j-happens-before", domain: "d4", kind: "concept", term: "Happens-before", definition: "The Java Memory Model rule that guarantees one action's effects are visible to another." },
    { id: "j-deadlock", domain: "d4", kind: "concept", term: "Deadlock", definition: "Threads each holding a lock the other needs, so all of them wait forever. Prevent it by always taking locks in the same order." },
    { id: "j-virtual-thread", domain: "d4", kind: "concept", term: "Virtual thread", definition: "A lightweight thread managed by the JVM. While it's blocked, it steps off its carrier thread so others can run." },
    { id: "j-immutable", domain: "d4", kind: "concept", term: "Immutable object", definition: "An object whose state is fixed when it's built. Threads can share it safely without locks." },
  ],

  challenges: [
    {
      id: "ch-java-lost-update",
      domain: "d4",
      lesson: "d4-threads",
      title: "Lose an update",
      goal: "With synchronized off, interleave the threads so both finish but count ends at 1.",
      hint: "Let both threads read before either one writes.",
      takeaway: "count++ is three steps. Without a lock or an atomic, two threads can read the same value and one increment vanishes. Turn synchronized on and try again: the second thread now has to wait.",
      render: (onSolved) => <RaceStepper goal="lost" onSolved={onSolved} />,
    },
  ],
});
