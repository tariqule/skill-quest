import { Flow, Ladder, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { PricingPickerLab, SupportPlanLab } from "../labs";

/**
 * Domain 4: Billing, Pricing, and Support (12% of scored content).
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d4",
    number: 4,
    name: "Billing, Pricing, and Support",
    world: "The Coin Exchange",
    weight: 12,
    emoji: "💰",
    color: "#f59e0b",
    summary: "How AWS charges you, the ways to pay less, the tools that track spending, how to manage many accounts, and where to get help when you're stuck.",
  },

  tasks: [
    {
      id: "4.1",
      title: "Compare AWS pricing models",
      covers: [
        "Compute purchasing options: On-Demand, Reserved Instances, Spot, Savings Plans, Dedicated Hosts, Dedicated Instances, Capacity Reservations",
        "Reserved Instance flexibility, and Reserved Instance behavior in AWS Organizations",
        "Incoming and outgoing data transfer costs (between Regions, within a Region)",
        "Pricing for storage options and tiers",
      ],
    },
    {
      id: "4.2",
      title: "Understand resources for billing, budget, and cost management",
      covers: [
        "Uses and capabilities of AWS Budgets, AWS Cost Explorer, and AWS Pricing Calculator",
        "AWS Organizations consolidated billing and allocation of costs",
        "Cost allocation tags and how they relate to billing reports (for example, AWS Cost and Usage Report)",
      ],
    },
    {
      id: "4.3",
      title: "Identify AWS technical resources and AWS Support options",
      covers: [
        "Whitepapers, blogs, and documentation; AWS Prescriptive Guidance, AWS Knowledge Center, AWS re:Post",
        "Support options: customer service and communities, Basic Support, Business Support+, Enterprise Support, Unified Operations",
        "Trusted Advisor, the AWS Health Dashboard, and the AWS Health API; the AWS Trust and Safety team",
        "AWS Partners, AWS Marketplace, AWS Professional Services, and AWS solutions architects",
      ],
    },
  ],

  lessons: [
    {
      id: "d4-start-how-billing-works",
      level: "beginner",
      check: ["clf-b4-01", "clf-b4-02"],
      task: "4.1",
      title: "How an AWS bill works",
      visual: (
        <Flow
          color="#34d399"
          steps={[
            { icon: "🖥️", label: "You use something", sub: "A server runs, a file is stored" },
            { icon: "⏱️", label: "AWS measures it", sub: "Hours, gigabytes, requests" },
            { icon: "🧾", label: "You get a monthly bill", sub: "For exactly what you used" },
          ]}
        />
      ),
      points: [
        "An AWS bill works like an electricity bill. A meter measures what you use, and at the end of the month you pay for that amount.",
        "Each service has its own meter. A server is usually charged by the second or hour, and storage by the gigabyte per month.",
        "Turning things off matters. A server you forgot about keeps running, and keeps costing money, until you stop it.",
        "The **AWS Free Tier** lets new customers try many services at no cost, within set limits.",
      ],
      tip: "If you're only experimenting, delete what you created when you're done. That's the simplest way to keep a bill small.",
    },
    {
      id: "d4-start-watching-spend",
      level: "beginner",
      check: ["clf-b4-03", "clf-b4-04"],
      task: "4.2",
      title: "Keeping an eye on spending",
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "🧮", title: "Before: estimate", text: "AWS Pricing Calculator tells you roughly what a plan will cost.", color: "#38bdf8" },
            { icon: "🚨", title: "During: get alerts", text: "AWS Budgets warns you when spending passes a limit you set.", color: "#38bdf8" },
            { icon: "📊", title: "After: look back", text: "AWS Cost Explorer shows where the money went.", color: "#38bdf8" },
          ]}
        />
      ),
      points: [
        "Think of a phone plan that texts you when you've used most of your data. AWS has the same kind of warning for money.",
        "**AWS Budgets** lets you set a spending limit and sends you an alert when you get close to it or go over.",
        "**AWS Pricing Calculator** estimates the cost of something before you build it, so there are fewer surprises.",
        "**AWS Cost Explorer** shows charts of what you've spent, so you can see which service costs the most.",
      ],
      tip: "Estimate first with the Pricing Calculator, set a budget alert, then check Cost Explorer now and then.",
    },
    {
      id: "d4-start-getting-help",
      level: "beginner",
      check: ["clf-b4-05", "clf-b4-06"],
      task: "4.3",
      title: "Where to turn when you're stuck",
      visual: (
        <Ladder
          rungs={[
            { icon: "🧑‍🔧", name: "Paid Support plans", text: "Talk to AWS engineers, with faster answers the higher the plan." },
            { icon: "💬", name: "AWS re:Post", text: "Ask the community. Experts and AWS staff answer questions." },
            { icon: "📚", name: "Docs and Basic Support", text: "Free for everyone: guides, how-tos and help with your account and bill." },
          ]}
        />
      ),
      points: [
        "Everyone gets **Basic Support** for free. It covers help with your account and bill, plus documentation and guides.",
        "**AWS re:Post** is a public question-and-answer site, a bit like a forum, where experts and AWS staff answer questions.",
        "If you need to talk to AWS engineers about technical problems, you pay for a **Support plan**. Higher plans answer faster and give you more help.",
      ],
      tip: "Start with the free options. Pay for a Support plan when downtime would really hurt the business.",
    },
    {
      id: "d4-purchase",
      check: ["d4-01", "d4-03"],
      task: "4.1",
      title: "EC2 purchasing options",
      visual: (
        <div className="grid gap-6">
          <PricingPickerLab />
          <Tiles
            cols={3}
            tiles={[
              { icon: "📍", title: "Regional RI", text: "The discount works in any AZ of the Region, and across instance sizes. It doesn't reserve capacity.", color: "#f59e0b" },
              { icon: "🎯", title: "Zonal RI", text: "A discount plus reserved capacity in one specific AZ.", color: "#f59e0b" },
              { icon: "🔁", title: "Standard or Convertible", text: "Convertible RIs can be swapped for different attributes. Standard RIs give a bigger discount.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "With **Reserved Instances** (RIs) and **Savings Plans**, you promise to use AWS for 1 or 3 years in return for a discount. You can pay all, part or none up front. Longer terms and more up front mean bigger discounts.",
        "A Savings Plan is a promise to spend a set amount per hour. **Compute Savings Plans** cover any instance family, any Region, Fargate and Lambda. **EC2 Instance Savings Plans** lock you to one family in one Region.",
        "In AWS Organizations, RI and Savings Plans discounts are shared across all accounts by default. The management account can turn that sharing off.",
        "**Dedicated Instances** run on hardware used only by you. A **Dedicated Host** is a whole physical server where you can see its sockets and cores. **On-Demand Capacity Reservations** hold capacity in an AZ with no long-term commitment.",
      ],
      tip: "If the work can be interrupted, use Spot. Steady use that needs flexibility suits Savings Plans. Short or unpredictable work suits On-Demand. Licenses counted per core point to Dedicated Hosts.",
    },
    {
      id: "d4-transfer",
      check: ["d4-07", "d4-09"],
      task: "4.1",
      title: "Data transfer and storage pricing",
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#34d399"
            steps={[
              { icon: "🌐", label: "Internet into AWS", sub: "Coming in is generally free" },
              { icon: "🏢", label: "Within one AZ", sub: "Traffic on private IPs is generally free" },
              { icon: "🔀", label: "Between AZs or Regions", sub: "Charged per GB" },
              { icon: "📤", label: "AWS out to the internet", sub: "Going out is charged per GB" },
            ]}
          />
          <Ladder
            rungs={[
              { icon: "🧊", name: "Archive classes", text: "Cheapest per GB, but you pay to get data back and you wait longer." },
              { icon: "🌗", name: "Infrequent access classes", text: "Cheaper to store, with a fee for each GB you read." },
              { icon: "🪣", name: "S3 Standard", text: "Costs more to store, but there's no fee to read." },
            ]}
          />
        </div>
      ),
      points: [
        "An S3 bill has four main parts: how much you store each month, how many requests you make, data sent out, and, for some classes, a fee to get data back.",
        "EBS charges for the size you ask for, whether you fill it or not. Some volume types also charge for the performance you reserve.",
        "Moving data from S3 to EC2 in the same Region is free. Sending that data out to the internet is not.",
      ],
      tip: "If a question asks which transfer is free, the answer is data coming in from the internet.",
    },
    {
      id: "d4-tools",
      check: ["d4-10", "d4-11"],
      task: "4.2",
      title: "Cost tools: plan, track, alert, analyze",
      visual: (
        <Tiles
          cols={4}
          tiles={[
            { icon: "🧮", title: "AWS Pricing Calculator", text: "Estimates what a design will cost BEFORE you build it.", color: "#38bdf8" },
            { icon: "🚨", title: "AWS Budgets", text: "Set a cost or usage limit and get an alert on real or forecast spend.", color: "#38bdf8" },
            { icon: "📊", title: "AWS Cost Explorer", text: "Charts of past costs that you can filter by service or tag, plus a forecast.", color: "#38bdf8" },
            { icon: "🧾", title: "AWS Cost and Usage Report", text: "The most detailed billing data, line by line, delivered to S3.", color: "#38bdf8" },
          ]}
        />
      ),
      points: [
        "AWS Budgets can also check how well you're using your Reserved Instances and Savings Plans, and can take an action when a limit is crossed.",
        "Cost Explorer shows how spending changes over time, and can suggest which Reserved Instances or Savings Plans to buy.",
        "You see your bills, payments and invoices in the **Billing and Cost Management** console.",
      ],
      tip: "Before you build, use the Pricing Calculator. To get alerts, use Budgets. To see what you spent and why, use Cost Explorer. For every line item, use the Cost and Usage Report.",
    },
    {
      id: "d4-orgs",
      check: ["d4-14", "d4-15"],
      task: "4.2",
      title: "AWS Organizations and cost allocation tags",
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "🏛️", label: "Management account", sub: "Pays one combined bill" },
              { icon: "🗂️", label: "Organizational units", sub: "Groups of accounts, with service control policies applied" },
              { icon: "👥", label: "Member accounts", sub: "Their usage is added together for volume pricing" },
            ]}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🏷️", title: "User-defined tags", text: "Labels you make up, such as Project or CostCenter. Turn them on for billing.", color: "#34d399" },
              { icon: "🤖", title: "AWS-generated tags", text: "Labels AWS adds, such as aws:createdBy. You turn these on in the billing console too.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "With **consolidated billing**, all your accounts share one bill. Their usage is added together, so you reach the cheaper volume price tiers sooner.",
        "**Service control policies** (SCPs) set the most that any account in the organization is allowed to do.",
        "A **tag** is a label, like Project=Website, that you put on resources. **Cost allocation tags** show up in Cost Explorer and the Cost and Usage Report only after you activate them.",
        "**AWS Control Tower** sets up and looks after a multi-account environment that follows best practices.",
      ],
      tip: "If tagged resources don't appear in cost reports, the fix is to activate them as cost allocation tags.",
    },
    {
      id: "d4-support",
      check: ["d4-17", "d4-18"],
      task: "4.3",
      title: "AWS Support plans",
      visual: <SupportPlanLab />,
      points: [
        "**Basic Support** comes free with every account. You get help with your account and bill, documentation, whitepapers, re:Post, the core Trusted Advisor checks and AWS Health.",
        "**Business Support+** gives you engineers by phone, web and chat around the clock, plus AI-powered help. Business-critical outages get a reply in under 30 minutes, and you get every Trusted Advisor check.",
        "**Enterprise Support** adds a **Technical Account Manager** (TAM), a named AWS expert who knows your setup, and replies within 15 minutes for critical cases.",
        "**Unified Operations** gives you a named team of TAMs and specialist engineers. Incident engineers respond within about 5 minutes.",
        "The older Developer Support, classic Business Support and Enterprise On-Ramp plans end on January 1, 2027.",
      ],
      tip: "The cheapest plan with 24/7 phone and chat is Business Support+. If you need a named TAM, it's Enterprise Support or higher.",
    },
    {
      id: "d4-help",
      check: ["d4-21", "d4-26"],
      task: "4.3",
      title: "Where to get help",
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "💬", title: "AWS re:Post", text: "A community question-and-answer site, with answers from experts and AWS.", color: "#34d399" },
            { icon: "📚", title: "AWS Knowledge Center", text: "Answers to the questions people ask most.", color: "#34d399" },
            { icon: "🗺️", title: "AWS Prescriptive Guidance", text: "Plans, guides and patterns for migrating and modernizing.", color: "#34d399" },
            { icon: "🩺", title: "AWS Health Dashboard", text: "Events that affect your resources, such as planned maintenance. The AWS Health API lets you automate around them.", color: "#34d399" },
            { icon: "💡", title: "AWS Trusted Advisor", text: "Tips to cut cost and improve security, fault tolerance, performance and quotas.", color: "#34d399" },
            { icon: "🚩", title: "AWS Trust and Safety", text: "Where you report AWS resources used for abuse, such as spam or phishing.", color: "#34d399" },
            { icon: "🤝", title: "AWS Partners", text: "Consulting firms and software sellers (ISVs), with partner training, events and volume discounts.", color: "#a78bfa" },
            { icon: "🛍️", title: "AWS Marketplace", text: "Software and services from other companies, with tools to manage cost, rules and licenses.", color: "#a78bfa" },
            { icon: "🧑‍🏫", title: "Professional Services and SAs", text: "AWS experts who help you design and deliver projects.", color: "#a78bfa" },
          ]}
        />
      ),
      points: [
        "Whitepapers, documentation and blogs live on AWS's official websites. You open and follow support cases in the **AWS Support Center**.",
        "**System integrators** are consulting firms that run projects such as migrations. **Independent software vendors** (ISVs) sell software, often through AWS Marketplace.",
      ],
      tip: "For idle resources and ways to save money, think Trusted Advisor. For maintenance planned on your instances, think AWS Health Dashboard.",
    },
  ],

  questions: [
    // ── Start here ──
    {
      id: "clf-b4-01",
      domain: "d4",
      lesson: "d4-start-how-billing-works",
      level: "beginner",
      prompt: "How is an AWS bill most like an electricity bill?",
      options: ["You pay for the amount you actually used", "You pay the same fixed amount every month no matter what", "You pay only once, when you sign up", "You pay only when something breaks"],
      answer: [0],
      explanation: "AWS measures what you use, such as server hours and gigabytes stored, and bills you for that. Use more and the bill goes up. Use less and it goes down.",
    },
    {
      id: "clf-b4-02",
      domain: "d4",
      lesson: "d4-start-how-billing-works",
      level: "beginner",
      prompt: "A student starts a server to practice, then forgets about it for a month. What happens?",
      options: ["The server keeps running and keeps costing money", "AWS stops it automatically after an hour", "It's free because nobody visited it", "AWS deletes the account"],
      answer: [0],
      explanation: "A running server is charged whether anyone uses it or not. That's why it pays to stop or delete things when you're finished with them.",
    },
    {
      id: "clf-b4-03",
      domain: "d4",
      lesson: "d4-start-watching-spend",
      level: "beginner",
      prompt: "Which AWS tool sends you an alert when your spending gets close to a limit you set?",
      options: ["AWS Budgets", "Amazon S3", "AWS IAM", "Amazon EC2"],
      answer: [0],
      explanation: "AWS Budgets lets you set a spending limit and warns you as you approach it or go over. It works like the data-usage text from a phone company.",
    },
    {
      id: "clf-b4-04",
      domain: "d4",
      lesson: "d4-start-watching-spend",
      level: "beginner",
      prompt: "Before building anything, a team wants a rough idea of what its plan will cost each month. Which tool should it use?",
      options: ["AWS Pricing Calculator", "AWS CloudTrail", "AWS Shield", "AWS Budgets reports"],
      answer: [0],
      explanation: "The Pricing Calculator estimates costs for things you haven't built yet. You describe what you plan to use, and it gives you a monthly figure.",
    },
    {
      id: "clf-b4-05",
      domain: "d4",
      lesson: "d4-start-getting-help",
      level: "beginner",
      prompt: "Which AWS Support plan does every account get at no extra cost?",
      options: ["Basic Support", "Enterprise Support", "Unified Operations", "Business Support+"],
      answer: [0],
      explanation: "Basic Support comes with every account for free. It covers account and billing help plus documentation. The other plans cost money and add access to engineers.",
    },
    {
      id: "clf-b4-06",
      domain: "d4",
      lesson: "d4-start-getting-help",
      level: "beginner",
      prompt: "Where can you ask a question and get answers from the AWS community and experts?",
      options: ["AWS re:Post", "AWS Budgets", "Amazon EC2", "AWS KMS"],
      answer: [0],
      explanation: "AWS re:Post is a public question-and-answer site. Anyone can ask, and experts and AWS staff post answers.",
    },
    // ── Purchasing options ──
    {
      id: "d4-01",
      domain: "d4",
      lesson: "d4-purchase",
      prompt: "A company processes large image batches that can be interrupted and resumed at any time. It wants the LOWEST compute cost. Which purchasing option should it choose?",
      options: ["On-Demand Instances", "Spot Instances", "Dedicated Hosts", "Reserved Instances"],
      answer: [1],
      explanation: "Spot Instances use spare EC2 capacity at up to 90% off On-Demand prices. They can be interrupted, which fault-tolerant jobs can tolerate.",
    },
    {
      id: "d4-02",
      domain: "d4",
      lesson: "d4-purchase",
      prompt: "A company expects steady compute usage for three years, but plans to move workloads between EC2 instance families, AWS Fargate, and AWS Lambda. Which option gives a discount with this flexibility?",
      options: ["Compute Savings Plans", "Zonal Reserved Instances", "Spot Instances", "Dedicated Instances"],
      answer: [0],
      explanation: "Compute Savings Plans commit to a dollar amount per hour and apply automatically across instance families, Regions, Fargate, and Lambda.",
    },
    {
      id: "d4-03",
      domain: "d4",
      lesson: "d4-purchase",
      prompt: "What does a Regional Reserved Instance provide?",
      options: [
        "A discount that applies to matching usage in any Availability Zone in the Region, without a capacity reservation",
        "A capacity reservation in every Availability Zone of the Region at no extra cost, along with a larger hourly discount",
        "Free data transfer between Regions",
        "A dedicated physical server",
      ],
      answer: [0],
      explanation: "Regional RIs offer AZ flexibility (and instance size flexibility for eligible instances). Zonal RIs add a capacity reservation in one AZ.",
    },
    {
      id: "d4-04",
      domain: "d4",
      lesson: "d4-purchase",
      prompt: "A company bought Reserved Instances in one member account of its organization. Another member account runs matching instances. What happens by default?",
      options: [
        "The RI discount can apply to the other account's matching usage, because discounts are shared across the organization",
        "The discount is lost, because Reserved Instances only ever apply to the account that bought them, even in an organization",
        "Both accounts are charged twice",
        "AWS cancels the Reserved Instances",
      ],
      answer: [0],
      explanation: "With consolidated billing, Reserved Instance and Savings Plans discounts are shared across accounts by default. The management account can turn sharing off.",
    },
    {
      id: "d4-05",
      domain: "d4",
      lesson: "d4-purchase",
      prompt: "A retailer must be certain it can launch 50 instances in a specific Availability Zone during a three-day event, without a one- or three-year commitment. What should it use?",
      options: ["On-Demand Capacity Reservations", "Standard Reserved Instances", "Spot Instances", "Savings Plans"],
      answer: [0],
      explanation: "On-Demand Capacity Reservations reserve capacity in an AZ for any duration, and you can cancel them at any time.",
    },
    {
      id: "d4-06",
      domain: "d4",
      lesson: "d4-purchase",
      type: "match",
      prompt: "Match each EC2 purchasing option to its description.",
      pairs: [
        ["On-Demand Instances", "No commitment; pay by the second or hour"],
        ["Spot Instances", "Spare capacity at a steep discount that can be interrupted"],
        ["Dedicated Hosts", "A physical server you control, for per-socket or per-core licenses"],
        ["Dedicated Instances", "Hardware dedicated to one customer, without host-level control"],
        ["Capacity Reservations", "Reserve capacity in a specific AZ for any duration"],
      ],
      explanation: "Ask three things about each workload. Can you commit for a year or more? Can it cope with being interrupted? Does it need its own hardware for licensing or isolation?",
    },
    // ── Data transfer and storage ──
    {
      id: "d4-07",
      domain: "d4",
      lesson: "d4-transfer",
      prompt: "Which type of data transfer generally has NO charge?",
      options: ["Data transferred into AWS from the internet", "Data transferred out of AWS to the internet", "Data transferred between two AWS Regions", "Data transferred between Availability Zones"],
      answer: [0],
      explanation: "Inbound transfer from the internet is generally free. Outbound to the internet and transfer between Regions or AZs are charged.",
    },
    {
      id: "d4-08",
      domain: "d4",
      lesson: "d4-transfer",
      prompt: "Which data transfers usually incur charges? (Choose two.)",
      options: [
        "Data sent from EC2 to users on the internet",
        "Data replicated from a bucket in one Region to a bucket in another Region",
        "Data uploaded from the internet into Amazon S3",
        "Data read by EC2 from an S3 bucket in the same Region",
        "Data sent between instances in the same AZ using private IP addresses",
      ],
      answer: [0, 1],
      explanation: "Outbound internet transfer and inter-Region transfer are charged. Inbound transfer, same-Region S3-to-EC2, and same-AZ private traffic are generally free.",
    },
    {
      id: "d4-09",
      domain: "d4",
      lesson: "d4-transfer",
      prompt: "A team moved frequently read data from S3 Standard to S3 Standard-IA to save money, but its bill went up. What is the MOST likely reason?",
      options: [
        "Standard-IA charges a per-GB retrieval fee, which adds up for frequently accessed data",
        "Standard-IA charges for inbound data transfer, which adds up when data is uploaded often",
        "Standard-IA stores data in three Regions",
        "Standard-IA requires a Dedicated Host",
      ],
      answer: [0],
      explanation: "Infrequent access classes have lower storage prices but charge for retrieval. They pay off only when data is rarely read.",
    },
    // ── Cost tools ──
    {
      id: "d4-10",
      domain: "d4",
      lesson: "d4-tools",
      prompt: "A startup wants an email alert as soon as its FORECASTED monthly AWS spend exceeds $500. Which service should it use?",
      options: ["AWS Budgets", "AWS Cost Explorer", "AWS Pricing Calculator", "AWS Artifact"],
      answer: [0],
      explanation: "AWS Budgets sends alerts when actual or forecasted cost or usage crosses thresholds you set.",
    },
    {
      id: "d4-11",
      domain: "d4",
      lesson: "d4-tools",
      prompt: "A finance analyst wants to see which services drove the increase in spending over the last six months, filtered by a project tag. Which tool should they use?",
      options: ["AWS Cost Explorer", "AWS Pricing Calculator", "AWS Trusted Advisor", "AWS Health Dashboard"],
      answer: [0],
      explanation: "Cost Explorer visualizes and analyzes historical costs and usage, with filters and grouping by service, account, or tag.",
    },
    {
      id: "d4-12",
      domain: "d4",
      lesson: "d4-tools",
      prompt: "Before migrating, a company wants to estimate the monthly cost of a planned architecture with EC2, RDS, and S3. Which tool should it use?",
      options: ["AWS Pricing Calculator", "AWS Cost Explorer", "AWS Budgets", "AWS Cost and Usage Report"],
      answer: [0],
      explanation: "The Pricing Calculator estimates costs for services you haven't deployed yet. The other tools analyze actual usage.",
    },
    {
      id: "d4-13",
      domain: "d4",
      lesson: "d4-tools",
      prompt: "A company needs the most detailed, line-item billing data, including resource IDs and tags, delivered to an S3 bucket for its own analysis. What should it use?",
      options: ["AWS Cost and Usage Report", "AWS Budgets", "AWS Pricing Calculator", "Amazon CloudWatch"],
      answer: [0],
      explanation: "The Cost and Usage Report contains the most comprehensive cost and usage data and can be queried, for example, with Athena.",
    },
    // ── Organizations and tags ──
    {
      id: "d4-14",
      domain: "d4",
      lesson: "d4-orgs",
      prompt: "A company has 12 AWS accounts and wants one bill and the benefit of combined usage for volume pricing. What should it use?",
      options: ["Consolidated billing in AWS Organizations", "AWS Budgets", "A separate payment card per account", "AWS Artifact"],
      answer: [0],
      explanation: "Consolidated billing gives one bill for all accounts and combines usage across them so volume pricing tiers apply.",
    },
    {
      id: "d4-15",
      domain: "d4",
      lesson: "d4-orgs",
      prompt: "Engineers tagged all resources with a Project tag, but the tag doesn't appear as an option in Cost Explorer. What must be done?",
      options: [
        "Activate the tag as a user-defined cost allocation tag in the Billing and Cost Management console",
        "Recreate every resource",
        "Upgrade to Enterprise Support",
        "Wait for the next billing cycle, because Cost Explorer shows every resource tag on its own once it refreshes",
      ],
      answer: [0],
      explanation: "Tags appear in cost reports only after you activate them as cost allocation tags. Data is tracked from activation onward.",
    },
    {
      id: "d4-16",
      domain: "d4",
      lesson: "d4-orgs",
      prompt: "Which are benefits of AWS Organizations? (Choose two.)",
      options: [
        "Consolidated billing across accounts",
        "Service control policies that set maximum permissions for accounts",
        "A free Enterprise Support plan",
        "Automatic encryption of all data",
        "Unlimited free usage of every service",
      ],
      answer: [0, 1],
      explanation: "Organizations centrally manages accounts with consolidated billing, organizational units, and policies such as SCPs.",
    },
    // ── Support plans ──
    {
      id: "d4-17",
      domain: "d4",
      lesson: "d4-support",
      prompt: "A small company running production workloads wants 24/7 access to Cloud Support Engineers by phone and chat at the LOWEST cost. Which plan should it choose?",
      options: ["Basic Support", "AWS Business Support+", "AWS Enterprise Support", "AWS Unified Operations"],
      answer: [1],
      explanation: "Business Support+ is the entry plan with 24/7 phone, web, and chat access to engineers. Basic covers only account and billing help.",
    },
    {
      id: "d4-18",
      domain: "d4",
      lesson: "d4-support",
      prompt: "A company wants a designated Technical Account Manager (TAM) who provides proactive guidance. Which is the lowest-priced plan that includes one?",
      options: ["AWS Enterprise Support", "AWS Business Support+", "Basic Support", "AWS re:Post"],
      answer: [0],
      explanation: "Enterprise Support comes with a designated Technical Account Manager. Unified Operations does too, and adds specialist engineers.",
    },
    {
      id: "d4-19",
      domain: "d4",
      lesson: "d4-support",
      prompt: "Which are included with AWS Basic Support? (Choose two.)",
      options: [
        "24/7 customer service for account and billing questions",
        "Access to documentation, whitepapers, and AWS re:Post",
        "A designated Technical Account Manager",
        "24/7 phone access to Cloud Support Engineers for technical issues",
        "Infrastructure event management",
      ],
      answer: [0, 1],
      explanation: "Basic Support is free for every account: customer service, documentation, re:Post, core Trusted Advisor checks, and AWS Health.",
    },
    {
      id: "d4-20",
      domain: "d4",
      lesson: "d4-support",
      type: "order",
      prompt: "Order these AWS Support plans from the LEAST to the MOST comprehensive.",
      items: ["Basic Support", "AWS Business Support+", "AWS Enterprise Support", "AWS Unified Operations"],
      explanation: "Each plan up the ladder answers faster and gives you more named experts. At the top, Unified Operations gives you a whole operations team.",
    },
    // ── Resources, partners, and tools ──
    {
      id: "d4-21",
      domain: "d4",
      lesson: "d4-help",
      prompt: "A team planning a large migration wants vetted strategies, step-by-step guides, and architecture patterns written by AWS experts. Which resource should it use?",
      options: ["AWS Prescriptive Guidance", "AWS Artifact", "AWS Pricing Calculator", "AWS Trust and Safety"],
      answer: [0],
      explanation: "AWS Prescriptive Guidance offers strategies, guides, and patterns for migration and modernization.",
    },
    {
      id: "d4-22",
      domain: "d4",
      lesson: "d4-help",
      prompt: "A company lacks the staff to plan and run its migration and wants an experienced consulting firm to do the work. Where should it look?",
      options: ["An AWS Partner that is a system integrator", "AWS Artifact", "AWS Cost Explorer, to forecast the migration budget before work starts", "Amazon Connect"],
      answer: [0],
      explanation: "AWS Partners include system integrators that deliver consulting and migration services. AWS Professional Services is another option.",
    },
    {
      id: "d4-23",
      domain: "d4",
      lesson: "d4-help",
      prompt: "A company wants to find, buy, and deploy third-party software, and manage entitlements and costs for it through its AWS account. What should it use?",
      options: ["AWS Marketplace", "AWS Organizations", "AWS Health Dashboard", "AWS Knowledge Center"],
      answer: [0],
      explanation: "AWS Marketplace is a curated catalog of software from independent software vendors, billed through AWS, with governance and entitlement features.",
    },
    {
      id: "d4-24",
      domain: "d4",
      lesson: "d4-help",
      prompt: "A company notices that IP addresses owned by AWS are sending phishing emails to its employees. Whom should it contact?",
      options: ["The AWS Trust and Safety team", "AWS Professional Services", "AWS Marketplace", "AWS Billing support"],
      answer: [0],
      explanation: "The AWS Trust and Safety team handles reports of AWS resources used for abuse, such as spam, phishing, or attacks.",
    },
    {
      id: "d4-25",
      domain: "d4",
      lesson: "d4-help",
      prompt: "An operations team wants to know about scheduled maintenance and AWS events that affect ITS specific resources. Where should it look?",
      options: ["AWS Health Dashboard", "AWS Pricing Calculator", "AWS Artifact", "AWS re:Post"],
      answer: [0],
      explanation: "The AWS Health Dashboard shows events that affect your account and resources. The AWS Health API gives programmatic access to the same events.",
    },
    {
      id: "d4-26",
      domain: "d4",
      lesson: "d4-help",
      prompt: "A company wants automated recommendations that find idle load balancers, under-used EC2 instances, and other ways to save money. Which service provides these checks?",
      options: ["AWS Trusted Advisor", "AWS Artifact", "Amazon Inspector", "AWS CloudTrail"],
      answer: [0],
      explanation: "Trusted Advisor checks cost optimization, security, fault tolerance, performance, and service quotas. The full set comes with Business Support+ and above.",
    },
  ],

  cards: [
    { id: "c4-ondemand", domain: "d4", kind: "concept", term: "On-Demand Instances", definition: "No commitment. You pay by the second or hour while the instance runs." },
    { id: "c4-spot", domain: "d4", kind: "concept", term: "Spot Instances", definition: "Spare AWS capacity at up to 90% off. AWS can take it back with a 2-minute warning." },
    { id: "c4-ri", domain: "d4", kind: "concept", term: "Reserved Instances", definition: "A discount for promising to use a particular instance setup for 1 or 3 years." },
    { id: "c4-sp", domain: "d4", kind: "concept", term: "Savings Plans", definition: "A discount for promising to spend a set amount per hour for 1 or 3 years. It works across several services." },
    { id: "c4-dh", domain: "d4", kind: "concept", term: "Dedicated Host", definition: "A whole physical server just for you. Useful when software licenses are counted per core or socket." },
    { id: "c4-cr", domain: "d4", kind: "concept", term: "On-Demand Capacity Reservation", definition: "Holds capacity for you in one AZ, with no long-term commitment." },
    { id: "c4-transfer", domain: "d4", kind: "concept", term: "Data transfer pricing", definition: "Data coming in from the internet is free. Data going out, or between Regions, is charged." },
    { id: "c4-tags", domain: "d4", kind: "concept", term: "Cost allocation tags", definition: "Labels on resources that, once activated, let you split costs in Cost Explorer and the Cost and Usage Report." },
    { id: "c4-consolidated", domain: "d4", kind: "concept", term: "Consolidated billing", definition: "One bill for all your accounts. Their usage is added together, so you reach volume discounts sooner." },
    { id: "c4-basic", domain: "d4", kind: "concept", term: "Basic Support", definition: "Free for everyone: help with billing, documentation, re:Post and the core Trusted Advisor checks." },
    { id: "c4-bplus", domain: "d4", kind: "concept", term: "Business Support+", definition: "Engineers by phone and chat around the clock, AI-powered help, and every Trusted Advisor check." },
    { id: "c4-ent", domain: "d4", kind: "concept", term: "Enterprise Support", definition: "A named Technical Account Manager, and a reply within 15 minutes for critical cases." },
    { id: "c4-uo", domain: "d4", kind: "concept", term: "Unified Operations", definition: "A named team of TAMs and specialists, with incident engineers responding in about 5 minutes." },
    { id: "s-budgets", domain: "d4", kind: "service", term: "AWS Budgets", definition: "Sends an alert when real or forecast cost or usage passes a limit you set." },
    { id: "s-costexplorer", domain: "d4", kind: "service", term: "AWS Cost Explorer", definition: "Charts and filters for what you've spent, plus a forecast." },
    { id: "s-pricingcalc", domain: "d4", kind: "service", term: "AWS Pricing Calculator", definition: "Estimates what something will cost before you build it." },
    { id: "s-cur", domain: "d4", kind: "service", term: "AWS Cost and Usage Report", definition: "The most detailed billing data there is, line by line." },
    { id: "s-organizations", domain: "d4", kind: "service", term: "AWS Organizations", definition: "Manages many accounts in one place, with one combined bill and service control policies." },
    { id: "s-controltower", domain: "d4", kind: "service", term: "AWS Control Tower", definition: "Sets up and looks after a multi-account environment that follows best practices." },
    { id: "s-trustedadvisor", domain: "d4", kind: "service", term: "AWS Trusted Advisor", definition: "Checks your account and suggests fixes for cost, security, resilience and quotas." },
    { id: "s-health", domain: "d4", kind: "service", term: "AWS Health Dashboard", definition: "Shows AWS events that affect your resources, such as planned maintenance." },
    { id: "s-marketplace", domain: "d4", kind: "service", term: "AWS Marketplace", definition: "A store for software from other companies, billed through your AWS account." },
    { id: "s-support", domain: "d4", kind: "service", term: "AWS Support", definition: "AWS's help service, with plans from free Basic up to Unified Operations." },
    { id: "s-licensemgr", domain: "d4", kind: "service", term: "AWS License Manager", definition: "Keeps track of your software licenses so you stay within them." },
    { id: "s-quotas", domain: "d4", kind: "service", term: "Service Quotas", definition: "Shows your limits for each service and lets you ask for more." },
  ],

  challenges: [
    {
      id: "ch-pricing-fit",
      domain: "d4",
      lesson: "d4-purchase",
      title: "Right price, right workload",
      goal: "Give all five workloads their best-fit EC2 purchasing option.",
      hint: "Ask two questions for each: can it be interrupted, and is the usage steady and long-term?",
      takeaway: "Use Spot for work that can be interrupted and Savings Plans or RIs for steady use. Use On-Demand for short or unpredictable work, and Dedicated Hosts when license rules demand it.",
      render: (onSolved) => <PricingPickerLab goal="bestFit" onSolved={onSolved} />,
    },
    {
      id: "ch-support-pick",
      domain: "d4",
      lesson: "d4-support",
      title: "Support desk",
      goal: "Match all five customers to the cheapest Support plan that meets their needs.",
      hint: "Basic is free. Engineers around the clock start at Business Support+. A named TAM starts at Enterprise Support.",
      takeaway: "Pick the cheapest plan that meets the need. Exam questions usually turn on one feature: phone access, a TAM, or response time.",
      render: (onSolved) => <SupportPlanLab goal="allRight" onSolved={onSolved} />,
    },
  ],
});
