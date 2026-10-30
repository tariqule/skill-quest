import { defineCourse } from "@/engine/define";
import d1 from "./domains/d1-development";
import d2 from "./domains/d2-security";
import d3 from "./domains/d3-deployment";
import d4 from "./domains/d4-troubleshooting";

/**
 * AWS Certified Developer – Associate (DVA-C02).
 * Content follows the official exam guide v2.1 (December 12, 2024).
 * AWS has announced that DVA-C02 can be taken until November 30, 2026; DVA-C03 replaces it from December 1, 2026.
 * Domain content lives in ./domains; this file holds course-wide metadata.
 */
export default defineCourse({
  id: "aws-dva-c02",
  provider: { id: "aws", name: "AWS", color: "#f59e0b", icon: "☁️" },
  code: "DVA-C02",
  title: "AWS Certified Developer – Associate",
  shortTitle: "Developer Associate",
  tagline: "Learn to build, secure, deploy, and fix cloud apps with Lambda, DynamoDB, API Gateway, and the AWS developer tools.",
  level: "Associate",
  lifecycle: { retires: "2026-11-30", successor: "aws-dva-c03" },
  storageKey: "course:aws-dva-c02:v1",

  domains: [d1, d2, d3, d4],

  exam: {
    questions: 65,
    unscored: 15,
    minutes: 130,
    scale: { min: 100, max: 1000, pass: 720 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "One right answer and three wrong ones." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "Two or more right answers out of five or more options. You need all of them right to score." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Not on the real DVA-C02 exam. Used here to drill sequences such as deployment hooks.", practiceOnly: true },
      { id: "match", icon: "🔗", name: "Matching", rule: "Not on the real DVA-C02 exam. Used here to drill service-to-use-case pairs.", practiceOnly: true },
    ],
  },

  guide: {
    source: {
      label: "AWS DVA-C02 exam guide",
      version: "2.1",
      date: "December 2024",
      url: "https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02.html",
    },
    facts: [
      { icon: "📝", value: "65", label: "questions", detail: "50 count toward your score. The other 15 are unscored trial questions, and you can't tell which ones they are." },
      { icon: "⏱️", value: "130", label: "minutes", detail: "That's just over 2 minutes a question. Scenario questions are long, so read the last line first to see what's being asked." },
      { icon: "🎯", value: "720", label: "to pass", detail: "Scores run from 100 to 1,000. You pass on your overall score, so a weak domain can be made up by a strong one." },
      { icon: "🎲", value: "0", label: "guess penalty", detail: "A blank answer counts as wrong, and a wrong guess costs nothing extra. Always pick something." },
      { icon: "💵", value: "$150", label: "USD", detail: "You can sit it at a Pearson VUE test center or online with a proctor watching. Some locations add extra fees." },
      { icon: "📅", value: "3", label: "years valid", detail: "After that, you recertify to keep it." },
      { icon: "🔄", value: "Nov 30", label: "2026: last DVA-C02 day", detail: "AWS has announced DVA-C03 from December 1, 2026. Most DVA-C02 content carries over, but check the new guide if you sit the exam after that." },
    ],
    candidate: {
      is: [
        "A developer with at least a year of hands-on experience building and looking after apps on AWS",
        "Comfortable in at least one high-level programming language",
        "Builds and secures apps with AWS service APIs, the AWS CLI, and the SDKs",
        "Uses a CI/CD pipeline to deploy apps on AWS",
        "Understands how an app is managed from first build to retirement, and how to write code for the cloud",
      ],
      isNot: [
        "Designing architectures, such as distributed systems, microservices, or database schemas",
        "Designing and building CI/CD pipelines",
        "Managing IAM users and groups",
        "Managing servers and operating systems",
        "Designing AWS networks, such as VPCs or Direct Connect",
      ],
    },
    scope: {
      label: "In-scope AWS services",
      groups: [
        { category: "Analytics", icon: "📊", services: ["Amazon Athena", "Amazon Kinesis", "Amazon OpenSearch Service"] },
        {
          category: "Application integration",
          icon: "🔀",
          services: ["AWS AppSync", "Amazon EventBridge", "Amazon SNS", "Amazon SQS", "AWS Step Functions"],
        },
        { category: "Compute", icon: "🖥️", services: ["Amazon EC2", "AWS Elastic Beanstalk", "AWS Lambda"] },
        { category: "Containers", icon: "🐳", services: ["Amazon ECR", "Amazon ECS", "Amazon EKS"] },
        { category: "Database", icon: "🗄️", services: ["Amazon Aurora", "Amazon DynamoDB", "Amazon ElastiCache", "Amazon RDS"] },
        {
          category: "Developer tools",
          icon: "🛠️",
          services: ["AWS Amplify", "AWS CloudShell", "AWS CodeArtifact", "AWS CodeBuild", "AWS CodeDeploy", "AWS CodePipeline", "AWS X-Ray", "Amazon Q Developer"],
        },
        {
          category: "Management & governance",
          icon: "🧭",
          services: ["AWS AppConfig", "AWS CDK", "AWS CloudFormation", "AWS CloudTrail", "Amazon CloudWatch", "AWS CLI", "AWS Systems Manager"],
        },
        {
          category: "Networking & content delivery",
          icon: "🌐",
          services: ["Amazon API Gateway", "Amazon CloudFront", "Elastic Load Balancing", "Amazon Route 53", "Amazon VPC"],
        },
        {
          category: "Security, identity & compliance",
          icon: "🔐",
          services: ["Amazon Cognito", "AWS IAM", "AWS KMS", "AWS Secrets Manager", "AWS STS", "AWS WAF"],
        },
        { category: "Storage", icon: "🪣", services: ["Amazon EBS", "Amazon EFS", "Amazon S3"] },
      ],
    },
    tips: [
      { icon: "🔎", tip: "Look for the requirement words, like LEAST operational overhead, MOST cost-effective, or LEAST code changes. When two answers both work, these words decide." },
      { icon: "🧮", tip: "Expect some arithmetic: DynamoDB read and write capacity units, Lambda concurrency (requests per second times duration), and SQS visibility timeouts. Round item sizes up before you start." },
      { icon: "🏷️", tip: "When a question says \"serverless\" or \"no servers to manage\", it usually wants Lambda, API Gateway, DynamoDB, SQS, SNS, EventBridge, or Step Functions." },
      { icon: "🔐", tip: "Never pick an answer that writes access keys or secrets into the code. Use roles to reach AWS, and Secrets Manager or Parameter Store to hold secrets." },
      { icon: "⛔", tip: "In IAM questions, look for an explicit Deny first. It beats every Allow. If nothing allows the action, it's denied too." },
      { icon: "🚩", tip: "Flag long scenario questions and come back to them. 130 minutes is plenty if you don't get stuck." },
      { icon: "🎲", tip: "Never leave a question blank. Guessing costs you nothing." },
    ],
    officialPractice: {
      label: "AWS Skill Builder exam prep",
      url: "https://skillbuilder.aws/exam-prep",
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
      ],
    },
    {
      title: "Deployment",
      items: [
        ["CloudFormation", "Resources is the only required section. Preview with change sets, share values with Export and ImportValue, roll back on failure"],
        ["SAM", "Add Transform: AWS::Serverless-2016-10-31. Then use sam build, sam local invoke, and sam deploy"],
        ["Lambda traffic shifting", "An alias plus CodeDeploy, with Canary10Percent5Minutes, Linear10PercentEvery1Minute, or AllAtOnce"],
        ["Beanstalk", "All at once, rolling, rolling with an extra batch, immutable, traffic splitting, or blue/green with a URL swap"],
        ["CodeDeploy EC2 hooks", "In order: ApplicationStop, BeforeInstall, AfterInstall, ApplicationStart, ValidateService"],
        ["buildspec.yml", "In order: install, pre_build, build, post_build"],
        ["API Gateway", "Stages, stage variables, and canary releases. Custom domains with base path mappings"],
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
    "Token Tamer",
    "Pipeline Pilot",
    "Trace Tracker",
    "Certified Developer",
  ],
});
