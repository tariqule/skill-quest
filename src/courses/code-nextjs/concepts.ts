/**
 * Key Next.js concepts, used by the "teach before test" check.
 * If a question's prompt or correct answer mentions a concept, some lesson at or
 * before the question's lesson must mention it too. Add an entry when you add a
 * question about something new, then teach it in a lesson.
 */
export const CONCEPTS: [string, RegExp][] = [
  ["App Router", /App Router|\bapp\/|app directory/i],
  ["layout", /layout/i],
  ["page.tsx", /page\.(tsx|js)/i],
  ["dynamic route", /\[\w+\]|dynamic (route|segment)/i],
  ["catch-all", /\[\.\.\./],
  ["route group", /route group|\(\w+\)\//i],
  ["Link", /<Link|next\/link/],
  ["Server Component", /server component/i],
  ["Client Component", /client component/i],
  ["\"use client\"", /use client/i],
  ["\"use server\"", /use server/i],
  ["hydration", /hydrat/i],
  ["environment variable", /NEXT_PUBLIC|env/i],
  ["loading.tsx", /loading\.(tsx|js)/i],
  ["error.tsx", /error\.(tsx|js)|error boundar/i],
  ["Suspense / streaming", /suspense|stream/i],
  ["revalidate", /revalidat/i],
  ["\"use cache\"", /use cache/i],
  ["static vs dynamic rendering", /static|dynamic rendering|prerender/i],
  ["Server Action", /server action|server function/i],
  ["Route Handler", /route handler|route\.(ts|js)/i],
  ["proxy / middleware", /proxy|middleware/i],
  ["metadata", /metadata/i],
  ["next/image", /next\/image|<Image/],
  ["generateStaticParams", /generateStaticParams/],
  ["notFound", /notFound|not-found/],
];
