/**
 * Ids of every registered course, kept light so the proxy can check /c/<id> without loading
 * course content. src/courses/ids.test.ts fails if this drifts from COURSES.
 */
export const COURSE_IDS = [
  "aws-clf-c02", "aws-aif-c01", "aws-saa-c03", "aws-dva-c03", "aws-dva-c02", "gcp-genai-leader", "azure-ai-901", "cncf-kcna",
  "code-javascript", "code-typescript", "code-data-structures", "code-algorithms", "code-react", "code-nextjs", "code-nodejs",
  "code-python", "code-java", "code-html-css", "code-git", "code-docker", "code-system-design", "code-sql", "code-go",
] as const;
