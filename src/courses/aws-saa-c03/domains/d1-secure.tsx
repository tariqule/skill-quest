import { Flow, Layers, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { VpcBuilderLab } from "../labs";
import { SgVsNacl } from "../visuals";

/**
 * Domain 1: Design Secure Architectures (30% of SAA-C03 scored content).
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "Design Secure Architectures",
    world: "The Iron Citadel",
    weight: 30,
    emoji: "🛡️",
    color: "#f87171",
    summary: "How to design AWS systems that keep the wrong people out. You'll cover permissions, managing many accounts, private networks, threat protection, private links, encryption and keeping data safe.",
  },

  tasks: [
    {
      id: "1.1",
      title: "Design secure access to AWS resources",
      covers: [
        "Control access across multiple accounts, with federated identity (IAM, IAM Identity Center)",
        "Know the AWS global infrastructure, the shared responsibility model, and least privilege",
        "Protect root users and IAM users (for example, MFA)",
        "Design a flexible authorization model with IAM users, groups, roles, and policies",
        "Design role-based access: AWS STS, role switching, cross-account access",
        "Design a multi-account security strategy (AWS Control Tower, SCPs)",
        "Decide when to use resource-based policies, and when to federate a directory with IAM roles",
      ],
    },
    {
      id: "1.2",
      title: "Design secure workloads and applications",
      covers: [
        "Secure application configuration and credentials; know AWS service endpoints",
        "Control ports, protocols, and network traffic",
        "Pick security services by use case (Cognito, GuardDuty, Macie) and defend against external threats (DDoS, SQL injection)",
        "Design VPCs with security groups, route tables, network ACLs, and NAT gateways",
        "Segment networks with public and private subnets",
        "Integrate Shield, WAF, IAM Identity Center, and Secrets Manager to secure applications",
        "Secure external connections to and from AWS (VPN, Direct Connect)",
      ],
    },
    {
      id: "1.3",
      title: "Determine appropriate data security controls",
      covers: [
        "Data access and governance, recovery, retention, and classification",
        "Align AWS technologies with compliance requirements",
        "Encrypt data at rest (AWS KMS) and in transit (TLS with ACM)",
        "Write access policies for encryption keys; rotate keys and renew certificates",
        "Implement backups and replication",
        "Implement policies for data access, lifecycle, and protection",
      ],
    },
  ],

  lessons: [
    {
      id: "d1-start-keycards",
      level: "beginner",
      task: "1.1",
      title: "Who can do what: users, roles and permissions",
      check: ["saa-b1-01", "saa-b1-02"],
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "🙋", title: "User", text: "A person with their own long-term sign-in. Like an employee badge.", color: "#f87171" },
            { icon: "🎭", title: "Role", text: "Permissions you borrow for a short time. Like a hotel key card that stops working at checkout.", color: "#f87171" },
            { icon: "📜", title: "Policy", text: "The written rules that say which doors a badge or card opens.", color: "#f87171" },
          ]}
        />
      ),
      points: [
        "A **solutions architect** designs how a system is put together on AWS. Security comes first, because a design that leaks data isn't a good design.",
        "Think of a hotel. The front desk gives you a key card that opens your room and the gym, but not other guests' rooms. AWS works the same way with **IAM** (Identity and Access Management).",
        "An IAM **user** is a person with a long-term sign-in. An IAM **role** is a set of permissions that a person or a program borrows for a short time.",
        "A **policy** is a document that lists what's allowed. If nothing allows an action, AWS blocks it.",
      ],
      tip: "Programs running on AWS, such as an app on a server, should use a role. Roles hand out short-lived credentials, so there's no password to leak.",
    },
    {
      id: "d1-start-private-network",
      level: "beginner",
      task: "1.2",
      title: "Your own private network: the VPC",
      check: ["saa-b1-03", "saa-b1-04"],
      visual: (
        <Layers
          layers={[
            { name: "Public subnet (the reception)", color: "#38bdf8", items: ["🚪 Faces the internet", "⚖️ Load balancer that greets visitors"] },
            { name: "Private subnet (the back offices)", color: "#34d399", items: ["🖥️ App servers", "🗄️ Databases", "🚫 No direct path in from the internet"] },
          ]}
        />
      ),
      points: [
        "A **VPC** (virtual private cloud) is your own private network inside AWS. Nobody else's servers share it.",
        "Picture an office building. Visitors can walk into reception, but the back offices need a badge. In a VPC, the reception is a **public subnet** and the back offices are **private subnets**.",
        "A **subnet** is a section of the VPC. You put things the internet must reach in public subnets, and everything else, like databases, in private ones.",
        "A **security group** is a guard at each server's door. It lets in only the traffic you list.",
      ],
      tip: "When in doubt, keep it private. Only the parts that really must face the internet belong in a public subnet.",
    },
    {
      id: "d1-start-locking-data",
      level: "beginner",
      task: "1.3",
      title: "Keeping data safe: encryption and backups",
      check: ["saa-b1-05", "saa-b1-06"],
      visual: (
        <Flow
          color="#a78bfa"
          steps={[
            { icon: "📄", label: "Your data", sub: "Readable by anyone who gets it" },
            { icon: "🔑", label: "Encrypt with a key", sub: "AWS KMS looks after the key" },
            { icon: "🔒", label: "Scrambled data", sub: "Useless without the key" },
            { icon: "🧳", label: "Back it up", sub: "A copy you can restore if something goes wrong" },
          ]}
        />
      ),
      points: [
        "**Encryption** scrambles data so only someone with the right key can read it. It's like locking papers in a safe: stealing the safe doesn't give you the papers.",
        "On AWS, **AWS KMS** (Key Management Service) creates and guards encryption keys. Most storage services can encrypt with it at the flick of a setting.",
        "A **backup** is a spare copy of your data. If someone deletes or damages the original, you restore the copy.",
        "Good designs do both: encrypt data so it can't be read, and back it up so it can't be lost.",
      ],
      tip: "Encryption protects against people reading your data. Backups protect against losing it. They solve different problems.",
    },
    {
      id: "d1-iam",
      task: "1.1",
      title: "IAM, least privilege, and the shared responsibility model",
      check: ["d1-01", "d1-04"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "👑", title: "Root user", text: "Turn on MFA, delete its access keys and lock it away. Use it only for the few jobs that need it.", color: "#f87171" },
              { icon: "👥", title: "Users and groups", text: "Attach policies to groups, not to single users. Federation usually beats long-lived users.", color: "#f87171" },
              { icon: "🎭", title: "Roles", text: "Temporary credentials from STS. Used by EC2 (through an instance profile), Lambda, other accounts and federated users.", color: "#f87171" },
              { icon: "📜", title: "Policies", text: "Identity-based ones attach to a user or role. Resource-based ones attach to a bucket, key, queue and so on.", color: "#f87171" },
            ]}
          />
          <Flow
            color="#f87171"
            steps={[
              { icon: "⛔", label: "Is there a Deny?", sub: "A deny always wins" },
              { icon: "🚧", label: "Within SCPs and boundaries?", sub: "These guardrails cap what can be allowed" },
              { icon: "✅", label: "Is there an Allow?", sub: "In an identity or resource policy" },
              { icon: "🔒", label: "If not, it's denied", sub: "Nothing is allowed by default" },
            ]}
          />
          <Layers
            layers={[
              { name: "You: security IN the cloud", color: "#38bdf8", items: ["Data and encryption choices", "IAM", "Patching the OS on EC2", "Security groups and NACLs", "Application code"] },
              { name: "AWS: security OF the cloud", color: "#f59e0b", items: ["Data centers", "Hardware", "Hypervisor", "Global network", "Managed-service infrastructure"] },
            ]}
          />
        </div>
      ),
      points: [
        "**Least privilege** means granting only the actions and resources a job needs. You can tighten it further with conditions, such as the caller's IP address, MFA, tags or a VPC endpoint.",
        "Give workloads roles, never access keys. An EC2 instance profile or a Lambda execution role hands out short-lived credentials automatically.",
        "A **permissions boundary** caps what an identity-based policy can grant. That lets developers create roles without giving themselves more power than you intended.",
        "The more managed the service, the more AWS handles. You patch the operating system on EC2, but not on Lambda or RDS.",
      ],
      tip: "If an app on EC2 needs to read S3, the answer is an IAM role attached through an instance profile. Any answer that stores access keys on the instance is wrong.",
    },
    {
      id: "d1-multiaccount",
      task: "1.1",
      title: "Multi-account strategy, federation, and cross-account roles",
      check: ["d1-10", "d1-13"],
      visual: (
        <div className="grid gap-4">
          <Layers
            layers={[
              { name: "Management account", color: "#f59e0b", items: ["AWS Organizations", "Consolidated billing", "No workloads run here"] },
              { name: "Security OU", color: "#f87171", items: ["Log archive account", "Security tooling account"] },
              { name: "Workloads OU (SCPs apply)", color: "#34d399", items: ["Prod account", "Dev account", "Sandbox account"] },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🏗️", title: "AWS Control Tower", text: "Sets up a governed landing zone: Organizations, account factory, centralized logging, and preventive and detective controls.", color: "#a78bfa" },
              { icon: "🚧", title: "Service control policies", text: "Cap the maximum permissions in member accounts, including their root users. They grant nothing by themselves.", color: "#a78bfa" },
              { icon: "🔑", title: "IAM Identity Center", text: "One sign-in for the workforce across all accounts, with permission sets, using its own directory, AD, or an external IdP.", color: "#a78bfa" },
              { icon: "🔁", title: "Cross-account role", text: "A role in the target account trusts the source account. Users call sts:AssumeRole to get temporary credentials.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Separate accounts are the strongest wall you can put between workloads. Companies split them by environment, team or workload, and group them into **organizational units** (OUs).",
        "**Service control policies** (SCPs) don't apply to the management account. An Allow in an SCP doesn't grant anything by itself: the user or role still needs an IAM Allow.",
        "Sign staff in through **IAM Identity Center**, or SAML 2.0 into IAM roles, instead of creating IAM users in every account. This is called **federation**.",
        "A resource-based policy on an S3 bucket, KMS key, SQS queue or Lambda function can give another account access directly, with no role to assume.",
        "**AWS RAM** (Resource Access Manager) shares resources such as subnets and Transit Gateways with other accounts in the organization.",
      ],
      tip: "If the question says no account in the organization may do something, not even its administrators, use an SCP. An SCP on its own never answers a question about granting access.",
    },
    {
      id: "d1-vpc-security",
      task: "1.2",
      title: "VPC design: subnets, routes, security groups, and NACLs",
      check: ["d1-19", "d1-22"],
      visual: (
        <div className="grid gap-6">
          <VpcBuilderLab />
          <SgVsNacl />
        </div>
      ),
      points: [
        "A subnet is **public** when its route table sends internet traffic (0.0.0.0/0) to an internet gateway. Load balancers and NAT gateways go there. App servers and databases go in private subnets.",
        "A **NAT gateway** lets private instances reach out, for patches or APIs, while nothing on the internet can connect in. Each one lives in one AZ, so use one per AZ for resilience.",
        "A **security group** is a stateful allow-list on each network interface. You can chain them: the database group allows port 3306 only from the app tier's group.",
        "A **network ACL** is a stateless filter on a subnet, with numbered allow and deny rules. Use it to block specific IP ranges, and remember to allow the ephemeral ports that replies come back on.",
        "Use at least two AZs, with a public and a private subnet in each. Pick IP ranges (CIDR blocks) that won't clash with networks you'll connect later.",
      ],
      tip: "To block one malicious IP address, use a network ACL deny rule, because security groups can't deny. To let only the web tier reach the database, have one security group reference the other.",
    },
    {
      id: "d1-edge-protection",
      task: "1.2",
      title: "Threat protection: WAF, Shield, GuardDuty, and friends",
      check: ["d1-28", "d1-31"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#f87171"
            steps={[
              { icon: "🌍", label: "Internet traffic" },
              { icon: "🛡️", label: "Shield", sub: "DDoS protection at the network layers. Standard is on automatically" },
              { icon: "🧱", label: "WAF web ACL", sub: "Web request rules: SQL injection, cross-site scripting, rate limits, countries" },
              { icon: "🌐", label: "CloudFront, ALB or API Gateway", sub: "Where WAF attaches" },
              { icon: "🖥️", label: "Application" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🕵️", title: "GuardDuty", text: "Spots threats in CloudTrail events, VPC Flow Logs, DNS logs and more, such as crypto-mining or stolen credentials.", color: "#38bdf8" },
              { icon: "🔍", title: "Macie", text: "Discovers and classifies sensitive data such as PII in S3 buckets.", color: "#38bdf8" },
              { icon: "🩺", title: "Inspector", text: "Scans EC2 instances, container images in ECR, and Lambda functions for software vulnerabilities.", color: "#38bdf8" },
              { icon: "📊", title: "Security Hub", text: "Aggregates findings and runs posture checks across accounts in one place.", color: "#38bdf8" },
              { icon: "🔐", title: "Secrets Manager", text: "Stores database credentials and API keys, with automatic rotation.", color: "#34d399" },
              { icon: "🪪", title: "Cognito", text: "User pools handle sign-up and sign-in for your app's customers. Identity pools give them temporary AWS credentials.", color: "#34d399" },
              { icon: "🔥", title: "Network Firewall", text: "Managed stateful firewall and intrusion prevention for VPC traffic, including domain filtering.", color: "#34d399" },
              { icon: "🗂️", title: "Firewall Manager", text: "Centrally applies WAF, Shield Advanced, security group, and Network Firewall policies across an organization.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "**Shield Standard** protects every AWS customer from DDoS floods at no cost. **Shield Advanced** adds tailored detection, the Shield Response Team, and refunds for scaling charges caused by an attack.",
        "**AWS WAF** filters web requests using managed or custom rules, rate limits, IP lists and country matching. It attaches to CloudFront, ALB, API Gateway, AppSync and Cognito user pools.",
        "Each tool has one job. GuardDuty detects threats, Detective investigates them, Macie finds sensitive data, Inspector finds software weaknesses, and Security Hub shows it all in one place.",
        "Keep credentials out of code and machine images. Secrets Manager stores and rotates them. Parameter Store SecureString is cheaper but has no built-in rotation.",
      ],
      tip: "SQL injection or cross-site scripting points to AWS WAF. A large DDoS where you want cost protection and a response team points to Shield Advanced. Finding personal data in S3 points to Macie.",
    },
    {
      id: "d1-connectivity",
      task: "1.2",
      title: "Private connectivity: endpoints, VPN, and Direct Connect",
      check: ["d1-37", "d1-40"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={2}
            tiles={[
              { icon: "🚪", title: "Gateway endpoint", text: "For S3 and DynamoDB only. It's a route-table entry with no extra charge. Limit it with an endpoint policy.", color: "#34d399" },
              { icon: "🔌", title: "Interface endpoint (PrivateLink)", text: "A network interface with a private IP in your subnet. Works for many AWS services, partner services and your own. Charged per hour and per GB.", color: "#34d399" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🔒", title: "Site-to-Site VPN", text: "Encrypted IPsec tunnels over the internet to a virtual private gateway or Transit Gateway. Ready in minutes.", color: "#38bdf8" },
              { icon: "🧵", title: "Direct Connect", text: "A dedicated private line into AWS: consistent latency and high bandwidth. Takes time to provision and isn't encrypted by default.", color: "#38bdf8" },
              { icon: "💻", title: "Client VPN", text: "Managed remote access for individual users' devices into a VPC.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "A **VPC endpoint** keeps traffic to AWS services off the internet. Private subnets then don't need a NAT gateway to reach S3 or DynamoDB.",
        "A bucket policy can insist that requests come through one particular VPC endpoint, using the aws:SourceVpce condition key.",
        "Direct Connect isn't encrypted by default. To encrypt it, run a Site-to-Site VPN over it, or use MACsec on connections that support it.",
        "A common hybrid design uses Direct Connect as the main path and a Site-to-Site VPN as a cheaper backup.",
        "**PrivateLink** shares a service that sits behind a Network Load Balancer with other VPCs. You don't need peering, and overlapping IP ranges aren't a problem.",
      ],
      tip: "If it's needed by tomorrow, or must be encrypted over the internet, choose Site-to-Site VPN. If it needs steady, dedicated bandwidth, choose Direct Connect.",
    },
    {
      id: "d1-encryption",
      task: "1.3",
      title: "Encryption and key management: KMS, CloudHSM, and ACM",
      check: ["d1-44", "d1-47"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "🗝️", label: "KMS key", sub: "Never leaves KMS unencrypted" },
              { icon: "📦", label: "GenerateDataKey", sub: "Returns a plain data key and an encrypted copy" },
              { icon: "🔐", label: "Encrypt the data locally", sub: "Then throw away the plain key" },
              { icon: "💾", label: "Store the data and the encrypted key together", sub: "This is envelope encryption" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🪣", title: "SSE-S3", text: "The default for new S3 objects. S3 manages the keys. The simplest choice.", color: "#f59e0b" },
              { icon: "🗝️", title: "SSE-KMS", text: "Uses KMS keys, with key policies and a CloudTrail record of every use. S3 Bucket Keys cut the KMS request cost.", color: "#f59e0b" },
              { icon: "🧰", title: "CloudHSM", text: "Hardware security modules in your VPC, used by you alone. You manage the keys and users, and AWS can't get to them.", color: "#f59e0b" },
              { icon: "📜", title: "ACM", text: "Free public TLS certificates that renew automatically for ELB, CloudFront, and API Gateway.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "A **customer managed KMS key** lets you control the key policy, grants and rotation, and lets you disable or schedule deletion. AWS managed keys are simpler, but you can't change their policy.",
        "The key policy must allow someone to use the key. For use from another account, both the key policy and that account's IAM policy must allow it.",
        "Turn on automatic rotation for customer managed keys. It's yearly by default, and the old key material is kept, so existing data still decrypts.",
        "Encrypt data in transit with TLS. Put ACM certificates on the load balancer or CloudFront, and add a bucket policy that denies requests where aws:SecureTransport is false.",
        "For CloudFront, request the ACM certificate in us-east-1 (N. Virginia). Certificates you import yourself don't renew automatically.",
      ],
      tip: "If the customer needs sole control of the HSM, or strict single-tenant key storage, choose CloudHSM. If they need to audit every key use and write detailed key policies, choose SSE-KMS with a customer managed key.",
    },
    {
      id: "d1-data-protection",
      task: "1.3",
      title: "Data protection: backups, replication, retention, and compliance",
      check: ["d1-52", "d1-55"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🕰️", title: "S3 Versioning", text: "Keeps every version, so overwrites and deletes can be undone. Required for replication and Object Lock.", color: "#34d399" },
              { icon: "🔏", title: "S3 Object Lock", text: "Write once, read many. In compliance mode nobody, not even root, can shorten the hold. In governance mode, a special permission can. Legal holds have no end date.", color: "#34d399" },
              { icon: "🔁", title: "S3 Replication", text: "Cross-Region or same-Region copies, optionally to another account. Replication Time Control gives a 15-minute SLA.", color: "#34d399" },
              { icon: "🧳", title: "AWS Backup", text: "Central backup plans across EC2, EBS, RDS, DynamoDB, EFS, FSx, and more, with cross-Region and cross-account copies.", color: "#38bdf8" },
              { icon: "🏦", title: "Backup Vault Lock", text: "Makes backups in a vault immutable so they can't be deleted early, even by an administrator.", color: "#38bdf8" },
              { icon: "📋", title: "Config and Artifact", text: "Config records resource changes and checks them against rules. Artifact provides AWS compliance reports such as SOC and PCI.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Start by working out how sensitive each kind of data is. Macie helps find sensitive data. Then decide who can reach it, how long to keep it and how you'll recover it.",
        "Turning on **S3 Block Public Access** for the whole account stops buckets from being made public by accident. Bucket policies and access points control everything else.",
        "**MFA Delete** asks for MFA before anyone can permanently delete an object version or change the versioning setting.",
        "CloudTrail records API calls. Sending an organization trail to a locked-down log-archive account keeps the audit record safe from tampering.",
      ],
      tip: "If records must not be changed or deleted for 7 years, by anyone, use S3 Object Lock in compliance mode. For backups, the matching tool is Backup Vault Lock.",
    },
  ],

  questions: [
    // ── Start here ──
    {
      id: "saa-b1-01",
      domain: "d1",
      lesson: "d1-start-keycards",
      level: "beginner",
      prompt: "Which AWS service decides who can sign in and what they're allowed to do?",
      options: ["AWS IAM", "Amazon S3", "Amazon CloudFront", "AWS Auto Scaling"],
      answer: [0],
      explanation: "IAM (Identity and Access Management) is AWS's permissions system. It's like the front desk of a hotel: it issues key cards and decides which doors each one opens.",
    },
    {
      id: "saa-b1-02",
      domain: "d1",
      lesson: "d1-start-keycards",
      level: "beginner",
      prompt: "What makes an IAM role different from an IAM user?",
      options: [
        "A role's permissions are borrowed for a short time, using temporary credentials",
        "A role has a permanent password",
        "A role can only be used by the root user",
        "A role has no permissions at all",
      ],
      answer: [0],
      explanation: "A user has a long-term sign-in, like an employee badge. A role is borrowed for a short time, like a hotel key card that stops working at checkout, which is why apps should use roles.",
    },
    {
      id: "saa-b1-03",
      domain: "d1",
      lesson: "d1-start-private-network",
      level: "beginner",
      prompt: "What is an Amazon VPC?",
      options: ["Your own private network inside AWS", "A type of database", "A video streaming service", "A billing report"],
      answer: [0],
      explanation: "A VPC (virtual private cloud) is a private network that belongs to you. You decide which parts face the internet and which stay hidden.",
    },
    {
      id: "saa-b1-04",
      domain: "d1",
      lesson: "d1-start-private-network",
      level: "beginner",
      prompt: "Where should a company's customer database usually go?",
      options: ["In a private subnet, out of direct reach of the internet", "In a public subnet, so anyone can reach it", "On a laptop", "In an email attachment"],
      answer: [0],
      explanation: "A database holds valuable data, so keep it in a private subnet, like a back office that visitors can't walk into. Only the parts that must face the internet belong in public subnets.",
    },
    {
      id: "saa-b1-05",
      domain: "d1",
      lesson: "d1-start-locking-data",
      level: "beginner",
      prompt: "Which AWS service creates and looks after encryption keys?",
      options: ["AWS KMS", "Amazon EC2", "Amazon Route 53", "AWS Budgets"],
      answer: [0],
      explanation: "AWS KMS (Key Management Service) creates and guards the keys used to encrypt your data. Most AWS storage services can use it with a simple setting.",
    },
    {
      id: "saa-b1-06",
      domain: "d1",
      lesson: "d1-start-locking-data",
      level: "beginner",
      prompt: "Someone deletes an important file by mistake. What would let you get it back?",
      options: ["A backup", "Encryption", "A stronger password", "A bigger server"],
      answer: [0],
      explanation: "A backup is a spare copy you can restore. Encryption stops people reading data, but it doesn't help if the data is gone.",
    },
    // ── IAM ──
    {
      id: "d1-01",
      domain: "d1",
      lesson: "d1-iam",
      prompt:
        "An application running on Amazon EC2 instances needs to read objects from an Amazon S3 bucket. The security team forbids long-term credentials on the instances. What should a solutions architect do?",
      options: [
        "Create an IAM role with read access to the bucket and attach it to the instances through an instance profile",
        "Create an IAM user, generate access keys, and store them in the application's configuration file",
        "Make the bucket public and restrict access with a referer header check",
        "Store the IAM user's access keys in the EC2 user data script",
      ],
      answer: [0],
      explanation:
        "An instance profile delivers temporary role credentials that rotate automatically through the instance metadata service. Access keys in files or user data are long-term secrets that can leak.",
    },
    {
      id: "d1-02",
      domain: "d1",
      lesson: "d1-iam",
      prompt: "A company has just created a new AWS account. Which action is an AWS security best practice for the root user?",
      options: [
        "Enable MFA on the root user and use it only for tasks that require root",
        "Create access keys for the root user for use in automation scripts",
        "Share the root user password with the operations team for emergencies",
        "Use the root user for daily administration to avoid permission errors",
      ],
      answer: [0],
      explanation: "Protect the root user with MFA, don't create root access keys, and do daily work with federated or IAM identities that have only the permissions they need.",
    },
    {
      id: "d1-03",
      domain: "d1",
      lesson: "d1-iam",
      prompt:
        "A team lead wants developers to create IAM roles for their Lambda functions, but the developers must not be able to create roles with more permissions than the developers themselves have. Which TWO measures together achieve this? (Choose two.)",
      options: [
        "Define a permissions boundary policy that limits the maximum permissions for new roles",
        "Allow iam:CreateRole only when the request attaches that permissions boundary (iam:PermissionsBoundary condition)",
        "Give the developers the AdministratorAccess managed policy",
        "Attach a service control policy that allows iam:CreateRole",
        "Have the developers share one IAM user so actions can be audited",
      ],
      answer: [0, 1],
      explanation:
        "A permissions boundary caps the effective permissions of any role it's attached to, and the condition forces developers to attach it. An SCP Allow never grants permissions, and shared users break accountability.",
    },
    {
      id: "d1-04",
      domain: "d1",
      lesson: "d1-iam",
      prompt:
        "An IAM user's identity policy allows s3:* on a bucket. The bucket policy contains a statement that denies s3:DeleteObject for all principals. What happens when the user tries to delete an object?",
      options: [
        "The request is denied because an explicit deny overrides any allow",
        "The request is allowed because the identity policy grants s3:*",
        "The request is allowed because identity policies are evaluated before bucket policies",
        "The request is denied only if the user has no MFA",
      ],
      answer: [0],
      explanation: "AWS evaluates all applicable policies together. Any explicit Deny ends evaluation with a deny, regardless of how many Allows exist.",
    },
    {
      id: "d1-05",
      domain: "d1",
      lesson: "d1-iam",
      prompt:
        "A company runs a self-managed database on Amazon EC2 and another workload on Amazon RDS. Under the shared responsibility model, which task is the company's responsibility for the EC2-hosted database but AWS's responsibility for the RDS database?",
      options: ["Patching the database engine and operating system", "Configuring security groups", "Encrypting the data", "Managing database user accounts"],
      answer: [0],
      explanation:
        "On EC2 you manage the guest OS and software. On RDS, AWS patches the OS and engine during maintenance windows. Security groups, encryption choices, and database users remain your job in both cases.",
    },
    {
      id: "d1-06",
      domain: "d1",
      lesson: "d1-iam",
      prompt:
        "Administrators must be able to terminate EC2 instances only when they have signed in with MFA. What is the MOST appropriate way to enforce this?",
      options: [
        "Add a condition on aws:MultiFactorAuthPresent to the policy statement that allows ec2:TerminateInstances",
        "Enable MFA on the root user",
        "Use an SCP that allows ec2:TerminateInstances",
        "Enable termination protection on every instance",
      ],
      answer: [0],
      explanation: "IAM condition keys such as aws:MultiFactorAuthPresent let you require MFA for specific sensitive actions.",
    },
    {
      id: "d1-07",
      domain: "d1",
      lesson: "d1-iam",
      prompt:
        "A company has 40 developers who need identical permissions. New developers join every month. Which approach is easiest to manage while still following least privilege?",
      options: [
        "Create an IAM group with a policy scoped to the developers' tasks and add each developer to the group",
        "Attach the same inline policy to each user individually",
        "Give every developer the PowerUserAccess policy",
        "Create one IAM user that all developers share",
      ],
      answer: [0],
      explanation: "Groups let you manage permissions once. (Federating through IAM Identity Center with a permission set is the same idea for workforce access across accounts.)",
    },
    {
      id: "d1-08",
      domain: "d1",
      lesson: "d1-iam",
      prompt:
        "A Lambda function must write items to one DynamoDB table and nothing else. Which configuration follows the principle of least privilege?",
      options: [
        "An execution role allowing dynamodb:PutItem on that table's ARN only",
        "An execution role with the AmazonDynamoDBFullAccess managed policy",
        "An execution role allowing dynamodb:* on all resources",
        "Access keys for an IAM user stored as Lambda environment variables",
      ],
      answer: [0],
      explanation: "Scope both the action and the resource. Managed full-access policies and wildcard resources grant far more than the function needs.",
    },
    {
      id: "d1-09",
      domain: "d1",
      lesson: "d1-iam",
      type: "match",
      prompt: "Match each requirement to the IAM feature that meets it.",
      pairs: [
        ["Give an EC2 application temporary AWS credentials", "IAM role with an instance profile"],
        ["Cap the maximum permissions a delegated admin can grant", "Permissions boundary"],
        ["Let another account read a bucket without assuming a role", "S3 bucket policy (resource-based)"],
        ["Manage the same permissions for many people at once", "IAM group"],
      ],
      explanation: "Roles provide temporary credentials, boundaries limit delegation, resource policies grant cross-account access directly, and groups simplify shared permissions.",
    },

    // ── Multi-account ──
    {
      id: "d1-10",
      domain: "d1",
      lesson: "d1-multiaccount",
      prompt:
        "A company uses AWS Organizations. The security team must ensure that no one in any member account, including account administrators and root users, can disable AWS CloudTrail. What should a solutions architect use?",
      options: [
        "A service control policy that denies cloudtrail:StopLogging and cloudtrail:DeleteTrail, attached to the root of the organization",
        "An IAM policy in each account that denies the CloudTrail actions",
        "A CloudTrail trail with log file validation enabled",
        "AWS Config rules that detect disabled trails",
      ],
      answer: [0],
      explanation:
        "SCPs restrict every principal in member accounts, including their root users, and administrators in those accounts can't remove them. Account admins can edit IAM policies, and Config only detects problems.",
    },
    {
      id: "d1-11",
      domain: "d1",
      lesson: "d1-multiaccount",
      prompt:
        "A company plans to create dozens of AWS accounts. It wants a pre-configured, governed multi-account environment with centralized logging, an account vending process, and guardrails from day one, with the LEAST operational effort. Which service should it use?",
      options: ["AWS Control Tower", "AWS Config conformance packs in each account", "AWS CloudFormation StackSets only", "AWS Service Catalog"],
      answer: [0],
      explanation: "Control Tower sets up a landing zone on top of Organizations with an account factory, a log archive, and preventive and detective controls.",
    },
    {
      id: "d1-12",
      domain: "d1",
      lesson: "d1-multiaccount",
      prompt:
        "Users in a Development account need to deploy resources into a Production account. Which TWO steps are required to enable this with cross-account role switching? (Choose two.)",
      options: [
        "Create a role in the Production account whose trust policy trusts the Development account",
        "Allow the users in the Development account to call sts:AssumeRole on that role's ARN",
        "Create IAM users for each developer in the Production account",
        "Share the Production account's root credentials with the developers",
        "Enable VPC peering between the two accounts",
      ],
      answer: [0, 1],
      explanation:
        "Cross-account access needs both sides: the target role's trust policy names the trusted account, and the caller's identity policy allows sts:AssumeRole on the role. STS then returns temporary credentials.",
    },
    {
      id: "d1-13",
      domain: "d1",
      lesson: "d1-multiaccount",
      prompt:
        "A company with 30 AWS accounts wants employees to sign in once with their existing corporate identity provider and reach the accounts they need with role-based permissions. Which solution meets this requirement with the LEAST operational overhead?",
      options: [
        "AWS IAM Identity Center connected to the corporate identity provider, with permission sets assigned to groups",
        "IAM users with identical passwords in every account",
        "Amazon Cognito user pools in each account",
        "A shared IAM user per department",
      ],
      answer: [0],
      explanation: "IAM Identity Center provides workforce single sign-on across the organization's accounts and maps directory groups to permission sets, which become roles in each account.",
    },
    {
      id: "d1-14",
      domain: "d1",
      lesson: "d1-multiaccount",
      prompt:
        "An SCP attached to an OU allows only Amazon EC2 and Amazon S3 actions. A user in an account in that OU has an IAM policy that allows dynamodb:*. What can the user do with DynamoDB?",
      options: [
        "Nothing: the SCP sets the maximum permissions, and DynamoDB isn't inside it",
        "Everything, because the IAM policy explicitly allows it",
        "Only read operations",
        "Everything, because SCPs apply only to the root user",
      ],
      answer: [0],
      explanation: "Effective permissions are the intersection of SCPs and identity policies. An action outside the SCP is denied even when IAM allows it.",
    },
    {
      id: "d1-15",
      domain: "d1",
      lesson: "d1-multiaccount",
      prompt:
        "A networking account owns a VPC. Application teams in other accounts in the same organization must launch EC2 instances into its subnets without managing their own VPCs. What should the architect use?",
      options: ["AWS Resource Access Manager to share the subnets", "VPC peering from every account", "A Site-to-Site VPN per account", "Copy the VPC with CloudFormation into each account"],
      answer: [0],
      explanation: "With AWS RAM, the VPC owner shares subnets. Other accounts launch resources into them, while the owner keeps control of the network.",
    },
    {
      id: "d1-16",
      domain: "d1",
      lesson: "d1-multiaccount",
      prompt:
        "A company's on-premises Microsoft Active Directory holds all employee identities. Employees must use their AD credentials to access the AWS Management Console. Which TWO options can achieve this? (Choose two.)",
      options: [
        "Use AWS IAM Identity Center with AD as the identity source (through AWS Directory Service AD Connector or an AWS Managed Microsoft AD trust)",
        "Federate through a SAML 2.0 identity provider (such as AD FS) to IAM roles",
        "Export the AD users into IAM users nightly with a script",
        "Configure Amazon Cognito user pools as the console sign-in",
        "Store AD passwords in AWS Secrets Manager",
      ],
      answer: [0, 1],
      explanation:
        "Federation lets people keep one directory identity and receive temporary role credentials in AWS. Syncing passwords into IAM users creates duplicate long-term credentials, and Cognito is for application users.",
    },
    {
      id: "d1-17",
      domain: "d1",
      lesson: "d1-multiaccount",
      prompt:
        "A company stores sensitive reports in an S3 bucket in account A. An analytics application in account B must read them. The company wants to avoid managing an extra IAM role. What is the simplest secure approach?",
      options: [
        "Add a bucket policy in account A that allows s3:GetObject to the application's role in account B, and allow the same in that role's identity policy",
        "Make the bucket public",
        "Copy the objects to account B every hour with a script",
        "Create an IAM user in account A and give its keys to account B",
      ],
      answer: [0],
      explanation: "A resource-based bucket policy can grant another account's principal access directly. For cross-account access, the principal's own account must also allow the action.",
    },
    {
      id: "d1-18",
      domain: "d1",
      lesson: "d1-multiaccount",
      type: "order",
      prompt: "Put the steps of a cross-account role switch in order, starting with the setup in the target account.",
      items: [
        "Create a role in the target account with a trust policy for the source account",
        "Grant the source user permission to call sts:AssumeRole on the role",
        "The user calls sts:AssumeRole (or switches role in the console)",
        "STS returns temporary credentials for the role",
        "The user acts in the target account with the role's permissions",
      ],
      explanation: "First the target account trusts the source, and the source grants permission to assume the role. Then STS issues short-lived credentials limited to the role's policies.",
    },

    // ── VPC security ──
    {
      id: "d1-19",
      domain: "d1",
      lesson: "d1-vpc-security",
      prompt:
        "Application servers in a private subnet must download software updates from the internet. They must not accept connections that originate from the internet. Which solution meets these requirements?",
      options: [
        "Place a NAT gateway in a public subnet and add a 0.0.0.0/0 route to it in the private subnet's route table",
        "Attach an internet gateway and assign public IP addresses to the servers",
        "Add a 0.0.0.0/0 route to the internet gateway in the private subnet's route table",
        "Create an S3 gateway endpoint",
      ],
      answer: [0],
      explanation: "A NAT gateway allows outbound connections started by private instances and drops unsolicited inbound connections. It must sit in a public subnet that routes to the internet gateway.",
    },
    {
      id: "d1-20",
      domain: "d1",
      lesson: "d1-vpc-security",
      prompt:
        "A three-tier application has web, application, and database tiers, each with its own security group. The database must accept MySQL traffic only from the application tier, even as application instances scale in and out. How should the database security group be configured?",
      options: [
        "Allow inbound TCP 3306 with the application tier's security group as the source",
        "Allow inbound TCP 3306 from 0.0.0.0/0",
        "Allow inbound TCP 3306 from each application instance's current private IP",
        "Add a network ACL deny rule for the web tier subnet",
      ],
      answer: [0],
      explanation: "Referencing a security group as the source automatically covers every instance in that group, no matter how many there are or what IPs they get.",
    },
    {
      id: "d1-21",
      domain: "d1",
      lesson: "d1-vpc-security",
      prompt: "Which TWO statements about security groups and network ACLs are correct? (Choose two.)",
      options: [
        "Security groups are stateful: return traffic for an allowed request is allowed automatically",
        "Network ACLs are stateless, so return traffic must be allowed explicitly",
        "Security groups support explicit deny rules",
        "Network ACLs apply to individual ENIs rather than subnets",
        "Security group rules are evaluated in numbered order, lowest first",
      ],
      answer: [0, 1],
      explanation: "Security groups: stateful, allow rules only, per ENI, all rules evaluated. Network ACLs: stateless, allow and deny, per subnet, numbered rules in order.",
    },
    {
      id: "d1-22",
      domain: "d1",
      lesson: "d1-vpc-security",
      prompt:
        "A web application behind an Application Load Balancer is receiving malicious traffic from a small set of IP addresses. The security team wants to block those addresses at the subnet level immediately. What should the architect do?",
      options: [
        "Add inbound deny rules for the addresses to the network ACL of the load balancer's subnets",
        "Add deny rules to the load balancer's security group",
        "Remove the internet gateway",
        "Move the load balancer to a private subnet",
      ],
      answer: [0],
      explanation: "Security groups can't deny traffic, but network ACLs can. An AWS WAF IP set on the ALB is another way to block it, at layer 7.",
    },
    {
      id: "d1-23",
      domain: "d1",
      lesson: "d1-vpc-security",
      prompt:
        "A solutions architect is designing a VPC for a highly available web application. Which layout follows AWS best practices?",
      options: [
        "Public and private subnets in at least two Availability Zones, with the load balancer in the public subnets and instances in the private subnets",
        "One public subnet in one Availability Zone for all resources",
        "Private subnets only, with instances that have public IP addresses",
        "One subnet that spans all Availability Zones",
      ],
      answer: [0],
      explanation: "Subnets live in a single AZ, so spread each tier across at least two AZs. Keep only internet-facing components in public subnets.",
    },
    {
      id: "d1-24",
      domain: "d1",
      lesson: "d1-vpc-security",
      prompt:
        "A network ACL allows inbound HTTPS (443) from the internet to a public subnet, and outbound 443 to anywhere. Clients still can't load the website. The security groups are correct. What is the MOST likely cause?",
      options: [
        "The network ACL doesn't allow outbound traffic to the clients' ephemeral ports (1024–65535)",
        "Security groups block return traffic",
        "The internet gateway only supports HTTP",
        "Network ACLs must allow port 22 for HTTPS to work",
      ],
      answer: [0],
      explanation: "NACLs are stateless. The server's responses go to the client's ephemeral port, so the outbound rules must allow that range.",
    },
    {
      id: "d1-25",
      domain: "d1",
      lesson: "d1-vpc-security",
      prompt:
        "Administrators need shell access to EC2 instances in private subnets. The company wants no open inbound SSH ports and no bastion hosts to manage. What should the architect recommend?",
      options: [
        "AWS Systems Manager Session Manager with the SSM Agent and an instance role",
        "A bastion host in a public subnet with port 22 open to 0.0.0.0/0",
        "Assign Elastic IP addresses to the instances",
        "Open port 3389 to the corporate IP range",
      ],
      answer: [0],
      explanation: "Session Manager opens sessions through the Systems Manager service, with IAM-controlled access and logging, and needs no inbound ports.",
    },
    {
      id: "d1-26",
      domain: "d1",
      lesson: "d1-vpc-security",
      prompt:
        "A security team must capture metadata about the IP traffic going to and from network interfaces in a VPC (source, destination, port, accept or reject) for analysis. What should be enabled?",
      options: ["VPC Flow Logs", "AWS CloudTrail data events", "Amazon Inspector", "S3 server access logs"],
      answer: [0],
      explanation: "VPC Flow Logs record accepted and rejected IP traffic metadata at the VPC, subnet, or ENI level and publish to CloudWatch Logs, S3, or Data Firehose.",
    },
    {
      id: "d1-27",
      domain: "d1",
      lesson: "d1-vpc-security",
      type: "match",
      prompt: "Match each VPC component to its job.",
      pairs: [
        ["Internet gateway", "Two-way internet access for resources with public IPs"],
        ["NAT gateway", "Outbound-only internet access for private subnets"],
        ["Route table", "Decides where traffic leaving a subnet goes"],
        ["Network ACL", "Stateless allow and deny rules at the subnet boundary"],
        ["Security group", "Stateful allow rules on each network interface"],
      ],
      explanation: "Routing, done by route tables and gateways, decides where traffic can go. Filtering, done by NACLs and security groups, decides what's allowed.",
    },

    // ── Edge and threat protection ──
    {
      id: "d1-28",
      domain: "d1",
      lesson: "d1-edge-protection",
      prompt:
        "A public web application behind Amazon CloudFront and an Application Load Balancer is being targeted by SQL injection and cross-site scripting attempts. Which service should the architect use to block these requests?",
      options: ["AWS WAF with managed rule groups", "AWS Shield Standard", "Amazon GuardDuty", "Network ACLs"],
      answer: [0],
      explanation: "SQL injection and XSS are layer 7 attacks. AWS WAF inspects HTTP requests and blocks them with managed or custom rules.",
    },
    {
      id: "d1-29",
      domain: "d1",
      lesson: "d1-edge-protection",
      prompt:
        "An e-commerce company fears large DDoS attacks during a sale. It wants 24/7 access to AWS DDoS experts and protection against the extra scaling costs an attack can cause. What should it subscribe to?",
      options: ["AWS Shield Advanced", "AWS Shield Standard", "AWS WAF rate-based rules only", "Amazon Inspector"],
      answer: [0],
      explanation: "Shield Advanced adds the Shield Response Team, advanced detection, and cost protection for DDoS-related scaling charges. Shield Standard is automatic and free but has no response team.",
    },
    {
      id: "d1-30",
      domain: "d1",
      lesson: "d1-edge-protection",
      prompt:
        "A company wants to continuously detect threats such as compromised EC2 instances mining cryptocurrency and unusual API calls, and also find personally identifiable information stored in S3. Which TWO services should it enable? (Choose two.)",
      options: ["Amazon GuardDuty", "Amazon Macie", "AWS Shield Standard", "AWS Artifact", "Amazon Cognito"],
      answer: [0, 1],
      explanation: "GuardDuty analyzes logs such as CloudTrail, VPC Flow Logs, and DNS logs for threats. Macie discovers and classifies sensitive data in S3.",
    },
    {
      id: "d1-31",
      domain: "d1",
      lesson: "d1-edge-protection",
      prompt:
        "An application stores its Amazon RDS database password in a configuration file. The company wants the password stored securely and rotated automatically every 30 days without application downtime. What should the architect use?",
      options: [
        "AWS Secrets Manager with automatic rotation, and have the application retrieve the secret at runtime",
        "An encrypted environment variable on the EC2 instances",
        "AWS Systems Manager Parameter Store String parameter",
        "An S3 object encrypted with SSE-S3",
      ],
      answer: [0],
      explanation: "Secrets Manager stores secrets encrypted with KMS and rotates them on a schedule, with built-in rotation for RDS. The app always reads the current value.",
    },
    {
      id: "d1-32",
      domain: "d1",
      lesson: "d1-edge-protection",
      prompt:
        "A mobile app needs sign-up and sign-in for millions of customers, including social login with Google and Apple, and then needs temporary AWS credentials to upload photos directly to S3. Which solution fits best?",
      options: [
        "An Amazon Cognito user pool for sign-in, plus a Cognito identity pool that exchanges tokens for temporary AWS credentials",
        "One IAM user per customer",
        "AWS IAM Identity Center",
        "An API key embedded in the app",
      ],
      answer: [0],
      explanation: "Cognito user pools handle customer sign-in, including social logins. Identity pools hand out limited, temporary AWS credentials. IAM Identity Center is for the workforce.",
    },
    {
      id: "d1-33",
      domain: "d1",
      lesson: "d1-edge-protection",
      prompt: "A login API is being hit by credential-stuffing bots sending thousands of requests per minute from many IPs. Which AWS WAF feature most directly limits this?",
      options: ["A rate-based rule", "A geo match rule only", "A size constraint rule", "Shield Standard"],
      answer: [0],
      explanation: "Rate-based rules count requests per client IP (or other keys) over a time window and block or challenge clients above the limit.",
    },
    {
      id: "d1-34",
      domain: "d1",
      lesson: "d1-edge-protection",
      prompt:
        "A company with 50 accounts in AWS Organizations wants to ensure every Application Load Balancer and CloudFront distribution, including new ones, automatically gets the same AWS WAF rules. What should it use?",
      options: ["AWS Firewall Manager", "AWS Config in each account", "Manually attach web ACLs in each account", "Amazon GuardDuty"],
      answer: [0],
      explanation: "Firewall Manager centrally applies WAF, Shield Advanced, security group, and Network Firewall policies across the organization, including to new resources.",
    },
    {
      id: "d1-35",
      domain: "d1",
      lesson: "d1-edge-protection",
      prompt: "A security team must automatically scan container images pushed to Amazon ECR and running EC2 instances for known software vulnerabilities (CVEs). Which service should it use?",
      options: ["Amazon Inspector", "Amazon Macie", "AWS Shield", "AWS Trusted Advisor"],
      answer: [0],
      explanation: "Inspector continuously scans EC2 instances, ECR images, and Lambda functions for software vulnerabilities and network exposure.",
    },
    {
      id: "d1-36",
      domain: "d1",
      lesson: "d1-edge-protection",
      type: "match",
      prompt: "Match each security need to the service that addresses it.",
      pairs: [
        ["Block SQL injection at layer 7", "AWS WAF"],
        ["Detect threats from CloudTrail, VPC Flow Logs, and DNS logs", "Amazon GuardDuty"],
        ["Find PII in S3 buckets", "Amazon Macie"],
        ["Rotate database credentials automatically", "AWS Secrets Manager"],
        ["One view of security findings across accounts", "AWS Security Hub"],
      ],
      explanation: "Each security service has one main job, and exam questions usually turn on knowing it.",
    },

    // ── Connectivity ──
    {
      id: "d1-37",
      domain: "d1",
      lesson: "d1-connectivity",
      prompt:
        "EC2 instances in a private subnet with no NAT gateway must read and write objects in Amazon S3. Traffic must not traverse the internet, and the company wants the lowest cost. What should the architect configure?",
      options: ["An S3 gateway VPC endpoint added to the private subnet's route table", "An interface VPC endpoint for S3 in every subnet", "A NAT gateway", "An internet gateway and public IPs"],
      answer: [0],
      explanation: "Gateway endpoints for S3 and DynamoDB are route-table targets with no additional charge. Interface endpoints also work but cost hourly and per GB.",
    },
    {
      id: "d1-38",
      domain: "d1",
      lesson: "d1-connectivity",
      prompt:
        "An S3 bucket must be accessible only from a specific VPC endpoint, even for principals whose IAM policies would otherwise allow access. How can this be enforced?",
      options: [
        "A bucket policy that denies access unless aws:SourceVpce equals the endpoint ID",
        "A security group on the bucket",
        "A network ACL on the bucket",
        "S3 Block Public Access",
      ],
      answer: [0],
      explanation: "Buckets don't have security groups. A bucket policy Deny with the aws:SourceVpce condition blocks any request that doesn't come through the endpoint.",
    },
    {
      id: "d1-39",
      domain: "d1",
      lesson: "d1-connectivity",
      prompt:
        "A company connects its data center to AWS with AWS Direct Connect. Compliance now requires that all traffic between the data center and the VPC is encrypted, and that there is a backup path if the Direct Connect link fails. Which TWO actions meet these requirements? (Choose two.)",
      options: [
        "Run an IPsec Site-to-Site VPN over the Direct Connect connection",
        "Configure a Site-to-Site VPN over the internet as a backup path",
        "Rely on Direct Connect's default encryption",
        "Replace Direct Connect with VPC peering",
        "Use an S3 gateway endpoint",
      ],
      answer: [0, 1],
      explanation: "Direct Connect isn't encrypted by default. An IPsec VPN over it, or MACsec where supported, adds encryption. An internet VPN is a common low-cost backup to Direct Connect.",
    },
    {
      id: "d1-40",
      domain: "d1",
      lesson: "d1-connectivity",
      prompt:
        "A company must connect its office network to a VPC within one day. Traffic must be encrypted. Bandwidth requirements are modest. Which option is MOST suitable?",
      options: ["AWS Site-to-Site VPN", "AWS Direct Connect", "VPC peering", "AWS Transit Gateway inter-Region peering"],
      answer: [0],
      explanation: "A Site-to-Site VPN can be set up quickly over the existing internet connection and uses IPsec encryption. Direct Connect takes weeks or more to provision.",
    },
    {
      id: "d1-41",
      domain: "d1",
      lesson: "d1-connectivity",
      prompt:
        "A SaaS provider wants to offer its service, which runs behind a Network Load Balancer, privately to hundreds of customer VPCs. Many customer VPCs use overlapping CIDR ranges. What should it use?",
      options: ["AWS PrivateLink (a VPC endpoint service)", "VPC peering with each customer", "A public Application Load Balancer", "AWS Direct Connect gateways"],
      answer: [0],
      explanation: "PrivateLink exposes the service through interface endpoints in each consumer VPC. No routing between VPCs is needed, so overlapping CIDRs aren't a problem.",
    },
    {
      id: "d1-42",
      domain: "d1",
      lesson: "d1-connectivity",
      prompt: "Remote employees need secure access from their laptops to internal applications in a VPC, with authentication against the corporate directory. Which service fits?",
      options: ["AWS Client VPN", "AWS Site-to-Site VPN", "AWS Direct Connect", "Amazon CloudFront"],
      answer: [0],
      explanation: "Client VPN is a managed OpenVPN-based service for individual users, with Active Directory, SAML, or certificate authentication.",
    },
    {
      id: "d1-43",
      domain: "d1",
      lesson: "d1-connectivity",
      prompt:
        "Applications in private subnets call AWS Systems Manager and Amazon SQS APIs. A new rule says traffic to AWS services must stay on the AWS network and private subnets must have no internet route. What should the architect add?",
      options: ["Interface VPC endpoints for Systems Manager and SQS", "A NAT gateway", "An egress-only internet gateway", "Gateway endpoints for Systems Manager and SQS"],
      answer: [0],
      explanation: "Gateway endpoints exist only for S3 and DynamoDB. Other services use interface endpoints (PrivateLink), which give the service a private IP in your subnet.",
    },

    // ── Encryption ──
    {
      id: "d1-44",
      domain: "d1",
      lesson: "d1-encryption",
      prompt:
        "A company must encrypt objects in Amazon S3 with keys it controls, restrict which roles can use each key, and audit every use of the keys. Which option meets these requirements?",
      options: [
        "SSE-KMS with a customer managed key and a key policy granting specific roles",
        "SSE-S3",
        "SSE-KMS with the AWS managed key aws/s3",
        "Client-side encryption with a key stored in the application code",
      ],
      answer: [0],
      explanation: "Customer managed keys let you write the key policy and see each use in CloudTrail. You can't edit the policy of an AWS managed key, and SSE-S3 keys aren't under your control.",
    },
    {
      id: "d1-45",
      domain: "d1",
      lesson: "d1-encryption",
      prompt:
        "A bucket uses SSE-KMS. Request volume grew and the KMS request costs are now significant. What change reduces KMS costs with the least effort?",
      options: ["Enable S3 Bucket Keys for the bucket", "Switch to client-side encryption", "Disable encryption", "Create a new KMS key per object"],
      answer: [0],
      explanation: "S3 Bucket Keys let S3 use a bucket-level key derived from KMS, greatly reducing the number of requests to KMS.",
    },
    {
      id: "d1-46",
      domain: "d1",
      lesson: "d1-encryption",
      prompt:
        "A company must encrypt data in transit to its public website and ensure that no request to its S3 bucket uses plain HTTP. Which TWO actions meet these requirements? (Choose two.)",
      options: [
        "Use an AWS Certificate Manager certificate on the HTTPS listener of the Application Load Balancer",
        "Add a bucket policy that denies requests when aws:SecureTransport is false",
        "Enable SSE-S3 on the bucket",
        "Turn on S3 Versioning",
        "Enable VPC Flow Logs",
      ],
      answer: [0, 1],
      explanation: "TLS with an ACM certificate protects traffic to the site, and the aws:SecureTransport condition forces HTTPS for S3. SSE-S3 is encryption at rest, not in transit.",
    },
    {
      id: "d1-47",
      domain: "d1",
      lesson: "d1-encryption",
      prompt:
        "A financial regulator requires that encryption keys be stored in dedicated, single-tenant hardware security modules that the company exclusively controls. Which service should the architect use?",
      options: ["AWS CloudHSM", "AWS KMS with AWS managed keys", "AWS Secrets Manager", "SSE-S3"],
      answer: [0],
      explanation: "CloudHSM provides dedicated HSMs in your VPC where you manage keys and users. KMS is multi-tenant, managed by AWS (though KMS can use a CloudHSM-backed custom key store).",
    },
    {
      id: "d1-48",
      domain: "d1",
      lesson: "d1-encryption",
      prompt: "A security policy requires that customer managed KMS keys be rotated regularly without re-encrypting existing data. What should the architect do?",
      options: [
        "Enable automatic key rotation on the customer managed keys",
        "Delete and recreate the keys every year",
        "Export the key material and rotate it manually",
        "Switch to SSE-C",
      ],
      answer: [0],
      explanation: "Automatic rotation creates new key material on a schedule and keeps old material, so data encrypted earlier still decrypts with the same key ID.",
    },
    {
      id: "d1-49",
      domain: "d1",
      lesson: "d1-encryption",
      prompt:
        "A team uses a custom domain on Amazon CloudFront. It wants a free public TLS certificate that renews automatically. Which approach is correct?",
      options: [
        "Request a public certificate in AWS Certificate Manager in the US East (N. Virginia) Region with DNS validation",
        "Request the certificate in ACM in the same Region as the S3 origin",
        "Import a self-signed certificate into IAM",
        "Store the certificate in Secrets Manager",
      ],
      answer: [0],
      explanation: "CloudFront uses ACM certificates from us-east-1. ACM-issued certificates with DNS validation renew automatically.",
    },
    {
      id: "d1-50",
      domain: "d1",
      lesson: "d1-encryption",
      prompt:
        "An existing unencrypted Amazon RDS DB instance must be encrypted at rest. What is the correct approach?",
      options: [
        "Take a snapshot, copy it with encryption enabled, and restore a new DB instance from the encrypted copy",
        "Enable encryption on the running instance from the console",
        "Enable encryption on the read replica and promote it",
        "Turn on SSE-S3 for the RDS storage",
      ],
      answer: [0],
      explanation: "You can't encrypt an existing unencrypted RDS instance in place. Copying a snapshot with encryption and restoring it creates an encrypted instance.",
    },
    {
      id: "d1-51",
      domain: "d1",
      lesson: "d1-encryption",
      type: "order",
      prompt: "Put the steps of envelope encryption with AWS KMS in order.",
      items: [
        "Call GenerateDataKey for a KMS key",
        "Encrypt the data locally with the plaintext data key",
        "Discard the plaintext data key from memory",
        "Store the encrypted data key alongside the ciphertext",
        "To read, call KMS Decrypt on the encrypted data key, then decrypt the data locally",
      ],
      explanation: "The KMS key never leaves KMS. Only the small data key travels. This is how AWS services encrypt large data with KMS keys.",
    },

    // ── Data protection ──
    {
      id: "d1-52",
      domain: "d1",
      lesson: "d1-data-protection",
      prompt:
        "Regulations require that trade records in Amazon S3 cannot be overwritten or deleted by anyone, including the root user, for 7 years. Which configuration meets this requirement?",
      options: [
        "Enable S3 Object Lock in compliance mode with a 7-year retention period",
        "Enable S3 Object Lock in governance mode",
        "Enable versioning and MFA Delete only",
        "Use a bucket policy that denies s3:DeleteObject",
      ],
      answer: [0],
      explanation: "In compliance mode no user, including root, can delete a locked version or shorten its retention. Governance mode can be bypassed with special permission, and bucket policies can be edited.",
    },
    {
      id: "d1-53",
      domain: "d1",
      lesson: "d1-data-protection",
      prompt:
        "A company must keep copies of critical S3 objects in a second Region for disaster recovery, with most objects replicated within 15 minutes backed by an SLA. What should the architect configure?",
      options: [
        "S3 Cross-Region Replication with S3 Replication Time Control, with versioning enabled on both buckets",
        "S3 Transfer Acceleration",
        "A nightly AWS DataSync task",
        "An S3 Lifecycle rule",
      ],
      answer: [0],
      explanation: "Replication requires versioning on source and destination. Replication Time Control adds an SLA and metrics for replicating objects within 15 minutes.",
    },
    {
      id: "d1-54",
      domain: "d1",
      lesson: "d1-data-protection",
      prompt:
        "A company wants one place to define backup schedules and retention for its EC2 volumes, RDS databases, DynamoDB tables, and EFS file systems, copy backups to another account, and prevent anyone from deleting backups early. Which TWO features should it use? (Choose two.)",
      options: ["AWS Backup backup plans with cross-account copy", "AWS Backup Vault Lock", "Amazon S3 Transfer Acceleration", "Amazon Data Lifecycle Manager for RDS", "AWS Storage Gateway Tape Gateway"],
      answer: [0, 1],
      explanation: "AWS Backup centralizes policies across services and copies to other accounts and Regions. Vault Lock makes the recovery points immutable for their retention period.",
    },
    {
      id: "d1-55",
      domain: "d1",
      lesson: "d1-data-protection",
      prompt:
        "A security team discovered that a developer accidentally made an S3 bucket public. The company wants to make sure no bucket in the account can ever be made public. What should the architect do?",
      options: [
        "Turn on S3 Block Public Access at the account level",
        "Enable default encryption on every bucket",
        "Enable versioning on every bucket",
        "Enable S3 Transfer Acceleration",
      ],
      answer: [0],
      explanation: "Account-level Block Public Access overrides public ACLs and public bucket policies for every bucket in the account. An SCP can stop anyone from turning it off.",
    },
    {
      id: "d1-56",
      domain: "d1",
      lesson: "d1-data-protection",
      prompt:
        "An auditor asks the company to prove that every S3 bucket and EBS volume has stayed encrypted over the last year and to flag any resource that becomes non-compliant. Which service should the architect use?",
      options: ["AWS Config with managed rules", "AWS Artifact", "Amazon Macie", "AWS Trusted Advisor"],
      answer: [0],
      explanation: "AWS Config records configuration history and evaluates resources against rules continuously. Artifact provides AWS's own compliance reports, not your resource state.",
    },
    {
      id: "d1-57",
      domain: "d1",
      lesson: "d1-data-protection",
      prompt:
        "A company needs AWS's SOC 2 and PCI DSS compliance reports to share with its auditors. Where can it download them?",
      options: ["AWS Artifact", "AWS Config", "AWS Security Hub", "AWS CloudTrail"],
      answer: [0],
      explanation: "AWS Artifact is the self-service portal for AWS compliance reports and agreements.",
    },
  ],

  cards: [
    { id: "s-iam", domain: "d1", kind: "service", term: "AWS IAM", definition: "Users, groups, roles, and policies that control who can do what in an account" },
    { id: "s-sts", domain: "d1", kind: "service", term: "AWS STS", definition: "Issues temporary credentials when a role is assumed" },
    { id: "s-organizations", domain: "d1", kind: "service", term: "AWS Organizations", definition: "Groups accounts into OUs with consolidated billing and service control policies" },
    { id: "s-controltower", domain: "d1", kind: "service", term: "AWS Control Tower", definition: "Sets up and governs a multi-account landing zone with controls and an account factory" },
    { id: "s-identitycenter", domain: "d1", kind: "service", term: "AWS IAM Identity Center", definition: "Workforce single sign-on to many AWS accounts and apps with permission sets" },
    { id: "s-ram", domain: "d1", kind: "service", term: "AWS Resource Access Manager", definition: "Shares resources such as subnets and Transit Gateways across accounts" },
    { id: "s-directory", domain: "d1", kind: "service", term: "AWS Directory Service", definition: "Managed Microsoft AD or AD Connector to use Active Directory with AWS" },
    { id: "s-cognito", domain: "d1", kind: "service", term: "Amazon Cognito", definition: "Sign-up and sign-in for app users, plus temporary AWS credentials for them" },
    { id: "s-waf", domain: "d1", kind: "service", term: "AWS WAF", definition: "A web firewall that inspects each request. It blocks SQL injection and cross-site scripting, and can rate-limit or filter by IP or country." },
    { id: "s-shield", domain: "d1", kind: "service", term: "AWS Shield", definition: "DDoS protection. Standard is free and automatic. Advanced adds a response team and protection against attack-driven costs." },
    { id: "s-guardduty", domain: "d1", kind: "service", term: "Amazon GuardDuty", definition: "Threat detection from CloudTrail, VPC Flow Logs, and DNS logs" },
    { id: "s-macie", domain: "d1", kind: "service", term: "Amazon Macie", definition: "Discovers and classifies sensitive data such as PII in S3" },
    { id: "s-inspector", domain: "d1", kind: "service", term: "Amazon Inspector", definition: "Vulnerability scanning for EC2, ECR images, and Lambda" },
    { id: "s-securityhub", domain: "d1", kind: "service", term: "AWS Security Hub", definition: "Aggregates security findings and posture checks across accounts" },
    { id: "s-detective", domain: "d1", kind: "service", term: "Amazon Detective", definition: "Investigates the root cause of security findings with linked log data" },
    { id: "s-firewallmanager", domain: "d1", kind: "service", term: "AWS Firewall Manager", definition: "Central WAF, Shield Advanced, security group, and firewall policies across an organization" },
    { id: "s-networkfirewall", domain: "d1", kind: "service", term: "AWS Network Firewall", definition: "Managed stateful network firewall and intrusion prevention for VPCs" },
    { id: "s-secretsmanager", domain: "d1", kind: "service", term: "AWS Secrets Manager", definition: "Stores secrets encrypted and rotates them automatically" },
    { id: "s-kms", domain: "d1", kind: "service", term: "AWS KMS", definition: "Managed encryption keys with key policies, rotation, and CloudTrail auditing" },
    { id: "s-cloudhsm", domain: "d1", kind: "service", term: "AWS CloudHSM", definition: "Dedicated single-tenant hardware security modules you control" },
    { id: "s-acm", domain: "d1", kind: "service", term: "AWS Certificate Manager", definition: "Free public TLS certificates that renew automatically for AWS integrations" },
    { id: "s-config", domain: "d1", kind: "service", term: "AWS Config", definition: "Records resource configuration history and evaluates compliance rules" },
    { id: "s-artifact", domain: "d1", kind: "service", term: "AWS Artifact", definition: "Downloads AWS compliance reports and agreements" },
    { id: "s-cloudtrail", domain: "d1", kind: "service", term: "AWS CloudTrail", definition: "Records who called which AWS API, when, and from where" },
    { id: "s-clientvpn", domain: "d1", kind: "service", term: "AWS Client VPN", definition: "Managed remote-access VPN for individual users into a VPC" },
    { id: "s-sitevpn", domain: "d1", kind: "service", term: "AWS Site-to-Site VPN", definition: "IPsec tunnels over the internet between a network and AWS" },
    { id: "s-privatelink", domain: "d1", kind: "service", term: "AWS PrivateLink", definition: "Private access to services through interface endpoints, without peering" },
    { id: "c-least", domain: "d1", kind: "concept", term: "Least privilege", definition: "Granting only the actions and resources a task needs, and nothing more." },
    { id: "c-scp", domain: "d1", kind: "concept", term: "Service control policy", definition: "A guardrail in AWS Organizations that caps what member accounts can do. It never grants anything by itself." },
    { id: "c-boundary", domain: "d1", kind: "concept", term: "Permissions boundary", definition: "Maximum permissions an identity-based policy can give a user or role" },
    { id: "c-explicitdeny", domain: "d1", kind: "concept", term: "Explicit deny", definition: "A Deny statement that overrides every Allow" },
    { id: "c-shared", domain: "d1", kind: "concept", term: "Shared responsibility model", definition: "AWS secures the cloud; you secure what you put in it" },
    { id: "c-sg", domain: "d1", kind: "concept", term: "Security group", definition: "A firewall on each network interface. It only has allow rules and automatically lets replies back in." },
    { id: "c-nacl", domain: "d1", kind: "concept", term: "Network ACL", definition: "A filter on a whole subnet, with numbered allow and deny rules. It checks traffic in both directions separately." },
    { id: "c-gatewayendpoint", domain: "d1", kind: "concept", term: "Gateway endpoint", definition: "A free way to reach S3 and DynamoDB privately, added as an entry in a route table." },
    { id: "c-envelope", domain: "d1", kind: "concept", term: "Envelope encryption", definition: "You encrypt the data with a data key, then encrypt that data key with a KMS key." },
    { id: "c-objectlock", domain: "d1", kind: "concept", term: "S3 Object Lock", definition: "Keeps objects from being changed or deleted for a set time. In compliance mode, nobody can shorten that time." },
    { id: "c-bpa", domain: "d1", kind: "concept", term: "S3 Block Public Access", definition: "A switch, for an account or a bucket, that blocks public access whatever other settings say." },
  ],

  challenges: [
    {
      id: "ch-vpc-egress",
      domain: "d1",
      lesson: "d1-vpc-security",
      title: "Private, but online",
      goal: "Fix the VPC so the app instance can download patches from the internet but can't be reached from it.",
      hint: "A NAT gateway only works from a subnet whose route table points 0.0.0.0/0 at an attached internet gateway. And a private instance shouldn't have a public IP or a route to the IGW.",
      takeaway: "The private subnet sends internet traffic to a NAT gateway in a public subnet, and the public route table sends it on to the internet gateway. Traffic can go out, but nothing has a path in.",
      render: (onSolved) => <VpcBuilderLab goal="egress" onSolved={onSolved} />,
    },
  ],
});
