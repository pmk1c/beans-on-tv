import React from 'react';
import {StyleSheet, View} from 'react-native';
import spacing from '../../styleTokens/spacing';
import TabBarItem from './TabBarItem';
import Tab from './Tab';
import borderRadius from '../../styleTokens/borderRadius';
import color from '../../styleTokens/color';
import useTabBar from './useTabBar';
import TabBarContext from './TabBarContext';

type TabBarProps = {
  tabs: Tab[];
};

function TabBar({tabs}: TabBarProps): JSX.Element {
  const {focusedTab, setFocusedTab} = useTabBar(tabs);

  return (
    <TabBarContext.Provider value={{setFocusedTab}}>
      <View style={styles.wrapper}>
        <View style={styles.tabBar}>
          {tabs.map(tab => (
            <TabBarItem key={tab.name} tab={tab} />
          ))}
        </View>
      </View>
      {focusedTab.content}
    </TabBarContext.Provider>
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
