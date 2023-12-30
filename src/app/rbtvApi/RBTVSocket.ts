import io from 'socket.io-client';
import {SocketMessage, SocketMessagePayload} from './types';
import app from '../../../app.json';
import Episode from '../types/Episode';

class RBTVSocket {
  socket: SocketIOClient.Socket;

  constructor(url: string, path: string) {
    this.socket = io(url, {path, transports: ['websocket']});

    this.on('AC_PING', payload => {
      this.emit('CA_PONG', payload);
    });
  }

  onAuthenticationResult(callback: (success: boolean) => void) {
    this.on('AC_AUTHENTICATION_RESULT', ({result}) => {
      callback(result);
    });
  }

  onAuthenticationRenewRequest(callback: () => void) {
    this.on('AC_AUTHENTICATION_RENEW_TOKEN_REQ', callback);
  }

  emitAuthentication(token: string) {
    this.emit('CA_AUTHENTICATION', {
      appName: `${app.displayName}/${app.version}`,
      token,
    });
  }

  emitEpisodeProgress(episode: Episode, progress: number) {
    if (!episode.videoTokens.rbsc?.id) {
      return;
    }

    this.emit('CA_MEDIA_EPISODEPROGRESS_UPDATE', {
      episodeId: episode.id,
      tokenId: episode.videoTokens.rbsc?.id,
      progress,
    });
  }

  private on<
    M extends SocketMessage = SocketMessage,
    P extends SocketMessagePayload<M> = SocketMessagePayload<M>,
  >(message: M, callback: (payload: SocketMessagePayload<M>) => void) {
    this.socket.on(message, (payload: P) => {
      console.debug('Socket message received', message, payload);
      callback(payload);
    });
  }

  private emit<
    M extends SocketMessage = SocketMessage,
    P extends SocketMessagePayload<M> = SocketMessagePayload<M>,
  >(message: M, payload: P) {
    console.debug('Socket message sent', message, payload);
    this.socket.emit(message, payload);
  }
}

export default RBTVSocket;
