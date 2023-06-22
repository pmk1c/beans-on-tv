import {ReactNode} from 'react';
import {RBTVIconName} from '../../assets/icons/RBTVIcon';

type Tab = {
  name: string;
  title?: string;
  icon?: RBTVIconName;
  content: ReactNode;
};

export default Tab;
