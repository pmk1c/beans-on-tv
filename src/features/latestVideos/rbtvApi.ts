import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {selectAuthToken} from '../auth/authTokenSlice';
import {RootState} from '../../app/store';

type GetMediaEpisodePreviewNewestResponse = {
  succcess: boolean;
  pagination: {
    offset: number;
    limit: number;
    total: number;
  };
  data: {
    episodes: {
      id: number;
      title: string;
      thumbnail: {
        url: string;
        width: number;
        height: number;
      }[];
      tokens: {
        id: number;
        mediaEpisodeId: number;
        token: string;
        type: 'youtube' | 'rbsc';
        length: number;
      }[];
    }[];
  };
};

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
