import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const MOTION_PATHS = [
  { name: "framer-motion", message: "Use the `motion` package (`motion/react`)." },
  { name: "motion/react", importNames: ["motion"], message: "Use `m` from motion/react inside <MotionProvider> (LazyMotion strict)." },
  { name: "motion/react-client", message: "Use `m` from motion/react inside <MotionProvider> (LazyMotion strict)." },
];
/** Course content lives on the server: client code reads it through /api/v1 or Server Component props. */
const SERVER_ONLY_PATTERNS = [
  {
    group: ["@/courses", "@/courses/*", "@/scenarios", "@/scenarios/*", "@/server/*"],
    message: "Course content is server-only. Use @/api/client (useCourses, courseSummary) or take it as a prop from a Server Component.",
  },
];

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Motion: LazyMotion strict + m.* only (keeps the bundle small; see src/design/motion.ts).
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { paths: MOTION_PATHS, patterns: SERVER_ONLY_PATTERNS }],
    },
  },
  // Server side of the boundary: the repository, route handlers, Server Component pages and layouts,
  // the content itself, and tests. (Client pages are caught by src/server/boundary.test.ts.)
  {
    files: [
      "src/server/**",
      "src/courses/**",
      "src/scenarios/**",
      "src/engine/define.ts",
      "src/app/api/**",
      "src/app/**/page.tsx",
      "src/app/**/layout.tsx",
      "src/app/sitemap.ts",
      "src/proxy.ts",
      "src/test/**",
      "src/**/*.test.{ts,tsx}",
    ],
    rules: { "no-restricted-imports": ["error", { paths: MOTION_PATHS }] },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
