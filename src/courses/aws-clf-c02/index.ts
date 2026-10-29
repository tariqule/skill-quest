import { defineCourse } from "@/engine/define";
import d1 from "./domains/d1-cloud-concepts";
import d2 from "./domains/d2-security-compliance";
import d3 from "./domains/d3-technology-services";
import d4 from "./domains/d4-billing-support";

/**
 * AWS Certified Cloud Practitioner (CLF-C02).
 * Content follows the official CLF-C02 exam guide v1.3 (October 29, 2026).
 * No successor exam version has been announced, so no lifecycle dates are set.
 * Domain content lives in ./domains; this file holds course-wide metadata.
 */
export default defineCourse({
  id: "aws-clf-c02",
  provider: { id: "aws", name: "AWS", color: "#f59e0b", icon: "☁️" },
  code: "CLF-C02",
  title: "AWS Certified Cloud Practitioner",
  shortTitle: "Cloud Practitioner",
  tagline: "The AWS Cloud from the ground up: value and economics, shared responsibility and security, core services, and billing and support.",
  level: "Foundational",
  storageKey: "course:aws-clf-c02:v1",

  domains: [d1, d2, d3, d4],

  exam: {
    questions: 65,
    unscored: 15,
    minutes: 90,
    scale: { min: 100, max: 1000, pass: 700 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "1 correct answer and 3 distractors." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "2 or more correct out of 5 or more options. You need all of them right to score." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Not on the real CLF-C02 exam. Used here to drill sequences such as migration phases.", practiceOnly: true },
      { id: "match", icon: "🔗", name: "Matching", rule: "Not on the real CLF-C02 exam. Used here to drill service-to-use-case pairs.", practiceOnly: true },
    ],
  },

  guide: {
    source: {
      label: "AWS CLF-C02 exam guide",
      version: "1.3",
      date: "October 29, 2026",
      url: "https://docs.aws.amazon.com/aws-certification/latest/cloud-practitioner-02/cloud-practitioner-02.html",
    },
    facts: [
      { icon: "📝", value: "65", label: "questions", detail: "50 count toward your score. 15 are unscored trial questions, and you can't tell which. Multiple choice and multiple response only." },
      { icon: "⏱️", value: "90", label: "minutes", detail: "About 80 seconds per question. Most questions are short scenarios." },
      { icon: "🎯", value: "700", label: "to pass", detail: "Scaled score from 100 to 1,000. Scoring is compensatory: you pass on the overall score, not per domain." },
      { icon: "🎲", value: "0", label: "guess penalty", detail: "Unanswered questions count as wrong. Always pick something." },
      { icon: "💵", value: "$100", label: "USD", detail: "Take it at a Pearson VUE test center or online with a proctor. See AWS exam pricing for other currencies." },
      { icon: "📅", value: "3", label: "years valid", detail: "Recertify by passing the latest Cloud Practitioner exam, or an Associate or Professional exam." },
      { icon: "🛟", value: "New", label: "Support plans", detail: "Guide v1.3 covers Basic, Business Support+, Enterprise Support, and Unified Operations. Developer and classic Business Support end January 1, 2027." },
      { icon: "🌐", value: "12", label: "languages", detail: "The Italian and German versions of the exam are retired after December 31, 2026." },
    ],
    candidate: {
      is: [
        "Someone with up to 6 months of exposure to AWS Cloud design, implementation, or operations",
        "Early in an AWS Cloud career, or working with people in AWS Cloud roles (sales, finance, project management)",
        "Able to explain the value of the AWS Cloud, the shared responsibility model, and the Well-Architected Framework",
        "Able to describe core AWS services and pick the right one for common use cases",
        "Familiar with AWS costs, economics, and billing practices",
      ],
      isNot: ["Coding", "Designing cloud architecture", "Troubleshooting", "Implementation", "Load and performance testing"],
    },
    scope: {
      label: "In-scope AWS services",
      groups: [
        { category: "Analytics", icon: "📊", services: ["Amazon Athena", "Amazon EMR", "AWS Glue", "Amazon Kinesis", "Amazon OpenSearch Service", "Amazon Quick", "Amazon Redshift"] },
        { category: "Application integration", icon: "🔀", services: ["Amazon EventBridge", "Amazon SNS", "Amazon SQS", "AWS Step Functions"] },
        { category: "Business applications", icon: "💼", services: ["Amazon Connect", "Amazon SES"] },
        { category: "Cloud financial management", icon: "💰", services: ["AWS Budgets", "AWS Cost and Usage Reports", "AWS Cost Explorer", "AWS Marketplace"] },
        { category: "Compute", icon: "🖥️", services: ["AWS Batch", "Amazon EC2", "AWS Elastic Beanstalk", "Amazon Lightsail", "AWS Outposts"] },
        { category: "Containers", icon: "🐳", services: ["Amazon ECR", "Amazon ECS", "Amazon EKS"] },
        { category: "Customer enablement", icon: "🛟", services: ["AWS Support"] },
        { category: "Database", icon: "🗄️", services: ["Amazon Aurora", "Amazon DocumentDB", "Amazon DynamoDB", "Amazon ElastiCache", "Amazon Neptune", "Amazon RDS"] },
        { category: "Developer tools", icon: "🛠️", services: ["AWS CLI", "AWS CodeBuild", "AWS CodePipeline", "AWS X-Ray"] },
        { category: "End-user computing", icon: "🖥️", services: ["Amazon AppStream 2.0", "Amazon WorkSpaces", "Amazon WorkSpaces Secure Browser"] },
        { category: "Frontend web and mobile", icon: "📱", services: ["AWS Amplify"] },
        { category: "Internet of Things", icon: "📡", services: ["AWS IoT Core"] },
        {
          category: "Machine learning",
          icon: "🤖",
          services: ["Amazon Comprehend", "Amazon Lex", "Amazon Polly", "Amazon Q", "Amazon Rekognition", "Amazon SageMaker AI", "Amazon Textract", "Amazon Transcribe", "Amazon Translate"],
        },
        {
          category: "Management and governance",
          icon: "🧭",
          services: [
            "AWS Auto Scaling",
            "AWS CloudFormation",
            "AWS CloudTrail",
            "Amazon CloudWatch",
            "AWS Compute Optimizer",
            "AWS Config",
            "AWS Control Tower",
            "AWS Health Dashboard",
            "AWS License Manager",
            "AWS Management Console",
            "AWS Organizations",
            "AWS Service Catalog",
            "Service Quotas",
            "AWS Systems Manager",
            "AWS Trusted Advisor",
            "AWS Well-Architected Tool",
          ],
        },
        {
          category: "Migration and transfer",
          icon: "🚚",
          services: ["AWS Application Discovery Service", "AWS Application Migration Service", "AWS DMS", "Migration Evaluator", "AWS Migration Hub", "AWS Schema Conversion Tool"],
        },
        {
          category: "Networking and content delivery",
          icon: "🌐",
          services: ["Amazon API Gateway", "Amazon CloudFront", "AWS Direct Connect", "AWS Global Accelerator", "AWS PrivateLink", "Amazon Route 53", "AWS Transit Gateway", "Amazon VPC", "AWS VPN", "AWS Site-to-Site VPN", "AWS Client VPN"],
        },
        {
          category: "Security, identity, and compliance",
          icon: "🔐",
          services: [
            "AWS Artifact",
            "AWS Certificate Manager",
            "AWS CloudHSM",
            "Amazon Cognito",
            "Amazon Detective",
            "AWS Directory Service",
            "AWS Firewall Manager",
            "Amazon GuardDuty",
            "AWS IAM",
            "AWS IAM Identity Center",
            "Amazon Inspector",
            "AWS KMS",
            "Amazon Macie",
            "AWS Resource Access Manager",
            "AWS Secrets Manager",
            "AWS Security Hub",
            "AWS Shield",
            "AWS WAF",
          ],
        },
        { category: "Serverless", icon: "λ", services: ["AWS Fargate", "AWS Lambda"] },
        {
          category: "Storage",
          icon: "🪣",
          services: ["AWS Backup", "Amazon EBS", "Amazon EFS", "AWS Elastic Disaster Recovery", "Amazon FSx", "Amazon S3", "Amazon S3 Glacier", "AWS Storage Gateway"],
        },
      ],
    },
    tips: [
      { icon: "🔎", tip: "Underline the requirement words: LEAST operational overhead, MOST cost-effective, LOWEST cost. They decide between two plausible answers." },
      { icon: "🛡️", tip: "Shared responsibility: if you configure it (data, IAM, security groups, guest OS), it's yours. If you can't touch it, it's AWS's." },
      { icon: "🏷️", tip: "\"Managed\" or \"serverless\" usually beats \"install it on EC2\" when the question asks for less operational effort." },
      { icon: "💸", tip: "Pricing questions turn on two facts: can the workload be interrupted, and is usage steady for 1 to 3 years?" },
      { icon: "✂️", tip: "Eliminate the two clearly wrong answers first, then compare the remaining two against the requirement words." },
      { icon: "🚩", tip: "Flag hard questions and move on. Come back with the time you saved." },
      { icon: "🎲", tip: "Never leave a blank. There is no penalty for guessing." },
    ],
    officialPractice: {
      label: "AWS Skill Builder exam prep plan (official practice question set and practice exam)",
      url: "https://skillbuilder.aws/category/exam-prep/cloud-practitioner-foundational-CLF-C02",
    },
  },

  cheatsheet: [
    {
      title: "Cloud concepts",
      items: [
        ["Six benefits", "Variable expense · economies of scale · stop guessing capacity · speed and agility · no data centers to run · go global in minutes"],
        ["Elasticity vs high availability", "Capacity follows demand · keeps running when parts fail (multiple AZs)"],
        ["Well-Architected pillars", "Operational excellence, security, reliability, performance efficiency, cost optimization, sustainability"],
        ["AWS CAF perspectives", "Business, People, Governance (business) · Platform, Security, Operations (technical)"],
        ["7 Rs", "Retire, retain, rehost, relocate, repurchase, replatform, refactor"],
        ["Migration tools", "DMS moves data · SCT converts schemas · Application Migration Service rehosts servers"],
      ],
    },
    {
      title: "Security and compliance",
      items: [
        ["Shared responsibility", "AWS: security OF the cloud · You: security IN the cloud"],
        ["Shifts by service", "EC2: you patch the OS · RDS: AWS patches OS and engine · Lambda: AWS runs OS and runtime"],
        ["Root user", "MFA on, no access keys, only for root tasks (close account, change account settings)"],
        ["IAM", "Users, groups, roles (temporary), policies. Least privilege. Explicit deny wins."],
        ["Sign-in", "Identity Center: workforce SSO · Cognito: app customers · federation: existing IdP"],
        ["Watchers", "CloudWatch: metrics and alarms · CloudTrail: API calls · Config: configuration compliance"],
        ["Threat services", "GuardDuty: threats · Inspector: vulnerabilities · Macie: PII in S3 · Detective: investigate · Security Hub: one view"],
        ["Edge defense", "Shield: DDoS · WAF: web exploits · Firewall Manager: rules across accounts"],
        ["Compliance and keys", "Artifact: reports and agreements · KMS: keys · ACM: TLS certificates · CloudHSM: dedicated HSMs"],
      ],
    },
    {
      title: "Technology and services",
      items: [
        ["Global infrastructure", "Region > Availability Zone > data center · edge locations for CloudFront"],
        ["Compute", "EC2 · Lambda (functions) · Fargate (serverless containers) · ECS · EKS (Kubernetes) · Beanstalk · Lightsail"],
        ["Databases", "RDS / Aurora relational · DynamoDB key-value · ElastiCache in-memory · DocumentDB · Neptune graph · Redshift warehouse"],
        ["Networking", "VPC, subnets, IGW, NAT · security group (stateful) vs NACL (stateless) · Route 53 DNS · Direct Connect vs VPN"],
        ["Storage", "S3 objects · EBS blocks · instance store (temporary) · EFS Linux files · FSx · Storage Gateway hybrid · AWS Backup"],
        ["S3 classes", "Standard → Intelligent-Tiering → Standard-IA → Glacier Instant → Glacier Flexible → Glacier Deep Archive"],
        ["Analytics", "Athena SQL on S3 · Kinesis streaming · Glue ETL · Quick BI · Redshift · EMR"],
        ["Messaging", "SQS queue (decouple) · SNS pub/sub (notify) · EventBridge (events and rules)"],
      ],
    },
    {
      title: "Billing, pricing, and support",
      items: [
        ["On-Demand", "No commitment. Short, spiky, or unpredictable workloads."],
        ["Savings Plans / RIs", "1 or 3 years for steady usage. Savings Plans commit to $/hour; RIs to a configuration."],
        ["Spot", "Up to 90% off. Interruptible with a 2-minute warning."],
        ["Dedicated Hosts", "Whole physical server, for per-core or per-socket licenses (BYOL)"],
        ["Data transfer", "In from the internet: free · out to the internet and between Regions: charged"],
        ["Cost tools", "Pricing Calculator (estimate) · Budgets (alert) · Cost Explorer (analyze) · CUR (line items)"],
        ["Organizations", "Consolidated billing, volume discounts, shared RI and Savings Plans discounts, SCPs"],
        ["Support plans", "Basic → Business Support+ (24/7 engineers) → Enterprise (TAM, 15 min) → Unified Operations (team, ~5 min)"],
        ["Help", "re:Post, Knowledge Center, Prescriptive Guidance, Health Dashboard, Trusted Advisor, Trust and Safety, Partners, Marketplace"],
      ],
    },
  ],

  boss: { name: "The Runaway Bill", emoji: "💸" },
  matchLabel: "AWS services",
  levelTitles: [
    "Cloud Curious",
    "Region Rookie",
    "AZ Adventurer",
    "Instance Initiate",
    "Bucket Builder",
    "IAM Guardian",
    "VPC Voyager",
    "Savings Strategist",
    "Cloud Practitioner",
    "Sky Architect",
  ],
});
