import { router } from "expo-router";
import { Video, ResizeMode } from "expo-av";
import { useEffect, useState } from "react";
import { ImageBackground, Linking, Platform, Text, View } from "react-native";

import capture from "../../core/capture";
import {
  useGetMediaEpisodeQuery,
  useLazyGetRbscVideoTokenQuery,
} from "../../core/rbtvApi";
import { selectSocket } from "../../core/rbtvApi/rbtvSocketApiSlice";
import { useAppSelector } from "../../core/redux/hooks";
import borderRadius from "../../core/styles/tokens/borderRadius";
import color from "../../core/styles/tokens/color";
import fontPresets from "../../core/styles/tokens/fontPresets";
import spacing from "../../core/styles/tokens/spacing";

interface Props {
  episodeId: string;
}

function PlayerScreen({ episodeId }: Props) {
  const { data: episode } = useGetMediaEpisodeQuery(episodeId ?? "", {
    skip: !episodeId,
    refetchOnMountOrArgChange: true,
  });

  // const rbscVideoToken = episode.tokens.find(t => t.type === 'rbsc');
  // const youtubeVideoToken = episode.tokens.find(t => t.type === 'youtube');
  // const poster = episode.thumbnail.find(t => t.name === 'ytbig');
  const [signedToken, setSignedToken] = useState<string | undefined>(undefined);
  const [error, setError] = useState<"rbsc" | "yt">();

  const [getRbscVideoToken] = useLazyGetRbscVideoTokenQuery();
  useEffect(() => {
    capture(
      (async () => {
        if (episode?.videoTokens.rbsc) {
          try {
            const { data } = await getRbscVideoToken({
              videoToken: episode.videoTokens.rbsc.token,
            }).unwrap();
            setSignedToken(data?.signedToken);
            return;
          } catch {}
        }

        if (episode?.videoTokens.youtube) {
          try {
            const { token } = episode.videoTokens.youtube;
            const url = Platform.select({
              ios: `youtube://watch/${token}`,
              android: `https://www.youtube.com/watch?v=${token}`,
            }) as string;
            await Linking.openURL(url);
            router.back();
          } catch {
            if (episode.videoTokens.rbsc) {
              setError("rbsc");
            } else {
              setError("yt");
            }
          }
          return;
        }
      })()
    );
  }, [getRbscVideoToken, episode]);

  const rbtvSocket = useAppSelector(selectSocket);

  if (!signedToken) {
    return (
      <ImageBackground
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
        source={{ uri: episode?.thumbnailUrls.large }}
      >
        {error ? (
          <View
            style={{
              backgroundColor: color.darkTransparentBg,
              padding: spacing.l,
              borderRadius: borderRadius.large,
            }}
          >
            <Text
              style={{
                ...fontPresets.xl,
                color: color.text,
                textAlign: "center",
              }}
            >
              Das Video konnte nicht geladen werden.{" "}
              {error === "rbsc"
                ? "Melde dich mit deinem RBSC-Account an oder installiere die YouTube-App, um es zu sehen."
                : " Installiere die YouTube-App, um es zu sehen."}
            </Text>
          </View>
        ) : null}
      </ImageBackground>
    );
  }

  const positionMillis = (episode?.progress?.progress ?? 0) * 1000;

  return (
    <Video
      style={{
        flex: 1,
      }}
      source={{
        uri: `https://cloudflarestream.com/${signedToken}/manifest/video.m3u8`,
      }}
      status={{
        shouldPlay: true,
        positionMillis,
      }}
      positionMillis={positionMillis}
      posterSource={{ uri: episode?.thumbnailUrls.large }}
      useNativeControls
      usePoster
      resizeMode={ResizeMode.CONTAIN}
      progressUpdateIntervalMillis={1000}
      onPlaybackStatusUpdate={(status) => {
        if (!status.isLoaded || !episode) {
          return;
        }

        if (status.didJustFinish) {
          router.back();
          return;
        }

        rbtvSocket.emitMediaEpisodeProgressUpdate(
          episode,
          status.positionMillis / 1000
        );
      }}
    />
  );
}

export default PlayerScreen;
