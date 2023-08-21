import {useCallback, useEffect, useState} from 'react';
import capture from '../../app/capture';
import {AppState} from 'react-native';
import {useLazyGetMediaEpisodePreviewNewestQuery} from '../../app/rbtvApi';
import Page from '../../app/types/Page';
import Episode from '../../app/types/Episode';

const limit = 48;

function useLatestVideosScreen() {
  const [pages, setPages] = useState<Record<string, Page<Episode> | undefined>>(
    {},
  );
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
      setPages(stalePages => {
        if (pageNumber === 0) {
          const stalePage = stalePages[pageNumber];
          if (stalePage?.data[0].id !== response.data[0].id) {
            return {0: response};
          }
        }

        return {...stalePages, [pageNumber]: response};
      });
      setTotal(response.meta.total);
    },
    [total, getMediaEpisodePreviewNewest],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener('change', state => {
      if (state === 'active') {
        capture(loadPage(0));
      }
    });

    () => subscription.remove();
  }, [loadPage]);

  const episodes = Object.values(pages).flatMap(page => page?.data ?? []);

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
