import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-storage",
  module: "m9",
  title: "Blob and object storage",
  visual: {
    kind: "flow",
    steps: [
      { icon: "🔏", label: "Ask your API", sub: "Gets a short-lived upload link" },
      { icon: "🪣", label: "Upload to bucket", sub: "Bytes skip your servers" },
      { icon: "🌐", label: "Serve via CDN", sub: "Copies near each viewer" },
    ],
  },
  screens: [
    { kind: "idea", text: "Photos, videos and backups are a **blob**, a binary large object: big, written once and read whole. They don't behave like rows, which are small and get queried and updated field by field." },
    { kind: "idea", text: "**Object storage** keeps blobs as objects you put and get whole over HTTP, by key. Amazon S3, Google Cloud Storage and Azure Blob Storage are common examples, and most clouds copy S3's API." },
    { kind: "idea", text: "Objects live in a **bucket**, a named container with its own access rules and region. Inside it, each object has a key, its bytes and some metadata." },
    { kind: "idea", text: "An object's **metadata** describes it without opening it: content type, size, a checksum, when it was written, and custom tags you add, such as the owner's id." },
    { kind: "idea", text: "A key like users/42/avatar.jpg looks like folders, but the store has a **flat namespace**: the slashes are just characters in one long name. Listing by prefix fakes the folders." },
    { kind: "idea", text: "**Durability** is how likely an object is to survive. Eleven nines, 99.999999999% a year, is a typical claim: keep 1 billion objects and you'd expect to lose about one every hundred years." },
    { kind: "idea", text: "Durability isn't availability. A region outage can stop you reaching an object for an hour without losing it. One way to get durability is plain replication: three full copies in three zones." },
    { kind: "idea", text: "**Erasure coding** is cheaper. It splits an object into data pieces, adds parity pieces computed from them, and spreads them over machines. Any set as large as the data pieces rebuilds the object." },
    {
      kind: "example",
      title: "Keeping 600 GB safe",
      steps: [
        "Three full copies take 1,800 GB, three times the data. You can lose any two copies.",
        "Erasure coding with 6 data and 3 parity pieces makes 9 pieces of 100 GB, 900 GB in all, which is 1.5 times the data.",
        "Any 6 of the 9 pieces rebuild the object, so you can lose any 3. That's more failures survived for half the space.",
      ],
    },
    { kind: "idea", text: "Big files don't belong in the database. They bloat backups, slow replication and crowd the cache. Store the bytes in object storage and keep only a pointer in the row: the key, size and owner." },
    { kind: "idea", text: "If uploads pass through your servers, every byte ties up their bandwidth and memory. A **pre-signed URL** lets the client upload straight to the bucket: your API signs a link allowing one key, for a few minutes." },
    { kind: "idea", text: "A **multipart upload** splits a big file into parts, sends them in parallel and retries only the parts that fail. A final call asks the store to join them into one object." },
    { kind: "idea", text: "A **resumable upload** remembers how many bytes have arrived. After a dropped connection, the client asks where it stopped and carries on from there instead of starting again." },
    {
      kind: "example",
      title: "A 2,000 MB video upload",
      steps: [
        "The app asks your API to upload. The API checks the user, picks the key videos/981.mp4 and returns pre-signed URLs valid for 15 minutes.",
        "The phone splits the file into 100 MB parts, 20 in all, and sends them straight to the bucket, four at a time.",
        "Part 13 fails in a tunnel. Only that 100 MB part is sent again, not the whole 2,000 MB.",
        "The phone calls complete and the bucket joins the parts. Your API saves a row with the key, size and owner.",
        "Viewers stream it through a CDN with the bucket as origin. Your servers never handled the video's bytes.",
      ],
    },
    { kind: "idea", text: "A **storage class** sets price by how often you read: hot for frequent reads, cool for rare ones with a fee per read, and archive at a tenth of hot's price or less, but slow to fetch." },
    { kind: "idea", text: "A **lifecycle rule** moves or deletes objects by age, so nobody has to. For example: cool after 30 days, archive after a year, delete after seven, and clear unfinished multipart uploads after a week." },
    { kind: "idea", text: "Cloud drives go a step further and split each file into **blocks** of a few MB, each named by a hash of its bytes. A file becomes a list of block hashes, and the drive walkthrough builds on this." },
    { kind: "idea", text: "Two files that share a block store it once, which is **deduplication**. And when someone edits a big file, only the changed blocks are uploaded, not the whole file again." },
  ],
  tip: "Say the bytes go to object storage through pre-signed, multipart uploads, the database keeps only the key and metadata, and downloads come from a CDN.",
  quiz: [
    {
      kind: "mcq",
      id: "t-storage-q1",
      prompt: "Where should a 500 MB video usually live?",
      options: ["In a database column as raw bytes", "In object storage, key kept in a row", "On the local disk of a single app server", "In the cache, so every read stays fast"],
      answer: 1,
      explanation: "Object storage holds the bytes and the row keeps a pointer. Raw bytes bloat the database, one server's disk is lost with that server, and a cache isn't durable storage.",
    },
    {
      kind: "mcq",
      id: "t-storage-q2",
      prompt: "An object is erasure coded into 8 data and 4 parity pieces. What does that cost and survive?",
      options: ["1.5 times the space, any 4 lost", "2 times the space, any 4 lost", "1.5 times the space, any 8 lost", "3 times the space, any 2 lost"],
      answer: 0,
      explanation: "12 pieces for 8 pieces of data is 1.5 times. Any 8 rebuild it, so any 4 can be lost. 2 times miscounts, 8 lost confuses data with parity, and 3 times is triple replication.",
    },
    {
      kind: "mcq",
      id: "t-storage-q3",
      prompt: "Why hand the client a pre-signed URL for an upload?",
      options: ["To let it upload any file to any key", "To encrypt the file before it is sent", "So bytes go straight to the bucket", "So the CDN can cache the upload first"],
      answer: 2,
      explanation: "The signed link lets the client write to the bucket directly. It covers one key for a short time, it doesn't encrypt the file, and CDNs serve downloads, not uploads.",
    },
    {
      kind: "tf",
      id: "t-storage-q4",
      statement: "A key like photos/2026/cat.jpg means the bucket stores real nested folders.",
      answer: false,
      explanation: "The namespace is flat. The slashes are part of one key's name, and listing by prefix only makes it look like folders.",
    },
    {
      kind: "tf",
      id: "t-storage-q5",
      statement: "A lifecycle rule can move objects to a cheaper storage class once they reach a certain age.",
      answer: true,
      explanation: "That's what lifecycle rules are for: moving or deleting objects by age without anyone doing it by hand.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-storage-p1",
      prompt: "Which data best fits the archive storage class?",
      options: ["Session data read on every request", "Old tax records that are rarely read", "Profile photos shown on every page", "Thumbnails for this week's posts"],
      answer: 1,
      explanation: "Archive is cheapest to keep but slow to fetch, so it suits data almost nobody reads. The others are read all the time and need hot storage.",
    },
    {
      kind: "tf",
      id: "t-storage-p2",
      statement: "With a multipart upload, a failed part can be sent again without resending the whole file.",
      answer: true,
      explanation: "Each part uploads on its own, so only the part that failed is retried.",
    },
  ],
  sources: [
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 14 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 15 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "Amazon S3 docs: Uploading objects with presigned URLs", url: "https://docs.aws.amazon.com/AmazonS3/latest/userguide/PresignedUrlUploadObject.html", license: "Link only" },
    { title: "Backblaze: Backblaze Open Sources Reed-Solomon Erasure Coding", url: "https://www.backblaze.com/blog/reed-solomon/", license: "Link only" },
  ],
};

export default topic;
