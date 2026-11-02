import type { TopicContent } from "../../schema";

const topic: TopicContent = {
  id: "t-design-autocomplete-1",
  module: "m11",
  title: "Design search autocomplete: the trie",
  level: "intermediate",
  visual: {
    kind: "flow",
    steps: [
      { icon: "⌨️", label: "Keystroke", sub: "The box now holds \"car\"" },
      { icon: "🌳", label: "Walk the trie", sub: "c, then a, then r" },
      { icon: "📌", label: "Prefix node", sub: "Already holds its top 5" },
      { icon: "📋", label: "Suggestions", sub: "Sent back as they are" },
    ],
  },
  screens: [
    { kind: "idea", text: "The ask: \"Design the suggestions that appear under a search box as you type.\" Ask: match only the start of a query? How many suggestions, ranked how? Spell check? Which languages? Capitals allowed? How many daily users?" },
    { kind: "idea", text: "A typical agreement: match the start only, show 5 suggestions ranked by how often each query was searched, no spell check, English in lowercase, 20 million daily users, and answers within about 100 ms so typing never stutters." },
    {
      kind: "example",
      title: "Sizing the suggestion traffic",
      steps: [
        "Assume 20 million daily users making 6 searches each: 120 million searches a day.",
        "Each search is typed as about 15 letters, and every letter sends a request. That's 1.8 billion requests a day.",
        "Divide by 86,400 seconds: about 20,800 requests a second. Allow three times that at peak, about 62,500 a second.",
        "Say a quarter of searches are queries never seen before, 15 bytes each. 120 million times 0.25 times 15 bytes is 450 MB of new data a day.",
      ],
    },
    { kind: "idea", text: "Split the system in two. The **data gathering service** collects what people search and counts how often each query appears. The query service takes a prefix and returns the 5 most popular queries that start with it." },
    {
      kind: "idea",
      text: "The first design keeps a **frequency table** of query and count. Gathering adds one to a row on every search, and the query service runs a prefix query sorted by count, as shown.",
      visual: { kind: "code", lang: "sql", code: "SELECT query\nFROM query_counts\nWHERE query LIKE 'ca%'\nORDER BY frequency DESC\nLIMIT 5;", caption: "One query per keystroke" },
    },
    { kind: "idea", text: "Then say what breaks. A one-letter prefix matches millions of rows, which must be sorted by count, 62,500 times a second at peak. Add a row update for every search, and the database can't keep up." },
    { kind: "idea", text: "The fix is a **trie**, or prefix tree. The root is the empty string, each child adds one character, and the path from the root to a node spells a prefix. Every query sharing a prefix shares those nodes." },
    { kind: "idea", text: "To rank, store each query's count on the node where that query ends. In a trie holding \"car\" and \"cart\", the nodes for \"car\" and \"cart\" carry counts, while \"c\" and \"ca\" are only prefixes." },
    { kind: "idea", text: "The naive top-k lookup has three steps. Find the prefix node, costing O(p) for a prefix of p letters. Walk its subtree collecting every query, O(c) for c nodes below it. Sort them, O(c log c)." },
    { kind: "idea", text: "That adds up to O(p) plus O(c) plus O(c log c), and c is the problem. For a prefix of one letter, the subtree is a large part of the whole trie, walked and sorted on every keystroke." },
    { kind: "idea", text: "First fix: cap the prefix. People rarely type more than about 50 characters into a search box, so stop there. Finding the prefix node then takes at most 50 steps, which counts as constant time." },
    { kind: "idea", text: "Second fix: **cache top k** at every node. Each node stores its own 5 best queries, so a lookup finds the node and reads its list, with no walk and no sort. You trade a lot of space for speed." },
    {
      kind: "example",
      title: "Top 3 cached at each node",
      steps: [
        "The trie holds car 40, cart 30, cat 25, card 15 and cab 5, and each node keeps its top 3.",
        "So the \"ca\" list drops card and cab, the two weakest. Under \"car\", card now makes the cut, and \"cab\" holds just itself.",
        "Someone types \"car\". The service steps through c, a and r, reads the stored list and returns it. Nothing is walked below and nothing is sorted.",
        "The cost: \"cart\" sits in the lists at c, ca, car and cart, four copies of one query. A popular query is copied once per letter.",
      ],
    },
  ],
  tip: "Write the naive cost O(p) plus O(c) plus O(c log c) on the board, then show how capping p and caching top k at each node turn both parts into constant time.",
  quiz: [
    {
      kind: "mcq",
      id: "t-design-autocomplete-1-q1",
      prompt: "Lookups for one-letter prefixes are slow because the service walks the prefix node's whole subtree and sorts it. Which change matches?",
      options: ["Cap prefixes at 50 characters", "Add an index on frequency", "Cache the top 5 at every node", "Shard the table by length"],
      answer: 2,
      explanation: "The cost is the subtree walk and sort, and a stored top 5 removes both. Capping the prefix only speeds up finding the node, an index on frequency doesn't narrow the prefix, and sharding by length still leaves the walk.",
    },
    {
      kind: "mcq",
      id: "t-design-autocomplete-1-q2",
      prompt: "You store each node's top 5 queries on the node itself. What does that choice cost?",
      options: ["Each query is copied to many nodes", "Every lookup needs a sort again", "Prefix matching gives wrong results", "Counts vanish from the end nodes"],
      answer: 0,
      explanation: "A query appears in the list of every node along its path, so space grows with query length. Lookups no longer sort, the lists still hold only matching queries, and the end nodes keep their counts.",
    },
    {
      kind: "mcq",
      id: "t-design-autocomplete-1-q3",
      prompt: "The first design runs a LIKE 'a%' query sorted by count on every keystroke. Why does it fall over at scale?",
      options: ["LIKE can't match the start of text", "SQL can't stop after five rows", "A table can't store query counts", "Short prefixes match huge row sets"],
      answer: 3,
      explanation: "One letter matches millions of rows that must be sorted, tens of thousands of times a second. LIKE with a trailing % does match the start, LIMIT returns five rows, and a table holds counts fine.",
    },
    {
      kind: "tf",
      id: "t-design-autocomplete-1-q4",
      statement: "Capping prefixes at about 50 characters makes finding the prefix node a constant-time step.",
      answer: true,
      explanation: "The walk from the root takes one step per letter, and there are at most 50 letters, so the cost has a fixed ceiling no matter how big the trie grows.",
    },
    {
      kind: "tf",
      id: "t-design-autocomplete-1-q5",
      statement: "Every trie node stores a search count, including nodes for prefixes nobody has searched as a whole query.",
      answer: false,
      explanation: "Counts live on the nodes where real queries end. A node like \"ca\" is only a prefix, so it has no count of its own, though it can hold a cached top k list.",
    },
  ],
  practice: [
    {
      kind: "mcq",
      id: "t-design-autocomplete-1-p1",
      prompt: "10 million daily users make 8 searches each, typing 12 letters per search with one request per letter. About how many requests a second on average?",
      options: ["About 930", "About 33,300", "About 11,100", "About 111,000"],
      answer: 2,
      explanation: "10 million times 8 times 12 is 960 million a day, and 960 million divided by 86,400 is about 11,100. 930 forgets the letters, 33,300 is three times the average, a peak figure, and 111,000 divides by 8,640 instead of 86,400.",
    },
    {
      kind: "tf",
      id: "t-design-autocomplete-1-p2",
      statement: "With the top k stored at each node, answering a prefix needs no sorting at read time.",
      answer: true,
      explanation: "The list is sorted when the trie is built, so a lookup finds the node and returns its stored list as it is.",
    },
  ],
  practiceNeeds: ["t-estimation"],
  sources: [
    { title: "Alex Xu, System Design Interview: An Insider's Guide, chapter 13 (reference, not quoted)", url: "https://bytebytego.com/", license: "Link only" },
    { title: "Meta Engineering: The Life of a Typeahead Query", url: "https://engineering.fb.com/2010/05/17/web/the-life-of-a-typeahead-query/", license: "Link only" },
    { title: "Wikipedia: Trie", url: "https://en.wikipedia.org/wiki/Trie", license: "Link only" },
  ],
};

export default topic;
