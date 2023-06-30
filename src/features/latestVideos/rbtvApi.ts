import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {selectAuthToken} from '../auth/authTokenSlice';
import {RootState} from '../../app/store';
import {mediaEpisodeCombinedResponse} from '../../../rbtv-apidoc';
import {genericPaginatedApiResponse} from '../../../rbtv-apidoc-fixes';

type GetMediaEpisodePreviewNewestResponse =
  genericPaginatedApiResponse<mediaEpisodeCombinedResponse>;

const pageSize = 50;

const rbtvApi = createApi({
  reducerPath: 'rbtvApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://api.rocketbeans.tv/v1/',
    prepareHeaders: (headers, {getState}) => {
      headers.set('Content-Type', 'application/json');

      const authToken = selectAuthToken(getState() as RootState);
      if (authToken) {
        headers.set('Authorization', `Bearer ${authToken.access_token}`);
      }

      return headers;
    },
  }),
  endpoints: build => ({
    getMediaEpisodePreviewNewest: build.query<
      GetMediaEpisodePreviewNewestResponse,
      number
    >({
      query: page => ({
        method: 'GET',
        url: 'media/episode/preview/newest',
        params: {limit: pageSize, offset: page * pageSize},
      }),
    }),
  }),
});

export const {useGetMediaEpisodePreviewNewestQuery} = rbtvApi;
export default rbtvApi;
