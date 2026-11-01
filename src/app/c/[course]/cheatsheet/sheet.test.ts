import { describe, expect, it } from "vitest";
import { filterSheet, sheetSections, slug } from "./sheet";

const course = {
  cheatsheet: [
    { title: "Storage & DBs", items: [["S3", "Object storage"], ["EBS", "Block storage for EC2"]] as [string, string][] },
    { title: "Compute", items: [["Lambda", "Run code without servers"]] as [string, string][] },
  ],
  cards: [{ kind: "service", term: "SQS", definition: "Message queue" }, { kind: "concept", term: "RPO", definition: "Data loss window" }],
} as unknown as Parameters<typeof sheetSections>[0];

describe("cheat sheet filtering", () => {
  const sections = sheetSections(course);
  it("adds the service glossary after the course sections", () => {
    expect(sections.map((s) => s.id)).toEqual(["storage-dbs", "compute", "services-at-a-glance"]);
    expect(sections[2].items).toEqual([["SQS", "Message queue"]]);
  });
  it("matches every word against term and definition, case-insensitively", () => {
    expect(filterSheet(sections, "block EC2", "all").flatMap((s) => s.items.map(([k]) => k))).toEqual(["EBS"]);
  });
  it("narrows to one section and drops empty ones", () => {
    expect(filterSheet(sections, "", "compute").map((s) => s.id)).toEqual(["compute"]);
    expect(filterSheet(sections, "zzz", "all")).toEqual([]);
  });
  it("slugs titles for anchors", () => expect(slug("Services at a glance")).toBe("services-at-a-glance"));
});
