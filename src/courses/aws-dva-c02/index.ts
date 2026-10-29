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
  tagline: "Build, secure, deploy, and debug cloud applications with Lambda, DynamoDB, API Gateway, and AWS developer tools.",
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
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "1 correct answer and 3 distractors." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "2 or more correct out of 5 or more options. You need all of them right to score." },
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
      { icon: "📝", value: "65", label: "questions", detail: "50 count toward your score. 15 are unscored trial questions, and you can't tell which." },
      { icon: "⏱️", value: "130", label: "minutes", detail: "Just over 2 minutes per question. Scenario questions are long, so read the last line first." },
      { icon: "🎯", value: "720", label: "to pass", detail: "Scaled score from 100 to 1000. Scoring is compensatory: you pass on the overall score, not per domain." },
      { icon: "🎲", value: "0", label: "guess penalty", detail: "Unanswered questions count as wrong. Always pick something." },
      { icon: "💵", value: "$150", label: "USD", detail: "Take it at a Pearson VUE test center or online with a proctor. Extra fees may apply in some locations." },
      { icon: "📅", value: "3", label: "years valid", detail: "Then recertify." },
      { icon: "🔄", value: "Nov 30", label: "2026: last DVA-C02 day", detail: "AWS has announced DVA-C03 from December 1, 2026. Most DVA-C02 content carries over; check the new guide if you sit the exam later." },
    ],
    candidate: {
      is: [
        "A developer with 1 or more years of hands-on experience building and maintaining applications on AWS",
        "Proficient in at least one high-level programming language",
        "Develops and secures applications with AWS service APIs, the AWS CLI, and SDKs",
        "Uses a CI/CD pipeline to deploy applications on AWS",
        "Understands application lifecycle management and cloud-focused application code",
      ],
      isNot: [
        "Designing architectures (distributed systems, microservices, database schemas)",
        "Designing and creating CI/CD pipelines",
        "Administering IAM users and groups",
        "Administering servers and operating systems",
        "Designing AWS networking infrastructure (VPC, Direct Connect)",
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
      { icon: "🔎", tip: "Underline the requirement words: LEAST operational overhead, MOST cost-effective, LEAST code changes. They decide between two working answers." },
      { icon: "🧮", tip: "Expect arithmetic: DynamoDB RCU/WCU, Lambda concurrency (requests/s × duration), SQS visibility timeouts. Round item sizes up first." },
      { icon: "🏷️", tip: "\"Serverless\" or \"no servers to manage\" usually points to Lambda, API Gateway, DynamoDB, SQS, SNS, EventBridge, or Step Functions." },
      { icon: "🔐", tip: "Never pick an answer that hard-codes access keys or secrets. Roles for AWS access; Secrets Manager or Parameter Store for secrets." },
      { icon: "⛔", tip: "IAM questions: look for an explicit Deny first. It beats every Allow, and no Allow at all means denied." },
      { icon: "🚩", tip: "Flag long scenario questions and come back. 130 minutes is enough if you don't get stuck." },
      { icon: "🎲", tip: "Never leave a blank. There is no penalty for guessing." },
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
        ["Timeout", "Default 3 s, maximum 900 s (15 minutes)"],
        ["Memory", "128 MB – 10,240 MB; CPU scales with memory"],
        ["Package", ".zip: 50 MB zipped direct upload, 250 MB unzipped with layers · container image: 10 GB"],
        ["Layers", "Up to 5 per function"],
        ["Concurrency", "Default 1,000 per Region (raisable) · reserved = guarantee + cap · provisioned = no cold starts"],
        ["Async errors", "2 retries, then on-failure destination or DLQ"],
        ["VPC", "No public IP: NAT gateway for internet, VPC endpoints for AWS services"],
      ],
    },
    {
      title: "Messaging",
      items: [
        ["SQS visibility timeout", "Default 30 s, max 12 h. Longer than processing time (≥ 6× function timeout for Lambda)"],
        ["SQS long polling", "WaitTimeSeconds up to 20 s"],
        ["SQS retention", "Default 4 days, 1 minute to 14 days"],
        ["FIFO", "Order per message group ID; deduplication within 5 minutes"],
        ["DLQ", "Redrive policy with maxReceiveCount; same queue type as the source"],
        ["SNS", "Fanout to many subscribers; subscription filter policies"],
        ["EventBridge", "Content-based rules, schedules, archive and replay"],
        ["Kinesis Data Streams", "Partition key → shard; ordered per shard; enhanced fan-out per consumer"],
      ],
    },
    {
      title: "DynamoDB",
      items: [
        ["RCU", "1 strongly consistent read/s ≤ 4 KB · eventual = ½ · transactional = 2×"],
        ["WCU", "1 write/s ≤ 1 KB · transactional = 2×"],
        ["Partition key", "High cardinality to avoid hot partitions"],
        ["LSI", "Same partition key, new sort key, at table creation, strong reads allowed"],
        ["GSI", "Any keys, add any time, eventually consistent only"],
        ["Query vs Scan", "Query needs the partition key; Scan reads everything; 1 MB per page"],
        ["Optimistic locking", "Conditional write on a version attribute"],
        ["TTL · Streams · DAX", "Free expiry · change feed for Lambda · microsecond cache"],
      ],
    },
    {
      title: "Security",
      items: [
        ["Policy evaluation", "Explicit deny → allow → implicit deny"],
        ["Cross-account", "Role in the target account + trust policy + sts:AssumeRole"],
        ["Cognito", "User pool = sign-in and JWTs · identity pool = temporary AWS credentials"],
        ["API authorizers", "Cognito (user pool JWT) · Lambda (custom) · IAM (SigV4)"],
        ["KMS", "Encrypt ≤ 4 KB; larger data → GenerateDataKey (envelope encryption)"],
        ["S3 encryption", "SSE-S3 (default) · SSE-KMS (+ Bucket Keys) · SSE-C · client-side"],
        ["Secrets", "Secrets Manager = rotation · Parameter Store = cheap hierarchical config"],
      ],
    },
    {
      title: "Deployment",
      items: [
        ["CloudFormation", "Resources required · change sets · Export/ImportValue · rollback on failure"],
        ["SAM", "Transform: AWS::Serverless-2016-10-31 · sam build / local invoke / deploy"],
        ["Lambda traffic shifting", "Alias + CodeDeploy: Canary10Percent5Minutes, Linear10PercentEvery1Minute, AllAtOnce"],
        ["Beanstalk", "All at once · rolling · rolling + batch · immutable · traffic splitting · blue/green URL swap"],
        ["CodeDeploy EC2 hooks", "ApplicationStop → BeforeInstall → AfterInstall → ApplicationStart → ValidateService"],
        ["buildspec.yml", "install → pre_build → build → post_build"],
        ["API Gateway", "Stages + stage variables + canary; custom domains with base path mappings"],
      ],
    },
    {
      title: "Troubleshooting",
      items: [
        ["502", "Malformed Lambda proxy response"],
        ["504", "Integration timeout (29 s by default)"],
        ["429", "Throttled: back off, raise quotas"],
        ["X-Ray", "Annotations indexed · metadata not · active tracing for Lambda · daemon on EC2/ECS"],
        ["CloudWatch", "EMF for custom metrics · metric filters · Logs Insights · agent for memory"],
        ["CloudTrail", "Who called which API"],
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
