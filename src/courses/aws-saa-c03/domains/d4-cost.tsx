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
    summary: "S3 storage classes and lifecycles, right-sized block and file storage, purchasing options and rightsizing, cost-effective databases, data-transfer-aware networks, and cost tools.",
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
      id: "d4-s3-tiers",
      task: "4.1",
      title: "S3 storage classes and lifecycle rules",
      check: ["d4-01", "d4-02"],
      visual: (
        <div className="grid gap-6">
          <Ladder
            rungs={[
              { icon: "🕳️", name: "Glacier Deep Archive", text: "Lowest storage cost; restores within 12–48 hours; 180-day minimum." },
              { icon: "🏔️", name: "Glacier Flexible Retrieval", text: "Restores in minutes (expedited) to hours; 90-day minimum." },
              { icon: "⚡", name: "Glacier Instant Retrieval", text: "Millisecond access for data read about once a quarter; 90-day minimum." },
              { icon: "1️⃣", name: "One Zone-IA", text: "Infrequent, re-creatable data in a single AZ; 30-day minimum." },
              { icon: "🧊", name: "Standard-IA", text: "Infrequent but instant access, multi-AZ; 30-day minimum; per-GB retrieval fee." },
              { icon: "🪣", name: "Standard", text: "Frequent access, no retrieval fee, no minimum duration." },
            ]}
          />
          <S3ClassLab />
        </div>
      ),
      points: [
        "Infrequent-access and Glacier classes trade lower storage prices for retrieval fees and minimum storage durations: delete early and you still pay for the minimum.",
        "S3 Intelligent-Tiering moves objects between access tiers automatically, with no retrieval fees, for a small monitoring charge per object. Use it when access patterns are unknown or change.",
        "Lifecycle rules transition objects as they age (for example Standard → Standard-IA after 30 days → Glacier Deep Archive after a year) and expire them when no longer needed.",
        "Lifecycle rules can also expire noncurrent versions and abort incomplete multipart uploads, which quietly add cost.",
        "Requester Pays makes the requester pay for requests and data transfer when you share large data sets.",
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
              { icon: "💽", title: "gp2 → gp3", text: "gp3 costs less per GB than gp2 and includes a 3,000 IOPS baseline at any size.", color: "#a78bfa" },
              { icon: "🐢", title: "st1 and sc1", text: "HDD volumes for throughput-heavy or cold data at a fraction of SSD prices.", color: "#a78bfa" },
              { icon: "🧹", title: "Clean up", text: "Delete unattached EBS volumes and old snapshots; snapshots are incremental but add up.", color: "#a78bfa" },
              { icon: "📂", title: "EFS lifecycle", text: "Move files not read for a while to EFS Infrequent Access or Archive automatically.", color: "#a78bfa" },
            ]}
          />
          <Layers
            layers={[
              { name: "Move data into AWS", color: "#34d399", items: ["Internet upload: data in is free", "DataSync: online, scheduled, verified", "Snow Family: offline when the link is too slow", "Transfer Family: partners on SFTP"] },
              { name: "Keep it safe for less", color: "#38bdf8", items: ["AWS Backup lifecycle to cold storage", "Snapshot schedules sized to RPO", "Tape Gateway instead of physical tapes"] },
            ]}
          />
        </div>
      ),
      points: [
        "Right-size storage: pay for what you need now and let it grow (EFS and S3 grow automatically; RDS storage auto scaling and EBS Elastic Volumes resize on demand).",
        "Data transfer into AWS from the internet is free; the cost question is time. If uploading would take weeks, ship a Snow device.",
        "Batch many small files into larger objects before uploading to S3 to cut per-request charges and per-object overhead.",
        "Replace on-premises tape libraries with Tape Gateway backed by S3 Glacier storage classes.",
      ],
      tip: "\"Hundreds of terabytes, slow internet link, deadline in two weeks\" → Snow Family. \"Ongoing, scheduled sync over the network\" → DataSync.",
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
              { icon: "🕐", title: "On-Demand", text: "No commitment, pay per second or hour. Short, unpredictable, or uninterruptible workloads.", color: "#38bdf8" },
              { icon: "📅", title: "Savings Plans", text: "Commit to $/hour for 1 or 3 years. Compute Savings Plans cover EC2, Fargate, and Lambda in any Region, family, or OS.", color: "#34d399" },
              { icon: "🎟️", title: "Reserved Instances", text: "1- or 3-year commitment for specific instance attributes; Convertible RIs can be exchanged.", color: "#34d399" },
              { icon: "🎲", title: "Spot Instances", text: "Spare capacity at a deep discount (up to 90%); can be reclaimed with a 2-minute warning.", color: "#f59e0b" },
              { icon: "🏢", title: "Dedicated Hosts", text: "A whole physical server for you: bring per-socket or per-core licenses, meet compliance.", color: "#f87171" },
              { icon: "🔒", title: "Capacity Reservations", text: "Reserve On-Demand capacity in an AZ with no term; combine with Savings Plans for a discount.", color: "#f87171" },
              { icon: "📏", title: "Compute Optimizer", text: "Recommends instance types and sizes, EBS volumes, and Lambda memory from actual usage.", color: "#a78bfa" },
              { icon: "😴", title: "Hibernation and schedules", text: "Stop dev and test environments outside working hours; hibernation keeps RAM for fast resume.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Cover the steady baseline with Savings Plans or Reserved Instances, the predictable peaks with On-Demand or scheduled scaling, and fault-tolerant extra capacity with Spot.",
        "Spot suits stateless, flexible work: batch jobs, CI, big data, containers. Diversify instance types and AZs, and checkpoint long jobs.",
        "Rightsize before you commit: Compute Optimizer and CloudWatch metrics show over-provisioned instances.",
        "Serverless (Lambda, Fargate) avoids paying for idle capacity on spiky or low-traffic workloads; steady high utilization is often cheaper on EC2 with a commitment.",
        "Non-production doesn't need production's availability: fewer AZs, smaller sizes, and shutdown schedules.",
      ],
      tip: "\"Can be interrupted\" or \"flexible start times\" → Spot. \"Steady 24/7 for 3 years, flexibility across instance families\" → Compute Savings Plan.",
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
              { icon: "🌗", title: "Aurora Serverless v2", text: "Capacity follows load in fine steps: intermittent or unpredictable relational workloads.", color: "#38bdf8" },
              { icon: "📈", title: "DynamoDB on-demand", text: "Pay per request: new, spiky, or unpredictable traffic. Switch to provisioned + auto scaling when traffic is steady.", color: "#38bdf8" },
              { icon: "🎟️", title: "Reserved DB instances", text: "1- or 3-year commitments for steady RDS, Aurora, ElastiCache, and Redshift capacity.", color: "#38bdf8" },
              { icon: "🧊", title: "DynamoDB Standard-IA", text: "Table class with lower storage cost for tables that are rarely read.", color: "#a78bfa" },
              { icon: "🗃️", title: "Snapshots and retention", text: "Keep only the backups your RPO and compliance need; export old snapshots to S3.", color: "#a78bfa" },
              { icon: "🧠", title: "Cache first", text: "ElastiCache or DAX can be cheaper than scaling the database for read-heavy load.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Choose the database type by access pattern and cost: DynamoDB for key-value at scale, RDS/Aurora for relational, Redshift for columnar analytics.",
        "Aurora I/O-Optimized has no per-request I/O charges and suits I/O-heavy clusters; Aurora Standard is cheaper when I/O is modest.",
        "A dev or test RDS instance can be stopped when idle (it restarts automatically after 7 days); you still pay for storage.",
        "Moving off commercial engines (for example Oracle to Aurora PostgreSQL) with DMS removes license costs.",
      ],
      tip: "\"Unpredictable traffic, minimize cost, no capacity planning\" → DynamoDB on-demand or Aurora Serverless v2. \"Steady, predictable usage for years\" → reserved capacity.",
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
              { icon: "📤", label: "Out to the internet", sub: "Charged per GB (CloudFront often cheaper)" },
            ]}
          />
          <VpcBuilderLab />
        </div>
      ),
      points: [
        "NAT gateways charge per hour and per GB processed. Send S3 and DynamoDB traffic through free gateway endpoints instead.",
        "One NAT gateway per AZ is resilient and avoids cross-AZ charges; a single shared NAT gateway is cheaper for non-production but is a single point of failure.",
        "NAT instances can be cheaper for tiny workloads but you manage scaling, patching, failover, and the source/destination check.",
        "CloudFront reduces origin load and data transfer out; transfer from AWS origins to CloudFront isn't charged.",
        "Direct Connect has lower data-transfer-out rates than the internet; VPN is cheaper to start. VPC peering has no hourly charge; Transit Gateway charges per attachment and per GB.",
      ],
      tip: "\"NAT gateway costs are high and most traffic goes to S3\" → add an S3 gateway endpoint.",
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
              { icon: "🔎", title: "Cost Explorer", text: "Visualize and forecast spend, filter by service, account, or tag, and see Savings Plans and RI recommendations.", color: "#34d399" },
              { icon: "🚨", title: "AWS Budgets", text: "Alerts when actual or forecast cost or usage crosses a threshold; budget actions can apply controls.", color: "#34d399" },
              { icon: "🧾", title: "Cost and Usage Report", text: "The most detailed line-item billing data, delivered to S3 for analysis with Athena or Amazon Quick.", color: "#34d399" },
              { icon: "🏷️", title: "Cost allocation tags", text: "Activate tags in the Billing console to split costs by team, project, or environment.", color: "#34d399" },
            ]}
          />
          <Flow
            color="#34d399"
            steps={[
              { icon: "🏢", label: "AWS Organizations", sub: "Consolidated billing" },
              { icon: "📊", label: "Combined usage", sub: "Volume pricing tiers across accounts" },
              { icon: "🎟️", label: "Shared discounts", sub: "RIs and Savings Plans apply across accounts" },
            ]}
          />
        </div>
      ),
      points: [
        "Cost Explorer answers \"where did the money go, and where is it heading?\"; Budgets answers \"tell me before it's too much\"; CUR answers \"give me every line item\".",
        "Cost allocation tags only appear in billing tools after you activate them; tag consistently (enforce with tag policies or SCPs).",
        "Consolidated billing gives one bill, aggregated volume discounts, and sharing of Reserved Instance and Savings Plans discounts.",
        "Use Compute Optimizer and Cost Explorer rightsizing recommendations to find idle and oversized resources.",
      ],
      tip: "\"Alert when the forecast exceeds $X\" → AWS Budgets. \"Analyze spend trends by tag\" → Cost Explorer. \"Detailed hourly line items in S3\" → Cost and Usage Report.",
    },
  ],

  questions: [
    // ── S3 tiers ──
    {
      id: "d4-01",
      domain: "d4",
      lesson: "d4-s3-tiers",
      prompt:
        "A company stores medical images that are rarely accessed, about once a quarter, but when a doctor requests one it must be available in milliseconds. The images must be stored across multiple Availability Zones. Which storage class is MOST cost-effective?",
      options: ["S3 Glacier Instant Retrieval", "S3 Standard", "S3 Glacier Flexible Retrieval", "S3 One Zone-IA"],
      answer: [0],
      explanation: "Glacier Instant Retrieval gives millisecond access at a much lower storage price than Standard or Standard-IA, for data read about once a quarter. Flexible Retrieval needs a restore; One Zone-IA is single-AZ.",
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
        "Standard-IA stores three copies of each object in every Region",
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
      options: ["S3 Requester Pays on the bucket", "S3 Transfer Acceleration", "CloudFront signed URLs", "S3 Intelligent-Tiering"],
      answer: [0],
      explanation: "With Requester Pays, the requester's AWS account is charged for requests and data downloads; the bucket owner still pays for storage.",
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
        "Move the bucket to another Region",
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
        "Take snapshots and delete the volumes",
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
      options: ["AWS Storage Gateway Tape Gateway with virtual tapes archived to S3 Glacier storage classes", "AWS DataSync to EFS", "Amazon FSx for Lustre", "An S3 File Gateway with Standard storage"],
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
        "Enable EBS encryption by default",
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
        "Move the bucket to S3 Standard-IA",
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
        "Buy 3-year Reserved Instances for the current size",
        "Move to a larger instance family",
        "Add more instances to spread the load",
      ],
      answer: [0],
      explanation: "Rightsize before committing; otherwise you lock in a discount on capacity you don't need.",
    },
    {
      id: "d4-20",
      domain: "d4",
      lesson: "d4-compute-cost",
      prompt:
        "Development environments on EC2 are used only during business hours on weekdays. Which change gives the biggest saving with little effort?",
      options: [
        "Stop the instances outside business hours on a schedule (for example with EventBridge Scheduler and Systems Manager)",
        "Buy 3-year Reserved Instances for the development instances",
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
      explanation: "Interruptible → Spot; steady → commitment; unpredictable → On-Demand; licensing or compliance on physical servers → Dedicated Hosts.",
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
        "Buy reserved capacity for the largest instance class",
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
      options: ["Switch the cluster to the Aurora I/O-Optimized configuration", "Switch to Aurora Standard", "Add more Aurora Replicas", "Enable backtracking"],
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
        "Copy every daily snapshot to another Region",
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
        "Move the instances to public subnets with public IPs",
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
      explanation: "CloudFront caches files at the edge, reducing origin traffic and often the per-GB rate; transfer from AWS origins to CloudFront isn't charged. S3 is cheaper than EC2 for storing and serving static files.",
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
        "Use public IP addresses for the traffic",
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
        "Create an AWS Budget for each tag",
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
      explanation: "Explore, alert, export, and rightsize: four tools for four jobs.",
    },
  ],

  cards: [
    { id: "s-s3", domain: "d4", kind: "service", term: "Amazon S3", definition: "Object storage with storage classes, lifecycle rules, and replication" },
    { id: "s-glacier", domain: "d4", kind: "service", term: "Amazon S3 Glacier storage classes", definition: "Archive tiers: Instant Retrieval, Flexible Retrieval, Deep Archive" },
    { id: "s-backup", domain: "d4", kind: "service", term: "AWS Backup", definition: "Central backup plans, retention, and cross-Region/account copies" },
    { id: "s-costexplorer", domain: "d4", kind: "service", term: "AWS Cost Explorer", definition: "Visualize, filter, and forecast AWS spend; commitment recommendations" },
    { id: "s-budgets", domain: "d4", kind: "service", term: "AWS Budgets", definition: "Alerts and actions when cost or usage crosses a threshold" },
    { id: "s-cur", domain: "d4", kind: "service", term: "AWS Cost and Usage Report", definition: "Most detailed line-item billing data delivered to S3" },
    { id: "s-savingsplans", domain: "d4", kind: "service", term: "Savings Plans", definition: "Discount for a 1- or 3-year $/hour compute commitment" },
    { id: "s-computeoptimizer", domain: "d4", kind: "service", term: "AWS Compute Optimizer", definition: "Rightsizing recommendations for EC2, EBS, Lambda, and more" },
    { id: "s-outposts", domain: "d4", kind: "service", term: "AWS Outposts", definition: "AWS infrastructure and services running in your own data center" },
    { id: "s-wavelength", domain: "d4", kind: "service", term: "AWS Wavelength", definition: "AWS compute at the edge of 5G networks for ultra-low latency" },
    { id: "c-intelligent", domain: "d4", kind: "concept", term: "S3 Intelligent-Tiering", definition: "Moves objects between tiers automatically; no retrieval fees" },
    { id: "c-mindays", domain: "d4", kind: "concept", term: "Minimum storage duration", definition: "IA 30 days · Glacier IR/Flexible 90 days · Deep Archive 180 days" },
    { id: "c-lifecycle", domain: "d4", kind: "concept", term: "S3 Lifecycle rule", definition: "Transitions objects to cheaper classes and expires them on a schedule" },
    { id: "c-requesterpays", domain: "d4", kind: "concept", term: "Requester Pays", definition: "Downloaders pay request and transfer costs for a bucket" },
    { id: "c-spot", domain: "d4", kind: "concept", term: "Spot Instances", definition: "Spare capacity at up to 90% off; 2-minute interruption notice" },
    { id: "c-ri", domain: "d4", kind: "concept", term: "Reserved Instances", definition: "1- or 3-year commitment to instance attributes for a discount" },
    { id: "c-dedicatedhost", domain: "d4", kind: "concept", term: "Dedicated Host", definition: "A physical server for you; supports per-socket/core licenses" },
    { id: "c-ondemand-ddb", domain: "d4", kind: "concept", term: "DynamoDB on-demand", definition: "Pay per request with no capacity planning" },
    { id: "c-natcost", domain: "d4", kind: "concept", term: "NAT gateway pricing", definition: "Hourly charge plus a per-GB processing charge" },
    { id: "c-crossaz", domain: "d4", kind: "concept", term: "Cross-AZ data transfer", definition: "Charged per GB in each direction; same-AZ private traffic is free" },
    { id: "c-costtags", domain: "d4", kind: "concept", term: "Cost allocation tags", definition: "Tags activated in Billing to group costs by team or project" },
    { id: "c-consolidated", domain: "d4", kind: "concept", term: "Consolidated billing", definition: "One bill, combined volume pricing, shared RI and Savings Plans discounts" },
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
