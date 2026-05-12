import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Column, Host, Row, Text } from "@expo/ui";

import { authClient } from "@/src/lib/auth-client";

function getUserCode(param: string | string[] | undefined) {
  if (typeof param === "string") {
    return param.replace(/[^0-9A-Z]/g, "").toUpperCase();
  }

  return "";
}

export default function DeviceApprovePage() {
  const params = useLocalSearchParams<{ user_code?: string }>();
  const userCode = getUserCode(params.user_code);
  const { data: session, isPending: isSessionPending } = authClient.useSession();
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const signIn = async () => {
    setError(null);
    const { error: signInError } = await authClient.signIn.oauth2({
      providerId: "rbtv",
      callbackURL: `/device/approve?user_code=${userCode}`,
    });

    if (signInError) {
      setError(signInError.message ?? "Anmeldung fehlgeschlagen.");
    }
  };

  const approve = async () => {
    setIsSubmitting(true);
    setError(null);
    const { error: approveError } = await authClient.device.approve({ userCode });
    setIsSubmitting(false);

    if (approveError) {
      setError(approveError.error_description ?? "Freigabe fehlgeschlagen.");
      return;
    }

    setDone(true);
  };

  const deny = async () => {
    setIsSubmitting(true);
    setError(null);
    const { error: denyError } = await authClient.device.deny({ userCode });
    setIsSubmitting(false);

    if (denyError) {
      setError(denyError.error_description ?? "Ablehnung fehlgeschlagen.");
      return;
    }

    setDone(true);
  };

  if (!userCode) {
    return (
      <Host style={styles.container}>
        <Column alignment="center" spacing={12}>
          <Text textStyle={styles.title}>Ungültiger Code</Text>
        </Column>
      </Host>
    );
  }

  if (done) {
    return (
      <Host style={styles.container}>
        <Column alignment="center" spacing={12}>
          <Text textStyle={styles.title}>Fertig</Text>
          <Text textStyle={styles.description}>Du kannst dieses Fenster jetzt schließen.</Text>
        </Column>
      </Host>
    );
  }

  return (
    <Host style={styles.container}>
      <Column alignment="center" spacing={12}>
        <Text textStyle={styles.title}>Gerät freigeben</Text>
        <Text
          textStyle={styles.description}
        >{`Code: ${userCode.slice(0, 4)}-${userCode.slice(4)}`}</Text>

        {isSessionPending ? (
          <Text textStyle={styles.description}>Lade Sitzung...</Text>
        ) : !session ? (
          <Button style={styles.button} onPress={signIn}>
            <Text textStyle={styles.buttonText}>Mit Rocket Beans TV anmelden</Text>
          </Button>
        ) : (
          <Row spacing={8}>
            <Button
              style={isSubmitting ? styles.buttonDisabled : styles.button}
              onPress={approve}
              disabled={isSubmitting}
            >
              <Text textStyle={styles.buttonText}>Freigeben</Text>
            </Button>
            <Button
              style={isSubmitting ? styles.buttonSecondaryDisabled : styles.buttonSecondary}
              onPress={deny}
              disabled={isSubmitting}
            >
              <Text textStyle={styles.buttonText}>Ablehnen</Text>
            </Button>
          </Row>
        )}

        {error ? <Text textStyle={styles.error}>{error}</Text> : null}
      </Column>
    </Host>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
    padding: 16,
    backgroundColor: "#0f1115",
  },
  title: {
    color: "#ffffff",
    fontSize: 28,
    fontWeight: "700",
  },
  description: {
    color: "#c7ced9",
    fontSize: 16,
    textAlign: "center",
  },
  button: {
    borderRadius: 8,
    backgroundColor: "#cc2a36",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonSecondary: {
    borderRadius: 8,
    backgroundColor: "#37445f",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonDisabled: {
    borderRadius: 8,
    backgroundColor: "#cc2a36",
    paddingHorizontal: 20,
    paddingVertical: 12,
    opacity: 0.6,
  },
  buttonSecondaryDisabled: {
    borderRadius: 8,
    backgroundColor: "#37445f",
    paddingHorizontal: 20,
    paddingVertical: 12,
    opacity: 0.6,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
  error: {
    color: "#ff7d7d",
    fontSize: 14,
    textAlign: "center",
  },
});
