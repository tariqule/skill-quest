import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { A11yFixLab } from "../labs";
import { DomTreeVisual, LandmarksVisual } from "../visuals";

/** World 1: what a web page is, elements and attributes, semantic structure, accessible forms and controls. */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "HTML Foundations",
    world: "The Markup Meadow",
    weight: 25,
    emoji: "🌱",
    color: "#e34f26",
    summary: "What a web page is and how the browser draws it, how to write tags and attributes, how to give a page a clear structure, and how to build forms everyone can use.",
  },

  tasks: [
    { id: "1.1", title: "Explain what a web page is", covers: ["the jobs of HTML, CSS and JavaScript", "how a browser renders a page", "the document skeleton", "defer and async scripts"] },
    { id: "1.2", title: "Write elements and attributes", covers: ["tags, nesting and void elements", "attributes and boolean attributes", "links, images and lists", "how the parser fixes broken markup"] },
    { id: "1.3", title: "Structure pages semantically", covers: ["landmark elements", "a logical heading outline", "article vs section"] },
    { id: "1.4", title: "Build accessible forms and controls", covers: ["labels", "button vs link vs div", "alt text", "ARIA's first rule", "keyboard access"] },
  ],

  lessons: [
    {
      id: "d1-b-start",
      level: "beginner",
      task: "1.1",
      title: "What HTML is",
      check: ["web-b1-01", "web-b1-02"],
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "🧱", title: "HTML", text: "The structure: headings, paragraphs, images and links.", color: "#f97316" },
            { icon: "🎨", title: "CSS", text: "The look: colours, fonts, spacing and layout.", color: "#38bdf8" },
            { icon: "⚙️", title: "JavaScript", text: "The behaviour: what happens when you click or type.", color: "#facc15" },
          ]}
        />
      ),
      points: [
        "Every web page is built from **HTML**, a way of marking up text so the browser knows what each part is: a heading, a paragraph, a link.",
        "Think of a house. HTML is the walls and rooms, CSS is the paint and furniture, and JavaScript is the wiring that makes things switch on.",
        "HTML isn't a programming language. It doesn't do maths or make decisions. It describes your content.",
        "An HTML file is plain text with a name ending in `.html`. You can write one in any text editor and open it in your browser.",
      ],
      tip: "To see the HTML behind any page, right-click it and choose View Page Source. Most sites look busy in there, but you'll soon recognise the tags.",
    },
    {
      id: "d1-b-tags",
      level: "beginner",
      task: "1.2",
      title: "Your first tags",
      check: ["web-b1-03", "web-b1-04"],
      visual: (
        <div className="grid gap-3">
          <Flow
            color="#f97316"
            steps={[
              { icon: "🟢", label: "Opening tag", sub: "<p>" },
              { icon: "📝", label: "Content", sub: "Hello!" },
              { icon: "🔴", label: "Closing tag", sub: "</p>" },
            ]}
          />
          <CodeBlock
            lang="html"
            caption="Three elements: a main heading, a paragraph and a link."
            code={`<h1>My first page</h1>
<p>Hello! This is a paragraph.</p>
<a href="https://example.com">Visit a site</a>`}
          />
        </div>
      ),
      points: [
        "HTML is made of **tags**: short words in angle brackets. `<p>` starts a paragraph and `</p>` ends it.",
        "An opening tag, its content and a closing tag together make an **element**. The closing tag has a slash: `</p>`.",
        "`<h1>` is the main heading, `<p>` is a paragraph, and `<a>` is a link. Those three get you surprisingly far.",
        "Some tags carry extra details called **attributes**. In `<a href=\"https://example.com\">`, the `href` says where the link goes.",
      ],
      tip: "If something looks wrong, check that you closed every tag you opened. A missing `</p>` or `</a>` is the most common beginner slip.",
    },
    {
      id: "d1-web",
      level: "junior",
      task: "1.1",
      title: "What is a web page?",
      check: ["d1-01", "d1-02"],
      visual: (
        <div className="grid gap-3">
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧱", title: "HTML", text: "The content and its meaning: this is a heading, this is a list, this is a button.", color: "#e34f26" },
              { icon: "🎨", title: "CSS", text: "The presentation: colours, fonts, spacing, layout, animation.", color: "#2965f1" },
              { icon: "⚙️", title: "JavaScript", text: "The behaviour: react to clicks, fetch data, update the page.", color: "#f7df1e" },
            ]}
          />
          <Flow
            color="#e34f26"
            steps={[
              { icon: "📥", label: "Download HTML", sub: "The browser requests a URL and receives a text file" },
              { icon: "🌳", label: "Build the DOM", sub: "Parse tags into a tree of elements, fetching linked CSS, images and scripts" },
              { icon: "🎨", label: "Style", sub: "Match CSS rules to every element and compute final values" },
              { icon: "📐", label: "Layout", sub: "Work out each box's size and position" },
              { icon: "🖌️", label: "Paint", sub: "Draw the pixels (and composite layers) on screen" },
            ]}
          />
        </div>
      ),
      points: [
        "A web page is a text file of HTML. The browser reads it top to bottom and builds the **DOM**, a tree of elements that CSS can style and JavaScript can change.",
        "HTML says what things are, CSS says how they look, and JavaScript says what they do. Keeping those jobs apart makes each one easier to change.",
        "Every page starts with `<!DOCTYPE html>`, which tells the browser to use modern rules. Then comes `<html lang>`, a `<head>` with details about the page, and a `<body>` with the content.",
        "A plain `<script>` in the head makes the browser stop reading the page until the script has downloaded and run. With `defer`, the browser keeps reading and runs the script once the page is built.",
      ],
      tip: "Open any HTML file in your browser, right-click and choose Inspect. The Elements panel shows the DOM tree the browser actually built, which isn't always what you typed.",
    },
    {
      id: "d1-elements",
      level: "junior",
      task: "1.2",
      title: "Elements, tags, and attributes",
      check: ["d1-07", "d1-08"],
      visual: (
        <div className="grid gap-3">
          <CodeBlock
            lang="html"
            caption={'Opening tag + content + closing tag = an element. Attributes sit in the opening tag as name="value".'}
            code={`<!-- tag: a · attributes: href, class · content: About us -->
<a href="/about" class="nav-link">About us</a>

<!-- void element: no content, no closing tag -->
<img src="cat.jpg" alt="A ginger cat asleep">

<!-- boolean attribute: present = on -->
<input type="checkbox" checked>`}
          />
          <DomTreeVisual />
        </div>
      ),
      points: [
        "Elements nest like boxes inside boxes. Close them in the reverse order you opened them: `<p><strong>…</strong></p>`.",
        "Some elements, called **void elements**, never hold content, so they have no closing tag. Examples are `<img>`, `<br>`, `<input>`, `<meta>` and `<link>`.",
        "Attributes add information. `href` says where a link goes, and `src` and `alt` describe an image. `id` names one unique element, and `class` is a reusable label for styling and scripts.",
        "Some attributes, like `checked`, `disabled` and `required`, are simple on switches. If the attribute is there at all, it's on, whatever value you write.",
        "The browser never gives up on broken HTML. It quietly repairs it into some tree, which may not be the one you meant.",
      ],
      tip: "Indent nested elements the same way every time. Most nesting mistakes jump out as soon as the indentation is tidy.",
    },
    {
      id: "d1-semantic",
      level: "junior",
      task: "1.3",
      title: "Semantic HTML and landmarks",
      check: ["d1-13", "d1-14"],
      visual: (
        <div className="grid gap-3">
          <LandmarksVisual />
          <CodeCompare
            lang="html"
            left={{ title: "Div soup", code: `<div class="top">\n  <div class="links">…</div>\n</div>\n<div class="content">\n  <div class="big">Pricing</div>\n</div>` }}
            right={{ title: "Semantic", code: `<header>\n  <nav>…</nav>\n</header>\n<main>\n  <h1>Pricing</h1>\n</main>` }}
          />
        </div>
      ),
      points: [
        "**Semantic** elements describe what content means. `<header>`, `<nav>`, `<main>`, `<aside>` and `<footer>` become **landmarks**, regions that screen reader users can jump between.",
        "Headings form an outline, like a table of contents. Use one `<h1>` for the page, then `<h2>` and `<h3>` in order. Pick the level by structure, not size. CSS handles size.",
        "`<article>` is for content that makes sense on its own, like a post, a product card or a comment. `<section>` groups related content under a heading.",
        "Use `<div>` and `<span>` only when no other element has the right meaning. They're mostly handy hooks for styling.",
      ],
      tip: "Try reading your page with the CSS turned off. If it still makes sense as a document, your HTML is doing its job.",
    },
    {
      id: "d1-a11y",
      level: "intermediate",
      task: "1.4",
      title: "Accessible forms, buttons, and images",
      check: ["d1-19", "d1-20"],
      visual: (
        <div className="grid gap-3">
          <CodeCompare
            lang="html"
            left={{
              title: "Looks fine, works badly",
              code: `<img src="logo.png">
<input type="email" placeholder="Email">
<div class="btn" onclick="send()">
  Send
</div>`,
            }}
            right={{
              title: "Works for everyone",
              code: `<img src="logo.png" alt="Acme">
<label for="email">Email</label>
<input id="email" type="email" name="email">
<button type="submit">Send</button>`,
            }}
          />
          <Tiles
            tiles={[
              { icon: "🏷️", title: "Every control has a name", text: "`<label for>` matching the input's `id`, visible button text, or `aria-label` for icon-only buttons.", color: "#34d399" },
              { icon: "⌨️", title: "Everything works by keyboard", text: "`<button>`, `<a href>` and form fields are focusable and respond to Enter/Space for free. A `<div>` is not.", color: "#38bdf8" },
              { icon: "🖼️", title: "Images have alt", text: "Describe what the image communicates. Use `alt=\"\"` for pure decoration so screen readers skip it.", color: "#f97316" },
              { icon: "🧩", title: "ARIA last", text: "First rule of ARIA: if a native element does the job, use it. ARIA changes what's announced, not how things behave.", color: "#a78bfa" },
            ]}
          />
        </div>
      ),
      points: [
        "A `<label for=\"x\">` must match the input's `id=\"x\"`. Then clicking the label puts the cursor in the field, and screen readers read out its name.",
        "Buttons do things and links go places. Use `<button>` for actions, like Save, and `<a href>` for moving to another page.",
        "Inside a `<form>`, a `<button>` submits the form unless you say otherwise. Give buttons that shouldn't submit `type=\"button\"`.",
        "Placeholder text isn't a label. It disappears as soon as you type, and it's often pale and hard to read.",
      ],
      tip: "Put your mouse away for five minutes and use your page with Tab, Shift+Tab, Enter and Space. You'll find most accessibility problems yourself.",
    },
  ],

  questions: [
    {
      id: "web-b1-01",
      domain: "d1",
      lesson: "d1-b-start",
      level: "beginner",
      prompt: "What is HTML's job on a web page?",
      options: ["Saying what each piece of content is, like a heading or a link", "Choosing the colours and fonts", "Storing users' passwords", "Making the computer run faster"],
      answer: [0],
      explanation: "HTML describes your content so the browser knows what each part is. Colours and fonts are CSS's job, and passwords live on a server, not in HTML.",
    },
    {
      id: "web-b1-02",
      domain: "d1",
      lesson: "d1-b-start",
      level: "beginner",
      prompt: "In the house comparison, which part is CSS?",
      options: ["The paint and furniture: how it looks", "The walls and rooms: the structure", "The wiring: what happens when you flip a switch"],
      answer: [0],
      explanation: "CSS is about looks. HTML is the structure, like the walls, and JavaScript is the behaviour, like the wiring that makes a light come on.",
    },
    {
      id: "web-b1-03",
      domain: "d1",
      lesson: "d1-b-tags",
      level: "beginner",
      prompt: "Which tag closes a paragraph?",
      options: ["`</p>`", "`<p>`", "`<end p>`", "`(p)`"],
      answer: [0],
      explanation: "A closing tag is the same word as the opening tag with a slash in front: `</p>`. The browser then knows exactly where the paragraph ends.",
    },
    {
      id: "web-b1-04",
      type: "fill",
      domain: "d1",
      lesson: "d1-b-tags",
      level: "beginner",
      prompt: "Fill the gap so the link goes to example.com.",
      code: `<a {{1}}="https://example.com">Visit a site</a>`,
      codeLang: "html",
      blanks: [{ options: ["href", "src", "link", "url"], answer: 0 }],
      explanation: "`href` tells a link where to go. `src` is a different attribute, used by things like images to load a file into the page.",
    },
    // ── d1-web ──
    {
      id: "d1-01",
      domain: "d1",
      lesson: "d1-web",
      level: "junior",
      prompt: "Which job belongs to HTML?",
      options: [
        "Describing the content and what each part means (heading, list, button)",
        "Choosing colours, fonts, and layout",
        "Reacting to clicks and fetching new data",
        "Storing user accounts on the server",
      ],
      answer: [0],
      explanation: "HTML gives content its structure and meaning. CSS handles how it looks, JavaScript handles what it does, and servers store the data.",
    },
    {
      id: "d1-02",
      domain: "d1",
      lesson: "d1-web",
      level: "junior",
      type: "order",
      prompt: "Put the steps a browser takes to show a page in order.",
      items: [
        "Request the URL and download the HTML",
        "Parse the HTML into the DOM, fetching linked CSS",
        "Match CSS rules to elements and compute styles",
        "Layout: work out every box's size and position",
        "Paint the pixels to the screen",
      ],
      explanation: "The browser reads the HTML into the DOM, fetching stylesheets as it finds them. Then it works out the styles, lays out the boxes and paints them. Change a size and it has to lay out and paint again. Change only a colour and it can skip the layout step.",
    },
    {
      id: "d1-03",
      domain: "d1",
      lesson: "d1-web",
      level: "junior",
      prompt: "How does the browser display this paragraph?",
      code: `<p>Hello      world,
   this is    HTML.</p>`,
      codeLang: "html",
      options: ["Hello world, this is HTML. (on one line, single spaces)", "Exactly as typed, with the extra spaces and the line break", "Hello world, on line one and this is HTML. on line two", "Helloworld,thisisHTML."],
      answer: [0],
      explanation: "By default (`white-space: normal`) runs of spaces, tabs and newlines collapse into a single space, and text wraps only where the box runs out of room. Use `<br>`, separate paragraphs, or CSS to control breaks.",
    },
    {
      id: "d1-04",
      domain: "d1",
      lesson: "d1-web",
      level: "junior",
      type: "order",
      prompt: "Arrange these pieces into a minimal, valid HTML document.",
      items: [`<!DOCTYPE html>`, `<html lang="en">`, `<head><meta charset="utf-8"><title>Hi</title></head>`, `<body><h1>Hello</h1></body>`, `</html>`],
      explanation: "`<!DOCTYPE html>` comes first and switches the browser to standards mode. `<html>` wraps everything: the `<head>` (metadata such as charset and title) and then the `<body>` (visible content).",
    },
    {
      id: "d1-05",
      domain: "d1",
      lesson: "d1-web",
      level: "intermediate",
      prompt: "`app.js` runs `document.querySelector(\"#signup\")` and gets `null`, though the form exists further down the page. What's the simplest fix?",
      code: `<head>
  <script src="app.js"></script>
</head>
<body>
  <form id="signup">…</form>
</body>`,
      codeLang: "html",
      options: ["Add `defer` to the script tag", "Add `async` to the script tag", "Move the `<form>` into the `<head>`", "Rename the id to a class"],
      answer: [0],
      explanation: "A plain script runs as soon as it's reached, before the parser has seen the form. `defer` downloads in parallel and runs after the document is parsed, in order. `async` runs whenever the download finishes, which may still be before the form exists.",
    },
    {
      id: "d1-06",
      domain: "d1",
      lesson: "d1-web",
      level: "senior",
      prompt: "Which statements about `defer` and `async` scripts are true? (Choose two.)",
      options: [
        "`defer` scripts run in document order after parsing finishes, before `DOMContentLoaded`",
        "`async` scripts run as soon as each one downloads, so their order isn't guaranteed",
        "`async` scripts always wait until the whole DOM has been parsed",
        "`defer` also delays inline scripts that have no `src`",
      ],
      answer: [0, 1],
      explanation: "`defer` keeps scripts in order and waits until the page is read. `async` runs each script as soon as it arrives, which suits independent scripts like analytics. Both only affect external classic scripts. On an inline classic script, `defer` is ignored.",
    },

    // ── d1-elements ──
    {
      id: "d1-07",
      domain: "d1",
      lesson: "d1-elements",
      level: "junior",
      prompt: "In this element, what is `href`?",
      code: `<a href="/about" class="nav-link">About us</a>`,
      codeLang: "html",
      options: ["An attribute", "The tag name", "The element's content", "A closing tag"],
      answer: [0],
      explanation: "`a` is the tag name, `href` and `class` are attributes (extra information in the opening tag), \"About us\" is the content, and `</a>` is the closing tag.",
    },
    {
      id: "d1-08",
      domain: "d1",
      lesson: "d1-elements",
      level: "junior",
      type: "lines",
      prompt: "Tap the line whose tags are nested incorrectly.",
      code: `<p>
  Read the
  <strong><em>docs</strong></em>
  first.
</p>`,
      codeLang: "html",
      answer: [3],
      explanation: "Tags must close in the reverse order they opened: `<strong><em>docs</em></strong>`. Overlapping tags make the parser guess, and the resulting tree may not match what you intended.",
    },
    {
      id: "d1-09",
      domain: "d1",
      lesson: "d1-elements",
      level: "junior",
      prompt: "Which of these is a void element, written without a closing tag?",
      options: ["`<img>`", "`<p>`", "`<span>`", "`<li>`"],
      answer: [0],
      explanation: "Void elements (`img`, `br`, `hr`, `input`, `meta`, `link` and a few others) can't have content, so they never get a closing tag. The trailing slash in `<img />` is allowed but optional.",
    },
    {
      id: "d1-10",
      domain: "d1",
      lesson: "d1-elements",
      level: "junior",
      prompt: "Is this checkbox ticked when the page loads?",
      code: `<input type="checkbox" checked="false">`,
      codeLang: "html",
      options: ["Yes: a boolean attribute is on whenever it's present", "No: the value \"false\" turns it off", "Only in older browsers", "It throws a parse error and isn't shown"],
      answer: [0],
      explanation: "For boolean attributes like `checked`, `disabled` and `required`, presence means true. To turn one off, remove the attribute entirely.",
    },
    {
      id: "d1-11",
      domain: "d1",
      lesson: "d1-elements",
      level: "junior",
      type: "match",
      prompt: "Match each element to its job.",
      pairs: [
        ["`<a href>`", "Link to another page or place"],
        ["`<img>`", "Embed an image"],
        ["`<ul>`", "A list where order doesn't matter"],
        ["`<ol>`", "A numbered, ordered list"],
        ["`<table>`", "Data in rows and columns"],
      ],
      explanation: "Pick elements by meaning. A list of nav links is a `<ul>`, steps in a recipe are an `<ol>`, and a timetable is a `<table>`. Never use tables for page layout.",
    },
    {
      id: "d1-12",
      domain: "d1",
      lesson: "d1-elements",
      level: "senior",
      prompt: "How does the HTML parser turn this markup into a DOM?",
      code: `<p>Intro <div>Box</div> end</p>`,
      codeLang: "html",
      options: [
        "`<p>Intro </p><div>Box</div> end<p></p>`: the `<div>` closes the paragraph, and the stray `</p>` creates an empty one",
        "A `<p>` that contains the `<div>`, exactly as written",
        "The `<div>` is dropped and only text remains",
        "Parsing stops at the error and nothing after it renders",
      ],
      answer: [0],
      explanation: "A `<p>` can only contain phrasing content. A `<div>` start tag implicitly closes the open `<p>`, \" end\" becomes text in the body, and the unmatched `</p>` produces an empty `<p></p>`. This is why CSS like `p > div` never matches.",
    },

    // ── d1-semantic ──
    {
      id: "d1-13",
      domain: "d1",
      lesson: "d1-semantic",
      level: "junior",
      prompt: "Which element should wrap the site's main navigation links?",
      options: ["`<nav>`", "`<menu-bar>`", "`<div class=\"nav\">`", "`<aside>`"],
      answer: [0],
      explanation: "`<nav>` marks a block of major navigation links and becomes a navigation landmark. A class name means nothing to assistive technology, and `<menu-bar>` isn't an HTML element.",
    },
    {
      id: "d1-14",
      domain: "d1",
      lesson: "d1-semantic",
      level: "junior",
      type: "match",
      prompt: "Match each landmark element to what belongs in it.",
      pairs: [
        ["`<header>`", "Logo, site name, intro content"],
        ["`<nav>`", "Major navigation links"],
        ["`<main>`", "The page's unique primary content"],
        ["`<aside>`", "Related but secondary content"],
        ["`<footer>`", "Copyright, contacts, legal links"],
      ],
      explanation: "These elements describe regions of the page. Screen readers list them as landmarks (banner, navigation, main, complementary, contentinfo) so users can jump straight to the part they want.",
    },
    {
      id: "d1-15",
      domain: "d1",
      lesson: "d1-semantic",
      level: "junior",
      prompt: "Why prefer `<article>`, `<nav>` and `<main>` over plain `<div>`s with class names?",
      options: [
        "They tell browsers, assistive technology and search engines what each part is",
        "They render faster than divs",
        "CSS can't select a `<div>`",
        "They come with the layout styles you need",
      ],
      answer: [0],
      explanation: "Semantic elements carry meaning that tools can use: landmark navigation, reader modes, search snippets. They look much like a `<div>` until you style them, and performance is the same.",
    },
    {
      id: "d1-16",
      domain: "d1",
      lesson: "d1-semantic",
      level: "intermediate",
      type: "lines",
      prompt: "Screen reader users who navigate by headings find this outline confusing. Tap the line that breaks the heading hierarchy.",
      code: `<main>
  <h1>Pricing</h1>
  <section>
    <h4>Starter plan</h4>
    <p>For side projects.</p>
  </section>
</main>`,
      codeLang: "html",
      answer: [4],
      explanation: "The outline jumps from h1 to h4, so it looks like levels 2 and 3 are missing. Use `<h2>` here and make it look smaller with CSS if needed. Choose heading levels by structure, not size.",
    },
    {
      id: "d1-17",
      domain: "d1",
      lesson: "d1-semantic",
      level: "intermediate",
      prompt: "A blog's home page lists 10 post previews, each of which would make sense on its own (in a feed reader, for example). Which element fits each preview?",
      options: ["`<article>`", "`<section>`", "`<aside>`", "`<main>`"],
      answer: [0],
      explanation: "`<article>` is for self-contained content that could be distributed independently: posts, comments, product cards. `<section>` is a thematic group with a heading, and there should be only one visible `<main>`.",
    },
    {
      id: "d1-18",
      domain: "d1",
      lesson: "d1-semantic",
      level: "intermediate",
      prompt: "How many visible `<main>` elements should a page have?",
      options: ["Exactly one", "One per `<section>`", "As many as you like", "None: `<body>` already means main content"],
      answer: [0],
      explanation: "A document can have only one `<main>` that isn't hidden. It wraps the unique content of the page (not the repeated header, nav and footer), and \"skip to content\" links usually point to it.",
    },

    // ── d1-a11y ──
    {
      id: "d1-19",
      domain: "d1",
      lesson: "d1-a11y",
      level: "intermediate",
      type: "lines",
      prompt: "Clicking the word \"Email\" doesn't focus the field, and screen readers announce an unnamed text box. Tap the two lines that don't agree with each other.",
      code: `<form>
  <label for="email">Email</label>
  <input id="user-email" type="email" name="email">
  <button>Subscribe</button>
</form>`,
      codeLang: "html",
      answer: [2, 3],
      explanation: "`for` must match the input's `id`, not its `name`. Here `for=\"email\"` points at nothing because the id is `user-email`. Make them the same, or wrap the input inside the `<label>`.",
    },
    {
      id: "d1-20",
      domain: "d1",
      lesson: "d1-a11y",
      level: "intermediate",
      prompt: "A decorative swirl image adds nothing to the content. What should its `alt` be?",
      options: ["`alt=\"\"`", "Leave `alt` out entirely", "`alt=\"decorative swirl image\"`", "`alt=\"image\"`"],
      answer: [0],
      explanation: "An empty alt tells assistive technology to skip the image. Leaving `alt` out often makes screen readers read the file name instead, and describing decoration is just noise. (Better still, add pure decoration with CSS.)",
    },
    {
      id: "d1-21",
      domain: "d1",
      lesson: "d1-a11y",
      level: "junior",
      prompt: "What's the main problem with this \"button\" for keyboard users?",
      code: `<div class="btn" onclick="save()">Save</div>`,
      codeLang: "html",
      options: [
        "Tab can't reach it, and Enter or Space won't activate it",
        "Divs can't have click handlers",
        "The text is too short",
        "It's fine as long as it looks like a button",
      ],
      answer: [0],
      explanation: "A `<div>` isn't focusable and has no button role or keyboard behaviour. `<button type=\"button\" onclick=\"save()\">Save</button>` gets focus, Enter/Space activation, and the right announcement for free.",
    },
    {
      id: "d1-22",
      domain: "d1",
      lesson: "d1-a11y",
      level: "intermediate",
      type: "lines",
      prompt: "Clicking \"Show password\" submits the form instead of revealing the password. Tap the buggy line.",
      code: `<form action="/signup" method="post">
  <label for="pw">Password</label>
  <input id="pw" type="password" name="pw">
  <button onclick="togglePw()">Show password</button>
  <button type="submit">Sign up</button>
</form>`,
      codeLang: "html",
      answer: [4],
      explanation: "A `<button>` inside a form defaults to `type=\"submit\"`, so it runs its handler and then submits. Add `type=\"button\"` to buttons that aren't meant to submit.",
    },
    {
      id: "d1-23",
      domain: "d1",
      lesson: "d1-a11y",
      level: "senior",
      prompt: "Which are good uses of ARIA? (Choose two.)",
      options: [
        "`aria-label=\"Close\"` on an icon-only `<button>` showing ✕",
        "`aria-expanded=\"true\"` / `\"false\"` on a button that opens and closes a menu",
        "`role=\"button\"` added to a `<button>` element",
        "`aria-hidden=\"true\"` on a link that can still receive focus",
      ],
      answer: [0, 1],
      explanation: "ARIA should fill gaps: a name for an icon-only control, or a state like expanded/collapsed. `role=\"button\"` on a button is redundant, and hiding a focusable element creates a stop that announces nothing.",
    },
    {
      id: "d1-24",
      domain: "d1",
      lesson: "d1-a11y",
      level: "staff",
      prompt: "Your component library has 40 custom `<div role=\"button\">` widgets that fail keyboard audits across many products. What's the most effective fix?",
      options: [
        "Rebuild them on native `<button>` elements inside the shared components, so every product gets the fix by upgrading",
        "Ask each product team to add `tabindex=\"0\"` wherever they use the widgets",
        "Add a third-party accessibility overlay script to every site",
        "Document that keyboard users should turn on mouse keys",
      ],
      answer: [0],
      explanation: "Fix it once at the source. A native button brings focus, Enter/Space handling and the right role, and every consumer inherits it. Per-team patches drift, `tabindex` alone still lacks keyboard activation, and overlays don't fix the underlying markup.",
    },
  ],

  cards: [
    { id: "c-d1-dom", domain: "d1", kind: "concept", term: "DOM", definition: "The Document Object Model: the tree of elements and text the browser builds from HTML. CSS styles it and JavaScript changes it." },
    { id: "c-d1-doctype", domain: "d1", kind: "service", term: "<!DOCTYPE html>", definition: "The first line of every page. Puts the browser in standards mode instead of legacy quirks mode." },
    { id: "c-d1-viewport", domain: "d1", kind: "service", term: "<meta name=\"viewport\">", definition: "`content=\"width=device-width, initial-scale=1\"` makes phones use their real width, so responsive CSS works." },
    { id: "c-d1-defer", domain: "d1", kind: "service", term: "defer", definition: "A script attribute. The script downloads while the page is read, then runs in order once the HTML is parsed. The usual choice for app scripts." },
    { id: "c-d1-void", domain: "d1", kind: "concept", term: "Void element", definition: "An element that can't have content and has no closing tag: `img`, `br`, `hr`, `input`, `meta`, `link`." },
    { id: "c-d1-boolean", domain: "d1", kind: "concept", term: "Boolean attribute", definition: "An attribute that's on when present, whatever its value: `checked`, `disabled`, `required`, `hidden`." },
    { id: "c-d1-semantic", domain: "d1", kind: "concept", term: "Semantic HTML", definition: "Choosing elements for their meaning (`<nav>`, `<button>`, `<h2>`) rather than their look, so tools and people understand the page." },
    { id: "c-d1-main", domain: "d1", kind: "service", term: "<main>", definition: "The page's main, unique content. There's one visible per page, and \"skip to content\" links usually point to it." },
    { id: "c-d1-article", domain: "d1", kind: "service", term: "<article>", definition: "Self-contained content that makes sense on its own: a post, a comment, a product card." },
    { id: "c-d1-section", domain: "d1", kind: "service", term: "<section>", definition: "A thematic group of content, normally with its own heading." },
    { id: "c-d1-label", domain: "d1", kind: "service", term: "<label for>", definition: "Names a form control. `for` must match the control's `id`. Clicking the label then puts focus on the control." },
    { id: "c-d1-button", domain: "d1", kind: "service", term: "<button>", definition: "Native action control: focusable, activated by Enter and Space. Defaults to `type=\"submit\"` inside a form." },
    { id: "c-d1-alt", domain: "d1", kind: "service", term: "alt", definition: "Text that stands in for an image. Describe what the image tells the reader. `alt=\"\"` marks it as decoration." },
    { id: "c-d1-aria", domain: "d1", kind: "concept", term: "First rule of ARIA", definition: "If a native HTML element or attribute already does it, use that. ARIA changes what's announced, not behaviour." },
    { id: "c-d1-landmark", domain: "d1", kind: "concept", term: "Landmark", definition: "A page region (banner, navigation, main, complementary, contentinfo) that assistive technology users can jump between." },
  ],

  challenges: [
    {
      id: "ch-html-a11y",
      domain: "d1",
      lesson: "d1-a11y",
      title: "Make the form speak",
      goal: "Apply every fix so each control has a proper name and role and can be reached with the Tab key.",
      hint: "A screen reader can only announce what the HTML provides: alt text, a connected label, a name for icon buttons, a real button.",
      takeaway: "Native elements plus names (alt, label, aria-label for icon-only controls) make a form usable by keyboard and screen reader with no extra JavaScript.",
      render: (onSolved) => <A11yFixLab goal="all" onSolved={onSolved} />,
    },
  ],
});
