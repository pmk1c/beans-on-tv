import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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
  const [totalEpisodes, setTotalEpisodes] = useState<number | undefined>(undefined);
  const [pagesByNumber, setPagesByNumber] = useState<
    Map<number, GetMediaEpisodePreviewNewestApiResponse>
  >(new Map());

  const totalEpisodesRef = useRef(totalEpisodes);
  const pagesByNumberRef = useRef(pagesByNumber);
  const loadingPagesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    totalEpisodesRef.current = totalEpisodes;
  }, [totalEpisodes]);

  useEffect(() => {
    pagesByNumberRef.current = pagesByNumber;
  }, [pagesByNumber]);

  const loadPage = useCallback(async (pageNumber: number) => {
    if (pageNumber < 0) {
      return;
    }

    if (totalEpisodesRef.current != null && getOffset(pageNumber) >= totalEpisodesRef.current) {
      return;
    }

    if (pagesByNumberRef.current.has(pageNumber) || loadingPagesRef.current.has(pageNumber)) {
      return;
    }

    loadingPagesRef.current.add(pageNumber);

    try {
      const page = await getMediaEpisodePreviewNewest({
        offset: getOffset(pageNumber),
        limit: pageSize,
      });

      setTotalEpisodes(page.pagination.total);
      setPagesByNumber((current) => {
        if (current.has(pageNumber)) {
          return current;
        }

        const next = new Map(current);
        next.set(pageNumber, page);
        return next;
      });
    } finally {
      loadingPagesRef.current.delete(pageNumber);
    }
  }, []);

  const refetchLoadedPages = useCallback(async () => {
    const loadedPageNumbers = Array.from(pagesByNumberRef.current.keys());
    const pageNumbersToRefetch = loadedPageNumbers.length > 0 ? loadedPageNumbers : [0];
    const refreshedPages = await Promise.all(
      pageNumbersToRefetch.map(async (pageNumber) => ({
        pageNumber,
        page: await getMediaEpisodePreviewNewest({
          offset: getOffset(pageNumber),
          limit: pageSize,
        }),
      })),
    );

    setPagesByNumber((current) => {
      const next = new Map(current);
      for (const { pageNumber, page } of refreshedPages) {
        next.set(pageNumber, page);
      }

      return next;
    });

    const firstRefreshedPage = refreshedPages[0]?.page;
    if (firstRefreshedPage) {
      setTotalEpisodes(firstRefreshedPage.pagination.total);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      capture(refetchLoadedPages());
    }, [refetchLoadedPages]),
  );

  useEffect(() => {
    capture(loadPage(0));
  }, [loadPage]);

  const episodes = useMemo(() => {
    if (totalEpisodes == null) {
      return [];
    }

    const items = Array.from<MediaEpisodePreview | undefined>({
      length: totalEpisodes,
    });

    for (const page of pagesByNumber.values()) {
      items.splice(page.pagination.offset, page.data.episodes.length, ...page.data.episodes);
    }

    return items;
  }, [pagesByNumber, totalEpisodes]);

  const progressByEpisodeId = useMemo(() => {
    const merged = new Map<number, MediaEpisodeTokenProgress>();

    for (const page of pagesByNumber.values()) {
      if (!page.data.progress) {
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
  }, [pagesByNumber]);

  const onEpisodeAppear = useCallback(
    (index: number) => {
      const pageNumber = getItemPage(index);
      const indexInPage = index % pageSize;

      capture(loadPage(pageNumber));

      if (indexInPage >= pageSize - 4) {
        capture(loadPage(pageNumber + 1));
      }
    },
    [loadPage],
  );

  return {
    episodes,
    progressByEpisodeId,
    onEpisodeAppear,
  };
}

export default useLatestVideosScreen;
