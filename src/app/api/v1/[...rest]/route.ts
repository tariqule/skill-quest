import { errorResponse } from "@/server/api/http";

/** Any other /api/v1 path: the shared 404 shape instead of the HTML not-found page. */
const notFound = () => errorResponse("not_found", "No such endpoint");
export { notFound as GET, notFound as POST, notFound as PUT, notFound as PATCH, notFound as DELETE };
