import React from 'react';
import {StyleSheet, TVFocusGuideView, View} from 'react-native';
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
      <View style={{flex: 1, flexDirection: 'column', alignItems: 'stretch'}}>
        <TVFocusGuideView
          autoFocus
          trapFocusLeft
          trapFocusRight
          style={styles.wrapper}>
          <View style={styles.tabBar}>
            {tabs.map(tab => (
              <TabBarItem key={tab.name} tab={tab} />
            ))}
          </View>
        </TVFocusGuideView>
        {focusedTab.content}
      </View>
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
