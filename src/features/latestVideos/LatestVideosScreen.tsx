import React from 'react';
import {FlatList} from 'react-native';
import {useGetMediaEpisodePreviewNewestQuery} from './rbtvApi';
import spacing from '../../app/styleTokens/spacing';
import EpisodeCard from './EpisodeCard';

function LatestVideosScreen(): JSX.Element {
  const {data} = useGetMediaEpisodePreviewNewestQuery(0);
  const episodes = data?.data?.episodes;

  return (
    <FlatList
      contentContainerStyle={{
        gap: spacing['xl'],
        padding: spacing['xl'],
        alignItems: 'center',
      }}
      columnWrapperStyle={{
        gap: spacing['2xl'],
      }}
      data={episodes}
      keyExtractor={episode => episode.id.toString()}
      numColumns={4}
      renderItem={({item: episode}) => <EpisodeCard episode={episode} />}
    />
  );
}

export default LatestVideosScreen;
