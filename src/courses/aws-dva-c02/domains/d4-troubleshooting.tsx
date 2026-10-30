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
    summary: "How to find out why an app is broken or slow, and how to make it faster and cheaper: CloudWatch logs and metrics, X-Ray tracing, root cause analysis, Lambda concurrency, caching, and messaging.",
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
        "Logging versus monitoring versus observability",
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
    // ── Start here ──
    {
      id: "d4-start-watching",
      level: "beginner",
      task: "4.2",
      title: "Start here: seeing what your app is doing",
      check: ["dva2-b4-01", "dva2-b4-02"],
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "📓", title: "Logs", text: "A diary. Each line says what happened, like \"Order 123 failed: card declined\".", color: "#a78bfa" },
            { icon: "📈", title: "Metrics", text: "The gauges on a dashboard. Numbers over time, like errors per minute.", color: "#a78bfa" },
            { icon: "🚨", title: "Alarms", text: "A warning light. It goes off when a number crosses a line you chose.", color: "#f87171" },
          ]}
        />
      ),
      points: [
        "Once your app is running, you can't watch every request by eye. You need it to tell you what it's doing.",
        "Think of driving a car. The dashboard shows your speed and fuel, a warning light comes on when something's wrong, and the mechanic reads the car's log to find out why.",
        "Your app works the same way. **Logs** are lines of text your code writes, **metrics** are numbers measured over time, and **alarms** warn you when a metric looks bad.",
        "On AWS, all three live in **Amazon CloudWatch**. Lambda sends its logs and basic metrics there automatically.",
      ],
      tip: "When a question asks how to notice a problem early, the answer usually involves a CloudWatch metric with an alarm on it.",
    },
    {
      id: "d4-start-tracing",
      level: "beginner",
      task: "4.1",
      title: "Start here: following one request",
      check: ["dva2-b4-03", "dva2-b4-04"],
      visual: (
        <Flow
          color="#38bdf8"
          steps={[
            { icon: "🙋", label: "User clicks Buy", sub: "One request starts" },
            { icon: "🚪", label: "API Gateway", sub: "Takes 20 ms" },
            { icon: "λ", label: "Lambda", sub: "Takes 80 ms" },
            { icon: "🗄️", label: "DynamoDB", sub: "Takes 900 ms: here's the slow part" },
          ]}
        />
      ),
      points: [
        "A single click in your app often passes through several services. When it's slow or fails, you need to know which one is to blame.",
        "It's like tracking a parcel. The tracking page shows every depot it passed through and when, so you can see where it got stuck.",
        "**AWS X-Ray** does this for requests. It records each step a request takes and how long it spent there. That record is called a **trace**.",
        "**AWS CloudTrail** answers a different question: who called which AWS API, and when. For example, it can tell you who deleted a bucket.",
      ],
      tip: "Slow or failing request across services: think X-Ray. Who changed or deleted something: think CloudTrail.",
    },
    {
      id: "d4-start-faster",
      level: "beginner",
      task: "4.3",
      title: "Start here: making a slow app faster",
      check: ["dva2-b4-05", "dva2-b4-06"],
      visual: (
        <Flow
          color="#34d399"
          steps={[
            { icon: "🔎", label: "Measure", sub: "Find the slowest step" },
            { icon: "🧊", label: "Cache", sub: "Keep popular answers close by" },
            { icon: "🛒", label: "Run more at once", sub: "Open more checkout lanes" },
            { icon: "✅", label: "Measure again", sub: "Check it actually helped" },
          ]}
        />
      ),
      points: [
        "Before you speed anything up, find the **bottleneck**: the slowest step, the one that holds everything else up. Logs and traces show you where it is.",
        "A **cache** keeps a copy of answers you need often, close at hand. It's like keeping milk in your fridge instead of going to the shop every time you want a cup of tea.",
        "**Concurrency** is how many requests your code handles at the same moment, like the number of open checkout lanes in a supermarket.",
        "On AWS, caches include Amazon ElastiCache and CloudFront, and Lambda adds more copies of your function as more requests arrive.",
      ],
      tip: "Always measure before and after a change. A fix that feels faster but isn't measured is just a guess.",
    },
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
              { icon: "📝", title: "Logging", text: "Write down each thing that happens, with context: what happened, to whom, and in which request.", color: "#a78bfa" },
              { icon: "📈", title: "Monitoring", text: "Keep an eye on numbers you already know matter, and raise an alarm when one crosses a line.", color: "#a78bfa" },
              { icon: "🔭", title: "Observability", text: "Use logs, metrics, and traces together to answer questions you didn't plan for.", color: "#a78bfa" },
            ]}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "🧾", label: "Structured JSON logs", sub: "Fields like level, requestId, userId, latencyMs" },
              { icon: "🔎", label: "Logs Insights", sub: "Query with fields, filter, stats, sort" },
              { icon: "📏", label: "Metric filter or EMF", sub: "Turns log lines into numbers you can graph" },
              { icon: "🚨", label: "Alarm and SNS", sub: "Tell someone, or take an action" },
            ]}
          />
        </div>
      ),
      points: [
        "**Embedded metric format** (EMF) lets you write a metric inside a structured log line. CloudWatch pulls the number out later, in the background.",
        "That means your code never calls PutMetricData while handling a request, so publishing metrics doesn't slow the request down.",
        "Standard metrics record one data point a minute. **High-resolution** custom metrics can record one every second, which helps when alarms must react fast.",
        "EC2 can't see inside your operating system, so it doesn't report memory or disk space by default. Install the **CloudWatch agent** on the instance to send them.",
        "By default, logs in a log group are kept forever, and you keep paying to store them. Set a retention period, like 30 days, to control the cost.",
      ],
      tip: "If a question wants a custom metric from Lambda without slowing requests, pick EMF. If it wants to count ERROR lines in logs and alarm, pick a metric filter.",
    },
    {
      id: "d4-xray",
      task: "4.2",
      title: "Tracing with AWS X-Ray",
      check: ["d4-08", "d4-10"],
      visual: <TraceWaterfall />,
      points: [
        "A **trace** follows one request through your whole app. It's made of **segments**, one per service, and **subsegments** for the calls each service makes.",
        "The **service map** draws your services as boxes and shows how slow each hop is and where errors happen.",
        "**Annotations** are key-value pairs that X-Ray indexes, so you can search traces by them. **Metadata** is stored with the trace but you can't search by it.",
        "On Lambda, turn on **active tracing** and let the function's role call xray:PutTraceSegments and xray:PutTelemetryRecords.",
        "On EC2 and ECS, nothing sends traces for you. Run the **X-Ray daemon** or an ADOT collector next to your app; your code sends it trace data on UDP port 2000.",
        "**Sampling rules** decide how many requests get traced. At high volume you trace a sample, not every request, which keeps the cost down.",
      ],
      tip: "If you need to search traces by something, like a customer ID, use an annotation. If you just want to attach extra debug data, use metadata.",
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
              { icon: "🧱", title: "502 Bad Gateway", text: "Lambda sent back a response in the wrong shape, like no statusCode or a body that isn't a string.", color: "#f87171" },
              { icon: "⌛", title: "504 Gateway Timeout", text: "The backend took longer than API Gateway would wait, which is 29 seconds by default.", color: "#f87171" },
              { icon: "🚦", title: "429 / throttling", text: "You hit a rate or concurrency limit. Retry more slowly, raise the quota, or spread the traffic out.", color: "#f87171" },
              { icon: "🔒", title: "AccessDenied", text: "A role, key policy, or resource policy is missing a permission. CloudTrail shows which call was denied.", color: "#f59e0b" },
              { icon: "🏗️", title: "Stack failed", text: "Read the CloudFormation stack events and find the first failure. Its reason is usually the real cause.", color: "#f59e0b" },
              { icon: "🚚", title: "Deployment failed", text: "Check the CodeDeploy lifecycle event logs and the agent log on the instance.", color: "#f59e0b" },
            ]}
          />
          <Flow
            color="#34d399"
            steps={[
              { icon: "📣", label: "Event happens", sub: "A deployment finishes, a quota gets close, an alarm fires" },
              { icon: "🚌", label: "EventBridge rule", sub: "Picks out the events you care about" },
              { icon: "📨", label: "SNS topic", sub: "Sends an email, a chat message, or a page" },
            ]}
          />
        </div>
      ),
      points: [
        "Start from the symptom, like a dashboard or an alarm. Follow traces to the part that's failing, then read that part's logs to find out why.",
        "**CloudTrail** records API calls, so it tells you who did what and when. To also record S3 object reads and writes or Lambda invokes, turn on data events.",
        "A **health check** regularly asks your app \"are you OK?\". Load balancer target groups and ECS container health checks use the answer to replace unhealthy targets.",
        "In Kubernetes, a **readiness probe** keeps a pod out of service until it's ready to handle traffic.",
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
              { icon: "🧮", title: "Concurrency", text: "Roughly requests per second times the average duration in seconds.", color: "#38bdf8" },
              { icon: "🔒", title: "Reserved concurrency", text: "Saves capacity for one function and also caps it there. No extra charge.", color: "#38bdf8" },
              { icon: "🔥", title: "Provisioned concurrency", text: "Keeps environments warmed up, so there are no cold starts. You pay while it's switched on.", color: "#38bdf8" },
            ]}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "🎛️", label: "Try several memory sizes", sub: "For example 128 MB, 1,024 MB, 3,008 MB" },
              { icon: "⏱️", label: "Measure duration", sub: "From REPORT log lines or Lambda Insights" },
              { icon: "💵", label: "Compare cost", sub: "Memory in GB times seconds, times the price" },
              { icon: "✅", label: "Pick the cheapest one that's fast enough" },
            ]}
          />
        </div>
      ),
      points: [
        "**Concurrency** is how many copies of your function run at the same moment. By default, all functions in a Region share 1,000. You can ask for more through Service Quotas.",
        "When you hit the limit, a synchronous call fails with a 429 error (TooManyRequestsException). Asynchronous events aren't lost: Lambda retries them for you.",
        "A **cold start** is the extra wait while Lambda sets up a new environment for your function.",
        "To shorten cold starts, keep the package small and set things up outside the handler. To remove them, use provisioned concurrency, or SnapStart on runtimes that support it.",
      ],
      tip: "Do the math. 200 requests a second, each taking half a second, means about 100 running at once.",
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
              { icon: "🌐", label: "CloudFront", sub: "Put only the headers, cookies, and query strings that change the response in the cache key" },
              { icon: "🚪", label: "API Gateway cache", sub: "One cache per stage, kept 300 seconds by default" },
              { icon: "⚡", label: "ElastiCache or DAX", sub: "A cache your own code reads and writes" },
              { icon: "🗄️", label: "Database", sub: "Gets fewer reads, so it costs less" },
            ]}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🎯", title: "SNS subscription filter policy", text: "Each subscriber gets only the messages it cares about, picked by attribute or message body.", color: "#a78bfa" },
              { icon: "⏳", title: "SQS long polling and batching", text: "Fewer empty replies. Send, receive, and delete up to 10 messages in one call.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "A **cache key** is what CloudFront uses to decide whether two requests are the same. If you add every header to it, almost every request looks unique, so the cache rarely gets a hit.",
        "Include only what actually changes the response, such as Accept-Language for a page that comes in several languages.",
        "Find the bottleneck in logs and traces before you tune anything. It might be a slow dependency, cold starts, too little memory, or too many small calls.",
      ],
    },
  ],

  questions: [
    // ── Start here ──
    {
      id: "dva2-b4-01",
      domain: "d4",
      lesson: "d4-start-watching",
      level: "beginner",
      prompt: "Your code writes the line \"Order 123 failed: card declined\" each time a payment fails. What is that line called?",
      options: ["A metric", "A log entry", "An alarm state", "A trace"],
      answer: [1],
      explanation:
        "A log entry is a line of text your code writes to record something that happened. Logs tell you the details of one event. Metrics, by contrast, are numbers measured over time.",
    },
    {
      id: "dva2-b4-02",
      domain: "d4",
      lesson: "d4-start-watching",
      level: "beginner",
      prompt: "You want to be told when your app has more than 10 errors in five minutes. Which CloudWatch feature does that?",
      options: ["A log group", "A dashboard", "An alarm", "A retention period"],
      answer: [2],
      explanation:
        "A CloudWatch alarm watches a metric and acts when it crosses a line you set, like more than 10 errors in five minutes. It can send you an email or a message through Amazon SNS. A dashboard only shows the numbers; someone still has to look at it.",
    },
    {
      id: "dva2-b4-07",
      domain: "d4",
      lesson: "d4-start-watching",
      level: "beginner",
      prompt: "Where does AWS Lambda send your function's logs by default?",
      options: ["Amazon CloudWatch Logs", "An email to the account owner", "A text file on your laptop", "Nowhere, logs must be switched on by hand"],
      answer: [0],
      explanation:
        "Lambda sends whatever your function prints, plus a summary line for each run, to Amazon CloudWatch Logs. The function's role just needs permission to write there, which the basic Lambda execution role gives.",
    },
    {
      id: "dva2-b4-03",
      domain: "d4",
      lesson: "d4-start-tracing",
      level: "beginner",
      prompt: "A request goes through API Gateway, then Lambda, then DynamoDB, and it's slow. Which AWS service shows how long each step took?",
      options: ["AWS X-Ray", "AWS CloudTrail", "Amazon S3", "AWS IAM"],
      answer: [0],
      explanation:
        "X-Ray records a trace for each request, showing every service it passed through and how long it spent in each. That way you can see which step is slow, like a parcel tracking page shows where a delivery got stuck.",
    },
    {
      id: "dva2-b4-04",
      domain: "d4",
      lesson: "d4-start-tracing",
      level: "beginner",
      prompt: "Someone deleted an S3 bucket last night. Which service can tell you who did it?",
      options: ["AWS X-Ray", "Amazon CloudWatch metrics", "AWS CloudTrail", "Amazon CloudFront"],
      answer: [2],
      explanation:
        "CloudTrail records calls to AWS APIs, including who made each call and when. Deleting a bucket is an API call, so it shows up there. X-Ray follows requests through your app; it doesn't track who changed your AWS resources.",
    },
    {
      id: "dva2-b4-05",
      domain: "d4",
      lesson: "d4-start-faster",
      level: "beginner",
      prompt: "What does a cache do?",
      options: [
        "It deletes old data to save space",
        "It encrypts data so nobody else can read it",
        "It sends each request to a different Region so no single place gets too busy at peak times of day",
        "It keeps a copy of often-used data close by, so you don't fetch it from the slow source every time",
      ],
      answer: [3],
      explanation:
        "A cache stores copies of data you ask for often, somewhere quick to reach. Reading from the cache is faster than going back to the database each time. It's the milk in your fridge instead of a trip to the shop.",
    },
    {
      id: "dva2-b4-06",
      domain: "d4",
      lesson: "d4-start-faster",
      level: "beginner",
      prompt: "A Lambda function gets 10 requests every second, and each one takes 2 seconds to finish. Roughly how many copies of the function are running at the same time?",
      options: ["5", "12", "20", "200"],
      answer: [2],
      explanation:
        "Each request keeps a copy busy for 2 seconds, and 10 new ones arrive every second. So about 10 times 2, which is 20, are running at once. This number is the function's concurrency.",
    },
    // ── Logs and metrics ──
    {
      id: "d4-01",
      domain: "d4",
      lesson: "d4-logs-metrics",
      prompt:
        "A Lambda function must publish a custom business metric (orders per minute, by country) without adding a synchronous API call to each invocation. Which approach meets this requirement?",
      options: [
        "Write the metric in CloudWatch embedded metric format (EMF) in the function's log output",
        "Call PutMetricData at the end of every invocation with the country as a dimension",
        "Write the metric to a DynamoDB table",
        "Use AWS CloudTrail data events",
      ],
      answer: [0],
      explanation: "With EMF, the function just writes a log line. CloudWatch turns it into a metric later, in the background, so the request doesn't wait on an extra API call.",
    },
    {
      id: "d4-02",
      domain: "d4",
      lesson: "d4-logs-metrics",
      prompt: "A developer needs to find the 20 slowest invocations of a Lambda function in the last hour and see their request IDs. Which tool is the MOST efficient?",
      options: [
        "CloudWatch Logs Insights with a query that sorts by @duration and limits to 20",
        "Download every log file and search it locally for the slowest durations",
        "AWS CloudTrail event history",
        "AWS Config",
      ],
      answer: [0],
      explanation: "Logs Insights lets you query a log group in seconds. Lambda's REPORT lines include fields like @duration and @requestId, so you can sort by duration and keep the top 20.",
    },
    {
      id: "d4-03",
      domain: "d4",
      lesson: "d4-logs-metrics",
      prompt: "The team wants an alarm when the word ERROR appears more than 10 times in 5 minutes in an application's log group. What should the developer set up?",
      options: ["A metric filter on the log group and a CloudWatch alarm on the resulting metric", "A CloudTrail trail with an Amazon SNS notification for each error line written to the log group", "An S3 Lifecycle rule", "An X-Ray sampling rule"],
      answer: [0],
      explanation: "A metric filter counts the log lines that match a pattern, like ERROR, and turns that count into a CloudWatch metric. You then put an alarm on that metric.",
    },
    {
      id: "d4-04",
      domain: "d4",
      lesson: "d4-logs-metrics",
      prompt: "A developer can't find memory utilization metrics for an application on Amazon EC2 in CloudWatch. What should the developer do?",
      options: ["Install and configure the CloudWatch agent on the instance", "Enable detailed monitoring on the instance in the EC2 console", "Enable AWS X-Ray", "Increase the instance size"],
      answer: [0],
      explanation: "Memory and disk use live inside the operating system, so EC2 can't see them. The CloudWatch agent runs on the instance and sends them as custom metrics. Detailed monitoring only sends the default metrics more often.",
    },
    {
      id: "d4-05",
      domain: "d4",
      lesson: "d4-logs-metrics",
      prompt: "A trading application must publish a custom latency metric with 1-second granularity so alarms react within seconds. What should the developer use?",
      options: ["A high-resolution custom metric (storage resolution of 1 second)", "A standard-resolution metric published with a 1-minute period and alarm", "CloudTrail Insights", "S3 server access logs"],
      answer: [0],
      explanation: "A high-resolution custom metric can store one data point every second. Alarms on it can check every 10 or 30 seconds, so they react within seconds.",
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
      explanation: "Structured logs let you filter and count by field, like level or userId. A correlation ID travels with the request, so you can pull together its logs from every service.",
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
      explanation: "Logging records what happened. Monitoring tells you something is wrong. Observability helps you find out why.",
    },
    // ── X-Ray ──
    {
      id: "d4-08",
      domain: "d4",
      lesson: "d4-xray",
      prompt: "Support engineers need to search AWS X-Ray traces for a specific customer ID. How should the developer record the customer ID?",
      options: ["As an annotation on the segment or subsegment", "As metadata", "In the function's environment variables list", "In the trace header only"],
      answer: [0],
      explanation: "X-Ray indexes annotations, so you can search with a filter expression like annotation.customerId equal to \"123\". Metadata isn't indexed, so you can't search by it.",
    },
    {
      id: "d4-09",
      domain: "d4",
      lesson: "d4-xray",
      prompt: "A developer wants to attach a large JSON object describing the request to each trace for debugging, but doesn't need to search by it. What should be used?",
      options: ["X-Ray metadata", "X-Ray annotations", "A CloudWatch metric dimension", "A custom HTTP header"],
      answer: [0],
      explanation: "Metadata can hold any value, including a big JSON object, alongside the trace. It isn't indexed, which is fine because you don't need to search by it.",
    },
    {
      id: "d4-10",
      domain: "d4",
      lesson: "d4-xray",
      prompt: "A developer instrumented a Lambda function for AWS X-Ray, but no traces appear. What is the MOST likely fix?",
      options: [
        "Enable active tracing on the function and make sure its execution role allows the X-Ray write actions",
        "Install the X-Ray daemon on an Amazon EC2 instance and point the function's traces at it",
        "Increase the function's memory",
        "Open UDP port 2000 in a security group",
      ],
      answer: [0],
      explanation: "When active tracing is on, Lambda runs the X-Ray daemon for you. The function's role also needs xray:PutTraceSegments and xray:PutTelemetryRecords, which the AWSXRayDaemonWriteAccess policy gives.",
    },
    {
      id: "d4-11",
      domain: "d4",
      lesson: "d4-xray",
      prompt: "An application running as Amazon ECS tasks is instrumented with the X-Ray SDK, but traces never reach X-Ray. What is missing?",
      options: [
        "An X-Ray daemon (or ADOT collector) sidecar container that receives segments and sends them to X-Ray",
        "A CloudTrail trail that records the X-Ray API calls made from each task in the cluster",
        "An S3 bucket for traces",
        "A Lambda layer",
      ],
      answer: [0],
      explanation: "The X-Ray SDK doesn't talk to X-Ray directly. It sends trace data over UDP to a local daemon or collector, which forwards it in batches. On ECS, run that as a sidecar container and give the task role X-Ray write permissions.",
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
      explanation: "X-Ray shows where a request went, how long each step took, and where errors happened. For who deleted something, use CloudTrail. For spend, use Cost Explorer.",
    },
    // ── Root cause analysis ──
    {
      id: "d4-13",
      domain: "d4",
      lesson: "d4-rca",
      prompt: "An API Gateway REST API with a Lambda proxy integration returns 502 Bad Gateway. The logs show the function returns the plain string \"OK\". What should the developer change?",
      options: [
        "Return an object with statusCode, headers, and a string body",
        "Increase the API Gateway integration timeout to the full 29 seconds",
        "Enable API caching",
        "Add a usage plan",
      ],
      answer: [0],
      explanation: "With a proxy integration, API Gateway expects an object with statusCode, headers, and a string body. A plain string isn't that shape, so API Gateway returns 502.",
    },
    {
      id: "d4-14",
      domain: "d4",
      lesson: "d4-rca",
      prompt:
        "An API Gateway endpoint returns 504 errors for report requests that take about 45 seconds to generate in Lambda. Which change resolves the errors?",
      options: [
        "Accept the request, return 202 with a job ID, and generate the report asynchronously (for example through SQS), then let the client fetch the result",
        "Raise the Lambda timeout to 15 minutes and the API Gateway timeout to match, so the report has time to finish before the response",
        "Switch to an edge-optimized endpoint",
        "Enable API Gateway caching",
      ],
      answer: [0],
      explanation: "API Gateway stops waiting after 29 seconds by default, so a longer Lambda timeout doesn't help. For work that takes longer, accept the request right away and do the work in the background.",
    },
    {
      id: "d4-15",
      domain: "d4",
      lesson: "d4-rca",
      prompt: "A DynamoDB write path intermittently fails with ProvisionedThroughputExceededException during traffic spikes. What should the developer do?",
      options: [
        "Retry with exponential backoff, and fix the hot key or raise capacity (or use on-demand mode)",
        "Switch every read to strongly consistent so writes get more of the table's capacity",
        "Add a local secondary index",
        "Lower the item size limit",
      ],
      answer: [0],
      explanation: "Retrying with exponential backoff, waiting a bit longer after each failure, rides out short spikes. The SDK already does this. The lasting fix is to spread writes across partitions and give the table enough capacity.",
    },
    {
      id: "d4-16",
      domain: "d4",
      lesson: "d4-rca",
      prompt: "A CloudFormation stack update failed and rolled back. Where should the developer look first to find out why?",
      options: ["The stack's Events, for the first resource with a FAILED status and its status reason", "AWS Trusted Advisor checks for the account and its service limits, which list failed updates", "The S3 bucket that stored the template", "CloudWatch billing metrics"],
      answer: [0],
      explanation: "Stack events list every resource change in order. The first FAILED event's reason usually explains the real problem. The events after it are just the rollback.",
    },
    {
      id: "d4-17",
      domain: "d4",
      lesson: "d4-rca",
      prompt: "An AWS CodeDeploy in-place deployment to EC2 fails at the AfterInstall lifecycle event. How should the developer diagnose it?",
      options: [
        "Check the lifecycle event details in the CodeDeploy console and the CodeDeploy agent and script logs on the instance",
        "Look in the CodeBuild project's build history, since CodeBuild runs the AfterInstall hook scripts on each target instance",
        "Check AWS Artifact",
        "Delete the deployment group and retry",
      ],
      answer: [0],
      explanation: "The CodeDeploy console shows which lifecycle hook failed and what its script printed. The CodeDeploy agent on the instance also writes a detailed log for each deployment.",
    },
    {
      id: "d4-18",
      domain: "d4",
      lesson: "d4-rca",
      prompt: "The team wants an email every time an AWS CodeDeploy deployment succeeds or fails. Which solution requires the LEAST custom code?",
      options: [
        "An Amazon EventBridge rule for CodeDeploy deployment state changes that targets an Amazon SNS topic with email subscriptions",
        "A Lambda function on a schedule that polls CodeDeploy every minute and sends an email when a status changes",
        "A CloudTrail trail delivered to S3",
        "An SQS queue that the team checks by hand",
      ],
      answer: [0],
      explanation: "CodeDeploy already sends an event to EventBridge whenever a deployment changes state. An EventBridge rule picks out success and failure events and sends them to an SNS topic, which emails the team.",
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
      explanation: "Metrics show the symptom, traces show where it happens, and logs show why. After the fix, check that the same metric goes back to normal.",
    },
    // ── Concurrency ──
    {
      id: "d4-20",
      domain: "d4",
      lesson: "d4-concurrency",
      prompt: "A payment Lambda function must always be able to scale to 100 concurrent executions, even when other functions in the account are busy. What should the developer configure?",
      options: ["Reserved concurrency of 100 on the payment function", "Provisioned concurrency on every other function in the account", "A longer timeout", "A larger memory size"],
      answer: [0],
      explanation: "Reserved concurrency sets aside part of the account's capacity for one function, so busy neighbours can't take it. It also caps the function at that number.",
    },
    {
      id: "d4-21",
      domain: "d4",
      lesson: "d4-concurrency",
      prompt: "A latency-sensitive API backed by a Java Lambda function shows slow responses on the first requests after a quiet period. Which option removes cold starts for expected traffic?",
      options: ["Provisioned concurrency", "Reserved concurrency", "A shorter timeout", "More environment variables"],
      answer: [0],
      explanation: "Provisioned concurrency keeps environments set up and waiting, so the first requests don't hit a cold start. Reserved concurrency only saves and caps capacity. It doesn't warm anything up.",
    },
    {
      id: "d4-22",
      domain: "d4",
      lesson: "d4-concurrency",
      prompt: "A Lambda function receives 200 requests per second, and each invocation takes 500 ms on average. About how many concurrent executions are needed?",
      options: ["100", "50", "200", "400"],
      answer: [0],
      explanation: "Concurrency is roughly requests per second times the duration in seconds. 200 times 0.5 gives 100.",
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
      explanation: "Throttling means more copies want to run than the limit allows. Raise the limit, or lower the demand by making each run shorter or putting a queue in front. Longer timeouts make it worse, because each run holds its slot longer.",
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
      explanation: "Every value in the cache key splits the cache into more pieces. Keep the key small. If the origin still needs other values, forward them with an origin request policy, and cache for longer where you can.",
    },
    {
      id: "d4-25",
      domain: "d4",
      lesson: "d4-optimize",
      prompt:
        "An SNS topic publishes all order events. The shipping service's SQS queue only needs events where orderType is \"physical\", but it currently receives everything and discards most messages. What should the developer do?",
      options: ["Add a subscription filter policy on orderType to the shipping queue's subscription", "Create one topic per message", "Increase the queue's visibility timeout", "Add a Lambda function that reads the queue and deletes unwanted messages"],
      answer: [0],
      explanation: "A filter policy tells SNS to deliver only matching messages to that subscription. The shipping queue then gets only physical orders, so there's less to process and pay for.",
    },
    {
      id: "d4-26",
      domain: "d4",
      lesson: "d4-optimize",
      prompt: "Thousands of clients call the same GET endpoint of an API Gateway REST API, and the response changes only every few minutes. How can the developer reduce backend load with the LEAST effort?",
      options: ["Enable API caching on the stage with a suitable TTL", "Add more Lambda memory to the backend function behind it", "Use a Lambda authorizer", "Switch to a WebSocket API"],
      answer: [0],
      explanation: "With caching on, the stage answers repeat requests from its cache without calling the backend. Entries last for the TTL, 300 seconds by default and up to 3,600.",
    },
    {
      id: "d4-27",
      domain: "d4",
      lesson: "d4-optimize",
      prompt: "A team wants to choose the most cost-effective memory setting for a Lambda function that must respond within 300 ms. What should they do?",
      options: [
        "Run the function at several memory sizes, compare duration and cost, and choose the cheapest setting that meets the latency target",
        "Always choose the minimum memory setting, because the smallest size is always the cheapest one for every kind of workload",
        "Always choose the maximum memory",
        "Increase the timeout until the function stops failing",
      ],
      answer: [0],
      explanation: "Lambda cost is memory times duration. More memory also brings more CPU, which can shorten each run enough to cost the same or less. So measure several settings instead of guessing.",
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
      explanation: "Each fix targets one kind of problem. Find the bottleneck in logs and traces first, then pick the fix that matches it.",
    },
  ],

  cards: [
    { id: "s-cloudwatch", domain: "d4", kind: "service", term: "Amazon CloudWatch", definition: "The AWS service for metrics, logs, dashboards, and alarms." },
    { id: "s-logsinsights", domain: "d4", kind: "service", term: "CloudWatch Logs Insights", definition: "A query tool for searching and summarizing your log groups." },
    { id: "s-xray", domain: "d4", kind: "service", term: "AWS X-Ray", definition: "Follows each request across your services and draws a map of them." },
    { id: "s-cloudtrail", domain: "d4", kind: "service", term: "AWS CloudTrail", definition: "Records API calls, so you can see who did what, and when." },
    { id: "s-cloudfront", domain: "d4", kind: "service", term: "Amazon CloudFront", definition: "A content delivery network. It keeps copies of your content in locations close to your users." },
    { id: "c-emf", domain: "d4", kind: "concept", term: "Embedded metric format", definition: "Metrics written inside structured log lines. CloudWatch pulls them out in the background." },
    { id: "c-annotation", domain: "d4", kind: "concept", term: "X-Ray annotation", definition: "A key-value pair that X-Ray indexes, so you can search traces by it." },
    { id: "c-metadata", domain: "d4", kind: "concept", term: "X-Ray metadata", definition: "Extra data stored with a trace. It isn't indexed, so you can't search by it." },
    { id: "c-metricfilter", domain: "d4", kind: "concept", term: "Metric filter", definition: "Counts log lines that match a pattern and turns the count into a CloudWatch metric." },
    { id: "c-reserved", domain: "d4", kind: "concept", term: "Reserved concurrency", definition: "Saves a set number of concurrent executions for one function, and caps it there." },
    { id: "c-provisioned", domain: "d4", kind: "concept", term: "Provisioned concurrency", definition: "Environments set up in advance, so requests don't wait for a cold start." },
    { id: "c-coldstart", domain: "d4", kind: "concept", term: "Cold start", definition: "The extra wait while Lambda sets up a new environment for a function." },
    { id: "c-filterpolicy", domain: "d4", kind: "concept", term: "SNS filter policy", definition: "Tells SNS to deliver only matching messages to one subscription." },
    { id: "c-502", domain: "d4", kind: "concept", term: "API Gateway 502", definition: "Lambda sent back a proxy response in the wrong shape." },
    { id: "c-504", domain: "d4", kind: "concept", term: "API Gateway 504", definition: "The backend took longer than the timeout, 29 seconds by default." },
  ],
});
