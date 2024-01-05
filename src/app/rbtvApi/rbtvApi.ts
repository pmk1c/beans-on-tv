import {createApi} from '@reduxjs/toolkit/query/react';
import toPage from './mappings/toPage';
import Page from '../types/Page';
import Episode from '../types/Episode';
import {
  GetFrontendInitApiResponse,
  GetMediaEpisodePreviewNewestApiResponse,
  GetRbscVideoTokenApiResponse,
} from './types';
import rbtvBaseQuery from './rbtvBaseQuery';

type GetMediaEpisodePreviewNewestApiArg = {
  offset?: number;
  limit?: number;
};

type GetRbscVideoTokenApiArg = {
  videoToken?: string;
};

type SocketEmitMediaEpisodeProgressUpdateApiArg = {
  episode: Episode;
  progress: number;
};

export const rbtvApi = createApi({
  reducerPath: 'rbtvApi',
  tagTypes: ['Episode'],
  baseQuery: rbtvBaseQuery,
  endpoints: build => ({
    getFrontendInit: build.query<GetFrontendInitApiResponse, void>({
      query: () => ({url: '/frontend/init'}),
    }),
    getMediaEpisodePreviewNewest: build.query<
      Page<Episode>,
      GetMediaEpisodePreviewNewestApiArg
    >({
      query: arg => ({
        url: '/media/episode/preview/newest',
        params: {offset: arg.offset, limit: arg.limit},
      }),
      providesTags: result =>
        result?.data.map(episode => ({
          type: 'Episode',
          id: episode.id,
        })) ?? [],
      transformResponse: (
        response: GetMediaEpisodePreviewNewestApiResponse,
      ) => {
        return toPage(response);
      },
    }),
    getRbscVideoToken: build.query<
      GetRbscVideoTokenApiResponse,
      GetRbscVideoTokenApiArg
    >({
      query: arg => ({url: `/rbsc/video/token/${arg.videoToken}`}),
    }),
    socketEmitMediaEpisodeProgressUpdate: build.mutation<
      void,
      SocketEmitMediaEpisodeProgressUpdateApiArg
    >({
      query: arg => ({
        message: 'CA_MEDIA_EPISODEPROGRESS_UPDATE' as const,
        payload: {
          episodeId: Number.parseInt(arg.episode.id, 10),
          tokenId: Number.parseInt(arg.episode.videoTokens.rbsc!.id, 10),
          progress: Math.round(arg.progress),
        },
      }),
      invalidatesTags: (result, error, arg) => [
        {
          type: 'Episode',
          id: arg.episode.id,
        },
      ],
    }),
  }),
});

export const {
  useLazyGetRbscVideoTokenQuery,
  useSocketEmitMediaEpisodeProgressUpdateMutation,
} = rbtvApi;
export const {
  endpoints: {
    getMediaEpisodePreviewNewest: {initiate: getMediaEpisodePreviewNewest},
  },
} = rbtvApi;
