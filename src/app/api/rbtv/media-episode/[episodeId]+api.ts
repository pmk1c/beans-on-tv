import { proxyRbtvGet } from "../_shared";

export function GET(request: Request, { episodeId }: { episodeId: string }) {
  return proxyRbtvGet(request, `/media/episode/${encodeURIComponent(episodeId)}`);
}
