import { Flow, Ladder, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { GroundingLab } from "../labs";
import { RagSteps, SamplingDial } from "../visuals";

/**
 * Section 3: Techniques to improve gen AI model output (~20% of the exam).
 */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Techniques to improve gen AI model output",
    world: "The Grounding Forge",
    weight: 20,
    emoji: "🎯",
    color: "#fbbc04",
    summary:
      "Foundation model limitations and how to overcome them, continuous monitoring, prompt engineering techniques, grounding and RAG, and sampling settings.",
  },

  tasks: [
    {
      id: "3.1",
      title: "Proactively overcome foundation model limitations",
      covers: [
        "Limitations: data dependency, knowledge cutoff, bias, fairness, hallucinations, edge cases",
        "Recommended practices: grounding, RAG, prompt engineering, fine-tuning, human in the loop (HITL)",
        "Continuous monitoring and evaluation: automatic model upgrades, KPIs, security patches, versioning, performance tracking, drift monitoring, Agent Platform Feature Store",
      ],
    },
    {
      id: "3.2",
      title: "Prompt engineering techniques",
      covers: [
        "What prompt engineering is and why it matters for LLMs",
        "Zero-shot, one-shot, few-shot, role prompting, prompt chaining",
        "Advanced techniques: chain-of-thought and ReAct prompting",
      ],
    },
    {
      id: "3.3",
      title: "Grounding techniques and their use cases",
      covers: [
        "Grounding with first-party enterprise data, third-party data, and world data",
        "How RAG affects generated output",
        "Google Cloud grounding: prebuilt RAG with Agent Search, RAG APIs, Grounding with Google Search",
        "Sampling parameters: token count, temperature, top-p, safety settings, output length",
      ],
    },
  ],

  lessons: [
    {
      id: "d3-limits",
      task: "3.1",
      title: "Model limitations and how to fix them",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🗃️", title: "Data dependency", text: "Output is only as good as the data. Biased or incomplete data shows up in answers.", color: "#ea4335" },
              { icon: "📅", title: "Knowledge cutoff", text: "No knowledge of events after the training date.", color: "#ea4335" },
              { icon: "⚖️", title: "Bias & fairness", text: "Biases in training data can be magnified in outputs.", color: "#ea4335" },
              { icon: "🌀", title: "Hallucinations", text: "Confident outputs that aren't accurate or based on real information.", color: "#ea4335" },
              { icon: "🧪", title: "Edge cases", text: "Rare, atypical inputs expose weaknesses.", color: "#ea4335" },
            ]}
          />
          <Ladder
            rungs={[
              { icon: "✍️", name: "Prompt engineering", text: "Clearer instructions, examples, roles. No training." },
              { icon: "📎", name: "Grounding / RAG", text: "Connect answers to verifiable sources: your data or Google Search." },
              { icon: "🎛️", name: "Fine-tuning", text: "Further training for a specific task or domain." },
            ]}
          />
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3 text-sm text-slate-200">
            🧑‍⚖️ <b className="text-emerald-200">Human in the loop (HITL)</b> sits alongside all of these: content moderation, sensitive fields such as healthcare and
            finance, high-stakes decisions, and pre- or post-generation review.
          </div>
        </div>
      ),
      points: [
        "Knowledge cutoff → ground with current sources. Hallucinations about your business → ground in your own data.",
        "Fine-tuning improves a pre-trained model for a specific task or domain, at more cost and effort than prompting.",
        "HITL reviews can happen before outputs reach users (pre-generation review) or continuously after deployment (post-generation review).",
      ],
      tip: "Grounding fixes missing or stale knowledge. Fine-tuning changes behaviour or style. Don't pick fine-tuning to add facts that change every week.",
      check: ["d3-01", "d3-06"],
    },
    {
      id: "d3-monitor",
      task: "3.1",
      title: "Keep models healthy in production",
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#fbbc04"
            steps={[
              { icon: "🏷️", label: "Version", sub: "Track every model version in Model Registry" },
              { icon: "📈", label: "Track", sub: "Review performance metrics and business KPIs" },
              { icon: "🌊", label: "Watch for drift", sub: "Model Monitoring spots accuracy changes over time" },
              { icon: "🩹", label: "Patch & upgrade", sub: "Security patches, updates, and model upgrades" },
            ]}
            loop="Automate the cycle with Agent Platform Pipelines"
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧮", title: "Agent Platform Feature Store", text: "Manage the data features your models use." },
              { icon: "🔁", title: "Agent Platform Pipelines", text: "Automate ML tasks and workflows." },
              { icon: "🗂️", title: "Model Registry", text: "Keep track of model versions, and roll back if needed." },
            ]}
          />
        </div>
      ),
      points: [
        "Evaluation isn't a one-off: monitor, measure, and improve continuously after launch.",
        "Drift is a change in model accuracy over time, often because real-world data changes.",
        "Versioning lets you compare models and roll back a bad update.",
      ],
      check: ["d3-09", "d3-10"],
    },
    {
      id: "d3-prompting",
      task: "3.2",
      title: "Prompt engineering techniques",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "0️⃣", title: "Zero-shot", text: "Just the task, no examples.", color: "#4285f4" },
              { icon: "1️⃣", title: "One-shot", text: "One example to copy.", color: "#4285f4" },
              { icon: "🔢", title: "Few-shot", text: "Several examples to learn the pattern.", color: "#4285f4" },
              { icon: "🎭", title: "Role prompting", text: "Assign a persona to shape style, tone, and focus.", color: "#34a853" },
              { icon: "⛓️", title: "Prompt chaining", text: "A back-and-forth sequence where each step builds on the last.", color: "#34a853" },
              { icon: "🪞", title: "Metaprompting", text: "Use prompts to generate, modify, or interpret other prompts.", color: "#34a853" },
            ]}
          />
          <Tiles
            tiles={[
              { icon: "🧮", title: "Chain-of-thought (CoT)", text: "Guide the model through intermediate reasoning steps for multi-step problems.", color: "#fbbc04" },
              { icon: "🔁", title: "ReAct (reason + act)", text: "The model reasons, takes an action such as a tool call, observes, and repeats.", color: "#fbbc04" },
            ]}
          />
        </div>
      ),
      points: [
        "Prompt engineering is the art and science of crafting inputs that get the most value from a model, with no training.",
        "More examples (zero → one → few-shot) help when the output must follow a specific format or pattern.",
        "Streamline workflows by reusing prompts as templates, chaining within one conversation, saving info in Gemini, and using Gems.",
      ],
      tip: "ReAct is the technique behind agents that use tools. Chain-of-thought is about showing reasoning, not calling tools.",
      check: ["d3-15", "d3-19"],
    },
    {
      id: "d3-grounding",
      task: "3.3",
      title: "Grounding and RAG",
      visual: (
        <div className="grid gap-5">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🏢", title: "First-party enterprise data", text: "Your own documents, policies, products, and records.", color: "#34a853" },
              { icon: "🤝", title: "Third-party data", text: "Data from external providers, such as a licensed market data feed.", color: "#fbbc04" },
              { icon: "🌐", title: "World data", text: "Public, current information, such as Grounding with Google Search.", color: "#4285f4" },
            ]}
          />
          <RagSteps />
          <GroundingLab />
        </div>
      ),
      points: [
        "Grounding connects a model's output to verifiable sources of information, which reduces hallucinations.",
        "RAG retrieves relevant information, adds it to the prompt, and generates an answer from it. The model's weights don't change.",
        "Google Cloud options: prebuilt RAG with Agent Search, the RAG APIs, and Grounding with Google Search.",
      ],
      tip: "Private company facts → ground in enterprise data. Fresh public facts → Grounding with Google Search.",
      check: ["d3-22", "d3-25"],
    },
    {
      id: "d3-sampling",
      task: "3.3",
      title: "Sampling parameters and settings",
      visual: <SamplingDial />,
      points: [
        "Tokens are meaningful chunks of text such as words and punctuation. Token count drives cost and context limits.",
        "Temperature controls randomness: low for facts and consistency, high for creativity.",
        "Top-p limits choices to the most likely tokens whose probabilities add up to p.",
        "Safety settings filter harmful content, and output length caps how much the model generates.",
      ],
      check: ["d3-27", "d3-28"],
    },
  ],

  questions: [
    // ───── d3-limits
    {
      id: "d3-01",
      domain: "d3",
      lesson: "d3-limits",
      prompt:
        "A compliance assistant gives outdated guidance about a regulation that changed last month, after the model was trained. Which limitation is this, and what is the BEST mitigation?",
      options: [
        "Knowledge cutoff; ground the model in current sources",
        "Edge case; raise the temperature",
        "Bias; remove all examples from the prompt",
        "Context window; switch to an image model",
      ],
      answer: [0],
      explanation: "Models only know what was in their training data up to a cutoff date. Grounding with current sources supplies newer information.",
    },
    {
      id: "d3-02",
      domain: "d3",
      lesson: "d3-limits",
      prompt: "A support chatbot confidently describes a 90-day return policy that the company never offered. What is this called?",
      options: ["A hallucination", "Model drift", "A knowledge cutoff", "Prompt chaining"],
      answer: [0],
      explanation: "Hallucinations are outputs that sound plausible but aren't accurate or based on real information. Grounding in the real policy helps.",
    },
    {
      id: "d3-03",
      domain: "d3",
      lesson: "d3-limits",
      prompt:
        "A claims model handles typical claims well but produces strange results for rare claim types it has seldom seen, such as damage from a meteorite. Which limitation does this show?",
      options: ["Edge cases", "Knowledge cutoff", "Latency", "Data accessibility"],
      answer: [0],
      explanation: "Rare and atypical scenarios, called edge cases, can expose a model's weaknesses and lead to unexpected results.",
    },
    {
      id: "d3-04",
      domain: "d3",
      lesson: "d3-limits",
      prompt: "A model trained on an incomplete product catalog gives incomplete product answers. Which limitation BEST explains the root cause?",
      options: ["Data dependency", "Temperature setting", "Context window size", "Output length"],
      answer: [0],
      explanation: "Foundation model performance depends heavily on data. Biased or incomplete data affects the outputs.",
    },
    {
      id: "d3-05",
      domain: "d3",
      lesson: "d3-limits",
      type: "match",
      prompt: "Match each problem to the BEST mitigation.",
      pairs: [
        ["Doesn't know about yesterday's public news", "Grounding with Google Search"],
        ["Invents details about your internal policies", "RAG over your enterprise documents"],
        ["Outputs drive high-stakes medical decisions", "Human-in-the-loop review"],
        ["Must consistently perform a specialised task in your domain", "Fine-tuning"],
      ],
      explanation: "Fresh public facts need world data, private facts need enterprise data, high stakes need people, and specialised behaviour can justify fine-tuning.",
    },
    {
      id: "d3-06",
      domain: "d3",
      lesson: "d3-limits",
      prompt:
        "A hospital uses gen AI to draft patient discharge instructions. Errors could harm patients. Which practice should it add FIRST?",
      options: [
        "Human-in-the-loop review, so a clinician checks each draft before it reaches the patient",
        "A higher temperature for more varied wording",
        "Removing the system instructions to save tokens",
        "Publishing the drafts without review to gather feedback faster",
      ],
      answer: [0],
      explanation: "HITL gives critical oversight in sensitive fields such as healthcare, with experts reviewing outputs before they reach users.",
    },
    {
      id: "d3-07",
      domain: "d3",
      lesson: "d3-limits",
      prompt: "Where does human in the loop (HITL) add the MOST value? (Choose two.)",
      options: [
        "High-stakes decisions such as loan approvals",
        "Moderating user-generated content where context matters",
        "Brainstorming internal team-lunch ideas",
        "Autocompleting low-risk internal notes",
        "Choosing a font for an internal slide",
      ],
      answer: [0, 1],
      explanation: "HITL is most valuable where mistakes are costly or context is subtle: high-risk decisions, sensitive applications, and content moderation.",
    },
    {
      id: "d3-08",
      domain: "d3",
      lesson: "d3-limits",
      prompt:
        "A manufacturer needs a model to consistently produce maintenance reports in its specialised format and terminology. Careful prompting and examples still fall short, and it has thousands of good example reports. What should it consider next?",
      options: ["Fine-tuning the model on the example reports", "Raising the temperature", "Grounding with Google Search", "Using a smaller context window"],
      answer: [0],
      explanation: "Fine-tuning improves a pre-trained model's performance for a specific task or domain when prompting isn't enough and good training examples exist.",
    },

    // ───── d3-monitor
    {
      id: "d3-09",
      domain: "d3",
      lesson: "d3-monitor",
      prompt:
        "A demand-forecasting model was accurate at launch, but its accuracy has slowly declined over six months as customer behaviour changed. What is this, and which tool helps detect it?",
      options: ["Drift; Model Monitoring", "Hallucination; Google AI Studio", "Edge case; Gems", "Knowledge cutoff; Text-to-Speech API"],
      answer: [0],
      explanation: "Drift is a change in model accuracy over time. Model Monitoring watches for it so teams can retrain or adjust.",
    },
    {
      id: "d3-10",
      domain: "d3",
      lesson: "d3-monitor",
      type: "match",
      prompt: "Match each Agent Platform capability to what it does.",
      pairs: [
        ["Model Registry", "Track model versions"],
        ["Model Monitoring", "Watch for drift in accuracy"],
        ["Agent Platform Feature Store", "Manage the data features models use"],
        ["Agent Platform Pipelines", "Automate machine learning tasks"],
      ],
      explanation: "Together these support versioning, drift monitoring, feature management, and automation across the model lifecycle.",
    },
    {
      id: "d3-11",
      domain: "d3",
      lesson: "d3-monitor",
      prompt: "Which practice reflects Google's recommendations for evaluating a gen AI solution after launch?",
      options: [
        "Track key performance indicators and model metrics continuously",
        "Evaluate once at launch, then freeze the model",
        "Skip security patches so behaviour never changes",
        "Avoid versioning to keep things simple",
      ],
      answer: [0],
      explanation: "Continuous monitoring covers KPIs, performance tracking, drift monitoring, versioning, model upgrades, and security patches.",
    },
    {
      id: "d3-12",
      domain: "d3",
      lesson: "d3-monitor",
      prompt: "After a model update, answer quality drops and the team wants to restore the previous model quickly. Which practice makes this possible?",
      options: ["Model versioning with Model Registry", "Raising top-p", "Few-shot prompting", "Grounding with Google Search"],
      answer: [0],
      explanation: "Versioning keeps track of each model version, so you can compare them and roll back.",
    },
    {
      id: "d3-13",
      domain: "d3",
      lesson: "d3-monitor",
      prompt: "Which are good practices for running gen AI models in production? (Choose two.)",
      options: [
        "Apply security patches and updates",
        "Monitor for drift",
        "Turn off logging to reduce noise",
        "Skip evaluation after model upgrades",
        "Deploy new versions without recording which one is live",
      ],
      answer: [0, 1],
      explanation: "Keep models secure and current, and watch their accuracy over time. Logging, evaluation, and version tracking make that possible.",
    },

    // ───── d3-prompting
    {
      id: "d3-14",
      domain: "d3",
      lesson: "d3-prompting",
      prompt: "A user types: \"Write a two-sentence product description for a stainless-steel water bottle.\" There are no examples. Which technique is this?",
      options: ["Zero-shot prompting", "Few-shot prompting", "Chain-of-thought prompting", "Prompt tuning"],
      answer: [0],
      explanation: "Zero-shot prompting asks the model to complete a task with no examples.",
    },
    {
      id: "d3-15",
      domain: "d3",
      lesson: "d3-prompting",
      prompt:
        "A team wants support tickets tagged with one of five internal categories in an exact format. Its prompt includes six example tickets with the correct tags. Which technique is this?",
      options: ["Few-shot prompting", "Zero-shot prompting", "Role prompting", "Fine-tuning"],
      answer: [0],
      explanation: "Few-shot prompting gives the model several examples to learn the pattern and format from, without training.",
    },
    {
      id: "d3-16",
      domain: "d3",
      lesson: "d3-prompting",
      type: "order",
      prompt: "A marketer uses prompt chaining to produce a launch email. Put the prompts in a sensible order.",
      items: [
        "Summarise the attached customer research",
        "From the summary, list three key messages",
        "Draft a launch email built on those messages",
        "Shorten the draft and make the tone friendlier",
      ],
      explanation: "In prompt chaining each step builds on the previous output within the same conversation, which keeps context and improves quality.",
    },
    {
      id: "d3-17",
      domain: "d3",
      lesson: "d3-prompting",
      prompt:
        "A prompt begins: \"You are an experienced, plain-spoken financial coach for first-time home buyers.\" Which technique is being used?",
      options: ["Role prompting", "ReAct prompting", "Zero-shot classification", "Metaprompting"],
      answer: [0],
      explanation: "Role prompting assigns a persona to influence the model's style, tone, and focus.",
    },
    {
      id: "d3-18",
      domain: "d3",
      lesson: "d3-prompting",
      prompt: "A user pastes a single sample customer reply and asks Gemini to write ten more in the same style. Which technique is this?",
      options: ["One-shot prompting", "Zero-shot prompting", "Few-shot prompting", "Prompt chaining"],
      answer: [0],
      explanation: "One-shot prompting provides exactly one example to learn from.",
    },
    {
      id: "d3-19",
      domain: "d3",
      lesson: "d3-prompting",
      prompt:
        "A planning team asks a model to calculate a multi-step staffing forecast and keeps getting wrong totals. Which technique is MOST likely to help?",
      options: [
        "Chain-of-thought prompting that guides the model through intermediate reasoning steps",
        "Role prompting as a famous novelist",
        "Raising the temperature",
        "Removing all context from the prompt",
      ],
      answer: [0],
      explanation: "Chain-of-thought prompting walks the model through a problem step by step, which helps on multi-step reasoning tasks.",
    },
    {
      id: "d3-20",
      domain: "d3",
      lesson: "d3-prompting",
      prompt:
        "An assistant must answer \"Where is my order?\" by reasoning about the request, looking up the order in a system, reading the result, and deciding what to do next. Which prompting technique supports this?",
      options: ["ReAct (reason and act) prompting", "Zero-shot prompting", "One-shot prompting", "Role prompting"],
      answer: [0],
      explanation: "ReAct lets an LLM interleave reasoning with actions such as tool calls, observing results before continuing.",
    },
    {
      id: "d3-21",
      domain: "d3",
      lesson: "d3-prompting",
      type: "match",
      prompt: "Match each prompting technique to its description.",
      pairs: [
        ["Zero-shot", "The task with no examples"],
        ["Few-shot", "Several examples showing the pattern"],
        ["Role prompting", "A persona that shapes style and tone"],
        ["Prompt chaining", "A sequence of prompts that build on each other"],
        ["Metaprompting", "Using the model to write or improve prompts"],
      ],
      explanation: "These techniques shape output without training. Pick by how much guidance and structure the task needs.",
    },

    // ───── d3-grounding
    {
      id: "d3-22",
      domain: "d3",
      lesson: "d3-grounding",
      prompt: "In gen AI, what does grounding mean?",
      options: [
        "Connecting the model's output to verifiable sources of information",
        "Lowering the temperature to zero",
        "Training a model from scratch on company data",
        "Running the model on on-premises hardware",
      ],
      answer: [0],
      explanation: "Grounding ties answers to verifiable sources such as enterprise documents or Google Search, which improves accuracy and trust.",
    },
    {
      id: "d3-23",
      domain: "d3",
      lesson: "d3-grounding",
      type: "match",
      prompt: "Match each kind of grounding data to an example.",
      pairs: [
        ["First-party enterprise data", "Your company's own policies and product documents"],
        ["Third-party data", "A licensed data feed from an external provider"],
        ["World data", "Current public information found through Google Search"],
      ],
      explanation: "First-party data is yours, third-party data comes from other organisations, and world data is public information.",
    },
    {
      id: "d3-24",
      domain: "d3",
      lesson: "d3-grounding",
      type: "order",
      prompt: "Put the core steps of retrieval-augmented generation (RAG) in order.",
      items: ["Retrieve relevant information from external sources", "Add the retrieved information to the prompt", "Generate a response from the augmented prompt"],
      explanation: "Retrieval, augmentation, generation. Optionally, the model can iterate on retrieval when it needs more context.",
    },
    {
      id: "d3-25",
      domain: "d3",
      lesson: "d3-grounding",
      prompt:
        "A news-summary assistant must answer questions about events from the past few hours with sources. Which Google Cloud grounding option fits BEST?",
      options: ["Grounding with Google Search", "Prebuilt RAG over internal HR documents", "Fine-tuning on last year's articles", "A lower top-p value"],
      answer: [0],
      explanation: "Grounding with Google Search connects the model to fresh world data, which overcomes the knowledge cutoff.",
    },
    {
      id: "d3-26",
      domain: "d3",
      lesson: "d3-grounding",
      prompt: "How does adding RAG typically affect a gen AI application's output? (Choose two.)",
      options: [
        "Answers become more accurate and current for the retrieved topics",
        "Answers can cite the sources they came from",
        "The model's weights are permanently retrained",
        "Errors become impossible",
        "Data quality no longer matters",
      ],
      answer: [0, 1],
      explanation: "RAG improves relevance and enables citations without changing the model. Answers are only as good as the retrieved data, and mistakes are still possible.",
    },

    // ───── d3-sampling
    {
      id: "d3-27",
      domain: "d3",
      lesson: "d3-sampling",
      prompt:
        "A legal team wants contract summaries that are factual and as consistent as possible when the same document is summarised twice. How should temperature be set?",
      options: ["Low", "High", "It has no effect on consistency", "As high as the model allows"],
      answer: [0],
      explanation: "Low temperature makes word choices more focused and predictable. High temperature adds creativity and variation.",
    },
    {
      id: "d3-28",
      domain: "d3",
      lesson: "d3-sampling",
      prompt:
        "Which setting limits the model's word choices to the most likely tokens whose combined probability reaches a chosen threshold?",
      options: ["Top-p (nucleus sampling)", "Output length", "Safety settings", "Context window"],
      answer: [0],
      explanation: "Top-p is the cumulative probability of the most likely tokens considered during generation. It is another way to control randomness.",
    },
    {
      id: "d3-29",
      domain: "d3",
      lesson: "d3-sampling",
      type: "match",
      prompt: "Match each sampling setting to what it controls.",
      pairs: [
        ["Temperature", "How random or creative word choices are"],
        ["Top-p", "The share of the most likely tokens considered"],
        ["Output length", "The maximum length of the generated text"],
        ["Safety settings", "Filtering of harmful or inappropriate content"],
      ],
      explanation: "Sampling settings let you tune behaviour without changing the model or the prompt.",
    },
    {
      id: "d3-30",
      domain: "d3",
      lesson: "d3-sampling",
      prompt: "A children's education app must make sure the model never returns harmful or inappropriate content. Which settings are MOST directly designed for this?",
      options: ["Safety settings", "Top-p", "Token count", "Temperature"],
      answer: [0],
      explanation: "Safety settings filter potentially harmful or inappropriate content out of the model's output.",
    },
    {
      id: "d3-31",
      domain: "d3",
      lesson: "d3-sampling",
      prompt: "Responses from a customer assistant are too long and token costs are rising. Which changes help? (Choose two.)",
      options: [
        "Lower the maximum output length",
        "Ask for a concise format in the prompt, such as three bullet points",
        "Raise the temperature",
        "Add more few-shot examples of long answers",
        "Switch the safety settings off",
      ],
      answer: [0, 1],
      explanation: "Capping output length and asking for a concise format both reduce tokens generated. Cost scales with token count.",
    },
  ],

  cards: [
    { id: "d3-c01", domain: "d3", kind: "concept", term: "Knowledge cutoff", definition: "A model knows nothing after its training date. Fix with grounding in current sources." },
    { id: "d3-c02", domain: "d3", kind: "concept", term: "Hallucination", definition: "A confident output that isn't accurate or based on real information." },
    { id: "d3-c03", domain: "d3", kind: "concept", term: "Human in the loop (HITL)", definition: "Human input and review built into the ML workflow, before or after generation." },
    { id: "d3-c04", domain: "d3", kind: "concept", term: "Drift", definition: "A change in model accuracy over time. Detected with Model Monitoring." },
    { id: "d3-c05", domain: "d3", kind: "concept", term: "Few-shot prompting", definition: "Give several examples in the prompt so the model follows the pattern." },
    { id: "d3-c06", domain: "d3", kind: "concept", term: "Chain-of-thought", definition: "Guide the model through intermediate reasoning steps." },
    { id: "d3-c07", domain: "d3", kind: "concept", term: "ReAct", definition: "Reason and act: the model reasons, takes actions such as tool calls, and observes the results." },
    { id: "d3-c08", domain: "d3", kind: "concept", term: "Grounding", definition: "Connect output to verifiable sources: enterprise, third-party, or world data." },
    { id: "d3-c09", domain: "d3", kind: "concept", term: "RAG", definition: "Retrieve relevant information, augment the prompt with it, then generate." },
    { id: "d3-c10", domain: "d3", kind: "concept", term: "Temperature vs top-p", definition: "Temperature sets randomness; top-p limits choices to the most likely tokens up to probability p." },
    { id: "d3-c11", domain: "d3", kind: "service", term: "Grounding with Google Search", definition: "Grounds answers in fresh, public world data." },
    { id: "d3-c12", domain: "d3", kind: "service", term: "Model Registry", definition: "Tracks model versions so you can compare and roll back." },
  ],

  challenges: [
    {
      id: "ch-grounding",
      domain: "d3",
      lesson: "d3-grounding",
      title: "Ground it right",
      goal: "Get an accurate, cited answer to both factual questions by choosing the right grounding source for each.",
      hint: "One question is about a private company policy; the other is about yesterday's public news.",
      takeaway: "Ground private facts in enterprise data and fresh public facts with Google Search. Creative tasks rarely need grounding.",
      render: (onSolved) => <GroundingLab goal="allGrounded" onSolved={onSolved} />,
    },
  ],
});
