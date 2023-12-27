import React, {useEffect, useState} from 'react';
import {RouteProp, useNavigation, useRoute} from '@react-navigation/native';
import {
  StackNavigationProp,
  StackParamList,
} from '../../app/navigation/StackNavigator';
import Video, {ResizeMode} from 'react-native-video';
import {ImageBackground, Linking, Platform, Text, View} from 'react-native';
import capture from '../../app/capture';
import color from '../../app/styles/tokens/color';
import spacing from '../../app/styles/tokens/spacing';
import borderRadius from '../../app/styles/tokens/borderRadius';
import fontPresets from '../../app/styles/tokens/fontPresets';
import {useLazyGetRbscVideoTokenByVideoTokenQuery} from '../../app/rbtvApi/rbtvApiEnhanced';

type PlayerScreenRouteProp = RouteProp<StackParamList, 'Player'>;

function PlayerScreen(): JSX.Element {
  const episode = useRoute<PlayerScreenRouteProp>().params?.episode;

  // const rbscVideoToken = episode.tokens.find(t => t.type === 'rbsc');
  // const youtubeVideoToken = episode.tokens.find(t => t.type === 'youtube');
  // const poster = episode.thumbnail.find(t => t.name === 'ytbig');
  const [signedToken, setSignedToken] = useState<string | undefined>(undefined);
  const [error, setError] = useState<'rbsc' | 'yt'>();

  const [getRbscVideoToken] = useLazyGetRbscVideoTokenByVideoTokenQuery();
  const navigation = useNavigation<StackNavigationProp>();
  useEffect(() => {
    capture(
      (async () => {
        if (episode.videoTokens.rbsc) {
          try {
            const {data} = await getRbscVideoToken({
              videoToken: episode.videoTokens.rbsc.token,
            }).unwrap();
            setSignedToken(data?.signedToken);
            return;
          } catch {}
        }

        if (episode.videoTokens.youtube) {
          try {
            const {token} = episode.videoTokens.youtube;
            const url = Platform.select({
              ios: `youtube://watch/${token}`,
              android: `https://www.youtube.com/watch?v=${token}`,
            }) as string;
            await Linking.openURL(url);
            navigation.pop();
          } catch {
            if (episode.videoTokens.rbsc) {
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
  }, [getRbscVideoToken, navigation, episode]);

  if (!signedToken) {
    return (
      <ImageBackground
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}
        source={{uri: episode.thumbnailUrls.large}}>
        {error ? (
          <View
            style={{
              backgroundColor: color.darkTransparentBg,
              padding: spacing.l,
              borderRadius: borderRadius.large,
            }}>
            <Text
              style={{
                ...fontPresets.xl,
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
      poster={episode.thumbnailUrls.large}
      controls
      resizeMode={ResizeMode.CONTAIN}
      useTextureView={false}
    />
  );
}

export default PlayerScreen;
