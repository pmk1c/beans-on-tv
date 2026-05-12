import { StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";

import Button from "../../core/components/Button";
import { TVFocusGuideView } from "../../core/react-native-tvos-shim";
import color from "../../core/styles/tokens/color";
import fontPresets from "../../core/styles/tokens/fontPresets";
import spacing from "../../core/styles/tokens/spacing";
import { AppDispatch } from "../../core/redux/store";
import { resetAuthToken } from "../auth/authTokenSlice";

function SettingsScreen() {
  const dispatch = useDispatch<AppDispatch>();
  const logout = () => dispatch(resetAuthToken());

  return (
    <TVFocusGuideView autoFocus trapFocusLeft trapFocusRight trapFocusDown style={styles.wrapper}>
      <View style={styles.content}>
        <Button buttonType="destructive" title="Abmelden" onPress={logout} />
      </View>
    </TVFocusGuideView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    alignItems: "center",
    gap: spacing.l,
  },
  title: {
    ...fontPresets.xl,
    color: color.text,
  },
});

export default SettingsScreen;
