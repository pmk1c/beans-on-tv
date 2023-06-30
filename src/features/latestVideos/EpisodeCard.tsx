import React from 'react';
import {Image, Pressable, Text, View} from 'react-native';
import borderRadius from '../../app/styleTokens/borderRadius';
import {mediaEpisode} from '../../../rbtv-apidoc';
import color from '../../app/styleTokens/color';
import fontFamily from '../../app/styleTokens/fontFamily';
import fontSize from '../../app/styleTokens/fontSizes';
import spacing from '../../app/styleTokens/spacing';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '../../app/navigation/StackNavigator';

interface EpisodeCardProps {
  episode: mediaEpisode;
}

const width = 420;
const height = width * (9 / 16);

function EpisodeCard({episode}: EpisodeCardProps): JSX.Element {
  const navigation = useNavigation<StackNavigationProp>();

  return (
    <Pressable
      onPress={() => navigation.push('Player', {episode})}
      children={({focused}) => (
        <View
          style={{
            flexDirection: 'column',
            width: width,
            gap: spacing.m,
            alignItems: 'center',
          }}>
          <Image
            style={{
              borderRadius: borderRadius.large,
              height,
              width,
              transform: [{scale: focused ? 1.1 : 1}],
            }}
            source={episode?.thumbnail.map(thumbnail => ({
              uri: thumbnail.url,
              width: thumbnail.width,
              height: thumbnail.height,
            }))}
          />
          <Text
            style={{
              opacity: focused ? 1 : 0,
              color: color.textHighlight,
              fontFamily: fontFamily.primary,
              fontSize: fontSize.xl,
              lineHeight: 1.35 * fontSize.xl,
            }}>
            {episode.title}
          </Text>
        </View>
      )}
    />
  );
}

export default EpisodeCard;
