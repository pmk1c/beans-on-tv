import React from 'react';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import PlayerScreen from '../../features/player/PlayerScreen';
import Episode from '../types/Episode';
import {StackNavigationState} from '@react-navigation/native';
import {TVEventControl} from 'react-native';
import AuthScreen from '../../features/auth/AuthScreen';
import {useAppSelector} from '../redux/store';
import {selectAuthToken} from '../../features/auth/authTokenSlice';
import TabNavigator from './TabNavigator';

export type StackParamList = {
  Auth: undefined;
  Main: undefined;
  Player: {episode: Episode};
};

export type StackNavigationProp = NativeStackNavigationProp<StackParamList>;

const Stack = createNativeStackNavigator<StackParamList>();

function StackNavigator() {
  const isLoggedIn = useAppSelector(selectAuthToken);

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
        contentStyle: {
          backgroundColor: 'transparent',
        },
        headerShown: false,
      }}>
      {isLoggedIn ? (
        <>
          <Stack.Screen name="Main" component={TabNavigator} />
          <Stack.Screen name="Player" component={PlayerScreen} />
        </>
      ) : (
        <Stack.Screen name="Auth" component={AuthScreen} />
      )}
    </Stack.Navigator>
  );
}

export default StackNavigator;
