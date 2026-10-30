import { Flow, Ladder, Layers, ServiceRows, Tiles } from "@/components/learn/blocks";
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
      "Why companies pick Google Cloud for gen AI, the Gemini tools for everyday work, the tools that help you serve customers, Agent Platform for builders, and the tools and APIs that agents use.",
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
    // ───── Start here (beginner)
    {
      id: "d2-b-cloud",
      level: "beginner",
      task: "2.1",
      title: "What \"the cloud\" means",
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🏗️", title: "Without the cloud", text: "You buy servers, find a room for them, keep them cool and fix them when they break.", color: "#94a3b8" },
            { icon: "☁️", title: "With the cloud", text: "You rent computing power over the internet from a provider like Google, and pay for what you use.", color: "#ea4335" },
          ]}
        />
      ),
      points: [
        "\"The cloud\" means computers in someone else's data center that you use over the internet.",
        "It's like renting a fully equipped kitchen instead of building your own. You cook straight away and only pay for the hours you use.",
        "Google Cloud is Google's cloud. Besides raw computing power, it offers ready-made AI tools, so you don't have to build AI from scratch.",
      ],
      tip: "On this exam, \"Google Cloud\" is the company's cloud business. Products with \"Gemini\" in the name are its gen AI tools.",
      check: ["gail-b2-01", "gail-b2-02"],
    },
    {
      id: "d2-b-three-ways",
      level: "beginner",
      task: "2.4",
      title: "Three ways to get gen AI: use it, configure it, build it",
      visual: (
        <Ladder caption="more control and more effort as you climb"
          rungs={[
            { icon: "📱", name: "Use a finished app", text: "Type into the Gemini app or use Gemini inside Gmail. Nothing to build." },
            { icon: "🧰", name: "Configure a ready-made tool", text: "Point a search or chat tool at your own documents and switch it on." },
            { icon: "🛠️", name: "Build your own", text: "Developers pick a model on Agent Platform and build a custom app or agent." },
          ]}
        />
      ),
      points: [
        "Think of dinner. You can order a ready meal, hire a caterer and pick the menu, or cook from scratch in your own kitchen.",
        "Google's gen AI offerings follow the same pattern. Some you just use, some you set up for your company, and some you build with.",
        "The further you go toward building, the more control you get. You also need more time, skills and money.",
        "To try prompts with Gemini quickly and for free, developers use **Google AI Studio**, a web tool for prototyping with the Gemini API.",
      ],
      tip: "Many exam questions are really asking which rung fits. If the scenario says \"no technical staff\" or \"as fast as possible\", pick the lowest rung that works.",
      check: ["gail-b2-03", "gail-b2-04"],
      sources: [{ title: "Gemini API pricing", url: "https://ai.google.dev/gemini-api/docs/pricing", license: "CC BY 4.0" }],
    },
    {
      id: "d2-b-agent",
      level: "beginner",
      task: "2.5",
      title: "What an AI agent is",
      visual: (
        <Flow
          color="#ea4335"
          steps={[
            { icon: "🎯", label: "You set a goal", sub: "\"Book me a table for four on Friday\"" },
            { icon: "🧠", label: "It plans", sub: "Check the calendar, then find a restaurant" },
            { icon: "🔧", label: "It uses tools", sub: "Calendar, restaurant search, booking system" },
            { icon: "✅", label: "It reports back", sub: "\"Booked for 7pm at Luigi's\"" },
          ]}
        />
      ),
      points: [
        "A chatbot answers your question and stops there. An AI agent goes further: it takes a goal and does the steps to reach it.",
        "Picture a good personal assistant. You say \"sort out Friday dinner\" and they check your diary, call the restaurant and book it.",
        "Agents do that work through tools, which are connections to other systems, like a calendar, a database or a booking website.",
      ],
      tip: "If the scenario has the AI taking actions in other systems, not just replying, you're looking at an agent.",
      check: ["gail-b2-05", "gail-b2-06"],
    },

    // ───── Exam lessons
    {
      id: "d2-strengths",
      task: "2.1",
      title: "Why Google Cloud for gen AI",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🚀", title: "AI-first", text: "Gen AI is built into Google's products, and new research reaches customers quickly.", color: "#4285f4" },
              { icon: "🏢", title: "Enterprise-ready", text: "Responsible, secure, private, reliable and able to scale.", color: "#34a853" },
              { icon: "🌐", title: "Ecosystem", text: "Gen AI is built in across Google's products and services.", color: "#fbbc04" },
              { icon: "🔓", title: "Open approach", text: "Google, third-party and open models, so you have choice.", color: "#ea4335" },
              { icon: "🔐", title: "Your data, your control", text: "Security, privacy and governance over your own data and models.", color: "#a78bfa" },
              { icon: "🧑‍🤝‍🧑", title: "AI for everyone", text: "Low-code and no-code tools, pre-trained models and APIs.", color: "#38bdf8" },
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
        "A TPU is a chip Google designed just for machine learning. AI Hypercomputer bundles tuned hardware, software and flexible pricing for running AI work.",
        "Customers stay in control of their data. Google Cloud doesn't use it to train Google's models unless the customer gives permission.",
        "AppSheet and Apps Script bring Gemini to people who don't write much code.",
      ],
      tip: "When a scenario worries about being locked in to one vendor, or wants to mix models from different providers, the answer is usually the open approach and Model Garden.",
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
              { input: "Company-wide data and tasks", service: "Gemini Enterprise", output: "Company search and agents" },
              { input: "Your uploaded sources", service: "Gemini Notebook", output: "A research assistant that sticks to your sources" },
              { input: "Cloud code, BigQuery, security", service: "Gemini for Google Cloud", output: "Help building on Google Cloud" },
            ]}
          />
        </div>
      ),
      points: [
        "The Gemini app helps you write, summarise, translate and create images. Gemini Advanced adds extra features and protections.",
        "A Gem is a custom assistant inside Gemini that remembers your instructions. If you do the same task every week, you don't have to retype them.",
        "Gemini Enterprise gives employees search across company data in many formats, the Gemini Notebook API and custom agents.",
        "Gemini Notebook answers questions, writes summaries and suggests ideas, while sticking to the sources you upload.",
      ],
      tip: "Older material calls Gemini Notebook \"NotebookLM\", and calls what is now Gemini Enterprise \"Agentspace\". The exam uses the current names.",
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
              { icon: "💬", title: "Conversational Agents", text: "Virtual agents that chat with customers in everyday language, day and night.", color: "#ea4335" },
              { icon: "🎧", title: "Agent Assist", text: "Live suggestions and knowledge for human agents while they're on a call.", color: "#fbbc04" },
              { icon: "📊", title: "Conversational Insights", text: "Looks across customer conversations for trends, topics and mood.", color: "#34a853" },
              { icon: "☁️", title: "Contact Center as a Service", text: "A full contact center platform that runs in the cloud.", color: "#4285f4" },
            ]}
          />
          <div className="rounded-xl border border-sky-400/30 bg-sky-400/5 p-3 text-sm text-slate-200">
            🔎 <b className="text-sky-200">Agent Search</b> (on Gemini Enterprise Agent Platform) adds Google-quality search and recommendations to your own website
            or app. <b className="text-sky-200">Google Search</b> reaches customers on the open web.
          </div>
        </div>
      ),
      points: [
        "These four tools make up the Customer Engagement Suite. The study guide groups them as Gemini Enterprise for Customer Experience.",
        "A bot that talks to customers is Conversational Agents. Help for human staff during a call is Agent Assist. Analysis across many calls and chats is Conversational Insights.",
        "Agent Search powers search and recommendations for customers on your own website or app.",
        "Conversational Insights finds common topics and **sentiment** trends across thousands of customer calls and chats.",
      ],
      check: ["d2-16", "d2-17"],
      sources: [
        { title: "Topic modeling basics", url: "https://cloud.google.com/contact-center/insights/docs/topic-modeling-basics", license: "CC BY 4.0" },
        { title: "Sentiment analysis", url: "https://docs.cloud.google.com/contact-center/insights/docs/sentiment-analysis", license: "CC BY 4.0" },
      ],
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
              { icon: "📦", title: "Prebuilt RAG with Agent Search", text: "Ready-made search over your own data. Fastest to set up, with the least engineering.", color: "#34a853" },
              { icon: "🔧", title: "RAG APIs", text: "Build your own search pipeline piece by piece. More control, more work.", color: "#fbbc04" },
            ]}
          />
        </div>
      ),
      points: [
        "Agent Platform gives you access to gen AI models like Gemini. You can tune them there and deploy them for your apps.",
        "In Model Garden you pick a model that already exists. In Model Builder you train your own, either fully custom or with AutoML for the least effort.",
        "RAG means the model looks things up in your documents before it answers. Pick prebuilt RAG for speed, or the RAG APIs when engineers need fine control.",
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
              { icon: "🔌", title: "Extensions", text: "Connect to outside services through their APIs.", color: "#4285f4" },
              { icon: "⚙️", title: "Functions", text: "Describe a specific action the agent can take.", color: "#34a853" },
              { icon: "🗄️", title: "Data stores", text: "Give the agent information to look things up in.", color: "#fbbc04" },
              { icon: "🧩", title: "Plugins", text: "Add new skills and connections.", color: "#ea4335" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🛤️", title: "Deterministic", text: "Follows paths and actions set in advance. Very predictable." },
              { icon: "💭", title: "Generative", text: "Described in plain language and run by an LLM. Chatty and flexible." },
              { icon: "🔀", title: "Hybrid", text: "Both together: strict where it has to be, flexible everywhere else." },
            ]}
          />
        </div>
      ),
      points: [
        "A gen AI agent tries to reach a goal. It watches what's happening and takes action using the tools it has.",
        "An agent has three parts: a model that does the thinking, tools that let it act, and a reasoning loop that keeps it working toward the goal.",
        "Agents can use Google Cloud services as tools, such as Cloud Storage, databases, Cloud Run functions, Cloud Run and the pre-built AI APIs.",
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
              { input: "Formatted documents", service: "Document Translation API", output: "Translated, with the layout kept" },
              { input: "Forms, invoices", service: "Document AI API", output: "Extracted fields, summaries" },
              { input: "Images", service: "Cloud Vision API", output: "Objects, text, labels" },
              { input: "Video", service: "Video Intelligence API", output: "Searchable video insights" },
              { input: "Reviews, posts", service: "Natural Language API", output: "Sentiment, entities, categories" },
            ]}
          />
          <Tiles
            tiles={[
              { icon: "🧪", title: "Google AI Studio", text: "Free, for trying out ideas quickly with the Gemini API.", color: "#fbbc04" },
              { icon: "🏭", title: "Agent Studio", text: "Build and launch production-ready AI apps at scale on Agent Platform.", color: "#ea4335" },
            ]}
          />
          <ProductPickerLab />
        </div>
      ),
      points: [
        "Pre-built APIs give you an AI skill, like transcription or translation, with no model training. You can browse them in the Google Cloud API Library.",
        "Try ideas out in Google AI Studio. When you're ready for a real product at company scale, move to Agent Studio.",
        "Low-code and no-code tools (Apps Script, AppSheet) and developer tools (Cloud Run functions, Cloud Run) can all call the Gemini API.",
      ],
      tip: "Words like \"quick\", \"free\" or \"experiment\" point to Google AI Studio. Words like \"production\", \"at scale\" or \"enterprise\" point to Agent Studio.",
      check: ["d2-42", "d2-43"],
    },
  ],

  questions: [
    // ───── Start here (beginner)
    {
      id: "gail-b2-01",
      level: "beginner",
      domain: "d2",
      lesson: "d2-b-cloud",
      prompt: "A small business wants to run AI software without buying and looking after its own servers. What does the cloud let it do?",
      options: [
        "Rent computing power over the internet and pay for what it uses",
        "Get free servers delivered to its office and set up by the cloud company",
        "Run AI without any computers at all",
        "Keep all its data on one laptop",
      ],
      answer: [0],
      explanation:
        "The cloud is computers in a provider's data center that you use over the internet. You skip buying and maintaining hardware, and you pay for what you use, a bit like renting a kitchen by the hour.",
    },
    {
      id: "gail-b2-02",
      level: "beginner",
      domain: "d2",
      lesson: "d2-b-cloud",
      prompt: "Which of these is Google's family of gen AI models and assistants?",
      options: ["Gemini", "Pub/Sub", "BigQuery", "Cloud Storage"],
      answer: [0],
      explanation:
        "Gemini is the name Google uses for its gen AI models and the assistants built on them. Pub/Sub, BigQuery and Cloud Storage are Google Cloud services for moving, analysing and storing data.",
    },
    {
      id: "gail-b2-03",
      level: "beginner",
      domain: "d2",
      lesson: "d2-b-three-ways",
      prompt: "An office team with no technical staff wants AI help writing emails starting this week. What's the best approach?",
      options: [
        "Use a finished app, like Gemini in Gmail",
        "Hire engineers to build a custom model",
        "Train a new foundation model on their emails",
        "Buy their own AI chips",
      ],
      answer: [0],
      explanation:
        "A finished app needs nothing built, so the team can start right away. Custom models and your own hardware take months and specialist skills this team doesn't have.",
    },
    {
      id: "gail-b2-04",
      level: "beginner",
      domain: "d2",
      lesson: "d2-b-three-ways",
      prompt: "Why would a company choose to build its own AI app instead of using a finished one?",
      options: [
        "It needs more control over exactly how the app works",
        "Building is always cheaper",
        "Building is always faster",
        "Finished apps can't answer any of its questions",
      ],
      answer: [0],
      explanation:
        "Building gives you the most control, so you can shape the app to your exact needs. The trade-off is that it takes more time, skill and money than using something ready-made.",
    },
    {
      id: "gail-b2-05",
      level: "beginner",
      domain: "d2",
      lesson: "d2-b-agent",
      prompt: "What's the main difference between a simple chatbot and an AI agent?",
      options: [
        "An agent takes actions, using tools, to reach a goal",
        "An agent can only answer yes or no",
        "A chatbot always needs a human to type its replies",
        "There is no difference",
      ],
      answer: [0],
      explanation:
        "A chatbot replies to what you say. An agent works toward a goal and takes steps to get there, like checking a calendar and booking a meeting through connected tools.",
    },
    {
      id: "gail-b2-06",
      level: "beginner",
      domain: "d2",
      lesson: "d2-b-agent",
      prompt: "An agent books a meeting room by connecting to the company's calendar system. In agent terms, what is the calendar system?",
      options: ["A tool", "A prompt", "A label", "A training dataset"],
      answer: [0],
      explanation:
        "Tools are the connections an agent uses to act in other systems. The calendar is a tool here, because the agent uses it to get the job done.",
    },
    {
      id: "gail-b2-07",
      level: "beginner",
      domain: "d2",
      lesson: "d2-b-cloud",
      prompt: "A company stores private data in Google Cloud. Who controls that data?",
      options: [
        "The company does",
        "Anyone with a Google account",
        "The public, once it's in the cloud",
        "Nobody, it's shared automatically",
      ],
      answer: [0],
      explanation:
        "Customers keep control of their own data on Google Cloud. Google doesn't use it to train its models unless the customer gives permission.",
    },
    {
      id: "gail-b2-08",
      level: "beginner",
      domain: "d2",
      lesson: "d2-b-three-ways",
      prompt: "A developer wants to try a few prompt ideas with Gemini this afternoon, for free. Which tool is made for that?",
      options: ["Google AI Studio", "A custom-built data center", "Contact Center as a Service", "Model Registry"],
      answer: [0],
      explanation:
        "Google AI Studio is a free tool for trying ideas quickly with the Gemini API. It's the easy first step before anyone builds a full product.",
    },

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
        "Google focuses on building its own AI hardware rather than software, so customers must run models on TPUs they buy",
      ],
      answer: [0],
      explanation: "AI-first means AI is built into Google's products, and Google's focus on new research means customers get the latest advances quickly.",
    },
    {
      id: "d2-02",
      domain: "d2",
      lesson: "d2-strengths",
      prompt:
        "A retailer worried about vendor lock-in wants to evaluate Google models alongside third-party and open-source models on one platform. Which Google Cloud strength addresses this?",
      options: [
        "Its open approach, with Model Garden offering Google, third-party, and open models",
        "Its requirement that customers use a single proprietary model family for every workload",
        "Its consumer search engine",
        "Its on-premises-only deployment model",
      ],
      answer: [0],
      explanation: "Google Cloud's open approach gives you choice. Model Garden on Agent Platform lists Google, third-party and open-source models side by side.",
    },
    {
      id: "d2-03",
      domain: "d2",
      lesson: "d2-strengths",
      prompt: "Which Google-designed processor is purpose-built to accelerate machine learning training and inference?",
      options: ["Tensor Processing Unit (TPU)", "Central processing unit (CPU)", "Field-programmable gate array (FPGA)", "Network interface card (NIC)"],
      answer: [0],
      explanation: "TPUs are chips Google designed to speed up AI work. Along with GPUs, they're a core part of Google's AI-optimised infrastructure.",
    },
    {
      id: "d2-04",
      domain: "d2",
      lesson: "d2-strengths",
      prompt: "What is Google Cloud's AI Hypercomputer?",
      options: [
        "An integrated architecture of performance-optimised hardware, open software, and flexible consumption models for AI workloads",
        "A chatbot for Google Workspace",
        "A single physical supercomputer in one Google data center that customers must buy outright and then run on their own premises",
        "A framework for responsible AI governance",
      ],
      answer: [0],
      explanation: "AI Hypercomputer brings TPUs, GPUs, storage, networking and software together so AI work runs efficiently at large scale. It isn't one machine you buy.",
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
      explanation: "Google describes its enterprise-ready AI platform as responsible, secure, private, reliable and able to scale.",
    },
    {
      id: "d2-06",
      domain: "d2",
      lesson: "d2-strengths",
      prompt:
        "A pharmaceutical company asks whether its confidential prompts and data on Google Cloud will be used to train Google's foundation models. What is the BEST answer?",
      options: [
        "No. Customers control their data, and Google Cloud doesn't use it to train Google's models without the customer's permission",
        "Yes. All customer prompts and data are pooled to improve Google's own public models, unless the company pays for a premium tier",
        "Only if the data is unstructured",
        "Only if the company uses Gemma",
      ],
      answer: [0],
      explanation: "Customers keep control of their data, backed by security, privacy and governance controls. That's a core promise of Google Cloud's enterprise AI.",
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
      explanation: "Google Cloud opens AI up to non-coders with low-code and no-code tools, plus pre-trained models and APIs that work without any training.",
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
        "Grounding with Google Search, so answers always reflect the latest information",
      ],
      answer: [0],
      explanation: "AI on the edge runs right where the work happens, with no need for a good connection. Gemini Nano runs on the device itself, and LiteRT helps put models onto edge devices.",
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
      explanation: "Gemini for Google Workspace puts gen AI inside apps people already know, like Gmail, Docs, Slides and Meet.",
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
      explanation: "A Gem is a custom assistant in Gemini that keeps your instructions saved. She sets it up once and never retypes them, with no training needed.",
    },
    {
      id: "d2-10",
      domain: "d2",
      lesson: "d2-productivity",
      prompt:
        "A company wants employees to search across many internal data sources from one place and use AI agents, including custom ones, for everyday tasks. Which offering fits BEST?",
      options: ["Gemini Enterprise", "Gemini app", "Text-to-Speech API", "Contact Center as a Service"],
      answer: [0],
      explanation: "Gemini Enterprise lets employees search across company data in many formats from one place, and use custom agents for their work.",
    },
    {
      id: "d2-11",
      domain: "d2",
      lesson: "d2-productivity",
      prompt:
        "An analyst uploads 20 industry reports and wants summaries, answers that stay grounded in those reports, and an audio overview to listen to on the train. Which tool fits?",
      options: ["Gemini Notebook", "Veo", "Agent Platform Pipelines", "Security Command Center"],
      answer: [0],
      explanation: "Gemini Notebook works as a research assistant over the sources you upload. It sticks to those sources and can turn them into an audio summary.",
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
      explanation: "The exam guide lists three things for Gemini Enterprise: the Gemini Notebook API, search across many data formats, and custom agents.",
    },
    {
      id: "d2-13",
      domain: "d2",
      lesson: "d2-productivity",
      prompt:
        "A cloud operations team wants an AI assistant in Google Cloud that helps write and debug code, analyse data in BigQuery, and strengthen security posture. Which offering is this?",
      options: ["Gemini for Google Cloud", "Gemini for Google Workspace", "Gemini Notebook", "Conversational Agents"],
      answer: [0],
      explanation: "Gemini for Google Cloud is the assistant for people who build and run things on Google Cloud. Workspace is for office apps, not cloud operations.",
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
      explanation: "Each one fits a different kind of work: personal help, help inside office apps, company-wide search, research on your own files, or running Google Cloud.",
    },
    {
      id: "d2-15",
      domain: "d2",
      lesson: "d2-productivity",
      prompt: "A CFO asks for the main business value of Gemini for Google Workspace. Which answer is BEST?",
      options: [
        "Employees get gen AI help inside the apps they already use, cutting time spent on routine writing, summarising, and analysis",
        "It replaces the need for any data governance",
        "It trains a private foundation model on all of the company's email, so each employee gets a model that writes exactly like them",
        "It hosts the company's contact center",
      ],
      answer: [0],
      explanation: "The value is saving time in tools people already use. There's no new app to learn and no model to build.",
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
      explanation: "Agent Assist helps human agents while they're on a call. Conversational Agents talk to customers directly, and Conversational Insights analyses conversations afterwards.",
    },
    {
      id: "d2-17",
      domain: "d2",
      lesson: "d2-cx",
      prompt: "A bank wants to analyse thousands of customer calls and chats to find common complaint topics and sentiment trends. Which offering fits?",
      options: ["Conversational Insights", "Agent Assist", "Text-to-Speech voices", "Model Garden"],
      answer: [0],
      explanation: "Conversational Insights turns customer conversations into analysis, like the most common topics, trends over time and how customers feel.",
    },
    {
      id: "d2-18",
      domain: "d2",
      lesson: "d2-cx",
      prompt:
        "A telecom company wants a virtual agent that handles common customer requests, such as checking a bill, in natural language at any hour. Which offering fits?",
      options: ["Conversational Agents", "Agent Assist", "Conversational Insights", "Document AI API"],
      answer: [0],
      explanation: "Conversational Agents are virtual agents that talk to customers directly. The study guide calls this capability Customer Experience Agent Studio.",
    },
    {
      id: "d2-19",
      domain: "d2",
      lesson: "d2-cx",
      prompt:
        "A retailer wants to replace its ageing on-premises contact center with a cloud-native, enterprise-grade one that has AI built in. Which offering fits?",
      options: ["Google Cloud Contact Center as a Service", "Gemini for Google Workspace with Gmail and Meet", "Agent Platform AutoML", "Cloud Storage"],
      answer: [0],
      explanation: "Contact Center as a Service is Google Cloud's contact center that runs in the cloud. The other customer experience tools can be built on top of it.",
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
      explanation: "One is a bot for customers, one helps staff, one analyses conversations, and one is the platform they all run on.",
    },
    {
      id: "d2-21",
      domain: "d2",
      lesson: "d2-cx",
      prompt:
        "An online store wants Google-quality search and product recommendations on its own website, over its own catalog. Which offering fits BEST?",
      options: ["Agent Search", "Google Search advertising", "Conversational Insights", "Veo"],
      answer: [0],
      explanation: "Agent Search on Gemini Enterprise Agent Platform gives you search and recommendations over your own data, on your own website or app.",
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
      explanation: "Agent Search and Conversational Agents are what customers actually see. Security Command Center, Model Registry and Feature Store are behind-the-scenes tools.",
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
      explanation: "Agent Platform covers the whole ML workflow in one place, with infrastructure, tools, pre-trained models and MLOps.",
    },
    {
      id: "d2-25",
      domain: "d2",
      lesson: "d2-platform",
      prompt: "A team wants to browse and compare Google, third-party, and open-source models before picking one for its project. Where should it look?",
      options: ["Model Garden", "Model Registry", "Gemini app", "Cloud Vision API"],
      answer: [0],
      explanation: "Model Garden on Agent Platform is the catalogue where you pick from existing Google, third-party and open-source models. Model Registry tracks models you already have.",
    },
    {
      id: "d2-26",
      domain: "d2",
      lesson: "d2-platform",
      prompt:
        "Marketing analysts with limited ML expertise want to train a custom model on their own labeled data with minimal technical effort. Which option fits?",
      options: ["Agent Platform AutoML", "Fully custom training with an ML framework", "Gemini for Google Workspace", "Translation API"],
      answer: [0],
      explanation: "Agent Platform AutoML builds and trains a model for you, so you need very little ML knowledge or effort.",
    },
    {
      id: "d2-27",
      domain: "d2",
      lesson: "d2-platform",
      prompt:
        "An experienced data science team wants full control, training its own models at scale with its preferred ML framework on Google Cloud. Which option fits?",
      options: ["Custom training with Model Builder on Agent Platform", "Agent Platform AutoML", "A Gem in the Gemini app with custom instructions for the data scientists", "Agent Assist"],
      answer: [0],
      explanation: "Model Builder is for training your own models. You can go fully custom with your own ML framework, or use AutoML when you want less effort.",
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
      explanation:
        "Prebuilt RAG with Agent Search works out of the box. The RAG APIs give more control but take more engineering, and Google Search can't see private company policies.",
    },
    {
      id: "d2-29",
      domain: "d2",
      lesson: "d2-platform",
      prompt:
        "An engineering team building a specialised assistant needs fine control over how documents are chunked, retrieved, and ranked in its RAG pipeline. Which Google Cloud offering fits?",
      options: ["RAG APIs", "Prebuilt RAG with Agent Search", "The Gemini app", "Gemini for Google Workspace"],
      answer: [0],
      explanation: "The RAG APIs let developers build and control each step of their own search pipeline. Prebuilt RAG gives up that control in exchange for speed.",
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
      explanation: "Agent Platform lets you build, deploy and manage custom agents that connect to your own systems as tools.",
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
      explanation:
        "Using a finished app needs nothing built. Prebuilt RAG needs some setup, a custom agent needs development, and training your own model needs ML experts and data.",
    },

    // ───── d2-agents
    {
      id: "d2-32",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "Which description of a gen AI agent is MOST accurate?",
      options: [
        "An application that tries to achieve a goal by observing the world and acting on it with the tools available to it",
        "A static FAQ page that a model generates once from company documents and then publishes on the website for customers",
        "A database that stores model weights",
        "A dashboard that charts model accuracy",
      ],
      answer: [0],
      explanation: "An agent combines a model, tools and a reasoning loop to work toward a goal. It does more than give a single reply.",
    },
    {
      id: "d2-33",
      domain: "d2",
      lesson: "d2-agents",
      type: "order",
      prompt: "Put the steps of an agent's reasoning loop in order.",
      items: ["Observe", "Interpret", "Reason", "Act"],
      explanation: "The agent looks at what's around it, works out what that means, decides what to do next, and then acts, often with a tool. Then it goes round the loop again.",
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
      explanation: "Tools are how an agent reaches outside itself to get things done. Each type gives it a different way to do that.",
    },
    {
      id: "d2-35",
      domain: "d2",
      lesson: "d2-agents",
      prompt:
        "An airline's virtual agent must follow a strict, predefined flow to change bookings, but should also answer open-ended travel questions naturally. Which type of agent fits?",
      options: ["Hybrid agent", "Deterministic agent only", "Generative agent only", "No agent: a static web form"],
      answer: [0],
      explanation: "A hybrid agent uses fixed paths for tasks that must be controlled, like changing a booking. For everything else it uses an LLM to chat naturally.",
    },
    {
      id: "d2-36",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "A bank's identity verification step must follow exactly the same regulated sequence every time. Which agent type fits that step?",
      options: ["Deterministic agent", "Generative agent", "Diffusion model", "Unsupervised model"],
      answer: [0],
      explanation: "A deterministic agent follows paths and actions set in advance, so it does the same thing every time. That's what a regulated step needs.",
    },
    {
      id: "d2-37",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "What are the core components of a gen AI agent? (Choose three.)",
      options: ["A model", "Tools", "A reasoning loop", "A diffusion denoiser", "A labeled example for every possible request"],
      answer: [0, 1, 2],
      explanation:
        "The model does the thinking and the tools let the agent act. The reasoning loop keeps it cycling through observe, interpret, reason and act until the goal is met.",
    },
    {
      id: "d2-38",
      domain: "d2",
      lesson: "d2-agents",
      prompt:
        "A shopping agent needs to run a small piece of custom code, such as calculating shipping cost, whenever it is called, without the team managing servers. Which Google Cloud service fits as the tool?",
      options: ["Cloud Run functions", "Security Command Center", "Gemini Notebook", "Conversational Insights"],
      answer: [0],
      explanation: "Cloud Run functions, and Cloud Run, run your code only when it's needed, with no servers to manage. That makes them handy agent tools for custom actions.",
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
      explanation: "Each pre-built API gives you one AI skill without training a model, and agents can use them as tools.",
    },
    {
      id: "d2-40",
      domain: "d2",
      lesson: "d2-apis",
      prompt: "A law firm must translate formatted contracts into Spanish while keeping the original layout. Which API fits BEST?",
      options: ["Document Translation API", "Speech-to-Text API", "Cloud Vision API", "Natural Language API"],
      answer: [0],
      explanation: "The Document Translation API translates formatted documents and keeps their layout intact.",
    },
    {
      id: "d2-41",
      domain: "d2",
      lesson: "d2-apis",
      prompt: "A consumer brand wants to know whether thousands of product reviews are positive or negative and which products they mention. Which API fits?",
      options: ["Natural Language API", "Text-to-Speech API", "Video Intelligence API", "Document Translation API"],
      answer: [0],
      explanation: "The Natural Language API reads free text and tells you its sentiment, what category it fits, and which things it mentions, like product names.",
    },
    {
      id: "d2-42",
      domain: "d2",
      lesson: "d2-apis",
      prompt: "A product manager wants to try out prompt ideas with the Gemini API this afternoon, free of charge, before any project is approved. Which tool fits?",
      options: ["Google AI Studio", "Agent Studio", "Contact Center as a Service", "Security Command Center"],
      answer: [0],
      explanation: "Google AI Studio is free and made for trying ideas quickly. Agent Studio is for production-ready apps at scale.",
    },
    {
      id: "d2-43",
      domain: "d2",
      lesson: "d2-apis",
      prompt:
        "The prototype was approved. The company now needs to build and deploy a production-ready AI application at scale on Google Cloud with enterprise controls. Which tool fits?",
      options: ["Agent Studio", "Google AI Studio", "The Gemini app", "Gemini Notebook"],
      answer: [0],
      explanation: "Agent Studio on Agent Platform is for building and launching production-ready AI apps at scale, with the controls a company needs.",
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
      explanation: "Cloud Vision looks at what's in an image. It can tag objects and text, and it supports content moderation and visual search.",
    },
  ],

  cards: [
    { id: "d2-c01", domain: "d2", kind: "service", term: "Gemini Enterprise Agent Platform", definition: "Google Cloud's single ML platform for building, training, tuning and deploying ML and gen AI solutions." },
    { id: "d2-c02", domain: "d2", kind: "service", term: "Model Garden", definition: "The place on Agent Platform where you pick from Google, third-party and open-source models." },
    { id: "d2-c03", domain: "d2", kind: "service", term: "Agent Platform AutoML", definition: "Trains a custom model for you, with very little ML knowledge or effort." },
    { id: "d2-c04", domain: "d2", kind: "service", term: "Agent Search", definition: "Search and recommendations over your own data, including prebuilt RAG." },
    { id: "d2-c05", domain: "d2", kind: "service", term: "Gemini Enterprise", definition: "Company-wide search across data in many formats, plus custom agents for employees." },
    { id: "d2-c06", domain: "d2", kind: "service", term: "Gemini for Google Workspace", definition: "Gen AI inside Gmail, Docs, Slides, Meet and the other Workspace apps." },
    { id: "d2-c07", domain: "d2", kind: "service", term: "Gemini Notebook", definition: "A research assistant that sticks to the sources you upload." },
    { id: "d2-c08", domain: "d2", kind: "service", term: "Gems", definition: "Custom assistants in Gemini that follow instructions you've saved." },
    { id: "d2-c09", domain: "d2", kind: "service", term: "Gemini for Google Cloud", definition: "An AI assistant for writing code, analysing data in BigQuery and improving security on Google Cloud." },
    { id: "d2-c10", domain: "d2", kind: "service", term: "Conversational Agents", definition: "Virtual agents that talk to customers, part of the Customer Engagement Suite." },
    { id: "d2-c11", domain: "d2", kind: "service", term: "Agent Assist", definition: "Live suggestions and knowledge for human contact center agents during a call." },
    { id: "d2-c12", domain: "d2", kind: "service", term: "Conversational Insights", definition: "Analysis of customer conversations: common topics, trends and how customers feel." },
    { id: "d2-c13", domain: "d2", kind: "service", term: "Google AI Studio", definition: "A free tool for trying ideas quickly with the Gemini API." },
    { id: "d2-c14", domain: "d2", kind: "service", term: "Agent Studio", definition: "Builds and launches production-ready AI apps at scale." },
    { id: "d2-c15", domain: "d2", kind: "service", term: "Document AI API", definition: "Pulls data out of documents and automates document processing." },
    { id: "d2-c16", domain: "d2", kind: "service", term: "Document Translation API", definition: "Translates formatted documents and keeps their layout." },
    { id: "d2-c17", domain: "d2", kind: "service", term: "TPU", definition: "A chip Google designed to speed up ML training and inference." },
    {
      id: "d2-c18",
      domain: "d2",
      kind: "concept",
      term: "Agent tools",
      definition: "Extensions connect to outside APIs, functions define actions, data stores hold information, and plugins add new skills.",
    },
    { id: "d2-c19", domain: "d2", kind: "concept", term: "Hybrid agent", definition: "An agent that mixes fixed, predefined flows with flexible conversation run by an LLM." },
    { id: "d2-c20", domain: "d2", kind: "service", term: "Gemini Nano", definition: "Google's small Gemini model, built to run on a device." },
  ],

  challenges: [
    {
      id: "ch-product-picker",
      domain: "d2",
      lesson: "d2-apis",
      title: "Pick the right product",
      goal: "Match all seven business needs to the right Google Cloud offering on the first try.",
      hint: "Ask who the user is (an employee, a customer or a developer) and what they're doing (working in apps, searching, trying ideas or building).",
      takeaway: "Ready-made offerings serve people at work, the Customer Engagement Suite serves customers, and Agent Platform and the APIs serve builders.",
      render: (onSolved) => <ProductPickerLab goal="allCorrect" onSolved={onSolved} />,
    },
  ],
});
