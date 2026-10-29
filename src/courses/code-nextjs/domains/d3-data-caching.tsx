import { CodeBlock, CodeCompare, Flow, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { CacheLab } from "../labs";
import { ShellDiagram } from "../visuals";

/** Domain 3: fetching, streaming, Cache Components ("use cache"), and revalidation. */
export default defineDomain({
  domain: {
    id: "d3",
    number: 3,
    name: "Data fetching, caching, and rendering",
    world: "The Cache Caverns",
    weight: 30,
    emoji: "🧊",
    color: "#22d3ee",
    summary: "Fetch in Server Components without waterfalls, stream with Suspense, cache with \"use cache\" and cacheLife, and pick the right revalidation call after a mutation.",
  },

  tasks: [
    {
      id: "3.1",
      title: "Fetch data on the server",
      covers: ["async Server Components", "parallel vs sequential requests", "`fetch` memoization and `React.cache`"],
    },
    {
      id: "3.2",
      title: "Stream with Suspense",
      covers: ["`<Suspense>` boundaries", "`loading.tsx`", "runtime data in layouts"],
    },
    {
      id: "3.3",
      title: "Cache with Cache Components",
      covers: ["`cacheComponents: true`", "`\"use cache\"`, cache keys, and `cacheLife` profiles", "the static shell (Partial Prerendering)", "runtime APIs and `connection()`"],
    },
    {
      id: "3.4",
      title: "Revalidate after changes",
      covers: ["time-based stale-while-revalidate", "`revalidateTag(tag, profile)`", "`updateTag`", "`revalidatePath`", "`refresh`"],
    },
  ],

  lessons: [
    {
      id: "d3-fetching",
      level: "intermediate",
      task: "3.1",
      title: "Fetch on the server, in parallel",
      check: ["d3-01", "d3-03"],
      visual: (
        <CodeCompare
          lang="tsx"
          left={{
            title: "Waterfall: ~300 + 500 ms",
            code: `const artist = await getArtist(id)
const albums = await getAlbums(id)`,
          }}
          right={{
            title: "Parallel: ~500 ms",
            code: `const [artist, albums] = await Promise.all([
  getArtist(id),
  getAlbums(id),
])`,
          }}
        />
      ),
      points: [
        "Server Components can be `async` and await a database or `fetch` directly; credentials never reach the client.",
        "`fetch` is not cached by default. Identical `fetch` calls in one render tree are memoized, so fetch where the data is needed.",
        "For ORM or database calls, wrap the function in React's `cache()` to dedupe within one request.",
        "Start independent requests together and `await Promise.all` to avoid waterfalls.",
      ],
      tip: "When you see two `await`s in a row in an interview snippet, ask yourself whether the second depends on the first. If not, call out the waterfall.",
    },
    {
      id: "d3-streaming",
      level: "intermediate",
      task: "3.2",
      title: "Stream slow parts with Suspense",
      check: ["d3-05", "d3-06"],
      visual: (
        <div className="grid gap-3">
          <Flow
            color="#22d3ee"
            steps={[
              { icon: "📄", label: "Shell sent", sub: "Header + Suspense fallback" },
              { icon: "🌀", label: "Fallback paints", sub: "User sees a skeleton immediately" },
              { icon: "⏳", label: "Slow data resolves", sub: "On the server, at request time" },
              { icon: "🔁", label: "Chunk streams in", sub: "Replaces the fallback" },
            ]}
          />
          <CodeBlock
            lang="tsx"
            code={`import { Suspense } from "react"

export default function Page() {
  return (
    <>
      <h1>Dashboard</h1>
      <Suspense fallback={<RevenueSkeleton />}>
        <Revenue />  {/* awaits a slow, uncached query */}
      </Suspense>
    </>
  )
}`}
          />
        </div>
      ),
      points: [
        "`<Suspense>` lets the rest of the page ship first while one component waits for data.",
        "`loading.tsx` is a ready-made Suspense boundary around the page (not around the layout in the same folder).",
        "Runtime data read in a layout (cookies, headers, uncached fetches) isn't covered by that segment's `loading.tsx`: give it its own `<Suspense>` or move it into the page.",
      ],
      tip: "Describe streaming as \"send what's ready now, fill the holes later\". Then mention that placing Suspense close to the slow data keeps the most UI instant.",
    },
    {
      id: "d3-use-cache",
      level: "senior",
      task: "3.3",
      title: "\"use cache\" and the static shell",
      check: ["d3-09", "d3-13"],
      visual: (
        <div className="grid gap-3">
          <ShellDiagram />
          <CodeBlock
            lang="ts"
            caption={`Arguments and captured variables become part of the cache key. Pair every "use cache" with a cacheLife.`}
            code={`import { cacheLife, cacheTag } from "next/cache"

export async function getProducts(category: string) {
  "use cache"
  cacheLife("hours")
  cacheTag("products")
  return db.products.findMany({ where: { category } })
}`}
          />
        </div>
      ),
      points: [
        "Cache Components (`cacheComponents: true`, on by default in new apps) enables `\"use cache\"` and Partial Prerendering.",
        "`\"use cache\"` caches an async function's or component's return value, keyed by its serializable arguments and captured variables.",
        "Cached scopes can't call `cookies()`, `headers()`, or read `searchParams`: read them outside and pass values in as arguments.",
        "Static markup, cached output, and Suspense fallbacks form the static shell; runtime work streams in. For per-request random values, `await connection()` first.",
      ],
      tip: "Under Cache Components, route segment options like `export const revalidate` and `dynamic` are gone. Say \"I'd use `cacheLife` on the cached function\" instead.",
    },
    {
      id: "d3-revalidate",
      level: "senior",
      task: "3.4",
      title: "Revalidate: pick the right call",
      check: ["d3-15", "d3-20"],
      visual: (
        <div className="grid gap-4">
          <Tiles
            cols={4}
            tiles={[
              { icon: "⚡", title: "updateTag(tag)", text: "Server Actions only. Expires now; next read waits for fresh data. Read-your-own-writes.", color: "#34d399" },
              { icon: "🏷️", title: "revalidateTag(tag, 'max')", text: "Actions and Route Handlers. Marks stale; next visitor gets stale while it refreshes.", color: "#fbbf24" },
              { icon: "🛣️", title: "revalidatePath(path)", text: "Invalidate one route when tags would be overkill.", color: "#38bdf8" },
              { icon: "🔄", title: "refresh()", text: "Server Actions only. Re-renders the current route; doesn't revalidate tagged data.", color: "#f472b6" },
            ]}
          />
          <CacheLab />
        </div>
      ),
      points: [
        "Time-based revalidation is stale-while-revalidate: after `revalidate` passes, the next request gets cached content and triggers a background refresh.",
        "`revalidateTag` needs a second argument in Next.js 16; `'max'` is recommended. The one-argument form is deprecated.",
        "`updateTag` and `refresh` throw outside Server Actions; webhooks in Route Handlers use `revalidateTag`.",
      ],
      tip: "Frame it as a product question: \"Must this user see their own change right now?\" → `updateTag`. \"Is a few seconds of staleness fine?\" → `revalidateTag(tag, 'max')`.",
    },
  ],

  questions: [
    {
      id: "d3-01",
      level: "intermediate",
      domain: "d3",
      lesson: "d3-fetching",
      prompt: "`getAlbums` doesn't need anything from `getArtist`. How do you remove the waterfall?",
      code: `export default async function Page(props: PageProps<"/artist/[id]">) {
  const { id } = await props.params
  const artist = await getArtist(id)
  const albums = await getAlbums(id)
  return <Profile artist={artist} albums={albums} />
}`,
      codeLang: "tsx",
      options: [
        "`const [artist, albums] = await Promise.all([getArtist(id), getAlbums(id)])`",
        "Wrap both calls in `useEffect`",
        "Add `\"use client\"` so the browser fetches in parallel",
        "Swap the two `await` lines",
      ],
      answer: [0],
      explanation: "Starting both requests before awaiting lets them run at the same time. Swapping the lines still awaits one before starting the other.",
    },
    {
      id: "d3-02",
      level: "junior",
      domain: "d3",
      lesson: "d3-fetching",
      prompt: "Roughly how long until both results are ready?",
      code: `async function Page() {
  const a = fetchA() // takes 300 ms
  const b = fetchB() // takes 500 ms
  const [x, y] = await Promise.all([a, b])
  return <View x={x} y={y} />
}`,
      codeLang: "tsx",
      options: ["About 500 ms", "About 800 ms", "About 300 ms", "Instantly: both are cached"],
      answer: [0],
      explanation: "Both requests start immediately because neither call is awaited on its own line. `Promise.all` resolves when the slower one does.",
    },
    {
      id: "d3-03",
      level: "intermediate",
      domain: "d3",
      lesson: "d3-fetching",
      prompt: "In a Server Component with no `\"use cache\"`, how does `fetch()` behave in Next.js 16?",
      options: [
        "Not cached across requests; identical calls within one render tree are memoized",
        "Cached forever until you call `revalidatePath`",
        "Cached for 60 seconds by default",
        "Blocked: Server Components can't call `fetch`",
      ],
      answer: [0],
      explanation: "`fetch` requests aren't cached by default. Use `\"use cache\"` to cache results, or stream fresh data behind `<Suspense>`. Request memoization still dedupes identical calls in a render.",
    },
    {
      id: "d3-04",
      level: "senior",
      domain: "d3",
      lesson: "d3-fetching",
      prompt: "Both `generateMetadata` and the page call `getPost(slug)`, which uses an ORM (not `fetch`). How do you make it query once per request?",
      options: [
        "Wrap `getPost` in React's `cache()`",
        "Call it from `useEffect` instead",
        "Add `export const dynamic = \"force-static\"`",
        "Move the query into `proxy.ts`",
      ],
      answer: [0],
      explanation: "`React.cache` memoizes a function for the duration of one request, so every caller with the same arguments shares one result.",
    },
    {
      id: "d3-05",
      level: "junior",
      domain: "d3",
      lesson: "d3-streaming",
      type: "order",
      prompt: "A page has a static header and a slow `<Revenue />` inside `<Suspense>`. Order what the user experiences.",
      items: [
        "The static shell arrives: header plus the Suspense fallback",
        "The browser paints the skeleton immediately",
        "The server finishes the slow query inside `<Revenue />`",
        "The rendered chunk streams in and replaces the fallback",
      ],
      explanation: "Streaming sends ready UI first and fills Suspense holes as their data resolves, so a slow query never blocks the whole page.",
    },
    {
      id: "d3-06",
      level: "junior",
      domain: "d3",
      lesson: "d3-streaming",
      prompt: "What does adding `app/blog/loading.tsx` do?",
      options: [
        "Wraps `app/blog/page.tsx` (and segments below) in a Suspense boundary with that fallback",
        "Wraps `app/blog/layout.tsx` in a Suspense boundary",
        "Shows a spinner only on the very first visit to the site",
        "Disables prefetching for `/blog`",
      ],
      answer: [0],
      explanation: "`loading.tsx` is nested inside the segment's layout and wraps the page. That's why the layout beside it isn't covered by it.",
    },
    {
      id: "d3-07",
      level: "senior",
      domain: "d3",
      lesson: "d3-streaming",
      type: "lines",
      prompt: "`app/dashboard/loading.tsx` never covers this layout's slow part, and with Cache Components the build flags it. Tap the line responsible.",
      code: `// app/dashboard/layout.tsx
import { cookies } from "next/headers"
export default async function Layout({ children }: LayoutProps<"/dashboard">) {
  const theme = (await cookies()).get("theme")?.value
  return <div data-theme={theme}>{children}</div>
}`,
      codeLang: "tsx",
      answer: [4],
      explanation: "Awaiting runtime data at the top of a layout blocks it, and the same folder's `loading.tsx` only wraps the page. Read the cookie in a small component inside its own `<Suspense>`, or move the access into the page.",
    },
    {
      id: "d3-08",
      level: "junior",
      domain: "d3",
      lesson: "d3-use-cache",
      prompt: "What does the `\"use cache\"` directive cache?",
      options: [
        "The return value of an async function or component, keyed by its arguments and captured variables",
        "The whole HTML response for every route in the app",
        "Only `fetch` responses made inside the function",
        "Client-side React state between navigations",
      ],
      answer: [0],
      explanation: "It works at data level (a function) or UI level (a component, layout, or page). Different inputs produce separate cache entries.",
    },
    {
      id: "d3-09",
      level: "intermediate",
      domain: "d3",
      lesson: "d3-use-cache",
      prompt: "Starting from an empty cache on one server, how many times does `db.price` run?",
      code: `async function getPrice(sku: string, currency: string) {
  "use cache"
  cacheLife("hours")
  return db.price(sku, currency)
}
await getPrice("A1", "USD")
await getPrice("A1", "EUR")
await getPrice("A1", "USD")`,
      codeLang: "ts",
      options: ["2", "1", "3", "0"],
      answer: [0],
      explanation: "Arguments are part of the cache key. `(A1, USD)` and `(A1, EUR)` are two entries; the third call hits the first entry.",
    },
    {
      id: "d3-10",
      level: "senior",
      domain: "d3",
      lesson: "d3-use-cache",
      type: "lines",
      prompt: "This cached component throws at build time. Tap the buggy line.",
      code: `import { cookies } from "next/headers"
import { cacheLife } from "next/cache"
async function Recommendations() {
  "use cache"
  cacheLife("hours")
  const user = (await cookies()).get("user")?.value
  const recs = await getRecs(user)
  return <List items={recs} />
}`,
      codeLang: "tsx",
      answer: [6],
      explanation: "Cached scopes can't access runtime APIs like `cookies()`, `headers()`, or `searchParams`. Read the cookie in an uncached parent and pass the value in as a prop, which also becomes part of the cache key.",
    },
    {
      id: "d3-11",
      level: "staff",
      domain: "d3",
      lesson: "d3-use-cache",
      prompt: "Which version fixes the previous bug the way the Next.js docs prefer?",
      code: `async function RecsForUser() {
  const user = (await cookies()).get("user")?.value
  return <Recommendations user={user} />
}
async function Recommendations({ user }: { user?: string }) {
  "use cache"
  cacheLife("hours")
  return <List items={await getRecs(user)} />
}`,
      codeLang: "tsx",
      options: [
        "This one: read the cookie outside the cache (inside `<Suspense>`) and pass it as an argument",
        "Keep `cookies()` inside and wrap it in `try/catch`",
        "Delete `cacheLife` so the cache can read request data",
        "Move `cookies()` into `generateStaticParams`",
      ],
      answer: [0],
      explanation: "Extract runtime values in an uncached component and pass them into the cached one. The argument joins the cache key, so each user gets their own entry.",
    },
    {
      id: "d3-12",
      level: "intermediate",
      domain: "d3",
      lesson: "d3-use-cache",
      type: "match",
      prompt: "Match each built-in `cacheLife` profile to its server timing.",
      pairs: [
        ["`\"seconds\"`", "Revalidate after 1 s, expire after 1 min"],
        ["`\"minutes\"`", "Revalidate after 1 min, expire after 1 h"],
        ["`\"hours\"`", "Revalidate after 1 h, expire after 1 day"],
        ["`\"days\"`", "Revalidate after 1 day, expire after 1 week"],
        ["`\"max\"`", "Revalidate after 30 days, expire after 1 year"],
      ],
      explanation: "`revalidate` is when a request triggers a background refresh; `expire` is when, with no traffic, the next request must wait. Very short lifetimes like `\"seconds\"` are left out of prerenders.",
    },
    {
      id: "d3-13",
      level: "senior",
      domain: "d3",
      lesson: "d3-use-cache",
      prompt: "With Cache Components on, what does the prerendered static shell contain?",
      code: `export default function Page() {
  return (
    <>
      <Header />  {/* static markup */}
      <Posts />   {/* "use cache" + cacheLife("hours") */}
      <Suspense fallback={<p>Loading cart…</p>}>
        <Cart />  {/* reads cookies() */}
      </Suspense>
    </>
  )
}`,
      codeLang: "tsx",
      options: [
        "`Header`, the cached `Posts` output, and the cart fallback; `Cart` streams at request time",
        "Only `Header`",
        "Everything, including the user's cart",
        "Nothing: reading `cookies()` makes the whole route dynamic",
      ],
      answer: [0],
      explanation: "That's Partial Prerendering. Reading `cookies()` inside a Suspense boundary no longer opts the whole route into dynamic rendering; only that hole streams.",
    },
    {
      id: "d3-14",
      level: "senior",
      domain: "d3",
      lesson: "d3-use-cache",
      type: "lines",
      prompt: "Each request should get a new id, but Cache Components flags this during prerendering. Tap the line that needs `await connection()` before it.",
      code: `import { Suspense } from "react"
async function RequestId() {
  const id = crypto.randomUUID()
  return <p>Request {id}</p>
}
export default function Page() {
  return <Suspense fallback={null}><RequestId /></Suspense>
}`,
      codeLang: "tsx",
      answer: [3],
      explanation: "Random values and timestamps must be handled explicitly. `await connection()` (from `next/server`) defers to request time; alternatively `\"use cache\"` would share one value across users.",
    },
    {
      id: "d3-15",
      level: "senior",
      domain: "d3",
      lesson: "d3-revalidate",
      prompt: "In a Server Action, a user renames their project and must see the new name as soon as the action finishes. Which call fits?",
      code: `"use server"
export async function rename(id: string, name: string) {
  await db.project.update({ where: { id }, data: { name } })
  // ??? ("project-" + id)
}`,
      codeLang: "ts",
      options: ["`updateTag(\"project-\" + id)`", "`revalidateTag(\"project-\" + id, \"max\")`", "`refresh()`", "`cacheLife(\"seconds\")`"],
      answer: [0],
      explanation: "`updateTag` expires the entry immediately, so the re-render that ships with the action's response waits for fresh data: read-your-own-writes. `revalidateTag` with `'max'` would serve stale content first.",
    },
    {
      id: "d3-16",
      level: "senior",
      domain: "d3",
      lesson: "d3-revalidate",
      prompt: "A CMS webhook calls a Route Handler when an article is published. A short delay is fine. What should the handler call?",
      options: ["`revalidateTag(\"articles\", \"max\")`", "`updateTag(\"articles\")`", "`refresh()`", "`redirect(\"/articles\")`"],
      answer: [0],
      explanation: "`revalidateTag` works in Route Handlers and gives stale-while-revalidate with `'max'`. `updateTag` and `refresh` only work in Server Actions.",
    },
    {
      id: "d3-17",
      level: "senior",
      domain: "d3",
      lesson: "d3-revalidate",
      type: "lines",
      prompt: "This webhook throws at runtime. Tap the buggy line.",
      code: `// app/api/publish/route.ts
import { updateTag } from "next/cache"
export async function POST(request: Request) {
  const { slug } = await request.json()
  await db.article.publish(slug)
  updateTag(\`article-\${slug}\`)
  return Response.json({ ok: true })
}`,
      codeLang: "ts",
      answer: [6],
      explanation: "`updateTag` can only be called inside Server Actions. In a Route Handler use `revalidateTag(tag, 'max')`, or `{ expire: 0 }` if the data must be gone immediately.",
    },
    {
      id: "d3-18",
      level: "junior",
      domain: "d3",
      lesson: "d3-revalidate",
      prompt: "A code review flags this line in a Next.js 16 app. Why?",
      code: `revalidateTag("posts")`,
      codeLang: "ts",
      options: [
        "The single-argument form is deprecated; pass a profile such as `\"max\"`",
        "Tags must start with a slash",
        "`revalidateTag` was removed in favour of `revalidatePath`",
        "Tags are only allowed on `fetch`, not on cached functions",
      ],
      answer: [0],
      explanation: "Next.js 16 uses `revalidateTag(tag, profile)`. Without a profile it behaves like an immediate expiry and is deprecated; use `updateTag` in Server Actions for that.",
    },
    {
      id: "d3-19",
      level: "senior",
      domain: "d3",
      lesson: "d3-revalidate",
      prompt: "Which are true about `refresh()` from `next/cache`? (Choose two.)",
      options: [
        "It can only be called in Server Actions",
        "It refreshes the client router without revalidating tagged data",
        "It purges every cache entry in the app",
        "It's the recommended call inside Route Handlers",
        "It takes the path to refresh as its argument",
      ],
      answer: [0, 1],
      explanation: "`refresh()` re-renders the current route so the UI reflects state the action changed outside the cache. To update cached data, use `updateTag` or `revalidateTag`.",
    },
    {
      id: "d3-20",
      level: "senior",
      domain: "d3",
      lesson: "d3-revalidate",
      type: "order",
      prompt: "A Server Action calls `revalidateTag(\"posts\", \"max\")`. Order what happens next.",
      items: [
        "Entries tagged `posts` are marked stale",
        "The next visitor is served the stale content immediately",
        "That request kicks off a background regeneration",
        "Later visitors get the fresh content",
      ],
      explanation: "Revalidation is triggered by requests, not by the call itself. With `'max'`, visitors never wait: they get stale content while fresh content is built.",
    },
    {
      id: "d3-21",
      level: "senior",
      domain: "d3",
      lesson: "d3-revalidate",
      prompt: "The entry was created at 9:00. The rates change at 9:10. The next visitor arrives at 10:30. What do they see?",
      code: `async function getRates() {
  "use cache"
  cacheLife("hours") // revalidate 1 h, expire 1 day
  return fetchRates()
}`,
      codeLang: "ts",
      options: [
        "The 9:00 rates, while a background refresh starts; the visitor after them gets new rates",
        "The new rates, after waiting for a fresh fetch",
        "An error, because the entry is older than one hour",
        "The 9:00 rates, and they stay until 9:00 tomorrow",
      ],
      answer: [0],
      explanation: "Time-based revalidation is stale-while-revalidate: past `revalidate`, a request is served the cached value and triggers regeneration. Only past `expire` would a request wait.",
    },
    {
      id: "d3-22",
      level: "intermediate",
      domain: "d3",
      lesson: "d3-use-cache",
      prompt: "Which `next.config.ts` option enables `\"use cache\"`, `cacheLife`, and Partial Prerendering?",
      code: `import type { NextConfig } from "next"
const nextConfig: NextConfig = {
  /* ??? */
}
export default nextConfig`,
      codeLang: "ts",
      options: ["`cacheComponents: true`", "`experimental: { dynamicIO: true }`", "`reactCompiler: true`", "`output: \"export\"`"],
      answer: [0],
      explanation: "`cacheComponents` turns on the Cache Components model. The older `experimental.dynamicIO` flag was removed in Next.js 16, and new `create-next-app` projects enable Cache Components by default.",
    },
    {
      id: "d3-23",
      level: "staff",
      domain: "d3",
      lesson: "d3-use-cache",
      prompt: "With Cache Components enabled, what happens to `export const revalidate = 60` in a page?",
      options: [
        "It isn't supported; give the cached function a `cacheLife` instead",
        "The page re-renders every 60 seconds as before",
        "It sets the client stale time to 60 seconds",
        "It applies only to `fetch` calls in that page",
      ],
      answer: [0],
      explanation: "Since Next.js 16, the `dynamic`, `dynamicParams`, `revalidate`, and `fetchCache` segment options are removed under Cache Components. Lifetimes live on `\"use cache\"` scopes via `cacheLife`.",
    },
    {
      id: "d3-24",
      level: "staff",
      domain: "d3",
      lesson: "d3-use-cache",
      prompt: "On a serverless platform, an expensive `\"use cache\"` query shared by many users keeps re-running and the database struggles. What's the most targeted fix?",
      options: [
        "Switch that function to `\"use cache: remote\"` so results live in a durable cache shared across instances",
        "Remove `\"use cache\"` and query on every request",
        "Use `\"use cache: private\"` so each browser caches it",
        "Shorten its `cacheLife` to `\"seconds\"`",
      ],
      answer: [0],
      explanation: "The default handler is in-memory per instance, which is ephemeral on serverless. `\"use cache: remote\"` uses a shared cache handler; the network round trip pays off for high-hit-rate data like this.",
    },
    {
      id: "d3-25",
      level: "staff",
      domain: "d3",
      lesson: "d3-revalidate",
      prompt: "Marketing pages come from a headless CMS. Content changes rarely, at unpredictable times. Which caching design fits best?",
      options: [
        "`cacheTag` + a long `cacheLife(\"max\")`, and a CMS webhook Route Handler that calls `revalidateTag(tag, \"max\")`",
        "`cacheLife(\"seconds\")` so changes show up quickly",
        "No caching; render every request",
        "Redeploy the site every time an editor saves",
      ],
      answer: [0],
      explanation: "When content has no natural expiry, keep it in the static shell with a long lifetime and revalidate on demand when the source changes. That avoids needless time-based regeneration.",
    },
    {
      id: "d3-26",
      level: "staff",
      domain: "d3",
      lesson: "d3-use-cache",
      prompt: "After every deploy, an expensive report cached with `\"use cache: remote\"` recomputes and the database spikes. Why?",
      options: [
        "The cache key includes the build (or deployment) ID, so no `use cache` entries carry over to a new deploy",
        "Remote caches expire every hour by default",
        "`cacheTag` entries are cleared whenever a Server Action runs",
        "Remote caching only works in development",
      ],
      answer: [0],
      explanation: "All `use cache` stores are scoped to one deployment, even durable remote ones. Plan for warm-up (or use the `fetch` cache / `unstable_cache` for data that must survive deploys).",
    },
  ],

  cards: [
    { id: "c3-usecache", domain: "d3", kind: "service", term: "\"use cache\"", definition: "Caches an async function's or component's return value. Arguments and captured values form the cache key." },
    { id: "c3-cachelife", domain: "d3", kind: "service", term: "cacheLife", definition: "Sets a cached scope's lifetime: a profile (`seconds`…`max`) or `{ stale, revalidate, expire }`." },
    { id: "c3-cachetag", domain: "d3", kind: "service", term: "cacheTag", definition: "Labels a cached entry so it can be invalidated on demand with `updateTag` or `revalidateTag`." },
    { id: "c3-revalidatetag", domain: "d3", kind: "service", term: "revalidateTag", definition: "`revalidateTag(tag, 'max')`: marks tagged data stale (stale-while-revalidate). Works in Server Actions and Route Handlers." },
    { id: "c3-updatetag", domain: "d3", kind: "service", term: "updateTag", definition: "Expires tagged data immediately so the next read waits for fresh data. Server Actions only." },
    { id: "c3-revalidatepath", domain: "d3", kind: "service", term: "revalidatePath", definition: "Invalidates cached data for one route path when you don't know (or need) its tags." },
    { id: "c3-refresh", domain: "d3", kind: "service", term: "refresh", definition: "Re-renders the current route from a Server Action without revalidating tagged data." },
    { id: "c3-connection", domain: "d3", kind: "service", term: "connection()", definition: "From `next/server`. Await it to defer work (like random ids or timestamps) to request time." },
    { id: "c3-suspense", domain: "d3", kind: "service", term: "<Suspense>", definition: "Shows a fallback while children wait for data; lets the rest of the page stream first." },
    { id: "c3-reactcache", domain: "d3", kind: "service", term: "cache (React)", definition: "Memoizes a function per request, e.g. an ORM query shared by `generateMetadata` and the page." },
    { id: "c3-ppr", domain: "d3", kind: "concept", term: "Static shell (PPR)", definition: "Prerendered static markup, cached output, and Suspense fallbacks; runtime holes stream in at request time." },
    { id: "c3-cc", domain: "d3", kind: "concept", term: "Cache Components", definition: "`cacheComponents: true`: caching is opt-in with \"use cache\", and every route produces a static shell." },
    { id: "c3-swr", domain: "d3", kind: "concept", term: "Stale-while-revalidate", definition: "Serve the cached value now and regenerate in the background, so no visitor waits." },
    { id: "c3-runtime", domain: "d3", kind: "concept", term: "Runtime APIs", definition: "`cookies()`, `headers()`, `searchParams`, and unknown `params`: request data that can't be prerendered." },
  ],

  challenges: [
    {
      id: "ch-next-ryow",
      domain: "d3",
      lesson: "d3-revalidate",
      title: "Read your own writes",
      goal: "Edit a post in the database, then make the very next page visit show the new version without anyone getting stale data.",
      hint: "One of the green or amber buttons expires the entry immediately. Use it after editing, then visit.",
      takeaway: "`updateTag` in a Server Action expires the entry, so the next read blocks for fresh data: perfect when users must see their own change.",
      render: (onSolved) => <CacheLab goal="readYourWrites" onSolved={onSolved} />,
    },
    {
      id: "ch-next-swr",
      domain: "d3",
      lesson: "d3-revalidate",
      title: "Stale while revalidate",
      goal: "Edit a post, then get one visitor served the old version instantly while a background refresh runs, and the next visitor the new one.",
      hint: "Either let the revalidate time pass with the clock, or mark the tag stale with revalidateTag(\"posts\", \"max\"). Then visit twice.",
      takeaway: "Time-based revalidation and `revalidateTag(tag, 'max')` never make a visitor wait: one request gets stale data and triggers the refresh.",
      render: (onSolved) => <CacheLab goal="swr" onSolved={onSolved} />,
    },
  ],
});
