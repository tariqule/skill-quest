import { Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { GuardrailsLab, SortLab } from "../labs";
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
      "Making AI fair, safe and honest: spotting bias, explaining decisions, being open with users, and the AWS tools that help, like Guardrails, Clarify, model cards and human review.",
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
    // ── Start here ──
    {
      id: "d4-start-fair",
      level: "beginner",
      check: ["aif-b4-01", "aif-b4-02"],
      task: "4.1",
      title: "Why AI can be unfair",
      visual: (
        <Flow
          color="#34d399"
          steps={[
            { icon: "📸", label: "Lopsided examples", sub: "Most training photos show one group of people" },
            { icon: "🧠", label: "The model learns", sub: "It gets very good at that group" },
            { icon: "😟", label: "Unfair results", sub: "It makes more mistakes for everyone else" },
          ]}
        />
      ),
      points: [
        "A model learns only from the examples you give it. If those examples are lopsided, its answers will be too.",
        "Imagine a chef who has only ever cooked for one friend. The food suits that friend perfectly and might not suit anyone else.",
        "When a model treats some groups of people worse than others, we call it **bias**. Making it work well for everyone is **fairness**.",
        "**Responsible AI** is the habit of checking for problems like this, and fixing them before they hurt real people.",
      ],
      tip: "If a question describes a model that works well for one group and badly for others, the usual cause is training data that doesn't represent everyone.",
    },
    {
      id: "d4-start-open",
      level: "beginner",
      check: ["aif-b4-03", "aif-b4-04"],
      task: "4.2",
      title: "Showing how the AI decided",
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "🔍", title: "Explain", text: "Show why the AI gave this answer, like a teacher showing the working.", color: "#34d399" },
            { icon: "📢", title: "Be open", text: "Tell people when they're talking to AI and what it can't do.", color: "#38bdf8" },
            { icon: "🙋", title: "Keep a human", text: "Let a person check the tricky or important cases.", color: "#a78bfa" },
          ]}
        />
      ),
      points: [
        "People trust a decision more when they can see the reasons behind it. That's true for AI as much as for a bank manager.",
        "**Explainability** means being able to say why the model gave a particular answer, like a maths teacher asking you to show your working.",
        "**Transparency** means being open: telling people they're dealing with AI and being honest about what it can't do.",
        "For important or uncertain cases, a person can review the AI's answer. This is called **human in the loop**.",
        "**SageMaker Model Cards** record a model's intended uses, risk rating, training details and evaluation results in one place.",
      ],
      tip: "When a regulator wants every decision explained, look for answers about explainability, simpler models or human review.",
    },

    // ── Exam lessons ──
    {
      id: "d4-dimensions",
      check: ["d4-04", "d4-13"],
      task: "4.1",
      title: "What responsible AI means",
      visual: (
        <Tiles
          cols={4}
          tiles={[
            { icon: "⚖️", title: "Fairness", text: "Works equally well for every group", color: "#34d399" },
            { icon: "🌈", title: "Inclusivity", text: "Represents everyone it serves", color: "#34d399" },
            { icon: "🛡️", title: "Safety", text: "Avoids harmful output", color: "#34d399" },
            { icon: "✅", title: "Veracity", text: "Truthful and accurate", color: "#34d399" },
            { icon: "🧱", title: "Robustness", text: "Copes with odd or messy input", color: "#34d399" },
            { icon: "🔍", title: "Explainability", text: "You can see why it decided", color: "#34d399" },
            { icon: "🔒", title: "Privacy and security", text: "Protects personal data", color: "#34d399" },
            { icon: "📋", title: "Governance", text: "Clear ownership and oversight", color: "#34d399" },
          ]}
        />
      ),
      points: [
        "Choosing a model responsibly also means thinking about the environment. A right-sized model does the same job with less energy.",
        "**Controllability** means you can steer and monitor how the AI system behaves.",
      ],
    },
    {
      id: "d4-bias",
      check: ["d4-03", "d4-14"],
      task: "4.1",
      title: "Bias and variance on a dartboard",
      visual: <BiasVariance />,
      points: [
        "**Overfitting**, also called high variance, means the model is great on training data and poor on new data.",
        "**Underfitting**, also called high bias, means the model is poor everywhere because it's too simple.",
        "Data that's unbalanced or doesn't represent everyone can harm particular groups of people.",
        "You find bias by comparing results across groups, checking label quality, having people audit outputs, and using SageMaker Clarify.",
        "A pre-training check: **class imbalance** (CI) shows when one group has far more samples than another.",
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
        "Guardrails check both what goes into the model and what comes out. They can block harmful content, topics you've banned, specific words, personal data and prompt attacks.",
        "The **contextual grounding check** flags answers that your source documents don't back up.",
        "Amazon's image models, Titan Image Generator and Nova Canvas, add an invisible **watermark**, so generated images can be detected later.",
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
              { icon: "©️", title: "IP infringement", text: "Generated content might copy someone's protected work", color: "#f87171" },
              { icon: "🫥", title: "Biased output", text: "Unfair results for some users", color: "#f87171" },
              { icon: "💔", title: "Loss of trust", text: "Customers stop believing you", color: "#f87171" },
              { icon: "🌀", title: "Hallucinations", text: "False claims reach the people using it", color: "#f87171" },
            ]}
          />
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3">
            <div className="font-semibold text-emerald-300">✅ A responsible dataset is…</div>
            <ul className="mt-2 grid gap-1.5 text-sm text-slate-200">
              <li>🌍 Inclusive and diverse</li>
              <li>⚖️ Balanced across groups</li>
              <li>🧹 Carefully chosen from trusted sources</li>
              <li>🤝 Collected with consent</li>
            </ul>
          </div>
        </div>
      ),
      points: [
        "Most of these problems are fixed at the source: the data the model learns from.",
        "Generated text or images can break **copyright** when they copy protected work.",
      ],
    },
    {
      id: "d4-explain",
      check: ["d4-07", "d4-05"],
      task: "4.2",
      title: "Transparency and performance",
      visual: <TradeoffSlider />,
      points: [
        "Your tools here are **SageMaker Model Cards** to document a model, **SageMaker Clarify** to explain predictions with SHAP, and **Bedrock Model Evaluations**.",
        "Open-source models, open data and clear licences all make a system more transparent.",
        "Design for people: show users why a decision was made and let them give feedback. **Amazon A2I** adds a human reviewer when you need one.",
        "**Interpretability** is how easily a person can follow the model's logic. Simpler models are more interpretable, so there is often a trade-off with accuracy.",
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
              { icon: "🎯", title: "Sampling bias", text: "The training data doesn't match the real population.", color: "#f87171" },
              { icon: "📏", title: "Measurement bias", text: "The tools or methods used to collect data are off.", color: "#f87171" },
              { icon: "👀", title: "Observer bias", text: "The person collecting or labeling data lets their own views shape it.", color: "#f87171" },
              { icon: "🪞", title: "Confirmation bias", text: "Favouring information that backs up what you already believe.", color: "#f87171" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "📈", title: "Partial dependence plot", text: "Shows how changing one input moves the prediction while the others stay fixed. Handy for black-box models.", color: "#34d399" },
              { icon: "🏦", title: "Regulated workloads", text: "Finance, healthcare, aerospace: extra rules for audits, record keeping and reporting.", color: "#38bdf8" },
              { icon: "🧩", title: "Why AI compliance is hard", text: "Decisions are hard to see inside, models change over time, new abilities appear, and there are new risks like bias and misinformation.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Generative AI brings its own problems: toxic content, hallucinations, plagiarism and cheating, and people misusing prompts.",
        "To fight toxic output, clean up the training data and filter answers with guardrails.",
        "Good governance starts with people. An **AI governance board** brings together legal, compliance, privacy and AI experts, with clear roles, policies and reviews.",
        "Laws like the EU AI Act push for algorithms that are transparent, explainable and accountable.",
      ],
    },
  ],

  questions: [
    // ── Start here ──
    {
      id: "aif-b4-01",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-fair",
      prompt: "A face-recognition model was trained mostly on photos of one group of people. What's likely to happen?",
      options: [
        "It makes more mistakes for people outside that group",
        "It works equally well for everyone it sees, in every photo",
        "It stops working completely on new photos",
        "It gets more accurate for every group over time",
      ],
      answer: [0],
      explanation:
        "A model only learns from what it's shown. If the photos are lopsided, it gets good at one group and worse at others. That unfairness is called bias.",
    },
    {
      id: "aif-b4-02",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-fair",
      prompt: "What does fairness mean for an AI system?",
      options: [
        "It works well for all the groups of people who use it",
        "It is free for everyone to use, whoever they are",
        "It gives every user exactly the same answer each time",
        "It answers every user within one second, every time",
      ],
      answer: [0],
      explanation:
        "Fairness means the model's quality doesn't drop for some groups of people. It isn't about price or speed, and different questions can still get different answers.",
    },
    {
      id: "aif-b4-03",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-open",
      prompt: "A bank's AI turns down a loan, and the customer asks why. Which idea is about being able to answer that question?",
      options: [
        "Explainability",
        "Low latency",
        "Scalability",
        "Model temperature",
      ],
      answer: [0],
      explanation:
        "Explainability means you can say why the model reached its decision, like showing your working in maths. It builds trust, and in some industries the law requires it.",
    },
    {
      id: "aif-b4-04",
      domain: "d4",
      level: "beginner",
      lesson: "d4-start-open",
      prompt: "An AI isn't sure about a medical insurance claim. What's the responsible next step?",
      options: [
        "Send the claim to a person to review",
        "Approve it anyway to save time",
        "Reject it without telling anyone",
        "Ask the AI the same question until it's sure",
      ],
      answer: [0],
      explanation:
        "When the AI is unsure and the decision matters, a person should check it. Keeping a human in the loop catches mistakes before they affect someone.",
    },

    // ── Exam questions ──
    {
      id: "d4-01",
      domain: "d4",
      lesson: "d4-explain",
      prompt: "Which SageMaker feature finds bias in data and models, and explains predictions by showing which features mattered most?",
      options: ["SageMaker Clarify", "SageMaker Ground Truth", "SageMaker Pipelines", "SageMaker Neo"],
      answer: [0],
      explanation:
        "SageMaker Clarify checks for bias both before and after training. It explains predictions using SHAP values, which show how much each feature contributed. Note: AWS has closed Clarify to new customers, though existing customers can still use it and the exam guide still covers it.",
    },
    {
      id: "d4-02",
      domain: "d4",
      lesson: "d4-guardrails",
      prompt: "A GenAI app must block hate speech, refuse certain topics and hide personal data in its replies. Which feature does this?",
      options: [
        "Amazon Bedrock Guardrails",
        "AWS WAF managed rule groups",
        "Amazon Macie",
        "Amazon Comprehend",
      ],
      answer: [0],
      explanation:
        "Bedrock Guardrails gives you content filters, denied topics, word filters, filters for sensitive information like PII, contextual grounding checks and automated reasoning checks.",
    },
    {
      id: "d4-03",
      domain: "d4",
      lesson: "d4-bias",
      prompt: "A loan approval model was trained mostly on data from one demographic group and does badly for others. What is this?",
      options: ["Sampling bias", "Overfitting to hyperparameters", "Latency", "Data encryption failure"],
      answer: [0],
      explanation:
        "When the training data doesn't represent the people the model will serve, it can be unfair to the groups that were left out. The fix is more representative, balanced data.",
    },
    {
      id: "d4-04",
      domain: "d4",
      lesson: "d4-dimensions",
      prompt: "Which of these are core dimensions of responsible AI? (Choose two.)",
      options: ["Fairness", "Explainability", "Maximum parameter count", "Lowest latency"],
      answer: [0, 1],
      explanation:
        "AWS lists these dimensions: fairness, explainability, privacy and security, safety, controllability, veracity and robustness, governance, and transparency. Size and speed aren't on the list.",
    },
    {
      id: "d4-05",
      domain: "d4",
      lesson: "d4-explain",
      prompt: "A team needs a standard document that records a model's intended use, training data, test results and risks. Which feature fits?",
      options: [
        "SageMaker Model Cards",
        "SageMaker Model Registry",
        "SageMaker Model Monitor",
        "AWS Audit Manager",
      ],
      answer: [0],
      explanation: "SageMaker Model Cards record the details of your model for governance and audits. AWS AI Service Cards are the equivalent for AWS's own AI services.",
    },
    {
      id: "d4-06",
      domain: "d4",
      lesson: "d4-explain",
      prompt: "Which service adds human review to ML predictions, for example when the model isn't confident?",
      options: [
        "Amazon Augmented AI (A2I)",
        "SageMaker Ground Truth Plus",
        "SageMaker Clarify",
        "SageMaker Model Monitor",
      ],
      answer: [0],
      explanation:
        "Amazon A2I sends low-confidence predictions, or a random sample of them, to human reviewers. This is known as human in the loop.",
    },
    {
      id: "d4-07",
      domain: "d4",
      lesson: "d4-explain",
      prompt: "A regulator requires a bank to explain why a loan was turned down. What does the model need?",
      options: [
        "Explainability",
        "High temperature",
        "Multimodal input",
        "Large context window",
      ],
      answer: [0],
      explanation:
        "There's a trade-off here. Simpler models, like linear regression or decision trees, are easy to explain. Deep neural networks can be more accurate, but they're much harder to explain.",
    },
    {
      id: "d4-08",
      domain: "d4",
      lesson: "d3-ladder",
      prompt: "Which technique helps a model line up with what people want, such as being helpful and harmless?",
      options: [
        "Reinforcement learning from human feedback (RLHF)",
        "Continued pre-training on unlabeled web text",
        "K-means clustering of preferred responses",
        "Principal component analysis on the model weights",
      ],
      answer: [0],
      explanation: "In RLHF, people rank the model's answers. Those rankings train a reward model, which then steers the foundation model toward the answers people prefer.",
    },
    {
      id: "d4-09",
      domain: "d4",
      lesson: "d4-legal",
      prompt: "Which legal risk comes specifically from generative AI output?",
      options: [
        "Intellectual property infringement from generated content",
        "Slow network speeds between the app and the hosted model endpoint",
        "Running out of S3 storage for the generated files",
        "Having too many IAM users with access to the model",
      ],
      answer: [0],
      explanation:
        "Generated content can copy someone else's protected work. Other GenAI legal risks are biased output, losing customer trust, harm to the people using it, and hallucinations.",
    },
    {
      id: "d4-10",
      domain: "d4",
      lesson: "d4-guardrails",
      prompt: "What is the contextual grounding check in Bedrock Guardrails for?",
      options: [
        "To detect answers not grounded in the sources or not relevant to the query",
        "To encrypt each prompt with a KMS key before it is sent to the foundation model",
        "To block prompts that mention topics the company has denied",
        "To mask personal data, such as phone numbers, in the response",
      ],
      answer: [0],
      explanation: "In RAG apps, the grounding check scores each answer on two things: is it backed by the source documents, and is it relevant to the question? That catches hallucinations.",
    },
    {
      id: "d4-11",
      domain: "d4",
      lesson: "d4-explain",
      prompt: "Which practice supports transparency in an AI system?",
      options: [
        "Telling users they are talking to AI and documenting its limits",
        "Hiding the use of AI so users trust the answers more",
        "Deleting all logs so nobody can see how decisions were made",
        "Using the largest model available so that answers are more accurate",
      ],
      answer: [0],
      explanation: "Transparency means being clear about how the system works, what it can't do, and when people are talking to AI.",
    },
    {
      id: "d4-12",
      domain: "d4",
      lesson: "d4-legal",
      prompt: "Which are signs of a good training dataset for responsible AI? (Choose two.)",
      options: ["Inclusive and diverse", "Balanced and curated", "As small as possible", "Collected without consent"],
      answer: [0, 1],
      explanation: "A responsible dataset is inclusive, diverse, balanced and carefully chosen. It's also collected with proper consent and privacy controls.",
    },
    {
      id: "d4-13",
      domain: "d4",
      lesson: "d4-dimensions",
      prompt: "Two models both hit the accuracy target. One is much smaller and uses far less energy. Which responsible AI consideration favours the smaller one?",
      options: [
        "Sustainability",
        "Fewer hallucinations",
        "Larger context window",
        "More parameters",
      ],
      answer: [0],
      explanation: "Choosing a model responsibly includes its effect on the environment. A right-sized model gets the same result with less computing power and energy.",
    },
    {
      id: "d4-14",
      domain: "d4",
      lesson: "d4-bias",
      prompt: "Which methods help find bias in a model's predictions? (Choose two.)",
      options: [
        "Subgroup analysis: compare performance across demographic groups",
        "Human audits of labels and outputs",
        "Raising the temperature",
        "Removing all evaluation data",
        "Using a larger context window",
      ],
      answer: [0, 1],
      explanation: "Bias shows up as a model doing better for some groups than others. Comparing groups, checking labels and human audits bring it to light. SageMaker Clarify calculates bias metrics for you.",
    },
    {
      id: "d4-15",
      domain: "d4",
      lesson: "d4-explain",
      prompt: "Which human-centred design practice makes AI easier to explain and trust?",
      options: [
        "Show users why a decision was made and let them give feedback",
        "Hide that AI is involved so users judge the answer on its merits",
        "Remove the logs so that users' feedback can't be traced back",
        "Always use the most complex model so the decisions are better",
      ],
      answer: [0],
      explanation: "Designing for people means showing how decisions were reached and giving them a way to push back, so they can question or correct the system.",
    },
    // ── Practice set 2 ──
    {
      id: "d4-16",
      domain: "d4",
      lesson: "d4-dimensions",
      prompt: "In responsible AI, what does fairness mean?",
      options: [
        "The model performs equitably across different groups of people",
        "The model is the cheapest one available for the task at hand",
        "The model responds to every single request in under one second",
        "Every user gets exactly the same output for any prompt",
      ],
      answer: [0],
      explanation: "Fairness means the results and error rates don't differ unjustly between groups of people.",
    },
    {
      id: "d4-17",
      domain: "d4",
      lesson: "d4-dimensions",
      prompt: "Which responsible AI dimension is about answers being truthful and accurate?",
      options: ["Veracity", "Controllability", "Latency", "Modality"],
      answer: [0],
      explanation: "Veracity means truthfulness. Grounding answers with RAG and using grounding checks both support it.",
    },
    {
      id: "d4-18",
      domain: "d4",
      lesson: "d4-dimensions",
      prompt: "A model should keep working well when users make typos or send strange inputs. Which property is this?",
      options: ["Robustness", "Transparency", "Data residency", "Explainability"],
      answer: [0],
      explanation: "Robustness means the model behaves reliably even when the input is messy, unexpected or deliberately tricky.",
    },
    {
      id: "d4-19",
      domain: "d4",
      lesson: "d4-dimensions",
      prompt: "A team wants to stop its assistant from giving instructions for dangerous activities. Which responsible AI dimension and tool apply?",
      options: [
        "Safety, enforced with Amazon Bedrock Guardrails",
        "Fairness, enforced with SageMaker Clarify",
        "Veracity, enforced with Bedrock Knowledge Bases",
        "Explainability, enforced with SageMaker Model Cards",
      ],
      answer: [0],
      explanation: "Safety is about avoiding harm. Guardrails content filters and denied topics block harmful requests and harmful replies.",
    },
    {
      id: "d4-20",
      domain: "d4",
      lesson: "d4-bias",
      prompt: "Human labelers keep mislabeling photos of one demographic group. What should the team do first?",
      options: [
        "Audit label quality and fix the labels, ideally with diverse reviewers",
        "Train for more epochs on the same labels so the model learns the group",
        "Collect more photos of other groups so the mislabeled ones matter less",
        "Raise the model's decision threshold for that demographic group only",
      ],
      answer: [0],
      explanation: "A model trained on biased labels learns the bias. Checking label quality and having people audit them are key steps in finding bias.",
    },
    {
      id: "d4-21",
      domain: "d4",
      lesson: "d4-explain",
      prompt: "Which technique shows how much each input feature contributed to a single prediction?",
      options: [
        "SHAP values from SageMaker Clarify",
        "BLEU score against reference answers",
        "Partial dependence plots overall",
        "Confusion matrix of the test set",
      ],
      answer: [0],
      explanation: "SageMaker Clarify uses SHAP to show how much each feature pushed the prediction, for one prediction or across the whole model.",
    },
    {
      id: "d4-22",
      domain: "d4",
      lesson: "d4-explain",
      prompt: "AWS publishes documents describing the intended uses, limits and design choices of its own AI services. What are they called?",
      options: ["AWS AI Service Cards", "AWS Artifact reports", "SageMaker Ground Truth jobs", "CloudTrail trails"],
      answer: [0],
      explanation: "AI Service Cards cover AWS's own AI services. SageMaker Model Cards are the ones you write for your own models.",
    },
    {
      id: "d4-23",
      domain: "d4",
      lesson: "d4-legal",
      prompt: "Why should a team read a foundation model's licence and training-data documentation before using it?",
      options: [
        "To understand permitted uses, IP risk and how open the model is",
        "To find out which instance type gives the fastest inference for it",
        "To learn how to reduce the context window for cheaper calls",
        "To check the token price for each Region before you deploy",
      ],
      answer: [0],
      explanation: "The licence tells you what you're allowed to do with the model. Open models, documented data and clear licences make things more transparent and lower your legal risk.",
    },
    {
      id: "d4-24",
      domain: "d4",
      lesson: "d4-explain",
      prompt:
        "A bank must explain every loan decision. A deep neural network is slightly more accurate than a decision tree. What's the responsible choice?",
      options: [
        "Prefer the interpretable model, or add explainability tools",
        "Always choose the most accurate model, whatever explanations cost",
        "Use the neural network and keep the model choice from regulators",
        "Use both and pick whichever answer the customer is happier with",
      ],
      answer: [0],
      explanation: "You're trading a little accuracy for a lot of explainability. When the rules require explanations, that usually beats a small gain in accuracy.",
    },
    {
      id: "d4-25",
      domain: "d4",
      lesson: "d4-legal",
      type: "match",
      prompt: "Match each responsible AI risk to a way of reducing it.",
      pairs: [
        ["Biased outputs", "Balance the training data and run subgroup analysis"],
        ["Hallucinations", "Ground answers with RAG and grounding checks"],
        ["Toxic content", "Bedrock Guardrails content filters"],
        ["Low-confidence predictions", "Human review with Amazon A2I"],
      ],
      explanation: "Each risk has a matching control. Fix the data for bias, ground the answers for hallucinations, filter toxic content, and bring in people for uncertain cases.",
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
      explanation: "Using a right-sized model and efficient hardware both cut energy use. That's part of choosing a model responsibly.",
    },
    // ── Practice set 3 ──
    {
      id: "d4-27",
      domain: "d4",
      lesson: "d4-compliance",
      prompt: "A hiring model was trained only on résumés from one city, so it treats applicants from elsewhere unfairly. Which bias is this?",
      options: ["Sampling bias", "Measurement bias", "Observer bias", "Confirmation bias"],
      answer: [0],
      explanation: "Sampling bias means the training data doesn't represent the people the model will actually serve. Here, everyone outside that one city was missing.",
    },
    {
      id: "d4-28",
      domain: "d4",
      lesson: "d4-compliance",
      prompt: "A faulty sensor records every temperature 3 degrees too high in the training data. Which bias does this cause?",
      options: ["Measurement bias", "Sampling bias", "Confirmation bias", "Observer bias"],
      answer: [0],
      explanation: "Measurement bias comes from faulty tools or methods for collecting data. The data is consistently off, so the model learns the error too.",
    },
    {
      id: "d4-29",
      domain: "d4",
      lesson: "d4-compliance",
      type: "match",
      prompt: "Match each type of bias to an example of it.",
      pairs: [
        ["Sampling bias", "Survey sent only to existing premium customers"],
        ["Measurement bias", "A scale that always reads 2 kg heavy"],
        ["Observer bias", "A labeler marks ambiguous photos to match their own expectation"],
        ["Confirmation bias", "An analyst keeps only results that support their hypothesis"],
      ],
      explanation: "Knowing where bias creeps in, whether in sampling, measuring, labeling or interpreting, tells you where to fix it.",
    },
    {
      id: "d4-30",
      domain: "d4",
      lesson: "d4-compliance",
      prompt: "A team needs to show how changing one input, such as income, shifts a black-box model's predictions while the other inputs stay fixed. Which technique fits?",
      options: [
        "Partial dependence plots (PDP)",
        "SHAP values for one prediction",
        "ROUGE score on model outputs",
        "A confusion matrix by class",
      ],
      answer: [0],
      explanation: "A partial dependence plot shows the effect of one input on its own. That makes complex models, like neural networks, easier to understand.",
    },
    {
      id: "d4-31",
      domain: "d4",
      lesson: "d4-compliance",
      prompt: "Which of these is a regulated workload?",
      options: [
        "A mortgage-approval model that must meet audit and reporting rules",
        "A personal photo filter app that suggests the best colour settings",
        "An internal brainstorming chatbot used by the marketing team",
        "A game that suggests fun team names for an office quiz night",
      ],
      answer: [0],
      explanation: "Industries like finance, healthcare and aerospace often come with extra compliance rules for audits, record keeping and reporting.",
    },
    {
      id: "d4-32",
      domain: "d4",
      lesson: "d4-compliance",
      prompt: "Why is checking AI systems for compliance harder than checking normal software? (Choose two.)",
      options: ["Their decisions can be complex and opaque", "They can change over time and show unexpected capabilities", "They never use data", "They always run on-premises", "They can't be logged"],
      answer: [0, 1],
      explanation: "AI decisions can be hard to see inside, models change over time, new abilities can appear, and there are new risks like algorithmic bias. All of that makes compliance tricky.",
    },
    {
      id: "d4-33",
      domain: "d4",
      lesson: "d4-compliance",
      prompt: "Which actions reduce toxic output from a generative model? (Choose two.)",
      options: ["Curate the training data to remove offensive content", "Filter outputs with guardrails", "Raise the temperature", "Use a larger context window", "Disable logging"],
      answer: [0, 1],
      explanation: "The two main defences are clean training data and filtering the output, for example with Bedrock Guardrails.",
    },
    {
      id: "d4-34",
      domain: "d4",
      lesson: "d4-compliance",
      prompt: "A school worries students will hand in essays written by AI. Which GenAI challenge is this?",
      options: [
        "Plagiarism and cheating",
        "Model drift over time",
        "Data residency rules",
        "Underfitting the essays",
      ],
      answer: [0],
      explanation: "It's hard to tell where generated content came from. That's why tools for detecting AI-written text and images have appeared.",
    },
    {
      id: "d4-35",
      domain: "d4",
      lesson: "d4-compliance",
      prompt: "Who should sit on an AI governance board?",
      options: [
        "People from legal, compliance, privacy and AI expertise",
        "Only the data science team that builds and ships the models",
        "Only the external vendors who supply the models",
        "Only the CEO and the board of directors",
      ],
      answer: [0],
      explanation: "A board drawn from several teams sets the roles, policies and review steps for the whole life of an AI system. No single team sees every risk.",
    },

    // ── Added: AIF-C01 coverage gaps ──
    {
      "id": "aif-b4-05",
      "domain": "d4",
      "lesson": "d4-start-open",
      "prompt": "A company writes a short document that says what its model is for, what data trained it and where it shouldn't be used. What is that document called?",
      "options": [
        "A model card",
        "A price list",
        "A service quota",
        "A billing alarm"
      ],
      "answer": [
        0
      ],
      "explanation": "A model card is like the label on a medicine box. It tells people what the model is meant for, how it was tested and its known limits. SageMaker Model Cards gives you a template for it.",
      "level": "beginner"
    },
    {
      "id": "aif-b4-06",
      "domain": "d4",
      "lesson": "d4-start-fair",
      "prompt": "Which training data is most likely to give a fair model?",
      "options": [
        "Data that covers all the groups who will use it",
        "Data collected from a single city during one week in summer",
        "Data copied from one customer's old records",
        "Data that only includes the most common case"
      ],
      "answer": [
        0
      ],
      "explanation": "A model learns from the examples it sees. If every group that will use it shows up in the data, it's less likely to fail for some of them.",
      "level": "beginner"
    },
    {
      "id": "d4-36",
      "domain": "d4",
      "lesson": "d4-explain",
      "prompt": "A team wants people outside the company to see a model's intended uses, training details and evaluation results in one place. Which SageMaker feature fits?",
      "options": [
        "SageMaker Model Cards",
        "SageMaker Feature Store",
        "SageMaker Model Monitor",
        "SageMaker Data Wrangler"
      ],
      "answer": [
        0
      ],
      "explanation": "SageMaker Model Cards records a model's purpose, risk rating, training details and evaluation results, so everyone reads the same facts."
    },
    {
      "id": "d4-37",
      "domain": "d4",
      "lesson": "d4-explain",
      "prompt": "A model card should be updated when the model is retrained. Why?",
      "options": [
        "The facts about its data and results have changed",
        "Model cards expire after thirty days by default in SageMaker",
        "A card is needed to turn on the endpoint",
        "Retraining deletes the old card automatically"
      ],
      "answer": [
        0
      ],
      "explanation": "A model card is only useful if it's true. New training data or new evaluation results mean the card needs a new version."
    },
    {
      "id": "d4-38",
      "domain": "d4",
      "lesson": "d4-guardrails",
      "prompt": "An app sends low-confidence predictions from a custom model to people for review. Which AWS service sets up that human review workflow?",
      "options": [
        "Amazon Augmented AI (A2I)",
        "Amazon SageMaker Clarify bias reports",
        "Amazon Comprehend",
        "AWS Audit Manager"
      ],
      "answer": [
        0
      ],
      "explanation": "Amazon A2I builds human review loops. It has built-in workflows for Amazon Textract and Amazon Rekognition, and a custom task type for any other model."
    },
    {
      "id": "d4-39",
      "domain": "d4",
      "lesson": "d4-guardrails",
      "prompt": "Which services have a built-in Amazon A2I human review task type? (Choose two.)",
      "options": [
        "Amazon Textract",
        "Amazon Rekognition",
        "Amazon Polly",
        "Amazon Lex",
        "Amazon Kendra"
      ],
      "answer": [
        0,
        1
      ],
      "explanation": "A2I's two built-in task types are Textract key-value extraction and Rekognition image moderation. For anything else you use a custom task type."
    },
    {
      "id": "d4-40",
      "domain": "d4",
      "lesson": "d4-guardrails",
      "prompt": "With a built-in A2I workflow, when does a document go to a human reviewer?",
      "options": ["When the activation conditions you set are met, such as low confidence","Every time the model runs, with no way to filter which predictions go to people","Only when the end user clicks a report problem button","Only once a month, during a scheduled batch review job"],
      "answer": [
        0
      ],
      "explanation": "You set activation conditions, for example a confidence below a threshold. Only predictions that meet them start a human loop."
    },
    {
      "id": "d4-41",
      "domain": "d4",
      "lesson": "d4-guardrails",
      "prompt": "A chatbot must never talk about a competitor's products. Which Bedrock Guardrails setting handles this?",
      "options": [
        "A denied topic",
        "A contextual grounding check",
        "A sensitive information filter",
        "A word count limit"
      ],
      "answer": [
        0
      ],
      "explanation": "Denied topics let you describe subjects the app must refuse, in plain language. The guardrail blocks prompts and replies that match."
    },
    {
      "id": "d4-42",
      "domain": "d4",
      "lesson": "d4-guardrails",
      "prompt": "Which Bedrock Guardrails feature checks that a RAG answer is supported by the retrieved source text?",
      "options": ["Contextual grounding check","Prompt attack filter on input","Denied topic list for the app","Profanity word filter on replies"],
      "answer": [
        0
      ],
      "explanation": "The contextual grounding check scores whether an answer is grounded in the source and relevant to the question. It catches answers the documents don't back up."
    },
    {
      "id": "d4-43",
      "domain": "d4",
      "lesson": "d4-dimensions",
      "prompt": "Which are core dimensions of responsible AI on AWS? (Choose three.)",
      "options": [
        "Fairness",
        "Explainability",
        "Privacy and security",
        "Lowest possible latency",
        "Largest model size"
      ],
      "answer": [
        0,
        1,
        2
      ],
      "explanation": "AWS lists fairness, explainability, privacy and security, safety, controllability, veracity and robustness, governance and transparency. Speed and size aren't on that list."
    },
    {
      "id": "d4-44",
      "domain": "d4",
      "lesson": "d4-dimensions",
      "type": "match",
      "prompt": "Match each responsible AI dimension to what it means.",
      "pairs": [
        [
          "Veracity",
          "Outputs are true and correct"
        ],
        [
          "Controllability",
          "People can steer and correct the system"
        ],
        [
          "Transparency",
          "Users know they're dealing with AI and how it's used"
        ],
        [
          "Robustness",
          "It keeps working with odd or noisy input"
        ]
      ],
      "explanation": "These words show up on the exam a lot. Veracity is about truth, controllability is about steering, transparency is about openness and robustness is about staying reliable."
    },
    {
      "id": "d4-45",
      "domain": "d4",
      "lesson": "d4-bias",
      "prompt": "A hiring model keeps rating applicants lower when they went to certain schools, because past hiring favoured other schools. What kind of problem is this?",
      "options": [
        "Bias learned from historical data",
        "Underfitting caused by too few features",
        "A token limit in the prompt",
        "A network timeout during inference"
      ],
      "answer": [
        0
      ],
      "explanation": "If past decisions were unfair, a model trained on them learns the same pattern. Checking results by subgroup helps you catch it."
    },
    {
      "id": "d4-46",
      "domain": "d4",
      "lesson": "d4-bias",
      "prompt": "Which SageMaker Clarify metric compares how often each group is in the training data?",
      "options": [
        "Class imbalance",
        "Mean squared error",
        "BLEU score",
        "Perplexity"
      ],
      "answer": [
        0
      ],
      "explanation": "Class imbalance is a pre-training bias metric. It shows when one group has far fewer examples than another."
    },
    {
      "id": "d4-47",
      "domain": "d4",
      "lesson": "d4-bias",
      "type": "order",
      "prompt": "Put these steps for finding and fixing bias in order.",
      "items": [
        "Choose the groups and outcomes to check",
        "Measure bias in the training data",
        "Train the model and measure bias in its predictions",
        "Fix the data or model and measure again"
      ],
      "explanation": "Decide what fair means for your case first, then check the data, then the model, then repeat after each fix."
    },
    {
      "id": "d4-48",
      "domain": "d4",
      "lesson": "d4-legal",
      "prompt": "A company uses an image model and later learns it may copy artists' work. Which risk is this?",
      "options": [
        "Copyright infringement",
        "Model drift over time",
        "Overfitting the test set",
        "Provisioned throughput limits"
      ],
      "answer": [
        0
      ],
      "explanation": "Generated content can look a lot like copyrighted work. That can lead to IP claims, so check the model's licence and training data terms."
    },
    {
      "id": "d4-49",
      "domain": "d4",
      "lesson": "d4-legal",
      "prompt": "Which are legal or business risks of generative AI? (Choose two.)",
      "options": [
        "Loss of customer trust after a harmful answer",
        "Claims that output infringes copyright",
        "Lower cost from on-demand pricing",
        "Faster replies with smaller models",
        "Fewer tokens in each prompt"
      ],
      "answer": [
        0,
        1
      ],
      "explanation": "Harmful answers damage trust, and copied content can bring IP claims. Lower cost and speed are benefits, not risks."
    },
    {
      "id": "d4-50",
      "domain": "d4",
      "lesson": "d4-explain",
      "prompt": "A bank needs a model whose every decision a regulator can follow step by step. Which choice fits best?",
      "options": [
        "A simple, transparent model like a decision tree",
        "The largest deep neural network available",
        "A model with the highest temperature setting available",
        "Any model with a long context window"
      ],
      "answer": [
        0
      ],
      "explanation": "Simple models are easier to explain. You may give up some accuracy, which is the interpretability and performance trade-off."
    },
    {
      "id": "d4-51",
      "domain": "d4",
      "lesson": "d4-explain",
      "type": "match",
      "prompt": "Match each tool to what it helps with.",
      "pairs": [
        [
          "SageMaker Clarify",
          "Bias metrics and SHAP explanations"
        ],
        [
          "SageMaker Model Cards",
          "Documenting a model's purpose and limits"
        ],
        [
          "Amazon A2I",
          "Human review of predictions"
        ],
        [
          "Bedrock Guardrails",
          "Filtering prompts and replies"
        ]
      ],
      "explanation": "Clarify measures and explains, model cards document, A2I brings in people and Guardrails filters content."
    },
    {
      "id": "d4-52",
      "domain": "d4",
      "lesson": "d4-explain",
      "prompt": "What does a SHAP value tell you about one prediction?",
      "options": ["How much each input feature pushed the result up or down","How long the model took to return that single result to the caller","How many tokens the prompt used from start to finish","How much the prediction cost to run on the endpoint"],
      "answer": [
        0
      ],
      "explanation": "SHAP splits a prediction into each feature's contribution, so you can say which inputs mattered most."
    },
    {
      "id": "d4-53",
      "domain": "d4",
      "lesson": "d4-compliance",
      "prompt": "Which Bedrock evaluation type uses people to rate answers for things like style and brand voice?",
      "options": [
        "Human-based model evaluation",
        "Automatic evaluation with built-in datasets",
        "Provisioned Throughput testing",
        "Cross-Region inference"
      ],
      "answer": [
        0
      ],
      "explanation": "Some qualities are hard to score with a number. Human evaluation jobs let your own team or subject experts rate the answers."
    },
    {
      "id": "d4-54",
      "domain": "d4",
      "lesson": "d4-dimensions",
      "prompt": "Choosing a smaller model that meets the need, instead of the biggest one, helps most with which responsible AI goal?",
      "options": [
        "Environmental sustainability",
        "Prompt injection defence and filtering",
        "Data residency",
        "Model explainability"
      ],
      "answer": [
        0
      ],
      "explanation": "Bigger models use more energy to train and run. Picking the smallest model that does the job cuts both cost and environmental impact."
    },
    {
      "id": "d4-55",
      "domain": "d4",
      "lesson": "d4-compliance",
      "prompt": "Which actions make a GenAI app more transparent to users? (Choose two.)",
      "options": [
        "Tell users they're talking to an AI",
        "Show the sources behind an answer",
        "Hide which model is in use",
        "Remove the feedback button",
        "Turn off logging of replies"
      ],
      "answer": [
        0,
        1
      ],
      "explanation": "Being open that it's AI and citing sources helps people judge the answer. A feedback button lets them flag problems too."
    },
    {
      "id": "d4-56",
      "domain": "d4",
      "lesson": "d4-compliance",
      "prompt": "Why add a thumbs up and thumbs down button to a GenAI app?",
      "options": ["To collect feedback that helps improve the system","To lower the price charged for each model request","To make the model's replies arrive more quickly","To stop the model from using up so many tokens"],
      "answer": [
        0
      ],
      "explanation": "Feedback is part of human-centred design. It shows where answers go wrong so you can fix prompts, data or the model."
    },
    {
      "id": "d4-57",
      "domain": "d4",
      "lesson": "d4-compliance",
      "type": "order",
      "prompt": "Order the parts of a responsible model lifecycle.",
      "items": [
        "Define the use case and its risks",
        "Collect and check diverse data",
        "Train and evaluate, including bias tests",
        "Document the model in a model card",
        "Deploy and monitor with human review"
      ],
      "explanation": "Responsibility runs through every step, from scoping the risks to monitoring in production."
    },
    {
      "id": "d4-58",
      "domain": "d4",
      "lesson": "d4-legal",
      "prompt": "A legal assistant sometimes invents court cases that don't exist. What should the team do first?",
      "options": [
        "Ground answers in real sources with RAG and check them",
        "Raise the temperature so answers vary more often",
        "Remove the system prompt from every request",
        "Switch to a model with a shorter context window and fewer tokens"
      ],
      "answer": [
        0
      ],
      "explanation": "Invented facts are hallucinations. Grounding answers in trusted documents and checking citations cuts them down."
    },

    // ── Added: AIF-C01 exam-style practice ──
    {
      "id": "d4-59",
      "domain": "d4",
      "lesson": "d4-guardrails",
      "prompt": "A marketing team wants to check later whether an image was made by an Amazon image model on Bedrock. What helps?",
      "options": [
        "The model's invisible watermark",
        "A higher temperature setting",
        "A larger context window",
        "Provisioned Throughput usage logs"
      ],
      "answer": [
        0
      ],
      "explanation": "Amazon Titan Image Generator and Nova Canvas add an invisible watermark, which Bedrock can detect. This supports transparency."
    },
    {
      "id": "d4-60",
      "domain": "d4",
      "lesson": "d4-guardrails",
      "prompt": "Which options can catch toxic content in a generative AI app? (Choose two.)",
      "options": [
        "Bedrock Guardrails content filters",
        "Amazon Comprehend toxicity detection",
        "AWS KMS key rotation",
        "Amazon S3 Glacier storage",
        "AWS Cost Explorer reports"
      ],
      "answer": [
        0,
        1
      ],
      "explanation": "Guardrails content filters block harmful text in prompts and replies. Comprehend can score text for toxicity."
    },
    {
      "id": "d4-61",
      "domain": "d4",
      "lesson": "d4-dimensions",
      "type": "match",
      "prompt": "Match each responsible AI dimension to its meaning.",
      "pairs": [
        [
          "Fairness",
          "Similar outcomes across groups of people"
        ],
        [
          "Explainability",
          "Understanding why the model gave an output"
        ],
        [
          "Privacy and security",
          "Protecting personal data"
        ],
        [
          "Veracity and robustness",
          "Correct output, even with unusual inputs"
        ],
        [
          "Controllability",
          "Steering and monitoring the system's behavior"
        ]
      ],
      "explanation": "AWS lists these among its core dimensions of responsible AI."
    },
    {
      "id": "d4-62",
      "domain": "d4",
      "lesson": "d4-bias",
      "prompt": "A loan dataset has 9,000 records for one age group and 1,000 for another. Which pre-training bias metric flags this?",
      "options": [
        "Class imbalance (CI)",
        "Difference in proportions of labels (DPL)",
        "Recall difference",
        "Accuracy difference"
      ],
      "answer": [
        0
      ],
      "explanation": "Class imbalance compares how many samples each group has. DPL compares positive labels between groups. Recall and accuracy difference need a trained model."
    },
    {
      "id": "d4-63",
      "domain": "d4",
      "lesson": "d4-explain",
      "prompt": "A bank must explain each loan decision to customers. Which choices help? (Choose two.)",
      "options": [
        "Use a simpler model if accuracy allows",
        "Use SHAP values to show feature impact",
        "Raise the model's temperature",
        "Turn off logging for the model",
        "Use the largest model on offer"
      ],
      "answer": [
        0,
        1
      ],
      "explanation": "Simple models are easier to interpret, and SHAP values show how much each input pushed a decision. Bigger models are usually harder to explain."
    },
    {
      "id": "d4-64",
      "domain": "d4",
      "lesson": "d4-legal",
      "prompt": "A generated image closely copies a famous artist's protected work. Which risk is this?",
      "options": [
        "Copyright infringement",
        "Model drift over time",
        "Data residency rules",
        "Overfitting to training data"
      ],
      "answer": [
        0
      ],
      "explanation": "Generated content can copy protected work, which is an intellectual property risk."
    },
  ],

  cards: [
    { id: "s-clarify", domain: "d4", kind: "service", term: "SageMaker Clarify", definition: "Finds bias and explains predictions using SHAP" },
    { id: "s-modelcards", domain: "d4", kind: "service", term: "SageMaker Model Cards", definition: "Documents a model's intended use, data and risks" },
    { id: "s-a2i", domain: "d4", kind: "service", term: "Amazon Augmented AI (A2I)", definition: "Sends low-confidence ML predictions to a person for review" },
    { id: "c-guardrails", domain: "d4", kind: "concept", term: "Bedrock Guardrails", definition: "Filters harmful content, banned topics, personal data and unsupported answers" },
    { id: "c-rlhf", domain: "d4", kind: "concept", term: "RLHF", definition: "Uses people's rankings of answers to steer a model toward what they prefer" },
    { id: "c-sampling", domain: "d4", kind: "concept", term: "Sampling bias", definition: "The training data doesn't match the real population" },
    { id: "c-measurement", domain: "d4", kind: "concept", term: "Measurement bias", definition: "Faulty tools or methods skew the data" },
    { id: "c-pdp", domain: "d4", kind: "concept", term: "Partial dependence plot", definition: "Shows one input's effect on predictions while the others stay fixed" },
    { id: "c-regulated", domain: "d4", kind: "concept", term: "Regulated workload", definition: "Work with extra audit, record-keeping and reporting rules, like finance or health" },
    {"id":"s-modelcards-use","domain":"d4","kind":"concept","term":"Model card contents","definition":"Intended use, risk rating, training details and evaluation results"},
    {"id":"s-a2i-builtin","domain":"d4","kind":"concept","term":"A2I built-in task types","definition":"Amazon Textract key-value extraction and Amazon Rekognition image moderation"},
    {"id":"c-activation","domain":"d4","kind":"concept","term":"A2I activation condition","definition":"A rule, like low confidence, that sends a prediction to a human"},
    {"id":"c-denied-topic","domain":"d4","kind":"concept","term":"Denied topic","definition":"A Guardrails rule that refuses a subject you describe"},
    {"id":"c-grounding","domain":"d4","kind":"concept","term":"Contextual grounding check","definition":"A Guardrails check that an answer is backed by the source text"},
    {"id":"c-veracity","domain":"d4","kind":"concept","term":"Veracity","definition":"Outputs are true and correct"},
    {"id":"c-controllability","domain":"d4","kind":"concept","term":"Controllability","definition":"People can steer and correct an AI system"},
    {"id":"c-robustness","domain":"d4","kind":"concept","term":"Robustness","definition":"The system keeps working with odd or noisy input"},
    {"id":"c-transparency","domain":"d4","kind":"concept","term":"Transparency","definition":"Users know AI is involved and how it's used"},
    {"id":"c-class-imbalance","domain":"d4","kind":"concept","term":"Class imbalance","definition":"A Clarify metric for one group having far fewer examples"},
    {"id":"c-shap","domain":"d4","kind":"concept","term":"SHAP values","definition":"Show how much each feature pushed a prediction up or down"},
    {"id":"c-interp-tradeoff","domain":"d4","kind":"concept","term":"Interpretability trade-off","definition":"Simpler models are easier to explain but may be less accurate"},
    {"id":"c-human-eval","domain":"d4","kind":"concept","term":"Human model evaluation","definition":"People rate model answers for qualities a metric can't score"},
    {"id":"c-ip-risk","domain":"d4","kind":"concept","term":"IP risk","definition":"Generated content may copy someone else's protected work"},
    {"id":"c-sustain","domain":"d4","kind":"concept","term":"Sustainable model choice","definition":"Use the smallest model that meets the need"},
  ],

  challenges: [
    {
      id: "ch-guardrails",
      domain: "d4",
      lesson: "d4-guardrails",
      title: "Lock down the assistant",
      goal: "Every filter starts off. Turn on the right ones, then send all three risky prompts so each one gets blocked or masked.",
      hint: "Each risky prompt needs a different filter: a denied topic, the prompt attack filter, or the personal data filter.",
      takeaway: "Bedrock Guardrails combines several filters, and each one targets a different risk.",
      render: (onSolved) => <GuardrailsLab goal="protect" onSolved={onSolved} />,
    },
      {
      id: "ch-pick-the-tool",
      domain: "d4",
      lesson: "d4-explain",
      title: "Pick the right tool",
      goal: "Send each job to the AWS tool built for it, and get all six right.",
      hint: "Clarify measures and explains. Model cards document. A2I brings in people. Guardrails filters content.",
      takeaway: "Responsible AI on AWS uses several tools together, each for a different job.",
      render: (onSolved) => (
        <SortLab
          goal="allCorrect"
          onSolved={onSolved}
          title="Which tool does this job?"
          hint="Tap a tool for each job."
          buckets={["Clarify", "Model Cards", "A2I", "Guardrails"]}
          items={[
            { t: "Measure bias in training data", b: 0 },
            { t: "Explain which features drove a prediction", b: 0 },
            { t: "Record a model's intended use and limits", b: 1 },
            { t: "Send low-confidence predictions to a person", b: 2 },
            { t: "Block a denied topic in chatbot replies", b: 3 },
            { t: "Mask personal data in model output", b: 3 },
          ]}
        />
      ),
    },
    {
      id: "ch-name-the-bias",
      domain: "d4",
      lesson: "d4-bias",
      title: "Name the problem",
      goal: "Sort each story into the right problem, and get all five right.",
      hint: "Ask: is the data lopsided, is the model too simple or too clingy, or is the answer made up?",
      takeaway: "Spotting the kind of problem tells you which fix to try first.",
      render: (onSolved) => (
        <SortLab
          goal="allCorrect"
          onSolved={onSolved}
          title="What went wrong?"
          hint="Tap a problem for each story."
          buckets={["Sampling bias", "Overfitting", "Underfitting", "Hallucination"]}
          items={[
            { t: "Trained mostly on photos of one group, fails on others", b: 0 },
            { t: "Perfect on training data, poor on new data", b: 1 },
            { t: "Poor on training data and on new data", b: 2 },
            { t: "Confidently cites a court case that doesn't exist", b: 3 },
            { t: "Survey data came only from one city's residents", b: 0 },
          ]}
        />
      ),
    },
  ],
});
