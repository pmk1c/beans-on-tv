import React, {useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  StackNavigationProp,
  StackParamList,
} from '../../app/navigation/StackNavigator';
import {useLazyGetRbscVideoTokenQuery} from '../latestVideos/rbtvApi';
import Video from 'react-native-video';
import {Image, Linking} from 'react-native';

type PlayerScreenRouteProp = RouteProp<StackParamList, 'Player'>;

function PlayerScreen(): JSX.Element {
  const episode = useRoute<PlayerScreenRouteProp>().params?.episode;

  const rbscVideoToken = episode.tokens.find(t => t.type === 'rbsc');
  const youtubeVideoToken = episode.tokens.find(t => t.type === 'youtube');
  const poster = episode.thumbnail.find(t => t.name === 'ytbig');
  const [signedToken, setSignedToken] = useState<string | undefined>(undefined);

  const [getRbscVideoToken] = useLazyGetRbscVideoTokenQuery();
  const navigation = useNavigation<StackNavigationProp>();
  useEffect(() => {
    (async () => {
      try {
        if (!rbscVideoToken) {
          throw new Error('No rbsc token found');
        }

        const {data} = await getRbscVideoToken(rbscVideoToken.token).unwrap();
        setSignedToken(data.signedToken);
      } catch {
        if (!youtubeVideoToken) {
          return;
        }

        await Linking.openURL(`youtube://watch/${youtubeVideoToken.token}`);
        navigation.pop();
      }
    })();
  }, [getRbscVideoToken, navigation, rbscVideoToken, youtubeVideoToken]);

  if (!signedToken) {
    return (
      <Image
        style={{
          flex: 1,
        }}
        source={episode?.thumbnail.map(thumbnail => ({
          uri: thumbnail.url,
          width: thumbnail.width,
          height: thumbnail.height,
        }))}
      />
    );
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
