import {fetchBaseQuery} from '@reduxjs/toolkit/query';
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from '@reduxjs/toolkit/query';
import {selectAuthToken} from '../../features/auth/authTokenSlice';
import {RootState} from '../redux/store';
import {SocketMessage, SocketMessagePayload} from './types';
import {selectSocket} from './rbtvSocketApiSlice';

interface SocketMessageArgs<M extends SocketMessage = SocketMessage> {
  message: M;
  payload: SocketMessagePayload<M>;
}

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://api.rocketbeans.tv/v1/',
  prepareHeaders: (headers, {getState}) => {
    headers.set('Content-Type', 'application/json');

    const authToken = selectAuthToken(getState() as RootState);
    if (authToken) {
      headers.set('Authorization', `Bearer ${authToken.accessToken}`);
    }

    return headers;
  },
});

const rbtvBaseQuery: BaseQueryFn<
  FetchArgs | SocketMessageArgs,
  unknown,
  FetchBaseQueryError | string
> = async (args, api, extraOptions) => {
  if ('url' in args) {
    return baseQuery(args, api, extraOptions);
  }

  const socket = selectSocket(api.getState() as RootState);
  if (!socket) {
    return {
      error: 'Socket not connected',
    };
  }

  socket.emit(args.message, args.payload);

  return {
    data: null,
  };
};

export default rbtvBaseQuery;
