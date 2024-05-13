import { useNavigation, useRoute } from "@react-navigation/native";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ViewToken } from "react-native";

import { useGetMediaEpisodePreviewNewestQuery } from "../../core/rbtvApi";
import Episode from "../../core/types/Episode";

const pageSize = 12;
const getOffset = (pageNumber: number) => pageNumber * pageSize;
const getItemPage = (index: number) => Math.floor(index / pageSize);

function useLatestVideosScreen() {
  const [currentPageNumber, setCurrentPageNumber] = useState(0);

  const { data: lastPage, refetch: refetchLastPage } =
    useGetMediaEpisodePreviewNewestQuery(
      {
        offset: getOffset(currentPageNumber - 1),
        limit: pageSize,
      },
      { refetchOnFocus: true, skip: currentPageNumber === 0 },
    );
  const { data: currentPage, refetch: refetchCurrentPage } =
    useGetMediaEpisodePreviewNewestQuery(
      {
        offset: getOffset(currentPageNumber),
        limit: pageSize,
      },
      { refetchOnFocus: true },
    );
  const { data: nextPage, refetch: refetchNextPage } =
    useGetMediaEpisodePreviewNewestQuery(
      {
        offset: getOffset(currentPageNumber + 1),
        limit: pageSize,
      },
      {
        refetchOnFocus: true,
        skip:
          !currentPage ||
          currentPage.meta.total < getOffset(currentPageNumber + 1),
      },
    );

  const episodes = useMemo(() => {
    if (!currentPage) return [];

    const items = new Array<Episode | undefined>(currentPage.meta.total);
    for (const page of [lastPage, currentPage, nextPage]) {
      if (!page) continue;

      items.splice(page.meta.offset, page.meta.limit, ...page.data);
    }

    return items;
  }, [lastPage, currentPage, nextPage]);

  const navigation = useNavigation();
  const route = useRoute();

  const refetchAllPages = useCallback(async () => {
    if (!currentPage) return;

    await refetchCurrentPage();
    await refetchLastPage();
    await refetchNextPage();
  }, [currentPage, refetchCurrentPage, refetchLastPage, refetchNextPage]);

  useEffect(() => {
    const unsubscribeFocusListener = navigation.addListener(
      "focus",
      (event) => {
        if (event.target !== route.key) {
          return;
        }

        refetchAllPages();
      },
    );

    return () => {
      unsubscribeFocusListener();
    };
  }, [navigation, refetchAllPages, route.key]);

  const onViewableItemsChanged = useCallback(
    ({
      changed,
      viewableItems,
    }: {
      changed: ViewToken[];
      viewableItems: ViewToken[];
    }) => {
      const viewableItemIndexes = viewableItems.map((item) => item.index!);
      const firstViewableItemIndex = viewableItemIndexes[0];
      const lastViewableItemIndex =
        viewableItemIndexes[viewableItemIndexes.length - 1];
      const isScrollingUp = changed.some(({ isViewable, index }) =>
        isViewable
          ? // when scrolling up, the first visible item has to have been changed to be visible
            index! === firstViewableItemIndex
          : // or an item after the currently visible items has to have been changed to be invisible
            index! > lastViewableItemIndex,
      );

      if (isScrollingUp) {
        setCurrentPageNumber(getItemPage(firstViewableItemIndex));
      } else {
        setCurrentPageNumber(getItemPage(lastViewableItemIndex));
      }
    },
    [setCurrentPageNumber],
  );

  return {
    episodes,
    onViewableItemsChanged,
  };
}

export default useLatestVideosScreen;
