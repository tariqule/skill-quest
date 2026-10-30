import { defineCourse } from "@/engine/define";
import d1 from "./domains/d1-development";
import d2 from "./domains/d2-security";
import d3 from "./domains/d3-testing-deployment";
import d4 from "./domains/d4-troubleshooting";

/**
 * AWS Certified Developer – Associate (DVA-C03).
 * Content follows the official DVA-C03 exam guide (online edition, retrieved October 2026).
 * Registration for DVA-C03 opened October 27, 2026 and exam appointments start December 1, 2026; the last day to take DVA-C02 is November 30, 2026.
 * Domain content lives in ./domains; this file holds course-wide metadata.
 */
export default defineCourse({
  id: "aws-dva-c03",
  provider: { id: "aws", name: "AWS", color: "#f59e0b", icon: "☁️" },
  code: "DVA-C03",
  title: "AWS Certified Developer – Associate",
  shortTitle: "Developer Associate (C03)",
  tagline: "Learn to build, secure, test, deploy, and fix cloud apps with Lambda, DynamoDB, containers, and CI/CD, and to use AI tools and Amazon Bedrock in your own code.",
  level: "Associate",
  lifecycle: { opens: "2026-12-01", predecessor: "aws-dva-c02" },
  storageKey: "course:aws-dva-c03:v1",

  domains: [d1, d2, d3, d4],

  exam: {
    questions: 65,
    unscored: 15,
    minutes: 130,
    scale: { min: 100, max: 1000, pass: 720 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "One right answer and three wrong ones." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "Two or more right answers out of five or more options. You need all of them right to score." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Not on the real DVA-C03 exam. Used here to drill sequences such as deployment hooks.", practiceOnly: true },
      { id: "match", icon: "🔗", name: "Matching", rule: "Not on the real DVA-C03 exam. Used here to drill service-to-use-case pairs.", practiceOnly: true },
    ],
  },

  guide: {
    source: {
      label: "AWS DVA-C03 exam guide",
      version: "online edition",
      date: "retrieved October 2026",
      url: "https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/developer-associate-03.html",
    },
    facts: [
      { icon: "📝", value: "65", label: "questions", detail: "50 count toward your score. The other 15 are unscored trial questions, and you can't tell which ones they are. Every question is multiple choice or multiple response." },
      { icon: "⏱️", value: "130", label: "minutes", detail: "That's just over 2 minutes a question. Scenario questions are long, so read the last line first to see what's being asked." },
      { icon: "🎯", value: "720", label: "to pass", detail: "Scores run from 100 to 1,000. You pass on your overall score, so a weak domain can be made up by a strong one." },
      { icon: "🎲", value: "0", label: "guess penalty", detail: "A blank answer counts as wrong, and a wrong guess costs nothing extra. Always pick something." },
      { icon: "💵", value: "$150", label: "USD", detail: "You can sit it at a Pearson VUE test center or online with a proctor watching. AWS exam pricing lists other currencies." },
      { icon: "📅", value: "3", label: "years valid", detail: "To keep it, pass the latest version of this exam, or the DevOps Engineer – Professional exam." },
      { icon: "🗓️", value: "Dec 1", label: "2026: DVA-C03 exams start", detail: "Registration for DVA-C03 opened October 27, 2026, and exam appointments start December 1, 2026. The last day to take DVA-C02 is November 30, 2026." },
      { icon: "🤖", value: "New", label: "AI skills", detail: "C03 adds AI-assisted development, calling managed AI services from your code, and a whole task on AI security (Task 2.3)." },
    ],
    candidate: {
      is: [
        "A developer with at least a year of hands-on experience building and looking after apps with AWS services",
        "Comfortable in at least one high-level programming language, and understands how an app is managed from first build to retirement",
        "Used to development tools, including AI tools, and to working with an AI assistant",
        "Builds and secures apps with AWS service APIs, the AWS CLI, and the SDKs, and deploys them through a CI/CD pipeline",
        "Uses AI tools to help build, test, and release software, and calls managed AI services from apps",
      ],
      isNot: [
        "Designing architectures, such as distributed systems, microservices, or database schemas and models",
        "Designing and building CI/CD pipelines",
        "Managing IAM users and groups, or servers and operating systems",
        "Choosing foundation models, engineering AI prompts, or designing RAG architectures",
        "Designing AI safety frameworks, implementing guardrails, or implementing AI governance",
        "Designing and building ETL pipelines",
        "Designing AWS networking infrastructure",
      ],
    },
    scope: {
      label: "In-scope AWS services",
      groups: [
        { category: "Analytics", icon: "📊", services: ["Amazon Athena", "Amazon Data Firehose", "Amazon Kinesis", "Amazon OpenSearch Service"] },
        { category: "Application integration", icon: "🔀", services: ["Amazon EventBridge", "Amazon SNS", "Amazon SQS", "AWS Step Functions"] },
        { category: "Compute", icon: "🖥️", services: ["Amazon EC2", "AWS Elastic Beanstalk", "AWS Lambda"] },
        { category: "Containers", icon: "🐳", services: ["Amazon ECR", "Amazon ECS", "Amazon EKS"] },
        { category: "Database", icon: "🗄️", services: ["Amazon Aurora", "Amazon DynamoDB", "Amazon ElastiCache", "Amazon RDS"] },
        {
          category: "Developer tools",
          icon: "🛠️",
          services: ["AWS Amplify", "AWS CloudShell", "AWS CodeArtifact", "AWS CodeBuild", "AWS CodeDeploy", "AWS CodePipeline", "AWS X-Ray"],
        },
        { category: "Machine learning & AI", icon: "🤖", services: ["Amazon Bedrock", "Amazon Bedrock AgentCore", "Amazon Quick", "Kiro"] },
        {
          category: "Management & governance",
          icon: "🧭",
          services: ["AWS AppConfig", "AWS CDK", "AWS CloudFormation", "AWS CloudTrail", "Amazon CloudWatch", "Amazon CloudWatch Logs", "AWS CLI", "AWS SAM", "AWS Systems Manager"],
        },
        {
          category: "Networking & content delivery",
          icon: "🌐",
          services: ["Amazon API Gateway", "Amazon CloudFront", "Elastic Load Balancing", "AWS PrivateLink", "Amazon Route 53", "Amazon VPC"],
        },
        {
          category: "Security, identity & compliance",
          icon: "🔐",
          services: ["AWS Certificate Manager", "Amazon Cognito", "AWS IAM", "AWS KMS", "AWS Private CA", "AWS Secrets Manager", "AWS STS", "AWS WAF"],
        },
        { category: "Storage", icon: "🪣", services: ["Amazon EBS", "Amazon EFS", "Amazon S3", "Amazon S3 Glacier"] },
      ],
    },
    tips: [
      { icon: "🔎", tip: "Look for the requirement words, like LEAST operational overhead, MOST cost-effective, or LEAST code changes. When two answers both work, these words decide." },
      { icon: "🧮", tip: "Expect some arithmetic: DynamoDB read and write capacity units, Lambda concurrency (requests per second times duration), and SQS visibility timeouts. Round item sizes up before you start." },
      { icon: "🔐", tip: "Never pick an answer that writes access keys or secrets into the code, or pastes secrets or customer data into an AI prompt. Use roles to reach AWS, and Secrets Manager or Parameter Store to hold secrets." },
      { icon: "⛔", tip: "In IAM questions, look for an explicit Deny first. It beats every Allow. If nothing allows the action, it's denied too." },
      { icon: "🤖", tip: "AI questions reward good developer habits. Give only the model access you need, remove personal data before sending it, check what the model returns, back off on 429 errors, and review AI-written code and tests." },
      { icon: "🚫", tip: "Choosing foundation models, prompt engineering, RAG design, and designing guardrail frameworks aren't on this exam. Focus on calling, securing, and running AI services from your code." },
      { icon: "🚩", tip: "Flag long scenario questions and come back to them. 130 minutes is plenty if you don't get stuck." },
      { icon: "🎲", tip: "Never leave a question blank. Guessing costs you nothing." },
    ],
    officialPractice: {
      label: "AWS Skill Builder DVA-C03 exam prep",
      url: "https://skillbuilder.aws/category/exam-prep/developer-associate-DVA-C03",
    },
  },

  cheatsheet: [
    {
      title: "Lambda numbers",
      items: [
        ["Timeout", "3 seconds by default, up to 900 seconds (15 minutes)"],
        ["Memory", "From 128 MB to 10,240 MB. More memory also gives more CPU"],
        ["Package", "A .zip upload can be 50 MB zipped and 250 MB unzipped, layers included. A container image can be 10 GB"],
        ["Layers", "Up to 5 for each function"],
        ["Concurrency", "1,000 per Region by default, and you can ask for more. Reserved saves and caps capacity. Provisioned removes cold starts"],
        ["Async errors", "Lambda retries twice, then sends the event to an on-failure destination or a DLQ"],
        ["VPC", "The function gets no public IP. Use a NAT gateway to reach the internet, or VPC endpoints to reach AWS services"],
      ],
    },
    {
      title: "Messaging",
      items: [
        ["SQS visibility timeout", "30 seconds by default, up to 12 hours. Make it longer than processing takes, and at least 6 times the function timeout for Lambda"],
        ["SQS long polling", "Set WaitTimeSeconds, up to 20 seconds"],
        ["SQS retention", "4 days by default, anywhere from 1 minute to 14 days"],
        ["FIFO", "Keeps order within each message group ID, and drops duplicates sent within 5 minutes"],
        ["DLQ", "A redrive policy with maxReceiveCount. It must be the same queue type as the source"],
        ["SNS", "Sends each message to many subscribers. Filter policies pick what each one gets"],
        ["EventBridge", "Rules that match on event content, schedules, and archive and replay"],
        ["Kinesis Data Streams", "The partition key picks the shard, and order is kept within a shard. Enhanced fan-out gives each consumer its own throughput"],
      ],
    },
    {
      title: "DynamoDB",
      items: [
        ["RCU", "One strongly consistent read a second of up to 4 KB. Eventually consistent reads cost half, transactional reads double"],
        ["WCU", "One write a second of up to 1 KB. Transactional writes cost double"],
        ["Partition key", "Pick one with many different values, so no partition gets too busy"],
        ["LSI", "Same partition key with a different sort key. Created with the table, and allows strongly consistent reads"],
        ["GSI", "Any keys, added at any time, eventually consistent reads only"],
        ["Query versus Scan", "Query needs the partition key. Scan reads the whole table. Each page returns up to 1 MB"],
        ["Optimistic locking", "Write only if a version attribute still has the value you read"],
        ["TTL, Streams, DAX", "Free automatic expiry, a change feed for Lambda, and a microsecond cache"],
      ],
    },
    {
      title: "Security",
      items: [
        ["Policy evaluation", "An explicit deny wins, then an allow. With neither, it's denied"],
        ["Cross-account", "A role in the target account, a trust policy, and sts:AssumeRole"],
        ["Cognito", "User pools handle sign-in and issue JWTs. Identity pools hand out temporary AWS credentials"],
        ["API authorizers", "Cognito checks user pool JWTs, Lambda runs your own logic, IAM checks SigV4 signatures"],
        ["KMS", "Encrypt directly up to 4 KB. For more, call GenerateDataKey and use envelope encryption"],
        ["S3 encryption", "SSE-S3 is the default. Others are SSE-KMS (with Bucket Keys), SSE-C, and client-side"],
        ["Secrets", "Secrets Manager adds rotation. Parameter Store is cheap config organized in a path hierarchy"],
        ["Presigned URLs", "A GET or PUT on one S3 object, with the signer's permissions. Valid up to 7 days, and never longer than the signing credentials"],
        ["CloudFront", "Signed URLs or cookies with a trusted key group, plus origin access control"],
        ["Certificates", "ACM gives public certificates that renew themselves. Private CA issues internal ones"],
      ],
    },
    {
      title: "Testing and deployment",
      items: [
        ["CloudFormation", "Resources is the only required section. Preview with change sets, share values with Export and ImportValue, roll back on failure"],
        ["SAM", "Add Transform: AWS::Serverless-2016-10-31. Then use sam build, sam local invoke, and sam deploy"],
        ["Lambda traffic shifting", "An alias plus CodeDeploy, with Canary10Percent5Minutes, Linear10PercentEvery1Minute, or AllAtOnce"],
        ["Beanstalk", "All at once, rolling, rolling with an extra batch, immutable, traffic splitting, or blue/green with a URL swap"],
        ["CodeDeploy EC2 hooks", "In order: ApplicationStop, BeforeInstall, AfterInstall, ApplicationStart, ValidateService"],
        ["buildspec.yml", "In order: install, pre_build, build, post_build"],
        ["API Gateway", "Stages, stage variables, and canary releases. Custom domains with base path mappings"],
        ["ECR", "Immutable tags, like the commit SHA. Lifecycle policies remove images by age or count"],
        ["ECS", "Each change makes a new task definition revision. Rolling updates use minimum and maximum percent, and the circuit breaker rolls back. Fargate needs awsvpc networking and task-level CPU and memory"],
        ["EKS", "A Deployment manifest with RollingUpdate maxSurge and maxUnavailable. Readiness controls traffic, liveness restarts containers"],
      ],
    },
    {
      title: "Troubleshooting",
      items: [
        ["502", "Lambda sent back a proxy response in the wrong shape"],
        ["504", "The backend took longer than the timeout, 29 seconds by default"],
        ["429", "Throttled. Back off and retry, or raise the quota"],
        ["X-Ray", "Annotations are indexed, metadata isn't. Turn on active tracing for Lambda, run the daemon on EC2 or ECS"],
        ["CloudWatch", "EMF for custom metrics, metric filters for log counts, Logs Insights for queries, the agent for memory"],
        ["CloudTrail", "Shows who called which API, and when"],
        ["CloudWatch investigations", "Generative AI that suggests root causes from an alarm, metric, or Logs Insights query"],
        ["Connections", "Create clients outside the handler. RDS Proxy pools database connections"],
      ],
    },
    {
      title: "AI in your app (Amazon Bedrock)",
      items: [
        ["Converse", "One message format for every model. Needs bedrock:InvokeModel"],
        ["ConverseStream", "Sends the text in pieces as it's generated. Needs bedrock:InvokeModelWithResponseStream"],
        ["inferenceConfig", "maxTokens, temperature, topP, stopSequences"],
        ["stopReason", "end_turn means it finished. max_tokens means it was cut off, so raise maxTokens"],
        ["Errors", "On 429 ThrottlingException or 5xx, back off with jitter and retry. On 400 or 403, fix the request instead of retrying"],
        ["Cost", "You pay per input and output token. Read the usage field and cap maxTokens"],
        ["Privacy", "Your inputs and outputs aren't used to train base models. Use a PrivateLink interface endpoint for private access"],
        ["Logs", "Invocation logging is off until you turn it on, and it stores full prompts. Encrypt it, restrict access, and mask sensitive data"],
        ["Guardrails", "Content filters (including prompt attacks), denied topics, word filters, and sensitive info masking or blocking. ApplyGuardrail checks text on its own"],
        ["Agents", "Authorize every tool call, keep sessions apart (AgentCore Runtime), and get a person's approval for sensitive actions"],
      ],
    },
    {
      title: "AI-assisted development",
      items: [
        ["Spec-driven", "Write requirements.md, then design.md, then tasks.md, then implement (Kiro specs)"],
        ["Steering files", "Project rules the agent always follows, kept in .kiro/steering/"],
        ["Agent hooks", "Run a command or an agent prompt when something happens, like saving a file"],
        ["Your job", "Review, test, and security-scan generated code. Keep secrets and customer data out of prompts"],
        ["Testing", "Generate tests, find gaps in coverage, and add regression tests. Check each assertion against the requirements"],
        ["CI/CD", "AI checks and summaries can run as pipeline steps. People still approve production releases"],
      ],
    },
  ],

  boss: { name: "The Throttling Kraken", emoji: "🦑" },
  matchLabel: "AWS services",
  levelTitles: [
    "Hello-World Hatchling",
    "CLI Cadet",
    "SDK Scripter",
    "Lambda Launcher",
    "Queue Wrangler",
    "Partition Planner",
    "Prompt Plumber",
    "Pipeline Pilot",
    "Trace Tracker",
    "Certified Developer",
  ],
});
