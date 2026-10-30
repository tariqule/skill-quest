import { defineCourse } from "@/engine/define";
import d1 from "./domains/d1-ai-concepts";
import d2 from "./domains/d2-foundry-solutions";

/**
 * Microsoft Azure AI Fundamentals (AI-901).
 * AI-901 replaced AI-900, which retired on June 30, 2026. Content follows the
 * AI-901 study guide ("Skills measured as of April 15, 2026") and uses the
 * current product names: Microsoft Foundry and Foundry Tools.
 * Domain content lives in ./domains; this file holds course-wide metadata.
 */
export default defineCourse({
  id: "azure-ai-901",
  provider: { id: "azure", name: "Microsoft Azure", color: "#0ea5e9", icon: "🟦" },
  code: "AI-901",
  title: "Microsoft Certified: Azure AI Fundamentals",
  shortTitle: "Azure AI Fundamentals",
  tagline: "Learn how AI works, how to use it responsibly, and how to build chat apps, agents, and text, speech, vision, and document tools with Microsoft Foundry.",
  level: "Foundational",
  storageKey: "course:azure-ai-901:v1",

  domains: [d1, d2],

  exam: {
    // Microsoft doesn't publish an exact count ("most exams contain 40-60 questions").
    // The simulator uses 45 questions in the 45-minute fundamentals exam time.
    questions: 45,
    // Microsoft may include unscored questions but doesn't say how many.
    unscored: 0,
    minutes: 45,
    scale: { min: 1, max: 1000, pass: 700 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "1 correct answer." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "Choose the number of answers the question asks for. Here all must be right; the real exam can give partial credit." },
      { id: "order", icon: "🔢", name: "Build list (ordering)", rule: "Put 3 to 5 steps in the right sequence, like Microsoft's build-list items." },
      { id: "match", icon: "🔗", name: "Drag and drop (matching)", rule: "Pair each prompt with its answer, like Microsoft's drag-and-drop items. Every pair must be right." },
    ],
  },

  guide: {
    source: {
      label: "Study guide for Exam AI-901: Microsoft Azure AI Fundamentals",
      version: "Skills measured as of April 15, 2026",
      date: "Retrieved October 2026",
      url: "https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-901",
    },
    facts: [
      {
        icon: "📝",
        value: "40–60",
        label: "questions (typical)",
        detail: "Microsoft doesn't publish an exact count for AI-901. Most of its exams have 40 to 60, and our full practice exam uses 45.",
      },
      { icon: "⏱️", value: "45", label: "minutes", detail: "That's the time for the questions. Plan on 65 minutes in the seat, to cover the instructions and the candidate agreement." },
      {
        icon: "🎯",
        value: "700",
        label: "to pass",
        detail: "Scores run from 1 to 1,000. A scaled score isn't a percentage, so 700 doesn't necessarily mean 70% of the points.",
      },
      { icon: "🎲", value: "0", label: "guess penalty", detail: "A wrong answer costs you nothing, and multi-part questions usually give a point for each correct part. So never leave a question blank." },
      { icon: "🧪", value: "?", label: "unscored items", detail: "Some questions may be trial items that don't count. You can't tell which ones, so answer every question as if it counts." },
      { icon: "🐍", value: "Python", label: "basics expected", detail: "New in AI-901: you should be able to read basic Python and know what REST APIs, SDKs, CLIs, and Azure resources are." },
      { icon: "🌐", value: "13", label: "languages", detail: "English comes first. Other languages catch up about eight weeks after the English version changes." },
      { icon: "♾️", value: "No", label: "expiry", detail: "Fundamentals certifications don't expire, so you never need to renew." },
    ],
    candidate: {
      is: [
        "Starting out in a career building AI solutions",
        "Someone who understands, in broad terms, how AI solutions work in Azure",
        "Able to read and write basic Python",
        "Familiar with Azure resources, REST APIs, SDKs, and CLIs",
        "Ready to build small apps and agents with Microsoft Foundry",
      ],
      isNot: [
        "Someone who trains foundation models or tunes neural networks",
        "Someone who works through the maths behind machine learning",
        "Someone who designs enterprise-scale architectures or MLOps pipelines",
        "Allowed to look things up on Microsoft Learn during the exam (fundamentals exams don't offer that)",
      ],
    },
    scope: {
      label: "Microsoft products and capabilities in the AI-901 skills",
      groups: [
        {
          category: "Microsoft Foundry",
          icon: "🔨",
          services: [
            "Foundry portal and playgrounds",
            "Foundry resource",
            "Foundry project",
            "Foundry model catalog",
            "Foundry Agent Service",
            "Foundry IQ",
            "Foundry Tool Catalog",
            "Evaluators",
          ],
        },
        {
          category: "Foundry Tools",
          icon: "🧰",
          services: [
            "Azure Language in Foundry Tools",
            "Azure Language MCP server",
            "Azure Speech in Foundry Tools",
            "Azure Speech Voice Live",
            "Azure Content Understanding in Foundry Tools",
            "Azure Vision in Foundry Tools",
          ],
        },
        {
          category: "Models",
          icon: "🧠",
          services: ["GPT-4.1 family", "GPT-5 series", "Phi-4-multimodal-instruct", "text-embedding-3-small", "GPT-Image-1.5", "GPT-Image-1", "GPT-Image-1-Mini", "Sora 2", "Partner models (Anthropic, Mistral, Meta, DeepSeek, Black Forest Labs)"],
        },
        {
          category: "Developer tools",
          icon: "💻",
          services: ["Foundry SDK (azure-ai-projects)", "OpenAI Python library and Responses API", "azure-ai-textanalytics", "azure-cognitiveservices-speech", "azure-ai-voicelive", "azure-ai-contentunderstanding", "REST endpoints"],
        },
        { category: "Security", icon: "🔐", services: ["Microsoft Entra ID", "Role-based access control", "Azure Key Vault", "Managed identity", "API keys"] },
      ],
    },
    tips: [
      {
        icon: "🏷️",
        tip: "AI-901 uses Microsoft's current names. Older AI-900 material says Azure AI Foundry, Azure AI services, or Cognitive Services. Today they're called Microsoft Foundry and Foundry Tools, for example Azure Speech in Foundry Tools.",
      },
      { icon: "⚖️", tip: "If the answer must come out the same way every time, like codes, scores, or redacted text, pick a Foundry Tool. If it should be flexible and conversational, pick a general-purpose model." },
      { icon: "🐍", tip: "Expect short Python snippets. Learn which package and client each capability uses, and remember that model= takes your deployment name." },
      { icon: "🤖", tip: "An agent is a model plus instructions plus tools. Knowledge gives it information, and tools let it act." },
      { icon: "🧾", tip: "If a question wants fields pulled from documents, images, audio, or video, think Azure Content Understanding, with its schemas, analyzers, and background analysis." },
      { icon: "🎲", tip: "Guessing costs nothing. Mark the hard questions for review and come back to them at the end." },
    ],
    officialPractice: {
      label: "Microsoft's free practice assessment on AI Skills Navigator",
      url: "https://aiskillsnavigator.microsoft.com/credentials/cert-83587e0a0754cfee561ade3e27d9fa1cdaf15ae03be52d2413b2b858d1b4eda4",
    },
  },

  cheatsheet: [
    {
      title: "Responsible AI principles",
      items: [
        ["Fairness", "Reduce bias in the data and test results across groups"],
        ["Reliability and safety", "AI can be wrong, so use confidence thresholds, testing, and content filters"],
        ["Privacy and security", "Protect data, delete what you no longer need, and limit who can see it"],
        ["Inclusiveness", "Leave no one out, for example with captions on speech apps"],
        ["Transparency", "Tell people AI is used, how it works, and its limits"],
        ["Accountability", "A governance framework, so named people answer for the AI"],
      ],
    },
    {
      title: "How generative models work",
      items: [
        ["Token", "A word, word piece, or punctuation mark with an ID"],
        ["Embedding", "Meaning stored as a vector. Compare two with cosine similarity"],
        ["Transformer", "The encoder and attention build embeddings, then the decoder predicts the next token"],
        ["LLM or SLM", "An LLM is broad and powerful. An SLM is compact, focused, and can run on a device"],
        ["Agent", "A model plus instructions plus tools for knowledge and actions"],
      ],
    },
    {
      title: "Deploying models",
      items: [
        ["Global Standard", "The default. Pay per token, any region, newest models first"],
        ["Data Zone and Standard", "Data Zone keeps processing in a data zone. Standard keeps it in one Azure geography"],
        ["Provisioned", "Reserved PTUs for predictable throughput and steady response times"],
        ["Batch", "A file of requests run in the background. 50% cheaper, aims for 24 hours"],
        ["Deployment settings", "Deployment type, model version, and tokens-per-minute limit"],
        ["Request settings", "Temperature, max output tokens, and system instructions"],
      ],
    },
    {
      title: "Which capability?",
      items: [
        ["Chat, drafts, summaries", "A general-purpose model through the Responses API"],
        ["Actions with tools", "A Foundry agent with Code Interpreter, knowledge, or MCP tools"],
        ["Language code, PII redaction", "Azure Language in Foundry Tools"],
        ["Speech to text, text to speech", "Azure Speech in Foundry Tools"],
        ["Real-time voice agent", "Azure Speech Voice Live"],
        ["Questions about an image", "A vision-enabled multimodal model"],
        ["New images or video", "GPT-Image-1 family for images, Sora 2 for video"],
        ["Fields from documents, images, audio, video", "Azure Content Understanding"],
      ],
    },
    {
      title: "Guardrails and text and speech details",
      items: [
        ["Harm categories", "Hate, sexual, violence, self-harm, each scored safe, low, medium, or high"],
        ["Strictest filter", "Block from low upward. Blocking only high is the most lenient"],
        ["Prompt Shields", "User prompt attacks (jailbreaks) and indirect attacks hidden in documents"],
        ["Groundedness detection", "Flags answers that drift from the source material you supplied"],
        ["Filtered reply", "A blocked prompt returns an error. A filtered response has finish_reason content_filter"],
        ["Sentiment labels", "Positive, neutral, negative per sentence. Mixed for a document with both"],
        ["Summarization", "Extractive returns ranked original sentences. Abstractive writes new ones"],
        ["Recognition accuracy", "Custom speech model or a phrase list"],
        ["How speech sounds", "Neural voices and SSML for rate, pitch, pauses, pronunciation"],
        ["Speech translation", "Hear one language, return text or speech in another"],
      ],
    },
    {
      title: "Python quick reference",
      items: [
        ["Chat", "Create OpenAI(base_url, api_key), call client.responses.create(model=deployment, input=…), then read response.output_text"],
        ["Agent", "Create AIProjectClient(endpoint, DefaultAzureCredential()), call agents.get(), then get_openai_client() with an agent_reference"],
        ["Text", "TextAnalyticsClient with detect_language() and recognize_pii_entities()"],
        ["Speech", "SpeechConfig, then a SpeechRecognizer or SpeechSynthesizer.speak_text_async(text).get()"],
        ["Vision", "A content list with input_text and input_image (URL or base64)"],
        ["Image generation", "Add tools=[{\"type\": \"image_generation\"}], then read the image_generation_call result (base64)"],
        ["Extraction", "ContentUnderstandingClient.begin_analyze(analyzer_id, inputs), then poller.result()"],
      ],
    },
  ],

  boss: { name: "The Ungrounded Golem", emoji: "🗿" },
  matchLabel: "Microsoft Foundry services",
  levelTitles: [
    "Azure Apprentice",
    "Prompt Scribe",
    "Token Tinker",
    "Principle Keeper",
    "Model Scout",
    "Playground Pilot",
    "Agent Artisan",
    "Speech Smith",
    "Vision Weaver",
    "Foundry Master",
  ],
});
