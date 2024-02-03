import { useNavigation, useRoute } from "@react-navigation/native";
import { createSelector } from "@reduxjs/toolkit";
import { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";

import capture from "../../app/capture";
import { getMediaEpisodePreviewNewest } from "../../app/rbtvApi";
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from "../../app/redux/store";
import { selectAuthToken } from "../auth/authTokenSlice";

const limit = 12;
const getOffset = (pageNumber: number) => pageNumber * limit;

const createSelectEpisodes = (pageNumbers: number[]) =>
  createSelector(
    pageNumbers.map((pageNumber) =>
      getMediaEpisodePreviewNewest.select({
        offset: getOffset(pageNumber),
        limit,
      }),
    ),
    (...pages) => pages.flatMap((page) => page.data?.data ?? []),
  );

const selectTotal = (state: RootState) =>
  getMediaEpisodePreviewNewest.select({ offset: 0, limit })(state).data?.meta
    .total;

function useLatestVideosScreen() {
  const dispatch = useAppDispatch();
  const [pageNumbers, setPageNumbers] = useState<number[]>([0]);
  const subscriptions = useRef<
    ReturnType<ReturnType<typeof getMediaEpisodePreviewNewest.initiate>>[]
  >([]);

  useEffect(() => {
    subscriptions.current = pageNumbers.map((pageNumber) => {
      const offset = getOffset(pageNumber);

      return dispatch(
        getMediaEpisodePreviewNewest.initiate(
          { offset, limit },
          {
            subscriptionOptions: {
              refetchOnFocus: true,
            },
          },
        ),
      );
    });

    return () => {
      subscriptions.current.forEach((subscription) =>
        subscription.unsubscribe(),
      );
      subscriptions.current = [];
    };
  }, [dispatch, pageNumbers]);

  const navigation = useNavigation();
  const route = useRoute();

  const reloadAllPages = useCallback(async () => {
    for (const subscription of subscriptions.current) {
      await subscription.refetch();
    }
  }, []);

  useEffect(() => {
    const unsubscribeFocusListener = navigation.addListener(
      "focus",
      (event) => {
        if (event.target !== route.key) {
          return;
        }

        capture(reloadAllPages());
      },
    );

    return () => {
      unsubscribeFocusListener();
    };
  }, [navigation, reloadAllPages, route.key]);

  const authToken = useSelector(selectAuthToken);

  const episodes = useAppSelector(createSelectEpisodes(pageNumbers)).filter(
    (episode) => !authToken?.appReview || episode.videoTokens.rbsc,
  );

  const total = useAppSelector(selectTotal);
  const loadNextPage = useCallback(() => {
    const nextPageNumber = Math.max(...pageNumbers) + 1;

    if (total && getOffset(nextPageNumber) >= total) {
      return;
    }

    setPageNumbers(pageNumbers.concat(nextPageNumber));
  }, [pageNumbers, total]);

  return {
    episodes,
    loadNextPage,
  };
}

export default useLatestVideosScreen;
