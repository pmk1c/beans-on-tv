import {
  AC_AUTHENTICATION_RENEW_TOKEN_REQ,
  AC_AUTHENTICATION_REQ,
  AC_AUTHENTICATION_RESULT,
  CA_AUTHENTICATION,
  CA_MEDIA_EPISODEPROGRESS_UPDATE,
  socketMessageTypes,
} from '../../../doc/rbtv-api/official';

export type SocketMessage = keyof typeof socketMessageTypes;

type SocketMessagePayloads = {
  AC_AUTHENTICATION_RENEW_TOKEN_REQ: AC_AUTHENTICATION_RENEW_TOKEN_REQ;
  AC_AUTHENTICATION_REQ: AC_AUTHENTICATION_REQ;
  AC_AUTHENTICATION_RESULT: AC_AUTHENTICATION_RESULT;
  AC_PING: {id: number; tick: number};
  CA_AUTHENTICATION: CA_AUTHENTICATION;
  CA_PING: {id: number; tick: number};
  CA_MEDIA_EPISODEPROGRESS_UPDATE: CA_MEDIA_EPISODEPROGRESS_UPDATE;
} & {
  [key in SocketMessage]: unknown;
};

export type SocketMessagePayload<M extends SocketMessage = SocketMessage> =
  SocketMessagePayloads[M];
