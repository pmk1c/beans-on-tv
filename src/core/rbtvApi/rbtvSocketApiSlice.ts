import { nanoid } from "@reduxjs/toolkit";

import { createSliceWithThunks } from "../redux/createSliceWithThunks";

import RBTVSocket from "./RBTVSocket";

import { rbtvApi } from ".";

const sockets: Record<string, RBTVSocket> = {};

export const rbtvSocketApiSlice = createSliceWithThunks({
  name: "rbtvSocketApi",
  initialState: {
    socketId: undefined as string | undefined,
  },
  reducers: (create) => ({
    initializeSocket: create.asyncThunk<string>(
      async (arg, { dispatch }) => {
        const socketId = nanoid();
        const {
          data: { websocket },
        } = await dispatch(rbtvApi.endpoints.getFrontendInit.initiate()).unwrap();
        sockets[socketId] = new RBTVSocket(websocket.url, websocket.path);

        return socketId;
      },
      {
        rejected: (state) => {
          state.socketId = undefined;
        },
        fulfilled: (state, action) => {
          state.socketId = action.payload;
        },
      },
    ),
  }),
  selectors: {
    selectSocket: (state) => {
      if (!state.socketId) {
        throw new Error("Socket has not been initialized");
      }

      return sockets[state.socketId];
    },
  },
});

export const { initializeSocket } = rbtvSocketApiSlice.actions;
export const { selectSocket } = rbtvSocketApiSlice.selectors;
