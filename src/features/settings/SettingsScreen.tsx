import { nativeApplicationVersion } from "expo-application";
import { StyleSheet } from "react-native";
import { Button, Column, Host, Text } from "@expo/ui";
import { useUpdates } from "expo-updates";
import { TVFocusGuideView } from "../../core/react-native-tvos-shim";
import color from "../../core/styles/tokens/color";
import fontPresets from "../../core/styles/tokens/fontPresets";
import spacing from "../../core/styles/tokens/spacing";
import { authClient } from "../../lib/auth-client";

function SettingsScreen() {
  const logout = () => authClient.signOut();
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
      <Host style={styles.host}>
        <Column alignment="center" spacing={spacing.l}>
          <Button onPress={logout} style={{ backgroundColor: color.red700 }}>
            <Text
              textStyle={{
                ...fontPresets.l,
                color: color.white,
              }}
            >
              Abmelden
            </Text>
          </Button>
          <Text
            textStyle={{
              ...fontPresets.l,
              color: color.textMuted,
            }}
          >
            {versionInfo}
          </Text>
        </Column>
      </Host>
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  host: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default SettingsScreen;
