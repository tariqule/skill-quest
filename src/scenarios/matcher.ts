import type { MatcherItem } from "@/engine/scenarios";
import type { LessonSource } from "@/engine/types";

/**
 * Service Matcher items. Cross-cloud equivalents come from the providers' own comparison pages
 * (Google Cloud's AWS/Azure/Google Cloud comparison and Microsoft's AWS-to-Azure comparison);
 * Kubernetes concepts come from kubernetes.io. Names use the providers' current wording.
 */

export const GOOGLE_COMPARE: LessonSource = { title: "Google Cloud: Compare AWS and Azure services to Google Cloud", url: "https://cloud.google.com/docs/get-started/aws-azure-gcp-service-comparison", license: "Official docs (link only)" };
export const AZURE_COMPARE: LessonSource = { title: "Microsoft: Azure for AWS professionals, service comparison", url: "https://learn.microsoft.com/en-us/azure/architecture/aws-professional/", license: "Official docs (link only)" };
const K8S: LessonSource = { title: "Kubernetes documentation: concepts", url: "https://kubernetes.io/docs/concepts/", license: "Official docs (link only)" };

/** One verified row: [need, AWS, Azure, Google Cloud]. */
export const CLOUD_TABLE: Record<string, [string, string, string, string]> = {
  vm: ["Virtual machines", "Amazon EC2", "Azure Virtual Machines", "Compute Engine"],
  fn: ["Functions as a service", "AWS Lambda", "Azure Functions", "Cloud Run functions"],
  k8s: ["Managed Kubernetes", "Amazon EKS", "Azure Kubernetes Service (AKS)", "Google Kubernetes Engine (GKE)"],
  obj: ["Object storage", "Amazon S3", "Azure Blob Storage", "Cloud Storage"],
  file: ["Shared file storage", "Amazon EFS", "Azure Files", "Filestore"],
  sql: ["Managed relational database", "Amazon RDS", "Azure SQL Database", "Cloud SQL"],
  nosql: ["Document / NoSQL database", "Amazon DynamoDB", "Azure Cosmos DB", "Firestore"],
  dw: ["Data warehouse", "Amazon Redshift", "Azure Synapse Analytics", "BigQuery"],
  cache: ["In-memory cache", "Amazon ElastiCache", "Azure Cache for Redis", "Memorystore"],
  cdn: ["Content delivery network", "Amazon CloudFront", "Azure Front Door", "Cloud CDN"],
  dns: ["DNS", "Amazon Route 53", "Azure DNS", "Cloud DNS"],
  net: ["Private virtual network", "Amazon VPC", "Azure Virtual Network", "Virtual Private Cloud (VPC)"],
  mon: ["Monitoring and metrics", "Amazon CloudWatch", "Azure Monitor", "Cloud Monitoring"],
  kms: ["Key management", "AWS KMS", "Azure Key Vault", "Cloud KMS"],
  secrets: ["Secrets storage", "AWS Secrets Manager", "Azure Key Vault", "Secret Manager"],
  events: ["Event routing", "Amazon EventBridge", "Azure Event Grid", "Eventarc"],
  stream: ["Event streaming ingest", "Amazon Kinesis Data Streams", "Azure Event Hubs", "Pub/Sub"],
  wf: ["Workflow orchestration", "AWS Step Functions", "Azure Logic Apps", "Workflows"],
  registry: ["Container registry", "Amazon ECR", "Azure Container Registry", "Artifact Registry"],
  link: ["Dedicated private connection", "AWS Direct Connect", "Azure ExpressRoute", "Cloud Interconnect"],
  waf: ["Web application firewall", "AWS WAF", "Azure Web Application Firewall", "Google Cloud Armor"],
  stt: ["Speech to text", "Amazon Transcribe", "Azure Speech (speech to text)", "Speech-to-Text"],
  tts: ["Text to speech", "Amazon Polly", "Azure Speech (text to speech)", "Text-to-Speech"],
  translate: ["Machine translation", "Amazon Translate", "Azure Translator", "Translation AI"],
  nlp: ["Text analytics (entities, sentiment)", "Amazon Comprehend", "Azure Language", "Natural Language AI"],
  vision: ["Image analysis", "Amazon Rekognition", "Azure Vision", "Vision AI"],
  docs: ["Document extraction", "Amazon Textract", "Azure Document Intelligence", "Document AI"],
};

const COLS = { aws: 1, azure: 2, gcp: 3 } as const;
type Col = keyof typeof COLS;
const NAME: Record<Col, string> = { aws: "AWS", azure: "Azure", gcp: "Google Cloud" };

/** Build a cross-cloud matcher from table rows. */
export function cloudMatcher(id: string, lesson: string, from: Col, to: Col, rows: (keyof typeof CLOUD_TABLE)[], title: string): MatcherItem {
  return {
    type: "matcher",
    id,
    lesson,
    title,
    mode: "clouds",
    prompt: `Match each ${NAME[from]} service to its closest ${NAME[to]} equivalent.`,
    leftLabel: NAME[from],
    rightLabel: NAME[to],
    pairs: rows.map((r) => [CLOUD_TABLE[r][COLS[from]], CLOUD_TABLE[r][COLS[to]]] as [string, string]),
    notes: rows.map((r) => `${CLOUD_TABLE[r][0]}: ${CLOUD_TABLE[r][1]} · ${CLOUD_TABLE[r][2]} · ${CLOUD_TABLE[r][3]}`),
    sources: to === "azure" || from === "azure" ? [GOOGLE_COMPARE, AZURE_COMPARE] : [GOOGLE_COMPARE],
  };
}

const usecase = (id: string, lesson: string, title: string, pairs: [string, string][], sources: LessonSource[], rightLabel = "Service"): MatcherItem => ({
  type: "matcher",
  id,
  lesson,
  title,
  mode: "usecase",
  prompt: "Match each need to the service built for it.",
  leftLabel: "Need",
  rightLabel,
  pairs,
  sources,
});

const AWS_OVERVIEW: LessonSource = { title: "Overview of Amazon Web Services", url: "https://docs.aws.amazon.com/whitepapers/latest/aws-overview/introduction.html", license: "Official docs (link only)" };

// AWS certs: AWS ↔ other clouds plus AWS use cases.
const AWS_CORE = (lessonCompute: string, lessonData: string, lessonNet: string): MatcherItem[] => [
  cloudMatcher("match-aws-gcp-core", lessonCompute, "aws", "gcp", ["vm", "fn", "k8s", "obj", "sql", "nosql"], "AWS to Google Cloud: core services"),
  cloudMatcher("match-aws-azure-core", lessonCompute, "aws", "azure", ["vm", "fn", "k8s", "obj", "dw", "cache"], "AWS to Azure: core services"),
  cloudMatcher("match-aws-azure-net", lessonNet, "aws", "azure", ["cdn", "dns", "net", "link", "waf", "mon"], "AWS to Azure: network, edge and monitoring"),
  cloudMatcher("match-aws-gcp-data", lessonData, "aws", "gcp", ["dw", "cache", "stream", "events", "wf", "registry"], "AWS to Google Cloud: data and integration"),
];

export const SAA_MATCH: MatcherItem[] = [
  ...AWS_CORE("d3-compute", "d3-databases", "d3-network"),
  usecase("match-saa-db", "d3-databases", "Pick the AWS database", [
    ["Relational, MySQL-compatible, up to 15 read replicas", "Amazon Aurora"],
    ["Key-value at any scale, single-digit-millisecond reads", "Amazon DynamoDB"],
    ["Petabyte-scale analytics warehouse", "Amazon Redshift"],
    ["In-memory cache in front of a database", "Amazon ElastiCache"],
    ["Graph relationships such as friends of friends", "Amazon Neptune"],
  ], [AWS_OVERVIEW]),
];

export const DVA_MATCH = (lesson: string): MatcherItem[] => [
  cloudMatcher("match-aws-gcp-core", "d1-start-lambda", "aws", "gcp", ["vm", "fn", "k8s", "obj", "sql", "nosql"], "AWS to Google Cloud: core services"),
  cloudMatcher("match-dva-azure-dev", lesson, "aws", "azure", ["fn", "nosql", "secrets", "events", "wf", "registry"], "AWS to Azure: developer services"),
  usecase("match-dva-messaging", "d1-messaging", "Pick the AWS messaging service", [
    ["Buffer work so one consumer handles each message", "Amazon SQS"],
    ["Push one message to many subscribers", "Amazon SNS"],
    ["Route events by rules from SaaS and AWS sources", "Amazon EventBridge"],
    ["Ordered, replayable stream read by several apps", "Amazon Kinesis Data Streams"],
    ["Coordinate steps with retries and branching", "AWS Step Functions"],
  ], [AWS_OVERVIEW]),
];

export const CLF_MATCH: MatcherItem[] = [
  ...AWS_CORE("d3-compute", "d3-databases", "d3-network").slice(0, 3),
  usecase("match-clf-security", "d2-services", "Pick the AWS security service", [
    ["Log every API call in the account", "AWS CloudTrail"],
    ["Detect threats from account and network activity", "Amazon GuardDuty"],
    ["Scan workloads for software vulnerabilities", "Amazon Inspector"],
    ["Download AWS compliance reports", "AWS Artifact"],
    ["Absorb DDoS attacks, with a free standard tier", "AWS Shield"],
  ], [AWS_OVERVIEW]),
];

export const AIF_MATCH: MatcherItem[] = [
  cloudMatcher("match-ai-aws-gcp", "d1-services", "aws", "gcp", ["stt", "tts", "translate", "nlp", "vision", "docs"], "AWS AI services to Google Cloud"),
  cloudMatcher("match-ai-aws-azure", "d1-services", "aws", "azure", ["stt", "tts", "translate", "nlp", "vision", "docs"], "AWS AI services to Azure"),
  usecase("match-aif-genai", "d2-stack", "Pick the AWS generative AI tool", [
    ["Call foundation models from several providers through one API", "Amazon Bedrock"],
    ["Retrieve company documents to ground answers", "Bedrock Knowledge Bases"],
    ["Block denied topics and mask PII", "Bedrock Guardrails"],
    ["Coding assistant in the IDE", "Amazon Q Developer"],
    ["Build, train and deploy your own ML models", "Amazon SageMaker AI"],
  ], [AWS_OVERVIEW, { title: "What is Amazon Bedrock?", url: "https://docs.aws.amazon.com/bedrock/latest/userguide/what-is-bedrock.html", license: "Official docs (link only)" }]),
];

export const AZURE_MATCH: MatcherItem[] = [
  cloudMatcher("match-ai-azure-aws", "d2-b-tools", "azure", "aws", ["stt", "tts", "translate", "nlp", "vision", "docs"], "Azure AI services to AWS"),
  cloudMatcher("match-azure-gcp-ai", "d2-b-tools", "azure", "gcp", ["stt", "tts", "translate", "nlp", "vision", "docs"], "Azure AI services to Google Cloud"),
  usecase("match-azure-tasks", "d1-workloads", "Pick the Azure AI capability", [
    ["Is this review positive or negative?", "Azure Language sentiment analysis"],
    ["Turn a meeting recording into text", "Azure Speech speech to text"],
    ["Pull fields from a claims form into JSON", "Content Understanding"],
    ["Describe what's in a photo", "Azure Vision image analysis"],
    ["Draft a reply in a given tone", "A generative model from Foundry Models"],
  ], [{ title: "Microsoft Foundry Tools overview", url: "https://learn.microsoft.com/en-us/azure/ai-services/what-are-ai-services", license: "Official docs (link only)" }]),
];

export const GCP_MATCH: MatcherItem[] = [
  cloudMatcher("match-gcp-aws-ai", "d2-apis", "gcp", "aws", ["stt", "tts", "translate", "nlp", "vision", "docs"], "Google Cloud AI APIs to AWS"),
  cloudMatcher("match-gcp-azure-core", "d2-b-cloud", "gcp", "azure", ["vm", "k8s", "obj", "dw", "sql", "nosql"], "Google Cloud to Azure: core services"),
  usecase("match-gcp-offerings", "d2-platform", "Pick the Google Cloud offering", [
    ["Compare Google, third-party and open models", "Model Garden"],
    ["Turn text into an image", "Imagen"],
    ["Generate a video clip", "Veo"],
    ["Fresh public facts for a model's answer", "Grounding with Google Search"],
    ["Search across company data for employees", "Gemini Enterprise"],
  ], [{ title: "Google Cloud generative AI docs", url: "https://cloud.google.com/vertex-ai/generative-ai/docs/overview", license: "Official docs (link only)" }]),
];

/** Kubernetes object ↔ the managed service each cloud uses for the same need. */
export const KCNA_MATCH: MatcherItem[] = [
  cloudMatcher("match-k8s-managed", "d1-b-kubernetes", "aws", "gcp", ["k8s", "registry", "obj", "file", "mon"], "Managed Kubernetes and its neighbours: AWS to Google Cloud"),
  cloudMatcher("match-k8s-managed-az", "d1-b-kubernetes", "aws", "azure", ["k8s", "registry", "obj", "file", "mon"], "Managed Kubernetes and its neighbours: AWS to Azure"),
  usecase("match-k8s-objects", "d1-workloads", "Pick the Kubernetes object", [
    ["Keep N identical Pods running and roll out updates", "Deployment"],
    ["One Pod on every node, such as a log agent", "DaemonSet"],
    ["Stable names and disks per replica", "StatefulSet"],
    ["Run a task to completion", "Job"],
    ["Run a task on a schedule", "CronJob"],
  ], [K8S], "Object"),
  usecase("match-k8s-net", "d2-services", "Pick the networking or storage object", [
    ["Stable virtual IP in front of Pods", "Service (ClusterIP)"],
    ["Route external HTTP by host and path", "Ingress"],
    ["Allow or deny traffic between Pods", "NetworkPolicy"],
    ["Ask for persistent storage", "PersistentVolumeClaim"],
    ["Non-secret configuration", "ConfigMap"],
  ], [K8S], "Object"),
];

export const SD_MATCH: MatcherItem[] = [
  usecase("match-sd-building-blocks", "d1-lb", "Pick the building block", [
    ["Spread requests across healthy servers", "Load balancer"],
    ["Serve static files from near the user", "CDN"],
    ["Keep hot reads in memory", "Cache"],
    ["Absorb bursts and decouple slow work", "Message queue"],
    ["Split data across machines by key", "Sharding"],
  ], [], "Building block"),
  cloudMatcher("match-sd-clouds", "d1-lb", "aws", "gcp", ["cdn", "cache", "stream", "obj", "nosql", "dns"], "The same blocks on AWS and Google Cloud"),
  cloudMatcher("match-sd-clouds-az", "d3-queues", "aws", "azure", ["cdn", "cache", "stream", "obj", "nosql", "dns"], "The same blocks on AWS and Azure"),
];
