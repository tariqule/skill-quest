import type { ChainItem, ChainStep } from "@/engine/scenarios";
import type { LessonSource } from "@/engine/types";

/**
 * Scenario Chains. Each chain has three main decisions; a weaker choice leads to a detour situation
 * (the consequence of that choice) before rejoining, so every run has 3 to 5 decisions.
 * Original scenarios, reasoned against the linked lessons and official docs.
 */

type Opt = [text: string, why: string];
interface S {
  s: string;
  best: Opt;
  wrong: Opt[];
}

const step = (x: S, bestNext: string | undefined, wrongNext: string | undefined): ChainStep => ({
  situation: x.s,
  choices: [{ text: x.best[0], why: x.best[1], best: true, next: bestNext }, ...x.wrong.map(([text, why]) => ({ text, why, best: false, next: wrongNext }))],
});

/** s1 → s2 → s3, with detour d1 after a weak first choice and d2 after a weak second choice. */
export function chain(id: string, lesson: string, title: string, intro: string, [s1, d1, s2, d2, s3]: [S, S, S, S, S], sources?: LessonSource[]): ChainItem {
  return {
    type: "chain",
    id,
    lesson,
    title,
    intro,
    start: "s1",
    steps: {
      s1: step(s1, "s2", "d1"),
      d1: step(d1, "s2", "s2"),
      s2: step(s2, "s3", "d2"),
      d2: step(d2, "s3", "s3"),
      s3: step(s3, undefined, undefined),
    },
    sources,
  };
}

const src = (label: string, url: string): LessonSource => ({ title: label, url, license: "Official docs (link only)" });

// ───────────── SAA-C03 ─────────────

export const SAA_CHAINS: ChainItem[] = [
  chain("chain-saa-outage", "d2-dr", "The Region that went quiet", "You run an online booking app in one AWS Region. The business now wants recovery within an hour (RTO) and at most 5 minutes of lost data (RPO) if the Region fails.", [
    { s: "First, pick a disaster recovery strategy that fits a 1-hour RTO without paying for a full second copy.", best: ["Warm standby in a second Region", "A scaled-down but running copy can be scaled up well within an hour."], wrong: [["Backup and restore from nightly snapshots", "Restores take hours and nightly backups lose up to a day of data: both targets are missed."], ["Multi-site active/active in two Regions", "Meets the targets but doubles the cost the business asked to avoid."]] },
    { s: "A drill with nightly backups took 7 hours and lost 20 hours of bookings. Leadership is unhappy. What now?", best: ["Move to warm standby with continuous replication", "Continuous replication fixes RPO and a running copy fixes RTO."], wrong: [["Take backups twice a day instead of nightly", "Better RPO, but restores still take hours."]] },
    { s: "The database is Aurora MySQL. How do you keep the second Region's copy within a few seconds?", best: ["Aurora Global Database", "Storage-level replication to secondary Regions, typically with under a second of lag."], wrong: [["Copy a snapshot every hour", "Up to an hour of lost data blows the 5-minute RPO."], ["A cron job that dumps SQL files", "Slow and fragile, and the lag grows with data size."]] },
    { s: "Replica lag on hourly snapshots hit 58 minutes during a test. The auditor flags the RPO. What do you change?", best: ["Switch to Aurora Global Database", "Replication lag in seconds meets the 5-minute RPO."], wrong: [["Take a snapshot every 30 minutes", "Still far beyond a 5-minute RPO."]] },
    { s: "Last step: how do users reach the second Region when the first fails?", best: ["Route 53 failover routing with health checks", "DNS answers switch to the healthy Region when checks fail."], wrong: [["Email users the new URL", "Slow and unreliable; nobody updates bookmarks in an outage."], ["Simple routing records for both Regions", "Simple routing doesn't check health, so it keeps sending users to the dead Region."]] },
  ], [src("Disaster recovery options in the cloud", "https://docs.aws.amazon.com/whitepapers/latest/disaster-recovery-workloads-on-aws/disaster-recovery-options-in-the-cloud.html"), src("Aurora Global Database", "https://docs.aws.amazon.com/AmazonRDS/latest/AuroraUserGuide/aurora-global-database.html")]),
  chain("chain-saa-private", "d1-vpc-security", "Locking down a private subnet", "Your app servers sit in private subnets. They need OS patches from the internet and to read from S3, but nothing on the internet may reach them.", [
    { s: "How do the servers reach the internet for patches?", best: ["A NAT gateway in a public subnet", "Allows outbound connections only; nothing can start a connection inward."], wrong: [["Give each server a public IP", "Makes every server reachable from the internet."], ["Attach an internet gateway to the private route table", "That makes the subnet public, not private."]] },
    { s: "A scan finds your servers reachable on port 22 from anywhere. You must fix it fast.", best: ["Remove public IPs and use a NAT gateway", "Outbound still works and inbound paths disappear."], wrong: [["Change SSH to port 2222 on every server", "Obscurity; scanners find it quickly."]] },
    { s: "S3 traffic through the NAT gateway is costing a lot in data processing. What next?", best: ["Add an S3 gateway endpoint", "S3 traffic stays on the AWS network and gateway endpoints have no hourly charge."], wrong: [["Buy a bigger NAT gateway", "NAT gateways scale automatically; cost is per GB processed."], ["Copy objects to EBS each night", "Extra storage, extra work, still stale data."]] },
    { s: "The NAT bill keeps growing. Finance asks why S3 reads cost money at all.", best: ["Route S3 through a gateway endpoint", "Removes the NAT processing charge for S3 traffic."], wrong: [["Compress the files in S3 before reading them", "Some saving, but traffic still pays the NAT rate."]] },
    { s: "Security wants a second layer that blocks one known bad IP range at the subnet edge.", best: ["Add a deny rule to the network ACL", "NACLs are stateless and support explicit deny rules at the subnet level."], wrong: [["Add a deny rule to the security group", "Security groups only have allow rules."], ["Rely on the NAT gateway to block it", "A NAT gateway has no IP block lists."]] },
  ], [src("NAT gateways", "https://docs.aws.amazon.com/vpc/latest/userguide/vpc-nat-gateway.html"), src("Gateway endpoints", "https://docs.aws.amazon.com/vpc/latest/privatelink/gateway-endpoints.html")]),
];

// ───────────── DVA ─────────────

const dvaChains = (secretsLesson: string): ChainItem[] => [
  chain("chain-dva-throttle", "d1-dynamodb", "The hot partition", "Your DynamoDB table stores game scores with partition key game_id. A new hit game launches and writes start failing with throttling errors.", [
    { s: "What do you check first?", best: ["Whether writes pile onto one key", "One popular game_id concentrates traffic on a single partition."], wrong: [["The Lambda memory size", "Memory doesn't change DynamoDB throttling."], ["The table's encryption setting", "Encryption doesn't cause throttling."]] },
    { s: "You doubled the Lambda memory and nothing changed. Errors still spike on writes for the new game.", best: ["Find hot keys with Contributor Insights", "Shows the most-accessed keys, revealing the hot one."], wrong: [["Double the Lambda memory size once again", "The bottleneck isn't the function."]] },
    { s: "One game_id is the hot key. How do you spread the writes?", best: ["Add a random suffix to the key", "Spreads one logical key across many partitions."], wrong: [["Switch to strongly consistent reads", "Reads don't fix a write hotspot."], ["Add a global secondary index on game_id", "The base table still takes every write on that key."]] },
    { s: "Strongly consistent reads doubled read cost and writes still throttle.", best: ["Shard the hot key with a suffix", "Spreading the writes is what removes the hotspot."], wrong: [["Turn on DAX in front of the table", "DAX caches reads; writes still go to the table."]] },
    { s: "Your SDK still sees the occasional throttle. How should the code respond?", best: ["Retry with exponential backoff and jitter", "Spreads retries out so they don't collide again."], wrong: [["Retry instantly in a tight loop until it works", "Makes the throttling worse."], ["Drop the write and log it", "Loses player scores."]] },
  ], [src("Partition key design", "https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/bp-partition-key-sharding.html")]),
  chain("chain-dva-leak", secretsLesson, "A secret in the repo", "A teammate notices the production database password committed to a public Git repository an hour ago.", [
    { s: "What do you do first?", best: ["Rotate the password now", "Assume it's compromised; history and forks keep it even after deletion."], wrong: [["Delete the file in a new commit", "The password remains in history and any clones."], ["Make the repo private", "It was public; it may already be copied."]] },
    { s: "You deleted the file, but a scanner shows the password still in the commit history and a fork.", best: ["Rotate the password immediately", "Only a new password makes the leaked one useless."], wrong: [["Rewrite history and hope nobody saw it", "Forks and caches keep the old copy."]] },
    { s: "Where should the app get the password from now on?", best: ["Secrets Manager, read at runtime", "Kept out of code, encrypted, and rotatable."], wrong: [["A .env file committed to the repo", "Same leak, different file."], ["Hard-coded but obfuscated", "Obfuscation is easy to reverse."]] },
    { s: "The .env file leaked too. Security asks for a fix that can't be committed by mistake.", best: ["Move it to Secrets Manager with rotation", "Nothing secret lives in the repo any more."], wrong: [["Only add .env to .gitignore from now on", "Helps, but the value still lives on laptops and in builds."]] },
    { s: "How do you stop the next leak before it reaches GitHub?", best: ["Turn on secret scanning with push protection", "Blocks pushes that contain known secret patterns."], wrong: [["Send a reminder email to the whole team", "People forget."], ["Review every commit by hand", "Slow and misses things."]] },
  ], [src("Rotate AWS Secrets Manager secrets", "https://docs.aws.amazon.com/secretsmanager/latest/userguide/rotating-secrets.html")]),
];

export const DVA_C02_CHAINS = dvaChains("d2-secrets");
export const DVA_C03_CHAINS = dvaChains("d2-data");

// ───────────── AIF-C01 ─────────────

export const AIF_CHAINS: ChainItem[] = [
  chain("chain-aif-hallucinate", "d3-rag", "The confident wrong answer", "Your internal chatbot on Amazon Bedrock tells an employee the parental leave policy is 6 weeks. It's actually 16 weeks.", [
    { s: "What's the most likely cause?", best: ["The model isn't grounded in the policy documents", "Without the documents, it fills gaps with plausible text."], wrong: [["The model's temperature is set too low", "Low temperature makes output steadier; it doesn't invent facts."], ["The prompt was too short to explain policy", "Length isn't the issue; missing facts are."]] },
    { s: "Raising temperature made answers more varied but still wrong.", best: ["Ground it with retrieval (RAG)", "Feed the real policy text into each answer."], wrong: [["Raise the temperature further for variety", "More randomness, not more truth."]] },
    { s: "How do you give it the real policies?", best: ["Bedrock Knowledge Bases over the policy files", "Retrieves relevant passages at question time."], wrong: [["Fine-tune once on last year's handbook", "Stale on day one and hard to cite."], ["Paste the entire handbook into every prompt", "Expensive and may not fit the context window."]] },
    { s: "The fine-tuned model now quotes last year's 12-week policy.", best: ["Switch to Knowledge Bases on current files", "Updates show up when the files change."], wrong: [["Fine-tune again on the new files every week", "Costly and still lags."]] },
    { s: "How do you check answers stay right over time?", best: ["Evaluate against a set of known Q&A pairs", "Regular evaluation catches drift and regressions."], wrong: [["Wait for complaints", "Users get wrong answers first."], ["Check that the answers sound confident", "Confidence isn't correctness."]] },
  ], [src("Amazon Bedrock Knowledge Bases", "https://docs.aws.amazon.com/bedrock/latest/userguide/knowledge-base.html")]),
  chain("chain-aif-bias", "d4-bias", "The loan model that said no", "A bank's ML model approves loans. An audit finds applicants from one postcode area are rejected far more often with similar finances.", [
    { s: "What do you investigate first?", best: ["Bias in the training data and features", "Postcode can act as a proxy for protected traits."], wrong: [["The endpoint's instance size and scaling", "Hardware doesn't decide approvals."], ["The model's latency", "Speed isn't the fairness problem."]] },
    { s: "The bigger instance changed nothing. The audit deadline is next week.", best: ["Measure bias with SageMaker Clarify", "Reports bias metrics on data and predictions."], wrong: [["Ignore it until the next release", "Regulators won't wait."]] },
    { s: "Clarify shows postcode drives the gap. What next?", best: ["Remove the proxy feature and retrain", "Cuts the unfair signal at its source."], wrong: [["Hide the postcode field in the loan UI", "The model still uses it."], ["Add more postcode data and retrain as-is", "Strengthens the proxy."]] },
    { s: "Hiding the field didn't change approvals.", best: ["Retrain without the proxy feature", "The model must stop learning from it."], wrong: [["Lower the approval threshold for all", "Approves risky loans without fixing fairness."]] },
    { s: "Customers ask why they were rejected. How do you answer?", best: ["Feature-level explanations", "Explainability shows which factors drove a decision."], wrong: [["Say the model decided", "Not transparent and may break regulations."], ["Publish the model weights for anyone to inspect", "Unreadable to customers."]] },
  ], [src("Amazon SageMaker Clarify", "https://docs.aws.amazon.com/sagemaker/latest/dg/clarify-configure-processing-jobs.html")]),
];

// ───────────── CLF-C02 ─────────────

export const CLF_CHAINS: ChainItem[] = [
  chain("chain-clf-bill", "d4-tools", "The surprise bill", "A startup's AWS bill jumped from $300 to $4,800 this month. Nobody knows why.", [
    { s: "Where do you look first?", best: ["Cost Explorer, grouped by service", "Shows which service caused the jump."], wrong: [["The AWS Health Dashboard for the account", "Shows service events, not spending."], ["CloudWatch CPU graphs", "Usage hints, but not cost by service."]] },
    { s: "CPU looks normal everywhere. The founder is getting nervous.", best: ["Open Cost Explorer by service and day", "Pinpoints which service and day spiked."], wrong: [["Open a support case and wait for a reply", "Support can help, but you can find this yourself now."]] },
    { s: "A forgotten GPU instance ran all month. How do you avoid a repeat?", best: ["Set an AWS Budget with alerts", "Warns before spend gets far."], wrong: [["Check the bill at month end", "Too late to stop it."], ["Remove all GPU access forever", "Blocks real work."]] },
    { s: "Next month another test cluster runs for a weekend unnoticed.", best: ["Add a budget alert on forecasted spend", "Alerts when the month is heading over plan."], wrong: [["Ask everyone to be careful with resources", "Doesn't scale."]] },
    { s: "The team will keep using steady compute 24/7 for a year. How do they pay less?", best: ["Buy a Compute Savings Plan", "Commit to steady spend for a lower rate."], wrong: [["Use On-Demand only", "Highest price for steady use."], ["Use Spot for the database", "Spot can be reclaimed; bad for a database."]] },
  ]),
  chain("chain-clf-shared", "d2-shared", "Whose job is it?", "A company moves an app to EC2 and assumes AWS now handles all security.", [
    { s: "Who patches the guest operating system on EC2?", best: ["The customer", "On EC2 you manage the guest OS and everything above it."], wrong: [["AWS", "AWS secures the hardware and hypervisor, not your OS."], ["Nobody, it's automatic", "Patches don't apply themselves on EC2."]] },
    { s: "Months later, an unpatched OS is exploited. The team says AWS should have patched it.", best: ["Patch it with Systems Manager", "Automates patching, which is your responsibility."], wrong: [["Raise a claim with AWS for the breach", "It was the customer's side of the model."]] },
    { s: "Who secures the physical data centers?", best: ["AWS", "Security of the cloud is AWS's side."], wrong: [["The customer", "Customers can't enter AWS data centers."], ["A shared guard rota", "No such arrangement."]] },
    { s: "An auditor asks for proof of the data center controls.", best: ["Download the reports from AWS Artifact", "AWS's compliance reports cover its side."], wrong: [["Ask to visit an AWS data center yourself", "AWS doesn't allow customer visits."]] },
    { s: "The team moves the database to RDS. What changes?", best: ["AWS now patches the database engine and OS", "Managed services shift more work to AWS."], wrong: [["Nothing changes", "Managed services change the split."], ["AWS also controls who can access data", "Access to your data stays your job."]] },
  ]),
];

// ───────────── Azure AI-901 ─────────────

export const AZURE_CHAINS: ChainItem[] = [
  chain("chain-az-agent", "d2-agents", "The agent that made things up", "You built a help-desk agent in Foundry. Testers say it invents ticket numbers.", [
    { s: "Why might it invent ticket numbers?", best: ["It has no tool to look tickets up", "Without live data it guesses something plausible."], wrong: [["The model is too large", "Size isn't the cause."], ["Its temperature is set to exactly 0", "Low temperature doesn't create facts."]] },
    { s: "You swapped to a smaller model. It still invents tickets, just shorter.", best: ["Give it a ticket-lookup tool", "Real data replaces guesses."], wrong: [["Try an even smaller, faster model", "Still no access to tickets."]] },
    { s: "The tool works. Now it chats about football when asked.", best: ["Tighten the agent's instructions", "Instructions set scope and tone."], wrong: [["Remove the ticket tool", "Breaks the useful part."], ["Raise the temperature for creativity", "Makes it wander more."]] },
    { s: "With higher temperature it now writes poems about tickets.", best: ["Set clear instructions and lower temperature", "Keeps it focused and steady."], wrong: [["Add more tools that it doesn't need yet", "Doesn't stop off-topic chat."]] },
    { s: "Before launch, how do you check it behaves?", best: ["Test with sample conversations and review traces", "Shows tool calls and replies before users see them."], wrong: [["Launch it and watch social media for complaints", "Users find the bugs first."], ["Ask the agent if it's ready", "It can't judge itself."]] },
  ]),
  chain("chain-az-rai", "d1-rai", "Face check at the door", "A gym wants to use cameras and AI to let members in by face.", [
    { s: "Which responsible AI principle comes up first?", best: ["Privacy and security", "Face images are sensitive personal data."], wrong: [["Inclusiveness only", "Important, but privacy comes first with biometrics."], ["None, it's just a door", "Biometric data carries real risk."]] },
    { s: "You skipped consent. Members complain their faces were captured without asking.", best: ["Ask for consent and offer a card option", "Lets people choose and protects privacy."], wrong: [["Delete the complaints and keep the camera", "Ignores the problem."]] },
    { s: "Tests show it fails more often for darker skin tones.", best: ["Fairness: test across groups and fix the gaps", "Uneven error rates are a fairness issue."], wrong: [["Ship it; it works for most members", "Excludes some members."], ["Blame the gym lighting and change nothing", "Measure first; don't assume."]] },
    { s: "Members locked out complain publicly.", best: ["Keep a staffed fallback and retest", "Nobody should be stuck at the door."], wrong: [["Lower the face-match threshold for everyone", "Lets the wrong people in."]] },
    { s: "Who answers when the system makes a mistake?", best: ["A named team at the gym (accountability)", "People, not the model, are accountable."], wrong: [["Only the camera vendor that sold the system", "The gym deploys it and owns the outcome."], ["Nobody, it's automatic", "Accountability is a core principle."]] },
  ], [src("Microsoft responsible AI principles", "https://learn.microsoft.com/en-us/azure/machine-learning/concept-responsible-ai")]),
];

// ───────────── GCP Generative AI Leader ─────────────

export const GCP_CHAINS: ChainItem[] = [
  chain("chain-gcp-start", "d4-strategy", "Where to start with gen AI", "A retailer's board says 'we need gen AI'. You lead the first project.", [
    { s: "Where do you begin?", best: ["Pick a clear business problem and success metric", "Problem first, then the tool."], wrong: [["Pick the biggest model available today", "Tool-first projects rarely show value."], ["Build a custom foundation model from scratch", "Slow and costly before proving value."]] },
    { s: "The big model demo impressed nobody: it wasn't tied to any real task.", best: ["Restart from one problem, like support wait times", "A measurable problem shows value."], wrong: [["Try an even bigger model on the same idea", "Same problem."]] },
    { s: "The problem is slow answers to product questions. How do you build it?", best: ["Use an existing model grounded in product data", "Fast to try and accurate on your facts."], wrong: [["Train a new foundation model", "Huge cost for a solved problem."], ["Let it answer from the model's general knowledge", "Will get products wrong."]] },
    { s: "Answers are generic and sometimes wrong about stock.", best: ["Ground it in the product catalog", "Real data gives accurate answers."], wrong: [["Write longer prompts about the products", "Doesn't add the missing facts."]] },
    { s: "How do you show the board it worked?", best: ["Compare wait time and satisfaction to the baseline", "Measured impact against the starting point."], wrong: [["Count how many prompts were sent per day", "Activity isn't impact."], ["Share a polished demo video with leadership", "Doesn't prove value."]] },
  ]),
  chain("chain-gcp-privacy", "d4-privacy", "Customer data in the prompt", "A team wants to summarise customer chats with a model to spot trends.", [
    { s: "The chats contain names and phone numbers. What first?", best: ["Remove or mask personal data first", "Only send what the task needs."], wrong: [["Send everything; it's internal", "Personal data still needs protection."], ["Ask the model to forget it", "Models don't forget on request."]] },
    { s: "Legal flags that raw chats were sent with phone numbers.", best: ["Add de-identification before the model", "Mask data at the source, every time."], wrong: [["Apologise to users and carry on as before", "The risk remains."]] },
    { s: "Analysts need to link trends back to a customer later. How?", best: ["Pseudonymise with a token kept separately", "Data can be re-linked by authorised people only."], wrong: [["Keep real names in case analysts need them", "Defeats the privacy goal."], ["Fully anonymise and link anyway", "Anonymised data can't be re-linked."]] },
    { s: "Analysts can't trace a complaint back to the customer.", best: ["Use pseudonymous tokens instead", "Keeps the link controlled."], wrong: [["Put real names back in the data", "Undoes the protection."]] },
    { s: "Who should see the token-to-name mapping?", best: ["Only an authorised few, with access logged", "Least privilege and audit."], wrong: [["The whole analytics team, for convenience", "Too broad."], ["Store the lookup table inside the prompt", "Leaks it to the model."]] },
  ]),
];

// ───────────── KCNA ─────────────

export const KCNA_CHAINS: ChainItem[] = [
  chain("chain-k8s-crashloop", "d2-troubleshooting", "CrashLoopBackOff on release day", "A new version of the web Deployment rolls out. Pods go into CrashLoopBackOff.", [
    { s: "What do you run first?", best: ["kubectl logs --previous on a failing Pod", "Shows why the last container instance crashed."], wrong: [["Delete the whole namespace and redeploy", "Destroys evidence and everything else."], ["Scale to 50 replicas", "More crashing Pods."]] },
    { s: "Scaling up gave you 50 crashing Pods and a pager storm.", best: ["Read logs from the previous container", "Find the real error first."], wrong: [["Scale the Deployment to 100 replicas", "Same crash, more noise."]] },
    { s: "Logs say a required env var DB_URL is missing. Fastest safe fix?", best: ["kubectl rollout undo, then fix the config", "Restores the last good version now."], wrong: [["Edit the running Pod's spec directly", "Pods from the Deployment get replaced."], ["Restart the node the Pod runs on", "Not a node problem."]] },
    { s: "Your Pod edit vanished when the Pod restarted.", best: ["Roll back the Deployment", "Fix at the controller, not the Pod."], wrong: [["Edit the Deployment again and hope", "It'll vanish again."]] },
    { s: "How do you stop bad versions taking traffic next time?", best: ["Add a readiness probe", "Pods get traffic only when ready."], wrong: [["Turn off health checks", "Hides failures."], ["Deploy only on Fridays", "Timing isn't a safeguard."]] },
  ], [src("Debug running Pods", "https://kubernetes.io/docs/tasks/debug/debug-application/debug-running-pod/")]),
  chain("chain-k8s-pending", "d1-scheduling", "Pods stuck in Pending", "After a traffic spike, new Pods for the API stay Pending.", [
    { s: "Where do you look first?", best: ["kubectl describe pod, Events section", "Shows scheduler messages like insufficient CPU."], wrong: [["Restart the API server to clear the queue", "Unrelated and risky."], ["Delete pending Pods", "They'll be recreated, still pending."]] },
    { s: "Deleted Pods came back Pending. You still don't know why.", best: ["Describe a Pod and read its events", "The scheduler says why."], wrong: [["Delete the Pending Pods again", "Same result."]] },
    { s: "Events say 'Insufficient cpu'. What fixes it lasting?", best: ["Enable cluster autoscaling to add nodes", "New nodes give room to schedule."], wrong: [["Remove all CPU requests from the Pods", "Scheduler loses its guide; nodes overload."], ["Use a bigger image", "Image size isn't CPU."]] },
    { s: "Without requests, nodes overload and Pods get evicted.", best: ["Restore requests and autoscale nodes", "Accurate requests plus capacity."], wrong: [["Remove the memory limits as well", "Worse overload."]] },
    { s: "How do you keep a noisy team from taking all CPU?", best: ["ResourceQuota on their namespace", "Caps total requests per namespace."], wrong: [["Ask them politely", "Not enforced."], ["Give them their own cluster", "Costly overkill."]] },
  ]),
];

// ───────────── System Design ─────────────

export const SD_CHAINS: ChainItem[] = [
  chain("chain-sd-slow", "d1-cache", "The homepage that crawls", "Your product homepage takes 4 seconds. The DB is at 90% CPU from the same queries.", [
    { s: "First move?", best: ["Cache the hot query results", "Repeat reads come from memory."], wrong: [["Shard the database now", "Big change before trying the simple fix."], ["Add more web servers to the fleet", "The DB is the bottleneck."]] },
    { s: "More web servers made the DB hotter.", best: ["Add a cache in front of the DB", "Takes the repeat load off the DB."], wrong: [["Add even more web servers behind the load balancer", "Same bottleneck."]] },
    { s: "Prices change hourly and stale prices upset users. Strategy?", best: ["Short TTL and invalidate on price change", "Fresh enough, still cached."], wrong: [["Cache prices forever to save reads", "Stale prices."], ["Turn caching off for all pages", "Back to 4 seconds."]] },
    { s: "Users saw yesterday's prices.", best: ["Invalidate on write and add a TTL", "Keeps cache fresh."], wrong: [["Clear the whole cache hourly", "Causes a thundering herd."]] },
    { s: "A cache node fails; every request hits the DB at once.", best: ["Request coalescing and staggered TTLs", "Avoids a stampede."], wrong: [["Restart the database during the spike", "Doesn't stop the herd."], ["Remove the cache layer completely", "Same load forever."]] },
  ]),
  chain("chain-sd-retry", "d4-reliability", "The dependency that went slow", "Your checkout calls a payment API that has started taking 20 seconds.", [
    { s: "First thing to add?", best: ["A timeout on the call", "Don't wait forever on a slow dependency."], wrong: [["Unlimited immediate retries", "Multiplies load on a struggling service."], ["Nothing; it'll recover", "Threads pile up and checkout dies."]] },
    { s: "Instant retries tripled load and the payment API went fully down.", best: ["Set timeouts and back off retries", "Gives it room to recover."], wrong: [["Retry faster with no delay between attempts", "Worse."]] },
    { s: "It keeps failing for minutes. What protects checkout?", best: ["A circuit breaker that fails fast", "Stops calling a broken service for a while."], wrong: [["Keep retrying every call until it succeeds", "Ties up resources."], ["Remove the payment step", "Loses money."]] },
    { s: "Thread pools exhausted; whole site slow.", best: ["Add a circuit breaker", "Isolates the failure."], wrong: [["Bigger thread pools", "Delays the crash."]] },
    { s: "How do you make retries safe so cards aren't charged twice?", best: ["Send an idempotency key", "Server returns the first result for repeats."], wrong: [["Hope it doesn't happen", "It will."], ["Never retry payments", "Loses sales on blips."]] },
  ]),
];

// ───────────── Git and Docker ─────────────

export const GIT_CHAINS: ChainItem[] = [
  chain("chain-git-oops", "d4-undo", "The bad commit on main", "You merged a commit to the shared main branch that breaks the build. Others have pulled it.", [
    { s: "How do you undo it?", best: ["git revert the commit and push", "Adds an undo commit without rewriting shared history."], wrong: [["git reset --hard and force-push", "Rewrites history others already have."], ["Delete the repo and re-clone", "Loses everyone's work."]] },
    { s: "After the force-push, teammates' pulls fail with diverged histories.", best: ["Revert instead of force-pushing", "Shared history should only move forward."], wrong: [["Force-push again over the shared branch", "More confusion."]] },
    { s: "A local reset lost commits you need.", best: ["Find them with git reflog", "Reflog records where HEAD has been."], wrong: [["They're gone forever after a reset", "Usually not; reflog keeps them."], ["Re-type the code", "Slow and error-prone."]] },
    { s: "You started re-typing code from memory.", best: ["Stop and check git reflog", "The commits are likely still there."], wrong: [["Keep typing the lost work from memory", "Waste of time."]] },
    { s: "Which commit introduced the break in 200 commits?", best: ["git bisect", "Binary search through history."], wrong: [["Read every diff", "Slow."], ["Guess", "Unreliable."]] },
  ]),
];

export const DOCKER_CHAINS: ChainItem[] = [
  chain("chain-docker-slow", "d2-cache", "The 15-minute build", "Your Node image rebuilds everything, including npm install, on every code change.", [
    { s: "Why is the cache missed?", best: ["COPY . . runs before npm install", "Any file change busts the install layer."], wrong: [["Docker never caches npm dependencies", "It caches layers."], ["The base image is too new", "Not the cause."]] },
    { s: "Switching base images didn't help. Still 15 minutes.", best: ["Copy package files and install first", "Install layer reused unless deps change."], wrong: [["Build with --no-cache every time", "Makes every build cold."]] },
    { s: "Builds are fast but the image is 1.2 GB.", best: ["Use a multi-stage build", "Ship only runtime files."], wrong: [["Add more RUN layers to split the work", "Bigger."], ["Zip the image before pushing it", "Not how images work."]] },
    { s: "The image still ships compilers and dev deps.", best: ["Copy only build output into a slim stage", "Drops build tools."], wrong: [["Delete the build files in a later layer", "Earlier layers still hold them."]] },
    { s: "Security asks who the container runs as.", best: ["A non-root USER", "Limits damage if compromised."], wrong: [["root, for simplicity", "Bigger blast radius."], ["It doesn't matter", "It does."]] },
  ]),
];
