import type { Course, PlannedCourse } from "@/engine/types";
import awsAifC01 from "./aws-aif-c01";
import awsClfC02 from "./aws-clf-c02";
import codeAlgorithms from "./code-algorithms";
import codeDataStructures from "./code-data-structures";
import codeDocker from "./code-docker";
import codeGit from "./code-git";
import codeGo from "./code-go";
import codeHtmlCss from "./code-html-css";
import codeJava from "./code-java";
import codeJavascript from "./code-javascript";
import codeNextjs from "./code-nextjs";
import codeNodejs from "./code-nodejs";
import codePython from "./code-python";
import codeReact from "./code-react";
import codeSql from "./code-sql";
import codeSystemDesign from "./code-system-design";
import codeTypescript from "./code-typescript";
import awsDvaC02 from "./aws-dva-c02";
import awsDvaC03 from "./aws-dva-c03";
import awsSaaC03 from "./aws-saa-c03";
import azureAi901 from "./azure-ai-901";
import cncfKcna from "./cncf-kcna";
import gcpGenaiLeader from "./gcp-genai-leader";

/**
 * The course registry. To add a course: copy src/courses/_template to a new
 * folder, fill in its domains, and add it to COURSES. Nothing else changes.
 */
export const COURSES: Course[] = [awsClfC02, awsAifC01, awsSaaC03, awsDvaC03, awsDvaC02, gcpGenaiLeader, azureAi901, cncfKcna, codeJavascript, codeTypescript, codeDataStructures, codeAlgorithms, codeReact, codeNextjs, codeNodejs, codePython, codeJava, codeHtmlCss, codeGit, codeDocker, codeSystemDesign, codeSql, codeGo];

/** Shown in the catalog as "coming soon" until a course folder exists. */
export const PLANNED: PlannedCourse[] = [
];

const BY_ID = new Map(COURSES.map((c) => [c.id, c]));

export function getCourse(id: string): Course | undefined {
  return BY_ID.get(id);
}
