# AI Practitioner Quest

A gamified study app for the **AWS Certified AI Practitioner (AIF-C01)** exam, built with Next.js 16, React 19, and Tailwind CSS 4.

## Game modes

| Mode | What it does |
| --- | --- |
| 🗺️ **Five worlds** | One quest per exam domain. 10 questions, 3 hearts, combo multipliers, and up to 3 stars. |
| 🐉 **Boss Battle** | 40-question mock exam weighted by domain, 60-minute timer, scaled score 100–1000 (700 passes), per-domain breakdown and full answer review. |
| ⚡ **Lightning Round** | 60 seconds, as many as you can. Wrong answers cost 3 seconds. |
| 🧩 **Service Match** | Pair 8 AWS services with their use cases against the clock. |
| 🃏 **Flashcards** | Leitner-box spaced repetition over ~60 services and concepts, filterable by domain. |
| 🔁 **Review Mistakes** | Re-attempt every question whose last answer was wrong. |
| 📜 **Cheat Sheet** | Domains, customization ladder, inference parameters, metrics, responsible AI, and security on one page. |

Progression: XP, levels with titles, a daily XP goal, a day streak, 13 badges, and an exam-readiness score (mastery weighted by domain). All progress is saved in your browser's `localStorage`. There is no backend and no account.

Keyboard: `1`–`4` or `A`–`D` to answer, `Enter` for next, `Space` to flip flashcards, `←` / `→` to grade them.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

Production build:

```bash
npm run build
npm start
```

## Project layout

```
src/
  app/                 routes: /, /quest/[domain], /boss, /lightning, /match, /flashcards, /review, /cheatsheet
  components/          QuestionCard, QuizSession (quest/review engine), Hud + toasts, UI primitives
  data/
    domains.ts         the 5 exam domains and their weights
    questions.ts       question bank (single and multiple response)
    cards.ts           flashcards and Service Match pairs
  lib/
    store.ts           progress store (localStorage + useSyncExternalStore), XP, levels, badges
    game.ts            shuffling, weighted exam deck, scoring, mastery
    badges.ts          badge definitions
```

## Adding questions

Append to `QUESTIONS` in `src/data/questions.ts`. `answer` holds the indexes of the correct options; give two indexes for a "choose two" question. Options are shuffled at display time, so write them in any order.

```ts
{
  id: "d3-23",
  domain: "d3",
  prompt: "…",
  options: ["…", "…", "…", "…"],
  answer: [1],
  explanation: "…",
}
```

Not affiliated with or endorsed by Amazon Web Services. Check the official AWS exam guide for the current blueprint.
