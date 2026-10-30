import { Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { TraceWaterfall } from "../visuals";

/**
 * Domain 4: Troubleshooting and Optimization (22% of DVA-C03 scored content).
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d4",
    number: 4,
    name: "Troubleshooting and Optimization",
    world: "The Observatory",
    weight: 22,
    emoji: "🔭",
    color: "#a78bfa",
    summary: "How to find out why an app is broken or slow, and how to make it faster and cheaper: logs, metrics, and traces, root cause analysis, AI-assisted troubleshooting, health checks, Lambda tuning and concurrency, connection pooling, caching, and messaging.",
  },

  tasks: [
    {
      id: "4.1",
      title: "Assist in a root cause analysis",
      covers: [
        "Debug application code and service integration issues to find defects",
        "Interpret application metrics, logs, and traces",
        "Query logs to find relevant data",
        "Troubleshoot deployment failures from output logs",
        "Use AWS AI tools to analyze errors and generate troubleshooting suggestions",
      ],
    },
    {
      id: "4.2",
      title: "Apply logging, monitoring, and observability best practices",
      covers: [
        "Record application behavior and state with effective (structured) logging of events and user actions",
        "Write code that emits custom metrics",
        "Send notification alerts for specific actions such as quota limits and deployment completions",
        "Implement tracing with AWS services and tools",
        "Monitor workload health with health checks and liveness and readiness probes",
      ],
    },
    {
      id: "4.3",
      title: "Optimize applications by using AWS services and features",
      covers: [
        "Apply concurrency concepts: Lambda provisioned concurrency, EC2 Auto Scaling, thread pools, connection pooling",
        "Optimize memory and compute power",
        "Optimize messaging with SQS queues and SNS fanout",
        "Implement caching with ElastiCache, DAX, and CloudFront",
        "Detect performance bottlenecks with Amazon CloudWatch",
        "Use AWS AI tools to find optimization opportunities: bottlenecks, resource usage, code efficiency",
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
      check: ["dva3-b4-01", "dva3-b4-02"],
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
      check: ["dva3-b4-03", "dva3-b4-04"],
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
      check: ["dva3-b4-05", "dva3-b4-06"],
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
        "In Kubernetes, a **liveness probe** restarts a container that's stuck. A **readiness probe** keeps a pod out of service until it can handle traffic.",
        "To hear about a quota before you hit it, put a CloudWatch alarm on the AWS usage metric for it. Service Quotas shows these metrics.",
      ],
    },
    {
      id: "d4-ai-ops",
      task: "4.1 · 4.3",
      title: "AI-assisted troubleshooting and optimization",
      check: ["d4-31", "d4-32", "d4-34"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "🚨", label: "Alarm fires", sub: "Or a metric spikes, or you run a Logs Insights query" },
              { icon: "🤖", label: "CloudWatch investigations", sub: "AI looks through metrics, logs, traces, deployments, and changes" },
              { icon: "💡", label: "Hypotheses", sub: "Likely causes, each with its evidence" },
              { icon: "🧑‍💻", label: "You verify and fix", sub: "You keep or throw out each suggestion" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🐛", title: "Explain an error", text: "Paste a stack trace into an AI coding assistant, with secrets and customer data removed, and ask for likely causes and a fix.", color: "#38bdf8" },
              { icon: "🐢", title: "Find bottlenecks", text: "Share a slow function and its trace or profile, and ask how to make the code faster, for example by batching calls or reusing clients.", color: "#38bdf8" },
              { icon: "🧮", title: "Right-size resources", text: "Ask it to spot too much memory, too many small calls, and missing caches. Then confirm with real measurements.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "**CloudWatch investigations** is a generative AI assistant for incidents. You start it from an alarm, a metric, or a Logs Insights query.",
        "It gathers related telemetry, such as metrics, logs, deployments, CloudTrail change events, and X-Ray traces, and suggests what the root cause might be.",
        "An investigation can only see what the signed-in user, or a role you set up, is allowed to see. Its actions are logged in CloudTrail.",
        "Treat an AI suggestion as a guess, not a fact. Check it against metrics and traces, and test the fix, before you change production.",
        "AI tools can also spot slow code, like wasteful loops, a new client created on every request, or calls that should be batched. Measure before and after you change it.",
      ],
      tip: "If a question wants AI to suggest root causes from an alarm, pick CloudWatch investigations. Always check the suggestion against your telemetry.",
    },
    {
      id: "d4-concurrency",
      task: "4.3",
      title: "Concurrency, pooling, and right-sizing",
      check: ["d4-20", "d4-22", "d4-29"],
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
        "To shorten cold starts, keep the package small and create SDK clients and connections outside the handler. To remove them, use provisioned concurrency, or SnapStart on runtimes that support it.",
        "Lambda gives a function more CPU when you give it more memory. So a function that does heavy computing often gets faster, and sometimes cheaper, with more memory.",
        "Reuse database connections instead of opening a new one each time. Long-running apps keep a **connection pool**, a set of open connections they share.",
        "When many Lambda environments would each open their own connection, put **RDS Proxy** in front of RDS or Aurora to share them. Size thread pools to the work and to what the database can take.",
        "**EC2 Auto Scaling** with target tracking adds and removes instances to match the load. For example, you can ask it to keep average CPU near 50%.",
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
      id: "dva3-b4-01",
      domain: "d4",
      lesson: "d4-start-watching",
      level: "beginner",
      prompt: "Your code writes the line \"Order 123 failed: card declined\" each time a payment fails. What is that line called?",
      options: ["A metric", "A log entry", "An alarm", "A trace"],
      answer: [1],
      explanation:
        "A log entry is a line of text your code writes to record something that happened. Logs tell you the details of one event. Metrics, by contrast, are numbers measured over time.",
    },
    {
      id: "dva3-b4-02",
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
      id: "dva3-b4-07",
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
      id: "dva3-b4-03",
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
      id: "dva3-b4-04",
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
      id: "dva3-b4-05",
      domain: "d4",
      lesson: "d4-start-faster",
      level: "beginner",
      prompt: "What does a cache do?",
      options: [
        "It deletes old data to save space",
        "It encrypts data so nobody else can read it",
        "It sends each request to a different Region",
        "It keeps a copy of often-used data close by, so you don't fetch it from the slow source every time",
      ],
      answer: [3],
      explanation:
        "A cache stores copies of data you ask for often, somewhere quick to reach. Reading from the cache is faster than going back to the database each time. It's the milk in your fridge instead of a trip to the shop.",
    },
    {
      id: "dva3-b4-06",
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
        "Call PutMetricData at the end of every invocation",
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
        "Download every log file and search it locally",
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
      options: ["A metric filter on the log group and a CloudWatch alarm on the resulting metric", "A CloudTrail trail", "An S3 Lifecycle rule", "An X-Ray sampling rule"],
      answer: [0],
      explanation: "A metric filter counts the log lines that match a pattern, like ERROR, and turns that count into a CloudWatch metric. You then put an alarm on that metric.",
    },
    {
      id: "d4-04",
      domain: "d4",
      lesson: "d4-logs-metrics",
      prompt: "A developer can't find memory utilization metrics for an application on Amazon EC2 in CloudWatch. What should the developer do?",
      options: ["Install and configure the CloudWatch agent on the instance", "Enable detailed monitoring", "Enable AWS X-Ray", "Increase the instance size"],
      answer: [0],
      explanation: "Memory and disk use live inside the operating system, so EC2 can't see them. The CloudWatch agent runs on the instance and sends them as custom metrics. Detailed monitoring only sends the default metrics more often.",
    },
    {
      id: "d4-05",
      domain: "d4",
      lesson: "d4-logs-metrics",
      prompt: "A trading application must publish a custom latency metric with 1-second granularity so alarms react within seconds. What should the developer use?",
      options: ["A high-resolution custom metric (storage resolution of 1 second)", "A standard-resolution metric", "CloudTrail Insights", "S3 server access logs"],
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
      options: ["As an annotation on the segment or subsegment", "As metadata", "In the function's environment variables", "In the trace header only"],
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
        "Install the X-Ray daemon on an EC2 instance",
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
        "A CloudTrail trail",
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
        "Increase the API Gateway timeout",
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
        "Raise the Lambda timeout to 15 minutes",
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
        "Switch every read to strongly consistent",
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
      options: ["The stack's Events, for the first resource with a FAILED status and its status reason", "AWS Trusted Advisor", "The S3 bucket that stored the template", "CloudWatch billing metrics"],
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
        "Look in the CodeBuild project history only",
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
        "A Lambda function that polls CodeDeploy every minute",
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
      options: ["Reserved concurrency of 100 on the payment function", "Provisioned concurrency on every other function", "A longer timeout", "A larger memory size"],
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
      options: ["Add a subscription filter policy on orderType to the shipping queue's subscription", "Create one topic per message", "Increase the queue's visibility timeout", "Add a Lambda function that deletes unwanted messages"],
      answer: [0],
      explanation: "A filter policy tells SNS to deliver only matching messages to that subscription. The shipping queue then gets only physical orders, so there's less to process and pay for.",
    },
    {
      id: "d4-26",
      domain: "d4",
      lesson: "d4-optimize",
      prompt: "Thousands of clients call the same GET endpoint of an API Gateway REST API, and the response changes only every few minutes. How can the developer reduce backend load with the LEAST effort?",
      options: ["Enable API caching on the stage with a suitable TTL", "Add more Lambda memory", "Use a Lambda authorizer", "Switch to a WebSocket API"],
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
        "Always choose the minimum memory, because it is always cheapest",
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
    // ── Lambda tuning, pooling, and scaling (moved from Domain 1 in DVA-C03) ──
    {
      id: "d4-29",
      domain: "d4",
      lesson: "d4-concurrency",
      prompt: "A CPU-intensive Lambda function that resizes images runs slowly at 512 MB of memory. Which change most directly improves its performance?",
      options: ["Increase the memory setting, which also increases the CPU allocated", "Increase the timeout", "Add more environment variables", "Move the function to a VPC"],
      answer: [0],
      explanation: "Lambda gives a function more CPU when you give it more memory. The function often finishes so much faster that the cost stays about the same or even drops.",
    },
    {
      id: "d4-30",
      domain: "d4",
      lesson: "d4-concurrency",
      prompt: "Which practices reduce Lambda latency by taking advantage of execution environment reuse? (Choose two.)",
      options: [
        "Initialize SDK clients and database connections outside the handler",
        "Keep the deployment package small by including only the dependencies the function needs",
        "Create a new database connection inside the handler on every invocation",
        "Assume that global variables always persist between all invocations",
        "Load all configuration from Amazon S3 on every invocation",
      ],
      answer: [0, 1],
      explanation: "Code outside the handler runs once per environment, and later warm invocations reuse it. Smaller packages also start faster. Reuse isn't guaranteed, though, so your code must still work in a fresh environment.",
    },
    {
      id: "d4-35",
      domain: "d4",
      lesson: "d4-concurrency",
      prompt:
        "During traffic spikes, hundreds of concurrent Lambda environments each open their own connection to an Amazon Aurora database, and the database runs out of connections. Which change addresses this with the LEAST code change?",
      options: [
        "Put Amazon RDS Proxy in front of the database and point the functions at the proxy endpoint",
        "Open a new connection inside the handler and close it after each query",
        "Raise the functions' timeout",
        "Switch the functions to an SQS FIFO queue trigger",
      ],
      answer: [0],
      explanation: "RDS Proxy keeps a pool of database connections and shares them among many clients. A burst of Lambda environments then reuses those connections instead of using up the database's limit.",
    },
    {
      id: "d4-36",
      domain: "d4",
      lesson: "d4-concurrency",
      prompt: "A web tier on Amazon EC2 behind an Application Load Balancer should add instances when average CPU rises above 50% and remove them when load drops, with no manual work. What should the developer configure?",
      options: [
        "An EC2 Auto Scaling group with a target tracking policy on average CPU utilization of 50%",
        "A larger instance type",
        "A CloudWatch dashboard",
        "Lambda provisioned concurrency",
      ],
      answer: [0],
      explanation: "Target tracking adds or removes instances to keep the chosen metric, here average CPU, close to the target. You don't have to do anything by hand.",
    },
    // ── AI-assisted troubleshooting and optimization ──
    {
      id: "d4-31",
      domain: "d4",
      lesson: "d4-ai-ops",
      prompt:
        "A CloudWatch alarm fires for rising API latency. The on-call developer wants AI-generated root-cause hypotheses based on related metrics, logs, recent deployments, and change events, without building any tooling. What should they use?",
      options: ["CloudWatch investigations, started from the alarm", "AWS CloudShell", "An S3 Lifecycle rule", "AWS AppConfig feature flags"],
      answer: [0],
      explanation: "CloudWatch investigations is a generative AI assistant built into CloudWatch. Started from an alarm, it looks at the related telemetry and suggests possible causes for you to keep or throw out.",
    },
    {
      id: "d4-32",
      domain: "d4",
      lesson: "d4-ai-ops",
      prompt:
        "An AI assistant suggests that a spike in 5xx errors was caused by a new database index. What should the developer do before acting on the suggestion?",
      options: [
        "Verify it against telemetry, for example X-Ray traces, database metrics, and the deployment timeline, then test the fix",
        "Drop the index in production immediately",
        "Ignore it, because AI suggestions are never useful",
        "Restart every service in the account",
      ],
      answer: [0],
      explanation: "Treat what the AI says as a theory to check. Look at the evidence and test the change, just as you would with a colleague's idea.",
    },
    {
      id: "d4-33",
      domain: "d4",
      lesson: "d4-ai-ops",
      prompt: "A developer asks an AI coding assistant to find optimization opportunities in a slow Lambda function. Which suggestions are likely to be valid improvements? (Choose two.)",
      options: [
        "Move SDK client creation out of the handler so warm invocations reuse it",
        "Replace a loop of single PutItem calls with BatchWriteItem",
        "Add a sleep before each call to reduce throttling forever",
        "Raise the timeout to 15 minutes to hide the slowness",
        "Log the full request body, including tokens, on every call",
      ],
      answer: [0, 1],
      explanation: "Reusing clients and batching calls cut both waiting time and the number of requests. Sleeping, longer timeouts, and logging secrets don't fix anything. Measure before and after any change.",
    },
    {
      id: "d4-34",
      domain: "d4",
      lesson: "d4-ai-ops",
      prompt:
        "A developer wants help from an AI assistant to understand a production stack trace. The log lines include a customer email address and a database password from a misconfigured debug statement. What should the developer do?",
      options: [
        "Remove or mask the sensitive values before sharing the error, and fix the debug logging that exposed the password",
        "Paste the full log so the assistant has all the context",
        "Post the log in a public forum instead",
        "Rotate nothing, because logs are private",
      ],
      answer: [0],
      explanation: "Keep secrets and personal data out of anything you paste into an AI tool. The exposed password should also be rotated, and the debug logging fixed so it isn't written again.",
    },
    // ── Observability, health, and integrations ──
    {
      id: "d4-37",
      domain: "d4",
      lesson: "d4-rca",
      prompt:
        "A container on Amazon EKS sometimes deadlocks: the process keeps running but stops responding. Kubernetes should restart it automatically. What should the developer add?",
      options: [
        "A liveness probe that calls a health endpoint, so Kubernetes restarts the container when it fails",
        "A readiness probe only",
        "A larger memory limit",
        "An ECR lifecycle policy",
      ],
      answer: [0],
      explanation: "When a liveness probe fails, Kubernetes restarts the container. A readiness probe only stops sending traffic to the pod. It doesn't restart anything.",
    },
    {
      id: "d4-38",
      domain: "d4",
      lesson: "d4-rca",
      prompt: "A team wants to be notified before its Lambda concurrent executions reach the account quota. Which solution requires the LEAST custom code?",
      options: [
        "A CloudWatch alarm on the account-level ConcurrentExecutions metric at about 80% of the quota, notifying an Amazon SNS topic",
        "A Lambda function that checks the quota page in a browser every minute",
        "Raising every function's timeout",
        "A CloudTrail trail delivered to S3",
      ],
      answer: [0],
      explanation: "Lambda already publishes ConcurrentExecutions as a CloudWatch metric. A normal alarm on it, with an SNS action, warns you before you reach the limit. Service Quotas also shows usage against quotas for many services.",
    },
    {
      id: "d4-39",
      domain: "d4",
      lesson: "d4-rca",
      prompt:
        "An Amazon EventBridge rule matches events (its MatchedEvents metric rises), but the target Lambda function is never invoked and the rule's FailedInvocations metric is increasing. What is the MOST likely cause?",
      options: [
        "The function's resource-based policy doesn't allow events.amazonaws.com to invoke it",
        "The event pattern is wrong",
        "The function's memory is too low",
        "The function needs a NAT gateway",
      ],
      answer: [0],
      explanation: "The rule is matching events, so the pattern is fine. The failures happen when EventBridge tries to call the function, which means it isn't allowed to. Add events.amazonaws.com to the function's resource-based policy.",
    },
    {
      id: "d4-41",
      domain: "d4",
      lesson: "d4-logs-metrics",
      prompt:
        "Support staff need to answer questions such as \"which actions did user 123 take before the error?\" across several Lambda functions. How should the developer log user actions?",
      options: [
        "Write one structured JSON entry per action with fields such as userId, action, requestId, and outcome, then query them with Logs Insights",
        "Print free-text messages that differ in each function",
        "Log only errors",
        "Write actions to /tmp in each function",
      ],
      answer: [0],
      explanation: "When every function logs the same fields, you can filter by userId and follow one user's actions across services. Keep sensitive values out of those fields.",
    },
    {
      id: "d4-42",
      domain: "d4",
      lesson: "d4-xray",
      prompt: "A high-traffic API is fully traced with AWS X-Ray, and tracing costs are higher than expected. The team still wants representative traces and every error. What should the developer change?",
      options: [
        "Adjust X-Ray sampling rules to record a smaller fixed rate and percentage of requests",
        "Turn off tracing for all services",
        "Store every trace as metadata instead",
        "Add more annotations to each segment",
      ],
      answer: [0],
      explanation: "Sampling rules decide how many requests get traced: a fixed number each second, called the reservoir, plus a percentage of the rest. You still get a fair picture, at a lower cost.",
    },
    {
      id: "d4-40",
      domain: "d4",
      lesson: "d4-optimize",
      prompt: "A Lambda function triggered by SQS processes small messages one at a time, which drives up invocation count and cost. Which changes reduce invocations? (Choose two.)",
      options: [
        "Increase the event source mapping's batch size",
        "Set a maximum batching window so Lambda waits briefly to gather larger batches",
        "Lower the queue's visibility timeout to 1 second",
        "Switch the queue to short polling",
        "Create one queue per message",
      ],
      answer: [0, 1],
      explanation: "A bigger batch size, plus a short wait to fill each batch, means more messages per invocation and fewer invocations overall. Use partial batch responses too, so one bad message doesn't retry the whole batch.",
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
    { id: "c-metricfilter", domain: "d4", kind: "concept", term: "Metric filter", definition: "Counts log lines that match a pattern and turns the count into a CloudWatch metric." },
    { id: "c-reserved", domain: "d4", kind: "concept", term: "Reserved concurrency", definition: "Saves a set number of concurrent executions for one function, and caps it there." },
    { id: "c-provisioned", domain: "d4", kind: "concept", term: "Provisioned concurrency", definition: "Environments set up in advance, so requests don't wait for a cold start." },
    { id: "c-filterpolicy", domain: "d4", kind: "concept", term: "SNS filter policy", definition: "Tells SNS to deliver only matching messages to one subscription." },
    { id: "c-502", domain: "d4", kind: "concept", term: "API Gateway 502", definition: "Lambda sent back a proxy response in the wrong shape." },
    { id: "c-504", domain: "d4", kind: "concept", term: "API Gateway 504", definition: "The backend took longer than the timeout, 29 seconds by default." },
    { id: "s-investigations", domain: "d4", kind: "service", term: "CloudWatch investigations", definition: "A generative AI assistant that suggests possible root causes from your telemetry." },
    { id: "s-rdsproxy", domain: "d4", kind: "service", term: "Amazon RDS Proxy", definition: "Keeps a pool of database connections for RDS and Aurora and shares them among clients." },
    { id: "c-liveness", domain: "d4", kind: "concept", term: "Liveness probe", definition: "When it fails, Kubernetes restarts the container." },
    { id: "c-readiness", domain: "d4", kind: "concept", term: "Readiness probe", definition: "When it fails, the pod gets no traffic until it's ready." },
  ],
});
