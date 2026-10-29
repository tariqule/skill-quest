"use client";

import { useSyncExternalStore } from "react";
import { BADGES, type BadgeId } from "./badges";
import type { Course } from "./types";
import { pushToast } from "./ui-state";

export interface QuestionStat {
  seen: number;
  correct: number;
  lastCorrect: boolean;
}

/** Everything saved for one course. Each course keeps its own copy under its storage key. */
export interface Progress {
  xp: number;
  streak: { count: number; lastDay: string | null };
  today: { day: string | null; xp: number };
  dailyGoal: number;
  questions: Record<string, QuestionStat>;
  /** Leitner box per flashcard, 1 (new) to 5 (mastered). */
  cards: Record<string, number>;
  badges: BadgeId[];
  /** Best trial stars per domain id. */
  questStars: Record<string, number>;
  bossBest: number | null;
  lightningBest: number;
  matchBestSeconds: number | null;
  mistakesFixed: number;
  onboarded: boolean;
  examBest: number | null;
  examAttempts: number;
  /** Lesson ids finished on the learning path. */
  lessonsDone: string[];
  /** Minutes spent in study sessions, per domain id. */
  studyMinutes: Record<string, number>;
  /** Lessons opened in a study session. */
  studied: string[];
  challengesSolved: string[];
}

export const INITIAL_PROGRESS: Progress = {
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
  onboarded: false,
  examBest: null,
  examAttempts: 0,
  lessonsDone: [],
  studyMinutes: {},
  studied: [],
  challengesSolved: [],
};

// ───────────── Levels ─────────────

const DEFAULT_TITLES = ["Novice", "Apprentice", "Explorer", "Pathfinder", "Specialist", "Builder", "Guardian", "Ranger", "Practitioner", "Master"];

/** Cumulative XP needed to reach a level: 0, 100, 300, 600, 1000, ... */
export function xpForLevel(level: number) {
  return 50 * (level - 1) * level;
}

export function levelInfo(xp: number, titles: string[] = DEFAULT_TITLES) {
  let level = 1;
  while (xp >= xpForLevel(level + 1)) level++;
  const floor = xpForLevel(level);
  const ceil = xpForLevel(level + 1);
  return { level, title: titles[Math.min(level - 1, titles.length - 1)], into: xp - floor, needed: ceil - floor };
}

// ───────────── Dates ─────────────

export function todayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function dayDiff(a: string, b: string) {
  return Math.round((new Date(b).getTime() - new Date(a).getTime()) / 86_400_000);
}

/** Read a course's saved progress without subscribing (e.g. for the course catalog). */
export function peekProgress(storageKey: string): Progress | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(storageKey);
    return raw ? { ...INITIAL_PROGRESS, ...JSON.parse(raw) } : null;
  } catch {
    return null;
  }
}

// ───────────── Per-course store ─────────────

export type CourseStore = ReturnType<typeof buildStore>;

const stores = new Map<string, CourseStore>();

/** One store per course, created on first use and kept for the session. */
export function getCourseStore(course: Course): CourseStore {
  let s = stores.get(course.id);
  if (!s) {
    s = buildStore(course);
    stores.set(course.id, s);
  }
  return s;
}

function buildStore(course: Course) {
  const key = course.storageKey;
  const totalLessons = Object.values(course.lessons).flat().length;
  const { pass, max } = course.exam.scale;
  const legendScore = Math.round(pass + ((max - pass) * 2) / 3);

  let state: Progress = INITIAL_PROGRESS;
  let loaded = false;
  const listeners = new Set<() => void>();

  function load() {
    if (loaded || typeof window === "undefined") return;
    loaded = true;
    state = peekProgress(key) ?? INITIAL_PROGRESS;
    // Roll over daily counters so render code never has to read the clock.
    const day = todayKey();
    if (state.today.day !== day) state = { ...state, today: { day, xp: 0 } };
    const last = state.streak.lastDay;
    if (last !== null && dayDiff(last, day) > 1) state = { ...state, streak: { count: 0, lastDay: last } };
  }

  function commit(next: Progress) {
    state = next;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
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

  function get() {
    load();
    return state;
  }

  function useProgress(): Progress {
    return useSyncExternalStore(subscribe, get, () => INITIAL_PROGRESS);
  }

  function unlockBadge(id: BadgeId) {
    const s = get();
    if (s.badges.includes(id)) return;
    commit({ ...s, badges: [...s.badges, id] });
    const badge = BADGES.find((b) => b.id === id)!;
    pushToast({ icon: badge.icon, title: `Badge unlocked: ${badge.name}`, body: badge.description });
  }

  function addXp(amount: number) {
    const s = get();
    const day = todayKey();
    const prevLevel = levelInfo(s.xp, course.levelTitles).level;

    let streak = s.streak;
    if (streak.lastDay !== day) {
      const continued = streak.lastDay !== null && dayDiff(streak.lastDay, day) === 1;
      streak = { count: continued ? streak.count + 1 : 1, lastDay: day };
    }
    const today = s.today.day === day ? { day, xp: s.today.xp + amount } : { day, xp: amount };
    const xp = s.xp + amount;
    commit({ ...s, xp, streak, today });

    const next = levelInfo(xp, course.levelTitles);
    if (next.level > prevLevel) pushToast({ icon: "⬆️", title: `Level ${next.level}!`, body: `You are now a ${next.title}` });
    if (s.today.day === day && s.today.xp < s.dailyGoal && today.xp >= s.dailyGoal) {
      pushToast({ icon: "🎯", title: "Daily goal reached!", body: `${s.dailyGoal} XP today` });
    }
    if (streak.count >= 3) unlockBadge("streak-3");
    if (streak.count >= 7) unlockBadge("streak-7");
  }

  return {
    useProgress,
    get,
    unlockBadge,
    addXp,

    recordAnswer(questionId: string, correct: boolean) {
      const s = get();
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
    },

    setQuestStars(domain: string, stars: number) {
      const s = get();
      const questStars = { ...s.questStars, [domain]: Math.max(s.questStars[domain] ?? 0, stars) };
      commit({ ...s, questStars });
      if (stars === 3) unlockBadge("perfect-quest");
      if (course.domains.every((d) => (questStars[d.id] ?? 0) > 0)) unlockBadge("world-tour");
    },

    setCardBox(cardId: string, box: number) {
      const s = get();
      const cards = { ...s.cards, [cardId]: Math.max(1, Math.min(5, box)) };
      commit({ ...s, cards });
      if (Object.values(cards).filter((b) => b >= 4).length >= Math.min(25, course.cards.length)) unlockBadge("card-shark");
    },

    recordBoss(score: number) {
      const s = get();
      commit({ ...s, bossBest: Math.max(s.bossBest ?? 0, score) });
      if (score >= pass) unlockBadge("boss-slayer");
      if (score >= legendScore) unlockBadge("legend");
    },

    recordExam(score: number, full: boolean) {
      const s = get();
      commit({ ...s, examBest: Math.max(s.examBest ?? 0, score), examAttempts: s.examAttempts + 1 });
      if (full && score >= pass) unlockBadge("certified");
    },

    recordLightning(correct: number) {
      const s = get();
      commit({ ...s, lightningBest: Math.max(s.lightningBest, correct) });
      if (correct >= course.config.lightning.badgeAt) unlockBadge("lightning");
    },

    recordMatch(seconds: number) {
      const s = get();
      const best = s.matchBestSeconds === null ? seconds : Math.min(s.matchBestSeconds, seconds);
      commit({ ...s, matchBestSeconds: best });
      if (seconds <= course.config.match.badgeSeconds) unlockBadge("speed-matcher");
    },

    completeOnboarding(dailyGoal?: number) {
      const s = get();
      commit({ ...s, onboarded: true, dailyGoal: dailyGoal ?? s.dailyGoal });
      unlockBadge("orientation");
    },

    /** Returns true the first time a lesson is completed. */
    completeLesson(lessonId: string) {
      const s = get();
      if (s.lessonsDone.includes(lessonId)) return false;
      const lessonsDone = [...s.lessonsDone, lessonId];
      commit({ ...s, lessonsDone });
      addXp(course.config.xp.lessonComplete);
      if (lessonsDone.length >= totalLessons) unlockBadge("scholar");
      return true;
    },

    markStudied(lessonId: string) {
      const s = get();
      if (!s.studied.includes(lessonId)) commit({ ...s, studied: [...s.studied, lessonId] });
    },

    /** Add whole minutes of study time to a domain and award XP for them. */
    recordStudy(domain: string, minutes: number) {
      if (minutes <= 0) return;
      const s = get();
      const studyMinutes = { ...s.studyMinutes, [domain]: (s.studyMinutes[domain] ?? 0) + minutes };
      commit({ ...s, studyMinutes });
      addXp(minutes * course.config.xp.studyMinute);
      if (Object.values(studyMinutes).reduce((a, b) => a + b, 0) >= 60) unlockBadge("bookworm");
    },

    /** Returns true the first time a challenge is solved. */
    solveChallenge(id: string) {
      const s = get();
      if (s.challengesSolved.includes(id)) return false;
      const challengesSolved = [...s.challengesSolved, id];
      commit({ ...s, challengesSolved });
      addXp(course.config.xp.challengeSolved);
      if (challengesSolved.length >= Math.min(5, course.challenges.length)) unlockBadge("tinkerer");
      return true;
    },

    setDailyGoal(goal: number) {
      commit({ ...get(), dailyGoal: goal });
    },

    reset() {
      commit(INITIAL_PROGRESS);
    },
  };
}
