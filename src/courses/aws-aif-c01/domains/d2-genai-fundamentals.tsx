import { Flow, Layers, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { EmbeddingLab } from "../labs";
import { AgentLoop, DiffusionSteps, EmbeddingMap, TokenDemo } from "../visuals";

/**
 * Domain 2: everything for this exam domain in one file.
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "Fundamentals of Generative AI",
    world: "The Token Forge",
    weight: 24,
    emoji: "✨",
    color: "#a78bfa",
    summary:
      "Tokens, embeddings, transformers, foundation models, GenAI use cases, limits, and AWS GenAI infrastructure.",
  },

  tasks: [
    {
      id: "2.1",
      title: "Explain the basic concepts of GenAI",
      covers: [
        "Tokens, chunking, embeddings, vectors, transformers, FMs, multimodal and diffusion models",
        "Use cases: images, video, audio, summaries, assistants, translation, code, search",
        "FM lifecycle: data, model selection, pre-training, fine-tuning, evaluation, deployment, feedback",
        "Token-based pricing and context engineering",
        "Agentic AI: multi-agent patterns, MCP, memory, tool use, orchestration",
      ],
    },
    {
      id: "2.2",
      title: "Capabilities and limits of GenAI for business",
      covers: [
        "Strengths: adaptable, responsive, conversational, creates content",
        "Weaknesses: hallucinations, hard to interpret, inaccurate, nondeterministic",
        "Choosing a model: type, performance, compliance, cost, latency, complexity",
        "Business metrics: ROI, efficiency, conversion rate, revenue per user, lifetime value",
      ],
    },
    {
      id: "2.3",
      title: "AWS infrastructure and tech for GenAI apps",
      covers: [
        "Bedrock, SageMaker AI, JumpStart, Amazon Quick, Kiro, Strands Agents, Bedrock AgentCore",
        "Why use AWS GenAI services: lower barrier, speed to market, cost-effective",
        "AWS infrastructure benefits: security, compliance, safety",
        "Cost trade-offs: tokens, Provisioned Throughput, custom models, Regions, redundancy",
      ],
    },
  ],

  lessons: [
    {
      id: "d2-tokens",
      check: ["d2-01", "d2-26"],
      task: "2.1",
      title: "Tokens: how models read",
      visual: <TokenDemo />,
      points: [
        "The context window is the max tokens per request (prompt + history + documents + answer).",
        "On-demand Bedrock pricing charges per input token and per output token.",
        "Chunking splits long documents into pieces before embedding.",
      ],
    },
    {
      id: "d2-embeddings",
      check: ["d2-02", "d2-32"],
      task: "2.1",
      title: "Embeddings: meaning as coordinates",
      visual: (
        <div className="grid gap-6">
          <EmbeddingMap />
          <EmbeddingLab />
        </div>
      ),
      points: [
        "Embedding models (for example Amazon Titan Text Embeddings) turn text into vectors.",
        "Vector databases find the nearest vectors fast. This powers semantic search and RAG.",
      ],
    },
    {
      id: "d2-models",
      check: ["d2-04", "d2-05"],
      task: "2.1",
      title: "Kinds of generative models",
      visual: (
        <div className="grid gap-4">
          <Tiles
            tiles={[
              { icon: "🔤", title: "Transformer LLM", text: "Self-attention reads all tokens at once. Powers chat, summaries, code.", color: "#a78bfa" },
              { icon: "🖼️", title: "Multimodal model", text: "Handles more than one type: text + images (+ audio, video).", color: "#38bdf8" },
            ]}
          />
          <div>
            <div className="mb-2 text-sm font-semibold text-white">🌫️ Diffusion model: noise → image</div>
            <DiffusionSteps />
          </div>
        </div>
      ),
      points: [
        "A foundation model (FM) is large, pre-trained on broad data, and adaptable to many tasks.",
        "Amazon Nova is Amazon's own FM family in Bedrock.",
      ],
    },
    {
      id: "d2-lifecycle",
      check: ["d2-25", "d2-16"],
      task: "2.1",
      title: "The foundation model lifecycle",
      visual: (
        <Flow
          color="#a78bfa"
          loop="User feedback improves the next version"
          steps={[
            { icon: "🧺", label: "Data selection", sub: "Huge, diverse, curated" },
            { icon: "🧩", label: "Model selection", sub: "Architecture, size" },
            { icon: "🏗️", label: "Pre-training", sub: "Self-supervised, very costly" },
            { icon: "🎛️", label: "Fine-tuning", sub: "Adapt to tasks" },
            { icon: "📏", label: "Evaluation", sub: "Benchmarks, humans" },
            { icon: "🚀", label: "Deploy", sub: "Serve and gather feedback" },
          ]}
        />
      ),
      points: ["Most companies skip pre-training and start from an existing FM."],
    },
    {
      id: "d2-agents",
      check: ["d2-19", "d2-20"],
      task: "2.1",
      title: "Agentic AI and MCP",
      visual: <AgentLoop />,
      points: [
        "GenAI answers. Agentic AI acts: it plans, calls tools, checks results, and repeats.",
        "Context engineering = curating what the model sees (instructions, retrieved data, memory, tool results) within the token limit.",
      ],
    },
    {
      id: "d2-proscons",
      check: ["d2-06", "d2-07"],
      task: "2.2",
      title: "Strengths, weaknesses, and value",
      visual: (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3">
            <div className="font-semibold text-emerald-300">👍 Strengths</div>
            <ul className="mt-2 grid gap-1 text-sm text-slate-200">
              <li>• Adaptable to many tasks</li>
              <li>• Responsive and conversational</li>
              <li>• Creates content fast</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rose-400/30 bg-rose-400/5 p-3">
            <div className="font-semibold text-rose-300">👎 Weaknesses</div>
            <ul className="mt-2 grid gap-1 text-sm text-slate-200">
              <li>• Hallucinations (confident but wrong)</li>
              <li>• Hard to interpret</li>
              <li>• Nondeterministic: answers vary</li>
            </ul>
          </div>
        </div>
      ),
      points: [
        "Choose models by type, capability, cost, latency, compliance, and complexity.",
        "Measure value with ROI, efficiency, conversion rate, revenue per user, and customer lifetime value.",
      ],
    },
    {
      id: "d2-stack",
      check: ["d2-12", "d2-11"],
      task: "2.3",
      title: "The AWS GenAI toolbox",
      visual: (
        <Layers
          layers={[
            { name: "Apps for people", color: "#34d399", items: ["Amazon Quick (work assistant, BI, automation)", "Kiro (agentic IDE)", "AWS Transform (modernisation)"] },
            { name: "Build with models & agents", color: "#a78bfa", items: ["Amazon Bedrock", "Bedrock AgentCore", "Strands Agents", "Amazon Nova models"] },
            { name: "Build your own models", color: "#38bdf8", items: ["Amazon SageMaker AI", "SageMaker JumpStart", "EC2 (Trainium, Inferentia)"] },
          ]}
        />
      ),
      points: [
        "Managed services lower the barrier: no servers, fast experiments, pay as you go.",
        "Cost levers: on-demand tokens vs Provisioned Throughput (needed for custom models), Region choice, redundancy.",
      ],
    },
    {
      id: "d2-cloud-basics",
      check: ["d2-47", "d2-49"],
      task: "2.3",
      title: "Cloud and AWS basics for AI",
      visual: (
        <div className="grid gap-4">
          <Layers
            layers={[
              { name: "SaaS: you just use it", color: "#34d399", items: ["A finished app the provider runs for you", "e.g. a web email service"] },
              { name: "PaaS: you bring the code", color: "#a78bfa", items: ["Provider runs servers and runtime", "You deploy and manage the app"] },
              { name: "IaaS: you get building blocks", color: "#38bdf8", items: ["Virtual servers, storage, networking", "Most flexible, e.g. Amazon EC2"] },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🌍", title: "Region", text: "A geographic area with several data-center clusters. Your data stays in it unless you move it." },
              { icon: "🏢", title: "Availability Zone", text: "One or more isolated data centers inside a Region, with separate power and networking." },
              { icon: "📍", title: "Edge location", text: "Points of presence close to users, used by Amazon CloudFront for low-latency delivery." },
            ]}
          />
        </div>
      ),
      points: [
        "Choose a Region by compliance (data residency), proximity to users (latency), which services are available there, and price.",
        "Cloud benefits: pay as you go instead of buying hardware (CapEx → OpEx), economies of scale, no capacity guessing, speed, and going global in minutes.",
        "Core services AI apps lean on: S3 for data (storage classes from Standard to Glacier Deep Archive), EC2 for compute, Lambda for serverless code, IAM for access.",
      ],
      tip: "\"Data must stay in the EU\" → pick an EU Region. That's data residency, a Region decision.",
    },
    {
      id: "d2-bedrock-costs",
      check: ["d2-53", "d2-56"],
      task: "2.3",
      title: "Bedrock pricing, latency, and monitoring",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "⚡", title: "On-demand", text: "Pay per token (text), per input token (embeddings), or per image. No commitment; best for unpredictable traffic.", color: "#38bdf8" },
              { icon: "📦", title: "Batch", text: "Many requests at once, results written to S3. Up to about 50% cheaper.", color: "#34d399" },
              { icon: "🔒", title: "Provisioned Throughput", text: "Reserve model units for a term. Guarantees capacity; usually not a cost saver.", color: "#a78bfa" },
            ]}
          />
          <Tiles
            tiles={[
              { icon: "💰", title: "What changes cost", text: "Number of input and output tokens (the main driver), model size and provider, and the pricing mode.", color: "#f59e0b" },
              { icon: "⏱️", title: "What changes latency", text: "Model size and type, and input and output length. Temperature, Top P, and Top K change neither cost nor latency.", color: "#f87171" },
            ]}
          />
        </div>
      ),
      points: [
        "Model invocation logging sends prompts and responses to CloudWatch Logs and/or S3 for auditing and analysis.",
        "Bedrock publishes CloudWatch metrics, including how often guardrails filtered content, so you can alarm on them.",
        "Running a fine-tuned model also costs more than the base model.",
      ],
      tip: "\"Lower the temperature to save money\" is a classic wrong answer. Fewer tokens or a smaller model saves money.",
    },
  ],

  questions: [
    {
      id: "d2-01",
      domain: "d2",
      lesson: "d2-tokens",
      prompt: "What is a token in the context of large language models?",
      options: [
        "A security credential for calling the model API",
        "A unit of text, such as a word or part of a word, that the model processes",
        "A single neuron in the network",
        "A cryptocurrency used to pay for inference",
      ],
      answer: [1],
      explanation:
        "LLMs read and generate text as tokens (words or sub-word pieces). Pricing and context window limits are measured in tokens.",
    },
    {
      id: "d2-02",
      domain: "d2",
      lesson: "d2-embeddings",
      prompt: "What are embeddings?",
      options: [
        "Numerical vector representations that capture semantic meaning",
        "Images embedded inside a prompt",
        "Encrypted copies of training data",
        "Hard-coded rules inside a model",
      ],
      answer: [0],
      explanation:
        "Embeddings turn text, images, or other data into vectors where similar meanings sit close together. They power semantic search and RAG. Example: Amazon Titan Text Embeddings.",
    },
    {
      id: "d2-03",
      domain: "d2",
      lesson: "d2-models",
      prompt: "Which neural network architecture, built on the self-attention mechanism, underpins most modern LLMs?",
      options: ["Convolutional neural network", "Recurrent neural network", "Transformer", "Generative adversarial network"],
      answer: [2],
      explanation: "Transformers use self-attention to weigh relationships between all tokens in a sequence in parallel.",
    },
    {
      id: "d2-04",
      domain: "d2",
      lesson: "d2-models",
      prompt: "Which type of model generates images by learning to gradually remove noise?",
      options: ["Diffusion model", "Linear regression", "Decision tree", "k-nearest neighbors"],
      answer: [0],
      explanation:
        "Diffusion models start from random noise and denoise step by step into an image. Stable Diffusion and Amazon Nova Canvas are image generation models.",
    },
    {
      id: "d2-05",
      domain: "d2",
      lesson: "d2-models",
      prompt: "What is a foundation model (FM)?",
      options: [
        "A small model trained for one narrow task",
        "A large model pre-trained on broad data that can be adapted to many tasks",
        "A rules engine used as a base for chatbots",
        "Any model hosted on AWS",
      ],
      answer: [1],
      explanation:
        "FMs are pre-trained on massive, broad (often unlabeled) data using self-supervised learning, then adapted through prompting, RAG, or fine-tuning.",
    },
    {
      id: "d2-06",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "What is a hallucination in generative AI?",
      options: [
        "When a model refuses to answer",
        "When a model generates confident-sounding but false or fabricated content",
        "When a model runs out of tokens",
        "When the model produces images instead of text",
      ],
      answer: [1],
      explanation: "Hallucinations are plausible but wrong outputs. Reduce them with RAG grounding, lower temperature, guardrails, and clear prompts.",
    },
    {
      id: "d2-07",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "Which are limitations or disadvantages of generative AI? (Choose two.)",
      options: ["Hallucinations", "Nondeterministic outputs", "Inability to produce text", "Always requires labeled data"],
      answer: [0, 1],
      explanation:
        "GenAI can hallucinate and can give different answers to the same prompt (nondeterminism). Other limits: interpretability, toxicity, and knowledge cutoffs.",
    },
    {
      id: "d2-08",
      domain: "d2",
      lesson: "d2-models",
      prompt: "What is a multimodal model?",
      options: [
        "A model deployed in multiple Regions",
        "A model that can process or generate more than one data type, such as text and images",
        "A model with multiple hyperparameters",
        "An ensemble of several classification models",
      ],
      answer: [1],
      explanation: "Multimodal models handle several modalities (text, images, audio, video), for example describing an image in text.",
    },
    {
      id: "d2-09",
      domain: "d2",
      lesson: "d2-tokens",
      prompt: "What is the context window of an LLM?",
      options: [
        "The UI window where users type prompts",
        "The maximum number of tokens the model can consider in one request, including input and output",
        "The time window before a model is retrained",
        "The list of AWS Regions where the model runs",
      ],
      answer: [1],
      explanation: "The context window caps how much text (prompt + history + retrieved documents + response) fits into a single call.",
    },
    {
      id: "d2-10",
      domain: "d2",
      lesson: "d2-tokens",
      prompt: "Which pricing model applies when you call a model in Amazon Bedrock on demand?",
      options: [
        "You pay per input and output token processed",
        "A fixed monthly license per user",
        "You pay only for model training hours",
        "Bedrock on demand is free",
      ],
      answer: [0],
      explanation:
        "On-demand Bedrock pricing is per token (input and output). Provisioned Throughput reserves capacity for a commitment term, and is required for custom (fine-tuned) models.",
    },
    {
      id: "d2-11",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "Which AWS service is a fully managed way to access foundation models from Amazon, Anthropic, Meta, Mistral, and others through one API?",
      options: ["Amazon SageMaker AI", "Amazon Bedrock", "Amazon Quick", "AWS Lambda"],
      answer: [1],
      explanation: "Amazon Bedrock is serverless, API-based access to many FMs, plus Knowledge Bases, Agents, Guardrails, and model customization.",
    },
    {
      id: "d2-12",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "A development team wants an AI-powered IDE that turns a plain-language feature request into a spec, a task plan, and working code. Which AWS tool fits?",
      options: ["Kiro", "Amazon Lex", "AWS CloudFormation", "Amazon Polly"],
      answer: [0],
      explanation:
        "Kiro is AWS's agentic IDE. It supports spec-driven development: it turns requirements into specs and tasks, then helps write and update the code.",
    },
    {
      id: "d2-13",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "Employees want one AI workspace where they can ask questions across company documents, build dashboards in plain language, and automate routine tasks. Which service fits?",
      options: ["Amazon Quick", "Amazon Lex", "Amazon Polly", "Amazon EMR"],
      answer: [0],
      explanation:
        "Amazon Quick (Quick Suite) is the agentic AI workspace that succeeded Amazon Q Business. It combines research, BI dashboards, and automation over company data.",
    },
    {
      id: "d2-14",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "A developer wants an open-source SDK to build an AI agent in a few lines of code, letting the model decide which tools to call. Which option fits?",
      options: ["Strands Agents", "AWS Glue", "Amazon Inspector", "Amazon Translate"],
      answer: [0],
      explanation:
        "Strands Agents is an open-source, model-driven SDK for building agents: you give it a model, a prompt, and tools, and the model plans which tools to use.",
    },
    {
      id: "d2-15",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "Which SageMaker feature offers a hub of pre-trained models and solution templates you can deploy or fine-tune with a few clicks?",
      options: ["SageMaker JumpStart", "SageMaker Clarify", "SageMaker Model Monitor", "SageMaker Debugger"],
      answer: [0],
      explanation: "SageMaker JumpStart is the model hub for open and proprietary FMs and ML solutions, deployable into your own account.",
    },
    {
      id: "d2-16",
      domain: "d2",
      lesson: "d2-lifecycle",
      prompt: "What is the main advantage of using a pre-trained foundation model instead of training a model from scratch?",
      options: [
        "Lower cost and faster time to value",
        "It never hallucinates",
        "It requires no data governance",
        "It always outperforms custom models",
      ],
      answer: [0],
      explanation: "Training from scratch needs huge data and compute. FMs let you start from broad capability and adapt cheaply.",
    },
    {
      id: "d2-17",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "Which AWS chips are purpose-built for low-cost, high-performance deep learning inference?",
      options: ["AWS Inferentia", "AWS Graviton", "AWS Nitro", "AWS Outposts"],
      answer: [0],
      explanation: "AWS Inferentia accelerates inference. AWS Trainium is for training. Graviton is a general-purpose Arm CPU.",
    },
    {
      id: "d2-18",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "Which business metric would best measure the value of a GenAI customer support assistant?",
      options: [
        "Reduction in average handle time and improved customer satisfaction",
        "Number of GPUs used",
        "Size of the model in parameters",
        "The model's training loss",
      ],
      answer: [0],
      explanation:
        "Business value metrics include conversion rate, efficiency, average revenue per user, cost savings, and customer lifetime value, not internal technical stats.",
    },
    {
      id: "d2-19",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "What is the Model Context Protocol (MCP)?",
      options: [
        "An open standard for connecting AI agents to external tools and data sources",
        "An AWS encryption algorithm",
        "A metric for translation quality",
        "A type of GPU",
      ],
      answer: [0],
      explanation:
        "MCP is like a universal plug: a standard way for an agent to discover and call tools, APIs, and data, so each integration doesn't need custom code.",
    },
    {
      id: "d2-20",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "What is context engineering in an FM application?",
      options: [
        "Deciding what information goes into the model's context window (instructions, retrieved data, memory, tool results) so it can do the task well",
        "Replacing the model's weights",
        "Buying more GPUs",
        "Encrypting the prompt",
      ],
      answer: [0],
      explanation:
        "Context engineering goes beyond one prompt: it curates everything the model sees, including system instructions, history, retrieved documents, memory, and tool outputs, within the token limit.",
    },
    {
      id: "d2-21",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "A company wants several specialised agents (research, writing, review) that a supervisor agent coordinates. What is this pattern called?",
      options: ["A multi-agent system", "Batch transform", "Transfer learning", "Data augmentation"],
      answer: [0],
      explanation:
        "Multi-agent systems split complex work among specialised agents. Common patterns include supervisor/worker, sequential hand-offs, and agents collaborating in parallel.",
    },
    {
      id: "d2-22",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "A team built an agent and now needs a secure, serverless place to run it at scale, with memory, identity, and tool access built in. Which AWS service fits?",
      options: ["Amazon Bedrock AgentCore", "Amazon Polly", "AWS Artifact", "Amazon Textract"],
      answer: [0],
      explanation:
        "Amazon Bedrock AgentCore provides building blocks to run agents in production: Runtime, Memory, Gateway (turns APIs into tools), Identity, Policy, and observability. It works with any framework, such as Strands Agents.",
    },
    {
      id: "d2-23",
      domain: "d2",
      lesson: "d2-models",
      prompt: "Which is Amazon's own family of foundation models available in Amazon Bedrock?",
      options: ["Amazon Nova", "Amazon Neptune", "Amazon Inspector", "Amazon Macie"],
      answer: [0],
      explanation:
        "Amazon Nova includes text and multimodal understanding models plus creative models for images and video, and speech models. Neptune is a graph database.",
    },
    {
      id: "d2-24",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "A company wants AI agents to help modernise legacy applications, such as moving .NET or mainframe code. Which AWS service is built for this?",
      options: ["AWS Transform", "Amazon Translate", "Amazon Lex", "AWS Glue DataBrew"],
      answer: [0],
      explanation: "AWS Transform uses agentic AI to speed up migration and modernisation projects. Don't confuse it with Amazon Translate, which translates human languages.",
    },
    {
      id: "d2-25",
      domain: "d2",
      lesson: "d2-lifecycle",
      type: "order",
      prompt: "Put the foundation model lifecycle stages in order.",
      items: ["Select data", "Pre-train the model", "Fine-tune for a task", "Evaluate", "Deploy and collect feedback"],
      explanation: "Data selection, pre-training, fine-tuning, evaluation, then deployment. Feedback from users feeds the next round of improvement.",
    },
    {
      id: "d2-26",
      domain: "d2",
      lesson: "d2-tokens",
      prompt: "A chatbot sends very long prompts and gets long answers. What happens to cost with on-demand token pricing?",
      options: [
        "Cost rises with both input and output tokens",
        "Cost is fixed per request no matter the length",
        "Only output tokens are billed, so long prompts are free",
        "Longer prompts reduce cost",
      ],
      answer: [0],
      explanation: "On-demand pricing charges per input and per output token. Trimming prompts, capping output, and prompt caching all cut cost and latency.",
    },
    {
      id: "d2-27",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "Why might a team pick Amazon Bedrock over training its own model? (Choose two.)",
      options: [
        "Faster time to market",
        "No infrastructure to manage",
        "It guarantees zero hallucinations",
        "It removes the need for any security controls",
        "It always costs nothing",
      ],
      answer: [0, 1],
      explanation: "Managed GenAI services lower the barrier to entry: no servers, pay-as-you-go, quick experimentation. You still own security of your data and must handle hallucinations.",
    },
    // ── Practice set 2 ──
    {
      id: "d2-28",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "An online store wants product descriptions written automatically from a list of product attributes. Which approach fits?",
      options: ["Text generation with a large language model", "K-means clustering", "Linear regression", "Amazon Inspector"],
      answer: [0],
      explanation: "Generating fluent text from structured inputs is a core LLM use case.",
    },
    {
      id: "d2-29",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "Which task is LEAST suited to generative AI?",
      options: [
        "Calculating exact tax owed using fixed legal formulas",
        "Drafting marketing email copy",
        "Summarising meeting notes",
        "Brainstorming product names",
      ],
      answer: [0],
      explanation: "When a precise, deterministic answer is required, a formula or rules engine is more reliable and cheaper than a GenAI model.",
    },
    {
      id: "d2-30",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "Users notice that the same prompt returns slightly different answers each time. What explains this?",
      options: [
        "Sampling during generation makes outputs nondeterministic",
        "The model is retrained after every request",
        "The prompt is encrypted differently each time",
        "Tokens are billed randomly",
      ],
      answer: [0],
      explanation: "LLMs sample the next token from a probability distribution. Lowering temperature makes results more consistent.",
    },
    {
      id: "d2-31",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "Why is it hard to explain exactly why an LLM gave a specific answer?",
      options: [
        "Its behaviour comes from billions of learned parameters, so interpretability is low",
        "LLMs don't use any data",
        "LLMs follow a short list of hand-written rules",
        "LLM answers are always random",
      ],
      answer: [0],
      explanation: "Low interpretability is a key GenAI limitation. It matters in regulated settings where decisions must be explained.",
    },
    {
      id: "d2-32",
      domain: "d2",
      lesson: "d2-embeddings",
      prompt: "In generative AI, what is a vector?",
      options: [
        "An ordered list of numbers that represents data, such as an embedding",
        "A type of encryption key",
        "A single word in a prompt",
        "A billing unit for model training",
      ],
      answer: [0],
      explanation: "Embeddings are vectors. Similar meanings produce vectors that are close together, which powers semantic search.",
    },
    {
      id: "d2-33",
      domain: "d2",
      lesson: "d2-lifecycle",
      prompt: "A model doesn't know about a product your company launched last month. What is the most likely reason?",
      options: [
        "Its training data stops at a knowledge cutoff; use RAG to supply fresh information",
        "The temperature is too low",
        "The model is multimodal",
        "The context window is too large",
      ],
      answer: [0],
      explanation: "FMs only know what was in their training data. RAG injects current documents at query time without retraining.",
    },
    {
      id: "d2-34",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "A company has steady, high-volume traffic to a Bedrock model and needs guaranteed capacity. Which option fits?",
      options: ["Provisioned Throughput", "On-demand calls with a higher temperature", "Amazon Polly", "A larger context window"],
      answer: [0],
      explanation: "Provisioned Throughput reserves model capacity for a commitment term. On-demand pricing suits variable or low traffic.",
    },
    {
      id: "d2-35",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "A team must summarise a million documents overnight and doesn't need real-time answers. What is the most cost-effective option in Bedrock?",
      options: ["Batch inference", "One real-time request per document during business hours", "Raise the temperature", "Fine-tune a new model first"],
      answer: [0],
      explanation: "Bedrock batch inference processes large jobs asynchronously at a lower price than on-demand real-time calls.",
    },
    {
      id: "d2-36",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "Which metric best shows that a GenAI shopping assistant increased sales?",
      options: ["Conversion rate", "Number of tokens per response", "Embedding dimension", "Model temperature"],
      answer: [0],
      explanation: "Conversion rate is a business metric tied to revenue. Token counts and settings are technical details.",
    },
    {
      id: "d2-37",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "An internal GenAI tool cut report-writing time from 4 hours to 1 hour. Which kind of business value is this?",
      options: ["Efficiency (productivity gain)", "Model accuracy", "Data residency", "Lower latency of the network"],
      answer: [0],
      explanation: "Saving employee time is an efficiency gain, one of the business metrics used to justify GenAI.",
    },
    {
      id: "d2-38",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "A team wants to deploy an open-source foundation model into its own account, choosing the instance type and managing the endpoint. Which option fits?",
      options: ["Amazon SageMaker JumpStart", "Amazon Quick", "Amazon Polly", "AWS Artifact"],
      answer: [0],
      explanation: "JumpStart deploys pre-trained models to SageMaker AI endpoints you control. Bedrock is serverless, with AWS managing the hosting.",
    },
    {
      id: "d2-39",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "Which AWS chips are purpose-built for cost-effective training of deep learning models?",
      options: ["AWS Trainium", "AWS Inferentia", "AWS Nitro", "AWS Snowball"],
      answer: [0],
      explanation: "Trainium targets training. Inferentia targets inference.",
    },
    {
      id: "d2-40",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "An AI agent must remember a customer's preferences across separate conversations days apart. What capability does it need?",
      options: ["Long-term memory, such as AgentCore Memory", "A higher temperature", "A smaller context window", "Batch inference"],
      answer: [0],
      explanation: "Short-term memory covers one session. Long-term memory persists facts and preferences across sessions.",
    },
    {
      id: "d2-41",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "How does an AI agent check live inventory before answering a customer?",
      options: [
        "It calls a tool or API (for example through MCP) and uses the result",
        "It guesses from its training data",
        "It raises its temperature",
        "It retrains itself on the spot",
      ],
      answer: [0],
      explanation: "Tool use lets agents fetch live data and take actions. MCP standardises how agents connect to those tools.",
    },
    {
      id: "d2-42",
      domain: "d2",
      lesson: "d2-agents",
      type: "order",
      prompt: "Put the steps an AI agent takes to handle a request in order.",
      items: ["Receive the user's goal", "Plan the steps", "Call tools or APIs", "Observe the results", "Respond or continue to the next step"],
      explanation: "Agents loop: plan, act with tools, observe, and either finish or plan the next step.",
    },
    {
      id: "d2-43",
      domain: "d2",
      lesson: "d2-models",
      type: "match",
      prompt: "Match each model type to an example of its output.",
      pairs: [
        ["Diffusion model", "A product photo generated from a description"],
        ["Large language model", "A summary of a 20-page report"],
        ["Embedding model", "A vector used for semantic search"],
        ["Multimodal model", "A caption describing an uploaded photo"],
      ],
      explanation: "Diffusion models make images, LLMs make text, embedding models make vectors, and multimodal models combine input types.",
    },
    {
      id: "d2-44",
      domain: "d2",
      lesson: "d2-stack",
      type: "match",
      prompt: "Match each AWS offering to the people it's built for.",
      pairs: [
        ["Amazon Quick", "Business users asking questions about company data"],
        ["Kiro", "Developers turning specs into working code"],
        ["Amazon Bedrock", "Builders calling foundation models through an API"],
        ["Amazon SageMaker AI", "Data scientists training custom models"],
      ],
      explanation: "AWS's GenAI stack goes from ready-made apps (Quick, Kiro) to model APIs (Bedrock) to full ML platforms (SageMaker AI).",
    },
    {
      id: "d2-45",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "Which are advantages of generative AI? (Choose two.)",
      options: [
        "One model can adapt to many different tasks",
        "Natural, conversational interaction",
        "Guaranteed factual accuracy",
        "Fully deterministic output",
        "No need to evaluate outputs",
      ],
      answer: [0, 1],
      explanation: "Adaptability and conversational ability are strengths. Accuracy is not guaranteed, outputs vary, and evaluation is always needed.",
    },
    // ── Practice set 3 ──
    {
      id: "d2-46",
      domain: "d2",
      lesson: "d2-cloud-basics",
      prompt: "A company keeps sensitive systems in its own data center but runs new AI workloads on AWS. Which cloud deployment model is this?",
      options: ["Hybrid cloud", "Public cloud only", "Private cloud only", "Software as a Service"],
      answer: [0],
      explanation: "Hybrid cloud combines on-premises (private) infrastructure with public cloud services.",
    },
    {
      id: "d2-47",
      domain: "d2",
      lesson: "d2-cloud-basics",
      prompt: "Which factors should drive the choice of AWS Region for a new AI application? (Choose two.)",
      options: ["Data residency and compliance requirements", "Proximity to users for lower latency", "The color of the AWS console", "The number of IAM users in the account", "Whether the team prefers Python"],
      answer: [0, 1],
      explanation: "Choose a Region by compliance, latency to users, which services are available there, and pricing.",
    },
    {
      id: "d2-48",
      domain: "d2",
      lesson: "d2-cloud-basics",
      prompt: "Renting virtual servers, storage, and networking that you configure yourself, such as Amazon EC2, is an example of which cloud type?",
      options: ["Infrastructure as a Service (IaaS)", "Software as a Service (SaaS)", "Platform as a Service (PaaS)", "On-premises hosting"],
      answer: [0],
      explanation: "IaaS gives the most flexibility: you manage the OS and apps on provider-run hardware.",
    },
    {
      id: "d2-49",
      domain: "d2",
      lesson: "d2-cloud-basics",
      prompt: "A new GenAI feature isn't available in the AWS Region a company uses. What is the most likely explanation?",
      options: ["New services and features roll out to Regions at different times", "Regions share every service at the same moment", "Availability Zones control service availability", "Edge locations host the service instead"],
      answer: [0],
      explanation: "Service availability varies by Region. Check the Region table before choosing where to deploy.",
    },
    {
      id: "d2-50",
      domain: "d2",
      lesson: "d2-cloud-basics",
      prompt: "Which is one of the advantages of cloud computing?",
      options: ["Trade up-front capital expense for pay-as-you-go operating expense", "You must buy hardware for peak demand", "Capacity has to be planned years ahead", "Every Region has identical prices"],
      answer: [0],
      explanation: "Other advantages include economies of scale, no capacity guessing, speed and agility, and going global in minutes.",
    },
    {
      id: "d2-51",
      domain: "d2",
      lesson: "d2-cloud-basics",
      prompt: "Training archives must be kept for 7 years and are almost never read. Which Amazon S3 storage class is the most cost-effective?",
      options: ["S3 Glacier Deep Archive", "S3 Standard", "S3 Standard-Infrequent Access", "S3 Intelligent-Tiering"],
      answer: [0],
      explanation: "Deep Archive is the cheapest class for rarely accessed long-term data, with retrieval in hours. Intelligent-Tiering suits unknown access patterns.",
    },
    {
      id: "d2-52",
      domain: "d2",
      lesson: "d2-cloud-basics",
      prompt: "Which AWS service runs code without managing servers, billing only for requests and run time, and is often used behind Bedrock Agents action groups?",
      options: ["AWS Lambda", "Amazon EC2", "Amazon S3 Glacier", "AWS Artifact"],
      answer: [0],
      explanation: "Lambda is serverless and event-driven. Agents can call Lambda functions to perform actions.",
    },
    {
      id: "d2-53",
      domain: "d2",
      lesson: "d2-bedrock-costs",
      prompt: "A team wants to cut the cost of a Bedrock workload that runs overnight and doesn't need instant answers. What helps most?",
      options: ["Use Bedrock batch inference", "Lower the temperature", "Raise Top K", "Buy Provisioned Throughput for six months"],
      answer: [0],
      explanation: "Batch inference can be up to about 50% cheaper. Sampling settings don't affect price, and Provisioned Throughput reserves capacity rather than saving money.",
    },
    {
      id: "d2-54",
      domain: "d2",
      lesson: "d2-bedrock-costs",
      prompt: "How are embedding models billed in Amazon Bedrock on demand?",
      options: ["Per input token processed", "Per image generated", "Per hour of GPU time", "A flat monthly fee"],
      answer: [0],
      explanation: "Text models bill input and output tokens, embedding models bill input tokens, and image models bill per image.",
    },
    {
      id: "d2-55",
      domain: "d2",
      lesson: "d2-bedrock-costs",
      prompt: "Which change does NOT reduce the cost of a Bedrock text application?",
      options: ["Lowering the temperature", "Sending shorter prompts", "Capping the response length", "Switching to a smaller model that meets quality needs"],
      answer: [0],
      explanation: "Temperature, Top P, and Top K change the style of output, not the price. Tokens and model size drive cost.",
    },
    {
      id: "d2-56",
      domain: "d2",
      lesson: "d2-bedrock-costs",
      prompt: "Which factors affect how quickly a model responds? (Choose two.)",
      options: ["The size of the model", "The number of input and output tokens", "The temperature setting", "The Top P setting", "The name of the S3 bucket"],
      answer: [0, 1],
      explanation: "Latency depends on model size and type and on input and output length. Temperature, Top P, and Top K don't change it.",
    },
    {
      id: "d2-57",
      domain: "d2",
      lesson: "d2-bedrock-costs",
      prompt: "An operations team wants an alarm when Bedrock Guardrails start filtering many responses. What should they use?",
      options: ["Amazon CloudWatch metrics published by Bedrock, with a CloudWatch alarm", "AWS Artifact", "Amazon Polly", "S3 Lifecycle rules"],
      answer: [0],
      explanation: "Bedrock publishes CloudWatch metrics, including a count of filtered content, and you can alarm on them. Invocation logging adds the full request and response detail.",
    },
    {
      id: "d2-58",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "Employees want Amazon Quick to answer only from documents they're allowed to see. What makes this work?",
      options: ["Users sign in through IAM Identity Center, and answers respect each user's document access", "Every user shares one admin login", "Answers are always generated from public internet data", "Temperature is set to 0"],
      answer: [0],
      explanation: "Quick authenticates users (often via IAM Identity Center with an external identity provider) and generates responses only from content each user can access.",
    },
    {
      id: "d2-59",
      domain: "d2",
      lesson: "d2-stack",
      type: "match",
      prompt: "Match each Amazon Quick capability to what it does.",
      pairs: [
        ["Quick Index", "A managed, searchable knowledge base of company data"],
        ["Quick Research", "A deep-research agent that writes cited reports"],
        ["Quick Flows", "Simple automations described in plain language"],
        ["Quick Sight", "AI-powered BI dashboards you can ask questions about"],
      ],
      explanation: "Quick also has Quick Automate for multi-step agentic workflows with approvals, and Spaces for shared team workspaces.",
    },
    {
      id: "d2-60",
      domain: "d2",
      lesson: "d2-models",
      prompt: "A company wants natural, real-time spoken conversations with customers using an Amazon model. Which Nova 2 model fits?",
      options: ["Nova 2 Sonic (speech-to-speech)", "Nova 2 Multimodal Embeddings", "Amazon Neptune", "Amazon Textract"],
      answer: [0],
      explanation: "Nova 2 Sonic handles real-time voice. Nova 2 Lite is a fast, cost-effective reasoning model, Multimodal Embeddings powers semantic search, and Omni combines multimodal reasoning with image generation.",
    },
    {
      id: "d2-61",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "How does a Bedrock agent know which company APIs it can call to look up orders?",
      options: ["You define action groups, described with an OpenAPI schema and often backed by Lambda functions", "The agent searches the internet for APIs", "The temperature setting lists them", "AWS Artifact registers them"],
      answer: [0],
      explanation: "Action groups tell the agent which operations exist and how to call them. Knowledge bases supply documents for RAG.",
    },
  ],

  cards: [
    { id: "s-bedrock", domain: "d2", kind: "service", term: "Amazon Bedrock", definition: "Serverless API access to foundation models from many providers" },
    { id: "s-jumpstart", domain: "d2", kind: "service", term: "SageMaker JumpStart", definition: "Hub of pre-trained models and solutions to deploy or fine-tune" },
    { id: "s-kiro", domain: "d2", kind: "service", term: "Kiro", definition: "Agentic IDE: turns requirements into specs, tasks, and code" },
    { id: "s-quick", domain: "d2", kind: "service", term: "Amazon Quick", definition: "Agentic AI workspace: research, BI, and automation over company data" },
    { id: "s-strands", domain: "d2", kind: "service", term: "Strands Agents", definition: "Open-source SDK to build model-driven AI agents" },
    { id: "s-agentcore", domain: "d2", kind: "service", term: "Bedrock AgentCore", definition: "Run agents in production: runtime, memory, gateway, identity, policy" },
    { id: "s-nova", domain: "d2", kind: "service", term: "Amazon Nova", definition: "Amazon's own family of foundation models in Bedrock" },
    { id: "s-transform", domain: "d2", kind: "service", term: "AWS Transform", definition: "Agentic AI for migrating and modernising legacy apps" },
    { id: "c-pt", domain: "d2", kind: "concept", term: "Provisioned Throughput", definition: "Reserved model capacity, required for custom models in Bedrock" },
    { id: "c-token", domain: "d2", kind: "concept", term: "Token", definition: "A unit of text (word or sub-word) the model reads and writes" },
    { id: "c-embedding", domain: "d2", kind: "concept", term: "Embedding", definition: "A vector that captures semantic meaning for similarity search" },
    { id: "c-hallucination", domain: "d2", kind: "concept", term: "Hallucination", definition: "Confident but false or fabricated output" },
    { id: "c-transformer", domain: "d2", kind: "concept", term: "Transformer", definition: "Self-attention architecture behind modern LLMs" },
    { id: "c-diffusion", domain: "d2", kind: "concept", term: "Diffusion model", definition: "Generates images by iteratively removing noise" },
    { id: "c-mcp", domain: "d2", kind: "concept", term: "MCP", definition: "Open standard that plugs agents into tools and data" },
    { id: "c-context", domain: "d2", kind: "concept", term: "Context engineering", definition: "Curating everything the model sees: instructions, data, memory, tools" },
    { id: "c-region", domain: "d2", kind: "concept", term: "AWS Region", definition: "Geographic area; choose by compliance, latency, services, price" },
    { id: "c-az", domain: "d2", kind: "concept", term: "Availability Zone", definition: "Isolated data center(s) within a Region" },
    { id: "c-iaas", domain: "d2", kind: "concept", term: "IaaS / PaaS / SaaS", definition: "Building blocks / platform for your code / finished app" },
    { id: "c-hybrid", domain: "d2", kind: "concept", term: "Hybrid cloud", definition: "On-premises systems plus public cloud" },
    { id: "s-lambda", domain: "d2", kind: "service", term: "AWS Lambda", definition: "Serverless functions billed per request and run time" },
    { id: "c-batchbedrock", domain: "d2", kind: "concept", term: "Bedrock batch inference", definition: "Bulk requests, results in S3, up to ~50% cheaper" },
    { id: "c-latency", domain: "d2", kind: "concept", term: "Model latency drivers", definition: "Model size/type and token counts, not temperature" },
    { id: "c-nova2", domain: "d2", kind: "concept", term: "Amazon Nova 2", definition: "Lite (reasoning), Sonic (voice), Multimodal Embeddings, Omni" },
    { id: "c-quickindex", domain: "d2", kind: "concept", term: "Quick Index", definition: "Amazon Quick's managed knowledge base of company data" },
  ],

  challenges: [
    {
      id: "ch-twelve-tokens",
      domain: "d2",
      lesson: "d2-tokens",
      title: "Exactly 12 tokens",
      goal: "Edit the sentence until it comes to exactly 12 tokens.",
      hint: "Long words split into several tokens, and punctuation counts too.",
      takeaway: "Tokens aren't words. Cost and context limits are counted in tokens, so wording affects price.",
      render: (onSolved) => <TokenDemo goal="exact12" onSolved={onSolved} />,
    },
    {
      id: "ch-search-by-meaning",
      domain: "d2",
      lesson: "d2-embeddings",
      title: "Search by meaning",
      goal: "Find the refund documents using a question that never says \"refund\".",
      hint: "Embeddings match meaning, not exact words.",
      takeaway: "Semantic search compares vectors, so \"money back\" finds \"refund\". That's how RAG retrieval works.",
      render: (onSolved) => <EmbeddingLab goal="refunds" onSolved={onSolved} />,
    },
  ],
});
