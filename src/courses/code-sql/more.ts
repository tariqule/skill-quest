import type { Question } from "@/engine/types";

/**
 * Extra question types for the SQL track: fill-in-the-blank clauses and "type the result" questions.
 * Output answers were run in SQLite 3.42 and PostgreSQL 16; they are identical in both.
 */
export const moreQuestions: Question[] = [
  // ───────────── fill ─────────────
  {
    id: "sql-fx-01",
    type: "fill",
    domain: "d1",
    level: "junior",
    lesson: "d1-select",
    prompt: "Fill the gap so the query returns each department only once, however many employees it has.",
    code: "SELECT {{1}} dept\nFROM employees;",
    codeLang: "sql",
    blanks: [{ options: ["DISTINCT", "UNIQUE", "ONLY", "GROUP"], answer: 0 }],
    explanation:
      "`SELECT DISTINCT` removes duplicate rows from the result. `UNIQUE` is a constraint keyword, not a SELECT modifier, and `GROUP` needs `BY` and a different shape of query.",
  },
  {
    id: "sql-fx-02",
    type: "fill",
    domain: "d2",
    level: "junior",
    lesson: "d2-groupby",
    prompt: "Fill the gaps to list only the departments that have more than one employee.",
    code: "SELECT dept, COUNT(*)\nFROM employees\n{{1}} dept\n{{2}} COUNT(*) > 1;",
    codeLang: "sql",
    blanks: [
      { options: ["GROUP BY", "ORDER BY", "PARTITION BY", "DISTINCT"], answer: 0 },
      { options: ["HAVING", "WHERE", "FILTER", "WHEN"], answer: 0 },
    ],
    explanation:
      "`GROUP BY dept` makes one row per department, and `HAVING` filters those groups after the aggregate is computed. `WHERE` runs before grouping, so it cannot see `COUNT(*)`.",
  },
  {
    id: "sql-fx-03",
    type: "fill",
    domain: "d3",
    level: "intermediate",
    lesson: "d3-case-sets",
    prompt: "Fill the gap so each row gets a `band` of 'high' (salary of 80 or more) or 'low' (everything else, including NULL).",
    code: "SELECT name,\n  {{1}} WHEN salary >= 80 THEN 'high'\n       ELSE 'low'\n  END AS band\nFROM employees;",
    codeLang: "sql",
    blanks: [{ options: ["CASE", "IF", "SWITCH", "DECODE"], answer: 0 }],
    explanation:
      "`CASE WHEN ... THEN ... ELSE ... END` is the standard SQL conditional expression. A NULL salary makes `salary >= 80` unknown, not true, so that row falls through to ELSE. `IF`, `SWITCH` and `DECODE` are not standard SQL (and `IF` is not an expression in PostgreSQL).",
  },
  {
    id: "sql-fx-04",
    type: "fill",
    domain: "d1",
    level: "intermediate",
    lesson: "d1-modify",
    prompt: "Fill the gaps so the statement inserts the row, or adds to `qty` when that `sku` already exists (PostgreSQL and SQLite).",
    code:
      "INSERT INTO stock (sku, qty)\nVALUES ('A1', 3)\n{{1}} (sku)\n{{2}} SET qty = stock.qty + excluded.qty;",
    codeLang: "sql",
    blanks: [
      { options: ["ON CONFLICT", "ON DUPLICATE KEY", "ON ERROR", "IF EXISTS"], answer: 0 },
      { options: ["DO UPDATE", "DO NOTHING", "UPDATE", "REPLACE"], answer: 0 },
    ],
    explanation:
      "This is an upsert: `ON CONFLICT (sku) DO UPDATE SET ...`. `excluded` names the row you tried to insert. `ON DUPLICATE KEY UPDATE` is the MySQL spelling, and `DO NOTHING` would skip the row instead of adding to `qty`.",
  },
  {
    id: "sql-fx-05",
    type: "fill",
    domain: "d4",
    level: "staff",
    lesson: "d4-schema",
    prompt:
      "Soft-deleted users keep their rows, but an email must be unique among active users only. Fill the gaps (PostgreSQL).",
    code: "CREATE {{1}} INDEX users_email_active\nON users (email)\n{{2}} active = true;",
    codeLang: "sql",
    blanks: [
      { options: ["UNIQUE", "CLUSTERED", "PRIMARY", "DISTINCT"], answer: 0 },
      { options: ["WHERE", "HAVING", "WHEN", "FILTER"], answer: 0 },
    ],
    explanation:
      "A partial unique index (`CREATE UNIQUE INDEX ... WHERE active = true`) enforces uniqueness only for the rows the predicate selects, so deleted accounts can share an email with a new one. `CLUSTERED` is SQL Server syntax, and a plain UNIQUE constraint cannot take a condition.",
  },
  {
    id: "sql-fx-06",
    type: "fill",
    domain: "d4",
    level: "staff",
    lesson: "d4-scale",
    prompt:
      "Many workers poll this jobs table at once. Fill the gap so each worker claims a different queued job without waiting on rows another worker has locked (PostgreSQL).",
    code:
      "BEGIN;\nSELECT id FROM jobs\nWHERE status = 'queued'\nORDER BY id\nLIMIT 1\nFOR UPDATE {{1}};",
    codeLang: "sql",
    blanks: [{ options: ["SKIP LOCKED", "NOWAIT", "SHARE", "NO KEY"], answer: 0 }],
    explanation:
      "`FOR UPDATE SKIP LOCKED` silently skips rows another transaction has locked, so workers spread across the queue instead of blocking. `NOWAIT` raises an error as soon as it hits a locked row, which suits fail-fast code but not a queue.",
  },

  // ───────────── output ─────────────
  {
    id: "sql-ox-01",
    type: "output",
    domain: "d1",
    level: "junior",
    lesson: "d1-sort",
    prompt: "The query returns one row. Type the name it returns.",
    code:
      "-- employees(name, dept, salary)\n-- (Ann, eng, 90)  (Bo, eng, 70)  (Cy, ops, 60)  (Di, ops, NULL)\nSELECT name\nFROM employees\nWHERE salary > 65\nORDER BY salary\nLIMIT 1;",
    codeLang: "sql",
    answers: ["Bo", "bo"],
    explanation:
      "WHERE keeps Ann (90) and Bo (70). Sorting ascending puts Bo first, and LIMIT 1 keeps only that row. Di's NULL salary fails `salary > 65`, so Di is filtered out.",
  },
  {
    id: "sql-ox-02",
    type: "output",
    domain: "d2",
    level: "intermediate",
    lesson: "d2-nulls",
    prompt: "Type the number the query returns.",
    code:
      "-- employees(name, dept, salary)\n-- (Ann, eng, 90)  (Bo, eng, 70)  (Cy, ops, 60)  (Di, ops, NULL)\nSELECT COUNT(*)\nFROM employees\nWHERE salary <> 70;",
    codeLang: "sql",
    answers: ["2"],
    explanation:
      "Ann (90) and Cy (60) differ from 70. Bo fails the test. Di's salary is NULL, so `NULL <> 70` is unknown, not true, and the row is dropped too. If you wanted Di as well, write `salary IS DISTINCT FROM 70` (PostgreSQL) or `OR salary IS NULL`.",
  },
  {
    id: "sql-ox-03",
    type: "output",
    domain: "d2",
    level: "senior",
    lesson: "d2-outer",
    prompt: "Type the number of rows the query returns.",
    code:
      "-- depts(name):      eng, ops, hr\n-- employees(name, dept, salary):\n--   (Ann, eng, 90) (Bo, eng, 70) (Cy, ops, 60) (Di, ops, NULL)\nSELECT d.name, e.name\nFROM depts d\nLEFT JOIN employees e\n  ON e.dept = d.name\n AND e.salary > 65;",
    codeLang: "sql",
    answers: ["4"],
    explanation:
      "The salary test sits in the ON clause, so it only decides which employees match. eng matches Ann and Bo (2 rows); ops matches nobody (60 and NULL fail) but a LEFT JOIN still keeps it with NULLs (1 row); hr keeps its own row too (1 row): 4 in total. Moving the test into WHERE would drop the NULL rows and return 2.",
  },
  {
    id: "sql-ox-04",
    type: "output",
    domain: "d3",
    level: "intermediate",
    lesson: "d3-ctes",
    prompt: "Type the single value the query returns.",
    code:
      "-- employees(name, dept, salary)\n-- (Ann, eng, 90)  (Bo, eng, 70)  (Cy, ops, 60)  (Di, ops, NULL)\nWITH top AS (\n  SELECT dept, MAX(salary) AS m\n  FROM employees\n  GROUP BY dept\n)\nSELECT SUM(m) FROM top;",
    codeLang: "sql",
    answers: ["150"],
    explanation:
      "The CTE holds one row per department: eng has a maximum of 90 and ops has 60 (MAX ignores Di's NULL). Summing those two maxima gives 150.",
  },
  {
    id: "sql-ox-05",
    type: "output",
    domain: "d3",
    level: "senior",
    lesson: "d3-windows",
    prompt: "Type the value of `r` for player 'd'.",
    code:
      "-- scores(player, pts): (a, 10) (b, 20) (c, 20) (d, 5)\nSELECT player, r\nFROM (\n  SELECT player,\n         RANK() OVER (ORDER BY pts DESC) AS r\n  FROM scores\n) AS ranked\nWHERE player = 'd';",
    codeLang: "sql",
    answers: ["4"],
    explanation:
      "b and c tie for rank 1, so the next rank skips to 3 (that is a), and d lands on 4. `DENSE_RANK()` would not leave a gap and would give 3. The window function is computed in the subquery because WHERE cannot filter on a window result directly.",
  },
  {
    id: "sql-ox-06",
    type: "output",
    domain: "d4",
    level: "senior",
    lesson: "d4-transactions",
    prompt: "Type the number the final SELECT returns.",
    code:
      "-- acct(id, bal): (1, 100)\nBEGIN;\nUPDATE acct SET bal = bal - 30 WHERE id = 1;\nSAVEPOINT s;\nUPDATE acct SET bal = bal - 50 WHERE id = 1;\nROLLBACK TO s;\nCOMMIT;\nSELECT bal FROM acct WHERE id = 1;",
    codeLang: "sql",
    answers: ["70"],
    explanation:
      "`ROLLBACK TO s` undoes only the work after the savepoint (the 50 withdrawal), not the whole transaction. The first update (30) was made before the savepoint and is committed, so the balance is 100 - 30 = 70.",
  },
];
