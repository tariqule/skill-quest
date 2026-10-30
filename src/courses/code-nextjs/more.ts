import type { Question } from "@/engine/types";

/** Extra fill-in-the-blank and type-the-output questions for the Next.js track (Next.js 16, App Router). */
export const moreQuestions: Question[] = [
  // ───────────── fill ─────────────
  {
    id: "nextjs-fx-01",
    type: "fill",
    domain: "d1",
    lesson: "d1-navigation",
    level: "junior",
    prompt: "Fill the gap so this App Router Client Component imports its router hook from the right module.",
    code: `"use client";
import { useRouter } from "next/{{1}}";

export function BackButton() {
  const router = useRouter();
  return <button onClick={() => router.back()}>Back</button>;
}`,
    codeLang: "tsx",
    blanks: [{ options: ["navigation", "router", "link", "server"], answer: 0 }],
    explanation: "In the App Router, `useRouter`, `usePathname`, `useSearchParams`, and `redirect` come from `next/navigation`. `next/router` is the Pages Router's module and does not work in `app/`.",
  },
  {
    id: "nextjs-fx-02",
    type: "fill",
    domain: "d1",
    lesson: "d1-routing",
    level: "junior",
    prompt: "Fill the gap so `/blog/hello` and `/blog/world` both reach this page, with the last segment available as `slug`.",
    code: `app/
└── blog/
    └── {{1}}/
        └── page.tsx`,
    codeLang: "files",
    blanks: [{ options: ["[slug]", "(slug)", "@slug", "_slug"], answer: 0 }],
    explanation: "Square brackets make a dynamic segment: `[slug]` matches one URL segment and passes it as `params.slug`. Parentheses make a route group (no URL segment), `@` makes a parallel-route slot, and a leading underscore makes a private folder.",
  },
  {
    id: "nextjs-fx-03",
    type: "fill",
    domain: "d1",
    lesson: "d1-params",
    level: "intermediate",
    prompt: "Fill the gap to read the route parameter. In Next.js 16, `params` is a Promise.",
    code: `export default async function Page(props: PageProps<"/blog/[slug]">) {
  const { slug } = {{1}} props.params;
  return <h1>{slug}</h1>;
}`,
    codeLang: "tsx",
    blanks: [{ options: ["await", "use", "yield", "new"], answer: 0 }],
    explanation: "`params` and `searchParams` are Promises, so an async Server Component awaits them. React's `use(props.params)` is the equivalent for synchronous components and Client Components, but it isn't used inside an `async` function.",
  },
  {
    id: "nextjs-fx-04",
    type: "fill",
    domain: "d1",
    lesson: "d1-layouts",
    level: "intermediate",
    prompt: "Fill the gap with the directive an `error.tsx` file must have.",
    code: `{{1}};

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return <button onClick={reset}>Try again</button>;
}`,
    codeLang: "tsx",
    blanks: [{ options: ['"use client"', '"use server"', '"use cache"', '"use strict"'], answer: 0 }],
    explanation: "Error boundaries are class-based React features that need state and an event handler (`reset`), so `error.tsx` must be a Client Component.",
  },
  {
    id: "nextjs-fx-05",
    type: "fill",
    domain: "d2",
    lesson: "d2-env",
    level: "intermediate",
    prompt: "Fill the gap so importing this module from a Client Component fails the build instead of leaking the secret.",
    code: `import {{1}};

export function getApiKey() {
  return process.env.API_KEY;
}`,
    codeLang: "ts",
    blanks: [{ options: ['"server-only"', '"client-only"', '"use server"', '"next/server"'], answer: 0 }],
    explanation: "The `server-only` package throws at build time if the module ends up in a client bundle. `client-only` is its mirror image, and `\"use server\"` marks Server Functions rather than blocking imports.",
  },
  {
    id: "nextjs-fx-06",
    type: "fill",
    domain: "d2",
    lesson: "d2-interleave",
    level: "intermediate",
    prompt: "Fill the gap so a Server Component can be passed into this Client Component and rendered inside it.",
    code: `"use client";
import type { ReactNode } from "react";

export function Panel(props: { children: ReactNode }) {
  return <section>{props.{{1}}}</section>;
}`,
    codeLang: "tsx",
    blanks: [{ options: ["children", "render", "component", "slot"], answer: 0 }],
    explanation: "A Server Parent can render `<Panel><ServerThing /></Panel>`. The Server Component renders on the server, and the Client Component receives the result as `children`, so it never imports server code.",
  },
  {
    id: "nextjs-fx-07",
    type: "fill",
    domain: "d3",
    lesson: "d3-fetching",
    level: "junior",
    prompt: "Fill the gap so the two independent requests run at the same time instead of one after the other.",
    code: `const [artist, albums] = await Promise.{{1}}([
  getArtist(id),
  getAlbums(id),
]);`,
    codeLang: "ts",
    blanks: [{ options: ["all", "race", "any", "resolve"], answer: 0 }],
    explanation: "`Promise.all` starts both requests immediately and resolves with both results in order, which avoids a request waterfall. `race` and `any` would give you a single winner.",
  },
  {
    id: "nextjs-fx-08",
    type: "fill",
    domain: "d3",
    lesson: "d3-use-cache",
    level: "intermediate",
    prompt: "Fill the gap so this function's result is cached (Cache Components) for an hour-scale lifetime.",
    code: `import { cacheLife } from "next/cache";

async function getRates() {
  {{1}};
  cacheLife("hours");
  return fetch("https://api.example.com/rates").then((r) => r.json());
}`,
    codeLang: "ts",
    blanks: [{ options: ['"use cache"', '"use server"', '"use memo"', '"cache"'], answer: 0 }],
    explanation: "With `cacheComponents` enabled, the `\"use cache\"` directive at the top of an async function caches its return value, and `cacheLife` picks the lifetime profile. It must be the first statement of the function.",
  },
  {
    id: "nextjs-fx-09",
    type: "fill",
    domain: "d3",
    lesson: "d3-revalidate",
    level: "senior",
    prompt: "A webhook route handler marks `posts` stale. Fill the gap with the second argument Next.js 16 expects (the recommended profile).",
    code: `import { revalidateTag } from "next/cache";

export async function POST() {
  revalidateTag("posts", {{1}});
  return Response.json({ ok: true });
}`,
    codeLang: "ts",
    blanks: [{ options: ['"max"', '"all"', "true", '"now"'], answer: 0 }],
    explanation: "In Next.js 16, `revalidateTag` takes a cache-life profile as its second argument. `\"max\"` is the recommended one, and it gives stale-while-revalidate behaviour. The one-argument form is deprecated, and `\"all\"` and `\"now\"` aren't profiles.",
  },
  {
    id: "nextjs-fx-10",
    type: "fill",
    domain: "d3",
    lesson: "d3-revalidate",
    level: "staff",
    prompt: "Fill the gap so the user who clicks Publish sees their own change on the very next render (read-your-writes).",
    code: `"use server";
import { updateTag, revalidateTag, refresh, revalidatePath } from "next/cache";

export async function publish(id: string) {
  await db.post.update(id, { published: true });
  {{1}}("posts");
}`,
    codeLang: "ts",
    blanks: [{ options: ["updateTag", "revalidateTag", "refresh", "revalidatePath"], answer: 0 }],
    explanation: "`updateTag` is for Server Actions and expires the tagged entries immediately, so the next request waits for fresh data instead of seeing stale content. `revalidateTag` serves stale data while it refreshes, `refresh` only refreshes uncached data, and `revalidatePath` expects a path, not a tag.",
  },
  {
    id: "nextjs-fx-11",
    type: "fill",
    domain: "d3",
    lesson: "d3-use-cache",
    level: "staff",
    prompt: "Fill the gap so this component renders at request time, because it needs a fresh value, even though it reads no cookies or headers.",
    code: `import { connection } from "next/server";

async function Stamp() {
  await {{1}}();
  return <p>{Date.now()}</p>;
}`,
    codeLang: "tsx",
    blanks: [{ options: ["connection", "preload", "refresh", "notFound"], answer: 0 }],
    explanation: "With Cache Components, `await connection()` explicitly defers a component to request time (for random values, timestamps, or other per-request work) without touching request data. Put it behind `<Suspense>` so the rest of the page stays in the static shell.",
  },
  {
    id: "nextjs-fx-12",
    type: "fill",
    domain: "d4",
    lesson: "d4-actions",
    level: "junior",
    prompt: "Fill the gaps so submitting the form calls the Server Function with the form's data.",
    code: `export default function Page() {
  async function create(formData: FormData) {
    {{1}};
    await db.todo.create({ title: String(formData.get("title")) });
  }
  return <form {{2}}={create}><input name="title" /></form>;
}`,
    codeLang: "tsx",
    blanks: [
      { options: ['"use server"', '"use client"', '"use cache"', '"use action"'], answer: 0 },
      { options: ["action", "onSubmit", "method", "formAction"], answer: 0 },
    ],
    explanation: "`\"use server\"` as the first line of the async function marks it as a Server Function. Passing it to the form's `action` prop makes React submit the form to it with a `FormData`. `onSubmit` is a client event handler and would not run on the server.",
  },
  {
    id: "nextjs-fx-13",
    type: "fill",
    domain: "d4",
    lesson: "d4-route-handlers",
    level: "senior",
    prompt: "Fill the gap to read the dynamic segment in a Route Handler. In Next.js 16 it arrives as a Promise.",
    code: `export async function GET(
  _req: Request,
  ctx: RouteContext<"/api/posts/[id]">,
) {
  const { id } = await ctx.{{1}};
  return Response.json({ id });
}`,
    codeLang: "ts",
    blanks: [{ options: ["params", "query", "searchParams", "route"], answer: 0 }],
    explanation: "A Route Handler's second argument carries `params` (a Promise, like in pages). Query-string values come from `new URL(req.url).searchParams` or `request.nextUrl`, not from the context.",
  },
  {
    id: "nextjs-fx-14",
    type: "fill",
    domain: "d4",
    lesson: "d4-proxy",
    level: "senior",
    prompt: "Fill the gap with the export name that Next.js 16's `proxy.ts` file expects.",
    code: `import { NextResponse, type NextRequest } from "next/server";

export function {{1}}(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}
export const config = { matcher: "/dashboard/:path*" };`,
    codeLang: "ts",
    blanks: [{ options: ["proxy", "middleware", "handler", "GET"], answer: 0 }],
    explanation: "Next.js 16 renamed Middleware to Proxy: the file is `proxy.ts` and it exports a function named `proxy` (or a default export). `middleware` was the old name, `GET` belongs in Route Handlers, and `handler` isn't a convention.",
  },
  {
    id: "nextjs-fx-15",
    type: "fill",
    domain: "d4",
    lesson: "d4-polish",
    level: "intermediate",
    prompt: "Fill the gap so `next/image` may load images from `https://cdn.example.com`.",
    code: `import type { NextConfig } from "next";

const config: NextConfig = {
  images: {
    {{1}}: [{ protocol: "https", hostname: "cdn.example.com" }],
  },
};
export default config;`,
    codeLang: "ts",
    blanks: [{ options: ["remotePatterns", "domains", "hosts", "sources"], answer: 0 }],
    explanation: "`images.remotePatterns` is the current, more specific allow-list (protocol, hostname, port, path). `domains` is the deprecated hostname-only form, and `hosts` and `sources` are not options.",
  },

  // ───────────── output ─────────────
  {
    id: "nextjs-ox-01",
    type: "output",
    domain: "d1",
    lesson: "d1-routing",
    level: "junior",
    prompt: "This helper models App Router URLs: route groups `(x)` and parallel slots `@x` don't appear in the URL. Type the logged line.",
    code: `const files = [
  "app/(shop)/cart/page.tsx",
  "app/blog/[slug]/page.tsx",
  "app/@modal/login/page.tsx",
];
const url = (f: string) =>
  "/" + f.replace(/^app\\//, "").replace(/\\/page\\.tsx$/, "").split("/")
    .filter((s) => !s.startsWith("(") && !s.startsWith("@")).join("/");
console.log(files.map(url).join(" "));`,
    codeLang: "ts",
    answers: ["/cart /blog/[slug] /login"],
    explanation: "`(shop)` is a route group and `@modal` is a parallel-route slot: neither adds a URL segment. The dynamic folder `[slug]` is part of the pattern, so it stays in the route.",
  },
  {
    id: "nextjs-ox-02",
    type: "output",
    domain: "d1",
    lesson: "d1-params",
    level: "intermediate",
    prompt: "For `app/docs/[...slug]/page.tsx` and the URL `/docs/a/b/c`, type the number this logs.",
    code: `async function Page(props: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await props.params;
  return slug.length;
}
Page({ params: Promise.resolve({ slug: ["a", "b", "c"] }) }).then(console.log);`,
    codeLang: "ts",
    answers: ["3"],
    explanation: "A catch-all segment `[...slug]` gives an array of every remaining segment, here `[\"a\", \"b\", \"c\"]`. `params` is a Promise in Next.js 16, hence the `await`.",
  },
  {
    id: "nextjs-ox-03",
    type: "output",
    domain: "d2",
    lesson: "d2-env",
    level: "junior",
    prompt: "Only `NEXT_PUBLIC_` variables are inlined into the browser bundle. This models that filter. Type the logged line.",
    code: `const env = { NEXT_PUBLIC_API: "https://api.test", DB_URL: "postgres://x" };
const clientEnv = Object.fromEntries(
  Object.entries(env).filter(([k]) => k.startsWith("NEXT_PUBLIC_")),
);
console.log(Object.keys(clientEnv).join());`,
    codeLang: "ts",
    answers: ["NEXT_PUBLIC_API"],
    explanation: "Only keys with the `NEXT_PUBLIC_` prefix survive, so `DB_URL` (a secret) never reaches the client. Everything else is empty in browser code.",
  },
  {
    id: "nextjs-ox-04",
    type: "output",
    domain: "d2",
    lesson: "d2-use-client",
    level: "senior",
    prompt: "`\"use client\"` is added to `Counter` only. Everything it imports joins the client bundle. Type the logged line (comma-separated, no spaces).",
    code: `const imports: Record<string, string[]> = {
  page: ["Header", "Counter"],
  Counter: ["Button", "format"],
  Header: ["Logo"],
};
const client = (n: string): string[] => [n, ...(imports[n] ?? []).flatMap(client)];
console.log([...new Set(["Counter"].flatMap(client))].join());`,
    codeLang: "ts",
    answers: ["Counter,Button,format"],
    explanation: "The directive marks the boundary: `Counter` and the modules it imports (`Button`, `format`) become client code. `Header` and `Logo` are imported by the Server Component page, so they stay on the server.",
  },
  {
    id: "nextjs-ox-05",
    type: "output",
    domain: "d3",
    lesson: "d3-fetching",
    level: "intermediate",
    prompt: "This is a tiny version of React's `cache()` (per-request memoization). Type what it logs (a number and a boolean).",
    code: `let calls = 0;
const memo = <A, R>(fn: (a: A) => R) => {
  const seen = new Map<A, R>();
  return (a: A): R => {
    if (!seen.has(a)) seen.set(a, fn(a));
    return seen.get(a) as R;
  };
};
const getUser = memo((id: number) => { calls++; return { id }; });
const a = getUser(1), b = getUser(1), c = getUser(2);
console.log(calls, a === b);`,
    codeLang: "ts",
    answers: ["2 true"],
    explanation: "Two different ids mean two real calls, for `1` and `2`. The repeated `getUser(1)` reuses the saved result and returns the very same object, so `a === b`. React's `cache()` does this for each request, so several components can ask for the same data cheaply.",
  },
  {
    id: "nextjs-ox-06",
    type: "output",
    domain: "d3",
    lesson: "d3-revalidate",
    level: "staff",
    prompt: "This models stale-while-revalidate with a 10 s lifetime. Type the three values logged, separated by spaces.",
    code: `let source = "v1";
const cache = { data: "v0", at: 0 };
function get(now: number, ttl: number) {
  const hit = cache.data;
  if (now - cache.at > ttl) {
    cache.data = source;
    cache.at = now;
  }
  return hit;
}
console.log(get(0, 10), get(11, 10), get(12, 10));`,
    codeLang: "ts",
    answers: ["v0 v0 v1"],
    explanation: "At time 0 the entry is fresh. At 11 it is stale: the visitor still gets the old `v0`, and that request triggers the refresh. By time 12 the refreshed `v1` is served. That 'serve stale, refresh behind' sequence is what `revalidateTag(tag, \"max\")` and `cacheLife` revalidation do.",
  },
  {
    id: "nextjs-ox-07",
    type: "output",
    domain: "d4",
    lesson: "d4-actions",
    level: "intermediate",
    prompt: "A Server Action that returns an error as a value (the shape `useActionState` expects). Type the logged text.",
    code: `type State = { error?: string };
async function save(prev: State, data: FormData): Promise<State> {
  const name = String(data.get("name") ?? "");
  return name.length < 3 ? { error: "too short" } : {};
}
const fd = new FormData();
fd.append("name", "Al");
save({}, fd).then((s) => console.log(s.error ?? "ok"));`,
    codeLang: "ts",
    answers: ["too short"],
    explanation: "\"Al\" has 2 characters, so the action returns `{ error: \"too short\" }` instead of throwing. Returning expected errors as values lets `useActionState` show them. Thrown errors are for real bugs.",
  },
  {
    id: "nextjs-ox-08",
    type: "output",
    domain: "d4",
    lesson: "d4-route-handlers",
    level: "senior",
    prompt: "Route Handlers use the Web `Request` and `Response` APIs. Type the logged line (a status, a space, and the body text).",
    code: `export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  return Response.json({ page: Number(searchParams.get("page") ?? 1) + 1 });
}
GET(new Request("http://x.test/api?page=4"))
  .then(async (r) => console.log(r.status, await r.text()));`,
    codeLang: "ts",
    answers: ['200 {"page":5}'],
    explanation: "`searchParams.get(\"page\")` is the string `\"4\"`, `Number` makes it 4, plus one is 5. `Response.json` sets status 200 and serializes the body without spaces.",
  },
  {
    id: "nextjs-ox-09",
    type: "output",
    domain: "d4",
    lesson: "d4-proxy",
    level: "staff",
    prompt: "A common `proxy.ts` matcher skips API and static paths. Type the four digits logged. A 1 means the proxy runs for that path, and a 0 means it doesn't.",
    code: `const matcher = /^\\/((?!api|_next\\/static|_next\\/image|favicon\\.ico).*)$/;
const paths = ["/", "/api/users", "/dashboard", "/_next/static/a.js"];
console.log(paths.map((p) => (matcher.test(p) ? 1 : 0)).join(""));`,
    codeLang: "ts",
    answers: ["1010"],
    explanation: "The negative lookahead rejects any path starting with `api` or `_next/static`, so `/api/users` and `/_next/static/a.js` give 0. `/` and `/dashboard` pass. Excluding those paths keeps the proxy from running on assets and API calls it doesn't need to see.",
  },
];
