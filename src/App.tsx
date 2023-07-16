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

function App(): JSX.Element | null {
  const navigation =
    React.useRef<NavigationContainerRef<ReactNavigation.RootParamList>>(null);

  const dispatch = useAppDispatch();
  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        dispatch(authApi.endpoints.ping.initiate());
      }
    });

    () => subscription.remove();
  });

  return (
    <NavigationContainer
      ref={navigation}
      onReady={() => {
        routingInstrumentation.registerNavigationContainer(navigation);
      }}>
      <Provider store={store}>
        <StackNavigator />
      </Provider>
    </NavigationContainer>
  );
}

export default Sentry.wrap(App);
