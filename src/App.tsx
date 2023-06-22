import React from 'react';
import {ImageBackground, Pressable, Text, View} from 'react-native';
import AuthScreen from './features/auth/AuthScreen';
import LatestVideosScreen from './features/latestVideos/LatestVideosScreen';
import TabBar from './app/components/tabBar/TabBar';

function App(): JSX.Element {
  return (
    <ImageBackground
      source={require('./app/assets/images/body_bg2021.jpg')}
      style={{flex: 1}}>
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
  );
}

export default App;
