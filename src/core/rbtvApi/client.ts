import {
  GetFrontendInitApiResponse,
  GetMediaEpisodeApiResponse,
  GetMediaEpisodePreviewNewestApiResponse,
  GetRbscVideoTokenApiResponse,
} from "./types";

const API_BASE_URL = process.env.EXPO_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:8081";

interface GetMediaEpisodePreviewNewestArg {
  offset?: number;
  limit?: number;
}

function toApiUrl(pathname: string, query: Record<string, string | number | undefined> = {}) {
  const url = new URL(pathname, API_BASE_URL);

  for (const [key, value] of Object.entries(query)) {
    if (value != null) {
      url.searchParams.set(key, String(value));
    }
  }

  return url.toString();
}

async function fetchApi<T>(
  pathname: string,
  query: Record<string, string | number | undefined> = {},
) {
  const response = await fetch(toApiUrl(pathname, query), {
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`RBTV proxy request failed (${response.status})`);
  }

  return (await response.json()) as T;
}

export function getFrontendInit() {
  return fetchApi<GetFrontendInitApiResponse>("/api/rbtv/frontend-init");
}

export async function getMediaEpisode(episodeId: string) {
  return fetchApi<GetMediaEpisodeApiResponse>(
    `/api/rbtv/media-episode/${encodeURIComponent(episodeId)}`,
  );
}

export async function getMediaEpisodePreviewNewest(arg: GetMediaEpisodePreviewNewestArg) {
  return fetchApi<GetMediaEpisodePreviewNewestApiResponse>(
    "/api/rbtv/media-episode-preview-newest",
    {
      offset: arg.offset,
      limit: arg.limit,
    },
  );
}

export function getRbscVideoToken(videoToken: string) {
  return fetchApi<GetRbscVideoTokenApiResponse>(
    `/api/rbtv/rbsc-video-token/${encodeURIComponent(videoToken)}`,
  );
}

export type { GetMediaEpisodePreviewNewestArg };
