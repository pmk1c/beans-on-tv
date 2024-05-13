import { PropsWithChildren, useEffect, useState } from "react";

import capture from "../../core/capture";
import { initializeSocket } from "../../core/rbtvApi/rbtvSocketApiSlice";
import { useAppDispatch } from "../../core/redux/hooks";
import { initializeAuthToken } from "../auth/authTokenSlice";

function InitializeAppGate({ children }: PropsWithChildren) {
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    capture(
      (async () => {
        await dispatch(initializeSocket());
        await dispatch(initializeAuthToken());
        setIsInitialized(true);
      })(),
    );
  }, [dispatch]);

  return isInitialized ? children : null;
}

export default InitializeAppGate;
