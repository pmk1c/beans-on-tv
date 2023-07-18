import {useCallback, useEffect, useState} from 'react';
import {
  GetMediaEpisodePreviewNewestResponse,
  useLazyGetMediaEpisodePreviewNewestQuery,
} from './rbtvApi';
import capture from '../../app/capture';

const limit = 50;

function useLatestVideosScreen() {
  const [pages, setPages] = useState<
    Record<string, GetMediaEpisodePreviewNewestResponse['data']>
  >({});
  const [total, setTotal] = useState<number>();
  const [getMediaEpisodePreviewNewest] =
    useLazyGetMediaEpisodePreviewNewestQuery();

  const loadPage = useCallback(
    async (pageNumber: number) => {
      const offset = pageNumber * limit;
      if (total && total < offset) {
        return;
      }

      const response = await getMediaEpisodePreviewNewest({
        offset: pageNumber * limit,
        limit,
      }).unwrap();
      setPages(stalePages => ({...stalePages, [pageNumber]: response.data}));
      setTotal(response.pagination.total);
    },
    [total, getMediaEpisodePreviewNewest],
  );

  useEffect(() => {
    capture(loadPage(0));
  }, [loadPage]);

  const episodes = Object.values(pages).flatMap(data => data.episodes);

  const loadNextPage = useCallback(() => {
    const pageNumber = Object.keys(pages).length;
    capture(loadPage(pageNumber));
  }, [loadPage, pages]);

  return {
    episodes,
    loadNextPage,
  };
}

export default useLatestVideosScreen;
