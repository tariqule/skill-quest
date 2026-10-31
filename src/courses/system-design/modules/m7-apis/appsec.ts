import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-appsec",
  module: "m7",
  title: "Security: least privilege and input",
  visual: {
    preview: true,
    kind: "tiles",
    tiles: [
      { icon: "🔑", title: "Least privilege", text: "Each service and key gets only the access it needs." },
      { icon: "🧹", title: "Input validation", text: "Check type, length and format before using input." },
      { icon: "🧱", title: "Parameterized queries", text: "Values travel apart from the SQL text." },
    ],
  },
  screens: [
    { kind: "idea", text: "**Least privilege** means each user, service and key gets only the access it needs to do its job, and nothing more." },
    { kind: "idea", text: "It limits the damage of a breach. If a thumbnail worker's key can read only images, a bug in that worker can't leak card data from payments." },
    { kind: "idea", text: "Treat all input as hostile, since anyone can send any bytes to your API. **Input validation** checks type, length and format at the edge, before your code uses the input." },
    { kind: "idea", text: "Validate with an allow list where you can: say what's allowed, like digits only for an order id, and reject everything else." },
    { kind: "idea", text: "Checks in the browser help honest users, but attackers can skip the browser and call the API directly. The server must check again." },
    { kind: "idea", text: "A SQL query is text sent to the database. **SQL injection** happens when user input is pasted into that text, so crafted input can change what the query does." },
    { kind: "idea", text: "Pasting the input `x' OR '1'='1` into a lookup for one row can turn it into a query that returns every row in the table." },
    { kind: "idea", text: "A **parameterized query** sends the SQL text and the values separately. The database treats the values only as data, so input can't become SQL." },
    {
      kind: "example",
      title: "Locking down a file service",
      steps: [
        "The file service checks that each file id is digits only and at most 12 characters, and rejects anything else with 400.",
        "Its lookup is a parameterized query, so even a crafted id that slipped through can't change the SQL.",
        "Its database user can read only the files table, not payments or users.",
        "An attacker finds a bug in the service. Thanks to least privilege, the payments data is still out of reach.",
      ],
    },
  ],
  tip: "In a design review, say two things: every service gets its own narrow credentials, and every query is parameterized. Reviewers listen for both.",
  quiz: [
    {
      kind: "mcq",
      id: "t-appsec-q1",
      prompt: "What stops SQL injection most reliably?",
      options: ["Parameterized queries", "Validating input length", "Encrypting the database disk", "Sending queries over TLS"],
      answer: 0,
      explanation: "Values are sent apart from the SQL text, so input can't change the query. Length checks help but can't catch every attack.",
    },
    {
      kind: "mcq",
      id: "t-appsec-q2",
      prompt: "A thumbnail worker's key can also read the payments database. Which principle is broken?",
      options: ["Input validation", "Least privilege", "Authentication", "Encryption at rest"],
      answer: 1,
      explanation: "Each component should hold only the access it needs, and thumbnails don't need payments.",
    },
    {
      kind: "mcq",
      id: "t-appsec-q3",
      prompt: "An order id must be digits only. Where must that check happen?",
      options: ["Only in the browser's form", "On the server, before it's used", "Only when the order is shown", "After the database query has run"],
      answer: 1,
      explanation: "Attackers can skip the browser, and checking after the query is too late. The server checks before use.",
    },
    {
      kind: "tf",
      id: "t-appsec-q4",
      statement: "A parameterized query sends user input separately from the SQL text.",
      answer: true,
      explanation: "That separation is why input can't turn into SQL.",
    },
    {
      kind: "tf",
      id: "t-appsec-q5",
      statement: "Checking input in the browser is enough to stop SQL injection.",
      answer: false,
      explanation: "Attackers can call the API directly and skip the browser. The server must validate and parameterize.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-appsec-p1",
      prompt: "The file service's database user can read only the files table. What does that limit?",
      options: ["The damage if it's breached", "How fast its queries run", "Who can log in", "How many files users can upload"],
      answer: 0,
      explanation: "That's least privilege: a breached service can reach only what its credentials allow.",
    },
    {
      kind: "tf",
      id: "t-appsec-p2",
      statement: "Least privilege applies to services and keys, not just to people.",
      answer: true,
      explanation: "Every credential, human or machine, should carry only the access it needs.",
    },
    {
      kind: "mcq",
      id: "t-appsec-p3",
      prompt: "Typing x' OR '1'='1 into a search box returns every row. What happened?",
      options: ["An expired JWT", "SQL injection", "A failed TLS check", "Broken authorization"],
      answer: 1,
      explanation: "The input was pasted into the SQL text and changed the query. A parameterized query prevents it.",
    },
  ],
  practiceNeeds: ["t-security"],
  sources: [
    { title: "OWASP: SQL Injection Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html", license: "Link only" },
    { title: "OWASP: Input Validation Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html", license: "Link only" },
    { title: "NIST glossary: least privilege", url: "https://csrc.nist.gov/glossary/term/least_privilege", license: "Link only" },
  ],
};

export default topic;
