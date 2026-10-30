// Lesson depth report for every course: `npx vite-node --config vitest.config.ts scripts/depth.ts`
import { COURSES } from "@/courses";
import { depthOf } from "@/engine/depth";

const rows = COURSES.map(depthOf).sort((a, b) => a.score - b.score);
console.table(rows);
