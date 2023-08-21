import Episode from '../../types/Episode';
import {GetMediaEpisodePreviewNewestApiResponse} from '../rbtvApiWithEndpoints.generated';

type EpisodeResponse =
  GetMediaEpisodePreviewNewestApiResponse['data']['episodes'][0];

const findThumbnailUrl = (response: EpisodeResponse, name: string) =>
  response.thumbnail.find(t => t.name === name)?.url ?? '';

const findVideoToken = (response: EpisodeResponse, type: string) =>
  response.tokens.find(t => t.type === type);

const toEpisode = (response: EpisodeResponse): Episode => {
  return {
    id: response.id,
    title: response.title,
    showName: response.showName,
    thumbnailUrls: {
      small: findThumbnailUrl(response, 'small'),
      medium: findThumbnailUrl(response, 'medium'),
      large: findThumbnailUrl(response, 'large'),
    },
    videoTokens: {
      rbsc: findVideoToken(response, 'rbsc'),
      youtube: findVideoToken(response, 'youtube'),
    },
    distributionPublishingDate: response.distributionPublishingDate,
  };
};

export default toEpisode;
