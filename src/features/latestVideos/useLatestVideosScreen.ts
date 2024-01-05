import {useCallback, useEffect, useRef, useState} from 'react';
import {getMediaEpisodePreviewNewest} from '../../app/rbtvApi';
import Page from '../../app/types/Page';
import Episode from '../../app/types/Episode';
import {useSelector} from 'react-redux';
import {selectAuthToken} from '../auth/authTokenSlice';
import {useNavigation, useRoute} from '@react-navigation/native';
import {useAppDispatch} from '../../app/redux/store';
import capture from '../../app/capture';
import {AppState} from 'react-native';

const limit = 48;

function useLatestVideosScreen() {
  const dispatch = useAppDispatch();
  const total = useRef<number>();
  const [pages, setPages] = useState<Record<string, Page<Episode> | undefined>>(
    {},
  );

  const loadPage = useCallback(
    async (pageNumber: number) => {
      const offset = pageNumber * limit;
      if (total.current && total.current < offset) {
        return;
      }

      const page = await dispatch(
        getMediaEpisodePreviewNewest(
          {
            offset,
            limit,
          },
          {subscribe: false},
        ),
      ).unwrap();

      setPages(stalePages => {
        return {...stalePages, [pageNumber]: page};
      });
      total.current = page.meta.total;
    },
    [dispatch],
  );

  const navigation = useNavigation();
  const route = useRoute();

  const reloadAllPages = useCallback(() => {
    const pageNumbers = Object.keys(pages).map(Number);
    for (const pageNumber of pageNumbers) {
      capture(loadPage(pageNumber));
    }
  }, [loadPage, pages]);

  useEffect(() => {
    const unsubscribeFocusListener = navigation.addListener('focus', event => {
      if (event.target !== route.key) {
        return;
      }

      reloadAllPages();
    });

    const appStateSubscription = AppState.addEventListener('change', status => {
      if (status === 'active') {
        reloadAllPages();
      }
    });

    return () => {
      unsubscribeFocusListener();
      appStateSubscription.remove();
    };
  }, [loadPage, navigation, pages, reloadAllPages, route.key]);

  const authToken = useSelector(selectAuthToken);
  const episodes = Object.values(pages)
    .flatMap(page => page?.data ?? [])
    .filter(episode => !authToken?.appReview || episode.videoTokens.rbsc);

  const loadNextPage = useCallback(() => {
    const pageNumber = Math.max(...Object.keys(pages).map(Number), 0);
    capture(loadPage(pageNumber));
  }, [loadPage, pages]);

  return {
    episodes,
    loadNextPage,
  };
}

export default useLatestVideosScreen;
