import React from 'react';
import FastImage from 'react-native-fast-image';
import {Pressable, Text, View} from 'react-native';
import borderRadius from '../../app/styles/tokens/borderRadius';
import {mediaEpisode} from '../../../rbtv-apidoc';
import color from '../../app/styles/tokens/color';
import spacing from '../../app/styles/tokens/spacing';
import {useNavigation} from '@react-navigation/native';
import {StackNavigationProp} from '../../app/navigation/StackNavigator';
import capture from '../../app/capture';
import {formatDistanceToNowStrict} from 'date-fns';
import perfectSize from '../../app/styles/perfectSize';
import fontPresets from '../../app/styles/tokens/fontPresets';

interface EpisodeCardProps {
  episode: mediaEpisode;
  thumbnailPriority: 'high' | 'normal' | 'low';
}

const width = perfectSize(420);
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
        height: height + spacing.m + fontPresets.xl.fontSize * 1.35 * 3,
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
              borderWidth: focused ? 2 : 0,
              borderColor: color.textHighlight,
            }}
            source={{
              uri: thumbnail?.url,
              priority: fastImagePriority,
            }}
            defaultSource={require('../../app/assets/images/placeholder_16x9-420.png')}
          />
          <View style={{gap: spacing['2xs']}}>
            <Text
              numberOfLines={2}
              style={{
                color: color.textHighlight,
                ...fontPresets.xl,
              }}>
              {episode.title}
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                flex: 1,
              }}>
              <Text
                style={{
                  color: color.textHighlight,
                  ...fontPresets.l,
                }}
                numberOfLines={1}>
                {episode.showName}
              </Text>
              <Text
                style={{
                  color: color.textHighlight,
                  ...fontPresets.l,
                }}
                numberOfLines={1}>
                {formatDistanceToNowStrict(
                  Date.parse(
                    episode.distributionPublishingDate as unknown as string,
                  ),
                  {
                    addSuffix: true,
                  },
                )}
              </Text>
            </View>
          </View>
        </>
      )}
    />
  );
}

export default EpisodeCard;
