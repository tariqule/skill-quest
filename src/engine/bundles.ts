/** Interview-prep role bundles shown on the home page and usable as a plan target. */
export interface Bundle {
  id: string;
  title: string;
  icon: string;
  line: string;
  courses: string[];
}

export const BUNDLES: Bundle[] = [
  { id: "bundle-frontend", title: "Frontend engineer", icon: "🎨", line: "HTML/CSS, JavaScript, TypeScript, React and Next.js.", courses: ["code-html-css", "code-javascript", "code-typescript", "code-react", "code-nextjs"] },
  { id: "bundle-backend", title: "Backend engineer", icon: "🛠️", line: "Node.js, SQL, Docker and system design.", courses: ["code-nodejs", "code-sql", "code-docker", "code-system-design"] },
  { id: "bundle-dsa", title: "Coding interview (DSA)", icon: "🧠", line: "Data structures and algorithms, the core of most coding rounds.", courses: ["code-data-structures", "code-algorithms"] },
  { id: "bundle-cloud", title: "Cloud engineer", icon: "☁️", line: "AWS foundations and architecture, Kubernetes and Docker.", courses: ["aws-clf-c02", "aws-saa-c03", "cncf-kcna", "code-docker"] },
  { id: "bundle-system-design", title: "Senior / system design", icon: "🏛️", line: "System design plus the data and infrastructure it rests on.", courses: ["code-system-design", "code-sql", "code-data-structures"] },
  { id: "bundle-python", title: "Python developer", icon: "🐍", line: "Python, SQL and the DSA interview core.", courses: ["code-python", "code-sql", "code-data-structures", "code-algorithms"] },
  { id: "bundle-java", title: "Java developer", icon: "☕", line: "Java, SQL and the DSA interview core.", courses: ["code-java", "code-sql", "code-data-structures", "code-algorithms"] },
  { id: "bundle-go", title: "Go developer", icon: "🐹", line: "Go, Docker and system design.", courses: ["code-go", "code-docker", "code-system-design"] },
];

export const BUNDLE_BY_ID = Object.fromEntries(BUNDLES.map((b) => [b.id, b]));

/** Course ids a plan target covers: a bundle's courses, or the course itself. */
export function targetCourses(target: string): string[] {
  return BUNDLE_BY_ID[target]?.courses ?? [target];
}
