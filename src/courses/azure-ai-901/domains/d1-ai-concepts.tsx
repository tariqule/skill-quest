import { Flow, ServiceRows, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { RaiMatcherLab, ToolSorterLab } from "../labs";
import { CvTasks, DeploymentChooser, TokenEmbeddings } from "../visuals";

/**
 * Domain 1: Identify AI concepts and capabilities (40–45%).
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "Identify AI concepts and capabilities",
    world: "The Concept Compass",
    // Official range is 40–45%; 42 keeps the two domains at 100.
    weight: 42,
    emoji: "🧭",
    color: "#a78bfa",
    summary: "Responsible AI principles, how generative models work, choosing and deploying models, and the common AI workloads.",
  },

  tasks: [
    {
      id: "1.1",
      title: "Describe principles of responsible AI",
      covers: [
        "Fairness considerations in an AI solution",
        "Reliability and safety considerations",
        "Privacy and security considerations",
        "Inclusiveness considerations",
        "Transparency considerations",
        "Accountability considerations",
      ],
    },
    {
      id: "1.2",
      title: "Identify AI model components and configurations",
      covers: [
        "How generative AI models work",
        "Choosing an appropriate AI model based on its capabilities",
        "Model deployment options and configuration parameters",
      ],
    },
    {
      id: "1.3",
      title: "Identify AI workloads",
      covers: [
        "Scenarios for generative and agentic AI, text analysis, speech, computer vision, and information extraction",
        "Text analysis techniques: keyword extraction, entity detection, sentiment analysis, summarization",
        "Features and capabilities of speech recognition and speech synthesis",
        "Features and capabilities of computer vision and image-generation models",
        "Techniques to extract information from text, images, audio, and video",
      ],
    },
  ],

  lessons: [
    {
      id: "d1-rai",
      check: ["d1-01", "d1-07"],
      task: "1.1",
      title: "The six principles of responsible AI",
      visual: (
        <div className="grid gap-6">
          <Tiles
            cols={3}
            tiles={[
              { icon: "⚖️", title: "Fairness", text: "Minimize bias in the data and test that outputs don't discriminate.", color: "#a78bfa" },
              { icon: "🛡️", title: "Reliability and safety", text: "AI is probabilistic, not infallible. Plan for errors and mitigate risk.", color: "#a78bfa" },
              { icon: "🔒", title: "Privacy and security", text: "Protect training data; stop models revealing personal details.", color: "#a78bfa" },
              { icon: "🌈", title: "Inclusiveness", text: "Don't exclude any group of users from the benefits.", color: "#a78bfa" },
              { icon: "🔍", title: "Transparency", text: "Tell users how the system works and what its limits are.", color: "#a78bfa" },
              { icon: "📋", title: "Accountability", text: "People and organizations answer for their AI, through governance.", color: "#a78bfa" },
            ]}
          />
          <RaiMatcherLab />
        </div>
      ),
      points: [
        "Responsible AI runs from conception through design, implementation, and operation, not just at launch.",
        "Content filters reduce harmful output, but filters alone don't make a solution responsible.",
        "Practical moves: confidence thresholds before acting, deleting personal data you no longer need, captions for speech apps, disclosing AI use.",
      ],
      tip: "Exam scenarios describe a practice and ask which principle it supports. Match the verb: test for bias → fairness, disclose → transparency, govern → accountability.",
    },
    {
      id: "d1-genai",
      check: ["d1-11", "d1-13"],
      task: "1.2",
      title: "How generative AI models work",
      visual: (
        <div className="grid gap-5">
          <TokenEmbeddings />
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "✂️", label: "Tokens", sub: "Text split into words, sub-words, punctuation, each with an ID" },
              { icon: "🧮", label: "Encoder + attention", sub: "Learns embeddings: vectors that capture meaning in context" },
              { icon: "🔮", label: "Decoder", sub: "Predicts the most probable next token" },
              { icon: "🔁", label: "Repeat", sub: "Append the token and predict again until the completion ends" },
            ]}
          />
        </div>
      ),
      points: [
        "Large language models (LLMs) generate completions from prompts by predicting the next token, again and again.",
        "Attention weighs how much each nearby token influences the current one; multi-head attention does this in parallel.",
        "LLMs generalize well but cost more to train and run. Small language models (SLMs) suit focused topics and on-device apps.",
        "An agent = a language model + instructions (system prompt) + tools for knowledge and actions.",
      ],
      tip: "Because generation samples probabilities, the same prompt can return different wording. That's normal, not a bug.",
    },
    {
      id: "d1-choose",
      check: ["d1-20", "d1-24"],
      task: "1.2",
      title: "Choose the right model",
      visual: (
        <div className="grid gap-4">
          <ServiceRows
            rows={[
              { input: "Chat, Q&A, support", service: "Chat models: GPT-4.1, GPT-5.x, Claude, Mistral, Phi-4", output: "Conversational answers" },
              { input: "Long reports to condense", service: "Reasoning models with long context", output: "Summaries" },
              { input: "Text to search by meaning", service: "Embedding models (text-embedding-3-small)", output: "Vectors" },
              { input: "Images, audio, or video plus text", service: "Multimodal models (Phi-4-multimodal-instruct, GPT-4.1)", output: "Answers about the media" },
              { input: "Well-defined task, structured output", service: "A Foundry Tool (prebuilt model)", output: "Predictable results" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "📚", title: "Model catalog", text: "Thousands of models: sold directly by Azure, plus partner and community models. Filter by task and capability.", color: "#38bdf8" },
              { icon: "🏆", title: "Leaderboards and benchmarks", text: "Rank and compare models on quality, safety, cost, and throughput. Try with your own data.", color: "#38bdf8" },
              { icon: "🧪", title: "Evaluators", text: "Score quality (groundedness, relevance, coherence, fluency) and scan for safety risks. They detect; they don't fix.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Models sold directly by Azure are hosted by Microsoft under Microsoft Product Terms, with enterprise SLAs.",
        "Each catalog entry shows capabilities, benchmarks, supported tasks, and responsible AI documentation such as model cards.",
        "Classic NLP metrics: accuracy, precision, recall, F1. AI-assisted metrics: groundedness, relevance, coherence, fluency, GPT similarity.",
      ],
      tip: "If the task is narrow and you need the same structured answer every time, a Foundry Tool usually beats a general-purpose model.",
    },
    {
      id: "d1-deploy",
      check: ["d1-28", "d1-33"],
      task: "1.2",
      title: "Deployment options and parameters",
      visual: (
        <div className="grid gap-5">
          <DeploymentChooser />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🌡️", title: "Temperature", text: "Low = focused and repeatable. High = creative and varied.", color: "#f97316" },
              { icon: "✂️", title: "Max output tokens", text: "Caps the reply length and the tokens it consumes.", color: "#f97316" },
              { icon: "📜", title: "System instructions", text: "Set the model's role, tone, and rules.", color: "#f97316" },
              { icon: "🚦", title: "Tokens per minute", text: "The deployment's rate limit. Go over it and requests are throttled.", color: "#f97316" },
            ]}
          />
        </div>
      ),
      points: [
        "Deploying a model gives you a stable, secure endpoint, allocates compute, and turns on monitoring.",
        "Deployment settings: deployment type, model version, and a tokens-per-minute (TPM) allocation.",
        "Categories: standard (pay per token), provisioned (reserved PTUs), and batch (50% cheaper, 24-hour target).",
        "Throttled? Lower max output tokens or send fewer concurrent requests.",
      ],
      tip: "No data-residency rule and normal traffic? Start with Global Standard.",
    },
    {
      id: "d1-workloads",
      check: ["d1-37", "d1-41"],
      task: "1.3",
      title: "Spot the AI workload",
      visual: (
        <div className="grid gap-6">
          <Tiles
            cols={3}
            tiles={[
              { icon: "💬", title: "Generative AI", text: "Create new content: chat answers, drafts, summaries, translations, code, images.", color: "#a78bfa" },
              { icon: "🤖", title: "Agentic AI", text: "Reason and act: use tools to automate tasks like booking or emailing.", color: "#a78bfa" },
              { icon: "📝", title: "Text analysis", text: "Key phrases, entities, sentiment, language, PII, summaries.", color: "#38bdf8" },
              { icon: "🎙️", title: "Speech", text: "Speech to text (recognition) and text to speech (synthesis).", color: "#f472b6" },
              { icon: "👁️", title: "Computer vision", text: "Classify, detect, and describe images; generate images and video.", color: "#fb923c" },
              { icon: "🧾", title: "Information extraction", text: "Turn documents, images, audio, and video into structured fields.", color: "#34d399" },
            ]}
          />
          <ToolSorterLab />
        </div>
      ),
      points: [
        "Information extraction examples: expense receipts, recorded support calls, visitor counts from video.",
        "Agents differ from plain chat: they decide on actions and call tools.",
        "One solution often combines workloads, for example speech to text feeding an agent.",
      ],
    },
    {
      id: "d1-text",
      check: ["d1-44", "d1-49"],
      task: "1.3",
      title: "Text analysis techniques",
      visual: (
        <ServiceRows
          rows={[
            { input: "\"Fantastic risotto at the Seattle diner\"", service: "Key phrase extraction", output: "risotto · Seattle · diner" },
            { input: "\"Priya flew to Lisbon on 2 May\"", service: "Named entity recognition", output: "Person · Location · DateTime" },
            { input: "\"Seattle\" in a review", service: "Entity linking", output: "Known entity + Wikipedia link" },
            { input: "A customer review", service: "Sentiment analysis and opinion mining", output: "Positive / negative / neutral" },
            { input: "A 20-page report", service: "Summarization", output: "The most important points" },
            { input: "\"¡Hola! Me llamo Josefina\"", service: "Language detection", output: "Spanish · es · 1.00" },
            { input: "\"Call Maria on 020 7946 0958\"", service: "PII detection", output: "Person, phone number (redacted)" },
          ]}
        />
      ),
      points: [
        "A general-purpose model can do all of these from a prompt, and the output follows how you phrase the request.",
        "Azure Language in Foundry Tools gives structured, deterministic results: ideal for automated pipelines.",
        "PII detection also covers personal health information (PHI) and can return redacted text.",
      ],
      tip: "\"Same result every time\", \"confidence score\", or \"ISO code\" in the question points to Azure Language.",
    },
    {
      id: "d1-perceive",
      check: ["d1-52", "d1-55"],
      task: "1.3",
      title: "Speech, vision, and extraction techniques",
      visual: (
        <div className="grid gap-5">
          <Flow
            color="#f472b6"
            steps={[
              { icon: "🎤", label: "Audio", sub: "Microphone, file, or stream" },
              { icon: "🔊", label: "Acoustic model", sub: "Audio → phonemes (speech sounds)" },
              { icon: "📖", label: "Language model", sub: "Phonemes → words" },
              { icon: "📝", label: "Text", sub: "Captions, transcripts, dictation" },
            ]}
          />
          <CvTasks />
        </div>
      ),
      points: [
        "Speech synthesis: tokenize the text, assign phonetic sounds, group into prosodic units, then generate audio in a chosen voice.",
        "Neural voices sound more natural because they handle intonation better.",
        "Image generation runs the vision process in reverse: from a text description to a new image.",
        "OCR reads text from images. Schema-based extraction goes further and maps values to named fields.",
      ],
    },
  ],

  questions: [
    // ───── d1-rai ─────
    {
      id: "d1-01",
      domain: "d1",
      lesson: "d1-rai",
      prompt:
        "A bank tests its loan-approval model and finds that applicants from some postcodes are declined more often than applicants with the same income and credit history from other postcodes. Which responsible AI principle is most at risk?",
      options: ["Fairness", "Transparency", "Inclusiveness", "Reliability and safety"],
      answer: [0],
      explanation: "Comparable people getting different outcomes suggests bias in the data or model. Fairness means minimizing bias and testing outputs for discrimination.",
    },
    {
      id: "d1-02",
      domain: "d1",
      lesson: "d1-rai",
      prompt:
        "A robotic arm uses computer vision to pick parts. It only moves when the model's confidence that it has found the right part is above 0.9. Which principle does this design support?",
      options: ["Reliability and safety", "Accountability", "Privacy and security", "Transparency"],
      answer: [0],
      explanation: "AI is probabilistic, so a confidence threshold avoids acting on uncertain predictions and causing harm.",
    },
    {
      id: "d1-03",
      domain: "d1",
      lesson: "d1-rai",
      prompt:
        "A secure-entry system captures face images to grant temporary access. The images are deleted once access is granted, and operators can't view them. Which principle is being applied?",
      options: ["Privacy and security", "Inclusiveness", "Fairness", "Accountability"],
      answer: [0],
      explanation: "Keeping personal data only as long as it's needed and limiting who can see it protects privacy and security.",
    },
    {
      id: "d1-04",
      domain: "d1",
      lesson: "d1-rai",
      prompt: "A voice-based AI agent also displays text captions of everything it says. Which principle does this support most directly?",
      options: ["Inclusiveness", "Transparency", "Reliability and safety", "Fairness"],
      answer: [0],
      explanation: "Captions keep the agent usable for people with a hearing impairment, so no group is excluded.",
    },
    {
      id: "d1-05",
      domain: "d1",
      lesson: "d1-rai",
      prompt:
        "An insurer tells customers that an AI model helps assess claims and describes the kinds of data the model was trained on, without revealing confidential details. Which principle is this?",
      options: ["Transparency", "Accountability", "Privacy and security", "Inclusiveness"],
      answer: [0],
      explanation: "Transparency means users know AI is involved, roughly how it works, and its limitations.",
    },
    {
      id: "d1-06",
      domain: "d1",
      lesson: "d1-rai",
      prompt:
        "Your organization creates a governance framework: named owners for each AI system, sign-off before release, and a process for handling harm reports. Which principle does this address?",
      options: ["Accountability", "Fairness", "Transparency", "Reliability and safety"],
      answer: [0],
      explanation: "The people and organizations that build and ship AI are accountable for it. A governance framework puts that into practice.",
    },
    {
      id: "d1-07",
      domain: "d1",
      lesson: "d1-rai",
      prompt: "A university is building an AI system that ranks admission applications. Which actions support the fairness principle? (Choose two.)",
      options: [
        "Test that the system ranks comparable applicants the same across demographic groups",
        "Review the training data for bias before training",
        "Raise the model temperature so rankings vary more",
        "Hide from applicants that AI is involved",
        "Deploy the model with a Global Batch deployment",
      ],
      answer: [0, 1],
      explanation: "Fairness starts with checking the data for bias and continues with testing outputs across groups. The other options don't address bias.",
    },
    {
      id: "d1-08",
      domain: "d1",
      lesson: "d1-rai",
      prompt: "A public chat assistant must not help users with illegal or harmful activities. Which measures reduce this risk? (Choose two.)",
      options: [
        "Apply content filters to prompts and responses",
        "Test the assistant with adversarial and harmful prompts before release",
        "Increase the max output tokens setting",
        "Remove the system prompt so the model answers freely",
        "Publish all user prompts on a public page",
      ],
      answer: [0, 1],
      explanation: "Content filters block harmful generations, and red-team style testing shows where the system fails before users find out.",
    },
    {
      id: "d1-09",
      domain: "d1",
      lesson: "d1-rai",
      type: "match",
      prompt: "Match each responsible AI principle to the consideration it describes.",
      pairs: [
        ["Fairness", "Minimize bias in training data and test for discriminatory outputs"],
        ["Privacy and security", "Keep training data secure and stop models revealing personal details"],
        ["Transparency", "Make users aware of how the system works and its limitations"],
        ["Accountability", "Apply a governance framework so people answer for the AI's actions"],
        ["Inclusiveness", "Make sure the solution doesn't exclude some users"],
      ],
      explanation: "These five plus reliability and safety make up Microsoft's six responsible AI principles.",
    },
    {
      id: "d1-10",
      domain: "d1",
      lesson: "d1-rai",
      prompt: "Which statement about responsible AI is correct?",
      options: [
        "It should be considered from the solution's conception through design, implementation, and operation",
        "It only needs attention after a model is deployed to production",
        "Turning on content filters is enough to make any solution responsible",
        "It applies to generative AI but not to vision or speech solutions",
      ],
      answer: [0],
      explanation: "Content filters are one tool. Responsible AI is a set of principles applied across the whole life of every kind of AI solution.",
    },

    // ───── d1-genai ─────
    {
      id: "d1-11",
      domain: "d1",
      lesson: "d1-genai",
      prompt: "At its core, what does a large language model do when it receives a prompt?",
      options: [
        "Repeatedly predicts the most probable next token to build a completion",
        "Looks up a stored answer in a database of questions",
        "Runs a set of hand-written if-then rules",
        "Copies the closest matching document from its training data",
      ],
      answer: [0],
      explanation: "LLMs are like very powerful predictive text: they predict a token, add it to the sequence, and predict again.",
    },
    {
      id: "d1-12",
      domain: "d1",
      lesson: "d1-genai",
      prompt: "In a language model's vocabulary, what is a token?",
      options: [
        "A word, part of a word, or punctuation mark with a unique integer ID",
        "A password that authenticates calls to the model",
        "A complete sentence from the training data",
        "A label that marks a training example as correct",
      ],
      answer: [0],
      explanation: "Vocabularies contain hundreds of thousands of tokens, including sub-words such as \"un\" in \"unlikely\". (API keys are a different thing.)",
    },
    {
      id: "d1-13",
      domain: "d1",
      lesson: "d1-genai",
      prompt: "What are embeddings in a transformer-based language model?",
      options: [
        "Vectors that encode a token's meaning, so tokens used in similar contexts point in similar directions",
        "Images embedded in a prompt",
        "The integer IDs assigned to tokens",
        "Hidden system prompts the provider adds to every request",
      ],
      answer: [0],
      explanation: "The encoder transforms initial token vectors into embeddings with semantic meaning, so \"dog\" and \"puppy\" end up close together.",
    },
    {
      id: "d1-14",
      domain: "d1",
      lesson: "d1-genai",
      prompt: "You want to measure how semantically similar two embedding vectors are. Which calculation is commonly used?",
      options: ["Cosine similarity", "Mean absolute error", "Tokens per minute", "F1 score"],
      answer: [0],
      explanation: "Cosine similarity compares the direction of two vectors: the closer to 1, the more similar the meaning.",
    },
    {
      id: "d1-15",
      domain: "d1",
      lesson: "d1-genai",
      prompt: "In the sentence \"I heard a dog bark\", which describes what an attention layer does when it processes the token \"bark\"?",
      options: [
        "Gives more weight to \"heard\" and \"dog\" because they influence the meaning of \"bark\" most",
        "Removes \"I\" and \"a\" from the vocabulary",
        "Translates \"bark\" into another language",
        "Assigns \"bark\" a new random integer ID",
      ],
      answer: [0],
      explanation: "Attention weighs surrounding tokens by their influence and uses those weights to calculate the token's embedding.",
    },
    {
      id: "d1-16",
      domain: "d1",
      lesson: "d1-genai",
      type: "order",
      prompt: "Put these steps in the order a transformer-based language model goes through, from training text to a generated completion.",
      items: [
        "Break the text into tokens and give each a unique ID",
        "Assign each token an initial vector plus a positional encoding",
        "Use attention in the encoder to learn embeddings",
        "Use the decoder to predict the next most probable token after a prompt",
        "Append the predicted token and repeat until the sequence ends",
      ],
      explanation: "Tokenize → vectors with position → attention builds embeddings → decoder predicts → repeat.",
    },
    {
      id: "d1-17",
      domain: "d1",
      lesson: "d1-genai",
      prompt: "Which statements correctly compare large language models (LLMs) and small language models (SLMs)? (Choose two.)",
      options: [
        "LLMs generalize well but can cost more to train and use",
        "SLMs suit focused topic areas and apps or agents that run on devices",
        "SLMs can't understand natural language",
        "LLMs always run offline on mobile phones",
        "SLMs need more training data than LLMs",
      ],
      answer: [0, 1],
      explanation: "The difference is the volume of data and number of variables. Smaller models trade breadth for lower cost and easy local deployment.",
    },
    {
      id: "d1-18",
      domain: "d1",
      lesson: "d1-genai",
      prompt: "What are the three key elements of an AI agent?",
      options: [
        "A language model, instructions, and tools",
        "A database, a web server, and a firewall",
        "Training data, labels, and a loss function",
        "An endpoint, an API key, and a region",
      ],
      answer: [0],
      explanation: "The model is the agent's brain, the instructions are its job description, and tools let it get knowledge and take actions.",
    },
    {
      id: "d1-19",
      domain: "d1",
      lesson: "d1-genai",
      prompt: "A developer sends the same prompt to a deployed chat model twice and gets differently worded answers. What's the most likely reason?",
      options: [
        "Text generation is probabilistic, so the model can sample different tokens each time",
        "The deployment was deleted and recreated between calls",
        "The model is retrained after every request",
        "The endpoint routes each request to a different language",
      ],
      answer: [0],
      explanation: "Models generate text by sampling likely tokens. Lowering temperature makes output more consistent.",
    },

    // ───── d1-choose ─────
    {
      id: "d1-20",
      domain: "d1",
      lesson: "d1-choose",
      prompt:
        "You need one place to discover, compare, and deploy models from Microsoft, OpenAI, partners such as Mistral and Meta, and open-source communities. What should you use?",
      options: ["The Microsoft Foundry model catalog", "Azure Key Vault", "Azure Speech in Foundry Tools", "Azure Content Understanding in Foundry Tools"],
      answer: [0],
      explanation: "The model catalog is Foundry's central hub of models, with filters for source, capability, and inference task.",
    },
    {
      id: "d1-21",
      domain: "d1",
      lesson: "d1-choose",
      prompt: "Before choosing a model, your team wants to rank candidates by quality, safety, and throughput on standard datasets. Which Foundry feature helps most?",
      options: ["Model leaderboards and benchmark results", "Tokens-per-minute quotas", "The Azure Language MCP server", "Batch transcription"],
      answer: [0],
      explanation: "Leaderboards and benchmarks use consistent evaluation criteria. You can then try promising models with your own data.",
    },
    {
      id: "d1-22",
      domain: "d1",
      lesson: "d1-choose",
      prompt: "A search feature must turn product descriptions into vectors so that items can be matched by meaning. Which type of model should you deploy?",
      options: ["An embedding model such as text-embedding-3-small", "An image-generation model", "A video-generation model", "A speech synthesis voice"],
      answer: [0],
      explanation: "Embedding models are built for semantic vector representations.",
    },
    {
      id: "d1-23",
      domain: "d1",
      lesson: "d1-choose",
      prompt: "An insurance app lets customers upload a photo of their damaged car and ask questions about it. Which kind of model fits best?",
      options: ["A multimodal (vision-enabled) model", "An embedding model", "A small text-only model", "A speech-to-text model"],
      answer: [0],
      explanation: "Multimodal models accept images and text together and answer in natural language.",
    },
    {
      id: "d1-24",
      domain: "d1",
      lesson: "d1-choose",
      prompt:
        "An app must detect the language of each support ticket and return the same structured result, with a confidence score, every time. Which choice is most appropriate?",
      options: [
        "A Foundry Tool such as Azure Language in Foundry Tools",
        "A large reasoning model with a high temperature",
        "An image-generation model",
        "A video-generation model",
      ],
      answer: [0],
      explanation: "For well-defined tasks, Foundry Tools use prebuilt models with predictable, structured output.",
    },
    {
      id: "d1-25",
      domain: "d1",
      lesson: "d1-choose",
      prompt: "You're evaluating a chat model in Foundry. Which of these are AI-assisted quality metrics rather than classic NLP metrics? (Choose two.)",
      options: ["Groundedness", "Coherence", "Recall", "F1 score", "Precision"],
      answer: [0, 1],
      explanation: "AI-assisted metrics include groundedness, relevance, coherence, fluency, and GPT similarity. Precision, recall, and F1 are classic NLP metrics.",
    },
    {
      id: "d1-26",
      domain: "d1",
      lesson: "d1-choose",
      prompt: "What do safety evaluators in Microsoft Foundry do?",
      options: [
        "Scan and score outputs for harms such as violence, self-harm, or bias, without fixing them",
        "Automatically rewrite unsafe responses into safe ones",
        "Retrain the model to remove unsafe behaviour",
        "Encrypt prompts before they reach the model",
      ],
      answer: [0],
      explanation: "Evaluators detect, scan, and score issues. Resolving them is up to you, for example with better prompts, filters, or a different model.",
    },
    {
      id: "d1-27",
      domain: "d1",
      lesson: "d1-choose",
      prompt: "In the Foundry model catalog, which group of models is hosted by Microsoft under Microsoft Product Terms with enterprise-grade SLAs?",
      options: ["Models sold directly by Azure", "Models from partners and the community", "Prebuilt Content Understanding analyzers", "Custom neural voices"],
      answer: [0],
      explanation: "Models sold directly by Azure are tightly integrated with Azure, with SLAs and preconfigured security. Partner and community models support broader experimentation.",
    },

    // ───── d1-deploy ─────
    {
      id: "d1-28",
      domain: "d1",
      lesson: "d1-deploy",
      prompt: "You're deploying a new chat model. There's no data-residency requirement and traffic is unpredictable. Which deployment type should you start with?",
      options: ["Global Standard", "Regional Provisioned", "Data Zone Batch", "Developer"],
      answer: [0],
      explanation: "Global Standard is the recommended default: pay per token, newest models first, lowest price, and the highest default quota.",
    },
    {
      id: "d1-29",
      domain: "d1",
      lesson: "d1-deploy",
      prompt: "A company must make sure prompts and responses are only processed inside the EU data zone, and it wants to pay per token. Which deployment type fits?",
      options: ["Data Zone Standard", "Global Standard", "Global Batch", "Global Provisioned"],
      answer: [0],
      explanation: "Data Zone types process data only within the Microsoft-defined data zone (US, EU, or APAC). Standard means pay per token.",
    },
    {
      id: "d1-30",
      domain: "d1",
      lesson: "d1-deploy",
      prompt: "A call-center assistant handles a steady, high volume of requests and needs consistently low latency. Which kind of deployment is most suitable?",
      options: ["A provisioned deployment with reserved provisioned throughput units (PTUs)", "A Developer deployment", "A batch deployment", "No deployment: call the model from the playground"],
      answer: [0],
      explanation: "Provisioned deployments reserve capacity, giving predictable throughput and lower latency variance than standard types.",
    },
    {
      id: "d1-31",
      domain: "d1",
      lesson: "d1-deploy",
      prompt: "You need to summarize two million archived product reviews as cheaply as possible. Results are needed within a day, not in real time. Which deployment type should you use?",
      options: ["Global Batch", "Global Provisioned", "Data Zone Standard", "Standard"],
      answer: [0],
      explanation: "Batch types process large files of requests asynchronously at 50% less than Global Standard, with a 24-hour target turnaround.",
    },
    {
      id: "d1-32",
      domain: "d1",
      lesson: "d1-deploy",
      prompt: "Your app starts receiving rate-limit errors from a model deployment during busy periods. Which changes in your app reduce the throttling? (Choose two.)",
      options: [
        "Lower the max output tokens setting",
        "Send fewer requests at the same time",
        "Raise the temperature",
        "Move the system prompt into the user prompt",
        "Add more long examples to every prompt",
      ],
      answer: [0, 1],
      explanation: "Larger prompts and higher max output tokens consume more of the deployment's tokens-per-minute allowance. Fewer, smaller requests stay under it.",
    },
    {
      id: "d1-33",
      domain: "d1",
      lesson: "d1-deploy",
      prompt: "A help-desk bot gives creative but inconsistent answers to policy questions. You want focused, repeatable answers. Which parameter change helps most?",
      options: ["Lower the temperature", "Raise the temperature", "Increase the tokens-per-minute allocation", "Switch to a video-generation model"],
      answer: [0],
      explanation: "Temperature controls creativity versus determinism. Lower values make the model pick the most likely tokens.",
    },
    {
      id: "d1-34",
      domain: "d1",
      lesson: "d1-deploy",
      type: "match",
      prompt: "Match each setting to what it controls.",
      pairs: [
        ["Temperature", "How creative or deterministic the output is"],
        ["Max output tokens", "How long a response can be, and the tokens it uses"],
        ["System instructions", "The model's role, tone, and rules"],
        ["Tokens per minute (TPM)", "The deployment's rate limit before throttling"],
      ],
      explanation: "Temperature, max output tokens, and system instructions are playground and request settings. TPM is set on the deployment.",
    },
    {
      id: "d1-35",
      domain: "d1",
      lesson: "d1-deploy",
      type: "order",
      prompt: "Put these steps in order to go from choosing a model to using it in your own app.",
      items: [
        "Browse the model catalog and compare benchmarks",
        "Deploy the model, choosing a deployment type, version, and TPM limit",
        "Test prompts and parameters in the playground",
        "Use the same settings from your client application code",
      ],
      explanation: "Pick a model, deploy it, prove it in the playground, then carry the working settings into code.",
    },

    // ───── d1-workloads ─────
    {
      id: "d1-36",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "A museum website lets visitors type questions about the history of computing and get original, conversational answers. Which AI workload is this?",
      options: ["Generative AI", "Information extraction", "Speech synthesis", "Object detection"],
      answer: [0],
      explanation: "Generating new natural-language responses to prompts is generative AI.",
    },
    {
      id: "d1-37",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "An assistant reads incoming requests, decides what to do, and then books meetings and sends confirmation emails by itself. Which workload does this describe best?",
      options: ["Agentic AI", "Sentiment analysis", "Image classification", "Optical character recognition"],
      answer: [0],
      explanation: "Agents reason over input and use action tools, such as calendars and email, to automate tasks.",
    },
    {
      id: "d1-38",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "A retailer wants to know whether thousands of product reviews are positive, negative, or neutral. Which workload is this?",
      options: ["Text analysis", "Computer vision", "Speech recognition", "Image generation"],
      answer: [0],
      explanation: "Sentiment analysis is a text analysis technique.",
    },
    {
      id: "d1-39",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "A hands-free kiosk in a factory listens to spoken questions and answers out loud. Which workload is central to this solution?",
      options: ["Speech", "Information extraction", "Object detection", "Embeddings"],
      answer: [0],
      explanation: "Speech recognition turns the question into text, and speech synthesis speaks the answer.",
    },
    {
      id: "d1-40",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "A grocery store wants a checkout camera that recognizes which fruit or vegetable a customer places on the scale. Which workload is this?",
      options: ["Computer vision", "Text analysis", "Speech synthesis", "Agentic AI"],
      answer: [0],
      explanation: "Identifying produce from camera images is computer vision (image classification).",
    },
    {
      id: "d1-41",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "A finance team needs the merchant, date, and amount pulled out of scanned expense receipts and stored as data. Which workload is this?",
      options: ["Information extraction", "Generative AI", "Speech recognition", "Sentiment analysis"],
      answer: [0],
      explanation: "Turning unstructured content such as receipts into structured, searchable fields is information extraction.",
    },
    {
      id: "d1-42",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "Which scenarios are examples of information extraction? (Choose two.)",
      options: [
        "Pulling fields from scanned invoices into an accounts system",
        "Getting attendee counts as structured data from conference-room video",
        "Writing a new marketing slogan",
        "Reading a text message aloud",
        "Translating a live chat between two people",
      ],
      answer: [0, 1],
      explanation: "Information extraction turns documents, images, audio, or video into machine-readable values. The others generate, speak, or translate content.",
    },
    {
      id: "d1-43",
      domain: "d1",
      lesson: "d1-workloads",
      type: "match",
      prompt: "Match each scenario to its AI workload.",
      pairs: [
        ["An assistant that updates a CRM record after a sales call", "Agentic AI"],
        ["Finding the people and places named in news articles", "Text analysis"],
        ["Live captions for a webinar", "Speech"],
        ["Counting cars in parking-lot camera images", "Computer vision"],
        ["Turning loan application forms into database fields", "Information extraction"],
      ],
      explanation: "Look at the input and output: action taken, text insight, audio to text, image understanding, or structured fields.",
    },

    // ───── d1-text ─────
    {
      id: "d1-44",
      domain: "d1",
      lesson: "d1-text",
      prompt:
        "From the review \"Our waiter Pete recommended the strawberry cheesecake after a fantastic meal in Seattle\", a technique returns \"waiter\", \"strawberry cheesecake\", \"fantastic meal\", and \"Seattle\". Which technique is this?",
      options: ["Key phrase extraction", "Language detection", "Speech synthesis", "Object detection"],
      answer: [0],
      explanation: "Key phrase extraction lists the main concepts in text, which helps with indexing and search.",
    },
    {
      id: "d1-45",
      domain: "d1",
      lesson: "d1-text",
      prompt:
        "You need to find the person, organization, location, and date in: \"On 2 May, Priya Patel visited Lisbon for a Fabrikam conference.\" Which technique should you use?",
      options: ["Named entity recognition", "Sentiment analysis", "Summarization", "Language detection"],
      answer: [0],
      explanation: "Entity recognition returns entities with a type (Person, Organization, Location, DateTime) and sometimes a subtype.",
    },
    {
      id: "d1-46",
      domain: "d1",
      lesson: "d1-text",
      prompt: "Which technique identifies a known entity in text and returns a link to a Wikipedia article about it?",
      options: ["Entity linking", "Key phrase extraction", "PII detection", "Opinion mining"],
      answer: [0],
      explanation: "Entity linking disambiguates known entities, for example which \"Paris\" the text means, and links to a reference.",
    },
    {
      id: "d1-47",
      domain: "d1",
      lesson: "d1-text",
      prompt: "A brand team wants each sentence of a long review labeled positive, negative, or neutral, plus an overall rating. Which technique does this?",
      options: ["Sentiment analysis and opinion mining", "Entity linking", "Language detection", "Optical character recognition"],
      answer: [0],
      explanation: "Sentiment analysis classifies text, and can work at document or sentence level.",
    },
    {
      id: "d1-48",
      domain: "d1",
      lesson: "d1-text",
      prompt: "Executives want a short paragraph covering the most important points of each 30-page market report. Which technique is this?",
      options: ["Summarization", "Key phrase extraction", "PII detection", "Entity linking"],
      answer: [0],
      explanation: "Summarization identifies the most important information and condenses it. Key phrases would only list topics.",
    },
    {
      id: "d1-49",
      domain: "d1",
      lesson: "d1-text",
      prompt: "What does Azure Language's language detection return for a piece of text?",
      options: [
        "The primary language, its ISO 639-1 code, and a confidence score",
        "A translation of the text into English",
        "A spoken audio version of the text",
        "A list of the key phrases in the text",
      ],
      answer: [0],
      explanation: "For \"¡Hola! Me llamo Josefina\" it returns Spanish, es, and a confidence score such as 1.00. It doesn't translate.",
    },
    {
      id: "d1-50",
      domain: "d1",
      lesson: "d1-text",
      prompt: "A clinic must find names, phone numbers, addresses, and health details in notes and redact them before sharing. Which capability fits?",
      options: [
        "Personally identifiable information (PII) detection",
        "Key phrase extraction",
        "Entity linking",
        "Image classification",
      ],
      answer: [0],
      explanation: "PII detection identifies personal data, including personal health information (PHI), and can return redacted text.",
    },
    {
      id: "d1-51",
      domain: "d1",
      lesson: "d1-text",
      prompt: "When is Azure Language in Foundry Tools a better choice than prompting a general-purpose model for text analysis? (Choose two.)",
      options: [
        "When an automated pipeline needs deterministic, structured results",
        "When you need consistent values such as language codes and confidence scores",
        "When you want to write creative marketing copy",
        "When users want to ask open-ended follow-up questions",
        "When you need to generate images",
      ],
      answer: [0, 1],
      explanation: "Azure Language uses purpose-built analyzers with predictable output. General-purpose models are more flexible but can vary between calls.",
    },

    // ───── d1-perceive ─────
    {
      id: "d1-52",
      domain: "d1",
      lesson: "d1-perceive",
      prompt: "In a speech-to-text system, which model converts the audio signal into phonemes (representations of specific sounds)?",
      options: ["The acoustic model", "The language model", "The embedding model", "The image-generation model"],
      answer: [0],
      explanation: "The acoustic model maps audio to phonemes. A language model then maps phonemes to words.",
    },
    {
      id: "d1-53",
      domain: "d1",
      lesson: "d1-perceive",
      type: "order",
      prompt: "Put the steps of speech synthesis (text to speech) in order.",
      items: [
        "Tokenize the text into individual words",
        "Assign phonetic sounds to each word",
        "Group the phonetic transcription into prosodic units such as phrases",
        "Generate audio from the phonemes using the chosen voice",
      ],
      explanation: "Text → words → phonetics → prosodic units → phonemes synthesized as audio, with a voice, rate, pitch, and volume.",
    },
    {
      id: "d1-54",
      domain: "d1",
      lesson: "d1-perceive",
      prompt: "Why do neural voices in Azure Speech usually sound more natural than older synthetic voices?",
      options: [
        "They use neural networks that handle intonation better",
        "They play back recordings of a real person reading every possible sentence",
        "They speak more slowly",
        "They only support one language",
      ],
      answer: [0],
      explanation: "Neural voices overcome common synthesis problems such as flat or odd intonation.",
    },
    {
      id: "d1-55",
      domain: "d1",
      lesson: "d1-perceive",
      prompt: "A model classifies every pixel of an image according to the object it belongs to, producing a precise outline of each object. Which computer vision technique is this?",
      options: ["Semantic segmentation", "Image classification", "Object detection", "Optical character recognition"],
      answer: [0],
      explanation: "Segmentation works at pixel level. Object detection only draws rectangular bounding boxes.",
    },
    {
      id: "d1-56",
      domain: "d1",
      lesson: "d1-perceive",
      prompt: "A self-checkout must identify several items on the counter at once and locate each one. What does an object detection model return?",
      options: [
        "A label for each object and the coordinates of its bounding box",
        "One label for the whole image",
        "A spoken description of the image",
        "A new image generated from the input",
      ],
      answer: [0],
      explanation: "Object detection finds multiple objects and their locations. Image classification gives a single label for the image.",
    },
    {
      id: "d1-57",
      domain: "d1",
      lesson: "d1-perceive",
      prompt: "Which tasks can a vision-enabled multimodal chat model perform when you include an image in the prompt? (Choose two.)",
      options: [
        "Describe what's in the image in natural language",
        "Answer a question about a chart in a screenshot",
        "Generate a video clip from the image",
        "Convert the image into spoken audio",
        "Transcribe a phone call",
      ],
      answer: [0, 1],
      explanation: "Vision-enabled models reason over images and text together and respond in text. Video comes from video-generation models such as Sora.",
    },
    {
      id: "d1-58",
      domain: "d1",
      lesson: "d1-perceive",
      prompt: "How does schema-based information extraction go beyond basic OCR? (Choose two.)",
      options: [
        "It maps values to named fields defined in a schema, including nested fields",
        "It recognizes that labels such as \"Invoice #\" and \"Invoice No.\" mean the same field",
        "It only returns the raw text from the page",
        "It requires every label to match the schema exactly",
        "It only works on handwritten text",
      ],
      answer: [0, 1],
      explanation: "OCR reads text but doesn't understand meaning. Schema-based extraction applies fields semantically, even when labels differ or are missing.",
    },
    {
      id: "d1-59",
      domain: "d1",
      lesson: "d1-perceive",
      prompt: "Which statement best describes an image-generation model?",
      options: [
        "It creates a new image that matches a text description",
        "It assigns one label to an existing image",
        "It reads printed text from a scanned page",
        "It draws bounding boxes around faces",
      ],
      answer: [0],
      explanation: "Vision models usually match images to text. Image-generation models work in reverse, from a description to a new image.",
    },
  ],

  cards: [
    { id: "c-fairness", domain: "d1", kind: "concept", term: "Fairness", definition: "Minimize bias in data and test outputs so no group is treated unfairly" },
    { id: "c-reliability", domain: "d1", kind: "concept", term: "Reliability and safety", definition: "AI is probabilistic: plan for errors, test edge cases, use confidence thresholds" },
    { id: "c-privacy", domain: "d1", kind: "concept", term: "Privacy and security", definition: "Protect training and personal data; models mustn't reveal private details" },
    { id: "c-inclusiveness", domain: "d1", kind: "concept", term: "Inclusiveness", definition: "Design so no group of users is excluded, for example captions for speech apps" },
    { id: "c-transparency", domain: "d1", kind: "concept", term: "Transparency", definition: "Tell users AI is used, how it works, and its limitations" },
    { id: "c-accountability", domain: "d1", kind: "concept", term: "Accountability", definition: "People and organizations answer for their AI through a governance framework" },
    { id: "c-token", domain: "d1", kind: "concept", term: "Token", definition: "A word, sub-word, or punctuation unit with an integer ID in a model's vocabulary" },
    { id: "c-embedding", domain: "d1", kind: "concept", term: "Embedding", definition: "A vector that encodes meaning; similar meanings point in similar directions" },
    { id: "c-attention", domain: "d1", kind: "concept", term: "Attention", definition: "Weighs how much each surrounding token influences the current token" },
    { id: "c-transformer", domain: "d1", kind: "concept", term: "Transformer", definition: "Model architecture with an encoder (embeddings) and decoder (next-token prediction)" },
    { id: "c-cosine", domain: "d1", kind: "concept", term: "Cosine similarity", definition: "Measures how closely two embedding vectors point the same way" },
    { id: "c-slm", domain: "d1", kind: "concept", term: "Small language model (SLM)", definition: "Compact model for focused topics or on-device apps; cheaper than an LLM" },
    { id: "c-agent", domain: "d1", kind: "concept", term: "AI agent", definition: "A language model + instructions + tools that can reason and take actions" },
    { id: "s-catalog", domain: "d1", kind: "service", term: "Foundry model catalog", definition: "Discover, compare, and deploy models from Microsoft, partners, and open source" },
    { id: "c-global-standard", domain: "d1", kind: "concept", term: "Global Standard", definition: "Default deployment type: pay per token, any region, newest models first" },
    { id: "c-data-zone", domain: "d1", kind: "concept", term: "Data Zone deployment", definition: "Processes prompts only inside the US, EU, or APAC data zone" },
    { id: "c-ptu", domain: "d1", kind: "concept", term: "Provisioned throughput (PTU)", definition: "Reserved capacity for predictable throughput and low latency variance" },
    { id: "c-batch", domain: "d1", kind: "concept", term: "Global Batch", definition: "Async file of requests, 50% cheaper, 24-hour target turnaround" },
    { id: "c-tpm", domain: "d1", kind: "concept", term: "Tokens per minute (TPM)", definition: "A deployment's rate limit; exceed it and requests are throttled" },
    { id: "c-temperature", domain: "d1", kind: "concept", term: "Temperature", definition: "Low = focused and repeatable; high = creative and varied" },
    { id: "c-keyphrase", domain: "d1", kind: "concept", term: "Key phrase extraction", definition: "Lists the main concepts in unstructured text" },
    { id: "c-ner", domain: "d1", kind: "concept", term: "Named entity recognition", definition: "Finds people, places, organizations, dates, and quantities in text" },
    { id: "c-entity-linking", domain: "d1", kind: "concept", term: "Entity linking", definition: "Identifies known entities and links them to Wikipedia" },
    { id: "c-pii", domain: "d1", kind: "concept", term: "PII detection", definition: "Finds personal (and health) information in text and can redact it" },
    { id: "c-acoustic", domain: "d1", kind: "concept", term: "Acoustic model", definition: "Converts audio into phonemes in speech recognition" },
    { id: "c-segmentation", domain: "d1", kind: "concept", term: "Semantic segmentation", definition: "Classifies every pixel to outline objects precisely" },
    { id: "c-object-detection", domain: "d1", kind: "concept", term: "Object detection", definition: "Labels each object and returns its bounding box" },
    { id: "s-language", domain: "d1", kind: "service", term: "Azure Language in Foundry Tools", definition: "Deterministic text analysis: language detection, PII, entities, sentiment" },
  ],

  challenges: [
    {
      id: "ch-rai-matcher",
      domain: "d1",
      lesson: "d1-rai",
      title: "Name that principle",
      goal: "Match all eight scenarios to the right responsible AI principle without a single miss.",
      hint: "Ask what the practice protects: equal treatment, safe behaviour, personal data, access for everyone, understanding, or ownership.",
      takeaway: "Microsoft's six principles: fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability.",
      render: (onSolved) => <RaiMatcherLab goal="allCorrect" onSolved={onSolved} />,
    },
    {
      id: "ch-tool-sorter",
      domain: "d1",
      lesson: "d1-workloads",
      title: "Sort every job",
      goal: "Drop all ten jobs into the right bin: model or agent, Azure Language, Azure Speech, vision model, or Content Understanding.",
      hint: "Deterministic text results → Azure Language. Structured fields from files or recordings → Content Understanding.",
      takeaway: "Start from the input and the output you need, then pick the workload and the Foundry capability that delivers it.",
      render: (onSolved) => <ToolSorterLab goal="allSorted" onSolved={onSolved} />,
    },
  ],
});
