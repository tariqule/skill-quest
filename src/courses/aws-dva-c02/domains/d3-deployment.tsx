import { Flow, Layers, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { DeployStrategies } from "../visuals";

/**
 * Domain 3: Deployment (24%).
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Deployment",
    world: "The Pipeline Docks",
    weight: 24,
    emoji: "🚀",
    color: "#34d399",
    summary: "Packaging artifacts, CloudFormation, SAM, and CDK, testing environments, Lambda versions and aliases, deployment strategies, and CI/CD.",
  },

  tasks: [
    {
      id: "3.1",
      title: "Prepare application artifacts to be deployed to AWS",
      covers: [
        "Manage dependencies in the package: environment variables, configuration files, container images",
        "Organize files and directory structure for deployment",
        "Use code repositories in deployment environments",
        "Apply resource requirements such as memory and cores",
        "Prepare environment-specific configuration (for example, AWS AppConfig)",
      ],
    },
    {
      id: "3.2",
      title: "Test applications in development environments",
      covers: [
        "Test deployed code with AWS services and tools",
        "Integration tests and mock APIs for external dependencies",
        "Development endpoints such as API Gateway stages",
        "Deploy stack updates to existing environments (for example, a SAM template to a staging environment)",
        "Test event-driven applications",
      ],
    },
    {
      id: "3.3",
      title: "Automate deployment testing",
      covers: [
        "Application test events (JSON payloads for Lambda, API Gateway, SAM resources)",
        "Deploy API resources to various environments",
        "Environments that use approved versions: Lambda aliases, container image tags, Amplify branches, AWS Copilot environments",
        "Implement and deploy IaC templates (SAM, CloudFormation)",
        "Manage dev, test, and prod environments within a service",
        "Use Amazon Q Developer to generate automated tests",
      ],
    },
    {
      id: "3.4",
      title: "Deploy code by using AWS CI/CD services",
      covers: [
        "Lambda deployment packaging options; API Gateway stages and custom domains",
        "Update existing IaC templates; manage application environments",
        "Deploy with deployment strategies; perform rollbacks",
        "Commit code to invoke build, test, and deploy actions; orchestrated workflows across environments",
        "Labels and branches for version and release management",
        "Runtime configuration such as API Gateway stage variables in Lambda functions",
        "Configure blue/green, canary, and rolling deployments",
      ],
    },
  ],

  lessons: [
    {
      id: "d3-packaging",
      task: "3.1 · 3.4",
      title: "Packaging artifacts and configuration",
      check: ["d3-01", "d3-02"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={2}
            tiles={[
              { icon: "🗜️", title: ".zip archive", text: "Up to 50 MB zipped for direct upload (larger through S3), 250 MB unzipped including layers.", color: "#34d399" },
              { icon: "🐳", title: "Container image", text: "Up to 10 GB, stored in Amazon ECR. Good for big dependencies or existing container tooling.", color: "#34d399" },
            ]}
          />
          <Layers
            layers={[
              { name: "Repository root", color: "#38bdf8", items: ["template.yaml (SAM)", "buildspec.yml (CodeBuild)", "appspec.yml (CodeDeploy)", "Dockerfile", ".ebextensions/*.config (Beanstalk)"] },
              { name: "Kept out of the package", color: "#f87171", items: ["Secrets", "Dev and test dependencies", "Per-environment values (use env vars, Parameter Store, AppConfig)"] },
            ]}
          />
        </div>
      ),
      points: [
        "Bundle runtime dependencies with the code (or in a layer); never install them at invocation time.",
        "AWS AppConfig deploys feature flags and configuration gradually, validates them, and rolls back automatically on a CloudWatch alarm.",
        "Set resources to fit the app: Lambda memory, ECS task CPU and memory, Beanstalk instance types.",
      ],
      tip: "Dependencies over 250 MB unzipped → package the function as a container image.",
    },
    {
      id: "d3-iac",
      task: "3.3 · 3.4",
      title: "CloudFormation, SAM, and CDK",
      check: ["d3-07", "d3-08"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#38bdf8"
            steps={[
              { icon: "🧑‍💻", label: "Author", sub: "CloudFormation YAML, SAM template, or CDK code" },
              { icon: "🧱", label: "Synthesize / transform", sub: "CDK synth and the SAM transform both produce CloudFormation" },
              { icon: "🔍", label: "Change set", sub: "Preview what will change" },
              { icon: "🏗️", label: "Stack update", sub: "Rolls back automatically on failure" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "📜", title: "CloudFormation", text: "Parameters, Mappings, Conditions, Resources (required), Outputs. Export + ImportValue to share between stacks.", color: "#a78bfa" },
              { icon: "🐿️", title: "AWS SAM", text: "Transform: AWS::Serverless-2016-10-31. Short syntax for functions, APIs, tables. sam build, local, deploy.", color: "#a78bfa" },
              { icon: "🧰", title: "AWS CDK", text: "Infrastructure in TypeScript, Python, Java, C#, or Go. cdk synth, diff, deploy.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Intrinsic functions: Ref, Fn::GetAtt, Fn::Sub, Fn::Join, Fn::FindInMap, Fn::ImportValue, Fn::If.",
        "DeletionPolicy: Retain or Snapshot keeps data stores when a stack or resource is deleted.",
        "SAM deploys to different environments with samconfig.toml configuration environments or --parameter-overrides.",
      ],
      tip: "\"See what will change before updating production\" → create a change set.",
    },
    {
      id: "d3-testing",
      task: "3.2 · 3.3",
      title: "Testing in development environments",
      check: ["d3-15", "d3-16"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "🧪", label: "sam local generate-event", sub: "Sample S3, SQS, API Gateway payloads" },
              { icon: "λ", label: "sam local invoke / start-api", sub: "Run in a local container" },
              { icon: "🎭", label: "Mock integrations", sub: "API Gateway returns canned responses" },
              { icon: "🚦", label: "Dev stage", sub: "Deployed, isolated from prod" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🌿", title: "Amplify branches", text: "Each Git branch can get its own hosted environment for testing.", color: "#38bdf8" },
              { icon: "🔁", title: "Event-driven tests", text: "Send test events; check EventBridge patterns with TestEventPattern; assert on the queue or table.", color: "#38bdf8" },
              { icon: "🤖", title: "Amazon Q Developer", text: "Generates unit tests for existing code from the IDE.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Integration tests should stub or mock external APIs, or use the provider's sandbox, never production systems.",
        "Use a separate API Gateway stage (and Lambda alias) for dev and test so production traffic is never touched.",
        "Deploy the same SAM template to staging with different parameters instead of maintaining copies.",
      ],
    },
    {
      id: "d3-aliases",
      task: "3.3 · 3.4",
      title: "Versions, aliases, and stage variables",
      check: ["d3-22", "d3-23"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "🚪", label: "API Gateway prod stage", sub: "Stage variable alias = prod" },
              { icon: "🏷️", label: "Alias: prod", sub: "90% → v7 · 10% → v8" },
              { icon: "📦", label: "Versions 7 and 8", sub: "Immutable snapshots of code + config" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🐤", title: "Canary10Percent5Minutes", text: "10% of traffic for 5 minutes, then the rest.", color: "#34d399" },
              { icon: "📈", title: "Linear10PercentEvery1Minute", text: "Add 10% every minute until 100%.", color: "#34d399" },
              { icon: "💥", title: "AllAtOnce", text: "Shift everything immediately.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "A published version is immutable; $LATEST is the editable one. An alias is a named pointer that can move between versions.",
        "SAM AutoPublishAlias plus DeploymentPreference uses CodeDeploy to shift alias traffic, with pre-traffic and post-traffic hook functions and CloudWatch alarms for automatic rollback.",
        "Stage variables let one API definition target different aliases per stage, for example function:${stageVariables.alias}. Each alias needs its own invoke permission.",
        "Approved container versions: reference immutable image tags (such as a commit SHA) or digests, and enable ECR tag immutability.",
      ],
    },
    {
      id: "d3-strategies",
      task: "3.4",
      title: "Deployment strategies and rollbacks",
      check: ["d3-28", "d3-30"],
      visual: <DeployStrategies />,
      points: [
        "Elastic Beanstalk policies: all at once, rolling, rolling with additional batch, immutable, and traffic splitting. Blue/green uses a cloned environment and a URL (CNAME) swap.",
        "CodeDeploy reads appspec.yml for lifecycle hooks. EC2/on-premises deployments are in-place or blue/green; Lambda and ECS shift traffic.",
        "CodeDeploy rollback redeploys the last known good revision as a new deployment, triggered on failure or a CloudWatch alarm.",
      ],
      tip: "Fastest rollback with zero downtime → immutable or blue/green. Cheapest and fastest for dev → all at once.",
    },
    {
      id: "d3-cicd",
      task: "3.4",
      title: "CI/CD with CodePipeline, CodeBuild, CodeDeploy, and CodeArtifact",
      check: ["d3-34", "d3-35"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#34d399"
            steps={[
              { icon: "🌿", label: "Source", sub: "Commit or tag in a Git repository" },
              { icon: "🔨", label: "Build + test", sub: "CodeBuild runs buildspec.yml" },
              { icon: "✋", label: "Manual approval", sub: "Optional gate before prod" },
              { icon: "🚀", label: "Deploy", sub: "CodeDeploy, CloudFormation, ECS, Beanstalk" },
            ]}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🔨", title: "buildspec.yml phases", text: "install → pre_build → build → post_build, then artifacts and reports.", color: "#f59e0b" },
              { icon: "📦", title: "CodeArtifact", text: "Private npm, PyPI, Maven, NuGet repositories with upstream caching of public packages.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "CodePipeline models stages and actions, passes artifacts between them through an S3 artifact store, and starts on source changes.",
        "Use branches and Git tags for release management: for example, deploy to production only from release tags.",
        "Orchestrated workflows promote the same artifact through dev, test, and prod rather than rebuilding it for each one.",
      ],
    },
  ],

  questions: [
    // ── Packaging ──
    {
      id: "d3-01",
      domain: "d3",
      lesson: "d3-packaging",
      prompt: "A Python Lambda function needs machine learning libraries that total about 1.2 GB when unzipped. How should the developer package the function?",
      options: ["As a container image stored in Amazon ECR", "As a .zip archive uploaded directly", "As five Lambda layers", "By downloading the libraries from S3 in the handler on every invocation"],
      answer: [0],
      explanation: ".zip deployments (including layers) are limited to 250 MB unzipped. Container images can be up to 10 GB.",
    },
    {
      id: "d3-02",
      domain: "d3",
      lesson: "d3-packaging",
      prompt: "Uploading a 70 MB .zip deployment package directly to a Lambda function fails. The package is 180 MB unzipped. What should the developer do?",
      options: ["Upload the package to Amazon S3 and point the function's code at the S3 object", "Split the function into two smaller functions", "Increase the function's memory", "Convert the code to a layer of 70 MB"],
      answer: [0],
      explanation: "Direct uploads are limited to 50 MB zipped. Larger packages, still under 250 MB unzipped, are deployed from S3.",
    },
    {
      id: "d3-03",
      domain: "d3",
      lesson: "d3-packaging",
      prompt:
        "A team wants to turn on a new feature for 10% of users, increase gradually, and automatically roll back if an error alarm fires, without redeploying code. Which service should they use?",
      options: ["AWS AppConfig feature flags with a gradual deployment strategy and a CloudWatch alarm", "Lambda environment variables", "An S3 static file edited by hand", "AWS CloudShell"],
      answer: [0],
      explanation: "AppConfig deploys configuration and feature flags gradually with validators and alarm-based rollback, separately from code deployments.",
    },
    {
      id: "d3-04",
      domain: "d3",
      lesson: "d3-packaging",
      prompt: "A CodeBuild project fails immediately with an error that it can't find buildspec.yml. The file is in a folder named ci/. What should the developer do?",
      options: [
        "Move buildspec.yml to the root of the source, or set the project's buildspec path to ci/buildspec.yml",
        "Rename the file to appspec.yml",
        "Give CodeBuild administrator permissions",
        "Increase the build timeout",
      ],
      answer: [0],
      explanation: "CodeBuild looks for buildspec.yml in the source root by default. You can override the location in the project settings.",
    },
    {
      id: "d3-05",
      domain: "d3",
      lesson: "d3-packaging",
      prompt: "Which practices correctly package a Python Lambda function that depends on third-party libraries? (Choose two.)",
      options: [
        "Install the runtime dependencies into the package directory and zip them with the code",
        "Put shared dependencies in a Lambda layer that the function references",
        "Run pip install inside the handler on every invocation",
        "Include all development and test dependencies in the package",
        "Upload only the source file and let Lambda resolve imports",
      ],
      answer: [0, 1],
      explanation: "Dependencies must be in the deployment package or a layer. Installing at runtime is slow and unreliable, and dev dependencies only make the package bigger.",
    },
    {
      id: "d3-06",
      domain: "d3",
      lesson: "d3-packaging",
      prompt: "Amazon ECS tasks for a service keep stopping with an out-of-memory error during peak load. What should the developer change?",
      options: ["Increase the memory value in the task definition and deploy a new revision", "Add more environment variables", "Increase the container image size", "Switch the image tag to latest"],
      answer: [0],
      explanation: "Task and container CPU and memory are set in the task definition. A new revision with more memory, rolled out to the service, fixes the limit.",
    },
    // ── IaC ──
    {
      id: "d3-07",
      domain: "d3",
      lesson: "d3-iac",
      prompt: "Before updating a production CloudFormation stack, the team wants to see exactly which resources will be added, modified, or replaced. What should they use?",
      options: ["A change set", "Drift detection", "A stack policy", "The DependsOn attribute"],
      answer: [0],
      explanation: "A change set previews the changes an update will make, including replacements, before you execute it. Drift detection compares live resources with the template.",
    },
    {
      id: "d3-08",
      domain: "d3",
      lesson: "d3-iac",
      prompt: "A networking stack creates a VPC. A separate application stack must use the VPC's ID. How should the developer share it?",
      options: [
        "Export the VPC ID in the networking stack's Outputs and use Fn::ImportValue in the application stack",
        "Hard-code the VPC ID in the application template",
        "Use a Mappings section in the networking stack",
        "Use Fn::GetAtt across stacks",
      ],
      answer: [0],
      explanation: "Cross-stack references use exported outputs and Fn::ImportValue. GetAtt only works within one template.",
    },
    {
      id: "d3-09",
      domain: "d3",
      lesson: "d3-iac",
      type: "match",
      prompt: "Match each CloudFormation template section to its purpose.",
      pairs: [
        ["Parameters", "Values supplied when the stack is created or updated"],
        ["Mappings", "Static lookup tables, such as an AMI ID per Region"],
        ["Conditions", "Create resources only when an expression is true"],
        ["Resources", "The AWS resources to create; the only required section"],
        ["Outputs", "Values to display or export to other stacks"],
      ],
      explanation: "Transform (used by SAM), Rules, Metadata, and Description are other optional sections.",
    },
    {
      id: "d3-10",
      domain: "d3",
      lesson: "d3-iac",
      prompt: "Which line tells CloudFormation to process a template as an AWS SAM template?",
      options: ["Transform: AWS::Serverless-2016-10-31", "AWSTemplateFormatVersion: 2010-09-09", "Resources: AWS::Serverless", "Mappings: SAM"],
      answer: [0],
      explanation: "The SAM transform expands AWS::Serverless::* resources into standard CloudFormation resources during deployment.",
    },
    {
      id: "d3-11",
      domain: "d3",
      lesson: "d3-iac",
      type: "order",
      prompt: "Put the steps of a typical AWS SAM workflow for a new function in order.",
      items: ["sam init", "sam build", "sam local invoke", "sam deploy --guided"],
      explanation: "Initialize a project, build the artifacts, test locally, then deploy (guided the first time, which saves settings to samconfig.toml).",
    },
    {
      id: "d3-12",
      domain: "d3",
      lesson: "d3-iac",
      prompt: "During a stack update, one resource fails to update. What does CloudFormation do by default?",
      options: [
        "Rolls the stack back to its last known good configuration",
        "Leaves the stack half-updated and stops",
        "Deletes the entire stack",
        "Retries the update every hour until it succeeds",
      ],
      answer: [0],
      explanation: "On failure, CloudFormation rolls back the update by default. The stack's events show the first failure and its reason.",
    },
    {
      id: "d3-13",
      domain: "d3",
      lesson: "d3-iac",
      prompt: "Which statements about the AWS CDK are correct? (Choose two.)",
      options: [
        "Infrastructure is defined in programming languages such as TypeScript or Python",
        "cdk synth produces a CloudFormation template that is then deployed",
        "CDK deploys resources without using CloudFormation",
        "CDK only supports YAML",
        "CDK replaces the need for IAM permissions",
      ],
      answer: [0, 1],
      explanation: "CDK apps synthesize to CloudFormation templates, and cdk deploy deploys them as stacks. Constructs offer higher-level building blocks.",
    },
    {
      id: "d3-14",
      domain: "d3",
      lesson: "d3-iac",
      prompt: "An Amazon RDS instance is defined in a CloudFormation stack. The data must be kept if the stack is deleted. What should the developer set on the resource?",
      options: ["DeletionPolicy: Retain or DeletionPolicy: Snapshot", "DependsOn", "UpdateReplacePolicy: Delete", "Condition: false"],
      answer: [0],
      explanation: "DeletionPolicy controls what happens to a resource when it's removed from the stack or the stack is deleted. Retain keeps it; Snapshot saves a final snapshot.",
    },
    // ── Testing ──
    {
      id: "d3-15",
      domain: "d3",
      lesson: "d3-testing",
      prompt: "A developer wants to test a Lambda function locally with a realistic Amazon S3 put event before deploying. Which approach requires the LEAST effort?",
      options: [
        "Run sam local generate-event s3 put to create the payload, then sam local invoke with that event",
        "Deploy to production and upload a file",
        "Write the event JSON by hand from memory",
        "Use AWS CloudTrail to replay the event",
      ],
      answer: [0],
      explanation: "SAM CLI generates sample event payloads for many services and runs the function locally in a container that mimics Lambda.",
    },
    {
      id: "d3-16",
      domain: "d3",
      lesson: "d3-testing",
      prompt: "A frontend team needs to start integrating with an API before the backend is built. How can the developer give them working endpoints quickly?",
      options: ["Configure API Gateway mock integrations that return sample responses", "Have the frontend team wait", "Point the API at the production database", "Use a Lambda authorizer"],
      answer: [0],
      explanation: "Mock integrations return responses defined in API Gateway without calling a backend, so clients can develop against the real API contract.",
    },
    {
      id: "d3-17",
      domain: "d3",
      lesson: "d3-testing",
      prompt:
        "A team deploys a SAM application to dev. They now need the same template in a staging environment with a different table name and memory size. What should they do?",
      options: [
        "Add a staging configuration environment to samconfig.toml (or pass --parameter-overrides) and run sam deploy --config-env staging",
        "Copy the template and edit the values by hand",
        "Deploy to dev and rename the resources",
        "Use one stack for both environments",
      ],
      answer: [0],
      explanation: "Template parameters plus SAM configuration environments let one template deploy as separate stacks with environment-specific values.",
    },
    {
      id: "d3-18",
      domain: "d3",
      lesson: "d3-testing",
      prompt: "Which API Gateway features let a team test API changes without affecting production users? (Choose two.)",
      options: [
        "Deploy the API to a separate dev stage and test through that stage's invoke URL",
        "Use stage variables so the dev stage invokes a dev Lambda alias",
        "Edit the prod stage's integration in place",
        "Delete the prod stage while testing",
        "Send test traffic to the prod stage with a special header",
      ],
      answer: [0, 1],
      explanation: "Each stage is an independent deployment with its own URL and settings, and stage variables route each stage to the right backend.",
    },
    {
      id: "d3-19",
      domain: "d3",
      lesson: "d3-testing",
      prompt: "A developer wrote an Amazon EventBridge rule and wants to confirm that a sample event matches its pattern before deploying. What should the developer do?",
      options: ["Test the pattern against the sample event with the EventBridge TestEventPattern API or the console sandbox", "Deploy to production and wait for real events", "Enable AWS CloudTrail", "Create an SQS FIFO queue"],
      answer: [0],
      explanation: "TestEventPattern reports whether an event matches a pattern, so pattern logic can be tested in isolation and in automated tests.",
    },
    {
      id: "d3-20",
      domain: "d3",
      lesson: "d3-testing",
      prompt: "An order service calls an external payment API. How should the team run reliable automated integration tests? (Choose two.)",
      options: [
        "Mock or stub the payment API in the test suite",
        "Use the payment provider's sandbox environment and test credentials",
        "Run tests against the provider's production API with real cards",
        "Skip integration tests for third-party calls",
        "Hard-code test responses into the production code path",
      ],
      answer: [0, 1],
      explanation: "Mocks make tests fast and repeatable; a provider sandbox checks the real contract without real money. Test code should never change production behaviour.",
    },
    {
      id: "d3-21",
      domain: "d3",
      lesson: "d3-testing",
      prompt: "A developer wants AI-generated unit tests for an existing Lambda handler, created from inside the IDE. Which tool should the developer use?",
      options: ["Amazon Q Developer", "AWS CodeDeploy", "AWS AppConfig", "Amazon Inspector"],
      answer: [0],
      explanation: "Amazon Q Developer can generate unit tests for selected code, which the developer then reviews and runs.",
    },
    // ── Versions and aliases ──
    {
      id: "d3-22",
      domain: "d3",
      lesson: "d3-aliases",
      prompt:
        "API Gateway should invoke a stable reference to a Lambda function that the team can point at a new version without changing the API configuration. What should the integration use?",
      options: ["The ARN of a Lambda alias such as prod", "The ARN of $LATEST", "The ARN of a specific numbered version", "The function's CloudWatch log group"],
      answer: [0],
      explanation: "An alias is a pointer that can be moved to any version. Versions are immutable, and $LATEST changes with every code update.",
    },
    {
      id: "d3-23",
      domain: "d3",
      lesson: "d3-aliases",
      prompt: "A team wants 10% of production invocations to run a new Lambda version and 90% to stay on the current one. What should they configure?",
      options: ["Weighted routing on the prod alias, with 10% going to the new version", "Two functions behind a load balancer", "Reserved concurrency of 10%", "A new API Gateway stage"],
      answer: [0],
      explanation: "Aliases support weighted traffic between two versions. CodeDeploy can shift those weights automatically.",
    },
    {
      id: "d3-24",
      domain: "d3",
      lesson: "d3-aliases",
      prompt:
        "With AWS SAM, a team wants each deployment to send 10% of traffic to the new version for 5 minutes, then the rest, rolling back automatically if an error alarm fires. What should they add to the function?",
      options: [
        "AutoPublishAlias and a DeploymentPreference of type Canary10Percent5Minutes with the alarm listed",
        "A Lambda layer",
        "Provisioned concurrency",
        "An SQS dead-letter queue",
      ],
      answer: [0],
      explanation: "SAM publishes a new version, updates the alias, and uses CodeDeploy to shift traffic. Listed alarms and hook functions can trigger rollback.",
    },
    {
      id: "d3-25",
      domain: "d3",
      lesson: "d3-aliases",
      prompt:
        "One API Gateway REST API has dev and prod stages. Each stage must invoke the matching Lambda alias without duplicating the API definition. How should the integration be configured?",
      options: [
        "Use a stage variable in the integration's function ARN, such as function:${stageVariables.alias}, and grant invoke permission for each alias",
        "Create two separate APIs",
        "Use $LATEST in both stages",
        "Use a usage plan per stage",
      ],
      answer: [0],
      explanation: "Stage variables are resolved at runtime per stage. Because the ARN is dynamic, API Gateway needs explicit lambda:InvokeFunction permission on each alias.",
    },
    {
      id: "d3-26",
      domain: "d3",
      lesson: "d3-aliases",
      type: "match",
      prompt: "Match each Lambda traffic-shifting deployment preference to its behaviour.",
      pairs: [
        ["Canary10Percent5Minutes", "10% of traffic for 5 minutes, then the remaining 90% at once"],
        ["Linear10PercentEvery1Minute", "Another 10% of traffic every minute until all traffic shifts"],
        ["AllAtOnce", "All traffic moves to the new version immediately"],
      ],
      explanation: "Canary shifts in two steps, linear in equal increments, and all-at-once in one step.",
    },
    {
      id: "d3-27",
      domain: "d3",
      lesson: "d3-aliases",
      prompt:
        "Integration tests passed against a container image tagged latest, but production later pulled a different image with the same tag. How should the team make sure environments use the approved image?",
      options: [
        "Reference an immutable tag, such as the commit SHA, or the image digest, and enable tag immutability in Amazon ECR",
        "Keep using latest and redeploy more often",
        "Delete old images from the repository every day",
        "Push images to a public repository",
      ],
      answer: [0],
      explanation: "Mutable tags can be moved to a different image. Unique, immutable tags or digests guarantee every environment runs exactly what was tested.",
    },
    // ── Strategies ──
    {
      id: "d3-28",
      domain: "d3",
      lesson: "d3-strategies",
      prompt:
        "An Elastic Beanstalk production environment must keep full capacity during deployments, and a failed deployment must be undone quickly with minimal impact. Which deployment policy fits BEST?",
      options: ["Immutable", "All at once", "Rolling", "Rolling with additional batch"],
      answer: [0],
      explanation: "Immutable launches the new version on fresh instances in a temporary Auto Scaling group. If they fail health checks, they are terminated and the original instances keep serving.",
    },
    {
      id: "d3-29",
      domain: "d3",
      lesson: "d3-strategies",
      prompt: "A developer needs the fastest possible deployment to an Elastic Beanstalk development environment, and brief downtime is acceptable. Which policy should they choose?",
      options: ["All at once", "Immutable", "Rolling with additional batch", "Blue/green with a URL swap"],
      answer: [0],
      explanation: "All at once deploys to every instance simultaneously: fastest, but the app is briefly unavailable and a failure affects everything.",
    },
    {
      id: "d3-30",
      domain: "d3",
      lesson: "d3-strategies",
      prompt: "How can a developer perform a blue/green deployment with AWS Elastic Beanstalk?",
      options: [
        "Clone the environment, deploy the new version to the clone, test it, then swap environment URLs",
        "Use the rolling policy with a batch size of 100%",
        "Change the instance type",
        "Edit .ebextensions on the running instances",
      ],
      answer: [0],
      explanation: "Swapping environment URLs (a CNAME swap) moves traffic to the new environment. Swapping back is the rollback.",
    },
    {
      id: "d3-31",
      domain: "d3",
      lesson: "d3-strategies",
      prompt: "Which file tells AWS CodeDeploy where to copy files and which scripts to run at each lifecycle event on EC2 instances?",
      options: ["appspec.yml", "buildspec.yml", "template.yaml", "Dockerfile"],
      answer: [0],
      explanation: "The AppSpec file (appspec.yml at the root of the revision) maps files and lifecycle hooks. buildspec.yml is for CodeBuild.",
    },
    {
      id: "d3-32",
      domain: "d3",
      lesson: "d3-strategies",
      type: "order",
      prompt: "Put these CodeDeploy lifecycle hooks for an EC2 in-place deployment in the order they run.",
      items: ["ApplicationStop", "BeforeInstall", "AfterInstall", "ApplicationStart", "ValidateService"],
      explanation: "Stop the old app, prepare, install (CodeDeploy copies the files), configure, start, then validate. Load balancer hooks wrap this sequence when one is used.",
    },
    {
      id: "d3-33",
      domain: "d3",
      lesson: "d3-strategies",
      prompt: "Which statements about automatic rollback in AWS CodeDeploy are correct? (Choose two.)",
      options: [
        "It can be triggered when a deployment fails",
        "It can be triggered when a specified CloudWatch alarm goes into the ALARM state",
        "It restores EBS snapshots of the instances",
        "It deletes the deployment group",
        "It requires creating a new pipeline",
      ],
      answer: [0, 1],
      explanation: "CodeDeploy rolls back by redeploying the last known good revision as a new deployment, on failure or when monitored alarms fire.",
    },
    // ── CI/CD ──
    {
      id: "d3-34",
      domain: "d3",
      lesson: "d3-cicd",
      prompt: "Every push to the main branch must automatically build, test, and deploy an application through several stages. Which service orchestrates this release workflow?",
      options: ["AWS CodePipeline", "AWS CodeArtifact", "AWS CloudShell", "Amazon ECR"],
      answer: [0],
      explanation: "CodePipeline models the release as stages (source, build, test, deploy) and runs them on each change, calling CodeBuild, CodeDeploy, CloudFormation, and others.",
    },
    {
      id: "d3-35",
      domain: "d3",
      lesson: "d3-cicd",
      prompt: "A team lead must sign off before a pipeline deploys to production. What should the developer add to the pipeline?",
      options: ["A manual approval action before the production deploy stage", "A longer CodeBuild timeout", "A Lambda layer", "A second source action"],
      answer: [0],
      explanation: "Manual approval actions pause the pipeline until an authorized person approves or rejects. They can notify approvers through Amazon SNS.",
    },
    {
      id: "d3-36",
      domain: "d3",
      lesson: "d3-cicd",
      prompt: "Builds need private npm packages published by internal teams and should also cache public packages from npmjs.com. Which service fits?",
      options: ["AWS CodeArtifact with an upstream repository connected to the public npm registry", "Amazon ECR", "Amazon S3 static website hosting", "AWS AppConfig"],
      answer: [0],
      explanation: "CodeArtifact hosts private package repositories and can fetch and keep public packages through external connections.",
    },
    {
      id: "d3-37",
      domain: "d3",
      lesson: "d3-cicd",
      prompt: "Which of these are valid phases in a CodeBuild buildspec.yml file? (Choose two.)",
      options: ["pre_build", "post_build", "ApplicationStart", "BeforeAllowTraffic", "ValidateService"],
      answer: [0, 1],
      explanation: "Buildspec phases are install, pre_build, build, and post_build. The others are CodeDeploy AppSpec hooks.",
    },
    {
      id: "d3-38",
      domain: "d3",
      lesson: "d3-cicd",
      prompt: "A team wants production deployments to run only for release tags such as v1.4.0, while every commit to main deploys to test. How should the production pipeline start?",
      options: [
        "Configure a CodePipeline trigger that filters on Git tags matching the release pattern",
        "Deploy every commit to production",
        "Have a developer copy files to production by hand",
        "Run the production pipeline on a fixed hourly schedule",
      ],
      answer: [0],
      explanation: "Pipeline triggers can filter on branches and Git tags, so tagging a release is what promotes it to production.",
    },
  ],

  cards: [
    { id: "s-cfn", domain: "d3", kind: "service", term: "AWS CloudFormation", definition: "Provision resources from templates as stacks" },
    { id: "s-sam", domain: "d3", kind: "service", term: "AWS SAM", definition: "Serverless shorthand for CloudFormation plus a local test CLI" },
    { id: "s-cdk", domain: "d3", kind: "service", term: "AWS CDK", definition: "Define infrastructure in code; synthesizes to CloudFormation" },
    { id: "s-codepipeline", domain: "d3", kind: "service", term: "AWS CodePipeline", definition: "Orchestrates source, build, test, and deploy stages" },
    { id: "s-codebuild", domain: "d3", kind: "service", term: "AWS CodeBuild", definition: "Managed build and test runner driven by buildspec.yml" },
    { id: "s-codedeploy", domain: "d3", kind: "service", term: "AWS CodeDeploy", definition: "Deploys to EC2, on-premises, Lambda, and ECS with rollbacks" },
    { id: "s-codeartifact", domain: "d3", kind: "service", term: "AWS CodeArtifact", definition: "Private package repositories (npm, PyPI, Maven)" },
    { id: "s-beanstalk", domain: "d3", kind: "service", term: "AWS Elastic Beanstalk", definition: "Upload code; it provisions and deploys the environment" },
    { id: "s-appconfig", domain: "d3", kind: "service", term: "AWS AppConfig", definition: "Safe, gradual deployment of configuration and feature flags" },
    { id: "s-ecr", domain: "d3", kind: "service", term: "Amazon ECR", definition: "Private container image registry" },
    { id: "s-ecs", domain: "d3", kind: "service", term: "Amazon ECS", definition: "Run containers as tasks and services, on EC2 or Fargate" },
    { id: "s-amplify", domain: "d3", kind: "service", term: "AWS Amplify", definition: "Build and host web apps with per-branch environments" },
    { id: "c-changeset", domain: "d3", kind: "concept", term: "Change set", definition: "Preview what a stack update will change" },
    { id: "c-alias", domain: "d3", kind: "concept", term: "Lambda alias", definition: "Named pointer to a version; supports weighted traffic" },
    { id: "c-stagevar", domain: "d3", kind: "concept", term: "Stage variable", definition: "Per-stage value in API Gateway, such as the Lambda alias to call" },
    { id: "c-canary", domain: "d3", kind: "concept", term: "Canary deployment", definition: "Small share of traffic first, then the rest" },
    { id: "c-bluegreen", domain: "d3", kind: "concept", term: "Blue/green deployment", definition: "New environment alongside the old; switch traffic over" },
    { id: "c-immutable", domain: "d3", kind: "concept", term: "Immutable deployment", definition: "New version on fresh instances; terminate them to roll back" },
    { id: "c-appspec", domain: "d3", kind: "concept", term: "appspec.yml", definition: "CodeDeploy file mapping and lifecycle hooks" },
    { id: "c-buildspec", domain: "d3", kind: "concept", term: "buildspec.yml", definition: "CodeBuild phases: install, pre_build, build, post_build" },
  ],
});
