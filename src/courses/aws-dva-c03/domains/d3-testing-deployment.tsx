import { Flow, Layers, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { DeployStrategies } from "../visuals";

/**
 * Domain 3: Testing and Deployment (22% of DVA-C03 scored content).
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Testing and Deployment",
    world: "The Proving Docks",
    weight: 22,
    emoji: "🚀",
    color: "#34d399",
    summary:
      "How you package code and container images, test safely (AI-generated tests included), describe infrastructure as code, deploy to Lambda, ECS, and EKS, and roll back when a release goes wrong.",
  },

  tasks: [
    {
      id: "3.1",
      title: "Prepare application artifacts to be deployed to AWS",
      covers: [
        "Manage dependencies for code modules within packages: environment variables, configuration files, container images",
        "Build and manage container images: Amazon ECR, Dockerfiles, image tagging, lifecycle policies",
        "Use code repositories in deployment environments",
        "Manage environment-specific configuration with AppConfig, Parameter Store, Secrets Manager, API Gateway, and Lambda",
        "Use API Gateway features and resources such as stage-specific URLs and endpoints",
      ],
    },
    {
      id: "3.2",
      title: "Implement and automate application testing in AWS environments",
      covers: [
        "Develop and validate tests with AWS SAM, AWS CDK, and AWS CloudFormation",
        "Mock external dependencies with services and tools such as API Gateway",
        "Create application test events: JSON payloads for Lambda functions and API Gateway APIs",
        "Create and configure environments: Lambda aliases, container image tags, Amplify branches, AWS Copilot environments, API Gateway APIs",
        "Use AWS AI tools to generate tests and automate repetitive testing: test execution, result analysis, regression testing, coverage",
      ],
    },
    {
      id: "3.3",
      title: "Deploy code by using AWS CI/CD services",
      covers: [
        "Choose Lambda packaging (.zip files, container images, layers) for efficient deployments",
        "Deploy containers with ECS task definitions, EKS manifests, the Fargate launch type, and rolling updates",
        "Use IaC templates (CloudFormation, AWS SAM)",
        "Deploy application revisions with AWS CodeDeploy",
        "Orchestrate CI/CD with AWS CodePipeline: start from linked repositories, progress through environments",
        "Implement blue/green, canary, and rolling deployment strategies",
        "Roll back automatically or manually with CloudFormation and CodeDeploy",
        "Manage versions and releases with source control features such as labels and branches",
        "Use AWS AI tools to support CI/CD: deployment approvals, environment provisioning, post-deployment validation",
      ],
    },
  ],

  lessons: [
    // ── Start here (beginner) ──
    {
      id: "d3-start-deploying",
      level: "beginner",
      task: "3.1",
      title: "What deploying means",
      check: ["dva3-b3-01", "dva3-b3-02"],
      visual: (
        <Flow
          color="#34d399"
          steps={[
            { icon: "💻", label: "Your laptop", sub: "Where you write and try the code" },
            { icon: "📦", label: "Package", sub: "The code plus everything it needs to run" },
            { icon: "🧪", label: "Dev and test", sub: "Practice copies for trying changes" },
            { icon: "🌍", label: "Production", sub: "The copy real users rely on" },
          ]}
        />
      ),
      points: [
        "Code on your laptop helps nobody else. **Deploying** means copying your finished code onto servers in the cloud, where your users can reach it.",
        "Think of a restaurant. The chef tries a new dish in the kitchen first, and it only goes on the menu once it tastes right.",
        "Teams do the same with **environments**: separate copies of the app called dev, test, and production. You try changes in dev and test, and real users only see production.",
        "Before you deploy, you bundle the code and its libraries into a **package**, a single file AWS can run. For Lambda, that's usually a .zip file or a container image.",
      ],
      tip: "When a question mentions dev, test, staging, or prod, it's talking about separate copies of the same app.",
    },
    {
      id: "d3-start-testing",
      level: "beginner",
      task: "3.2",
      title: "Why you test before you ship",
      check: ["dva3-b3-03", "dva3-b3-04"],
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "🧩", title: "Unit test", text: "Checks one small piece on its own, like a single function.", color: "#38bdf8" },
            { icon: "🔗", title: "Integration test", text: "Checks that pieces work together, like your function and a real queue.", color: "#38bdf8" },
            { icon: "🎭", title: "Mock", text: "A stand-in for a service you don't want to call for real, like a payment provider.", color: "#38bdf8" },
          ]}
        />
      ),
      points: [
        "A **test** is a small program that runs your code and checks the result. It catches mistakes before your users do.",
        "Lambda functions run when an event arrives, like a file landing in S3. A **test event** is a sample of that message in JSON, so you can run the function whenever you like.",
        "Some code calls services you shouldn't hit during tests, like a real payment system. A **mock** stands in for that service and always gives the same, predictable answer.",
        "AI coding assistants can draft tests for you. Read every check they write before you trust it.",
      ],
      tip: "Tests should never touch production systems or real money. Look for answers that use a mock, a sandbox, or a separate dev environment.",
    },
    {
      id: "d3-start-pipeline",
      level: "beginner",
      task: "3.3",
      title: "Automating releases with CI/CD",
      check: ["dva3-b3-05", "dva3-b3-06"],
      visual: (
        <Flow
          color="#a78bfa"
          steps={[
            { icon: "🌿", label: "Commit", sub: "You save a change in Git" },
            { icon: "🔨", label: "Build and test", sub: "AWS CodeBuild" },
            { icon: "✋", label: "Approve", sub: "An optional sign-off" },
            { icon: "🚀", label: "Deploy", sub: "AWS CodeDeploy or CloudFormation" },
          ]}
        />
      ),
      points: [
        "Deploying by hand is slow and easy to get wrong. **CI/CD** (continuous integration and continuous delivery) automates it, like a car wash that moves every car through the same steps.",
        "On AWS, **CodePipeline** runs the whole line. **CodeBuild** builds and tests your code, and **CodeDeploy** puts the new version on your servers or functions.",
        "**Infrastructure as code** means writing down your servers, databases, and permissions in a text file called a **template**. **CloudFormation** reads the template and builds everything for you.",
        "If a new version misbehaves, you **roll back**: you put the last working version back in place.",
      ],
      tip: "A question about a release that runs on every commit is almost always about CodePipeline.",
    },

    // ── Exam lessons ──
    {
      id: "d3-packaging",
      task: "3.1 · 3.3",
      title: "Packaging your code, settings, and API stages",
      check: ["d3-01", "d3-02"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={2}
            tiles={[
              { icon: "🗜️", title: ".zip archive", text: "Up to 50 MB zipped if you upload it directly, or more through S3. The limit is 250 MB unzipped, layers included.", color: "#34d399" },
              { icon: "🐳", title: "Container image", text: "Up to 10 GB, stored in Amazon ECR. A good fit for big libraries, or if you already build containers.", color: "#34d399" },
            ]}
          />
          <Layers
            layers={[
              { name: "At the root of your repository", color: "#38bdf8", items: ["template.yaml (SAM)", "buildspec.yml (CodeBuild)", "appspec.yml (CodeDeploy)", "Dockerfile", ".ebextensions/*.config (Beanstalk)"] },
              { name: "Keep out of the package", color: "#f87171", items: ["Secrets", "Libraries you only need for development and tests", "Values that change per environment (put them in environment variables, Parameter Store, or AppConfig)"] },
            ]}
          />
        </div>
      ),
      points: [
        "Ship your libraries inside the package, or in a **layer**: a shared bundle of libraries that several functions can use. Never install them while the function is running.",
        "**AWS AppConfig** rolls out settings and feature flags a little at a time. It checks them first, and rolls back on its own if a CloudWatch alarm fires.",
        "Size the resources to fit the app: memory for Lambda, CPU and memory for an ECS task, and the instance type for Elastic Beanstalk.",
        "Each API Gateway **stage** gets its own URL, like https://{api-id}.execute-api.{region}.amazonaws.com/{stage}. A custom domain name with base path mappings hides those URLs behind your own domain.",
      ],
      tip: "If your libraries come to more than 250 MB unzipped, package the function as a container image instead.",
    },
    {
      id: "d3-containers",
      task: "3.1 · 3.3",
      title: "Container images, ECS, and EKS deployments",
      check: ["d3-39", "d3-41", "d3-43"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#38bdf8"
            steps={[
              { icon: "📄", label: "Dockerfile", sub: "A small base image with only what the app needs to run" },
              { icon: "🔨", label: "docker build and tag", sub: "Tag it with the commit SHA or version" },
              { icon: "🔑", label: "Log in to ECR", sub: "aws ecr get-login-password" },
              { icon: "📦", label: "docker push", sub: "To a private ECR repository, scanned on push" },
              { icon: "🧹", label: "Lifecycle policy", sub: "Clears out untagged and old images for you" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "📋", title: "ECS task definition", text: "Lists the image, CPU, memory, ports, environment variables, secrets, and task role. Every change makes a new revision, and the service rolls over to it.", color: "#34d399" },
              { icon: "☁️", title: "Fargate launch type", text: "No servers to manage. You must set CPU and memory for the task and use the awsvpc network mode.", color: "#34d399" },
              { icon: "☸️", title: "EKS manifest", text: "A Kubernetes Deployment names the image and how many copies to run. RollingUpdate uses maxSurge and maxUnavailable, and readiness probes hold traffic back until a pod is ready.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "An ECS **rolling update** swaps old tasks for new ones a few at a time, within the minimumHealthyPercent and maximumPercent limits you set.",
        "The **deployment circuit breaker** notices when new tasks keep failing. It stops the rollout and can roll back to the last revision that worked.",
        "For blue/green on ECS, CodeDeploy runs two task sets behind a load balancer and shifts traffic from the old set to the new one.",
        "Tag every image with something unique, like the commit SHA or version number, so every environment runs exactly what you tested. Turn on tag immutability on the repository too.",
        "**ECR lifecycle policies** delete images by count or age, for example keeping the last 20 release images and removing untagged ones after 7 days. That keeps storage costs down.",
      ],
      tip: "Old images piling up in ECR? Use a lifecycle policy. Tasks must keep serving during an update and roll back if it fails? Use a rolling update with the deployment circuit breaker.",
    },
    {
      id: "d3-iac",
      task: "3.2 · 3.3",
      title: "CloudFormation, SAM, and CDK",
      check: ["d3-07", "d3-08"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#38bdf8"
            steps={[
              { icon: "🧑‍💻", label: "Write it", sub: "A CloudFormation or SAM template, or CDK code" },
              { icon: "🧱", label: "Turn it into CloudFormation", sub: "cdk synth and the SAM transform both produce a CloudFormation template" },
              { icon: "🔍", label: "Preview a change set", sub: "See what will change before it happens" },
              { icon: "🏗️", label: "Update the stack", sub: "If anything fails, it rolls back on its own" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "📜", title: "CloudFormation", text: "Sections: Parameters, Mappings, Conditions, Resources (the only required one), and Outputs. Export an output and use ImportValue to share it with another stack.", color: "#a78bfa" },
              { icon: "🐿️", title: "AWS SAM", text: "Add Transform: AWS::Serverless-2016-10-31 and you get short syntax for functions, APIs, and tables. Then use sam build, sam local, and sam deploy.", color: "#a78bfa" },
              { icon: "🧰", title: "AWS CDK", text: "Write infrastructure in TypeScript, Python, Java, C#, or Go. Then use cdk synth, cdk diff, and cdk deploy.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "A **stack** is everything CloudFormation built from one template, managed together. Update the template and CloudFormation works out what to add, change, or remove.",
        "**Intrinsic functions** are small helpers you call inside a template: Ref, Fn::GetAtt, Fn::Sub, Fn::Join, Fn::FindInMap, Fn::ImportValue, and Fn::If.",
        "Set DeletionPolicy to Retain or Snapshot on a data store. Then deleting the stack, or removing the resource from it, won't throw your data away.",
        "To deploy one SAM template to several environments, use configuration environments in samconfig.toml, or pass different values with --parameter-overrides.",
        "In a CloudFormation template, Mappings are fixed lookup tables, such as one AMI ID per AWS Region. Resources is the only required section.",
      ],
      tip: "If a question asks how to see what will change before you update production, the answer is a change set.",
    },
    {
      id: "d3-testing",
      task: "3.2",
      title: "Testing in development environments",
      check: ["d3-15", "d3-16"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "🧪", label: "sam local generate-event", sub: "Creates sample S3, SQS, and API Gateway events" },
              { icon: "λ", label: "sam local invoke or start-api", sub: "Runs your function in a local container" },
              { icon: "🎭", label: "Mock integrations", sub: "API Gateway sends back a fixed, made-up response" },
              { icon: "🚦", label: "Dev stage", sub: "A deployed copy, kept apart from production" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🌿", title: "Amplify branches", text: "Each Git branch can get its own hosted copy of the app for testing.", color: "#38bdf8" },
              { icon: "🔁", title: "Event-driven tests", text: "Send a test event, check EventBridge patterns with TestEventPattern, then look at the queue or table to see what happened.", color: "#38bdf8" },
              { icon: "🧭", title: "AWS Copilot environments", text: "Named environments, like test and prod, for container apps. Each one gets its own infrastructure.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Integration tests check that your code works with other systems. Point them at a mock or the provider's sandbox, never at a live production system.",
        "Give dev and test their own API Gateway stage and Lambda alias. Then your experiments never touch real users' traffic.",
        "Deploy the same SAM template to staging with different parameters. One template beats several copies that slowly drift apart.",
        "Unit-test a function on your own machine: run sam local invoke with a generated event.",
        "Test your infrastructure code too. CDK assertions check the template that cdk synth produces, and cfn-lint or a change set catches template mistakes before you deploy.",
      ],
    },
    {
      id: "d3-ai-testing",
      task: "3.2 · 3.3",
      title: "AI tools for testing and CI/CD",
      check: ["d3-21", "d3-45", "d3-46"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "🤖", label: "Generate tests", sub: "AI drafts unit and regression tests from the code and the spec" },
              { icon: "👀", label: "Developer reviews", sub: "Checks the assertions and adds real edge cases" },
              { icon: "🔁", label: "Pipeline runs them", sub: "On every commit, with coverage reports" },
              { icon: "🧪", label: "AI reads the results", sub: "Sums up failures and suggests fixes" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧾", title: "Coverage gaps", text: "Ask the assistant which branches and error paths have no tests, then have it write them.", color: "#34d399" },
              { icon: "🖥️", title: "Headless in CI", text: "An AI command-line tool can run inside a build step to read test output or check a deployment. Kiro's CLI has a headless mode for this.", color: "#34d399" },
              { icon: "✋", title: "People still approve", text: "AI can sum up a change and its test results for the approver. A person still makes the call on production.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "AI tools can write unit tests, find code paths nobody tests, add a regression test for a bug you fixed, and explain why a test failed.",
        "Check that each generated assertion tests real behavior. A test that just repeats what today's code does can lock a bug in.",
        "So base generated tests on the requirements and acceptance criteria, for example from a spec, not only on the current code.",
        "In a pipeline, AI helpers can draft environment templates, sum up changes for an approval step, and run checks after a deploy. People keep control of production approvals and IAM permissions.",
      ],
      tip: "Give an AI tool in a pipeline only the permissions its step needs, and keep a manual approval before production.",
    },
    {
      id: "d3-aliases",
      task: "3.2 · 3.3",
      title: "Versions, aliases, and stage variables",
      check: ["d3-22", "d3-23"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "🚪", label: "API Gateway prod stage", sub: "Its stage variable sets the alias to prod" },
              { icon: "🏷️", label: "Alias: prod", sub: "90% of calls go to v7, 10% to v8" },
              { icon: "📦", label: "Versions 7 and 8", sub: "Frozen snapshots of code and settings" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🐤", title: "Canary10Percent5Minutes", text: "10% of traffic for 5 minutes, then the rest all at once.", color: "#34d399" },
              { icon: "📈", title: "Linear10PercentEvery1Minute", text: "Another 10% every minute until it reaches 100%.", color: "#34d399" },
              { icon: "💥", title: "AllAtOnce", text: "Everything moves to the new version right away.", color: "#34d399" },
            ]}
          />
        </div>
      ),
      points: [
        "Publishing a Lambda **version** freezes your code and settings so they can't change. $LATEST is the only copy you can still edit.",
        "An **alias** is a name, like prod, that points at a version. You can move it to another version without changing anything that calls it.",
        "In SAM, AutoPublishAlias plus DeploymentPreference hands the alias to CodeDeploy. It shifts traffic gradually, runs pre-traffic and post-traffic hook functions, and rolls back if a CloudWatch alarm fires.",
        "**Stage variables** let one API call a different alias in each stage, for example function:${stageVariables.alias}. Each alias needs its own invoke permission.",
        "For containers, deploy an approved version by using a tag that never moves, like the commit SHA, or the image digest. Turn on tag immutability in ECR.",
      ],
    },
    {
      id: "d3-strategies",
      task: "3.3",
      title: "Deployment strategies and rollbacks",
      check: ["d3-28", "d3-30"],
      visual: <DeployStrategies />,
      points: [
        "Elastic Beanstalk offers five deployment policies: all at once, rolling, rolling with additional batch, immutable, and traffic splitting.",
        "For **blue/green** on Beanstalk, you clone the environment, deploy to the clone, then swap the two environment URLs. That's called a CNAME swap.",
        "CodeDeploy reads appspec.yml to learn which scripts to run at each step. On EC2 or on-premises servers it deploys in place or blue/green. For Lambda and ECS it shifts traffic.",
        "A CodeDeploy rollback redeploys the last version that worked, as a brand-new deployment. It can start when a deployment fails or when a CloudWatch alarm fires.",
      ],
      tip: "Need zero downtime and a fast rollback? Pick immutable or blue/green. Need the cheapest, fastest deploy to a dev environment? Pick all at once.",
    },
    {
      id: "d3-cicd",
      task: "3.3",
      title: "CI/CD with CodePipeline, CodeBuild, CodeDeploy, and CodeArtifact",
      check: ["d3-34", "d3-35"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#34d399"
            steps={[
              { icon: "🌿", label: "Source", sub: "A commit or tag in a Git repository" },
              { icon: "🔨", label: "Build and test", sub: "CodeBuild follows buildspec.yml" },
              { icon: "✋", label: "Manual approval", sub: "An optional sign-off before production" },
              { icon: "🚀", label: "Deploy", sub: "CodeDeploy, CloudFormation, ECS, or Beanstalk" },
            ]}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "🔨", title: "buildspec.yml phases", text: "install, pre_build, build, then post_build. After those come artifacts and test reports.", color: "#f59e0b" },
              { icon: "📦", title: "CodeArtifact", text: "Private npm, PyPI, Maven, and NuGet repositories. It can also fetch and keep copies of public packages.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "**CodePipeline** strings stages and actions together. It starts when your source changes, and passes files between stages through an S3 artifact store.",
        "Use branches and Git tags to manage releases. For example, deploy to production only when someone pushes a release tag.",
        "Build once, then promote that same artifact through dev, test, and prod. If you rebuild for each environment, prod might not run exactly what you tested.",
      ],
    },
  ],

  questions: [
    // ── Start here (beginner) ──
    {
      id: "dva3-b3-01",
      domain: "d3",
      lesson: "d3-start-deploying",
      level: "beginner",
      prompt: "You've finished a new feature on your laptop. What does it mean to deploy it?",
      options: [
        "Copy the finished code onto servers in the cloud so users can reach it",
        "Write the first working draft of the code on your own machine",
        "Delete the old code from your laptop",
        "Email the code to every user",
      ],
      answer: [0],
      explanation: "Deploying is the step that moves your code from your own machine to servers your users can reach. Until then, only you can run it.",
    },
    {
      id: "dva3-b3-02",
      domain: "d3",
      lesson: "d3-start-deploying",
      level: "beginner",
      prompt: "Why do teams keep separate dev, test, and production copies of the same app?",
      options: [
        "So they can try changes safely before real users see them",
        "Because AWS charges less for three copies than for one",
        "So the production copy never needs updating",
        "Because each copy must use a different programming language",
      ],
      answer: [0],
      explanation: "Dev and test are practice copies, like a restaurant kitchen trying a dish before it goes on the menu. If something breaks there, no customer notices.",
    },
    {
      id: "dva3-b3-03",
      domain: "d3",
      lesson: "d3-start-testing",
      level: "beginner",
      prompt: "A Lambda function runs whenever a file lands in an S3 bucket. What is a test event for this function?",
      options: [
        "A sample JSON message that looks like the real S3 notification, so you can run the function on demand",
        "A CloudWatch alarm that fires when the function fails and sends you a message with the full error details",
        "A user who reports bugs by email",
        "A second S3 bucket that stores test results",
      ],
      answer: [0],
      explanation: "Lambda functions are started by events, and each event is a JSON message. A test event is a realistic copy of that message, so you don't have to upload a real file every time you want to try your code.",
    },
    {
      id: "dva3-b3-04",
      domain: "d3",
      lesson: "d3-start-testing",
      level: "beginner",
      prompt: "Your code charges customers through an outside payment service. In your automated tests, what's the safest way to handle that call?",
      options: [
        "Replace the payment service with a mock that returns a fake, predictable answer",
        "Charge a real card on every test run",
        "Skip testing any code that touches payments",
        "Run the tests against the production payment service at night when traffic is low",
      ],
      answer: [0],
      explanation: "A mock pretends to be the payment service and always answers the same way. Your tests stay fast and repeatable, and nobody gets charged by accident.",
    },
    {
      id: "dva3-b3-05",
      domain: "d3",
      lesson: "d3-start-pipeline",
      level: "beginner",
      prompt: "Which AWS service runs a whole release, from a code commit through build, test, and deploy?",
      options: ["AWS CodePipeline", "Amazon S3", "AWS CodeArtifact", "Amazon CloudWatch"],
      answer: [0],
      explanation: "CodePipeline is the conveyor belt that moves each change through its stages. CodeArtifact only stores software packages, and S3 and CloudWatch handle storage and monitoring.",
    },
    {
      id: "dva3-b3-06",
      domain: "d3",
      lesson: "d3-start-pipeline",
      level: "beginner",
      prompt: "What is an AWS CloudFormation template?",
      options: [
        "A text file that describes the AWS resources you want, so CloudFormation can build them for you",
        "A screenshot of how the AWS console looked when you set up your resources, kept for later reference",
        "A log file that lists errors from your app",
        "A monthly bill for your AWS account",
      ],
      answer: [0],
      explanation: "A template is like a recipe for your infrastructure. You write down the servers, tables, and permissions you need, and CloudFormation builds them the same way every time.",
    },
    {
      id: "dva3-b3-07",
      domain: "d3",
      lesson: "d3-start-pipeline",
      level: "beginner",
      prompt: "A new release is causing errors for users. The team decides to roll back. What does that mean?",
      options: [
        "Put the last working version back in place",
        "Delete the whole application and start again",
        "Turn off the servers until the bug is fixed",
        "Ask users to clear their browser cache",
      ],
      answer: [0],
      explanation: "Rolling back means returning to the version that worked before. It gets users out of trouble quickly while you fix the bug calmly.",
    },
    {
      id: "dva3-b3-08",
      domain: "d3",
      lesson: "d3-start-testing",
      level: "beginner",
      prompt: "An AI coding assistant writes ten unit tests for your function, and they all pass. What should you do before you rely on them?",
      options: [
        "Read each test and check it tests what the function is supposed to do",
        "Nothing, because tests that all pass prove the code is correct",
        "Delete them, because AI-written tests are never useful",
        "Run them once in production to be sure",
      ],
      answer: [0],
      explanation: "AI tools save time, but a test can pass while checking the wrong thing. A quick read makes sure each test matches what the function should really do.",
    },

    // ── Packaging ──
    {
      id: "d3-01",
      domain: "d3",
      lesson: "d3-packaging",
      prompt: "A Python Lambda function needs machine learning libraries that come to about 1.2 GB unzipped. How should the developer package the function?",
      options: ["As a container image stored in Amazon ECR", "As a .zip archive uploaded directly", "As five Lambda layers", "By downloading the libraries from S3 in the handler on every invocation"],
      answer: [0],
      explanation: "A .zip deployment, layers included, can be at most 250 MB unzipped, so 1.2 GB won't fit. A container image can be up to 10 GB.",
    },
    {
      id: "d3-02",
      domain: "d3",
      lesson: "d3-packaging",
      prompt: "Uploading a 70 MB .zip deployment package straight to a Lambda function fails. The package is 180 MB unzipped. What should the developer do?",
      options: ["Upload the package to Amazon S3 and point the function's code at the S3 object", "Split the function into two smaller functions that each fit under the upload limit", "Increase the function's memory", "Convert the code to a layer of 70 MB"],
      answer: [0],
      explanation: "A direct upload can be at most 50 MB zipped. A bigger package that's still under 250 MB unzipped can be deployed from S3 instead.",
    },
    {
      id: "d3-03",
      domain: "d3",
      lesson: "d3-packaging",
      prompt:
        "A team wants to turn on a new feature for 10% of users, raise that gradually, and roll back on its own if an error alarm fires. They don't want to redeploy code. Which service should they use?",
      options: ["AWS AppConfig feature flags with a gradual deployment strategy and a CloudWatch alarm", "Lambda environment variables that the team changes by hand for each group of users over time", "An S3 static file edited by hand", "AWS CloudShell"],
      answer: [0],
      explanation: "AppConfig rolls out settings and feature flags gradually, checks them with validators, and rolls back when an alarm fires. It does all this separately from your code deployments.",
    },
    {
      id: "d3-04",
      domain: "d3",
      lesson: "d3-packaging",
      prompt: "A CodeBuild project fails right away because it can't find buildspec.yml. The file is in a folder named ci/. What should the developer do?",
      options: [
        "Move buildspec.yml to the root of the source, or set the project's buildspec path to ci/buildspec.yml",
        "Rename the file to appspec.yml and move it into the ci/ folder so CodeBuild finds it on the next build",
        "Give CodeBuild administrator permissions",
        "Increase the build timeout",
      ],
      answer: [0],
      explanation: "CodeBuild looks for buildspec.yml at the root of the source unless you tell it otherwise. You can point it at another location in the project settings.",
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
      explanation: "Libraries have to be in the deployment package or in a layer. Installing them while the function runs is slow and can fail, and dev-only libraries just make the package bigger.",
    },
    {
      id: "d3-06",
      domain: "d3",
      lesson: "d3-packaging",
      prompt: "Tasks in an Amazon ECS service keep stopping with an out-of-memory error at peak load. What should the developer change?",
      options: ["Increase the memory value in the task definition and deploy a new revision", "Add more environment variables to the task definition to tune the container's memory", "Increase the container image size", "Switch the image tag to latest"],
      answer: [0],
      explanation: "You set CPU and memory for a task and its containers in the task definition. Create a new revision with more memory and roll it out to the service.",
    },
    {
      id: "d3-47",
      domain: "d3",
      lesson: "d3-packaging",
      prompt:
        "A REST API in API Gateway has v1 and v2 stages. Clients should call https://api.example.com/v1 and https://api.example.com/v2 instead of the default execute-api URLs. What should the developer set up?",
      options: [
        "A custom domain name with an ACM certificate, and base path mappings from v1 and v2 to the matching stages",
        "Two separate APIs with the same name, one for v1 and one for v2, each on its own endpoint",
        "Stage variables named v1 and v2",
        "A usage plan with two API keys",
      ],
      answer: [0],
      explanation: "Every stage has its own invoke URL. A custom domain name with base path mappings sends each path on your domain to a specific API and stage.",
    },
    // ── Containers ──
    {
      id: "d3-39",
      domain: "d3",
      lesson: "d3-containers",
      prompt:
        "A CI pipeline pushes a new image to an Amazon ECR repository on every commit, and storage costs keep rising. Nobody needs untagged images older than 7 days, or more than the 30 newest release images. What is the simplest fix?",
      options: [
        "Add an ECR lifecycle policy with rules that expire untagged images after 7 days and keep only the last 30 release-tagged images",
        "Write a Lambda function that lists and deletes images every night on an EventBridge schedule, keeping the newest ones by their push date",
        "Turn on tag immutability",
        "Move the images to Amazon S3 Glacier",
      ],
      answer: [0],
      explanation: "Lifecycle policy rules expire images by age or count, filtered by tag status or prefix, with no code for you to run. Tag immutability stops tags from being overwritten, but it doesn't delete anything.",
    },
    {
      id: "d3-40",
      domain: "d3",
      lesson: "d3-containers",
      type: "order",
      prompt: "Put the steps to publish a new container image to Amazon ECR in order.",
      items: [
        "Build the image from the Dockerfile",
        "Tag the image with the repository URI and a unique version tag",
        "Authenticate Docker to the registry with aws ecr get-login-password",
        "Push the image to the repository",
        "Update the task definition or manifest to reference the new tag",
      ],
      explanation: "You build and tag the image on your machine, log in to ECR, push, then point the deployment at the new tag. Logging in can also come first, as long as it happens before the push.",
    },
    {
      id: "d3-41",
      domain: "d3",
      lesson: "d3-containers",
      prompt:
        "An Amazon ECS service runs 4 tasks. During deployments it must never drop below 4 running tasks, and it may briefly run up to 8. How should the service's rolling update be configured?",
      options: [
        "minimumHealthyPercent 100 and maximumPercent 200",
        "minimumHealthyPercent 50 and maximumPercent 100 on the service",
        "minimumHealthyPercent 0 and maximumPercent 100",
        "Stop all tasks, then start the new revision",
      ],
      answer: [0],
      explanation: "minimumHealthyPercent sets the floor: 100% of 4 is 4. maximumPercent sets the ceiling: 200% of 4 is 8. So ECS starts new tasks before it stops old ones.",
    },
    {
      id: "d3-42",
      domain: "d3",
      lesson: "d3-containers",
      prompt:
        "A new ECS task definition revision has a bug that makes containers exit at start-up, and the rolling deployment keeps launching failing tasks. Which feature stops the deployment and puts the service back on the last working revision automatically?",
      options: ["The ECS deployment circuit breaker with rollback enabled", "A larger task memory value", "An ECR lifecycle policy", "Service Auto Scaling with a step scaling policy"],
      answer: [0],
      explanation: "The deployment circuit breaker notices that tasks never reach a steady state and marks the deployment as failed. With rollback turned on, it redeploys the last revision that completed.",
    },
    {
      id: "d3-43",
      domain: "d3",
      lesson: "d3-containers",
      prompt:
        "A team deploys a new image to Amazon EKS by updating a Deployment manifest. Pods take 30 seconds to warm up, and users get errors when traffic reaches pods that aren't ready. What should the developer add?",
      options: [
        "A readiness probe on the container, so pods receive traffic only after the probe passes during the rolling update",
        "A liveness probe that restarts each pod every 30 seconds until it reports healthy during the update",
        "A larger replica count with maxUnavailable set to 100%",
        "A CloudFront distribution in front of the cluster",
      ],
      answer: [0],
      explanation: "A readiness probe keeps a pod out of service until it's ready. With a RollingUpdate strategy (maxSurge and maxUnavailable), the old pods keep serving until the new ones are ready.",
    },
    {
      id: "d3-44",
      domain: "d3",
      lesson: "d3-containers",
      prompt: "A developer is writing an ECS task definition for the AWS Fargate launch type. Which settings are required? (Choose two.)",
      options: [
        "The awsvpc network mode",
        "Task-level CPU and memory values",
        "An EC2 instance type",
        "An Auto Scaling group for container instances",
        "The bridge network mode",
      ],
      answer: [0, 1],
      explanation: "Fargate gives each task its own network interface (awsvpc) and sizes it from the task-level CPU and memory. There are no instances or Auto Scaling groups for you to manage.",
    },
    // ── IaC ──
    {
      id: "d3-07",
      domain: "d3",
      lesson: "d3-iac",
      prompt: "Before updating a production CloudFormation stack, the team wants to see exactly which resources will be added, changed, or replaced. What should they use?",
      options: ["A change set", "Drift detection", "A stack policy", "The DependsOn attribute"],
      answer: [0],
      explanation: "A change set shows what an update will do, including any replacements, before you run it. Drift detection answers a different question: has anyone changed the live resources so they no longer match the template?",
    },
    {
      id: "d3-08",
      domain: "d3",
      lesson: "d3-iac",
      prompt: "A networking stack creates a VPC. A separate application stack needs the VPC's ID. How should the developer share it?",
      options: [
        "Export the VPC ID in the networking stack's Outputs and use Fn::ImportValue in the application stack",
        "Hard-code the VPC ID in the application template",
        "Put the VPC ID in a Mappings section of the networking stack and reference it from the application stack with Fn::FindInMap",
        "Use Fn::GetAtt across stacks",
      ],
      answer: [0],
      explanation: "To share a value between stacks, you export it as an output in one stack and read it with Fn::ImportValue in the other. Fn::GetAtt only works inside a single template.",
    },
    {
      id: "d3-09",
      domain: "d3",
      lesson: "d3-iac",
      type: "match",
      prompt: "Match each CloudFormation template section to what it's for.",
      pairs: [
        ["Parameters", "Values you supply when you create or update the stack"],
        ["Mappings", "Fixed lookup tables, such as an AMI ID for each Region"],
        ["Conditions", "Create resources only when an expression is true"],
        ["Resources", "The AWS resources to create; the only required section"],
        ["Outputs", "Values to display or export to other stacks"],
      ],
      explanation: "A template can also have Transform (used by SAM), Rules, Metadata, and Description sections. All of those are optional too.",
    },
    {
      id: "d3-11",
      domain: "d3",
      lesson: "d3-iac",
      type: "order",
      prompt: "Put the steps of a typical AWS SAM workflow for a new function in order.",
      items: ["sam init", "sam build", "sam local invoke", "sam deploy --guided"],
      explanation: "You start a project, build it, test it on your machine, then deploy. The first deploy is guided and saves your answers to samconfig.toml.",
    },
    {
      id: "d3-12",
      domain: "d3",
      lesson: "d3-iac",
      prompt: "During a stack update, one resource fails to update. What does CloudFormation do by default?",
      options: [
        "Rolls the stack back to its last known good configuration",
        "Leaves the stack half-updated and stops so you can fix it",
        "Deletes the entire stack",
        "Retries the update every hour until it succeeds",
      ],
      answer: [0],
      explanation: "By default CloudFormation rolls back a failed update, so you're never left half-way. The stack's events show the first failure and why it happened.",
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
      explanation: "A CDK app turns into a CloudFormation template, and cdk deploy deploys it as a stack. Constructs give you ready-made, higher-level building blocks.",
    },
    {
      id: "d3-14",
      domain: "d3",
      lesson: "d3-iac",
      prompt: "An Amazon RDS instance is defined in a CloudFormation stack. Its data must survive if the stack is deleted. What should the developer set on the resource?",
      options: ["DeletionPolicy: Retain or DeletionPolicy: Snapshot", "DependsOn", "UpdateReplacePolicy: Delete with DependsOn", "Condition: false"],
      answer: [0],
      explanation: "DeletionPolicy decides what happens to a resource when it leaves the stack or the stack is deleted. Retain keeps the resource, and Snapshot saves a final snapshot first.",
    },
    // ── Testing ──
    {
      id: "d3-15",
      domain: "d3",
      lesson: "d3-testing",
      prompt: "A developer wants to test a Lambda function locally with a realistic Amazon S3 put event before deploying. Which approach takes the LEAST effort?",
      options: [
        "Run sam local generate-event s3 put to create the payload, then sam local invoke with that event",
        "Deploy to production and upload a file",
        "Write the S3 event JSON by hand from memory and paste it into a test file next to the function code",
        "Use AWS CloudTrail to replay the event",
      ],
      answer: [0],
      explanation: "The SAM CLI can create sample events for many services. It then runs your function locally in a container that behaves like Lambda.",
    },
    {
      id: "d3-16",
      domain: "d3",
      lesson: "d3-testing",
      prompt: "A frontend team needs to start building against an API before the backend exists. How can the developer give them working endpoints quickly?",
      options: ["Configure API Gateway mock integrations that return sample responses", "Have the frontend team wait", "Point the API at a copy of the production database for now", "Use a Lambda authorizer"],
      answer: [0],
      explanation: "A mock integration returns a response you define in API Gateway, with no backend behind it. The frontend team can build against the real API shape straight away.",
    },
    {
      id: "d3-17",
      domain: "d3",
      lesson: "d3-testing",
      prompt:
        "A team deploys a SAM application to dev. Now they need the same template in a staging environment, with a different table name and memory size. What should they do?",
      options: [
        "Add a staging configuration environment to samconfig.toml (or pass --parameter-overrides) and run sam deploy --config-env staging",
        "Copy the template into a new staging folder, then edit the table name and memory size by hand in the copy before each deployment",
        "Deploy to dev and rename the resources",
        "Use one stack for both environments",
      ],
      answer: [0],
      explanation: "Template parameters plus SAM configuration environments let one template deploy as separate stacks. Each environment gets its own values.",
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
      explanation: "Each stage is its own deployment, with its own URL and settings. Stage variables then send each stage to the right backend.",
    },
    {
      id: "d3-19",
      domain: "d3",
      lesson: "d3-testing",
      prompt: "A developer wrote an Amazon EventBridge rule and wants to check that a sample event matches its pattern before deploying. What should the developer do?",
      options: ["Test the pattern against the sample event with the EventBridge TestEventPattern API or the console sandbox", "Deploy the rule to production and wait for real events to arrive, then check the target's logs", "Enable AWS CloudTrail", "Create an SQS FIFO queue"],
      answer: [0],
      explanation: "TestEventPattern tells you whether an event matches a pattern. That means you can test the pattern on its own, and in automated tests too.",
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
      explanation: "Mocks keep tests fast and repeatable. A provider's sandbox checks the real contract without real money. Test code should never change how production behaves.",
    },
    // ── AI tools for testing and CI/CD ──
    {
      id: "d3-21",
      domain: "d3",
      lesson: "d3-ai-testing",
      prompt:
        "A developer asks an AI coding assistant to write unit tests for an existing Lambda handler. Every generated test passes on the first run. What should the developer do next?",
      options: [
        "Review the assertions against the requirements and add cases for error paths, because tests that mirror the code can pass while the behavior is wrong",
        "Merge the tests unchanged, because tests that pass on the first run prove the handler does exactly what the requirements say it should",
        "Delete the older hand-written tests",
        "Run the tests only in production",
      ],
      answer: [0],
      explanation: "Generated tests add coverage fast, but they can simply restate what the code does today. Checking them against the requirements, and adding edge and failure cases, is what makes them useful.",
    },
    {
      id: "d3-45",
      domain: "d3",
      lesson: "d3-ai-testing",
      prompt: "A team wants to use AWS AI tools to cut the manual work in their testing. Which uses are appropriate? (Choose two.)",
      options: [
        "Generate a regression test that reproduces a fixed bug, and add it to the suite that runs in the pipeline",
        "Ask the assistant to analyze a failing test run's output and suggest likely causes",
        "Let the assistant delete failing tests so the pipeline goes green",
        "Use production customer data in prompts to make test data realistic",
        "Skip test review because the tests were generated",
      ],
      answer: [0, 1],
      explanation: "AI is good at writing regression tests, finding coverage gaps, and reading test results. It shouldn't hide failures, see real customer data, or replace your review.",
    },
    {
      id: "d3-46",
      domain: "d3",
      lesson: "d3-ai-testing",
      prompt:
        "A pipeline deploys to staging and then to production. The team wants an AI tool to check the staging deployment and sum up the risk for whoever approves production. Which design is MOST appropriate?",
      options: [
        "Run the AI tool in a CodeBuild step after the staging deploy with a least-privilege role, and keep a manual approval action before production that shows its summary",
        "Give the AI tool administrator access and let it deploy to production by itself whenever it judges that the change is safe enough to ship",
        "Remove the staging stage so the AI tool checks production directly",
        "Ask the AI tool to approve its own pull requests",
      ],
      answer: [0],
      explanation: "AI can automate checks after a deploy and prepare information for an approval. The approval itself and any broad permissions stay with people, and the tool gets only what its step needs.",
    },
    // ── Versions and aliases ──
    {
      id: "d3-22",
      domain: "d3",
      lesson: "d3-aliases",
      prompt:
        "API Gateway should call a stable reference to a Lambda function. The team wants to point that reference at a new version without changing the API configuration. What should the integration use?",
      options: ["The ARN of a Lambda alias such as prod", "The ARN of $LATEST", "The ARN of a specific numbered version", "The function's CloudWatch log group"],
      answer: [0],
      explanation: "An alias is a pointer you can move to any version. A numbered version never changes, and $LATEST changes every time someone updates the code.",
    },
    {
      id: "d3-23",
      domain: "d3",
      lesson: "d3-aliases",
      prompt: "A team wants 10% of production calls to run a new Lambda version, while 90% stay on the current one. What should they configure?",
      options: ["Weighted routing on the prod alias, with 10% going to the new version", "Two functions behind a load balancer", "Reserved concurrency of 10% on the new version of the function", "A new API Gateway stage"],
      answer: [0],
      explanation: "An alias can split traffic between two versions by weight. CodeDeploy can change those weights for you over time.",
    },
    {
      id: "d3-24",
      domain: "d3",
      lesson: "d3-aliases",
      prompt:
        "With AWS SAM, a team wants each deployment to send 10% of traffic to the new version for 5 minutes, then the rest. It should roll back on its own if an error alarm fires. What should they add to the function?",
      options: [
        "AutoPublishAlias and a DeploymentPreference of type Canary10Percent5Minutes with the alarm listed",
        "A Lambda layer that holds the new version alongside the old one and switches the traffic over time",
        "Provisioned concurrency",
        "An SQS dead-letter queue",
      ],
      answer: [0],
      explanation: "SAM publishes a new version, updates the alias, and has CodeDeploy shift the traffic. The alarms and hook functions you list can trigger a rollback.",
    },
    {
      id: "d3-25",
      domain: "d3",
      lesson: "d3-aliases",
      prompt:
        "One API Gateway REST API has dev and prod stages. Each stage must call the matching Lambda alias, without copying the API definition. How should the integration be set up?",
      options: [
        "Use a stage variable in the integration's function ARN, such as function:${stageVariables.alias}, and grant invoke permission for each alias",
        "Create two separate APIs, one for each stage, and point each one at its own alias of the function, keeping both API definitions in sync by hand",
        "Use $LATEST in both stages",
        "Use a usage plan per stage",
      ],
      answer: [0],
      explanation: "API Gateway fills in stage variables at runtime, separately for each stage. Because the ARN isn't fixed, you have to grant lambda:InvokeFunction permission on each alias yourself.",
    },
    {
      id: "d3-27",
      domain: "d3",
      lesson: "d3-aliases",
      prompt:
        "Integration tests passed against a container image tagged latest. Later, production pulled a different image with the same tag. How should the team make sure every environment uses the approved image?",
      options: [
        "Reference an immutable tag, such as the commit SHA, or the image digest, and enable tag immutability in Amazon ECR",
        "Keep using the latest tag and redeploy more often, so every environment pulls the newest image soon after each push",
        "Delete old images from the repository every day",
        "Push images to a public repository",
      ],
      answer: [0],
      explanation: "A normal tag can be moved to a different image at any time. A unique tag that can't move, or the image digest, guarantees every environment runs exactly what you tested.",
    },
    // ── Strategies ──
    {
      id: "d3-28",
      domain: "d3",
      lesson: "d3-strategies",
      prompt:
        "An Elastic Beanstalk production environment must keep full capacity during deployments. A failed deployment must be undone quickly, with little impact. Which deployment policy fits BEST?",
      options: ["Immutable", "All at once", "Rolling", "Rolling with additional batch"],
      answer: [0],
      explanation: "Immutable starts the new version on fresh instances in a temporary Auto Scaling group. If they fail their health checks, Beanstalk terminates them and the original instances carry on serving.",
    },
    {
      id: "d3-30",
      domain: "d3",
      lesson: "d3-strategies",
      prompt: "How can a developer do a blue/green deployment with AWS Elastic Beanstalk?",
      options: [
        "Clone the environment, deploy the new version to the clone, test it, then swap environment URLs",
        "Use the rolling deployment policy with a batch size of 100%, so all the instances switch at once",
        "Change the instance type",
        "Edit .ebextensions on the running instances",
      ],
      answer: [0],
      explanation: "Swapping the environment URLs (a CNAME swap) sends traffic to the new environment. To roll back, you swap them back.",
    },
    {
      id: "d3-31",
      domain: "d3",
      lesson: "d3-strategies",
      prompt: "Which file tells AWS CodeDeploy where to copy files on EC2 instances, and which scripts to run at each lifecycle event?",
      options: ["appspec.yml", "buildspec.yml", "template.yaml", "Dockerfile"],
      answer: [0],
      explanation: "The AppSpec file, appspec.yml at the root of the revision, maps files and lifecycle hooks. buildspec.yml belongs to CodeBuild.",
    },
    {
      id: "d3-32",
      domain: "d3",
      lesson: "d3-strategies",
      type: "order",
      prompt: "Put these CodeDeploy lifecycle hooks for an EC2 in-place deployment in the order they run.",
      items: ["ApplicationStop", "BeforeInstall", "AfterInstall", "ApplicationStart", "ValidateService"],
      explanation: "CodeDeploy stops the old app, gets ready, copies the files in, configures them, starts the app, then checks it works. If there's a load balancer, its hooks wrap around this sequence.",
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
      explanation: "CodeDeploy rolls back by redeploying the last revision that worked, as a new deployment. That can happen when a deployment fails or when an alarm you're watching fires.",
    },
    // ── CI/CD ──
    {
      id: "d3-34",
      domain: "d3",
      lesson: "d3-cicd",
      prompt: "Every push to the main branch must build, test, and deploy an application through several stages, with nobody stepping in. Which service runs this release workflow?",
      options: ["AWS CodePipeline", "AWS CodeArtifact", "AWS CloudShell", "Amazon ECR"],
      answer: [0],
      explanation: "CodePipeline models a release as stages, such as source, build, test, and deploy, and runs them on every change. Along the way it calls CodeBuild, CodeDeploy, CloudFormation, and other services.",
    },
    {
      id: "d3-35",
      domain: "d3",
      lesson: "d3-cicd",
      prompt: "A team lead must sign off before a pipeline deploys to production. What should the developer add to the pipeline?",
      options: ["A manual approval action before the production deploy stage", "A longer CodeBuild timeout", "A Lambda layer that checks for sign-off from the team lead", "A second source action"],
      answer: [0],
      explanation: "A manual approval action pauses the pipeline until an authorized person approves or rejects. It can notify the approvers through Amazon SNS.",
    },
    {
      id: "d3-36",
      domain: "d3",
      lesson: "d3-cicd",
      prompt: "Builds need private npm packages published by internal teams. They should also cache public packages from npmjs.com. Which service fits?",
      options: ["AWS CodeArtifact with an upstream repository connected to the public npm registry", "Amazon ECR, with a pull-through cache rule set up for the public npmjs.com registry", "Amazon S3 static website hosting", "AWS AppConfig"],
      answer: [0],
      explanation: "CodeArtifact hosts private package repositories. Through an external connection, it can also fetch public packages and keep copies of them.",
    },
    {
      id: "d3-38",
      domain: "d3",
      lesson: "d3-cicd",
      prompt: "A team wants production deployments to run only for release tags such as v1.4.0. Every commit to main should still deploy to test. How should the production pipeline start?",
      options: [
        "Configure a CodePipeline trigger that filters on Git tags matching the release pattern",
        "Deploy every commit to production",
        "Have a developer copy files to production by hand",
        "Run the production pipeline on a fixed hourly schedule from the main branch",
      ],
      answer: [0],
      explanation: "Pipeline triggers can filter on branches and Git tags. Tagging a release is then what sends it to production.",
    },
  ],

  cards: [
    { id: "s-cfn", domain: "d3", kind: "service", term: "AWS CloudFormation", definition: "Builds AWS resources from a template and manages them together as a stack." },
    { id: "s-sam", domain: "d3", kind: "service", term: "AWS SAM", definition: "A short way to write serverless CloudFormation, plus a CLI for testing on your own machine." },
    { id: "s-cdk", domain: "d3", kind: "service", term: "AWS CDK", definition: "Lets you define infrastructure in a programming language. It turns into a CloudFormation template." },
    { id: "s-codepipeline", domain: "d3", kind: "service", term: "AWS CodePipeline", definition: "Runs a release through its source, build, test, and deploy stages." },
    { id: "s-codebuild", domain: "d3", kind: "service", term: "AWS CodeBuild", definition: "A managed service that builds and tests your code, following buildspec.yml." },
    { id: "s-codedeploy", domain: "d3", kind: "service", term: "AWS CodeDeploy", definition: "Deploys to EC2, on-premises servers, Lambda, and ECS, and can roll back." },
    { id: "s-codeartifact", domain: "d3", kind: "service", term: "AWS CodeArtifact", definition: "Private package repositories for npm, PyPI, Maven, and more." },
    { id: "s-beanstalk", domain: "d3", kind: "service", term: "AWS Elastic Beanstalk", definition: "You upload code, and it sets up and deploys the whole environment for you." },
    { id: "s-appconfig", domain: "d3", kind: "service", term: "AWS AppConfig", definition: "Rolls out settings and feature flags safely, a little at a time." },
    { id: "s-ecr", domain: "d3", kind: "service", term: "Amazon ECR", definition: "A private registry for your container images." },
    { id: "s-ecs", domain: "d3", kind: "service", term: "Amazon ECS", definition: "Runs containers as tasks and services, on EC2 or Fargate." },
    { id: "s-amplify", domain: "d3", kind: "service", term: "AWS Amplify", definition: "Builds and hosts web apps, with a separate environment for each branch." },
    { id: "c-changeset", domain: "d3", kind: "concept", term: "Change set", definition: "A preview of what a stack update will change, before you run it." },
    { id: "c-alias", domain: "d3", kind: "concept", term: "Lambda alias", definition: "A name that points at a version. It can split traffic between two versions." },
    { id: "c-stagevar", domain: "d3", kind: "concept", term: "Stage variable", definition: "A value set per API Gateway stage, such as which Lambda alias to call." },
    { id: "c-canary", domain: "d3", kind: "concept", term: "Canary deployment", definition: "Send a small share of traffic to the new version first, then the rest." },
    { id: "c-bluegreen", domain: "d3", kind: "concept", term: "Blue/green deployment", definition: "Build a new environment next to the old one, then switch traffic over." },
    { id: "c-appspec", domain: "d3", kind: "concept", term: "appspec.yml", definition: "The CodeDeploy file that maps files and lifecycle hooks." },
    { id: "s-eks", domain: "d3", kind: "service", term: "Amazon EKS", definition: "Managed Kubernetes. You deploy with manifests and rolling updates." },
    { id: "s-fargate", domain: "d3", kind: "service", term: "AWS Fargate", definition: "Runs ECS and EKS tasks with no servers to manage. Needs awsvpc and task-level CPU and memory." },
    { id: "s-copilot", domain: "d3", kind: "service", term: "AWS Copilot", definition: "A CLI that builds, deploys, and manages container apps across named environments." },
    { id: "c-ecrlifecycle", domain: "d3", kind: "concept", term: "ECR lifecycle policy", definition: "Rules that delete old images by age or count." },
    { id: "c-ecsrolling", domain: "d3", kind: "concept", term: "ECS rolling update", definition: "Replaces tasks a few at a time, within minimumHealthyPercent and maximumPercent." },
    { id: "c-circuitbreaker", domain: "d3", kind: "concept", term: "ECS deployment circuit breaker", definition: "Stops a failing deployment and can roll back to the last good revision." },
  ],
});
