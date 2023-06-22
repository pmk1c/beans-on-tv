import React from 'react';
import {StyleSheet, View} from 'react-native';
import spacing from '../../styleTokens/spacing';
import TabBarItem from './TabBarItem';
import Tab from './Tab';
import borderRadius from '../../styleTokens/borderRadius';
import color from '../../styleTokens/color';

type TabBarProps = {
  tabs: Tab[];
};

function TabBar(props: TabBarProps): JSX.Element {
  return (
    <View style={styles.wrapper}>
      <View style={styles.tabBar}>
        {props.tabs.map(tab => (
          <TabBarItem key={tab.name} tab={tab} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    marginTop: spacing.m,
    borderRadius: borderRadius.large,
    backgroundColor: color.bodyBg,
  },
});

export default TabBar;
