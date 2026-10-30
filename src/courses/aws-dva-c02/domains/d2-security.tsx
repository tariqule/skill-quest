import { Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { IamPolicyLab } from "../labs";

/**
 * Domain 2: Security (26%).
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "Security",
    world: "The IAM Citadel",
    weight: 26,
    emoji: "🛡️",
    color: "#f87171",
    summary: "Who can do what in AWS. You'll learn IAM policies and roles, temporary credentials from STS, Cognito sign-in and tokens, KMS encryption, secrets, and how to handle sensitive data.",
  },

  tasks: [
    {
      id: "2.1",
      title: "Implement authentication and/or authorization for applications and AWS services",
      covers: [
        "Federated access through an identity provider (for example, Amazon Cognito, IAM)",
        "Secure applications with bearer tokens",
        "Configure programmatic access; make authenticated calls to AWS services",
        "Assume an IAM role; define permissions for IAM principals",
        "Application-level authorization for fine-grained access control",
        "Cross-service authentication in microservice architectures",
      ],
    },
    {
      id: "2.2",
      title: "Implement encryption by using AWS services",
      covers: [
        "Encryption at rest and in transit",
        "Certificate management (for example, AWS Private CA)",
        "Client-side vs server-side encryption",
        "Use encryption keys to encrypt or decrypt data",
        "Generate certificates and SSH keys for development",
        "Encryption across account boundaries; enable and disable key rotation",
      ],
    },
    {
      id: "2.3",
      title: "Manage sensitive data in application code",
      covers: [
        "Data classification (for example, PII, PHI)",
        "Encrypt environment variables that contain sensitive data",
        "Use secret management services",
        "Sanitize sensitive data; application-level data masking",
        "Data access patterns for multi-tenant applications",
      ],
    },
  ],

  lessons: [
    {
      id: "d2-start-who",
      level: "beginner",
      task: "2.1",
      title: "Start here: who are you, and what may you do?",
      check: ["dva2-b2-01", "dva2-b2-02"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#f87171"
            steps={[
              { icon: "🪪", label: "Show your badge", sub: "Authentication: prove who you are" },
              { icon: "🚪", label: "Try a door", sub: "Your request to AWS" },
              { icon: "📜", label: "Check the rules", sub: "IAM policies" },
              { icon: "✅", label: "Door opens, or stays shut", sub: "Allowed or denied" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "👤", title: "IAM user", text: "A person or app with its own long-term sign-in details.", color: "#f87171" },
              { icon: "🎭", title: "IAM role", text: "An identity your code borrows, with temporary credentials.", color: "#f87171" },
              { icon: "📜", title: "Policy", text: "A short JSON list of what's allowed or denied.", color: "#f87171" },
            ]}
          />
        </div>
      ),
      points: [
        "Think of an office building. At the front desk you show ID to prove who you are. That's authentication. Your keycard then opens only certain doors. That's authorization.",
        "In AWS, IAM (Identity and Access Management) handles both. An IAM user is a person or app with long-term sign-in details. An IAM role is an identity your code borrows for a short time.",
        "A policy is a short JSON document that lists what an identity may do, such as \"read files from this one S3 bucket\".",
        "AWS says no unless a policy says yes. Every request starts out denied, and a policy has to allow it.",
      ],
      tip: "When you're unsure, ask two questions: who is calling, and which policy lets them do this? If no policy allows it, the call fails.",
    },
    {
      id: "d2-start-locks",
      level: "beginner",
      task: "2.2",
      title: "Start here: locks, keys, and encryption",
      check: ["dva2-b2-03", "dva2-b2-04"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "📄", label: "Your data", sub: "Anyone can read it" },
              { icon: "🔑", label: "Encrypt with a key", sub: "The key comes from KMS" },
              { icon: "🔒", label: "Encrypted data", sub: "Gibberish without the key" },
              { icon: "🔓", label: "Decrypt", sub: "Only callers allowed to use the key" },
            ]}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🗄️", title: "At rest", text: "Data sitting in storage, such as S3 objects or a DynamoDB table.", color: "#f59e0b" },
              { icon: "🚚", title: "In transit", text: "Data moving over the network. HTTPS (TLS) protects it.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "Encryption scrambles data so only someone with the right key can read it. Think of a letter in a locked box: anyone can carry the box, but only the key holder can open it.",
        "\"At rest\" means data sitting in storage, like files in S3. \"In transit\" means data moving across the network. You protect both: encryption in storage, and HTTPS (TLS) on the network.",
        "The hard part is looking after the keys. AWS KMS (Key Management Service) works like a locked key cabinet: it creates and stores your keys, and they never leave it.",
        "Many AWS services encrypt for you. For example, S3 encrypts new objects by default with keys it manages, called SSE-S3.",
      ],
      tip: "Keys belong in KMS, never in your code or config files.",
    },
    {
      id: "d2-start-secrets",
      level: "beginner",
      task: "2.3",
      title: "Start here: secrets and personal data",
      check: ["dva2-b2-05", "dva2-b2-06"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#34d399"
            steps={[
              { icon: "🙅", label: "Not in your code", sub: "Code gets copied and shared" },
              { icon: "🗝️", label: "In a secrets store", sub: "Secrets Manager or Parameter Store" },
              { icon: "λ", label: "Fetched at runtime", sub: "Your code asks for it when it runs" },
            ]}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🔑", title: "Secret", text: "Anything that grants access: passwords, API keys, tokens.", color: "#34d399" },
              { icon: "🪪", title: "PII", text: "Information that identifies a person: names, emails, card numbers.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "A secret is anything that grants access, like a database password or an API key. If it leaks, someone else can act as your app.",
        "Never write a secret into your code. Code gets copied, shared, and pushed to Git, and the secret travels with it.",
        "Keep secrets in AWS Secrets Manager or Systems Manager Parameter Store instead. Your code fetches the secret when it runs.",
        "Personal data needs care too. PII is information that identifies a person, like a name or email address. Keep it out of logs, and show only what's needed.",
      ],
      tip: "Spot the bad option fast: any answer that pastes a password or access key into code is wrong.",
    },
    {
      id: "d2-iam",
      task: "2.1",
      title: "How IAM decides: an explicit deny always wins",
      check: ["d2-01", "d2-04"],
      visual: (
        <div className="grid gap-6">
          <Flow
            color="#f87171"
            steps={[
              { icon: "📥", label: "Request", sub: "Who is asking, for which action, on which resource" },
              { icon: "⛔", label: "Any explicit Deny?", sub: "If yes, it's denied, whatever else allows it" },
              { icon: "✅", label: "Any Allow?", sub: "An identity policy or resource policy grants it" },
              { icon: "🚫", label: "Otherwise", sub: "Denied by default (an implicit deny)" },
            ]}
          />
          <IamPolicyLab />
        </div>
      ),
      points: [
        "An identity-based policy is attached to a user, group, or role. It says what that identity is allowed to do.", "A resource-based policy is attached to the resource itself, such as an S3 bucket, SQS queue, KMS key, or Lambda function. It names a Principal: who is allowed in.",
        "Grant least privilege: only the actions the code needs, on only the resources it touches. Resources are named by their ARN, the unique ID of each AWS resource. Conditions such as `aws:SecureTransport` narrow it further.",
        "When another service invokes your Lambda function, such as S3, SNS, or API Gateway, it needs permission in the function's resource-based policy. The execution role doesn't cover that.",
        "Some errors come with an \"encoded authorization failure message\". You can read it with `aws sts decode-authorization-message`, which shows why the request was denied.",
      ],
      tip: "A Deny statement anywhere beats every Allow. And if no policy mentions the action at all, the answer is still \"denied\".",
    },
    {
      id: "d2-sts",
      task: "2.1",
      title: "Roles, temporary credentials, and programmatic access",
      check: ["d2-09", "d2-10"],
      sources: [{ title: "AWS SDKs and Tools: Standardized credential providers", url: "https://docs.aws.amazon.com/sdkref/latest/guide/standardized-credentials.html", license: "AWS docs, facts only" }],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "🧑‍💻", label: "Principal in account A", sub: "Allowed to call sts:AssumeRole" },
              { icon: "🎫", label: "sts:AssumeRole", sub: "The role's trust policy must allow A" },
              { icon: "⏳", label: "Temporary credentials", sub: "Access key, secret key, session token, and an expiry time" },
              { icon: "🗄️", label: "Call resources in account B", sub: "Using the role's permissions" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🖥️", title: "EC2", text: "An instance profile hands the role's credentials to your code through instance metadata.", color: "#a78bfa" },
              { icon: "λ", title: "Lambda", text: "Runs with its execution role, assumed for every invocation.", color: "#a78bfa" },
              { icon: "📦", title: "ECS", text: "Each task definition gets its own task role, separate from the instance role.", color: "#a78bfa" },
              { icon: "💻", title: "Your laptop", text: "Named CLI profiles, or IAM Identity Center with `aws configure sso`.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "A role is an identity your code can borrow. It hands out temporary credentials that rotate on their own.", "Never put long-lived access keys in code or container images. If they leak, they keep working until someone revokes them.",
        "The SDK looks for credentials in a fixed order, called the credential provider chain. It checks settings in your code and environment variables first, then shared config files, and container or instance metadata last.",
        "Every role has two kinds of policy. The trust policy says who may assume the role. The permission policies say what the role may do once it's assumed.",
        "Services can call each other's APIs with IAM authorization, where each request is signed with SigV4, AWS's way of signing requests. Grant the caller's role `execute-api:Invoke` on the API.",
        "**AWS CloudTrail** records every API call and the identity that made it, so it shows you which credentials an application really used.",
      ],
      tip: "Need to reach a resource in another account? Create a role in that account whose trust policy allows yours, then call AssumeRole.",
    },
    {
      id: "d2-cognito",
      task: "2.1",
      title: "Cognito, tokens, and API authorizers",
      check: ["d2-16", "d2-17"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={2}
            tiles={[
              { icon: "👥", title: "User pool", text: "A user directory with sign-up, sign-in, MFA, and sign-in through social, SAML, or OIDC providers. It issues JWTs.", color: "#38bdf8" },
              { icon: "🪪", title: "Identity pool", text: "Trades a sign-in token, or guest access, for temporary AWS credentials through STS.", color: "#38bdf8" },
            ]}
          />
          <Flow
            color="#38bdf8"
            steps={[
              { icon: "📱", label: "User signs in", sub: "Cognito user pool" },
              { icon: "🎟️", label: "ID, access, and refresh tokens", sub: "JWTs signed by the user pool" },
              { icon: "🚪", label: "API Gateway authorizer", sub: "Checks the bearer token" },
              { icon: "λ", label: "Backend", sub: "Reads claims such as cognito:groups" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🔐", title: "Cognito authorizer", text: "Checks user pool tokens for you, with no code.", color: "#34d399" },
              { icon: "🧠", title: "Lambda authorizer", text: "Your own code checks any token or request data and returns an IAM policy. API Gateway can cache the result.", color: "#34d399" },
              { icon: "✍️", title: "IAM authorization", text: "Callers sign each request with SigV4 using their AWS credentials.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "A bearer token works like a cinema ticket: whoever holds it gets in. So only send tokens over HTTPS.", "Before you trust a token, verify its signature and check its exp (expiry), iss (issuer), and audience or client ID claims.",
        "Cognito gives you three tokens. The ID token says who the user is. The access token authorizes API calls, with scopes. The refresh token gets new tokens without signing in again.",
        "For fine-grained access, an identity pool role can limit which DynamoDB items a user can touch. Set the `dynamodb:LeadingKeys` condition to the user's identity ID.",
      ],
      tip: "If the question says \"sign-up and sign-in\", think user pool. If it says \"temporary AWS credentials for app users\", think identity pool.",
    },
    {
      id: "d2-kms",
      task: "2.2",
      title: "KMS and envelope encryption",
      check: ["d2-24", "d2-29"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "🔑", label: "GenerateDataKey", sub: "KMS returns a plaintext key and the same key encrypted" },
              { icon: "🔒", label: "Encrypt locally", sub: "Encrypt the data with the plaintext data key" },
              { icon: "🗑️", label: "Throw away the plaintext key", sub: "Keep the encrypted key next to the encrypted data" },
              { icon: "🔓", label: "To read it back: Decrypt", sub: "KMS decrypts the data key, then you decrypt the data locally" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🪣", title: "SSE-S3", text: "Keys managed by S3. It's the default for new objects.", color: "#f87171" },
              { icon: "🗝️", title: "SSE-KMS", text: "KMS keys you control and can audit in CloudTrail. Turn on S3 Bucket Keys to cut KMS requests.", color: "#f87171" },
              { icon: "🧳", title: "SSE-C", text: "You send your own key with every request, over HTTPS only. S3 doesn't store it.", color: "#f87171" },
              { icon: "💻", title: "Client-side", text: "You encrypt before upload, for example with the AWS Encryption SDK. AWS never sees the plaintext.", color: "#f87171" },
            ]}
          />
        </div>
      ),
      points: [
        "The KMS Encrypt API takes at most 4 KB of plaintext. For anything bigger, use envelope encryption: encrypt the data with a data key, and let KMS encrypt only that small key.",
        "Using a key from another account needs permission on both sides. The key policy in the owning account must allow the other account, and an IAM policy in the other account must grant the KMS actions.",
        "Automatic rotation on a customer managed key keeps the old key material, so older encrypted data still decrypts. AWS managed keys rotate every year on their own.",
        "\"In transit\" means while data moves over the network. Use TLS everywhere.", "AWS Certificate Manager (ACM) issues and renews public certificates. AWS Private CA issues private certificates for internal services.",
      ],
      tip: "Encrypting a large file with KMS? Use GenerateDataKey. Seeing KMS ThrottlingException errors from S3? Turn on S3 Bucket Keys.",
    },
    {
      id: "d2-secrets",
      task: "2.3",
      title: "Secrets Manager and Parameter Store",
      check: ["d2-33", "d2-34"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={2}
            tiles={[
              { icon: "🗝️", title: "AWS Secrets Manager", text: "For database passwords and API keys. It rotates them automatically with a Lambda rotation function, with built-in support for RDS and Aurora. Charged per secret.", color: "#34d399" },
              { icon: "📒", title: "Systems Manager Parameter Store", text: "Config values and secrets in a path hierarchy. SecureString values are encrypted with KMS. Standard parameters have no storage charge. No built-in rotation.", color: "#34d399" },
            ]}
          />
          <Flow
            color="#34d399"
            steps={[
              { icon: "λ", label: "Function starts", sub: "Fetch the secret during init" },
              { icon: "🧠", label: "Cache it", sub: "In memory, or with the Parameters and Secrets extension" },
              { icon: "🔁", label: "Refresh after a TTL", sub: "So you pick up rotated values" },
            ]}
          />
        </div>
      ),
      points: [
        "Lambda encrypts environment variables at rest with KMS. Use a customer managed key when you need to control the key yourself.", "Better still, keep secrets out of environment variables entirely.",
        "Fetch secrets at runtime with the SDK, then cache them. Caching cuts latency and API costs.",
        "CodeBuild and ECS task definitions can reference Secrets Manager and Parameter Store values directly.",
      ],
      tip: "Need automatic rotation? Use Secrets Manager. Need cheap, organized config values? Use Parameter Store.",
    },
    {
      id: "d2-data",
      task: "2.3",
      title: "Sensitive data, masking, and multi-tenant access",
      check: ["d2-38", "d2-41"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "🪪", title: "PII", text: "Anything that identifies a person: name, email, government ID, card number.", color: "#a78bfa" },
              { icon: "🩺", title: "PHI", text: "Health information linked to a person. It comes with strict handling rules.", color: "#a78bfa" },
              { icon: "🎭", title: "Mask or tokenize", text: "Show only ****1234, or swap the value for a token and keep the real one safely elsewhere.", color: "#a78bfa" },
              { icon: "🧼", title: "Sanitize", text: "Validate input, encode output, and keep secrets and PII out of logs.", color: "#a78bfa" },
            ]}
          />
          <Flow
            color="#38bdf8"
            steps={[
              { icon: "🏢", label: "Tenant signs in", sub: "The token carries tenantId" },
              { icon: "🎫", label: "Role session tagged", sub: "aws:PrincipalTag/tenantId" },
              { icon: "🗄️", label: "Shared (pooled) DynamoDB table", sub: "Each partition key starts with tenantId" },
              { icon: "🔒", label: "dynamodb:LeadingKeys", sub: "Returns only that tenant's items" },
            ]}
          />
        </div>
      ),
      points: [
        "Classify your data first. The label you give it decides the rules for encryption, access, retention, and logging.",
        "CloudWatch Logs data protection policies can find and mask sensitive data, such as card numbers, inside log events.",
        "A multi-tenant app serves many customers (tenants) from one system. In a silo model, each tenant gets its own resources.", "In a pool model, tenants share resources. IAM conditions plus checks in your code keep each tenant to its own data.",
      ],
    },
  ],

  questions: [
    // ── Start here (beginner) ──
    {
      id: "dva2-b2-01",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-who",
      prompt: "In security, what's the difference between authentication and authorization?",
      options: [
        "Authentication proves who you are. Authorization decides what you're allowed to do.",
        "Authentication decides what you can do. Authorization proves who you are.",
        "They're two names for the same thing",
        "Authentication encrypts data, and authorization stores passwords",
      ],
      answer: [0],
      explanation: "Authentication is showing your ID at the front desk. Authorization is your keycard opening only some doors. In AWS, IAM handles both.",
    },
    {
      id: "dva2-b2-02",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-who",
      prompt: "A Lambda function's role has no policy that allows reading from S3, and the bucket has no policy that grants it either. The function tries to read a file from the bucket. What happens?",
      options: [
        "The request is denied, because AWS denies anything a policy doesn't allow",
        "The request works, because nothing in either policy blocks it from happening",
        "The request works the first time only",
        "AWS emails the developer to approve it",
      ],
      answer: [0],
      explanation: "AWS starts from no. A request only succeeds when a policy allows it, so with no S3 permission the read fails. This is called an implicit deny.",
    },
    {
      id: "dva2-b2-03",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-locks",
      prompt: "What does encryption do to your data?",
      options: [
        "It scrambles the data so only someone with the right key can read it",
        "It compresses the file so it takes up less space and uploads more quickly",
        "It deletes the data after a set time",
        "It copies the data to a second Region",
      ],
      answer: [0],
      explanation: "Encryption turns readable data into scrambled data, and only someone holding the right key can turn it back. Compressing, deleting, and copying data are different jobs.",
    },
    {
      id: "dva2-b2-04",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-locks",
      prompt: "Which AWS service creates and stores encryption keys for your applications?",
      options: ["AWS KMS (Key Management Service)", "Amazon S3", "AWS Lambda", "Amazon CloudWatch (logs and metrics)"],
      answer: [0],
      explanation: "KMS is the key cabinet of AWS. It creates your keys and keeps them safe, and CloudTrail records every call that uses them. Your code asks KMS to use a key, and the key never leaves KMS.",
    },
    {
      id: "dva2-b2-05",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-secrets",
      prompt: "A Lambda function needs a database password. Where should the password live?",
      options: [
        "In AWS Secrets Manager, fetched by the function when it runs",
        "Typed directly into the function's source code as a constant",
        "In a comment at the top of the code",
        "In the project's README file in Git",
      ],
      answer: [0],
      explanation: "Secrets Manager keeps the password encrypted and lets your code fetch it at runtime. Anything in code, comments, or Git can be copied by anyone who sees the repository.",
    },
    {
      id: "dva2-b2-06",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-secrets",
      prompt: "Which of these is PII (personally identifiable information)?",
      options: ["A customer's email address", "The number of orders placed today", "The AWS Region your app runs in", "The version number of your app"],
      answer: [0],
      explanation: "PII is any information that points to a specific person, and an email address does. Totals, Regions, and version numbers don't identify anyone.",
    },
    // ── IAM ──
    {
      id: "d2-01",
      domain: "d2",
      lesson: "d2-iam",
      prompt:
        "An IAM role has two policies attached. One allows s3:* on a bucket. The other denies s3:DeleteObject on the same bucket. What happens when the role calls DeleteObject on that bucket?",
      options: [
        "The request is denied, because an explicit deny overrides any allow",
        "The request is allowed, because the s3:* allow is broader than the deny",
        "The result depends on which policy was attached first",
        "The request is allowed only if MFA is used",
      ],
      answer: [0],
      explanation: "IAM looks at every policy that applies. If any of them explicitly denies the action, the request is denied, however broad the Allow is.",
    },
    {
      id: "d2-02",
      domain: "d2",
      lesson: "d2-iam",
      prompt: "A Lambda function's execution role has policies for S3 and SQS, but none mention DynamoDB. The function calls dynamodb:PutItem. What is the result?",
      options: ["Access denied, because requests are implicitly denied unless something allows them", "Allowed, because Lambda execution roles include default DynamoDB access", "Allowed, because nothing denies it", "Allowed in the same Region only"],
      answer: [0],
      explanation: "IAM denies by default. If no policy allows `dynamodb:PutItem`, the call fails with an implicit deny, even though nothing denies it outright.",
    },
    {
      id: "d2-03",
      domain: "d2",
      lesson: "d2-iam",
      prompt: "A Lambda function only needs to read items from one DynamoDB table named Orders. Which execution role policy follows least privilege?",
      options: [
        "Allow dynamodb:GetItem and dynamodb:Query on the Orders table ARN",
        "Allow dynamodb:* on all resources",
        "Attach the AdministratorAccess managed policy",
        "Allow dynamodb:GetItem and dynamodb:Query on all tables in the account",
      ],
      answer: [0],
      explanation: "Least privilege means granting only the actions the function needs, on only the table it uses. Reading Orders needs GetItem and Query on that one table ARN, nothing wider.",
    },
    {
      id: "d2-04",
      domain: "d2",
      lesson: "d2-iam",
      prompt: "A security rule says objects in an S3 bucket may only be accessed over HTTPS. How can a developer enforce this for every caller?",
      options: [
        "Add a bucket policy statement that denies all S3 actions when aws:SecureTransport is false",
        "Enable S3 Versioning",
        "Enable default encryption with SSE-S3 so every object is encrypted when it's stored",
        "Turn on S3 Transfer Acceleration",
      ],
      answer: [0],
      explanation: "A bucket policy is a resource-based policy, so it applies to every caller. A Deny when `aws:SecureTransport` is false blocks plain HTTP, and an explicit deny can't be overridden.",
    },
    {
      id: "d2-05",
      domain: "d2",
      lesson: "d2-iam",
      prompt: "Which of the following are resource-based policies? (Choose two.)",
      options: [
        "An Amazon S3 bucket policy",
        "A Lambda function's permissions policy that lets Amazon S3 invoke it",
        "A policy attached to an IAM group",
        "An Amazon EC2 security group",
        "A CloudWatch alarm",
      ],
      answer: [0, 1],
      explanation: "A resource-based policy is attached to the resource and names who is allowed. Group policies are identity-based, and security groups are network firewalls, not IAM policies.",
    },
    {
      id: "d2-06",
      domain: "d2",
      lesson: "d2-iam",
      prompt:
        "A developer configures an S3 event notification to invoke a Lambda function, but the configuration fails with an error saying S3 can't invoke the function. What should the developer add?",
      options: [
        "A statement in the function's resource-based policy allowing s3.amazonaws.com to call lambda:InvokeFunction, scoped to the bucket ARN",
        "The s3:GetObject and lambda:InvokeFunction permissions in the function's execution role, scoped to the bucket ARN and the function ARN",
        "A NAT gateway for the function",
        "Provisioned concurrency for the function",
      ],
      answer: [0],
      explanation: "When a service pushes events to Lambda, it needs permission in the function's resource-based policy. The execution role only controls what the function itself can call, not who can invoke it.",
    },
    {
      id: "d2-07",
      domain: "d2",
      lesson: "d2-iam",
      type: "order",
      prompt: "Put the steps of IAM policy evaluation for a request within one account in order.",
      items: [
        "Collect every policy that applies to the request",
        "If any statement explicitly denies the request, deny it",
        "Otherwise, if a statement allows the request, allow it",
        "If nothing allows it, deny it implicitly",
      ],
      explanation: "The explicit deny check comes first and always wins. If nothing allows the action, the answer is deny by default.",
    },
    {
      id: "d2-08",
      domain: "d2",
      lesson: "d2-iam",
      prompt: "An API call fails with UnauthorizedOperation and an encoded authorization failure message. How can the developer see which policy caused the denial?",
      options: ["Run aws sts decode-authorization-message with the encoded message", "Base64-decode the message in a browser tab to read the denying policy's name", "Open a support case, because it can't be decoded", "Check the AWS Health Dashboard"],
      answer: [0],
      explanation: "The STS DecodeAuthorizationMessage call shows the request context and why it was denied. The caller needs the `sts:DecodeAuthorizationMessage` permission to use it.",
    },
    // ── Roles and STS ──
    {
      id: "d2-09",
      domain: "d2",
      lesson: "d2-sts",
      prompt: "An application on an Amazon EC2 instance must upload files to Amazon S3. What is the MOST secure way to provide credentials?",
      options: [
        "Attach an IAM role to the instance through an instance profile",
        "Store an IAM user's access keys in a config file on the instance",
        "Put access keys in the application source code",
        "Pass the root user's keys as environment variables",
      ],
      answer: [0],
      explanation: "An instance profile attaches a role to the instance. The SDK picks up temporary credentials from instance metadata, and they rotate automatically, so there are no keys to leak.",
    },
    {
      id: "d2-10",
      domain: "d2",
      lesson: "d2-sts",
      prompt: "A Lambda function in account A must write items to a DynamoDB table in account B. Which approach should the developer use?",
      options: [
        "Create a role in account B whose trust policy allows the function's role in account A. The function calls sts:AssumeRole and uses the returned credentials",
        "Copy an IAM user's long-term access keys from account B into the function's environment variables, encrypt them with AWS KMS, and rotate them every 90 days",
        "Make the DynamoDB table public",
        "Add account A's root user to an IAM group in account B",
      ],
      answer: [0],
      explanation: "Cross-account access uses a role in the account that owns the resource. Its trust policy names who can assume it, and the caller also needs permission to call sts:AssumeRole on that role.",
    },
    {
      id: "d2-11",
      domain: "d2",
      lesson: "d2-sts",
      prompt: "What does a successful sts:AssumeRole call return?",
      options: [
        "Temporary credentials: an access key ID, a secret access key, a session token, and an expiration time",
        "A new permanent IAM user",
        "A password for the AWS Management Console, plus the account ID and the user's sign-in URL for that session",
        "An X.509 certificate",
      ],
      answer: [0],
      explanation: "STS returns short-term credentials. You must send the session token with every request you sign with them.",
    },
    {
      id: "d2-12",
      domain: "d2",
      lesson: "d2-sts",
      prompt: "A developer runs AWS CLI commands against dev and prod accounts from a laptop and wants to switch between them easily. What should the developer configure?",
      options: ["Named profiles in the AWS CLI config and credentials files, selected with --profile or AWS_PROFILE", "One set of root user keys for both accounts", "A second laptop", "Environment variables hard-coded in shell scripts that are committed to the team's shared Git repository"],
      answer: [0],
      explanation: "Named profiles keep each account's settings and credentials apart, including role and IAM Identity Center (SSO) profiles. The CLI and SDKs pick one by name.",
    },
    {
      id: "d2-13",
      domain: "d2",
      lesson: "d2-sts",
      prompt:
        "An application on EC2 should use its instance role, but CloudTrail shows its calls are made by an old IAM user. A developer finds AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY set on the instance. Why is the old identity used?",
      options: [
        "The SDK's default credential provider chain checks environment variables before instance profile credentials",
        "Instance roles only work in us-east-1",
        "The SDK always prefers IAM user credentials over role credentials whenever both are available on the same instance",
        "Instance metadata is disabled for every instance by default",
      ],
      answer: [0],
      explanation: "The SDK checks environment variables before it checks instance metadata. Remove the stale variables and the SDK falls through to the instance role.",
    },
    {
      id: "d2-14",
      domain: "d2",
      lesson: "d2-sts",
      prompt: "Several microservices run as Amazon ECS tasks on the same cluster, and each needs access to different AWS resources. How should permissions be set up? (Choose two.)",
      options: [
        "Define a separate IAM task role in each service's task definition",
        "Grant each task role only the actions its service needs",
        "Give every container the container instance's IAM role",
        "Bake an IAM user's access keys into each container image",
        "Attach AdministratorAccess to all tasks to simplify deployments",
      ],
      answer: [0, 1],
      explanation: "A task role gives each task its own credentials, separate from the instance role. That way each service gets only the permissions it needs.",
    },
    {
      id: "d2-15",
      domain: "d2",
      lesson: "d2-sts",
      prompt:
        "Service A, running on Lambda, calls service B's REST API in Amazon API Gateway. Service B must accept calls only from service A, without managing shared passwords. What should the developer do?",
      options: [
        "Enable IAM authorization on service B's methods and allow execute-api:Invoke in service A's execution role. Service A signs its requests with SigV4",
        "Embed a shared static password in both services' code and send it in a custom request header on every call, then check it in a Lambda authorizer on B",
        "Allow only service A's public IP address",
        "Make service B's API public and log every call",
      ],
      answer: [0],
      explanation: "With IAM authorization, each service proves who it is with its own role credentials. There's no shared password to store or rotate.",
    },
    // ── Cognito and tokens ──
    {
      id: "d2-16",
      domain: "d2",
      lesson: "d2-cognito",
      prompt: "A mobile app needs user sign-up, sign-in, MFA, and the option to sign in with Google. Which solution requires the LEAST custom code?",
      options: ["An Amazon Cognito user pool with Google configured as a federated identity provider", "IAM users for every app user", "A DynamoDB table of usernames and password hashes with a Lambda function to check them", "AWS STS GetSessionToken"],
      answer: [0],
      explanation: "A user pool is a managed user directory. It handles sign-up, sign-in, MFA, and sign-in through Google or enterprise providers, and it issues JWTs, so you write very little code.",
    },
    {
      id: "d2-17",
      domain: "d2",
      lesson: "d2-cognito",
      prompt: "Signed-in users of a mobile app must upload photos directly to an S3 bucket from the device using temporary AWS credentials. What should the developer use?",
      options: ["An Amazon Cognito identity pool", "A Cognito user pool alone", "One IAM user shared by all devices", "An S3 bucket policy that allows public writes"],
      answer: [0],
      explanation: "An identity pool swaps a sign-in token for temporary AWS credentials, limited by a role. A user pool signs users in, but it doesn't hand out AWS credentials.",
    },
    {
      id: "d2-18",
      domain: "d2",
      lesson: "d2-cognito",
      prompt: "An Amazon API Gateway REST API must accept only requests that carry a valid token from the company's Amazon Cognito user pool. Which solution requires the LEAST code?",
      options: ["A Cognito user pool authorizer on the API methods", "A Lambda authorizer that calls an external service", "API keys with a usage plan", "A resource policy that allows all principals"],
      answer: [0],
      explanation: "The Cognito authorizer checks the user pool JWT for you, with no code. API keys identify and meter clients, but they aren't a way to sign users in.",
    },
    {
      id: "d2-19",
      domain: "d2",
      lesson: "d2-cognito",
      prompt:
        "An API must accept bearer tokens issued by a third-party OAuth provider and apply custom authorization rules based on the token's claims. Which API Gateway feature fits?",
      options: ["A Lambda authorizer that validates the token and returns an IAM policy", "A Cognito user pool authorizer that's configured to trust the OAuth provider", "Mutual TLS only", "Stage variables"],
      answer: [0],
      explanation: "A Lambda authorizer runs your own checks on any token or request data and returns an IAM policy. API Gateway can cache the result so it doesn't run on every call.",
    },
    {
      id: "d2-20",
      domain: "d2",
      lesson: "d2-cognito",
      type: "match",
      prompt: "Match each Amazon Cognito user pool token to its purpose.",
      pairs: [
        ["ID token", "Carries claims about the user's identity, such as email"],
        ["Access token", "Authorizes calls to APIs, with scopes and groups"],
        ["Refresh token", "Gets new ID and access tokens without signing in again"],
      ],
      explanation: "ID and access tokens are short-lived JWTs. The refresh token lasts longer, and you trade it in for new ID and access tokens.",
    },
    {
      id: "d2-21",
      domain: "d2",
      lesson: "d2-cognito",
      prompt:
        "App users get AWS credentials through a Cognito identity pool and write directly to a DynamoDB table. Each user must be able to read and write only items whose partition key equals their own identity ID. How should the developer enforce this?",
      options: [
        "Add a dynamodb:LeadingKeys condition with ${cognito-identity.amazonaws.com:sub} to the authenticated role's policy",
        "Filter the query results in the mobile app so that each signed-in user only sees and edits the items that carry their own user ID",
        "Create one table per user",
        "Use a scan with a filter expression",
      ],
      answer: [0],
      explanation: "The LeadingKeys condition only allows items whose partition key matches the policy variable, here the user's identity ID. IAM enforces the rule, so a tampered app can't get around it.",
    },
    {
      id: "d2-22",
      domain: "d2",
      lesson: "d2-cognito",
      prompt: "A backend receives JWT bearer tokens. Which checks should it perform before trusting a token? (Choose two.)",
      options: [
        "Verify the signature with the issuer's public keys (JWKS)",
        "Check the expiration, issuer, and audience or client ID claims",
        "Accept any token that decodes as valid JSON",
        "Accept tokens passed in URL query strings so they're easy to log",
        "Skip validation for requests from mobile apps",
      ],
      answer: [0, 1],
      explanation: "Anyone holding a bearer token can use it, so verify its signature and check its claims before you trust it. Tokens in URLs end up in logs and browser history.",
    },
    {
      id: "d2-23",
      domain: "d2",
      lesson: "d2-cognito",
      prompt:
        "Only administrators may call DELETE /products in an API that uses a Cognito user pool authorizer. What is the simplest way to implement this application-level rule?",
      options: [
        "Put administrators in a Cognito user pool group and check the cognito:groups claim before deleting",
        "Create a separate user pool for every administrator",
        "Give administrators the AWS account root user",
        "Hide the delete button in the user interface for anyone who isn't an administrator",
      ],
      answer: [0],
      explanation: "Cognito puts group membership into the token as the cognito:groups claim, and your backend or a Lambda authorizer can check it. Hiding a button isn't access control, because anyone can still call the API.",
    },
    // ── KMS and encryption ──
    {
      id: "d2-24",
      domain: "d2",
      lesson: "d2-kms",
      prompt: "An application must encrypt 2 MB files with a key managed in AWS KMS. Which approach should the developer use?",
      options: [
        "Call GenerateDataKey, encrypt the file locally with the plaintext data key, and store the encrypted data key with the file",
        "Call the KMS Encrypt API on the whole 2 MB file in one request, then store the returned ciphertext blob in Amazon S3 next to the key ID",
        "Split the file into 4 KB chunks and call Encrypt on each one",
        "Download the KMS key material and use it locally",
      ],
      answer: [0],
      explanation: "KMS Encrypt accepts at most 4 KB of plaintext, so a 2 MB file is too big. Envelope encryption encrypts the file with a data key, and KMS protects only that key. The KMS key material never leaves KMS.",
    },
    {
      id: "d2-25",
      domain: "d2",
      lesson: "d2-kms",
      type: "order",
      prompt: "Put the steps of envelope encryption and decryption in order.",
      items: [
        "Call KMS GenerateDataKey",
        "Encrypt the data locally with the plaintext data key",
        "Erase the plaintext data key and store the encrypted data key with the ciphertext",
        "To read the data, call KMS Decrypt on the encrypted data key",
        "Decrypt the data locally with the returned plaintext key",
      ],
      explanation: "Only the small data key goes to KMS. The bulk data is encrypted and decrypted on your side.",
    },
    {
      id: "d2-26",
      domain: "d2",
      lesson: "d2-kms",
      prompt: "A compliance rule says data must be encrypted before it leaves the application, so AWS never receives plaintext. Which approach meets the rule?",
      options: ["Client-side encryption, for example with the AWS Encryption SDK, before uploading to S3", "SSE-S3", "SSE-KMS with a customer managed key that only the team can use, applied by S3 on upload", "Enabling HTTPS only"],
      answer: [0],
      explanation: "With server-side encryption, S3 receives your plaintext (over TLS) and encrypts it at rest. Client-side encryption encrypts the data before it leaves your app, so AWS never sees it.",
    },
    {
      id: "d2-27",
      domain: "d2",
      lesson: "d2-kms",
      prompt:
        "An application writes thousands of objects per second to a bucket that uses SSE-KMS, and requests start failing with KMS ThrottlingException errors. Which change reduces calls to KMS?",
      options: ["Enable S3 Bucket Keys for the bucket", "Switch to SSE-C", "Enable S3 Versioning", "Use a larger object size limit for uploads"],
      answer: [0],
      explanation: "With S3 Bucket Keys, S3 uses a bucket-level key derived from your KMS key. That greatly cuts the number of requests S3 makes to KMS, which stops the throttling.",
    },
    {
      id: "d2-28",
      domain: "d2",
      lesson: "d2-kms",
      prompt:
        "Account A owns a customer managed KMS key. A role in account B must decrypt data encrypted with that key. What must be in place? (Choose two.)",
      options: [
        "The key policy in account A allows account B (or the role) to use the key",
        "An IAM policy in account B grants the role kms:Decrypt on the key's ARN",
        "Account B copies the key material into its own account",
        "The key is converted to an AWS managed key",
        "The key policy allows all principals with no conditions",
      ],
      answer: [0, 1],
      explanation: "Cross-account KMS access needs a yes from both sides. The key policy trusts the other account, and that account's IAM policy passes the KMS actions on to its role.",
    },
    {
      id: "d2-29",
      domain: "d2",
      lesson: "d2-kms",
      prompt: "A team enables automatic key rotation on a customer managed KMS key. What happens to data that was encrypted before the rotation?",
      options: [
        "It can still be decrypted, because KMS keeps the previous key material and uses it automatically",
        "It must be re-encrypted with the new key material before it can be read again by any application",
        "It becomes unreadable",
        "It is deleted after 30 days",
      ],
      answer: [0],
      explanation: "Rotation adds new key material for new encryptions and keeps the older material for decrypting old data. The key ID and ARN stay the same, so your code doesn't change.",
    },
    {
      id: "d2-30",
      domain: "d2",
      lesson: "d2-kms",
      prompt: "A team wants S3 objects encrypted at rest with no key management, no extra cost, and no code changes. Which option meets these requirements?",
      options: ["SSE-S3 (Amazon S3 managed keys)", "SSE-KMS with a customer managed key", "SSE-C", "Client-side encryption"],
      answer: [0],
      explanation: "SSE-S3 is applied to new objects by default and needs no key management. SSE-KMS adds key control and auditing, but you pay for KMS requests.",
    },
    {
      id: "d2-31",
      domain: "d2",
      lesson: "d2-kms",
      prompt: "Internal microservices must use TLS certificates that are trusted only inside the company and don't need to be publicly trusted. Which service issues them?",
      options: ["AWS Private Certificate Authority", "Public certificates from AWS Certificate Manager", "AWS Secrets Manager", "AWS WAF"],
      answer: [0],
      explanation: "AWS Private CA runs your own private certificate authority, which only your systems trust. ACM public certificates are for endpoints the public internet must trust.",
    },
    {
      id: "d2-32",
      domain: "d2",
      lesson: "d2-kms",
      prompt: "A company must keep its own encryption keys outside AWS but wants Amazon S3 to perform the encryption. Which option meets this requirement?",
      options: ["SSE-C: supply the key with each request over HTTPS", "SSE-S3", "SSE-KMS with an AWS managed key, imported from your own system", "S3 Object Lock"],
      answer: [0],
      explanation: "With SSE-C, S3 encrypts and decrypts with the key you send, but never stores it. You must send the same key again to read the object.",
    },
    // ── Secrets ──
    {
      id: "d2-33",
      domain: "d2",
      lesson: "d2-secrets",
      prompt: "An application's Amazon RDS database password must rotate automatically every 30 days without code changes to the rotation process. Which service should store the password?",
      options: ["AWS Secrets Manager", "Systems Manager Parameter Store standard parameters", "Lambda environment variables", "An S3 object"],
      answer: [0],
      explanation: "Secrets Manager rotates secrets on a schedule with rotation functions, and it has built-in support for RDS and Aurora. You don't have to build the rotation process yourself.",
    },
    {
      id: "d2-34",
      domain: "d2",
      lesson: "d2-secrets",
      prompt:
        "A team needs to store about 200 configuration values and a few API keys that never rotate, organized by path such as /prod/app/, encrypted, and at the LOWEST cost. Which solution fits?",
      options: ["Systems Manager Parameter Store with SecureString parameters for the keys", "AWS Secrets Manager for every value, organized by path name and encrypted by default", "Hard-coded constants", "A public S3 object"],
      answer: [0],
      explanation: "Parameter Store organizes values by path, so you can fetch a whole branch with GetParametersByPath. SecureString values are encrypted with KMS, and standard parameters have no storage charge.",
    },
    {
      id: "d2-35",
      domain: "d2",
      lesson: "d2-secrets",
      prompt:
        "A Lambda function stores a token in an environment variable. Security requires that it be encrypted with a key the team controls, and that the team can audit use of that key. What should the developer do?",
      options: [
        "Configure the function to encrypt environment variables with a customer managed KMS key",
        "Base64-encode the environment variable so the token isn't readable by anyone in the console",
        "Move the token into the function's code",
        "Make the function's configuration read-only",
      ],
      answer: [0],
      explanation: "Lambda always encrypts environment variables at rest. Choosing a customer managed key gives your team control of the key and an audit trail in CloudTrail. Long term, keeping the token in Secrets Manager is even better.",
    },
    {
      id: "d2-36",
      domain: "d2",
      lesson: "d2-secrets",
      prompt: "A high-traffic Lambda function calls Secrets Manager on every invocation, adding latency and cost. What should the developer do?",
      options: [
        "Cache the secret, for example with the AWS Parameters and Secrets Lambda Extension or in a variable outside the handler with a TTL",
        "Copy the secret into the code",
        "Raise the function's timeout and memory so each Secrets Manager call has more time to finish before the handler runs",
        "Disable rotation",
      ],
      answer: [0],
      explanation: "Caching the secret means fewer API calls and faster invocations. A TTL (time to live) makes sure you still pick up the new value after a rotation.",
    },
    {
      id: "d2-37",
      domain: "d2",
      lesson: "d2-secrets",
      prompt: "Which features are offered by AWS Secrets Manager? (Choose two.)",
      options: [
        "Managed automatic rotation for Amazon RDS credentials",
        "Generating random secret values with GetRandomPassword",
        "Storing standard parameters at no storage charge",
        "Retrieving a whole configuration tree with GetParametersByPath",
        "Storing secrets only in plaintext",
      ],
      answer: [0, 1],
      explanation: "Rotation and random password generation belong to Secrets Manager. Free standard parameters and GetParametersByPath are Parameter Store features.",
    },
    // ── Sensitive data ──
    {
      id: "d2-38",
      domain: "d2",
      lesson: "d2-data",
      prompt: "An application stores patients' names together with their diagnoses and prescriptions. How should this data be classified?",
      options: ["Protected health information (PHI)", "Public data, since names appear elsewhere", "Anonymous telemetry", "Configuration data"],
      answer: [0],
      explanation: "Health information tied to a person you can identify is PHI. It comes with strict rules for handling, encryption, and access.",
    },
    {
      id: "d2-39",
      domain: "d2",
      lesson: "d2-data",
      prompt: "Application logs in CloudWatch Logs sometimes contain customers' card numbers. Which actions prevent this sensitive data from being exposed in logs? (Choose two.)",
      options: [
        "Enable a CloudWatch Logs data protection policy that detects and masks card numbers",
        "Remove or mask sensitive fields in the application before writing log entries",
        "Extend the log retention period",
        "Export the logs to Amazon S3",
        "Enable debug-level logging in production",
      ],
      answer: [0, 1],
      explanation: "Clean the data in your code first, and add a data protection policy as a safety net. A longer retention period or an export doesn't remove anything.",
    },
    {
      id: "d2-40",
      domain: "d2",
      lesson: "d2-data",
      prompt: "A web app displays comments that users submit. How should the developer prevent users from injecting scripts into other users' pages?",
      options: [
        "Validate and sanitize input on the server and encode output before rendering it",
        "Validate input only with client-side JavaScript before the form is sent to the server",
        "Store comments in a different Region",
        "Encrypt the comments with KMS",
      ],
      answer: [0],
      explanation: "Client-side checks are easy to skip, because the attacker controls the browser. Validating on the server and encoding output stops cross-site scripting. AWS WAF can add another layer at the edge.",
    },
    {
      id: "d2-41",
      domain: "d2",
      lesson: "d2-data",
      prompt:
        "A SaaS application stores all tenants' data in one DynamoDB table with partition keys that begin with the tenant ID. The company wants IAM, not just application code, to stop one tenant's requests from reaching another tenant's items. What should the developer do?",
      options: [
        "Use role sessions tagged with the tenant ID and a dynamodb:LeadingKeys condition that matches the tag",
        "Use a scan with a filter on tenant ID",
        "Give every tenant the same role with full table access, and filter items by tenant ID in the application code",
        "Encrypt each tenant's items with SSE-S3",
      ],
      answer: [0],
      explanation: "Credentials scoped to one tenant, using session tags and the LeadingKeys condition, keep tenants apart in a shared table. Even if your code has a bug, IAM still blocks the request.",
    },
    {
      id: "d2-42",
      domain: "d2",
      lesson: "d2-data",
      type: "match",
      prompt: "Match each data protection technique to its description.",
      pairs: [
        ["Masking", "Shows only part of a value, such as ****1234"],
        ["Tokenization", "Replaces the value with a stand-in, while the real value sits in a secure vault"],
        ["Encryption", "Transforms the value so only holders of the key can reverse it"],
        ["Hashing", "Creates a one-way fingerprint that can't be reversed"],
      ],
      explanation: "Pick by what you need: show part of it (masking), refer to it without exposing it (tokenization), protect it and get it back later (encryption), or only compare it (hashing).",
    },
  ],

  cards: [
    { id: "s-iam", domain: "d2", kind: "service", term: "AWS IAM", definition: "Users, roles, and policies that decide who can do what" },
    { id: "s-sts", domain: "d2", kind: "service", term: "AWS STS", definition: "Hands out temporary credentials, for example through AssumeRole" },
    { id: "s-cognito-up", domain: "d2", kind: "service", term: "Cognito user pool", definition: "A user directory for sign-up and sign-in. It issues JWTs." },
    { id: "s-cognito-ip", domain: "d2", kind: "service", term: "Cognito identity pool", definition: "Swaps sign-in tokens for temporary AWS credentials" },
    { id: "s-kms", domain: "d2", kind: "service", term: "AWS KMS", definition: "Creates and controls encryption keys, including for envelope encryption" },
    { id: "s-secrets", domain: "d2", kind: "service", term: "AWS Secrets Manager", definition: "Stores secrets and rotates them automatically" },
    { id: "s-paramstore", domain: "d2", kind: "service", term: "Systems Manager Parameter Store", definition: "Config values organized by path. SecureString values are encrypted with KMS." },
    { id: "s-privateca", domain: "d2", kind: "service", term: "AWS Private CA", definition: "Issues private TLS certificates for internal services" },
    { id: "s-waf", domain: "d2", kind: "service", term: "AWS WAF", definition: "Web application firewall for API Gateway, CloudFront, and ALB" },
    { id: "c-explicitdeny", domain: "d2", kind: "concept", term: "Explicit deny", definition: "A Deny statement beats every Allow" },
    { id: "c-implicitdeny", domain: "d2", kind: "concept", term: "Implicit deny", definition: "What you get when no policy allows the action: denied" },
    { id: "c-trustpolicy", domain: "d2", kind: "concept", term: "Trust policy", definition: "Says which principals may assume a role" },
    { id: "c-envelope", domain: "d2", kind: "concept", term: "Envelope encryption", definition: "Encrypt data with a data key, then have KMS encrypt the data key" },
    { id: "c-lambdaauth", domain: "d2", kind: "concept", term: "Lambda authorizer", definition: "Your own code that checks a token or request and returns an IAM policy" },
    { id: "c-jwt", domain: "d2", kind: "concept", term: "Bearer token (JWT)", definition: "A signed token. Whoever holds it is trusted, so check its signature, expiry, issuer, and audience." },
    { id: "c-ssekms", domain: "d2", kind: "concept", term: "SSE-KMS", definition: "S3 encrypts with a KMS key you control and can audit" },
    { id: "c-ssec", domain: "d2", kind: "concept", term: "SSE-C", definition: "S3 encrypts with a key you send on every request" },
    { id: "c-leadingkeys", domain: "d2", kind: "concept", term: "dynamodb:LeadingKeys", definition: "An IAM condition that limits access to items by their partition key" },
    { id: "c-phi", domain: "d2", kind: "concept", term: "PHI", definition: "Health information linked to an identifiable person" },
  ],

  challenges: [
    {
      id: "ch-least-privilege",
      domain: "d2",
      lesson: "d2-iam",
      title: "Least privilege, HTTPS only",
      goal: "Allow GetObject and PutObject over HTTPS, and deny DeleteObject and any plain-HTTP request. Don't use the s3:* statement.",
      hint: "Grant just the two actions you need, and let the bucket policy handle HTTP.",
      takeaway: "Name only the actions you need. Anything you don't allow is denied by default, and a Deny with a condition closes the HTTP gap for every caller.",
      render: (onSolved) => <IamPolicyLab goal="leastPrivilege" onSolved={onSolved} />,
    },
    {
      id: "ch-deny-wins",
      domain: "d2",
      lesson: "d2-iam",
      title: "Explicit deny wins",
      goal: "Keep the broad s3:* Allow attached, but make DeleteObject denied while Get and Put still work.",
      hint: "An Allow can't be outvoted by another Allow.",
      takeaway: "An explicit Deny beats any Allow, however broad. Use it as a guardrail when a wide grant has to stay in place.",
      render: (onSolved) => <IamPolicyLab goal="denyWins" onSolved={onSolved} />,
    },
  ],
});
