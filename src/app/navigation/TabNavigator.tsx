import React from 'react';
import createTVTopTabNavigator from './createTVTopTabNavigator';
import LatestVideosScreen from '../../features/latestVideos/LatestVideosScreen';
import AuthScreen from '../../features/auth/AuthScreen';

export type TabParamList = {
  LatestVideos: undefined;
  Auth: undefined;
};

const Tab = createTVTopTabNavigator<TabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="LatestVideos"
        component={LatestVideosScreen}
        options={{title: 'Neueste Videos'}}
      />
      <Tab.Screen
        name="Auth"
        component={AuthScreen}
        options={{icon: 'user_circle'}}
      />
    </Tab.Navigator>
  );
}

export default TabNavigator;
