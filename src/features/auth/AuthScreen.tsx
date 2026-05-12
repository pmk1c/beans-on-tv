import { Column, Host, Spacer, Text } from "@expo/ui";
import { StyleSheet } from "react-native";

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
  const { state } = useAuthScreen();

  return (
    <TVFocusGuideView autoFocus trapFocusLeft trapFocusRight trapFocusDown style={styles.wrapper}>
      <Host style={styles.host}>
        <Column style={styles.content} alignment="center">
          <Spacer flexible />
          {(state.step === "creatingCode" || state.step === "pollingToken") && (
            <Column style={styles.textWrapper} alignment="center" spacing={spacing.m}>
              <Text textStyle={styles.text}>Besuche</Text>
              <Text textStyle={styles.textHighlight}>https://rbtv.bmind.de/device</Text>
              <Text textStyle={styles.text}>
                und melde dich mit deinem Rocket Beans TV-Account an und gib folgenden Code ein:
              </Text>
              <Text textStyle={styles.textHighlight}>
                {state.step === "pollingToken" ? formatCode(state.code) : codeSeperator}
              </Text>
            </Column>
          )}
          <Spacer flexible />
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
  },
  content: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.l,
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
  textActivityIndicator: {
    height: 2,
  },
});

export default AuthScreen;
