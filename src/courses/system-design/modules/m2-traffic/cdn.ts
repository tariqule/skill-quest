import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-cdn",
  module: "m2",
  title: "CDNs and edge caching",
  visual: {
    kind: "flow",
    steps: [
      { icon: "📱", label: "User in Sydney", sub: "Asks for logo.png" },
      { icon: "📍", label: "Nearby edge", sub: "Has a copy? Send it" },
      { icon: "🏢", label: "Origin in Virginia", sub: "Only asked on a miss" },
    ],
  },
  screens: [
    { kind: "idea", text: "Light in fibre takes time. A round trip from Sydney to a server in Virginia is around 200 milliseconds before any work is done, and a page may need dozens of files." },
    { kind: "idea", text: "A **CDN** (content delivery network) is many servers spread around the world that keep copies of your files, so users fetch them from somewhere nearby." },
    { kind: "idea", text: "Each of those nearby servers is called an **edge**. A user in Tokyo talks to a Tokyo edge instead of your server far away." },
    { kind: "idea", text: "Your own server, where the real files live, is called the **origin**. Edges only copy what it serves." },
    { kind: "idea", text: "On a **cache hit** the edge already has the file and answers straight away. On a miss it fetches from the origin, keeps a copy, then answers." },
    { kind: "idea", text: "The origin tells edges how long to keep a file with the **Cache-Control** header. For example, `max-age=86400` means a copy is fresh for one day." },
    { kind: "idea", text: "Changing a cached file is the hard part. The common trick is to put a version or hash in the file name, like `app.3f9a.js`. A new build gets a new name, so no stale copy is ever served." },
    {
      kind: "example",
      title: "How much the origin is spared",
      steps: [
        "A site serves 10,000 image requests per second. Without a CDN, all 10,000 hit the origin.",
        "With a CDN and a 95% hit rate, edges answer 9,500 of them, and only 500 per second reach the origin.",
        "The origin now needs about a twentieth of the bandwidth, and most users get images from a city near them.",
      ],
    },
    { kind: "idea", text: "CDNs suit content that many people share: images, video, scripts and public pages. Private, per-user data like a bank balance should usually skip the edge cache." },
  ],
  tip: "Mention a CDN as soon as a design serves media or static files to users in many regions, and say how you'll update files without serving stale copies.",
  quiz: [
    {
      kind: "mcq",
      id: "t-cdn-q1",
      prompt: "What happens on a CDN cache miss?",
      options: ["The user gets an error", "The edge fetches the file from the origin", "The browser retries the request at another edge", "The edge serves the last copy it had, even if stale"],
      answer: 1,
      explanation: "The edge asks the origin, keeps a copy for next time, then answers the user.",
    },
    {
      kind: "mcq",
      id: "t-cdn-q2",
      prompt: "Which of these is the worst fit for edge caching?",
      options: ["A shared product photo", "The site's logo image", "A popular video trailer", "A user's account balance"],
      answer: 3,
      explanation: "A balance is private to one user and changes often. Shared, slow-changing files are what edges are for.",
    },
    {
      kind: "mcq",
      id: "t-cdn-q3",
      prompt: "You ship a new app.js but users keep getting the old one. What's the cleanest fix?",
      options: ["Put a content hash in the file name", "Lower the CDN cache time to one second", "Ask users to clear their cache", "Purge the whole CDN once every night"],
      answer: 0,
      explanation: "A new name for each build means edges and browsers fetch the new file and never serve the old one under that name.",
    },
    {
      kind: "tf",
      id: "t-cdn-q4",
      statement: "A CDN mainly helps by putting copies of files physically closer to users.",
      answer: true,
      explanation: "Shorter distance means shorter round trips, and the origin handles far fewer requests.",
    },
    {
      kind: "tf",
      id: "t-cdn-q5",
      statement: "With a 90% hit rate, the origin receives 90% of the requests.",
      answer: false,
      explanation: "Hits are answered at the edge. Only the 10% that miss reach the origin.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-cdn-p1",
      prompt: "A site gets 2,000 requests per second for static files and the CDN hit rate is 99%. How many reach the origin?",
      options: ["About 1,980 per second", "About 200 per second", "About 20 per second", "None at all"],
      answer: 2,
      explanation: "1% of 2,000 is 20. The edges answer the other 1,980.",
    },
    {
      kind: "tf",
      id: "t-cdn-p2",
      statement: "The Cache-Control header lets the origin tell edges how long a copy stays fresh.",
      answer: true,
      explanation: "Headers like max-age set how long an edge or browser may reuse a copy without asking again.",
    },
  ],
  practiceNeeds: ["t-latency"],
  sources: [
    { title: "System Design Primer: Content delivery network", url: "https://github.com/donnemartin/system-design-primer#content-delivery-network", license: "CC BY 4.0" },
    { title: "MDN: Cache-Control", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control", license: "Link only" },
  ],
};

export default topic;
