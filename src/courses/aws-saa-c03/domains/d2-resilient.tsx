import { Flow, Layers, Ladder, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { DrStrategyLab } from "../labs";
import { RoutingPolicies } from "../visuals";

/**
 * Domain 2: Design Resilient Architectures (26% of SAA-C03 scored content).
 */
export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "Design Resilient Architectures",
    world: "The Unsinkable Archipelago",
    weight: 26,
    emoji: "🏝️",
    color: "#34d399",
    summary: "Loose coupling with queues and events, load balancing and Auto Scaling, serverless and containers, Multi-AZ data, disaster recovery, Route 53 failover, and automation.",
  },

  tasks: [
    {
      id: "2.1",
      title: "Design scalable and loosely coupled architectures",
      covers: [
        "Create and manage APIs (Amazon API Gateway, REST)",
        "Use managed services where they fit (AWS Transfer Family, Amazon SQS, AWS Secrets Manager) and caching strategies",
        "Apply microservice design principles: stateless versus stateful workloads",
        "Design event-driven, microservice, and multi-tier architectures",
        "Scale horizontally and vertically; use edge accelerators such as a CDN",
        "Migrate applications into containers and orchestrate them (Amazon ECS, Amazon EKS)",
        "Use load balancing (Application Load Balancer) and queuing and publish/subscribe messaging",
        "Use serverless technologies (AWS Lambda, AWS Fargate) and workflow orchestration (AWS Step Functions)",
        "Pick storage types (object, file, block), know when to use read replicas, and use purpose-built services",
      ],
    },
    {
      id: "2.2",
      title: "Design highly available and/or fault-tolerant architectures",
      covers: [
        "Use the global infrastructure (Availability Zones, Regions, Amazon Route 53) for high availability",
        "Choose disaster recovery strategies (backup and restore, pilot light, warm standby, active-active) against RPO and RTO",
        "Apply distributed design patterns, failover strategies, and immutable infrastructure",
        "Use load balancing and proxies (Amazon RDS Proxy) to remove single points of failure",
        "Plan service quotas and throttling, including for standby environments",
        "Choose storage by durability and replication, and keep data durable and available with backups",
        "Get workload visibility (AWS X-Ray) and pick metrics that reflect business availability",
        "Automate to keep infrastructure intact; improve the reliability of legacy applications you can't change",
      ],
    },
  ],

  lessons: [
    {
      id: "d2-decoupling",
      task: "2.1",
      title: "Loose coupling: queues, topics, events, and workflows",
      check: ["d2-01", "d2-02"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#34d399"
            steps={[
              { icon: "🛒", label: "Producer", sub: "Web tier accepts the order" },
              { icon: "📣", label: "SNS topic / EventBridge bus", sub: "One event, many subscribers" },
              { icon: "📬", label: "SQS queue per consumer", sub: "Buffers spikes, retries, DLQ" },
              { icon: "⚙️", label: "Workers scale on queue depth", sub: "Each at its own pace" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "📬", title: "Amazon SQS", text: "Pull-based queue. Standard: at-least-once, best-effort order. FIFO: ordered per message group, no duplicates.", color: "#34d399" },
              { icon: "📣", title: "Amazon SNS", text: "Push pub/sub to SQS, Lambda, HTTPS, email, SMS. Subscription filter policies.", color: "#34d399" },
              { icon: "🚌", title: "Amazon EventBridge", text: "Event bus with content-based rules, SaaS and AWS service events, schedules, archive and replay.", color: "#34d399" },
              { icon: "🎼", title: "AWS Step Functions", text: "Orchestrates multi-step workflows with retries, branches, parallel steps, and waits for humans.", color: "#34d399" },
              { icon: "🐇", title: "Amazon MQ", text: "Managed ActiveMQ or RabbitMQ for apps that already speak JMS, AMQP, MQTT, or STOMP.", color: "#38bdf8" },
              { icon: "🌊", title: "Amazon Kinesis", text: "Ordered streams that many consumers can re-read: real-time analytics, not task queues.", color: "#38bdf8" },
              { icon: "🚪", title: "Amazon API Gateway", text: "Managed REST, HTTP, and WebSocket APIs with throttling, caching (REST), auth, and usage plans.", color: "#38bdf8" },
              { icon: "📂", title: "AWS Transfer Family", text: "Managed SFTP, FTPS, FTP, and AS2 endpoints that store files in S3 or EFS.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "A queue between tiers absorbs bursts and keeps orders safe when the back end is slow or down: the producer only needs the queue to accept the message.",
        "Fanout: publish once to SNS (or an EventBridge bus) and give each consumer its own SQS queue so each can fail and retry independently.",
        "FIFO queues guarantee order within a message group ID and remove duplicates; use Standard when throughput matters more than strict order.",
        "Migrating an app that already uses a standard message broker protocol? Amazon MQ avoids rewriting it for SQS/SNS.",
      ],
      tip: "\"Decouple\", \"handle spikes\", or \"don't lose requests when the processing tier fails\" → put SQS between the tiers.",
    },
    {
      id: "d2-scaling",
      task: "2.1",
      title: "Load balancing and Auto Scaling",
      check: ["d2-09", "d2-10"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧭", title: "Application Load Balancer", text: "Layer 7 HTTP/HTTPS/gRPC. Routes by path, host, header, or query string. Targets: instances, IPs, Lambda, containers.", color: "#38bdf8" },
              { icon: "⚡", title: "Network Load Balancer", text: "Layer 4 TCP/UDP/TLS. Very high throughput, low latency, static IP per AZ (Elastic IPs allowed).", color: "#38bdf8" },
              { icon: "🧱", title: "Gateway Load Balancer", text: "Inserts third-party virtual appliances (firewalls, IDS) transparently into traffic, using GENEVE.", color: "#38bdf8" },
            ]}
          />
          <Layers
            layers={[
              { name: "Dynamic scaling", color: "#34d399", items: ["Target tracking (e.g. 50% CPU)", "Step scaling (bigger steps for bigger alarms)", "Simple scaling"] },
              { name: "Planned scaling", color: "#f59e0b", items: ["Scheduled actions (known peaks)", "Predictive scaling (ML forecast of daily patterns)"] },
              { name: "Health and capacity", color: "#a78bfa", items: ["Min / desired / max", "ELB health checks replace unhealthy instances", "Spread across multiple AZs", "Launch templates"] },
            ]}
          />
        </div>
      ),
      points: [
        "Horizontal scaling (more instances behind a load balancer) improves both capacity and availability; vertical scaling (bigger instance) has limits and usually needs a restart.",
        "Make the tier stateless (sessions in ElastiCache or DynamoDB) so any instance can serve any request and scale-in loses nothing.",
        "Use ELB health checks in the Auto Scaling group so instances that fail at the application level get replaced, not just ones whose EC2 status fails.",
        "Target tracking is the simplest dynamic policy: pick a metric (CPU, ALBRequestCountPerTarget, or queue backlog per instance) and a target value.",
        "Path-based routing on one ALB (/api → API targets, /images → image targets) replaces several load balancers.",
      ],
      tip: "Static IP addresses, UDP, or millions of requests per second → NLB. Content-based routing or Lambda targets → ALB. Third-party appliances → GWLB.",
    },
    {
      id: "d2-serverless",
      task: "2.1",
      title: "Serverless and containers",
      check: ["d2-17", "d2-18"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "λ", title: "AWS Lambda", text: "Event-driven functions up to 15 minutes. Scales per request; pay per request and duration.", color: "#f59e0b" },
              { icon: "🚢", title: "Amazon ECS", text: "AWS-native container orchestration: task definitions, services, and integration with ALB.", color: "#f59e0b" },
              { icon: "☸️", title: "Amazon EKS", text: "Managed Kubernetes control plane: portable manifests and the Kubernetes ecosystem.", color: "#f59e0b" },
              { icon: "🪄", title: "AWS Fargate", text: "Serverless compute for ECS and EKS: no EC2 instances to patch or scale.", color: "#f59e0b" },
            ]}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "🖥️", label: "Monolith on a VM" },
              { icon: "📦", label: "Containerize", sub: "Image in Amazon ECR" },
              { icon: "🚢", label: "ECS or EKS service", sub: "On Fargate or EC2" },
              { icon: "🧩", label: "Split into services", sub: "Scale each independently" },
            ]}
          />
        </div>
      ),
      points: [
        "Choose Lambda for short, event-driven work with spiky traffic; containers for long-running processes, custom runtimes, or steady load.",
        "Fargate removes server management for containers; EC2 launch type gives control over instance types, GPUs, and pricing options.",
        "Pick EKS when the team already uses Kubernetes or needs portability; ECS is simpler when you just want AWS-native containers.",
        "API Gateway + Lambda + DynamoDB is the classic serverless web back end: no servers, scales to zero, pay per use.",
      ],
      tip: "A job that runs longer than 15 minutes rules out Lambda. Look for ECS/Fargate, AWS Batch, or Step Functions to split the work.",
    },
    {
      id: "d2-multiaz",
      task: "2.1 · 2.2",
      title: "Highly available data: Multi-AZ, replicas, and proxies",
      check: ["d2-24", "d2-25"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🪞", title: "RDS Multi-AZ", text: "Synchronous standby in another AZ with automatic failover to the same endpoint. For availability, not read scaling.", color: "#34d399" },
              { icon: "📖", title: "Read replicas", text: "Asynchronous, readable copies (also cross-Region). Offload reads; promote one manually if needed.", color: "#34d399" },
              { icon: "🌌", title: "Amazon Aurora", text: "Storage keeps six copies across three AZs. Up to 15 low-lag replicas, which are also failover targets.", color: "#34d399" },
              { icon: "🌐", title: "Aurora Global Database", text: "Storage-level replication to other Regions, typically under a second, for fast cross-Region recovery and local reads.", color: "#38bdf8" },
              { icon: "🌍", title: "DynamoDB global tables", text: "Multi-Region, multi-active replication: read and write in every Region.", color: "#38bdf8" },
              { icon: "🔌", title: "RDS Proxy", text: "Pools and shares database connections, absorbs Lambda connection storms, and shortens failover time.", color: "#38bdf8" },
            ]}
          />
          <Layers
            layers={[
              { name: "Single AZ (zonal)", color: "#f87171", items: ["EBS volume", "EC2 instance", "Instance store", "EFS One Zone", "NAT gateway"] },
              { name: "Regional (multi-AZ)", color: "#34d399", items: ["S3 (most classes)", "EFS Standard", "DynamoDB", "SQS", "Aurora storage", "ELB across AZs"] },
            ]}
          />
        </div>
      ),
      points: [
        "Multi-AZ protects against an AZ or instance failure; read replicas scale reads. Exam questions often offer one when the scenario needs the other.",
        "Aurora replicas can be promoted automatically during failover; standard RDS read replicas must be promoted manually.",
        "EBS volumes live in one AZ: snapshot them (stored regionally) to restore in another AZ or copy to another Region.",
        "Remove every single point of failure: one NAT gateway, one instance, or one AZ is a weak link.",
      ],
      tip: "\"Survive an AZ failure with automatic failover\" → Multi-AZ. \"Reports are slowing down the primary\" → read replica.",
    },
    {
      id: "d2-dr",
      task: "2.2",
      title: "Disaster recovery: RPO, RTO, and the four strategies",
      check: ["d2-31", "d2-32"],
      visual: (
        <div className="grid gap-6">
          <Ladder
            rungs={[
              { icon: "💾", name: "Backup & restore", text: "Hours. Backups in another Region; rebuild with IaC." },
              { icon: "🕯️", name: "Pilot light", text: "Tens of minutes. Live data replication; app servers off until needed." },
              { icon: "♨️", name: "Warm standby", text: "Minutes. A smaller full copy always running; scale up." },
              { icon: "🌍", name: "Multi-site active/active", text: "Near zero. Full production in several Regions at once." },
            ]}
          />
          <DrStrategyLab />
        </div>
      ),
      points: [
        "RPO (recovery point objective): how much data you can afford to lose, measured back from the disaster. RTO (recovery time objective): how long you can be down.",
        "Pick the cheapest strategy that meets both targets: cost and complexity rise as RPO and RTO shrink.",
        "Pilot light keeps data live but compute off; warm standby keeps a scaled-down copy serving (or ready to serve) traffic.",
        "Raise service quotas in the recovery Region before you need them, or the standby can't scale up during a disaster.",
        "AWS Elastic Disaster Recovery and AWS Backup cross-Region copies are common building blocks; test recovery regularly.",
      ],
      tip: "Read the RPO and RTO numbers first, cross out strategies that can't meet them, then choose the cheapest that remains.",
    },
    {
      id: "d2-route53",
      task: "2.2",
      title: "Route 53 routing policies and failover",
      check: ["d2-38", "d2-39"],
      visual: (
        <div className="grid gap-4">
          <RoutingPolicies />
          <Tiles
            cols={3}
            tiles={[
              { icon: "❤️‍🩹", title: "Health checks", text: "Monitor an endpoint, other health checks (calculated), or a CloudWatch alarm for private resources.", color: "#38bdf8" },
              { icon: "🔗", title: "Alias records", text: "Point a name, including the zone apex, at ELB, CloudFront, S3 websites, and more. No charge for alias queries to AWS resources.", color: "#38bdf8" },
              { icon: "🚀", title: "Global Accelerator", text: "Two static anycast IPs on the AWS edge network; shifts TCP/UDP traffic between Regions in seconds.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Failover routing gives active-passive DR: primary while healthy, secondary (another Region or a static S3 page) otherwise.",
        "Latency routing sends users to the Region with the lowest latency; geolocation routes by where users are, which suits compliance and localization.",
        "Weighted routing splits traffic by percentage for canary or blue/green migrations.",
        "Use an alias record for the zone apex (example.com) pointing at a load balancer; a CNAME isn't allowed at the apex.",
      ],
      tip: "\"Users must only be served from their country's Region\" → geolocation, not latency. \"Lowest response time\" → latency.",
    },
    {
      id: "d2-automation",
      task: "2.2",
      title: "Automation, immutable infrastructure, and visibility",
      check: ["d2-44", "d2-45"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "📐", title: "AWS CloudFormation", text: "Infrastructure as code: rebuild identical environments in any Region, and roll back failed changes.", color: "#a78bfa" },
              { icon: "🧊", title: "Immutable infrastructure", text: "Replace instances from a new AMI or image instead of patching them in place.", color: "#a78bfa" },
              { icon: "🔭", title: "AWS X-Ray", text: "Traces requests across services to find bottlenecks and failing dependencies.", color: "#a78bfa" },
              { icon: "📈", title: "Amazon CloudWatch", text: "Metrics, alarms, logs, and dashboards. Alarms trigger scaling, notifications, or EC2 recovery.", color: "#a78bfa" },
            ]}
          />
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "🖥️", label: "Legacy app on one instance", sub: "Can't change the code" },
              { icon: "🔁", label: "Auto Scaling group, min = max = 1", sub: "Self-healing replacement" },
              { icon: "🧭", label: "Behind a load balancer or Elastic IP", sub: "Stable endpoint" },
              { icon: "💾", label: "Data on EFS or a managed DB", sub: "Survives replacement" },
            ]}
          />
        </div>
      ),
      points: [
        "Automate everything you'd otherwise do by hand in an outage: CloudFormation for infrastructure, Auto Scaling for capacity, alarms for recovery.",
        "Measure what the business cares about (successful checkouts, p99 latency), not just CPU, and alarm on it.",
        "Service quotas and throttling: know your limits, request increases ahead of time, and add retries with backoff.",
        "For apps you can't modify, wrap them: an Auto Scaling group of one for self-healing, RDS Proxy to smooth database failovers, or a load balancer in front.",
      ],
      tip: "\"Application changes are not possible\" means the answer is infrastructure around the app: Auto Scaling, load balancers, RDS Proxy, Route 53 failover.",
    },
  ],

  questions: [
    // ── Decoupling ──
    {
      id: "d2-01",
      domain: "d2",
      lesson: "d2-decoupling",
      prompt:
        "A web tier receives orders and calls a processing tier synchronously. During flash sales the processing tier is overwhelmed and orders are lost. The company wants every order to be processed eventually, even during spikes. What should the architect do?",
      options: [
        "Have the web tier send orders to an Amazon SQS queue and let the processing tier consume from it, scaling on queue depth",
        "Increase the instance size of the processing tier",
        "Add a second synchronous processing tier in another Region",
        "Cache the orders in Amazon CloudFront",
      ],
      answer: [0],
      explanation: "SQS buffers orders durably so the processing tier can work through the backlog at its own pace, and Auto Scaling can add workers as the queue grows.",
    },
    {
      id: "d2-02",
      domain: "d2",
      lesson: "d2-decoupling",
      prompt:
        "When an order is placed, the inventory, billing, and email services must each receive a copy of the event. Each service must be able to process at its own rate and retry independently. Which design is MOST appropriate?",
      options: [
        "Publish to an Amazon SNS topic with an Amazon SQS queue subscribed for each service",
        "Use a single SQS queue that all three services poll",
        "Call the three services one after another from the order service",
        "Store events in an S3 bucket that the services list every minute",
      ],
      answer: [0],
      explanation: "SNS fans out one message to several queues; each queue gives its service its own buffer, retries, and dead-letter queue. With one shared queue, each message goes to only one consumer.",
    },
    {
      id: "d2-03",
      domain: "d2",
      lesson: "d2-decoupling",
      prompt:
        "A financial application processes account transactions from a queue. Transactions for the same account must be processed in order and exactly once, while different accounts can be processed in parallel. Which TWO configurations meet these requirements? (Choose two.)",
      options: [
        "Use an Amazon SQS FIFO queue",
        "Use the account ID as the message group ID",
        "Use an SQS Standard queue with long polling",
        "Use one message group ID for all messages",
        "Use an SNS Standard topic with email subscriptions",
      ],
      answer: [0, 1],
      explanation: "FIFO queues keep order and remove duplicates within each message group. Grouping by account ID preserves per-account order while letting groups be processed in parallel.",
    },
    {
      id: "d2-04",
      domain: "d2",
      lesson: "d2-decoupling",
      prompt:
        "A company is moving an on-premises application that uses Apache ActiveMQ with JMS to AWS. It wants a managed service and minimal code changes. Which service should it use?",
      options: ["Amazon MQ", "Amazon SQS", "Amazon SNS", "Amazon Kinesis Data Streams"],
      answer: [0],
      explanation: "Amazon MQ runs managed ActiveMQ and RabbitMQ brokers, so apps using standard protocols such as JMS, AMQP, or MQTT keep working. SQS and SNS would require code changes.",
    },
    {
      id: "d2-05",
      domain: "d2",
      lesson: "d2-decoupling",
      prompt:
        "An insurance claim workflow has eight steps, including parallel checks, a branch on claim value, retries for a flaky partner API, and a manual approval that can take several days. Which service should coordinate it?",
      options: ["AWS Step Functions Standard workflow", "Amazon SQS with a single worker", "Amazon EventBridge Scheduler", "A Lambda function that sleeps between steps"],
      answer: [0],
      explanation: "Step Functions provides branching, parallel states, retries, and callback waits; Standard workflows can run for up to a year with a visual history. Lambda is limited to 15 minutes.",
    },
    {
      id: "d2-06",
      domain: "d2",
      lesson: "d2-decoupling",
      prompt:
        "A company wants to react to events from a SaaS partner application and from AWS services, routing each event to different targets based on fields inside the event, with the ability to replay past events. Which service fits best?",
      options: ["Amazon EventBridge", "Amazon SQS", "Amazon SNS with email subscriptions", "Amazon MQ"],
      answer: [0],
      explanation: "EventBridge receives events from AWS services and SaaS partners, routes them with content-based rules, and can archive and replay them.",
    },
    {
      id: "d2-07",
      domain: "d2",
      lesson: "d2-decoupling",
      prompt:
        "A partner can only send files using SFTP. The company wants the files to land in Amazon S3 without running or patching SFTP servers. What should the architect use?",
      options: ["AWS Transfer Family with an SFTP endpoint backed by S3", "An EC2 instance running an SFTP daemon", "AWS DataSync", "Amazon S3 Transfer Acceleration"],
      answer: [0],
      explanation: "Transfer Family is a managed SFTP/FTPS/FTP/AS2 service that stores files directly in S3 or EFS.",
    },
    {
      id: "d2-08",
      domain: "d2",
      lesson: "d2-decoupling",
      type: "match",
      prompt: "Match each integration need to the AWS service.",
      pairs: [
        ["Buffer work between tiers that consumers pull at their own pace", "Amazon SQS"],
        ["Push one message to many subscribers at once", "Amazon SNS"],
        ["Route events from SaaS apps by their content", "Amazon EventBridge"],
        ["Coordinate a multi-step workflow with branches and retries", "AWS Step Functions"],
        ["Keep an existing JMS application working on a managed broker", "Amazon MQ"],
      ],
      explanation: "Queues pull, topics push, buses route by content, state machines orchestrate, and Amazon MQ speaks standard broker protocols.",
    },

    // ── Scaling and load balancing ──
    {
      id: "d2-09",
      domain: "d2",
      lesson: "d2-scaling",
      prompt:
        "A web application stores user sessions in the memory of each EC2 instance. Users are logged out when Auto Scaling scales in. What should the architect do so the application can scale freely?",
      options: [
        "Store the sessions in Amazon ElastiCache or Amazon DynamoDB",
        "Enable sticky sessions on the Application Load Balancer",
        "Disable scale-in on the Auto Scaling group",
        "Store the sessions on each instance's EBS volume",
      ],
      answer: [0],
      explanation: "Externalizing session state makes the web tier stateless, so any instance can serve any user and terminating one loses nothing. Sticky sessions still lose sessions on terminated instances.",
    },
    {
      id: "d2-10",
      domain: "d2",
      lesson: "d2-scaling",
      prompt:
        "A gaming company needs a load balancer for a UDP-based game server fleet. Clients must connect to a small set of static IP addresses that the company can allow-list. Which load balancer should it use?",
      options: ["Network Load Balancer with Elastic IP addresses", "Application Load Balancer", "Gateway Load Balancer", "Classic Load Balancer with sticky sessions"],
      answer: [0],
      explanation: "NLB works at layer 4, supports UDP, and gives a static IP per AZ, which can be your own Elastic IPs. ALB only handles HTTP(S) and gRPC and has no static IPs.",
    },
    {
      id: "d2-11",
      domain: "d2",
      lesson: "d2-scaling",
      prompt:
        "A company runs one Application Load Balancer for an e-commerce site. Requests to /api/* must go to an API service and requests to /images/* to an image service, each with its own Auto Scaling group. Which TWO ALB features should the architect use? (Choose two.)",
      options: ["Path-based routing listener rules", "Separate target groups for each service", "A Gateway Load Balancer endpoint", "UDP listeners", "Route 53 weighted routing"],
      answer: [0, 1],
      explanation: "Listener rules match the URL path and forward to different target groups, each registered with its own Auto Scaling group.",
    },
    {
      id: "d2-12",
      domain: "d2",
      lesson: "d2-scaling",
      prompt:
        "Every weekday at 9:00 AM, traffic to an application jumps sharply, and instances launched by the dynamic policy arrive too late. What is the MOST effective fix?",
      options: [
        "Add a scheduled scaling action (or predictive scaling) to raise capacity shortly before 9:00 AM",
        "Use a larger instance type",
        "Lower the target value on the CPU target-tracking policy to 5%",
        "Disable health checks during the morning",
      ],
      answer: [0],
      explanation: "Scheduled actions handle known peaks; predictive scaling forecasts recurring patterns and launches capacity in advance.",
    },
    {
      id: "d2-13",
      domain: "d2",
      lesson: "d2-scaling",
      prompt:
        "An Auto Scaling group behind an ALB uses EC2 status checks only. An application bug causes some instances to return HTTP 500 errors while the instances themselves stay running. The instances are never replaced. What should be changed?",
      options: [
        "Enable Elastic Load Balancing health checks on the Auto Scaling group",
        "Increase the group's maximum size",
        "Use a Network Load Balancer",
        "Enable detailed monitoring",
      ],
      answer: [0],
      explanation: "With ELB health checks enabled, the group treats instances the load balancer marks unhealthy as unhealthy and replaces them.",
    },
    {
      id: "d2-14",
      domain: "d2",
      lesson: "d2-scaling",
      prompt:
        "Worker instances process jobs from an SQS queue. The team wants the Auto Scaling group to keep about 100 messages of backlog per instance. Which scaling approach is MOST appropriate?",
      options: [
        "Target tracking on a custom metric: queue messages visible divided by the number of running instances",
        "Target tracking on average CPU at 50%",
        "Scheduled scaling every hour",
        "Simple scaling on the NetworkIn metric",
      ],
      answer: [0],
      explanation: "Backlog per instance reflects the actual work waiting, so it scales workers in proportion to demand. CPU may not track queue length.",
    },
    {
      id: "d2-15",
      domain: "d2",
      lesson: "d2-scaling",
      prompt:
        "A company must route all traffic entering its VPC through a fleet of third-party firewall appliances, scaling the appliances transparently. Which service should it use?",
      options: ["Gateway Load Balancer", "Network Load Balancer", "Application Load Balancer", "AWS Global Accelerator"],
      answer: [0],
      explanation: "Gateway Load Balancer distributes traffic to virtual appliances using GENEVE, keeping flows symmetric, and is reached through Gateway Load Balancer endpoints in route tables.",
    },
    {
      id: "d2-16",
      domain: "d2",
      lesson: "d2-scaling",
      type: "match",
      prompt: "Match each requirement to the Elastic Load Balancing type.",
      pairs: [
        ["Route HTTP requests by URL path or host header", "Application Load Balancer"],
        ["Static IPs and millions of TCP/UDP requests per second", "Network Load Balancer"],
        ["Insert third-party firewall appliances transparently", "Gateway Load Balancer"],
      ],
      explanation: "ALB is layer 7, NLB is layer 4, and GWLB is for virtual appliances.",
    },

    // ── Serverless and containers ──
    {
      id: "d2-17",
      domain: "d2",
      lesson: "d2-serverless",
      prompt:
        "A company wants to run a containerized web application without managing EC2 instances, patching hosts, or planning cluster capacity. It doesn't use Kubernetes. Which option has the LEAST operational overhead?",
      options: ["Amazon ECS with AWS Fargate", "Amazon ECS on self-managed EC2 instances", "Amazon EKS with self-managed node groups", "Docker on EC2 instances in an Auto Scaling group"],
      answer: [0],
      explanation: "Fargate runs ECS tasks on serverless compute: you define CPU and memory per task and AWS manages the hosts.",
    },
    {
      id: "d2-18",
      domain: "d2",
      lesson: "d2-serverless",
      prompt:
        "A data processing job runs for 40 minutes, is triggered a few times a day by files arriving in S3, and needs 8 GB of memory. Which compute option fits without managing servers?",
      options: [
        "An Amazon ECS task on AWS Fargate started by an EventBridge rule",
        "An AWS Lambda function with maximum memory",
        "A Lambda function that re-invokes itself to keep running",
        "An always-on EC2 instance",
      ],
      answer: [0],
      explanation: "Lambda has a 15-minute maximum. A Fargate task can run as long as needed with the requested memory and stops when the job is done.",
    },
    {
      id: "d2-19",
      domain: "d2",
      lesson: "d2-serverless",
      prompt:
        "A startup needs a REST API with unpredictable traffic that is often zero at night. It wants to pay nothing for idle capacity and avoid managing servers. Which TWO services should form the core of the design? (Choose two.)",
      options: ["Amazon API Gateway", "AWS Lambda", "Amazon EC2 Reserved Instances", "An Application Load Balancer with EC2 targets", "Amazon EKS with managed node groups"],
      answer: [0, 1],
      explanation: "API Gateway and Lambda scale with requests and charge per use, so idle periods cost almost nothing. Reserved Instances and node groups bill for capacity whether used or not.",
    },
    {
      id: "d2-20",
      domain: "d2",
      lesson: "d2-serverless",
      prompt:
        "A company's platform team already runs Kubernetes on premises and wants to use the same manifests, tooling, and Helm charts on AWS with a managed control plane. What should it choose?",
      options: ["Amazon EKS", "Amazon ECS", "AWS Elastic Beanstalk", "AWS Batch"],
      answer: [0],
      explanation: "EKS runs upstream Kubernetes with a managed control plane, so existing Kubernetes tooling carries over.",
    },
    {
      id: "d2-21",
      domain: "d2",
      lesson: "d2-serverless",
      prompt:
        "A public API built with API Gateway is overloaded by one partner who sends far more requests than agreed. The company wants per-partner request limits. What should it configure?",
      options: ["Usage plans with API keys and throttling limits per partner", "A larger Lambda memory size", "An SQS queue in front of API Gateway", "AWS Shield Advanced"],
      answer: [0],
      explanation: "Usage plans associate API keys with throttling rates, burst limits, and quotas, so each partner gets its own limits.",
    },
    {
      id: "d2-22",
      domain: "d2",
      lesson: "d2-serverless",
      prompt:
        "A team wants to move a legacy Java web application from VMs into containers on AWS as a first step toward microservices, without rewriting it. Which approach fits best?",
      options: [
        "Package the application as a container image in Amazon ECR and run it as an ECS service behind an ALB",
        "Rewrite the application as Lambda functions first",
        "Move the application to Amazon S3 static website hosting",
        "Run the application in AWS Batch",
      ],
      answer: [0],
      explanation: "Containerizing as-is (lift and shift into containers) gets consistent deployment and scaling now; services can be split out later.",
    },
    {
      id: "d2-23",
      domain: "d2",
      lesson: "d2-serverless",
      type: "match",
      prompt: "Match each workload to the compute option that fits it best.",
      pairs: [
        ["Resize an image each time one is uploaded to S3", "AWS Lambda"],
        ["Run long-lived containers without managing servers", "AWS Fargate"],
        ["Reuse existing Kubernetes manifests and Helm charts", "Amazon EKS"],
        ["Deploy a web app by uploading code, with capacity managed for you", "AWS Elastic Beanstalk"],
      ],
      explanation: "Event-driven short tasks → Lambda; serverless containers → Fargate; Kubernetes → EKS; managed app platform on EC2 → Elastic Beanstalk.",
    },

    // ── Multi-AZ data ──
    {
      id: "d2-24",
      domain: "d2",
      lesson: "d2-multiaz",
      prompt:
        "A production MySQL database on Amazon RDS must stay available if an Availability Zone fails, with automatic failover and no change to the application's connection string. What should the architect enable?",
      options: ["RDS Multi-AZ deployment", "A read replica in the same AZ", "Automated backups with a 35-day retention", "A larger DB instance class"],
      answer: [0],
      explanation: "Multi-AZ keeps a synchronous standby in another AZ and fails over automatically to the same DNS endpoint.",
    },
    {
      id: "d2-25",
      domain: "d2",
      lesson: "d2-multiaz",
      prompt:
        "Reporting queries run during business hours are slowing down an RDS PostgreSQL database used by an order system. Reports can tolerate data that is a few seconds old. What should the architect do?",
      options: [
        "Create a read replica and point the reporting tool at it",
        "Enable Multi-AZ and send reports to the standby",
        "Scale the instance up during business hours",
        "Move the reports into the application's code",
      ],
      answer: [0],
      explanation: "Read replicas serve read traffic asynchronously. A Multi-AZ instance standby can't serve reads.",
    },
    {
      id: "d2-26",
      domain: "d2",
      lesson: "d2-multiaz",
      prompt: "Which TWO statements about Amazon Aurora are correct? (Choose two.)",
      options: [
        "Aurora storage keeps six copies of data across three Availability Zones",
        "Aurora Replicas can serve reads and act as failover targets",
        "Aurora requires you to provision storage size in advance",
        "Aurora supports only one read replica",
        "Aurora replicates to replicas using asynchronous binlog shipping only",
      ],
      answer: [0, 1],
      explanation: "Aurora's shared cluster storage is replicated six ways across three AZs and grows automatically. Up to 15 replicas share that storage and can be promoted on failure.",
    },
    {
      id: "d2-27",
      domain: "d2",
      lesson: "d2-multiaz",
      prompt:
        "Thousands of Lambda function invocations open new connections to an RDS database during traffic spikes, exhausting its connection limit. What should the architect add?",
      options: ["Amazon RDS Proxy", "A larger Lambda memory setting", "An RDS read replica", "Amazon ElastiCache for Memcached"],
      answer: [0],
      explanation: "RDS Proxy pools and reuses connections, protecting the database from connection storms and reducing failover time.",
    },
    {
      id: "d2-28",
      domain: "d2",
      lesson: "d2-multiaz",
      prompt:
        "A global application needs a database that allows writes in us-east-1 and eu-west-1 at the same time, with low-latency local reads and writes in both Regions. Which option meets this requirement?",
      options: ["Amazon DynamoDB global tables", "RDS for MySQL with a cross-Region read replica", "Amazon Aurora with Multi-AZ in one Region", "Amazon ElastiCache for Redis OSS in one Region"],
      answer: [0],
      explanation: "Global tables replicate DynamoDB tables across Regions with multi-active writes. A cross-Region read replica is read-only.",
    },
    {
      id: "d2-29",
      domain: "d2",
      lesson: "d2-multiaz",
      prompt:
        "Several EC2 instances in different Availability Zones need shared access to the same files, and the data must survive the loss of an AZ. Which storage option meets these requirements?",
      options: ["Amazon EFS with the Standard (Regional) storage class", "An EBS gp3 volume attached to all instances", "Instance store volumes", "EFS One Zone"],
      answer: [0],
      explanation: "EFS Standard stores data across multiple AZs and can be mounted from any AZ. EBS volumes and EFS One Zone live in a single AZ.",
    },
    {
      id: "d2-30",
      domain: "d2",
      lesson: "d2-multiaz",
      prompt:
        "A VPC has private subnets in three AZs that all route through a single NAT gateway in AZ-a. An outage in AZ-a cut off internet access for every subnet. How should the architect fix this single point of failure?",
      options: [
        "Create a NAT gateway in each AZ and route each private subnet to the NAT gateway in its own AZ",
        "Replace the NAT gateway with a larger one",
        "Add a second internet gateway",
        "Move all instances to AZ-a",
      ],
      answer: [0],
      explanation: "NAT gateways are zonal. One per AZ, with per-AZ route tables, keeps outbound access working when an AZ fails.",
    },

    // ── DR ──
    {
      id: "d2-31",
      domain: "d2",
      lesson: "d2-dr",
      prompt:
        "A company's internal reporting application has an RPO of 24 hours and an RTO of 24 hours. The company wants the LOWEST cost disaster recovery strategy in another Region. Which strategy should it use?",
      options: ["Backup and restore", "Pilot light", "Warm standby", "Multi-site active/active"],
      answer: [0],
      explanation: "With a day of tolerance, copying backups to another Region and rebuilding with infrastructure as code after a disaster meets the targets at the lowest cost.",
    },
    {
      id: "d2-32",
      domain: "d2",
      lesson: "d2-dr",
      prompt:
        "An application must recover in another Region within about 30 minutes with almost no data loss. To save money, application servers in the recovery Region should not run until a disaster. Which strategy matches?",
      options: ["Pilot light", "Backup and restore", "Warm standby", "Multi-site active/active"],
      answer: [0],
      explanation: "Pilot light continuously replicates data and keeps core infrastructure ready, but application servers are off until recovery, when they're started and scaled out.",
    },
    {
      id: "d2-33",
      domain: "d2",
      lesson: "d2-dr",
      prompt:
        "A company runs warm standby in a second Region. During a DR test, the standby Auto Scaling group failed to scale to production size. Which TWO actions should the architect take? (Choose two.)",
      options: [
        "Request service quota increases (for example, EC2 instance limits) in the recovery Region in advance",
        "Automate the failover and scale-up with infrastructure as code and test it regularly",
        "Switch to backup and restore to avoid quotas",
        "Disable Auto Scaling in the recovery Region",
        "Rely on AWS to raise quotas automatically during a disaster",
      ],
      answer: [0, 1],
      explanation: "Quotas are per Region, so the standby Region needs headroom for full production capacity. Automated, regularly tested recovery is the only way to trust an RTO.",
    },
    {
      id: "d2-34",
      domain: "d2",
      lesson: "d2-dr",
      prompt:
        "An online payments platform must have near-zero downtime and near-zero data loss even if an entire Region fails. Cost is a secondary concern. Which strategy should the architect design?",
      options: ["Multi-site active/active across Regions", "Warm standby", "Pilot light", "Backup and restore with hourly snapshots"],
      answer: [0],
      explanation: "Active/active serves traffic from several Regions at once (for example with DynamoDB global tables or Aurora Global Database and Route 53), so losing one Region causes almost no interruption.",
    },
    {
      id: "d2-35",
      domain: "d2",
      lesson: "d2-dr",
      prompt: "In disaster recovery planning, what does the recovery point objective (RPO) describe?",
      options: [
        "The maximum acceptable amount of data loss, measured as time before the disaster",
        "The maximum acceptable time to restore service after a disaster",
        "The number of Regions the workload runs in",
        "The percentage of requests that must succeed",
      ],
      answer: [0],
      explanation: "RPO is about data (how far back your last good copy is); RTO is about time (how long until service is back).",
    },
    {
      id: "d2-36",
      domain: "d2",
      lesson: "d2-dr",
      prompt:
        "A company runs its main application in one Region. It wants a scaled-down but fully functional copy running in a second Region that can take full production traffic within minutes after scaling up. Which strategy is this?",
      options: ["Warm standby", "Pilot light", "Backup and restore", "Cold site"],
      answer: [0],
      explanation: "Warm standby keeps every component running at reduced capacity, so recovery is mainly scaling up and shifting traffic.",
    },
    {
      id: "d2-37",
      domain: "d2",
      lesson: "d2-dr",
      type: "order",
      prompt: "Order the DR strategies from the longest typical RTO (and lowest cost) to the shortest RTO (and highest cost).",
      items: ["Backup and restore", "Pilot light", "Warm standby", "Multi-site active/active"],
      explanation: "Each step up keeps more of the environment running in the recovery Region, which costs more but recovers faster with less data loss.",
    },

    // ── Route 53 ──
    {
      id: "d2-38",
      domain: "d2",
      lesson: "d2-route53",
      prompt:
        "A company runs its web application in us-east-1 with a standby copy in us-west-2. Traffic should go to us-west-2 only if the us-east-1 endpoint becomes unhealthy. Which Route 53 configuration should the architect use?",
      options: [
        "Failover routing with a health check on the primary record",
        "Weighted routing with equal weights",
        "Latency-based routing",
        "Geolocation routing",
      ],
      answer: [0],
      explanation: "Failover routing answers with the primary while its health check passes and switches to the secondary when it fails.",
    },
    {
      id: "d2-39",
      domain: "d2",
      lesson: "d2-route53",
      prompt:
        "A media company runs identical stacks in three Regions and wants each user to be served by the Region that gives them the fastest response. Which routing policy should it use?",
      options: ["Latency-based routing", "Geolocation routing", "Simple routing", "Weighted routing"],
      answer: [0],
      explanation: "Latency routing uses AWS latency measurements to pick the Region with the lowest latency for each user. Geolocation routes by location, which isn't always the fastest.",
    },
    {
      id: "d2-40",
      domain: "d2",
      lesson: "d2-route53",
      prompt:
        "A company is migrating from an old stack to a new one. It wants to send 10% of users to the new stack, watch error rates, and roll back instantly if needed. It also wants the zone apex example.com to point at the new Application Load Balancer. Which TWO Route 53 features should it use? (Choose two.)",
      options: ["Weighted routing records", "An alias record for the zone apex", "A CNAME record at the zone apex", "Multivalue answer routing", "Geoproximity routing with a bias of 0"],
      answer: [0, 1],
      explanation: "Weighted records split traffic by percentage and can be changed instantly. Alias records can point the apex at an ALB; CNAMEs aren't allowed at the zone apex.",
    },
    {
      id: "d2-41",
      domain: "d2",
      lesson: "d2-route53",
      prompt:
        "Due to data residency rules, users in Germany must always be served from the eu-central-1 deployment and all other users from us-east-1. Which routing policy meets this requirement?",
      options: ["Geolocation routing with a Germany record and a default record", "Latency-based routing", "Weighted routing", "Failover routing"],
      answer: [0],
      explanation: "Geolocation routing answers by the user's location; the default record covers everyone not matched by a specific location.",
    },
    {
      id: "d2-42",
      domain: "d2",
      lesson: "d2-route53",
      prompt:
        "A multiplayer game uses UDP and runs in two Regions. Players need fixed IP addresses and failover between Regions that doesn't depend on DNS caching. Which service fits?",
      options: ["AWS Global Accelerator", "Amazon CloudFront", "Route 53 failover routing", "An Application Load Balancer"],
      answer: [0],
      explanation: "Global Accelerator gives two static anycast IPs, routes TCP and UDP over the AWS network, and shifts traffic between healthy Regional endpoints without waiting for DNS TTLs.",
    },
    {
      id: "d2-43",
      domain: "d2",
      lesson: "d2-route53",
      type: "match",
      prompt: "Match each requirement to the Route 53 routing policy.",
      pairs: [
        ["Active-passive DR to a standby Region", "Failover"],
        ["Send 5% of traffic to a new version", "Weighted"],
        ["Serve users from the lowest-latency Region", "Latency"],
        ["Serve users based on their country", "Geolocation"],
        ["Return several healthy IP addresses at random", "Multivalue answer"],
      ],
      explanation: "The requirement word usually names the policy: failover, percentage, fastest, country, or several healthy answers.",
    },

    // ── Automation and visibility ──
    {
      id: "d2-44",
      domain: "d2",
      lesson: "d2-automation",
      prompt:
        "After a server was patched by hand, a production instance behaved differently from the others and caused an outage. The company wants every instance to be identical and reproducible. Which approach should the architect recommend?",
      options: [
        "Immutable infrastructure: bake a new AMI for each change and replace instances through the Auto Scaling group",
        "Patch each instance manually with a checklist",
        "Disable updates on all instances",
        "Run one larger instance instead of several",
      ],
      answer: [0],
      explanation: "Replacing instances from a versioned image (rather than changing them in place) prevents configuration drift and makes rollback a matter of using the previous image.",
    },
    {
      id: "d2-45",
      domain: "d2",
      lesson: "d2-automation",
      prompt:
        "A legacy application runs on a single EC2 instance and can't be modified or clustered. The company wants it to recover automatically if the instance or its AZ fails, with data preserved. What is the MOST effective approach?",
      options: [
        "Run it in an Auto Scaling group with minimum and maximum of 1 across several AZs, keep data on Amazon EFS, and front it with a load balancer",
        "Take daily EBS snapshots and restore manually",
        "Use a larger instance type",
        "Run two copies of the application writing to the same EBS volume",
      ],
      answer: [0],
      explanation: "An Auto Scaling group of one replaces a failed instance in any healthy AZ; EFS keeps data available across AZs; the load balancer gives a stable endpoint.",
    },
    {
      id: "d2-46",
      domain: "d2",
      lesson: "d2-automation",
      prompt:
        "A microservices application has intermittent slow responses. The team needs to see which downstream service call adds the latency, and wants to rebuild the whole environment in another Region quickly if needed. Which TWO services help? (Choose two.)",
      options: ["AWS X-Ray", "AWS CloudFormation", "Amazon Macie", "AWS Artifact", "Amazon Inspector"],
      answer: [0, 1],
      explanation: "X-Ray traces requests across services to show where time is spent. CloudFormation templates recreate the infrastructure consistently in any Region.",
    },
    {
      id: "d2-47",
      domain: "d2",
      lesson: "d2-automation",
      prompt:
        "A business wants an alarm when its checkout flow is degraded, even if CPU and memory look normal. Which metric approach best reflects the business requirement?",
      options: [
        "Publish a custom CloudWatch metric for successful checkouts and checkout latency, and alarm on it",
        "Alarm only on EC2 CPU utilization",
        "Alarm on the number of running instances",
        "Check the AWS Health Dashboard daily",
      ],
      answer: [0],
      explanation: "Availability should be measured from the customer's perspective. Custom metrics for key transactions catch failures that infrastructure metrics miss.",
    },
    {
      id: "d2-48",
      domain: "d2",
      lesson: "d2-automation",
      prompt:
        "A partner API that an application calls returns HTTP 429 errors during peak hours. Which change makes the application more resilient?",
      options: [
        "Retry with exponential backoff and jitter, and queue non-urgent calls",
        "Retry immediately in a tight loop until it succeeds",
        "Increase the application's instance size",
        "Ignore failed calls",
      ],
      answer: [0],
      explanation: "429 means throttled. Backoff with jitter spreads retries out, and queuing smooths demand below the partner's limit.",
    },
    {
      id: "d2-49",
      domain: "d2",
      lesson: "d2-automation",
      prompt:
        "An EC2 instance runs a critical single-instance workload. The company wants it to be automatically recovered onto healthy hardware, keeping its instance ID, private IP, and EBS volumes, if the underlying host fails. What should be used?",
      options: [
        "EC2 automatic recovery (or a CloudWatch alarm with the recover action) on the system status check",
        "An Auto Scaling group with a maximum of 10",
        "Instance store volumes",
        "A spread placement group with one instance",
      ],
      answer: [0],
      explanation: "Instance recovery moves the instance to new hardware when a system status check fails, keeping its identity, IP addresses, and EBS volumes.",
    },
  ],

  cards: [
    { id: "s-sqs", domain: "d2", kind: "service", term: "Amazon SQS", definition: "Managed message queue that decouples producers from consumers" },
    { id: "s-sns", domain: "d2", kind: "service", term: "Amazon SNS", definition: "Pub/sub topics that push messages to many subscribers" },
    { id: "s-eventbridge", domain: "d2", kind: "service", term: "Amazon EventBridge", definition: "Event bus with content-based routing, SaaS sources, schedules, and replay" },
    { id: "s-stepfunctions", domain: "d2", kind: "service", term: "AWS Step Functions", definition: "Orchestrates workflows as state machines with retries, branches, and waits" },
    { id: "s-mq", domain: "d2", kind: "service", term: "Amazon MQ", definition: "Managed ActiveMQ and RabbitMQ brokers for standard messaging protocols" },
    { id: "s-apigw", domain: "d2", kind: "service", term: "Amazon API Gateway", definition: "Managed REST, HTTP, and WebSocket APIs with throttling and usage plans" },
    { id: "s-transfer", domain: "d2", kind: "service", term: "AWS Transfer Family", definition: "Managed SFTP, FTPS, FTP, and AS2 into S3 or EFS" },
    { id: "s-alb", domain: "d2", kind: "service", term: "Application Load Balancer", definition: "Layer 7 load balancer with path, host, and header routing" },
    { id: "s-nlb", domain: "d2", kind: "service", term: "Network Load Balancer", definition: "Layer 4 TCP/UDP load balancer with static IPs and very low latency" },
    { id: "s-gwlb", domain: "d2", kind: "service", term: "Gateway Load Balancer", definition: "Scales third-party virtual appliances transparently in the traffic path" },
    { id: "s-asg", domain: "d2", kind: "service", term: "Amazon EC2 Auto Scaling", definition: "Keeps the right number of healthy EC2 instances across AZs" },
    { id: "s-lambda", domain: "d2", kind: "service", term: "AWS Lambda", definition: "Event-driven functions up to 15 minutes, billed per request and duration" },
    { id: "s-fargate", domain: "d2", kind: "service", term: "AWS Fargate", definition: "Serverless compute for ECS and EKS containers" },
    { id: "s-ecs", domain: "d2", kind: "service", term: "Amazon ECS", definition: "AWS-native container orchestration" },
    { id: "s-eks", domain: "d2", kind: "service", term: "Amazon EKS", definition: "Managed Kubernetes control plane" },
    { id: "s-ecr", domain: "d2", kind: "service", term: "Amazon ECR", definition: "Private container image registry" },
    { id: "s-beanstalk", domain: "d2", kind: "service", term: "AWS Elastic Beanstalk", definition: "Upload code and let AWS provision and scale the environment" },
    { id: "s-aurora", domain: "d2", kind: "service", term: "Amazon Aurora", definition: "MySQL/PostgreSQL-compatible database with six-way storage across three AZs" },
    { id: "s-rdsproxy", domain: "d2", kind: "service", term: "Amazon RDS Proxy", definition: "Pools database connections and speeds up failover" },
    { id: "s-route53", domain: "d2", kind: "service", term: "Amazon Route 53", definition: "DNS with health checks and routing policies" },
    { id: "s-globalaccelerator", domain: "d2", kind: "service", term: "AWS Global Accelerator", definition: "Static anycast IPs that route TCP/UDP over the AWS network with fast failover" },
    { id: "s-cloudformation", domain: "d2", kind: "service", term: "AWS CloudFormation", definition: "Infrastructure as code: templates that create and update stacks" },
    { id: "s-xray", domain: "d2", kind: "service", term: "AWS X-Ray", definition: "Distributed tracing to find latency and errors across services" },
    { id: "s-cloudwatch", domain: "d2", kind: "service", term: "Amazon CloudWatch", definition: "Metrics, alarms, logs, and dashboards" },
    { id: "c-rpo", domain: "d2", kind: "concept", term: "RPO", definition: "Maximum acceptable data loss, measured back in time from the disaster" },
    { id: "c-rto", domain: "d2", kind: "concept", term: "RTO", definition: "Maximum acceptable time to restore service" },
    { id: "c-pilotlight", domain: "d2", kind: "concept", term: "Pilot light", definition: "Live data replication; app servers off until a disaster" },
    { id: "c-warmstandby", domain: "d2", kind: "concept", term: "Warm standby", definition: "Scaled-down, fully working copy that scales up on failover" },
    { id: "c-activeactive", domain: "d2", kind: "concept", term: "Multi-site active/active", definition: "Full production in several Regions at once; near-zero RPO and RTO" },
    { id: "c-multiaz", domain: "d2", kind: "concept", term: "RDS Multi-AZ", definition: "Synchronous standby in another AZ with automatic failover" },
    { id: "c-readreplica", domain: "d2", kind: "concept", term: "Read replica", definition: "Asynchronous readable copy for scaling reads" },
    { id: "c-fanout", domain: "d2", kind: "concept", term: "Fanout", definition: "One SNS message delivered to several SQS queues" },
    { id: "c-stateless", domain: "d2", kind: "concept", term: "Stateless tier", definition: "No session data on instances, so any instance serves any request" },
    { id: "c-immutable", domain: "d2", kind: "concept", term: "Immutable infrastructure", definition: "Replace servers from new images instead of changing them in place" },
    { id: "c-alias", domain: "d2", kind: "concept", term: "Alias record", definition: "Route 53 record pointing at AWS resources, allowed at the zone apex" },
  ],

  challenges: [
    {
      id: "ch-dr-picker",
      domain: "d2",
      lesson: "d2-dr",
      title: "Right-size the recovery",
      goal: "For all four workloads, pick the cheapest DR strategy that still meets their RPO and RTO.",
      hint: "Rule out strategies that can't meet both numbers, then choose the cheapest that's left. Overspending counts as a miss.",
      takeaway: "Backup & restore → pilot light → warm standby → active/active: each step buys a smaller RPO and RTO for more money.",
      render: (onSolved) => <DrStrategyLab goal="all" onSolved={onSolved} />,
    },
  ],
});
