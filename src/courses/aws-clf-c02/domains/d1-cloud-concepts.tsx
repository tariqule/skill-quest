import { Flow, Layers, Ladder, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { ElasticityLab, PillarWheel } from "../visuals";

/**
 * Domain 1: Cloud Concepts (24% of scored content).
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "Cloud Concepts",
    world: "Cumulus Plains",
    weight: 24,
    emoji: "🌤️",
    color: "#38bdf8",
    summary: "What the cloud is and why companies move to it. You'll learn its benefits, how AWS judges a good design, how a company plans the move, and how cloud costs work.",
  },

  tasks: [
    {
      id: "1.1",
      title: "Define the benefits of the AWS Cloud",
      covers: [
        "The value proposition of the AWS Cloud",
        "Benefits of the global infrastructure: speed of deployment and global reach",
        "Advantages of high availability, elasticity, and agility",
      ],
    },
    {
      id: "1.2",
      title: "Identify design principles of the AWS Cloud",
      covers: [
        "The AWS Well-Architected Framework",
        "The six pillars: operational excellence, security, reliability, performance efficiency, cost optimization, sustainability",
        "Telling the pillars apart",
      ],
    },
    {
      id: "1.3",
      title: "Understand the benefits of and strategies for migration to the AWS Cloud",
      covers: [
        "Cloud adoption strategies and resources for the migration journey",
        "AWS Cloud Adoption Framework (AWS CAF) components and outcomes: reduced business risk, improved ESG performance, increased revenue, increased operational efficiency",
        "Choosing a migration strategy (for example, database replication)",
      ],
    },
    {
      id: "1.4",
      title: "Understand concepts of cloud economics",
      covers: [
        "Aspects of cloud economics and the cost savings of moving to the cloud",
        "Fixed costs compared with variable costs; costs of on-premises environments",
        "Licensing strategies: bring your own license (BYOL) compared with included licenses",
        "Rightsizing, the benefits of automation, and economies of scale",
      ],
    },
  ],

  lessons: [
    {
      id: "d1-start-what-is-cloud",
      level: "beginner",
      check: ["clf-b1-01", "clf-b1-02"],
      task: "1.1",
      title: "What \"the cloud\" actually means",
      visual: (
        <Flow
          steps={[
            { icon: "💻", label: "You", sub: "Open a browser or an app" },
            { icon: "🌐", label: "The internet", sub: "Carries your request" },
            { icon: "🏢", label: "AWS data center", sub: "Real computers that AWS owns and runs" },
            { icon: "✅", label: "Your result", sub: "A website, a file, an answer" },
          ]}
        />
      ),
      points: [
        "The **cloud** is computers in someone else's building that you rent over the internet. You use them, but you don't buy, power or fix them.",
        "Think of electricity. You don't run a generator at home. You plug into the grid and pay for what you use. The cloud works the same way for computing.",
        "**AWS** (Amazon Web Services) is a cloud provider. It rents out servers, storage, databases and hundreds of other building blocks.",
        "A **server** is just a computer that does work for other computers, like showing a web page or storing files.",
      ],
      tip: "When a question says \"without buying hardware\" or \"without running a data center\", it's pointing at the basic idea of the cloud.",
    },
    {
      id: "d1-start-pay-as-you-go",
      level: "beginner",
      check: ["clf-b1-03", "clf-b1-04"],
      task: "1.4",
      title: "Renting instead of buying",
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🏢", title: "Your own servers", text: "You pay a lot up front, before you know how much you'll need.", color: "#fb7185" },
            { icon: "☁️", title: "Cloud servers", text: "You pay a small amount for each hour you use, and stop when you're done.", color: "#34d399" },
          ]}
        />
      ),
      points: [
        "Buying servers is like buying a car: a big payment up front, and you pay for it whether you drive or not.",
        "The cloud is more like a taxi. You pay for each trip, and when you stop riding, you stop paying.",
        "AWS calls this **pay-as-you-go** pricing. You're billed for what you actually use, by the second, hour, gigabyte or request.",
        "Because you can add or remove servers in minutes, you no longer have to guess years ahead how many you'll need.",
      ],
      tip: "If a question mentions paying only for what you use, or avoiding a large up-front purchase, the answer is about pay-as-you-go pricing.",
    },
    {
      id: "d1-start-where-cloud-lives",
      level: "beginner",
      check: ["clf-b1-05", "clf-b1-06"],
      task: "1.1",
      title: "Where the cloud lives: Regions and Availability Zones",
      visual: (
        <Ladder
          rungs={[
            { icon: "🗺️", name: "Region", text: "A part of the world, such as Ireland or Tokyo, where AWS has data centers." },
            { icon: "🏘️", name: "Availability Zone", text: "One or more separate data centers inside a Region, with their own power and network." },
            { icon: "🖥️", name: "Your resources", text: "The servers and storage you create, placed in a zone you pick." },
          ]}
        />
      ),
      points: [
        "AWS has data centers all over the world. A **Region** is a geographic area, like Frankfurt or Sydney, where AWS groups them.",
        "Each Region has several **Availability Zones** (AZs). An AZ is one or more data centers with its own power, cooling and network.",
        "It's like a chain store with several branches in one city. If one branch floods, the others stay open.",
        "Putting your app in two or more AZs means it keeps running when one of them has a problem.",
      ],
      tip: "Pick a Region close to your users for speed. Use more than one Availability Zone so one failure doesn't take you offline.",
    },
    {
      id: "d1-benefits",
      check: ["d1-01", "d1-02"],
      sources: [{ title: "Overview of Amazon Web Services: Six advantages of cloud computing", url: "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/six-advantages-of-cloud-computing.html", license: "AWS docs, facts only" }],
      task: "1.1",
      title: "Why the cloud: elasticity, agility, global reach",
      visual: (
        <div className="grid gap-6">
          <ElasticityLab />
          <Tiles
            cols={3}
            tiles={[
              { icon: "💸", title: "Variable expense", text: "Pay for what you use instead of buying servers up front.", color: "#38bdf8" },
              { icon: "🏭", title: "Economies of scale", text: "AWS buys and runs hardware for millions of customers, so prices are lower.", color: "#38bdf8" },
              { icon: "🔮", title: "Stop guessing capacity", text: "Scale up or down in minutes instead of planning years ahead.", color: "#38bdf8" },
              { icon: "🏎️", title: "Speed and agility", text: "New resources in minutes, so experiments are cheap and fast.", color: "#38bdf8" },
              { icon: "🏗️", title: "No data centers to run", text: "Spend on your customers, not on racking and powering servers.", color: "#38bdf8" },
              { icon: "🌍", title: "Go global in minutes", text: "Deploy in Regions around the world with a few clicks.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "**Elasticity** means you add capacity when you need it and give it back when you don't, automatically. A shop that's busy at Christmas gets extra servers just for December.",
        "**High availability** means your app keeps running when a part fails. You get it by spreading the app across more than one Availability Zone.",
        "**Agility** means trying something new is quick and cheap. A test environment takes minutes to build, not weeks, and you can delete it the same day.",
        "Because AWS has Regions around the world, you can launch close to users on another continent in minutes. That's what AWS means by **global reach**.",
        "A **load balancer** (the Elastic Load Balancing service) spreads incoming traffic across servers in several Availability Zones and stops sending traffic to any server that fails.",
      ],
      tip: "If traffic goes up and down a lot, or has seasonal peaks, the answer is usually elasticity (with Auto Scaling). If the team wants to try ideas quickly and cheaply, it's agility.",
    },
    {
      id: "d1-wellarchitected",
      check: ["d1-08", "d1-09"],
      sources: [{ title: "AWS Well-Architected Framework: The pillars of the framework", url: "https://docs.aws.amazon.com/wellarchitected/latest/framework/the-pillars-of-the-framework.html", license: "AWS docs, facts only" }],
      task: "1.2",
      title: "The six Well-Architected pillars",
      visual: <PillarWheel />,
      points: [
        "The **Well-Architected Framework** is AWS's checklist for a good cloud design. It has six pillars: operational excellence, security, reliability, performance efficiency, cost optimization and sustainability.",
        "**Reliability** is about recovering from failure and keeping up with demand. **Performance efficiency** is about picking the right type and size of resource and using it well.",
        "**Cost optimization** means not paying for things you don't need. **Sustainability** means lowering environmental impact, for example by keeping servers busy instead of idle.",
        "The **AWS Well-Architected Tool** walks you through questions about your workload and flags risks against the framework. It costs nothing extra.",
        "The security pillar covers a strong identity foundation (who can do what) and protecting data both **in transit** (moving over a network) and **at rest** (stored on disk).",
      ],
      tip: "Look for the keyword. \"Recover\" points to reliability. \"Right resource type and size\" points to performance efficiency. \"Environmental impact\" points to sustainability.",
    },
    {
      id: "d1-caf",
      check: ["d1-17", "d1-18"],
      task: "1.3",
      title: "The AWS Cloud Adoption Framework",
      visual: (
        <div className="grid gap-4">
          <Layers
            layers={[
              { name: "Business capabilities", color: "#38bdf8", items: ["💼 Business", "🧑‍🤝‍🧑 People", "🏛️ Governance"] },
              { name: "Technical capabilities", color: "#a78bfa", items: ["🧱 Platform", "🔐 Security", "🛠️ Operations"] },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🛡️", title: "Reduced business risk", text: "Systems that are more reliable, faster and safer.", color: "#34d399" },
              { icon: "🌱", title: "Improved ESG", text: "Better environmental, social and governance results.", color: "#34d399" },
              { icon: "📈", title: "Increased revenue", text: "New products reach new customers sooner.", color: "#34d399" },
              { icon: "⚙️", title: "Operational efficiency", text: "Lower running costs and more done per person.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "The **AWS Cloud Adoption Framework** (AWS CAF) is AWS's advice on how a whole organization moves to the cloud. It groups that advice into six perspectives.",
        "Three perspectives are about the business: Business, People and Governance. Three are technical: Platform, Security and Operations.",
        "**People** covers culture, team changes and skills. **Governance** covers steering the program, managing risk and keeping cloud spending under control.",
      ],
      tip: "If the problem is training staff or changing how teams work, think People. If it's designing the cloud platform and architecture, think Platform.",
    },
    {
      id: "d1-migration",
      check: ["d1-23", "d1-28"],
      task: "1.3",
      title: "Migration strategies: the 7 Rs",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "🚚", title: "Rehost", text: "Lift and shift: move servers to EC2 exactly as they are.", color: "#f59e0b" },
              { icon: "🏷️", title: "Relocate", text: "Move a whole platform, such as VMware, without new hardware or app changes.", color: "#f59e0b" },
              { icon: "🔧", title: "Replatform", text: "Lift, tinker, and shift: for example, a database moves to Amazon RDS.", color: "#f59e0b" },
              { icon: "🛒", title: "Repurchase", text: "Drop and shop: switch to a ready-made SaaS product.", color: "#f59e0b" },
              { icon: "🧬", title: "Refactor", text: "Rebuild the app to use cloud features, such as serverless.", color: "#f59e0b" },
              { icon: "🗑️", title: "Retire", text: "Switch off what nobody needs.", color: "#f59e0b" },
              { icon: "⏸️", title: "Retain", text: "Keep it where it is, for now.", color: "#f59e0b" },
            ]}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "🔍", label: "Assess", sub: "Make the business case and check you're ready (Migration Evaluator, Application Discovery Service)" },
              { icon: "🧭", label: "Mobilize", sub: "Make a plan, fix the gaps, and set up your first AWS accounts" },
              { icon: "🚀", label: "Migrate and modernize", sub: "Move the workloads with Application Migration Service and AWS DMS, and track them in Migration Hub" },
            ]}
          />
        </div>
      ),
      points: [
        "**AWS Database Migration Service** (AWS DMS) moves a database with very little downtime. Your old database keeps working while every change is copied across to the new one.",
        "A database **schema** is its layout of tables and columns. The **AWS Schema Conversion Tool** (AWS SCT) rewrites it for a different engine, for example Oracle to Amazon Aurora PostgreSQL.",
        "**Application Discovery Service** gathers facts about the servers you run today. **Migration Evaluator** turns facts like these into a business case with projected AWS costs.",
        "**AWS Application Migration Service** copies your servers onto AWS as they are. **AWS Migration Hub** shows the progress of the whole migration in one place.",
      ],
      tip: "If nothing in the app changes, it's rehost. If you move to a managed service but keep the app, it's replatform. If you rebuild it as microservices, it's refactor.",
    },
    {
      id: "d1-economics",
      check: ["d1-32", "d1-34"],
      task: "1.4",
      title: "Cloud economics",
      visual: (
        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-rose-400/30 bg-rose-400/5 p-3">
              <div className="font-bold text-rose-200">🏢 On-premises: fixed costs (CapEx)</div>
              <ul className="mt-2 grid gap-1 text-sm text-slate-300">
                <li>• Servers and storage bought years ahead, sized for the busiest day</li>
                <li>• Data center space, power, and cooling</li>
                <li>• Staff to rack, patch, and replace hardware</li>
                <li>• Hardware refreshes every few years</li>
              </ul>
            </div>
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3">
              <div className="font-bold text-emerald-200">☁️ AWS: variable costs (OpEx)</div>
              <ul className="mt-2 grid gap-1 text-sm text-slate-300">
                <li>• Pay as you go, per second, hour, GB, or request</li>
                <li>• Scale down and you stop paying for it</li>
                <li>• Lower prices from the huge scale of AWS</li>
                <li>• Automation cuts manual work and mistakes</li>
              </ul>
            </div>
          </div>
          <Tiles
            cols={3}
            tiles={[
              { icon: "📏", title: "Rightsizing", text: "Pick a server size that matches what you really use. AWS Compute Optimizer suggests one.", color: "#34d399" },
              { icon: "🪪", title: "BYOL or license included", text: "Bring software licenses you already own, or pay for the license inside the hourly price.", color: "#34d399" },
              { icon: "🤖", title: "Automation", text: "Infrastructure as code builds the same setup every time, and schedules switch off idle servers.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "Buying servers is a **capital expense** (CapEx): a big, fixed payment up front. The cloud turns that into an **operating expense** (OpEx) that goes up and down with use.",
        "**Total cost of ownership** (TCO) is everything it costs to run your own servers: the hardware, the building, power, cooling, and the people who look after it all.",
        "With **bring your own license** (BYOL), you reuse software licenses you already own, which can save money. With license-included pricing, the license is part of the hourly price.",
        "**Rightsizing** means shrinking servers that are bigger than they need to be. You keep doing it: measure usage, then resize what's under-used.",
      ],
      tip: "If the company already owns licenses, think BYOL (Dedicated Hosts when licenses are counted per core or per socket). If CPU sits at 5% all month, think rightsizing.",
    },
  ],

  questions: [
    {
      id: "clf-b1-01",
      domain: "d1",
      lesson: "d1-start-what-is-cloud",
      level: "beginner",
      prompt: "In everyday terms, what is \"the cloud\"?",
      options: [
        "Computers in someone else's data center that you rent over the internet",
        "A type of weather satellite that stores your files high above the earth",
        "Software that only runs on your own laptop",
        "A cable that connects two offices",
      ],
      answer: [0],
      explanation: "The cloud is computing power you rent from a provider like AWS. The computers are real, but they sit in the provider's data centers, and you reach them over the internet.",
    },
    {
      id: "clf-b1-02",
      domain: "d1",
      lesson: "d1-start-what-is-cloud",
      level: "beginner",
      prompt: "What is AWS?",
      options: ["A cloud provider that rents out computing services", "A brand of laptop", "A programming language that websites use to show pages to visitors", "A web browser"],
      answer: [0],
      explanation: "AWS stands for Amazon Web Services. It's a cloud provider: it rents out servers, storage, databases and many other services that you use over the internet.",
    },
    {
      id: "clf-b1-03",
      domain: "d1",
      lesson: "d1-start-pay-as-you-go",
      level: "beginner",
      prompt: "A small company runs a test server on AWS for three hours, then deletes it. With pay-as-you-go pricing, what does it pay for?",
      options: ["Only the time the server was running", "A full year of server time", "The cost of buying the physical server", "Nothing, because AWS is always free"],
      answer: [0],
      explanation: "Pay-as-you-go means you're billed for what you actually use. Once the server is deleted, the charges stop, a bit like paying a taxi fare only for the trip you took.",
    },
    {
      id: "clf-b1-04",
      domain: "d1",
      lesson: "d1-start-pay-as-you-go",
      level: "beginner",
      prompt: "Why don't cloud customers need to guess years ahead how many servers they'll need?",
      options: [
        "They can add or remove servers in minutes as their needs change",
        "AWS guesses for them and sends a fixed bill",
        "They must buy the biggest servers up front to be safe",
        "Cloud servers never get busy",
      ],
      answer: [0],
      explanation: "In the cloud you can add servers when you get busy and remove them when things calm down. You change your mind as often as you like, instead of buying for the future up front.",
    },
    {
      id: "clf-b1-05",
      domain: "d1",
      lesson: "d1-start-where-cloud-lives",
      level: "beginner",
      prompt: "What is an AWS Region?",
      options: [
        "A geographic area, such as Frankfurt or Tokyo, where AWS has a group of data centers",
        "A single server rack",
        "A discount plan for customers who keep all of their servers and data in a single country",
        "A folder for storing files",
      ],
      answer: [0],
      explanation: "A Region is a part of the world where AWS runs data centers. You choose a Region when you create resources, usually one close to your users.",
    },
    {
      id: "clf-b1-06",
      domain: "d1",
      lesson: "d1-start-where-cloud-lives",
      level: "beginner",
      prompt: "Why would you run your app in two Availability Zones instead of one?",
      options: [
        "So the app keeps running if one zone has a problem",
        "Because AWS charges less for two zones",
        "So the app uses a different programming language",
        "Because one zone can only hold one server",
      ],
      answer: [0],
      explanation: "Each Availability Zone has its own power and network. If one has trouble, your copy in the other zone keeps serving users, like a second branch of a shop staying open.",
    },
    {
      id: "d1-01",
      domain: "d1",
      lesson: "d1-benefits",
      prompt: "An online ticket seller has quiet weeks and huge spikes when concerts go on sale. It no longer wants to buy servers sized for the biggest spike. Which AWS Cloud benefit addresses this?",
      options: ["Stop guessing capacity", "Increase upfront capital spending", "Run every workload in a single Availability Zone", "Sign multi-year hardware leases"],
      answer: [0],
      explanation: "With elastic capacity you add resources for spikes and release them afterwards, so you don't have to size for the peak in advance.",
    },
    {
      id: "d1-02",
      domain: "d1",
      lesson: "d1-benefits",
      prompt: "Which statement BEST describes elasticity in the AWS Cloud?",
      options: [
        "Resources are automatically added and removed to match demand",
        "Data is replicated to at least three Regions",
        "Every resource is reserved for three years at a fixed price",
        "Applications never fail",
      ],
      answer: [0],
      explanation: "Elasticity means capacity follows demand up and down, typically with Auto Scaling, so you pay only for what you need.",
    },
    {
      id: "d1-03",
      domain: "d1",
      lesson: "d1-benefits",
      prompt: "A company wants to serve customers in a new continent next week with low latency, without building a data center there. Which AWS benefit makes this possible?",
      options: ["Economies of scale", "Go global in minutes", "Shared responsibility", "Consolidated billing"],
      answer: [1],
      explanation: "The AWS global infrastructure lets you deploy in Regions around the world in minutes, close to your users.",
    },
    {
      id: "d1-04",
      domain: "d1",
      lesson: "d1-benefits",
      prompt: "A product team can launch a test environment in minutes, try an idea, and delete it the same day if it fails. Which benefit of the cloud does this show?",
      options: ["Agility", "Data sovereignty", "Fixed costs", "Vertical licensing"],
      answer: [0],
      explanation: "Agility means a lower cost and time to experiment, so teams innovate faster.",
    },
    {
      id: "d1-05",
      domain: "d1",
      lesson: "d1-benefits",
      prompt: "A company runs its web servers in two Availability Zones behind a load balancer. One zone has a power problem, and the site keeps working. Which concept does this demonstrate?",
      options: ["Economies of scale", "High availability", "Pay-as-you-go pricing", "Rightsizing"],
      answer: [1],
      explanation: "High availability means the system keeps operating when a component or location fails. Spreading across Availability Zones removes single points of failure.",
    },
    {
      id: "d1-06",
      domain: "d1",
      lesson: "d1-benefits",
      prompt: "How do AWS economies of scale benefit customers?",
      options: [
        "Customers must buy hardware in bulk",
        "Aggregated usage from many customers lets AWS offer lower pay-as-you-go prices",
        "Each customer gets its own dedicated data center, so it never shares hardware with others",
        "Prices are fixed and never change",
      ],
      answer: [1],
      explanation: "Because AWS operates at very large scale, it can buy and run infrastructure more cheaply and pass savings on as lower prices.",
    },
    {
      id: "d1-07",
      domain: "d1",
      lesson: "d1-benefits",
      prompt: "Which are benefits of moving workloads to the AWS Cloud? (Choose two.)",
      options: [
        "Increased speed and agility",
        "No more spending on running and maintaining data centers",
        "AWS takes over all security responsibilities",
        "Long-term contracts are required for every service",
        "Costs are guaranteed to be zero",
      ],
      answer: [0, 1],
      explanation: "The cloud speeds up delivery and removes the work of running data centers. Security is shared, and most services need no long-term contract.",
    },
    {
      id: "d1-08",
      domain: "d1",
      lesson: "d1-wellarchitected",
      prompt: "Which pillar of the AWS Well-Architected Framework focuses on a workload's ability to recover from failures and meet demand?",
      options: ["Performance efficiency", "Reliability", "Cost optimization", "Operational excellence"],
      answer: [1],
      explanation: "Reliability is about bouncing back from failures and keeping up with demand. It includes testing your recovery, adding more servers to share load, and not guessing capacity.",
    },
    {
      id: "d1-09",
      domain: "d1",
      lesson: "d1-wellarchitected",
      prompt: "A company wants to reduce the environmental impact of its workloads by maximizing utilization and using managed services. Which Well-Architected pillar is this?",
      options: ["Sustainability", "Security", "Reliability", "Performance efficiency"],
      answer: [0],
      explanation: "The sustainability pillar focuses on minimizing environmental impact, for example by maximizing utilization and choosing efficient, managed services.",
    },
    {
      id: "d1-10",
      domain: "d1",
      lesson: "d1-wellarchitected",
      prompt: "Implementing a strong identity foundation and protecting data in transit and at rest are design principles of which pillar?",
      options: ["Operational excellence", "Cost optimization", "Security", "Sustainability"],
      answer: [2],
      explanation: "The security pillar covers who can access what, keeping a record of actions, protecting every layer, and protecting data. A strong identity foundation and encryption both belong here.",
    },
    {
      id: "d1-11",
      domain: "d1",
      lesson: "d1-wellarchitected",
      prompt: "A team automates its changes, deploys in small reversible steps, and reviews every incident to improve its runbooks. Which pillar does this practice support MOST directly?",
      options: ["Operational excellence", "Reliability", "Cost optimization", "Performance efficiency"],
      answer: [0],
      explanation: "Operational excellence is about running and monitoring systems and continually improving processes and procedures.",
    },
    {
      id: "d1-12",
      domain: "d1",
      lesson: "d1-wellarchitected",
      prompt: "A team regularly reviews whether its workload still uses the best instance types and tries serverless options as new ones appear. Which pillar does this match?",
      options: ["Sustainability", "Security", "Performance efficiency", "Operational excellence"],
      answer: [2],
      explanation: "Performance efficiency is about using computing resources efficiently as requirements and technologies change.",
    },
    {
      id: "d1-13",
      domain: "d1",
      lesson: "d1-wellarchitected",
      prompt: "Which AWS service lets a company review its workloads against AWS architectural best practices and track improvements over time?",
      options: ["AWS Config", "AWS Well-Architected Tool", "AWS Artifact", "Amazon Inspector vulnerability scans"],
      answer: [1],
      explanation: "The AWS Well-Architected Tool guides you through questions for each pillar and records risks and improvement plans.",
    },
    {
      id: "d1-14",
      domain: "d1",
      lesson: "d1-wellarchitected",
      prompt: "Which are pillars of the AWS Well-Architected Framework? (Choose two.)",
      options: ["Cost optimization", "Sustainability", "Scalability", "Elasticity", "Compliance"],
      answer: [0, 1],
      explanation: "The six pillars are operational excellence, security, reliability, performance efficiency, cost optimization, and sustainability.",
    },
    {
      id: "d1-15",
      domain: "d1",
      lesson: "d1-wellarchitected",
      type: "match",
      prompt: "Match each design principle to its Well-Architected pillar.",
      pairs: [
        ["Stop guessing capacity", "Reliability"],
        ["Adopt a consumption model", "Cost optimization"],
        ["Implement a strong identity foundation", "Security"],
        ["Go global in minutes", "Performance efficiency"],
        ["Maximize utilization", "Sustainability"],
      ],
      explanation: "Each pillar has its own design principles. Learning a few per pillar makes the \"which pillar?\" questions quick.",
    },
    {
      id: "d1-16",
      domain: "d1",
      lesson: "d1-wellarchitected",
      prompt: "A finance team finds idle resources, deletes them, and attributes the remaining spend to each product team. Which pillar does this work support?",
      options: ["Reliability", "Cost optimization", "Security", "Operational excellence"],
      answer: [1],
      explanation: "Cost optimization includes measuring efficiency, removing waste, and analyzing and attributing expenditure.",
    },
    {
      id: "d1-17",
      domain: "d1",
      lesson: "d1-caf",
      prompt: "What is the AWS Cloud Adoption Framework (AWS CAF)?",
      options: [
        "A billing tool that forecasts monthly costs",
        "Guidance, based on AWS experience and best practices, that helps organizations plan and accelerate their cloud adoption",
        "A service that discovers your on-premises servers and migrates the virtual machines to Amazon EC2 automatically, with no planning",
        "A compliance report about AWS data centers",
      ],
      answer: [1],
      explanation: "AWS CAF groups capabilities into six perspectives so organizations can identify gaps and plan their transformation.",
    },
    {
      id: "d1-18",
      domain: "d1",
      lesson: "d1-caf",
      prompt: "A company's cloud move is stalling because staff lack skills and teams resist new ways of working. Which AWS CAF perspective addresses this?",
      options: ["Platform", "People", "Operations", "Security"],
      answer: [1],
      explanation: "The People perspective is about the humans in the change: culture, how teams are organized, leadership and skills. Skill gaps and resistance to new ways of working sit right here.",
    },
    {
      id: "d1-19",
      domain: "d1",
      lesson: "d1-caf",
      prompt: "Which AWS CAF perspective focuses on building an enterprise-grade, scalable hybrid cloud platform and modernizing workloads?",
      options: ["Business", "Governance", "Platform", "People"],
      answer: [2],
      explanation: "The Platform perspective covers the technical foundation: architecture, platform engineering, and modernizing data and applications.",
    },
    {
      id: "d1-20",
      domain: "d1",
      lesson: "d1-caf",
      prompt: "Which are business outcomes that the AWS Cloud Adoption Framework says cloud adoption can deliver? (Choose two.)",
      options: [
        "Reduced business risk",
        "Improved environmental, social, and governance (ESG) performance",
        "No need for any IT staff",
        "All AWS services free of charge",
        "Exemption from compliance requirements",
      ],
      answer: [0, 1],
      explanation: "AWS CAF lists reduced business risk, improved ESG performance, increased revenue, and increased operational efficiency.",
    },
    {
      id: "d1-21",
      domain: "d1",
      lesson: "d1-caf",
      type: "match",
      prompt: "Match each AWS CAF perspective to its focus.",
      pairs: [
        ["Business", "Cloud investments accelerate digital transformation and business outcomes"],
        ["Governance", "Orchestrate cloud initiatives while maximizing benefits and minimizing risk"],
        ["Security", "Confidentiality, integrity, and availability of data and workloads"],
        ["Operations", "Cloud services are delivered at the level the business agreed"],
      ],
      explanation: "Business, People and Governance are the business perspectives. Platform, Security and Operations are the technical ones.",
    },
    {
      id: "d1-22",
      domain: "d1",
      lesson: "d1-caf",
      prompt: "Which AWS CAF perspective is one of the TECHNICAL capability perspectives?",
      options: ["Business", "People", "Governance", "Operations"],
      answer: [3],
      explanation: "Platform, Security, and Operations are the technical perspectives. Business, People, and Governance are the business perspectives.",
    },
    {
      id: "d1-23",
      domain: "d1",
      lesson: "d1-migration",
      prompt: "A company must leave its data center quickly. It plans to move its virtual machines to Amazon EC2 without changing the applications. Which migration strategy is this?",
      options: ["Refactor", "Repurchase", "Rehost", "Retire"],
      answer: [2],
      explanation: "Rehosting, also called lift and shift, moves applications as they are. It's the fastest way out of a data center, and you can improve things once you're on AWS.",
    },
    {
      id: "d1-24",
      domain: "d1",
      lesson: "d1-migration",
      prompt: "A company moves its self-managed MySQL database to Amazon RDS for MySQL to stop patching servers, without changing the application's core architecture. Which strategy is this?",
      options: ["Replatform", "Rehost", "Retain", "Repurchase"],
      answer: [0],
      explanation: "Replatforming makes a few cloud optimizations, such as moving to a managed database, without re-architecting.",
    },
    {
      id: "d1-25",
      domain: "d1",
      lesson: "d1-migration",
      prompt: "A company replaces its self-hosted customer relationship management (CRM) system with a software as a service (SaaS) product. Which migration strategy is this?",
      options: ["Relocate", "Repurchase", "Replatform", "Rehost"],
      answer: [1],
      explanation: "Repurchasing, nicknamed drop and shop, means you stop running your own software and switch to a different product. Usually that's a SaaS product someone else runs for you.",
    },
    {
      id: "d1-26",
      domain: "d1",
      lesson: "d1-migration",
      prompt: "A team rebuilds a monolithic application as serverless microservices to scale and release features faster. Which migration strategy is this?",
      options: ["Retain", "Rehost", "Refactor", "Relocate"],
      answer: [2],
      explanation: "Refactoring means redesigning the app around cloud features such as serverless. It takes the most effort, but it gives you the most benefit in the long run.",
    },
    {
      id: "d1-27",
      domain: "d1",
      lesson: "d1-migration",
      prompt: "During a migration assessment, a company finds several applications that nobody uses any more. What should it do with them?",
      options: ["Retire them", "Rehost them", "Refactor them", "Repurchase them"],
      answer: [0],
      explanation: "If nobody uses an application, switch it off. Retiring it means less to move, less to pay for, and less that can go wrong.",
    },
    {
      id: "d1-28",
      domain: "d1",
      lesson: "d1-migration",
      prompt: "A company wants to migrate a production database to AWS while the source database stays fully operational, keeping downtime to a minimum. Which service should it use?",
      options: ["AWS Database Migration Service (AWS DMS)", "AWS Backup", "Amazon Athena", "AWS Storage Gateway with a volume gateway in cached mode"],
      answer: [0],
      explanation: "AWS DMS keeps the source live and continuously replicates changes to the target, so the cutover is short.",
    },
    {
      id: "d1-29",
      domain: "d1",
      lesson: "d1-migration",
      prompt: "A company is migrating from an Oracle database to Amazon Aurora PostgreSQL. Which tool converts the database schema to the new engine?",
      options: ["AWS Application Migration Service", "AWS Schema Conversion Tool (AWS SCT)", "AWS Migration Hub", "Amazon Inspector"],
      answer: [1],
      explanation: "AWS SCT rewrites the schema and database code so they work on the new engine. After that, AWS DMS moves the data itself.",
    },
    {
      id: "d1-30",
      domain: "d1",
      lesson: "d1-migration",
      type: "order",
      prompt: "Put the phases of a large AWS migration in order.",
      items: ["Assess", "Mobilize", "Migrate and modernize"],
      explanation: "First you assess: build the business case and check you're ready. Then you mobilize: plan and fix the gaps. Only then do you migrate and modernize the workloads.",
    },
    {
      id: "d1-31",
      domain: "d1",
      lesson: "d1-migration",
      prompt: "Before migrating, leadership asks for a data-driven business case that projects the cost of running the current servers on AWS. Which service helps build it?",
      options: ["Migration Evaluator", "AWS Budgets", "AWS DMS", "AWS Elastic Beanstalk"],
      answer: [0],
      explanation: "Migration Evaluator analyzes your current environment and projects AWS costs to build the business case.",
    },
    {
      id: "d1-32",
      domain: "d1",
      lesson: "d1-economics",
      prompt: "How does moving to the AWS Cloud change a company's IT spending?",
      options: [
        "It trades up-front fixed expenses for variable, pay-as-you-go expenses",
        "It turns operating expenses into capital expenses",
        "It requires buying servers and hardware five years in advance",
        "It adds a fixed fee for every Availability Zone",
      ],
      answer: [0],
      explanation: "Instead of buying hardware up front (capital expense), you pay for what you use as an operating expense.",
    },
    {
      id: "d1-33",
      domain: "d1",
      lesson: "d1-economics",
      prompt: "Which costs of an on-premises environment are reduced or removed by moving to AWS? (Choose two.)",
      options: [
        "Power and cooling for the data center",
        "Periodic hardware refreshes",
        "Designing your application's features",
        "Deciding which users get access to data",
        "Classifying your own data",
      ],
      answer: [0, 1],
      explanation: "AWS takes over facilities and hardware. Application design and data access decisions remain yours.",
    },
    {
      id: "d1-34",
      domain: "d1",
      lesson: "d1-economics",
      prompt: "A company already owns licenses for its commercial database software and wants to use them on AWS instead of paying for them again. Which licensing approach is this?",
      options: ["License included", "Bring your own license (BYOL)", "Spot licensing at a discount rate", "Free Tier licensing"],
      answer: [1],
      explanation: "BYOL reuses licenses you already own. License-included pricing bundles the software license into the hourly price.",
    },
    {
      id: "d1-35",
      domain: "d1",
      lesson: "d1-economics",
      prompt: "Monitoring shows that a fleet of EC2 instances averages 5% CPU utilization all month. What should the company do to reduce cost?",
      options: ["Rightsize to smaller instance types", "Add more instances", "Move the fleet to a second Region", "Buy a Dedicated Host"],
      answer: [0],
      explanation: "Rightsizing matches instance type and size to real needs. AWS Compute Optimizer can recommend a better size.",
    },
    {
      id: "d1-36",
      domain: "d1",
      lesson: "d1-economics",
      prompt: "Which are benefits of automation in the AWS Cloud? (Choose two.)",
      options: [
        "Consistent, repeatable deployments with infrastructure as code",
        "Lower cost by automatically stopping idle development resources outside work hours",
        "More manual change tickets",
        "A guarantee that nothing ever fails",
        "Longer deployment times",
      ],
      answer: [0, 1],
      explanation: "Automation means fewer human mistakes and less money spent on idle servers. It doesn't stop things from failing, so you still need to design for failure.",
    },
    {
      id: "d1-37",
      domain: "d1",
      lesson: "d1-economics",
      type: "order",
      prompt: "Put these rightsizing steps in a sensible order.",
      items: [
        "Measure CPU, memory, and network use over time",
        "Find resources that are consistently under-used",
        "Choose a smaller or better-fitting instance type",
        "Change the instance and confirm performance",
      ],
      explanation: "Start with real usage data, find the waste, then make the change and check performance is still fine. It's not a one-off: repeat it regularly.",
    },
    {
      id: "d1-38",
      domain: "d1",
      lesson: "d1-economics",
      prompt: "Which aspects of cloud economics lower total cost of ownership compared with on premises? (Choose two.)",
      options: [
        "Paying only for the resources you use",
        "No up-front hardware investment",
        "Paying for peak capacity at all times",
        "Mandatory five-year contracts",
        "Hiring staff to rack and cable servers",
      ],
      answer: [0, 1],
      explanation: "Paying only for what you use, with no big hardware purchase, lowers your total cost. Paying for peak capacity, long contracts and staff to rack servers are costs of running your own data center.",
    },
  ],

  cards: [
    { id: "c1-elastic", domain: "d1", kind: "concept", term: "Elasticity", definition: "Adding and removing capacity automatically so it follows demand, like extra checkouts opening when the store gets busy." },
    { id: "c1-ha", domain: "d1", kind: "concept", term: "High availability", definition: "Staying up when a part fails. You get it by running in more than one Availability Zone." },
    { id: "c1-agility", domain: "d1", kind: "concept", term: "Agility", definition: "Being able to try ideas quickly and cheaply, because new resources take minutes instead of weeks." },
    { id: "c1-scale", domain: "d1", kind: "concept", term: "Economies of scale", definition: "AWS runs hardware for so many customers that it costs less per customer, so prices drop." },
    { id: "c1-pillars", domain: "d1", kind: "concept", term: "Well-Architected pillars", definition: "The six areas AWS checks a design against: operational excellence, security, reliability, performance efficiency, cost optimization and sustainability." },
    { id: "c1-caf", domain: "d1", kind: "concept", term: "AWS CAF perspectives", definition: "Business, People and Governance are the business side. Platform, Security and Operations are the technical side." },
    { id: "c1-rehost", domain: "d1", kind: "concept", term: "Rehost", definition: "Lift and shift: move the app to AWS exactly as it is." },
    { id: "c1-replatform", domain: "d1", kind: "concept", term: "Replatform", definition: "Make a few small improvements on the way, such as moving to a managed database." },
    { id: "c1-refactor", domain: "d1", kind: "concept", term: "Refactor", definition: "Redesign the app to use cloud features such as serverless. The most work, and the most long-term benefit." },
    { id: "c1-repurchase", domain: "d1", kind: "concept", term: "Repurchase", definition: "Drop your own software and switch to a different product, often SaaS." },
    { id: "c1-capex", domain: "d1", kind: "concept", term: "CapEx and OpEx", definition: "CapEx is a big fixed payment up front, like buying servers. OpEx is spending that follows use, like the cloud's pay-as-you-go bill." },
    { id: "c1-byol", domain: "d1", kind: "concept", term: "BYOL", definition: "Bring your own license: reuse software licenses you already own on AWS instead of paying for them again." },
    { id: "c1-rightsize", domain: "d1", kind: "concept", term: "Rightsizing", definition: "Choosing a server type and size that fits what you really use, so you don't pay for spare capacity." },
    { id: "s-watool", domain: "d1", kind: "service", term: "AWS Well-Architected Tool", definition: "A free tool that asks questions about your workload and flags risks against the six pillars." },
    { id: "s-dms", domain: "d1", kind: "service", term: "AWS DMS", definition: "Moves a database to AWS while the old one keeps running, so downtime is very short." },
    { id: "s-sct", domain: "d1", kind: "service", term: "AWS Schema Conversion Tool", definition: "Rewrites a database's layout and code so it works on a different engine, such as Oracle to PostgreSQL." },
    { id: "s-mgn", domain: "d1", kind: "service", term: "AWS Application Migration Service", definition: "Copies your servers onto AWS as they are. This is the rehost, or lift and shift, tool." },
    { id: "s-ads", domain: "d1", kind: "service", term: "AWS Application Discovery Service", definition: "Gathers facts about the servers you run today, so you can plan the move." },
    { id: "s-migev", domain: "d1", kind: "service", term: "Migration Evaluator", definition: "Builds a business case for moving to AWS, based on data from the servers you run today." },
    { id: "s-mighub", domain: "d1", kind: "service", term: "AWS Migration Hub", definition: "One place to watch how the whole migration is going." },
    { id: "s-computeopt", domain: "d1", kind: "service", term: "AWS Compute Optimizer", definition: "Looks at how you really use your servers and suggests better sizes." },
  ],

  challenges: [
    {
      id: "ch-elastic",
      domain: "d1",
      lesson: "d1-benefits",
      title: "Follow the demand",
      goal: "Switch to Auto Scaling and set the minimum and maximum so there are zero idle and zero missing server-hours.",
      hint: "Demand dips to 2 servers overnight and peaks at 8 at noon.",
      takeaway: "With elasticity you have no idle servers and no shortage. Capacity follows demand, so you never have to buy for the busiest moment.",
      render: (onSolved) => <ElasticityLab goal="elastic" onSolved={onSolved} />,
    },
  ],
});
