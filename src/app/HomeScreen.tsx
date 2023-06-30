import React from 'react';
import {ImageBackground} from 'react-native';
import AuthScreen from '../features/auth/AuthScreen';
import LatestVideosScreen from '../features/latestVideos/LatestVideosScreen';
import TabBar from './components/tabBar/TabBar';

const backgroundImage = require('./assets/images/body_bg2021.jpg');

function HomeScreen(): JSX.Element | null {
  return (
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
  );
}

export default HomeScreen;
