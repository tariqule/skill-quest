import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { IsolationLab } from "../labs";
import { sql } from "../sql";
import { IndexVsScan } from "../visuals";

/** World 4: schema design, indexes and plans, transactions and isolation, and running SQL at team scale. */
export default defineDomain({
  domain: {
    id: "d4",
    number: 4,
    name: "Design, Performance & Production",
    world: "The Index Forge",
    weight: 25,
    emoji: "⚒️",
    color: "#f59e0b",
    summary: "Keys, constraints and normalization; B-tree indexes and EXPLAIN; transactions, isolation levels and lost updates; zero-downtime migrations, multi-tenant schemas, and everyday traffic compared with reporting (OLTP and OLAP).",
  },

  tasks: [
    {
      id: "4.1",
      title: "Schema design",
      covers: ["Foreign keys and ON DELETE", "CHECK, UNIQUE and NOT NULL", "Normal forms (1NF–3NF) and denormalization", "Choosing types (numeric for money)"],
    },
    {
      id: "4.2",
      title: "Indexes and query plans",
      covers: ["B-tree indexes", "Composite indexes and column order", "Expression indexes", "Selectivity", "EXPLAIN and EXPLAIN ANALYZE", "Keyset pagination", "CREATE INDEX CONCURRENTLY"],
    },
    {
      id: "4.3",
      title: "Transactions and isolation",
      covers: ["ACID", "BEGIN, COMMIT, ROLLBACK", "READ COMMITTED, REPEATABLE READ, SERIALIZABLE", "Lost updates and SELECT … FOR UPDATE", "Deadlocks and retries"],
    },
    {
      id: "4.4",
      title: "SQL at team scale",
      covers: ["Expand and contract migrations", "Safe constraint changes on big tables", "Multi-tenant schemas and row-level security", "OLTP and OLAP"],
    },
  ],

  lessons: [
    {
      id: "d4-start-create",
      level: "beginner",
      task: "4.1",
      title: "Making your own table",
      check: ["sql-b4-01", "sql-b4-02"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="sql"
            caption="A name, then each column with its type and any rules."
            code={sql`
              CREATE TABLE pets (
                id       integer PRIMARY KEY,  -- a unique number for each pet
                name     text    NOT NULL,     -- every pet needs a name
                born_on  date                  -- may be left empty
              );

              INSERT INTO pets (id, name, born_on)
              VALUES (1, 'Rex', '2021-04-02');
            `}
          />
        </div>
      ),
      points: [
        "Before you can store anything, you describe the table with CREATE TABLE. You give it a name, list its columns, and say what type each column holds.",
        "A type says what kind of value fits: integer for whole numbers, text for words, date for dates. PostgreSQL refuses a value that doesn't fit, like 'ten' in an integer column.",
        "Rules stop bad data getting in, like a form that won't submit without your email. NOT NULL means the column must be filled in, and PRIMARY KEY gives each row a unique id.",
        "Once the table exists, INSERT adds rows to it and SELECT reads them back.",
      ],
      tip: "Give every table an id column as its primary key. It's the simplest way to point at exactly one row later.",
    },
    {
      id: "d4-start-transactions",
      level: "beginner",
      task: "4.3",
      title: "All or nothing: transactions",
      check: ["sql-b4-03", "sql-b4-05"],
      visual: (
        <div className="grid gap-4">
          <Flow
            steps={[
              { icon: "🟢", label: "BEGIN", sub: "Start a transaction" },
              { icon: "💸", label: "Take 30 from Ana", sub: "First change" },
              { icon: "💰", label: "Give 30 to Bo", sub: "Second change" },
              { icon: "✅", label: "COMMIT", sub: "Both changes are kept" },
            ]}
          />
          <CodeBlock
            lang="sql"
            code={sql`
              BEGIN;
              UPDATE accounts SET balance = balance - 30 WHERE name = 'Ana';
              UPDATE accounts SET balance = balance + 30 WHERE name = 'Bo';
              COMMIT;   -- or ROLLBACK; to throw both changes away
            `}
          />
        </div>
      ),
      points: [
        "Moving money between two bank accounts takes two changes: take it out of one, then add it to the other. If something fails halfway, the money would just vanish.",
        "A transaction wraps several changes so they all happen or none do. You start one with BEGIN and finish with COMMIT, which makes the changes permanent.",
        "If something looks wrong before you commit, ROLLBACK throws the changes away, as if you never made them.",
      ],
      tip: "Before a big UPDATE or DELETE, type BEGIN first. You can check what changed and still ROLLBACK if it isn't what you meant.",
    },
    {
      id: "d4-schema",
      level: "intermediate",
      task: "4.1",
      title: "Designing tables that stay correct",
      check: ["d4-01", "d4-02"],
      visual: (
        <div className="grid gap-4">
          <CodeCompare
            lang="sql"
            left={{ title: "Repeated facts drift apart", code: sql`
              -- orders
              -- id | customer_email | customer_city | total
              --  1 | ana@x.io       | Lisbon        | 30
              --  2 | ana@x.io       | Porto         | 45
              -- Which city is Ana's?
            ` }}
            right={{ title: "Each fact stored once", code: sql`
              CREATE TABLE customers (
                id    bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                email text NOT NULL UNIQUE,
                city  text
              );
              CREATE TABLE orders (
                id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
                customer_id bigint NOT NULL REFERENCES customers (id),
                total       numeric(10, 2) NOT NULL CHECK (total >= 0)
              );
            ` }}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "1️⃣", title: "1NF", text: "One value per cell: no comma-separated lists. A list becomes rows in a child table.", color: "#38bdf8" },
              { icon: "2️⃣", title: "2NF", text: "With a composite key, every column depends on the whole key, not just part of it.", color: "#34d399" },
              { icon: "3️⃣", title: "3NF", text: "No column depends on another non-key column (city belongs to the customer, not the order).", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "Normalization stores each fact once, so an update can't leave copies disagreeing (an \"update anomaly\").",
        "A foreign key (REFERENCES) guarantees each child row points at a real parent. ON DELETE (CASCADE, RESTRICT or SET NULL) decides what happens to the children when the parent is deleted.",
        "Constraints are rules the database enforces for every client: NOT NULL, UNIQUE, CHECK, foreign keys. A CHECK passes when its result is TRUE or NULL.",
        "Use numeric (or integer cents) for money, never real or double precision, which can't represent 0.1 exactly.",
        "Denormalizing means copying data on purpose to make reads faster. Do it deliberately, and only with a plan to keep the copies in sync.",
      ],
      tip: "Put rules in constraints, not just in app code. Constraints protect you from every other script, job and teammate that touches the table.",
    },
    {
      id: "d4-indexes",
      level: "senior",
      task: "4.2",
      title: "Indexes and query plans",
      check: ["d4-10", "d4-11"],
      visual: (
        <div className="grid gap-4">
          <IndexVsScan />
          <CodeBlock
            lang="sql"
            code={sql`
              CREATE INDEX orders_customer_created_idx
                ON orders (customer_id, created_at);       -- leftmost column first

              EXPLAIN ANALYZE                               -- runs it, shows real timings
              SELECT * FROM orders
              WHERE customer_id = 7 AND created_at >= '2026-01-01';
            `}
          />
        </div>
      ),
      points: [
        "A B-tree index keeps a column's values sorted with pointers to rows, so finding a value takes about log(n) steps instead of reading the whole table.",
        "A composite index (a, b) is sorted by a, then b. It serves filters on a, or on a and b, but not efficiently on b alone.",
        "Wrapping the column in a function (lower(email)), casting it, or a leading-% LIKE prevents a plain index from seeking. Create an expression index instead.",
        "When a condition matches a large share of rows, a sequential scan is cheaper, so the planner skips the index. That's selectivity at work, not a bug.",
        "Indexes aren't free: every INSERT, UPDATE and DELETE maintains every index. EXPLAIN shows the plan, and EXPLAIN ANALYZE runs the query and shows what actually happened.",
      ],
      tip: "Design indexes from your real queries: equality columns first, then the range or sort column. Then confirm with EXPLAIN ANALYZE.",
    },
    {
      id: "d4-transactions",
      level: "senior",
      task: "4.3",
      title: "Transactions and isolation",
      check: ["d4-14", "d4-16"],
      visual: (
        <div className="grid gap-4">
          <IsolationLab />
          <CodeBlock
            lang="sql"
            code={sql`
              BEGIN;
              UPDATE accounts SET balance = balance - 30 WHERE id = 1 AND balance >= 30;
              UPDATE accounts SET balance = balance + 30 WHERE id = 2;
              COMMIT;   -- both changes, or (on error / ROLLBACK) neither
            `}
          />
        </div>
      ),
      points: [
        "A transaction groups statements into one all-or-nothing unit. Its guarantees are called ACID: atomic, consistent, isolated and durable.",
        "PostgreSQL's default is READ COMMITTED: each statement sees data committed before it started, so two reads in one transaction can differ.",
        "REPEATABLE READ gives the whole transaction one snapshot. SERIALIZABLE also detects dangerous interleavings. Both can abort with a serialization failure (SQLSTATE 40001) that the app must retry.",
        "Reading a value in your app, changing it, then writing it back loses updates when two requests overlap. Use an atomic UPDATE (`balance = balance - 30`), SELECT … FOR UPDATE, or a stricter level with retries.",
        "Deadlocks happen when transactions lock the same rows in different orders. PostgreSQL detects them and aborts one. Lock rows in a consistent order to avoid them.",
      ],
      tip: "Keep transactions short. Never wait on a user or a slow external API while holding row locks.",
    },
    {
      id: "d4-scale",
      level: "staff",
      task: "4.4",
      title: "SQL at team scale",
      check: ["d4-20", "d4-22"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "➕", label: "Expand", sub: "Add the new column or table; nothing reads it yet" },
              { icon: "✍️", label: "Dual-write", sub: "New code writes old and new" },
              { icon: "🚚", label: "Backfill", sub: "Copy old data in small batches" },
              { icon: "🔀", label: "Switch reads", sub: "Read from the new shape" },
              { icon: "🧹", label: "Contract", sub: "Stop old writes, then drop the old column" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🏢", title: "Shared tables + tenant_id", text: "Cheapest and densest. Every query must filter by tenant, and row-level security can enforce it.", color: "#38bdf8" },
              { icon: "🗂️", title: "Schema per tenant", text: "Better separation and per-tenant restores, but migrations run N times and object counts explode.", color: "#a78bfa" },
              { icon: "🏰", title: "Database per tenant", text: "Strongest isolation and no noisy neighbours. Highest operational cost.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "During a rolling deploy, old and new code run at the same time, so every schema change must work with both. Expand first, contract last.",
        "On big PostgreSQL tables, prefer changes that don't rewrite the table or hold long locks: CREATE INDEX CONCURRENTLY, constraints added NOT VALID then validated, backfills in batches.",
        "Multi-tenant designs trade isolation for cost. Shared tables need tenant_id on every row and as the first column of every index. Row-level security adds a safety net the database enforces.",
        "OLTP, like checkout and logins, is many small transactions that look rows up by key. OLAP, like reports, scans and aggregates millions of rows. Separate them with replicas or a warehouse as you grow.",
      ],
      tip: "Review migrations like code: will it lock a hot table, can it be rolled back, and does the currently deployed version still work after it runs?",
    },
  ],

  questions: [
    {
      id: "sql-b4-01",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-create",
      prompt: "What does CREATE TABLE do?",
      options: [
        "Describes a new, empty table: its name, its columns and their types",
        "Adds one row to an existing table",
        "Shows every row in a table",
        "Makes an exact copy of a table from another database server",
      ],
      answer: [0],
      explanation:
        "CREATE TABLE sets up the shape of a new table, which starts out empty. INSERT is what adds rows, and SELECT is what reads them.",
    },
    {
      id: "sql-b4-02",
      type: "fill",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-create",
      prompt: "Fill the gap so every pet must have a name.",
      code: "CREATE TABLE pets (\n  id   integer PRIMARY KEY,\n  name text {{1}}\n);",
      codeLang: "sql",
      blanks: [{ options: ["NOT NULL", "REQUIRED", "MUST EXIST", "FILLED"], answer: 0 }],
      explanation:
        "NOT NULL tells the database to refuse any row where that column is empty. The other words look reasonable, but they aren't SQL, so the statement would fail.",
    },
    {
      id: "sql-b4-03",
      type: "output",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-transactions",
      prompt: "Type the balance the final SELECT returns.",
      code: "-- acct(id, bal): (1, 100)\nBEGIN;\nUPDATE acct SET bal = bal - 40 WHERE id = 1;\nROLLBACK;\nSELECT bal FROM acct WHERE id = 1;",
      codeLang: "sql",
      answers: ["100"],
      explanation:
        "ROLLBACK throws away every change since BEGIN, so the withdrawal of 40 never happened. The balance is still 100.",
    },
    {
      id: "sql-b4-04",
      type: "output",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-transactions",
      prompt: "Type the balance the final SELECT returns.",
      code: "-- acct(id, bal): (1, 100)\nBEGIN;\nUPDATE acct SET bal = bal - 40 WHERE id = 1;\nCOMMIT;\nSELECT bal FROM acct WHERE id = 1;",
      codeLang: "sql",
      answers: ["60"],
      explanation:
        "COMMIT keeps the changes made since BEGIN, so the withdrawal sticks. 100 minus 40 leaves 60.",
    },
    {
      id: "sql-b4-05",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-transactions",
      prompt: "Why move money between two accounts inside a transaction?",
      options: [
        "So both changes happen together, or neither does if something fails halfway",
        "Because UPDATE only works inside a transaction",
        "To make the UPDATE statements run faster",
        "So other people can see the change before it has finished saving",
      ],
      answer: [0],
      explanation:
        "A transaction is all or nothing. If the second change fails, the first is undone too, so money can't vanish. UPDATE works fine on its own, it just isn't protected that way.",
    },
    {
      id: "d4-01",
      domain: "d4",
      level: "junior",
      lesson: "d4-schema",
      prompt: "What does `customer_id bigint REFERENCES customers (id)` guarantee?",
      options: [
        "Every non-NULL customer_id matches an existing customer's id",
        "customer_id is unique in the orders table",
        "customer_id can never be NULL",
        "Customers are deleted automatically when their orders are",
      ],
      answer: [0],
      explanation:
        "A foreign key enforces that the referenced row exists, and by default blocks deleting a parent that's still referenced. It doesn't imply UNIQUE or NOT NULL; add those separately if you need them.",
    },
    {
      id: "d4-02",
      domain: "d4",
      level: "junior",
      lesson: "d4-schema",
      prompt: "Every `orders` row stores `customer_email` and `customer_city`. What is the main problem with this design?",
      options: [
        "Changing a customer's details means updating many rows, and copies can end up disagreeing",
        "Text columns can't be used in WHERE",
        "Tables are limited to three columns, so the customer details have to be split out into another table",
        "Orders can no longer be sorted",
      ],
      answer: [0],
      explanation: "This is the classic update anomaly. Store customer facts once in `customers` and point at them with `customer_id`.",
    },
    {
      id: "d4-03",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-schema",
      type: "match",
      prompt: "Match each term to the rule it describes.",
      pairs: [
        ["1NF", "Each cell holds a single value (no lists in a column)"],
        ["2NF", "No column depends on only part of a composite key"],
        ["3NF", "No column depends on another non-key column"],
        ["Denormalization", "Deliberately duplicating data to speed up reads"],
      ],
      explanation:
        "Each normal form removes a kind of redundancy. 3NF is the usual target for transactional systems, while analytics schemas often denormalize on purpose.",
    },
    {
      id: "d4-04",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-schema",
      type: "lines",
      prompt: "Invoices built from this table are sometimes off by a cent. Tap the line with the problem.",
      code: sql`
        CREATE TABLE order_items (
          order_id   bigint  NOT NULL REFERENCES orders (id),
          product_id bigint  NOT NULL REFERENCES products (id),
          quantity   integer NOT NULL CHECK (quantity > 0),
          unit_price real    NOT NULL,
          PRIMARY KEY (order_id, product_id)
        );
      `,
      codeLang: "sql",
      answer: [5],
      explanation: "`real` is binary floating point, which can't represent most decimal amounts exactly, so sums drift. Use `numeric(10, 2)` or store integer cents.",
    },
    {
      id: "d4-05",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-schema",
      prompt: "What does the final SELECT return?",
      code: sql`
        CREATE TABLE orders (id int PRIMARY KEY);
        CREATE TABLE items (
          order_id int REFERENCES orders (id) ON DELETE CASCADE,
          sku      text
        );
        -- orders: 1, 2 · items: (1, 'A'), (1, 'B'), (2, 'C')
        DELETE FROM orders WHERE id = 1;
        SELECT COUNT(*) FROM items;
      `,
      codeLang: "sql",
      options: ["1", "3", "2", "An error: order 1 is still referenced"],
      answer: [0],
      explanation: "ON DELETE CASCADE deletes the child rows along with the parent, so items A and B go too. Without it (the default, NO ACTION), the DELETE would fail.",
    },
    {
      id: "d4-06",
      domain: "d4",
      level: "senior",
      lesson: "d4-schema",
      prompt: "`products.price` has `CHECK (price > 0)` but no NOT NULL. What happens with `INSERT INTO products (name, price) VALUES ('pen', NULL)`?",
      options: ["It succeeds: a CHECK only fails when its condition is FALSE, and NULL > 0 is UNKNOWN", "It fails the CHECK", "It stores 0", "It fails, because NULL isn't a number and so it can't be compared with 0 by the CHECK constraint"],
      answer: [0],
      explanation: "Unlike WHERE, a CHECK constraint passes on UNKNOWN. If the value is required, add NOT NULL as well.",
    },
    {
      id: "d4-07",
      domain: "d4",
      level: "junior",
      lesson: "d4-indexes",
      prompt: "What is an index for?",
      options: [
        "Finding rows by a column's value without reading the whole table, at the cost of extra storage and slower writes",
        "Making rows come back in insertion order",
        "Guaranteeing that a column is never NULL",
        "Compressing the table to save disk space, so that each sequential scan reads fewer pages and finishes much faster",
      ],
      answer: [0],
      explanation: "Like the index at the back of a book, it trades space and upkeep (every write must update it) for much faster lookups.",
    },
    {
      id: "d4-08",
      domain: "d4",
      level: "senior",
      lesson: "d4-indexes",
      prompt: "There's an index on `orders (customer_id, created_at)`. Which queries can use it to seek straight to the matching rows? (Choose two.)",
      options: [
        "`WHERE customer_id = 7`",
        "`WHERE customer_id = 7 AND created_at >= '2026-01-01'`",
        "`WHERE created_at >= '2026-01-01'`",
        "`WHERE customer_id::text = '7'`",
      ],
      answer: [0, 1],
      explanation:
        "The index is sorted by customer_id first, so it serves filters on its leftmost column(s). A filter on created_at alone can't seek (PostgreSQL 18's skip scan helps in some cases, but it's no substitute for a good leading column), and casting the column hides it from the index.",
    },
    {
      id: "d4-09",
      domain: "d4",
      level: "senior",
      lesson: "d4-indexes",
      type: "lines",
      prompt: "EXPLAIN shows a sequential scan even though the index exists. Tap the line responsible.",
      code: sql`
        CREATE INDEX users_email_idx ON users (email);

        SELECT id
        FROM users
        WHERE lower(email) = 'ana@x.io';
      `,
      codeLang: "sql",
      answer: [5],
      explanation:
        "The index stores `email`, not `lower(email)`, so it can't be searched for the function's result. Create an expression index, `CREATE INDEX ON users (lower(email))`, or store emails already lower-cased.",
    },
    {
      id: "d4-10",
      domain: "d4",
      level: "intermediate",
      lesson: "d4-indexes",
      prompt: "What does `EXPLAIN ANALYZE` do that plain `EXPLAIN` doesn't?",
      options: [
        "Actually runs the query and reports real row counts and timings next to the estimates",
        "Suggests which indexes to create",
        "Rewrites the query into a faster form",
        "Shows the plan the optimizer would choose, with its cost estimates, without running the query at all",
      ],
      answer: [0],
      explanation:
        "Plain EXPLAIN only shows the planner's estimates. Because ANALYZE really executes the statement, wrap an UPDATE or DELETE in `BEGIN … ROLLBACK` when you analyze it.",
    },
    {
      id: "d4-11",
      domain: "d4",
      level: "senior",
      lesson: "d4-indexes",
      prompt: "`WHERE status = 'active'` matches 95% of a large table. There's an index on `status`, but the planner chooses a sequential scan. Why?",
      options: [
        "Fetching almost every row through the index costs more than one sequential pass over the table",
        "Indexes can't be used on text columns",
        "The index is corrupt and needs REINDEX",
        "The planner never uses an index when the query has an equality condition on its column",
      ],
      answer: [0],
      explanation:
        "Indexes win when a condition is selective. For most of the table, jumping between the index and the table is slower than reading the table in order. An index on status helps for the rare values, such as 'banned'.",
    },
    {
      id: "d4-12",
      domain: "d4",
      level: "staff",
      lesson: "d4-indexes",
      prompt: "A feed paginates with this query, and deep pages take seconds. What's the best fix?",
      code: sql`
        SELECT * FROM orders
        ORDER BY created_at DESC, id DESC
        LIMIT 50 OFFSET 250000;
      `,
      codeLang: "sql",
      options: [
        "Keyset pagination: `WHERE (created_at, id) < ($1, $2)` using the last row of the previous page, with an index on `(created_at, id)`",
        "Raise the LIMIT so users need fewer pages",
        "Drop the `id DESC` tiebreaker to simplify the sort, and raise `work_mem` so the larger OFFSET values are sorted in memory instead of on disk",
        "Run `VACUUM` before each page",
      ],
      answer: [0],
      explanation:
        "OFFSET still has to produce and throw away 250,000 rows on every request. Keyset pagination seeks straight to where the last page ended, so every page costs the same. The tiebreaker is what makes the cursor unambiguous.",
    },
    {
      id: "d4-13",
      domain: "d4",
      level: "staff",
      lesson: "d4-indexes",
      prompt: "Why use `CREATE INDEX CONCURRENTLY` on a busy production table?",
      options: [
        "It builds the index without blocking inserts, updates and deletes (it's slower, can't run inside a transaction block, and can leave an INVALID index if it fails)",
        "It builds the index using several CPU cores, which is faster",
        "It lets two indexes on the same column be built at the same time in parallel, which halves the total build time, and it can run safely inside a transaction block",
        "It's required for every index on tables over a million rows",
      ],
      answer: [0],
      explanation:
        "A plain CREATE INDEX blocks writes for the whole build. CONCURRENTLY takes longer and does extra passes but lets traffic continue. If it fails, drop the INVALID index and retry.",
    },
    {
      id: "d4-14",
      domain: "d4",
      level: "junior",
      lesson: "d4-transactions",
      prompt: "What does the final SELECT return?",
      code: sql`
        -- accounts (id, balance): (1, 100)
        BEGIN;
        UPDATE accounts SET balance = balance - 30 WHERE id = 1;
        ROLLBACK;
        SELECT balance FROM accounts WHERE id = 1;
      `,
      codeLang: "sql",
      options: ["100", "70", "NULL", "An error: the row is locked"],
      answer: [0],
      explanation: "ROLLBACK undoes everything since BEGIN, so the update never becomes visible and its row lock is released.",
    },
    {
      id: "d4-15",
      domain: "d4",
      level: "junior",
      lesson: "d4-transactions",
      type: "match",
      prompt: "Match each ACID property to its meaning.",
      pairs: [
        ["Atomicity", "All of the transaction's changes happen, or none do"],
        ["Consistency", "Constraints hold before and after every transaction"],
        ["Isolation", "Concurrent transactions don't see each other's unfinished work"],
        ["Durability", "Committed changes survive a crash"],
      ],
      explanation: "These four guarantees are why databases are trusted with money and inventory. Isolation comes in levels that trade strictness for concurrency.",
    },
    {
      id: "d4-16",
      domain: "d4",
      level: "senior",
      lesson: "d4-transactions",
      prompt: "At PostgreSQL's default isolation level, a transaction runs the same SELECT twice, and another transaction commits a change to those rows in between. What does the second SELECT see?",
      options: [
        "The committed change: READ COMMITTED takes a fresh snapshot for each statement",
        "The original data, since a transaction always sees just one snapshot",
        "An error: the rows changed during the transaction",
        "The change, even if it had not been committed yet",
      ],
      answer: [0],
      explanation:
        "The default is READ COMMITTED, which allows non-repeatable reads. REPEATABLE READ would show the same snapshot both times. PostgreSQL never shows uncommitted data, even if you ask for READ UNCOMMITTED.",
    },
    {
      id: "d4-17",
      domain: "d4",
      level: "senior",
      lesson: "d4-transactions",
      prompt: "Two requests each read `stock` in a SELECT, subtract 1 in application code, and write the result back, at READ COMMITTED. Which changes prevent lost updates? (Choose two.)",
      options: [
        "`UPDATE items SET stock = stock - 1 WHERE id = $1 AND stock > 0`",
        "Read the row with `SELECT … FOR UPDATE` before computing the new value",
        "Add an index on items.id",
        "Run the SELECT twice to confirm the value",
        "Switch to READ UNCOMMITTED",
      ],
      answer: [0, 1],
      explanation:
        "The atomic UPDATE does the read and write under one row lock. FOR UPDATE makes the second request wait and then read the fresh value. An index and re-reading don't serialize anything, and PostgreSQL treats READ UNCOMMITTED as READ COMMITTED.",
    },
    {
      id: "d4-18",
      domain: "d4",
      level: "senior",
      lesson: "d4-transactions",
      prompt: "At SERIALIZABLE, PostgreSQL aborts a transaction with SQLSTATE `40001` (serialization_failure). What should the application do?",
      options: [
        "Retry the whole transaction from the beginning",
        "Retry only the statement that failed",
        "Ignore it: the data was saved anyway",
        "Switch the connection to READ UNCOMMITTED and continue",
      ],
      answer: [0],
      explanation:
        "The transaction was rolled back because its result could differ from any serial order. Rerunning it from the start, with fresh reads, is safe. Strict isolation levels assume the app has this retry loop.",
    },
    {
      id: "d4-19",
      domain: "d4",
      level: "senior",
      lesson: "d4-transactions",
      type: "lines",
      prompt: "Under concurrent withdrawals this sometimes loses one. Tap the two lines that together cause the lost update.",
      code: sql`
        BEGIN;
        SELECT balance FROM accounts WHERE id = 1;
        -- app checks the balance is at least 30, then computes 100 - 30
        UPDATE accounts SET balance = 70 WHERE id = 1;
        COMMIT;
      `,
      codeLang: "sql",
      answer: [2, 4],
      explanation:
        "The SELECT takes no lock, so another session can read the same 100, and the UPDATE writes an absolute value that overwrites the other session's change. Either `SELECT … FOR UPDATE`, or one atomic `UPDATE … SET balance = balance - 30 WHERE id = 1 AND balance >= 30`, fixes it.",
    },
    {
      id: "d4-20",
      domain: "d4",
      level: "staff",
      lesson: "d4-scale",
      type: "order",
      prompt: "Rename `users.name` to `full_name` with zero downtime during rolling deploys. Put the steps in order.",
      items: [
        "Add a nullable `full_name` column",
        "Deploy code that writes to both `name` and `full_name`",
        "Backfill `full_name` from `name` in small batches",
        "Deploy code that reads `full_name`",
        "Stop writing `name`, then drop the column in a later release",
      ],
      explanation:
        "Expand, migrate, contract. At every step the versions running side by side still work, and until the last step you can roll back. A plain RENAME breaks whichever version expects the other name.",
    },
    {
      id: "d4-21",
      domain: "d4",
      level: "staff",
      lesson: "d4-scale",
      prompt: "You need `orders.region` to be NOT NULL on a 500-million-row PostgreSQL table without blocking writes for the length of a full scan. What's the best approach?",
      options: [
        "Add `CHECK (region IS NOT NULL) NOT VALID`, run `VALIDATE CONSTRAINT` (which doesn't block writes), then `SET NOT NULL`, which uses the validated check to skip its own scan",
        "Run `ALTER TABLE orders ALTER COLUMN region SET NOT NULL` at peak hours so it finishes quickly, since PostgreSQL skips the full table scan whenever the table has an index on that column",
        "Add a trigger that converts NULLs to empty strings",
        "Dump the table, edit the file, and reload it",
      ],
      answer: [0],
      explanation:
        "SET NOT NULL on its own scans the whole table under a lock that blocks writes. A NOT VALID check is instant, validating it uses a weaker lock, and since PostgreSQL 12 SET NOT NULL trusts a valid check constraint. Backfill the NULLs first.",
    },
    {
      id: "d4-22",
      domain: "d4",
      level: "staff",
      lesson: "d4-scale",
      type: "match",
      prompt: "Match each multi-tenant approach to its defining trade-off.",
      pairs: [
        ["Shared tables with tenant_id", "Cheapest and densest; every query must filter by tenant"],
        ["Schema per tenant", "Per-tenant restores, but migrations run once per tenant"],
        ["Database per tenant", "Strongest isolation, highest operational cost"],
        ["Row-level security", "The database adds the tenant filter to every query"],
      ],
      explanation:
        "Most SaaS products start with shared tables (plus RLS as a safety net) and move their largest or most regulated customers to dedicated databases when needed.",
    },
    {
      id: "d4-23",
      domain: "d4",
      level: "staff",
      lesson: "d4-scale",
      prompt: "You enable row-level security on `invoices` with a policy `USING (tenant_id = current_setting('app.tenant_id')::int)`, but the app still sees every tenant's rows. What's the most likely cause?",
      options: [
        "The app connects as the table's owner, and owners bypass RLS unless the table uses `FORCE ROW LEVEL SECURITY`",
        "Policies only apply to INSERT, not SELECT",
        "RLS requires the SERIALIZABLE isolation level, and the app's connections use the default READ COMMITTED level",
        "current_setting can't be used in a policy",
      ],
      answer: [0],
      explanation:
        "Superusers, roles with BYPASSRLS, and by default the table owner are exempt from policies. Run the app as a separate, non-owner role (or FORCE RLS), and make sure every connection sets app.tenant_id.",
    },
    {
      id: "d4-24",
      domain: "d4",
      level: "staff",
      lesson: "d4-scale",
      prompt: "Analysts' heavy queries over two years of orders slow down the production PostgreSQL that also serves checkout. What's the best long-term fix?",
      options: [
        "Move analytics off the primary: a read replica in the short term, and a columnar warehouse fed by CDC or ETL as reporting grows",
        "Give analysts their own indexes on the production tables, and run their reports at night so the extra index writes don't slow daytime traffic",
        "Run checkout at SERIALIZABLE so it gets priority",
        "Limit analysts to queries without joins",
      ],
      answer: [0],
      explanation:
        "OLTP (many small keyed transactions) and OLAP (big scans and aggregates) want different storage and tuning. Separating them protects checkout latency, and a columnar store answers aggregate queries far faster.",
    },
    {
      id: "d4-25",
      domain: "d4",
      level: "staff",
      lesson: "d4-scale",
      prompt: "Which describe an OLAP (analytics) workload rather than OLTP? (Choose two.)",
      options: [
        "Each query scans and aggregates millions of rows",
        "Columnar storage and star schemas (fact tables plus dimensions)",
        "Thousands of tiny transactions per second, each touching a few rows by key",
        "Row locks protecting checkout from double-selling stock",
        "Strictly normalized tables to keep writes consistent",
      ],
      answer: [0, 1],
      explanation:
        "Analytics reads a few columns across huge numbers of rows, so columnar storage and denormalized star schemas fit. The other three are hallmarks of OLTP systems.",
    },
    {
      id: "d4-26",
      domain: "d4",
      level: "staff",
      lesson: "d4-scale",
      prompt: "During a rolling deploy, old and new versions of the app run at the same time. Which migration is unsafe to ship together with the code change?",
      options: [
        "Renaming a column that the old version still queries",
        "Adding a new nullable column",
        "Adding a new table",
        "Creating a brand new index on it concurrently",
      ],
      answer: [0],
      explanation:
        "The moment the rename runs, the old version's queries fail. Additive changes are backward-compatible. Destructive ones (rename, drop, tighten) wait until no running code depends on the old shape.",
    },
    {
      id: "d4-27",
      domain: "d4",
      level: "senior",
      lesson: "d4-scale",
      prompt: "In PostgreSQL 11 and later, what happens when you run `ALTER TABLE orders ADD COLUMN source text DEFAULT 'web'` on a 200-million-row table?",
      options: [
        "It's a quick metadata change: existing rows report 'web' without the table being rewritten",
        "It rewrites all 200 million rows while blocking reads and writes",
        "It fails: you can't add a column with a default value to a table that has rows",
        "Existing rows get NULL; only new rows get 'web'",
      ],
      answer: [0],
      explanation:
        "Since PostgreSQL 11, a constant (non-volatile) default is stored in the catalog and returned for old rows on read. A volatile default such as `random()` still forces a rewrite.",
    },
  ],

  cards: [
    { id: "c4-fk", domain: "d4", kind: "service", term: "REFERENCES (foreign key)", definition: "Makes each child value match an existing parent row. ON DELETE sets what happens to the children when the parent goes." },
    { id: "c4-check", domain: "d4", kind: "service", term: "CHECK", definition: "A rule every row must pass, like CHECK (price > 0). It passes when the result is TRUE or NULL." },
    { id: "c4-unique", domain: "d4", kind: "service", term: "UNIQUE", definition: "No two rows share the value. Multiple NULLs are allowed unless NULLS NOT DISTINCT (PostgreSQL 15+)." },
    { id: "c4-index", domain: "d4", kind: "service", term: "CREATE INDEX", definition: "Builds a sorted lookup structure (B-tree by default) for faster reads at a write cost." },
    { id: "c4-concurrently", domain: "d4", kind: "service", term: "CREATE INDEX CONCURRENTLY", definition: "Builds an index without blocking writes. It's slower, and it isn't allowed inside a transaction block." },
    { id: "c4-explain", domain: "d4", kind: "service", term: "EXPLAIN ANALYZE", definition: "Runs a statement and shows the real plan with row counts and timings." },
    { id: "c4-begin", domain: "d4", kind: "service", term: "BEGIN / COMMIT / ROLLBACK", definition: "Start a transaction, make its changes permanent, or undo them all." },
    { id: "c4-forupdate", domain: "d4", kind: "service", term: "SELECT … FOR UPDATE", definition: "Reads rows and locks them, so concurrent writers wait until this transaction ends." },
    { id: "c4-identity", domain: "d4", kind: "service", term: "GENERATED AS IDENTITY", definition: "The standard SQL way to make a column count up by itself. Prefer it over PostgreSQL's older serial." },
    { id: "c4-normal", domain: "d4", kind: "concept", term: "Normalization", definition: "Structuring tables so each fact is stored once, avoiding update anomalies." },
    { id: "c4-acid", domain: "d4", kind: "concept", term: "ACID", definition: "Atomicity, consistency, isolation and durability: the four guarantees a transaction gives you." },
    { id: "c4-readcommitted", domain: "d4", kind: "concept", term: "READ COMMITTED", definition: "PostgreSQL's default isolation: each statement sees data committed before it began." },
    { id: "c4-mvcc", domain: "d4", kind: "concept", term: "MVCC", definition: "Multi-version concurrency control. Readers see a snapshot of the data, so they don't block writers." },
    { id: "c4-selectivity", domain: "d4", kind: "concept", term: "Selectivity", definition: "The share of rows a condition matches. Indexes pay off when it's small." },
    { id: "c4-keyset", domain: "d4", kind: "concept", term: "Keyset pagination", definition: "Page with WHERE (sort_key, id) < last seen values instead of OFFSET, so every page is equally fast." },
    { id: "c4-expand", domain: "d4", kind: "concept", term: "Expand and contract", definition: "A migration with no downtime. Add the new shape, write to both, backfill old rows, switch reads over, then remove the old shape." },
    { id: "c4-rls", domain: "d4", kind: "concept", term: "Row-level security", definition: "PostgreSQL policies that filter which rows each role can see or change." },
    { id: "c4-olap", domain: "d4", kind: "concept", term: "OLTP and OLAP", definition: "OLTP is many small transactions that look rows up by key. OLAP is large scans and aggregates for analytics." },
  ],

  challenges: [
    {
      id: "ch-sql-lost-update",
      domain: "d4",
      lesson: "d4-transactions",
      title: "Reproduce a lost update",
      goal: "Step through a run where both transactions commit successfully but the balance only drops once.",
      hint: "Use the default isolation level and let the application compute the new balance itself.",
      takeaway: "Reading a value, computing in app code and writing it back lets one session overwrite the other's change at READ COMMITTED.",
      render: (onSolved) => <IsolationLab goal="lost" onSolved={onSolved} />,
    },
    {
      id: "ch-sql-safe-withdraw",
      domain: "d4",
      lesson: "d4-transactions",
      title: "Withdraw safely",
      goal: "At READ COMMITTED, step through a run that ends with the correct balance of 40 and no errors.",
      hint: "Either let the database do the arithmetic, or lock the row when you read it.",
      takeaway: "An atomic UPDATE (balance = balance - 30) or SELECT … FOR UPDATE serializes the two writers on the row lock. Stricter levels prevent the bug too, but need retries.",
      render: (onSolved) => <IsolationLab goal="safe" onSolved={onSolved} />,
    },
  ],
});
