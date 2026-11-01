import type { Metadata } from "next";
import { AppBar } from "@/components/Hud";

export const metadata: Metadata = { title: "Credits · SkillQuest" };

const LIBRARIES = [
  { name: "ts-fsrs", url: "https://github.com/open-spaced-repetition/ts-fsrs", license: "MIT", use: "FSRS spaced-repetition scheduler behind Daily Review" },
  { name: "Next.js", url: "https://github.com/vercel/next.js", license: "MIT", use: "App framework" },
  { name: "React", url: "https://github.com/facebook/react", license: "MIT", use: "UI" },
  { name: "three.js", url: "https://github.com/mrdoob/three.js", license: "MIT", use: "3D scenes" },
  { name: "React Three Fiber and drei", url: "https://github.com/pmndrs/react-three-fiber", license: "MIT", use: "React bindings for three.js" },
  { name: "Tailwind CSS", url: "https://github.com/tailwindlabs/tailwindcss", license: "MIT", use: "Styling" },
  { name: "Vitest", url: "https://github.com/vitest-dev/vitest", license: "MIT", use: "Tests" },
  { name: "Magic UI Particles", url: "https://github.com/magicuidesign/magicui", license: "MIT", use: "Canvas particle drift and celebration burst (adapted)" },
];

const CONTENT = [
  { name: "System Design Primer (Donne Martin)", url: "https://github.com/donnemartin/system-design-primer", license: "CC BY 4.0", use: "Further reading on system design lessons" },
  { name: "Kubernetes documentation", url: "https://kubernetes.io/docs/", license: "CC BY 4.0", use: "Further reading on KCNA lessons" },
  { name: "MDN Web Docs", url: "https://developer.mozilla.org/", license: "CC BY-SA 2.5", use: "Further reading on web lessons" },
  { name: "Official exam guides (AWS, Google Cloud, Microsoft, CNCF)", url: "https://aws.amazon.com/certification/", license: "Linked, not copied", use: "Domain weights and task statements are paraphrased; we link to the source" },
];

function Table({ rows }: { rows: typeof LIBRARIES }) {
  return (
    <ul className="mt-3 grid gap-2">
      {rows.map((r) => (
        <li key={r.name} className="rounded-card border border-border bg-card p-4">
          <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-base font-semibold text-primary underline underline-offset-4">
            {r.name}
          </a>
          <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-sm text-foreground">{r.license}</span>
          <p className="mt-1 text-sm text-muted-foreground">{r.use}</p>
        </li>
      ))}
    </ul>
  );
}

export default function Credits() {
  return (
    <>
    <AppBar />
    <main className="mx-auto w-full max-w-3xl px-4 py-8 text-base">
      <h1 className="text-3xl font-semibold text-foreground">Credits</h1>
      <p className="mt-2 text-muted-foreground">
        SkillQuest is built on open-source software and open educational content. Lessons that draw on an outside source list it in a Sources footer. Practice questions are written for SkillQuest and are not real exam questions.
      </p>
      <h2 className="mt-8 text-xl font-semibold text-foreground">Libraries</h2>
      <Table rows={LIBRARIES} />
      <h2 className="mt-8 text-xl font-semibold text-foreground">Content and references</h2>
      <Table rows={CONTENT} />
      <p className="mt-6 text-sm text-muted-foreground">AWS, Google Cloud, Microsoft Azure, Kubernetes and CNCF are trademarks of their owners. SkillQuest isn&apos;t affiliated with or endorsed by them.</p>
    </main>
    </>
  );
}
