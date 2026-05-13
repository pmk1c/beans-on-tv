import { formatDistanceToNowStrict } from "date-fns";
import { Image } from "expo-image";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Column, Host, Row, Text } from "@expo/ui";

import { useAppSelector } from "../../core/redux/hooks";
import perfectSize from "../../core/styles/perfectSize";
import borderRadius from "../../core/styles/tokens/borderRadius";
import color from "../../core/styles/tokens/color";
import fontPresets from "../../core/styles/tokens/fontPresets";
import spacing from "../../core/styles/tokens/spacing";
import { MediaEpisodePreview, MediaEpisodeTokenProgress } from "../../core/rbtvApi/types";
import { selectAuthToken } from "../auth/authTokenSlice";

interface EpisodeCardProps {
  episode?: MediaEpisodePreview;
  progress?: MediaEpisodeTokenProgress;
  thumbnailPriority: "high" | "normal" | "low";
}

const width = perfectSize(420);
const height = width * (9 / 16);

const isYouTubeOnly = (episode: MediaEpisodePreview | undefined, isLoggedIn: boolean) => {
  if (!episode) return false;
  if (!isLoggedIn) return true;

  return !episode.tokens.some((token) => token.type === "rbsc");
};

function EpisodeCard({ episode, progress, thumbnailPriority }: EpisodeCardProps) {
  const isLoggedIn = !!useAppSelector(selectAuthToken);

  return (
    <Pressable
      onPress={() => {
        if (!episode) return;

        router.navigate({
          pathname: "/player/[episodeId]",
          params: { episodeId: episode.id.toString() },
        });
      }}
      // eslint-disable-next-line react/no-children-prop
      children={({ focused }) => (
        <Host
          style={{
            padding: spacing.m,
            overflow: "hidden",
            width,
            height: perfectSize(400),
            flexDirection: "column",
            gap: spacing.m,
            alignItems: "center",
            marginBottom: spacing["2xl"],
            borderRadius: borderRadius.large,
            borderWidth: perfectSize(4),
            borderColor: focused ? color.red500 : "transparent",
          }}
        >
          {isYouTubeOnly(episode, isLoggedIn) && (
            <Image
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
              source={require("../../core/assets/icons/yt_icon_rgb.png")}
              style={{
                position: "absolute",
                zIndex: 1,
                top: spacing.xs,
                left: spacing.xs,
                height: perfectSize(48),
                width: (734 / 518) * perfectSize(48),
              }}
              contentFit="contain"
            />
          )}
          <Host
            style={{
              overflow: "hidden",
              transform: [{ scale: focused ? 1.1 : 1 }],
            }}
          >
            <View
              style={{
                position: "absolute",
                zIndex: 1,
                height,
                width: `${progress ? (progress.progress / progress.total) * 100 : 0}%`,
                borderColor: color.yellow500,
                borderBottomWidth: spacing.xs,
              }}
            />
            <Image
              style={{
                height,
                width,
                borderBottomWidth: progress ? spacing.xs : 0,
                borderColor: color.grey700,
              }}
              source={{
                uri: episode?.thumbnail.find((thumbnail) => thumbnail.name === "small")?.url,
              }}
              priority={thumbnailPriority}
              // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-require-imports
              placeholder={require("../../core/assets/images/placeholder_16x9-420.png")}
            />
          </Host>
          <Column spacing={spacing["2xs"]}>
            <Text
              numberOfLines={2}
              textStyle={{
                color: color.textHighlight,
                ...fontPresets.xl,
              }}
            >
              {episode?.title}
            </Text>
            <Row spacing={spacing.s}>
              <Text
                textStyle={{
                  color: color.textHighlight,
                  ...fontPresets.l,
                }}
                numberOfLines={1}
              >
                {episode?.showName}
              </Text>
              <Text
                textStyle={{
                  color: color.textHighlight,
                  ...fontPresets.l,
                }}
                numberOfLines={1}
              >
                {episode &&
                  formatDistanceToNowStrict(Date.parse(episode.distributionPublishingDate), {
                    addSuffix: true,
                  })}
              </Text>
            </Row>
          </Column>
        </Host>
      )}
    />
  );
}

export default EpisodeCard;
