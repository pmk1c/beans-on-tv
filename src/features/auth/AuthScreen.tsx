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
      className="items-center gap-4"
    >
      {state.step === "creatingCode" || state.step === "pollingToken" ? (
        <View className="bg-grey850 p-12 rounded-sm">
          <Text className="text-grey300 text-center text-3xl font-primary">
            Besuche <Text className="text-white">https://rbtv.bmind.de</Text>,
            melde dich mit deinem Rocket Beans TV-Account an und gib folgenden
            Code ein:
            {"\n\n"}
            <Text className="text-white text-4xl font-extrabold">
              {state.step === "pollingToken"
                ? formatCode(state.code)
                : codeSeperator}
            </Text>
          </Text>
        </View>
      ) : (
        <Button buttonType="destructive" title="Abmelden" onPress={logout} />
      )}
      <Text className="text-white text-xl font-primary">{versionInfo}</Text>
    </TVFocusGuideView>
  );
}

export default AuthScreen;
