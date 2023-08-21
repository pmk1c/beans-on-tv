import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import {selectAuthToken} from '../../features/auth/authTokenSlice';
import {RootState} from '../store';

export const rbtvApiBase = createApi({
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
  endpoints: () => ({}),
});
