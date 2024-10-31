import { nativeApplicationVersion } from "expo-application";
import { useUpdates } from "expo-updates";
import { TVFocusGuideView, Text, View } from "react-native";

import Button from "../../core/components/Button";

import { useAuthScreen } from "./useAuthScreen";

const codeSeperator = "–";

function formatCode(code: string): string {
  return code.slice(0, 4) + codeSeperator + code.slice(4);
}

function AuthScreen() {
  const { state, logout } = useAuthScreen();
  const { currentlyRunning, isChecking, isDownloading, isUpdatePending } =
    useUpdates();

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
    <TVFocusGuideView
      autoFocus
      trapFocusLeft
      trapFocusRight
      trapFocusDown
      className="flex-1 justify-between items-center"
    >
      <View className="flex-1 justify-center">
        {state.step === "creatingCode" || state.step === "pollingToken" ? (
          <View className="bg-darkTransparentBg p-4 rounded-lg">
            <Text className="text-xl text-center text-text">
              Besuche{" "}
              <Text className="text-textHighlight">https://rbtv.bmind.de</Text>,
              melde dich mit deinem Rocket Beans TV-Account an und gib folgenden
              Code ein:
              {"\n"}
              <Text className="text-textHighlight">
                {state.step === "pollingToken"
                  ? formatCode(state.code)
                  : codeSeperator}
              </Text>
            </Text>
          </View>
        ) : (
          <Button buttonType="destructive" title="Abmelden" onPress={logout} />
        )}
      </View>
      <Text className="text-lg text-textMuted">{versionInfo}</Text>
    </TVFocusGuideView>
  );
}

export default AuthScreen;
