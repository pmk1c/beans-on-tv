import {rbtvApiBase as api} from './rbtvApiBase';
const injectedRtkApi = api.injectEndpoints({
  endpoints: build => ({
    getMediaEpisodePreviewNewest: build.query<
      GetMediaEpisodePreviewNewestApiResponse,
      GetMediaEpisodePreviewNewestApiArg
    >({
      query: queryArg => ({
        url: `/media/episode/preview/newest`,
        params: {offset: queryArg.offset, limit: queryArg.limit},
      }),
    }),
    getRbscVideoTokenByVideoToken: build.query<
      GetRbscVideoTokenByVideoTokenApiResponse,
      GetRbscVideoTokenByVideoTokenApiArg
    >({
      query: queryArg => ({url: `/rbsc/video/token/$${queryArg.videoToken}`}),
    }),
  }),
  overrideExisting: false,
});
export {injectedRtkApi as rbtvApiWithEndpoints};
export type GetMediaEpisodePreviewNewestApiResponse = /** status 200 OK */ {
  success: boolean;
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
  data: {
    episodes: {
      id: number;
      title: string;
      showName?: string;
      thumbnail: {
        name: 'small' | 'medium' | 'large' | 'source' | 'ytsmall' | 'ytbig';
        url: string;
        height?: number;
        width?: number;
      }[];
      tokens: {
        id: number;
        mediaEpisodeId: number;
        token: string;
        type: 'youtube' | 'rbsc';
        length: number;
      }[];
      distributionPublishingDate: string;
    }[];
  };
};
export type GetMediaEpisodePreviewNewestApiArg = {
  offset?: number;
  limit?: number;
};
export type GetRbscVideoTokenByVideoTokenApiResponse = /** status 200 OK */ {
  success?: boolean;
  data?: {
    signedToken?: string;
    validUntil?: string;
  };
};
export type GetRbscVideoTokenByVideoTokenApiArg = {
  videoToken?: string;
};
