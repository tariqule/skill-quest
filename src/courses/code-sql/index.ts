import { defineCourse, withQuestions } from "@/engine/define";
import { codeGames } from "./games";
import { moreQuestions } from "./more";
import d1 from "./domains/d1-first-queries";
import d2 from "./domains/d2-joins-groups";
import d3 from "./domains/d3-advanced-queries";
import d4 from "./domains/d4-design-performance";

/**
 * Learn SQL: from "what is a table?" to window functions, indexes, isolation
 * levels and multi-tenant schemas. Standard SQL, with PostgreSQL behaviour
 * wherever dialects differ (the content says so when it matters).
 */
export default defineCourse({
  id: "code-sql",
  kind: "learning",
  category: "data",
  tags: ["sql", "postgresql", "joins", "group by", "window functions", "indexes", "transactions", "database"],
  provider: { id: "sql", name: "SQL", color: "#336791", icon: "🗄️" },
  code: "SQL",
  title: "Learn SQL",
  shortTitle: "SQL",
  tagline: "Ask a database questions: SELECT, joins, GROUP BY, window functions, indexes and transactions, learned by playing with live tables.",
  level: "Beginner",
  storageKey: "course:code-sql:v1",

  domains: withQuestions([d1, d2, d3, d4], [...moreQuestions, ...codeGames]),

  exam: {
    questions: 30,
    unscored: 0,
    minutes: 45,
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "One correct answer. Often \"what does this query return?\"." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "The prompt says how many to pick. You need all of them right to score." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Arrange clauses, statements or steps into the order that works." },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair each item with its answer. Every pair must be right." },
      { id: "lines", icon: "🐞", name: "Bug hunt", rule: "Tap the line (or lines) in the query that cause the bug or the error." },
    ],
  },

  guide: {
    source: {
      label: "SQL learning path, based on the PostgreSQL documentation",
      version: "2026",
      date: "October 2026",
      url: "https://www.postgresql.org/docs/current/",
    },
    facts: [
      { icon: "🗄️", value: "SQL", label: "everywhere", detail: "Relational databases (PostgreSQL, MySQL, SQLite, SQL Server, Oracle) and most analytics warehouses speak SQL. The core you learn here carries across all of them." },
      { icon: "🐘", value: "Postgres", label: "flavoured", detail: "Examples are standard SQL. Where databases disagree (NULL sort order, LIKE case rules, upserts) the lesson tells you and follows PostgreSQL." },
      { icon: "🧪", value: "4", label: "playgrounds", detail: "Change a clause and watch the rows change: a query builder, a join visualizer, GROUP BY buckets, and two sessions racing on one balance." },
      { icon: "🌱", value: "Zero", label: "to start", detail: "World 1 starts with \"Start here\" lessons that assume you've never seen a database. Each world builds on the one before it." },
      { icon: "🏗️", value: "Real", label: "world use", detail: "Later worlds cover what teams run into in production: indexes and query plans, transactions, migrations, and multi-tenant schemas." },
      { icon: "🏁", value: "70", label: "to pass", detail: "The final skill check: 30 mixed questions in 45 minutes. Score 70 out of 100 to pass." },
    ],
    candidate: {
      is: [
        "New to databases and wants to read and write SQL with confidence",
        "A developer, analyst or PM who copies queries today and wants to understand them",
        "Comfortable with basic queries and ready for joins, GROUP BY, CTEs and window functions",
        "Building or running an app on PostgreSQL and wants to understand indexes, transactions and migrations",
      ],
      isNot: [
        "A database administration course (replication, backups, tuning server settings)",
        "Tied to one vendor's extensions, apart from where a lesson says so",
        "An ORM or framework tutorial",
        "A data-science or statistics course",
      ],
    },
    scope: {
      label: "Topics covered",
      groups: [
        { category: "Basics", icon: "🧱", services: ["Tables, rows, columns", "Data types", "Primary keys", "SELECT", "WHERE", "ORDER BY", "LIMIT", "DISTINCT"] },
        { category: "Changing data", icon: "✏️", services: ["INSERT", "UPDATE", "DELETE", "RETURNING", "ON CONFLICT (upsert)"] },
        { category: "Combining tables", icon: "🔗", services: ["INNER JOIN", "LEFT, RIGHT and FULL JOIN", "Anti-joins", "Self joins"] },
        { category: "Summarising", icon: "📊", services: ["COUNT, SUM and AVG", "GROUP BY", "HAVING", "Logical query order"] },
        { category: "NULL", icon: "❓", services: ["Three-valued logic", "IS NULL", "COALESCE", "NOT IN trap"] },
        { category: "Advanced queries", icon: "🧠", services: ["Subqueries", "EXISTS", "CTEs", "Recursive CTEs", "Window functions", "CASE", "UNION, INTERSECT and EXCEPT"] },
        { category: "Design", icon: "📐", services: ["Normalization", "Foreign keys", "Constraints", "Indexes", "EXPLAIN"] },
        { category: "Production", icon: "🏭", services: ["Transactions & ACID", "Isolation levels", "Locks", "Migrations", "Multi-tenancy", "OLTP and OLAP"] },
      ],
    },
    tips: [
      { icon: "🧪", tip: "Run everything. A free local PostgreSQL or SQLite takes minutes to set up, and every example here is small enough to type in." },
      { icon: "🔍", tip: "Before running an UPDATE or DELETE, run the same WHERE clause as a SELECT and check the rows it finds." },
      { icon: "🧭", tip: "Read a query in the order the database runs it: FROM and JOIN, then WHERE, GROUP BY, HAVING, SELECT, ORDER BY, LIMIT." },
      { icon: "❓", tip: "Whenever a column can be NULL, ask what your condition does with it. Most surprising results come from NULL." },
      { icon: "📏", tip: "Never trust row order without ORDER BY, and add a unique tiebreaker (like id) when you paginate." },
      { icon: "🐢", tip: "When a query is slow, look at EXPLAIN ANALYZE before guessing. The plan tells you whether an index was used and where time went." },
    ],
    officialPractice: { label: "The PostgreSQL tutorial (postgresql.org)", url: "https://www.postgresql.org/docs/current/tutorial.html" },
  },

  cheatsheet: [
    {
      title: "Query skeleton",
      items: [
        ["Written order", "SELECT … FROM … JOIN … WHERE … GROUP BY … HAVING … ORDER BY … LIMIT"],
        ["Run order", "FROM and JOIN, then WHERE, GROUP BY, HAVING, SELECT, DISTINCT, ORDER BY, LIMIT"],
        ["Aliases", "SELECT aliases work in ORDER BY but not in WHERE, because WHERE runs first"],
        ["Strings", "'Single quotes' for text, \"double quotes\" for column and table names"],
        ["LIMIT n OFFSET m", "Skip m rows, return n. Standard form: OFFSET m ROWS FETCH FIRST n ROWS ONLY"],
      ],
    },
    {
      title: "Filtering",
      items: [
        ["AND and OR", "AND is applied before OR, so add parentheses"],
        ["BETWEEN a AND b", "Inclusive on both ends"],
        ["IN (…)", "A short way to write several \"equals\" tests joined by OR"],
        ["LIKE", "% is any run of characters and _ is exactly one. Case-sensitive in PostgreSQL, but ILIKE isn't"],
        ["IS NULL", "The only way to test for NULL, because comparing with NULL is never true"],
      ],
    },
    {
      title: "Joins and aggregates",
      items: [
        ["INNER JOIN", "Only matching pairs"],
        ["LEFT JOIN", "All rows from the left table, with NULLs where nothing matches"],
        ["Anti-join", "LEFT JOIN … WHERE right.id IS NULL, or NOT EXISTS"],
        ["COUNT(*) and COUNT(col)", "All rows, or only rows where col isn't NULL"],
        ["WHERE and HAVING", "WHERE filters rows before grouping, and HAVING filters groups after"],
      ],
    },
    {
      title: "NULL survival kit",
      items: [
        ["NULL = NULL", "Gives NULL (unknown), not true"],
        ["COALESCE(a, b)", "First non-NULL argument"],
        ["NULLIF(a, b)", "NULL when a equals b, otherwise a. Handy for avoiding division by zero"],
        ["NOT IN with a NULL", "x NOT IN (1, NULL) is never true, so prefer NOT EXISTS"],
        ["Sorting", "PostgreSQL puts NULLs last for ASC and first for DESC. Change it with NULLS FIRST or NULLS LAST"],
      ],
    },
    {
      title: "Window functions",
      items: [
        ["Shape", "fn() OVER (PARTITION BY … ORDER BY … frame)"],
        ["ROW_NUMBER, RANK, DENSE_RANK", "With a tie for first: 1, 2, 3, then 1, 1, 3, then 1, 1, 2"],
        ["LAG and LEAD", "The value from the previous row or the next row"],
        ["Running total", "SUM(x) OVER (ORDER BY d). The default frame includes tied rows"],
        ["Filter on a window", "Wrap it in a subquery or CTE, because WHERE can't see it"],
      ],
    },
    {
      title: "Design and performance",
      items: [
        ["3NF", "Every non-key column depends on the key, the whole key, and nothing but the key"],
        ["Composite index (a, b)", "Can look up a, or a and b, but not b alone efficiently"],
        ["EXPLAIN ANALYZE", "Runs the query and shows the real plan, rows and timings"],
        ["PostgreSQL default isolation", "READ COMMITTED"],
        ["Lost update fix", "An atomic UPDATE … SET x = x - 1, SELECT … FOR UPDATE, or a stricter level with retries"],
        ["Expand, migrate, contract", "Schema changes with no downtime"],
      ],
    },
  ],

  config: {
    quest: { length: 8 },
    boss: { questions: 25, minutes: 30 },
    examModes: [
      { id: "full", name: "Final skill check", icon: "🏁", questions: 30, unscored: 0, minutes: 45, full: true },
      { id: "quick", name: "Quick check", icon: "⚡", questions: 15, unscored: 0, minutes: 20, full: false },
    ],
  },

  boss: { name: "The Cartesian Kraken", emoji: "🐙" },
  matchLabel: "SQL keywords & functions",
  levelTitles: [
    "Row Rookie",
    "SELECT Scout",
    "WHERE Wanderer",
    "Join Journeyer",
    "GROUP BY Guardian",
    "NULL Navigator",
    "Subquery Sage",
    "Window Wizard",
    "Index Architect",
    "Grandmaster of the Query Plan",
  ],
});
