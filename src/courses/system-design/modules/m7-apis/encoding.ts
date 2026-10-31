import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-encoding",
  module: "m7",
  title: "Encoding and schema evolution",
  visual: {
    kind: "ladder",
    caption: "Protobuf schema changes, safest to riskiest",
    rungs: [
      { icon: "✅", name: "Add an optional field", text: "Old readers skip it. New readers use a default when it's missing." },
      { icon: "⚠️", name: "Rename a field", text: "Fine for the bytes sent, but code and JSON that use the old name break." },
      { icon: "⛔", name: "Change a field's number or type", text: "Readers decode the bytes wrongly or fail." },
    ],
  },
  screens: [
    { kind: "idea", text: "Data leaving a process must be turned into bytes, and the reader must turn it back. That's **encoding**, and the format decides size, speed, and how safely it can change." },
    { kind: "idea", text: "**JSON** is text that people can read and every language can parse. It repeats field names in every message and has no built-in schema, so typos slip through." },
    { kind: "idea", text: "**Protobuf** encodes messages in binary from a schema file. Each field has a number, and only the number is sent \"on the wire\", meaning over the network, so messages are small and fast to parse." },
    { kind: "idea", text: "**Avro** is another binary format with a schema. The writer's schema travels with the file or sits in a registry, a shared service that stores schemas, and the reader matches fields by name." },
    { kind: "idea", text: "Services don't all upgrade at once, so old and new code read each other's data. **Backward compatibility** means new code can read data written by old code." },
    { kind: "idea", text: "**Forward compatibility** means old code can read data written by new code, usually by ignoring fields it doesn't know." },
    { kind: "idea", text: "Safe changes keep both directions: add optional fields with defaults, and never reuse a deleted field's number. Changing a field's number or type breaks readers." },
    { kind: "idea", text: "Renaming a Protobuf field is safe on the wire, since only numbers are sent. It can still break code that uses the old name, and JSON output, which uses names." },
    { kind: "idea", text: "A **schema registry** stores every version of each event's schema and rejects a new version that would break compatibility, before any producer can publish it." },
    { kind: "idea", text: "In a **rolling upgrade**, servers are replaced a few at a time, so old and new versions run side by side for a while. Compatible schemas are what make that safe." },
    {
      kind: "example",
      title: "Adding a coupon field to an event",
      steps: [
        "OrderPlaced has order_id as field 1 and amount_cents as field 2. Ten services consume it from Kafka.",
        "Marketing wants coupons. The team adds an optional coupon field as number 3 and submits it to the schema registry.",
        "The registry checks compatibility and accepts it, because nothing was removed or renamed.",
        "New producers start sending coupons. Old consumers skip field 3 and keep working. That's forward compatibility.",
        "Upgraded consumers read old events with no coupon and get an empty default. That's backward compatibility.",
      ],
    },
  ],
  tip: "When events or APIs change, say \"add optional fields only, and a schema registry checks compatibility\". It shows you've thought about deploys, not just the first version.",
  quiz: [
    {
      kind: "mcq",
      id: "t-encoding-q1",
      prompt: "New consumers must read events written by old producers. Which property is that?",
      options: ["Forward compatibility", "Backward compatibility", "A rolling upgrade", "A schema registry check"],
      answer: 1,
      explanation: "Backward compatibility is new code reading old data. Forward is the reverse direction.",
    },
    {
      kind: "mcq",
      id: "t-encoding-q2",
      prompt: "Which schema change is safe for both old and new readers?",
      options: ["Renaming a field", "Changing a field's type", "Adding an optional field", "Reusing a deleted field number"],
      answer: 2,
      explanation: "Old readers ignore the new field and new readers default it when missing. A rename can break code and JSON.",
    },
    {
      kind: "mcq",
      id: "t-encoding-q3",
      prompt: "Why are Protobuf messages smaller than the same data in JSON?",
      options: ["Field numbers replace names", "The schema is sent with each message", "They are compressed with gzip", "Values are stored as text"],
      answer: 0,
      explanation: "JSON repeats each field name as text. Protobuf sends a small field number and binary values.",
    },
    {
      kind: "tf",
      id: "t-encoding-q4",
      statement: "A schema registry can reject a new schema version that would break existing consumers.",
      answer: true,
      explanation: "It checks compatibility rules before the version is registered.",
    },
    {
      kind: "tf",
      id: "t-encoding-q5",
      statement: "During a rolling upgrade, only the new version of a service is running at any moment.",
      answer: false,
      explanation: "Servers are replaced a few at a time, so old and new run side by side.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-encoding-p1",
      prompt: "Old consumers keep working after producers add a field. What made that possible?",
      options: ["Forward compatibility", "Backward compatibility", "A rolling upgrade", "Renaming the old field"],
      answer: 0,
      explanation: "Old code reading new data, by ignoring unknown fields, is forward compatibility.",
    },
    {
      kind: "tf",
      id: "t-encoding-p2",
      statement: "JSON is easy to read but repeats field names in every message.",
      answer: true,
      explanation: "That readability costs bytes, which binary formats save.",
    },
    {
      kind: "mcq",
      id: "t-encoding-p3",
      prompt: "In Avro, how does a reader match fields?",
      options: ["By field name", "By position in a CSV row", "By field numbers only", "By guessing from the values"],
      answer: 0,
      explanation: "Avro resolves the writer's schema against the reader's by field name.",
    },
  ],
  practiceNeeds: ["t-api"],
  sources: [
    { title: "Protocol Buffers: Language guide (proto 3)", url: "https://protobuf.dev/programming-guides/proto3/", license: "Link only" },
    { title: "Apache Avro specification", url: "https://avro.apache.org/docs/", license: "Link only" },
    { title: "Designing Data-Intensive Applications (Kleppmann): encoding and evolution", url: "https://dataintensive.net/", license: "Link only" },
  ],
};

export default topic;
