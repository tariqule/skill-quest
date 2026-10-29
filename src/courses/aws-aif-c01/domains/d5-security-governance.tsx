import { Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { ResponsibilityLab } from "../labs";
import { ScopingMatrix, SharedResponsibility } from "../visuals";

/**
 * Domain 5: everything for this exam domain in one file.
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d5",
    number: 5,
    name: "Security, Compliance, and Governance for AI",
    world: "The Vault",
    weight: 14,
    emoji: "🔐",
    color: "#f87171",
    summary:
      "Shared responsibility, IAM, KMS, PrivateLink, CloudTrail, Config, Audit Manager, Artifact, and data governance.",
  },

  tasks: [
    {
      id: "5.1",
      title: "Secure AI systems",
      covers: [
        "IAM roles and policies, encryption, Macie, PrivateLink, shared responsibility",
        "Bedrock AgentCore Identity, Policy in AgentCore, Bedrock Guardrails",
        "Source citation and data lineage, data cataloguing, SageMaker Model Cards",
        "Secure data engineering: quality, privacy tech, access control, integrity",
        "Threats: prompt injection, data leakage, toxicity; logging and audit trails",
        "Hallucination defences: RAG grounding, output validation, confidence scoring",
      ],
    },
    {
      id: "5.2",
      title: "Governance and compliance",
      covers: [
        "AWS Config, Amazon Inspector, AWS Artifact, AWS CloudTrail, AWS Trusted Advisor",
        "Data governance: lifecycle, logging, residency, monitoring, retention",
        "Governance process: policies, review cadence, the Generative AI Security Scoping Matrix, training",
      ],
    },
  ],

  lessons: [
    {
      id: "d5-shared",
      check: ["d5-01", "d5-10"],
      task: "5.1",
      title: "Shared responsibility",
      visual: (
        <div className="grid gap-6">
          <SharedResponsibility />
          <ResponsibilityLab />
        </div>
      ),
      points: ["Even with a managed service like Bedrock, your data, access, and configuration are yours to secure."],
      tip: "\"OF the cloud\" = AWS. \"IN the cloud\" = you.",
    },
    {
      id: "d5-toolbox",
      check: ["d5-03", "d5-14"],
      task: "5.1",
      title: "The security toolbox",
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "🔑", title: "IAM", text: "Who can do what. Roles + least privilege.", color: "#f87171" },
            { icon: "🔐", title: "KMS", text: "Encryption keys, at rest and in transit.", color: "#f87171" },
            { icon: "🚇", title: "PrivateLink", text: "VPC → Bedrock without the public internet.", color: "#f87171" },
            { icon: "🔍", title: "Macie", text: "Finds PII in S3 before you train on it.", color: "#f87171" },
            { icon: "🗝️", title: "Secrets Manager", text: "Stores and rotates API keys.", color: "#f87171" },
            { icon: "🤖", title: "AgentCore Identity & Policy", text: "What agents can access, and which tool actions are allowed.", color: "#f87171" },
          ]}
        />
      ),
      points: [
        "Threats to plan for: prompt injection, data leakage, toxicity, vulnerabilities.",
        "Log every AI interaction for audits. Filter and validate outputs.",
      ],
    },
    {
      id: "d5-hallucination",
      check: ["d5-19", "d5-12"],
      task: "5.1",
      title: "Defending against hallucinations",
      visual: (
        <Flow
          color="#f87171"
          steps={[
            { icon: "📚", label: "Ground with RAG", sub: "Answer from your documents, with citations" },
            { icon: "🧪", label: "Validate output", sub: "Check format, facts, and rules" },
            { icon: "📊", label: "Confidence score", sub: "Low confidence → human or fallback" },
            { icon: "🛡️", label: "Grounding check", sub: "Guardrails flags unsupported claims" },
          ]}
        />
      ),
      points: ["Data lineage and source citation show where an answer's facts came from. SageMaker Model Cards record data origins."],
    },
    {
      id: "d5-watchers",
      check: ["d5-20", "d5-07"],
      task: "5.2",
      title: "Who watches what",
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "🕵️", title: "CloudTrail", text: "Who called which API, and when", color: "#f59e0b" },
            { icon: "📈", title: "CloudWatch", text: "Metrics, logs, alarms", color: "#f59e0b" },
            { icon: "📐", title: "Config", text: "Are resources set up by the rules?", color: "#f59e0b" },
            { icon: "🩺", title: "Inspector", text: "Scans for software vulnerabilities", color: "#f59e0b" },
            { icon: "📜", title: "Artifact", text: "Download AWS compliance reports", color: "#f59e0b" },
            { icon: "💡", title: "Trusted Advisor", text: "Best-practice checks: cost, security, limits", color: "#f59e0b" },
          ]}
        />
      ),
      points: ["Data governance: lifecycle, retention, residency (keep data in approved Regions), logging, monitoring."],
    },
    {
      id: "d5-scoping",
      check: ["d5-17", "d5-21"],
      task: "5.2",
      title: "Generative AI Security Scoping Matrix",
      visual: <ScopingMatrix />,
      points: [
        "Use it to decide which security and governance controls are yours to own.",
        "Governance process: written policies, a regular review cadence, transparency standards, and team training.",
      ],
    },
    {
      id: "d5-network",
      check: ["d5-32", "d5-35"],
      task: "5.1",
      title: "Private networking and secure access patterns",
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#f87171"
            steps={[
              { icon: "🖥️", label: "App in a private subnet", sub: "No route to the internet" },
              { icon: "🚇", label: "VPC interface endpoint", sub: "Powered by AWS PrivateLink" },
              { icon: "🤖", label: "Amazon Bedrock", sub: "Traffic stays on the AWS network" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🌐", title: "Internet gateway", text: "Gives public subnets a route to the internet.", color: "#38bdf8" },
              { icon: "↗️", title: "NAT gateway", text: "Lets private instances reach out to the internet without being reachable from it.", color: "#38bdf8" },
              { icon: "🪣", title: "S3 gateway endpoint", text: "Private access to S3 from a VPC, for example for SageMaker training data.", color: "#38bdf8" },
            ]}
          />
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "🔐", label: "S3 data encrypted with KMS", sub: "SSE-KMS" },
              { icon: "🎫", label: "IAM role for Bedrock", sub: "S3 read + KMS decrypt permissions" },
              { icon: "🎛️", label: "Fine-tune custom model", sub: "Bedrock reads the data securely" },
            ]}
          />
        </div>
      ),
      points: [
        "IAM basics: users and groups get JSON policies; services get IAM roles. Grant least privilege.",
        "CloudTrail shows who called which Bedrock API, including denied calls, so you can audit access.",
        "SageMaker network isolation mode blocks all outbound traffic from training containers.",
      ],
      tip: "\"Access Bedrock without the internet\" → VPC endpoint (PrivateLink). \"Bedrock can't read my encrypted bucket\" → give its role KMS decrypt.",
    },
    {
      id: "d5-data-governance",
      check: ["d5-40", "d5-42"],
      task: "5.1 · 5.2",
      title: "Data governance and monitoring AI systems",
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "📥", label: "Collect" },
              { icon: "⚙️", label: "Process" },
              { icon: "🗄️", label: "Store" },
              { icon: "📊", label: "Consume" },
              { icon: "🧊", label: "Archive / delete" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "✅", title: "Data quality", text: "Complete, accurate, timely, consistent.", color: "#34d399" },
              { icon: "🎭", title: "Privacy tech", text: "Masking, obfuscation, encryption, tokenization.", color: "#34d399" },
              { icon: "🔑", title: "Access control", text: "Role-based, fine-grained, SSO + MFA, logged, reviewed.", color: "#34d399" },
              { icon: "🧬", title: "Integrity", text: "Backups, lineage, audit trails, tested controls.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "Data management concepts: lifecycle, logging, residency, monitoring (quality, anomalies, drift), analysis, and retention.",
        "Monitor AI systems on three fronts: model performance (accuracy, precision, recall, F1, latency), infrastructure (CPU/GPU, network, storage, logs), and bias, fairness, and compliance.",
        "Clear data roles: data owners, data stewards, and data custodians, overseen by a governance council.",
        "MLOps principles: version data, code, and models; automate; continuous integration, delivery, retraining, and monitoring.",
        "AWS Artifact also offers third-party software vendors' compliance reports to customers who were granted access.",
      ],
    },
  ],

  questions: [
    {
      id: "d5-01",
      domain: "d5",
      lesson: "d5-shared",
      prompt: "Under the AWS shared responsibility model, which is the CUSTOMER's responsibility when using Amazon Bedrock?",
      options: [
        "Securing the physical data centers",
        "Managing IAM permissions and protecting the data they send to models",
        "Patching the underlying model hosting infrastructure",
        "Maintaining the global network backbone",
      ],
      answer: [1],
      explanation:
        "AWS secures 'of' the cloud (infrastructure). Customers secure 'in' the cloud: data, IAM access, encryption choices, and application configuration.",
    },
    {
      id: "d5-02",
      domain: "d5",
      lesson: "d5-watchers",
      prompt: "Which service records API calls made to Amazon Bedrock for auditing who did what and when?",
      options: ["AWS CloudTrail", "Amazon CloudWatch", "AWS Config", "Amazon Inspector"],
      answer: [0],
      explanation:
        "CloudTrail logs API activity (who, what, when). CloudWatch handles metrics, logs, and alarms. Config tracks resource configuration changes.",
    },
    {
      id: "d5-03",
      domain: "d5",
      lesson: "d5-toolbox",
      prompt: "A company wants to connect its VPC to Amazon Bedrock without traffic traversing the public internet. What should it use?",
      options: ["AWS PrivateLink (VPC interface endpoint)", "An internet gateway", "Amazon CloudFront", "A NAT gateway only"],
      answer: [0],
      explanation: "PrivateLink interface endpoints keep traffic between your VPC and Bedrock on the AWS network.",
    },
    {
      id: "d5-04",
      domain: "d5",
      lesson: "d5-toolbox",
      prompt: "Which service manages encryption keys used to encrypt training data and custom models at rest?",
      options: ["AWS KMS", "AWS IAM", "Amazon Macie", "AWS Shield"],
      answer: [0],
      explanation: "AWS Key Management Service (KMS) creates and controls encryption keys. Bedrock supports customer managed keys for custom models.",
    },
    {
      id: "d5-05",
      domain: "d5",
      lesson: "d5-toolbox",
      prompt: "Which service discovers sensitive data such as PII stored in Amazon S3 buckets?",
      options: ["Amazon Macie", "Amazon Inspector", "AWS Artifact", "AWS Trusted Advisor"],
      answer: [0],
      explanation: "Macie uses ML to find and classify sensitive data in S3. Useful before using S3 data for training.",
    },
    {
      id: "d5-06",
      domain: "d5",
      lesson: "d5-watchers",
      prompt: "An auditor requests AWS's SOC and ISO compliance reports. Where can you download them?",
      options: ["AWS Artifact", "AWS Trusted Advisor", "Amazon Inspector", "AWS CloudTrail"],
      answer: [0],
      explanation: "AWS Artifact is the self-service portal for AWS compliance reports and agreements.",
    },
    {
      id: "d5-07",
      domain: "d5",
      lesson: "d5-watchers",
      prompt: "A company wants automated recommendations on cost savings, security gaps, and service limits across its AWS account. Which service provides these checks?",
      options: ["AWS Trusted Advisor", "AWS Artifact", "Amazon Macie", "Amazon Polly"],
      answer: [0],
      explanation: "AWS Trusted Advisor inspects your account and recommends improvements for cost, security, performance, fault tolerance, and service limits.",
    },
    {
      id: "d5-08",
      domain: "d5",
      lesson: "d5-watchers",
      prompt: "Which service continuously evaluates whether AWS resource configurations comply with your rules?",
      options: ["AWS Config", "AWS CloudTrail", "Amazon Polly", "AWS Lambda"],
      answer: [0],
      explanation: "AWS Config records configuration history and evaluates resources against Config rules.",
    },
    {
      id: "d5-09",
      domain: "d5",
      lesson: "d5-watchers",
      prompt: "Which service automatically scans workloads for software vulnerabilities and unintended network exposure?",
      options: ["Amazon Inspector", "Amazon Macie", "AWS Artifact", "Amazon Comprehend"],
      answer: [0],
      explanation: "Amazon Inspector scans EC2, container images, and Lambda for vulnerabilities.",
    },
    {
      id: "d5-10",
      domain: "d5",
      lesson: "d5-shared",
      prompt: "Does Amazon Bedrock use your prompts and responses to train the base foundation models?",
      options: [
        "No, your data is not used to train base models or shared with model providers",
        "Yes, all prompts are shared with model providers",
        "Only if you are in us-east-1",
        "Only for image models",
      ],
      answer: [0],
      explanation:
        "Bedrock does not store or use your prompts and completions to train AWS or third-party base models. Fine-tuning creates a private copy in your account.",
    },
    {
      id: "d5-11",
      domain: "d5",
      lesson: "d5-toolbox",
      prompt: "What is the security principle of granting only the permissions needed to perform a task?",
      options: ["Least privilege", "Defense in depth only", "Shared responsibility", "Data residency"],
      answer: [0],
      explanation: "Least privilege via IAM policies limits blast radius. Use roles, not long-lived access keys.",
    },
    {
      id: "d5-12",
      domain: "d5",
      lesson: "d5-hallucination",
      prompt: "What is data lineage in AI governance?",
      options: [
        "Tracking where data came from and how it was transformed through the pipeline",
        "Encrypting data in transit",
        "The order of rows in a table",
        "A type of neural network layer",
      ],
      answer: [0],
      explanation:
        "Data lineage and cataloging (for example AWS Glue Data Catalog, SageMaker ML Lineage Tracking) support reproducibility and audits.",
    },
    {
      id: "d5-13",
      domain: "d5",
      lesson: "d5-toolbox",
      prompt: "An attacker inserts malicious examples into a training dataset to corrupt model behavior. What is this called?",
      options: ["Data poisoning", "Prompt leaking", "Model inversion", "Phishing"],
      answer: [0],
      explanation:
        "Data poisoning targets training data. Protect with data validation, access controls, and lineage tracking.",
    },
    {
      id: "d5-14",
      domain: "d5",
      lesson: "d5-toolbox",
      prompt: "An AI app needs a third-party API key. The team must not hard-code the key and wants it rotated automatically. Which service should store it?",
      options: ["AWS Secrets Manager", "Amazon S3", "AWS CloudTrail", "Amazon Comprehend"],
      answer: [0],
      explanation: "AWS Secrets Manager stores, encrypts, and rotates secrets such as API keys and database passwords, so they never live in code.",
    },
    {
      id: "d5-15",
      domain: "d5",
      lesson: "d5-watchers",
      prompt: "A company must keep data in a specific country for regulatory reasons. Which concept is this?",
      options: ["Data residency", "Data drift", "Data augmentation", "Data labeling"],
      answer: [0],
      explanation: "Data residency requirements are met by choosing appropriate AWS Regions and controlling cross-Region features.",
    },
    {
      id: "d5-16",
      domain: "d5",
      lesson: "d5-watchers",
      prompt: "Which SageMaker governance tool gives a single place to view model information, such as performance and risk, across the organization?",
      options: ["SageMaker Model Dashboard", "SageMaker Canvas", "SageMaker Data Wrangler", "SageMaker Debugger"],
      answer: [0],
      explanation:
        "SageMaker governance includes Role Manager (permissions), Model Cards (documentation), and Model Dashboard (central monitoring view).",
    },
    {
      id: "d5-17",
      domain: "d5",
      lesson: "d5-scoping",
      type: "match",
      prompt: "Match each use of generative AI to its Generative AI Security Scoping Matrix scope.",
      pairs: [
        ["Employees use a public consumer chatbot", "Scope 1: Consumer app"],
        ["Using a SaaS product with built-in GenAI features", "Scope 2: Enterprise app"],
        ["Building an app on a Bedrock model as-is", "Scope 3: Pre-trained models"],
        ["Fine-tuning a Bedrock model on your data", "Scope 4: Fine-tuned models"],
        ["Training your own model from scratch", "Scope 5: Self-trained models"],
      ],
      explanation:
        "The scoping matrix goes from least to most ownership. The higher the scope, the more security, governance, and data responsibility sits with you.",
    },
    {
      id: "d5-18",
      domain: "d5",
      lesson: "d5-toolbox",
      prompt: "An agent must only call approved tools and must never issue refunds over $500, enforced outside the model's own reasoning. Which capability fits?",
      options: ["Policy in Amazon Bedrock AgentCore", "A higher temperature", "Amazon Polly", "AWS Glue"],
      answer: [0],
      explanation:
        "Policy in AgentCore applies deterministic rules to what agents can do with tools, so limits hold even if the model is tricked. AgentCore Identity controls who and what the agent can access.",
    },
    {
      id: "d5-19",
      domain: "d5",
      lesson: "d5-hallucination",
      prompt: "Which techniques help detect or reduce hallucinations? (Choose two.)",
      options: [
        "Ground answers with RAG and cite sources",
        "Validate outputs and use confidence scoring before showing answers",
        "Raise temperature to the maximum",
        "Remove the system prompt",
        "Disable logging",
      ],
      answer: [0, 1],
      explanation: "Grounding (RAG with citations), output validation, confidence scoring, and Bedrock Guardrails contextual grounding checks all help catch made-up answers.",
    },
    {
      id: "d5-20",
      domain: "d5",
      lesson: "d5-watchers",
      type: "match",
      prompt: "Match each AWS service to the governance question it answers.",
      pairs: [
        ["AWS CloudTrail", "Who called which API, and when?"],
        ["AWS Config", "Are my resources configured the way my rules require?"],
        ["Amazon CloudWatch", "What are my metrics and logs, and should an alarm fire?"],
        ["AWS Artifact", "Where are AWS's compliance reports?"],
      ],
      explanation: "CloudTrail = audit trail of actions. Config = configuration compliance. CloudWatch = monitoring. Artifact = AWS compliance documents.",
    },
    {
      id: "d5-21",
      domain: "d5",
      lesson: "d5-watchers",
      prompt: "Which are data governance strategies for AI? (Choose two.)",
      options: [
        "Define retention periods and data lifecycle rules",
        "Keep data in approved Regions to meet residency rules",
        "Share training data publicly by default",
        "Turn off logging to save cost",
        "Let every user access every dataset",
      ],
      answer: [0, 1],
      explanation: "Data governance covers lifecycle, retention, residency, logging, monitoring, and access control.",
    },
    // ── Practice set 2 ──
    {
      id: "d5-22",
      domain: "d5",
      lesson: "d5-toolbox",
      prompt: "How is data protected in transit between your application and the Amazon Bedrock API?",
      options: ["TLS encryption (HTTPS)", "AWS Artifact", "Amazon Polly", "A higher temperature"],
      answer: [0],
      explanation: "AWS API calls use TLS, which encrypts data in transit. KMS covers encryption at rest.",
    },
    {
      id: "d5-23",
      domain: "d5",
      lesson: "d5-toolbox",
      prompt: "An application on Amazon EC2 needs to call Bedrock. What is the most secure way to give it access?",
      options: [
        "Attach an IAM role with least-privilege permissions to the instance",
        "Hard-code an IAM user's access keys in the code",
        "Share the root account password",
        "Make the model public",
      ],
      answer: [0],
      explanation: "IAM roles provide temporary, automatically rotated credentials. Never embed long-lived access keys in code.",
    },
    {
      id: "d5-24",
      domain: "d5",
      lesson: "d5-watchers",
      prompt: "An auditor needs a record of the full prompts and responses sent to Bedrock models. Which feature provides this?",
      options: [
        "Bedrock model invocation logging to CloudWatch Logs or Amazon S3",
        "AWS Trusted Advisor",
        "Amazon Translate",
        "SageMaker Ground Truth",
      ],
      answer: [0],
      explanation: "CloudTrail records API activity (who called what). Model invocation logging captures the request and response content itself.",
    },
    {
      id: "d5-25",
      domain: "d5",
      lesson: "d5-watchers",
      prompt: "Training data in Amazon S3 must be deleted automatically one year after it's created. What should the team use?",
      options: ["An S3 Lifecycle rule", "Amazon Polly", "A larger context window", "AWS Artifact"],
      answer: [0],
      explanation: "S3 Lifecycle rules enforce retention by moving or expiring objects on a schedule, supporting data governance.",
    },
    {
      id: "d5-26",
      domain: "d5",
      lesson: "d5-toolbox",
      prompt: "A company wants central, fine-grained access control over data-lake tables used to train models. Which service fits?",
      options: ["AWS Lake Formation", "Amazon Lex", "Amazon Polly", "AWS Budgets"],
      answer: [0],
      explanation: "Lake Formation manages permissions on data-lake databases, tables, and columns in one place.",
    },
    {
      id: "d5-27",
      domain: "d5",
      lesson: "d5-toolbox",
      prompt: "The app must never show credit card numbers that the model might generate. Which control fits?",
      options: [
        "Output filtering, such as Bedrock Guardrails sensitive information filters",
        "Raising the temperature",
        "Using a bigger model",
        "Turning off encryption",
      ],
      answer: [0],
      explanation: "Validating and filtering outputs prevents data leakage. Guardrails can block or mask PII in responses.",
    },
    {
      id: "d5-28",
      domain: "d5",
      lesson: "d5-toolbox",
      prompt: "A SageMaker AI endpoint must be reachable only from inside the company's private network. What should the team do?",
      options: [
        "Run it in an Amazon VPC with no public access and connect privately",
        "Put the endpoint URL on the company website",
        "Disable IAM authentication",
        "Use Amazon CloudFront for public caching",
      ],
      answer: [0],
      explanation: "VPC isolation and private connectivity (such as PrivateLink) keep AI endpoints off the public internet.",
    },
    {
      id: "d5-29",
      domain: "d5",
      lesson: "d5-scoping",
      prompt: "Which is part of a sound governance process for AI systems?",
      options: [
        "Written policies with a regular review cadence and documented approvals",
        "Letting each developer decide their own rules",
        "Reviewing models only after an incident",
        "Turning off logging to save cost",
      ],
      answer: [0],
      explanation: "Governance needs clear policies, scheduled reviews, transparency standards, and team training.",
    },
    {
      id: "d5-30",
      domain: "d5",
      lesson: "d5-watchers",
      type: "order",
      prompt: "Put the stages of the data lifecycle for AI training data in order.",
      items: ["Collect the data with consent", "Store it securely and encrypted", "Use it for training or inference", "Retain it for the required period", "Delete it securely"],
      explanation: "Data governance applies at every stage, from consent at collection to secure deletion when retention ends.",
    },
    {
      id: "d5-31",
      domain: "d5",
      lesson: "d5-toolbox",
      type: "match",
      prompt: "Match each security need to the AWS service.",
      pairs: [
        ["Store and rotate database passwords", "AWS Secrets Manager"],
        ["Find PII in S3 buckets", "Amazon Macie"],
        ["Encrypt data with keys you control", "AWS KMS"],
        ["Private connection from a VPC to Bedrock", "AWS PrivateLink"],
        ["Scan container images for vulnerabilities", "Amazon Inspector"],
      ],
      explanation: "Each service covers one security job. Exams often ask you to pick the right one from a scenario.",
    },
    // ── Practice set 3 ──
    {
      id: "d5-32",
      domain: "d5",
      lesson: "d5-network",
      prompt: "An app in a private subnet with no internet access must call Amazon Bedrock. What should the team set up?",
      options: ["A VPC interface endpoint for Bedrock (AWS PrivateLink)", "An internet gateway on the private subnet", "A public IP on every instance", "Amazon CloudFront"],
      answer: [0],
      explanation: "VPC endpoints powered by PrivateLink reach AWS services privately, keeping traffic on the AWS network.",
    },
    {
      id: "d5-33",
      domain: "d5",
      lesson: "d5-network",
      prompt: "Instances in a private subnet need to download software updates from the internet but must not be reachable from it. What provides this?",
      options: ["A NAT gateway", "An internet gateway attached directly to the private subnet", "AWS Artifact", "An S3 Lifecycle rule"],
      answer: [0],
      explanation: "NAT gateways allow outbound-only internet access for private subnets. Internet gateways serve public subnets.",
    },
    {
      id: "d5-34",
      domain: "d5",
      lesson: "d5-network",
      prompt: "SageMaker training jobs in a private VPC must read data from Amazon S3 without using the internet. What is the simplest option?",
      options: ["An S3 gateway VPC endpoint", "A NAT gateway to the public S3 endpoint", "Copy data to Amazon Polly", "Turn off encryption"],
      answer: [0],
      explanation: "An S3 gateway endpoint gives private access to S3 from the VPC. An interface endpoint is also available.",
    },
    {
      id: "d5-35",
      domain: "d5",
      lesson: "d5-network",
      prompt: "Bedrock fails to fine-tune a model from training data in an S3 bucket encrypted with a KMS key (SSE-KMS). What is the most likely fix?",
      options: ["Give Bedrock's IAM role permission to read the bucket and to decrypt with the KMS key", "Make the bucket public", "Delete the KMS key", "Raise the model's temperature"],
      answer: [0],
      explanation: "Bedrock needs an IAM role with both S3 access and kms:Decrypt on the key that encrypted the data.",
    },
    {
      id: "d5-36",
      domain: "d5",
      lesson: "d5-network",
      prompt: "A security team needs to see which users tried to call Bedrock's ListCustomModels API, including calls that were denied. Which service records this?",
      options: ["AWS CloudTrail", "Amazon Polly", "AWS Trusted Advisor", "SageMaker Canvas"],
      answer: [0],
      explanation: "CloudTrail logs API activity, successful and denied, for auditing who did what.",
    },
    {
      id: "d5-37",
      domain: "d5",
      lesson: "d5-network",
      prompt: "In IAM, how should an AWS service such as Bedrock or SageMaker get permission to access other resources?",
      options: ["Through an IAM role assumed by the service", "By embedding a user's access keys", "By sharing the root user", "Through an S3 storage class"],
      answer: [0],
      explanation: "Services assume IAM roles with least-privilege policies. Users and groups get policies too, but services should never use long-lived user keys.",
    },
    {
      id: "d5-38",
      domain: "d5",
      lesson: "d5-network",
      prompt: "A regulator requires that SageMaker training containers can't send any data out. Which setting enforces this?",
      options: ["Network isolation mode for the training job", "A higher batch size", "Amazon Lex", "S3 Intelligent-Tiering"],
      answer: [0],
      explanation: "Network isolation blocks all outbound network access from the job's containers, even to S3.",
    },
    {
      id: "d5-39",
      domain: "d5",
      lesson: "d5-data-governance",
      type: "order",
      prompt: "Put the stages of the data lifecycle in order.",
      items: ["Collection", "Processing", "Storage", "Consumption", "Archival"],
      explanation: "Governance controls (access, retention, residency, logging) apply at every stage.",
    },
    {
      id: "d5-40",
      domain: "d5",
      lesson: "d5-data-governance",
      prompt: "Which privacy-enhancing technologies reduce the risk of exposing personal data used in AI? (Choose two.)",
      options: ["Data masking or obfuscation", "Encryption and tokenization", "Publishing raw data for transparency", "Disabling access logs", "Sharing one admin account"],
      answer: [0, 1],
      explanation: "Masking, obfuscation, encryption, and tokenization protect data while it's stored, processed, and used.",
    },
    {
      id: "d5-41",
      domain: "d5",
      lesson: "d5-data-governance",
      type: "match",
      prompt: "Match each data-quality dimension to its meaning.",
      pairs: [
        ["Completeness", "Covers a diverse, comprehensive range of scenarios"],
        ["Accuracy", "Correct, up to date, and representative"],
        ["Timeliness", "How old the data in the store is"],
        ["Consistency", "Coherent across the whole data lifecycle"],
      ],
      explanation: "Assessing data quality is the first step in secure data engineering.",
    },
    {
      id: "d5-42",
      domain: "d5",
      lesson: "d5-data-governance",
      prompt: "Which belong in monitoring a production AI system? (Choose two.)",
      options: ["Model performance metrics such as precision, recall, and latency", "Infrastructure metrics such as CPU and GPU use, network, and storage", "The office Wi-Fi password", "The color of dashboards", "How many slides the team presented"],
      answer: [0, 1],
      explanation: "Monitor model performance, infrastructure health, and bias, fairness, and compliance signals.",
    },
    {
      id: "d5-43",
      domain: "d5",
      lesson: "d5-data-governance",
      prompt: "Which is a key MLOps principle?",
      options: ["Version control for data, code, and models so you can roll back", "Deploying models by hand with no records", "Training once and never monitoring", "Keeping models only on laptops"],
      answer: [0],
      explanation: "MLOps adds automation, continuous integration and delivery, continuous retraining, and continuous monitoring.",
    },
    {
      id: "d5-44",
      domain: "d5",
      lesson: "d5-data-governance",
      prompt: "Data quality drops and input patterns shift after a model is deployed. Which data management activity catches this?",
      options: ["Data monitoring (quality, anomalies, drift)", "Data archival", "Choosing an S3 storage class", "Prompt caching"],
      answer: [0],
      explanation: "Data monitoring tracks quality, anomalies, and drift. SageMaker Model Monitor automates this for endpoints.",
    },
    {
      id: "d5-45",
      domain: "d5",
      lesson: "d5-watchers",
      prompt: "A customer wants the compliance reports of a third-party software vendor it buys through AWS Marketplace. Where can it get them, if the vendor grants access?",
      options: ["AWS Artifact (third-party reports)", "AWS Lambda", "Amazon Translate", "Amazon Inspector"],
      answer: [0],
      explanation: "Artifact provides AWS's own compliance reports and, with access granted, independent software vendors' reports, with notifications when new ones arrive.",
    },
  ],

  cards: [
    { id: "s-cloudtrail", domain: "d5", kind: "service", term: "AWS CloudTrail", definition: "Audit log of API calls: who did what, when" },
    { id: "s-config", domain: "d5", kind: "service", term: "AWS Config", definition: "Track and evaluate resource configuration compliance" },
    { id: "s-kms", domain: "d5", kind: "service", term: "AWS KMS", definition: "Create and manage encryption keys" },
    { id: "s-macie", domain: "d5", kind: "service", term: "Amazon Macie", definition: "Discover sensitive data (PII) in S3" },
    { id: "s-artifact", domain: "d5", kind: "service", term: "AWS Artifact", definition: "Download AWS compliance reports (SOC, ISO)" },
    { id: "s-inspector", domain: "d5", kind: "service", term: "Amazon Inspector", definition: "Automated vulnerability scanning of workloads" },
    { id: "s-cloudwatch", domain: "d5", kind: "service", term: "Amazon CloudWatch", definition: "Metrics, logs, dashboards, and alarms" },
    { id: "s-trustedadvisor", domain: "d5", kind: "service", term: "AWS Trusted Advisor", definition: "Best-practice checks for cost, security, and limits" },
    { id: "s-secrets", domain: "d5", kind: "service", term: "AWS Secrets Manager", definition: "Store and rotate API keys and passwords" },
    { id: "s-privatelink", domain: "d5", kind: "service", term: "AWS PrivateLink", definition: "Private connectivity from your VPC to AWS services" },
    { id: "c-scoping", domain: "d5", kind: "concept", term: "GenAI Security Scoping Matrix", definition: "Scopes 1-5 from consumer app to self-trained model" },
    { id: "c-shared", domain: "d5", kind: "concept", term: "Shared responsibility", definition: "AWS secures the cloud; you secure what you put in it" },
    { id: "c-leastpriv", domain: "d5", kind: "concept", term: "Least privilege", definition: "Grant only the permissions needed for the task" },
    { id: "c-poisoning", domain: "d5", kind: "concept", term: "Data poisoning", definition: "Corrupting training data to manipulate a model" },
    { id: "c-vpcendpoint", domain: "d5", kind: "concept", term: "VPC endpoint", definition: "Private access to AWS services without the internet" },
    { id: "c-nat", domain: "d5", kind: "concept", term: "NAT gateway", definition: "Outbound-only internet for private subnets" },
    { id: "c-kmsrole", domain: "d5", kind: "concept", term: "Bedrock + SSE-KMS bucket", definition: "Role needs S3 read plus KMS decrypt" },
    { id: "c-netiso", domain: "d5", kind: "concept", term: "SageMaker network isolation", definition: "Training containers get no outbound access" },
    { id: "c-pet", domain: "d5", kind: "concept", term: "Privacy-enhancing tech", definition: "Masking, obfuscation, encryption, tokenization" },
    { id: "c-mlops", domain: "d5", kind: "concept", term: "MLOps principles", definition: "Versioning, automation, CI/CD, continuous retraining and monitoring" },
  ],

  challenges: [
    {
      id: "ch-shared-responsibility",
      domain: "d5",
      lesson: "d5-shared",
      title: "Whose job is it?",
      goal: "Assign every task to AWS or to you, with all six correct.",
      hint: "AWS secures the infrastructure; you secure your data, access, and configuration.",
      takeaway: "Even on managed services like Bedrock, IAM, encryption choices, and guardrail settings are yours.",
      render: (onSolved) => <ResponsibilityLab goal="allCorrect" onSolved={onSolved} />,
    },
  ],
});
