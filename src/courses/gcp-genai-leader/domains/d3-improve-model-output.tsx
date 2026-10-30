import { Flow, Ladder, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { GroundingLab } from "../labs";
import { RagSteps, SamplingDial } from "../visuals";

/**
 * Section 3: Techniques to improve gen AI model output (~20% of the exam).
 */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Getting better output",
    world: "The Grounding Forge",
    weight: 20,
    emoji: "🎯",
    color: "#fbbc04",
    summary:
      "Where foundation models fall short and how to fix it, keeping models healthy after launch, prompting techniques, grounding and RAG, and the settings that control how a model writes.",
  },

  tasks: [
    {
      id: "3.1",
      title: "Proactively overcome foundation model limitations",
      covers: [
        "Limitations: data dependency, knowledge cutoff, bias, fairness, hallucinations, edge cases",
        "Recommended practices: grounding, RAG, prompt engineering, fine-tuning, human in the loop (HITL)",
        "Continuous monitoring and evaluation: automatic model upgrades, KPIs, security patches, versioning, performance tracking, drift monitoring, Agent Platform Feature Store",
      ],
    },
    {
      id: "3.2",
      title: "Prompt engineering techniques",
      covers: [
        "What prompt engineering is and why it matters for LLMs",
        "Zero-shot, one-shot, few-shot, role prompting, prompt chaining",
        "Advanced techniques: chain-of-thought and ReAct prompting",
      ],
    },
    {
      id: "3.3",
      title: "Grounding techniques and their use cases",
      covers: [
        "Grounding with first-party enterprise data, third-party data, and world data",
        "How RAG affects generated output",
        "Google Cloud grounding: prebuilt RAG with Agent Search, RAG APIs, Grounding with Google Search",
        "Sampling parameters: token count, temperature, top-p, safety settings, output length",
      ],
    },
  ],

  lessons: [
    // ───── Start here (beginner)
    {
      id: "d3-b-mistakes",
      level: "beginner",
      task: "3.1",
      title: "Why AI sometimes gets things wrong",
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "📅", title: "Out of date", text: "It only knows what it read before training ended.", color: "#ea4335" },
            { icon: "🎭", title: "Made up", text: "It can fill a gap with something that sounds right but isn't true.", color: "#ea4335" },
            { icon: "🪞", title: "Copied bias", text: "If its training data was unfair, its answers can be unfair too.", color: "#ea4335" },
          ]}
        />
      ),
      points: [
        "Imagine a very well-read friend who has spent the last year on a remote island. They know a lot, but nothing about this year's news.",
        "That friend also hates saying \"I don't know\", so sometimes they guess with total confidence. When a model does this, it's called a hallucination.",
        "Models learn from people's writing, so they can pick up people's unfair views too. That's called bias.",
        "None of this means AI is useless. It means you add checks, like giving it real sources and having a person review the important answers.",
      ],
      tip: "A confident answer isn't the same as a correct one. For anything that matters, check where the answer came from.",
      check: ["gail-b3-01", "gail-b3-02"],
    },
    {
      id: "d3-b-prompts",
      level: "beginner",
      task: "3.2",
      title: "How to write a good prompt",
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "😕", title: "Vague prompt", text: "\"Write something about our sale.\"", color: "#94a3b8" },
            { icon: "🎯", title: "Clear prompt", text: "\"Write a friendly 3-line email telling regular customers about our 20% weekend sale. End with a link to the shop.\"", color: "#fbbc04" },
          ]}
        />
      ),
      points: [
        "A prompt is the instruction you give the model. Writing it well is called prompt engineering, and it needs no training or code.",
        "Brief the model like a capable new assistant on day one. Say what you want, who it's for, how long it should be and what tone to use.",
        "Showing an example of what you want is often the quickest way to get the format right.",
      ],
      tip: "If the answer isn't what you wanted, add the missing detail and ask again. Small changes to a prompt can make a big difference.",
      check: ["gail-b3-03", "gail-b3-04"],
    },
    {
      id: "d3-b-grounding",
      level: "beginner",
      task: "3.3",
      title: "Giving the model the facts: grounding",
      visual: (
        <Flow
          color="#fbbc04"
          steps={[
            { icon: "❓", label: "A question", sub: "\"How many days of leave do I get?\"" },
            { icon: "📂", label: "Look it up", sub: "Find the right page in the HR handbook" },
            { icon: "📎", label: "Hand it over", sub: "Give that page to the model with the question" },
            { icon: "💬", label: "Answer", sub: "\"25 days, according to section 4 of the handbook\"" },
          ]}
        />
      ),
      points: [
        "Grounding means giving the model real, trusted information to base its answer on, instead of relying on memory.",
        "It's the difference between a closed-book exam and an open-book exam. With the right page in front of you, you're far less likely to guess.",
        "The information can be your company's own documents, or fresh public information from Google Search.",
      ],
      tip: "When a question involves private company facts or very recent news, the answer usually involves grounding.",
      check: ["gail-b3-05", "gail-b3-06"],
    },

    // ───── Exam lessons
    {
      id: "d3-limits",
      task: "3.1",
      title: "Model limitations and how to fix them",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🗃️", title: "Data dependency", text: "Answers are only as good as the data. Biased or incomplete data shows up in the output.", color: "#ea4335" },
              { icon: "📅", title: "Knowledge cutoff", text: "The model knows nothing about events after its training date.", color: "#ea4335" },
              { icon: "⚖️", title: "Bias & fairness", text: "Bias in the training data can get stronger in the answers.", color: "#ea4335" },
              { icon: "🌀", title: "Hallucinations", text: "Confident answers that aren't accurate or based on real information.", color: "#ea4335" },
              { icon: "🧪", title: "Edge cases", text: "Rare, unusual inputs that show up the model's weak spots.", color: "#ea4335" },
            ]}
          />
          <Ladder
            rungs={[
              { icon: "✍️", name: "Prompt engineering", text: "Clearer instructions, examples and roles. No training." },
              { icon: "📎", name: "Grounding and RAG", text: "Tie answers to sources you can check: your own data or Google Search." },
              { icon: "🎛️", name: "Fine-tuning", text: "Extra training for one task or field." },
            ]}
          />
          <div className="rounded-xl border border-emerald-400/30 bg-emerald-400/5 p-3 text-sm text-slate-200">
            🧑‍⚖️ <b className="text-emerald-200">Human in the loop (HITL)</b> works alongside all of these. Use it for content moderation, sensitive fields like healthcare and
            finance, high-stakes decisions, and reviews before or after the model generates.
          </div>
        </div>
      ),
      points: [
        "If the model is out of date, ground it in current sources. If it makes things up about your business, ground it in your own data.",
        "Fine-tuning gives a pre-trained model extra training for one task or field. It costs more time and money than prompting.",
        "With human in the loop (HITL), people check the output. That can happen before answers reach users, or on an ongoing basis after launch.",
      ],
      tip: "Grounding fixes missing or out-of-date knowledge. Fine-tuning changes behaviour or style. Don't pick fine-tuning to add facts that change every week.",
      check: ["d3-01", "d3-06"],
    },
    {
      id: "d3-monitor",
      task: "3.1",
      title: "Keep models healthy in production",
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#fbbc04"
            steps={[
              { icon: "🏷️", label: "Version", sub: "Record every model version in Model Registry" },
              { icon: "📈", label: "Track", sub: "Review performance metrics and business KPIs" },
              { icon: "🌊", label: "Watch for drift", sub: "Model Monitoring spots accuracy changes over time" },
              { icon: "🩹", label: "Patch and upgrade", sub: "Security patches, updates and model upgrades" },
            ]}
            loop="Agent Platform Pipelines can run this cycle automatically"
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧮", title: "Agent Platform Feature Store", text: "Manages the data features your models use." },
              { icon: "🔁", title: "Agent Platform Pipelines", text: "Automates ML tasks and workflows." },
              { icon: "🗂️", title: "Model Registry", text: "Keeps track of model versions so you can roll back." },
            ]}
          />
        </div>
      ),
      points: [
        "Checking a model isn't a one-off job. After launch you keep watching it, measuring it and improving it.",
        "Drift is when a model's accuracy changes over time, usually because the real world has changed. For example, shoppers' habits shift after a price rise.",
        "Versioning means keeping a record of each model version. You can compare them, and go back to an older one if an update goes wrong.",
      ],
      check: ["d3-09", "d3-10"],
    },
    {
      id: "d3-prompting",
      task: "3.2",
      title: "Prompt engineering techniques",
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={3}
            tiles={[
              { icon: "0️⃣", title: "Zero-shot", text: "Just the task, with no examples.", color: "#4285f4" },
              { icon: "1️⃣", title: "One-shot", text: "One example for the model to copy.", color: "#4285f4" },
              { icon: "🔢", title: "Few-shot", text: "Several examples so it can spot the pattern.", color: "#4285f4" },
              { icon: "🎭", title: "Role prompting", text: "Give the model a persona to shape its style, tone and focus.", color: "#34a853" },
              { icon: "⛓️", title: "Prompt chaining", text: "A back-and-forth series where each step builds on the last.", color: "#34a853" },
              { icon: "🪞", title: "Metaprompting", text: "Use prompts to write, change or explain other prompts.", color: "#34a853" },
            ]}
          />
          <Tiles
            tiles={[
              { icon: "🧮", title: "Chain-of-thought (CoT)", text: "Walk the model through the reasoning steps of a problem with several stages.", color: "#fbbc04" },
              { icon: "🔁", title: "ReAct (reason + act)", text: "The model thinks, takes an action like calling a tool, looks at the result, and repeats.", color: "#fbbc04" },
            ]}
          />
        </div>
      ),
      points: [
        "Prompt engineering is the skill of writing inputs that get the most out of a model. No training is involved.",
        "Adding examples helps when the output has to follow a set format. You can give none (zero-shot), one (one-shot) or several (few-shot).",
        "You can save time by reusing good prompts as templates, chaining steps in one conversation, saving details in Gemini and using Gems.",
      ],
      tip: "ReAct is the technique behind agents that use tools. Chain-of-thought is about showing the reasoning steps, not calling tools.",
      check: ["d3-15", "d3-19"],
    },
    {
      id: "d3-grounding",
      task: "3.3",
      title: "Grounding and RAG",
      visual: (
        <div className="grid gap-5">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🏢", title: "First-party enterprise data", text: "Your own documents, policies, products and records.", color: "#34a853" },
              { icon: "🤝", title: "Third-party data", text: "Data from outside providers, like a market data feed you pay for.", color: "#fbbc04" },
              { icon: "🌐", title: "World data", text: "Current public information, for example through Grounding with Google Search.", color: "#4285f4" },
            ]}
          />
          <RagSteps />
          <GroundingLab />
        </div>
      ),
      points: [
        "Grounding ties a model's answer to sources you can check. That cuts down on hallucinations.",
        "RAG (retrieval-augmented generation) finds the relevant information, adds it to the prompt and then writes an answer from it. The model itself doesn't change.",
        "Google Cloud gives you three ways to ground: prebuilt RAG with Agent Search, the RAG APIs, and Grounding with Google Search.",
      ],
      tip: "For private company facts, ground in your enterprise data. For fresh public facts, use Grounding with Google Search.",
      check: ["d3-22", "d3-25"],
    },
    {
      id: "d3-sampling",
      task: "3.3",
      title: "Sampling parameters and settings",
      visual: <SamplingDial />,
      points: [
        "A token is a chunk of text, roughly a short word or a punctuation mark. The number of tokens drives both cost and how much fits in the context window.",
        "Temperature controls how random the model's word choices are. Keep it low for facts and consistency, and raise it for creative work.",
        "Top-p limits the model to the most likely next tokens, stopping once their combined probability reaches p. For example, 0.9 means the top 90%.",
        "Safety settings filter out harmful content. Output length caps how much the model writes.",
      ],
      check: ["d3-27", "d3-28"],
    },
  ],

  questions: [
    // ───── Start here (beginner)
    {
      id: "gail-b3-01",
      level: "beginner",
      domain: "d3",
      lesson: "d3-b-mistakes",
      prompt: "A chatbot confidently tells a customer about a discount code that never existed. What is this called?",
      options: ["A hallucination", "A prompt", "A backup", "A token"],
      answer: [0],
      explanation:
        "A hallucination is when a model makes something up and presents it as fact. It happens because the model is built to produce likely-sounding text, not to check the truth.",
    },
    {
      id: "gail-b3-02",
      level: "beginner",
      domain: "d3",
      lesson: "d3-b-mistakes",
      prompt: "You ask a model about something that happened last week, and it has no idea. What's the most likely reason?",
      options: [
        "It only knows what was in its training data, which ended before last week",
        "It's broken and needs to be reinstalled",
        "It's refusing to answer on purpose",
        "Your question was too short",
      ],
      answer: [0],
      explanation:
        "A model learns from data collected up to a certain date, called its knowledge cutoff. Anything after that date simply isn't in its memory unless you give it a fresh source.",
    },
    {
      id: "gail-b3-03",
      level: "beginner",
      domain: "d3",
      lesson: "d3-b-prompts",
      prompt: "Which prompt is most likely to get a useful result?",
      options: [
        "\"Write a polite two-sentence reply to a customer whose parcel arrived late, and offer free delivery next time.\"",
        "\"Reply.\"",
        "\"Write something.\"",
        "\"Customer, parcel, late.\"",
      ],
      answer: [0],
      explanation:
        "The first prompt says what to write, how long it should be, the tone and what to include. The more clearly you brief the model, the closer its first answer will be to what you need.",
    },
    {
      id: "gail-b3-04",
      level: "beginner",
      domain: "d3",
      lesson: "d3-b-prompts",
      prompt: "You want the model's answers in a very specific layout. What's a quick way to get that?",
      options: [
        "Include an example of the layout in your prompt",
        "Retrain the model from scratch",
        "Use shorter words",
        "Ask the same vague question again",
      ],
      answer: [0],
      explanation:
        "Models are good at copying a pattern they can see. Showing one or two examples of the layout is usually faster and cheaper than any kind of training.",
    },
    {
      id: "gail-b3-05",
      level: "beginner",
      domain: "d3",
      lesson: "d3-b-grounding",
      prompt: "An HR assistant answers questions by first looking up the right page of the staff handbook and handing it to the model. What is this called?",
      options: ["Grounding", "Hallucinating", "Guessing", "Encryption"],
      answer: [0],
      explanation:
        "Grounding means giving the model trusted information to base its answer on. It works like an open-book exam, so the model doesn't have to rely on memory.",
    },
    {
      id: "gail-b3-06",
      level: "beginner",
      domain: "d3",
      lesson: "d3-b-grounding",
      prompt: "Why do companies ground a model in their own documents?",
      options: [
        "So answers about their own policies and products are accurate",
        "So the model runs without electricity",
        "So nobody needs to write prompts any more",
        "So the model forgets everything else it knows",
      ],
      answer: [0],
      explanation:
        "A public model has never seen a company's private documents, so it can only guess about them. Grounding hands it the real facts, which makes its answers more accurate.",
    },
    {
      id: "gail-b3-07",
      level: "beginner",
      domain: "d3",
      lesson: "d3-b-mistakes",
      prompt: "An AI drafts letters that tell patients about their test results. What's the sensible safeguard?",
      options: [
        "Have a doctor review each letter before it's sent",
        "Send the letters straight away to save time",
        "Make the letters as long as possible",
        "Let patients guess what the letters mean",
      ],
      answer: [0],
      explanation:
        "When a mistake could hurt someone, a person should check the AI's work first. This is called having a human in the loop, and it's standard practice in fields like healthcare.",
    },
    {
      id: "gail-b3-08",
      level: "beginner",
      domain: "d3",
      lesson: "d3-b-prompts",
      prompt: "Starting a prompt with \"You are a friendly tour guide\" is an example of what?",
      options: ["Giving the model a role", "Training the model", "Deleting the model's memory", "Grounding in company data"],
      answer: [0],
      explanation:
        "Giving the model a role, or persona, shapes its tone and focus. It's a simple prompting trick that needs no training at all.",
    },

    // ───── d3-limits
    {
      id: "d3-01",
      domain: "d3",
      lesson: "d3-limits",
      prompt:
        "A compliance assistant gives outdated guidance about a regulation that changed last month, after the model was trained. Which limitation is this, and what is the BEST mitigation?",
      options: [
        "Knowledge cutoff; ground the model in current sources",
        "Edge case; raise the temperature",
        "Bias; remove all examples from the prompt",
        "Context window; switch to an image model",
      ],
      answer: [0],
      explanation: "A model only knows what was in its training data up to a cutoff date. Grounding it in current sources gives it the newer information.",
    },
    {
      id: "d3-02",
      domain: "d3",
      lesson: "d3-limits",
      prompt: "A support chatbot confidently describes a 90-day return policy that the company never offered. What is this called?",
      options: ["A hallucination", "Model drift", "A knowledge cutoff", "Prompt chaining"],
      answer: [0],
      explanation: "A hallucination is an answer that sounds believable but isn't accurate or based on real information. Grounding the bot in the real policy helps.",
    },
    {
      id: "d3-03",
      domain: "d3",
      lesson: "d3-limits",
      prompt:
        "A claims model handles typical claims well but produces strange results for rare claim types it has seldom seen, such as damage from a meteorite. Which limitation does this show?",
      options: ["Edge cases", "Knowledge cutoff", "Latency", "Data accessibility"],
      answer: [0],
      explanation: "Edge cases are rare, unusual situations. Because the model has seen so few of them, they show up its weak spots and lead to odd results.",
    },
    {
      id: "d3-04",
      domain: "d3",
      lesson: "d3-limits",
      prompt: "A model trained on an incomplete product catalog gives incomplete product answers. Which limitation BEST explains the root cause?",
      options: ["Data dependency", "Temperature setting", "Context window size", "Output length"],
      answer: [0],
      explanation: "A foundation model depends heavily on its data. If the data is biased or incomplete, the answers will be too.",
    },
    {
      id: "d3-05",
      domain: "d3",
      lesson: "d3-limits",
      type: "match",
      prompt: "Match each problem to the BEST mitigation.",
      pairs: [
        ["Doesn't know about yesterday's public news", "Grounding with Google Search"],
        ["Invents details about your internal policies", "RAG over your enterprise documents"],
        ["Outputs drive high-stakes medical decisions", "Human-in-the-loop review"],
        ["Must consistently perform a specialised task in your domain", "Fine-tuning"],
      ],
      explanation:
        "Fresh public facts need world data, and private facts need your own data. High-stakes decisions need people checking them, and a specialist task can justify fine-tuning.",
    },
    {
      id: "d3-06",
      domain: "d3",
      lesson: "d3-limits",
      prompt:
        "A hospital uses gen AI to draft patient discharge instructions. Errors could harm patients. Which practice should it add FIRST?",
      options: [
        "Human-in-the-loop review, so a clinician checks each draft before it reaches the patient",
        "A higher temperature for more varied wording",
        "Removing the system instructions to save tokens",
        "Publishing the drafts without review to gather feedback faster",
      ],
      answer: [0],
      explanation: "In sensitive fields like healthcare, HITL gives you expert oversight. A clinician checks each draft before it reaches a patient.",
    },
    {
      id: "d3-07",
      domain: "d3",
      lesson: "d3-limits",
      prompt: "Where does human in the loop (HITL) add the MOST value? (Choose two.)",
      options: [
        "High-stakes decisions such as loan approvals",
        "Moderating user-generated content where context matters",
        "Brainstorming internal team-lunch ideas",
        "Autocompleting low-risk internal notes",
        "Choosing a font for an internal slide",
      ],
      answer: [0, 1],
      explanation: "HITL matters most where mistakes are costly or the context is subtle, like high-risk decisions and content moderation. Lunch ideas and fonts don't need a reviewer.",
    },
    {
      id: "d3-08",
      domain: "d3",
      lesson: "d3-limits",
      prompt:
        "A manufacturer needs a model to consistently produce maintenance reports in its specialised format and terminology. Careful prompting and examples still fall short, and it has thousands of good example reports. What should it consider next?",
      options: ["Fine-tuning the model on the example reports", "Raising the temperature", "Grounding with Google Search", "Using a smaller context window"],
      answer: [0],
      explanation:
        "Fine-tuning gives a pre-trained model extra training for one task or field. It's the next step when prompting isn't enough and you have plenty of good examples to train on.",
    },

    // ───── d3-monitor
    {
      id: "d3-09",
      domain: "d3",
      lesson: "d3-monitor",
      prompt:
        "A demand-forecasting model was accurate at launch, but its accuracy has slowly declined over six months as customer behaviour changed. What is this, and which tool helps detect it?",
      options: ["Drift; Model Monitoring", "Hallucination; Google AI Studio", "Edge case; Gems", "Knowledge cutoff; Text-to-Speech API"],
      answer: [0],
      explanation: "Drift is when a model's accuracy changes over time. Model Monitoring watches for it, so the team knows when to retrain or adjust.",
    },
    {
      id: "d3-10",
      domain: "d3",
      lesson: "d3-monitor",
      type: "match",
      prompt: "Match each Agent Platform capability to what it does.",
      pairs: [
        ["Model Registry", "Track model versions"],
        ["Model Monitoring", "Watch for drift in accuracy"],
        ["Agent Platform Feature Store", "Manage the data features models use"],
        ["Agent Platform Pipelines", "Automate machine learning tasks"],
      ],
      explanation: "Together they cover versions, drift, the data features models use, and automation across the model's life.",
    },
    {
      id: "d3-11",
      domain: "d3",
      lesson: "d3-monitor",
      prompt: "Which practice reflects Google's recommendations for evaluating a gen AI solution after launch?",
      options: [
        "Track key performance indicators and model metrics continuously",
        "Evaluate once at launch, then freeze the model",
        "Skip security patches so behaviour never changes",
        "Avoid versioning to keep things simple",
      ],
      answer: [0],
      explanation: "Ongoing monitoring covers KPIs, performance tracking, drift, versioning, model upgrades and security patches. It never stops at launch.",
    },
    {
      id: "d3-12",
      domain: "d3",
      lesson: "d3-monitor",
      prompt: "After a model update, answer quality drops and the team wants to restore the previous model quickly. Which practice makes this possible?",
      options: ["Model versioning with Model Registry", "Raising top-p", "Few-shot prompting", "Grounding with Google Search"],
      answer: [0],
      explanation: "Versioning keeps a record of every model version, so you can compare them and go back to the one that worked.",
    },
    {
      id: "d3-13",
      domain: "d3",
      lesson: "d3-monitor",
      prompt: "Which are good practices for running gen AI models in production? (Choose two.)",
      options: [
        "Apply security patches and updates",
        "Monitor for drift",
        "Turn off logging to reduce noise",
        "Skip evaluation after model upgrades",
        "Deploy new versions without recording which one is live",
      ],
      answer: [0, 1],
      explanation: "Keep models secure and up to date, and keep an eye on their accuracy. Logging, evaluation and version tracking are what make that possible.",
    },

    // ───── d3-prompting
    {
      id: "d3-14",
      domain: "d3",
      lesson: "d3-prompting",
      prompt: "A user types: \"Write a two-sentence product description for a stainless-steel water bottle.\" There are no examples. Which technique is this?",
      options: ["Zero-shot prompting", "Few-shot prompting", "Chain-of-thought prompting", "Prompt tuning"],
      answer: [0],
      explanation: "Zero-shot prompting asks the model to do a task without giving it any examples.",
    },
    {
      id: "d3-15",
      domain: "d3",
      lesson: "d3-prompting",
      prompt:
        "A team wants support tickets tagged with one of five internal categories in an exact format. Its prompt includes six example tickets with the correct tags. Which technique is this?",
      options: ["Few-shot prompting", "Zero-shot prompting", "Role prompting", "Fine-tuning"],
      answer: [0],
      explanation: "Few-shot prompting gives the model several examples so it can pick up the pattern and format. No training is involved.",
    },
    {
      id: "d3-16",
      domain: "d3",
      lesson: "d3-prompting",
      type: "order",
      prompt: "A marketer uses prompt chaining to produce a launch email. Put the prompts in a sensible order.",
      items: [
        "Summarise the attached customer research",
        "From the summary, list three key messages",
        "Draft a launch email built on those messages",
        "Shorten the draft and make the tone friendlier",
      ],
      explanation: "In prompt chaining, each step builds on the answer before it, in the same conversation. The model keeps the context, and the result gets better at each step.",
    },
    {
      id: "d3-17",
      domain: "d3",
      lesson: "d3-prompting",
      prompt:
        "A prompt begins: \"You are an experienced, plain-spoken financial coach for first-time home buyers.\" Which technique is being used?",
      options: ["Role prompting", "ReAct prompting", "Zero-shot classification", "Metaprompting"],
      answer: [0],
      explanation: "Role prompting gives the model a persona, which shapes its style, tone and focus.",
    },
    {
      id: "d3-18",
      domain: "d3",
      lesson: "d3-prompting",
      prompt: "A user pastes a single sample customer reply and asks Gemini to write ten more in the same style. Which technique is this?",
      options: ["One-shot prompting", "Zero-shot prompting", "Few-shot prompting", "Prompt chaining"],
      answer: [0],
      explanation: "One-shot prompting gives the model exactly one example to learn from. Several examples would make it few-shot.",
    },
    {
      id: "d3-19",
      domain: "d3",
      lesson: "d3-prompting",
      prompt:
        "A planning team asks a model to calculate a multi-step staffing forecast and keeps getting wrong totals. Which technique is MOST likely to help?",
      options: [
        "Chain-of-thought prompting that guides the model through intermediate reasoning steps",
        "Role prompting as a famous novelist",
        "Raising the temperature",
        "Removing all context from the prompt",
      ],
      answer: [0],
      explanation: "Chain-of-thought prompting walks the model through the problem one step at a time. That helps a lot on tasks with several stages of reasoning.",
    },
    {
      id: "d3-20",
      domain: "d3",
      lesson: "d3-prompting",
      prompt:
        "An assistant must answer \"Where is my order?\" by reasoning about the request, looking up the order in a system, reading the result, and deciding what to do next. Which prompting technique supports this?",
      options: ["ReAct (reason and act) prompting", "Zero-shot prompting", "One-shot prompting", "Role prompting"],
      answer: [0],
      explanation: "ReAct lets a model mix thinking with actions, like calling a tool. It looks at each result before deciding what to do next.",
    },
    {
      id: "d3-21",
      domain: "d3",
      lesson: "d3-prompting",
      type: "match",
      prompt: "Match each prompting technique to its description.",
      pairs: [
        ["Zero-shot", "The task with no examples"],
        ["Few-shot", "Several examples showing the pattern"],
        ["Role prompting", "A persona that shapes style and tone"],
        ["Prompt chaining", "A sequence of prompts that build on each other"],
        ["Metaprompting", "Using the model to write or improve prompts"],
      ],
      explanation: "All of these shape the output without any training. Pick one based on how much guidance and structure the task needs.",
    },

    // ───── d3-grounding
    {
      id: "d3-22",
      domain: "d3",
      lesson: "d3-grounding",
      prompt: "In gen AI, what does grounding mean?",
      options: [
        "Connecting the model's output to verifiable sources of information",
        "Lowering the temperature to zero",
        "Training a model from scratch on company data",
        "Running the model on on-premises hardware",
      ],
      answer: [0],
      explanation: "Grounding ties answers to sources you can check, like company documents or Google Search. That makes the answers more accurate and easier to trust.",
    },
    {
      id: "d3-23",
      domain: "d3",
      lesson: "d3-grounding",
      type: "match",
      prompt: "Match each kind of grounding data to an example.",
      pairs: [
        ["First-party enterprise data", "Your company's own policies and product documents"],
        ["Third-party data", "A licensed data feed from an external provider"],
        ["World data", "Current public information found through Google Search"],
      ],
      explanation: "First-party data is your own. Third-party data comes from other organisations, and world data is information anyone can find publicly.",
    },
    {
      id: "d3-24",
      domain: "d3",
      lesson: "d3-grounding",
      type: "order",
      prompt: "Put the core steps of retrieval-augmented generation (RAG) in order.",
      items: ["Retrieve relevant information from external sources", "Add the retrieved information to the prompt", "Generate a response from the augmented prompt"],
      explanation: "First it retrieves the information, then it adds it to the prompt, then it generates the answer. If it needs more context, it can go back and retrieve again.",
    },
    {
      id: "d3-25",
      domain: "d3",
      lesson: "d3-grounding",
      prompt:
        "A news-summary assistant must answer questions about events from the past few hours with sources. Which Google Cloud grounding option fits BEST?",
      options: ["Grounding with Google Search", "Prebuilt RAG over internal HR documents", "Fine-tuning on last year's articles", "A lower top-p value"],
      answer: [0],
      explanation: "Grounding with Google Search connects the model to fresh public information. That gets around the knowledge cutoff for very recent events.",
    },
    {
      id: "d3-26",
      domain: "d3",
      lesson: "d3-grounding",
      prompt: "How does adding RAG typically affect a gen AI application's output? (Choose two.)",
      options: [
        "Answers become more accurate and current for the retrieved topics",
        "Answers can cite the sources they came from",
        "The model's weights are permanently retrained",
        "Errors become impossible",
        "Data quality no longer matters",
      ],
      answer: [0, 1],
      explanation:
        "RAG makes answers more relevant and lets them cite sources, without changing the model. But the answers are only as good as the information it finds, and mistakes can still happen.",
    },

    // ───── d3-sampling
    {
      id: "d3-27",
      domain: "d3",
      lesson: "d3-sampling",
      prompt:
        "A legal team wants contract summaries that are factual and as consistent as possible when the same document is summarised twice. How should temperature be set?",
      options: ["Low", "High", "It has no effect on consistency", "As high as the model allows"],
      answer: [0],
      explanation: "A low temperature makes the model's word choices focused and predictable. A high temperature adds creativity and variety, which is the opposite of what this team wants.",
    },
    {
      id: "d3-28",
      domain: "d3",
      lesson: "d3-sampling",
      prompt:
        "Which setting limits the model's word choices to the most likely tokens whose combined probability reaches a chosen threshold?",
      options: ["Top-p (nucleus sampling)", "Output length", "Safety settings", "Context window"],
      answer: [0],
      explanation: "Top-p sets how much of the probability the model's choices can cover, starting from the most likely tokens. It's another way to control how random the output is.",
    },
    {
      id: "d3-29",
      domain: "d3",
      lesson: "d3-sampling",
      type: "match",
      prompt: "Match each sampling setting to what it controls.",
      pairs: [
        ["Temperature", "How random or creative word choices are"],
        ["Top-p", "The share of the most likely tokens considered"],
        ["Output length", "The maximum length of the generated text"],
        ["Safety settings", "Filtering of harmful or inappropriate content"],
      ],
      explanation: "These settings let you adjust how the model behaves without changing the model or the prompt.",
    },
    {
      id: "d3-30",
      domain: "d3",
      lesson: "d3-sampling",
      prompt: "A children's education app must make sure the model never returns harmful or inappropriate content. Which settings are MOST directly designed for this?",
      options: ["Safety settings", "Top-p", "Token count", "Temperature"],
      answer: [0],
      explanation: "Safety settings filter out content that could be harmful or inappropriate. The other settings affect randomness and length, not safety.",
    },
    {
      id: "d3-31",
      domain: "d3",
      lesson: "d3-sampling",
      prompt: "Responses from a customer assistant are too long and token costs are rising. Which changes help? (Choose two.)",
      options: [
        "Lower the maximum output length",
        "Ask for a concise format in the prompt, such as three bullet points",
        "Raise the temperature",
        "Add more few-shot examples of long answers",
        "Switch the safety settings off",
      ],
      answer: [0, 1],
      explanation: "Capping the output length and asking for a short format both mean fewer tokens are generated. Since cost grows with token count, both bring the bill down.",
    },
  ],

  cards: [
    { id: "d3-c01", domain: "d3", kind: "concept", term: "Knowledge cutoff", definition: "A model knows nothing after its training date. You fix it by grounding the model in current sources." },
    { id: "d3-c02", domain: "d3", kind: "concept", term: "Hallucination", definition: "A confident answer that isn't accurate or based on real information." },
    { id: "d3-c03", domain: "d3", kind: "concept", term: "Human in the loop (HITL)", definition: "People reviewing and giving input as part of the ML workflow, before or after the model generates." },
    { id: "d3-c04", domain: "d3", kind: "concept", term: "Drift", definition: "A change in a model's accuracy over time. Model Monitoring detects it." },
    { id: "d3-c05", domain: "d3", kind: "concept", term: "Few-shot prompting", definition: "Putting several examples in the prompt so the model follows the pattern." },
    { id: "d3-c06", domain: "d3", kind: "concept", term: "Chain-of-thought", definition: "Walking the model through a problem one reasoning step at a time." },
    { id: "d3-c07", domain: "d3", kind: "concept", term: "ReAct", definition: "Reason and act. The model thinks, takes an action such as calling a tool, and looks at the result." },
    { id: "d3-c08", domain: "d3", kind: "concept", term: "Grounding", definition: "Tying output to sources you can check: your own data, third-party data or public world data." },
    { id: "d3-c09", domain: "d3", kind: "concept", term: "RAG", definition: "Retrieval-augmented generation. Find the relevant information, add it to the prompt, then write the answer." },
    {
      id: "d3-c10",
      domain: "d3",
      kind: "concept",
      term: "Temperature versus top-p",
      definition: "Temperature sets how random the choices are. Top-p limits choices to the most likely tokens, up to a combined probability of p.",
    },
    { id: "d3-c11", domain: "d3", kind: "service", term: "Grounding with Google Search", definition: "Grounds answers in fresh, public information from the web." },
    { id: "d3-c12", domain: "d3", kind: "service", term: "Model Registry", definition: "Keeps track of model versions so you can compare them and roll back." },
  ],

  challenges: [
    {
      id: "ch-grounding",
      domain: "d3",
      lesson: "d3-grounding",
      title: "Ground it right",
      goal: "Get an accurate answer, with a source, to both factual questions by picking the right grounding source for each.",
      hint: "One question is about a private company policy. The other is about yesterday's public news.",
      takeaway: "Ground private facts in your company's data and fresh public facts with Google Search. Creative tasks rarely need grounding.",
      render: (onSolved) => <GroundingLab goal="allGrounded" onSolved={onSolved} />,
    },
  ],
});
