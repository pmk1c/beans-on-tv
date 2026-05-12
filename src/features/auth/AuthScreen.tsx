import { Column, Host, Row } from "@expo/ui";
import { Image } from "expo-image";
import { StyleSheet, Text as NativeText, View } from "react-native";

import borderRadius from "../../core/styles/tokens/borderRadius";
import color from "../../core/styles/tokens/color";
import { rbtvCornerbugSvgUri } from "../../core/assets/images/rbtvCornerbugSvg";
import fontPresets from "../../core/styles/tokens/fontPresets";
import spacing from "../../core/styles/tokens/spacing";

import { useAuthScreen } from "./useAuthScreen";

const codeSeperator = "–";
const DEVICE_REGISTRATION_URL = "https://rbtv.bmind.de/device";
const AUTH_API_BASE_URL = process.env.EXPO_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:8081";
const qrCodeSize = 220;
const qrLogoSize = 48;

function formatCode(code: string): string {
  return code.slice(0, 4) + codeSeperator + code.slice(4);
}

function getQrCodeUrl(code: string): string {
  return new URL(`/api/device-qr/${encodeURIComponent(code)}`, AUTH_API_BASE_URL).toString();
}

function AuthScreen() {
  const { state } = useAuthScreen();

  if (state.step !== "pollingToken") {
    return null;
  }

  const formattedCode = formatCode(state.code);

  return (
    <Host style={styles.host}>
      <Column style={styles.content} alignment="center">
        <Row style={styles.cardRow} spacing={spacing.xl}>
          <Column style={styles.qrColumn} alignment="center">
            <View style={styles.qrCodeFrame}>
              <Image
                source={{ uri: getQrCodeUrl(state.code) }}
                style={styles.qrCode}
                contentFit="contain"
              />
              <Image source={rbtvCornerbugSvgUri} style={styles.qrLogo} contentFit="contain" />
            </View>
          </Column>
          <View style={styles.textColumn}>
            <NativeText style={styles.flowingText}>
              Scanne die Bohne und melde dich mit deinem Rocket Beans TV-Account an oder besuche{" "}
              <NativeText style={styles.highlightText}>{DEVICE_REGISTRATION_URL}</NativeText> und
              gib folgenden Code ein:
            </NativeText>
            <NativeText style={styles.codeText}>{formattedCode}</NativeText>
          </View>
        </Row>
      </Column>
    </Host>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  host: {
    flex: 1,
  },
  content: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: spacing.l,
  },
  cardRow: {
    backgroundColor: color.darkTransparentBg,
    padding: spacing.l,
    borderRadius: borderRadius.large,
    width: "100%",
    maxWidth: 660,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
  },
  qrColumn: {
    width: qrCodeSize + spacing.l * 2,
    alignItems: "center",
    justifyContent: "center",
  },
  textColumn: {
    flexShrink: 1,
    maxWidth: 400,
  },
  flowingText: {
    ...fontPresets.xl,
    color: color.text,
    textAlign: "center",
  },
  codeText: {
    ...fontPresets.xl,
    color: color.textHighlight,
    marginTop: spacing.m,
    textAlign: "center",
  },
  highlightText: {
    ...fontPresets.xl,
    color: color.textHighlight,
  },
  qrCodeFrame: {
    width: qrCodeSize,
    height: qrCodeSize,
    borderRadius: borderRadius.large,
    backgroundColor: "#ffffff",
    padding: spacing.s,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  qrCode: {
    width: qrCodeSize,
    height: qrCodeSize,
  },
  qrLogo: {
    position: "absolute",
    width: qrLogoSize,
    height: qrLogoSize,
  },
});

export default AuthScreen;
