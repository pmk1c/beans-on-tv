import React, {useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  StackNavigationProp,
  StackParamList,
} from '../../app/navigation/StackNavigator';
import {useLazyGetRbscVideoTokenQuery} from '../latestVideos/rbtvApi';
import Video from 'react-native-video';
import {ImageBackground, Linking, Modal, Text, View} from 'react-native';
import capture from '../../app/capture';
import color from '../../app/styles/tokens/color';
import spacing from '../../app/styles/tokens/spacing';
import borderRadius from '../../app/styles/tokens/borderRadius';
import fontFamily from '../../app/styles/tokens/fontFamily';
import fontSize from '../../app/styles/tokens/fontSizes';

type PlayerScreenRouteProp = RouteProp<StackParamList, 'Player'>;

function PlayerScreen(): JSX.Element {
  const episode = useRoute<PlayerScreenRouteProp>().params?.episode;

  const rbscVideoToken = episode.tokens.find(t => t.type === 'rbsc');
  const youtubeVideoToken = episode.tokens.find(t => t.type === 'youtube');
  const poster = episode.thumbnail.find(t => t.name === 'ytbig');
  const [signedToken, setSignedToken] = useState<string | undefined>(undefined);
  const [error, setError] = useState<'rbsc' | 'yt'>();

  const [getRbscVideoToken] = useLazyGetRbscVideoTokenQuery();
  const navigation = useNavigation<StackNavigationProp>();
  useEffect(() => {
    capture(
      (async () => {
        let rbscTokenError;
        if (rbscVideoToken) {
          try {
            const {data} = await getRbscVideoToken(
              rbscVideoToken.token,
            ).unwrap();
            setSignedToken(data.signedToken);
            return;
          } catch {}
        }

        if (youtubeVideoToken) {
          try {
            await Linking.openURL(`youtube://watch/${youtubeVideoToken.token}`);
            navigation.pop();
          } catch {
            if (rbscVideoToken) {
              setError('rbsc');
            } else {
              setError('yt');
            }
          }
          return;
        }

        throw new Error('No video token found!');
      })(),
    );
  }, [getRbscVideoToken, navigation, rbscVideoToken, youtubeVideoToken]);

  if (!signedToken) {
    return (
      <ImageBackground
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        source={episode?.thumbnail.map(thumbnail => ({
          uri: thumbnail.url,
          width: thumbnail.width,
          height: thumbnail.height,
        }))}>
        {error ? (
          <View
            style={{
              backgroundColor: color.darkTransparentBg,
              padding: spacing.l,
              borderRadius: borderRadius.large,
            }}>
            <Text
              style={{
                fontFamily: fontFamily.primary,
                fontSize: fontSize.xl,
                lineHeight: 1.35 * fontSize.xl,
                color: color.text,
                textAlign: 'center',
              }}>
              Das Video konnte nicht geladen werden.{' '}
              {error === 'rbsc'
                ? 'Melde dich mit deinem RBSC-Account an oder installiere die YouTube-App, um es zu sehen.'
                : ' Installiere die YouTube-App, um es zu sehen.'}
            </Text>
          </View>
        ) : null}
      </ImageBackground>
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
