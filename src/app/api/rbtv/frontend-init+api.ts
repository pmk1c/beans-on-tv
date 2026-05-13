import { proxyRbtvGet } from "./_shared";

export function GET(request: Request) {
  return proxyRbtvGet(request, "/frontend/init");
}
