import { auth } from "@/src/lib/auth";

const RBTV_API_BASE_URL = "https://api.rocketbeans.tv/v1";

type QueryValue = string | number | undefined;

function toRbtvUrl(pathname: string, query: Record<string, QueryValue> = {}) {
  const url = new URL(pathname, RBTV_API_BASE_URL);

  for (const [key, value] of Object.entries(query)) {
    if (value != null) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
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

function jsonError(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function proxyRbtvGet(
  request: Request,
  pathname: string,
  query: Record<string, QueryValue> = {},
) {
  const accessToken = await getRbtvAccessToken(request);
  if (!accessToken) {
    return jsonError("Unauthorized", 401);
  }

  try {
    const response = await fetch(toRbtvUrl(pathname, query), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    const body = await response.text();
    const contentType = response.headers.get("content-type") ?? "application/json";

    return new Response(body, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
      },
    });
  } catch {
    return jsonError("Failed to fetch RBTV API", 500);
  }
}
