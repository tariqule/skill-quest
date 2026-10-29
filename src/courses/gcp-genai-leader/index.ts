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
  tagline: "Generative AI strategy, responsible adoption, and Google Cloud's gen AI offerings, for business leaders in any role.",
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
      { icon: "📝", value: "50–60", label: "questions", detail: "Multiple choice. Our full simulation uses 60, the upper end of Google's range." },
      { icon: "⏱️", value: "90", label: "minutes", detail: "About 90 to 108 seconds per question." },
      {
        icon: "🎯",
        value: "70%",
        label: "practice target",
        detail: "Google reports pass/fail only and publishes no score scale or cut score. 70% is this course's practice target, not an official passing mark.",
      },
      { icon: "💵", value: "$99", label: "USD", detail: "Plus tax where applicable. No prerequisites." },
      { icon: "🌐", value: "4", label: "languages", detail: "English, Japanese, Spanish, and Portuguese." },
      { icon: "🖥️", value: "2", label: "ways to sit it", detail: "Online-proctored from a remote location, or onsite-proctored at a testing center." },
      {
        icon: "📅",
        value: "3",
        label: "years valid",
        detail: "Renew in the final year of validity by completing designated courses or skill badges in the renewal learning path; a renewal is valid for 1 year.",
      },
    ],
    candidate: {
      is: [
        "Anyone in any job role, with or without hands-on technical experience",
        "A leader who understands how gen AI can transform a business",
        "Someone with business-level knowledge of Google Cloud's gen AI offerings",
        "A person who can spot gen AI use cases across business functions and industries",
        "Able to talk gen AI with both technical and non-technical teams and influence initiatives",
      ],
      isNot: [
        "Writing code or implementing models",
        "Configuring or operating Google Cloud infrastructure",
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
      { icon: "🧭", tip: "This is a business exam. When two answers both work, pick the one that delivers value fastest with the least custom building." },
      {
        icon: "🏷️",
        tip: "The exam uses Google's current product names. Older training material may use earlier ones: NotebookLM is now Gemini Notebook, and Vertex AI-branded tools (Vertex AI, Vertex AI Search, Vertex AI Studio) and Agentspace correspond to Agent Platform, Agent Search, Agent Studio, and Gemini Enterprise. Always answer with the current names.",
      },
      { icon: "👤", tip: "Ask who the user is: employees at work (Gemini offerings), customers (Customer Engagement Suite, Agent Search), or builders (Agent Platform, APIs)." },
      { icon: "📎", tip: "Private company facts → ground in enterprise data. Fresh public facts → Grounding with Google Search. Style or specialised behaviour → consider fine-tuning." },
      { icon: "🧑‍⚖️", tip: "High stakes (health, finance, hiring) almost always means human in the loop, explainability, and accountability." },
      { icon: "✂️", tip: "Eliminate the clearly wrong options first, then compare the remaining two against the scenario's requirement words." },
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
        ["AI ⊃ ML ⊃ deep learning ⊃ gen AI", "Each is a subset of the one before. Gen AI creates new content."],
        ["Foundation model", "Trained on massive, diverse data; adaptable to many tasks"],
        ["LLM", "Foundation model for understanding and generating language"],
        ["Supervised · unsupervised · reinforcement", "Labeled data · find patterns · rewards and penalties"],
        ["ML lifecycle", "Ingest → prepare → train → deploy → manage"],
        ["Gen AI can…", "Create, summarize, discover, automate"],
        ["Landscape layers", "Infrastructure → models → platforms → agents → applications"],
      ],
    },
    {
      title: "Google models",
      items: [
        ["Gemini", "Multimodal understanding, conversation, content creation, Q&A"],
        ["Gemma", "Lightweight open models for customisation and local deployment"],
        ["Imagen", "Text-to-image diffusion model"],
        ["Veo", "Video from text or still images"],
        ["Gemini Nano", "Compact model that runs on devices"],
      ],
    },
    {
      title: "Which offering?",
      items: [
        ["Gemini app + Gems", "Personal assistant; Gems save custom instructions"],
        ["Gemini for Google Workspace", "Gen AI inside Gmail, Docs, Slides, Meet"],
        ["Gemini Enterprise", "Search across company data + custom agents for employees"],
        ["Gemini Notebook", "Research assistant grounded in your uploaded sources"],
        ["Conversational Agents · Agent Assist · Conversational Insights", "Bot for customers · help for live agents · analytics on conversations"],
        ["Agent Search", "Search and recommendations over your own data; prebuilt RAG"],
        ["Gemini Enterprise Agent Platform", "Unified ML platform: Model Garden, Model Builder, AutoML, custom agents"],
        ["Google AI Studio vs Agent Studio", "Free quick prototyping vs production at scale"],
      ],
    },
    {
      title: "Improving output",
      items: [
        ["Limitations", "Data dependency, knowledge cutoff, bias, fairness, hallucinations, edge cases"],
        ["Fixes", "Prompt engineering, grounding/RAG, fine-tuning, human in the loop"],
        ["Prompting", "Zero/one/few-shot, role, chaining, metaprompting, chain-of-thought, ReAct"],
        ["Grounding data", "First-party enterprise · third-party · world (Google Search)"],
        ["RAG", "Retrieve → augment → generate (→ iterate)"],
        ["Sampling", "Temperature (randomness), top-p, token count, output length, safety settings"],
        ["Monitoring", "Model Registry (versions), Model Monitoring (drift), Feature Store, Pipelines"],
      ],
    },
    {
      title: "Strategy, security, responsibility",
      items: [
        ["Strategy", "Top-down vision + bottom-up ideas; prioritise focused use cases"],
        ["Needs · resources", "Scale, customisation, interaction, privacy, latency, connectivity · people, money, time"],
        ["Impact", "Baseline KPIs before launch; compare after; keep improving"],
        ["SAIF", "Google's Secure AI Framework for managing AI security risk"],
        ["IAM · Security Command Center", "Who can access what · security posture visibility"],
        ["Responsible AI", "Transparency, accountability, explainability, fairness, privacy"],
        ["Anonymise vs pseudonymise", "Irreversible vs reversible with a separate key"],
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
