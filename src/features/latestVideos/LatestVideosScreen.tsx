import { FlatList } from "react-native";

import EpisodeCard from "./EpisodeCard";
import useLatestVideosScreen from "./useLatestVideosScreen";

const numColumns = 4;

function LatestVideosScreen() {
  const { episodes, progressByEpisodeId, onViewableItemsChanged } = useLatestVideosScreen();

  return (
    <FlatList
      data={episodes}
      // We need to use the index here as key to make sure
      // the list stays stable when the data for an episode
      // gets loaded and the data changes from undefined to
      // be defined.
      keyExtractor={(episode, index) => index.toString()}
      numColumns={numColumns}
      renderItem={({ index, item: episode }) => (
        <EpisodeCard
          episode={episode}
          progress={episode ? progressByEpisodeId.get(episode.id) : undefined}
          thumbnailPriority={
            index < numColumns ? "high" : index < numColumns * 2 ? "normal" : "low"
          }
        />
      )}
      onViewableItemsChanged={onViewableItemsChanged}
    />
  );
}

export default LatestVideosScreen;
