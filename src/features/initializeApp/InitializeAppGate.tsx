import { PropsWithChildren, useEffect, useState } from "react";

import capture from "../../core/capture";
import { initializeSocket } from "../../core/rbtvApi/rbtvSocketApiSlice";
import { useAppDispatch } from "../../core/redux/hooks";

function InitializeAppGate({ children }: PropsWithChildren) {
  const [isInitialized, setIsInitialized] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    capture(
      (async () => {
        await dispatch(initializeSocket());
        setIsInitialized(true);
      })(),
    );
  }, [dispatch]);

  return isInitialized ? children : null;
}

export default InitializeAppGate;
