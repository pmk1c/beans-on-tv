import {useCallback, useContext} from 'react';
import Tab from './Tab';
import TabBarContext from './TabBarContext';

function useTabBarItem(tab: Tab) {
  const {setFocusedTab} = useContext(TabBarContext);

  const onFocus = useCallback(() => {
    setFocusedTab(tab);
  }, [setFocusedTab, tab]);

  return {onFocus};
}

export default useTabBarItem;
