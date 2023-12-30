import io from 'socket.io-client';
import {SocketMessage, SocketMessagePayload} from './types';

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
