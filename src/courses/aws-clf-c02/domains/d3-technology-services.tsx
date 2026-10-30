import { Flow, Ladder, Layers, ServiceRows, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { MultiAzLab, VpcDiagram } from "../visuals";

/**
 * Domain 3: Cloud Technology and Services (34% of scored content).
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Cloud Technology and Services",
    world: "Service Metropolis",
    weight: 34,
    emoji: "🏙️",
    color: "#a78bfa",
    summary: "How you work with AWS, where its data centers are, and the main services you'll meet: servers, databases, networks, storage, AI and analytics.",
  },

  tasks: [
    {
      id: "3.1",
      title: "Define methods of deploying and operating in the AWS Cloud",
      covers: [
        "Ways to access AWS: the Management Console, programmatic access (APIs, SDKs, CLI), and infrastructure as code",
        "One-time operations compared with repeatable processes",
        "Deployment models: cloud, hybrid, on-premises",
      ],
    },
    {
      id: "3.2",
      title: "Define the AWS global infrastructure",
      covers: [
        "Regions, Availability Zones, and edge locations, and how they relate",
        "High availability with multiple Availability Zones; AZs don't share single points of failure",
        "When to use multiple Regions: disaster recovery, business continuity, low latency, data sovereignty",
      ],
    },
    {
      id: "3.3",
      title: "Identify AWS compute services",
      covers: [
        "EC2 instance types (for example, compute optimized, storage optimized)",
        "Container options (Amazon ECS, Amazon EKS) and serverless compute (AWS Fargate, AWS Lambda)",
        "Auto scaling for elasticity, and the purpose of load balancers",
      ],
    },
    {
      id: "3.4",
      title: "Identify AWS database services",
      covers: [
        "EC2-hosted databases compared with AWS managed databases",
        "Relational (Amazon RDS, Amazon Aurora), NoSQL (Amazon DynamoDB), and in-memory (Amazon ElastiCache) databases",
        "Database migration tools (AWS DMS, AWS SCT)",
      ],
    },
    {
      id: "3.5",
      title: "Identify AWS network services",
      covers: [
        "VPC components: subnets and gateways",
        "VPC security: network ACLs, security groups, Amazon Inspector",
        "The purpose of Amazon Route 53",
        "Connectivity options: AWS VPN, AWS Direct Connect",
      ],
    },
    {
      id: "3.6",
      title: "Identify AWS storage services",
      covers: [
        "Object storage and the Amazon S3 storage classes",
        "Block storage (Amazon EBS, instance store) and file services (Amazon EFS, Amazon FSx)",
        "Cached file systems (AWS Storage Gateway), lifecycle policies, and AWS Backup",
      ],
    },
    {
      id: "3.7",
      title: "Identify AWS AI/ML services and analytics services",
      covers: ["AI/ML services and the tasks they do (for example, Amazon SageMaker AI, Amazon Lex)", "Analytics services (for example, Amazon Athena, Amazon Kinesis, AWS Glue, Amazon Quick)"],
    },
    {
      id: "3.8",
      title: "Identify services from other in-scope AWS service categories",
      covers: [
        "Application integration: Amazon EventBridge, Amazon SNS, Amazon SQS",
        "Business applications: Amazon Connect, Amazon SES",
        "Developer tools: AWS CodeBuild, AWS CodePipeline, AWS X-Ray",
        "End-user computing: Amazon AppStream 2.0, Amazon WorkSpaces, Amazon WorkSpaces Secure Browser",
        "Frontend web and mobile (AWS Amplify) and IoT (AWS IoT Core)",
      ],
    },
  ],

  lessons: [
    {
      id: "d3-start-building-blocks",
      level: "beginner",
      check: ["clf-b3-01", "clf-b3-02"],
      task: "3.3",
      title: "The four building blocks",
      visual: (
        <Tiles
          cols={4}
          tiles={[
            { icon: "🧑‍🍳", title: "Compute", text: "The cooks. Computers that run your code. On AWS: Amazon EC2.", color: "#38bdf8" },
            { icon: "🥫", title: "Storage", text: "The pantry. A place to keep files. On AWS: Amazon S3.", color: "#f59e0b" },
            { icon: "📒", title: "Databases", text: "The order book. Organized records you can search. On AWS: Amazon RDS.", color: "#a78bfa" },
            { icon: "🚪", title: "Networking", text: "The doors and corridors. How things connect. On AWS: Amazon VPC.", color: "#34d399" },
          ]}
        />
      ),
      points: [
        "AWS has hundreds of services, but most apps are built from four kinds of building block: compute, storage, databases and networking.",
        "Picture a restaurant kitchen. The cooks do the work (**compute**), the pantry holds ingredients (**storage**), and the order book keeps track of every order (**database**).",
        "The doors and corridors decide who can get in and how food reaches the tables. That's **networking**.",
        "Once you know which block a service belongs to, its name is much less scary.",
      ],
      tip: "When you meet a new AWS service, first ask: is it compute, storage, a database or networking? That narrows the choices fast.",
    },
    {
      id: "d3-start-first-server-and-bucket",
      level: "beginner",
      check: ["clf-b3-03", "clf-b3-04"],
      task: "3.6",
      title: "Your first server and your first bucket",
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🖥️", title: "Amazon EC2", text: "A virtual computer you rent by the second. You pick its size and what runs on it.", color: "#38bdf8" },
            { icon: "🪣", title: "Amazon S3", text: "A storage bucket for files of any kind. Put files in, take them out, from anywhere.", color: "#f59e0b" },
          ]}
        />
      ),
      points: [
        "**Amazon EC2** gives you a virtual server, called an **instance**. It's like renting a computer that lives in an AWS data center.",
        "You choose how big it is, start it in a few minutes, and pay only while it's running.",
        "**Amazon S3** stores files, which AWS calls **objects**, inside containers called **buckets**. Think of an online storage locker with no size limit.",
        "S3 is great for photos, backups, videos and website files. EC2 is for running programs.",
      ],
      tip: "If the question is about running a program, think EC2. If it's about keeping files, think S3.",
    },
    {
      id: "d3-start-talking-to-aws",
      level: "beginner",
      check: ["clf-b3-05", "clf-b3-06"],
      task: "3.1",
      title: "Three ways to talk to AWS",
      visual: (
        <Flow
          color="#a78bfa"
          steps={[
            { icon: "🖱️", label: "Click", sub: "The AWS Management Console, a website" },
            { icon: "⌨️", label: "Type", sub: "The AWS CLI, commands in a terminal" },
            { icon: "🧑‍💻", label: "Code", sub: "An AWS SDK, inside your own app" },
          ]}
        />
      ),
      points: [
        "You can use AWS in three main ways. Under the hood, they all send the same kind of request to AWS.",
        "The **AWS Management Console** is a website where you click buttons. It's the easiest place to start and to look around.",
        "The **AWS CLI** (command line interface) lets you type commands in a terminal. It's handy for repeating a task without clicking.",
        "An **SDK** (software development kit) lets your own program call AWS, for example to upload a file to S3.",
      ],
      tip: "Learning or doing something once? Use the console. Doing it again and again? Use the CLI or code.",
    },
    {
      id: "d3-access",
      check: ["d3-01", "d3-05"],
      task: "3.1",
      title: "Ways to work with AWS",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "🖱️", title: "Management Console", text: "A website you click through. Good for learning and one-off jobs.", color: "#a78bfa" },
              { icon: "⌨️", title: "AWS CLI", text: "Commands and scripts you run in a terminal.", color: "#a78bfa" },
              { icon: "🧑‍💻", title: "SDKs and APIs", text: "Call AWS from your app's code, in your own language.", color: "#a78bfa" },
              { icon: "📜", title: "Infrastructure as code", text: "AWS CloudFormation templates that build the same setup every time, kept under version control.", color: "#a78bfa" },
            ]}
          />
          <Layers
            layers={[
              { name: "Cloud", color: "#38bdf8", items: ["Everything runs on AWS"] },
              { name: "Hybrid", color: "#a78bfa", items: ["Your own data center linked to AWS", "AWS Outposts", "Direct Connect or a VPN"] },
              { name: "On-premises (private cloud)", color: "#94a3b8", items: ["Everything in your own data center"] },
            ]}
          />
        </div>
      ),
      points: [
        "For a one-off job or for exploring, use the console. For something you'll repeat across environments, use scripts or **infrastructure as code** (IaC), where a text file describes what to build.",
        "Every console click and every CLI command ends up calling the same AWS **APIs**, the programmatic doors into each service.",
        "A **hybrid** setup mixes your own data center with AWS. **AWS Outposts** puts real AWS hardware and services inside your building, so both sides work the same way.",
      ],
      tip: "If the same environment must be built in many accounts or Regions, the same way each time, the answer is AWS CloudFormation.",
    },
    {
      id: "d3-global",
      check: ["d3-07", "d3-08"],
      task: "3.2",
      title: "Regions, Availability Zones, and edge locations",
      visual: <MultiAzLab />,
      points: [
        "A **Region** is a separate part of the world, such as Ireland or Tokyo, with several Availability Zones in it.",
        "An **Availability Zone** (AZ) is one or more data centers with their own backup power and network links. AZs are kept apart so one problem can't knock out two of them.",
        "Use several AZs to keep running through a local failure. Use several Regions for disaster recovery, to be closer to distant users, or when data must stay in one country (**data sovereignty**).",
        "**Edge locations** are small sites in many more cities than there are Regions. CloudFront and Route 53 use them to answer users quickly from nearby.",
      ],
      tip: "To survive a data center failure, use more than one AZ. To survive a disaster in a whole Region, or to keep data in a country, the answer is about which Regions you choose.",
    },
    {
      id: "d3-compute",
      check: ["d3-13", "d3-16"],
      task: "3.3",
      title: "Compute: instances, containers, serverless",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "⚖️", title: "General purpose", text: "A balanced mix. Good for web servers and code repositories.", color: "#38bdf8" },
              { icon: "🧮", title: "Compute optimized", text: "Fast processors for batch jobs, scientific computing and game servers.", color: "#38bdf8" },
              { icon: "🧠", title: "Memory optimized", text: "Lots of memory, for working on big data sets, such as in-memory databases.", color: "#38bdf8" },
              { icon: "💽", title: "Storage optimized", text: "Very fast reading and writing on local disks, for data warehousing.", color: "#38bdf8" },
            ]}
          />
          <Layers
            layers={[
              { name: "Virtual servers", color: "#38bdf8", items: ["Amazon EC2", "Amazon Lightsail", "AWS Elastic Beanstalk", "AWS Batch"] },
              { name: "Containers", color: "#a78bfa", items: ["Amazon ECS", "Amazon EKS (Kubernetes)", "Amazon ECR (images)"] },
              { name: "Serverless", color: "#34d399", items: ["AWS Lambda", "AWS Fargate"] },
            ]}
          />
          <Flow
            color="#f59e0b"
            steps={[
              { icon: "👥", label: "Users", sub: "Requests come in" },
              { icon: "⚖️", label: "Elastic Load Balancing", sub: "Shares requests out across healthy servers in several AZs" },
              { icon: "📈", label: "EC2 Auto Scaling group", sub: "Adds or removes servers as demand changes" },
            ]}
          />
        </div>
      ),
      points: [
        "**AWS Lambda** runs your code when something happens, such as a file landing in S3. There are no servers to manage, and you pay per request and for the time your code runs.",
        "A **container** packages an app with everything it needs to run. **Fargate** runs containers for ECS or EKS with no servers to look after. EKS is managed Kubernetes, and ECS is AWS's own container service.",
        "**Auto Scaling** adds and removes servers as demand changes. A **load balancer** shares incoming traffic between servers and skips any that are unhealthy.",
        "**Elastic Beanstalk** takes your code and handles the servers, load balancing and scaling for you. **Lightsail** gives you simple servers for one fixed monthly price.",
      ],
      tip: "If the company already uses Kubernetes, think EKS. Containers with no servers to manage means Fargate. Code that runs when an event happens means Lambda.",
    },
    {
      id: "d3-databases",
      check: ["d3-21", "d3-23"],
      task: "3.4",
      title: "Databases: pick the right engine",
      visual: (
        <ServiceRows
          rows={[
            { input: "Tables, SQL and joins", service: "Amazon RDS", output: "MySQL, PostgreSQL, MariaDB, Oracle, SQL Server or Db2, run for you" },
            { input: "Relational, at cloud scale", service: "Amazon Aurora", output: "Works with MySQL and PostgreSQL, and keeps copies of its storage across 3 AZs" },
            { input: "Key-value data at any scale", service: "Amazon DynamoDB", output: "Serverless NoSQL with answers in a few milliseconds" },
            { input: "Reads in microseconds", service: "Amazon ElastiCache", output: "An in-memory cache that sits in front of a database" },
            { input: "JSON documents", service: "Amazon DocumentDB", output: "A document database that works with MongoDB" },
            { input: "Data full of connections", service: "Amazon Neptune", output: "A graph database, for things like social networks and fraud rings" },
          ]}
        />
      ),
      points: [
        "A managed database takes patching, backups and hardware off your hands. Run a database yourself on EC2 only if you need access to the operating system, or an engine or version AWS doesn't offer.",
        "**Amazon Redshift** is a data warehouse. It's built for analyzing large amounts of data, not for recording day-to-day orders and payments.",
        "To move a database, AWS DMS copies the data with very little downtime, and AWS SCT converts the schema when you change engines.",
      ],
      tip: "Fully managed, serverless, key-value and any scale all point to DynamoDB. If the goal is to take read load off a database with a cache, it's ElastiCache.",
    },
    {
      id: "d3-network",
      check: ["d3-28", "d3-30"],
      task: "3.5",
      title: "Networking: VPCs, DNS, and connections",
      visual: (
        <div className="grid gap-4">
          <VpcDiagram />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧭", title: "Amazon Route 53", text: "DNS, the internet's phone book. Also registers domains, checks health and routes traffic.", color: "#38bdf8" },
              { icon: "🔌", title: "AWS Direct Connect", text: "A private, dedicated line from your building to AWS.", color: "#38bdf8" },
              { icon: "🔐", title: "AWS Site-to-Site VPN", text: "Encrypted tunnels across the internet. Quick to set up.", color: "#38bdf8" },
              { icon: "🧑‍💻", title: "AWS Client VPN", text: "Lets remote staff connect safely from their own devices.", color: "#38bdf8" },
              { icon: "🕸️", title: "AWS Transit Gateway", text: "A central hub that links many VPCs and your own networks.", color: "#38bdf8" },
              { icon: "🌐", title: "Amazon CloudFront", text: "A content delivery network that keeps copies of your content in edge locations.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "A **VPC** (virtual private cloud) is your own private network inside AWS. You split it into **subnets**, and each subnet lives in one Availability Zone.",
        "An **internet gateway** connects public subnets to the internet. A **NAT gateway** lets servers in private subnets reach out to the internet, while nobody outside can reach in.",
        "A **security group** is a firewall around each instance. It only has allow rules and remembers replies (**stateful**). A **network ACL** guards a whole subnet, has allow and deny rules, and checks every packet both ways (**stateless**).",
        "A few more: **API Gateway** publishes APIs, **Global Accelerator** carries users over AWS's own global network, and **PrivateLink** reaches services privately. Amazon Inspector can also flag servers that are reachable by mistake.",
      ],
      tip: "A steady, private, high-bandwidth link means Direct Connect. A quick encrypted connection over the internet means Site-to-Site VPN.",
    },
    {
      id: "d3-storage",
      check: ["d3-36", "d3-38"],
      task: "3.6",
      title: "Storage: objects, blocks, files, and archives",
      visual: (
        <div className="grid gap-4">
          <Ladder
            rungs={[
              { icon: "🧊", name: "S3 Glacier Deep Archive", text: "The cheapest. Getting data back takes hours. For keeping things for years." },
              { icon: "❄️", name: "S3 Glacier Flexible Retrieval", text: "Archives you can get back in minutes to hours." },
              { icon: "🥶", name: "S3 Glacier Instant Retrieval", text: "Rarely opened, but back in milliseconds when you need it." },
              { icon: "🌗", name: "S3 Standard-IA and One Zone-IA", text: "For data you read now and then. There's a fee to read it. One Zone keeps it in a single AZ." },
              { icon: "🤖", name: "S3 Intelligent-Tiering", text: "Moves objects to a cheaper tier by itself when you stop reading them." },
              { icon: "🪣", name: "S3 Standard", text: "For data you read often." },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧱", title: "Amazon EBS", text: "A virtual hard drive for one EC2 instance. It keeps its data when the instance stops.", color: "#f59e0b" },
              { icon: "⚡", title: "Instance store", text: "Temporary disk on the host machine. The data is lost when the instance stops.", color: "#f59e0b" },
              { icon: "📁", title: "Amazon EFS", text: "A shared file system that many Linux instances use at once, and that grows as needed.", color: "#f59e0b" },
              { icon: "🗄️", title: "Amazon FSx", text: "File systems AWS runs for you, such as Windows File Server and Lustre.", color: "#f59e0b" },
              { icon: "🌉", title: "AWS Storage Gateway", text: "Lets your own building use cloud storage, with a local cache for speed.", color: "#f59e0b" },
              { icon: "💾", title: "AWS Backup", text: "One place to set backup rules for many AWS services.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "**S3** is object storage with practically no size limit. People use it for backups, data lakes, videos and images, and the files behind websites.",
        "S3 has **storage classes**: the less often you read data, the cheaper the class you can keep it in. A **lifecycle policy** moves objects to cheaper classes after a set time, and can delete them later.",
        "**AWS Elastic Disaster Recovery** keeps copies of your servers on AWS, so you can get back up quickly after a disaster.",
      ],
      tip: "If nobody knows how often the data will be read, pick Intelligent-Tiering. If you must keep it for 7 years, rarely read it and pay the least, pick Glacier Deep Archive.",
    },
    {
      id: "d3-more",
      check: ["d3-44", "d3-51"],
      task: "3.7 · 3.8",
      title: "AI, analytics, and the rest of the toolbox",
      visual: (
        <div className="grid gap-4">
          <ServiceRows
            rows={[
              { input: "Images and video", service: "Amazon Rekognition", output: "Spots objects, faces and unsafe content" },
              { input: "Text", service: "Amazon Comprehend", output: "Finds the mood, key phrases and names in it" },
              { input: "Text", service: "Amazon Polly", output: "Reads it aloud in a natural voice" },
              { input: "Speech", service: "Amazon Transcribe", output: "Writes it down as text" },
              { input: "Text in one language", service: "Amazon Translate", output: "The same text in another language" },
              { input: "Scanned documents", service: "Amazon Textract", output: "The text, forms and tables, pulled out" },
              { input: "Voice or chat", service: "Amazon Lex", output: "A chatbot that holds a conversation" },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🔎", title: "Amazon Athena", text: "Ask SQL questions of files in S3, with no servers to run.", color: "#34d399" },
              { icon: "🌊", title: "Amazon Kinesis", text: "Collects and processes data that streams in nonstop, as it arrives.", color: "#34d399" },
              { icon: "🧪", title: "AWS Glue", text: "Cleans and moves data between stores (ETL), and keeps a catalog of it.", color: "#34d399" },
              { icon: "📊", title: "Amazon Quick", text: "Business dashboards and insights, with AI built in.", color: "#34d399" },
              { icon: "🏬", title: "Amazon Redshift", text: "A data warehouse for analyzing large amounts of data.", color: "#34d399" },
              { icon: "🐘", title: "Amazon EMR", text: "Runs big data tools such as Apache Spark.", color: "#34d399" },
              { icon: "🔍", title: "Amazon OpenSearch Service", text: "Search, and analysis of log data.", color: "#34d399" },
              { icon: "🧠", title: "Amazon SageMaker AI", text: "Build, train and run your own machine learning models.", color: "#34d399" },
            ]}
          />
          <Layers
            layers={[
              { name: "Messaging", color: "#f59e0b", items: ["SQS: a queue between parts of an app", "SNS: one message sent to many subscribers", "EventBridge: routes events using rules", "Step Functions: step-by-step workflows"] },
              { name: "Business apps", color: "#38bdf8", items: ["Amazon Connect: a contact center", "Amazon SES: sending email"] },
              { name: "Developer tools", color: "#a78bfa", items: ["CodeBuild: builds and tests code", "CodePipeline: automates releases", "X-Ray: traces requests"] },
              { name: "End-user computing", color: "#f87171", items: ["WorkSpaces: virtual desktops", "AppStream 2.0: apps streamed to a browser", "WorkSpaces Secure Browser"] },
              { name: "Web, mobile, IoT", color: "#34d399", items: ["AWS Amplify: build web and mobile apps", "AWS IoT Core: connect devices"] },
            ]}
          />
        </div>
      ),
      points: [
        "The ready-made AI services, like Rekognition and Translate, need no machine learning (ML) skills. **SageMaker AI** is for building your own models. **Amazon Q** is a generative AI assistant for work and for building on AWS.",
        "**SQS** holds messages in a queue until a program picks them up. **SNS** pushes one message out to many subscribers at once, such as email, SMS, Lambda or SQS.",
        "AWS Support belongs in this group too. AWS calls it its customer enablement service.",
      ],
      tip: "To decouple parts of an app, use SQS. To send an alert to many subscribers, use SNS. To react to events using rules, use EventBridge.",
    },
  ],

  questions: [
    // ── Start here ──
    {
      id: "clf-b3-01",
      domain: "d3",
      lesson: "d3-start-building-blocks",
      level: "beginner",
      prompt: "In a restaurant kitchen, the cooks do the work. Which cloud building block is like the cooks?",
      options: ["Compute", "Storage", "Networking", "Billing"],
      answer: [0],
      explanation: "Compute is the part that does the work, by running your code. Storage is the pantry, and networking is the doors and corridors that connect everything.",
    },
    {
      id: "clf-b3-02",
      domain: "d3",
      lesson: "d3-start-building-blocks",
      level: "beginner",
      prompt: "An app needs to keep organized customer records that it can search by name. Which building block is that?",
      options: ["A database", "Networking", "Compute", "A Region"],
      answer: [0],
      explanation: "A database keeps organized records you can search and update, like a restaurant's order book. On AWS, Amazon RDS and Amazon DynamoDB are databases.",
    },
    {
      id: "clf-b3-03",
      domain: "d3",
      lesson: "d3-start-first-server-and-bucket",
      level: "beginner",
      prompt: "Which AWS service gives you a virtual server you can run programs on?",
      options: ["Amazon EC2", "Amazon S3", "AWS IAM", "Amazon Route 53"],
      answer: [0],
      explanation: "Amazon EC2 rents you virtual servers, called instances. You pick the size, start one in minutes, and pay while it runs.",
    },
    {
      id: "clf-b3-04",
      domain: "d3",
      lesson: "d3-start-first-server-and-bucket",
      level: "beginner",
      prompt: "A photographer wants somewhere online to keep thousands of photos. Which AWS service fits best?",
      options: ["Amazon S3", "Amazon EC2", "AWS Lambda", "Amazon VPC"],
      answer: [0],
      explanation: "Amazon S3 stores files, which it calls objects, in buckets. It has practically no size limit, so it suits photos, videos and backups.",
    },
    {
      id: "clf-b3-05",
      domain: "d3",
      lesson: "d3-start-talking-to-aws",
      level: "beginner",
      prompt: "What is the AWS Management Console?",
      options: ["A website where you manage AWS by clicking", "A games console sold by Amazon", "A physical keyboard for data centers", "A type of database"],
      answer: [0],
      explanation: "The console is AWS's website for managing your account. You sign in and click through menus, which makes it the easiest place to start.",
    },
    {
      id: "clf-b3-06",
      domain: "d3",
      lesson: "d3-start-talking-to-aws",
      level: "beginner",
      prompt: "A developer wants their own app to upload files to S3 automatically. What should the app use?",
      options: ["An AWS SDK", "The AWS Management Console", "A printed manual", "AWS Artifact"],
      answer: [0],
      explanation: "An SDK is a code library that lets your program talk to AWS directly. The console is for people clicking, not for apps working on their own.",
    },
    // ── Access and deployment models ──
    {
      id: "d3-01",
      domain: "d3",
      lesson: "d3-access",
      prompt: "A company must create the same network, servers, and databases in five accounts, repeatably and with version control. Which approach should it use?",
      options: ["Click through the AWS Management Console in each account", "Infrastructure as code with AWS CloudFormation", "Email instructions to each team", "Open an AWS Support case"],
      answer: [1],
      explanation: "Infrastructure as code describes resources in templates, so environments are consistent, repeatable, and versioned.",
    },
    {
      id: "d3-02",
      domain: "d3",
      lesson: "d3-access",
      prompt: "A new employee wants to explore Amazon S3 for the first time and create one test bucket. What is the SIMPLEST way?",
      options: ["The AWS Management Console", "An AWS CloudFormation stack set", "A custom SDK application", "AWS Direct Connect"],
      answer: [0],
      explanation: "The console is the easiest way to learn and to do a one-off job. Anything you'll repeat belongs in scripts or infrastructure as code.",
    },
    {
      id: "d3-03",
      domain: "d3",
      lesson: "d3-access",
      prompt: "A developer wants an application written in Python to upload files to Amazon S3. What should the code use?",
      options: ["An AWS SDK", "The AWS Management Console", "AWS Artifact", "Amazon WorkSpaces"],
      answer: [0],
      explanation: "AWS SDKs let applications call AWS APIs in their own language. The AWS CLI does the same from a terminal.",
    },
    {
      id: "d3-04",
      domain: "d3",
      lesson: "d3-access",
      prompt: "A company keeps some applications in its own data center for latency reasons and runs others on AWS, with private connectivity between them. Which deployment model is this?",
      options: ["Cloud", "Hybrid", "On-premises only", "Multi-Region active-active"],
      answer: [1],
      explanation: "Hybrid connects on-premises infrastructure with the cloud. AWS Outposts, Direct Connect, and VPN all support hybrid designs.",
    },
    {
      id: "d3-05",
      domain: "d3",
      lesson: "d3-access",
      prompt: "Which are benefits of managing infrastructure as code? (Choose two.)",
      options: [
        "Consistent, repeatable environments",
        "Changes can be reviewed and tracked in version control",
        "Every change requires clicking in the console",
        "It removes the need to test changes",
        "It only works in one Region",
      ],
      answer: [0, 1],
      explanation: "With infrastructure as code, your setup lives in files you can review and track, just like app code, so every environment comes out the same. You still need to test changes.",
    },
    {
      id: "d3-06",
      domain: "d3",
      lesson: "d3-access",
      prompt: "A factory needs AWS services to run on premises with very low latency to its equipment, using the same APIs and tools as in the cloud. Which service fits?",
      options: ["AWS Outposts", "Amazon Lightsail", "AWS Global Accelerator", "Amazon S3 Glacier"],
      answer: [0],
      explanation: "AWS Outposts delivers AWS infrastructure and services to your own site for a consistent hybrid experience.",
    },
    // ── Global infrastructure ──
    {
      id: "d3-07",
      domain: "d3",
      lesson: "d3-global",
      prompt: "What is an Availability Zone?",
      options: [
        "One or more discrete data centers with redundant power, networking, and connectivity within a Region",
        "A single server rack",
        "A content cache in a city",
        "A group of Regions on the same continent",
      ],
      answer: [0],
      explanation: "Each Region has multiple isolated AZs. They're close enough for low-latency links but separate enough to avoid shared failures.",
    },
    {
      id: "d3-08",
      domain: "d3",
      lesson: "d3-global",
      prompt: "A company wants its application to stay available if one data center fails. What should it do?",
      options: [
        "Run the application in multiple Availability Zones behind a load balancer",
        "Use a larger instance in one Availability Zone",
        "Turn on AWS Budgets",
        "Store backups on the same instance",
      ],
      answer: [0],
      explanation: "AZs don't share single points of failure, so spreading across them keeps the app running when one has a problem.",
    },
    {
      id: "d3-09",
      domain: "d3",
      lesson: "d3-global",
      prompt: "Which are valid reasons to deploy a workload in more than one AWS Region? (Choose two.)",
      options: [
        "Disaster recovery if an entire Region becomes unavailable",
        "Lower latency for users on another continent",
        "Because Availability Zones in a Region share one data center",
        "To raise the number of IAM users allowed",
        "Because data transfer between Regions is always free",
      ],
      answer: [0, 1],
      explanation: "Multiple Regions support disaster recovery, business continuity, low latency for distant users, and data sovereignty. Inter-Region transfer is charged.",
    },
    {
      id: "d3-10",
      domain: "d3",
      lesson: "d3-global",
      prompt: "A video site wants images and videos to load quickly for users worldwide by caching them close to viewers. Which part of the global infrastructure does this use?",
      options: ["Edge locations", "Availability Zones only", "AWS Outposts", "Dedicated Hosts"],
      answer: [0],
      explanation: "Amazon CloudFront caches content at edge locations around the world, reducing latency for viewers.",
    },
    {
      id: "d3-11",
      domain: "d3",
      lesson: "d3-global",
      prompt: "A law requires that a company's customer data stays inside one country. What should the company do?",
      options: [
        "Store the data in an AWS Region located in that country",
        "Enable CloudFront in every edge location",
        "Use a single Availability Zone in any Region",
        "Turn on consolidated billing",
      ],
      answer: [0],
      explanation: "You choose the Region where data is stored, and AWS doesn't move it out of that Region unless you do. This supports data sovereignty.",
    },
    {
      id: "d3-12",
      domain: "d3",
      lesson: "d3-global",
      type: "order",
      prompt: "Order these from the LARGEST to the SMALLEST.",
      items: ["AWS Region", "Availability Zone", "Data center"],
      explanation: "Biggest to smallest: a Region holds several Availability Zones, and each Availability Zone is one or more data centers.",
    },
    // ── Compute ──
    {
      id: "d3-13",
      domain: "d3",
      lesson: "d3-compute",
      prompt: "A company runs scientific modeling and batch processing that needs high-performance processors. Which EC2 instance family should it choose?",
      options: ["Compute optimized", "Memory optimized", "Storage optimized", "General purpose"],
      answer: [0],
      explanation: "Compute optimized instances suit compute-bound work such as batch processing, HPC, and gaming servers.",
    },
    {
      id: "d3-14",
      domain: "d3",
      lesson: "d3-compute",
      prompt: "A data warehousing workload needs very high sequential read and write access to large data sets on local storage. Which EC2 instance family fits BEST?",
      options: ["Storage optimized", "Compute optimized", "Accelerated computing", "General purpose"],
      answer: [0],
      explanation: "Storage optimized instances deliver high, low-latency I/O to local storage.",
    },
    {
      id: "d3-15",
      domain: "d3",
      lesson: "d3-compute",
      prompt: "A team wants to run containers without provisioning or managing any servers or clusters of EC2 instances. Which service should it use?",
      options: ["AWS Fargate", "Amazon EC2 Dedicated Hosts", "AWS Outposts", "Amazon Lightsail"],
      answer: [0],
      explanation: "Fargate is serverless compute for containers, working with Amazon ECS and Amazon EKS.",
    },
    {
      id: "d3-16",
      domain: "d3",
      lesson: "d3-compute",
      prompt: "A company already runs Kubernetes on premises and wants a managed Kubernetes control plane on AWS. Which service should it choose?",
      options: ["Amazon EKS", "Amazon ECS", "AWS Lambda", "AWS Batch"],
      answer: [0],
      explanation: "Amazon EKS runs Kubernetes for you, so a team already using Kubernetes can keep its tools. Amazon ECS is AWS's own way of running containers.",
    },
    {
      id: "d3-17",
      domain: "d3",
      lesson: "d3-compute",
      prompt: "A shopping site wants EC2 capacity to grow during a sale and shrink afterwards, automatically. What provides this elasticity?",
      options: ["Amazon EC2 Auto Scaling", "AWS Artifact", "Amazon Route 53 domain registration", "An EBS snapshot"],
      answer: [0],
      explanation: "Auto Scaling adds instances when demand rises and removes them when it falls. It can also follow a schedule you set.",
    },
    {
      id: "d3-18",
      domain: "d3",
      lesson: "d3-compute",
      prompt: "What is the main purpose of Elastic Load Balancing?",
      options: [
        "Distribute incoming traffic across multiple targets, such as EC2 instances in several AZs",
        "Store objects durably",
        "Encrypt data at rest",
        "Track API calls",
      ],
      answer: [0],
      explanation: "Load balancers spread requests across healthy targets and stop sending traffic to unhealthy ones.",
    },
    {
      id: "d3-19",
      domain: "d3",
      lesson: "d3-compute",
      prompt: "Which are serverless compute options on AWS? (Choose two.)",
      options: ["AWS Lambda", "AWS Fargate", "Amazon EC2 Dedicated Hosts", "Amazon Lightsail instances", "AWS Outposts"],
      answer: [0, 1],
      explanation: "Lambda runs small pieces of code and Fargate runs containers. With both, there are no servers for you to manage.",
    },
    {
      id: "d3-20",
      domain: "d3",
      lesson: "d3-compute",
      type: "match",
      prompt: "Match each compute service to its description.",
      pairs: [
        ["Amazon Lightsail", "Simple virtual servers with bundled monthly pricing"],
        ["AWS Elastic Beanstalk", "Upload code; AWS handles capacity, load balancing, and scaling"],
        ["AWS Batch", "Run batch computing jobs at any scale"],
        ["Amazon ECR", "Store and manage container images"],
        ["AWS Outposts", "AWS infrastructure in your own data center"],
      ],
      explanation: "Each compute option strikes a different balance. The more AWS handles for you, the less you control, and the less you have to manage.",
    },
    // ── Databases ──
    {
      id: "d3-21",
      domain: "d3",
      lesson: "d3-databases",
      prompt: "A company wants a managed relational database running PostgreSQL, with automated backups and patching handled by AWS. Which service should it use?",
      options: ["Amazon RDS", "Amazon DynamoDB", "Amazon ElastiCache", "Amazon Neptune"],
      answer: [0],
      explanation: "Amazon RDS manages relational engines, including PostgreSQL, MySQL, MariaDB, Oracle, and SQL Server.",
    },
    {
      id: "d3-22",
      domain: "d3",
      lesson: "d3-databases",
      prompt: "Which AWS database is MySQL- and PostgreSQL-compatible, built for the cloud, and stores data across three Availability Zones?",
      options: ["Amazon Aurora", "Amazon Redshift", "Amazon DocumentDB", "Amazon DynamoDB"],
      answer: [0],
      explanation: "Aurora is a cloud-native relational database whose storage keeps copies across three AZs.",
    },
    {
      id: "d3-23",
      domain: "d3",
      lesson: "d3-databases",
      prompt: "A mobile game needs a serverless key-value database with single-digit millisecond latency at any scale. Which service fits?",
      options: ["Amazon DynamoDB", "Amazon RDS for MySQL", "Amazon Redshift", "Amazon Aurora"],
      answer: [0],
      explanation: "DynamoDB is a fully managed, serverless NoSQL database designed for consistent low latency at any scale.",
    },
    {
      id: "d3-24",
      domain: "d3",
      lesson: "d3-databases",
      prompt: "A web app runs the same database queries thousands of times a second. The company wants microsecond reads and less load on the database. What should it add?",
      options: ["Amazon ElastiCache", "AWS Backup", "Amazon S3 Glacier", "AWS DMS"],
      answer: [0],
      explanation: "ElastiCache is an in-memory cache that serves frequent reads quickly and offloads the database.",
    },
    {
      id: "d3-25",
      domain: "d3",
      lesson: "d3-databases",
      prompt: "When would a company choose to run a database on Amazon EC2 instead of using Amazon RDS?",
      options: [
        "When it needs full control of the operating system or an engine version RDS doesn't support",
        "When it wants AWS to handle patching",
        "When it wants automated backups without any effort",
        "When it wants the least operational overhead",
      ],
      answer: [0],
      explanation: "Self-managing on EC2 gives full control but makes you responsible for patching, backups, and high availability.",
    },
    {
      id: "d3-26",
      domain: "d3",
      lesson: "d3-databases",
      prompt: "Which are NoSQL database services? (Choose two.)",
      options: ["Amazon DynamoDB", "Amazon DocumentDB", "Amazon Aurora", "Amazon RDS for PostgreSQL", "Amazon Redshift"],
      answer: [0, 1],
      explanation: "DynamoDB stores key-value data and DocumentDB stores documents, so both are NoSQL. Aurora and RDS are relational, and Redshift is a data warehouse.",
    },
    {
      id: "d3-27",
      domain: "d3",
      lesson: "d3-databases",
      type: "match",
      prompt: "Match each need to the database service.",
      pairs: [
        ["Find relationships in a social network", "Amazon Neptune"],
        ["Store JSON documents, MongoDB-compatible", "Amazon DocumentDB"],
        ["Analytics across petabytes of data", "Amazon Redshift"],
        ["Cache frequent queries in memory", "Amazon ElastiCache"],
      ],
      explanation: "AWS has a database built for each shape of data. Connections suit a graph database, JSON suits a document database, big analysis suits a warehouse, and repeated reads suit a cache.",
    },
    // ── Networking ──
    {
      id: "d3-28",
      domain: "d3",
      lesson: "d3-network",
      prompt: "What is Amazon VPC?",
      options: [
        "A logically isolated virtual network where you launch AWS resources",
        "A content delivery network",
        "A DNS service",
        "A virtual desktop service",
      ],
      answer: [0],
      explanation: "A VPC is your own network in AWS, with subnets, route tables, gateways, and firewall rules you control.",
    },
    {
      id: "d3-29",
      domain: "d3",
      lesson: "d3-network",
      prompt: "Instances in a private subnet must download software updates from the internet, but must not accept inbound connections from it. What should be used?",
      options: ["A NAT gateway", "An internet gateway attached directly to the instances", "AWS Direct Connect", "Amazon Route 53"],
      answer: [0],
      explanation: "A NAT gateway lets private instances start outbound connections while blocking unsolicited inbound traffic.",
    },
    {
      id: "d3-30",
      domain: "d3",
      lesson: "d3-network",
      prompt: "Which VPC feature acts as a STATELESS firewall at the subnet level and supports both allow and deny rules?",
      options: ["Network ACL", "Security group", "Internet gateway", "Route table"],
      answer: [0],
      explanation: "Network ACLs are stateless and work at the subnet. Security groups are stateful, work at the instance, and only allow.",
    },
    {
      id: "d3-31",
      domain: "d3",
      lesson: "d3-network",
      prompt: "A company wants to register a domain name and route users to the healthiest endpoint using health checks. Which service should it use?",
      options: ["Amazon Route 53", "Amazon CloudFront", "AWS Transit Gateway", "Amazon API Gateway"],
      answer: [0],
      explanation: "Route 53 is a highly available DNS service with domain registration, health checks, and routing policies.",
    },
    {
      id: "d3-32",
      domain: "d3",
      lesson: "d3-network",
      prompt: "A company needs a dedicated, private network connection from its data center to AWS with consistent performance that doesn't travel over the public internet. Which service fits?",
      options: ["AWS Direct Connect", "AWS Site-to-Site VPN", "Amazon CloudFront", "AWS Client VPN"],
      answer: [0],
      explanation: "Direct Connect provides a dedicated private link. A VPN encrypts traffic but rides over the internet.",
    },
    {
      id: "d3-33",
      domain: "d3",
      lesson: "d3-network",
      prompt: "A company needs an encrypted connection between its office network and its VPC, set up quickly over the existing internet connection. Which service should it use?",
      options: ["AWS Site-to-Site VPN", "AWS Direct Connect", "Amazon Route 53", "AWS Global Accelerator"],
      answer: [0],
      explanation: "Site-to-Site VPN creates IPsec tunnels over the internet. It can be set up in minutes, unlike a Direct Connect circuit.",
    },
    {
      id: "d3-34",
      domain: "d3",
      lesson: "d3-network",
      prompt: "Which statements about security groups are correct? (Choose two.)",
      options: [
        "They are stateful: return traffic is automatically allowed",
        "They support allow rules only",
        "They apply to whole subnets",
        "They support explicit deny rules",
        "Their rules are evaluated in numbered order",
      ],
      answer: [0, 1],
      explanation: "Security groups are stateful, instance-level, and allow-only. Network ACLs are the subnet-level, stateless, numbered, allow-and-deny option.",
    },
    {
      id: "d3-35",
      domain: "d3",
      lesson: "d3-network",
      prompt: "A company has dozens of VPCs and several on-premises networks. It wants to connect them through one central hub instead of many point-to-point links. Which service should it use?",
      options: ["AWS Transit Gateway", "Amazon CloudFront", "Amazon Route 53", "AWS Client VPN"],
      answer: [0],
      explanation: "Transit Gateway acts as a regional hub that connects VPCs and on-premises networks.",
    },
    // ── Storage ──
    {
      id: "d3-36",
      domain: "d3",
      lesson: "d3-storage",
      prompt: "A company stores monthly reports that are rarely read, but must be available in milliseconds when someone opens one. It wants lower storage cost than S3 Standard. Which class fits?",
      options: ["S3 Standard-IA", "S3 Glacier Deep Archive", "S3 Glacier Flexible Retrieval", "EC2 instance store"],
      answer: [0],
      explanation: "S3 Standard-IA is for infrequently accessed data that still needs fast access. It charges a per-GB retrieval fee.",
    },
    {
      id: "d3-37",
      domain: "d3",
      lesson: "d3-storage",
      prompt: "A data lake has objects whose access patterns are unknown and change over time. The company wants S3 to optimize costs automatically without performance impact. Which class should it use?",
      options: ["S3 Intelligent-Tiering", "S3 One Zone-IA", "S3 Glacier Deep Archive", "S3 Standard only"],
      answer: [0],
      explanation: "Intelligent-Tiering moves objects between access tiers as their access patterns change.",
    },
    {
      id: "d3-38",
      domain: "d3",
      lesson: "d3-storage",
      prompt: "Regulations require keeping records for 7 years. They're almost never read, and a retrieval time of up to 12 hours is acceptable. Which storage class is the MOST cost-effective?",
      options: ["S3 Glacier Deep Archive", "S3 Standard", "S3 Standard-IA", "S3 Glacier Instant Retrieval"],
      answer: [0],
      explanation: "Glacier Deep Archive is the lowest-cost S3 class, designed for long-term retention with retrieval in hours.",
    },
    {
      id: "d3-39",
      domain: "d3",
      lesson: "d3-storage",
      prompt: "Which are block storage options for Amazon EC2? (Choose two.)",
      options: ["Amazon EBS", "EC2 instance store", "Amazon S3", "Amazon EFS", "Amazon S3 Glacier"],
      answer: [0, 1],
      explanation: "An EBS volume keeps its data even when the instance stops. Instance store is temporary disk on the host, and its data is lost. S3 is object storage and EFS is file storage.",
    },
    {
      id: "d3-40",
      domain: "d3",
      lesson: "d3-storage",
      type: "match",
      prompt: "Match each storage need to the service.",
      pairs: [
        ["Persistent block volume for one EC2 instance", "Amazon EBS"],
        ["Shared file system for many Linux instances", "Amazon EFS"],
        ["Windows file shares for Windows applications", "Amazon FSx"],
        ["On-premises access to cloud storage with a local cache", "AWS Storage Gateway"],
        ["Objects such as images, backups, and logs", "Amazon S3"],
      ],
      explanation: "Each kind of storage fits a different job. EBS is a disk for one server, EFS and FSx are shared file systems, Storage Gateway links your building to the cloud, and S3 holds objects.",
    },
    {
      id: "d3-41",
      domain: "d3",
      lesson: "d3-storage",
      prompt: "A company wants log files in S3 moved to a cheaper storage class after 30 days and deleted after one year, automatically. What should it configure?",
      options: ["An S3 Lifecycle configuration", "An IAM password policy", "An AWS Budgets action", "An EBS snapshot schedule"],
      answer: [0],
      explanation: "Lifecycle rules transition objects between storage classes and expire them on a schedule.",
    },
    {
      id: "d3-42",
      domain: "d3",
      lesson: "d3-storage",
      prompt: "A company wants one place to define backup policies and schedules for its EBS volumes, RDS databases, DynamoDB tables, and EFS file systems. Which service should it use?",
      options: ["AWS Backup", "AWS Storage Gateway", "Amazon S3 Transfer Acceleration", "AWS Artifact"],
      answer: [0],
      explanation: "AWS Backup centralizes and automates backups across many AWS services.",
    },
    {
      id: "d3-43",
      domain: "d3",
      lesson: "d3-storage",
      type: "order",
      prompt: "Order these S3 storage classes from the HIGHEST storage price per GB to the LOWEST.",
      items: ["S3 Standard", "S3 Standard-IA", "S3 Glacier Flexible Retrieval", "S3 Glacier Deep Archive"],
      explanation: "The colder the class, the less it costs to keep data there. The catch is that getting it back costs more and takes longer.",
    },
    // ── AI/ML, analytics, and other services ──
    {
      id: "d3-44",
      domain: "d3",
      lesson: "d3-more",
      prompt: "A data science team wants to build, train, and deploy its own machine learning models with managed infrastructure. Which service should it use?",
      options: ["Amazon SageMaker AI", "Amazon Polly", "Amazon Athena", "AWS Glue"],
      answer: [0],
      explanation: "SageMaker AI covers the full ML lifecycle for custom models. Pre-built AI services need no model building.",
    },
    {
      id: "d3-45",
      domain: "d3",
      lesson: "d3-more",
      prompt: "A bank wants a chatbot that understands customers' voice and text requests, such as checking a balance. Which service builds conversational interfaces?",
      options: ["Amazon Lex", "Amazon Textract", "Amazon Rekognition", "Amazon Kinesis"],
      answer: [0],
      explanation: "Amazon Lex builds conversational interfaces with speech recognition and language understanding.",
    },
    {
      id: "d3-46",
      domain: "d3",
      lesson: "d3-more",
      type: "match",
      prompt: "Match each AI service to its task.",
      pairs: [
        ["Amazon Rekognition", "Analyze images and video"],
        ["Amazon Polly", "Turn text into lifelike speech"],
        ["Amazon Transcribe", "Turn speech into text"],
        ["Amazon Translate", "Translate text between languages"],
        ["Amazon Comprehend", "Find sentiment and key phrases in text"],
        ["Amazon Textract", "Extract text and tables from scanned documents"],
      ],
      explanation: "The ready-made AI services work through a simple API call. You don't need to know how to build or train a model.",
    },
    {
      id: "d3-47",
      domain: "d3",
      lesson: "d3-more",
      prompt: "Analysts want to run standard SQL queries directly against log files stored in Amazon S3, without loading them into a database or managing servers. Which service should they use?",
      options: ["Amazon Athena", "Amazon RDS", "Amazon ElastiCache", "AWS Lambda"],
      answer: [0],
      explanation: "Athena is serverless, interactive SQL over data in S3. You pay for the data scanned.",
    },
    {
      id: "d3-48",
      domain: "d3",
      lesson: "d3-more",
      prompt: "A company needs to collect and process clickstream data from its website in real time. Which service should it use?",
      options: ["Amazon Kinesis", "Amazon S3 Glacier", "AWS Glue DataBrew", "Amazon Lightsail"],
      answer: [0],
      explanation: "Kinesis takes in data that never stops arriving, such as clicks or sensor readings, and lets you process it straight away.",
    },
    {
      id: "d3-49",
      domain: "d3",
      lesson: "d3-more",
      prompt: "A company wants a serverless service to discover its data, catalog it, and run extract, transform, and load (ETL) jobs. Which service fits?",
      options: ["AWS Glue", "Amazon Connect", "AWS X-Ray", "Amazon SES"],
      answer: [0],
      explanation: "AWS Glue is serverless data integration with a central Data Catalog and ETL jobs.",
    },
    {
      id: "d3-50",
      domain: "d3",
      lesson: "d3-more",
      prompt: "Business users want interactive dashboards and AI-powered insights from company data without managing BI servers. Which service should they use?",
      options: ["Amazon Quick", "Amazon EMR", "AWS CodeBuild", "Amazon Neptune"],
      answer: [0],
      explanation: "Amazon Quick provides business intelligence dashboards and AI-powered insights over your data.",
    },
    {
      id: "d3-51",
      domain: "d3",
      lesson: "d3-more",
      prompt: "An order service must hand work to a payment service without the two depending on each other being available at the same moment. Messages should wait until they're processed. Which service fits?",
      options: ["Amazon SQS", "Amazon SNS", "Amazon Route 53", "Amazon CloudWatch"],
      answer: [0],
      explanation: "SQS queues messages so producers and consumers are decoupled. SNS pushes messages to subscribers immediately.",
    },
    {
      id: "d3-52",
      domain: "d3",
      lesson: "d3-more",
      prompt: "A company wants to send an alert to an operations email list, an SMS number, and a Lambda function whenever a critical event happens. Which service publishes one message to all of them?",
      options: ["Amazon SNS", "Amazon SQS", "AWS Glue", "Amazon Athena"],
      answer: [0],
      explanation: "SNS is a publish/subscribe service that fans out a message to many subscribers and endpoints.",
    },
    {
      id: "d3-53",
      domain: "d3",
      lesson: "d3-more",
      prompt: "A retailer wants to send order confirmation emails to customers and run a cloud contact center for its support team. Which services should it use? (Choose two.)",
      options: ["Amazon SES", "Amazon Connect", "AWS Amplify", "Amazon Athena", "AWS Glue"],
      answer: [0, 1],
      explanation: "Amazon SES sends transactional and marketing email. Amazon Connect is a cloud contact center.",
    },
    {
      id: "d3-54",
      domain: "d3",
      lesson: "d3-more",
      prompt: "Which services help teams build, deploy, and troubleshoot applications? (Choose two.)",
      options: ["AWS CodePipeline", "AWS X-Ray", "Amazon Connect", "Amazon WorkSpaces", "AWS Artifact"],
      answer: [0, 1],
      explanation: "CodePipeline automates release pipelines (with CodeBuild compiling and testing) and X-Ray traces requests to find problems.",
    },
    {
      id: "d3-55",
      domain: "d3",
      lesson: "d3-more",
      type: "match",
      prompt: "Match each service to what it does.",
      pairs: [
        ["Amazon EventBridge", "Route events to targets using rules"],
        ["AWS Amplify", "Build and host full-stack web and mobile apps"],
        ["AWS IoT Core", "Connect and manage IoT devices"],
        ["Amazon WorkSpaces", "Managed virtual desktops for employees"],
        ["Amazon AppStream 2.0", "Stream desktop applications to a browser"],
      ],
      explanation: "EventBridge connects parts of an app, Amplify builds web and mobile front ends, IoT Core connects devices, and WorkSpaces and AppStream 2.0 give staff desktops and apps from the cloud.",
    },
  ],

  cards: [
    { id: "c3-region", domain: "d3", kind: "concept", term: "Region", definition: "A separate part of the world, such as Ireland or Tokyo, with several Availability Zones." },
    { id: "c3-az", domain: "d3", kind: "concept", term: "Availability Zone", definition: "One or more data centers in a Region, kept apart from the others so one failure doesn't hit them all." },
    { id: "c3-edge", domain: "d3", kind: "concept", term: "Edge location", definition: "A small site near users that keeps copies of content, so CloudFront can serve it quickly." },
    { id: "c3-hybrid", domain: "d3", kind: "concept", term: "Hybrid deployment", definition: "Your own data center connected to the cloud, with work running in both." },
    { id: "c3-iac", domain: "d3", kind: "concept", term: "Infrastructure as code", definition: "Describing your setup in files, so it can be built the same way every time and tracked in version control." },
    { id: "c3-sgnacl", domain: "d3", kind: "concept", term: "Security group and NACL", definition: "A security group guards one instance, only allows, and remembers replies. A NACL guards a subnet, can allow or deny, and checks traffic both ways." },
    { id: "c3-nat", domain: "d3", kind: "concept", term: "NAT gateway", definition: "Lets servers in a private subnet reach the internet, while nothing outside can start a connection to them." },
    { id: "c3-lifecycle", domain: "d3", kind: "concept", term: "S3 Lifecycle", definition: "Rules that move objects to cheaper storage classes as they age, and delete them later." },
    { id: "c3-instancestore", domain: "d3", kind: "concept", term: "Instance store", definition: "Temporary disk on the host machine. Its data is lost when the instance stops." },
    { id: "s-ec2", domain: "d3", kind: "service", term: "Amazon EC2", definition: "Virtual servers you can start in minutes and resize when you need to." },
    { id: "s-lambda", domain: "d3", kind: "service", term: "AWS Lambda", definition: "Runs your code when an event happens, with no servers to manage." },
    { id: "s-fargate", domain: "d3", kind: "service", term: "AWS Fargate", definition: "Runs containers without you managing any servers." },
    { id: "s-ecs", domain: "d3", kind: "service", term: "Amazon ECS", definition: "AWS's own service for running and managing containers." },
    { id: "s-eks", domain: "d3", kind: "service", term: "Amazon EKS", definition: "Kubernetes, run and managed by AWS." },
    { id: "s-ecr", domain: "d3", kind: "service", term: "Amazon ECR", definition: "A place to store and share your container images." },
    { id: "s-beanstalk", domain: "d3", kind: "service", term: "AWS Elastic Beanstalk", definition: "Upload your web app's code and AWS handles the servers, load balancing and scaling." },
    { id: "s-lightsail", domain: "d3", kind: "service", term: "Amazon Lightsail", definition: "Simple servers with one fixed monthly price that covers the extras." },
    { id: "s-batch", domain: "d3", kind: "service", term: "AWS Batch", definition: "Runs large batches of computing jobs, at any scale." },
    { id: "s-outposts", domain: "d3", kind: "service", term: "AWS Outposts", definition: "Real AWS hardware and services installed in your own data center." },
    { id: "s-elb", domain: "d3", kind: "service", term: "Elastic Load Balancing", definition: "Shares incoming traffic across servers and skips any that are unhealthy." },
    { id: "s-autoscaling", domain: "d3", kind: "service", term: "AWS Auto Scaling", definition: "Adds and removes capacity as demand goes up and down." },
    { id: "s-cloudformation", domain: "d3", kind: "service", term: "AWS CloudFormation", definition: "Builds your AWS setup from template files. This is AWS's infrastructure as code service." },
    { id: "s-rds", domain: "d3", kind: "service", term: "Amazon RDS", definition: "Relational databases, such as MySQL and PostgreSQL, that AWS runs for you." },
    { id: "s-aurora", domain: "d3", kind: "service", term: "Amazon Aurora", definition: "A relational database built for the cloud that works with MySQL and PostgreSQL." },
    { id: "s-dynamodb", domain: "d3", kind: "service", term: "Amazon DynamoDB", definition: "A serverless NoSQL database for key-value data, fast at any scale." },
    { id: "s-elasticache", domain: "d3", kind: "service", term: "Amazon ElastiCache", definition: "An in-memory cache that answers repeated reads very quickly." },
    { id: "s-documentdb", domain: "d3", kind: "service", term: "Amazon DocumentDB", definition: "A document database that works with MongoDB." },
    { id: "s-neptune", domain: "d3", kind: "service", term: "Amazon Neptune", definition: "A graph database, for data full of connections, like who knows whom." },
    { id: "s-vpc", domain: "d3", kind: "service", term: "Amazon VPC", definition: "Your own private network inside AWS, kept apart from everyone else's." },
    { id: "s-route53", domain: "d3", kind: "service", term: "Amazon Route 53", definition: "AWS's DNS service. It turns names into addresses, registers domains and checks health." },
    { id: "s-cloudfront", domain: "d3", kind: "service", term: "Amazon CloudFront", definition: "A content delivery network that serves copies of your content from edge locations near users." },
    { id: "s-directconnect", domain: "d3", kind: "service", term: "AWS Direct Connect", definition: "A private, dedicated network line from your building to AWS." },
    { id: "s-vpn", domain: "d3", kind: "service", term: "AWS Site-to-Site VPN", definition: "Encrypted tunnels between your network and AWS, across the internet." },
    { id: "s-tgw", domain: "d3", kind: "service", term: "AWS Transit Gateway", definition: "A central hub that links many VPCs and your own networks." },
    { id: "s-apigw", domain: "d3", kind: "service", term: "Amazon API Gateway", definition: "Creates, publishes and secures APIs for your apps." },
    { id: "s-globalacc", domain: "d3", kind: "service", term: "AWS Global Accelerator", definition: "Carries your users' traffic over AWS's own global network for speed." },
    { id: "s-s3", domain: "d3", kind: "service", term: "Amazon S3", definition: "Object storage for files of any kind, with practically no size limit." },
    { id: "s-glacier", domain: "d3", kind: "service", term: "Amazon S3 Glacier", definition: "Low-cost S3 storage classes for archives you rarely open." },
    { id: "s-ebs", domain: "d3", kind: "service", term: "Amazon EBS", definition: "Virtual hard drives for EC2 instances." },
    { id: "s-efs", domain: "d3", kind: "service", term: "Amazon EFS", definition: "A shared file system that many Linux servers use at once, and that grows as you add files." },
    { id: "s-fsx", domain: "d3", kind: "service", term: "Amazon FSx", definition: "File systems AWS runs for you, such as Windows File Server and Lustre." },
    { id: "s-storagegw", domain: "d3", kind: "service", term: "AWS Storage Gateway", definition: "Lets your own building use cloud storage as if it were local." },
    { id: "s-backup", domain: "d3", kind: "service", term: "AWS Backup", definition: "Sets backup rules in one place for many AWS services." },
    { id: "s-sagemaker", domain: "d3", kind: "service", term: "Amazon SageMaker AI", definition: "Builds, trains and runs your own machine learning models." },
    { id: "s-lex", domain: "d3", kind: "service", term: "Amazon Lex", definition: "Builds chatbots that understand speech and text." },
    { id: "s-rekognition", domain: "d3", kind: "service", term: "Amazon Rekognition", definition: "Finds objects, faces and unsafe content in images and video." },
    { id: "s-polly", domain: "d3", kind: "service", term: "Amazon Polly", definition: "Turns text into natural-sounding speech." },
    { id: "s-transcribe", domain: "d3", kind: "service", term: "Amazon Transcribe", definition: "Turns speech into written text." },
    { id: "s-translate", domain: "d3", kind: "service", term: "Amazon Translate", definition: "Translates text from one language to another." },
    { id: "s-comprehend", domain: "d3", kind: "service", term: "Amazon Comprehend", definition: "Reads text and finds its mood, key phrases and names." },
    { id: "s-textract", domain: "d3", kind: "service", term: "Amazon Textract", definition: "Pulls text, forms and tables out of scanned documents." },
    { id: "s-q", domain: "d3", kind: "service", term: "Amazon Q", definition: "A generative AI assistant for everyday work and for building on AWS." },
    { id: "s-athena", domain: "d3", kind: "service", term: "Amazon Athena", definition: "Runs SQL queries on files in S3, with no servers to manage." },
    { id: "s-kinesis", domain: "d3", kind: "service", term: "Amazon Kinesis", definition: "Collects and processes streaming data as it arrives." },
    { id: "s-glue", domain: "d3", kind: "service", term: "AWS Glue", definition: "Serverless tool for moving and cleaning data (ETL), with a catalog of your data." },
    { id: "s-quick", domain: "d3", kind: "service", term: "Amazon Quick", definition: "Business dashboards and insights, with AI built in." },
    { id: "s-redshift", domain: "d3", kind: "service", term: "Amazon Redshift", definition: "A data warehouse for analyzing large amounts of data." },
    { id: "s-emr", domain: "d3", kind: "service", term: "Amazon EMR", definition: "Runs big data tools such as Apache Spark." },
    { id: "s-sqs", domain: "d3", kind: "service", term: "Amazon SQS", definition: "Message queues, so one part of an app can hand work to another without waiting." },
    { id: "s-sns", domain: "d3", kind: "service", term: "Amazon SNS", definition: "Sends one message out to many subscribers at once (publish and subscribe)." },
    { id: "s-eventbridge", domain: "d3", kind: "service", term: "Amazon EventBridge", definition: "Receives events and sends each one where it should go, using rules." },
    { id: "s-connect", domain: "d3", kind: "service", term: "Amazon Connect", definition: "A contact center for customer calls and chats, run in the cloud." },
    { id: "s-ses", domain: "d3", kind: "service", term: "Amazon SES", definition: "Sends email, such as receipts and newsletters." },
    { id: "s-codepipeline", domain: "d3", kind: "service", term: "AWS CodePipeline", definition: "Automates the steps that take code from a commit to a release." },
    { id: "s-codebuild", domain: "d3", kind: "service", term: "AWS CodeBuild", definition: "Builds and tests your code." },
    { id: "s-xray", domain: "d3", kind: "service", term: "AWS X-Ray", definition: "Follows a request through your app so you can see where it slowed down or failed." },
    { id: "s-workspaces", domain: "d3", kind: "service", term: "Amazon WorkSpaces", definition: "Virtual desktops for staff, run by AWS." },
    { id: "s-appstream", domain: "d3", kind: "service", term: "Amazon AppStream 2.0", definition: "Streams desktop apps to a web browser." },
    { id: "s-amplify", domain: "d3", kind: "service", term: "AWS Amplify", definition: "Builds and hosts web and mobile apps." },
    { id: "s-iotcore", domain: "d3", kind: "service", term: "AWS IoT Core", definition: "Connects and manages internet-connected devices, such as sensors." },
  ],

  challenges: [
    {
      id: "ch-multi-az",
      domain: "d3",
      lesson: "d3-global",
      title: "Survive the outage",
      goal: "Run the app in at least two Availability Zones, then fail one of the zones it runs in and keep the app up.",
      hint: "Place servers in two zones first, then press 💥 on one of them.",
      takeaway: "Availability Zones don't share power or networks, so an app spread across two of them keeps running when one goes down.",
      render: (onSolved) => <MultiAzLab goal="survive" onSolved={onSolved} />,
    },
  ],
});
