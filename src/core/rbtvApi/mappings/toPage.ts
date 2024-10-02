import toEpisode from "./toEpisode";
import Episode from "../../types/Episode";
import Page from "../../types/Page";
import { GetMediaEpisodePreviewNewestApiResponse } from "../types";

const toPage = (
  response: GetMediaEpisodePreviewNewestApiResponse
): Page<Episode> => {
  return {
    data: response.data.episodes.map((episode) =>
      toEpisode(episode, response.data.progress)
    ),
    meta: {
      limit: response.pagination.limit,
      offset: response.pagination.offset,
      total: response.pagination.total,
    },
  };
};

export default toPage;
