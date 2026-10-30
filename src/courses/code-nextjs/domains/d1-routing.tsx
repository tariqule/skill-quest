import { CodeBlock, CodeCompare, Flow, ServiceRows, Tiles } from "@/components/learn/blocks";
import { defineDomain } from "@/engine/define";
import { FileStack } from "../visuals";

/** Domain 1: the App Router's file-system routing, special files, params, and navigation. */
export default defineDomain({
  domain: {
    id: "d1",
    number: 1,
    name: "Routing and file conventions",
    world: "The App Router Maze",
    weight: 25,
    emoji: "🗺️",
    color: "#38bdf8",
    summary: "How folders turn into web addresses, how special files like layouts wrap your pages, how to read values from the URL, and how <Link> makes moving between pages fast.",
  },

  tasks: [
    {
      id: "1.1",
      title: "Map folders to URLs",
      covers: ["page files", "dynamic, catch-all, and optional catch-all segments", "route groups `(name)` and private folders `_name`"],
    },
    {
      id: "1.2",
      title: "Use layouts, templates, and special files",
      covers: ["root and nested layouts", "template vs layout", "loading, error, and not-found boundaries and how they nest"],
    },
    {
      id: "1.3",
      title: "Read params and prerender dynamic routes",
      covers: ["`params` and `searchParams` as Promises", "`PageProps` / `LayoutProps` helpers", "`generateStaticParams`"],
    },
    {
      id: "1.4",
      title: "Navigate between routes",
      covers: ["`<Link>` prefetching and client-side transitions", "`useRouter`, `usePathname`, `useSearchParams` from `next/navigation`", "`redirect()`"],
    },
  ],

  lessons: [
    {
      id: "d1-b-what",
      level: "beginner",
      task: "1.1",
      title: "What Next.js is",
      check: ["next-b1-01", "next-b1-02"],
      visual: (
        <Tiles
          cols={3}
          tiles={[
            { icon: "⚛️", title: "React", text: "Components and state: the pieces of your screen.", color: "#61dafb" },
            { icon: "🧭", title: "Routing", text: "Each web address shows the right page.", color: "#a78bfa" },
            { icon: "🖥️", title: "Server", text: "Code that runs before the page reaches the browser.", color: "#34d399" },
          ]}
        />
      ),
      points: [
        "**Next.js** is a framework built on top of React. React gives you components, and Next.js adds what a full website needs: pages, web addresses, a server and fast loading.",
        "Think of React as a set of good kitchen tools. Next.js is the whole restaurant around them, with a front door, a menu and staff who bring the food out.",
        "You still write normal React components. Next.js decides which one to show for each web address and gets it to the browser quickly.",
        "Next.js can run your code on the **server**, the computer that hosts your site, as well as in the visitor's browser.",
      ],
      tip: "You start a new project with `npx create-next-app@latest`. It sets up the folders for you, plus a local server you can open in your browser while you work.",
    },
    {
      id: "d1-b-folders",
      level: "beginner",
      task: "1.1",
      title: "Folders become web addresses",
      check: ["next-b1-03", "next-b1-04"],
      visual: (
        <ServiceRows
          rows={[
            { input: "You create", service: "app/page.tsx", output: "Visitors see /" },
            { input: "You create", service: "app/about/page.tsx", output: "Visitors see /about" },
            { input: "You create", service: "app/blog/page.tsx", output: "Visitors see /blog" },
          ]}
        />
      ),
      points: [
        "In Next.js, the `app` folder decides your site's web addresses. This is called **routing**: matching a web address to the page it should show.",
        "A file named `page.tsx` makes a page. `app/page.tsx` is your home page, at `/`.",
        "Each folder adds a piece to the address. `app/about/page.tsx` shows up at `/about`.",
        "It's like a filing cabinet. Each drawer label is part of the address, and the `page.tsx` inside is what visitors see.",
      ],
      tip: "Only files named `page.tsx` turn into pages. You can keep other files, like small components, in the same folders and they won't get web addresses of their own.",
    },
    {
      id: "d1-routing",
      level: "junior",
      task: "1.1",
      title: "Folders are routes",
      sources: [{ title: "Next.js docs: Route Groups", url: "https://nextjs.org/docs/app/api-reference/file-conventions/route-groups", license: "Official docs (link only)" }],
      check: ["d1-01", "d1-21"],
      visual: (
        <div className="grid gap-3">
          <CodeBlock
            lang="files"
            code={`app/
├── page.tsx                  →  /
├── blog/
│   ├── page.tsx              →  /blog
│   └── [slug]/page.tsx       →  /blog/hello-world
├── shop/[...slug]/page.tsx   →  /shop/a, /shop/a/b
├── docs/[[...slug]]/page.tsx →  /docs, /docs/a, /docs/a/b
├── (marketing)/about/page.tsx →  /about
└── _components/Nav.tsx       →  (not a route)`}
          />
          <Tiles
            cols={3}
            tiles={[
              { icon: "🧩", title: "[slug]", text: "One dynamic segment. Its value arrives in `params`.", color: "#38bdf8" },
              { icon: "🪢", title: "( group )", text: "Organises folders without changing the URL. Can hold its own root layout.", color: "#a78bfa" },
              { icon: "🙈", title: "_private", text: "Opts a folder and its children out of routing. Great for colocated helpers.", color: "#f59e0b" },
            ]}
          />
        </div>
      ),
      points: [
        "Each folder inside `app` adds a piece to the web address. A `page.tsx` file in a folder makes that address something visitors can open.",
        "Square brackets make a **dynamic segment**, a part of the address that can change. `[slug]` matches one piece, `[...slug]` matches one or more, and `[[...slug]]` matches zero or more.",
        "Other files, like components and helpers, can sit next to your routes. Only `page` and `route` files can be opened by visitors.",
        "A folder in parentheses, like `app/(marketing)/about`, is a **route group**: it organises files and can share a layout, but its name stays out of the URL, so that page serves `/about`.",
      ],
      tip: "Interviewers often ask how you'd structure an app. Sketch the folder tree first, then say which folders are groups, which are dynamic, and where the layouts go.",
    },
    {
      id: "d1-layouts",
      level: "intermediate",
      task: "1.2",
      title: "Layouts, templates, and the special-file stack",
      sources: [{ title: "Next.js docs: Layouts and Pages", url: "https://nextjs.org/docs/app/getting-started/layouts-and-pages", license: "Official docs (link only)" }],
      check: ["d1-06", "d1-08"],
      visual: <FileStack />,
      points: [
        "A **layout** is shared UI that wraps the pages inside its folder, like a header and footer. Every app needs a root layout, and it must render `<html>` and `<body>`.",
        "Layouts stay put when you move between pages, so their state is kept. A **template** looks similar but is rebuilt on every navigation, so its state resets.",
        "`error.tsx` must be a Client Component. It doesn't catch errors from the layout in its own folder. The parent folder's error boundary catches those.",
        "`loading.tsx` wraps the page in `<Suspense>` to show a loading state. It doesn't cover the layout in the same folder.",
        "Other special files in a segment: `not-found.tsx` renders when you call `notFound()`, `template.tsx` is a layout that remounts on navigation, and `route.ts` is a **Route Handler** that answers HTTP methods like `GET` and `POST`.",
        "Several root layouts are possible with route groups, such as `app/(shop)/layout.tsx` and `app/(admin)/layout.tsx`. Moving between pages that use different root layouts triggers a full page load.",
      ],
      tip: "Asked how a layout differs from a template? They sit in the same place in the tree, but a template gets a new key for each page. So its state resets and its effects run again.",
    },
    {
      id: "d1-params",
      level: "intermediate",
      task: "1.3",
      title: "params are Promises (and can be prerendered)",
      check: ["d1-04", "d1-14"],
      visual: (
        <div className="grid gap-3">
          <CodeCompare
            lang="tsx"
            left={{
              title: "Old habit (sync params)",
              code: `export default function Page({ params }) {
  return <h1>{params.slug}</h1>
}`,
            }}
            right={{
              title: "Next.js 16",
              code: `export default async function Page(
  props: PageProps<"/blog/[slug]">
) {
  const { slug } = await props.params
  return <h1>{slug}</h1>
}`,
            }}
          />
          <CodeBlock
            lang="tsx"
            caption="Prerender known slugs at build time. Catch-all segments return arrays: { slug: ['a', 'b'] }."
            code={`export async function generateStaticParams() {
  const posts = await getPosts()
  return posts.map((post) => ({ slug: post.slug }))
}`}
          />
        </div>
      ),
      points: [
        "`params` holds the dynamic parts of the URL, and `searchParams` holds the query string after `?`. Both are Promises, so you `await` them or unwrap them with React's `use`.",
        "Next.js generates types for you: `PageProps<'/route'>`, `LayoutProps<'/route'>` and `RouteContext<'/route'>`. They're global, so you don't need to import them.",
        "To **prerender** a page means building it ahead of time, before anyone asks. `generateStaticParams` returns one params object for each page to build. It replaces the Pages Router's `getStaticPaths`.",
      ],
      tip: "If you're asked why params became async, the short answer: Next.js can start rendering before it knows the request's data, so more of the page can be built ahead of time.",
    },
    {
      id: "d1-navigation",
      level: "junior",
      task: "1.4",
      title: "Link, prefetching, and client navigation",
      check: ["d1-11", "d1-10"],
      visual: (
        <div className="grid gap-3">
          <Flow
            color="#38bdf8"
            steps={[
              { icon: "👁️", label: "Link enters viewport", sub: "Next.js prefetches the route in the background" },
              { icon: "👆", label: "User clicks", sub: "No full page reload" },
              { icon: "🧱", label: "Shared layouts stay", sub: "Only the changed segments render" },
              { icon: "⚡", label: "Page swaps in", sub: "Instant if prefetched, else loading.tsx shows" },
            ]}
          />
          <CodeBlock
            lang="tsx"
            code={`"use client"
import { usePathname, useRouter } from "next/navigation"

export function Nav() {
  const pathname = usePathname()
  const router = useRouter()
  return <button onClick={() => router.push("/cart")}>{pathname}</button>
}`}
          />
        </div>
      ),
      points: [
        "`<Link>` is a smarter `<a>` tag. It loads pages in the background before you click, which is called **prefetching**, and it switches pages without reloading shared layouts.",
        "Navigation hooks like `useRouter` come from `next/navigation`, not `next/router`. They only work in Client Components.",
        "Layouts don't get `searchParams`. Read them in the page, or with the `useSearchParams` hook.",
        "`redirect()` works by throwing a special error, so call it outside any `try/catch`. Otherwise your `catch` swallows the redirect.",
      ],
      tip: "Mention that a dynamic route with a `loading.tsx` can be partly prefetched. Clicking feels instant even before its data is ready.",
    },
  ],

  questions: [
    {
      id: "next-b1-01",
      domain: "d1",
      lesson: "d1-b-what",
      level: "beginner",
      prompt: "What is Next.js?",
      options: ["A framework built on React that adds pages, routing and a server", "A replacement for JavaScript", "A database that stores your web pages and serves them to visitors", "A library of CSS styles"],
      answer: [0],
      explanation: "Next.js builds on React. You keep writing React components, and Next.js adds the parts a full website needs, like turning folders into web addresses and running code on a server.",
    },
    {
      id: "next-b1-02",
      domain: "d1",
      lesson: "d1-b-what",
      level: "beginner",
      prompt: "How does Next.js relate to React?",
      options: ["Next.js is built on React, so you still write React components", "Next.js replaces React, so you stop writing components", "They're unrelated tools that can't be used together"],
      answer: [0],
      explanation: "Next.js uses React underneath. Everything you learn about components, props and state still applies, and Next.js wraps it in a full website setup.",
    },
    {
      id: "next-b1-03",
      domain: "d1",
      lesson: "d1-b-folders",
      level: "beginner",
      prompt: "Which file shows the page at `/about`?",
      options: ["`app/about/page.tsx`", "`app/about.html`", "`app/page/about.tsx`", "`app/about/styles.css`"],
      answer: [0],
      explanation: "The folder `about` gives the address `/about`, and the file named `page.tsx` inside it is what visitors see there. Other file names don't create pages.",
    },
    {
      id: "next-b1-04",
      domain: "d1",
      lesson: "d1-b-folders",
      level: "beginner",
      prompt: "What does the file `app/page.tsx` show?",
      options: ["The home page, at `/`", "A page at `/page`", "Nothing, because it's only a settings file"],
      answer: [0],
      explanation: "A `page.tsx` directly inside `app` has no folders in front of it, so its address is just `/`. That's your home page.",
    },
    {
      id: "d1-01",
      level: "junior",
      domain: "d1",
      lesson: "d1-routing",
      prompt: "Which file makes `/dashboard/settings` a publicly reachable page?",
      options: ["`app/dashboard/settings/page.tsx`", "`app/dashboard/settings/layout.tsx`", "`app/dashboard/settings.tsx`", "`app/dashboard/settings/index.tsx`"],
      answer: [0],
      explanation: "Folders define the URL segments, and a `page` file inside the last folder makes it public. A layout alone wraps pages but isn't reachable, and `index` / file-named routes are not App Router conventions.",
    },
    {
      id: "d1-02",
      level: "junior",
      domain: "d1",
      lesson: "d1-routing",
      type: "match",
      prompt: "Match each file to the URLs it serves.",
      pairs: [
        ["`app/shop/[slug]/page.tsx`", "`/shop/shoes` (exactly one segment)"],
        ["`app/shop/[...slug]/page.tsx`", "`/shop/a` and `/shop/a/b`, but not `/shop`"],
        ["`app/shop/[[...slug]]/page.tsx`", "`/shop`, `/shop/a`, and `/shop/a/b`"],
        ["`app/(marketing)/about/page.tsx`", "`/about` (group names stay out of the URL)"],
        ["`app/_lib/page.tsx`", "Nothing: private folders are not routes"],
      ],
      explanation: "Square brackets make a segment dynamic. Three dots make it catch-all, and double brackets make the catch-all optional. Parentheses create route groups, and a leading underscore keeps a folder out of routing.",
    },
    {
      id: "d1-03",
      level: "junior",
      domain: "d1",
      lesson: "d1-params",
      prompt: "A user visits `/docs/api/cache/tags`. What does the page render?",
      code: `// app/docs/[...slug]/page.tsx
export default async function Page(props: PageProps<"/docs/[...slug]">) {
  const { slug } = await props.params
  return <p>{JSON.stringify(slug)}</p>
}`,
      codeLang: "tsx",
      options: ['`["api","cache","tags"]`', '`"api/cache/tags"`', '`"tags"`', '`{"slug":"api/cache/tags"}`'],
      answer: [0],
      explanation: "A catch-all segment's param is an array of the matched segments, so `slug` is `['api', 'cache', 'tags']`.",
    },
    {
      id: "d1-04",
      level: "intermediate",
      domain: "d1",
      lesson: "d1-params",
      type: "lines",
      prompt: "This page shows the wrong post (or crashes) in Next.js 16. Tap the buggy line.",
      code: `import { getPost } from "@/lib/posts"
export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const post = await getPost(params.id)
  return <h1>{post.title}</h1>
}`,
      codeLang: "tsx",
      answer: [7],
      explanation: "`params` is a Promise, so `params.id` is `undefined`. Await it first: `const { id } = await params`, then call `getPost(id)`.",
    },
    {
      id: "d1-05",
      level: "intermediate",
      domain: "d1",
      lesson: "d1-layouts",
      prompt: "A search input lives in `app/dashboard/layout.tsx`. Moving from `/dashboard/a` to `/dashboard/b` keeps its text. You want it to reset on every navigation. What's the simplest fix?",
      code: `// app/dashboard/layout.tsx
import { SearchInput } from "./search-input" // "use client", holds useState
export default function Layout({ children }: { children: React.ReactNode }) {
  return <section><SearchInput />{children}</section>
}`,
      codeLang: "tsx",
      options: [
        "Move the input into `app/dashboard/template.tsx`",
        "Add `\"use client\"` to the layout",
        "Wrap the input in `<Suspense>`",
        "Move the input into `app/dashboard/loading.tsx`",
      ],
      answer: [0],
      explanation: "Layouts persist and keep state across navigations. A template sits in the same spot but gets a unique key per segment, so its Client Components remount and reset.",
    },
    {
      id: "d1-06",
      level: "senior",
      domain: "d1",
      lesson: "d1-layouts",
      type: "order",
      prompt: "Within one route segment, order the special files from the outermost wrapper to the innermost.",
      items: ["`layout.tsx`", "`template.tsx`", "`error.tsx` (error boundary)", "`loading.tsx` (Suspense boundary)", "`not-found.tsx`", "`page.tsx`"],
      explanation: "The documented order, from outside in, is layout, template, error, loading, not-found, then page. The error boundary sits inside the layout, which is why it can't catch errors from the layout in its own folder.",
    },
    {
      id: "d1-07",
      level: "intermediate",
      domain: "d1",
      lesson: "d1-layouts",
      type: "lines",
      prompt: "This `app/dashboard/error.tsx` fails to build. Tap the buggy line.",
      code: `"use server"
import { useEffect } from "react"
export default function Error({
  error,
  retry,
}: {
  error: unknown
  retry: () => void
}) {
  useEffect(() => console.error(error), [error])
  return <button onClick={() => retry()}>Try again</button>
}`,
      codeLang: "tsx",
      answer: [1],
      explanation: "Error boundaries must be Client Components, so the file needs `\"use client\"`. `\"use server\"` marks Server Functions, which is the opposite.",
    },
    {
      id: "d1-08",
      level: "senior",
      domain: "d1",
      lesson: "d1-layouts",
      prompt: "`app/dashboard/layout.tsx` throws while rendering. Both `app/error.tsx` and `app/dashboard/error.tsx` exist. Which one shows?",
      options: [
        "`app/error.tsx`, because an error boundary doesn't wrap the layout in its own folder",
        "`app/dashboard/error.tsx`, because it's the closest error file to the layout that threw",
        "Both render, nested",
        "Neither: layout errors always go to `global-error.tsx`",
      ],
      answer: [0],
      explanation: "`error.tsx` sits inside the layout of its own segment, so it can't catch that layout's errors. The error bubbles to the parent segment's boundary. Only the root layout needs `global-error.tsx`.",
    },
    {
      id: "d1-09",
      level: "junior",
      domain: "d1",
      lesson: "d1-layouts",
      prompt: "Which statements about the root layout are true? (Choose two.)",
      options: [
        "It must render `<html>` and `<body>` tags",
        "An `app` directory must have one",
        "You should add `<title>` and `<meta>` tags to it by hand",
        "It re-renders on every client navigation",
        "It must be a Client Component",
      ],
      answer: [0, 1],
      explanation: "The root layout is required and defines `<html>` and `<body>`. Head tags come from the Metadata API, layouts don't re-render on navigation, and layouts are Server Components by default.",
    },
    {
      id: "d1-10",
      level: "intermediate",
      domain: "d1",
      lesson: "d1-navigation",
      type: "lines",
      prompt: "This App Router component throws when it renders. Tap the buggy line.",
      code: `"use client"
import { useRouter } from "next/router"
export function BackButton() {
  const router = useRouter()
  return <button onClick={() => router.back()}>Back</button>
}`,
      codeLang: "tsx",
      answer: [2],
      explanation: "`next/router` is the Pages Router. In the App Router, import `useRouter` (and `usePathname`, `useSearchParams`) from `next/navigation`.",
    },
    {
      id: "d1-11",
      level: "junior",
      domain: "d1",
      lesson: "d1-navigation",
      prompt: "What does `<Link href=\"/blog\">` give you that a plain `<a href=\"/blog\">` does not?",
      options: [
        "Prefetching when the link is visible, plus a client-side transition that keeps shared layouts",
        "A server-side 307 redirect",
        "Automatic `generateStaticParams` for the target route, so its page is always built ahead of time",
        "It turns off caching for the target route",
      ],
      answer: [0],
      explanation: "`<Link>` prefetches routes as they enter the viewport and navigates without a full page reload, preserving shared layouts and their state.",
    },
    {
      id: "d1-12",
      level: "senior",
      domain: "d1",
      lesson: "d1-navigation",
      prompt: "This layout crashes because `searchParams` is `undefined`. Why, and what should the teammate do instead?",
      code: `// app/shop/layout.tsx
export default async function Layout({ children, searchParams }) {
  const { tab } = await searchParams
  return <Tabs active={tab}>{children}</Tabs>
}`,
      codeLang: "tsx",
      options: [
        "Layouts don't re-render on navigation, so they don't get `searchParams`; read it in the page or with `useSearchParams` in a Client Component",
        "`searchParams` must be awaited twice in layouts, once for the layout and once for each child page, or the value stays as the first one it saw on load",
        "They need to add `\"use client\"` to the layout",
        "Only route handlers can read query strings",
      ],
      answer: [0],
      explanation: "Layouts persist across navigations, so a query value there would go stale. Pages receive `searchParams`; Client Components can use `useSearchParams`.",
    },
    {
      id: "d1-13",
      level: "intermediate",
      domain: "d1",
      lesson: "d1-navigation",
      type: "lines",
      prompt: "After saving, users see \"Could not save\" even though the post was created. Tap the line that causes it.",
      code: `"use server"
import { redirect } from "next/navigation"
export async function save(formData: FormData) {
  try {
    await db.post.create({ title: formData.get("title") })
    redirect("/posts")
  } catch {
    return { error: "Could not save" }
  }
}`,
      codeLang: "ts",
      answer: [6],
      explanation: "`redirect()` works by throwing a framework control-flow error. Inside `try`, the `catch` swallows it. Call `redirect` after the `try/catch` block.",
    },
    {
      id: "d1-14",
      level: "junior",
      domain: "d1",
      lesson: "d1-params",
      prompt: "How many pages does this route prerender at build time?",
      code: `// app/products/[category]/[id]/page.tsx
export function generateStaticParams() {
  return [
    { category: "shoes", id: "1" },
    { category: "shoes", id: "2" },
    { category: "hats", id: "1" },
  ]
}`,
      codeLang: "tsx",
      options: ["3", "2", "4", "6"],
      answer: [0],
      explanation: "Each object in the list becomes one page, so you get `/products/shoes/1`, `/products/shoes/2` and `/products/hats/1`.",
    },
    {
      id: "d1-15",
      level: "junior",
      domain: "d1",
      lesson: "d1-params",
      prompt: "Which Pages Router function does `generateStaticParams` replace?",
      options: ["`getStaticPaths`", "`getServerSideProps`", "`getInitialProps`", "`getStaticProps`"],
      answer: [0],
      explanation: "Both list the dynamic paths to build ahead of time. Loading the data itself now happens directly in async Server Components.",
    },
    {
      id: "d1-16",
      level: "intermediate",
      domain: "d1",
      lesson: "d1-params",
      type: "lines",
      prompt: "One of these prerendered paths breaks the build. Tap the buggy line.",
      code: `// app/docs/[...slug]/page.tsx
export function generateStaticParams() {
  return [
    { slug: "intro" },
    { slug: ["guides", "caching"] },
  ]
}`,
      codeLang: "tsx",
      answer: [4],
      explanation: "A catch-all segment's param is an array of strings. The first entry should be `{ slug: [\"intro\"] }`.",
    },
    {
      id: "d1-17",
      level: "intermediate",
      domain: "d1",
      lesson: "d1-layouts",
      type: "match",
      prompt: "Match each special file to its job.",
      pairs: [
        ["`loading.tsx`", "Instant fallback while the segment streams"],
        ["`error.tsx`", "Client error boundary with a `retry()` button"],
        ["`not-found.tsx`", "UI shown when `notFound()` is called"],
        ["`template.tsx`", "A layout that remounts on navigation"],
        ["`route.ts`", "HTTP handlers such as `GET` and `POST`"],
        ["`default.tsx`", "Fallback for a parallel-route slot"],
      ],
      explanation: "These are the App Router's file conventions. In Next.js 16, every parallel-route slot needs an explicit `default` file.",
    },
    {
      id: "d1-18",
      level: "staff",
      domain: "d1",
      lesson: "d1-layouts",
      prompt: "An app has no `app/layout.tsx`. Instead `app/(shop)/layout.tsx` and `app/(admin)/layout.tsx` each render `<html>`. What happens when a user navigates from a shop page to an admin page?",
      options: ["A full page load", "A client-side transition that keeps both layouts", "A build error: only one root layout is allowed", "The admin layout renders inside the shop layout"],
      answer: [0],
      explanation: "Route groups can create multiple root layouts. Moving across different root layouts can't reuse the document, so Next.js does a full page load.",
    },
    {
      id: "d1-19",
      level: "intermediate",
      domain: "d1",
      lesson: "d1-params",
      prompt: "Where does the `PageProps` type in this file come from?",
      code: `export default async function Page(props: PageProps<"/blog/[slug]">) {
  const { slug } = await props.params
  return <h1>{slug}</h1>
}`,
      codeLang: "tsx",
      options: [
        "It's a global helper generated by `next dev`, `next build`, or `next typegen`; no import needed",
        "You must import it from `\"next\"`",
        "You must declare it yourself in a `.d.ts` file, and import that file in every page that uses it",
        "It comes from `@types/react`",
      ],
      answer: [0],
      explanation: "Next.js generates `PageProps`, `LayoutProps`, and `RouteContext` from your route tree. They type `params` from the route literal you pass.",
    },
    {
      id: "d1-20",
      level: "junior",
      domain: "d1",
      lesson: "d1-navigation",
      prompt: "Which of these can only be used in a Client Component?",
      options: ["`usePathname()`", "`cookies()`", "`notFound()`", "`generateStaticParams()`"],
      answer: [0],
      explanation: "`usePathname` is a React hook, so it runs in Client Components. `cookies()` and `generateStaticParams` are server-side, and `notFound()` is called in Server Components, Server Functions, and Route Handlers.",
    },
    {
      id: "d1-21",
      level: "junior",
      domain: "d1",
      lesson: "d1-routing",
      prompt: "Which URL does `app/(marketing)/pricing/page.tsx` serve?",
      options: ["`/pricing`", "`/marketing/pricing`", "`/(marketing)/pricing`", "None until you add a `route.ts`"],
      answer: [0],
      explanation: "Folders in parentheses are route groups. They help you organise files, and can hold a layout, without adding anything to the URL.",
    },
    {
      id: "d1-22",
      level: "staff",
      domain: "d1",
      lesson: "d1-layouts",
      prompt: "You lead the move of a large Pages Router app to the App Router. Which plan matches how Next.js is designed to be adopted?",
      options: [
        "Migrate route by route: `app/` and `pages/` work side by side, so move pages over in small steps",
        "Freeze features and rewrite every page in one big-bang release",
        "Run two separate Next.js apps and merge them later",
        "Convert every page to a Client Component first, then rewrite them as Server Components",
      ],
      answer: [0],
      explanation: "The `app` directory is intentionally designed to work alongside `pages`, allowing incremental, page-by-page migration. Small steps keep risk and review size manageable.",
    },
    {
      id: "d1-23",
      level: "staff",
      domain: "d1",
      lesson: "d1-params",
      prompt: "A store has a million product pages. Builds must stay fast, and the top 1,000 sellers must be instant on first visit. What's the best strategy under Cache Components?",
      options: [
        "Return the top 1,000 from `generateStaticParams`; other URLs get the App Shell instantly and are filled in and cached after their first visit",
        "Return all one million params so every page is prerendered",
        "Render every product page in the browser with client-side fetching",
        "Skip `generateStaticParams` and give each page a 1-second `cacheLife`, so every one of the 50,000 product pages renders on demand and stays nearly fresh",
      ],
      answer: [0],
      explanation: "Prerender the URLs that matter most at build time. With ISR under Cache Components, unknown params are served the App Shell, upgraded in the background, and cached for the next visitor.",
    },
  ],

  cards: [
    { id: "c1-page", domain: "d1", kind: "service", term: "page.tsx", definition: "Makes a route segment publicly reachable and renders its UI. Receives `params` and `searchParams` as Promises." },
    { id: "c1-layout", domain: "d1", kind: "service", term: "layout.tsx", definition: "Shared UI around child segments. Keeps state and doesn't re-render on navigation. The root layout renders `<html>` and `<body>`." },
    { id: "c1-template", domain: "d1", kind: "service", term: "template.tsx", definition: "Like a layout, but rebuilt on every navigation. Its client state resets and its effects run again." },
    { id: "c1-loading", domain: "d1", kind: "service", term: "loading.tsx", definition: "Wraps the page in a Suspense boundary to show instant fallback UI while it streams." },
    { id: "c1-error", domain: "d1", kind: "service", term: "error.tsx", definition: "An error boundary for one route folder. It must be a Client Component, and it receives `error` and `retry()`." },
    { id: "c1-notfound", domain: "d1", kind: "service", term: "not-found.tsx", definition: "UI rendered when `notFound()` is called in the segment." },
    { id: "c1-gsp", domain: "d1", kind: "service", term: "generateStaticParams", definition: "Returns the params to prerender for dynamic segments at build time. Replaces `getStaticPaths`." },
    { id: "c1-pageprops", domain: "d1", kind: "service", term: "PageProps / LayoutProps", definition: "Global generated types: `PageProps<'/blog/[slug]'>` types `params` and `searchParams` for that route." },
    { id: "c1-link", domain: "d1", kind: "service", term: "<Link>", definition: "Extends `<a>` with prefetching and client-side transitions that keep shared layouts." },
    { id: "c1-userouter", domain: "d1", kind: "service", term: "useRouter (next/navigation)", definition: "Client hook for programmatic navigation: `push`, `replace`, `back`, `refresh`." },
    { id: "c1-dynamic", domain: "d1", kind: "concept", term: "Dynamic segments", definition: "`[slug]` matches one part of the URL. `[...slug]` matches one or more and gives an array. `[[...slug]]` matches zero or more." },
    { id: "c1-groups", domain: "d1", kind: "concept", term: "Route group `(name)`", definition: "A folder in parentheses organises routes without changing the URL; it can hold its own (even root) layout." },
    { id: "c1-private", domain: "d1", kind: "concept", term: "Private folder `_name`", definition: "A leading underscore opts the folder and its children out of routing, for colocated components and helpers." },
  ],
});
