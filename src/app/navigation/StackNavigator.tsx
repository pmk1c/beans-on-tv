import React from 'react';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import HomeScreen from '../HomeScreen';
import PlayerScreen from '../../features/player/PlayerScreen';
import Episode from '../types/Episode';
import {StackNavigationState} from '@react-navigation/native';
import {TVEventControl} from 'react-native';

export type StackParamList = {
  Home: undefined;
  Player: {episode: Episode};
};

export type StackNavigationProp = NativeStackNavigationProp<StackParamList>;

const Stack = createNativeStackNavigator<StackParamList>();

function StackNavigator() {
  return (
    <Stack.Navigator
      screenListeners={{
        state: e => {
          const data = e.data as {
            state: StackNavigationState<StackParamList> | undefined;
          };

          // Disable TV menu key handling of React Native on home screen, so that the app closes on press.
          if (data.state?.routes.length === 1) {
            TVEventControl.disableTVMenuKey();
          } else {
            TVEventControl.enableTVMenuKey();
          }
        },
      }}
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Player" component={PlayerScreen} />
    </Stack.Navigator>
  );
}

export default StackNavigator;
