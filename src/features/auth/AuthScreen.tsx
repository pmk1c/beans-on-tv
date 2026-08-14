import { Column, Host, RNHostView, Row, Text } from "@expo/ui";
import { Image } from "expo-image";
import { View } from "react-native";

import borderRadius from "../../core/styles/tokens/borderRadius";
import color from "../../core/styles/tokens/color";
import { rbtvCornerbugSvgUri } from "../../core/assets/images/rbtvCornerbugSvg";
import fontPresets from "../../core/styles/tokens/fontPresets";
import spacing from "../../core/styles/tokens/spacing";

import { useAuthScreen } from "./useAuthScreen";

const codeSeperator = "–";
const DEVICE_REGISTRATION_URL = "https://rbtv.bmind.de/device";
const AUTH_API_BASE_URL = process.env.EXPO_PUBLIC_BETTER_AUTH_URL ?? "http://localhost:8081";
const qrCodeSize = 400;
const qrLogoSize = 100;

function formatCode(code: string): string {
  return code.slice(0, 4) + codeSeperator + code.slice(4);
}

function getQrCodeUrl(code: string): string {
  return new URL(`/api/device-qr/${encodeURIComponent(code)}`, AUTH_API_BASE_URL).toString();
}

function AuthScreen() {
  const { code } = useAuthScreen();

  if (!code) {
    return null;
  }

  const formattedCode = formatCode(code);

  return (
    <Host style={{ flex: 1 }}>
      <Row
        alignment="center"
        spacing={spacing.xl}
        style={{
          backgroundColor: color.darkTransparentBg,
          padding: spacing.l,
          borderRadius: borderRadius.large,
        }}
      >
        <RNHostView matchContents>
          <View
            style={{
              width: qrCodeSize,
              height: qrCodeSize,
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Image
              source={{ uri: getQrCodeUrl(code) }}
              style={{
                width: qrCodeSize,
                height: qrCodeSize,
                borderRadius: borderRadius.large,
              }}
              contentFit="contain"
            />
            <Image
              source={rbtvCornerbugSvgUri}
              style={{
                position: "absolute",
                width: qrLogoSize,
                height: qrLogoSize,
              }}
              contentFit="contain"
            />
          </View>
        </RNHostView>
        <Column alignment="center" spacing={spacing.l}>
          <Text textStyle={{ ...fontPresets.xl, color: color.text, textAlign: "center" }}>
            Scanne die Bohne und melde dich mit deinem Rocket Beans TV-Account an oder besuche
          </Text>
          <Text textStyle={{ ...fontPresets.xl, color: color.textHighlight }}>
            {DEVICE_REGISTRATION_URL}
          </Text>
          <Text textStyle={{ ...fontPresets.xl, color: color.text }}>
            und gib folgenden Code ein:
          </Text>
          <Text textStyle={{ ...fontPresets.xl, color: color.textHighlight }}>{formattedCode}</Text>
        </Column>
      </Row>
    </Host>
  );
}

export default AuthScreen;
