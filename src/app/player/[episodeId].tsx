import { useLocalSearchParams } from "expo-router";

import PlayerScreen from "../../features/player/PlayerScreen";

export default function Page() {
  const { episodeId } = useLocalSearchParams<{ episodeId: string }>();

  return <PlayerScreen episodeId={episodeId} />;
}
