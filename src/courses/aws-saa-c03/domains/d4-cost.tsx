import { Flow, Ladder, Layers, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { S3ClassLab, VpcBuilderLab } from "../labs";

/**
 * Domain 4: Design Cost-Optimized Architectures (20% of SAA-C03 scored content).
 */
export default defineDomain({
  domain: {
    id: "d4",
    number: 4,
    name: "Design Cost-Optimized Architectures",
    world: "The Thrifty Bazaar",
    weight: 20,
    emoji: "💰",
    color: "#a78bfa",
    summary: "How to design systems that don't waste money. You'll cover S3 storage classes, right-sized storage, ways to pay less for servers, cheaper databases, network charges and the cost tools.",
  },

  tasks: [
    {
      id: "4.1",
      title: "Design cost-optimized storage solutions",
      covers: [
        "Access options (for example, S3 Requester Pays) and cost management features and tools (cost allocation tags, multi-account billing, Cost Explorer, Budgets, Cost and Usage Report)",
        "Storage services by use case (FSx, EFS, S3, EBS), block options (HDD and SSD volume types), and storage types",
        "Backup strategies, data lifecycles, storage access patterns, and storage tiering (cold tiers for object storage)",
        "Hybrid storage options (DataSync, Transfer Family, Storage Gateway)",
        "Design storage strategies (batch versus individual uploads to S3) and size storage correctly",
        "Find the lowest-cost way to transfer data into AWS storage, and decide when storage auto scaling is needed",
        "Manage S3 object lifecycles; select backup, archival, migration, and storage-tier options",
        "Select the most cost-effective storage service for a workload",
      ],
    },
    {
      id: "4.2",
      title: "Design cost-optimized compute solutions",
      covers: [
        "Cost management features and tools, and the global infrastructure",
        "Purchasing options: Spot Instances, Reserved Instances, Savings Plans",
        "Distributed compute (edge processing) and hybrid compute (AWS Outposts)",
        "Instance types, families, and sizes; optimize utilization with containers, serverless, and microservices",
        "Scaling strategies (Auto Scaling, hibernation)",
        "Pick a load balancing strategy (ALB at layer 7, NLB at layer 4, Gateway Load Balancer)",
        "Choose horizontal or vertical scaling, and cost-effective compute (Lambda, EC2, Fargate)",
        "Match availability to the workload class (production versus non-production); choose instance family and size",
      ],
    },
    {
      id: "4.3",
      title: "Design cost-optimized database solutions",
      covers: [
        "Cost management features and tools; caching strategies; data retention policies",
        "Database capacity planning (capacity units), connections and proxies, and replication (read replicas)",
        "Database engines (homogeneous and heterogeneous migrations) and types (relational, non-relational, Aurora, DynamoDB)",
        "Design backup and retention policies (snapshot frequency)",
        "Choose an engine (MySQL versus PostgreSQL) and cost-effective services (DynamoDB versus RDS, serverless)",
        "Choose cost-effective database types (time series, columnar)",
        "Migrate schemas and data to new locations or engines",
      ],
    },
    {
      id: "4.4",
      title: "Design cost-optimized network architectures",
      covers: [
        "Cost management features and tools; load balancing (ALB)",
        "NAT gateways: NAT instance costs versus NAT gateway costs",
        "Connectivity (private lines, dedicated lines, VPNs) and routing, topology, and peering (Transit Gateway, VPC peering)",
        "Network services such as DNS",
        "Configure NAT gateways (one shared versus one per AZ) and network connections (Direct Connect versus VPN versus internet)",
        "Route to minimize transfer costs: Region to Region, AZ to AZ, private to public, Global Accelerator, VPC endpoints",
        "Decide when CDNs and edge caching pay off; review workloads for network optimizations",
        "Select a throttling strategy and bandwidth allocation (one or several VPNs, Direct Connect speed)",
      ],
    },
  ],

  lessons: [
    {
      id: "d4-start-lights-on",
      level: "beginner",
      task: "4.2",
      title: "Why cloud bills surprise people",
      check: ["saa-b4-01", "saa-b4-02"],
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "💡", title: "Left running", text: "Servers nobody uses still cost money every hour.", color: "#f87171" },
            { icon: "📦", title: "Too big", text: "A server far larger than the job needs costs more for no gain.", color: "#f59e0b" },
            { icon: "✅", title: "Just right", text: "The right size, running only when needed.", color: "#34d399" },
          ]}
        />
      ),
      points: [
        "In the cloud you pay for what you leave running, not just for what you actually use. It's like leaving the lights on in an empty house.",
        "The two classic money leaks are things nobody switched off and things that are much bigger than they need to be.",
        "**Rightsizing** means picking a size that fits the real workload. **Scheduling** means switching off things like test servers at night and at weekends.",
        "An architect's job is to meet the requirements at the lowest cost, not to buy the biggest of everything.",
      ],
      tip: "Before reaching for a discount, first check what can be turned off or made smaller.",
    },
    {
      id: "d4-start-hot-and-cold",
      level: "beginner",
      task: "4.1",
      title: "Hot and cold storage",
      check: ["saa-b4-03", "saa-b4-04"],
      visual: (
        <Ladder caption="higher price to store, cheaper and faster to read as you climb"
          rungs={[
            { icon: "🧊", name: "Cold: S3 Glacier", text: "Cheapest to keep, but slower and pricier to get back. Like boxes in the attic." },
            { icon: "🌗", name: "Cool: S3 Standard-IA", text: "Cheaper to keep, with a small fee each time you read it." },
            { icon: "🔥", name: "Hot: S3 Standard", text: "Data you use all the time. Like clothes in your wardrobe." },
          ]}
        />
      ),
      points: [
        "Not all data is used equally. Some you read every day, some once a year, and some only if an auditor asks.",
        "Think of your clothes. Everyday ones live in the wardrobe. Winter coats go in the attic: cheaper to store out of the way, but a trip to fetch.",
        "Amazon S3 has **storage classes** that work the same way. **S3 Standard** is for hot data. The **Glacier** classes are for cold archives that cost very little to keep.",
        "Picking the right class for each kind of data can cut storage bills a lot, with no change to the data itself.",
      ],
      tip: "Ask how often the data is read and how fast you need it back. Then pick the coldest class that still meets both.",
    },
    {
      id: "d4-start-pay-less",
      level: "beginner",
      task: "4.2",
      title: "Paying less for servers: commit or be flexible",
      check: ["saa-b4-05", "saa-b4-06"],
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "🕐", title: "On-Demand", text: "Pay full price by the hour. No promises. Like paying per gym visit.", color: "#38bdf8" },
            { icon: "📅", title: "Savings Plans", text: "Promise to use AWS for 1 or 3 years and get a big discount. Like a yearly membership.", color: "#34d399" },
            { icon: "🎲", title: "Spot", text: "Spare capacity at up to 90% off, but AWS can take it back. Like a standby airline seat.", color: "#f59e0b" },
          ]}
        />
      ),
      points: [
        "AWS gives you a few ways to pay for the same server. The cheapest one depends on how you'll use it.",
        "**On-Demand** is the full price, with no promises. It's like paying for each gym visit: flexible, but costly if you go every day.",
        "**Savings Plans** and **Reserved Instances** give a big discount when you promise to keep using AWS for 1 or 3 years, like a yearly gym membership.",
        "**Spot Instances** use AWS's spare capacity at up to 90% off. AWS can take them back with a 2-minute warning, so use them only for work that can be interrupted.",
      ],
      tip: "Steady, all-day use: commit with a Savings Plan. Work that can stop and restart: Spot. Short or unpredictable: On-Demand.",
    },
    {
      id: "d4-s3-tiers",
      task: "4.1",
      title: "S3 storage classes and lifecycle rules",
      check: ["d4-01", "d4-02"],
      visual: (
        <div className="grid gap-6">
          <Ladder caption="higher price to store, cheaper and faster to read as you climb"
            rungs={[
              { icon: "🕳️", name: "Glacier Deep Archive", text: "The lowest storage cost. Restores take 12 to 48 hours. You pay for at least 180 days." },
              { icon: "🏔️", name: "Glacier Flexible Retrieval", text: "Restores in minutes (expedited) up to hours. You pay for at least 90 days." },
              { icon: "⚡", name: "Glacier Instant Retrieval", text: "Back in milliseconds, for data read about once a quarter. You pay for at least 90 days." },
              { icon: "1️⃣", name: "One Zone-IA", text: "Rarely read data you could re-create, kept in one AZ. You pay for at least 30 days." },
              { icon: "🧊", name: "Standard-IA", text: "Rarely read but instant, across several AZs. At least 30 days, plus a fee per GB read." },
              { icon: "🪣", name: "Standard", text: "Read often. No read fee and no minimum time." },
            ]}
          />
          <S3ClassLab />
        </div>
      ),
      points: [
        "The infrequent access and Glacier classes are cheaper to store in, but they charge to read data back and have a **minimum storage duration**. Delete early and you still pay for the minimum.",
        "**S3 Intelligent-Tiering** moves objects between tiers by itself, with no fee to read them, for a small monitoring charge per object. Use it when nobody knows how often data will be read.",
        "A **lifecycle rule** moves objects to cheaper classes as they age and deletes them when they're no longer needed. For example: Standard, then Standard-IA after 30 days, then Glacier Deep Archive after a year.",
        "Lifecycle rules can also delete old object versions and clean up unfinished multipart uploads, both of which quietly add cost.",
        "With **Requester Pays**, whoever downloads your shared data set pays for the requests and data transfer, not you.",
      ],
      tip: "Read three things in the question: how often data is read, how fast it must come back, and whether it can live in one AZ. Then pick the cheapest class that satisfies all three.",
    },
    {
      id: "d4-storage-cost",
      task: "4.1",
      title: "Cost-effective block, file, backup, and transfer",
      check: ["d4-09", "d4-10"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "💽", title: "Move gp2 to gp3", text: "gp3 costs less per GB than gp2 and gives 3,000 IOPS at any size.", color: "#a78bfa" },
              { icon: "🐢", title: "st1 and sc1", text: "Hard-disk volumes for throughput-heavy or cold data, at a fraction of SSD prices.", color: "#a78bfa" },
              { icon: "🧹", title: "Clean up", text: "Delete unattached EBS volumes and old snapshots. Snapshots only store changes, but they still add up.", color: "#a78bfa" },
              { icon: "📂", title: "EFS lifecycle", text: "Move files not read for a while to EFS Infrequent Access or Archive automatically.", color: "#a78bfa" },
            ]}
          />
          <Layers
            layers={[
              { name: "Move data into AWS", color: "#34d399", items: ["Upload over the internet: data coming in is free", "DataSync: online, scheduled and checked", "Snow Family: offline, when the link is too slow", "Transfer Family: for partners who use SFTP"] },
              { name: "Keep it safe for less", color: "#38bdf8", items: ["AWS Backup lifecycle to cold storage", "Snapshot schedules sized to RPO", "Tape Gateway instead of physical tapes"] },
            ]}
          />
        </div>
      ),
      points: [
        "Pay for the storage you need now and let it grow. EFS and S3 grow by themselves, and RDS storage auto scaling and EBS Elastic Volumes resize when you need them to.",
        "Moving data into AWS from the internet is free, so the real question is time. If an upload would take weeks, ship the data on a Snow device instead.",
        "Bundle many small files into bigger objects before uploading to S3. That cuts the charges you pay per request and per object.",
        "Replace tape libraries in your own building with Tape Gateway, which stores the virtual tapes in S3 Glacier classes.",
      ],
      tip: "Hundreds of terabytes, a slow internet link and a two-week deadline point to Snow Family. An ongoing, scheduled sync over the network points to DataSync.",
    },
    {
      id: "d4-compute-cost",
      task: "4.2",
      title: "Compute purchasing options and rightsizing",
      check: ["d4-15", "d4-16"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "🕐", title: "On-Demand", text: "No commitment, paid by the second or hour. For short, unpredictable or uninterruptible work.", color: "#38bdf8" },
              { icon: "📅", title: "Savings Plans", text: "Commit to a dollar amount per hour for 1 or 3 years. Compute Savings Plans cover EC2, Fargate and Lambda in any Region, family or OS.", color: "#34d399" },
              { icon: "🎟️", title: "Reserved Instances", text: "Commit to specific instance attributes for 1 or 3 years. Convertible RIs can be exchanged.", color: "#34d399" },
              { icon: "🎲", title: "Spot Instances", text: "Spare capacity at up to 90% off. AWS can take it back with a 2-minute warning.", color: "#f59e0b" },
              { icon: "🏢", title: "Dedicated Hosts", text: "A whole physical server for you. Bring licenses counted per socket or core, and meet compliance rules.", color: "#f87171" },
              { icon: "🔒", title: "Capacity Reservations", text: "Hold On-Demand capacity in an AZ with no term. Add a Savings Plan to get a discount on it.", color: "#f87171" },
              { icon: "📏", title: "Compute Optimizer", text: "Suggests instance types and sizes, EBS volumes and Lambda memory based on real usage.", color: "#a78bfa" },
              { icon: "😴", title: "Hibernation and schedules", text: "Stop dev and test environments outside working hours. Hibernation keeps memory contents for a quick restart.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Cover the steady baseline with Savings Plans or Reserved Instances. Cover predictable peaks with On-Demand or scheduled scaling, and extra capacity that can survive interruption with Spot.",
        "Spot suits stateless, flexible work such as batch jobs, CI builds, big data and containers. Mix instance types and AZs, and save progress regularly on long jobs.",
        "Rightsize before you commit. Compute Optimizer and CloudWatch metrics show which instances are bigger than they need to be.",
        "Serverless options like Lambda and Fargate mean you don't pay for idle capacity on spiky or quiet workloads. Steady, heavy use is often cheaper on EC2 with a commitment.",
        "Test and dev environments don't need production's availability. Use fewer AZs, smaller sizes and shutdown schedules.",
      ],
      tip: "If the work can be interrupted or has flexible start times, use Spot. Steady 24/7 use for 3 years, with freedom to change instance families, calls for a Compute Savings Plan.",
    },
    {
      id: "d4-db-cost",
      task: "4.3",
      title: "Cost-effective databases",
      check: ["d4-22", "d4-23"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🌗", title: "Aurora Serverless v2", text: "Capacity follows the load in small steps. Good for relational work that comes and goes, or can't be predicted.", color: "#38bdf8" },
              { icon: "📈", title: "DynamoDB on-demand", text: "Pay per request, for new, spiky or unpredictable traffic. Switch to provisioned capacity with auto scaling once traffic is steady.", color: "#38bdf8" },
              { icon: "🎟️", title: "Reserved DB instances", text: "Commit for 1 or 3 years to steady RDS, Aurora, ElastiCache or Redshift capacity.", color: "#38bdf8" },
              { icon: "🧊", title: "DynamoDB Standard-IA", text: "A table class with cheaper storage, for tables that are rarely read.", color: "#a78bfa" },
              { icon: "🗃️", title: "Snapshots and retention", text: "Keep only the backups your RPO and compliance rules need. Export old snapshots to S3.", color: "#a78bfa" },
              { icon: "🧠", title: "Cache first", text: "ElastiCache or DAX can be cheaper than scaling the database for read-heavy load.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Choose the database by how it's used and what it costs. DynamoDB suits key-value data at scale, RDS and Aurora suit relational data, and Redshift suits columnar analytics.",
        "**Aurora I/O-Optimized** has no charge per I/O request, which suits busy clusters. **Aurora Standard** is cheaper when I/O is modest.",
        "You can stop a dev or test RDS instance while it's idle. It starts again by itself after 7 days, and you still pay for its storage.",
        "Moving off a commercial engine, for example Oracle to Aurora PostgreSQL with DMS, gets rid of the license costs.",
      ],
      tip: "Unpredictable traffic, lowest cost and no capacity planning point to DynamoDB on-demand or Aurora Serverless v2. Steady, predictable use for years points to reserved capacity.",
    },
    {
      id: "d4-network-cost",
      task: "4.4",
      title: "Network costs: NAT, endpoints, and data transfer",
      check: ["d4-28", "d4-29"],
      visual: (
        <div className="grid gap-6">
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "🆓", label: "Into AWS from the internet", sub: "Free" },
              { icon: "🏠", label: "Same AZ, private IP", sub: "Free" },
              { icon: "↔️", label: "Across AZs", sub: "Charged per GB, each direction" },
              { icon: "🌍", label: "Across Regions", sub: "Charged per GB" },
              { icon: "📤", label: "Out to the internet", sub: "Charged per GB, often less through CloudFront" },
            ]}
          />
          <VpcBuilderLab />
        </div>
      ),
      points: [
        "A NAT gateway charges per hour and per GB it handles. Send S3 and DynamoDB traffic through the free gateway endpoints instead.",
        "One NAT gateway per AZ is resilient and avoids cross-AZ charges. A single shared one is cheaper for non-production, but it's a single point of failure.",
        "A NAT instance can cost less for tiny workloads, but then you handle scaling, patching, failover and the source/destination check yourself.",
        "CloudFront takes load off your origin and cuts data transfer out. Moving data from AWS origins to CloudFront is free.",
        "Direct Connect charges less for data going out than the internet does, while a VPN is cheaper to start. VPC peering has no hourly charge, and Transit Gateway charges per attachment and per GB.",
      ],
      tip: "If NAT gateway costs are high and most of the traffic goes to S3, add an S3 gateway endpoint.",
    },
    {
      id: "d4-cost-tools",
      task: "4.1 · 4.2 · 4.3 · 4.4",
      title: "Cost management tools",
      check: ["d4-34", "d4-35"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "🔎", title: "Cost Explorer", text: "Charts and forecasts of spend, filtered by service, account or tag, plus Savings Plans and RI suggestions.", color: "#34d399" },
              { icon: "🚨", title: "AWS Budgets", text: "Alerts when real or forecast cost or usage passes a limit. Budget actions can apply controls too.", color: "#34d399" },
              { icon: "🧾", title: "Cost and Usage Report", text: "The most detailed line-item billing data, delivered to S3 for analysis with Athena or Amazon Quick.", color: "#34d399" },
              { icon: "🏷️", title: "Cost allocation tags", text: "Activate tags in the Billing console to split costs by team, project, or environment.", color: "#34d399" },
            ]}
          />
          <Flow
            color="#34d399"
            steps={[
              { icon: "🏢", label: "AWS Organizations", sub: "Consolidated billing" },
              { icon: "📊", label: "Combined usage", sub: "Volume pricing tiers count usage from every account" },
              { icon: "🎟️", label: "Shared discounts", sub: "RIs and Savings Plans apply across accounts" },
            ]}
          />
        </div>
      ),
      points: [
        "Each tool answers one question. Cost Explorer: where did the money go, and where is it heading? Budgets: warn me before it's too much. The Cost and Usage Report: show me every line item.",
        "Cost allocation tags only show up in billing tools after you activate them. Tag consistently, and enforce it with tag policies or SCPs.",
        "Consolidated billing gives you one bill, volume discounts on combined usage, and shared Reserved Instance and Savings Plans discounts.",
        "Use the rightsizing suggestions in Compute Optimizer and Cost Explorer to find idle and oversized resources.",
      ],
      tip: "To get an alert when the forecast goes over a set amount, use AWS Budgets. To study spending trends by tag, use Cost Explorer. For detailed hourly line items in S3, use the Cost and Usage Report.",
    },
  ],

  questions: [
    // ── Start here ──
    {
      id: "saa-b4-01",
      domain: "d4",
      lesson: "d4-start-lights-on",
      level: "beginner",
      prompt: "A test server runs all night and all weekend, but nobody uses it then. What happens to the bill?",
      options: ["It keeps growing, because running servers cost money even when idle", "It stays at zero while nobody is using it", "AWS refunds the idle hours automatically", "The server gets cheaper the longer it runs, so idle time doesn't add much"],
      answer: [0],
      explanation: "You pay for what you leave running, like leaving the lights on in an empty house. Switching test servers off outside working hours is an easy saving.",
    },
    {
      id: "saa-b4-02",
      domain: "d4",
      lesson: "d4-start-lights-on",
      level: "beginner",
      prompt: "What does rightsizing mean?",
      options: ["Choosing a server size that fits the real workload", "Always buying the largest server available", "Moving everything to a different Region", "Renaming servers so they're easier to find"],
      answer: [0],
      explanation: "Rightsizing means matching the size to the job. A server much bigger than needed costs more and gives you nothing extra.",
    },
    {
      id: "saa-b4-03",
      domain: "d4",
      lesson: "d4-start-hot-and-cold",
      level: "beginner",
      prompt: "A company must keep old records for years but almost never reads them. Which kind of S3 storage class fits?",
      options: ["A cold archive class, such as S3 Glacier Deep Archive", "S3 Standard, for data that's read all the time", "An EC2 instance store", "An in-memory cache"],
      answer: [0],
      explanation: "Archive classes are the attic of S3: very cheap to keep things in, but slower to get them back. That's a good trade for records nobody reads.",
    },
    {
      id: "saa-b4-04",
      domain: "d4",
      lesson: "d4-start-hot-and-cold",
      level: "beginner",
      prompt: "Which S3 storage class suits photos that a busy app shows to users all day?",
      options: ["S3 Standard", "S3 Glacier Deep Archive", "S3 Glacier Flexible Retrieval", "A tape library"],
      answer: [0],
      explanation: "S3 Standard is for hot data you read all the time. It costs a bit more to store, but there's no fee to read and no waiting.",
    },
    {
      id: "saa-b4-05",
      domain: "d4",
      lesson: "d4-start-pay-less",
      level: "beginner",
      prompt: "A company will run the same servers all day, every day, for the next three years. How can it pay less than full price?",
      options: ["Commit with a Savings Plan or Reserved Instances", "Use On-Demand pricing", "Turn the servers off at random times each day", "Use a bigger instance"],
      answer: [0],
      explanation: "Savings Plans and Reserved Instances give a big discount in return for a 1- or 3-year commitment. It's like buying a yearly gym membership instead of paying per visit.",
    },
    {
      id: "saa-b4-06",
      domain: "d4",
      lesson: "d4-start-pay-less",
      level: "beginner",
      prompt: "What's the catch with Spot Instances?",
      options: ["AWS can take them back with a 2-minute warning", "They cost more than On-Demand", "They only run for one hour a day", "They can't connect to the internet at all"],
      answer: [0],
      explanation: "Spot Instances are spare capacity at up to 90% off, a bit like standby airline seats. Because AWS can reclaim them, use them only for work that can stop and pick up again.",
    },
    // ── S3 tiers ──
    {
      id: "d4-01",
      domain: "d4",
      lesson: "d4-s3-tiers",
      prompt:
        "A company stores medical images that are rarely accessed, about once a quarter, but when a doctor requests one it must be available in milliseconds. The images must be stored across multiple Availability Zones. Which storage class is MOST cost-effective?",
      options: ["S3 Glacier Instant Retrieval", "S3 Standard", "S3 Glacier Flexible Retrieval", "S3 One Zone-IA"],
      answer: [0],
      explanation: "Glacier Instant Retrieval gives millisecond access at a much lower storage price than Standard or Standard-IA, for data read about once a quarter. Flexible Retrieval needs a restore first, and One Zone-IA keeps data in a single AZ.",
    },
    {
      id: "d4-02",
      domain: "d4",
      lesson: "d4-s3-tiers",
      prompt:
        "A data lake holds objects whose access patterns are unknown and change over time. The company wants to optimize storage costs automatically without retrieval fees or operational effort. Which storage class should it use?",
      options: ["S3 Intelligent-Tiering", "S3 Standard-IA", "S3 One Zone-IA", "S3 Glacier Deep Archive"],
      answer: [0],
      explanation: "Intelligent-Tiering monitors access and moves objects between tiers automatically, with no retrieval fees, for a small per-object monitoring fee.",
    },
    {
      id: "d4-03",
      domain: "d4",
      lesson: "d4-s3-tiers",
      prompt:
        "Application logs in S3 are queried often for 30 days, occasionally for the next 60 days, and must then be kept for 7 years for compliance, with retrieval within 48 hours acceptable. Which TWO lifecycle actions minimize cost? (Choose two.)",
      options: [
        "Transition objects to S3 Standard-IA after 30 days",
        "Transition objects to S3 Glacier Deep Archive after 90 days",
        "Keep everything in S3 Standard for 7 years",
        "Transition objects to S3 One Zone-IA on day 1",
        "Delete the objects after 90 days",
      ],
      answer: [0, 1],
      explanation: "Standard-IA fits the occasional-access phase, and Deep Archive is the cheapest class for long-term retention with retrieval within 12–48 hours. Deleting would break compliance.",
    },
    {
      id: "d4-04",
      domain: "d4",
      lesson: "d4-s3-tiers",
      prompt:
        "A company stores thumbnails that can be regenerated from the original images at any time. They're accessed infrequently but must load instantly. Which storage class is MOST cost-effective for the thumbnails?",
      options: ["S3 One Zone-IA", "S3 Standard", "S3 Glacier Deep Archive", "S3 Glacier Flexible Retrieval"],
      answer: [0],
      explanation: "One Zone-IA is cheaper than Standard-IA because it keeps data in one AZ. That risk is acceptable for re-creatable data, and access is still in milliseconds.",
    },
    {
      id: "d4-05",
      domain: "d4",
      lesson: "d4-s3-tiers",
      prompt:
        "A team moved temporary files that are deleted after 10 days into S3 Standard-IA to save money, but the bill went up. What is the MOST likely reason?",
      options: [
        "Standard-IA charges for a minimum of 30 days of storage per object, plus retrieval fees",
        "Standard-IA charges more per GB than S3 Standard",
        "Standard-IA requires versioning",
        "Standard-IA stores three full copies of each object in every Region you use",
      ],
      answer: [0],
      explanation: "Objects deleted before 30 days in Standard-IA are still billed for 30 days. Short-lived data belongs in S3 Standard.",
    },
    {
      id: "d4-06",
      domain: "d4",
      lesson: "d4-s3-tiers",
      prompt:
        "A research institute shares a 500 TB public data set in S3. It wants the users who download the data, not the institute, to pay for the requests and data transfer. What should it enable?",
      options: ["S3 Requester Pays on the bucket", "S3 Transfer Acceleration on", "CloudFront signed URLs", "S3 Intelligent-Tiering"],
      answer: [0],
      explanation: "With Requester Pays, the AWS account making the requests pays for them and for the downloads. The bucket owner still pays for storage.",
    },
    {
      id: "d4-07",
      domain: "d4",
      lesson: "d4-s3-tiers",
      prompt:
        "A versioned S3 bucket's storage cost keeps growing even though the current data size is stable. Uploads of large files sometimes fail midway. Which action reduces cost with the least effort?",
      options: [
        "Add lifecycle rules to expire noncurrent versions after a set period and abort incomplete multipart uploads",
        "Disable encryption",
        "Move the bucket to another Region with lower storage prices, and turn off versioning so older object copies are no longer kept",
        "Turn off S3 Block Public Access",
      ],
      answer: [0],
      explanation: "Old versions and abandoned multipart upload parts are billed as storage. Lifecycle rules can remove both automatically.",
    },
    {
      id: "d4-08",
      domain: "d4",
      lesson: "d4-s3-tiers",
      type: "order",
      prompt: "Order these S3 storage classes from the highest storage price per GB to the lowest.",
      items: ["S3 Standard", "S3 Standard-IA", "S3 Glacier Instant Retrieval", "S3 Glacier Deep Archive"],
      explanation: "Storage gets cheaper as you move toward archive classes, while retrieval fees, minimum durations, and (for Deep Archive) restore times go up.",
    },

    // ── Storage cost ──
    {
      id: "d4-09",
      domain: "d4",
      lesson: "d4-storage-cost",
      prompt:
        "A company has hundreds of gp2 EBS volumes sized large only to get more IOPS. It wants to cut costs without reducing performance. What should it do?",
      options: [
        "Migrate the volumes to gp3 and provision the needed IOPS and throughput independently of size",
        "Move the data to sc1 volumes",
        "Convert the volumes to instance store",
        "Take snapshots of the volumes, delete them, and restore larger gp2 volumes so their baseline IOPS rise with the size",
      ],
      answer: [0],
      explanation: "gp3 is cheaper per GB than gp2 and decouples performance from size, so oversized volumes can shrink or keep their size at lower cost. Elastic Volumes changes the type without downtime.",
    },
    {
      id: "d4-10",
      domain: "d4",
      lesson: "d4-storage-cost",
      prompt:
        "A company must move 400 TB from its data center to S3 within three weeks. Its internet connection is 100 Mbps and is already heavily used. What is the MOST cost-effective approach?",
      options: [
        "Use AWS Snow Family devices to ship the data offline",
        "Upload over the internet with multipart upload",
        "Order a 10 Gbps Direct Connect connection",
        "Use S3 Transfer Acceleration",
      ],
      answer: [0],
      explanation: "At 100 Mbps, 400 TB would take about a year. Snow devices move it offline in days, without long-term network commitments.",
    },
    {
      id: "d4-11",
      domain: "d4",
      lesson: "d4-storage-cost",
      prompt:
        "An EFS file system holds 50 TB of project files. Most files aren't read after the first month, but users occasionally need old ones quickly. Which TWO actions lower cost with little operational effort? (Choose two.)",
      options: [
        "Enable EFS lifecycle management to move files not accessed for 30 days to EFS Infrequent Access",
        "Use Elastic throughput so you don't pay for idle provisioned throughput",
        "Copy the files to EBS volumes on each instance",
        "Move all files to instance store",
        "Provision maximum throughput permanently",
      ],
      answer: [0, 1],
      explanation: "Lifecycle management tiers cold files automatically, and Elastic throughput bills for the throughput actually used.",
    },
    {
      id: "d4-12",
      domain: "d4",
      lesson: "d4-storage-cost",
      prompt:
        "A company backs up on-premises servers to physical tapes that are shipped offsite. It wants to keep its existing backup software but eliminate tape handling and reduce costs. What should the architect recommend?",
      options: ["AWS Storage Gateway Tape Gateway with virtual tapes archived to S3 Glacier storage classes", "AWS DataSync to EFS", "Amazon FSx for Lustre", "An S3 File Gateway with S3 Standard storage, and the backup software writing files to it over NFS"],
      answer: [0],
      explanation: "Tape Gateway presents a virtual tape library to existing backup software and stores the tapes in S3, archiving them to Glacier classes.",
    },
    {
      id: "d4-13",
      domain: "d4",
      lesson: "d4-storage-cost",
      prompt:
        "A cost review finds many EBS volumes in the available state (not attached to any instance) and years of daily snapshots no one needs. Which action addresses this MOST directly?",
      options: [
        "Snapshot and delete unneeded unattached volumes, and set backup retention rules (for example with AWS Backup) to expire old snapshots",
        "Convert all volumes to io2",
        "Move snapshots to another Region",
        "Enable EBS encryption by default on the account, then copy every unattached volume to a new encrypted snapshot and keep all of those copies",
      ],
      answer: [0],
      explanation: "Unattached volumes and unneeded snapshots are pure waste. Retention policies stop them piling up again.",
    },
    {
      id: "d4-14",
      domain: "d4",
      lesson: "d4-storage-cost",
      prompt:
        "An IoT application uploads millions of 2 KB sensor files to S3 every hour, and request charges dominate the bill. What design change reduces cost the MOST?",
      options: [
        "Batch readings into larger objects before upload (for example with Amazon Data Firehose buffering)",
        "Move the bucket to S3 Standard-IA so each small reading costs less to store, and keep uploading every reading as its own object",
        "Enable S3 Versioning",
        "Use S3 Transfer Acceleration",
      ],
      answer: [0],
      explanation: "S3 charges per request, so fewer, larger objects cost less. Moving tiny objects to IA classes makes it worse (minimum billable object size and retrieval fees).",
    },

    // ── Compute cost ──
    {
      id: "d4-15",
      domain: "d4",
      lesson: "d4-compute-cost",
      prompt:
        "A company runs nightly batch jobs that can be interrupted and restarted from checkpoints, and they have flexible completion times. Which EC2 purchasing option is MOST cost-effective?",
      options: ["Spot Instances", "On-Demand Instances", "Dedicated Hosts", "Reserved Instances for 3 years"],
      answer: [0],
      explanation: "Spot offers the largest discount for fault-tolerant, flexible workloads. Checkpointing limits lost work when an instance is reclaimed.",
    },
    {
      id: "d4-16",
      domain: "d4",
      lesson: "d4-compute-cost",
      prompt:
        "A company runs a steady baseline of compute 24/7 and expects to move some workloads from EC2 to Fargate and Lambda and to change instance families over the next three years. Which option gives a large discount while allowing this flexibility?",
      options: ["Compute Savings Plans", "EC2 Instance Savings Plans", "Standard Reserved Instances for one instance family", "Spot Instances"],
      answer: [0],
      explanation: "Compute Savings Plans apply across EC2 instance families, Regions, and operating systems, and also to Fargate and Lambda. EC2 Instance Savings Plans and Standard RIs are tied to an instance family.",
    },
    {
      id: "d4-17",
      domain: "d4",
      lesson: "d4-compute-cost",
      prompt:
        "A web application has a steady baseline of 10 instances all day and unpredictable spikes up to 40 instances. The spikes must not be interrupted. Which TWO purchasing choices minimize cost? (Choose two.)",
      options: [
        "Cover the 10-instance baseline with a Savings Plan or Reserved Instances",
        "Use On-Demand Instances for the spike capacity",
        "Use Spot Instances for the whole fleet",
        "Buy Reserved Instances for 40 instances",
        "Use Dedicated Hosts for the spikes",
      ],
      answer: [0, 1],
      explanation: "Commit only to what you use all the time, and pay On-Demand for short, uninterruptible spikes. Spot can be reclaimed, and committing to the peak wastes money most of the day.",
    },
    {
      id: "d4-18",
      domain: "d4",
      lesson: "d4-compute-cost",
      prompt:
        "A company must bring its existing per-socket software licenses to AWS and needs visibility into the physical cores and sockets its instances run on. Which option should it use?",
      options: ["EC2 Dedicated Hosts", "Dedicated Instances", "Spot Instances", "Compute Savings Plans on shared tenancy"],
      answer: [0],
      explanation: "Dedicated Hosts give you a whole physical server with visibility of sockets and cores, which bring-your-own-license terms often require.",
    },
    {
      id: "d4-19",
      domain: "d4",
      lesson: "d4-compute-cost",
      prompt:
        "CloudWatch shows that a fleet of m5.4xlarge instances averages 8% CPU and 15% memory utilization. What should the architect do FIRST to reduce cost?",
      options: [
        "Rightsize to smaller instances based on AWS Compute Optimizer recommendations",
        "Buy 3-year Reserved Instances for the current size so every instance costs less per hour",
        "Move to a larger instance family",
        "Add more instances to spread the load",
      ],
      answer: [0],
      explanation: "Rightsize before you commit. Otherwise you lock in a discount on capacity you don't need.",
    },
    {
      id: "d4-20",
      domain: "d4",
      lesson: "d4-compute-cost",
      prompt:
        "Development environments on EC2 are used only during business hours on weekdays. Which change gives the biggest saving with little effort?",
      options: [
        "Stop the instances outside business hours on a schedule (for example with EventBridge Scheduler and Systems Manager)",
        "Buy 3-year Reserved Instances for the development instances, so they cost less for every hour they run, nights and weekends included",
        "Move development to Dedicated Hosts",
        "Run development in three AZs",
      ],
      answer: [0],
      explanation: "Stopped instances don't accrue compute charges (EBS storage still does). Running only about 50 hours a week instead of 168 cuts compute cost by roughly two thirds.",
    },
    {
      id: "d4-21",
      domain: "d4",
      lesson: "d4-compute-cost",
      type: "match",
      prompt: "Match each workload to the most cost-effective EC2 purchasing option.",
      pairs: [
        ["Fault-tolerant batch jobs with flexible timing", "Spot Instances"],
        ["Steady 24/7 usage for 3 years across changing instance families", "Compute Savings Plans"],
        ["Short, unpredictable, uninterruptible workloads", "On-Demand Instances"],
        ["Bring-your-own per-socket licenses", "Dedicated Hosts"],
      ],
      explanation: "Work that can be interrupted goes on Spot, and steady work gets a commitment. Unpredictable work stays On-Demand, and licensing or compliance rules about physical servers call for Dedicated Hosts.",
    },

    // ── Database cost ──
    {
      id: "d4-22",
      domain: "d4",
      lesson: "d4-db-cost",
      prompt:
        "A new application's DynamoDB traffic is unpredictable, with long idle periods and sudden spikes. The team doesn't want to plan capacity. Which capacity mode is MOST cost-effective?",
      options: ["On-demand capacity mode", "Provisioned capacity sized for the peak", "Provisioned capacity with reserved capacity for 3 years", "DynamoDB Accelerator in front of a provisioned table"],
      answer: [0],
      explanation: "On-demand charges per request and needs no capacity planning, which suits unknown or spiky traffic. Provisioning for the peak pays for idle capacity.",
    },
    {
      id: "d4-23",
      domain: "d4",
      lesson: "d4-db-cost",
      prompt:
        "A relational database for an internal tool is busy for a few hours a day and almost idle the rest of the time. The company wants MySQL compatibility and to minimize cost without managing capacity. What should it use?",
      options: ["Amazon Aurora Serverless v2", "A provisioned RDS instance sized for the peak", "Amazon Redshift", "Amazon DynamoDB"],
      answer: [0],
      explanation: "Aurora Serverless v2 scales capacity with load, so the company pays for far less capacity during quiet hours.",
    },
    {
      id: "d4-24",
      domain: "d4",
      lesson: "d4-db-cost",
      prompt:
        "A company runs a large Oracle database on EC2 with expensive licenses. Usage is steady and predictable. Which TWO actions would MOST reduce its long-term database costs? (Choose two.)",
      options: [
        "Migrate to Amazon Aurora PostgreSQL using schema conversion and AWS DMS",
        "Purchase reserved DB instances for the steady Aurora capacity",
        "Move the database to larger EC2 instances",
        "Enable Multi-AZ on the EC2 instance",
        "Switch to DynamoDB on-demand without changing the application",
      ],
      answer: [0, 1],
      explanation: "Moving to an open-source-compatible engine removes license costs, and reserved instances discount steady capacity.",
    },
    {
      id: "d4-25",
      domain: "d4",
      lesson: "d4-db-cost",
      prompt:
        "A read-heavy application scaled its RDS instance to the largest class to handle repeated identical queries. What is usually a more cost-effective approach?",
      options: [
        "Add an ElastiCache layer for the repeated queries and scale the instance back down",
        "Buy reserved capacity for the largest instance class so the bigger size costs less each month",
        "Enable Multi-AZ",
        "Use Provisioned IOPS storage",
      ],
      answer: [0],
      explanation: "Caching repeated reads is often far cheaper than buying database capacity to serve them.",
    },
    {
      id: "d4-26",
      domain: "d4",
      lesson: "d4-db-cost",
      prompt:
        "An Aurora cluster's bill is dominated by I/O charges because the workload is very I/O-intensive. Which change can reduce cost without changing the application?",
      options: ["Switch the cluster to the Aurora I/O-Optimized configuration", "Switch the cluster to Aurora Standard with larger DB instances", "Add more Aurora Replicas", "Enable backtracking"],
      answer: [0],
      explanation: "Aurora I/O-Optimized removes per-I/O charges in exchange for higher instance and storage prices, which pays off for I/O-heavy workloads.",
    },
    {
      id: "d4-27",
      domain: "d4",
      lesson: "d4-db-cost",
      prompt:
        "A team keeps 365 days of automated RDS backups and also takes manual snapshots every day, but its requirement is a 7-day point-in-time recovery window plus monthly archives kept for one year. What should the architect recommend?",
      options: [
        "Set automated backup retention to 7 days and keep one snapshot per month (for example with an AWS Backup plan)",
        "Keep everything as it is",
        "Disable backups entirely",
        "Copy every daily snapshot to another Region and keep all of them indefinitely, so any point in time can be restored on request",
      ],
      answer: [0],
      explanation: "Match backup retention to the actual RPO and compliance requirements. Extra snapshots cost storage without adding value.",
    },

    // ── Network cost ──
    {
      id: "d4-28",
      domain: "d4",
      lesson: "d4-network-cost",
      prompt:
        "EC2 instances in private subnets process terabytes of data from Amazon S3 each day through a NAT gateway, and NAT gateway data-processing charges are high. What is the MOST cost-effective change?",
      options: [
        "Add an S3 gateway VPC endpoint to the private subnets' route tables",
        "Replace the NAT gateway with a larger NAT gateway",
        "Add a second NAT gateway in the same AZ",
        "Move the instances to public subnets and give them public IPs",
      ],
      answer: [0],
      explanation: "Gateway endpoints carry S3 traffic privately at no additional charge, removing it from the NAT gateway's per-GB processing.",
    },
    {
      id: "d4-29",
      domain: "d4",
      lesson: "d4-network-cost",
      prompt:
        "A non-production VPC has private subnets in three AZs, each with its own NAT gateway. Traffic is light and brief outages are acceptable. How can the company reduce cost?",
      options: [
        "Use a single NAT gateway shared by all private subnets",
        "Add a NAT gateway per subnet",
        "Replace the NAT gateways with internet gateways",
        "Add Direct Connect",
      ],
      answer: [0],
      explanation: "One shared NAT gateway removes two hourly charges. It's a single point of failure and adds cross-AZ data charges, which is acceptable for non-production.",
    },
    {
      id: "d4-30",
      domain: "d4",
      lesson: "d4-network-cost",
      prompt:
        "A company serves large media files to global users directly from EC2 instances, and data transfer out is its largest cost. Which TWO actions reduce cost? (Choose two.)",
      options: [
        "Serve the files through Amazon CloudFront",
        "Store the files in Amazon S3 as the CloudFront origin instead of on EC2",
        "Add more EC2 instances in the same Region",
        "Use a Network Load Balancer",
        "Enable cross-zone load balancing",
      ],
      answer: [0, 1],
      explanation: "CloudFront caches files at the edge, which cuts traffic to the origin and often the price per GB. Moving data from AWS origins to CloudFront is free. S3 is cheaper than EC2 for storing and serving static files.",
    },
    {
      id: "d4-31",
      domain: "d4",
      lesson: "d4-network-cost",
      prompt:
        "Two application tiers exchange large volumes of data. The web tier is in AZ-a and the database replica it reads from is in AZ-b, generating significant cross-AZ data charges. What should the architect consider?",
      options: [
        "Read from a replica in the same AZ as the instances, while keeping Multi-AZ for failover",
        "Move the database to another Region",
        "Use public IP addresses for the traffic between the instances and the database so it skips the AZ charges",
        "Add a NAT gateway between the tiers",
      ],
      answer: [0],
      explanation: "Traffic within an AZ over private IPs is free, while cross-AZ traffic is charged in each direction. Keep chatty components in the same AZ without giving up a multi-AZ design.",
    },
    {
      id: "d4-32",
      domain: "d4",
      lesson: "d4-network-cost",
      prompt:
        "A small branch office needs a connection to a VPC for occasional administrative traffic. The company wants the lowest cost and the connection up today. What should it use?",
      options: ["AWS Site-to-Site VPN", "A dedicated 10 Gbps Direct Connect connection", "AWS Transit Gateway with Direct Connect", "Amazon CloudFront"],
      answer: [0],
      explanation: "A VPN uses the existing internet connection, costs little, and is quick to set up. Direct Connect suits high, steady volumes and takes time to provision.",
    },
    {
      id: "d4-33",
      domain: "d4",
      lesson: "d4-network-cost",
      type: "match",
      prompt: "Match each data path to how AWS typically charges for it.",
      pairs: [
        ["Internet → EC2 (data in)", "Free"],
        ["EC2 → EC2 in another AZ", "Charged per GB in each direction"],
        ["Private subnet → S3 via a gateway endpoint", "No endpoint charge"],
        ["Private subnet → S3 via a NAT gateway", "NAT hourly plus per-GB processing"],
      ],
      explanation: "Keep traffic in the same AZ, use gateway endpoints for S3 and DynamoDB, and avoid sending AWS service traffic through NAT.",
    },

    // ── Cost tools ──
    {
      id: "d4-34",
      domain: "d4",
      lesson: "d4-cost-tools",
      prompt:
        "A finance team wants an email alert when the forecast monthly spend for a project is expected to exceed $10,000. Which service should the architect use?",
      options: ["AWS Budgets", "AWS Cost Explorer", "AWS Cost and Usage Report", "AWS Config"],
      answer: [0],
      explanation: "Budgets sends alerts on actual or forecast cost and usage against a threshold, and budget actions can apply controls automatically.",
    },
    {
      id: "d4-35",
      domain: "d4",
      lesson: "d4-cost-tools",
      prompt:
        "A company wants to see monthly costs broken down by team and project across all its accounts. Resources are already tagged with Team and Project. Which step is required to show these tags in the billing tools?",
      options: [
        "Activate Team and Project as cost allocation tags in the Billing and Cost Management console",
        "Create an AWS Budget for each Team and Project tag value, and read the spend for each one from the budget alerts every month",
        "Enable AWS Config",
        "Turn on CloudTrail data events",
      ],
      answer: [0],
      explanation: "User-defined tags only appear in Cost Explorer and the Cost and Usage Report after they're activated as cost allocation tags in the management (payer) account.",
    },
    {
      id: "d4-36",
      domain: "d4",
      lesson: "d4-cost-tools",
      prompt:
        "A company has 12 accounts with separate bills. Which TWO benefits does it gain by joining them in AWS Organizations with consolidated billing? (Choose two.)",
      options: [
        "Usage is combined across accounts for volume pricing tiers",
        "Reserved Instance and Savings Plans discounts can be shared across accounts",
        "All accounts get free Shield Advanced",
        "Data transfer between accounts becomes free",
        "Each account's root user is deleted",
      ],
      answer: [0, 1],
      explanation: "Consolidated billing produces one bill, aggregates usage for tiered pricing, and shares commitment discounts across the organization by default.",
    },
    {
      id: "d4-37",
      domain: "d4",
      lesson: "d4-cost-tools",
      prompt:
        "A data team needs the most granular billing data, with hourly line items and resource IDs, delivered to S3 so it can query it with Athena. What should be configured?",
      options: ["AWS Cost and Usage Report", "AWS Budgets", "AWS Cost Explorer graphs", "AWS Trusted Advisor"],
      answer: [0],
      explanation: "The Cost and Usage Report delivers detailed line-item data to S3, ready to query with Athena or visualize with Amazon Quick.",
    },
    {
      id: "d4-38",
      domain: "d4",
      lesson: "d4-cost-tools",
      type: "match",
      prompt: "Match each cost question to the tool that answers it.",
      pairs: [
        ["Where did spend grow last quarter, by service?", "AWS Cost Explorer"],
        ["Warn me before we pass this month's limit", "AWS Budgets"],
        ["Give me every hourly line item in S3", "AWS Cost and Usage Report"],
        ["Which instances are oversized for their workload?", "AWS Compute Optimizer"],
      ],
      explanation: "Four tools, four jobs: one to explore spending, one to alert, one to export every line item, and one to suggest better sizes.",
    },
  ],

  cards: [
    { id: "s-s3", domain: "d4", kind: "service", term: "Amazon S3", definition: "Object storage with storage classes, lifecycle rules, and replication" },
    { id: "s-glacier", domain: "d4", kind: "service", term: "Amazon S3 Glacier storage classes", definition: "The archive classes: Instant Retrieval, Flexible Retrieval and Deep Archive, from quickest to cheapest." },
    { id: "s-backup", domain: "d4", kind: "service", term: "AWS Backup", definition: "Backup plans and retention rules in one place, with copies to other Regions and accounts." },
    { id: "s-costexplorer", domain: "d4", kind: "service", term: "AWS Cost Explorer", definition: "Charts, filters and forecasts of your AWS spend, plus suggestions for what to commit to." },
    { id: "s-budgets", domain: "d4", kind: "service", term: "AWS Budgets", definition: "Alerts and actions when cost or usage crosses a threshold" },
    { id: "s-cur", domain: "d4", kind: "service", term: "AWS Cost and Usage Report", definition: "Most detailed line-item billing data delivered to S3" },
    { id: "s-savingsplans", domain: "d4", kind: "service", term: "Savings Plans", definition: "A discount for promising to spend a set amount per hour on compute for 1 or 3 years." },
    { id: "s-computeoptimizer", domain: "d4", kind: "service", term: "AWS Compute Optimizer", definition: "Rightsizing recommendations for EC2, EBS, Lambda, and more" },
    { id: "s-outposts", domain: "d4", kind: "service", term: "AWS Outposts", definition: "AWS infrastructure and services running in your own data center" },
    { id: "s-wavelength", domain: "d4", kind: "service", term: "AWS Wavelength", definition: "AWS compute at the edge of 5G networks for ultra-low latency" },
    { id: "c-intelligent", domain: "d4", kind: "concept", term: "S3 Intelligent-Tiering", definition: "Moves objects between tiers by itself as their use changes, with no fee to read them." },
    { id: "c-mindays", domain: "d4", kind: "concept", term: "Minimum storage duration", definition: "The least time you're billed for: 30 days for the IA classes, 90 for Glacier Instant and Flexible Retrieval, and 180 for Deep Archive." },
    { id: "c-lifecycle", domain: "d4", kind: "concept", term: "S3 Lifecycle rule", definition: "Transitions objects to cheaper classes and expires them on a schedule" },
    { id: "c-requesterpays", domain: "d4", kind: "concept", term: "Requester Pays", definition: "A bucket setting where whoever downloads the data pays the request and transfer costs." },
    { id: "c-spot", domain: "d4", kind: "concept", term: "Spot Instances", definition: "Spare capacity at up to 90% off. AWS can take it back with 2 minutes' notice." },
    { id: "c-ri", domain: "d4", kind: "concept", term: "Reserved Instances", definition: "A discount for committing to particular instance attributes for 1 or 3 years." },
    { id: "c-dedicatedhost", domain: "d4", kind: "concept", term: "Dedicated Host", definition: "A whole physical server just for you. Supports licenses counted per socket or core." },
    { id: "c-ondemand-ddb", domain: "d4", kind: "concept", term: "DynamoDB on-demand", definition: "You pay for each request and don't plan capacity at all." },
    { id: "c-natcost", domain: "d4", kind: "concept", term: "NAT gateway pricing", definition: "An hourly charge, plus a charge for every GB it handles." },
    { id: "c-crossaz", domain: "d4", kind: "concept", term: "Cross-AZ data transfer", definition: "Charged per GB in each direction. Private traffic within one AZ is free." },
    { id: "c-costtags", domain: "d4", kind: "concept", term: "Cost allocation tags", definition: "Tags you activate in Billing so costs can be grouped by team or project." },
    { id: "c-consolidated", domain: "d4", kind: "concept", term: "Consolidated billing", definition: "One bill for all accounts, volume pricing on combined usage, and shared RI and Savings Plans discounts." },
  ],

  challenges: [
    {
      id: "ch-s3-classes",
      domain: "d4",
      lesson: "d4-s3-tiers",
      title: "Cheapest class that still works",
      goal: "For five of the workloads, pick the cheapest S3 storage class that meets every requirement.",
      hint: "Rule out classes that are too slow, single-AZ when that isn't allowed, or that guess an unknown access pattern. Then compare cost, remembering minimum storage durations.",
      takeaway: "Storage price, retrieval fees, minimum durations, retrieval time, and AZ resilience together decide the class. Intelligent-Tiering wins when the pattern is unknown.",
      render: (onSolved) => <S3ClassLab goal="five" onSolved={onSolved} />,
    },
    {
      id: "ch-vpc-endpoint",
      domain: "d4",
      lesson: "d4-network-cost",
      title: "S3 without the internet",
      goal: "Make the app instance reach Amazon S3 with no internet path at all: no NAT, no internet route, not reachable from outside.",
      hint: "S3 has a free endpoint type that's just a route-table entry.",
      takeaway: "An S3 gateway endpoint gives private subnets S3 access with no NAT gateway and no endpoint charge.",
      render: (onSolved) => <VpcBuilderLab goal="endpoint" onSolved={onSolved} />,
    },
  ],
});
