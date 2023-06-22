import React from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import spacing from '../../styleTokens/spacing';
import Tab from './Tab';
import color from '../../styleTokens/color';
import borderRadius from '../../styleTokens/borderRadius';
import fontSize from '../../styleTokens/fontSizes';
import RBTVIcon from '../../assets/icons/RBTVIcon';
import fontFamily from '../../styleTokens/fontFamily';

type TabBarProps = {
  tab: Tab;
};

function TabBarItem({tab}: TabBarProps): JSX.Element {
  return (
    <Pressable
      children={({focused}) => (
        <View style={[styles.wrapper, focused && styles.wrapperFocused]}>
          <Text style={[styles.text, focused && styles.textFocused]}>
            {tab.icon ? (
              <RBTVIcon
                style={[styles.text, focused && styles.textFocused]}
                name={tab.icon}
              />
            ) : null}
            {tab.title}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    backgroundColor: color.bodyBg,
    color: color.textLight,
    borderRadius: borderRadius.large,
  },
  wrapperFocused: {
    backgroundColor: color.grey600,
  },
  text: {
    fontFamily: fontFamily.primary,
    fontSize: fontSize.xl,
    lineHeight: 1.35 * fontSize.xl,
    color: color.text,
  },
  textFocused: {
    color: color.textHighlight,
  },
});

export default TabBarItem;
