import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { ServerClientSorter } from "../labs";

/** Domain 2: React Server Components vs Client Components in Next.js. */
export default defineDomain({
  domain: {
    id: "d2",
    number: 2,
    name: "Server and Client Components",
    world: "The Boundary Bridge",
    weight: 25,
    emoji: "🌉",
    color: "#a78bfa",
    summary: "Where your code runs: on the server by default, in the browser with \"use client\", how to mix the two, and how to keep secrets away from visitors.",
  },

  tasks: [
    {
      id: "2.1",
      title: "Choose Server or Client Components",
      covers: ["Server Components by default", "what needs a Client Component", "RSC Payload, prerendered HTML, and hydration"],
    },
    {
      id: "2.2",
      title: "Draw the \"use client\" boundary",
      covers: ["directive placement", "the client module graph", "wrapping third-party client components"],
    },
    {
      id: "2.3",
      title: "Compose across the boundary safely",
      covers: ["Server Components as `children` of Client Components", "serializable props", "streaming promises with `use`", "context providers", "`server-only` and `NEXT_PUBLIC_` env vars"],
    },
  ],

  lessons: [
    {
      id: "d2-b-where",
      level: "beginner",
      task: "2.1",
      title: "Two places your code can run",
      check: ["next-b2-01", "next-b2-02"],
      visual: (
        <Tiles
          tiles={[
            { icon: "🍳", title: "Server (the kitchen)", text: "Prepares the page. It can read databases and keep secrets, because visitors never see its code.", color: "#34d399" },
            { icon: "🍽️", title: "Browser (the table)", text: "Shows the page and reacts to clicks and typing.", color: "#61dafb" },
          ]}
        />
      ),
      points: [
        "Your code can run in two places. The **server** is the computer that hosts your site. The **browser** is the app your visitor uses, like Chrome or Safari.",
        "Think of a restaurant. The kitchen is the server: the food is prepared there and the storeroom keys stay there. The table is the browser, where the guest eats and asks for things.",
        "In Next.js, components run on the server unless you say otherwise. These are called **Server Components**.",
        "Server Components can read a database or use a secret key safely, because their code is never sent to the visitor.",
      ],
      tip: "Not sure where something should run? Ask whether it needs clicks, typing or the browser window. If it doesn't, it can stay on the server.",
    },
    {
      id: "d2-b-client",
      level: "beginner",
      task: "2.2",
      title: "Making things clickable with \"use client\"",
      check: ["next-b2-03", "next-b2-04"],
      visual: (
        <CodeBlock
          lang="tsx"
          caption="The first line turns this file into a Client Component, so the button can count clicks."
          code={`"use client";

import { useState } from "react";

export default function LikeButton() {
  const [likes, setLikes] = useState(0);
  return <button onClick={() => setLikes(likes + 1)}>👍 {likes}</button>;
}`}
        />
      ),
      points: [
        "Anything interactive, like a button that counts clicks, needs code running in the browser. That's a **Client Component**.",
        "You make one by writing `\"use client\"` as the very first line of the file.",
        "You need it for state (`useState`), event handlers like `onClick`, and browser features like `window`.",
        "Keep these components small. A page can stay on the server and include just one small clickable button from a client file.",
      ],
      tip: "If you see an error saying a hook only works in a Client Component, you've probably forgotten `\"use client\"` at the top of the file.",
    },
    {
      id: "d2-default-server",
      level: "junior",
      task: "2.1",
      title: "Server by default",
      check: ["d2-02", "d2-10"],
      visual: (
        <div className="grid gap-4">
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "🖥️", label: "Server renders", sub: "Server Components → RSC Payload" },
              { icon: "📄", label: "HTML prerendered", sub: "Client Components + payload → HTML" },
              { icon: "👀", label: "Fast preview", sub: "Browser paints non-interactive HTML" },
              { icon: "🧬", label: "Reconcile", sub: "Payload aligns server and client trees" },
              { icon: "💧", label: "Hydrate", sub: "JS attaches handlers to Client Components" },
            ]}
          />
          <ServerClientSorter />
        </div>
      ),
      points: [
        "Pages and layouts are **Server Components** unless the file starts with `\"use client\"`. They run on the server and send the finished result to the browser.",
        "Use **Client Components** for state, event handlers, effects, browser features like `window`, and custom hooks that rely on any of those.",
        "Use Server Components to fetch data close to where it lives, keep secrets away from the browser, and send less JavaScript to visitors.",
      ],
      tip: "A clear answer: \"Server Components render on the server and send results, not code. Client Components are the interactive bits. They're still turned into HTML first, then made interactive in the browser.\"",
    },
    {
      id: "d2-use-client",
      level: "intermediate",
      task: "2.2",
      title: "\"use client\" marks a boundary, not a component",
      check: ["d2-05", "d2-18"],
      visual: (
        <div className="grid gap-3">
          <CodeBlock
            lang="tsx"
            caption="The directive goes first, before imports. Everything this file imports joins the client bundle."
            code={`"use client"
import { useState } from "react"
import { Icon } from "./icon"   // now client code too

export function LikeButton({ likes }: { likes: number }) {
  const [n, setN] = useState(likes)
  return <button onClick={() => setN(n + 1)}><Icon /> {n}</button>
}`}
          />
          <CodeBlock
            lang="tsx"
            caption="A third-party component that uses state but ships without the directive: re-export it from your own client file."
            code={`// app/carousel.tsx
"use client"
import { Carousel } from "acme-carousel"
export default Carousel`}
          />
        </div>
      ),
      points: [
        "`\"use client\"` marks the point where code starts going to the browser. Everything that file imports, and every component it renders directly, becomes client code too.",
        "So you only need it on files that a Server Component renders directly, not on every client file.",
        "Put the directive on small interactive pieces near the bottom of the tree, like a single button. That keeps the JavaScript sent to the browser small.",
      ],
      tip: "Use the word \"boundary\" out loud. Interviewers want to hear that the directive marks where the server part of the tree hands over to the browser part.",
    },
    {
      id: "d2-interleave",
      level: "senior",
      task: "2.3",
      title: "Server inside Client: pass it as children",
      check: ["d2-07", "d2-09"],
      visual: (
        <div className="grid gap-3">
          <CodeCompare
            lang="tsx"
            left={{
              title: "Import makes Cart client code",
              code: `// modal.tsx
"use client"
import Cart from "./cart"
export default function Modal() {
  return <dialog><Cart /></dialog>
}`,
            }}
            right={{
              title: "children keeps Cart on the server",
              code: `// page.tsx (Server Component)
import Modal from "./modal"
import Cart from "./cart"
export default function Page() {
  return <Modal><Cart /></Modal>
}`,
            }}
          />
          <Tiles
            cols={2}
            tiles={[
              { icon: "✅", title: "Serializable props", text: "Strings, numbers, plain objects, arrays, Dates, Maps, Sets, promises, Server Actions, JSX.", color: "#34d399" },
              { icon: "⛔", title: "Not serializable", text: "Regular functions, class instances, symbols. Pass data, not behaviour.", color: "#f87171" },
            ]}
          />
        </div>
      ),
      points: [
        "A Server Component passed into a Client Component as `children`, or another prop, still renders on the server. The Client Component just receives the result.",
        "Props going into a Client Component must be **serializable**, which means React can turn them into text to send. Strings, numbers, plain objects and arrays work. Ordinary functions don't.",
        "You can pass a promise you haven't awaited to a Client Component, and unwrap it there with React's `use` inside `<Suspense>`.",
      ],
      tip: "Asked whether a Client Component can render a Server Component? Not by importing it. But yes, if a Server parent passes it in through `children` or another prop.",
    },
    {
      id: "d2-env",
      level: "intermediate",
      task: "2.3",
      title: "Keep secrets on the server",
      check: ["d2-13", "d2-14"],
      visual: (
        <CodeCompare
          lang="ts"
          left={{
            title: "Leaks or breaks in the browser",
            code: `// lib/data.ts (imported by a client file)
export async function getData() {
  return fetch(API, {
    headers: { authorization: process.env.API_KEY },
  })
}`,
          }}
          right={{
            title: "Build fails if a client imports it",
            code: `// lib/data.ts
import "server-only"

export async function getData() {
  return fetch(API, {
    headers: { authorization: process.env.API_KEY },
  })
}`,
          }}
        />
      ),
      points: [
        "**Environment variables** hold settings like API keys. Only ones starting with `NEXT_PUBLIC_` are copied into browser code. In the browser, the rest are empty strings.",
        "Adding `import \"server-only\"` to a file means that if client code ever imports it by mistake, the build fails.",
        "Place context providers as deep in the tree as you can, wrapping only `{children}`. More of the page then stays as server UI.",
      ],
      tip: "Bring up `server-only` without being asked when you talk about data access code. It shows you think about accidental leaks, not just the case where everything goes right.",
    },
  ],

  questions: [
    {
      id: "next-b2-01",
      domain: "d2",
      lesson: "d2-b-where",
      level: "beginner",
      prompt: "In the Next.js `app` folder, where does a component run if you don't add anything special?",
      options: ["On the server", "Only in the browser", "Inside the database"],
      answer: [0],
      explanation: "Components in the `app` folder are Server Components by default. They run on the server, and the visitor receives the finished result.",
    },
    {
      id: "next-b2-02",
      domain: "d2",
      lesson: "d2-b-where",
      level: "beginner",
      prompt: "Why is a Server Component a safe place to use a secret API key?",
      options: ["Its code isn't sent to the visitor's browser, so they can't see the key", "The server scrambles every word on the page", "Browsers delete secret keys automatically", "It isn't safe: keys are always visible to visitors"],
      answer: [0],
      explanation: "A Server Component runs on your server and only sends its result to the browser. The code, and any key inside it, stays behind, like the storeroom keys staying in the kitchen.",
    },
    {
      id: "next-b2-03",
      type: "fill",
      domain: "d2",
      lesson: "d2-b-client",
      level: "beginner",
      prompt: "Fill the gap so this file becomes a Client Component.",
      code: `{{1}}

import { useState } from "react";

export default function Toggle() {
  const [on, setOn] = useState(false);
  return <button onClick={() => setOn(!on)}>{on ? "On" : "Off"}</button>;
}`,
      codeLang: "tsx",
      blanks: [{ options: ["\"use client\";", "\"use server\";", "import client;", "\"client only\";"], answer: 0 }],
      explanation: "`\"use client\"` on the first line tells Next.js this file runs in the browser too. This component uses `useState` and `onClick`, so it needs to.",
    },
    {
      id: "next-b2-04",
      domain: "d2",
      lesson: "d2-b-client",
      level: "beginner",
      prompt: "Which of these components needs `\"use client\"`?",
      options: ["A button that counts clicks with `useState`", "A page that shows a heading and some text", "A component that reads a list of posts from a database"],
      answer: [0],
      explanation: "State and click handlers only work in the browser, so the counting button needs `\"use client\"`. Showing text and reading a database work fine on the server.",
    },
    {
      id: "d2-01",
      level: "junior",
      domain: "d2",
      lesson: "d2-default-server",
      prompt: "`app/page.tsx` has no directive at the top. What kind of component is its default export?",
      options: ["A Server Component", "A Client Component", "A hybrid that runs on both sides", "A Route Handler"],
      answer: [0],
      explanation: "In the App Router, layouts and pages are Server Components unless you say otherwise. You switch a file to the client with `\"use client\"`.",
    },
    {
      id: "d2-02",
      level: "junior",
      domain: "d2",
      lesson: "d2-default-server",
      prompt: "Which of these need a Client Component? (Choose three.)",
      options: [
        "A button with `onClick` and `useState`",
        "Logic in `useEffect` that subscribes to window resize",
        "Reading the user's saved theme from `localStorage`",
        "Querying the database with a secret key",
        "Rendering static marketing copy",
      ],
      answer: [0, 1, 2],
      explanation: "State, event handlers, effects, and browser APIs need the client. Database queries with secrets and static markup are exactly what Server Components are for.",
    },
    {
      id: "d2-03",
      level: "junior",
      domain: "d2",
      lesson: "d2-default-server",
      type: "lines",
      prompt: "This page errors because it is a Server Component. Tap the line that calls a hook that only works in Client Components.",
      code: `// app/counter/page.tsx
import { useState } from "react"
export default function Page() {
  const [count, setCount] = useState(0)
  return <p>{count}</p>
}`,
      codeLang: "tsx",
      answer: [4],
      explanation: "`useState` is a client-only hook. Move the interactive part into a file that starts with `\"use client\"` and render it from the page.",
    },
    {
      id: "d2-04",
      level: "junior",
      domain: "d2",
      lesson: "d2-use-client",
      prompt: "Where does the `\"use client\"` directive go?",
      options: [
        "At the very top of the file, before any imports",
        "Inside the component function, as its first statement",
        "Above each component in a file that uses state",
        "In `next.config.ts`, listing client files",
      ],
      answer: [0],
      explanation: "The directive applies to the whole module and must come before imports. It can't be placed inside a component or function.",
    },
    {
      id: "d2-05",
      level: "intermediate",
      domain: "d2",
      lesson: "d2-use-client",
      prompt: "`menu.tsx` and `icon.tsx` have no directive. Which components end up in the client bundle?",
      code: `// app/ui/toolbar.tsx
"use client"
import { Menu } from "./menu"
import { Icon } from "./icon"
export function Toolbar() {
  return <nav><Menu /><Icon /></nav>
}`,
      codeLang: "tsx",
      options: [
        "`Toolbar`, `Menu`, and `Icon`: everything a client entry imports joins the client graph",
        "Only `Toolbar`",
        "`Toolbar`, plus `Menu` and `Icon` only if they use state",
        "None of them until hydration finishes",
      ],
      answer: [0],
      explanation: "Once a file is marked `\"use client\"`, all of its imports and the components it renders directly are part of the client bundle. That's why you don't repeat the directive everywhere.",
    },
    {
      id: "d2-06",
      level: "senior",
      domain: "d2",
      lesson: "d2-interleave",
      type: "lines",
      prompt: "`LikeButton` is a Client Component. This Server Component page fails to render. Tap the buggy line.",
      code: `// app/page.tsx
import { LikeButton } from "./like-button"
export default async function Page() {
  const post = await getPost()
  return (
    <LikeButton
      likes={post.likes}
      onLike={() => console.log("liked")}
    />
  )
}`,
      codeLang: "tsx",
      answer: [8],
      explanation: "Props from a Server to a Client Component must be serializable, and a regular function isn't. Handle the click inside the Client Component, or pass a Server Action.",
    },
    {
      id: "d2-07",
      level: "intermediate",
      domain: "d2",
      lesson: "d2-interleave",
      prompt: "A server-rendered `<Cart>` (it queries the database) must appear inside a Client `<Modal>` that toggles open. What's the best pattern?",
      options: [
        "Render `<Modal><Cart /></Modal>` from a Server Component, so `Cart` is passed as `children`",
        "Import `Cart` inside `modal.tsx` and render it there",
        "Add `\"use client\"` to `cart.tsx`",
        "Give `Modal` a `useEffect` that fetches the cart HTML",
      ],
      answer: [0],
      explanation: "Passing a Server Component through `children` lets it render on the server while the Client Component controls visibility. Importing it into the client file would pull it into the client graph.",
    },
    {
      id: "d2-08",
      level: "senior",
      domain: "d2",
      lesson: "d2-interleave",
      prompt: "`Modal` starts with `\"use client\"` and `Cart` is an async Server Component. Where does `Cart` render?",
      code: `// app/page.tsx
import Modal from "./modal"
import Cart from "./cart"
export default function Page() {
  return <Modal><Cart /></Modal>
}`,
      codeLang: "tsx",
      options: [
        "On the server; `Modal` receives its rendered output as `children`",
        "In the browser, because its parent is a Client Component",
        "Twice: once on each side",
        "Nowhere: this is a build error",
      ],
      answer: [0],
      explanation: "The page is a Server Component, so it renders `Cart` and passes the result into `Modal`'s `children` slot. Being visually nested in a Client Component doesn't make it client code.",
    },
    {
      id: "d2-09",
      level: "intermediate",
      domain: "d2",
      lesson: "d2-interleave",
      prompt: "Which values can a Server Component pass as props to a Client Component? (Choose two.)",
      options: ["`{ id: 1, tags: [\"a\"] }`", "`new Date()`", "`new User(\"ada\")` (a class instance)", "`() => alert(\"hi\")`", "`Symbol(\"x\")`"],
      answer: [0, 1],
      explanation: "Plain objects, arrays, primitives, and Dates serialize. Class instances, regular functions, and unregistered symbols do not.",
    },
    {
      id: "d2-10",
      level: "senior",
      domain: "d2",
      lesson: "d2-default-server",
      type: "order",
      prompt: "Put the first page load in order.",
      items: [
        "Server Components render into the RSC Payload",
        "Client Components and the payload are used to prerender HTML",
        "The browser shows the HTML as a fast, non-interactive preview",
        "The RSC Payload reconciles the server and client trees",
        "JavaScript hydrates Client Components so they respond to input",
      ],
      explanation: "This is the sequence the Next.js docs describe. On later navigations, the RSC Payload is prefetched and Client Components render entirely on the client.",
    },
    {
      id: "d2-11",
      level: "junior",
      domain: "d2",
      lesson: "d2-default-server",
      prompt: "What is hydration?",
      options: [
        "React attaching event handlers to server-rendered HTML so it becomes interactive",
        "Re-fetching all data in the browser after load",
        "Converting Client Components into Server Components",
        "Downloading the RSC Payload for the next route",
      ],
      answer: [0],
      explanation: "The HTML arrives first, so visitors see the page quickly. Then **hydration** connects React and the event handlers, which makes Client Components respond to clicks.",
    },
    {
      id: "d2-12",
      level: "intermediate",
      domain: "d2",
      lesson: "d2-env",
      type: "lines",
      prompt: "In the browser this requests `?key=` with nothing after it (and a real secret here would be a leak). Tap the line with the problem.",
      code: `"use client"
import { useEffect, useState } from "react"
export function Weather() {
  const [data, setData] = useState(null)
  useEffect(() => {
    fetch(\`/api/weather?key=\${process.env.WEATHER_KEY}\`)
      .then((r) => r.json()).then(setData)
  }, [])
  return <pre>{JSON.stringify(data)}</pre>
}`,
      codeLang: "tsx",
      answer: [6],
      explanation: "Env vars without the `NEXT_PUBLIC_` prefix are not exposed to the browser; Next.js replaces them with an empty string. Keep the key on the server and call the weather API from a Route Handler or Server Component.",
    },
    {
      id: "d2-13",
      level: "intermediate",
      domain: "d2",
      lesson: "d2-env",
      prompt: "How do you make the build fail if `lib/db.ts` is ever imported into a Client Component?",
      options: [
        "Add `import \"server-only\"` at the top of `lib/db.ts`",
        "Add `\"use server\"` at the top of `lib/db.ts`",
        "Name the file `db.server.ts`",
        "Set `serverOnly: true` in `next.config.ts`",
      ],
      answer: [0],
      explanation: "The `server-only` import produces a build-time error in client code. `\"use server\"` is different: it turns exports into Server Functions callable from the client.",
    },
    {
      id: "d2-14",
      level: "junior",
      domain: "d2",
      lesson: "d2-env",
      prompt: "Which environment variable is inlined into the browser bundle at build time?",
      options: ["`NEXT_PUBLIC_ANALYTICS_ID`", "`DATABASE_URL`", "`API_KEY`", "`PUBLIC_STRIPE_KEY`"],
      answer: [0],
      explanation: "Only the `NEXT_PUBLIC_` prefix tells Next.js to inline a value into client JavaScript. Everything else stays server-only.",
    },
    {
      id: "d2-15",
      level: "staff",
      domain: "d2",
      lesson: "d2-env",
      prompt: "`ThemeProvider` starts with `\"use client\"`. Does wrapping `{children}` in it turn every page into a Client Component?",
      code: `// app/layout.tsx
import ThemeProvider from "./theme-provider"
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  )
}`,
      codeLang: "tsx",
      options: [
        "No. `children` are rendered on the server and passed through; only the provider is client code",
        "Yes. Every descendant of a Client Component becomes client code",
        "Yes, unless each page re-declares `\"use server\"`",
        "No, because providers are ignored in layouts",
      ],
      answer: [0],
      explanation: "Server Components passed as `children` stay on the server. Client Components below the provider can read the context.",
    },
    {
      id: "d2-16",
      level: "intermediate",
      domain: "d2",
      lesson: "d2-use-client",
      prompt: "A package's `<Carousel>` uses `useState` but ships without `\"use client\"`. Rendering it directly in a Server Component errors. What's the usual fix?",
      code: `// app/page.tsx (Server Component)
import { Carousel } from "acme-carousel" // uses useState, no directive
export default function Page() {
  return <Carousel images={["/a.png", "/b.png"]} />
}`,
      codeLang: "tsx",
      options: [
        "Re-export it from your own file that starts with `\"use client\"`",
        "Add `\"use server\"` to the page",
        "Wrap it in `<Suspense>`",
        "Load it with `generateStaticParams`",
      ],
      answer: [0],
      explanation: "A tiny wrapper file with the directive marks the boundary for Next.js. Then Server Components can render the carousel.",
    },
    {
      id: "d2-17",
      level: "intermediate",
      domain: "d2",
      lesson: "d2-default-server",
      type: "match",
      prompt: "Match each term to its meaning.",
      pairs: [
        ["RSC Payload", "Serialized Server Component output, client placeholders, and props"],
        ["Hydration", "Attaching event handlers to server-rendered HTML"],
        ["`\"use client\"`", "Marks where the client module graph begins"],
        ["`server-only`", "Build error if a module is imported into client code"],
        ["`NEXT_PUBLIC_`", "Prefix that inlines an env var into the browser bundle"],
      ],
      explanation: "These five ideas are the words people use for the server and client split. Using them accurately is a quick sign you've really worked with the App Router.",
    },
    {
      id: "d2-18",
      level: "intermediate",
      domain: "d2",
      lesson: "d2-use-client",
      type: "lines",
      prompt: "This toggle fails to build. Tap the buggy line.",
      code: `import { useState } from "react"
"use client"
export default function Toggle() {
  const [on, setOn] = useState(false)
  return <button onClick={() => setOn(!on)}>{on ? "On" : "Off"}</button>
}`,
      codeLang: "tsx",
      answer: [2],
      explanation: "A directive only counts at the very top of the module, before any imports. Below an import it isn't a valid directive, so Next.js reports an error instead of treating the file as client code. Move `\"use client\"` to line 1.",
    },
    {
      id: "d2-19",
      level: "junior",
      domain: "d2",
      lesson: "d2-default-server",
      prompt: "Why fetch data in a Server Component rather than in a browser `useEffect`? (Choose two.)",
      options: [
        "The query runs close to the data source and secrets stay on the server",
        "Less JavaScript ships to the browser",
        "Server Components can attach `onClick` handlers directly",
        "Server Components re-render on every keystroke",
        "It makes the component interactive sooner",
      ],
      answer: [0, 1],
      explanation: "Server Components fetch near the source, keep credentials private, and send rendered results instead of code. Interactivity still needs Client Components.",
    },
    {
      id: "d2-20",
      level: "senior",
      domain: "d2",
      lesson: "d2-interleave",
      prompt: "`Posts` is a Client Component. What happens when this page loads?",
      code: `// app/page.tsx
export default function Page() {
  const posts = getPosts() // not awaited
  return (
    <Suspense fallback={<p>Loading…</p>}>
      <Posts posts={posts} />
    </Suspense>
  )
}
// app/ui/posts.tsx ("use client")
export default function Posts({ posts }: { posts: Promise<Post[]> }) {
  const all = use(posts)
  return <ul>{all.map((p) => <li key={p.id}>{p.title}</li>)}</ul>
}`,
      codeLang: "tsx",
      options: [
        "\"Loading…\" shows first; the promise streams to the client and `use` unwraps it, swapping in the list",
        "Build error: promises can't be passed as props",
        "`use` starts a new fetch in the browser",
        "The whole page waits for `getPosts()` before sending anything",
      ],
      answer: [0],
      explanation: "Promises are serializable props. `use` suspends `Posts` until the data arrives, and the nearest `<Suspense>` shows its fallback meanwhile.",
    },
    {
      id: "d2-21",
      level: "staff",
      domain: "d2",
      lesson: "d2-env",
      prompt: "Code reviews keep catching raw database rows (password hashes, internal flags) passed as props to Client Components. Which architecture fixes this for the whole team?",
      options: [
        "A server-only Data Access Layer that checks auth and returns minimal DTOs; components only ever receive those",
        "Mark every component `\"use client\"` so props are visible in DevTools",
        "Fetch all data in the browser instead",
        "Strip sensitive fields with CSS before rendering",
      ],
      answer: [0],
      explanation: "The Next.js data security guidance recommends a Data Access Layer for new projects: one place that authorizes requests and returns safe Data Transfer Objects, guarded with `server-only`.",
    },
    {
      id: "d2-22",
      level: "staff",
      domain: "d2",
      lesson: "d2-use-client",
      prompt: "Your company's component library has stateful components, and every product team wraps them in their own `\"use client\"` files before using them in Server Components. What should the library team do?",
      options: [
        "Add `\"use client\"` to the library entry points that rely on client features (and make sure the bundler keeps the directive)",
        "Tell teams to convert their pages to Client Components",
        "Remove all state from the library",
        "Publish a separate copy of each component for Server Components",
      ],
      answer: [0],
      explanation: "When a library marks its client entry points, consumers can import them straight into Server Components. Some bundlers strip directives, so the library's build must preserve them.",
    },
  ],

  cards: [
    { id: "c2-useclient", domain: "d2", kind: "service", term: "\"use client\"", definition: "Directive at the top of a file that marks the entry to the client module graph." },
    { id: "c2-serveronly", domain: "d2", kind: "service", term: "server-only", definition: "Import it in a module to make any client import of that module a build error." },
    { id: "c2-public", domain: "d2", kind: "service", term: "NEXT_PUBLIC_ prefix", definition: "Env vars with this prefix are inlined into browser JavaScript at build time. Others stay server-only." },
    { id: "c2-use", domain: "d2", kind: "service", term: "use (React)", definition: "Unwraps a promise (or context) during render, suspending until it resolves. Pairs with a server-passed promise." },
    { id: "c2-server", domain: "d2", kind: "concept", term: "Server Component", definition: "The App Router default. Renders on the server, can be async, fetches data, and ships no component JavaScript." },
    { id: "c2-client", domain: "d2", kind: "concept", term: "Client Component", definition: "Prerendered to HTML, then hydrated. Needed for state, event handlers, effects, and browser APIs." },
    { id: "c2-rsc", domain: "d2", kind: "concept", term: "RSC Payload", definition: "A compact text version of the rendered tree that the server sends: Server Component output, placeholders for Client Components, and their props." },
    { id: "c2-hydration", domain: "d2", kind: "concept", term: "Hydration", definition: "React attaching event handlers to server-rendered HTML so Client Components become interactive." },
    { id: "c2-serializable", domain: "d2", kind: "concept", term: "Serializable props", definition: "Props sent from server to client must be turnable into text: strings, numbers, plain objects, arrays, Dates, promises, Server Actions and JSX." },
    { id: "c2-interleave", domain: "d2", kind: "concept", term: "Interleaving", definition: "Passing Server Components into Client Components as `children` or other props. They still render on the server." },
    { id: "c2-graph", domain: "d2", kind: "concept", term: "Client module graph", definition: "Everything a \"use client\" file imports or directly renders becomes client code, without repeating the directive." },
  ],

  challenges: [
    {
      id: "ch-next-sorter",
      domain: "d2",
      lesson: "d2-default-server",
      title: "Sort the components",
      goal: "Put all 10 components on the right side of the boundary and press \"Check my sort\".",
      hint: "Ask one question per card: does it need state, events, effects, or a browser API? If not, it belongs on the server.",
      takeaway: "Default to Server Components. Only interactive leaves go client-side, which keeps heavy libraries and secrets off the browser.",
      render: (onSolved) => <ServerClientSorter goal="sortAll" onSolved={onSolved} />,
    },
  ],
});
