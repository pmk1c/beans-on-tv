import {useState} from 'react';
import Tab from './Tab';

function useTabBar(tabs: Tab[]) {
  const [focusedTabIndex, setFocusedTabIndex] = useState(0);

  const focusedTab = tabs[focusedTabIndex];
  const setFocusedTab = (tab: Tab) => {
    const tabIndex = tabs.indexOf(tab);

    if (tabIndex === -1) {
      throw new Error('Tab not found');
    }

    setFocusedTabIndex(tabIndex);
  };

  return {focusedTab, setFocusedTab};
}

export default useTabBar;
