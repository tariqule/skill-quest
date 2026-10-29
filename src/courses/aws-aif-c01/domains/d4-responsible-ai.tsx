import { Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { GuardrailsLab } from "../labs";
import { BiasVariance, GuardrailsPipeline, TradeoffSlider } from "../visuals";

/**
 * Domain 4: everything for this exam domain in one file.
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d4",
    number: 4,
    name: "Guidelines for Responsible AI",
    world: "The Hall of Fairness",
    weight: 14,
    emoji: "⚖️",
    color: "#34d399",
    summary:
      "Bias, fairness, explainability, transparency, Guardrails, Clarify, model cards, and human review.",
  },

  tasks: [
    {
      id: "4.1",
      title: "Develop AI systems responsibly",
      covers: [
        "Features: bias, fairness, inclusivity, robustness, safety, veracity",
        "Tools such as Amazon Bedrock Guardrails",
        "Responsible model choice, including environmental impact and sustainability",
        "Legal risks: IP claims, biased output, lost trust, end-user risk, hallucinations",
        "Good datasets: inclusive, diverse, curated, balanced",
        "Bias and variance effects: demographic harm, overfitting, underfitting",
        "Detecting bias: label quality checks, human audits, subgroup analysis",
      ],
    },
    {
      id: "4.2",
      title: "Transparent and explainable models",
      covers: [
        "Transparent vs opaque models",
        "Tools: SageMaker Model Cards, Bedrock Model Evaluations, open models, data, and licences",
        "Trade-off between interpretability and performance",
        "Human-centred design: feedback mechanisms and decision transparency",
      ],
    },
  ],

  lessons: [
    {
      id: "d4-dimensions",
      check: ["d4-04", "d4-13"],
      task: "4.1",
      title: "What responsible AI means",
      visual: (
        <Tiles
          cols={4}
          tiles={[
            { icon: "⚖️", title: "Fairness", text: "Works equally well for all groups", color: "#34d399" },
            { icon: "🌈", title: "Inclusivity", text: "Represents everyone it serves", color: "#34d399" },
            { icon: "🛡️", title: "Safety", text: "Avoids harmful output", color: "#34d399" },
            { icon: "✅", title: "Veracity", text: "Truthful and accurate", color: "#34d399" },
            { icon: "🧱", title: "Robustness", text: "Holds up under odd inputs", color: "#34d399" },
            { icon: "🔍", title: "Explainability", text: "You can see why it decided", color: "#34d399" },
            { icon: "🔒", title: "Privacy & security", text: "Protects personal data", color: "#34d399" },
            { icon: "📋", title: "Governance", text: "Clear ownership and oversight", color: "#34d399" },
          ]}
        />
      ),
      points: ["Responsible model choice also weighs environmental impact: right-size the model to save energy."],
    },
    {
      id: "d4-bias",
      check: ["d4-03", "d4-14"],
      task: "4.1",
      title: "Bias and variance on a dartboard",
      visual: <BiasVariance />,
      points: [
        "Overfitting (high variance): great on training data, poor on new data.",
        "Underfitting (high bias): poor everywhere.",
        "Unbalanced or unrepresentative data can harm specific demographic groups.",
        "Detect with subgroup analysis, label-quality checks, human audits, and SageMaker Clarify.",
      ],
    },
    {
      id: "d4-guardrails",
      check: ["d4-02", "d4-10"],
      task: "4.1",
      title: "Amazon Bedrock Guardrails",
      visual: (
        <div className="grid gap-6">
          <GuardrailsPipeline />
          <GuardrailsLab />
        </div>
      ),
      points: [
        "Filters: harmful content, denied topics, banned words, PII, prompt attacks.",
        "Contextual grounding check flags answers not supported by the source documents.",
      ],
    },
    {
      id: "d4-legal",
      check: ["d4-09", "d4-12"],
      task: "4.1",
      title: "Legal risks and good data",
      visual: (
        <div className="grid gap-3 sm:grid-cols-2">
          <Tiles
            tiles={[
              { icon: "©️", title: "IP infringement", text: "Generated content may copy protected work", color: "#f87171" },
              { icon: "🫥", title: "Biased output", text: "Unfair results for some users", color: "#f87171" },
              { icon: "💔", title: "Loss of trust", text: "Customers stop believing you", color: "#f87171" },
              { icon: "🌀", title: "Hallucinations", text: "False claims reach end users", color: "#f87171" },
            ]}
          />
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3">
            <div className="font-semibold text-emerald-300">✅ A responsible dataset is…</div>
            <ul className="mt-2 grid gap-1.5 text-sm text-slate-200">
              <li>🌍 Inclusive and diverse</li>
              <li>⚖️ Balanced across groups</li>
              <li>🧹 Curated from trusted sources</li>
              <li>🤝 Collected with consent</li>
            </ul>
          </div>
        </div>
      ),
      points: ["Most of the fixes start with the data."],
    },
    {
      id: "d4-explain",
      check: ["d4-07", "d4-05"],
      task: "4.2",
      title: "Transparency vs performance",
      visual: <TradeoffSlider />,
      points: [
        "Tools: SageMaker Model Cards (document a model), SageMaker Clarify (explain with SHAP), Bedrock Model Evaluations.",
        "Open-source models, open data, and clear licences increase transparency.",
        "Human-centred design: show users why, let them give feedback. Amazon A2I adds human review.",
      ],
    },
    {
      id: "d4-compliance",
      check: ["d4-27", "d4-31"],
      task: "4.1 · 4.2",
      title: "Bias types, explainability, and compliance",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "🎯", title: "Sampling bias", text: "Training data doesn't represent the real population.", color: "#f87171" },
              { icon: "📏", title: "Measurement bias", text: "The tools or methods used to collect data are skewed.", color: "#f87171" },
              { icon: "👀", title: "Observer bias", text: "The person collecting or labeling data lets their views shape it.", color: "#f87171" },
              { icon: "🪞", title: "Confirmation bias", text: "Favouring information that confirms what you already believe.", color: "#f87171" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "📈", title: "Partial dependence plot", text: "Shows how one feature moves the prediction while others stay fixed. Useful for black-box models.", color: "#34d399" },
              { icon: "🏦", title: "Regulated workloads", text: "Finance, healthcare, aerospace: extra audit, archival, and reporting rules.", color: "#38bdf8" },
              { icon: "🧩", title: "Why AI compliance is hard", text: "Opaque decisions, models that change over time, emergent capabilities, and new risks like bias and misinformation.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "GenAI-specific challenges: toxicity, hallucinations, plagiarism and cheating, and prompt misuse.",
        "Fight toxicity by curating training data and filtering output with guardrails.",
        "Governance starts with people: an AI governance board (legal, compliance, privacy, AI experts) with clear roles, policies, and review processes.",
        "Regulations such as the EU AI Act push for transparent, explainable, accountable algorithms.",
      ],
    },
  ],

  questions: [
    {
      id: "d4-01",
      domain: "d4",
      lesson: "d4-explain",
      prompt: "Which SageMaker feature detects bias in data and models and explains predictions with feature importance?",
      options: ["SageMaker Clarify", "SageMaker Ground Truth", "SageMaker Pipelines", "SageMaker Neo"],
      answer: [0],
      explanation:
        "SageMaker Clarify detects pre-training and post-training bias and provides explainability using SHAP values.",
    },
    {
      id: "d4-02",
      domain: "d4",
      lesson: "d4-guardrails",
      prompt: "A GenAI app must block hate speech, filter specific denied topics, and redact PII in responses. Which feature?",
      options: ["Amazon Bedrock Guardrails", "AWS WAF", "Amazon Macie", "AWS Shield"],
      answer: [0],
      explanation:
        "Guardrails provide content filters, denied topics, word filters, sensitive information (PII) filters, contextual grounding checks, and automated reasoning checks.",
    },
    {
      id: "d4-03",
      domain: "d4",
      lesson: "d4-bias",
      prompt: "A loan approval model was trained mostly on data from one demographic group and performs poorly for others. What is this?",
      options: ["Sampling bias", "Overfitting to hyperparameters", "Latency", "Data encryption failure"],
      answer: [0],
      explanation:
        "When training data doesn't represent the population, the model can be unfair to under-represented groups. Fix with more representative, balanced data.",
    },
    {
      id: "d4-04",
      domain: "d4",
      lesson: "d4-dimensions",
      prompt: "Which are core dimensions of responsible AI? (Choose two.)",
      options: ["Fairness", "Explainability", "Maximum parameter count", "Lowest latency"],
      answer: [0, 1],
      explanation:
        "AWS responsible AI dimensions: fairness, explainability, privacy and security, safety, controllability, veracity and robustness, governance, and transparency.",
    },
    {
      id: "d4-05",
      domain: "d4",
      lesson: "d4-explain",
      prompt: "A team needs a standard document describing a model's intended use, training data, evaluation results, and risks. Which feature?",
      options: ["SageMaker Model Cards", "AWS Artifact", "Amazon Inspector", "AWS Config rules"],
      answer: [0],
      explanation: "SageMaker Model Cards document model details for governance and audits. AWS AI Service Cards cover AWS's own AI services.",
    },
    {
      id: "d4-06",
      domain: "d4",
      lesson: "d4-explain",
      prompt: "Which service adds human review to ML predictions, for example when model confidence is low?",
      options: ["Amazon Augmented AI (A2I)", "Amazon Polly", "AWS Glue", "Amazon Athena"],
      answer: [0],
      explanation:
        "Amazon A2I routes low-confidence or random-sample predictions to human reviewers (human-in-the-loop).",
    },
    {
      id: "d4-07",
      domain: "d4",
      lesson: "d4-explain",
      prompt: "A regulator requires a bank to explain why a loan was denied. What characteristic should the model have?",
      options: ["Explainability / interpretability", "High temperature", "Multimodality", "Large context window"],
      answer: [0],
      explanation:
        "There is a trade-off: simpler models (linear regression, decision trees) are more interpretable, while deep neural networks are more accurate but harder to explain.",
    },
    {
      id: "d4-08",
      domain: "d4",
      lesson: "d3-ladder",
      prompt: "Which technique helps improve a model's alignment with human preferences, for example helpfulness and harmlessness?",
      options: [
        "Reinforcement learning from human feedback (RLHF)",
        "K-means clustering",
        "Principal component analysis",
        "Batch transform",
      ],
      answer: [0],
      explanation: "RLHF trains a reward model from human rankings and uses it to steer the FM toward preferred responses.",
    },
    {
      id: "d4-09",
      domain: "d4",
      lesson: "d4-legal",
      prompt: "What legal risk is specific to generative AI outputs?",
      options: [
        "Intellectual property infringement from generated content",
        "Slow network speeds",
        "Lack of S3 storage",
        "Too many IAM users",
      ],
      answer: [0],
      explanation:
        "GenAI legal risks include IP and copyright claims, biased outputs, loss of customer trust, end-user risk, and hallucinations.",
    },
    {
      id: "d4-10",
      domain: "d4",
      lesson: "d4-guardrails",
      prompt: "What is the purpose of the contextual grounding check in Bedrock Guardrails?",
      options: [
        "To detect responses that are not grounded in the source documents or not relevant to the query",
        "To encrypt prompts",
        "To speed up inference",
        "To choose the AWS Region",
      ],
      answer: [0],
      explanation: "Contextual grounding checks flag hallucinations in RAG apps by scoring grounding and relevance.",
    },
    {
      id: "d4-11",
      domain: "d4",
      lesson: "d4-explain",
      prompt: "Which practice supports transparency in an AI system?",
      options: [
        "Disclosing to users that they are interacting with AI and documenting limitations",
        "Hiding the use of AI from users",
        "Removing all logs",
        "Using the largest model available",
      ],
      answer: [0],
      explanation: "Transparency means clearly communicating how the system works, its limitations, and when users are talking to AI.",
    },
    {
      id: "d4-12",
      domain: "d4",
      lesson: "d4-legal",
      prompt: "Which are characteristics of a good training dataset for responsible AI? (Choose two.)",
      options: ["Inclusive and diverse", "Balanced and curated", "As small as possible", "Collected without consent"],
      answer: [0, 1],
      explanation: "Responsible datasets are inclusive, diverse, balanced, curated, and collected with proper consent and privacy controls.",
    },
    {
      id: "d4-13",
      domain: "d4",
      lesson: "d4-dimensions",
      prompt: "Two models meet the accuracy target. One is much smaller and uses far less energy. What responsible AI consideration favours the smaller one?",
      options: ["Sustainability and environmental impact", "Higher hallucination rate", "Larger context window", "More parameters"],
      answer: [0],
      explanation: "Responsible model selection includes environmental impact. A right-sized model uses less compute and energy for the same outcome.",
    },
    {
      id: "d4-14",
      domain: "d4",
      lesson: "d4-bias",
      prompt: "Which methods help detect bias in a model's predictions? (Choose two.)",
      options: [
        "Subgroup analysis: compare performance across demographic groups",
        "Human audits of labels and outputs",
        "Raising the temperature",
        "Removing all evaluation data",
        "Using a larger context window",
      ],
      answer: [0, 1],
      explanation: "Bias shows up as different performance for different groups. Subgroup analysis, label-quality checks, and human audits surface it. SageMaker Clarify automates bias metrics.",
    },
    {
      id: "d4-15",
      domain: "d4",
      lesson: "d4-explain",
      prompt: "Which human-centred design practice improves explainable AI?",
      options: [
        "Show users why a decision was made and let them give feedback",
        "Hide that AI is involved",
        "Remove all logs",
        "Always use the most complex model",
      ],
      answer: [0],
      explanation: "Human-centred explainable AI makes decisions transparent and includes feedback mechanisms so people can question or correct the system.",
    },
    // ── Practice set 2 ──
    {
      id: "d4-16",
      domain: "d4",
      lesson: "d4-dimensions",
      prompt: "In responsible AI, what does fairness mean?",
      options: [
        "The model performs equitably across different groups of people",
        "The model is the cheapest available",
        "The model responds in under one second",
        "Every user gets identical output",
      ],
      answer: [0],
      explanation: "Fairness means outcomes and error rates don't unjustly differ across demographic groups.",
    },
    {
      id: "d4-17",
      domain: "d4",
      lesson: "d4-dimensions",
      prompt: "Which responsible AI dimension is about outputs being truthful and accurate?",
      options: ["Veracity", "Controllability", "Latency", "Modality"],
      answer: [0],
      explanation: "Veracity covers truthfulness. Grounding with RAG and grounding checks support it.",
    },
    {
      id: "d4-18",
      domain: "d4",
      lesson: "d4-dimensions",
      prompt: "A model should keep working well when users make typos or send unusual inputs. Which property is this?",
      options: ["Robustness", "Transparency", "Data residency", "Explainability"],
      answer: [0],
      explanation: "Robustness means reliable behaviour under noisy, unexpected, or adversarial inputs.",
    },
    {
      id: "d4-19",
      domain: "d4",
      lesson: "d4-dimensions",
      prompt: "A team wants to stop its assistant from giving instructions for dangerous activities. Which responsible AI dimension and tool apply?",
      options: [
        "Safety, enforced with Amazon Bedrock Guardrails",
        "Fairness, enforced with AWS Config",
        "Latency, enforced with Amazon CloudFront",
        "Explainability, enforced with Amazon Translate",
      ],
      answer: [0],
      explanation: "Safety is about avoiding harm. Guardrails content filters and denied topics block harmful requests and responses.",
    },
    {
      id: "d4-20",
      domain: "d4",
      lesson: "d4-bias",
      prompt: "Human labelers consistently mislabel photos of one demographic group. What should the team do first?",
      options: [
        "Audit label quality and fix the labels, ideally with diverse reviewers",
        "Train longer on the same labels",
        "Raise the model's temperature",
        "Delete the test set",
      ],
      answer: [0],
      explanation: "Biased labels teach biased models. Checking label quality and running human audits are key bias-detection steps.",
    },
    {
      id: "d4-21",
      domain: "d4",
      lesson: "d4-explain",
      prompt: "Which technique shows how much each input feature contributed to a single prediction?",
      options: ["SHAP values from SageMaker Clarify", "BLEU score", "Prompt caching", "Batch transform"],
      answer: [0],
      explanation: "SageMaker Clarify uses SHAP to explain feature contributions, both for one prediction and across the model.",
    },
    {
      id: "d4-22",
      domain: "d4",
      lesson: "d4-explain",
      prompt: "AWS publishes documents describing the intended uses, limitations, and design choices of its own AI services. What are they called?",
      options: ["AWS AI Service Cards", "AWS Artifact reports", "SageMaker Ground Truth jobs", "CloudTrail trails"],
      answer: [0],
      explanation: "AI Service Cards cover AWS's own AI services. SageMaker Model Cards are what you write for your own models.",
    },
    {
      id: "d4-23",
      domain: "d4",
      lesson: "d4-legal",
      prompt: "Why should a team review a foundation model's licence and training-data documentation before using it?",
      options: [
        "To understand permitted uses, IP risk, and how transparent the model is",
        "To make inference faster",
        "To reduce the context window",
        "Licences have no effect on AI use",
      ],
      answer: [0],
      explanation: "Open models, documented data, and clear licences increase transparency and reduce legal risk.",
    },
    {
      id: "d4-24",
      domain: "d4",
      lesson: "d4-explain",
      prompt:
        "A bank must explain every loan decision. A deep neural network is slightly more accurate than a decision tree. What is the responsible choice?",
      options: [
        "Prefer the interpretable model, or add explainability tools, because explanations are required",
        "Always choose the most accurate model regardless of explainability",
        "Hide the model choice from regulators",
        "Use a high temperature to vary decisions",
      ],
      answer: [0],
      explanation: "There is a trade-off between performance and interpretability. Regulatory explainability requirements can outweigh a small accuracy gain.",
    },
    {
      id: "d4-25",
      domain: "d4",
      lesson: "d4-legal",
      type: "match",
      prompt: "Match each responsible AI risk to a mitigation.",
      pairs: [
        ["Biased outputs", "Balance the training data and run subgroup analysis"],
        ["Hallucinations", "Ground answers with RAG and grounding checks"],
        ["Toxic content", "Bedrock Guardrails content filters"],
        ["Low-confidence predictions", "Human review with Amazon A2I"],
      ],
      explanation: "Each risk has a matching control: data fixes for bias, grounding for hallucinations, filters for toxicity, humans for uncertain cases.",
    },
    {
      id: "d4-26",
      domain: "d4",
      lesson: "d4-dimensions",
      prompt: "Which actions reduce the environmental impact of an AI workload? (Choose two.)",
      options: [
        "Choose the smallest model that meets the requirements",
        "Use efficient purpose-built hardware such as AWS Inferentia or Trainium",
        "Retrain the largest model every day without need",
        "Leave idle GPU instances running 24/7",
        "Always pick the biggest model available",
      ],
      answer: [0, 1],
      explanation: "Right-sizing models and using efficient hardware cut energy use, part of responsible model selection.",
    },
    // ── Practice set 3 ──
    {
      id: "d4-27",
      domain: "d4",
      lesson: "d4-compliance",
      prompt: "A hiring model was trained only on résumés from one city, so it treats applicants from elsewhere unfairly. Which bias is this?",
      options: ["Sampling bias", "Measurement bias", "Observer bias", "Confirmation bias"],
      answer: [0],
      explanation: "Sampling bias means the training data doesn't represent the population the model will serve.",
    },
    {
      id: "d4-28",
      domain: "d4",
      lesson: "d4-compliance",
      prompt: "A miscalibrated sensor records temperatures 3 degrees too high for every training example. Which bias does this introduce?",
      options: ["Measurement bias", "Sampling bias", "Confirmation bias", "Observer bias"],
      answer: [0],
      explanation: "Measurement bias comes from flawed tools or methods of collecting data.",
    },
    {
      id: "d4-29",
      domain: "d4",
      lesson: "d4-compliance",
      type: "match",
      prompt: "Match each type of bias to its example.",
      pairs: [
        ["Sampling bias", "Survey sent only to existing premium customers"],
        ["Measurement bias", "A scale that always reads 2 kg heavy"],
        ["Observer bias", "A labeler marks ambiguous photos to match their own expectation"],
        ["Confirmation bias", "An analyst keeps only results that support their hypothesis"],
      ],
      explanation: "Knowing where bias enters (sampling, measuring, labeling, interpreting) tells you where to fix it.",
    },
    {
      id: "d4-30",
      domain: "d4",
      lesson: "d4-compliance",
      prompt: "A team needs to show how changing one feature, such as income, shifts a black-box model's predictions while other features stay fixed. Which technique fits?",
      options: ["Partial dependence plots (PDP)", "ROUGE score", "Prompt caching", "Batch transform"],
      answer: [0],
      explanation: "PDPs improve interpretability for complex models such as neural networks.",
    },
    {
      id: "d4-31",
      domain: "d4",
      lesson: "d4-compliance",
      prompt: "Which describes a regulated workload?",
      options: ["A mortgage-approval model that must meet audit, archival, and reporting rules", "A personal photo filter app", "An internal brainstorming chatbot", "A game that suggests team names"],
      answer: [0],
      explanation: "Financial services, healthcare, and aerospace often carry extra compliance requirements.",
    },
    {
      id: "d4-32",
      domain: "d4",
      lesson: "d4-compliance",
      prompt: "Why is auditing AI systems for compliance harder than auditing traditional software? (Choose two.)",
      options: ["Their decisions can be complex and opaque", "They can change over time and show unexpected capabilities", "They never use data", "They always run on-premises", "They can't be logged"],
      answer: [0, 1],
      explanation: "Complexity and opacity, dynamism, emergent capabilities, and unique risks such as algorithmic bias make AI compliance challenging.",
    },
    {
      id: "d4-33",
      domain: "d4",
      lesson: "d4-compliance",
      prompt: "Which actions reduce toxic output from a generative model? (Choose two.)",
      options: ["Curate the training data to remove offensive content", "Filter outputs with guardrails", "Raise the temperature", "Use a larger context window", "Disable logging"],
      answer: [0, 1],
      explanation: "Clean training data plus output filtering (for example Bedrock Guardrails) are the main defences.",
    },
    {
      id: "d4-34",
      domain: "d4",
      lesson: "d4-compliance",
      prompt: "A school worries students will submit AI-written essays. Which GenAI challenge is this?",
      options: ["Plagiarism and cheating", "Model drift", "Data residency", "Underfitting"],
      answer: [0],
      explanation: "It's hard to trace the source of generated content, which has driven tools that detect AI-generated text and images.",
    },
    {
      id: "d4-35",
      domain: "d4",
      lesson: "d4-compliance",
      prompt: "Who should sit on an AI governance board?",
      options: ["Representatives from legal, compliance, data privacy, and AI subject-matter experts", "Only the data science team", "Only external vendors", "Only the CEO"],
      answer: [0],
      explanation: "A cross-functional board defines roles, policies, and review processes across the AI lifecycle.",
    },
  ],

  cards: [
    { id: "s-clarify", domain: "d4", kind: "service", term: "SageMaker Clarify", definition: "Detect bias and explain predictions (SHAP)" },
    { id: "s-modelcards", domain: "d4", kind: "service", term: "SageMaker Model Cards", definition: "Document a model's intended use, data, and risks" },
    { id: "s-a2i", domain: "d4", kind: "service", term: "Amazon Augmented AI (A2I)", definition: "Human review of low-confidence ML predictions" },
    { id: "c-guardrails", domain: "d4", kind: "concept", term: "Bedrock Guardrails", definition: "Filter harmful content, denied topics, PII, and ungrounded answers" },
    { id: "c-rlhf", domain: "d4", kind: "concept", term: "RLHF", definition: "Align a model to human preferences using human rankings" },
    { id: "c-sampling", domain: "d4", kind: "concept", term: "Sampling bias", definition: "Training data doesn't represent the real population" },
    { id: "c-measurement", domain: "d4", kind: "concept", term: "Measurement bias", definition: "Flawed tools or methods skew the data" },
    { id: "c-pdp", domain: "d4", kind: "concept", term: "Partial dependence plot", definition: "One feature's effect on predictions, others held fixed" },
    { id: "c-regulated", domain: "d4", kind: "concept", term: "Regulated workload", definition: "Extra audit, archival, and reporting rules (finance, health)" },
  ],

  challenges: [
    {
      id: "ch-guardrails",
      domain: "d4",
      lesson: "d4-guardrails",
      title: "Lock down the assistant",
      goal: "Every filter starts off. Turn on the right ones and send all three risky prompts so each is blocked or masked.",
      hint: "Each risky prompt needs a different filter: denied topic, prompt attack, or PII.",
      takeaway: "Bedrock Guardrails combine several filters. Each one targets a different risk.",
      render: (onSolved) => <GuardrailsLab goal="protect" onSolved={onSolved} />,
    },
  ],
});
