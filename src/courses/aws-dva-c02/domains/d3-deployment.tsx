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
    summary:
      "How you package code, describe infrastructure with CloudFormation, SAM, and CDK, test safely, and release new versions with Lambda aliases, deployment strategies, and CI/CD pipelines.",
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
    // ── Start here (beginner) ──
    {
      id: "d3-start-deploying",
      level: "beginner",
      task: "3.1",
      title: "What deploying means",
      check: ["dva2-b3-01", "dva2-b3-02"],
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
      check: ["dva2-b3-03", "dva2-b3-04"],
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
        "AI assistants such as Amazon Q Developer can draft tests for you. Read every check they write before you trust it.",
      ],
      tip: "Tests should never touch production systems or real money. Look for answers that use a mock, a sandbox, or a separate dev environment.",
    },
    {
      id: "d3-start-pipeline",
      level: "beginner",
      task: "3.4",
      title: "Automating releases with CI/CD",
      check: ["dva2-b3-05", "dva2-b3-06"],
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
      task: "3.1 · 3.4",
      title: "Packaging your code and settings",
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
      ],
      tip: "If your libraries come to more than 250 MB unzipped, package the function as a container image instead.",
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
      ],
      tip: "If a question asks how to see what will change before you update production, the answer is a change set.",
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
              { icon: "🤖", title: "Amazon Q Developer", text: "Writes unit tests for your existing code, right from your editor.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Integration tests check that your code works with other systems. Point them at a mock or the provider's sandbox, never at a live production system.",
        "Give dev and test their own API Gateway stage and Lambda alias. Then your experiments never touch real users' traffic.",
        "Deploy the same SAM template to staging with different parameters. One template beats several copies that slowly drift apart.",
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
      task: "3.4",
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
      task: "3.4",
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
      id: "dva2-b3-01",
      domain: "d3",
      lesson: "d3-start-deploying",
      level: "beginner",
      prompt: "You've finished a new feature on your laptop. What does it mean to deploy it?",
      options: [
        "Copy the finished code onto servers in the cloud so users can reach it",
        "Write the first draft of the code",
        "Delete the old code from your laptop",
        "Email the code to every user",
      ],
      answer: [0],
      explanation: "Deploying is the step that moves your code from your own machine to servers your users can reach. Until then, only you can run it.",
    },
    {
      id: "dva2-b3-02",
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
      id: "dva2-b3-03",
      domain: "d3",
      lesson: "d3-start-testing",
      level: "beginner",
      prompt: "A Lambda function runs whenever a file lands in an S3 bucket. What is a test event for this function?",
      options: [
        "A sample JSON message that looks like the real S3 notification, so you can run the function on demand",
        "A CloudWatch alarm that fires when the function fails",
        "A user who reports bugs by email",
        "A second S3 bucket that stores test results",
      ],
      answer: [0],
      explanation: "Lambda functions are started by events, and each event is a JSON message. A test event is a realistic copy of that message, so you don't have to upload a real file every time you want to try your code.",
    },
    {
      id: "dva2-b3-04",
      domain: "d3",
      lesson: "d3-start-testing",
      level: "beginner",
      prompt: "Your code charges customers through an outside payment service. In your automated tests, what's the safest way to handle that call?",
      options: [
        "Replace the payment service with a mock that returns a fake, predictable answer",
        "Charge a real card on every test run",
        "Skip testing any code that touches payments",
        "Run the tests against the production payment service at night",
      ],
      answer: [0],
      explanation: "A mock pretends to be the payment service and always answers the same way. Your tests stay fast and repeatable, and nobody gets charged by accident.",
    },
    {
      id: "dva2-b3-05",
      domain: "d3",
      lesson: "d3-start-pipeline",
      level: "beginner",
      prompt: "Which AWS service runs a whole release, from a code commit through build, test, and deploy?",
      options: ["AWS CodePipeline", "Amazon S3", "AWS CodeArtifact", "Amazon CloudWatch"],
      answer: [0],
      explanation: "CodePipeline is the conveyor belt that moves each change through its stages. CodeArtifact only stores software packages, and S3 and CloudWatch handle storage and monitoring.",
    },
    {
      id: "dva2-b3-06",
      domain: "d3",
      lesson: "d3-start-pipeline",
      level: "beginner",
      prompt: "What is an AWS CloudFormation template?",
      options: [
        "A text file that describes the AWS resources you want, so CloudFormation can build them for you",
        "A screenshot of how the AWS console looked when you set things up",
        "A log file that lists errors from your app",
        "A monthly bill for your AWS account",
      ],
      answer: [0],
      explanation: "A template is like a recipe for your infrastructure. You write down the servers, tables, and permissions you need, and CloudFormation builds them the same way every time.",
    },
    {
      id: "dva2-b3-07",
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
      options: ["Upload the package to Amazon S3 and point the function's code at the S3 object", "Split the function into two smaller functions", "Increase the function's memory", "Convert the code to a layer of 70 MB"],
      answer: [0],
      explanation: "A direct upload can be at most 50 MB zipped. A bigger package that's still under 250 MB unzipped can be deployed from S3 instead.",
    },
    {
      id: "d3-03",
      domain: "d3",
      lesson: "d3-packaging",
      prompt:
        "A team wants to turn on a new feature for 10% of users, raise that gradually, and roll back on its own if an error alarm fires. They don't want to redeploy code. Which service should they use?",
      options: ["AWS AppConfig feature flags with a gradual deployment strategy and a CloudWatch alarm", "Lambda environment variables", "An S3 static file edited by hand", "AWS CloudShell"],
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
        "Rename the file to appspec.yml",
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
      options: ["Increase the memory value in the task definition and deploy a new revision", "Add more environment variables", "Increase the container image size", "Switch the image tag to latest"],
      answer: [0],
      explanation: "You set CPU and memory for a task and its containers in the task definition. Create a new revision with more memory and roll it out to the service.",
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
        "Use a Mappings section in the networking stack",
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
      id: "d3-10",
      domain: "d3",
      lesson: "d3-iac",
      prompt: "Which line tells CloudFormation to treat a template as an AWS SAM template?",
      options: ["Transform: AWS::Serverless-2016-10-31", "AWSTemplateFormatVersion: 2010-09-09", "Resources: AWS::Serverless", "Mappings: SAM"],
      answer: [0],
      explanation: "The SAM transform expands the short AWS::Serverless::* resources into standard CloudFormation resources when you deploy.",
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
        "Leaves the stack half-updated and stops",
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
      options: ["DeletionPolicy: Retain or DeletionPolicy: Snapshot", "DependsOn", "UpdateReplacePolicy: Delete", "Condition: false"],
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
        "Write the event JSON by hand from memory",
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
      options: ["Configure API Gateway mock integrations that return sample responses", "Have the frontend team wait", "Point the API at the production database", "Use a Lambda authorizer"],
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
        "Copy the template and edit the values by hand",
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
      options: ["Test the pattern against the sample event with the EventBridge TestEventPattern API or the console sandbox", "Deploy to production and wait for real events", "Enable AWS CloudTrail", "Create an SQS FIFO queue"],
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
    {
      id: "d3-21",
      domain: "d3",
      lesson: "d3-testing",
      prompt: "A developer wants AI-generated unit tests for an existing Lambda handler, created from inside the editor. Which tool should the developer use?",
      options: ["Amazon Q Developer", "AWS CodeDeploy", "AWS AppConfig", "Amazon Inspector"],
      answer: [0],
      explanation: "Amazon Q Developer can write unit tests for the code you select. You then review them and run them.",
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
      options: ["Weighted routing on the prod alias, with 10% going to the new version", "Two functions behind a load balancer", "Reserved concurrency of 10%", "A new API Gateway stage"],
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
        "A Lambda layer",
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
        "Create two separate APIs",
        "Use $LATEST in both stages",
        "Use a usage plan per stage",
      ],
      answer: [0],
      explanation: "API Gateway fills in stage variables at runtime, separately for each stage. Because the ARN isn't fixed, you have to grant lambda:InvokeFunction permission on each alias yourself.",
    },
    {
      id: "d3-26",
      domain: "d3",
      lesson: "d3-aliases",
      type: "match",
      prompt: "Match each Lambda traffic-shifting deployment preference to how it behaves.",
      pairs: [
        ["Canary10Percent5Minutes", "10% of traffic for 5 minutes, then the remaining 90% at once"],
        ["Linear10PercentEvery1Minute", "Another 10% of traffic every minute until all traffic shifts"],
        ["AllAtOnce", "All traffic moves to the new version immediately"],
      ],
      explanation: "Canary moves traffic in two steps, linear in equal steps, and all-at-once in a single step.",
    },
    {
      id: "d3-27",
      domain: "d3",
      lesson: "d3-aliases",
      prompt:
        "Integration tests passed against a container image tagged latest. Later, production pulled a different image with the same tag. How should the team make sure every environment uses the approved image?",
      options: [
        "Reference an immutable tag, such as the commit SHA, or the image digest, and enable tag immutability in Amazon ECR",
        "Keep using latest and redeploy more often",
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
      id: "d3-29",
      domain: "d3",
      lesson: "d3-strategies",
      prompt: "A developer needs the fastest possible deployment to an Elastic Beanstalk development environment. A short outage is fine. Which policy should they choose?",
      options: ["All at once", "Immutable", "Rolling with additional batch", "Blue/green with a URL swap"],
      answer: [0],
      explanation: "All at once deploys to every instance at the same time. It's the fastest, but the app is down briefly, and a failure hits everything.",
    },
    {
      id: "d3-30",
      domain: "d3",
      lesson: "d3-strategies",
      prompt: "How can a developer do a blue/green deployment with AWS Elastic Beanstalk?",
      options: [
        "Clone the environment, deploy the new version to the clone, test it, then swap environment URLs",
        "Use the rolling policy with a batch size of 100%",
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
      options: ["A manual approval action before the production deploy stage", "A longer CodeBuild timeout", "A Lambda layer", "A second source action"],
      answer: [0],
      explanation: "A manual approval action pauses the pipeline until an authorized person approves or rejects. It can notify the approvers through Amazon SNS.",
    },
    {
      id: "d3-36",
      domain: "d3",
      lesson: "d3-cicd",
      prompt: "Builds need private npm packages published by internal teams. They should also cache public packages from npmjs.com. Which service fits?",
      options: ["AWS CodeArtifact with an upstream repository connected to the public npm registry", "Amazon ECR", "Amazon S3 static website hosting", "AWS AppConfig"],
      answer: [0],
      explanation: "CodeArtifact hosts private package repositories. Through an external connection, it can also fetch public packages and keep copies of them.",
    },
    {
      id: "d3-37",
      domain: "d3",
      lesson: "d3-cicd",
      prompt: "Which of these are real phases in a CodeBuild buildspec.yml file? (Choose two.)",
      options: ["pre_build", "post_build", "ApplicationStart", "BeforeAllowTraffic", "ValidateService"],
      answer: [0, 1],
      explanation: "The buildspec phases are install, pre_build, build, and post_build. The other three are CodeDeploy AppSpec hooks.",
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
        "Run the production pipeline on a fixed hourly schedule",
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
    { id: "c-immutable", domain: "d3", kind: "concept", term: "Immutable deployment", definition: "Put the new version on fresh instances. To roll back, terminate them." },
    { id: "c-appspec", domain: "d3", kind: "concept", term: "appspec.yml", definition: "The CodeDeploy file that maps files and lifecycle hooks." },
    { id: "c-buildspec", domain: "d3", kind: "concept", term: "buildspec.yml", definition: "The CodeBuild file with the install, pre_build, build, and post_build phases." },
  ],
});
