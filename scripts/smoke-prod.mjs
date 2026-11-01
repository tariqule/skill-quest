#!/usr/bin/env node
/**
 * Production smoke test for the BFF data paths (home plan card, Daily Review).
 *
 *   npm run build && npx next start -p 3102 &
 *   npx --yes --package=playwright@1 node scripts/smoke-prod.mjs [baseUrl]   (default http://localhost:3102)
 *
 * Playwright is not a project dependency (Apache-2.0); it is pulled in only to run this script.
 * Set CHROME_PATH to use an installed Chrome instead of Playwright's own browser.
 *
 * Steps, in a fresh browser profile at 390x844 and 1280x800:
 *   1. Build a plan in the home wizard (exam, SAA-C03) and check "Today" resolves: no loading
 *      skeleton and no error within 15 s, and the plan card links into the course.
 *   2. Miss one check question in a lesson (so Daily Review has something due), then open /daily
 *      and answer that item.
 * Set SMOKE_SHOTS=<dir> to also save screenshots of each resolved screen.
 * Exits non-zero on the first failure, with a screenshot in ./smoke-failures/.
 */
import { mkdirSync } from "node:fs";
import { createRequire } from "node:module";

const BASE = (process.argv[2] ?? process.env.BASE_URL ?? "http://localhost:3102").replace(/\/$/, "");
const COURSE = "aws-saa-c03";
const LESSON = "d2-route53";
const TIMEOUT = 15_000;
const SHOTS = process.env.SMOKE_SHOTS;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });
const shot = (page, name) => (SHOTS ? page.screenshot({ path: `${SHOTS}/${name}.png`, fullPage: true }) : undefined);

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require("playwright"));
} catch {
  console.error("playwright not found. Run: npx --yes --package=playwright@1 node scripts/smoke-prod.mjs");
  process.exit(2);
}

const busy = (page) => page.locator('[aria-busy="true"]');
const alert = (page) => page.locator('main [role="alert"]');

async function expectSettled(page, what) {
  await busy(page).first().waitFor({ state: "detached", timeout: TIMEOUT }).catch(() => {
    throw new Error(`${what}: still showing a loading skeleton after ${TIMEOUT / 1000}s`);
  });
  if (await alert(page).count()) throw new Error(`${what}: error state: ${(await alert(page).first().innerText()).trim()}`);
}

async function buildPlan(page) {
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const wizard = page.getByRole("form", { name: /build your plan/i }).or(page.locator("form").filter({ has: page.getByText("What are you preparing for?") }));
  await wizard.getByRole("radio", { name: /an exam/i }).click();
  await wizard.getByRole("button", { name: /^next/i }).click();
  await page.locator("#plan-target").selectOption(COURSE);
  const level = wizard.getByRole("radio", { name: /intermediate|some experience/i });
  if (await level.count()) await level.first().click();
  await wizard.getByRole("button", { name: /^next/i }).click();
  const date = page.locator("#plan-date");
  if (await date.count()) await date.fill(new Date(Date.now() + 60 * 864e5).toISOString().slice(0, 10));
  await wizard.locator('button[type="submit"]').click();
}

async function checkToday(page) {
  await page.getByText(/here's today's plan/i).waitFor({ timeout: TIMEOUT });
  await expectSettled(page, "Today");
  await page.locator(`main a[href^="/c/${COURSE}"]`).first().waitFor({ timeout: TIMEOUT });
  // Survives a reload (content comes from the HTTP cache or a fresh fetch, never a stuck skeleton).
  await page.reload({ waitUntil: "networkidle" });
  await expectSettled(page, "Today after reload");
  await shot(page, `home-with-plan-${page.viewportSize().width}`);
}

/** Answer the lesson's first check question wrongly, so it is due in Daily Review. */
async function missOne(page) {
  const res = await page.request.get(`${BASE}/api/v1/courses/${COURSE}/lessons/${LESSON}`);
  if (!res.ok()) throw new Error(`lesson API ${res.status()}`);
  const { data } = await res.json();
  await page.goto(`${BASE}/c/${COURSE}/lesson/${LESSON}`, { waitUntil: "networkidle" });
  // Step through the lesson cards until one of its check questions shows (the lesson picks which).
  const candidates = data.questions.filter((x) => x.options && x.answer?.length === 1);
  let q;
  for (let i = 0; i < 30 && !q; i++) {
    for (const c of candidates) if (await page.getByText(c.prompt.slice(0, 40), { exact: false }).first().isVisible()) q = c;
    if (q) break;
    await page.getByRole("button", { name: /^(next|continue|finished reading|i'm ready|start)/i }).first().click();
    await page.waitForTimeout(250);
  }
  if (!q) throw new Error("lesson: no check question appeared");
  const wrong = q.options.find((_, i) => !q.answer.includes(i));
  await page.locator("main").getByRole("button", { name: wrong.slice(0, 40) }).or(page.locator("main [role=radio]").filter({ hasText: wrong.slice(0, 40) })).first().click();
  const check = page.locator("main").getByRole("button", { name: /^(check|submit)/i });
  if (await check.count()) await check.first().click();
  await page.waitForTimeout(500);
  return q;
}

async function answerDaily(page, q) {
  await page.goto(`${BASE}/daily`, { waitUntil: "networkidle" });
  await expectSettled(page, "Daily Review");
  if (await page.getByText(/nothing due right now/i).count()) throw new Error("Daily Review: the missed question is not due");
  await page.getByText(q.prompt.slice(0, 40), { exact: false }).first().waitFor({ timeout: TIMEOUT });
  await shot(page, `daily-${page.viewportSize().width}`);
  const right = q.options[q.answer[0]];
  await page.locator("main").getByRole("button", { name: right.slice(0, 40) }).or(page.locator("main [role=radio]").filter({ hasText: right.slice(0, 40) })).first().click();
  const check = page.locator("main").getByRole("button", { name: /^(check|submit)/i });
  if (await check.count()) await check.first().click();
  await page.getByText(/correct|exactly|right/i).first().waitFor({ timeout: TIMEOUT });
  await shot(page, `daily-answered-${page.viewportSize().width}`);
}

const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
let failed = false;
for (const [name, viewport] of [["mobile", { width: 390, height: 844 }], ["desktop", { width: 1280, height: 800 }]]) {
  const context = await browser.newContext({ viewport, colorScheme: "dark" });
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  const step = async (label, fn) => {
    try {
      const out = await fn();
      if (errors.length) throw new Error(`page error: ${errors.join("; ")}`);
      console.log(`ok   ${name} ${label}`);
      return out;
    } catch (e) {
      mkdirSync("smoke-failures", { recursive: true });
      await page.screenshot({ path: `smoke-failures/${name}-${label.replace(/\W+/g, "-")}.png`, fullPage: true }).catch(() => {});
      console.error(`FAIL ${name} ${label}: ${e.message}`);
      failed = true;
      throw e;
    }
  };
  try {
    await step("build plan", () => buildPlan(page));
    await step("today resolves", () => checkToday(page));
    const q = await step("miss a lesson check", () => missOne(page));
    await step("answer a daily item", () => answerDaily(page, q));
  } catch {
    // reported above
  }
  await context.close();
}
await browser.close();
process.exit(failed ? 1 : 0);
