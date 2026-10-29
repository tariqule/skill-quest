import { Flow, Layers, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";

/**
 * Domain 3: Design High-Performing Architectures (24% of SAA-C03 scored content).
 */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Design High-Performing Architectures",
    world: "The Velocity Spire",
    weight: 24,
    emoji: "⚡",
    color: "#38bdf8",
    summary: "Block, file, and object storage performance; EC2 families and elastic compute; purpose-built databases and caching; edge and hybrid networking; streaming and data lakes.",
  },

  tasks: [
    {
      id: "3.1",
      title: "Determine high-performing and/or scalable storage solutions",
      covers: [
        "Hybrid storage solutions for business requirements",
        "Storage services by use case (Amazon S3, Amazon EFS, Amazon EBS) and storage types (object, file, block)",
        "Pick storage services and configurations that meet performance demands",
        "Pick storage that scales to future needs",
      ],
    },
    {
      id: "3.2",
      title: "Design high-performing and elastic compute solutions",
      covers: [
        "Compute services by use case (AWS Batch, Amazon EMR, AWS Fargate) and distributed computing on the global infrastructure and edge",
        "Queuing and publish/subscribe; scaling with EC2 Auto Scaling and AWS Auto Scaling",
        "Serverless (Lambda, Fargate) and container orchestration (ECS, EKS)",
        "Decouple workloads so components scale independently",
        "Identify the metrics and conditions that trigger scaling",
        "Select compute options, EC2 instance types, and resource sizes (for example, Lambda memory)",
      ],
    },
    {
      id: "3.3",
      title: "Determine high-performing database solutions",
      covers: [
        "Caching strategies and services (Amazon ElastiCache) and data access patterns (read-intensive versus write-intensive)",
        "Database capacity planning: capacity units, instance types, Provisioned IOPS",
        "Database connections and proxies, replication, and read replicas",
        "Database engines (homogeneous and heterogeneous migrations) and types (serverless, relational, non-relational, in-memory)",
        "Design database architectures and integrate caching",
        "Choose an engine (MySQL versus PostgreSQL) and a database type (Amazon Aurora, Amazon DynamoDB)",
      ],
    },
    {
      id: "3.4",
      title: "Determine high-performing and/or scalable network architectures",
      covers: [
        "Edge networking services (Amazon CloudFront, AWS Global Accelerator)",
        "Network design: subnet tiers, routing, IP addressing",
        "Load balancing (Application Load Balancer) and connection options (AWS VPN, AWS Direct Connect, AWS PrivateLink)",
        "Create topologies for global, hybrid, and multi-tier architectures",
        "Design networks that scale, place resources to meet requirements, and pick a load balancing strategy",
      ],
    },
    {
      id: "3.5",
      title: "Determine high-performing data ingestion and transformation solutions",
      covers: [
        "Analytics and visualization services (Amazon Athena, AWS Lake Formation, Amazon Quick)",
        "Ingestion patterns and frequency; transfer services (AWS DataSync, AWS Storage Gateway)",
        "Transformation services (AWS Glue) and streaming services (Amazon Kinesis)",
        "Secure ingestion access points; size and speed needs",
        "Build and secure data lakes; design streaming architectures and data transfer solutions",
        "Implement visualization; choose compute for data processing (Amazon EMR); transform formats (.csv to .parquet)",
      ],
    },
  ],

  lessons: [
    {
      id: "d3-storage",
      task: "3.1",
      title: "Block, file, and object storage performance",
      check: ["d3-01", "d3-02"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧱", title: "Block: Amazon EBS", text: "Network volumes for one instance in one AZ (io1/io2 can multi-attach). gp3 · io2 Block Express · st1 · sc1.", color: "#38bdf8" },
              { icon: "📁", title: "File: EFS and FSx", text: "Shared file systems for many instances: EFS (NFS, Linux, elastic) and FSx for Windows, Lustre, NetApp ONTAP, OpenZFS.", color: "#38bdf8" },
              { icon: "🪣", title: "Object: Amazon S3", text: "Virtually unlimited objects over HTTP APIs. Scales request rates per prefix.", color: "#38bdf8" },
            ]}
          />
          <Layers
            layers={[
              { name: "EBS SSD", color: "#34d399", items: ["gp3: 3,000 IOPS + 125 MiB/s baseline, raise IOPS/throughput separately", "io2 Block Express: highest IOPS, sub-millisecond, critical databases"] },
              { name: "EBS HDD (not bootable)", color: "#f59e0b", items: ["st1: throughput-optimized, big sequential reads (logs, big data)", "sc1: cold, lowest cost, infrequent access"] },
              { name: "Instance store", color: "#f87171", items: ["Physically attached, very fast", "Lost on stop, hibernate, or terminate", "Caches, buffers, scratch data"] },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🪟", title: "FSx for Windows File Server", text: "SMB shares with Active Directory integration for Windows apps.", color: "#a78bfa" },
              { icon: "🏎️", title: "FSx for Lustre", text: "HPC and ML file system with sub-millisecond latency; can link to an S3 bucket.", color: "#a78bfa" },
              { icon: "🗄️", title: "FSx for NetApp ONTAP", text: "NFS, SMB, and iSCSI from one file system, snapshots, cloning, and replication.", color: "#a78bfa" },
              { icon: "🌉", title: "Storage Gateway", text: "Hybrid: S3 File Gateway (NFS/SMB to S3), Volume Gateway (iSCSI), Tape Gateway (virtual tapes).", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Choose by access model first: one instance needs a block device (EBS), many instances need shared files (EFS/FSx), apps over HTTP or massive scale need objects (S3).",
        "S3 supports at least 3,500 writes and 5,500 reads per second per prefix: spread keys across prefixes for more parallelism.",
        "Use multipart upload for large objects (recommended above about 100 MB) and S3 Transfer Acceleration for long-distance uploads.",
        "gp3 lets you buy IOPS and throughput independently of size; gp2 ties performance to volume size.",
        "Storage Gateway gives on-premises apps local-speed access to cloud storage with a local cache.",
      ],
      tip: "\"Highest possible IOPS, temporary data, loss is acceptable\" → instance store. \"Shared POSIX storage for Linux instances in many AZs\" → EFS. \"Windows SMB with AD\" → FSx for Windows File Server.",
    },
    {
      id: "d3-compute",
      task: "3.2",
      title: "Elastic compute: instance families, placement, and batch",
      check: ["d3-10", "d3-11"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "⚖️", title: "General purpose (M, T)", text: "Balanced CPU and memory. T instances are burstable with CPU credits.", color: "#38bdf8" },
              { icon: "🧮", title: "Compute optimized (C)", text: "High CPU per GB: batch processing, gaming servers, encoding, HPC.", color: "#38bdf8" },
              { icon: "🧠", title: "Memory optimized (R, X)", text: "Large in-memory databases, caches, real-time analytics.", color: "#38bdf8" },
              { icon: "🎮", title: "Accelerated (P, G, Inf, Trn)", text: "GPUs and ML accelerators for training, inference, and graphics.", color: "#38bdf8" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧲", title: "Cluster placement group", text: "Packs instances close together in one AZ for the lowest latency and highest throughput (HPC).", color: "#a78bfa" },
              { icon: "🪐", title: "Spread placement group", text: "Each instance on distinct hardware: a few critical instances that must not fail together.", color: "#a78bfa" },
              { icon: "🧩", title: "Partition placement group", text: "Groups of instances on separate racks: large distributed systems like HDFS, Cassandra, Kafka.", color: "#a78bfa" },
            ]}
          />
          <Flow
            color="#38bdf8"
            steps={[
              { icon: "📥", label: "Jobs submitted", sub: "To an AWS Batch job queue" },
              { icon: "🧮", label: "Batch picks capacity", sub: "EC2, Spot, or Fargate" },
              { icon: "📈", label: "Scales out", sub: "Runs jobs in parallel" },
              { icon: "📉", label: "Scales to zero", sub: "When the queue is empty" },
            ]}
          />
        </div>
      ),
      points: [
        "Match the instance family to the bottleneck: CPU-bound → C, memory-bound → R/X, GPU → P/G, local storage I/O → I/D.",
        "Lambda CPU scales with configured memory (128 MB–10,240 MB): a CPU-bound function often gets faster and cheaper with more memory.",
        "AWS Batch runs large numbers of batch jobs on managed compute; Amazon EMR runs Spark, Hadoop, and other big data frameworks.",
        "Decouple with queues so each tier scales on its own metric: requests per target for the web tier, backlog per instance for workers.",
        "Elastic Fabric Adapter (EFA) gives tightly coupled HPC and MPI workloads very low-latency networking.",
      ],
      tip: "\"Lowest network latency between nodes\" → cluster placement group. \"Prevent simultaneous hardware failure of a few critical instances\" → spread placement group.",
    },
    {
      id: "d3-databases",
      task: "3.3",
      title: "Choosing high-performing databases",
      check: ["d3-18", "d3-19"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "🐬", title: "Amazon RDS", text: "Managed MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Db2. Provisioned IOPS storage for heavy I/O.", color: "#38bdf8" },
              { icon: "🌌", title: "Amazon Aurora", text: "MySQL/PostgreSQL-compatible, up to 15 replicas, auto-growing storage. Serverless v2 scales capacity in fine steps.", color: "#38bdf8" },
              { icon: "⚡", title: "Amazon DynamoDB", text: "Serverless key-value and document DB, single-digit millisecond latency at any scale. On-demand or provisioned capacity.", color: "#38bdf8" },
              { icon: "🏭", title: "Amazon Redshift", text: "Columnar data warehouse for complex analytic SQL over large data sets.", color: "#38bdf8" },
              { icon: "🕸️", title: "Amazon Neptune", text: "Graph database: relationships such as social networks, fraud rings, recommendations.", color: "#a78bfa" },
              { icon: "📄", title: "Amazon DocumentDB", text: "MongoDB-compatible JSON document database.", color: "#a78bfa" },
              { icon: "🗝️", title: "Amazon Keyspaces", text: "Apache Cassandra-compatible wide-column database, serverless.", color: "#a78bfa" },
              { icon: "🚚", title: "AWS DMS", text: "Migrates databases with minimal downtime; DMS Schema Conversion handles heterogeneous engine changes.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Relational with joins and transactions → RDS or Aurora. Massive scale with known key-based access patterns → DynamoDB. Analytics over terabytes → Redshift.",
        "Read-heavy → read replicas and caching. Write-heavy relational → scale up, Provisioned IOPS, or Aurora; write-heavy key-value → DynamoDB with a well-distributed partition key.",
        "DynamoDB capacity: 1 RCU = one strongly consistent 4 KB read per second (two if eventually consistent); 1 WCU = one 1 KB write per second.",
        "Homogeneous migration (MySQL → Aurora MySQL): DMS or native tools. Heterogeneous (Oracle → PostgreSQL): convert the schema first, then migrate data with DMS.",
      ],
      tip: "Match the data model to the database: graph → Neptune, MongoDB → DocumentDB, Cassandra → Keyspaces, warehouse → Redshift.",
    },
    {
      id: "d3-caching",
      task: "3.3",
      title: "Caching: ElastiCache, DAX, and CloudFront",
      check: ["d3-26", "d3-27"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={2}
            tiles={[
              { icon: "💤", title: "Lazy loading (cache-aside)", text: "Read the cache; on a miss read the DB and fill the cache. Only requested data is cached, but it can be stale: add a TTL.", color: "#f59e0b" },
              { icon: "✍️", title: "Write-through", text: "Update the cache on every DB write. Always fresh; costs more writes and may cache unread data.", color: "#f59e0b" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧠", title: "ElastiCache (Redis OSS / Valkey)", text: "Replication, Multi-AZ failover, persistence, sorted sets for leaderboards, pub/sub.", color: "#38bdf8" },
              { icon: "🧵", title: "ElastiCache (Memcached)", text: "Simple, multithreaded cache. No replication or persistence.", color: "#38bdf8" },
              { icon: "🚀", title: "DynamoDB Accelerator (DAX)", text: "In-memory cache for DynamoDB with microsecond reads and few code changes.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Caching moves repeated reads off the database: lower latency for users and lower load (and often cost) for the database.",
        "Pick the cache that fits the store: DAX for DynamoDB, ElastiCache for RDS query results and sessions, CloudFront for content at the edge.",
        "Use Redis OSS or Valkey when you need high availability, persistence, or rich data structures; Memcached for a simple, horizontally scaled cache.",
        "API Gateway REST APIs can cache responses too, reducing calls to the back end.",
      ],
      tip: "\"Microsecond latency for DynamoDB with minimal code changes\" → DAX. \"Real-time leaderboard\" → ElastiCache sorted sets.",
    },
    {
      id: "d3-network",
      task: "3.4",
      title: "High-performing networks: edge, hybrid, and multi-VPC",
      check: ["d3-32", "d3-33"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={2}
            tiles={[
              { icon: "🌐", title: "Amazon CloudFront", text: "CDN that caches content at edge locations. HTTP(S) and WebSocket. Origins: S3 (with origin access control), ALB, custom servers.", color: "#38bdf8" },
              { icon: "🚀", title: "AWS Global Accelerator", text: "Static anycast IPs; TCP/UDP over the AWS backbone to the nearest healthy Regional endpoint. No caching.", color: "#38bdf8" },
            ]}
          />
          <Layers
            layers={[
              { name: "Connect VPCs", color: "#34d399", items: ["VPC peering: one-to-one, non-transitive, no overlapping CIDRs", "Transit Gateway: hub-and-spoke for many VPCs and on-premises, transitive routing", "PrivateLink: expose one service, not whole networks"] },
              { name: "Connect on premises", color: "#f59e0b", items: ["Site-to-Site VPN: quick, encrypted, over the internet", "Direct Connect: dedicated bandwidth, consistent latency", "Direct Connect gateway: reach VPCs in many Regions"] },
              { name: "IP planning", color: "#a78bfa", items: ["VPC CIDR /16 to /28", "5 IPs reserved per subnet", "Add secondary CIDRs later", "Avoid overlaps with networks you'll connect"] },
            ]}
          />
        </div>
      ),
      points: [
        "CloudFront lowers latency for cacheable content and offloads origins; Global Accelerator improves latency and failover for any TCP/UDP app, including non-HTTP.",
        "Transit Gateway replaces a mesh of peering connections once you have more than a handful of VPCs, and attaches VPNs and Direct Connect too.",
        "Place resources close to users (Regions, edge locations, AWS Local Zones, Wavelength for 5G edge) when latency is the requirement.",
        "Plan IP space generously: a subnet that's too small limits Auto Scaling, and overlapping CIDRs block peering.",
      ],
      tip: "\"Hundreds of VPCs and on-premises networks need to talk to each other\" → Transit Gateway. \"Two VPCs, simplest and cheapest\" → VPC peering.",
    },
    {
      id: "d3-ingestion",
      task: "3.5",
      title: "Data ingestion, streaming, transfer, and data lakes",
      check: ["d3-40", "d3-41"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#38bdf8"
            steps={[
              { icon: "📡", label: "Ingest", sub: "Kinesis Data Streams, Data Firehose, MSK, DataSync, Transfer Family" },
              { icon: "🪣", label: "Store in S3", sub: "The data lake" },
              { icon: "🧪", label: "Catalog and transform", sub: "Glue crawlers, Glue ETL, EMR: CSV → Parquet" },
              { icon: "🔐", label: "Govern", sub: "Lake Formation permissions" },
              { icon: "📊", label: "Query and visualize", sub: "Athena, Redshift, Amazon Quick" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🌊", title: "Kinesis Data Streams", text: "Real-time streams with ordering per shard and replay; you write the consumers.", color: "#34d399" },
              { icon: "🚿", title: "Amazon Data Firehose", text: "Fully managed delivery to S3, Redshift, OpenSearch, and more; buffers, transforms, converts to Parquet.", color: "#34d399" },
              { icon: "🔁", title: "AWS DataSync", text: "Online transfer from NFS, SMB, HDFS, or object stores to S3, EFS, or FSx, with scheduling and verification.", color: "#34d399" },
              { icon: "📦", title: "AWS Snow Family", text: "Physical devices for offline transfer when the network would take too long.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "Real-time with custom processing and replay → Kinesis Data Streams (or MSK for Kafka). Load streaming data into storage with no code → Data Firehose.",
        "Columnar formats (Parquet, ORC), compression, and partitioning make Athena and Redshift queries faster and cheaper because less data is scanned.",
        "Lake Formation centralizes fine-grained permissions (database, table, column, row) on data lake data in S3.",
        "AppFlow moves data from SaaS apps such as Salesforce into AWS on a schedule or event, with no code.",
        "Secure ingestion: VPC endpoints, encryption in transit, and least-privilege roles for producers.",
      ],
      tip: "\"Near real-time delivery to S3 with no servers or code\" → Data Firehose. \"Ad hoc SQL on S3\" → Athena. \"Spark cluster\" → EMR.",
    },
  ],

  questions: [
    // ── Storage ──
    {
      id: "d3-01",
      domain: "d3",
      lesson: "d3-storage",
      prompt:
        "A fleet of Linux EC2 instances in three Availability Zones needs a shared POSIX file system that grows and shrinks automatically as files are added and removed. Which storage service should the architect choose?",
      options: ["Amazon EFS", "Amazon EBS gp3 with Multi-Attach", "Amazon S3 mounted with a script", "Instance store volumes"],
      answer: [0],
      explanation: "EFS is a managed NFS file system that many instances across AZs can mount at once, and it scales capacity automatically.",
    },
    {
      id: "d3-02",
      domain: "d3",
      lesson: "d3-storage",
      prompt:
        "A high-transaction OLTP database on EC2 needs consistent sub-millisecond latency and very high IOPS on a durable volume. Which EBS volume type is MOST appropriate?",
      options: ["io2 Block Express", "st1", "sc1", "Standard magnetic"],
      answer: [0],
      explanation: "io2 Block Express is the highest-performance, highest-durability EBS SSD volume, designed for critical, I/O-intensive databases. HDD types suit sequential throughput.",
    },
    {
      id: "d3-03",
      domain: "d3",
      lesson: "d3-storage",
      prompt:
        "A log analytics cluster reads large files sequentially and needs high throughput at low cost. Boot volumes are separate. Which TWO statements are correct for choosing the data volumes? (Choose two.)",
      options: [
        "Throughput Optimized HDD (st1) fits large, sequential workloads at low cost per GB",
        "HDD volume types can't be used as boot volumes",
        "sc1 gives the highest IOPS of any EBS type",
        "Instance store data survives stopping the instance",
        "gp2 performance is independent of volume size",
      ],
      answer: [0, 1],
      explanation: "st1 is built for frequently accessed, throughput-heavy sequential workloads; HDD volumes can't boot. sc1 is the coldest, lowest-cost HDD; gp2 IOPS scale with size; instance store is ephemeral.",
    },
    {
      id: "d3-04",
      domain: "d3",
      lesson: "d3-storage",
      prompt:
        "A machine learning team needs a high-performance file system with sub-millisecond latency for training jobs, loading its data set from an S3 bucket and writing results back. What should the architect recommend?",
      options: ["Amazon FSx for Lustre linked to the S3 bucket", "Amazon EFS One Zone", "Amazon FSx for Windows File Server", "AWS Storage Gateway Volume Gateway"],
      answer: [0],
      explanation: "FSx for Lustre is designed for HPC and ML and can link to an S3 bucket, presenting objects as files and exporting results.",
    },
    {
      id: "d3-05",
      domain: "d3",
      lesson: "d3-storage",
      prompt:
        "A Windows-based application needs shared file storage over SMB with Microsoft Active Directory permissions and DFS namespaces. Which service meets this requirement?",
      options: ["Amazon FSx for Windows File Server", "Amazon EFS", "Amazon S3", "Amazon FSx for Lustre"],
      answer: [0],
      explanation: "FSx for Windows File Server provides native SMB shares integrated with Active Directory. EFS is NFS for Linux.",
    },
    {
      id: "d3-06",
      domain: "d3",
      lesson: "d3-storage",
      prompt:
        "Users around the world upload multi-gigabyte video files to a single S3 bucket in us-east-1. Uploads from Asia are slow. Which TWO changes improve upload performance? (Choose two.)",
      options: [
        "Enable S3 Transfer Acceleration and use its endpoint",
        "Use multipart upload to send parts in parallel",
        "Enable S3 Versioning",
        "Switch the bucket to S3 One Zone-IA",
        "Enable S3 Object Lock",
      ],
      answer: [0, 1],
      explanation: "Transfer Acceleration routes uploads through the nearest edge location and over the AWS network. Multipart upload sends parts in parallel and retries failed parts only.",
    },
    {
      id: "d3-07",
      domain: "d3",
      lesson: "d3-storage",
      prompt:
        "An on-premises application writes files over NFS. The company wants the files stored durably in Amazon S3 while keeping low-latency local access to recently used files, without changing the application. Which TWO statements describe the right solution? (Choose two.)",
      options: [
        "Deploy AWS Storage Gateway as an S3 File Gateway on premises",
        "The gateway keeps a local cache of recently used data",
        "Replace NFS with the S3 API in the application",
        "Use Amazon EBS snapshots to copy the files",
        "Use Tape Gateway with NFS",
      ],
      answer: [0, 1],
      explanation: "S3 File Gateway presents NFS (or SMB) shares, stores each file as an S3 object, and caches hot data locally for low-latency access.",
    },
    {
      id: "d3-08",
      domain: "d3",
      lesson: "d3-storage",
      prompt:
        "An application writes temporary processing data that needs the highest possible I/O performance. The data can be regenerated if lost. Which storage is MOST suitable?",
      options: ["EC2 instance store", "EBS io2", "Amazon EFS", "Amazon S3 Standard"],
      answer: [0],
      explanation: "Instance store is physically attached to the host and offers very high I/O, but data is lost when the instance stops or terminates, which is acceptable for scratch data.",
    },
    {
      id: "d3-09",
      domain: "d3",
      lesson: "d3-storage",
      type: "match",
      prompt: "Match each workload to the storage service that fits it best.",
      pairs: [
        ["Shared NFS storage for Linux instances across AZs", "Amazon EFS"],
        ["SMB file shares with Active Directory for Windows apps", "Amazon FSx for Windows File Server"],
        ["HPC scratch file system linked to an S3 bucket", "Amazon FSx for Lustre"],
        ["Boot and data volume for one EC2 instance", "Amazon EBS"],
        ["Static website assets and data lake files", "Amazon S3"],
      ],
      explanation: "Block for one instance, file for shared access (pick the FSx flavor by protocol and workload), object for HTTP-scale data.",
    },

    // ── Compute ──
    {
      id: "d3-10",
      domain: "d3",
      lesson: "d3-compute",
      prompt:
        "An HPC application runs tightly coupled simulations on many EC2 instances that exchange data constantly. It needs the lowest possible network latency between nodes. What should the architect use?",
      options: ["A cluster placement group in one Availability Zone", "A spread placement group across three AZs", "Instances in three different Regions", "A partition placement group across AZs"],
      answer: [0],
      explanation: "Cluster placement groups pack instances close together in one AZ for low latency and high throughput between them. Adding EFA helps MPI workloads further.",
    },
    {
      id: "d3-11",
      domain: "d3",
      lesson: "d3-compute",
      prompt:
        "A company runs an in-memory analytics engine that needs a very large amount of RAM relative to CPU. Which EC2 instance family should it choose?",
      options: ["Memory optimized (R or X family)", "Compute optimized (C family)", "Burstable general purpose (T family)", "Storage optimized (I family)"],
      answer: [0],
      explanation: "Memory optimized instances provide high memory per vCPU for in-memory databases and analytics.",
    },
    {
      id: "d3-12",
      domain: "d3",
      lesson: "d3-compute",
      prompt:
        "A CPU-intensive Lambda function takes 9 seconds to run with 512 MB of memory. The team wants it to run faster without changing code. Which TWO statements are correct? (Choose two.)",
      options: [
        "Increasing the memory setting also gives the function proportionally more CPU",
        "A higher memory setting can lower total cost if the duration drops enough",
        "Lambda CPU is fixed regardless of memory",
        "Increasing the timeout makes the function run faster",
        "Provisioned concurrency increases CPU per invocation",
      ],
      answer: [0, 1],
      explanation: "Lambda allocates CPU in proportion to memory. Cost is memory × duration, so a shorter run at higher memory can cost the same or less.",
    },
    {
      id: "d3-13",
      domain: "d3",
      lesson: "d3-compute",
      prompt:
        "A research group submits thousands of independent containerized batch jobs each night. It wants AWS to queue the jobs, provision the right compute (including Spot), and scale down when done. Which service fits?",
      options: ["AWS Batch", "Amazon EMR", "AWS Step Functions Express workflows", "Amazon Lightsail"],
      answer: [0],
      explanation: "AWS Batch manages job queues and compute environments on EC2, Spot, or Fargate, scaling with the queue.",
    },
    {
      id: "d3-14",
      domain: "d3",
      lesson: "d3-compute",
      prompt: "A data engineering team needs to run Apache Spark jobs over petabytes of data in S3 using a managed cluster. Which service should it use?",
      options: ["Amazon EMR", "AWS Batch", "Amazon Athena", "AWS Glue DataBrew"],
      answer: [0],
      explanation: "EMR runs managed big data frameworks such as Spark, Hive, and Presto on EC2, EKS, or serverless.",
    },
    {
      id: "d3-15",
      domain: "d3",
      lesson: "d3-compute",
      prompt:
        "A distributed database runs on 30 EC2 instances. The architect wants to reduce the chance that a single rack failure takes out more than a portion of the nodes, and the database is rack-aware. Which placement strategy fits?",
      options: ["Partition placement group", "Cluster placement group", "No placement group, all in one AZ", "A dedicated host"],
      answer: [0],
      explanation: "Partition placement groups place groups of instances on separate racks and expose the partition to the application, which suits HDFS, Cassandra, and Kafka.",
    },
    {
      id: "d3-16",
      domain: "d3",
      lesson: "d3-compute",
      prompt:
        "A web tier and an image-processing tier run on the same EC2 instances. Image processing spikes make the website slow. What should the architect do so each part scales on its own?",
      options: [
        "Move image processing to separate workers that consume jobs from an SQS queue, each tier in its own Auto Scaling group",
        "Use a larger instance type for the combined tier",
        "Add a cluster placement group",
        "Turn off image processing during peaks",
      ],
      answer: [0],
      explanation: "Decoupling with a queue lets the web tier scale on request load and the workers scale on backlog, so one doesn't starve the other.",
    },
    {
      id: "d3-17",
      domain: "d3",
      lesson: "d3-compute",
      type: "match",
      prompt: "Match each workload to the EC2 instance family.",
      pairs: [
        ["Video encoding and scientific modeling", "Compute optimized (C)"],
        ["Large in-memory cache", "Memory optimized (R)"],
        ["Deep learning model training", "Accelerated computing (P)"],
        ["Low-traffic website with occasional spikes", "Burstable general purpose (T)"],
      ],
      explanation: "Size and family follow the bottleneck: CPU, memory, GPU, or modest baseline with bursts.",
    },

    // ── Databases ──
    {
      id: "d3-18",
      domain: "d3",
      lesson: "d3-databases",
      prompt:
        "A mobile gaming company needs a database that serves millions of players with single-digit millisecond latency for key-based lookups and scales without managing servers. Which database should it choose?",
      options: ["Amazon DynamoDB", "Amazon RDS for MySQL", "Amazon Redshift", "Amazon Neptune"],
      answer: [0],
      explanation: "DynamoDB is serverless and delivers consistent single-digit millisecond performance at any scale for key-value access.",
    },
    {
      id: "d3-19",
      domain: "d3",
      lesson: "d3-databases",
      prompt:
        "A company migrating from an on-premises Oracle database to Amazon Aurora PostgreSQL must convert the schema and migrate the data with minimal downtime. What should the architect use?",
      options: [
        "DMS Schema Conversion (or AWS SCT) for the schema, then AWS DMS with ongoing replication for the data",
        "A native PostgreSQL dump of the Oracle database",
        "AWS DataSync",
        "AWS Snowball Edge for the schema",
      ],
      answer: [0],
      explanation: "A heterogeneous migration needs schema conversion first. DMS then copies the data and keeps replicating changes until cutover.",
    },
    {
      id: "d3-20",
      domain: "d3",
      lesson: "d3-databases",
      prompt:
        "A company needs a relational database for a new application with unpredictable, spiky traffic. It wants MySQL compatibility, high availability, and capacity that adjusts automatically. Which TWO options fit? (Choose two.)",
      options: [
        "Amazon Aurora Serverless v2 (MySQL-compatible)",
        "Aurora Replicas in other AZs for high availability",
        "Amazon Redshift",
        "Amazon DynamoDB with a SQL wrapper",
        "A single RDS instance with no Multi-AZ",
      ],
      answer: [0, 1],
      explanation: "Aurora Serverless v2 scales capacity up and down with demand, and Aurora Replicas in other AZs (which can also be Serverless v2) provide failover.",
    },
    {
      id: "d3-21",
      domain: "d3",
      lesson: "d3-databases",
      prompt:
        "A fraud detection system needs to query complex relationships between accounts, devices, and transactions several hops deep. Which database is purpose-built for this?",
      options: ["Amazon Neptune", "Amazon DynamoDB", "Amazon ElastiCache", "Amazon Keyspaces"],
      answer: [0],
      explanation: "Neptune is a graph database, designed for traversing relationships such as fraud rings and social networks.",
    },
    {
      id: "d3-22",
      domain: "d3",
      lesson: "d3-databases",
      prompt:
        "An RDS for MySQL database is I/O-bound: storage latency rises under heavy write load. The workload needs consistent, high IOPS. What should the architect change?",
      options: ["Use Provisioned IOPS SSD storage (io1/io2) for the DB instance", "Add a read replica", "Enable Multi-AZ", "Move to a burstable T instance"],
      answer: [0],
      explanation: "Provisioned IOPS storage delivers consistent I/O for I/O-intensive databases. Read replicas don't help write I/O, and Multi-AZ is for availability.",
    },
    {
      id: "d3-23",
      domain: "d3",
      lesson: "d3-databases",
      prompt:
        "A DynamoDB table must handle 100 strongly consistent reads per second of 6 KB items. How many read capacity units are needed?",
      options: ["200 RCU", "100 RCU", "150 RCU", "50 RCU"],
      answer: [0],
      explanation: "6 KB rounds up to 8 KB, which is 2 read units per strongly consistent read. 2 × 100 = 200 RCU (eventually consistent reads would need half).",
    },
    {
      id: "d3-24",
      domain: "d3",
      lesson: "d3-databases",
      prompt:
        "Business analysts need to run complex SQL aggregations over 50 TB of historical sales data with fast performance. Which service is the BEST fit?",
      options: ["Amazon Redshift", "Amazon RDS for PostgreSQL", "Amazon DynamoDB", "Amazon ElastiCache"],
      answer: [0],
      explanation: "Redshift is a columnar, massively parallel data warehouse designed for analytic queries over large data sets.",
    },
    {
      id: "d3-25",
      domain: "d3",
      lesson: "d3-databases",
      type: "match",
      prompt: "Match each requirement to the purpose-built database.",
      pairs: [
        ["MongoDB-compatible JSON documents", "Amazon DocumentDB"],
        ["Apache Cassandra workloads, serverless", "Amazon Keyspaces"],
        ["Graph queries across relationships", "Amazon Neptune"],
        ["Petabyte-scale analytic SQL", "Amazon Redshift"],
        ["Key-value at any scale with millisecond latency", "Amazon DynamoDB"],
      ],
      explanation: "AWS offers a purpose-built database per data model; the exam expects you to match the model to the service.",
    },

    // ── Caching ──
    {
      id: "d3-26",
      domain: "d3",
      lesson: "d3-caching",
      prompt:
        "A read-heavy DynamoDB application needs microsecond read latency for hot items, and the team wants to avoid writing caching logic. What should the architect add?",
      options: ["DynamoDB Accelerator (DAX)", "Amazon ElastiCache for Memcached with custom cache code", "A global secondary index", "DynamoDB Streams"],
      answer: [0],
      explanation: "DAX is API-compatible with DynamoDB, so the app switches clients and gets an in-memory cache with microsecond reads.",
    },
    {
      id: "d3-27",
      domain: "d3",
      lesson: "d3-caching",
      prompt:
        "A game needs a real-time leaderboard ranking millions of players by score, with high availability and automatic failover. Which solution fits best?",
      options: ["Amazon ElastiCache (Redis OSS or Valkey) sorted sets with Multi-AZ", "ElastiCache for Memcached", "Amazon S3 with S3 Select", "Amazon RDS with an ORDER BY query on every request"],
      answer: [0],
      explanation: "Sorted sets keep members ordered by score in memory; Redis OSS/Valkey clusters support replicas and Multi-AZ failover. Memcached has no rich data structures or replication.",
    },
    {
      id: "d3-28",
      domain: "d3",
      lesson: "d3-caching",
      prompt:
        "An application uses lazy loading with Amazon ElastiCache in front of RDS. Which TWO statements about this strategy are correct? (Choose two.)",
      options: [
        "Only data that is actually requested ends up in the cache",
        "Cached data can become stale, so a TTL should be set",
        "Every database write also updates the cache",
        "A cache miss is impossible after start-up",
        "It removes the need for a database",
      ],
      answer: [0, 1],
      explanation: "Lazy loading fills the cache on misses, so it holds only requested data but can serve stale values until they expire. Updating on every write is write-through.",
    },
    {
      id: "d3-29",
      domain: "d3",
      lesson: "d3-caching",
      prompt:
        "The same expensive product-catalog queries run thousands of times per minute against an Aurora cluster, driving CPU high. The data changes a few times a day. What is the MOST effective way to reduce load?",
      options: [
        "Cache query results in Amazon ElastiCache with a TTL",
        "Add Provisioned IOPS",
        "Enable Multi-AZ",
        "Increase the DB backup retention",
      ],
      answer: [0],
      explanation: "Repeated reads of slowly changing data are ideal for caching; the database only sees cache misses.",
    },
    {
      id: "d3-30",
      domain: "d3",
      lesson: "d3-caching",
      prompt:
        "A company wants a simple, multithreaded in-memory cache for database query results. It doesn't need persistence, replication, or advanced data types and wants to scale by adding nodes. Which option fits?",
      options: ["Amazon ElastiCache for Memcached", "ElastiCache (Redis OSS) with cluster mode and AOF persistence", "DynamoDB Accelerator", "Amazon Neptune"],
      answer: [0],
      explanation: "Memcached is a simple, multithreaded cache that scales horizontally, without replication or persistence.",
    },
    {
      id: "d3-31",
      domain: "d3",
      lesson: "d3-caching",
      prompt:
        "A REST API built with Amazon API Gateway and Lambda returns the same weather forecast for a city for 10 minutes at a time. How can the architect cut Lambda invocations and latency with the least effort?",
      options: ["Enable API Gateway stage caching with a TTL", "Add provisioned concurrency", "Increase Lambda memory", "Put an SQS queue in front of Lambda"],
      answer: [0],
      explanation: "API Gateway REST API caching returns cached responses for the TTL without invoking the back end.",
    },

    // ── Network ──
    {
      id: "d3-32",
      domain: "d3",
      lesson: "d3-network",
      prompt:
        "A website hosted in one Region serves static images, CSS, and video to users worldwide, who report slow load times. Which service will MOST improve performance for these users?",
      options: ["Amazon CloudFront", "AWS Global Accelerator", "A larger EC2 instance", "Route 53 simple routing"],
      answer: [0],
      explanation: "CloudFront caches content at edge locations close to users, reducing latency and origin load.",
    },
    {
      id: "d3-33",
      domain: "d3",
      lesson: "d3-network",
      prompt:
        "A company has 60 VPCs across several accounts and an on-premises network connected by VPN. Every VPC must reach the others and on premises, and peering connections have become unmanageable. What should the architect use?",
      options: ["AWS Transit Gateway", "VPC peering between every pair of VPCs", "A NAT gateway in each VPC", "AWS PrivateLink for every service"],
      answer: [0],
      explanation: "Transit Gateway is a regional hub that supports transitive routing among attached VPCs, VPNs, and Direct Connect, shareable across accounts with RAM.",
    },
    {
      id: "d3-34",
      domain: "d3",
      lesson: "d3-network",
      prompt: "Which TWO statements about VPC peering are correct? (Choose two.)",
      options: [
        "Peering isn't transitive: A–B and B–C don't let A reach C",
        "Peered VPCs can't have overlapping CIDR blocks",
        "Peering requires a VPN connection between the VPCs",
        "Peering works only within one account",
        "Peering allows unlimited transitive routing through a hub VPC",
      ],
      answer: [0, 1],
      explanation: "Peering is a one-to-one connection, across accounts and Regions if needed, but non-transitive and only between non-overlapping CIDRs.",
    },
    {
      id: "d3-35",
      domain: "d3",
      lesson: "d3-network",
      prompt:
        "A financial company transfers terabytes of data daily between its data center and AWS and needs consistent network performance that the internet can't provide. What should the architect recommend?",
      options: ["AWS Direct Connect", "AWS Site-to-Site VPN over the internet", "Amazon CloudFront", "S3 Transfer Acceleration"],
      answer: [0],
      explanation: "Direct Connect provides dedicated bandwidth and consistent latency between on premises and AWS.",
    },
    {
      id: "d3-36",
      domain: "d3",
      lesson: "d3-network",
      prompt:
        "A static website is hosted in an S3 bucket and served through CloudFront. The bucket must not be accessible directly, only through CloudFront. What should the architect configure?",
      options: [
        "CloudFront origin access control (OAC) with a bucket policy that allows only the distribution",
        "Make the bucket public and rely on CloudFront caching",
        "A security group on the bucket",
        "S3 Transfer Acceleration",
      ],
      answer: [0],
      explanation: "OAC lets CloudFront sign requests to S3, and the bucket policy grants access only to that distribution, keeping the bucket private.",
    },
    {
      id: "d3-37",
      domain: "d3",
      lesson: "d3-network",
      prompt:
        "An architect is creating subnets for an Auto Scaling group that may grow to 300 instances in each AZ. A colleague suggests /24 subnets. What is the issue?",
      options: [
        "A /24 has 256 addresses, of which 5 are reserved by AWS, so it can't hold 300 instances",
        "There is no issue; /24 subnets have unlimited addresses",
        "Subnets must be /16",
        "AWS reserves 50 addresses in every subnet",
      ],
      answer: [0],
      explanation: "AWS reserves five IPs in each subnet, so a /24 offers 251 usable addresses. A /23 (507 usable) fits the requirement.",
    },
    {
      id: "d3-38",
      domain: "d3",
      lesson: "d3-network",
      prompt:
        "A company's application in one Region uses TCP on a custom port and serves global users. It wants to improve latency and jitter for those users and get static IPs, without caching. Which service fits?",
      options: ["AWS Global Accelerator", "Amazon CloudFront", "Amazon Route 53 latency routing", "AWS Direct Connect"],
      answer: [0],
      explanation: "Global Accelerator brings users onto the AWS backbone at the nearest edge location, improving performance for non-HTTP TCP and UDP traffic, with static anycast IPs.",
    },
    {
      id: "d3-39",
      domain: "d3",
      lesson: "d3-network",
      type: "match",
      prompt: "Match each networking need to the service.",
      pairs: [
        ["Cache web content close to users", "Amazon CloudFront"],
        ["Static anycast IPs for a TCP/UDP app", "AWS Global Accelerator"],
        ["Hub for many VPCs and on-premises networks", "AWS Transit Gateway"],
        ["Dedicated private line to AWS", "AWS Direct Connect"],
        ["Expose one service privately to other VPCs", "AWS PrivateLink"],
      ],
      explanation: "Edge (CloudFront, Global Accelerator), multi-VPC (Transit Gateway, PrivateLink), and hybrid (Direct Connect) each solve a different problem.",
    },

    // ── Ingestion and analytics ──
    {
      id: "d3-40",
      domain: "d3",
      lesson: "d3-ingestion",
      prompt:
        "Thousands of IoT sensors send readings that must be delivered to Amazon S3 in near real time, converted to Apache Parquet, with no servers or consumer code to manage. Which service should the architect use?",
      options: ["Amazon Data Firehose with record format conversion", "Amazon Kinesis Data Streams with custom EC2 consumers", "AWS DataSync", "Amazon SQS with a cron job"],
      answer: [0],
      explanation: "Data Firehose buffers streaming data, can convert records to Parquet or ORC, and delivers to S3 with no infrastructure to manage.",
    },
    {
      id: "d3-41",
      domain: "d3",
      lesson: "d3-ingestion",
      prompt:
        "Analysts want to run ad hoc SQL queries against CSV files already stored in S3, paying only for the queries they run. Which service should they use?",
      options: ["Amazon Athena", "Amazon Redshift provisioned cluster", "Amazon RDS", "Amazon EMR with a persistent cluster"],
      answer: [0],
      explanation: "Athena is serverless SQL over data in S3, billed by data scanned, and uses the Glue Data Catalog for table definitions.",
    },
    {
      id: "d3-42",
      domain: "d3",
      lesson: "d3-ingestion",
      prompt:
        "Athena queries over a 20 TB CSV data lake are slow and expensive. Which TWO changes would reduce both query time and cost? (Choose two.)",
      options: [
        "Convert the data to a columnar format such as Apache Parquet with AWS Glue",
        "Partition the data by commonly filtered columns such as date",
        "Store the files in S3 Glacier Deep Archive",
        "Add more S3 buckets with copies of the same data",
        "Enable S3 Versioning",
      ],
      answer: [0, 1],
      explanation: "Athena bills by data scanned. Columnar, compressed formats and partitioning let queries read only the columns and partitions they need.",
    },
    {
      id: "d3-43",
      domain: "d3",
      lesson: "d3-ingestion",
      prompt:
        "A clickstream application needs several independent consumers to read the same ordered events in real time and to replay events from the last 24 hours. Which service fits?",
      options: ["Amazon Kinesis Data Streams", "Amazon SQS Standard queue", "Amazon SNS", "AWS Glue"],
      answer: [0],
      explanation: "Kinesis Data Streams keeps records in order per shard for the retention period, so many consumers can read and re-read them. SQS deletes a message once a consumer processes it.",
    },
    {
      id: "d3-44",
      domain: "d3",
      lesson: "d3-ingestion",
      prompt:
        "A company must copy 200 TB from an on-premises NFS file server to Amazon EFS over its 10 Gbps Direct Connect link, with scheduling, encryption in transit, and data integrity checks. What should the architect use?",
      options: ["AWS DataSync", "AWS Storage Gateway Tape Gateway", "rsync on a single EC2 instance", "Amazon Data Firehose"],
      answer: [0],
      explanation: "DataSync is a managed online transfer service between on-premises storage and S3, EFS, or FSx, with parallel transfer, scheduling, encryption, and verification.",
    },
    {
      id: "d3-45",
      domain: "d3",
      lesson: "d3-ingestion",
      prompt:
        "A data lake in S3 is used by several teams. The company needs central, fine-grained permissions at the database, table, column, and row level for services such as Athena. Which service should it use?",
      options: ["AWS Lake Formation", "S3 bucket policies only", "Amazon Macie", "AWS Glue DataBrew"],
      answer: [0],
      explanation: "Lake Formation manages permissions on Data Catalog resources down to column and row level, enforced for integrated analytics services.",
    },
    {
      id: "d3-46",
      domain: "d3",
      lesson: "d3-ingestion",
      type: "order",
      prompt: "Put the stages of a typical S3 data lake pipeline in order.",
      items: [
        "Ingest raw data into S3 (for example with Data Firehose or DataSync)",
        "Crawl the data with AWS Glue to populate the Data Catalog",
        "Transform it with Glue ETL into partitioned Parquet",
        "Grant access with Lake Formation",
        "Query with Athena and build dashboards in Amazon Quick",
      ],
      explanation: "Ingest, catalog, transform, govern, then analyze and visualize.",
    },
  ],

  cards: [
    { id: "s-ebs", domain: "d3", kind: "service", term: "Amazon EBS", definition: "Block storage volumes for EC2 in one AZ" },
    { id: "s-efs", domain: "d3", kind: "service", term: "Amazon EFS", definition: "Elastic, shared NFS file system across AZs for Linux" },
    { id: "s-fsxw", domain: "d3", kind: "service", term: "Amazon FSx for Windows File Server", definition: "Managed SMB file shares with Active Directory" },
    { id: "s-fsxl", domain: "d3", kind: "service", term: "Amazon FSx for Lustre", definition: "High-performance file system for HPC and ML, linkable to S3" },
    { id: "s-fsxn", domain: "d3", kind: "service", term: "Amazon FSx for NetApp ONTAP", definition: "Multi-protocol (NFS, SMB, iSCSI) file storage with ONTAP features" },
    { id: "s-storagegateway", domain: "d3", kind: "service", term: "AWS Storage Gateway", definition: "Hybrid access to cloud storage: file, volume, and tape gateways" },
    { id: "s-batch", domain: "d3", kind: "service", term: "AWS Batch", definition: "Managed job queues and compute for batch workloads" },
    { id: "s-emr", domain: "d3", kind: "service", term: "Amazon EMR", definition: "Managed Spark, Hadoop, and other big data frameworks" },
    { id: "s-ec2", domain: "d3", kind: "service", term: "Amazon EC2", definition: "Resizable virtual servers in many instance families" },
    { id: "s-rds", domain: "d3", kind: "service", term: "Amazon RDS", definition: "Managed relational databases: MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Db2" },
    { id: "s-dynamodb", domain: "d3", kind: "service", term: "Amazon DynamoDB", definition: "Serverless key-value and document database" },
    { id: "s-redshift", domain: "d3", kind: "service", term: "Amazon Redshift", definition: "Columnar data warehouse for analytic SQL" },
    { id: "s-neptune", domain: "d3", kind: "service", term: "Amazon Neptune", definition: "Graph database for highly connected data" },
    { id: "s-documentdb", domain: "d3", kind: "service", term: "Amazon DocumentDB", definition: "MongoDB-compatible document database" },
    { id: "s-keyspaces", domain: "d3", kind: "service", term: "Amazon Keyspaces", definition: "Serverless Apache Cassandra-compatible database" },
    { id: "s-elasticache", domain: "d3", kind: "service", term: "Amazon ElastiCache", definition: "Managed in-memory cache: Redis OSS, Valkey, Memcached" },
    { id: "s-dax", domain: "d3", kind: "service", term: "DynamoDB Accelerator (DAX)", definition: "Microsecond in-memory cache for DynamoDB" },
    { id: "s-dms", domain: "d3", kind: "service", term: "AWS DMS", definition: "Migrates and replicates databases with minimal downtime" },
    { id: "s-cloudfront", domain: "d3", kind: "service", term: "Amazon CloudFront", definition: "CDN that caches content at edge locations" },
    { id: "s-tgw", domain: "d3", kind: "service", term: "AWS Transit Gateway", definition: "Regional hub connecting many VPCs and on-premises networks" },
    { id: "s-dx", domain: "d3", kind: "service", term: "AWS Direct Connect", definition: "Dedicated private network connection to AWS" },
    { id: "s-kds", domain: "d3", kind: "service", term: "Amazon Kinesis Data Streams", definition: "Real-time, ordered, replayable data streams" },
    { id: "s-firehose", domain: "d3", kind: "service", term: "Amazon Data Firehose", definition: "Managed delivery of streaming data to S3, Redshift, OpenSearch, and more" },
    { id: "s-msk", domain: "d3", kind: "service", term: "Amazon MSK", definition: "Managed Apache Kafka" },
    { id: "s-glue", domain: "d3", kind: "service", term: "AWS Glue", definition: "Serverless ETL, crawlers, and the Data Catalog" },
    { id: "s-athena", domain: "d3", kind: "service", term: "Amazon Athena", definition: "Serverless SQL over data in S3, billed per data scanned" },
    { id: "s-lakeformation", domain: "d3", kind: "service", term: "AWS Lake Formation", definition: "Builds data lakes and manages fine-grained permissions on them" },
    { id: "s-quick", domain: "d3", kind: "service", term: "Amazon Quick", definition: "Dashboards, visualizations, and AI-powered business insights" },
    { id: "s-datasync", domain: "d3", kind: "service", term: "AWS DataSync", definition: "Online data transfer from on-premises storage to S3, EFS, or FSx" },
    { id: "s-snow", domain: "d3", kind: "service", term: "AWS Snow Family", definition: "Physical devices for offline data transfer and edge computing" },
    { id: "s-appflow", domain: "d3", kind: "service", term: "Amazon AppFlow", definition: "No-code data flows between SaaS apps and AWS" },
    { id: "s-opensearch", domain: "d3", kind: "service", term: "Amazon OpenSearch Service", definition: "Search and log analytics" },
    { id: "c-gp3", domain: "d3", kind: "concept", term: "gp3", definition: "General purpose SSD; 3,000 IOPS and 125 MiB/s baseline, scalable independently of size" },
    { id: "c-instancestore", domain: "d3", kind: "concept", term: "Instance store", definition: "Very fast, ephemeral host-attached storage" },
    { id: "c-cluster", domain: "d3", kind: "concept", term: "Cluster placement group", definition: "Instances packed close in one AZ for lowest latency" },
    { id: "c-spread", domain: "d3", kind: "concept", term: "Spread placement group", definition: "Each instance on distinct hardware" },
    { id: "c-partition", domain: "d3", kind: "concept", term: "Partition placement group", definition: "Groups of instances on separate racks for distributed systems" },
    { id: "c-lazy", domain: "d3", kind: "concept", term: "Lazy loading", definition: "Fill the cache on a miss; only requested data, may be stale" },
    { id: "c-writethrough", domain: "d3", kind: "concept", term: "Write-through", definition: "Update the cache on every write; always fresh" },
    { id: "c-parquet", domain: "d3", kind: "concept", term: "Columnar formats", definition: "Parquet and ORC cut the data scanned by analytic queries" },
    { id: "c-reserved5", domain: "d3", kind: "concept", term: "Reserved subnet IPs", definition: "AWS reserves 5 addresses in every subnet" },
    { id: "c-oac", domain: "d3", kind: "concept", term: "Origin access control", definition: "Lets only a CloudFront distribution read a private S3 origin" },
  ],
});
