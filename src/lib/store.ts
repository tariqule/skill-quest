"use client";

import { useSyncExternalStore } from "react";
import type { DomainId } from "@/data/domains";
import { BADGES, type BadgeId } from "./badges";

export interface QuestionStat {
  seen: number;
  correct: number;
  lastCorrect: boolean;
}

export interface Progress {
  xp: number;
  streak: { count: number; lastDay: string | null };
  today: { day: string | null; xp: number };
  dailyGoal: number;
  questions: Record<string, QuestionStat>;
  /** Leitner box per flashcard, 1 (new) to 5 (mastered). */
  cards: Record<string, number>;
  badges: BadgeId[];
  questStars: Partial<Record<DomainId, number>>;
  bossBest: number | null;
  lightningBest: number;
  matchBestSeconds: number | null;
  mistakesFixed: number;
}

const STORAGE_KEY = "aws-ai-quest:v1";

const INITIAL: Progress = {
  xp: 0,
  streak: { count: 0, lastDay: null },
  today: { day: null, xp: 0 },
  dailyGoal: 150,
  questions: {},
  cards: {},
  badges: [],
  questStars: {},
  bossBest: null,
  lightningBest: 0,
  matchBestSeconds: null,
  mistakesFixed: 0,
};

let state: Progress = INITIAL;
let loaded = false;
const listeners = new Set<() => void>();

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) state = { ...INITIAL, ...JSON.parse(raw) };
  } catch {
    // Storage unavailable or corrupt: start fresh.
  }
  // Roll over daily counters so render code never has to read the clock.
  const day = todayKey();
  if (state.today.day !== day) state = { ...state, today: { day, xp: 0 } };
  const last = state.streak.lastDay;
  if (last !== null && dayDiff(last, day) > 1) state = { ...state, streak: { count: 0, lastDay: last } };
}

function commit(next: Progress) {
  state = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore quota or privacy-mode errors; progress lives in memory.
  }
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  load();
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useProgress(): Progress {
  return useSyncExternalStore(
    subscribe,
    () => {
      load();
      return state;
    },
    () => INITIAL,
  );
}

export function getProgress() {
  load();
  return state;
}

// ───────────── Toasts (not persisted) ─────────────

export interface Toast {
  id: number;
  title: string;
  body?: string;
  icon: string;
}

let toasts: Toast[] = [];
const toastListeners = new Set<() => void>();
let toastSeq = 0;

export function pushToast(t: Omit<Toast, "id">) {
  const toast = { ...t, id: ++toastSeq };
  toasts = [...toasts, toast];
  toastListeners.forEach((l) => l());
  setTimeout(() => {
    toasts = toasts.filter((x) => x.id !== toast.id);
    toastListeners.forEach((l) => l());
  }, 3500);
}

export function useToasts() {
  return useSyncExternalStore(
    (l) => {
      toastListeners.add(l);
      return () => toastListeners.delete(l);
    },
    () => toasts,
    () => toasts,
  );
}

// ───────────── Levels ─────────────

const TITLES = [
  "Cloud Novice",
  "Prompt Apprentice",
  "Token Tamer",
  "Embedding Explorer",
  "Model Wrangler",
  "Bedrock Builder",
  "Guardrail Guardian",
  "RAG Ranger",
  "AI Practitioner",
  "Foundation Master",
];

/** Cumulative XP needed to reach a level: 0, 100, 300, 600, 1000, ... */
export function xpForLevel(level: number) {
  return (50 * (level - 1) * level);
}

export function levelInfo(xp: number) {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  return {
    level,
    title: TITLES[Math.min(level - 1, TITLES.length - 1)],
    into: xp - floor,
    needed: ceil - floor,
  };
}

// ───────────── Mutations ─────────────

export function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dayDiff(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

export function addXp(amount: number) {
  const s = getProgress();
  const day = todayKey();
  const prevLevel = levelInfo(s.xp).level;

  let streak = s.streak;
  if (streak.lastDay !== day) {
    const continued = streak.lastDay !== null && dayDiff(streak.lastDay, day) === 1;
    streak = { count: continued ? streak.count + 1 : 1, lastDay: day };
  }
  const today = s.today.day === day ? { day, xp: s.today.xp + amount } : { day, xp: amount };
  const xp = s.xp + amount;
  commit({ ...s, xp, streak, today });

  const next = levelInfo(xp);
  if (next.level > prevLevel) {
    pushToast({ icon: "⬆️", title: `Level ${next.level}!`, body: `You are now a ${next.title}` });
  }
  if (s.today.day === day && s.today.xp < s.dailyGoal && today.xp >= s.dailyGoal) {
    pushToast({ icon: "🎯", title: "Daily goal reached!", body: `${s.dailyGoal} XP today` });
  }
  if (streak.count >= 3) unlockBadge("streak-3");
  if (streak.count >= 7) unlockBadge("streak-7");
}

export function recordAnswer(questionId: string, correct: boolean) {
  const s = getProgress();
  const prev = s.questions[questionId];
  const fixedMistake = correct && prev !== undefined && !prev.lastCorrect;
  const stat: QuestionStat = {
    seen: (prev?.seen ?? 0) + 1,
    correct: (prev?.correct ?? 0) + (correct ? 1 : 0),
    lastCorrect: correct,
  };
  const mistakesFixed = s.mistakesFixed + (fixedMistake ? 1 : 0);
  commit({ ...s, questions: { ...s.questions, [questionId]: stat }, mistakesFixed });
  if (correct) unlockBadge("first-correct");
  if (mistakesFixed >= 10) unlockBadge("mistake-fixer");
}

export function unlockBadge(id: BadgeId) {
  const s = getProgress();
  if (s.badges.includes(id)) return;
  commit({ ...s, badges: [...s.badges, id] });
  const badge = BADGES.find((b) => b.id === id)!;
  pushToast({ icon: badge.icon, title: `Badge unlocked: ${badge.name}`, body: badge.description });
}

export function setQuestStars(domain: DomainId, stars: number) {
  const s = getProgress();
  const best = Math.max(s.questStars[domain] ?? 0, stars);
  const questStars = { ...s.questStars, [domain]: best };
  commit({ ...s, questStars });
  if (stars === 3) unlockBadge("perfect-quest");
  if (Object.keys(questStars).length === 5) unlockBadge("world-tour");
}

export function setCardBox(cardId: string, box: number) {
  const s = getProgress();
  const cards = { ...s.cards, [cardId]: Math.max(1, Math.min(5, box)) };
  commit({ ...s, cards });
  if (Object.values(cards).filter((b) => b >= 4).length >= 25) unlockBadge("card-shark");
}

export function recordBoss(score: number) {
  const s = getProgress();
  commit({ ...s, bossBest: Math.max(s.bossBest ?? 0, score) });
  if (score >= 700) unlockBadge("boss-slayer");
  if (score >= 900) unlockBadge("legend");
}

export function recordLightning(correct: number) {
  const s = getProgress();
  commit({ ...s, lightningBest: Math.max(s.lightningBest, correct) });
  if (correct >= 12) unlockBadge("lightning");
}

export function recordMatch(seconds: number) {
  const s = getProgress();
  const best = s.matchBestSeconds === null ? seconds : Math.min(s.matchBestSeconds, seconds);
  commit({ ...s, matchBestSeconds: best });
  if (seconds <= 45) unlockBadge("speed-matcher");
}

export function setDailyGoal(goal: number) {
  commit({ ...getProgress(), dailyGoal: goal });
}

export function resetProgress() {
  commit(INITIAL);
}
