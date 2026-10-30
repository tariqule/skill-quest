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
    summary: "Who protects what in the cloud, how you control who gets in, how you lock and watch your data, and which AWS services help keep you safe.",
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
      id: "d2-start-who-locks-what",
      level: "beginner",
      check: ["clf-b2-01", "clf-b2-02"],
      task: "2.1",
      title: "Who locks which door",
      visual: (
        <Layers
          layers={[
            { name: "You (the tenant)", color: "#34d399", items: ["🔑 Who gets a key", "📦 What you keep inside", "🚪 Locking your own door"] },
            { name: "AWS (the building owner)", color: "#38bdf8", items: ["🏢 The building and walls", "🔌 Power and wiring", "👮 Guards at the front entrance"] },
          ]}
        />
      ),
      points: [
        "Security in the cloud is a team job. AWS protects some things, and you protect others.",
        "Think of renting a flat. The owner looks after the building, the locks on the front entrance and the wiring. You lock your own door and decide who gets a key.",
        "AWS looks after its data centers, the hardware and the network. You look after your data, your passwords and how you set up your resources.",
        "AWS calls this the **shared responsibility model**.",
      ],
      tip: "If it's something you set up or choose, like a password or who can see a file, it's your job. If it's the physical building or hardware, it's AWS's.",
    },
    {
      id: "d2-start-who-gets-in",
      level: "beginner",
      check: ["clf-b2-03", "clf-b2-04"],
      task: "2.3",
      title: "Signing in and permissions",
      visual: (
        <Flow
          color="#a78bfa"
          steps={[
            { icon: "🙋", label: "Who are you?", sub: "Sign in with a password, plus a code from your phone" },
            { icon: "📋", label: "What may you do?", sub: "Your permissions are checked" },
            { icon: "✅", label: "Allowed or blocked", sub: "You only get what you were given" },
          ]}
        />
      ),
      points: [
        "Before AWS lets anyone do anything, it asks two questions: who are you, and what are you allowed to do?",
        "It's like an office keycard. The card proves who you are, and it only opens the doors you've been given access to.",
        "AWS handles this with **IAM** (Identity and Access Management). You create sign-ins for people and attach permissions to them.",
        "**MFA** (multi-factor authentication) adds a second check, such as a code from your phone. A stolen password alone is then not enough to get in.",
      ],
      tip: "Give people only the access they need for their job. AWS calls this **least privilege**.",
    },
    {
      id: "d2-start-locks-and-cameras",
      level: "beginner",
      check: ["clf-b2-05", "clf-b2-06"],
      task: "2.2",
      title: "Locks and cameras: encryption and logs",
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🔒", title: "Encryption: the lock", text: "Scrambles your data so only someone with the key can read it.", color: "#f87171" },
            { icon: "📹", title: "Logs: the camera", text: "Records who did what and when, so you can check later.", color: "#f59e0b" },
          ]}
        />
      ),
      points: [
        "**Encryption** scrambles data so it looks like nonsense to anyone without the key. A stolen encrypted file is useless to the thief.",
        "Data can be encrypted while it's stored (**at rest**) and while it travels across a network (**in transit**), like the padlock you see on HTTPS websites.",
        "**Logs** are records of what happened. Like a security camera, they let you look back and see who changed something and when.",
        "In AWS, **AWS KMS** manages encryption keys, and **AWS CloudTrail** keeps a log of the actions people take in your account.",
      ],
      tip: "Encryption stops people reading your data. Logs tell you what happened. You usually want both.",
    },
    {
      id: "d2-shared",
      check: ["d2-01", "d2-07"],
      task: "2.1",
      title: "Shared responsibility, and how it shifts",
      visual: (
        <div className="grid gap-6">
          <Layers
            layers={[
              { name: "You: security IN the cloud", color: "#34d399", items: ["Your data", "Who can access what (IAM)", "Your applications", "The operating system on EC2", "Firewall and network settings", "Which encryption you turn on"] },
              { name: "AWS: security OF the cloud", color: "#38bdf8", items: ["The software behind compute, storage, databases and networking", "The hypervisor and host machines", "Regions, Availability Zones and edge locations", "The physical data centers"] },
            ]}
          />
          <ResponsibilityShiftLab />
        </div>
      ),
      points: [
        "AWS secures the cloud itself: the buildings, the hardware, the network and the **hypervisor**, the software that splits one physical machine into many virtual ones.",
        "You secure what you put in the cloud: your data, the people and apps that can sign in, your applications and how you configure things.",
        "The more AWS manages a service, the less you do. On EC2 you patch the operating system. On RDS, AWS patches the operating system and the database engine. On Lambda, AWS runs the operating system and runtime too.",
        "Some controls are **shared**: patching, configuration and staff training each have an AWS part and a your-part. Physical and environmental controls you simply **inherit** from AWS.",
        "On Lambda you still own your function code and its **execution role**, the IAM role that sets what the function is allowed to touch.",
      ],
      tip: "If you can't touch it, like the hardware, the hypervisor or the data center, it's AWS's job. If you configure it, it's yours.",
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
              { icon: "📜", title: "AWS Artifact", text: "Download AWS's audit reports (SOC, ISO, PCI) and accept agreements such as a BAA yourself.", color: "#f87171" },
              { icon: "🔑", title: "AWS KMS", text: "Create and control encryption keys. Most services use it to encrypt stored data.", color: "#f87171" },
              { icon: "🔒", title: "AWS Certificate Manager", text: "Gets and renews TLS certificates, the thing behind the HTTPS padlock.", color: "#f87171" },
              { icon: "🧰", title: "AWS CloudHSM", text: "Key hardware just for you, which only you control.", color: "#f87171" },
            ]}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
              <div className="font-bold text-white">💾 At rest</div>
              Data sitting on disks, in S3 or in databases. You turn it on with KMS keys, for example SSE-KMS for S3, or encrypted EBS volumes and RDS instances.
            </div>
            <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3 text-sm text-slate-300">
              <div className="font-bold text-white">📡 In transit</div>
              Data moving across a network. Protect it with TLS (HTTPS) using certificates from ACM, or with a VPN tunnel.
            </div>
          </div>
        </div>
      ),
      points: [
        "**Compliance** means meeting the rules for your industry or country, such as PCI for card payments. Outside auditors check AWS against many of these programs.",
        "Not every service is covered by every program. AWS keeps a list called AWS Services in Scope by Compliance Program, so check it before you choose.",
        "Rules differ by country and industry. You choose the Region, and your data stays in that Region unless you move it.",
        "You get the benefit of AWS's audited infrastructure, but you're still responsible for making your own workload compliant.",
      ],
      tip: "If an auditor wants AWS's SOC or ISO report, the answer is AWS Artifact. If you need keys on dedicated hardware that only you control, it's CloudHSM.",
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
              { icon: "📈", title: "Amazon CloudWatch", text: "Shows how your resources are performing, with graphs, logs and alarms.", color: "#f59e0b" },
              { icon: "🕵️", title: "AWS CloudTrail", text: "Records who did what in your account, from where, and when.", color: "#f59e0b" },
              { icon: "📐", title: "AWS Config", text: "Tracks how each resource is set up, what changed, and whether it follows your rules.", color: "#f59e0b" },
            ]}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "🧑‍💻", label: "Someone takes an action", sub: "In the console, the CLI or code" },
              { icon: "🕵️", label: "CloudTrail records it", sub: "In the event history, or in a trail you set up" },
              { icon: "🪣", label: "The trail saves the logs", sub: "In an S3 bucket, kept as long as you like" },
              { icon: "🔔", label: "You search and alert", sub: "With CloudWatch Logs, Security Hub or Athena" },
            ]}
          />
        </div>
      ),
      points: [
        "IAM gives you access reports. The **credential report** lists every user and shows the state of their password, access keys and MFA.",
        "**Last accessed information** shows which services a user or role really used. If they never touch a service, you can safely remove that permission.",
        "**AWS Security Hub** pulls security findings from many services into one view, and runs automatic best-practice checks across your accounts.",
      ],
      tip: "For performance and alarms, pick CloudWatch. For \"who did it?\", pick CloudTrail. For \"is it set up by the rules, and what changed?\", pick Config.",
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
              { icon: "👤", title: "User", text: "A person or app with a long-term sign-in. For people, federation is usually better.", color: "#a78bfa" },
              { icon: "👥", title: "Group", text: "A set of users who all get the same permissions.", color: "#a78bfa" },
              { icon: "🎭", title: "Role", text: "A set of permissions someone borrows for a while, with temporary credentials.", color: "#a78bfa" },
              { icon: "📄", title: "Policy", text: "A JSON document that says which actions are allowed or denied on which resources.", color: "#a78bfa" },
            ]}
          />
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "🚫", label: "Is there a deny?", sub: "If any policy says deny, the answer is no" },
              { icon: "✅", label: "Is there an allow?", sub: "If so, the request goes through" },
              { icon: "🔒", label: "Neither?", sub: "Then it's denied by default" },
            ]}
          />
        </div>
      ),
      points: [
        "**Least privilege** means giving each person or app only the permissions their task needs, and checking them regularly. A mistake or a stolen password then does less damage.",
        "**AWS managed policies** are written and kept up to date by AWS. **Customer managed policies** are ones you write yourself and can attach to many users or roles.",
        "An app running on EC2 should get its permissions from an IAM role. Never store access keys on the server or in the code, where they can leak.",
        "Keep passwords and other secrets in **AWS Secrets Manager**, which can also change them for you on a schedule. **Systems Manager Parameter Store** holds settings and secure text values.",
        "An account **password policy** makes IAM users pick strong passwords, with rules for length, complexity and how often they change.",
      ],
      tip: "If an application needs to reach S3, give it an IAM role. If twenty developers need the same permissions, put them in an IAM group.",
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
              <li>• Use it only for the jobs that need it, such as closing the account, changing the root email, or restoring IAM permissions</li>
            </ul>
          </div>
          <Tiles
            cols={3}
            tiles={[
              { icon: "🔢", title: "MFA", text: "A second check on top of the password, such as an authenticator app or a security key.", color: "#34d399" },
              { icon: "🚪", title: "IAM Identity Center", text: "Staff sign in once and reach many AWS accounts and apps.", color: "#34d399" },
              { icon: "🤝", title: "Federation", text: "People sign in with the company login they already have, so you don't create IAM users for them.", color: "#34d399" },
              { icon: "🔁", title: "Cross-account role", text: "Someone in one account borrows a role in another account for a while.", color: "#34d399" },
              { icon: "📱", title: "Amazon Cognito", text: "Sign-up and sign-in for the customers of your app.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "The **root user** is the email login you used to create the account. It can do everything, and IAM policies in that account can't limit it, so guard it above all else.",
        "For everyday work, create admin users instead, ideally through IAM Identity Center. Keep the root user for the few jobs that need it.",
        "**Federation** lets staff sign in with a login they already have, such as the company directory. It works through standards called SAML and OIDC.",
      ],
      tip: "If employees should sign in once and reach many accounts, think IAM Identity Center. If your app's customers need to sign up, think Cognito.",
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
            { icon: "🧱", title: "AWS WAF", text: "A web firewall that blocks attacks like SQL injection and cross-site scripting, and bad IP addresses.", color: "#f87171" },
            { icon: "🛡️", title: "AWS Shield", text: "Protects against DDoS floods. Standard is on for everyone at no extra cost. Advanced adds more.", color: "#f87171" },
            { icon: "🗂️", title: "AWS Firewall Manager", text: "Sets WAF, Shield Advanced and security group rules across many accounts at once.", color: "#f87171" },
            { icon: "🐕", title: "Amazon GuardDuty", text: "Spots threats by reading CloudTrail, VPC Flow Logs and DNS logs.", color: "#f87171" },
            { icon: "🩺", title: "Amazon Inspector", text: "Scans EC2, container images and Lambda for known weaknesses.", color: "#f87171" },
            { icon: "🧭", title: "AWS Security Hub", text: "One place for all your security findings, plus automatic best-practice checks.", color: "#f87171" },
            { icon: "🔍", title: "Amazon Macie", text: "Finds sensitive data, such as personal details, sitting in S3.", color: "#f87171" },
            { icon: "🕸️", title: "Amazon Detective", text: "Helps you dig into a security finding to see what caused it.", color: "#f87171" },
            { icon: "🛍️", title: "AWS Marketplace", text: "Security products from other companies, billed through your AWS account.", color: "#f87171" },
          ]}
        />
      ),
      points: [
        "**AWS Trusted Advisor** also looks for security problems, such as ports open to the whole internet, a root user without MFA, or S3 buckets anyone can read.",
        "For security advice and news, AWS publishes the AWS Security Center, the AWS Security Blog and the AWS Knowledge Center.",
        "**Defense in depth** means stacking several layers of protection. Shield and WAF guard the edge, network ACLs guard each subnet, and security groups guard each instance.",
        "**AWS Organizations** groups many AWS accounts under one management account. Firewall Manager uses it to apply the same AWS WAF rules to every account at once.",
        "Web traffic often reaches you through **Amazon CloudFront**, AWS's content delivery network. AWS WAF rules can sit on the CloudFront distribution, before traffic ever reaches your VPC.",
      ],
      tip: "To find threats, use GuardDuty. To find weaknesses in software, use Inspector. To find personal data, use Macie. To investigate what happened, use Detective.",
    },
  ],

  questions: [
    // ── Start here ──
    {
      id: "clf-b2-01",
      domain: "d2",
      lesson: "d2-start-who-locks-what",
      level: "beginner",
      prompt: "In the cloud, who is responsible for security?",
      options: ["AWS and the customer share it, each protecting different things", "Only AWS", "Only the customer", "Nobody, because the cloud is safe and secure by default"],
      answer: [0],
      explanation: "Security is shared. AWS protects the buildings, hardware and network, and you protect your data and settings. That split is called the shared responsibility model.",
    },
    {
      id: "clf-b2-02",
      domain: "d2",
      lesson: "d2-start-who-locks-what",
      level: "beginner",
      prompt: "Which of these is the customer's job, not AWS's?",
      options: ["Choosing a strong password for their own account", "Guarding the doors of AWS data centers", "Replacing broken hard drives in AWS servers", "Keeping power running in AWS buildings"],
      answer: [0],
      explanation: "Anything you set up yourself, like your passwords, is your job. The physical side, like guards, hardware and power, is AWS's job.",
    },
    {
      id: "clf-b2-03",
      domain: "d2",
      lesson: "d2-start-who-gets-in",
      level: "beginner",
      prompt: "Which AWS service controls who can sign in to your account and what they're allowed to do?",
      options: ["AWS IAM (Identity and Access Management)", "Amazon S3", "Amazon EC2", "AWS Pricing Calculator, which sets each person's budget"],
      answer: [0],
      explanation: "IAM is AWS's sign-in and permissions system. You create identities for people and apps, then attach permissions that say what each one may do.",
    },
    {
      id: "clf-b2-04",
      domain: "d2",
      lesson: "d2-start-who-gets-in",
      level: "beginner",
      prompt: "What does multi-factor authentication (MFA) add to signing in?",
      options: ["A second check, such as a code from your phone, on top of the password", "A longer password", "A rule that your password must be longer and include numbers and symbols", "A faster internet connection"],
      answer: [0],
      explanation: "MFA asks for something extra after your password, usually a short code from an app or a security key. Someone who steals only your password still can't get in.",
    },
    {
      id: "clf-b2-05",
      domain: "d2",
      lesson: "d2-start-locks-and-cameras",
      level: "beginner",
      prompt: "What does encryption do to your data?",
      options: ["Scrambles it so only someone with the key can read it", "Deletes it after a week", "Makes the file smaller", "Copies it to a backup in another country in case it's lost"],
      answer: [0],
      explanation: "Encryption turns readable data into something that looks like nonsense. Only someone with the right key can turn it back, so stolen encrypted data is useless.",
    },
    {
      id: "clf-b2-06",
      domain: "d2",
      lesson: "d2-start-locks-and-cameras",
      level: "beginner",
      prompt: "Someone deleted an important server yesterday, and you want to know who did it. What helps you find out?",
      options: ["A log of actions in the account, such as AWS CloudTrail", "A bigger server", "Encrypting the server's disk", "Moving the remaining servers to a different Region so it can't happen again"],
      answer: [0],
      explanation: "Logs are like security camera footage for your account. CloudTrail records who took each action and when, so you can look back and see who deleted the server.",
    },
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
      options: ["Creating database user accounts", "Patching the database engine and the underlying operating system", "Deciding which networks and users can reach the database", "Classifying the data stored in tables"],
      answer: [1],
      explanation: "RDS is a managed service, so AWS patches the operating system and the database engine. Database users, network access and the data itself are still yours to manage.",
    },
    {
      id: "d2-03",
      domain: "d2",
      lesson: "d2-shared",
      prompt: "For a workload on AWS Lambda, what remains the customer's responsibility?",
      options: ["Patching the managed runtime", "Scaling the underlying servers when the function gets more traffic", "The function code and the permissions in its execution role", "Physical security of the servers"],
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
      explanation: "AWS patches the infrastructure, and you patch your own guest operating systems and applications. Configuration management and awareness and training are shared the same way.",
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
        "Nothing changes, because the shared responsibility model gives the customer exactly the same tasks for every service",
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
      explanation: "Infrastructure services like EC2 leave the most to you. Managed and serverless services hand more of the work over to AWS.",
    },
    {
      id: "d2-08",
      domain: "d2",
      lesson: "d2-shared",
      prompt: "Which controls does a customer fully inherit from AWS?",
      options: ["Physical and environmental controls of the data centers", "IAM policies for its users", "Security group rules", "Encryption settings for the S3 buckets it creates"],
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
        "Using AWS makes a customer's application automatically compliant, because AWS's audit reports cover everything that customers run on AWS",
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
      options: ["AWS Secrets Manager with automatic rotation", "AWS Key Management Service (AWS KMS)", "Amazon Cognito", "AWS Shield"],
      answer: [1],
      explanation: "AWS KMS creates and controls encryption keys and integrates with S3, EBS, RDS, and many other services for encryption at rest.",
    },
    {
      id: "d2-13",
      domain: "d2",
      lesson: "d2-compliance",
      prompt: "A website must serve traffic only over HTTPS. Which service provisions and automatically renews the TLS certificates?",
      options: ["AWS Certificate Manager (ACM)", "AWS KMS", "AWS Secrets Manager with rotation", "Amazon GuardDuty"],
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
      explanation: "Artifact gives you compliance documents. KMS manages encryption keys. ACM handles TLS certificates. CloudHSM gives you key hardware that's yours alone.",
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
      options: ["AWS Config", "AWS Trusted Advisor", "Amazon CloudWatch", "AWS Artifact"],
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
        "An IAM password policy that forces users to rotate their credentials every ninety days",
        "An AWS Budgets alert",
      ],
      answer: [0],
      explanation: "CloudTrail's event history only covers recent activity. To keep logs longer, create a trail that delivers them to S3, where you decide how long they stay.",
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
      options: ["Last accessed information (access advisor)", "IAM Identity Center, which lists every permission each user signed in with", "AWS Artifact", "Amazon Inspector"],
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
      explanation: "CloudWatch does the monitoring. CloudTrail and Config do the auditing, of actions and of settings. Security Hub brings the security findings together in one view.",
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
        "Give the developers the root user password and turn on MFA for it",
      ],
      answer: [1],
      explanation: "A group lets you set the permissions once. When a new developer starts, you just add them to the group.",
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
      explanation: "An IAM role gives the instance temporary credentials that AWS replaces automatically. There are no long-term keys sitting around to leak.",
    },
    {
      id: "d2-28",
      domain: "d2",
      lesson: "d2-iam",
      prompt: "What is the difference between an AWS managed policy and a customer managed policy?",
      options: [
        "AWS managed policies are created and maintained by AWS; customer managed policies are written by you and can be attached to many identities",
        "Customer managed policies can only be attached to one user, while AWS managed policies can be attached to any number of users, groups, and roles",
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
      options: ["An IAM account password policy", "An S3 bucket policy", "A security group", "An AWS Budgets alert on IAM activity"],
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
      explanation: "When IAM checks a request, a deny in any policy beats every allow. If no policy allows the action at all, it's denied by default.",
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
        "Use the root user for all daily work so that every action is easy to trace",
      ],
      answer: [0],
      explanation: "Protect root with MFA and a strong password, avoid root access keys, and do daily work with less-privileged identities.",
    },
    {
      id: "d2-35",
      domain: "d2",
      lesson: "d2-root",
      prompt: "A company has 40 AWS accounts. Employees should sign in once with their corporate credentials and reach the accounts and business applications they're assigned. Which service should it use?",
      options: ["AWS IAM Identity Center", "Amazon Cognito", "AWS Artifact", "AWS Directory Service"],
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
      explanation: "Use a role for temporary access and a group for permissions many people share. Identity Center is for your employees, and Cognito is for your app's customers.",
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
      options: ["AWS Firewall Manager", "Amazon Inspector", "AWS CloudHSM", "AWS Shield Advanced"],
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
      options: ["Amazon Inspector", "Amazon Macie", "AWS WAF", "Amazon Detective"],
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
      explanation: "This is defense in depth. DDoS protection and web filtering stop attacks at the edge, then firewalls at the subnet and at each instance catch anything that gets further.",
    },
  ],

  cards: [
    { id: "c2-shared", domain: "d2", kind: "concept", term: "Shared responsibility", definition: "AWS secures the cloud itself, like the buildings and hardware. You secure what you put in it, like your data and who can access it." },
    { id: "c2-sharedctl", domain: "d2", kind: "concept", term: "Shared controls", definition: "Jobs where AWS and you each do a part: patching, configuration, and awareness and training." },
    { id: "c2-inherited", domain: "d2", kind: "concept", term: "Inherited controls", definition: "Protections AWS handles entirely for you, such as physical security and the data center environment." },
    { id: "c2-leastpriv", domain: "d2", kind: "concept", term: "Least privilege", definition: "Give each person or app only the permissions its task needs, and nothing extra." },
    { id: "c2-deny", domain: "d2", kind: "concept", term: "Explicit deny", definition: "A deny written in any IAM policy. It always beats an allow." },
    { id: "c2-root", domain: "d2", kind: "concept", term: "Root user", definition: "The login that created the account, with full access. Turn on MFA, create no access keys, and use it only for jobs that need it." },
    { id: "c2-federation", domain: "d2", kind: "concept", term: "Federation", definition: "Letting people sign in to AWS with a login they already have, such as the company directory." },
    { id: "c2-mfa", domain: "d2", kind: "concept", term: "MFA", definition: "Multi-factor authentication: a second check after the password, such as a code from your phone." },
    { id: "c2-atrest", domain: "d2", kind: "concept", term: "Encryption at rest and in transit", definition: "At rest protects stored data, usually with KMS keys. In transit protects data moving over a network, usually with TLS." },
    { id: "c2-credreport", domain: "d2", kind: "concept", term: "IAM credential report", definition: "A downloadable list of every IAM user and the state of their password, access keys and MFA." },
    { id: "s-iam", domain: "d2", kind: "service", term: "AWS IAM", definition: "Identity and Access Management: decides who can sign in and what they can do, using users, groups, roles and policies." },
    { id: "s-identitycenter", domain: "d2", kind: "service", term: "AWS IAM Identity Center", definition: "Lets your staff sign in once and reach many AWS accounts and apps." },
    { id: "s-cognito", domain: "d2", kind: "service", term: "Amazon Cognito", definition: "Adds sign-up and sign-in to your own app, for your customers." },
    { id: "s-secrets", domain: "d2", kind: "service", term: "AWS Secrets Manager", definition: "Keeps passwords and other secrets safe, and can change them for you on a schedule." },
    { id: "s-ssm", domain: "d2", kind: "service", term: "AWS Systems Manager", definition: "Helps you run and patch many servers. Its Parameter Store holds settings and secure values." },
    { id: "s-artifact", domain: "d2", kind: "service", term: "AWS Artifact", definition: "Where you download AWS's audit and compliance reports and accept agreements yourself." },
    { id: "s-kms", domain: "d2", kind: "service", term: "AWS KMS", definition: "Key Management Service: creates and controls the keys that encrypt your data." },
    { id: "s-acm", domain: "d2", kind: "service", term: "AWS Certificate Manager", definition: "Gets and renews TLS certificates, which give websites the HTTPS padlock." },
    { id: "s-cloudhsm", domain: "d2", kind: "service", term: "AWS CloudHSM", definition: "Key-storing hardware that's dedicated to you and that only you control." },
    { id: "s-cloudtrail", domain: "d2", kind: "service", term: "AWS CloudTrail", definition: "A record of every action taken in your account: who did it, what they did, when and from where." },
    { id: "s-cloudwatch", domain: "d2", kind: "service", term: "Amazon CloudWatch", definition: "Watches how your resources perform, with graphs, logs, dashboards and alarms." },
    { id: "s-config", domain: "d2", kind: "service", term: "AWS Config", definition: "Records how each resource is set up over time and checks it against your rules." },
    { id: "s-securityhub", domain: "d2", kind: "service", term: "AWS Security Hub", definition: "Collects security findings from many services into one view and runs best-practice checks." },
    { id: "s-guardduty", domain: "d2", kind: "service", term: "Amazon GuardDuty", definition: "Reads your logs and known threat lists to spot attacks and suspicious activity." },
    { id: "s-inspector", domain: "d2", kind: "service", term: "Amazon Inspector", definition: "Scans your servers, container images and functions for known software weaknesses." },
    { id: "s-macie", domain: "d2", kind: "service", term: "Amazon Macie", definition: "Finds sensitive data, such as names and card numbers, stored in S3." },
    { id: "s-detective", domain: "d2", kind: "service", term: "Amazon Detective", definition: "Helps you investigate a security finding to see what really caused it." },
    { id: "s-waf", domain: "d2", kind: "service", term: "AWS WAF", definition: "A web firewall. It blocks harmful web requests, such as SQL injection, cross-site scripting or traffic from bad IP addresses." },
    { id: "s-shield", domain: "d2", kind: "service", term: "AWS Shield", definition: "Protects against DDoS attacks, where floods of traffic try to knock you offline. Standard is free and automatic. Advanced costs extra and does more." },
    { id: "s-fwmanager", domain: "d2", kind: "service", term: "AWS Firewall Manager", definition: "Sets firewall rules once and applies them across all your accounts." },
    { id: "s-ram", domain: "d2", kind: "service", term: "AWS Resource Access Manager", definition: "Lets you share resources, such as subnets, with your other AWS accounts." },
    { id: "s-directory", domain: "d2", kind: "service", term: "AWS Directory Service", definition: "Microsoft Active Directory that AWS runs for you." },
  ],

  challenges: [
    {
      id: "ch-shared-ec2",
      domain: "d2",
      lesson: "d2-shared",
      title: "Sort the EC2 duties",
      goal: "On the Amazon EC2 tab, assign all six tasks to AWS or to you correctly.",
      hint: "On EC2 you manage the guest OS and everything you install on it.",
      takeaway: "With an infrastructure service like EC2, you look after the operating system, your apps, your firewall rules and your data.",
      render: (onSolved) => <ResponsibilityShiftLab goal="ec2" onSolved={onSolved} />,
    },
    {
      id: "ch-shared-shift",
      domain: "d2",
      lesson: "d2-shared",
      title: "Watch the line move",
      goal: "Get every task right on all three tabs: EC2, RDS, and Lambda.",
      hint: "RDS takes over OS and engine patching. Lambda takes over servers, OS, runtime, and scaling.",
      takeaway: "The more managed the service, the more AWS takes on. Your data, your code and who has access always stay yours.",
      render: (onSolved) => <ResponsibilityShiftLab goal="allServices" onSolved={onSolved} />,
    },
  ],
});
