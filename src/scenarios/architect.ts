import type { ArchItem } from "@/engine/scenarios";
import type { LessonSource } from "@/engine/types";

/**
 * Architecture Builder items. Original scenarios; each tile carries its own explanation and each
 * item links to the lesson that teaches it. Sources are the official docs the choices were checked against.
 */

const src = (label: string, url: string): LessonSource => ({ title: label, url, license: "Official docs (link only)" });

// ───────────── AWS Solutions Architect (SAA-C03) ─────────────

export const SAA_ARCH: ArchItem[] = [
  {
    type: "architect",
    id: "arch-saa-web-ha",
    lesson: "d2-multiaz",
    title: "Web shop that survives losing an Availability Zone",
    requirements: ["Traffic doubles every evening and drops at night.", "Losing one Availability Zone must not take the shop down.", "Shoppers must stay signed in if the server behind them changes.", "Orders live in a relational (MySQL) database."],
    slots: [
      { id: "entry", label: "Front door for HTTP traffic" },
      { id: "compute", label: "Web servers" },
      { id: "db", label: "Order database" },
      { id: "session", label: "Session store" },
    ],
    tiles: [
      { id: "alb", label: "Application Load Balancer", why: "Spreads HTTP requests across healthy instances in several AZs and stops sending to unhealthy ones." },
      { id: "asg", label: "EC2 Auto Scaling group across 2+ AZs", why: "Adds instances in the evening, removes them at night, and replaces any lost with an AZ." },
      { id: "big-ec2", label: "One large EC2 instance", why: "A single instance lives in one AZ: one failure takes the whole shop down, and it can't shrink at night." },
      { id: "rds-maz", label: "RDS for MySQL, Multi-AZ", why: "Keeps a synchronous standby in another AZ and fails over automatically." },
      { id: "rds-single", label: "RDS for MySQL, single-AZ", why: "Cheaper, but an AZ outage leaves you with no database until you restore." },
      { id: "cache", label: "ElastiCache cluster", why: "Holds sessions outside the web servers, so any instance can serve any shopper." },
      { id: "local-disk", label: "Sessions on each instance's EBS volume", why: "Sessions vanish when Auto Scaling removes or replaces that instance, signing shoppers out." },
    ],
    solutions: [{ entry: "alb", compute: "asg", db: "rds-maz", session: "cache" }],
    sources: [src("Amazon RDS Multi-AZ deployments", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/Concepts.MultiAZ.html"), src("Amazon EC2 Auto Scaling", "https://docs.aws.amazon.com/autoscaling/ec2/userguide/what-is-amazon-ec2-auto-scaling.html")],
  },
  {
    type: "architect",
    id: "arch-saa-orders-queue",
    lesson: "d2-decoupling",
    title: "Order intake that never loses an order",
    requirements: ["Flash sales send 10× normal orders for a few minutes.", "Payment processing may lag behind, but no order can be lost.", "Each customer's orders must be processed in the order they were placed, exactly once.", "Nobody wants to manage servers for the workers."],
    slots: [
      { id: "buffer", label: "Buffer between web tier and workers" },
      { id: "worker", label: "Payment workers" },
      { id: "failed", label: "Where repeatedly failing orders go" },
    ],
    tiles: [
      { id: "sqs-fifo", label: "SQS FIFO queue (message group per customer)", why: "FIFO keeps order within a message group and removes duplicates, so each customer's orders run once, in order." },
      { id: "sqs-std", label: "SQS standard queue", why: "Scales hugely but gives at-least-once delivery and best-effort ordering, which breaks the ordering rule." },
      { id: "sns", label: "SNS topic", why: "Pushes to subscribers but doesn't hold messages while workers are busy, so it's not a buffer." },
      { id: "lambda", label: "Lambda function polling the queue", why: "Serverless and scales with queue depth, with no servers to manage." },
      { id: "ec2", label: "EC2 instances you patch yourself", why: "Works, but the brief says nobody wants to manage servers." },
      { id: "dlq", label: "Dead-letter queue", why: "Moves messages that fail too many times aside so they can be inspected instead of blocking or being lost." },
      { id: "delete", label: "Delete after 3 failures", why: "Deleting a failing order loses it, which the brief forbids." },
    ],
    solutions: [{ buffer: "sqs-fifo", worker: "lambda", failed: "dlq" }],
    sources: [src("Amazon SQS FIFO queues", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-fifo-queues.html"), src("Amazon SQS dead-letter queues", "https://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-dead-letter-queues.html")],
  },
  {
    type: "architect",
    id: "arch-saa-static-global",
    lesson: "d3-caching",
    title: "A fast, private-origin static site for a global audience",
    requirements: ["A marketing site of HTML, CSS and images.", "Visitors on every continent need low latency.", "The files must not be readable straight from storage, only through the CDN.", "HTTPS on the company's own domain."],
    slots: [
      { id: "origin", label: "Where the files live" },
      { id: "edge", label: "Delivery to visitors" },
      { id: "lock", label: "How storage stays private" },
      { id: "tls", label: "TLS certificate" },
    ],
    tiles: [
      { id: "s3", label: "S3 bucket", why: "Durable, cheap storage for static files, and a standard CloudFront origin." },
      { id: "ec2-web", label: "EC2 web server in one Availability Zone", why: "Works, but you'd run, patch and scale a server just to hand out static files." },
      { id: "cf", label: "CloudFront distribution", why: "Caches the files at edge locations near visitors, cutting latency worldwide." },
      { id: "oac", label: "Origin access control + bucket policy", why: "Only the CloudFront distribution can read the bucket; direct S3 URLs are denied." },
      { id: "public", label: "Make the bucket public with a bucket policy", why: "Anyone could bypass the CDN and read files straight from S3, against the brief." },
      { id: "acm", label: "AWS Certificate Manager certificate", why: "Free public certificates that CloudFront can use for your domain (issued in us-east-1 for CloudFront)." },
      { id: "kms", label: "KMS key", why: "KMS encrypts data at rest; it doesn't issue TLS certificates for HTTPS." },
    ],
    solutions: [{ origin: "s3", edge: "cf", lock: "oac", tls: "acm" }],
    sources: [src("Restricting access to an Amazon S3 origin (OAC)", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/private-content-restricting-access-to-s3.html"), src("Using alternate domain names and HTTPS", "https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/using-https-alternate-domain-names.html")],
  },
  {
    type: "architect",
    id: "arch-saa-read-heavy",
    lesson: "d3-databases",
    title: "A read-heavy catalog that has to stay on MySQL",
    requirements: ["95% of queries are reads of product pages.", "The team wants to keep SQL and MySQL compatibility.", "Popular product pages should come back in under a millisecond or two.", "Thousands of short-lived Lambda functions connect to the database."],
    slots: [
      { id: "db", label: "Database" },
      { id: "cache", label: "Hot-page cache" },
      { id: "conn", label: "Connection handling" },
    ],
    tiles: [
      { id: "aurora", label: "Aurora MySQL with read replicas", why: "MySQL-compatible, and up to 15 Aurora Replicas share the read load through the reader endpoint." },
      { id: "dynamo", label: "DynamoDB table", why: "Fast, but it's not SQL or MySQL, so the app would need rewriting." },
      { id: "redis", label: "ElastiCache (Redis OSS or Valkey)", why: "In-memory cache for hot product pages with sub-millisecond reads, in front of any database." },
      { id: "dax", label: "DynamoDB Accelerator (DAX)", why: "DAX only caches DynamoDB, so it can't sit in front of Aurora." },
      { id: "proxy", label: "RDS Proxy", why: "Pools and shares database connections, so bursts of Lambda functions don't exhaust them." },
      { id: "bigger", label: "A bigger instance class", why: "More memory helps a little but doesn't fix connection storms or spread reads." },
    ],
    solutions: [{ db: "aurora", cache: "redis", conn: "proxy" }],
    sources: [src("Amazon Aurora replicas", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/Aurora.Replication.html"), src("Amazon RDS Proxy", "https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/rds-proxy.html")],
  },
  {
    type: "architect",
    id: "arch-saa-clickstream",
    lesson: "d3-ingestion",
    title: "Clickstream into a data lake, with SQL on top",
    requirements: ["Websites send a steady stream of click events.", "Events must land in cheap storage without custom delivery code.", "Analysts run ad-hoc SQL a few times a week and want to pay per query.", "No clusters to size or keep running."],
    slots: [
      { id: "ingest", label: "Ingest and deliver" },
      { id: "store", label: "Data lake storage" },
      { id: "query", label: "Ad-hoc SQL" },
    ],
    tiles: [
      { id: "firehose", label: "Amazon Data Firehose", why: "Managed delivery of streaming data into S3 with batching, with no consumer code to write." },
      { id: "sqs", label: "SQS queue", why: "A queue for work items; you'd still write code to batch and write events to storage." },
      { id: "s3", label: "S3", why: "Low-cost, durable storage that is the usual base for a data lake." },
      { id: "efs", label: "EFS file system", why: "Shared file storage for servers; costlier and not what query engines read as a lake." },
      { id: "athena", label: "Athena", why: "Serverless SQL straight over files in S3, billed by data scanned per query." },
      { id: "redshift", label: "Provisioned Redshift cluster", why: "A strong warehouse, but a provisioned cluster is something to size and keep running." },
    ],
    solutions: [{ ingest: "firehose", store: "s3", query: "athena" }],
    sources: [src("What is Amazon Data Firehose?", "https://docs.aws.amazon.com/firehose/latest/dev/what-is-this-service.html"), src("What is Amazon Athena?", "https://docs.aws.amazon.com/athena/latest/ug/what-is.html")],
  },
  {
    type: "architect",
    id: "arch-saa-archive",
    lesson: "d4-s3-tiers",
    title: "Seven-year log archive at the lowest cost",
    requirements: ["Audit logs must be kept for 7 years.", "They're almost never read; a retrieval within 12 hours is fine.", "Logs are hot for the first 30 days.", "Nobody, not even an admin, may delete them early."],
    slots: [
      { id: "class", label: "Long-term storage class" },
      { id: "move", label: "How logs get there" },
      { id: "protect", label: "Protection from deletion" },
    ],
    tiles: [
      { id: "deep", label: "S3 Glacier Deep Archive", why: "The lowest-cost class; standard retrievals complete within 12 hours, which the brief allows." },
      { id: "standard", label: "S3 Standard", why: "Built for frequent access and priced for it; wasteful for 7 years of cold logs." },
      { id: "ebs-snap", label: "EBS snapshots", why: "Snapshots back up volumes; they aren't a log archive and cost more per GB." },
      { id: "lifecycle", label: "S3 Lifecycle rule after 30 days", why: "Moves objects to a colder class automatically once the hot period ends." },
      { id: "cron", label: "A nightly script on EC2", why: "Works, but it's a server and code to maintain for something Lifecycle does for free." },
      { id: "lock", label: "S3 Object Lock, compliance mode", why: "Write-once-read-many: no user, root included, can delete or shorten retention in compliance mode." },
      { id: "mfa", label: "IAM policy denying delete", why: "An admin can edit the policy, so it doesn't stop deletion by everyone." },
    ],
    solutions: [{ class: "deep", move: "lifecycle", protect: "lock" }],
    sources: [src("Amazon S3 storage classes", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html"), src("S3 Object Lock", "https://docs.aws.amazon.com/AmazonS3/latest/userguide/object-lock.html")],
  },
];

// ───────────── AWS Developer (DVA-C02 / DVA-C03) ─────────────

const dva = (secretsLesson: string): ArchItem[] => [
  {
    type: "architect",
    id: "arch-dva-api",
    lesson: "d2-cognito",
    title: "A serverless REST API with customer sign-in",
    requirements: ["Mobile app customers sign up and sign in with email.", "Only signed-in customers may call the API.", "Traffic is unpredictable and often zero at night.", "Data is looked up by customer id and order id."],
    slots: [
      { id: "front", label: "API front door" },
      { id: "auth", label: "Who checks the caller" },
      { id: "code", label: "Business logic" },
      { id: "data", label: "Data store" },
    ],
    tiles: [
      { id: "apigw", label: "API Gateway", why: "Managed HTTP endpoint with throttling and built-in authorizers." },
      { id: "cognito", label: "Cognito user pool authorizer", why: "The user pool handles sign-up and sign-in; API Gateway validates its tokens before your code runs." },
      { id: "iam-users", label: "An IAM user per customer", why: "IAM users are for your staff and workloads, not millions of app customers." },
      { id: "lambda", label: "Lambda functions", why: "Run per request and scale to zero when there's no traffic." },
      { id: "ec2", label: "Always-on EC2 instances behind a load balancer", why: "You pay at night when traffic is zero, and you manage the servers." },
      { id: "ddb", label: "DynamoDB (customer id + order id key)", why: "Partition key customer id and sort key order id fit the access pattern exactly." },
      { id: "redshift", label: "Redshift", why: "A warehouse for analytics, not low-latency lookups behind an API." },
    ],
    solutions: [{ front: "apigw", auth: "cognito", code: "lambda", data: "ddb" }],
    sources: [src("Control access to REST APIs with Cognito user pools", "https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html")],
  },
  {
    type: "architect",
    id: "arch-dva-fanout",
    lesson: "d1-messaging",
    title: "One order event, three independent consumers",
    requirements: ["When an order is placed, billing, shipping and email must each react.", "If shipping is down for an hour, it must catch up later without slowing the others.", "Messages that keep failing must be kept for inspection."],
    slots: [
      { id: "publish", label: "Where the order event is published" },
      { id: "buffer", label: "In front of each consumer" },
      { id: "failed", label: "Failing messages" },
    ],
    tiles: [
      { id: "sns", label: "SNS topic", why: "Fans one message out to every subscriber." },
      { id: "eb", label: "EventBridge event bus", why: "Routes the event by rules to several targets; also a valid fan-out." },
      { id: "one-queue", label: "One shared SQS queue", why: "Each message goes to one consumer only, so the three services would compete instead of all receiving it." },
      { id: "sqs-each", label: "An SQS queue per consumer", why: "Each service drains its own queue at its own pace; a down service just builds a backlog." },
      { id: "direct", label: "Direct HTTP calls", why: "If shipping is down, the call fails and the event is lost unless you add retries yourself." },
      { id: "dlq", label: "Dead-letter queue", why: "Collects messages that exceed the receive limit, for inspection and redrive." },
    ],
    solutions: [
      { publish: "sns", buffer: "sqs-each", failed: "dlq" },
      { publish: "eb", buffer: "sqs-each", failed: "dlq" },
    ],
    sources: [src("Fanout to Amazon SQS queues", "https://docs.aws.amazon.com/sns/latest/dg/sns-sqs-as-subscriber.html")],
  },
  {
    type: "architect",
    id: "arch-dva-canary",
    lesson: "d3-strategies",
    title: "Ship a Lambda change to 10% of traffic first",
    requirements: ["A new Lambda version should take 10% of traffic for 10 minutes before the rest.", "If errors spike, traffic must go back automatically.", "Clients must keep calling the same ARN."],
    slots: [
      { id: "target", label: "What clients call" },
      { id: "shift", label: "Traffic shifting" },
      { id: "rollback", label: "Automatic rollback trigger" },
    ],
    tiles: [
      { id: "alias", label: "A Lambda alias pointing at versions", why: "Clients call the alias ARN, which can split traffic between two versions." },
      { id: "latest", label: "$LATEST", why: "Always the newest code, so you can't split traffic or roll back by pointer." },
      { id: "canary", label: "CodeDeploy Canary10Percent10Minutes", why: "Sends 10% to the new version, then the rest after 10 minutes." },
      { id: "allatonce", label: "CodeDeploy AllAtOnce", why: "Moves 100% straight away, so there's no small first step." },
      { id: "alarm", label: "CloudWatch alarm on errors", why: "CodeDeploy rolls back when an attached alarm fires during the deployment." },
      { id: "email", label: "Email the on-call engineer", why: "A human has to notice and act, so the rollback isn't automatic." },
    ],
    solutions: [{ target: "alias", shift: "canary", rollback: "alarm" }],
    sources: [src("Deploying Lambda functions with CodeDeploy", "https://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations.html")],
  },
  {
    type: "architect",
    id: "arch-dva-secrets",
    lesson: secretsLesson,
    title: "Database password and app settings, done safely",
    requirements: ["The database password must rotate every 30 days with no code change.", "Plain feature flags and URLs should be cheap to store.", "Everything sensitive is encrypted with a key the team controls."],
    slots: [
      { id: "secret", label: "Database password" },
      { id: "config", label: "Non-secret settings" },
      { id: "key", label: "Encryption key" },
    ],
    tiles: [
      { id: "sm", label: "Secrets Manager with rotation", why: "Stores the secret and rotates it on a schedule using a rotation function." },
      { id: "env", label: "Plain Lambda environment variable", why: "Visible to anyone who can read the function config, and rotating means redeploying." },
      { id: "ps", label: "Systems Manager Parameter Store (standard)", why: "Free standard parameters suit plain settings like flags and URLs." },
      { id: "s3", label: "A JSON file in S3", why: "Works, but has no versioned parameter API or built-in rotation." },
      { id: "cmk", label: "KMS customer managed key", why: "A key you control (policy, rotation) that both services can use for encryption." },
      { id: "awskey", label: "Hard-coded AES key in the app", why: "Anyone with the code has the key, and rotating it means redeploying." },
    ],
    solutions: [{ secret: "sm", config: "ps", key: "cmk" }],
    sources: [src("Rotate AWS Secrets Manager secrets", "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html"), src("AWS Systems Manager Parameter Store", "https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html")],
  },
];

export const DVA_C02_ARCH = dva("d2-secrets");
export const DVA_C03_ARCH: ArchItem[] = [
  ...dva("d2-data"),
  {
    type: "architect",
    id: "arch-dva-bedrock",
    lesson: "d1-bedrock",
    title: "Summarise support tickets with a foundation model",
    requirements: ["A Lambda function summarises each new ticket with a foundation model.", "Customer emails and phone numbers must not appear in model output.", "No long-lived access keys anywhere."],
    slots: [
      { id: "model", label: "Model call" },
      { id: "guard", label: "PII protection" },
      { id: "creds", label: "Credentials" },
    ],
    tiles: [
      { id: "bedrock", label: "Amazon Bedrock Converse API", why: "Calls a hosted foundation model with one consistent API, no training needed." },
      { id: "train", label: "Train a model in SageMaker", why: "Training your own model is far more work than the brief needs." },
      { id: "guardrail", label: "Bedrock Guardrails with PII filters", why: "Detects and masks or blocks PII such as emails and phone numbers in inputs and outputs." },
      { id: "regex", label: "Ask the model nicely in the prompt", why: "A prompt instruction isn't a control; models can still leak PII." },
      { id: "role", label: "Lambda execution role", why: "Temporary credentials delivered automatically, scoped by an IAM policy." },
      { id: "keys", label: "Access keys in environment variables", why: "Long-lived keys that can leak, exactly what the brief rules out." },
    ],
    solutions: [{ model: "bedrock", guard: "guardrail", creds: "role" }],
    sources: [src("Amazon Bedrock Guardrails sensitive information filters", "https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails-sensitive-filters.html"), src("Lambda execution role", "https://docs.aws.amazon.com/lambda/latest/dg/lambda-intro-execution-role.html")],
  },
];

// ───────────── AWS AI Practitioner (AIF-C01) ─────────────

export const AIF_ARCH: ArchItem[] = [
  {
    type: "architect",
    id: "arch-aif-rag",
    lesson: "d3-rag",
    title: "An HR assistant that answers from company policy PDFs",
    requirements: ["Answers must come from the company's own policy documents.", "Policies change monthly; no model retraining.", "Off-topic or harmful requests must be refused."],
    slots: [
      { id: "model", label: "Model" },
      { id: "knowledge", label: "How it gets the policies" },
      { id: "safety", label: "Safety layer" },
    ],
    tiles: [
      { id: "fm", label: "A foundation model on Amazon Bedrock", why: "A ready-made model you call through an API, no training required." },
      { id: "scratch", label: "Train a model from scratch", why: "Huge cost and data needs, and still stale when policies change." },
      { id: "kb", label: "Bedrock Knowledge Bases (RAG)", why: "Retrieves the relevant policy passages at question time, so updates show up without retraining." },
      { id: "finetune", label: "Fine-tune monthly on the PDFs", why: "Costly every month, and fine-tuning teaches style more reliably than exact facts." },
      { id: "guardrails", label: "Amazon Bedrock Guardrails", why: "Denied topics and content filters block off-topic or harmful requests." },
      { id: "rekognition", label: "Amazon Rekognition", why: "An image and video analysis service; it doesn't filter chat." },
    ],
    solutions: [{ model: "fm", knowledge: "kb", safety: "guardrails" }],
    sources: [src("Amazon Bedrock Knowledge Bases", "https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html"), src("Amazon Bedrock Guardrails", "https://docs.aws.amazon.com/bedrock/latest/userguide/guardrails.html")],
  },
  {
    type: "architect",
    id: "arch-aif-docs",
    lesson: "d1-services",
    title: "Invoices in, summaries out in three languages",
    requirements: ["Scanned paper invoices arrive as images.", "Pull out vendor, total and line items.", "Send short notes to teams in Spanish and French."],
    slots: [
      { id: "extract", label: "Read the invoices" },
      { id: "translate", label: "Translate the notes" },
    ],
    tiles: [
      { id: "textract", label: "Amazon Textract", why: "Extracts text, forms and tables from scanned documents, including invoice fields." },
      { id: "comprehend", label: "Amazon Comprehend", why: "Finds entities and sentiment in text you already have; it doesn't read images." },
      { id: "translate", label: "Amazon Translate", why: "Neural machine translation between languages." },
      { id: "polly", label: "Amazon Polly", why: "Turns text into speech; it doesn't translate." },
      { id: "rekognition", label: "Amazon Rekognition", why: "Labels objects and faces in images; not built for invoice fields." },
    ],
    solutions: [{ extract: "textract", translate: "translate" }],
    sources: [src("What is Amazon Textract?", "https://docs.aws.amazon.com/textract/latest/dg/what-is.html"), src("What is Amazon Translate?", "https://docs.aws.amazon.com/translate/latest/dg/what-is.html")],
  },
  {
    type: "architect",
    id: "arch-aif-callcentre",
    lesson: "d1-services",
    title: "Call-centre insights, plus spoken answers",
    requirements: ["Recorded calls need written transcripts.", "Managers want to know which calls were negative.", "The phone menu should read answers aloud in a natural voice."],
    slots: [
      { id: "stt", label: "Calls to text" },
      { id: "mood", label: "Negative or positive?" },
      { id: "tts", label: "Read answers aloud" },
    ],
    tiles: [
      { id: "transcribe", label: "Amazon Transcribe", why: "Speech to text for recorded audio." },
      { id: "comprehend", label: "Amazon Comprehend", why: "Detects sentiment (positive, negative, neutral, mixed) in text." },
      { id: "polly", label: "Amazon Polly", why: "Text to lifelike speech." },
      { id: "lex", label: "Amazon Lex", why: "Builds the conversational bot; it isn't the sentiment or transcript tool here." },
      { id: "textract", label: "Amazon Textract", why: "Reads documents, not audio." },
    ],
    solutions: [{ stt: "transcribe", mood: "comprehend", tts: "polly" }],
    sources: [src("What is Amazon Transcribe?", "https://docs.aws.amazon.com/transcribe/latest/dg/what-is.html"), src("Amazon Comprehend sentiment", "https://docs.aws.amazon.com/comprehend/latest/dg/how-sentiment.html")],
  },
  {
    type: "architect",
    id: "arch-aif-churn",
    lesson: "d1-inference",
    title: "Nightly churn scores with no ML team",
    requirements: ["Analysts (no coders) want to predict which customers will cancel.", "Every customer gets a score once a night; nobody needs a live answer.", "Data sits in a CSV in S3."],
    slots: [
      { id: "build", label: "Build the model" },
      { id: "run", label: "Run predictions" },
    ],
    tiles: [
      { id: "canvas", label: "SageMaker Canvas", why: "No-code, point-and-click model building for analysts." },
      { id: "notebook", label: "Hand-written training code in a notebook", why: "Needs coders, which the team doesn't have." },
      { id: "batch", label: "Batch inference (batch transform)", why: "Scores a whole dataset on a schedule with no always-on endpoint." },
      { id: "realtime", label: "Real-time endpoint", why: "Always-on and billed by the hour, built for live single requests nobody needs here." },
      { id: "bedrock", label: "Ask a chat model to guess", why: "A text model isn't trained on your customers and gives no reliable score." },
    ],
    solutions: [{ build: "canvas", run: "batch" }],
    sources: [src("Amazon SageMaker Canvas", "https://docs.aws.amazon.com/sagemaker/latest/dg/canvas.html"), src("Batch transform for inference", "https://docs.aws.amazon.com/sagemaker/latest/dg/batch-transform.html")],
  },
];

// ───────────── AWS Cloud Practitioner (CLF-C02) ─────────────

export const CLF_ARCH: ArchItem[] = [
  {
    type: "architect",
    id: "arch-clf-photos",
    lesson: "d3-compute",
    title: "A photo-sharing app from AWS building blocks",
    requirements: ["Users upload photos.", "Code makes a thumbnail only when a photo arrives.", "Orders for prints go in a relational database with managed backups.", "Photos load fast worldwide."],
    slots: [
      { id: "files", label: "Photo storage" },
      { id: "code", label: "Thumbnail code" },
      { id: "db", label: "Print orders" },
      { id: "cdn", label: "Fast delivery" },
    ],
    tiles: [
      { id: "s3", label: "Amazon S3", why: "Object storage for files of any size, built for this." },
      { id: "lambda", label: "AWS Lambda", why: "Runs code in response to an event, like a new upload, and you pay only while it runs." },
      { id: "ec2", label: "An EC2 instance running all day", why: "Works, but you pay while it waits for uploads." },
      { id: "rds", label: "Amazon RDS", why: "Managed relational database with automated backups." },
      { id: "dynamodb", label: "Amazon DynamoDB", why: "Managed NoSQL, not relational; the brief asks for relational." },
      { id: "cloudfront", label: "Amazon CloudFront", why: "CDN that caches content at edge locations near users." },
      { id: "route53", label: "Amazon Route 53", why: "DNS points names at your app; it doesn't cache photos." },
    ],
    solutions: [{ files: "s3", code: "lambda", db: "rds", cdn: "cloudfront" }],
    sources: [src("Overview of Amazon Web Services", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html")],
  },
  {
    type: "architect",
    id: "arch-clf-security",
    lesson: "d2-services",
    title: "A security baseline for a new account",
    requirements: ["Know who did what through the console, CLI and API.", "Get alerted to suspicious activity like crypto-mining.", "Spot resources that drift from company rules.", "Protect the root user."],
    slots: [
      { id: "audit", label: "Record API activity" },
      { id: "threat", label: "Detect threats" },
      { id: "config", label: "Track configuration rules" },
      { id: "root", label: "Root user" },
    ],
    tiles: [
      { id: "cloudtrail", label: "AWS CloudTrail", why: "Records API calls: who, what, when, from where." },
      { id: "guardduty", label: "Amazon GuardDuty", why: "Managed threat detection over logs, including crypto-mining findings." },
      { id: "config", label: "AWS Config", why: "Records resource configuration and evaluates it against rules." },
      { id: "mfa", label: "MFA on root, no root access keys", why: "Best practice: strong sign-in and no long-lived root keys." },
      { id: "inspector", label: "Amazon Inspector", why: "Scans workloads for software vulnerabilities; not account activity." },
      { id: "share-root", label: "Share the root password with admins", why: "Removes accountability and is against best practice." },
    ],
    solutions: [{ audit: "cloudtrail", threat: "guardduty", config: "config", root: "mfa" }],
    sources: [src("AWS security services", "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/security-services.html")],
  },
  {
    type: "architect",
    id: "arch-clf-costs",
    lesson: "d4-tools",
    title: "Keeping the monthly bill under control",
    requirements: ["Email the finance lead if spend is heading over $2,000 this month.", "See how spend changed over the last 6 months.", "Split the bill by team.", "Estimate a new project's cost before building it."],
    slots: [
      { id: "alert", label: "Over-budget alert" },
      { id: "trend", label: "Spend history" },
      { id: "split", label: "Cost by team" },
      { id: "estimate", label: "Estimate first" },
    ],
    tiles: [
      { id: "budgets", label: "AWS Budgets", why: "Alerts on actual or forecasted spend against a budget you set." },
      { id: "explorer", label: "AWS Cost Explorer", why: "Charts and filters past spend over time." },
      { id: "tags", label: "Cost allocation tags", why: "Tag resources by team, then group costs by tag." },
      { id: "calculator", label: "AWS Pricing Calculator", why: "Estimates cost for an architecture before you build it." },
      { id: "trusted", label: "AWS Trusted Advisor", why: "Suggests savings and fixes, but it doesn't send budget alerts or split bills." },
    ],
    solutions: [{ alert: "budgets", trend: "explorer", split: "tags", estimate: "calculator" }],
    sources: [src("AWS Cost Management", "https://docs.aws.amazon.com/cost-management/latest/userguide/what-is-costmanagement.html")],
  },
  {
    type: "architect",
    id: "arch-clf-hybrid",
    lesson: "d3-network",
    title: "Connecting an office data center to AWS",
    requirements: ["A steady, private connection that doesn't use the public internet.", "A backup encrypted tunnel that can be set up today.", "Move 80 TB of archives where the network is slow."],
    slots: [
      { id: "primary", label: "Main private link" },
      { id: "backup", label: "Backup tunnel" },
      { id: "bulk", label: "Bulk data move" },
    ],
    tiles: [
      { id: "dx", label: "AWS Direct Connect", why: "Dedicated private connection from your site to AWS, off the public internet." },
      { id: "vpn", label: "AWS Site-to-Site VPN", why: "Encrypted tunnel over the internet, quick to set up." },
      { id: "snow", label: "AWS Snowball Edge", why: "A shipped device for moving terabytes when the network is slow." },
      { id: "cloudfront", label: "Amazon CloudFront", why: "Delivers content to users; it doesn't link your data center to a VPC." },
      { id: "igw", label: "Internet gateway", why: "Lets a VPC reach the internet; it isn't a private link to your office." },
    ],
    solutions: [{ primary: "dx", backup: "vpn", bulk: "snow" }],
    sources: [src("AWS Direct Connect", "https://docs.aws.amazon.com/directconnect/latest/UserGuide/Welcome.html"), src("AWS Snowball Edge", "https://docs.aws.amazon.com/snowball/latest/developer-guide/whatisedge.html")],
  },
];

// ───────────── Microsoft Azure AI Fundamentals (AI-901) ─────────────

const MS = (label: string, url: string) => src(label, url);

export const AZURE_ARCH: ArchItem[] = [
  {
    type: "architect",
    id: "arch-az-agent",
    lesson: "d2-agents",
    title: "A help-desk agent that looks up tickets",
    requirements: ["Staff ask questions in plain language.", "The assistant can look up ticket status through an existing API.", "It must stay on topic and follow the help-desk tone."],
    slots: [
      { id: "model", label: "Model" },
      { id: "build", label: "Where the agent is built" },
      { id: "tool", label: "How it checks tickets" },
      { id: "steer", label: "How it stays on topic" },
    ],
    tiles: [
      { id: "gpt", label: "A chat model deployed from Foundry Models", why: "A generative chat model understands plain-language questions." },
      { id: "vision", label: "Azure Vision", why: "Analyses images; not the brain of a chat agent." },
      { id: "agent-svc", label: "Foundry Agent Service", why: "Builds and hosts agents that combine a model, instructions and tools." },
      { id: "api-tool", label: "A tool that calls the ticket API", why: "Tools let the agent fetch live data instead of guessing." },
      { id: "train", label: "Retrain the model on old tickets", why: "Old tickets go stale; live status needs a tool call." },
      { id: "system", label: "Agent instructions (system prompt)", why: "Sets the role, tone and boundaries for every reply." },
    ],
    solutions: [{ model: "gpt", build: "agent-svc", tool: "api-tool", steer: "system" }],
    sources: [MS("What is Foundry Agent Service?", "https://learn.microsoft.com/en-us/azure/ai-foundry/agents/overview")],
  },
  {
    type: "architect",
    id: "arch-az-voice",
    lesson: "d2-speech",
    title: "A voice line that understands callers",
    requirements: ["Turn callers' speech into text.", "Detect whether a caller is upset.", "Reply in a natural voice."],
    slots: [
      { id: "listen", label: "Speech to text" },
      { id: "mood", label: "Sentiment" },
      { id: "speak", label: "Text to speech" },
    ],
    tiles: [
      { id: "stt", label: "Azure Speech: speech to text", why: "Transcribes spoken audio into text." },
      { id: "lang", label: "Azure Language: sentiment analysis", why: "Scores text as positive, negative, neutral or mixed." },
      { id: "tts", label: "Azure Speech: text to speech (neural voices)", why: "Synthesises natural-sounding speech." },
      { id: "translator", label: "Azure Translator: translate each call transcript", why: "Translates text; doesn't detect mood or speak." },
      { id: "cu", label: "Content Understanding: extract fields from scanned forms", why: "Extracts fields from documents and media; not the live voice loop." },
    ],
    solutions: [{ listen: "stt", mood: "lang", speak: "tts" }],
    sources: [MS("What is the Speech service?", "https://learn.microsoft.com/en-us/azure/ai-services/speech-service/overview"), MS("Sentiment analysis in Azure Language", "https://learn.microsoft.com/en-us/azure/ai-services/language-service/sentiment-opinion-mining/overview")],
  },
  {
    type: "architect",
    id: "arch-az-forms",
    lesson: "d2-extract",
    title: "Claims forms into structured data",
    requirements: ["Insurance claims arrive as PDFs and phone photos.", "Pull out policy number, date and amount as fields.", "Flag claims written in an angry tone for a supervisor."],
    slots: [
      { id: "fields", label: "Extract fields" },
      { id: "tone", label: "Flag angry claims" },
    ],
    tiles: [
      { id: "cu", label: "Content Understanding analyzer", why: "Turns documents and images into the structured fields you define." },
      { id: "lang", label: "Azure Language sentiment", why: "Spots negative sentiment in the extracted text." },
      { id: "speech", label: "Azure Speech", why: "For audio, not PDFs or photos." },
      { id: "chat", label: "Paste each claim into a chat playground", why: "Manual and unrepeatable; no fixed schema." },
    ],
    solutions: [{ fields: "cu", tone: "lang" }],
    sources: [MS("What is Content Understanding?", "https://learn.microsoft.com/en-us/azure/ai-services/content-understanding/overview")],
  },
  {
    type: "architect",
    id: "arch-az-text",
    lesson: "d2-text",
    title: "Product reviews dashboard",
    requirements: ["Thousands of reviews arrive daily in several languages.", "Find the main topics people mention.", "Remove personal details before storing."],
    slots: [
      { id: "lang", label: "Which language is this?" },
      { id: "topics", label: "Main topics" },
      { id: "pii", label: "Remove personal details" },
    ],
    tiles: [
      { id: "detect", label: "Azure Language: language detection", why: "Identifies the language of each review." },
      { id: "keyphrases", label: "Azure Language: key phrase extraction", why: "Pulls out the main talking points." },
      { id: "pii", label: "Azure Language: PII detection", why: "Finds and redacts personal information like names and phone numbers." },
      { id: "ocr", label: "Azure Vision OCR", why: "Reads text in images; these reviews are already text." },
      { id: "tts", label: "Azure Speech text to speech", why: "Reads text aloud; no analysis." },
    ],
    solutions: [{ lang: "detect", topics: "keyphrases", pii: "pii" }],
    sources: [MS("What is Azure Language?", "https://learn.microsoft.com/en-us/azure/ai-services/language-service/overview")],
  },
];

// ───────────── Google Cloud Generative AI Leader ─────────────

const G = (label: string, url: string) => src(label, url);

export const GCP_ARCH: ArchItem[] = [
  {
    type: "architect",
    id: "arch-gcp-grounding",
    lesson: "d3-grounding",
    title: "A support assistant with fresh, sourced answers",
    requirements: ["Answer from the company's product manuals.", "Also answer questions about today's public news on the product.", "Cite where answers came from."],
    slots: [
      { id: "private", label: "Company manuals" },
      { id: "public", label: "Fresh public facts" },
    ],
    tiles: [
      { id: "agent-search", label: "Prebuilt RAG with Agent Search", why: "Ready-made search and retrieval over your own data, with citations." },
      { id: "gsearch", label: "Grounding with Google Search", why: "Connects the model to fresh, public web information." },
      { id: "finetune", label: "Fine-tune on the manuals", why: "Bakes in a snapshot; it doesn't cite sources or stay current." },
      { id: "temp", label: "Lower the temperature", why: "Makes answers more predictable, but adds no new facts." },
    ],
    solutions: [{ private: "agent-search", public: "gsearch" }],
    sources: [G("Grounding overview", "https://cloud.google.com/vertex-ai/generative-ai/docs/grounding/overview")],
  },
  {
    type: "architect",
    id: "arch-gcp-agent",
    lesson: "d2-agents",
    title: "An agent that books store appointments",
    requirements: ["Customers chat to book a slot.", "It must check real availability in the booking system.", "It decides on its own which step is next."],
    slots: [
      { id: "brain", label: "Reasoning" },
      { id: "act", label: "Checking and booking" },
    ],
    tiles: [
      { id: "gemini", label: "A Gemini model", why: "Plans the steps and understands the customer." },
      { id: "tools", label: "Tools (function calls / extensions) to the booking API", why: "Let the agent read and change real data outside the model." },
      { id: "prompt-only", label: "A longer prompt that lists every free booking slot", why: "Goes stale the moment a slot is taken." },
      { id: "imagen", label: "Imagen", why: "Makes images, not decisions or bookings." },
    ],
    solutions: [{ brain: "gemini", act: "tools" }],
    sources: [G("Function calling", "https://cloud.google.com/vertex-ai/generative-ai/docs/multimodal/function-calling")],
  },
  {
    type: "architect",
    id: "arch-gcp-media",
    lesson: "d1-models",
    title: "A campaign kit from text prompts",
    requirements: ["Draft ad copy.", "Make still product images.", "Make a short video clip."],
    slots: [
      { id: "copy", label: "Ad copy" },
      { id: "image", label: "Images" },
      { id: "video", label: "Video" },
    ],
    tiles: [
      { id: "gemini", label: "Gemini", why: "Multimodal model that writes text." },
      { id: "imagen", label: "Imagen", why: "Text-to-image diffusion model." },
      { id: "veo", label: "Veo", why: "Makes video from text or a still image." },
      { id: "chirp", label: "Chirp", why: "A speech model; no images or video." },
    ],
    solutions: [{ copy: "gemini", image: "imagen", video: "veo" }],
    sources: [G("Google models on Vertex AI", "https://cloud.google.com/vertex-ai/generative-ai/docs/models")],
  },
  {
    type: "architect",
    id: "arch-gcp-choose",
    lesson: "d2-platform",
    title: "Mixing models without lock-in",
    requirements: ["Compare Google, third-party and open models side by side.", "Keep the option to switch providers later.", "Build, deploy and monitor in one managed platform."],
    slots: [
      { id: "catalog", label: "Pick models from" },
      { id: "platform", label: "Build and run on" },
    ],
    tiles: [
      { id: "garden", label: "Model Garden", why: "Lists Google, third-party and open-source models side by side." },
      { id: "platform", label: "Agent Platform", why: "Google Cloud's managed platform to build, deploy and monitor AI." },
      { id: "notebook", label: "Gemini Notebook", why: "A research tool for your own sources, not a model catalog." },
      { id: "laptop", label: "Self-host one open model on a laptop", why: "No managed deployment or monitoring, and one model only." },
    ],
    solutions: [{ catalog: "garden", platform: "platform" }],
    sources: [G("Model Garden overview", "https://cloud.google.com/vertex-ai/generative-ai/docs/model-garden/explore-models")],
  },
];

// ───────────── CNCF KCNA ─────────────

const K = (label: string, url: string) => src(label, url);

export const KCNA_ARCH: ArchItem[] = [
  {
    type: "architect",
    id: "arch-k8s-web",
    lesson: "d2-services",
    title: "A stateless web app inside the cluster",
    requirements: ["Run 3 identical copies, replaced automatically if one dies.", "Give them one stable in-cluster address.", "Route example.com/shop from outside to them over HTTP."],
    slots: [
      { id: "workload", label: "Workload" },
      { id: "address", label: "Stable address" },
      { id: "edge", label: "HTTP routing from outside" },
    ],
    tiles: [
      { id: "deploy", label: "Deployment (replicas: 3)", why: "Keeps 3 Pods running and rolls out updates." },
      { id: "pod", label: "A bare Pod", why: "Nothing recreates it if it dies." },
      { id: "svc", label: "ClusterIP Service", why: "One stable virtual IP and DNS name in front of matching Pods." },
      { id: "ingress", label: "Ingress (or Gateway API HTTPRoute)", why: "Routes external HTTP by host and path to Services." },
      { id: "hostpath", label: "hostPort on one node (exposes the Pod's port)", why: "Ties traffic to one node and breaks when Pods move." },
      { id: "daemonset", label: "DaemonSet", why: "One Pod per node, not a set replica count." },
    ],
    solutions: [{ workload: "deploy", address: "svc", edge: "ingress" }],
    sources: [K("Kubernetes Services", "https://kubernetes.io/docs/concepts/services-networking/service/"), K("Ingress", "https://kubernetes.io/docs/concepts/services-networking/ingress/")],
  },
  {
    type: "architect",
    id: "arch-k8s-db",
    lesson: "d2-storage",
    title: "A database that keeps its data and identity",
    requirements: ["3 database replicas, each with a stable name (db-0, db-1, db-2).", "Each keeps its own disk across restarts.", "Disks are created on demand from the cloud provider."],
    slots: [
      { id: "workload", label: "Workload" },
      { id: "disk", label: "Per-replica storage" },
      { id: "provision", label: "How disks are created" },
    ],
    tiles: [
      { id: "sts", label: "StatefulSet", why: "Stable names and ordered start-up for each replica." },
      { id: "deploy", label: "Deployment", why: "Pods are interchangeable with random names." },
      { id: "pvc", label: "volumeClaimTemplates (a PVC per replica)", why: "Each replica gets its own PersistentVolumeClaim that survives restarts." },
      { id: "emptydir", label: "emptyDir", why: "Deleted when the Pod is removed." },
      { id: "sc", label: "StorageClass (dynamic provisioning)", why: "Creates a PersistentVolume automatically when a claim asks for one." },
      { id: "manual", label: "An admin pre-creates every volume", why: "Static provisioning works, but isn't on demand." },
    ],
    solutions: [{ workload: "sts", disk: "pvc", provision: "sc" }],
    sources: [K("StatefulSets", "https://kubernetes.io/docs/concepts/workloads/controllers/statefulset/"), K("Storage classes", "https://kubernetes.io/docs/concepts/storage/storage-classes/")],
  },
  {
    type: "architect",
    id: "arch-k8s-scale",
    lesson: "d4-autoscaling",
    title: "Scale with load, then scale the cluster",
    requirements: ["Add Pods when CPU stays high.", "Add nodes when Pods can't be scheduled.", "Pods must declare the CPU they need."],
    slots: [
      { id: "pods", label: "Scale Pods" },
      { id: "nodes", label: "Scale nodes" },
      { id: "requests", label: "What makes CPU % meaningful" },
    ],
    tiles: [
      { id: "hpa", label: "HorizontalPodAutoscaler", why: "Changes replica count from metrics like CPU utilisation." },
      { id: "vpa", label: "VerticalPodAutoscaler", why: "Changes each Pod's requests, not how many Pods run." },
      { id: "ca", label: "Cluster Autoscaler", why: "Adds nodes when Pods are pending for lack of room, removes idle ones." },
      { id: "requests", label: "CPU requests on containers", why: "HPA measures utilisation as a share of the request." },
      { id: "limits-only", label: "No requests, just more nodes", why: "Without requests the HPA can't compute CPU utilisation." },
    ],
    solutions: [{ pods: "hpa", nodes: "ca", requests: "requests" }],
    sources: [K("Horizontal Pod Autoscaling", "https://kubernetes.io/docs/tasks/run-application/horizontal-pod-autoscale/"), K("Node autoscaling", "https://kubernetes.io/docs/concepts/cluster-administration/node-autoscaling/")],
  },
  {
    type: "architect",
    id: "arch-k8s-config",
    lesson: "d1-config",
    title: "Config and secrets for one app, per team",
    requirements: ["Separate team A's objects from team B's.", "Inject a feature-flag file into the app.", "Inject a database password without baking it into the image."],
    slots: [
      { id: "scope", label: "Separate the teams" },
      { id: "flags", label: "Feature flags" },
      { id: "password", label: "Password" },
    ],
    tiles: [
      { id: "ns", label: "Namespaces", why: "Scope names, quotas and RBAC per team." },
      { id: "cm", label: "ConfigMap", why: "Non-secret config as env vars or files." },
      { id: "secret", label: "Secret", why: "Holds sensitive values separate from the image; enable encryption at rest for real protection." },
      { id: "image", label: "Bake into the image", why: "Every copy of the image now holds the password." },
      { id: "labels", label: "Labels alone", why: "Labels group objects but don't isolate access." },
    ],
    solutions: [{ scope: "ns", flags: "cm", password: "secret" }],
    sources: [K("ConfigMaps", "https://kubernetes.io/docs/concepts/configuration/configmap/"), K("Secrets", "https://kubernetes.io/docs/concepts/configuration/secret/")],
  },
];

// ───────────── System Design ─────────────

export const SD_ARCH: ArchItem[] = [
  {
    type: "architect",
    id: "arch-sd-shortener",
    lesson: "d4-shortener",
    title: "A URL shortener with 100:1 reads to writes",
    requirements: ["Redirects must be fast; reads outnumber writes 100 to 1.", "Each short code maps to exactly one long URL.", "Billions of links over time."],
    slots: [
      { id: "ids", label: "Short code generation" },
      { id: "store", label: "Main store" },
      { id: "hot", label: "Hot redirects" },
    ],
    tiles: [
      { id: "counter-b62", label: "Unique ID → base62", why: "Collision-free and short; ranges can be handed to servers in blocks." },
      { id: "random-nocheck", label: "Random 4 characters, no check", why: "Only ~15 million codes and collisions overwrite links." },
      { id: "kv", label: "Key-value store, sharded by code", why: "Lookups are by key; sharding by code spreads billions of rows." },
      { id: "single-sql", label: "One SQL server with joins", why: "No joins are needed and one server limits growth." },
      { id: "cache", label: "Cache in front (e.g. Redis)", why: "Popular links come from memory, absorbing the read load." },
      { id: "no-cache", label: "Read the store every time", why: "Works, but wastes the store on repeat hot reads." },
    ],
    solutions: [{ ids: "counter-b62", store: "kv", hot: "cache" }],
  },
  {
    type: "architect",
    id: "arch-sd-uploads",
    lesson: "d3-queues",
    title: "Video uploads that get transcoded",
    requirements: ["Uploads must return quickly.", "Transcoding takes minutes and can fail.", "Several workers share the transcoding work."],
    slots: [
      { id: "upload", label: "Upload path" },
      { id: "handoff", label: "Hand-off to workers" },
      { id: "retry", label: "Failures" },
    ],
    tiles: [
      { id: "blob", label: "Upload straight to object storage", why: "Big files skip your app servers." },
      { id: "app-disk", label: "Upload to the app server's disk", why: "Ties files to one server and fills its disk." },
      { id: "queue", label: "Job queue (one message per video)", why: "Workers pull jobs at their own pace; uploads return immediately." },
      { id: "sync", label: "Transcode inside the upload request", why: "The request blocks for minutes and times out." },
      { id: "dlq", label: "Retry with backoff, then dead-letter", why: "Transient errors retry; poison jobs are parked for review." },
      { id: "drop", label: "Log the error and move on", why: "The user's video is silently never processed." },
    ],
    solutions: [{ upload: "blob", handoff: "queue", retry: "dlq" }],
  },
  {
    type: "architect",
    id: "arch-sd-payments",
    lesson: "d3-idempotency",
    title: "Charging cards without double charges",
    requirements: ["Mobile clients retry when the network drops.", "A charge must never happen twice.", "An 'order paid' event must be published reliably after the DB write."],
    slots: [
      { id: "dedupe", label: "Safe retries" },
      { id: "event", label: "Reliable event publishing" },
    ],
    tiles: [
      { id: "idem", label: "Idempotency key per request", why: "The server stores the key and returns the first result for repeats." },
      { id: "no-retry", label: "Tell clients never to retry", why: "Lost responses then become lost payments." },
      { id: "outbox", label: "Transactional outbox", why: "Write the event in the same DB transaction, then relay it." },
      { id: "dual", label: "Write DB, then publish in the same handler", why: "A crash between the two loses the event." },
    ],
    solutions: [{ dedupe: "idem", event: "outbox" }],
  },
  {
    type: "architect",
    id: "arch-sd-global-read",
    lesson: "d1-cache",
    title: "A news site for a global audience",
    requirements: ["Articles change rarely once published.", "Readers worldwide expect fast pages.", "Traffic spikes 20× on breaking news."],
    slots: [
      { id: "edge", label: "Close to readers" },
      { id: "spread", label: "Spread load on origin servers" },
      { id: "scale", label: "Handle spikes" },
    ],
    tiles: [
      { id: "cdn", label: "CDN caching article pages", why: "Serves cached copies from edges near readers." },
      { id: "lb", label: "Load balancer with health checks", why: "Spreads requests and skips failed servers." },
      { id: "scale-out", label: "Auto scale out stateless servers", why: "Adds identical servers during spikes." },
      { id: "scale-up", label: "Buy one bigger server", why: "Has a ceiling and stays a single point of failure." },
      { id: "dns-only", label: "Round-robin DNS only", why: "Clients cache DNS and keep hitting dead servers." },
    ],
    solutions: [{ edge: "cdn", spread: "lb", scale: "scale-out" }],
  },
  {
    type: "architect",
    id: "arch-sd-feed",
    lesson: "d4-feed-chat",
    title: "Home feed for a social app",
    requirements: ["Most users follow a few hundred accounts.", "A few celebrities have millions of followers.", "Feeds must load fast."],
    slots: [
      { id: "normal", label: "Posts from normal accounts" },
      { id: "celeb", label: "Posts from celebrities" },
    ],
    tiles: [
      { id: "push", label: "Fan-out on write (push to follower feeds)", why: "Precomputed feeds make reads fast for normal accounts." },
      { id: "pull", label: "Fan-out on read (merge at read time)", why: "Avoids writing millions of copies for one celebrity post." },
      { id: "email", label: "Email every follower a digest of each new post", why: "Not a feed." },
    ],
    solutions: [{ normal: "push", celeb: "pull" }],
  },
  {
    type: "architect",
    id: "arch-sd-shard",
    lesson: "d2-sharding",
    title: "Splitting a user table across many servers",
    requirements: ["One database no longer fits the user table.", "Servers will be added over time.", "Moving data on each addition should be minimal."],
    slots: [
      { id: "key", label: "Shard key" },
      { id: "place", label: "Placing keys on servers" },
    ],
    tiles: [
      { id: "userid", label: "user_id", why: "High-cardinality and used by most queries." },
      { id: "country", label: "country", why: "A few countries create hot shards." },
      { id: "ch", label: "Consistent hashing", why: "Adding a server moves only about 1/N of keys." },
      { id: "mod", label: "hash(key) mod N", why: "Changing N remaps most keys." },
    ],
    solutions: [{ key: "userid", place: "ch" }],
  },
];
