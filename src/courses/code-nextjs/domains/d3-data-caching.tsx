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
    summary: "Getting data onto the page quickly: fetching on the server, streaming slow parts, caching with \"use cache\", and refreshing cached data after a change.",
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
      id: "d3-b-fetch",
      level: "beginner",
      task: "3.1",
      title: "Getting data onto the page",
      check: ["next-b3-01", "next-b3-02"],
      visual: (
        <CodeBlock
          lang="tsx"
          caption="A Server Component that waits for a list of posts, then shows it."
          code={`export default async function Page() {
  const res = await fetch("https://api.example.com/posts");
  const posts = await res.json();
  return (
    <ul>
      {posts.map((p) => <li key={p.id}>{p.title}</li>)}
    </ul>
  );
}`}
        />
      ),
      points: [
        "Most pages show data from somewhere else, like a list of blog posts from a database or from another site's API.",
        "An **API** is a web address that returns data instead of a page, usually in a format called JSON.",
        "In Next.js, a Server Component can be an `async` function. It waits for the data with `await`, then returns the page.",
        "It's like a waiter who checks with the kitchen before coming to your table, so they arrive with the answer already in hand.",
        "For example, a recipe page can `await` the recipe from a database and then show it. The visitor never sees a loading spinner for that part.",
        "Pitfall: fetching from your own Route Handler inside a Server Component. You're already on the server, so call the database or function directly.",
      ],
      tip: "`await` means \"wait here until this is done\". You can only use it inside a function marked `async`.",
    },
    {
      id: "d3-b-cache",
      level: "beginner",
      task: "3.3",
      title: "Caching: saving work for next time",
      check: ["next-b3-03", "next-b3-04"],
      visual: (
        <Flow
          color="#f59e0b"
          steps={[
            { icon: "🙋", label: "First visitor", sub: "Next.js does the work and saves the result" },
            { icon: "💾", label: "Cache", sub: "The saved result waits" },
            { icon: "⚡", label: "Next visitors", sub: "Get the saved copy straight away" },
          ]}
        />
      ),
      points: [
        "**Caching** means saving a result so you can reuse it, instead of working it out again every time.",
        "It's like a café brewing a big pot of coffee in the morning. Each customer gets a cup straight away instead of waiting for a fresh brew.",
        "Next.js can cache data and whole parts of a page, so visitors get them fast and your database does less work.",
        "The catch: cached data can go **stale**, which means out of date. So you also need a way to refresh it when something changes.",
        "For example, a list of countries rarely changes, so caching it is safe. A shopping cart changes every click, so it shouldn't be cached for everyone.",
        "Pitfall: caching data that belongs to one user. Cached results can be served to other visitors, so keep personal data out of shared caches.",
      ],
      tip: "In Next.js 16, with Cache Components turned on, you cache a function or component by writing `\"use cache\"` inside it. You'll meet it properly in the later lessons.",
    },
    {
      id: "d3-fetching",
      level: "intermediate",
      task: "3.1",
      title: "Fetch on the server, in parallel",
      sources: [{ title: "Next.js docs: Caching", url: "https://nextjs.org/docs/app/guides/caching", license: "Official docs (link only)" }],
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
        "Server Components can be `async` and wait for a database or `fetch` directly. Passwords and keys never reach the browser.",
        "`fetch` isn't cached by default. But identical `fetch` calls during one render are shared, so you can fetch right where the data is needed without paying twice.",
        "For database calls, wrap the function in React's `cache()`. Then calls with the same arguments during one request run only once.",
        "A **waterfall** is when requests wait for each other one by one. Start requests that don't depend on each other together, then `await Promise.all` to wait for both.",
        "`fetch` requests are deduplicated within a render, but database or ORM calls aren't. Wrap a shared loader in React's `cache()` so `generateMetadata` (which builds the page's title and other metadata) and the page query it once per request.",
        "Worked example: a page needs a user and their orders, each taking 1 second. Two `await`s in a row take 2 seconds. `Promise.all` runs them together in about 1 second.",
      ],
      tip: "When you see two `await`s in a row in an interview snippet, ask whether the second needs the first. If it doesn't, point out the waterfall.",
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
        "**Streaming** means sending the page in pieces. `<Suspense>` lets the rest of the page arrive first while one slow component waits for its data.",
        "`loading.tsx` is a ready-made Suspense boundary around the page. It doesn't wrap the layout in the same folder.",
        "If a layout reads request data like cookies, headers or uncached fetches, that folder's `loading.tsx` won't cover it. Give that part its own `<Suspense>`, or move it into the page.",
        "Worked example: wrap a slow reviews list in `<Suspense fallback={<Spinner />}>`. The product details show at once, and the reviews stream in when ready.",
        "Pitfall: putting the slow `await` in the page itself, above the boundary. The whole page then waits, so move the slow fetch into the child inside `<Suspense>`.",
      ],
      tip: "Describe streaming as \"send what's ready now, fill the gaps later\". Then add that putting Suspense close to the slow data keeps most of the page instant.",
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
        "**Cache Components** is a setting, `cacheComponents: true`, that's on by default in new apps. It turns on `\"use cache\"` and Partial Prerendering.",
        "`\"use cache\"` saves what an async function or component returns. Its arguments, and any outside variables it uses, decide which saved copy you get back.",
        "Cached code can't call `cookies()` or `headers()`, or read `searchParams`. Read them outside the cached function and pass the values in as arguments.",
        "Plain markup, cached output and Suspense fallbacks together form the **static shell**, built ahead of time. Per-request work streams in later. For values like random ids, `await connection()` first.",
        "Worked example: a `getCategories` function marked `\"use cache\"` runs once, then later calls reuse the result until its cache life runs out or you invalidate its tag.",
        "Pitfall: reading `cookies()` or `headers()` inside a `\"use cache\"` scope. Those values differ per request, so read them outside and pass what you need in as arguments.",
      ],
      tip: "With Cache Components, route options like `export const revalidate` and `dynamic` are gone. Say \"I'd use `cacheLife` on the cached function\" instead.",
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
        "To **revalidate** is to refresh cached data. Time-based revalidation is stale-while-revalidate: once the time is up, the next visitor still gets the old copy, and their visit starts a refresh in the background.",
        "In Next.js 16, `revalidateTag` needs a second argument, and `'max'` is the recommended one. The one-argument form is deprecated.",
        "`updateTag` and `refresh` throw an error outside Server Actions. Webhooks in Route Handlers use `revalidateTag` instead.",
        "Worked example: after an admin edits post 7, call `revalidatePath('/blog/7')` to refresh that page, or `revalidateTag('posts')` to refresh every cached entry tagged with posts.",
        "Pitfall: revalidating before the database write finishes. Await the write first, or the next visitor sees the fresh cache rebuilt from old data.",
      ],
      tip: "Treat it as a product question. If this user must see their own change right away, use `updateTag`. If a few seconds of old data is fine, use `revalidateTag(tag, 'max')`.",
    },
  ],

  questions: [
    {
      id: "next-b3-01",
      domain: "d3",
      lesson: "d3-b-fetch",
      level: "beginner",
      prompt: "What does `await` do in `const res = await fetch(url);`?",
      options: ["Waits for the request to finish before moving to the next line", "Skips the request to save time", "Sends the request a second time if the first one fails or takes too long", "Saves the data to a file"],
      answer: [0],
      explanation: "`fetch` takes a moment to get an answer back. `await` pauses the function until the answer arrives, so the next line can use it.",
    },
    {
      id: "next-b3-02",
      type: "fill",
      domain: "d3",
      lesson: "d3-b-fetch",
      level: "beginner",
      prompt: "Fill the gap so this Server Component can use `await`.",
      code: `export default {{1}} function Page() {
  const posts = await getPosts();
  return <p>{posts.length} posts</p>;
}`,
      codeLang: "tsx",
      blanks: [{ options: ["async", "await", "static", "server"], answer: 0 }],
      explanation: "`await` only works inside a function marked `async`. Server Components are allowed to be `async`, which is how they wait for data before returning the page.",
    },
    {
      id: "next-b3-03",
      domain: "d3",
      lesson: "d3-b-cache",
      level: "beginner",
      prompt: "What is caching?",
      options: ["Saving a result so it can be reused instead of worked out again", "Deleting old pages from the site", "Sending the same email to every user on the mailing list at once", "Making images bigger"],
      answer: [0],
      explanation: "Caching keeps a copy of work you've already done. The next person who asks gets the saved copy straight away, like a cup from a pot of coffee that's already brewed.",
    },
    {
      id: "next-b3-04",
      domain: "d3",
      lesson: "d3-b-cache",
      level: "beginner",
      prompt: "What does it mean when cached data is stale?",
      options: ["It's out of date compared with the real data", "It loads faster than before, since it's newer", "It has been deleted", "It's been encrypted"],
      answer: [0],
      explanation: "Stale data is an old saved copy. If a post was edited after it was cached, visitors still see the old version until the cache is refreshed.",
    },
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
        "Add `\"use client\"` so that the browser fetches both of them in parallel",
        "Swap the two `await` lines",
      ],
      answer: [0],
      explanation: "Starting both requests before you await either lets them run at the same time. Swapping the lines doesn't help, because it still waits for one before starting the other.",
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
        "Cached forever across all requests and all users until you call `revalidatePath`",
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
      explanation: "Streaming sends the ready parts of the page first and fills each Suspense gap as its data arrives. A slow query never holds up the whole page.",
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
        "Shows a spinner only on the very first visit to the site, and then it never shows it again",
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
        "The whole HTML response for every route in the app, stored as one file per URL on the server's disk",
        "Only `fetch` responses made inside the function",
        "Client-side React state between navigations",
      ],
      answer: [0],
      explanation: "You can use it on data, in a function, or on UI, in a component, layout or page. Different inputs get their own separate saved copies.",
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
      explanation: "The arguments decide which saved copy you get. `(A1, USD)` and `(A1, EUR)` are two different entries, and the third call reuses the first one.",
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
        "Delete `cacheLife` so the cached function is allowed to read request data like cookies and headers",
        "Move `cookies()` into `generateStaticParams`",
      ],
      answer: [0],
      explanation: "Read request values in an uncached component and pass them into the cached one. The argument becomes part of the cache key, so each user gets their own saved copy.",
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
      explanation: "`revalidate` is the point after which a request starts a background refresh. `expire` is the point after which, if nobody visited, the next request has to wait. Very short lifetimes like `\"seconds\"` are left out of prerenders.",
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
        "Nothing: reading `cookies()` anywhere in the tree makes the whole route dynamic, so no part is prerendered",
      ],
      answer: [0],
      explanation: "That's Partial Prerendering. Reading `cookies()` inside a Suspense boundary no longer makes the whole route dynamic. Only that one gap streams in.",
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
      explanation: "Random values and timestamps need to be handled on purpose. `await connection()`, from `next/server`, waits until a real request arrives. The other option, `\"use cache\"`, would share one value across all users.",
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
      options: ["`revalidateTag(\"articles\", \"max\")`", "`updateTag(\"articles\")`", "`refresh()`", "`redirect(\"/articles\", \"max\")`"],
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
        "Tags are only allowed on `fetch`, not on any cached functions",
      ],
      answer: [0],
      explanation: "Next.js 16 uses `revalidateTag(tag, profile)`. Without a profile it acts like an immediate expiry, and that form is deprecated. Use `updateTag` in Server Actions when you want that.",
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
      explanation: "The refresh is started by the next request, not by the call itself. With `'max'`, visitors never wait: they get the old content while the new content is built.",
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
        "An error page, because the cached entry is older than one hour and has to be thrown away first",
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
        "The page re-renders every 60 seconds, just as it did before",
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
        "Use `\"use cache: private\"` so each browser caches the result locally and the server never has to run it twice",
        "Shorten its `cacheLife` to `\"seconds\"`",
      ],
      answer: [0],
      explanation: "The default cache lives in each server's memory, which disappears often on serverless hosting. `\"use cache: remote\"` uses a shared cache instead. The extra network trip is worth it for data that's read this often.",
    },
    {
      id: "d3-25",
      level: "staff",
      domain: "d3",
      lesson: "d3-revalidate",
      prompt: "Marketing pages come from a headless CMS. Content changes rarely, at unpredictable times. Which caching design fits best?",
      options: [
        "`cacheTag` + a long `cacheLife(\"max\")`, and a CMS webhook Route Handler that calls `revalidateTag(tag, \"max\")`",
        "`cacheLife(\"seconds\")` so changes show up quickly, with no webhook needed, since every request checks the CMS for updates first",
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
        "`cacheTag` entries are cleared whenever any Server Action runs, and every new deploy runs one of them at startup",
        "Remote caching only works in development",
      ],
      answer: [0],
      explanation: "All `use cache` stores are scoped to one deployment, even durable remote ones. Plan for warm-up (or use the `fetch` cache / `unstable_cache` for data that must survive deploys).",
    },
  ],

  cards: [
    { id: "c3-usecache", domain: "d3", kind: "service", term: "\"use cache\"", definition: "Caches an async function's or component's return value. Arguments and captured values form the cache key." },
    { id: "c3-cachelife", domain: "d3", kind: "service", term: "cacheLife", definition: "Sets how long cached code stays fresh, using a named profile from `seconds` up to `max`, or your own `{ stale, revalidate, expire }`." },
    { id: "c3-cachetag", domain: "d3", kind: "service", term: "cacheTag", definition: "Labels a cached entry so it can be invalidated on demand with `updateTag` or `revalidateTag`." },
    { id: "c3-revalidatetag", domain: "d3", kind: "service", term: "revalidateTag", definition: "`revalidateTag(tag, 'max')` marks tagged data as stale, so the next visitor gets the old copy while a fresh one is built. Works in Server Actions and Route Handlers." },
    { id: "c3-updatetag", domain: "d3", kind: "service", term: "updateTag", definition: "Expires tagged data immediately so the next read waits for fresh data. Server Actions only." },
    { id: "c3-revalidatepath", domain: "d3", kind: "service", term: "revalidatePath", definition: "Invalidates cached data for one route path when you don't know (or need) its tags." },
    { id: "c3-refresh", domain: "d3", kind: "service", term: "refresh", definition: "Re-renders the current route from a Server Action without revalidating tagged data." },
    { id: "c3-connection", domain: "d3", kind: "service", term: "connection()", definition: "From `next/server`. Await it to defer work (like random ids or timestamps) to request time." },
    { id: "c3-suspense", domain: "d3", kind: "service", term: "<Suspense>", definition: "Shows a fallback while its children wait for data, so the rest of the page can stream in first." },
    { id: "c3-reactcache", domain: "d3", kind: "service", term: "cache (React)", definition: "Remembers a function's result for the length of one request. For example, one database query shared by `generateMetadata` and the page." },
    { id: "c3-ppr", domain: "d3", kind: "concept", term: "Static shell (PPR)", definition: "The part of the page built ahead of time: plain markup, cached output and Suspense fallbacks. Per-request parts stream in when someone visits." },
    { id: "c3-cc", domain: "d3", kind: "concept", term: "Cache Components", definition: "The `cacheComponents: true` setting. Nothing is cached unless you write \"use cache\", and every route gets a static shell." },
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
      takeaway: "`updateTag` in a Server Action expires the entry, so the next read waits for fresh data. That's what you want when users must see their own change.",
      render: (onSolved) => <CacheLab goal="readYourWrites" onSolved={onSolved} />,
    },
    {
      id: "ch-next-swr",
      domain: "d3",
      lesson: "d3-revalidate",
      title: "Stale while revalidate",
      goal: "Edit a post, then get one visitor served the old version instantly while a background refresh runs, and the next visitor the new one.",
      hint: "Either let the revalidate time pass with the clock, or mark the tag stale with revalidateTag(\"posts\", \"max\"). Then visit twice.",
      takeaway: "Time-based revalidation and `revalidateTag(tag, 'max')` never make a visitor wait. One request gets the old data and starts the refresh.",
      render: (onSolved) => <CacheLab goal="swr" onSolved={onSolved} />,
    },
  ],
});
