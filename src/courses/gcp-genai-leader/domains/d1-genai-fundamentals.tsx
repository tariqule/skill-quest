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
    name: "Fundamentals of gen AI",
    world: "The Foundation Fields",
    weight: 30,
    emoji: "🧠",
    color: "#4285f4",
    summary: "Core gen AI concepts, ML approaches and lifecycle, data quality and types, the five layers of the landscape, and Google's foundation models.",
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
              { icon: "🗣️", title: "NLP", text: "AI that understands, interprets, and generates human language.", color: "#4285f4" },
              { icon: "🎨", title: "Multimodal model", text: "Takes in and produces several data types: text, images, audio, video, code.", color: "#34a853" },
              { icon: "🌫️", title: "Diffusion model", text: "Generates images by refining random noise step by step (Imagen is one).", color: "#fbbc04" },
              { icon: "✍️", title: "Prompt engineering", text: "Crafting inputs that steer a model to the output you need. No training.", color: "#ea4335" },
              { icon: "🎛️", title: "Prompt tuning", text: "Learns a small set of prompt parameters for a task while the model's weights stay frozen.", color: "#a78bfa" },
              { icon: "📚", title: "LLM", text: "A foundation model designed to understand and generate human language.", color: "#38bdf8" },
            ]}
          />
        </div>
      ),
      points: [
        "Each idea sits inside the last: AI ⊃ machine learning ⊃ deep learning ⊃ generative AI.",
        "Gen AI creates new content. Traditional ML mostly classifies or predicts from existing data.",
        "Foundation models are trained on massive, diverse, mostly unlabeled data, are flexible across many use cases, and can be adapted to specialised domains.",
        "Prompting is how you interact with and guide a foundation model.",
      ],
      tip: "Prompt engineering changes only the input. Prompt tuning and fine-tuning involve training. If a question says \"no training\", it's prompt engineering.",
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
              { icon: "🏷️", title: "Supervised", text: "Labeled data → predict outputs for new inputs. \"Is this transaction fraud?\"", color: "#4285f4" },
              { icon: "🧩", title: "Unsupervised", text: "Unlabeled data → find natural groupings and patterns. \"What customer segments exist?\"", color: "#34a853" },
              { icon: "🎮", title: "Reinforcement", text: "Learn by interaction and feedback: maximise rewards, minimise penalties.", color: "#fbbc04" },
            ]}
          />
          <Flow
            color="#4285f4"
            steps={[
              { icon: "📥", label: "Data ingestion", sub: "Collect raw data: Cloud Storage, Pub/Sub, BigQuery" },
              { icon: "🧹", label: "Data preparation", sub: "Clean and transform: BigQuery, Dataflow" },
              { icon: "🏋️", label: "Model training", sub: "Agent Platform: AutoML or custom training" },
              { icon: "🚀", label: "Model deployment", sub: "Make the trained model available to apps on Agent Platform" },
              { icon: "🔧", label: "Model management", sub: "Model Registry, Model Monitoring, Feature Store, Pipelines" },
            ]}
            loop="Management feeds back into new data and retraining"
          />
        </div>
      ),
      points: [
        "Supervised learning needs labels; unsupervised learning finds structure without them; reinforcement learning learns from rewards.",
        "The lifecycle runs: data ingestion → data preparation → model training → model deployment → model management.",
        "Gemini Enterprise Agent Platform is Google Cloud's unified ML platform covering training, deployment, and management.",
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
              { icon: "✨", title: "Create", text: "Generate new content: copy, images, code, video.", color: "#4285f4" },
              { icon: "📝", title: "Summarize", text: "Condense long information into concise summaries.", color: "#34a853" },
              { icon: "🔎", title: "Discover", text: "Find the right information at the right time.", color: "#fbbc04" },
              { icon: "⚙️", title: "Automate", text: "Take over previously manual tasks.", color: "#ea4335" },
            ]}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🎞️", title: "Modality", text: "Do its inputs and outputs (text, image, audio, video) match the job?" },
              { icon: "📏", title: "Context window", text: "How much it can consider at once. Bigger costs more compute." },
              { icon: "⚡", title: "Performance", text: "Accuracy, speed, and efficiency, traded off against cost." },
              { icon: "💵", title: "Cost", text: "Price per use at your expected volume." },
              { icon: "🟢", title: "Availability & reliability", text: "Uptime guarantees, redundancy, behaviour under load." },
              { icon: "🔐", title: "Security & customisation", text: "Data protection, plus whether you can fine-tune or customise it." },
            ]}
          />
        </div>
      ),
      points: [
        "Most business use cases fit one of four verbs: create, summarize, discover, automate.",
        "Examples include text, image, code, and video generation, data analysis, and personalised user experiences.",
        "There is no single best model: match modality, context window, performance, cost, availability, security, and customisation to the use case.",
      ],
      tip: "The \"biggest\" model is rarely the right answer. Look for the requirement words: lowest cost, fastest, longest documents, must stay up.",
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
              <div className="text-sm text-slate-300">Organised, easy to search, often in relational databases.</div>
              <div className="mt-1 text-xs text-slate-400">Order tables, spreadsheets, CRM fields</div>
            </div>
            <div className="rounded-xl border border-amber-400/30 bg-amber-400/5 p-3">
              <div className="font-semibold text-amber-200">🌀 Unstructured</div>
              <div className="text-sm text-slate-300">No predefined structure; needs more sophisticated analysis.</div>
              <div className="mt-1 text-xs text-slate-400">Emails, PDFs, photos, call recordings, video</div>
            </div>
            <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3">
              <div className="font-semibold text-emerald-200">🏷️ Labeled</div>
              <div className="text-sm text-slate-300">Has tags such as a name, type, or number.</div>
              <div className="mt-1 text-xs text-slate-400">X-rays tagged &quot;fracture&quot; / &quot;no fracture&quot;</div>
            </div>
            <div className="rounded-xl border border-violet-400/30 bg-violet-400/5 p-3">
              <div className="font-semibold text-violet-200">📦 Unlabeled</div>
              <div className="text-sm text-slate-300">Raw, untagged information.</div>
              <div className="mt-1 text-xs text-slate-400">Unsorted photo libraries, audio streams</div>
            </div>
          </div>
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧩", title: "Complete", text: "No missing fields or gaps.", color: "#34a853" },
              { icon: "🔁", title: "Consistent", text: "Same values recorded the same way everywhere.", color: "#34a853" },
              { icon: "🎯", title: "Relevant", text: "Fits the problem you are solving.", color: "#34a853" },
              { icon: "🚪", title: "Available", text: "Teams can actually reach it, not locked in silos.", color: "#4285f4" },
              { icon: "💵", title: "Cost", text: "Affordable to collect, store, and prepare.", color: "#4285f4" },
              { icon: "📐", title: "Format", text: "In a usable format for training or grounding.", color: "#4285f4" },
            ]}
          />
        </div>
      ),
      points: [
        "Quality data is accurate, complete, consistent, and relevant. Poor data produces poor AI.",
        "Accessible data is available, usable, and in the proper format for the people and models that need it.",
        "Most enterprise data is unstructured, and gen AI is especially good at working with it.",
      ],
      check: ["d1-22", "d1-25"],
    },
    {
      id: "d1-layers",
      task: "1.3",
      title: "The five layers of the gen AI landscape",
      visual: <LandscapeStack />,
      points: [
        "Bottom to top: infrastructure → models → platforms → agents → applications.",
        "Applications are what users touch. Agents pursue goals with tools. Platforms provide APIs, data management, and deployment tools.",
        "Higher layers deliver value fastest; lower layers give more control but need more expertise and effort.",
      ],
      tip: "Name the layer from what the people in the scenario actually do: use a finished app, build an agent, tune a model, or provision hardware.",
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
            { icon: "♊", title: "Gemini", text: "Multimodal understanding, conversational AI, content creation, and question answering.", color: "#4285f4" },
            { icon: "💎", title: "Gemma", text: "Lightweight open models developers can customise and deploy locally or for specialised apps.", color: "#34a853" },
            { icon: "🖼️", title: "Imagen", text: "Text-to-image diffusion model for high-quality images from descriptions.", color: "#fbbc04" },
            { icon: "🎬", title: "Veo", text: "Generates video from text descriptions or still images.", color: "#ea4335" },
          ]}
        />
      ),
      points: [
        "Gemini is the multimodal model family that powers many Google products.",
        "Gemma is the open-model choice when you need customisation or local deployment.",
        "Imagen makes images and Veo makes video. Gemini Nano is the compact Gemini model designed to run on devices.",
      ],
      check: ["d1-35", "d1-36"],
    },
  ],

  questions: [
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
        "Generative AI follows hand-written rules instead of learning from data",
        "Generative AI only works on structured data in relational databases",
      ],
      answer: [0],
      explanation:
        "Gen AI is an application of machine learning focused on creating new content. It still learns from data, and it is particularly good with unstructured data.",
    },
    {
      id: "d1-02",
      domain: "d1",
      lesson: "d1-concepts",
      prompt: "Which term describes a large model trained on massive, diverse data that can be adapted to many different tasks?",
      options: ["Foundation model", "Rules engine", "Decision tree", "Data warehouse"],
      answer: [0],
      explanation:
        "Foundation models are trained on huge, mostly unlabeled datasets, which gives them broad capabilities that can be adapted to many use cases. They are the basis of gen AI.",
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
        "An LLM is a foundation model specialised in human language. Because it is pre-trained broadly, it can handle many tasks through prompting without task-specific labeled data.",
    },
    {
      id: "d1-04",
      domain: "d1",
      lesson: "d1-concepts",
      prompt:
        "An insurer wants a single model that can read a photo of a damaged car, listen to the adjuster's voice note, and write a claim summary. Which capability is required?",
      options: ["A multimodal foundation model", "A text-only rules engine", "An unsupervised clustering model", "A relational database"],
      answer: [0],
      explanation: "Multimodal models process and generate several data types, such as images, audio, and text, in one model.",
    },
    {
      id: "d1-05",
      domain: "d1",
      lesson: "d1-concepts",
      prompt: "Which type of model generates images by starting from random noise and refining it step by step into a picture?",
      options: ["Diffusion model", "Large language model", "Linear regression model", "Clustering model"],
      answer: [0],
      explanation: "Diffusion models learn to remove noise gradually. Google's Imagen is a text-to-image diffusion model.",
    },
    {
      id: "d1-06",
      domain: "d1",
      lesson: "d1-concepts",
      prompt: "Which field of AI focuses on enabling computers to understand, interpret, and generate human language?",
      options: ["Natural language processing (NLP)", "Computer vision", "Reinforcement learning", "Robotic process automation"],
      answer: [0],
      explanation: "NLP covers understanding and generating human language. LLMs are a modern, foundation-model approach to NLP.",
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
        "Prompt tuning learns a small \"soft prompt\" for the task without changing the model's weights. Prompt engineering involves no training at all, and fine-tuning updates the model's weights.",
    },
    {
      id: "d1-08",
      domain: "d1",
      lesson: "d1-concepts",
      type: "match",
      prompt: "Match each term to its description.",
      pairs: [
        ["Artificial intelligence", "Machines performing tasks that normally need human intelligence"],
        ["Machine learning", "Systems that learn from data to perform specific tasks"],
        ["Deep learning", "ML using many-layered neural networks"],
        ["Generative AI", "Models that create new content"],
      ],
      explanation: "Each term is a subset of the one before it: AI ⊃ ML ⊃ deep learning ⊃ gen AI.",
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
      explanation: "Labeled examples with a known outcome are the hallmark of supervised learning, which predicts that outcome for new inputs.",
    },
    {
      id: "d1-10",
      domain: "d1",
      lesson: "d1-ml",
      prompt:
        "A retailer wants to discover natural groupings among its customers' purchase histories. It has no predefined categories. Which ML approach fits?",
      options: ["Unsupervised learning", "Supervised learning", "Reinforcement learning", "Human-in-the-loop review"],
      answer: [0],
      explanation: "Unsupervised learning uses unlabeled data to find patterns and natural groupings, such as customer segments.",
    },
    {
      id: "d1-11",
      domain: "d1",
      lesson: "d1-ml",
      prompt: "A warehouse robot improves its routes by earning points for fast deliveries and losing points for collisions. Which ML approach is this?",
      options: ["Reinforcement learning", "Supervised learning", "Unsupervised learning", "Retrieval-augmented generation"],
      answer: [0],
      explanation: "Reinforcement learning learns through interaction and feedback, maximising rewards and minimising penalties.",
    },
    {
      id: "d1-12",
      domain: "d1",
      lesson: "d1-ml",
      type: "order",
      prompt: "Put the stages of the machine learning lifecycle in order.",
      items: ["Data ingestion", "Data preparation", "Model training", "Model deployment", "Model management"],
      explanation:
        "Collect the data, clean and transform it, train the model, make it available to users, then manage and maintain it over time.",
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
        "Agent Platform is Google Cloud's unified ML platform. It covers building, training, deploying, and managing ML and gen AI solutions, including Agent Platform AutoML.",
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
        "Ingestion collects raw data, preparation transforms it, training builds the model on Agent Platform, and management tracks versions and drift.",
    },

    // ───── d1-choose
    {
      id: "d1-15",
      domain: "d1",
      lesson: "d1-choose",
      prompt: "A legal team wants gen AI to turn 80-page contracts into one-page briefs for executives. Which gen AI capability is this?",
      options: ["Summarize", "Create", "Discover", "Automate"],
      answer: [0],
      explanation: "Condensing long information into a concise summary is the \"summarize\" capability.",
    },
    {
      id: "d1-16",
      domain: "d1",
      lesson: "d1-choose",
      prompt:
        "Employees waste hours hunting for the right policy among thousands of internal documents. A gen AI tool that surfaces the right information at the right moment is an example of which capability?",
      options: ["Discover", "Create", "Summarize", "Automate"],
      answer: [0],
      explanation: "\"Discover\" is about finding information at the right time, such as enterprise search over internal knowledge.",
    },
    {
      id: "d1-17",
      domain: "d1",
      lesson: "d1-choose",
      prompt:
        "An accounts team manually keys data from supplier invoices into its ERP system. Gen AI now reads each invoice and enters the data with no human typing. Which capability is this?",
      options: ["Automate", "Create", "Discover", "Summarize"],
      answer: [0],
      explanation: "Taking over a previously manual task is the \"automate\" capability.",
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
        "Google lists modality, context window, security, availability and reliability, cost, performance, and fine-tuning and customisation. Size or release date alone don't make a model right for the job.",
    },
    {
      id: "d1-19",
      domain: "d1",
      lesson: "d1-choose",
      prompt: "A law firm needs to analyse entire 500-page case files in a single request. Which model characteristic matters MOST?",
      options: ["A large context window", "Image generation quality", "A high temperature setting", "On-device deployment"],
      answer: [0],
      explanation:
        "The context window is how much the model can consider at once. Long documents need a large one, which is balanced against higher compute cost.",
    },
    {
      id: "d1-20",
      domain: "d1",
      lesson: "d1-choose",
      prompt:
        "A bank's customer-facing assistant must keep working during peak traffic and recover quickly from outages. Which model-selection factor is the PRIMARY concern?",
      options: ["Availability and reliability", "Modality", "Creativity of the output", "Size of the training dataset"],
      answer: [0],
      explanation: "Availability and reliability covers uptime guarantees, redundancy, behaviour under load, and disaster recovery.",
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
        "Pick the model with the largest context window",
      ],
      answer: [0],
      explanation: "Model choice is a trade-off. When a cheaper, faster model meets the accuracy need, it gives better value at high volume.",
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
      explanation: "Audio recordings have no predefined structure. Tables, spreadsheets, and fixed-field records are structured.",
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
      explanation: "Structured data is organised and easy to search, typically rows and columns. Emails, photos, and video are unstructured.",
    },
    {
      id: "d1-24",
      domain: "d1",
      lesson: "d1-data",
      prompt: "A hospital has 10,000 X-ray images, each tagged by a radiologist as \"fracture\" or \"no fracture\". What kind of data is this?",
      options: ["Labeled data", "Unlabeled data", "Synthetic data", "Streaming data"],
      answer: [0],
      explanation: "Labeled data carries tags such as a name, type, or number. The radiologist's tags are the labels.",
    },
    {
      id: "d1-25",
      domain: "d1",
      lesson: "d1-data",
      prompt:
        "Customer records list the same country as \"US\", \"USA\", and \"United States\" in different systems. Which data quality characteristic is lacking?",
      options: ["Consistency", "Relevance", "Availability", "Cost"],
      answer: [0],
      explanation: "Consistent data records the same value the same way everywhere. Inconsistent values confuse models and analysis.",
    },
    {
      id: "d1-26",
      domain: "d1",
      lesson: "d1-data",
      prompt: "Half of the customer survey responses are missing the region field. Which data quality characteristic is affected?",
      options: ["Completeness", "Consistency", "Format", "Relevance"],
      answer: [0],
      explanation: "Missing values are a completeness problem. Incomplete data can bias or weaken the model's outputs.",
    },
    {
      id: "d1-27",
      domain: "d1",
      lesson: "d1-data",
      prompt:
        "A company has rich, accurate data, but it sits in departmental silos in incompatible formats, and the AI team can't get to it. Which data characteristic is the problem?",
      options: ["Accessibility", "Labeling", "Completeness", "Relevance"],
      answer: [0],
      explanation: "Accessible data is readily available, usable, and in the proper format. Good data that nobody can reach can't help an AI project.",
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
      explanation: "Structure is about organisation; labels are about whether each item carries a tag.",
    },
    {
      id: "d1-29",
      domain: "d1",
      lesson: "d1-data",
      prompt:
        "A grocery chain in Canada trains a demand-forecasting model using only sales data from an electronics retailer in another country. What is the MAIN data problem?",
      options: ["The data isn't relevant to the problem", "The data is unlabeled", "The data is too consistent", "The data is structured"],
      answer: [0],
      explanation: "Relevance means the data fits the problem being solved. Data from a different industry and market won't reflect the chain's demand.",
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
        "Infrastructure provides compute, models learn patterns, platforms provide APIs and tooling, agents pursue goals with tools, and applications are what users interact with.",
    },
    {
      id: "d1-31",
      domain: "d1",
      lesson: "d1-layers",
      prompt: "Store managers use the Gemini app to draft weekly team updates. Which layer of the gen AI landscape are they using directly?",
      options: ["Applications", "Infrastructure", "Platforms", "Models"],
      answer: [0],
      explanation: "The application layer is the user-facing part of gen AI. The managers don't touch the models or infrastructure directly.",
    },
    {
      id: "d1-32",
      domain: "d1",
      lesson: "d1-layers",
      prompt: "Which layer of the gen AI landscape includes TPUs, GPUs, and the servers needed to train and run models?",
      options: ["Infrastructure", "Applications", "Agents", "Platforms"],
      answer: [0],
      explanation: "The infrastructure layer is the physical hardware and core software to store and run AI models and training data.",
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
        "The platform layer (for example Gemini Enterprise Agent Platform) offers APIs, data management, and deployment tools, and hides infrastructure complexity.",
    },
    {
      id: "d1-34",
      domain: "d1",
      lesson: "d1-layers",
      prompt:
        "A travel company deploys software that takes a goal such as \"book a team offsite\", checks calendars, searches venues, and makes the booking using connected tools. Which layer is this?",
      options: ["Agents", "Infrastructure", "Models", "Data storage"],
      answer: [0],
      explanation: "An agent pursues a goal by reasoning over its inputs and using the tools available to it.",
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
      explanation: "Gemini is the multimodal flagship family, Gemma the open models, Imagen the text-to-image model, and Veo the video model.",
    },
    {
      id: "d1-36",
      domain: "d1",
      lesson: "d1-models",
      prompt:
        "A healthcare startup wants a lightweight open model it can customise and run in its own environment for a specialised application. Which Google model family fits BEST?",
      options: ["Gemma", "Veo", "Imagen", "Gemini app"],
      answer: [0],
      explanation: "Gemma offers developers customisable open models suited to local deployments and specialised AI applications.",
    },
    {
      id: "d1-37",
      domain: "d1",
      lesson: "d1-models",
      prompt: "A marketing team wants short product video clips generated from text descriptions and existing product photos. Which Google model fits?",
      options: ["Veo", "Imagen", "Gemma", "Gemini Nano"],
      answer: [0],
      explanation: "Veo generates video from text descriptions or still images. Imagen generates still images.",
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
      explanation: "Gemini supports multimodal understanding, conversational AI, content creation, and question answering, and it powers many Google products.",
    },
    {
      id: "d1-39",
      domain: "d1",
      lesson: "d1-models",
      prompt: "A design agency needs high-quality concept images created from detailed written briefs. Which Google model is built for this?",
      options: ["Imagen", "Veo", "Gemma", "Gemini Nano"],
      answer: [0],
      explanation: "Imagen is Google's text-to-image diffusion model.",
    },
  ],

  cards: [
    { id: "d1-c01", domain: "d1", kind: "concept", term: "Generative AI", definition: "An application of ML that creates new content: text, images, code, audio, and video." },
    { id: "d1-c02", domain: "d1", kind: "concept", term: "Foundation model", definition: "A large model trained on massive, diverse data that can be adapted to many tasks. The basis of gen AI." },
    { id: "d1-c03", domain: "d1", kind: "concept", term: "Large language model (LLM)", definition: "A foundation model designed to understand and generate human language." },
    { id: "d1-c04", domain: "d1", kind: "concept", term: "Multimodal model", definition: "A model that processes and generates several data types, such as text, images, audio, and video." },
    { id: "d1-c05", domain: "d1", kind: "concept", term: "Diffusion model", definition: "Generates images by gradually refining random noise. Imagen is one." },
    { id: "d1-c06", domain: "d1", kind: "concept", term: "Prompt tuning", definition: "Learns a small set of prompt parameters for a task while the model's weights stay frozen." },
    { id: "d1-c07", domain: "d1", kind: "concept", term: "Supervised / unsupervised / reinforcement", definition: "Learn from labeled data · find patterns in unlabeled data · learn from rewards and penalties." },
    { id: "d1-c08", domain: "d1", kind: "concept", term: "ML lifecycle", definition: "Data ingestion → data preparation → model training → model deployment → model management." },
    { id: "d1-c09", domain: "d1", kind: "concept", term: "Data quality", definition: "Accurate, complete, consistent, and relevant data." },
    { id: "d1-c10", domain: "d1", kind: "concept", term: "Gen AI landscape layers", definition: "Infrastructure → models → platforms → agents → applications." },
    { id: "d1-c11", domain: "d1", kind: "service", term: "Gemini", definition: "Google's multimodal model family for conversation, content creation, and question answering." },
    { id: "d1-c12", domain: "d1", kind: "service", term: "Gemma", definition: "Lightweight open models for customisation and local or specialised deployments." },
    { id: "d1-c13", domain: "d1", kind: "service", term: "Imagen", definition: "Text-to-image diffusion model for high-quality images." },
    { id: "d1-c14", domain: "d1", kind: "service", term: "Veo", definition: "Generates video from text descriptions or still images." },
  ],
});
