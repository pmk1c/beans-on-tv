import React, {useEffect} from 'react';
import {Provider} from 'react-redux';
import {store, useAppDispatch} from './app/store';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import StackNavigator from './app/navigation/StackNavigator';
import * as Sentry from '@sentry/react-native';
import {AppState} from 'react-native';
import authApi from './features/auth/authApi';
import capture from './app/capture';
import {initializeAuthToken} from './features/auth/authTokenSlice';

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: 'https://60db18e3490142bdab575ef0b3727906@o4504708985847808.ingest.sentry.io/4505467350810624',
  tracesSampleRate: __DEV__ ? 1.0 : 0.2,
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
    }),
  ],
});

function App(): JSX.Element {
  const navigation =
    React.useRef<NavigationContainerRef<ReactNavigation.RootParamList>>(null);

  const dispatch = useAppDispatch();
  capture(dispatch(initializeAuthToken()));
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        capture(dispatch(authApi.endpoints.ping.initiate()));
      }
    });

    () => subscription.remove();
  }, [dispatch]);

  return (
    <NavigationContainer
      ref={navigation}
      onReady={() => {
        routingInstrumentation.registerNavigationContainer(navigation);
      }}>
      <StackNavigator />
    </NavigationContainer>
  );
}

function AppWithProvider(): JSX.Element {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
}

export default Sentry.wrap(AppWithProvider);
