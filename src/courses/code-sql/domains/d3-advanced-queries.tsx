import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { sql } from "../sql";
import { WindowExplorer } from "../visuals";

/** World 3: queries inside queries, CTEs, window functions, CASE and set operations. */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Subqueries, CTEs & Windows",
    world: "The Subquery Spire",
    weight: 25,
    emoji: "🗼",
    color: "#a78bfa",
    summary: "Scalar, IN and EXISTS subqueries, the NOT IN trap, CTEs and recursive CTEs, window functions for ranking and running totals, CASE, and UNION / INTERSECT / EXCEPT.",
  },

  tasks: [
    {
      id: "3.1",
      title: "Subqueries and CTEs",
      covers: ["Scalar subqueries", "IN and EXISTS", "Correlated subqueries", "NOT IN with NULLs", "WITH and WITH RECURSIVE", "CTE inlining in PostgreSQL 12+"],
    },
    {
      id: "3.2",
      title: "Window functions",
      covers: ["OVER, PARTITION BY and ORDER BY", "ROW_NUMBER, RANK, DENSE_RANK", "LAG and LEAD", "Running totals and frames", "Top-N per group"],
    },
    {
      id: "3.3",
      title: "CASE and set operations",
      covers: ["Searched CASE", "Conditional aggregation and FILTER", "UNION vs UNION ALL", "INTERSECT and EXCEPT"],
    },
  ],

  lessons: [
    {
      id: "d3-subqueries",
      level: "intermediate",
      task: "3.1",
      title: "Queries inside queries",
      check: ["d3-01", "d3-03"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "1️⃣", title: "Scalar", text: "Returns one value, usable anywhere a value is: `WHERE price > (SELECT AVG(price) FROM products)`.", color: "#38bdf8" },
              { icon: "📋", title: "IN (list)", text: "Returns one column of values: `WHERE id IN (SELECT customer_id FROM orders)`.", color: "#34d399" },
              { icon: "❓", title: "EXISTS", text: "True if the subquery returns any row. Usually correlated: it refers to the outer row.", color: "#f59e0b" },
            ]}
          />
          <CodeCompare
            lang="sql"
            left={{ title: "NOT IN: one NULL empties the result", code: sql`
              -- orders.customer_id contains a NULL
              SELECT id FROM customers
              WHERE id NOT IN (
                SELECT customer_id FROM orders
              );          -- 0 rows!
            ` }}
            right={{ title: "NOT EXISTS: NULL-safe", code: sql`
              SELECT c.id FROM customers c
              WHERE NOT EXISTS (
                SELECT 1 FROM orders o
                WHERE o.customer_id = c.id
              );
            ` }}
          />
        </div>
      ),
      points: [
        "A subquery is a SELECT inside another statement. A scalar subquery must return at most one row and one column, or PostgreSQL raises an error.",
        "IN and EXISTS test membership without duplicating outer rows the way a join can.",
        "A correlated subquery mentions the outer query's columns (o.customer_id = c.id), so it's logically evaluated once per outer row.",
        "x NOT IN (…) is never TRUE if the list contains a NULL (x <> NULL is UNKNOWN). Prefer NOT EXISTS or an anti-join.",
      ],
      tip: "Reach for NOT EXISTS whenever you'd write NOT IN with a subquery. It's NULL-safe, and PostgreSQL plans it as an efficient anti-join.",
    },
    {
      id: "d3-ctes",
      level: "intermediate",
      task: "3.1",
      title: "CTEs and recursion",
      check: ["d3-08", "d3-09"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="sql"
            code={sql`
              WITH totals AS (                 -- step 1: name a result
                SELECT customer_id, SUM(total) AS spent
                FROM orders GROUP BY customer_id
              )
              SELECT c.name, t.spent            -- step 2: use it like a table
              FROM totals t JOIN customers c ON c.id = t.customer_id
              WHERE t.spent > 100;
            `}
          />
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "🌱", label: "Anchor", sub: "Non-recursive SELECT: the starting rows" },
              { icon: "🔁", label: "Recursive step", sub: "SELECT … FROM the CTE itself, using only the previous round's rows" },
              { icon: "🛑", label: "Stops", sub: "When a round adds no rows" },
            ]}
            loop="UNION ALL glues every round together"
          />
        </div>
      ),
      points: [
        "WITH name AS (…) defines a named result that exists only for that one statement. Chain several to build a query in readable steps.",
        "WITH RECURSIVE has an anchor part and a recursive part joined by UNION ALL. Each round feeds on the rows from the round before; it stops when a round adds nothing.",
        "Recursive CTEs walk hierarchies: org charts, category trees, bill-of-materials, graph reachability.",
        "Since PostgreSQL 12, a side-effect-free CTE used once is inlined into the main query like a subquery. Write AS MATERIALIZED to force it to be computed once separately.",
      ],
      tip: "Always give a recursive CTE a guaranteed stop (a WHERE on depth or value). An accidental cycle in the data will otherwise loop until it runs out of resources.",
    },
    {
      id: "d3-windows",
      level: "senior",
      task: "3.2",
      title: "Window functions",
      check: ["d3-14", "d3-16"],
      visual: (
        <div className="grid gap-4">
          <WindowExplorer />
          <CodeBlock
            lang="sql"
            caption="Top 2 earners per department: rank in a CTE, filter outside it."
            code={sql`
              WITH ranked AS (
                SELECT name, dept, salary,
                       ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) AS rn
                FROM employees
              )
              SELECT name, dept, salary FROM ranked WHERE rn <= 2;
            `}
          />
        </div>
      ),
      points: [
        "fn() OVER (…) computes a value for each row from a window of related rows, without collapsing them like GROUP BY.",
        "PARTITION BY splits rows into independent windows; ORDER BY orders rows inside each one.",
        "ROW_NUMBER gives 1, 2, 3 even for ties; RANK gives 1, 1, 3; DENSE_RANK gives 1, 1, 2.",
        "With ORDER BY, aggregates like SUM become running totals. The default frame (RANGE … CURRENT ROW) includes all rows tied with the current one.",
        "Window functions run after WHERE, GROUP BY and HAVING, so to filter on one, compute it in a subquery or CTE first.",
      ],
      tip: "\"Top N per group\", \"change since yesterday\" and \"running total\" are all window-function problems. Recognising the pattern is half the work.",
    },
    {
      id: "d3-case-sets",
      level: "intermediate",
      task: "3.3",
      title: "CASE and set operations",
      check: ["d3-21", "d3-22"],
      visual: (
        <div className="grid gap-4">
          <CodeBlock
            lang="sql"
            code={sql`
              SELECT
                COUNT(*) FILTER (WHERE status = 'paid')          AS paid,
                SUM(CASE WHEN status = 'refunded' THEN 1 ELSE 0 END) AS refunded,
                CASE WHEN AVG(total) > 50 THEN 'high' ELSE 'normal' END AS band
              FROM orders;
            `}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "➕", title: "UNION", text: "Rows from both queries, duplicates removed.", color: "#38bdf8" },
              { icon: "⏩", title: "UNION ALL", text: "Rows from both, duplicates kept. No dedupe work, so faster.", color: "#34d399" },
              { icon: "🎯", title: "INTERSECT", text: "Rows that appear in both results.", color: "#f59e0b" },
              { icon: "➖", title: "EXCEPT", text: "Rows in the first result but not the second.", color: "#fb7185" },
            ]}
          />
        </div>
      ),
      points: [
        "CASE WHEN … THEN … ELSE … END is SQL's if/else expression. Branches are checked in order, and without ELSE the result is NULL.",
        "Conditional aggregation (SUM(CASE …) or the standard FILTER clause) counts several categories in one pass.",
        "Set operations stack the rows of two queries. Both sides need the same number of columns with compatible types; names come from the first query.",
        "Set operations compare rows as \"not distinct\", so two NULLs count as the same row, unlike =.",
      ],
      tip: "Default to UNION ALL. Use UNION only when you really need duplicates removed, because that costs a sort or hash over the whole result.",
    },
  ],

  questions: [
    {
      id: "d3-01",
      domain: "d3",
      level: "junior",
      lesson: "d3-subqueries",
      prompt: "What does this query return?",
      code: sql`
        -- products (name, price): ('pen', 2), ('mug', 8), ('lamp', 25)
        SELECT name FROM products
        WHERE price > (SELECT AVG(price) FROM products);
      `,
      codeLang: "sql",
      options: ["`lamp`", "`mug` and `lamp`", "`pen`", "No rows"],
      answer: [0],
      explanation: "The subquery runs once and returns one value: the average price, (2 + 8 + 25) / 3 ≈ 11.67. Only lamp costs more than that.",
    },
    {
      id: "d3-02",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-subqueries",
      prompt: "Ana has two orders. How many times does Ana appear in this result?",
      code: sql`
        SELECT name FROM customers
        WHERE id IN (SELECT customer_id FROM orders);
      `,
      codeLang: "sql",
      options: ["Once", "Twice", "Not at all", "It's an error: the subquery returns more than one row"],
      answer: [0],
      explanation:
        "IN only asks whether the id is somewhere in the list, so each customer appears at most once. A JOIN to orders would repeat Ana once per order.",
    },
    {
      id: "d3-03",
      domain: "d3",
      level: "senior",
      lesson: "d3-subqueries",
      prompt: "What does this query return?",
      code: sql`
        -- customers (id): 1, 2, 3
        -- orders (customer_id): 1, NULL
        SELECT id FROM customers
        WHERE id NOT IN (SELECT customer_id FROM orders);
      `,
      codeLang: "sql",
      options: ["No rows", "`2` and `3`", "`2`, `3` and NULL", "`1`"],
      answer: [0],
      explanation:
        "`2 NOT IN (1, NULL)` means `2 <> 1 AND 2 <> NULL`, which is TRUE AND UNKNOWN = UNKNOWN. Every row is UNKNOWN or FALSE, so none are returned. NOT EXISTS returns 2 and 3.",
    },
    {
      id: "d3-04",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-subqueries",
      type: "lines",
      prompt: "This should list customers who have a paid order, but it returns every customer whenever anyone has a paid order. Tap the line to fix.",
      code: sql`
        SELECT c.name
        FROM customers c
        WHERE EXISTS (
          SELECT 1 FROM orders o
          WHERE o.status = 'paid'
        );
      `,
      codeLang: "sql",
      answer: [5],
      explanation:
        "The subquery never refers to the outer row, so it's the same TRUE for everyone. Correlate it: `WHERE o.customer_id = c.id AND o.status = 'paid'`.",
    },
    {
      id: "d3-05",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-subqueries",
      prompt: "`SELECT name, (SELECT id FROM orders WHERE customer_id = c.id) FROM customers c;` fails for customers with two orders. Why?",
      options: [
        "A scalar subquery must return at most one row; PostgreSQL raises `more than one row returned by a subquery used as an expression`",
        "Subqueries aren't allowed in the SELECT list",
        "The subquery needs GROUP BY",
        "Correlated subqueries must use EXISTS",
      ],
      answer: [0],
      explanation:
        "A subquery used as a value can produce zero rows (giving NULL) or one row, never more. Aggregate it (`SELECT MAX(id) …`), add `LIMIT 1` with an ORDER BY, or use a join.",
    },
    {
      id: "d3-06",
      domain: "d3",
      level: "senior",
      lesson: "d3-subqueries",
      prompt: "`orders.customer_id` is nullable. Which queries correctly return customers with no orders? (Choose two.)",
      options: [
        "`SELECT c.id FROM customers c WHERE NOT EXISTS (SELECT 1 FROM orders o WHERE o.customer_id = c.id);`",
        "`SELECT c.id FROM customers c LEFT JOIN orders o ON o.customer_id = c.id WHERE o.customer_id IS NULL;`",
        "`SELECT id FROM customers WHERE id NOT IN (SELECT customer_id FROM orders);`",
        "`SELECT id FROM customers WHERE id <> ALL (SELECT customer_id FROM orders);`",
        "`SELECT c.id FROM customers c JOIN orders o ON o.customer_id <> c.id;`",
      ],
      answer: [0, 1],
      explanation:
        "NOT EXISTS and the LEFT JOIN anti-join both ignore NULL customer_ids. `NOT IN` and `<> ALL` are the same test and return nothing once a NULL appears. The `<>` join pairs each customer with every other customer's orders.",
    },
    {
      id: "d3-07",
      domain: "d3",
      level: "junior",
      lesson: "d3-ctes",
      prompt: "What does `WITH totals AS (SELECT …) SELECT … FROM totals` do?",
      options: [
        "Defines a named result, totals, that the rest of that one statement can query like a table",
        "Creates a permanent table called totals",
        "Creates a saved view that other queries can use later",
        "Runs the two SELECTs in parallel",
      ],
      answer: [0],
      explanation: "A CTE (common table expression) lives only for the statement it's part of. For something reusable across queries, create a view.",
    },
    {
      id: "d3-08",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-ctes",
      prompt: "What does this return?",
      code: sql`
        -- orders (customer, total):
        -- ('Ana', 30), ('Ana', 45), ('Bo', 40), ('Cy', 60)
        WITH totals AS (
          SELECT customer, SUM(total) AS spent
          FROM orders
          GROUP BY customer
        )
        SELECT customer FROM totals
        WHERE spent > (SELECT AVG(spent) FROM totals);
      `,
      codeLang: "sql",
      options: ["`Ana` and `Cy`", "`Ana` only", "`Cy` only", "`Ana`, `Bo` and `Cy`"],
      answer: [0],
      explanation: "totals is Ana 75, Bo 40, Cy 60, whose average is 175 / 3 ≈ 58.3. Ana and Cy are above it. The CTE is referenced twice, which plain subqueries would have to repeat.",
    },
    {
      id: "d3-09",
      domain: "d3",
      level: "senior",
      lesson: "d3-ctes",
      prompt: "What does this return?",
      code: sql`
        WITH RECURSIVE n(x) AS (
          SELECT 1
          UNION ALL
          SELECT x * 2 FROM n WHERE x < 20
        )
        SELECT MAX(x) FROM n;
      `,
      codeLang: "sql",
      options: ["32", "16", "20", "It never finishes"],
      answer: [0],
      explanation:
        "The rows are 1, 2, 4, 8, 16. Because 16 < 20, the next round still produces 32. Then 32 < 20 is false, the round adds nothing, and recursion stops. The WHERE checks the previous value, not the new one.",
    },
    {
      id: "d3-10",
      domain: "d3",
      level: "senior",
      lesson: "d3-ctes",
      type: "order",
      prompt: "Assemble a recursive query that walks from employee 4 up to the CEO.",
      items: [
        "`WITH RECURSIVE chain AS (`",
        "`SELECT id, manager_id, 1 AS depth FROM employees WHERE id = 4`",
        "`UNION ALL`",
        "`SELECT e.id, e.manager_id, c.depth + 1 FROM employees e JOIN chain c ON e.id = c.manager_id`",
        "`)`",
        "`SELECT * FROM chain ORDER BY depth;`",
      ],
      explanation: "Anchor first (the starting employee), then UNION ALL, then the recursive step that joins the CTE to find each row's manager. It stops at the CEO, whose manager_id is NULL and matches nothing.",
    },
    {
      id: "d3-11",
      domain: "d3",
      level: "senior",
      lesson: "d3-ctes",
      prompt: "In PostgreSQL 12 and later, what happens to a non-recursive, side-effect-free CTE that the main query references once?",
      options: [
        "The planner inlines it into the main query, so filters can be pushed down into it",
        "It's always computed in full first and stored, acting as an optimization fence",
        "It's cached between executions of the query",
        "It's rewritten as a temporary table on disk",
      ],
      answer: [0],
      explanation:
        "Before PostgreSQL 12, every CTE was materialized, which blocked filter push-down. Now such a CTE is inlined unless you write `AS MATERIALIZED`; `AS NOT MATERIALIZED` forces inlining even when it's referenced more than once.",
    },
    {
      id: "d3-12",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-windows",
      prompt: "How does `SUM(total) OVER (PARTITION BY customer_id)` differ from `SUM(total) … GROUP BY customer_id`?",
      options: [
        "The window version keeps every row and adds the customer's total to each one; GROUP BY returns one row per customer",
        "They're identical; OVER is just newer syntax",
        "The window version only works on the first row of each customer",
        "GROUP BY keeps every row; the window version collapses them",
      ],
      answer: [0],
      explanation: "Window functions compute across related rows but don't collapse them, so you can show each order next to its customer's total, or its share of it.",
    },
    {
      id: "d3-13",
      domain: "d3",
      level: "senior",
      lesson: "d3-windows",
      prompt: "What are `r` and `dr` for player d?",
      code: sql`
        -- scores (name, pts): ('a', 90), ('b', 80), ('c', 80), ('d', 70)
        SELECT name,
               RANK()       OVER (ORDER BY pts DESC) AS r,
               DENSE_RANK() OVER (ORDER BY pts DESC) AS dr
        FROM scores;
      `,
      codeLang: "sql",
      options: ["`r` = 4, `dr` = 3", "`r` = 3, `dr` = 3", "`r` = 4, `dr` = 4", "`r` = 3, `dr` = 4"],
      answer: [0],
      explanation: "b and c tie at rank 2. RANK then skips to 4 (gaps after ties); DENSE_RANK continues at 3 (no gaps). ROW_NUMBER would give 4 too, but number b and c in an arbitrary order.",
    },
    {
      id: "d3-14",
      domain: "d3",
      level: "senior",
      lesson: "d3-windows",
      type: "lines",
      prompt: "This should return the top 2 earners per department, but PostgreSQL rejects it. Tap the line that causes the error.",
      code: sql`
        SELECT name, dept,
               ROW_NUMBER() OVER (PARTITION BY dept ORDER BY salary DESC) AS rn
        FROM employees
        WHERE rn <= 2;
      `,
      codeLang: "sql",
      answer: [4],
      explanation:
        "WHERE runs before window functions (and before SELECT aliases exist). Compute rn in a CTE or subquery, then filter it outside. Some warehouses offer QUALIFY for this; PostgreSQL doesn't.",
    },
    {
      id: "d3-15",
      domain: "d3",
      level: "senior",
      lesson: "d3-windows",
      prompt: "What is `running` on the two day-2 rows?",
      code: sql`
        -- sales (day, amount): (1, 10), (2, 20), (2, 5), (3, 1)
        SELECT day, amount,
               SUM(amount) OVER (ORDER BY day) AS running
        FROM sales;
      `,
      codeLang: "sql",
      options: ["35 on both rows", "30 on one row and 35 on the other", "20 and 5", "25 on both rows"],
      answer: [0],
      explanation:
        "With ORDER BY and no frame clause, the frame is RANGE BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW, which includes every row tied with the current one (its peers). Add `ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW` (and a tiebreaker) for a row-by-row total.",
    },
    {
      id: "d3-16",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-windows",
      prompt: "What does `change` contain, in day order?",
      code: sql`
        -- prices (day, price): (1, 100), (2, 110), (3, 99)
        SELECT day,
               price - LAG(price) OVER (ORDER BY day) AS change
        FROM prices;
      `,
      codeLang: "sql",
      options: ["`NULL, 10, -11`", "`0, 10, -11`", "`10, -11, NULL`", "`100, 10, -11`"],
      answer: [0],
      explanation: "LAG reads the previous row's value. Day 1 has no previous row, so LAG returns NULL and the subtraction is NULL. LEAD would read the next row instead.",
    },
    {
      id: "d3-17",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-windows",
      type: "match",
      prompt: "Match each window function to what it gives the rows 90, 80, 80, 70 (ordered by score, descending).",
      pairs: [
        ["`ROW_NUMBER()`", "1, 2, 3, 4"],
        ["`RANK()`", "1, 2, 2, 4"],
        ["`DENSE_RANK()`", "1, 2, 2, 3"],
        ["`LAG(score)`", "NULL, 90, 80, 80"],
        ["`NTILE(2)`", "1, 1, 2, 2"],
      ],
      explanation: "ROW_NUMBER never repeats, RANK repeats and leaves a gap, DENSE_RANK repeats without a gap, LAG shifts values down a row, and NTILE(n) splits the rows into n buckets of near-equal size.",
    },
    {
      id: "d3-18",
      domain: "d3",
      level: "senior",
      lesson: "d3-windows",
      type: "order",
      prompt: "Build a query that returns the newest order per customer.",
      items: [
        "`WITH ranked AS (`",
        "`SELECT o.*, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY created_at DESC, id DESC) AS rn`",
        "`FROM orders o`",
        "`)`",
        "`SELECT * FROM ranked WHERE rn = 1;`",
      ],
      explanation:
        "Number each customer's orders newest first, then keep number 1. The `id DESC` tiebreaker makes the pick deterministic when two orders share a timestamp. (PostgreSQL's `DISTINCT ON (customer_id)` is a shorter, non-standard alternative.)",
    },
    {
      id: "d3-19",
      domain: "d3",
      level: "staff",
      lesson: "d3-windows",
      prompt: "A 50-million-row `events` table has duplicate rows per `(user_id, event_key)` that differ only in `id` and `created_at`. You must keep the newest of each and stop new duplicates. What's the best plan?",
      options: [
        "Number rows per key with ROW_NUMBER (newest first), delete rn > 1 in batches, then add a UNIQUE constraint on (user_id, event_key)",
        "`CREATE TABLE clean AS SELECT DISTINCT * FROM events` and swap the tables",
        "Delete every row whose key has `COUNT(*) > 1`",
        "Add the UNIQUE constraint first; PostgreSQL removes the duplicates while building it",
      ],
      answer: [0],
      explanation:
        "ROW_NUMBER picks exactly one survivor per key; batching keeps locks and WAL bursts small on a big table; the constraint prevents a repeat. DISTINCT * keeps the rows because their ids differ, the COUNT approach deletes the originals too, and creating the constraint fails while duplicates exist.",
    },
    {
      id: "d3-20",
      domain: "d3",
      level: "staff",
      lesson: "d3-windows",
      prompt: "A game shows each player's global rank on every page view by running `RANK() OVER (ORDER BY score DESC)` across 10 million players. It's too slow. What's the best fix?",
      options: [
        "Precompute ranks into a table or materialized view refreshed on a schedule, and look up a player's row by key",
        "Switch to DENSE_RANK, which doesn't have to sort",
        "Add `PARTITION BY player_id` to the window",
        "Run the query at the SERIALIZABLE isolation level",
      ],
      answer: [0],
      explanation:
        "Every request currently sorts all 10 million rows. Ranks that are a few minutes stale are usually fine, so compute them once per refresh. Every ranking function still needs the sort, and partitioning by player would rank each player against only themselves.",
    },
    {
      id: "d3-21",
      domain: "d3",
      level: "junior",
      lesson: "d3-case-sets",
      prompt: "What values does `size` take, in row order?",
      code: sql`
        -- orders (total): 5, 50, 500
        SELECT total,
               CASE WHEN total >= 100 THEN 'big'
                    WHEN total >= 10  THEN 'medium'
                    ELSE 'small'
               END AS size
        FROM orders;
      `,
      codeLang: "sql",
      options: ["`small, medium, big`", "`small, medium, medium`", "`medium, medium, big`", "`small, big, big`"],
      answer: [0],
      explanation: "CASE checks its branches in order and uses the first true one. 500 matches `>= 100` first, so it's 'big' even though it's also `>= 10`.",
    },
    {
      id: "d3-22",
      domain: "d3",
      level: "junior",
      lesson: "d3-case-sets",
      prompt: "How many rows does this return?",
      code: sql`
        SELECT city FROM customers   -- 'Oslo', 'Rome'
        UNION
        SELECT city FROM suppliers;  -- 'Rome', 'Lima'
      `,
      codeLang: "sql",
      options: ["3", "4", "2", "1"],
      answer: [0],
      explanation: "UNION removes duplicates, so 'Rome' appears once: Oslo, Rome, Lima. UNION ALL would return all 4 rows.",
    },
    {
      id: "d3-23",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-case-sets",
      prompt: "What does this return?",
      code: sql`
        SELECT CASE WHEN 1 > 2 THEN 'yes' END AS answer;
      `,
      codeLang: "sql",
      options: ["NULL", "`'no'`", "An empty string", "An error: CASE needs an ELSE"],
      answer: [0],
      explanation: "When no WHEN branch matches and there's no ELSE, CASE returns NULL. Add an ELSE when a default matters.",
    },
    {
      id: "d3-24",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-case-sets",
      prompt: "What are `paid` and `refunded`?",
      code: sql`
        -- orders (status): 'paid', 'paid', 'refunded', 'paid'
        SELECT COUNT(*) FILTER (WHERE status = 'paid') AS paid,
               SUM(CASE WHEN status = 'refunded' THEN 1 ELSE 0 END) AS refunded
        FROM orders;
      `,
      codeLang: "sql",
      options: ["`paid` = 3, `refunded` = 1", "`paid` = 4, `refunded` = 1", "`paid` = 3, `refunded` = 4", "`paid` = 1, `refunded` = 3"],
      answer: [0],
      explanation: "Both are conditional aggregation: FILTER restricts which rows the aggregate sees, and SUM(CASE …) counts the matching rows as 1s. One pass computes several counts.",
    },
    {
      id: "d3-25",
      domain: "d3",
      level: "intermediate",
      lesson: "d3-case-sets",
      prompt: "What does this return?",
      code: sql`
        -- customers (id): 1, 2, 3
        -- orders (customer_id): 1, NULL
        SELECT id FROM customers
        EXCEPT
        SELECT customer_id FROM orders;
      `,
      codeLang: "sql",
      options: ["`2` and `3`", "No rows", "`1`", "`2`, `3` and NULL"],
      answer: [0],
      explanation:
        "EXCEPT returns the first query's rows that don't appear in the second. Set operations compare rows as \"not distinct\", so the NULL simply doesn't match anything: no NOT IN trap here.",
    },
    {
      id: "d3-26",
      domain: "d3",
      level: "junior",
      lesson: "d3-case-sets",
      type: "lines",
      prompt: "PostgreSQL rejects this with `each UNION query must have the same number of columns`. Tap the line to fix.",
      code: sql`
        SELECT id, name FROM customers
        UNION
        SELECT id FROM suppliers;
      `,
      codeLang: "sql",
      answer: [3],
      explanation: "Set operations stack rows, so both sides need the same columns in the same order with compatible types: `SELECT id, name FROM suppliers`.",
    },
    {
      id: "d3-27",
      domain: "d3",
      level: "senior",
      lesson: "d3-case-sets",
      prompt: "You're combining this month's and last month's log partitions, which can't share rows. Why write UNION ALL rather than UNION?",
      options: [
        "UNION must sort or hash the whole result to remove duplicates; UNION ALL just appends, which is cheaper and gives the same rows here",
        "UNION only works on tables, not partitions",
        "UNION ALL removes duplicates more accurately",
        "UNION changes the column types",
      ],
      answer: [0],
      explanation: "When duplicates are impossible (or wanted), the dedupe step in UNION is pure cost, and on millions of rows it can dominate the query.",
    },
  ],

  cards: [
    { id: "c3-exists", domain: "d3", kind: "service", term: "EXISTS", definition: "True if the subquery returns at least one row. NOT EXISTS is the NULL-safe anti-join." },
    { id: "c3-in", domain: "d3", kind: "service", term: "IN (subquery)", definition: "True if the value equals any value the subquery returns. NOT IN breaks if the list holds a NULL." },
    { id: "c3-with", domain: "d3", kind: "service", term: "WITH (CTE)", definition: "Names a result for the rest of one statement, so a query can be built in readable steps." },
    { id: "c3-recursive", domain: "d3", kind: "service", term: "WITH RECURSIVE", definition: "Anchor query UNION ALL a step that reads the CTE itself; walks trees and graphs." },
    { id: "c3-rownumber", domain: "d3", kind: "service", term: "ROW_NUMBER", definition: "Window function: 1, 2, 3 … within each partition, even for ties." },
    { id: "c3-rank", domain: "d3", kind: "service", term: "RANK / DENSE_RANK", definition: "Ties share a rank. RANK leaves gaps after ties (1, 1, 3); DENSE_RANK doesn't (1, 1, 2)." },
    { id: "c3-lag", domain: "d3", kind: "service", term: "LAG / LEAD", definition: "The value from the previous / next row in the window's order (NULL at the edges by default)." },
    { id: "c3-over", domain: "d3", kind: "service", term: "OVER (PARTITION BY …)", definition: "Turns a function into a window function over related rows, without collapsing them." },
    { id: "c3-case", domain: "d3", kind: "service", term: "CASE", definition: "If/else expression: first matching WHEN wins; no match and no ELSE gives NULL." },
    { id: "c3-union", domain: "d3", kind: "service", term: "UNION / UNION ALL", definition: "Stack two results. UNION removes duplicates; UNION ALL keeps them and is cheaper." },
    { id: "c3-except", domain: "d3", kind: "service", term: "EXCEPT / INTERSECT", definition: "Rows in the first result but not the second / rows in both." },
    { id: "c3-filter", domain: "d3", kind: "service", term: "FILTER (WHERE …)", definition: "Restricts which rows an aggregate sees: COUNT(*) FILTER (WHERE status = 'paid')." },
    { id: "c3-correlated", domain: "d3", kind: "concept", term: "Correlated subquery", definition: "A subquery that refers to the outer row, so it's logically evaluated once per outer row." },
    { id: "c3-frame", domain: "d3", kind: "concept", term: "Window frame", definition: "Which rows around the current one an aggregate sees. Default with ORDER BY: start to current row, including ties." },
    { id: "c3-topn", domain: "d3", kind: "concept", term: "Top-N per group", definition: "ROW_NUMBER() OVER (PARTITION BY g ORDER BY x DESC) in a CTE, then WHERE rn <= N." },
  ],
});
