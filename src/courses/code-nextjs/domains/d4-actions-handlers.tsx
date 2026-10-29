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
    summary: "Mutate with Server Actions, build HTTP endpoints with Route Handlers, intercept requests in proxy.ts, and ship metadata, images, and fonts properly.",
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
        "`\"use server\"` at the top of an async function (in a Server Component) or a file marks Server Functions; Client Components import them from a `\"use server\"` file.",
        "Actions are invoked with POST and are reachable directly, so authenticate, authorize, and validate inside every one.",
        "Return expected errors as values and show them with `useActionState`; throw only for real bugs.",
        "Set or delete cookies in actions or Route Handlers, never during Server Component rendering.",
      ],
      tip: "Interviewers often ask \"is hiding the delete button enough?\" Answer: no, the action is a public POST endpoint, so check the session and ownership inside it.",
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
        "Route Handlers use the Web `Request`/`Response` APIs, extended by `NextRequest` and `NextResponse`.",
        "The second argument's `params` is a Promise; `RouteContext<'/path/[id]'>` types it.",
        "Use them for webhooks, public APIs, and non-UI clients; use Server Actions for your own UI's mutations.",
      ],
      tip: "A good comparison to have ready: Server Actions are for your own forms (one round trip returns UI and data); Route Handlers are for anything else that speaks HTTP.",
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
        "Next.js 16 renamed Middleware to Proxy: `proxy.ts` with a `proxy` (or default) export. Same functionality.",
        "Proxy runs on the Node.js runtime and the `runtime` option can't be set there.",
        "Keep it fast: optimistic checks, redirects, rewrites, headers. It's not for slow data fetching or full authorization.",
        "For fixed redirects, prefer `redirects` in `next.config.ts`.",
      ],
      tip: "If an interviewer says \"middleware\", it's fine to say: \"In Next.js 16 that's `proxy.ts`; I'd keep it to cheap checks and do real auth in the data layer.\"",
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
        "`metadata` and `generateMetadata` exports only work in Server Components (layouts and pages).",
        "`next/image` serves sized, modern-format images, lazy-loads by default, and reserves space to avoid layout shift.",
        "Remote images need `width` and `height` (or `fill`) and a matching `images.remotePatterns` entry.",
        "`next/font` self-hosts fonts with your deployment, so the browser makes no request to Google.",
      ],
      tip: "Tie these to Core Web Vitals in interviews: images and fonts are the usual culprits for layout shift (CLS) and a slow largest paint (LCP).",
    },
  ],

  questions: [
    {
      id: "d4-01",
      level: "junior",
      domain: "d4",
      lesson: "d4-actions",
      prompt: "Which HTTP method invokes a Server Action?",
      options: ["`POST`", "`GET`", "`PUT`", "Any method the form specifies"],
      answer: [0],
      explanation: "Behind the scenes, actions are always invoked with POST, and only POST can invoke them.",
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
      explanation: "Validation failures are expected errors: model them as return values. Thrown errors are for unexpected bugs and land in error boundaries.",
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
      explanation: "The directive comes first, then imports. Inside the action: authenticate, mutate, then expire the cache so the UI shows the new todo.",
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
      explanation: "Route Handlers export one named function per HTTP method. Rename it to `export async function GET()`.",
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
      explanation: "`nextUrl.searchParams` is a standard `URLSearchParams`. `.get()` returns the first value; use `.getAll(\"q\")` for every value.",
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
      explanation: "Middleware was renamed Proxy to reflect its network-boundary role. Config flags were renamed too, e.g. `skipProxyUrlNormalize`.",
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
      explanation: "Proxy is for fast checks, redirects, rewrites, and headers. It isn't meant for slow data fetching or as a full authorization solution; do real checks close to the data.",
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
      explanation: "An array matcher lists each path the proxy should run on. Paths outside the list skip it.",
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
      explanation: "Static imports get dimensions automatically; remote URLs need `width` and `height` to reserve space, or `fill` inside a positioned parent.",
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
      explanation: "Fonts are served as static assets from your own deployment, which helps privacy and performance and avoids layout shift.",
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
      explanation: "Server Components can read cookies but not set them while rendering. Set cookies in a Server Action or Route Handler (or Proxy).",
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
      explanation: "Server Actions are built for your own UI (one round trip returns data and UI). External clients need stable HTTP endpoints. Sharing the logic underneath keeps rules and auth in one place.",
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
    { id: "c4-useactionstate", domain: "d4", kind: "service", term: "useActionState", definition: "React hook: `[state, formAction, pending] = useActionState(action, initial)`. The action gets `(prevState, formData)`." },
    { id: "c4-route", domain: "d4", kind: "service", term: "route.ts", definition: "Route Handler file. Export `GET`, `POST`, etc. using Web Request/Response. Can't share a segment with `page.tsx`." },
    { id: "c4-nextrequest", domain: "d4", kind: "service", term: "NextRequest / NextResponse", definition: "Extensions of Request/Response with `nextUrl`, cookies helpers, `redirect`, `rewrite`, and `next`." },
    { id: "c4-routecontext", domain: "d4", kind: "service", term: "RouteContext", definition: "Global type for a handler's second argument: `RouteContext<'/users/[id]'>` gives typed async `params`." },
    { id: "c4-proxy", domain: "d4", kind: "service", term: "proxy.ts", definition: "Runs before a request completes (formerly middleware). Node.js runtime. Redirect, rewrite, headers, respond." },
    { id: "c4-redirect", domain: "d4", kind: "service", term: "redirect()", definition: "From `next/navigation`. Throws to navigate (307 by default; 303 after a Server Action form post). Call outside try/catch." },
    { id: "c4-cookies", domain: "d4", kind: "service", term: "cookies()", definition: "Async. Read in Server Components; `set`/`delete` only in Server Functions or Route Handlers." },
    { id: "c4-image", domain: "d4", kind: "service", term: "next/image", definition: "`<Image>` resizes, lazy-loads, and serves modern formats; needs width/height or fill for remote sources." },
    { id: "c4-font", domain: "d4", kind: "service", term: "next/font", definition: "Self-hosts Google or local fonts with zero layout shift and no browser requests to Google." },
    { id: "c4-genmeta", domain: "d4", kind: "service", term: "generateMetadata", definition: "Async export in a page or layout that returns `Metadata` built from data, e.g. a post title." },
    { id: "c4-progressive", domain: "d4", kind: "concept", term: "Progressive enhancement", definition: "Forms that call Server Actions from Server Components submit even before JavaScript loads." },
    { id: "c4-matcher", domain: "d4", kind: "concept", term: "Proxy matcher", definition: "`export const config = { matcher }` limits which paths run the proxy, e.g. `'/dashboard/:path*'`." },
  ],
});
