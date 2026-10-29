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
  tagline: "AI concepts, responsible AI, and building generative AI, agent, text, speech, vision, and extraction solutions with Microsoft Foundry.",
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
        detail: "Microsoft doesn't publish an exact count for AI-901; most of its exams have 40 to 60. Our full simulation uses 45.",
      },
      { icon: "⏱️", value: "45", label: "minutes", detail: "Fundamentals exam time. Plan for 65 minutes of seat time, including instructions and the candidate agreement." },
      {
        icon: "🎯",
        value: "700",
        label: "to pass",
        detail: "Scaled score from 1 to 1,000. A scaled score isn't a percentage, so 700 may not mean 70% of the points.",
      },
      { icon: "🎲", value: "0", label: "guess penalty", detail: "Wrong answers cost nothing, and multi-part questions usually give one point per correct part. Never leave a blank." },
      { icon: "🧪", value: "?", label: "unscored items", detail: "Some questions may be unscored trial items. You can't tell which, so answer every one as if it counts." },
      { icon: "🐍", value: "Python", label: "basics expected", detail: "New in AI-901: know Python syntax and be familiar with REST APIs, SDKs, CLIs, and Azure resources." },
      { icon: "🌐", value: "13", label: "languages", detail: "English first; localized versions update about eight weeks after English changes." },
      { icon: "♾️", value: "No", label: "expiry", detail: "Fundamentals certifications don't expire, so there's no annual renewal." },
    ],
    candidate: {
      is: [
        "At the beginning of a career in AI solution development",
        "Someone with conceptual knowledge of AI solutions in Azure",
        "Able to read and write basic Python",
        "Familiar with Azure resources, REST APIs, SDKs, and CLIs",
        "Ready to build lightweight apps and agents with Microsoft Foundry",
      ],
      isNot: [
        "Training foundation models or tuning neural networks",
        "Doing the maths behind machine learning",
        "Designing enterprise-scale architectures or MLOps pipelines",
        "Allowed to browse Microsoft Learn during the exam (fundamentals exams don't offer it)",
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
        tip: "AI-901 uses Microsoft's current names. Older AI-900 material says Azure AI Foundry, Azure AI services, or Cognitive Services; today it's Microsoft Foundry and Foundry Tools (for example Azure Speech in Foundry Tools).",
      },
      { icon: "⚖️", tip: "Deterministic, structured output (codes, scores, redacted text) points to a Foundry Tool. Flexible, conversational output points to a general-purpose model." },
      { icon: "🐍", tip: "Expect short Python snippets. Know which package and client each capability uses, and that model= takes your deployment name." },
      { icon: "🤖", tip: "Agent = model + instructions + tools. Knowledge is context; tools are actions." },
      { icon: "🧾", tip: "Fields from documents, images, audio, or video means Azure Content Understanding: schemas, analyzers, and asynchronous analysis." },
      { icon: "🎲", tip: "There's no penalty for guessing. Mark hard questions for review and come back to them." },
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
        ["Fairness", "Minimize bias in data; test outputs across groups"],
        ["Reliability and safety", "AI is probabilistic: confidence thresholds, testing, content filters"],
        ["Privacy and security", "Protect data; delete what you no longer need; limit access"],
        ["Inclusiveness", "No one left out, for example captions on speech apps"],
        ["Transparency", "Disclose AI use, how it works, and its limits"],
        ["Accountability", "Governance framework; people answer for the AI"],
      ],
    },
    {
      title: "How generative models work",
      items: [
        ["Token", "Word, sub-word, or punctuation with an ID"],
        ["Embedding", "Meaning as a vector; compare with cosine similarity"],
        ["Transformer", "Encoder + attention builds embeddings; decoder predicts the next token"],
        ["LLM vs SLM", "Broad and powerful vs compact, focused, on-device"],
        ["Agent", "Model + instructions + tools (knowledge and actions)"],
      ],
    },
    {
      title: "Deploying models",
      items: [
        ["Global Standard", "Default: pay per token, any region, newest models first"],
        ["Data Zone / Standard", "Keep processing in a data zone / one Azure geography"],
        ["Provisioned", "Reserved PTUs: predictable throughput, low latency variance"],
        ["Batch", "Async file of requests: 50% cheaper, 24-hour target"],
        ["Settings", "Deployment type, model version, tokens-per-minute limit"],
        ["Parameters", "Temperature, max output tokens, system instructions"],
      ],
    },
    {
      title: "Which capability?",
      items: [
        ["Chat, drafts, summaries", "General-purpose model via the Responses API"],
        ["Actions with tools", "Foundry agent (Code Interpreter, knowledge, MCP tools)"],
        ["Language code, PII redaction", "Azure Language in Foundry Tools"],
        ["Speech to text, text to speech", "Azure Speech in Foundry Tools"],
        ["Real-time voice agent", "Azure Speech Voice Live"],
        ["Questions about an image", "Vision-enabled multimodal model"],
        ["New images · new video", "GPT-Image-1 family · Sora 2"],
        ["Fields from documents, images, audio, video", "Azure Content Understanding"],
      ],
    },
    {
      title: "Python quick reference",
      items: [
        ["Chat", "OpenAI(base_url, api_key) → client.responses.create(model=deployment, input=…) → response.output_text"],
        ["Agent", "AIProjectClient(endpoint, DefaultAzureCredential()) → agents.get() → get_openai_client() + agent_reference"],
        ["Text", "TextAnalyticsClient → detect_language(), recognize_pii_entities()"],
        ["Speech", "SpeechConfig → SpeechRecognizer / SpeechSynthesizer.speak_text_async(text).get()"],
        ["Vision", "content: input_text + input_image (URL or base64)"],
        ["Image generation", "tools=[{\"type\": \"image_generation\"}] → image_generation_call result (base64)"],
        ["Extraction", "ContentUnderstandingClient.begin_analyze(analyzer_id, inputs) → poller.result()"],
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
