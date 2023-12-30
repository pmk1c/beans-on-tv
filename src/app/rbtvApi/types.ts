import {socketMessageTypes} from '../../../doc/rbtv-api/official';

export type SocketMessage = keyof typeof socketMessageTypes;

type SocketMessagePayloads = {
  [key in SocketMessage]: never;
} & {
  AC_PING: {id: number; tick: number};
  CA_PING: {id: number; tick: number};
};

export type SocketMessagePayload<M extends SocketMessage = SocketMessage> =
  SocketMessagePayloads[M];
