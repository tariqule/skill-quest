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
      { icon: "⏱️", value: "90", label: "minutes", detail: "About 80 seconds per question. Plenty if you don't get stuck." },
      { icon: "🎯", value: "700", label: "to pass", detail: "Scaled score from 100 to 1000. You pass on the overall score, not per domain." },
      { icon: "🎲", value: "0", label: "guess penalty", detail: "Blank answers count as wrong. Always pick something." },
      { icon: "💵", value: "$100", label: "USD", detail: "Take it at a Pearson VUE test center or online with a proctor." },
      { icon: "📅", value: "3", label: "years valid", detail: "Then recertify." },
    ],
    candidate: {
      is: [
        "Someone with up to about 6 months of exposure to AI/ML on AWS",
        "A person who uses AI solutions, even if they don't build them",
        "Familiar with core AWS services like EC2, S3, Lambda, Bedrock, and SageMaker AI",
        "Knows the basics of IAM, the shared responsibility model, and AWS pricing",
      ],
      isNot: [
        "Writing code for models or algorithms",
        "Data or feature engineering",
        "Hyperparameter tuning or model optimisation",
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
      { icon: "🔎", tip: "Underline the requirement words: LEAST operational overhead, MOST cost-effective, NO code. They decide between two good answers." },
      { icon: "🪜", tip: "For customisation questions, the cheapest option that works wins: prompt → RAG → fine-tune → pre-train." },
      { icon: "🏷️", tip: "\"Managed\", \"no ML expertise\", or \"quickly\" usually points to a pre-built service or Bedrock, not SageMaker training." },
      { icon: "✂️", tip: "Eliminate the two clearly wrong answers first. Then compare the remaining two against the requirement words." },
      { icon: "🚩", tip: "Flag hard questions and move on. Come back with the time you saved." },
      { icon: "🎲", tip: "Never leave a blank. There is no penalty for guessing." },
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
        ["Supervised", "Labeled data → classification (categories) or regression (numbers)"],
        ["Unsupervised", "Unlabeled data → clustering, anomaly detection, dimensionality reduction"],
        ["Reinforcement", "Agent learns from rewards and penalties (AWS DeepRacer)"],
        ["Self-supervised", "Model creates its own labels from raw data; how FMs are pre-trained"],
      ],
    },
    {
      title: "Customizing a foundation model (cheapest first)",
      items: [
        ["Prompt engineering", "Zero-shot, few-shot, chain-of-thought, system prompts. No training."],
        ["RAG", "Retrieve fresh docs at query time (Bedrock Knowledge Bases + vector store). No weight changes."],
        ["Fine-tuning", "Labeled prompt-response pairs change the weights. Needs Provisioned Throughput."],
        ["Continued pre-training", "Unlabeled domain data deepens knowledge"],
        ["Train from scratch", "Most expensive. Rarely the right answer on the exam."],
      ],
    },
    {
      title: "Inference parameters",
      items: [
        ["Temperature", "↑ creative / random · ↓ focused / deterministic"],
        ["Top P", "Sample from tokens adding up to probability P"],
        ["Top K", "Sample from the K most likely tokens"],
        ["Max tokens", "Caps output length (and cost)"],
        ["Stop sequences", "Strings that end generation"],
      ],
    },
    {
      title: "Metrics",
      items: [
        ["Accuracy", "Correct / total. Misleading with imbalanced classes."],
        ["Precision", "TP / (TP+FP). Use when false positives are costly (spam)."],
        ["Recall", "TP / (TP+FN). Use when false negatives are costly (disease, fraud)."],
        ["F1", "Balance of precision and recall"],
        ["AUC-ROC", "Classifier quality across thresholds"],
        ["RMSE / MAE / R²", "Regression error"],
        ["ROUGE · BLEU · BERTScore", "Summaries · translation · semantic similarity"],
      ],
    },
    {
      title: "Responsible AI",
      items: [
        ["Dimensions", "Fairness, explainability, privacy & security, safety, controllability, veracity & robustness, governance, transparency"],
        ["Bedrock Guardrails", "Content filters, denied topics, word filters, PII redaction, contextual grounding, prompt attack filter"],
        ["SageMaker Clarify", "Bias detection + explainability (SHAP)"],
        ["Model Cards / AI Service Cards", "Documentation for governance"],
        ["Amazon A2I", "Human review of low-confidence predictions"],
        ["RLHF", "Align models with human preferences"],
      ],
    },
    {
      title: "Security & governance",
      items: [
        ["Shared responsibility", "AWS: security OF the cloud · You: security IN the cloud (data, IAM, config)"],
        ["IAM", "Least privilege, roles over access keys"],
        ["KMS", "Encryption keys at rest; customer managed keys for custom models"],
        ["PrivateLink", "VPC → Bedrock without the public internet"],
        ["CloudTrail vs CloudWatch vs Config", "Who called which API · metrics/logs/alarms · resource config compliance"],
        ["Artifact · Trusted Advisor", "Download AWS compliance reports · best-practice checks on your account"],
        ["Macie · Inspector", "Find PII in S3 · scan workloads for vulnerabilities"],
        ["Bedrock data privacy", "Your prompts are not used to train base models"],
        ["Scoping Matrix", "Scope 1 consumer app → 2 enterprise app → 3 pre-trained → 4 fine-tuned → 5 self-trained"],
        ["AgentCore Identity & Policy", "Control what agents can access and which tool actions they may take"],
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
