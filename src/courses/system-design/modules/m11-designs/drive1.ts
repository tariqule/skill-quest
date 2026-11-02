import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-design-drive-1",
  module: "m11",
  title: "Design cloud file storage: upload and sync",
  level: "intermediate",
  visual: {
    kind: "flow",
    steps: [
      { icon: "💻", label: "Client", sub: "Sends file bytes and file details separately" },
      { icon: "🧱", label: "Block servers", sub: "Split, compress and encrypt blocks" },
      { icon: "🪣", label: "Cloud storage", sub: "Blocks copied to two regions" },
      { icon: "🗂️", label: "API servers", sub: "Sign-in, metadata and sharing" },
      { icon: "🔔", label: "Notification service", sub: "Tells other devices to pull" },
    ],
  },
  screens: [
    { kind: "idea", text: "The ask: \"Design a cloud drive like Google Drive or Dropbox.\" Ask which features matter most, whether it's web, mobile or both, which file types, whether files are encrypted, the largest file allowed, and how many daily users." },
    { kind: "idea", text: "A typical agreement: upload, download, sync across devices, past revisions, sharing, and a notice when a file is edited, deleted or shared with you. Web and mobile, any file type, encrypted storage, files up to 20 GB." },
    { kind: "idea", text: "Leave live co-editing of one document out of scope. Then name the qualities: losing a file is unacceptable, sync should feel quick, bandwidth must stay low for people on mobile data, and the service stays up when servers fail." },
    {
      kind: "example",
      title: "Sizing the drive",
      steps: [
        "Assume 80 million signed-up users, 20 million of them active daily, each given 15 GB free. 80 million times 15 GB is 1,200 million GB, about 1,200 petabytes promised.",
        "Each active user uploads 3 files a day. That's 60 million uploads, divided by 86,400 seconds: about 694 uploads per second.",
        "Traffic peaks at about twice the average, so plan for roughly 1,400 uploads per second at the busiest hour.",
        "Files average 400 KB, so 60 million uploads add 24 billion KB a day, about 24 TB of new data before any copies.",
      ],
    },
    { kind: "idea", text: "Start on one server: a web server, a database for users and file details, and a 2 TB disk. Each user gets a folder called a **namespace**, so namespace plus path names every file." },
    { kind: "idea", text: "The APIs: a simple upload for small files, a resumable upload for big ones, a download that takes a path, and a list of revisions that takes a path and a limit. All need sign-in and HTTPS." },
    { kind: "idea", text: "You know resumable uploads from object storage. The client asks for an upload session, sends bytes, and after a dropped connection asks how much arrived and carries on. That matters for 20 GB files on phones." },
    { kind: "idea", text: "Then say what breaks. The disk fills up and uploads stop. Sharding files over several storage servers by user id buys room, but when one of those servers dies, its users' files are gone." },
    { kind: "idea", text: "So move file bytes to object storage, which already keeps copies across zones. Add **cross-region replication** too: every object is copied to a second region, so files survive even if a whole region is lost." },
    { kind: "idea", text: "Now pull the server apart. A load balancer spreads traffic over stateless web servers. The metadata database moves to its own machines, replicated and sharded. Files sit in object storage in two regions." },
    { kind: "idea", text: "A **sync conflict** happens when two devices change the same file at once. The first version processed wins. The other is marked as a conflict, and that user sees both copies and chooses to merge or keep both." },
    { kind: "idea", text: "The high-level design adds **block servers**. They split each file into blocks of a few MB, compress and encrypt each block, and upload it to cloud storage. The metadata database records each block's hash and order." },
    { kind: "idea", text: "API servers handle everything but the bytes: sign-in, profiles, sharing and file metadata. A metadata cache sits in front of the metadata database, and files nobody has opened for months move to cheaper cold storage." },
    { kind: "idea", text: "A notification service tells a user's other devices that a file changed, so they pull it. For a device that's offline, the change waits in an **offline backup queue** until it reconnects." },
  ],
  tip: "Split the design into two flows early and say so: block servers move file bytes, while API servers and the metadata database track what those bytes mean.",
  quiz: [
    {
      kind: "mcq",
      id: "t-design-drive-1-q1",
      prompt: "The single server's disk is nearly full, and a dead disk would lose every file. Which change answers both problems?",
      options: ["Shard files over more storage servers", "Move files to replicated object storage", "Compress every file on the current disk", "Put a cache in front of the file disk"],
      answer: 1,
      explanation: "Replicated object storage grows without limit and keeps copies in several places. Sharding adds room, but a dead shard still loses its files. Compression only buys time, and a cache speeds reads without saving anything.",
    },
    {
      kind: "mcq",
      id: "t-design-drive-1-q2",
      prompt: "A laptop and a phone both edit the same file offline. The laptop's upload is processed first. What happens to the phone's edit?",
      options: ["It silently replaces the laptop's edit", "It's merged line by line with no prompt", "It's dropped and the phone isn't told", "It's marked a conflict for the user"],
      answer: 3,
      explanation: "The first version processed wins and the later one becomes a conflict, so the user sees both copies and picks. Replacing the laptop's edit loses work, automatic merging fails on binary files, and silently dropping it loses work too.",
    },
    {
      kind: "mcq",
      id: "t-design-drive-1-q3",
      prompt: "People uploading 5 GB videos from phones say a dropped signal makes the upload start over. Which change fits?",
      options: ["Use resumable uploads for big files", "Raise the server's request timeout", "Send every file with simple upload", "Download the file again to check it"],
      answer: 0,
      explanation: "A resumable upload lets the client ask how many bytes arrived and continue from there. A longer timeout doesn't survive a dropped connection, simple upload is the one that restarts, and downloading again checks nothing about the upload.",
    },
    {
      kind: "tf",
      id: "t-design-drive-1-q4",
      statement: "In the high-level design, the metadata database stores each block's hash and order, while the bytes themselves sit in cloud storage.",
      answer: true,
      explanation: "Block servers put the encrypted blocks in cloud storage. The metadata database only records which blocks make up each file and in what order.",
    },
    {
      kind: "tf",
      id: "t-design-drive-1-q5",
      statement: "A device that is offline when a file changes misses that change for good, because the notification service only reaches connected devices.",
      answer: false,
      explanation: "The offline backup queue holds the change, and the device picks it up when it reconnects.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-design-drive-1-p1",
      prompt: "25 million daily users each upload 4 files a day, and the peak is twice the average. About what peak upload rate do you plan for?",
      options: ["About 1,160 a second", "About 2,300 a second", "About 23,000 a second", "About 580 a second"],
      answer: 1,
      explanation: "25 million times 4 is 100 million uploads a day. Divided by 86,400 seconds that's about 1,160 a second on average, and doubling it gives about 2,300 at peak.",
    },
    {
      kind: "tf",
      id: "t-design-drive-1-p2",
      statement: "Sharding the single server's files over several storage servers by user id removes the risk of losing files when one server dies.",
      answer: false,
      explanation: "Sharding spreads files out but keeps one copy of each, so a dead server still loses its users' files. Replication is what protects them.",
    },
  ],
  practiceNeeds: ["t-estimation", "t-storage"],
  sources: [
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 15 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "Google Drive API docs: Upload file data", url: "https://developers.google.com/drive/api/guides/manage-uploads", license: "Link only" },
    { title: "Dropbox Tech: Rewriting the heart of our sync engine", url: "https://dropbox.tech/infrastructure/rewriting-the-heart-of-our-sync-engine", license: "Link only" },
  ],
};

export default topic;
