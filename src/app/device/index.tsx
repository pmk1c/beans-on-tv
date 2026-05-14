import { router } from "expo-router";
import { useMemo, useState } from "react";
import { StyleSheet } from "react-native";
import { Button, Column, Host, Text, TextInput, useNativeState } from "@expo/ui";
import { Image } from "expo-image";

import fontPresets from "@/src/core/styles/tokens/fontPresets";
import { rbtvCornerbugSvgUri } from "@/src/core/assets/images/rbtvCornerbugSvg";
import color from "@/src/core/styles/tokens/color";

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
  const value = useNativeState(formattedCode);

  const continueToApproval = () => {
    const userCode = normalizeCode(formattedCode);
    if (userCode.length !== 8) {
      return;
    }

    router.push(`/device/approve?user_code=${userCode}` as never);
  };

  return (
    <Host style={styles.container}>
      <Column alignment="center" spacing={12}>
        <Image source={rbtvCornerbugSvgUri} style={styles.logo} contentFit="contain" />
        <Text
          textStyle={{
            ...fontPresets.xl,
            color: "#ffffff",
          }}
        >
          Rocket Beans TV Geräteanmeldung
        </Text>
        <Text
          textStyle={{
            ...fontPresets.l,
            color: "#c7ced9",
            textAlign: "center",
          }}
        >
          Gib den Code ein, der auf deinem TV angezeigt wird.
        </Text>

        <TextInput
          value={value}
          onChangeText={setCode}
          placeholder="XXXX-XXXX"
          placeholderTextColor={color.grey600}
          autoCapitalize="characters"
          autoCorrect={false}
          style={styles.input}
        />

        <Button style={styles.button} onPress={continueToApproval}>
          <Text
            textStyle={{
              ...fontPresets.l,
              color: "#ffffff",
              fontWeight: "700",
            }}
          >
            Weiter
          </Text>
        </Button>
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
  logo: {
    width: 80,
    height: 80,
  },
  button: {
    borderRadius: 8,
    backgroundColor: "#cc2a36",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
});
