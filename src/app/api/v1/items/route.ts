import type { NextRequest } from "next/server";
import { ItemsQuery } from "@/api/contracts";
import { parse, queryOf, respond, route } from "@/server/api/http";
import { contentVersion } from "@/server/courses/repository";
import { items } from "@/server/courses/service";

/** GET /api/v1/items?keys=<course>:<q|card|code|sc>:<id>,…: Daily Review items by key, across courses. */
export const GET = route((req: NextRequest) => {
  const q = parse(ItemsQuery, queryOf(req), "query");
  return respond(req, items(q.keys), { kind: "content", etag: `"${contentVersion()}-${hashKeys(q.keys)}"` });
});

function hashKeys(keys: string[]) {
  let h = 0;
  for (const ch of keys.join(",")) h = (Math.imul(h, 31) + ch.charCodeAt(0)) | 0;
  return (h >>> 0).toString(36);
}
