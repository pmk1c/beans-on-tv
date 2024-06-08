import { FlatList } from "react-native";

import EpisodeCard from "./EpisodeCard";
import useLatestVideosScreen from "./useLatestVideosScreen";
import spacing from "../../core/styles/tokens/spacing";

const numColumns = 4;
function LatestVideosScreen(): JSX.Element {
  const { episodes, onViewableItemsChanged } = useLatestVideosScreen();

  return (
    <FlatList
      columnWrapperStyle={{
        gap: spacing["2xl"],
      }}
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
          thumbnailPriority={
            index < numColumns
              ? "high"
              : index < numColumns * 2
              ? "normal"
              : "low"
          }
        />
      )}
      onViewableItemsChanged={onViewableItemsChanged}
    />
  );
}

export default LatestVideosScreen;
