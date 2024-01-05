import React from 'react';
import {Provider} from 'react-redux';
import {store} from './src/app/redux/store';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import StackNavigator from './src/app/navigation/StackNavigator';
import * as Sentry from '@sentry/react-native';
import {setDefaultOptions} from 'date-fns';
import {de} from 'date-fns/locale';
import InitializeAppGate from './src/features/initializeApp/InitializeAppGate';

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

function App() {
  const navigation =
    React.useRef<NavigationContainerRef<ReactNavigation.RootParamList>>(null);

  return (
    <Provider store={store}>
      <InitializeAppGate>
        <NavigationContainer
          ref={navigation}
          onReady={() => {
            routingInstrumentation.registerNavigationContainer(navigation);
          }}>
          <StackNavigator />
        </NavigationContainer>
      </InitializeAppGate>
    </Provider>
  );
}

export default Sentry.wrap(App);
