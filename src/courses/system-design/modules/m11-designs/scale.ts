import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-design-scale",
  module: "m11",
  title: "Design: from one server to millions",
  level: "junior",
  visual: {
    kind: "ladder",
    caption: "Each rung fixes what broke on the one below",
    rungs: [
      { icon: "🖥️", name: "One server", text: "App, database and cache on a single machine." },
      { icon: "🗄️", name: "Split the database", text: "Web and data tiers grow on their own." },
      { icon: "⚖️", name: "Load balancer and replicas", text: "No single web or database server can take everything down." },
      { icon: "⚡", name: "Cache, CDN, stateless servers", text: "Fewer slow reads, and any server can serve anyone." },
      { icon: "🌍", name: "Regions, queues, shards", text: "Global users, slow jobs off the request path, data split up." },
    ],
  },
  screens: [
    { kind: "idea", text: "A classic opener: \"Your app has ten users today. How does the design change as it grows to millions?\" The skill being tested is naming what breaks at each step, then the fix." },
    { kind: "idea", text: "Start with a **single server**. The app, the database and the cache all run on one machine. Users find it through DNS, which turns the site's name into the machine's IP address." },
    { kind: "idea", text: "The first strain: the web app and the database fight over the same CPU and memory, and one crash takes everything down. Moving the database to its own machine splits the **data tier** from the web tier." },
    { kind: "idea", text: "Next, one web server can't take the traffic and is a single point of failure. Put several behind a **load balancer**. Only the balancer is public; the web servers sit on private addresses behind it." },
    { kind: "idea", text: "Now the one database is the weak spot. Add **read replicas**: the primary takes every write and copies changes to replicas, which answer reads. If the primary dies, a replica is promoted." },
    { kind: "idea", text: "Many pages ask for the same data again and again. A **cache** in memory answers those repeat reads in a fraction of the time and takes load off the database. Give entries an expiry so they don't go stale forever." },
    { kind: "idea", text: "Images, scripts and videos don't change per user. A **CDN** keeps copies on servers near each user, so these files load fast and never touch your web servers." },
    { kind: "idea", text: "If a web server keeps a user's login in its own memory, that user must always return to it. Move session data to a shared store and the servers become **stateless**: any server can handle any request." },
    { kind: "idea", text: "Stateless servers are what make autoscaling work. When traffic rises, new servers join the pool; when it falls, they leave, and no user is logged out." },
    { kind: "idea", text: "Users across the world get **multiple regions**: each user is routed to the nearest data centre, and traffic moves to a healthy one if a region fails. The hard parts are syncing data and deploying everywhere." },
    { kind: "idea", text: "Slow jobs, such as resizing uploaded photos, shouldn't hold up the request. Put them on a **message queue** and let worker machines take them off. Add workers when the queue grows." },
    { kind: "idea", text: "Finally the database outgrows one machine. **Sharding** splits rows across many databases by a key such as user id. It brings new pains: moving data when shards fill, hot keys, and joins across shards." },
    { kind: "idea", text: "At this size you can't watch servers by hand. Collect **metrics** from every host, the whole service and the business, keep logs in one place, and automate tests and deploys." },
    {
      kind: "example",
      title: "Sizing each step",
      steps: [
        "One web server handles about 1,000 requests per second. Peak traffic is 300 per second, so one server copes for now.",
        "Peak traffic grows to 4,000 per second. That needs at least 4 web servers behind a load balancer, plus 1 spare for failures.",
        "The database now sees 3,600 reads and 400 writes per second. Reads are 90% of the load, which is a good fit for replicas.",
        "A cache that answers 80% of reads cuts database reads from 3,600 to 720 per second. One replica and a spare can now carry them.",
      ],
    },
  ],
  tip: "Don't list every box at once. Say what breaks first, then the fix: \"one server is a single point of failure, so I'd add a load balancer and a second server.\"",
  quiz: [
    {
      kind: "mcq",
      id: "t-design-scale-q1",
      prompt: "Users get logged out whenever the load balancer sends them to a different web server. What fixes it so any server can serve anyone?",
      options: ["Keep sessions in a shared store", "Give each web server more memory", "Send all traffic to one server", "Serve the pages from a CDN"],
      answer: 0,
      explanation: "With sessions in a shared store, the web servers are stateless, so any of them can pick up any user's next request.",
    },
    {
      kind: "mcq",
      id: "t-design-scale-q2",
      prompt: "Resizing photos makes uploads slow at peak times. Which change helps most?",
      options: ["Resize later via a queue and workers", "Add read replicas to the database", "Move the photos to a bigger disk", "Use a shorter DNS time to live"],
      answer: 0,
      explanation: "The upload can finish at once while workers do the slow resize from a queue. More workers can be added when the queue grows.",
    },
    {
      kind: "mcq",
      id: "t-design-scale-q3",
      prompt: "Users are sharded by user id. One celebrity's account sends so much traffic to one shard that it falls behind. What is this called?",
      options: ["A hot key", "A cache miss", "A replication lag", "A DNS failure"],
      answer: 0,
      explanation: "One key drawing far more traffic than the rest is a hot key. A common fix is giving that account its own shard or spreading it out.",
    },
    {
      kind: "tf",
      id: "t-design-scale-q4",
      statement: "Moving the database onto its own machine lets the web tier and the data tier be scaled separately.",
      answer: true,
      explanation: "Once they're apart, you can add web servers without touching the database, and grow the database without touching the web servers.",
    },
    {
      kind: "tf",
      id: "t-design-scale-q5",
      statement: "Adding read replicas spreads the write load across many database servers.",
      answer: false,
      explanation: "Every write still goes to the primary. Replicas only take reads, so heavy writes need sharding instead.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-design-scale-p1",
      prompt: "A cache answers 75% of 2,000 reads per second. How many reads per second still reach the database?",
      options: ["500", "1,500", "750", "250"],
      answer: 0,
      explanation: "25% of reads miss the cache. A quarter of 2,000 is 500.",
    },
    {
      kind: "tf",
      id: "t-design-scale-p2",
      statement: "Behind a load balancer, the web servers can use private addresses that the internet can't reach directly.",
      answer: true,
      explanation: "Only the balancer needs a public address. Keeping servers private is safer and lets you swap them freely.",
    },
  ],
  practiceNeeds: ["t-estimation"],
  sources: [
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 1 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "Donne Martin: The System Design Primer", url: "https://github.com/donnemartin/system-design-primer", license: "Link only" },
  ],
};

export default topic;
