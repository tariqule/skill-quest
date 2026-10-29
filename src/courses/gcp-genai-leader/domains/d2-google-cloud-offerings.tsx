import { Layers, ServiceRows, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { ProductPickerLab } from "../labs";
import { AgentAnatomy } from "../visuals";

/**
 * Section 2: Google Cloud's gen AI offerings (~35% of the exam).
 * Product names follow the current (rebranded) exam guide.
 */
export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "Google Cloud's gen AI offerings",
    world: "The Gemini Citadel",
    weight: 35,
    emoji: "♊",
    color: "#ea4335",
    summary:
      "Google Cloud's strengths, the Gemini productivity offerings, customer experience tools, Agent Platform for builders, and the tools and APIs agents use.",
  },

  tasks: [
    {
      id: "2.1",
      title: "Google Cloud's strengths in gen AI",
      covers: [
        "Google's AI-first approach and commitment to innovation",
        "An enterprise-ready AI platform: responsible, secure, private, reliable, scalable",
        "A comprehensive ecosystem with gen AI integrated across Google products",
        "Google Cloud's open approach",
        "AI-optimised infrastructure: AI Hypercomputer, custom TPUs, GPUs, data centers",
        "Customer control over data, models, and solutions",
        "Democratising AI: low-code and no-code tools, pre-trained models, APIs",
      ],
    },
    {
      id: "2.2",
      title: "Prebuilt offerings for AI-powered work",
      covers: [
        "The Gemini app and Gemini Advanced, including Gems",
        "Gemini Enterprise: Gemini Notebook API, multimodal search, custom agents",
        "Gemini for Google Workspace",
      ],
    },
    {
      id: "2.3",
      title: "Offerings that improve the customer experience",
      covers: [
        "External search: Agent Search on Gemini Enterprise Agent Platform, Google Search",
        "Customer Engagement Suite: Conversational Agents, Agent Assist, Conversational Insights, Google Cloud Contact Center as a Service",
      ],
    },
    {
      id: "2.4",
      title: "How Google Cloud empowers developers to build with AI",
      covers: [
        "Agent Platform: Model Garden, Agent Search, Agent Platform AutoML",
        "RAG offerings: prebuilt RAG with Agent Search, RAG APIs",
        "Building custom agents on Agent Platform",
      ],
    },
    {
      id: "2.5",
      title: "Purpose and types of tooling for gen AI agents",
      covers: [
        "How agents use tools: extensions, functions, data stores, plugins",
        "Google Cloud services and pre-built AI APIs for agent tooling",
        "When to use Agent Studio vs Google AI Studio",
      ],
    },
  ],

  lessons: [
    {
      id: "d2-strengths",
      task: "2.1",
      title: "Why Google Cloud for gen AI",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🚀", title: "AI-first", text: "Gen AI is built into Google's products, and research advances reach customers quickly.", color: "#4285f4" },
              { icon: "🏢", title: "Enterprise-ready", text: "Responsible, secure, private, reliable, and scalable.", color: "#34a853" },
              { icon: "🌐", title: "Ecosystem", text: "Gen AI integrated across Google products and services.", color: "#fbbc04" },
              { icon: "🔓", title: "Open approach", text: "Google, third-party, and open models: flexibility and choice.", color: "#ea4335" },
              { icon: "🔐", title: "Your data, your control", text: "Security, privacy, and governance over your data and models.", color: "#a78bfa" },
              { icon: "🧑‍🤝‍🧑", title: "Democratised AI", text: "Low-code and no-code tools, pre-trained models, and APIs.", color: "#38bdf8" },
            ]}
          />
          <Layers
            layers={[
              { name: "AI-optimised infrastructure", color: "#4285f4", items: ["AI Hypercomputer", "Google-designed TPUs", "GPUs", "Global data centers", "Cloud computing"] },
              { name: "AI on the edge", color: "#34a853", items: ["Gemini Nano (on-device)", "LiteRT runtime"] },
            ]}
          />
        </div>
      ),
      points: [
        "TPUs are Google's custom-designed chips for ML. AI Hypercomputer combines optimised hardware, software, and flexible consumption for AI workloads.",
        "Customers keep control of their data: Google Cloud doesn't use it to train Google's models without permission.",
        "AppSheet and Apps Script bring Gemini to people who don't write much code.",
      ],
      tip: "When a scenario worries about vendor lock-in or wants to mix model providers, the answer is usually the open approach: Model Garden.",
      check: ["d2-02", "d2-03"],
    },
    {
      id: "d2-productivity",
      task: "2.2",
      title: "Gemini for everyday work",
      visual: (
        <div className="grid gap-4">
          <ServiceRows
            rows={[
              { input: "\"Draft, summarise, translate, make an image\"", service: "Gemini app", output: "A personal AI assistant" },
              { input: "Same instructions every week", service: "Gems", output: "A reusable custom expert" },
              { input: "Gmail, Docs, Slides, Meet", service: "Gemini for Google Workspace", output: "Help inside familiar apps" },
              { input: "Company-wide data and tasks", service: "Gemini Enterprise", output: "Enterprise search + agents" },
              { input: "Your uploaded sources", service: "Gemini Notebook", output: "Grounded research assistant" },
              { input: "Cloud code, BigQuery, security", service: "Gemini for Google Cloud", output: "Help building on Google Cloud" },
            ]}
          />
        </div>
      ),
      points: [
        "The Gemini app helps with writing, summarising, translating, and creating images. Gemini Advanced adds extra features and protections.",
        "Gems are custom AI assistants inside Gemini that remember specific instructions, so repeated workflows need no retyping.",
        "Gemini Enterprise brings multimodal search over company data, the Gemini Notebook API, and custom agents to employees.",
        "Gemini Notebook answers questions, summarises, and generates ideas while staying grounded in the sources you upload.",
      ],
      tip: "Older material calls Gemini Notebook \"NotebookLM\", and the agent workspace that is now Gemini Enterprise appeared as \"Agentspace\". The exam uses the current names.",
      check: ["d2-08", "d2-09"],
    },
    {
      id: "d2-cx",
      task: "2.3",
      title: "Better customer experiences",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "💬", title: "Conversational Agents", text: "Virtual agents that talk with customers in natural language, 24/7.", color: "#ea4335" },
              { icon: "🎧", title: "Agent Assist", text: "Real-time suggestions and knowledge for live human agents.", color: "#fbbc04" },
              { icon: "📊", title: "Conversational Insights", text: "Analyse customer conversations for trends, topics, and sentiment.", color: "#34a853" },
              { icon: "☁️", title: "Contact Center as a Service", text: "A cloud-native, enterprise-grade contact center platform.", color: "#4285f4" },
            ]}
          />
          <div className="rounded-xl border border-sky-400/30 bg-sky-400/5 p-3 text-sm text-slate-200">
            🔎 <b className="text-sky-200">Agent Search</b> (on Gemini Enterprise Agent Platform) adds Google-quality search and recommendations to your own website
            or app. <b className="text-sky-200">Google Search</b> reaches customers on the open web.
          </div>
        </div>
      ),
      points: [
        "These four make up the Customer Engagement Suite. The study guide groups them as Gemini Enterprise for Customer Experience.",
        "Customer-facing bot → Conversational Agents. Helping live human staff → Agent Assist. Analytics across calls and chats → Conversational Insights.",
        "Agent Search powers search and recommendations for customers on your own properties.",
      ],
      check: ["d2-16", "d2-17"],
    },
    {
      id: "d2-platform",
      task: "2.4",
      title: "Agent Platform: build with AI",
      visual: (
        <div className="grid gap-4">
          <Layers
            layers={[
              { name: "Gemini Enterprise Agent Platform", color: "#ea4335", items: ["Unified ML platform", "Build", "Train", "Tune", "Deploy", "MLOps"] },
              { name: "Models", color: "#a78bfa", items: ["Model Garden: Google, third-party, open models", "Model Builder: custom training", "Agent Platform AutoML"] },
              { name: "Search and RAG", color: "#34a853", items: ["Agent Search", "Prebuilt RAG with Agent Search", "RAG APIs"] },
              { name: "Agents", color: "#fbbc04", items: ["Build, deploy, and govern custom agents"] },
            ]}
          />
          <Tiles
            tiles={[
              { icon: "📦", title: "Prebuilt RAG with Agent Search", text: "Out-of-the-box retrieval over your data. Fastest, least engineering.", color: "#34a853" },
              { icon: "🔧", title: "RAG APIs", text: "Assemble your own retrieval pipeline. More control, more build effort.", color: "#fbbc04" },
            ]}
          />
        </div>
      ),
      points: [
        "Agent Platform gives access to gen AI models such as Gemini, lets you tune them, and deploys them.",
        "Model Garden: choose existing models. Model Builder: train your own, fully custom or with AutoML for minimal effort.",
        "Choose prebuilt RAG for speed, and the RAG APIs when engineers need fine control over retrieval.",
      ],
      tip: "If older material mentions Vertex AI or Vertex AI Search, look for Agent Platform and Agent Search in the current exam.",
      check: ["d2-25", "d2-28"],
    },
    {
      id: "d2-agents",
      task: "2.5",
      title: "How agents use tools",
      visual: (
        <div className="grid gap-4">
          <AgentAnatomy />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🔌", title: "Extensions", text: "Connect to external services through APIs.", color: "#4285f4" },
              { icon: "⚙️", title: "Functions", text: "Define specific actions or tasks.", color: "#34a853" },
              { icon: "🗄️", title: "Data stores", text: "Give the agent access to information.", color: "#fbbc04" },
              { icon: "🧩", title: "Plugins", text: "Add new skills and integrations.", color: "#ea4335" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🛤️", title: "Deterministic", text: "Predefined paths and actions. Predictable." },
              { icon: "💭", title: "Generative", text: "Defined in natural language with LLMs. Conversational." },
              { icon: "🔀", title: "Hybrid", text: "Both together: strict where needed, flexible elsewhere." },
            ]}
          />
        </div>
      ),
      points: [
        "A gen AI agent tries to reach a goal by observing the world and acting on it with the tools it has.",
        "Its components are a model (the brain), tools, and a reasoning loop.",
        "Agents can use Google Cloud services as tools: Cloud Storage, databases, Cloud Run functions, Cloud Run, and pre-built AI APIs.",
      ],
      check: ["d2-32", "d2-34"],
    },
    {
      id: "d2-apis",
      task: "2.5",
      title: "Pre-built AI APIs and the two Studios",
      visual: (
        <div className="grid gap-5">
          <ServiceRows
            rows={[
              { input: "Audio, video", service: "Speech-to-Text API", output: "Transcripts" },
              { input: "Text", service: "Text-to-Speech API", output: "Natural-sounding speech" },
              { input: "Text, sites, media", service: "Translation API", output: "Translations" },
              { input: "Formatted documents", service: "Document Translation API", output: "Translated, layout kept" },
              { input: "Forms, invoices", service: "Document AI API", output: "Extracted fields, summaries" },
              { input: "Images", service: "Cloud Vision API", output: "Objects, text, labels" },
              { input: "Video", service: "Video Intelligence API", output: "Searchable video insights" },
              { input: "Reviews, posts", service: "Natural Language API", output: "Sentiment, entities, categories" },
            ]}
          />
          <Tiles
            tiles={[
              { icon: "🧪", title: "Google AI Studio", text: "Free of charge, for quick prototyping with the Gemini API.", color: "#fbbc04" },
              { icon: "🏭", title: "Agent Studio", text: "Build and deploy production-ready AI applications at scale on Agent Platform.", color: "#ea4335" },
            ]}
          />
          <ProductPickerLab />
        </div>
      ),
      points: [
        "Pre-built APIs give AI capabilities with no model training. Browse them in the Google Cloud API Library.",
        "Prototype in Google AI Studio; move to Agent Studio for enterprise-scale production.",
        "Low-code and no-code options (Apps Script, AppSheet) and developer tools (Cloud Run functions, Cloud Run) can call the Gemini API.",
      ],
      tip: "\"Quick\", \"free\", or \"experiment\" points to Google AI Studio. \"Production\", \"at scale\", or \"enterprise\" points to Agent Studio.",
      check: ["d2-42", "d2-43"],
    },
  ],

  questions: [
    // ───── d2-strengths
    {
      id: "d2-01",
      domain: "d2",
      lesson: "d2-strengths",
      prompt: "A CIO asks what Google's \"AI-first\" approach means for her company in practice. Which answer is BEST?",
      options: [
        "Gen AI is integrated across Google's products and services, and new research advances reach customers quickly",
        "Customers must use only Google's own models",
        "AI replaces all human review of business decisions",
        "Google focuses on selling hardware rather than software",
      ],
      answer: [0],
      explanation: "AI-first means AI is built into Google's ecosystem, and its commitment to innovation keeps customers current with the latest advances.",
    },
    {
      id: "d2-02",
      domain: "d2",
      lesson: "d2-strengths",
      prompt:
        "A retailer worried about vendor lock-in wants to evaluate Google models alongside third-party and open-source models on one platform. Which Google Cloud strength addresses this?",
      options: [
        "Its open approach, with Model Garden offering Google, third-party, and open models",
        "Its requirement to use a single proprietary model",
        "Its consumer search engine",
        "Its on-premises-only deployment model",
      ],
      answer: [0],
      explanation: "Google Cloud's open approach gives flexibility and choice. Model Garden on Agent Platform lists Google, third-party, and open-source models.",
    },
    {
      id: "d2-03",
      domain: "d2",
      lesson: "d2-strengths",
      prompt: "Which Google-designed processor is purpose-built to accelerate machine learning training and inference?",
      options: ["Tensor Processing Unit (TPU)", "Central processing unit (CPU)", "Field-programmable gate array (FPGA)", "Network interface card (NIC)"],
      answer: [0],
      explanation: "TPUs are Google's custom-designed AI accelerators, a core part of its AI-optimised infrastructure alongside GPUs.",
    },
    {
      id: "d2-04",
      domain: "d2",
      lesson: "d2-strengths",
      prompt: "What is Google Cloud's AI Hypercomputer?",
      options: [
        "An integrated architecture of performance-optimised hardware, open software, and flexible consumption models for AI workloads",
        "A chatbot for Google Workspace",
        "A single physical supercomputer customers must buy",
        "A framework for responsible AI governance",
      ],
      answer: [0],
      explanation: "AI Hypercomputer brings together TPUs, GPUs, storage, networking, and software so AI workloads run efficiently at scale.",
    },
    {
      id: "d2-05",
      domain: "d2",
      lesson: "d2-strengths",
      prompt: "Which characteristics make Google Cloud's AI platform enterprise-ready? (Choose two.)",
      options: [
        "Security and privacy controls for enterprise data",
        "Scalability and reliability for production workloads",
        "Customers must build their own data centers",
        "Customer prompts are published to improve public models",
        "Access is limited to companies with ML research teams",
      ],
      answer: [0, 1],
      explanation: "Google describes its enterprise-ready AI platform as responsible, secure, private, reliable, and scalable.",
    },
    {
      id: "d2-06",
      domain: "d2",
      lesson: "d2-strengths",
      prompt:
        "A pharmaceutical company asks whether its confidential prompts and data on Google Cloud will be used to train Google's foundation models. What is the BEST answer?",
      options: [
        "No. Customers control their data, and Google Cloud doesn't use it to train Google's models without the customer's permission",
        "Yes. All customer data is pooled to improve public models",
        "Only if the data is unstructured",
        "Only if the company uses Gemma",
      ],
      answer: [0],
      explanation: "Customer control over data, backed by security, privacy, and governance controls, is a core part of Google Cloud's enterprise AI offering.",
    },
    {
      id: "d2-07",
      domain: "d2",
      lesson: "d2-strengths",
      prompt: "Business analysts with no coding background want to add gen AI to their work. How does Google Cloud make AI accessible to them? (Choose two.)",
      options: [
        "Low-code and no-code tools such as AppSheet",
        "Pre-trained models and APIs that need no model training",
        "Writing a custom deep learning framework",
        "Provisioning their own TPU clusters",
        "Labeling millions of examples before any use",
      ],
      answer: [0, 1],
      explanation: "Google Cloud democratises AI development with low-code and no-code tools, pre-trained models, and APIs.",
    },
    {
      id: "d2-45",
      domain: "d2",
      lesson: "d2-strengths",
      prompt:
        "A utility's field technicians need AI assistance on their devices in remote areas with unreliable connectivity. Which Google option is designed for this?",
      options: [
        "Gemini Nano, Google's compact model designed to run on devices",
        "Veo for video generation",
        "Conversational Insights",
        "Grounding with Google Search",
      ],
      answer: [0],
      explanation: "AI on the edge runs close to where the action happens. Gemini Nano runs on-device, and LiteRT helps deploy models to edge devices.",
    },

    // ───── d2-productivity
    {
      id: "d2-08",
      domain: "d2",
      lesson: "d2-productivity",
      prompt:
        "A sales team wants AI help drafting emails in Gmail, building slides with generated images, and summarising Meet calls, all inside the apps they already use. Which offering fits?",
      options: ["Gemini for Google Workspace", "Agent Platform AutoML", "Conversational Insights", "Cloud Vision API"],
      answer: [0],
      explanation: "Gemini for Google Workspace integrates gen AI into familiar apps such as Gmail, Docs, Slides, and Meet.",
    },
    {
      id: "d2-09",
      domain: "d2",
      lesson: "d2-productivity",
      prompt:
        "A recruiter pastes the same long instructions into Gemini every time she writes a job post in the company's voice. What is the SIMPLEST improvement?",
      options: [
        "Create a Gem with those instructions saved",
        "Fine-tune a model on Agent Platform",
        "Build a custom agent with the RAG APIs",
        "Switch to Google AI Studio",
      ],
      answer: [0],
      explanation: "Gems are custom AI assistants within Gemini that follow saved instructions, streamlining repeated workflows without any training.",
    },
    {
      id: "d2-10",
      domain: "d2",
      lesson: "d2-productivity",
      prompt:
        "A company wants employees to search across many internal data sources from one place and use AI agents, including custom ones, for everyday tasks. Which offering fits BEST?",
      options: ["Gemini Enterprise", "Gemini app", "Text-to-Speech API", "Contact Center as a Service"],
      answer: [0],
      explanation: "Gemini Enterprise provides multimodal search across enterprise data and custom agent capabilities for employees.",
    },
    {
      id: "d2-11",
      domain: "d2",
      lesson: "d2-productivity",
      prompt:
        "An analyst uploads 20 industry reports and wants summaries, answers that stay grounded in those reports, and an audio overview to listen to on the train. Which tool fits?",
      options: ["Gemini Notebook", "Veo", "Agent Platform Pipelines", "Security Command Center"],
      answer: [0],
      explanation: "Gemini Notebook acts as a research assistant over the sources you upload, and can generate audio summaries of them.",
    },
    {
      id: "d2-12",
      domain: "d2",
      lesson: "d2-productivity",
      prompt: "Which capabilities are part of Gemini Enterprise? (Choose two.)",
      options: [
        "Multimodal search across enterprise data",
        "Custom agent capabilities",
        "Purchasing dedicated TPU hardware",
        "Managing identity and access policies for Google Cloud resources",
        "Running telephony for a contact center",
      ],
      answer: [0, 1],
      explanation: "The exam guide highlights the Gemini Notebook API, multimodal search, and custom agent capabilities in Gemini Enterprise.",
    },
    {
      id: "d2-13",
      domain: "d2",
      lesson: "d2-productivity",
      prompt:
        "A cloud operations team wants an AI assistant in Google Cloud that helps write and debug code, analyse data in BigQuery, and strengthen security posture. Which offering is this?",
      options: ["Gemini for Google Cloud", "Gemini for Google Workspace", "Gemini Notebook", "Conversational Agents"],
      answer: [0],
      explanation: "Gemini for Google Cloud is the AI assistant for building on and operating Google Cloud.",
    },
    {
      id: "d2-14",
      domain: "d2",
      lesson: "d2-productivity",
      type: "match",
      prompt: "Match each Gemini offering to the need it serves.",
      pairs: [
        ["Gemini app", "A personal assistant to write, summarise, translate, and create images"],
        ["Gemini for Google Workspace", "Gen AI inside Gmail, Docs, Slides, and Meet"],
        ["Gemini Enterprise", "One place for employees to search company data and use agents"],
        ["Gemini Notebook", "A research assistant grounded in the files you upload"],
        ["Gemini for Google Cloud", "An assistant for building and operating on Google Cloud"],
      ],
      explanation: "Each offering targets a different kind of work: personal, in-app, company-wide, research, or cloud operations.",
    },
    {
      id: "d2-15",
      domain: "d2",
      lesson: "d2-productivity",
      prompt: "A CFO asks for the main business value of Gemini for Google Workspace. Which answer is BEST?",
      options: [
        "Employees get gen AI help inside the apps they already use, cutting time spent on routine writing, summarising, and analysis",
        "It replaces the need for any data governance",
        "It trains a custom foundation model on company email",
        "It hosts the company's contact center",
      ],
      answer: [0],
      explanation: "The value is productivity in familiar tools, with no new app to learn and no model to build.",
    },

    // ───── d2-cx
    {
      id: "d2-16",
      domain: "d2",
      lesson: "d2-cx",
      prompt:
        "A contact center wants live human agents to see suggested replies and relevant knowledge articles in real time during customer calls. Which offering fits?",
      options: ["Agent Assist", "Conversational Agents", "Conversational Insights", "Gemini Notebook"],
      answer: [0],
      explanation: "Agent Assist supports live human agents. Conversational Agents talk to customers directly, and Conversational Insights analyses conversations.",
    },
    {
      id: "d2-17",
      domain: "d2",
      lesson: "d2-cx",
      prompt: "A bank wants to analyse thousands of customer calls and chats to find common complaint topics and sentiment trends. Which offering fits?",
      options: ["Conversational Insights", "Agent Assist", "Text-to-Speech API", "Model Garden"],
      answer: [0],
      explanation: "Conversational Insights turns customer conversations into analytics such as topics, trends, and sentiment.",
    },
    {
      id: "d2-18",
      domain: "d2",
      lesson: "d2-cx",
      prompt:
        "A telecom company wants a virtual agent that handles common customer requests, such as checking a bill, in natural language at any hour. Which offering fits?",
      options: ["Conversational Agents", "Agent Assist", "Conversational Insights", "Document AI API"],
      answer: [0],
      explanation: "Conversational Agents act as customer-facing virtual agents. The study guide calls this capability Customer Experience Agent Studio.",
    },
    {
      id: "d2-19",
      domain: "d2",
      lesson: "d2-cx",
      prompt:
        "A retailer wants to replace its ageing on-premises contact center with a cloud-native, enterprise-grade one that has AI built in. Which offering fits?",
      options: ["Google Cloud Contact Center as a Service", "Gemini for Google Workspace", "Agent Platform AutoML", "Cloud Storage"],
      answer: [0],
      explanation: "Contact Center as a Service is Google Cloud's cloud-native contact center, and the other customer experience tools can be built on it.",
    },
    {
      id: "d2-20",
      domain: "d2",
      lesson: "d2-cx",
      type: "match",
      prompt: "Match each Customer Engagement Suite component to its job.",
      pairs: [
        ["Conversational Agents", "Virtual agents that talk directly with customers"],
        ["Agent Assist", "Real-time help for live human agents"],
        ["Conversational Insights", "Analytics across customer conversations"],
        ["Contact Center as a Service", "Cloud-native contact center platform"],
      ],
      explanation: "Bot for customers, help for staff, analytics on conversations, and the platform underneath.",
    },
    {
      id: "d2-21",
      domain: "d2",
      lesson: "d2-cx",
      prompt:
        "An online store wants Google-quality search and product recommendations on its own website, over its own catalog. Which offering fits BEST?",
      options: ["Agent Search", "Google Search advertising", "Conversational Insights", "Veo"],
      answer: [0],
      explanation: "Agent Search on Gemini Enterprise Agent Platform provides search and recommendation solutions over your own data and properties.",
    },
    {
      id: "d2-22",
      domain: "d2",
      lesson: "d2-cx",
      prompt: "A travel company wants to improve its customer experience with gen AI. Which offerings directly serve customers? (Choose two.)",
      options: [
        "Agent Search for search and recommendations on its website",
        "Conversational Agents to handle routine requests around the clock",
        "Security Command Center to answer customer questions",
        "Model Registry to store customer chats",
        "Agent Platform Feature Store to greet website visitors",
      ],
      answer: [0, 1],
      explanation: "Agent Search and Conversational Agents face customers. Security Command Center, Model Registry, and Feature Store are operations tools.",
    },

    // ───── d2-platform
    {
      id: "d2-24",
      domain: "d2",
      lesson: "d2-platform",
      prompt:
        "Which Google Cloud offering is the unified ML platform for building, training, tuning, and deploying ML and gen AI solutions, with access to models such as Gemini?",
      options: ["Gemini Enterprise Agent Platform", "Gemini for Google Workspace", "Google AI Studio", "Conversational Insights"],
      answer: [0],
      explanation: "Agent Platform streamlines the whole ML workflow with infrastructure, tools, pre-trained models, and MLOps.",
    },
    {
      id: "d2-25",
      domain: "d2",
      lesson: "d2-platform",
      prompt: "A team wants to browse and compare Google, third-party, and open-source models before picking one for its project. Where should it look?",
      options: ["Model Garden", "Model Registry", "Gemini app", "Cloud Vision API"],
      answer: [0],
      explanation: "Model Garden on Agent Platform lets you pick from existing Google, third-party, and open-source models.",
    },
    {
      id: "d2-26",
      domain: "d2",
      lesson: "d2-platform",
      prompt:
        "Marketing analysts with limited ML expertise want to train a custom model on their own labeled data with minimal technical effort. Which option fits?",
      options: ["Agent Platform AutoML", "Fully custom training with an ML framework", "Gemini for Google Workspace", "Translation API"],
      answer: [0],
      explanation: "Agent Platform AutoML creates and trains models with minimal technical knowledge and effort.",
    },
    {
      id: "d2-27",
      domain: "d2",
      lesson: "d2-platform",
      prompt:
        "An experienced data science team wants full control, training its own models at scale with its preferred ML framework on Google Cloud. Which option fits?",
      options: ["Custom training with Model Builder on Agent Platform", "Agent Platform AutoML", "A Gem in the Gemini app", "Agent Assist"],
      answer: [0],
      explanation: "Model Builder covers training your own models: fully custom with an ML framework, or AutoML for minimal effort.",
    },
    {
      id: "d2-28",
      domain: "d2",
      lesson: "d2-platform",
      prompt:
        "HR wants employees to ask questions about company policies and get answers drawn from the policy documents, with as little engineering as possible. Which approach fits BEST?",
      options: [
        "Prebuilt RAG with Agent Search over the policy documents",
        "Build a retrieval pipeline from scratch with the RAG APIs",
        "Fine-tune Gemini on the policy documents",
        "Ground answers with Google Search",
      ],
      answer: [0],
      explanation: "Prebuilt RAG with Agent Search is the out-of-the-box option. The RAG APIs offer more control but need more engineering, and Google Search can't see private policies.",
    },
    {
      id: "d2-29",
      domain: "d2",
      lesson: "d2-platform",
      prompt:
        "An engineering team building a specialised assistant needs fine control over how documents are chunked, retrieved, and ranked in its RAG pipeline. Which Google Cloud offering fits?",
      options: ["RAG APIs", "Prebuilt RAG with Agent Search", "The Gemini app", "Gemini for Google Workspace"],
      answer: [0],
      explanation: "The RAG APIs let developers assemble and control their own retrieval pipeline. Prebuilt RAG trades that control for speed.",
    },
    {
      id: "d2-30",
      domain: "d2",
      lesson: "d2-platform",
      prompt:
        "A logistics company wants an agent that checks its inventory systems and books shipments through internal APIs, deployed and governed at enterprise scale. What should it do?",
      options: [
        "Build a custom agent on Agent Platform",
        "Ask employees to use the Gemini app",
        "Generate the workflow with Veo",
        "Use the Natural Language API alone",
      ],
      answer: [0],
      explanation: "Agent Platform supports building, deploying, and managing custom agents that connect to your own systems as tools.",
    },
    {
      id: "d2-31",
      domain: "d2",
      lesson: "d2-platform",
      type: "order",
      prompt: "Order these ways to add gen AI from the LEAST to the MOST technical effort.",
      items: [
        "Employees use the Gemini app",
        "Configure prebuilt RAG with Agent Search over company documents",
        "Build a custom agent on Agent Platform",
        "Train a fully custom model with Model Builder",
      ],
      explanation: "Using a finished app needs no build. Prebuilt RAG needs configuration, a custom agent needs development, and custom training needs ML expertise and data.",
    },

    // ───── d2-agents
    {
      id: "d2-32",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "Which description of a gen AI agent is MOST accurate?",
      options: [
        "An application that tries to achieve a goal by observing the world and acting on it with the tools available to it",
        "A static FAQ page generated once by a model",
        "A database that stores model weights",
        "A dashboard that charts model accuracy",
      ],
      answer: [0],
      explanation: "Agents combine a model, tools, and a reasoning loop to pursue goals, not just produce single responses.",
    },
    {
      id: "d2-33",
      domain: "d2",
      lesson: "d2-agents",
      type: "order",
      prompt: "Put the steps of an agent's reasoning loop in order.",
      items: ["Observe", "Interpret", "Reason", "Act"],
      explanation: "The agent observes its environment, interprets what it sees, reasons about the next step, and acts, often with a tool, then loops.",
    },
    {
      id: "d2-34",
      domain: "d2",
      lesson: "d2-agents",
      type: "match",
      prompt: "Match each type of agent tool to its purpose.",
      pairs: [
        ["Extensions", "Connect to external services through APIs"],
        ["Functions", "Define specific actions or tasks"],
        ["Data stores", "Provide access to information"],
        ["Plugins", "Add new skills and integrations"],
      ],
      explanation: "Tools are how agents interact with the external environment and get tasks done.",
    },
    {
      id: "d2-35",
      domain: "d2",
      lesson: "d2-agents",
      prompt:
        "An airline's virtual agent must follow a strict, predefined flow to change bookings, but should also answer open-ended travel questions naturally. Which type of agent fits?",
      options: ["Hybrid agent", "Deterministic agent only", "Generative agent only", "No agent: a static web form"],
      answer: [0],
      explanation: "Hybrid agents combine deterministic paths for controlled tasks with generative, LLM-driven conversation for everything else.",
    },
    {
      id: "d2-36",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "A bank's identity verification step must follow exactly the same regulated sequence every time. Which agent type fits that step?",
      options: ["Deterministic agent", "Generative agent", "Diffusion model", "Unsupervised model"],
      answer: [0],
      explanation: "Deterministic (traditional) agents are built with predefined paths and actions, so they behave predictably.",
    },
    {
      id: "d2-37",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "What are the core components of a gen AI agent? (Choose three.)",
      options: ["A model", "Tools", "A reasoning loop", "A diffusion denoiser", "A labeled example for every possible request"],
      answer: [0, 1, 2],
      explanation: "The model is the brain, tools let the agent act, and the reasoning loop drives observe → interpret → reason → act.",
    },
    {
      id: "d2-38",
      domain: "d2",
      lesson: "d2-agents",
      prompt:
        "A shopping agent needs to run a small piece of custom code, such as calculating shipping cost, whenever it is called, without the team managing servers. Which Google Cloud service fits as the tool?",
      options: ["Cloud Run functions", "Security Command Center", "Gemini Notebook", "Conversational Insights"],
      answer: [0],
      explanation: "Cloud Run functions (and Cloud Run) run code on demand, so they make good agent tools for custom actions.",
    },

    // ───── d2-apis
    {
      id: "d2-39",
      domain: "d2",
      lesson: "d2-apis",
      type: "match",
      prompt: "Match each pre-built Google Cloud API to the job it does.",
      pairs: [
        ["Speech-to-Text API", "Transcribe recorded calls"],
        ["Text-to-Speech API", "Read responses aloud in a natural voice"],
        ["Document AI API", "Extract fields from scanned invoices"],
        ["Cloud Vision API", "Detect objects and text in photos"],
        ["Natural Language API", "Find sentiment and entities in reviews"],
        ["Video Intelligence API", "Make a video library searchable"],
      ],
      explanation: "Pre-built APIs deliver specific AI capabilities without training a model, and agents can use them as tools.",
    },
    {
      id: "d2-40",
      domain: "d2",
      lesson: "d2-apis",
      prompt: "A law firm must translate formatted contracts into Spanish while keeping the original layout. Which API fits BEST?",
      options: ["Document Translation API", "Speech-to-Text API", "Cloud Vision API", "Natural Language API"],
      answer: [0],
      explanation: "The Document Translation API translates formatted documents while preserving their layout.",
    },
    {
      id: "d2-41",
      domain: "d2",
      lesson: "d2-apis",
      prompt: "A consumer brand wants to know whether thousands of product reviews are positive or negative and which products they mention. Which API fits?",
      options: ["Natural Language API", "Text-to-Speech API", "Video Intelligence API", "Document Translation API"],
      answer: [0],
      explanation: "The Natural Language API derives insights from unstructured text: sentiment, classification, and entities.",
    },
    {
      id: "d2-42",
      domain: "d2",
      lesson: "d2-apis",
      prompt: "A product manager wants to try out prompt ideas with the Gemini API this afternoon, free of charge, before any project is approved. Which tool fits?",
      options: ["Google AI Studio", "Agent Studio", "Contact Center as a Service", "Security Command Center"],
      answer: [0],
      explanation: "Google AI Studio is free and built for quick AI prototyping. Agent Studio is for production-ready applications at scale.",
    },
    {
      id: "d2-43",
      domain: "d2",
      lesson: "d2-apis",
      prompt:
        "The prototype was approved. The company now needs to build and deploy a production-ready AI application at scale on Google Cloud with enterprise controls. Which tool fits?",
      options: ["Agent Studio", "Google AI Studio", "The Gemini app", "Gemini Notebook"],
      answer: [0],
      explanation: "Agent Studio on Agent Platform is for building and deploying production-ready AI applications at scale.",
    },
    {
      id: "d2-44",
      domain: "d2",
      lesson: "d2-apis",
      prompt: "A media company is evaluating the Cloud Vision API. Which tasks can it help with? (Choose two.)",
      options: [
        "Tagging images based on detected objects and text",
        "Supporting content moderation of uploaded images",
        "Translating formatted PDF contracts while keeping their layout",
        "Converting recorded speech into text",
        "Training a custom large language model",
      ],
      answer: [0, 1],
      explanation: "Cloud Vision analyses image content, tagging objects and text, and supports content moderation and visual search.",
    },
  ],

  cards: [
    { id: "d2-c01", domain: "d2", kind: "service", term: "Gemini Enterprise Agent Platform", definition: "Google Cloud's unified ML platform to build, train, tune, and deploy ML and gen AI solutions." },
    { id: "d2-c02", domain: "d2", kind: "service", term: "Model Garden", definition: "Choose from Google, third-party, and open-source models on Agent Platform." },
    { id: "d2-c03", domain: "d2", kind: "service", term: "Agent Platform AutoML", definition: "Train custom models with minimal technical knowledge and effort." },
    { id: "d2-c04", domain: "d2", kind: "service", term: "Agent Search", definition: "Search and recommendation over your own data, including prebuilt RAG." },
    { id: "d2-c05", domain: "d2", kind: "service", term: "Gemini Enterprise", definition: "Multimodal search over company data plus custom agents for employees." },
    { id: "d2-c06", domain: "d2", kind: "service", term: "Gemini for Google Workspace", definition: "Gen AI inside Gmail, Docs, Slides, Meet, and other Workspace apps." },
    { id: "d2-c07", domain: "d2", kind: "service", term: "Gemini Notebook", definition: "Research assistant that stays grounded in the sources you upload." },
    { id: "d2-c08", domain: "d2", kind: "service", term: "Gems", definition: "Custom AI assistants in Gemini that follow saved instructions." },
    { id: "d2-c09", domain: "d2", kind: "service", term: "Gemini for Google Cloud", definition: "AI assistant for code, BigQuery analysis, and security on Google Cloud." },
    { id: "d2-c10", domain: "d2", kind: "service", term: "Conversational Agents", definition: "Customer-facing virtual agents in the Customer Engagement Suite." },
    { id: "d2-c11", domain: "d2", kind: "service", term: "Agent Assist", definition: "Real-time suggestions and knowledge for live human contact center agents." },
    { id: "d2-c12", domain: "d2", kind: "service", term: "Conversational Insights", definition: "Analytics on customer conversations: topics, trends, sentiment." },
    { id: "d2-c13", domain: "d2", kind: "service", term: "Google AI Studio", definition: "Free tool for quick prototyping with the Gemini API." },
    { id: "d2-c14", domain: "d2", kind: "service", term: "Agent Studio", definition: "Build and deploy production-ready AI applications at scale." },
    { id: "d2-c15", domain: "d2", kind: "service", term: "Document AI API", definition: "Extract data from documents and automate document processing." },
    { id: "d2-c16", domain: "d2", kind: "service", term: "Document Translation API", definition: "Translate formatted documents while keeping their layout." },
    { id: "d2-c17", domain: "d2", kind: "service", term: "TPU", definition: "Google's custom-designed accelerator for ML training and inference." },
    { id: "d2-c18", domain: "d2", kind: "concept", term: "Agent tools", definition: "Extensions (external APIs), functions (actions), data stores (information), plugins (new skills)." },
    { id: "d2-c19", domain: "d2", kind: "concept", term: "Hybrid agent", definition: "Combines deterministic, predefined flows with generative, LLM-driven conversation." },
    { id: "d2-c20", domain: "d2", kind: "service", term: "Gemini Nano", definition: "Google's compact Gemini model designed to run on devices." },
  ],

  challenges: [
    {
      id: "ch-product-picker",
      domain: "d2",
      lesson: "d2-apis",
      title: "Pick the right product",
      goal: "Match all seven business needs to the right Google Cloud offering on the first try.",
      hint: "Ask who the user is (employee, customer, developer) and what they're doing (working in apps, searching, prototyping, building).",
      takeaway: "Prebuilt offerings serve people at work, Customer Engagement Suite serves customers, and Agent Platform and the APIs serve builders.",
      render: (onSolved) => <ProductPickerLab goal="allCorrect" onSolved={onSolved} />,
    },
  ],
});
