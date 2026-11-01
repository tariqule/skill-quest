import type { NextRequest } from "next/server";
import { respond, route } from "@/server/api/http";
import { catalog, catalogEtag } from "@/server/courses/repository";

/** GET /api/v1/courses: the catalog (live course summaries and planned courses). */
export const GET = route((req: NextRequest) => respond(req, catalog(), { kind: "content", etag: catalogEtag() }));
