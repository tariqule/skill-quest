import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { GroupByLab, JoinLab } from "../labs";
import { sql } from "../sql";
import { NullLogic } from "../visuals";

/** World 2: combining tables with joins, summarising with GROUP BY, and NULL's three-valued logic. */
export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "Joins, Groups & NULL",
    world: "Join Junction",
    weight: 25,
    emoji: "🔗",
    color: "#34d399",
    summary: "Inner and outer joins, self joins and anti-joins, aggregates with GROUP BY and HAVING, the logical order of a query, and how NULL really behaves.",
  },

  tasks: [
    {
      id: "2.1",
      title: "Joining tables",
      covers: ["INNER JOIN and the ON condition", "LEFT, RIGHT and FULL OUTER JOIN", "CROSS JOIN", "Self joins", "Anti-joins", "Table aliases and ambiguous columns"],
    },
    {
      id: "2.2",
      title: "Aggregating with GROUP BY",
      covers: ["COUNT, SUM, AVG, MIN, MAX", "GROUP BY and HAVING", "Logical query processing order", "Join fan-out and double counting"],
    },
    {
      id: "2.3",
      title: "NULL and three-valued logic",
      covers: ["TRUE, FALSE and UNKNOWN", "IS NULL and IS DISTINCT FROM", "COALESCE and NULLIF", "NULL in aggregates, arithmetic and constraints"],
    },
  ],

  lessons: [
    {
      id: "d2-start-join",
      level: "beginner",
      task: "2.1",
      title: "Why data lives in several tables",
      check: ["sql-b2-01", "sql-b2-02"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={2}
            tiles={[
              { icon: "👤", title: "customers", text: "One row per customer: id, name, city. Each customer is written down once.", color: "#34d399" },
              { icon: "🧾", title: "orders", text: "One row per order: id, total, and the customer_id of whoever placed it.", color: "#38bdf8" },
            ]}
          />
          <CodeBlock
            lang="sql"
            caption="Each order, next to the name of the customer who placed it."
            code={sql`
              SELECT customers.name, orders.total
              FROM orders
              JOIN customers ON orders.customer_id = customers.id;
            `}
          />
        </div>
      ),
      points: [
        "Real apps split data across tables. A shop keeps one table of customers and another of orders, so each customer's details are written down once, not on every order.",
        "Each order stores the customer's id instead. It's like a restaurant ticket that says \"table 4\" rather than describing the people sitting there.",
        "A join follows those ids and puts matching rows side by side. That's how you see each order next to the name of the customer who placed it.",
        "You write it as JOIN … ON. The ON part says which columns must match, here `orders.customer_id` and `customers.id`.",
      ],
      tip: "A column whose name ends in _id usually points at a row in another table. That's your clue for what to join.",
    },
    {
      id: "d2-start-count",
      level: "beginner",
      task: "2.2",
      title: "Counting and adding up",
      check: ["sql-b2-03", "sql-b2-05"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="sql"
            code={sql`
              SELECT COUNT(*) FROM orders;      -- how many orders?
              SELECT SUM(total) FROM orders;    -- how much in total?

              SELECT customer_id, COUNT(*)      -- how many orders each?
              FROM orders
              GROUP BY customer_id;
            `}
          />
        </div>
      ),
      points: [
        "Often you don't want the rows themselves. You want a summary, like how many orders came in today or how much was spent.",
        "COUNT(*) counts rows and SUM(total) adds up a column. AVG, MIN and MAX give the average, the smallest and the largest value.",
        "GROUP BY splits the rows into piles before counting, like sorting receipts into one pile per customer. You get one result row for each pile.",
      ],
      tip: "Start with a plain `SELECT COUNT(*) FROM orders;` before grouping. Knowing how many rows you have makes every later result easier to check.",
    },
    {
      id: "d2-inner",
      level: "junior",
      task: "2.1",
      title: "Joins: matching rows across tables",
      check: ["d2-01", "d2-03"],
      visual: (
        <div className="grid gap-4">
          <JoinLab />
          <CodeBlock
            lang="sql"
            code={sql`
              SELECT c.name, o.id AS order_id, o.total
              FROM customers AS c
              JOIN orders AS o            -- JOIN means INNER JOIN
                ON o.customer_id = c.id;  -- which pairs belong together
            `}
          />
        </div>
      ),
      points: [
        "Data is split across tables (customers, orders) so each fact is stored once. A join puts it back together for one query.",
        "The ON condition decides which pairs of rows belong together, usually a foreign key matching a primary key.",
        "INNER JOIN (or just JOIN) keeps only pairs that match. A customer with three orders appears three times; one with none disappears.",
        "Give tables short nicknames, called aliases (c, o), and put them in front of column names. When two tables share a column name like id, the prefix is required.",
        "CROSS JOIN pairs every row with every row, so 3 rows and 4 rows give 12. Forgetting a join condition does the same by accident.",
      ],
      tip: "Before writing a join, say out loud how many rows you expect back. If the real count is much larger, a join is multiplying rows.",
    },
    {
      id: "d2-outer",
      level: "intermediate",
      task: "2.1",
      title: "Outer joins and anti-joins",
      check: ["d2-06", "d2-08"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "⬅️", title: "LEFT JOIN", text: "Every row from the left table; NULLs where the right has no match.", color: "#38bdf8" },
              { icon: "➡️", title: "RIGHT JOIN", text: "Every row from the right table. Same as a LEFT JOIN with the tables swapped.", color: "#f59e0b" },
              { icon: "↔️", title: "FULL JOIN", text: "Everything from both sides, padded with NULLs where either side is missing.", color: "#a78bfa" },
              { icon: "🚫", title: "Anti-join", text: "`LEFT JOIN … WHERE right.id IS NULL` keeps only the rows with no match.", color: "#fb7185" },
            ]}
          />
          <CodeCompare
            lang="sql"
            left={{ title: "WHERE on the right table: rows vanish", code: sql`
              SELECT c.name, o.id
              FROM customers c
              LEFT JOIN orders o ON o.customer_id = c.id
              WHERE o.status = 'paid';
              -- customers with no paid order are gone
            ` }}
            right={{ title: "Condition in ON: everyone stays", code: sql`
              SELECT c.name, o.id
              FROM customers c
              LEFT JOIN orders o ON o.customer_id = c.id
                              AND o.status = 'paid';
              -- unmatched customers get o.id = NULL
            ` }}
          />
        </div>
      ),
      points: [
        "Outer joins keep unmatched rows and fill the other side's columns with NULL.",
        "A WHERE condition on the optional (right) side of a LEFT JOIN throws away the NULL rows, quietly turning it back into an inner join. Put such conditions in ON.",
        "An anti-join finds rows with no match, such as customers who never ordered. Write a LEFT JOIN, then WHERE right.key IS NULL. NOT EXISTS does the same.",
        "A self join joins a table to itself with two aliases, for example employees e and their managers m.",
        "A `FULL OUTER JOIN` (or just `FULL JOIN`) keeps every row from both tables. Rows with no match on the other side get NULLs there. MySQL doesn't support it; combine a LEFT and RIGHT join with UNION instead.",
      ],
      tip: "When a LEFT JOIN result is missing rows, look at the WHERE clause first. It's almost always a filter on the right-hand table.",
    },
    {
      id: "d2-groupby",
      level: "intermediate",
      task: "2.2",
      title: "GROUP BY and HAVING",
      check: ["d2-14", "d2-16"],
      visual: (
        <div className="grid gap-4">
          <GroupByLab />
          <Flow
            color="#34d399"
            steps={[
              { icon: "📥", label: "FROM / JOIN", sub: "Build the rows" },
              { icon: "🧹", label: "WHERE", sub: "Filter rows" },
              { icon: "🪣", label: "GROUP BY", sub: "Rows → buckets" },
              { icon: "🔍", label: "HAVING", sub: "Filter buckets" },
              { icon: "🧾", label: "SELECT", sub: "Compute columns, aliases" },
              { icon: "↕️", label: "ORDER BY", sub: "Sort (aliases OK)" },
              { icon: "✂️", label: "LIMIT", sub: "Keep the first n" },
            ]}
          />
        </div>
      ),
      points: [
        "Aggregate functions squash many rows into one value. The common ones are COUNT(*), COUNT(col), SUM, AVG, MIN and MAX.",
        "GROUP BY puts rows with equal key values into buckets and returns one row per bucket. Every selected column must be grouped or aggregated.",
        "WHERE filters rows before grouping, and HAVING filters groups after. Aggregates are allowed in HAVING but not in WHERE.",
        "The database runs a query in a logical order (FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT), which explains most \"why can't I use that here?\" errors.",
        "If you join an order to its three items and then sum the order's total, the total is counted three times. This is called fan-out. Aggregate the children first.",
        "Joining one parent to two child tables multiplies rows (each item pairs with each payment), so sums inflate. Aggregate each child in its own **subquery** or CTE (a named `WITH` query) first, one row per parent, then join.",
      ],
      tip: "Ask \"what is one row of my result?\" (one customer, one day). That's your GROUP BY.",
    },
    {
      id: "d2-nulls",
      level: "intermediate",
      task: "2.3",
      title: "NULL and three-valued logic",
      check: ["d2-22", "d2-26"],
      visual: (
        <div className="grid gap-4">
          <NullLogic />
          <CodeBlock
            lang="sql"
            code={sql`
              SELECT name FROM employees WHERE manager_id IS NULL;   -- not = NULL
              SELECT COALESCE(nickname, name) FROM users;            -- first non-NULL
              SELECT total / NULLIF(qty, 0) FROM lines;               -- NULL instead of divide-by-zero
              SELECT a IS DISTINCT FROM b FROM t;                     -- NULL-safe "not equal"
            `}
          />
        </div>
      ),
      points: [
        "SQL logic has three values: TRUE, FALSE and UNKNOWN (NULL). Comparing anything with NULL gives UNKNOWN, even `NULL = NULL`.",
        "WHERE, ON and HAVING keep rows only when the condition is TRUE, so UNKNOWN rows are dropped. Test for NULL with IS NULL or IS NOT NULL.",
        "Arithmetic and || with NULL give NULL. COALESCE(a, b, …) returns the first non-NULL argument.",
        "Aggregates skip NULLs (COUNT(col), SUM, AVG), but COUNT(*) counts every row. SUM over no rows is NULL, not 0.",
        "`x <> 'Oslo'` is UNKNOWN when x is NULL. So rows with a NULL city are left out of both `city = 'Oslo'` and `city <> 'Oslo'`.",
        "A `UNIQUE` constraint ignores NULLs by default in PostgreSQL, because NULL never equals NULL. Any number of rows can have a NULL there. PostgreSQL 15+ can forbid this with `UNIQUE NULLS NOT DISTINCT`.",
      ],
      tip: "Make columns NOT NULL unless \"unknown\" is a real state. Every nullable column is a question every query has to answer.",
    },
  ],

  questions: [
    {
      id: "sql-b2-01",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-join",
      prompt: "Why does an `orders` table store a `customer_id` instead of the customer's name and address?",
      options: [
        "So each customer's details are stored once, and every order points to them",
        "Because a table can't hold text",
        "To make the orders table as large as possible on the server's disk",
        "Because SQL can't read names",
      ],
      answer: [0],
      explanation:
        "Storing the details once means a change of address only has to be made in one place. Every order just points at the customer by id. Tables can hold text perfectly well, so that's not the reason.",
    },
    {
      id: "sql-b2-02",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-join",
      prompt: "What does a join do?",
      options: [
        "Puts matching rows from two tables side by side in one result",
        "Copies every row of one table into another, new table",
        "Deletes the rows that appear in both tables",
        "Turns two tables into one new permanent table",
      ],
      answer: [0],
      explanation:
        "A join combines rows from two tables in the result of a query, using a condition to decide which rows match. It doesn't change or copy the tables themselves.",
    },
    {
      id: "sql-b2-03",
      type: "output",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-count",
      prompt: "Type the number this query returns.",
      code: "-- orders(id, customer_id, total)\n-- (10, 1, 20)  (11, 1, 5)  (12, 2, 15)  (13, 3, 40)\nSELECT COUNT(*) FROM orders;",
      codeLang: "sql",
      answers: ["4"],
      explanation:
        "COUNT(*) counts rows, and the table has four orders. It doesn't matter that customer 1 placed two of them: each order is its own row.",
    },
    {
      id: "sql-b2-04",
      type: "output",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-count",
      prompt: "Type the number this query returns.",
      code: "-- orders(id, customer_id, total)\n-- (10, 1, 20)  (11, 1, 5)  (12, 2, 15)  (13, 3, 40)\nSELECT SUM(total) FROM orders;",
      codeLang: "sql",
      answers: ["80"],
      explanation:
        "SUM adds up the values in a column. Here that's 20 plus 5 plus 15 plus 40, which is 80. COUNT(*) would give 4 instead, the number of rows.",
    },
    {
      id: "sql-b2-05",
      type: "fill",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-count",
      prompt: "Fill the gap to get one row per customer, with how many orders each placed.",
      code: "SELECT customer_id, COUNT(*)\nFROM orders\n{{1}} customer_id;",
      codeLang: "sql",
      blanks: [{ options: ["GROUP BY", "ORDER BY", "WHERE", "JOIN"], answer: 0 }],
      explanation:
        "GROUP BY makes one pile of rows per customer_id, and COUNT(*) counts each pile. ORDER BY only sorts, so PostgreSQL would complain that customer_id isn't grouped.",
    },
    {
      id: "sql-b2-06",
      type: "fill",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-join",
      prompt: "Fill the gap so each order is shown next to the name of the customer who placed it.",
      code: "SELECT customers.name, orders.total\nFROM orders\nJOIN customers {{1}} orders.customer_id = customers.id;",
      codeLang: "sql",
      blanks: [{ options: ["ON", "IF", "TO", "AS"], answer: 0 }],
      explanation:
        "ON comes right after the joined table and says which columns must match. Here an order belongs to the customer whose id matches the order's customer_id.",
    },
    {
      id: "d2-01",
      domain: "d2",
      level: "junior",
      lesson: "d2-inner",
      prompt: "How many rows does this query return?",
      code: sql`
        -- customers (id, name): (1, 'Ana'), (2, 'Bo'), (3, 'Cy')
        -- orders (id, customer_id): (10, 1), (11, 1), (12, 3)
        SELECT c.name, o.id
        FROM customers c
        JOIN orders o ON o.customer_id = c.id;
      `,
      codeLang: "sql",
      options: ["3", "2", "4", "9"],
      answer: [0],
      explanation: "An inner join returns one row per matching pair: Ana–10, Ana–11 and Cy–12. Bo has no orders, so Bo doesn't appear.",
    },
    {
      id: "d2-02",
      domain: "d2",
      level: "junior",
      lesson: "d2-inner",
      prompt: "In `JOIN orders o ON o.customer_id = c.id`, what does the ON clause do?",
      options: [
        "Decides which pairs of rows from the two tables belong together",
        "Chooses which of the columns appear in the final result",
        "Sorts the joined rows",
        "Creates an index on customer_id",
      ],
      answer: [0],
      explanation: "ON is the match condition. Each customer row is paired with every order row for which the condition is true.",
    },
    {
      id: "d2-03",
      domain: "d2",
      level: "junior",
      lesson: "d2-inner",
      type: "lines",
      prompt: "This should list each customer's orders, but it pairs customers with unrelated orders. Tap the buggy line.",
      code: sql`
        SELECT c.name, o.total
        FROM customers c
        JOIN orders o
          ON o.id = c.id;
      `,
      codeLang: "sql",
      answer: [4],
      explanation: "It matches an order's own id with a customer's id, which is meaningless. The foreign key is `o.customer_id`: `ON o.customer_id = c.id`.",
    },
    {
      id: "d2-04",
      domain: "d2",
      level: "junior",
      lesson: "d2-inner",
      prompt: "`sizes` has 3 rows and `colors` has 4. How many rows does this return?",
      code: sql`
        SELECT s.size, c.color
        FROM sizes s
        CROSS JOIN colors c;
      `,
      codeLang: "sql",
      options: ["12", "7", "4", "16"],
      answer: [0],
      explanation: "A CROSS JOIN pairs every row with every row (a Cartesian product), so 3 times 4 gives 12. It's useful for generating combinations and dangerous when it happens by accident.",
    },
    {
      id: "d2-05",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-inner",
      type: "lines",
      prompt: "PostgreSQL rejects this with `column reference \"id\" is ambiguous`. Tap the line that causes the error.",
      code: sql`
        SELECT id, name, total
        FROM customers c
        JOIN orders o ON o.customer_id = c.id;
      `,
      codeLang: "sql",
      answer: [1],
      explanation: "Both tables have an `id` column, so a bare `id` in the SELECT list could mean either. Qualify it: `c.id` or `o.id`.",
    },
    {
      id: "d2-06",
      domain: "d2",
      level: "junior",
      lesson: "d2-outer",
      prompt: "Which row appears in this result but would not appear with a plain JOIN?",
      code: sql`
        -- customers (id, name): (1, 'Ana'), (2, 'Bo'), (3, 'Cy')
        -- orders (id, customer_id): (10, 1), (11, 1), (12, 3)
        SELECT c.name, o.id
        FROM customers c
        LEFT JOIN orders o ON o.customer_id = c.id;
      `,
      codeLang: "sql",
      options: ["`Bo | NULL`", "`Ana | 11`", "`NULL | 12`", "`Cy | NULL`"],
      answer: [0],
      explanation: "LEFT JOIN keeps every customer. Bo has no orders, so Bo appears once with NULL in the order columns. Cy does have an order (12).",
    },
    {
      id: "d2-07",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-outer",
      prompt: "Which query lists customers who have never placed an order?",
      options: [
        "`SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL;`",
        "`SELECT c.name FROM customers c JOIN orders o ON o.customer_id = c.id WHERE o.id IS NULL;`",
        "`SELECT c.name FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.id = NULL;`",
        "`SELECT c.name FROM customers c RIGHT JOIN orders o ON o.customer_id = c.id WHERE c.id IS NULL;`",
      ],
      answer: [0],
      explanation:
        "That's the anti-join pattern: keep everyone with LEFT JOIN, then keep only those whose order side is NULL. An inner join never produces such rows, `= NULL` is never true, and the RIGHT JOIN version finds orders with no customer.",
    },
    {
      id: "d2-08",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-outer",
      prompt: "The author wanted every customer, plus their paid orders where they have any. What does this return?",
      code: sql`
        -- customers (id, name): (1, 'Ana'), (2, 'Bo')
        -- orders (id, customer_id, status): (10, 1, 'paid'), (11, 2, 'refunded')
        SELECT c.name, o.id
        FROM customers c
        LEFT JOIN orders o ON o.customer_id = c.id
        WHERE o.status = 'paid';
      `,
      codeLang: "sql",
      options: ["Only `Ana | 10`", "`Ana | 10` and `Bo | NULL`", "`Ana | 10` and `Bo | 11`", "No rows"],
      answer: [0],
      explanation:
        "The join produces Ana–10 and Bo–11. Then WHERE drops Bo's row because its status is 'refunded'. Moving the filter into the ON clause (`… AND o.status = 'paid'`) keeps Bo with a NULL order.",
    },
    {
      id: "d2-09",
      domain: "d2",
      level: "senior",
      lesson: "d2-outer",
      type: "lines",
      prompt: "Customers with no paid orders should be listed with 0, but they're missing entirely. Tap the buggy line.",
      code: sql`
        SELECT c.name, COUNT(o.id) AS paid_orders
        FROM customers c
        LEFT JOIN orders o ON o.customer_id = c.id
        WHERE o.status = 'paid'
        GROUP BY c.name;
      `,
      codeLang: "sql",
      answer: [4],
      explanation:
        "For customers with no paid orders, `o.status` is NULL or something else, so WHERE removes them before grouping. Put the condition in the join (`ON o.customer_id = c.id AND o.status = 'paid'`) and `COUNT(o.id)` counts 0 for them.",
    },
    {
      id: "d2-10",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-outer",
      prompt: "How many rows does this FULL JOIN return?",
      code: sql`
        -- customers (id, name): (1, 'Ana'), (2, 'Bo')
        -- orders (id, customer_id): (10, 1), (11, NULL)
        SELECT c.name, o.id
        FROM customers c
        FULL JOIN orders o ON o.customer_id = c.id;
      `,
      codeLang: "sql",
      options: ["3", "1", "2", "4"],
      answer: [0],
      explanation: "One matched pair (Ana–10), Bo with no order (Bo–NULL), and order 11 with no customer (NULL–11). NULL never equals 1 or 2, so order 11 can't match anyone.",
    },
    {
      id: "d2-11",
      domain: "d2",
      level: "junior",
      lesson: "d2-outer",
      type: "match",
      prompt: "Match each join to the rows it keeps.",
      pairs: [
        ["`INNER JOIN`", "Only pairs that match"],
        ["`LEFT JOIN`", "All left rows, NULLs for missing right rows"],
        ["`RIGHT JOIN`", "All right rows, NULLs for missing left rows"],
        ["`FULL JOIN`", "All rows from both sides"],
        ["`CROSS JOIN`", "Every left row paired with every right row"],
      ],
      explanation: "An inner join keeps only matching pairs. Outer joins add unmatched rows from one side or both, padded with NULLs. A cross join pairs everything with everything, with no condition.",
    },
    {
      id: "d2-12",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-outer",
      prompt: "What does this self join return?",
      code: sql`
        -- employees (id, name, manager_id):
        -- (1, 'Ada', NULL), (2, 'Ben', 1), (3, 'Cy', 1), (4, 'Dee', 3)
        SELECT e.name, m.name AS manager
        FROM employees e
        LEFT JOIN employees m ON m.id = e.manager_id
        ORDER BY e.id;
      `,
      codeLang: "sql",
      options: [
        "4 rows; Ada's manager is NULL and Dee's is Cy",
        "3 rows (Ada is missing); Dee's manager is Cy",
        "4 rows; Dee's manager is Ada",
        "An error: a table can't be joined to itself",
      ],
      answer: [0],
      explanation:
        "The aliases e and m make two independent copies of the table. LEFT JOIN keeps Ada even though she has no manager. Dee's manager_id is 3, which is Cy. An inner join would drop Ada.",
    },
    {
      id: "d2-13",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-groupby",
      prompt: "What does this return?",
      code: sql`
        -- orders (id, coupon): (1, 'SAVE5'), (2, NULL), (3, 'SAVE5'), (4, NULL)
        SELECT COUNT(*), COUNT(coupon), COUNT(DISTINCT coupon)
        FROM orders;
      `,
      codeLang: "sql",
      options: ["`4, 2, 1`", "`4, 4, 2`", "`4, 2, 2`", "`2, 2, 1`"],
      answer: [0],
      explanation: "COUNT(*) counts rows (4). COUNT(coupon) counts non-NULL values (2). COUNT(DISTINCT coupon) counts distinct non-NULL values (just 'SAVE5').",
    },
    {
      id: "d2-14",
      domain: "d2",
      level: "junior",
      lesson: "d2-groupby",
      prompt: "What does this return?",
      code: sql`
        -- orders (customer, total):
        -- ('Ana', 30), ('Ana', 45), ('Bo', 40), ('Cy', 60)
        SELECT customer, SUM(total)
        FROM orders
        GROUP BY customer
        ORDER BY customer;
      `,
      codeLang: "sql",
      options: ["`Ana 75`, `Bo 40`, `Cy 60`", "`Ana 30`, `Ana 45`, `Bo 40`, `Cy 60`", "`Ana 175`", "`Ana 2`, `Bo 1`, `Cy 1`"],
      answer: [0],
      explanation: "GROUP BY makes one bucket per customer, and SUM adds the totals in each bucket. The last option is what COUNT(*) would give.",
    },
    {
      id: "d2-15",
      domain: "d2",
      level: "junior",
      lesson: "d2-groupby",
      prompt: "Which clause filters groups after they've been aggregated?",
      options: ["`HAVING`", "`WHERE`", "`ORDER BY`", "`DISTINCT`"],
      answer: [0],
      explanation: "WHERE filters individual rows before grouping. HAVING filters whole groups after GROUP BY, so it can use aggregates like `HAVING SUM(total) > 100`.",
    },
    {
      id: "d2-16",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-groupby",
      prompt: "What does this return?",
      code: sql`
        -- orders (customer, total):
        -- ('Ana', 30), ('Ana', 45), ('Bo', 40), ('Bo', 25), ('Cy', 60)
        SELECT customer, COUNT(*) AS n
        FROM orders
        WHERE total > 28
        GROUP BY customer
        HAVING COUNT(*) >= 2;
      `,
      codeLang: "sql",
      options: ["`Ana 2`", "`Ana 2` and `Bo 2`", "`Ana 2`, `Bo 1` and `Cy 1`", "No rows"],
      answer: [0],
      explanation: "WHERE runs first and removes Bo's 25. That leaves Ana with 2 rows, Bo with 1 and Cy with 1, and HAVING keeps only groups with at least 2.",
    },
    {
      id: "d2-17",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-groupby",
      type: "lines",
      prompt: "PostgreSQL rejects this with `aggregate functions are not allowed in WHERE`. Tap the line to fix.",
      code: sql`
        SELECT customer, SUM(total)
        FROM orders
        WHERE SUM(total) > 100
        GROUP BY customer;
      `,
      codeLang: "sql",
      answer: [3],
      explanation: "WHERE runs before grouping, when there are no sums yet. Filter groups with `HAVING SUM(total) > 100` after the GROUP BY.",
    },
    {
      id: "d2-18",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-groupby",
      type: "lines",
      prompt: "PostgreSQL rejects this with `column \"orders.city\" must appear in the GROUP BY clause or be used in an aggregate function`. Tap the line with the problem.",
      code: sql`
        SELECT customer, city, SUM(total)
        FROM orders
        GROUP BY customer;
      `,
      codeLang: "sql",
      answer: [1],
      explanation:
        "One output row per customer can't show \"the\" city if a customer's rows hold several. Add city to GROUP BY or aggregate it (`MAX(city)`). SQLite, and MySQL without ONLY_FULL_GROUP_BY, accept this and pick an arbitrary value.",
    },
    {
      id: "d2-19",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-groupby",
      type: "order",
      prompt: "Put these clauses in the logical order the database evaluates them.",
      items: ["`FROM` / `JOIN`", "`WHERE`", "`GROUP BY`", "`HAVING`", "`SELECT`", "`ORDER BY`", "`LIMIT`"],
      explanation:
        "This is why SELECT aliases can't be used in WHERE (it hasn't run yet) but can be used in ORDER BY, and why aggregates belong in HAVING. The optimizer may physically reorder work, but results always match this logical order.",
    },
    {
      id: "d2-20",
      domain: "d2",
      level: "senior",
      lesson: "d2-groupby",
      prompt: "What does this return?",
      code: sql`
        -- orders (id, total): (1, 100)
        -- order_items (order_id, sku): (1, 'A'), (1, 'B'), (1, 'C')
        SELECT SUM(o.total)
        FROM orders o
        JOIN order_items i ON i.order_id = o.id;
      `,
      codeLang: "sql",
      options: ["300", "100", "3", "NULL"],
      answer: [0],
      explanation: "The join repeats the order row once per item (fan-out), so its total of 100 is summed three times. Sum orders.total without the join, or aggregate the items separately first.",
    },
    {
      id: "d2-21",
      domain: "d2",
      level: "staff",
      lesson: "d2-groupby",
      prompt: "A revenue dashboard joins `orders` to both `order_items` and `payments` and sums `orders.total`. The numbers are inflated. What's the best fix?",
      options: [
        "Aggregate each child table in its own subquery or CTE (one row per order) before joining them to orders",
        "Change it to `SUM(DISTINCT o.total)`",
        "Use LEFT JOIN instead of JOIN",
        "Add `ORDER BY o.id` so that the duplicated rows are grouped together and each sum is then only counted once",
      ],
      answer: [0],
      explanation:
        "Two one-to-many joins multiply rows (items × payments per order). Pre-aggregating each child to one row per order removes the fan-out. `SUM(DISTINCT …)` silently drops different orders that happen to have the same total.",
    },
    {
      id: "d2-22",
      domain: "d2",
      level: "junior",
      lesson: "d2-nulls",
      type: "lines",
      prompt: "This should list employees with no manager, but it always returns zero rows. Tap the buggy line.",
      code: sql`
        SELECT name
        FROM employees
        WHERE manager_id = NULL;
      `,
      codeLang: "sql",
      answer: [3],
      explanation: "Comparing anything with NULL gives UNKNOWN, never TRUE, so WHERE keeps nothing. Use `WHERE manager_id IS NULL`.",
    },
    {
      id: "d2-23",
      domain: "d2",
      level: "junior",
      lesson: "d2-nulls",
      prompt: "What values does `shown` take?",
      code: sql`
        -- users (name, nickname): ('Robert', 'Bob'), ('Alice', NULL)
        SELECT COALESCE(nickname, name) AS shown FROM users;
      `,
      codeLang: "sql",
      options: ["`Bob` and `Alice`", "`Bob` and NULL", "`Robert` and `Alice`", "`Bob` and an empty string"],
      answer: [0],
      explanation: "COALESCE returns its first non-NULL argument. Robert's nickname is 'Bob'. Alice has none, so her name is used.",
    },
    {
      id: "d2-24",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-nulls",
      prompt: "What does this return in PostgreSQL?",
      code: sql`
        SELECT 5 + NULL AS a,
               'id-' || NULL AS b,
               concat('id-', NULL) AS c;
      `,
      codeLang: "sql",
      options: ["`a` NULL, `b` NULL, `c` `'id-'`", "`a` 5, `b` `'id-'`, `c` `'id-'`", "`a` NULL, `b` NULL, `c` NULL", "An error: NULL can't be added to a number"],
      answer: [0],
      explanation: "NULL spreads through arithmetic and the `||` operator. PostgreSQL's `concat()` function is the exception: it ignores NULL arguments.",
    },
    {
      id: "d2-25",
      domain: "d2",
      level: "senior",
      lesson: "d2-nulls",
      prompt: "What does this return in PostgreSQL?",
      code: sql`
        -- reviews (stars integer): 5, 3, NULL, 4
        SELECT AVG(stars) AS a, SUM(stars) / COUNT(*) AS b
        FROM reviews;
      `,
      codeLang: "sql",
      options: ["`a` = 4, `b` = 3", "`a` = 3, `b` = 3", "`a` = 4, `b` = 4", "`a` = 3, `b` = 4"],
      answer: [0],
      explanation:
        "AVG skips the NULL, so it's (5 + 3 + 4) divided by 3, which is 4. SUM also skips it (12), but COUNT(*) counts all 4 rows, and integer division gives 12 divided by 4, which is 3. Decide whether a missing review should count before choosing.",
    },
    {
      id: "d2-26",
      domain: "d2",
      level: "intermediate",
      lesson: "d2-nulls",
      prompt: "What does this return?",
      code: sql`
        -- customers (name, city): ('Ana', 'Lisbon'), ('Bo', 'Oslo'), ('Di', NULL)
        SELECT name FROM customers WHERE city <> 'Oslo';
      `,
      codeLang: "sql",
      options: ["`Ana` only", "`Ana` and `Di`", "`Bo` only", "`Ana`, `Bo` and `Di`"],
      answer: [0],
      explanation:
        "For Di, `NULL <> 'Oslo'` is UNKNOWN, so the row is dropped. To include unknown cities, write `city IS DISTINCT FROM 'Oslo'` or `city <> 'Oslo' OR city IS NULL`.",
    },
    {
      id: "d2-27",
      domain: "d2",
      level: "senior",
      lesson: "d2-nulls",
      prompt: "Which conditions evaluate to TRUE when `city` is NULL? (Choose two.)",
      options: ["`city IS NULL`", "`city IS NOT DISTINCT FROM NULL`", "`city = NULL`", "`NOT (city <> 'Oslo')`", "`city IN (NULL)`"],
      answer: [0, 1],
      explanation:
        "IS NULL and IS [NOT] DISTINCT FROM treat NULL as a comparable value and always return TRUE or FALSE. `= NULL`, `IN (NULL)` and `NOT (NULL <> 'Oslo')` are all UNKNOWN.",
    },
    {
      id: "d2-28",
      domain: "d2",
      level: "senior",
      lesson: "d2-nulls",
      prompt: "`users.email` is nullable and has a plain UNIQUE constraint. In PostgreSQL, how many rows can have a NULL email?",
      options: ["Any number", "Exactly one", "None: UNIQUE implies NOT NULL", "One per transaction"],
      answer: [0],
      explanation:
        "By default NULLs are not considered equal, so they never clash with each other. PostgreSQL 15 added `UNIQUE NULLS NOT DISTINCT` for when you want at most one NULL. (A primary key, unlike UNIQUE, forbids NULL.)",
    },
    {
      id: "d2-29",
      domain: "d2",
      level: "staff",
      lesson: "d2-nulls",
      prompt: "Reports keep breaking on NULL edge cases (missing rows, wrong averages). Which schema convention prevents the most of these bugs?",
      options: [
        "Declare columns NOT NULL (with sensible defaults) unless \"unknown\" is a genuine state the business needs to record",
        "Wrap every column in COALESCE in every query",
        "Replace NULL with magic values like -1 or 'N/A' in every column, so that comparisons never return UNKNOWN anywhere",
        "Avoid outer joins entirely",
      ],
      answer: [0],
      explanation:
        "Fixing it in the schema means no query has to remember. COALESCE everywhere is noisy and easy to forget, magic values break aggregates (an average of -1s) and constraints, and outer joins are often genuinely needed.",
    },
  ],

  cards: [
    { id: "c2-join", domain: "d2", kind: "service", term: "INNER JOIN", definition: "Combines rows from two tables, keeping only the pairs that satisfy ON." },
    { id: "c2-left", domain: "d2", kind: "service", term: "LEFT JOIN", definition: "Keeps every row from the left table. The right table's columns are NULL where nothing matches." },
    { id: "c2-full", domain: "d2", kind: "service", term: "FULL OUTER JOIN", definition: "Keeps all rows from both tables, padding the missing side with NULLs." },
    { id: "c2-cross", domain: "d2", kind: "service", term: "CROSS JOIN", definition: "Pairs every row with every row, also called the Cartesian product." },
    { id: "c2-groupby", domain: "d2", kind: "service", term: "GROUP BY", definition: "Collapses rows with equal key values into one row per group." },
    { id: "c2-having", domain: "d2", kind: "service", term: "HAVING", definition: "Filters groups after they've been aggregated, so it can use functions like SUM and COUNT." },
    { id: "c2-count", domain: "d2", kind: "service", term: "COUNT", definition: "COUNT(*) counts rows. COUNT(col) counts non-NULL values, and COUNT(DISTINCT col) counts the different ones." },
    { id: "c2-coalesce", domain: "d2", kind: "service", term: "COALESCE", definition: "Returns the first non-NULL argument. For example, COALESCE(nickname, name) uses the name when there's no nickname." },
    { id: "c2-nullif", domain: "d2", kind: "service", term: "NULLIF", definition: "NULLIF(a, b) gives NULL when a equals b, and a otherwise. It's handy for avoiding division by zero." },
    { id: "c2-isdistinct", domain: "d2", kind: "service", term: "IS DISTINCT FROM", definition: "A NULL-safe \"not equal\". It treats two NULLs as the same and never returns NULL." },
    { id: "c2-tvl", domain: "d2", kind: "concept", term: "Three-valued logic", definition: "SQL conditions are TRUE, FALSE or UNKNOWN. WHERE keeps only TRUE." },
    { id: "c2-antijoin", domain: "d2", kind: "concept", term: "Anti-join", definition: "Finds rows with no match on the other side, using LEFT JOIN … WHERE right.key IS NULL, or NOT EXISTS." },
    { id: "c2-fanout", domain: "d2", kind: "concept", term: "Join fan-out", definition: "A one-to-many join repeats the parent row once per child, so sums of the parent's columns come out too big." },
    { id: "c2-order", domain: "d2", kind: "concept", term: "Logical query order", definition: "The order the database works through a query: FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT." },
  ],

  challenges: [
    {
      id: "ch-sql-no-orders",
      domain: "d2",
      lesson: "d2-outer",
      title: "Who never ordered?",
      goal: "Make the result show only the customer who has never placed an order.",
      hint: "Keep every customer with an outer join, then keep the rows where the order side came back empty.",
      takeaway: "The anti-join: LEFT JOIN, then WHERE right.id IS NULL. An inner join can never find missing matches.",
      render: (onSolved) => <JoinLab goal="noOrders" onSolved={onSolved} />,
    },
    {
      id: "ch-sql-orphan",
      domain: "d2",
      lesson: "d2-outer",
      title: "Find the orphan order",
      goal: "Make the result show only the order that has no matching customer.",
      hint: "You need a join that keeps every order, then a filter on the customer side.",
      takeaway: "RIGHT (or FULL) JOIN keeps unmatched rows from the orders side. NULL customer_id never matches, so guest orders only survive outer joins.",
      render: (onSolved) => <JoinLab goal="orphan" onSolved={onSolved} />,
    },
    {
      id: "ch-sql-big-spenders",
      domain: "d2",
      lesson: "d2-groupby",
      title: "Big spenders",
      goal: "List the customers whose paid orders add up to more than 50.",
      hint: "Refunds shouldn't count (filter rows), then bucket by customer, then filter the buckets.",
      takeaway: "WHERE removes rows before grouping; HAVING removes whole groups after. Bo only qualifies if his refund is counted.",
      render: (onSolved) => <GroupByLab goal="bigSpenders" onSolved={onSolved} />,
    },
    {
      id: "ch-sql-per-status",
      domain: "d2",
      lesson: "d2-groupby",
      title: "Orders per status",
      goal: "Count how many orders there are in each status, across all orders.",
      hint: "One result row per status, and the aggregate that counts rows.",
      takeaway: "The GROUP BY column is \"what one result row is\". COUNT(*) counts the rows in each bucket.",
      render: (onSolved) => <GroupByLab goal="perStatus" onSolved={onSolved} />,
    },
  ],
});
