import React from 'react';
import FastImage from 'react-native-fast-image';
import {Pressable, Text, View} from 'react-native';
import borderRadius from '../../app/styleTokens/borderRadius';
import {mediaEpisode} from '../../../rbtv-apidoc';
import color from '../../app/styleTokens/color';
import fontFamily from '../../app/styleTokens/fontFamily';
import fontSize from '../../app/styleTokens/fontSizes';
import spacing from '../../app/styleTokens/spacing';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '../../app/navigation/StackNavigator';
import capture from '../../app/capture';

interface EpisodeCardProps {
  episode: mediaEpisode;
  thumbnailPriority: 'high' | 'normal' | 'low';
}

const width = 420;
const height = width * (9 / 16);

function findThumbnail(thumbnails: mediaEpisode['thumbnail']) {
  const thumbnail =
    thumbnails.find(t => t.name === 'medium') ??
    thumbnails.find(t => t.name === 'ytbig') ??
    thumbnails.find(t => t.name === 'large') ??
    thumbnails.find(t => t.name === 'source');

  if (!thumbnail) {
    capture(new Error('No thumbnail found'));
  }

  return thumbnail;
}

function EpisodeCard({
  episode,
  thumbnailPriority,
}: EpisodeCardProps): JSX.Element {
  const navigation = useNavigation<StackNavigationProp>();
  const thumbnail = findThumbnail(episode.thumbnail);
  const fastImagePriority =
    thumbnailPriority === 'high'
      ? FastImage.priority.high
      : thumbnailPriority === 'normal'
      ? FastImage.priority.normal
      : FastImage.priority.low;

  return (
    <Pressable
      style={{
        width: width,
        height: height + spacing.m + fontSize.xl * 1.35 * 3,
        flexDirection: 'column',
        gap: spacing.m,
        alignItems: 'center',
      }}
      onPress={() => navigation.push('Player', {episode})}
      children={({focused}) => (
        <>
          <FastImage
            style={{
              borderRadius: borderRadius.large,
              height,
              width,
              transform: [{scale: focused ? 1.1 : 1}],
            }}
            source={{
              uri: thumbnail?.url,
              priority: fastImagePriority,
            }}
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
        </>
      )}
    />
  );
}

export default EpisodeCard;
