import { CodeBlock, Flow, Layers, ServiceRows, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { AgentBuilderLab } from "../labs";
import { FoundryMap, SchemaExtraction } from "../visuals";

/**
 * Domain 2: Implement AI solutions by using Microsoft Foundry (55–60%).
 * Code samples follow the patterns in Microsoft Learn's AI-901 training modules.
 */

const CHAT_CODE = `
import os
from openai import OpenAI

client = OpenAI(
    base_url=os.environ["AZURE_OPENAI_ENDPOINT"],  # https://<resource>.openai.azure.com/openai/v1/
    api_key=os.environ["API_KEY"],
)

response = client.responses.create(
    model=os.environ["MODEL_DEPLOYMENT_NAME"],  # the deployment name you chose
    input=[
        {"role": "system", "content": "You're a concise travel assistant."},
        {"role": "user", "content": "Suggest three things to do in Lisbon."},
    ],
    max_output_tokens=300,
    temperature=0.7,
)
print(response.output_text)
`;

const AGENT_CODE = `
from azure.identity import DefaultAzureCredential
from azure.ai.projects import AIProjectClient

project = AIProjectClient(
    endpoint="https://<resource>.services.ai.azure.com/api/projects/<project>",
    credential=DefaultAzureCredential(),
)
agent = project.agents.get(agent_name="support-agent")
openai_client = project.get_openai_client()

response = openai_client.responses.create(
    input=[{"role": "user", "content": "Where is my order?"}],
    extra_body={"agent": {"name": agent.name, "type": "agent_reference"}},
)
print(response.output_text)
`;

const LANGUAGE_CODE = `
from azure.core.credentials import AzureKeyCredential
from azure.ai.textanalytics import TextAnalyticsClient

client = TextAnalyticsClient(endpoint=endpoint, credential=AzureKeyCredential(key))

lang = client.detect_language(["Bonjour, je cherche ma commande."])[0]
print(lang.primary_language.name, lang.primary_language.iso6391_name,
      lang.primary_language.confidence_score)

pii = client.recognize_pii_entities(["Call Sam on 555-0134."])[0]
print(pii.redacted_text)
for e in pii.entities:
    print(e.text, e.category, e.confidence_score)
`;

const SPEECH_CODE = `
import azure.cognitiveservices.speech as speechsdk

speech_config = speechsdk.SpeechConfig(subscription=key, endpoint=endpoint)
speech_config.speech_synthesis_voice_name = "en-US-Ava:DragonHDLatestNeural"

audio_out = speechsdk.audio.AudioOutputConfig(use_default_speaker=True)
synthesizer = speechsdk.SpeechSynthesizer(speech_config=speech_config, audio_config=audio_out)

result = synthesizer.speak_text_async("Your parcel arrives tomorrow.").get()
if result.reason == speechsdk.ResultReason.SynthesizingAudioCompleted:
    print("Spoken!")
`;

const VISION_CODE = `
response = client.responses.create(
    model=os.environ["MODEL_NAME"],  # a vision-enabled deployment
    input=[{
        "role": "user",
        "content": [
            {"type": "input_text", "text": "Which animal is this? Answer in one line."},
            {"type": "input_image", "image_url": image_url},  # URL or base64 data URL
        ],
    }],
)
print(response.output_text)
`;

const EXTRACT_CODE = `
from azure.ai.contentunderstanding import ContentUnderstandingClient
from azure.core.credentials import AzureKeyCredential

client = ContentUnderstandingClient(endpoint=endpoint, credential=AzureKeyCredential(key))

poller = client.begin_analyze(
    analyzer_id="prebuilt-invoice",
    inputs=[{"url": "https://example.com/invoice.pdf"}],
)
result = poller.result()  # long-running operation: waits until analysis is done

for content in result.contents:
    print(content.markdown)  # the document as markdown
    print(content.fields)    # schema fields with values and confidence
`;

export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "Implement AI solutions by using Microsoft Foundry",
    world: "The Foundry Forge",
    // Official range is 55–60%; 58 keeps the two domains at 100.
    weight: 58,
    emoji: "🔨",
    color: "#f97316",
    summary: "Prompts, deploying and calling models, agents, and lightweight Python apps for text, speech, vision, and information extraction.",
  },

  tasks: [
    {
      id: "2.1",
      title: "Implement generative AI apps and agents by using Foundry",
      covers: [
        "Write effective system and user prompts",
        "Deploy a model and interact with it in the Foundry portal",
        "Build a lightweight chat client with the Foundry SDK",
        "Create and test a single-agent solution in the Foundry portal",
        "Build a lightweight client application for an agent",
      ],
    },
    {
      id: "2.2",
      title: "Implement AI solutions for text and speech by using Foundry",
      covers: [
        "Build a lightweight application that includes text analysis",
        "Respond to spoken prompts with a deployed multimodal model",
        "Build a lightweight application with Azure Speech in Foundry Tools",
      ],
    },
    {
      id: "2.3",
      title: "Implement computer vision and image-generation solutions by using Foundry",
      covers: [
        "Interpret visual input in prompts with a deployed multimodal model",
        "Create new visual outputs with generative models",
        "Build a lightweight application that includes vision capabilities",
      ],
    },
    {
      id: "2.4",
      title: "Implement information extraction solutions by using Foundry",
      covers: [
        "Extract information from documents and forms with Azure Content Understanding in Foundry Tools",
        "Extract information from images with Content Understanding",
        "Extract information from audio and video with Content Understanding",
        "Build a lightweight application with information extraction capabilities",
      ],
    },
  ],

  lessons: [
    {
      id: "d2-prompts",
      check: ["d2-01", "d2-04"],
      task: "2.1",
      title: "System prompts, user prompts, and grounding",
      visual: (
        <div className="grid gap-5">
          <Layers
            layers={[
              { name: "System prompt (set by the app)", color: "#38bdf8", items: ["Role", "Tone", "Rules and constraints", "Output format"] },
              { name: "Conversation history", color: "#a78bfa", items: ["Earlier prompts", "Earlier responses (often summarized)"] },
              { name: "Grounding data (RAG)", color: "#34d399", items: ["Retrieved policy sections", "Documents", "Emails"] },
              { name: "User prompt", color: "#f97316", items: ["The question or instruction"] },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🎯", title: "Be clear and specific", text: "Explicit instructions beat vague language.", color: "#f97316" },
              { icon: "🧭", title: "Add context", text: "Topic, audience, and format.", color: "#f97316" },
              { icon: "🧩", title: "Use examples", text: "Show the style you want.", color: "#f97316" },
              { icon: "📐", title: "Ask for structure", text: "Bullets, tables, numbered lists.", color: "#f97316" },
            ]}
          />
        </div>
      ),
      points: [
        "The system prompt sets behaviour, tone, tools, and guardrails. The user prompt is the end user's request.",
        "Apps keep conversation history and send it with each new prompt so follow-ups make sense.",
        "Retrieval-augmented generation (RAG) adds retrieved data to the prompt, so the answer is grounded in your content.",
      ],
      tip: "If an answer is generic when it should be specific to your organization, the fix is usually grounding, not a bigger model.",
    },
    {
      id: "d2-code",
      check: ["d2-12", "d2-16"],
      task: "2.1",
      title: "From the Foundry playground to code",
      visual: (
        <div className="grid gap-5">
          <FoundryMap />
          <Flow
            color="#f97316"
            steps={[
              { icon: "🗂️", label: "Create a project", sub: "In a Foundry resource" },
              { icon: "🚀", label: "Deploy a model", sub: "From the model catalog" },
              { icon: "🧪", label: "Playground", sub: "Prompts, temperature, max output tokens, system instructions" },
              { icon: "💻", label: "Client app", sub: "Same settings in code via the Responses API" },
            ]}
          />
          <CodeBlock lang="python" code={CHAT_CODE} caption="A lightweight chat client. The playground can generate starter code like this for your deployment." />
        </div>
      ),
      points: [
        "Endpoints are protected: send an API key or a Microsoft Entra ID token. Keep keys in Azure Key Vault, not in code.",
        "Two common endpoints: the project endpoint (Foundry project and its resources) and model endpoints (prompts to deployments).",
        "The Foundry SDK has a project client (AIProjectClient) for Foundry operations and an OpenAI-compatible client for the Responses API.",
        "`model=` takes your deployment name; `response.output_text` holds the generated text.",
      ],
      tip: "Client: collect input, send the request, show the result. Server (your model deployment): run inference, apply instructions and safety, return output.",
    },
    {
      id: "d2-agents",
      check: ["d2-25", "d2-26"],
      task: "2.1",
      title: "Build, test, and call an agent",
      visual: (
        <div className="grid gap-5">
          <AgentBuilderLab />
          <CodeBlock lang="python" code={AGENT_CODE} caption="Calling a saved agent from a client app with the Foundry Projects SDK (azure-ai-projects)." />
        </div>
      ),
      points: [
        "An agent in Foundry packages a model, instructions, and tools. Tools are actions; knowledge is context.",
        "Tools include Code Interpreter, knowledge sources, custom functions or APIs, and MCP servers, managed in the Foundry Tool Catalog.",
        "Foundry IQ is a permission-aware knowledge layer: it indexes your sources and returns citation-backed answers.",
        "Save the model, instructions, and tools as an agent, then keep testing it in the playground.",
      ],
      tip: "Model on its own = one prompt in, one answer out. Agent = decides on steps, calls tools, keeps working memory in the conversation.",
    },
    {
      id: "d2-text",
      check: ["d2-38", "d2-43"],
      task: "2.2",
      title: "Build a text analysis app",
      visual: (
        <div className="grid gap-5">
          <ServiceRows
            rows={[
              { input: "Flexible, conversational analysis", service: "OpenAI library: client.responses.create", output: "Natural-language answer (can vary)" },
              { input: "Consistent structured values", service: "Azure Language SDK: TextAnalyticsClient", output: "Codes, categories, scores" },
              { input: "An agent that needs text analysis", service: "Azure Language MCP server", output: "Deterministic results as a tool" },
            ]}
          />
          <CodeBlock lang="python" code={LANGUAGE_CODE} caption="pip install azure-ai-textanalytics. Endpoint and key come from your Foundry resource." />
        </div>
      ),
      points: [
        "Store the endpoint, key, and deployment name in a .env file and read them with load_dotenv() and os.getenv().",
        "detect_language() returns the language name, ISO 639-1 code, and a confidence score between 0 and 1.",
        "recognize_pii_entities() returns redacted text plus each entity's category and confidence score.",
        "With a Foundry resource you don't need a separate Azure Language resource to use the Azure Language MCP server.",
      ],
    },
    {
      id: "d2-speech",
      check: ["d2-49", "d2-56"],
      task: "2.2",
      title: "Speech apps and voice agents",
      visual: (
        <div className="grid gap-5">
          <Flow
            color="#f472b6"
            steps={[
              { icon: "🗣️", label: "Speech to text", sub: "SpeechRecognizer turns the user's audio into text" },
              { icon: "🧠", label: "Reason", sub: "An agent or model decides what to say" },
              { icon: "🔊", label: "Text to speech", sub: "SpeechSynthesizer speaks the reply" },
            ]}
            loop="Voice Live wraps this whole speech-to-speech loop in one managed API"
          />
          <CodeBlock lang="python" code={SPEECH_CODE} caption="pip install azure-cognitiveservices-speech. A recognizer works the same way with AudioConfig(use_default_microphone=True)." />
        </div>
      ),
      points: [
        "Real-time transcription streams audio from a microphone or file. Batch transcription processes stored files asynchronously, on a best-effort schedule.",
        "Choose the voice with speech_synthesis_voice_name. Neural voices sound most natural.",
        "Voice Live (package azure-ai-voicelive) combines speech recognition, a generative model, and speech synthesis for real-time voice conversations.",
        "Voice mode puts Voice Live into a Foundry agent's definition, so the client needs less code.",
      ],
      tip: "A multimodal model that accepts audio can respond to a spoken prompt directly, without a separate transcription step.",
    },
    {
      id: "d2-vision",
      check: ["d2-60", "d2-65"],
      task: "2.3",
      title: "See and create: vision and generation",
      visual: (
        <div className="grid gap-5">
          <CodeBlock lang="python" code={VISION_CODE} caption="A multi-part message: text plus an image, sent to a vision-enabled deployment through the Responses API." />
          <Tiles
            cols={3}
            tiles={[
              { icon: "👁️", title: "Understand images", text: "GPT-4.1 family and GPT-5 series: describe, answer questions, read charts and screenshots.", color: "#fb923c" },
              { icon: "🎨", title: "Generate images", text: "GPT-Image-1.5 (recommended start), GPT-Image-1, GPT-Image-1-Mini; partner models such as FLUX.", color: "#fb923c" },
              { icon: "🎬", title: "Generate video", text: "Sora models: an async job you create, poll, then download as MP4.", color: "#fb923c" },
            ]}
          />
        </div>
      ),
      points: [
        "Images go in a prompt as a URL or as base64 data. Base64 turns binary bytes into text that fits in JSON.",
        "In the Responses API, add tools=[{\"type\": \"image_generation\"}] to create an image; the output item of type image_generation_call holds base64 image data.",
        "Sora 2 supports text to video, image to video, and video remix, and can generate audio. Sora models include responsible AI restrictions.",
      ],
    },
    {
      id: "d2-extract",
      check: ["d2-72", "d2-73"],
      task: "2.4",
      title: "Extract information with Content Understanding",
      visual: (
        <div className="grid gap-5">
          <SchemaExtraction />
          <Flow
            color="#34d399"
            steps={[
              { icon: "📥", label: "Ingest", sub: "Documents, images, audio, or video" },
              { icon: "🧠", label: "Analyze", sub: "OCR, speech recognition, language understanding, multimodal models" },
              { icon: "🧾", label: "Structured output", sub: "JSON that matches your schema" },
            ]}
          />
          <CodeBlock lang="python" code={EXTRACT_CODE} caption="pip install azure-ai-contentunderstanding" />
        </div>
      ),
      points: [
        "A schema lists the fields you want and their structure, including collections such as invoice line items.",
        "An analyzer applies the same schema to every request and returns predictable JSON. Use a prebuilt analyzer or build a custom one.",
        "Prebuilt analyzers include prebuilt-invoice, prebuilt-imageSearch, prebuilt-audioSearch, and prebuilt-videoSearch.",
        "Analysis is asynchronous: the SDK's poller waits for you; with REST you poll the Operation-Location URL.",
      ],
      tip: "Fields, schemas, and analyzers across documents, images, audio, and video → Azure Content Understanding in Foundry Tools.",
    },
  ],

  questions: [
    // ───── d2-prompts ─────
    {
      id: "d2-01",
      domain: "d2",
      lesson: "d2-prompts",
      prompt: "You want every response from your assistant to be friendly, to cite sources, and to decline medical advice. Where should you put these rules?",
      options: ["In the system prompt", "In each user prompt", "In the deployment's TPM setting", "In the model's name"],
      answer: [0],
      explanation: "The system prompt sets behaviour, tone, and constraints for the whole conversation. The user prompt is the specific request.",
    },
    {
      id: "d2-02",
      domain: "d2",
      lesson: "d2-prompts",
      prompt: "\"Summarize the attached Q3 sales report in five bullet points for the regional managers.\" What kind of prompt is this?",
      options: ["A user prompt", "A system prompt", "An embedding", "A deployment type"],
      answer: [0],
      explanation: "A user prompt asks for a response to a specific question or instruction.",
    },
    {
      id: "d2-03",
      domain: "d2",
      lesson: "d2-prompts",
      prompt: "After asking about Q3 results, a user types \"And how did Q4 compare?\" The model understands \"Q4\" refers to the same report. What makes this work?",
      options: [
        "The app sends the conversation history with the new prompt",
        "The model was retrained on the report overnight",
        "The deployment type is Global Batch",
        "The temperature is set to 0",
      ],
      answer: [0],
      explanation: "Apps include previous prompts and responses (often summarized) so follow-up questions have context.",
    },
    {
      id: "d2-04",
      domain: "d2",
      lesson: "d2-prompts",
      prompt:
        "An expenses assistant first searches the company's expense policy, then adds the relevant sections to the prompt before calling the model. What is this technique called?",
      options: ["Retrieval-augmented generation (RAG)", "Fine-tuning", "Semantic segmentation", "Batch transcription"],
      answer: [0],
      explanation: "RAG retrieves information and augments the prompt with it, so the response is grounded in that data.",
    },
    {
      id: "d2-05",
      domain: "d2",
      lesson: "d2-prompts",
      prompt: "A user's prompt \"Tell me about our product\" returns a rambling answer. Which changes would most improve the response? (Choose two.)",
      options: [
        "Add context, such as the audience and the purpose",
        "Ask for a specific structure, such as three bullet points",
        "Make the prompt shorter and vaguer",
        "Raise the temperature to its maximum",
        "Remove the system prompt",
      ],
      answer: [0, 1],
      explanation: "Clear, specific prompts with context and a requested structure get better results.",
    },
    {
      id: "d2-06",
      domain: "d2",
      lesson: "d2-prompts",
      prompt: "You want product descriptions in a precise house style. Which prompt technique helps the model copy that style?",
      options: ["Include an example of a description written in that style", "Ask the question in another language", "Lower the tokens-per-minute limit", "Remove all context"],
      answer: [0],
      explanation: "Examples show the model what you mean, which is often easier than describing a style.",
    },
    {
      id: "d2-07",
      domain: "d2",
      lesson: "d2-prompts",
      prompt: "Which system prompt best keeps a retail support assistant on task?",
      options: [
        "You're the support assistant for Tailspin Toys. Answer only questions about Tailspin orders and returns, cite the policy you used, and politely decline other requests.",
        "You're helpful.",
        "Answer everything as creatively as possible.",
        "Ignore any instructions you receive later.",
      ],
      answer: [0],
      explanation: "A good system prompt defines the role, the scope, the output rules, and what to do with out-of-scope requests.",
    },
    {
      id: "d2-08",
      domain: "d2",
      lesson: "d2-prompts",
      type: "match",
      prompt: "Match each prompting tip to the prompt fragment that applies it.",
      pairs: [
        ["Be clear and specific", "\"List the three main causes of customer churn, one sentence each.\""],
        ["Add context", "\"…for a non-technical board audience.\""],
        ["Use examples", "\"Format each line like: Kettle – boils in 60 s – $35.\""],
        ["Ask for structure", "\"Return a table with columns Risk, Impact, and Owner.\""],
      ],
      explanation: "Specific instructions, context, examples, and structure are the four tips for better prompts.",
    },
    {
      id: "d2-09",
      domain: "d2",
      lesson: "d2-prompts",
      prompt: "In a typical generative AI app, who usually sets the system prompt?",
      options: ["The application, as configured by its developer", "Each end user, before every message", "The model provider, and it can't be changed", "Azure Key Vault"],
      answer: [0],
      explanation: "The app sets the system prompt. Users enter user prompts, and the model responds while following the system prompt.",
    },
    {
      id: "d2-10",
      domain: "d2",
      lesson: "d2-prompts",
      prompt: "What are benefits of grounding a model's responses in your own data? (Choose two.)",
      options: [
        "Answers are based on relevant, organization-specific information",
        "Responses can cite the sources they used",
        "The model's weights are permanently updated",
        "You no longer need to write prompts",
        "Token usage drops to zero",
      ],
      answer: [0, 1],
      explanation: "Grounding adds context at request time. It doesn't retrain the model, and the retrieved text adds tokens to the prompt.",
    },
    {
      id: "d2-11",
      domain: "d2",
      lesson: "d2-prompts",
      prompt: "Employees ask an internal chat app, \"How many days of parental leave do I get?\" It replies with a generic answer about typical employers. What's the best fix?",
      options: [
        "Ground the app in the company's HR policy documents",
        "Raise the temperature",
        "Switch to an image-generation model",
        "Lower the max output tokens",
      ],
      answer: [0],
      explanation: "The model has never seen your policy. Retrieving the policy and adding it to the prompt (RAG) gives a specific, citable answer.",
    },

    // ───── d2-code ─────
    {
      id: "d2-12",
      domain: "d2",
      lesson: "d2-code",
      prompt: "Which Azure resource provides model hosting, the agent service, quotas, monitoring, and the security boundary for your Foundry work?",
      options: ["A Foundry resource", "A Foundry project", "A model deployment", "A .env file"],
      answer: [0],
      explanation: "The Foundry resource is the Azure resource. Projects are workspaces inside it.",
    },
    {
      id: "d2-13",
      domain: "d2",
      lesson: "d2-code",
      prompt: "Your team wants a separate workspace for each AI use case, holding its own agents, evaluations, datasets, vector indexes, and connections. What should you create for each use case?",
      options: ["A Foundry project inside the team's Foundry resource", "A new Azure subscription", "A new Azure Speech resource", "A separate model catalog"],
      answer: [0],
      explanation: "One Foundry resource can hold many Foundry projects, each focused on one use case.",
    },
    {
      id: "d2-14",
      domain: "d2",
      lesson: "d2-code",
      prompt: "Before writing code, you want to try prompts against a deployed model, adjust temperature and system instructions, and compare models. Where should you do this?",
      options: ["The playground in the Foundry portal", "Azure Key Vault", "The Content Understanding analyzer list", "The Azure Language SDK"],
      answer: [0],
      explanation: "Foundry playgrounds let you test prompts and capture working settings, and can show matching code.",
    },
    {
      id: "d2-15",
      domain: "d2",
      lesson: "d2-code",
      type: "order",
      prompt: "Put these steps in order to build an AI app with the Foundry portal.",
      items: [
        "Sign in to the Foundry portal and create a Foundry project",
        "Pick a model from the model catalog and deploy it",
        "Experiment with prompts and parameters in the playground",
        "Use the deployed model from your own client application",
      ],
      explanation: "Project → deployment → playground → client app.",
    },
    {
      id: "d2-16",
      domain: "d2",
      lesson: "d2-code",
      prompt: "You deployed the gpt-4.1 model and named the deployment \"travel-chat\". In client.responses.create(model=...), what value should you pass?",
      code: `response = client.responses.create(
    model=???,
    input="Suggest a weekend in Porto.",
)`,
      codeLang: "python",
      options: ["\"travel-chat\"", "\"gpt-4.1\" always, whatever the deployment is named", "Your Foundry project name", "Your API key"],
      answer: [0],
      explanation: "The model parameter takes the deployment name. It only matches the model name if you didn't rename the deployment.",
    },
    {
      id: "d2-17",
      domain: "d2",
      lesson: "d2-code",
      prompt: "In this chat client, which expression gives you the model's generated text?",
      code: `response = client.responses.create(
    model=deployment_name,
    input=[{"role": "user", "content": "Hello!"}],
)
print(???)`,
      codeLang: "python",
      options: ["response.output_text", "response.input", "client.endpoint", "response.temperature"],
      answer: [0],
      explanation: "With the Responses API, output_text collects the text output of the response.",
    },
    {
      id: "d2-18",
      domain: "d2",
      lesson: "d2-code",
      prompt: "A client app calls a protected Foundry endpoint. Which can it present to prove it's authorized? (Choose two.)",
      options: [
        "An API key for the resource",
        "A Microsoft Entra ID token, for example obtained through DefaultAzureCredential",
        "The deployment name on its own",
        "The model card",
        "The tokens-per-minute value",
      ],
      answer: [0, 1],
      explanation: "Foundry endpoints accept an API key or a token for valid Microsoft Entra ID credentials.",
    },
    {
      id: "d2-19",
      domain: "d2",
      lesson: "d2-code",
      prompt: "A developer has hard-coded a Foundry API key in source code that's pushed to GitHub. Where should the key be kept instead?",
      options: [
        "In Azure Key Vault, read at runtime by the app's managed identity",
        "In the system prompt",
        "In a public README file",
        "In the model deployment name",
      ],
      answer: [0],
      explanation: "Secrets such as API keys belong in Azure Key Vault, retrieved securely at runtime, not in code or repositories.",
    },
    {
      id: "d2-20",
      domain: "d2",
      lesson: "d2-code",
      prompt: "You have an AIProjectClient connected to your Foundry project. Which method gives you an OpenAI-compatible client for calling models and agents through the Responses API?",
      options: ["get_openai_client()", "begin_analyze()", "speak_text_async()", "detect_language()"],
      answer: [0],
      explanation: "The Foundry SDK's project client handles Foundry operations; get_openai_client() returns the OpenAI-compatible client.",
    },
    {
      id: "d2-21",
      domain: "d2",
      lesson: "d2-code",
      prompt: "Which best describes a lightweight client application for a Foundry model?",
      options: [
        "A small app, often one Python file, that collects input, calls the remote model, and shows the result",
        "An app that runs the model's weights locally on the user's laptop",
        "A full web framework with its own database and backend logic",
        "A tool that trains new foundation models",
      ],
      answer: [0],
      explanation: "Lightweight clients keep state and compute mostly on the server and have a small code footprint.",
    },
    {
      id: "d2-22",
      domain: "d2",
      lesson: "d2-code",
      prompt: "In a client-server AI app built on Foundry, which is the server's responsibility?",
      options: [
        "Run inference on the model deployment and apply system instructions and safety",
        "Show a chat window to the user",
        "Collect the user's typed or spoken input",
        "Format the user's input into a request",
      ],
      answer: [0],
      explanation: "The model deployment is the server. The client presents the UI, collects input, sends the request, and displays output.",
    },
    {
      id: "d2-23",
      domain: "d2",
      lesson: "d2-code",
      prompt: "Review the code. Which statements are true? (Choose two.)",
      code: `response = client.responses.create(
    model="support-chat",
    input=[{"role": "system", "content": "You're a polite support agent."},
           {"role": "user", "content": "My order is late."}],
    max_output_tokens=300,
    temperature=0.7,
)`,
      codeLang: "python",
      options: [
        "The reply is capped at 300 output tokens",
        "The system message sets the assistant's behaviour",
        "This call fine-tunes the model",
        "A temperature of 0.7 makes the output fully deterministic",
        "The input is sent to Azure Language for sentiment analysis",
      ],
      answer: [0, 1],
      explanation: "max_output_tokens caps length, and the system role sets behaviour. Only temperature 0 approaches deterministic output.",
    },
    {
      id: "d2-24",
      domain: "d2",
      lesson: "d2-code",
      prompt: "An app sends an HTTP POST to a Foundry endpoint with an Authorization header and a JSON body containing \"model\" and \"input\". What does it get back?",
      options: [
        "A JSON response whose output includes the model's generated message",
        "An MP4 file",
        "A new Foundry project",
        "A redirect to the Foundry portal sign-in page",
      ],
      answer: [0],
      explanation: "Endpoints expose REST interfaces: requests and responses have headers and a JSON body. SDKs build these REST calls for you.",
    },

    // ───── d2-agents ─────
    {
      id: "d2-25",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "In Microsoft Foundry, which three things does an agent bring together?",
      options: [
        "A model, instructions, and tools",
        "A Foundry resource, a subscription, and a region",
        "An analyzer, a schema, and a poller",
        "A voice, a microphone, and a speaker",
      ],
      answer: [0],
      explanation: "The model reasons, the instructions define the agent's role and rules, and the tools let it act.",
    },
    {
      id: "d2-26",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "An HR agent must answer from the company's internal PDFs and SharePoint pages, with citations. What should you add to the agent?",
      options: ["Knowledge connected to those sources", "A higher temperature", "Image generation", "A Global Batch deployment"],
      answer: [0],
      explanation: "Knowledge gives the agent retrieved context (RAG). Responses that use knowledge include a citation.",
    },
    {
      id: "d2-27",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "A user uploads a CSV of monthly sales and asks the agent to calculate growth and plot a chart. Which tool should the agent have?",
      options: ["Code Interpreter", "Azure Language PII detection", "Text to speech", "Sora"],
      answer: [0],
      explanation: "Code Interpreter lets the agent run code for data analysis and file handling.",
    },
    {
      id: "d2-28",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "What is the Model Context Protocol (MCP)?",
      options: [
        "An open standard for connecting AI agents to external tools and data through MCP servers",
        "A Microsoft deployment type for reasoning models",
        "A file format for prompts",
        "A metric that scores groundedness",
      ],
      answer: [0],
      explanation: "The agent is the MCP client. An MCP server exposes tools, and the agent can discover and call them without custom integration code.",
    },
    {
      id: "d2-29",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "Which Foundry capability gives agents a permission-aware knowledge base across sources such as Blob Storage, SharePoint, and OneLake, and returns citation-backed results?",
      options: ["Foundry IQ", "Azure Speech", "The Foundry model leaderboard", "Azure Key Vault"],
      answer: [0],
      explanation: "Foundry IQ handles indexing, chunking, and embeddings, uses agentic retrieval, and only returns what the user may see.",
    },
    {
      id: "d2-30",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "Where in Foundry can you discover and centrally configure the tools your agents use?",
      options: ["The Foundry Tool Catalog", "The model catalog's benchmark tab", "The Speech playground", "Azure Policy"],
      answer: [0],
      explanation: "Tools such as MCP servers, Code Interpreter, and knowledge sources are managed through the Foundry Tool Catalog.",
    },
    {
      id: "d2-31",
      domain: "d2",
      lesson: "d2-agents",
      type: "order",
      prompt: "Put the steps for creating and testing a single agent in the Foundry portal in order.",
      items: [
        "Choose the model the agent will use",
        "Write the agent's instructions",
        "Add tools and knowledge",
        "Save the configuration as an agent",
        "Test and refine the agent in the playground",
      ],
      explanation: "Model → instructions → tools and knowledge → save → keep testing.",
    },
    {
      id: "d2-32",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "In this client code, which part tells Foundry to answer with your saved agent rather than a plain model?",
      code: `openai_client = project.get_openai_client()
response = openai_client.responses.create(
    input=[{"role": "user", "content": "What can you help with?"}],
    extra_body={"agent": {"name": agent.name, "type": "agent_reference"}},
)`,
      codeLang: "python",
      options: [
        "The extra_body agent reference with the agent's name",
        "The input list",
        "The get_openai_client() call on its own",
        "The role value \"user\"",
      ],
      answer: [0],
      explanation: "The agent_reference in extra_body routes the request to the named agent with its instructions and tools.",
    },
    {
      id: "d2-33",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "You're writing a client app for an agent you built in the portal. Where can you find the agent identifier and endpoint values to use?",
      options: [
        "In the agent's code view in the playground, under its environment variables",
        "In the model's benchmark results",
        "In the Azure Speech voice gallery",
        "In the Content Understanding JSON output",
      ],
      answer: [0],
      explanation: "The playground's code view lists the .env variables, including the agent identifier, for your client app.",
    },
    {
      id: "d2-34",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "What does an agent add compared with calling a model directly with one prompt? (Choose two.)",
      options: [
        "It can call tools automatically to take real actions",
        "It can break a goal into steps and keep working memory during a conversation",
        "It changes the underlying model's weights",
        "It removes the need for a model",
        "It guarantees responses are never wrong",
      ],
      answer: [0, 1],
      explanation: "Models are raw intelligence. Agents are task-oriented workers built on them that decide on actions and call tools.",
    },
    {
      id: "d2-35",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "Which Python package and class do you use to connect to a Foundry project and retrieve an agent?",
      options: ["azure-ai-projects and AIProjectClient", "azure-ai-textanalytics and TextAnalyticsClient", "azure-cognitiveservices-speech and SpeechConfig", "azure-ai-contentunderstanding and ContentUnderstandingClient"],
      answer: [0],
      explanation: "The Foundry Projects SDK (azure-ai-projects) provides AIProjectClient, with agents.get() and get_openai_client().",
    },
    {
      id: "d2-36",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "You're preparing a customer-support agent for release. Which practices follow responsible AI and security guidance? (Choose two.)",
      options: [
        "Give the agent only the tools its job needs",
        "Test it in the playground with realistic and off-topic prompts before release",
        "Store the API key in the agent's instructions",
        "Turn on every tool in the catalog just in case",
        "Leave the instructions empty so the model decides",
      ],
      answer: [0, 1],
      explanation: "Fewer tools means fewer ways to go wrong, and testing shows how the agent behaves before customers see it.",
    },
    {
      id: "d2-37",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "Why does the agent client code pass DefaultAzureCredential() to AIProjectClient?",
      options: [
        "To authenticate with Microsoft Entra ID credentials available in the environment, instead of a key",
        "To select the agent's model",
        "To set the agent's temperature",
        "To encrypt the agent's responses",
      ],
      answer: [0],
      explanation: "DefaultAzureCredential picks up credentials such as a signed-in developer or a managed identity, so no key is in the code.",
    },

    // ───── d2-text ─────
    {
      id: "d2-38",
      domain: "d2",
      lesson: "d2-text",
      prompt: "Which pip package do you install to use the Azure Language Python SDK for language detection and PII detection?",
      options: ["azure-ai-textanalytics", "azure-cognitiveservices-speech", "azure-ai-voicelive", "azure-ai-contentunderstanding"],
      answer: [0],
      explanation: "The Azure Language Python SDK is azure-ai-textanalytics, which provides TextAnalyticsClient.",
    },
    {
      id: "d2-39",
      domain: "d2",
      lesson: "d2-text",
      prompt: "Which line correctly creates an Azure Language client with a key?",
      options: [
        "TextAnalyticsClient(endpoint=endpoint, credential=AzureKeyCredential(key))",
        "OpenAI(base_url=endpoint, api_key=key).detect_language()",
        "SpeechConfig(subscription=key, endpoint=endpoint)",
        "ContentUnderstandingClient(analyzer_id=key)",
      ],
      answer: [0],
      explanation: "TextAnalyticsClient takes the resource endpoint and an AzureKeyCredential (or an Entra ID credential).",
    },
    {
      id: "d2-40",
      domain: "d2",
      lesson: "d2-text",
      prompt: "After running this code, which property holds the two-letter language code such as \"es\"?",
      code: `result = client.detect_language(["¡Hola! Me llamo Josefina."])[0]`,
      codeLang: "python",
      options: ["result.primary_language.iso6391_name", "result.redacted_text", "result.output_text", "result.primary_language.voice_name"],
      answer: [0],
      explanation: "primary_language has name, iso6391_name, and confidence_score.",
    },
    {
      id: "d2-41",
      domain: "d2",
      lesson: "d2-text",
      prompt: "What does recognize_pii_entities() return for each document?",
      options: [
        "The redacted text and a list of entities with their category and confidence score",
        "A translated copy of the text",
        "A spoken audio file",
        "A new Foundry project",
      ],
      answer: [0],
      explanation: "You get both a redacted version of the text and the PII entities found.",
    },
    {
      id: "d2-42",
      domain: "d2",
      lesson: "d2-text",
      type: "match",
      prompt: "Match each TextAnalyticsClient method to what it does.",
      pairs: [
        ["detect_language", "Identifies the language with an ISO code and confidence"],
        ["recognize_pii_entities", "Finds personal information and returns redacted text"],
        ["analyze_sentiment", "Labels text positive, negative, neutral, or mixed"],
        ["extract_key_phrases", "Lists the main talking points"],
        ["recognize_entities", "Finds people, places, organizations, and dates"],
      ],
      explanation: "Each Azure Language capability has its own client method that returns structured results.",
    },
    {
      id: "d2-43",
      domain: "d2",
      lesson: "d2-text",
      prompt:
        "Your app sends each review to a chat model with the prompt \"What language is this?\" and gets slightly different wording every time. A downstream system needs a consistent language code and score. What should you do?",
      options: [
        "Use the Azure Language SDK's detect_language() instead",
        "Raise the temperature",
        "Use a video-generation model",
        "Add more examples to the system prompt and keep parsing free text",
      ],
      answer: [0],
      explanation: "Generative models are probabilistic. Azure Language returns the same structured fields every time.",
    },
    {
      id: "d2-44",
      domain: "d2",
      lesson: "d2-text",
      prompt: "You're using the OpenAI Python library to send text-analysis prompts to a deployed model. Which values must the client be configured with? (Choose two.)",
      options: [
        "The resource's endpoint URL",
        "An API key or Microsoft Entra ID token",
        "An Azure Speech voice name",
        "A Content Understanding analyzer ID",
        "A Language Studio project name",
      ],
      answer: [0, 1],
      explanation: "OpenAI(base_url=endpoint, api_key=key) authenticates the client; the deployment name is then passed as model on each call.",
    },
    {
      id: "d2-45",
      domain: "d2",
      lesson: "d2-text",
      prompt: "What is the Azure Language MCP server?",
      options: [
        "A managed service that exposes Azure Language capabilities to agents through MCP",
        "A database that stores every document Azure Language analyzes",
        "A speech model that reads text aloud",
        "A prebuilt Content Understanding analyzer",
      ],
      answer: [0],
      explanation: "Agents can call named entity recognition, sentiment analysis, language detection, and more through it without calling the REST API directly.",
    },
    {
      id: "d2-46",
      domain: "d2",
      lesson: "d2-text",
      prompt: "A support agent must reliably detect each ticket's language and redact PII before handing it to a human. How should you give the agent this capability?",
      options: [
        "Connect Azure Language in Foundry Tools to the agent as an MCP tool",
        "Ask the model to guess in its instructions",
        "Add the image generation tool",
        "Switch the deployment to Global Batch",
      ],
      answer: [0],
      explanation: "Adding Azure Language gives the agent deterministic, structured text analysis alongside the model's reasoning.",
    },
    {
      id: "d2-47",
      domain: "d2",
      lesson: "d2-text",
      prompt: "Why do the sample apps call load_dotenv() and then os.getenv(\"API_KEY\")?",
      options: [
        "To load configuration such as the endpoint and key from a .env file instead of hard-coding them",
        "To install the SDK packages",
        "To deploy the model",
        "To detect the language of the text",
      ],
      answer: [0],
      explanation: "load_dotenv() reads the .env file into environment variables. The names in code must match the names in the file exactly.",
    },
    {
      id: "d2-48",
      domain: "d2",
      lesson: "d2-text",
      prompt: "Which statements about Azure Language in Foundry Tools are true? (Choose two.)",
      options: [
        "It returns structured, deterministic results from purpose-built analyzers",
        "Agents can use it through the Azure Language MCP server",
        "You must train a custom model before you can detect a language",
        "It's mainly for converting speech to text",
        "It generates images from text",
      ],
      answer: [0, 1],
      explanation: "Language detection and PII detection work out of the box, and the MCP server makes them available to agents.",
    },

    // ───── d2-speech ─────
    {
      id: "d2-49",
      domain: "d2",
      lesson: "d2-speech",
      prompt: "Which pip package provides the Azure Speech SDK for speech to text and text to speech in Python?",
      options: ["azure-cognitiveservices-speech", "azure-ai-textanalytics", "openai", "azure-ai-projects"],
      answer: [0],
      explanation: "The Speech SDK is imported as azure.cognitiveservices.speech, usually aliased speechsdk.",
    },
    {
      id: "d2-50",
      domain: "d2",
      lesson: "d2-speech",
      prompt: "What do you pass to speechsdk.SpeechConfig() to connect to Azure Speech?",
      options: [
        "The Foundry resource key (subscription) and endpoint",
        "The model deployment name and temperature",
        "The analyzer ID and schema",
        "The agent name and agent_reference",
      ],
      answer: [0],
      explanation: "SpeechConfig(subscription=key, endpoint=endpoint) holds the connection details, plus settings such as the voice.",
    },
    {
      id: "d2-51",
      domain: "d2",
      lesson: "d2-speech",
      prompt: "You need to transcribe a user's speech from the default microphone. Which objects do you combine?",
      options: [
        "A SpeechRecognizer with an AudioConfig that uses the default microphone",
        "A SpeechSynthesizer with an AudioOutputConfig for the default speaker",
        "A TextAnalyticsClient with detect_language",
        "A ContentUnderstandingClient with prebuilt-invoice",
      ],
      answer: [0],
      explanation: "AudioConfig(use_default_microphone=True) sets the input, and SpeechRecognizer converts it to text.",
    },
    {
      id: "d2-52",
      domain: "d2",
      lesson: "d2-speech",
      prompt: "A company has thousands of recorded calls in Azure Storage and wants transcripts. Results aren't needed immediately. Which Azure Speech approach fits?",
      options: [
        "Batch transcription, pointing to the files with a SAS URI and receiving results asynchronously",
        "Real-time transcription from the default microphone",
        "Text to speech with a neural voice",
        "Voice Live with proactive engagement",
      ],
      answer: [0],
      explanation: "Batch transcription is asynchronous and scheduled on a best-effort basis, ideal for stored recordings.",
    },
    {
      id: "d2-53",
      domain: "d2",
      lesson: "d2-speech",
      prompt: "In a text-to-speech app, how do you choose which voice speaks the text?",
      options: [
        "Set speech_config.speech_synthesis_voice_name",
        "Pass the voice as the model parameter of responses.create",
        "Change the deployment type",
        "Set AudioConfig(use_default_microphone=True)",
      ],
      answer: [0],
      explanation: "The voice name, for example a neural voice, is a property of the SpeechConfig.",
    },
    {
      id: "d2-54",
      domain: "d2",
      lesson: "d2-speech",
      type: "match",
      prompt: "Match each Speech SDK object to its role.",
      pairs: [
        ["SpeechConfig", "Holds the key, endpoint, and settings such as the voice"],
        ["AudioConfig", "Sets the audio input, such as a microphone or file"],
        ["SpeechRecognizer", "Converts spoken audio into text"],
        ["SpeechSynthesizer", "Converts text into spoken audio"],
        ["AudioOutputConfig", "Sets where synthesized audio plays, such as the speaker"],
      ],
      explanation: "Config objects describe the connection and audio devices; the recognizer and synthesizer do the work.",
    },
    {
      id: "d2-55",
      domain: "d2",
      lesson: "d2-speech",
      type: "order",
      prompt: "Put the stages of a speech-to-speech voice assistant in order.",
      items: [
        "The user speaks into a microphone",
        "Speech to text converts the audio into text",
        "An agent or model reasons over the text and drafts a reply",
        "Text to speech turns the reply into audio",
        "The user hears the spoken response",
      ],
      explanation: "Speech-to-speech is a pipeline: recognition, processing or reasoning, then synthesis.",
    },
    {
      id: "d2-56",
      domain: "d2",
      lesson: "d2-speech",
      prompt: "You want to build a real-time voice agent without wiring up speech to text, a model, and text to speech yourself. Which Azure Speech capability should you use?",
      options: ["Voice Live", "Batch transcription", "Azure Language PII detection", "Content Understanding prebuilt-audioSearch"],
      answer: [0],
      explanation: "The Voice Live API combines everything into one fully managed service for real-time spoken conversations.",
    },
    {
      id: "d2-57",
      domain: "d2",
      lesson: "d2-speech",
      prompt: "What does enabling Voice mode on a Microsoft Foundry agent in the playground do?",
      options: [
        "Integrates Azure Speech Voice Live into the agent definition, reducing the client code you need",
        "Converts the agent into an image-generation model",
        "Moves the agent to a Global Batch deployment",
        "Removes the agent's instructions",
      ],
      answer: [0],
      explanation: "Speech configuration is encapsulated in the agent itself.",
    },
    {
      id: "d2-58",
      domain: "d2",
      lesson: "d2-speech",
      prompt: "A developer wants a deployed model to understand a user's spoken question directly, without writing separate transcription code. What should they deploy?",
      options: ["A multimodal model that accepts audio input", "An embedding model", "An image-generation model", "A text-only small language model"],
      answer: [0],
      explanation: "Multimodal models can take audio as input and respond to it, which is how you answer spoken prompts with a deployed model.",
    },
    {
      id: "d2-59",
      domain: "d2",
      lesson: "d2-speech",
      prompt: "After calling synthesizer.speak_text_async(text).get(), which checks does well-written code perform? (Choose two.)",
      options: [
        "Compare result.reason with ResultReason.SynthesizingAudioCompleted to confirm success",
        "If the reason is Canceled, read cancellation_details to find the error",
        "Read response.output_text",
        "Poll the Operation-Location URL",
        "Call begin_analyze on the result",
      ],
      answer: [0, 1],
      explanation: "The result reason tells you whether audio was produced; cancellation details explain failures such as a wrong key or endpoint.",
    },

    // ───── d2-vision ─────
    {
      id: "d2-60",
      domain: "d2",
      lesson: "d2-vision",
      prompt: "You're sending an image and a question to a vision-enabled model with the Responses API. How is the user message structured?",
      options: [
        "A content list with an input_text part and an input_image part",
        "Two separate API calls: one for the image, one for the text",
        "The image pasted into the system prompt as a file path on your laptop",
        "An image-generation tool call",
      ],
      answer: [0],
      explanation: "A single request can include text and image parts together; the model processes both to respond.",
    },
    {
      id: "d2-61",
      domain: "d2",
      lesson: "d2-vision",
      prompt: "In what forms can you provide an image to a multimodal model in a prompt?",
      options: ["As a URL or as base64-encoded image data", "Only as a printed copy", "Only as a link to a Foundry project", "Only as an MP4 file"],
      answer: [0],
      explanation: "Base64 converts binary image bytes into text so the image can travel inside JSON.",
    },
    {
      id: "d2-62",
      domain: "d2",
      lesson: "d2-vision",
      prompt: "Which line in this request attaches the photo?",
      code: `input=[{
    "role": "user",
    "content": [
        {"type": "input_text", "text": "What animal is this?"},
        {"type": "input_image", "image_url": photo_url},
    ],
}]`,
      codeLang: "python",
      options: [
        "{\"type\": \"input_image\", \"image_url\": photo_url}",
        "{\"type\": \"input_text\", \"text\": \"What animal is this?\"}",
        "\"role\": \"user\"",
        "None of them: images must be uploaded separately",
      ],
      answer: [0],
      explanation: "The input_image part carries the image URL or data URL; input_text carries the question.",
    },
    {
      id: "d2-63",
      domain: "d2",
      lesson: "d2-vision",
      prompt: "Using the Responses API with an image-generation deployment, what do you add to the request so the model creates an image?",
      options: ["tools=[{\"type\": \"image_generation\"}]", "temperature=0", "max_output_tokens=1", "extra_body={\"agent\": ...}"],
      answer: [0],
      explanation: "The image_generation tool tells the model to produce an image from the prompt.",
    },
    {
      id: "d2-64",
      domain: "d2",
      lesson: "d2-vision",
      prompt: "In the response to an image-generation request, where is the generated image?",
      options: [
        "In the result of the output item whose type is image_generation_call, as base64 data",
        "In response.output_text as a description",
        "At a URL in the system prompt",
        "In the deployment's TPM setting",
      ],
      answer: [0],
      explanation: "Decode the base64 result and write the bytes to a file such as a PNG.",
    },
    {
      id: "d2-65",
      domain: "d2",
      lesson: "d2-vision",
      prompt: "You're starting a new branding project that needs high-quality image creation and precise editing. Which model family does Microsoft recommend starting with in Foundry?",
      options: ["The GPT-Image-1 family, especially GPT-Image-1.5", "text-embedding-3-small", "Sora 1", "Phi-4 text-only models"],
      answer: [0],
      explanation: "GPT-Image-1.5 offers improved quality, editing support, and enterprise readiness.",
    },
    {
      id: "d2-66",
      domain: "d2",
      lesson: "d2-vision",
      prompt: "An internal tool generates thousands of rough concept images a day. Cost and latency matter more than maximum fidelity. Which model fits best?",
      options: ["GPT-Image-1-Mini", "GPT-Image-1.5", "Sora 2", "An embedding model"],
      answer: [0],
      explanation: "GPT-Image-1-Mini is the lighter, more cost-efficient version for experimentation and high volume.",
    },
    {
      id: "d2-67",
      domain: "d2",
      lesson: "d2-vision",
      prompt: "A marketing team wants short promotional video clips generated from text and reference images. Which models in Foundry generate video natively?",
      options: ["Sora models such as Sora 2", "GPT-4.1-mini", "FLUX", "Azure Speech neural voices"],
      answer: [0],
      explanation: "Sora models are the native video generation models in Foundry. Other multimodal models don't output video.",
    },
    {
      id: "d2-68",
      domain: "d2",
      lesson: "d2-vision",
      type: "order",
      prompt: "Put the steps for generating a video with the Sora 2 REST API in order.",
      items: [
        "Send a POST request that creates a video job and returns a video ID",
        "Poll the job's status until it's completed",
        "Download the finished MP4 content",
      ],
      explanation: "Video generation is resource-intensive, so it runs as an asynchronous job: create, poll, download.",
    },
    {
      id: "d2-69",
      domain: "d2",
      lesson: "d2-vision",
      prompt: "Which statements about Sora 2 in Foundry are true? (Choose two.)",
      options: [
        "It supports text-to-video and image-to-video generation",
        "Generation runs as an asynchronous job",
        "It returns the finished video instantly in the same HTTP response",
        "It's an embedding model",
        "It has no responsible AI restrictions",
      ],
      answer: [0, 1],
      explanation: "Sora 2 also supports video remix and audio generation, and includes restrictions such as limits on real people and copyrighted characters.",
    },
    {
      id: "d2-70",
      domain: "d2",
      lesson: "d2-vision",
      prompt: "You're building a Python app that identifies animals in safari photos with a vision-enabled model. What does the app need? (Choose two.)",
      options: [
        "The Foundry resource endpoint and a key or Entra ID credential",
        "The name of the vision-enabled model deployment",
        "An Azure Speech voice name",
        "A Content Understanding audio analyzer",
        "A Data Zone Batch deployment",
      ],
      answer: [0, 1],
      explanation: "Create the OpenAI client with the endpoint and key, then pass the deployment name as the model with a multi-part prompt.",
    },

    // ───── d2-extract ─────
    {
      id: "d2-71",
      domain: "d2",
      lesson: "d2-extract",
      prompt: "Which sequence describes how Azure Content Understanding processes content?",
      options: [
        "Ingest content, analyze it with AI, return structured output such as JSON",
        "Generate content, translate it, speak it aloud",
        "Deploy a model, set the temperature, chat in the playground",
        "Tokenize, embed, decode the next token",
      ],
      answer: [0],
      explanation: "Analysis combines OCR, speech recognition, natural language understanding, and multimodal models.",
    },
    {
      id: "d2-72",
      domain: "d2",
      lesson: "d2-extract",
      prompt: "In Azure Content Understanding, what does a schema define?",
      options: [
        "Which fields to extract and how they're structured, including nested fields and collections",
        "Which Azure region processes the data",
        "Which voice reads the result aloud",
        "How many tokens per minute the deployment allows",
      ],
      answer: [0],
      explanation: "For an invoice, a schema might include vendor name, invoice number, and an Items collection with description, unit price, and quantity.",
    },
    {
      id: "d2-73",
      domain: "d2",
      lesson: "d2-extract",
      prompt: "What is an analyzer in Azure Content Understanding?",
      options: [
        "A unit that applies the same extraction logic and schema to all content and returns predictable JSON",
        "A person who reviews every result by hand",
        "A deployment type for reasoning models",
        "A tool that generates new documents",
      ],
      answer: [0],
      explanation: "You choose a prebuilt analyzer or create a custom one; it applies its schema consistently to every request.",
    },
    {
      id: "d2-74",
      domain: "d2",
      lesson: "d2-extract",
      type: "match",
      prompt: "Match each prebuilt Content Understanding analyzer to the content it's designed for.",
      pairs: [
        ["prebuilt-invoice", "Invoices"],
        ["prebuilt-imageSearch", "Images"],
        ["prebuilt-audioSearch", "Audio recordings"],
        ["prebuilt-videoSearch", "Video files"],
      ],
      explanation: "Prebuilt analyzers cover common scenarios; build a custom analyzer when you need your own fields.",
    },
    {
      id: "d2-75",
      domain: "d2",
      lesson: "d2-extract",
      prompt: "Which package and client class do you use to call Azure Content Understanding from Python?",
      options: [
        "azure-ai-contentunderstanding and ContentUnderstandingClient",
        "azure-ai-textanalytics and TextAnalyticsClient",
        "openai and OpenAI",
        "azure-ai-voicelive and VoiceLiveClient",
      ],
      answer: [0],
      explanation: "ContentUnderstandingClient takes your Foundry endpoint and a credential.",
    },
    {
      id: "d2-76",
      domain: "d2",
      lesson: "d2-extract",
      prompt: "Why does this code call poller.result() after begin_analyze()?",
      code: `poller = client.begin_analyze(analyzer_id="prebuilt-invoice", inputs=inputs)
result = poller.result()`,
      codeLang: "python",
      options: [
        "Analysis is a long-running asynchronous operation, and result() waits until it completes",
        "result() deletes the analyzer after use",
        "result() converts the invoice into speech",
        "result() deploys a new model",
      ],
      answer: [0],
      explanation: "begin_analyze starts the operation; the poller handles polling for you.",
    },
    {
      id: "d2-77",
      domain: "d2",
      lesson: "d2-extract",
      prompt: "For each item in result.contents, what does an invoice analysis typically return?",
      options: [
        "Markdown of the content plus fields with values, types, and confidence scores",
        "An MP4 video of the invoice",
        "Only a sentiment score",
        "A list of model deployments",
      ],
      answer: [0],
      explanation: "For example, CustomerName with a string value and a confidence such as 0.95, and InvoiceDate with a date value.",
    },
    {
      id: "d2-78",
      domain: "d2",
      lesson: "d2-extract",
      prompt: "You want each voicemail turned into fields: caller, message summary, requested actions, and callback number. What should you use?",
      options: [
        "Azure Content Understanding with an audio analyzer and a schema for those fields",
        "Azure Speech text to speech",
        "An image-generation model",
        "Azure Language language detection",
      ],
      answer: [0],
      explanation: "Content Understanding applies a schema to audio, returning a transcript and the extracted insights as JSON.",
    },
    {
      id: "d2-79",
      domain: "d2",
      lesson: "d2-extract",
      prompt: "From conference-room camera snapshots, a facilities team wants location, in-person attendees, remote attendees, and total attendees as data. Which approach fits?",
      options: [
        "Apply a Content Understanding schema with those fields to the images",
        "Use speech to text on the images",
        "Run sentiment analysis on the image file names",
        "Generate a new image with GPT-Image-1",
      ],
      answer: [0],
      explanation: "Content Understanding extracts schema-defined fields from images as well as documents, audio, and video.",
    },
    {
      id: "d2-80",
      domain: "d2",
      lesson: "d2-extract",
      prompt: "Which statements about custom analyzers in Azure Content Understanding are true? (Choose two.)",
      options: [
        "You define a schema listing the fields you need",
        "The analyzer applies the same schema consistently to every request",
        "You must first train your own OCR model from scratch",
        "They only work on audio",
        "They return free-form text only, never JSON",
      ],
      answer: [0, 1],
      explanation: "Custom analyzers let you tailor the fields, and their structured JSON output is easy to store, search, or automate.",
    },
    {
      id: "d2-81",
      domain: "d2",
      lesson: "d2-extract",
      prompt: "You call Azure Content Understanding through its REST API instead of the SDK. After you submit content, what must your app do?",
      options: [
        "Poll the Operation-Location URL until the analysis succeeds",
        "Read the result from the response body immediately",
        "Call the speech synthesizer",
        "Open the Foundry portal to approve the request",
      ],
      answer: [0],
      explanation: "Because analysis is asynchronous, the REST pattern is submit, then poll until the job succeeds.",
    },
  ],

  cards: [
    { id: "s-foundry", domain: "d2", kind: "service", term: "Microsoft Foundry", definition: "Platform to build, deploy, and manage AI apps and agents on Azure" },
    { id: "s-foundry-resource", domain: "d2", kind: "service", term: "Foundry resource", definition: "The Azure resource: model hosting, agent service, quotas, security boundary" },
    { id: "s-foundry-project", domain: "d2", kind: "service", term: "Foundry project", definition: "Workspace in a resource for agents, evaluations, datasets, and connections" },
    { id: "s-playground", domain: "d2", kind: "service", term: "Foundry playground", definition: "Try prompts and parameters on a deployment, then copy the settings into code" },
    { id: "s-responses", domain: "d2", kind: "service", term: "Responses API", definition: "OpenAI-compatible API for calling deployed models and agents" },
    { id: "s-projects-sdk", domain: "d2", kind: "service", term: "Foundry SDK (azure-ai-projects)", definition: "AIProjectClient for Foundry operations, agents, and get_openai_client()" },
    { id: "s-agent-service", domain: "d2", kind: "service", term: "Foundry Agent Service", definition: "Runs agents: tool calls, threading, safety controls, and observability" },
    { id: "s-foundry-iq", domain: "d2", kind: "service", term: "Foundry IQ", definition: "Permission-aware knowledge layer that gives agents grounded, cited answers" },
    { id: "s-tool-catalog", domain: "d2", kind: "service", term: "Foundry Tool Catalog", definition: "Discover and centrally manage the tools agents can call" },
    { id: "s-language-mcp", domain: "d2", kind: "service", term: "Azure Language MCP server", definition: "Exposes Azure Language text analysis to agents as MCP tools" },
    { id: "s-speech", domain: "d2", kind: "service", term: "Azure Speech in Foundry Tools", definition: "Speech to text, text to speech, translation, and speaker recognition" },
    { id: "s-voice-live", domain: "d2", kind: "service", term: "Voice Live", definition: "Managed real-time speech-to-speech conversations for voice agents" },
    { id: "s-vision", domain: "d2", kind: "service", term: "Azure Vision in Foundry Tools", definition: "Prebuilt analysis of content in images and videos" },
    { id: "s-content-understanding", domain: "d2", kind: "service", term: "Azure Content Understanding in Foundry Tools", definition: "Schema-based extraction from documents, images, audio, and video" },
    { id: "s-gpt-image", domain: "d2", kind: "service", term: "GPT-Image-1.5", definition: "Recommended starting model for image generation and editing in Foundry" },
    { id: "s-sora", domain: "d2", kind: "service", term: "Sora 2", definition: "Video generation: text, image, or video in; async job; MP4 out" },
    { id: "s-entra", domain: "d2", kind: "service", term: "Microsoft Entra ID", definition: "Identity for keyless authentication and role-based access to AI resources" },
    { id: "s-keyvault", domain: "d2", kind: "service", term: "Azure Key Vault", definition: "Stores secrets such as API keys, read at runtime with managed identity" },
    { id: "s-translator", domain: "d2", kind: "service", term: "Azure Translator in Foundry Tools", definition: "AI translation across more than 100 languages and dialects" },
    { id: "s-content-safety", domain: "d2", kind: "service", term: "Content Safety in Foundry Tools", definition: "Detects unwanted or harmful content in text and images" },
    { id: "c-system-prompt", domain: "d2", kind: "concept", term: "System prompt", definition: "Sets the model's role, tone, rules, and output format; set by the app" },
    { id: "c-rag", domain: "d2", kind: "concept", term: "Retrieval-augmented generation", definition: "Retrieve relevant data and add it to the prompt to ground the answer" },
    { id: "c-mcp", domain: "d2", kind: "concept", term: "Model Context Protocol (MCP)", definition: "Open standard connecting agents (clients) to tools exposed by MCP servers" },
    { id: "c-code-interpreter", domain: "d2", kind: "concept", term: "Code Interpreter", definition: "Agent tool that runs code for data analysis and file handling" },
    { id: "c-deployment-name", domain: "d2", kind: "concept", term: "Deployment name", definition: "The name you give a deployed model; pass it as model= in code" },
    { id: "c-batch-transcription", domain: "d2", kind: "concept", term: "Batch transcription", definition: "Asynchronous transcription of stored audio files via SAS URIs" },
    { id: "c-base64", domain: "d2", kind: "concept", term: "Base64", definition: "Encodes binary files such as images as text so they fit in JSON" },
    { id: "c-schema", domain: "d2", kind: "concept", term: "Schema (Content Understanding)", definition: "The fields to extract and their structure, applied by meaning" },
    { id: "c-analyzer", domain: "d2", kind: "concept", term: "Analyzer", definition: "Applies a schema consistently and returns predictable JSON" },
  ],

  challenges: [
    {
      id: "ch-agent-allpass",
      domain: "d2",
      lesson: "d2-agents",
      title: "Pass every test prompt",
      goal: "Configure the agent's instructions and tools so all four playground test prompts pass.",
      hint: "Each failing test needs something different: knowledge, Code Interpreter, Azure Language, or tighter instructions.",
      takeaway: "Knowledge grounds answers, tools take actions, and instructions keep the agent in its lane.",
      render: (onSolved) => <AgentBuilderLab goal="allPass" onSolved={onSolved} />,
    },
    {
      id: "ch-agent-lean",
      domain: "d2",
      lesson: "d2-agents",
      title: "The lean agent",
      goal: "Pass all four tests without giving the agent any tool it doesn't need.",
      hint: "None of the test prompts asks for a picture.",
      takeaway: "Give agents only the tools their job requires: fewer tools, fewer ways to misbehave.",
      render: (onSolved) => <AgentBuilderLab goal="lean" onSolved={onSolved} />,
    },
  ],
});
