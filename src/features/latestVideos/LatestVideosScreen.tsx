import { Row } from "@expo/ui";
import { useMemo } from "react";

import LazyScrollView from "@/src/core/components/LazyScrollView/index.web";

import EpisodeCard from "./EpisodeCard";
import useLatestVideosScreen from "./useLatestVideosScreen";
import spacing from "@/src/core/styles/tokens/spacing";

const numColumns = 4;

function LatestVideosScreen() {
  const { episodes, progressByEpisodeId, onEpisodeAppear } = useLatestVideosScreen();

  const rows = useMemo(() => {
    const chunks: Array<Array<{ episode: (typeof episodes)[number]; index: number }>> = [];

    for (let rowStartIndex = 0; rowStartIndex < episodes.length; rowStartIndex += numColumns) {
      const rowItems: Array<{ episode: (typeof episodes)[number]; index: number }> = [];

      for (let offset = 0; offset < numColumns; offset += 1) {
        const index = rowStartIndex + offset;
        if (index >= episodes.length) {
          break;
        }

        rowItems.push({ episode: episodes[index], index });
      }

      chunks.push(rowItems);
    }

    return chunks;
  }, [episodes]);

  const rowsContent = rows.map((rowItems, rowIndex) => {
    const firstIndex = rowItems[0]?.index;

    return (
      <Row
        key={rowIndex.toString()}
        onAppear={firstIndex != null ? () => onEpisodeAppear(firstIndex) : undefined}
      >
        {rowItems.map(({ index, episode }) => (
          <EpisodeCard
            key={index.toString()}
            episode={episode}
            progress={episode ? progressByEpisodeId.get(episode.id) : undefined}
            thumbnailPriority={
              index < numColumns ? "high" : index < numColumns * 2 ? "normal" : "low"
            }
          />
        ))}
      </Row>
    );
  });

  return <LazyScrollView style={{ paddingTop: 2 * spacing["2xl"] }}>{rowsContent}</LazyScrollView>;
}

export default LatestVideosScreen;
