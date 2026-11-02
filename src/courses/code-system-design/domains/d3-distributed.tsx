import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { TokenBucketLab } from "../labs";
import { CapVisual } from "../visuals";

/** Domain 3: queues and streams, consistency models, idempotency and the outbox, rate limiting. */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Distributed Systems Toolkit",
    world: "The Consistency Canyon",
    weight: 25,
    emoji: "🏜️",
    color: "#f472b6",
    summary: "Queues and streams, the CAP and PACELC trade-offs, retries that are safe because repeating them changes nothing, and rate limiters that keep usage fair.",
  },

  tasks: [
    { id: "3.1", title: "Decouple with queues and streams", covers: ["work queues vs logs", "delivery semantics", "partitions, ordering, consumer groups", "DLQs and backpressure"] },
    { id: "3.2", title: "Reason about consistency", covers: ["CAP", "PACELC", "consistency models", "consensus and quorums"] },
    { id: "3.3", title: "Make operations safe to retry", covers: ["idempotent HTTP methods", "idempotency keys", "the dual-write problem", "transactional outbox"] },
    { id: "3.4", title: "Rate limit", covers: ["token and leaky bucket", "fixed and sliding windows", "429 and Retry-After", "distributed limiters"] },
  ],

  lessons: [
    {
      id: "d3-start-queues",
      level: "beginner",
      task: "3.1",
      title: "Queues: a line for work",
      check: ["sd-b3-01", "sd-b3-02"],
      visual: (
        <Flow
          color="#f472b6"
          steps={[
            { icon: "🧾", label: "Order taken", sub: "The waiter writes a ticket and moves on" },
            { icon: "📌", label: "Ticket rail", sub: "Tickets wait in line, in order" },
            { icon: "👩‍🍳", label: "Cooks", sub: "Each cook takes the next ticket when ready" },
            { icon: "🍽️", label: "Done", sub: "The ticket comes off the rail" },
          ]}
        />
      ),
      points: [
        "A **queue** is a waiting line for work. One part of a system drops a job in, and another part picks it up later.",
        "Picture a restaurant ticket rail. The waiter pins an order and goes back to the tables. The cooks take tickets when they're free.",
        "The waiter never waits for the food, and a sudden rush just makes the rail longer. Nothing gets lost.",
        "In software, the part adding jobs is the **producer** and the part doing them is the **consumer**. You can add more consumers when the line gets long.",
      ],
      tip: "Reach for a queue whenever work is slow and the user doesn't need the result right away, like sending an email or resizing a photo.",
    },
    {
      id: "d3-start-retries",
      level: "beginner",
      task: "3.3",
      title: "Trying again safely",
      check: ["sd-b3-03", "sd-b3-04"],
      visual: (
        <Tiles
          cols={2}
          tiles={[
            { icon: "💡", title: "Safe to repeat", text: "Pressing a light switch to \"on\" twice still leaves the light on. Doing it again changes nothing.", color: "#2dd4bf" },
            { icon: "💳", title: "Not safe to repeat", text: "Pressing \"pay £10\" twice could charge you £20. Repeating it changes the result.", color: "#f472b6" },
            { icon: "🔁", title: "Retry", text: "When a request times out, the client sends it again. That's only safe if repeating it does no harm.", color: "#60a5fa" },
            { icon: "🚦", title: "Rate limit", text: "A cap on how many requests one user can send, like a turnstile that lets one person through at a time.", color: "#fbbf24" },
          ]}
        />
      ),
      points: [
        "Networks drop messages. When a request times out, you often can't tell whether it worked, so apps try again. That's a **retry**.",
        "An action is **idempotent** if doing it twice gives the same result as doing it once. Setting your name to \"Sam\" twice is fine. Adding £10 twice is not.",
        "To make risky actions safe, the client sends a unique ticket number with the request. If the server has seen that number before, it doesn't do the work again.",
        "A **rate limit** caps how many requests each user can send in a period, so one busy client can't crowd everyone else out.",
      ],
      tip: "Whenever you say \"we'll retry\" in a design, add why repeating it is safe.",
    },
    {
      id: "d3-queues",
      level: "intermediate",
      task: "3.1",
      title: "Queues and streams",
      sources: [{ title: "System Design Primer: Message queues", url: "https://github.com/donnemartin/system-design-primer#message-queues", license: "CC BY 4.0" }],
      check: ["d3-01", "d3-03"],
      visual: (
        <div className="grid gap-3">
          <Flow
            color="#f472b6"
            steps={[
              { icon: "📤", label: "Producer", sub: "The upload API adds a job and returns 202" },
              { icon: "📬", label: "Queue / topic", sub: "Holds bursts safely on disk" },
              { icon: "⚙️", label: "Consumers", sub: "Work at their own pace and confirm when done" },
              { icon: "🪦", label: "Dead-letter queue", sub: "Messages that failed too many times" },
            ]}
          />
          <Tiles
            tiles={[
              { icon: "📬", title: "Work queue (SQS, RabbitMQ)", text: "Each message goes to one consumer and is deleted once it's confirmed. Great for background jobs.", color: "#f472b6" },
              { icon: "📜", title: "Log or stream (Kafka, Kinesis)", text: "An append-only record that's kept and split into ordered partitions. Many consumer groups each read at their own position, and you can replay it.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "Queues separate producers from consumers. They soak up bursts, retry failures, and let each side grow or fail on its own.",
        "Most brokers deliver **at least once**: a message can arrive twice. So consumers must be idempotent, meaning a repeat does no harm.",
        "Kafka keeps messages in order only inside one partition. Give related events the same key, such as order_id, so they land in the same partition.",
        "Within one consumer group, you can't have more busy consumers than partitions. Watch how far behind consumers are, and push back on producers when the gap grows.",
        "Delivery guarantees: **at-most-once** never resends, so a crash can lose a message. **At-least-once** resends until acknowledged, so duplicates are possible. **Effectively-once** is at-least-once delivery plus an idempotent consumer.",
      ],
      tip: "When you add a queue, say what happens on failure: retries with backoff, a visibility timeout longer than the work takes, and a dead-letter queue.",
    },
    {
      id: "d3-cap",
      level: "senior",
      task: "3.2",
      title: "CAP, PACELC and consistency models",
      sources: [{ title: "System Design Primer: CAP theorem", url: "https://github.com/donnemartin/system-design-primer#cap-theorem", license: "CC BY 4.0" }],
      check: ["d3-07", "d3-08"],
      visual: (
        <div className="grid gap-3">
          <CapVisual />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🔒", title: "Strong (linearizable)", text: "Every read sees the latest write, as if there were only one copy.", color: "#60a5fa" },
              { icon: "🪞", title: "Read-your-writes", text: "You always see your own changes. Other people may see them a bit later.", color: "#2dd4bf" },
              { icon: "🌊", title: "Eventual", text: "Once writes stop, all copies end up the same. Until then, reads may be stale.", color: "#f472b6" },
            ]}
          />
        </div>
      ),
      points: [
        "**CAP**: when the network splits the copies apart, a system must choose. It can stay consistent by refusing to answer, or stay available by answering with possibly stale data.",
        "Network splits do happen in real networks, so the real question is how you behave during one: consistent or available.",
        "**PACELC** adds the everyday case. Else, when there's no split, you still choose between low latency and consistency. Waiting for more copies to agree is slower but safer.",
        "**Consensus** protocols like Raft and Paxos need a majority to agree. That's why clusters have odd sizes: 3 nodes survive 1 failure, and 5 survive 2.",
        "CAP: when the network splits, a replicated system must choose **consistency** (refuse or delay some requests) or **availability** (answer everything, possibly with stale data). Money transfers and last-seat bookings pick consistency.",
        "Consistency models from strongest down: **linearizable** (every read sees the latest finished write, as if there were one copy), read-your-writes, monotonic reads, and eventual consistency.",
      ],
      tip: "Choose consistency feature by feature. \"Balances must be consistent, like counts can be slightly stale\" shows good judgement.",
    },
    {
      id: "d3-idempotency",
      level: "senior",
      task: "3.3",
      title: "Idempotency and the outbox",
      check: ["d3-12", "d3-13"],
      visual: (
        <div className="grid gap-3">
          <CodeBlock
            lang="text"
            caption="The client makes one key per action and sends the same key on every retry."
            code={`POST /payments
Idempotency-Key: 6f1c2e8a-91b4-4c1e-9d0a-2b7f3c5e8d11
{ "amount": 4200, "currency": "EUR" }

→ first time: process, store (key → response), return 201
→ retry with the same key: return the stored 201, charge nothing`}
          />
          <CodeCompare
            lang="text"
            left={{ title: "Dual write: the two can disagree", code: `db.commit(order)
broker.publish(OrderPlaced)  // crash here →
                             // event lost` }}
            right={{ title: "Transactional outbox", code: `BEGIN
  INSERT order
  INSERT outbox(event)
COMMIT
relay: outbox → broker (at-least-once)` }}
          />
        </div>
      ),
      points: [
        "An operation is **idempotent** if doing it twice has the same effect as doing it once. In HTTP, GET, PUT and DELETE are idempotent. POST isn't.",
        "An **idempotency key** makes a risky action safe to retry. The server checks and records the key in one atomic step before doing the work.",
        "Writing to a database and then to a message broker separately is a **dual write**, and a crash in between leaves them disagreeing. The **outbox pattern** saves the event in the same transaction and sends it later.",
        "When people say \"exactly once\", in practice they mean at-least-once delivery plus processing that ignores duplicates.",
      ],
      tip: "Whenever you say \"retry\", finish the sentence with \"and that's safe because…\". Retries without idempotency are how people get charged twice.",
    },
    {
      id: "d3-rate-limit",
      level: "intermediate",
      task: "3.4",
      title: "Rate limiting",
      sources: [{ title: "System Design Primer: Back pressure", url: "https://github.com/donnemartin/system-design-primer#back-pressure", license: "CC BY 4.0" }],
      check: ["d3-18", "d3-19"],
      visual: (
        <div className="grid gap-3">
          <TokenBucketLab />
          <CodeBlock
            lang="text"
            caption="Tell clients when they can come back."
            code={`HTTP/1.1 429 Too Many Requests
Retry-After: 30`}
          />
        </div>
      ),
      points: [
        "Rate limits protect services from overload and abuse, and keep usage fair for each user, API key or IP address.",
        "A **token bucket** has a capacity, which sets the biggest burst allowed, and a refill rate, which sets the steady rate. A **leaky bucket** lets requests out at a constant pace.",
        "A **fixed window counter** is cheap, but a client can squeeze in two bursts around a window edge. A **sliding window log** keeps each request's time, so it is smoother but uses more memory.",
        "When many servers share one limit, the counter must live in one shared place and update atomically, for example with Redis INCR or a Lua script.",
        "Rate limits are usually enforced at an **API gateway**, the entry point in front of your services. With many gateway nodes, they share counters in a fast store such as a sharded Redis cluster.",
      ],
      tip: "Pin down the details: what you limit by (user, API key or IP), the limit itself, what happens when it's hit (429 with Retry-After), and what happens if the limiter's store is down.",
    },
  ],

  questions: [
    // ───────────── beginner ─────────────
    {
      id: "sd-b3-01",
      domain: "d3",
      lesson: "d3-start-queues",
      level: "beginner",
      prompt: "A photo app resizes every upload, which takes a few seconds. Why put the resize jobs in a queue?",
      options: [
        "The app can say \"got it\" straight away, and workers resize photos when they're free",
        "A queue makes each resize take less time, because workers process the photos in parallel",
        "A queue deletes photos nobody looks at",
        "A queue stops people uploading photos",
      ],
      answer: [0],
      explanation: "The queue is like a restaurant's ticket rail: the upload is pinned up and the user can carry on. Workers pick jobs off the line at their own pace, so a rush just makes the line longer for a while.",
    },
    {
      id: "sd-b3-02",
      domain: "d3",
      lesson: "d3-start-queues",
      level: "beginner",
      prompt: "In a queue, what do we call the part that takes jobs off the line and does them?",
      options: ["The consumer", "The producer", "The database", "The browser"],
      answer: [0],
      explanation: "The producer puts jobs in and the consumer takes them out and does the work. If the line keeps growing, you add more consumers.",
    },
    {
      id: "sd-b3-03",
      domain: "d3",
      lesson: "d3-start-retries",
      level: "beginner",
      prompt: "Which action is safe to repeat, because doing it twice gives the same result as doing it once?",
      options: [
        "Set my display name to \"Sam\"",
        "Add £10 to my balance",
        "Send a new message to my friend",
        "Place a new order for a pizza",
      ],
      answer: [0],
      explanation: "Setting your name to \"Sam\" twice still leaves it as \"Sam\". The others each create something new, so repeating them doubles the effect. Actions that are safe to repeat are called idempotent.",
    },
    {
      id: "sd-b3-04",
      domain: "d3",
      lesson: "d3-start-retries",
      level: "beginner",
      type: "output",
      prompt: "An API allows each user 100 requests per minute. A user has already sent 60 this minute. Type how many more they can send before hitting the limit (number only).",
      code: "limit_per_minute = 100\nsent_so_far      = 60\nremaining = limit_per_minute - sent_so_far\nprint(remaining)",
      codeLang: "python",
      verified: "run",
      answers: ["40"],
      explanation: "100 minus 60 leaves 40 more requests this minute. After that the server replies \"too many requests\" until the next minute starts. Limits like this stop one busy user from slowing things down for everyone.",
    },

    // ───────────── junior and up ─────────────
    {
      id: "d3-01",
      domain: "d3",
      lesson: "d3-queues",
      level: "junior",
      prompt: "Users upload videos that take minutes to convert. Why put a queue between the upload API and the converters?",
      options: [
        "The API replies at once while workers take jobs at their own pace",
        "Queues make every video convert faster on the same machines",
        "Queues guarantee each video is converted exactly once, never twice",
        "It removes the need to store the uploaded file anywhere",
      ],
      answer: [0],
      explanation: "The queue separates the fast request from the slow work. Workers scale on their own and failed jobs can be retried. A job can still run twice, so each job should be safe to repeat.",
    },
    {
      id: "d3-02",
      domain: "d3",
      lesson: "d3-queues",
      level: "intermediate",
      type: "match",
      prompt: "Match each messaging term to its meaning.",
      pairs: [
        ["At-most-once", "Never sent again, so a crash can lose the message"],
        ["At-least-once", "Sent again until confirmed, so duplicates are possible"],
        ["Effectively-once", "At-least-once delivery plus processing that ignores duplicates"],
        ["Dead-letter queue", "Where messages go after failing too many times"],
      ],
      explanation: "Brokers trade the risk of losing messages against the risk of duplicates. Most systems pick at-least-once and make consumers idempotent, and park messages that keep failing in a dead-letter queue for someone to look at.",
    },
    {
      id: "d3-03",
      domain: "d3",
      lesson: "d3-queues",
      level: "intermediate",
      type: "lines",
      prompt: "Every conversion job runs several times, and many end up in the dead-letter queue. Tap the line that's set wrong.",
      code: `queue: video-transcode
visibility_timeout_seconds: 30
max_receive_count: 5
dead_letter_queue: video-transcode-dlq
worker:
  concurrency: 8
  typical_job_seconds: 240`,
      codeLang: "yaml",
      answer: [2],
      explanation: "A job takes about 4 minutes, but the message becomes visible again after 30 seconds. Other workers pick it up while it's still running, and after 5 pickups it's sent to the dead-letter queue. Make the timeout longer than the work, or extend it while the job runs.",
    },
    {
      id: "d3-04",
      domain: "d3",
      lesson: "d3-queues",
      level: "intermediate",
      prompt: "How many consumers in the group actually receive messages?",
      code: `topic: orders
partitions: 6
consumer_group: billing
consumers_in_group: 8`,
      codeLang: "yaml",
      options: ["6, and 2 sit idle", "8, sharing partitions evenly", "1, the group leader", "4, because consumers pair up"],
      answer: [0],
      explanation: "In Kafka, each partition goes to exactly one consumer in a group, so at most 6 consumers can be busy. To go further, add partitions.",
    },
    {
      id: "d3-05",
      domain: "d3",
      lesson: "d3-queues",
      level: "senior",
      prompt: "OrderCreated, OrderPaid and OrderShipped events for the same order must be handled in order, at high volume. What do you do with Kafka?",
      options: [
        "Use order_id as the message key so all events for one order go to the same partition",
        "Use a single partition for the whole topic",
        "Use a random key so load spreads evenly",
        "Sort the events by their timestamp in every consumer before processing each one of them",
      ],
      answer: [0],
      explanation: "Kafka keeps order within a partition, and the key decides the partition. Keying by order_id keeps each order's events in sequence while different orders spread across partitions. A single partition would force everything through one line.",
    },
    {
      id: "d3-06",
      domain: "d3",
      lesson: "d3-queues",
      level: "senior",
      prompt: "During peaks, consumers fall further and further behind because producers are faster. Which two responses are sound? (Choose two.)",
      options: [
        "Add consumers, up to the partition count, and add partitions if needed",
        "Alert on lag and push back: slow down or shed producers, or pause non-essential work",
        "Confirm messages before processing them so consumers go faster",
        "Delete the oldest messages whenever lag is high",
      ],
      answer: [0, 1],
      explanation: "Either speed up the consumers or slow down what's coming in. Confirming early turns every failure into silently lost data, and deleting messages throws work away.",
    },
    {
      id: "d3-07",
      domain: "d3",
      lesson: "d3-cap",
      level: "junior",
      prompt: "According to the CAP theorem, what must a replicated system choose between when the network splits?",
      options: [
        "Consistency and availability",
        "Consistency and partition tolerance, while availability is always kept",
        "Latency and throughput",
        "SQL and NoSQL",
      ],
      answer: [0],
      explanation: "During a split, a node can refuse requests it can't answer correctly, which keeps it consistent. Or it can answer with possibly stale data, which keeps it available. When the network is healthy, you can have both.",
    },
    {
      id: "d3-08",
      domain: "d3",
      lesson: "d3-cap",
      level: "senior",
      prompt: "What does PACELC add to CAP?",
      options: [
        "Even with no partition, there's a trade-off between latency and consistency",
        "Partitions can be avoided with better hardware",
        "Availability matters only for writes",
        "Consensus is impossible in fully asynchronous networks, even with no crashes",
      ],
      answer: [0],
      explanation: "If there's a partition, choose availability or consistency. Else, choose latency or consistency. Waiting for more copies to confirm makes every request slower, even on a good day.",
    },
    {
      id: "d3-09",
      domain: "d3",
      lesson: "d3-cap",
      level: "intermediate",
      type: "match",
      prompt: "Match each consistency model to its promise.",
      pairs: [
        ["Linearizable", "Every read returns the latest finished write, as if there were one copy"],
        ["Read-your-writes", "A user always sees their own earlier writes"],
        ["Monotonic reads", "A user never sees data go back in time between reads"],
        ["Eventual", "Copies end up the same once writes stop; reads may be stale until then"],
      ],
      explanation: "These run from strongest, linearizable, to weakest, eventual. The ones in the middle are promises about one user's session, and they often give people what they need for less cost.",
    },
    {
      id: "d3-10",
      domain: "d3",
      lesson: "d3-cap",
      level: "junior",
      prompt: "Which two features should choose consistency over availability during a network split? (Choose two.)",
      options: [
        "Transferring money between accounts",
        "Booking the last seat on a flight",
        "Showing a post's like count",
        "Showing who is online",
      ],
      answer: [0, 1],
      explanation: "A wrong answer about a balance or the last seat means money spent twice or a seat sold twice, which is worse than a short error. Like counts and online status can be a little out of date.",
    },
    {
      id: "d3-11",
      domain: "d3",
      lesson: "d3-cap",
      level: "staff",
      prompt: "Someone proposes a 4-node Raft cluster \"for extra safety\" instead of 3. What's the best response?",
      options: [
        "It needs a majority of 3, so it still survives only 1 failure, just like 3 nodes, while adding cost and write latency; use 3 or 5",
        "4 nodes survive 2 failures, so it's strictly better",
        "Raft requires an even number of nodes",
        "Any cluster size survives the same failures, so it doesn't matter; more nodes only add read capacity and cost nothing in write latency",
      ],
      answer: [0],
      explanation: "A majority of 4 is 3, so losing 1 node is fine and losing 2 is not. That's the same as 3 nodes, whose majority is 2. Five nodes, with a majority of 3, survive 2 failures. Even sizes add cost without adding safety.",
    },
    {
      id: "d3-12",
      domain: "d3",
      lesson: "d3-idempotency",
      level: "intermediate",
      prompt: "How does an idempotency key make `POST /payments` safe to retry?",
      options: [
        "The server stores the key with the result and replays it on repeats",
        "The server encrypts the request body using the key as a password",
        "The load balancer drops any request whose key it has seen before",
        "The key sets how long the response may stay in the HTTP cache",
      ],
      answer: [0],
      explanation: "The server must save the key and its outcome, protected by a uniqueness rule, before or together with the charge. Then a retry after a timeout gets the first result back instead of paying again.",
    },
    {
      id: "d3-13",
      domain: "d3",
      lesson: "d3-idempotency",
      level: "senior",
      type: "lines",
      prompt: "Clients retry after timeouts, and some customers are charged twice. Tap the line that's in the wrong place.",
      code: `function pay(req):
  key = req.header("Idempotency-Key")
  charge = gateway.charge(req.card, req.amount)
  if db.exists("idem", key):
    return db.get("idem", key)
  db.put("idem", key, charge)
  return charge`,
      codeLang: "text",
      answer: [3],
      explanation: "The card is charged before the key is checked, so every retry charges again. Reserve the key first, with an insert that fails on duplicates. Then charge, then save the result under the key.",
    },
    {
      id: "d3-14",
      domain: "d3",
      lesson: "d3-idempotency",
      level: "junior",
      prompt: "Which two HTTP methods are idempotent by definition? (Choose two.)",
      options: ["PUT", "DELETE", "POST", "PATCH"],
      answer: [0, 1],
      explanation: "PUT replaces a resource with the same thing each time, and deleting something twice still leaves it deleted. POST creates or triggers something on every call. PATCH isn't guaranteed to be idempotent: \"add 1\" twice adds 2.",
    },
    {
      id: "d3-15",
      domain: "d3",
      lesson: "d3-idempotency",
      level: "senior",
      prompt: "A service saves an order to its database and then publishes OrderPlaced to Kafka. Sometimes the process dies in between, and other services never hear about the order. What's the standard fix?",
      options: [
        "Transactional outbox: insert the event into an outbox table in the same transaction and have a relay publish it",
        "Publish to Kafka first, then commit the order; if the commit fails, the consumer can look the order up and ignore it",
        "Retry the publish three times in a loop",
        "Use a distributed lock around both writes",
      ],
      answer: [0],
      explanation: "Two separate writes can't be made atomic. The outbox puts the event inside the database transaction. A relay then publishes it at least once, and consumers skip duplicates by event id. Publishing first just swaps which side goes missing.",
    },
    {
      id: "d3-16",
      domain: "d3",
      lesson: "d3-idempotency",
      level: "staff",
      type: "order",
      prompt: "Put the steps of the transactional outbox pattern in order.",
      items: [
        "Begin a database transaction",
        "Insert the order row and an outbox row describing the event",
        "Commit the transaction",
        "A relay reads unpublished outbox rows and publishes them to the broker",
        "Mark the outbox rows as published; consumers skip duplicates by event id",
      ],
      explanation: "The business change and the event are saved together, atomically. Publishing happens afterwards, by polling or by reading the database's change log, and may happen more than once, so consumers must be idempotent.",
    },
    {
      id: "d3-17",
      domain: "d3",
      lesson: "d3-idempotency",
      level: "staff",
      prompt: "A vendor's broker advertises \"exactly-once delivery\". Your consumer sends emails. What should your design still include?",
      options: [
        "An idempotent consumer that records processed message ids, because sending the email happens outside the broker's transaction and can repeat after a crash",
        "Nothing extra: the broker guarantees exactly-once delivery end to end, so once the consumer acknowledges a message it can never run again, even if the email step crashed partway through",
        "A second broker for redundancy",
        "Disabling retries in the consumer",
      ],
      answer: [0],
      explanation: "A broker's exactly-once feature only covers reads and writes inside the broker. If the consumer crashes after sending the email but before saving its position, it handles the message again. Track message ids and skip repeats.",
    },
    {
      id: "d3-18",
      domain: "d3",
      lesson: "d3-rate-limit",
      level: "junior",
      prompt: "What should an API return when a client goes over its rate limit?",
      options: [
        "`429 Too Many Requests`, ideally with a `Retry-After` header",
        "`500 Internal Server Error`",
        "`404 Not Found`",
        "`200 OK` with an empty body, so the client doesn't treat it as an error",
      ],
      answer: [0],
      explanation: "429 tells the client it's being limited, not that the server broke. Retry-After tells it when to try again.",
    },
    {
      id: "d3-19",
      domain: "d3",
      lesson: "d3-rate-limit",
      level: "intermediate",
      prompt: "How many requests are rejected in total?",
      code: `bucket: capacity = 10, refill = 5 tokens per second, starts full
t = 0.0 s   15 requests arrive at once
t = 1.0 s    8 requests arrive at once`,
      codeLang: "text",
      options: ["3", "5", "8", "13"],
      answer: [2],
      explanation: "At the start, the 10 tokens let 10 requests through and 5 are rejected, leaving the bucket empty. One second later 5 tokens have refilled, so 5 get through and 3 are rejected. That's 8 rejected in total.",
    },
    {
      id: "d3-20",
      domain: "d3",
      lesson: "d3-rate-limit",
      level: "intermediate",
      prompt: "A limiter allows 100 requests per calendar minute, using fixed windows. What's the most a client can send in a two-second span?",
      options: ["100", "200", "50", "Unlimited"],
      answer: [1],
      explanation: "The client can send 100 in the last second of one minute and another 100 in the first second of the next. Sliding windows or a token bucket stop this burst at the edge.",
    },
    {
      id: "d3-21",
      domain: "d3",
      lesson: "d3-rate-limit",
      level: "senior",
      type: "lines",
      prompt: "With many requests at once, users get well over 100 requests a minute. Tap the two lines that together cause the race.",
      code: `function allow(userId):
  key = "rl:" + userId + ":" + currentMinute()
  count = redis.get(key) or 0
  if count >= 100:
    return false
  redis.set(key, count + 1, ttl = 60)
  return true`,
      codeLang: "text",
      answer: [3, 6],
      explanation: "Reading and then writing isn't atomic. Many requests read the same count, and each writes that count plus one. Use an atomic `INCR`, setting `EXPIRE` on the first increment, or a Lua script, and check the value it returns.",
    },
    {
      id: "d3-22",
      domain: "d3",
      lesson: "d3-rate-limit",
      level: "staff",
      prompt: "An API gateway runs on 20 nodes and must enforce 1,000 requests a minute per API key accurately, without adding much latency. Which design fits best?",
      options: [
        "A shared counter store, such as a Redis cluster sharded by key, updated atomically per request, with a clear rule for allowing or blocking traffic if it's unreachable",
        "Each node enforces 1,000 a minute on its own",
        "Each node enforces 50 a minute on its own, however traffic is spread, since a client that hits several nodes still gets 50 per node, which works out to the same limit overall",
        "Log every request and count them in a nightly batch job",
      ],
      answer: [0],
      explanation: "Limits per node go wrong when traffic isn't spread evenly: a client could get 20 times 1,000, or be blocked far too early. One shared atomic counter is accurate and costs about a millisecond. Deciding what happens when it's down is part of the design.",
    },
    {
      id: "d3-23",
      domain: "d3",
      lesson: "d3-rate-limit",
      level: "intermediate",
      type: "match",
      prompt: "Match each rate-limiting method to how it behaves.",
      pairs: [
        ["Token bucket", "Allows bursts up to its capacity and refills at a steady rate"],
        ["Leaky bucket", "Queues requests and lets them out at a constant rate"],
        ["Fixed window counter", "A cheap counter per period, but bursts slip through at window edges"],
        ["Sliding window log", "Exact, but stores a timestamp for every request"],
      ],
      explanation: "The token bucket is the usual default for APIs. The leaky bucket smooths traffic, fixed windows are the simplest, and sliding logs are the most accurate but use the most memory.",
    },
  ],

  cards: [
    { id: "c-d3-kafka", domain: "d3", kind: "service", term: "Kafka", definition: "A distributed append-only log split into ordered partitions. Consumer groups each read at their own position, and the data is kept so you can replay it." },
    { id: "c-d3-sqs", domain: "d3", kind: "service", term: "SQS-style work queue", definition: "Each message goes to one consumer. It's hidden for a visibility timeout and delivered again unless the consumer deletes it to confirm." },
    { id: "c-d3-dlq", domain: "d3", kind: "service", term: "Dead-letter queue", definition: "Holds messages that failed too many times, so a bad message doesn't block the queue or loop forever." },
    { id: "c-d3-consumer-group", domain: "d3", kind: "concept", term: "Consumer group", definition: "Consumers sharing one subscription. Each partition goes to one member, so you can't have more busy consumers than partitions." },
    { id: "c-d3-alo", domain: "d3", kind: "concept", term: "At-least-once delivery", definition: "Messages are sent again until confirmed. Duplicates happen, so processing must be safe to repeat." },
    { id: "c-d3-backpressure", domain: "d3", kind: "concept", term: "Backpressure", definition: "Telling the sender to slow down, with bounded queues, rejections or throttling, when the receiver can't keep up." },
    { id: "c-d3-cap", domain: "d3", kind: "concept", term: "CAP theorem", definition: "When the network splits, a replicated system must give up either consistency or availability." },
    { id: "c-d3-pacelc", domain: "d3", kind: "concept", term: "PACELC", definition: "If there's a partition, choose availability or consistency. Else, choose latency or consistency." },
    { id: "c-d3-raft", domain: "d3", kind: "service", term: "Raft", definition: "A consensus protocol. An elected leader copies a log to the others, and an entry counts once a majority has it. 2f + 1 nodes survive f failures." },
    { id: "c-d3-idem-key", domain: "d3", kind: "service", term: "Idempotency key", definition: "A unique id the client picks for each action. The server saves the key with the result and returns that same result for retries." },
    { id: "c-d3-outbox", domain: "d3", kind: "service", term: "Transactional outbox", definition: "Save the event to an outbox table in the same database transaction, and let a relay publish it. This solves the dual-write problem." },
    { id: "c-d3-token-bucket", domain: "d3", kind: "service", term: "Token bucket", definition: "Each request spends a token, and tokens refill at a fixed rate up to a capacity. The capacity sets the burst size and the refill sets the steady rate." },
  ],

  challenges: [
    {
      id: "ch-sd-bucket",
      domain: "d3",
      lesson: "d3-rate-limit",
      title: "Burst once, not twice",
      goal: "Set up the bucket so a burst of 10 gets through completely. Then fire a second burst of 10 straight away and have at least 7 of them rejected.",
      hint: "The burst you allow is the capacity. What's left after the first burst is the capacity minus 10.",
      takeaway: "Capacity controls the burst size and refill controls the steady throughput, so size them separately.",
      render: (onSolved) => <TokenBucketLab goal="burst" onSolved={onSolved} />,
    },
  ],
});
