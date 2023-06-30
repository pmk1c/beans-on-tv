import React from 'react';
import {Provider} from 'react-redux';
import {store} from './app/store';
import {NavigationContainer} from '@react-navigation/native';
import StackNavigator from './app/navigation/StackNavigator';

function App(): JSX.Element | null {
  return (
    <NavigationContainer>
      <Provider store={store}>
        <StackNavigator />
      </Provider>
    </NavigationContainer>
  );
}

export default App;
