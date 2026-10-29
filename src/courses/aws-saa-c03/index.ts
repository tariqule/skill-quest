import { defineCourse } from "@/engine/define";
import d1 from "./domains/d1-secure";
import d2 from "./domains/d2-resilient";
import d3 from "./domains/d3-performance";
import d4 from "./domains/d4-cost";

/**
 * AWS Certified Solutions Architect – Associate (SAA-C03).
 * Content follows the official SAA-C03 exam guide, version 1.1 (published October 29, 2026).
 * No successor version has been announced. Domain content lives in ./domains; this file holds course-wide metadata.
 */
export default defineCourse({
  id: "aws-saa-c03",
  provider: { id: "aws", name: "AWS", color: "#f59e0b", icon: "☁️" },
  code: "SAA-C03",
  title: "AWS Certified Solutions Architect – Associate",
  shortTitle: "Solutions Architect Associate",
  tagline: "Design secure, resilient, high-performing, and cost-optimized architectures: VPCs, IAM, multi-AZ and multi-Region designs, storage and databases, decoupling, disaster recovery, and cost.",
  level: "Associate",
  storageKey: "course:aws-saa-c03:v1",

  domains: [d1, d2, d3, d4],

  exam: {
    questions: 65,
    unscored: 15,
    minutes: 130,
    scale: { min: 100, max: 1000, pass: 720 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "1 correct answer and 3 distractors." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "2 or more correct out of 5 or more options. You need all of them right to score." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Not on the real SAA-C03 exam. Used here to drill sequences such as DR strategies and data pipelines.", practiceOnly: true },
      { id: "match", icon: "🔗", name: "Matching", rule: "Not on the real SAA-C03 exam. Used here to drill requirement-to-service pairs.", practiceOnly: true },
    ],
  },

  guide: {
    source: {
      label: "AWS SAA-C03 exam guide",
      version: "1.1",
      date: "October 29, 2026",
      url: "https://docs.aws.amazon.com/aws-certification/latest/solutions-architect-associate-03/solutions-architect-associate-03.html",
    },
    facts: [
      { icon: "📝", value: "65", label: "questions", detail: "50 count toward your score. 15 are unscored trial questions, and you can't tell which. Multiple choice and multiple response only." },
      { icon: "⏱️", value: "130", label: "minutes", detail: "Two minutes per question. Scenario questions are long: read the final sentence first to find the actual requirement." },
      { icon: "🎯", value: "720", label: "to pass", detail: "Scaled score from 100 to 1,000. Scoring is compensatory: you pass on the overall score, not per domain." },
      { icon: "🎲", value: "0", label: "guess penalty", detail: "Unanswered questions count as wrong. Always pick something." },
      { icon: "💵", value: "$150", label: "USD", detail: "Take it at a Pearson VUE test center or online with a proctor. See AWS exam pricing for other currencies." },
      { icon: "📅", value: "3", label: "years valid", detail: "Recertify by passing the latest version of this exam, or by earning the Solutions Architect – Professional." },
      { icon: "🏷️", value: "Short", label: "service names", detail: "The exam uses short names such as Amazon SNS. The in-exam Help button lists the full names." },
      { icon: "🗓️", value: "v1.1", label: "current guide", detail: "SAA-C03 is the current version; no successor has been announced. The Italian-language exam is retired after December 31, 2026." },
    ],
    candidate: {
      is: [
        "Someone in a solutions architect role who designs solutions based on the AWS Well-Architected Framework",
        "At least 1 year of hands-on experience designing cloud solutions that use AWS services",
        "Able to design solutions that meet current business requirements and projected future needs",
        "Able to design architectures that are secure, resilient, high-performing, and cost-optimized",
        "Able to review existing solutions and recommend improvements",
      ],
      isNot: [
        "New to IT: AWS suggests earning AWS Certified Cloud Practitioner first",
        "Tested on developer tooling: CodeBuild, CodeDeploy, CodeCommit, CodeArtifact, CDK, CloudShell, and the SDKs are out of scope",
        "Tested on IoT services, Lightsail, Amazon MWAA, AWS Cloud Map, GameLift, Braket, Ground Station, or the Elemental media services",
        "Tested on ML frameworks and accelerators such as Deep Learning AMIs, Deep Learning Containers, Inferentia, or Personalize",
      ],
    },
    scope: {
      label: "In-scope AWS services",
      groups: [
        { category: "Analytics", icon: "📊", services: ["Amazon Athena", "AWS Data Exchange", "AWS Data Pipeline", "Amazon EMR", "AWS Glue", "Amazon Kinesis", "AWS Lake Formation", "Amazon MSK", "Amazon OpenSearch Service", "Amazon Quick", "Amazon Redshift"] },
        { category: "Application integration", icon: "🔀", services: ["Amazon AppFlow", "Amazon EventBridge", "Amazon MQ", "Amazon SNS", "Amazon SQS", "AWS Step Functions"] },
        { category: "Cost management", icon: "💰", services: ["AWS Budgets", "AWS Cost and Usage Report", "AWS Cost Explorer", "Savings Plans"] },
        { category: "Compute", icon: "🖥️", services: ["AWS Batch", "Amazon EC2", "Amazon EC2 Auto Scaling", "AWS Elastic Beanstalk", "AWS Outposts", "AWS Serverless Application Repository", "VMware Cloud on AWS", "AWS Wavelength"] },
        { category: "Containers", icon: "🐳", services: ["Amazon ECR", "Amazon ECS", "Amazon ECS Anywhere", "Amazon EKS", "Amazon EKS Anywhere", "Amazon EKS Distro"] },
        { category: "Database", icon: "🗄️", services: ["Amazon Aurora", "Amazon Aurora Serverless", "Amazon DocumentDB", "Amazon DynamoDB", "Amazon ElastiCache", "Amazon Keyspaces", "Amazon Neptune", "Amazon RDS", "Amazon Redshift"] },
        { category: "Developer tools", icon: "🛠️", services: ["AWS X-Ray"] },
        { category: "Front-end web & mobile", icon: "📱", services: ["AWS Amplify", "Amazon API Gateway", "AWS Device Farm"] },
        { category: "Machine learning", icon: "🤖", services: ["Amazon Comprehend", "Amazon Lex", "Amazon Polly", "Amazon Rekognition", "Amazon SageMaker AI", "Amazon Textract", "Amazon Transcribe", "Amazon Translate"] },
        {
          category: "Management & governance",
          icon: "🧭",
          services: [
            "AWS Auto Scaling",
            "AWS CLI",
            "AWS CloudFormation",
            "AWS CloudTrail",
            "Amazon CloudWatch",
            "AWS Compute Optimizer",
            "AWS Config",
            "AWS Control Tower",
            "AWS Health Dashboard",
            "AWS License Manager",
            "Amazon Managed Grafana",
            "Amazon Managed Service for Prometheus",
            "AWS Management Console",
            "AWS Organizations",
            "AWS Proton",
            "AWS Service Catalog",
            "AWS Systems Manager",
            "AWS Well-Architected Tool",
          ],
        },
        { category: "Media services", icon: "🎬", services: ["Amazon Kinesis Video Streams"] },
        { category: "Migration & transfer", icon: "🚚", services: ["AWS Application Discovery Service", "AWS Application Migration Service", "AWS DataSync", "AWS DMS", "AWS Snow Family", "AWS Transfer Family"] },
        {
          category: "Networking & content delivery",
          icon: "🌐",
          services: ["AWS Client VPN", "Amazon CloudFront", "AWS Direct Connect", "Elastic Load Balancing", "AWS Global Accelerator", "AWS PrivateLink", "Amazon Route 53", "AWS Site-to-Site VPN", "AWS Transit Gateway", "Amazon VPC"],
        },
        {
          category: "Security, identity & compliance",
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
            "AWS IAM Identity Center",
            "Amazon Inspector",
            "AWS KMS",
            "Amazon Macie",
            "AWS Network Firewall",
            "AWS RAM",
            "AWS Secrets Manager",
            "AWS Security Hub",
            "AWS Shield",
            "AWS WAF",
            "IAM",
          ],
        },
        { category: "Serverless", icon: "λ", services: ["AWS Fargate", "AWS Lambda"] },
        { category: "Storage", icon: "🪣", services: ["AWS Backup", "Amazon EBS", "Amazon EFS", "Amazon FSx (all types)", "Amazon S3", "Amazon S3 Glacier", "AWS Storage Gateway"] },
      ],
    },
    tips: [
      { icon: "🔎", tip: "Underline the deciding words: MOST cost-effective, LEAST operational overhead, highly available, minimal changes. Several answers usually work; only one fits those words." },
      { icon: "🧱", tip: "Prefer managed and serverless answers when the question says \"least operational overhead\". Self-managed EC2 solutions rarely win those." },
      { icon: "🌍", tip: "\"Highly available\" means more than one AZ. \"Disaster recovery\" or \"Region failure\" means more than one Region." },
      { icon: "⏱️", tip: "DR questions: read the RPO and RTO first, rule out strategies that can't meet them, then pick the cheapest that's left." },
      { icon: "💸", tip: "Cost questions hinge on access patterns: how often data is read, how fast it must come back, and whether the workload can be interrupted." },
      { icon: "⛔", tip: "Never pick an answer that stores access keys on instances or in code. Roles for AWS access; Secrets Manager for secrets." },
      { icon: "🚩", tip: "Flag long questions and come back. 130 minutes for 65 questions is enough if you don't get stuck." },
      { icon: "🎲", tip: "Never leave a blank. There is no penalty for guessing." },
    ],
    officialPractice: {
      label: "AWS Skill Builder SAA-C03 exam prep (official practice question set and practice exam)",
      url: "https://skillbuilder.aws/category/exam-prep/solutions-architect-associate-SAA-C03",
    },
  },

  cheatsheet: [
    {
      title: "Security",
      items: [
        ["Policy evaluation", "Explicit deny → SCP / boundary limits → allow → implicit deny"],
        ["SCPs", "Cap member accounts (incl. root) · grant nothing · don't affect the management account"],
        ["Cross-account", "Role in target account trusts source · source allows sts:AssumeRole"],
        ["Workforce SSO", "IAM Identity Center + permission sets · app users → Cognito"],
        ["Security group vs NACL", "SG: stateful, allow-only, ENI · NACL: stateless, allow + deny, subnet, numbered"],
        ["Threats", "WAF = layer 7 (SQLi, XSS, rate) · Shield = DDoS · GuardDuty = detection · Macie = PII in S3 · Inspector = CVEs"],
        ["Encryption", "SSE-S3 default · SSE-KMS + Bucket Keys · CloudHSM = single-tenant · ACM = free TLS (us-east-1 for CloudFront)"],
        ["Retention", "Object Lock compliance mode = nobody can delete · Backup Vault Lock for backups"],
      ],
    },
    {
      title: "VPC and connectivity",
      items: [
        ["Public subnet", "Route 0.0.0.0/0 → internet gateway"],
        ["Private egress", "0.0.0.0/0 → NAT gateway in a public subnet · one per AZ for HA"],
        ["Endpoints", "Gateway: S3 + DynamoDB, free · Interface (PrivateLink): most services, hourly + GB"],
        ["Peering", "One-to-one · non-transitive · no overlapping CIDRs · no hourly fee"],
        ["Transit Gateway", "Hub for many VPCs + VPN + Direct Connect · transitive · per attachment + GB"],
        ["Hybrid", "VPN: quick, encrypted, internet · Direct Connect: dedicated, consistent, not encrypted by default"],
        ["Subnet IPs", "AWS reserves 5 per subnet · VPC /16 to /28"],
      ],
    },
    {
      title: "Resilience",
      items: [
        ["Decouple", "SQS buffer · SNS fanout · EventBridge routing · Step Functions orchestration · Amazon MQ for JMS/AMQP"],
        ["SQS FIFO", "Order per message group ID · deduplication"],
        ["ELB", "ALB = L7 path/host · NLB = L4, static IP, UDP · GWLB = appliances"],
        ["Auto Scaling", "Target tracking · step · scheduled · predictive · ELB health checks"],
        ["RDS Multi-AZ", "Synchronous standby, automatic failover, same endpoint"],
        ["Read replicas", "Asynchronous, readable, cross-Region, promote manually"],
        ["Aurora", "6 copies across 3 AZs · up to 15 replicas · Global Database for cross-Region"],
        ["RDS Proxy", "Connection pooling for Lambda · faster failover"],
      ],
    },
    {
      title: "Disaster recovery",
      items: [
        ["RPO", "How much data you can lose"],
        ["RTO", "How long you can be down"],
        ["Backup & restore", "Hours · $"],
        ["Pilot light", "Tens of minutes · data live, compute off · $$"],
        ["Warm standby", "Minutes · scaled-down full copy · $$$"],
        ["Active/active", "Near zero · full production in several Regions · $$$$"],
        ["Route 53", "Failover · weighted · latency · geolocation · geoproximity · multivalue · IP-based"],
      ],
    },
    {
      title: "Performance",
      items: [
        ["EBS", "gp3 (3,000 IOPS / 125 MiB/s baseline) · io2 Block Express (highest) · st1 throughput HDD · sc1 cold HDD"],
        ["Instance store", "Fastest, ephemeral"],
        ["File", "EFS = NFS Linux multi-AZ · FSx Windows = SMB + AD · FSx Lustre = HPC · FSx ONTAP = multi-protocol"],
        ["S3", "3,500 writes / 5,500 reads per second per prefix · multipart upload · Transfer Acceleration"],
        ["Placement groups", "Cluster = low latency · spread = distinct hardware · partition = rack-aware big data"],
        ["Caching", "DAX for DynamoDB · ElastiCache (Redis OSS/Valkey: HA, sorted sets; Memcached: simple) · CloudFront at edge"],
        ["Edge", "CloudFront = cache HTTP · Global Accelerator = static anycast IPs, TCP/UDP"],
        ["Data", "Kinesis Data Streams = real-time + replay · Firehose = delivery · Athena = SQL on S3 · Glue = ETL · Lake Formation = permissions"],
      ],
    },
    {
      title: "Cost",
      items: [
        ["S3 classes", "Standard → Standard-IA (30 d) → One Zone-IA (30 d) → Glacier IR (90 d) → Flexible (90 d) → Deep Archive (180 d)"],
        ["Unknown access", "S3 Intelligent-Tiering: no retrieval fees, small monitoring fee"],
        ["EC2 purchasing", "On-Demand · Savings Plans · RIs · Spot (2-min notice) · Dedicated Hosts (BYOL)"],
        ["Databases", "DynamoDB on-demand for spiky · Aurora Serverless v2 · reserved DB instances for steady"],
        ["Network", "Gateway endpoints beat NAT for S3 · same-AZ traffic free · CloudFront for egress-heavy content"],
        ["Tools", "Cost Explorer = analyze · Budgets = alert · CUR = line items · Compute Optimizer = rightsize · tags must be activated"],
      ],
    },
  ],

  boss: { name: "The Region-Eater Leviathan", emoji: "🐋" },
  matchLabel: "AWS services",
  levelTitles: [
    "Whiteboard Wanderer",
    "Subnet Scout",
    "Route Table Ranger",
    "Security Group Sentinel",
    "Multi-AZ Mason",
    "Queue Weaver",
    "Cache Conjurer",
    "Failover Forger",
    "Cost Alchemist",
    "Certified Architect",
  ],
});
