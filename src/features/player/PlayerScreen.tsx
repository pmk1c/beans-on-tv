import React from 'react';
import {RouteProp, useRoute} from '@react-navigation/native';
import {StackParamList} from '../../app/navigation/StackNavigator';
import {useGetRbscVideoTokenQuery} from '../latestVideos/rbtvApi';
import Video from 'react-native-video';
import {Dimensions} from 'react-native';

type PlayerScreenRouteProp = RouteProp<StackParamList, 'Player'>;

function PlayerScreen(): JSX.Element {
  const episode = useRoute<PlayerScreenRouteProp>().params?.episode;

  const rbscVideoToken = episode.tokens.find(t => t.type === 'rbsc');
  if (!rbscVideoToken) {
    throw new Error('No rbsc video token found');
  }

  const poster = episode.thumbnail.find(t => t.name === 'ytbig');

  const {data} = useGetRbscVideoTokenQuery(rbscVideoToken.token);
  const signedToken = data?.data.signedToken;

  if (!signedToken) {
    return <></>;
  }

  return (
    <Video
      style={{
        flex: 1,
      }}
      source={{
        uri: `https://cloudflarestream.com/${signedToken}/manifest/video.m3u8`,
      }}
      poster={poster?.url}
      controls
    />
  );
}

export default PlayerScreen;
