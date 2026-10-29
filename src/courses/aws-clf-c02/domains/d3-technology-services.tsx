import { Flow, Ladder, Layers, ServiceRows, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { MultiAzLab, VpcDiagram } from "../visuals";

/**
 * Domain 3: Cloud Technology and Services (34% of scored content).
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Cloud Technology and Services",
    world: "Service Metropolis",
    weight: 34,
    emoji: "🏙️",
    color: "#a78bfa",
    summary: "Ways to use AWS, the global infrastructure, and the core services: compute, databases, networking, storage, AI/ML, analytics, and more.",
  },

  tasks: [
    {
      id: "3.1",
      title: "Define methods of deploying and operating in the AWS Cloud",
      covers: [
        "Ways to access AWS: the Management Console, programmatic access (APIs, SDKs, CLI), and infrastructure as code",
        "One-time operations compared with repeatable processes",
        "Deployment models: cloud, hybrid, on-premises",
      ],
    },
    {
      id: "3.2",
      title: "Define the AWS global infrastructure",
      covers: [
        "Regions, Availability Zones, and edge locations, and how they relate",
        "High availability with multiple Availability Zones; AZs don't share single points of failure",
        "When to use multiple Regions: disaster recovery, business continuity, low latency, data sovereignty",
      ],
    },
    {
      id: "3.3",
      title: "Identify AWS compute services",
      covers: [
        "EC2 instance types (for example, compute optimized, storage optimized)",
        "Container options (Amazon ECS, Amazon EKS) and serverless compute (AWS Fargate, AWS Lambda)",
        "Auto scaling for elasticity, and the purpose of load balancers",
      ],
    },
    {
      id: "3.4",
      title: "Identify AWS database services",
      covers: [
        "EC2-hosted databases compared with AWS managed databases",
        "Relational (Amazon RDS, Amazon Aurora), NoSQL (Amazon DynamoDB), and in-memory (Amazon ElastiCache) databases",
        "Database migration tools (AWS DMS, AWS SCT)",
      ],
    },
    {
      id: "3.5",
      title: "Identify AWS network services",
      covers: [
        "VPC components: subnets and gateways",
        "VPC security: network ACLs, security groups, Amazon Inspector",
        "The purpose of Amazon Route 53",
        "Connectivity options: AWS VPN, AWS Direct Connect",
      ],
    },
    {
      id: "3.6",
      title: "Identify AWS storage services",
      covers: [
        "Object storage and the Amazon S3 storage classes",
        "Block storage (Amazon EBS, instance store) and file services (Amazon EFS, Amazon FSx)",
        "Cached file systems (AWS Storage Gateway), lifecycle policies, and AWS Backup",
      ],
    },
    {
      id: "3.7",
      title: "Identify AWS AI/ML services and analytics services",
      covers: ["AI/ML services and the tasks they do (for example, Amazon SageMaker AI, Amazon Lex)", "Analytics services (for example, Amazon Athena, Amazon Kinesis, AWS Glue, Amazon Quick)"],
    },
    {
      id: "3.8",
      title: "Identify services from other in-scope AWS service categories",
      covers: [
        "Application integration: Amazon EventBridge, Amazon SNS, Amazon SQS",
        "Business applications: Amazon Connect, Amazon SES",
        "Developer tools: AWS CodeBuild, AWS CodePipeline, AWS X-Ray",
        "End-user computing: Amazon AppStream 2.0, Amazon WorkSpaces, Amazon WorkSpaces Secure Browser",
        "Frontend web and mobile (AWS Amplify) and IoT (AWS IoT Core)",
      ],
    },
  ],

  lessons: [
    {
      id: "d3-access",
      check: ["d3-01", "d3-05"],
      task: "3.1",
      title: "Ways to work with AWS",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "🖱️", title: "Management Console", text: "Web UI. Great for learning and one-time tasks.", color: "#a78bfa" },
              { icon: "⌨️", title: "AWS CLI", text: "Commands and scripts from a terminal.", color: "#a78bfa" },
              { icon: "🧑‍💻", title: "SDKs and APIs", text: "Call AWS from application code in your language.", color: "#a78bfa" },
              { icon: "📜", title: "Infrastructure as code", text: "AWS CloudFormation templates: repeatable, versioned environments.", color: "#a78bfa" },
            ]}
          />
          <Layers
            layers={[
              { name: "Cloud", color: "#38bdf8", items: ["Everything runs on AWS"] },
              { name: "Hybrid", color: "#a78bfa", items: ["On-premises connected to AWS", "AWS Outposts", "Direct Connect or VPN"] },
              { name: "On-premises (private cloud)", color: "#94a3b8", items: ["Your own data center"] },
            ]}
          />
        </div>
      ),
      points: [
        "One-time or exploratory task → console. Repeatable process across environments → scripts or infrastructure as code.",
        "Every console click and CLI command calls the same AWS APIs underneath.",
        "AWS Outposts brings AWS infrastructure and services into your own data center for a consistent hybrid experience.",
      ],
      tip: "\"Same environment in many accounts or Regions, consistently\" → AWS CloudFormation.",
    },
    {
      id: "d3-global",
      check: ["d3-07", "d3-08"],
      task: "3.2",
      title: "Regions, Availability Zones, and edge locations",
      visual: <MultiAzLab />,
      points: [
        "A Region is a separate geographic area with multiple Availability Zones.",
        "An Availability Zone is one or more discrete data centers with redundant power, networking, and connectivity. AZs are isolated so they don't share single points of failure.",
        "Use multiple AZs for high availability. Use multiple Regions for disaster recovery, business continuity, lower latency for distant users, or data sovereignty.",
        "Edge locations are far more numerous than Regions. CloudFront and Route 53 use them to serve users with low latency.",
      ],
      tip: "\"Survive a data center failure\" → multiple AZs. \"Survive a Regional disaster\" or \"data must stay in a country\" → Region choice.",
    },
    {
      id: "d3-compute",
      check: ["d3-13", "d3-16"],
      task: "3.3",
      title: "Compute: instances, containers, serverless",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "⚖️", title: "General purpose", text: "Balanced: web servers, code repositories.", color: "#38bdf8" },
              { icon: "🧮", title: "Compute optimized", text: "High-performance processors: batch, HPC, gaming servers.", color: "#38bdf8" },
              { icon: "🧠", title: "Memory optimized", text: "Large data sets in memory: in-memory databases.", color: "#38bdf8" },
              { icon: "💽", title: "Storage optimized", text: "High sequential reads and writes on local storage: data warehousing.", color: "#38bdf8" },
            ]}
          />
          <Layers
            layers={[
              { name: "Virtual servers", color: "#38bdf8", items: ["Amazon EC2", "Amazon Lightsail", "AWS Elastic Beanstalk", "AWS Batch"] },
              { name: "Containers", color: "#a78bfa", items: ["Amazon ECS", "Amazon EKS (Kubernetes)", "Amazon ECR (images)"] },
              { name: "Serverless", color: "#34d399", items: ["AWS Lambda", "AWS Fargate"] },
            ]}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "👥", label: "Users", sub: "Traffic arrives" },
              { icon: "⚖️", label: "Elastic Load Balancing", sub: "Spreads requests across healthy targets in many AZs" },
              { icon: "📈", label: "EC2 Auto Scaling group", sub: "Adds or removes instances with demand" },
            ]}
          />
        </div>
      ),
      points: [
        "Lambda runs code in response to events. You pay for requests and compute time, with no servers to manage.",
        "Fargate runs containers for ECS or EKS without managing servers. EKS is managed Kubernetes; ECS is AWS's own orchestrator.",
        "Auto Scaling provides elasticity. Load balancers distribute traffic and route only to healthy targets.",
        "Elastic Beanstalk deploys web apps from your code and handles capacity, load balancing, and scaling. Lightsail offers simple servers with bundled monthly pricing.",
      ],
      tip: "\"Already uses Kubernetes\" → EKS. \"Containers without managing servers\" → Fargate. \"Code runs on events\" → Lambda.",
    },
    {
      id: "d3-databases",
      check: ["d3-21", "d3-23"],
      task: "3.4",
      title: "Databases: pick the right engine",
      visual: (
        <ServiceRows
          rows={[
            { input: "Relational tables, SQL, joins", service: "Amazon RDS", output: "Managed MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Db2" },
            { input: "Relational at cloud scale", service: "Amazon Aurora", output: "MySQL- and PostgreSQL-compatible, storage replicated across 3 AZs" },
            { input: "Key-value at any scale", service: "Amazon DynamoDB", output: "Serverless NoSQL, single-digit millisecond latency" },
            { input: "Microsecond reads", service: "Amazon ElastiCache", output: "In-memory cache in front of a database" },
            { input: "JSON documents", service: "Amazon DocumentDB", output: "MongoDB-compatible document database" },
            { input: "Highly connected data", service: "Amazon Neptune", output: "Graph database: social networks, fraud rings" },
          ]}
        />
      ),
      points: [
        "Managed databases remove patching, backups, and hardware work. Choose a database on EC2 only when you need OS-level access or an engine or version a managed service doesn't offer.",
        "Amazon Redshift is a data warehouse for analytics, not a transactional database.",
        "Migrate with AWS DMS (moves the data with minimal downtime) and AWS SCT (converts the schema between engines).",
      ],
      tip: "\"Fully managed, serverless, key-value, any scale\" → DynamoDB. \"Reduce read load with caching\" → ElastiCache.",
    },
    {
      id: "d3-network",
      check: ["d3-28", "d3-30"],
      task: "3.5",
      title: "Networking: VPCs, DNS, and connections",
      visual: (
        <div className="grid gap-4">
          <VpcDiagram />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧭", title: "Amazon Route 53", text: "DNS, domain registration, health checks, and routing policies.", color: "#38bdf8" },
              { icon: "🔌", title: "AWS Direct Connect", text: "A dedicated private connection from your site to AWS.", color: "#38bdf8" },
              { icon: "🔐", title: "AWS Site-to-Site VPN", text: "Encrypted tunnels over the internet. Quick to set up.", color: "#38bdf8" },
              { icon: "🧑‍💻", title: "AWS Client VPN", text: "Remote users connect securely from their devices.", color: "#38bdf8" },
              { icon: "🕸️", title: "AWS Transit Gateway", text: "A hub that connects many VPCs and on-premises networks.", color: "#38bdf8" },
              { icon: "🌐", title: "Amazon CloudFront", text: "Content delivery network that caches at edge locations.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "A VPC is your logically isolated network. Subnets live in one AZ each; an internet gateway gives public subnets internet access; a NAT gateway gives private subnets outbound-only access.",
        "Security groups are stateful instance-level firewalls with allow rules. Network ACLs are stateless subnet-level firewalls with allow and deny rules.",
        "Amazon Inspector can also report on unintended network reachability of instances.",
        "Other services: API Gateway (publish APIs), Global Accelerator (route users over the AWS global network), PrivateLink (private access to services).",
      ],
      tip: "\"Consistent, private, high-bandwidth link\" → Direct Connect. \"Encrypted connection quickly over the internet\" → Site-to-Site VPN.",
    },
    {
      id: "d3-storage",
      check: ["d3-36", "d3-38"],
      task: "3.6",
      title: "Storage: objects, blocks, files, and archives",
      visual: (
        <div className="grid gap-4">
          <Ladder
            rungs={[
              { icon: "🧊", name: "S3 Glacier Deep Archive", text: "Lowest cost; retrieval within hours; long-term retention" },
              { icon: "❄️", name: "S3 Glacier Flexible Retrieval", text: "Archives retrieved in minutes to hours" },
              { icon: "🥶", name: "S3 Glacier Instant Retrieval", text: "Rarely accessed, but milliseconds when you need it" },
              { icon: "🌗", name: "S3 Standard-IA / One Zone-IA", text: "Infrequent access, retrieval fee; One Zone stores in a single AZ" },
              { icon: "🤖", name: "S3 Intelligent-Tiering", text: "Moves objects between tiers when access patterns change" },
              { icon: "🪣", name: "S3 Standard", text: "Frequently accessed data" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧱", title: "Amazon EBS", text: "Block volumes for one EC2 instance; persist when the instance stops.", color: "#f59e0b" },
              { icon: "⚡", title: "Instance store", text: "Temporary block storage on the host; data is lost when the instance stops.", color: "#f59e0b" },
              { icon: "📁", title: "Amazon EFS", text: "Shared, elastic file system for many Linux instances.", color: "#f59e0b" },
              { icon: "🗄️", title: "Amazon FSx", text: "Managed file systems such as Windows File Server and Lustre.", color: "#f59e0b" },
              { icon: "🌉", title: "AWS Storage Gateway", text: "On-premises access to cloud storage with a local cache.", color: "#f59e0b" },
              { icon: "💾", title: "AWS Backup", text: "Central, policy-based backups across AWS services.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "S3 is object storage: virtually unlimited, for backups, data lakes, media, and static website assets.",
        "Lifecycle policies move objects to cheaper classes after a set time, and can delete them when they expire.",
        "AWS Elastic Disaster Recovery replicates servers to AWS so you can recover quickly.",
      ],
      tip: "\"Unknown or changing access\" → Intelligent-Tiering. \"Keep 7 years, rarely read, cheapest\" → Glacier Deep Archive.",
    },
    {
      id: "d3-more",
      check: ["d3-44", "d3-51"],
      task: "3.7 · 3.8",
      title: "AI, analytics, and the rest of the toolbox",
      visual: (
        <div className="grid gap-4">
          <ServiceRows
            rows={[
              { input: "Images and video", service: "Amazon Rekognition", output: "Objects, faces, unsafe content" },
              { input: "Text", service: "Amazon Comprehend", output: "Sentiment, key phrases, entities" },
              { input: "Text", service: "Amazon Polly", output: "Lifelike speech" },
              { input: "Speech", service: "Amazon Transcribe", output: "Text transcripts" },
              { input: "Text in one language", service: "Amazon Translate", output: "Text in another" },
              { input: "Scanned documents", service: "Amazon Textract", output: "Text, forms, and tables" },
              { input: "Voice or chat", service: "Amazon Lex", output: "Conversational chatbot" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🔎", title: "Amazon Athena", text: "Serverless SQL queries on data in S3.", color: "#34d399" },
              { icon: "🌊", title: "Amazon Kinesis", text: "Collect and process streaming data in real time.", color: "#34d399" },
              { icon: "🧪", title: "AWS Glue", text: "Serverless data integration (ETL) and a data catalog.", color: "#34d399" },
              { icon: "📊", title: "Amazon Quick", text: "AI-powered business intelligence dashboards and insights.", color: "#34d399" },
              { icon: "🏬", title: "Amazon Redshift", text: "Data warehouse for analytics.", color: "#34d399" },
              { icon: "🐘", title: "Amazon EMR", text: "Big data frameworks such as Apache Spark.", color: "#34d399" },
              { icon: "🔍", title: "Amazon OpenSearch Service", text: "Search and log analytics.", color: "#34d399" },
              { icon: "🧠", title: "Amazon SageMaker AI", text: "Build, train, and deploy your own ML models.", color: "#34d399" },
            ]}
          />
          <Layers
            layers={[
              { name: "Messaging", color: "#f59e0b", items: ["SQS: queue to decouple", "SNS: pub/sub notifications", "EventBridge: event bus and rules", "Step Functions: workflows"] },
              { name: "Business apps", color: "#38bdf8", items: ["Amazon Connect: contact center", "Amazon SES: email"] },
              { name: "Developer tools", color: "#a78bfa", items: ["CodeBuild: build and test", "CodePipeline: release pipeline", "X-Ray: trace requests"] },
              { name: "End-user computing", color: "#f87171", items: ["WorkSpaces: virtual desktops", "AppStream 2.0: stream apps", "WorkSpaces Secure Browser"] },
              { name: "Web, mobile, IoT", color: "#34d399", items: ["AWS Amplify: full-stack web and mobile apps", "AWS IoT Core: connect devices"] },
            ]}
          />
        </div>
      ),
      points: [
        "Pre-built AI services need no ML expertise. SageMaker AI is for building your own models. Amazon Q is a generative AI assistant for work and for building on AWS.",
        "SQS stores messages until a consumer processes them; SNS pushes one message to many subscribers (email, SMS, Lambda, SQS).",
        "AWS Support also belongs here: it's AWS's customer enablement service.",
      ],
      tip: "\"Decouple components\" → SQS. \"Send alerts to many subscribers\" → SNS. \"React to events with rules\" → EventBridge.",
    },
  ],

  questions: [
    // ── Access and deployment models ──
    {
      id: "d3-01",
      domain: "d3",
      lesson: "d3-access",
      prompt: "A company must create the same network, servers, and databases in five accounts, repeatably and with version control. Which approach should it use?",
      options: ["Click through the AWS Management Console in each account", "Infrastructure as code with AWS CloudFormation", "Email instructions to each team", "Open an AWS Support case"],
      answer: [1],
      explanation: "Infrastructure as code describes resources in templates, so environments are consistent, repeatable, and versioned.",
    },
    {
      id: "d3-02",
      domain: "d3",
      lesson: "d3-access",
      prompt: "A new employee wants to explore Amazon S3 for the first time and create one test bucket. What is the SIMPLEST way?",
      options: ["The AWS Management Console", "An AWS CloudFormation stack set", "A custom SDK application", "AWS Direct Connect"],
      answer: [0],
      explanation: "The console is ideal for learning and one-time tasks. Repeatable processes belong in scripts or IaC.",
    },
    {
      id: "d3-03",
      domain: "d3",
      lesson: "d3-access",
      prompt: "A developer wants an application written in Python to upload files to Amazon S3. What should the code use?",
      options: ["An AWS SDK", "The AWS Management Console", "AWS Artifact", "Amazon WorkSpaces"],
      answer: [0],
      explanation: "AWS SDKs let applications call AWS APIs in their own language. The AWS CLI does the same from a terminal.",
    },
    {
      id: "d3-04",
      domain: "d3",
      lesson: "d3-access",
      prompt: "A company keeps some applications in its own data center for latency reasons and runs others on AWS, with private connectivity between them. Which deployment model is this?",
      options: ["Cloud", "Hybrid", "On-premises only", "Multi-Region active-active"],
      answer: [1],
      explanation: "Hybrid connects on-premises infrastructure with the cloud. AWS Outposts, Direct Connect, and VPN all support hybrid designs.",
    },
    {
      id: "d3-05",
      domain: "d3",
      lesson: "d3-access",
      prompt: "Which are benefits of managing infrastructure as code? (Choose two.)",
      options: [
        "Consistent, repeatable environments",
        "Changes can be reviewed and tracked in version control",
        "Every change requires clicking in the console",
        "It removes the need to test changes",
        "It only works in one Region",
      ],
      answer: [0, 1],
      explanation: "IaC makes infrastructure repeatable and reviewable like application code. Testing is still needed.",
    },
    {
      id: "d3-06",
      domain: "d3",
      lesson: "d3-access",
      prompt: "A factory needs AWS services to run on premises with very low latency to its equipment, using the same APIs and tools as in the cloud. Which service fits?",
      options: ["AWS Outposts", "Amazon Lightsail", "AWS Global Accelerator", "Amazon S3 Glacier"],
      answer: [0],
      explanation: "AWS Outposts delivers AWS infrastructure and services to your own site for a consistent hybrid experience.",
    },
    // ── Global infrastructure ──
    {
      id: "d3-07",
      domain: "d3",
      lesson: "d3-global",
      prompt: "What is an Availability Zone?",
      options: [
        "One or more discrete data centers with redundant power, networking, and connectivity within a Region",
        "A single server rack",
        "A content cache in a city",
        "A group of Regions on the same continent",
      ],
      answer: [0],
      explanation: "Each Region has multiple isolated AZs. They're close enough for low-latency links but separate enough to avoid shared failures.",
    },
    {
      id: "d3-08",
      domain: "d3",
      lesson: "d3-global",
      prompt: "A company wants its application to stay available if one data center fails. What should it do?",
      options: [
        "Run the application in multiple Availability Zones behind a load balancer",
        "Use a larger instance in one Availability Zone",
        "Turn on AWS Budgets",
        "Store backups on the same instance",
      ],
      answer: [0],
      explanation: "AZs don't share single points of failure, so spreading across them keeps the app running when one has a problem.",
    },
    {
      id: "d3-09",
      domain: "d3",
      lesson: "d3-global",
      prompt: "Which are valid reasons to deploy a workload in more than one AWS Region? (Choose two.)",
      options: [
        "Disaster recovery if an entire Region becomes unavailable",
        "Lower latency for users on another continent",
        "Because Availability Zones in a Region share one data center",
        "To raise the number of IAM users allowed",
        "Because data transfer between Regions is always free",
      ],
      answer: [0, 1],
      explanation: "Multiple Regions support disaster recovery, business continuity, low latency for distant users, and data sovereignty. Inter-Region transfer is charged.",
    },
    {
      id: "d3-10",
      domain: "d3",
      lesson: "d3-global",
      prompt: "A video site wants images and videos to load quickly for users worldwide by caching them close to viewers. Which part of the global infrastructure does this use?",
      options: ["Edge locations", "Availability Zones only", "AWS Outposts", "Dedicated Hosts"],
      answer: [0],
      explanation: "Amazon CloudFront caches content at edge locations around the world, reducing latency for viewers.",
    },
    {
      id: "d3-11",
      domain: "d3",
      lesson: "d3-global",
      prompt: "A law requires that a company's customer data stays inside one country. What should the company do?",
      options: [
        "Store the data in an AWS Region located in that country",
        "Enable CloudFront in every edge location",
        "Use a single Availability Zone in any Region",
        "Turn on consolidated billing",
      ],
      answer: [0],
      explanation: "You choose the Region where data is stored, and AWS doesn't move it out of that Region unless you do. This supports data sovereignty.",
    },
    {
      id: "d3-12",
      domain: "d3",
      lesson: "d3-global",
      type: "order",
      prompt: "Order these from the LARGEST to the SMALLEST.",
      items: ["AWS Region", "Availability Zone", "Data center"],
      explanation: "A Region contains multiple AZs, and each AZ is one or more data centers.",
    },
    // ── Compute ──
    {
      id: "d3-13",
      domain: "d3",
      lesson: "d3-compute",
      prompt: "A company runs scientific modeling and batch processing that needs high-performance processors. Which EC2 instance family should it choose?",
      options: ["Compute optimized", "Memory optimized", "Storage optimized", "General purpose"],
      answer: [0],
      explanation: "Compute optimized instances suit compute-bound work such as batch processing, HPC, and gaming servers.",
    },
    {
      id: "d3-14",
      domain: "d3",
      lesson: "d3-compute",
      prompt: "A data warehousing workload needs very high sequential read and write access to large data sets on local storage. Which EC2 instance family fits BEST?",
      options: ["Storage optimized", "Compute optimized", "Accelerated computing", "General purpose"],
      answer: [0],
      explanation: "Storage optimized instances deliver high, low-latency I/O to local storage.",
    },
    {
      id: "d3-15",
      domain: "d3",
      lesson: "d3-compute",
      prompt: "A team wants to run containers without provisioning or managing any servers or clusters of EC2 instances. Which service should it use?",
      options: ["AWS Fargate", "Amazon EC2 Dedicated Hosts", "AWS Outposts", "Amazon Lightsail"],
      answer: [0],
      explanation: "Fargate is serverless compute for containers, working with Amazon ECS and Amazon EKS.",
    },
    {
      id: "d3-16",
      domain: "d3",
      lesson: "d3-compute",
      prompt: "A company already runs Kubernetes on premises and wants a managed Kubernetes control plane on AWS. Which service should it choose?",
      options: ["Amazon EKS", "Amazon ECS", "AWS Lambda", "AWS Batch"],
      answer: [0],
      explanation: "Amazon EKS is managed Kubernetes. Amazon ECS is AWS's own container orchestrator.",
    },
    {
      id: "d3-17",
      domain: "d3",
      lesson: "d3-compute",
      prompt: "A shopping site wants EC2 capacity to grow during a sale and shrink afterwards, automatically. What provides this elasticity?",
      options: ["Amazon EC2 Auto Scaling", "AWS Artifact", "Amazon Route 53 domain registration", "An EBS snapshot"],
      answer: [0],
      explanation: "Auto Scaling adds and removes instances based on demand or a schedule.",
    },
    {
      id: "d3-18",
      domain: "d3",
      lesson: "d3-compute",
      prompt: "What is the main purpose of Elastic Load Balancing?",
      options: [
        "Distribute incoming traffic across multiple targets, such as EC2 instances in several AZs",
        "Store objects durably",
        "Encrypt data at rest",
        "Track API calls",
      ],
      answer: [0],
      explanation: "Load balancers spread requests across healthy targets and stop sending traffic to unhealthy ones.",
    },
    {
      id: "d3-19",
      domain: "d3",
      lesson: "d3-compute",
      prompt: "Which are serverless compute options on AWS? (Choose two.)",
      options: ["AWS Lambda", "AWS Fargate", "Amazon EC2 Dedicated Hosts", "Amazon Lightsail instances", "AWS Outposts"],
      answer: [0, 1],
      explanation: "Lambda runs functions and Fargate runs containers, both without servers to manage.",
    },
    {
      id: "d3-20",
      domain: "d3",
      lesson: "d3-compute",
      type: "match",
      prompt: "Match each compute service to its description.",
      pairs: [
        ["Amazon Lightsail", "Simple virtual servers with bundled monthly pricing"],
        ["AWS Elastic Beanstalk", "Upload code; AWS handles capacity, load balancing, and scaling"],
        ["AWS Batch", "Run batch computing jobs at any scale"],
        ["Amazon ECR", "Store and manage container images"],
        ["AWS Outposts", "AWS infrastructure in your own data center"],
      ],
      explanation: "Each compute option trades control for convenience differently.",
    },
    // ── Databases ──
    {
      id: "d3-21",
      domain: "d3",
      lesson: "d3-databases",
      prompt: "A company wants a managed relational database running PostgreSQL, with automated backups and patching handled by AWS. Which service should it use?",
      options: ["Amazon RDS", "Amazon DynamoDB", "Amazon ElastiCache", "Amazon Neptune"],
      answer: [0],
      explanation: "Amazon RDS manages relational engines, including PostgreSQL, MySQL, MariaDB, Oracle, and SQL Server.",
    },
    {
      id: "d3-22",
      domain: "d3",
      lesson: "d3-databases",
      prompt: "Which AWS database is MySQL- and PostgreSQL-compatible, built for the cloud, and stores data across three Availability Zones?",
      options: ["Amazon Aurora", "Amazon Redshift", "Amazon DocumentDB", "Amazon DynamoDB"],
      answer: [0],
      explanation: "Aurora is a cloud-native relational database whose storage keeps copies across three AZs.",
    },
    {
      id: "d3-23",
      domain: "d3",
      lesson: "d3-databases",
      prompt: "A mobile game needs a serverless key-value database with single-digit millisecond latency at any scale. Which service fits?",
      options: ["Amazon DynamoDB", "Amazon RDS for MySQL", "Amazon Redshift", "Amazon Aurora"],
      answer: [0],
      explanation: "DynamoDB is a fully managed, serverless NoSQL database designed for consistent low latency at any scale.",
    },
    {
      id: "d3-24",
      domain: "d3",
      lesson: "d3-databases",
      prompt: "A web app runs the same database queries thousands of times a second. The company wants microsecond reads and less load on the database. What should it add?",
      options: ["Amazon ElastiCache", "AWS Backup", "Amazon S3 Glacier", "AWS DMS"],
      answer: [0],
      explanation: "ElastiCache is an in-memory cache that serves frequent reads quickly and offloads the database.",
    },
    {
      id: "d3-25",
      domain: "d3",
      lesson: "d3-databases",
      prompt: "When would a company choose to run a database on Amazon EC2 instead of using Amazon RDS?",
      options: [
        "When it needs full control of the operating system or an engine version RDS doesn't support",
        "When it wants AWS to handle patching",
        "When it wants automated backups without any effort",
        "When it wants the least operational overhead",
      ],
      answer: [0],
      explanation: "Self-managing on EC2 gives full control but makes you responsible for patching, backups, and high availability.",
    },
    {
      id: "d3-26",
      domain: "d3",
      lesson: "d3-databases",
      prompt: "Which are NoSQL database services? (Choose two.)",
      options: ["Amazon DynamoDB", "Amazon DocumentDB", "Amazon Aurora", "Amazon RDS for PostgreSQL", "Amazon Redshift"],
      answer: [0, 1],
      explanation: "DynamoDB (key-value) and DocumentDB (document) are NoSQL. Aurora and RDS are relational; Redshift is a data warehouse.",
    },
    {
      id: "d3-27",
      domain: "d3",
      lesson: "d3-databases",
      type: "match",
      prompt: "Match each need to the database service.",
      pairs: [
        ["Find relationships in a social network", "Amazon Neptune"],
        ["Store JSON documents, MongoDB-compatible", "Amazon DocumentDB"],
        ["Analytics across petabytes of data", "Amazon Redshift"],
        ["Cache frequent queries in memory", "Amazon ElastiCache"],
      ],
      explanation: "Choose a purpose-built database for the data model: graph, document, warehouse, or cache.",
    },
    // ── Networking ──
    {
      id: "d3-28",
      domain: "d3",
      lesson: "d3-network",
      prompt: "What is Amazon VPC?",
      options: [
        "A logically isolated virtual network where you launch AWS resources",
        "A content delivery network",
        "A DNS service",
        "A virtual desktop service",
      ],
      answer: [0],
      explanation: "A VPC is your own network in AWS, with subnets, route tables, gateways, and firewall rules you control.",
    },
    {
      id: "d3-29",
      domain: "d3",
      lesson: "d3-network",
      prompt: "Instances in a private subnet must download software updates from the internet, but must not accept inbound connections from it. What should be used?",
      options: ["A NAT gateway", "An internet gateway attached directly to the instances", "AWS Direct Connect", "Amazon Route 53"],
      answer: [0],
      explanation: "A NAT gateway lets private instances start outbound connections while blocking unsolicited inbound traffic.",
    },
    {
      id: "d3-30",
      domain: "d3",
      lesson: "d3-network",
      prompt: "Which VPC feature acts as a STATELESS firewall at the subnet level and supports both allow and deny rules?",
      options: ["Network ACL", "Security group", "Internet gateway", "Route table"],
      answer: [0],
      explanation: "Network ACLs are stateless and work at the subnet. Security groups are stateful, work at the instance, and only allow.",
    },
    {
      id: "d3-31",
      domain: "d3",
      lesson: "d3-network",
      prompt: "A company wants to register a domain name and route users to the healthiest endpoint using health checks. Which service should it use?",
      options: ["Amazon Route 53", "Amazon CloudFront", "AWS Transit Gateway", "Amazon API Gateway"],
      answer: [0],
      explanation: "Route 53 is a highly available DNS service with domain registration, health checks, and routing policies.",
    },
    {
      id: "d3-32",
      domain: "d3",
      lesson: "d3-network",
      prompt: "A company needs a dedicated, private network connection from its data center to AWS with consistent performance that doesn't travel over the public internet. Which service fits?",
      options: ["AWS Direct Connect", "AWS Site-to-Site VPN", "Amazon CloudFront", "AWS Client VPN"],
      answer: [0],
      explanation: "Direct Connect provides a dedicated private link. A VPN encrypts traffic but rides over the internet.",
    },
    {
      id: "d3-33",
      domain: "d3",
      lesson: "d3-network",
      prompt: "A company needs an encrypted connection between its office network and its VPC, set up quickly over the existing internet connection. Which service should it use?",
      options: ["AWS Site-to-Site VPN", "AWS Direct Connect", "Amazon Route 53", "AWS Global Accelerator"],
      answer: [0],
      explanation: "Site-to-Site VPN creates IPsec tunnels over the internet. It can be set up in minutes, unlike a Direct Connect circuit.",
    },
    {
      id: "d3-34",
      domain: "d3",
      lesson: "d3-network",
      prompt: "Which statements about security groups are correct? (Choose two.)",
      options: [
        "They are stateful: return traffic is automatically allowed",
        "They support allow rules only",
        "They apply to whole subnets",
        "They support explicit deny rules",
        "Their rules are evaluated in numbered order",
      ],
      answer: [0, 1],
      explanation: "Security groups are stateful, instance-level, and allow-only. Network ACLs are the subnet-level, stateless, numbered, allow-and-deny option.",
    },
    {
      id: "d3-35",
      domain: "d3",
      lesson: "d3-network",
      prompt: "A company has dozens of VPCs and several on-premises networks. It wants to connect them through one central hub instead of many point-to-point links. Which service should it use?",
      options: ["AWS Transit Gateway", "Amazon CloudFront", "Amazon Route 53", "AWS Client VPN"],
      answer: [0],
      explanation: "Transit Gateway acts as a regional hub that connects VPCs and on-premises networks.",
    },
    // ── Storage ──
    {
      id: "d3-36",
      domain: "d3",
      lesson: "d3-storage",
      prompt: "A company stores monthly reports that are rarely read, but must be available in milliseconds when someone opens one. It wants lower storage cost than S3 Standard. Which class fits?",
      options: ["S3 Standard-IA", "S3 Glacier Deep Archive", "S3 Glacier Flexible Retrieval", "EC2 instance store"],
      answer: [0],
      explanation: "S3 Standard-IA is for infrequently accessed data that still needs fast access. It charges a per-GB retrieval fee.",
    },
    {
      id: "d3-37",
      domain: "d3",
      lesson: "d3-storage",
      prompt: "A data lake has objects whose access patterns are unknown and change over time. The company wants S3 to optimize costs automatically without performance impact. Which class should it use?",
      options: ["S3 Intelligent-Tiering", "S3 One Zone-IA", "S3 Glacier Deep Archive", "S3 Standard only"],
      answer: [0],
      explanation: "Intelligent-Tiering moves objects between access tiers as their access patterns change.",
    },
    {
      id: "d3-38",
      domain: "d3",
      lesson: "d3-storage",
      prompt: "Regulations require keeping records for 7 years. They're almost never read, and a retrieval time of up to 12 hours is acceptable. Which storage class is the MOST cost-effective?",
      options: ["S3 Glacier Deep Archive", "S3 Standard", "S3 Standard-IA", "S3 Glacier Instant Retrieval"],
      answer: [0],
      explanation: "Glacier Deep Archive is the lowest-cost S3 class, designed for long-term retention with retrieval in hours.",
    },
    {
      id: "d3-39",
      domain: "d3",
      lesson: "d3-storage",
      prompt: "Which are block storage options for Amazon EC2? (Choose two.)",
      options: ["Amazon EBS", "EC2 instance store", "Amazon S3", "Amazon EFS", "Amazon S3 Glacier"],
      answer: [0, 1],
      explanation: "EBS volumes persist independently of the instance; instance store is temporary block storage on the host. S3 is object storage and EFS is file storage.",
    },
    {
      id: "d3-40",
      domain: "d3",
      lesson: "d3-storage",
      type: "match",
      prompt: "Match each storage need to the service.",
      pairs: [
        ["Persistent block volume for one EC2 instance", "Amazon EBS"],
        ["Shared file system for many Linux instances", "Amazon EFS"],
        ["Windows file shares for Windows applications", "Amazon FSx"],
        ["On-premises access to cloud storage with a local cache", "AWS Storage Gateway"],
        ["Objects such as images, backups, and logs", "Amazon S3"],
      ],
      explanation: "Block, file, hybrid cached, and object storage each serve different access patterns.",
    },
    {
      id: "d3-41",
      domain: "d3",
      lesson: "d3-storage",
      prompt: "A company wants log files in S3 moved to a cheaper storage class after 30 days and deleted after one year, automatically. What should it configure?",
      options: ["An S3 Lifecycle configuration", "An IAM password policy", "An AWS Budgets action", "An EBS snapshot schedule"],
      answer: [0],
      explanation: "Lifecycle rules transition objects between storage classes and expire them on a schedule.",
    },
    {
      id: "d3-42",
      domain: "d3",
      lesson: "d3-storage",
      prompt: "A company wants one place to define backup policies and schedules for its EBS volumes, RDS databases, DynamoDB tables, and EFS file systems. Which service should it use?",
      options: ["AWS Backup", "AWS Storage Gateway", "Amazon S3 Transfer Acceleration", "AWS Artifact"],
      answer: [0],
      explanation: "AWS Backup centralizes and automates backups across many AWS services.",
    },
    {
      id: "d3-43",
      domain: "d3",
      lesson: "d3-storage",
      type: "order",
      prompt: "Order these S3 storage classes from the HIGHEST storage price per GB to the LOWEST.",
      items: ["S3 Standard", "S3 Standard-IA", "S3 Glacier Flexible Retrieval", "S3 Glacier Deep Archive"],
      explanation: "Colder classes cost less to store but more, and take longer, to retrieve.",
    },
    // ── AI/ML, analytics, and other services ──
    {
      id: "d3-44",
      domain: "d3",
      lesson: "d3-more",
      prompt: "A data science team wants to build, train, and deploy its own machine learning models with managed infrastructure. Which service should it use?",
      options: ["Amazon SageMaker AI", "Amazon Polly", "Amazon Athena", "AWS Glue"],
      answer: [0],
      explanation: "SageMaker AI covers the full ML lifecycle for custom models. Pre-built AI services need no model building.",
    },
    {
      id: "d3-45",
      domain: "d3",
      lesson: "d3-more",
      prompt: "A bank wants a chatbot that understands customers' voice and text requests, such as checking a balance. Which service builds conversational interfaces?",
      options: ["Amazon Lex", "Amazon Textract", "Amazon Rekognition", "Amazon Kinesis"],
      answer: [0],
      explanation: "Amazon Lex builds conversational interfaces with speech recognition and language understanding.",
    },
    {
      id: "d3-46",
      domain: "d3",
      lesson: "d3-more",
      type: "match",
      prompt: "Match each AI service to its task.",
      pairs: [
        ["Amazon Rekognition", "Analyze images and video"],
        ["Amazon Polly", "Turn text into lifelike speech"],
        ["Amazon Transcribe", "Turn speech into text"],
        ["Amazon Translate", "Translate text between languages"],
        ["Amazon Comprehend", "Find sentiment and key phrases in text"],
        ["Amazon Textract", "Extract text and tables from scanned documents"],
      ],
      explanation: "Pre-built AI services are called through an API and need no ML expertise.",
    },
    {
      id: "d3-47",
      domain: "d3",
      lesson: "d3-more",
      prompt: "Analysts want to run standard SQL queries directly against log files stored in Amazon S3, without loading them into a database or managing servers. Which service should they use?",
      options: ["Amazon Athena", "Amazon RDS", "Amazon ElastiCache", "AWS Lambda"],
      answer: [0],
      explanation: "Athena is serverless, interactive SQL over data in S3. You pay for the data scanned.",
    },
    {
      id: "d3-48",
      domain: "d3",
      lesson: "d3-more",
      prompt: "A company needs to collect and process clickstream data from its website in real time. Which service should it use?",
      options: ["Amazon Kinesis", "Amazon S3 Glacier", "AWS Glue DataBrew", "Amazon Lightsail"],
      answer: [0],
      explanation: "Kinesis ingests and processes streaming data in real time.",
    },
    {
      id: "d3-49",
      domain: "d3",
      lesson: "d3-more",
      prompt: "A company wants a serverless service to discover its data, catalog it, and run extract, transform, and load (ETL) jobs. Which service fits?",
      options: ["AWS Glue", "Amazon Connect", "AWS X-Ray", "Amazon SES"],
      answer: [0],
      explanation: "AWS Glue is serverless data integration with a central Data Catalog and ETL jobs.",
    },
    {
      id: "d3-50",
      domain: "d3",
      lesson: "d3-more",
      prompt: "Business users want interactive dashboards and AI-powered insights from company data without managing BI servers. Which service should they use?",
      options: ["Amazon Quick", "Amazon EMR", "AWS CodeBuild", "Amazon Neptune"],
      answer: [0],
      explanation: "Amazon Quick provides business intelligence dashboards and AI-powered insights over your data.",
    },
    {
      id: "d3-51",
      domain: "d3",
      lesson: "d3-more",
      prompt: "An order service must hand work to a payment service without the two depending on each other being available at the same moment. Messages should wait until they're processed. Which service fits?",
      options: ["Amazon SQS", "Amazon SNS", "Amazon Route 53", "Amazon CloudWatch"],
      answer: [0],
      explanation: "SQS queues messages so producers and consumers are decoupled. SNS pushes messages to subscribers immediately.",
    },
    {
      id: "d3-52",
      domain: "d3",
      lesson: "d3-more",
      prompt: "A company wants to send an alert to an operations email list, an SMS number, and a Lambda function whenever a critical event happens. Which service publishes one message to all of them?",
      options: ["Amazon SNS", "Amazon SQS", "AWS Glue", "Amazon Athena"],
      answer: [0],
      explanation: "SNS is a publish/subscribe service that fans out a message to many subscribers and endpoints.",
    },
    {
      id: "d3-53",
      domain: "d3",
      lesson: "d3-more",
      prompt: "A retailer wants to send order confirmation emails to customers and run a cloud contact center for its support team. Which services should it use? (Choose two.)",
      options: ["Amazon SES", "Amazon Connect", "AWS Amplify", "Amazon Athena", "AWS Glue"],
      answer: [0, 1],
      explanation: "Amazon SES sends transactional and marketing email. Amazon Connect is a cloud contact center.",
    },
    {
      id: "d3-54",
      domain: "d3",
      lesson: "d3-more",
      prompt: "Which services help teams build, deploy, and troubleshoot applications? (Choose two.)",
      options: ["AWS CodePipeline", "AWS X-Ray", "Amazon Connect", "Amazon WorkSpaces", "AWS Artifact"],
      answer: [0, 1],
      explanation: "CodePipeline automates release pipelines (with CodeBuild compiling and testing) and X-Ray traces requests to find problems.",
    },
    {
      id: "d3-55",
      domain: "d3",
      lesson: "d3-more",
      type: "match",
      prompt: "Match each service to what it does.",
      pairs: [
        ["Amazon EventBridge", "Route events to targets using rules"],
        ["AWS Amplify", "Build and host full-stack web and mobile apps"],
        ["AWS IoT Core", "Connect and manage IoT devices"],
        ["Amazon WorkSpaces", "Managed virtual desktops for employees"],
        ["Amazon AppStream 2.0", "Stream desktop applications to a browser"],
      ],
      explanation: "These cover application integration, frontend, IoT, and end-user computing.",
    },
  ],

  cards: [
    { id: "c3-region", domain: "d3", kind: "concept", term: "Region", definition: "Separate geographic area with multiple Availability Zones" },
    { id: "c3-az", domain: "d3", kind: "concept", term: "Availability Zone", definition: "One or more isolated data centers in a Region" },
    { id: "c3-edge", domain: "d3", kind: "concept", term: "Edge location", definition: "Site that caches content close to users (CloudFront)" },
    { id: "c3-hybrid", domain: "d3", kind: "concept", term: "Hybrid deployment", definition: "On-premises connected to the cloud" },
    { id: "c3-iac", domain: "d3", kind: "concept", term: "Infrastructure as code", definition: "Define resources in templates: repeatable, versioned" },
    { id: "c3-sgnacl", domain: "d3", kind: "concept", term: "Security group vs NACL", definition: "Stateful instance allow-only vs stateless subnet allow and deny" },
    { id: "c3-nat", domain: "d3", kind: "concept", term: "NAT gateway", definition: "Outbound-only internet access for private subnets" },
    { id: "c3-lifecycle", domain: "d3", kind: "concept", term: "S3 Lifecycle", definition: "Transition objects to cheaper classes and expire them" },
    { id: "c3-instancestore", domain: "d3", kind: "concept", term: "Instance store", definition: "Temporary block storage; lost when the instance stops" },
    { id: "s-ec2", domain: "d3", kind: "service", term: "Amazon EC2", definition: "Resizable virtual servers" },
    { id: "s-lambda", domain: "d3", kind: "service", term: "AWS Lambda", definition: "Run code on events without managing servers" },
    { id: "s-fargate", domain: "d3", kind: "service", term: "AWS Fargate", definition: "Serverless compute for containers" },
    { id: "s-ecs", domain: "d3", kind: "service", term: "Amazon ECS", definition: "AWS's container orchestration service" },
    { id: "s-eks", domain: "d3", kind: "service", term: "Amazon EKS", definition: "Managed Kubernetes" },
    { id: "s-ecr", domain: "d3", kind: "service", term: "Amazon ECR", definition: "Container image registry" },
    { id: "s-beanstalk", domain: "d3", kind: "service", term: "AWS Elastic Beanstalk", definition: "Deploy web apps; AWS handles capacity and scaling" },
    { id: "s-lightsail", domain: "d3", kind: "service", term: "Amazon Lightsail", definition: "Simple servers with bundled monthly pricing" },
    { id: "s-batch", domain: "d3", kind: "service", term: "AWS Batch", definition: "Run batch computing jobs at any scale" },
    { id: "s-outposts", domain: "d3", kind: "service", term: "AWS Outposts", definition: "AWS infrastructure in your data center" },
    { id: "s-elb", domain: "d3", kind: "service", term: "Elastic Load Balancing", definition: "Distribute traffic across healthy targets" },
    { id: "s-autoscaling", domain: "d3", kind: "service", term: "AWS Auto Scaling", definition: "Scale capacity with demand" },
    { id: "s-cloudformation", domain: "d3", kind: "service", term: "AWS CloudFormation", definition: "Infrastructure as code with templates" },
    { id: "s-rds", domain: "d3", kind: "service", term: "Amazon RDS", definition: "Managed relational databases" },
    { id: "s-aurora", domain: "d3", kind: "service", term: "Amazon Aurora", definition: "Cloud-native MySQL/PostgreSQL-compatible database" },
    { id: "s-dynamodb", domain: "d3", kind: "service", term: "Amazon DynamoDB", definition: "Serverless key-value NoSQL database" },
    { id: "s-elasticache", domain: "d3", kind: "service", term: "Amazon ElastiCache", definition: "In-memory caching" },
    { id: "s-documentdb", domain: "d3", kind: "service", term: "Amazon DocumentDB", definition: "MongoDB-compatible document database" },
    { id: "s-neptune", domain: "d3", kind: "service", term: "Amazon Neptune", definition: "Graph database" },
    { id: "s-vpc", domain: "d3", kind: "service", term: "Amazon VPC", definition: "Logically isolated virtual network" },
    { id: "s-route53", domain: "d3", kind: "service", term: "Amazon Route 53", definition: "DNS, domain registration, health checks" },
    { id: "s-cloudfront", domain: "d3", kind: "service", term: "Amazon CloudFront", definition: "Content delivery network at edge locations" },
    { id: "s-directconnect", domain: "d3", kind: "service", term: "AWS Direct Connect", definition: "Dedicated private connection to AWS" },
    { id: "s-vpn", domain: "d3", kind: "service", term: "AWS Site-to-Site VPN", definition: "Encrypted tunnels to AWS over the internet" },
    { id: "s-tgw", domain: "d3", kind: "service", term: "AWS Transit Gateway", definition: "Hub connecting many VPCs and on-premises networks" },
    { id: "s-apigw", domain: "d3", kind: "service", term: "Amazon API Gateway", definition: "Create, publish, and secure APIs" },
    { id: "s-globalacc", domain: "d3", kind: "service", term: "AWS Global Accelerator", definition: "Route users over the AWS global network" },
    { id: "s-s3", domain: "d3", kind: "service", term: "Amazon S3", definition: "Object storage" },
    { id: "s-glacier", domain: "d3", kind: "service", term: "Amazon S3 Glacier", definition: "Low-cost archive storage classes" },
    { id: "s-ebs", domain: "d3", kind: "service", term: "Amazon EBS", definition: "Block volumes for EC2" },
    { id: "s-efs", domain: "d3", kind: "service", term: "Amazon EFS", definition: "Shared elastic file system for Linux" },
    { id: "s-fsx", domain: "d3", kind: "service", term: "Amazon FSx", definition: "Managed file systems (Windows File Server, Lustre, and more)" },
    { id: "s-storagegw", domain: "d3", kind: "service", term: "AWS Storage Gateway", definition: "On-premises access to cloud storage" },
    { id: "s-backup", domain: "d3", kind: "service", term: "AWS Backup", definition: "Central backup policies across services" },
    { id: "s-sagemaker", domain: "d3", kind: "service", term: "Amazon SageMaker AI", definition: "Build, train, and deploy ML models" },
    { id: "s-lex", domain: "d3", kind: "service", term: "Amazon Lex", definition: "Conversational chatbots" },
    { id: "s-rekognition", domain: "d3", kind: "service", term: "Amazon Rekognition", definition: "Image and video analysis" },
    { id: "s-polly", domain: "d3", kind: "service", term: "Amazon Polly", definition: "Text to speech" },
    { id: "s-transcribe", domain: "d3", kind: "service", term: "Amazon Transcribe", definition: "Speech to text" },
    { id: "s-translate", domain: "d3", kind: "service", term: "Amazon Translate", definition: "Language translation" },
    { id: "s-comprehend", domain: "d3", kind: "service", term: "Amazon Comprehend", definition: "Sentiment and key phrases in text" },
    { id: "s-textract", domain: "d3", kind: "service", term: "Amazon Textract", definition: "Extract text and data from documents" },
    { id: "s-q", domain: "d3", kind: "service", term: "Amazon Q", definition: "Generative AI assistant for work and building on AWS" },
    { id: "s-athena", domain: "d3", kind: "service", term: "Amazon Athena", definition: "Serverless SQL queries on S3" },
    { id: "s-kinesis", domain: "d3", kind: "service", term: "Amazon Kinesis", definition: "Real-time streaming data" },
    { id: "s-glue", domain: "d3", kind: "service", term: "AWS Glue", definition: "Serverless ETL and data catalog" },
    { id: "s-quick", domain: "d3", kind: "service", term: "Amazon Quick", definition: "AI-powered BI dashboards and insights" },
    { id: "s-redshift", domain: "d3", kind: "service", term: "Amazon Redshift", definition: "Data warehouse" },
    { id: "s-emr", domain: "d3", kind: "service", term: "Amazon EMR", definition: "Big data frameworks such as Spark" },
    { id: "s-sqs", domain: "d3", kind: "service", term: "Amazon SQS", definition: "Message queues to decouple components" },
    { id: "s-sns", domain: "d3", kind: "service", term: "Amazon SNS", definition: "Pub/sub notifications to many subscribers" },
    { id: "s-eventbridge", domain: "d3", kind: "service", term: "Amazon EventBridge", definition: "Event bus that routes events with rules" },
    { id: "s-connect", domain: "d3", kind: "service", term: "Amazon Connect", definition: "Cloud contact center" },
    { id: "s-ses", domain: "d3", kind: "service", term: "Amazon SES", definition: "Send transactional and marketing email" },
    { id: "s-codepipeline", domain: "d3", kind: "service", term: "AWS CodePipeline", definition: "Automate release pipelines" },
    { id: "s-codebuild", domain: "d3", kind: "service", term: "AWS CodeBuild", definition: "Compile and test code" },
    { id: "s-xray", domain: "d3", kind: "service", term: "AWS X-Ray", definition: "Trace and debug requests" },
    { id: "s-workspaces", domain: "d3", kind: "service", term: "Amazon WorkSpaces", definition: "Managed virtual desktops" },
    { id: "s-appstream", domain: "d3", kind: "service", term: "Amazon AppStream 2.0", definition: "Stream desktop apps to a browser" },
    { id: "s-amplify", domain: "d3", kind: "service", term: "AWS Amplify", definition: "Build and host web and mobile apps" },
    { id: "s-iotcore", domain: "d3", kind: "service", term: "AWS IoT Core", definition: "Connect and manage IoT devices" },
  ],

  challenges: [
    {
      id: "ch-multi-az",
      domain: "d3",
      lesson: "d3-global",
      title: "Survive the outage",
      goal: "Run the app in at least two Availability Zones, then fail one of the zones it runs in and keep the app up.",
      hint: "Place servers in two zones first, then press 💥 on one of them.",
      takeaway: "Availability Zones don't share single points of failure, so a multi-AZ design rides out the loss of one.",
      render: (onSolved) => <MultiAzLab goal="survive" onSolved={onSolved} />,
    },
  ],
});
