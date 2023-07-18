import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {selectAuthToken} from '../auth/authTokenSlice';
import {RootState} from '../../app/store';
import {
  RBSCVideoToken,
  genericApiResponse,
  mediaEpisodeCombinedResponse,
} from '../../../rbtv-apidoc';
import {genericPaginatedApiResponse} from '../../../rbtv-apidoc-fixes';

export type GetMediaEpisodePreviewNewestResponse =
  genericPaginatedApiResponse<mediaEpisodeCombinedResponse>;

type GetRbscVideoTokenResponse = genericApiResponse<RBSCVideoToken>;

const rbtvApi = createApi({
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
      GetMediaEpisodePreviewNewestResponse,
      {limit: number; offset: number}
    >({
      query: params => ({
        method: 'GET',
        url: 'media/episode/preview/newest',
        params,
      }),
    }),
    getRbscVideoToken: build.query<GetRbscVideoTokenResponse, string>({
      query: id => ({
        method: 'GET',
        url: `rbsc/video/token/${id}`,
      }),
    }),
  }),
});

export const {
  useLazyGetMediaEpisodePreviewNewestQuery,
  useLazyGetRbscVideoTokenQuery,
} = rbtvApi;
export default rbtvApi;
