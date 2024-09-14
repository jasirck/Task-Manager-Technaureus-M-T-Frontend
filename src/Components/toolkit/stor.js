import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../toolkit/Slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
