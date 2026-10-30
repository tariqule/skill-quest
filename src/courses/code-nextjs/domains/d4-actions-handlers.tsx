import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";

/** Domain 4: Server Actions, Route Handlers, proxy.ts, and metadata / images / fonts. */
export default defineDomain({
  domain: {
    id: "d4",
    number: 4,
    name: "Mutations, handlers, and the request edge",
    world: "The Action Forge",
    weight: 20,
    emoji: "⚒️",
    color: "#f97316",
    summary: "Changing data with Server Actions, building your own API with Route Handlers, checking requests in proxy.ts, and getting metadata, images and fonts right.",
  },

  tasks: [
    {
      id: "4.1",
      title: "Mutate data with Server Actions",
      covers: ["`\"use server\"`", "forms and `formAction`", "`useActionState` and expected errors", "auth inside every action", "cookies in actions"],
    },
    {
      id: "4.2",
      title: "Build Route Handlers",
      covers: ["`route.ts` and HTTP method exports", "`NextRequest`, `RouteContext`, and async `params`", "caching of `GET` handlers"],
    },
    {
      id: "4.3",
      title: "Intercept requests with proxy.ts",
      covers: ["`proxy.ts` (formerly middleware)", "`matcher`", "redirects, rewrites, headers", "what proxy is not for"],
    },
    {
      id: "4.4",
      title: "Optimise metadata, images, and fonts",
      covers: ["`metadata` and `generateMetadata`", "metadata files", "`next/image`", "`next/font`"],
    },
  ],

  lessons: [
    {
      id: "d4-b-forms",
      level: "beginner",
      task: "4.1",
      title: "Saving what users send",
      check: ["next-b4-01", "next-b4-02"],
      visual: (
        <CodeBlock
          lang="tsx"
          caption="The form calls a function that runs on the server."
          code={`export default function Page() {
  async function subscribe(formData: FormData) {
    "use server";
    const email = formData.get("email");
    // save the email in your database here
  }

  return (
    <form action={subscribe}>
      <input name="email" />
      <button>Subscribe</button>
    </form>
  );
}`}
        />
      ),
      points: [
        "A **mutation** is any change to your data, like saving a new comment or deleting a post.",
        "Next.js lets a form call a function that runs on the server. This is a **Server Action**, and you mark it with `\"use server\"`.",
        "It's like a post box. The visitor drops their letter in by filling in the form, and the server takes care of the rest.",
        "The function receives the form's fields as `FormData`. `formData.get(\"email\")` reads the field named `email`.",
      ],
      tip: "Anyone can send data to a Server Action, not just your form. So always check who the user is, and whether the data makes sense, inside the action.",
    },
    {
      id: "d4-b-api",
      level: "beginner",
      task: "4.2",
      title: "Your own API with Route Handlers",
      check: ["next-b4-03", "next-b4-04"],
      visual: (
        <div className="grid gap-3">
          <Flow
            color="#a78bfa"
            steps={[
              { icon: "📨", label: "Request", sub: "GET /api/hello" },
              { icon: "📄", label: "route.ts", sub: "Your GET function runs" },
              { icon: "📦", label: "Response", sub: "{ \"message\": \"Hello\" }" },
            ]}
          />
          <CodeBlock
            lang="ts"
            code={`// app/api/hello/route.ts
export async function GET() {
  return Response.json({ message: "Hello" });
}`}
          />
        </div>
      ),
      points: [
        "Sometimes other programs need data from your app, like a mobile app or another company's service. They ask for it over HTTP, the way computers talk on the web.",
        "A **Route Handler** is a file named `route.ts` that answers those requests. `app/api/hello/route.ts` answers at `/api/hello`.",
        "You export a function named after the HTTP method. `GET` handles reading data, and `POST` handles sending new data.",
        "Think of a shop's service hatch. People don't come in and browse. They ask for something at the hatch and you hand it over.",
      ],
      tip: "For forms on your own pages, Server Actions are usually simpler. Route Handlers are for everything else that talks HTTP.",
    },
    {
      id: "d4-actions",
      level: "intermediate",
      task: "4.1",
      title: "Server Actions: mutations without an API",
      check: ["d4-04", "d4-05"],
      visual: (
        <CodeCompare
          lang="tsx"
          left={{
            title: "app/actions.ts",
            code: `"use server"
import { updateTag } from "next/cache"

export async function addTodo(prev: State, formData: FormData) {
  const session = await auth()
  if (!session) return { error: "Sign in first" }
  const text = String(formData.get("text") ?? "")
  if (!text) return { error: "Text is required" }
  await db.todo.create({ data: { text, userId: session.userId } })
  updateTag("todos")
  return { error: "" }
}`,
          }}
          right={{
            title: "app/ui/todo-form.tsx",
            code: `"use client"
import { useActionState } from "react"
import { addTodo } from "../actions"

export function TodoForm() {
  const [state, action, pending] =
    useActionState(addTodo, { error: "" })
  return (
    <form action={action}>
      <input name="text" />
      <button disabled={pending}>Add</button>
      <p>{state.error}</p>
    </form>
  )
}`,
          }}
        />
      ),
      points: [
        "`\"use server\"` at the top of an async function, inside a Server Component, or at the top of a file, marks **Server Functions**. Client Components import them from a `\"use server\"` file.",
        "Actions are called with a POST request, and anyone can send one directly. So check who the user is, what they're allowed to do, and whether the input is valid, inside every action.",
        "Return expected errors, like \"name too short\", as values, and show them with `useActionState`. Throw only for real bugs.",
        "Set or delete cookies in actions or Route Handlers, never while a Server Component is rendering.",
      ],
      tip: "Interviewers often ask whether hiding the delete button is enough. It isn't: the action is a public POST endpoint, so check the session and who owns the item inside it.",
    },
    {
      id: "d4-route-handlers",
      level: "junior",
      task: "4.2",
      title: "Route Handlers: your HTTP endpoints",
      check: ["d4-08", "d4-09"],
      visual: (
        <div className="grid gap-3">
          <CodeBlock
            lang="ts"
            code={`// app/api/users/[id]/route.ts
import type { NextRequest } from "next/server"

export async function GET(req: NextRequest, ctx: RouteContext<"/api/users/[id]">) {
  const { id } = await ctx.params
  const fields = req.nextUrl.searchParams.get("fields")
  return Response.json(await getUser(id, fields))
}`}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "📮", title: "Named exports", text: "`GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `HEAD`, `OPTIONS`. Others get 405.", color: "#f97316" },
              { icon: "🚧", title: "No page beside it", text: "A `route.ts` can't share a segment with `page.tsx`.", color: "#f87171" },
              { icon: "🧊", title: "Prerenderable GET", text: "With Cache Components, a `GET` that reads no request data is prerendered.", color: "#22d3ee" },
            ]}
          />
        </div>
      ),
      points: [
        "Route Handlers use the web's standard `Request` and `Response` objects. `NextRequest` and `NextResponse` add a few extra helpers.",
        "The handler's second argument holds `params`, which is a Promise. `RouteContext<'/path/[id]'>` gives it the right type.",
        "Use them for webhooks, public APIs and other programs that aren't your UI. For changes made from your own pages, use Server Actions.",
      ],
      tip: "A comparison worth having ready: Server Actions are for your own forms, and one round trip brings back both UI and data. Route Handlers are for anything else that speaks HTTP.",
    },
    {
      id: "d4-proxy",
      level: "intermediate",
      task: "4.3",
      title: "proxy.ts: before the request completes",
      check: ["d4-13", "d4-15"],
      visual: (
        <div className="grid gap-3">
          <Flow
            color="#f97316"
            steps={[
              { icon: "📨", label: "Request", sub: "Matches the proxy `matcher`" },
              { icon: "🛂", label: "proxy()", sub: "Redirect, rewrite, set headers, or respond" },
              { icon: "🧭", label: "Routing", sub: "Pages, Route Handlers, static files" },
            ]}
          />
          <CodeBlock
            lang="ts"
            code={`// proxy.ts (project root, next to app/)
import { NextResponse, type NextRequest } from "next/server"

export function proxy(request: NextRequest) {
  if (!request.cookies.has("session")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}

export const config = { matcher: "/dashboard/:path*" }`}
          />
        </div>
      ),
      points: [
        "Next.js 16 renamed Middleware to **Proxy**. You write a `proxy.ts` file that exports a `proxy` function, or a default export. It does the same job as before.",
        "Proxy runs on the Node.js runtime, and you can't change that with the `runtime` option.",
        "Keep it fast. Use it for quick checks, redirects, rewrites and headers, not for slow data fetching or full permission checks.",
        "For redirects that never change, use `redirects` in `next.config.ts` instead.",
      ],
      tip: "If an interviewer says \"middleware\", you can answer: \"In Next.js 16 that's `proxy.ts`. I'd keep it to cheap checks and do the real auth next to the data.\"",
    },
    {
      id: "d4-polish",
      level: "junior",
      task: "4.4",
      title: "Metadata, images, and fonts",
      check: ["d4-18", "d4-21"],
      visual: (
        <CodeBlock
          lang="tsx"
          code={`import type { Metadata } from "next"
import Image from "next/image"
import { Geist } from "next/font/google"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = { title: "Acme", description: "Rockets" }

export default function Page() {
  return (
    <main className={geist.className}>
      <Image src="/hero.png" alt="Rocket" width={1200} height={600} preload />
    </main>
  )
}`}
        />
      ),
      points: [
        "**Metadata** is the page title, description and other `<head>` details. The `metadata` and `generateMetadata` exports only work in Server Components, in layouts and pages.",
        "`next/image` serves images at the right size and in modern formats. It loads them only as they come into view, and saves their space so the page doesn't jump.",
        "Images from other sites need `width` and `height`, or `fill`, plus a matching entry in `images.remotePatterns`.",
        "`next/font` serves fonts from your own site, so the browser never has to ask Google for them.",
      ],
      tip: "Link these to Core Web Vitals, Google's page speed scores. Images and fonts are the usual cause of content jumping around (CLS) and a slow main image or heading (LCP).",
    },
  ],

  questions: [
    {
      id: "next-b4-01",
      domain: "d4",
      lesson: "d4-b-forms",
      level: "beginner",
      prompt: "Which line marks a function as a Server Action?",
      options: ["`\"use server\"`", "`\"use client\"`", "`export default`", "`import { useState } from \"react\"`"],
      answer: [0],
      explanation: "`\"use server\"` tells Next.js the function runs on the server, so a form can call it to save data. `\"use client\"` does the opposite job: it marks code that runs in the browser.",
    },
    {
      id: "next-b4-02",
      domain: "d4",
      lesson: "d4-b-forms",
      level: "beginner",
      prompt: "In a Server Action, what does `formData.get(\"email\")` give you?",
      options: ["The value the user typed into the field named `email`", "The email address of the site's owner", "A list of every email in the database", "Nothing, because forms can't send email fields"],
      answer: [0],
      explanation: "`FormData` holds every named field in the form. `get(\"email\")` looks up the input with `name=\"email\"` and returns what the user typed there.",
    },
    {
      id: "next-b4-03",
      domain: "d4",
      lesson: "d4-b-api",
      level: "beginner",
      prompt: "Which file answers requests at `/api/hello`?",
      options: ["`app/api/hello/route.ts`", "`app/api/hello/page.tsx`", "`app/hello/api.ts`"],
      answer: [0],
      explanation: "The folders `api/hello` give the address, and a file named `route.ts` makes it answer HTTP requests with data. A `page.tsx` there would show a web page instead.",
    },
    {
      id: "next-b4-04",
      type: "fill",
      domain: "d4",
      lesson: "d4-b-api",
      level: "beginner",
      prompt: "Fill the gap so this Route Handler answers GET requests.",
      code: `export async function {{1}}() {
  return Response.json({ message: "Hello" });
}`,
      codeLang: "ts",
      blanks: [{ options: ["GET", "get", "fetch", "handler"], answer: 0 }],
      explanation: "Next.js matches the function's name to the HTTP method, written in capitals. Export `GET` to answer reads, and `POST` to accept new data.",
    },
    {
      id: "d4-01",
      level: "junior",
      domain: "d4",
      lesson: "d4-actions",
      prompt: "Which HTTP method invokes a Server Action?",
      options: ["`POST`", "`GET`", "`PUT`", "Any method the form specifies"],
      answer: [0],
      explanation: "Behind the scenes, Next.js always calls actions with a POST request, and only a POST request can call them.",
    },
    {
      id: "d4-02",
      level: "senior",
      domain: "d4",
      lesson: "d4-actions",
      type: "lines",
      prompt: "The delete button only renders for admins, yet anyone can delete any post. Tap the line that runs without an authorization check.",
      code: `"use server"
import { updateTag } from "next/cache"
import { db } from "@/lib/db"
export async function deletePost(formData: FormData) {
  const id = String(formData.get("id"))
  await db.post.delete({ where: { id } })
  updateTag("posts")
}`,
      codeLang: "ts",
      answer: [6],
      explanation: "Server Actions are reachable with a direct POST, so hiding the button isn't a security boundary. Verify the session and ownership before the delete.",
    },
    {
      id: "d4-03",
      level: "intermediate",
      domain: "d4",
      lesson: "d4-actions",
      prompt: "What signature must `createPost` have for this form?",
      code: `"use client"
import { useActionState } from "react"
import { createPost } from "./actions"
export function Form() {
  const [state, formAction, pending] = useActionState(createPost, { message: "" })
  return (
    <form action={formAction}>
      <input name="title" />
      <button disabled={pending}>Save</button>
      <p>{state.message}</p>
    </form>
  )
}`,
      codeLang: "tsx",
      options: [
        "`async (prevState, formData) => newState`",
        "`async (formData) => void`",
        "`(event: FormEvent) => void`",
        "`async (state) => state` with no form data",
      ],
      answer: [0],
      explanation: "With `useActionState`, the action receives the previous state first and the `FormData` second, and its return value becomes the new `state`.",
    },
    {
      id: "d4-04",
      level: "intermediate",
      domain: "d4",
      lesson: "d4-actions",
      prompt: "How should a Server Action report \"Title is required\" back to the form?",
      options: [
        "Return it as a value, e.g. `{ message }`, and render it from `useActionState`'s state",
        "Throw an `Error` so `error.tsx` shows it",
        "Log it with `console.error` on the server",
        "Call `redirect(\"/error\")`",
      ],
      answer: [0],
      explanation: "A failed form check is an expected error, so return it as a value. Thrown errors are for bugs you didn't expect, and they end up in error boundaries.",
    },
    {
      id: "d4-05",
      level: "intermediate",
      domain: "d4",
      lesson: "d4-actions",
      prompt: "Which statements about Server Actions are true? (Choose two.)",
      options: [
        "They can be called by direct POST requests, so each one must check auth",
        "Forms in Server Components that use them work before JavaScript loads",
        "You can define one inline inside a Client Component",
        "They run in the browser after hydration",
        "They use GET so responses can be cached",
      ],
      answer: [0, 1],
      explanation: "Actions are public POST endpoints that support progressive enhancement. They can't be defined in Client Components, but Client Components can import them from a `\"use server\"` file.",
    },
    {
      id: "d4-06",
      level: "junior",
      domain: "d4",
      lesson: "d4-actions",
      type: "order",
      prompt: "Arrange the lines of this Server Action file in a working, safe order.",
      items: [
        "`\"use server\"`",
        "`import { updateTag } from \"next/cache\"`",
        "`export async function addTodo(formData: FormData) {`",
        "`  const session = await auth()`",
        "`  if (!session) throw new Error(\"Unauthorized\")`",
        "`  await db.todo.create({ data: { text: formData.get(\"text\") } })`",
        "`  updateTag(\"todos\")`",
      ],
      explanation: "The directive comes first, then the imports. Inside the action, check the user, make the change, then expire the cache so the page shows the new todo.",
    },
    {
      id: "d4-07",
      level: "junior",
      domain: "d4",
      lesson: "d4-route-handlers",
      type: "lines",
      prompt: "This handler never runs for `GET /api/hello`. Tap the buggy line.",
      code: `// app/api/hello/route.ts
export default async function handler(request: Request) {
  return Response.json({ hello: "world" })
}`,
      codeLang: "ts",
      answer: [2],
      explanation: "Route Handlers export one function per HTTP method, named in capitals. Rename it to `export async function GET()`.",
    },
    {
      id: "d4-08",
      level: "junior",
      domain: "d4",
      lesson: "d4-route-handlers",
      prompt: "Can `app/api/users/route.ts` and `app/api/users/page.tsx` coexist?",
      code: `app/api/users/
├── page.tsx    // export default function Page() …
└── route.ts    // export async function GET() …`,
      codeLang: "files",
      options: [
        "No: a `route` file can't share a segment with a `page` file",
        "Yes: the page handles GET and the route handles POST",
        "Yes, if the route only exports `POST`",
        "Only inside a route group",
      ],
      answer: [0],
      explanation: "Each `route` or `page` file takes over all HTTP verbs for its URL, so they would conflict. Put the API under another path, such as `app/api/users/route.ts` next to `app/users/page.tsx`.",
    },
    {
      id: "d4-09",
      level: "intermediate",
      domain: "d4",
      lesson: "d4-route-handlers",
      prompt: "A client calls `GET /api/teams/42`. What is the JSON response?",
      code: `// app/api/teams/[team]/route.ts
export async function GET(_req: Request, ctx: RouteContext<"/api/teams/[team]">) {
  const { team } = await ctx.params
  return Response.json({ team, type: typeof team })
}`,
      codeLang: "ts",
      options: ['`{"team":"42","type":"string"}`', '`{"team":42,"type":"number"}`', '`{"team":"[team]","type":"string"}`', "A 500 error: `params` is not a Promise"],
      answer: [0],
      explanation: "`params` is a Promise of strings taken from the URL. Dynamic segment values are always strings (or string arrays for catch-alls).",
    },
    {
      id: "d4-10",
      level: "intermediate",
      domain: "d4",
      lesson: "d4-route-handlers",
      prompt: "What does `GET /api/search?q=hats&q=shoes` return?",
      code: `import type { NextRequest } from "next/server"
export function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get("q")
  return Response.json({ q })
}`,
      codeLang: "ts",
      options: ['`{"q":"hats"}`', '`{"q":"shoes"}`', '`{"q":["hats","shoes"]}`', '`{"q":null}`'],
      answer: [0],
      explanation: "`nextUrl.searchParams` is a standard `URLSearchParams`. `.get()` returns the first value. Use `.getAll(\"q\")` to get every value.",
    },
    {
      id: "d4-11",
      level: "junior",
      domain: "d4",
      lesson: "d4-route-handlers",
      prompt: "A `route.ts` exports only `GET` and `POST`. A client sends `DELETE`. What happens?",
      options: ["Next.js responds `405 Method Not Allowed`", "The `POST` handler runs", "The `GET` handler runs", "The request falls through to `page.tsx`"],
      answer: [0],
      explanation: "Unsupported methods get a 405. If you don't define `OPTIONS`, Next.js implements it and sets the `Allow` header from the methods you export.",
    },
    {
      id: "d4-12",
      level: "senior",
      domain: "d4",
      lesson: "d4-route-handlers",
      prompt: "With Cache Components enabled, what happens to this handler at build time?",
      code: `// app/api/project-info/route.ts
export async function GET() {
  return Response.json({ projectName: "Next.js" })
}`,
      codeLang: "ts",
      options: [
        "It's prerendered, because it touches no request data or uncached I/O",
        "It runs on every request; handlers are never prerendered",
        "The build fails: handlers need `\"use cache\"` in their body",
        "It's cached only after the first POST",
      ],
      answer: [0],
      explanation: "Under Cache Components, `GET` handlers follow the same model as pages. To cache uncached work, put `\"use cache\"` in a helper function, not directly in the handler body.",
    },
    {
      id: "d4-13",
      level: "junior",
      domain: "d4",
      lesson: "d4-proxy",
      prompt: "In Next.js 16, what replaced `middleware.ts`?",
      options: [
        "`proxy.ts`, exporting a `proxy` function; the functionality is the same",
        "`edge.ts`, running only on the Edge runtime",
        "`app/middleware/route.ts`",
        "Nothing: request interception was removed",
      ],
      answer: [0],
      explanation: "Middleware was renamed Proxy because it sits at the edge of the network, in front of your app. Config flags were renamed too, for example `skipProxyUrlNormalize`.",
    },
    {
      id: "d4-14",
      level: "senior",
      domain: "d4",
      lesson: "d4-proxy",
      type: "lines",
      prompt: "This `proxy.ts` throws an error. Tap the buggy line.",
      code: `// proxy.ts
import { NextResponse, type NextRequest } from "next/server"
export const runtime = "edge"
export function proxy(request: NextRequest) {
  if (!request.cookies.has("session")) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
}
export const config = { matcher: "/dashboard/:path*" }`,
      codeLang: "ts",
      answer: [3],
      explanation: "Proxy always runs on the Node.js runtime, and setting the `runtime` option in a proxy file throws. Remove the line.",
    },
    {
      id: "d4-15",
      level: "staff",
      domain: "d4",
      lesson: "d4-proxy",
      prompt: "Which use of `proxy.ts` goes against the Next.js guidance?",
      options: [
        "Querying the database for the user's full profile and permissions on every request",
        "Redirecting to `/login` when no session cookie is present",
        "Rewriting to a variant page for an A/B test",
        "Adding a security header to responses",
      ],
      answer: [0],
      explanation: "Proxy is for fast checks, redirects, rewrites and headers. It isn't meant for slow data fetching or as your full permission check. Do the real checks close to the data.",
    },
    {
      id: "d4-16",
      level: "intermediate",
      domain: "d4",
      lesson: "d4-proxy",
      prompt: "With this config, which request runs the proxy?",
      code: `export const config = {
  matcher: ["/about", "/contact"],
}`,
      codeLang: "ts",
      options: ["`/contact`", "`/blog`", "`/`", "`/api/contact`"],
      answer: [0],
      explanation: "An array matcher lists each path the proxy should run on. Any path not in the list skips the proxy.",
    },
    {
      id: "d4-17",
      level: "intermediate",
      domain: "d4",
      lesson: "d4-polish",
      prompt: "`images.remotePatterns` allows this host, but the component still errors. What's missing?",
      code: `import Image from "next/image"
export function Avatar() {
  return <Image src="https://s3.amazonaws.com/my-bucket/me.png" alt="Me" />
}`,
      codeLang: "tsx",
      options: [
        "`width` and `height` (or `fill`): Next.js can't read a remote image's size at build time",
        "A `\"use client\"` directive",
        "The `preload` prop",
        "A `loader` function",
      ],
      answer: [0],
      explanation: "Imported image files get their size automatically. Images from a URL need `width` and `height` to save their space, or `fill` inside a positioned parent.",
    },
    {
      id: "d4-18",
      level: "junior",
      domain: "d4",
      lesson: "d4-polish",
      prompt: "Which `<Image>` prop is deprecated starting with Next.js 16?",
      options: ["`priority` (replaced by `preload`)", "`fill`", "`sizes`", "`placeholder`"],
      answer: [0],
      explanation: "`priority` was deprecated in favour of `preload` to make the behaviour clearer. The docs suggest `loading=\"eager\"` or `fetchPriority=\"high\"` in most cases, keeping `preload` for a single known LCP image.",
    },
    {
      id: "d4-19",
      level: "intermediate",
      domain: "d4",
      lesson: "d4-polish",
      type: "lines",
      prompt: "The page title never changes to \"Pricing\". Tap the line that makes the `metadata` export unsupported here.",
      code: `"use client"
import type { Metadata } from "next"
export const metadata: Metadata = { title: "Pricing" }
export default function Page() {
  return <h1>Pricing</h1>
}`,
      codeLang: "tsx",
      answer: [1],
      explanation: "`metadata` and `generateMetadata` exports are only supported in Server Components. Remove the directive and move any interactive part into a child Client Component.",
    },
    {
      id: "d4-20",
      level: "intermediate",
      domain: "d4",
      lesson: "d4-polish",
      type: "match",
      prompt: "Match each metadata API or file to what it produces.",
      pairs: [
        ["`export const metadata`", "Static title and description for a layout or page"],
        ["`generateMetadata`", "Metadata that depends on data, like a post's title"],
        ["`opengraph-image.tsx`", "The image shown when a link is shared"],
        ["`sitemap.ts`", "A list of URLs for search engines"],
        ["`robots.ts`", "Rules for which paths crawlers may index"],
      ],
      explanation: "Next.js turns these into the right `<head>` tags and special files automatically, so you never hand-write `<meta>` tags in the root layout.",
    },
    {
      id: "d4-21",
      level: "junior",
      domain: "d4",
      lesson: "d4-polish",
      prompt: "What does `next/font/google` do?",
      options: [
        "Downloads the font at build time and self-hosts it, so browsers make no requests to Google",
        "Adds a `<link>` to Google Fonts in the document head",
        "Loads the font lazily after hydration",
        "Converts the font into an SVG sprite",
      ],
      answer: [0],
      explanation: "Fonts are served as files from your own site. That's better for privacy and speed, and it stops text from jumping when the font loads.",
    },
    {
      id: "d4-22",
      level: "senior",
      domain: "d4",
      lesson: "d4-actions",
      type: "lines",
      prompt: "This visit counter errors. Tap the buggy line.",
      code: `// app/page.tsx
import { cookies } from "next/headers"
export default async function Page() {
  const store = await cookies()
  const visits = Number(store.get("visits")?.value ?? 0)
  store.set("visits", String(visits + 1))
  return <p>Visit #{visits + 1}</p>
}`,
      codeLang: "tsx",
      answer: [6],
      explanation: "Server Components can read cookies but can't set them while rendering. Set cookies in a Server Action, a Route Handler or Proxy.",
    },
    {
      id: "d4-23",
      level: "staff",
      domain: "d4",
      lesson: "d4-route-handlers",
      prompt: "Your web UI needs form mutations, and a mobile app plus partners need a public API for the same operations. How should you structure it?",
      options: [
        "Server Actions for the web UI, Route Handlers for the public API, both calling one shared server-only data layer",
        "Only Server Actions, and give partners the action IDs",
        "Only Route Handlers, and have the web forms `fetch` them from Client Components",
        "Put the business logic in `proxy.ts` so every client hits it",
      ],
      answer: [0],
      explanation: "Server Actions are built for your own UI, where one round trip returns both data and UI. Outside programs need stable HTTP endpoints. Sharing the logic underneath keeps your rules and auth checks in one place.",
    },
    {
      id: "d4-24",
      level: "staff",
      domain: "d4",
      lesson: "d4-actions",
      prompt: "You self-host on several instances behind a load balancer. What must be identical on every instance so Server Actions work no matter which instance handles the request?",
      options: [
        "`NEXT_SERVER_ACTIONS_ENCRYPTION_KEY`, a stable key used to encrypt action references and closure variables",
        "`NEXT_PUBLIC_ACTIONS_KEY`, exposed to the browser",
        "The `runtime` export in `proxy.ts`",
        "A `cacheLife` profile named `actions`",
      ],
      answer: [0],
      explanation: "Captured closure variables and action IDs are encrypted. For multi-instance and self-hosted deployments, set `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` to the same value everywhere.",
    },
  ],

  cards: [
    { id: "c4-useserver", domain: "d4", kind: "service", term: "\"use server\"", definition: "Marks an async function (or every export of a file) as a Server Function callable from the client via POST." },
    { id: "c4-useactionstate", domain: "d4", kind: "service", term: "useActionState", definition: "A React hook. `useActionState(action, initial)` returns `[state, formAction, pending]`, and the action receives `(prevState, formData)`." },
    { id: "c4-route", domain: "d4", kind: "service", term: "route.ts", definition: "The Route Handler file. Export `GET`, `POST` and other methods using the web's Request and Response. It can't sit in the same folder as a `page.tsx`." },
    { id: "c4-nextrequest", domain: "d4", kind: "service", term: "NextRequest / NextResponse", definition: "Extensions of Request/Response with `nextUrl`, cookies helpers, `redirect`, `rewrite`, and `next`." },
    { id: "c4-routecontext", domain: "d4", kind: "service", term: "RouteContext", definition: "Global type for a handler's second argument: `RouteContext<'/users/[id]'>` gives typed async `params`." },
    { id: "c4-proxy", domain: "d4", kind: "service", term: "proxy.ts", definition: "Runs before a request is finished, and used to be called middleware. It runs on Node.js and can redirect, rewrite, set headers or respond." },
    { id: "c4-redirect", domain: "d4", kind: "service", term: "redirect()", definition: "From `next/navigation`. From `next/navigation`. It throws to move the user to another page, with a 307 status by default or 303 after a Server Action form post. Call it outside try/catch." },
    { id: "c4-cookies", domain: "d4", kind: "service", term: "cookies()", definition: "Async. You can read cookies in Server Components, but `set` and `delete` only work in Server Functions or Route Handlers." },
    { id: "c4-image", domain: "d4", kind: "service", term: "next/image", definition: "`<Image>` resizes images, loads them as they come into view and serves modern formats. Images from other sites need width and height, or fill." },
    { id: "c4-font", domain: "d4", kind: "service", term: "next/font", definition: "Self-hosts Google or local fonts with zero layout shift and no browser requests to Google." },
    { id: "c4-genmeta", domain: "d4", kind: "service", term: "generateMetadata", definition: "An async export in a page or layout that returns `Metadata` built from data, such as a blog post's title." },
    { id: "c4-progressive", domain: "d4", kind: "concept", term: "Progressive enhancement", definition: "Forms that call Server Actions from Server Components submit even before JavaScript loads." },
    { id: "c4-matcher", domain: "d4", kind: "concept", term: "Proxy matcher", definition: "`export const config = { matcher }` limits which paths run the proxy, for example `'/dashboard/:path*'`." },
  ],
});
