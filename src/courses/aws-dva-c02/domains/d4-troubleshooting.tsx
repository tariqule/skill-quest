import { Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { TraceWaterfall } from "../visuals";

/**
 * Domain 4: Troubleshooting and Optimization (18%).
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d4",
    number: 4,
    name: "Troubleshooting and Optimization",
    world: "The Observatory",
    weight: 18,
    emoji: "🔭",
    color: "#a78bfa",
    summary: "CloudWatch logs and metrics, X-Ray tracing, root cause analysis, Lambda concurrency, and caching and messaging optimizations.",
  },

  tasks: [
    {
      id: "4.1",
      title: "Assist in a root cause analysis",
      covers: [
        "Debug code to identify defects",
        "Interpret application metrics, logs, and traces; query logs",
        "Custom metrics, for example CloudWatch embedded metric format (EMF)",
        "Review application health with dashboards and insights",
        "Troubleshoot deployment failures with service output logs",
        "Debug service integration issues",
      ],
    },
    {
      id: "4.2",
      title: "Instrument code for observability",
      covers: [
        "Logging vs monitoring vs observability",
        "Effective and structured logging strategies",
        "Emit custom metrics; add annotations for tracing; implement tracing",
        "Notification alerts for specific actions (quota limits, deployment completions)",
        "Health checks and readiness probes",
      ],
    },
    {
      id: "4.3",
      title: "Optimize applications by using AWS services and features",
      covers: [
        "Concurrency",
        "Profile performance; determine minimum memory and compute",
        "Subscription filter policies for messaging",
        "Cache content based on request headers; application-level caching",
        "Optimize resource usage; analyze performance issues and bottlenecks from logs",
      ],
    },
  ],

  lessons: [
    {
      id: "d4-logs-metrics",
      task: "4.1 · 4.2",
      title: "CloudWatch logs, metrics, and alarms",
      check: ["d4-01", "d4-03"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "📝", title: "Logging", text: "Record discrete events with context: what happened, to whom, with which request ID.", color: "#a78bfa" },
              { icon: "📈", title: "Monitoring", text: "Watch known metrics and alarm when they cross a threshold.", color: "#a78bfa" },
              { icon: "🔭", title: "Observability", text: "Combine logs, metrics, and traces to answer questions you didn't plan for.", color: "#a78bfa" },
            ]}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "🧾", label: "Structured JSON logs", sub: "level, requestId, userId, latencyMs" },
              { icon: "🔎", label: "Logs Insights", sub: "fields · filter · stats · sort" },
              { icon: "📏", label: "Metric filter / EMF", sub: "Turn log data into metrics" },
              { icon: "🚨", label: "Alarm → SNS", sub: "Notify or act" },
            ]}
          />
        </div>
      ),
      points: [
        "Embedded metric format (EMF) writes metrics inside structured log lines; CloudWatch extracts them asynchronously, with no PutMetricData calls in the request path.",
        "Standard metrics have 1-minute resolution; high-resolution custom metrics go down to 1 second.",
        "EC2 doesn't publish memory or disk-space metrics by default: install the CloudWatch agent.",
        "Log group retention defaults to never expire. Set a retention period to control cost.",
      ],
      tip: "\"Custom metric from Lambda without slowing requests\" → EMF. \"Count ERROR lines and alarm\" → metric filter.",
    },
    {
      id: "d4-xray",
      task: "4.2",
      title: "Tracing with AWS X-Ray",
      check: ["d4-08", "d4-10"],
      visual: <TraceWaterfall />,
      points: [
        "A trace is made of segments (one per service) and subsegments (downstream calls). The service map shows latency and errors between components.",
        "Annotations are indexed key-value pairs used in filter expressions; metadata is stored but not searchable.",
        "Lambda: turn on active tracing and allow xray:PutTraceSegments and xray:PutTelemetryRecords in the role. EC2 and ECS: run the X-Ray daemon or an ADOT collector (UDP 2000).",
        "Sampling rules control how many requests are traced, keeping cost down at high volume.",
      ],
      tip: "\"Search traces by customer ID\" → annotation. \"Attach a debug payload\" → metadata.",
    },
    {
      id: "d4-rca",
      task: "4.1 · 4.2",
      title: "Root cause analysis and alerting",
      check: ["d4-13", "d4-14"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧱", title: "502 Bad Gateway", text: "Lambda proxy returned a malformed response (missing statusCode or a non-string body).", color: "#f87171" },
              { icon: "⌛", title: "504 Gateway Timeout", text: "Integration ran past API Gateway's timeout (29 s by default).", color: "#f87171" },
              { icon: "🚦", title: "429 / throttling", text: "Rate or concurrency limit reached. Back off, raise quotas, or smooth traffic.", color: "#f87171" },
              { icon: "🔒", title: "AccessDenied", text: "Missing permission in a role, key policy, or resource policy. CloudTrail shows the denied call.", color: "#f59e0b" },
              { icon: "🏗️", title: "Stack failed", text: "Read CloudFormation stack events for the first failure reason.", color: "#f59e0b" },
              { icon: "🚚", title: "Deployment failed", text: "CodeDeploy lifecycle event logs and the agent log on the instance.", color: "#f59e0b" },
            ]}
          />
          <Flow
            color="#34d399"
            steps={[
              { icon: "📣", label: "Event happens", sub: "Deployment succeeded, quota near limit, alarm" },
              { icon: "🚌", label: "EventBridge rule", sub: "Matches the event" },
              { icon: "📨", label: "SNS topic", sub: "Email, chat, or on-call" },
            ]}
          />
        </div>
      ),
      points: [
        "Start from symptoms (dashboard or alarm), follow traces to the failing component, then read that component's logs.",
        "CloudTrail records API calls (who did what); turn on data events for S3 object and Lambda invoke activity.",
        "Health checks: load balancer target groups and ECS container health checks replace unhealthy targets; Kubernetes readiness probes keep pods out of service until they're ready.",
      ],
    },
    {
      id: "d4-concurrency",
      task: "4.3",
      title: "Lambda concurrency and right-sizing",
      check: ["d4-20", "d4-22"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧮", title: "Concurrency", text: "≈ requests per second × average duration in seconds.", color: "#38bdf8" },
              { icon: "🔒", title: "Reserved concurrency", text: "Guarantees capacity for one function and also caps it. Free.", color: "#38bdf8" },
              { icon: "🔥", title: "Provisioned concurrency", text: "Pre-initialized environments with no cold starts. Billed while configured.", color: "#38bdf8" },
            ]}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "🎛️", label: "Try several memory sizes", sub: "128 MB … 3,008 MB …" },
              { icon: "⏱️", label: "Measure duration", sub: "REPORT lines, Lambda Insights" },
              { icon: "💵", label: "Compare cost", sub: "GB-seconds × price" },
              { icon: "✅", label: "Pick the cheapest that meets latency" },
            ]}
          />
        </div>
      ),
      points: [
        "The default Regional concurrency quota is 1,000 across all functions; request an increase through Service Quotas if needed.",
        "Throttled synchronous calls return 429 (TooManyRequestsException); asynchronous events are retried automatically.",
        "Cold starts: keep packages small, initialize outside the handler, use provisioned concurrency or SnapStart on supported runtimes.",
      ],
      tip: "Do the math: 200 requests/s × 0.5 s = 100 concurrent executions.",
    },
    {
      id: "d4-optimize",
      task: "4.3",
      title: "Caching and messaging optimizations",
      check: ["d4-25", "d4-26"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#34d399"
            steps={[
              { icon: "🌐", label: "CloudFront", sub: "Cache key: only the headers, cookies, and query strings that change the response" },
              { icon: "🚪", label: "API Gateway cache", sub: "Per stage, TTL default 300 s" },
              { icon: "⚡", label: "ElastiCache / DAX", sub: "Application-level cache" },
              { icon: "🗄️", label: "Database", sub: "Fewer, cheaper reads" },
            ]}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🎯", title: "SNS subscription filter policy", text: "Each subscriber receives only the messages it cares about, by attribute or body.", color: "#a78bfa" },
              { icon: "⏳", title: "SQS long polling + batching", text: "Fewer empty receives; send, receive, and delete up to 10 messages per call.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Forwarding every header makes almost every request unique, so CloudFront's cache hit ratio collapses. Include only what varies the response, such as Accept-Language.",
        "Use logs and traces to find the bottleneck before tuning: slow dependency, cold starts, under-sized memory, or chatty calls.",
      ],
    },
  ],

  questions: [
    // ── Logs and metrics ──
    {
      id: "d4-01",
      domain: "d4",
      lesson: "d4-logs-metrics",
      prompt:
        "A Lambda function must publish a custom business metric (orders per minute, by country) without adding a synchronous API call to each invocation. Which approach meets this requirement?",
      options: [
        "Write the metric in CloudWatch embedded metric format (EMF) in the function's log output",
        "Call PutMetricData at the end of every invocation",
        "Write the metric to a DynamoDB table",
        "Use AWS CloudTrail data events",
      ],
      answer: [0],
      explanation: "EMF log lines are turned into metrics by CloudWatch asynchronously, so the function only writes a log line.",
    },
    {
      id: "d4-02",
      domain: "d4",
      lesson: "d4-logs-metrics",
      prompt: "A developer needs to find the 20 slowest invocations of a Lambda function in the last hour and see their request IDs. Which tool is the MOST efficient?",
      options: [
        "CloudWatch Logs Insights with a query that sorts by @duration and limits to 20",
        "Download every log file and search it locally",
        "AWS CloudTrail event history",
        "AWS Config",
      ],
      answer: [0],
      explanation: "Logs Insights queries log groups interactively; Lambda REPORT lines expose fields such as @duration and @requestId.",
    },
    {
      id: "d4-03",
      domain: "d4",
      lesson: "d4-logs-metrics",
      prompt: "The team wants an alarm when the word ERROR appears more than 10 times in 5 minutes in an application's log group. What should the developer set up?",
      options: ["A metric filter on the log group and a CloudWatch alarm on the resulting metric", "A CloudTrail trail", "An S3 Lifecycle rule", "An X-Ray sampling rule"],
      answer: [0],
      explanation: "Metric filters turn matching log events into a CloudWatch metric that alarms can watch.",
    },
    {
      id: "d4-04",
      domain: "d4",
      lesson: "d4-logs-metrics",
      prompt: "A developer can't find memory utilization metrics for an application on Amazon EC2 in CloudWatch. What should the developer do?",
      options: ["Install and configure the CloudWatch agent on the instance", "Enable detailed monitoring", "Enable AWS X-Ray", "Increase the instance size"],
      answer: [0],
      explanation: "Memory and disk usage are inside the OS, so EC2 doesn't report them by default. The CloudWatch agent publishes them as custom metrics. Detailed monitoring only changes the interval of default metrics.",
    },
    {
      id: "d4-05",
      domain: "d4",
      lesson: "d4-logs-metrics",
      prompt: "A trading application must publish a custom latency metric with 1-second granularity so alarms react within seconds. What should the developer use?",
      options: ["A high-resolution custom metric (storage resolution of 1 second)", "A standard-resolution metric", "CloudTrail Insights", "S3 server access logs"],
      answer: [0],
      explanation: "High-resolution custom metrics can be stored at 1-second resolution, and alarms on them can evaluate at 10- or 30-second periods.",
    },
    {
      id: "d4-06",
      domain: "d4",
      lesson: "d4-logs-metrics",
      prompt: "Which practices make application logs easier to query and correlate across services? (Choose two.)",
      options: [
        "Write logs as structured JSON with consistent fields such as level, requestId, and userId",
        "Include a correlation ID that is passed between services",
        "Log full passwords and tokens for debugging",
        "Use a different free-text format in every function",
        "Disable logging in production to save cost",
      ],
      answer: [0, 1],
      explanation: "Structured logs can be filtered and aggregated by field, and correlation IDs tie one request's logs together across services.",
    },
    {
      id: "d4-07",
      domain: "d4",
      lesson: "d4-logs-metrics",
      type: "match",
      prompt: "Match each term to its description.",
      pairs: [
        ["Logging", "Recording discrete events with their context"],
        ["Monitoring", "Watching known metrics and alerting on thresholds"],
        ["Observability", "Using logs, metrics, and traces together to explain unexpected behaviour"],
      ],
      explanation: "Monitoring tells you something is wrong; observability helps you find out why.",
    },
    // ── X-Ray ──
    {
      id: "d4-08",
      domain: "d4",
      lesson: "d4-xray",
      prompt: "Support engineers need to search AWS X-Ray traces for a specific customer ID. How should the developer record the customer ID?",
      options: ["As an annotation on the segment or subsegment", "As metadata", "In the function's environment variables", "In the trace header only"],
      answer: [0],
      explanation: "Annotations are indexed for filter expressions, for example annotation.customerId = \"123\". Metadata isn't indexed.",
    },
    {
      id: "d4-09",
      domain: "d4",
      lesson: "d4-xray",
      prompt: "A developer wants to attach a large JSON object describing the request to each trace for debugging, but doesn't need to search by it. What should be used?",
      options: ["X-Ray metadata", "X-Ray annotations", "A CloudWatch metric dimension", "A custom HTTP header"],
      answer: [0],
      explanation: "Metadata holds objects of any type with the trace without indexing them.",
    },
    {
      id: "d4-10",
      domain: "d4",
      lesson: "d4-xray",
      prompt: "A developer instrumented a Lambda function for AWS X-Ray, but no traces appear. What is the MOST likely fix?",
      options: [
        "Enable active tracing on the function and make sure its execution role allows the X-Ray write actions",
        "Install the X-Ray daemon on an EC2 instance",
        "Increase the function's memory",
        "Open UDP port 2000 in a security group",
      ],
      answer: [0],
      explanation: "Lambda runs the X-Ray daemon for you when active tracing is on. The role needs xray:PutTraceSegments and xray:PutTelemetryRecords (for example the AWSXRayDaemonWriteAccess policy).",
    },
    {
      id: "d4-11",
      domain: "d4",
      lesson: "d4-xray",
      prompt: "An application running as Amazon ECS tasks is instrumented with the X-Ray SDK, but traces never reach X-Ray. What is missing?",
      options: [
        "An X-Ray daemon (or ADOT collector) sidecar container that receives segments and sends them to X-Ray",
        "A CloudTrail trail",
        "An S3 bucket for traces",
        "A Lambda layer",
      ],
      answer: [0],
      explanation: "The SDK sends segments over UDP to a local daemon or collector, which batches them to the X-Ray API. On ECS, run it as a sidecar and grant the task role X-Ray write permissions.",
    },
    {
      id: "d4-12",
      domain: "d4",
      lesson: "d4-xray",
      prompt: "Which questions can the X-Ray service map and traces answer? (Choose two.)",
      options: [
        "Which downstream call adds the most latency to a request",
        "Which component in the request path is returning errors or faults",
        "Which IAM user deleted an S3 bucket last week",
        "What the current password for the database is",
        "How much the account spent last month",
      ],
      answer: [0, 1],
      explanation: "X-Ray shows request paths, latency, and errors across services. CloudTrail answers who-did-what questions, and Cost Explorer covers spend.",
    },
    // ── Root cause analysis ──
    {
      id: "d4-13",
      domain: "d4",
      lesson: "d4-rca",
      prompt: "An API Gateway REST API with a Lambda proxy integration returns 502 Bad Gateway. The logs show the function returns the plain string \"OK\". What should the developer change?",
      options: [
        "Return an object with statusCode, headers, and a string body",
        "Increase the API Gateway timeout",
        "Enable API caching",
        "Add a usage plan",
      ],
      answer: [0],
      explanation: "With proxy integration, API Gateway expects a specific response shape. A malformed response results in a 502.",
    },
    {
      id: "d4-14",
      domain: "d4",
      lesson: "d4-rca",
      prompt:
        "An API Gateway endpoint returns 504 errors for report requests that take about 45 seconds to generate in Lambda. Which change resolves the errors?",
      options: [
        "Accept the request, return 202 with a job ID, and generate the report asynchronously (for example through SQS), then let the client fetch the result",
        "Raise the Lambda timeout to 15 minutes",
        "Switch to an edge-optimized endpoint",
        "Enable API Gateway caching",
      ],
      answer: [0],
      explanation: "API Gateway's integration timeout is 29 seconds by default, so the Lambda timeout doesn't help. Long work should be asynchronous.",
    },
    {
      id: "d4-15",
      domain: "d4",
      lesson: "d4-rca",
      prompt: "A DynamoDB write path intermittently fails with ProvisionedThroughputExceededException during traffic spikes. What should the developer do?",
      options: [
        "Retry with exponential backoff, and fix the hot key or raise capacity (or use on-demand mode)",
        "Switch every read to strongly consistent",
        "Add a local secondary index",
        "Lower the item size limit",
      ],
      answer: [0],
      explanation: "The SDK already retries throttled requests with backoff. Lasting fixes are spreading writes across partitions and matching capacity to demand.",
    },
    {
      id: "d4-16",
      domain: "d4",
      lesson: "d4-rca",
      prompt: "A CloudFormation stack update failed and rolled back. Where should the developer look first to find out why?",
      options: ["The stack's Events, for the first resource with a FAILED status and its status reason", "AWS Trusted Advisor", "The S3 bucket that stored the template", "CloudWatch billing metrics"],
      answer: [0],
      explanation: "Stack events list each resource operation in order. The first failure's status reason usually explains the root cause; later events are the rollback.",
    },
    {
      id: "d4-17",
      domain: "d4",
      lesson: "d4-rca",
      prompt: "An AWS CodeDeploy in-place deployment to EC2 fails at the AfterInstall lifecycle event. How should the developer diagnose it?",
      options: [
        "Check the lifecycle event details in the CodeDeploy console and the CodeDeploy agent and script logs on the instance",
        "Look in the CodeBuild project history only",
        "Check AWS Artifact",
        "Delete the deployment group and retry",
      ],
      answer: [0],
      explanation: "CodeDeploy shows which hook failed and its script output, and the agent on the instance writes detailed logs for each deployment.",
    },
    {
      id: "d4-18",
      domain: "d4",
      lesson: "d4-rca",
      prompt: "The team wants an email every time an AWS CodeDeploy deployment succeeds or fails. Which solution requires the LEAST custom code?",
      options: [
        "An Amazon EventBridge rule for CodeDeploy deployment state changes that targets an Amazon SNS topic with email subscriptions",
        "A Lambda function that polls CodeDeploy every minute",
        "A CloudTrail trail delivered to S3",
        "An SQS queue that the team checks by hand",
      ],
      answer: [0],
      explanation: "AWS services emit events to EventBridge; a rule can match the events you care about and notify through SNS.",
    },
    {
      id: "d4-19",
      domain: "d4",
      lesson: "d4-rca",
      type: "order",
      prompt: "Error rates rose after a release. Put the root cause analysis steps in order.",
      items: [
        "Check the CloudWatch dashboard or alarm to see when errors started and which API is affected",
        "Open X-Ray traces for failing requests to find the component returning errors",
        "Query that component's logs in Logs Insights using the trace or request ID",
        "Fix and redeploy, then confirm the error metric returns to normal",
      ],
      explanation: "Go from symptom (metrics) to location (traces) to cause (logs), then verify the fix with the same metric.",
    },
    // ── Concurrency ──
    {
      id: "d4-20",
      domain: "d4",
      lesson: "d4-concurrency",
      prompt: "A payment Lambda function must always be able to scale to 100 concurrent executions, even when other functions in the account are busy. What should the developer configure?",
      options: ["Reserved concurrency of 100 on the payment function", "Provisioned concurrency on every other function", "A longer timeout", "A larger memory size"],
      answer: [0],
      explanation: "Reserved concurrency sets aside capacity from the account pool for the function, and also caps it at that number.",
    },
    {
      id: "d4-21",
      domain: "d4",
      lesson: "d4-concurrency",
      prompt: "A latency-sensitive API backed by a Java Lambda function shows slow responses on the first requests after a quiet period. Which option removes cold starts for expected traffic?",
      options: ["Provisioned concurrency", "Reserved concurrency", "A shorter timeout", "More environment variables"],
      answer: [0],
      explanation: "Provisioned concurrency keeps initialized environments ready. Reserved concurrency only guarantees and limits capacity; it doesn't pre-warm.",
    },
    {
      id: "d4-22",
      domain: "d4",
      lesson: "d4-concurrency",
      prompt: "A Lambda function receives 200 requests per second, and each invocation takes 500 ms on average. About how many concurrent executions are needed?",
      options: ["100", "50", "200", "400"],
      answer: [0],
      explanation: "Concurrency ≈ requests per second × duration in seconds = 200 × 0.5 = 100.",
    },
    {
      id: "d4-23",
      domain: "d4",
      lesson: "d4-concurrency",
      prompt: "During peak events, synchronous calls to several Lambda functions fail with TooManyRequestsException (429). Which actions help? (Choose two.)",
      options: [
        "Request an increase to the account's Lambda concurrency quota through Service Quotas",
        "Reduce function duration so each execution finishes and frees capacity sooner",
        "Increase every function's timeout",
        "Delete the functions' older versions",
        "Disable CloudWatch Logs for the functions",
      ],
      answer: [0, 1],
      explanation: "Throttling means concurrency demand exceeds the available limit. Raise the limit or reduce demand (shorter duration, or buffer with a queue). Longer timeouts make it worse.",
    },
    // ── Optimization ──
    {
      id: "d4-24",
      domain: "d4",
      lesson: "d4-optimize",
      prompt: "A CloudFront distribution in front of an API has a very low cache hit ratio. Which changes improve it? (Choose two.)",
      options: [
        "Use a cache policy that includes only the headers, cookies, and query strings that change the response",
        "Raise the TTLs for content that rarely changes",
        "Forward all request headers to the origin as part of the cache key",
        "Add a random query string to every request",
        "Turn off compression",
      ],
      answer: [0, 1],
      explanation: "Every value in the cache key splits the cache. Keep the key minimal, forward other values with an origin request policy if the origin needs them, and cache longer when possible.",
    },
    {
      id: "d4-25",
      domain: "d4",
      lesson: "d4-optimize",
      prompt:
        "An SNS topic publishes all order events. The shipping service's SQS queue only needs events where orderType is \"physical\", but it currently receives everything and discards most messages. What should the developer do?",
      options: ["Add a subscription filter policy on orderType to the shipping queue's subscription", "Create one topic per message", "Increase the queue's visibility timeout", "Add a Lambda function that deletes unwanted messages"],
      answer: [0],
      explanation: "Filter policies let SNS deliver only matching messages to each subscription, which reduces consumer work and cost.",
    },
    {
      id: "d4-26",
      domain: "d4",
      lesson: "d4-optimize",
      prompt: "Thousands of clients call the same GET endpoint of an API Gateway REST API, and the response changes only every few minutes. How can the developer reduce backend load with the LEAST effort?",
      options: ["Enable API caching on the stage with a suitable TTL", "Add more Lambda memory", "Use a Lambda authorizer", "Switch to a WebSocket API"],
      answer: [0],
      explanation: "Stage caching serves repeated responses from the cache for the TTL (300 seconds by default, up to 3,600) without invoking the backend.",
    },
    {
      id: "d4-27",
      domain: "d4",
      lesson: "d4-optimize",
      prompt: "A team wants to choose the most cost-effective memory setting for a Lambda function that must respond within 300 ms. What should they do?",
      options: [
        "Run the function at several memory sizes, compare duration and cost, and choose the cheapest setting that meets the latency target",
        "Always choose the minimum memory, because it is always cheapest",
        "Always choose the maximum memory",
        "Increase the timeout until the function stops failing",
      ],
      answer: [0],
      explanation: "Cost depends on memory × duration. More memory can shorten duration enough to cost the same or less, so measure instead of guessing.",
    },
    {
      id: "d4-28",
      domain: "d4",
      lesson: "d4-optimize",
      type: "match",
      prompt: "Match each performance problem to the optimization that fits it.",
      pairs: [
        ["The same database rows are read thousands of times a minute", "Cache them in Amazon ElastiCache"],
        ["Consumers polling SQS get mostly empty responses", "Enable long polling"],
        ["Lambda initialization is slow because of a large package", "Remove unused dependencies to shrink the package"],
        ["Subscribers discard most of the SNS messages they receive", "Add subscription filter policies"],
      ],
      explanation: "Find the bottleneck in logs and traces first, then apply the optimization that targets it.",
    },
  ],

  cards: [
    { id: "s-cloudwatch", domain: "d4", kind: "service", term: "Amazon CloudWatch", definition: "Metrics, logs, dashboards, and alarms" },
    { id: "s-logsinsights", domain: "d4", kind: "service", term: "CloudWatch Logs Insights", definition: "Interactive query language for log groups" },
    { id: "s-xray", domain: "d4", kind: "service", term: "AWS X-Ray", definition: "Distributed tracing with a service map" },
    { id: "s-cloudtrail", domain: "d4", kind: "service", term: "AWS CloudTrail", definition: "Records API calls: who did what, and when" },
    { id: "s-cloudfront", domain: "d4", kind: "service", term: "Amazon CloudFront", definition: "CDN that caches content at edge locations" },
    { id: "c-emf", domain: "d4", kind: "concept", term: "Embedded metric format", definition: "Metrics written inside structured logs, extracted asynchronously" },
    { id: "c-annotation", domain: "d4", kind: "concept", term: "X-Ray annotation", definition: "Indexed key-value pair you can filter traces by" },
    { id: "c-metadata", domain: "d4", kind: "concept", term: "X-Ray metadata", definition: "Extra trace data that isn't indexed or searchable" },
    { id: "c-metricfilter", domain: "d4", kind: "concept", term: "Metric filter", definition: "Turns matching log events into a CloudWatch metric" },
    { id: "c-reserved", domain: "d4", kind: "concept", term: "Reserved concurrency", definition: "Guarantees and caps a function's concurrent executions" },
    { id: "c-provisioned", domain: "d4", kind: "concept", term: "Provisioned concurrency", definition: "Pre-initialized environments that avoid cold starts" },
    { id: "c-coldstart", domain: "d4", kind: "concept", term: "Cold start", definition: "Extra latency while a new execution environment initializes" },
    { id: "c-filterpolicy", domain: "d4", kind: "concept", term: "SNS filter policy", definition: "Delivers only matching messages to a subscription" },
    { id: "c-502", domain: "d4", kind: "concept", term: "API Gateway 502", definition: "Malformed Lambda proxy response" },
    { id: "c-504", domain: "d4", kind: "concept", term: "API Gateway 504", definition: "Integration exceeded the timeout (29 s by default)" },
  ],
});
