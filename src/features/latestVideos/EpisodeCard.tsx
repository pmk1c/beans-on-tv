/* eslint-disable @typescript-eslint/no-var-requires */
import React from "react";
import { Image } from "expo-image";
import { ImageSourcePropType, Pressable, Text, View } from "react-native";
import borderRadius from "../../app/styles/tokens/borderRadius";
import color from "../../app/styles/tokens/color";
import spacing from "../../app/styles/tokens/spacing";
import { useNavigation } from "@react-navigation/native";
import { StackNavigationProp } from "../../app/navigation/StackNavigator";
import { formatDistanceToNowStrict } from "date-fns";
import perfectSize from "../../app/styles/perfectSize";
import fontPresets from "../../app/styles/tokens/fontPresets";
import Episode from "../../app/types/Episode";
import { useAppSelector } from "../../app/redux/store";
import { selectAuthToken } from "../auth/authTokenSlice";

interface EpisodeCardProps {
  episode: Episode;
  thumbnailPriority: "high" | "normal" | "low";
}

const width = perfectSize(420);
const height = width * (9 / 16);

function EpisodeCard({ episode, thumbnailPriority }: EpisodeCardProps) {
  const isLoggedIn = !!useAppSelector(selectAuthToken);
  const isYouTubeOnly = !isLoggedIn || !episode.videoTokens.rbsc;
  const navigation = useNavigation<StackNavigationProp>();

  return (
    <Pressable
      style={{
        width: width,
        height: height + spacing.m + fontPresets.xl.fontSize * 1.35 * 3,
        flexDirection: "column",
        gap: spacing.m,
        alignItems: "center",
      }}
      onPress={() => navigation.push("Player", { episode })}
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
            {isYouTubeOnly && (
              <Image
                source={require("../../app/assets/icons/yt_icon_rgb.png")}
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
                  episode.progress
                    ? (episode.progress.progress / episode.progress.total) * 100
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
                borderBottomWidth: episode.progress ? spacing.xs : 0,
                borderColor: color.grey700,
              }}
              source={{
                uri: episode.thumbnailUrls.small,
              }}
              priority={thumbnailPriority}
              placeholder={require("../../app/assets/images/placeholder_16x9-420.png")}
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
              {episode.title}
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
                {episode.showName}
              </Text>
              <Text
                style={{
                  color: color.textHighlight,
                  ...fontPresets.l,
                }}
                numberOfLines={1}
              >
                {formatDistanceToNowStrict(
                  Date.parse(episode.distributionPublishingDate),
                  {
                    addSuffix: true,
                  }
                )}
              </Text>
            </View>
          </View>
        </>
      )}
    />
  );
}

export default EpisodeCard;
