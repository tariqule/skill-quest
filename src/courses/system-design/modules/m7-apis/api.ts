import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-api",
  module: "m7",
  title: "API design",
  visual: {
    kind: "code",
    lang: "text",
    caption: "Nouns in the path, the action in the method, the outcome in the status code.",
    code: `GET    /playlists?limit=50&cursor=p_812   200  one page of playlists
GET    /playlists/7                       200  the playlist, or 404
POST   /playlists                         201  a new playlist
PATCH  /playlists/7                       200  some fields changed
DELETE /playlists/7                       204  removed, nothing to return`,
  },
  screens: [
    { kind: "idea", text: "An **API** is the contract between a client and a server: which requests the server accepts, what each must contain, and what comes back. Once apps depend on it, changing it carelessly breaks them." },
    { kind: "idea", text: "**REST** is the most common style for web APIs. You name the things you work with, called resources, using nouns in the path, like /playlists/7, and let the HTTP method say what to do." },
    { kind: "idea", text: "GET reads, POST creates, PUT replaces, PATCH changes some fields and DELETE removes. So you write POST /playlists, not /createPlaylist: the verb belongs in the method, not the path." },
    { kind: "idea", text: "Requests that send data, and most responses, carry a **JSON** body: plain text with named fields, like {\"name\": \"Road trip\"}. Keep field names stable and return only what the client needs." },
    { kind: "idea", text: "You already know status codes from how a request travels. The first digit says who's at fault: 2xx worked, **4xx** means the client sent something wrong, and 5xx means the server failed." },
    { kind: "idea", text: "A few codes worth knowing: 201 Created after a POST, 404 when the resource doesn't exist, **409 Conflict** when the request clashes with current state, like a taken username, and 429 from a rate limiter." },
    { kind: "idea", text: "A request is **idempotent** if sending it twice has the same effect as sending it once. GET, PUT and DELETE are: deleting playlist 7 twice still leaves it deleted. So they're safe to retry." },
    { kind: "idea", text: "POST isn't idempotent, so a retried payment could charge twice. An **idempotency key** fixes that: the client sends a unique id with each action, and the server returns its first answer to any repeat." },
    { kind: "idea", text: "Don't return a whole list at once. **Pagination** hands it back in pages of, say, 50 items, along with a way to ask for the next page." },
    { kind: "idea", text: "**Offset** pagination says skip 1,000 rows, then return 50. It's easy, but the database still walks past every skipped row, and rows added between pages shift everything along." },
    { kind: "idea", text: "**Cursor** pagination returns a token marking the last item seen, such as its id. The next request asks for items after it. An index jumps straight there, so deep pages stay fast." },
    {
      kind: "example",
      title: "Paging through a busy feed",
      steps: [
        "A feed shows newest posts first. You fetch page 1 with offset 0 and limit 3, and get posts 10, 9 and 8.",
        "Posts 12 and 11 arrive. Page 2 with offset 3 now skips 12, 11 and 10, and returns 9, 8 and 7. You see 9 and 8 twice.",
        "With a cursor instead, page 1 returns posts 10, 9 and 8 plus the cursor 8. Page 2 asks for 3 posts older than 8.",
        "You get 7, 6 and 5 with no repeats. The new posts wait at the top for your next refresh.",
      ],
    },
    { kind: "idea", text: "Old app versions on phones keep calling your API for years. **Backward compatibility** means they still work after you change it: adding an optional field is safe, but renaming or removing one breaks them." },
    { kind: "idea", text: "When a change must break things, publish a new **version**, such as /v2/playlists, and keep /v1 running while clients move. Announce a retirement date before you switch the old one off." },
    { kind: "idea", text: "Most APIs check who's calling at the edge, often in the API gateway, using a token sent in a header. The services behind it trust that check. Authentication gets its own topic later." },
  ],
  tip: "Early in the interview, write the three to five main endpoints with method, path, key fields and status codes, and say which are idempotent and how lists are paged.",
  quiz: [
    {
      kind: "mcq",
      id: "t-api-q1",
      prompt: "Which endpoint follows REST style for creating a playlist?",
      options: ["GET /createPlaylist", "POST /playlists", "POST /playlists/create/new", "PUT /makePlaylist"],
      answer: 1,
      explanation: "The path names the resource and POST says create. GET shouldn't change anything, and the other two put a verb in the path.",
    },
    {
      kind: "mcq",
      id: "t-api-q2",
      prompt: "A client retries a payment POST after a timeout. What stops the payment being taken twice?",
      options: ["Returning 404 on the retry", "Sending it as a GET instead", "Waiting longer before retrying", "Sending an idempotency key"],
      answer: 3,
      explanation: "The key lets the server spot the repeat and return its first answer. Without a key it can't tell a retry from a new payment, GET mustn't change anything, and a longer wait still ends in a retry.",
    },
    {
      kind: "mcq",
      id: "t-api-q3",
      prompt: "A list endpoint is slow on deep pages, and users see repeated items while new rows arrive. What helps most?",
      options: ["Cursor-based pagination", "A bigger page size", "Offset pages with caching", "A new API version"],
      answer: 0,
      explanation: "A cursor jumps straight to the last item seen, so deep pages are fast and new rows don't shift anything. Bigger pages or caching keep the offset problems, and a new version alone changes nothing.",
    },
    {
      kind: "tf",
      id: "t-api-q4",
      statement: "Adding a new optional field to a JSON response usually keeps old clients working.",
      answer: true,
      explanation: "Old clients ignore fields they don't know. Renaming or removing a field is what breaks them.",
    },
    {
      kind: "tf",
      id: "t-api-q5",
      statement: "A 5xx status code means the client sent a bad request.",
      answer: false,
      explanation: "5xx means the server failed. A bad request from the client gets a 4xx code.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-api-p1",
      prompt: "Someone tries to sign up with an email that's already registered. Which status fits best?",
      options: ["201 Created", "409 Conflict", "500 Internal Server Error", "429 Too Many Requests"],
      answer: 1,
      explanation: "The request clashes with what already exists, which is 409. Nothing was created, the server didn't fail, and the caller isn't over a rate limit.",
    },
    {
      kind: "tf",
      id: "t-api-p2",
      statement: "Sending DELETE /orders/42 twice leaves the same end state as sending it once.",
      answer: true,
      explanation: "DELETE is idempotent: after the first call the order is gone, and the second call leaves it gone.",
    },
  ],
  sources: [
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 8 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "MDN: HTTP request methods", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Methods", license: "Link only" },
    { title: "Stripe API reference: Idempotent requests", url: "https://docs.stripe.com/api/idempotent_requests", license: "Link only" },
  ],
};

export default topic;
