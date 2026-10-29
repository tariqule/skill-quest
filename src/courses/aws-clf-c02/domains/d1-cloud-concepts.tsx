import { Flow, Layers, Tiles } from "@/components/learn/blocks";
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
    summary: "Why the cloud: its benefits, the Well-Architected Framework, the Cloud Adoption Framework, migration strategies, and cloud economics.",
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
      id: "d1-benefits",
      check: ["d1-01", "d1-02"],
      task: "1.1",
      title: "Why the cloud: elasticity, agility, global reach",
      visual: (
        <div className="grid gap-6">
          <ElasticityLab />
          <Tiles
            cols={3}
            tiles={[
              { icon: "💸", title: "Variable expense", text: "Pay for what you use instead of buying servers up front.", color: "#38bdf8" },
              { icon: "🏭", title: "Economies of scale", text: "AWS's huge aggregate usage means lower pay-as-you-go prices.", color: "#38bdf8" },
              { icon: "🔮", title: "Stop guessing capacity", text: "Scale up or down in minutes instead of planning years ahead.", color: "#38bdf8" },
              { icon: "🏎️", title: "Speed and agility", text: "New resources in minutes, so experiments are cheap and fast.", color: "#38bdf8" },
              { icon: "🏗️", title: "No data centers to run", text: "Spend on your customers, not on racking and powering servers.", color: "#38bdf8" },
              { icon: "🌍", title: "Go global in minutes", text: "Deploy in Regions around the world with a few clicks.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Elasticity: acquire resources when you need them and release them when you don't, automatically.",
        "High availability: keep running when parts fail, by spreading across multiple Availability Zones.",
        "Agility: the time and cost to try something new drops from weeks to minutes.",
        "Global infrastructure means speed of deployment and global reach, with low latency for users worldwide.",
      ],
      tip: "\"Traffic varies a lot\" or \"seasonal peaks\" → elasticity (Auto Scaling). \"Try ideas quickly and cheaply\" → agility.",
    },
    {
      id: "d1-wellarchitected",
      check: ["d1-08", "d1-09"],
      task: "1.2",
      title: "The six Well-Architected pillars",
      visual: <PillarWheel />,
      points: [
        "Six pillars: operational excellence, security, reliability, performance efficiency, cost optimization, and sustainability.",
        "Reliability is about recovering from failure and meeting demand; performance efficiency is about using the right resources efficiently.",
        "Cost optimization avoids unneeded cost; sustainability reduces environmental impact (for example, by maximizing utilization).",
        "The AWS Well-Architected Tool reviews your workloads against the framework's best practices, at no extra charge.",
      ],
      tip: "Watch for the keyword: \"recover\" → reliability, \"right resource type and size\" → performance efficiency, \"environmental impact\" → sustainability.",
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
              { icon: "🛡️", title: "Reduced business risk", text: "Better reliability, performance, and security.", color: "#34d399" },
              { icon: "🌱", title: "Improved ESG", text: "Environmental, social, and governance performance.", color: "#34d399" },
              { icon: "📈", title: "Increased revenue", text: "New products and customers, faster.", color: "#34d399" },
              { icon: "⚙️", title: "Operational efficiency", text: "Lower costs, higher productivity.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "AWS CAF organizes AWS's experience and best practices into six perspectives to help you plan and speed up cloud adoption.",
        "Business, People, and Governance are business capabilities. Platform, Security, and Operations are technical capabilities.",
        "People covers culture, organizational change, and skills. Governance covers orchestrating initiatives, managing risk, and cloud finances.",
      ],
      tip: "\"Training staff and changing culture\" → People perspective. \"Hybrid cloud platform and architecture\" → Platform perspective.",
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
              { icon: "🚚", title: "Rehost", text: "Lift and shift to EC2 with no changes.", color: "#f59e0b" },
              { icon: "🏷️", title: "Relocate", text: "Move a whole platform, such as VMware, without new hardware or app changes.", color: "#f59e0b" },
              { icon: "🔧", title: "Replatform", text: "Lift, tinker, and shift: for example, a database moves to Amazon RDS.", color: "#f59e0b" },
              { icon: "🛒", title: "Repurchase", text: "Drop and shop: switch to a SaaS product.", color: "#f59e0b" },
              { icon: "🧬", title: "Refactor", text: "Re-architect with cloud-native features, such as serverless.", color: "#f59e0b" },
              { icon: "🗑️", title: "Retire", text: "Switch off what nobody needs.", color: "#f59e0b" },
              { icon: "⏸️", title: "Retain", text: "Keep it where it is, for now.", color: "#f59e0b" },
            ]}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "🔍", label: "Assess", sub: "Business case and readiness (Migration Evaluator, Application Discovery Service)" },
              { icon: "🧭", label: "Mobilize", sub: "Plan, close gaps, build the landing zone" },
              { icon: "🚀", label: "Migrate and modernize", sub: "Application Migration Service, AWS DMS, tracked in Migration Hub" },
            ]}
          />
        </div>
      ),
      points: [
        "AWS DMS migrates databases with minimal downtime: the source stays live while changes replicate to the target.",
        "AWS Schema Conversion Tool (AWS SCT) converts a schema between database engines, for example Oracle to Amazon Aurora PostgreSQL.",
        "Application Discovery Service collects data about on-premises servers. Migration Evaluator builds a data-driven business case.",
        "AWS Application Migration Service rehosts servers on AWS. AWS Migration Hub tracks progress in one place.",
      ],
      tip: "\"No code changes\" → rehost. \"Move to a managed service but keep the app\" → replatform. \"Rebuild as microservices\" → refactor.",
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
                <li>• Servers and storage bought for peak, years ahead</li>
                <li>• Data center space, power, and cooling</li>
                <li>• Staff to rack, patch, and replace hardware</li>
                <li>• Hardware refreshes every few years</li>
              </ul>
            </div>
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3">
              <div className="font-bold text-emerald-200">☁️ AWS: variable costs (OpEx)</div>
              <ul className="mt-2 grid gap-1 text-sm text-slate-300">
                <li>• Pay as you go, per second, hour, GB, or request</li>
                <li>• Scale down and stop paying</li>
                <li>• Benefit from AWS economies of scale</li>
                <li>• Automate to cut manual work and errors</li>
              </ul>
            </div>
          </div>
          <Tiles
            cols={3}
            tiles={[
              { icon: "📏", title: "Rightsizing", text: "Match instance type and size to real usage. AWS Compute Optimizer recommends sizes.", color: "#34d399" },
              { icon: "🪪", title: "BYOL vs license included", text: "Bring licenses you already own, or pay for the license in the hourly price.", color: "#34d399" },
              { icon: "🤖", title: "Automation", text: "IaC and schedules: repeatable deployments, idle resources stopped automatically.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "The cloud swaps fixed, up-front capital expense for variable, pay-as-you-go operating expense.",
        "Total cost of ownership on premises includes hardware, facilities, power, cooling, and the people who run them.",
        "BYOL can lower cost when you already own licenses; license-included pricing bundles the license into the price.",
        "Rightsizing is a continuous process: measure, then resize under-used resources.",
      ],
      tip: "\"Already owns licenses\" → BYOL (Dedicated Hosts for per-core or per-socket licenses). \"CPU always at 5%\" → rightsize.",
    },
  ],

  questions: [
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
        "Every resource is reserved for three years",
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
        "Customers get a dedicated data center",
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
      explanation: "Reliability covers recovering from failure, testing recovery, scaling horizontally, and not guessing capacity.",
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
      explanation: "The security pillar covers identity, traceability, security at every layer, and data protection.",
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
      options: ["AWS Config", "AWS Well-Architected Tool", "AWS Artifact", "Amazon Inspector"],
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
        "A service that migrates virtual machines automatically",
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
      explanation: "The People perspective covers culture, organizational structure, leadership, and workforce skills for the transformation.",
    },
    {
      id: "d1-19",
      domain: "d1",
      lesson: "d1-caf",
      prompt: "Which AWS CAF perspective focuses on building an enterprise-grade, scalable hybrid cloud platform and modernizing workloads?",
      options: ["Business", "Governance", "Platform", "People"],
      answer: [2],
      explanation: "The Platform perspective covers architecture, platform engineering, data and application modernization.",
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
      explanation: "Business, People, and Governance are business capabilities; Platform, Security, and Operations are technical ones.",
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
      explanation: "Rehosting (lift and shift) moves applications as they are. It's the fastest route and can be optimized later.",
    },
    {
      id: "d1-24",
      domain: "d1",
      lesson: "d1-migration",
      prompt: "A company moves its self-managed MySQL database to Amazon RDS for MySQL to stop patching servers, without changing the application's core architecture. Which strategy is this?",
      options: ["Replatform", "Rehost", "Retain", "Refactor"],
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
      explanation: "Repurchasing (drop and shop) moves to a different product, usually SaaS.",
    },
    {
      id: "d1-26",
      domain: "d1",
      lesson: "d1-migration",
      prompt: "A team rebuilds a monolithic application as serverless microservices to scale and release features faster. Which migration strategy is this?",
      options: ["Retain", "Rehost", "Refactor", "Relocate"],
      answer: [2],
      explanation: "Refactoring (re-architecting) uses cloud-native features. It takes the most effort and offers the most long-term benefit.",
    },
    {
      id: "d1-27",
      domain: "d1",
      lesson: "d1-migration",
      prompt: "During a migration assessment, a company finds several applications that nobody uses any more. What should it do with them?",
      options: ["Retire them", "Rehost them", "Refactor them", "Repurchase them"],
      answer: [0],
      explanation: "Retiring unused applications reduces the scope, cost, and risk of the migration.",
    },
    {
      id: "d1-28",
      domain: "d1",
      lesson: "d1-migration",
      prompt: "A company wants to migrate a production database to AWS while the source database stays fully operational, keeping downtime to a minimum. Which service should it use?",
      options: ["AWS Database Migration Service (AWS DMS)", "AWS Backup", "Amazon Athena", "AWS Storage Gateway"],
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
      explanation: "AWS SCT converts schemas and code between engines. AWS DMS then moves the data.",
    },
    {
      id: "d1-30",
      domain: "d1",
      lesson: "d1-migration",
      type: "order",
      prompt: "Put the phases of a large AWS migration in order.",
      items: ["Assess", "Mobilize", "Migrate and modernize"],
      explanation: "Assess builds the business case and readiness, Mobilize closes gaps and plans, then workloads are migrated and modernized.",
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
        "It requires buying hardware five years in advance",
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
      options: ["License included", "Bring your own license (BYOL)", "Spot licensing", "Free Tier licensing"],
      answer: [1],
      explanation: "BYOL reuses licenses you already own. License-included pricing bundles the software license into the hourly price.",
    },
    {
      id: "d1-35",
      domain: "d1",
      lesson: "d1-economics",
      prompt: "Monitoring shows that a fleet of EC2 instances averages 5% CPU utilization all month. What should the company do to reduce cost?",
      options: ["Rightsize to smaller instance types", "Add more instances", "Move to a second Region", "Buy a Dedicated Host"],
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
      explanation: "Automation reduces human error and wasted spend. It doesn't remove the need to design for failure.",
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
      explanation: "Rightsizing starts with data, then targets waste, then changes and verifies. Repeat it regularly.",
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
      explanation: "Pay-as-you-go and no capital investment lower TCO. Paying for peak, long contracts, and racking servers are on-premises costs.",
    },
  ],

  cards: [
    { id: "c1-elastic", domain: "d1", kind: "concept", term: "Elasticity", definition: "Automatically add and remove capacity to match demand" },
    { id: "c1-ha", domain: "d1", kind: "concept", term: "High availability", definition: "Keep running when components fail, using multiple AZs" },
    { id: "c1-agility", domain: "d1", kind: "concept", term: "Agility", definition: "Experiment quickly and cheaply; resources in minutes" },
    { id: "c1-scale", domain: "d1", kind: "concept", term: "Economies of scale", definition: "AWS's huge usage lowers pay-as-you-go prices" },
    { id: "c1-pillars", domain: "d1", kind: "concept", term: "Well-Architected pillars", definition: "Ops excellence, security, reliability, performance efficiency, cost optimization, sustainability" },
    { id: "c1-caf", domain: "d1", kind: "concept", term: "AWS CAF perspectives", definition: "Business, People, Governance · Platform, Security, Operations" },
    { id: "c1-rehost", domain: "d1", kind: "concept", term: "Rehost", definition: "Lift and shift with no changes" },
    { id: "c1-replatform", domain: "d1", kind: "concept", term: "Replatform", definition: "Small optimizations, such as moving to a managed database" },
    { id: "c1-refactor", domain: "d1", kind: "concept", term: "Refactor", definition: "Re-architect with cloud-native features" },
    { id: "c1-repurchase", domain: "d1", kind: "concept", term: "Repurchase", definition: "Move to a different product, often SaaS" },
    { id: "c1-capex", domain: "d1", kind: "concept", term: "CapEx vs OpEx", definition: "Up-front fixed spend vs pay-as-you-go variable spend" },
    { id: "c1-byol", domain: "d1", kind: "concept", term: "BYOL", definition: "Use software licenses you already own on AWS" },
    { id: "c1-rightsize", domain: "d1", kind: "concept", term: "Rightsizing", definition: "Match instance type and size to actual usage" },
    { id: "s-watool", domain: "d1", kind: "service", term: "AWS Well-Architected Tool", definition: "Review workloads against the six pillars" },
    { id: "s-dms", domain: "d1", kind: "service", term: "AWS DMS", definition: "Migrate databases with minimal downtime" },
    { id: "s-sct", domain: "d1", kind: "service", term: "AWS Schema Conversion Tool", definition: "Convert database schemas between engines" },
    { id: "s-mgn", domain: "d1", kind: "service", term: "AWS Application Migration Service", definition: "Rehost (lift and shift) servers onto AWS" },
    { id: "s-ads", domain: "d1", kind: "service", term: "AWS Application Discovery Service", definition: "Collect data about on-premises servers to plan a migration" },
    { id: "s-migev", domain: "d1", kind: "service", term: "Migration Evaluator", definition: "Build a data-driven business case for migrating" },
    { id: "s-mighub", domain: "d1", kind: "service", term: "AWS Migration Hub", definition: "Track migration progress in one place" },
    { id: "s-computeopt", domain: "d1", kind: "service", term: "AWS Compute Optimizer", definition: "Rightsizing recommendations from usage data" },
  ],

  challenges: [
    {
      id: "ch-elastic",
      domain: "d1",
      lesson: "d1-benefits",
      title: "Follow the demand",
      goal: "Switch to Auto Scaling and set the minimum and maximum so there are zero idle and zero missing server-hours.",
      hint: "Demand dips to 2 servers overnight and peaks at 8 at noon.",
      takeaway: "Elasticity removes both waste and shortfall: capacity follows demand instead of being bought for the peak.",
      render: (onSolved) => <ElasticityLab goal="elastic" onSolved={onSolved} />,
    },
  ],
});
