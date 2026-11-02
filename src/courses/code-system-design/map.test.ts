import { describe, expect, it } from "vitest";
import { levelUpStatus } from "@/engine/levelup";
import { levelCounts, levelOptions, pathLessons, questionsForLevel } from "@/engine/levels";
import { courseMap } from "@/engine/practice";
import { INITIAL_PROGRESS, type Progress } from "@/engine/store";
import course from ".";

const lessonIds = new Set(Object.values(course.lessons).flat().map((l) => l.id));
const beginner = (lessonsDone: string[] = []): Progress => ({ ...INITIAL_PROGRESS, level: "beginner", lessonsDone });
const M1 = ["t-intro", "t-network", "t-scaling", "t-latency", "t-availability", "t-estimation"];

describe("code-system-design course map", () => {
  it("shows the 11-module, 68-topic syllabus with 1-1 to 1-6 in Module 1", () => {
    const map = courseMap(course.topics ?? [], lessonIds, beginner());
    expect(map.modules).toHaveLength(11);
    expect(map.total).toBe(68);
    expect(map.modules.reduce((n, m) => n + m.topics.length, 0)).toBe(68);
    expect(map.modules[0].title).toBe("Fundamentals");
    expect(map.modules[0].topics.map((t) => `${t.label} ${t.topic.id}`)).toEqual(M1.map((id, i) => `1-${i + 1} ${id}`));
    expect(map.current?.lesson).toBe("t-intro");
  });

  it("puts every lesson in the course on the map, either as a topic or a stand-in", () => {
    const covered = new Set((course.topics ?? []).flatMap((t) => [t.id, ...(t.standIns ?? [])]));
    expect([...lessonIds].filter((id) => !covered.has(id))).toEqual([]);
  });

  it("counts Module 1 for the beginner path, the level-up check and lesson numbering alike", () => {
    expect(pathLessons(course, "beginner").map((l) => l.id)).toEqual(M1);
    const m1Questions = course.questions.filter((q) => q.level === "beginner" && M1.includes(q.lesson)).length;
    expect(m1Questions).toBeGreaterThan(0);
    const status = levelUpStatus(course, beginner(["t-intro"]));
    expect(status).toMatchObject({ lessonsDone: 1, lessonsTotal: 6, questionsTotal: m1Questions });
  });

  it("moves to the next topic as lessons finish", () => {
    const map = courseMap(course.topics ?? [], lessonIds, beginner(["t-intro"]));
    expect(map.done).toBe(1);
    expect(map.current?.topic.id).toBe("t-network");
    expect(map.modules[0].done).toBe(1);
  });

  it("gives the level picker the Module 1 question count for beginners and says so", () => {
    const counts = levelCounts(course, levelOptions(course));
    const status = levelUpStatus(course, beginner());
    expect(counts.beginner).toEqual({ count: status?.questionsTotal, label: "Module 1 questions" });
    expect(counts.beginner?.count).toBeLessThan(questionsForLevel(course, "beginner").length);
    expect(counts.junior).toEqual({ count: questionsForLevel(course, "junior").length, label: "questions" });
  });
});
