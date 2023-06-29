import React from 'react';
import {FlatList, Image, Pressable} from 'react-native';
import {useGetMediaEpisodePreviewNewestQuery} from './rbtvApi';
import borderRadius from '../../app/styleTokens/borderRadius';
import spacing from '../../app/styleTokens/spacing';

function LatestVideosScreen(): JSX.Element {
  const {data} = useGetMediaEpisodePreviewNewestQuery(0);
  const episodes = data?.data?.episodes;

  console.log('episodes', episodes);

  return (
    <FlatList
      contentContainerStyle={{
        gap: spacing['2xl'],
        padding: spacing['2xl'],
        alignItems: 'center',
      }}
      columnWrapperStyle={{
        gap: spacing['2xl'],
      }}
      data={episodes}
      keyExtractor={episode => episode.id.toString()}
      numColumns={4}
      renderItem={({item: episode}) => (
        <Pressable
          children={({focused}) => (
            <Image
              style={{
                height: 225,
                width: 400,
                borderRadius: borderRadius.large,
                transform: [{scale: focused ? 1.1 : 1}],
              }}
              source={episode?.thumbnail.map(thumbnail => ({
                uri: thumbnail.url,
                width: thumbnail.width,
                height: thumbnail.height,
              }))}
            />
          )}
        />
      )}
    />
  );
}

export default LatestVideosScreen;
