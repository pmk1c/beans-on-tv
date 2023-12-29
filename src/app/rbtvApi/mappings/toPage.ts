import Episode from '../../types/Episode';
import Page from '../../types/Page';
import {GetMediaEpisodePreviewNewestApiResponse} from '../rbtvApi';
import toEpisode from './toEpisode';

const toPage = (
  response: GetMediaEpisodePreviewNewestApiResponse,
): Page<Episode> => {
  return {
    data: response.data?.episodes?.map(toEpisode) ?? [],
    meta: {
      total: response.pagination?.total ?? 0,
    },
  };
};

export default toPage;
