import * as Application from "expo-application";
import io from "socket.io-client";

import { SocketMessage, SocketMessagePayload } from "./types";

class RBTVSocket {
  socket: SocketIOClient.Socket;

  constructor(url: string, path: string) {
    this.socket = io(url, { path, transports: ["websocket"] });

    this.on("AC_PING", (payload) => {
      this.emit("CA_PONG", payload);
    });
  }

  emit<M extends SocketMessage = SocketMessage>(message: M, payload: SocketMessagePayload<M>) {
    console.debug("Socket message sent", message, payload);
    this.socket.emit(message, payload);
  }

  emitAuthentication(token: string) {
    this.emit("CA_AUTHENTICATION", {
      appName: `${Application.applicationName}/${Application.nativeApplicationVersion}`,
      token,
    });
  }

  emitMediaEpisodeProgressUpdate(episodeId: number, tokenId: number, progress: number) {
    this.emit("CA_MEDIA_EPISODEPROGRESS_UPDATE", {
      episodeId,
      tokenId,
      progress: Math.round(progress),
    });
  }

  on<M extends SocketMessage = SocketMessage>(
    message: M,
    callback: (payload: SocketMessagePayload<M>) => void,
  ) {
    this.socket.on(message, (payload: SocketMessagePayload<M>) => {
      console.debug("Socket message received", message, payload);
      callback(payload);
    });
  }
}

export default RBTVSocket;
