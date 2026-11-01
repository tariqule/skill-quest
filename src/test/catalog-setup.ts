import { primeCourses } from "@/api/client";
import { COURSES } from "@/courses";
import { courseSummaries } from "@/server/courses/repository";

// In the app the root layout registers the catalog and pages load content through /api/v1.
// Engine tests run without a server, so every course is primed as already loaded.
primeCourses(COURSES, courseSummaries());
