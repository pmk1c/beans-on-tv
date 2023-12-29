import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {selectAuthToken} from '../../features/auth/authTokenSlice';
import {RootState} from '../store';
import toPage from './mappings/toPage';
import Page from '../types/Page';
import Episode from '../types/Episode';

export type GetMediaEpisodePreviewNewestApiResponse = {
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

type GetMediaEpisodePreviewNewestApiArg = {
  offset?: number;
  limit?: number;
};

type GetRbscVideoTokenByVideoTokenApiResponse = {
  success?: boolean;
  data?: {
    signedToken?: string;
    validUntil?: string;
  };
};

type GetRbscVideoTokenByVideoTokenApiArg = {
  videoToken?: string;
};

export const rbtvApi = createApi({
  reducerPath: 'rbtvApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.rocketbeans.tv/v1/',
    prepareHeaders: (headers, {getState}) => {
      headers.set('Content-Type', 'application/json');

      const authToken = selectAuthToken(getState() as RootState);
      if (authToken) {
        headers.set('Authorization', `Bearer ${authToken.accessToken}`);
      }

      return headers;
    },
  }),
  endpoints: build => ({
    getMediaEpisodePreviewNewest: build.query<
      Page<Episode>,
      GetMediaEpisodePreviewNewestApiArg
    >({
      query: queryArg => ({
        url: '/media/episode/preview/newest',
        params: {offset: queryArg.offset, limit: queryArg.limit},
      }),
      transformResponse: (
        response: GetMediaEpisodePreviewNewestApiResponse,
      ) => {
        return toPage(response);
      },
    }),
    getRbscVideoTokenByVideoToken: build.query<
      GetRbscVideoTokenByVideoTokenApiResponse,
      GetRbscVideoTokenByVideoTokenApiArg
    >({
      query: queryArg => ({url: `/rbsc/video/token/${queryArg.videoToken}`}),
    }),
  }),
});

export const {
  useLazyGetMediaEpisodePreviewNewestQuery,
  useLazyGetRbscVideoTokenByVideoTokenQuery,
} = rbtvApi;
