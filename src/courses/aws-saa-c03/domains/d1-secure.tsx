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
    summary: "IAM and least privilege, multi-account governance, VPC security layers, edge and threat protection, private connectivity, encryption, and data protection.",
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
      id: "d1-iam",
      task: "1.1",
      title: "IAM, least privilege, and the shared responsibility model",
      check: ["d1-01", "d1-04"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "👑", title: "Root user", text: "Turn on MFA, delete its access keys, and lock it away. Use it only for the few tasks that need it.", color: "#f87171" },
              { icon: "👥", title: "Users and groups", text: "Attach policies to groups, not to individual users. Prefer federation over long-lived users.", color: "#f87171" },
              { icon: "🎭", title: "Roles", text: "Temporary credentials from STS. For EC2 (instance profile), Lambda, other accounts, and federated users.", color: "#f87171" },
              { icon: "📜", title: "Policies", text: "Identity-based (attached to a principal) or resource-based (attached to a bucket, key, queue…).", color: "#f87171" },
            ]}
          />
          <Flow
            color="#f87171"
            steps={[
              { icon: "⛔", label: "Any explicit Deny?", sub: "Deny wins, always" },
              { icon: "🚧", label: "Inside SCPs and boundaries?", sub: "Guardrails cap what can be allowed" },
              { icon: "✅", label: "Any Allow?", sub: "Identity or resource policy" },
              { icon: "🔒", label: "Otherwise: implicit deny", sub: "Nothing is allowed by default" },
            ]}
          />
          <Layers
            layers={[
              { name: "Customer: security IN the cloud", color: "#38bdf8", items: ["Data and encryption choices", "IAM", "OS patching on EC2", "Security groups and NACLs", "Application code"] },
              { name: "AWS: security OF the cloud", color: "#f59e0b", items: ["Data centers", "Hardware", "Hypervisor", "Global network", "Managed-service infrastructure"] },
            ]}
          />
        </div>
      ),
      points: [
        "Least privilege: grant only the actions and resources a job needs, then tighten with conditions (source IP, MFA, tags, VPC endpoint).",
        "Give workloads roles, never access keys: an EC2 instance profile or a Lambda execution role delivers short-lived credentials automatically.",
        "Permissions boundaries cap what an identity-based policy can grant, so you can let developers create roles without letting them escalate.",
        "The more managed the service, the more AWS handles: you patch the OS on EC2, but not on Lambda or RDS.",
      ],
      tip: "\"Application on EC2 needs to read S3\" → an IAM role attached through an instance profile. Any answer that stores access keys on the instance is wrong.",
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
              { name: "Management account", color: "#f59e0b", items: ["AWS Organizations", "Consolidated billing", "No workloads"] },
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
              { icon: "🔁", title: "Cross-account role", text: "A role in the target account trusts the source account; users call sts:AssumeRole to get temporary credentials.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Separate accounts are the strongest isolation boundary: per environment, per team, or per workload, grouped into OUs.",
        "SCPs don't affect the management account, and an SCP Allow doesn't grant permissions: the identity still needs an IAM Allow.",
        "Federate workforce users with IAM Identity Center (or SAML 2.0 to IAM roles) instead of creating IAM users in every account.",
        "Resource-based policies (S3 bucket, KMS key, SQS queue, Lambda) can grant another account access directly, without it assuming a role.",
        "AWS RAM shares resources such as subnets and Transit Gateways with other accounts in the organization.",
      ],
      tip: "\"Prevent any account in the organization from doing X, even its administrators\" → an SCP. \"Grant\" questions are never solved by an SCP alone.",
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
        "A subnet is public when its route table sends 0.0.0.0/0 to an internet gateway. Put load balancers and NAT gateways there; put app servers and databases in private subnets.",
        "A NAT gateway lets private instances start outbound connections (patches, APIs) while blocking connections from the internet. It's zonal: use one per AZ for resilience.",
        "Security groups are stateful allow-lists on each ENI. Chain them by referencing groups: the DB group allows port 3306 only from the app tier's group.",
        "Network ACLs are stateless subnet filters with numbered allow and deny rules. Use them to block specific IP ranges, and remember the ephemeral return ports.",
        "Lay out at least two AZs with a public and private subnet in each, and plan CIDR ranges that don't overlap networks you'll connect later.",
      ],
      tip: "\"Block one malicious IP address\" → a network ACL deny rule (security groups can't deny). \"Allow only the web tier to reach the database\" → security group referencing a security group.",
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
              { icon: "🛡️", label: "Shield", sub: "DDoS protection at layers 3/4 (Standard is automatic)" },
              { icon: "🧱", label: "WAF web ACL", sub: "Layer 7 rules: SQLi, XSS, rate limits, geo" },
              { icon: "🌐", label: "CloudFront / ALB / API Gateway", sub: "Where WAF attaches" },
              { icon: "🖥️", label: "Application" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🕵️", title: "GuardDuty", text: "Threat detection from CloudTrail events, VPC Flow Logs, DNS logs, and more. Finds crypto-mining and credential misuse.", color: "#38bdf8" },
              { icon: "🔍", title: "Macie", text: "Discovers and classifies sensitive data such as PII in S3 buckets.", color: "#38bdf8" },
              { icon: "🩺", title: "Inspector", text: "Scans EC2 instances, container images in ECR, and Lambda functions for software vulnerabilities.", color: "#38bdf8" },
              { icon: "📊", title: "Security Hub", text: "Aggregates findings and runs posture checks across accounts in one place.", color: "#38bdf8" },
              { icon: "🔐", title: "Secrets Manager", text: "Stores database credentials and API keys, with automatic rotation.", color: "#34d399" },
              { icon: "🪪", title: "Cognito", text: "Sign-up and sign-in for your app's customers (user pools); temporary AWS credentials (identity pools).", color: "#34d399" },
              { icon: "🔥", title: "Network Firewall", text: "Managed stateful firewall and intrusion prevention for VPC traffic, including domain filtering.", color: "#34d399" },
              { icon: "🗂️", title: "Firewall Manager", text: "Centrally applies WAF, Shield Advanced, security group, and Network Firewall policies across an organization.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "Shield Standard protects every AWS customer at no cost. Shield Advanced adds tailored detection, the Shield Response Team, and protection against DDoS-related scaling charges.",
        "AWS WAF filters HTTP(S) requests with managed or custom rules, rate-based rules, IP sets, and geo match. It attaches to CloudFront, ALB, API Gateway, AppSync, and Cognito user pools.",
        "Detect with GuardDuty, investigate with Detective, classify data with Macie, scan for vulnerabilities with Inspector, and view everything in Security Hub.",
        "Keep credentials out of code and AMIs: Secrets Manager rotates them; Parameter Store SecureString is a cheaper option without built-in rotation.",
      ],
      tip: "SQL injection or cross-site scripting → AWS WAF. A large DDoS with cost protection and a response team → Shield Advanced. \"Find PII in S3\" → Macie.",
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
              { icon: "🚪", title: "Gateway endpoint", text: "S3 and DynamoDB only. A route-table entry, no extra charge. Restrict it with an endpoint policy.", color: "#34d399" },
              { icon: "🔌", title: "Interface endpoint (PrivateLink)", text: "An ENI with a private IP in your subnet for many AWS services and partner or your own services. Hourly and per-GB charges.", color: "#34d399" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🔒", title: "Site-to-Site VPN", text: "IPsec tunnels over the internet to a virtual private gateway or Transit Gateway. Up in minutes, encrypted.", color: "#38bdf8" },
              { icon: "🧵", title: "Direct Connect", text: "A dedicated private line into AWS: consistent latency and high bandwidth. Takes time to provision and isn't encrypted by default.", color: "#38bdf8" },
              { icon: "💻", title: "Client VPN", text: "Managed remote access for individual users' devices into a VPC.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Endpoints keep traffic to AWS services off the internet, so private subnets don't need a NAT gateway for S3 or DynamoDB.",
        "Bucket policies can require access through a specific VPC endpoint with the aws:SourceVpce condition key.",
        "To encrypt Direct Connect traffic, run a Site-to-Site VPN over it (or use MACsec on supported connections).",
        "A common hybrid design pairs Direct Connect as the primary path with a Site-to-Site VPN as a lower-cost backup.",
        "PrivateLink exposes a service behind a Network Load Balancer to other VPCs without peering or overlapping-CIDR problems.",
      ],
      tip: "\"Needed by tomorrow\" or \"over the internet but encrypted\" → Site-to-Site VPN. \"Consistent, dedicated bandwidth\" → Direct Connect.",
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
              { icon: "📦", label: "GenerateDataKey", sub: "Plaintext + encrypted data key" },
              { icon: "🔐", label: "Encrypt data locally", sub: "Then discard the plaintext key" },
              { icon: "💾", label: "Store ciphertext + encrypted key", sub: "Envelope encryption" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🪣", title: "SSE-S3", text: "Default for new S3 objects. Keys managed by S3. Simplest.", color: "#f59e0b" },
              { icon: "🗝️", title: "SSE-KMS", text: "KMS keys: key policies, CloudTrail audit of every use. Turn on S3 Bucket Keys to cut KMS request costs.", color: "#f59e0b" },
              { icon: "🧰", title: "CloudHSM", text: "Dedicated, single-tenant HSMs in your VPC. You manage the keys and users; AWS can't access them.", color: "#f59e0b" },
              { icon: "📜", title: "ACM", text: "Free public TLS certificates that renew automatically for ELB, CloudFront, and API Gateway.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "Customer managed KMS keys give you the key policy, grants, rotation settings, and the ability to disable or schedule deletion. AWS managed keys are simpler but you can't change their policy.",
        "A key policy must allow a principal to use the key; for cross-account use, both the key policy and the other account's IAM policy must allow it.",
        "Turn on automatic rotation for customer managed keys (yearly by default). Old key material stays available, so existing data still decrypts.",
        "Encrypt in transit with TLS: ACM certificates on the load balancer or CloudFront, and a bucket policy that denies requests where aws:SecureTransport is false.",
        "For CloudFront, the ACM certificate must be requested in us-east-1 (N. Virginia). Imported certificates don't renew automatically.",
      ],
      tip: "\"Customer must have exclusive control of the HSM\" or strict single-tenant key storage → CloudHSM. \"Audit every key use\" and fine-grained key policies → SSE-KMS with a customer managed key.",
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
              { icon: "🔏", title: "S3 Object Lock", text: "WORM retention. Compliance mode: nobody, not even root, can shorten it. Governance mode: special permission can. Legal holds have no end date.", color: "#34d399" },
              { icon: "🔁", title: "S3 Replication", text: "Cross-Region or same-Region copies, optionally to another account. Replication Time Control gives a 15-minute SLA.", color: "#34d399" },
              { icon: "🧳", title: "AWS Backup", text: "Central backup plans across EC2, EBS, RDS, DynamoDB, EFS, FSx, and more, with cross-Region and cross-account copies.", color: "#38bdf8" },
              { icon: "🏦", title: "Backup Vault Lock", text: "Makes backups in a vault immutable so they can't be deleted early, even by an administrator.", color: "#38bdf8" },
              { icon: "📋", title: "Config and Artifact", text: "Config records resource changes and evaluates compliance rules. Artifact provides AWS compliance reports (SOC, PCI…).", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Classify data first (Macie helps find sensitive data), then choose controls: who can access it, how long to keep it, and how to recover it.",
        "S3 Block Public Access at the account level stops accidental public buckets. Bucket policies and access points control everything else.",
        "MFA Delete requires MFA to permanently delete object versions or change the versioning state.",
        "CloudTrail records API calls; an organization trail delivered to a locked-down log-archive account protects the audit record.",
      ],
      tip: "\"Records must not be altered or deleted for 7 years, by anyone\" → S3 Object Lock in compliance mode (or Backup Vault Lock for backups).",
    },
  ],

  questions: [
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
        "SCPs restrict every principal in member accounts, including their root users, and administrators in those accounts can't remove them. IAM policies can be edited by account admins; Config only detects.",
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
      explanation: "With AWS RAM, a VPC owner shares subnets; participants launch resources into them while the owner keeps control of the network.",
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
        "Federation lets people keep one directory identity and receive temporary role credentials in AWS. Syncing passwords into IAM users creates duplicate long-term credentials; Cognito is for application users.",
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
      explanation: "Trust (target side) and permission (source side) come first; STS then issues short-lived credentials limited to the role's policies.",
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
      explanation: "Security groups can't deny; network ACLs can. (AWS WAF IP sets on the ALB are another way to block at layer 7.)",
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
      explanation: "Routing (route tables, gateways) decides where traffic can go; filtering (NACLs, security groups) decides what is allowed.",
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
      explanation: "Cognito user pools handle customer identity (including social IdPs); identity pools issue scoped, temporary AWS credentials. IAM Identity Center is for the workforce.",
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
      explanation: "Each security service has one main job; exam questions usually hinge on that job.",
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
      explanation: "Direct Connect isn't encrypted by default; IPsec VPN over it (or MACsec where supported) adds encryption. An internet VPN is a common low-cost backup to Direct Connect.",
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
      explanation: "TLS with an ACM certificate protects traffic to the site; the aws:SecureTransport condition forces HTTPS for S3. SSE-S3 is encryption at rest, not in transit.",
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
      explanation: "The KMS key never leaves KMS; only the small data key travels. This is how AWS services encrypt large data with KMS keys.",
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
    { id: "s-waf", domain: "d1", kind: "service", term: "AWS WAF", definition: "Layer 7 web firewall: SQL injection, XSS, rate limits, IP and geo rules" },
    { id: "s-shield", domain: "d1", kind: "service", term: "AWS Shield", definition: "DDoS protection: Standard is free and automatic; Advanced adds a response team and cost protection" },
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
    { id: "c-least", domain: "d1", kind: "concept", term: "Least privilege", definition: "Grant only the actions and resources a task needs" },
    { id: "c-scp", domain: "d1", kind: "concept", term: "Service control policy", definition: "Organization guardrail that caps member-account permissions; grants nothing" },
    { id: "c-boundary", domain: "d1", kind: "concept", term: "Permissions boundary", definition: "Maximum permissions an identity-based policy can give a user or role" },
    { id: "c-explicitdeny", domain: "d1", kind: "concept", term: "Explicit deny", definition: "A Deny statement that overrides every Allow" },
    { id: "c-shared", domain: "d1", kind: "concept", term: "Shared responsibility model", definition: "AWS secures the cloud; you secure what you put in it" },
    { id: "c-sg", domain: "d1", kind: "concept", term: "Security group", definition: "Stateful allow-only firewall on each network interface" },
    { id: "c-nacl", domain: "d1", kind: "concept", term: "Network ACL", definition: "Stateless subnet filter with numbered allow and deny rules" },
    { id: "c-gatewayendpoint", domain: "d1", kind: "concept", term: "Gateway endpoint", definition: "Free route-table endpoint for S3 and DynamoDB" },
    { id: "c-envelope", domain: "d1", kind: "concept", term: "Envelope encryption", definition: "Encrypt data with a data key, and the data key with a KMS key" },
    { id: "c-objectlock", domain: "d1", kind: "concept", term: "S3 Object Lock", definition: "WORM retention; compliance mode can't be shortened by anyone" },
    { id: "c-bpa", domain: "d1", kind: "concept", term: "S3 Block Public Access", definition: "Account- or bucket-level switch that overrides public access settings" },
  ],

  challenges: [
    {
      id: "ch-vpc-egress",
      domain: "d1",
      lesson: "d1-vpc-security",
      title: "Private, but online",
      goal: "Fix the VPC so the app instance can download patches from the internet but can't be reached from it.",
      hint: "A NAT gateway only works from a subnet whose route table points 0.0.0.0/0 at an attached internet gateway. And a private instance shouldn't have a public IP or a route to the IGW.",
      takeaway: "Private subnet → 0.0.0.0/0 to a NAT gateway in a public subnet → public route table 0.0.0.0/0 to the IGW. Outbound works; inbound has no path.",
      render: (onSolved) => <VpcBuilderLab goal="egress" onSolved={onSolved} />,
    },
  ],
});
