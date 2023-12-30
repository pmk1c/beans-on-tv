import {nanoid} from '@reduxjs/toolkit';
import {createSliceWithThunks} from '../redux/createSliceWithThunks';
import RBTVSocket from './RBTVSocket';
import {rbtvApi} from '.';

const sockets: Record<string, RBTVSocket> = {};

export const rbtvSocketApiSlice = createSliceWithThunks({
  name: 'rbtvSocketApi',
  initialState: {
    socketId: undefined as string | undefined,
  },
  reducers: create => ({
    initializeSocket: create.asyncThunk<undefined>(async (_, {dispatch}) => {
      const socketId = nanoid();
      const {
        data: {websocket},
      } = await dispatch(rbtvApi.endpoints.getFrontendInit.initiate()).unwrap();
      sockets[socketId] = new RBTVSocket(websocket.url, websocket.path);
    }),
  }),
});

export const {initializeSocket} = rbtvSocketApiSlice.actions;
