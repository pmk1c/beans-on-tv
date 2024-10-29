import * as Application from "expo-application";
import io from "socket.io-client";

import Episode from "../types/Episode";

import { SocketMessage, SocketMessagePayload } from "./types";

class RBTVSocket {
  socket: SocketIOClient.Socket;

  constructor(url: string, path: string) {
    this.socket = io(url, { path, transports: ["websocket"] });

    this.on("AC_PING", (payload) => {
      this.emit("CA_PONG", payload);
    });
  }

  emit<M extends SocketMessage = SocketMessage>(
    message: M,
    payload: SocketMessagePayload<M>
  ) {
    console.debug("Socket message sent", message, payload);
    this.socket.emit(message, payload);
  }

  emitAuthentication(token: string) {
    this.emit("CA_AUTHENTICATION", {
      appName: `${Application.applicationName}/${Application.nativeApplicationVersion}`,
      token,
    });
  }

  emitMediaEpisodeProgressUpdate(episode: Episode, progress: number) {
    if (!episode.videoTokens.rbsc) return;

    this.emit("CA_MEDIA_EPISODEPROGRESS_UPDATE", {
      episodeId: Number.parseInt(episode.id, 10),
      tokenId: Number.parseInt(episode.videoTokens.rbsc.id, 10),
      progress: Math.round(progress),
    });
  }

  on<M extends SocketMessage = SocketMessage>(
    message: M,
    callback: (payload: SocketMessagePayload<M>) => void
  ) {
    this.socket.on(message, (payload: SocketMessagePayload<M>) => {
      console.debug("Socket message received", message, payload);
      callback(payload);
    });
  }
}

export default RBTVSocket;
