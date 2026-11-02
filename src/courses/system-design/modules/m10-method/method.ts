import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-method",
  module: "m10",
  title: "The interview method",
  visual: {
    kind: "flow",
    steps: [
      { icon: "❓", label: "Scope it", sub: "Ask, agree, write it down" },
      { icon: "🗺️", label: "Sketch it", sub: "Boxes and arrows, get a nod" },
      { icon: "🔍", label: "Go deep", sub: "One or two parts, properly" },
      { icon: "🎀", label: "Wrap up", sub: "Limits, failures, next steps" },
    ],
  },
  screens: [
    { kind: "idea", text: "A design interview is not a quiz with one right answer. It's a pretend working session: you and a colleague shaping a vague idea into a plan together, out loud." },
    { kind: "idea", text: "The interviewer watches how you think: do you ask good questions, make sensible choices, explain the trade-offs, and take a hint? A perfect diagram matters less than clear reasoning." },
    { kind: "idea", text: "Step one is to **scope** the problem. Ask who uses it, which features matter most, how many users there are now and later, and what must never go wrong. Write the answers down." },
    { kind: "idea", text: "Rushing to draw boxes before asking anything is the most common mistake. A fast answer to the wrong problem scores worse than a slower answer to the right one." },
    { kind: "idea", text: "Step two is a **high-level design**: clients, servers, databases, caches and queues as boxes with arrows. Walk one request through it, then ask the interviewer if this looks like the right direction." },
    { kind: "idea", text: "Step three is to **go deep**. Agree with the interviewer which one or two parts to explore, then go properly into them: the data model, the hard bottleneck, or what happens when a part fails." },
    { kind: "idea", text: "Step four is the **wrap-up**. Name the weak spots honestly, say what breaks at ten times the traffic, mention monitoring, and list what you would improve with more time." },
    {
      kind: "example",
      title: "Splitting 45 minutes",
      steps: [
        "Spend about 5 to 10 minutes on questions and agreed requirements. This sets up everything after it.",
        "Spend about 10 to 15 minutes on the high-level design and walking a request through it.",
        "Spend about 15 to 20 minutes going deep, the part where you show real depth.",
        "Keep the last 5 minutes for bottlenecks, failures and a short recap of the design.",
      ],
    },
    { kind: "idea", text: "Think aloud the whole time. Offer two options before picking one and say why. If you're stuck, ask for a hint; silence is the one thing the interviewer can't score." },
  ],
  tip: "Before any box goes on the board, say back the requirements in one sentence and get a yes. Every later choice can then point at that sentence.",
  quiz: [
    {
      kind: "mcq",
      id: "t-method-q1",
      prompt: "The interviewer says: design a photo sharing app. What should you do first?",
      options: ["Draw the database tables", "Ask who uses it and at what scale", "Pick a cloud provider", "Name the caching library you like"],
      answer: 1,
      explanation: "Scope comes first. The users, features and scale decide every later choice, so you agree on them before drawing anything.",
    },
    {
      kind: "mcq",
      id: "t-method-q2",
      prompt: "You have sketched the high-level design. What is the best next move?",
      options: ["Ask which part to explore in depth", "Rewrite the design from scratch", "Stop and wait for questions", "List every library you would use"],
      answer: 0,
      explanation: "Going deep should happen where the interviewer wants to see depth, so you agree on it together instead of guessing.",
    },
    {
      kind: "mcq",
      id: "t-method-q3",
      prompt: "Five minutes are left. Which wrap-up sounds strongest?",
      options: ["The design is complete and has no weak spots", "We can add more servers if anything is slow", "The cache is the weak spot; at 10x I'd shard it", "I would rather not guess what happens at scale"],
      answer: 2,
      explanation: "A good wrap-up names a real weak spot and how it would change at the next level of traffic. Claiming perfection is a red flag.",
    },
    {
      kind: "tf",
      id: "t-method-q4",
      statement: "A system design interview has one correct design that the interviewer is waiting for you to find.",
      answer: false,
      explanation: "Many designs can work. You are scored on how you reach yours, explain trade-offs and respond to feedback.",
    },
    {
      kind: "tf",
      id: "t-method-q5",
      statement: "Asking the interviewer for a hint when you are stuck is better than thinking in silence.",
      answer: true,
      explanation: "It's a working session, so a hint keeps it moving and shows you collaborate. Silence gives the interviewer nothing to score.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-method-p1",
      prompt: "You realise halfway through that one requirement was misunderstood. What should you do?",
      options: ["Say so and adjust the design", "Keep going and hope it's missed", "Start a new design in silence", "Ask to end the interview early"],
      answer: 0,
      explanation: "Correcting course out loud is exactly what good engineers do at work, and it shows you check your own reasoning.",
    },
    {
      kind: "tf",
      id: "t-method-p2",
      statement: "Spending most of the hour perfecting one small component is a good use of interview time.",
      answer: false,
      explanation: "Cover the whole system first, then go deep where you agreed. Polishing one corner leaves the rest of the design unseen.",
    },
  ],
  practiceNeeds: ["t-estimation"],
  sources: [
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 3 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "Donne Martin: The System Design Primer", url: "https://github.com/donnemartin/system-design-primer", license: "Link only" },
  ],
};

export default topic;
