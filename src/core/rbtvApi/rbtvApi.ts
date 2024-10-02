import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import toPage from "./mappings/toPage";
import {
  GetFrontendInitApiResponse,
  GetMediaEpisodeApiResponse,
  GetMediaEpisodePreviewNewestApiResponse,
  GetRbscVideoTokenApiResponse,
} from "./types";
import { selectAuthToken } from "../../features/auth/authTokenSlice";
import { RootState } from "../redux/store";
import Episode from "../types/Episode";
import Page from "../types/Page";
import toEpisode from "./mappings/toEpisode";

type GetMediaEpisodePreviewNewestApiArg = {
  offset?: number;
  limit?: number;
};

type GetRbscVideoTokenApiArg = {
  videoToken?: string;
};

export const rbtvApi = createApi({
  reducerPath: "rbtvApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://api.rocketbeans.tv/v1/",
    prepareHeaders: (headers, { getState }) => {
      headers.set("Content-Type", "application/json");

      const authToken = selectAuthToken(getState() as RootState);
      if (authToken) {
        headers.set("Authorization", `Bearer ${authToken.accessToken}`);
      }

      return headers;
    },
  }),
  endpoints: (build) => ({
    getFrontendInit: build.query<GetFrontendInitApiResponse, undefined>({
      query: () => ({ url: "/frontend/init" }),
    }),
    getMediaEpisode: build.query<Episode, string>({
      query: (episodeId) => ({ url: `/media/episode/${episodeId}` }),
      transformResponse: (response: GetMediaEpisodeApiResponse) =>
        toEpisode(response.data.episodes[0], response.data.progress),
    }),
    getMediaEpisodePreviewNewest: build.query<
      Page<Episode>,
      GetMediaEpisodePreviewNewestApiArg
    >({
      query: (arg) => ({
        url: "/media/episode/preview/newest",
        params: { offset: arg.offset, limit: arg.limit },
      }),
      transformResponse: (
        response: GetMediaEpisodePreviewNewestApiResponse
      ) => {
        return toPage(response);
      },
    }),
    getRbscVideoToken: build.query<
      GetRbscVideoTokenApiResponse,
      GetRbscVideoTokenApiArg
    >({
      query: (arg) => ({ url: `/rbsc/video/token/${arg.videoToken}` }),
    }),
  }),
});

export const {
  useLazyGetRbscVideoTokenQuery,
  useGetMediaEpisodeQuery,
  useGetMediaEpisodePreviewNewestQuery,
} = rbtvApi;
