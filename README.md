# SkillQuest

Learn tech by playing: visual, beginner-friendly courses for cloud and AI certifications, learning to code, and coding interviews, built with Next.js 16, React 19, and Tailwind CSS 4. Every course works at every level, from "never done this before" up.

The app is a **course engine**. Each certification is a self-contained content package under `src/courses/`, and the engine (mission map, lessons, trials, exam simulator, training games, study guide, progress) works for any of them. It ships with:

| Course | Status |
| --- | --- |
| ☁️ AWS Certified AI Practitioner (AIF-C01) | ✅ Full course: 5 worlds, 40 missions, 8 labs, 13 hands-on challenges, 443 questions, 126 flashcards. Follows the [exam guide v1.2](https://docs.aws.amazon.com/aws-certification/latest/ai-practitioner-01/ai-practitioner-01.html) (October 2026). |
| ☁️ AWS Certified Developer – Associate (DVA-C03) | ✅ Full course: 4 worlds, 29 missions, 4 labs, 7 hands-on challenges, 192 questions, 97 flashcards, including AI-assisted development and calling Amazon Bedrock from code. Follows the [DVA-C03 exam guide](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-03/developer-associate-03.html). Registration opens December 1, 2026. |
| ☁️ AWS Certified Developer – Associate (DVA-C02) | ✅ Full course: 4 worlds, 24 missions, 3 labs, 5 hands-on challenges, 160 questions, 82 flashcards. Follows the [exam guide v2.1](https://docs.aws.amazon.com/aws-certification/latest/developer-associate-02/developer-associate-02.html). DVA-C02 can be taken until November 30, 2026; DVA-C03 opens December 1, 2026. |
| 🔷 Google Cloud Generative AI Leader | ✅ Full course: 4 worlds, 22 missions, 2 labs, 2 hands-on challenges, 137 questions, 54 flashcards. Follows the [official exam guide](https://services.google.com/fh/files/misc/generative_ai_leader_exam_guide_english.pdf) (current product names). |
| ☁️ AWS Certified Cloud Practitioner (CLF-C02) | ✅ Full course: 4 worlds, 24 missions, 6 hands-on challenges, 167 questions, 148 flashcards. |
| ☁️ AWS Certified Solutions Architect – Associate (SAA-C03) | ✅ Full course: 4 worlds, 26 missions, 4 hands-on challenges, 190 questions, 137 flashcards. |
| 🟦 Microsoft Azure AI Fundamentals (AI-901) | ✅ Full course: 2 worlds, 14 missions, 4 hands-on challenges, 140 questions, 57 flashcards. AI-901 replaced AI-900, which retired June 30, 2026. |
| ☸️ Kubernetes and Cloud Native Associate (KCNA) | ✅ Full course: 4 worlds, 23 missions, 4 hands-on challenges, 150 questions, 83 flashcards. Percentage scored, pass at 75%. |

### Code Quests (interview prep)

A separate section at `/code` with its own terminal and arcade look, a 3D galaxy of tracks (click a planet to open one), filters for **Interview**, **Learning**, or **All** tracks plus topic categories, and a search box (press `/`) that looks through track names, tags, stages, lesson titles, and flashcard terms. Each track has 4 stages, 16 levels, labs and challenges (learning tracks teach a skill from zero; interview tracks prep for the questions), and questions tagged junior, intermediate, senior, or staff. Players pick a difficulty (or all levels) once on the Code Quests page for every track, or per track on its map, and every game, from trials to the mock interview, then draws only questions at that level.

| Track | Questions | Flashcards | Challenges |
| --- | --- | --- | --- |
| 🟨 JavaScript | 110 | 54 | 4 |
| 🔷 TypeScript | 94 | 52 | 4 |
| 🧱 Data Structures | 94 | 52 | 4 |
| 🧮 Algorithms | 94 | 54 | 2 |
| ⚛️ React | 105 | 55 | 4 |
| ▲ Next.js (16) | 95 | 51 | 3 |
| 🟢 Node.js | 101 | 60 | 4 |
| 🐍 Python | 103 | 54 | 4 |
| ☕ Java | 101 | 59 | 7 |
| 🎨 HTML & CSS (learning) | 103 | 57 | 9 |
| 🗄️ SQL (learning) | 111 | 62 | 8 |
| 🌿 Git & GitHub (learning) | 98 | 48 | 6 |
| 🐳 Docker (learning) | 99 | 50 | 7 |
| 🐹 Go | 102 | 52 | 7 |
| 🏗️ System Design | 92 | 50 | 5 |

## How it plays: teach first, then test

1. **Home** (`/`): three steps. *What do you want to do?* (get certified, learn to code, prepare for an interview), *How much do you know already?* (Beginner to Staff; certifications offer Beginner or "I know the basics"), then *Your picks* with one "Start here" course. The answers are saved as a profile (`engine/profile.ts`) and every course for that goal starts at the chosen level. Returning visitors see "Continue where you left off". Each course keeps its own progress and level.
2. **Intro briefing** (`/c/<course>/start`): what the exam is, who it's for, the question types, the domains, and a daily goal. Shown on first visit.
3. **Mission map** (`/c/<course>`): one world per exam domain. Each **mission** teaches one concept with a visual or a hands-on lab, then checks it. Miss a check and you get a quick recap of every key point (plus the answers you missed), then a **timed challenge** you must pass to finish the mission; failing it loops back through the recap.
4. **World trial**: a short quiz with hearts. A star unlocks the next world. Already know a world? Skip to its trial.
5. **Study mode** (`/c/<course>/study`): for learners who want to read before any questions. Pick a world and a study time (5–20 minutes, or no timer), and browse every concept with its visuals, labs, key points, and key terms. When the time is up, or whenever you're ready, an **interactive play session** follows: questions with full feedback ("your answer" vs the correct one, plus a "revisit the concept" panel that re-opens the lesson's visual or lab, available on every question across the app), mixed with **hands-on challenges** where you reach a goal inside a lab ("make 5 generations identical", "catch every fraud", "lock down the assistant with Guardrails"). It ends with a results report covering every concept, question, and challenge.
6. **Certification Gate** (`/c/<course>/exam`): a simulator in the real exam format: question count, unscored questions, timer, flag and navigate, every question type, the official score scale, and a per-domain report.

Also in every course: a **study guide** drawer (📖 button or `?` key) with exam facts, every task statement and the missions that teach it, a searchable glossary, in-scope services, and tips; plus a **training deck** of replayable challenges (fix mistakes, timed drill, flashcards, service match, lightning round, boss battle, cheat sheet).

### Levels and the Beginner path

Every course has levels (`engine/levels.ts`). Code Quest tracks use Beginner, Junior, Intermediate, Senior, Staff and Everything; certifications use Beginner, Exam level (everything that isn't beginner) and Everything. `effectiveLevel()` maps a shared choice onto each kind of course.

- **Beginner** shows each world's "Start here" lessons (`level: "beginner"`) as the path and the rest as "after the basics" (`engine/path.ts`). Trials give 5 hearts (`config.quest.beginnerHearts`), and the timed drill, boss and lightning round are hidden (`BEGINNER_LOCKED` in `engine/modes.ts`). The practice exam asks first.
- On higher levels the basics stay available as optional lessons and never block the path.
- **Level up** (`engine/levelup.ts`): once every "Start here" lesson is done and 80% of beginner questions are right, the map offers the next level (Junior, or Exam level on certifications). Players can pick any level at any time.
- Every course needs at least 2 beginner lessons and 4 beginner questions per domain (16 in total); `npm test` checks it.

### Mini games

Every world has a small 3D game built from its own flashcards and questions at the player's level (`components/three/games/`): **Gem Catch**, **Memory Match**, **True or False Bins** and **Tower Builder**, rotated by world. They appear on the map (🎮 Mini game, `/c/<course>/game/<domain>`), as an optional break every three concepts in study mode, and on the "study session complete" screen. Each 3D piece also has a plain tap button, so the games work without WebGL. Best scores and a little XP are saved per world, with a badge for playing them all.

### Writing style (voice lint)

Course text is written like a person explaining it: full sentences, "you", an everyday example for each idea, terms defined the first time. `engine/voice.ts` (run by `npm test`) fails on buzzwords ("delve", "leverage", "seamless", "it's important to note" and others), em dashes, note shorthand in prose (arrows, " = ", "e.g."), lesson points over 40 words, and `**bold**` in titles or summaries (bold renders only in rich text such as points, tips and explanations).

Progress is saved in the browser's `localStorage`. There is no backend and no account.

## Run locally

Requires Node.js 20.9 or newer.

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm test        # validate every course's content
npm run lint
npm run typecheck   # next typegen (route types like LayoutProps) then tsc --noEmit; works on a fresh clone
npm run build
```

## Architecture

```
src/
  engine/                 course-agnostic logic; never imports a specific course
    types.ts              the Course contract and every content type
    config.ts             default game settings (XP, hearts, timers, exam modes, …)
    define.ts             defineCourse() / defineDomain() helpers for authors
    modes.ts              training-deck challenge registry
    validate.ts           content checks run by `npm test`
    store.ts              per-course progress store (localStorage)
    path.ts               mission map unlock rules
    game.ts               shuffling, weighted exam decks, scoring, mastery
    course-context.tsx    <CourseProvider>, useCourse(), useLevelPool()
    coding.ts             live coding runner (sandboxed worker) and test helpers
    levels.ts             skill levels for interview tracks (junior … staff, all)
    copy.ts               certification, interview, and learning wording ("exam" / "mock interview" / "skill check")
    tracks.ts             Code Quest kinds, hub categories, and search
  components/             course-agnostic UI
    QuestionCard.tsx      choice, multiple-response, ordering, matching, bug hunt (tap the line)
    QuizSession.tsx       trial / review engine
    TimedQuiz.tsx         per-question countdown quiz (lesson challenges, Timed drill)
    ChallengeCard.tsx     wraps any lab with a goal, hint, and takeaway
    Guide.tsx             study guide drawer and page
    learn/blocks.tsx      reusable lesson blocks: Flow, Tiles, Layers, Ladder, ServiceRows, LabHeader
    learn/code.tsx        CodeBlock, CodeCompare, dedent, RichText (`inline code` in any text)
    code/ui.tsx           Code Quest skin: CodeRain, TerminalWindow, Typewriter, LevelPicker
    three/                WebGL scenes (three.js + React Three Fiber), loaded client-side only:
                          Galaxy3D (catalog and hub), Orb3D (course core), TrackCore3D (track map), Burst3D (celebrations).
                          Each falls back to the CSS version without WebGL and holds still for reduced motion.
    fx.tsx                3D core, tilt cards, confetti, starfield, Nimbus the mascot
  courses/
    index.ts              course registry and "coming soon" catalog
    _template/            copy this to start a new course
    aws-aif-c01/
      index.ts            course metadata: exam format, guide, cheat sheet, theme
      domains/            one file per exam domain: tasks, lessons, questions, flashcards
      visuals.tsx         course-specific diagrams
      labs.tsx            course-specific hands-on labs
  app/
    page.tsx              course catalog
    code/page.tsx         Code Quests hub
    c/[course]/           every course page: map, start, lesson, quest, exam, guide, games
```

The rule: `engine/` and `components/` know nothing about AWS, GCP, Azure, or Kubernetes. Everything specific to a certification lives in its course folder.

## Adding a course

1. Copy `src/courses/_template` to `src/courses/<course-id>/`.
2. Fill in `index.ts` from the official exam guide: provider, code, exam format (question count, unscored, minutes, score scale, question types), facts, candidate, in-scope services, tips, cheat sheet.
3. Create one file per exam domain in `domains/` (copy `d1-example.tsx`). Domain weights must total 100.
4. Register it in `src/courses/index.ts` (and remove its "planned" entry if there was one).
5. Run `npm test`. The validator reports anything wrong, by id.

Percentage-scored exams (for example Kubernetes) just use a different scale: `scale: { min: 0, max: 100, pass: 66 }`.

When an exam version is replaced, set `lifecycle` on both courses, for example `lifecycle: { retires: "2026-11-30", successor: "aws-dva-c03" }` on the old one and `lifecycle: { opens: "2026-12-01", predecessor: "aws-dva-c02" }` on the new one. The catalog shows badges and each mission map shows a banner linking the two versions; `npm test` checks that the ids exist.

List every question format the course uses in `exam.questionTypes`. Mark a format `practiceOnly: true` when the real exam doesn't use it (for example ordering and matching on DVA-C02): the exam simulator then leaves those questions out, while missions, trials, and drills still use them. `npm test` checks that every question's format is listed and that each exam mode has enough official-format questions.

### Adding a Code Quest track

Set `kind: "interview"` (interview prep) or `kind: "learning"` (learn the skill from scratch) in the course's `index.ts`, plus a hub `category` (`"languages" | "frontend" | "backend" | "cs" | "data" | "tools"`) and a few search `tags`. The track then appears in the Code Quests hub instead of the certification catalog, uses the terminal skin and the matching wording, and shows the difficulty picker. Every question and lesson needs a `level` (`"junior" | "intermediate" | "senior" | "staff"`), and `npm test` requires at least 12 questions per level.

Questions can carry a snippet: `code` plus `codeLang` shows it under the prompt. A `type: "lines"` question is a bug hunt: the player taps the broken line(s) in `code`, and `answer` lists the 1-based line numbers. The validator rejects answers that point at a blank line or a lone brace, and a prompt with more than one answer line must say how many to pick.

### Question types and live coding on Code Quest tracks

Besides multiple choice, multiple response, ordering, matching and bug hunts, Code Quest tracks can use two code-first formats (they are always allowed in the mock interview, no `questionTypes` entry needed):

- **`type: "fill"`**: a snippet with `{{1}}`, `{{2}}`… markers; each blank has 3 to 5 options and an `answer` index.
- **`type: "output"`**: the player types what the code prints or returns; `answers` lists every accepted spelling (multi-line output joins lines with a newline; spacing noise is ignored). Typed text travels through the same `number[]` as every other answer (`encodeText` / `decodeText` in `engine/game.ts`).

Put extra questions in the track's `more.ts` and add them with `withQuestions(domains, moreQuestions)` from `engine/define.ts`.

**Live coding** (`coding: [...]` on `defineCourse`) adds a "Live coding" card to the track map and a `/coding` page. Each `CodingChallenge` has a prompt, a starter, a function name `fn`, tests (JSON `args` / `expected`, some `hidden`), progressive hints, a reference solution and an explanation. Player code is plain JavaScript run in a sandboxed Web Worker with a 3-second limit (`engine/coding.ts`); the runner is one plain-JS string so `npm test` runs every reference solution against its tests in Node and checks that the starter fails. Use `T.set`, `T.map`, `T.nan`, `T.undefined` from `engine/coding.ts` for values JSON can't hold. XP per first solve is `config.xp.codingSolved` minus a penalty per hint.

## Adding content to a course

Everything for a domain is in one file, e.g. `src/courses/aws-aif-c01/domains/d3-foundation-model-apps.tsx`.

**Questions** (options, steps, and responses are shuffled at display time):

```ts
// Multiple choice / multiple response: `answer` holds the correct option indexes.
{ id: "d3-30", domain: "d3", lesson: "d3-params", prompt: "…", options: ["…", "…", "…", "…"], answer: [1], explanation: "…" }

// Ordering: `items` in the correct order.
{ id: "d3-31", domain: "d3", lesson: "d3-prompts", type: "order", prompt: "…", items: ["first", "second", "third"], explanation: "…" }

// Matching: [prompt, correct response] pairs.
{ id: "d3-32", domain: "d3", lesson: "d3-eval", type: "match", prompt: "…", pairs: [["ROUGE", "Summaries"], ["BLEU", "Translation"]], explanation: "…" }
```

Every question has a `lesson` field naming the concept it tests (any lesson id in the course). It powers the **Revisit the concept** panel shown after each answer and the per-concept results in Study mode, and `npm test` fails if a question is missing it.

**Missions**: add to `lessons` with a title, the exam `task` it covers, a `visual` (compose blocks from `components/learn/blocks.tsx`, or a custom diagram or lab from the course folder), key `points`, an optional `tip`, and the ids of the `check` questions.

**Flashcards**: add to `cards`. Cards with `kind: "service"` also appear in Service Match.

**Labs and diagrams**: write a component in the course's `labs.tsx` or `visuals.tsx` (use `LabHeader` for a consistent header) and drop it into a lesson's `visual`.

**Hands-on challenges**: give a lab a `goal` prop (type it with `GoalProps<"myGoal">` from `components/learn/blocks.tsx`) and call `onSolved()` from an event handler when the player achieves it. Then add an entry to the domain's `challenges`:

```tsx
{
  id: "ch-deterministic",
  domain: "d3",
  lesson: "d3-params",                 // concept it practises
  title: "Make it deterministic",
  goal: "Set the dials so Generate 5× gives 5 identical answers.",
  hint: "Temperature or Top K can remove all randomness.",
  takeaway: "Temperature 0 always picks the most likely token.",
  render: (onSolved) => <TemperatureLab goal="identical" onSolved={onSolved} />,
}
```

When the exam guide changes, update the domain files and the `guide.source` version in `index.ts`, then run `npm test`.

## Configuring the games

Every tunable number has a default in `src/engine/config.ts`. A course overrides any subset in its definition:

```ts
config: {
  quest: { length: 12, hearts: 5, starThresholds: [0.9, 0.75, 0.6] },
  lightning: { seconds: 90 },
  lesson: { timedChallenge: { questions: 5, secondsPerQuestion: 20, passShare: 0.8 } },
  timed: { questions: 15, secondsPerQuestion: 15 },
  study: { minuteOptions: [10, 25, 45, 0], defaultMinutes: 25, playQuestions: 10, challengeEvery: 3 },
  xp: { lessonComplete: 30 },
  examModes: [{ id: "full", name: "Full simulation", icon: "🏛️", questions: 60, unscored: 0, minutes: 120, full: true }],
},
modes: ["review", "flashcards", "lightning", "boss", "cheatsheet"], // which training-deck challenges to show
boss: { name: "The Pod Eviction", emoji: "🐙" },
levelTitles: ["Pod Novice", "Container Crafter", "…"],
```

## Adding a training-deck challenge

1. Add its id to `ModeId` in `src/engine/types.ts`.
2. Register it in `ALL_MODES` in `src/engine/modes.ts` (name, icon, route, status line).
3. Build the page at `src/app/c/[course]/<route>/page.tsx` using `useCourse()` for content, settings, and the store.
4. Add any settings it needs to `GameConfig` and `DEFAULT_CONFIG`.

Courses show every registered mode unless they list `modes` explicitly.

---

Practice questions are original and written against each official exam guide; they are not the providers' own exam questions. Not affiliated with or endorsed by AWS, Google, Microsoft, or the CNCF.
