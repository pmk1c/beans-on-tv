import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import toPage from "./mappings/toPage";
import Page from "../types/Page";
import Episode from "../types/Episode";
import {
  GetFrontendInitApiResponse,
  GetMediaEpisodePreviewNewestApiResponse,
  GetRbscVideoTokenApiResponse,
} from "./types";
import { selectAuthToken } from "../../features/auth/authTokenSlice";
import { RootState } from "../redux/store";

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
    getFrontendInit: build.query<GetFrontendInitApiResponse, void>({
      query: () => ({ url: "/frontend/init" }),
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

export const { useLazyGetRbscVideoTokenQuery } = rbtvApi;
export const {
  endpoints: { getMediaEpisodePreviewNewest },
} = rbtvApi;
