import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';
import Token from './Token';

const authApi = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://ietacfzilviitulpecdz.supabase.co/functions/v1/',
    prepareHeaders: headers => {
      headers.set(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlldGFjZnppbHZpaXR1bHBlY2R6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NzYwNjI0NDcsImV4cCI6MTk5MTYzODQ0N30.jD-zPr3HB4C2AoImRgBFSxfRbPAnbQRQWwuPowxEsQU',
      );
      headers.set('Content-Type', 'application/json');

      return headers;
    },
  }),
  endpoints: build => ({
    createCode: build.mutation<string, void>({
      query: () => ({method: 'POST', url: 'code-token-exchange-create'}),
      transformResponse: (response: {code: string}) => response.code,
    }),
    getToken: build.mutation<Token, string>({
      query: code => ({
        method: 'POST',
        url: 'code-token-exchange-read',
        body: {code},
      }),
      transformResponse: (response: {token: Token}) => response.token,
    }),
  }),
});

export const {useCreateCodeMutation, useGetTokenMutation} = authApi;
export default authApi;
