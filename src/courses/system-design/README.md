# System design curriculum

Content for the System Design course (`src/courses/code-system-design`), kept as plain data.

- `curriculum.ts`: the 68-topic syllabus in study order, with modules, prerequisites, tagging
  patterns and any older lessons that stand in until a topic is written.
- `schema.ts`: the `TopicContent` type and `validateTopic`, which every topic must pass.
- `modules/<module>/<topic>.ts`: one topic per file: screens (one idea each, at least one worked
  example), a quiz of 3 multiple choice + 2 true/false (one true, one false), practice items and
  sources. No React.
- `registry.ts`: the list of written topics.

The course adapter (`code-system-design/topics.tsx`) turns topics into lessons and questions,
derives each topic's status, and tags older questions with concepts.

## Add a topic

1. Pick its id from `curriculum.ts` (e.g. `t-lb`) and create `modules/m2-traffic/lb.ts`
   exporting a `TopicContent` as default. Copy an M1 file for the shape.
2. Write in your own words and credit what you drew on in `sources`.
3. Add one import and one entry to `TOPIC_CONTENT` in `registry.ts`, in study order.
4. Run `npx vitest run src/courses/system-design src/courses/code-system-design`. The tests check
   the schema, the registry, teach-before-test, answer balance and giveaway options.
5. Run `npx vitest run src/engine/answer-keys.test.ts`, check the new answers in the diff, then
   accept them with `-u`.

Practice questions unlock once every topic they're tagged with is finished, so tag with the
fewest topics that are really needed (`practiceNeeds`).
