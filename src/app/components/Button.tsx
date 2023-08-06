import React, {PropsWithRef, Ref, forwardRef} from 'react';
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';
import spacing from '../styles/tokens/spacing';
import color from '../styles/tokens/color';
import borderRadius from '../styles/tokens/borderRadius';
import fontSize from '../styles/tokens/fontSizes';
import RBTVIcon from '../assets/icons/RBTVIcon';
import fontFamily from '../styles/tokens/fontFamily';
import {RBTVIconName} from '../assets/icons/RBTVIcon';

type ButtonProps = PropsWithRef<{
  buttonType?: 'destructive' | 'active';
  icon?: RBTVIconName;
  title?: string;
  style?: StyleProp<ViewStyle>;
  onFocus?: () => void;
  onPress?: () => void;
}>;

function getStyles<T = unknown>(
  styles: Record<string, StyleProp<T>>,
  defaultStyleName: string,
  buttonType: ButtonProps['buttonType'],
  focused: boolean,
) {
  const styleNames = [defaultStyleName];
  if (buttonType === 'active') {
    styleNames.push(`${defaultStyleName}Active`);
  }
  if (buttonType === 'destructive') {
    styleNames.push(`${defaultStyleName}Destructive`);
  }
  if (focused) {
    styleNames.push(`${defaultStyleName}Focused`);
  }
  if (buttonType === 'destructive' && focused) {
    styleNames.push(`${defaultStyleName}DestructiveFocused`);
  }

  return styleNames.map(styleName => styles[styleName]).filter(Boolean);
}

function Button(
  {buttonType, icon, title, style, onFocus, onPress}: ButtonProps,
  ref: Ref<View>,
): JSX.Element {
  return (
    <Pressable
      ref={ref}
      onFocus={onFocus}
      onPress={onPress}
      children={({focused}) => (
        <View style={getStyles(viewStyles, 'wrapper', buttonType, focused)}>
          <Text style={getStyles(textStyles, 'text', buttonType, focused)}>
            {icon ? (
              <RBTVIcon
                style={getStyles(textStyles, 'text', buttonType, focused)}
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
    backgroundColor: color.bodyBg,
    color: color.textLight,
    borderRadius: borderRadius.large,
  },
  wrapperActive: {
    backgroundColor: color.lightTransparentBg,
  },
  wrapperDestructive: {
    backgroundColor: color.red700,
  },
  wrapperFocused: {
    backgroundColor: color.grey600,
  },
  wrapperDestructiveFocused: {
    backgroundColor: color.red800,
  },
});

const textStyles = StyleSheet.create({
  text: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xl,
    lineHeight: 1.35 * fontSize.xl,
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
