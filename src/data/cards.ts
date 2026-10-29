import type { DomainId } from "./domains";

export interface Card {
  id: string;
  domain: DomainId;
  kind: "service" | "concept";
  term: string;
  definition: string;
}

export const CARDS: Card[] = [
  // AWS AI services
  { id: "s-bedrock", domain: "d2", kind: "service", term: "Amazon Bedrock", definition: "Serverless API access to foundation models from many providers" },
  { id: "s-sagemaker", domain: "d1", kind: "service", term: "Amazon SageMaker AI", definition: "Build, train, and deploy your own ML models end to end" },
  { id: "s-jumpstart", domain: "d2", kind: "service", term: "SageMaker JumpStart", definition: "Hub of pre-trained models and solutions to deploy or fine-tune" },
  { id: "s-canvas", domain: "d1", kind: "service", term: "SageMaker Canvas", definition: "No-code ML predictions for business analysts" },
  { id: "s-clarify", domain: "d4", kind: "service", term: "SageMaker Clarify", definition: "Detect bias and explain predictions (SHAP)" },
  { id: "s-monitor", domain: "d1", kind: "service", term: "SageMaker Model Monitor", definition: "Detect data and model quality drift in production" },
  { id: "s-groundtruth", domain: "d1", kind: "service", term: "SageMaker Ground Truth", definition: "Human data labeling to build training datasets" },
  { id: "s-modelcards", domain: "d4", kind: "service", term: "SageMaker Model Cards", definition: "Document a model's intended use, data, and risks" },
  { id: "s-a2i", domain: "d4", kind: "service", term: "Amazon Augmented AI (A2I)", definition: "Human review of low-confidence ML predictions" },
  { id: "s-qdev", domain: "d2", kind: "service", term: "Amazon Q Developer", definition: "AI coding assistant in the IDE and AWS console" },
  { id: "s-qbiz", domain: "d2", kind: "service", term: "Amazon Q Business", definition: "GenAI assistant over enterprise data with user permissions" },
  { id: "s-rekognition", domain: "d1", kind: "service", term: "Amazon Rekognition", definition: "Image and video analysis: objects, faces, moderation" },
  { id: "s-comprehend", domain: "d1", kind: "service", term: "Amazon Comprehend", definition: "NLP: sentiment, entities, key phrases, PII in text" },
  { id: "s-textract", domain: "d1", kind: "service", term: "Amazon Textract", definition: "Extract text, forms, and tables from scanned documents" },
  { id: "s-transcribe", domain: "d1", kind: "service", term: "Amazon Transcribe", definition: "Speech to text" },
  { id: "s-polly", domain: "d1", kind: "service", term: "Amazon Polly", definition: "Text to lifelike speech" },
  { id: "s-translate", domain: "d1", kind: "service", term: "Amazon Translate", definition: "Neural machine translation between languages" },
  { id: "s-lex", domain: "d1", kind: "service", term: "Amazon Lex", definition: "Conversational chatbots with voice and text" },
  { id: "s-kendra", domain: "d3", kind: "service", term: "Amazon Kendra", definition: "ML-powered enterprise search in natural language" },
  { id: "s-personalize", domain: "d1", kind: "service", term: "Amazon Personalize", definition: "Real-time personalized recommendations" },
  { id: "s-forecast", domain: "d1", kind: "service", term: "Amazon Forecast", definition: "Time-series forecasting such as demand planning" },
  { id: "s-frauddetector", domain: "d1", kind: "service", term: "Amazon Fraud Detector", definition: "Detect online fraud such as fake accounts and payments" },
  { id: "s-cloudtrail", domain: "d5", kind: "service", term: "AWS CloudTrail", definition: "Audit log of API calls: who did what, when" },
  { id: "s-config", domain: "d5", kind: "service", term: "AWS Config", definition: "Track and evaluate resource configuration compliance" },
  { id: "s-kms", domain: "d5", kind: "service", term: "AWS KMS", definition: "Create and manage encryption keys" },
  { id: "s-macie", domain: "d5", kind: "service", term: "Amazon Macie", definition: "Discover sensitive data (PII) in S3" },
  { id: "s-artifact", domain: "d5", kind: "service", term: "AWS Artifact", definition: "Download AWS compliance reports (SOC, ISO)" },
  { id: "s-auditmgr", domain: "d5", kind: "service", term: "AWS Audit Manager", definition: "Continuously collect audit evidence against frameworks" },
  { id: "s-inspector", domain: "d5", kind: "service", term: "Amazon Inspector", definition: "Automated vulnerability scanning of workloads" },
  { id: "s-privatelink", domain: "d5", kind: "service", term: "AWS PrivateLink", definition: "Private connectivity from your VPC to AWS services" },

  // Bedrock features
  { id: "c-kb", domain: "d3", kind: "concept", term: "Bedrock Knowledge Bases", definition: "Managed RAG: ingest, chunk, embed, retrieve your documents" },
  { id: "c-agents", domain: "d3", kind: "concept", term: "Bedrock Agents", definition: "Orchestrate multi-step tasks that call APIs and knowledge bases" },
  { id: "c-guardrails", domain: "d4", kind: "concept", term: "Bedrock Guardrails", definition: "Filter harmful content, denied topics, PII, and ungrounded answers" },
  { id: "c-pt", domain: "d2", kind: "concept", term: "Provisioned Throughput", definition: "Reserved model capacity, required for custom models in Bedrock" },

  // Concepts
  { id: "c-rag", domain: "d3", kind: "concept", term: "RAG", definition: "Retrieve relevant documents at query time and add them to the prompt" },
  { id: "c-finetune", domain: "d3", kind: "concept", term: "Fine-tuning", definition: "Update model weights with labeled prompt-response examples" },
  { id: "c-cpt", domain: "d3", kind: "concept", term: "Continued pre-training", definition: "Teach domain knowledge using unlabeled data" },
  { id: "c-temp", domain: "d3", kind: "concept", term: "Temperature", definition: "Higher = more random and creative; lower = more focused" },
  { id: "c-topp", domain: "d3", kind: "concept", term: "Top P", definition: "Sample from tokens whose cumulative probability reaches P" },
  { id: "c-topk", domain: "d3", kind: "concept", term: "Top K", definition: "Sample only from the K most likely next tokens" },
  { id: "c-fewshot", domain: "d3", kind: "concept", term: "Few-shot prompting", definition: "Include a few input-output examples in the prompt" },
  { id: "c-cot", domain: "d3", kind: "concept", term: "Chain-of-thought", definition: "Ask the model to reason step by step" },
  { id: "c-injection", domain: "d3", kind: "concept", term: "Prompt injection", definition: "Malicious input that tries to override instructions" },
  { id: "c-token", domain: "d2", kind: "concept", term: "Token", definition: "A unit of text (word or sub-word) the model reads and writes" },
  { id: "c-embedding", domain: "d2", kind: "concept", term: "Embedding", definition: "A vector that captures semantic meaning for similarity search" },
  { id: "c-hallucination", domain: "d2", kind: "concept", term: "Hallucination", definition: "Confident but false or fabricated output" },
  { id: "c-transformer", domain: "d2", kind: "concept", term: "Transformer", definition: "Self-attention architecture behind modern LLMs" },
  { id: "c-diffusion", domain: "d2", kind: "concept", term: "Diffusion model", definition: "Generates images by iteratively removing noise" },
  { id: "c-overfit", domain: "d1", kind: "concept", term: "Overfitting", definition: "Great on training data, poor on new data" },
  { id: "c-underfit", domain: "d1", kind: "concept", term: "Underfitting", definition: "Poor on both training and new data" },
  { id: "c-precision", domain: "d1", kind: "concept", term: "Precision", definition: "TP / (TP + FP): how many flagged positives are real" },
  { id: "c-recall", domain: "d1", kind: "concept", term: "Recall", definition: "TP / (TP + FN): how many real positives you caught" },
  { id: "c-f1", domain: "d1", kind: "concept", term: "F1 score", definition: "Harmonic mean of precision and recall" },
  { id: "c-rouge", domain: "d3", kind: "concept", term: "ROUGE", definition: "N-gram overlap metric for summarization" },
  { id: "c-bleu", domain: "d3", kind: "concept", term: "BLEU", definition: "Metric for machine translation quality" },
  { id: "c-rlhf", domain: "d4", kind: "concept", term: "RLHF", definition: "Align a model to human preferences using human rankings" },
  { id: "c-shared", domain: "d5", kind: "concept", term: "Shared responsibility", definition: "AWS secures the cloud; you secure what you put in it" },
  { id: "c-leastpriv", domain: "d5", kind: "concept", term: "Least privilege", definition: "Grant only the permissions needed for the task" },
  { id: "c-poisoning", domain: "d5", kind: "concept", term: "Data poisoning", definition: "Corrupting training data to manipulate a model" },
];
