/**
 * SkillQuest design tokens: the single source of truth.
 * `src/styles/tokens.css` mirrors these values as CSS variables; `tokens.test.ts`
 * fails the build if the two drift or a text/background pair drops below WCAG AA.
 */

export const palette = {
  /** Brand: education teal (UI UX Pro Max, MIT, nextlevelbuilder/ui-ux-pro-max-skill). */
  teal: { 300: "#5EEAD4", 400: "#2DD4BF", 500: "#14B8A6", 600: "#0D9488", 700: "#0F766E" },
  /** Rewards (XP, streaks, stars): course amber. */
  amber: { 300: "#FCD34D", 400: "#FBBF24", 500: "#F59E0B", 600: "#D97706", 700: "#B45309" },
  slate: {
    50: "#F8FAFC", 100: "#F1F5F9", 200: "#E2E8F0", 300: "#CBD5E1", 400: "#94A3B8",
    500: "#64748B", 600: "#475569", 700: "#334155", 800: "#1E293B", 900: "#0F172A", 950: "#020617",
  },
  red: { 400: "#F87171", 600: "#DC2626", 700: "#B91C1C" },
  green: { 400: "#4ADE80", 700: "#15803D" },
  blue: { 400: "#60A5FA", 700: "#1D4ED8" },
  white: "#FFFFFF",
  black: "#000000",
} as const;

export type ThemeName = "dark" | "light";

/** Semantic colour roles, named to match shadcn / coss ui CSS variables. */
export const colors = {
  dark: {
    background: palette.slate[950],
    foreground: palette.slate[200],
    card: palette.slate[900],
    "card-foreground": palette.slate[100],
    popover: palette.slate[900],
    "popover-foreground": palette.slate[100],
    primary: palette.teal[400],
    "primary-foreground": palette.slate[950],
    secondary: palette.slate[800],
    "secondary-foreground": palette.slate[100],
    muted: palette.slate[800],
    "muted-foreground": palette.slate[400],
    accent: palette.slate[800],
    "accent-foreground": palette.slate[100],
    reward: palette.amber[400],
    "reward-foreground": palette.slate[950],
    destructive: palette.red[400],
    "destructive-foreground": palette.red[400],
    success: palette.green[400],
    "success-foreground": palette.green[400],
    info: palette.blue[400],
    "info-foreground": palette.blue[400],
    warning: palette.amber[400],
    "warning-foreground": palette.amber[400],
    border: "rgb(255 255 255 / 0.1)",
    input: "rgb(255 255 255 / 0.15)",
    ring: palette.teal[400],
  },
  light: {
    background: palette.slate[50],
    foreground: palette.slate[900],
    card: palette.white,
    "card-foreground": palette.slate[900],
    popover: palette.white,
    "popover-foreground": palette.slate[900],
    primary: palette.teal[700],
    "primary-foreground": palette.white,
    secondary: palette.slate[100],
    "secondary-foreground": palette.slate[900],
    muted: palette.slate[100],
    "muted-foreground": palette.slate[600],
    accent: palette.slate[100],
    "accent-foreground": palette.slate[900],
    reward: palette.amber[700],
    "reward-foreground": palette.white,
    destructive: palette.red[600],
    "destructive-foreground": palette.red[700],
    success: palette.green[700],
    "success-foreground": palette.green[700],
    info: palette.blue[700],
    "info-foreground": palette.blue[700],
    warning: palette.amber[700],
    "warning-foreground": palette.amber[700],
    border: palette.slate[200],
    input: palette.slate[300],
    ring: palette.teal[600],
  },
} as const satisfies Record<ThemeName, Record<string, string>>;

export type ColorRole = keyof (typeof colors)["dark"];

/** Text-on-surface pairs that must meet WCAG AA (4.5:1) in every theme. */
export const contrastPairs: ReadonlyArray<[fg: ColorRole, bg: ColorRole]> = [
  ["foreground", "background"],
  ["card-foreground", "card"],
  ["popover-foreground", "popover"],
  ["primary-foreground", "primary"],
  ["secondary-foreground", "secondary"],
  ["muted-foreground", "background"],
  ["muted-foreground", "muted"],
  ["accent-foreground", "accent"],
  ["reward-foreground", "reward"],
  ["destructive-foreground", "background"],
  ["success-foreground", "background"],
  ["info-foreground", "background"],
  ["warning-foreground", "background"],
  ["primary", "background"],
  ["reward", "background"],
];

/** Type scale (ratio ~1.2, px). Body on reading surfaces is `body` (18px). */
export const typeScale = {
  caption: { size: 14, line: 1.45 },
  ui: { size: 16, line: 1.5 },
  body: { size: 18, line: 1.6 },
  h4: { size: 22, line: 1.35 },
  h3: { size: 26, line: 1.3 },
  h2: { size: 32, line: 1.2 },
  h1: { size: 40, line: 1.1 },
} as const;

/** Minimum font size anywhere in redesigned UI (px). */
export const MIN_FONT_PX = 14;

/** 4px spacing grid. */
export const space = { 1: 4, 2: 8, 3: 12, 4: 16, 6: 24, 8: 32, 12: 48, 16: 64 } as const;

/** Semantic radii (px). Tailwind's own rounded-* scale is left untouched. */
export const radius = { control: 6, card: 10, sheet: 16 } as const;

/** Three elevation levels: surface tint + hairline; no glow. */
export const elevation = {
  1: "0 1px 2px rgb(0 0 0 / 0.2)",
  2: "0 4px 12px rgb(0 0 0 / 0.25)",
  3: "0 12px 32px rgb(0 0 0 / 0.35)",
} as const;
