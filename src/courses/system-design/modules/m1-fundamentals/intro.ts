import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-intro",
  module: "m1",
  title: "What is system design?",
  visual: {
    kind: "flow",
    steps: [
      { icon: "📱", label: "Client", sub: "A phone or browser asks for something" },
      { icon: "🖥️", label: "Server", sub: "A computer runs the app's code" },
      { icon: "🗄️", label: "Database", sub: "Keeps the data safe between visits" },
      { icon: "📨", label: "Response", sub: "The answer travels back" },
    ],
  },
  screens: [
    { kind: "idea", text: "**System design** is deciding which parts a large app needs and how they talk, so it keeps working as more people use it." },
    { kind: "idea", text: "A **client** is the thing a person holds: a phone app or a browser tab. It asks for things but keeps little data of its own." },
    { kind: "idea", text: "A **server** is a computer that runs the app's code. It receives a **request**, does the work, and sends back a **response**." },
    { kind: "idea", text: "A **database** stores data that must outlive any one request, like accounts and messages. Servers come and go; the database remembers." },
    {
      kind: "example",
      title: "Opening your inbox",
      steps: [
        "Your phone (the client) sends a request: \"messages for user 42\".",
        "A server checks who you are and asks the database for your newest messages.",
        "The database returns 20 rows; the server turns them into a response.",
        "Your phone draws the list. One request, one response, three parts.",
      ],
    },
    { kind: "idea", text: "Every design in this course grows from that picture. When one part can't keep up, you change or copy that part, and the design gets bigger one step at a time." },
  ],
  tip: "In an interview, draw the client, the server and the database first. Then ask which box breaks first as usage grows.",
  quiz: [
    {
      kind: "mcq",
      id: "t-intro-q1",
      prompt: "Which part runs the app's code and builds each response?",
      options: ["The server", "The client", "The database", "The browser"],
      answer: 0,
      explanation: "The server does the work for each request. The client asks, and the database stores data that must last.",
    },
    {
      kind: "mcq",
      id: "t-intro-q2",
      prompt: "A user's account must still exist tomorrow after every server restarts. Where should it live?",
      options: ["In the client's open tab", "In the database", "In the server's memory", "In the request itself"],
      answer: 1,
      explanation: "A database keeps data that must outlive any single request or server. Server memory is lost when the process restarts.",
    },
    {
      kind: "mcq",
      id: "t-intro-q3",
      prompt: "Your phone asks for \"my last 20 messages\". What is that message called?",
      options: ["A response", "A database", "A request", "A server"],
      answer: 2,
      explanation: "The client sends a request; the server answers with a response.",
    },
    {
      kind: "tf",
      id: "t-intro-q4",
      statement: "A server sends a response back to the client after it handles a request.",
      answer: true,
      explanation: "That's the basic loop: request in, work done, response out.",
    },
    {
      kind: "tf",
      id: "t-intro-q5",
      statement: "System design is mainly about choosing the colours and layout of an app's screens.",
      answer: false,
      explanation: "That's visual design. System design is about the parts behind the screen and how they work together at scale.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-intro-p1",
      prompt: "In the restaurant picture of an app, what plays the pantry where ingredients are kept?",
      options: ["The client", "The server", "The response", "The database"],
      answer: 3,
      explanation: "The database is the pantry: it stores what the kitchen (server) needs to fill each order.",
    },
    {
      kind: "tf",
      id: "t-intro-p2",
      statement: "Servers can be replaced or restarted while the database keeps the data.",
      answer: true,
      explanation: "Keeping lasting data in the database is what lets servers come and go safely.",
    },
  ],
  sources: [
    { title: "System Design Primer: How to approach a system design question", url: "https://github.com/donnemartin/system-design-primer#how-to-approach-a-system-design-interview-question", license: "CC BY 4.0" },
    { title: "MDN: An overview of HTTP", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview", license: "Link only" },
  ],
};

export default topic;
