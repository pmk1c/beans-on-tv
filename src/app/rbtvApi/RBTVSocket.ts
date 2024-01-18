import io from 'socket.io-client';
import {SocketMessage, SocketMessagePayload} from './types';
import Episode from '../types/Episode';
import * as Application from 'expo-application';

class RBTVSocket {
  socket: SocketIOClient.Socket;

  constructor(url: string, path: string) {
    this.socket = io(url, {path, transports: ['websocket']});

    this.on('AC_PING', payload => {
      this.emit('CA_PONG', payload);
    });
  }

  emit<
    M extends SocketMessage = SocketMessage,
    P extends SocketMessagePayload<M> = SocketMessagePayload<M>,
  >(message: M, payload: P) {
    console.debug('Socket message sent', message, payload);
    this.socket.emit(message, payload);
  }

  emitAuthentication(token: string) {
    this.emit('CA_AUTHENTICATION', {
      appName: `${Application.applicationName}/${Application.nativeApplicationVersion}`,
      token,
    });
  }

  emitMediaEpisodeProgressUpdate(episode: Episode, progress: number) {
    this.emit('CA_MEDIA_EPISODEPROGRESS_UPDATE', {
      episodeId: Number.parseInt(episode.id, 10),
      tokenId: Number.parseInt(episode.videoTokens.rbsc!.id, 10),
      progress: Math.round(progress),
    });
  }

  on<
    M extends SocketMessage = SocketMessage,
    P extends SocketMessagePayload<M> = SocketMessagePayload<M>,
  >(message: M, callback: (payload: SocketMessagePayload<M>) => void) {
    this.socket.on(message, (payload: P) => {
      console.debug('Socket message received', message, payload);
      callback(payload);
    });
  }
}

export default RBTVSocket;
