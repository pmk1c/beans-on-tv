import { router } from "expo-router";
import { Host, Text } from "@expo/ui";
import { VideoView, useVideoPlayer } from "expo-video";
import { useEffect, useState } from "react";
import { ImageBackground, Linking, Platform } from "react-native";
import { useEventListener } from "expo";

import capture from "../../core/capture";
import { getMediaEpisode, getRbscVideoToken } from "../../core/rbtvApi/client";
import { selectSocket } from "../../core/rbtvApi/rbtvSocketApiSlice";
import { MediaEpisode } from "../../core/rbtvApi/types";
import { useAppSelector } from "../../core/redux/hooks";
import borderRadius from "../../core/styles/tokens/borderRadius";
import color from "../../core/styles/tokens/color";
import fontPresets from "../../core/styles/tokens/fontPresets";
import spacing from "../../core/styles/tokens/spacing";

interface Props {
  episodeId: string;
}

function getVideoToken(episode: MediaEpisode, type: "rbsc" | "youtube") {
  return episode.tokens.find((token) => token.type === type);
}

function getThumbnailUrl(episode: MediaEpisode, name: "small" | "medium" | "large") {
  return episode.thumbnail.find((thumbnail) => thumbnail.name === name)?.url;
}

function getEpisodeProgress(
  response: Awaited<ReturnType<typeof getMediaEpisode>>,
  episode: MediaEpisode,
) {
  return response.data.progress?.[episode.id.toString()]?.tokenProgress[0];
}

function PlayerScreen({ episodeId }: Props) {
  const [episode, setEpisode] = useState<MediaEpisode | undefined>(undefined);
  const [episodeProgress, setEpisodeProgress] = useState<
    { progress: number; total: number } | undefined
  >(undefined);

  // const rbscVideoToken = episode.tokens.find(t => t.type === 'rbsc');
  // const youtubeVideoToken = episode.tokens.find(t => t.type === 'youtube');
  // const poster = episode.thumbnail.find(t => t.name === 'ytbig');
  const [signedToken, setSignedToken] = useState<string | undefined>(undefined);
  const [error, setError] = useState<"rbsc" | "yt">();

  useEffect(() => {
    if (!episodeId) {
      setEpisode(undefined);
      return;
    }

    let isStale = false;
    setEpisode(undefined);
    setSignedToken(undefined);
    setError(undefined);

    capture(
      (async () => {
        try {
          const mediaEpisodeResponse = await getMediaEpisode(episodeId);
          const currentEpisode = mediaEpisodeResponse.data.episodes[0];
          const progress = currentEpisode
            ? getEpisodeProgress(mediaEpisodeResponse, currentEpisode)
            : undefined;
          if (!isStale) {
            setEpisode(currentEpisode);
            setEpisodeProgress(
              progress
                ? {
                    progress: progress.progress,
                    total: progress.total,
                  }
                : undefined,
            );
          }
        } catch {
          if (!isStale) {
            setError("rbsc");
          }
        }
      })(),
    );

    return () => {
      isStale = true;
    };
  }, [episodeId]);

  useEffect(() => {
    if (!episode) {
      return;
    }

    let isStale = false;
    setSignedToken(undefined);
    setError(undefined);

    capture(
      (async () => {
        const rbscToken = getVideoToken(episode, "rbsc");
        if (rbscToken) {
          try {
            const { data } = await getRbscVideoToken(rbscToken.token);
            if (!isStale) {
              setSignedToken(data.signedToken);
            }
            return;
          } catch {
            /* empty */
          }
        }

        const youtubeToken = getVideoToken(episode, "youtube");
        if (youtubeToken) {
          try {
            const { token } = youtubeToken;
            const url = Platform.select({
              ios: `youtube://watch/${token}`,
              default: `https://www.youtube.com/watch?v=${token}`,
            });
            await Linking.openURL(url);
            if (!isStale) {
              router.back();
            }
          } catch {
            if (!isStale) {
              if (rbscToken) {
                setError("rbsc");
              } else {
                setError("yt");
              }
            }
          }
          return;
        }
      })(),
    );

    return () => {
      isStale = true;
    };
  }, [episode]);

  const rbtvSocket = useAppSelector(selectSocket);
  const player = useVideoPlayer(
    {
      uri: `https://cloudflarestream.com/${signedToken}/manifest/video.m3u8`,
      metadata: {
        title: episode?.title,
        artist: episode?.showName,
        artwork: episode ? getThumbnailUrl(episode, "large") : undefined,
      },
    },
    (player) => {
      player.currentTime = episodeProgress?.progress ?? 0;
      player.timeUpdateEventInterval = 1;
      player.play();
    },
  );

  useEventListener(player, "timeUpdate", (event) => {
    if (!episode) return;

    const rbscToken = getVideoToken(episode, "rbsc");
    if (!rbscToken) {
      return;
    }

    rbtvSocket.emitMediaEpisodeProgressUpdate(episode.id, rbscToken.id, event.currentTime);
  });

  useEventListener(player, "playToEnd", () => {
    router.back();
  });

  if (!signedToken) {
    return (
      <ImageBackground
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        source={{ uri: episode ? getThumbnailUrl(episode, "large") : undefined }}
      >
        {error ? (
          <Host
            style={{
              backgroundColor: color.darkTransparentBg,
              padding: spacing.l,
              borderRadius: borderRadius.large,
            }}
          >
            <Text
              textStyle={{
                ...fontPresets.xl,
                color: color.text,
                textAlign: "center",
              }}
            >
              {`Das Video konnte nicht geladen werden. ${
                error === "rbsc"
                  ? "Melde dich mit deinem RBSC-Account an oder installiere die YouTube-App, um es zu sehen."
                  : "Installiere die YouTube-App, um es zu sehen."
              }`}
            </Text>
          </Host>
        ) : null}
      </ImageBackground>
    );
  }

  return (
    <VideoView
      style={{
        flex: 1,
      }}
      player={player}
      nativeControls
    />
  );
}

export default PlayerScreen;
