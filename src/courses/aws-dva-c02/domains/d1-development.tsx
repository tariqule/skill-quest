import { Flow, Layers, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { DynamoCapacityLab, SqsLab } from "../labs";
import { PartitionHeat } from "../visuals";

/**
 * Domain 1: Development with AWS Services (32%).
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "Development with AWS Services",
    world: "The Serverless Foundry",
    weight: 32,
    emoji: "⚙️",
    color: "#f59e0b",
    summary: "Event-driven patterns, messaging, APIs, Lambda configuration and error handling, DynamoDB, and caching.",
  },

  tasks: [
    {
      id: "1.1",
      title: "Develop code for applications hosted on AWS",
      covers: [
        "Architectural patterns: event-driven, microservices, monolithic, choreography, orchestration, fanout",
        "Stateful vs stateless, tightly vs loosely coupled, synchronous vs asynchronous",
        "Fault-tolerant, resilient code: retries, circuit breakers, error handling for third-party integrations",
        "Create, extend, and maintain APIs: request/response transformations, validation, status codes",
        "Unit tests in development environments (for example, AWS SAM)",
        "Messaging services, AWS SDKs and APIs, streaming data, Amazon EventBridge",
        "Amazon Q Developer as a development assistant",
      ],
    },
    {
      id: "1.2",
      title: "Develop code for AWS Lambda",
      covers: [
        "Access private resources in VPCs from Lambda",
        "Configure memory, concurrency, timeout, runtime, handler, layers, extensions, triggers, destinations, environment variables",
        "Handle the event lifecycle and errors: Lambda Destinations, dead-letter queues",
        "Write and run test code; integrate Lambda with AWS services",
        "Tune Lambda for performance; process and transform data in near real time",
      ],
    },
    {
      id: "1.3",
      title: "Use data stores in application development",
      covers: [
        "High-cardinality partition keys for balanced partition access",
        "Consistency models: strongly vs eventually consistent; query vs scan",
        "DynamoDB keys and indexing",
        "Serialize and deserialize data for persistence",
        "Use, manage, and maintain data stores; manage data lifecycles",
        "Caching services; specialized data stores by access pattern (for example, Amazon OpenSearch Service)",
      ],
    },
  ],

  lessons: [
    {
      id: "d1-patterns",
      task: "1.1",
      title: "Event-driven and loosely coupled design",
      check: ["d1-01", "d1-03"],
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
            cols={3}
            tiles={[
              { icon: "💃", title: "Choreography", text: "Services react to events. No central controller (EventBridge rules).", color: "#a78bfa" },
              { icon: "🎼", title: "Orchestration", text: "A coordinator drives each step, retries, and branches (Step Functions).", color: "#a78bfa" },
              { icon: "🪶", title: "Stateless", text: "Keep session state in ElastiCache or DynamoDB so any instance can serve any request.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Asynchronous messaging lets a producer continue without waiting, and lets a failed consumer catch up later.",
        "Fanout: one event, many independent consumers (SNS → several SQS queues, or several EventBridge rules).",
        "Step Functions Standard workflows run up to one year with exactly-once steps; Express workflows run up to five minutes at very high volume.",
      ],
      tip: "\"Decouple\", \"absorb spikes\", or \"keep working if a downstream service is down\" → put a queue or event bus between the services.",
    },
    {
      id: "d1-messaging",
      task: "1.1",
      title: "SQS, SNS, EventBridge, and Kinesis",
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
          <SqsLab />
        </div>
      ),
      points: [
        "Visibility timeout (default 30 s, max 12 hours) hides a received message. If work outlasts it, the message is delivered again.",
        "Long polling (WaitTimeSeconds up to 20 s) cuts empty receives and cost. A redrive policy moves repeatedly failing messages to a dead-letter queue.",
        "FIFO queues order messages within a message group ID and deduplicate within a 5-minute window.",
        "Kinesis routes records to shards by partition key. A hot key throttles one shard; enhanced fan-out gives each consumer its own read throughput.",
      ],
      tip: "Duplicates in SQS usually mean the visibility timeout is shorter than processing time, or the consumer isn't idempotent.",
    },
    {
      id: "d1-apis",
      task: "1.1",
      title: "APIs and resilient integrations",
      check: ["d1-17", "d1-20"],
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
            cols={3}
            tiles={[
              { icon: "⏳", title: "Retry with backoff + jitter", text: "Wait longer after each failure, with randomness, so clients don't retry in lockstep.", color: "#34d399" },
              { icon: "🔌", title: "Circuit breaker", text: "After repeated failures, fail fast for a while instead of piling up calls. Probe, then close.", color: "#34d399" },
              { icon: "🔑", title: "Idempotency key", text: "Record a request ID with a conditional write so a retried message can't charge twice.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "Lambda proxy integration passes the whole request to the function, which must return statusCode, headers, and body.",
        "Non-proxy integrations use mapping templates to transform requests and responses without changing the backend.",
        "AWS SDKs sign requests, use the default credential provider chain, and retry throttling and 5xx errors with exponential backoff.",
        "Amazon Q Developer gives inline code suggestions, explains code, and can generate unit tests in your IDE.",
      ],
      tip: "Retry only transient errors (throttling, 5xx, timeouts). Retrying a 400 validation error just fails again.",
    },
    {
      id: "d1-lambda-config",
      task: "1.2",
      title: "Configuring Lambda functions",
      check: ["d1-24", "d1-25"],
      visual: (
        <div className="grid gap-4">
          <Layers
            layers={[
              { name: "Resources", color: "#f59e0b", items: ["Memory 128 MB – 10,240 MB (CPU scales with it)", "Timeout up to 900 s (15 min), default 3 s", "Ephemeral /tmp 512 MB – 10,240 MB"] },
              { name: "Code", color: "#38bdf8", items: ["Runtime + handler", "Layers (shared libraries)", "Extensions (monitoring, secrets caching)", "Environment variables"] },
              { name: "Wiring", color: "#34d399", items: ["Triggers / event source mappings", "Destinations (on success / on failure)", "Execution role", "VPC subnets + security groups"] },
            ]}
          />
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "λ", label: "Lambda in your VPC", sub: "ENIs in private subnets" },
              { icon: "🗄️", label: "Private RDS / ElastiCache", sub: "Reached directly in the VPC" },
              { icon: "↗️", label: "NAT gateway", sub: "Needed for internet calls" },
              { icon: "🌐", label: "Third-party API", sub: "Or use VPC endpoints for AWS services" },
            ]}
          />
        </div>
      ),
      points: [
        "Code outside the handler runs once per execution environment: create SDK clients and connections there so warm invocations reuse them.",
        "A function attached to a VPC gets no public IP. Use a NAT gateway for internet access, or VPC endpoints for AWS services.",
        "Use environment variables for per-environment settings, and layers for dependencies shared across functions.",
        "Work longer than 15 minutes doesn't fit Lambda: split it with Step Functions or run it on ECS/Fargate.",
      ],
      tip: "\"CPU-bound function is slow\" → raise memory; Lambda allocates CPU in proportion to memory.",
    },
    {
      id: "d1-lambda-events",
      task: "1.2",
      title: "Invocation models and error handling",
      check: ["d1-31", "d1-33"],
      visual: (
        <div className="grid gap-4">
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
        "Destinations record the event plus the result or error; a function DLQ (SQS or SNS) keeps only the event payload. Both apply to asynchronous invocations.",
        "For SQS batches, enable ReportBatchItemFailures and return the failed message IDs so only those messages are retried.",
        "For Kinesis and DynamoDB Streams, a failing record blocks its shard: set maximum retry attempts or record age, bisect the batch on error, and add an on-failure destination.",
        "DynamoDB Streams + Lambda processes item changes in near real time (search indexes, aggregates, notifications).",
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
      title: "Caching, lifecycles, and purpose-built stores",
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
        "Add a TTL to cached entries to bound staleness under lazy loading.",
        "Data lifecycle: DynamoDB TTL deletes expired items at no extra cost; S3 Lifecycle rules transition or expire objects.",
        "Serialize objects (for example to JSON) before storing them in a cache or table, and deserialize on read.",
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
      id: "d1-05",
      domain: "d1",
      lesson: "d1-patterns",
      prompt: "Which statements describe a loosely coupled architecture? (Choose two.)",
      options: [
        "Components communicate through queues, topics, or event buses rather than direct calls",
        "One component can fail without immediately causing the others to fail",
        "Every service shares one database schema, so all teams deploy together",
        "Services call each other by hard-coded IP address",
        "The whole application is built and deployed as a single unit",
      ],
      answer: [0, 1],
      explanation: "Loose coupling isolates failures and lets components change and scale independently. Shared schemas, hard-coded addresses, and single deployment units are signs of tight coupling.",
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
      id: "d1-09",
      domain: "d1",
      lesson: "d1-messaging",
      prompt: "An application polls an Amazon SQS queue in a tight loop and receives many empty responses, which raises costs. Which change reduces empty responses?",
      options: ["Set ReceiveMessage WaitTimeSeconds to 20 (long polling)", "Poll more frequently with short polling", "Convert the queue to a delay queue", "Convert the queue to a FIFO queue"],
      answer: [0],
      explanation: "Long polling waits up to 20 seconds for a message to arrive before returning, which removes most empty receives and lowers the request count.",
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
      id: "d1-13",
      domain: "d1",
      lesson: "d1-messaging",
      prompt:
        "Five separate applications consume the same Amazon Kinesis data stream. They are slowing each other down because they share each shard's read throughput. Which feature gives each consumer its own read throughput per shard?",
      options: ["Enhanced fan-out", "Longer data retention", "Server-side encryption", "A larger maximum record size"],
      answer: [0],
      explanation: "Enhanced fan-out gives each registered consumer dedicated throughput (2 MB/s per shard) pushed over HTTP/2, instead of sharing the shard's read capacity.",
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
      id: "d1-23",
      domain: "d1",
      lesson: "d1-apis",
      prompt:
        "A developer new to a codebase wants AI-generated code suggestions in the IDE, explanations of unfamiliar functions, and help writing unit tests. Which AWS service provides this?",
      options: ["Amazon Q Developer", "AWS CloudShell", "AWS X-Ray", "AWS CodeArtifact"],
      answer: [0],
      explanation: "Amazon Q Developer is the AI assistant for development: inline suggestions, chat about code, code reviews and security scans, and test generation.",
    },
    // ── Lambda configuration ──
    {
      id: "d1-24",
      domain: "d1",
      lesson: "d1-lambda-config",
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
      lesson: "d1-lambda-config",
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
      lesson: "d1-lambda-config",
      prompt: "Ten Lambda functions use the same internal validation library. The team wants to update the library once without rebuilding every function's package. What should they use?",
      options: ["A Lambda layer", "A Lambda extension", "Environment variables", "Reserved concurrency"],
      answer: [0],
      explanation: "Layers package shared libraries or runtimes that many functions reference. A function can use up to five layers.",
    },
    {
      id: "d1-27",
      domain: "d1",
      lesson: "d1-lambda-config",
      prompt: "A CPU-intensive Lambda function that resizes images runs slowly at 512 MB of memory. Which change most directly improves its performance?",
      options: ["Increase the memory setting, which also increases the CPU allocated", "Increase the timeout", "Add more environment variables", "Move the function to a VPC"],
      answer: [0],
      explanation: "Lambda allocates CPU power in proportion to memory. More memory often shortens duration enough that cost stays similar or drops.",
    },
    {
      id: "d1-28",
      domain: "d1",
      lesson: "d1-lambda-config",
      prompt:
        "The same Lambda code is deployed to dev, test, and prod, but each environment writes to a different DynamoDB table. How should the developer provide the table name without changing code between environments?",
      options: ["Set the table name in an environment variable for each function", "Hard-code all three names and pick one at random", "Store the name in /tmp", "Create a separate code branch per environment"],
      answer: [0],
      explanation: "Environment variables hold configuration that changes between environments. Sensitive values belong in Secrets Manager or Parameter Store instead.",
    },
    {
      id: "d1-29",
      domain: "d1",
      lesson: "d1-lambda-config",
      prompt: "Which practices reduce Lambda latency by taking advantage of execution environment reuse? (Choose two.)",
      options: [
        "Initialize SDK clients and database connections outside the handler",
        "Keep the deployment package small by including only the dependencies the function needs",
        "Create a new database connection inside the handler on every invocation",
        "Assume that global variables always persist between all invocations",
        "Load all configuration from Amazon S3 on every invocation",
      ],
      answer: [0, 1],
      explanation: "Init code runs once per environment and is reused by warm invocations. Smaller packages initialize faster. Reuse isn't guaranteed, so code must still work on a fresh environment.",
    },
    {
      id: "d1-30",
      domain: "d1",
      lesson: "d1-lambda-config",
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
      lesson: "d1-lambda-events",
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
      lesson: "d1-lambda-events",
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
      lesson: "d1-lambda-events",
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
      lesson: "d1-lambda-events",
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
      lesson: "d1-lambda-events",
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
      id: "d1-36",
      domain: "d1",
      lesson: "d1-lambda-events",
      type: "match",
      prompt: "Match each event source to the way it invokes Lambda.",
      pairs: [
        ["Amazon API Gateway", "Synchronous: the caller waits for the response"],
        ["Amazon SNS", "Asynchronous: Lambda queues the event"],
        ["Amazon DynamoDB Streams", "Event source mapping: Lambda polls for records"],
      ],
      explanation: "Who retries depends on the model: the client for synchronous calls, Lambda for asynchronous ones, and the event source mapping for polled sources.",
    },
    {
      id: "d1-37",
      domain: "d1",
      lesson: "d1-lambda-events",
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
      id: "d1-41",
      domain: "d1",
      lesson: "d1-dynamodb",
      prompt: "A dashboard performs 120 eventually consistent reads per second of 9 KB items. How many read capacity units are needed?",
      options: ["180", "135", "270", "360"],
      answer: [0],
      explanation: "9 KB rounds up to 12 KB = 3 units per read. 3 × 120 = 360 for strong reads; eventually consistent reads cost half, so 180 RCU.",
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
    {
      id: "d1-46",
      domain: "d1",
      lesson: "d1-dynamodb",
      type: "order",
      prompt: "A query returns more than 1 MB of data. Put the steps to read every page in order.",
      items: [
        "Call Query with the key condition",
        "Process the Items in the response",
        "If LastEvaluatedKey is present, call Query again with it as ExclusiveStartKey",
        "Stop when a response has no LastEvaluatedKey",
      ],
      explanation: "Query and Scan return at most 1 MB per call. LastEvaluatedKey marks where the next page starts; the SDK paginators run this loop for you.",
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
    { id: "s-appsync", domain: "d1", kind: "service", term: "AWS AppSync", definition: "Managed GraphQL APIs with real-time subscriptions" },
    { id: "s-s3", domain: "d1", kind: "service", term: "Amazon S3", definition: "Object storage with events, lifecycle rules, and presigned URLs" },
    { id: "s-qdev", domain: "d1", kind: "service", term: "Amazon Q Developer", definition: "AI assistant for writing, explaining, reviewing, and testing code" },
    { id: "c-visibility", domain: "d1", kind: "concept", term: "Visibility timeout", definition: "How long SQS hides a received message; default 30 s, max 12 h" },
    { id: "c-dlq", domain: "d1", kind: "concept", term: "Dead-letter queue", definition: "Where messages go after maxReceiveCount failed receives" },
    { id: "c-longpoll", domain: "d1", kind: "concept", term: "Long polling", definition: "ReceiveMessage waits up to 20 s for messages; fewer empty responses" },
    { id: "c-fifo", domain: "d1", kind: "concept", term: "SQS FIFO queue", definition: "Ordered per message group ID, deduplicated within 5 minutes" },
    { id: "c-rcu", domain: "d1", kind: "concept", term: "Read capacity unit", definition: "1 strongly consistent (or 2 eventual) reads/s of up to 4 KB" },
    { id: "c-wcu", domain: "d1", kind: "concept", term: "Write capacity unit", definition: "1 write/s of up to 1 KB" },
    { id: "c-gsi", domain: "d1", kind: "concept", term: "Global secondary index", definition: "Different partition key; add any time; eventually consistent reads" },
    { id: "c-lsi", domain: "d1", kind: "concept", term: "Local secondary index", definition: "Same partition key, new sort key; created with the table" },
    { id: "c-lazy", domain: "d1", kind: "concept", term: "Lazy loading", definition: "Fill the cache on a miss; only requested data, may be stale" },
    { id: "c-writethrough", domain: "d1", kind: "concept", term: "Write-through", definition: "Update the cache on every database write; always fresh" },
    { id: "c-idempotency", domain: "d1", kind: "concept", term: "Idempotency", definition: "Processing the same request twice has the same effect as once" },
    { id: "c-backoff", domain: "d1", kind: "concept", term: "Exponential backoff with jitter", definition: "Wait longer, with randomness, between retries" },
    { id: "c-destinations", domain: "d1", kind: "concept", term: "Lambda Destinations", definition: "Send async results or failures, with details, to SQS, SNS, Lambda, or EventBridge" },
  ],

  challenges: [
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
