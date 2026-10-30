import { Flow, Ladder, ServiceRows, Tiles } from "@/components/learn/blocks";
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
    name: "AI concepts and capabilities",
    world: "The Concept Compass",
    // Official range is 40–45%; 42 keeps the two domains at 100.
    weight: 42,
    emoji: "🧭",
    color: "#a78bfa",
    summary:
      "How to build AI that people can trust, how generative models produce text, how to pick and deploy a model, and the everyday jobs AI is good at.",
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
    // ───── Start here (beginner) ─────
    {
      id: "d1-b-what-ai",
      level: "beginner",
      check: ["ai901-b1-01", "ai901-b1-02"],
      sources: [{ title: "What is Microsoft Foundry?", url: "https://learn.microsoft.com/en-us/azure/ai-foundry/what-is-azure-ai-foundry", license: "CC BY 4.0" }],
      task: "1.3",
      title: "What AI actually is",
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "📝", title: "Read text", text: "Tell you if a review is happy or angry.", color: "#a78bfa" },
            { icon: "🎙️", title: "Hear and speak", text: "Turn a voice note into text, or read text aloud.", color: "#a78bfa" },
            { icon: "👁️", title: "See", text: "Spot which fruit is on the scale at a checkout.", color: "#a78bfa" },
            { icon: "💬", title: "Write", text: "Draft an email or answer a question in plain words.", color: "#a78bfa" },
            { icon: "🤖", title: "Act", text: "Book a meeting for you by using a calendar.", color: "#a78bfa" },
            { icon: "🧾", title: "Pull out facts", text: "Read the total and date off a receipt.", color: "#a78bfa" },
          ]}
        />
      ),
      points: [
        "Normal software follows rules a person wrote by hand. AI is software that learns patterns from lots of examples instead.",
        "Think of a new shop assistant who has seen thousands of receipts. Nobody gave them a rulebook, but they can now spot the total on a receipt they've never seen.",
        "The thing that does the learning is called a model. Once it's trained, you send it new input and it gives you an answer.",
        "A workload is just a kind of job you give AI: reading text, hearing speech, seeing images, writing new content, or taking actions.",
        "Software that looks at photos or video, like spotting which fruit is on a scale, is doing **computer vision**.",
      ],
      tip: "On the exam, start by asking what goes in (text, audio, an image, a document) and what should come out. That usually names the workload for you.",
    },
    {
      id: "d1-b-genai",
      level: "beginner",
      check: ["ai901-b1-03", "ai901-b1-04"],
      task: "1.2",
      title: "Generative AI and prompts, from scratch",
      visual: (
        <Flow
          color="#a78bfa"
          steps={[
            { icon: "⌨️", label: "Prompt", sub: "You type a question or instruction" },
            { icon: "🧠", label: "Model", sub: "Guesses the next word, then the next" },
            { icon: "💬", label: "Response", sub: "You read the finished reply" },
          ]}
        />
      ),
      points: [
        "Generative AI creates new content, such as a reply, a summary, or a picture. It doesn't just label what's already there.",
        "What you send it is called a prompt. What comes back is the response, sometimes called a completion.",
        "It works a bit like the word suggestions on your phone keyboard, but trained on far more text. It picks a likely next word, adds it, and repeats.",
        "A token is a chunk of text, roughly a short word or part of a word. Models read and write in tokens, and you're usually billed per token.",
      ],
      tip: "Ask the same thing twice and you may get different wording. That's expected, because the model picks from likely words rather than looking up a fixed answer.",
    },
    {
      id: "d1-b-trust",
      level: "beginner",
      check: ["ai901-b1-05", "ai901-b1-06"],
      task: "1.1",
      title: "Why AI needs ground rules",
      visual: (
        <Ladder
          rungs={[
            { icon: "⚖️", name: "Treat people fairly", text: "Similar people should get similar results." },
            { icon: "🛡️", name: "Plan for mistakes", text: "AI can be wrong, so check before acting on it." },
            { icon: "🔒", name: "Protect personal data", text: "Keep only what you need, and keep it safe." },
            { icon: "🔍", name: "Be open about it", text: "Tell people when AI is involved." },
          ]}
        />
      ),
      points: [
        "AI learns from examples, so it can also learn the mistakes and unfair patterns hidden in those examples.",
        "It's like a new driver: very capable, but you still want rules of the road before they're out in traffic.",
        "Microsoft groups these rules into six responsible AI principles. You'll meet all six in the next lessons.",
      ],
      tip: "When a question describes a worry, such as unfair results, leaked data, or users not knowing AI is involved, it's asking about responsible AI.",
    },

    // ───── Exam lessons ─────
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
              { icon: "⚖️", title: "Fairness", text: "Reduce bias in the data, and test that results don't treat any group worse.", color: "#a78bfa" },
              { icon: "🛡️", title: "Reliability and safety", text: "AI works on probabilities, so it will sometimes be wrong. Plan for that.", color: "#a78bfa" },
              { icon: "🔒", title: "Privacy and security", text: "Protect training data, and stop the model revealing personal details.", color: "#a78bfa" },
              { icon: "🌈", title: "Inclusiveness", text: "Make sure no group of people is left out of the benefits.", color: "#a78bfa" },
              { icon: "🔍", title: "Transparency", text: "Tell users how the system works and where its limits are.", color: "#a78bfa" },
              { icon: "📋", title: "Accountability", text: "Named people and organizations answer for the AI, through governance.", color: "#a78bfa" },
            ]}
          />
          <RaiMatcherLab />
        </div>
      ),
      points: [
        "Responsible AI isn't a launch-day checklist. You think about it from the first idea, through design and building, and while the system runs.",
        "Content filters block harmful output, which helps. On their own, though, they don't make a solution responsible.",
        "Everyday examples: only act when the model is confident enough, delete personal data you no longer need, add captions to a voice app, and tell people when AI is used.",
      ],
      tip: "Exam questions describe a practice and ask which principle it supports. Look at the verb. Testing for bias is fairness, telling users is transparency, and setting up owners and sign-off is accountability.",
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
              { icon: "✂️", label: "Tokens", sub: "Text is split into words, word pieces, and punctuation, each with an ID number" },
              { icon: "🧮", label: "Encoder and attention", sub: "Learns embeddings: lists of numbers that capture meaning in context" },
              { icon: "🔮", label: "Decoder", sub: "Predicts the most likely next token" },
              { icon: "🔁", label: "Repeat", sub: "Adds that token and predicts again until the reply is done" },
            ]}
          />
        </div>
      ),
      points: [
        "A large language model (LLM) writes a reply by predicting the next token, adding it, and predicting again, over and over.",
        "Attention is how the model decides which nearby words matter most for the current one. Multi-head attention does several of these checks at once.",
        "LLMs handle a wide range of topics but cost more to train and run. Small language models (SLMs) suit focused topics and apps that run on a device.",
        "An agent is a language model plus instructions (its system prompt) plus tools it can use to look things up and take actions.",
      ],
      tip: "Because the model picks from likely tokens, the same prompt can come back worded differently. That's normal behaviour, not a bug.",
    },
    {
      id: "d1-choose",
      check: ["d1-20", "d1-24"],
      sources: [{ title: "Foundry Models catalog", url: "https://learn.microsoft.com/en-us/azure/ai-foundry/concepts/foundry-models-overview", license: "CC BY 4.0" }],
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
              { icon: "📚", title: "Model catalog", text: "Thousands of models, some sold directly by Azure and others from partners and the community. Filter by task and capability.", color: "#38bdf8" },
              { icon: "🏆", title: "Leaderboards and benchmarks", text: "Rank and compare models on quality, safety, cost, and speed. Then try the best ones with your own data.", color: "#38bdf8" },
              { icon: "🧪", title: "Evaluators", text: "Score quality (groundedness, relevance, coherence, fluency) and scan for safety risks. They find problems but don't fix them.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Models sold directly by Azure are hosted by Microsoft under the Microsoft Product Terms, with enterprise service-level agreements.",
        "Each catalog entry shows what the model can do, its benchmark scores, the tasks it supports, and responsible AI notes such as a model card.",
        "Classic language metrics are accuracy, precision, recall, and F1. AI-assisted metrics are groundedness, relevance, coherence, fluency, and GPT similarity.",
        "The Microsoft Foundry model catalog is one place to find, compare and deploy models from Microsoft, OpenAI, partners such as Mistral and Meta, and open-source communities.",
        "For example, to detect the language of each support ticket with a confidence score, use Azure Language in Foundry Tools rather than a general chat model.",
      ],
      tip: "If the job is narrow and you need the same structured answer every time, a Foundry Tool usually beats a general-purpose model.",
    },
    {
      id: "d1-deploy",
      check: ["d1-28", "d1-33"],
      sources: [
        { title: "Azure OpenAI: Global Batch", url: "https://learn.microsoft.com/en-us/azure/ai-foundry/openai/how-to/batch", license: "CC BY 4.0" },
        { title: "Provisioned throughput concepts", url: "https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/provisioned-throughput", license: "CC BY 4.0" },
      ],
      task: "1.2",
      title: "Deployment options and parameters",
      visual: (
        <div className="grid gap-5">
          <DeploymentChooser />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🌡️", title: "Temperature", text: "Low gives focused, repeatable answers. High gives creative, varied ones.", color: "#f97316" },
              { icon: "✂️", title: "Max output tokens", text: "Caps how long the reply can be, and so how many tokens it uses.", color: "#f97316" },
              { icon: "📜", title: "System instructions", text: "Set the model's role, tone, and rules.", color: "#f97316" },
              { icon: "🚦", title: "Tokens per minute", text: "The deployment's speed limit. Go over it and requests get slowed down.", color: "#f97316" },
            ]}
          />
        </div>
      ),
      points: [
        "Deploying a model gives you a stable, secure address to call, sets aside computing power for it, and turns on monitoring.",
        "When you deploy, you pick a deployment type, a model version, and a tokens-per-minute (TPM) limit.",
        "There are three families. Standard means you pay per token. Provisioned means you reserve capacity in PTUs. Batch is 50% cheaper and aims to finish within 24 hours.",
        "Getting throttled, meaning your requests are being slowed or refused? Lower the max output tokens or send fewer requests at the same time.",
        "Provisioned deployments reserve provisioned throughput units (PTUs), which suit steady, high-volume traffic that needs consistently fast replies. Global Batch suits big offline jobs, like summarizing millions of reviews within a day.",
      ],
      tip: "No rule about where data must stay, and normal traffic? Start with Global Standard.",
    },
    {
      id: "d1-workloads",
      check: ["d1-37", "d1-41"],
      sources: [{ title: "Azure OpenAI: Video generation (Sora)", url: "https://learn.microsoft.com/en-us/azure/ai-foundry/openai/concepts/video-generation", license: "CC BY 4.0" }],
      task: "1.3",
      title: "Spot the AI workload",
      visual: (
        <div className="grid gap-6">
          <Tiles
            cols={3}
            tiles={[
              { icon: "💬", title: "Generative AI", text: "Creates new content: chat answers, drafts, summaries, translations, code, and images.", color: "#a78bfa" },
              { icon: "🤖", title: "Agentic AI", text: "Reasons and acts, using tools to do tasks such as booking or emailing.", color: "#a78bfa" },
              { icon: "📝", title: "Text analysis", text: "Finds key phrases, names, mood, language, and personal details in text.", color: "#38bdf8" },
              { icon: "🎙️", title: "Speech", text: "Turns speech into text (recognition) and text into speech (synthesis).", color: "#f472b6" },
              { icon: "👁️", title: "Computer vision", text: "Labels, finds, and describes things in images, and can create images and video.", color: "#fb923c" },
              { icon: "🧾", title: "Information extraction", text: "Turns documents, images, audio, and video into tidy named fields.", color: "#34d399" },
            ]}
          />
          <ToolSorterLab />
        </div>
      ),
      points: [
        "Information extraction covers jobs like reading expense receipts, pulling details from recorded support calls, or counting visitors in video.",
        "Agents go further than a plain chat. They decide what to do next and call tools to do it.",
        "One solution often mixes workloads. For example, speech to text can feed the user's words to an agent.",
        "Information extraction turns messy input into **structured data**, such as fields pulled from scanned invoices or attendee counts from conference-room video.",
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
            { input: "\"Seattle\" in a review", service: "Entity linking", output: "Known entity plus a Wikipedia link" },
            { input: "A customer review", service: "Sentiment analysis and opinion mining", output: "Positive, negative, or neutral" },
            { input: "A 20-page report", service: "Summarization", output: "The most important points" },
            { input: "\"¡Hola! Me llamo Josefina\"", service: "Language detection", output: "Spanish · es · 1.00" },
            { input: "\"Call Maria on 020 7946 0958\"", service: "PII detection", output: "Person, phone number (redacted)" },
          ]}
        />
      ),
      points: [
        "A general-purpose model can do all of these if you ask in a prompt. The output depends on how you word the request.",
        "Azure Language in Foundry Tools gives structured results that come out the same way every time, which is what an automated pipeline needs.",
        "PII means personally identifiable information, like names and phone numbers. PII detection also covers health details (PHI) and can hand back the text with them blanked out.",
      ],
      tip: "If the question mentions the same result every time, a confidence score, or an ISO language code, the answer is probably Azure Language.",
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
              { icon: "🔊", label: "Acoustic model", sub: "Turns audio into phonemes (speech sounds)" },
              { icon: "📖", label: "Language model", sub: "Turns phonemes into words" },
              { icon: "📝", label: "Text", sub: "Captions, transcripts, dictation" },
            ]}
          />
          <CvTasks />
        </div>
      ),
      points: [
        "Speech synthesis, or text to speech, happens in steps. It splits the text into words, works out their sounds, groups them into natural phrases, then produces audio in a chosen voice.",
        "Neural voices sound more natural because they get the rise and fall of speech, called intonation, closer to a real person.",
        "Image generation runs vision in reverse. Instead of describing a picture, it starts from a text description and creates a new picture.",
        "OCR (optical character recognition) reads the text in an image. Schema-based extraction goes further and puts each value into a named field, such as InvoiceTotal.",
      ],
    },
  ],

  questions: [
    // ───── Start here (beginner) ─────
    {
      id: "ai901-b1-01",
      domain: "d1",
      lesson: "d1-b-what-ai",
      level: "beginner",
      prompt: "What's the main difference between AI and ordinary software?",
      options: [
        "AI learns patterns from examples instead of only following rules a person wrote",
        "AI always runs faster than ordinary software, because it skips all of the slow steps",
        "AI only works on phones",
        "AI never makes mistakes",
      ],
      answer: [0],
      explanation:
        "Ordinary software does exactly what its hand-written rules say. AI is trained on lots of examples and learns the patterns itself. That's also why it can sometimes be wrong.",
    },
    {
      id: "ai901-b1-02",
      domain: "d1",
      lesson: "d1-b-what-ai",
      level: "beginner",
      prompt: "A shop wants software that looks at a photo and says which fruit is on the scale. Which kind of AI job is this?",
      options: ["Computer vision", "Speech", "Text analysis", "Generative AI"],
      answer: [0],
      explanation:
        "The input is an image, and the job is to understand what's in it. Understanding images is called computer vision.",
    },
    {
      id: "ai901-b1-03",
      domain: "d1",
      lesson: "d1-b-genai",
      level: "beginner",
      prompt: "In generative AI, what is a prompt?",
      options: [
        "The question or instruction you send to the model",
        "The bill you get at the end of each month",
        "A picture the model creates",
        "A password that protects the model",
      ],
      answer: [0],
      explanation:
        "A prompt is what you type or send to the model, like \"Write a thank-you note to my team\". The model's reply is called the response.",
    },
    {
      id: "ai901-b1-04",
      domain: "d1",
      lesson: "d1-b-genai",
      level: "beginner",
      prompt: "Roughly what is a token?",
      options: [
        "A small chunk of text, about a short word or part of a word",
        "A whole page of text",
        "A coin you buy so that you can use an AI app for one question",
        "A type of computer chip",
      ],
      answer: [0],
      explanation:
        "Models read and write text in small chunks called tokens. A word like \"unlikely\" might be split into \"un\" and \"likely\". Costs and limits are usually counted in tokens.",
    },
    {
      id: "ai901-b1-05",
      domain: "d1",
      lesson: "d1-b-trust",
      level: "beginner",
      prompt: "Why can an AI system end up treating some groups of people unfairly?",
      options: [
        "It learns from examples, and those examples can contain unfair patterns",
        "Computers dislike certain people",
        "AI is always programmed to be unfair",
        "It only happens when the internet is slow and the model can't finish its work",
      ],
      answer: [0],
      explanation:
        "AI copies the patterns in the data it learned from. If past decisions in that data were unfair, the model can repeat them. That's why teams check data and results for bias.",
    },
    {
      id: "ai901-b1-06",
      domain: "d1",
      lesson: "d1-b-trust",
      level: "beginner",
      prompt: "A website adds a note saying \"Answers on this page are written by AI.\" Which idea does this show?",
      options: ["Being open that AI is involved", "Making the AI run a lot faster", "Saving money on tokens", "Training a new model"],
      answer: [0],
      explanation:
        "Telling people when AI is involved lets them decide how much to trust what they read. Microsoft calls this transparency.",
    },
    {
      id: "ai901-b1-07",
      domain: "d1",
      lesson: "d1-b-what-ai",
      level: "beginner",
      prompt: "In AI, what is a model?",
      options: [
        "The trained part that takes new input and gives an answer",
        "A person who poses for the photos used in training",
        "A drawing of how the app looks",
        "The screen where users type",
      ],
      answer: [0],
      explanation:
        "A model is what you get after training on examples. You send it new input, such as a photo or a question, and it gives back an answer.",
    },
    {
      id: "ai901-b1-08",
      domain: "d1",
      lesson: "d1-b-genai",
      level: "beginner",
      prompt: "You ask a chat model the same question twice and the wording of the answers is different. What does this mean?",
      options: [
        "This is normal, because the model picks from likely words each time",
        "The model is broken and needs to be replaced with a new one before you continue",
        "Someone changed your question",
        "The model forgot everything it learned",
      ],
      answer: [0],
      explanation:
        "Generative models choose each next word from several likely options, so wording can change between tries. If you need more consistent answers, you can lower a setting called temperature.",
    },
    {
      id: "ai901-b1-09",
      domain: "d1",
      lesson: "d1-b-trust",
      level: "beginner",
      prompt: "A robot only picks up a box when its camera model is very sure it's the right box. Why is this a good idea?",
      options: [
        "AI can be wrong, so waiting for high confidence avoids risky mistakes",
        "It makes the robot look more human",
        "It means the robot never needs to be checked, charged, or repaired by a person",
        "It lets the robot skip training",
      ],
      answer: [0],
      explanation:
        "AI gives answers with a level of confidence, and sometimes it guesses wrong. Only acting when it's very sure is a simple way to keep people and things safe.",
    },

    // ───── d1-rai ─────
    {
      id: "d1-01",
      domain: "d1",
      lesson: "d1-rai",
      prompt:
        "A bank tests its loan-approval model. Applicants from some postcodes get declined more often than applicants from other postcodes with the same income and credit history. Which responsible AI principle is most at risk?",
      options: ["Fairness", "Transparency", "Inclusiveness", "Reliability and safety"],
      answer: [0],
      explanation:
        "People with the same finances are getting different results, which points to bias in the data or the model. Fairness is about reducing that bias and testing results for discrimination.",
    },
    {
      id: "d1-02",
      domain: "d1",
      lesson: "d1-rai",
      prompt:
        "A robotic arm uses computer vision to pick up parts. It only moves when the model is more than 0.9 confident it has found the right part. Which principle does this design support?",
      options: ["Reliability and safety", "Accountability", "Privacy and security", "Transparency"],
      answer: [0],
      explanation:
        "AI works on probabilities, so it's sometimes unsure. A confidence threshold stops the arm acting on a shaky guess and causing harm.",
    },
    {
      id: "d1-03",
      domain: "d1",
      lesson: "d1-rai",
      prompt:
        "A secure-entry system takes face photos to grant temporary access. It deletes each photo once access is granted, and operators can't view them. Which principle is this?",
      options: ["Privacy and security", "Inclusiveness", "Fairness", "Accountability and transparency"],
      answer: [0],
      explanation:
        "The system keeps personal data only as long as it needs it and limits who can see it. That protects privacy and security.",
    },
    {
      id: "d1-04",
      domain: "d1",
      lesson: "d1-rai",
      prompt: "A voice-based AI agent also shows text captions of everything it says. Which principle does this support most directly?",
      options: ["Inclusiveness", "Transparency", "Reliability and safety", "Fairness"],
      answer: [0],
      explanation: "Captions mean people who are deaf or hard of hearing can use the agent too, so no group is left out.",
    },
    {
      id: "d1-05",
      domain: "d1",
      lesson: "d1-rai",
      prompt:
        "An insurer tells customers that an AI model helps assess claims. It also describes the kinds of data the model learned from, without giving away confidential details. Which principle is this?",
      options: ["Transparency", "Accountability", "Privacy and security", "Inclusiveness"],
      answer: [0],
      explanation: "Transparency means users know AI is involved, roughly how it works, and what it can't do.",
    },
    {
      id: "d1-06",
      domain: "d1",
      lesson: "d1-rai",
      prompt:
        "Your organization sets up a governance framework. Each AI system gets a named owner, every release needs sign-off, and there's a process for handling reports of harm. Which principle does this address?",
      options: ["Accountability", "Fairness", "Transparency", "Reliability and safety"],
      answer: [0],
      explanation:
        "The people and organizations that build and ship AI must answer for it. A governance framework is how you make that real day to day.",
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
      explanation:
        "Fairness starts with checking the training data for bias, then carries on with testing the results across groups. None of the other options does anything about bias.",
    },
    {
      id: "d1-08",
      domain: "d1",
      lesson: "d1-rai",
      prompt: "A public chat assistant must not help people with illegal or harmful activities. Which measures reduce this risk? (Choose two.)",
      options: [
        "Apply content filters to prompts and responses",
        "Test the assistant with adversarial and harmful prompts before release",
        "Increase the max output tokens setting",
        "Remove the system prompt so the model answers freely",
        "Publish all user prompts on a public page",
      ],
      answer: [0, 1],
      explanation:
        "Content filters block harmful replies. Testing with deliberately nasty prompts, often called red-teaming, shows you where it fails before real users find out.",
    },
    {
      id: "d1-09",
      domain: "d1",
      lesson: "d1-rai",
      type: "match",
      prompt: "Match each responsible AI principle to what it asks you to do.",
      pairs: [
        ["Fairness", "Reduce bias in training data and test for unfair results"],
        ["Privacy and security", "Keep training data safe and stop models revealing personal details"],
        ["Transparency", "Help users understand how the system works and its limits"],
        ["Accountability", "Use a governance framework so people answer for the AI"],
        ["Inclusiveness", "Make sure the solution doesn't leave some users out"],
      ],
      explanation: "These five, plus reliability and safety, are Microsoft's six responsible AI principles.",
    },
    {
      id: "d1-10",
      domain: "d1",
      lesson: "d1-rai",
      prompt: "Which statement about responsible AI is correct?",
      options: [
        "It should be considered from the solution's conception through design, implementation, and operation",
        "It only needs attention after a model is deployed to production",
        "Turning on content filters is enough to make any AI solution responsible from the first day it goes live",
        "It applies to generative AI but not to vision or speech solutions",
      ],
      answer: [0],
      explanation:
        "Content filters are one useful tool, but they aren't the whole job. Responsible AI is a set of principles you apply for the whole life of every kind of AI solution.",
    },

    // ───── d1-genai ─────
    {
      id: "d1-11",
      domain: "d1",
      lesson: "d1-genai",
      prompt: "Put simply, what does a large language model do when it receives a prompt?",
      options: [
        "Repeatedly predicts the most probable next token to build a completion",
        "Looks up a stored answer in a database of questions",
        "Runs a set of hand-written if-then rules",
        "Copies the closest matching document from its training data",
      ],
      answer: [0],
      explanation:
        "An LLM is like a very powerful version of your phone's word suggestions. It predicts a token, adds it to the text, and predicts again until the reply is finished.",
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
        "A label that marks a training example as correct or incorrect before the model learns from it",
      ],
      answer: [0],
      explanation:
        "A vocabulary holds hundreds of thousands of tokens, including word pieces such as \"un\" in \"unlikely\". Don't mix this up with API keys, which are a separate thing.",
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
        "Hidden system prompts that the provider adds to every request to control the model's tone and its length",
      ],
      answer: [0],
      explanation:
        "A vector is just a list of numbers. The encoder turns each token's starting vector into an embedding that carries meaning, so \"dog\" and \"puppy\" end up close together.",
    },
    {
      id: "d1-14",
      domain: "d1",
      lesson: "d1-genai",
      prompt: "You want to measure how close in meaning two embedding vectors are. Which calculation is commonly used?",
      options: ["Cosine similarity", "Mean absolute error", "Tokens per minute", "F1 score"],
      answer: [0],
      explanation:
        "Cosine similarity compares which way two vectors point. The closer the result is to 1, the closer their meanings are.",
    },
    {
      id: "d1-15",
      domain: "d1",
      lesson: "d1-genai",
      prompt: "In the sentence \"I heard a dog bark\", what does an attention layer do when it processes the token \"bark\"?",
      options: [
        "Gives more weight to \"heard\" and \"dog\" because they influence the meaning of \"bark\" most",
        "Removes \"I\" and \"a\" from the vocabulary",
        "Translates \"bark\" into another language so the model can compare it with similar words first",
        "Assigns \"bark\" a new random integer ID",
      ],
      answer: [0],
      explanation:
        "Attention weighs the surrounding tokens by how much they affect the meaning. Here \"dog\" tells the model this is the sound, not tree bark. Those weights shape the token's embedding.",
    },
    {
      id: "d1-16",
      domain: "d1",
      lesson: "d1-genai",
      type: "order",
      prompt: "Put these steps in the order a transformer-based language model goes through, from training text to a generated reply.",
      items: [
        "Break the text into tokens and give each a unique ID",
        "Assign each token an initial vector plus a positional encoding",
        "Use attention in the encoder to learn embeddings",
        "Use the decoder to predict the next most probable token after a prompt",
        "Append the predicted token and repeat until the sequence ends",
      ],
      explanation:
        "First the text is split into tokens. Each token gets a starting vector and a note of its position. Attention then builds embeddings, the decoder predicts the next token, and the loop repeats.",
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
      explanation:
        "The difference is how much data they learned from and how many internal settings they have. Smaller models cover less ground, but they're cheaper and easy to run on a device.",
    },
    {
      id: "d1-18",
      domain: "d1",
      lesson: "d1-genai",
      prompt: "What are the three key parts of an AI agent?",
      options: [
        "A language model, instructions, and tools",
        "A database, a web server, and a firewall",
        "Training data, labels, and a loss function",
        "An endpoint, an API key, and a region",
      ],
      answer: [0],
      explanation:
        "The model is the agent's brain. The instructions are its job description. Tools let it look things up and take actions.",
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
        "The endpoint routes each request to a different language model in another Azure region",
      ],
      answer: [0],
      explanation:
        "Models write by picking from likely tokens, so the choice can differ each time. Lowering the temperature makes answers more consistent.",
    },

    // ───── d1-choose ─────
    {
      id: "d1-20",
      domain: "d1",
      lesson: "d1-choose",
      prompt:
        "You need one place to find, compare, and deploy models from Microsoft, OpenAI, partners such as Mistral and Meta, and open-source communities. What should you use?",
      options: ["The Microsoft Foundry model catalog", "Azure Key Vault", "Azure Speech in Foundry Tools", "Azure Content Understanding in Foundry Tools"],
      answer: [0],
      explanation:
        "The model catalog is Foundry's central shelf of models. You can filter it by who made the model, what it can do, and which task it handles.",
    },
    {
      id: "d1-21",
      domain: "d1",
      lesson: "d1-choose",
      prompt: "Before picking a model, your team wants to rank the candidates on quality, safety, and speed using standard test sets. Which Foundry feature helps most?",
      options: ["Model leaderboards and benchmark results", "Tokens-per-minute quotas", "The Azure Language MCP server tools", "Batch transcription"],
      answer: [0],
      explanation:
        "Leaderboards and benchmarks score every model the same way, so the comparison is fair. Once you have a shortlist, try those models with your own data.",
    },
    {
      id: "d1-22",
      domain: "d1",
      lesson: "d1-choose",
      prompt: "A search feature must turn product descriptions into vectors so that items can be matched by meaning. Which type of model should you deploy?",
      options: ["An embedding model such as text-embedding-3-small", "An image-generation model that draws each product", "A video-generation model", "A speech synthesis voice"],
      answer: [0],
      explanation:
        "Embedding models are built to turn text into vectors that capture meaning. That lets \"warm winter jacket\" match \"insulated coat\" even though the words differ.",
    },
    {
      id: "d1-23",
      domain: "d1",
      lesson: "d1-choose",
      prompt: "An insurance app lets customers upload a photo of their damaged car and ask questions about it. Which kind of model fits best?",
      options: ["A multimodal (vision-enabled) model", "An embedding model", "A small text-only language model (SLM)", "A speech-to-text model"],
      answer: [0],
      explanation:
        "Multimodal means the model accepts more than one kind of input. A vision-enabled model takes the photo and the question together and answers in plain language.",
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
      explanation:
        "For narrow, well-defined jobs, Foundry Tools use prebuilt models that return the same structured output every time. A general chat model might word its answer differently on each call.",
    },
    {
      id: "d1-25",
      domain: "d1",
      lesson: "d1-choose",
      prompt: "You're evaluating a chat model in Foundry. Which of these are AI-assisted quality metrics rather than classic language metrics? (Choose two.)",
      options: ["Groundedness", "Coherence", "Recall", "F1 score", "Precision"],
      answer: [0, 1],
      explanation:
        "AI-assisted metrics include groundedness, relevance, coherence, fluency, and GPT similarity. Precision, recall, and F1 are the classic metrics that come from older language processing work.",
    },
    {
      id: "d1-26",
      domain: "d1",
      lesson: "d1-choose",
      prompt: "What do safety evaluators in Microsoft Foundry do?",
      options: [
        "Scan and score outputs for harms such as violence, self-harm, or bias, without fixing them",
        "Automatically rewrite unsafe responses into safe ones before the user ever gets to see them",
        "Retrain the model to remove unsafe behaviour",
        "Encrypt prompts before they reach the model",
      ],
      answer: [0],
      explanation:
        "Evaluators find and score problems, like a smoke alarm. Fixing them is your job, for example with better prompts, content filters, or a different model.",
    },
    {
      id: "d1-27",
      domain: "d1",
      lesson: "d1-choose",
      prompt: "In the Foundry model catalog, which group of models is hosted by Microsoft under the Microsoft Product Terms with enterprise-grade SLAs?",
      options: ["Models sold directly by Azure", "Models from partners and the community", "Prebuilt Content Understanding analyzers", "Custom neural voices"],
      answer: [0],
      explanation:
        "Models sold directly by Azure are closely tied into Azure, with service-level agreements and security set up for you. Partner and community models give you a wider range to experiment with.",
    },

    // ───── d1-deploy ─────
    {
      id: "d1-28",
      domain: "d1",
      lesson: "d1-deploy",
      prompt: "You're deploying a new chat model. There's no rule about where data must be processed, and traffic is unpredictable. Which deployment type should you start with?",
      options: ["Global Standard", "Regional Provisioned", "Data Zone Batch", "Developer"],
      answer: [0],
      explanation:
        "Global Standard is the recommended default. You pay per token, new models arrive there first, it's the cheapest, and it has the highest starting quota.",
    },
    {
      id: "d1-29",
      domain: "d1",
      lesson: "d1-deploy",
      prompt: "A company must make sure prompts and responses are only processed inside the EU data zone, and it wants to pay per token. Which deployment type fits?",
      options: ["Data Zone Standard", "Global Standard", "Global Batch", "Global Provisioned"],
      answer: [0],
      explanation:
        "Data Zone types only process data inside a Microsoft-defined zone: the US, the EU, or APAC. Standard means you pay per token.",
    },
    {
      id: "d1-30",
      domain: "d1",
      lesson: "d1-deploy",
      prompt: "A call-center assistant handles a steady, high volume of requests and needs consistently fast replies. Which kind of deployment is most suitable?",
      options: ["A provisioned deployment with reserved provisioned throughput units (PTUs)", "A Developer deployment", "A batch deployment", "No deployment: call the model directly from the Foundry playground whenever a request arrives"],
      answer: [0],
      explanation:
        "A provisioned deployment reserves capacity just for you, like booking a private lane. You get predictable throughput and response times that vary less than on standard types.",
    },
    {
      id: "d1-31",
      domain: "d1",
      lesson: "d1-deploy",
      prompt: "You need to summarize two million archived product reviews as cheaply as possible. You need results within a day, not in real time. Which deployment type should you use?",
      options: ["Global Batch", "Global Provisioned", "Data Zone Standard", "Standard"],
      answer: [0],
      explanation:
        "Batch types work through a big file of requests in the background. They cost 50% less than Global Standard and aim to finish within 24 hours.",
    },
    {
      id: "d1-32",
      domain: "d1",
      lesson: "d1-deploy",
      prompt: "Your app starts getting rate-limit errors from a model deployment during busy periods. Which changes in your app reduce the throttling? (Choose two.)",
      options: [
        "Lower the max output tokens setting",
        "Send fewer requests at the same time",
        "Raise the temperature",
        "Move the system prompt into the user prompt",
        "Add more long examples to every prompt",
      ],
      answer: [0, 1],
      explanation:
        "Longer prompts and a higher max output tokens use up more of the deployment's tokens-per-minute allowance. Fewer, smaller requests keep you under the limit.",
    },
    {
      id: "d1-33",
      domain: "d1",
      lesson: "d1-deploy",
      prompt: "A help-desk bot gives creative but inconsistent answers to policy questions. You want focused, repeatable answers. Which parameter change helps most?",
      options: ["Lower the temperature", "Raise the temperature", "Increase the tokens-per-minute allocation", "Switch to a video-generation model"],
      answer: [0],
      explanation:
        "Temperature sets how adventurous the model is. A lower value makes it stick to the most likely tokens, so answers stay focused and similar each time.",
    },
    {
      id: "d1-34",
      domain: "d1",
      lesson: "d1-deploy",
      type: "match",
      prompt: "Match each setting to what it controls.",
      pairs: [
        ["Temperature", "How creative or predictable the output is"],
        ["Max output tokens", "How long a response can be, and the tokens it uses"],
        ["System instructions", "The model's role, tone, and rules"],
        ["Tokens per minute (TPM)", "The deployment's rate limit before throttling"],
      ],
      explanation:
        "You set temperature, max output tokens, and system instructions in the playground or on each request. TPM is set on the deployment itself.",
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
      explanation: "Pick a model, deploy it, prove it works in the playground, then copy the working settings into your code.",
    },

    // ───── d1-workloads ─────
    {
      id: "d1-36",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "A museum website lets visitors type questions about the history of computing and get original, conversational answers. Which AI workload is this?",
      options: ["Generative AI", "Information extraction", "Speech synthesis", "Object detection"],
      answer: [0],
      explanation: "Writing new answers in natural language in response to a prompt is generative AI.",
    },
    {
      id: "d1-37",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "An assistant reads incoming requests, decides what to do, and then books meetings and sends confirmation emails by itself. Which workload does this describe best?",
      options: ["Agentic AI", "Sentiment analysis", "Image classification", "Optical character recognition"],
      answer: [0],
      explanation:
        "Agents think about the request, then use tools such as a calendar and email to actually do the task. Taking action is what makes it agentic.",
    },
    {
      id: "d1-38",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "A retailer wants to know whether thousands of product reviews are positive, negative, or neutral. Which workload is this?",
      options: ["Text analysis", "Computer vision", "Speech recognition", "Image generation"],
      answer: [0],
      explanation: "Working out the mood of a piece of text is called sentiment analysis, and it's one of the text analysis techniques.",
    },
    {
      id: "d1-39",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "A hands-free kiosk in a factory listens to spoken questions and answers out loud. Which workload is central to this solution?",
      options: ["Speech", "Information extraction", "Object detection", "Embeddings"],
      answer: [0],
      explanation: "Speech recognition turns the spoken question into text, and speech synthesis reads the answer aloud.",
    },
    {
      id: "d1-40",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "A grocery store wants a checkout camera that recognizes which fruit or vegetable a customer puts on the scale. Which workload is this?",
      options: ["Computer vision", "Text analysis", "Speech synthesis", "Agentic AI"],
      answer: [0],
      explanation: "Recognizing produce from a camera image is computer vision. This particular job is called image classification.",
    },
    {
      id: "d1-41",
      domain: "d1",
      lesson: "d1-workloads",
      prompt: "A finance team needs the merchant, date, and amount pulled out of scanned expense receipts and stored as data. Which workload is this?",
      options: ["Information extraction", "Generative AI", "Speech recognition", "Sentiment analysis API"],
      answer: [0],
      explanation:
        "Turning messy content like receipts into neat, searchable fields is information extraction.",
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
      explanation:
        "Information extraction turns documents, images, audio, or video into values a computer can store and search. The other options create, speak, or translate content instead.",
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
      explanation:
        "Look at what goes in and what comes out. An action taken is agentic, insight from text is text analysis, audio to text is speech, understanding images is vision, and tidy fields are extraction.",
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
      explanation: "Key phrase extraction lists the main ideas in a piece of text. That makes the text easier to index and search.",
    },
    {
      id: "d1-45",
      domain: "d1",
      lesson: "d1-text",
      prompt:
        "You need to find the person, organization, location, and date in: \"On 2 May, Priya Patel visited Lisbon for a Fabrikam conference.\" Which technique should you use?",
      options: ["Named entity recognition", "Sentiment analysis", "Summarization", "Language detection API"],
      answer: [0],
      explanation:
        "An entity is a named thing, like a person or a place. Named entity recognition finds them and gives each a type such as Person, Organization, Location, or DateTime, sometimes with a subtype.",
    },
    {
      id: "d1-46",
      domain: "d1",
      lesson: "d1-text",
      prompt: "Which technique spots a well-known entity in text and returns a link to a Wikipedia article about it?",
      options: ["Entity linking", "Key phrase extraction", "PII detection", "Opinion mining"],
      answer: [0],
      explanation:
        "Entity linking works out which real-world thing the text means, for example which \"Paris\" it's talking about, and links to a reference page.",
    },
    {
      id: "d1-47",
      domain: "d1",
      lesson: "d1-text",
      prompt: "A brand team wants each sentence of a long review labeled positive, negative, or neutral, plus an overall rating. Which technique does this?",
      options: ["Sentiment analysis and opinion mining", "Entity linking", "Language detection", "Optical character recognition (OCR)"],
      answer: [0],
      explanation: "Sentiment analysis labels the mood of text. It can score the whole document or each sentence on its own.",
    },
    {
      id: "d1-48",
      domain: "d1",
      lesson: "d1-text",
      prompt: "Executives want a short paragraph covering the most important points of each 30-page market report. Which technique is this?",
      options: ["Summarization", "Key phrase extraction", "PII detection", "Entity linking"],
      answer: [0],
      explanation:
        "Summarization picks out the most important information and condenses it into a short text. Key phrase extraction would only give you a list of topics.",
    },
    {
      id: "d1-49",
      domain: "d1",
      lesson: "d1-text",
      prompt: "What does Azure Language's language detection return for a piece of text?",
      options: [
        "The primary language, its ISO 639-1 code, and a confidence score",
        "A translation of the text into English, with a quality score for the translation",
        "A spoken audio version of the text",
        "A list of the key phrases in the text",
      ],
      answer: [0],
      explanation:
        "For \"¡Hola! Me llamo Josefina\" it returns Spanish, the two-letter code es, and a confidence score such as 1.00. It tells you the language but doesn't translate.",
    },
    {
      id: "d1-50",
      domain: "d1",
      lesson: "d1-text",
      prompt: "A clinic must find names, phone numbers, addresses, and health details in notes and blank them out before sharing. Which capability fits?",
      options: [
        "Personally identifiable information (PII) detection",
        "Key phrase extraction with a custom stop-word list added",
        "Entity linking",
        "Image classification",
      ],
      answer: [0],
      explanation:
        "PII detection finds personal data, including personal health information (PHI). It can also return a copy of the text with those details redacted, meaning blanked out.",
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
      explanation:
        "Azure Language uses analyzers built for one job each, so the output is predictable. General-purpose models are more flexible, but their answers can change from call to call.",
    },

    // ───── d1-perceive ─────
    {
      id: "d1-52",
      domain: "d1",
      lesson: "d1-perceive",
      prompt: "In a speech-to-text system, which model turns the audio signal into phonemes, the individual speech sounds?",
      options: ["The acoustic model", "The language model", "The embedding model", "The image-generation model"],
      answer: [0],
      explanation: "The acoustic model maps audio to phonemes. A language model then works out which words those sounds make.",
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
      explanation:
        "The text is split into words, each word gets its sounds, and the sounds are grouped into natural phrases. Finally the audio is produced in your chosen voice, rate, pitch, and volume.",
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
      explanation:
        "Older voices often sounded flat or put the stress in odd places. Neural voices get the rise and fall of speech much closer to how a person talks.",
    },
    {
      id: "d1-55",
      domain: "d1",
      lesson: "d1-perceive",
      prompt: "A model labels every pixel of an image with the object it belongs to, giving a precise outline of each object. Which computer vision technique is this?",
      options: ["Semantic segmentation", "Image classification", "Object detection", "Optical character recognition"],
      answer: [0],
      explanation:
        "Segmentation works pixel by pixel, so it traces the exact shape. Object detection only draws a rectangle around each object.",
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
        "A new image generated from the input with each of the items removed",
      ],
      answer: [0],
      explanation:
        "Object detection finds many objects and where each one is, using a box around it. Image classification only gives one label for the whole picture.",
    },
    {
      id: "d1-57",
      domain: "d1",
      lesson: "d1-perceive",
      prompt: "Which tasks can a vision-enabled multimodal chat model do when you include an image in the prompt? (Choose two.)",
      options: [
        "Describe what's in the image in natural language",
        "Answer a question about a chart in a screenshot",
        "Generate a video clip from the image",
        "Convert the image into spoken audio",
        "Transcribe a phone call",
      ],
      answer: [0, 1],
      explanation:
        "Vision-enabled models look at the image and your text together and reply in text. Making video is a different job, done by video-generation models such as Sora.",
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
      explanation:
        "OCR reads the words but doesn't know what they mean. Schema-based extraction understands meaning, so it fills the right field even when the label is worded differently or missing.",
    },
    {
      id: "d1-59",
      domain: "d1",
      lesson: "d1-perceive",
      prompt: "Which statement best describes an image-generation model?",
      options: [
        "It creates a new image that matches a text description",
        "It assigns one label to an existing image",
        "It reads printed text from a scanned page or photo",
        "It draws bounding boxes around faces",
      ],
      answer: [0],
      explanation:
        "Most vision models start with an image and describe it in words. Image-generation models go the other way: they start with your words and create a new picture.",
    },
  ],

  cards: [
    { id: "c-fairness", domain: "d1", kind: "concept", term: "Fairness", definition: "Reduce bias in the data and test results so no group is treated worse than another." },
    { id: "c-reliability", domain: "d1", kind: "concept", term: "Reliability and safety", definition: "AI works on probabilities, so plan for errors: test unusual cases and act only above a confidence threshold." },
    { id: "c-privacy", domain: "d1", kind: "concept", term: "Privacy and security", definition: "Protect training and personal data, and make sure the model can't reveal private details." },
    { id: "c-inclusiveness", domain: "d1", kind: "concept", term: "Inclusiveness", definition: "Design so no group of users is left out, for example by adding captions to a voice app." },
    { id: "c-transparency", domain: "d1", kind: "concept", term: "Transparency", definition: "Tell users that AI is used, roughly how it works, and what its limits are." },
    { id: "c-accountability", domain: "d1", kind: "concept", term: "Accountability", definition: "People and organizations answer for their AI, through a governance framework." },
    { id: "c-token", domain: "d1", kind: "concept", term: "Token", definition: "A word, word piece, or punctuation mark with its own ID number in a model's vocabulary." },
    { id: "c-embedding", domain: "d1", kind: "concept", term: "Embedding", definition: "A list of numbers that captures meaning. Words with similar meanings get similar lists." },
    { id: "c-attention", domain: "d1", kind: "concept", term: "Attention", definition: "How the model weighs which surrounding tokens matter most for the current one." },
    { id: "c-transformer", domain: "d1", kind: "concept", term: "Transformer", definition: "The model design behind LLMs: an encoder builds embeddings and a decoder predicts the next token." },
    { id: "c-cosine", domain: "d1", kind: "concept", term: "Cosine similarity", definition: "Measures how closely two embedding vectors point the same way. Closer to 1 means closer in meaning." },
    { id: "c-slm", domain: "d1", kind: "concept", term: "Small language model (SLM)", definition: "A compact model for focused topics or apps on a device. Cheaper to run than an LLM." },
    { id: "c-agent", domain: "d1", kind: "concept", term: "AI agent", definition: "A language model plus instructions plus tools, so it can reason and take actions." },
    { id: "s-catalog", domain: "d1", kind: "service", term: "Foundry model catalog", definition: "Where you find, compare, and deploy models from Microsoft, partners, and open source." },
    { id: "c-global-standard", domain: "d1", kind: "concept", term: "Global Standard", definition: "The default deployment type. You pay per token, it can use any region, and new models land here first." },
    { id: "c-data-zone", domain: "d1", kind: "concept", term: "Data Zone deployment", definition: "Processes prompts only inside the US, EU, or APAC data zone." },
    { id: "c-ptu", domain: "d1", kind: "concept", term: "Provisioned throughput (PTU)", definition: "Capacity reserved just for you, for predictable throughput and steady response times." },
    { id: "c-batch", domain: "d1", kind: "concept", term: "Global Batch", definition: "Send a file of requests to run in the background. It's 50% cheaper and aims to finish within 24 hours." },
    { id: "c-tpm", domain: "d1", kind: "concept", term: "Tokens per minute (TPM)", definition: "A deployment's rate limit. Go over it and your requests get throttled." },
    { id: "c-temperature", domain: "d1", kind: "concept", term: "Temperature", definition: "A low setting gives focused, repeatable answers. A high setting gives creative, varied ones." },
    { id: "c-keyphrase", domain: "d1", kind: "concept", term: "Key phrase extraction", definition: "Lists the main ideas in a piece of text." },
    { id: "c-ner", domain: "d1", kind: "concept", term: "Named entity recognition", definition: "Finds people, places, organizations, dates, and quantities in text." },
    { id: "c-entity-linking", domain: "d1", kind: "concept", term: "Entity linking", definition: "Works out which well-known thing the text means and links it to Wikipedia." },
    { id: "c-pii", domain: "d1", kind: "concept", term: "PII detection", definition: "Finds personal and health information in text and can blank it out." },
    { id: "c-acoustic", domain: "d1", kind: "concept", term: "Acoustic model", definition: "In speech recognition, the part that turns audio into phonemes (speech sounds)." },
    { id: "c-segmentation", domain: "d1", kind: "concept", term: "Semantic segmentation", definition: "Labels every pixel, so you get the exact outline of each object." },
    { id: "c-object-detection", domain: "d1", kind: "concept", term: "Object detection", definition: "Labels each object in an image and draws a box around it." },
    { id: "s-language", domain: "d1", kind: "service", term: "Azure Language in Foundry Tools", definition: "Text analysis with the same structured output every time: language detection, PII, entities, sentiment." },
  ],

  challenges: [
    {
      id: "ch-rai-matcher",
      domain: "d1",
      lesson: "d1-rai",
      title: "Name that principle",
      goal: "Match all eight scenarios to the right responsible AI principle without a single miss.",
      hint: "Ask what each practice protects: equal treatment, safe behaviour, personal data, access for everyone, understanding, or ownership.",
      takeaway: "Microsoft's six principles are fairness, reliability and safety, privacy and security, inclusiveness, transparency, and accountability.",
      render: (onSolved) => <RaiMatcherLab goal="allCorrect" onSolved={onSolved} />,
    },
    {
      id: "ch-tool-sorter",
      domain: "d1",
      lesson: "d1-workloads",
      title: "Sort every job",
      goal: "Drop all ten jobs into the right bin: model or agent, Azure Language, Azure Speech, vision model, or Content Understanding.",
      hint: "If a job needs the same text result every time, it's Azure Language. If it needs named fields from files or recordings, it's Content Understanding.",
      takeaway: "Start from what goes in and what you need out. Then pick the workload and the Foundry capability that delivers it.",
      render: (onSolved) => <ToolSorterLab goal="allSorted" onSolved={onSolved} />,
    },
  ],
});
