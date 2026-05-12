import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

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
      <View style={styles.container}>
        <Text style={styles.title}>Ungültiger Code</Text>
      </View>
    );
  }

  if (done) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Fertig</Text>
        <Text style={styles.description}>Du kannst dieses Fenster jetzt schließen.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gerät freigeben</Text>
      <Text style={styles.description}>
        Code: {userCode.slice(0, 4)}-{userCode.slice(4)}
      </Text>

      {isSessionPending ? (
        <Text style={styles.description}>Lade Sitzung...</Text>
      ) : !session ? (
        <Pressable style={styles.button} onPress={signIn}>
          <Text style={styles.buttonText}>Mit Rocket Beans TV anmelden</Text>
        </Pressable>
      ) : (
        <View style={styles.actions}>
          <Pressable
            style={[styles.button, isSubmitting && styles.buttonDisabled]}
            onPress={approve}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>Freigeben</Text>
          </Pressable>
          <Pressable
            style={[styles.button, styles.buttonSecondary, isSubmitting && styles.buttonDisabled]}
            onPress={deny}
            disabled={isSubmitting}
          >
            <Text style={styles.buttonText}>Ablehnen</Text>
          </Pressable>
        </View>
      )}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
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
  actions: {
    flexDirection: "row",
    gap: 8,
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
    backgroundColor: "#37445f",
  },
  buttonDisabled: {
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
