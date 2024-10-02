import { useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { ViewToken } from "react-native";

import { useGetMediaEpisodePreviewNewestQuery } from "../../core/rbtvApi";
import Episode from "../../core/types/Episode";

const pageSize = 12;
const getOffset = (pageNumber: number) => pageNumber * pageSize;
const getItemPage = (index: number) => Math.floor(index / pageSize);

function useLatestVideosScreen() {
  const [currentPageNumber, setCurrentPageNumber] = useState(0);

  const {
    data: lastPage,
    refetch: refetchLastPage,
    isSuccess: isSuccessLastPage,
  } = useGetMediaEpisodePreviewNewestQuery(
    {
      offset: getOffset(currentPageNumber - 1),
      limit: pageSize,
    },
    { refetchOnFocus: true, skip: currentPageNumber === 0 }
  );
  const {
    data: currentPage,
    refetch: refetchCurrentPage,
    isSuccess: isSuccessCurrentPage,
  } = useGetMediaEpisodePreviewNewestQuery(
    {
      offset: getOffset(currentPageNumber),
      limit: pageSize,
    },
    { refetchOnFocus: true }
  );
  const {
    data: nextPage,
    refetch: refetchNextPage,
    isSuccess: isSuccessNextPage,
  } = useGetMediaEpisodePreviewNewestQuery(
    {
      offset: getOffset(currentPageNumber + 1),
      limit: pageSize,
    },
    {
      refetchOnFocus: true,
      skip:
        !currentPage ||
        currentPage.meta.total < getOffset(currentPageNumber + 1),
    }
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

  const refetchAllPages = useCallback(async () => {
    if (isSuccessCurrentPage) await refetchCurrentPage();
    if (isSuccessLastPage) await refetchLastPage();
    if (isSuccessNextPage) await refetchNextPage();
  }, [
    isSuccessCurrentPage,
    isSuccessLastPage,
    isSuccessNextPage,
    refetchCurrentPage,
    refetchLastPage,
    refetchNextPage,
  ]);

  useFocusEffect(
    useCallback(() => {
      refetchAllPages();
    }, [refetchAllPages])
  );

  const onViewableItemsChanged = useCallback(
    ({
      changed,
      viewableItems,
    }: {
      changed: ViewToken[];
      viewableItems: ViewToken[];
    }) => {
      const viewableItemIndexes = viewableItems
        .map((item) => item.index)
        .filter(Boolean) as number[];
      const firstViewableItemIndex = viewableItemIndexes[0];
      const lastViewableItemIndex =
        viewableItemIndexes[viewableItemIndexes.length - 1];
      const isScrollingUp = changed.some(({ isViewable, index }) =>
        isViewable
          ? // when scrolling up, the first visible item has to have been changed to be visible
            index === firstViewableItemIndex
          : // or an item after the currently visible items has to have been changed to be invisible
            index != null && index > lastViewableItemIndex
      );

      if (isScrollingUp) {
        setCurrentPageNumber(getItemPage(firstViewableItemIndex));
      } else {
        setCurrentPageNumber(getItemPage(lastViewableItemIndex));
      }
    },
    [setCurrentPageNumber]
  );

  return {
    episodes,
    onViewableItemsChanged,
  };
}

export default useLatestVideosScreen;
