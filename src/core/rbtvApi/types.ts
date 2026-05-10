import type {
  AC_AUTHENTICATION_RENEW_TOKEN_REQ,
  AC_AUTHENTICATION_REQ,
  AC_AUTHENTICATION_RESULT,
  bohnePortrait,
  CA_AUTHENTICATION,
  CA_MEDIA_EPISODEPROGRESS_UPDATE,
  frontendInitResponse,
  genericApiResponse,
  mediaEpisode,
  mediaEpisodePreview,
  mediaEpisodeProgress,
  RBSCVideoToken,
  socketMessageTypes,
  videoToken,
} from "../../../doc/rbtv-api/official";

// Fixes
interface MediaEpisodeCombinedResponse<E = MediaEpisode> {
  bohnen: Record<string, bohnePortrait>;
  episodes: E[];
  progress?: Record<string, mediaEpisodeProgress>;
}

// Resource Objects
export type MediaEpisode = mediaEpisode & {
  distributionPublishingDate: string;
};

export type MediaEpisodePreview = mediaEpisodePreview & {
  distributionPublishingDate: string;
};

export type VideoToken = videoToken;

// Api Responses
interface ApiResponseWithPagination<T> extends genericApiResponse<T> {
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
}
export type GetFrontendInitApiResponse = genericApiResponse<frontendInitResponse>;

export type GetMediaEpisodeApiResponse = genericApiResponse<MediaEpisodeCombinedResponse>;

export type GetMediaEpisodePreviewNewestApiResponse = ApiResponseWithPagination<
  MediaEpisodeCombinedResponse<MediaEpisodePreview>
>;

export type GetRbscVideoTokenApiResponse = genericApiResponse<RBSCVideoToken>;

// Socket Messages
interface AC_PING_CA_PONG {
  id: number;
  tick: number;
}

type SocketMessagePayloads = {
  AC_AUTHENTICATION_RENEW_TOKEN_REQ: AC_AUTHENTICATION_RENEW_TOKEN_REQ;
  AC_AUTHENTICATION_REQ: AC_AUTHENTICATION_REQ;
  AC_AUTHENTICATION_RESULT: AC_AUTHENTICATION_RESULT;
  AC_PING: AC_PING_CA_PONG;
  CA_AUTHENTICATION: CA_AUTHENTICATION;
  CA_MEDIA_EPISODEPROGRESS_UPDATE: CA_MEDIA_EPISODEPROGRESS_UPDATE;
  CA_PONG: AC_PING_CA_PONG;
} & {
  [key in Exclude<
    SocketMessage,
    | "AC_AUTHENTICATION_RENEW_TOKEN_REQ"
    | "AC_AUTHENTICATION_REQ"
    | "AC_AUTHENTICATION_RESULT"
    | "AC_PING"
    | "CA_AUTHENTICATION"
    | "CA_PONG"
    | "CA_MEDIA_EPISODEPROGRESS_UPDATE"
  >]: never;
};

export type SocketMessage = keyof typeof socketMessageTypes;

export type SocketMessagePayload<M extends SocketMessage = SocketMessage> =
  SocketMessagePayloads[M];
