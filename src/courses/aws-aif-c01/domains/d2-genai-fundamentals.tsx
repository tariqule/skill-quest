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
      "How generative AI works under the hood (tokens, embeddings, transformers and foundation models), what it's good and bad at, and the AWS services you build it with.",
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
    // ── Start here ──
    {
      id: "d2-start-genai",
      level: "beginner",
      check: ["aif-b2-01", "aif-b2-02"],
      task: "2.1",
      title: "What generative AI is",
      visual: (
        <Flow
          color="#a78bfa"
          steps={[
            { icon: "✍️", label: "You write a prompt", sub: "\"Write a thank-you note to a customer\"" },
            { icon: "🧠", label: "The model", sub: "Trained on a huge amount of text" },
            { icon: "📝", label: "New content", sub: "A note that didn't exist a second ago" },
          ]}
        />
      ),
      points: [
        "**Generative AI** is AI that creates something new: text, images, audio, video or code.",
        "You've seen the small version already. Your phone suggests the next word as you type. Generative AI does the same trick at a huge scale, one piece at a time.",
        "The instruction you give it is called a **prompt**. The model reads your prompt and writes a reply.",
        "A **large language model (LLM)** is a generative model trained on huge amounts of text, so it's good with words.",
      ],
      tip: "Older ML sorts or predicts, like \"spam or not spam\". Generative AI makes new content. That's the difference the exam cares about.",
    },
    {
      id: "d2-start-limits",
      level: "beginner",
      check: ["aif-b2-03", "aif-b2-04"],
      task: "2.2",
      title: "What it's good at, and where it slips",
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "👍", title: "Good at", text: "Drafting, summarising, translating, brainstorming and chatting in plain language.", color: "#34d399" },
            { icon: "⚠️", title: "Watch out for", text: "Made-up facts said with confidence, and answers that change each time you ask.", color: "#f87171" },
          ]}
        />
      ),
      points: [
        "Think of generative AI as a very well-read new intern. It writes fast and sounds sure of itself, but you still check its work.",
        "Sometimes it states things that are simply false. This is called a **hallucination**.",
        "Ask the same question twice and you may get two different answers. It isn't broken, it's how these models pick their words.",
        "It also only knows what it read during training, so it can miss recent news unless you give it the facts.",
      ],
      tip: "If a task needs one exact answer every time, like working out tax from a formula, a normal program is the safer choice.",
    },
    {
      id: "d2-start-bedrock",
      level: "beginner",
      check: ["aif-b2-05", "aif-b2-06"],
      task: "2.3",
      title: "Using AI models through the cloud",
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🔌", title: "The cloud", text: "Like electricity from the grid: you plug in and pay for what you use, instead of owning a power plant.", color: "#38bdf8" },
            { icon: "📚", title: "Amazon Bedrock", text: "A shelf of ready-trained models from Amazon and other companies, all reached the same way.", color: "#a78bfa" },
          ]}
        />
      ),
      points: [
        "Running a big AI model takes powerful, expensive computers. Most companies don't want to buy and look after them.",
        "**The cloud** means renting computing power over the internet instead. It's like getting electricity from the grid rather than building your own generator.",
        "**Amazon Bedrock** is the AWS service that gives you ready-trained models from Amazon and other companies. Your app sends a prompt and gets the answer back.",
        "You pay for what you use, so you can try an idea cheaply before committing to it.",
      ],
      tip: "When a question says \"use a foundation model without managing servers\", the answer is usually Amazon Bedrock.",
    },

    // ── Exam lessons ──
    {
      id: "d2-tokens",
      check: ["d2-01", "d2-26"],
      task: "2.1",
      title: "Tokens: how models read",
      visual: <TokenDemo />,
      points: [
        "A **token** is a chunk of text, roughly a short word or part of a longer one. Models read and write in tokens, not letters or words.",
        "The **context window** is the most tokens a model can handle in one request. That covers your prompt, the chat history, any documents and the answer.",
        "With on-demand pricing, Amazon Bedrock charges you for every input token and every output token.",
        "**Chunking** means cutting a long document into smaller pieces before you turn them into embeddings.",
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
        "An **embedding** is a list of numbers that captures what a piece of text means. Similar meanings get similar numbers, like nearby points on a map.",
        "Embedding models, such as Amazon Titan Text Embeddings, do this conversion for you.",
        "A **vector database** can quickly find the stored embeddings closest to a new one. That's what powers search by meaning and RAG.",
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
              { icon: "🔤", title: "Transformer LLM", text: "Uses self-attention to look at every token at once. Powers chat, summaries and code.", color: "#a78bfa" },
              { icon: "🖼️", title: "Multimodal model", text: "Works with more than one kind of data, such as text and images, sometimes audio and video too.", color: "#38bdf8" },
            ]}
          />
          <div>
            <div className="mb-2 text-sm font-semibold text-white">🌫️ Diffusion model: from noise to an image</div>
            <DiffusionSteps />
          </div>
        </div>
      ),
      points: [
        "A **foundation model (FM)** is a large model trained on a broad mix of data. You can then adapt it to many different jobs.",
        "**Amazon Nova** is Amazon's own family of foundation models, available in Amazon Bedrock.",
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
          loop="Feedback from users shapes the next version"
          steps={[
            { icon: "🧺", label: "Data selection", sub: "Huge, varied, carefully chosen" },
            { icon: "🧩", label: "Model selection", sub: "Pick the design and size" },
            { icon: "🏗️", label: "Pre-training", sub: "Self-supervised and very costly" },
            { icon: "🎛️", label: "Fine-tuning", sub: "Adapt it to specific tasks" },
            { icon: "📏", label: "Evaluation", sub: "Benchmarks and human review" },
            { icon: "🚀", label: "Deploy", sub: "Serve it and gather feedback" },
          ]}
        />
      ),
      points: [
        "Pre-training a foundation model costs a fortune, so most companies skip it. They start from an existing model and adapt it.",
      ],
    },
    {
      id: "d2-agents",
      check: ["d2-19", "d2-20"],
      task: "2.1",
      title: "Agentic AI and MCP",
      visual: <AgentLoop />,
      points: [
        "Generative AI answers. **Agentic AI** acts: it makes a plan, calls tools, checks the results and repeats until the job is done.",
        "**Context engineering** means choosing what the model gets to see: instructions, retrieved data, memory and tool results, all within its token limit.",
        "The **Model Context Protocol (MCP)** is an open standard for plugging agents into tools and data, a bit like USB for AI.",
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
              <li>• Adapts to many tasks</li>
              <li>• Quick to respond and easy to talk to</li>
              <li>• Creates content fast</li>
            </ul>
          </div>
          <div className="rounded-xl border border-rose-400/30 bg-rose-400/5 p-3">
            <div className="font-semibold text-rose-300">👎 Weaknesses</div>
            <ul className="mt-2 grid gap-1 text-sm text-slate-200">
              <li>• Hallucinations: confident but wrong</li>
              <li>• Hard to see why it answered that way</li>
              <li>• Nondeterministic: answers vary</li>
            </ul>
          </div>
        </div>
      ),
      points: [
        "When you choose a model, weigh its type, how capable it is, cost, speed, compliance needs and how complex it is to run.",
        "Show the value with business numbers: return on investment, time saved, conversion rate, revenue per user and customer lifetime value.",
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
            { name: "Build with models and agents", color: "#a78bfa", items: ["Amazon Bedrock", "Bedrock AgentCore", "Strands Agents", "Amazon Nova models"] },
            { name: "Build your own models", color: "#38bdf8", items: ["Amazon SageMaker AI", "SageMaker JumpStart", "EC2 (Trainium, Inferentia)"] },
          ]}
        />
      ),
      points: [
        "Managed services make starting easy. There are no servers to run, you can experiment quickly, and you pay as you go.",
        "The big cost choices are paying per token on demand or reserving Provisioned Throughput, which custom models need. Region and redundancy also change the bill.",
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
              { name: "SaaS: you just use it", color: "#34d399", items: ["A finished app the provider runs for you", "For example, a web email service"] },
              { name: "PaaS: you bring the code", color: "#a78bfa", items: ["The provider runs servers and runtime", "You deploy and manage the app"] },
              { name: "IaaS: you get building blocks", color: "#38bdf8", items: ["Virtual servers, storage, networking", "The most flexible, like Amazon EC2"] },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🌍", title: "Region", text: "A part of the world with several groups of data centers. Your data stays there unless you move it." },
              { icon: "🏢", title: "Availability Zone", text: "One or more separate data centers inside a Region, each with its own power and networking." },
              { icon: "📍", title: "Edge location", text: "Small sites close to users. Amazon CloudFront uses them to deliver content quickly." },
            ]}
          />
        </div>
      ),
      points: [
        "Pick a **Region** based on four things: rules about where data must live, how close it is to your users, which services it offers, and price.",
        "With the cloud you pay as you go instead of buying hardware up front. In finance terms, capital spending becomes operating spending.",
        "You also get the provider's economies of scale, no guessing about capacity, speed, and the ability to go global in minutes.",
        "AI apps lean on a few core services: **S3** stores data, **EC2** gives you servers, **Lambda** runs code without servers, and **IAM** controls access.",
        "S3 has storage classes for every need, from Standard for everyday data down to Glacier Deep Archive for data you almost never read.",
      ],
      tip: "If a question says \"data must stay in the EU\", pick an EU Region. Keeping data in one place is called data residency, and it's a Region decision.",
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
              { icon: "⚡", title: "On-demand", text: "Pay per token for text, per input token for embeddings, or per image. No commitment. Best when traffic is unpredictable.", color: "#38bdf8" },
              { icon: "📦", title: "Batch", text: "Send many requests at once and get the results in S3. Up to about 50% cheaper.", color: "#34d399" },
              { icon: "🔒", title: "Provisioned Throughput", text: "Reserve model capacity for a set term. You get guaranteed capacity, but it usually doesn't save money.", color: "#a78bfa" },
            ]}
          />
          <Tiles
            tiles={[
              { icon: "💰", title: "What changes cost", text: "Mostly the number of input and output tokens. Also model size, provider and pricing mode.", color: "#f59e0b" },
              { icon: "⏱️", title: "What changes speed", text: "Model size and type, plus how long the input and output are. Temperature, Top P and Top K change neither cost nor speed.", color: "#f87171" },
            ]}
          />
        </div>
      ),
      points: [
        "**Model invocation logging** saves every prompt and response to CloudWatch Logs, S3 or both, so you can audit and analyse them later.",
        "Bedrock sends metrics to CloudWatch, including how often guardrails blocked content. You can set alarms on them.",
        "Running a fine-tuned model also costs more than running the base model.",
      ],
      tip: "\"Lower the temperature to save money\" is a classic wrong answer. Using fewer tokens or a smaller model is what saves money.",
    },
  ],

  questions: [
    // ── Start here ──
    {
      id: "aif-b2-01",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-genai",
      prompt: "What makes generative AI different from older kinds of AI?",
      options: [
        "It creates new content, such as text or images",
        "It only sorts existing things into fixed categories",
        "It follows rules that people write by hand",
        "It only works with numbers in spreadsheets",
      ],
      answer: [0],
      explanation:
        "Older AI mostly sorts or predicts, like deciding whether an email is spam. Generative AI makes something new, such as a paragraph, a picture or some code.",
    },
    {
      id: "aif-b2-02",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-genai",
      prompt: "You type \"Summarise this email in two sentences\" into an AI assistant. What is that instruction called?",
      options: [
        "A prompt",
        "A token",
        "A label",
        "A parameter",
      ],
      answer: [0],
      explanation:
        "The instruction you give a generative model is a prompt. The model reads it and writes a reply. Clear prompts usually get better answers.",
    },
    {
      id: "aif-b2-03",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-limits",
      prompt: "An AI assistant confidently names a book that doesn't exist. What is this called?",
      options: ["A hallucination", "A prompt", "Training", "A context window"],
      answer: [0],
      explanation:
        "When a model states something false as if it were true, that's a hallucination. It's why you check important facts the model gives you.",
    },
    {
      id: "aif-b2-04",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-limits",
      prompt: "Which job is generative AI best suited for?",
      options: [
        "Drafting a first version of a product description",
        "Working out exact tax owed from a fixed formula",
        "Storing a bank's account balances for each customer",
        "Counting the rows in a spreadsheet of orders",
      ],
      answer: [0],
      explanation:
        "Generative AI is great at writing drafts in plain language. Exact sums and record keeping need one right answer every time, so a normal program does them better.",
    },
    {
      id: "aif-b2-05",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-bedrock",
      prompt: "What does \"using the cloud\" mean for a company?",
      options: [
        "Renting computing power over the internet and paying for use",
        "Storing all company files only on office laptops and drives",
        "Buying and running all your own servers in your own building",
        "Paying a fixed yearly fee for servers whether you use them or not",
      ],
      answer: [0],
      explanation:
        "The cloud is computing you rent over the internet, a bit like electricity from the grid. You don't buy the machines, and you pay for what you use.",
    },
    {
      id: "aif-b2-06",
      domain: "d2",
      level: "beginner",
      lesson: "d2-start-bedrock",
      prompt: "Which AWS service gives you ready-trained AI models from Amazon and other companies, without managing servers?",
      options: [
        "Amazon Bedrock",
        "Amazon SageMaker AI",
        "Amazon Comprehend",
        "Amazon Lex",
      ],
      answer: [0],
      explanation:
        "Amazon Bedrock is a shelf of ready-trained models you reach through one service. S3 stores files, EC2 rents servers and Lambda runs small pieces of code.",
    },

    // ── Exam questions ──
    {
      id: "d2-01",
      domain: "d2",
      lesson: "d2-tokens",
      prompt: "What is a token, when we talk about large language models?",
      options: [
        "A security credential used to call the model's API",
        "A unit of text, such as a word or part of a word",
        "A single neuron inside the model's neural network",
        "A prepaid credit used to pay for each inference call",
      ],
      answer: [1],
      explanation:
        "LLMs read and write text in tokens, which are whole words or pieces of words. Prices and context window limits are both counted in tokens.",
    },
    {
      id: "d2-02",
      domain: "d2",
      lesson: "d2-embeddings",
      prompt: "What are embeddings?",
      options: [
        "Number vectors that capture the meaning of text or images",
        "Images placed inside a prompt so that the model can see them",
        "Encrypted copies of the training data kept by the model",
        "Fixed rules stored inside a model to guide its answers",
      ],
      answer: [0],
      explanation:
        "Embeddings turn text, images or other data into lists of numbers, called vectors, where similar meanings sit close together. They power search by meaning and RAG. Amazon Titan Text Embeddings is one example.",
    },
    {
      id: "d2-03",
      domain: "d2",
      lesson: "d2-models",
      prompt: "Which neural network design, built on self-attention, sits behind most modern LLMs?",
      options: ["Convolutional neural network", "Recurrent neural network", "Transformer", "Generative adversarial network"],
      answer: [2],
      explanation: "Transformers use self-attention to weigh how every token relates to every other token, all at the same time rather than one by one.",
    },
    {
      id: "d2-04",
      domain: "d2",
      lesson: "d2-models",
      prompt: "Which type of model makes images by learning to remove noise, a little at a time?",
      options: ["Diffusion model", "Linear regression", "Decision tree", "k-nearest neighbors"],
      answer: [0],
      explanation:
        "A diffusion model starts from random static and cleans it up step by step until an image appears. Stable Diffusion and Amazon Nova Canvas are image generation models.",
    },
    {
      id: "d2-05",
      domain: "d2",
      lesson: "d2-models",
      prompt: "What is a foundation model (FM)?",
      options: [
        "A large model pre-trained on broad data and adapted to many tasks",
        "A small model trained for one narrow task, such as filtering spam email",
        "A rules engine that other chatbots are built on top of",
        "Any machine learning model that is hosted and managed on AWS",
      ],
      answer: [1],
      explanation:
        "Foundation models are pre-trained on huge, broad, mostly unlabeled data using self-supervised learning. You then adapt them with prompting, RAG or fine-tuning.",
    },
    {
      id: "d2-06",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "What is a hallucination in generative AI?",
      options: [
        "When a model states false or made-up content as if it were true",
        "When a model refuses to answer because a guardrail blocked the request",
        "When a model runs out of tokens and stops mid-sentence",
        "When a model returns an image even though text was requested",
      ],
      answer: [1],
      explanation: "A hallucination is an answer that sounds right but is wrong or made up. You can reduce them with RAG, a lower temperature, guardrails and clear prompts.",
    },
    {
      id: "d2-07",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "Which of these are limitations of generative AI? (Choose two.)",
      options: ["Hallucinations", "Nondeterministic outputs", "Inability to produce text", "Always requires labeled data"],
      answer: [0, 1],
      explanation:
        "Generative AI can hallucinate, and it can give different answers to the same prompt, which is called nondeterminism. Other limits are that it's hard to interpret, it can be toxic, and its knowledge stops at a cutoff date.",
    },
    {
      id: "d2-08",
      domain: "d2",
      lesson: "d2-models",
      prompt: "What is a multimodal model?",
      options: [
        "A model deployed across several AWS Regions for resilience",
        "A model that can take in or produce more than one data type",
        "A model with several hyperparameters tuned at the same time",
        "An ensemble that combines several classification models",
      ],
      answer: [1],
      explanation: "A multimodal model handles more than one kind of data, such as text, images, audio and video. For example, it can look at a photo and describe it in words.",
    },
    {
      id: "d2-09",
      domain: "d2",
      lesson: "d2-tokens",
      prompt: "What is the context window of an LLM?",
      options: [
        "The box in the app where users type their prompts",
        "The most tokens the model can consider in one request",
        "The time between each scheduled retraining of the model",
        "The list of AWS Regions where the model can be called",
      ],
      answer: [1],
      explanation: "The context window is the limit on how much fits into one call. Your prompt, the chat history, any retrieved documents and the reply all count toward it.",
    },
    {
      id: "d2-10",
      domain: "d2",
      lesson: "d2-tokens",
      prompt: "How are you charged when you call a model in Amazon Bedrock on demand?",
      options: [
        "You pay per input and output token processed",
        "A fixed monthly licence for each named user",
        "You pay only for the hours spent training it",
        "A flat fee per model, no matter how much you use",
      ],
      answer: [0],
      explanation:
        "On-demand Bedrock pricing is per token, for both input and output. Provisioned Throughput is different: it reserves capacity for a set term, and custom fine-tuned models need it.",
    },
    {
      id: "d2-11",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "Which AWS service gives you fully managed access to foundation models from Amazon, Anthropic, Meta, Mistral and others through one API?",
      options: ["Amazon SageMaker AI", "Amazon Bedrock", "Amazon Quick", "AWS Lambda"],
      answer: [1],
      explanation: "Amazon Bedrock is serverless access to many foundation models through one API. It also includes Knowledge Bases, Agents, Guardrails and ways to customise models.",
    },
    {
      id: "d2-12",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "A development team wants an AI-powered IDE that turns a plain-language feature request into a spec, a task plan and working code. Which AWS tool fits?",
      options: ["Kiro", "Amazon Lex", "AWS CloudFormation", "Amazon Polly"],
      answer: [0],
      explanation:
        "Kiro is AWS's agentic IDE, a code editor with an AI agent built in. It works spec first: it turns requirements into a spec and tasks, then helps write and update the code.",
    },
    {
      id: "d2-13",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "Employees want one AI workspace to ask questions across company documents, build dashboards in plain language and automate routine tasks. Which service fits?",
      options: ["Amazon Quick", "Amazon Lex", "Amazon Polly", "Amazon EMR"],
      answer: [0],
      explanation:
        "Amazon Quick, also called Quick Suite, is the agentic AI workspace that replaced Amazon Q Business. It brings research, BI dashboards and automation together over your company's data.",
    },
    {
      id: "d2-14",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "A developer wants an open-source SDK to build an AI agent in a few lines of code, where the model decides which tools to call. Which option fits?",
      options: ["Strands Agents", "AWS Glue", "Amazon Inspector", "Amazon Translate"],
      answer: [0],
      explanation:
        "Strands Agents is an open-source SDK where the model drives the agent. You give it a model, a prompt and some tools, and the model plans which tools to use.",
    },
    {
      id: "d2-15",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "Which SageMaker feature offers a hub of pre-trained models and solution templates you can deploy or fine-tune in a few clicks?",
      options: ["SageMaker JumpStart", "SageMaker Clarify", "SageMaker Model Monitor", "SageMaker Debugger"],
      answer: [0],
      explanation: "SageMaker JumpStart is a model hub with open and commercial foundation models and ready-made ML solutions. You deploy them into your own account.",
    },
    {
      id: "d2-16",
      domain: "d2",
      lesson: "d2-lifecycle",
      prompt: "What's the main advantage of starting from a pre-trained foundation model instead of training one from scratch?",
      options: [
        "Lower cost and faster time to value",
        "It never hallucinates",
        "It requires no data governance",
        "It always outperforms custom models",
      ],
      answer: [0],
      explanation: "Training from scratch needs enormous amounts of data and computing power. A foundation model already knows a lot, so adapting it is far cheaper and quicker.",
    },
    {
      id: "d2-17",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "Which AWS chips are built specifically for low-cost, high-performance deep learning inference?",
      options: [
        "AWS Inferentia",
        "AWS Graviton4",
        "AWS Trainium",
        "AWS Nitro",
      ],
      answer: [0],
      explanation: "AWS Inferentia speeds up inference, as the name hints. AWS Trainium is for training. Graviton is a general-purpose Arm processor.",
    },
    {
      id: "d2-18",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "Which business metric would best show the value of a GenAI customer support assistant?",
      options: [
        "Lower average handle time and higher customer satisfaction",
        "More GPUs in use and a larger model size in parameters",
        "A lower training loss and a higher BLEU score on test data",
        "More tokens generated per reply and a longer context window",
      ],
      answer: [0],
      explanation:
        "Business value shows up in things like conversion rate, time saved, revenue per user, cost savings and customer lifetime value. Internal technical numbers don't prove value on their own.",
    },
    {
      id: "d2-19",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "What is the Model Context Protocol (MCP)?",
      options: [
        "An open standard for connecting AI agents to tools and data",
        "An AWS encryption method for protecting prompts while in transit",
        "A metric that scores how well a model translates text",
        "A hardware interface for linking GPUs inside a server",
      ],
      answer: [0],
      explanation:
        "MCP works like a universal plug. It gives agents one standard way to find and call tools, APIs and data, so you don't write custom code for every connection.",
    },
    {
      id: "d2-20",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "What is context engineering in an FM application?",
      options: [
        "Choosing what goes in the context: instructions, data, memory, tool results",
        "Changing the model's weights by training it on new labeled examples each week",
        "Buying more GPUs so the model can process longer prompts faster",
        "Encrypting the prompt so that other users can't read the context",
      ],
      answer: [0],
      explanation:
        "Context engineering goes beyond writing one prompt. You choose everything the model sees, including system instructions, history, retrieved documents, memory and tool outputs, while staying inside the token limit.",
    },
    {
      id: "d2-21",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "A company wants several specialist agents for research, writing and review, coordinated by a supervisor agent. What is this pattern called?",
      options: [
        "A multi-agent system",
        "A batch transform job",
        "A transfer learning setup",
        "A mixture-of-experts model",
      ],
      answer: [0],
      explanation:
        "A multi-agent system splits a big job among specialist agents. Common patterns are a supervisor with workers, agents handing work along in sequence, and agents working side by side.",
    },
    {
      id: "d2-22",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "A team has built an agent and now needs a secure, serverless place to run it at scale, with memory, identity and tool access built in. Which AWS service fits?",
      options: [
        "Amazon Bedrock AgentCore",
        "Amazon SageMaker AI endpoints",
        "AWS Step Functions",
        "Amazon Lex",
      ],
      answer: [0],
      explanation:
        "Amazon Bedrock AgentCore gives you the pieces to run agents in production: Runtime, Memory, Gateway (which turns APIs into tools), Identity, Policy and observability. It works with any agent framework, Strands Agents included.",
    },
    {
      id: "d2-23",
      domain: "d2",
      lesson: "d2-models",
      prompt: "Which is Amazon's own family of foundation models in Amazon Bedrock?",
      options: ["Amazon Nova", "Amazon Neptune", "Amazon Inspector", "Amazon Macie"],
      answer: [0],
      explanation:
        "Amazon Nova includes models that understand text and images, creative models that make images and video, and speech models. Neptune, by contrast, is a graph database.",
    },
    {
      id: "d2-24",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "A company wants AI agents to help modernise old applications, such as moving .NET or mainframe code. Which AWS service is built for this?",
      options: ["AWS Transform", "Amazon Translate", "Amazon Lex", "AWS Glue DataBrew"],
      answer: [0],
      explanation: "AWS Transform uses agentic AI to speed up migration and modernisation projects. Don't mix it up with Amazon Translate, which translates between human languages.",
    },
    {
      id: "d2-25",
      domain: "d2",
      lesson: "d2-lifecycle",
      type: "order",
      prompt: "Put the stages of the foundation model lifecycle in order.",
      items: ["Select data", "Pre-train the model", "Fine-tune for a task", "Evaluate", "Deploy and collect feedback"],
      explanation: "First you choose the data, then pre-train, fine-tune, evaluate and deploy. What users tell you feeds into the next round of improvements.",
    },
    {
      id: "d2-26",
      domain: "d2",
      lesson: "d2-tokens",
      prompt: "A chatbot sends very long prompts and gets long answers. With on-demand token pricing, what happens to cost?",
      options: [
        "Cost rises with both input and output tokens",
        "Cost is fixed per request no matter the length",
        "Only output tokens are billed, so long prompts are free",
        "Longer prompts reduce cost",
      ],
      answer: [0],
      explanation: "On-demand pricing charges for every input token and every output token. Shorter prompts, a cap on answer length and prompt caching all cut both cost and wait time.",
    },
    {
      id: "d2-27",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "Why might a team choose Amazon Bedrock over training its own model? (Choose two.)",
      options: [
        "Faster time to market",
        "No infrastructure to manage",
        "It guarantees zero hallucinations",
        "It removes the need for any security controls",
        "It always costs nothing",
      ],
      answer: [0, 1],
      explanation: "Managed GenAI services make it easy to start: no servers, pay as you go, quick experiments. You're still responsible for securing your data, and hallucinations can still happen.",
    },
    // ── Practice set 2 ──
    {
      id: "d2-28",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "An online store wants product descriptions written automatically from a list of product details. Which approach fits?",
      options: [
        "Text generation with a large language model",
        "K-means clustering of the product details list",
        "Linear regression on past product prices",
        "Classification of products into categories",
      ],
      answer: [0],
      explanation: "Turning a list of facts into smooth, readable text is exactly what large language models are good at.",
    },
    {
      id: "d2-29",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "Which task is LEAST suited to generative AI?",
      options: [
        "Calculating exact tax owed using fixed legal formulas",
        "Drafting several different versions of marketing email copy",
        "Summarising long meeting notes into action items",
        "Brainstorming new names for an upcoming product",
      ],
      answer: [0],
      explanation: "When you need one precise answer every time, a formula or rules engine is more reliable and cheaper than a generative model.",
    },
    {
      id: "d2-30",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "Users notice the same prompt gives slightly different answers each time. Why?",
      options: [
        "Sampling during generation makes outputs nondeterministic",
        "The model is retrained on the prompt after every request",
        "The prompt is encrypted with a different key each time",
        "A different foundation model answers each request at random",
      ],
      answer: [0],
      explanation: "An LLM picks each next token by sampling from a list of likely options, so results can vary. Lowering the temperature makes answers more consistent.",
    },
    {
      id: "d2-31",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "Why is it hard to explain exactly why an LLM gave a particular answer?",
      options: [
        "Its behaviour comes from billions of learned parameters",
        "It follows a short list of hand-written rules it hides",
        "It doesn't use any training data, so there is nothing to trace",
        "Its answers are fully random, so no reason exists at all",
      ],
      answer: [0],
      explanation: "An LLM's behaviour is spread across billions of learned numbers, so there's no simple reason to point at. That matters in regulated work, where decisions must be explained.",
    },
    {
      id: "d2-32",
      domain: "d2",
      lesson: "d2-embeddings",
      prompt: "In generative AI, what is a vector?",
      options: [
        "An ordered list of numbers that represents data",
        "A type of key used to encrypt the model's weights",
        "A single word or token taken from a prompt",
        "A billing unit used to price model training",
      ],
      answer: [0],
      explanation: "An embedding is a vector, an ordered list of numbers. Things with similar meanings end up with vectors close together, which is how search by meaning works.",
    },
    {
      id: "d2-33",
      domain: "d2",
      lesson: "d2-lifecycle",
      prompt: "A model doesn't know about a product your company launched last month. What's the most likely reason?",
      options: [
        "Its training data ends at a knowledge cutoff; use RAG for new facts",
        "The temperature is set too low, so it won't mention any newer products",
        "The model is multimodal, so it ignores text about new launches",
        "The context window is too large, so new facts get pushed out",
      ],
      answer: [0],
      explanation: "A foundation model only knows what was in its training data, which stops at a cutoff date. RAG hands it current documents when the question comes in, with no retraining.",
    },
    {
      id: "d2-34",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "A company has steady, high-volume traffic to a Bedrock model and needs guaranteed capacity. Which option fits?",
      options: ["Provisioned Throughput", "On-demand calls with a higher temperature", "Amazon Polly", "A larger context window"],
      answer: [0],
      explanation: "Provisioned Throughput reserves model capacity for a set term. On-demand pricing is the better fit when traffic is low or changes a lot.",
    },
    {
      id: "d2-35",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "A team must summarise a million documents overnight and doesn't need answers in real time. What's the most cost-effective option in Bedrock?",
      options: ["Batch inference", "One real-time request per document during business hours", "Raise the temperature", "Fine-tune a new model first"],
      answer: [0],
      explanation: "Bedrock batch inference works through big jobs in the background, at a lower price than on-demand real-time calls.",
    },
    {
      id: "d2-36",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "Which metric best shows that a GenAI shopping assistant increased sales?",
      options: ["Conversion rate", "Number of tokens per response", "Embedding dimension", "Model temperature"],
      answer: [0],
      explanation: "Conversion rate, the share of visitors who buy, is a business metric tied to revenue. Token counts and settings are technical details.",
    },
    {
      id: "d2-37",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "An internal GenAI tool cut report writing from 4 hours to 1 hour. What kind of business value is this?",
      options: [
        "Efficiency (productivity gain)",
        "Higher model accuracy",
        "Better data residency",
        "Lower latency on the network",
      ],
      answer: [0],
      explanation: "Saving people's time is an efficiency gain. It's one of the business metrics companies use to justify spending on GenAI.",
    },
    {
      id: "d2-38",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "A team wants to deploy an open-source foundation model into its own account, choosing the instance type and managing the endpoint. Which option fits?",
      options: [
        "Amazon SageMaker JumpStart",
        "Amazon Bedrock on-demand models",
        "Amazon Bedrock Agents",
        "Amazon Q Business",
      ],
      answer: [0],
      explanation: "JumpStart deploys pre-trained models to SageMaker AI endpoints that you control. Bedrock is serverless, so AWS looks after the hosting for you.",
    },
    {
      id: "d2-39",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "Which AWS chips are built specifically for cost-effective training of deep learning models?",
      options: ["AWS Trainium", "AWS Inferentia", "AWS Nitro", "AWS Snowball"],
      answer: [0],
      explanation: "The names give it away. Trainium is for training, and Inferentia is for inference.",
    },
    {
      id: "d2-40",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "An AI agent must remember a customer's preferences across separate conversations, days apart. What does it need?",
      options: [
        "Long-term memory, such as AgentCore Memory",
        "A larger context window for each new session",
        "A higher temperature so it recalls more",
        "Batch inference over past conversations",
      ],
      answer: [0],
      explanation: "Short-term memory only lasts for one conversation. Long-term memory keeps facts and preferences from one conversation to the next.",
    },
    {
      id: "d2-41",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "How does an AI agent check live stock levels before answering a customer?",
      options: [
        "It calls a tool or API, for example through MCP, and uses the result",
        "It works out the stock level from what it saw in its training data last year",
        "It raises its temperature so it can guess a more likely number",
        "It retrains itself on the latest stock data before it answers",
      ],
      answer: [0],
      explanation: "Tools let an agent fetch live data and take actions. MCP gives agents a standard way to connect to those tools.",
    },
    {
      id: "d2-42",
      domain: "d2",
      lesson: "d2-agents",
      type: "order",
      prompt: "Put the steps an AI agent takes to handle a request in order.",
      items: ["Receive the user's goal", "Plan the steps", "Call tools or APIs", "Observe the results", "Respond or continue to the next step"],
      explanation: "An agent works in a loop. It plans, acts with tools, looks at what happened, and then either finishes or plans the next step.",
    },
    {
      id: "d2-43",
      domain: "d2",
      lesson: "d2-models",
      type: "match",
      prompt: "Match each model type to an example of what it produces.",
      pairs: [
        ["Diffusion model", "A product photo generated from a description"],
        ["Large language model", "A summary of a 20-page report"],
        ["Embedding model", "A vector used for semantic search"],
        ["Multimodal model", "A caption describing an uploaded photo"],
      ],
      explanation: "Diffusion models make images. LLMs write text. Embedding models turn things into vectors. Multimodal models handle more than one kind of input at once.",
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
      explanation: "AWS's GenAI tools run from ready-made apps (Quick, Kiro), through model APIs (Bedrock), to a full ML platform (SageMaker AI).",
    },
    {
      id: "d2-45",
      domain: "d2",
      lesson: "d2-proscons",
      prompt: "Which of these are advantages of generative AI? (Choose two.)",
      options: [
        "One model can adapt to many different tasks",
        "Natural, conversational interaction",
        "Guaranteed factual accuracy",
        "Fully deterministic output",
        "No need to evaluate outputs",
      ],
      answer: [0, 1],
      explanation: "Being adaptable and easy to talk to are real strengths. Accuracy isn't guaranteed, answers vary, and you always need to evaluate the output.",
    },
    // ── Practice set 3 ──
    {
      id: "d2-46",
      domain: "d2",
      lesson: "d2-cloud-basics",
      prompt: "A company keeps sensitive systems in its own data center but runs new AI workloads on AWS. Which cloud deployment model is this?",
      options: ["Hybrid cloud", "Public cloud only", "Private cloud only", "Software as a Service"],
      answer: [0],
      explanation: "Hybrid cloud mixes your own on-premises machines with public cloud services.",
    },
    {
      id: "d2-47",
      domain: "d2",
      lesson: "d2-cloud-basics",
      prompt: "Which factors should guide the choice of AWS Region for a new AI application? (Choose two.)",
      options: ["Data residency and compliance requirements", "Proximity to users for lower latency", "The color of the AWS console", "The number of IAM users in the account", "Whether the team prefers Python"],
      answer: [0, 1],
      explanation: "You choose a Region by the rules your data must follow, how close it is to your users, which services it offers, and price.",
    },
    {
      id: "d2-48",
      domain: "d2",
      lesson: "d2-cloud-basics",
      prompt: "Renting virtual servers, storage and networking that you set up yourself, such as Amazon EC2, is which cloud type?",
      options: [
        "Infrastructure as a Service (IaaS)",
        "Software as a Service (SaaS)",
        "Platform as a Service (PaaS)",
        "On-premises data center hosting",
      ],
      answer: [0],
      explanation: "IaaS gives you the most freedom. The provider runs the hardware and you manage the operating system and apps on top.",
    },
    {
      id: "d2-49",
      domain: "d2",
      lesson: "d2-cloud-basics",
      prompt: "A new GenAI feature isn't available in the AWS Region a company uses. What's the most likely reason?",
      options: [
        "New services and features reach Regions at different times",
        "Each Availability Zone chooses which services it will offer",
        "Every Region gets each feature on the same day by design",
        "Edge locations host new features before any Region does",
      ],
      answer: [0],
      explanation: "Each Region gets new services on its own timeline. Check which services a Region offers before you decide where to deploy.",
    },
    {
      id: "d2-50",
      domain: "d2",
      lesson: "d2-cloud-basics",
      prompt: "Which of these is an advantage of cloud computing?",
      options: [
        "Trade up-front capital expense for pay-as-you-go spending",
        "You buy hardware up front so that you can always cover peak demand",
        "You plan capacity years ahead to avoid running short",
        "Every Region charges the same price for every service",
      ],
      answer: [0],
      explanation: "Instead of buying hardware up front, you pay as you go. Other advantages are economies of scale, no guessing about capacity, speed, and going global in minutes.",
    },
    {
      id: "d2-51",
      domain: "d2",
      lesson: "d2-cloud-basics",
      prompt: "Training archives must be kept for 7 years and are almost never read. Which Amazon S3 storage class is most cost-effective?",
      options: ["S3 Glacier Deep Archive", "S3 Standard", "S3 Standard-Infrequent Access", "S3 Intelligent-Tiering"],
      answer: [0],
      explanation: "Glacier Deep Archive is the cheapest class for long-term data you rarely touch, and getting files back takes hours. Intelligent-Tiering is for when you don't know how often data will be used.",
    },
    {
      id: "d2-52",
      domain: "d2",
      lesson: "d2-cloud-basics",
      prompt: "Which AWS service runs code without you managing servers, charges only for requests and run time, and often sits behind Bedrock Agents action groups?",
      options: ["AWS Lambda", "Amazon EC2", "Amazon S3 Glacier", "AWS Artifact"],
      answer: [0],
      explanation: "Lambda runs your code when something triggers it, with no servers to manage. Agents can call Lambda functions to carry out actions.",
    },
    {
      id: "d2-53",
      domain: "d2",
      lesson: "d2-bedrock-costs",
      prompt: "A team wants to cut the cost of a Bedrock workload that runs overnight and doesn't need instant answers. What helps most?",
      options: ["Use Bedrock batch inference", "Lower the temperature", "Raise Top K", "Buy Provisioned Throughput for six months"],
      answer: [0],
      explanation: "Batch inference can be up to about 50% cheaper. Sampling settings don't change the price, and Provisioned Throughput reserves capacity rather than saving money.",
    },
    {
      id: "d2-54",
      domain: "d2",
      lesson: "d2-bedrock-costs",
      prompt: "How are embedding models billed in Amazon Bedrock on demand?",
      options: [
        "Per input token processed",
        "Per output token generated",
        "Per hour of GPU time used",
        "A flat fee for each model",
      ],
      answer: [0],
      explanation: "Text models bill for input and output tokens. Embedding models only bill for input tokens, because they return numbers, not text. Image models bill per image.",
    },
    {
      id: "d2-55",
      domain: "d2",
      lesson: "d2-bedrock-costs",
      prompt: "Which change does NOT reduce the cost of a Bedrock text application?",
      options: ["Lowering the temperature", "Sending shorter prompts", "Capping the response length", "Switching to a smaller model that meets quality needs"],
      answer: [0],
      explanation: "Temperature, Top P and Top K change the style of the answer, not the price. Token counts and model size are what drive cost.",
    },
    {
      id: "d2-56",
      domain: "d2",
      lesson: "d2-bedrock-costs",
      prompt: "Which factors affect how quickly a model responds? (Choose two.)",
      options: ["The size of the model", "The number of input and output tokens", "The temperature setting", "The Top P setting", "The name of the S3 bucket"],
      answer: [0, 1],
      explanation: "Response time depends on the model's size and type, and on how long the input and output are. Temperature, Top P and Top K don't change it.",
    },
    {
      id: "d2-57",
      domain: "d2",
      lesson: "d2-bedrock-costs",
      prompt: "An operations team wants an alarm when Bedrock Guardrails start blocking lots of responses. What should they use?",
      options: [
        "CloudWatch metrics from Bedrock with a CloudWatch alarm",
        "AWS CloudTrail management events with an S3 lifecycle rule",
        "AWS Config rules that run each time a guardrail changes",
        "AWS Trusted Advisor checks reviewed once a week",
      ],
      answer: [0],
      explanation: "Bedrock sends metrics to CloudWatch, including a count of blocked content, and you can set an alarm on them. Invocation logging adds the full detail of each request and response.",
    },
    {
      id: "d2-58",
      domain: "d2",
      lesson: "d2-stack",
      prompt: "Employees want Amazon Quick to answer only from documents they're allowed to see. What makes this work?",
      options: [
        "Users sign in through IAM Identity Center and answers respect their access",
        "All users share one admin login so that the assistant can see every file",
        "The assistant answers from public internet data instead of company files",
        "The temperature is set to 0 so it never mentions restricted documents",
      ],
      answer: [0],
      explanation: "Quick signs each user in, often through IAM Identity Center connected to your company's login system. It then answers only from content that person is allowed to see.",
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
      explanation: "Quick also has Quick Automate for multi-step agent workflows with approvals, and Spaces where teams share their work.",
    },
    {
      id: "d2-60",
      domain: "d2",
      lesson: "d2-models",
      prompt: "A company wants natural, real-time spoken conversations with customers using an Amazon model. Which Nova 2 model fits?",
      options: [
        "Nova 2 Sonic (speech-to-speech)",
        "Nova 2 Multimodal Embeddings",
        "Nova 2 Lite (text and images)",
        "Amazon Transcribe with Amazon Polly",
      ],
      answer: [0],
      explanation: "Nova 2 Sonic handles live voice conversations. Nova 2 Lite is a fast, low-cost reasoning model, Multimodal Embeddings powers search by meaning, and Omni mixes multimodal reasoning with image generation.",
    },
    {
      id: "d2-61",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "How does a Bedrock agent know which company APIs it can call to look up orders?",
      options: [
        "You define action groups with an OpenAPI schema, often backed by Lambda",
        "The agent searches the internet for public APIs that look like a good match",
        "The model's system prompt lists every API URL and the agent guesses",
        "AWS Artifact registers the APIs and grants the agent access to them",
      ],
      answer: [0],
      explanation: "Action groups tell the agent which operations exist and how to call them. Knowledge bases are the other half: they supply documents for RAG.",
    },
  ],

  cards: [
    { id: "s-bedrock", domain: "d2", kind: "service", term: "Amazon Bedrock", definition: "Serverless access to foundation models from many providers through one API" },
    { id: "s-jumpstart", domain: "d2", kind: "service", term: "SageMaker JumpStart", definition: "A hub of pre-trained models and solutions to deploy or fine-tune" },
    { id: "s-kiro", domain: "d2", kind: "service", term: "Kiro", definition: "An agentic IDE that turns requirements into specs, tasks and code" },
    { id: "s-quick", domain: "d2", kind: "service", term: "Amazon Quick", definition: "An AI workspace for research, BI and automation over company data" },
    { id: "s-strands", domain: "d2", kind: "service", term: "Strands Agents", definition: "An open-source SDK where the model drives the agent" },
    { id: "s-agentcore", domain: "d2", kind: "service", term: "Bedrock AgentCore", definition: "Runs agents in production: runtime, memory, gateway, identity and policy" },
    { id: "s-nova", domain: "d2", kind: "service", term: "Amazon Nova", definition: "Amazon's own family of foundation models in Bedrock" },
    { id: "s-transform", domain: "d2", kind: "service", term: "AWS Transform", definition: "Agentic AI that helps migrate and modernise old apps" },
    { id: "c-pt", domain: "d2", kind: "concept", term: "Provisioned Throughput", definition: "Reserved model capacity. Custom models in Bedrock need it" },
    { id: "c-token", domain: "d2", kind: "concept", term: "Token", definition: "A chunk of text, roughly a short word, that the model reads and writes" },
    { id: "c-embedding", domain: "d2", kind: "concept", term: "Embedding", definition: "A list of numbers that captures meaning, used to find similar things" },
    { id: "c-hallucination", domain: "d2", kind: "concept", term: "Hallucination", definition: "An answer that sounds sure of itself but is false or made up" },
    { id: "c-transformer", domain: "d2", kind: "concept", term: "Transformer", definition: "The self-attention design behind modern LLMs" },
    { id: "c-diffusion", domain: "d2", kind: "concept", term: "Diffusion model", definition: "Makes images by removing noise, one step at a time" },
    { id: "c-mcp", domain: "d2", kind: "concept", term: "MCP", definition: "An open standard that plugs agents into tools and data" },
    { id: "c-context", domain: "d2", kind: "concept", term: "Context engineering", definition: "Choosing everything the model sees: instructions, data, memory and tool results" },
    { id: "c-region", domain: "d2", kind: "concept", term: "AWS Region", definition: "A part of the world with AWS data centers. Choose by compliance, distance to users, services and price" },
    { id: "c-az", domain: "d2", kind: "concept", term: "Availability Zone", definition: "One or more separate data centers inside a Region" },
    { id: "c-iaas", domain: "d2", kind: "concept", term: "IaaS, PaaS, SaaS", definition: "Building blocks, a platform for your code, or a finished app" },
    { id: "c-hybrid", domain: "d2", kind: "concept", term: "Hybrid cloud", definition: "Your own on-premises systems used together with public cloud" },
    { id: "s-lambda", domain: "d2", kind: "service", term: "AWS Lambda", definition: "Runs code without servers, billed per request and run time" },
    { id: "c-batchbedrock", domain: "d2", kind: "concept", term: "Bedrock batch inference", definition: "Many requests at once, results in S3, up to about 50% cheaper" },
    { id: "c-latency", domain: "d2", kind: "concept", term: "What slows a model down", definition: "Model size and type, and token counts. Temperature makes no difference" },
    { id: "c-nova2", domain: "d2", kind: "concept", term: "Amazon Nova 2", definition: "Lite for reasoning, Sonic for voice, Multimodal Embeddings for search, Omni for both reasoning and images" },
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
      takeaway: "Tokens aren't the same as words. Cost and context limits are counted in tokens, so how you word things changes the price.",
      render: (onSolved) => <TokenDemo goal="exact12" onSolved={onSolved} />,
    },
    {
      id: "ch-search-by-meaning",
      domain: "d2",
      lesson: "d2-embeddings",
      title: "Search by meaning",
      goal: "Find the refund documents with a question that never uses the word \"refund\".",
      hint: "Embeddings match meaning, not exact words.",
      takeaway: "Search by meaning compares vectors, so \"money back\" finds \"refund\". That's how RAG finds the right documents.",
      render: (onSolved) => <EmbeddingLab goal="refunds" onSolved={onSolved} />,
    },
  ],
});
