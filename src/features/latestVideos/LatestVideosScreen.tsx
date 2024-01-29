import React from "react";
import { FlatList } from "react-native";
import spacing from "../../app/styles/tokens/spacing";
import EpisodeCard from "./EpisodeCard";
import useLatestVideosScreen from "./useLatestVideosScreen";

const numColumns = 4;
function LatestVideosScreen(): JSX.Element {
  const { episodes, loadNextPage } = useLatestVideosScreen();

  return (
    <FlatList
      contentContainerStyle={{
        gap: spacing["2xl"],
        padding: spacing.xl,
      }}
      columnWrapperStyle={{
        gap: spacing["2xl"],
      }}
      data={episodes}
      keyExtractor={(episode) => episode.id.toString()}
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
      onEndReached={loadNextPage}
      onEndReachedThreshold={1}
    />
  );
}

export default LatestVideosScreen;
