import { PropsWithRef, Ref, forwardRef } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

import RBTVIcon, { RBTVIconName } from "../assets/icons/RBTVIcon";
import borderRadius from "../styles/tokens/borderRadius";
import color from "../styles/tokens/color";
import fontPresets from "../styles/tokens/fontPresets";
import spacing from "../styles/tokens/spacing";
import perfectSize from "../styles/perfectSize";

type ButtonProps = PropsWithRef<{
  buttonType?: "destructive";
  icon?: RBTVIconName;
  title?: string;
  style?: StyleProp<ViewStyle>;
  onFocus?: () => void;
  onPress?: () => void;
}>;

function getStyles<T = unknown>(
  styles: Record<string, StyleProp<T>>,
  defaultStyleName: string,
  buttonType: ButtonProps["buttonType"],
  focused: boolean,
) {
  const styleNames = [defaultStyleName];
  if (buttonType === "destructive") {
    styleNames.push(`${defaultStyleName}Destructive`);
  }
  if (focused) {
    styleNames.push(`${defaultStyleName}Focused`);
  }
  if (buttonType === "destructive" && focused) {
    styleNames.push(`${defaultStyleName}DestructiveFocused`);
  }

  return styleNames.map((styleName) => styles[styleName]).filter(Boolean);
}

function Button(
  { buttonType, icon, style, title, onFocus, onPress }: ButtonProps,
  ref: Ref<View>,
): JSX.Element {
  return (
    <Pressable
      ref={ref}
      onFocus={onFocus}
      onPress={onPress}
      children={({ focused }) => (
        <View
          style={[getStyles(viewStyles, "wrapper", buttonType, focused), style]}
        >
          <Text style={getStyles(textStyles, "text", buttonType, focused)}>
            {icon ? (
              <RBTVIcon
                style={getStyles(textStyles, "text", buttonType, focused)}
                name={icon}
              />
            ) : null}
            {title}
          </Text>
        </View>
      )}
    />
  );
}

const viewStyles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    color: color.grey850,
    borderRadius: borderRadius.full,
    borderWidth: perfectSize(4),
    borderColor: "transparent",
    minWidth: perfectSize(120),
    alignItems: "center",
  },
  wrapperDestructive: {
    backgroundColor: color.red700,
  },
  wrapperFocused: {
    borderColor: color.red500,
  },
  wrapperDestructiveFocused: {
    backgroundColor: color.red800,
  },
});

const textStyles = StyleSheet.create({
  text: {
    ...fontPresets.xl,
    color: color.text,
  },
  textDestructive: {
    color: color.textLight,
  },
  textFocused: {
    color: color.textHighlight,
  },
});

export default forwardRef(Button);
