import React from 'react';
import {ImageBackground, ImageRequireSource} from 'react-native';
import TabNavigator from './navigation/TabNavigator';

const backgroundImage =
  require('./assets/images/body_bg2021.jpg') as ImageRequireSource;

function HomeScreen(): JSX.Element | null {
  return (
    <ImageBackground source={backgroundImage} style={{flex: 1}}>
      <TabNavigator />
    </ImageBackground>
  );
}

export default HomeScreen;
