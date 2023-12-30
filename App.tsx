import React from 'react';
import {Provider} from 'react-redux';
import {store, useAppDispatch} from './src/app/redux/store';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import StackNavigator from './src/app/navigation/StackNavigator';
import * as Sentry from '@sentry/react-native';
import capture from './src/app/capture';
import {initializeAuthToken} from './src/features/auth/authTokenSlice';
import {setDefaultOptions} from 'date-fns';
import {de} from 'date-fns/locale';
import {initializeSocket} from './src/app/rbtvApi/rbtvSocketApiSlice';

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  dsn: 'https://60db18e3490142bdab575ef0b3727906@o4504708985847808.ingest.sentry.io/4505467350810624',
  enabled: !__DEV__,
  tracesSampleRate: __DEV__ ? 1.0 : 0.2,
  integrations: [
    new Sentry.ReactNativeTracing({
      routingInstrumentation,
    }),
  ],
});

setDefaultOptions({locale: de});

function App(): JSX.Element {
  const navigation =
    React.useRef<NavigationContainerRef<ReactNavigation.RootParamList>>(null);

  const dispatch = useAppDispatch();
  capture(dispatch(initializeAuthToken()));
  capture(dispatch(initializeSocket()));

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
