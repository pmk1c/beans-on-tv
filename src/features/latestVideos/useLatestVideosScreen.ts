import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ViewToken } from "react-native";

import { getMediaEpisodePreviewNewest } from "../../core/rbtvApi/client";
import {
  GetMediaEpisodePreviewNewestApiResponse,
  MediaEpisodePreview,
  MediaEpisodeTokenProgress,
} from "../../core/rbtvApi/types";

import capture from "@/src/core/capture";

const pageSize = 12;
const getOffset = (pageNumber: number) => pageNumber * pageSize;
const getItemPage = (index: number) => Math.floor(index / pageSize);

function useLatestVideosScreen() {
  const [currentPageNumber, setCurrentPageNumber] = useState(0);
  const [lastPage, setLastPage] = useState<GetMediaEpisodePreviewNewestApiResponse | undefined>(
    undefined,
  );
  const [currentPage, setCurrentPage] = useState<
    GetMediaEpisodePreviewNewestApiResponse | undefined
  >(undefined);
  const [nextPage, setNextPage] = useState<GetMediaEpisodePreviewNewestApiResponse | undefined>(
    undefined,
  );

  const loadPages = useCallback(async (pageNumber: number) => {
    const current = await getMediaEpisodePreviewNewest({
      offset: getOffset(pageNumber),
      limit: pageSize,
    });

    const [last, next] = await Promise.all([
      pageNumber > 0
        ? getMediaEpisodePreviewNewest({
            offset: getOffset(pageNumber - 1),
            limit: pageSize,
          })
        : Promise.resolve(undefined),
      current.pagination.total >= getOffset(pageNumber + 1)
        ? getMediaEpisodePreviewNewest({
            offset: getOffset(pageNumber + 1),
            limit: pageSize,
          })
        : Promise.resolve(undefined),
    ]);

    setCurrentPage(current);
    setLastPage(last);
    setNextPage(next);
  }, []);

  const refetchAllPages = useCallback(async () => {
    await loadPages(currentPageNumber);
  }, [currentPageNumber, loadPages]);

  useFocusEffect(
    useCallback(() => {
      capture(refetchAllPages());
    }, [refetchAllPages]),
  );

  useEffect(() => {
    capture(loadPages(currentPageNumber));
  }, [currentPageNumber, loadPages]);

  const episodes = useMemo(() => {
    if (!currentPage) return [];

    const items = Array.from<MediaEpisodePreview | undefined>({
      length: currentPage.pagination.total,
    });
    for (const page of [lastPage, currentPage, nextPage]) {
      if (!page) continue;

      items.splice(page.pagination.offset, page.pagination.limit, ...page.data.episodes);
    }

    return items;
  }, [lastPage, currentPage, nextPage]);

  const progressByEpisodeId = useMemo(() => {
    const merged = new Map<number, MediaEpisodeTokenProgress>();

    for (const page of [lastPage, currentPage, nextPage]) {
      if (!page?.data.progress) {
        continue;
      }

      for (const [episodeId, progress] of Object.entries(page.data.progress)) {
        const tokenProgress = progress.tokenProgress[0];
        if (tokenProgress) {
          merged.set(Number(episodeId), tokenProgress);
        }
      }
    }

    return merged;
  }, [lastPage, currentPage, nextPage]);

  const onViewableItemsChanged = useCallback(
    ({ changed, viewableItems }: { changed: ViewToken[]; viewableItems: ViewToken[] }) => {
      const viewableItemIndexes = viewableItems
        .map((item) => item.index)
        .filter(Boolean) as number[];
      const firstViewableItemIndex = viewableItemIndexes[0];
      const lastViewableItemIndex = viewableItemIndexes[viewableItemIndexes.length - 1];
      const isScrollingUp = changed.some(({ isViewable, index }) =>
        isViewable
          ? // when scrolling up, the first visible item has to have been changed to be visible
            index === firstViewableItemIndex
          : // or an item after the currently visible items has to have been changed to be invisible
            index != null && index > lastViewableItemIndex,
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
    progressByEpisodeId,
    onViewableItemsChanged,
  };
}

export default useLatestVideosScreen;
