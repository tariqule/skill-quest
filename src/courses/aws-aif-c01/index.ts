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
      title: "Learning types",
      items: [
        ["Supervised", "Learns from labeled data. Used for classification (categories) or regression (numbers)"],
        ["Unsupervised", "Finds structure in unlabeled data: clustering, anomaly detection, dimensionality reduction"],
        ["Reinforcement", "An agent learns from rewards and penalties (AWS DeepRacer)"],
        ["Self-supervised", "The model makes its own labels from raw data. This is how FMs are pre-trained"],
      ],
    },
    {
      title: "Customizing a foundation model (cheapest first)",
      items: [
        ["Prompt engineering", "Zero-shot, few-shot, chain-of-thought and system prompts. No training."],
        ["RAG", "Fetch fresh documents when the question comes in (Bedrock Knowledge Bases plus a vector store). The model doesn't change."],
        ["Fine-tuning", "Labeled prompt and response pairs change the weights. Needs Provisioned Throughput."],
        ["Continued pre-training", "Unlabeled text from your field deepens what the model knows"],
        ["Train from scratch", "The most expensive option. Rarely the right answer on the exam."],
      ],
    },
    {
      title: "Inference parameters",
      items: [
        ["Temperature", "Higher is more creative and random. Lower is more focused and predictable"],
        ["Top P", "Picks from the likeliest tokens until their chances add up to P"],
        ["Top K", "Picks from the K likeliest tokens"],
        ["Max tokens", "Caps how long the answer can be, and so its cost"],
        ["Stop sequences", "Text that ends the answer as soon as it appears"],
      ],
    },
    {
      title: "Metrics",
      items: [
        ["Accuracy", "Correct answers divided by total. Misleading when one class is rare."],
        ["Precision", "TP / (TP+FP). Use when false alarms are costly, like spam filters."],
        ["Recall", "TP / (TP+FN). Use when misses are costly, like disease or fraud."],
        ["F1", "Balances precision and recall"],
        ["AUC-ROC", "How well a classifier separates classes across all cutoffs"],
        ["RMSE, MAE, R²", "How far off a regression model's numbers are"],
        ["ROUGE, BLEU, BERTScore", "Summaries, translation, and closeness of meaning"],
      ],
    },
    {
      title: "Responsible AI",
      items: [
        ["Dimensions", "Fairness, explainability, privacy and security, safety, controllability, veracity and robustness, governance, transparency"],
        ["Bedrock Guardrails", "Content filters, denied topics, word filters, PII redaction, contextual grounding and a prompt attack filter"],
        ["SageMaker Clarify", "Finds bias and explains predictions (SHAP)"],
        ["Model Cards and AI Service Cards", "Documentation for governance"],
        ["Amazon A2I", "Sends low-confidence predictions to a person for review"],
        ["RLHF", "Steers models toward the answers people prefer"],
      ],
    },
    {
      title: "Security and governance",
      items: [
        ["Shared responsibility", "AWS secures the cloud itself. You secure what's in it: data, IAM and configuration"],
        ["IAM", "Grant the least access needed, and use roles rather than access keys"],
        ["KMS", "Encryption keys for stored data, including customer managed keys for custom models"],
        ["PrivateLink", "Connects your VPC to Bedrock without the public internet"],
        ["CloudTrail, CloudWatch, Config", "Who called which API. Metrics, logs and alarms. Whether resources follow your rules"],
        ["Artifact, Trusted Advisor", "Download AWS compliance reports. Best-practice checks on your account"],
        ["Macie, Inspector", "Find personal data in S3. Scan workloads for vulnerabilities"],
        ["Bedrock data privacy", "Your prompts aren't used to train the base models"],
        ["Scoping Matrix", "Scope 1 consumer app, 2 enterprise app, 3 pre-trained model, 4 fine-tuned model, 5 self-trained model"],
        ["AgentCore Identity and Policy", "Control what agents can reach and which tool actions they can take"],
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
