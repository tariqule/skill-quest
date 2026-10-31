import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-batch",
  module: "m6",
  title: "Batch processing and analytics",
  visual: {
    kind: "flow",
    steps: [
      { icon: "🗄️", label: "App database", sub: "OLTP: many small reads and writes" },
      { icon: "🚚", label: "Nightly job", sub: "Extract, transform, load" },
      { icon: "📊", label: "Warehouse", sub: "OLAP: big scans for reports" },
    ],
  },
  screens: [
    { kind: "idea", text: "Your app database handles **OLTP**, online transaction processing: many small queries that each touch a few rows, like \"load order 981\" or \"add item to cart\"." },
    { kind: "idea", text: "Reports need **OLAP**, online analytical processing: few queries that each scan millions of rows, like \"revenue per country last quarter\". Running those on the app database slows every user." },
    { kind: "idea", text: "So analytics data is copied to a **data warehouse**, such as BigQuery, Snowflake or Redshift, built for big scans and kept apart from the app's traffic." },
    { kind: "idea", text: "Copying is often an **ETL** job: extract rows from the sources, transform them into a tidy shape, and load them into the warehouse, typically on a schedule." },
    { kind: "idea", text: "Warehouses use **column storage**: each column is stored together. A query summing price reads only the price column, and similar values compress very well." },
    { kind: "idea", text: "**Batch processing** runs a job over a bounded pile of data, such as yesterday's logs, and produces output when it finishes. Results are hours old, but the work is simple and cheap." },
    { kind: "idea", text: "Google's **MapReduce** (2004) split huge jobs across thousands of machines. A map step turns each record into key-value pairs, and a reduce step combines all values for one key." },
    { kind: "idea", text: "If a machine dies mid-job, MapReduce reruns just its piece. Inputs are read-only and outputs are written fresh, so a rerun is safe." },
    { kind: "idea", text: "**Apache Spark** does the same kind of work but keeps data in memory between steps, so multi-step jobs run much faster than MapReduce writing to disk each time." },
    { kind: "idea", text: "Results that pages need often are stored ahead of time as **materialized aggregates**, like daily sales per product, so a dashboard reads a small table instead of scanning raw rows." },
    {
      kind: "example",
      title: "Nightly sales-rank job",
      steps: [
        "At 2 a.m. a job extracts yesterday's 40 million order lines from the app database replica into the warehouse.",
        "Map: each order line becomes (product_id, quantity). Shuffle: all pairs for one product go to the same worker.",
        "Reduce: each worker sums quantity per product. The job then sorts products by total within each category.",
        "It writes a small table of rank per product. The product page reads its rank from that table in one quick lookup.",
        "A worker died halfway. Only its slice was rerun, and the ranks were ready by 3 a.m. Being a few hours old is fine for this.",
      ],
    },
  ],
  tip: "Separate the paths out loud: user requests hit the OLTP database, and reports run on a warehouse fed by batch jobs. Say how fresh the reports need to be.",
  quiz: [
    {
      kind: "mcq",
      id: "t-batch-q1",
      prompt: "Analysts run heavy revenue reports on the app database and checkout slows down. What's the usual fix?",
      options: ["Add an index for each report", "Copy data to a warehouse for reports", "Run reports during checkout", "Cache every report in each analyst's browser"],
      answer: 1,
      explanation: "Big analytical scans belong on a warehouse, so they don't compete with the app's small, fast queries.",
    },
    {
      kind: "mcq",
      id: "t-batch-q2",
      prompt: "Why does column storage speed up \"sum of price over a year\"?",
      options: ["It reads only the price column", "It keeps every row of the year in memory", "It sorts rows by customer id", "It stores each row twice"],
      answer: 0,
      explanation: "Values of one column sit together, so the query skips every other column and compresses well.",
    },
    {
      kind: "mcq",
      id: "t-batch-q3",
      prompt: "In MapReduce, what does the reduce step do?",
      options: ["Splits input into files", "Combines all values for a key", "Turns records into key pairs", "Copies results to the database"],
      answer: 1,
      explanation: "Map emits key-value pairs. Reduce receives every value for one key and combines them, such as summing.",
    },
    {
      kind: "tf",
      id: "t-batch-q4",
      statement: "Spark often beats MapReduce on multi-step jobs because it keeps data in memory between steps.",
      answer: true,
      explanation: "MapReduce writes to disk between steps. Spark avoids much of that.",
    },
    {
      kind: "tf",
      id: "t-batch-q5",
      statement: "Batch jobs are the natural fit when results must update within a second of each event.",
      answer: false,
      explanation: "Batch output is minutes to hours old. Second-level freshness calls for stream processing.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-batch-p1",
      prompt: "Which query is OLTP?",
      options: ["Revenue by month for 5 years", "Load the cart for user 42", "Top products per country", "Average order size per year"],
      answer: 1,
      explanation: "OLTP queries touch a few rows for one user action. The others scan large ranges.",
    },
    {
      kind: "tf",
      id: "t-batch-p2",
      statement: "ETL means extract data from sources, transform it, and load it into a target such as a warehouse.",
      answer: true,
      explanation: "It's the classic pipeline that feeds a warehouse on a schedule.",
    },
    {
      kind: "mcq",
      id: "t-batch-p3",
      prompt: "A dashboard shows daily sales per product and is slow. What helps most?",
      options: ["A materialized daily aggregate", "A bigger app database", "More web servers", "A longer cache TTL on product images"],
      answer: 0,
      explanation: "Precomputing the daily totals lets the dashboard read a small table instead of raw orders.",
    },
  ],
  practiceNeeds: ["t-sql-nosql", "t-index"],
  sources: [
    { title: "MapReduce: Simplified Data Processing on Large Clusters (Dean, Ghemawat, 2004)", url: "https://research.google/pubs/mapreduce-simplified-data-processing-on-large-clusters/", license: "Link only" },
    { title: "Apache Spark documentation", url: "https://spark.apache.org/docs/latest/", license: "Link only" },
    { title: "Designing Data-Intensive Applications (Kleppmann): batch processing", url: "https://dataintensive.net/", license: "Link only" },
  ],
};

export default topic;
