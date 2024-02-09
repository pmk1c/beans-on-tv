import { nativeApplicationVersion } from "expo-application";
import { updateId } from "expo-updates";
import { StyleSheet, TVFocusGuideView, Text, View } from "react-native";

import { useAuthScreen } from "./useAuthScreen";
import Button from "../../app/components/Button";
import borderRadius from "../../app/styles/tokens/borderRadius";
import color from "../../app/styles/tokens/color";
import fontPresets from "../../app/styles/tokens/fontPresets";
import spacing from "../../app/styles/tokens/spacing";

const codeSeperator = "–";

function formatCode(code: string): string {
  return code.slice(0, 4) + codeSeperator + code.slice(4);
}

function AuthScreen(): JSX.Element | null {
  const { state, logout } = useAuthScreen();

  return (
    <TVFocusGuideView
      autoFocus
      trapFocusLeft
      trapFocusRight
      trapFocusDown
      style={styles.wrapper}
    >
      {state.step === "creatingCode" || state.step === "pollingToken" ? (
        <View style={styles.textWrapper}>
          <Text style={styles.text}>
            Besuche{" "}
            <Text style={styles.textHighlight}>https://rbtv.bmind.de</Text>,
            melde dich mit deinem Rocket Beans TV-Account an und gib folgenden
            Code ein:
            {"\n"}
            <Text style={styles.textHighlight}>
              {state.step === "pollingToken"
                ? formatCode(state.code)
                : codeSeperator}
            </Text>
          </Text>
        </View>
      ) : state.step === "done" ? (
        <Button buttonType="destructive" title="Abmelden" onPress={logout} />
      ) : null}
      <Text style={styles.textVersion}>
        {nativeApplicationVersion} {updateId ? `(${updateId})` : ""}
      </Text>
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
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
