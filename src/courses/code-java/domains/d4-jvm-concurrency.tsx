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
    summary: "Heap vs stack, garbage collection and class loading, races, synchronized and volatile, executors, CompletableFuture, virtual threads, and immutable design.",
  },

  tasks: [
    {
      id: "4.1",
      title: "Explain the JVM's memory and lifecycle",
      covers: ["Heap vs stack; StackOverflowError vs OutOfMemoryError", "GC roots, reachability, generational collection", "Class loading, linking, and initialization"],
    },
    {
      id: "4.2",
      title: "Make shared state thread-safe",
      covers: ["Race conditions and check-then-act", "synchronized, volatile, and happens-before", "Atomic classes, deadlock and lock ordering"],
    },
    {
      id: "4.3",
      title: "Run work concurrently",
      covers: ["ExecutorService and Future", "CompletableFuture composition, errors, and timeouts", "Virtual threads (Java 21+)"],
    },
    {
      id: "4.4",
      title: "Design immutable objects",
      covers: ["final fields, defensive copies, unmodifiable vs immutable", "Safe publication of shared state"],
    },
  ],

  lessons: [
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
              { icon: "🛡️", label: "Verification", sub: "Bytecode is checked for safety" },
              { icon: "🧮", label: "Preparation", sub: "Static fields get default values (0, null)" },
              { icon: "🚦", label: "Initialization", sub: "Static initializers run, on first active use" },
            ]}
          />
        </div>
      ),
      points: [
        "Each thread has its own stack of frames holding primitives and references. Objects live on the shared heap. (The JIT may optimise non-escaping objects away, but that's invisible to your code.)",
        "Unbounded recursion ends in `StackOverflowError`; too many live objects end in `OutOfMemoryError`.",
        "The GC frees objects unreachable from GC roots (thread stacks, static fields, JNI refs). Cycles don't matter; reachability does.",
        "G1, HotSpot's default collector, is generational: most objects die young, so frequent young collections are cheap.",
        "Class loaders delegate to their parent first. A class is initialized on first active use; reading a compile-time constant doesn't count.",
      ],
      tip: "For memory-leak questions, say 'something reachable is holding on to it' and name the usual suspects: static maps, caches without eviction, listeners never removed, ThreadLocals in pools.",
    },
    {
      id: "d4-threads",
      level: "senior",
      task: "4.2",
      title: "Races, locks, and visibility",
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
        "`count++` is read, add, write: two threads can interleave and lose an update.",
        "`synchronized` gives mutual exclusion and visibility: unlocking a monitor happens-before the next lock of it.",
        "`volatile` gives visibility and ordering for a single variable, but not atomicity of compound actions.",
        "Check-then-act (`if (!map.containsKey(k)) map.put(k, v)`) is a race even on a thread-safe map; use `computeIfAbsent`.",
        "Deadlock needs circular waiting: acquire multiple locks in one global order, or use `tryLock` with a timeout.",
      ],
      tip: "When you spot shared mutable state in an interview problem, say so out loud and pick a strategy: confine it, make it immutable, or guard it.",
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
            caption="Java 21: one cheap virtual thread per task. ExecutorService is AutoCloseable (Java 19+), so close() waits for the tasks."
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
              { icon: "🏊", title: "Platform thread pool", text: "Fixed pool sized to cores for CPU-bound work. Threads are OS threads: costly, limited.", color: "#38bdf8" },
              { icon: "🪶", title: "Virtual threads", text: "Millions possible. Blocking unmounts the virtual thread from its carrier. Best for I/O-bound tasks. Don't pool them.", color: "#34d399" },
              { icon: "🔗", title: "CompletableFuture", text: "Compose async steps: thenApply, thenCompose, thenCombine, exceptionally, orTimeout.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Always shut down executors you create (`shutdown` then `awaitTermination`, or try-with-resources).",
        "`thenApply` maps a value; `thenCompose` flattens a step that itself returns a CompletableFuture; `thenCombine` joins two independent futures.",
        "Without an executor argument, async stages run on the common ForkJoinPool: give blocking I/O its own executor.",
        "Virtual threads make blocking cheap, not computation faster. Limit access to scarce resources (DB connections) with a semaphore or the pool itself.",
        "Before JDK 24, blocking inside `synchronized` could pin a virtual thread to its carrier; JDK 24 (JEP 491) removed most of that pinning.",
      ],
      tip: "Asked 'thread pool size?': CPU-bound ≈ number of cores; I/O-bound can go much higher, and with Java 21 the modern answer is often 'virtual threads plus a limit on the downstream resource'.",
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
            title: "Looks immutable, isn't",
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
        "Recipe: final class (or sealed/private constructor), `private final` fields, no setters, defensive copies of mutable inputs and outputs.",
        "`Collections.unmodifiableList(x)` is a read-only view: changes to `x` still show through. `List.copyOf(x)` is a real snapshot.",
        "`final` on a reference stops reassignment, not mutation of the object it points to.",
        "Immutable objects are thread-safe without locks, and final fields are safely published once the constructor finishes (as long as `this` doesn't escape it).",
      ],
      tip: "Show the 'with' pattern: `Money withAmount(BigDecimal a) { return new Money(a, currency); }`. It's how immutable types support change.",
    },
  ],

  questions: [
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
        "`n` on the heap; `sb` and its object on the stack",
      ],
      answer: [0],
      explanation: "Locals (primitives and references) live in the method's stack frame; objects created with `new` live on the shared heap. The JIT's escape analysis may optimise a non-escaping object away, but the language model is still 'objects on the heap'.",
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
      explanation: "Each call pushes a new frame onto the thread's fixed-size stack, and HotSpot doesn't eliminate tail calls, so the stack runs out long before `n` overflows. Integer overflow in Java wraps silently anyway; it never throws.",
    },
    {
      id: "d4-03",
      domain: "d4",
      level: "junior",
      lesson: "d4-jvm",
      prompt: "After line 4, which objects are eligible for garbage collection?",
      codeLang: "java",
      code: java`
        Object a = new Object();   // object #1
        Object b = new Object();   // object #2
        a = b;
        b = null;
      `,
      options: ["Only #1", "Only #2", "Both #1 and #2", "Neither"],
      answer: [0],
      explanation: "After `a = b`, nothing refers to #1, so it's unreachable. `b = null` removes one reference to #2, but `a` still points at it, so #2 stays alive.",
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
      explanation: "Tracing collectors start from roots, so unreachable cycles are garbage. `System.gc()` is only a request the JVM may ignore, there's no reference counting, and locals stop being roots when the frame is popped.",
    },
    {
      id: "d4-05",
      domain: "d4",
      level: "senior",
      lesson: "d4-jvm",
      type: "order",
      prompt: "Put these phases of getting a class ready to use in order.",
      items: [
        "Loading: a class loader finds the bytes and creates the `Class` object",
        "Verification: the bytecode is checked for safety",
        "Preparation: static fields get default values",
        "Initialization: static initializers and field assignments run",
      ],
      explanation: "Verification and preparation are part of linking. Static fields hold defaults (0, null) after preparation and get their real values only during initialization, which happens on first active use.",
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
      explanation: "`MAX` is a compile-time constant (static final primitive with a constant initializer), so its value is inlined and reading it doesn't initialize `Config`. Reading the non-constant `count` is an active use: the static block runs first, printing \"init \", then 0 is printed.",
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
        "It throws `ConcurrentModificationException`",
      ],
      answer: [0],
      explanation: "`count++` is read, add, write. If both threads read the same value before either writes, one increment disappears. Fix it with `synchronized`, an `AtomicInteger`, or a `LongAdder` for heavily contended counters.",
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
      explanation: "Each call is thread-safe on its own, but another thread can run between the check and the put. Replace both with one atomic call: `return cache.computeIfAbsent(name, Service::create);`.",
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
      explanation: "Without `volatile` (or synchronization) there's no happens-before edge, so the worker thread may never see the write; the JIT can even hoist the read out of the loop. `private volatile boolean running = true;` fixes visibility.",
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
      explanation: "`volatile` handles visibility and ordering for single reads and writes; `count++` is still three steps. Synchronized instance methods lock `this`, so different instances don't contend (static synchronized methods lock the Class). `volatile` is only valid on fields.",
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
        "No risk: nested synchronized blocks are always safe",
      ],
      answer: [0],
      explanation: "Each thread holds one lock and waits for the other's: circular wait. Ordering locks consistently (lower id first) breaks the cycle. `ReentrantLock.tryLock` with a timeout is another option.",
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
        "Write `count += 1` instead of `count++`",
      ],
      answer: [0],
      explanation: "Atomic classes use compare-and-swap to make the read-modify-write a single atomic step. `volatile` alone doesn't make `++` atomic, and `+= 1` is the same three steps.",
    },
    {
      id: "d4-13",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-executors",
      type: "order",
      prompt: "Arrange the lines to run a task on a pool and shut it down cleanly.",
      items: [
        "`ExecutorService pool = Executors.newFixedThreadPool(4);`",
        "`Future<Integer> f = pool.submit(() -> compute());`",
        "`pool.shutdown();`",
        "`pool.awaitTermination(1, TimeUnit.MINUTES);`",
      ],
      explanation: "Create, submit, then `shutdown()` (stop accepting new tasks, let queued ones finish) and `awaitTermination` to wait. Forgetting to shut down leaves non-daemon threads that keep the JVM alive. Since Java 19 you can also use try-with-resources, whose `close()` does the same.",
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
      explanation: "2 becomes 20 via `thenApply`, then `thenCombine` waits for both futures and sums 20 and 3. `join()` blocks until the result is ready.",
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
      explanation: "The division throws, so the future completes exceptionally; `thenApply` is skipped and `exceptionally` recovers with -1. Without `exceptionally`, `join()` would throw a `CompletionException` wrapping the `ArithmeticException`.",
    },
    {
      id: "d4-16",
      domain: "d4",
      level: "senior",
      lesson: "d4-executors",
      prompt: "What are Java 21 virtual threads best suited for?",
      options: [
        "Many concurrent tasks that mostly wait on I/O, such as one thread per HTTP request, because a blocked virtual thread frees its carrier thread",
        "Making CPU-bound number crunching run faster than the number of cores allows",
        "Replacing `synchronized` with lock-free code automatically",
        "Running Java code on the GPU",
      ],
      answer: [0],
      explanation: "Virtual threads are cheap to create and park, so thread-per-request blocking code scales to huge concurrency. They don't add CPU capacity: for CPU-bound work, a pool sized to the cores is still right.",
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
      explanation: "Virtual threads are multiplexed over a small pool of carrier (platform) threads, so they're cheap enough that pooling is pointless. You keep writing plain blocking code; that's the whole point.",
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
      explanation: "The getters copy, but the constructor stores the caller's mutable `Date` objects, so the caller can call `setTime` on them later. Copy on the way in too: `this.start = new Date(start.getTime());`. Better still, use immutable `java.time.Instant`.",
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
      explanation: "Immutability comes from never changing state: final fields, no setters, copies at the boundaries (and a final class so subclasses can't add mutability). Locks and volatile are tools for mutable shared state, which an immutable object doesn't have.",
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
      explanation: "An unmodifiable view blocks writes through itself but reflects changes to the backing list. `List.copyOf` takes a snapshot. `src` itself is a normal ArrayList, so `add` works.",
    },
    {
      id: "d4-21",
      domain: "d4",
      level: "junior",
      lesson: "d4-immutability",
      prompt: "Why are immutable objects thread-safe without any locking?",
      options: [
        "Their state can't change after construction, so threads can share them freely and never see a half-updated object",
        "The JVM automatically synchronizes every method of a final class",
        "They're stored on each thread's stack, so they're never shared",
        "The garbage collector copies them for each thread",
      ],
      answer: [0],
      explanation: "Races need a write. With no writes after construction (and final fields, which the memory model guarantees are visible once the constructor finishes), there's nothing to race on.",
    },
    {
      id: "d4-22",
      domain: "d4",
      level: "staff",
      lesson: "d4-executors",
      prompt: "You're moving a blocking-I/O service from a 200-thread pool to virtual threads. The database pool has 50 connections. What must you add as part of the migration?",
      options: [
        "A bound on concurrent database work (a `Semaphore`, or relying on the connection pool's wait with a timeout), because the 200-thread cap that used to throttle load is gone",
        "A fixed pool of 200 virtual threads, to keep the old behaviour",
        "Nothing: virtual threads make the database faster",
        "A larger `-Xss` stack size",
      ],
      answer: [0],
      explanation: "The old pool size was an implicit rate limiter. With a virtual thread per request, thousands of requests can hit the database at once, so make the limit explicit. Pooling virtual threads defeats their purpose, and they don't change downstream capacity.",
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
      explanation: "Steady growth until OOM means something reachable keeps accumulating objects: a leak, not a GC problem. A heap dump's dominator tree shows the retaining path. More heap only delays the crash, and `System.gc()` can't free reachable objects with any collector.",
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
        "Retry immediately in a tight loop until the call succeeds",
      ],
      answer: [0],
      explanation: "Blocking calls on the shared common ForkJoinPool starve everything else that uses it, and without timeouts a stalled dependency hangs callers forever. Isolate (bulkhead) and bound the wait. `join` vs `get` only changes the exception type, and tight retries amplify an outage.",
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
        "Give each thread its own copy in a `ThreadLocal`, refreshed on its next request",
      ],
      answer: [0],
      explanation: "Swapping one reference to an immutable snapshot is atomic, lock-free for readers, and every reader sees a consistent config. Updating keys one at a time lets a reader see half old, half new settings; locking every getter adds contention; ThreadLocal copies drift and leak in pools.",
    },
  ],

  cards: [
    { id: "j-executorservice", domain: "d4", kind: "service", term: "ExecutorService", definition: "Runs submitted tasks on managed threads; shut it down when done" },
    { id: "j-completablefuture", domain: "d4", kind: "service", term: "CompletableFuture", definition: "Composable async result: thenApply, thenCompose, thenCombine, exceptionally" },
    { id: "j-atomicinteger", domain: "d4", kind: "service", term: "AtomicInteger", definition: "Lock-free int with atomic incrementAndGet and compareAndSet" },
    { id: "j-vt-executor", domain: "d4", kind: "service", term: "Executors.newVirtualThreadPerTaskExecutor()", definition: "Starts a new virtual thread for every submitted task (Java 21)" },
    { id: "j-reentrantlock", domain: "d4", kind: "service", term: "ReentrantLock", definition: "Explicit lock with tryLock, timeouts, and fairness options" },
    { id: "j-countdownlatch", domain: "d4", kind: "service", term: "CountDownLatch", definition: "Lets threads wait until a counter reaches zero" },
    { id: "j-list-copyof", domain: "d4", kind: "service", term: "List.copyOf", definition: "Unmodifiable snapshot of a collection; later source changes don't show" },
    { id: "j-heap-stack", domain: "d4", kind: "concept", term: "Heap vs stack", definition: "Objects live on the shared heap; each thread's stack holds frames with locals" },
    { id: "j-gc-roots", domain: "d4", kind: "concept", term: "GC roots", definition: "Starting points for reachability: thread stacks, static fields, JNI references" },
    { id: "j-generational", domain: "d4", kind: "concept", term: "Generational GC", definition: "Collects the young generation often because most objects die young" },
    { id: "j-class-init", domain: "d4", kind: "concept", term: "Class initialization", definition: "Static initializers run on a class's first active use" },
    { id: "j-volatile", domain: "d4", kind: "concept", term: "volatile", definition: "Field modifier guaranteeing visibility and ordering, not atomicity" },
    { id: "j-happens-before", domain: "d4", kind: "concept", term: "Happens-before", definition: "Java Memory Model rule that makes one action's effects visible to another" },
    { id: "j-deadlock", domain: "d4", kind: "concept", term: "Deadlock", definition: "Threads each hold a lock the other needs; prevent with a global lock order" },
    { id: "j-virtual-thread", domain: "d4", kind: "concept", term: "Virtual thread", definition: "Lightweight JVM-managed thread that unmounts from its carrier while blocked" },
    { id: "j-immutable", domain: "d4", kind: "concept", term: "Immutable object", definition: "State fixed at construction; thread-safe without locks" },
  ],

  challenges: [
    {
      id: "ch-java-lost-update",
      domain: "d4",
      lesson: "d4-threads",
      title: "Lose an update",
      goal: "With synchronized off, interleave the threads so both finish but count ends at 1.",
      hint: "Let both threads read before either one writes.",
      takeaway: "count++ is three steps. Without a lock or an atomic, two threads can read the same value and one increment vanishes. Turn on synchronized and try again: the second thread blocks instead.",
      render: (onSolved) => <RaceStepper goal="lost" onSolved={onSolved} />,
    },
  ],
});
