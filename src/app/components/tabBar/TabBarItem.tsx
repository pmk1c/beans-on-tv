import React from 'react';
import Tab from './Tab';
import useTabBarItem from './useTabBarItem';
import Button from '../Button';

type TabBarProps = {
  tab: Tab;
};

function TabBarItem({tab}: TabBarProps): JSX.Element {
  const {onFocus} = useTabBarItem(tab);

  return <Button icon={tab.icon} title={tab.title} onFocus={onFocus} />;
}

export default TabBarItem;
