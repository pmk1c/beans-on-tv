import { useEffect, useRef, useState } from "react";

import capture from "../../core/capture";

import { authClient } from "../../lib/auth-client";

const DEVICE_CLIENT_ID = process.env.EXPO_PUBLIC_BETTER_AUTH_DEVICE_CLIENT_ID!;
const DEVICE_GRANT_TYPE = "urn:ietf:params:oauth:grant-type:device_code";

export function useAuthScreen() {
  const [code, setCode] = useState<string | null>(null);
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const tokenPollingTimeout = useRef<number>(null);

  useEffect(() => {
    const stopPolling = () => {
      if (tokenPollingTimeout.current) {
        window.clearTimeout(tokenPollingTimeout.current);
      }
    };

    if (isSessionPending) {
      return stopPolling;
    }

    if (session) {
      setCode(null);
      return stopPolling;
    }

    capture(
      (async () => {
        const { data } = await authClient.device.code({
          client_id: DEVICE_CLIENT_ID,
          scope: "user.email.read user.info rbsc.video.token",
        });

        if (!data?.user_code || !data.device_code) {
          return;
        }

        const intervalMs = Math.max(1000, (data.interval ?? 5) * 1000);

        setCode(data.user_code);

        const pollToken = async () => {
          const { data: tokenData, error } = await authClient.device.token({
            grant_type: DEVICE_GRANT_TYPE,
            device_code: data.device_code,
            client_id: DEVICE_CLIENT_ID,
          });

          if (tokenData?.access_token) {
            await authClient.getSession();
            stopPolling();
            return;
          }

          if (!error || error.error === "authorization_pending" || error.error === "slow_down") {
            tokenPollingTimeout.current = window.setTimeout(() => {
              capture(pollToken());
            }, intervalMs);
          }
        };

        capture(pollToken());
      })(),
    );

    return stopPolling;
  }, [isSessionPending, session]);

  return { code };
}
