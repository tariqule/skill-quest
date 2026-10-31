import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-api",
  module: "m7",
  title: "REST, GraphQL, gRPC",
  visual: {
    kind: "tiles",
    tiles: [
      { icon: "🌐", title: "REST", text: "Resources and HTTP verbs. Simple, cacheable, works everywhere." },
      { icon: "🧩", title: "GraphQL", text: "One endpoint. The client asks for exactly the fields it wants." },
      { icon: "⚡", title: "gRPC", text: "Typed calls with Protobuf over HTTP/2. Fast between services." },
    ],
  },
  screens: [
    { kind: "idea", text: "An **API** is the contract one program offers another: which requests it accepts and what it returns. Three styles dominate: REST, GraphQL and gRPC." },
    { kind: "idea", text: "**REST** models data as resources with URLs, like `/orders/981`, and acts on them with HTTP verbs: GET reads, POST creates, PUT replaces, PATCH edits, DELETE removes." },
    { kind: "idea", text: "REST rides on plain HTTP, so browsers, CDNs and caches understand it. A GET response can be cached with standard headers. Status codes such as 404 and 429 carry meaning." },
    { kind: "idea", text: "Fixed endpoints cause **over-fetching**: the mobile app needs a name and avatar but `/users/7` returns 40 fields, wasting bandwidth on slow networks." },
    { kind: "idea", text: "They also cause **under-fetching**: one screen needs a user, their orders and each order's items, so the app makes several round trips." },
    { kind: "idea", text: "**GraphQL** exposes one endpoint and a typed schema. The client sends a query listing exactly the fields it wants, nested as deep as needed, in one request." },
    { kind: "idea", text: "On the server, each field has a **resolver**, a function that fetches it. Naive resolvers can run one database query per item, so batching loaders matter." },
    { kind: "idea", text: "**gRPC** lets a service call a method on another as if it were local. Requests and replies are typed messages encoded in Protobuf, a compact binary format." },
    { kind: "idea", text: "gRPC runs over **HTTP/2**, which carries many calls on one connection and supports streaming in either direction, such as a server pushing a stream of updates." },
    { kind: "idea", text: "Rough fit: REST for public APIs and anything cached, GraphQL for apps with many screens fetching varied data, gRPC for fast calls between internal services." },
    {
      kind: "example",
      title: "\"Get order\" three ways",
      steps: [
        "REST: GET /orders/981 returns the order as JSON. A second call, GET /orders/981/items, fetches its items.",
        "GraphQL: POST /graphql with a query asking for order 981's status and each item's name. One round trip, only those fields.",
        "gRPC: the checkout service calls OrderService.GetOrder with id 981 and gets back a typed Order message in binary.",
        "The public partner API stays REST so anyone can use it with curl. The mobile app uses GraphQL. Internal services talk gRPC.",
      ],
    },
  ],
  tip: "Don't pick one style for everything. Say who calls the API: browsers and partners like REST, varied app screens suit GraphQL, and internal hops suit gRPC.",
  quiz: [
    {
      kind: "mcq",
      id: "t-api-q1",
      prompt: "A mobile screen needs a user, their orders and order items, and REST takes 3 round trips. Which style fixes it most directly?",
      options: ["A longer cache TTL", "GraphQL with one nested query", "More REST endpoints per field", "Switching from JSON to XML"],
      answer: 1,
      explanation: "GraphQL lets the client ask for nested data in one request. That fixes under-fetching.",
    },
    {
      kind: "mcq",
      id: "t-api-q2",
      prompt: "Two internal services exchange thousands of small calls per second. Which style fits best?",
      options: ["REST with large JSON bodies", "gRPC with Protobuf", "GraphQL with deep queries", "Emailing CSV files"],
      answer: 1,
      explanation: "gRPC's binary messages over HTTP/2 connections are compact and fast for service-to-service calls.",
    },
    {
      kind: "mcq",
      id: "t-api-q3",
      prompt: "Which HTTP verb should create a new order in a REST API?",
      options: ["GET", "POST", "DELETE", "HEAD"],
      answer: 1,
      explanation: "POST creates a resource. GET only reads and should change nothing.",
    },
    {
      kind: "tf",
      id: "t-api-q4",
      statement: "Over-fetching means an endpoint returns more fields than the client needs.",
      answer: true,
      explanation: "The client pays for data it throws away, which hurts most on mobile networks.",
    },
    {
      kind: "tf",
      id: "t-api-q5",
      statement: "GraphQL responses are cached by CDNs as easily as REST GET responses.",
      answer: false,
      explanation: "GraphQL usually sends queries by POST to one URL, so standard HTTP caching doesn't apply as simply.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-api-p1",
      prompt: "In GraphQL, what fetches the data for one field?",
      options: ["A resolver", "A REST verb", "A Protobuf file", "A CDN edge"],
      answer: 0,
      explanation: "Each field has a resolver function, which is why batching them matters.",
    },
    {
      kind: "tf",
      id: "t-api-p2",
      statement: "gRPC can stream messages in both directions over one HTTP/2 connection.",
      answer: true,
      explanation: "HTTP/2 carries many streams at once, and gRPC exposes them as streaming calls.",
    },
    {
      kind: "mcq",
      id: "t-api-p3",
      prompt: "A public API for outside developers should work with curl and be cacheable. Which style fits?",
      options: ["gRPC", "REST", "A custom TCP protocol", "Raw Protobuf over UDP"],
      answer: 1,
      explanation: "REST is plain HTTP, so any client can call it and caches understand GET.",
    },
  ],
  practiceNeeds: ["t-network"],
  sources: [
    { title: "GraphQL: Learn", url: "https://graphql.org/learn/", license: "Link only" },
    { title: "gRPC: Introduction", url: "https://grpc.io/docs/what-is-grpc/introduction/", license: "Link only" },
    { title: "System Design Primer: Communication", url: "https://github.com/donnemartin/system-design-primer#communication", license: "CC BY 4.0" },
  ],
};

export default topic;
