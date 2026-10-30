import { Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { GenAiNesting, LandscapeStack } from "../visuals";

/**
 * Section 1: Fundamentals of gen AI (~30% of the exam).
 * Add a question to `questions`, a flashcard to `cards`, or a mission to `lessons`;
 * `npm test` checks that ids are unique and references resolve.
 */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "Gen AI fundamentals",
    world: "The Foundation Fields",
    weight: 30,
    emoji: "🧠",
    color: "#4285f4",
    summary:
      "What gen AI is and how machines learn, why good data matters, the five layers that make up the gen AI landscape, and the foundation models Google offers.",
  },

  tasks: [
    {
      id: "1.1",
      title: "Core gen AI concepts and use cases",
      covers: [
        "AI, NLP, ML, gen AI, foundation models, multimodal models, diffusion models, LLMs, prompt tuning, prompt engineering",
        "ML approaches: supervised, unsupervised, reinforcement",
        "ML lifecycle stages (ingestion, preparation, training, deployment, management) and the Google Cloud tools for each",
        "Choosing a foundation model: modality, context window, security, availability and reliability, cost, performance, fine-tuning and customisation",
        "Business use cases where gen AI creates, summarises, discovers, and automates",
      ],
    },
    {
      id: "1.2",
      title: "Data types in gen AI and their business implications",
      covers: [
        "Data quality and accessibility: completeness, consistency, relevance, availability, cost, format",
        "Structured vs unstructured data, with real-world examples",
        "Labeled vs unlabeled data",
      ],
    },
    {
      id: "1.3",
      title: "Core layers of the gen AI landscape",
      covers: ["Infrastructure", "Models", "Platforms", "Agents", "Applications", "The business implications of each layer"],
    },
    {
      id: "1.4",
      title: "Use cases and strengths of Google's foundation models",
      covers: ["Gemini", "Gemma", "Imagen", "Veo"],
    },
  ],

  lessons: [
    // ───── Start here (beginner)
    {
      id: "d1-b-what-ai",
      level: "beginner",
      task: "1.1",
      title: "What AI is, in plain words",
      visual: (
        <Flow
          color="#4285f4"
          steps={[
            { icon: "📚", label: "Examples", sub: "Thousands of past emails, each marked spam or not spam" },
            { icon: "🏋️", label: "Training", sub: "The model studies the examples and spots patterns" },
            { icon: "🤖", label: "A trained model", sub: "It now carries those patterns around" },
            { icon: "📨", label: "Inference", sub: "A new email arrives, and the model says: spam" },
          ]}
        />
      ),
      points: [
        "Artificial intelligence (AI) is any computer system that does a job we'd normally expect to need a person, like reading a form or answering a question.",
        "Most modern AI is machine learning (ML). Instead of following rules someone wrote by hand, the system learns patterns from lots of examples.",
        "Think of a new hire at a help desk. Nobody gives them a rulebook for every case. They read hundreds of past tickets and learn what a good answer looks like.",
        "Training is when the model learns from examples. Inference is when you use the finished model on something new, like asking it to sort today's email.",
      ],
      tip: "When a question says a system \"learns from data\", that's machine learning. When it follows rules a person wrote, it isn't.",
      check: ["gail-b1-01", "gail-b1-02"],
    },
    {
      id: "d1-b-genai",
      level: "beginner",
      task: "1.1",
      title: "What makes generative AI different",
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🔍", title: "Traditional ML", text: "Looks at something and gives a label or a number. \"Is this email spam?\" \"What will sales be next month?\"", color: "#34a853" },
            { icon: "✨", title: "Generative AI", text: "Makes something new that didn't exist before. \"Write a reply to this email.\" \"Draw a logo for my bakery.\"", color: "#4285f4" },
          ]}
        />
      ),
      points: [
        "Generative AI (gen AI) is AI that creates new content: text, images, code, audio or video.",
        "Picture a chef who has tasted thousands of dishes. Ask for a new soup and they don't copy a recipe. They cook something new from everything they've learned.",
        "The model you talk to is called a foundation model. It was trained once on a huge mix of data, so it can help with many different jobs.",
        "You steer it with a prompt, which is simply the instruction or question you type in, like \"Summarise this report in three bullet points\".",
      ],
      tip: "If the output is brand new content, it's gen AI. If the output is a category or a forecast, it's traditional ML.",
      check: ["gail-b1-03", "gail-b1-04"],
    },
    {
      id: "d1-b-data",
      level: "beginner",
      task: "1.2",
      title: "Data: what AI learns from",
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "🗂️", title: "Neat data", text: "Rows and columns, like a spreadsheet of orders. This is called structured data.", color: "#4285f4" },
            { icon: "🌀", title: "Messy data", text: "Emails, photos, PDFs and phone recordings. This is called unstructured data.", color: "#fbbc04" },
          ]}
        />
      ),
      points: [
        "Data is the raw material AI learns from. It can be tidy tables, or a pile of documents, pictures and recordings.",
        "A model is only as good as what it learned from. If a cookbook has typos in every recipe, even a great cook will make mistakes.",
        "Some data comes with answers attached, like photos already tagged \"cat\" or \"dog\". That's called labeled data. Data without tags is unlabeled.",
      ],
      tip: "Bad data in means bad answers out. On the exam, when a project struggles, check the data first.",
      check: ["gail-b1-05", "gail-b1-06"],
    },

    // ───── Exam lessons
    {
      id: "d1-concepts",
      task: "1.1",
      title: "From AI to foundation models",
      visual: (
        <div className="grid gap-5">
          <GenAiNesting />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🗣️", title: "NLP", text: "AI that understands, interprets and writes human language.", color: "#4285f4" },
              { icon: "🎨", title: "Multimodal model", text: "Takes in and produces several kinds of data: text, images, audio, video and code.", color: "#34a853" },
              { icon: "🌫️", title: "Diffusion model", text: "Makes an image by cleaning up random noise, step by step. Imagen works this way.", color: "#fbbc04" },
              { icon: "✍️", title: "Prompt engineering", text: "Writing your input so the model gives the output you need. No training involved.", color: "#ea4335" },
              { icon: "🎛️", title: "Prompt tuning", text: "Learns a small set of prompt settings for one task. The model's own weights don't change.", color: "#a78bfa" },
              { icon: "📚", title: "LLM", text: "A foundation model built to understand and write human language.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "These ideas fit inside each other like nesting boxes. AI is the biggest box. Machine learning sits inside it, deep learning inside that, and generative AI inside deep learning.",
        "Gen AI creates new content. Traditional ML mostly sorts things into categories or predicts a number from existing data.",
        "A foundation model is trained on a huge, varied and mostly unlabeled dataset. That makes it useful for many jobs, and you can adapt it to a specialist field.",
        "You work with a foundation model through prompts. A prompt is the input you give it to guide what it produces.",
      ],
      tip: "Prompt engineering changes only what you type in. Prompt tuning and fine-tuning both involve training. If a question says \"no training\", the answer is prompt engineering.",
      check: ["d1-01", "d1-02"],
    },
    {
      id: "d1-ml",
      task: "1.1",
      title: "How machines learn, and the ML lifecycle",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🏷️", title: "Supervised", text: "Learns from examples that come with answers, then predicts the answer for new ones. \"Is this transaction fraud?\"", color: "#4285f4" },
              { icon: "🧩", title: "Unsupervised", text: "Gets data with no answers and finds natural groups on its own. \"What customer segments exist?\"", color: "#34a853" },
              { icon: "🎮", title: "Reinforcement", text: "Learns by trying things and getting feedback: points for good moves, penalties for bad ones.", color: "#fbbc04" },
            ]}
          />
          <Flow
            color="#4285f4"
            steps={[
              { icon: "📥", label: "Data ingestion", sub: "Collect the raw data: Cloud Storage, Pub/Sub, BigQuery" },
              { icon: "🧹", label: "Data preparation", sub: "Clean and reshape it: BigQuery, Dataflow" },
              { icon: "🏋️", label: "Model training", sub: "Agent Platform, with AutoML or custom training" },
              { icon: "🚀", label: "Model deployment", sub: "Make the trained model available to apps on Agent Platform" },
              { icon: "🔧", label: "Model management", sub: "Model Registry, Model Monitoring, Feature Store, Pipelines" },
            ]}
            loop="What you learn in management feeds new data and retraining"
          />
        </div>
      ),
      points: [
        "If every example in your data comes with the right answer, like transactions already marked \"fraud\", you're doing supervised learning.",
        "If the data has no answers and you want the model to find groups on its own, that's unsupervised learning. If it learns from rewards and penalties, that's reinforcement learning.",
        "A model goes through five stages. You collect data (ingestion), clean it (preparation), teach the model (training), put it to work (deployment) and look after it (management).",
        "Gemini Enterprise Agent Platform is Google Cloud's single ML platform. It covers training, deployment and management in one place.",
      ],
      check: ["d1-09", "d1-12"],
    },
    {
      id: "d1-choose",
      task: "1.1",
      title: "What gen AI can do, and choosing a model",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "✨", title: "Create", text: "Make new content: copy, images, code, video.", color: "#4285f4" },
              { icon: "📝", title: "Summarize", text: "Shrink long material into a short summary.", color: "#34a853" },
              { icon: "🔎", title: "Discover", text: "Find the right information at the right time.", color: "#fbbc04" },
              { icon: "⚙️", title: "Automate", text: "Take over a task people used to do by hand.", color: "#ea4335" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🎞️", title: "Modality", text: "Do the model's inputs and outputs (text, image, audio, video) fit the job?" },
              { icon: "📏", title: "Context window", text: "How much the model can read at once. A bigger window costs more compute." },
              { icon: "⚡", title: "Performance", text: "How accurate, fast and efficient it is, weighed against cost." },
              { icon: "💵", title: "Cost", text: "What each use costs at the volume you expect." },
              { icon: "🟢", title: "Availability & reliability", text: "Uptime promises, backup capacity, and how it copes when busy." },
              { icon: "🔐", title: "Security & customisation", text: "How your data is protected, and whether you can fine-tune or customise it." },
            ]}
          />
        </div>
      ),
      points: [
        "Most business uses of gen AI fit one of four verbs: create, summarize, discover or automate.",
        "For example, writing product copy is create. Turning a long report into a one-pager is summarize. Finding the right policy is discover. Filling in forms with no typing is automate.",
        "There's no single best model. You match it to the job by looking at modality, context window, performance, cost, availability, security and how much you can customise it.",
      ],
      tip: "The biggest model is rarely the right answer. Look for the requirement words in the question, like lowest cost, fastest, longest documents or must stay up.",
      check: ["d1-15", "d1-19"],
    },
    {
      id: "d1-data",
      task: "1.2",
      title: "Data: quality, access, and types",
      visual: (
        <div className="grid gap-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-sky-400/30 bg-sky-400/5 p-3">
              <div className="font-semibold text-sky-200">🗂️ Structured</div>
              <div className="text-sm text-slate-300">Organised and easy to search, often kept in a database.</div>
              <div className="mt-1 text-xs text-slate-400">Order tables, spreadsheets, CRM fields</div>
            </div>
            <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-3">
              <div className="font-semibold text-amber-200">🌀 Unstructured</div>
              <div className="text-sm text-slate-300">No set layout, so it takes smarter tools to make sense of it.</div>
              <div className="mt-1 text-xs text-slate-400">Emails, PDFs, photos, call recordings, video</div>
            </div>
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3">
              <div className="font-semibold text-emerald-200">🏷️ Labeled</div>
              <div className="text-sm text-slate-300">Each item carries a tag, such as a name, a type or a number.</div>
              <div className="mt-1 text-xs text-slate-400">X-rays tagged &quot;fracture&quot; or &quot;no fracture&quot;</div>
            </div>
            <div className="rounded-xl border border-violet-400/30 bg-violet-400/5 p-3">
              <div className="font-semibold text-violet-200">📦 Unlabeled</div>
              <div className="text-sm text-slate-300">Raw information with no tags.</div>
              <div className="mt-1 text-xs text-slate-400">Unsorted photo libraries, audio streams</div>
            </div>
          </div>
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧩", title: "Complete", text: "No missing fields or gaps.", color: "#34a853" },
              { icon: "🔁", title: "Consistent", text: "The same value is written the same way everywhere.", color: "#34a853" },
              { icon: "🎯", title: "Relevant", text: "It actually fits the problem you're solving.", color: "#34a853" },
              { icon: "🚪", title: "Available", text: "Teams can reach it. It isn't locked away in one department.", color: "#4285f4" },
              { icon: "💵", title: "Cost", text: "Affordable to collect, store and prepare.", color: "#4285f4" },
              { icon: "📐", title: "Format", text: "In a shape you can use for training or grounding.", color: "#4285f4" },
            ]}
          />
        </div>
      ),
      points: [
        "Good-quality data is accurate, complete, consistent and relevant. If the data is poor, the AI built on it will be poor too.",
        "Accessible data is data people and models can actually reach and use, in the right format.",
        "Most of a company's data is unstructured, like emails and documents. Gen AI is especially good at working with that kind of data.",
      ],
      check: ["d1-22", "d1-25"],
    },
    {
      id: "d1-layers",
      task: "1.3",
      title: "The five layers of the gen AI landscape",
      visual: <LandscapeStack />,
      points: [
        "From the bottom up, the five layers are infrastructure, models, platforms, agents and applications.",
        "Applications are what users touch. Agents work toward a goal using tools. Platforms give you APIs, data management and deployment tools.",
        "The higher layers give you value fastest. The lower layers give you more control, but they take more skill and effort.",
      ],
      tip: "Pick the layer from what the people in the scenario actually do: use a finished app, build an agent, tune a model, or set up hardware.",
      check: ["d1-30", "d1-31"],
    },
    {
      id: "d1-models",
      task: "1.4",
      title: "Google's foundation models",
      visual: (
        <Tiles
          cols={4}
          tiles={[
            { icon: "♊", title: "Gemini", text: "Understands many kinds of input, holds conversations, creates content and answers questions.", color: "#4285f4" },
            { icon: "💎", title: "Gemma", text: "Lightweight open models that developers can customise and run locally or in specialist apps.", color: "#34a853" },
            { icon: "🖼️", title: "Imagen", text: "Turns a text description into a high-quality image.", color: "#fbbc04" },
            { icon: "🎬", title: "Veo", text: "Makes video from a text description or a still image.", color: "#ea4335" },
          ]}
        />
      ),
      points: [
        "Gemini is Google's multimodal model family, meaning it handles text, images, audio and more. It powers many Google products.",
        "Gemma is the open-model choice when you need to customise the model or run it on your own machines.",
        "Imagen makes images and Veo makes video. Gemini Nano is the small Gemini model built to run on a device, like a phone.",
      ],
      check: ["d1-35", "d1-36"],
    },
  ],

  questions: [
    // ───── Start here (beginner)
    {
      id: "gail-b1-01",
      level: "beginner",
      domain: "d1",
      lesson: "d1-b-what-ai",
      prompt: "A system gets better at spotting spam by studying thousands of emails that people already marked as spam or not spam. What is this?",
      options: ["Machine learning", "A list of rules a person wrote by hand", "A spreadsheet formula", "A search engine"],
      answer: [0],
      explanation:
        "Learning patterns from examples is exactly what machine learning means. Nobody wrote a rule for every kind of spam. The system worked the patterns out from the data.",
    },
    {
      id: "gail-b1-02",
      level: "beginner",
      domain: "d1",
      lesson: "d1-b-what-ai",
      prompt: "A finished model is given a brand-new photo and asked what's in it. What is this step called?",
      options: ["Inference", "Training", "Data collection", "Labeling"],
      answer: [0],
      explanation:
        "Inference is when you use a model that has already been trained. Training happened earlier, when the model learned from examples. Now it's just putting that learning to work.",
    },
    {
      id: "gail-b1-03",
      level: "beginner",
      domain: "d1",
      lesson: "d1-b-genai",
      prompt: "Which of these is a job for generative AI?",
      options: [
        "Writing a first draft of a welcome email for new customers",
        "Deciding whether a credit card payment looks like fraud",
        "Predicting how many umbrellas will sell next week",
        "Sorting support tickets into \"billing\" or \"technical\"",
      ],
      answer: [0],
      explanation:
        "Generative AI creates new content, and a fresh email draft is new content. The other three take existing data and give back a label or a number, which is what traditional ML does.",
    },
    {
      id: "gail-b1-04",
      level: "beginner",
      domain: "d1",
      lesson: "d1-b-genai",
      prompt: "You type \"Summarise this meeting transcript in five bullet points\" into a gen AI tool. What is the text you typed called?",
      options: ["A prompt", "A label", "A dataset", "A model"],
      answer: [0],
      explanation:
        "A prompt is the instruction or question you give a gen AI model. Writing clear prompts is the main way you steer what the model produces.",
    },
    {
      id: "gail-b1-05",
      level: "beginner",
      domain: "d1",
      lesson: "d1-b-data",
      prompt: "Which of these is unstructured data?",
      options: ["A folder of scanned customer letters", "A spreadsheet of product prices", "A table of orders with fixed columns", "A list of employee ID numbers"],
      answer: [0],
      explanation:
        "Scanned letters don't follow a fixed layout of rows and columns, so they're unstructured. Spreadsheets, tables and ID lists are all neatly organised, which makes them structured.",
    },
    {
      id: "gail-b1-06",
      level: "beginner",
      domain: "d1",
      lesson: "d1-b-data",
      prompt: "A clinic has 5,000 skin photos, and a doctor has tagged each one \"healthy\" or \"needs a check\". What kind of data is this?",
      options: ["Labeled data", "Unlabeled data", "Unstructured text", "Random data"],
      answer: [0],
      explanation:
        "Each photo carries a tag that gives the answer, so it's labeled data. Labeled data is what you need to teach a model to give that same answer for new photos.",
    },
    {
      id: "gail-b1-07",
      level: "beginner",
      domain: "d1",
      lesson: "d1-b-genai",
      prompt: "What is a foundation model?",
      options: [
        "A large model trained once on lots of varied data, so it can help with many different tasks",
        "A small model built for exactly one task, like checking postcodes, that can't be reused for anything else",
        "The database where a company keeps its customer records",
        "A set of rules that tells a computer what to do step by step",
      ],
      answer: [0],
      explanation:
        "A foundation model is trained on a huge mix of data, which gives it broad skills. That's why one model can write emails, answer questions and summarise documents.",
    },
    {
      id: "gail-b1-08",
      level: "beginner",
      domain: "d1",
      lesson: "d1-b-data",
      prompt: "A team trains a model on customer records full of typos, gaps and duplicate entries. What's the most likely result?",
      options: [
        "The model gives less reliable answers",
        "The model fixes the data by itself while it trains",
        "Nothing changes, because models ignore bad data",
        "The model becomes faster",
      ],
      answer: [0],
      explanation:
        "A model learns from whatever you give it, mistakes included. Poor data leads to poor answers, which is why cleaning data is one of the first steps in any AI project.",
    },

    // ───── d1-concepts
    {
      id: "d1-01",
      domain: "d1",
      lesson: "d1-concepts",
      prompt:
        "A marketing director asks how generative AI differs from the predictive models her analytics team already uses. Which answer is MOST accurate?",
      options: [
        "Generative AI creates new content such as text, images, and code, while predictive models mainly classify or forecast from existing data",
        "Generative AI does not need any data to work",
        "Generative AI follows hand-written rules instead of learning from data, while predictive models learn their patterns from historical examples",
        "Generative AI only works on structured data in relational databases",
      ],
      answer: [0],
      explanation:
        "Gen AI is a kind of machine learning whose job is to create new content. It still learns from data, and it's especially good with messy, unstructured data like emails and images.",
    },
    {
      id: "d1-02",
      domain: "d1",
      lesson: "d1-concepts",
      prompt: "Which term describes a large model trained on massive, diverse data that can be adapted to many different tasks?",
      options: ["Foundation model", "Rules engine", "Decision tree", "Data warehouse"],
      answer: [0],
      explanation:
        "Foundation models are trained on huge, mostly unlabeled datasets. That gives them broad skills you can adapt to many uses, and they're the base that gen AI is built on.",
    },
    {
      id: "d1-03",
      domain: "d1",
      lesson: "d1-concepts",
      prompt: "Which statements about large language models (LLMs) are accurate? (Choose two.)",
      options: [
        "They are a type of foundation model",
        "They are designed to understand and generate human language",
        "They need a new labeled dataset for every task they perform",
        "They can only repeat sentences that appeared in their training data",
        "They learn exclusively through reinforcement learning",
      ],
      answer: [0, 1],
      explanation:
        "An LLM is a foundation model that specialises in human language. Because it was trained so broadly, you can point it at many tasks with a prompt, with no new labeled data needed.",
    },
    {
      id: "d1-04",
      domain: "d1",
      lesson: "d1-concepts",
      prompt:
        "An insurer wants a single model that can read a photo of a damaged car, listen to the adjuster's voice note, and write a claim summary. Which capability is required?",
      options: ["A multimodal foundation model", "A text-only rules engine", "An unsupervised clustering model", "A relational database"],
      answer: [0],
      explanation: "A multimodal model can take in and produce several kinds of data, like images, audio and text, all in one model. That's exactly what this claim needs.",
    },
    {
      id: "d1-05",
      domain: "d1",
      lesson: "d1-concepts",
      prompt: "Which type of model generates images by starting from random noise and refining it step by step into a picture?",
      options: ["Diffusion model", "Large language model", "Linear regression model", "Clustering model"],
      answer: [0],
      explanation: "A diffusion model learns to remove noise a little at a time until a clear picture appears. Google's Imagen is a text-to-image diffusion model.",
    },
    {
      id: "d1-06",
      domain: "d1",
      lesson: "d1-concepts",
      prompt: "Which field of AI focuses on enabling computers to understand, interpret, and generate human language?",
      options: ["Natural language processing (NLP)", "Computer vision", "Reinforcement learning", "Robotic process automation (RPA)"],
      answer: [0],
      explanation: "NLP is the part of AI that deals with understanding and writing human language. LLMs are the modern, foundation-model way of doing NLP.",
    },
    {
      id: "d1-07",
      domain: "d1",
      lesson: "d1-concepts",
      prompt:
        "A team wants to adapt a foundation model to a narrow task by training only a small set of learned prompt parameters, keeping the model's own weights frozen. What is this technique called?",
      options: ["Prompt tuning", "Prompt engineering", "Full fine-tuning", "Pre-training from scratch"],
      answer: [0],
      explanation:
        "Prompt tuning learns a small \"soft prompt\" for the task and leaves the model's weights alone. Prompt engineering involves no training at all, and fine-tuning does change the model's weights.",
    },
    {
      id: "d1-08",
      domain: "d1",
      lesson: "d1-concepts",
      type: "match",
      prompt: "Match each term to its description.",
      pairs: [
        ["Artificial intelligence", "Machines doing tasks that normally need human intelligence"],
        ["Machine learning", "Systems that learn from data to do specific tasks"],
        ["Deep learning", "ML that uses neural networks with many layers"],
        ["Generative AI", "Models that create new content"],
      ],
      explanation: "Each term sits inside the one before it. AI is the widest idea, machine learning is one kind of AI, deep learning is one kind of ML, and gen AI is one use of deep learning.",
    },

    // ───── d1-ml
    {
      id: "d1-09",
      domain: "d1",
      lesson: "d1-ml",
      prompt:
        "A bank has five years of transactions, each one marked as \"fraud\" or \"legitimate\". It wants a model that flags new fraudulent transactions. Which ML approach fits?",
      options: ["Supervised learning", "Unsupervised learning", "Reinforcement learning", "Prompt engineering"],
      answer: [0],
      explanation: "Every example already has its answer attached, which is the sign of supervised learning. The model learns from those answers and then predicts them for new transactions.",
    },
    {
      id: "d1-10",
      domain: "d1",
      lesson: "d1-ml",
      prompt:
        "A retailer wants to discover natural groupings among its customers' purchase histories. It has no predefined categories. Which ML approach fits?",
      options: ["Unsupervised learning", "Supervised learning", "Reinforcement learning", "Human-in-the-loop review"],
      answer: [0],
      explanation: "With no answers in the data, the model has to find the groups on its own. That's unsupervised learning, and customer segments are a classic example.",
    },
    {
      id: "d1-11",
      domain: "d1",
      lesson: "d1-ml",
      prompt: "A warehouse robot improves its routes by earning points for fast deliveries and losing points for collisions. Which ML approach is this?",
      options: ["Reinforcement learning", "Supervised learning", "Unsupervised learning", "Retrieval-augmented generation"],
      answer: [0],
      explanation: "Reinforcement learning learns by trying things and getting feedback. It aims to collect as many rewards and as few penalties as it can.",
    },
    {
      id: "d1-12",
      domain: "d1",
      lesson: "d1-ml",
      type: "order",
      prompt: "Put the stages of the machine learning lifecycle in order.",
      items: ["Data ingestion", "Data preparation", "Model training", "Model deployment", "Model management"],
      explanation:
        "First you collect the data, then you clean and reshape it, then you train the model. After that you make it available to users, and finally you look after it over time.",
    },
    {
      id: "d1-13",
      domain: "d1",
      lesson: "d1-ml",
      prompt:
        "A company wants one Google Cloud platform to train, deploy, and manage models, including AutoML for teams with limited ML expertise. Which offering fits?",
      options: ["Gemini Enterprise Agent Platform", "Gemini for Google Workspace", "Google Search", "Security Command Center"],
      answer: [0],
      explanation:
        "Agent Platform is Google Cloud's single ML platform. It covers building, training, deploying and managing ML and gen AI solutions, and it includes Agent Platform AutoML for teams without deep ML skills.",
    },
    {
      id: "d1-14",
      domain: "d1",
      lesson: "d1-ml",
      type: "match",
      prompt: "Match each ML lifecycle stage to a Google Cloud tool that supports it.",
      pairs: [
        ["Data ingestion", "Pub/Sub streaming events into Cloud Storage"],
        ["Data preparation", "Dataflow or BigQuery cleaning and transforming data"],
        ["Model training", "Agent Platform AutoML or custom training"],
        ["Model management", "Model Registry and Model Monitoring"],
      ],
      explanation:
        "Ingestion collects the raw data and preparation cleans it up. Training builds the model on Agent Platform, and management keeps track of versions and watches for drift.",
    },

    // ───── d1-choose
    {
      id: "d1-15",
      domain: "d1",
      lesson: "d1-choose",
      prompt: "A legal team wants gen AI to turn 80-page contracts into one-page briefs for executives. Which gen AI capability is this?",
      options: ["Summarize", "Create", "Discover", "Automate"],
      answer: [0],
      explanation: "Shrinking a long document into a short brief is the \"summarize\" capability.",
    },
    {
      id: "d1-16",
      domain: "d1",
      lesson: "d1-choose",
      prompt:
        "Employees waste hours hunting for the right policy among thousands of internal documents. A gen AI tool that surfaces the right information at the right moment is an example of which capability?",
      options: ["Discover", "Create", "Summarize", "Automate"],
      answer: [0],
      explanation: "\"Discover\" means finding the right information when you need it. Searching across a company's own documents is a typical example.",
    },
    {
      id: "d1-17",
      domain: "d1",
      lesson: "d1-choose",
      prompt:
        "An accounts team manually keys data from supplier invoices into its ERP system. Gen AI now reads each invoice and enters the data with no human typing. Which capability is this?",
      options: ["Automate", "Create", "Discover", "Summarize"],
      answer: [0],
      explanation: "Taking over a task that people used to do by hand is the \"automate\" capability.",
    },
    {
      id: "d1-18",
      domain: "d1",
      lesson: "d1-choose",
      prompt: "Which factors should a business weigh when choosing a foundation model for a use case? (Choose three.)",
      options: [
        "Modality",
        "Context window",
        "Cost",
        "Whether it has the largest parameter count available",
        "Whether it is the most recently released model",
      ],
      answer: [0, 1, 2],
      explanation:
        "Google's list is modality, context window, security, availability and reliability, cost, performance, and fine-tuning and customisation. Being the biggest or the newest doesn't make a model right for the job.",
    },
    {
      id: "d1-19",
      domain: "d1",
      lesson: "d1-choose",
      prompt: "A law firm needs to analyse entire 500-page case files in a single request. Which model characteristic matters MOST?",
      options: ["A large context window", "Image generation quality", "A high temperature setting", "On-device deployment"],
      answer: [0],
      explanation:
        "The context window is how much the model can read at once. Long documents need a large one, though a larger window also uses more compute and costs more.",
    },
    {
      id: "d1-20",
      domain: "d1",
      lesson: "d1-choose",
      prompt:
        "A bank's customer-facing assistant must keep working during peak traffic and recover quickly from outages. Which model-selection factor is the PRIMARY concern?",
      options: ["Availability and reliability", "Modality", "Creativity of the output", "Size of the training dataset"],
      answer: [0],
      explanation: "Availability and reliability is about uptime promises, backup capacity, how the model copes when busy, and how fast it recovers after a failure.",
    },
    {
      id: "d1-21",
      domain: "d1",
      lesson: "d1-choose",
      prompt:
        "A startup will classify millions of short support tickets a month. A smaller, faster model meets its accuracy target; the most capable model is several times more expensive. What should it do?",
      options: [
        "Choose the smaller model that meets the requirement, balancing performance against cost",
        "Always choose the most capable model available",
        "Train a new foundation model from scratch",
        "Pick the model with the largest context window, because it can read more tickets at a time",
      ],
      answer: [0],
      explanation: "Choosing a model is a trade-off. If a cheaper, faster model already hits the accuracy target, it's the better deal when you're running millions of requests.",
    },

    // ───── d1-data
    {
      id: "d1-22",
      domain: "d1",
      lesson: "d1-data",
      prompt: "Which of these is an example of unstructured data?",
      options: [
        "Recorded customer support phone calls",
        "A table of orders with fixed columns",
        "A spreadsheet of inventory counts",
        "CRM records with defined fields",
      ],
      answer: [0],
      explanation: "A phone recording has no set layout, so it's unstructured. Tables, spreadsheets and records with fixed fields are all structured.",
    },
    {
      id: "d1-23",
      domain: "d1",
      lesson: "d1-data",
      prompt: "Which are examples of structured data? (Choose two.)",
      options: [
        "Rows in a relational sales database",
        "A spreadsheet of product IDs and prices",
        "A folder of customer emails",
        "Product photos uploaded by shoppers",
        "Video from store security cameras",
      ],
      answer: [0, 1],
      explanation: "Structured data is organised and easy to search, usually in rows and columns. Emails, photos and video don't follow a fixed layout, so they're unstructured.",
    },
    {
      id: "d1-24",
      domain: "d1",
      lesson: "d1-data",
      prompt: "A hospital has 10,000 X-ray images, each tagged by a radiologist as \"fracture\" or \"no fracture\". What kind of data is this?",
      options: ["Labeled data", "Unlabeled data", "Synthetic data", "Streaming data"],
      answer: [0],
      explanation: "Labeled data carries a tag for each item, such as a name, type or number. Here, the radiologist's \"fracture\" or \"no fracture\" tags are the labels.",
    },
    {
      id: "d1-25",
      domain: "d1",
      lesson: "d1-data",
      prompt:
        "Customer records list the same country as \"US\", \"USA\", and \"United States\" in different systems. Which data quality characteristic is lacking?",
      options: ["Consistency", "Relevance", "Availability", "Cost"],
      answer: [0],
      explanation: "Consistent data writes the same value the same way everywhere. When one country has three spellings, a model may treat them as three different places.",
    },
    {
      id: "d1-26",
      domain: "d1",
      lesson: "d1-data",
      prompt: "Half of the customer survey responses are missing the region field. Which data quality characteristic is affected?",
      options: ["Completeness", "Consistency", "Format", "Relevance"],
      answer: [0],
      explanation: "Missing values are a completeness problem. Gaps like these can skew or weaken what the model learns.",
    },
    {
      id: "d1-27",
      domain: "d1",
      lesson: "d1-data",
      prompt:
        "A company has rich, accurate data, but it sits in departmental silos in incompatible formats, and the AI team can't get to it. Which data characteristic is the problem?",
      options: ["Accessibility", "Labeling", "Completeness", "Relevance"],
      answer: [0],
      explanation: "Accessible data is easy to reach, ready to use and in the right format. Great data that nobody can get to can't help an AI project.",
    },
    {
      id: "d1-28",
      domain: "d1",
      lesson: "d1-data",
      type: "match",
      prompt: "Match each data type to an example.",
      pairs: [
        ["Structured", "A table of orders with fixed columns"],
        ["Unstructured", "A folder of contracts saved as PDFs"],
        ["Labeled", "Photos each tagged \"damaged\" or \"undamaged\""],
        ["Unlabeled", "Raw audio streams with no tags"],
      ],
      explanation: "Structured or unstructured is about how the data is organised. Labeled or unlabeled is about whether each item carries a tag.",
    },
    {
      id: "d1-29",
      domain: "d1",
      lesson: "d1-data",
      prompt:
        "A grocery chain in Canada trains a demand-forecasting model using only sales data from an electronics retailer in another country. What is the MAIN data problem?",
      options: ["The data isn't relevant to the problem", "The data is unlabeled", "The data is too consistent to show any seasonal patterns", "The data is structured"],
      answer: [0],
      explanation: "Relevant data fits the problem you're solving. Electronics sales from another country won't tell you how much milk a Canadian grocer will sell.",
    },

    // ───── d1-layers
    {
      id: "d1-30",
      domain: "d1",
      lesson: "d1-layers",
      type: "order",
      prompt: "Order the layers of the gen AI landscape from the bottom (closest to hardware) to the top (closest to the user).",
      items: ["Infrastructure", "Models", "Platforms", "Agents", "Applications"],
      explanation:
        "Infrastructure supplies the computing power and models learn the patterns. Platforms add APIs and tools, agents pursue goals using tools, and applications are what users actually see.",
    },
    {
      id: "d1-31",
      domain: "d1",
      lesson: "d1-layers",
      prompt: "Store managers use the Gemini app to draft weekly team updates. Which layer of the gen AI landscape are they using directly?",
      options: ["Applications", "Infrastructure", "Platforms", "Models"],
      answer: [0],
      explanation: "The application layer is the part of gen AI that users touch. The managers never deal with the models or the hardware underneath.",
    },
    {
      id: "d1-32",
      domain: "d1",
      lesson: "d1-layers",
      prompt: "Which layer of the gen AI landscape includes TPUs, GPUs, and the servers needed to train and run models?",
      options: ["Infrastructure", "Applications", "Agents", "Platforms"],
      answer: [0],
      explanation: "The infrastructure layer is the physical hardware and core software that store and run AI models and their training data.",
    },
    {
      id: "d1-33",
      domain: "d1",
      lesson: "d1-layers",
      prompt:
        "A company has an ML team that wants to choose, tune, and deploy models itself, with APIs and data tools, but without managing hardware. Which layer should it work at?",
      options: ["Platforms", "Applications", "Infrastructure", "Agents"],
      answer: [0],
      explanation:
        "The platform layer, such as Gemini Enterprise Agent Platform, gives you APIs, data management and deployment tools. It hides the hardware so the team doesn't have to manage it.",
    },
    {
      id: "d1-34",
      domain: "d1",
      lesson: "d1-layers",
      prompt:
        "A travel company deploys software that takes a goal such as \"book a team offsite\", checks calendars, searches venues, and makes the booking using connected tools. Which layer is this?",
      options: ["Agents", "Infrastructure", "Models", "Data storage"],
      answer: [0],
      explanation: "An agent works toward a goal. It reasons about what it's been given and uses the tools it's connected to, like calendars and booking systems.",
    },

    // ───── d1-models
    {
      id: "d1-35",
      domain: "d1",
      lesson: "d1-models",
      type: "match",
      prompt: "Match each Google model to its main strength.",
      pairs: [
        ["Gemini", "Multimodal understanding, conversation, and content creation"],
        ["Gemma", "Lightweight open models for customisation and local deployment"],
        ["Imagen", "High-quality images from text descriptions"],
        ["Veo", "Video from text descriptions or still images"],
      ],
      explanation: "Gemini is the flagship multimodal family and Gemma is the open-model family. Imagen turns text into images, and Veo makes video.",
    },
    {
      id: "d1-36",
      domain: "d1",
      lesson: "d1-models",
      prompt:
        "A healthcare startup wants a lightweight open model it can customise and run in its own environment for a specialised application. Which Google model family fits BEST?",
      options: ["Gemma", "Veo", "Imagen", "Gemini app"],
      answer: [0],
      explanation: "Gemma gives developers open models they can customise. They suit local deployments and specialist AI apps like this one.",
    },
    {
      id: "d1-37",
      domain: "d1",
      lesson: "d1-models",
      prompt: "A marketing team wants short product video clips generated from text descriptions and existing product photos. Which Google model fits?",
      options: ["Veo", "Imagen", "Gemma", "Gemini Nano"],
      answer: [0],
      explanation: "Veo makes video from a text description or a still image. Imagen only makes still images, so it can't produce the clips.",
    },
    {
      id: "d1-38",
      domain: "d1",
      lesson: "d1-models",
      prompt: "Which are strengths of Gemini? (Choose two.)",
      options: [
        "Multimodal understanding across text, images, audio, video, and code",
        "Conversational AI, content creation, and question answering",
        "It only generates images from text",
        "It can only process structured data",
        "It runs only on customer-owned hardware",
      ],
      answer: [0, 1],
      explanation: "Gemini understands many kinds of input and is good at conversation, creating content and answering questions. It also powers many Google products.",
    },
    {
      id: "d1-39",
      domain: "d1",
      lesson: "d1-models",
      prompt: "A design agency needs high-quality concept images created from detailed written briefs. Which Google model is built for this?",
      options: ["Imagen", "Veo", "Gemma", "Gemini Nano"],
      answer: [0],
      explanation: "Imagen is Google's text-to-image diffusion model. You describe the picture in words and it creates the image.",
    },
  ],

  cards: [
    { id: "d1-c01", domain: "d1", kind: "concept", term: "Generative AI", definition: "A use of machine learning that creates new content, such as text, images, code, audio and video." },
    { id: "d1-c02", domain: "d1", kind: "concept", term: "Foundation model", definition: "A large model trained on a huge, varied dataset that you can adapt to many tasks. It's the base that gen AI is built on." },
    { id: "d1-c03", domain: "d1", kind: "concept", term: "Large language model (LLM)", definition: "A foundation model built to understand and write human language." },
    { id: "d1-c04", domain: "d1", kind: "concept", term: "Multimodal model", definition: "A model that takes in and produces several kinds of data, such as text, images, audio and video." },
    { id: "d1-c05", domain: "d1", kind: "concept", term: "Diffusion model", definition: "A model that makes an image by cleaning up random noise a little at a time. Imagen is one." },
    { id: "d1-c06", domain: "d1", kind: "concept", term: "Prompt tuning", definition: "Learns a small set of prompt settings for one task. The model's own weights stay unchanged." },
    {
      id: "d1-c07",
      domain: "d1",
      kind: "concept",
      term: "Supervised, unsupervised and reinforcement learning",
      definition: "Supervised learns from data that has answers. Unsupervised finds patterns in data without answers. Reinforcement learns from rewards and penalties.",
    },
    {
      id: "d1-c08",
      domain: "d1",
      kind: "concept",
      term: "ML lifecycle",
      definition: "Five stages in order: data ingestion, data preparation, model training, model deployment and model management.",
    },
    { id: "d1-c09", domain: "d1", kind: "concept", term: "Data quality", definition: "Data that is accurate, complete, consistent and relevant to the problem." },
    {
      id: "d1-c10",
      domain: "d1",
      kind: "concept",
      term: "Gen AI landscape layers",
      definition: "From the bottom up: infrastructure, models, platforms, agents and applications.",
    },
    { id: "d1-c11", domain: "d1", kind: "service", term: "Gemini", definition: "Google's multimodal model family for conversation, creating content and answering questions." },
    { id: "d1-c12", domain: "d1", kind: "service", term: "Gemma", definition: "Lightweight open models you can customise and run locally or in specialist apps." },
    { id: "d1-c13", domain: "d1", kind: "service", term: "Imagen", definition: "Google's text-to-image diffusion model for high-quality images." },
    { id: "d1-c14", domain: "d1", kind: "service", term: "Veo", definition: "Makes video from a text description or a still image." },
  ],
});
