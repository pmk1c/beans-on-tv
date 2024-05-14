import { formatDistanceToNowStrict } from "date-fns";
import { Image } from "expo-image";
import { Pressable, Text, View } from "react-native";
import { Link } from "expo-router";

import { useAppSelector } from "../../core/redux/hooks";
import perfectSize from "../../core/styles/perfectSize";
import borderRadius from "../../core/styles/tokens/borderRadius";
import color from "../../core/styles/tokens/color";
import fontPresets from "../../core/styles/tokens/fontPresets";
import spacing from "../../core/styles/tokens/spacing";
import Episode from "../../core/types/Episode";
import { selectAuthToken } from "../auth/authTokenSlice";

interface EpisodeCardProps {
  episode?: Episode;
  thumbnailPriority: "high" | "normal" | "low";
}

const width = perfectSize(420);
const height = width * (9 / 16);

const isYouTubeOnly = (episode: Episode | undefined, isLoggedIn: boolean) => {
  if (!episode) return false;
  if (!isLoggedIn) return true;

  return !episode.videoTokens.rbsc;
};

function EpisodeCard({ episode, thumbnailPriority }: EpisodeCardProps) {
  const isLoggedIn = !!useAppSelector(selectAuthToken);

  return (
    <Link
      href={{
        pathname: "/player/[episodeId]",
        params: { episodeId: episode?.id },
      }}
      asChild
    >
      <Pressable
        style={{
          width,
          height: height + spacing.m + fontPresets.xl.fontSize * 1.35 * 3,
          flexDirection: "column",
          gap: spacing.m,
          alignItems: "center",
        }}
        children={({ focused }) => (
          <>
            <View
              style={{
                overflow: "hidden",
                transform: [{ scale: focused ? 1.1 : 1 }],
                borderRadius: borderRadius.large,
                borderWidth: perfectSize(2),
                borderColor: focused ? color.textHighlight : "transparent",
              }}
            >
              {isYouTubeOnly(episode, isLoggedIn) && (
                <Image
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
              <View
                style={{
                  position: "absolute",
                  zIndex: 1,
                  height,
                  width: `${
                    episode?.progress
                      ? (episode.progress.progress / episode.progress.total) *
                        100
                      : 0
                  }%`,
                  borderColor: color.yellow500,
                  borderBottomWidth: spacing.xs,
                }}
              />
              <Image
                style={{
                  height,
                  width,
                  borderBottomWidth: episode?.progress ? spacing.xs : 0,
                  borderColor: color.grey700,
                }}
                source={{
                  uri: episode?.thumbnailUrls.small,
                }}
                priority={thumbnailPriority}
                placeholder={require("../../core/assets/images/placeholder_16x9-420.png")}
              />
            </View>
            <View style={{ gap: spacing["2xs"] }}>
              <Text
                numberOfLines={2}
                style={{
                  color: color.textHighlight,
                  ...fontPresets.xl,
                }}
              >
                {episode?.title}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  flex: 1,
                }}
              >
                <Text
                  style={{
                    color: color.textHighlight,
                    ...fontPresets.l,
                  }}
                  numberOfLines={1}
                >
                  {episode?.showName}
                </Text>
                <Text
                  style={{
                    color: color.textHighlight,
                    ...fontPresets.l,
                  }}
                  numberOfLines={1}
                >
                  {episode &&
                    formatDistanceToNowStrict(
                      Date.parse(episode.distributionPublishingDate),
                      {
                        addSuffix: true,
                      },
                    )}
                </Text>
              </View>
            </View>
          </>
        )}
      />
    </Link>
  );
}

export default EpisodeCard;
