import Episode from "../../types/Episode";
import {
  GetMediaEpisodePreviewNewestApiResponse,
  MediaEpisodePreview,
} from "../types";
import toVideoToken from "./toVideoToken";

const findThumbnailUrl = (episodeResponse: MediaEpisodePreview, name: string) =>
  episodeResponse.thumbnail.find((t) => t.name === name)?.url ?? "";

const findVideoToken = (episodeResponse: MediaEpisodePreview, type: string) =>
  toVideoToken(episodeResponse.tokens.find((t) => t.type === type));

const toEpisode = (
  episodeResponse: MediaEpisodePreview,
  progressResponse: GetMediaEpisodePreviewNewestApiResponse["data"]["progress"]
): Episode => {
  const progress =
    progressResponse?.[episodeResponse.id.toString()].tokenProgress[0];

  return {
    id: episodeResponse.id.toString(),
    title: episodeResponse.title,
    showName: episodeResponse.showName,
    thumbnailUrls: {
      small: findThumbnailUrl(episodeResponse, "small"),
      medium: findThumbnailUrl(episodeResponse, "medium"),
      large: findThumbnailUrl(episodeResponse, "large"),
    },
    videoTokens: {
      rbsc: findVideoToken(episodeResponse, "rbsc"),
      youtube: findVideoToken(episodeResponse, "youtube"),
    },
    distributionPublishingDate: episodeResponse.distributionPublishingDate,
    progress: progress
      ? {
          progress: progress.progress,
          total: progress.total,
        }
      : undefined,
    watched: progressResponse?.[episodeResponse.id.toString()].watched,
  };
};

export default toEpisode;
