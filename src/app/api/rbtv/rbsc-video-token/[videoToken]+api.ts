import { proxyRbtvGet } from "../_shared";

export function GET(request: Request, { videoToken }: { videoToken: string }) {
  return proxyRbtvGet(request, `/rbsc/video/token/${encodeURIComponent(videoToken)}`);
}
