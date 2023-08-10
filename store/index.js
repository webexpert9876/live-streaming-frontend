import { configureStore } from '@reduxjs/toolkit';
import { createWrapper } from 'next-redux-wrapper';
import { authSlice } from './slices/authSlice';
import { commentSlice } from './slices/commentSlice';
import { routeSlice } from './slices/routeSlice';

const makeStore = () =>
  configureStore({
    reducer: {
      [authSlice.name]: authSlice.reducer,
      [commentSlice.name]: commentSlice.reducer,
      [routeSlice.name]: routeSlice.reducer,
    },
    devTools: true,
  });

export const wrapper = createWrapper(makeStore);