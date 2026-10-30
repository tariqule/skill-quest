import { defineCourse } from "@/engine/define";
import d1 from "./domains/d1-ai-ml-fundamentals";
import d2 from "./domains/d2-genai-fundamentals";
import d3 from "./domains/d3-foundation-model-apps";
import d4 from "./domains/d4-responsible-ai";
import d5 from "./domains/d5-security-governance";

/**
 * AWS Certified AI Practitioner (AIF-C01).
 * Content follows the official exam guide v1.2 (October 2026).
 * Domain content lives in ./domains; this file holds course-wide metadata.
 */
export default defineCourse({
  id: "aws-aif-c01",
  provider: { id: "aws", name: "AWS", color: "#f59e0b", icon: "☁️" },
  code: "AIF-C01",
  title: "AWS Certified AI Practitioner",
  shortTitle: "AI Practitioner",
  tagline: "AI, ML, and generative AI concepts and AWS AI services, for people who use AI rather than build it.",
  level: "Foundational",
  // Kept from the single-course version so existing progress carries over.
  storageKey: "aws-ai-quest:v1",

  domains: [d1, d2, d3, d4, d5],

  exam: {
    questions: 65,
    unscored: 15,
    minutes: 90,
    scale: { min: 100, max: 1000, pass: 700 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "1 correct answer out of 4." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "2 or more correct out of 5+. You need all of them right to score." },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Put 3 to 5 steps in the right sequence." },
      { id: "match", icon: "🔗", name: "Matching", rule: "Pair 3 to 7 prompts with their answers. Every pair must be right." },
    ],
  },

  guide: {
    source: {
      label: "AWS AIF-C01 exam guide",
      version: "1.2",
      date: "October 2026",
      url: "https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html",
    },
    facts: [
      { icon: "📝", value: "65", label: "questions", detail: "50 count toward your score. 15 are unscored trial questions, and you can't tell which." },
      { icon: "⏱️", value: "90", label: "minutes", detail: "That's about 80 seconds a question, which is plenty if you don't get stuck." },
      { icon: "🎯", value: "700", label: "to pass", detail: "Scores run from 100 to 1000. You pass on your overall score, not domain by domain." },
      { icon: "🎲", value: "0", label: "guess penalty", detail: "A blank answer counts as wrong, so always pick something." },
      { icon: "💵", value: "$100", label: "USD", detail: "Take it at a Pearson VUE test center or online with a proctor." },
      { icon: "📅", value: "3", label: "years valid", detail: "After that, you recertify." },
    ],
    candidate: {
      is: [
        "Someone with up to about 6 months of experience with AI and ML on AWS",
        "A person who uses AI solutions, even if they don't build them",
        "Familiar with core AWS services like EC2, S3, Lambda, Bedrock and SageMaker AI",
        "Knows the basics of IAM, the shared responsibility model and AWS pricing",
      ],
      isNot: [
        "Writing code for models or algorithms",
        "Data or feature engineering",
        "Tuning hyperparameters or optimising models",
        "Building ML pipelines or infrastructure",
        "Doing the maths or statistics behind models",
      ],
    },
    scope: {
      label: "In-scope AWS services",
      groups: [
        {
          category: "Machine learning",
          icon: "🤖",
          services: [
            "Amazon Bedrock",
            "Amazon Bedrock AgentCore",
            "Amazon Nova",
            "Amazon SageMaker AI",
            "SageMaker JumpStart",
            "Amazon Comprehend",
            "Amazon Lex",
            "Amazon Personalize",
            "Amazon Polly",
            "Amazon Rekognition",
            "Amazon Textract",
            "Amazon Transcribe",
            "Amazon Translate",
            "AWS Transform",
          ],
        },
        { category: "Developer tools", icon: "🛠️", services: ["Kiro", "Strands Agents"] },
        {
          category: "Analytics",
          icon: "📊",
          services: ["Amazon Quick", "Amazon OpenSearch Service", "AWS Glue", "AWS Glue DataBrew", "AWS Lake Formation", "Amazon EMR", "Amazon Redshift", "AWS Data Exchange"],
        },
        {
          category: "Security & compliance",
          icon: "🔐",
          services: ["AWS IAM", "AWS KMS", "Amazon Macie", "Amazon Inspector", "AWS Artifact", "AWS Secrets Manager"],
        },
        {
          category: "Management & governance",
          icon: "🧭",
          services: ["AWS CloudTrail", "Amazon CloudWatch", "AWS Config", "AWS Trusted Advisor", "AWS Well-Architected Tool"],
        },
        {
          category: "Database",
          icon: "🗄️",
          services: ["Amazon Aurora", "Amazon RDS", "Amazon Neptune", "Amazon DynamoDB", "Amazon DocumentDB", "Amazon ElastiCache"],
        },
        { category: "Compute & containers", icon: "🖥️", services: ["Amazon EC2", "AWS Lambda", "Amazon ECS", "Amazon EKS"] },
        { category: "Networking", icon: "🌐", services: ["Amazon VPC", "Amazon CloudFront"] },
        { category: "Storage", icon: "🪣", services: ["Amazon S3", "Amazon S3 Glacier"] },
        { category: "Cost", icon: "💰", services: ["AWS Budgets", "AWS Cost Explorer"] },
      ],
    },
    tips: [
      { icon: "🔎", tip: "Watch for the requirement words, like LEAST operational overhead, MOST cost-effective or NO code. They're what decide between two good answers." },
      { icon: "🪜", tip: "For customisation questions, the cheapest option that works wins. Try prompting first, then RAG, then fine-tuning, and pre-training last." },
      { icon: "🏷️", tip: "Words like \"managed\", \"no ML expertise\" or \"quickly\" usually point to a pre-built service or Bedrock, not to training in SageMaker." },
      { icon: "✂️", tip: "Rule out the two clearly wrong answers first. Then check the last two against the requirement words." },
      { icon: "🚩", tip: "Flag hard questions and move on. Come back to them with the time you saved." },
      { icon: "🎲", tip: "Never leave a blank. There's no penalty for guessing." },
    ],
    officialPractice: {
      label: "AWS Skill Builder exam prep plan",
      url: "https://skillbuilder.aws/category/exam-prep/ai-practitioner-AIF-C01",
    },
  },

  cheatsheet: [
    {
      title: "Exam at a glance",
      items: [
        ["Question types", "Multiple choice (1 of 4), multiple response (2 or more of 5+), ordering (3 to 5 steps), matching (3 to 7 pairs). No partial credit."],
        ["Read the ask", "Find the constraint word: least effort, lowest cost, no ML expertise, no servers, real time, private data, audit."],
        ["Default ladder", "Prompt engineering first, then RAG, then fine-tuning, then continued pre-training, then training from scratch."],
        ["Bedrock or SageMaker", "Bedrock for a ready foundation model through an API, with no servers. SageMaker AI to build, train, host and monitor your own model."],
      ],
    },
    {
      title: "AI, ML and learning types",
      items: [
        ["AI, ML, deep learning, generative AI", "Each is a subset of the one before. Generative AI is deep learning that creates new content."],
        ["Supervised", "Learns from labeled data. Classification predicts a category, regression predicts a number."],
        ["Unsupervised", "Finds structure in unlabeled data: clustering, anomaly detection, dimensionality reduction"],
        ["Reinforcement", "An agent learns from rewards and penalties (AWS DeepRacer)"],
        ["Self-supervised", "The model makes its own labels from raw data. This is how FMs are pre-trained"],
        ["Data types", "Structured (tables), unstructured (text, images, audio), time series, labeled and unlabeled"],
        ["Overfitting and underfitting", "Overfit: great on training data, poor on new data. Underfit: too simple to learn the pattern."],
        ["When not to use ML", "When a fixed rule gives the exact answer, or when you need a fully explainable, guaranteed result"],
      ],
    },
    {
      title: "ML lifecycle and SageMaker AI tools",
      items: [
        ["Pipeline", "Business goal, collect data, prepare and engineer features, train and tune, evaluate, deploy, monitor, re-train"],
        ["Ground Truth", "Label data with people, plus active learning"],
        ["Data Wrangler", "Prepare and explore data for ML"],
        ["Feature Store", "Share features. Online store for low-latency inference, offline store in S3 for training"],
        ["Canvas", "No-code ML for business analysts"],
        ["Autopilot", "Automatic model building (AutoML)"],
        ["JumpStart", "Hub of open and proprietary models you deploy to your own SageMaker endpoint"],
        ["Model Registry and Pipelines", "Version and approve models. Automate the steps (MLOps)"],
        ["Model Monitor", "Watches live models for data and quality drift"],
        ["Model Cards", "Intended uses, risk rating, training details, evaluation results"],
        ["Clarify", "Bias metrics and SHAP explanations. Closed to new customers, but still in the exam guide"],
      ],
    },
    {
      title: "Inference options",
      items: [
        ["Real-time", "Always-on endpoint, millisecond answers"],
        ["Serverless", "Scales to zero for spiky traffic. Payloads up to 4 MB, requests up to 60 seconds, cold starts"],
        ["Asynchronous", "Queued requests up to 1 GB and up to one hour, results written to S3"],
        ["Batch transform", "Score a whole dataset offline. No endpoint kept running"],
        ["Bedrock on-demand", "Pay per input and output token"],
        ["Bedrock batch inference", "Large offline jobs at a lower price than on-demand"],
        ["Provisioned Throughput", "Reserved capacity for steady, heavy traffic, and often for custom models"],
      ],
    },
    {
      title: "AWS AI services: use when",
      items: [
        ["Amazon Bedrock", "You want foundation models through one API, with Knowledge Bases, Agents, Guardrails and Evaluations"],
        ["Bedrock AgentCore", "You need to run agents from any framework at scale, with memory, identity, gateway and observability"],
        ["Amazon Q Business", "Staff need a ready-made assistant over company data and apps"],
        ["Amazon Q Developer", "Developers need help writing, explaining, upgrading or scanning code"],
        ["Amazon Comprehend", "Find sentiment, entities, key phrases, language, PII or toxicity in text"],
        ["Amazon Textract", "Pull text, forms and tables out of scanned documents"],
        ["Amazon Rekognition", "Find objects, faces, text and unsafe content in images and video"],
        ["Amazon Transcribe", "Speech to text"],
        ["Amazon Polly", "Text to lifelike speech"],
        ["Amazon Translate", "Translate text between languages"],
        ["Amazon Lex", "Build voice and text chatbots with intents and slots"],
        ["Amazon Kendra", "Natural-language enterprise search over your documents"],
        ["Amazon Personalize", "Product and content recommendations"],
        ["Amazon Nova", "Amazon's own FMs. Micro (text), Lite and Pro (multimodal), Canvas (images), Reel (video)"],
        ["Kiro, Strands Agents, AWS Transform", "Agentic IDE from specs. Open-source agent SDK. Agentic migration and modernization"],
      ],
    },
    {
      title: "Common confusions",
      items: [
        ["Q Business vs Q Developer", "Q Business answers questions over company data for any employee. Q Developer helps people write and secure code."],
        ["Kendra vs Bedrock Knowledge Bases", "Kendra is a managed search engine that returns passages. Knowledge Bases is managed RAG: it retrieves chunks and has an FM write the answer."],
        ["Clarify vs A2I vs Model Monitor", "Clarify measures bias and explains predictions. A2I sends low-confidence results to a person. Model Monitor watches live models for drift."],
        ["Comprehend vs Bedrock", "Comprehend is a ready NLP API for fixed tasks like sentiment and PII. Bedrock generates new text with a foundation model."],
        ["Bedrock vs JumpStart", "Bedrock is serverless and billed per token. JumpStart runs the model on SageMaker instances you choose and manage."],
        ["Guardrails vs IAM", "Guardrails filter what the model says. IAM controls who can call the model at all."],
        ["CloudTrail vs CloudWatch", "CloudTrail records who called which API. CloudWatch holds metrics, logs and alarms."],
        ["Macie vs Inspector", "Macie finds sensitive data in S3. Inspector scans workloads for software vulnerabilities."],
        ["Budgets vs Cost Explorer", "Budgets alerts when spend passes a limit. Cost Explorer charts past spend."],
        ["Fine-tuning vs continued pre-training", "Fine-tuning uses labeled prompt and response pairs for a task. Continued pre-training uses unlabeled domain text."],
        ["Textract vs Rekognition", "Textract reads documents and forms. Rekognition understands pictures and video."],
      ],
    },
    {
      title: "Generative AI basics",
      items: [
        ["Token", "A chunk of text, often part of a word. You pay per input and output token"],
        ["Context window", "How many tokens the model can read at once, prompt plus reply"],
        ["Embedding", "A list of numbers that captures meaning. Close vectors mean similar meaning"],
        ["Vector store", "OpenSearch, Aurora PostgreSQL with pgvector, Neptune Analytics, DocumentDB, MemoryDB"],
        ["Hybrid search", "Vector plus keyword search in Knowledge Bases, on OpenSearch, Aurora PostgreSQL or MongoDB Atlas"],
        ["Transformer, diffusion", "Transformers power LLMs. Diffusion models create images by removing noise"],
        ["Hallucination", "Confident but false output. Reduce with RAG, grounding checks and low temperature"],
        ["Agent", "Plans, calls tools, checks results and repeats. MCP is the open standard for plugging in tools"],
      ],
    },
    {
      title: "Customizing a foundation model (cheapest first)",
      items: [
        ["Prompt engineering", "Zero-shot, few-shot, chain-of-thought and system prompts. No training."],
        ["RAG", "Fetch fresh documents when the question comes in (Bedrock Knowledge Bases plus a vector store). The model doesn't change."],
        ["Fine-tuning", "Labeled prompt and response pairs change the weights. Custom models are often served with Provisioned Throughput."],
        ["Continued pre-training", "Unlabeled text from your field deepens what the model knows"],
        ["Distillation", "A large teacher model trains a smaller, faster, cheaper student model"],
        ["Train from scratch", "The most expensive option. Rarely the right answer on the exam."],
      ],
    },
    {
      title: "Inference parameters",
      items: [
        ["Temperature", "Usually 0 to 1. Low (near 0) is focused and repeatable. High is creative and random"],
        ["Top P", "Picks from the likeliest tokens until their chances add up to P. A top P of 0.9 drops the unlikely tail"],
        ["Top K", "Picks from the K likeliest tokens. A small K is safer and less varied"],
        ["Max tokens", "Caps how long the answer can be, and so its cost"],
        ["Stop sequences", "Text that ends the answer as soon as it appears"],
        ["Rule of thumb", "Change temperature or top P, not both. Facts and code want low values"],
      ],
    },
    {
      title: "Bedrock cost levers",
      items: [
        ["Pick a smaller model", "The biggest lever. Test whether a smaller model is good enough"],
        ["Shorter prompts and replies", "Fewer tokens in and out, plus prompt caching for repeated context"],
        ["Intelligent Prompt Routing", "Sends each prompt to the cheapest model in a family that should answer it well"],
        ["Batch inference", "Big offline jobs at a lower price"],
        ["Inference profiles", "Tag usage per team or app to track cost. Cross-Region profiles add throughput"],
      ],
    },
    {
      title: "Metrics",
      items: [
        ["Confusion matrix", "Counts of true and false positives and negatives. Most classification metrics come from it"],
        ["Accuracy", "Correct answers divided by total. Misleading when one class is rare."],
        ["Precision", "TP / (TP+FP). Use when false alarms are costly, like spam filters."],
        ["Recall", "TP / (TP+FN). Use when misses are costly, like disease or fraud."],
        ["F1", "Balances precision and recall"],
        ["AUC-ROC", "How well a classifier separates classes across all cutoffs"],
        ["RMSE, MAE, R²", "How far off a regression model's numbers are. RMSE and MAE use the target's unit"],
        ["ROUGE, BLEU, BERTScore", "Summaries, translation, and closeness of meaning"],
        ["Perplexity", "How well a language model predicts text. Lower is better"],
        ["Business metrics", "Cost per user, conversion, time saved, customer satisfaction"],
      ],
    },
    {
      title: "Responsible AI",
      items: [
        ["Dimensions", "Fairness, explainability, privacy and security, safety, controllability, veracity and robustness, governance, transparency"],
        ["Bedrock Guardrails", "Content filters, denied topics, word filters, PII redaction, contextual grounding, Automated Reasoning checks and a prompt attack filter"],
        ["Bias checks", "Class imbalance (CI) and DPL before training. Compare results across groups after training"],
        ["SHAP", "Shows how much each input pushed a prediction"],
        ["Model Cards and AI Service Cards", "Documentation for governance and transparency"],
        ["Amazon A2I", "Sends low-confidence predictions to a person for review"],
        ["RLHF", "Steers models toward the answers people prefer"],
        ["Watermarks", "Titan Image Generator and Nova Canvas add an invisible watermark Bedrock can detect"],
        ["Legal risks", "Copyright and IP, biased output, hallucinations, loss of customer trust"],
      ],
    },
    {
      title: "Security and governance",
      items: [
        ["Shared responsibility", "AWS secures the cloud itself. You secure what's in it: data, IAM and configuration"],
        ["IAM", "Grant the least access needed, and use roles rather than access keys"],
        ["KMS", "Encryption keys for stored data, including customer managed keys for custom models"],
        ["PrivateLink", "Connects your VPC to Bedrock without the public internet"],
        ["Secrets Manager", "Stores API keys and rotates them"],
        ["CloudTrail, CloudWatch, Config", "Who called which API. Metrics, logs and alarms. Whether resources follow your rules"],
        ["Model invocation logging", "Stores Bedrock prompts and replies in CloudWatch Logs or S3. Off by default"],
        ["Artifact, Audit Manager, Trusted Advisor", "Download AWS compliance reports. Collect audit evidence. Best-practice checks on your account"],
        ["Macie, Inspector", "Find personal data in S3. Scan workloads for vulnerabilities"],
        ["Lake Formation", "Table, column and row access to a data lake"],
        ["Well-Architected Tool", "Review a workload against best practices. The Generative AI Lens adds AI questions"],
        ["Bedrock data privacy", "Your prompts and outputs aren't used to train the base models"],
        ["Threats", "Prompt injection, jailbreaks, data leakage, poisoned training data, toxic output"],
        ["Scoping Matrix", "Scope 1 consumer app, 2 enterprise app, 3 pre-trained model, 4 fine-tuned model, 5 self-trained model"],
        ["AgentCore Identity and Policy", "Control what agents can reach and which tool actions they can take"],
        ["Data governance", "Lifecycle, retention, residency, lineage, logging and monitoring"],
      ],
    },
    {
      title: "Data and compute services",
      items: [
        ["S3 and S3 Glacier", "Store training data and outputs. Glacier for cheap long-term archives"],
        ["Glue, DataBrew, EMR", "Serverless ETL and catalog. Visual data prep. Managed Spark and Hadoop"],
        ["Redshift, Data Exchange", "Data warehouse for SQL analytics. Subscribe to third-party datasets"],
        ["EC2, Lambda, ECS, EKS", "Virtual servers. Functions with no servers. Containers. Managed Kubernetes"],
        ["Cost tools", "AWS Budgets for alerts, Cost Explorer for history, cost allocation tags to split spend"],
      ],
    },
  ],

  boss: { name: "Hallucination Hydra", emoji: "🐉" },
  matchLabel: "AWS services",
  levelTitles: [
    "Cloud Novice",
    "Prompt Apprentice",
    "Token Tamer",
    "Embedding Explorer",
    "Model Wrangler",
    "Bedrock Builder",
    "Guardrail Guardian",
    "RAG Ranger",
    "AI Practitioner",
    "Foundation Master",
  ],
});
