import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-design-shortener",
  module: "m11",
  title: "Design a URL shortener",
  level: "junior",
  visual: {
    kind: "flow",
    steps: [
      { icon: "🔗", label: "Short link", sub: "Someone clicks it" },
      { icon: "⚖️", label: "Load balancer", sub: "Picks a web server" },
      { icon: "⚡", label: "Cache", sub: "Most codes are found here" },
      { icon: "🗄️", label: "Database", sub: "Only on a cache miss" },
      { icon: "↪️", label: "Redirect", sub: "Browser goes to the long URL" },
    ],
  },
  screens: [
    { kind: "idea", text: "The ask: \"Design a service that turns long web addresses into short links.\" Ask for an example, how many links are made a day, how short codes should be, which characters are allowed, and whether links can expire." },
    { kind: "idea", text: "There are two jobs. Creating: a POST with the long URL returns a short one. Opening: a GET on the short path sends back a **redirect**, a reply telling the browser to go to the long URL instead." },
    { kind: "idea", text: "A **301** redirect means moved for good. Browsers remember it, so repeat clicks never reach you: less load, but no click counts, and it's very hard to undo." },
    { kind: "idea", text: "A **302** redirect means moved for now. Every click comes back to your service, so you can count clicks and change where a link goes. Pick it when analytics matter." },
    {
      kind: "example",
      title: "Estimating the size",
      steps: [
        "Assume 50 million new links a day. Divide by 86,400 seconds in a day: about 580 new links per second.",
        "If each link is opened 20 times for every link made, reads are about 11,600 per second.",
        "Over 10 years that's 50 million times 365 times 10, about 183 billion links to store.",
        "At about 500 bytes per link, storage is near 91 terabytes. Big, but fine for a store split across many machines.",
        "62 to the power 6 is about 57 billion codes, too few. 62 to the power 7 is about 3.5 trillion, so codes need 7 characters.",
      ],
    },
    { kind: "idea", text: "Why 62? Codes use **base 62**: the digits 0 to 9, the 26 lowercase letters and the 26 capitals. They're safe in a web address, and 7 of them give trillions of codes." },
    { kind: "idea", text: "Way one: hash the long URL and keep the first 7 characters. Two URLs can share those 7, a **hash collision**. Then add a fixed string to the URL and hash again until the code is free." },
    { kind: "idea", text: "Checking the database on every new code is slow. A **Bloom filter** is a small in-memory check that answers \"definitely not used\" or \"maybe used\", so most checks never touch the database." },
    { kind: "idea", text: "Way two, the usual pick: take a new unique ID from an ID generator and write it in base 62. Codes can't collide. But if IDs go up by one, codes are **guessable**, so shuffle the ID first." },
    { kind: "idea", text: "Reads far outnumber writes, so put a cache in front of the database for short code to long URL. A miss goes to the database; a code that isn't anywhere gets a 404 Not Found." },
    { kind: "idea", text: "Storage is a plain lookup by short code, which suits a **key-value store**. A relational table with short code, long URL and creation time also works once it's sharded." },
    { kind: "idea", text: "Wrap up: rate limit link creation, scan new links for malware and phishing, record clicks off the request path, let links expire, and replicate the data so a failed machine loses nothing." },
  ],
  tip: "Do the estimate before choosing the code length. Saying \"183 billion links, so 7 base 62 characters\" shows the choice came from the numbers.",
  quiz: [
    {
      kind: "mcq",
      id: "t-design-shortener-q1",
      prompt: "A link was sent out with a 301 redirect to the wrong page. Why is it hard to fix for people who already clicked it?",
      options: ["Their browsers cached the redirect", "The database row can't be changed", "Short codes can never be reused", "The CDN deletes old short links"],
      answer: 0,
      explanation: "A 301 says moved for good, so browsers keep it and stop asking your service. Changing the database doesn't reach them.",
    },
    {
      kind: "mcq",
      id: "t-design-shortener-q2",
      prompt: "Two long URLs hash to the same first 7 characters. What does the service do?",
      options: ["Add a fixed string and hash again", "Give both URLs the same code", "Reject the second URL for good", "Make that code 8 characters long"],
      answer: 0,
      explanation: "Adding a fixed string changes the hash, so the second URL gets a different code. Repeat until a free code is found.",
    },
    {
      kind: "mcq",
      id: "t-design-shortener-q3",
      prompt: "Codes are base 62 of a counter that goes up by one each time. What problem does that create?",
      options: ["Anyone can guess the next link", "Two links can get the same code", "Codes grow past 20 characters", "Redirects stop after a restart"],
      answer: 0,
      explanation: "Counting up makes neighbouring codes easy to predict, so people can walk through other users' links. Shuffling the ID first fixes it.",
    },
    {
      kind: "tf",
      id: "t-design-shortener-q4",
      statement: "A Bloom filter can wrongly say a code is in use, so a yes still needs a database check.",
      answer: true,
      explanation: "Its maybe-used answer can be a false alarm, but its definitely-not answer is reliable. Only the maybes go to the database.",
    },
    {
      kind: "tf",
      id: "t-design-shortener-q5",
      statement: "Because links are opened far more often than they're made, a cache does little for a URL shortener.",
      answer: false,
      explanation: "It's the opposite. Read-heavy traffic is exactly what a cache helps with most.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-design-shortener-p1",
      prompt: "At 100 million new links a day, about how many writes per second is that?",
      options: ["About 1,160", "About 116", "About 11,600", "About 27,800"],
      answer: 0,
      explanation: "100 million divided by 86,400 seconds is about 1,157.",
    },
    {
      kind: "tf",
      id: "t-design-shortener-p2",
      statement: "Keeping only the first 7 characters of a hash can give two different long URLs the same code.",
      answer: true,
      explanation: "Cutting the hash short leaves fewer possible codes, so different inputs can collide and need resolving.",
    },
  ],
  practiceNeeds: ["t-estimation"],
  sources: [
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 8 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "MDN: Redirections in HTTP", url: "https://developer.mozilla.org/en-US/docs/Web/HTTP/Redirections", license: "Link only" },
  ],
};

export default topic;
