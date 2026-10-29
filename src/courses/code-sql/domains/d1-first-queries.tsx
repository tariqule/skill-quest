import { CodeBlock, CodeCompare, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { QueryBuilderLab } from "../labs";
import { sql } from "../sql";
import { TableAnatomy } from "../visuals";

/** World 1: zero to first queries. Tables, SELECT, WHERE, ORDER BY, LIMIT, and changing data. */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "Tables & First Queries",
    world: "The Table Tavern",
    weight: 25,
    emoji: "🍺",
    color: "#38bdf8",
    summary: "What a database and a table are, reading rows with SELECT and WHERE, sorting and limiting, and changing data with INSERT, UPDATE and DELETE.",
  },

  tasks: [
    {
      id: "1.1",
      title: "Tables, rows, columns and types",
      covers: ["What a relational database is and why it exists", "Tables, rows, columns, values", "Data types", "Primary keys and NOT NULL"],
    },
    {
      id: "1.2",
      title: "Reading rows with SELECT and WHERE",
      covers: ["Choosing columns", "Comparison operators", "AND, OR, NOT and precedence", "BETWEEN, IN, LIKE", "Quoting strings vs identifiers"],
    },
    {
      id: "1.3",
      title: "Sorting, limiting and removing duplicates",
      covers: ["ORDER BY with several keys", "ASC and DESC", "LIMIT and OFFSET", "DISTINCT", "Column aliases"],
    },
    {
      id: "1.4",
      title: "Changing data",
      covers: ["INSERT", "UPDATE", "DELETE vs TRUNCATE vs DROP", "RETURNING", "Upserts with ON CONFLICT"],
    },
  ],

  lessons: [
    {
      id: "d1-tables",
      level: "junior",
      task: "1.1",
      title: "What is a table?",
      check: ["d1-01", "d1-02"],
      visual: (
        <div className="grid gap-4">
          <TableAnatomy />
          <CodeBlock
            lang="sql"
            caption="CREATE TABLE describes the shape; every row must fit it."
            code={sql`
              CREATE TABLE customers (
                id    integer PRIMARY KEY,   -- unique, never NULL
                name  text    NOT NULL,      -- must be filled in
                city  text                   -- may be NULL
              );
            `}
          />
        </div>
      ),
      points: [
        "A relational database stores data in tables. A table is like a strict spreadsheet: every row has the same columns, and every column has a type.",
        "One row is one thing (one customer, one order). One column is one fact about every row (name, city).",
        "A primary key uniquely identifies each row, so other tables can point at it.",
        "NULL means \"no value\". It's not 0 and not an empty string.",
        "SQL (Structured Query Language) is how you ask the database to read and change those rows. You describe what you want, and the database works out how to get it.",
      ],
      tip: "Name tables after what one row is (customers, orders) and give every table an id primary key. Future you will thank you.",
    },
    {
      id: "d1-select",
      level: "junior",
      task: "1.2",
      title: "SELECT and WHERE",
      check: ["d1-05", "d1-08"],
      visual: (
        <div className="grid gap-4">
          <QueryBuilderLab />
          <CodeBlock
            lang="sql"
            code={sql`
              SELECT name, salary            -- which columns
              FROM employees                 -- which table
              WHERE dept = 'Eng'             -- which rows
                AND salary BETWEEN 90 AND 110;
            `}
          />
        </div>
      ),
      points: [
        "SELECT picks columns, FROM picks the table, WHERE picks rows. SELECT * means \"every column\".",
        "WHERE keeps a row only when the condition is true. Combine conditions with AND, OR and NOT; AND binds tighter than OR, so use parentheses.",
        "BETWEEN a AND b includes both ends. IN ('a', 'b') is shorthand for several = … OR = … tests.",
        "LIKE matches patterns: % is any run of characters, _ is exactly one. In PostgreSQL, LIKE is case-sensitive and ILIKE isn't.",
        "Text values go in 'single quotes'. \"Double quotes\" name a column or table.",
      ],
      tip: "Write SELECT queries freely: they never change data. That makes them the safest way to explore a new database.",
    },
    {
      id: "d1-sort",
      level: "junior",
      task: "1.3",
      title: "Sorting, limiting and DISTINCT",
      check: ["d1-13", "d1-14"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="sql"
            code={sql`
              SELECT name, dept, salary * 12 AS yearly
              FROM employees
              ORDER BY dept, yearly DESC   -- dept A→Z, then highest pay first
              LIMIT 5 OFFSET 10;           -- skip 10 rows, return the next 5

              SELECT DISTINCT city FROM customers;  -- each city once
            `}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🔀", title: "No ORDER BY = no order", text: "Rows come back in whatever order is cheapest. It can change between runs.", color: "#f472b6" },
              { icon: "✂️", title: "LIMIT after sorting", text: "`LIMIT` keeps the first n rows of the sorted result, so sort first or you get random rows.", color: "#38bdf8" },
              { icon: "🏷️", title: "AS names a column", text: "Aliases from `SELECT` work in `ORDER BY` but not in `WHERE`, which runs earlier.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "ORDER BY sorts by one or more keys. Each key is ASC (default) or DESC; later keys only break ties in earlier ones.",
        "LIMIT n returns at most n rows; OFFSET m skips m rows first. Standard SQL spells it OFFSET m ROWS FETCH FIRST n ROWS ONLY.",
        "DISTINCT removes duplicate rows from the result. All NULLs count as one value for DISTINCT.",
        "PostgreSQL sorts NULLs last in ASC order and first in DESC order (some databases do the opposite). NULLS FIRST / NULLS LAST overrides it.",
      ],
      tip: "When you paginate, sort by something unique (add id as a final key). Otherwise rows with equal values can repeat or vanish between pages.",
    },
    {
      id: "d1-modify",
      level: "intermediate",
      task: "1.4",
      title: "INSERT, UPDATE and DELETE",
      check: ["d1-20", "d1-21"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="sql"
            code={sql`
              INSERT INTO customers (name, city)
              VALUES ('Eli', 'Rome'), ('Fay', NULL)
              RETURNING id;                      -- PostgreSQL: get the new ids back

              UPDATE products SET price = price * 1.1 WHERE category = 'toys';
              DELETE FROM orders WHERE status = 'cancelled';
            `}
          />
          <CodeCompare
            lang="sql"
            left={{ title: "Every row changes", code: sql`
              UPDATE accounts
              SET balance = 0;
              -- no WHERE: all accounts!
            ` }}
            right={{ title: "Check first, then change", code: sql`
              SELECT count(*) FROM accounts WHERE id = 42;
              BEGIN;
              UPDATE accounts SET balance = 0 WHERE id = 42;
              COMMIT;  -- or ROLLBACK
            ` }}
          />
        </div>
      ),
      points: [
        "INSERT adds rows. List the columns you're filling; columns you leave out get their DEFAULT (or NULL).",
        "UPDATE … SET changes columns in every row the WHERE matches. With no WHERE, that's every row in the table.",
        "DELETE removes the rows the WHERE matches. TRUNCATE empties a whole table quickly; DROP TABLE removes the table itself.",
        "PostgreSQL's RETURNING hands back the rows you just inserted, updated or deleted, such as generated ids.",
        "INSERT … ON CONFLICT (key) DO UPDATE / DO NOTHING is PostgreSQL's upsert: insert, or update the row that already has that key.",
      ],
      tip: "Wrap risky changes in BEGIN … COMMIT. Check the row count the database reports, and ROLLBACK if it's not what you expected.",
    },
  ],

  questions: [
    {
      id: "d1-01",
      domain: "d1",
      level: "junior",
      lesson: "d1-tables",
      prompt: "In a `customers` table, what does one row represent?",
      options: ["One customer, with a value for each column", "One fact (such as city) for every customer", "The table's list of column names", "A saved query"],
      answer: [0],
      explanation: "A row is one record: one customer. A column is one attribute that every row has. The column names and types are the table's definition, not a row.",
    },
    {
      id: "d1-02",
      domain: "d1",
      level: "junior",
      lesson: "d1-tables",
      prompt: "Given this table definition, which column is allowed to hold NULL?",
      code: sql`
        CREATE TABLE customers (
          id    integer PRIMARY KEY,
          email text    NOT NULL UNIQUE,
          name  text    NOT NULL,
          city  text
        );
      `,
      codeLang: "sql",
      options: ["`city`", "`id`", "`email`", "`name`"],
      answer: [0],
      explanation: "A primary key is implicitly NOT NULL, and `email` and `name` are declared NOT NULL. Only `city` has no constraint, so it may be NULL.",
    },
    {
      id: "d1-03",
      domain: "d1",
      level: "junior",
      lesson: "d1-tables",
      type: "match",
      prompt: "Match each PostgreSQL type to the data it's best for.",
      pairs: [
        ["`integer`", "A whole number, like a quantity"],
        ["`numeric(10, 2)`", "An exact decimal, like a price"],
        ["`text`", "A string of any length, like a name"],
        ["`boolean`", "A yes/no flag"],
        ["`timestamptz`", "A moment in time, time-zone aware"],
      ],
      explanation:
        "Pick the narrowest type that fits the data: the database then rejects nonsense (like 'abc' in a quantity). `numeric` is exact, so it's the usual choice for money; `timestamptz` stores an absolute instant.",
    },
    {
      id: "d1-04",
      domain: "d1",
      level: "junior",
      lesson: "d1-tables",
      prompt: "Why do applications keep their data in a database rather than in a spreadsheet file?",
      options: [
        "Many users and programs can read and write at the same time while the database enforces rules (types, keys) and keeps changes consistent",
        "Databases keep rows in a fixed order, so lookups are always fast",
        "Tables can't contain duplicate values, so the data is always clean",
        "A database removes the need for backups",
      ],
      answer: [0],
      explanation:
        "Concurrency, constraints and transactions are what a database adds. Rows have no guaranteed order, duplicates are allowed unless you add a constraint, and you still need backups.",
    },
    {
      id: "d1-05",
      domain: "d1",
      level: "junior",
      lesson: "d1-select",
      prompt: "What does this query return?",
      code: sql`
        -- customers (id, name, city):
        -- (1, 'Ana', 'Lisbon'), (2, 'Bo', 'Oslo'), (3, 'Cy', 'Lisbon')
        SELECT name FROM customers WHERE city = 'Lisbon';
      `,
      codeLang: "sql",
      options: ["Two rows: `Ana` and `Cy`", "One row: `Ana`", "One row: `Bo`", "All three names"],
      answer: [0],
      explanation: "WHERE keeps the rows whose city equals 'Lisbon' (Ana and Cy), and SELECT keeps only the name column.",
    },
    {
      id: "d1-06",
      domain: "d1",
      level: "junior",
      lesson: "d1-select",
      prompt: "Which query returns only the `name` and `city` of every customer?",
      options: [
        "`SELECT name, city FROM customers;`",
        "`SELECT * FROM customers WHERE name, city;`",
        "`SELECT customers FROM name, city;`",
        "`GET name, city FROM customers;`",
      ],
      answer: [0],
      explanation: "SELECT lists the columns, FROM names the table. With no WHERE, every row is returned.",
    },
    {
      id: "d1-07",
      domain: "d1",
      level: "junior",
      lesson: "d1-select",
      type: "lines",
      prompt: "In PostgreSQL this fails with `column \"toys\" does not exist`. Tap the buggy line.",
      code: sql`
        SELECT name, price
        FROM products
        WHERE price > 10
          AND category = "toys";
      `,
      codeLang: "sql",
      answer: [4],
      explanation:
        "Double quotes name an identifier (a column or table), so \"toys\" is read as a column. Text values need single quotes: `category = 'toys'`. (SQLite and MySQL are more lenient, but standard SQL and PostgreSQL are not.)",
    },
    {
      id: "d1-08",
      domain: "d1",
      level: "junior",
      lesson: "d1-select",
      prompt: "What does this query return?",
      code: sql`
        -- products (name, price):
        -- ('pen', 2), ('mug', 8), ('lamp', 25), ('desk', 120)
        SELECT name FROM products
        WHERE price BETWEEN 8 AND 25;
      `,
      codeLang: "sql",
      options: ["`mug` and `lamp`", "`lamp` only", "`mug` only", "`pen`, `mug` and `lamp`"],
      answer: [0],
      explanation: "BETWEEN is inclusive on both ends: it means `price >= 8 AND price <= 25`, so 8 and 25 both qualify.",
    },
    {
      id: "d1-09",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-select",
      prompt: "What does this query return?",
      code: sql`
        -- products (name, category, price):
        -- ('ball', 'toys', 5), ('kite', 'toys', 30),
        -- ('lamp', 'home', 25), ('rug', 'home', 90)
        SELECT name FROM products
        WHERE category = 'toys' OR category = 'home' AND price < 50;
      `,
      codeLang: "sql",
      options: ["`ball`, `kite` and `lamp`", "`ball` and `lamp`", "All four products", "`lamp` only"],
      answer: [0],
      explanation:
        "AND binds tighter than OR, so this is `category = 'toys' OR (category = 'home' AND price < 50)`: every toy plus the cheap home item. If you meant \"cheap toys or home items\", write `(category = 'toys' OR category = 'home') AND price < 50`.",
    },
    {
      id: "d1-10",
      domain: "d1",
      level: "junior",
      lesson: "d1-select",
      prompt: "In PostgreSQL, which names does this query return?",
      code: sql`
        -- people (name): 'Anna', 'anna', 'Hannah', 'Ann'
        SELECT name FROM people WHERE name LIKE 'Ann%';
      `,
      codeLang: "sql",
      options: ["`Anna` and `Ann`", "`Anna`, `anna` and `Ann`", "All four names", "`Ann` only"],
      answer: [0],
      explanation:
        "`'Ann%'` means \"starts with Ann\", and % also matches zero characters, so `Ann` counts. PostgreSQL's LIKE is case-sensitive, so `anna` doesn't match (use ILIKE for that). SQLite's LIKE ignores ASCII case, so results differ there.",
    },
    {
      id: "d1-11",
      domain: "d1",
      level: "junior",
      lesson: "d1-select",
      prompt: "`WHERE city IN ('Oslo', 'Rome')` is shorthand for which condition?",
      options: ["`city = 'Oslo' OR city = 'Rome'`", "`city = 'Oslo' AND city = 'Rome'`", "`city LIKE 'Oslo%Rome'`", "`city BETWEEN 'Oslo' AND 'Rome'`"],
      answer: [0],
      explanation: "IN tests whether the value equals any item in the list. A single value can't equal two different strings, so AND would match nothing.",
    },
    {
      id: "d1-12",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-select",
      prompt: "Which conditions are equivalent to `price >= 10 AND price <= 20` for a non-NULL price? (Choose two.)",
      options: ["`price BETWEEN 10 AND 20`", "`NOT (price < 10 OR price > 20)`", "`price IN (10, 20)`", "`price > 10 AND price < 20`", "`price BETWEEN 20 AND 10`"],
      answer: [0, 1],
      explanation:
        "BETWEEN is inclusive, and by De Morgan's law NOT (A OR B) equals NOT A AND NOT B. IN (10, 20) matches only those two values, the strict version drops 10 and 20, and BETWEEN with the bounds reversed matches nothing in standard SQL.",
    },
    {
      id: "d1-13",
      domain: "d1",
      level: "junior",
      lesson: "d1-sort",
      prompt: "In what order are the names returned?",
      code: sql`
        -- employees (name, dept, salary):
        -- ('Ada', 'Eng', 120), ('Ben', 'Eng', 95),
        -- ('Cy', 'Sales', 70), ('Dee', 'Sales', 85)
        SELECT name FROM employees
        ORDER BY dept, salary DESC;
      `,
      codeLang: "sql",
      options: ["`Ada, Ben, Dee, Cy`", "`Ben, Ada, Cy, Dee`", "`Ada, Dee, Ben, Cy`", "`Cy, Dee, Ben, Ada`"],
      answer: [0],
      explanation: "Sort by dept ascending first (Eng before Sales). Within each dept, salary DESC breaks the tie: Ada 120 before Ben 95, then Dee 85 before Cy 70.",
    },
    {
      id: "d1-14",
      domain: "d1",
      level: "junior",
      lesson: "d1-sort",
      prompt: "What does this query return?",
      code: sql`
        -- scores (score): 50, 90, 70, 80, 60
        SELECT score FROM scores
        ORDER BY score DESC
        LIMIT 2 OFFSET 1;
      `,
      codeLang: "sql",
      options: ["`80, 70`", "`90, 80`", "`70, 60`", "`90, 80, 70`"],
      answer: [0],
      explanation: "Sorted descending: 90, 80, 70, 60, 50. OFFSET 1 skips 90, and LIMIT 2 returns the next two: 80 and 70.",
    },
    {
      id: "d1-15",
      domain: "d1",
      level: "junior",
      lesson: "d1-sort",
      prompt: "A query has no ORDER BY. In what order does the database return the rows?",
      options: [
        "No guaranteed order: it can differ between runs, versions or plans",
        "The order the rows were inserted",
        "Sorted by primary key",
        "Alphabetically by the first column",
      ],
      answer: [0],
      explanation:
        "Tables are unordered sets. Rows often appear in insertion or key order by coincidence, but updates, parallel scans and new plans change that. Only ORDER BY guarantees an order.",
    },
    {
      id: "d1-16",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-sort",
      prompt: "How many rows does this query return?",
      code: sql`
        -- customers (city): 'Oslo', 'Lisbon', 'Oslo', NULL, NULL
        SELECT DISTINCT city FROM customers;
      `,
      codeLang: "sql",
      options: ["3", "2", "4", "5"],
      answer: [0],
      explanation: "DISTINCT treats NULLs as duplicates of each other, so the result is Oslo, Lisbon and one NULL. (This is different from `=`, where NULL never equals NULL.)",
    },
    {
      id: "d1-17",
      domain: "d1",
      level: "junior",
      lesson: "d1-sort",
      type: "order",
      prompt: "Put these clauses in the order you must write them.",
      items: ["`SELECT name, salary`", "`FROM employees`", "`WHERE dept = 'Eng'`", "`ORDER BY salary DESC`", "`LIMIT 3`"],
      explanation: "SQL's written order is SELECT, FROM, WHERE, (GROUP BY, HAVING), ORDER BY, LIMIT. The database runs them in a different order, starting with FROM.",
    },
    {
      id: "d1-18",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-sort",
      type: "lines",
      prompt: "PostgreSQL rejects this with `column \"yearly\" does not exist`. Tap the line that causes the error.",
      code: sql`
        SELECT name, salary * 12 AS yearly
        FROM employees
        WHERE yearly > 100000
        ORDER BY yearly DESC;
      `,
      codeLang: "sql",
      answer: [3],
      explanation:
        "WHERE is evaluated before SELECT, so the alias doesn't exist yet. Repeat the expression (`WHERE salary * 12 > 100000`) or wrap the query in a subquery. ORDER BY runs after SELECT, so it can use the alias.",
    },
    {
      id: "d1-19",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-sort",
      prompt: "In PostgreSQL, where do NULL values appear in `ORDER BY city ASC`?",
      options: ["Last, after all non-NULL cities", "First, before all non-NULL cities", "They are left out of the result", "Randomly among the other rows"],
      answer: [0],
      explanation:
        "PostgreSQL treats NULL as larger than every value: last in ASC, first in DESC. SQLite and MySQL do the opposite. Write `NULLS FIRST` or `NULLS LAST` when it matters.",
    },
    {
      id: "d1-20",
      domain: "d1",
      level: "junior",
      lesson: "d1-modify",
      prompt: "What does `SELECT SUM(price)` return after the UPDATE?",
      code: sql`
        -- products (name, price): ('pen', 2), ('mug', 8), ('lamp', 25)
        UPDATE products SET price = price * 2 WHERE price < 10;
        SELECT SUM(price) FROM products;
      `,
      codeLang: "sql",
      options: ["45", "70", "35", "29"],
      answer: [0],
      explanation: "Only pen (2 → 4) and mug (8 → 16) match `price < 10`; lamp stays 25. 4 + 16 + 25 = 45.",
    },
    {
      id: "d1-21",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-modify",
      type: "lines",
      prompt: "Run in psql, this sets every account's balance to 0 and then reports a syntax error. Tap the buggy line.",
      code: sql`
        UPDATE accounts
        SET balance = 0;
        WHERE id = 42;
      `,
      codeLang: "sql",
      answer: [2],
      explanation:
        "The semicolon ends the statement early, so `UPDATE accounts SET balance = 0` runs with no WHERE and changes every row. The leftover `WHERE id = 42;` is then a syntax error on its own.",
    },
    {
      id: "d1-22",
      domain: "d1",
      level: "junior",
      lesson: "d1-modify",
      prompt: "Which statement adds a new customer?",
      options: [
        "`INSERT INTO customers (name, city) VALUES ('Eli', 'Rome');`",
        "`ADD INTO customers VALUES ('Eli', 'Rome');`",
        "`UPDATE customers ADD ('Eli', 'Rome');`",
        "`INSERT customers WHERE name = 'Eli';`",
      ],
      answer: [0],
      explanation: "INSERT INTO table (columns) VALUES (values). Listing the columns keeps the statement working even if the table later gains a column.",
    },
    {
      id: "d1-23",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-modify",
      type: "match",
      prompt: "Match each statement to what it does.",
      pairs: [
        ["`DELETE FROM t WHERE …`", "Removes the matching rows"],
        ["`TRUNCATE t`", "Quickly empties the table but keeps it"],
        ["`DROP TABLE t`", "Removes the table and all its data"],
        ["`ALTER TABLE t ADD COLUMN c text`", "Changes the table's structure"],
      ],
      explanation:
        "DELETE works row by row and respects WHERE. TRUNCATE skips the per-row work and removes everything at once. DROP removes the definition too. ALTER changes columns and constraints.",
    },
    {
      id: "d1-24",
      domain: "d1",
      level: "senior",
      lesson: "d1-modify",
      prompt: "What does the final SELECT return in PostgreSQL?",
      code: sql`
        -- stock (sku PRIMARY KEY, qty) has one row: ('A1', 5)
        INSERT INTO stock (sku, qty) VALUES ('A1', 3), ('B2', 4)
        ON CONFLICT (sku) DO UPDATE SET qty = stock.qty + EXCLUDED.qty;

        SELECT sku, qty FROM stock ORDER BY sku;
      `,
      codeLang: "sql",
      options: ["`A1 8` and `B2 4`", "`A1 3` and `B2 4`", "`A1 5` and `B2 4`", "An error: duplicate key value violates unique constraint"],
      answer: [0],
      explanation:
        "B2 is new, so it's inserted. A1 conflicts on the key, so the DO UPDATE branch runs: `stock.qty` is the existing 5 and `EXCLUDED.qty` is the 3 you tried to insert, giving 8.",
    },
    {
      id: "d1-25",
      domain: "d1",
      level: "senior",
      lesson: "d1-modify",
      prompt: "What does `INSERT … RETURNING id` give you in PostgreSQL?",
      options: [
        "The id of each inserted row (including generated ones) in the same round trip",
        "The number of rows inserted",
        "The id of the last row in the table, which may belong to another session",
        "Nothing; RETURNING only works with SELECT",
      ],
      answer: [0],
      explanation:
        "RETURNING works on INSERT, UPDATE and DELETE and returns column values from the affected rows. It's safer than \"select the max id\" afterwards, which races with other sessions.",
    },
    {
      id: "d1-26",
      domain: "d1",
      level: "staff",
      lesson: "d1-select",
      prompt: "Your team's style guide bans `SELECT *` in application code. What is the strongest reason?",
      options: [
        "When columns are added or reordered, the code silently receives a different shape, and it fetches columns it never uses",
        "`SELECT *` is deprecated in the SQL standard",
        "`SELECT *` locks the whole table",
        "`SELECT *` can't be combined with WHERE",
      ],
      answer: [0],
      explanation:
        "Explicit columns make the query a stable contract: a migration that adds a large column doesn't change what every caller downloads, and narrow column lists can be served by covering indexes. `SELECT *` is fine for exploring by hand.",
    },
    {
      id: "d1-27",
      domain: "d1",
      level: "staff",
      lesson: "d1-modify",
      type: "order",
      prompt: "You must fix bad data in production with a one-off UPDATE. Put the safe steps in order.",
      items: [
        "Run the WHERE clause as a `SELECT count(*)` and check the rows it finds",
        "`BEGIN;` a transaction",
        "Run the `UPDATE` and compare the reported row count with the SELECT",
        "`COMMIT;` if the counts match, otherwise `ROLLBACK;`",
      ],
      explanation:
        "Preview, then change inside a transaction, verify, and only then make it permanent. Many teams also require a second reviewer and keep the script in version control.",
    },
    {
      id: "d1-28",
      domain: "d1",
      level: "intermediate",
      lesson: "d1-tables",
      prompt: "What does this return in PostgreSQL?",
      code: sql`
        SELECT 7 / 2 AS a, 7 / 2.0 AS b;
      `,
      codeLang: "sql",
      options: ["`a = 3`, `b = 3.5`", "`a = 3.5`, `b = 3.5`", "`a = 4`, `b = 3.5`", "`a = 3`, `b = 3`"],
      answer: [0],
      explanation:
        "Dividing two integers gives an integer, truncated toward zero. If either side is a decimal (`2.0` is numeric), the result is numeric. Cast one side (`7::numeric / 2`) when you need fractions.",
    },
  ],

  cards: [
    { id: "c1-select", domain: "d1", kind: "service", term: "SELECT", definition: "Reads data: chooses the columns (or expressions) to return." },
    { id: "c1-where", domain: "d1", kind: "service", term: "WHERE", definition: "Keeps only the rows for which a condition is true." },
    { id: "c1-orderby", domain: "d1", kind: "service", term: "ORDER BY", definition: "Sorts the result by one or more keys, each ASC or DESC." },
    { id: "c1-limit", domain: "d1", kind: "service", term: "LIMIT / OFFSET", definition: "Returns at most n rows after skipping m. Sort first, or the rows are arbitrary." },
    { id: "c1-distinct", domain: "d1", kind: "service", term: "DISTINCT", definition: "Removes duplicate rows from the result (all NULLs count as one value)." },
    { id: "c1-like", domain: "d1", kind: "service", term: "LIKE", definition: "Pattern match: % is any run of characters, _ is one. Case-sensitive in PostgreSQL; ILIKE isn't." },
    { id: "c1-insert", domain: "d1", kind: "service", term: "INSERT", definition: "Adds new rows: INSERT INTO t (cols) VALUES (…)." },
    { id: "c1-update", domain: "d1", kind: "service", term: "UPDATE", definition: "Changes column values in every row the WHERE matches (all rows if there's no WHERE)." },
    { id: "c1-delete", domain: "d1", kind: "service", term: "DELETE", definition: "Removes the rows the WHERE matches." },
    { id: "c1-returning", domain: "d1", kind: "service", term: "RETURNING", definition: "PostgreSQL: returns values from the rows an INSERT, UPDATE or DELETE touched." },
    { id: "c1-onconflict", domain: "d1", kind: "service", term: "ON CONFLICT", definition: "PostgreSQL upsert: on a unique-key clash, DO NOTHING or DO UPDATE using EXCLUDED values." },
    { id: "c1-table", domain: "d1", kind: "concept", term: "Table", definition: "A named set of rows that all have the same typed columns. Rows have no built-in order." },
    { id: "c1-pk", domain: "d1", kind: "concept", term: "Primary key", definition: "Column(s) whose values are unique and never NULL, identifying exactly one row." },
    { id: "c1-null", domain: "d1", kind: "concept", term: "NULL", definition: "A marker for a missing or unknown value. Not zero, not an empty string." },
    { id: "c1-quotes", domain: "d1", kind: "concept", term: "Single vs double quotes", definition: "'text' is a string value; \"name\" is an identifier such as a column or table." },
  ],

  challenges: [
    {
      id: "ch-sql-top-eng",
      domain: "d1",
      lesson: "d1-select",
      title: "Top two engineers",
      goal: "Make the query return exactly the two highest-paid engineers, highest first.",
      hint: "Filter to Eng, sort by salary from high to low, then keep two rows.",
      takeaway: "WHERE picks rows, ORDER BY sorts them, and LIMIT keeps the first n of the sorted result. Without ORDER BY, LIMIT returns arbitrary rows.",
      render: (onSolved) => <QueryBuilderLab goal="topEng" onSolved={onSolved} />,
    },
    {
      id: "ch-sql-lowest",
      domain: "d1",
      lesson: "d1-sort",
      title: "Cheapest outside Lisbon",
      goal: "Return only the lowest-paid person who works in Oslo or Rome.",
      hint: "The lowest-paid person overall works in Lisbon, so you need a filter before sorting ascending and limiting.",
      takeaway: "Filtering happens before sorting and limiting, so \"the lowest X among Y\" is WHERE Y, ORDER BY X ASC, LIMIT 1.",
      render: (onSolved) => <QueryBuilderLab goal="lowest" onSolved={onSolved} />,
    },
  ],
});
