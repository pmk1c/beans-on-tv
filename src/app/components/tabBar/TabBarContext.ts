import {createContext} from 'react';
import Tab from './Tab';

const TabBarContext = createContext({
  setFocusedTab: (_tab: Tab) => {},
});

export default TabBarContext;
