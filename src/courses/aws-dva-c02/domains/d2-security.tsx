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
    summary: "IAM policies and roles, STS, Cognito and tokens, KMS encryption, secrets, and handling sensitive data.",
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
      id: "d2-iam",
      task: "2.1",
      title: "How IAM decides: explicit deny wins",
      check: ["d2-01", "d2-04"],
      visual: (
        <div className="grid gap-6">
          <Flow
            color="#f87171"
            steps={[
              { icon: "📥", label: "Request", sub: "Principal, action, resource, conditions" },
              { icon: "⛔", label: "Any explicit Deny?", sub: "Yes → denied, no matter what allows it" },
              { icon: "✅", label: "Any Allow?", sub: "Identity or resource policy grants it" },
              { icon: "🚫", label: "Otherwise", sub: "Implicit deny (the default)" },
            ]}
          />
          <IamPolicyLab />
        </div>
      ),
      points: [
        "Identity-based policies attach to users, groups, and roles. Resource-based policies attach to resources such as S3 buckets, SQS queues, KMS keys, and Lambda functions, and name a Principal.",
        "Grant least privilege: specific actions on specific resource ARNs, narrowed with conditions such as aws:SecureTransport.",
        "Another service invoking your Lambda function (S3, SNS, API Gateway) needs permission in the function's resource-based policy.",
        "\"Encoded authorization failure message\" errors can be read with aws sts decode-authorization-message.",
      ],
      tip: "A Deny statement anywhere beats every Allow. If nothing mentions the action, the answer is still \"denied\".",
    },
    {
      id: "d2-sts",
      task: "2.1",
      title: "Roles, STS, and programmatic access",
      check: ["d2-09", "d2-10"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "🧑‍💻", label: "Principal in account A", sub: "Has sts:AssumeRole permission" },
              { icon: "🎫", label: "sts:AssumeRole", sub: "Role's trust policy must allow A" },
              { icon: "⏳", label: "Temporary credentials", sub: "Access key, secret key, session token, expiry" },
              { icon: "🗄️", label: "Call resources in account B", sub: "With the role's permissions" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🖥️", title: "EC2", text: "Instance profile → role credentials from instance metadata.", color: "#a78bfa" },
              { icon: "λ", title: "Lambda", text: "Execution role, assumed for every invocation.", color: "#a78bfa" },
              { icon: "📦", title: "ECS", text: "Task role per task definition, separate from the instance role.", color: "#a78bfa" },
              { icon: "💻", title: "Your laptop", text: "Named CLI profiles or IAM Identity Center (aws configure sso).", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Roles give temporary, automatically rotated credentials. Never put long-lived access keys in code or images.",
        "The SDK credential provider chain checks explicit settings and environment variables before shared config files and, last, container or instance metadata credentials.",
        "A role has two policies: the trust policy (who may assume it) and permission policies (what it may do).",
        "Service-to-service calls can use IAM (SigV4) authorization: grant the caller's role execute-api:Invoke on the API.",
      ],
      tip: "\"Access a resource in another account\" → a role in that account whose trust policy allows yours, then AssumeRole.",
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
              { icon: "👥", title: "User pool", text: "User directory: sign-up, sign-in, MFA, social and SAML/OIDC federation. Issues JWTs.", color: "#38bdf8" },
              { icon: "🪪", title: "Identity pool", text: "Exchanges a token (or guest access) for temporary AWS credentials through STS.", color: "#38bdf8" },
            ]}
          />
          <Flow
            color="#38bdf8"
            steps={[
              { icon: "📱", label: "User signs in", sub: "Cognito user pool" },
              { icon: "🎟️", label: "ID + access + refresh tokens", sub: "JWTs signed by the pool" },
              { icon: "🚪", label: "API Gateway authorizer", sub: "Validates the bearer token" },
              { icon: "λ", label: "Backend", sub: "Reads claims such as cognito:groups" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🔐", title: "Cognito authorizer", text: "Validates user pool tokens with no code.", color: "#34d399" },
              { icon: "🧠", title: "Lambda authorizer", text: "Your code checks any token or request data and returns an IAM policy. Results can be cached.", color: "#34d399" },
              { icon: "✍️", title: "IAM authorization", text: "Callers sign requests with SigV4 using AWS credentials.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "Bearer tokens: whoever holds the token is trusted, so verify the signature and the exp, iss, and audience/client claims, and only send tokens over HTTPS.",
        "ID tokens carry identity claims; access tokens authorize API calls (scopes); refresh tokens get new tokens without signing in again.",
        "Fine-grained access: an identity pool role can limit DynamoDB items with the dynamodb:LeadingKeys condition set to the user's identity ID.",
      ],
      tip: "\"Sign-up and sign-in\" → user pool. \"Temporary AWS credentials for app users\" → identity pool.",
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
              { icon: "🔑", label: "GenerateDataKey", sub: "KMS returns a plaintext key + the same key encrypted" },
              { icon: "🔒", label: "Encrypt locally", sub: "Use the plaintext data key on the data" },
              { icon: "🗑️", label: "Discard plaintext key", sub: "Store the encrypted key next to the ciphertext" },
              { icon: "🔓", label: "To read: Decrypt", sub: "KMS decrypts the data key; decrypt locally" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🪣", title: "SSE-S3", text: "S3-managed keys. The default for new objects.", color: "#f87171" },
              { icon: "🗝️", title: "SSE-KMS", text: "KMS keys you can control and audit in CloudTrail. Use S3 Bucket Keys to cut KMS requests.", color: "#f87171" },
              { icon: "🧳", title: "SSE-C", text: "You send your own key with every request (HTTPS only). S3 doesn't store it.", color: "#f87171" },
              { icon: "💻", title: "Client-side", text: "Encrypt before upload (AWS Encryption SDK). AWS never sees plaintext.", color: "#f87171" },
            ]}
          />
        </div>
      ),
      points: [
        "The KMS Encrypt API takes at most 4 KB of plaintext. Anything larger uses envelope encryption with a data key.",
        "Cross-account use needs both: the key policy in the owning account allows the other account, and an IAM policy in the other account grants the KMS actions.",
        "Automatic rotation for customer managed keys keeps old key material, so existing ciphertext still decrypts. AWS managed keys rotate yearly on their own.",
        "In transit: TLS everywhere. ACM issues and renews public certificates; AWS Private CA issues private certificates for internal services.",
      ],
      tip: "Large file + KMS → GenerateDataKey. \"KMS ThrottlingException from S3\" → enable S3 Bucket Keys.",
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
              { icon: "🗝️", title: "AWS Secrets Manager", text: "Database passwords and API keys. Automatic rotation with a Lambda rotation function, native for RDS and Aurora. Charged per secret.", color: "#34d399" },
              { icon: "📒", title: "Systems Manager Parameter Store", text: "Config and secrets in a path hierarchy. SecureString encrypts with KMS. Standard parameters have no storage charge. No built-in rotation.", color: "#34d399" },
            ]}
          />
          <Flow
            color="#34d399"
            steps={[
              { icon: "λ", label: "Function starts", sub: "Fetch secret at init" },
              { icon: "🧠", label: "Cache it", sub: "In memory or the Parameters and Secrets extension" },
              { icon: "🔁", label: "Refresh on TTL", sub: "Pick up rotated values" },
            ]}
          />
        </div>
      ),
      points: [
        "Lambda encrypts environment variables at rest with KMS; use a customer managed key when you must control the key. Better still, keep secrets out of environment variables entirely.",
        "Retrieve secrets at runtime with the SDK and cache them to cut latency and API cost.",
        "CodeBuild and ECS task definitions can reference Secrets Manager and Parameter Store values directly.",
      ],
      tip: "\"Rotate automatically\" → Secrets Manager. \"Cheap hierarchical config\" → Parameter Store.",
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
              { icon: "🪪", title: "PII", text: "Identifies a person: name, email, government ID, card number.", color: "#a78bfa" },
              { icon: "🩺", title: "PHI", text: "Health information linked to a person. Strict handling rules.", color: "#a78bfa" },
              { icon: "🎭", title: "Mask / tokenize", text: "Show ****1234, or swap the value for a token stored safely elsewhere.", color: "#a78bfa" },
              { icon: "🧼", title: "Sanitize", text: "Validate input, encode output, and keep secrets and PII out of logs.", color: "#a78bfa" },
            ]}
          />
          <Flow
            color="#38bdf8"
            steps={[
              { icon: "🏢", label: "Tenant signs in", sub: "Token carries tenantId" },
              { icon: "🎫", label: "Role session tagged", sub: "aws:PrincipalTag/tenantId" },
              { icon: "🗄️", label: "Pooled DynamoDB table", sub: "Partition key starts with tenantId" },
              { icon: "🔒", label: "dynamodb:LeadingKeys", sub: "Only that tenant's items" },
            ]}
          />
        </div>
      ),
      points: [
        "Classify data first; the classification decides encryption, access, retention, and logging rules.",
        "CloudWatch Logs data protection policies can detect and mask sensitive data such as card numbers in log events.",
        "Multi-tenant: silo (resources per tenant) or pool (shared resources with tenant-scoped access enforced by IAM conditions and application checks).",
      ],
    },
  ],

  questions: [
    // ── IAM ──
    {
      id: "d2-01",
      domain: "d2",
      lesson: "d2-iam",
      prompt:
        "An IAM role has two policies attached. One allows s3:* on a bucket. The other denies s3:DeleteObject on the same bucket. What happens when the role calls DeleteObject on that bucket?",
      options: [
        "The request is denied, because an explicit deny overrides any allow",
        "The request is allowed, because s3:* is broader",
        "The result depends on which policy was attached first",
        "The request is allowed only if MFA is used",
      ],
      answer: [0],
      explanation: "IAM evaluates every applicable policy. Any matching explicit Deny wins over all Allow statements.",
    },
    {
      id: "d2-02",
      domain: "d2",
      lesson: "d2-iam",
      prompt: "A Lambda function's execution role has policies for S3 and SQS, but none mention DynamoDB. The function calls dynamodb:PutItem. What is the result?",
      options: ["Access denied, because requests are implicitly denied unless something allows them", "Allowed, because Lambda has default DynamoDB access", "Allowed, because nothing denies it", "Allowed in the same Region only"],
      answer: [0],
      explanation: "IAM is deny by default. Without a matching Allow, the request fails with an implicit deny.",
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
        "Allow dynamodb:GetItem on all tables in the account",
      ],
      answer: [0],
      explanation: "Least privilege means only the actions needed, on only the resources needed.",
    },
    {
      id: "d2-04",
      domain: "d2",
      lesson: "d2-iam",
      prompt: "A security rule says objects in an S3 bucket may only be accessed over HTTPS. How can a developer enforce this for every caller?",
      options: [
        "Add a bucket policy statement that denies all S3 actions when aws:SecureTransport is false",
        "Enable S3 Versioning",
        "Enable default encryption with SSE-S3",
        "Turn on S3 Transfer Acceleration",
      ],
      answer: [0],
      explanation: "A Deny with the aws:SecureTransport condition in the resource-based bucket policy applies to every principal, and an explicit deny can't be overridden.",
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
      explanation: "Resource-based policies attach to a resource and name the principals allowed. Group policies are identity-based, and security groups are network controls, not IAM policies.",
    },
    {
      id: "d2-06",
      domain: "d2",
      lesson: "d2-iam",
      prompt:
        "A developer configures an S3 event notification to invoke a Lambda function, but the configuration fails with an error saying S3 can't invoke the function. What should the developer add?",
      options: [
        "A statement in the function's resource-based policy allowing s3.amazonaws.com to call lambda:InvokeFunction, scoped to the bucket ARN",
        "s3:GetObject permission in the function's execution role",
        "A NAT gateway for the function",
        "Provisioned concurrency for the function",
      ],
      answer: [0],
      explanation: "Services that push events to Lambda need permission in the function policy. The execution role controls what the function can call, not who can invoke it.",
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
      explanation: "Explicit deny is checked first and always wins; deny is also the default when nothing allows the action.",
    },
    {
      id: "d2-08",
      domain: "d2",
      lesson: "d2-iam",
      prompt: "An API call fails with UnauthorizedOperation and an encoded authorization failure message. How can the developer see which policy caused the denial?",
      options: ["Run aws sts decode-authorization-message with the encoded message", "Base64-decode it in a browser", "Open a support case; it can't be decoded", "Check the AWS Health Dashboard"],
      answer: [0],
      explanation: "STS DecodeAuthorizationMessage (which itself needs sts:DecodeAuthorizationMessage permission) reveals the request context and why it was denied.",
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
      explanation: "With an instance profile, the SDK gets temporary role credentials from instance metadata, and they rotate automatically.",
    },
    {
      id: "d2-10",
      domain: "d2",
      lesson: "d2-sts",
      prompt: "A Lambda function in account A must write items to a DynamoDB table in account B. Which approach should the developer use?",
      options: [
        "Create a role in account B whose trust policy allows the function's role in account A; the function calls sts:AssumeRole and uses the returned credentials",
        "Copy an IAM user's access keys from account B into the function's environment variables",
        "Make the DynamoDB table public",
        "Add account A's root user to an IAM group in account B",
      ],
      answer: [0],
      explanation: "Cross-account access uses a role in the resource account. The trust policy names who can assume it, and the caller needs sts:AssumeRole permission for that role.",
    },
    {
      id: "d2-11",
      domain: "d2",
      lesson: "d2-sts",
      prompt: "What does a successful sts:AssumeRole call return?",
      options: [
        "Temporary credentials: an access key ID, a secret access key, a session token, and an expiration time",
        "A new permanent IAM user",
        "A password for the AWS Management Console",
        "An X.509 certificate",
      ],
      answer: [0],
      explanation: "STS returns short-term credentials. The session token must be sent with every request signed with them.",
    },
    {
      id: "d2-12",
      domain: "d2",
      lesson: "d2-sts",
      prompt: "A developer runs AWS CLI commands against dev and prod accounts from a laptop and wants to switch between them easily. What should the developer configure?",
      options: ["Named profiles in the AWS CLI config and credentials files, selected with --profile or AWS_PROFILE", "One set of root user keys for both accounts", "A second laptop", "Environment variables hard-coded in shell scripts committed to Git"],
      answer: [0],
      explanation: "Named profiles keep separate settings and credentials, including role or IAM Identity Center (SSO) profiles, and the CLI and SDKs select them by name.",
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
        "The SDK always prefers IAM users over roles",
        "Instance metadata is disabled for every instance by default",
      ],
      answer: [0],
      explanation: "Environment variables come earlier in the chain than instance metadata. Remove the stale variables so the SDK falls through to the role.",
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
      explanation: "Task roles give each task its own credentials, separate from the instance role, so every service can be scoped to least privilege.",
    },
    {
      id: "d2-15",
      domain: "d2",
      lesson: "d2-sts",
      prompt:
        "Service A, running on Lambda, calls service B's REST API in Amazon API Gateway. Service B must accept calls only from service A, without managing shared passwords. What should the developer do?",
      options: [
        "Enable IAM authorization on service B's methods and allow execute-api:Invoke in service A's execution role; A signs requests with SigV4",
        "Embed a shared static password in both services' code",
        "Allow only service A's public IP address",
        "Make service B's API public and log every call",
      ],
      answer: [0],
      explanation: "IAM authorization uses each service's role credentials, so there is no shared secret to store or rotate.",
    },
    // ── Cognito and tokens ──
    {
      id: "d2-16",
      domain: "d2",
      lesson: "d2-cognito",
      prompt: "A mobile app needs user sign-up, sign-in, MFA, and the option to sign in with Google. Which solution requires the LEAST custom code?",
      options: ["An Amazon Cognito user pool with Google configured as a federated identity provider", "IAM users for every app user", "A DynamoDB table of usernames and password hashes", "AWS STS GetSessionToken"],
      answer: [0],
      explanation: "User pools are a managed user directory with sign-up, sign-in, MFA, and social or enterprise federation, and they issue JWTs.",
    },
    {
      id: "d2-17",
      domain: "d2",
      lesson: "d2-cognito",
      prompt: "Signed-in users of a mobile app must upload photos directly to an S3 bucket from the device using temporary AWS credentials. What should the developer use?",
      options: ["An Amazon Cognito identity pool", "A Cognito user pool alone", "One IAM user shared by all devices", "An S3 bucket policy that allows public writes"],
      answer: [0],
      explanation: "Identity pools exchange a sign-in token for temporary, role-scoped AWS credentials. User pools authenticate users but don't hand out AWS credentials.",
    },
    {
      id: "d2-18",
      domain: "d2",
      lesson: "d2-cognito",
      prompt: "An Amazon API Gateway REST API must accept only requests that carry a valid token from the company's Amazon Cognito user pool. Which solution requires the LEAST code?",
      options: ["A Cognito user pool authorizer on the API methods", "A Lambda authorizer that calls an external service", "API keys with a usage plan", "A resource policy that allows all principals"],
      answer: [0],
      explanation: "The Cognito authorizer validates the user pool JWT for you. API keys identify and meter clients; they aren't authentication.",
    },
    {
      id: "d2-19",
      domain: "d2",
      lesson: "d2-cognito",
      prompt:
        "An API must accept bearer tokens issued by a third-party OAuth provider and apply custom authorization rules based on the token's claims. Which API Gateway feature fits?",
      options: ["A Lambda authorizer that validates the token and returns an IAM policy", "A Cognito user pool authorizer", "Mutual TLS only", "Stage variables"],
      answer: [0],
      explanation: "Lambda authorizers run your own validation and authorization logic for any token or request data, and API Gateway can cache their results.",
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
      explanation: "ID and access tokens are short-lived JWTs. The refresh token lasts longer and is exchanged for new ones.",
    },
    {
      id: "d2-21",
      domain: "d2",
      lesson: "d2-cognito",
      prompt:
        "App users get AWS credentials through a Cognito identity pool and write directly to a DynamoDB table. Each user must be able to read and write only items whose partition key equals their own identity ID. How should the developer enforce this?",
      options: [
        "Add a dynamodb:LeadingKeys condition with ${cognito-identity.amazonaws.com:sub} to the authenticated role's policy",
        "Filter results in the mobile app",
        "Create one table per user",
        "Use a scan with a filter expression",
      ],
      answer: [0],
      explanation: "The LeadingKeys condition restricts access to items whose partition key matches the policy variable, so the rule is enforced by IAM, not by client code.",
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
      explanation: "Anyone holding a bearer token can use it, so it must be cryptographically verified and its claims checked. Tokens in URLs leak into logs and browser history.",
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
        "Hide the delete button in the user interface",
      ],
      answer: [0],
      explanation: "Group membership appears as a claim in the token. The backend or a Lambda authorizer can check it for fine-grained authorization. Hiding a button isn't access control.",
    },
    // ── KMS and encryption ──
    {
      id: "d2-24",
      domain: "d2",
      lesson: "d2-kms",
      prompt: "An application must encrypt 2 MB files with a key managed in AWS KMS. Which approach should the developer use?",
      options: [
        "Call GenerateDataKey, encrypt the file locally with the plaintext data key, and store the encrypted data key with the file",
        "Call the KMS Encrypt API on the whole file",
        "Split the file into 4 KB chunks and call Encrypt on each one",
        "Download the KMS key material and use it locally",
      ],
      answer: [0],
      explanation: "KMS Encrypt accepts at most 4 KB of plaintext. Envelope encryption encrypts the data with a data key, and KMS protects only the data key. KMS key material never leaves KMS.",
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
      explanation: "Only the small data key goes to KMS. The bulk data is encrypted and decrypted locally.",
    },
    {
      id: "d2-26",
      domain: "d2",
      lesson: "d2-kms",
      prompt: "A compliance rule says data must be encrypted before it leaves the application, so AWS never receives plaintext. Which approach meets the rule?",
      options: ["Client-side encryption, for example with the AWS Encryption SDK, before uploading to S3", "SSE-S3", "SSE-KMS", "Enabling HTTPS only"],
      answer: [0],
      explanation: "With server-side encryption S3 receives plaintext (over TLS) and encrypts it at rest. Client-side encryption encrypts it first.",
    },
    {
      id: "d2-27",
      domain: "d2",
      lesson: "d2-kms",
      prompt:
        "An application writes thousands of objects per second to a bucket that uses SSE-KMS, and requests start failing with KMS ThrottlingException errors. Which change reduces calls to KMS?",
      options: ["Enable S3 Bucket Keys for the bucket", "Switch to SSE-C", "Enable S3 Versioning", "Use a larger object size limit"],
      answer: [0],
      explanation: "S3 Bucket Keys use a bucket-level key derived from the KMS key, which greatly reduces the number of requests S3 makes to KMS.",
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
      explanation: "Cross-account KMS access needs permission on both sides: the key policy trusts the other account, and that account's IAM policy delegates the actions to its principal.",
    },
    {
      id: "d2-29",
      domain: "d2",
      lesson: "d2-kms",
      prompt: "A team enables automatic key rotation on a customer managed KMS key. What happens to data that was encrypted before the rotation?",
      options: [
        "It can still be decrypted, because KMS keeps the previous key material and uses it automatically",
        "It must be re-encrypted before it can be read",
        "It becomes unreadable",
        "It is deleted after 30 days",
      ],
      answer: [0],
      explanation: "Rotation adds new key material for new encryptions while keeping older material for decryption. The key ID and ARN stay the same.",
    },
    {
      id: "d2-30",
      domain: "d2",
      lesson: "d2-kms",
      prompt: "A team wants S3 objects encrypted at rest with no key management, no extra cost, and no code changes. Which option meets these requirements?",
      options: ["SSE-S3 (Amazon S3 managed keys)", "SSE-KMS with a customer managed key", "SSE-C", "Client-side encryption"],
      answer: [0],
      explanation: "SSE-S3 is applied by default to new objects and needs no key management. SSE-KMS adds key control and auditing, with KMS request charges.",
    },
    {
      id: "d2-31",
      domain: "d2",
      lesson: "d2-kms",
      prompt: "Internal microservices must use TLS certificates that are trusted only inside the company and don't need to be publicly trusted. Which service issues them?",
      options: ["AWS Private Certificate Authority", "Public certificates from AWS Certificate Manager", "AWS Secrets Manager", "AWS WAF"],
      answer: [0],
      explanation: "AWS Private CA runs a private certificate authority for internal certificates. ACM public certificates are for publicly trusted endpoints.",
    },
    {
      id: "d2-32",
      domain: "d2",
      lesson: "d2-kms",
      prompt: "A company must keep its own encryption keys outside AWS but wants Amazon S3 to perform the encryption. Which option meets this requirement?",
      options: ["SSE-C: supply the key with each request over HTTPS", "SSE-S3", "SSE-KMS with an AWS managed key", "S3 Object Lock"],
      answer: [0],
      explanation: "With SSE-C, S3 encrypts and decrypts with the key you send but doesn't store it. You must supply the same key to read the object.",
    },
    // ── Secrets ──
    {
      id: "d2-33",
      domain: "d2",
      lesson: "d2-secrets",
      prompt: "An application's Amazon RDS database password must rotate automatically every 30 days without code changes to the rotation process. Which service should store the password?",
      options: ["AWS Secrets Manager", "Systems Manager Parameter Store standard parameters", "Lambda environment variables", "An S3 object"],
      answer: [0],
      explanation: "Secrets Manager rotates secrets on a schedule using rotation functions, with managed support for RDS and Aurora.",
    },
    {
      id: "d2-34",
      domain: "d2",
      lesson: "d2-secrets",
      prompt:
        "A team needs to store about 200 configuration values and a few API keys that never rotate, organized by path such as /prod/app/, encrypted, and at the LOWEST cost. Which solution fits?",
      options: ["Systems Manager Parameter Store with SecureString parameters for the keys", "AWS Secrets Manager for every value", "Hard-coded constants", "A public S3 object"],
      answer: [0],
      explanation: "Parameter Store supports hierarchies (GetParametersByPath) and KMS-encrypted SecureString values, and standard parameters have no storage charge.",
    },
    {
      id: "d2-35",
      domain: "d2",
      lesson: "d2-secrets",
      prompt:
        "A Lambda function stores a token in an environment variable. Security requires that it be encrypted with a key the team controls, and that the team can audit use of that key. What should the developer do?",
      options: [
        "Configure the function to encrypt environment variables with a customer managed KMS key",
        "Base64-encode the environment variable",
        "Move the token into the function's code",
        "Make the function's configuration read-only",
      ],
      answer: [0],
      explanation: "Lambda always encrypts environment variables at rest; choosing a customer managed key gives you control and CloudTrail auditing. Keeping the token in Secrets Manager is the stronger long-term option.",
    },
    {
      id: "d2-36",
      domain: "d2",
      lesson: "d2-secrets",
      prompt: "A high-traffic Lambda function calls Secrets Manager on every invocation, adding latency and cost. What should the developer do?",
      options: [
        "Cache the secret, for example with the AWS Parameters and Secrets Lambda Extension or in a variable outside the handler with a TTL",
        "Copy the secret into the code",
        "Raise the function's timeout",
        "Disable rotation",
      ],
      answer: [0],
      explanation: "Caching cuts API calls and latency; a TTL makes sure rotated values are picked up.",
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
      explanation: "Rotation and random password generation are Secrets Manager features. Free standard parameters and GetParametersByPath belong to Parameter Store.",
    },
    // ── Sensitive data ──
    {
      id: "d2-38",
      domain: "d2",
      lesson: "d2-data",
      prompt: "An application stores patients' names together with their diagnoses and prescriptions. How should this data be classified?",
      options: ["Protected health information (PHI)", "Public data", "Anonymous telemetry", "Configuration data"],
      answer: [0],
      explanation: "Health information linked to an identifiable person is PHI, which carries strict handling, encryption, and access requirements.",
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
      explanation: "Sanitize in code first, and use data protection policies as a safety net. Retention and exports don't remove the data.",
    },
    {
      id: "d2-40",
      domain: "d2",
      lesson: "d2-data",
      prompt: "A web app displays comments that users submit. How should the developer prevent users from injecting scripts into other users' pages?",
      options: [
        "Validate and sanitize input on the server and encode output before rendering it",
        "Validate input only with client-side JavaScript",
        "Store comments in a different Region",
        "Encrypt the comments with KMS",
      ],
      answer: [0],
      explanation: "Client-side checks are easy to bypass. Server-side validation plus output encoding stops cross-site scripting; AWS WAF can add another layer at the edge.",
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
        "Give every tenant the same role with full table access",
        "Encrypt each tenant's items with SSE-S3",
      ],
      answer: [0],
      explanation: "Scoping credentials to a tenant (for example with session tags and the LeadingKeys condition) enforces isolation in the pooled model even if application code has a bug.",
    },
    {
      id: "d2-42",
      domain: "d2",
      lesson: "d2-data",
      type: "match",
      prompt: "Match each data protection technique to its description.",
      pairs: [
        ["Masking", "Shows only part of a value, such as ****1234"],
        ["Tokenization", "Replaces the value with a surrogate stored in a secure vault"],
        ["Encryption", "Transforms the value so only holders of the key can reverse it"],
        ["Hashing", "Creates a one-way fingerprint that can't be reversed"],
      ],
      explanation: "Choose by need: display (masking), reference without exposure (tokenization), reversible protection (encryption), or comparison only (hashing).",
    },
  ],

  cards: [
    { id: "s-iam", domain: "d2", kind: "service", term: "AWS IAM", definition: "Users, roles, and policies that control who can do what" },
    { id: "s-sts", domain: "d2", kind: "service", term: "AWS STS", definition: "Issues temporary credentials, for example with AssumeRole" },
    { id: "s-cognito-up", domain: "d2", kind: "service", term: "Cognito user pool", definition: "User directory for sign-up and sign-in that issues JWTs" },
    { id: "s-cognito-ip", domain: "d2", kind: "service", term: "Cognito identity pool", definition: "Trades sign-in tokens for temporary AWS credentials" },
    { id: "s-kms", domain: "d2", kind: "service", term: "AWS KMS", definition: "Create and control encryption keys; envelope encryption" },
    { id: "s-secrets", domain: "d2", kind: "service", term: "AWS Secrets Manager", definition: "Store secrets with automatic rotation" },
    { id: "s-paramstore", domain: "d2", kind: "service", term: "Systems Manager Parameter Store", definition: "Hierarchical config values; SecureString encrypted with KMS" },
    { id: "s-privateca", domain: "d2", kind: "service", term: "AWS Private CA", definition: "Issue private TLS certificates for internal services" },
    { id: "s-waf", domain: "d2", kind: "service", term: "AWS WAF", definition: "Web application firewall for API Gateway, CloudFront, and ALB" },
    { id: "c-explicitdeny", domain: "d2", kind: "concept", term: "Explicit deny", definition: "A Deny statement overrides every Allow" },
    { id: "c-implicitdeny", domain: "d2", kind: "concept", term: "Implicit deny", definition: "Default result when no policy allows the action" },
    { id: "c-trustpolicy", domain: "d2", kind: "concept", term: "Trust policy", definition: "Defines which principals may assume a role" },
    { id: "c-envelope", domain: "d2", kind: "concept", term: "Envelope encryption", definition: "Encrypt data with a data key; KMS encrypts the data key" },
    { id: "c-lambdaauth", domain: "d2", kind: "concept", term: "Lambda authorizer", definition: "Custom code that checks a token or request and returns an IAM policy" },
    { id: "c-jwt", domain: "d2", kind: "concept", term: "Bearer token (JWT)", definition: "Signed token; verify signature, expiry, issuer, audience" },
    { id: "c-ssekms", domain: "d2", kind: "concept", term: "SSE-KMS", definition: "S3 encrypts with a KMS key you control and can audit" },
    { id: "c-ssec", domain: "d2", kind: "concept", term: "SSE-C", definition: "S3 encrypts with a key you send on each request" },
    { id: "c-leadingkeys", domain: "d2", kind: "concept", term: "dynamodb:LeadingKeys", definition: "IAM condition limiting access to items by partition key" },
    { id: "c-phi", domain: "d2", kind: "concept", term: "PHI", definition: "Health information linked to an identifiable person" },
  ],

  challenges: [
    {
      id: "ch-least-privilege",
      domain: "d2",
      lesson: "d2-iam",
      title: "Least privilege, HTTPS only",
      goal: "Allow GetObject and PutObject over HTTPS, deny DeleteObject and any plain-HTTP request, without using the s3:* statement.",
      hint: "Grant just the two actions you need, and let the bucket policy handle HTTP.",
      takeaway: "Name only the actions you need. Anything you don't allow is implicitly denied; a condition-based Deny closes the HTTP gap for every caller.",
      render: (onSolved) => <IamPolicyLab goal="leastPrivilege" onSolved={onSolved} />,
    },
    {
      id: "ch-deny-wins",
      domain: "d2",
      lesson: "d2-iam",
      title: "Explicit deny wins",
      goal: "Keep the broad s3:* Allow attached, but make DeleteObject denied while Get and Put still work.",
      hint: "An Allow can't be outvoted by another Allow.",
      takeaway: "An explicit Deny overrides any Allow, however broad. It's the guardrail to use when a wide grant must stay in place.",
      render: (onSolved) => <IamPolicyLab goal="denyWins" onSolved={onSolved} />,
    },
  ],
});
