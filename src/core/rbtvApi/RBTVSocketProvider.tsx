import { PropsWithChildren, createContext, use, useEffect, useState } from "react";

import RBTVSocket from "./RBTVSocket";
import { getFrontendInit } from "./client";

const RBTVSocketContext = createContext<RBTVSocket | undefined>(undefined);

function RBTVSocketProvider({ children }: PropsWithChildren) {
  const [socket, setSocket] = useState<RBTVSocket>();

  useEffect(() => {
    let isMounted = true;
    let socket: RBTVSocket | undefined;

    void (async () => {
      const {
        data: { websocket },
      } = await getFrontendInit();

      if (!isMounted) {
        return;
      }

      socket = new RBTVSocket(websocket.url, websocket.path);
      setSocket(socket);
    })();

    return () => {
      isMounted = false;
      socket?.disconnect();
    };
  }, []);

  return <RBTVSocketContext value={socket}>{children}</RBTVSocketContext>;
}

export function useRBTVSocket() {
  return use(RBTVSocketContext);
}

export default RBTVSocketProvider;
