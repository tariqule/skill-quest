import { Flow, Layers, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { BedrockLab, DynamoCapacityLab, SqsLab } from "../labs";
import { PartitionHeat } from "../visuals";

/**
 * Domain 1: Development with AWS Services (30% of DVA-C03 scored content).
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "Development with AWS Services",
    world: "The Serverless Foundry",
    weight: 30,
    emoji: "⚙️",
    color: "#f59e0b",
    summary: "Decoupled and event-driven design, messaging and streams, APIs and SDKs, AI-assisted coding, Amazon Bedrock in your code, Lambda, DynamoDB, and caching.",
  },

  tasks: [
    {
      id: "1.1",
      title: "Develop code for applications that are hosted on AWS",
      covers: [
        "Tell tightly coupled from loosely coupled systems, and decouple components with AWS services",
        "Choose synchronous or asynchronous patterns (API Gateway request-response, SQS-based processing, EventBridge event-driven workflows)",
        "Build fault-tolerant, resilient applications: retries with backoff, graceful degradation",
        "Create, extend, and maintain APIs: request/response transformations, validation rules",
        "Write code that calls AWS services through APIs and AWS SDKs",
        "Manage streaming data with AWS services",
        "Serialize and deserialize data to integrate application code with AWS services",
        "Implement event-driven patterns (EventBridge, S3 Event Notifications, SQS, SNS)",
        "Use AI-assisted development tools to generate, review, and optimize code (spec-driven generation, automated reviews, code completion, refactoring, security scanning)",
        "Integrate managed AWS AI services into applications",
      ],
    },
    {
      id: "1.2",
      title: "Develop code for AWS Lambda",
      covers: [
        "Give Lambda functions access to private resources in VPCs",
        "Configure environment variables and parameters: memory, concurrency, timeout, runtime, handler, layers, extensions",
        "Handle event lifecycles and errors with Lambda destinations and dead-letter queues",
        "Integrate Lambda with AWS services through code, event source mappings, and destinations (for example API Gateway, DynamoDB)",
      ],
    },
    {
      id: "1.3",
      title: "Use data stores during application development",
      covers: [
        "Manage data lifecycles: S3 Lifecycle policies, TTL, retention periods",
        "Choose data stores (ElastiCache, DynamoDB, S3, RDS) by access pattern",
        "Pick the caching solution that fits the data store",
        "Configure DynamoDB: high-cardinality partition keys, read consistency, query vs scan, keys, attributes, and indexes",
      ],
    },
  ],

  lessons: [
    {
      id: "d1-patterns",
      task: "1.1",
      title: "Decoupled, event-driven design",
      check: ["d1-01", "d1-03", "d1-04"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={2}
            tiles={[
              { icon: "🔗", title: "Tightly coupled, synchronous", text: "Order → Payment → Shipping in one call chain. One slow or failed service fails the whole request.", color: "#f87171" },
              { icon: "🧩", title: "Loosely coupled, asynchronous", text: "Order publishes an event. Each service consumes it from its own queue, at its own pace.", color: "#34d399" },
            ]}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "🛒", label: "Order placed", sub: "Producer publishes one event" },
              { icon: "📣", label: "SNS topic / EventBridge bus", sub: "Fans out to every subscriber" },
              { icon: "📬", label: "One SQS queue per service", sub: "Buffers and retries independently" },
              { icon: "λ", label: "Consumers", sub: "Payment, shipping, email" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🪣", title: "S3 Event Notifications", text: "An object upload or delete triggers Lambda, SQS, SNS, or EventBridge.", color: "#a78bfa" },
              { icon: "💃", title: "Choreography", text: "Services react to events. No central controller (EventBridge rules).", color: "#a78bfa" },
              { icon: "🎼", title: "Orchestration", text: "A coordinator drives each step, retries, and branches (Step Functions).", color: "#a78bfa" },
              { icon: "🪶", title: "Stateless", text: "Keep session state in ElastiCache or DynamoDB so any instance can serve any request.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Synchronous (API Gateway → Lambda): the caller needs the answer now. Asynchronous (SQS, EventBridge): the caller only needs to know the work was accepted.",
        "Asynchronous messaging lets a producer continue without waiting, and lets a failed consumer catch up later.",
        "Fanout: one event, many independent consumers (SNS → several SQS queues, or several EventBridge rules).",
        "Step Functions Standard workflows run up to one year with exactly-once steps; Express workflows run up to five minutes at very high volume.",
      ],
      tip: "\"Decouple\", \"absorb spikes\", or \"keep working if a downstream service is down\" → put a queue or event bus between the services.",
    },
    {
      id: "d1-messaging",
      task: "1.1",
      title: "Queues, topics, buses, and streams",
      check: ["d1-08", "d1-11"],
      visual: (
        <div className="grid gap-6">
          <Tiles
            cols={4}
            tiles={[
              { icon: "📬", title: "SQS", text: "Queue. Consumers poll, process, then delete. Standard (at-least-once) or FIFO (ordered, deduplicated).", color: "#f59e0b" },
              { icon: "📣", title: "SNS", text: "Pub/sub push to many subscribers: SQS, Lambda, HTTP, email. Filter policies per subscription.", color: "#f59e0b" },
              { icon: "🚌", title: "EventBridge", text: "Event bus with content-based rules, schedules, SaaS sources, archive and replay.", color: "#f59e0b" },
              { icon: "🌊", title: "Kinesis Data Streams", text: "Ordered stream per shard. Many consumers re-read records within the retention window.", color: "#f59e0b" },
            ]}
          />
          <Flow
            color="#38bdf8"
            steps={[
              { icon: "📡", label: "Producers", sub: "Apps, devices, logs" },
              { icon: "🚿", label: "Amazon Data Firehose", sub: "Buffers, optionally transforms with Lambda" },
              { icon: "🪣", label: "Destination", sub: "S3, OpenSearch Service, and more" },
            ]}
          />
          <SqsLab />
        </div>
      ),
      points: [
        "Visibility timeout (default 30 s, max 12 hours) hides a received message. If work outlasts it, the message is delivered again.",
        "Long polling (WaitTimeSeconds up to 20 s) cuts empty receives and cost. A redrive policy moves repeatedly failing messages to a dead-letter queue.",
        "FIFO queues order messages within a message group ID and deduplicate within a 5-minute window.",
        "Kinesis routes records to shards by partition key. A hot key throttles one shard; enhanced fan-out gives each consumer its own read throughput.",
        "Data Firehose delivers streaming data to a destination with no consumer code to write: use it when you need delivery, not custom real-time processing.",
      ],
      tip: "Duplicates in SQS usually mean the visibility timeout is shorter than processing time, or the consumer isn't idempotent.",
    },
    {
      id: "d1-apis",
      task: "1.1",
      title: "APIs, SDKs, and resilient integrations",
      check: ["d1-17", "d1-20", "d1-60"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#38bdf8"
            steps={[
              { icon: "🙋", label: "Client request" },
              { icon: "✅", label: "Request validation", sub: "Models (JSON Schema) reject bad input early" },
              { icon: "🔀", label: "Mapping template", sub: "Reshape the request for the backend (non-proxy)" },
              { icon: "⚙️", label: "Integration", sub: "Lambda, HTTP, AWS service, or mock" },
              { icon: "↩️", label: "Response mapping", sub: "Transform body, override status codes" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "⏳", title: "Retry with backoff + jitter", text: "Wait longer after each failure, with randomness, so clients don't retry in lockstep.", color: "#34d399" },
              { icon: "🔌", title: "Circuit breaker", text: "After repeated failures, fail fast for a while instead of piling up calls. Probe, then close.", color: "#34d399" },
              { icon: "🪂", title: "Graceful degradation", text: "When a non-critical dependency fails, serve a cached or reduced response instead of an error.", color: "#34d399" },
              { icon: "🔑", title: "Idempotency key", text: "Record a request ID with a conditional write so a retried message can't charge twice.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "Lambda proxy integration passes the whole request to the function, which must return statusCode, headers, and body.",
        "Non-proxy integrations use mapping templates to transform requests and responses without changing the backend.",
        "AWS SDKs sign requests, use the default credential provider chain, and retry throttling and 5xx errors with exponential backoff.",
        "Serialize objects (usually to JSON) before sending them to SQS, SNS, S3, or a cache, and deserialize on read. The DynamoDB document clients convert native objects to DynamoDB's typed attribute format for you.",
      ],
      tip: "Retry only transient errors (throttling, 5xx, timeouts). Retrying a 400 validation error just fails again.",
    },
    {
      id: "d1-ai-dev",
      task: "1.1",
      title: "AI-assisted development with Kiro",
      check: ["d1-23", "d1-53", "d1-54"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "📝", label: "requirements.md", sub: "User stories and acceptance criteria" },
              { icon: "📐", label: "design.md", sub: "Architecture, error handling, test strategy" },
              { icon: "✅", label: "tasks.md", sub: "Discrete, trackable implementation tasks" },
              { icon: "🤖", label: "Agent implements", sub: "Task by task, then you review" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🧭", title: "Steering files", text: "Markdown in .kiro/steering/ with your conventions, tech stack, and structure, so you don't repeat them in every chat.", color: "#38bdf8" },
              { icon: "🪝", title: "Agent hooks", text: "Run a command or an agent prompt automatically on events such as a file save, for example lint or add a companion test.", color: "#38bdf8" },
              { icon: "🔍", title: "Review and scan", text: "Ask the assistant to review a diff, suggest refactors, and flag insecure code before you commit.", color: "#38bdf8" },
              { icon: "🔌", title: "MCP tools", text: "Connect the agent to external tools and APIs through the Model Context Protocol.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Spec-driven development turns an idea into requirements, then a design, then tasks before any code is written, so the output can be checked against agreed acceptance criteria.",
        "AI tools help with code completion, explanations, refactoring suggestions, automated code reviews, and security scanning, but you own the result: review, test, and scan generated code like any other change.",
        "Give the assistant context (steering files, the relevant files, the spec) instead of long one-off prompts. Never paste secrets or customer data into a prompt.",
      ],
      tip: "\"Generated code must meet agreed requirements and be traceable\" → spec-driven development. \"Apply our team's conventions every time\" → steering files.",
    },
    {
      id: "d1-bedrock",
      task: "1.1",
      title: "Calling Amazon Bedrock from your code",
      check: ["d1-56", "d1-58", "d1-59"],
      visual: (
        <div className="grid gap-6">
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "λ", label: "App code (SDK)", sub: "bedrock-runtime client, role credentials" },
              { icon: "💬", label: "Converse / ConverseStream", sub: "messages + system + inferenceConfig" },
              { icon: "🧠", label: "Foundation model", sub: "Chosen by modelId" },
              { icon: "📦", label: "Response", sub: "output, stopReason, usage (input/output tokens)" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🎛️", title: "maxTokens", text: "Caps the length (and cost) of each response. Too low and stopReason is max_tokens: the answer is cut off.", color: "#34d399" },
              { icon: "🌊", title: "ConverseStream", text: "Returns text in chunks as it's generated, so users see output sooner. Needs bedrock:InvokeModelWithResponseStream.", color: "#34d399" },
              { icon: "🚦", title: "ThrottlingException (429)", text: "Account quota exceeded. Retry with exponential backoff and jitter; request a quota increase if it persists.", color: "#f87171" },
              { icon: "🧮", title: "Usage and cost", text: "You pay per input and output token. Read usage in each response and watch token metrics in CloudWatch.", color: "#38bdf8" },
            ]}
          />
          <BedrockLab />
        </div>
      ),
      points: [
        "The Converse API gives one request and response shape across Bedrock models that support messages, so switching models is mostly a modelId change. InvokeModel takes each model's native JSON body.",
        "Converse needs bedrock:InvokeModel; ConverseStream needs bedrock:InvokeModelWithResponseStream. Scope both to the model ARNs the app actually uses.",
        "Handle errors by type: retry 429 throttling and 5xx with backoff and jitter; fix 400 validation errors and 403 access errors instead of retrying them.",
        "Treat the model's text as untrusted input: validate it (for example parse and check JSON) before your code acts on it.",
      ],
      tip: "Truncated answers → check stopReason for max_tokens. Bursty traffic failing with 429 → backoff and jitter first, quota increase second.",
    },
    {
      id: "d1-lambda",
      task: "1.2",
      title: "Configuring Lambda and handling its events",
      check: ["d1-24", "d1-25", "d1-31", "d1-33"],
      visual: (
        <div className="grid gap-4">
          <Layers
            layers={[
              { name: "Resources", color: "#f59e0b", items: ["Memory 128 MB – 10,240 MB (CPU scales with it)", "Timeout up to 900 s (15 min), default 3 s", "Ephemeral /tmp 512 MB – 10,240 MB"] },
              { name: "Code", color: "#38bdf8", items: ["Runtime + handler", "Layers (shared libraries)", "Extensions (monitoring, secrets caching)", "Environment variables"] },
              { name: "Wiring", color: "#34d399", items: ["Triggers / event source mappings", "Destinations (on success / on failure)", "Execution role", "VPC subnets + security groups"] },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "☎️", title: "Synchronous", text: "API Gateway, ALB, SDK Invoke. Caller waits and handles errors and retries itself.", color: "#38bdf8" },
              { icon: "📮", title: "Asynchronous", text: "S3, SNS, EventBridge. Lambda queues the event and retries function errors twice.", color: "#f59e0b" },
              { icon: "🔁", title: "Event source mapping", text: "SQS, Kinesis, DynamoDB Streams. Lambda polls and invokes with batches.", color: "#34d399" },
            ]}
          />
          <Flow
            color="#f87171"
            steps={[
              { icon: "📮", label: "Async event", sub: "Queued by Lambda" },
              { icon: "💥", label: "Function error", sub: "Up to 2 retries" },
              { icon: "📦", label: "On-failure destination", sub: "SQS, SNS, Lambda, or EventBridge with error details" },
            ]}
          />
        </div>
      ),
      points: [
        "A function attached to a VPC gets no public IP. Use a NAT gateway for internet access, or VPC endpoints for AWS services.",
        "Use environment variables for per-environment settings, layers for shared dependencies, and extensions for tools that run alongside the function.",
        "Work longer than 15 minutes doesn't fit Lambda: split it with Step Functions or run it on ECS/Fargate.",
        "Destinations record the event plus the result or error; a function DLQ (SQS or SNS) keeps only the event payload. Both apply to asynchronous invocations.",
        "For SQS batches, enable ReportBatchItemFailures. For Kinesis and DynamoDB Streams, limit retries, bisect the batch on error, and add an on-failure destination.",
      ],
      tip: "A DLQ on the function does nothing for SQS or stream triggers. For SQS, set the DLQ on the source queue.",
    },
    {
      id: "d1-dynamodb",
      task: "1.3",
      title: "DynamoDB keys, indexes, and capacity",
      check: ["d1-38", "d1-39"],
      visual: (
        <div className="grid gap-6">
          <PartitionHeat />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🔎", title: "Query", text: "Needs the partition key; optional sort key condition. Reads only matching items.", color: "#34d399" },
              { icon: "🧹", title: "Scan", text: "Reads every item, then filters. Filter expressions don't reduce capacity used.", color: "#f87171" },
              { icon: "🗂️", title: "Local secondary index", text: "Same partition key, different sort key. Created with the table. Supports strong reads.", color: "#38bdf8" },
              { icon: "🌍", title: "Global secondary index", text: "Any partition and sort key. Add any time. Eventually consistent reads only.", color: "#38bdf8" },
            ]}
          />
          <DynamoCapacityLab />
        </div>
      ),
      points: [
        "1 RCU = one strongly consistent read per second of up to 4 KB, or two eventually consistent reads. Transactional reads cost double.",
        "1 WCU = one write per second of up to 1 KB. Transactional writes cost double. Always round item size up.",
        "Pick a high-cardinality partition key (user ID, order ID) so traffic spreads across partitions.",
        "Query and Scan return up to 1 MB per call; page with LastEvaluatedKey and ExclusiveStartKey.",
      ],
      tip: "Capacity math: round the item size up first (to 4 KB for reads, 1 KB for writes), multiply by the rate, then halve for eventual or double for transactional.",
    },
    {
      id: "d1-caching",
      task: "1.3",
      title: "Data stores, caching, and lifecycles",
      check: ["d1-48", "d1-50"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={2}
            tiles={[
              { icon: "💤", title: "Lazy loading (cache-aside)", text: "Read cache → on a miss, read the DB and fill the cache. Only requested data is cached; data can go stale.", color: "#f59e0b" },
              { icon: "✍️", title: "Write-through", text: "Every DB write also updates the cache. Always fresh, but writes cost more and unread data fills the cache.", color: "#f59e0b" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "⚡", title: "ElastiCache", text: "In-memory Redis OSS / Valkey / Memcached: sessions, leaderboards, query cache.", color: "#38bdf8" },
              { icon: "🚀", title: "DAX", text: "Write-through cache in front of DynamoDB. Microsecond reads, minimal code change.", color: "#38bdf8" },
              { icon: "🔍", title: "OpenSearch Service", text: "Full-text search, fuzzy matching, log analytics.", color: "#38bdf8" },
              { icon: "🧮", title: "Athena", text: "Serverless SQL over files in S3.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Choose by access pattern: key-value at scale → DynamoDB; relational joins and transactions → RDS or Aurora; objects and files → S3; hot data in memory → ElastiCache.",
        "Match the cache to the store: DAX for DynamoDB with little code change, ElastiCache for RDS queries or computed results, CloudFront for content at the edge.",
        "Add a TTL to cached entries to bound staleness under lazy loading.",
        "Data lifecycle: DynamoDB TTL deletes expired items at no extra cost; S3 Lifecycle rules transition objects (for example to S3 Glacier storage classes) or expire them; log groups and streams have retention periods.",
      ],
      tip: "\"Must never serve stale data after a write\" → write-through. \"Cache only what's actually read\" → lazy loading.",
    },
  ],

  questions: [
    // ── Patterns ──
    {
      id: "d1-01",
      domain: "d1",
      lesson: "d1-patterns",
      prompt:
        "An order service calls the payment, inventory, and shipping services synchronously. When the shipping service is slow, customers can't place orders. The team wants orders to be accepted even when a downstream service is unavailable. Which solution meets these requirements with the LEAST operational overhead?",
      options: [
        "Publish an event to an Amazon SNS topic and give each downstream service its own Amazon SQS queue subscribed to the topic",
        "Increase the timeout of the order service to 15 minutes",
        "Merge all four services into a single application on one Amazon EC2 instance",
        "Add more synchronous retries to every downstream call",
      ],
      answer: [0],
      explanation:
        "SNS-to-SQS fanout decouples the services: the order service publishes and returns, and each queue holds messages until its consumer is healthy again. Longer timeouts and more retries keep the tight coupling.",
    },
    {
      id: "d1-02",
      domain: "d1",
      lesson: "d1-patterns",
      prompt:
        "A web application on Amazon EC2 instances behind an Application Load Balancer stores user sessions in instance memory. Users are logged out whenever Auto Scaling terminates an instance. What should the developer do?",
      options: [
        "Store session data in Amazon ElastiCache or Amazon DynamoDB so the instances become stateless",
        "Enable sticky sessions on the load balancer",
        "Move to larger instance types",
        "Store sessions on each instance's Amazon EBS volume",
      ],
      answer: [0],
      explanation:
        "Externalizing session state makes the tier stateless, so any instance can serve any user. Sticky sessions still lose the session when the instance is terminated.",
    },
    {
      id: "d1-03",
      domain: "d1",
      lesson: "d1-patterns",
      prompt:
        "A loan application workflow has six steps with retries, a branch based on credit score, and a wait for a human approval that can take days. The team wants a visual view of each execution. Which service should coordinate the workflow?",
      options: [
        "AWS Step Functions (Standard workflow)",
        "Lambda functions that invoke each other directly",
        "An Amazon SNS topic with one subscriber per step",
        "A cron job on an Amazon EC2 instance",
      ],
      answer: [0],
      explanation:
        "Step Functions orchestrates multi-step workflows with built-in Retry, Catch, Choice states, and callback waits. Standard workflows can run for up to a year and show each execution's history.",
    },
    {
      id: "d1-04",
      domain: "d1",
      lesson: "d1-patterns",
      prompt:
        "Each image uploaded to an Amazon S3 bucket must be processed by three independent services: thumbnails, metadata extraction, and virus scanning. Each service must be able to fail and retry without affecting the others. Which design meets these requirements?",
      options: [
        "Send the S3 event notification to an Amazon SNS topic that fans out to three Amazon SQS queues, one per service",
        "Send the S3 event notification to one SQS queue that all three services poll",
        "Invoke one Lambda function that calls the three services in sequence",
        "Stream the uploads through Amazon Data Firehose to the three services",
      ],
      answer: [0],
      explanation:
        "Fanout gives every service its own copy of the event in its own queue. With a single shared queue, each message is consumed by only one of the competing consumers.",
    },
    {
      id: "d1-06",
      domain: "d1",
      lesson: "d1-patterns",
      type: "match",
      prompt: "Match each integration pattern to its description.",
      pairs: [
        ["Synchronous request-response", "The caller waits for the result before it continues"],
        ["Asynchronous messaging", "The caller hands off the work and continues immediately"],
        ["Choreography", "Services react to events with no central coordinator"],
        ["Orchestration", "A central coordinator tells each service what to do and when"],
      ],
      explanation: "API Gateway → Lambda is synchronous; SQS is asynchronous; EventBridge rules enable choreography; Step Functions provides orchestration.",
    },
    {
      id: "d1-07",
      domain: "d1",
      lesson: "d1-patterns",
      prompt:
        "A company processes about 100,000 IoT events per second. Each event runs through a short workflow that finishes in under 10 seconds, and the steps are idempotent. Which AWS Step Functions option is the MOST cost-effective fit?",
      options: ["Express workflows", "Standard workflows", "Standard workflows with a Wait state", "Activities polled by Amazon EC2 workers"],
      answer: [0],
      explanation:
        "Express workflows are built for high-volume, short-duration (up to 5 minutes) event processing and are priced by executions and duration. Standard workflows are priced per state transition and suit long-running, exactly-once work.",
    },
    // ── Messaging ──
    {
      id: "d1-08",
      domain: "d1",
      lesson: "d1-messaging",
      prompt:
        "A consumer takes about 60 seconds to process each message from an Amazon SQS standard queue that uses the default settings. The team sees many messages processed twice. What is the MOST likely fix?",
      options: [
        "Increase the queue's visibility timeout to longer than the processing time",
        "Enable long polling on the queue",
        "Reduce the message retention period",
        "Add a delivery delay to the queue",
      ],
      answer: [0],
      explanation:
        "The default visibility timeout is 30 seconds. When processing takes longer, the message becomes visible again and another consumer receives it. Raise the timeout or call ChangeMessageVisibility during long work.",
    },
    {
      id: "d1-10",
      domain: "d1",
      lesson: "d1-messaging",
      prompt:
        "A developer must isolate messages that repeatedly fail processing in an Amazon SQS standard queue so they can be inspected later. Which steps should the developer take? (Choose two.)",
      options: [
        "Create a second SQS standard queue to act as the dead-letter queue",
        "Configure a redrive policy on the source queue with a maxReceiveCount",
        "Set the source queue's message retention period to 0",
        "Use an Amazon SNS topic as the dead-letter queue for the SQS queue",
        "Enable long polling on the dead-letter queue",
      ],
      answer: [0, 1],
      explanation:
        "An SQS dead-letter queue is another SQS queue of the same type. The source queue's redrive policy moves a message there after it has been received maxReceiveCount times without being deleted.",
    },
    {
      id: "d1-11",
      domain: "d1",
      lesson: "d1-messaging",
      prompt:
        "A banking application must process transactions for each account in the exact order they were sent, and must not process duplicates. Transactions for different accounts can be processed in parallel. Which solution meets these requirements?",
      options: [
        "An Amazon SQS FIFO queue with the account ID as the message group ID",
        "An Amazon SQS standard queue with a sequence number in each message",
        "An Amazon SNS standard topic with one subscriber",
        "An Amazon SQS FIFO queue with one message group ID for all messages",
      ],
      answer: [0],
      explanation:
        "FIFO queues preserve order within a message group and deduplicate messages. Using the account ID as the group ID keeps per-account order while letting different accounts process in parallel. One group for everything would serialize all accounts.",
    },
    {
      id: "d1-12",
      domain: "d1",
      lesson: "d1-messaging",
      prompt:
        "Producers writing to an Amazon Kinesis data stream receive ProvisionedThroughputExceededException errors. Metrics show one shard is overloaded while the others are nearly idle. Which actions should the developer take? (Choose two.)",
      options: [
        "Use a partition key with many more distinct values so records spread across shards",
        "Split the hot shard to add capacity for that key range",
        "Increase the stream's data retention period",
        "Switch consumers to enhanced fan-out",
        "Use one constant partition key for all records",
      ],
      answer: [0, 1],
      explanation:
        "The partition key decides the shard. A low-cardinality key creates a hot shard; a better key spreads writes, and resharding adds capacity. Retention and enhanced fan-out affect storage and reads, not write throughput.",
    },
    {
      id: "d1-14",
      domain: "d1",
      lesson: "d1-messaging",
      prompt:
        "An application emits order events in JSON. Events whose detail.status is \"FAILED\" must go to a Lambda function, and all events from the \"payments\" source must go to an SQS queue. Which solution requires the LEAST custom code?",
      options: [
        "Amazon EventBridge rules with event patterns that match each condition and target the function or queue",
        "A Lambda function that inspects every event and routes it",
        "An Amazon SQS queue with a consumer that forwards messages",
        "AWS CloudTrail trails with event selectors",
      ],
      answer: [0],
      explanation: "EventBridge rules filter events by content using event patterns and deliver matches to targets, with no routing code to write or run.",
    },
    {
      id: "d1-15",
      domain: "d1",
      lesson: "d1-messaging",
      prompt:
        "A bug caused a consumer to mishandle events delivered through an Amazon EventBridge event bus during the past two days. After the fix, the team wants to reprocess those events. What should the team have configured?",
      options: ["An EventBridge archive, then start a replay for the affected time window", "An SQS delay queue", "A longer Lambda timeout", "An Amazon SNS FIFO topic"],
      answer: [0],
      explanation: "EventBridge archives store events that match a pattern; a replay sends archived events from a chosen time range back to the bus.",
    },
    {
      id: "d1-16",
      domain: "d1",
      lesson: "d1-messaging",
      prompt:
        "A company ingests clickstream data in real time. Three applications must each read the same records in order, and an analytics job must be able to re-read the last 24 hours of records. Which service fits?",
      options: ["Amazon Kinesis Data Streams", "Amazon SQS standard queue", "Amazon SNS standard topic", "Amazon SES"],
      answer: [0],
      explanation: "Kinesis Data Streams keeps records for the retention period, preserves order within a shard, and lets several consumers read the same records independently. An SQS message is deleted once consumed.",
    },
    {
      id: "d1-62",
      domain: "d1",
      lesson: "d1-messaging",
      prompt:
        "An application emits thousands of JSON log records per second. The records must land in Amazon S3 in batches for later analysis, and the team doesn't want to write or run any consumer code. Which service should the producers send to?",
      options: ["Amazon Data Firehose with an S3 destination", "Amazon SQS standard queue polled by EC2 instances", "Amazon SNS with an email subscription", "AWS Step Functions Standard workflow"],
      answer: [0],
      explanation: "Data Firehose buffers streaming records and delivers them to destinations such as S3, optionally transforming them with Lambda, with no consumers to manage. Kinesis Data Streams fits when you need custom real-time consumers.",
    },
    // ── APIs and resilience ──
    {
      id: "d1-17",
      domain: "d1",
      lesson: "d1-apis",
      prompt:
        "A Lambda function calls a third-party API that sometimes returns HTTP 503 for a few seconds. What is the BEST way for the code to handle these errors?",
      options: [
        "Retry with exponential backoff and jitter, up to a maximum number of attempts",
        "Retry immediately in a tight loop until the call succeeds",
        "Treat every 503 as permanent and return an error to the user",
        "Raise the Lambda timeout to 15 minutes and retry every second",
      ],
      answer: [0],
      explanation: "Transient errors are best handled with capped retries that wait longer each time, with randomness so many clients don't retry at the same moment.",
    },
    {
      id: "d1-18",
      domain: "d1",
      lesson: "d1-apis",
      prompt:
        "When a payment provider has an outage, every Lambda invocation waits for the full HTTP timeout. Concurrency climbs until other functions in the account are throttled. Which pattern should the developer implement?",
      options: [
        "A circuit breaker that fails fast after repeated errors and periodically lets a test call through",
        "Longer HTTP timeouts so calls eventually succeed",
        "Unlimited retries inside each invocation",
        "Remove error handling so the function fails sooner",
      ],
      answer: [0],
      explanation: "A circuit breaker stops sending calls to a failing dependency for a period (state can be kept in DynamoDB or ElastiCache), protecting concurrency and latency until the dependency recovers.",
    },
    {
      id: "d1-19",
      domain: "d1",
      lesson: "d1-apis",
      prompt:
        "A Lambda function triggered by an Amazon SQS standard queue charges customers' cards. Occasionally a message is delivered twice and a card is charged twice. Which change prevents duplicate charges?",
      options: [
        "Store each order ID in DynamoDB with a conditional write (attribute_not_exists) and skip orders already recorded",
        "Switch to short polling",
        "Lower the function's memory setting",
        "Increase the queue's message retention period",
      ],
      answer: [0],
      explanation: "Standard queues deliver at least once, so consumers must be idempotent. A conditional put on an idempotency key succeeds only the first time.",
    },
    {
      id: "d1-20",
      domain: "d1",
      lesson: "d1-apis",
      prompt:
        "A legacy backend expects requests in a different JSON shape than mobile clients send, and the backend can't be changed. The API runs on Amazon API Gateway (REST API). How should the developer adapt the requests?",
      options: [
        "Use a non-proxy integration with a mapping template that transforms the request body",
        "Use a Lambda proxy integration and change the mobile app",
        "Enable API caching",
        "Create a usage plan with API keys",
      ],
      answer: [0],
      explanation: "Mapping templates in non-proxy (custom) integrations transform requests and responses, and can also override response status codes.",
    },
    {
      id: "d1-21",
      domain: "d1",
      lesson: "d1-apis",
      prompt:
        "A REST API in Amazon API Gateway should reject POST requests that are missing required fields before they reach the backend Lambda function. Which feature should the developer use?",
      options: ["A request validator with a JSON Schema model for the method", "A Lambda authorizer", "Stage variables", "API Gateway caching"],
      answer: [0],
      explanation: "Request validation checks required parameters and validates the body against a model, returning 400 without invoking the backend.",
    },
    {
      id: "d1-22",
      domain: "d1",
      lesson: "d1-apis",
      prompt: "Which statements about the AWS SDKs are correct? (Choose two.)",
      options: [
        "They automatically retry throttling and transient server errors with exponential backoff",
        "They find credentials through a default credential provider chain, such as environment variables or an attached IAM role",
        "They require access keys to be hard-coded in the source code",
        "Calls made through an SDK bypass IAM authorization",
        "They retry 400 validation errors until the request succeeds",
      ],
      answer: [0, 1],
      explanation: "SDKs sign every request with Signature Version 4 using credentials from the provider chain, and have built-in retry for retryable errors. IAM still authorizes every call.",
    },
    {
      id: "d1-60",
      domain: "d1",
      lesson: "d1-apis",
      prompt:
        "A Lambda function receives an order object from Amazon SQS, adds a status field, and stores it in Amazon S3 for a downstream service that expects JSON. The message body arrives as a string. What should the function do?",
      options: [
        "Parse the message body with a JSON parser, update the object, then serialize it back to a JSON string before calling PutObject",
        "Store the raw message body and append the status field as plain text at the end",
        "Pass the in-memory object to PutObject and let S3 convert it to JSON",
        "Base64-encode the body so S3 can read the fields",
      ],
      answer: [0],
      explanation:
        "SQS bodies and S3 objects are strings or bytes. Deserialize to work with the data, then serialize to the agreed format (here JSON) before handing it to the next service.",
    },
    {
      id: "d1-61",
      domain: "d1",
      lesson: "d1-apis",
      prompt:
        "A product page calls a recommendations service that sometimes fails. Product details must still load when recommendations are unavailable. Which approach meets this requirement?",
      options: [
        "Catch the failure with a short timeout and return the page with cached or default recommendations (graceful degradation)",
        "Fail the whole page request so the user retries",
        "Retry the recommendations call in a loop until it succeeds",
        "Move the recommendations service into the same deployment as the product service",
      ],
      answer: [0],
      explanation: "Graceful degradation keeps the core function working when an optional dependency fails, using a fallback instead of an error. Unbounded retries and coupling make the outage spread.",
    },
    // ── AI-assisted development ──
    {
      id: "d1-23",
      domain: "d1",
      lesson: "d1-ai-dev",
      prompt:
        "A team uses Kiro to build a new feature. They want the AI agent's code to be traceable to agreed user stories and acceptance criteria, with a reviewed design before any code is written. Which approach should they use?",
      options: [
        "Create a spec so the agent produces requirements, then a design, then a task list that it implements task by task",
        "Paste the feature idea into a chat and accept the first full implementation",
        "Turn off all file-save hooks so the agent works faster",
        "Write the acceptance criteria in code comments after the agent finishes",
      ],
      answer: [0],
      explanation:
        "Spec-driven development captures requirements (requirements.md), a design (design.md), and discrete tasks (tasks.md) before implementation, so the generated code can be checked against what was agreed.",
    },
    {
      id: "d1-53",
      domain: "d1",
      lesson: "d1-ai-dev",
      prompt:
        "Every developer on a team has to remind the AI coding assistant to use the team's logging library, error-handling style, and folder layout. How can they give the assistant this context once for the whole project?",
      options: [
        "Add steering files to the repository that describe the conventions, tech stack, and structure",
        "Write the conventions into every prompt by hand",
        "Store the conventions in an environment variable on each laptop",
        "Disable the assistant for files that don't follow the conventions",
      ],
      answer: [0],
      explanation: "Steering files are Markdown files in the project (in Kiro, under .kiro/steering/) that give the agent persistent context such as coding standards, libraries, and project structure.",
    },
    {
      id: "d1-54",
      domain: "d1",
      lesson: "d1-ai-dev",
      prompt: "An AI assistant generated a new Lambda handler that calls DynamoDB. Which steps should the developer take before merging it? (Choose two.)",
      options: [
        "Review the code and run unit and integration tests against it like any other change",
        "Run a security scan and check the IAM permissions the code needs against least privilege",
        "Merge it without review, because AI-generated code is already tested",
        "Paste production customer records into the prompt so the assistant can test with real data",
        "Delete existing tests that fail so the build passes",
      ],
      answer: [0, 1],
      explanation:
        "Generated code can contain bugs, insecure patterns, or broad permissions. The developer remains responsible: review, test, and scan it. Real customer data must not go into prompts, and failing tests are a signal, not noise.",
    },
    {
      id: "d1-55",
      domain: "d1",
      lesson: "d1-ai-dev",
      prompt:
        "A developer wants a linter with auto-fix to run, and a matching unit test file to be created, automatically whenever the AI agent saves a new TypeScript source file. Which Kiro feature fits?",
      options: ["An agent hook triggered by the file save", "A steering file", "A Lambda layer", "An Amazon EventBridge schedule"],
      answer: [0],
      explanation: "Agent hooks run a shell command or an agent prompt when an event occurs, such as after a file is saved, which automates repetitive follow-up work like linting or creating companion tests.",
    },
    {
      id: "d1-64",
      domain: "d1",
      lesson: "d1-ai-dev",
      type: "match",
      prompt: "Match each AI-assisted development task to what it gives the developer.",
      pairs: [
        ["Intelligent code completion", "Suggests the next lines while you type"],
        ["Automated code review", "Comments on a diff before it's merged"],
        ["Security scanning", "Flags vulnerable patterns such as injection or hard-coded secrets"],
        ["Refactoring suggestion", "Proposes a cleaner structure that keeps behavior the same"],
      ],
      explanation: "AI tools speed up each part of writing code, but every suggestion is still reviewed and tested by the developer.",
    },
    // ── Amazon Bedrock in application code ──
    {
      id: "d1-56",
      domain: "d1",
      lesson: "d1-bedrock",
      prompt:
        "An application calls a text model in Amazon Bedrock. The team expects to try models from other providers later and wants to change as little request and response code as possible. Which API should the developer use?",
      options: [
        "The Converse API, which uses the same message format across models that support messages",
        "InvokeModel with each provider's native JSON request body",
        "The Amazon S3 SelectObjectContent API",
        "A separate SDK per model provider, called directly over the internet",
      ],
      answer: [0],
      explanation: "Converse normalizes requests (messages, system, inferenceConfig) and responses (output, stopReason, usage) across supported models, so switching is mostly a different modelId. InvokeModel takes model-specific bodies.",
    },
    {
      id: "d1-57",
      domain: "d1",
      lesson: "d1-bedrock",
      prompt:
        "Users of a chat feature wait 10 seconds for long answers to appear all at once. The team wants text to appear as soon as the model starts generating. The function's role currently allows only bedrock:InvokeModel. What should the developer do? (Choose two.)",
      options: [
        "Call ConverseStream and send each text delta to the client as it arrives",
        "Add bedrock:InvokeModelWithResponseStream for the model's ARN to the function's role",
        "Raise maxTokens to the highest value the model allows",
        "Call Converse twice in parallel and return whichever finishes first",
        "Increase the function's memory to 10,240 MB",
      ],
      answer: [0, 1],
      explanation: "Streaming returns contentBlockDelta events while the model generates, which cuts time to first text. ConverseStream is authorized by bedrock:InvokeModelWithResponseStream, separate from bedrock:InvokeModel.",
    },
    {
      id: "d1-58",
      domain: "d1",
      lesson: "d1-bedrock",
      prompt:
        "During a marketing launch, many requests from a Lambda function to Amazon Bedrock fail with ThrottlingException (HTTP 429). Which actions should the developer take? (Choose two.)",
      options: [
        "Retry throttled calls with exponential backoff and jitter, up to a maximum number of attempts",
        "Check the account's Amazon Bedrock quotas and request an increase if steady traffic exceeds them",
        "Retry immediately in a tight loop until each call succeeds",
        "Treat 429 like a validation error and never retry",
        "Remove the IAM role from the function",
      ],
      answer: [0, 1],
      explanation: "A 429 means the account quota was exceeded for the moment. Backoff with jitter spreads retries out; a quota increase (or other throughput options) fixes sustained demand. Tight-loop retries make throttling worse.",
    },
    {
      id: "d1-59",
      domain: "d1",
      lesson: "d1-bedrock",
      prompt:
        "Summaries generated through the Bedrock Converse API sometimes stop mid-sentence. The responses show stopReason \"max_tokens\". What is the cause?",
      options: [
        "The maxTokens value in inferenceConfig is too low for the length of summary being requested",
        "The function's timeout is too short",
        "The model is being throttled",
        "The prompt contains a stop sequence",
      ],
      answer: [0],
      explanation: "stopReason max_tokens means the model hit the maxTokens limit. Raise the limit to fit the expected answer, or ask for a shorter output. A stop sequence would show stop_sequence, and throttling returns an error, not a partial answer.",
    },
    {
      id: "d1-63",
      domain: "d1",
      lesson: "d1-bedrock",
      prompt: "A team must keep the cost of a Bedrock-powered feature predictable. Which actions help? (Choose two.)",
      options: [
        "Set a maxTokens limit that fits the expected answer length",
        "Read the usage field (input and output tokens) from responses and track token metrics in Amazon CloudWatch",
        "Send the entire conversation history and every document with each request, just in case",
        "Disable retries so failed requests are never billed",
        "Use the longest possible system prompt",
      ],
      answer: [0, 1],
      explanation: "Bedrock on-demand pricing is per input and output token. Capping output and measuring usage keeps spend visible and bounded; sending unnecessary context raises input tokens on every call.",
    },
    {
      id: "d1-65",
      domain: "d1",
      lesson: "d1-bedrock",
      type: "match",
      prompt: "Match each Amazon Bedrock runtime error to the right handling.",
      pairs: [
        ["ThrottlingException (429)", "Retry with exponential backoff and jitter"],
        ["ValidationException (400)", "Fix the request parameters; retrying won't help"],
        ["AccessDeniedException (403)", "Check the caller's IAM permissions for the model"],
        ["ServiceUnavailable (503)", "Retry with backoff; the service is under temporary load"],
      ],
      explanation: "Retry transient errors (429, 5xx). Client errors (400, 403) need a code or permission fix.",
    },
    // ── Lambda configuration ──
    {
      id: "d1-24",
      domain: "d1",
      lesson: "d1-lambda",
      prompt:
        "A nightly job takes about 25 minutes to process a file. A developer wants to move it from an EC2 instance to a serverless option. What should the developer do?",
      options: [
        "Run it as an Amazon ECS task on AWS Fargate, or split it into smaller steps coordinated by AWS Step Functions",
        "Set the Lambda function timeout to 30 minutes",
        "Give the Lambda function 10 GB of memory so it never times out",
        "Use provisioned concurrency to extend the timeout",
      ],
      answer: [0],
      explanation: "Lambda's maximum timeout is 900 seconds (15 minutes). Longer work needs containers on Fargate or a workflow that splits it into shorter steps.",
    },
    {
      id: "d1-25",
      domain: "d1",
      lesson: "d1-lambda",
      prompt:
        "A Lambda function connected to private subnets in a VPC can query an Amazon RDS database, but its calls to a public third-party API time out. What should the developer do?",
      options: [
        "Route the private subnets' internet traffic through a NAT gateway",
        "Assign a public IP address to the Lambda function",
        "Add a route to an internet gateway in the private subnets' route table",
        "Remove the security group from the function",
      ],
      answer: [0],
      explanation:
        "Lambda's network interfaces in a VPC have no public IP, even in a public subnet. Outbound internet access goes through a NAT gateway in a public subnet. AWS services can also be reached through VPC endpoints.",
    },
    {
      id: "d1-26",
      domain: "d1",
      lesson: "d1-lambda",
      prompt: "Ten Lambda functions use the same internal validation library. The team wants to update the library once without rebuilding every function's package. What should they use?",
      options: ["A Lambda layer", "A Lambda extension", "Environment variables", "Reserved concurrency"],
      answer: [0],
      explanation: "Layers package shared libraries or runtimes that many functions reference. A function can use up to five layers.",
    },
    {
      id: "d1-28",
      domain: "d1",
      lesson: "d1-lambda",
      prompt:
        "The same Lambda code is deployed to dev, test, and prod, but each environment writes to a different DynamoDB table. How should the developer provide the table name without changing code between environments?",
      options: ["Set the table name in an environment variable for each function", "Hard-code all three names and pick one at random", "Store the name in /tmp", "Create a separate code branch per environment"],
      answer: [0],
      explanation: "Environment variables hold configuration that changes between environments. Sensitive values belong in Secrets Manager or Parameter Store instead.",
    },
    {
      id: "d1-30",
      domain: "d1",
      lesson: "d1-lambda",
      prompt:
        "A team wants every Lambda function to send telemetry to a third-party monitoring tool and to cache secrets locally, without changing each function's handler code. What should they add?",
      options: ["Lambda extensions, packaged as layers", "More reserved concurrency", "A function URL", "An Amazon SQS dead-letter queue"],
      answer: [0],
      explanation: "Extensions run alongside the function in its execution environment and integrate with monitoring, observability, security, and secrets tools. They're usually delivered as layers.",
    },
    // ── Lambda invocation and errors ──
    {
      id: "d1-31",
      domain: "d1",
      lesson: "d1-lambda",
      prompt:
        "Amazon S3 invokes a Lambda function for each upload. When processing fails after all retries, the team wants a record of the event together with the error message and stack trace, sent to an SQS queue. What should the developer configure?",
      options: [
        "An on-failure destination on the function that points to the SQS queue",
        "A dead-letter queue on the S3 bucket",
        "An SQS queue as the function's event source mapping",
        "A longer function timeout",
      ],
      answer: [0],
      explanation: "Destinations for asynchronous invocations send the event plus invocation details such as the error. A function DLQ would keep only the original event payload.",
    },
    {
      id: "d1-32",
      domain: "d1",
      lesson: "d1-lambda",
      prompt: "By default, how does Lambda handle a function error during an asynchronous invocation?",
      options: [
        "It retries the invocation two more times, with delays between attempts",
        "It never retries",
        "It retries every minute for 24 hours",
        "It returns the error to the event source, which must retry",
      ],
      answer: [0],
      explanation: "For asynchronous invocations Lambda retries function errors twice by default. You can lower the retry count and the maximum event age, and send failures to a destination or DLQ.",
    },
    {
      id: "d1-33",
      domain: "d1",
      lesson: "d1-lambda",
      prompt:
        "A Lambda function processes batches of 10 messages from an Amazon SQS queue. When one message fails, all 10 messages are retried and the successful ones are processed again. What should the developer do?",
      options: [
        "Enable ReportBatchItemFailures and return the IDs of only the failed messages",
        "Set the batch size to 10,000",
        "Delete the queue's dead-letter queue",
        "Switch the queue to short polling",
      ],
      answer: [0],
      explanation: "With partial batch responses, Lambda deletes the successful messages and returns only the listed failures to the queue.",
    },
    {
      id: "d1-34",
      domain: "d1",
      lesson: "d1-lambda",
      prompt:
        "A malformed record in an Amazon Kinesis data stream makes the Lambda consumer fail repeatedly, and processing for that shard has stopped. Which configuration keeps the shard moving while keeping the bad record for analysis?",
      options: [
        "On the event source mapping, enable bisect batch on function error, limit maximum retry attempts, and add an on-failure destination",
        "Add a dead-letter queue to the function's asynchronous invocation settings",
        "Increase the stream's retention period",
        "Increase the number of shards",
      ],
      answer: [0],
      explanation: "Stream event source mappings retry a failing batch until it succeeds or expires. Bisecting isolates the bad record, retry limits stop the loop, and the on-failure destination records it.",
    },
    {
      id: "d1-35",
      domain: "d1",
      lesson: "d1-lambda",
      type: "order",
      prompt: "Put the life of a failing asynchronous Lambda invocation in order.",
      items: [
        "Lambda places the event in its internal queue and returns success to the caller",
        "Lambda invokes the function, and the function throws an error",
        "Lambda retries the invocation, up to two more times",
        "After the final failure, Lambda sends the event to the on-failure destination",
      ],
      explanation: "The caller gets an immediate acknowledgement; retries and failure handling happen inside Lambda.",
    },
    {
      id: "d1-37",
      domain: "d1",
      lesson: "d1-lambda",
      prompt:
        "A search index must be updated within seconds whenever an item in a DynamoDB table is created, updated, or deleted. Which steps meet this requirement with the LEAST operational overhead? (Choose two.)",
      options: [
        "Enable DynamoDB Streams on the table",
        "Configure a Lambda event source mapping on the stream that updates the index",
        "Scan the table every minute with a scheduled job",
        "Enable AWS CloudTrail data events for the table",
        "Configure Amazon S3 event notifications",
      ],
      answer: [0, 1],
      explanation: "DynamoDB Streams captures item-level changes in order, and Lambda polls the stream to process them in near real time.",
    },
    // ── DynamoDB ──
    {
      id: "d1-38",
      domain: "d1",
      lesson: "d1-dynamodb",
      prompt:
        "An Orders table uses order status (PENDING, SHIPPED, DELIVERED) as its partition key. Writes are throttled even though total consumed capacity is well below the provisioned capacity. What should the developer change?",
      options: [
        "Use a high-cardinality partition key such as order ID or customer ID",
        "Use a scan instead of a query",
        "Switch every read to strongly consistent",
        "Add a local secondary index on status",
      ],
      answer: [0],
      explanation: "With only three key values, most traffic lands on one partition (a hot partition). A key with many distinct values spreads load evenly.",
    },
    {
      id: "d1-39",
      domain: "d1",
      lesson: "d1-dynamodb",
      prompt: "An application performs 50 strongly consistent reads per second. Each item is 7 KB. How many read capacity units must be provisioned?",
      options: ["100", "50", "88", "200"],
      answer: [0],
      explanation: "7 KB rounds up to 8 KB, which is two 4 KB units per read. 2 × 50 = 100 RCU.",
    },
    {
      id: "d1-40",
      domain: "d1",
      lesson: "d1-dynamodb",
      prompt: "An application writes 20 items per second to a DynamoDB table. Each item is 3.5 KB. How many write capacity units are needed?",
      options: ["80", "20", "70", "160"],
      answer: [0],
      explanation: "3.5 KB rounds up to 4 KB, which is 4 WCU per write. 4 × 20 = 80 WCU.",
    },
    {
      id: "d1-42",
      domain: "d1",
      lesson: "d1-dynamodb",
      prompt:
        "A table has partition key customerId and sort key orderDate. The application needs all orders for one customer from the last 30 days. Which operation is the MOST efficient?",
      options: [
        "Query with customerId = :c AND orderDate >= :since",
        "Scan with a filter expression on customerId and orderDate",
        "GetItem with only customerId",
        "BatchGetItem for every possible date",
      ],
      answer: [0],
      explanation: "A Query uses the key condition to read only matching items. A Scan reads the whole table and filters afterward, consuming capacity for every item read.",
    },
    {
      id: "d1-43",
      domain: "d1",
      lesson: "d1-dynamodb",
      prompt:
        "An existing Users table has partition key userId. A new feature must look up users by email address with low latency. What should the developer do?",
      options: ["Add a global secondary index with email as its partition key", "Add a local secondary index on email", "Scan the table and filter by email", "Create a second table and copy data manually"],
      answer: [0],
      explanation: "GSIs can use a different partition key and can be added to an existing table. LSIs must share the table's partition key and can only be created with the table.",
    },
    {
      id: "d1-44",
      domain: "d1",
      lesson: "d1-dynamodb",
      prompt:
        "Before creating a table, a developer knows the application must query each customer's items sorted by a second attribute, and those queries need strongly consistent reads. Which index type fits?",
      options: ["A local secondary index defined when the table is created", "A global secondary index added later", "A DynamoDB Accelerator (DAX) cluster", "A sparse global secondary index"],
      answer: [0],
      explanation: "An LSI keeps the table's partition key with an alternate sort key and supports strongly consistent reads. GSIs support only eventually consistent reads.",
    },
    {
      id: "d1-45",
      domain: "d1",
      lesson: "d1-dynamodb",
      prompt: "Which DynamoDB features help keep data correct when several writers update the same items at the same time? (Choose two.)",
      options: [
        "Conditional writes that check a version attribute (optimistic locking)",
        "TransactWriteItems for all-or-nothing changes across multiple items",
        "Scanning the table before every write",
        "Eventually consistent reads",
        "Increasing read capacity units",
      ],
      answer: [0, 1],
      explanation: "A condition expression rejects a write if the item changed since it was read. Transactions apply a group of writes atomically.",
    },
    // ── Caching and data stores ──
    {
      id: "d1-47",
      domain: "d1",
      lesson: "d1-caching",
      prompt: "Which statements describe the lazy loading (cache-aside) caching strategy? (Choose two.)",
      options: [
        "Only data that the application actually requests is stored in the cache",
        "A cache miss costs an extra trip: read the database, then write the cache",
        "The cache is always up to date immediately after every database write",
        "Every write goes to the cache before the database",
        "Cached entries never need a TTL",
      ],
      answer: [0, 1],
      explanation: "Lazy loading fills the cache on misses, so it holds only requested data but can serve stale values. A TTL limits how stale they get.",
    },
    {
      id: "d1-48",
      domain: "d1",
      lesson: "d1-caching",
      prompt:
        "A product price shown from an Amazon ElastiCache cluster must never be stale after the price is updated in the database. Which caching strategy should the developer use?",
      options: ["Write-through: update the cache whenever the database is written", "Lazy loading with a 24-hour TTL", "No TTL and no cache updates", "Cache only on application start-up"],
      answer: [0],
      explanation: "Write-through keeps the cache in step with every write, at the cost of extra write work and caching data that might never be read.",
    },
    {
      id: "d1-49",
      domain: "d1",
      lesson: "d1-caching",
      prompt:
        "A read-heavy application on DynamoDB needs microsecond read latency for frequently read items, with minimal code changes. Which solution meets these requirements?",
      options: ["DynamoDB Accelerator (DAX)", "A global secondary index", "Strongly consistent reads", "Amazon S3 Transfer Acceleration"],
      answer: [0],
      explanation: "DAX is an in-memory cache compatible with the DynamoDB API, so the application mostly switches clients. It serves eventually consistent reads from memory.",
    },
    {
      id: "d1-50",
      domain: "d1",
      lesson: "d1-caching",
      prompt: "Session records in a DynamoDB table should be deleted automatically 24 hours after creation, without consuming write capacity or running a cleanup job. What should the developer use?",
      options: ["DynamoDB Time to Live (TTL) on an expiry timestamp attribute", "A scheduled Lambda function that scans and deletes", "S3 Lifecycle rules", "DynamoDB Streams"],
      answer: [0],
      explanation: "TTL deletes items after the epoch timestamp in the TTL attribute passes, at no extra cost. Deletion happens in the background, usually within a few days of expiry.",
    },
    {
      id: "d1-51",
      domain: "d1",
      lesson: "d1-caching",
      prompt: "Application log files in Amazon S3 must move to a cheaper storage class after 30 days and be deleted after 1 year. What is the simplest solution?",
      options: ["An S3 Lifecycle configuration with a transition rule and an expiration rule", "A Lambda function that copies and deletes objects nightly", "S3 Versioning", "S3 Cross-Region Replication"],
      answer: [0],
      explanation: "Lifecycle rules transition and expire objects on a schedule with no code.",
    },
    {
      id: "d1-52",
      domain: "d1",
      lesson: "d1-caching",
      type: "match",
      prompt: "Match each access pattern to the data store that fits it best.",
      pairs: [
        ["Key-value lookups at any scale with single-digit millisecond latency", "Amazon DynamoDB"],
        ["Full-text search with relevance ranking and fuzzy matching", "Amazon OpenSearch Service"],
        ["Ad hoc SQL queries on files already stored in Amazon S3", "Amazon Athena"],
        ["Sub-millisecond in-memory cache for sessions and hot data", "Amazon ElastiCache"],
      ],
      explanation: "Pick a purpose-built store by access pattern rather than forcing one database to do everything.",
    },
  ],

  cards: [
    { id: "s-lambda", domain: "d1", kind: "service", term: "AWS Lambda", definition: "Run code on events without managing servers; up to 15 minutes per invocation" },
    { id: "s-apigw", domain: "d1", kind: "service", term: "Amazon API Gateway", definition: "Create, secure, and publish REST, HTTP, and WebSocket APIs" },
    { id: "s-dynamodb", domain: "d1", kind: "service", term: "Amazon DynamoDB", definition: "Serverless key-value and document database" },
    { id: "s-sqs", domain: "d1", kind: "service", term: "Amazon SQS", definition: "Message queue that decouples producers and consumers" },
    { id: "s-sns", domain: "d1", kind: "service", term: "Amazon SNS", definition: "Pub/sub topics that push messages to many subscribers" },
    { id: "s-eventbridge", domain: "d1", kind: "service", term: "Amazon EventBridge", definition: "Event bus with content-based routing rules, schedules, and replay" },
    { id: "s-stepfunctions", domain: "d1", kind: "service", term: "AWS Step Functions", definition: "Orchestrate workflows as state machines with retries and branching" },
    { id: "s-kinesis", domain: "d1", kind: "service", term: "Amazon Kinesis Data Streams", definition: "Ordered, replayable real-time data streams split into shards" },
    { id: "s-elasticache", domain: "d1", kind: "service", term: "Amazon ElastiCache", definition: "Managed in-memory cache (Redis OSS, Valkey, Memcached)" },
    { id: "s-dax", domain: "d1", kind: "service", term: "DynamoDB Accelerator (DAX)", definition: "In-memory cache for DynamoDB with microsecond reads" },
    { id: "s-opensearch", domain: "d1", kind: "service", term: "Amazon OpenSearch Service", definition: "Full-text search and log analytics" },
    { id: "s-athena", domain: "d1", kind: "service", term: "Amazon Athena", definition: "Serverless SQL queries over data in S3" },
    { id: "s-s3", domain: "d1", kind: "service", term: "Amazon S3", definition: "Object storage with events, lifecycle rules, and presigned URLs" },
    { id: "s-kiro", domain: "d1", kind: "service", term: "Kiro", definition: "AI development tool with specs, steering files, agent hooks, and an IDE and CLI" },
    { id: "s-bedrock", domain: "d1", kind: "service", term: "Amazon Bedrock", definition: "Call foundation models from many providers through one managed API" },
    { id: "s-firehose", domain: "d1", kind: "service", term: "Amazon Data Firehose", definition: "Buffers streaming data and delivers it to S3, OpenSearch Service, and other destinations" },
    { id: "s-quick", domain: "d1", kind: "service", term: "Amazon Quick", definition: "AI-powered assistant for work: research, business insights, automation, and no-code apps" },
    { id: "c-visibility", domain: "d1", kind: "concept", term: "Visibility timeout", definition: "How long SQS hides a received message; default 30 s, max 12 h" },
    { id: "c-dlq", domain: "d1", kind: "concept", term: "Dead-letter queue", definition: "Where messages go after maxReceiveCount failed receives" },
    { id: "c-fifo", domain: "d1", kind: "concept", term: "SQS FIFO queue", definition: "Ordered per message group ID, deduplicated within 5 minutes" },
    { id: "c-rcu", domain: "d1", kind: "concept", term: "Read capacity unit", definition: "1 strongly consistent (or 2 eventual) reads/s of up to 4 KB" },
    { id: "c-gsi", domain: "d1", kind: "concept", term: "Global secondary index", definition: "Different partition key; add any time; eventually consistent reads" },
    { id: "c-lazy", domain: "d1", kind: "concept", term: "Lazy loading", definition: "Fill the cache on a miss; only requested data, may be stale" },
    { id: "c-writethrough", domain: "d1", kind: "concept", term: "Write-through", definition: "Update the cache on every database write; always fresh" },
    { id: "c-idempotency", domain: "d1", kind: "concept", term: "Idempotency", definition: "Processing the same request twice has the same effect as once" },
    { id: "c-destinations", domain: "d1", kind: "concept", term: "Lambda Destinations", definition: "Send async results or failures, with details, to SQS, SNS, Lambda, or EventBridge" },
    { id: "c-spec", domain: "d1", kind: "concept", term: "Spec-driven development", definition: "Requirements → design → tasks, agreed before the AI agent writes code" },
    { id: "c-steering", domain: "d1", kind: "concept", term: "Steering files", definition: "Project Markdown files that give an AI agent persistent conventions and context" },
    { id: "c-converse", domain: "d1", kind: "concept", term: "Converse API", definition: "One request/response shape across Bedrock models; needs bedrock:InvokeModel" },
    { id: "c-conversestream", domain: "d1", kind: "concept", term: "ConverseStream", definition: "Streams text deltas as generated; needs bedrock:InvokeModelWithResponseStream" },
    { id: "c-maxtokens", domain: "d1", kind: "concept", term: "maxTokens", definition: "Caps response length and cost; hitting it gives stopReason max_tokens" },
    { id: "c-graceful", domain: "d1", kind: "concept", term: "Graceful degradation", definition: "Serve a reduced or cached response when an optional dependency fails" },
  ],

  challenges: [
    {
      id: "ch-bedrock-safe",
      domain: "d1",
      lesson: "d1-bedrock",
      title: "Make the request succeed safely",
      goal: "Get a complete answer from Bedrock during a throttling burst: least-privilege role, no PII in the prompt, maxTokens between what the answer needs and the 1,024 budget, and retries that back off.",
      hint: "Immediate retries all land inside the throttling window. And check stopReason: max_tokens means the answer was cut off.",
      takeaway: "A safe Bedrock call = role scoped to the model ARN, sensitive data removed before sending, a sensible maxTokens cap, and backoff with jitter for 429s.",
      render: (onSolved) => <BedrockLab goal="safe" onSolved={onSolved} />,
    },
    {
      id: "ch-provision-capacity",
      domain: "d1",
      lesson: "d1-dynamodb",
      title: "Provision the right capacity",
      goal: "Pick any workload and provision exactly the RCU and WCU it needs: no throttling, no idle capacity.",
      hint: "Round item size up to 4 KB for reads and 1 KB for writes, multiply by the rate, then halve for eventual or double for transactional.",
      takeaway: "Capacity planning is just rounding and multiplying. Under-provisioning throttles; over-provisioning wastes money.",
      render: (onSolved) => <DynamoCapacityLab goal="provision" onSolved={onSolved} />,
    },
    {
      id: "ch-sqs-once",
      domain: "d1",
      lesson: "d1-messaging",
      title: "Process it exactly once",
      goal: "Send a healthy message that is processed exactly once and deleted, with no duplicates.",
      hint: "The message must stay hidden for the whole time the consumer is working on it.",
      takeaway: "Set the visibility timeout above your processing time, plus a buffer. Otherwise SQS hands the same message to another consumer.",
      render: (onSolved) => <SqsLab goal="once" onSolved={onSolved} />,
    },
    {
      id: "ch-sqs-dlq",
      domain: "d1",
      lesson: "d1-messaging",
      title: "Quarantine the poison message",
      goal: "Make the always-failing message end up in a dead-letter queue instead of looping forever.",
      hint: "A redrive policy needs to be switched on, with a maxReceiveCount.",
      takeaway: "A DLQ with a sensible maxReceiveCount stops one bad message from wasting consumer time and keeps it for debugging.",
      render: (onSolved) => <SqsLab goal="dlq" onSolved={onSolved} />,
    },
  ],
});
