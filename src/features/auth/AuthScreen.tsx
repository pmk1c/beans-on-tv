import { nativeApplicationVersion } from "expo-application";
import { useUpdates } from "expo-updates";
import { StyleSheet, Text, View } from "react-native";

import Button from "../../core/components/Button";
import borderRadius from "../../core/styles/tokens/borderRadius";
import color from "../../core/styles/tokens/color";
import fontPresets from "../../core/styles/tokens/fontPresets";
import spacing from "../../core/styles/tokens/spacing";

import { useAuthScreen } from "./useAuthScreen";
import { TVFocusGuideView } from "@/src/core/react-native-tvos-shim";

const codeSeperator = "–";

function formatCode(code: string): string {
  return code.slice(0, 4) + codeSeperator + code.slice(4);
}

function AuthScreen() {
  const { state, logout } = useAuthScreen();
  const { currentlyRunning, isChecking, isDownloading, isUpdatePending } = useUpdates();

  const versionInfo = [
    nativeApplicationVersion,
    currentlyRunning.channel,
    currentlyRunning.createdAt?.toISOString().slice(0, 10),
    isChecking
      ? "Prüfe auf Update"
      : isDownloading
        ? "Lade Update"
        : isUpdatePending
          ? "Update verfügbar (Neustart erforderlich)"
          : null,
  ]
    .filter(Boolean)
    .join(" | ");

  return (
    <TVFocusGuideView autoFocus trapFocusLeft trapFocusRight trapFocusDown style={styles.wrapper}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        {state.step === "creatingCode" || state.step === "pollingToken" ? (
          <View style={styles.textWrapper}>
            <Text style={styles.text}>
              Besuche <Text style={styles.textHighlight}>https://rbtv.bmind.de</Text>, melde dich
              mit deinem Rocket Beans TV-Account an und gib folgenden Code ein:
              {"\n"}
              <Text style={styles.textHighlight}>
                {state.step === "pollingToken" ? formatCode(state.code) : codeSeperator}
              </Text>
            </Text>
          </View>
        ) : (
          <Button buttonType="destructive" title="Abmelden" onPress={logout} />
        )}
      </View>
      <Text style={styles.textVersion}>{versionInfo}</Text>
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  textWrapper: {
    backgroundColor: color.darkTransparentBg,
    padding: spacing.l,
    borderRadius: borderRadius.large,
  },
  text: {
    ...fontPresets.xl,
    color: color.text,
    textAlign: "center",
  },
  textHighlight: {
    color: color.textHighlight,
  },
  textVersion: {
    ...fontPresets.l,
    color: color.textMuted,
  },
  textActivityIndicator: {
    height: 2,
  },
  logoutButton: {
    color: color.textHighlight,
    backgroundColor: color.red700,
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
  },
  logoutButtonFocused: {
    backgroundColor: color.red800,
  },
});

export default AuthScreen;
