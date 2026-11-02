import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-design-feed-1",
  module: "m11",
  title: "Design a news feed: publishing",
  level: "intermediate",
  visual: {
    kind: "flow",
    steps: [
      { icon: "✍️", label: "Web servers", sub: "Check the token and the post rate" },
      { icon: "💾", label: "Post service", sub: "Saves the post once" },
      { icon: "👥", label: "Fan-out service", sub: "Finds friends, drops muted ones" },
      { icon: "📬", label: "Queue", sub: "Friend ids plus the post id" },
      { icon: "⚙️", label: "Fan-out workers", sub: "Add the post id to each friend's feed" },
    ],
  },
  screens: [
    { kind: "idea", text: "The ask: \"Design the news feed for a social app.\" Ask: web, mobile or both? What can people do? How is the feed ordered? How many friends can someone have? How many daily users? Can posts hold photos and video?" },
    { kind: "idea", text: "Say what you agreed: web and mobile apps, publish a post, see friends' posts newest first, up to 3,000 friends each, 40 million daily users, and posts may carry photos and video." },
    {
      kind: "example",
      title: "Sizing the feed",
      steps: [
        "Assume 40 million daily users, and one in four posts once a day. That's 10 million posts, divided by 86,400 seconds: about 116 posts per second.",
        "Each user opens the feed 12 times a day: 480 million reads, or about 5,560 per second. Reads outnumber posts nearly 48 to one.",
        "With 300 friends on average, each post means 300 feed writes. 116 times 300 is about 34,800 fan-out writes per second.",
        "Keep the newest 300 post ids per user at 8 bytes each: 2,400 bytes. Times 40 million users is 96 gigabytes before overhead, which a cache cluster holds.",
      ],
    },
    { kind: "idea", text: "The design splits into two flows. **Feed publishing** saves a new post and delivers it to friends' feeds. Feed building reads one user's feed back, newest first. This part covers publishing." },
    { kind: "idea", text: "Two endpoints carry most traffic. POST /v1/me/feed with the post's text publishes it, and GET /v1/me/feed returns your feed. Both send an auth token in a header, not the URL, so the server knows who you are." },
    { kind: "idea", text: "The simplest design builds a feed when it's opened: fetch each friend's recent posts, merge, sort by time. This **fan-out on read** drowns the database at 5,560 reads a second, each touching hundreds of friends." },
    { kind: "idea", text: "The fix is **fan-out on write**, also called push. When someone posts, the post id is added to every friend's ready-made feed. Opening a feed becomes one quick read from a cache." },
    { kind: "idea", text: "Push gives fast, fresh reads, but a big account's post means a flood of writes, and feeds get built for people who rarely log in. Pull wastes nothing at post time, but every feed load is slow." },
    { kind: "idea", text: "The usual answer is a **hybrid**: push for most authors, pull for the few accounts with huge followings. Part 2 shows how the two are merged when a feed is read." },
    { kind: "idea", text: "The publishing path: web servers check the auth token and rate limit posting to stop spam. The post service saves the post to its database and cache, then hands off to the fan-out and notification services." },
    { kind: "idea", text: "The fan-out service first gets the author's friend ids from a **graph store**, a database built for who-is-connected-to-whom questions. At moderate size, an indexed table of friend pairs also works." },
    { kind: "idea", text: "Next it filters that list by each friend's settings. A friend who muted the author, or who was left out of the post's audience, gets nothing, even though they're still friends." },
    { kind: "idea", text: "Then it puts the friend list and the new post id on a message queue and returns. You know queues: they absorb a burst of posts, and slow workers fall behind without losing anything." },
    { kind: "idea", text: "Fan-out workers take batches off the queue and add the post id to each friend's feed cache. Queues deliver at least once, so the add must be idempotent: adding the same id twice changes nothing." },
  ],
  tip: "Do the fan-out sum out loud: \"116 posts a second times 300 friends is about 34,800 feed writes a second\" shows why writes go through a queue.",
  quiz: [
    {
      kind: "mcq",
      id: "t-design-feed-1-q1",
      prompt: "Every feed is built from scratch when it's opened, and the posts database is overloaded at peak. Which change matches this bottleneck?",
      options: ["Serve the posts from a CDN edge", "Shard the posts table by date", "Fan out post ids at write time", "Cut the page size of each feed"],
      answer: 2,
      explanation: "The cost is building feeds on every read, so move that work to post time and read a ready list. A CDN serves media, not per-user feeds; sharding by date piles today's reads on one shard; smaller pages still query every friend.",
    },
    {
      kind: "mcq",
      id: "t-design-feed-1-q2",
      prompt: "Half your users log in less than once a month. What does fan-out on write cost you for them?",
      options: ["Slow reads when they return", "Feed writes that no one reads", "Lost posts from their friends", "Extra rows in the posts table"],
      answer: 1,
      explanation: "Push writes into every friend's feed whether or not they visit, so idle users soak up writes. Their reads are fast, nothing is lost, and the post itself is still stored once.",
    },
    {
      kind: "mcq",
      id: "t-design-feed-1-q3",
      prompt: "The fan-out service writes into all 300 friends' feeds before replying to the author, and posting takes seconds at peak. What fixes it?",
      options: ["Store whole posts in every feed", "Read friend ids from a graph store", "Check settings after the feed loads", "Queue the work for fan-out workers"],
      answer: 3,
      explanation: "Putting the friend list and post id on a queue lets the post return at once while workers catch up. Whole posts make each write bigger, a faster friend lookup still leaves 300 writes, and moving the mute check doesn't remove them.",
    },
    {
      kind: "tf",
      id: "t-design-feed-1-q4",
      statement: "A friend who muted the author is filtered out before the queue, so the post id doesn't land in their feed cache.",
      answer: true,
      explanation: "The fan-out service drops muted friends and anyone outside the post's audience before handing the list to the workers.",
    },
    {
      kind: "tf",
      id: "t-design-feed-1-q5",
      statement: "With fan-out on write, opening a feed still means querying every friend's recent posts.",
      answer: false,
      explanation: "Push did that work at post time. Opening a feed reads the user's ready list of post ids from the cache.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-design-feed-1-p1",
      prompt: "20 million posts a day, 200 friends each on average. About how many fan-out writes per second is that?",
      options: ["About 4,600", "About 231", "About 46,000", "About 460,000"],
      answer: 2,
      explanation: "20 million times 200 is 4 billion feed writes a day. Divided by 86,400 seconds, that's about 46,300 a second.",
    },
    {
      kind: "tf",
      id: "t-design-feed-1-p2",
      statement: "Because a queue can hand a batch to a worker twice, adding a post id to a feed should be safe to repeat.",
      answer: true,
      explanation: "At-least-once delivery means duplicates happen. If adding an id that's already there changes nothing, a retry is harmless.",
    },
  ],
  practiceNeeds: ["t-estimation", "t-queues"],
  sources: [
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 11 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "InfoQ: Timelines at Scale (Raffi Krikorian, Twitter)", url: "https://www.infoq.com/presentations/Twitter-Timeline-Scalability/", license: "Link only" },
    { title: "USENIX ATC 2013: TAO, Facebook's Distributed Data Store for the Social Graph", url: "https://www.usenix.org/conference/atc13/technical-sessions/presentation/bronson", license: "Link only" },
  ],
};

export default topic;
