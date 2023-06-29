import React from 'react';
import {ImageBackground} from 'react-native';
import AuthScreen from './features/auth/AuthScreen';
import LatestVideosScreen from './features/latestVideos/LatestVideosScreen';
import TabBar from './app/components/tabBar/TabBar';
import {Provider} from 'react-redux';
import {store} from './app/store';

const backgroundImage = require('./app/assets/images/body_bg2021.jpg');

function App(): JSX.Element | null {
  return (
    <Provider store={store}>
      <ImageBackground source={backgroundImage} style={{flex: 1}}>
        <TabBar
          tabs={[
            {
              name: 'latestVideos',
              title: 'Neueste Videos',
              content: <LatestVideosScreen />,
            },
            {
              name: 'auth',
              icon: 'user_circle',
              content: <AuthScreen />,
            },
          ]}
        />
      </ImageBackground>
    </Provider>
  );
}

export default App;
