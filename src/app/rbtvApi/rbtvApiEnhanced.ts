import {
  DefinitionsFromApi,
  OverrideResultType,
  TagTypesFromApi,
} from '@reduxjs/toolkit/dist/query/endpointDefinitions';
import {
  GetMediaEpisodePreviewNewestApiResponse,
  rbtvApiWithEndpoints,
} from './rbtvApiWithEndpoints.generated';
import Episode from '../types/Episode';
import Page from '../types/Page';
import toPage from './mappings/toPage';

type Definitions = DefinitionsFromApi<typeof rbtvApiWithEndpoints>;
type TagTypes = TagTypesFromApi<typeof rbtvApiWithEndpoints>;

type UpdatedDefinitions = Omit<Definitions, 'getMediaEpisodePreviewNewest'> & {
  getMediaEpisodePreviewNewest: OverrideResultType<
    Definitions['getMediaEpisodePreviewNewest'],
    Page<Episode>
  >;
};

const rbtvApi = rbtvApiWithEndpoints.enhanceEndpoints<
  TagTypes,
  UpdatedDefinitions
>({
  endpoints: {
    getMediaEpisodePreviewNewest: {
      transformResponse: (
        response: GetMediaEpisodePreviewNewestApiResponse,
      ) => {
        return toPage(response);
      },
    },
  },
});

export const {
  useLazyGetMediaEpisodePreviewNewestQuery,
  useLazyGetRbscVideoTokenByVideoTokenQuery,
} = rbtvApi;
