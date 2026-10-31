import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-security",
  module: "m7",
  title: "Security basics for designs",
  visual: {
    kind: "flow",
    steps: [
      { icon: "🔒", label: "TLS", sub: "Encrypted in transit" },
      { icon: "🪪", label: "Authenticate", sub: "Who are you" },
      { icon: "✅", label: "Authorize", sub: "What may you do" },
    ],
  },
  screens: [
    { kind: "idea", text: "**TLS** encrypts traffic between client and server and proves the server's identity with a certificate. Every external connection should use HTTPS, and internal ones increasingly do too." },
    { kind: "idea", text: "**Encryption at rest** protects stored data, so a stolen disk or backup is unreadable. Keys live in a key management service, not next to the data." },
    { kind: "idea", text: "**Authentication** proves who the caller is, with a password, a passkey or a login provider." },
    { kind: "idea", text: "**Authorization** decides what that caller may do. Being logged in as Ana doesn't mean Ana may read Ben's files." },
    { kind: "idea", text: "With **sessions**, the server stores login state and gives the browser a random id in a cookie. Logging out deletes the session, so access ends at once." },
    { kind: "idea", text: "A **JWT** is a signed token holding claims, like user id and expiry. Any service can check the signature without a lookup, but a stolen token works until it expires." },
    { kind: "idea", text: "**OAuth 2** lets a user grant an app limited access to their data elsewhere, like \"read my calendar\", without handing over their password. The app gets an access token." },
    { kind: "idea", text: "**Least privilege** means each user, service and key gets only the access it needs. A breached thumbnail worker shouldn't be able to read payments." },
    { kind: "idea", text: "Treat all input as hostile. **Input validation** checks type, length and format at the edge, and output is escaped where it's displayed." },
    { kind: "idea", text: "**SQL injection** happens when input is pasted into a query string. Parameterized queries send values separately, so input can't become SQL." },
    {
      kind: "example",
      title: "Login and per-user file access",
      steps: [
        "Ana signs in over HTTPS. The auth service checks her password hash and issues a 15-minute access token.",
        "She requests GET /files/123. The gateway verifies the token's signature and expiry. That's authentication.",
        "The file service looks up file 123's owner. It belongs to Ben, so the service returns 404. That's authorization.",
        "The lookup uses a parameterized query, so a crafted file id can't change the SQL.",
        "The file service's database user can read only the files table. Even if it's breached, payments are out of reach.",
      ],
    },
  ],
  tip: "Name three layers in any design: TLS in transit, encryption at rest, and an authorization check on every resource, not just a login check at the door.",
  quiz: [
    {
      kind: "mcq",
      id: "t-security-q1",
      prompt: "A logged-in user changes a URL from /files/123 to /files/124 and sees someone else's file. What failed?",
      options: ["Authentication", "Authorization", "TLS", "Encryption at rest"],
      answer: 1,
      explanation: "The user was correctly identified. The missing check was whether they may access that file.",
    },
    {
      kind: "mcq",
      id: "t-security-q2",
      prompt: "What stops SQL injection most reliably?",
      options: ["Parameterized queries", "Longer passwords", "Encrypting the disk", "Hiding the API URL"],
      answer: 0,
      explanation: "Values are sent apart from the SQL text, so input can't change the query.",
    },
    {
      kind: "mcq",
      id: "t-security-q3",
      prompt: "A user must be logged out everywhere at once after a breach. Which is easiest to revoke?",
      options: ["Long-lived JWTs", "Server-side sessions", "Signed URLs with no expiry", "API keys in the app bundle"],
      answer: 1,
      explanation: "Deleting the stored sessions ends access immediately. A JWT stays valid until it expires.",
    },
    {
      kind: "tf",
      id: "t-security-q4",
      statement: "OAuth 2 lets an app access a user's data elsewhere without learning the user's password.",
      answer: true,
      explanation: "The user grants access and the app receives a scoped token instead.",
    },
    {
      kind: "tf",
      id: "t-security-q5",
      statement: "Encryption at rest protects data while it travels between the browser and the server.",
      answer: false,
      explanation: "That's TLS. Encryption at rest protects stored data like disks and backups.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-security-p1",
      prompt: "A thumbnail worker's credentials can also read the payments database. Which principle is broken?",
      options: ["Least privilege", "Idempotency", "Back pressure", "Forward compatibility"],
      answer: 0,
      explanation: "Each component should hold only the access it needs.",
    },
    {
      kind: "tf",
      id: "t-security-p2",
      statement: "Any service holding the right key can verify a JWT's signature without a database lookup.",
      answer: true,
      explanation: "That's the appeal of signed tokens, and why revoking them is harder.",
    },
    {
      kind: "mcq",
      id: "t-security-p3",
      prompt: "What does TLS give a browser talking to your API?",
      options: ["Encryption and server identity", "Faster database queries", "Per-user permissions", "Protection from SQL injection"],
      answer: 0,
      explanation: "TLS encrypts traffic and the certificate proves which server you reached.",
    },
  ],
  practiceNeeds: ["t-api", "t-proxy"],
  sources: [
    { title: "OWASP: SQL Injection Prevention Cheat Sheet", url: "https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html", license: "Link only" },
    { title: "OAuth 2.0", url: "https://oauth.net/2/", license: "Link only" },
    { title: "RFC 7519: JSON Web Token", url: "https://datatracker.ietf.org/doc/html/rfc7519", license: "Link only" },
    { title: "System Design Primer: Security", url: "https://github.com/donnemartin/system-design-primer#security", license: "CC BY 4.0" },
  ],
};

export default topic;
