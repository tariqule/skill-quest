import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Motion: LazyMotion strict + m.* only (keeps the bundle small; see src/design/motion.ts).
  {
    files: ["src/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": [
        "error",
        {
          paths: [
            { name: "framer-motion", message: "Use the `motion` package (`motion/react`)." },
            { name: "motion/react", importNames: ["motion"], message: "Use `m` from motion/react inside <MotionProvider> (LazyMotion strict)." },
            { name: "motion/react-client", message: "Use `m` from motion/react inside <MotionProvider> (LazyMotion strict)." },
          ],
        },
      ],
    },
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
