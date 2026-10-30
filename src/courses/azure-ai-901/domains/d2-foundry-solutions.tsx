import { CodeBlock, Flow, Ladder, Layers, ServiceRows, Tiles } from "@/components/learn/blocks";
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

const FIRST_CALL_CODE = `
response = client.responses.create(
    model="my-chat",           # the name you gave your deployment
    input="Say hello in French.",
)
print(response.output_text)  # Bonjour !
`;

export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "Building with Microsoft Foundry",
    world: "The Foundry Forge",
    // Official range is 55–60%; 58 keeps the two domains at 100.
    weight: 58,
    emoji: "🔨",
    color: "#f97316",
    summary:
      "Writing good prompts, deploying and calling models, building agents, and small Python apps that work with text, speech, images, and documents.",
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
    // ───── Start here (beginner) ─────
    {
      id: "d2-b-foundry",
      level: "beginner",
      check: ["ai901-b2-01", "ai901-b2-02"],
      task: "2.1",
      title: "Microsoft Foundry: your AI workshop",
      visual: (
        <Ladder caption="each one sits inside the one below"
          rungs={[
            { icon: "🏢", name: "Foundry resource", text: "The building. It holds the models, the billing, and the security." },
            { icon: "🗂️", name: "Foundry project", text: "One workbench inside, for one job, such as a support bot." },
            { icon: "🚀", name: "Deployment", text: "A model plugged in and switched on, ready to answer." },
            { icon: "🧪", name: "Playground", text: "A test bench where you try prompts before writing any code." },
          ]}
        />
      ),
      points: [
        "Azure is Microsoft's cloud: computers you rent over the internet instead of buying your own.",
        "Microsoft Foundry is the part of Azure where you build with AI. Picture a workshop with a wall of tools and a few workbenches.",
        "You don't train models yourself here. You pick a ready-made one from the catalog and deploy it, which means switching it on so your apps can use it.",
        "Before writing code, you can chat with your deployed model in the playground to see how it behaves.",
      ],
      tip: "Keep the order in your head: resource, then project, then deployment, then playground, then your own app.",
    },
    {
      id: "d2-b-first-call",
      level: "beginner",
      check: ["ai901-b2-03", "ai901-b2-04"],
      sources: [{ title: "Managed identities for Azure resources", url: "https://learn.microsoft.com/en-us/entra/identity/managed-identities-azure-resources/overview", license: "CC BY 4.0" }],
      task: "2.1",
      title: "How an app talks to a model",
      visual: (
        <div className="grid gap-5">
          <Flow
            color="#f97316"
            steps={[
              { icon: "📱", label: "Your app", sub: "Collects what the user typed" },
              { icon: "📮", label: "Endpoint", sub: "The model's web address" },
              { icon: "🧠", label: "Deployed model", sub: "Writes the reply" },
              { icon: "💬", label: "Back to your app", sub: "Shows the reply to the user" },
            ]}
          />
          <CodeBlock lang="python" code={FIRST_CALL_CODE} caption="The heart of a chat app: send a prompt to your deployment, then print the reply." />
        </div>
      ),
      points: [
        "Your model lives in the cloud. Your app sends it a message over the internet and waits for the reply, a bit like ordering at a takeaway counter.",
        "The endpoint is the model's web address. You also send a key or a sign-in token, which proves you're allowed to use it.",
        "In the code you name your deployment, not the model family. If you called your deployment my-chat, you pass my-chat.",
        "Python is the language used in AI-901 examples. You only need to read short snippets like the one shown here.",
        "Never paste an API key into shared code. Keep it somewhere safe, such as **Azure Key Vault**.",
        "For example, a chat app sends the model a system message (\"you are a polite travel helper\") plus the user's question, and gets back one reply message.",
      ],
      tip: "Treat an API key like a house key. Don't paste it into code you share, and don't put it in a prompt.",
    },
    {
      id: "d2-b-tools",
      level: "beginner",
      check: ["ai901-b2-05", "ai901-b2-06"],
      task: "2.2",
      title: "Ready-made tools for text, speech, and documents",
      visual: (
        <ServiceRows
          rows={[
            { input: "A customer review", service: "Azure Language", output: "Which language it is, and its mood" },
            { input: "A voice note", service: "Azure Speech", output: "The words as text" },
            { input: "Some text", service: "Azure Speech", output: "Spoken audio" },
            { input: "A scanned invoice", service: "Azure Content Understanding", output: "Vendor, date, and total as fields" },
          ]}
        />
      ),
      points: [
        "A chat model is like a chef: flexible, but the dish comes out a little different each time.",
        "Foundry Tools are more like kitchen appliances. A toaster does one job and does it the same way every time.",
        "Azure Language handles text, Azure Speech handles voice, and Azure Content Understanding pulls named fields out of documents, images, audio, and video.",
        "When another program needs the answer in a fixed format, such as a language code, an appliance is usually the better pick.",
        "For example, a call centre can turn recordings into text with Speech, then score each transcript's sentiment with Language, with no model training at all.",
        "Pitfall: building a custom model for a job a prebuilt tool already does, such as reading invoices. Try the prebuilt option first.",
      ],
      tip: "Ask yourself: do I need a conversation, or the same tidy answer every time? Conversation points to a model. Tidy answers point to a Foundry Tool.",
    },

    // ───── Exam lessons ─────
    {
      id: "d2-prompts",
      check: ["d2-01", "d2-04"],
      task: "2.1",
      title: "System prompts, user prompts, and grounding",
      visual: (
        <div className="grid gap-5">
          <Layers
            layers={[
              { name: "System prompt (set by the app)", color: "#38bdf8", items: ["Role", "Tone", "Rules and limits", "Output format"] },
              { name: "Conversation history", color: "#a78bfa", items: ["Earlier prompts", "Earlier responses (often summarized)"] },
              { name: "Grounding data (RAG)", color: "#34d399", items: ["Retrieved policy sections", "Documents", "Emails"] },
              { name: "User prompt", color: "#f97316", items: ["The question or instruction"] },
            ]}
          />
          <Tiles
            cols={4}
            tiles={[
              { icon: "🎯", title: "Be clear and specific", text: "Say exactly what you want. Vague requests get vague answers.", color: "#f97316" },
              { icon: "🧭", title: "Add context", text: "Mention the topic, the audience, and the format.", color: "#f97316" },
              { icon: "🧩", title: "Use examples", text: "Show the style you're after.", color: "#f97316" },
              { icon: "📐", title: "Ask for structure", text: "Request bullets, a table, or a numbered list.", color: "#f97316" },
            ]}
          />
        </div>
      ),
      points: [
        "The system prompt sets the assistant's behaviour, tone, tools, and limits. The user prompt is what the person actually asks.",
        "Apps keep the conversation history and send it along with each new prompt. That's how a follow-up like \"and Q4?\" makes sense.",
        "Retrieval-augmented generation (RAG) means you look up relevant data first and add it to the prompt. The answer is then grounded in your own content.",
        "Worked example: a store bot answers \"what's your return window?\" wrongly. Adding the store's actual return policy to the prompt grounds the answer in your data.",
        "Pitfall: putting rules only in the user prompt. The user can change that part, so rules about tone and limits belong in the system prompt.",
      ],
      tip: "If an answer is generic when it should be about your organization, the fix is usually grounding, not a bigger model.",
    },
    {
      id: "d2-code",
      check: ["d2-12", "d2-16"],
      sources: [{ title: "About Azure Key Vault", url: "https://learn.microsoft.com/en-us/azure/key-vault/general/overview", license: "CC BY 4.0" }],
      task: "2.1",
      title: "From the Foundry playground to code",
      visual: (
        <div className="grid gap-5">
          <FoundryMap />
          <Flow
            color="#f97316"
            steps={[
              { icon: "🗂️", label: "Create a project", sub: "Inside a Foundry resource" },
              { icon: "🚀", label: "Deploy a model", sub: "Pick one from the model catalog" },
              { icon: "🧪", label: "Playground", sub: "Try prompts, temperature, max output tokens, and system instructions" },
              { icon: "💻", label: "Client app", sub: "Use the same settings in code through the Responses API" },
            ]}
          />
          <CodeBlock lang="python" code={CHAT_CODE} caption="A small chat client. The playground can generate starter code like this for your deployment." />
        </div>
      ),
      points: [
        "Endpoints are locked. Your app must send an API key or a Microsoft Entra ID token. Keep keys in Azure Key Vault, not in your code.",
        "You'll meet two kinds of endpoint. The project endpoint reaches your Foundry project and its resources. A model endpoint takes prompts for a deployment.",
        "The Foundry SDK gives you a project client, AIProjectClient, for Foundry tasks. It also hands you an OpenAI-compatible client for the Responses API.",
        "`model=` takes your deployment name. `response.output_text` holds the text the model wrote.",
        "A Foundry resource is the Azure resource behind your Foundry work. It provides model hosting, the agent service, quotas, monitoring and the security boundary.",
        "Keep keys in Azure Key Vault and let the app read them at runtime with its **managed identity**, an identity in Microsoft Entra ID that Azure manages for the app, so no secret sits in code.",
        "In a client-server AI app, the client collects input and shows results. The server runs **inference** on the model deployment and applies system instructions and safety settings.",
      ],
      tip: "Think of it as two sides. The client collects input, sends the request, and shows the result. The server, your model deployment, runs the model, applies instructions and safety, and sends back the output.",
    },
    {
      id: "d2-agents",
      check: ["d2-25", "d2-26"],
      sources: [{ title: "What is Foundry IQ?", url: "https://learn.microsoft.com/en-us/azure/foundry/agents/concepts/what-is-foundry-iq", license: "CC BY 4.0" }],
      task: "2.1",
      title: "Build, test, and call an agent",
      visual: (
        <div className="grid gap-5">
          <AgentBuilderLab />
          <CodeBlock lang="python" code={AGENT_CODE} caption="Calling a saved agent from a client app with the Foundry Projects SDK (azure-ai-projects)." />
        </div>
      ),
      points: [
        "A Foundry agent bundles a model, instructions, and tools. Tools let it take actions. Knowledge gives it information to answer from.",
        "Tools include Code Interpreter, knowledge sources, your own functions or APIs, and MCP servers. You manage them in the Foundry Tool Catalog.",
        "Once you're happy with the model, instructions, and tools, save them as an agent and keep testing it in the playground.",
        "Foundry IQ gives agents a permission-aware knowledge base across sources such as Azure Blob Storage, SharePoint and OneLake, with answers backed by citations.",
        "Worked example: a travel agent gets a flight search tool. Asked for Friday flights to Lisbon, the model decides to call the tool, reads the results, and replies with options.",
        "Pitfall: shipping an agent you haven't tried in the playground. Test it with real questions first and check every tool call it makes.",
      ],
      tip: "A model on its own takes one prompt and gives one answer. An agent plans its steps, calls tools, and remembers what happened earlier in the conversation.",
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
              { input: "Flexible, conversational analysis", service: "OpenAI library: client.responses.create", output: "A natural-language answer (can vary)" },
              { input: "Consistent structured values", service: "Azure Language SDK: TextAnalyticsClient", output: "Codes, categories, scores" },
              { input: "An agent that needs text analysis", service: "Azure Language MCP server", output: "Fixed-format results, as a tool" },
            ]}
          />
          <CodeBlock lang="python" code={LANGUAGE_CODE} caption="pip install azure-ai-textanalytics. The endpoint and key come from your Foundry resource." />
        </div>
      ),
      points: [
        "Keep the endpoint, key, and deployment name in a .env file. Read them in your code with load_dotenv() and os.getenv().",
        "detect_language() gives you the language name, its two-letter ISO 639-1 code, and a confidence score between 0 and 1.",
        "recognize_pii_entities() gives you the text with personal details blanked out, plus each detail's category and confidence score.",
        "If you have a Foundry resource, you don't need a separate Azure Language resource to use the Azure Language MCP server.",
        "Pitfall: a prompt such as \"is this review positive?\" can word its answer differently each time. When a dashboard needs the same labels and scores every run, call Azure Language instead.",
        "For example, a feedback app can send each comment to Azure Language and store the sentiment label next to it, so the dashboard can count negative comments by week.",
      ],
    },
    {
      id: "d2-speech",
      check: ["d2-49", "d2-56"],
      sources: [
        { title: "Speech service: Batch transcription", url: "https://learn.microsoft.com/en-us/azure/ai-services/speech-service/batch-transcription", license: "CC BY 4.0" },
        { title: "Azure AI Language: Language detection", url: "https://learn.microsoft.com/en-us/azure/ai-services/language-service/language-detection/overview", license: "CC BY 4.0" },
      ],
      task: "2.2",
      title: "Speech apps and voice agents",
      visual: (
        <div className="grid gap-5">
          <Flow
            color="#f472b6"
            steps={[
              { icon: "🗣️", label: "Speech to text", sub: "SpeechRecognizer turns the user's voice into text" },
              { icon: "🧠", label: "Reason", sub: "An agent or model decides what to say" },
              { icon: "🔊", label: "Text to speech", sub: "SpeechSynthesizer speaks the reply" },
            ]}
            loop="Voice Live wraps this whole speech-to-speech loop in one managed API"
          />
          <CodeBlock lang="python" code={SPEECH_CODE} caption="pip install azure-cognitiveservices-speech. A recognizer works the same way with AudioConfig(use_default_microphone=True)." />
        </div>
      ),
      points: [
        "Real-time transcription turns audio into text as it streams in from a microphone or file. Batch transcription works through stored files in the background, whenever capacity allows.",
        "You choose the voice with speech_synthesis_voice_name. Neural voices sound the most natural.",
        "Voice Live, in the azure-ai-voicelive package, combines speech recognition, a generative model, and speech synthesis for live voice conversations.",
        "Voice mode builds Voice Live into a Foundry agent's definition, so your client app needs less code.",
        "For thousands of recorded calls in Azure Storage, use batch transcription: point it at the files with a SAS URI and collect the transcripts asynchronously.",
        "For example, a voice ordering kiosk turns speech into text, sends the text to a model, and speaks the reply back with text to speech.",
      ],
      tip: "A multimodal model that accepts audio can answer a spoken question directly, with no separate transcription step.",
    },
    {
      id: "d2-vision",
      check: ["d2-60", "d2-65"],
      sources: [{ title: "What is Azure AI Vision?", url: "https://learn.microsoft.com/en-us/azure/ai-services/computer-vision/overview", license: "CC BY 4.0" }],
      task: "2.3",
      title: "See and create: vision and generation",
      visual: (
        <div className="grid gap-5">
          <CodeBlock lang="python" code={VISION_CODE} caption="One message with two parts, text and an image, sent to a vision-enabled deployment through the Responses API." />
          <Tiles
            cols={3}
            tiles={[
              { icon: "👁️", title: "Understand images", text: "GPT-4.1 family and GPT-5 series can describe images, answer questions, and read charts and screenshots.", color: "#fb923c" },
              { icon: "🎨", title: "Generate images", text: "Start with GPT-Image-1.5. GPT-Image-1, GPT-Image-1-Mini, and partner models such as FLUX are also there.", color: "#fb923c" },
              { icon: "🎬", title: "Generate video", text: "Sora models run a background job: you create it, check on it, then download an MP4.", color: "#fb923c" },
            ]}
          />
        </div>
      ),
      points: [
        "You can put an image in a prompt as a URL or as base64 data. Base64 turns the image's raw bytes into plain text so it fits inside JSON.",
        "To create an image with the Responses API, add tools=[{\"type\": \"image_generation\"}]. The output item of type image_generation_call holds the image as base64.",
        "Sora 2 can make video from text or an image, remix a video, and generate audio. Sora models come with responsible AI restrictions.",
        "Video generation with the Sora 2 REST API is asynchronous: send a POST request to create a video job, poll its status until it completes, then download the MP4.",
        "Common mistake: expecting the video in the first response. That response only describes the job, so your code must keep checking its status before it can download anything.",
        "For example, a shop could generate a product photo from the prompt \"red ceramic mug on a wooden table, soft light\" instead of booking a photo shoot.",
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
        "A schema is the list of fields you want and how they fit together. It can include collections, such as the line items on an invoice.",
        "An analyzer applies the same schema to every request and returns predictable JSON. You can use a prebuilt analyzer or build your own.",
        "Prebuilt analyzers include prebuilt-invoice, prebuilt-imageSearch, prebuilt-audioSearch, and prebuilt-videoSearch.",
        "Analysis runs in the background. The SDK's poller waits for you. With REST, you keep checking the Operation-Location URL yourself.",
        "Worked example: for supplier invoices, start from prebuilt-invoice. Add a custom field such as PurchaseOrderNumber to the schema, and every invoice comes back as JSON with the same field names.",
        "Pitfall: expecting perfect fields from a blurry scan. Check the confidence score on each field and send low-scoring ones to a person.",
      ],
      tip: "When a question talks about fields, schemas, or analyzers across documents, images, audio, or video, the answer is Azure Content Understanding in Foundry Tools.",
    },
  ],

  questions: [
    // ───── Start here (beginner) ─────
    {
      id: "ai901-b2-01",
      domain: "d2",
      lesson: "d2-b-foundry",
      level: "beginner",
      prompt: "What is Microsoft Foundry?",
      options: [
        "The part of Azure where you find, deploy, and build with AI models",
        "A programming language for AI",
        "A laptop made for running AI",
        "A website for buying cloud storage and backing up your files used for AI",
      ],
      answer: [0],
      explanation:
        "Foundry is Microsoft's workshop for AI on Azure. You pick models from its catalog, switch them on, test them, and connect them to your apps.",
    },
    {
      id: "ai901-b2-02",
      domain: "d2",
      lesson: "d2-b-foundry",
      level: "beginner",
      prompt: "What does it mean to deploy a model in Foundry?",
      options: [
        "Switch it on in the cloud so your apps can send it requests",
        "Train a brand-new model from scratch on your own data before you use it",
        "Download the model onto your phone",
        "Delete the model when you're done",
      ],
      answer: [0],
      explanation:
        "Deploying gives the model an address and the computing power it needs, so your apps can start using it. You don't have to train anything yourself.",
    },
    {
      id: "ai901-b2-03",
      domain: "d2",
      lesson: "d2-b-first-call",
      level: "beginner",
      prompt: "What is an endpoint?",
      options: [
        "The web address your app sends requests to",
        "The last word of the model's reply",
        "The day your Azure subscription ends",
        "A button that stops the model",
      ],
      answer: [0],
      explanation:
        "An endpoint is like a postal address for the model. Your app sends its prompt to that address and gets the reply back from it.",
    },
    {
      id: "ai901-b2-04",
      domain: "d2",
      lesson: "d2-b-first-call",
      level: "beginner",
      prompt: "You created a deployment called \"my-chat\". In this code, which line prints the model's answer?",
      code: `response = client.responses.create(
    model="my-chat",
    input="Say hello in French.",
)
print(response.output_text)`,
      codeLang: "python",
      options: ["print(response.output_text)", "model=\"my-chat\",", "input=\"Say hello in French.\",", "None of them"],
      answer: [0],
      explanation:
        "The first part sends your prompt to the my-chat deployment. The reply comes back in response, and output_text is the text the model wrote, so printing it shows the answer.",
    },
    {
      id: "ai901-b2-05",
      domain: "d2",
      lesson: "d2-b-tools",
      level: "beginner",
      prompt: "You need to turn recorded voice notes into written text. Which Foundry Tool fits?",
      options: ["Azure Speech", "Azure Language", "Azure Content Understanding", "An image-generation model"],
      answer: [0],
      explanation:
        "Azure Speech handles voice. It can turn speech into text, and it can also read text aloud.",
    },
    {
      id: "ai901-b2-06",
      domain: "d2",
      lesson: "d2-b-tools",
      level: "beginner",
      prompt: "Why might you choose a ready-made Foundry Tool instead of a chat model for a job?",
      options: [
        "It gives the same structured answer every time",
        "It can chat about any topic",
        "It writes more creative stories",
        "It never needs any endpoint or a key to call",
      ],
      answer: [0],
      explanation:
        "Foundry Tools are built for one job each, so their output has a fixed shape. That makes them a good fit when another program needs to read the result.",
    },
    {
      id: "ai901-b2-07",
      domain: "d2",
      lesson: "d2-b-foundry",
      level: "beginner",
      prompt: "Where in Foundry can you try out prompts on your deployed model before writing any code?",
      options: ["The playground", "Azure Key Vault", "Your .env file", "The billing page"],
      answer: [0],
      explanation:
        "The playground is a test bench. You type prompts, change settings, and see how the model behaves, then carry what works into your app.",
    },
    {
      id: "ai901-b2-08",
      domain: "d2",
      lesson: "d2-b-first-call",
      level: "beginner",
      prompt: "Where should you keep the API key your app uses to call a model?",
      options: [
        "Somewhere safe, such as Azure Key Vault, not in shared code",
        "In the prompt, so the model knows it",
        "In a public post or wiki page, so your whole team can find it quickly",
        "Printed on screen for every user",
      ],
      answer: [0],
      explanation:
        "Anyone who has your key can use your model and run up your bill. Keep it in a safe place like Azure Key Vault and load it when the app runs.",
    },
    {
      id: "ai901-b2-09",
      domain: "d2",
      lesson: "d2-b-tools",
      level: "beginner",
      prompt: "A team wants the vendor, date, and total read off thousands of scanned invoices. Which tool is built for this?",
      options: ["Azure Content Understanding", "Azure Speech", "A video-generation model", "The playground"],
      answer: [0],
      explanation:
        "Content Understanding reads documents, images, audio, and video and fills in the named fields you ask for. Here it would return vendor, date, and total for each invoice.",
    },

    // ───── d2-prompts ─────
    {
      id: "d2-01",
      domain: "d2",
      lesson: "d2-prompts",
      prompt: "You want every response from your assistant to be friendly, to cite sources, and to decline medical advice. Where should you put these rules?",
      options: ["In the system prompt", "In each user prompt", "In the deployment's TPM setting", "In the model's name"],
      answer: [0],
      explanation:
        "The system prompt sets behaviour, tone, and limits for the whole conversation. The user prompt is just the person's specific request.",
    },
    {
      id: "d2-02",
      domain: "d2",
      lesson: "d2-prompts",
      prompt: "\"Summarize the attached Q3 sales report in five bullet points for the regional managers.\" What kind of prompt is this?",
      options: ["A user prompt", "A system prompt", "An embedding", "A deployment type"],
      answer: [0],
      explanation: "A user prompt asks the model to respond to one specific question or instruction, like this one.",
    },
    {
      id: "d2-03",
      domain: "d2",
      lesson: "d2-prompts",
      prompt: "After asking about Q3 results, a user types \"And how did Q4 compare?\" The model understands that \"Q4\" refers to the same report. What makes this work?",
      options: [
        "The app sends the conversation history with the new prompt",
        "The model was retrained on the Q3 report overnight",
        "The deployment type is Global Batch",
        "The temperature is set to 0",
      ],
      answer: [0],
      explanation:
        "Models don't remember earlier messages by themselves. The app sends the previous prompts and replies, often summarized, along with each new prompt.",
    },
    {
      id: "d2-04",
      domain: "d2",
      lesson: "d2-prompts",
      prompt:
        "An expenses assistant first searches the company's expense policy, then adds the relevant sections to the prompt before calling the model. What is this technique called?",
      options: ["Retrieval-augmented generation (RAG)", "Fine-tuning", "Semantic segmentation of the documents", "Batch transcription"],
      answer: [0],
      explanation:
        "RAG retrieves information and adds it to the prompt. The model then answers from that information, so the reply is grounded in your actual policy.",
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
      explanation:
        "Clear prompts that explain who it's for and what shape you want get better answers. Making the prompt vaguer or the model more random would make things worse.",
    },
    {
      id: "d2-06",
      domain: "d2",
      lesson: "d2-prompts",
      prompt: "You want product descriptions in a precise house style. Which prompt technique helps the model copy that style?",
      options: ["Include an example of a description written in that style", "Ask the question in another language so the model tries harder", "Lower the tokens-per-minute limit", "Remove all context"],
      answer: [0],
      explanation: "An example shows the model what you mean. That's often easier and more exact than trying to describe a style in words.",
    },
    {
      id: "d2-07",
      domain: "d2",
      lesson: "d2-prompts",
      prompt: "Which system prompt best keeps a retail support assistant on task?",
      options: [
        "You're the support assistant for Tailspin Toys. Answer only questions about Tailspin orders and returns, cite the policy you used, and politely decline other requests.",
        "You're helpful.",
        "Answer every question as creatively as possible, in any style the user asks for, and never refuse a request, even when the question has nothing to do with Tailspin Toys.",
        "Ignore any instructions you receive later.",
      ],
      answer: [0],
      explanation:
        "A good system prompt gives the role, the scope, the rules for answers, and what to do with requests outside that scope. The others leave all of that out.",
    },
    {
      id: "d2-08",
      domain: "d2",
      lesson: "d2-prompts",
      type: "match",
      prompt: "Match each prompting tip to the prompt fragment that uses it.",
      pairs: [
        ["Be clear and specific", "\"List the three main causes of customer churn, one sentence each.\""],
        ["Add context", "\"…for a non-technical board audience.\""],
        ["Use examples", "\"Format each line like: Kettle, boils in 60 s, $35.\""],
        ["Ask for structure", "\"Return a table with columns Risk, Impact, and Owner.\""],
      ],
      explanation: "Being specific, giving context, showing examples, and asking for structure are the four everyday ways to get better answers.",
    },
    {
      id: "d2-09",
      domain: "d2",
      lesson: "d2-prompts",
      prompt: "In a typical generative AI app, who usually sets the system prompt?",
      options: ["The application, as configured by its developer", "Each end user, before every message", "The model provider, and it can't be changed", "Azure Key Vault"],
      answer: [0],
      explanation:
        "The app sets the system prompt behind the scenes. Users type user prompts, and the model replies while following the system prompt.",
    },
    {
      id: "d2-10",
      domain: "d2",
      lesson: "d2-prompts",
      prompt: "What are the benefits of grounding a model's responses in your own data? (Choose two.)",
      options: [
        "Answers are based on relevant, organization-specific information",
        "Responses can cite the sources they used",
        "The model's weights are permanently updated",
        "You no longer need to write prompts",
        "Token usage drops to zero",
      ],
      answer: [0, 1],
      explanation:
        "Grounding adds context at the moment you ask. It doesn't retrain the model, and the extra text actually adds tokens to the prompt.",
    },
    {
      id: "d2-11",
      domain: "d2",
      lesson: "d2-prompts",
      prompt: "Employees ask an internal chat app, \"How many days of parental leave do I get?\" It replies with a generic answer about typical employers. What's the best fix?",
      options: [
        "Ground the app in the company's HR policy documents",
        "Raise the temperature",
        "Switch to an image-generation model for the HR questions",
        "Lower the max output tokens",
      ],
      answer: [0],
      explanation:
        "The model has never seen your policy, so it guesses. Looking up the policy and adding it to the prompt (RAG) gives a specific answer it can cite.",
    },

    // ───── d2-code ─────
    {
      id: "d2-12",
      domain: "d2",
      lesson: "d2-code",
      prompt: "Which Azure resource provides model hosting, the agent service, quotas, monitoring, and the security boundary for your Foundry work?",
      options: ["A Foundry resource", "A Foundry project", "A model deployment", "A .env file"],
      answer: [0],
      explanation: "The Foundry resource is the actual Azure resource that holds all of that. Projects are workspaces that sit inside it.",
    },
    {
      id: "d2-13",
      domain: "d2",
      lesson: "d2-code",
      prompt: "Your team wants a separate workspace for each AI use case, each holding its own agents, evaluations, datasets, vector indexes, and connections. What should you create for each use case?",
      options: ["A Foundry project inside the team's Foundry resource", "A new Azure subscription", "A new Azure Speech resource for each of the use case teams", "A separate model catalog"],
      answer: [0],
      explanation: "One Foundry resource can hold many Foundry projects. Each project focuses on one use case.",
    },
    {
      id: "d2-14",
      domain: "d2",
      lesson: "d2-code",
      prompt: "Before writing code, you want to try prompts against a deployed model, adjust temperature and system instructions, and compare models. Where should you do this?",
      options: ["The playground in the Foundry portal", "Azure Key Vault", "The Content Understanding analyzer list", "The Azure Language SDK"],
      answer: [0],
      explanation:
        "Foundry playgrounds let you test prompts and note the settings that work. They can also show you matching code to copy.",
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
      explanation: "You need a project before you can deploy a model. Then you test it in the playground, and only then connect your own app.",
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
      explanation:
        "The model parameter takes the name of your deployment. It only matches the model's own name if you left the deployment name unchanged.",
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
      explanation: "With the Responses API, output_text gathers up all the text the model wrote in its response.",
    },
    {
      id: "d2-18",
      domain: "d2",
      lesson: "d2-code",
      prompt: "A client app calls a protected Foundry endpoint. Which can it show to prove it's allowed in? (Choose two.)",
      options: [
        "An API key for the resource",
        "A Microsoft Entra ID token, for example obtained through DefaultAzureCredential",
        "The deployment name on its own",
        "The model card",
        "The tokens-per-minute value",
      ],
      answer: [0, 1],
      explanation:
        "Foundry endpoints accept either an API key or a token from valid Microsoft Entra ID credentials. The other values aren't secrets, so they can't prove anything.",
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
        "In the model deployment name, so the app can read it automatically",
      ],
      answer: [0],
      explanation:
        "Secrets such as API keys belong in Azure Key Vault. The app fetches them safely while it runs, so they never sit in code or a repository.",
    },
    {
      id: "d2-20",
      domain: "d2",
      lesson: "d2-code",
      prompt: "You have an AIProjectClient connected to your Foundry project. Which method gives you an OpenAI-compatible client for calling models and agents through the Responses API?",
      options: ["get_openai_client()", "begin_analyze()", "speak_text_async()", "detect_language()"],
      answer: [0],
      explanation:
        "The project client handles Foundry tasks. Its get_openai_client() method hands you the OpenAI-compatible client. The other methods belong to Content Understanding, Speech, and Language.",
    },
    {
      id: "d2-21",
      domain: "d2",
      lesson: "d2-code",
      prompt: "Which best describes a lightweight client application for a Foundry model?",
      options: [
        "A small app, often one Python file, that collects input, calls the remote model, and shows the result",
        "An app that runs the model's weights locally on the user's laptop so it works without any cloud connection",
        "A full web framework with its own database and backend logic",
        "A tool that trains new foundation models",
      ],
      answer: [0],
      explanation:
        "A lightweight client has very little code. The heavy work and most of the state stay on the server, where the model runs.",
    },
    {
      id: "d2-22",
      domain: "d2",
      lesson: "d2-code",
      prompt: "In a client-server AI app built on Foundry, which job belongs to the server?",
      options: [
        "Run inference on the model deployment and apply system instructions and safety",
        "Show a chat window to the user",
        "Collect the user's typed or spoken input and then show it back in the chat window",
        "Format the user's input into a request",
      ],
      answer: [0],
      explanation:
        "The model deployment is the server. Running the model on a request is called inference. The client handles the screen, collects input, sends the request, and shows the output.",
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
      explanation:
        "max_output_tokens caps the length, and the system role sets behaviour. A temperature of 0.7 still allows variety; only a temperature of 0 gets close to the same output every time.",
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
        "A redirect to the Foundry portal sign-in page so the user can approve the request",
      ],
      answer: [0],
      explanation:
        "Endpoints speak REST: every request and response has headers and a JSON body. The SDKs simply build these REST calls for you.",
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
      explanation: "The model does the thinking, the instructions set the agent's role and rules, and the tools let it act.",
    },
    {
      id: "d2-26",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "An HR agent must answer from the company's internal PDFs and SharePoint pages, with citations. What should you add to the agent?",
      options: ["Knowledge connected to those sources", "A higher temperature", "Image generation", "A Global Batch deployment of the model"],
      answer: [0],
      explanation:
        "Knowledge gives the agent information it looks up at answer time, which is RAG. Answers that use knowledge include a citation back to the source.",
    },
    {
      id: "d2-27",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "A user uploads a CSV of monthly sales and asks the agent to calculate growth and plot a chart. Which tool should the agent have?",
      options: ["Code Interpreter", "Azure Language PII detection", "Text to speech", "Sora"],
      answer: [0],
      explanation: "Code Interpreter lets the agent write and run code, which is what you need to crunch numbers in a file and draw a chart.",
    },
    {
      id: "d2-28",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "What is the Model Context Protocol (MCP)?",
      options: [
        "An open standard for connecting AI agents to external tools and data through MCP servers",
        "A Microsoft deployment type for reasoning models that routes each request between Azure regions",
        "A file format for prompts",
        "A metric that scores groundedness",
      ],
      answer: [0],
      explanation:
        "MCP works like a universal plug. The agent is the MCP client, an MCP server offers tools, and the agent can find and call them without custom glue code.",
    },
    {
      id: "d2-29",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "Which Foundry capability gives agents a permission-aware knowledge base across sources such as Blob Storage, SharePoint, and OneLake, and returns results backed by citations?",
      options: ["Foundry IQ", "Azure Speech", "The Foundry model leaderboard", "Azure Key Vault"],
      answer: [0],
      explanation:
        "Foundry IQ does the indexing, chunking, and embeddings for you and uses agentic retrieval. It only returns what the user is allowed to see.",
    },
    {
      id: "d2-30",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "Where in Foundry can you find and centrally set up the tools your agents use?",
      options: ["The Foundry Tool Catalog", "The model catalog's benchmark tab", "The Speech playground", "Azure Policy"],
      answer: [0],
      explanation: "Tools such as MCP servers, Code Interpreter, and knowledge sources are managed in the Foundry Tool Catalog.",
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
      explanation:
        "Start with the model, then write the instructions and add tools and knowledge. Save it as an agent, then keep testing and improving it.",
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
        "The get_openai_client() call with no options",
        "The role value \"user\"",
      ],
      answer: [0],
      explanation:
        "The agent_reference in extra_body sends the request to the named agent, so its instructions and tools are used. Without it, you'd just be calling a model.",
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
        "In the Content Understanding JSON output that's returned by the agent's first run",
      ],
      answer: [0],
      explanation: "The playground's code view lists the .env variables your client app needs, including the agent identifier.",
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
      explanation:
        "A model is raw brainpower. An agent is a worker built on top of it that decides what to do next and calls tools to get it done.",
    },
    {
      id: "d2-35",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "Which Python package and class do you use to connect to a Foundry project and fetch an agent?",
      options: ["azure-ai-projects and AIProjectClient", "azure-ai-textanalytics and TextAnalyticsClient", "azure-cognitiveservices-speech and SpeechConfig", "azure-ai-contentunderstanding and ContentUnderstandingClient"],
      answer: [0],
      explanation:
        "The Foundry Projects SDK, azure-ai-projects, gives you AIProjectClient. It has agents.get() to fetch an agent and get_openai_client() to call it.",
    },
    {
      id: "d2-36",
      domain: "d2",
      lesson: "d2-agents",
      prompt: "You're getting a customer-support agent ready for release. Which practices follow responsible AI and security guidance? (Choose two.)",
      options: [
        "Give the agent only the tools its job needs",
        "Test it in the playground with realistic and off-topic prompts before release",
        "Store the API key in the agent's instructions",
        "Turn on every tool in the catalog just in case",
        "Leave the instructions empty so the model decides",
      ],
      answer: [0, 1],
      explanation:
        "Fewer tools means fewer ways for things to go wrong. Testing shows you how the agent behaves before customers ever see it.",
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
        "To encrypt the agent's responses with a key that the Azure SDK generates for the current environment",
      ],
      answer: [0],
      explanation:
        "DefaultAzureCredential picks up whatever sign-in is available, such as a signed-in developer or a managed identity. That way there's no key in the code.",
    },

    // ───── d2-text ─────
    {
      id: "d2-38",
      domain: "d2",
      lesson: "d2-text",
      prompt: "Which pip package do you install to use the Azure Language Python SDK for language detection and PII detection?",
      options: ["azure-ai-textanalytics", "azure-cognitiveservices-speech", "azure-ai-voicelive", "azure-ai-contentunderstanding"],
      answer: [0],
      explanation: "The Azure Language Python SDK is azure-ai-textanalytics. It gives you the TextAnalyticsClient class.",
    },
    {
      id: "d2-39",
      domain: "d2",
      lesson: "d2-text",
      prompt: "Which line correctly creates an Azure Language client with a key?",
      options: [
        "TextAnalyticsClient(endpoint=endpoint, credential=AzureKeyCredential(key))",
        "OpenAI(base_url=endpoint, api_key=key).detect_language(text=t)",
        "SpeechConfig(subscription=key, endpoint=endpoint)",
        "ContentUnderstandingClient(analyzer_id=key)",
      ],
      answer: [0],
      explanation:
        "TextAnalyticsClient takes your resource endpoint and a credential, here an AzureKeyCredential. You could also pass an Entra ID credential instead.",
    },
    {
      id: "d2-40",
      domain: "d2",
      lesson: "d2-text",
      prompt: "After running this code, which property holds the two-letter language code, such as \"es\"?",
      code: `result = client.detect_language(["¡Hola! Me llamo Josefina."])[0]`,
      codeLang: "python",
      options: ["result.primary_language.iso6391_name", "result.redacted_text", "result.output_text", "result.primary_language.voice_name"],
      answer: [0],
      explanation: "primary_language has three useful parts: name, iso6391_name for the two-letter code, and confidence_score.",
    },
    {
      id: "d2-41",
      domain: "d2",
      lesson: "d2-text",
      prompt: "What does recognize_pii_entities() return for each document?",
      options: [
        "The redacted text and a list of entities with their category and confidence score",
        "A translated copy of each document, along with the language it was translated from",
        "A spoken audio file",
        "A new Foundry project",
      ],
      answer: [0],
      explanation: "You get two things: a copy of the text with personal details blanked out, and the list of personal details it found.",
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
      explanation: "Each Azure Language feature has its own method on the client, and each one returns structured results.",
    },
    {
      id: "d2-43",
      domain: "d2",
      lesson: "d2-text",
      prompt:
        "Your app sends each review to a chat model with the prompt \"What language is this?\" and gets slightly different wording every time. Another system needs a consistent language code and score. What should you do?",
      options: [
        "Use the Azure Language SDK's detect_language() instead",
        "Raise the temperature",
        "Use a video-generation model",
        "Add more examples to the system prompt and keep parsing free text",
      ],
      answer: [0],
      explanation:
        "Generative models pick words by probability, so their wording drifts. Azure Language returns the same structured fields every time, which is what the other system needs.",
    },
    {
      id: "d2-44",
      domain: "d2",
      lesson: "d2-text",
      prompt: "You're using the OpenAI Python library to send text-analysis prompts to a deployed model. Which values must the client be set up with? (Choose two.)",
      options: [
        "The resource's endpoint URL",
        "An API key or Microsoft Entra ID token",
        "An Azure Speech voice name",
        "A Content Understanding analyzer ID",
        "A Language Studio project name",
      ],
      answer: [0, 1],
      explanation:
        "OpenAI(base_url=endpoint, api_key=key) connects and signs in the client. You then pass the deployment name as model on each call.",
    },
    {
      id: "d2-45",
      domain: "d2",
      lesson: "d2-text",
      prompt: "What is the Azure Language MCP server?",
      options: [
        "A managed service that exposes Azure Language capabilities to agents through MCP",
        "A database that stores every document that Azure Language has analyzed",
        "A speech model that reads text aloud",
        "A prebuilt Content Understanding analyzer",
      ],
      answer: [0],
      explanation:
        "Through it, agents can use named entity recognition, sentiment analysis, language detection, and more, without calling the REST API themselves.",
    },
    {
      id: "d2-46",
      domain: "d2",
      lesson: "d2-text",
      prompt: "A support agent must reliably detect each ticket's language and redact PII before passing it to a person. How should you give the agent this ability?",
      options: [
        "Connect Azure Language in Foundry Tools to the agent as an MCP tool",
        "Ask the model to guess each ticket's language and spot any PII in its instructions",
        "Add the image generation tool",
        "Switch the deployment to Global Batch",
      ],
      answer: [0],
      explanation:
        "Adding Azure Language as a tool gives the agent text analysis with fixed, structured output. The model's reasoning stays in charge of everything else.",
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
        "To detect the language of the text and pick the matching regional endpoint that goes with the API key",
      ],
      answer: [0],
      explanation:
        "load_dotenv() reads the .env file into environment variables, and os.getenv() reads one back. The names in your code must match the names in the file exactly.",
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
      explanation:
        "Language detection and PII detection work straight away, with no training. The MCP server makes them available to agents too.",
    },

    // ───── d2-speech ─────
    {
      id: "d2-49",
      domain: "d2",
      lesson: "d2-speech",
      prompt: "Which pip package provides the Azure Speech SDK for speech to text and text to speech in Python?",
      options: ["azure-cognitiveservices-speech", "azure-ai-textanalytics-speech", "openai", "azure-ai-projects"],
      answer: [0],
      explanation: "You install azure-cognitiveservices-speech and import it as azure.cognitiveservices.speech, usually shortened to speechsdk.",
    },
    {
      id: "d2-50",
      domain: "d2",
      lesson: "d2-speech",
      prompt: "What do you pass to speechsdk.SpeechConfig() to connect to Azure Speech?",
      options: [
        "The Foundry resource key (subscription) and endpoint",
        "The model deployment name and its temperature",
        "The analyzer ID and schema",
        "The agent name and agent_reference",
      ],
      answer: [0],
      explanation:
        "SpeechConfig(subscription=key, endpoint=endpoint) holds the connection details. It also holds settings such as which voice to use.",
    },
    {
      id: "d2-51",
      domain: "d2",
      lesson: "d2-speech",
      prompt: "You need to turn a user's speech from the default microphone into text. Which objects do you combine?",
      options: [
        "A SpeechRecognizer with an AudioConfig that uses the default microphone",
        "A SpeechSynthesizer with an AudioOutputConfig for the default speaker",
        "A TextAnalyticsClient with detect_language",
        "A ContentUnderstandingClient with prebuilt-invoice",
      ],
      answer: [0],
      explanation:
        "AudioConfig(use_default_microphone=True) says where the sound comes from. SpeechRecognizer then turns it into text.",
    },
    {
      id: "d2-52",
      domain: "d2",
      lesson: "d2-speech",
      prompt: "A company has thousands of recorded calls in Azure Storage and wants transcripts. It doesn't need them right away. Which Azure Speech approach fits?",
      options: [
        "Batch transcription, pointing to the files with a SAS URI and receiving results asynchronously",
        "Real-time transcription from the default microphone, with each stored file played back to it in turn",
        "Text to speech with a neural voice",
        "Voice Live with proactive engagement",
      ],
      answer: [0],
      explanation:
        "Batch transcription works through stored files in the background, whenever capacity is available. A SAS URI is a link that grants temporary access to the files.",
    },
    {
      id: "d2-53",
      domain: "d2",
      lesson: "d2-speech",
      prompt: "In a text-to-speech app, how do you choose which voice reads the text?",
      options: [
        "Set speech_config.speech_synthesis_voice_name",
        "Pass the voice as the model parameter of responses.create",
        "Change the deployment type",
        "Set AudioConfig(use_default_microphone=True)",
      ],
      answer: [0],
      explanation: "The voice name, such as a neural voice, is a setting on the SpeechConfig object.",
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
      explanation:
        "The config objects describe the connection and the audio devices. The recognizer and the synthesizer do the actual work.",
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
      explanation:
        "Speech-to-speech is a relay. First the voice becomes text, then a model works out a reply, then the reply becomes speech again.",
    },
    {
      id: "d2-56",
      domain: "d2",
      lesson: "d2-speech",
      prompt: "You want to build a live voice agent without connecting speech to text, a model, and text to speech yourself. Which Azure Speech capability should you use?",
      options: ["Voice Live", "Batch transcription", "Azure Language PII detection", "Content Understanding prebuilt-audioSearch"],
      answer: [0],
      explanation: "The Voice Live API puts all three pieces into one fully managed service for real-time spoken conversations.",
    },
    {
      id: "d2-57",
      domain: "d2",
      lesson: "d2-speech",
      prompt: "What does turning on Voice mode for a Microsoft Foundry agent in the playground do?",
      options: [
        "Integrates Azure Speech Voice Live into the agent definition, reducing the client code you need",
        "Converts the agent into an image-generation model that draws pictures of whatever the user says aloud",
        "Moves the agent to a Global Batch deployment",
        "Removes the agent's instructions",
      ],
      answer: [0],
      explanation: "The speech setup moves into the agent itself, so your client app has less to do.",
    },
    {
      id: "d2-58",
      domain: "d2",
      lesson: "d2-speech",
      prompt: "A developer wants a deployed model to understand a user's spoken question directly, without writing separate transcription code. What should they deploy?",
      options: ["A multimodal model that accepts audio input", "An embedding model", "An image-generation model", "A text-only small language model (SLM)"],
      answer: [0],
      explanation:
        "A multimodal model that takes audio can listen to the question and answer it in one step. That's how you respond to spoken prompts with a deployed model.",
    },
    {
      id: "d2-59",
      domain: "d2",
      lesson: "d2-speech",
      prompt: "After calling synthesizer.speak_text_async(text).get(), which checks should well-written code do? (Choose two.)",
      options: [
        "Compare result.reason with ResultReason.SynthesizingAudioCompleted to confirm success",
        "If the reason is Canceled, read cancellation_details to find the error",
        "Read response.output_text",
        "Poll the Operation-Location URL",
        "Call begin_analyze on the result",
      ],
      answer: [0, 1],
      explanation:
        "The result's reason tells you whether audio was produced. If it was canceled, the cancellation details explain why, for example a wrong key or endpoint.",
    },

    // ───── d2-vision ─────
    {
      id: "d2-60",
      domain: "d2",
      lesson: "d2-vision",
      prompt: "You're sending an image and a question to a vision-enabled model with the Responses API. How is the user message built?",
      options: [
        "A content list with an input_text part and an input_image part",
        "Two separate API calls: one for the image, one for the text",
        "The image pasted into the system prompt as a file path on your laptop",
        "An image-generation tool call",
      ],
      answer: [0],
      explanation: "One request can carry text and image parts side by side. The model looks at both before it replies.",
    },
    {
      id: "d2-61",
      domain: "d2",
      lesson: "d2-vision",
      prompt: "In what forms can you give an image to a multimodal model in a prompt?",
      options: ["As a URL or as base64-encoded image data", "Only as a printed copy", "Only as a link to a Foundry project", "Only as an MP4 file"],
      answer: [0],
      explanation: "Either link to the image, or send it as base64. Base64 turns the image's raw bytes into text so it can travel inside JSON.",
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
      explanation: "The input_image part carries the image URL or data URL. The input_text part carries the question.",
    },
    {
      id: "d2-63",
      domain: "d2",
      lesson: "d2-vision",
      prompt: "You're using the Responses API with an image-generation deployment. What do you add to the request so the model creates an image?",
      options: ["tools=[{\"type\": \"image_generation\"}]", "temperature=0", "max_output_tokens=1", "extra_body={\"agent\": \"image-generator\"}"],
      answer: [0],
      explanation: "The image_generation tool tells the model to produce a picture from your prompt instead of only text.",
    },
    {
      id: "d2-64",
      domain: "d2",
      lesson: "d2-vision",
      prompt: "In the response to an image-generation request, where do you find the generated image?",
      options: [
        "In the result of the output item whose type is image_generation_call, as base64 data",
        "In response.output_text, as a text description of the image along with its file name",
        "At a URL in the system prompt",
        "In the deployment's TPM setting",
      ],
      answer: [0],
      explanation: "The image comes back as base64 text. Decode it and save the bytes to a file, such as a PNG.",
    },
    {
      id: "d2-65",
      domain: "d2",
      lesson: "d2-vision",
      prompt: "You're starting a new branding project that needs high-quality image creation and precise editing. Which model family does Microsoft recommend starting with in Foundry?",
      options: ["The GPT-Image-1 family, especially GPT-Image-1.5", "text-embedding-3-small", "Sora 1", "Phi-4 text-only models with a long system prompt"],
      answer: [0],
      explanation: "GPT-Image-1.5 offers better quality, supports editing, and is ready for enterprise use.",
    },
    {
      id: "d2-66",
      domain: "d2",
      lesson: "d2-vision",
      prompt: "An internal tool creates thousands of rough concept images a day. Cost and speed matter more than top quality. Which model fits best?",
      options: ["GPT-Image-1-Mini", "GPT-Image-1.5", "Sora 2", "An embedding model"],
      answer: [0],
      explanation: "GPT-Image-1-Mini is the lighter, cheaper version, made for experiments and high volume.",
    },
    {
      id: "d2-67",
      domain: "d2",
      lesson: "d2-vision",
      prompt: "A marketing team wants short promotional video clips made from text and reference images. Which models in Foundry generate video natively?",
      options: ["Sora models such as Sora 2", "GPT-4.1-mini", "FLUX", "Azure Speech neural voices"],
      answer: [0],
      explanation: "Sora models are Foundry's built-in video generators. The other multimodal models don't output video.",
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
      explanation:
        "Making video takes a lot of computing, so it runs as a background job. You create the job, keep checking on it, then download the result.",
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
      explanation:
        "Sora 2 can also remix video and generate audio. It has restrictions too, such as limits on showing real people and copyrighted characters.",
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
      explanation:
        "Create the OpenAI client with the endpoint and key. Then pass the deployment name as the model, with a prompt that has both text and image parts.",
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
        "Deploy a model, set its temperature, then chat in the playground",
        "Tokenize, embed, decode the next token",
      ],
      answer: [0],
      explanation:
        "It takes the content in, analyzes it, and hands back structured data. The analysis step mixes OCR, speech recognition, language understanding, and multimodal models.",
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
        "How many tokens per minute the deployment allows for each of the analyzers that use the schema",
      ],
      answer: [0],
      explanation:
        "For an invoice, a schema might list vendor name and invoice number, plus an Items collection where each item has a description, unit price, and quantity.",
    },
    {
      id: "d2-73",
      domain: "d2",
      lesson: "d2-extract",
      prompt: "What is an analyzer in Azure Content Understanding?",
      options: [
        "A unit that applies the same extraction logic and schema to all content and returns predictable JSON",
        "A person on the Azure team who reviews every extraction result by hand before any JSON is returned to you",
        "A deployment type for reasoning models",
        "A tool that generates new documents",
      ],
      answer: [0],
      explanation: "You pick a prebuilt analyzer or make your own. Either way, it applies its schema the same way to every request.",
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
      explanation: "Prebuilt analyzers cover the common cases. Build a custom analyzer when you need your own fields.",
    },
    {
      id: "d2-75",
      domain: "d2",
      lesson: "d2-extract",
      prompt: "Which package and client class do you use to call Azure Content Understanding from Python?",
      options: [
        "azure-ai-contentunderstanding and ContentUnderstandingClient",
        "azure-ai-textanalytics and TextAnalyticsClient class",
        "openai and OpenAI",
        "azure-ai-voicelive and VoiceLiveClient",
      ],
      answer: [0],
      explanation: "ContentUnderstandingClient comes from azure-ai-contentunderstanding. It takes your Foundry endpoint and a credential.",
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
        "result() converts the analyzed invoice into speech so the app can read every field aloud to the user",
        "result() deploys a new model",
      ],
      answer: [0],
      explanation: "begin_analyze only starts the job. The poller keeps checking for you, and result() hands back the answer once it's done.",
    },
    {
      id: "d2-77",
      domain: "d2",
      lesson: "d2-extract",
      prompt: "For each item in result.contents, what does an invoice analysis usually return?",
      options: [
        "Markdown of the content plus fields with values, types, and confidence scores",
        "An MP4 video of the invoice",
        "Only a sentiment score",
        "A list of the model deployments that processed the invoice, with their token usage",
      ],
      answer: [0],
      explanation:
        "For example, you might get CustomerName as a string with a confidence of 0.95, and InvoiceDate as a date.",
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
        "Azure Language language detection, run on each of the recorded voicemail files",
      ],
      answer: [0],
      explanation:
        "Content Understanding can apply a schema to audio. It returns a transcript plus the fields you asked for, as JSON.",
    },
    {
      id: "d2-79",
      domain: "d2",
      lesson: "d2-extract",
      prompt: "From conference-room camera snapshots, a facilities team wants the location, in-person attendees, remote attendees, and total attendees as data. Which approach fits?",
      options: [
        "Apply a Content Understanding schema with those fields to the images",
        "Use speech to text on the images",
        "Run sentiment analysis on the image file names and the captions for each snapshot",
        "Generate a new image with GPT-Image-1",
      ],
      answer: [0],
      explanation: "Content Understanding extracts the fields in your schema from images, not just from documents, audio, and video.",
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
      explanation:
        "Custom analyzers let you choose the fields. Their structured JSON output is easy to store, search, or feed into automation.",
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
      explanation:
        "Analysis runs in the background, so the first response doesn't contain the result yet. You submit, then keep checking the Operation-Location URL until the job succeeds.",
    },
  ],

  cards: [
    { id: "s-foundry", domain: "d2", kind: "service", term: "Microsoft Foundry", definition: "Microsoft's platform for building, deploying, and managing AI apps and agents on Azure." },
    { id: "s-foundry-resource", domain: "d2", kind: "service", term: "Foundry resource", definition: "The Azure resource itself. It holds model hosting, the agent service, quotas, and the security boundary." },
    { id: "s-foundry-project", domain: "d2", kind: "service", term: "Foundry project", definition: "A workspace inside a resource for one use case, with its own agents, evaluations, datasets, and connections." },
    { id: "s-playground", domain: "d2", kind: "service", term: "Foundry playground", definition: "Try prompts and settings on a deployment, then copy what works into your code." },
    { id: "s-responses", domain: "d2", kind: "service", term: "Responses API", definition: "The OpenAI-compatible API you use to call deployed models and agents." },
    { id: "s-projects-sdk", domain: "d2", kind: "service", term: "Foundry SDK (azure-ai-projects)", definition: "Gives you AIProjectClient for Foundry tasks, agents, and get_openai_client()." },
    { id: "s-agent-service", domain: "d2", kind: "service", term: "Foundry Agent Service", definition: "Runs your agents and handles tool calls, conversation threads, safety controls, and monitoring." },
    { id: "s-foundry-iq", domain: "d2", kind: "service", term: "Foundry IQ", definition: "A knowledge layer that respects permissions and gives agents grounded answers with citations." },
    { id: "s-tool-catalog", domain: "d2", kind: "service", term: "Foundry Tool Catalog", definition: "Where you find and centrally manage the tools your agents can call." },
    { id: "s-language-mcp", domain: "d2", kind: "service", term: "Azure Language MCP server", definition: "Offers Azure Language text analysis to agents as MCP tools." },
    { id: "s-speech", domain: "d2", kind: "service", term: "Azure Speech in Foundry Tools", definition: "Speech to text, text to speech, translation, and speaker recognition." },
    { id: "s-voice-live", domain: "d2", kind: "service", term: "Voice Live", definition: "A managed service for real-time spoken conversations with voice agents." },
    { id: "s-vision", domain: "d2", kind: "service", term: "Azure Vision in Foundry Tools", definition: "Prebuilt analysis of what's in images and videos." },
    { id: "s-content-understanding", domain: "d2", kind: "service", term: "Azure Content Understanding in Foundry Tools", definition: "Pulls the fields in your schema out of documents, images, audio, and video." },
    { id: "s-gpt-image", domain: "d2", kind: "service", term: "GPT-Image-1.5", definition: "The recommended model to start with for creating and editing images in Foundry." },
    { id: "s-sora", domain: "d2", kind: "service", term: "Sora 2", definition: "Makes video from text, an image, or another video. It runs as a background job and returns an MP4." },
    { id: "s-entra", domain: "d2", kind: "service", term: "Microsoft Entra ID", definition: "Microsoft's identity service. It lets apps sign in without keys and controls who can use which AI resources." },
    { id: "s-keyvault", domain: "d2", kind: "service", term: "Azure Key Vault", definition: "A safe for secrets such as API keys. Apps read them while running, using a managed identity." },
    { id: "s-translator", domain: "d2", kind: "service", term: "Azure Translator in Foundry Tools", definition: "AI translation across more than 100 languages and dialects." },
    { id: "s-content-safety", domain: "d2", kind: "service", term: "Content Safety in Foundry Tools", definition: "Spots unwanted or harmful content in text and images." },
    { id: "c-system-prompt", domain: "d2", kind: "concept", term: "System prompt", definition: "Set by the app. It gives the model its role, tone, rules, and output format." },
    { id: "c-rag", domain: "d2", kind: "concept", term: "Retrieval-augmented generation", definition: "Look up relevant data first and add it to the prompt, so the answer is grounded in it." },
    { id: "c-mcp", domain: "d2", kind: "concept", term: "Model Context Protocol (MCP)", definition: "An open standard that connects agents, the clients, to tools offered by MCP servers." },
    { id: "c-code-interpreter", domain: "d2", kind: "concept", term: "Code Interpreter", definition: "An agent tool that runs code, for data analysis and working with files." },
    { id: "c-deployment-name", domain: "d2", kind: "concept", term: "Deployment name", definition: "The name you give a deployed model. You pass it as model= in your code." },
    { id: "c-batch-transcription", domain: "d2", kind: "concept", term: "Batch transcription", definition: "Turns stored audio files into text in the background. You point to the files with SAS URIs." },
    { id: "c-base64", domain: "d2", kind: "concept", term: "Base64", definition: "A way to write binary files, such as images, as plain text so they fit inside JSON." },
    { id: "c-schema", domain: "d2", kind: "concept", term: "Schema (Content Understanding)", definition: "The list of fields to extract and how they fit together. Fields are matched by meaning, not exact label." },
    { id: "c-analyzer", domain: "d2", kind: "concept", term: "Analyzer", definition: "Applies a schema the same way every time and returns predictable JSON." },
  ],

  challenges: [
    {
      id: "ch-agent-allpass",
      domain: "d2",
      lesson: "d2-agents",
      title: "Pass every test prompt",
      goal: "Set the agent's instructions and tools so all four playground test prompts pass.",
      hint: "Each failing test needs something different: knowledge, Code Interpreter, Azure Language, or tighter instructions.",
      takeaway: "Knowledge grounds the answers, tools take actions, and instructions keep the agent on its job.",
      render: (onSolved) => <AgentBuilderLab goal="allPass" onSolved={onSolved} />,
    },
    {
      id: "ch-agent-lean",
      domain: "d2",
      lesson: "d2-agents",
      title: "The lean agent",
      goal: "Pass all four tests without giving the agent any tool it doesn't need.",
      hint: "None of the test prompts asks for a picture.",
      takeaway: "Give agents only the tools their job needs. Fewer tools means fewer ways to misbehave.",
      render: (onSolved) => <AgentBuilderLab goal="lean" onSolved={onSolved} />,
    },
  ],
});
