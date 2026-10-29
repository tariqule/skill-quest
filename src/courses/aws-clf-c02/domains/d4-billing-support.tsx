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
    summary: "EC2 purchasing options, data transfer and storage pricing, cost tools, AWS Organizations, Support plans, and where to get help.",
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
              { icon: "📍", title: "Regional RI", text: "Discount applies in any AZ of the Region, with instance size flexibility. No capacity reservation.", color: "#f59e0b" },
              { icon: "🎯", title: "Zonal RI", text: "Discount plus a capacity reservation in one specific AZ.", color: "#f59e0b" },
              { icon: "🔁", title: "Standard vs Convertible", text: "Convertible RIs can be exchanged for different attributes; Standard RIs give a larger discount.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "Reserved Instances and Savings Plans: 1- or 3-year commitments, with All Upfront, Partial Upfront, or No Upfront payment. Longer terms and more upfront mean bigger discounts.",
        "Savings Plans commit to an hourly spend. Compute Savings Plans apply across instance families, Regions, Fargate, and Lambda; EC2 Instance Savings Plans fix one family in one Region.",
        "In AWS Organizations, RI and Savings Plans discounts are shared across the accounts in the organization by default. The management account can turn sharing off.",
        "Dedicated Instances run on hardware dedicated to you. Dedicated Hosts give you a whole physical server with visibility into sockets and cores. On-Demand Capacity Reservations reserve capacity in an AZ with no term commitment.",
      ],
      tip: "Interruptible → Spot. Steady and flexible → Savings Plans. Short or unpredictable → On-Demand. Per-core licenses → Dedicated Hosts.",
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
              { icon: "🌐", label: "Internet → AWS", sub: "Inbound: generally free" },
              { icon: "🏢", label: "Within one AZ", sub: "Private IP traffic: generally free" },
              { icon: "🔀", label: "Between AZs or Regions", sub: "Charged per GB" },
              { icon: "📤", label: "AWS → internet", sub: "Outbound: charged per GB" },
            ]}
          />
          <Ladder
            rungs={[
              { icon: "🧊", name: "Archive classes", text: "Cheapest per GB, but retrieval fees and longer waits" },
              { icon: "🌗", name: "Infrequent access classes", text: "Cheaper storage, per-GB retrieval fee" },
              { icon: "🪣", name: "S3 Standard", text: "Higher storage price, no retrieval fee" },
            ]}
          />
        </div>
      ),
      points: [
        "S3 pricing has four main parts: storage per GB-month, requests, data transfer out, and retrieval for some classes.",
        "EBS is priced per GB provisioned (plus provisioned performance for some volume types), whether you fill it or not.",
        "Data transfer from S3 to EC2 in the same Region is free; sending it to the internet is not.",
      ],
      tip: "\"Which transfer is free?\" → data coming IN from the internet.",
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
            { icon: "🧮", title: "AWS Pricing Calculator", text: "Estimate the cost of an architecture BEFORE you build it.", color: "#38bdf8" },
            { icon: "🚨", title: "AWS Budgets", text: "Set cost or usage budgets and get alerts on actual or forecasted spend.", color: "#38bdf8" },
            { icon: "📊", title: "AWS Cost Explorer", text: "Visualize and analyze past costs, filter by service or tag, and forecast.", color: "#38bdf8" },
            { icon: "🧾", title: "AWS Cost and Usage Report", text: "The most detailed line-item billing data, delivered to S3.", color: "#38bdf8" },
          ]}
        />
      ),
      points: [
        "Budgets can also track Reserved Instance and Savings Plans utilization and coverage, and can trigger actions.",
        "Cost Explorer shows trends and can recommend Reserved Instance and Savings Plans purchases.",
        "The Billing and Cost Management console is where you see bills, payments, and invoices.",
      ],
      tip: "Before you build → Pricing Calculator. Alert me → Budgets. What did we spend, and why? → Cost Explorer. Every line item → Cost and Usage Report.",
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
              { icon: "🏛️", label: "Management account", sub: "Pays one consolidated bill" },
              { icon: "🗂️", label: "Organizational units", sub: "Group accounts; apply service control policies" },
              { icon: "👥", label: "Member accounts", sub: "Usage combined for volume pricing" },
            ]}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🏷️", title: "User-defined tags", text: "Your own keys, such as Project or CostCenter. Activate them for billing.", color: "#34d399" },
              { icon: "🤖", title: "AWS-generated tags", text: "Added by AWS, such as aws:createdBy. Also activated in the billing console.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "Consolidated billing: one bill for all accounts, and usage is combined so the organization reaches volume discount tiers sooner.",
        "Service control policies (SCPs) set the maximum permissions for accounts in the organization.",
        "Cost allocation tags appear in Cost Explorer and the Cost and Usage Report only after you activate them.",
        "AWS Control Tower sets up and governs a multi-account environment that follows best practices.",
      ],
      tip: "\"Tagged resources don't show up in cost reports\" → activate the cost allocation tags.",
    },
    {
      id: "d4-support",
      check: ["d4-17", "d4-18"],
      task: "4.3",
      title: "AWS Support plans",
      visual: <SupportPlanLab />,
      points: [
        "Basic: included for everyone. Account and billing help, documentation, whitepapers, re:Post, core Trusted Advisor checks, AWS Health.",
        "Business Support+: 24/7 access to engineers by phone, web, and chat, AI-powered help, under 30 minutes for business-critical outages, and the full set of Trusted Advisor checks.",
        "Enterprise Support: adds a designated Technical Account Manager (TAM) and up to 15-minute response for critical cases.",
        "Unified Operations: a designated team of TAMs and domain specialist engineers, with incident engineers responding within about 5 minutes.",
        "Developer Support, Business Support (classic), and Enterprise On-Ramp end on January 1, 2027.",
      ],
      tip: "Lowest plan with 24/7 phone and chat → Business Support+. Designated TAM → Enterprise Support or higher.",
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
            { icon: "💬", title: "AWS re:Post", text: "Community Q&A, with answers from experts and AWS.", color: "#34d399" },
            { icon: "📚", title: "AWS Knowledge Center", text: "Answers to the most common questions.", color: "#34d399" },
            { icon: "🗺️", title: "AWS Prescriptive Guidance", text: "Strategies, guides, and patterns for migrating and modernizing.", color: "#34d399" },
            { icon: "🩺", title: "AWS Health Dashboard", text: "Events that affect your resources, such as scheduled maintenance. AWS Health API for automation.", color: "#34d399" },
            { icon: "💡", title: "AWS Trusted Advisor", text: "Recommendations for cost, security, fault tolerance, performance, and quotas.", color: "#34d399" },
            { icon: "🚩", title: "AWS Trust and Safety", text: "Report AWS resources used for abuse, such as spam or phishing.", color: "#34d399" },
            { icon: "🤝", title: "AWS Partners", text: "System integrators and ISVs; partner training, events, and volume discounts.", color: "#a78bfa" },
            { icon: "🛍️", title: "AWS Marketplace", text: "Third-party software and services, with cost management, governance, and entitlement tools.", color: "#a78bfa" },
            { icon: "🧑‍🏫", title: "Professional Services and SAs", text: "AWS experts who help design and deliver projects.", color: "#a78bfa" },
          ]}
        />
      ),
      points: [
        "Whitepapers, documentation, and blogs are on official AWS websites. AWS Support Center is where you open and track support cases.",
        "System integrators deliver consulting and migration projects; independent software vendors (ISVs) sell software, often through AWS Marketplace.",
      ],
      tip: "\"Idle resources and cost savings recommendations\" → Trusted Advisor. \"Maintenance on my instances\" → AWS Health Dashboard.",
    },
  ],

  questions: [
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
        "A capacity reservation in every AZ at no cost",
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
        "The discount is lost unless the instances move accounts",
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
      explanation: "Choose by commitment, interruption tolerance, and licensing or isolation needs.",
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
        "Standard-IA charges for inbound data transfer",
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
        "Move the resources to another Region",
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
      explanation: "Enterprise Support includes a designated TAM. Unified Operations also does, along with domain specialist engineers.",
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
      explanation: "Each tier adds faster response and more designated expertise, up to a dedicated operations team in Unified Operations.",
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
      options: ["An AWS Partner that is a system integrator", "AWS Artifact", "AWS Cost Explorer", "Amazon Connect"],
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
    { id: "c4-ondemand", domain: "d4", kind: "concept", term: "On-Demand Instances", definition: "No commitment; pay per second or hour" },
    { id: "c4-spot", domain: "d4", kind: "concept", term: "Spot Instances", definition: "Up to 90% off; can be interrupted with a 2-minute warning" },
    { id: "c4-ri", domain: "d4", kind: "concept", term: "Reserved Instances", definition: "1- or 3-year commitment to an instance configuration" },
    { id: "c4-sp", domain: "d4", kind: "concept", term: "Savings Plans", definition: "1- or 3-year $/hour commitment, flexible across services" },
    { id: "c4-dh", domain: "d4", kind: "concept", term: "Dedicated Host", definition: "A physical server for you; supports per-core licenses" },
    { id: "c4-cr", domain: "d4", kind: "concept", term: "On-Demand Capacity Reservation", definition: "Reserve capacity in an AZ, no term commitment" },
    { id: "c4-transfer", domain: "d4", kind: "concept", term: "Data transfer pricing", definition: "In from internet free; out and between Regions charged" },
    { id: "c4-tags", domain: "d4", kind: "concept", term: "Cost allocation tags", definition: "Activate tags to track costs in Cost Explorer and CUR" },
    { id: "c4-consolidated", domain: "d4", kind: "concept", term: "Consolidated billing", definition: "One bill; usage combined for volume pricing" },
    { id: "c4-basic", domain: "d4", kind: "concept", term: "Basic Support", definition: "Free: billing help, docs, re:Post, core Trusted Advisor" },
    { id: "c4-bplus", domain: "d4", kind: "concept", term: "Business Support+", definition: "24/7 engineers by phone and chat, AI help, full Trusted Advisor" },
    { id: "c4-ent", domain: "d4", kind: "concept", term: "Enterprise Support", definition: "Designated TAM, 15-minute critical response" },
    { id: "c4-uo", domain: "d4", kind: "concept", term: "Unified Operations", definition: "Designated TAM and specialist team; about 5-minute incident response" },
    { id: "s-budgets", domain: "d4", kind: "service", term: "AWS Budgets", definition: "Alerts on actual or forecasted cost and usage" },
    { id: "s-costexplorer", domain: "d4", kind: "service", term: "AWS Cost Explorer", definition: "Visualize, analyze, and forecast costs" },
    { id: "s-pricingcalc", domain: "d4", kind: "service", term: "AWS Pricing Calculator", definition: "Estimate costs before you build" },
    { id: "s-cur", domain: "d4", kind: "service", term: "AWS Cost and Usage Report", definition: "Most detailed line-item billing data" },
    { id: "s-organizations", domain: "d4", kind: "service", term: "AWS Organizations", definition: "Manage accounts centrally; consolidated billing and SCPs" },
    { id: "s-controltower", domain: "d4", kind: "service", term: "AWS Control Tower", definition: "Set up and govern a multi-account environment" },
    { id: "s-trustedadvisor", domain: "d4", kind: "service", term: "AWS Trusted Advisor", definition: "Recommendations for cost, security, resilience, and quotas" },
    { id: "s-health", domain: "d4", kind: "service", term: "AWS Health Dashboard", definition: "Events affecting your AWS resources" },
    { id: "s-marketplace", domain: "d4", kind: "service", term: "AWS Marketplace", definition: "Buy and manage third-party software through AWS" },
    { id: "s-support", domain: "d4", kind: "service", term: "AWS Support", definition: "Support plans from Basic to Unified Operations" },
    { id: "s-licensemgr", domain: "d4", kind: "service", term: "AWS License Manager", definition: "Track and manage software licenses" },
    { id: "s-quotas", domain: "d4", kind: "service", term: "Service Quotas", definition: "View and request increases to service limits" },
  ],

  challenges: [
    {
      id: "ch-pricing-fit",
      domain: "d4",
      lesson: "d4-purchase",
      title: "Right price, right workload",
      goal: "Give all five workloads their best-fit EC2 purchasing option.",
      hint: "Ask two questions for each: can it be interrupted, and is the usage steady and long-term?",
      takeaway: "Spot for interruptible work, Savings Plans or RIs for steady usage, On-Demand for short or unpredictable work, Dedicated Hosts for license rules.",
      render: (onSolved) => <PricingPickerLab goal="bestFit" onSolved={onSolved} />,
    },
    {
      id: "ch-support-pick",
      domain: "d4",
      lesson: "d4-support",
      title: "Support desk",
      goal: "Match all five customers to the cheapest Support plan that meets their needs.",
      hint: "Basic is free; 24/7 engineers start at Business Support+; a designated TAM starts at Enterprise Support.",
      takeaway: "Pick the lowest plan that meets the requirement. Exam questions usually hinge on one feature: phone access, TAM, or response time.",
      render: (onSolved) => <SupportPlanLab goal="allRight" onSolved={onSolved} />,
    },
  ],
});
