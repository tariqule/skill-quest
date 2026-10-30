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
    summary: "How to build apps on AWS: event-driven design, messaging, APIs, setting up Lambda and handling its errors, DynamoDB, and caching.",
  },

  tasks: [
    {
      id: "1.1",
      title: "Develop code for applications hosted on AWS",
      covers: [
        "Architectural patterns: event-driven, microservices, monolithic, choreography, orchestration, fanout",
        "Stateful versus stateless, tightly versus loosely coupled, synchronous versus asynchronous",
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
        "Consistency models: strongly versus eventually consistent; query versus scan",
        "DynamoDB keys and indexing",
        "Serialize and deserialize data for persistence",
        "Use, manage, and maintain data stores; manage data lifecycles",
        "Caching services; specialized data stores by access pattern (for example, Amazon OpenSearch Service)",
      ],
    },
  ],

  lessons: [
    // ── Start here ──
    {
      id: "d1-start-cloud-apps",
      level: "beginner",
      task: "1.1",
      title: "Start here: what building an app on AWS means",
      check: ["dva2-b1-01", "dva2-b1-02"],
      visual: (
        <Flow
          color="#f59e0b"
          steps={[
            { icon: "🙋", label: "Customer orders", sub: "Someone taps Buy in your app" },
            { icon: "🧾", label: "Ticket on the rail", sub: "A queue holds the order" },
            { icon: "👩‍🍳", label: "Kitchen stations", sub: "Small services each do one job" },
            { icon: "🍽️", label: "Order delivered", sub: "The customer gets a result" },
          ]}
        />
      ),
      points: [
        "**The cloud** means renting computers in someone else's data center and using them over the internet. AWS (Amazon Web Services) is one company that rents them out.",
        "Instead of one big program on one machine, an AWS app is usually built from **services**, ready-made building blocks like a database, a queue, or a place to run code.",
        "Think of a busy restaurant kitchen. The waiter pins each order ticket on a rail, and each station (grill, salad, desserts) picks up its part when it's ready.",
        "On AWS, that ticket rail is a **queue** such as Amazon SQS. The waiter never has to stand and wait for the cook, and no order gets lost if one station is busy.",
      ],
      tip: "Your code talks to every AWS service the same way: through an API call, usually made with an AWS SDK (a library for your programming language).",
    },
    {
      id: "d1-start-lambda",
      level: "beginner",
      task: "1.2",
      title: "Start here: running code without a server",
      check: ["dva2-b1-03", "dva2-b1-04"],
      sources: [{ title: "AWS Lambda Developer Guide: Lambda execution role", url: "https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html", license: "AWS docs, facts only" }],
      visual: (
        <Flow
          color="#38bdf8"
          steps={[
            { icon: "📸", label: "Something happens", sub: "A photo is uploaded" },
            { icon: "λ", label: "Lambda runs your code", sub: "Only for as long as it needs" },
            { icon: "🖼️", label: "Result", sub: "A thumbnail is saved" },
            { icon: "💤", label: "Nothing to look after", sub: "No server sits waiting" },
          ]}
        />
      ),
      points: [
        "A **server** is a computer that runs your program all day. Someone has to keep it updated, patched, and switched on, even at 3 a.m. when nobody uses it.",
        "**Serverless** means AWS looks after the machines for you. You hand over your code, and you pay only while it's actually running.",
        "**AWS Lambda** runs a small piece of your code, called a **function**, whenever an **event** happens. An event is something like a file upload, a web request, or a message in a queue.",
        "It's like a taxi instead of owning a car. You don't park, fuel, or service it. You call it when you need a ride and pay for that trip.",
        "**Amazon S3** is AWS's object storage. An upload to an S3 bucket can send an event that starts a Lambda function, for example to make a thumbnail of each new photo.",
      ],
      tip: "When a question says \"no servers to manage\" or \"run code when something happens\", think of Lambda first.",
    },
    {
      id: "d1-start-data",
      level: "beginner",
      task: "1.3",
      title: "Start here: where an app keeps its data",
      check: ["dva2-b1-05", "dva2-b1-06"],
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "🗄️", title: "Database", text: "Like a filing cabinet. Each record sits in a labeled folder, so you can find it again fast.", color: "#34d399" },
            { icon: "🪣", title: "Object storage (S3)", text: "Like a storage unit for whole files: photos, videos, backups, and reports.", color: "#34d399" },
            { icon: "🗒️", title: "Cache", text: "Like a sticky note on your desk with the answer you look up most, so you don't open the cabinet every time.", color: "#34d399" },
          ]}
        />
      ),
      points: [
        "Apps need somewhere to keep data that lasts after the code stops running: users, orders, photos, settings.",
        "**Amazon DynamoDB** is a database that stores **items**, like one order. Each item has a **key**, such as an order ID, and the key is how DynamoDB finds the item quickly.",
        "**Amazon S3** stores whole files, called **objects**, in containers called **buckets**.",
        "A **cache** keeps a copy of popular data in fast memory. Reading from memory is much quicker than asking the database again, so busy apps feel snappy.",
      ],
      tip: "Ask what you're storing. Small records you look up by a key fit a database like DynamoDB. Whole files fit S3.",
    },

    {
      id: "d1-patterns",
      task: "1.1",
      title: "Event-driven and loosely coupled design",
      check: ["d1-01", "d1-03"],
      sources: [
        { title: "AWS Step Functions: Choosing workflow type", url: "https://docs.aws.amazon.com/step-functions/latest/dg/choosing-workflow-type.html", license: "AWS docs, facts only" },
        { title: "Amazon S3: Event notifications", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/EventNotifications.html", license: "AWS docs, facts only" },
      ],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={2}
            tiles={[
              { icon: "🔗", title: "Tightly coupled, synchronous", text: "The order service calls payment, then shipping, and waits for each one. If one is slow or down, the whole order fails.", color: "#f87171" },
              { icon: "🧩", title: "Loosely coupled, asynchronous", text: "The order service announces \"order placed\" and moves on. Each other service picks it up from its own queue, at its own pace.", color: "#34d399" },
            ]}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "🛒", label: "Order placed", sub: "The order service sends one message" },
              { icon: "📣", label: "SNS topic or EventBridge bus", sub: "Copies it to every subscriber" },
              { icon: "📬", label: "One SQS queue per service", sub: "Holds messages until that service is ready" },
              { icon: "λ", label: "Consumers", sub: "Payment, shipping, email" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "💃", title: "Choreography", text: "Each service reacts to events on its own, with nobody in charge. EventBridge rules work this way.", color: "#a78bfa" },
              { icon: "🎼", title: "Orchestration", text: "One coordinator runs each step in turn, retries failures, and picks branches. Step Functions works this way.", color: "#a78bfa" },
              { icon: "🪶", title: "Stateless", text: "Keep login sessions in ElastiCache or DynamoDB, not on the server, so any server can handle any request.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "With asynchronous messaging the sender doesn't wait. If a receiving service crashes, its messages wait in the queue, and it catches up when it's back.",
        "**Fanout** means one event reaches many independent services. For example, one SNS topic can feed several SQS queues, or several EventBridge rules can match the same event.",
        "Step Functions has two workflow types. **Standard** workflows can run for up to a year and run each step exactly once. **Express** workflows run for up to five minutes and handle very high volumes.",
        "Keep web servers stateless. If **Amazon EC2** instances behind a load balancer keep sessions in memory, users are logged out whenever **Auto Scaling** removes an instance. Store sessions in ElastiCache or DynamoDB instead.",
        "Express workflows suit high-volume, short (up to 5 minutes) steps that are **idempotent**, meaning running them twice gives the same result, because asynchronous Express workflows run at least once and may repeat a step.",
      ],
      tip: "When a question says \"decouple\", \"absorb spikes\", or \"keep working if a downstream service is down\", the answer is usually a queue or an event bus between the services.",
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
              { icon: "📬", title: "SQS", text: "A queue. Workers pull a message, process it, then delete it. Standard queues deliver at least once. FIFO queues keep order and drop duplicates.", color: "#f59e0b" },
              { icon: "📣", title: "SNS", text: "Publish once and SNS pushes a copy to every subscriber: SQS, Lambda, HTTP, or email. Each subscription can filter what it gets.", color: "#f59e0b" },
              { icon: "🚌", title: "EventBridge", text: "An event bus. Rules route events by what's in them. It also runs schedules, takes events from SaaS apps, and can archive and replay events.", color: "#f59e0b" },
              { icon: "🌊", title: "Kinesis Data Streams", text: "A stream of records, kept in order within each shard. Many readers can read the same records, and read them again while they're kept.", color: "#f59e0b" },
            ]}
          />
          <SqsLab />
        </div>
      ),
      points: [
        "When a worker receives an SQS message, the message is hidden for the **visibility timeout** (default 30 seconds, max 12 hours). If the work takes longer, the message reappears and gets processed again.",
        "**Long polling** (WaitTimeSeconds up to 20 seconds) makes a receive call wait for messages to arrive, so you pay for fewer empty replies.",
        "A **redrive policy** moves a message that keeps failing to a **dead-letter queue** (DLQ), a side queue where you can look at it later.",
        "**FIFO** (first in, first out) queues keep messages in order within each message group ID. They also drop duplicates sent within 5 minutes of each other.",
        "Kinesis sends each record to a shard based on its partition key. If one key gets most of the traffic, that one shard is throttled.",
        "**Enhanced fan-out** gives each reading app its own read throughput, so readers don't slow each other down.",
      ],
      tip: "Seeing duplicates in SQS? Usually the visibility timeout is shorter than the processing time, or the consumer isn't idempotent (safe to run twice).",
    },
    {
      id: "d1-apis",
      task: "1.1",
      title: "APIs and resilient integrations",
      check: ["d1-17", "d1-20"],
      sources: [{ title: "Amazon DynamoDB: Troubleshooting throttling", url: "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/TroubleshootingThrottling.html", license: "AWS docs, facts only" }],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#38bdf8"
            steps={[
              { icon: "🙋", label: "Client request" },
              { icon: "✅", label: "Request validation", sub: "A model (JSON Schema) rejects bad input before it reaches your code" },
              { icon: "🔀", label: "Mapping template", sub: "Reshapes the request for the backend (non-proxy only)" },
              { icon: "⚙️", label: "Integration", sub: "Lambda, HTTP, AWS service, or mock" },
              { icon: "↩️", label: "Response mapping", sub: "Reshapes the reply and can change the status code" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "⏳", title: "Retry with backoff and jitter", text: "Wait a bit longer after each failure, plus a random extra, so clients don't all retry at the same moment.", color: "#34d399" },
              { icon: "🔌", title: "Circuit breaker", text: "After several failures in a row, stop calling for a while and fail fast. Then send one test call to see if it's back.", color: "#34d399" },
              { icon: "🔑", title: "Idempotency key", text: "Save each request ID with a conditional write. A retried message then can't charge the card twice.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "With **Lambda proxy integration**, API Gateway passes the whole request to your function. Your function must return statusCode, headers, and body.",
        "**Non-proxy** integrations use mapping templates to reshape requests and responses, so you don't have to change the backend.",
        "The AWS SDKs sign each request for you and find credentials through the default credential provider chain. They also retry throttling and 5xx errors with exponential backoff.",
        "**Amazon Q Developer** is an AI assistant in your code editor. It suggests code as you type, explains code, and can write unit tests.",
        "On AWS, the SDK can pick up credentials from an attached **IAM role** (for example an EC2 instance profile or a Lambda execution role), so you never put keys in code.",
      ],
      tip: "Retry only temporary errors: throttling, 5xx, and timeouts. A 400 validation error will fail the same way every time.",
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
              { name: "Resources", color: "#f59e0b", items: ["Memory from 128 MB to 10,240 MB (more memory also means more CPU)", "Timeout up to 900 seconds (15 minutes), default 3 seconds", "Temporary /tmp storage from 512 MB to 10,240 MB"] },
              { name: "Code", color: "#38bdf8", items: ["Runtime and handler", "Layers (shared libraries)", "Extensions (for monitoring or caching secrets)", "Environment variables"] },
              { name: "Wiring", color: "#34d399", items: ["Triggers and event source mappings", "Destinations (on success or on failure)", "Execution role", "VPC subnets and security groups"] },
            ]}
          />
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "λ", label: "Lambda in your VPC", sub: "Network interfaces in private subnets" },
              { icon: "🗄️", label: "Private RDS or ElastiCache", sub: "Reached directly in the VPC" },
              { icon: "↗️", label: "NAT gateway", sub: "Needed for internet calls" },
              { icon: "🌐", label: "Third-party API", sub: "Or use VPC endpoints for AWS services" },
            ]}
          />
        </div>
      ),
      points: [
        "Code outside the handler runs once, when Lambda sets up a new execution environment. Create SDK clients and connections there, so later (warm) invocations reuse them.",
        "A function attached to a VPC gets no public IP address. To reach the internet it needs a NAT gateway. To reach AWS services it can use VPC endpoints instead.",
        "Use environment variables for settings that differ per environment, like a table name. Use layers for libraries that several functions share.",
        "Lambda can run for 15 minutes at most. For longer work, split it into steps with Step Functions or run it on ECS with Fargate.",
      ],
      tip: "Is a CPU-heavy function slow? Raise its memory. Lambda gives a function CPU in proportion to its memory.",
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
              { icon: "☎️", title: "Synchronous", text: "API Gateway, ALB, and SDK Invoke. The caller waits for the result and handles errors and retries itself.", color: "#38bdf8" },
              { icon: "📮", title: "Asynchronous", text: "S3, SNS, and EventBridge. Lambda queues the event and retries function errors twice.", color: "#f59e0b" },
              { icon: "🔁", title: "Event source mapping", text: "SQS, Kinesis, and DynamoDB Streams. Lambda polls the source and calls your function with batches.", color: "#34d399" },
            ]}
          />
          <Flow
            color="#f87171"
            steps={[
              { icon: "📮", label: "Async event", sub: "Queued by Lambda" },
              { icon: "💥", label: "Function error", sub: "Up to 2 retries" },
              { icon: "📦", label: "On-failure destination", sub: "SQS, SNS, Lambda, or EventBridge, with the error details" },
            ]}
          />
        </div>
      ),
      points: [
        "**Destinations** send the event plus the result or error. A function **DLQ** (an SQS queue or SNS topic) keeps only the event itself. Both work only for asynchronous invocations.",
        "For SQS batches, turn on ReportBatchItemFailures and return the IDs of the failed messages. Only those messages get retried.",
        "On Kinesis and DynamoDB Streams, one failing record blocks its whole shard.",
        "To unblock it, set a maximum retry count or record age, split the batch on error (bisect), and add an on-failure destination.",
        "DynamoDB Streams with Lambda lets you react to item changes in near real time. For example, you can update a search index, a running total, or send a notification.",
      ],
      tip: "A DLQ set on the function does nothing for SQS or stream triggers. For SQS, put the DLQ on the source queue instead.",
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
              { icon: "🔎", title: "Query", text: "Needs the partition key, plus an optional sort key condition. It reads only the items that match.", color: "#34d399" },
              { icon: "🧹", title: "Scan", text: "Reads every item in the table, then filters. A filter doesn't lower the capacity you use.", color: "#f87171" },
              { icon: "🗂️", title: "Local secondary index", text: "Same partition key, different sort key. You must create it with the table. Supports strongly consistent reads.", color: "#38bdf8" },
              { icon: "🌍", title: "Global secondary index", text: "Any partition and sort key. You can add it at any time. Reads are eventually consistent only.", color: "#38bdf8" },
            ]}
          />
          <DynamoCapacityLab />
        </div>
      ),
      points: [
        "One **read capacity unit** (RCU) covers one strongly consistent read per second of up to 4 KB, or two eventually consistent reads. Transactional reads cost double.",
        "One **write capacity unit** (WCU) covers one write per second of up to 1 KB. Transactional writes cost double. Always round the item size up.",
        "Pick a partition key with many different values, like user ID or order ID. This is called **high cardinality**, and it spreads traffic evenly across partitions.",
        "Query and Scan return at most 1 MB per call. To get the next page, pass the LastEvaluatedKey you got back as ExclusiveStartKey.",
      ],
      tip: "For capacity math, round the item size up first (to 4 KB for reads, 1 KB for writes). Multiply by the rate. Then halve it for eventual reads, or double it for transactions.",
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
              { icon: "💤", title: "Lazy loading (cache-aside)", text: "Check the cache first. On a miss, read the database and put the result in the cache. Only data someone asked for is cached, but it can go stale.", color: "#f59e0b" },
              { icon: "✍️", title: "Write-through", text: "Every database write also updates the cache. It's always fresh, but writes cost more and the cache fills up with data nobody reads.", color: "#f59e0b" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "⚡", title: "ElastiCache", text: "In-memory Redis OSS, Valkey, or Memcached. Good for sessions, leaderboards, and saved query results.", color: "#38bdf8" },
              { icon: "🚀", title: "DAX", text: "A write-through cache in front of DynamoDB. Microsecond reads with very little code change.", color: "#38bdf8" },
              { icon: "🔍", title: "OpenSearch Service", text: "Full-text search, fuzzy matching, and log analytics.", color: "#38bdf8" },
              { icon: "🧮", title: "Athena", text: "Run SQL queries on files in S3, with no servers to manage.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Give cached entries a **TTL** (time to live), so lazy-loaded data can only be stale for so long.",
        "To clean up old data automatically, DynamoDB TTL deletes expired items at no extra cost. S3 Lifecycle rules move objects to cheaper storage or delete them.",
        "Serialize objects, for example to JSON, before you store them in a cache or table. Deserialize them when you read them back.",
      ],
      tip: "If data must never be stale after a write, use write-through. If you only want to cache what's actually read, use lazy loading.",
    },
  ],

  questions: [
    // ── Start here ──
    {
      id: "dva2-b1-01",
      domain: "d1",
      lesson: "d1-start-cloud-apps",
      level: "beginner",
      prompt: "What does it mean to run an app \"in the cloud\"?",
      options: [
        "Your app runs on computers in a provider's data centers, which you rent and reach over the internet",
        "Your app runs only on your own laptop",
        "Your app works without any computers at all",
        "Your app can only be used when you're offline, from files copied onto each person's own computer",
      ],
      answer: [0],
      explanation:
        "The cloud is other people's computers that you rent by the hour or by the request. You reach them over the internet, and the provider, here AWS, keeps the hardware running.",
    },
    {
      id: "dva2-b1-02",
      domain: "d1",
      lesson: "d1-start-cloud-apps",
      level: "beginner",
      prompt: "In a restaurant, the waiter pins order tickets on a rail for the kitchen. An Amazon SQS queue plays the same part in an app. Why is that useful?",
      options: [
        "The part that takes orders can keep going even when the part that does the work is busy",
        "It cooks the food faster",
        "It makes sure only one order is ever placed at a time, so the kitchen never gets two at once",
        "It removes the need for any kitchen at all",
      ],
      answer: [0],
      explanation:
        "A queue holds work until someone is free to do it. The sender drops a message in and carries on, and the worker picks it up when it's ready. Nothing is lost if the worker is slow for a moment.",
    },
    {
      id: "dva2-b1-03",
      domain: "d1",
      lesson: "d1-start-lambda",
      level: "beginner",
      prompt: "What is AWS Lambda?",
      options: [
        "A service that runs your code when an event happens, without you managing any servers",
        "A database for storing customer records",
        "A tool for drawing architecture diagrams",
        "A physical server you buy from AWS, ship to your own office, and keep running and patched yourself",
      ],
      answer: [0],
      explanation:
        "Lambda runs small pieces of code, called functions, in response to events. AWS handles the machines, and you pay only for the time your code actually runs.",
    },
    {
      id: "dva2-b1-04",
      domain: "d1",
      lesson: "d1-start-lambda",
      level: "beginner",
      prompt: "A photo is uploaded to Amazon S3, and a Lambda function then makes a small thumbnail of it. What started the function?",
      options: [
        "The upload event from S3",
        "A person clicking Run in the AWS console for every photo",
        "The function was running all day, checking for new photos",
        "A nightly backup job",
      ],
      answer: [0],
      explanation:
        "Lambda functions are triggered by events. Here the event is \"a new photo arrived in S3\". The function wakes up, does its one job, and stops.",
    },
    {
      id: "dva2-b1-05",
      domain: "d1",
      lesson: "d1-start-data",
      level: "beginner",
      prompt: "Each item in a DynamoDB table has a key, such as an order ID. What is the key for?",
      options: [
        "Finding the item quickly, like the label on a folder in a filing cabinet",
        "Encrypting the item so nobody can read it",
        "Setting the price of the item",
        "Choosing which programming language is allowed to read the item",
      ],
      answer: [0],
      explanation:
        "The key is how DynamoDB knows where an item lives. Give it the order ID and it goes straight to that one item, instead of searching through everything.",
    },
    {
      id: "dva2-b1-06",
      domain: "d1",
      lesson: "d1-start-data",
      level: "beginner",
      prompt: "Why would an app keep a copy of popular data in a cache?",
      options: [
        "Reading from fast memory is much quicker than asking the database every time",
        "A cache can never lose data, so it's a safer place than a database",
        "Databases can't store data that's popular",
        "A cache makes the data permanent",
      ],
      answer: [0],
      explanation:
        "A cache is like a sticky note with an answer you need often. The app checks the note first and only goes to the database when the note doesn't have the answer. The trade-off is that a note can go out of date.",
    },

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
        "Merge all four services into a single application on one larger Amazon EC2 instance so calls stay local",
        "Add more synchronous retries to every downstream call",
      ],
      answer: [0],
      explanation:
        "Fanout from SNS to SQS decouples the services. The order service publishes one message and returns straight away, and each queue holds its messages until that service is healthy again. Longer timeouts and more retries keep the services tightly tied together.",
    },
    {
      id: "d1-02",
      domain: "d1",
      lesson: "d1-patterns",
      prompt:
        "A web application on Amazon EC2 instances behind an Application Load Balancer stores user sessions in instance memory. Users are logged out whenever Auto Scaling terminates an instance. What should the developer do?",
      options: [
        "Store session data in Amazon ElastiCache or Amazon DynamoDB so the instances become stateless",
        "Enable sticky sessions on the load balancer, so each user keeps going back to the same instance",
        "Move to larger instance types",
        "Store sessions on each instance's Amazon EBS volume",
      ],
      answer: [0],
      explanation:
        "Moving sessions off the servers makes the web tier stateless, so any instance can serve any user. Sticky sessions don't help here: when the instance is terminated, its sessions go with it.",
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
        "Step Functions coordinates multi-step workflows. It has built-in Retry, Catch, and Choice states, and it can wait for a callback such as a human approval. Standard workflows run for up to a year and keep a visual history of each run.",
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
        "Invoke one Lambda function from the S3 event that calls the thumbnail, metadata and virus scanning services one after another",
        "Stream the uploads through Amazon Data Firehose to the three services",
      ],
      answer: [0],
      explanation:
        "Fanout gives each service its own copy of the event in its own queue, so one can fail and retry without touching the others. With one shared queue, each message goes to only one of the services.",
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
      explanation: "Loose coupling stops one failure from spreading, and lets each part change and scale on its own. A shared schema, hard-coded addresses, and a single deployment unit all tie the parts tightly together.",
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
      explanation: "API Gateway calling Lambda is synchronous, and SQS is asynchronous. With EventBridge rules, services choreograph themselves. With Step Functions, one coordinator orchestrates them.",
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
        "Express workflows are built for huge numbers of short runs (up to 5 minutes each), and you pay by run count and duration. Standard workflows charge per state transition and suit long-running work that must happen exactly once.",
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
        "Enable long polling on the queue so consumers wait up to 20 seconds for messages",
        "Reduce the message retention period",
        "Add a delivery delay to the queue",
      ],
      answer: [0],
      explanation:
        "The default visibility timeout is 30 seconds. If processing takes 60, the message becomes visible again halfway through and another consumer picks it up. Raise the timeout, or call ChangeMessageVisibility during long work.",
    },
    {
      id: "d1-09",
      domain: "d1",
      lesson: "d1-messaging",
      prompt: "An application polls an Amazon SQS queue in a tight loop and receives many empty responses, which raises costs. Which change reduces empty responses?",
      options: ["Set ReceiveMessage WaitTimeSeconds to 20 (long polling)", "Poll more frequently with short polling, every few milliseconds", "Convert the queue to a delay queue", "Convert the queue to a FIFO queue"],
      answer: [0],
      explanation: "With long polling, the receive call waits up to 20 seconds for a message before it returns. That removes most empty replies, so you make fewer requests and pay less.",
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
        "An SQS dead-letter queue is just another SQS queue of the same type. The source queue's redrive policy moves a message there once it has been received maxReceiveCount times without being deleted.",
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
        "An Amazon SQS FIFO queue with one message group ID shared by all messages",
      ],
      answer: [0],
      explanation:
        "FIFO queues keep order within each message group and remove duplicates. Using the account ID as the group ID keeps each account in order while different accounts run in parallel. One group for everything would force every account into a single line.",
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
        "The partition key decides which shard a record goes to. A key with few values piles writes onto one shard. A key with more values spreads them out, and splitting the shard adds capacity. Retention and enhanced fan-out affect storage and reading, not writing.",
    },
    {
      id: "d1-13",
      domain: "d1",
      lesson: "d1-messaging",
      prompt:
        "Five separate applications consume the same Amazon Kinesis data stream. They are slowing each other down because they share each shard's read throughput. Which feature gives each consumer its own read throughput per shard?",
      options: ["Enhanced fan-out", "Longer data retention", "Server-side encryption", "A larger maximum record size"],
      answer: [0],
      explanation: "With enhanced fan-out, each registered consumer gets its own 2 MB per second per shard, pushed to it over HTTP/2. Without it, all the consumers share the shard's read capacity.",
    },
    {
      id: "d1-14",
      domain: "d1",
      lesson: "d1-messaging",
      prompt:
        "An application emits order events in JSON. Events whose detail.status is \"FAILED\" must go to a Lambda function, and all events from the \"payments\" source must go to an SQS queue. Which solution requires the LEAST custom code?",
      options: [
        "Amazon EventBridge rules with event patterns that match each condition and target the function or queue",
        "A single Lambda function that inspects every event's fields and forwards it to the right target",
        "An Amazon SQS queue with a consumer that forwards messages",
        "AWS CloudTrail trails with event selectors",
      ],
      answer: [0],
      explanation: "EventBridge rules match events by their content using event patterns, and send the matches to targets. There's no routing code for you to write or run.",
    },
    {
      id: "d1-15",
      domain: "d1",
      lesson: "d1-messaging",
      prompt:
        "A bug caused a consumer to mishandle events delivered through an Amazon EventBridge event bus during the past two days. After the fix, the team wants to reprocess those events. What should the team have configured?",
      options: ["An EventBridge archive, then start a replay for the affected time window", "An SQS delay queue", "A longer Lambda timeout", "An Amazon SNS FIFO topic that redelivers the last two days of messages in order"],
      answer: [0],
      explanation: "An EventBridge archive stores the events that match a pattern. A replay sends archived events from a time range you choose back onto the bus, so the fixed consumer can process them again.",
    },
    {
      id: "d1-16",
      domain: "d1",
      lesson: "d1-messaging",
      prompt:
        "A company ingests clickstream data in real time. Three applications must each read the same records in order, and an analytics job must be able to re-read the last 24 hours of records. Which service fits?",
      options: ["Amazon Kinesis Data Streams", "Amazon SQS standard queue", "Amazon SNS standard topic with fan-out", "Amazon SES"],
      answer: [0],
      explanation: "Kinesis Data Streams keeps records for the retention period, in order within each shard. Several apps can read the same records, each at its own pace. An SQS message is gone once a consumer deletes it.",
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
        "Raise the Lambda timeout to 15 minutes and retry the call every second until it works",
      ],
      answer: [0],
      explanation: "A 503 that clears after a few seconds is a temporary error. Retry a limited number of times, wait longer each time, and add a random extra wait so many clients don't retry at the same moment.",
    },
    {
      id: "d1-18",
      domain: "d1",
      lesson: "d1-apis",
      prompt:
        "When a payment provider has an outage, every Lambda invocation waits for the full HTTP timeout. Concurrency climbs until other functions in the account are throttled. Which pattern should the developer implement?",
      options: [
        "A circuit breaker that fails fast after repeated errors and periodically lets a test call through",
        "Longer HTTP timeouts on every call, so that requests eventually get a response from the slow provider",
        "Unlimited retries inside each invocation",
        "Remove error handling so the function fails sooner",
      ],
      answer: [0],
      explanation: "A circuit breaker stops calling a failing service for a while, so invocations fail fast instead of waiting. That protects your concurrency and response times until the service recovers. You can keep the breaker's state in DynamoDB or ElastiCache.",
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
        "Increase the queue's visibility timeout so a message can't be received again while it's being processed",
      ],
      answer: [0],
      explanation: "Standard queues deliver each message at least once, so your consumer has to be idempotent: safe to run twice. A conditional put on the order ID succeeds only the first time, so the second delivery is skipped.",
    },
    {
      id: "d1-20",
      domain: "d1",
      lesson: "d1-apis",
      prompt:
        "A legacy backend expects requests in a different JSON shape than mobile clients send, and the backend can't be changed. The API runs on Amazon API Gateway (REST API). How should the developer adapt the requests?",
      options: [
        "Use a non-proxy integration with a mapping template that transforms the request body",
        "Use a Lambda proxy integration and update the mobile app to send the backend's shape",
        "Enable API caching",
        "Create a usage plan with API keys",
      ],
      answer: [0],
      explanation: "In a non-proxy (custom) integration, mapping templates reshape requests and responses, and can also change the response status code. Neither the clients nor the backend need to change.",
    },
    {
      id: "d1-21",
      domain: "d1",
      lesson: "d1-apis",
      prompt:
        "A REST API in Amazon API Gateway should reject POST requests that are missing required fields before they reach the backend Lambda function. Which feature should the developer use?",
      options: ["A request validator with a JSON Schema model for the method", "A Lambda authorizer that checks the request before the call", "Stage variables", "API Gateway caching"],
      answer: [0],
      explanation: "A request validator checks required parameters and checks the body against a model. Bad requests get a 400 straight away, and your Lambda function is never called.",
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
      explanation: "The SDKs sign each request with Signature Version 4, using credentials from the provider chain, and retry the errors that are worth retrying. IAM still checks every call.",
    },
    {
      id: "d1-23",
      domain: "d1",
      lesson: "d1-apis",
      prompt:
        "A developer new to a codebase wants AI-generated code suggestions in the IDE, explanations of unfamiliar functions, and help writing unit tests. Which AWS service provides this?",
      options: ["Amazon Q Developer", "AWS CloudShell", "AWS X-Ray", "AWS CodeArtifact"],
      answer: [0],
      explanation: "Amazon Q Developer is AWS's AI assistant for developers. It suggests code as you type, answers questions about your code, reviews and scans it for security problems, and writes tests.",
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
        "Give the Lambda function the full 10 GB of memory, which raises its maximum timeout from 15 minutes to 30 minutes for longer jobs",
        "Use provisioned concurrency to extend the timeout",
      ],
      answer: [0],
      explanation: "Lambda can run for 900 seconds (15 minutes) at most, whatever the memory or concurrency settings. Longer work needs a container on Fargate, or a workflow that splits it into shorter steps.",
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
        "Lambda's network interfaces in a VPC never get a public IP, even in a public subnet. Internet traffic has to go through a NAT gateway in a public subnet. For AWS services, you can use VPC endpoints instead.",
    },
    {
      id: "d1-26",
      domain: "d1",
      lesson: "d1-lambda-config",
      prompt: "Ten Lambda functions use the same internal validation library. The team wants to update the library once without rebuilding every function's package. What should they use?",
      options: ["A Lambda layer", "A Lambda extension", "Environment variables", "Reserved concurrency"],
      answer: [0],
      explanation: "A layer packages libraries or a runtime that many functions can share, so you update it in one place. A function can use up to five layers.",
    },
    {
      id: "d1-27",
      domain: "d1",
      lesson: "d1-lambda-config",
      prompt: "A CPU-intensive Lambda function that resizes images runs slowly at 512 MB of memory. Which change most directly improves its performance?",
      options: ["Increase the memory setting, which also increases the CPU allocated", "Increase the timeout", "Add more environment variables to tune the function's runtime settings", "Move the function to a VPC"],
      answer: [0],
      explanation: "Lambda gives a function CPU power in proportion to its memory. More memory often makes the function finish so much faster that the cost stays about the same, or even drops.",
    },
    {
      id: "d1-28",
      domain: "d1",
      lesson: "d1-lambda-config",
      prompt:
        "The same Lambda code is deployed to dev, test, and prod, but each environment writes to a different DynamoDB table. How should the developer provide the table name without changing code between environments?",
      options: ["Set the table name in an environment variable for each function", "Hard-code all three names and pick one at random", "Store the name in /tmp", "Create a separate code branch per environment with the table name written into each one"],
      answer: [0],
      explanation: "Environment variables hold settings that change between environments, like a table name. Sensitive values, like passwords, belong in Secrets Manager or Parameter Store instead.",
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
      explanation: "Setup code outside the handler runs once per environment and is reused by warm invocations, and smaller packages start faster. Reuse isn't guaranteed, though, so your code must still work in a fresh environment.",
    },
    {
      id: "d1-30",
      domain: "d1",
      lesson: "d1-lambda-config",
      prompt:
        "A team wants every Lambda function to send telemetry to a third-party monitoring tool and to cache secrets locally, without changing each function's handler code. What should they add?",
      options: ["Lambda extensions, packaged as layers", "More reserved concurrency", "A function URL", "An Amazon SQS dead-letter queue per function"],
      answer: [0],
      explanation: "Extensions run alongside your function in the same execution environment. They plug in monitoring, security, and secrets tools without touching your handler, and they're usually shipped as layers.",
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
        "A dead-letter queue configured on the S3 bucket's event notification settings",
        "An SQS queue as the function's event source mapping",
        "A longer function timeout",
      ],
      answer: [0],
      explanation: "For asynchronous invocations, a destination receives the event plus details about the run, including the error and stack trace. A function DLQ would keep only the original event.",
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
        "It returns the error to the event source, which must retry the call on its own",
      ],
      answer: [0],
      explanation: "For asynchronous invocations, Lambda retries a function error twice by default. You can lower the retry count and the maximum event age, and send failures to a destination or a DLQ.",
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
        "Set a dead-letter queue with maxReceiveCount of 1 so failures move out",
        "Switch the queue to short polling",
      ],
      answer: [0],
      explanation: "With partial batch responses, your function tells Lambda which messages failed. Lambda deletes the successful ones and puts only the failed ones back on the queue.",
    },
    {
      id: "d1-34",
      domain: "d1",
      lesson: "d1-lambda-events",
      prompt:
        "A malformed record in an Amazon Kinesis data stream makes the Lambda consumer fail repeatedly, and processing for that shard has stopped. Which configuration keeps the shard moving while keeping the bad record for analysis?",
      options: [
        "On the event source mapping, enable bisect batch on function error, limit maximum retry attempts, and add an on-failure destination",
        "Add a dead-letter queue to the function's asynchronous invocation settings, raise the function's timeout, and give it more memory",
        "Increase the stream's retention period",
        "Increase the number of shards",
      ],
      answer: [0],
      explanation: "For streams, Lambda keeps retrying a failing batch until it succeeds or the records expire, which stalls the shard. Bisecting finds the bad record, a retry limit ends the loop, and the on-failure destination keeps a copy of it.",
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
      explanation: "The caller gets an answer right away. The retries and the failure handling all happen inside Lambda, after the caller has moved on.",
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
      explanation: "Who retries depends on how Lambda is called. The client retries synchronous calls, Lambda retries asynchronous ones, and the event source mapping retries for polled sources.",
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
      explanation: "DynamoDB Streams records every item change in order. Lambda reads the stream and updates the index within seconds, with no servers or schedules to manage.",
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
        "Switch every read to strongly consistent so the partitions stay balanced",
        "Add a local secondary index on status",
      ],
      answer: [0],
      explanation: "With only three possible key values, most traffic lands on one partition, called a hot partition. A key with many distinct values, like order ID, spreads the load evenly.",
    },
    {
      id: "d1-39",
      domain: "d1",
      lesson: "d1-dynamodb",
      prompt: "An application performs 50 strongly consistent reads per second. Each item is 7 KB. How many read capacity units must be provisioned?",
      options: ["100", "50", "88", "200"],
      answer: [0],
      explanation: "7 KB rounds up to 8 KB, which is two 4 KB units per read. Two units times 50 reads per second gives 100 RCU.",
    },
    {
      id: "d1-40",
      domain: "d1",
      lesson: "d1-dynamodb",
      prompt: "An application writes 20 items per second to a DynamoDB table. Each item is 3.5 KB. How many write capacity units are needed?",
      options: ["80", "20", "70", "160"],
      answer: [0],
      explanation: "3.5 KB rounds up to 4 KB, so each write costs 4 WCU. Four units times 20 writes per second gives 80 WCU.",
    },
    {
      id: "d1-41",
      domain: "d1",
      lesson: "d1-dynamodb",
      prompt: "A dashboard performs 120 eventually consistent reads per second of 9 KB items. How many read capacity units are needed?",
      options: ["180", "135", "270", "360"],
      answer: [0],
      explanation: "9 KB rounds up to 12 KB, which is 3 units per read. Strongly consistent reads would need 360 (3 times 120). Eventually consistent reads cost half, so you need 180 RCU.",
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
      explanation: "A Query uses the key condition to read only the matching items. A Scan reads the whole table and filters afterwards, so you pay capacity for every item it reads.",
    },
    {
      id: "d1-43",
      domain: "d1",
      lesson: "d1-dynamodb",
      prompt:
        "An existing Users table has partition key userId. A new feature must look up users by email address with low latency. What should the developer do?",
      options: ["Add a global secondary index with email as its partition key", "Add a local secondary index on email to the existing Users table", "Scan the table and filter by email", "Create a second table and copy data manually"],
      answer: [0],
      explanation: "A global secondary index (GSI) can use a different partition key, like email, and you can add it to an existing table. A local secondary index (LSI) must share the table's partition key and can only be created with the table.",
    },
    {
      id: "d1-44",
      domain: "d1",
      lesson: "d1-dynamodb",
      prompt:
        "Before creating a table, a developer knows the application must query each customer's items sorted by a second attribute, and those queries need strongly consistent reads. Which index type fits?",
      options: ["A local secondary index defined when the table is created", "A global secondary index added later with the same sort key", "A DynamoDB Accelerator (DAX) cluster", "A sparse global secondary index"],
      answer: [0],
      explanation: "An LSI keeps the table's partition key and adds a different sort key, and it supports strongly consistent reads. A GSI only supports eventually consistent reads.",
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
      explanation: "A condition expression rejects a write if the item changed since you read it. That's called optimistic locking. Transactions apply a group of writes all together or not at all.",
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
      explanation: "Query and Scan return at most 1 MB per call. LastEvaluatedKey marks where the next page starts. The SDK paginators can run this loop for you.",
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
      explanation: "Lazy loading fills the cache only when there's a miss. So it holds only data someone asked for, but that data can go stale. A TTL limits how stale it can get.",
    },
    {
      id: "d1-48",
      domain: "d1",
      lesson: "d1-caching",
      prompt:
        "A product price shown from an Amazon ElastiCache cluster must never be stale after the price is updated in the database. Which caching strategy should the developer use?",
      options: ["Write-through: update the cache whenever the database is written", "Lazy loading with a 24-hour TTL set on every cached price entry", "No TTL and no cache updates", "Cache only on application start-up"],
      answer: [0],
      explanation: "Write-through updates the cache on every database write, so readers never see an old price. The cost is extra work on each write, and caching some data nobody reads.",
    },
    {
      id: "d1-49",
      domain: "d1",
      lesson: "d1-caching",
      prompt:
        "A read-heavy application on DynamoDB needs microsecond read latency for frequently read items, with minimal code changes. Which solution meets these requirements?",
      options: ["DynamoDB Accelerator (DAX)", "A global secondary index", "Strongly consistent reads", "Amazon S3 Transfer Acceleration"],
      answer: [0],
      explanation: "DAX is an in-memory cache that speaks the DynamoDB API, so the app mostly just switches clients. It serves eventually consistent reads from memory in microseconds.",
    },
    {
      id: "d1-50",
      domain: "d1",
      lesson: "d1-caching",
      prompt: "Session records in a DynamoDB table should be deleted automatically 24 hours after creation, without consuming write capacity or running a cleanup job. What should the developer use?",
      options: ["DynamoDB Time to Live (TTL) on an expiry timestamp attribute", "A scheduled Lambda function that scans and deletes", "S3 Lifecycle rules", "DynamoDB Streams"],
      answer: [0],
      explanation: "TTL deletes an item once the epoch timestamp in its TTL attribute has passed, at no extra cost. Deletion happens in the background, usually within a few days of expiry.",
    },
    {
      id: "d1-51",
      domain: "d1",
      lesson: "d1-caching",
      prompt: "Application log files in Amazon S3 must move to a cheaper storage class after 30 days and be deleted after 1 year. What is the simplest solution?",
      options: ["An S3 Lifecycle configuration with a transition rule and an expiration rule", "A Lambda function on a schedule that copies, moves and deletes objects nightly", "S3 Versioning", "S3 Cross-Region Replication"],
      answer: [0],
      explanation: "S3 Lifecycle rules move objects to cheaper storage and delete them on a schedule. You don't write or run any code.",
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
      explanation: "Pick a store built for each way you use data, instead of forcing one database to do everything.",
    },
  ],

  cards: [
    { id: "s-lambda", domain: "d1", kind: "service", term: "AWS Lambda", definition: "Runs your code when an event happens, with no servers to manage. Each run can last up to 15 minutes." },
    { id: "s-apigw", domain: "d1", kind: "service", term: "Amazon API Gateway", definition: "Creates, secures, and publishes REST, HTTP, and WebSocket APIs." },
    { id: "s-dynamodb", domain: "d1", kind: "service", term: "Amazon DynamoDB", definition: "A serverless key-value and document database." },
    { id: "s-sqs", domain: "d1", kind: "service", term: "Amazon SQS", definition: "A message queue between senders and receivers, so neither has to wait for the other." },
    { id: "s-sns", domain: "d1", kind: "service", term: "Amazon SNS", definition: "Publish a message to a topic and SNS pushes a copy to every subscriber." },
    { id: "s-eventbridge", domain: "d1", kind: "service", term: "Amazon EventBridge", definition: "An event bus that routes events by their content, runs schedules, and can replay past events." },
    { id: "s-stepfunctions", domain: "d1", kind: "service", term: "AWS Step Functions", definition: "Runs multi-step workflows as state machines, with retries and branching built in." },
    { id: "s-kinesis", domain: "d1", kind: "service", term: "Amazon Kinesis Data Streams", definition: "Real-time data streams split into shards. Records stay in order per shard and can be read again." },
    { id: "s-elasticache", domain: "d1", kind: "service", term: "Amazon ElastiCache", definition: "A managed in-memory cache running Redis OSS, Valkey, or Memcached." },
    { id: "s-dax", domain: "d1", kind: "service", term: "DynamoDB Accelerator (DAX)", definition: "An in-memory cache for DynamoDB with microsecond reads." },
    { id: "s-opensearch", domain: "d1", kind: "service", term: "Amazon OpenSearch Service", definition: "Full-text search and log analytics." },
    { id: "s-athena", domain: "d1", kind: "service", term: "Amazon Athena", definition: "Run SQL queries on data in S3, with no servers to manage." },
    { id: "s-appsync", domain: "d1", kind: "service", term: "AWS AppSync", definition: "Managed GraphQL APIs with real-time subscriptions." },
    { id: "s-s3", domain: "d1", kind: "service", term: "Amazon S3", definition: "Object storage for files, with event notifications, lifecycle rules, and presigned URLs." },
    { id: "s-qdev", domain: "d1", kind: "service", term: "Amazon Q Developer", definition: "An AI assistant that helps you write, explain, review, and test code." },
    { id: "c-visibility", domain: "d1", kind: "concept", term: "Visibility timeout", definition: "How long SQS hides a message after someone receives it. Default 30 seconds, max 12 hours." },
    { id: "c-dlq", domain: "d1", kind: "concept", term: "Dead-letter queue", definition: "A side queue for messages that failed maxReceiveCount times, so you can inspect them." },
    { id: "c-longpoll", domain: "d1", kind: "concept", term: "Long polling", definition: "ReceiveMessage waits up to 20 seconds for a message, so you get fewer empty replies." },
    { id: "c-fifo", domain: "d1", kind: "concept", term: "SQS FIFO queue", definition: "Keeps messages in order per message group ID, and drops duplicates sent within 5 minutes." },
    { id: "c-rcu", domain: "d1", kind: "concept", term: "Read capacity unit", definition: "One strongly consistent read per second of up to 4 KB, or two eventually consistent ones." },
    { id: "c-wcu", domain: "d1", kind: "concept", term: "Write capacity unit", definition: "One write per second of up to 1 KB." },
    { id: "c-gsi", domain: "d1", kind: "concept", term: "Global secondary index", definition: "An index with a different partition key. You can add it any time, and its reads are eventually consistent." },
    { id: "c-lsi", domain: "d1", kind: "concept", term: "Local secondary index", definition: "An index with the same partition key and a different sort key. You create it with the table." },
    { id: "c-lazy", domain: "d1", kind: "concept", term: "Lazy loading", definition: "Fill the cache only on a miss. It holds only requested data, which may be stale." },
    { id: "c-writethrough", domain: "d1", kind: "concept", term: "Write-through", definition: "Update the cache on every database write, so it's always fresh." },
    { id: "c-idempotency", domain: "d1", kind: "concept", term: "Idempotency", definition: "Running the same request twice has the same effect as running it once." },
    { id: "c-backoff", domain: "d1", kind: "concept", term: "Exponential backoff with jitter", definition: "Wait longer before each retry, plus a random extra, so clients don't retry all together." },
    { id: "c-destinations", domain: "d1", kind: "concept", term: "Lambda Destinations", definition: "Send the result or failure of an async run, with details, to SQS, SNS, Lambda, or EventBridge." },
  ],

  challenges: [
    {
      id: "ch-provision-capacity",
      domain: "d1",
      lesson: "d1-dynamodb",
      title: "Provision the right capacity",
      goal: "Pick any workload and provision exactly the RCU and WCU it needs, so there's no throttling and no idle capacity.",
      hint: "Round the item size up to 4 KB for reads and 1 KB for writes, then multiply by the rate. Halve it for eventual reads, or double it for transactions.",
      takeaway: "Capacity planning is just rounding and multiplying. Too little capacity throttles you, and too much wastes money.",
      render: (onSolved) => <DynamoCapacityLab goal="provision" onSolved={onSolved} />,
    },
    {
      id: "ch-sqs-once",
      domain: "d1",
      lesson: "d1-messaging",
      title: "Process it exactly once",
      goal: "Send a healthy message that gets processed exactly once and then deleted, with no duplicates.",
      hint: "The message must stay hidden for the whole time the consumer is working on it.",
      takeaway: "Set the visibility timeout above your processing time, with some to spare. Otherwise SQS hands the same message to another consumer.",
      render: (onSolved) => <SqsLab goal="once" onSolved={onSolved} />,
    },
    {
      id: "ch-sqs-dlq",
      domain: "d1",
      lesson: "d1-messaging",
      title: "Quarantine the poison message",
      goal: "Make the always-failing message end up in a dead-letter queue instead of looping forever.",
      hint: "Switch on a redrive policy and give it a maxReceiveCount.",
      takeaway: "A DLQ with a sensible maxReceiveCount stops one bad message from wasting your consumers' time, and keeps it so you can debug it.",
      render: (onSolved) => <SqsLab goal="dlq" onSolved={onSolved} />,
    },
  ],
});
