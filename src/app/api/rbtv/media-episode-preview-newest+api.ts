import { proxyRbtvGet } from "./_shared";

export function GET(request: Request) {
  const url = new URL(request.url);

  const offset = url.searchParams.get("offset") ?? undefined;
  const limit = url.searchParams.get("limit") ?? undefined;

  return proxyRbtvGet(request, "/media/episode/preview/newest", {
    offset,
    limit,
  });
}
