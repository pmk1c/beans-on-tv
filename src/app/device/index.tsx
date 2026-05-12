import { router } from "expo-router";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

function normalizeCode(rawCode: string) {
  return rawCode.toUpperCase().replace(/[^A-Z0-9]/g, "");
}

function formatCode(code: string) {
  const normalized = normalizeCode(code).slice(0, 8);
  if (normalized.length <= 4) {
    return normalized;
  }

  return `${normalized.slice(0, 4)}-${normalized.slice(4)}`;
}

export default function DeviceAuthorizationPage() {
  const [code, setCode] = useState("");
  const formattedCode = useMemo(() => formatCode(code), [code]);

  const continueToApproval = () => {
    const userCode = normalizeCode(formattedCode);
    if (userCode.length !== 8) {
      return;
    }

    router.push(`/device/approve?user_code=${userCode}` as never);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Rocket Beans TV Geräteanmeldung</Text>
      <Text style={styles.description}>Gib den Code ein, der auf deinem TV angezeigt wird.</Text>

      <TextInput
        value={formattedCode}
        onChangeText={setCode}
        placeholder="ABCD-1234"
        autoCapitalize="characters"
        autoCorrect={false}
        style={styles.input}
      />

      <Pressable style={styles.button} onPress={continueToApproval}>
        <Text style={styles.buttonText}>Weiter</Text>
      </Pressable>
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
  input: {
    minWidth: 260,
    borderRadius: 8,
    backgroundColor: "#1d2433",
    color: "#ffffff",
    fontSize: 24,
    paddingVertical: 12,
    paddingHorizontal: 16,
    letterSpacing: 1.5,
    textAlign: "center",
  },
  button: {
    borderRadius: 8,
    backgroundColor: "#cc2a36",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
  },
});
