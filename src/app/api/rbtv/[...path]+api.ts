import { auth } from "@/src/lib/auth";

type RouteParams = {
  path: string;
};

const RBTV_API_BASE_URL = "https://api.rocketbeans.tv";

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

function toRbtvUrl(request: Request, path: string) {
  const requestUrl = new URL(request.url);
  const url = new URL(`/v1/${path}`, RBTV_API_BASE_URL);

  url.search = requestUrl.search;

  return url;
}

async function getRbtvAccessToken(request: Request) {
  try {
    const result = await auth.api.getAccessToken({
      body: { providerId: "rbtv" },
      headers: request.headers,
    });

    return result.accessToken;
  } catch {
    return null;
  }
}

async function proxyRbtvRequest(request: Request, path: string) {
  const accessToken = await getRbtvAccessToken(request);
  if (!accessToken) {
    return jsonError("Unauthorized", 401);
  }

  const headers = new Headers();
  headers.set("Authorization", `Bearer ${accessToken}`);

  const contentType = request.headers.get("content-type");
  if (contentType) {
    headers.set("content-type", contentType);
  }

  const accept = request.headers.get("accept");
  if (accept) {
    headers.set("accept", accept);
  }

  try {
    return await fetch(toRbtvUrl(request, path), {
      method: request.method,
      headers,
      body: request.body,
    });
  } catch (error) {
    console.error("Error proxying RBTV API request:", error);
    return jsonError("Failed to fetch RBTV API", 500);
  }
}

export function GET(request: Request, { path }: RouteParams) {
  return proxyRbtvRequest(request, path);
}

export function POST(request: Request, { path }: RouteParams) {
  return proxyRbtvRequest(request, path);
}

export function PUT(request: Request, { path }: RouteParams) {
  return proxyRbtvRequest(request, path);
}

export function PATCH(request: Request, { path }: RouteParams) {
  return proxyRbtvRequest(request, path);
}

export function DELETE(request: Request, { path }: RouteParams) {
  return proxyRbtvRequest(request, path);
}

export function OPTIONS(request: Request, { path }: RouteParams) {
  return proxyRbtvRequest(request, path);
}

export function HEAD(request: Request, { path }: RouteParams) {
  return proxyRbtvRequest(request, path);
}
