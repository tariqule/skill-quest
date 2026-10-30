import { defineCourse } from "@/engine/define";
import d1 from "./domains/d1-genai-fundamentals";
import d2 from "./domains/d2-google-cloud-offerings";
import d3 from "./domains/d3-improve-model-output";
import d4 from "./domains/d4-business-strategy";

/**
 * Google Cloud Certified – Generative AI Leader.
 * Content follows the official exam guide and study guide as published in
 * October 2026, which use Google's current (rebranded) product names.
 * Domain content lives in ./domains; this file holds course-wide metadata.
 */
export default defineCourse({
  id: "gcp-genai-leader",
  provider: { id: "gcp", name: "Google Cloud", color: "#4285f4", icon: "🔷" },
  code: "GAIL",
  title: "Google Cloud Certified Generative AI Leader",
  shortTitle: "Generative AI Leader",
  tagline: "Learn how gen AI works, what Google Cloud offers and how to use it well. Made for business people in any role, no coding needed.",
  level: "Foundational",
  storageKey: "course:gcp-genai-leader:v1",

  domains: [d1, d2, d3, d4],

  exam: {
    // Google publishes "50-60 questions"; the simulator uses the upper bound.
    questions: 60,
    unscored: 0,
    minutes: 90,
    // Google reports pass/fail only. 70% is this course's practice target, not an official cut score.
    scale: { min: 0, max: 100, pass: 70 },
    questionTypes: [
      { id: "choice", icon: "🔘", name: "Multiple choice", rule: "1 correct answer. This is the format Google describes for the real exam." },
      { id: "multi", icon: "☑️", name: "Multiple response", rule: "Practice format: choose the number of answers the question asks for. All must be right.", practiceOnly: true },
      { id: "order", icon: "🔢", name: "Ordering", rule: "Practice format: put 3 to 5 steps in the right sequence.", practiceOnly: true },
      { id: "match", icon: "🔗", name: "Matching", rule: "Practice format: pair each prompt with its answer. Every pair must be right.", practiceOnly: true },
    ],
  },

  guide: {
    source: {
      label: "Google Cloud Generative AI Leader exam guide",
      version: "2026 refresh",
      date: "Retrieved October 2026",
      url: "https://services.google.com/fh/files/misc/generative_ai_leader_exam_guide_english.pdf",
    },
    facts: [
      { icon: "📝", value: "50–60", label: "questions", detail: "All multiple choice. Our full practice exam uses 60, the top of Google's range." },
      { icon: "⏱️", value: "90", label: "minutes", detail: "That gives you about 90 to 108 seconds for each question." },
      {
        icon: "🎯",
        value: "70%",
        label: "practice target",
        detail: "Google only tells you pass or fail, and doesn't publish a score scale or pass mark. 70% is this course's practice target, not an official mark.",
      },
      { icon: "💵", value: "$99", label: "USD", detail: "Plus tax where it applies. You don't need any other certification first." },
      { icon: "🌐", value: "4", label: "languages", detail: "English, Japanese, Spanish and Portuguese." },
      { icon: "🖥️", value: "2", label: "ways to sit it", detail: "Online with a remote proctor watching, or in person at a testing center." },
      {
        icon: "📅",
        value: "3",
        label: "years valid",
        detail: "In the last year, you can renew by finishing the courses or skill badges in the renewal learning path. A renewal lasts 1 year.",
      },
    ],
    candidate: {
      is: [
        "Anyone in any job role, whether or not you've done hands-on technical work",
        "A leader who understands how gen AI can change a business",
        "Someone who knows Google Cloud's gen AI offerings at a business level",
        "A person who can spot where gen AI helps, across business teams and industries",
        "Someone who can talk about gen AI with technical and non-technical teams, and help shape projects",
      ],
      isNot: [
        "Writing code or building models",
        "Setting up or running Google Cloud infrastructure",
        "Doing the maths behind machine learning",
        "Hands-on data engineering or MLOps",
      ],
    },
    scope: {
      label: "Google offerings named in the exam guide",
      groups: [
        { category: "Foundation models", icon: "🧠", services: ["Gemini", "Gemma", "Imagen", "Veo", "Gemini Nano"] },
        {
          category: "AI-powered work",
          icon: "💼",
          services: ["Gemini app", "Gemini Advanced", "Gems", "Gemini Enterprise", "Gemini Notebook", "Gemini for Google Workspace", "Gemini for Google Cloud"],
        },
        {
          category: "Customer experience",
          icon: "🎧",
          services: ["Agent Search", "Google Search", "Customer Engagement Suite", "Conversational Agents", "Agent Assist", "Conversational Insights", "Google Cloud Contact Center as a Service"],
        },
        {
          category: "Build with AI",
          icon: "🧰",
          services: [
            "Gemini Enterprise Agent Platform",
            "Model Garden",
            "Agent Platform AutoML",
            "Agent Studio",
            "Google AI Studio",
            "RAG APIs",
            "Grounding with Google Search",
            "Model Registry",
            "Model Monitoring",
            "Agent Platform Feature Store",
            "Agent Platform Pipelines",
          ],
        },
        {
          category: "Pre-built AI APIs",
          icon: "🔌",
          services: [
            "Speech-to-Text API",
            "Text-to-Speech API",
            "Translation API",
            "Document Translation API",
            "Document AI API",
            "Cloud Vision API",
            "Cloud Video Intelligence API",
            "Natural Language API",
            "Google Cloud API Library",
          ],
        },
        { category: "Agent tooling & compute", icon: "⚙️", services: ["Cloud Storage", "Databases", "Cloud Run functions", "Cloud Run"] },
        { category: "Infrastructure", icon: "🏗️", services: ["AI Hypercomputer", "TPUs", "GPUs", "Google data centers"] },
        { category: "Security & responsible AI", icon: "🛡️", services: ["Secure AI Framework (SAIF)", "Identity and Access Management (IAM)", "Security Command Center", "Workload monitoring tools"] },
      ],
    },
    tips: [
      { icon: "🧭", tip: "This is a business exam. When two answers would both work, pick the one that delivers value fastest with the least custom building." },
      {
        icon: "🏷️",
        tip: "The exam uses Google's current product names, but older study material may not. NotebookLM is now Gemini Notebook. Vertex AI, Vertex AI Search and Vertex AI Studio are now Agent Platform, Agent Search and Agent Studio, and Agentspace is now Gemini Enterprise. Always answer with the current names.",
      },
      { icon: "👤", tip: "Ask who the user is. Employees at work point to the Gemini offerings, customers point to the Customer Engagement Suite and Agent Search, and builders point to Agent Platform and the APIs." },
      { icon: "📎", tip: "For private company facts, ground in your company's data. For fresh public facts, use Grounding with Google Search. For a particular style or specialist behaviour, consider fine-tuning." },
      { icon: "🧑‍⚖️", tip: "When the stakes are high, like health, money or hiring, the answer almost always includes human review, explainability and a clear owner." },
      { icon: "✂️", tip: "Cross out the answers that are clearly wrong first. Then check the last two against the requirement words in the scenario." },
    ],
    officialPractice: {
      label: "official Generative AI Leader sample questions",
      url: "https://forms.gle/soztS7Q74AXBncATA",
    },
  },

  cheatsheet: [
    {
      title: "Core concepts",
      items: [
        ["AI, ML, deep learning, gen AI", "Each one sits inside the one before. Gen AI is the part that creates new content."],
        ["Foundation model", "Trained on a huge, varied dataset, so it can be adapted to many tasks"],
        ["LLM", "A foundation model for understanding and writing language"],
        ["Supervised, unsupervised, reinforcement", "Learns from labeled data, finds patterns on its own, or learns from rewards and penalties"],
        ["ML lifecycle", "Ingest, prepare, train, deploy, then manage"],
        ["What gen AI can do", "Create, summarize, discover and automate"],
        ["Landscape layers", "From the bottom: infrastructure, models, platforms, agents, applications"],
      ],
    },
    {
      title: "Google models",
      items: [
        ["Gemini", "Understands many kinds of input; good at conversation, content and answering questions"],
        ["Gemma", "Lightweight open models you can customise and run locally"],
        ["Imagen", "Text-to-image diffusion model"],
        ["Veo", "Makes video from text or a still image"],
        ["Gemini Nano", "A small model that runs on the device"],
      ],
    },
    {
      title: "Which offering?",
      items: [
        ["Gemini app and Gems", "A personal assistant. Gems save your custom instructions."],
        ["Gemini for Google Workspace", "Gen AI inside Gmail, Docs, Slides and Meet"],
        ["Gemini Enterprise", "Search across company data, plus custom agents for employees"],
        ["Gemini Notebook", "A research assistant that sticks to the sources you upload"],
        ["Conversational Agents, Agent Assist, Conversational Insights", "A bot for customers, help for human agents on a call, and analysis of conversations"],
        ["Agent Search", "Search and recommendations over your own data, including prebuilt RAG"],
        ["Gemini Enterprise Agent Platform", "The single ML platform: Model Garden, Model Builder, AutoML and custom agents"],
        ["Google AI Studio or Agent Studio", "Free, quick experiments in AI Studio; production at scale in Agent Studio"],
      ],
    },
    {
      title: "Improving output",
      items: [
        ["Limitations", "Data dependency, knowledge cutoff, bias, fairness, hallucinations and edge cases"],
        ["Fixes", "Prompt engineering, grounding and RAG, fine-tuning, and human in the loop"],
        ["Prompting", "Zero-shot, one-shot, few-shot, role, chaining, metaprompting, chain-of-thought and ReAct"],
        ["Grounding data", "Your own enterprise data, third-party data, or world data from Google Search"],
        ["RAG", "Retrieve, augment the prompt, generate, and retrieve again if needed"],
        ["Sampling", "Temperature (randomness), top-p, token count, output length and safety settings"],
        ["Monitoring", "Model Registry for versions, Model Monitoring for drift, plus Feature Store and Pipelines"],
      ],
    },
    {
      title: "Strategy, security, responsibility",
      items: [
        ["Strategy", "Leaders set the vision and employees bring ideas. Start with a few focused use cases."],
        ["Needs and resources", "Needs: scale, customisation, interaction, privacy, latency, connectivity. Resources: people, money, time."],
        ["Impact", "Record KPIs before launch, compare them after, and keep improving"],
        ["SAIF", "Google's Secure AI Framework for managing AI security risk"],
        ["IAM and Security Command Center", "IAM controls who can reach what. Security Command Center shows your security posture."],
        ["Responsible AI", "Transparency, accountability, explainability, fairness and privacy"],
        ["Anonymise or pseudonymise", "Anonymising can't be undone. Pseudonymising can, with a key kept somewhere else."],
      ],
    },
  ],

  boss: { name: "The Ungrounded Oracle", emoji: "🔮" },
  matchLabel: "Google Cloud AI products",
  levelTitles: [
    "AI Curious",
    "Prompt Scout",
    "Gem Crafter",
    "Data Steward",
    "Model Gardener",
    "Grounding Guide",
    "Agent Strategist",
    "Responsible Champion",
    "Gen AI Leader",
    "AI-First Visionary",
  ],
});
