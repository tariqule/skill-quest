import { Flow, Layers, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { ResponsibilityShiftLab } from "../labs";

/**
 * Domain 2: Security and Compliance (30% of scored content).
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "Security and Compliance",
    world: "The Shield Keep",
    weight: 30,
    emoji: "🛡️",
    color: "#f87171",
    summary: "The shared responsibility model, compliance and encryption, logging and auditing, IAM and the root user, and the AWS security services.",
  },

  tasks: [
    {
      id: "2.1",
      title: "Understand the AWS shared responsibility model",
      covers: [
        "Components of the model: customer responsibilities, AWS responsibilities, and shared responsibilities",
        "How responsibilities shift with the service used (for example, Amazon RDS, AWS Lambda, Amazon EC2)",
      ],
    },
    {
      id: "2.2",
      title: "Understand AWS Cloud security, governance, and compliance concepts",
      covers: [
        "Where to find compliance information (AWS Artifact); compliance needs that vary by location, industry, and service",
        "How customers secure resources (Amazon Inspector, AWS Security Hub, Amazon GuardDuty, AWS Shield)",
        "Encryption options: in transit and at rest",
        "Governance and compliance services: monitoring with CloudWatch, auditing with CloudTrail and AWS Config, access reports",
        "Where to capture and find security logs",
      ],
    },
    {
      id: "2.3",
      title: "Identify AWS access management capabilities",
      covers: [
        "IAM users, groups, roles, custom and managed policies, and the principle of least privilege",
        "Access keys, password policies, and credential storage (AWS Secrets Manager, AWS Systems Manager)",
        "Protecting the root user and the tasks only the root user can perform",
        "Authentication: MFA, IAM Identity Center, cross-account IAM roles, federated identity",
      ],
    },
    {
      id: "2.4",
      title: "Identify components and resources for security",
      covers: [
        "Security services: AWS WAF, AWS Firewall Manager, AWS Shield, Amazon GuardDuty, and more",
        "Third-party security products in AWS Marketplace",
        "Security information: AWS Knowledge Center, AWS Security Center, AWS Security Blog",
        "Using AWS Trusted Advisor to identify security issues",
      ],
    },
  ],

  lessons: [
    {
      id: "d2-shared",
      check: ["d2-01", "d2-07"],
      task: "2.1",
      title: "Shared responsibility, and how it shifts",
      visual: (
        <div className="grid gap-6">
          <Layers
            layers={[
              { name: "Customer: security IN the cloud", color: "#34d399", items: ["Customer data", "IAM and access", "Applications", "Guest OS (on EC2)", "Firewall and network config", "Encryption choices"] },
              { name: "AWS: security OF the cloud", color: "#38bdf8", items: ["Compute, storage, database, networking software", "Hypervisor and hosts", "Regions, AZs, edge locations", "Physical data centers"] },
            ]}
          />
          <ResponsibilityShiftLab />
        </div>
      ),
      points: [
        "AWS secures the cloud itself: facilities, hardware, the network, and the virtualization layer.",
        "You secure what you put in the cloud: data, identities, applications, and configuration.",
        "The more managed the service, the more AWS does: EC2 (you patch the OS) → RDS (AWS patches OS and engine) → Lambda (AWS runs the OS and runtime).",
        "Shared controls: patch management, configuration management, and awareness and training. Physical and environmental controls are inherited from AWS.",
      ],
      tip: "If you can't touch it (hardware, hypervisor, data center), it's AWS's job. If you configure it, it's yours.",
    },
    {
      id: "d2-compliance",
      check: ["d2-11", "d2-15"],
      task: "2.2",
      title: "Compliance and encryption",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "📜", title: "AWS Artifact", text: "Self-service AWS compliance reports (SOC, ISO, PCI) and agreements such as a BAA.", color: "#f87171" },
              { icon: "🔑", title: "AWS KMS", text: "Create and control encryption keys; integrated with most services for encryption at rest.", color: "#f87171" },
              { icon: "🔒", title: "AWS Certificate Manager", text: "Provision and renew TLS certificates for encryption in transit.", color: "#f87171" },
              { icon: "🧰", title: "AWS CloudHSM", text: "Dedicated, single-tenant hardware security modules you control.", color: "#f87171" },
            ]}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
              <div className="font-bold text-white">💾 At rest</div>
              Data stored on disks, in S3, or in databases. Turn it on with KMS keys (for example, SSE-KMS for S3, encrypted EBS volumes and RDS instances).
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
              <div className="font-bold text-white">📡 In transit</div>
              Data moving across a network. Use TLS (HTTPS) with certificates from ACM, or VPN tunnels.
            </div>
          </div>
        </div>
      ),
      points: [
        "AWS is audited against many global and industry programs. Not every service is in scope for every program: check AWS Services in Scope by Compliance Program.",
        "Compliance needs vary by country and industry. You choose the Region, and your data stays there unless you move it.",
        "You inherit the audited controls for AWS's infrastructure, but you remain responsible for how your own workload complies.",
      ],
      tip: "\"Auditor wants AWS's SOC or ISO report\" → AWS Artifact. \"Keys on dedicated hardware we control\" → CloudHSM.",
    },
    {
      id: "d2-governance",
      check: ["d2-17", "d2-19"],
      task: "2.2",
      title: "Monitoring, auditing, and logs",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "📈", title: "Amazon CloudWatch", text: "Metrics, logs, dashboards, and alarms: how resources are performing.", color: "#f59e0b" },
              { icon: "🕵️", title: "AWS CloudTrail", text: "Who made which API call, from where, and when.", color: "#f59e0b" },
              { icon: "📐", title: "AWS Config", text: "Resource configuration history and rule compliance.", color: "#f59e0b" },
            ]}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "🧑‍💻", label: "Someone calls an API", sub: "Console, CLI, SDK" },
              { icon: "🕵️", label: "CloudTrail records it", sub: "Event history, or a trail" },
              { icon: "🪣", label: "Trail delivers logs", sub: "To an S3 bucket for long-term retention" },
              { icon: "🔔", label: "Analyze and alert", sub: "CloudWatch Logs, Security Hub, Athena" },
            ]}
          />
        </div>
      ),
      points: [
        "Access reports: the IAM credential report lists every user and the status of their passwords, access keys, and MFA.",
        "IAM last accessed information shows which services an identity actually used, so you can remove unused permissions.",
        "AWS Security Hub gives one view of security findings and runs automated best-practice checks across accounts.",
      ],
      tip: "Performance or alarms → CloudWatch. \"Who did it?\" → CloudTrail. \"Is it configured by the rules, and what changed?\" → Config.",
    },
    {
      id: "d2-iam",
      check: ["d2-25", "d2-27"],
      task: "2.3",
      title: "IAM: users, groups, roles, and policies",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "👤", title: "User", text: "A person or app with long-term credentials. Prefer federation for people.", color: "#a78bfa" },
              { icon: "👥", title: "Group", text: "A set of users who share the same permissions.", color: "#a78bfa" },
              { icon: "🎭", title: "Role", text: "Temporary credentials that a service, user, or other account assumes.", color: "#a78bfa" },
              { icon: "📄", title: "Policy", text: "JSON document that allows or denies actions on resources.", color: "#a78bfa" },
            ]}
          />
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "🚫", label: "Explicit deny?", sub: "Any deny wins" },
              { icon: "✅", label: "Explicit allow?", sub: "Then the request is allowed" },
              { icon: "🔒", label: "Otherwise", sub: "Implicit deny (the default)" },
            ]}
          />
        </div>
      ),
      points: [
        "Least privilege: grant only the permissions a task needs, and review them regularly.",
        "AWS managed policies are written and updated by AWS. Customer managed (custom) policies are ones you write and can attach to many identities.",
        "Applications on EC2 should use an IAM role, never access keys stored on the instance or in code.",
        "Store and rotate secrets with AWS Secrets Manager. Systems Manager Parameter Store holds configuration values and secure strings.",
        "Use an account password policy to require length, complexity, and rotation for IAM users.",
      ],
      tip: "\"Application needs access to S3\" → IAM role. \"Twenty developers need the same permissions\" → IAM group.",
    },
    {
      id: "d2-root",
      check: ["d2-33", "d2-35"],
      task: "2.3",
      title: "Root user, MFA, and single sign-on",
      visual: (
        <div className="grid gap-4">
          <div className="rounded-xl border border-rose-400/40 bg-rose-400/5 p-3">
            <div className="font-bold text-rose-200">👑 Root user: lock it away</div>
            <ul className="mt-2 grid gap-1 text-sm text-slate-300">
              <li>• Turn on MFA and use a strong password</li>
              <li>• Don&apos;t create root access keys (delete any that exist)</li>
              <li>• Use it only for tasks that require it: close the account, change account settings such as the root email, restore IAM permissions</li>
            </ul>
          </div>
          <Tiles
            cols={3}
            tiles={[
              { icon: "🔢", title: "MFA", text: "A second factor (authenticator app, security key) on top of the password.", color: "#34d399" },
              { icon: "🚪", title: "IAM Identity Center", text: "Workforce single sign-on to many AWS accounts and apps.", color: "#34d399" },
              { icon: "🤝", title: "Federation", text: "Sign in with an existing corporate identity provider, no separate IAM users.", color: "#34d399" },
              { icon: "🔁", title: "Cross-account role", text: "Users in one account assume a role in another for temporary access.", color: "#34d399" },
              { icon: "📱", title: "Amazon Cognito", text: "Sign-up and sign-in for your app's customers.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "The root user has complete access to the account and can't be restricted by IAM policies in that account, so protect it more than anything else.",
        "Create administrative users (preferably through IAM Identity Center) for daily work.",
        "Federation lets employees use credentials they already have, such as a corporate directory, through SAML or OIDC.",
      ],
      tip: "\"Employees sign in once to reach many accounts\" → IAM Identity Center. \"App customers sign up\" → Cognito.",
    },
    {
      id: "d2-services",
      check: ["d2-39", "d2-41"],
      task: "2.2 · 2.4",
      title: "The security service lineup",
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "🧱", title: "AWS WAF", text: "Web application firewall: block SQL injection, cross-site scripting, and bad IPs.", color: "#f87171" },
            { icon: "🛡️", title: "AWS Shield", text: "DDoS protection. Standard is automatic at no extra cost; Advanced adds more.", color: "#f87171" },
            { icon: "🗂️", title: "AWS Firewall Manager", text: "Manage WAF, Shield Advanced, and security group rules across accounts.", color: "#f87171" },
            { icon: "🐕", title: "Amazon GuardDuty", text: "Threat detection from CloudTrail, VPC Flow Logs, and DNS logs.", color: "#f87171" },
            { icon: "🩺", title: "Amazon Inspector", text: "Automated vulnerability scans of EC2, container images, and Lambda.", color: "#f87171" },
            { icon: "🧭", title: "AWS Security Hub", text: "Central view of findings and automated best-practice checks.", color: "#f87171" },
            { icon: "🔍", title: "Amazon Macie", text: "Discover sensitive data such as PII in S3.", color: "#f87171" },
            { icon: "🕸️", title: "Amazon Detective", text: "Investigate the root cause of security findings.", color: "#f87171" },
            { icon: "🛍️", title: "AWS Marketplace", text: "Third-party security products, billed through AWS.", color: "#f87171" },
          ]}
        />
      ),
      points: [
        "Trusted Advisor also checks for security issues, such as open ports, missing root MFA, and public S3 buckets.",
        "Security information lives in the AWS Security Center, the AWS Security Blog, and the AWS Knowledge Center.",
        "Defense in depth: Shield and WAF at the edge, network ACLs at the subnet, security groups at the instance.",
      ],
      tip: "\"Find threats\" → GuardDuty. \"Find vulnerabilities\" → Inspector. \"Find PII\" → Macie. \"Investigate\" → Detective.",
    },
  ],

  questions: [
    // ── Shared responsibility ──
    {
      id: "d2-01",
      domain: "d2",
      lesson: "d2-shared",
      prompt: "A company runs its application on Amazon EC2. Under the AWS shared responsibility model, which task is the company's responsibility?",
      options: ["Maintaining the hypervisor", "Patching the guest operating system", "Securing the data center building", "Replacing failed host hardware"],
      answer: [1],
      explanation: "On EC2 the customer manages the guest OS and everything above it. AWS manages the hypervisor, hardware, and facilities.",
    },
    {
      id: "d2-02",
      domain: "d2",
      lesson: "d2-shared",
      prompt: "A company moves its database from EC2 to Amazon RDS. Which task does AWS now perform that the company used to do?",
      options: ["Creating database user accounts", "Patching the database engine and the underlying operating system", "Deciding which networks can reach the database", "Classifying the data stored in tables"],
      answer: [1],
      explanation: "RDS is a managed service: AWS handles OS and engine patching. Users, network access, and data stay with the customer.",
    },
    {
      id: "d2-03",
      domain: "d2",
      lesson: "d2-shared",
      prompt: "For a workload on AWS Lambda, what remains the customer's responsibility?",
      options: ["Patching the managed runtime", "Scaling the underlying servers", "The function code and the permissions in its execution role", "Physical security of the servers"],
      answer: [2],
      explanation: "With Lambda, AWS runs the servers, OS, and managed runtimes. You own your code, its IAM permissions, and your data.",
    },
    {
      id: "d2-04",
      domain: "d2",
      lesson: "d2-shared",
      prompt: "Which is an example of a SHARED control between AWS and the customer?",
      options: ["Physical and environmental controls", "Patch management", "Customer data classification", "Data center access badges"],
      answer: [1],
      explanation: "AWS patches the infrastructure; customers patch their guest operating systems and applications. Configuration management and awareness and training are shared the same way.",
    },
    {
      id: "d2-05",
      domain: "d2",
      lesson: "d2-shared",
      prompt: "Which are customer responsibilities when running workloads on Amazon EC2? (Choose two.)",
      options: [
        "Configuring security group rules",
        "Installing updates on the guest operating system",
        "Maintaining the hypervisor",
        "Controlling physical access to servers",
        "Disposing of failed storage hardware",
      ],
      answer: [0, 1],
      explanation: "Security groups and the guest OS are configured by you. The hypervisor, physical access, and hardware disposal belong to AWS.",
    },
    {
      id: "d2-06",
      domain: "d2",
      lesson: "d2-shared",
      prompt: "A company moves workloads from Amazon EC2 to AWS Lambda. How does this change its share of security responsibility?",
      options: [
        "AWS takes on more operational tasks, such as the OS and runtime, and the company focuses on code, data, and access",
        "The company becomes responsible for the hypervisor",
        "Nothing changes, because responsibility is the same for all services",
        "AWS becomes responsible for the company's IAM policies",
      ],
      answer: [0],
      explanation: "Responsibility shifts with the service: the more managed it is, the more AWS handles. Your data and access are always yours.",
    },
    {
      id: "d2-07",
      domain: "d2",
      lesson: "d2-shared",
      type: "order",
      prompt: "Order these services from the MOST customer responsibility to the LEAST.",
      items: ["Amazon EC2: you manage the guest OS and up", "Amazon RDS: AWS manages the OS and database engine", "AWS Lambda: you manage code and permissions"],
      explanation: "Infrastructure services leave the most to you; managed and serverless services move more of the stack to AWS.",
    },
    {
      id: "d2-08",
      domain: "d2",
      lesson: "d2-shared",
      prompt: "Which controls does a customer fully inherit from AWS?",
      options: ["Physical and environmental controls of the data centers", "IAM policies for its users", "Security group rules", "Encryption settings for its S3 buckets"],
      answer: [0],
      explanation: "Inherited controls are ones AWS fully provides, like physical and environmental protections. Everything you configure stays yours.",
    },
    // ── Compliance and encryption ──
    {
      id: "d2-09",
      domain: "d2",
      lesson: "d2-compliance",
      prompt: "A healthcare company must review and accept a Business Associate Addendum (BAA) with AWS. Where can it do this?",
      options: ["AWS Artifact", "AWS Trusted Advisor", "AWS Config", "Amazon Macie"],
      answer: [0],
      explanation: "AWS Artifact provides compliance reports and lets you review and accept agreements such as the BAA.",
    },
    {
      id: "d2-10",
      domain: "d2",
      lesson: "d2-compliance",
      prompt: "Which statement about AWS compliance is correct?",
      options: [
        "Every AWS service is certified for every compliance program",
        "Using AWS makes a customer's application automatically compliant",
        "Services differ in which compliance programs they're in scope for, and customers remain responsible for their own workloads' compliance",
        "Compliance reports are only available from AWS Support",
      ],
      answer: [2],
      explanation: "Check AWS Services in Scope by Compliance Program before choosing services. You inherit AWS's infrastructure controls but must make your own workload compliant.",
    },
    {
      id: "d2-11",
      domain: "d2",
      lesson: "d2-compliance",
      prompt: "An external auditor asks for AWS's latest SOC 2 report for the infrastructure a company uses. What is the FASTEST way to get it?",
      options: ["Open a support case with AWS", "Download it from AWS Artifact", "Run AWS Config rules", "Export CloudTrail logs"],
      answer: [1],
      explanation: "AWS Artifact is the self-service portal for AWS security and compliance reports.",
    },
    {
      id: "d2-12",
      domain: "d2",
      lesson: "d2-compliance",
      prompt: "A company must encrypt data in its S3 buckets and EBS volumes and control who can use the keys. Which service manages those keys?",
      options: ["AWS Certificate Manager", "AWS Key Management Service (AWS KMS)", "Amazon Cognito", "AWS Shield"],
      answer: [1],
      explanation: "AWS KMS creates and controls encryption keys and integrates with S3, EBS, RDS, and many other services for encryption at rest.",
    },
    {
      id: "d2-13",
      domain: "d2",
      lesson: "d2-compliance",
      prompt: "A website must serve traffic only over HTTPS. Which service provisions and automatically renews the TLS certificates?",
      options: ["AWS Certificate Manager (ACM)", "AWS KMS", "AWS Secrets Manager", "Amazon GuardDuty"],
      answer: [0],
      explanation: "ACM issues and renews public TLS certificates for services such as Elastic Load Balancing and CloudFront, protecting data in transit.",
    },
    {
      id: "d2-14",
      domain: "d2",
      lesson: "d2-compliance",
      prompt: "A regulation requires a company to store its encryption keys in dedicated, single-tenant hardware security modules that it controls. Which service meets this need?",
      options: ["AWS CloudHSM", "AWS Artifact", "Amazon Macie", "AWS IAM Identity Center"],
      answer: [0],
      explanation: "AWS CloudHSM provides dedicated hardware security modules in the AWS Cloud under your exclusive control.",
    },
    {
      id: "d2-15",
      domain: "d2",
      lesson: "d2-compliance",
      prompt: "Which are encryption options for protecting data on AWS? (Choose two.)",
      options: [
        "Encryption at rest with AWS KMS keys",
        "Encryption in transit with TLS",
        "Security groups that encrypt traffic",
        "IAM groups that encrypt files",
        "Turning on CloudTrail to encrypt all data",
      ],
      answer: [0, 1],
      explanation: "Protect stored data with encryption at rest and moving data with encryption in transit. Security groups, IAM groups, and CloudTrail don't encrypt data.",
    },
    {
      id: "d2-16",
      domain: "d2",
      lesson: "d2-compliance",
      type: "match",
      prompt: "Match each need to the AWS service.",
      pairs: [
        ["Download AWS compliance reports", "AWS Artifact"],
        ["Create and control encryption keys", "AWS KMS"],
        ["Provision TLS certificates", "AWS Certificate Manager"],
        ["Single-tenant hardware security modules", "AWS CloudHSM"],
      ],
      explanation: "Artifact for compliance documents, KMS for keys, ACM for certificates, CloudHSM for dedicated key hardware.",
    },
    // ── Governance and logs ──
    {
      id: "d2-17",
      domain: "d2",
      lesson: "d2-governance",
      prompt: "An S3 bucket was deleted overnight. Which service shows which identity deleted it and when?",
      options: ["Amazon CloudWatch", "AWS CloudTrail", "AWS Trusted Advisor", "Amazon Inspector"],
      answer: [1],
      explanation: "CloudTrail records API calls, including the caller, time, source IP, and request details.",
    },
    {
      id: "d2-18",
      domain: "d2",
      lesson: "d2-governance",
      prompt: "An operations team wants a notification when an EC2 instance's CPU utilization stays above 80% for 10 minutes. Which service should it use?",
      options: ["AWS Config", "AWS CloudTrail", "Amazon CloudWatch", "AWS Artifact"],
      answer: [2],
      explanation: "CloudWatch collects metrics and triggers alarms, which can send notifications through Amazon SNS.",
    },
    {
      id: "d2-19",
      domain: "d2",
      lesson: "d2-governance",
      prompt: "A security team must continuously check that every EBS volume is encrypted and see how resource settings changed over time. Which service should it use?",
      options: ["AWS Config", "Amazon CloudWatch", "AWS Shield", "Amazon Detective"],
      answer: [0],
      explanation: "AWS Config records configuration history and evaluates resources against rules such as \"EBS volumes must be encrypted\".",
    },
    {
      id: "d2-20",
      domain: "d2",
      lesson: "d2-governance",
      prompt: "A company must keep a record of all API activity in its account for seven years. What should it set up?",
      options: [
        "A CloudTrail trail that delivers log files to an Amazon S3 bucket",
        "A CloudWatch dashboard",
        "An IAM password policy",
        "An AWS Budgets alert",
      ],
      answer: [0],
      explanation: "CloudTrail event history covers recent activity; a trail delivers logs to S3, where you control retention.",
    },
    {
      id: "d2-21",
      domain: "d2",
      lesson: "d2-governance",
      prompt: "An auditor wants a list of every IAM user in the account with the status of their passwords, access keys, and MFA devices. Which IAM feature provides this?",
      options: ["IAM credential report", "AWS Cost and Usage Report", "IAM policy simulator", "AWS Health Dashboard"],
      answer: [0],
      explanation: "The credential report is a downloadable access report covering every user's credential status.",
    },
    {
      id: "d2-22",
      domain: "d2",
      lesson: "d2-governance",
      prompt: "A company wants to remove permissions that a role hasn't used in months. Which IAM capability shows when each service was last accessed?",
      options: ["Last accessed information (access advisor)", "IAM Identity Center", "AWS Artifact", "Amazon Inspector"],
      answer: [0],
      explanation: "Last accessed information shows which services an identity used and when, helping you tighten policies to least privilege.",
    },
    {
      id: "d2-23",
      domain: "d2",
      lesson: "d2-governance",
      prompt: "Which AWS services support auditing and compliance? (Choose two.)",
      options: ["AWS CloudTrail", "AWS Config", "Amazon Polly", "Amazon Lightsail", "AWS Amplify"],
      answer: [0, 1],
      explanation: "CloudTrail audits API activity and Config audits resource configuration. Polly, Lightsail, and Amplify aren't governance services.",
    },
    {
      id: "d2-24",
      domain: "d2",
      lesson: "d2-governance",
      type: "match",
      prompt: "Match each service to what it records or provides.",
      pairs: [
        ["Amazon CloudWatch", "Metrics, logs, and alarms"],
        ["AWS CloudTrail", "A record of API calls"],
        ["AWS Config", "Configuration history and rule compliance"],
        ["AWS Security Hub", "A central view of security findings and posture checks"],
      ],
      explanation: "Monitoring (CloudWatch), auditing (CloudTrail, Config), and a combined security view (Security Hub).",
    },
    // ── IAM ──
    {
      id: "d2-25",
      domain: "d2",
      lesson: "d2-iam",
      prompt: "What does the principle of least privilege mean?",
      options: [
        "Give every user administrator access to save time",
        "Grant only the permissions required to perform a task",
        "Share one set of credentials across a team",
        "Use the root user for all tasks",
      ],
      answer: [1],
      explanation: "Least privilege limits the damage from mistakes or stolen credentials. Start small and add permissions as needed.",
    },
    {
      id: "d2-26",
      domain: "d2",
      lesson: "d2-iam",
      prompt: "Twenty developers need identical permissions, and new developers join every month. What is the MOST efficient way to manage their permissions?",
      options: [
        "Attach a policy to each user individually",
        "Create an IAM group with the policy and add the developers to it",
        "Share one IAM user among all developers",
        "Give the developers the root user password",
      ],
      answer: [1],
      explanation: "Groups let you manage permissions once. New developers just join the group.",
    },
    {
      id: "d2-27",
      domain: "d2",
      lesson: "d2-iam",
      prompt: "An application on an EC2 instance needs to read objects from an S3 bucket. What is the MOST secure way to grant access?",
      options: [
        "Store an IAM user's access keys in the application code",
        "Attach an IAM role with the needed S3 permissions to the instance",
        "Make the bucket public",
        "Use the root user's access keys",
      ],
      answer: [1],
      explanation: "An IAM role gives the instance temporary, automatically rotated credentials. No long-term keys to leak.",
    },
    {
      id: "d2-28",
      domain: "d2",
      lesson: "d2-iam",
      prompt: "What is the difference between an AWS managed policy and a customer managed policy?",
      options: [
        "AWS managed policies are created and maintained by AWS; customer managed policies are written by you and can be attached to many identities",
        "Customer managed policies can only be attached to one user",
        "AWS managed policies can only deny actions",
        "There is no difference",
      ],
      answer: [0],
      explanation: "AWS managed policies cover common job functions and AWS updates them. Custom policies let you tailor exactly the permissions you need.",
    },
    {
      id: "d2-29",
      domain: "d2",
      lesson: "d2-iam",
      prompt: "A company must require that IAM users' passwords have at least 14 characters and include symbols. What should it configure?",
      options: ["An IAM account password policy", "An S3 bucket policy", "A security group", "An AWS Budgets alert"],
      answer: [0],
      explanation: "The account password policy sets length, complexity, reuse, and expiration rules for IAM users' passwords.",
    },
    {
      id: "d2-30",
      domain: "d2",
      lesson: "d2-iam",
      prompt: "An application needs database credentials that are rotated automatically on a schedule, without changing code. Which service should store them?",
      options: ["AWS Secrets Manager", "Amazon S3", "AWS Artifact", "Amazon CloudWatch"],
      answer: [0],
      explanation: "Secrets Manager stores secrets encrypted and can rotate them automatically, for example for Amazon RDS credentials.",
    },
    {
      id: "d2-31",
      domain: "d2",
      lesson: "d2-iam",
      prompt: "Which are IAM best practices? (Choose two.)",
      options: [
        "Grant least privilege",
        "Use IAM roles for applications instead of long-term access keys",
        "Share one IAM user among the whole team",
        "Embed access keys in source code",
        "Use the root user for daily administration",
      ],
      answer: [0, 1],
      explanation: "Least privilege and temporary credentials through roles reduce risk. Shared users, embedded keys, and daily root use increase it.",
    },
    {
      id: "d2-32",
      domain: "d2",
      lesson: "d2-iam",
      prompt: "A user's identity policy allows s3:* on a bucket. Another attached policy explicitly denies s3:DeleteObject. What happens when the user tries to delete an object?",
      options: [
        "The delete is allowed because the allow is broader",
        "The delete is denied because an explicit deny always wins",
        "The delete is allowed only from the console",
        "IAM picks whichever policy was attached most recently",
      ],
      answer: [1],
      explanation: "IAM evaluation: an explicit deny overrides any allow. Without any allow, the default is an implicit deny.",
    },
    // ── Root user and sign-in ──
    {
      id: "d2-33",
      domain: "d2",
      lesson: "d2-root",
      prompt: "Which tasks can ONLY the AWS account root user perform? (Choose two.)",
      options: [
        "Close the AWS account",
        "Change the account's root email address and account name",
        "Create an IAM user",
        "Launch an EC2 instance",
        "Create an S3 bucket",
      ],
      answer: [0, 1],
      explanation: "Closing the account and changing account settings such as the root email require the root user. IAM identities with permissions can do everyday tasks.",
    },
    {
      id: "d2-34",
      domain: "d2",
      lesson: "d2-root",
      prompt: "What is the BEST way to protect the AWS account root user?",
      options: [
        "Turn on MFA, use a strong password, and use the root user only for tasks that require it",
        "Create access keys for the root user and store them in a script",
        "Share the root password with the operations team",
        "Use the root user for all daily work so actions are easy to trace",
      ],
      answer: [0],
      explanation: "Protect root with MFA and a strong password, avoid root access keys, and do daily work with less-privileged identities.",
    },
    {
      id: "d2-35",
      domain: "d2",
      lesson: "d2-root",
      prompt: "A company has 40 AWS accounts. Employees should sign in once with their corporate credentials and reach the accounts and business applications they're assigned. Which service should it use?",
      options: ["AWS IAM Identity Center", "Amazon Cognito", "AWS Artifact", "AWS Secrets Manager"],
      answer: [0],
      explanation: "IAM Identity Center provides workforce single sign-on across AWS accounts and applications, and can connect to an existing identity provider.",
    },
    {
      id: "d2-36",
      domain: "d2",
      lesson: "d2-root",
      prompt: "A company wants employees to access AWS with the identities they already have in the corporate directory, without creating IAM users for them. What is this called?",
      options: ["Identity federation", "Consolidated billing", "Rightsizing", "Encryption in transit"],
      answer: [0],
      explanation: "Federation trusts an external identity provider (for example, through SAML 2.0) so users get temporary AWS credentials.",
    },
    {
      id: "d2-37",
      domain: "d2",
      lesson: "d2-root",
      prompt: "An auditor who works in a company's security account needs temporary read-only access to resources in its production account. What should the company use?",
      options: ["A cross-account IAM role", "The production account's root user", "A shared IAM user with a password", "A public S3 bucket"],
      answer: [0],
      explanation: "The auditor assumes a role in the production account and receives temporary credentials limited to that role's permissions.",
    },
    {
      id: "d2-38",
      domain: "d2",
      lesson: "d2-root",
      type: "match",
      prompt: "Match each identity option to its best use.",
      pairs: [
        ["IAM role", "Temporary credentials for a service or another account"],
        ["IAM group", "Users who share the same permissions"],
        ["IAM Identity Center", "Workforce single sign-on across many accounts"],
        ["Amazon Cognito", "Sign-up and sign-in for an app's customers"],
      ],
      explanation: "Roles for temporary access, groups for shared permissions, Identity Center for employees, Cognito for your app's end users.",
    },
    // ── Security services ──
    {
      id: "d2-39",
      domain: "d2",
      lesson: "d2-services",
      prompt: "A company wants a managed service that continuously analyzes CloudTrail events, VPC Flow Logs, and DNS logs to detect threats such as compromised instances. Which service should it use?",
      options: ["Amazon GuardDuty", "Amazon Inspector", "AWS Artifact", "AWS Config"],
      answer: [0],
      explanation: "GuardDuty is intelligent threat detection that uses log data and threat intelligence to find malicious activity.",
    },
    {
      id: "d2-40",
      domain: "d2",
      lesson: "d2-services",
      prompt: "A company's public website is a frequent target of DDoS attacks. It wants enhanced protection and access to the AWS Shield Response Team. What should it use?",
      options: ["AWS Shield Standard", "AWS Shield Advanced", "Amazon Macie", "AWS Secrets Manager"],
      answer: [1],
      explanation: "Shield Standard protects every customer automatically at no extra cost. Shield Advanced adds enhanced detection, cost protection, and expert response.",
    },
    {
      id: "d2-41",
      domain: "d2",
      lesson: "d2-services",
      prompt: "A web application receives SQL injection attempts and requests from a known malicious IP range. Which service filters these HTTP requests?",
      options: ["AWS WAF", "AWS Shield Standard", "Amazon GuardDuty", "AWS Direct Connect"],
      answer: [0],
      explanation: "AWS WAF inspects web requests and blocks them with rules, for example against SQL injection or by IP address.",
    },
    {
      id: "d2-42",
      domain: "d2",
      lesson: "d2-services",
      prompt: "A company with many accounts in AWS Organizations wants to apply the same AWS WAF rules to every account from one place. Which service should it use?",
      options: ["AWS Firewall Manager", "Amazon Inspector", "AWS CloudHSM", "Amazon Detective"],
      answer: [0],
      explanation: "Firewall Manager centrally configures WAF, Shield Advanced, and security group policies across accounts.",
    },
    {
      id: "d2-43",
      domain: "d2",
      lesson: "d2-services",
      prompt: "A security team wants one dashboard that aggregates findings from GuardDuty, Inspector, and Macie and runs automated checks against security best practices. Which service provides this?",
      options: ["AWS Security Hub", "AWS Budgets", "Amazon CloudFront", "AWS Health Dashboard"],
      answer: [0],
      explanation: "Security Hub collects and prioritizes findings across services and accounts and runs best-practice checks.",
    },
    {
      id: "d2-44",
      domain: "d2",
      lesson: "d2-services",
      prompt: "A company wants automated, continuous scans of its EC2 instances, container images, and Lambda functions for software vulnerabilities. Which service should it use?",
      options: ["Amazon Inspector", "Amazon Macie", "AWS WAF", "AWS Artifact"],
      answer: [0],
      explanation: "Amazon Inspector finds software vulnerabilities and unintended network exposure.",
    },
    {
      id: "d2-45",
      domain: "d2",
      lesson: "d2-services",
      prompt: "Where can a company find AWS security bulletins, best-practice articles, and answers to common security questions? (Choose two.)",
      options: ["AWS Security Blog", "AWS Knowledge Center", "AWS Pricing Calculator", "Amazon Polly", "AWS Cost Explorer"],
      answer: [0, 1],
      explanation: "The AWS Security Blog, AWS Security Center, and AWS Knowledge Center publish security guidance. The others are cost or AI services.",
    },
    {
      id: "d2-46",
      domain: "d2",
      lesson: "d2-services",
      prompt: "A company wants to use a third-party firewall product it already knows, and pay for it through its AWS bill. Where can it find it?",
      options: ["AWS Marketplace", "AWS Artifact", "AWS Systems Manager", "Amazon Connect"],
      answer: [0],
      explanation: "AWS Marketplace offers third-party software, including security products, billed through your AWS account.",
    },
    {
      id: "d2-47",
      domain: "d2",
      lesson: "d2-services",
      prompt: "Which services help identify threats or vulnerabilities in an AWS environment? (Choose two.)",
      options: ["Amazon GuardDuty", "Amazon Inspector", "Amazon CloudFront", "Amazon Route 53", "Amazon Lightsail"],
      answer: [0, 1],
      explanation: "GuardDuty detects threats and Inspector finds vulnerabilities. CloudFront, Route 53, and Lightsail deliver content, DNS, and simple servers.",
    },
    {
      id: "d2-48",
      domain: "d2",
      lesson: "d2-services",
      type: "order",
      prompt: "A request travels from the internet to a web server in a VPC. Order these protections from the OUTSIDE in.",
      items: ["AWS Shield at the AWS edge", "AWS WAF rules on the CloudFront distribution", "Network ACL on the subnet", "Security group on the instance"],
      explanation: "Defense in depth: DDoS protection and web filtering at the edge, then subnet-level and instance-level firewalls.",
    },
  ],

  cards: [
    { id: "c2-shared", domain: "d2", kind: "concept", term: "Shared responsibility", definition: "AWS: security OF the cloud. You: security IN the cloud" },
    { id: "c2-sharedctl", domain: "d2", kind: "concept", term: "Shared controls", definition: "Patch management, configuration management, awareness and training" },
    { id: "c2-inherited", domain: "d2", kind: "concept", term: "Inherited controls", definition: "Physical and environmental controls fully provided by AWS" },
    { id: "c2-leastpriv", domain: "d2", kind: "concept", term: "Least privilege", definition: "Grant only the permissions a task needs" },
    { id: "c2-deny", domain: "d2", kind: "concept", term: "Explicit deny", definition: "Always overrides an allow in IAM policy evaluation" },
    { id: "c2-root", domain: "d2", kind: "concept", term: "Root user", definition: "Full account access: MFA on, no access keys, root-only tasks" },
    { id: "c2-federation", domain: "d2", kind: "concept", term: "Federation", definition: "Sign in with an existing corporate identity provider" },
    { id: "c2-mfa", domain: "d2", kind: "concept", term: "MFA", definition: "A second factor on top of the password" },
    { id: "c2-atrest", domain: "d2", kind: "concept", term: "Encryption at rest vs in transit", definition: "Stored data (KMS keys) vs moving data (TLS)" },
    { id: "c2-credreport", domain: "d2", kind: "concept", term: "IAM credential report", definition: "Every user's password, access key, and MFA status" },
    { id: "s-iam", domain: "d2", kind: "service", term: "AWS IAM", definition: "Users, groups, roles, and policies for access control" },
    { id: "s-identitycenter", domain: "d2", kind: "service", term: "AWS IAM Identity Center", definition: "Workforce single sign-on to accounts and apps" },
    { id: "s-cognito", domain: "d2", kind: "service", term: "Amazon Cognito", definition: "Sign-up and sign-in for your app's users" },
    { id: "s-secrets", domain: "d2", kind: "service", term: "AWS Secrets Manager", definition: "Store and automatically rotate secrets" },
    { id: "s-ssm", domain: "d2", kind: "service", term: "AWS Systems Manager", definition: "Operate and patch fleets; Parameter Store for config values" },
    { id: "s-artifact", domain: "d2", kind: "service", term: "AWS Artifact", definition: "Download AWS compliance reports and accept agreements" },
    { id: "s-kms", domain: "d2", kind: "service", term: "AWS KMS", definition: "Create and control encryption keys" },
    { id: "s-acm", domain: "d2", kind: "service", term: "AWS Certificate Manager", definition: "Provision and renew TLS certificates" },
    { id: "s-cloudhsm", domain: "d2", kind: "service", term: "AWS CloudHSM", definition: "Dedicated single-tenant hardware security modules" },
    { id: "s-cloudtrail", domain: "d2", kind: "service", term: "AWS CloudTrail", definition: "Record of API calls: who, what, when, from where" },
    { id: "s-cloudwatch", domain: "d2", kind: "service", term: "Amazon CloudWatch", definition: "Metrics, logs, dashboards, and alarms" },
    { id: "s-config", domain: "d2", kind: "service", term: "AWS Config", definition: "Configuration history and compliance rules" },
    { id: "s-securityhub", domain: "d2", kind: "service", term: "AWS Security Hub", definition: "Central security findings and best-practice checks" },
    { id: "s-guardduty", domain: "d2", kind: "service", term: "Amazon GuardDuty", definition: "Threat detection from logs and threat intelligence" },
    { id: "s-inspector", domain: "d2", kind: "service", term: "Amazon Inspector", definition: "Automated vulnerability scanning" },
    { id: "s-macie", domain: "d2", kind: "service", term: "Amazon Macie", definition: "Discover sensitive data such as PII in S3" },
    { id: "s-detective", domain: "d2", kind: "service", term: "Amazon Detective", definition: "Investigate the root cause of security findings" },
    { id: "s-waf", domain: "d2", kind: "service", term: "AWS WAF", definition: "Filter malicious web requests (SQL injection, XSS, IPs)" },
    { id: "s-shield", domain: "d2", kind: "service", term: "AWS Shield", definition: "DDoS protection: Standard free, Advanced enhanced" },
    { id: "s-fwmanager", domain: "d2", kind: "service", term: "AWS Firewall Manager", definition: "Central firewall rules across accounts" },
    { id: "s-ram", domain: "d2", kind: "service", term: "AWS Resource Access Manager", definition: "Share resources with other accounts" },
    { id: "s-directory", domain: "d2", kind: "service", term: "AWS Directory Service", definition: "Managed Microsoft Active Directory on AWS" },
  ],

  challenges: [
    {
      id: "ch-shared-ec2",
      domain: "d2",
      lesson: "d2-shared",
      title: "Sort the EC2 duties",
      goal: "On the Amazon EC2 tab, assign all six tasks to AWS or to you correctly.",
      hint: "On EC2 you manage the guest OS and everything you install on it.",
      takeaway: "With infrastructure services like EC2, the customer owns the OS, applications, firewall rules, and data.",
      render: (onSolved) => <ResponsibilityShiftLab goal="ec2" onSolved={onSolved} />,
    },
    {
      id: "ch-shared-shift",
      domain: "d2",
      lesson: "d2-shared",
      title: "Watch the line move",
      goal: "Get every task right on all three tabs: EC2, RDS, and Lambda.",
      hint: "RDS takes over OS and engine patching. Lambda takes over servers, OS, runtime, and scaling.",
      takeaway: "Responsibility shifts toward AWS as services get more managed, but your data, code, and access are always yours.",
      render: (onSolved) => <ResponsibilityShiftLab goal="allServices" onSolved={onSolved} />,
    },
  ],
});
